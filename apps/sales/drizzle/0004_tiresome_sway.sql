ALTER TABLE `bank_transactions` ADD `isReconciled` boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE `recurring_transactions` ADD `lastGenerated` timestamp;