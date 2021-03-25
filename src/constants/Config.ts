export const config = {
   redis: {
      url: process.env.REDIS_URL || "redis://127.0.0.1",
   },
   configCache: {
      taskManagementCache: {
         expiredAfterInSeconds: 720,
      },
   },
   cacheService: "cacheService",
   pubSubService: "pubSubService",
};

export function openApiCredentials(): any {
   return { [process.env.OPEN_API_USERNAME || "task"]: process.env.OPEN_API_PASSWORD || "management" };
}
