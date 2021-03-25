import { createConnection, ConnectionOptions, Connection } from "typeorm";

const databaseConnection = async (): Promise<Connection> => {
   const options: ConnectionOptions = {
      type: "sqlite",
      database: ":memory",
      logging: false,
      synchronize: true,
      dropSchema: true,
      entities: ["src/databases/entities/**/*.ts"],
   };
   console.log(options);
   return createConnection(options);
};
export { databaseConnection };
