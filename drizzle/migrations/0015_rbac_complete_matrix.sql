-- Phase 2: RBAC Complete Permission Matrix
-- Adds 'colleague' role and seeds full role_permissions for all 6 roles.
-- This migration is idempotent (uses INSERT IGNORE).

-- Add colleague role if not exists
INSERT IGNORE INTO roles (name, displayName, description, level)
VALUES ('colleague', 'Colleague', 'Content and marketing collaborator with limited admin access', 3);

-- Seed role_permissions for all roles
-- Owner: all permissions
INSERT IGNORE INTO role_permissions (roleId, permissionId)
SELECT r.id, p.id FROM roles r CROSS JOIN permissions p WHERE r.name = 'owner';

-- Admin: all permissions
INSERT IGNORE INTO role_permissions (roleId, permissionId)
SELECT r.id, p.id FROM roles r CROSS JOIN permissions p WHERE r.name = 'admin';

-- HR Admin: HR module (all), People module (all), Insights (view), Products (view)
INSERT IGNORE INTO role_permissions (roleId, permissionId)
SELECT r.id, p.id FROM roles r CROSS JOIN permissions p
WHERE r.name = 'hr_admin' AND (
  p.module = 'hr'
  OR p.module = 'people'
  OR (p.module = 'insights' AND p.action = 'view')
  OR (p.module = 'products' AND p.action = 'view')
);

-- Colleague: Products, Marketing, Website (CUD), People (view), Insights (view)
INSERT IGNORE INTO role_permissions (roleId, permissionId)
SELECT r.id, p.id FROM roles r CROSS JOIN permissions p
WHERE r.name = 'colleague' AND (
  p.module = 'products'
  OR p.module = 'marketing'
  OR p.module = 'website'
  OR (p.module = 'people' AND p.action = 'view')
  OR (p.module = 'insights' AND p.action = 'view')
);

-- Coach: Products (courses, coaching, community), People learners (view), Insights (view)
INSERT IGNORE INTO role_permissions (roleId, permissionId)
SELECT r.id, p.id FROM roles r CROSS JOIN permissions p
WHERE r.name = 'coach' AND (
  (p.module = 'products' AND p.submodule IN ('courses', 'coaching', 'community'))
  OR (p.module = 'people' AND p.submodule = 'learners' AND p.action = 'view')
  OR (p.module = 'insights' AND p.action = 'view')
);

-- Learner: Products courses + community (view only)
INSERT IGNORE INTO role_permissions (roleId, permissionId)
SELECT r.id, p.id FROM roles r CROSS JOIN permissions p
WHERE r.name = 'learner' AND (
  (p.module = 'products' AND p.submodule IN ('courses', 'community') AND p.action = 'view')
);
