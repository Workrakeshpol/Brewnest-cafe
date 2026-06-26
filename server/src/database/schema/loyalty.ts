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
import { ordersTable } from './orders';

/**
 * Loyalty tiers table — defines tier levels (e.g. Bronze, Silver, Gold).
 * Each tier has a points multiplier and a set of perks stored as JSONB.
 */
export const loyaltyTiersTable = pgTable('loyalty_tiers', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 50 }).notNull().unique(),
  minPoints: integer('min_points').notNull(),
  pointsMultiplier: numeric('points_multiplier', { precision: 3, scale: 2 }).default('1.00'),
  perks: jsonb('perks').default([]),
  badgeImageUrl: text('badge_image_url'),
  sortOrder: integer('sort_order').default(0),
});

/** Select type for the loyalty tiers table */
export type LoyaltyTier = typeof loyaltyTiersTable.$inferSelect;

/** Insert type for the loyalty tiers table */
export type NewLoyaltyTier = typeof loyaltyTiersTable.$inferInsert;

/**
 * Loyalty accounts table — one-to-one with users, tracks point balances.
 * Includes a unique referral code for the referral program.
 */
export const loyaltyAccountsTable = pgTable('loyalty_accounts', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .unique()
    .references(() => usersTable.id, { onDelete: 'cascade' }),
  tierId: uuid('tier_id').references(() => loyaltyTiersTable.id),
  totalPoints: integer('total_points').default(0),
  availablePoints: integer('available_points').default(0),
  lifetimePoints: integer('lifetime_points').default(0),
  referralCode: varchar('referral_code', { length: 20 }).unique(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

/** Select type for the loyalty accounts table */
export type LoyaltyAccount = typeof loyaltyAccountsTable.$inferSelect;

/** Insert type for the loyalty accounts table */
export type NewLoyaltyAccount = typeof loyaltyAccountsTable.$inferInsert;

/**
 * Loyalty transactions table — an immutable ledger of point movements.
 * Every earn, redeem, bonus, referral, expiry, or adjustment is recorded here.
 */
export const loyaltyTransactionsTable = pgTable('loyalty_transactions', {
  id: uuid('id').primaryKey().defaultRandom(),
  accountId: uuid('account_id')
    .notNull()
    .references(() => loyaltyAccountsTable.id),
  orderId: uuid('order_id').references(() => ordersTable.id),
  type: varchar('type', { length: 20 }).notNull(),
  points: integer('points').notNull(),
  description: text('description'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

/** Select type for the loyalty transactions table */
export type LoyaltyTransaction = typeof loyaltyTransactionsTable.$inferSelect;

/** Insert type for the loyalty transactions table */
export type NewLoyaltyTransaction = typeof loyaltyTransactionsTable.$inferInsert;
