import { Inject, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { AcaraDb } from 'src/database/interface';
import { event } from '../../database/schema';
import { DrizzleAsyncProvider } from '../drizzle/drizzle.provider';
import { CreateEventPayloadDto } from './event.dto';

export type AcaraEvent = {
  id: number;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
};

export type CreateAcaraEvent = typeof event.$inferInsert;
export type UpdateAcaraEvent = Omit<AcaraEvent, 'name'>;
export type SelectAcaraEvent = typeof event.$inferSelect;

@Injectable()
export class EventService {
  constructor(@Inject(DrizzleAsyncProvider) private db: AcaraDb) {}
  async createEvent(payload: CreateEventPayloadDto) {
    const res = await this.db
      .insert(event)
      .values({
        name: payload.name,
        description: payload.description,
        startDate: payload.startDate,
        endDate: payload.endDate,
      })
      .returning();
    return res;
  }

  async getEventById(id: number) {
    const res = await this.db.select().from(event).where(eq(event.id, id));
    if (res.length === 0) return null;
    return res[0];
  }

  async getEventByName(name: string) {
    const res = await this.db.select().from(event).where(eq(event.name, name));
    if (res.length === 0) return null;
    return res[0];
  }

  async getAllEvents() {
    const res = await this.db.select().from(event);
    return res;
  }

  async updateEvent(payload: UpdateAcaraEvent) {
    const res = await this.db
      .update(event)
      .set({
        description: payload.description,
        startDate: payload.startDate,
        endDate: payload.endDate,
      })
      .where(eq(event.id, payload.id))
      .returning();
    if (res.length === 0) return null;
    return true;
  }

  async deleteEvent(id: number) {
    const res = await this.db.delete(event).where(eq(event.id, id));
    if (res.count === 0) return null;
    return true;
  }
}
