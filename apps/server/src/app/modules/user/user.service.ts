import { eq, desc, inArray, or, sql } from 'drizzle-orm';
import { UsersTable, type SavedUser } from '@org/shared';
import { db } from '../../utils/db.js';
import type { SaveUserDTO, UpdateNameDTO } from './user.dto.js';

// LIKE treats `%` and `_` as wildcards, so escape them in user input;
// the backslash is declared via `ESCAPE '\'` on the LIKE expression.
function escapeLike(input: string): string {
  return input.replace(/[\\%_]/g, (c) => `\\${c}`);
}

class UserService {
  list(q?: string): SavedUser[] {
    const base = db.select().from(UsersTable);
    if (!q) {
      return base.orderBy(desc(UsersTable.createdAt)).all();
    }
    // Lowercase both sides so non-ASCII names (e.g. "Müller") match
    // regardless of input case — SQLite's default LIKE is ASCII-only.
    const pat = `%${escapeLike(q.toLowerCase())}%`;
    return base
      .where(
        or(
          sql`lower(${UsersTable.firstName}) like ${pat} escape '\\'`,
          sql`lower(${UsersTable.lastName}) like ${pat} escape '\\'`,
          sql`lower(${UsersTable.country}) like ${pat} escape '\\'`,
          // Concatenated full name so "John Doe" matches across the space.
          sql`lower(${UsersTable.firstName} || ' ' || ${UsersTable.lastName}) like ${pat} escape '\\'`,
        ),
      )
      .orderBy(desc(UsersTable.createdAt))
      .all();
  }

  getById(id: string): SavedUser | undefined {
    return db.select().from(UsersTable).where(eq(UsersTable.id, id)).get();
  }

  existingIdsMap(ids: string[]): Record<string, true> {
    const rows = db
      .select({ id: UsersTable.id })
      .from(UsersTable)
      .where(inArray(UsersTable.id, ids))
      .all();
    return Object.fromEntries(rows.map((r) => [r.id, true]));
  }

  create(data: SaveUserDTO): SavedUser {
    const [row] = db.insert(UsersTable).values(data).returning().all();
    return row;
  }

  update(id: string, data: UpdateNameDTO): SavedUser | undefined {
    const [row] = db
      .update(UsersTable)
      .set(data)
      .where(eq(UsersTable.id, id))
      .returning()
      .all();
    return row;
  }

  delete(id: string): boolean {
    const removed = db
      .delete(UsersTable)
      .where(eq(UsersTable.id, id))
      .returning({ id: UsersTable.id })
      .all();
    return removed.length > 0;
  }
}

export const userService = new UserService();
