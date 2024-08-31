import { defineConfig } from 'drizzle-kit';

export const dbConfig = {
  host: 'localhost',
  port: 5432,
  database: 'acara_development',
  ssl: false,
};

export default defineConfig({
  schema: './src/database/schema.ts',
  dialect: 'postgresql',
  dbCredentials: dbConfig,
  out: './drizzle',
  verbose: true,
  strict: true,
});
