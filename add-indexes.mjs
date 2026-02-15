/**
 * Add critical FK indexes for performance optimization.
 * These indexes cover the most frequently queried FK columns
 * identified in the audit (257 FK refs, only 2 existing indexes).
 */
import 'dotenv/config';
import mysql from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error('DATABASE_URL not set');
  process.exit(1);
}

const indexes = [
  // === HIGH PRIORITY: userId columns (98 refs) ===
  { table: 'coach_profiles', column: 'userId', name: 'idx_coach_profiles_userId' },
  { table: 'learner_profiles', column: 'userId', name: 'idx_learner_profiles_userId' },
  { table: 'notifications', column: 'userId', name: 'idx_notifications_userId' },
  { table: 'push_subscriptions', column: 'userId', name: 'idx_push_subscriptions_userId' },
  { table: 'coach_applications', column: 'userId', name: 'idx_coach_applications_userId' },
  { table: 'conversations', column: 'participant1Id', name: 'idx_conversations_participant1Id' },
  { table: 'conversations', column: 'participant2Id', name: 'idx_conversations_participant2Id' },
  { table: 'messages', column: 'senderId', name: 'idx_messages_senderId' },
  { table: 'messages', column: 'recipientId', name: 'idx_messages_recipientId' },
  { table: 'messages', column: 'conversationId', name: 'idx_messages_conversationId' },
  
  // === HIGH PRIORITY: courseId columns (42 refs) ===
  { table: 'modules', column: 'courseId', name: 'idx_modules_courseId' },
  { table: 'lessons', column: 'courseId', name: 'idx_lessons_courseId' },
  { table: 'lessons', column: 'moduleId', name: 'idx_lessons_moduleId' },
  { table: 'enrollments', column: 'courseId', name: 'idx_enrollments_courseId' },
  { table: 'enrollments', column: 'userId', name: 'idx_enrollments_userId' },
  { table: 'lesson_progress', column: 'courseId', name: 'idx_lesson_progress_courseId' },
  { table: 'lesson_progress', column: 'lessonId', name: 'idx_lesson_progress_lessonId' },
  { table: 'lesson_progress', column: 'enrollmentId', name: 'idx_lesson_progress_enrollmentId' },
  { table: 'course_reviews', column: 'courseId', name: 'idx_course_reviews_courseId' },
  { table: 'course_reviews', column: 'userId', name: 'idx_course_reviews_userId' },
  
  // === HIGH PRIORITY: coachId columns (32 refs) ===
  { table: 'coach_availability', column: 'coachId', name: 'idx_coach_availability_coachId' },
  { table: 'sessions', column: 'coachId', name: 'idx_sessions_coachId' },
  { table: 'sessions', column: 'learnerId', name: 'idx_sessions_learnerId' },
  { table: 'packages', column: 'coachId', name: 'idx_packages_coachId' },
  { table: 'packages', column: 'learnerId', name: 'idx_packages_learnerId' },
  { table: 'reviews', column: 'coachId', name: 'idx_reviews_coachId' },
  { table: 'reviews', column: 'learnerId', name: 'idx_reviews_learnerId' },
  { table: 'reviews', column: 'sessionId', name: 'idx_reviews_sessionId' },
  { table: 'favorites', column: 'learnerId', name: 'idx_favorites_learnerId' },
  { table: 'favorites', column: 'coachId', name: 'idx_favorites_coachId' },
  { table: 'coach_commissions', column: 'coachId', name: 'idx_coach_commissions_coachId' },
  { table: 'coach_documents', column: 'coachId', name: 'idx_coach_documents_coachId' },
  { table: 'coach_gallery_photos', column: 'coachId', name: 'idx_coach_gallery_photos_coachId' },
  { table: 'session_notes', column: 'sessionId', name: 'idx_session_notes_sessionId' },
  { table: 'session_notes', column: 'coachId', name: 'idx_session_notes_coachId' },
  { table: 'coach_payouts', column: 'coachId', name: 'idx_coach_payouts_coachId' },
  
  // === MEDIUM PRIORITY: learnerId, lessonId, enrollmentId ===
  { table: 'ai_sessions', column: 'learnerId', name: 'idx_ai_sessions_learnerId' },
  { table: 'referral_tracking', column: 'learnerId', name: 'idx_referral_tracking_learnerId' },
  { table: 'referral_tracking', column: 'referralLinkId', name: 'idx_referral_tracking_referralLinkId' },
  { table: 'payout_ledger', column: 'coachId', name: 'idx_payout_ledger_coachId' },
  { table: 'payout_ledger', column: 'learnerId', name: 'idx_payout_ledger_learnerId' },
  { table: 'payout_ledger', column: 'sessionId', name: 'idx_payout_ledger_sessionId' },
  { table: 'referral_links', column: 'coachId', name: 'idx_referral_links_coachId' },
  
  // === Activities & Progress ===
  { table: 'activities', column: 'lessonId', name: 'idx_activities_lessonId' },
  { table: 'activity_progress', column: 'enrollmentId', name: 'idx_activity_progress_enrollmentId' },
  
  // === Learner engagement tables ===
  { table: 'loyalty_points', column: 'userId', name: 'idx_loyalty_points_userId' },
  { table: 'point_transactions', column: 'userId', name: 'idx_point_transactions_userId' },
  { table: 'redeemed_rewards', column: 'userId', name: 'idx_redeemed_rewards_userId' },
  { table: 'coupon_redemptions', column: 'userId', name: 'idx_coupon_redemptions_userId' },
  { table: 'coupon_redemptions', column: 'couponId', name: 'idx_coupon_redemptions_couponId' },
  { table: 'in_app_notifications', column: 'userId', name: 'idx_in_app_notifications_userId' },
  { table: 'learner_favorites', column: 'userId', name: 'idx_learner_favorites_userId' },
  { table: 'learner_favorites', column: 'courseId', name: 'idx_learner_favorites_courseId' },
  
  // === Organization tables ===
  { table: 'organization_members', column: 'organizationId', name: 'idx_org_members_organizationId' },
  { table: 'organization_members', column: 'userId', name: 'idx_org_members_userId' },
  
  // === CRM / Leads ===
  { table: 'department_inquiries', column: 'assignedTo', name: 'idx_dept_inquiries_assignedTo' },
  
  // === Path enrollments ===
  { table: 'path_enrollments', column: 'userId', name: 'idx_path_enrollments_userId' },
  { table: 'path_enrollments', column: 'pathId', name: 'idx_path_enrollments_pathId' },
  
  // === Certificates ===
  { table: 'certificates', column: 'userId', name: 'idx_certificates_userId' },
  { table: 'certificates', column: 'courseId', name: 'idx_certificates_courseId' },
  { table: 'certificates', column: 'enrollmentId', name: 'idx_certificates_enrollmentId' },
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
  console.log(`Skipped (existing): ${skipped}`);
  console.log(`Failed: ${failed}`);
  console.log(`Total attempted: ${indexes.length}`);
  
  await conn.end();
}

run().catch(console.error);
