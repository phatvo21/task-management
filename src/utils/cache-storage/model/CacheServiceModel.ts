import { CacheStorage } from "utils/cache-storage/CacheStorage";

export class CacheServiceModel {
   cache: CacheStorage;
   config: any;

   constructor(cache: CacheStorage, config: any) {
      this.cache = cache;
      this.config = config;
   }
}

export interface ICacheServiceModel {
   cache: CacheStorage;
   config: any;
}
