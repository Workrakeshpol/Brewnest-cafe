import {
  pgTable,
  uuid,
  varchar,
  text,
  boolean,
  timestamp,
  integer,
  numeric,
  date,
  unique,
} from 'drizzle-orm/pg-core';

/**
 * Categories table — top-level grouping for menu items (e.g. Coffee, Pastries).
 */
export const categoriesTable = pgTable('categories', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 100 }).notNull().unique(),
  slug: varchar('slug', { length: 100 }).notNull().unique(),
  description: text('description'),
  sortOrder: integer('sort_order').default(0),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

/** Select type for the categories table */
export type Category = typeof categoriesTable.$inferSelect;

/** Insert type for the categories table */
export type NewCategory = typeof categoriesTable.$inferInsert;

/**
 * Menu items table — individual products available for ordering.
 * Supports seasonal availability, signature/popular flags, and nutritional info.
 */
export const menuItemsTable = pgTable('menu_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  categoryId: uuid('category_id')
    .notNull()
    .references(() => categoriesTable.id),
  name: varchar('name', { length: 200 }).notNull(),
  slug: varchar('slug', { length: 200 }).notNull().unique(),
  description: text('description'),
  basePrice: numeric('base_price', { precision: 10, scale: 2 }).notNull(),
  imageUrl: text('image_url'),
  rating: numeric('rating', { precision: 2, scale: 1 }).default('0.0'),
  reviewCount: integer('review_count').default(0),
  isSignature: boolean('is_signature').default(false),
  isPopular: boolean('is_popular').default(false),
  isAvailable: boolean('is_available').default(true),
  isSeasonal: boolean('is_seasonal').default(false),
  seasonStart: date('season_start'),
  seasonEnd: date('season_end'),
  preparationTimeMin: integer('preparation_time_min').default(5),
  calories: integer('calories'),
  sortOrder: integer('sort_order').default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

/** Select type for the menu items table */
export type MenuItem = typeof menuItemsTable.$inferSelect;

/** Insert type for the menu items table */
export type NewMenuItem = typeof menuItemsTable.$inferInsert;

/**
 * Item variants table — size, milk type, add-on options for a menu item.
 * Each variant can adjust the base price via priceDelta.
 */
export const itemVariantsTable = pgTable('item_variants', {
  id: uuid('id').primaryKey().defaultRandom(),
  itemId: uuid('item_id')
    .notNull()
    .references(() => menuItemsTable.id, { onDelete: 'cascade' }),
  variantType: varchar('variant_type', { length: 50 }).notNull(),
  name: varchar('name', { length: 100 }).notNull(),
  priceDelta: numeric('price_delta', { precision: 10, scale: 2 }).default('0.00'),
  isDefault: boolean('is_default').default(false),
  isAvailable: boolean('is_available').default(true),
  sortOrder: integer('sort_order').default(0),
});

/** Select type for the item variants table */
export type ItemVariant = typeof itemVariantsTable.$inferSelect;

/** Insert type for the item variants table */
export type NewItemVariant = typeof itemVariantsTable.$inferInsert;

/**
 * Item tags table — free-form tags attached to menu items (e.g. vegan, gluten-free).
 * Enforces uniqueness per item so the same tag can't be added twice.
 */
export const itemTagsTable = pgTable(
  'item_tags',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    itemId: uuid('item_id')
      .notNull()
      .references(() => menuItemsTable.id, { onDelete: 'cascade' }),
    tag: varchar('tag', { length: 50 }).notNull(),
  },
  (table) => [
    unique('item_tags_item_id_tag_unique').on(table.itemId, table.tag),
  ],
);

/** Select type for the item tags table */
export type ItemTag = typeof itemTagsTable.$inferSelect;

/** Insert type for the item tags table */
export type NewItemTag = typeof itemTagsTable.$inferInsert;
