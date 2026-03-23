import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

interface EnvConfig {
  PORT: number;
  DATABASE_URL: string;
  REDIS_URL: string;
  JWT_SECRET: string;
  JWT_EXPIRY: string;
  NODE_ENV: string;
}

function getEnvVar(key: string, fallback?: string): string {
  const value = process.env[key] ?? fallback;
  if (value === undefined) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

export const config: EnvConfig = {
  PORT: parseInt(getEnvVar('PORT', '4000'), 10),
  DATABASE_URL: getEnvVar('DATABASE_URL', 'postgresql://postgres:postgres@localhost:5432/enugu_ticketing'),
  REDIS_URL: getEnvVar('REDIS_URL', 'redis://localhost:6379'),
  JWT_SECRET: getEnvVar('JWT_SECRET', 'change-me-in-production'),
  JWT_EXPIRY: getEnvVar('JWT_EXPIRY', '8h'),
  NODE_ENV: getEnvVar('NODE_ENV', 'development'),
};
