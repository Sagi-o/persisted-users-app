import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './apps/server/migrations',
  schema: './libs/shared/src/lib/db/schema.ts',
  dialect: 'sqlite',
  dbCredentials: {
    url: './apps/server/data/app.db',
  },
});
