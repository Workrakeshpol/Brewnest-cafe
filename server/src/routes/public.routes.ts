import { Router } from 'express';

import * as publicController from '../controllers/public.controller.js';
import { validate } from '../middleware/validate.middleware.js';
import { authenticate, optionalAuth } from '../middleware/auth.middleware.js';
import {
  validatePromoSchema,
  createContactMessageSchema,
  subscribeNewsletterSchema,
} from '../controllers/public.controller.js';

const router = Router();

// Loyalty (authenticated)
router.get('/loyalty/account', authenticate, publicController.getLoyaltyAccount);

// Promos
router.post('/promos/validate', validate(validatePromoSchema), publicController.validatePromo);

// Contact messages
router.post('/contact', optionalAuth, validate(createContactMessageSchema), publicController.submitContact);

// Newsletter subscription
router.post('/newsletter/subscribe', validate(subscribeNewsletterSchema), publicController.subscribeNewsletter);

// Daily Special & Special Offers
router.get('/daily-special', publicController.getDailySpecial);
router.get('/offers', publicController.getSpecialOffers);

// Blog
router.get('/blog/posts', publicController.getBlogPosts);
router.get('/blog/posts/:slug', publicController.getBlogPost);

// Testimonials & Gallery
router.get('/testimonials', publicController.getTestimonials);
router.get('/gallery', publicController.getGallery);

// Settings
router.get('/settings/public', publicController.getSettings);

export default router;
