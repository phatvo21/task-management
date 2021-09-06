import * as Server from '../src/server';
import {getManager} from 'typeorm';
import * as IORedis from 'ioredis';
import {CacheCredentials} from '../src/utils/cache-storage/CacheCredentials';
import {config} from '../src/constants/Config';
import {runMigration} from '../src/databases/RunMigration';

/**
 * Global test hooks
 */
export function hooks() {
  let app;
  let entityManager = getManager();

  beforeAll(async () => {
    app = await Server.default;
    await reCreateDB();
    await runMigration();
  });

  beforeEach(async () => {});

  afterEach(async () => {});

  afterAll(async () => {
    jest.resetAllMocks();
    jest.resetModules();
    await clearDB();
    const parsed = new CacheCredentials(config.redis.url);
    const ioRedis = new IORedis({...parsed});
    await ioRedis.flushdb();
  });

  async function reCreateDB() {
    await entityManager.transaction(async (transactionalEntityManager) => {
      return await transactionalEntityManager
        .query(`DROP DATABASE IF EXISTS ${process.env.SQL_DB}`)
        .then(async function () {
          return await transactionalEntityManager.query(
            `CREATE DATABASE ${process.env.SQL_DB} CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci`,
          );
        })
        .then(async function () {
          return await transactionalEntityManager.query(`USE ${process.env.SQL_DB}`);
        });
    });
  }

  async function clearDB() {
    await entityManager.transaction(async (transactionalEntityManager) => {
      const tables = await transactionalEntityManager.query(
        `SELECT table_name FROM information_schema.tables WHERE table_schema="${process.env.SQL_DB}";`,
      );
      for (let i = 0; i < tables.length; i++) {
        const table = tables[i]['table_name'];
        if (table !== 'migrations') {
          await transactionalEntityManager.query(`SET FOREIGN_KEY_CHECKS = 0;`);
          await transactionalEntityManager.query(`TRUNCATE TABLE ${table};`);
          await transactionalEntityManager.query(`SET FOREIGN_KEY_CHECKS = 1;`);
        }
      }
    });
  }
}
