import {
  pgTable,
  uuid,
  varchar,
  text,
  boolean,
  timestamp,
  integer,
  date,
  time,
} from 'drizzle-orm/pg-core';
import { usersTable } from './users';

/**
 * Cafe tables — physical tables in the café with capacity and location info.
 * Named `cafeTablesTable` to avoid conflict with the JS `table` keyword.
 */
export const cafeTablesTable = pgTable('cafe_tables', {
  id: uuid('id').primaryKey().defaultRandom(),
  tableNumber: integer('table_number').notNull().unique(),
  capacity: integer('capacity').notNull(),
  location: varchar('location', { length: 50 }).default('indoor'),
  isActive: boolean('is_active').default(true),
});

/** Select type for the cafe tables table */
export type CafeTable = typeof cafeTablesTable.$inferSelect;

/** Insert type for the cafe tables table */
export type NewCafeTable = typeof cafeTablesTable.$inferInsert;

/**
 * Reservations table — table booking requests from users or walk-in guests.
 * Supports guest reservations (no userId) and reminder tracking.
 */
export const reservationsTable = pgTable('reservations', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => usersTable.id),
  tableId: uuid('table_id').references(() => cafeTablesTable.id),
  guestName: varchar('guest_name', { length: 200 }).notNull(),
  guestEmail: varchar('guest_email', { length: 255 }).notNull(),
  guestPhone: varchar('guest_phone', { length: 20 }),
  partySize: integer('party_size').notNull(),
  reservationDate: date('reservation_date').notNull(),
  startTime: time('start_time').notNull(),
  endTime: time('end_time').notNull(),
  status: varchar('status', { length: 20 }).default('pending'),
  specialRequests: text('special_requests'),
  reminderSent: boolean('reminder_sent').default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

/** Select type for the reservations table */
export type Reservation = typeof reservationsTable.$inferSelect;

/** Insert type for the reservations table */
export type NewReservation = typeof reservationsTable.$inferInsert;
