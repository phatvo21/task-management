import * as request from 'supertest';
import {createApp} from '../../../src/app';
// @ts-ignore
import {getHmacSignature} from '../../stub/getHmacSignature';
import * as faker from 'faker';
// @ts-ignore
import {factory} from '../../../test/factory/factory';
// @ts-ignore
import {getAccessToken} from '../../stub/getAccessToken';
import {CacheService} from '../../../src/services/CacheService';
import {config} from '../../../src/constants/Config';
// @ts-ignore
const {MockCache} = require('../../__mocks__/main');

const mockData = {'192.168.0.1': '', '8.8.8.8': '', '0.0.0.0': ''};

let app;
beforeAll(async () => {
  app = await createApp();
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

const apiUrl = '/api/v1/tasks/queue';

describe('POST - tasks/queue', () => {
  let body;
  let user;
  let task;
  const password = faker.internet.password();
  const email = faker.internet.email();
  const name = faker.lorem.word();
  const taskIdentity = faker.lorem.word();
  const title = faker.lorem.word();
  const description = faker.lorem.word();
  let createTaskBody = {taskIdentity, title, description};

  beforeAll(async () => {
    user = await factory.build('user', {email, password, name});
    task = await factory.build('task', createTaskBody);
  });

  beforeEach(async () => {
    body = {
      taskIdentity,
    };
    app.set('cacheService', cacheService);
    app.get(config.cacheService).taskCache = jest.fn().mockReturnValue({});
    const service = app.get(config.cacheService).taskCache;
    service.findOne = jest.fn().mockReturnValue(JSON.stringify(createTaskBody));
    service.remove = jest.fn().mockReturnValue({});
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

  it('should send the task in queue', async (done) => {
    request(app)
      .post(apiUrl)
      .set({
        HTTP_HMAC: getHmacSignature(),
        Authorization: getAccessToken(user),
      })
      .send(body)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.status).toBe(200);
        return done();
      });
  });
});
