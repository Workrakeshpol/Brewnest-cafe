import {
  pgTable,
  uuid,
  varchar,
  text,
  boolean,
  timestamp,
} from 'drizzle-orm/pg-core';
import { usersTable } from './users';

/**
 * Contact messages table — messages submitted through the café's contact form.
 * Tracks read/reply status for staff follow-up.
 */
export const contactMessagesTable = pgTable('contact_messages', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => usersTable.id),
  name: varchar('name', { length: 200 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  subject: varchar('subject', { length: 300 }),
  message: text('message').notNull(),
  isRead: boolean('is_read').default(false),
  repliedAt: timestamp('replied_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

/** Select type for the contact messages table */
export type ContactMessage = typeof contactMessagesTable.$inferSelect;

/** Insert type for the contact messages table */
export type NewContactMessage = typeof contactMessagesTable.$inferInsert;

/**
 * Newsletter subscribers table — email list for marketing campaigns.
 * Supports soft-unsubscribe via isActive flag and unsubscribedAt timestamp.
 */
export const newsletterSubscribersTable = pgTable('newsletter_subscribers', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  isActive: boolean('is_active').default(true),
  subscribedAt: timestamp('subscribed_at', { withTimezone: true }).defaultNow(),
  unsubscribedAt: timestamp('unsubscribed_at', { withTimezone: true }),
});

/** Select type for the newsletter subscribers table */
export type NewsletterSubscriber = typeof newsletterSubscribersTable.$inferSelect;

/** Insert type for the newsletter subscribers table */
export type NewNewsletterSubscriber = typeof newsletterSubscribersTable.$inferInsert;
