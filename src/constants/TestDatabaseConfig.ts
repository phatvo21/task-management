import { createConnection, ConnectionOptions, Connection } from "typeorm";

const testDatabaseConnection = async (): Promise<Connection> => {
   const options: ConnectionOptions = {
      type: "sqlite",
      database: ":memory",
      logging: false,
      synchronize: true,
      dropSchema: true,
      entities: ["src/database/entities/**/*.ts"],
      migrationsRun: false,
   };
   return createConnection(options);
};
export { testDatabaseConnection };
