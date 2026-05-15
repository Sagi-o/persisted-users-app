import { eq, desc } from 'drizzle-orm';
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
