// import { PGlite } from '@electric-sql/pglite';
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import * as schema from '../../database/schema';
import { dbConfig } from 'src/database/drizzle.config';

export const DrizzleAsyncProvider = 'drizzleProvider';

export const drizzleProvider = [
  {
    provide: DrizzleAsyncProvider,
    useFactory: async () => {
      const sqlite = postgres(dbConfig);
      const db = drizzle(sqlite, { schema });
      return db;
    },
    exports: [DrizzleAsyncProvider],
  },
];
