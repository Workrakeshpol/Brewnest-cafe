import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

import { prisma } from '../config/database.js';
import { NotFoundError, ValidationError } from '../utils/errors.js';
import { successResponse } from '../utils/response.js';

// --- Zod Validation Schemas ---

export const addToCartSchema = z.object({
  menuItemId: z.string().uuid('Invalid menu item ID'),
  quantity: z.number().int().positive('Quantity must be greater than 0').optional().default(1),
  variantSelections: z.array(z.any()).optional().default([]),
  specialNote: z.string().optional().nullable(),
});

export const updateCartItemSchema = z.object({
  quantity: z.number().int().positive('Quantity must be greater than 0'),
});

// --- Helper to get or create cart ---

async function getOrCreateCartId(userId: string): Promise<string> {
  const existingCart = await prisma.cart.findUnique({
    where: { userId },
  });

  if (existingCart) {
    return existingCart.id;
  }

  const newCart = await prisma.cart.create({
    data: { userId },
  });

  return newCart.id;
}

// --- Controller Methods ---

/**
 * Retrieve user's cart along with item details.
 */
export async function getCart(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new ValidationError('Authentication required');
    }

    const cartId = await getOrCreateCartId(userId);

    // Fetch all items in cart joined with menuItem details
    const items = await prisma.cartItem.findMany({
      where: { cartId },
      include: {
        menuItem: true,
      },
      orderBy: { createdAt: 'asc' },
    });

    const formattedItems = items.map(item => ({
      id: item.id,
      menuItemId: item.menuItemId,
      quantity: item.quantity,
      variantSelections: item.variantSelections,
      specialNote: item.specialNote,
      createdAt: item.createdAt,
      name: item.menuItem.name,
      slug: item.menuItem.slug,
      basePrice: item.menuItem.basePrice.toString(),
      imageUrl: item.menuItem.imageUrl,
      isAvailable: item.menuItem.isAvailable,
    }));

    successResponse(res, {
      cartId,
      items: formattedItems,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Add a menu item to the cart. If already exists, increments quantity.
 */
export async function addToCart(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new ValidationError('Authentication required');
    }

    const { menuItemId, quantity, variantSelections, specialNote } = req.body;

    // Check if menu item exists and is available
    const menuItem = await prisma.menuItem.findUnique({
      where: { id: menuItemId },
    });

    if (!menuItem || !menuItem.isAvailable) {
      throw new NotFoundError('Menu item is unavailable or does not exist');
    }

    const cartId = await getOrCreateCartId(userId);

    // Check if item already exists in the cart (same menuItemId)
    const existingCartItem = await prisma.cartItem.findUnique({
      where: {
        cartId_menuItemId: {
          cartId,
          menuItemId,
        },
      },
    });

    let resultItem;

    if (existingCartItem) {
      resultItem = await prisma.cartItem.update({
        where: { id: existingCartItem.id },
        data: {
          quantity: existingCartItem.quantity + quantity,
          variantSelections: variantSelections || existingCartItem.variantSelections,
          specialNote: specialNote !== undefined ? specialNote : existingCartItem.specialNote,
        },
      });
    } else {
      resultItem = await prisma.cartItem.create({
        data: {
          cartId,
          menuItemId,
          quantity,
          variantSelections: variantSelections || [],
          specialNote: specialNote || null,
        },
      });
    }

    successResponse(res, resultItem, 201);
  } catch (error) {
    next(error);
  }
}

/**
 * Update the quantity of a cart item.
 */
export async function updateCartItem(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new ValidationError('Authentication required');
    }

    const { id } = req.params;
    const { quantity } = req.body;

    const cartId = await getOrCreateCartId(userId);

    // Make sure item belongs to user's cart
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        id: id as string,
        cartId,
      },
    });

    if (!existingItem) {
      throw new NotFoundError('Cart item not found');
    }

    const updated = await prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity },
    });

    successResponse(res, updated);
  } catch (error) {
    next(error);
  }
}

/**
 * Remove an item from the cart.
 */
export async function removeFromCart(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new ValidationError('Authentication required');
    }

    const { id } = req.params;
    const cartId = await getOrCreateCartId(userId);

    const existingItem = await prisma.cartItem.findFirst({
      where: {
        id: id as string,
        cartId,
      },
    });

    if (!existingItem) {
      throw new NotFoundError('Cart item not found');
    }

    await prisma.cartItem.delete({
      where: { id: existingItem.id },
    });

    successResponse(res, { message: 'Item removed from cart successfully' });
  } catch (error) {
    next(error);
  }
}

/**
 * Clear all items from the cart.
 */
export async function clearCart(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new ValidationError('Authentication required');
    }

    const cartId = await getOrCreateCartId(userId);

    await prisma.cartItem.deleteMany({
      where: { cartId },
    });

    successResponse(res, { message: 'Cart cleared successfully' });
  } catch (error) {
    next(error);
  }
}
