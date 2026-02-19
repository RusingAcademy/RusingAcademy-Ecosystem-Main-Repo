-- Phase 11.1: Automation Engine MVP
-- Flag: AUTOMATION_ENGINE_ENABLED

CREATE TABLE IF NOT EXISTS `automations` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `triggerType` ENUM('user_signup','course_enrolled','course_completed','lesson_completed','session_booked','session_completed','payment_received','membership_activated','membership_cancelled','tag_added','inactivity','scheduled') NOT NULL,
  `triggerConfig` JSON,
  `actionType` ENUM('send_email','send_notification','add_tag','remove_tag','enroll_course','assign_coach','update_field','webhook','delay') NOT NULL,
  `actionConfig` JSON,
  `isActive` BOOLEAN DEFAULT FALSE,
  `priority` INT DEFAULT 0,
  `executionCount` INT DEFAULT 0,
  `lastExecutedAt` TIMESTAMP NULL,
  `createdBy` INT NOT NULL,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS `automation_logs` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `automationId` INT NOT NULL,
  `userId` INT,
  `status` ENUM('success','failed','skipped') DEFAULT 'success',
  `triggerData` JSON,
  `actionResult` JSON,
  `errorMessage` TEXT,
  `executedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`automationId`) REFERENCES `automations`(`id`)
);
