import { Injectable } from '@nestjs/common';
import * as NodeCache from 'node-cache';

@Injectable()
export class CacheService {
  private cache: NodeCache;

  constructor() {
    this.cache = new NodeCache();
    this.scheduleCacheInvalidation();
  }

  set(key: string, value: any, ttl?: number): void {
    const now = new Date();
    const nextHour = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      now.getHours() + 1,
      0,
      0,
      0,
    ).getTime();
    const expirationTime = (nextHour - now.getTime()) / 1000; // Calculate time until the next hour

    this.cache.set(key, value, ttl || expirationTime);
  }

  get(key: string): any {
    return this.cache.get(key);
  }

  invalidate(key: string): void {
    this.cache.del(key);
  }

  private scheduleCacheInvalidation(): void {
    const now = new Date();
    const nextHour = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      now.getHours() + 1,
      0,
      0,
      0,
    );
    const timeUntilNextHour = nextHour.getTime() - now.getTime();

    setTimeout(() => {
      this.cache.flushAll();
      this.scheduleCacheInvalidation();
    }, timeUntilNextHour);
  }

  generateCacheKey(city: string): string {
    const now = new Date();
    const startingHour = `${now.toISOString().split('T')[1].split(':')[0]}:00:00.000Z`; // Starting hour of the current date in UTC format
    return `${city}-${now.toISOString().split('T')[0]}T${startingHour}`;
  }
}
