import * as http from 'http';
import {Express} from 'express';
import {Server} from 'http';
import {logger} from 'logging/Logger';
import * as P from 'bluebird';

const SERVER_SHUTDOWN_TIMEOUT_MS = 10_000;

export class ServerHandler {
  public static setupProcessEventListeners(): void {
    process.on('unhandledRejection', (reason: any) => {
      logger.warn({reason_object: reason}, 'encountered unhandled rejection');
      ServerHandler.logAndExitProcess(1);
    });

    process.on('uncaughtException', (err: Error) => {
      logger.error(err, 'encountered uncaught exception');
      ServerHandler.logAndExitProcess(1);
    });

    process.on('warning', (warning: Error) => {
      logger.warn(
        {
          warning_object: warning,
        },
        'encountered warning',
      );
    });

    process.setMaxListeners(0);
  }

  public static setupSignalHandlers(server: Server): void {
    process.on('SIGTERM', async () => {
      logger.info('Received signal: SIGTERM');
      try {
        await ServerHandler.shutdownServerWithTimeout(server);
        ServerHandler.logAndExitProcess(0);
      } catch (err) {
        logger.error(err, 'Failed to shutdown server');
        ServerHandler.logAndExitProcess(1);
      }
    });
    process.on('SIGINT', async () => {
      logger.info('Received signal: SIGINT');
      try {
        await ServerHandler.shutdownServerWithTimeout(server);
        ServerHandler.logAndExitProcess(0);
      } catch (err) {
        logger.error(err, 'Failed to shutdown server');
        ServerHandler.logAndExitProcess(1);
      }
    });
  }

  public static async shutdownServerWithTimeout(server: http.Server): Promise<unknown> {
    return Promise.race([
      P.fromCallback((cb) => server.close(cb)),
      new Promise((resolve, reject) =>
        setTimeout(() => reject(Error('Timeout shutting server')), SERVER_SHUTDOWN_TIMEOUT_MS),
      ),
    ]);
  }

  public static logAndExitProcess(exitCode: number): void {
    logger.info(
      {
        exit_code_number: exitCode,
      },
      'Exiting process',
    );
    process.exit(exitCode);
  }

  public static createExpressServer(router: Express): Server {
    return http.createServer(router);
  }

  public static listenServer(router: Express, server: Server): void {
    try {
      const {PORT = process.env.SERVER_PORT} = process.env;
      server.setTimeout(parseInt(process.env.SERVER_TIMEOUT));
      const listenServer = server.listen(PORT, () => {
        logger.info(
          {
            port_number: PORT,
            env_string: process.env.NODE_ENV,
          },
          'Started express server',
        );
      });
      ServerHandler.setupSignalHandlers(listenServer);
      ServerHandler.setupProcessEventListeners();
    } catch (err) {
      logger.error(err, 'error caught in server.ts');
    }
  }
}
