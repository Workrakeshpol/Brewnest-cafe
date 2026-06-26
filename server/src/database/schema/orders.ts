import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  integer,
  numeric,
  jsonb,
} from 'drizzle-orm/pg-core';
import { usersTable } from './users';
import { menuItemsTable } from './menu';
import { addressesTable } from './addresses';

/**
 * Orders table — represents a customer's complete order.
 * Tracks lifecycle from pending → delivered/cancelled with financial breakdown.
 */
export const ordersTable = pgTable('orders', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .references(() => usersTable.id),
  orderNumber: varchar('order_number', { length: 20 }).notNull().unique(),
  orderType: varchar('order_type', { length: 20 }).notNull().default('delivery'),
  status: varchar('status', { length: 20 }).notNull().default('pending'),
  subtotal: numeric('subtotal', { precision: 10, scale: 2 }).notNull(),
  taxAmount: numeric('tax_amount', { precision: 10, scale: 2 }).notNull(),
  discountAmount: numeric('discount_amount', { precision: 10, scale: 2 }).default('0.00'),
  deliveryFee: numeric('delivery_fee', { precision: 10, scale: 2 }).default('0.00'),
  totalAmount: numeric('total_amount', { precision: 10, scale: 2 }).notNull(),
  pointsEarned: integer('points_earned').default(0),
  pointsRedeemed: integer('points_redeemed').default(0),
  deliveryAddressId: uuid('delivery_address_id').references(() => addressesTable.id),
  tableNumber: integer('table_number'),
  specialInstructions: text('special_instructions'),
  estimatedTimeMin: integer('estimated_time_min').default(25),
  preparedAt: timestamp('prepared_at', { withTimezone: true }),
  deliveredAt: timestamp('delivered_at', { withTimezone: true }),
  cancelledAt: timestamp('cancelled_at', { withTimezone: true }),
  cancelReason: text('cancel_reason'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

/** Select type for the orders table */
export type Order = typeof ordersTable.$inferSelect;

/** Insert type for the orders table */
export type NewOrder = typeof ordersTable.$inferInsert;

/**
 * Order items table — individual line items within an order.
 * Stores snapshot data (name, price) so orders remain accurate even if the menu changes.
 */
export const orderItemsTable = pgTable('order_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  orderId: uuid('order_id')
    .notNull()
    .references(() => ordersTable.id, { onDelete: 'cascade' }),
  menuItemId: uuid('menu_item_id')
    .notNull()
    .references(() => menuItemsTable.id),
  itemName: varchar('item_name', { length: 200 }).notNull(),
  quantity: integer('quantity').notNull(),
  unitPrice: numeric('unit_price', { precision: 10, scale: 2 }).notNull(),
  variantSelections: jsonb('variant_selections').default([]),
  subtotal: numeric('subtotal', { precision: 10, scale: 2 }).notNull(),
  specialNote: text('special_note'),
});

/** Select type for the order items table */
export type OrderItem = typeof orderItemsTable.$inferSelect;

/** Insert type for the order items table */
export type NewOrderItem = typeof orderItemsTable.$inferInsert;

/**
 * Payments table — tracks payment transactions for orders.
 * Supports multiple payment providers (Stripe, Razorpay) and methods.
 */
export const paymentsTable = pgTable('payments', {
  id: uuid('id').primaryKey().defaultRandom(),
  orderId: uuid('order_id')
    .notNull()
    .references(() => ordersTable.id),
  paymentMethod: varchar('payment_method', { length: 30 }).notNull(),
  paymentProvider: varchar('payment_provider', { length: 30 }),
  providerPaymentId: varchar('provider_payment_id', { length: 255 }),
  amount: numeric('amount', { precision: 10, scale: 2 }).notNull(),
  currency: varchar('currency', { length: 3 }).default('USD'),
  status: varchar('status', { length: 20 }).notNull().default('pending'),
  receiptUrl: text('receipt_url'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

/** Select type for the payments table */
export type Payment = typeof paymentsTable.$inferSelect;

/** Insert type for the payments table */
export type NewPayment = typeof paymentsTable.$inferInsert;
