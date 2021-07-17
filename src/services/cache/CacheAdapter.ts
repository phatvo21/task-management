import {CacheStorage} from 'utils/cache-storage/CacheStorage';

export class CacheAdapter {
  public cache: CacheStorage;

  constructor(cache: CacheStorage) {
    this.cache = cache;
  }

  public async getCache(key: string): Promise<Array<[Error | null, any]>> {
    const [[err, value]] = await this.cache.keyExists(key);

    if (err) {
      console.error(`sCacheAdapterError get: ${err.message}`);
      throw err;
    }
    return value;
  }

  public async setCache(data: string, time: string, key: string): Promise<Array<[Error | null, any]>> {
    const [[err, result]] = await this.cache.set(key, data, 'EX', time);
    if (err) {
      console.error(`CacheAdapterError set: ${err.message}`);
      throw err;
    }
    return result;
  }

  public async findByKey(key: string): Promise<string> {
    const [[err, result]] = await this.cache.get(key);
    if (err) {
      console.error(`get all keys error: ${err.message}`);
      throw err;
    }
    return result;
  }

  public async delete(key: string): Promise<any> {
    const [[err, result]] = await this.cache.del(key);
    if (err) {
      console.error(`get all keys error: ${err.message}`);
      throw err;
    }
    return result;
  }
}
