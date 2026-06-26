import {
  pgTable,
  varchar,
  jsonb,
  timestamp,
} from 'drizzle-orm/pg-core';

/**
 * Site settings table — key-value store for application configuration.
 * Values are stored as JSONB to support complex nested configuration objects.
 */
export const siteSettingsTable = pgTable('site_settings', {
  key: varchar('key', { length: 100 }).primaryKey(),
  value: jsonb('value').notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

/** Select type for the site settings table */
export type SiteSetting = typeof siteSettingsTable.$inferSelect;

/** Insert type for the site settings table */
export type NewSiteSetting = typeof siteSettingsTable.$inferInsert;
