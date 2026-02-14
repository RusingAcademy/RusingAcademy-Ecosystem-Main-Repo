import { drizzle } from "drizzle-orm/mysql2";
import { sql } from "drizzle-orm";
import dotenv from "dotenv";
dotenv.config();

async function main() {
  const db = drizzle(process.env.DATABASE_URL!);
  
  // Get all tables
  const [allTables] = await db.execute(sql`SHOW TABLES`);
  const tableNames = (allTables as any[]).map(r => Object.values(r)[0] as string);
  
  // Coach-related tables
  const coachTables = tableNames.filter(t => 
    t.includes('coach') || t.includes('session') || t.includes('payout') || 
    t.includes('applic') || t.includes('booking') || t.includes('commission') ||
    t.includes('referral')
  ).sort();
  
  console.log("=== COACH-RELATED TABLES IN DB ===");
  for (const t of coachTables) {
    try {
      const [rows] = await db.execute(sql.raw(`SELECT COUNT(*) as cnt FROM \`${t}\``));
      const count = (rows as any[])[0]?.cnt ?? 0;
      console.log(`  ${t}: ${count} rows`);
    } catch (e: any) {
      console.log(`  ${t}: ERROR - ${e.message}`);
    }
  }
  
  // Check schema tables that DON'T exist in DB
  const schemaTables = [
    'coach_profiles', 'coach_availability', 'coach_applications', 
    'coach_commissions', 'coach_payouts', 'coach_documents',
    'coach_gallery_photos', 'coach_badges', 'coach_nudges', 
    'coach_invitations', 'coaching_credits', 'coaching_plan_purchases',
    'sessions', 'session_notes', 'ai_sessions', 'user_sessions',
    'sle_companion_sessions', 'payout_ledger', 'affiliate_payouts',
    'application_comments', 'application_reminders',
    'commission_tiers', 'referral_links', 'referral_tracking',
    'organization_coachs'
  ];
  
  console.log("\n=== SCHEMA TABLES MISSING FROM DB ===");
  for (const t of schemaTables) {
    if (!tableNames.includes(t)) {
      console.log(`  MISSING: ${t}`);
    }
  }
  
  // Check for existing applications
  console.log("\n=== COACH APPLICATIONS ===");
  try {
    const [apps] = await db.execute(sql`SELECT id, userId, fullName, email, status, createdAt FROM coach_applications ORDER BY createdAt DESC LIMIT 10`);
    console.log(`  Found ${(apps as any[]).length} applications`);
    for (const app of apps as any[]) {
      console.log(`    #${app.id}: ${app.fullName} (${app.email}) - ${app.status} - ${app.createdAt}`);
    }
  } catch (e: any) {
    console.log(`  ERROR: ${e.message}`);
  }
  
  // Check coach profiles
  console.log("\n=== COACH PROFILES ===");
  try {
    const [profiles] = await db.execute(sql`SELECT cp.id, cp.userId, cp.slug, cp.status, u.name, u.email FROM coach_profiles cp LEFT JOIN users u ON u.id = cp.userId ORDER BY cp.createdAt DESC LIMIT 10`);
    console.log(`  Found ${(profiles as any[]).length} profiles`);
    for (const p of profiles as any[]) {
      console.log(`    #${p.id}: ${p.name} (${p.email}) - slug: ${p.slug} - status: ${p.status}`);
    }
  } catch (e: any) {
    console.log(`  ERROR: ${e.message}`);
  }
  
  // Check users with coach role
  console.log("\n=== USERS WITH COACH ROLE ===");
  try {
    const [coaches] = await db.execute(sql`SELECT id, name, email, role FROM users WHERE role = 'coach' OR role = 'admin' ORDER BY id`);
    console.log(`  Found ${(coaches as any[]).length} coach/admin users`);
    for (const c of coaches as any[]) {
      console.log(`    #${c.id}: ${c.name} (${c.email}) - role: ${c.role}`);
    }
  } catch (e: any) {
    console.log(`  ERROR: ${e.message}`);
  }
  
  process.exit(0);
}

main().catch(e => { console.error(e); process.exit(1); });
