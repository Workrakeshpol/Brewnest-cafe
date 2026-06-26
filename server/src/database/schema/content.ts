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
} from 'drizzle-orm/pg-core';
import { usersTable } from './users';
import { menuItemsTable } from './menu';
import { promoCodesTable } from './promos';

/**
 * Blog posts table — café blog content authored by staff/admin users.
 * Supports draft/published workflow and SEO-friendly slugs.
 */
export const blogPostsTable = pgTable('blog_posts', {
  id: uuid('id').primaryKey().defaultRandom(),
  authorId: uuid('author_id')
    .notNull()
    .references(() => usersTable.id),
  title: varchar('title', { length: 300 }).notNull(),
  slug: varchar('slug', { length: 300 }).notNull().unique(),
  excerpt: text('excerpt'),
  content: text('content').notNull(),
  imageUrl: text('image_url'),
  category: varchar('category', { length: 100 }),
  readTimeMin: integer('read_time_min').default(5),
  isPublished: boolean('is_published').default(false),
  publishedAt: timestamp('published_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

/** Select type for the blog posts table */
export type BlogPost = typeof blogPostsTable.$inferSelect;

/** Insert type for the blog posts table */
export type NewBlogPost = typeof blogPostsTable.$inferInsert;

/**
 * Gallery images table — photos displayed in the café's image gallery.
 * Supports categorization and manual sort ordering.
 */
export const galleryImagesTable = pgTable('gallery_images', {
  id: uuid('id').primaryKey().defaultRandom(),
  uploadedBy: uuid('uploaded_by').references(() => usersTable.id),
  imageUrl: text('image_url').notNull(),
  title: varchar('title', { length: 200 }),
  category: varchar('category', { length: 100 }),
  sortOrder: integer('sort_order').default(0),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

/** Select type for the gallery images table */
export type GalleryImage = typeof galleryImagesTable.$inferSelect;

/** Insert type for the gallery images table */
export type NewGalleryImage = typeof galleryImagesTable.$inferInsert;

/**
 * Testimonials table — customer testimonials displayed on the website.
 * Can be linked to registered users or manually entered for non-users.
 */
export const testimonialsTable = pgTable('testimonials', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => usersTable.id),
  name: varchar('name', { length: 200 }).notNull(),
  role: varchar('role', { length: 200 }),
  avatarUrl: text('avatar_url'),
  rating: numeric('rating', { precision: 2, scale: 1 }).notNull(),
  comment: text('comment').notNull(),
  isApproved: boolean('is_approved').default(false),
  isFeatured: boolean('is_featured').default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

/** Select type for the testimonials table */
export type Testimonial = typeof testimonialsTable.$inferSelect;

/** Insert type for the testimonials table */
export type NewTestimonial = typeof testimonialsTable.$inferInsert;

/**
 * Special offers table — time-limited promotional banners.
 * Can optionally link to a promo code for automatic discount application.
 */
export const specialOffersTable = pgTable('special_offers', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: varchar('title', { length: 200 }).notNull(),
  description: text('description'),
  discountText: varchar('discount_text', { length: 50 }),
  promoCodeId: uuid('promo_code_id').references(() => promoCodesTable.id),
  bgType: varchar('bg_type', { length: 30 }).default('gold'),
  startAt: timestamp('start_at', { withTimezone: true }).notNull(),
  endAt: timestamp('end_at', { withTimezone: true }).notNull(),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

/** Select type for the special offers table */
export type SpecialOffer = typeof specialOffersTable.$inferSelect;

/** Insert type for the special offers table */
export type NewSpecialOffer = typeof specialOffersTable.$inferInsert;

/**
 * Daily specials table — a single menu item featured at a special price for a given day.
 */
export const dailySpecialsTable = pgTable('daily_specials', {
  id: uuid('id').primaryKey().defaultRandom(),
  itemId: uuid('item_id')
    .notNull()
    .references(() => menuItemsTable.id),
  specialPrice: numeric('special_price', { precision: 10, scale: 2 }).notNull(),
  tagline: varchar('tagline', { length: 200 }),
  activeDate: date('active_date').notNull(),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

/** Select type for the daily specials table */
export type DailySpecial = typeof dailySpecialsTable.$inferSelect;

/** Insert type for the daily specials table */
export type NewDailySpecial = typeof dailySpecialsTable.$inferInsert;
