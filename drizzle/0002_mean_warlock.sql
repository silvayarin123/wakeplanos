CREATE TABLE `wake_editor_access` (
	`id` text PRIMARY KEY NOT NULL,
	`owner_id` text NOT NULL,
	`password_hash` text NOT NULL,
	`salt` text NOT NULL,
	`version` integer DEFAULT 1 NOT NULL,
	`failures` integer DEFAULT 0 NOT NULL,
	`locked_until` text,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `wake_editor_sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`owner_id` text NOT NULL,
	`version` integer NOT NULL,
	`expires_at` text NOT NULL
);
