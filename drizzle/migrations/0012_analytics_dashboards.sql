-- Phase 13: Analytics Dashboards
-- Flag: ANALYTICS_DASHBOARDS_ENABLED

CREATE TABLE IF NOT EXISTS `dashboard_widgets` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `dashboardId` VARCHAR(50) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `widgetType` ENUM('kpi_card','line_chart','bar_chart','pie_chart','table','funnel','heatmap') NOT NULL,
  `dataSource` ENUM('revenue','enrollments','sessions','learner_progress','course_completion','membership_churn','email_engagement','automation_runs','group_sessions') NOT NULL,
  `config` JSON,
  `position` INT DEFAULT 0,
  `width` ENUM('quarter','third','half','full') DEFAULT 'quarter',
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY `idx_dashboard` (`dashboardId`)
);

CREATE TABLE IF NOT EXISTS `analytics_snapshots` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `metricKey` VARCHAR(100) NOT NULL,
  `metricValue` INT NOT NULL,
  `metricLabel` VARCHAR(255),
  `periodType` ENUM('daily','weekly','monthly') DEFAULT 'daily',
  `periodDate` TIMESTAMP NOT NULL,
  `metadata` JSON,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY `idx_metric_period` (`metricKey`, `periodDate`)
);

-- Seed default admin dashboard widgets
INSERT INTO `dashboard_widgets` (`dashboardId`, `title`, `widgetType`, `dataSource`, `position`, `width`) VALUES
  ('admin_main', 'Total Revenue (30d)', 'kpi_card', 'revenue', 0, 'quarter'),
  ('admin_main', 'New Enrollments (30d)', 'kpi_card', 'enrollments', 1, 'quarter'),
  ('admin_main', 'Sessions Completed (30d)', 'kpi_card', 'sessions', 2, 'quarter'),
  ('admin_main', 'Course Completion Rate', 'kpi_card', 'course_completion', 3, 'quarter'),
  ('admin_main', 'Revenue Trend', 'line_chart', 'revenue', 4, 'half'),
  ('admin_main', 'Enrollment Trend', 'bar_chart', 'enrollments', 5, 'half'),
  ('admin_main', 'Learner Progress Distribution', 'pie_chart', 'learner_progress', 6, 'third'),
  ('admin_main', 'Membership Churn', 'line_chart', 'membership_churn', 7, 'third'),
  ('admin_main', 'Email Engagement', 'bar_chart', 'email_engagement', 8, 'third');
