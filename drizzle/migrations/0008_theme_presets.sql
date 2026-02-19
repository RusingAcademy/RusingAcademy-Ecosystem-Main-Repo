-- Phase 9.1: Theme Presets
CREATE TABLE IF NOT EXISTS `theme_presets` (
  `id` int AUTO_INCREMENT PRIMARY KEY,
  `name` varchar(100) NOT NULL,
  `slug` varchar(100) NOT NULL UNIQUE,
  `description` text,
  `isDefault` boolean DEFAULT false,
  `isActive` boolean DEFAULT false,
  `tokens` json NOT NULL,
  `createdBy` int,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Seed default presets
INSERT INTO `theme_presets` (`name`, `slug`, `isDefault`, `isActive`, `tokens`) VALUES
('RusingAcademy Dark', 'rusingacademy-dark', true, true, '{"primaryColor":"#14b8a6","secondaryColor":"#6366f1","backgroundColor":"#0f172a","surfaceColor":"#1e293b","textColor":"#f8fafc","fontFamily":"Inter, sans-serif","borderRadius":"8px"}'),
('RusingAcademy Light', 'rusingacademy-light', false, false, '{"primaryColor":"#0d9488","secondaryColor":"#4f46e5","backgroundColor":"#f8fafc","surfaceColor":"#ffffff","textColor":"#0f172a","fontFamily":"Inter, sans-serif","borderRadius":"8px"}'),
('Government Blue', 'government-blue', false, false, '{"primaryColor":"#1d4ed8","secondaryColor":"#dc2626","backgroundColor":"#f1f5f9","surfaceColor":"#ffffff","textColor":"#1e293b","fontFamily":"Noto Sans, sans-serif","borderRadius":"4px"}');
