import {
  pgTable,
  uuid,
  text,
  timestamp,
  integer,
  jsonb,
  unique,
} from 'drizzle-orm/pg-core';
import { usersTable } from './users';
import { menuItemsTable } from './menu';

/**
 * Carts table — server-side shopping cart, one per user.
 * Cascade-deletes when the owning user is removed.
 */
export const cartsTable = pgTable('carts', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .unique()
    .references(() => usersTable.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

/** Select type for the carts table */
export type Cart = typeof cartsTable.$inferSelect;

/** Insert type for the carts table */
export type NewCart = typeof cartsTable.$inferInsert;

/**
 * Cart items table — individual items in a user's cart.
 * Unique constraint on (cartId, menuItemId) means adding the same item
 * again should update quantity rather than create a duplicate row.
 */
export const cartItemsTable = pgTable(
  'cart_items',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    cartId: uuid('cart_id')
      .notNull()
      .references(() => cartsTable.id, { onDelete: 'cascade' }),
    menuItemId: uuid('menu_item_id')
      .notNull()
      .references(() => menuItemsTable.id),
    quantity: integer('quantity').notNull().default(1),
    variantSelections: jsonb('variant_selections').default([]),
    specialNote: text('special_note'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  },
  (table) => [
    unique('cart_items_cart_id_menu_item_id_unique').on(table.cartId, table.menuItemId),
  ],
);

/** Select type for the cart items table */
export type CartItem = typeof cartItemsTable.$inferSelect;

/** Insert type for the cart items table */
export type NewCartItem = typeof cartItemsTable.$inferInsert;
