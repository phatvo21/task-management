import {createConnection, Connection} from 'typeorm';
import {MysqlDriver} from 'typeorm/driver/mysql/MysqlDriver';
import {Pool} from 'mysql';
import {OrmConfig} from 'constants/TypeormConfig';
import {logger} from 'logging/Logger';
import {sleep} from 'helpers/Helpers';

// Handles unstable connection lost to DB
function connectionGuard(connection: Connection) {
  // Access underlying pg driver
  if (connection.driver instanceof MysqlDriver) {
    const pool = connection.driver.pool as Pool;

    // Add handler on pool error event
    pool.on('error', async (err) => {
      logger.error(err, 'Connection pool erring out, Reconnecting...');
      try {
        await connection.close();
      } catch (innerErr) {
        logger.error(innerErr, 'Failed to close connection');
      }
      while (!connection.isConnected) {
        try {
          await connection.connect();
          logger.info('Reconnected DB');
        } catch (error) {
          logger.error(error, 'Reconnect Error');
        }

        if (!connection.isConnected) {
          // Throttle retry
          await sleep(500);
        }
      }
    });
  }
}

// 1. Wait for db to come online and connect
// 2. On connection instability, able to reconnect
// 3. The app should never die due to connection issue
export async function connect() {
  let connection: Connection;
  let isConnected = false;

  logger.info('Connecting to DB...');
  while (!isConnected) {
    try {
      connection = await createConnection(OrmConfig);
      isConnected = connection.isConnected;
    } catch (error) {
      logger.error(error, 'createConnection Error');
    }

    if (!isConnected) {
      // Throttle retry
      await sleep(500);
    }
  }

  logger.info('Connected to DB');
  connectionGuard(connection);
}
