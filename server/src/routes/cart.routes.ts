import { Router } from 'express';

import * as cartController from '../controllers/cart.controller.js';
import { validate } from '../middleware/validate.middleware.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { addToCartSchema, updateCartItemSchema } from '../controllers/cart.controller.js';

const router = Router();

// All cart routes require authentication
router.use(authenticate);

router.get('/', cartController.getCart);
router.post('/items', validate(addToCartSchema), cartController.addToCart);
router.put('/items/:id', validate(updateCartItemSchema), cartController.updateCartItem);
router.delete('/items/:id', cartController.removeFromCart);
router.delete('/', cartController.clearCart);

export default router;
