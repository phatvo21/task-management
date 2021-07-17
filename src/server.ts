require('./register-module-alias');
import 'reflect-metadata';
import {ServerHandler} from 'utils/ServerHandler';
require('events').EventEmitter.prototype._maxListeners = 100;
import {config} from 'constants/Config';
import {CacheStorage} from 'utils/cache-storage/CacheStorage';
import {CacheService} from 'services/CacheService';
import {CacheServiceModel} from 'utils/cache-storage/model/CacheServiceModel';
import {Kernel} from 'consoles/Kernel';
import {createApp} from './app';

/**
 * Start an Express server and installs signal handlers on the
 * process for graceful shutdown.
 */
(async () => {
  const app = await createApp();
  const server = ServerHandler.createExpressServer(app);

  ServerHandler.listenServer(app, server);
  const cache = new CacheStorage(config.redis.url);
  const cacheService = new CacheService(new CacheServiceModel(cache, config.configCache));
  app.set(config.cacheService, cacheService);
  Kernel.getInstance().execute();
})();
