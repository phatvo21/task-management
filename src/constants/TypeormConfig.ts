import {ConnectionOptions} from 'typeorm';

const isProd = process.env.NODE_ENV === 'production';

export const OrmConfig = {
  type: 'mysql',
  host: process.env.SQL_HOST,
  port: parseInt(process.env.SQL_PORT),
  database: process.env.SQL_DB,
  password: process.env.SQL_PASSWORD,
  username: process.env.SQL_USER,
  synchronize: false, // if true will change database structure
  logging: false,
  migrationsRun: false,
  migrations: [
    ...(!isProd ? ['src/databases/migrations/**/!(*.test.ts)'] : ['dist/databases/migrations/**/!(*.test.js)']),
  ],
  entities: [...(!isProd ? ['src/databases/entities/**/!(*.test.ts)'] : ['dist/databases/entities/**/!(*.test.js)'])],
  subscribers: [],
  cli: {
    entitiesDir: 'src/databases/entities',
    migrationsDir: 'src/databases/migrations',
  },
} as ConnectionOptions;
