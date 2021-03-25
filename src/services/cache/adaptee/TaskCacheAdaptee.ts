import { CacheAdapter } from "@services/cache/CacheAdapter";
import { ICache } from "@services/cache/ICache";
import { CacheStorage } from "@utils/cache-storage/CacheStorage";
import { PushDataModel } from "@services/cache/PushDataModel";
import { ICacheServiceModel } from "@utils/cache-storage/model/CacheServiceModel";

export class TaskCacheAdaptee extends CacheAdapter implements ICache {
   public cache: CacheStorage;
   public config: any;
   public key: string;

   constructor(cacheService: ICacheServiceModel) {
      super(cacheService.cache);
      this.cache = cacheService.cache;
      const { taskManagementCache } = cacheService.config;
      this.config = taskManagementCache;
   }

   public async push(data: string, key: string): Promise<PushDataModel> {
      const cacheKey = this.setKey(key);
      const { expiredAfterInSeconds } = this.config;
      const isExists = await this.getCache(cacheKey);

      if (isExists) {
         const result = await this.setCache(data, expiredAfterInSeconds, cacheKey);
         return new PushDataModel(JSON.parse(<string>result), true);
      }
      const result = await this.setCache(data, expiredAfterInSeconds, cacheKey);
      return new PushDataModel(JSON.parse(<string>result), false);
   }

   public findOne(key: string): Promise<string | Error> {
      return this.getCache(key);
   }

   public all(key: string): Promise<string | Error> {
      const cacheKey = this.setKey(key);
      return this.getAll(cacheKey);
   }

   public setKey(key: string): string {
      return this.key + ":" + key;
   }
}
