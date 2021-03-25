import { NextFunction, Request, Response } from "express";
import { config } from "constants/Config";
import { CacheHandle } from "middlewares/CacheHandle";

export class DraftTask implements CacheHandle {
   public use(request: Request, response: Response, next: NextFunction): void {
      this.storeTaskInCache(request, response, next).then();
   }

   public async storeTaskInCache(request: Request, response: Response, next: NextFunction): Promise<void> {
      const result = response.locals.data;
      if (result) {
         const { app } = request;
         const service = app.get(config.cacheService).taskCache;
         const serialized = JSON.stringify(result);
         await service.push(serialized, result.taskIdentity);
      }
      return next();
   }
}
