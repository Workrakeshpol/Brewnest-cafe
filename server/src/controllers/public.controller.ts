import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

import { prisma } from '../config/database.js';
import { NotFoundError, ValidationError } from '../utils/errors.js';
import { successResponse } from '../utils/response.js';

// --- Zod Validation Schemas ---

export const validatePromoSchema = z.object({
  code: z.string().min(1, 'Promo code is required'),
  subtotal: z.number().positive('Subtotal must be positive'),
});

export const createContactMessageSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200),
  email: z.string().email('Invalid email address'),
  subject: z.string().max(300).optional().nullable(),
  message: z.string().min(1, 'Message is required'),
});

export const subscribeNewsletterSchema = z.object({
  email: z.string().email('Invalid email address'),
});

// --- Controller Methods ---

/**
 * Get current user's loyalty account details with tier details and perks.
 */
export async function getLoyaltyAccount(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new ValidationError('Authentication required');
    }

    const account = await prisma.loyaltyAccount.findUnique({
      where: { userId },
      include: {
        tier: true,
      },
    });

    if (!account) {
      throw new NotFoundError('Loyalty account not found');
    }

    successResponse(res, {
      id: account.id,
      userId: account.userId,
      totalPoints: account.totalPoints,
      availablePoints: account.availablePoints,
      lifetimePoints: account.lifetimePoints,
      referralCode: account.referralCode,
      tierName: account.tier?.name ?? null,
      pointsMultiplier: account.tier?.pointsMultiplier ? account.tier.pointsMultiplier.toString() : '1.00',
      perks: account.tier?.perks ?? [],
      badgeImageUrl: account.tier?.badgeImageUrl ?? null,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Validate a promo code.
 */
export async function validatePromo(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { code, subtotal } = req.body;

    const promo = await prisma.promoCode.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (!promo || !promo.isActive) {
      throw new ValidationError('Invalid or inactive promo code');
    }

    const now = new Date();
    if (now < new Date(promo.validFrom) || now > new Date(promo.validUntil)) {
      throw new ValidationError('Promo code is expired or not active yet');
    }

    const currentUses = promo.currentUses ?? 0;
    if (promo.maxUses && currentUses >= promo.maxUses) {
      throw new ValidationError('Promo code usage limit has been reached');
    }

    if (promo.minOrderAmount && subtotal < parseFloat(promo.minOrderAmount.toString())) {
      throw new ValidationError(`Minimum order amount of $${promo.minOrderAmount} required for this code`);
    }

    successResponse(res, {
      code: promo.code,
      discountType: promo.discountType,
      discountValue: promo.discountValue.toString(),
      maxDiscountAmount: promo.maxDiscountAmount ? promo.maxDiscountAmount.toString() : null,
      description: promo.description,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Submit contact form.
 */
export async function submitContact(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.user?.id || null;
    const data = req.body;

    const message = await prisma.contactMessage.create({
      data: {
        userId,
        ...data,
      },
    });

    successResponse(res, {
      message: 'Contact message submitted successfully',
      id: message.id,
    }, 201);
  } catch (error) {
    next(error);
  }
}

/**
 * Subscribe to newsletter.
 */
export async function subscribeNewsletter(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { email } = req.body;

    // Check if already subscribed
    const existing = await prisma.newsletterSubscriber.findUnique({
      where: { email },
    });

    if (existing) {
      if (existing.isActive) {
        successResponse(res, { message: 'You are already subscribed to our newsletter' });
        return;
      } else {
        // Re-activate subscription
        await prisma.newsletterSubscriber.update({
          where: { id: existing.id },
          data: { isActive: true, unsubscribedAt: null },
        });
        successResponse(res, { message: 'Re-subscribed to newsletter successfully' });
        return;
      }
    }

    await prisma.newsletterSubscriber.create({
      data: { email },
    });
    successResponse(res, { message: 'Subscribed to newsletter successfully!' }, 201);
  } catch (error) {
    next(error);
  }
}

/**
 * Get active daily special.
 */
export async function getDailySpecial(
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    // Start of today (since activeDate matches the date without time component)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const special = await prisma.dailySpecial.findFirst({
      where: {
        activeDate: today,
        isActive: true,
      },
      include: {
        menuItem: true,
      },
    });

    if (!special) {
      // Fallback: get the latest active daily special if none matches today exactly
      const fallbackSpecial = await prisma.dailySpecial.findFirst({
        where: { isActive: true },
        include: { menuItem: true },
        orderBy: { activeDate: 'desc' },
      });

      if (fallbackSpecial) {
        successResponse(res, {
          id: fallbackSpecial.id,
          specialPrice: fallbackSpecial.specialPrice.toString(),
          tagline: fallbackSpecial.tagline,
          activeDate: fallbackSpecial.activeDate,
          name: fallbackSpecial.menuItem.name,
          slug: fallbackSpecial.menuItem.slug,
          description: fallbackSpecial.menuItem.description,
          basePrice: fallbackSpecial.menuItem.basePrice.toString(),
          imageUrl: fallbackSpecial.menuItem.imageUrl,
          rating: fallbackSpecial.menuItem.rating ? fallbackSpecial.menuItem.rating.toString() : '0.0',
        });
        return;
      }

      successResponse(res, null);
      return;
    }

    successResponse(res, {
      id: special.id,
      specialPrice: special.specialPrice.toString(),
      tagline: special.tagline,
      activeDate: special.activeDate,
      name: special.menuItem.name,
      slug: special.menuItem.slug,
      description: special.menuItem.description,
      basePrice: special.menuItem.basePrice.toString(),
      imageUrl: special.menuItem.imageUrl,
      rating: special.menuItem.rating ? special.menuItem.rating.toString() : '0.0',
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get active special offers.
 */
export async function getSpecialOffers(
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const now = new Date();

    const offers = await prisma.specialOffer.findMany({
      where: {
        isActive: true,
        startAt: { lte: now },
        endAt: { gte: now },
      },
    });

    successResponse(res, offers);
  } catch (error) {
    next(error);
  }
}

/**
 * List blog posts.
 */
export async function getBlogPosts(
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const posts = await prisma.blogPost.findMany({
      where: { isPublished: true },
      orderBy: { publishedAt: 'desc' },
    });

    successResponse(res, posts);
  } catch (error) {
    next(error);
  }
}

/**
 * Get single blog post by slug.
 */
export async function getBlogPost(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { slug } = req.params;

    const post = await prisma.blogPost.findFirst({
      where: {
        slug: slug as string,
        isPublished: true,
      },
    });

    if (!post) {
      throw new NotFoundError('Blog post not found');
    }

    successResponse(res, post);
  } catch (error) {
    next(error);
  }
}

/**
 * Get testimonials.
 */
export async function getTestimonials(
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const testimonials = await prisma.testimonial.findMany({
      where: { isApproved: true },
      orderBy: { createdAt: 'desc' },
    });

    const formatted = testimonials.map(t => ({
      ...t,
      rating: t.rating.toString(),
    }));

    successResponse(res, formatted);
  } catch (error) {
    next(error);
  }
}

/**
 * Get gallery images.
 */
export async function getGallery(
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const images = await prisma.galleryImage.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    });

    successResponse(res, images);
  } catch (error) {
    next(error);
  }
}

/**
 * Get public site settings.
 */
export async function getSettings(
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const settings = await prisma.siteSetting.findMany();

    // Map settings key-value rows to a single public config object
    const configMap: Record<string, any> = {};
    settings.forEach(row => {
      configMap[row.key] = row.value;
    });

    successResponse(res, configMap);
  } catch (error) {
    next(error);
  }
}
