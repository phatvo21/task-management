import { Router } from "express";
import { RoutingControllersOptions, useExpressServer } from "routing-controllers";
import { Express } from "express";
import { ErrorHandler } from "middlewares/ErrorHandler";
import { ApiVersion } from "constants/ApiVersion";
import { Environment } from "constants/Environment";
import { TaskController } from "components/task/TaskController";
import { AuthController } from "components/auth/AuthController";
import { HmacSignatureHandler } from "middlewares/HmacSignatureHandler";

export class RouteHandle {
   public static applyMiddleware = (middlewareWrappers: Wrapper[], router: Router) => {
      for (const wrapper of middlewareWrappers) {
         wrapper(router);
      }
   };

   public static enableCors(server: Express): Express {
      return server.use(function (req, res, next) {
         res.setHeader("Access-Control-Allow-Origin", "*");
         res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
         res.setHeader("Access-Control-Allow-Headers", "*");
         next();
      });
   }

   public static RoutingControllersOptions(): RoutingControllersOptions {
      return {
         controllers: [TaskController, AuthController],
         middlewares: [ErrorHandler, HmacSignatureHandler],
         routePrefix: ApiVersion.Version,
         cors: true,
         defaults: {
            nullResultCode: 404,
            undefinedResultCode: 204,
         },
         defaultErrorHandler: false,
         classTransformer: true,
         development: process.env.NODE_ENV === Environment.Development,
      };
   }

   public static applyRoutes(router: Express, options: RoutingControllersOptions): Express {
      return useExpressServer(router, options);
   }
}

export type Wrapper = (router: Router) => void;
