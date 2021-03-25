import { validationMetadatasToSchemas } from "class-validator-jsonschema";
import { defaultMetadataStorage } from "class-transformer/storage";
import { getMetadataArgsStorage, RoutingControllersOptions } from "routing-controllers";
import { routingControllersToSpec } from "routing-controllers-openapi";
import * as basicAuth from "express-basic-auth";
import { Express } from "express";
import * as swaggerUiExpress from "swagger-ui-express";
import { openApiCredentials } from "@constants/Config";

export class OpenApiConfiguration {
   public static openApiConfiguration(server: Express, routingControllersOptions: RoutingControllersOptions): void {
      const schemas = validationMetadatasToSchemas({
         classTransformerMetadataStorage: defaultMetadataStorage,
         refPointerPrefix: "#/components/schemas/",
      });
      const storage = getMetadataArgsStorage();
      const spec = routingControllersToSpec(storage, routingControllersOptions, {
         components: {
            schemas,
            securitySchemes: {
               basicAuth: {
                  scheme: "basic",
                  type: "http",
               },
            },
         },
         info: {
            description: "Task Management Open Api",
            title: "APIs",
            version: "1.0.0",
         },
      });

      server.use(
         "/api/docs",
         basicAuth({
            users: openApiCredentials(),
            challenge: true,
         }),
         swaggerUiExpress.serve,
         swaggerUiExpress.setup(spec),
      );
   }
}
