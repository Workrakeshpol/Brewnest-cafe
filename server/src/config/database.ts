import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import { env } from './env.js';
import { logger } from '../utils/logger.js';

// Connection pool is managed by node-postgres
const pool = new pg.Pool({
  connectionString: env.DATABASE_URL,
  max: env.NODE_ENV === 'production' ? 20 : 5,
  idleTimeoutMillis: 20000,
  connectionTimeoutMillis: 10000,
});

const adapter = new PrismaPg(pool);

/** Prisma Client instance connected to PostgreSQL */
export const prisma = new PrismaClient({ adapter });

/**
 * Gracefully close the database connection pool.
 * Should be called during server shutdown.
 */
export async function closeDatabase(): Promise<void> {
  logger.info('Closing database connection pool...');
  await pool.end();
  logger.info('Database connection pool closed.');
}
