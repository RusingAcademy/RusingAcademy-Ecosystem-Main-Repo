import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import { getDb } from "../db";
import { sql, eq, desc, asc, and, gte, lte, count } from "drizzle-orm";
import {
  users,
  courseEnrollments,
  coachingPlanPurchases,
  courses,
  practiceLogs,
} from "../../drizzle/schema";

// ============================================================================
// Admin-only middleware
// ============================================================================
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
  }
  return next({ ctx });
});

// ============================================================================
// SETTINGS ROUTER — Full platform configuration CRUD
// ============================================================================
export const settingsRouter = router({
  getAll: adminProcedure.query(async () => {
    const db = await getDb();
    if (!db) return {};
    const rows = await db.execute(
      sql`SELECT \`key\`, \`value\` FROM platform_settings`
    );
    const result: Record<string, string> = {};
    const data = (rows as any)[0] || rows;
    if (Array.isArray(data)) {
      for (const row of data) {
        result[row.key] = row.value;
      }
    }
    return result;
  }),

  get: adminProcedure
    .input(z.object({ key: z.string() }))
    .query(async ({ input }) => {
    const db = await getDb();
    if (!db) return null;
    const [rows] = await db.execute(
      sql`SELECT \`value\` FROM platform_settings WHERE \`key\` = ${input.key} LIMIT 1`
    );
      const data = Array.isArray(rows) ? rows : [rows];
      return data.length > 0 ? (data[0] as any)?.value ?? null : null;
    }),

  set: adminProcedure
    .input(z.object({ key: z.string(), value: z.any(), description: z.string().optional() }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "DB unavailable" });
      const val = typeof input.value === "string" ? input.value : JSON.stringify(input.value);
      await db.execute(
        sql`INSERT INTO platform_settings (\`key\`, \`value\`, description, updatedBy) 
            VALUES (${input.key}, ${val}, ${input.description ?? null}, ${ctx.user.id})
            ON DUPLICATE KEY UPDATE \`value\` = ${val}, updatedBy = ${ctx.user.id}`
      );
      // Log activity
      await db.execute(
        sql`INSERT INTO admin_activity_log (userId, action, entityType, entityTitle) 
            VALUES (${ctx.user.id}, 'update_setting', 'setting', ${input.key})`
      );
      return { success: true };
    }),

  setBulk: adminProcedure
    .input(z.object({ settings: z.record(z.string(), z.any()) }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "DB unavailable" });
      for (const [key, value] of Object.entries(input.settings)) {
        const val = typeof value === "string" ? value : JSON.stringify(value);
        await db.execute(
          sql`INSERT INTO platform_settings (\`key\`, \`value\`, updatedBy) 
              VALUES (${key}, ${val}, ${ctx.user.id})
              ON DUPLICATE KEY UPDATE \`value\` = ${val}, updatedBy = ${ctx.user.id}`
        );
      }
      return { success: true };
    }),

  delete: adminProcedure
    .input(z.object({ key: z.string() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) return { success: false };
      await db.execute(sql`DELETE FROM platform_settings WHERE \`key\` = ${input.key}`);
      return { success: true };
    }),
});

// ============================================================================
// CMS ROUTER — Pages & Sections CRUD + Navigation
// ============================================================================
export const cmsRouter = router({
  // --- Pages ---
  listPages: adminProcedure.query(async () => {
    const db = await getDb();
    if (!db) return [];
    const [rows] = await db.execute(sql`SELECT * FROM cms_pages ORDER BY updatedAt DESC`);
    return Array.isArray(rows) ? rows : [];
  }),

  getPage: adminProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return null;
      const [rows] = await db.execute(sql`SELECT * FROM cms_pages WHERE id = ${input.id}`);
      const pages = Array.isArray(rows) ? rows : [];
      if (pages.length === 0) return null;
      const [sectionRows] = await db.execute(
        sql`SELECT * FROM cms_page_sections WHERE pageId = ${input.id} ORDER BY sortOrder ASC`
      );
      return { ...(pages[0] as any), sections: Array.isArray(sectionRows) ? sectionRows : [] };
    }),

  createPage: adminProcedure
    .input(z.object({
      title: z.string().min(1),
      slug: z.string().min(1),
      description: z.string().optional(),
      pageType: z.enum(["landing", "sales", "about", "custom"]).default("landing"),
    }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      await db.execute(
        sql`INSERT INTO cms_pages (title, slug, description, pageType, createdBy) 
            VALUES (${input.title}, ${input.slug}, ${input.description ?? null}, ${input.pageType}, ${ctx.user.id})`
      );
      const [result] = await db.execute(sql`SELECT LAST_INSERT_ID() as id`);
      const id = Array.isArray(result) ? (result[0] as any)?.id : null;
      await db.execute(
        sql`INSERT INTO admin_activity_log (userId, action, entityType, entityId, entityTitle) 
            VALUES (${ctx.user.id}, 'create_page', 'cms_page', ${id}, ${input.title})`
      );
      return { id, success: true };
    }),

  updatePage: adminProcedure
    .input(z.object({
      id: z.number(),
      title: z.string().optional(),
      slug: z.string().optional(),
      description: z.string().optional(),
      status: z.enum(["draft", "published", "archived"]).optional(),
      metaTitle: z.string().optional(),
      metaDescription: z.string().optional(),
      showHeader: z.boolean().optional(),
      showFooter: z.boolean().optional(),
      customCss: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      const sets: string[] = [];
      const vals: any[] = [];
      if (input.title !== undefined) { sets.push("title = ?"); vals.push(input.title); }
      if (input.slug !== undefined) { sets.push("slug = ?"); vals.push(input.slug); }
      if (input.description !== undefined) { sets.push("description = ?"); vals.push(input.description); }
      if (input.status !== undefined) {
        sets.push("status = ?"); vals.push(input.status);
        if (input.status === "published") sets.push("publishedAt = NOW()");
      }
      if (input.metaTitle !== undefined) { sets.push("metaTitle = ?"); vals.push(input.metaTitle); }
      if (input.metaDescription !== undefined) { sets.push("metaDescription = ?"); vals.push(input.metaDescription); }
      if (input.showHeader !== undefined) { sets.push("showHeader = ?"); vals.push(input.showHeader); }
      if (input.showFooter !== undefined) { sets.push("showFooter = ?"); vals.push(input.showFooter); }
      if (input.customCss !== undefined) { sets.push("customCss = ?"); vals.push(input.customCss); }
      if (sets.length === 0) return { success: true };
      // Use raw SQL for dynamic updates
      const setClause = sets.join(", ");
      await db.execute(sql.raw(`UPDATE cms_pages SET ${setClause} WHERE id = ${input.id}`));
      return { success: true };
    }),

  deletePage: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      await db.execute(sql`DELETE FROM cms_page_sections WHERE pageId = ${input.id}`);
      await db.execute(sql`DELETE FROM cms_pages WHERE id = ${input.id}`);
      await db.execute(
        sql`INSERT INTO admin_activity_log (userId, action, entityType, entityId) 
            VALUES (${ctx.user.id}, 'delete_page', 'cms_page', ${input.id})`
      );
      return { success: true };
    }),

  // --- Sections ---
  addSection: adminProcedure
    .input(z.object({
      pageId: z.number(),
      sectionType: z.string(),
      title: z.string().optional(),
      subtitle: z.string().optional(),
      content: z.any().optional(),
      backgroundColor: z.string().optional(),
      textColor: z.string().optional(),
      sortOrder: z.number().default(0),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      const contentStr = input.content ? JSON.stringify(input.content) : null;
      await db.execute(
        sql`INSERT INTO cms_page_sections (pageId, sectionType, title, subtitle, content, backgroundColor, textColor, sortOrder) 
            VALUES (${input.pageId}, ${input.sectionType}, ${input.title ?? null}, ${input.subtitle ?? null}, ${contentStr}, ${input.backgroundColor ?? null}, ${input.textColor ?? null}, ${input.sortOrder})`
      );
      return { success: true };
    }),

  updateSection: adminProcedure
    .input(z.object({
      id: z.number(),
      title: z.string().optional(),
      subtitle: z.string().optional(),
      content: z.any().optional(),
      backgroundColor: z.string().optional(),
      textColor: z.string().optional(),
      sortOrder: z.number().optional(),
      isVisible: z.boolean().optional(),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      // Simple update for the most common fields
      if (input.title !== undefined) {
        await db.execute(sql`UPDATE cms_page_sections SET title = ${input.title} WHERE id = ${input.id}`);
      }
      if (input.content !== undefined) {
        const c = JSON.stringify(input.content);
        await db.execute(sql`UPDATE cms_page_sections SET content = ${c} WHERE id = ${input.id}`);
      }
      if (input.sortOrder !== undefined) {
        await db.execute(sql`UPDATE cms_page_sections SET sortOrder = ${input.sortOrder} WHERE id = ${input.id}`);
      }
      if (input.isVisible !== undefined) {
        await db.execute(sql`UPDATE cms_page_sections SET isVisible = ${input.isVisible} WHERE id = ${input.id}`);
      }
      return { success: true };
    }),

  deleteSection: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      await db.execute(sql`DELETE FROM cms_page_sections WHERE id = ${input.id}`);
      return { success: true };
    }),

  reorderSections: adminProcedure
    .input(z.object({ pageId: z.number(), sectionIds: z.array(z.number()) }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      for (let i = 0; i < input.sectionIds.length; i++) {
        await db.execute(
          sql`UPDATE cms_page_sections SET sortOrder = ${i} WHERE id = ${input.sectionIds[i]} AND pageId = ${input.pageId}`
        );
      }
      return { success: true };
    }),

  // --- Navigation ---
  listMenus: adminProcedure.query(async () => {
    const db = await getDb();
    if (!db) return [];
    const [rows] = await db.execute(sql`SELECT * FROM navigation_menus ORDER BY id ASC`);
    return Array.isArray(rows) ? rows : [];
  }),

  getMenuItems: adminProcedure
    .input(z.object({ menuId: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];
      const [rows] = await db.execute(
        sql`SELECT * FROM navigation_menu_items WHERE menuId = ${input.menuId} ORDER BY sortOrder ASC`
      );
      return Array.isArray(rows) ? rows : [];
    }),

  createMenu: adminProcedure
    .input(z.object({ name: z.string(), location: z.string().default("header") }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      await db.execute(sql`INSERT INTO navigation_menus (name, location) VALUES (${input.name}, ${input.location})`);
      return { success: true };
    }),

  addMenuItem: adminProcedure
    .input(z.object({
      menuId: z.number(),
      label: z.string(),
      url: z.string(),
      target: z.string().default("_self"),
      icon: z.string().optional(),
      parentId: z.number().optional(),
      sortOrder: z.number().default(0),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      await db.execute(
        sql`INSERT INTO navigation_menu_items (menuId, label, url, target, icon, parentId, sortOrder) 
            VALUES (${input.menuId}, ${input.label}, ${input.url}, ${input.target}, ${input.icon ?? null}, ${input.parentId ?? null}, ${input.sortOrder})`
      );
      return { success: true };
    }),

  deleteMenuItem: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      await db.execute(sql`DELETE FROM navigation_menu_items WHERE id = ${input.id}`);
      return { success: true };
    }),
});

// ============================================================================
// AI ANALYTICS ROUTER — Lingueefy Companion monitoring
// ============================================================================
export const aiAnalyticsRouter = router({
  getOverview: adminProcedure.query(async () => {
    const db = await getDb();
    if (!db) return { totalAiSessions: 0, totalCompanionSessions: 0, totalMessages: 0, totalPracticeLogs: 0, avgSessionDuration: 0, avgScore: 0 };
    
    const [aiRows] = await db.execute(sql`SELECT COUNT(*) as cnt FROM ai_sessions`);
    const totalAiSessions = Array.isArray(aiRows) ? Number((aiRows[0] as any)?.cnt ?? 0) : 0;

    const [practiceRows] = await db.execute(sql`SELECT COUNT(*) as cnt FROM practice_logs`);
    const totalPracticeLogs = Array.isArray(practiceRows) ? Number((practiceRows[0] as any)?.cnt ?? 0) : 0;

    const [durationRows] = await db.execute(sql`SELECT COALESCE(AVG(durationSeconds), 0) as avg FROM ai_sessions`);
    const avgSessionDuration = Array.isArray(durationRows) ? Number((durationRows[0] as any)?.avg ?? 0) : 0;

    const [scoreRows] = await db.execute(sql`SELECT COALESCE(AVG(score), 0) as avg FROM practice_logs WHERE score IS NOT NULL`);
    const avgScore = Array.isArray(scoreRows) ? Number((scoreRows[0] as any)?.avg ?? 0) : 0;

    return {
      totalAiSessions,
      totalCompanionSessions: totalAiSessions,
      totalMessages: totalAiSessions * 5, // estimate
      totalPracticeLogs,
      avgSessionDuration: Math.round(avgSessionDuration),
      avgScore: Math.round(avgScore),
    };
  }),

  getTopUsers: adminProcedure
    .input(z.object({ limit: z.number().default(10) }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];
      const [rows] = await db.execute(
        sql`SELECT p.userId, u.name, u.email, COUNT(*) as sessionCount, 
            COALESCE(AVG(p.score), 0) as avgScore, SUM(p.durationSeconds) as totalDuration
            FROM practice_logs p 
            LEFT JOIN users u ON p.userId = u.id 
            GROUP BY p.userId, u.name, u.email 
            ORDER BY sessionCount DESC 
            LIMIT ${input.limit}`
      );
      return Array.isArray(rows) ? rows : [];
    }),

  getByLevel: adminProcedure.query(async () => {
    const db = await getDb();
    if (!db) return [];
    const [rows] = await db.execute(
      sql`SELECT targetLevel, COUNT(*) as count, COALESCE(AVG(score), 0) as avgScore 
          FROM practice_logs WHERE targetLevel IS NOT NULL 
          GROUP BY targetLevel ORDER BY count DESC`
    );
    return Array.isArray(rows) ? rows : [];
  }),

  getByType: adminProcedure.query(async () => {
    const db = await getDb();
    if (!db) return [];
    const [rows] = await db.execute(
      sql`SELECT practiceType, COUNT(*) as count, COALESCE(AVG(score), 0) as avgScore 
          FROM practice_logs WHERE practiceType IS NOT NULL 
          GROUP BY practiceType ORDER BY count DESC`
    );
    return Array.isArray(rows) ? rows : [];
  }),

  getDailyTrend: adminProcedure
    .input(z.object({ days: z.number().default(30) }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];
      const [rows] = await db.execute(
        sql`SELECT DATE(createdAt) as date, COUNT(*) as sessions, COALESCE(AVG(score), 0) as avgScore 
            FROM practice_logs 
            WHERE createdAt >= DATE_SUB(NOW(), INTERVAL ${input.days} DAY) 
            GROUP BY DATE(createdAt) ORDER BY date ASC`
      );
      return Array.isArray(rows) ? rows : [];
    }),

  // User drill-down: sessions, progression, errors for a specific user
  getUserDrilldown: adminProcedure
    .input(z.object({ userId: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return { user: null, sessions: [], progression: [], recentErrors: [] };

      // User info
      const [userRows] = await db.execute(
        sql`SELECT id, name, email, createdAt FROM users WHERE id = ${input.userId} LIMIT 1`
      );
      const user = Array.isArray(userRows) && userRows.length > 0 ? userRows[0] : null;

      // Recent practice sessions
      const [sessionRows] = await db.execute(
        sql`SELECT id, practiceType, targetLevel, score, durationSeconds, feedback, createdAt 
            FROM practice_logs WHERE userId = ${input.userId} 
            ORDER BY createdAt DESC LIMIT 50`
      );
      const sessions = Array.isArray(sessionRows) ? sessionRows : [];

      // Weekly progression (avg score per week)
      const [progressionRows] = await db.execute(
        sql`SELECT YEARWEEK(createdAt) as week, COALESCE(AVG(score), 0) as avgScore, COUNT(*) as sessionCount 
            FROM practice_logs WHERE userId = ${input.userId} 
            GROUP BY YEARWEEK(createdAt) ORDER BY week ASC LIMIT 12`
      );
      const progression = Array.isArray(progressionRows) ? progressionRows : [];

      // Recent errors/low scores
      const [errorRows] = await db.execute(
        sql`SELECT id, practiceType, targetLevel, score, feedback, createdAt 
            FROM practice_logs WHERE userId = ${input.userId} AND score IS NOT NULL AND score < 60 
            ORDER BY createdAt DESC LIMIT 20`
      );
      const recentErrors = Array.isArray(errorRows) ? errorRows : [];

      return { user, sessions, progression, recentErrors };
    }),

  // List all users with AI usage for drill-down selection
  listAIUsers: adminProcedure.query(async () => {
    const db = await getDb();
    if (!db) return [];
    const [rows] = await db.execute(
      sql`SELECT p.userId, u.name, u.email, COUNT(*) as totalSessions, 
          COALESCE(AVG(p.score), 0) as avgScore, MAX(p.createdAt) as lastActive 
          FROM practice_logs p LEFT JOIN users u ON p.userId = u.id 
          GROUP BY p.userId, u.name, u.email ORDER BY totalSessions DESC`
    );
    return Array.isArray(rows) ? rows : [];
  }),
});

// ============================================================================
// SALES ANALYTICS ROUTER — Revenue, LTV, Churn, Funnel
// ============================================================================
// ============================================================================
// AI RULES ROUTER — Configurable A/B/C levels, simulation types
// ============================================================================
export const aiRulesRouter = router({
  getRules: adminProcedure.query(async () => {
    const db = await getDb();
    if (!db) return [];
    const [rows] = await db.execute(
      sql`SELECT \`key\`, \`value\` FROM platform_settings WHERE \`key\` LIKE 'ai_rule_%' ORDER BY \`key\``
    );
    return Array.isArray(rows) ? rows : [];
  }),

  setRule: adminProcedure
    .input(z.object({ key: z.string(), value: z.string() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) return false;
      await db.execute(
        sql`INSERT INTO platform_settings (\`key\`, \`value\`, updatedAt) 
            VALUES (${input.key}, ${input.value}, NOW()) 
            ON DUPLICATE KEY UPDATE \`value\` = ${input.value}, updatedAt = NOW()`
      );
      return true;
    }),

  deleteRule: adminProcedure
    .input(z.object({ key: z.string() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) return false;
      await db.execute(
        sql`DELETE FROM platform_settings WHERE \`key\` = ${input.key}`
      );
      return true;
    }),
});

export const salesAnalyticsRouter = router({
  getConversionFunnel: adminProcedure.query(async () => {
    const db = await getDb();
    if (!db) return { stages: [
      { name: "Visitors", count: 0, rate: 100 },
      { name: "Leads", count: 0, rate: 0 },
      { name: "Trials", count: 0, rate: 0 },
      { name: "Customers", count: 0, rate: 0 },
      { name: "Repeat", count: 0, rate: 0 },
    ]};

    const [totalUsers] = await db.execute(sql`SELECT COUNT(*) as cnt FROM users`);
    const totalUsersCount = Array.isArray(totalUsers) ? Number((totalUsers[0] as any)?.cnt ?? 0) : 0;

    const [leadsCount] = await db.execute(sql`SELECT COUNT(*) as cnt FROM ecosystem_leads`);
    const leads = Array.isArray(leadsCount) ? Number((leadsCount[0] as any)?.cnt ?? 0) : 0;

    const [enrolledCount] = await db.execute(sql`SELECT COUNT(DISTINCT userId) as cnt FROM course_enrollments`);
    const enrolled = Array.isArray(enrolledCount) ? Number((enrolledCount[0] as any)?.cnt ?? 0) : 0;

    const [paidCount] = await db.execute(sql`SELECT COUNT(DISTINCT userId) as cnt FROM course_enrollments WHERE amountPaid > 0`);
    const paid = Array.isArray(paidCount) ? Number((paidCount[0] as any)?.cnt ?? 0) : 0;

    const stages = [
      { name: "Visitors", count: totalUsersCount, rate: 100 },
      { name: "Leads", count: leads, rate: totalUsersCount > 0 ? Math.round((leads / totalUsersCount) * 100) : 0 },
      { name: "Enrolled", count: enrolled, rate: totalUsersCount > 0 ? Math.round((enrolled / totalUsersCount) * 100) : 0 },
      { name: "Paid", count: paid, rate: totalUsersCount > 0 ? Math.round((paid / totalUsersCount) * 100) : 0 },
      { name: "Repeat", count: 0, rate: 0 },
    ];
    return { stages };
  }),

  getStudentLTV: adminProcedure.query(async () => {
    const db = await getDb();
    if (!db) return { averageLTV: 0, totalRevenue: 0, totalCustomers: 0 };

    const [enrollmentRevenue] = await db.execute(
      sql`SELECT COALESCE(SUM(amountPaid), 0) as total, COUNT(DISTINCT userId) as customers FROM course_enrollments`
    );
    const total = Array.isArray(enrollmentRevenue) ? Number((enrollmentRevenue[0] as any)?.total ?? 0) : 0;
    const customers = Array.isArray(enrollmentRevenue) ? Number((enrollmentRevenue[0] as any)?.customers ?? 0) : 0;

    const [coachingRevenue] = await db.execute(
      sql`SELECT COALESCE(SUM(CAST(amountPaid AS DECIMAL(10,2))), 0) as total FROM coaching_plan_purchases`
    );
    const coachingTotal = Array.isArray(coachingRevenue) ? Number((coachingRevenue[0] as any)?.total ?? 0) : 0;

    const totalRevenue = total + coachingTotal;
    const averageLTV = customers > 0 ? Math.round(totalRevenue / customers) : 0;

    return { averageLTV, totalRevenue, totalCustomers: customers };
  }),

  getChurn: adminProcedure.query(async () => {
    const db = await getDb();
    if (!db) return { churnRate: 0, activeStudents: 0, inactiveStudents: 0 };

    const [activeRows] = await db.execute(
      sql`SELECT COUNT(DISTINCT userId) as cnt FROM course_enrollments WHERE status = 'active'`
    );
    const active = Array.isArray(activeRows) ? Number((activeRows[0] as any)?.cnt ?? 0) : 0;

    const [totalRows] = await db.execute(
      sql`SELECT COUNT(DISTINCT userId) as cnt FROM course_enrollments`
    );
    const total = Array.isArray(totalRows) ? Number((totalRows[0] as any)?.cnt ?? 0) : 0;

    const inactive = total - active;
    const churnRate = total > 0 ? Math.round((inactive / total) * 100) : 0;

    return { churnRate, activeStudents: active, inactiveStudents: inactive };
  }),

  getMonthlyRevenue: adminProcedure
    .input(z.object({ months: z.number().default(12) }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];
      const [rows] = await db.execute(
        sql`SELECT DATE_FORMAT(enrolledAt, '%Y-%m') as month, 
            SUM(amountPaid) as revenue, COUNT(*) as transactions 
            FROM course_enrollments 
            WHERE enrolledAt >= DATE_SUB(NOW(), INTERVAL ${input.months} MONTH) 
            GROUP BY DATE_FORMAT(enrolledAt, '%Y-%m') 
            ORDER BY month ASC`
      );
      return Array.isArray(rows) ? rows : [];
    }),

  getExportData: adminProcedure
    .input(z.object({
      type: z.enum(["enrollments", "coaching", "all"]),
      dateFrom: z.string().optional(),
      dateTo: z.string().optional(),
    }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];
      const dateFilter = input.dateFrom && input.dateTo
        ? sql` AND enrolledAt BETWEEN ${input.dateFrom} AND ${input.dateTo}`
        : sql``;
      if (input.type === "enrollments" || input.type === "all") {
        const [rows] = await db.execute(
          sql`SELECT ce.id, u.name as userName, u.email as userEmail, 
              c.title as courseTitle, c.category as productCategory, ce.status, 
              ce.amountPaid, ce.enrolledAt,
              CASE WHEN ce.enrolledAt >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN 'new' 
                   WHEN ce.enrolledAt >= DATE_SUB(NOW(), INTERVAL 90 DAY) THEN 'recent' 
                   ELSE 'established' END as cohort
              FROM course_enrollments ce 
              LEFT JOIN users u ON ce.userId = u.id 
              LEFT JOIN courses c ON ce.courseId = c.id 
              WHERE 1=1 ${dateFilter}
              ORDER BY ce.enrolledAt DESC LIMIT 2000`
        );
        return Array.isArray(rows) ? rows : [];
      }
      const [rows] = await db.execute(
        sql`SELECT cp.id, u.name as userName, u.email as userEmail, 
            cp.planName, cp.status, cp.amountPaid, cp.purchasedAt,
            CASE WHEN cp.purchasedAt >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN 'new' 
                 WHEN cp.purchasedAt >= DATE_SUB(NOW(), INTERVAL 90 DAY) THEN 'recent' 
                 ELSE 'established' END as cohort
            FROM coaching_plan_purchases cp 
            LEFT JOIN users u ON cp.userId = u.id 
            ORDER BY cp.purchasedAt DESC LIMIT 2000`
      );
      return Array.isArray(rows) ? rows : [];
    }),

  getRevenueByProduct: adminProcedure.query(async () => {
    const db = await getDb();
    if (!db) return [];
    const [rows] = await db.execute(
      sql`SELECT c.title as product, c.category, COUNT(*) as sales, 
          COALESCE(SUM(ce.amountPaid), 0) as revenue 
          FROM course_enrollments ce 
          LEFT JOIN courses c ON ce.courseId = c.id 
          GROUP BY c.title, c.category ORDER BY revenue DESC`
    );
    return Array.isArray(rows) ? rows : [];
  }),

  getRevenueByCohort: adminProcedure.query(async () => {
    const db = await getDb();
    if (!db) return [];
    const [rows] = await db.execute(
      sql`SELECT 
          CASE WHEN enrolledAt >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN 'Last 30 days' 
               WHEN enrolledAt >= DATE_SUB(NOW(), INTERVAL 90 DAY) THEN 'Last 90 days' 
               WHEN enrolledAt >= DATE_SUB(NOW(), INTERVAL 180 DAY) THEN 'Last 6 months' 
               ELSE 'Older' END as cohort,
          COUNT(*) as enrollments, COALESCE(SUM(amountPaid), 0) as revenue 
          FROM course_enrollments GROUP BY cohort ORDER BY revenue DESC`
    );
    return Array.isArray(rows) ? rows : [];
  }),
});

// ============================================================================
// ACTIVITY LOG ROUTER — Who changed what, when
// ============================================================================
export const activityLogRouter = router({
  getRecent: adminProcedure
    .input(z.object({ limit: z.number().default(50) }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];
      const [rows] = await db.execute(
        sql`SELECT a.*, u.name as userName, u.email as userEmail 
            FROM admin_activity_log a 
            LEFT JOIN users u ON a.userId = u.id 
            ORDER BY a.createdAt DESC LIMIT ${input.limit}`
      );
      return Array.isArray(rows) ? rows : [];
    }),
});


// ============================================================================
// MEDIA LIBRARY ROUTER — S3 upload, browse, tag, reuse across CMS/Courses
// ============================================================================
export const mediaLibraryRouter = router({
  list: adminProcedure
    .input(z.object({
      folder: z.string().optional(),
      mimeType: z.string().optional(),
      search: z.string().optional(),
      limit: z.number().default(50),
      offset: z.number().default(0),
    }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return { items: [], total: 0 };
      let where = sql`1=1`;
      if (input.folder) where = sql`${where} AND folder = ${input.folder}`;
      if (input.mimeType) where = sql`${where} AND mimeType LIKE ${input.mimeType + '%'}`;
      if (input.search) where = sql`${where} AND (fileName LIKE ${`%${input.search}%`} OR altText LIKE ${`%${input.search}%`} OR tags LIKE ${`%${input.search}%`})`;
      const [countRows] = await db.execute(sql`SELECT COUNT(*) as total FROM media_library WHERE ${where}`);
      const total = Array.isArray(countRows) && countRows[0] ? Number((countRows[0] as any).total) : 0;
      const [rows] = await db.execute(
        sql`SELECT * FROM media_library WHERE ${where} ORDER BY createdAt DESC LIMIT ${input.limit} OFFSET ${input.offset}`
      );
      return { items: Array.isArray(rows) ? rows : [], total };
    }),

  create: adminProcedure
    .input(z.object({
      fileName: z.string(),
      fileKey: z.string(),
      url: z.string(),
      mimeType: z.string().default("image/jpeg"),
      fileSize: z.number().default(0),
      altText: z.string().default(""),
      tags: z.string().default(""),
      folder: z.string().default("general"),
    }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) return null;
      const [result] = await db.execute(
        sql`INSERT INTO media_library (fileName, fileKey, url, mimeType, fileSize, altText, tags, folder, uploadedBy) 
            VALUES (${input.fileName}, ${input.fileKey}, ${input.url}, ${input.mimeType}, ${input.fileSize}, ${input.altText}, ${input.tags}, ${input.folder}, ${ctx.user.id})`
      );
      return { id: (result as any).insertId, ...input };
    }),

  update: adminProcedure
    .input(z.object({
      id: z.number(),
      altText: z.string().optional(),
      tags: z.string().optional(),
      folder: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) return false;
      const sets: string[] = [];
      if (input.altText !== undefined) sets.push(`altText = '${input.altText}'`);
      if (input.tags !== undefined) sets.push(`tags = '${input.tags}'`);
      if (input.folder !== undefined) sets.push(`folder = '${input.folder}'`);
      if (sets.length === 0) return false;
      await db.execute(sql`UPDATE media_library SET ${sql.raw(sets.join(', '))} WHERE id = ${input.id}`);
      return true;
    }),

  delete: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) return false;
      await db.execute(sql`DELETE FROM media_library WHERE id = ${input.id}`);
      return true;
    }),

  getFolders: adminProcedure.query(async () => {
    const db = await getDb();
    if (!db) return [];
    const [rows] = await db.execute(
      sql`SELECT folder, COUNT(*) as count FROM media_library GROUP BY folder ORDER BY folder`
    );
    return Array.isArray(rows) ? rows : [];
  }),
});

// ============================================================================
// RBAC PERMISSIONS ROUTER — Granular per-module + per-action permissions
// ============================================================================
export const rbacRouter = router({
  getPermissions: adminProcedure
    .input(z.object({ role: z.string().optional() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];
      const where = input.role ? sql`role = ${input.role}` : sql`1=1`;
      const [rows] = await db.execute(
        sql`SELECT * FROM role_permissions WHERE ${where} ORDER BY role, module, action`
      );
      return Array.isArray(rows) ? rows : [];
    }),

  setPermission: adminProcedure
    .input(z.object({
      role: z.string(),
      module: z.string(),
      action: z.string(),
      allowed: z.boolean(),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) return false;
      await db.execute(
        sql`INSERT INTO role_permissions (role, module, action, allowed) 
            VALUES (${input.role}, ${input.module}, ${input.action}, ${input.allowed}) 
            ON DUPLICATE KEY UPDATE allowed = ${input.allowed}`
      );
      return true;
    }),

  deletePermission: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) return false;
      await db.execute(sql`DELETE FROM role_permissions WHERE id = ${input.id}`);
      return true;
    }),

  bulkSetPermissions: adminProcedure
    .input(z.object({
      role: z.string(),
      permissions: z.array(z.object({
        module: z.string(),
        action: z.string(),
        allowed: z.boolean(),
      })),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) return false;
      for (const perm of input.permissions) {
        await db.execute(
          sql`INSERT INTO role_permissions (role, module, action, allowed) 
              VALUES (${input.role}, ${perm.module}, ${perm.action}, ${perm.allowed}) 
              ON DUPLICATE KEY UPDATE allowed = ${perm.allowed}`
        );
      }
      return true;
    }),

  getRoles: adminProcedure.query(async () => {
    const db = await getDb();
    if (!db) return [];
    const [rows] = await db.execute(
      sql`SELECT DISTINCT role FROM role_permissions ORDER BY role`
    );
    return Array.isArray(rows) ? rows : [];
  }),
});

// ============================================================================
// EMAIL TEMPLATE ROUTER — Visual editor, dynamic variables, preview
// ============================================================================
export const emailTemplateRouter = router({
  list: adminProcedure
    .input(z.object({
      category: z.string().optional(),
      search: z.string().optional(),
    }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];
      let where = sql`1=1`;
      if (input.category) where = sql`${where} AND category = ${input.category}`;
      if (input.search) where = sql`${where} AND (name LIKE ${`%${input.search}%`} OR subject LIKE ${`%${input.search}%`})`;
      const [rows] = await db.execute(
        sql`SELECT * FROM email_templates WHERE ${where} ORDER BY updatedAt DESC`
      );
      return Array.isArray(rows) ? rows : [];
    }),

  getById: adminProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return null;
      const [rows] = await db.execute(
        sql`SELECT * FROM email_templates WHERE id = ${input.id} LIMIT 1`
      );
      return Array.isArray(rows) && rows.length > 0 ? rows[0] : null;
    }),

  create: adminProcedure
    .input(z.object({
      name: z.string(),
      subject: z.string().default(""),
      bodyHtml: z.string().default(""),
      bodyText: z.string().default(""),
      category: z.string().default("general"),
      variables: z.string().default("[]"),
    }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) return null;
      const [result] = await db.execute(
        sql`INSERT INTO email_templates (name, subject, bodyHtml, bodyText, category, variables, createdBy) 
            VALUES (${input.name}, ${input.subject}, ${input.bodyHtml}, ${input.bodyText}, ${input.category}, ${input.variables}, ${ctx.user.id})`
      );
      return { id: (result as any).insertId, ...input };
    }),

  update: adminProcedure
    .input(z.object({
      id: z.number(),
      name: z.string().optional(),
      subject: z.string().optional(),
      bodyHtml: z.string().optional(),
      bodyText: z.string().optional(),
      category: z.string().optional(),
      variables: z.string().optional(),
      isActive: z.boolean().optional(),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) return false;
      const { id, ...fields } = input;
      const sets: string[] = [];
      for (const [key, val] of Object.entries(fields)) {
        if (val !== undefined) {
          if (typeof val === "boolean") {
            sets.push(`${key} = ${val ? 1 : 0}`);
          } else {
            sets.push(`${key} = '${String(val).replace(/'/g, "''")}'`);
          }
        }
      }
      if (sets.length === 0) return false;
      await db.execute(sql`UPDATE email_templates SET ${sql.raw(sets.join(', '))} WHERE id = ${id}`);
      return true;
    }),

  delete: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) return false;
      await db.execute(sql`DELETE FROM email_templates WHERE id = ${input.id}`);
      return true;
    }),

  duplicate: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) return null;
      const [rows] = await db.execute(
        sql`SELECT * FROM email_templates WHERE id = ${input.id} LIMIT 1`
      );
      if (!Array.isArray(rows) || rows.length === 0) return null;
      const original = rows[0] as any;
      const [result] = await db.execute(
        sql`INSERT INTO email_templates (name, subject, bodyHtml, bodyText, category, variables, createdBy) 
            VALUES (${original.name + ' (Copy)'}, ${original.subject}, ${original.bodyHtml}, ${original.bodyText}, ${original.category}, ${original.variables}, ${ctx.user.id})`
      );
      return { id: (result as any).insertId };
    }),

  getCategories: adminProcedure.query(async () => {
    const db = await getDb();
    if (!db) return [];
    const [rows] = await db.execute(
      sql`SELECT DISTINCT category FROM email_templates ORDER BY category`
    );
    return Array.isArray(rows) ? rows : [];
  }),
});
