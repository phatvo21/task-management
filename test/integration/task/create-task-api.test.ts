import * as request from 'supertest';
import {createApp} from '../../../src/app';
// @ts-ignore
import {getHmacSignature} from '../../stub/getHmacSignature';
import * as faker from 'faker';
// @ts-ignore
import {factory} from '../../../test/factory/factory';
// @ts-ignore
import {getAccessToken} from '../../stub/getAccessToken';
// @ts-ignore
const {MockCache} = require('../../__mocks__/main');
// @ts-ignore
import {CacheService} from '../../../src/services/CacheService';
// @ts-ignore
import {clearDB, reCreateDB} from '../../hooks';
import {runMigration} from '../../../src/databases/RunMigration';

const mockData = {'192.168.0.1': '', '8.8.8.8': '', '0.0.0.0': ''};

let app;
beforeAll(async () => {
  app = await createApp();
  await reCreateDB();
  await runMigration();
});

afterAll(async () => {
  await clearDB();
});

const cache: any = new MockCache(mockData);
const cacheService = new CacheService({
  cache: cache,
  config: {
    taskManagementCache: {
      expiredAfterInSeconds: 3600,
    },
  },
});

const apiUrl = '/api/v1/tasks';

describe('POST - tasks', () => {
  let body;
  let user;
  const email = faker.internet.email();
  const password = faker.internet.password();
  const name = faker.lorem.word();

  beforeAll(async () => {
    user = await factory.build('user', {email, password, name});
  });

  beforeEach(async () => {
    body = {
      title: faker.lorem.word(),
      taskIdentity: faker.lorem.word(),
      description: faker.lorem.word(),
    };
    app.set('cacheService', cacheService);
  });

  it('should return error invalid hmac', async (done) => {
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

  it('should return error invalid access token', async (done) => {
    request(app)
      .post(apiUrl)
      .set({
        HTTP_HMAC: getHmacSignature(),
        Authorization: 'wrongstokens',
      })
      .send(body)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.status).toBe(401);
        expect(res.body.message).toMatch(/The token is invalid/);
        return done();
      });
  });

  it('should return error empty title', async (done) => {
    delete body.title;
    request(app)
      .post(apiUrl)
      .set({
        HTTP_HMAC: getHmacSignature(),
        Authorization: getAccessToken(user),
      })
      .send(body)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.status).toBe(400);
        expect(res.body.message[0].constraints.isNotEmpty).toMatch(/title should not be empty/);
        return done();
      });
  });

  it('should return error empty taskIdentity', async (done) => {
    delete body.taskIdentity;
    request(app)
      .post(apiUrl)
      .set({
        HTTP_HMAC: getHmacSignature(),
        Authorization: getAccessToken(user),
      })
      .send(body)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.status).toBe(400);
        expect(res.body.message[0].constraints.isNotEmpty).toMatch(/taskIdentity should not be empty/);
        return done();
      });
  });

  it('should create a task', async (done) => {
    request(app)
      .post(apiUrl)
      .set({
        HTTP_HMAC: getHmacSignature(),
        Authorization: getAccessToken(user),
      })
      .send(body)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.status).toBe(201);
        return done();
      });
  });
});
