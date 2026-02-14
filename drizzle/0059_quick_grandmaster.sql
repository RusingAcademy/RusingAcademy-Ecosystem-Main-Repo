CREATE TABLE `coach_blocked_dates` (
	`id` int AUTO_INCREMENT NOT NULL,
	`coachId` int NOT NULL,
	`date` varchar(10) NOT NULL,
	`reason` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `coach_blocked_dates_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `coach_blocked_dates` ADD CONSTRAINT `coach_blocked_dates_coachId_coach_profiles_id_fk` FOREIGN KEY (`coachId`) REFERENCES `coach_profiles`(`id`) ON DELETE no action ON UPDATE no action;