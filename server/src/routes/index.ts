import { Router } from 'express';
import authRouter from './auth.routes.js';
import menuRouter from './menu.routes.js';
import cartRouter from './cart.routes.js';
import orderRouter from './order.routes.js';
import reservationRouter from './reservation.routes.js';
import userRouter from './user.routes.js';
import publicRouter from './public.routes.js';

const router = Router();

/**
 * Helper to create a placeholder router for modules not yet implemented.
 */
function createPlaceholderRouter(moduleName: string): Router {
  const r = Router();
  r.all('*', (req, res) => {
    res.status(200).json({
      success: true,
      message: `${moduleName} API endpoint - Coming soon`,
      path: req.originalUrl,
      method: req.method,
    });
  });
  return r;
}

// Mount routes (to be replaced with actual implementations)
router.use('/auth', authRouter);
router.use('/menu', menuRouter);
router.use('/cart', cartRouter);
router.use('/orders', orderRouter);
router.use('/reservations', reservationRouter);
router.use('/users', userRouter);

// Mount public routes (covers blog, loyalty, promos, gallery, testimonials, offers, settings, newsletter, contact)
router.use('/', publicRouter);

// Remain placeholder routes
router.use('/reviews', createPlaceholderRouter('Reviews'));
router.use('/admin', createPlaceholderRouter('Admin'));

export default router;
