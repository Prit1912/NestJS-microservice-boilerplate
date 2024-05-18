import { CacheModuleAsyncOptions } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-store';
require('dotenv').config();

const { REDIS_HOST, REDIS_PORT, REDIS_USERNAME, REDIS_PASSWORD } = process.env;

export const RedisOptions: CacheModuleAsyncOptions = {
  isGlobal: true,
  useFactory: async () => {
    const store = await redisStore({
      socket: {
        host: REDIS_HOST,
        port: parseInt(REDIS_PORT),
      },
      username: REDIS_USERNAME,
      password: REDIS_PASSWORD,
    });
    return {
      store: () => store,
    };
  },
};
