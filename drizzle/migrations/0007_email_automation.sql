-- Phase 8.2: Email Automation tables
-- email_sequences: Stores sequence definitions with trigger, steps, and settings
-- email_sequence_enrollments: Tracks user enrollment in sequences
-- email_sequence_logs: Tracks individual email send/open/click events

CREATE TABLE IF NOT EXISTS `email_sequences` (
  `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `nameFr` VARCHAR(255),
  `description` TEXT,
  `descriptionFr` TEXT,
  `trigger` ENUM('user_signup','course_purchase','cart_abandoned','course_completed','session_booked','membership_activated','manual') NOT NULL,
  `status` ENUM('draft','active','paused','archived') NOT NULL DEFAULT 'draft',
  `steps` JSON NOT NULL,
  `settings` JSON,
  `enrollmentCount` INT DEFAULT 0,
  `completionCount` INT DEFAULT 0,
  `createdBy` INT,
  `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS `email_sequence_enrollments` (
  `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `sequenceId` INT NOT NULL,
  `userId` INT NOT NULL,
  `currentStep` INT DEFAULT 0,
  `status` ENUM('active','completed','paused','cancelled') NOT NULL DEFAULT 'active',
  `metadata` JSON,
  `enrolledAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `completedAt` TIMESTAMP NULL,
  `lastStepAt` TIMESTAMP NULL,
  INDEX `idx_seq_enroll_sequence` (`sequenceId`),
  INDEX `idx_seq_enroll_user` (`userId`),
  INDEX `idx_seq_enroll_status` (`status`)
);

CREATE TABLE IF NOT EXISTS `email_sequence_logs` (
  `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `sequenceId` INT NOT NULL,
  `enrollmentId` INT NOT NULL,
  `stepIndex` INT NOT NULL,
  `userId` INT NOT NULL,
  `emailSubject` VARCHAR(500),
  `status` ENUM('sent','delivered','opened','clicked','bounced','failed') NOT NULL DEFAULT 'sent',
  `sentAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `openedAt` TIMESTAMP NULL,
  `clickedAt` TIMESTAMP NULL,
  INDEX `idx_seq_log_sequence` (`sequenceId`),
  INDEX `idx_seq_log_enrollment` (`enrollmentId`),
  INDEX `idx_seq_log_user` (`userId`)
);
