ALTER TABLE `sle_companion_sessions` MODIFY COLUMN `userId` int;--> statement-breakpoint
ALTER TABLE `coach_profiles` ADD `headlineFr` varchar(200);--> statement-breakpoint
ALTER TABLE `coach_profiles` ADD `bioFr` text;