import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { UnauthorizedError } from '../utils/errors.js';

export interface AuthUser {
  id: string;
  email: string;
  role: 'customer' | 'staff' | 'manager' | 'admin';
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

/**
 * Middleware to authenticate requests using JWT access tokens.
 * Expects the token in the Authorization header: `Bearer <token>`
 */
export function authenticate(
  req: Request,
  _res: Response,
  next: NextFunction
): void {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('Authentication token is missing');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new UnauthorizedError('Malformed authentication token');
    }

    try {
      const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET) as AuthUser;
      req.user = decoded;
      next();
    } catch (err) {
      if (err instanceof jwt.TokenExpiredError) {
        throw new UnauthorizedError('Authentication token has expired');
      }
      throw new UnauthorizedError('Invalid authentication token');
    }
  } catch (error) {
    next(error);
  }
}

/**
 * Optional authentication middleware.
 * Verifies the token if present, but does not throw an error if missing.
 */
export function optionalAuth(
  req: Request,
  _res: Response,
  next: NextFunction
): void {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      if (token) {
        try {
          const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET) as AuthUser;
          req.user = decoded;
        } catch {
          // Ignore errors for optional auth, just proceed without req.user
        }
      }
    }
    next();
  } catch (error) {
    next(error);
  }
}
