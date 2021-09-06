const Ioredis = require('ioredis-mock');
import {Redis, KeyType, ValueType} from 'ioredis';

export class MockCache {
  cache: Redis;
  constructor(data: any) {
    this.cache = new Ioredis({data}) as Redis;
  }
  async set(key: KeyType, value: ValueType, expiryMode: string, time: number) {
    return this.cache.pipeline().set(key, value, expiryMode, time).exec();
  }
  async get(key: KeyType) {
    return this.cache.pipeline().get(key).exec();
  }
  async del(key: KeyType) {
    return this.cache.pipeline().del(key).exec();
  }
  async keyExists(key) {
    return this.cache.pipeline().exists(key).exec();
  }
  async keys(pattern) {
    return this.cache.pipeline().keys(pattern).exec();
  }
}
