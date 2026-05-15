import { eq, desc, inArray } from 'drizzle-orm';
import { UsersTable, type SavedUser } from '@org/shared';
import { db } from '../../utils/db.js';
import type { SaveUserDTO, UpdateNameDTO } from './user.dto.js';

class UserService {
  list(): SavedUser[] {
    return db.select().from(UsersTable).orderBy(desc(UsersTable.createdAt)).all();
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
