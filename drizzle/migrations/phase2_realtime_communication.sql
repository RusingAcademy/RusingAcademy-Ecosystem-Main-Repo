-- Phase 2: Real-Time Communication Tables
-- Migration for RusingAcademy Ecosystem
-- Date: 2026-02-18

-- 1. Add sync columns to lesson_progress
ALTER TABLE `lesson_progress`
  ADD COLUMN `lastSyncAt` TIMESTAMP NULL,
  ADD COLUMN `syncVersion` INT DEFAULT 1;

-- 2. Chat Rooms
CREATE TABLE IF NOT EXISTS `chat_rooms` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `type` ENUM('direct', 'course', 'module', 'community') NOT NULL,
  `referenceId` INT NULL,
  `createdBy` INT NULL,
  `isActive` BOOLEAN DEFAULT TRUE,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_chat_rooms_type` (`type`),
  INDEX `idx_chat_rooms_reference` (`referenceId`),
  FOREIGN KEY (`createdBy`) REFERENCES `users`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Chat Messages
CREATE TABLE IF NOT EXISTS `chat_messages` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `roomId` INT NOT NULL,
  `senderId` INT NOT NULL,
  `content` TEXT NOT NULL,
  `messageType` ENUM('text', 'image', 'file', 'system') DEFAULT 'text',
  `replyToId` INT NULL,
  `isEdited` BOOLEAN DEFAULT FALSE,
  `isDeleted` BOOLEAN DEFAULT FALSE,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_chat_messages_room` (`roomId`, `createdAt`),
  INDEX `idx_chat_messages_sender` (`senderId`),
  FOREIGN KEY (`roomId`) REFERENCES `chat_rooms`(`id`),
  FOREIGN KEY (`senderId`) REFERENCES `users`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Chat Room Members
CREATE TABLE IF NOT EXISTS `chat_room_members` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `roomId` INT NOT NULL,
  `userId` INT NOT NULL,
  `role` ENUM('admin', 'moderator', 'member') DEFAULT 'member',
  `lastReadAt` TIMESTAMP NULL,
  `joinedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE INDEX `idx_chat_room_member_unique` (`roomId`, `userId`),
  INDEX `idx_chat_room_members_user` (`userId`),
  FOREIGN KEY (`roomId`) REFERENCES `chat_rooms`(`id`),
  FOREIGN KEY (`userId`) REFERENCES `users`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. User Notification Preferences
CREATE TABLE IF NOT EXISTS `user_notification_preferences` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `userId` INT NOT NULL,
  `pushEnabled` BOOLEAN DEFAULT TRUE,
  `pushProgressReminders` BOOLEAN DEFAULT TRUE,
  `pushStreakAlerts` BOOLEAN DEFAULT TRUE,
  `pushSessionReminders` BOOLEAN DEFAULT TRUE,
  `pushMessages` BOOLEAN DEFAULT TRUE,
  `pushAchievements` BOOLEAN DEFAULT TRUE,
  `pushSystemAlerts` BOOLEAN DEFAULT TRUE,
  `emailEnabled` BOOLEAN DEFAULT TRUE,
  `emailWeeklyDigest` BOOLEAN DEFAULT TRUE,
  `quietHoursStart` VARCHAR(5) NULL,
  `quietHoursEnd` VARCHAR(5) NULL,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE INDEX `idx_user_notif_prefs_user` (`userId`),
  FOREIGN KEY (`userId`) REFERENCES `users`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Notifications Log
CREATE TABLE IF NOT EXISTS `notifications_log` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `userId` INT NOT NULL,
  `type` VARCHAR(50) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `body` TEXT NULL,
  `data` JSON NULL,
  `channel` ENUM('push', 'websocket', 'email') NOT NULL,
  `status` ENUM('pending', 'sent', 'delivered', 'failed', 'read') DEFAULT 'pending',
  `sentAt` TIMESTAMP NULL,
  `deliveredAt` TIMESTAMP NULL,
  `readAt` TIMESTAMP NULL,
  `error` TEXT NULL,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_notifications_log_user` (`userId`, `createdAt`),
  INDEX `idx_notifications_log_status` (`status`),
  FOREIGN KEY (`userId`) REFERENCES `users`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
