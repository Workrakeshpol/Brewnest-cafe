import {
  pgTable,
  uuid,
  text,
  boolean,
  timestamp,
  numeric,
  unique,
} from 'drizzle-orm/pg-core';
import { usersTable } from './users';
import { menuItemsTable } from './menu';
import { ordersTable } from './orders';

/**
 * Favorites table — tracks which menu items a user has favorited.
 * Enforces uniqueness so a user can only favorite an item once.
 */
export const favoritesTable = pgTable(
  'favorites',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => usersTable.id, { onDelete: 'cascade' }),
    itemId: uuid('item_id')
      .notNull()
      .references(() => menuItemsTable.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  },
  (table) => [
    unique('favorites_user_id_item_id_unique').on(table.userId, table.itemId),
  ],
);

/** Select type for the favorites table */
export type Favorite = typeof favoritesTable.$inferSelect;

/** Insert type for the favorites table */
export type NewFavorite = typeof favoritesTable.$inferInsert;

/**
 * Reviews table — user ratings and comments for menu items.
 * Supports verified-purchase flag when linked to an order.
 */
export const reviewsTable = pgTable('reviews', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .references(() => usersTable.id),
  itemId: uuid('item_id')
    .notNull()
    .references(() => menuItemsTable.id),
  orderId: uuid('order_id').references(() => ordersTable.id),
  rating: numeric('rating', { precision: 2, scale: 1 }).notNull(),
  comment: text('comment'),
  isVerified: boolean('is_verified').default(false),
  isApproved: boolean('is_approved').default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

/** Select type for the reviews table */
export type Review = typeof reviewsTable.$inferSelect;

/** Insert type for the reviews table */
export type NewReview = typeof reviewsTable.$inferInsert;
