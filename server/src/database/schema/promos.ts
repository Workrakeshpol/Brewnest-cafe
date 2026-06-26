import {
  pgTable,
  uuid,
  varchar,
  text,
  boolean,
  timestamp,
  integer,
  numeric,
  unique,
} from 'drizzle-orm/pg-core';
import { usersTable } from './users';
import { ordersTable } from './orders';

/**
 * Promo codes table — discount codes with usage limits, validity windows,
 * and support for percentage, fixed-amount, and BOGO discount types.
 */
export const promoCodesTable = pgTable('promo_codes', {
  id: uuid('id').primaryKey().defaultRandom(),
  code: varchar('code', { length: 50 }).notNull().unique(),
  description: text('description'),
  discountType: varchar('discount_type', { length: 20 }).notNull(),
  discountValue: numeric('discount_value', { precision: 10, scale: 2 }).notNull(),
  minOrderAmount: numeric('min_order_amount', { precision: 10, scale: 2 }).default('0.00'),
  maxDiscountAmount: numeric('max_discount_amount', { precision: 10, scale: 2 }),
  maxUses: integer('max_uses'),
  currentUses: integer('current_uses').default(0),
  perUserLimit: integer('per_user_limit').default(1),
  validFrom: timestamp('valid_from', { withTimezone: true }).notNull(),
  validUntil: timestamp('valid_until', { withTimezone: true }).notNull(),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

/** Select type for the promo codes table */
export type PromoCode = typeof promoCodesTable.$inferSelect;

/** Insert type for the promo codes table */
export type NewPromoCode = typeof promoCodesTable.$inferInsert;

/**
 * Promo usage table — records each time a promo code is applied to an order.
 * Enforces one promo per order via a unique constraint on (promoId, orderId).
 */
export const promoUsageTable = pgTable(
  'promo_usage',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    promoId: uuid('promo_id')
      .notNull()
      .references(() => promoCodesTable.id),
    userId: uuid('user_id')
      .notNull()
      .references(() => usersTable.id),
    orderId: uuid('order_id')
      .notNull()
      .references(() => ordersTable.id),
    discountApplied: numeric('discount_applied', { precision: 10, scale: 2 }).notNull(),
    usedAt: timestamp('used_at', { withTimezone: true }).defaultNow(),
  },
  (table) => [
    unique('promo_usage_promo_id_order_id_unique').on(table.promoId, table.orderId),
  ],
);

/** Select type for the promo usage table */
export type PromoUsage = typeof promoUsageTable.$inferSelect;

/** Insert type for the promo usage table */
export type NewPromoUsage = typeof promoUsageTable.$inferInsert;
