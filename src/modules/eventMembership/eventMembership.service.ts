import { Inject, Injectable } from '@nestjs/common';
import { DrizzleAsyncProvider } from '../drizzle/drizzle.provider';
import { AcaraDb } from 'src/database/interface';
import { userEventMembership as membership } from 'src/database/schema';
import { and, eq } from 'drizzle-orm';

export type UserRole = NonNullable<typeof membership.$inferInsert.role>;

@Injectable()
export class EventMembershipService {
  constructor(@Inject(DrizzleAsyncProvider) private db: AcaraDb) {}

  async addMembership(eventId: number, userId: number, role: UserRole) {
    const res = await this.db
      .insert(membership)
      .values({
        eventId,
        userId,
        role,
      })
      .returning();
    if (res.length === 0) return null;
    return res[0];
  }

  async getMemberships(eventId: number) {
    const res = await this.db
      .select()
      .from(membership)
      .where(eq(membership.eventId, eventId));
    return res;
  }

  async updateUserRole(eventId: number, userId: number, role: UserRole) {
    const res = await this.db
      .update(membership)
      .set({
        role,
      })
      .where(
        and(eq(membership.eventId, eventId), eq(membership.userId, userId)),
      );
    if (res.changes === 0) return null;
    return true;
  }

  async deleteMembership(eventId, userId: number) {
    const res = await this.db
      .delete(membership)
      .where(
        and(eq(membership.eventId, eventId), eq(membership.userId, userId)),
      );
    if (res.changes === 0) return null;
    return true;
  }
}
