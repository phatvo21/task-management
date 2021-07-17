import * as request from 'supertest';
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
const apiUrl = '/api/v1/auth/register';
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

// beforeAll(async () => {
//
// });
// afterAll(async () => {
//
// });

describe('test register endpoint', () => {
  beforeEach(() => {
    app.set('cacheService', cacheService);
  });

  // const OLD_ENV = process.env;
  //
  // beforeAll(async () => {
  //   // await databaseConnection();
  //   jest.resetModules();
  //   process.env = {...OLD_ENV};
  //   process.env.HTTP_HMAC_PRIVATE_KEY = 'thisisprivatekey';
  //   process.env.HTTP_HMAC_PUBLIC_KEY = 'thisispublickey';
  // });

  afterAll(async () => {
    process.env = OLD_ENV;
    // await databaseDisconnect();
  });

  it('register user, should return error invalid hmac', async (done) => {
    const body = {
      email: 'authtester@gmail.com',
      name: 'tester',
      password: '12345678',
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

  it('register user, should return error invalid email', async (done) => {
    const body = {
      email: 'authtester',
      name: 'tester',
      password: '12345678',
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
        expect(res.status).toBe(400);
        expect(res.body.message[0].constraints.isEmail).toMatch(/email must be an email/);
        return done();
      });
  });

  it('register user, should return error no empty password', async (done) => {
    const body = {
      email: 'authtester@gmail.com',
      name: 'tester',
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
        expect(res.status).toBe(400);
        expect(res.body.message[0].constraints.isNotEmpty).toMatch(/password should not be empty/);
        return done();
      });
  });

  it('register user, should return error no empty email', async (done) => {
    const body = {
      name: 'tester',
      password: '12345678',
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
        expect(res.status).toBe(400);
        expect(res.body.message[0].constraints.isNotEmpty).toMatch(/email should not be empty/);
        return done();
      });
  });
});
