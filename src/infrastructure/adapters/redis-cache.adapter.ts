import { Injectable, Inject } from '@nestjs/common';
import { Redis } from 'ioredis';

import { CacheRepository } from '@core/ports/cache.repository';

@Injectable()
export class RedisCacheAdapter implements CacheRepository {
  constructor(@Inject('REDIS_CLIENT') private readonly redis: Redis) {}

  async set(key: string, value: any, ttl?: number): Promise<void> {
    await this.redis.set(key, JSON.stringify(value));
    if (ttl) {
      await this.redis.expire(key, ttl);
    }
  }

  async get<T>(key: string): Promise<T | null> {
    const data = await this.redis.get(key);
    return data ? (JSON.parse(data) as T) : null;
  }

  async del(key: string): Promise<void> {
    await this.redis.del(key);
  }

  async keys(pattern: string): Promise<string[]> {
    return this.redis.keys(pattern);
  }
}
