import {
  pgTable,
  uuid,
  varchar,
  text,
  boolean,
  timestamp,
} from 'drizzle-orm/pg-core';

/**
 * Users table — stores all registered users (customers, staff, managers, admins).
 * Supports both local (email/password) and OAuth (Google, Apple) authentication.
 */
export const usersTable = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }),
  firstName: varchar('first_name', { length: 100 }).notNull(),
  lastName: varchar('last_name', { length: 100 }),
  phone: varchar('phone', { length: 20 }),
  avatarUrl: text('avatar_url'),
  role: varchar('role', { length: 20 }).notNull().default('customer'),
  authProvider: varchar('auth_provider', { length: 20 }).default('local'),
  authProviderId: varchar('auth_provider_id', { length: 255 }),
  emailVerified: boolean('email_verified').default(false),
  isActive: boolean('is_active').default(true),
  lastLoginAt: timestamp('last_login_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

/** Select type for the users table */
export type User = typeof usersTable.$inferSelect;

/** Insert type for the users table */
export type NewUser = typeof usersTable.$inferInsert;
