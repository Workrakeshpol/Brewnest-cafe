import { Redis } from 'ioredis';
import { env } from './env.js';
import { logger } from '../utils/logger.js';

let redis: Redis | null = null;

try {
  redis = new Redis(env.REDIS_URL, {
    maxRetriesPerRequest: 2,
    enableOfflineQueue: false,
    connectTimeout: 3000,
  });

  redis.on('connect', () => {
    logger.info('Connected to Redis cache server successfully.');
  });

  redis.on('error', (err) => {
    logger.error('Redis Connection Error:', err);
  });
} catch (err) {
  logger.error('Failed to initialize Redis client:', err);
}

export { redis };
