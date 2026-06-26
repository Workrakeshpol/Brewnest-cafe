import { Router } from 'express';

import * as userController from '../controllers/user.controller.js';
import { validate } from '../middleware/validate.middleware.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { updateProfileSchema, createAddressSchema } from '../controllers/user.controller.js';

const router = Router();

// All user routes require authentication
router.use(authenticate);

// Profile
router.put('/profile', validate(updateProfileSchema), userController.updateProfile);

// Favorites
router.get('/favorites', userController.getFavorites);
router.post('/favorites/:itemId', userController.toggleFavorite);

// Addresses
router.get('/addresses', userController.getAddresses);
router.post('/addresses', validate(createAddressSchema), userController.createAddress);
router.put('/addresses/:id', validate(createAddressSchema.partial()), userController.updateAddress);
router.delete('/addresses/:id', userController.deleteAddress);

export default router;
