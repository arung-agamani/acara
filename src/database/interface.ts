import { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import * as schema from './schema';

export type AcaraDb = BetterSQLite3Database<typeof schema>;
// const betterSqlite = new Database('./data.db');
// export const db: BetterSQLite3Database<typeof schema> = drizzle(betterSqlite, {
//   schema: schema,
// });
