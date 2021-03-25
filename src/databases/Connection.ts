import { createConnection, Connection } from "typeorm";
import { databaseConnectionOptions } from "@constants/TypeormConfig";

const connectToDatabase = async (): Promise<Connection> => {
   const mode = process.env.NODE_ENV as "production" | "development";
   console.info("\x1b[7m", mode, "\x1b[0m");
   console.log(databaseConnectionOptions(mode));
   const connection = await createConnection(databaseConnectionOptions(mode));
   // connection.undoLastMigration();
   return connection;
};
export { connectToDatabase };
