import { ConnectionOptions } from "typeorm";
import * as parser from "pg-connection-string";

const tryParse = (): parser.ConnectionOptions => {
   let parsed: parser.ConnectionOptions;
   try {
      parsed = parser.parse(process.env.DATABASE_URL);
   } catch (err) {
      parsed = { user: "root", database: "database", host: "localhost", password: "" };
   }
   return parsed;
};

const databaseConnectionOptions = (mode: string): ConnectionOptions => {
   const isTest = mode === "test";
   const connectionString = !isTest
      ? tryParse()
      : { user: "root", database: "database", host: "localhost", password: "" };

   const isProd = mode === "production";

   const ssl = process.env.DATABASE_SSL === "true";

   const { user, password, database, host } = connectionString;
   return {
      type: "mysql",
      host,
      database,
      password,
      username: user,
      synchronize: false, // if true will change database structure
      logging: false,
      entities: [...(!isProd ? ["src/database/entities/**/!(*.test.ts)"] : ["dist/database/entities/**/!(*.test.js)"])],
      extra: { ssl },
      migrationsRun: true,
      migrations: [
         ...(!isProd ? ["src/database/migrations/**/!(*.test.ts)"] : ["dist/database/migrations/**/!(*.test.js)"]),
      ],
      cli: {
         entitiesDir: "src/databases/entities",
         migrationsDir: "src/databases/migrations",
      },
   };
};
export { databaseConnectionOptions };
