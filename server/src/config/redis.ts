import { createClient } from 'redis';
import { config } from './env';

export const redisClient = createClient({
  url: config.REDIS_URL,
});

redisClient.on('error', (err) => {
  console.error('Redis client error:', err);
});

export async function connectRedis(): Promise<void> {
  try {
    await redisClient.connect();
    console.log('Connected to Redis');
  } catch (err) {
    console.warn('Redis connection failed, caching disabled:', err);
  }
}
