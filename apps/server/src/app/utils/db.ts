import path from 'node:path';
import fs from 'node:fs';
import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { schema } from '@org/shared';

const dbPath =
  process.env.DATABASE_URL ??
  path.resolve(process.cwd(), 'apps/server/data/app.db');

fs.mkdirSync(path.dirname(dbPath), { recursive: true });

const sqlite = new Database(dbPath);
// concurrent reads with a single writer (default DELETE mode locks the whole db)
sqlite.pragma('journal_mode = WAL');
// SQLite ships with FK checks off; opt in so references() is enforced, not documentation
sqlite.pragma('foreign_keys = ON');

export const db = drizzle(sqlite, { schema });
