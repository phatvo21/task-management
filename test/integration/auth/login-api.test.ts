import * as request from 'supertest';
import {createApp} from '../../../src/app';
// @ts-ignore
import {getHmacSignature} from '../../stub/getHmacSignature';
import * as faker from 'faker';
// @ts-ignore
import {factory} from '../../../test/factory/factory';
import {genSaltSync, hashSync} from 'bcrypt';
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
const apiUrl = '/api/v1/auth/login';

describe('POST - auth/login', () => {
  let body;
  let user;
  // User credentials
  const password = faker.internet.password();
  const email = faker.internet.email();
  const name = faker.lorem.word();
  const hash = hashSync(password, genSaltSync(10));

  beforeAll(async () => {
    // Create a user before all the tests
    user = await factory.build('user', {email, password: hash, name});
  });

  beforeEach(async () => {
    // Prepare the request body
    body = {
      password,
      email,
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

  it('should return error if invalid credentials', async (done) => {
    body.password = 'thiIsInvalidPassword';

    request(app)
      .post(apiUrl)
      .set({
        HTTP_HMAC: getHmacSignature(),
      })
      .send(body)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.status).toBe(401);
        expect(res.body.data.message).toMatch(/The username or password dose not match./);
        return done();
      });
  });

  it('should login successfully', async (done) => {
    request(app)
      .post(apiUrl)
      .set({
        HTTP_HMAC: getHmacSignature(),
      })
      .send(body)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.status).toBe(200);
        expect(res.body.data.token).toBeDefined();
        expect(res.body.data.status).toEqual(true);
        return done();
      });
  });
});
