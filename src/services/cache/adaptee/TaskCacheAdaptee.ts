import { CacheAdapter } from "services/cache/CacheAdapter";
import { ICache } from "services/cache/ICache";
import { CacheStorage } from "utils/cache-storage/CacheStorage";
import { PushDataModel } from "services/cache/PushDataModel";
import { ICacheServiceModel } from "utils/cache-storage/model/CacheServiceModel";

export class TaskCacheAdaptee extends CacheAdapter implements ICache {
   public cache: CacheStorage;
   public config: any;

   constructor(cacheService: ICacheServiceModel) {
      super(cacheService.cache);
      this.cache = cacheService.cache;
      const { taskManagementCache } = cacheService.config;
      this.config = taskManagementCache;
   }

   public async push(data: string, key: string): Promise<PushDataModel> {
      const { expiredAfterInSeconds } = this.config;
      const isExists = await this.getCache(key);

      if (isExists) {
         const result = await this.setCache(data, expiredAfterInSeconds, key);
         return new PushDataModel(result, true);
      }
      const result = await this.setCache(data, expiredAfterInSeconds, key);
      return new PushDataModel(result, false);
   }

   public findOne(key: string): Promise<string> {
      return this.findByKey(key);
   }

   public remove(key: string): Promise<any> {
      return this.delete(key);
   }
}
