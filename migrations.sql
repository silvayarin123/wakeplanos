CREATE TABLE `wake_assets` (
	`id` text PRIMARY KEY NOT NULL,
	`owner_id` text NOT NULL,
	`object_key` text NOT NULL,
	`mime` text NOT NULL,
	`size` integer NOT NULL,
	`created_at` text NOT NULL
);

CREATE TABLE `wake_brands` (
	`id` text PRIMARY KEY NOT NULL,
	`owner_id` text NOT NULL,
	`name` text NOT NULL,
	`asset_id` text NOT NULL,
	`archived` integer DEFAULT 0 NOT NULL,
	`created_at` text NOT NULL
);

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

CREATE UNIQUE INDEX `wake_proposal_token_unique` ON `wake_proposals` (`token`);
CREATE INDEX `wake_proposal_owner_idx` ON `wake_proposals` (`owner_id`);
CREATE TABLE `wake_settings` (
	`owner_id` text PRIMARY KEY NOT NULL,
	`data` text NOT NULL,
	`updated_at` text NOT NULL
);

CREATE TABLE `wake_visits` (
	`id` text PRIMARY KEY NOT NULL,
	`proposal_id` text NOT NULL,
	`visitor` text NOT NULL,
	`seen_at` text NOT NULL
);

CREATE UNIQUE INDEX `wake_visit_unique` ON `wake_visits` (`proposal_id`,`visitor`);
ALTER TABLE `wake_brands` ADD `dark` integer DEFAULT 0 NOT NULL;
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

CREATE TABLE `wake_editor_sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`owner_id` text NOT NULL,
	`version` integer NOT NULL,
	`expires_at` text NOT NULL
);
