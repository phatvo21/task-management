import {getConnection} from 'typeorm';

// Execute the migration scripts
export async function runMigration() {
  const connection = getConnection();
  return await connection.runMigrations();
}
