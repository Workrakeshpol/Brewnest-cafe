import {
  pgTable,
  uuid,
  varchar,
  boolean,
  timestamp,
  unique,
} from 'drizzle-orm/pg-core';
import { usersTable } from './users';

/**
 * Referrals table — tracks user-to-user referral relationships.
 * Enforces that a pair (referrer, referred) can only exist once.
 */
export const referralsTable = pgTable(
  'referrals',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    referrerId: uuid('referrer_id')
      .notNull()
      .references(() => usersTable.id),
    referredId: uuid('referred_id')
      .notNull()
      .references(() => usersTable.id),
    referralCode: varchar('referral_code', { length: 20 }).notNull(),
    bonusAwarded: boolean('bonus_awarded').default(false),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  },
  (table) => [
    unique('referrals_referrer_id_referred_id_unique').on(table.referrerId, table.referredId),
  ],
);

/** Select type for the referrals table */
export type Referral = typeof referralsTable.$inferSelect;

/** Insert type for the referrals table */
export type NewReferral = typeof referralsTable.$inferInsert;
