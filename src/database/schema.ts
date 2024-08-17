import { sql } from 'drizzle-orm';
import {
  integer,
  primaryKey,
  sqliteTable,
  text,
} from 'drizzle-orm/sqlite-core';

export const user = sqliteTable('users', {
  id: integer('id').primaryKey(),
  username: text('username').notNull(),
  password: text('password').notNull(),
  displayName: text('display_name'),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }),
  isActive: integer('is_active', { mode: 'boolean' }),
});

export const event = sqliteTable('events', {
  id: integer('id').primaryKey(),
  name: text('name'),
  description: text('description'),
  startDate: integer('start_date', { mode: 'timestamp' }),
  endDate: integer('end_date', { mode: 'timestamp' }),
});

export const userEventMembership = sqliteTable(
  'event_memberships',
  {
    id: integer('id'),
    eventId: integer('event_id').references(() => event.id),
    userId: integer('user_id').references(() => user.id),
    role: text('role', { enum: ['admin', 'editor', 'viewer'] }),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.eventId, table.userId] }),
    };
  },
);

export const eventInfo = sqliteTable(
  'event_informations',
  {
    id: integer('id'),
    eventId: integer('event_id').references(() => event.id),
    key: text('key'),
    value: text('value'),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.eventId, table.key] }),
    };
  },
);

export const lnfEntry = sqliteTable('lnf_entries', {
  id: integer('id').primaryKey(),
  name: text('name'),
  type: text('type', { enum: ['lost', 'found', 'deposit', 'misc'] }),
  description: text('description'),
  createdAt: integer('created_at', { mode: 'timestamp' }),
  updatedAt: integer('updated_at', { mode: 'timestamp' }),
  state: integer('state', { mode: 'boolean' }),
  metadata: text('metadata', { mode: 'json' }),
});

export const lnfAuditLog = sqliteTable('lnf_audit_log', {
  id: integer('id').primaryKey(),
  entry_id: integer('id').references(() => lnfEntry.id),
  action: text('action', { enum: ['CREATE', 'UPDATE', 'DELETE'] }),
  before_value: text('before_value', { mode: 'json' }),
  after_value: text('after_value', { mode: 'json' }),
  timestamp: integer('timestamp', { mode: 'timestamp' }),
});

export const lnfEntryAssets = sqliteTable('lnf_entry_assets', {
  id: integer('id').primaryKey(),
  entryId: integer('entry_id').references(() => lnfEntry.id),
  name: text('name'),
  type: text('type'),
  size: integer('size', { mode: 'number' }),
  url: text('url'),
});
