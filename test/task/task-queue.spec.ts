import * as request from 'supertest';
// @ts-ignore
const {MockCache} = require('../__mocks__/main');
import {CacheService} from '../../src/services/CacheService';
// @ts-ignore
import {databaseConnection} from '../config/database.connection';
// @ts-ignore
import {databaseDisconnect} from '../config/database.disconnection';
import {createApp} from '../../src/app';

let app;
const OLD_ENV = process.env;
beforeAll(async () => {
  process.env = {...OLD_ENV};
  process.env.HTTP_HMAC_PRIVATE_KEY = 'thisisprivatekey';
  process.env.HTTP_HMAC_PUBLIC_KEY = 'thisispublickey';
  process.env.JWT_TTL = '8h';
  process.env.JWT_SECRET = 'superlongsecretkeygoeshereprobablyagoodideatochangethisperproject';
  process.env.JWT_KEY = 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855';
  process.env.WT_ENCRYPTION_ALGORITHM = 'aes-256-cbc';
  process.env.SQL_HOST = '127.0.0.1';
  process.env.SQL_PORT = '3306';
  process.env.SQL_DB = 'task_management';
  process.env.SQL_PASSWORD = '';
  process.env.SQL_USER = 'root';
  app = await createApp();
});
const apiUrl = '/api/v1/tasks/queue';
const mockData = {'192.168.0.1': '', '8.8.8.8': '', '0.0.0.0': ''};

const cache: any = new MockCache(mockData);
const cacheService = new CacheService({
  cache: cache,
  config: {
    taskManagementCache: {
      expiredAfterInSeconds: 3600,
    },
  },
});

describe('task queue endpoint', () => {
  beforeEach(() => {
    app.set('cacheService', cacheService);
  });

  // const OLD_ENV = process.env;
  // beforeAll(async () => {
  //    // await databaseConnection();
  //    jest.resetModules();
  //    process.env = { ...OLD_ENV };
  //    process.env.HTTP_HMAC_PRIVATE_KEY = "thisisprivatekey";
  //    process.env.HTTP_HMAC_PUBLIC_KEY = "thisispublickey";
  //    process.env.JWT_TTL = "8h";
  //    process.env.JWT_SECRET = "superlongsecretkeygoeshereprobablyagoodideatochangethisperproject";
  //    process.env.JWT_KEY = "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";
  //    process.env.WT_ENCRYPTION_ALGORITHM = "aes-256-cbc";
  // });

  afterAll(async () => {
    process.env = OLD_ENV;
    // await databaseDisconnect();
  });

  it('task queue, should return error invalid hmac', async (done) => {
    const body = {
      taskIdentity: 'BSO_100',
    };
    request(app)
      .post(apiUrl)
      .set({
        HTTP_HMAC: 'invalid',
      })
      .send(body)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.status).toBe(401);
        expect(res.body.message).toMatch(/The hmac signature does not match/);
        return done();
      });
  });

  it('task queue, should return error token forbidden', async (done) => {
    const body = {
      taskIdentity: 'BSO_100',
    };
    request(app)
      .post(apiUrl)
      .set({
        HTTP_HMAC:
          '7283145dff4a4c7d642abb264f344b4170dd0f7fadda0e52779649a45ec150b1de8be4ff608c82f13d173f9ecbf479691c7e0058bf55168a179c3b50149569d9',
      })
      .send(body)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.status).toBe(403);
        expect(res.body.message).toMatch(/There is no token found/);
        return done();
      });
  });

  it('task queue, should return error no empty task identity', async (done) => {
    const body = {};
    request(app)
      .post(apiUrl)
      .set({
        HTTP_HMAC:
          '7283145dff4a4c7d642abb264f344b4170dd0f7fadda0e52779649a45ec150b1de8be4ff608c82f13d173f9ecbf479691c7e0058bf55168a179c3b50149569d9',
        Authorization:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImlkIjoyLCJlbWFpbCI6InRhbnBoYXRxdGgzQGdtYWlsLmNvbSJ9LCJpYXQiOjE2MTY2OTM4NzcsImV4cCI6NTIxNjY5Mzg3N30.7tYUv1zKkOt9bg9s934pl2g_eKRdirwegI0m_Re7XSE',
      })
      .send(body)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.status).toBe(400);
        expect(res.body.message[0].constraints.isNotEmpty).toMatch(/taskIdentity should not be empty/);
        return done();
      });
  });

  it('task queue, should return error 404 not found', async (done) => {
    const body = {
      taskIdentity: 'BSO_100',
    };
    request(app)
      .post(apiUrl)
      .set({
        HTTP_HMAC:
          '7283145dff4a4c7d642abb264f344b4170dd0f7fadda0e52779649a45ec150b1de8be4ff608c82f13d173f9ecbf479691c7e0058bf55168a179c3b50149569d9',
        Authorization:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImlkIjoyLCJlbWFpbCI6InRhbnBoYXRxdGgzQGdtYWlsLmNvbSJ9LCJpYXQiOjE2MTY2OTM4NzcsImV4cCI6NTIxNjY5Mzg3N30.7tYUv1zKkOt9bg9s934pl2g_eKRdirwegI0m_Re7XSE',
      })
      .send(body)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.status).toBe(404);
        expect(res.body.message).toMatch(/There is no task found rely on this task identity/);
        return done();
      });
  });
});
