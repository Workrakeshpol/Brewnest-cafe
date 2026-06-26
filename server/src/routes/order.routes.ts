import { Router } from 'express';

import * as orderController from '../controllers/order.controller.js';
import { validate } from '../middleware/validate.middleware.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/rbac.middleware.js';
import { createOrderSchema, updateOrderStatusSchema } from '../controllers/order.controller.js';

const router = Router();

// All order routes require authentication
router.use(authenticate);

// Customer routes
router.post('/', validate(createOrderSchema), orderController.createOrder);
router.get('/', orderController.getMyOrders);
router.get('/:id', orderController.getOrderDetails);
router.post('/:id/cancel', orderController.cancelOrder);

// Staff / Admin routes
router.get('/admin/all', authorize('staff'), orderController.getAdminOrders);
router.patch('/:id/status', authorize('staff'), validate(updateOrderStatusSchema), orderController.updateOrderStatus);

export default router;
