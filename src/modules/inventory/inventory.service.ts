import { Inject, Injectable } from '@nestjs/common';
import { DrizzleAsyncProvider } from '../drizzle/drizzle.provider';
import { AcaraDb } from 'src/database/interface';
import { lnfEntry } from 'src/database/schema';
import { eq } from 'drizzle-orm';

enum ItemType {
  Lost = 'lost',
  Found = 'found',
  Deposit = 'deposit',
  Misc = 'misc',
}

abstract class InventoryService {
  type: ItemType;
  abstract createItemEntry(
    name: string,
    description: string,
    state: boolean,
    metadata: Record<string, unknown>,
  );
  abstract getItemEntry(id: number);
  //   abstract getAllItemEntries();
  //   abstract getAllItemEntriesByType(type: ItemType);
  //   abstract updateItemEntry(id: number, name: string, description: string, state: boolean, metadata: Record<string, any>);
  //   abstract deleteItemEntry(id: number);
  //   abstract hardDeleteItemEntry(id: number);
}

@Injectable()
export class LostItemService extends InventoryService {
  constructor(@Inject(DrizzleAsyncProvider) private readonly db: AcaraDb) {
    super();
    this.type = ItemType.Lost;
  }

  async createItemEntry(
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
        type: this.type,
        state,
        createdAt: now,
        updatedAt: now,
        metadata,
      })
      .returning();
    if (!res) throw new Error('error when adding lost item entry');
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
}
