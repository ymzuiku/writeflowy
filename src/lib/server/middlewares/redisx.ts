// import Redis from 'ioredis';
import { config } from 'dotenv';
import { createClient } from 'redis';

config();
export const redisx = createClient({ url: process?.env?.REDIS_URL || '' });
redisx.connect();
// export const redisx = new Redis(process?.env?.REDIS_URL || '', { lazyConnect: true });
