import * as request from 'supertest';
import {createApp} from '../../../src/app';
// @ts-ignore
import {getHmacSignature} from '../../stub/getHmacSignature';
import * as faker from 'faker';
// @ts-ignore
import {factory} from '../../../test/factory/factory';
// @ts-ignore
import {getAccessToken} from '../../stub/getAccessToken';

let app;
beforeAll(async () => {
  app = await createApp();
});

describe('GET - /:taskIdentity/status', () => {
  let user;
  let task;
  const password = faker.internet.password();
  const email = faker.internet.email();
  const name = faker.lorem.word();
  const taskIdentity = faker.lorem.word();
  const title = faker.lorem.word();
  const description = faker.lorem.word();
  let createTaskBody = {taskIdentity, title, description};
  const apiUrl = `/api/v1/tasks/${taskIdentity}/status`;

  beforeAll(async () => {
    user = await factory.build('user', {email, password, name});
    task = await factory.build('task', createTaskBody);
  });

  it('should return error invalid hmac', async (done) => {
    request(app)
      .get(apiUrl)
      .set({
        HTTP_HMAC: 'invalid',
      })
      .end((err, res) => {
        if (err) return done(err);
        expect(res.status).toBe(401);
        expect(res.body.message).toMatch(/The hmac signature does not match/);
        return done();
      });
  });

  it('should return error invalid access token', async (done) => {
    request(app)
      .get(apiUrl)
      .set({
        HTTP_HMAC: getHmacSignature(),
        Authorization: 'wrongstokens',
      })
      .end((err, res) => {
        if (err) return done(err);
        expect(res.status).toBe(401);
        expect(res.body.message).toMatch(/The token is invalid/);
        return done();
      });
  });

  it('should fetch the task status', async (done) => {
    request(app)
      .get(apiUrl)
      .set({
        HTTP_HMAC: getHmacSignature(),
        Authorization: getAccessToken(user),
      })
      .end((err, res) => {
        if (err) return done(err);
        expect(res.status).toBe(200);
        expect(res.body.data.id).toBeDefined();
        expect(res.body.data.title).toEqual(title);
        expect(res.body.data.taskIdentity).toEqual(taskIdentity);
        expect(res.body.data.createdAt).toBeDefined();
        expect(res.body.data.updatedAt).toBeDefined();
        return done();
      });
  });
});
