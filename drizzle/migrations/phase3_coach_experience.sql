-- Phase 3: Coach Experience — Database Migration
-- Run against TiDB/MySQL production database

-- Calendly OAuth Integration
CREATE TABLE IF NOT EXISTS `coach_calendly_integrations` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `coachProfileId` INT NOT NULL,
  `calendlyUserUri` TEXT NOT NULL,
  `accessToken` TEXT NOT NULL,
  `refreshToken` TEXT,
  `tokenExpiresAt` TIMESTAMP NULL,
  `schedulingUrl` VARCHAR(500),
  `eventTypeUri` VARCHAR(500),
  `webhookSubscriptionUri` VARCHAR(500),
  `isActive` BOOLEAN DEFAULT TRUE,
  `lastSyncAt` TIMESTAMP NULL,
  `syncError` TEXT,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE INDEX `idx_calendly_coach_profile` (`coachProfileId`),
  CONSTRAINT `fk_calendly_coach` FOREIGN KEY (`coachProfileId`) REFERENCES `coach_profiles` (`id`)
);

-- Session Feedback (Learner → Coach)
CREATE TABLE IF NOT EXISTS `session_feedback` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `sessionId` INT NOT NULL,
  `rating` INT NOT NULL,
  `comment` TEXT,
  `tags` JSON,
  `wouldRecommend` BOOLEAN,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE INDEX `idx_feedback_session` (`sessionId`),
  CONSTRAINT `fk_feedback_session` FOREIGN KEY (`sessionId`) REFERENCES `sessions` (`id`)
);

-- Session Recordings (Daily.co)
CREATE TABLE IF NOT EXISTS `session_recordings` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `sessionId` INT NOT NULL,
  `dailyRecordingId` VARCHAR(255) NOT NULL,
  `durationSeconds` INT,
  `shareToken` VARCHAR(100),
  `downloadUrl` TEXT,
  `expiresAt` TIMESTAMP NULL,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_recordings_session` (`sessionId`),
  CONSTRAINT `fk_recordings_session` FOREIGN KEY (`sessionId`) REFERENCES `sessions` (`id`)
);
