import { Inject, Injectable } from '@nestjs/common';
import { eq, sql } from 'drizzle-orm';
import { user } from '../../database/schema';
import { AcaraDb } from 'src/database/interface';
import { DrizzleAsyncProvider } from '../drizzle/drizzle.provider';

@Injectable()
export class UsersService {
  constructor(@Inject(DrizzleAsyncProvider) private db: AcaraDb) {}
  async findAll() {
    return this.db.select().from(user).execute();
  }

  async createUser(username: string, password: string) {
    const res = await this.db.insert(user).values({
      username: username,
      password: password,
      displayName: username,
      isActive: true,
    });
    return res;
  }

  async updateUserDisplayName(
    id: number,
    displayName: string,
    isActive: boolean,
  ) {
    const res = await this.db
      .update(user)
      .set({ displayName, isActive })
      .where(eq(user.id, id));
    return res;
  }

  async getUserById(id: string) {
    const res = await this.db
      .select({
        id: user.id,
        username: user.username,
        displayName: user.displayName,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        isActive: user.isActive,
      })
      .from(user)
      .where(sql`${user.id} = ${id}`);
    return res[0];
  }

  async getUserByUsername(username: string) {
    const res = await this.db
      .select({
        id: user.id,
        username: user.username,
        password: user.password,
        displayName: user.displayName,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        isActive: user.isActive,
      })
      .from(user)
      .where(eq(user.username, username));
    if (res.length === 0) return null;
    return res[0];
  }
}
