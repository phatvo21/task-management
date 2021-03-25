export const config = {
   redis: {
      url: redisUrl() || "redis://127.0.0.1",
   },
   configCache: {
      taskManagementCache: {
         expiredAfterInSeconds: 86400,
      },
   },
   cacheService: "cacheService",
   pubSubService: "pubSubService",
   taskPubSubChannel: "taskChannel",
};

export function openApiCredentials(): any {
   return { [process.env.OPEN_API_USERNAME || "task"]: process.env.OPEN_API_PASSWORD || "management" };
}

export function redisUrl(): string {
   return process.env.REDIS_URL;
}

export function httpHmacPrivateKey(): string {
   return process.env.HTTP_HMAC_PRIVATE_KEY;
}

export function httpHmacPublicKey(): string {
   return process.env.HTTP_HMAC_PUBLIC_KEY;
}
