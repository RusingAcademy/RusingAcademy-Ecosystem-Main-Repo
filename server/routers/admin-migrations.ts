import { Router } from "express";
import { getDb } from "../db";
import { sql } from "drizzle-orm";
import * as crypto from "crypto";
import argon2 from "argon2";
import { createLogger } from "../logger";
const log = createLogger("routers-admin-migrations");

const router = Router();

// Secure migration endpoint - requires MIGRATION_SECRET
router.post("/run-rbac-migration", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const migrationSecret = process.env.MIGRATION_SECRET || process.env.CRON_SECRET;
    
    if (!migrationSecret || authHeader !== `Bearer ${migrationSecret}`) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const db = await getDb();
    if (!db) {
      return res.status(503).json({ error: "Database not available" });
    }

    log.info("🚀 Starting RBAC migration...\n");
    const results: string[] = [];

    // Step 1: Create tables
    results.push("📦 Creating RBAC tables...");
    
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
    results.push("  ✅ roles table created");

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
    results.push("  ✅ permissions table created");

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS role_permissions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        roleId INT NOT NULL,
        permissionId INT NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY unique_role_permission (roleId, permissionId)
      )
    `);
    results.push("  ✅ role_permissions table created");

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS user_permissions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        userId INT NOT NULL,
        permissionId INT NOT NULL,
        granted BOOLEAN DEFAULT TRUE,
        grantedBy INT,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY unique_user_permission (userId, permissionId)
      )
    `);
    results.push("  ✅ user_permissions table created");

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS password_reset_tokens (
        id INT AUTO_INCREMENT PRIMARY KEY,
        userId INT NOT NULL,
        tokenHash VARCHAR(255) NOT NULL,
        type ENUM('reset', 'setup') NOT NULL,
        expiresAt TIMESTAMP NOT NULL,
        usedAt TIMESTAMP NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    results.push("  ✅ password_reset_tokens table created");

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS admin_invitations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(320) NOT NULL,
        roleId INT NOT NULL,
        invitedBy INT NOT NULL,
        token VARCHAR(255) NOT NULL UNIQUE,
        expiresAt TIMESTAMP NOT NULL,
        acceptedAt TIMESTAMP,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    results.push("  ✅ admin_invitations table created");

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
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    results.push("  ✅ audit_log table created");

    // Add columns to users table
    try {
      await db.execute(sql`ALTER TABLE users ADD COLUMN roleId INT`);
      results.push("  ✅ Added roleId column to users");
    } catch (e: any) {
      if (!e.message?.includes("Duplicate column")) {
        results.push(`  ⚠️ roleId: ${e.message}`);
      }
    }

    try {
      await db.execute(sql`ALTER TABLE users ADD COLUMN isOwner BOOLEAN DEFAULT FALSE`);
      results.push("  ✅ Added isOwner column to users");
    } catch (e: any) {
      if (!e.message?.includes("Duplicate column")) {
        results.push(`  ⚠️ isOwner: ${e.message}`);
      }
    }

    // Update role enum
    try {
      await db.execute(sql`ALTER TABLE users MODIFY COLUMN role ENUM('owner', 'admin', 'hr_admin', 'coach', 'learner', 'user') DEFAULT 'user'`);
      results.push("  ✅ Updated role enum in users table");
    } catch (e: any) {
      results.push(`  ⚠️ Role enum: ${e.message}`);
    }

    // Step 2: Seed default roles
    results.push("\n📋 Seeding default roles...");
    const DEFAULT_ROLES = [
      { name: "owner", displayName: "Owner", description: "Super-admin with full platform access", level: 100, isSystem: true, maxUsers: 1 },
      { name: "admin", displayName: "Administrator", description: "Full platform access, can manage users and content", level: 80, isSystem: true, maxUsers: 20 },
      { name: "hr_admin", displayName: "HR Administrator", description: "B2B/B2G focused - cohorts, reporting, licenses", level: 60, isSystem: true, maxUsers: null },
      { name: "coach", displayName: "Coach", description: "Teaching role - sessions, learners, content", level: 40, isSystem: true, maxUsers: null },
      { name: "learner", displayName: "Learner", description: "Learning role - courses, progress, certificates", level: 20, isSystem: true, maxUsers: null },
    ];

    for (const role of DEFAULT_ROLES) {
      await db.execute(sql`
        INSERT INTO roles (name, displayName, description, level, isSystem, maxUsers)
        VALUES (${role.name}, ${role.displayName}, ${role.description}, ${role.level}, ${role.isSystem}, ${role.maxUsers})
        ON DUPLICATE KEY UPDATE displayName = VALUES(displayName), description = VALUES(description)
      `);
      results.push(`  ✅ Role: ${role.displayName}`);
    }

    // Step 3: Seed permissions
    results.push("\n🔐 Seeding permissions...");
    const PERMISSIONS = [
      { module: "products", submodule: "courses", actions: ["view", "create", "edit", "delete", "export"] },
      { module: "products", submodule: "coaching", actions: ["view", "create", "edit", "delete", "export"] },
      { module: "products", submodule: "community", actions: ["view", "create", "edit", "delete"] },
      { module: "sales", submodule: "payments", actions: ["view", "create", "edit", "delete", "export"] },
      { module: "sales", submodule: "offers", actions: ["view", "create", "edit", "delete"] },
      { module: "sales", submodule: "invoices", actions: ["view", "create", "edit", "delete", "export"] },
      { module: "sales", submodule: "coupons", actions: ["view", "create", "edit", "delete"] },
      { module: "website", submodule: "pages", actions: ["view", "create", "edit", "delete"] },
      { module: "website", submodule: "blog", actions: ["view", "create", "edit", "delete"] },
      { module: "marketing", submodule: "email", actions: ["view", "create", "edit", "delete"] },
      { module: "marketing", submodule: "contacts", actions: ["view", "create", "edit", "delete", "export"] },
      { module: "insights", submodule: "analytics", actions: ["view", "export"] },
      { module: "insights", submodule: "reports", actions: ["view", "create", "export"] },
      { module: "people", submodule: "users", actions: ["view", "create", "edit", "delete", "export"] },
      { module: "people", submodule: "admins", actions: ["view", "create", "edit", "delete"] },
      { module: "people", submodule: "coaches", actions: ["view", "create", "edit", "delete", "export"] },
      { module: "people", submodule: "learners", actions: ["view", "create", "edit", "delete", "export"] },
      { module: "people", submodule: "cohorts", actions: ["view", "create", "edit", "delete", "export"] },
      { module: "settings", submodule: "general", actions: ["view", "edit"] },
      { module: "settings", submodule: "billing", actions: ["view", "edit", "delete"] },
      { module: "settings", submodule: "integrations", actions: ["view", "create", "edit", "delete"] },
    ];

    let permCount = 0;
    for (const perm of PERMISSIONS) {
      for (const action of perm.actions) {
        try {
          await db.execute(sql`
            INSERT INTO permissions (module, submodule, action)
            VALUES (${perm.module}, ${perm.submodule}, ${action})
            ON DUPLICATE KEY UPDATE module = VALUES(module)
          `);
          permCount++;
        } catch (e) {
          // Ignore duplicates
        }
      }
    }
    results.push(`  ✅ Created ${permCount} permissions`);

    results.push("\n✅ RBAC migration completed successfully!");

    return res.json({ 
      success: true, 
      message: "RBAC migration completed",
      results 
    });
  } catch (error: any) {
    log.error("❌ Migration failed:", error);
    return res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Create owner account endpoint
router.post("/create-owner", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const migrationSecret = process.env.MIGRATION_SECRET || process.env.CRON_SECRET;
    
    if (!migrationSecret || authHeader !== `Bearer ${migrationSecret}`) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const db = await getDb();
    if (!db) {
      return res.status(503).json({ error: "Database not available" });
    }

    const { email, name } = req.body;
    
    if (!email || !name) {
      return res.status(400).json({ error: "Email and name are required" });
    }

    log.info(`🚀 Creating Owner account for ${email}...`);

    // Get the owner role ID
    const [roleRows] = await db.execute(sql`SELECT id FROM roles WHERE name = 'owner'`);
    const ownerRoleId = (roleRows as any)[0]?.id;
    
    if (!ownerRoleId) {
      return res.status(400).json({ error: "Owner role not found. Please run RBAC migration first." });
    }

    // Check if owner already exists
    const [existingUser] = await db.execute(sql`SELECT id FROM users WHERE email = ${email}`);
    let userId: number;

    if ((existingUser as any).length > 0) {
      userId = (existingUser as any)[0].id;
      
      // Update to owner role
      await db.execute(sql`
        UPDATE users 
        SET role = 'owner', roleId = ${ownerRoleId}, isOwner = TRUE, name = ${name}
        WHERE id = ${userId}
      `);
    } else {
      // Create new user
      const openId = `owner_${crypto.randomBytes(16).toString("hex")}`;
      
      await db.execute(sql`
        INSERT INTO users (openId, email, name, role, roleId, isOwner, loginMethod, emailVerified)
        VALUES (${openId}, ${email}, ${name}, 'owner', ${ownerRoleId}, TRUE, 'email', TRUE)
      `);
      
      const [newUser] = await db.execute(sql`SELECT id FROM users WHERE email = ${email}`);
      userId = (newUser as any)[0].id;
    }

    // Generate password setup token
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    // Delete any existing tokens for this user
    await db.execute(sql`DELETE FROM password_reset_tokens WHERE userId = ${userId}`);
    
    // Hash the token for storage
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    await db.execute(sql`
      INSERT INTO password_reset_tokens (userId, tokenHash, type, expiresAt)
      VALUES (${userId}, ${tokenHash}, 'setup', ${expiresAt})
    `);

    // Generate the setup URL
    const baseUrl = process.env.VITE_APP_URL || "https://www.rusingacademy.ca";
    const setupUrl = `${baseUrl}/set-password?token=${token}`;

    return res.json({
      success: true,
      message: "Owner account created successfully",
      email,
      name,
      setupUrl,
      expiresIn: "7 days"
    });
  } catch (error: any) {
    log.error("❌ Failed to create owner account:", error);
    return res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Promote existing user to owner (Option A - for users who already signed up)
router.post("/promote-to-owner", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const migrationSecret = process.env.MIGRATION_SECRET || process.env.CRON_SECRET;
    
    if (!migrationSecret || authHeader !== `Bearer ${migrationSecret}`) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const db = await getDb();
    if (!db) {
      return res.status(503).json({ error: "Database not available" });
    }

    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    log.info(`🚀 Promoting user ${email} to Owner...`);

    // Check if user exists
    const [existingUser] = await db.execute(sql`SELECT id, name, role, isOwner FROM users WHERE email = ${email}`);
    
    if ((existingUser as any).length === 0) {
      return res.status(404).json({ 
        error: "User not found. Please sign up first at /signup" 
      });
    }

    const user = (existingUser as any)[0];

    // Get the owner role ID
    const [roleRows] = await db.execute(sql`SELECT id FROM roles WHERE name = 'owner'`);
    let ownerRoleId = (roleRows as any)[0]?.id;
    
    // If owner role doesn't exist, create it
    if (!ownerRoleId) {
      log.info("Owner role not found, creating it...");
      await db.execute(sql`
        INSERT INTO roles (name, displayName, description, level, isSystem, maxUsers)
        VALUES ('owner', 'Owner', 'Super-admin with full platform access', 100, TRUE, 1)
        ON DUPLICATE KEY UPDATE displayName = 'Owner'
      `);
      const [newRole] = await db.execute(sql`SELECT id FROM roles WHERE name = 'owner'`);
      ownerRoleId = (newRole as any)[0]?.id;
    }

    // Update user to owner role
    await db.execute(sql`
      UPDATE users 
      SET role = 'owner', roleId = ${ownerRoleId}, isOwner = TRUE, emailVerified = TRUE
      WHERE id = ${user.id}
    `);

    // Log the action
    try {
      await db.execute(sql`
        INSERT INTO audit_log (userId, action, targetType, targetId, details)
        VALUES (${user.id}, 'user.promote_to_owner', 'user', ${user.id}, ${JSON.stringify({ email, previousRole: user.role })})
      `);
    } catch (e) {
      log.info("Audit log not available, skipping");
    }

    return res.json({
      success: true,
      message: "User promoted to Owner successfully",
      user: {
        id: user.id,
        email,
        name: user.name,
        role: "owner",
        isOwner: true,
        previousRole: user.role
      },
      howToTest: [
        "1. Go to https://www.rusingacademy.ca/login",
        "2. Login with your email and password",
        "3. You should now have full admin access",
        "4. Access /admin to see the admin dashboard"
      ]
    });
  } catch (error: any) {
    log.error("❌ Failed to promote user to owner:", error);
    return res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Run HR tables migration
router.post("/run-hr-migration", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const migrationSecret = process.env.MIGRATION_SECRET || process.env.CRON_SECRET;
    
    if (!migrationSecret || authHeader !== `Bearer ${migrationSecret}`) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const db = await getDb();
    if (!db) {
      return res.status(503).json({ error: "Database not available" });
    }

    log.info("🚀 Starting HR tables migration...\n");
    const results: string[] = [];

    // Create cohorts table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS cohorts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        organizationId INT NOT NULL,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        department VARCHAR(200),
        manager VARCHAR(255),
        managerEmail VARCHAR(320),
        targetLevel JSON,
        targetDate TIMESTAMP NULL,
        status ENUM('active', 'inactive', 'completed', 'archived') DEFAULT 'active',
        memberCount INT DEFAULT 0,
        avgProgress INT DEFAULT 0,
        completionRate INT DEFAULT 0,
        createdBy INT,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (organizationId) REFERENCES organizations(id) ON DELETE CASCADE
      )
    `);
    results.push("✅ cohorts table created");

    // Create cohort_members table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS cohort_members (
        id INT AUTO_INCREMENT PRIMARY KEY,
        cohortId INT NOT NULL,
        userId INT NOT NULL,
        role ENUM('member', 'lead') DEFAULT 'member',
        currentProgress INT DEFAULT 0,
        lastActiveAt TIMESTAMP NULL,
        status ENUM('active', 'inactive', 'completed') DEFAULT 'active',
        addedBy INT,
        addedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (cohortId) REFERENCES cohorts(id) ON DELETE CASCADE,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
        UNIQUE KEY unique_cohort_member (cohortId, userId)
      )
    `);
    results.push("✅ cohort_members table created");

    // Create course_assignments table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS course_assignments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        organizationId INT NOT NULL,
        cohortId INT,
        userId INT,
        courseId INT,
        pathId INT,
        assignmentType ENUM('required', 'optional', 'recommended') DEFAULT 'required',
        priority INT DEFAULT 0,
        startDate TIMESTAMP NULL,
        dueDate TIMESTAMP NULL,
        targetLevel ENUM('BBB', 'CBC', 'CCC'),
        status ENUM('active', 'completed', 'cancelled', 'expired') DEFAULT 'active',
        assignedBy INT,
        assignedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        completedAt TIMESTAMP NULL,
        notes TEXT,
        FOREIGN KEY (organizationId) REFERENCES organizations(id) ON DELETE CASCADE
      )
    `);
    results.push("✅ course_assignments table created");

    // Create hr_audit_log table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS hr_audit_log (
        id INT AUTO_INCREMENT PRIMARY KEY,
        organizationId INT NOT NULL,
        userId INT NOT NULL,
        action ENUM('cohort_created', 'cohort_updated', 'cohort_deleted', 'member_added', 'member_removed', 'course_assigned', 'course_unassigned', 'report_exported', 'learner_invited', 'settings_changed') NOT NULL,
        targetType VARCHAR(50),
        targetId INT,
        details JSON,
        ipAddress VARCHAR(45),
        userAgent TEXT,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (organizationId) REFERENCES organizations(id) ON DELETE CASCADE
      )
    `);
    results.push("✅ hr_audit_log table created");

    // Add HR-specific permissions
    const HR_PERMISSIONS = [
      { module: "hr", submodule: "cohorts", actions: ["view", "create", "edit", "delete", "export"] },
      { module: "hr", submodule: "assignments", actions: ["view", "create", "edit", "delete"] },
      { module: "hr", submodule: "reports", actions: ["view", "export"] },
      { module: "hr", submodule: "learners", actions: ["view", "create", "edit", "export"] },
      { module: "hr", submodule: "compliance", actions: ["view", "export"] },
    ];

    let permCount = 0;
    for (const perm of HR_PERMISSIONS) {
      for (const action of perm.actions) {
        try {
          await db.execute(sql`
            INSERT INTO permissions (module, submodule, action)
            VALUES (${perm.module}, ${perm.submodule}, ${action})
            ON DUPLICATE KEY UPDATE module = VALUES(module)
          `);
          permCount++;
        } catch (e) {
          // Ignore duplicates
        }
      }
    }
    results.push(`✅ Created ${permCount} HR permissions`);

    // Assign HR permissions to hr_admin role
    const [hrRole] = await db.execute(sql`SELECT id FROM roles WHERE name = 'hr_admin'`);
    if ((hrRole as any).length > 0) {
      const hrRoleId = (hrRole as any)[0].id;
      const [hrPerms] = await db.execute(sql`SELECT id FROM permissions WHERE module = 'hr'`);
      for (const perm of hrPerms as unknown as any[]) {
        try {
          await db.execute(sql`
            INSERT INTO role_permissions (roleId, permissionId)
            VALUES (${hrRoleId}, ${perm.id})
            ON DUPLICATE KEY UPDATE roleId = VALUES(roleId)
          `);
        } catch (e) {
          // Ignore duplicates
        }
      }
      results.push("✅ Assigned HR permissions to hr_admin role");
    }

    results.push("\n✅ HR migration completed successfully!");

    return res.json({ 
      success: true, 
      message: "HR migration completed",
      results 
    });
  } catch (error: any) {
    log.error("❌ HR Migration failed:", error);
    return res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Create HR admin for an organization
router.post("/create-hr-admin", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const migrationSecret = process.env.MIGRATION_SECRET || process.env.CRON_SECRET;
    
    if (!migrationSecret || authHeader !== `Bearer ${migrationSecret}`) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const db = await getDb();
    if (!db) {
      return res.status(503).json({ error: "Database not available" });
    }

    const { email, organizationId } = req.body;
    
    if (!email || !organizationId) {
      return res.status(400).json({ error: "Email and organizationId are required" });
    }

    log.info(`🚀 Creating HR Admin for ${email} in org ${organizationId}...`);

    // Check if user exists
    const [existingUser] = await db.execute(sql`SELECT id, name, role FROM users WHERE email = ${email}`);
    
    if ((existingUser as any).length === 0) {
      return res.status(404).json({ 
        error: "User not found. Please sign up first at /signup" 
      });
    }

    const user = (existingUser as any)[0];

    // Check if organization exists
    const [org] = await db.execute(sql`SELECT id, name FROM organizations WHERE id = ${organizationId}`);
    if ((org as any).length === 0) {
      return res.status(404).json({ error: "Organization not found" });
    }

    // Get the hr_admin role ID
    const [roleRows] = await db.execute(sql`SELECT id FROM roles WHERE name = 'hr_admin'`);
    const hrRoleId = (roleRows as any)[0]?.id;
    
    if (!hrRoleId) {
      return res.status(400).json({ error: "HR Admin role not found. Please run RBAC migration first." });
    }

    // Update user to hr_admin role
    await db.execute(sql`
      UPDATE users 
      SET role = 'hr_admin', roleId = ${hrRoleId}
      WHERE id = ${user.id}
    `);

    // Add user as admin in organization_members
    await db.execute(sql`
      INSERT INTO organization_members (organizationId, userId, role, status, joinedAt)
      VALUES (${organizationId}, ${user.id}, 'admin', 'active', NOW())
      ON DUPLICATE KEY UPDATE role = 'admin', status = 'active'
    `);

    return res.json({
      success: true,
      message: "HR Admin created successfully",
      user: {
        id: user.id,
        email,
        name: user.name,
        role: "hr_admin",
        organizationId,
        organizationName: (org as any)[0].name
      },
      howToTest: [
        "1. Go to https://www.rusingacademy.ca/login",
        "2. Login with your email and password",
        "3. You should be redirected to /dashboard/hr",
        "4. You can manage cohorts, assignments, and view reports for your organization"
      ]
    });
  } catch (error: any) {
    log.error("❌ Failed to create HR admin:", error);
    return res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

/// Direct password reset for admin use
router.post("/reset-password", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const migrationSecret = process.env.MIGRATION_SECRET || process.env.CRON_SECRET;
    
    if (!migrationSecret || authHeader !== `Bearer ${migrationSecret}`) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }
    const db = await getDb();
    if (!db) {
      return res.status(503).json({ error: "Database not available" });
    }
    // Hash password with Argon2id (matching auth.ts config)
    const passwordHash = await argon2.hash(password, {
      type: argon2.argon2id,
      memoryCost: 65536,
      timeCost: 3,
      parallelism: 4,
    });
    // Update user password
    const result = await db.execute(sql`
      UPDATE users 
      SET passwordHash = ${passwordHash}, emailVerified = TRUE 
      WHERE email = ${email.toLowerCase()}
    `);

    if ((result as any)[0].affectedRows === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.json({
      success: true,
      message: `Password reset successfully for ${email}`,
    });
  } catch (error: any) {
    log.error("❌ Failed to reset password:", error);
    return res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// List users for debugging
router.get("/list-users", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const migrationSecret = process.env.MIGRATION_SECRET || process.env.CRON_SECRET;
    
    if (!migrationSecret || authHeader !== `Bearer ${migrationSecret}`) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const db = await getDb();
    if (!db) {
      return res.status(503).json({ error: "Database not available" });
    }

    const users = await db.execute(sql`SELECT id, email, name, role, isOwner FROM users LIMIT 50`);

    return res.json({
      success: true,
      users: users[0],
    });
  } catch (error: any) {
    log.error("❌ Failed to list users:", error);
    return res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// ============================================================================
// MIGRATION: Replace old courses with 12 GC Bilingual Path Series (6 FSL + 6 ESL)
// POST /api/admin/migrations/replace-courses-with-path-series
// ============================================================================
router.post("/replace-courses-with-path-series", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const migrationSecret = process.env.MIGRATION_SECRET || process.env.CRON_SECRET;
    if (!migrationSecret || authHeader !== `Bearer ${migrationSecret}`) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const db = await getDb();
    if (!db) {
      return res.status(503).json({ error: "Database not available" });
    }
    log.info("🚀 Starting course replacement migration...");
    const results: string[] = [];

    // ── Step 1: Delete all existing course data (cascade) ──
    results.push("🗑️ Step 1: Deleting all existing course data...");
    const deleteTables = [
      "quiz_questions",
      "activity_progress",
      "activities",
      "interactive_exercises",
      "confidence_checks",
      "learner_notes",
      "course_comments",
      "course_assignments",
      "drip_schedules",
      "lesson_progress",
      "certificates",
      "course_reviews",
      "course_enrollments",
      "bundle_courses",
      "path_courses",
      "live_rooms",
      "quizzes",
      "lessons",
      "course_modules",
      "courses",
    ];
    for (const table of deleteTables) {
      try {
        await db.execute(sql.raw(`DELETE FROM \`${table}\``));
        results.push(`  ✅ Cleared ${table}`);
      } catch (e: any) {
        results.push(`  ⚠️ Skipped ${table}: ${e.message}`);
      }
    }

    // ── Step 2: Insert 12 Path Series courses ──
    results.push("\n📚 Step 2: Creating 12 GC Bilingual Path Series courses...");

    const allPaths = [
      // ── FSL Paths ──
      {
        pathNumber: 1, title: "Path I: FSL - Foundations", titleFr: "Path I : FLS - Fondations",
        slug: "path-i-foundations",
        description: "Build the fundamental communication skills required for basic professional interactions in the Canadian federal public service. Master essential greetings, introductions, and workplace vocabulary.",
        descriptionFr: "Développez les compétences de communication fondamentales requises pour les interactions professionnelles de base dans la fonction publique fédérale canadienne. Maîtrisez les salutations essentielles, les présentations et le vocabulaire du milieu de travail.",
        shortDescription: "Essential foundations for professional French communication in the GC workplace.",
        shortDescriptionFr: "Bases essentielles pour la communication professionnelle en français au sein du GC.",
        level: "beginner", category: "sle_oral", targetLanguage: "french",
        price: 89900, originalPrice: 99900, estimatedHours: 30,
        modules: [
          { title: "First Professional Steps", titleFr: "Premiers Pas Professionnels", description: "Master essential greetings, introductions, and basic workplace interactions.", descriptionFr: "Maîtrisez les salutations essentielles, les présentations et les interactions de base au travail.", lessons: [
            { title: "Hello, My Name Is...", titleFr: "Bonjour, je m'appelle..." },
            { title: "My Office, My Team", titleFr: "Mon bureau, mon équipe" },
            { title: "Daily Routine", titleFr: "La routine quotidienne" },
            { title: "Asking Key Questions", titleFr: "Poser des questions clés" },
          ]},
          { title: "Daily Communication", titleFr: "Communication Quotidienne", description: "Master everyday workplace communication in French.", descriptionFr: "Maîtriser la communication quotidienne au travail en français.", lessons: [
            { title: "On the Phone", titleFr: "Au téléphone" },
            { title: "Essential Emails", titleFr: "Les courriels essentiels" },
            { title: "Understanding Instructions", titleFr: "Comprendre des instructions" },
            { title: "Giving Simple Directions", titleFr: "Donner des directives simples" },
          ]},
          { title: "Essential Interactions", titleFr: "Interactions Essentielles", description: "Navigate essential workplace interactions with confidence.", descriptionFr: "Naviguer les interactions essentielles au travail avec confiance.", lessons: [
            { title: "Making a Polite Request", titleFr: "Faire une demande polie" },
            { title: "Expressing Needs & Preferences", titleFr: "Exprimer besoins et préférences" },
            { title: "Coffee Break Chat", titleFr: "La pause café" },
            { title: "React & Respond", titleFr: "Réagir et répondre" },
          ]},
          { title: "Towards Autonomy", titleFr: "Vers l'Autonomie", description: "Develop independence in French workplace communication.", descriptionFr: "Développer l'autonomie dans la communication professionnelle en français.", lessons: [
            { title: "Describing a Simple Problem", titleFr: "Décrire un problème simple" },
            { title: "Confirming & Verifying", titleFr: "Confirmer et vérifier" },
            { title: "Talking About Past Experience", titleFr: "Parler de son expérience passée" },
            { title: "Final Project", titleFr: "Projet final" },
          ]},
        ],
      },
      {
        pathNumber: 2, title: "Path II: FSL - Everyday Fluency", titleFr: "Path II : FLS - Aisance Quotidienne",
        slug: "path-ii-everyday-fluency",
        description: "Develop confidence in everyday professional interactions. Learn to discuss past events, future projects, and personal opinions with increasing spontaneity and accuracy.",
        descriptionFr: "Développez votre confiance dans les interactions professionnelles quotidiennes. Apprenez à discuter d'événements passés, de projets futurs et d'opinions personnelles avec une spontanéité et une précision croissantes.",
        shortDescription: "Build everyday fluency for confident workplace communication.",
        shortDescriptionFr: "Développez une aisance quotidienne pour une communication confiante au travail.",
        level: "beginner", category: "sle_oral", targetLanguage: "french",
        price: 89900, originalPrice: 99900, estimatedHours: 30,
        modules: [
          { title: "Electronic Communication", titleFr: "Communication Électronique", description: "Master professional electronic communication in French.", descriptionFr: "Maîtriser la communication électronique professionnelle en français.", lessons: [
            { title: "Professional Emails", titleFr: "Courriels professionnels" },
            { title: "Teams & Slack Messages", titleFr: "Messages Teams et Slack" },
            { title: "Calendar Management", titleFr: "Gestion du calendrier" },
            { title: "Digital Etiquette", titleFr: "Étiquette numérique" },
          ]},
          { title: "Social Interactions", titleFr: "Interactions Sociales", description: "Navigate social situations in the workplace.", descriptionFr: "Naviguer les situations sociales au travail.", lessons: [
            { title: "Team Lunch Conversations", titleFr: "Conversations au dîner d'équipe" },
            { title: "Networking Events", titleFr: "Événements de réseautage" },
            { title: "Expressing Opinions", titleFr: "Exprimer des opinions" },
            { title: "Cultural Sensitivity", titleFr: "Sensibilité culturelle" },
          ]},
          { title: "Administrative Tasks", titleFr: "Tâches Administratives", description: "Handle administrative tasks in French.", descriptionFr: "Gérer les tâches administratives en français.", lessons: [
            { title: "Leave Requests", titleFr: "Demandes de congé" },
            { title: "Expense Reports", titleFr: "Rapports de dépenses" },
            { title: "Meeting Minutes", titleFr: "Procès-verbaux de réunion" },
            { title: "Filing & Documentation", titleFr: "Classement et documentation" },
          ]},
          { title: "Finding Your Way", titleFr: "Trouver Son Chemin", description: "Navigate the public service environment.", descriptionFr: "Naviguer l'environnement de la fonction publique.", lessons: [
            { title: "Building Navigation", titleFr: "Navigation dans l'édifice" },
            { title: "Asking for Directions", titleFr: "Demander des directions" },
            { title: "Public Transit", titleFr: "Transport en commun" },
            { title: "Path II Review & Consolidation", titleFr: "Révision et Consolidation du Path II" },
          ]},
        ],
      },
      {
        pathNumber: 3, title: "Path III: FSL - Operational French", titleFr: "Path III : FLS - Français Opérationnel",
        slug: "path-iii-operational-french",
        description: "Achieve functional professional autonomy. Present arguments, participate in debates, write structured reports, and handle most workplace communication situations independently.",
        descriptionFr: "Atteignez une autonomie professionnelle fonctionnelle. Présentez des arguments, participez à des débats, rédigez des rapports structurés et gérez la plupart des situations de communication au travail de manière indépendante.",
        shortDescription: "Professional communication for independent workplace autonomy.",
        shortDescriptionFr: "Communication professionnelle pour une autonomie indépendante au travail.",
        level: "intermediate", category: "sle_oral", targetLanguage: "french",
        price: 99900, originalPrice: 119900, estimatedHours: 35,
        modules: [
          { title: "Participating in Meetings", titleFr: "Participer aux Réunions", description: "Actively participate in professional meetings.", descriptionFr: "Participer activement aux réunions professionnelles.", lessons: [
            { title: "Meeting Vocabulary", titleFr: "Vocabulaire de réunion" },
            { title: "Expressing Agreement & Disagreement", titleFr: "Exprimer l'accord et le désaccord" },
            { title: "Proposing Ideas", titleFr: "Proposer des idées" },
            { title: "Summarizing Discussions", titleFr: "Résumer les discussions" },
          ]},
          { title: "Written Communication", titleFr: "Communication Écrite", description: "Master professional written French.", descriptionFr: "Maîtriser le français écrit professionnel.", lessons: [
            { title: "Formal Letters", titleFr: "Lettres formelles" },
            { title: "Reports & Briefing Notes", titleFr: "Rapports et notes d'information" },
            { title: "Proofreading & Editing", titleFr: "Révision et correction" },
            { title: "Policy Documents", titleFr: "Documents de politique" },
          ]},
          { title: "Simple Presentations", titleFr: "Présentations Simples", description: "Deliver clear presentations in French.", descriptionFr: "Livrer des présentations claires en français.", lessons: [
            { title: "Structuring a Presentation", titleFr: "Structurer une présentation" },
            { title: "Visual Aids & Slides", titleFr: "Aides visuelles et diapositives" },
            { title: "Q&A Sessions", titleFr: "Séances de questions-réponses" },
            { title: "Handling Nervousness", titleFr: "Gérer le trac" },
          ]},
          { title: "Negotiation & Persuasion", titleFr: "Négociation et Persuasion", description: "Develop negotiation and persuasion skills.", descriptionFr: "Développer les compétences de négociation et de persuasion.", lessons: [
            { title: "Building Arguments", titleFr: "Construire des arguments" },
            { title: "Compromise & Consensus", titleFr: "Compromis et consensus" },
            { title: "Persuasive Language", titleFr: "Langage persuasif" },
            { title: "Path III Review & Assessment", titleFr: "Révision et Évaluation du Path III" },
          ]},
        ],
      },
      {
        pathNumber: 4, title: "Path IV: FSL - Strategic Expression", titleFr: "Path IV : FLS - Expression Stratégique",
        slug: "path-iv-strategic-expression",
        description: "Master precision, nuance, and leadership communication. Develop advanced grammatical structures, persuasive argumentation, and effective communication in complex professional contexts.",
        descriptionFr: "Maîtrisez la précision, la nuance et la communication de leadership. Développez des structures grammaticales avancées, l'argumentation persuasive et la communication efficace dans des contextes professionnels complexes.",
        shortDescription: "Advanced strategic communication for leadership roles.",
        shortDescriptionFr: "Communication stratégique avancée pour les rôles de leadership.",
        level: "advanced", category: "sle_oral", targetLanguage: "french",
        price: 109900, originalPrice: 129900, estimatedHours: 35,
        modules: [
          { title: "Communication & Influence", titleFr: "Communication et Influence", description: "Master influential communication strategies.", descriptionFr: "Maîtriser les stratégies de communication influente.", lessons: [
            { title: "Strategic Messaging", titleFr: "Messages stratégiques" },
            { title: "Stakeholder Management", titleFr: "Gestion des parties prenantes" },
            { title: "Public Speaking", titleFr: "Prise de parole en public" },
            { title: "Media Relations", titleFr: "Relations avec les médias" },
          ]},
          { title: "Project Management", titleFr: "Gestion de Projet", description: "Lead projects in French.", descriptionFr: "Diriger des projets en français.", lessons: [
            { title: "Project Planning", titleFr: "Planification de projet" },
            { title: "Team Coordination", titleFr: "Coordination d'équipe" },
            { title: "Status Reports", titleFr: "Rapports d'avancement" },
            { title: "Risk Management", titleFr: "Gestion des risques" },
          ]},
          { title: "Sensitive Communication", titleFr: "Communication Sensible", description: "Handle sensitive topics professionally.", descriptionFr: "Gérer les sujets sensibles de manière professionnelle.", lessons: [
            { title: "Conflict Resolution", titleFr: "Résolution de conflits" },
            { title: "Performance Reviews", titleFr: "Évaluations de rendement" },
            { title: "Difficult Conversations", titleFr: "Conversations difficiles" },
            { title: "Empathetic Communication", titleFr: "Communication empathique" },
          ]},
          { title: "Leadership & Influence", titleFr: "Leadership et Influence", description: "Develop leadership communication skills.", descriptionFr: "Développer les compétences de communication en leadership.", lessons: [
            { title: "Visionary Communication", titleFr: "Communication visionnaire" },
            { title: "Motivating Teams", titleFr: "Motiver les équipes" },
            { title: "Change Management", titleFr: "Gestion du changement" },
            { title: "Path IV Review & Mastery Check", titleFr: "Révision et Vérification de Maîtrise du Path IV" },
          ]},
        ],
      },
      {
        pathNumber: 5, title: "Path V: FSL - Professional Mastery", titleFr: "Path V : FLS - Maîtrise Professionnelle",
        slug: "path-v-professional-mastery",
        description: "Achieve expert-level communication with idiomatic mastery and cultural sophistication. Develop advanced competencies for executive roles: facilitating meetings, negotiating, and producing high-quality documents.",
        descriptionFr: "Atteignez une communication de niveau expert avec une maîtrise idiomatique et une sophistication culturelle. Développez les compétences avancées pour les rôles exécutifs : animer des réunions, négocier et produire des documents de haute qualité.",
        shortDescription: "Expert-level mastery for executive bilingual communication.",
        shortDescriptionFr: "Maîtrise de niveau expert pour la communication bilingue exécutive.",
        level: "advanced", category: "sle_oral", targetLanguage: "french",
        price: 119900, originalPrice: 149900, estimatedHours: 40,
        modules: [
          { title: "Leadership & Vision", titleFr: "Leadership et Vision", description: "Communicate vision and leadership in French.", descriptionFr: "Communiquer la vision et le leadership en français.", lessons: [
            { title: "Executive Briefings", titleFr: "Séances d'information exécutives" },
            { title: "Strategic Planning", titleFr: "Planification stratégique" },
            { title: "Board Presentations", titleFr: "Présentations au conseil" },
            { title: "Organizational Vision", titleFr: "Vision organisationnelle" },
          ]},
          { title: "Analysis & Synthesis", titleFr: "Analyse et Synthèse", description: "Master analytical and synthesis skills in French.", descriptionFr: "Maîtriser les compétences d'analyse et de synthèse en français.", lessons: [
            { title: "Complex Document Analysis", titleFr: "Analyse de documents complexes" },
            { title: "Data Interpretation", titleFr: "Interprétation des données" },
            { title: "Executive Summaries", titleFr: "Sommaires exécutifs" },
            { title: "Policy Analysis", titleFr: "Analyse de politiques" },
          ]},
          { title: "Crisis Communication", titleFr: "Communication de Crise", description: "Handle crisis communication effectively.", descriptionFr: "Gérer la communication de crise efficacement.", lessons: [
            { title: "Crisis Response", titleFr: "Réponse de crise" },
            { title: "Media Management", titleFr: "Gestion des médias" },
            { title: "Internal Communication", titleFr: "Communication interne" },
            { title: "Recovery & Lessons Learned", titleFr: "Rétablissement et leçons apprises" },
          ]},
          { title: "Negotiation & Diplomacy", titleFr: "Négociation et Diplomatie", description: "Master high-level negotiation and diplomacy.", descriptionFr: "Maîtriser la négociation et la diplomatie de haut niveau.", lessons: [
            { title: "Diplomatic Language", titleFr: "Langage diplomatique" },
            { title: "Multi-party Negotiations", titleFr: "Négociations multipartites" },
            { title: "International Relations", titleFr: "Relations internationales" },
            { title: "Path V Capstone Assessment", titleFr: "Évaluation Finale du Path V" },
          ]},
        ],
      },
      {
        pathNumber: 6, title: "Path VI: FSL - SLE Accelerator", titleFr: "Path VI : FLS - Accélérateur ELS",
        slug: "path-vi-sle-accelerator",
        description: "Intensive preparation specifically designed for Second Language Evaluation (SLE) success. Master exam strategies, complete practice exams with detailed feedback, and develop confidence for maximum performance.",
        descriptionFr: "Préparation intensive spécialement conçue pour réussir l'Évaluation de langue seconde (ELS). Maîtrisez les stratégies d'examen, complétez des examens pratiques avec rétroaction détaillée et développez la confiance pour une performance maximale.",
        shortDescription: "Intensive SLE exam preparation for guaranteed success.",
        shortDescriptionFr: "Préparation intensive à l'ELS pour un succès garanti.",
        level: "advanced", category: "exam_prep", targetLanguage: "french",
        price: 129900, originalPrice: 159900, estimatedHours: 40,
        modules: [
          { title: "Reading Comprehension", titleFr: "Compréhension de Lecture", description: "Master SLE reading comprehension strategies.", descriptionFr: "Maîtriser les stratégies de compréhension de lecture de l'ELS.", lessons: [
            { title: "Text Analysis Strategies", titleFr: "Stratégies d'analyse de texte" },
            { title: "Vocabulary in Context", titleFr: "Vocabulaire en contexte" },
            { title: "Inference & Deduction", titleFr: "Inférence et déduction" },
            { title: "Practice Exam: Reading", titleFr: "Examen pratique : Lecture" },
          ]},
          { title: "Written Expression", titleFr: "Expression Écrite", description: "Master SLE written expression.", descriptionFr: "Maîtriser l'expression écrite de l'ELS.", lessons: [
            { title: "Grammar Mastery", titleFr: "Maîtrise de la grammaire" },
            { title: "Essay Structure", titleFr: "Structure de la dissertation" },
            { title: "Formal Register", titleFr: "Registre formel" },
            { title: "Practice Exam: Written", titleFr: "Examen pratique : Écrit" },
          ]},
          { title: "Oral Comprehension", titleFr: "Compréhension Orale", description: "Master SLE oral comprehension.", descriptionFr: "Maîtriser la compréhension orale de l'ELS.", lessons: [
            { title: "Listening Strategies", titleFr: "Stratégies d'écoute" },
            { title: "Note-Taking Techniques", titleFr: "Techniques de prise de notes" },
            { title: "Accent & Speed Adaptation", titleFr: "Adaptation à l'accent et au débit" },
            { title: "Practice Exam: Oral Comprehension", titleFr: "Examen pratique : Compréhension orale" },
          ]},
          { title: "Oral Expression", titleFr: "Expression Orale", description: "Master SLE oral expression.", descriptionFr: "Maîtriser l'expression orale de l'ELS.", lessons: [
            { title: "Fluency & Coherence", titleFr: "Aisance et cohérence" },
            { title: "Argumentation Strategies", titleFr: "Stratégies d'argumentation" },
            { title: "Exam Simulation", titleFr: "Simulation d'examen" },
            { title: "Final SLE Readiness Assessment", titleFr: "Évaluation finale de préparation à l'ELS" },
          ]},
        ],
      },
      // ── ESL Paths ──
      {
        pathNumber: 1, title: "ESL Path I: Foundations", titleFr: "ALS Path I : Fondations",
        slug: "esl-path-i-foundations",
        description: "Build the fundamental English communication skills required for basic professional interactions in the Canadian federal public service.",
        descriptionFr: "Développez les compétences de communication fondamentales en anglais requises pour les interactions professionnelles de base dans la fonction publique fédérale canadienne.",
        shortDescription: "Essential foundations for professional English communication in the GC workplace.",
        shortDescriptionFr: "Bases essentielles pour la communication professionnelle en anglais au sein du GC.",
        level: "beginner", category: "business_english", targetLanguage: "english",
        price: 89900, originalPrice: 99900, estimatedHours: 30,
        modules: [
          { title: "First Impressions", titleFr: "Premières Impressions", description: "Build confidence in professional introductions.", descriptionFr: "Développer la confiance dans les présentations professionnelles.", lessons: [
            { title: "Hello, My Name Is...", titleFr: "Bonjour, je m'appelle..." },
            { title: "My Office, My Team", titleFr: "Mon bureau, mon équipe" },
            { title: "Numbers, Dates & Time", titleFr: "Chiffres, dates et heure" },
            { title: "Can You Help Me?", titleFr: "Pouvez-vous m'aider?" },
          ]},
          { title: "Your Work Environment", titleFr: "Votre Environnement de Travail", description: "Describe your professional environment.", descriptionFr: "Décrire votre environnement professionnel.", lessons: [
            { title: "What Do You Do?", titleFr: "Que faites-vous?" },
            { title: "Our Department", titleFr: "Notre ministère" },
            { title: "Office Supplies & Technology", titleFr: "Fournitures et technologie" },
            { title: "Health & Safety at Work", titleFr: "Santé et sécurité au travail" },
          ]},
          { title: "Daily Routines", titleFr: "Routines Quotidiennes", description: "Manage time and daily interactions.", descriptionFr: "Gérer le temps et les interactions quotidiennes.", lessons: [
            { title: "My Typical Day", titleFr: "Ma journée typique" },
            { title: "Making Appointments", titleFr: "Prendre rendez-vous" },
            { title: "Breaks & Small Talk", titleFr: "Pauses et conversations informelles" },
            { title: "End of the Day", titleFr: "Fin de journée" },
          ]},
          { title: "Getting Help", titleFr: "Obtenir de l'Aide", description: "Ask for information and clarification.", descriptionFr: "Demander des informations et des clarifications.", lessons: [
            { title: "I Don't Understand", titleFr: "Je ne comprends pas" },
            { title: "Where Is the...?", titleFr: "Où se trouve le...?" },
            { title: "I Need Help With...", titleFr: "J'ai besoin d'aide avec..." },
            { title: "Thank You & Follow Up", titleFr: "Merci et suivi" },
          ]},
        ],
      },
      {
        pathNumber: 2, title: "ESL Path II: Everyday Fluency", titleFr: "ALS Path II : Aisance Quotidienne",
        slug: "esl-path-ii-everyday-fluency",
        description: "Develop confidence in everyday professional English interactions. Navigate digital tools, phone conversations, and team meetings with increasing fluency.",
        descriptionFr: "Développez votre confiance dans les interactions professionnelles quotidiennes en anglais. Naviguez les outils numériques, les conversations téléphoniques et les réunions d'équipe avec une aisance croissante.",
        shortDescription: "Build everyday English fluency for confident workplace communication.",
        shortDescriptionFr: "Développez une aisance quotidienne en anglais pour une communication confiante au travail.",
        level: "beginner", category: "business_english", targetLanguage: "english",
        price: 89900, originalPrice: 99900, estimatedHours: 30,
        modules: [
          { title: "Digital Workspace", titleFr: "Espace Numérique", description: "Navigate digital tools in English.", descriptionFr: "Naviguer les outils numériques en anglais.", lessons: [
            { title: "Email Etiquette", titleFr: "Étiquette courriel" },
            { title: "Video Conferencing", titleFr: "Vidéoconférence" },
            { title: "Collaborative Platforms", titleFr: "Plateformes collaboratives" },
            { title: "Digital Security", titleFr: "Sécurité numérique" },
          ]},
          { title: "On the Phone", titleFr: "Au Téléphone", description: "Handle phone conversations professionally.", descriptionFr: "Gérer les conversations téléphoniques professionnellement.", lessons: [
            { title: "Answering & Transferring", titleFr: "Répondre et transférer" },
            { title: "Taking Messages", titleFr: "Prendre des messages" },
            { title: "Conference Calls", titleFr: "Appels conférence" },
            { title: "Voicemail", titleFr: "Messagerie vocale" },
          ]},
          { title: "Team Meetings", titleFr: "Réunions d'Équipe", description: "Participate effectively in team meetings.", descriptionFr: "Participer efficacement aux réunions d'équipe.", lessons: [
            { title: "Meeting Basics", titleFr: "Les bases de la réunion" },
            { title: "Sharing Updates", titleFr: "Partager des mises à jour" },
            { title: "Asking Questions", titleFr: "Poser des questions" },
            { title: "Action Items", titleFr: "Points d'action" },
          ]},
          { title: "Your Contributions", titleFr: "Vos Contributions", description: "Showcase your work and contributions.", descriptionFr: "Mettre en valeur votre travail et vos contributions.", lessons: [
            { title: "Describing Your Work", titleFr: "Décrire votre travail" },
            { title: "Progress Updates", titleFr: "Mises à jour de progrès" },
            { title: "Seeking Feedback", titleFr: "Demander de la rétroaction" },
            { title: "Celebrating Achievements", titleFr: "Célébrer les réalisations" },
          ]},
        ],
      },
      {
        pathNumber: 3, title: "ESL Path III: Operational English", titleFr: "ALS Path III : Anglais Opérationnel",
        slug: "esl-path-iii-operational-english",
        description: "Achieve functional professional autonomy in English. Plan projects, provide feedback, and navigate public service culture with confidence.",
        descriptionFr: "Atteignez une autonomie professionnelle fonctionnelle en anglais. Planifiez des projets, fournissez de la rétroaction et naviguez la culture de la fonction publique avec confiance.",
        shortDescription: "Professional English communication for independent workplace autonomy.",
        shortDescriptionFr: "Communication professionnelle en anglais pour une autonomie indépendante au travail.",
        level: "intermediate", category: "business_english", targetLanguage: "english",
        price: 99900, originalPrice: 119900, estimatedHours: 35,
        modules: [
          { title: "Planning & Organizing", titleFr: "Planification et Organisation", description: "Plan and organize in English.", descriptionFr: "Planifier et organiser en anglais.", lessons: [
            { title: "Project Planning", titleFr: "Planification de projet" },
            { title: "Setting Priorities", titleFr: "Établir les priorités" },
            { title: "Delegating Tasks", titleFr: "Déléguer des tâches" },
            { title: "Timeline Management", titleFr: "Gestion des échéanciers" },
          ]},
          { title: "Feedback", titleFr: "Rétroaction", description: "Give and receive feedback effectively.", descriptionFr: "Donner et recevoir de la rétroaction efficacement.", lessons: [
            { title: "Constructive Feedback", titleFr: "Rétroaction constructive" },
            { title: "Receiving Criticism", titleFr: "Recevoir la critique" },
            { title: "Peer Reviews", titleFr: "Évaluations par les pairs" },
            { title: "360 Feedback", titleFr: "Rétroaction 360" },
          ]},
          { title: "Public Service Culture", titleFr: "Culture de la Fonction Publique", description: "Navigate public service culture.", descriptionFr: "Naviguer la culture de la fonction publique.", lessons: [
            { title: "Values & Ethics", titleFr: "Valeurs et éthique" },
            { title: "Diversity & Inclusion", titleFr: "Diversité et inclusion" },
            { title: "Official Languages", titleFr: "Langues officielles" },
            { title: "Workplace Wellness", titleFr: "Bien-être au travail" },
          ]},
          { title: "Career Path", titleFr: "Parcours de Carrière", description: "Navigate career development.", descriptionFr: "Naviguer le développement de carrière.", lessons: [
            { title: "Career Goals", titleFr: "Objectifs de carrière" },
            { title: "Networking Strategies", titleFr: "Stratégies de réseautage" },
            { title: "Interview Skills", titleFr: "Compétences d'entrevue" },
            { title: "Professional Development", titleFr: "Développement professionnel" },
          ]},
        ],
      },
      {
        pathNumber: 4, title: "ESL Path IV: Strategic Expression", titleFr: "ALS Path IV : Expression Stratégique",
        slug: "esl-path-iv-strategic-expression",
        description: "Master advanced English communication for leadership roles. Lead meetings, write for impact, present with confidence, and negotiate effectively.",
        descriptionFr: "Maîtrisez la communication avancée en anglais pour les rôles de leadership. Dirigez des réunions, rédigez avec impact, présentez avec confiance et négociez efficacement.",
        shortDescription: "Advanced strategic English communication for leadership roles.",
        shortDescriptionFr: "Communication stratégique avancée en anglais pour les rôles de leadership.",
        level: "advanced", category: "business_english", targetLanguage: "english",
        price: 109900, originalPrice: 129900, estimatedHours: 35,
        modules: [
          { title: "Leading Meetings", titleFr: "Diriger des Réunions", description: "Lead meetings effectively.", descriptionFr: "Diriger des réunions efficacement.", lessons: [
            { title: "Opening & Agenda", titleFr: "Ouverture et ordre du jour" },
            { title: "Facilitating Discussion", titleFr: "Faciliter la discussion" },
            { title: "Decision Making", titleFr: "Prise de décision" },
            { title: "Closing & Follow-up", titleFr: "Clôture et suivi" },
          ]},
          { title: "Writing for Impact", titleFr: "Rédiger avec Impact", description: "Write compelling professional documents.", descriptionFr: "Rédiger des documents professionnels convaincants.", lessons: [
            { title: "Executive Summaries", titleFr: "Sommaires exécutifs" },
            { title: "Persuasive Writing", titleFr: "Rédaction persuasive" },
            { title: "Policy Briefs", titleFr: "Notes de politique" },
            { title: "Editing for Clarity", titleFr: "Révision pour la clarté" },
          ]},
          { title: "Presenting with Confidence", titleFr: "Présenter avec Confiance", description: "Deliver impactful presentations.", descriptionFr: "Livrer des présentations percutantes.", lessons: [
            { title: "Storytelling Techniques", titleFr: "Techniques de narration" },
            { title: "Data Visualization", titleFr: "Visualisation des données" },
            { title: "Engaging Your Audience", titleFr: "Engager votre auditoire" },
            { title: "Handling Tough Questions", titleFr: "Gérer les questions difficiles" },
          ]},
          { title: "Negotiation & Persuasion", titleFr: "Négociation et Persuasion", description: "Master negotiation and persuasion.", descriptionFr: "Maîtriser la négociation et la persuasion.", lessons: [
            { title: "Negotiation Frameworks", titleFr: "Cadres de négociation" },
            { title: "Win-Win Strategies", titleFr: "Stratégies gagnant-gagnant" },
            { title: "Influence Tactics", titleFr: "Tactiques d'influence" },
            { title: "Cross-Cultural Negotiation", titleFr: "Négociation interculturelle" },
          ]},
        ],
      },
      {
        pathNumber: 5, title: "ESL Path V: Professional Mastery", titleFr: "ALS Path V : Maîtrise Professionnelle",
        slug: "esl-path-v-professional-mastery",
        description: "Achieve expert-level English communication. Manage teams, collaborate across departments, navigate policy discussions, and handle crisis communication.",
        descriptionFr: "Atteignez une communication de niveau expert en anglais. Gérez des équipes, collaborez entre ministères, naviguez les discussions de politique et gérez la communication de crise.",
        shortDescription: "Expert-level English mastery for executive bilingual communication.",
        shortDescriptionFr: "Maîtrise de niveau expert en anglais pour la communication bilingue exécutive.",
        level: "advanced", category: "business_english", targetLanguage: "english",
        price: 119900, originalPrice: 149900, estimatedHours: 40,
        modules: [
          { title: "Managing People & Performance", titleFr: "Gestion des Personnes et du Rendement", description: "Manage teams effectively.", descriptionFr: "Gérer les équipes efficacement.", lessons: [
            { title: "Performance Conversations", titleFr: "Conversations de rendement" },
            { title: "Coaching & Mentoring", titleFr: "Coaching et mentorat" },
            { title: "Team Building", titleFr: "Consolidation d'équipe" },
            { title: "Conflict Management", titleFr: "Gestion des conflits" },
          ]},
          { title: "Interdepartmental Collaboration", titleFr: "Collaboration Interministérielle", description: "Collaborate across departments.", descriptionFr: "Collaborer entre les ministères.", lessons: [
            { title: "Cross-functional Teams", titleFr: "Équipes interfonctionnelles" },
            { title: "Stakeholder Engagement", titleFr: "Engagement des parties prenantes" },
            { title: "Joint Initiatives", titleFr: "Initiatives conjointes" },
            { title: "Shared Services", titleFr: "Services partagés" },
          ]},
          { title: "Policy & Legislation", titleFr: "Politique et Législation", description: "Navigate policy and legislation.", descriptionFr: "Naviguer la politique et la législation.", lessons: [
            { title: "Policy Development", titleFr: "Élaboration de politiques" },
            { title: "Legislative Process", titleFr: "Processus législatif" },
            { title: "Regulatory Compliance", titleFr: "Conformité réglementaire" },
            { title: "Impact Assessment", titleFr: "Évaluation d'impact" },
          ]},
          { title: "Crisis Communication", titleFr: "Communication de Crise", description: "Handle crisis communication.", descriptionFr: "Gérer la communication de crise.", lessons: [
            { title: "Crisis Response Plans", titleFr: "Plans de réponse de crise" },
            { title: "Media Relations", titleFr: "Relations avec les médias" },
            { title: "Public Statements", titleFr: "Déclarations publiques" },
            { title: "Post-Crisis Recovery", titleFr: "Rétablissement post-crise" },
          ]},
        ],
      },
      {
        pathNumber: 6, title: "ESL Path VI: Executive Leadership", titleFr: "ALS Path VI : Leadership Exécutif",
        slug: "esl-path-vi-executive-leadership",
        description: "C-Suite communication excellence. Master strategic leadership, executive presence, thought leadership, and legacy building in English.",
        descriptionFr: "Excellence en communication de la haute direction. Maîtrisez le leadership stratégique, la présence exécutive, le leadership intellectuel et la construction d'un héritage en anglais.",
        shortDescription: "C-Suite English communication for executive leadership.",
        shortDescriptionFr: "Communication en anglais de la haute direction pour le leadership exécutif.",
        level: "advanced", category: "business_english", targetLanguage: "english",
        price: 129900, originalPrice: 159900, estimatedHours: 40,
        modules: [
          { title: "Strategic Leadership", titleFr: "Leadership Stratégique", description: "Lead strategically in English.", descriptionFr: "Diriger stratégiquement en anglais.", lessons: [
            { title: "Executive Decision-Making", titleFr: "Prise de décision exécutive" },
            { title: "Vision Communication", titleFr: "Communication de la vision" },
            { title: "Strategic Communication", titleFr: "Communication stratégique" },
            { title: "Leading Organizational Change", titleFr: "Diriger le changement organisationnel" },
          ]},
          { title: "Executive Presence", titleFr: "Présence Exécutive", description: "Develop executive presence.", descriptionFr: "Développer la présence exécutive.", lessons: [
            { title: "Gravitas & Authority", titleFr: "Gravitas et autorité" },
            { title: "Board Presentations", titleFr: "Présentations au conseil" },
            { title: "Media Appearances", titleFr: "Apparitions médiatiques" },
            { title: "Thought Leadership", titleFr: "Leadership intellectuel" },
          ]},
          { title: "Thought Leadership", titleFr: "Leadership Intellectuel", description: "Establish thought leadership.", descriptionFr: "Établir un leadership intellectuel.", lessons: [
            { title: "Publishing & Speaking", titleFr: "Publication et prise de parole" },
            { title: "Industry Influence", titleFr: "Influence dans l'industrie" },
            { title: "Mentoring & Coaching", titleFr: "Mentorat et coaching" },
            { title: "Building Legacy", titleFr: "Bâtir un héritage" },
          ]},
          { title: "Legacy & Influence", titleFr: "Héritage et Influence", description: "Create lasting impact.", descriptionFr: "Créer un impact durable.", lessons: [
            { title: "Succession Planning", titleFr: "Planification de la relève" },
            { title: "Knowledge Transfer", titleFr: "Transfert de connaissances" },
            { title: "Institutional Memory", titleFr: "Mémoire institutionnelle" },
            { title: "Final Capstone", titleFr: "Projet final intégrateur" },
          ]},
        ],
      },
    ];

    const courseIds: number[] = [];
    let pathIndex = 0;

    for (const path of allPaths) {
      const isFSL = pathIndex < 6;
      const programLabel = isFSL ? "FSL" : "ESL";
      results.push(`\n📖 Creating ${programLabel} ${path.title}...`);

      // Insert course
      const courseResult = await db.execute(sql`
        INSERT INTO courses (title, titleFr, slug, description, descriptionFr, shortDescription, shortDescriptionFr,
          category, level, targetLanguage, price, originalPrice, currency, accessType,
          totalModules, totalLessons, totalDurationMinutes, totalActivities,
          instructorName, status, publishedAt,
          hasCertificate, hasQuizzes, hasDownloads, pathNumber, estimatedHours)
        VALUES (
          ${path.title}, ${path.titleFr}, ${path.slug},
          ${path.description}, ${path.descriptionFr},
          ${path.shortDescription}, ${path.shortDescriptionFr},
          ${path.category}, ${path.level}, ${path.targetLanguage},
          ${path.price}, ${path.originalPrice}, 'CAD', 'one_time',
          4, 16, ${path.estimatedHours * 60}, 112,
          'Prof. Steven Rusinga', 'published', NOW(),
          true, true, true, ${path.pathNumber}, ${path.estimatedHours}
        )
      `);

      const courseId = (courseResult as any)[0].insertId;
      courseIds.push(courseId);
      results.push(`  ✅ Course created (ID: ${courseId})`);

      // Insert modules and lessons
      for (let mi = 0; mi < path.modules.length; mi++) {
        const mod = path.modules[mi];
        const moduleResult = await db.execute(sql`
          INSERT INTO course_modules (courseId, title, titleFr, description, descriptionFr,
            sortOrder, moduleNumber, totalLessons, totalDurationMinutes, status)
          VALUES (
            ${courseId}, ${mod.title}, ${mod.titleFr},
            ${mod.description}, ${mod.descriptionFr},
            ${mi}, ${mi + 1}, 4, ${path.estimatedHours * 15}, 'published'
          )
        `);
        const moduleId = (moduleResult as any)[0].insertId;
        results.push(`  📦 Module ${mi + 1}: ${mod.title} (ID: ${moduleId})`);

        for (let li = 0; li < mod.lessons.length; li++) {
          const lesson = mod.lessons[li];
          await db.execute(sql`
            INSERT INTO lessons (moduleId, courseId, title, titleFr,
              contentType, sortOrder, estimatedMinutes, isMandatory, status)
            VALUES (
              ${moduleId}, ${courseId}, ${lesson.title}, ${lesson.titleFr},
              'text', ${li}, 50, true, 'published'
            )
          `);
        }
        results.push(`    ✅ 4 lessons created`);
      }

      pathIndex++;
    }

    results.push(`\n🎉 Migration complete! Created ${courseIds.length} courses with ${courseIds.length * 4} modules and ${courseIds.length * 16} lessons.`);
    results.push(`Course IDs: ${courseIds.join(", ")}`);

    log.info(results.join("\n"));
    return res.json({
      success: true,
      results,
      courseIds,
      summary: {
        totalCourses: courseIds.length,
        totalModules: courseIds.length * 4,
        totalLessons: courseIds.length * 16,
        fslCourses: 6,
        eslCourses: 6,
      },
    });
  } catch (error: any) {
    log.error("❌ Course replacement migration failed:", error);
    return res.status(500).json({
      success: false,
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
});

export default router;
