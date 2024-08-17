import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/database/schema.ts',
  dialect: 'sqlite',
  dbCredentials: {
    url: './data.db',
  },
  out: './drizzle',
  verbose: true,
  strict: true,
});
