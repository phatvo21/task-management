import { NextFunction, Request, Response } from "express";
import { config } from "constants/Config";
import { CacheHandle } from "middlewares/CacheHandle";

export class RemoveDraftTask implements CacheHandle {
   public use(request: Request, response: Response, next: NextFunction): void {
      this.removeDraftTask(request, response, next).then();
   }

   public async removeDraftTask(request: Request, response: Response, next: NextFunction): Promise<void> {
      const result = response.locals.data;
      if (result) {
         const { app } = request;
         const cacheService = app.get(config.cacheService).taskCache;
         await cacheService.remove(result.taskIdentity);
      }
      return next();
   }
}
