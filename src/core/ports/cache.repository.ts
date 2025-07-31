export interface CacheRepository {
  set(key: string, value: any, ttl?: number): Promise<void>;
  get<T>(key: string): Promise<T | null>;
  del(key: string): Promise<void>;
  keys(pattern: string): Promise<string[]>;
}
