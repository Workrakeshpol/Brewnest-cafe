import { redis } from '../config/redis.js';
import { logger } from './logger.js';

/**
 * Retrieve a value from Redis cache.
 * Falls back gracefully to returning null if Redis is offline.
 */
export async function getCache<T>(key: string): Promise<T | null> {
  if (!redis) return null;
  try {
    const data = await redis.get(key);
    if (!data) return null;
    return JSON.parse(data) as T;
  } catch (error) {
    logger.error(`Cache Read Error for key "${key}":`, error);
    return null;
  }
}

/**
 * Set a key-value pair in Redis cache with an expiration timeout.
 * Falls back gracefully if Redis is offline.
 */
export async function setCache(
  key: string,
  value: unknown,
  ttlSeconds = 3600
): Promise<void> {
  if (!redis) return;
  try {
    const serialized = JSON.stringify(value);
    await redis.setex(key, ttlSeconds, serialized);
  } catch (error) {
    logger.error(`Cache Write Error for key "${key}":`, error);
  }
}

/**
 * Invalidate a cached key.
 * Falls back gracefully if Redis is offline.
 */
export async function invalidateCache(key: string): Promise<void> {
  if (!redis) return;
  try {
    await redis.del(key);
  } catch (error) {
    logger.error(`Cache Invalidation Error for key "${key}":`, error);
  }
}

/**
 * Invalidate multiple cache keys matching a pattern.
 */
export async function invalidatePrefix(prefix: string): Promise<void> {
  if (!redis) return;
  try {
    const keys = await redis.keys(prefix);
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  } catch (error) {
    logger.error(`Cache Invalidation Prefix Error for "${prefix}":`, error);
  }
}
