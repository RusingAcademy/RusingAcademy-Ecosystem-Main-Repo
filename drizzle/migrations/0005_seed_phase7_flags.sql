-- Phase 0.1: Seed feature flags for Phases 7-14
-- All flags default to OFF (enabled=false) for safe rollout

INSERT INTO feature_flags (`key`, name, description, enabled, environment, rollout_percentage, created_at, updated_at)
VALUES
  ('MEMBERSHIPS_ENABLED', 'Memberships & Subscriptions', 'Phase 7.1-7.2: Admin membership tier management and learner subscription flows', false, 'all', 100, NOW(), NOW()),
  ('PRODUCT_BUNDLES_ENABLED', 'Product Bundles', 'Phase 7.3: Bundle courses + coaching + membership into purchasable packages', false, 'all', 100, NOW(), NOW()),
  ('LANDING_PAGES_ENABLED', 'Landing Page Templates', 'Phase 8.1: Admin-managed landing pages with predefined templates', false, 'all', 100, NOW(), NOW()),
  ('EMAIL_AUTOMATION_ENABLED', 'Email Automation', 'Phase 8.2: Automated email sequences triggered by user actions', false, 'all', 100, NOW(), NOW()),
  ('THEME_CUSTOMIZER_ENABLED', 'Theme Customizer', 'Phase 9.1: Admin branding customization (colors, logo, fonts)', false, 'all', 100, NOW(), NOW()),
  ('GROUP_SESSIONS_ENABLED', 'Group Coaching Sessions', 'Phase 10.1: Coach-led group sessions with multi-learner participation', false, 'all', 100, NOW(), NOW()),
  ('AUTOMATIONS_ENABLED', 'Automation Engine', 'Phase 11.1: Trigger-action automations for admin workflows', false, 'all', 100, NOW(), NOW()),
  ('LEARNER_360_ENABLED', 'Learner 360 View', 'Phase 12.1: Comprehensive learner profile with all data in one view', false, 'all', 100, NOW(), NOW()),
  ('TAGS_ENABLED', 'Tags & Segmentation', 'Phase 12.2: User tagging system for segmentation and email targeting', false, 'all', 100, NOW(), NOW()),
  ('ANALYTICS_ENABLED', 'Analytics Dashboards', 'Phase 13: Revenue, course, and coach performance analytics', false, 'all', 100, NOW(), NOW()),
  ('PUBLIC_API_ENABLED', 'Public API v1', 'Phase 14.1: External REST API for HR system integrations', false, 'all', 100, NOW(), NOW())
ON DUPLICATE KEY UPDATE
  description = VALUES(description),
  updated_at = NOW();
