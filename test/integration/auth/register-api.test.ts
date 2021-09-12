import * as request from 'supertest';
import {createApp} from '../../../src/app';
// @ts-ignore
import {getHmacSignature} from '../../stub/getHmacSignature';
import * as faker from 'faker';
// @ts-ignore
import {factory} from '../../../test/factory/factory';
// @ts-ignore
import {clearDB, reCreateDB} from '../../hooks';
import {runMigration} from '../../../src/databases/RunMigration';

let app;
// Init application and database before testing
beforeAll(async () => {
  // Init App
  app = await createApp();
  // Recreate the database
  await reCreateDB();
  // Run the database migration
  await runMigration();
});

// Clear the database after the test
afterAll(async () => {
  // Clear the database
  await clearDB();
});

// Login endpoint
const apiUrl = '/api/v1/auth/register';

describe('POST - auth/register', () => {
  let body;
  beforeEach(async () => {
    // Prepare the request body for register
    body = {
      name: faker.lorem.word(),
      password: faker.internet.password(),
      email: faker.internet.email(),
    };
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

  it('should return error invalid email', async (done) => {
    body.email = faker.lorem.word();
    request(app)
      .post(apiUrl)
      .set({
        HTTP_HMAC: getHmacSignature(),
      })
      .send(body)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.status).toBe(400);
        expect(res.body.message[0].constraints.isEmail).toMatch(/email must be an email/);
        return done();
      });
  });

  it('should return error empty password', async (done) => {
    delete body.password;
    request(app)
      .post(apiUrl)
      .set({
        HTTP_HMAC: getHmacSignature(),
      })
      .send(body)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.status).toBe(400);
        expect(res.body.message[0].constraints.isNotEmpty).toMatch(/password should not be empty/);
        return done();
      });
  });

  it('should return error empty email', async (done) => {
    delete body.email;
    request(app)
      .post(apiUrl)
      .set({
        HTTP_HMAC: getHmacSignature(),
      })
      .send(body)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.status).toBe(400);
        expect(res.body.message[0].constraints.isNotEmpty).toMatch(/email should not be empty/);
        return done();
      });
  });

  it('should return error if email already exist', async (done) => {
    await factory.build('user', {email: body.email, password: body.password, name: body.name});
    request(app)
      .post(apiUrl)
      .set({
        HTTP_HMAC: getHmacSignature(),
      })
      .send(body)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.status).toBe(409);
        expect(res.body.message).toMatch(/This email already exist!/);
        return done();
      });
  });

  it('should create a new user', async (done) => {
    request(app)
      .post(apiUrl)
      .set({
        HTTP_HMAC: getHmacSignature(),
      })
      .send(body)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.status).toBe(201);
        expect(res.body.data.id).toBeDefined();
        expect(res.body.data.name).toEqual(body.name);
        expect(res.body.data.email).toEqual(body.email.toLowerCase());
        return done();
      });
  });
});
