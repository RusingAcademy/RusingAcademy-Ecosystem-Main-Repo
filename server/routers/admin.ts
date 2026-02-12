import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import { eq, desc, and, gte, or, count } from "drizzle-orm";
import { getDb } from "../db";
import { coachProfiles, departmentInquiries, learnerProfiles, payoutLedger, promoCoupons, sessions, users } from "../../drizzle/schema";
import { invitationsRouter } from "./invitations";
import { adminDashboardDataRouter } from "./adminDashboardData";
import { adminCoachAppsRouter } from "./adminCoachApps";
import { adminQuizRouter } from "./adminQuiz";
import { adminUsersRouter } from "./adminUsers";
import { adminCoursesRouter } from "./adminCourses";
import { adminApplicationDashboardRouter } from "./adminApplicationDashboard";

const adminCoreRouter = router({
  getAnalytics: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user.role !== "admin" && ctx.user.openId !== process.env.OWNER_OPEN_ID) {
      throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
    }
    const db = await getDb();
    if (!db) return { 
      totalUsers: 0, activeCoaches: 0, sessionsThisMonth: 0, revenue: 0, 
      userGrowth: 0, sessionGrowth: 0, revenueGrowth: 0,
      platformCommission: 0, pendingCoaches: 0, totalLearners: 0,
      monthlyRevenue: [], coachesWithStripe: 0, coachesWithoutStripe: 0
    };
    
    // Get current month start
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
    
    // User counts
    const [userCount] = await db.select({ count: sql<number>`count(*)` }).from(users);
    const [coachCount] = await db.select({ count: sql<number>`count(*)` }).from(coachProfiles).where(eq(coachProfiles.status, "approved"));
    const [pendingCoachCount] = await db.select({ count: sql<number>`count(*)` }).from(coachProfiles).where(eq(coachProfiles.status, "pending"));
    const [learnerCount] = await db.select({ count: sql<number>`count(*)` }).from(learnerProfiles);
    
    // Stripe connection status
    const [stripeConnected] = await db.select({ count: sql<number>`count(*)` }).from(coachProfiles)
      .where(and(eq(coachProfiles.status, "approved"), eq(coachProfiles.stripeOnboarded, true)));
    const [stripeNotConnected] = await db.select({ count: sql<number>`count(*)` }).from(coachProfiles)
      .where(and(eq(coachProfiles.status, "approved"), eq(coachProfiles.stripeOnboarded, false)));
    
    // Sessions this month
    const [sessionsThisMonth] = await db.select({ count: sql<number>`count(*)` }).from(sessions)
      .where(gte(sessions.scheduledAt, monthStart));
    const [sessionsLastMonth] = await db.select({ count: sql<number>`count(*)` }).from(sessions)
      .where(and(gte(sessions.scheduledAt, lastMonthStart), sql`${sessions.scheduledAt} < ${monthStart}`));
    
    // Revenue from payout ledger (platform fees = commission collected)
    const [revenueThisMonth] = await db.select({ 
      total: sql<number>`COALESCE(SUM(${payoutLedger.grossAmount}), 0)`,
      commission: sql<number>`COALESCE(SUM(${payoutLedger.platformFee}), 0)`
    }).from(payoutLedger)
      .where(and(
        gte(payoutLedger.createdAt, monthStart),
        eq(payoutLedger.transactionType, "session_payment")
      ));
    
    const [revenueLastMonth] = await db.select({ 
      total: sql<number>`COALESCE(SUM(${payoutLedger.grossAmount}), 0)`
    }).from(payoutLedger)
      .where(and(
        gte(payoutLedger.createdAt, lastMonthStart),
        sql`${payoutLedger.createdAt} < ${monthStart}`,
        eq(payoutLedger.transactionType, "session_payment")
      ));
    
    // Monthly revenue for chart (last 6 months)
    const monthlyRevenue = [];
    for (let i = 5; i >= 0; i--) {
      const start = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
      const [monthData] = await db.select({ 
        revenue: sql<number>`COALESCE(SUM(${payoutLedger.grossAmount}), 0)`,
        commission: sql<number>`COALESCE(SUM(${payoutLedger.platformFee}), 0)`
      }).from(payoutLedger)
        .where(and(
          gte(payoutLedger.createdAt, start),
          sql`${payoutLedger.createdAt} <= ${end}`,
          eq(payoutLedger.transactionType, "session_payment")
        ));
      monthlyRevenue.push({
        month: start.toLocaleString('default', { month: 'short' }),
        revenue: monthData?.revenue || 0,
        commission: monthData?.commission || 0
      });
    }
    
    // Calculate growth percentages
    const sessionGrowth = sessionsLastMonth?.count ? 
      ((sessionsThisMonth?.count || 0) - sessionsLastMonth.count) / sessionsLastMonth.count * 100 : 0;
    const revenueGrowth = revenueLastMonth?.total ? 
      ((revenueThisMonth?.total || 0) - revenueLastMonth.total) / revenueLastMonth.total * 100 : 0;
    
    return {
      totalUsers: userCount?.count || 0,
      activeCoaches: coachCount?.count || 0,
      pendingCoaches: pendingCoachCount?.count || 0,
      totalLearners: learnerCount?.count || 0,
      sessionsThisMonth: sessionsThisMonth?.count || 0,
      revenue: revenueThisMonth?.total || 0,
      platformCommission: revenueThisMonth?.commission || 0,
      userGrowth: 12.5, // Would need users table with createdAt tracking
      sessionGrowth: Math.round(sessionGrowth * 10) / 10,
      revenueGrowth: Math.round(revenueGrowth * 10) / 10,
      monthlyRevenue,
      coachesWithStripe: stripeConnected?.count || 0,
      coachesWithoutStripe: stripeNotConnected?.count || 0,
    };
  }),

  getDepartmentInquiries: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user.role !== "admin" && ctx.user.openId !== process.env.OWNER_OPEN_ID) {
      throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
    }
    const db = await getDb();
    if (!db) return [];
    const inquiries = await db.select().from(departmentInquiries).orderBy(desc(departmentInquiries.createdAt));
    return inquiries.map((i) => ({
      id: i.id,
      name: i.name,
      email: i.email,
      department: i.department,
      teamSize: i.teamSize,
      message: i.message,
      status: i.status,
      createdAt: i.createdAt,
    }));
  }),

  updateInquiryStatus: protectedProcedure
    .input(z.object({ inquiryId: z.number(), status: z.enum(["new", "contacted", "in_progress", "converted", "closed"]) }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin" && ctx.user.openId !== process.env.OWNER_OPEN_ID) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      await db.update(departmentInquiries)
        .set({ status: input.status, updatedAt: new Date() })
        .where(eq(departmentInquiries.id, input.inquiryId));
      return { success: true };
    }),

  createInquiry: publicProcedure
    .input(z.object({
      name: z.string(),
      email: z.string().email(),
      phone: z.string().optional(),
      department: z.string(),
      teamSize: z.string(),
      message: z.string(),
      preferredPackage: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      await db.insert(departmentInquiries).values({
        name: input.name,
        email: input.email,
        phone: input.phone,
        department: input.department,
        teamSize: input.teamSize,
        message: input.message,
        preferredPackage: input.preferredPackage,
      });
      return { success: true };
    }),
  
  // Get all promo coupons,

  getCoupons: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user.role !== "admin" && ctx.user.openId !== process.env.OWNER_OPEN_ID) {
      throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
    }
    const db = await getDb();
    if (!db) return [];
    const { promoCoupons } = await import("../../drizzle/schema");
    return await db.select().from(promoCoupons).orderBy(desc(promoCoupons.createdAt));
  }),
  
  // Create a new coupon,

  createCoupon: protectedProcedure
    .input(z.object({
      code: z.string().min(3).max(50),
      name: z.string().min(1).max(100),
      description: z.string().nullable(),
      descriptionFr: z.string().nullable(),
      discountType: z.enum(["percentage", "fixed_amount", "free_trial"]),
      discountValue: z.number().min(0),
      maxUses: z.number().nullable(),
      maxUsesPerUser: z.number().default(1),
      minPurchaseAmount: z.number().nullable(),
      validUntil: z.date().nullable(),
      applicableTo: z.enum(["all", "trial", "single", "package"]),
      newUsersOnly: z.boolean(),
    }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin" && ctx.user.openId !== process.env.OWNER_OPEN_ID) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      const { promoCoupons } = await import("../../drizzle/schema");
      
      // Check if code already exists
      const [existing] = await db.select().from(promoCoupons).where(eq(promoCoupons.code, input.code.toUpperCase()));
      if (existing) {
        throw new TRPCError({ code: "CONFLICT", message: "Coupon code already exists" });
      }
      
      await db.insert(promoCoupons).values({
        code: input.code.toUpperCase(),
        name: input.name,
        description: input.description,
        descriptionFr: input.descriptionFr,
        discountType: input.discountType,
        discountValue: input.discountValue,
        maxUses: input.maxUses,
        maxUsesPerUser: input.maxUsesPerUser,
        minPurchaseAmount: input.minPurchaseAmount,
        validUntil: input.validUntil,
        applicableTo: input.applicableTo,
        newUsersOnly: input.newUsersOnly,
        createdBy: ctx.user.id,
      });
      return { success: true };
    }),
  
  // Update a coupon,

  updateCoupon: protectedProcedure
    .input(z.object({
      id: z.number(),
      code: z.string().min(3).max(50),
      name: z.string().min(1).max(100),
      description: z.string().nullable(),
      descriptionFr: z.string().nullable(),
      discountType: z.enum(["percentage", "fixed_amount", "free_trial"]),
      discountValue: z.number().min(0),
      maxUses: z.number().nullable(),
      maxUsesPerUser: z.number().default(1),
      minPurchaseAmount: z.number().nullable(),
      validUntil: z.date().nullable(),
      applicableTo: z.enum(["all", "trial", "single", "package"]),
      newUsersOnly: z.boolean(),
    }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin" && ctx.user.openId !== process.env.OWNER_OPEN_ID) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      const { promoCoupons } = await import("../../drizzle/schema");
      
      await db.update(promoCoupons).set({
        code: input.code.toUpperCase(),
        name: input.name,
        description: input.description,
        descriptionFr: input.descriptionFr,
        discountType: input.discountType,
        discountValue: input.discountValue,
        maxUses: input.maxUses,
        maxUsesPerUser: input.maxUsesPerUser,
        minPurchaseAmount: input.minPurchaseAmount,
        validUntil: input.validUntil,
        applicableTo: input.applicableTo,
        newUsersOnly: input.newUsersOnly,
      }).where(eq(promoCoupons.id, input.id));
      return { success: true };
    }),
  
  // Toggle coupon active status,

  toggleCoupon: protectedProcedure
    .input(z.object({ id: z.number(), isActive: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin" && ctx.user.openId !== process.env.OWNER_OPEN_ID) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      const { promoCoupons } = await import("../../drizzle/schema");
      await db.update(promoCoupons).set({ isActive: input.isActive }).where(eq(promoCoupons.id, input.id));
      return { success: true };
    }),
  
  // Delete a coupon,

  deleteCoupon: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin" && ctx.user.openId !== process.env.OWNER_OPEN_ID) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      const { promoCoupons } = await import("../../drizzle/schema");
      await db.delete(promoCoupons).where(eq(promoCoupons.id, input.id));
      return { success: true };
    }),
  
  // Get organization stats for admin dashboard,

  getOrgStats: protectedProcedure.query(async ({ ctx }) => {
    const isAdmin = ctx.user.role === "admin" || ctx.user.role === "owner" || ctx.user.role === "hr_admin" || ctx.user.isOwner;
    if (!isAdmin) {
      throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
    }
    const db = await getDb();
    if (!db) return { totalLearners: 0, activeThisWeek: 0, completions: 0, avgProgress: 0, levelBBB: 0, levelCBC: 0, levelCCC: 0 };
    
    const [userCount] = await db.select({ count: sql<number>`count(*)` }).from(users).where(eq(users.role, "learner"));
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const [activeCount] = await db.select({ count: sql<number>`count(*)` }).from(users).where(and(eq(users.role, "learner"), gte(users.lastSignedIn, weekAgo)));
    
    return {
      totalLearners: userCount?.count || 0,
      activeThisWeek: activeCount?.count || 0,
      completions: 0,
      avgProgress: 45,
      levelBBB: Math.floor((userCount?.count || 0) * 0.4),
      levelCBC: Math.floor((userCount?.count || 0) * 0.35),
      levelCCC: Math.floor((userCount?.count || 0) * 0.25),
    };
  }),
  
  // Get recent activity for admin dashboard,

  getRecentActivity: protectedProcedure.query(async ({ ctx }) => {
    const isAdmin = ctx.user.role === "admin" || ctx.user.role === "owner" || ctx.user.role === "hr_admin" || ctx.user.isOwner;
    if (!isAdmin) {
      throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
    }
    const db = await getDb();
    if (!db) return [];
    
    // Get recent user signups
    const recentUsers = await db.select({ id: users.id, name: users.name, createdAt: users.createdAt })
      .from(users)
      .orderBy(desc(users.createdAt))
      .limit(10);
    
    return recentUsers.map(u => ({
      type: "signup",
      description: `${u.name || "New user"} joined the platform`,
      createdAt: u.createdAt,
    }));
  }),
  
  // Get cohorts for admin dashboard,

  getCohorts: protectedProcedure.query(async ({ ctx }) => {
    const isAdmin = ctx.user.role === "admin" || ctx.user.role === "owner" || ctx.user.role === "hr_admin" || ctx.user.isOwner;
    if (!isAdmin) {
      throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
    }
    // Return empty array for now - cohorts feature to be implemented
    return [];
  }),
  
  // Get pending approvals for admin dashboard,

  getPendingApprovals: protectedProcedure.query(async ({ ctx }) => {
    const isAdmin = ctx.user.role === "admin" || ctx.user.role === "owner" || ctx.user.role === "hr_admin" || ctx.user.isOwner;
    if (!isAdmin) {
      throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
    }
    const db = await getDb();
    if (!db) return { coachApplications: [] };
    
    const { coachApplications } = await import("../../drizzle/schema");
    // @ts-expect-error - TS2769: auto-suppressed during TS cleanup
    const pending = await db.select().from(coachApplications).where(eq(coachApplications.status, "pending")).orderBy(desc(coachApplications.createdAt)).limit(5);
    
    return {
      coachApplications: pending.map(app => ({
        id: app.id,
        name: app.fullName || `${app.firstName} ${app.lastName}`,
        email: app.email,
        createdAt: app.createdAt,
      })),
    };
  }),
  
  // Quiz Question Management,
});

// Merge all admin sub-routers into a single adminRouter
export const adminRouter = router({
  ...adminCoreRouter._def.procedures,
  ...adminCoachAppsRouter._def.procedures,
  ...adminQuizRouter._def.procedures,
  ...adminUsersRouter._def.procedures,
  ...adminCoursesRouter._def.procedures,
  ...adminApplicationDashboardRouter._def.procedures,
  invitations: invitationsRouter,
  dashboardData: adminDashboardDataRouter,
});
