require('dotenv').config();
import {RouteHandle} from 'utils/Utils';
import {Middleware} from 'middlewares/Middleware';
import {useContainer} from 'routing-controllers';
import {Container} from 'typedi';
import {OpenApiConfiguration} from 'utils/OpenApiConfiguration';
import * as express from 'express';
import {Express} from 'express';
import {connect} from 'databases/Connection';
import {runMigration} from 'databases/RunMigration';

export async function createApp(): Promise<Express> {
  const app = express();
  app.set('port', process.env.SERVER_PORT || 3000);
  RouteHandle.applyMiddleware(Middleware.handle(), app);
  RouteHandle.enableCors(app);
  useContainer(Container);
  const routingControllersOptions = RouteHandle.RoutingControllersOptions();
  OpenApiConfiguration.openApiConfiguration(app);

  // Database connection
  await connect();
  // Execute the migration scripts
  await runMigration();

  RouteHandle.applyRoutes(app, routingControllersOptions);

  return app;
}
