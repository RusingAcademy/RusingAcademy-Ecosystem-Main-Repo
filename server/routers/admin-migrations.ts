import { Router } from "express";
import { db } from "../db";
import { sql } from "drizzle-orm";
import * as crypto from "crypto";

const router = Router();

// Secure migration endpoint - requires MIGRATION_SECRET
router.post("/run-rbac-migration", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const migrationSecret = process.env.MIGRATION_SECRET || process.env.CRON_SECRET;
    
    if (!migrationSecret || authHeader !== `Bearer ${migrationSecret}`) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    console.log("🚀 Starting RBAC migration...\n");
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
        token VARCHAR(255) NOT NULL UNIQUE,
        type ENUM('reset', 'setup', 'magic_link') DEFAULT 'reset',
        expiresAt TIMESTAMP NOT NULL,
        usedAt TIMESTAMP,
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
    console.error("❌ Migration failed:", error);
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

    const { email, name } = req.body;
    
    if (!email || !name) {
      return res.status(400).json({ error: "Email and name are required" });
    }

    console.log(`🚀 Creating Owner account for ${email}...`);

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

    // Create new setup token
    await db.execute(sql`
      INSERT INTO password_reset_tokens (userId, token, type, expiresAt)
      VALUES (${userId}, ${token}, 'setup', ${expiresAt})
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
    console.error("❌ Failed to create owner account:", error);
    return res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

export default router;
