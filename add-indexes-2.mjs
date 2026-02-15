/**
 * Add remaining critical FK indexes — using actual DB column names.
 */
import 'dotenv/config';
import mysql from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error('DATABASE_URL not set');
  process.exit(1);
}

const indexes = [
  // === course_enrollments (high traffic) ===
  { table: 'course_enrollments', column: 'userId', name: 'idx_course_enrollments_userId' },
  { table: 'course_enrollments', column: 'courseId', name: 'idx_course_enrollments_courseId' },
  
  // === course_modules ===
  { table: 'course_modules', column: 'courseId', name: 'idx_course_modules_courseId' },
  { table: 'course_modules', column: 'prerequisiteModuleId', name: 'idx_course_modules_prerequisiteModuleId' },
  
  // === ai_sessions ===
  { table: 'ai_sessions', column: 'userId', name: 'idx_ai_sessions_userId' },
  
  // === coaching_plan_purchases ===
  { table: 'coaching_plan_purchases', column: 'userId', name: 'idx_coaching_plan_purchases_userId' },
  
  // === ecosystem_leads ===
  { table: 'ecosystem_leads', column: 'assignedTo', name: 'idx_ecosystem_leads_assignedTo' },
  { table: 'ecosystem_leads', column: 'linkedUserId', name: 'idx_ecosystem_leads_linkedUserId' },
  
  // === org_members ===
  { table: 'org_members', column: 'organizationId', name: 'idx_org_members_organizationId' },
  { table: 'org_members', column: 'userId', name: 'idx_org_members_userId' },
  
  // === organizations ===
  { table: 'organizations', column: 'adminUserId', name: 'idx_organizations_adminUserId' },
  
  // === learner_badges ===
  { table: 'learner_badges', column: 'userId', name: 'idx_learner_badges_userId' },
  { table: 'learner_badges', column: 'courseId', name: 'idx_learner_badges_courseId' },
  { table: 'learner_badges', column: 'moduleId', name: 'idx_learner_badges_moduleId' },
  
  // === user_badges ===
  { table: 'user_badges', column: 'userId', name: 'idx_user_badges_userId' },
  { table: 'user_badges', column: 'badgeId', name: 'idx_user_badges_badgeId' },
  
  // === practice_logs ===
  { table: 'practice_logs', column: 'userId', name: 'idx_practice_logs_userId' },
  
  // === quiz_attempts ===
  { table: 'quiz_attempts', column: 'userId', name: 'idx_quiz_attempts_userId' },
  { table: 'quiz_attempts', column: 'lessonId', name: 'idx_quiz_attempts_lessonId' },
  { table: 'quiz_attempts', column: 'courseId', name: 'idx_quiz_attempts_courseId' },
  { table: 'quiz_attempts', column: 'moduleId', name: 'idx_quiz_attempts_moduleId' },
  
  // === sle_exam_sessions ===
  { table: 'sle_exam_sessions', column: 'userId', name: 'idx_sle_exam_sessions_userId' },
  
  // === transactions ===
  { table: 'transactions', column: 'userId', name: 'idx_transactions_userId' },
  { table: 'transactions', column: 'courseId', name: 'idx_transactions_courseId' },
  { table: 'transactions', column: 'offerId', name: 'idx_transactions_offerId' },
  
  // === affiliate_referrals ===
  { table: 'affiliate_referrals', column: 'affiliateId', name: 'idx_affiliate_referrals_affiliateId' },
  { table: 'affiliate_referrals', column: 'referredUserId', name: 'idx_affiliate_referrals_referredUserId' },
  
  // === Other high-traffic tables ===
  { table: 'analytics_events', column: 'userId', name: 'idx_analytics_events_userId' },
  { table: 'admin_activity_logs', column: 'userId', name: 'idx_admin_activity_logs_userId' },
  { table: 'audit_log', column: 'userId', name: 'idx_audit_log_userId' },
  { table: 'sle_companion_sessions', column: 'userId', name: 'idx_sle_companion_sessions_userId' },
  { table: 'sle_companion_messages', column: 'sessionId', name: 'idx_sle_companion_messages_sessionId' },
  { table: 'sle_user_profiles', column: 'userId', name: 'idx_sle_user_profiles_userId' },
  { table: 'sle_user_sessions', column: 'userId', name: 'idx_sle_user_sessions_userId' },
  { table: 'sle_practice_attempts', column: 'userId', name: 'idx_sle_practice_attempts_userId' },
  { table: 'sle_skill_trend', column: 'userId', name: 'idx_sle_skill_trend_userId' },
  { table: 'user_xp', column: 'userId', name: 'idx_user_xp_userId' },
  { table: 'user_streaks', column: 'userId', name: 'idx_user_streaks_userId' },
  { table: 'user_weekly_challenges', column: 'userId', name: 'idx_user_weekly_challenges_userId' },
  { table: 'affiliate_earnings', column: 'affiliateId', name: 'idx_affiliate_earnings_affiliateId' },
  { table: 'affiliate_payouts', column: 'affiliateId', name: 'idx_affiliate_payouts_affiliateId' },
  { table: 'cohort_members', column: 'cohortId', name: 'idx_cohort_members_cohortId' },
  { table: 'cohort_members', column: 'userId', name: 'idx_cohort_members_userId' },
  { table: 'drip_content', column: 'courseId', name: 'idx_drip_content_courseId' },
  { table: 'drip_content', column: 'moduleId', name: 'idx_drip_content_moduleId' },
  { table: 'onboarding_progress', column: 'userId', name: 'idx_onboarding_progress_userId' },
];

async function run() {
  const conn = await mysql.createConnection(DATABASE_URL);
  
  let created = 0;
  let skipped = 0;
  let failed = 0;
  
  for (const idx of indexes) {
    try {
      // Check if index already exists
      const [rows] = await conn.execute(
        `SELECT COUNT(*) as cnt FROM information_schema.statistics WHERE table_schema = DATABASE() AND table_name = ? AND index_name = ?`,
        [idx.table, idx.name]
      );
      
      if (rows[0].cnt > 0) {
        skipped++;
        continue;
      }
      
      // Check if column exists
      const [cols] = await conn.execute(
        `SELECT COUNT(*) as cnt FROM information_schema.columns WHERE table_schema = DATABASE() AND table_name = ? AND column_name = ?`,
        [idx.table, idx.column]
      );
      
      if (cols[0].cnt === 0) {
        console.log(`  SKIP: ${idx.table}.${idx.column} — column does not exist`);
        skipped++;
        continue;
      }
      
      await conn.execute(`CREATE INDEX \`${idx.name}\` ON \`${idx.table}\` (\`${idx.column}\`)`);
      console.log(`  ✓ Created: ${idx.name} on ${idx.table}(${idx.column})`);
      created++;
    } catch (err) {
      console.log(`  ✗ Failed: ${idx.name} — ${err.message}`);
      failed++;
    }
  }
  
  console.log(`\n=== SUMMARY ===`);
  console.log(`Created: ${created}`);
  console.log(`Skipped: ${skipped}`);
  console.log(`Failed: ${failed}`);
  console.log(`Total attempted: ${indexes.length}`);
  
  await conn.end();
}

run().catch(console.error);
