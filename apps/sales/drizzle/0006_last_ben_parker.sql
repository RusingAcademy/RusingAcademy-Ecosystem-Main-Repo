CREATE TABLE `recurring_generation_log` (
	`id` int AUTO_INCREMENT NOT NULL,
	`recurringTransactionId` int NOT NULL,
	`generatedEntityType` varchar(64) NOT NULL,
	`generatedEntityId` int,
	`status` enum('success','failed','skipped') NOT NULL DEFAULT 'success',
	`errorMessage` text,
	`autoSent` boolean DEFAULT false,
	`generatedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `recurring_generation_log_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `customers` ADD `currency` varchar(3) DEFAULT 'CAD';--> statement-breakpoint
ALTER TABLE `expenses` ADD `currency` varchar(3) DEFAULT 'CAD';--> statement-breakpoint
ALTER TABLE `expenses` ADD `exchangeRate` decimal(15,6) DEFAULT '1.000000';--> statement-breakpoint
ALTER TABLE `invoices` ADD `currency` varchar(3) DEFAULT 'CAD';--> statement-breakpoint
ALTER TABLE `invoices` ADD `exchangeRate` decimal(15,6) DEFAULT '1.000000';--> statement-breakpoint
ALTER TABLE `invoices` ADD `recurringTransactionId` int;