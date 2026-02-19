-- Phase 12: Learner 360 View + Tags & Segmentation
-- Flags: LEARNER_360_ENABLED, TAGS_SEGMENTATION_ENABLED

CREATE TABLE IF NOT EXISTS `learner_tags` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `slug` VARCHAR(100) NOT NULL,
  `color` VARCHAR(7) DEFAULT '#6366f1',
  `description` TEXT,
  `category` ENUM('level','interest','status','custom') DEFAULT 'custom',
  `isAutomatic` BOOLEAN DEFAULT FALSE,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `idx_tag_slug` (`slug`)
);

CREATE TABLE IF NOT EXISTS `learner_tag_assignments` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `learnerId` INT NOT NULL,
  `tagId` INT NOT NULL,
  `assignedBy` ENUM('manual','automation','system') DEFAULT 'manual',
  `assignedByUserId` INT,
  `assignedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`tagId`) REFERENCES `learner_tags`(`id`),
  UNIQUE KEY `idx_learner_tag` (`learnerId`, `tagId`)
);

CREATE TABLE IF NOT EXISTS `learner_segments` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `filterRules` TEXT,
  `memberCount` INT DEFAULT 0,
  `isActive` BOOLEAN DEFAULT TRUE,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS `learner_notes` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `learnerId` INT NOT NULL,
  `authorId` INT NOT NULL,
  `content` TEXT NOT NULL,
  `noteType` ENUM('general','progress','concern','milestone') DEFAULT 'general',
  `isPrivate` BOOLEAN DEFAULT TRUE,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Seed default tags
INSERT INTO `learner_tags` (`name`, `slug`, `color`, `category`, `isAutomatic`) VALUES
  ('SLE Prep', 'sle-prep', '#14b8a6', 'interest', false),
  ('Oral A', 'oral-a', '#6366f1', 'level', false),
  ('Oral B', 'oral-b', '#8b5cf6', 'level', false),
  ('Oral C', 'oral-c', '#a855f7', 'level', false),
  ('Written Expression', 'written-expression', '#ec4899', 'interest', false),
  ('Reading Comprehension', 'reading-comprehension', '#f59e0b', 'interest', false),
  ('Beginner', 'beginner', '#22c55e', 'level', true),
  ('Intermediate', 'intermediate', '#3b82f6', 'level', true),
  ('Advanced', 'advanced', '#ef4444', 'level', true),
  ('At Risk', 'at-risk', '#f97316', 'status', true),
  ('High Performer', 'high-performer', '#10b981', 'status', true),
  ('Inactive', 'inactive', '#64748b', 'status', true);
