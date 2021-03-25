import * as request from "supertest";
import { Server } from "../../src/server";
// @ts-ignore
const { MockCache } = require("../__mocks__/main");
import { CacheService } from "../../src/services/CacheService";
// @ts-ignore
import { databaseConnection } from "../config/database.connection";
// @ts-ignore
import { databaseDisconnect } from "../config/database.disconnection";

const app = new Server().server;
const apiUrl = "/api/v1/tasks/BSO_100/status";
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

describe("task queue endpoint", () => {
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
      process.env.JWT_TTL = "8h";
      process.env.JWT_SECRET = "superlongsecretkeygoeshereprobablyagoodideatochangethisperproject";
      process.env.JWT_KEY = "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";
      process.env.WT_ENCRYPTION_ALGORITHM = "aes-256-cbc";
   });

   afterAll(async () => {
      process.env = OLD_ENV;
      await databaseDisconnect();
   });

   it("task status, should return error invalid hmac", async (done) => {
      request(app)
         .get(apiUrl)
         .set({
            HTTP_HMAC: "invalid",
         })
         .end((err, res) => {
            if (err) return done(err);
            expect(res.status).toBe(401);
            expect(res.body.message).toMatch(/The hmac signature does not match/);
            return done();
         });
   });

   it("task status, should return error token forbidden", async (done) => {
      request(app)
         .get(apiUrl)
         .set({
            HTTP_HMAC:
               "7283145dff4a4c7d642abb264f344b4170dd0f7fadda0e52779649a45ec150b1de8be4ff608c82f13d173f9ecbf479691c7e0058bf55168a179c3b50149569d9",
         })
         .end((err, res) => {
            if (err) return done(err);
            expect(res.status).toBe(403);
            expect(res.body.message).toMatch(/There is no token found/);
            return done();
         });
   });

   it("task queue, should return error 404 not found", async (done) => {
      request(app)
         .get(apiUrl)
         .set({
            HTTP_HMAC:
               "7283145dff4a4c7d642abb264f344b4170dd0f7fadda0e52779649a45ec150b1de8be4ff608c82f13d173f9ecbf479691c7e0058bf55168a179c3b50149569d9",
            Authorization:
               "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImlkIjoyLCJlbWFpbCI6InRhbnBoYXRxdGgzQGdtYWlsLmNvbSJ9LCJpYXQiOjE2MTY2OTM4NzcsImV4cCI6NTIxNjY5Mzg3N30.7tYUv1zKkOt9bg9s934pl2g_eKRdirwegI0m_Re7XSE",
         })
         .end((err, res) => {
            if (err) return done(err);
            expect(res.status).toBe(404);
            expect(res.body.message).toMatch(/There is no task found rely on this task identity/);
            return done();
         });
   });
});
