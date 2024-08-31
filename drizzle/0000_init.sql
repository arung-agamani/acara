CREATE TABLE IF NOT EXISTS "events" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text,
	"description" text,
	"start_date" timestamp with time zone,
	"end_date" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "event_informations" (
	"id" integer,
	"event_id" integer,
	"key" text,
	"value" text,
	CONSTRAINT "event_informations_event_id_key_pk" PRIMARY KEY("event_id","key")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "lnf_audit_log" (
	"id" integer,
	"action" text,
	"before_value" json,
	"after_value" json,
	"timestamp" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "lnf_entries" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text,
	"type" text,
	"description" text,
	"created_at" timestamp with time zone DEFAULT NOW() NOT NULL,
	"updated_at" timestamp with time zone,
	"state" boolean,
	"metadata" json,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "lnf_entry_assets" (
	"id" integer PRIMARY KEY NOT NULL,
	"entry_id" integer,
	"name" text,
	"type" text,
	"size" integer,
	"url" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"password" text NOT NULL,
	"display_name" text,
	"created_at" timestamp with time zone DEFAULT NOW() NOT NULL,
	"updated_at" timestamp with time zone,
	"is_active" boolean
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "event_memberships" (
	"id" integer,
	"event_id" integer,
	"user_id" integer,
	"role" text,
	CONSTRAINT "event_memberships_event_id_user_id_pk" PRIMARY KEY("event_id","user_id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "event_informations" ADD CONSTRAINT "event_informations_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "lnf_audit_log" ADD CONSTRAINT "lnf_audit_log_id_lnf_entries_id_fk" FOREIGN KEY ("id") REFERENCES "public"."lnf_entries"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "lnf_entry_assets" ADD CONSTRAINT "lnf_entry_assets_entry_id_lnf_entries_id_fk" FOREIGN KEY ("entry_id") REFERENCES "public"."lnf_entries"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "event_memberships" ADD CONSTRAINT "event_memberships_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "event_memberships" ADD CONSTRAINT "event_memberships_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
