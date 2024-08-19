import { Inject, Injectable } from '@nestjs/common';
import { and, eq } from 'drizzle-orm';
import { AcaraDb } from 'src/database/interface';
import { eventInfo } from 'src/database/schema';
import { DrizzleAsyncProvider } from 'src/modules/drizzle/drizzle.provider';

@Injectable()
export class EventDetailsService {
  constructor(@Inject(DrizzleAsyncProvider) private db: AcaraDb) {}
  // TODO: add hook check if event exist in first place

  async getEventDetail(id: number) {
    const res = await this.db
      .select({
        key: eventInfo.key,
        value: eventInfo.value,
      })
      .from(eventInfo)
      .where(eq(eventInfo.eventId, id));
    return res;
  }

  async setEventDetail(id: number, key: string, value: string) {
    const res = await this.db
      .insert(eventInfo)
      .values({
        eventId: id,
        key,
        value,
      })
      .onConflictDoUpdate({
        target: [eventInfo.eventId, eventInfo.key],
        set: { value },
      });
    // there should be one row affected only
    if (res.changes === 1) return true;
    return false;
  }

  async deleteEventDetail(id: number, key: string) {
    const res = await this.db
      .delete(eventInfo)
      .where(and(eq(eventInfo.eventId, id), eq(eventInfo.key, key)));
    if (res.changes === 1) return true;
    return false;
  }
}
