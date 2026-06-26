import { Router } from 'express';

import * as menuController from '../controllers/menu.controller.js';
import { validate } from '../middleware/validate.middleware.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/rbac.middleware.js';
import { createCategorySchema, createMenuItemSchema } from '../controllers/menu.controller.js';

const router = Router();

// Public routes
router.get('/categories', menuController.getCategories);
router.get('/items', menuController.getMenuItems);
router.get('/items/:idOrSlug', menuController.getMenuItem);

// Protected routes (Staff / Manager / Admin access)
router.post(
  '/categories',
  authenticate,
  authorize('manager'),
  validate(createCategorySchema),
  menuController.createCategory
);

router.post(
  '/items',
  authenticate,
  authorize('manager'),
  validate(createMenuItemSchema),
  menuController.createMenuItem
);

router.put(
  '/items/:id',
  authenticate,
  authorize('manager'),
  validate(createMenuItemSchema.partial()),
  menuController.updateMenuItem
);

router.patch(
  '/items/:id/availability',
  authenticate,
  authorize('staff'),
  menuController.toggleAvailability
);

router.delete(
  '/items/:id',
  authenticate,
  authorize('manager'),
  menuController.deleteMenuItem
);

export default router;
