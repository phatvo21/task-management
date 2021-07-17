import {ICache} from 'services/cache/ICache';
import {CacheRegister} from 'services/cache/CacheRegister';
import {TaskCacheAdaptee} from 'services/cache/adaptee/TaskCacheAdaptee';
import {ICacheServiceModel} from 'utils/cache-storage/model/CacheServiceModel';

export class CacheService {
  public taskCache: ICache;
  public cacheService: ICacheServiceModel;

  constructor(cacheService: ICacheServiceModel) {
    this.cacheService = cacheService;
    this.register();
  }

  public register(): void {
    this.taskCache = new CacheRegister(new TaskCacheAdaptee(this.cacheService)).register();
  }
}
