import { Router } from "express";
import { getDb } from "../db";
import { sql } from "drizzle-orm";
import * as bcrypt from "bcryptjs";
import * as crypto from "crypto";

const router = Router();

// Validate password reset/setup token
router.get("/validate-token", async (req, res) => {
  try {
    const { token } = req.query;
    const db = await getDb();

    if (!db) {
      return res.status(503).json({ valid: false, message: "Database not available" });
    }

    if (!token || typeof token !== "string") {
      return res.status(400).json({ valid: false, message: "Token is required" });
    }

    const [rows] = await db.execute(sql`
      SELECT prt.*, u.email, u.name, u.role
      FROM password_reset_tokens prt
      JOIN users u ON prt.userId = u.id
      WHERE prt.token = ${token}
        AND prt.expiresAt > NOW()
        AND prt.usedAt IS NULL
    `);

    const tokenData = (rows as any)[0];

    if (!tokenData) {
      return res.json({ 
        valid: false, 
        message: "This link has expired or has already been used. Please request a new one." 
      });
    }

    return res.json({
      valid: true,
      email: tokenData.email,
      name: tokenData.name,
      type: tokenData.type,
      role: tokenData.role,
    });
  } catch (error) {
    console.error("Token validation error:", error);
    return res.status(500).json({ valid: false, message: "Server error" });
  }
});

// Set password using token
router.post("/set-password", async (req, res) => {
  try {
    const { token, password } = req.body;
    const db = await getDb();

    if (!db) {
      return res.status(503).json({ success: false, message: "Database not available" });
    }

    if (!token || !password) {
      return res.status(400).json({ success: false, message: "Token and password are required" });
    }

    // Validate password strength
    if (password.length < 8) {
      return res.status(400).json({ success: false, message: "Password must be at least 8 characters" });
    }

    // Get and validate token
    const [rows] = await db.execute(sql`
      SELECT prt.*, u.id as visitorId
      FROM password_reset_tokens prt
      JOIN users u ON prt.userId = u.id
      WHERE prt.token = ${token}
        AND prt.expiresAt > NOW()
        AND prt.usedAt IS NULL
    `);

    const tokenData = (rows as any)[0];

    if (!tokenData) {
      return res.status(400).json({ 
        success: false, 
        message: "This link has expired or has already been used." 
      });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Update user password
    await db.execute(sql`
      UPDATE users 
      SET passwordHash = ${passwordHash}, emailVerified = TRUE
      WHERE id = ${tokenData.userId}
    `);

    // Mark token as used
    await db.execute(sql`
      UPDATE password_reset_tokens 
      SET usedAt = NOW() 
      WHERE id = ${tokenData.id}
    `);

    // Log the action (only if audit_log table exists)
    try {
      await db.execute(sql`
        INSERT INTO audit_log (userId, action, targetType, targetId, details)
        VALUES (${tokenData.userId}, 'password.set', 'user', ${tokenData.userId}, ${JSON.stringify({ type: tokenData.type })})
      `);
    } catch (e) {
      // Audit log table may not exist yet
      console.log("Audit log not available, skipping");
    }

    return res.json({ success: true, message: "Password set successfully" });
  } catch (error) {
    console.error("Set password error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

// Request password reset
router.post("/request-reset", async (req, res) => {
  try {
    const { email } = req.body;
    const db = await getDb();

    if (!db) {
      return res.status(503).json({ success: false, message: "Database not available" });
    }

    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }

    // Find user
    const [users] = await db.execute(sql`SELECT id, name FROM users WHERE email = ${email}`);
    const user = (users as any)[0];

    // Always return success to prevent email enumeration
    if (!user) {
      return res.json({ success: true, message: "If an account exists, a reset link will be sent." });
    }

    // Generate token
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Delete existing tokens
    await db.execute(sql`DELETE FROM password_reset_tokens WHERE userId = ${user.id}`);

    // Create new token
    await db.execute(sql`
      INSERT INTO password_reset_tokens (userId, token, type, expiresAt)
      VALUES (${user.id}, ${token}, 'reset', ${expiresAt})
    `);

    // TODO: Send email with reset link
    const resetUrl = `${process.env.VITE_APP_URL || "https://www.rusingacademy.ca"}/set-password?token=${token}`;
    console.log(`Password reset link for ${email}: ${resetUrl}`);

    // In production, send email here
    // await sendEmail({ to: email, subject: "Reset your password", ... });

    return res.json({ success: true, message: "If an account exists, a reset link will be sent." });
  } catch (error) {
    console.error("Request reset error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

// Get current user permissions
router.get("/permissions", async (req, res) => {
  try {
    const userId = (req as any).userId;
    const db = await getDb();

    if (!db) {
      return res.status(503).json({ error: "Database not available" });
    }

    if (!userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    // Get user's role and permissions
    const [userRows] = await db.execute(sql`
      SELECT u.id, u.role, u.roleId, u.isOwner, r.name as roleName, r.level as roleLevel
      FROM users u
      LEFT JOIN roles r ON u.roleId = r.id
      WHERE u.id = ${userId}
    `);

    const user = (userRows as any)[0];

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // If owner, return all permissions
    if (user.isOwner || user.role === "owner") {
      const [allPerms] = await db.execute(sql`
        SELECT module, submodule, action FROM permissions
      `);
      return res.json({
        role: "owner",
        isOwner: true,
        permissions: (allPerms as any).map((p: any) => `${p.module}.${p.submodule}.${p.action}`),
      });
    }

    // Get role-based permissions
    const [rolePerms] = await db.execute(sql`
      SELECT p.module, p.submodule, p.action
      FROM role_permissions rp
      JOIN permissions p ON rp.permissionId = p.id
      WHERE rp.roleId = ${user.roleId}
    `);

    // Get user-specific permission overrides
    const [userPerms] = await db.execute(sql`
      SELECT p.module, p.submodule, p.action, up.granted
      FROM user_permissions up
      JOIN permissions p ON up.permissionId = p.id
      WHERE up.userId = ${userId}
    `);

    // Combine permissions
    const permissions = new Set<string>();
    
    // Add role permissions
    for (const p of rolePerms as any) {
      permissions.add(`${p.module}.${p.submodule}.${p.action}`);
    }

    // Apply user overrides
    for (const p of userPerms as any) {
      const key = `${p.module}.${p.submodule}.${p.action}`;
      if (p.granted) {
        permissions.add(key);
      } else {
        permissions.delete(key);
      }
    }

    return res.json({
      role: user.role,
      roleName: user.roleName,
      isOwner: user.isOwner,
      permissions: Array.from(permissions),
    });
  } catch (error) {
    console.error("Get permissions error:", error);
    return res.status(500).json({ error: "Server error" });
  }
});

// Check if user has specific permission
router.get("/check-permission", async (req, res) => {
  try {
    const userId = (req as any).userId;
    const { permission } = req.query;
    const db = await getDb();

    if (!db) {
      return res.status(503).json({ error: "Database not available" });
    }

    if (!userId) {
      return res.status(401).json({ hasPermission: false });
    }

    if (!permission || typeof permission !== "string") {
      return res.status(400).json({ error: "Permission is required" });
    }

    const [module, submodule, action] = permission.split(".");

    // Check if owner
    const [userRows] = await db.execute(sql`
      SELECT isOwner, role FROM users WHERE id = ${userId}
    `);
    const user = (userRows as any)[0];

    if (user?.isOwner || user?.role === "owner") {
      return res.json({ hasPermission: true });
    }

    // Check role permission
    const [rolePerms] = await db.execute(sql`
      SELECT 1 FROM role_permissions rp
      JOIN permissions p ON rp.permissionId = p.id
      JOIN users u ON u.roleId = rp.roleId
      WHERE u.id = ${userId}
        AND p.module = ${module}
        AND p.submodule = ${submodule}
        AND p.action = ${action}
    `);

    if ((rolePerms as any).length > 0) {
      // Check for user-level revocation
      const [userRevoke] = await db.execute(sql`
        SELECT granted FROM user_permissions up
        JOIN permissions p ON up.permissionId = p.id
        WHERE up.userId = ${userId}
          AND p.module = ${module}
          AND p.submodule = ${submodule}
          AND p.action = ${action}
      `);

      if ((userRevoke as any).length > 0 && !(userRevoke as any)[0].granted) {
        return res.json({ hasPermission: false });
      }

      return res.json({ hasPermission: true });
    }

    // Check for user-level grant
    const [userGrant] = await db.execute(sql`
      SELECT granted FROM user_permissions up
      JOIN permissions p ON up.permissionId = p.id
      WHERE up.userId = ${userId}
        AND p.module = ${module}
        AND p.submodule = ${submodule}
        AND p.action = ${action}
        AND up.granted = TRUE
    `);

    return res.json({ hasPermission: (userGrant as any).length > 0 });
  } catch (error) {
    console.error("Check permission error:", error);
    return res.status(500).json({ error: "Server error" });
  }
});

export default router;
