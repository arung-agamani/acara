CREATE TABLE `events` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text,
	`description` text,
	`start_date` integer,
	`end_date` integer
);
--> statement-breakpoint
CREATE TABLE `event_informations` (
	`id` integer,
	`event_id` integer,
	`key` text,
	`value` text,
	PRIMARY KEY(`event_id`, `key`),
	FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `lnf_audit_log` (
	`id` integer,
	`action` text,
	`before_value` text,
	`after_value` text,
	`timestamp` integer,
	FOREIGN KEY (`id`) REFERENCES `lnf_entries`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `lnf_entries` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text,
	`type` text,
	`description` text,
	`created_at` integer,
	`updated_at` integer,
	`state` integer,
	`metadata` text
);
--> statement-breakpoint
CREATE TABLE `lnf_entry_assets` (
	`id` integer PRIMARY KEY NOT NULL,
	`entry_id` integer,
	`name` text,
	`type` text,
	`size` integer,
	`url` text,
	FOREIGN KEY (`entry_id`) REFERENCES `lnf_entries`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY NOT NULL,
	`username` text NOT NULL,
	`password` text NOT NULL,
	`display_name` text,
	`created_at` integer DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` integer,
	`is_active` integer
);
--> statement-breakpoint
CREATE TABLE `event_memberships` (
	`id` integer,
	`event_id` integer,
	`user_id` integer,
	`role` text,
	PRIMARY KEY(`event_id`, `user_id`),
	FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
