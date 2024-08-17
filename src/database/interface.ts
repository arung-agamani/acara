import { BetterSQLite3Database, drizzle } from 'drizzle-orm/better-sqlite3';
import * as Database from 'better-sqlite3';
import * as schema from './schema';
const betterSqlite = new Database('./data.db');
export const db: BetterSQLite3Database<typeof schema> = drizzle(betterSqlite, {
  schema: schema,
});
