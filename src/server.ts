import * as express from "express";
import { Express } from "express";
import "reflect-metadata";
import { useContainer } from "routing-controllers";
import { Container } from "typedi";
import { Middleware } from "@middlewares/Middleware";
import { RouteHandle } from "@utils/Utils";
import { ServerHandler } from "@utils/ServerHandler";
import * as dotenv from "dotenv";
require("events").EventEmitter.prototype._maxListeners = 100;
import { OpenApiConfiguration } from "@utils/OpenApiConfiguration";
import { config } from "@constants/Config";
import { CacheStorage } from "@utils/cache-storage/CacheStorage";
import { CacheService } from "@services/CacheService";
import { CacheServiceModel } from "@utils/cache-storage/model/CacheServiceModel";
import { PubSubEventsService } from "@services/PubSubEventsService";
import { Kernel } from "@consoles/Kernel";
import { connectToDatabase } from "@databases/Connection";

export class Server {
   public server: Express = express();

   constructor() {
      this.serverRendering();
   }

   public serverRendering(): void {
      dotenv.config();

      RouteHandle.applyMiddleware(Middleware.handle(), this.server);
      RouteHandle.enableCors(this.server);
      useContainer(Container);
      const routingControllersOptions = RouteHandle.RoutingControllersOptions();
      RouteHandle.applyRoutes(this.server, routingControllersOptions);
      OpenApiConfiguration.openApiConfiguration(this.server, routingControllersOptions);

      const server = ServerHandler.createExpressServer(this.server);
      connectToDatabase()
         .then(() => {
            ServerHandler.listenServer(this.server, server);
            const cache = new CacheStorage(config.redis.url);
            const cacheService = new CacheService(new CacheServiceModel(cache, config.configCache));
            this.server.set(config.cacheService, cacheService);
            const pubsubService = new PubSubEventsService(config.redis.url);
            this.server.set(config.pubSubService, pubsubService);
            Kernel.getInstance().execute(pubsubService);
         })
         .catch((err) => {
            server.emit("error", err);
         });
   }
}
