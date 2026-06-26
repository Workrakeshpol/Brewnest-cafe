import { Router } from 'express';

import * as reservationController from '../controllers/reservation.controller.js';
import { validate } from '../middleware/validate.middleware.js';
import { authenticate, optionalAuth } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/rbac.middleware.js';
import { createReservationSchema } from '../controllers/reservation.controller.js';

const router = Router();

// Public / Guest or Authenticated booking
router.post('/', optionalAuth, validate(createReservationSchema), reservationController.createReservation);

// Authenticated booking management
router.get('/', authenticate, reservationController.getMyReservations);
router.delete('/:id', authenticate, reservationController.cancelReservation);

// Staff / Admin booking management
router.get('/admin/all', authenticate, authorize('staff'), reservationController.getAdminReservations);

export default router;
