import { z } from "zod";
import { protectedProcedure, adminProcedure } from "../_core/trpc";
import { router } from "../_core/trpc";
import { getDb } from "../db";
import { sql } from "drizzle-orm";

// ============================================================================
// STRIPE LIVE TESTING ROUTER
// ============================================================================
export const stripeTestingRouter = router({
  // Get webhook events log
  getWebhookEvents: adminProcedure
    .input(z.object({ limit: z.number().default(50) }).optional())
    .query(async ({ input }) => {
      const db = await getDb();
      const limit = input?.limit ?? 50;
      const [rows] = await db.execute(sql`
        SELECT id, eventId, eventType, source, status, errorMessage, processedAt, createdAt
        FROM webhook_events_log
        ORDER BY createdAt DESC
        LIMIT ${limit}
      `);
      return Array.isArray(rows) ? rows : [];
    }),

  // Get webhook stats
  getWebhookStats: adminProcedure.query(async () => {
    const db = await getDb();
    const [totalRows] = await db.execute(sql`SELECT COUNT(*) as total FROM webhook_events_log`);
    const [processedRows] = await db.execute(sql`SELECT COUNT(*) as count FROM webhook_events_log WHERE status = 'processed'`);
    const [failedRows] = await db.execute(sql`SELECT COUNT(*) as count FROM webhook_events_log WHERE status = 'failed'`);
    const [recentRows] = await db.execute(sql`
      SELECT eventType, COUNT(*) as count 
      FROM webhook_events_log 
      WHERE createdAt >= DATE_SUB(NOW(), INTERVAL 24 HOUR)
      GROUP BY eventType
    `);
    const total = Array.isArray(totalRows) && totalRows[0] ? (totalRows[0] as any).total : 0;
    const processed = Array.isArray(processedRows) && processedRows[0] ? (processedRows[0] as any).count : 0;
    const failed = Array.isArray(failedRows) && failedRows[0] ? (failedRows[0] as any).count : 0;
    return {
      total: Number(total),
      processed: Number(processed),
      failed: Number(failed),
      recentByType: Array.isArray(recentRows) ? recentRows : [],
    };
  }),

  // Get test payment instructions
  getTestInstructions: adminProcedure.query(async () => {
    return {
      testCard: "4242 4242 4242 4242",
      expiry: "Any future date (e.g., 12/34)",
      cvc: "Any 3 digits (e.g., 123)",
      zip: "Any 5 digits (e.g., 12345)",
      notes: [
        "Use test card number 4242 4242 4242 4242 for successful payments",
        "Use 4000 0000 0000 0002 for declined payments",
        "Use 4000 0000 0000 3220 for 3D Secure authentication",
        "Minimum charge amount is $0.50 USD",
        "Claim your Stripe sandbox in Settings → Payment for live testing",
      ],
    };
  }),
});

// ============================================================================
// REAL-TIME KPI DASHBOARD ROUTER
// ============================================================================
export const liveKPIRouter = router({
  // Get live revenue metrics
  getRevenueMetrics: adminProcedure.query(async () => {
    const db = await getDb();
    const [todayRows] = await db.execute(sql`
      SELECT COALESCE(SUM(CASE WHEN JSON_EXTRACT(metadata, '$.amount') IS NOT NULL 
        THEN CAST(JSON_EXTRACT(metadata, '$.amount') AS DECIMAL(10,2)) ELSE 0 END), 0) as revenue,
        COUNT(*) as transactions
      FROM analytics_events 
      WHERE eventType IN ('payment_succeeded', 'checkout_completed')
      AND createdAt >= CURDATE()
    `);
    const [weekRows] = await db.execute(sql`
      SELECT COALESCE(SUM(CASE WHEN JSON_EXTRACT(metadata, '$.amount') IS NOT NULL 
        THEN CAST(JSON_EXTRACT(metadata, '$.amount') AS DECIMAL(10,2)) ELSE 0 END), 0) as revenue,
        COUNT(*) as transactions
      FROM analytics_events 
      WHERE eventType IN ('payment_succeeded', 'checkout_completed')
      AND createdAt >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
    `);
    const [monthRows] = await db.execute(sql`
      SELECT COALESCE(SUM(CASE WHEN JSON_EXTRACT(metadata, '$.amount') IS NOT NULL 
        THEN CAST(JSON_EXTRACT(metadata, '$.amount') AS DECIMAL(10,2)) ELSE 0 END), 0) as revenue,
        COUNT(*) as transactions
      FROM analytics_events 
      WHERE eventType IN ('payment_succeeded', 'checkout_completed')
      AND createdAt >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
    `);
    const [sparklineRows] = await db.execute(sql`
      SELECT DATE(createdAt) as date,
        COALESCE(SUM(CASE WHEN JSON_EXTRACT(metadata, '$.amount') IS NOT NULL 
          THEN CAST(JSON_EXTRACT(metadata, '$.amount') AS DECIMAL(10,2)) ELSE 0 END), 0) as revenue
      FROM analytics_events 
      WHERE eventType IN ('payment_succeeded', 'checkout_completed')
      AND createdAt >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
      GROUP BY DATE(createdAt)
      ORDER BY date ASC
    `);
    return {
      today: { revenue: Number((todayRows as any)?.[0]?.revenue ?? 0), transactions: Number((todayRows as any)?.[0]?.transactions ?? 0) },
      week: { revenue: Number((weekRows as any)?.[0]?.revenue ?? 0), transactions: Number((weekRows as any)?.[0]?.transactions ?? 0) },
      month: { revenue: Number((monthRows as any)?.[0]?.revenue ?? 0), transactions: Number((monthRows as any)?.[0]?.transactions ?? 0) },
      sparkline: Array.isArray(sparklineRows) ? sparklineRows : [],
    };
  }),

  // Get live conversion funnel
  getConversionFunnel: adminProcedure.query(async () => {
    const db = await getDb();
    const [visitors] = await db.execute(sql`SELECT COUNT(DISTINCT userId) as count FROM analytics_events WHERE eventType = 'page_view' AND createdAt >= DATE_SUB(NOW(), INTERVAL 30 DAY)`);
    const [signups] = await db.execute(sql`SELECT COUNT(*) as count FROM users WHERE createdAt >= DATE_SUB(NOW(), INTERVAL 30 DAY)`);
    const [enrollments] = await db.execute(sql`SELECT COUNT(*) as count FROM course_enrollments WHERE enrolledAt >= DATE_SUB(NOW(), INTERVAL 30 DAY)`);
    const [payments] = await db.execute(sql`SELECT COUNT(*) as count FROM analytics_events WHERE eventType IN ('payment_succeeded', 'checkout_completed') AND createdAt >= DATE_SUB(NOW(), INTERVAL 30 DAY)`);
    return {
      visitors: Number((visitors as any)?.[0]?.count ?? 0),
      signups: Number((signups as any)?.[0]?.count ?? 0),
      enrollments: Number((enrollments as any)?.[0]?.count ?? 0),
      payments: Number((payments as any)?.[0]?.count ?? 0),
    };
  }),

  // Get AI engagement metrics
  getAIEngagement: adminProcedure.query(async () => {
    const db = await getDb();
    const [todayRows] = await db.execute(sql`
      SELECT COUNT(*) as sessions, COUNT(DISTINCT userId) as activeUsers,
        AVG(durationSeconds) as avgDuration
      FROM practice_logs WHERE createdAt >= CURDATE()
    `);
    const [weekRows] = await db.execute(sql`
      SELECT COUNT(*) as sessions, COUNT(DISTINCT userId) as activeUsers
      FROM practice_logs WHERE createdAt >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
    `);
    const [trendRows] = await db.execute(sql`
      SELECT DATE(createdAt) as date, COUNT(*) as sessions
      FROM practice_logs
      WHERE createdAt >= DATE_SUB(CURDATE(), INTERVAL 14 DAY)
      GROUP BY DATE(createdAt) ORDER BY date ASC
    `);
    return {
      today: {
        sessions: Number((todayRows as any)?.[0]?.sessions ?? 0),
        activeUsers: Number((todayRows as any)?.[0]?.activeUsers ?? 0),
        avgDuration: Math.round(Number((todayRows as any)?.[0]?.avgDuration ?? 0) / 60),
      },
      week: {
        sessions: Number((weekRows as any)?.[0]?.sessions ?? 0),
        activeUsers: Number((weekRows as any)?.[0]?.activeUsers ?? 0),
      },
      trend: Array.isArray(trendRows) ? trendRows : [],
    };
  }),

  // Get platform health
  getPlatformHealth: adminProcedure.query(async () => {
    const db = await getDb();
    const [userCount] = await db.execute(sql`SELECT COUNT(*) as count FROM users`);
    const [courseCount] = await db.execute(sql`SELECT COUNT(*) as count FROM courses WHERE status = 'published'`);
    const [activeEnrollments] = await db.execute(sql`SELECT COUNT(*) as count FROM course_enrollments WHERE status = 'active'`);
    const [recentErrors] = await db.execute(sql`SELECT COUNT(*) as count FROM webhook_events_log WHERE status = 'failed' AND createdAt >= DATE_SUB(NOW(), INTERVAL 24 HOUR)`);
    return {
      totalUsers: Number((userCount as any)?.[0]?.count ?? 0),
      activeCourses: Number((courseCount as any)?.[0]?.count ?? 0),
      activeEnrollments: Number((activeEnrollments as any)?.[0]?.count ?? 0),
      recentErrors: Number((recentErrors as any)?.[0]?.count ?? 0),
      status: Number((recentErrors as any)?.[0]?.count ?? 0) > 5 ? "degraded" : "healthy",
    };
  }),
});

// ============================================================================
// ONBOARDING WORKFLOW ROUTER
// ============================================================================
export const onboardingRouter = router({
  // Get onboarding config
  getConfig: adminProcedure.query(async () => {
    const db = await getDb();
    const [rows] = await db.execute(sql`
      SELECT * FROM onboarding_config ORDER BY sortOrder ASC
    `);
    return Array.isArray(rows) ? rows : [];
  }),

  // Update onboarding step
  updateStep: adminProcedure
    .input(z.object({
      id: z.number(),
      isEnabled: z.boolean().optional(),
      stepTitle: z.string().optional(),
      stepDescription: z.string().optional(),
      sortOrder: z.number().optional(),
      actionConfig: z.any().optional(),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      const updates: string[] = [];
      if (input.isEnabled !== undefined) updates.push(`isEnabled = ${input.isEnabled ? 1 : 0}`);
      if (input.stepTitle) updates.push(`stepTitle = '${input.stepTitle}'`);
      if (input.stepDescription) updates.push(`stepDescription = '${input.stepDescription}'`);
      if (input.sortOrder !== undefined) updates.push(`sortOrder = ${input.sortOrder}`);
      if (input.actionConfig) updates.push(`actionConfig = '${JSON.stringify(input.actionConfig)}'`);
      if (updates.length > 0) {
        await db.execute(sql.raw(`UPDATE onboarding_config SET ${updates.join(", ")} WHERE id = ${input.id}`));
      }
      return true;
    }),

  // Create onboarding step
  createStep: adminProcedure
    .input(z.object({
      stepKey: z.string(),
      stepTitle: z.string(),
      stepDescription: z.string().optional(),
      actionType: z.enum(["email", "notification", "course_assign", "checklist", "redirect"]),
      actionConfig: z.any().optional(),
      sortOrder: z.number().default(0),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      await db.execute(sql`
        INSERT INTO onboarding_config (stepKey, stepTitle, stepDescription, actionType, actionConfig, sortOrder)
        VALUES (${input.stepKey}, ${input.stepTitle}, ${input.stepDescription ?? ""}, ${input.actionType}, ${JSON.stringify(input.actionConfig ?? {})}, ${input.sortOrder})
      `);
      return true;
    }),

  // Delete onboarding step
  deleteStep: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      await db.execute(sql`DELETE FROM onboarding_config WHERE id = ${input.id}`);
      return true;
    }),

  // Get new user checklist progress (for learner view)
  getChecklist: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    const [steps] = await db.execute(sql`
      SELECT stepKey, stepTitle, stepDescription, actionType, sortOrder
      FROM onboarding_config WHERE isEnabled = 1 ORDER BY sortOrder ASC
    `);
    return Array.isArray(steps) ? steps : [];
  }),
});

// ============================================================================
// ENTERPRISE MODE ROUTER
// ============================================================================
export const enterpriseRouter = router({
  // List organizations
  listOrgs: adminProcedure.query(async () => {
    const db = await getDb();
    const [rows] = await db.execute(sql`
      SELECT o.*, 
        (SELECT COUNT(*) FROM org_members om WHERE om.organizationId = o.id) as memberCount,
        (SELECT COUNT(*) FROM org_course_assignments oca WHERE oca.organizationId = o.id) as assignedCourses,
        u.name as adminName, u.email as adminEmail
      FROM organizations o
      LEFT JOIN users u ON u.id = o.adminUserId
      ORDER BY o.createdAt DESC
    `);
    return Array.isArray(rows) ? rows : [];
  }),

  // Get org details with members
  getOrgDetails: adminProcedure
    .input(z.object({ orgId: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      const [orgRows] = await db.execute(sql`SELECT * FROM organizations WHERE id = ${input.orgId}`);
      const [memberRows] = await db.execute(sql`
        SELECT om.*, u.name, u.email, u.avatarUrl
        FROM org_members om
        JOIN users u ON u.id = om.userId
        WHERE om.organizationId = ${input.orgId}
        ORDER BY om.createdAt DESC
      `);
      const [courseRows] = await db.execute(sql`
        SELECT oca.*, c.title as courseTitle, c.slug as courseSlug
        FROM org_course_assignments oca
        JOIN courses c ON c.id = oca.courseId
        WHERE oca.organizationId = ${input.orgId}
      `);
      const [progressRows] = await db.execute(sql`
        SELECT om.userId, u.name,
          COUNT(DISTINCT ce.courseId) as enrolledCourses,
          AVG(ce.progress) as avgProgress,
          SUM(CASE WHEN ce.status = 'completed' THEN 1 ELSE 0 END) as completedCourses
        FROM org_members om
        JOIN users u ON u.id = om.userId
        LEFT JOIN course_enrollments ce ON ce.userId = om.userId
        WHERE om.organizationId = ${input.orgId}
        GROUP BY om.userId, u.name
      `);
      return {
        org: Array.isArray(orgRows) && orgRows[0] ? orgRows[0] : null,
        members: Array.isArray(memberRows) ? memberRows : [],
        courses: Array.isArray(courseRows) ? courseRows : [],
        progress: Array.isArray(progressRows) ? progressRows : [],
      };
    }),

  // Invite member to org
  inviteMember: adminProcedure
    .input(z.object({
      orgId: z.number(),
      email: z.string().email(),
      role: z.enum(["admin", "manager", "member"]).default("member"),
    }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      const [userRows] = await db.execute(sql`SELECT id FROM users WHERE email = ${input.email} LIMIT 1`);
      if (!Array.isArray(userRows) || !userRows[0]) {
        return { success: false, error: "User not found. They must register first." };
      }
      const userId = (userRows[0] as any).id;
      await db.execute(sql`
        INSERT INTO org_members (organizationId, userId, role, invitedBy, status)
        VALUES (${input.orgId}, ${userId}, ${input.role}, ${ctx.user.id}, 'invited')
        ON DUPLICATE KEY UPDATE role = ${input.role}, status = 'invited'
      `);
      return { success: true };
    }),

  // Bulk assign course to org
  assignCourse: adminProcedure
    .input(z.object({
      orgId: z.number(),
      courseId: z.number(),
      isRequired: z.boolean().default(false),
      deadline: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      await db.execute(sql`
        INSERT INTO org_course_assignments (organizationId, courseId, assignedBy, isRequired)
        VALUES (${input.orgId}, ${input.courseId}, ${ctx.user.id}, ${input.isRequired ? 1 : 0})
      `);
      // Auto-enroll all active members
      const [members] = await db.execute(sql`
        SELECT userId FROM org_members WHERE organizationId = ${input.orgId} AND status = 'active'
      `);
      if (Array.isArray(members)) {
        for (const m of members) {
          await db.execute(sql`
            INSERT IGNORE INTO course_enrollments (userId, courseId, status, progress)
            VALUES (${(m as any).userId}, ${input.courseId}, 'active', 0)
          `);
        }
      }
      return { success: true, enrolledCount: Array.isArray(members) ? members.length : 0 };
    }),

  // Get org analytics
  getOrgAnalytics: adminProcedure
    .input(z.object({ orgId: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      const [completionRows] = await db.execute(sql`
        SELECT 
          COUNT(DISTINCT ce.userId) as totalLearners,
          AVG(ce.progress) as avgProgress,
          SUM(CASE WHEN ce.status = 'completed' THEN 1 ELSE 0 END) as completions,
          SUM(CASE WHEN ce.progress > 0 AND ce.status != 'completed' THEN 1 ELSE 0 END) as inProgress
        FROM org_members om
        JOIN course_enrollments ce ON ce.userId = om.userId
        WHERE om.organizationId = ${input.orgId}
      `);
      const [practiceRows] = await db.execute(sql`
        SELECT COUNT(*) as totalSessions, AVG(pl.durationSeconds) as avgDuration
        FROM org_members om
        JOIN practice_logs pl ON pl.userId = om.userId
        WHERE om.organizationId = ${input.orgId}
        AND pl.createdAt >= DATE_SUB(NOW(), INTERVAL 30 DAY)
      `);
      return {
        completion: Array.isArray(completionRows) && completionRows[0] ? completionRows[0] : {},
        practice: Array.isArray(practiceRows) && practiceRows[0] ? practiceRows[0] : {},
      };
    }),
});

// ============================================================================
// SLE EXAM MODE ROUTER
// ============================================================================
export const sleExamRouter = router({
  // Start exam session
  startExam: protectedProcedure
    .input(z.object({
      examType: z.enum(["reading", "writing", "oral"]),
      level: z.enum(["A", "B", "C"]),
    }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      const timeLimits: Record<string, number> = { reading: 5400, writing: 5400, oral: 1800 };
      const timeLimit = timeLimits[input.examType] ?? 3600;
      const [result] = await db.execute(sql`
        INSERT INTO sle_exam_sessions (userId, examType, level, timeLimit, status)
        VALUES (${ctx.user.id}, ${input.examType}, ${input.level}, ${timeLimit}, 'in_progress')
      `);
      const insertId = (result as any).insertId;
      return { sessionId: insertId, timeLimit, examType: input.examType, level: input.level };
    }),

  // Submit exam answers
  submitExam: protectedProcedure
    .input(z.object({
      sessionId: z.number(),
      answers: z.any(),
      timeUsed: z.number(),
    }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      // Calculate score based on answers (simplified scoring)
      const answers = input.answers as any[];
      const totalQuestions = Array.isArray(answers) ? answers.length : 0;
      const correctAnswers = Array.isArray(answers) ? answers.filter((a: any) => a.correct).length : 0;
      const score = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;
      const maxScore = 100;
      
      // Generate feedback
      const feedback = {
        score,
        maxScore,
        percentage: Math.round(score),
        level: score >= 80 ? "C" : score >= 60 ? "B" : "A",
        strengths: score >= 70 ? ["Good comprehension", "Consistent accuracy"] : ["Basic understanding"],
        improvements: score < 80 ? ["Practice complex structures", "Expand vocabulary range"] : ["Maintain current level"],
        recommendation: score >= 80 ? "Ready for SLE C level" : score >= 60 ? "Focus on B level preparation" : "Continue A level practice",
      };

      await db.execute(sql`
        UPDATE sle_exam_sessions 
        SET answers = ${JSON.stringify(input.answers)}, 
            timeUsed = ${input.timeUsed},
            score = ${score}, maxScore = ${maxScore},
            feedback = ${JSON.stringify(feedback)},
            status = 'completed', completedAt = NOW()
        WHERE id = ${input.sessionId} AND userId = ${ctx.user.id}
      `);
      return feedback;
    }),

  // Get exam history
  getHistory: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    const [rows] = await db.execute(sql`
      SELECT id, examType, level, score, maxScore, timeLimit, timeUsed, status, feedback, startedAt, completedAt
      FROM sle_exam_sessions
      WHERE userId = ${ctx.user.id}
      ORDER BY createdAt DESC
      LIMIT 50
    `);
    return Array.isArray(rows) ? rows : [];
  }),

  // Get exam stats (admin)
  getExamStats: adminProcedure.query(async () => {
    const db = await getDb();
    const [byType] = await db.execute(sql`
      SELECT examType, level, COUNT(*) as attempts, AVG(score) as avgScore,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed
      FROM sle_exam_sessions
      GROUP BY examType, level
    `);
    const [topScorers] = await db.execute(sql`
      SELECT u.name, u.email, ses.examType, ses.level, ses.score, ses.completedAt
      FROM sle_exam_sessions ses
      JOIN users u ON u.id = ses.userId
      WHERE ses.status = 'completed'
      ORDER BY ses.score DESC
      LIMIT 10
    `);
    const [progressTrend] = await db.execute(sql`
      SELECT DATE(startedAt) as date, COUNT(*) as attempts, AVG(score) as avgScore
      FROM sle_exam_sessions
      WHERE startedAt >= DATE_SUB(NOW(), INTERVAL 30 DAY)
      GROUP BY DATE(startedAt)
      ORDER BY date ASC
    `);
    return {
      byType: Array.isArray(byType) ? byType : [],
      topScorers: Array.isArray(topScorers) ? topScorers : [],
      progressTrend: Array.isArray(progressTrend) ? progressTrend : [],
    };
  }),
});

// ============================================================================
// CONTENT INTELLIGENCE ROUTER
// ============================================================================
export const contentIntelligenceRouter = router({
  // Get content performance overview
  getOverview: adminProcedure.query(async () => {
    const db = await getDb();
    const [coursePerf] = await db.execute(sql`
      SELECT c.id, c.title, c.slug,
        COUNT(DISTINCT ce.userId) as enrollments,
        AVG(ce.progress) as avgProgress,
        SUM(CASE WHEN ce.status = 'completed' THEN 1 ELSE 0 END) as completions,
        SUM(CASE WHEN ce.progress = 0 THEN 1 ELSE 0 END) as neverStarted
      FROM courses c
      LEFT JOIN course_enrollments ce ON ce.courseId = c.id
      WHERE c.status = 'published'
      GROUP BY c.id, c.title, c.slug
      ORDER BY enrollments DESC
    `);
    return Array.isArray(coursePerf) ? coursePerf : [];
  }),

  // Get lesson-level analytics
  getLessonAnalytics: adminProcedure
    .input(z.object({ courseId: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      const [lessons] = await db.execute(sql`
        SELECT l.id, l.title, l.contentType, l.sortOrder, l.estimatedMinutes,
          cm.title as moduleName,
          (SELECT COUNT(*) FROM lesson_progress lp WHERE lp.lessonId = l.id) as totalViews,
          (SELECT COUNT(*) FROM lesson_progress lp WHERE lp.lessonId = l.id AND lp.status = 'completed') as completions,
          (SELECT AVG(lp.timeSpentSeconds) FROM lesson_progress lp WHERE lp.lessonId = l.id) as avgTimeSpent
        FROM lessons l
        JOIN course_modules cm ON cm.id = l.moduleId
        WHERE l.courseId = ${input.courseId}
        ORDER BY cm.sortOrder ASC, l.sortOrder ASC
      `);
      return Array.isArray(lessons) ? lessons : [];
    }),

  // Get drop-off analysis
  getDropOffAnalysis: adminProcedure
    .input(z.object({ courseId: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      const [dropOff] = await db.execute(sql`
        SELECT l.id, l.title, l.sortOrder,
          cm.title as moduleName,
          COUNT(DISTINCT lp.userId) as started,
          SUM(CASE WHEN lp.status = 'completed' THEN 1 ELSE 0 END) as completed
        FROM lessons l
        JOIN course_modules cm ON cm.id = l.moduleId
        LEFT JOIN lesson_progress lp ON lp.lessonId = l.id
        WHERE l.courseId = ${input.courseId}
        GROUP BY l.id, l.title, l.sortOrder, cm.title
        ORDER BY cm.sortOrder ASC, l.sortOrder ASC
      `);
      return Array.isArray(dropOff) ? dropOff : [];
    }),

  // Get content recommendations
  getRecommendations: adminProcedure.query(async () => {
    const db = await getDb();
    // Low completion courses
    const [lowCompletion] = await db.execute(sql`
      SELECT c.id, c.title,
        COUNT(DISTINCT ce.userId) as enrollments,
        AVG(ce.progress) as avgProgress,
        'Low completion rate - consider restructuring content' as recommendation
      FROM courses c
      JOIN course_enrollments ce ON ce.courseId = c.id
      WHERE c.status = 'published'
      GROUP BY c.id, c.title
      HAVING avgProgress < 30 AND enrollments >= 3
      ORDER BY avgProgress ASC
      LIMIT 5
    `);
    // High drop-off lessons
    const [highDropOff] = await db.execute(sql`
      SELECT l.id, l.title, c.title as courseName,
        COUNT(DISTINCT lp.userId) as started,
        SUM(CASE WHEN lp.status = 'completed' THEN 1 ELSE 0 END) as completed,
        'High drop-off point - simplify or break into smaller sections' as recommendation
      FROM lessons l
      JOIN courses c ON c.id = l.courseId
      LEFT JOIN lesson_progress lp ON lp.lessonId = l.id
      GROUP BY l.id, l.title, c.title
      HAVING started >= 3 AND (completed / started) < 0.3
      ORDER BY (completed / started) ASC
      LIMIT 5
    `);
    return {
      lowCompletion: Array.isArray(lowCompletion) ? lowCompletion : [],
      highDropOff: Array.isArray(highDropOff) ? highDropOff : [],
    };
  }),
});
