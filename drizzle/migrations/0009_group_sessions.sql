-- Phase 10.1: Group Coaching Sessions
-- Flag: GROUP_SESSIONS_ENABLED

CREATE TABLE IF NOT EXISTS `group_sessions` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `sessionId` INT NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `maxParticipants` INT NOT NULL DEFAULT 10,
  `currentParticipants` INT NOT NULL DEFAULT 0,
  `pricePerParticipant` INT NOT NULL,
  `groupType` ENUM('workshop','study_group','mock_exam','conversation_circle') DEFAULT 'workshop',
  `level` ENUM('beginner','intermediate','advanced','all_levels') DEFAULT 'all_levels',
  `language` ENUM('en','fr','bilingual') DEFAULT 'bilingual',
  `isRecurring` BOOLEAN DEFAULT FALSE,
  `recurrencePattern` ENUM('weekly','biweekly','monthly'),
  `registrationDeadline` TIMESTAMP NULL,
  `isPublic` BOOLEAN DEFAULT TRUE,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`sessionId`) REFERENCES `sessions`(`id`)
);

CREATE TABLE IF NOT EXISTS `group_session_participants` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `groupSessionId` INT NOT NULL,
  `learnerId` INT NOT NULL,
  `status` ENUM('registered','confirmed','attended','no_show','cancelled') DEFAULT 'registered',
  `stripePaymentId` VARCHAR(100),
  `paidAmount` INT,
  `rating` INT,
  `feedback` TEXT,
  `registeredAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `cancelledAt` TIMESTAMP NULL,
  FOREIGN KEY (`groupSessionId`) REFERENCES `group_sessions`(`id`)
);
