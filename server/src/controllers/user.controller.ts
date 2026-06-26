import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

import { prisma } from '../config/database.js';
import { NotFoundError, ValidationError } from '../utils/errors.js';
import { successResponse } from '../utils/response.js';

// --- Zod Validation Schemas ---

export const updateProfileSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(100).optional(),
  lastName: z.string().max(100).optional().nullable(),
  phone: z.string().max(20).optional().nullable(),
  avatarUrl: z.string().optional().nullable(),
});

export const createAddressSchema = z.object({
  label: z.string().max(50).optional().default('Home'),
  street: z.string().min(1, 'Street is required').max(255),
  city: z.string().min(1, 'City is required').max(100),
  state: z.string().max(100).optional().nullable(),
  zipCode: z.string().max(20).optional().nullable(),
  country: z.string().max(100).optional().default('US'),
  isDefault: z.boolean().optional().default(false),
});

// --- Profile Controller ---

export async function updateProfile(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new ValidationError('Authentication required');
    }

    // Validate and whitelist fields using Zod schema
    const validatedData = updateProfileSchema.parse(req.body);

    const updated = await prisma.user.update({
      where: { id: userId },
      data: {
        ...validatedData,
        updatedAt: new Date(),
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash: _, ...userWithoutPassword } = updated;

    successResponse(res, userWithoutPassword);
  } catch (error) {
    next(error);
  }
}

// --- Favorites Controller ---

export async function getFavorites(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new ValidationError('Authentication required');
    }

    const favorites = await prisma.favorite.findMany({
      where: { userId },
      include: {
        menuItem: true,
      },
    });

    const formattedFavorites = favorites.map(fav => ({
      id: fav.id,
      itemId: fav.itemId,
      createdAt: fav.createdAt,
      name: fav.menuItem.name,
      slug: fav.menuItem.slug,
      basePrice: fav.menuItem.basePrice,
      imageUrl: fav.menuItem.imageUrl,
    }));

    successResponse(res, formattedFavorites);
  } catch (error) {
    next(error);
  }
}

export async function toggleFavorite(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.user?.id;
    const { itemId } = req.params;

    if (!userId) {
      throw new ValidationError('Authentication required');
    }

    // Check if item exists
    const item = await prisma.menuItem.findUnique({
      where: { id: itemId as string },
    });

    if (!item) {
      throw new NotFoundError('Menu item not found');
    }

    // Check if already favorited
    const existing = await prisma.favorite.findUnique({
      where: {
        userId_itemId: {
          userId,
          itemId: itemId as string,
        },
      },
    });

    if (existing) {
      // Remove favorite
      await prisma.favorite.delete({
        where: { id: existing.id },
      });
      successResponse(res, { favorited: false, message: 'Removed from favorites' });
    } else {
      // Add favorite
      await prisma.favorite.create({
        data: {
          userId,
          itemId: itemId as string,
        },
      });
      successResponse(res, { favorited: true, message: 'Added to favorites' }, 201);
    }
  } catch (error) {
    next(error);
  }
}

// --- Addresses Controller ---

export async function getAddresses(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new ValidationError('Authentication required');
    }

    const addresses = await prisma.address.findMany({
      where: { userId },
      orderBy: { isDefault: 'desc' },
    });

    successResponse(res, addresses);
  } catch (error) {
    next(error);
  }
}

export async function createAddress(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new ValidationError('Authentication required');
    }

    const data = req.body;

    // Wrap in transaction so if isDefault = true, we set other default addresses to false
    const address = await prisma.$transaction(async (tx) => {
      if (data.isDefault) {
        await tx.address.updateMany({
          where: { userId },
          data: { isDefault: false },
        });
      }

      return tx.address.create({
        data: {
          userId,
          ...data,
        },
      });
    });

    successResponse(res, address, 201);
  } catch (error) {
    next(error);
  }
}

export async function updateAddress(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.user?.id;
    const { id } = req.params;
    if (!userId) {
      throw new ValidationError('Authentication required');
    }

    const data = req.body;

    const existing = await prisma.address.findFirst({
      where: {
        id: id as string,
        userId,
      },
    });

    if (!existing) {
      throw new NotFoundError('Address not found');
    }

    const address = await prisma.$transaction(async (tx) => {
      if (data.isDefault && !existing.isDefault) {
        await tx.address.updateMany({
          where: { userId },
          data: { isDefault: false },
        });
      }

      return tx.address.update({
        where: { id: existing.id },
        data,
      });
    });

    successResponse(res, address);
  } catch (error) {
    next(error);
  }
}

export async function deleteAddress(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.user?.id;
    const { id } = req.params;
    if (!userId) {
      throw new ValidationError('Authentication required');
    }

    const existing = await prisma.address.findFirst({
      where: {
        id: id as string,
        userId,
      },
    });

    if (!existing) {
      throw new NotFoundError('Address not found');
    }

    await prisma.address.delete({
      where: { id: existing.id },
    });

    successResponse(res, { message: 'Address deleted successfully' });
  } catch (error) {
    next(error);
  }
}
