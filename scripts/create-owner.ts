import { db } from "../server/db";
import { sql } from "drizzle-orm";
import * as crypto from "crypto";

const OWNER_EMAIL = "steven.barholere@rusingacademy.ca";
const OWNER_NAME = "Steven Barholere";

async function createOwnerAccount() {
  console.log("🚀 Creating Owner account...\n");

  try {
    // Step 1: Get the owner role ID
    const [roleRows] = await db.execute(sql`SELECT id FROM roles WHERE name = 'owner'`);
    const ownerRoleId = (roleRows as any)[0]?.id;
    
    if (!ownerRoleId) {
      console.error("❌ Owner role not found. Please run migrate-rbac.ts first.");
      process.exit(1);
    }

    // Step 2: Check if owner already exists
    const [existingUser] = await db.execute(sql`SELECT id FROM users WHERE email = ${OWNER_EMAIL}`);
    let userId: number;

    if ((existingUser as any).length > 0) {
      userId = (existingUser as any)[0].id;
      console.log(`📝 User already exists with ID: ${userId}`);
      
      // Update to owner role
      await db.execute(sql`
        UPDATE users 
        SET role = 'owner', roleId = ${ownerRoleId}, isOwner = TRUE, name = ${OWNER_NAME}
        WHERE id = ${userId}
      `);
      console.log("  ✅ Updated existing user to Owner role");
    } else {
      // Create new user
      const openId = `owner_${crypto.randomBytes(16).toString("hex")}`;
      
      await db.execute(sql`
        INSERT INTO users (openId, email, name, role, roleId, isOwner, loginMethod, emailVerified)
        VALUES (${openId}, ${OWNER_EMAIL}, ${OWNER_NAME}, 'owner', ${ownerRoleId}, TRUE, 'email', TRUE)
      `);
      
      const [newUser] = await db.execute(sql`SELECT id FROM users WHERE email = ${OWNER_EMAIL}`);
      userId = (newUser as any)[0].id;
      console.log(`  ✅ Created new Owner account with ID: ${userId}`);
    }

    // Step 3: Generate password setup token
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    // Delete any existing tokens for this user
    await db.execute(sql`DELETE FROM password_reset_tokens WHERE userId = ${userId}`);

    // Create new setup token
    await db.execute(sql`
      INSERT INTO password_reset_tokens (userId, token, type, expiresAt)
      VALUES (${userId}, ${token}, 'setup', ${expiresAt})
    `);

    // Step 4: Generate the setup URL
    const baseUrl = process.env.VITE_APP_URL || "https://www.rusingacademy.ca";
    const setupUrl = `${baseUrl}/set-password?token=${token}`;

    console.log("\n" + "=".repeat(70));
    console.log("✅ OWNER ACCOUNT CREATED SUCCESSFULLY");
    console.log("=".repeat(70));
    console.log(`\n📧 Email: ${OWNER_EMAIL}`);
    console.log(`👤 Name: ${OWNER_NAME}`);
    console.log(`🔑 Role: Owner (Super-Admin)`);
    console.log(`\n🔗 PASSWORD SETUP LINK (valid for 7 days):`);
    console.log("\n" + "-".repeat(70));
    console.log(setupUrl);
    console.log("-".repeat(70));
    console.log("\n⚠️  IMPORTANT: Share this link securely with the owner.");
    console.log("    The link will expire in 7 days and can only be used once.\n");

    return { userId, setupUrl, token };
  } catch (error) {
    console.error("❌ Failed to create owner account:", error);
    throw error;
  }
}

// Run
createOwnerAccount()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
