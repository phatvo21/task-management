import {CacheCredentials} from 'utils/cache-storage/CacheCredentials';
import {Redis} from 'ioredis';
import * as IORedis from 'ioredis';

export class CacheStorage {
  public ioRedis: Redis;

  constructor(url: string) {
    const parsed = new CacheCredentials(url);
    this.ioRedis = new IORedis({...parsed});
    this.ioRedis.monitor((err, monitor) => {
      console.log(`\x1b[1m%s\x1b[0m`, `Redis cache entering monitoring mode...`);
      monitor.on('monitor', (time, args) => {
        console.log(`\x1b[1m\x1b[35m%s\x1b[0m`, `MONITOR: ${time} ${args.join(' ')}`);
      });
    });
    const {options} = this.ioRedis;
    const {db, port, host} = options;
    console.log(
      `Cache connection: host: \x1b[34m${host}\x1b[0m, port: \x1b[34m${port}\x1b[0m, db: \x1b[34m${db}\x1b[0m`,
    );
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
