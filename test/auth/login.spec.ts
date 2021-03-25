import * as request from "supertest";
import { Server } from "../../src/server";
const { MockCache } = require("../__mocks__/main");
import { CacheService } from "../../src/services/CacheService";
// @ts-ignore
import { databaseConnection } from "../config/database.connection";
// @ts-ignore
import { databaseDisconnect } from "../config/database.disconnection";

const app = new Server().server;
const apiUrl = "/api/v1/auth/login";
const mockData = { "192.168.0.1": "", "8.8.8.8": "", "0.0.0.0": "" };

const cache: any = new MockCache(mockData);
const cacheService = new CacheService({
   cache: cache,
   config: {
      taskManagementCache: {
         expiredAfterInSeconds: 3600,
      },
   },
});

describe("test login endpoint", () => {
   beforeEach(async () => {
      app.set("cacheService", cacheService);
   });

   const OLD_ENV = process.env;

   beforeAll(async () => {
      await databaseConnection();
      jest.resetModules();
      process.env = { ...OLD_ENV };
      process.env.HTTP_HMAC_PRIVATE_KEY = "thisisprivatekey";
      process.env.HTTP_HMAC_PUBLIC_KEY = "thisispublickey";
   });

   afterAll(async () => {
      process.env = OLD_ENV;
      await databaseDisconnect();
   });

   it("user login, should return error invalid hmac", async (done) => {
      const body = {
         email: "authtester@gmail.com",
         password: "12345678",
      };
      request(app)
         .post(apiUrl)
         .set({
            HTTP_HMAC: "invalid",
         })
         .send(body)
         .end((err, res) => {
            if (err) return done(err);
            expect(res.status).toBe(401);
            expect(res.body.message).toMatch(/The hmac signature does not match/);
            return done();
         });
   });

   it("user login, should return error invalid email", async (done) => {
      const body = {
         email: "authtester",
         password: "12345678",
      };
      request(app)
         .post(apiUrl)
         .set({
            HTTP_HMAC:
               "7283145dff4a4c7d642abb264f344b4170dd0f7fadda0e52779649a45ec150b1de8be4ff608c82f13d173f9ecbf479691c7e0058bf55168a179c3b50149569d9",
         })
         .send(body)
         .end((err, res) => {
            if (err) return done(err);
            expect(res.status).toBe(400);
            expect(res.body.message[0].constraints.isEmail).toMatch(/email must be an email/);
            return done();
         });
   });

   it("user login, should return error no empty password", async (done) => {
      const body = {
         email: "authtester@gmail.com",
      };
      request(app)
         .post(apiUrl)
         .set({
            HTTP_HMAC:
               "7283145dff4a4c7d642abb264f344b4170dd0f7fadda0e52779649a45ec150b1de8be4ff608c82f13d173f9ecbf479691c7e0058bf55168a179c3b50149569d9",
         })
         .send(body)
         .end((err, res) => {
            if (err) return done(err);
            expect(res.status).toBe(400);
            expect(res.body.message[0].constraints.isNotEmpty).toMatch(/password should not be empty/);
            return done();
         });
   });

   it("user login, should return error no empty email", async (done) => {
      const body = {
         password: "12345678",
      };
      request(app)
         .post(apiUrl)
         .set({
            HTTP_HMAC:
               "7283145dff4a4c7d642abb264f344b4170dd0f7fadda0e52779649a45ec150b1de8be4ff608c82f13d173f9ecbf479691c7e0058bf55168a179c3b50149569d9",
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
