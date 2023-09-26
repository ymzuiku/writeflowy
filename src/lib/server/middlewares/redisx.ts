// import Redis from 'ioredis';
import { createClient } from 'redis';

export const redisx = createClient({ url: process?.env?.REDIS_URL || '' });
redisx.connect();
// export const redisx = new Redis(process?.env?.REDIS_URL || '', { lazyConnect: true });
