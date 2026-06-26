import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

import { prisma } from '../config/database.js';
import { ConflictError, NotFoundError, UnauthorizedError, ValidationError } from '../utils/errors.js';
import { successResponse } from '../utils/response.js';
import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';

// --- Zod Validation Schemas ---

export const registerSchema = z.object({
  email: z.string().email('Invalid email address').max(255),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
  firstName: z.string().min(1, 'First name is required').max(100),
  lastName: z.string().max(100).optional(),
  phone: z.string().max(20).optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters long'),
});

// --- Helper Functions for JWT ---

interface TokenPayload {
  id: string;
  email: string;
  role: string;
}

function generateAccessToken(user: TokenPayload): string {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    env.JWT_ACCESS_SECRET,
    { expiresIn: env.JWT_ACCESS_EXPIRY as any }
  );
}

function generateRefreshToken(user: TokenPayload): string {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    env.JWT_REFRESH_SECRET,
    { expiresIn: env.JWT_REFRESH_EXPIRY as any }
  );
}

// --- Controller Methods ---

/**
 * Register a new user and initialize their loyalty account.
 */
export async function register(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { email, password, firstName, lastName, phone } = req.body;

    // 1. Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictError('A user with this email address already exists');
    }

    // 2. Hash password
    const passwordHash = await bcrypt.hash(password, env.BCRYPT_ROUNDS);

    // 3. Insert user into DB
    const newUser = await prisma.user.create({
      data: {
        email,
        passwordHash,
        firstName,
        lastName: lastName || null,
        phone: phone || null,
        role: 'customer',
        emailVerified: false,
        isActive: true,
      },
    });

    // 4. Initialize loyalty account for the customer
    try {
      // Find the Bronze tier
      const bronzeTier = await prisma.loyaltyTier.findUnique({
        where: { name: 'Bronze' },
      });

      const referralCode = `BN_${newUser.id.substring(0, 8).toUpperCase()}`;

      await prisma.loyaltyAccount.create({
        data: {
          userId: newUser.id,
          tierId: bronzeTier?.id || null,
          totalPoints: 0,
          availablePoints: 0,
          lifetimePoints: 0,
          referralCode,
        },
      });
    } catch (loyaltyError) {
      // Log error but don't fail registration
      logger.error('Failed to initialize loyalty account for new user', loyaltyError);
    }

    // 5. Generate tokens
    const payload = { id: newUser.id, email: newUser.email, role: newUser.role };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    // Set refresh token in cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Remove password hash from response
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash: _, ...userWithoutPassword } = newUser;

    successResponse(res, {
      user: userWithoutPassword,
      accessToken,
    }, 201);
  } catch (error) {
    next(error);
  }
}

/**
 * Log in an existing user.
 */
export async function login(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { email, password } = req.body;

    // 1. Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedError('Invalid email or password');
    }

    // 2. Verify password (if local user)
    if (!user.passwordHash) {
      throw new UnauthorizedError('Please log in using your social provider');
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedError('Invalid email or password');
    }

    // 3. Update last login timestamp
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    // 4. Generate tokens
    const payload = { id: user.id, email: user.email, role: user.role };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    // Set refresh token in cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Remove password hash from response
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash: _, ...userWithoutPassword } = user;

    successResponse(res, {
      user: userWithoutPassword,
      accessToken,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Refresh the JWT access token using the refresh token from cookie.
 */
export async function refreshToken(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const token = req.cookies['refreshToken'] || req.body.refreshToken;
    if (!token) {
      throw new UnauthorizedError('Refresh token is missing');
    }

    try {
      const decoded = jwt.verify(token, env.JWT_REFRESH_SECRET) as TokenPayload;

      // Verify user is still active in DB
      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
      });

      if (!user || !user.isActive) {
        throw new UnauthorizedError('User account is inactive or not found');
      }

      // Generate new tokens (Refresh Token Rotation)
      const payload = { id: user.id, email: user.email, role: user.role };
      const newAccessToken = generateAccessToken(payload);
      const newRefreshToken = generateRefreshToken(payload);

      // Set new refresh token in cookie
      res.cookie('refreshToken', newRefreshToken, {
        httpOnly: true,
        secure: env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      successResponse(res, {
        accessToken: newAccessToken,
      });
    } catch (err) {
      throw new UnauthorizedError('Invalid or expired refresh token');
    }
  } catch (error) {
    next(error);
  }
}

/**
 * Log out user by clearing the refresh token cookie.
 */
export async function logout(
  _req: Request,
  res: Response,
  _next: NextFunction
): Promise<void> {
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'strict',
  });
  successResponse(res, { message: 'Logged out successfully' });
}

/**
 * Get current authenticated user details.
 */
export async function getMe(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      throw new UnauthorizedError('Not authenticated');
    }

    // Fetch fresh user data from DB along with loyalty details
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    const loyaltyAccount = await prisma.loyaltyAccount.findUnique({
      where: { userId: user.id },
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash: _, ...userWithoutPassword } = user;

    successResponse(res, {
      ...userWithoutPassword,
      loyalty: loyaltyAccount || null,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Request password reset (Forgot Password).
 * In local dev, we log the reset link to the console and return it in response.
 */
export async function forgotPassword(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { email } = req.body;
    if (!email) {
      throw new ValidationError('Email is required');
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Return 200 success response even if email doesn't exist for security (prevent email enumeration)
      successResponse(res, { message: 'If the email exists, a password reset link has been sent' });
      return;
    }

    // Generate a temporary reset token (valid for 1 hour)
    const resetToken = jwt.sign(
      { id: user.id, email: user.email },
      env.JWT_REFRESH_SECRET, // using refresh secret for convenience
      { expiresIn: '1h' }
    );

    const resetLink = `${env.CORS_ORIGIN}/reset-password?token=${resetToken}`;
    logger.info(`🔑 Password reset requested for ${email}. Reset Link: ${resetLink}`);

    successResponse(res, {
      message: 'If the email exists, a password reset link has been sent',
      // In development, return the token/link directly to make testing easier
      ...(env.NODE_ENV === 'development' && { devResetLink: resetLink }),
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Reset password with valid token.
 */
export async function resetPassword(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { token, newPassword } = req.body;

    try {
      const decoded = jwt.verify(token, env.JWT_REFRESH_SECRET) as { id: string; email: string };

      // Hash new password
      const passwordHash = await bcrypt.hash(newPassword, env.BCRYPT_ROUNDS);

      // Update password in DB
      await prisma.user.update({
        where: { id: decoded.id },
        data: { passwordHash },
      });

      successResponse(res, { message: 'Password reset successful. You can now log in with your new password.' });
    } catch (err) {
      throw new ValidationError('Invalid or expired reset token');
    }
  } catch (error) {
    next(error);
  }
}

/**
 * Verify user email.
 */
export async function verifyEmail(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { token } = req.body;
    if (!token) {
      throw new ValidationError('Verification token is required');
    }

    try {
      const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET) as { id: string };

      await prisma.user.update({
        where: { id: decoded.id },
        data: { emailVerified: true },
      });

      successResponse(res, { message: 'Email verified successfully!' });
    } catch (err) {
      throw new ValidationError('Invalid or expired verification token');
    }
  } catch (error) {
    next(error);
  }
}
