import {
  pgTable,
  uuid,
  varchar,
  boolean,
  timestamp,
  numeric,
} from 'drizzle-orm/pg-core';
import { usersTable } from './users';

/**
 * Addresses table — delivery addresses linked to a user account.
 * Supports geo-coordinates for distance-based delivery fee calculation.
 */
export const addressesTable = pgTable('addresses', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .references(() => usersTable.id, { onDelete: 'cascade' }),
  label: varchar('label', { length: 50 }).default('Home'),
  street: varchar('street', { length: 255 }).notNull(),
  city: varchar('city', { length: 100 }).notNull(),
  state: varchar('state', { length: 100 }),
  zipCode: varchar('zip_code', { length: 20 }),
  country: varchar('country', { length: 100 }).default('US'),
  latitude: numeric('latitude', { precision: 10, scale: 8 }),
  longitude: numeric('longitude', { precision: 11, scale: 8 }),
  isDefault: boolean('is_default').default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

/** Select type for the addresses table */
export type Address = typeof addressesTable.$inferSelect;

/** Insert type for the addresses table */
export type NewAddress = typeof addressesTable.$inferInsert;
