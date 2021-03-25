import { CacheStorage } from "@utils/cache-storage/CacheStorage";

export class CacheAdapter {
   public cache: CacheStorage;

   constructor(cache: CacheStorage) {
      this.cache = cache;
   }

   public async getCache(key: string): Promise<Error | string> {
      const [[err, value]] = await this.cache.keyExists<[Error | null, any]>(key);

      if (err) {
         console.error(`sCacheAdapterError get: ${err.message}`);
         throw err;
      }
      return value;
   }

   public async setCache(data: string, time: string, key: string): Promise<Error | string> {
      const [[err, result]] = await this.cache.set<[Error | null, any]>(key, data, "EX", time);
      if (err) {
         console.error(`CacheAdapterError set: ${err.message}`);
         throw err;
      }
      return result;
   }

   public async getAll(key: string): Promise<Error | string> {
      const [[err, result]] = await this.cache.get<[Error | null, any]>(key);
      if (err) {
         console.error(`get all keys error: ${err.message}`);
         throw err;
      }
      return result;
   }
}
