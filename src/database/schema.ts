import { sql } from 'drizzle-orm';

import {
  integer,
  primaryKey,
  text,
  pgTable,
  timestamp,
  boolean,
  json,
  serial,
} from 'drizzle-orm/pg-core';

export const user = pgTable('users', {
  id: serial('id').primaryKey(),
  username: text('username').notNull(),
  password: text('password').notNull(),
  displayName: text('display_name'),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' })
    .notNull()
    .default(sql`NOW()`),
  updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' }),
  isActive: boolean('is_active'),
});

export const event = pgTable('events', {
  id: serial('id').primaryKey(),
  name: text('name'),
  description: text('description'),
  startDate: timestamp('start_date', { withTimezone: true, mode: 'date' }),
  endDate: timestamp('end_date', { withTimezone: true, mode: 'date' }),
});

export const userEventMembership = pgTable(
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

export const eventInfo = pgTable(
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

export const lnfEntry = pgTable('lnf_entries', {
  id: serial('id').primaryKey(),
  name: text('name'),
  type: text('type', { enum: ['lost', 'found', 'deposit', 'misc'] }),
  description: text('description'),
  externalId: text('external_id').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' })
    .notNull()
    .default(sql`NOW()`),
  updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' }),
  state: boolean('state'),
  metadata: json('metadata'),
  deletedAt: timestamp('deleted_at', { withTimezone: true, mode: 'date' }),
});

export const lnfAuditLog = pgTable('lnf_audit_log', {
  id: integer('id').primaryKey(),
  entry_id: integer('id').references(() => lnfEntry.id),
  action: text('action', { enum: ['CREATE', 'UPDATE', 'DELETE'] }),
  before_value: json('before_value'),
  after_value: json('after_value'),
  timestamp: timestamp('timestamp', { withTimezone: true, mode: 'date' }),
});

export const lnfEntryAssets = pgTable('lnf_entry_assets', {
  id: integer('id').primaryKey(),
  entryId: integer('entry_id').references(() => lnfEntry.id),
  name: text('name'),
  type: text('type'),
  size: integer('size'),
  url: text('url'),
});
