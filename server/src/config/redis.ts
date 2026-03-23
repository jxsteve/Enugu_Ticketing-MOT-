import { createClient, type RedisClientType } from 'redis';
import { config } from './env';

let redisClient: RedisClientType | null = null;

export function getRedisClient(): RedisClientType | null {
  return redisClient;
}

export async function connectRedis(): Promise<void> {
  try {
    const client = createClient({
      url: config.REDIS_URL,
      socket: { connectTimeout: 3000, reconnectStrategy: false },
    });
    client.on('error', () => {});
    await client.connect();
    redisClient = client as RedisClientType;
    console.log('Connected to Redis');
  } catch {
    console.warn('Redis unavailable — caching disabled');
  }
}
