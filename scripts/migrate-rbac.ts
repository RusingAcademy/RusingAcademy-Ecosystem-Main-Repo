import { db } from "../server/db";
import { sql } from "drizzle-orm";
import * as crypto from "crypto";

// Default roles with their permission levels
const DEFAULT_ROLES = [
  { name: "owner", displayName: "Owner", description: "Super-admin with full platform access", level: 100, isSystem: true, maxUsers: 1 },
  { name: "admin", displayName: "Administrator", description: "Full platform access, can manage users and content", level: 80, isSystem: true, maxUsers: 20 },
  { name: "hr_admin", displayName: "HR Administrator", description: "B2B/B2G focused - cohorts, reporting, licenses", level: 60, isSystem: true, maxUsers: null },
  { name: "coach", displayName: "Coach", description: "Teaching role - sessions, learners, content", level: 40, isSystem: true, maxUsers: null },
  { name: "learner", displayName: "Learner", description: "Learning role - courses, progress, certificates", level: 20, isSystem: true, maxUsers: null },
];

// All permission modules and submodules
const PERMISSIONS = [
  // Products Module
  { module: "products", submodule: "courses", actions: ["view", "create", "edit", "delete", "export"] },
  { module: "products", submodule: "coaching", actions: ["view", "create", "edit", "delete", "export"] },
  { module: "products", submodule: "community", actions: ["view", "create", "edit", "delete"] },
  { module: "products", submodule: "podcasts", actions: ["view", "create", "edit", "delete"] },
  { module: "products", submodule: "newsletters", actions: ["view", "create", "edit", "delete"] },
  { module: "products", submodule: "downloads", actions: ["view", "create", "edit", "delete"] },
  
  // Sales Module
  { module: "sales", submodule: "payments", actions: ["view", "create", "edit", "delete", "export"] },
  { module: "sales", submodule: "offers", actions: ["view", "create", "edit", "delete"] },
  { module: "sales", submodule: "payouts", actions: ["view", "create", "edit", "delete", "export"] },
  { module: "sales", submodule: "cart", actions: ["view", "edit"] },
  { module: "sales", submodule: "invoices", actions: ["view", "create", "edit", "delete", "export"] },
  { module: "sales", submodule: "coupons", actions: ["view", "create", "edit", "delete"] },
  { module: "sales", submodule: "affiliates", actions: ["view", "create", "edit", "delete", "export"] },
  
  // Website Module
  { module: "website", submodule: "design", actions: ["view", "edit"] },
  { module: "website", submodule: "pages", actions: ["view", "create", "edit", "delete"] },
  { module: "website", submodule: "landing", actions: ["view", "create", "edit", "delete"] },
  { module: "website", submodule: "navigation", actions: ["view", "edit"] },
  { module: "website", submodule: "blog", actions: ["view", "create", "edit", "delete"] },
  
  // Marketing Module
  { module: "marketing", submodule: "email", actions: ["view", "create", "edit", "delete"] },
  { module: "marketing", submodule: "funnels", actions: ["view", "create", "edit", "delete"] },
  { module: "marketing", submodule: "automations", actions: ["view", "create", "edit", "delete"] },
  { module: "marketing", submodule: "events", actions: ["view", "create", "edit", "delete"] },
  { module: "marketing", submodule: "forms", actions: ["view", "create", "edit", "delete"] },
  { module: "marketing", submodule: "contacts", actions: ["view", "create", "edit", "delete", "export"] },
  { module: "marketing", submodule: "inbox", actions: ["view", "create", "edit", "delete"] },
  
  // Insights Module
  { module: "insights", submodule: "assessments", actions: ["view", "create", "edit", "delete", "export"] },
  { module: "insights", submodule: "analytics", actions: ["view", "export"] },
  { module: "insights", submodule: "reports", actions: ["view", "create", "export"] },
  
  // People Module
  { module: "people", submodule: "users", actions: ["view", "create", "edit", "delete", "export"] },
  { module: "people", submodule: "admins", actions: ["view", "create", "edit", "delete"] },
  { module: "people", submodule: "coaches", actions: ["view", "create", "edit", "delete", "export"] },
  { module: "people", submodule: "learners", actions: ["view", "create", "edit", "delete", "export"] },
  { module: "people", submodule: "cohorts", actions: ["view", "create", "edit", "delete", "export"] },
  
  // Settings Module
  { module: "settings", submodule: "general", actions: ["view", "edit"] },
  { module: "settings", submodule: "billing", actions: ["view", "edit", "delete"] },
  { module: "settings", submodule: "integrations", actions: ["view", "create", "edit", "delete"] },
  { module: "settings", submodule: "api", actions: ["view", "create", "edit", "delete"] },
];

// Role permission mappings
const ROLE_PERMISSIONS: Record<string, { module: string; submodule: string; actions: string[] }[]> = {
  owner: PERMISSIONS, // Owner gets ALL permissions
  admin: PERMISSIONS.filter(p => 
    !(p.module === "settings" && p.submodule === "billing" && p.actions.includes("delete")) &&
    !(p.module === "people" && p.submodule === "admins" && p.actions.includes("delete"))
  ),
  hr_admin: [
    { module: "people", submodule: "users", actions: ["view", "create", "edit"] },
    { module: "people", submodule: "learners", actions: ["view", "create", "edit", "export"] },
    { module: "people", submodule: "cohorts", actions: ["view", "create", "edit", "delete", "export"] },
    { module: "insights", submodule: "analytics", actions: ["view", "export"] },
    { module: "insights", submodule: "reports", actions: ["view", "create", "export"] },
    { module: "products", submodule: "courses", actions: ["view"] },
    { module: "sales", submodule: "invoices", actions: ["view", "export"] },
  ],
  coach: [
    { module: "products", submodule: "courses", actions: ["view", "create", "edit"] },
    { module: "products", submodule: "coaching", actions: ["view", "create", "edit"] },
    { module: "people", submodule: "learners", actions: ["view"] },
    { module: "insights", submodule: "reports", actions: ["view"] },
    { module: "marketing", submodule: "inbox", actions: ["view", "create"] },
  ],
  learner: [
    { module: "products", submodule: "courses", actions: ["view"] },
    { module: "products", submodule: "coaching", actions: ["view"] },
    { module: "insights", submodule: "assessments", actions: ["view"] },
  ],
};

async function migrateRBAC() {
  console.log("🚀 Starting RBAC migration...\n");

  try {
    // Step 1: Create tables
    console.log("📦 Creating RBAC tables...");
    
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS roles (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(50) NOT NULL UNIQUE,
        displayName VARCHAR(100) NOT NULL,
        description TEXT,
        level INT NOT NULL DEFAULT 0,
        isSystem BOOLEAN DEFAULT FALSE,
        maxUsers INT,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log("  ✅ roles table created");

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS permissions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        module VARCHAR(50) NOT NULL,
        submodule VARCHAR(50) NOT NULL,
        action ENUM('view', 'create', 'edit', 'delete', 'export') NOT NULL,
        description TEXT,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY unique_permission (module, submodule, action)
      )
    `);
    console.log("  ✅ permissions table created");

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS role_permissions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        roleId INT NOT NULL,
        permissionId INT NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY unique_role_permission (roleId, permissionId),
        FOREIGN KEY (roleId) REFERENCES roles(id) ON DELETE CASCADE,
        FOREIGN KEY (permissionId) REFERENCES permissions(id) ON DELETE CASCADE
      )
    `);
    console.log("  ✅ role_permissions table created");

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS user_permissions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        userId INT NOT NULL,
        permissionId INT NOT NULL,
        granted BOOLEAN DEFAULT TRUE,
        grantedBy INT,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY unique_user_permission (userId, permissionId),
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (permissionId) REFERENCES permissions(id) ON DELETE CASCADE
      )
    `);
    console.log("  ✅ user_permissions table created");

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS password_reset_tokens (
        id INT AUTO_INCREMENT PRIMARY KEY,
        userId INT NOT NULL,
        token VARCHAR(255) NOT NULL UNIQUE,
        type ENUM('reset', 'setup', 'magic_link') DEFAULT 'reset',
        expiresAt TIMESTAMP NOT NULL,
        usedAt TIMESTAMP,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    console.log("  ✅ password_reset_tokens table created");

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS admin_invitations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(320) NOT NULL,
        roleId INT NOT NULL,
        invitedBy INT NOT NULL,
        token VARCHAR(255) NOT NULL UNIQUE,
        expiresAt TIMESTAMP NOT NULL,
        acceptedAt TIMESTAMP,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (roleId) REFERENCES roles(id),
        FOREIGN KEY (invitedBy) REFERENCES users(id)
      )
    `);
    console.log("  ✅ admin_invitations table created");

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS audit_log (
        id INT AUTO_INCREMENT PRIMARY KEY,
        userId INT NOT NULL,
        action VARCHAR(100) NOT NULL,
        targetType VARCHAR(50),
        targetId INT,
        details TEXT,
        ipAddress VARCHAR(45),
        userAgent TEXT,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id)
      )
    `);
    console.log("  ✅ audit_log table created");

    // Add roleId and isOwner columns to users table if not exists
    try {
      await db.execute(sql`ALTER TABLE users ADD COLUMN roleId INT`);
      console.log("  ✅ Added roleId column to users");
    } catch (e: any) {
      if (!e.message.includes("Duplicate column")) throw e;
    }

    try {
      await db.execute(sql`ALTER TABLE users ADD COLUMN isOwner BOOLEAN DEFAULT FALSE`);
      console.log("  ✅ Added isOwner column to users");
    } catch (e: any) {
      if (!e.message.includes("Duplicate column")) throw e;
    }

    // Update role enum to include new roles
    try {
      await db.execute(sql`ALTER TABLE users MODIFY COLUMN role ENUM('owner', 'admin', 'hr_admin', 'coach', 'learner', 'user') DEFAULT 'user'`);
      console.log("  ✅ Updated role enum in users table");
    } catch (e: any) {
      console.log("  ⚠️ Could not update role enum:", e.message);
    }

    // Step 2: Seed default roles
    console.log("\n📋 Seeding default roles...");
    for (const role of DEFAULT_ROLES) {
      await db.execute(sql`
        INSERT INTO roles (name, displayName, description, level, isSystem, maxUsers)
        VALUES (${role.name}, ${role.displayName}, ${role.description}, ${role.level}, ${role.isSystem}, ${role.maxUsers})
        ON DUPLICATE KEY UPDATE displayName = VALUES(displayName), description = VALUES(description)
      `);
      console.log(`  ✅ Role: ${role.displayName}`);
    }

    // Step 3: Seed permissions
    console.log("\n🔐 Seeding permissions...");
    let permCount = 0;
    for (const perm of PERMISSIONS) {
      for (const action of perm.actions) {
        await db.execute(sql`
          INSERT INTO permissions (module, submodule, action)
          VALUES (${perm.module}, ${perm.submodule}, ${action})
          ON DUPLICATE KEY UPDATE module = VALUES(module)
        `);
        permCount++;
      }
    }
    console.log(`  ✅ Created ${permCount} permissions`);

    // Step 4: Assign permissions to roles
    console.log("\n🔗 Assigning permissions to roles...");
    for (const [roleName, perms] of Object.entries(ROLE_PERMISSIONS)) {
      const [roleRows] = await db.execute(sql`SELECT id FROM roles WHERE name = ${roleName}`);
      const roleId = (roleRows as any)[0]?.id;
      if (!roleId) continue;

      let assignedCount = 0;
      for (const perm of perms) {
        for (const action of perm.actions) {
          const [permRows] = await db.execute(sql`
            SELECT id FROM permissions 
            WHERE module = ${perm.module} AND submodule = ${perm.submodule} AND action = ${action}
          `);
          const permId = (permRows as any)[0]?.id;
          if (!permId) continue;

          await db.execute(sql`
            INSERT INTO role_permissions (roleId, permissionId)
            VALUES (${roleId}, ${permId})
            ON DUPLICATE KEY UPDATE roleId = VALUES(roleId)
          `);
          assignedCount++;
        }
      }
      console.log(`  ✅ ${roleName}: ${assignedCount} permissions`);
    }

    console.log("\n✅ RBAC migration completed successfully!");
    return true;
  } catch (error) {
    console.error("❌ Migration failed:", error);
    throw error;
  }
}

// Run migration
migrateRBAC()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
