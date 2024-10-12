import { DrizzleAsyncProvider } from '../drizzle/drizzle.provider';
import { AcaraDb } from 'src/database/interface';
import { lnfEntry } from 'src/database/schema';
import { eq } from 'drizzle-orm';
import { Inject, Injectable } from '@nestjs/common';
import { ItemType } from './lnfEntry.dto';

@Injectable()
export class InventoryService {
  constructor(@Inject(DrizzleAsyncProvider) private readonly db: AcaraDb) {}

  async createItemEntry(
    type: ItemType,
    name: string,
    description: string,
    state: boolean = true,
    metadata: Record<string, unknown> = {},
  ) {
    const now = new Date();
    const res = await this.db
      .insert(lnfEntry)
      .values({
        name,
        description,
        type,
        state,
        createdAt: now,
        updatedAt: now,
        metadata,
      })
      .returning();
    if (!res) throw new Error('error when adding item entry');
    return res;
  }

  async getItemEntry(id: number) {
    const item = await this.db
      .select()
      .from(lnfEntry)
      .where(eq(lnfEntry.id, id))
      .execute();
    if (item.length === 0) return null;
    return item[0];
  }

  async getAllItemEntries() {
    const items = await this.db.select().from(lnfEntry).execute();
    return items;
  }

  async getAllItemEntriesByType(type: ItemType) {
    const items = await this.db
      .select()
      .from(lnfEntry)
      .where(eq(lnfEntry.type, type))
      .execute();
    return items;
  }

  async updateItemEntry(
    id: number,
    name?: string,
    description?: string,
    state?: boolean,
    metadata?: Record<string, any>,
  ) {
    const now = new Date();
    const updateValues: Record<string, any> = {
      updatedAt: now,
    };
    if (name !== undefined) {
      updateValues.name = name;
    }
    if (description !== undefined) {
      updateValues.description = description;
    }
    if (state !== undefined) {
      updateValues.state = state;
    }
    if (metadata !== undefined) {
      updateValues.metadata = metadata;
    }
    const res = await this.db
      .update(lnfEntry)
      .set(updateValues)
      .where(eq(lnfEntry.id, id))
      .returning();
    if (!res) throw new Error('error when updating item entry');
    return res;
  }

  async deleteItemEntry(id: number) {
    const now = new Date();
    const res = await this.db
      .update(lnfEntry)
      .set({
        state: false,
        updatedAt: now,
      })
      .where(eq(lnfEntry.id, id))
      .returning();
    if (!res) throw new Error('error when deleting item entry');
    return res;
  }

  async hardDeleteItemEntry(id: number) {
    const res = await this.db
      .delete(lnfEntry)
      .where(eq(lnfEntry.id, id))
      .execute();
    if (!res) throw new Error('error when hard deleting item entry');
    return res;
  }
}
