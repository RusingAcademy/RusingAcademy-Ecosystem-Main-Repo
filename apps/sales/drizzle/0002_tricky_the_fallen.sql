CREATE TABLE `account_transfers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`fromAccountId` int NOT NULL,
	`toAccountId` int NOT NULL,
	`amount` decimal(15,2) NOT NULL,
	`transferDate` timestamp NOT NULL,
	`memo` text,
	`journalEntryId` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `account_transfers_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `attachments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`entityType` varchar(64) NOT NULL,
	`entityId` int NOT NULL,
	`fileName` varchar(500) NOT NULL,
	`fileUrl` text NOT NULL,
	`fileKey` varchar(500) NOT NULL,
	`mimeType` varchar(128),
	`fileSize` int,
	`uploadedBy` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `attachments_id` PRIMARY KEY(`id`)
);
