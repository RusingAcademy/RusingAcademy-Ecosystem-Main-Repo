-- Phase 5: Optimizations - Database Migration
-- Run this migration after Phase 4

-- HR Budget Forecasts
CREATE TABLE IF NOT EXISTS `hr_budget_forecasts` (
  `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `year` INT NOT NULL,
  `quarter` INT DEFAULT NULL,
  `department_id` INT DEFAULT NULL,
  `category` VARCHAR(100) NOT NULL,
  `planned_amount` DECIMAL(12,2) NOT NULL DEFAULT 0,
  `actual_amount` DECIMAL(12,2) DEFAULT NULL,
  `variance_amount` DECIMAL(12,2) DEFAULT NULL,
  `notes` TEXT DEFAULT NULL,
  `created_by` INT NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_budget_year` (`year`),
  INDEX `idx_budget_category` (`category`),
  INDEX `idx_budget_dept` (`department_id`)
);

-- AI Companion Conversation History
CREATE TABLE IF NOT EXISTS `ai_conversation_history` (
  `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `context` VARCHAR(50) NOT NULL DEFAULT 'general',
  `question` TEXT NOT NULL,
  `answer` TEXT NOT NULL,
  `tokens_used` INT DEFAULT 0,
  `response_time_ms` INT DEFAULT 0,
  `cached` BOOLEAN DEFAULT FALSE,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_ai_user` (`user_id`),
  INDEX `idx_ai_context` (`context`)
);
