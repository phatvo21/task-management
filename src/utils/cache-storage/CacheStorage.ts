import {CacheCredentials} from 'utils/cache-storage/CacheCredentials';
import {Redis} from 'ioredis';
import * as IORedis from 'ioredis';

export class CacheStorage {
  public ioRedis: Redis;

  constructor(url: string) {
    const parsed = new CacheCredentials(url);
    this.ioRedis = new IORedis({...parsed});
  }

  public async set(key: string, value: any, expiryMode: any, time: any): Promise<Array<[Error | null, any]>> {
    return this.ioRedis.pipeline().set(key, value, expiryMode, time).exec();
  }

  public async get(key: string): Promise<Array<[Error | null, any]>> {
    return this.ioRedis.pipeline().get(key).exec();
  }

  public async del(key: string): Promise<Array<[Error | null, any]>> {
    return this.ioRedis.pipeline().del(key).exec();
  }

  public async keyExists(key: string): Promise<Array<[Error | null, any]>> {
    return this.ioRedis.pipeline().exists(key).exec();
  }

  public async keys(pattern: any): Promise<Array<[Error | null, any]>> {
    return this.ioRedis.pipeline().keys(pattern).exec();
  }
}
