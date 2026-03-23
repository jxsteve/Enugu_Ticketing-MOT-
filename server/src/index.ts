import { config } from './config/env';
import { createApp } from './app';
import { connectRedis } from './config/redis';

async function main(): Promise<void> {
  const app = createApp();

  // Connect to Redis (non-blocking - app works without it)
  await connectRedis();

  app.listen(config.PORT, () => {
    console.log(`Server running on port ${config.PORT} [${config.NODE_ENV}]`);
  });
}

main().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
