import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

import { prisma } from '../config/database.js';
import { NotFoundError, ValidationError, ForbiddenError } from '../utils/errors.js';
import { successResponse } from '../utils/response.js';

// --- Zod Validation Schemas ---

export const createOrderSchema = z.object({
  orderType: z.enum(['dine_in', 'takeaway', 'delivery']),
  deliveryAddressId: z.string().uuid().optional().nullable(),
  tableNumber: z.number().int().positive().optional().nullable(),
  specialInstructions: z.string().optional().nullable(),
  promoCode: z.string().optional().nullable(),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(['pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'cancelled']),
});

// --- Controller Methods ---

/**
 * Place a new order from the user's shopping cart.
 */
export async function createOrder(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new ValidationError('Authentication required');
    }

    const { orderType, deliveryAddressId, tableNumber, specialInstructions, promoCode } = req.body;

    // 1. Get user's cart
    const cart = await prisma.cart.findUnique({
      where: { userId },
    });

    if (!cart) {
      throw new ValidationError('Your cart is empty');
    }

    // 2. Fetch cart items with menu details
    const cartItems = await prisma.cartItem.findMany({
      where: { cartId: cart.id },
      include: {
        menuItem: true,
      },
    });

    if (cartItems.length === 0) {
      throw new ValidationError('Your cart is empty');
    }

    // Check if all items are available
    const unavailableItem = cartItems.find(item => !item.menuItem.isAvailable);
    if (unavailableItem) {
      throw new ValidationError(`Item "${unavailableItem.menuItem.name}" is no longer available. Please remove it from your cart.`);
    }

    // 3. Calculate financial breakdown
    // Subtotal
    let subtotal = 0;
    cartItems.forEach(item => {
      // Base item price
      const price = parseFloat(item.menuItem.basePrice.toString());
      let itemPrice = price;

      // Add variant price deltas (if any)
      const variants = (item.variantSelections as any[]) || [];
      variants.forEach(v => {
        if (v.priceDelta) {
          itemPrice += parseFloat(v.priceDelta);
        }
      });

      subtotal += itemPrice * item.quantity;
    });

    // Tax (8.5%)
    const taxRate = 0.085;
    const taxAmount = subtotal * taxRate;

    // Delivery Fee (static $2.99 if order type is delivery and subtotal < $15)
    let deliveryFee = 0;
    if (orderType === 'delivery') {
      deliveryFee = subtotal < 15 ? 2.99 : 0;
    }

    // Promo Code Discount
    let discountAmount = 0;
    let validPromo: any = null;

    if (promoCode) {
      const promo = await prisma.promoCode.findUnique({
        where: { code: promoCode.toUpperCase() },
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

      validPromo = promo;

      // Apply discount
      if (promo.discountType === 'percentage') {
        const value = parseFloat(promo.discountValue.toString()) / 100;
        discountAmount = subtotal * value;
        if (promo.maxDiscountAmount && discountAmount > parseFloat(promo.maxDiscountAmount.toString())) {
          discountAmount = parseFloat(promo.maxDiscountAmount.toString());
        }
      } else if (promo.discountType === 'fixed') {
        discountAmount = parseFloat(promo.discountValue.toString());
      } else if (promo.discountType === 'bogo') {
        // Buy 1 Get 1 Free (50% off subtotal)
        discountAmount = subtotal * 0.5;
      }

      // Ensure discount doesn't exceed subtotal
      if (discountAmount > subtotal) {
        discountAmount = subtotal;
      }
    }

    // Total Amount
    const totalAmount = subtotal + taxAmount + deliveryFee - discountAmount;

    // Loyalty Points (10 points per dollar spent on total, rounded)
    const pointsEarned = Math.round(totalAmount * 10);

    // 4. Generate order details
    const orderNumber = `BN-${Date.now().toString().substring(5, 11)}-${Math.floor(1000 + Math.random() * 9000)}`;

    // 5. Execute transaction
    const finalResult = await prisma.$transaction(async (tx) => {
      // a. Insert order
      const order = await tx.order.create({
        data: {
          userId,
          orderNumber,
          orderType,
          status: 'pending',
          subtotal,
          taxAmount,
          discountAmount,
          deliveryFee,
          totalAmount,
          pointsEarned,
          deliveryAddressId: deliveryAddressId || null,
          tableNumber: tableNumber || null,
          specialInstructions: specialInstructions || null,
          estimatedTimeMin: orderType === 'delivery' ? 30 : 15,
        },
      });

      // b. Insert order items (snapshots)
      const orderItemsData = cartItems.map(item => {
        const base = parseFloat(item.menuItem.basePrice.toString());
        let finalUnitPrice = base;
        const variants = (item.variantSelections as any[]) || [];
        variants.forEach(v => {
          if (v.priceDelta) {
            finalUnitPrice += parseFloat(v.priceDelta);
          }
        });

        const itemSubtotal = finalUnitPrice * item.quantity;

        return {
          orderId: order.id,
          menuItemId: item.menuItemId,
          itemName: item.menuItem.name,
          quantity: item.quantity,
          unitPrice: finalUnitPrice,
          variantSelections: item.variantSelections || [],
          subtotal: itemSubtotal,
          specialNote: item.specialNote || null,
        };
      });

      await tx.orderItem.createMany({
        data: orderItemsData,
      });

      // c. Create pending payment
      const payment = await tx.payment.create({
        data: {
          orderId: order.id,
          paymentMethod: orderType === 'delivery' ? 'card' : 'cash',
          paymentProvider: 'stripe',
          amount: totalAmount,
          currency: 'USD',
          status: 'pending',
        },
      });

      // d. Record promo code usage
      if (validPromo) {
        await tx.promoUsage.create({
          data: {
            promoId: validPromo.id,
            userId,
            orderId: order.id,
            discountApplied: discountAmount,
          },
        });

        const validPromoCurrentUses = validPromo.currentUses ?? 0;
        await tx.promoCode.update({
          where: { id: validPromo.id },
          data: { currentUses: validPromoCurrentUses + 1 },
        });
      }

      // e. Update loyalty points
      const loyaltyAccount = await tx.loyaltyAccount.findUnique({
        where: { userId },
      });

      if (loyaltyAccount) {
        const totalPoints = loyaltyAccount.totalPoints ?? 0;
        const availablePoints = loyaltyAccount.availablePoints ?? 0;
        const lifetimePoints = loyaltyAccount.lifetimePoints ?? 0;
        await tx.loyaltyAccount.update({
          where: { id: loyaltyAccount.id },
          data: {
            totalPoints: totalPoints + pointsEarned,
            availablePoints: availablePoints + pointsEarned,
            lifetimePoints: lifetimePoints + pointsEarned,
            updatedAt: new Date(),
          },
        });
      }

      // f. Clear cart items
      await tx.cartItem.deleteMany({
        where: { cartId: cart.id },
      });

      return {
        order,
        payment,
      };
    });

    successResponse(res, finalResult, 201);
  } catch (error) {
    next(error);
  }
}

/**
 * List orders for the authenticated user.
 */
export async function getMyOrders(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new ValidationError('Authentication required');
    }

    const orders = await prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    successResponse(res, orders);
  } catch (error) {
    next(error);
  }
}

/**
 * Get details of a single order (items and payment).
 */
export async function getOrderDetails(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    if (!userId) {
      throw new ValidationError('Authentication required');
    }

    const order = await prisma.order.findUnique({
      where: { id: id as string },
      include: {
        orderItems: true,
        payments: true,
      },
    });

    if (!order) {
      throw new NotFoundError('Order not found');
    }

    // Check ownership (unless admin/staff)
    if (order.userId !== userId && req.user?.role === 'customer') {
      throw new ForbiddenError('You do not have permission to view this order');
    }

    successResponse(res, {
      ...order,
      subtotal: order.subtotal.toString(),
      taxAmount: order.taxAmount.toString(),
      discountAmount: order.discountAmount.toString(),
      deliveryFee: order.deliveryFee.toString(),
      totalAmount: order.totalAmount.toString(),
      items: order.orderItems.map(item => ({
        ...item,
        unitPrice: item.unitPrice.toString(),
        subtotal: item.subtotal.toString(),
      })),
      payment: order.payments[0] ? {
        ...order.payments[0],
        amount: order.payments[0].amount.toString(),
      } : null,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Cancel an order (User cancellation).
 * Only possible if order is still 'pending' or 'confirmed'.
 */
export async function cancelOrder(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.user?.id;
    const { id } = req.params;
    const { reason } = req.body;

    if (!userId) {
      throw new ValidationError('Authentication required');
    }

    const order = await prisma.order.findUnique({
      where: { id: id as string },
    });

    if (!order) {
      throw new NotFoundError('Order not found');
    }

    // Check ownership
    if (order.userId !== userId && req.user?.role === 'customer') {
      throw new ForbiddenError('You do not have permission to cancel this order');
    }

    // Verify cancellation status
    if (order.status !== 'pending' && order.status !== 'confirmed') {
      throw new ValidationError('Order cannot be cancelled because it is already being prepared or delivered');
    }

    // Cancel order and payment
    const updated = await prisma.$transaction(async (tx) => {
      const updatedOrder = await tx.order.update({
        where: { id: order.id },
        data: {
          status: 'cancelled',
          cancelledAt: new Date(),
          cancelReason: reason || 'Cancelled by user',
          updatedAt: new Date(),
        },
      });

      // Update payment status to failed/refunded if completed
      await tx.payment.updateMany({
        where: { orderId: order.id },
        data: {
          status: 'failed',
          updatedAt: new Date(),
        },
      });

      // Subtract loyalty points earned
      const loyaltyAccount = await tx.loyaltyAccount.findUnique({
        where: { userId: order.userId },
      });

      if (loyaltyAccount) {
        const pointsToSubtract = order.pointsEarned ?? 0;
        const totalPoints = loyaltyAccount.totalPoints ?? 0;
        const availablePoints = loyaltyAccount.availablePoints ?? 0;
        const lifetimePoints = loyaltyAccount.lifetimePoints ?? 0;
        await tx.loyaltyAccount.update({
          where: { id: loyaltyAccount.id },
          data: {
            totalPoints: Math.max(0, totalPoints - pointsToSubtract),
            availablePoints: Math.max(0, availablePoints - pointsToSubtract),
            lifetimePoints: Math.max(0, lifetimePoints - pointsToSubtract),
            updatedAt: new Date(),
          },
        });
      }

      return updatedOrder;
    });

    successResponse(res, updated);
  } catch (error) {
    next(error);
  }
}

/**
 * List all orders in the system (Staff / Manager / Admin).
 */
export async function getAdminOrders(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const statusQuery = req.query.status as string | undefined;

    const orders = await prisma.order.findMany({
      where: statusQuery ? { status: statusQuery } : undefined,
      orderBy: { createdAt: 'desc' },
    });

    successResponse(res, orders);
  } catch (error) {
    next(error);
  }
}

/**
 * Update order status (Staff / Manager / Admin).
 */
export async function updateOrderStatus(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await prisma.order.findUnique({
      where: { id: id as string },
    });

    if (!order) {
      throw new NotFoundError('Order not found');
    }

    const updateFields: any = {
      status,
      updatedAt: new Date(),
    };

    if (status === 'preparing') {
      updateFields.preparedAt = new Date();
    } else if (status === 'delivered') {
      updateFields.deliveredAt = new Date();
      
      // Auto complete the payment if cash/other
      await prisma.payment.updateMany({
        where: { orderId: order.id },
        data: { status: 'completed', updatedAt: new Date() },
      });
    } else if (status === 'cancelled') {
      updateFields.cancelledAt = new Date();
      updateFields.cancelReason = 'Cancelled by staff';

      // Mark payment failed
      await prisma.payment.updateMany({
        where: { orderId: order.id },
        data: { status: 'failed', updatedAt: new Date() },
      });
    }

    const updated = await prisma.order.update({
      where: { id: order.id },
      data: updateFields,
    });

    successResponse(res, updated);
  } catch (error) {
    next(error);
  }
}
