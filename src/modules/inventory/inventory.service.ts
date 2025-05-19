import { DrizzleAsyncProvider } from '../drizzle/drizzle.provider';
import { AcaraDb } from 'src/database/interface';
import { lnfEntry } from 'src/database/schema';
import { eq } from 'drizzle-orm';
import { Inject, Injectable } from '@nestjs/common';
import { ItemType, CreateInventoryDto } from './lnfEntry.dto';

@Injectable()
export class InventoryService {
  constructor(@Inject(DrizzleAsyncProvider) private readonly db: AcaraDb) {}

  async createItemEntry(
    type: ItemType,
    name: string,
    description: string,
    state: boolean = true,
    metadata: Record<string, unknown> = {},
    clientId: string,
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
        externalId: clientId,
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
    metadata?: Record<string, unknown>,
  ) {
    const now = new Date();
    const updateValues: Record<string, unknown> = {
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

  async syncInventoryEntries(entries: CreateInventoryDto[]) {
    const now = new Date();
    const inserted: any[] = [];
    for (const entry of entries) {
      // Check if entry with externalId exists
      const existing = await this.db
        .select()
        .from(lnfEntry)
        .where(eq(lnfEntry.externalId, entry.externalId))
        .execute();
      if (existing.length === 0) {
        // Insert new entry
        const itemType = entry.type as ItemType;
        if (!Object.values(ItemType).includes(itemType)) {
          // skip invalid type
          continue;
        }
        const res = await this.db
          .insert(lnfEntry)
          .values({
            name: entry.name,
            description: entry.description,
            type: itemType,
            state: entry.state,
            metadata: entry.metadata,
            externalId: entry.externalId,
            createdAt: now,
            updatedAt: now,
          })
          .returning();
        if (res && res[0]) {
          inserted.push(res[0]);
        }
      }
    }
    return { success: true, insertedCount: inserted.length, inserted };
  }
}
