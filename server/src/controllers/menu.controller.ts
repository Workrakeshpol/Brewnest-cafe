import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

import { prisma } from '../config/database.js';
import { NotFoundError, ValidationError } from '../utils/errors.js';
import { successResponse, paginatedResponse } from '../utils/response.js';
import { getCache, setCache, invalidateCache, invalidatePrefix } from '../utils/cache.js';

// --- Zod Validation Schemas ---

export const createCategorySchema = z.object({
  name: z.string().min(1, 'Category name is required').max(100),
  slug: z.string().min(1, 'Slug is required').max(100),
  description: z.string().optional(),
  sortOrder: z.number().int().optional().default(0),
});

export const createMenuItemSchema = z.object({
  categoryId: z.string().uuid('Invalid category ID'),
  name: z.string().min(1, 'Item name is required').max(200),
  slug: z.string().min(1, 'Slug is required').max(200),
  description: z.string().optional(),
  basePrice: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Invalid price format'),
  imageUrl: z.string().optional(),
  isSignature: z.boolean().optional().default(false),
  isPopular: z.boolean().optional().default(false),
  isSeasonal: z.boolean().optional().default(false),
  seasonStart: z.string().optional().nullable(),
  seasonEnd: z.string().optional().nullable(),
  preparationTimeMin: z.number().int().positive().optional().default(5),
  calories: z.number().int().positive().optional().nullable(),
  sortOrder: z.number().int().optional().default(0),
  variants: z
    .array(
      z.object({
        variantType: z.string(),
        name: z.string(),
        priceDelta: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Invalid delta price format').optional().default('0.00'),
        isDefault: z.boolean().optional().default(false),
        isAvailable: z.boolean().optional().default(true),
      })
    )
    .optional(),
  tags: z.array(z.string()).optional(),
});

// --- Controller Methods ---

/**
 * List all active categories.
 */
export async function getCategories(
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const cacheKey = 'categories:active';
    const cached = await getCache<any[]>(cacheKey);
    if (cached) {
      successResponse(res, cached);
      return;
    }

    const categories = await prisma.category.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    });

    await setCache(cacheKey, categories, 3600);
    successResponse(res, categories);
  } catch (error) {
    next(error);
  }
}

/**
 * Create a new category (Manager+).
 */
export async function createCategory(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const data = req.body;
    
    // Check if slug/name already exists
    const existing = await prisma.category.findFirst({
      where: {
        OR: [
          { slug: data.slug },
          { name: data.name },
        ],
      },
    });

    if (existing) {
      throw new ValidationError('Category name or slug already exists');
    }

    const newCategory = await prisma.category.create({
      data,
    });

    await invalidateCache('categories:active');

    successResponse(res, newCategory, 201);
  } catch (error) {
    next(error);
  }
}

/**
 * List menu items with filtering, search, and pagination.
 */
export async function getMenuItems(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const categoryQuery = typeof req.query.category === 'string' ? req.query.category : undefined;
    const searchQuery = typeof req.query.search === 'string' ? req.query.search : undefined;
    const page = parseInt(req.query.page as string || '1');
    const limit = parseInt(req.query.limit as string || '20');
    const offset = (page - 1) * limit;

    const cacheKey = `menu:items:${categoryQuery || 'all'}:${searchQuery || 'none'}:${page}:${limit}`;
    const cached = await getCache<any>(cacheKey);
    if (cached) {
      paginatedResponse(res, cached.items, cached.total, page, limit);
      return;
    }

    // Build query conditions
    const where: any = {
      isAvailable: true,
    };

    if (categoryQuery) {
      where.category = {
        OR: [
          { id: categoryQuery },
          { slug: categoryQuery },
        ],
      };
    }

    if (searchQuery) {
      where.OR = [
        { name: { contains: searchQuery, mode: 'insensitive' } },
        { description: { contains: searchQuery, mode: 'insensitive' } },
      ];
    }

    // 1. Fetch total count & items in parallel transaction
    const [total, items] = await prisma.$transaction([
      prisma.menuItem.count({ where }),
      prisma.menuItem.findMany({
        where,
        include: {
          category: true,
          variants: {
            where: { isAvailable: true },
            orderBy: { sortOrder: 'asc' },
          },
          tags: true,
        },
        orderBy: [
          { sortOrder: 'asc' },
          { name: 'asc' },
        ],
        skip: offset,
        take: limit,
      }),
    ]);

    const itemsWithDetails = items.map(item => ({
      id: item.id,
      categoryId: item.categoryId,
      name: item.name,
      slug: item.slug,
      description: item.description,
      basePrice: item.basePrice.toString(),
      imageUrl: item.imageUrl,
      rating: item.rating ? item.rating.toString() : '0.0',
      reviewCount: item.reviewCount,
      isSignature: item.isSignature,
      isPopular: item.isPopular,
      isAvailable: item.isAvailable,
      isSeasonal: item.isSeasonal,
      seasonStart: item.seasonStart,
      seasonEnd: item.seasonEnd,
      preparationTimeMin: item.preparationTimeMin,
      calories: item.calories,
      sortOrder: item.sortOrder,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      categoryName: item.category.name,
      categorySlug: item.category.slug,
      variants: item.variants.map(v => ({
        ...v,
        priceDelta: v.priceDelta.toString(),
      })),
      tags: item.tags.map(t => t.tag),
    }));

    await setCache(cacheKey, { items: itemsWithDetails, total }, 1800);

    paginatedResponse(res, itemsWithDetails, total, page, limit);
  } catch (error) {
    next(error);
  }
}

/**
 * Get a single menu item by ID or slug.
 */
export async function getMenuItem(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const idOrSlug = req.params.idOrSlug as string;
    if (!idOrSlug) {
      throw new ValidationError('Menu item ID or slug is required');
    }

    const cacheKey = `menu:item:${idOrSlug}`;
    const cached = await getCache<any>(cacheKey);
    if (cached) {
      successResponse(res, cached);
      return;
    }

    const isUuid = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(idOrSlug);

    const item = await prisma.menuItem.findFirst({
      where: isUuid ? { id: idOrSlug } : { slug: idOrSlug },
      include: {
        category: true,
        variants: {
          orderBy: { sortOrder: 'asc' },
        },
        tags: true,
      },
    });

    if (!item) {
      throw new NotFoundError('Menu item not found');
    }

    const formattedItem = {
      id: item.id,
      categoryId: item.categoryId,
      name: item.name,
      slug: item.slug,
      description: item.description,
      basePrice: item.basePrice.toString(),
      imageUrl: item.imageUrl,
      rating: item.rating ? item.rating.toString() : '0.0',
      reviewCount: item.reviewCount,
      isSignature: item.isSignature,
      isPopular: item.isPopular,
      isAvailable: item.isAvailable,
      isSeasonal: item.isSeasonal,
      seasonStart: item.seasonStart,
      seasonEnd: item.seasonEnd,
      preparationTimeMin: item.preparationTimeMin,
      calories: item.calories,
      sortOrder: item.sortOrder,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      categoryName: item.category.name,
      categorySlug: item.category.slug,
      variants: item.variants.map(v => ({
        ...v,
        priceDelta: v.priceDelta.toString(),
      })),
      tags: item.tags.map(t => t.tag),
    };

    await setCache(cacheKey, formattedItem, 1800);

    successResponse(res, formattedItem);
  } catch (error) {
    next(error);
  }
}

/**
 * Create a new menu item along with variants and tags (Manager+).
 */
export async function createMenuItem(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { variants, tags, ...itemData } = req.body;

    // Check slug uniqueness
    const existing = await prisma.menuItem.findUnique({
      where: { slug: itemData.slug },
    });

    if (existing) {
      throw new ValidationError('Menu item slug already exists');
    }

    const newItem = await prisma.menuItem.create({
      data: {
        ...itemData,
        variants: variants && variants.length > 0 ? {
          create: variants,
        } : undefined,
        tags: tags && tags.length > 0 ? {
          create: tags.map((tag: string) => ({ tag })),
        } : undefined,
      },
    });

    await invalidatePrefix('menu:items:*');

    req.params.idOrSlug = newItem.id;
    return getMenuItem(req, res, next);
  } catch (error) {
    next(error);
  }
}

/**
 * Update an existing menu item (Manager+).
 */
export async function updateMenuItem(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = req.params.id as string;
    if (!id) {
      throw new ValidationError('Menu item ID is required');
    }

    const { variants, tags, ...itemData } = req.body;

    // Check item exists
    const existing = await prisma.menuItem.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundError('Menu item not found');
    }

    await prisma.$transaction(async (tx) => {
      // 1. Update base details
      await tx.menuItem.update({
        where: { id },
        data: { ...itemData, updatedAt: new Date() },
      });

      // 2. If variants list is provided, delete existing and re-insert
      if (variants !== undefined) {
        await tx.itemVariant.deleteMany({ where: { itemId: id } });
        if (variants.length > 0) {
          await tx.itemVariant.createMany({
            data: variants.map((v: any) => ({
              itemId: id,
              ...v,
            })),
          });
        }
      }

      // 3. If tags list is provided, delete existing and re-insert
      if (tags !== undefined) {
        await tx.itemTag.deleteMany({ where: { itemId: id } });
        if (tags.length > 0) {
          await tx.itemTag.createMany({
            data: tags.map((tag: string) => ({
              itemId: id,
              tag,
            })),
          });
        }
      }
    });

    // Invalidate caches
    await invalidatePrefix('menu:items:*');
    await invalidateCache(`menu:item:${id}`);
    if (existing.slug) {
      await invalidateCache(`menu:item:${existing.slug}`);
    }

    req.params.idOrSlug = id;
    return getMenuItem(req, res, next);
  } catch (error) {
    next(error);
  }
}

/**
 * Toggle availability (Staff+).
 */
export async function toggleAvailability(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = req.params.id as string;
    if (!id) {
      throw new ValidationError('Menu item ID is required');
    }

    const item = await prisma.menuItem.findUnique({
      where: { id },
    });

    if (!item) {
      throw new NotFoundError('Menu item not found');
    }

    const updated = await prisma.menuItem.update({
      where: { id },
      data: { isAvailable: !item.isAvailable, updatedAt: new Date() },
    });

    // Invalidate caches
    await invalidatePrefix('menu:items:*');
    await invalidateCache(`menu:item:${id}`);
    if (item.slug) {
      await invalidateCache(`menu:item:${item.slug}`);
    }

    successResponse(res, updated);
  } catch (error) {
    next(error);
  }
}

/**
 * Soft-delete a menu item by setting isAvailable = false (Manager+).
 */
export async function deleteMenuItem(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = req.params.id as string;
    if (!id) {
      throw new ValidationError('Menu item ID is required');
    }

    const item = await prisma.menuItem.findUnique({
      where: { id },
    });

    if (!item) {
      throw new NotFoundError('Menu item not found');
    }

    await prisma.menuItem.update({
      where: { id },
      data: { isAvailable: false, updatedAt: new Date() },
    });

    // Invalidate caches
    await invalidatePrefix('menu:items:*');
    await invalidateCache(`menu:item:${id}`);
    if (item.slug) {
      await invalidateCache(`menu:item:${item.slug}`);
    }

    successResponse(res, { message: 'Menu item soft-deleted successfully' });
  } catch (error) {
    next(error);
  }
}
