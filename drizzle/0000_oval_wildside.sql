CREATE TABLE `wake_assets` (
	`id` text PRIMARY KEY NOT NULL,
	`owner_id` text NOT NULL,
	`object_key` text NOT NULL,
	`mime` text NOT NULL,
	`size` integer NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `wake_brands` (
	`id` text PRIMARY KEY NOT NULL,
	`owner_id` text NOT NULL,
	`name` text NOT NULL,
	`asset_id` text NOT NULL,
	`archived` integer DEFAULT 0 NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `wake_proposals` (
	`id` text PRIMARY KEY NOT NULL,
	`owner_id` text NOT NULL,
	`token` text NOT NULL,
	`client_name` text NOT NULL,
	`title` text NOT NULL,
	`data` text NOT NULL,
	`published` integer DEFAULT 0 NOT NULL,
	`archived` integer DEFAULT 0 NOT NULL,
	`opens` integer DEFAULT 0 NOT NULL,
	`first_opened_at` text,
	`last_opened_at` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `wake_proposal_token_unique` ON `wake_proposals` (`token`);--> statement-breakpoint
CREATE INDEX `wake_proposal_owner_idx` ON `wake_proposals` (`owner_id`);--> statement-breakpoint
CREATE TABLE `wake_settings` (
	`owner_id` text PRIMARY KEY NOT NULL,
	`data` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `wake_visits` (
	`id` text PRIMARY KEY NOT NULL,
	`proposal_id` text NOT NULL,
	`visitor` text NOT NULL,
	`seen_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `wake_visit_unique` ON `wake_visits` (`proposal_id`,`visitor`);