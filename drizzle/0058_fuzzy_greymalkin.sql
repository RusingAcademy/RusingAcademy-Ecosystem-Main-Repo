ALTER TABLE `coach_applications` ADD `sleOralLevel` varchar(10);--> statement-breakpoint
ALTER TABLE `coach_applications` ADD `sleWrittenLevel` varchar(10);--> statement-breakpoint
ALTER TABLE `coach_applications` ADD `sleReadingLevel` varchar(10);--> statement-breakpoint
ALTER TABLE `coach_applications` ADD `headlineFr` varchar(200);--> statement-breakpoint
ALTER TABLE `coach_applications` ADD `bioFr` text;--> statement-breakpoint
ALTER TABLE `coach_applications` ADD `uniqueValue` text;--> statement-breakpoint
ALTER TABLE `coach_applications` ADD `termsAcceptedAt` timestamp;--> statement-breakpoint
ALTER TABLE `coach_applications` ADD `termsVersion` varchar(20);