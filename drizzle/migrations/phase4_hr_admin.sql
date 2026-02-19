-- Phase 4: HR & Admin — Feature Flags, Monitoring, PDF Reports
-- Run against TiDB/MySQL production database

-- Feature Flags
CREATE TABLE IF NOT EXISTS `feature_flags` (
  `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `key` VARCHAR(100) NOT NULL UNIQUE,
  `name` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `enabled` BOOLEAN NOT NULL DEFAULT FALSE,
  `environment` VARCHAR(50) NOT NULL DEFAULT 'all',
  `rollout_percentage` INT NOT NULL DEFAULT 100,
  `target_user_ids` TEXT,
  `target_roles` TEXT,
  `metadata` TEXT,
  `created_by` INT,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Feature Flag History
CREATE TABLE IF NOT EXISTS `feature_flag_history` (
  `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `flag_id` INT NOT NULL,
  `action` VARCHAR(50) NOT NULL,
  `previous_value` TEXT,
  `new_value` TEXT,
  `changed_by` INT,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_ffh_flag` (`flag_id`)
);

-- Custom Metrics (Monitoring)
CREATE TABLE IF NOT EXISTS `custom_metrics` (
  `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `value` VARCHAR(255) NOT NULL,
  `labels` TEXT,
  `recorded_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_metrics_name_time` (`name`, `recorded_at`)
);

-- Alert Configs
CREATE TABLE IF NOT EXISTS `alert_configs` (
  `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `metric` VARCHAR(100) NOT NULL,
  `condition` VARCHAR(10) NOT NULL,
  `threshold` VARCHAR(50) NOT NULL,
  `window_minutes` INT DEFAULT 5,
  `channels` VARCHAR(255) DEFAULT 'email',
  `recipients` TEXT,
  `enabled` BOOLEAN NOT NULL DEFAULT TRUE,
  `created_by` INT,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Alert History
CREATE TABLE IF NOT EXISTS `alert_history` (
  `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `config_id` INT NOT NULL,
  `metric_value` VARCHAR(50) NOT NULL,
  `triggered_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_alert_hist_config` (`config_id`)
);

-- Report History
CREATE TABLE IF NOT EXISTS `report_history` (
  `id` VARCHAR(36) NOT NULL PRIMARY KEY,
  `type` VARCHAR(50) NOT NULL,
  `user_id` INT NOT NULL,
  `file_path` VARCHAR(500) NOT NULL,
  `filters` TEXT,
  `date_range_start` TIMESTAMP NULL,
  `date_range_end` TIMESTAMP NULL,
  `locale` VARCHAR(5) DEFAULT 'en',
  `expires_at` TIMESTAMP NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_report_user` (`user_id`)
);

-- Seed default feature flags for Phase 1-4 features
INSERT IGNORE INTO `feature_flags` (`key`, `name`, `description`, `enabled`, `environment`) VALUES
  ('websocket.enabled', 'WebSocket Real-time', 'Enable WebSocket real-time communication', TRUE, 'all'),
  ('chat.enabled', 'Chat System', 'Enable chat rooms and messaging', TRUE, 'all'),
  ('progress.sync', 'Progress Sync', 'Enable real-time progress synchronization', TRUE, 'all'),
  ('push.notifications', 'Push Notifications', 'Enable Web Push notifications', TRUE, 'all'),
  ('video.rooms', 'Video Rooms', 'Enable native video room sessions', FALSE, 'staging'),
  ('coach.analytics', 'Coach Analytics Dashboard', 'Enable coach analytics dashboard', TRUE, 'all'),
  ('hr.reports', 'HR PDF Reports', 'Enable HR PDF report generation', TRUE, 'all'),
  ('monitoring.dashboard', 'Monitoring Dashboard', 'Enable admin monitoring dashboard', TRUE, 'all');
