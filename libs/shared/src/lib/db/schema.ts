import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import type { InferSelectModel, InferInsertModel } from 'drizzle-orm';

export const UsersTable = sqliteTable('users', {
  id: text().primaryKey(),
  title: text().notNull(),
  firstName: text().notNull(),
  lastName: text().notNull(),
  gender: text().notNull(),
  email: text().notNull(),
  phone: text().notNull(),
  pictureLarge: text().notNull(),
  pictureThumbnail: text().notNull(),
  country: text().notNull(),
  state: text().notNull(),
  city: text().notNull(),
  streetNumber: integer().notNull(),
  streetName: text().notNull(),
  dobDate: text().notNull(),
  age: integer().notNull(),
  createdAt: integer({ mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date()),
});

export type SavedUser = InferSelectModel<typeof UsersTable>;
export type NewSavedUser = InferInsertModel<typeof UsersTable>;
