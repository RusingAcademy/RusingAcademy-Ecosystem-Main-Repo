import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import { eq, desc, sql, asc, and, gte, or, like, count } from "drizzle-orm";
import {
  createNotification,
  getDb,
} from "../db";
import { coachProfiles, courseEnrollments, courses, departmentInquiries, learnerProfiles, payoutLedger, sessions, users } from "../../drizzle/schema";
import { invitationsRouter } from "./invitations";
import { adminDashboardDataRouter } from "./adminDashboardData";

export const adminRouter = router({
  // Get coach applications with filters
  getCoachApplications: protectedProcedure
    .input(z.object({
      status: z.string().optional(),
      search: z.string().optional(),
    }).optional())
    .query(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin" && ctx.user.openId !== process.env.OWNER_OPEN_ID) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }
      const db = await getDb();
      if (!db) return [];
      const { coachApplications } = await import("../../drizzle/schema");
      let query = db.select().from(coachApplications).orderBy(desc(coachApplications.createdAt));
      const applications = await query;
      let filtered = applications;
      if (input?.status && input.status !== "all") {
        filtered = filtered.filter((a: any) => a.status === input.status);
      }
      if (input?.search) {
        const s = input.search.toLowerCase();
        filtered = filtered.filter((a: any) => 
          a.firstName?.toLowerCase().includes(s) ||
          a.lastName?.toLowerCase().includes(s) ||
          a.email?.toLowerCase().includes(s) ||
          a.city?.toLowerCase().includes(s)
        );
      }
      return filtered;
    }),
  
  // Approve a coach application
  approveCoachApplication: protectedProcedure
    .input(z.object({ applicationId: z.number(), notes: z.string().optional() }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin" && ctx.user.openId !== process.env.OWNER_OPEN_ID) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      const { coachApplications } = await import("../../drizzle/schema");
      const { sendApplicationStatusEmail } = await import("../email-application-notifications");
      
      // Get the application
      const [application] = await db.select().from(coachApplications).where(eq(coachApplications.id, input.applicationId));
      if (!application) throw new TRPCError({ code: "NOT_FOUND", message: "Application not found" });
      const [user] = await db.select().from(users).where(eq(users.id, application.userId));
      
      // Update application status
      await db.update(coachApplications)
        .set({ 
          status: "approved", 
          reviewedBy: ctx.user.id, 
          reviewedAt: new Date(),
          reviewNotes: input.notes 
        })
        .where(eq(coachApplications.id, input.applicationId));
      
      // Create coach profile from application
      const slug = `${application.firstName || "coach"}-${application.lastName || "user"}`.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
      await db.insert(coachProfiles).values({
        userId: application.userId,
        slug: slug + "-" + Date.now(),
        headline: application.headline || null,
        headlineFr: application.headlineFr || null,
        bio: application.bio || null,
        bioFr: application.bioFr || null,
        videoUrl: application.introVideoUrl || null,
        photoUrl: application.photoUrl || null,
        languages: (application.teachingLanguage as "french" | "english" | "both") || "both",
        specializations: application.specializations || {},
        yearsExperience: application.yearsTeaching || 0,
        credentials: application.certifications || null,
        hourlyRate: ((application.hourlyRate || 50) * 100),
        trialRate: ((application.trialRate || 25) * 100),
        status: "approved",
        approvedAt: new Date(),
        approvedBy: ctx.user.id,
      });
      
      // Update user role to coach
      await db.update(users).set({ role: "coach" }).where(eq(users.id, application.userId));
      
      // Send approval email
      if (user && application.email) {
        await sendApplicationStatusEmail({
          applicantName: application.fullName || `${application.firstName} ${application.lastName}`,
          applicantEmail: application.email,
          status: "approved",
          reviewNotes: input.notes,
          language: "en",
        });
      }
      
      // Create notification for the applicant
      await createNotification({
        userId: application.userId,
        type: "system",
        title: "Application Approved!",
        message: "Congratulations! Your coach application has been approved. You can now start accepting students.",
        link: "/coach/dashboard",
      });
      
      return { success: true };
    }),
  
  // Reject a coach application
  rejectCoachApplication: protectedProcedure
    .input(z.object({ applicationId: z.number(), reason: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin" && ctx.user.openId !== process.env.OWNER_OPEN_ID) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      const { coachApplications } = await import("../../drizzle/schema");
      const { sendApplicationStatusEmail } = await import("../email-application-notifications");
      
      // Get the application
      const [application] = await db.select().from(coachApplications).where(eq(coachApplications.id, input.applicationId));
      if (!application) throw new TRPCError({ code: "NOT_FOUND", message: "Application not found" });
      
      // Update application status
      await db.update(coachApplications)
        .set({ 
          status: "rejected", 
          reviewedBy: ctx.user.id, 
          reviewedAt: new Date(),
          reviewNotes: input.reason 
        })
        .where(eq(coachApplications.id, input.applicationId));
      
      // Send rejection email
      if (application.email) {
        await sendApplicationStatusEmail({
          applicantName: application.fullName || `${application.firstName} ${application.lastName}`,
          applicantEmail: application.email,
          status: "rejected",
          rejectionReason: input.reason,
          language: "en",
        });
      }
      // Create notification for the applicant
      await createNotification({
        userId: application.userId,
        type: "system",
        title: "Application Update",
        message: `Your coach application was not approved. Reason: ${input.reason}`,
        link: "/become-a-coach",
      });
      
      return { success: true };
    }),
  
  getPendingCoaches: protectedProcedure.query(async ({ ctx }) => {
    // Check if user is admin
    if (ctx.user.role !== "admin" && ctx.user.openId !== process.env.OWNER_OPEN_ID) {
      throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
    }
    const db = await getDb();
    if (!db) return [];
    const coaches = await db.select()
      .from(coachProfiles)
      .leftJoin(users, eq(coachProfiles.userId, users.id))
      .orderBy(desc(coachProfiles.createdAt));
    return coaches.map((c: { coach_profiles: typeof coachProfiles.$inferSelect; users: typeof users.$inferSelect | null }) => ({
      id: c.coach_profiles.id,
      userId: c.coach_profiles.userId,
      name: c.users?.name || "Unknown",
      email: c.users?.email || "",
      bio: c.coach_profiles.bio || "",
      bioFr: c.coach_profiles.bioFr || "",
      headline: c.coach_profiles.headline || "",
      headlineFr: c.coach_profiles.headlineFr || "",
      specialties: Object.keys(c.coach_profiles.specializations || {}).filter((k: string) => (c.coach_profiles.specializations as Record<string, boolean>)?.[k]),
      credentials: c.coach_profiles.credentials || "",
      yearsExperience: c.coach_profiles.yearsExperience || 0,
      appliedAt: c.coach_profiles.createdAt,
      status: c.coach_profiles.status,
      photoUrl: c.coach_profiles.photoUrl,
    }));
  }),
  
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
  
  approveCoach: protectedProcedure
    .input(z.object({ coachId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin" && ctx.user.openId !== process.env.OWNER_OPEN_ID) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      await db.update(coachProfiles)
        .set({ status: "approved", approvedAt: new Date(), approvedBy: ctx.user.id })
        .where(eq(coachProfiles.id, input.coachId));
      return { success: true };
    }),
  
  rejectCoach: protectedProcedure
    .input(z.object({ coachId: z.number(), reason: z.string().optional() }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin" && ctx.user.openId !== process.env.OWNER_OPEN_ID) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      await db.update(coachProfiles)
        .set({ status: "rejected", rejectionReason: input.reason })
        .where(eq(coachProfiles.id, input.coachId));
      return { success: true };
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
  
  // Get all promo coupons
  getCoupons: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user.role !== "admin" && ctx.user.openId !== process.env.OWNER_OPEN_ID) {
      throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
    }
    const db = await getDb();
    if (!db) return [];
    const { promoCoupons } = await import("../../drizzle/schema");
    return await db.select().from(promoCoupons).orderBy(desc(promoCoupons.createdAt));
  }),
  
  // Create a new coupon
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
  
  // Update a coupon
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
  
  // Toggle coupon active status
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
  
  // Delete a coupon
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
  
  // Get organization stats for admin dashboard
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
  
  // Get recent activity for admin dashboard
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
  
  // Get cohorts for admin dashboard
  getCohorts: protectedProcedure.query(async ({ ctx }) => {
    const isAdmin = ctx.user.role === "admin" || ctx.user.role === "owner" || ctx.user.role === "hr_admin" || ctx.user.isOwner;
    if (!isAdmin) {
      throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
    }
    // Return empty array for now - cohorts feature to be implemented
    return [];
  }),
  
  // Get pending approvals for admin dashboard
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
  
  // Quiz Question Management
  getQuizQuestions: protectedProcedure
    .input(z.object({ lessonId: z.number() }))
    .query(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin" && ctx.user.openId !== process.env.OWNER_OPEN_ID) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }
      const db = await getDb();
      if (!db) return [];
      const { quizQuestions } = await import("../../drizzle/schema");
      const questions = await db.select().from(quizQuestions)
        .where(eq(quizQuestions.lessonId, input.lessonId))
        .orderBy(quizQuestions.orderIndex);
      return questions;
    }),
  
  createQuizQuestion: protectedProcedure
    .input(z.object({
      lessonId: z.number(),
      questionText: z.string(),
      questionTextFr: z.string().optional(),
      questionType: z.enum(["multiple_choice", "true_false", "fill_blank", "matching", "short_answer", "audio_response"]),
      difficulty: z.enum(["easy", "medium", "hard"]),
      options: z.array(z.string()).optional(),
      correctAnswer: z.string(),
      explanation: z.string().optional(),
      points: z.number().default(10),
    }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin" && ctx.user.openId !== process.env.OWNER_OPEN_ID) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      const { quizQuestions } = await import("../../drizzle/schema");
      
      // Get max sort order for this lesson
      const existing = await db.select().from(quizQuestions).where(eq(quizQuestions.lessonId, input.lessonId));
      const maxOrder = existing.length > 0 ? Math.max(...existing.map((q: any) => q.sortOrder || 0)) : 0;
      
      // @ts-expect-error - TS2769: auto-suppressed during TS cleanup
      const [newQuestion] = await db.insert(quizQuestions).values({
        lessonId: input.lessonId,
        questionText: input.questionText,
        questionTextFr: input.questionTextFr || null,
        questionType: input.questionType,
        difficulty: input.difficulty,
        options: input.options ? JSON.stringify(input.options) : null,
        correctAnswer: String(input.correctAnswer),
        explanation: input.explanation || null,
        points: input.points,
        sortOrder: maxOrder + 1,
      }).$returningId();
      return { id: newQuestion.id, success: true };
    }),
  
  updateQuizQuestion: protectedProcedure
    .input(z.object({
      id: z.number(),
      lessonId: z.number(),
      questionText: z.string(),
      questionTextFr: z.string().optional(),
      questionType: z.enum(["multiple_choice", "true_false", "fill_blank", "matching", "short_answer", "audio_response"]),
      difficulty: z.enum(["easy", "medium", "hard"]),
      options: z.array(z.string()).optional(),
      correctAnswer: z.string(),
      explanation: z.string().optional(),
      points: z.number().default(10),
    }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin" && ctx.user.openId !== process.env.OWNER_OPEN_ID) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      const { quizQuestions } = await import("../../drizzle/schema");
      
      await db.update(quizQuestions).set({
        questionText: input.questionText,
        questionTextFr: input.questionTextFr || null,
        questionType: input.questionType,
        difficulty: input.difficulty,
        options: input.options ? JSON.stringify(input.options) : null,
        correctAnswer: String(input.correctAnswer),
        explanation: input.explanation || null,
        points: input.points,
      }).where(eq(quizQuestions.id, input.id));
      return { success: true };
    }),
  
  deleteQuizQuestion: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin" && ctx.user.openId !== process.env.OWNER_OPEN_ID) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      const { quizQuestions } = await import("../../drizzle/schema");
      
      await db.delete(quizQuestions).where(eq(quizQuestions.id, input.id));
      return { success: true };
    }),
  
  // Export quiz questions for a lesson
  exportQuizQuestions: protectedProcedure
    .input(z.object({ lessonId: z.number(), format: z.enum(["json", "csv"]) }))
    .query(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin" && ctx.user.openId !== process.env.OWNER_OPEN_ID) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }
      const db = await getDb();
      if (!db) return { data: "", filename: "" };
      const { quizQuestions, lessons } = await import("../../drizzle/schema");
      
      const questions = await db.select().from(quizQuestions)
        .where(eq(quizQuestions.lessonId, input.lessonId))
        .orderBy(quizQuestions.orderIndex);
      
      const [lesson] = await db.select().from(lessons).where(eq(lessons.id, input.lessonId));
      const lessonSlug = lesson?.title?.replace(/[^a-z0-9]/gi, '-').toLowerCase() || 'questions';
      
      if (input.format === "json") {
        const exportData = questions.map((q: any) => ({
          questionText: q.questionText,
          questionTextFr: q.questionTextFr,
          questionType: q.questionType,
          difficulty: q.difficulty,
          options: typeof q.options === 'string' ? JSON.parse(q.options) : q.options,
          correctAnswer: q.correctAnswer,
          explanation: q.explanation,
          points: q.points,
        }));
        return { data: JSON.stringify(exportData, null, 2), filename: `${lessonSlug}-questions.json` };
      } else {
        // CSV format
        const headers = ["questionText", "questionTextFr", "questionType", "difficulty", "options", "correctAnswer", "explanation", "points"];
        const rows = questions.map((q: any) => [
          `"${(q.questionText || '').replace(/"/g, '""')}"`,
          `"${(q.questionTextFr || '').replace(/"/g, '""')}"`,
          q.questionType,
          q.difficulty,
          `"${JSON.stringify(typeof q.options === 'string' ? JSON.parse(q.options) : q.options || []).replace(/"/g, '""')}"`,
          q.correctAnswer,
          `"${(q.explanation || '').replace(/"/g, '""')}"`,
          q.points,
        ].join(","));
        return { data: [headers.join(","), ...rows].join("\n"), filename: `${lessonSlug}-questions.csv` };
      }
    }),
  
  // Import quiz questions for a lesson
  importQuizQuestions: protectedProcedure
    .input(z.object({
      lessonId: z.number(),
      format: z.enum(["json", "csv"]),
      data: z.string(),
      mode: z.enum(["append", "replace"]).default("append"),
    }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin" && ctx.user.openId !== process.env.OWNER_OPEN_ID) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      const { quizQuestions } = await import("../../drizzle/schema");
      
      let questionsToImport: any[] = [];
      
      try {
        if (input.format === "json") {
          questionsToImport = JSON.parse(input.data);
        } else {
          // Parse CSV
          const lines = input.data.split("\n").filter(line => line.trim());
          if (lines.length < 2) throw new Error("CSV must have header and at least one data row");
          
          const headers = lines[0].split(",").map(h => h.trim());
          for (let i = 1; i < lines.length; i++) {
            const values = lines[i].match(/("[^"]*"|[^,]+)/g) || [];
            const row: any = {};
            headers.forEach((header, idx) => {
              let value = values[idx] || '';
              // Remove surrounding quotes
              if (value.startsWith('"') && value.endsWith('"')) {
                value = value.slice(1, -1).replace(/""/g, '"');
              }
              if (header === 'options') {
                try { row[header] = JSON.parse(value); } catch { row[header] = []; }
              } else if (header === 'correctAnswer' || header === 'points') {
                row[header] = parseInt(value) || 0;
              } else {
                row[header] = value;
              }
            });
            questionsToImport.push(row);
          }
        }
      } catch (e: any) {
        throw new TRPCError({ code: "BAD_REQUEST", message: `Invalid ${input.format.toUpperCase()} format: ${e.message}` });
      }
      
      // Validate questions
      const validTypes = ["multiple_choice", "true_false", "fill_in_blank"];
      const validDifficulties = ["easy", "medium", "hard"];
      for (const q of questionsToImport) {
        if (!q.questionText) throw new TRPCError({ code: "BAD_REQUEST", message: "Each question must have questionText" });
        if (!validTypes.includes(q.questionType)) throw new TRPCError({ code: "BAD_REQUEST", message: `Invalid questionType: ${q.questionType}` });
        if (!validDifficulties.includes(q.difficulty)) throw new TRPCError({ code: "BAD_REQUEST", message: `Invalid difficulty: ${q.difficulty}` });
      }
      
      // If replace mode, delete existing questions
      if (input.mode === "replace") {
        await db.delete(quizQuestions).where(eq(quizQuestions.lessonId, input.lessonId));
      }
      
      // Get max sort order
      const existing = await db.select().from(quizQuestions).where(eq(quizQuestions.lessonId, input.lessonId));
      let maxOrder = existing.length > 0 ? Math.max(...existing.map((q: any) => q.sortOrder || 0)) : 0;
      
      // Insert questions
      let imported = 0;
      for (const q of questionsToImport) {
        maxOrder++;
        // @ts-expect-error - TS2769: auto-suppressed during TS cleanup
        await db.insert(quizQuestions).values({
          lessonId: input.lessonId,
          questionText: q.questionText,
          questionTextFr: q.questionTextFr || null,
          questionType: q.questionType,
          difficulty: q.difficulty,
          options: Array.isArray(q.options) ? JSON.stringify(q.options) : q.options || null,
          correctAnswer: q.correctAnswer || 0,
          explanation: q.explanation || null,
          points: q.points || 10,
          sortOrder: maxOrder,
        });
        imported++;
      }
      
      return { success: true, imported, total: questionsToImport.length };
    }),
  
  // Get quiz question statistics
  getQuizQuestionStats: protectedProcedure
    .input(z.object({ lessonId: z.number() }))
    .query(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin" && ctx.user.openId !== process.env.OWNER_OPEN_ID) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }
      const db = await getDb();
      if (!db) return { questions: [], summary: { totalAttempts: 0, avgScore: 0, avgTime: 0 } };
      const { quizQuestions, quizAttempts, quizzes } = await import("../../drizzle/schema");
      
      // Get all questions for this lesson
      const questions = await db.select().from(quizQuestions)
        .where(eq(quizQuestions.lessonId, input.lessonId))
        .orderBy(quizQuestions.orderIndex);
      
      // Get all quiz attempts for this lesson's quiz
      const quiz = await db.select().from(quizzes).where(eq(quizzes.lessonId, input.lessonId)).limit(1);
      const attempts = quiz.length > 0 
        ? await db.select().from(quizAttempts).where(eq(quizAttempts.quizId, quiz[0].id))
        : [];
      
      // Calculate stats per question
      const questionStats = questions.map((q: any) => {
        const questionAttempts = attempts.filter((a: any) => {
          try {
            const answers = typeof a.answers === 'string' ? JSON.parse(a.answers) : a.answers;
            return answers && answers[q.id] !== undefined;
          } catch { return false; }
        });
        
        const correctAttempts = questionAttempts.filter((a: any) => {
          try {
            const answers = typeof a.answers === 'string' ? JSON.parse(a.answers) : a.answers;
            return answers && answers[q.id] === q.correctAnswer;
          } catch { return false; }
        });
        
        return {
          id: q.id,
          questionText: q.questionText?.substring(0, 100),
          questionType: q.questionType,
          difficulty: q.difficulty,
          totalAttempts: questionAttempts.length,
          correctAttempts: correctAttempts.length,
          successRate: questionAttempts.length > 0 
            ? Math.round((correctAttempts.length / questionAttempts.length) * 100) 
            : 0,
        };
      });
      
      // Calculate summary
      const totalAttempts = attempts.length;
      const avgScore = totalAttempts > 0 
        ? Math.round(attempts.reduce((sum: number, a: any) => sum + (a.score || 0), 0) / totalAttempts)
        : 0;
      const avgTime = totalAttempts > 0
        ? Math.round(attempts.reduce((sum: number, a: any) => sum + (a.timeSpent || 0), 0) / totalAttempts)
        : 0;
      
      return {
        questions: questionStats,
        summary: { totalAttempts, avgScore, avgTime },
      };
    }),
  
  // Update course (inline editing - basic fields)
  updateCourseBasic: protectedProcedure
    .input(z.object({
      id: z.number(),
      title: z.string().optional(),
      description: z.string().optional(),
      status: z.enum(["draft", "published", "archived"]).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin" && ctx.user.openId !== process.env.OWNER_OPEN_ID) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      const { courses } = await import("../../drizzle/schema");
      
      const updateData: any = {};
      if (input.title !== undefined) updateData.title = input.title;
      if (input.description !== undefined) updateData.description = input.description;
      if (input.status !== undefined) updateData.status = input.status;
      
      await db.update(courses).set(updateData).where(eq(courses.id, input.id));
      return { success: true };
    }),
  
  // Update module (inline editing)
  updateModule: protectedProcedure
    .input(z.object({
      id: z.number(),
      title: z.string().optional(),
      titleFr: z.string().optional(),
      description: z.string().optional(),
      descriptionFr: z.string().optional(),
      sortOrder: z.number().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin" && ctx.user.openId !== process.env.OWNER_OPEN_ID) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      const { courseModules } = await import("../../drizzle/schema");
      
      const updateData: any = {};
      if (input.title !== undefined) updateData.title = input.title;
      if (input.titleFr !== undefined) updateData.titleFr = input.titleFr;
      if (input.description !== undefined) updateData.description = input.description;
      if (input.descriptionFr !== undefined) updateData.descriptionFr = input.descriptionFr;
      if (input.sortOrder !== undefined) updateData.sortOrder = input.sortOrder;
      
      await db.update(courseModules).set(updateData).where(eq(courseModules.id, input.id));
      return { success: true };
    }),
  
  // Update lesson (inline editing - basic fields)
  updateLessonBasic: protectedProcedure
    .input(z.object({
      id: z.number(),
      title: z.string().optional(),
      type: z.enum(["video", "text", "quiz", "assignment", "live"]).optional(),
      sortOrder: z.number().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin" && ctx.user.openId !== process.env.OWNER_OPEN_ID) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      const { lessons } = await import("../../drizzle/schema");
      
      const updateData: any = {};
      if (input.title !== undefined) updateData.title = input.title;
      if (input.type !== undefined) updateData.type = input.type;
      if (input.sortOrder !== undefined) updateData.sortOrder = input.sortOrder;
      
      await db.update(lessons).set(updateData).where(eq(lessons.id, input.id));
      return { success: true };
    }),
  
  // Reorder quiz questions
  reorderQuizQuestions: protectedProcedure
    .input(z.object({
      lessonId: z.number(),
      questionIds: z.array(z.number()),
    }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin" && ctx.user.openId !== process.env.OWNER_OPEN_ID) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      const { quizQuestions } = await import("../../drizzle/schema");
      
      // Update order for each question
      for (let i = 0; i < input.questionIds.length; i++) {
        await db.update(quizQuestions)
          .set({ orderIndex: i + 1 })
          .where(and(
            eq(quizQuestions.id, input.questionIds[i]),
            eq(quizQuestions.lessonId, input.lessonId)
          ));
      }
      
      return { success: true };
    }),
  
  // Duplicate quiz to another lesson
  duplicateQuiz: protectedProcedure
    .input(z.object({
      sourceLessonId: z.number(),
      targetLessonId: z.number(),
    }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin" && ctx.user.openId !== process.env.OWNER_OPEN_ID) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      const { quizQuestions, lessons } = await import("../../drizzle/schema");
      
      // Verify target lesson exists and is a quiz type
      const [targetLesson] = await db.select().from(lessons).where(eq(lessons.id, input.targetLessonId));
      if (!targetLesson) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Target lesson not found" });
      }
      
      // Get source questions
      const sourceQuestions = await db.select().from(quizQuestions)
        .where(eq(quizQuestions.lessonId, input.sourceLessonId))
        .orderBy(asc(quizQuestions.orderIndex));
      
      if (sourceQuestions.length === 0) {
        throw new TRPCError({ code: "NOT_FOUND", message: "No questions found in source lesson" });
      }
      
      // Get current max order in target lesson
      const existingQuestions = await db.select().from(quizQuestions)
        .where(eq(quizQuestions.lessonId, input.targetLessonId));
      const maxOrder = existingQuestions.length > 0 
        ? Math.max(...existingQuestions.map(q => q.orderIndex || 0)) 
        : 0;
      
      // Insert duplicated questions
      let insertedCount = 0;
      for (const q of sourceQuestions) {
        await db.insert(quizQuestions).values({
          lessonId: input.targetLessonId,
          questionText: q.questionText,
          questionTextFr: q.questionTextFr,
          questionType: q.questionType,
          difficulty: q.difficulty,
          options: q.options,
          correctAnswer: q.correctAnswer,
          explanation: q.explanation,
          explanationFr: q.explanationFr,
          points: q.points,
          orderIndex: maxOrder + insertedCount + 1,
          isActive: true,
        });
        insertedCount++;
      }
      
      return { success: true, copiedCount: insertedCount };
    }),
  
  // Get all quiz lessons for duplication target selection
  getQuizLessons: protectedProcedure
    .query(async ({ ctx }) => {
      if (ctx.user.role !== "admin" && ctx.user.openId !== process.env.OWNER_OPEN_ID) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }
      const db = await getDb();
      if (!db) return [];
      const { lessons, courseModules, courses } = await import("../../drizzle/schema");
      
      const quizLessons = await db.select({
        id: lessons.id,
        title: lessons.title,
        moduleTitle: courseModules.title,
        courseTitle: courses.title,
      })
        .from(lessons)
        .innerJoin(courseModules, eq(lessons.moduleId, courseModules.id))
        .innerJoin(courses, eq(courseModules.courseId, courses.id))
        .where(eq(lessons.contentType, "quiz"))
        .orderBy(asc(courses.title), asc(courseModules.sortOrder), asc(lessons.sortOrder));
      
      return quizLessons;
    }),
  
  // Get all registered users with their roles
  getAllUsers: protectedProcedure
    .input(z.object({
      search: z.string().optional(),
      roleFilter: z.enum(["all", "admin", "coach", "learner", "hr_admin"]).optional(),
      page: z.number().default(1),
      limit: z.number().default(20),
    }).optional())
    .query(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin" && ctx.user.openId !== process.env.OWNER_OPEN_ID) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }
      const db = await getDb();
      if (!db) return { users: [], total: 0, page: 1, totalPages: 0 };
      
      const page = input?.page || 1;
      const limit = input?.limit || 20;
      const offset = (page - 1) * limit;
      
      // Get total count
      let countQuery = db.select({ count: sql<number>`count(*)` }).from(users);
      
      // Apply role filter if specified
      if (input?.roleFilter && input.roleFilter !== "all") {
  // @ts-ignore - Drizzle type inference
        countQuery = countQuery.where(eq(users.role, input.roleFilter));
      }
      
      const [countResult] = await countQuery;
      const total = countResult?.count || 0;
      
      // Get users with pagination
      let usersQuery = db.select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        avatarUrl: users.avatarUrl,
        createdAt: users.createdAt,
        lastSignedIn: users.lastSignedIn,
        emailVerified: users.emailVerified,
        loginMethod: users.loginMethod,
      }).from(users).orderBy(desc(users.createdAt)).limit(limit).offset(offset);
      
      // Apply role filter if specified
  // @ts-ignore - Drizzle type inference
      if (input?.roleFilter && input.roleFilter !== "all") {
        // @ts-expect-error - TS2741: auto-suppressed during TS cleanup
        usersQuery = usersQuery.where(eq(users.role, input.roleFilter));
      }
      
      let usersList = await usersQuery;
      
      // Apply search filter in memory (for name and email)
      if (input?.search) {
        const searchLower = input.search.toLowerCase();
        usersList = usersList.filter((u: any) => 
          u.name?.toLowerCase().includes(searchLower) ||
          u.email?.toLowerCase().includes(searchLower)
        );
      }
      
      return {
        users: usersList,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      };
    }),
  
  // Update user role
  updateUserRole: protectedProcedure
    .input(z.object({
      userId: z.number(),
      role: z.enum(["admin", "coach", "learner", "hr_admin"]),
    }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin" && ctx.user.openId !== process.env.OWNER_OPEN_ID) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      
      // Prevent changing own role
      if (input.userId === ctx.user.id) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Cannot change your own role" });
      }
      
      await db.update(users)
        .set({ role: input.role })
        .where(eq(users.id, input.userId));
      
      return { success: true };
    }),
  
  // Export users to CSV
  exportUsersCSV: protectedProcedure
    .input(z.object({
      roleFilter: z.enum(["all", "admin", "coach", "learner", "hr_admin"]).optional(),
    }).optional())
    .query(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin" && ctx.user.openId !== process.env.OWNER_OPEN_ID) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }
      const db = await getDb();
      if (!db) return { csv: "", filename: "users.csv" };
      
      let query = db.select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        loginMethod: users.loginMethod,
        emailVerified: users.emailVerified,
        createdAt: users.createdAt,
        lastSignedIn: users.lastSignedIn,
      }).from(users).orderBy(desc(users.createdAt));
  // @ts-ignore - Drizzle type inference
      
      if (input?.roleFilter && input.roleFilter !== "all") {
        // @ts-expect-error - TS2741: auto-suppressed during TS cleanup
        query = query.where(eq(users.role, input.roleFilter));
      }
      
      const usersList = await query;
      
      // Generate CSV
      const headers = ["ID", "Name", "Email", "Role", "Login Method", "Email Verified", "Created At", "Last Sign In"];
      const rows = usersList.map((u: any) => [
        u.id,
        `"${(u.name || "").replace(/"/g, '""')}"`,
        u.email,
        u.role,
        u.loginMethod || "oauth",
        u.emailVerified ? "Yes" : "No",
        u.createdAt ? new Date(u.createdAt).toISOString() : "",
        u.lastSignedIn ? new Date(u.lastSignedIn).toISOString() : "",
      ].join(","));
      
      const csv = [headers.join(","), ...rows].join("\n");
      const filename = `users-export-${new Date().toISOString().split("T")[0]}.csv`;
      
      return { csv, filename, count: usersList.length };
    }),
  
  // Bulk update user roles
  bulkUpdateUserRoles: protectedProcedure
    .input(z.object({
      userIds: z.array(z.number()),
      role: z.enum(["admin", "coach", "learner", "hr_admin"]),
    }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin" && ctx.user.openId !== process.env.OWNER_OPEN_ID) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      
      // Filter out current user from bulk update
      const filteredIds = input.userIds.filter(id => id !== ctx.user.id);
      
      if (filteredIds.length === 0) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "No valid users to update" });
      }
      
      // Update all users in the list
      for (const userId of filteredIds) {
        await db.update(users)
          .set({ role: input.role })
          .where(eq(users.id, userId));
      }
      
      return { success: true, updated: filteredIds.length };
    }),
  
  // Bulk send notification to users
  bulkSendNotification: protectedProcedure
    .input(z.object({
      userIds: z.array(z.number()),
      title: z.string().min(1).max(200),
      message: z.string().min(1).max(1000),
      type: z.enum(["system", "message", "session_reminder", "booking", "review"]).default("system"),
    }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin" && ctx.user.openId !== process.env.OWNER_OPEN_ID) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      
      // Create notifications for all users
      let sent = 0;
      for (const userId of input.userIds) {
        await createNotification({
          userId,
          type: input.type,
          title: input.title,
          message: input.message,
        });
        sent++;
      }
      
      return { success: true, sent };
    }),
  
  // Get user activity history
  getUserActivityHistory: protectedProcedure
    .input(z.object({ userId: z.number() }))
    .query(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin" && ctx.user.openId !== process.env.OWNER_OPEN_ID) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }
      const db = await getDb();
      if (!db) return { user: null, activities: [], stats: {} };
      
      // Get user details
      const [userData] = await db.select().from(users).where(eq(users.id, input.userId));
      if (!userData) {
        throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
      }
      
      const activities: Array<{ type: string; description: string; date: Date | null; metadata?: any }> = [];
      
      // Get enrollments
      const userEnrollments = await db.select({
        id: courseEnrollments.id,
        courseId: courseEnrollments.courseId,
        courseTitle: courses.title,
        enrolledAt: courseEnrollments.enrolledAt,
        progress: courseEnrollments.progress,
        status: courseEnrollments.status,
      })
        .from(courseEnrollments)
        .leftJoin(courses, eq(courseEnrollments.courseId, courses.id))
        .where(eq(courseEnrollments.userId, input.userId))
        .orderBy(desc(courseEnrollments.enrolledAt))
        .limit(10);
      
      for (const enrollment of userEnrollments) {
        activities.push({
          type: "enrollment",
          description: `Enrolled in course: ${enrollment.courseTitle || "Unknown"}`,
          date: enrollment.enrolledAt,
          metadata: { courseId: enrollment.courseId, progress: enrollment.progress, status: enrollment.status },
        });
      }
      
      // Get sessions (if learner or coach)
      const userSessions = await db.select({
        id: sessions.id,
        scheduledAt: sessions.scheduledAt,
        status: sessions.status,
        duration: sessions.duration,
      })
        .from(sessions)
        .where(or(
          eq(sessions.learnerId, input.userId),
          eq(sessions.coachId, input.userId)
        ))
        .orderBy(desc(sessions.scheduledAt))
        .limit(10);
      
      for (const session of userSessions) {
        activities.push({
          type: "session",
          description: `Coaching session (${session.status})`,
          date: session.scheduledAt,
          metadata: { sessionId: session.id, duration: session.duration, status: session.status },
        });
      }
      
      // Get payments
      const userPayments = await db.select({
        id: payoutLedger.id,
        grossAmount: payoutLedger.grossAmount,
        transactionType: payoutLedger.transactionType,
        createdAt: payoutLedger.createdAt,
      })
        .from(payoutLedger)
        .where(eq(payoutLedger.coachId, input.userId))
        .orderBy(desc(payoutLedger.createdAt))
        .limit(10);
      
      for (const payment of userPayments) {
        activities.push({
          type: "payment",
          description: `Payment: $${((payment.grossAmount || 0) / 100).toFixed(2)} (${payment.transactionType})`,
          date: payment.createdAt,
          metadata: { paymentId: payment.id, amount: payment.grossAmount },
        });
      }
      
      // Get notifications
      const { notifications } = await import("../../drizzle/schema");
      const userNotifications = await db.select()
        .from(notifications)
        .where(eq(notifications.userId, input.userId))
        .orderBy(desc(notifications.createdAt))
        .limit(5);
      
      for (const notif of userNotifications) {
        activities.push({
          type: "notification",
          description: notif.title || "Notification",
          date: notif.createdAt,
          metadata: { notificationId: notif.id, isRead: notif.read },
        });
      }
      
      // Sort all activities by date
      activities.sort((a, b) => {
        const dateA = a.date ? new Date(a.date).getTime() : 0;
        const dateB = b.date ? new Date(b.date).getTime() : 0;
        return dateB - dateA;
      });
      
      // Calculate stats
      const stats = {
        totalEnrollments: userEnrollments.length,
        totalSessions: userSessions.length,
        totalPayments: userPayments.length,
        lastActive: userData.lastSignedIn,
        accountAge: userData.createdAt ? Math.floor((Date.now() - new Date(userData.createdAt).getTime()) / (1000 * 60 * 60 * 24)) : 0,
      };
      
      return {
        user: {
          id: userData.id,
          name: userData.name,
          email: userData.email,
          role: userData.role,
          avatarUrl: userData.avatarUrl,
          createdAt: userData.createdAt,
          lastSignedIn: userData.lastSignedIn,
          emailVerified: userData.emailVerified,
          loginMethod: userData.loginMethod,
        },
        activities: activities.slice(0, 20),
        stats,
      };
    }),
  
  // ============================================================================
  // COURSE MANAGEMENT (Admin Control Center)
  // ============================================================================
  
  // Get all courses for admin management (including drafts)
  getAllCourses: protectedProcedure
    .input(z.object({
      status: z.enum(["all", "draft", "published", "archived"]).optional(),
      search: z.string().optional(),
      page: z.number().default(1),
      limit: z.number().default(20),
    }).optional())
    .query(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin" && ctx.user.openId !== process.env.OWNER_OPEN_ID) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }
      const db = await getDb();
      if (!db) return { courses: [], total: 0 };
      
      const { courses } = await import("../../drizzle/schema");
      const filters = input || { status: "all", page: 1, limit: 20 };
      const conditions: any[] = [];
      
      if (filters.status && filters.status !== "all") {
        conditions.push(eq(courses.status, filters.status));
      }
      
      if (filters.search) {
        const searchTerm = `%${filters.search}%`;
        conditions.push(
          or(
            like(courses.title, searchTerm),
            like(courses.description, searchTerm)
          )
        );
      }
      
      const offset = ((filters.page || 1) - 1) * (filters.limit || 20);
      
      let query = db.select().from(courses);
      if (conditions.length > 0) {
        query = query.where(and(...conditions)) as any;
      }
      
      const allCourses = await query.orderBy(desc(courses.updatedAt));
      const paginatedCourses = allCourses.slice(offset, offset + (filters.limit || 20));
      
      return {
        courses: paginatedCourses,
        total: allCourses.length,
      };
    }),
  
  // Create a new course
  createCourse: protectedProcedure
    .input(z.object({
      title: z.string().min(1),
      description: z.string().optional(),
      shortDescription: z.string().optional(),
      category: z.enum(["sle_oral", "sle_written", "sle_reading", "sle_complete", "business_french", "business_english", "exam_prep", "conversation", "grammar", "vocabulary"]).optional(),
      level: z.enum(["beginner", "intermediate", "advanced", "all_levels"]).optional(),
      targetLanguage: z.enum(["french", "english", "both"]).optional(),
      price: z.number().optional(),
      thumbnailUrl: z.string().optional(),
      previewVideoUrl: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin" && ctx.user.openId !== process.env.OWNER_OPEN_ID) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      
      const { courses } = await import("../../drizzle/schema");
      
      // Generate slug from title
      const slug = input.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "") + "-" + Date.now();
      
      const [newCourse] = await db.insert(courses).values({
        title: input.title,
        slug,
        description: input.description || null,
        shortDescription: input.shortDescription || null,
        category: input.category || "sle_oral",
        level: input.level || "all_levels",
        targetLanguage: input.targetLanguage || "french",
        price: input.price || 0,
        thumbnailUrl: input.thumbnailUrl || null,
        previewVideoUrl: input.previewVideoUrl || null,
        status: "draft",
        instructorId: ctx.user.id,
        instructorName: ctx.user.name || "Admin",
      }).$returningId();
      
      return { success: true, courseId: newCourse.id };
    }),
  
  // Update a course
  
  updateCourse: protectedProcedure
    .input(z.object({
      courseId: z.number(),
      title: z.string().optional(),
      description: z.string().optional(),
      shortDescription: z.string().optional(),
      category: z.enum(["sle_oral", "sle_written", "sle_reading", "sle_complete", "business_french", "business_english", "exam_prep", "conversation", "grammar", "vocabulary"]).optional(),
      level: z.enum(["beginner", "intermediate", "advanced", "all_levels"]).optional(),
      targetLanguage: z.enum(["french", "english", "both"]).optional(),
      price: z.number().optional(),
      originalPrice: z.number().optional(),
      thumbnailUrl: z.string().optional(),
      previewVideoUrl: z.string().optional(),
      accessType: z.enum(["one_time", "subscription", "free"]).optional(),
      accessDurationDays: z.number().optional(),
      hasCertificate: z.boolean().optional(),
      hasQuizzes: z.boolean().optional(),
      hasDownloads: z.boolean().optional(),
      metaTitle: z.string().optional(),
      metaDescription: z.string().optional(),
      dripEnabled: z.boolean().optional(),
      dripInterval: z.number().optional(),
      dripUnit: z.enum(["days", "weeks", "months"]).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin" && ctx.user.openId !== process.env.OWNER_OPEN_ID) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      
      const { courses } = await import("../../drizzle/schema");
      const { courseId, ...updateData } = input;
      
      await db.update(courses)
        .set(updateData)
        .where(eq(courses.id, courseId));
      
      return { success: true };
    }),
  
  // Publish/Unpublish a course
  publishCourse: protectedProcedure
    .input(z.object({
      courseId: z.number(),
      status: z.enum(["draft", "published", "archived"]),
    }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin" && ctx.user.openId !== process.env.OWNER_OPEN_ID) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      
      const { courses } = await import("../../drizzle/schema");
      
      await db.update(courses)
        .set({ 
          status: input.status,
          publishedAt: input.status === "published" ? new Date() : null,
        })
        .where(eq(courses.id, input.courseId));
      
      return { success: true };
    }),
  
  // Delete a course
  deleteCourse: protectedProcedure
    .input(z.object({ courseId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin" && ctx.user.openId !== process.env.OWNER_OPEN_ID) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      
      const { courses, courseModules, lessons } = await import("../../drizzle/schema");
      
      // Delete lessons first
      await db.delete(lessons).where(eq(lessons.courseId, input.courseId));
      // Delete modules
      await db.delete(courseModules).where(eq(courseModules.courseId, input.courseId));
      // Delete course
      await db.delete(courses).where(eq(courses.id, input.courseId));
      
      return { success: true };
    }),
  
  // Duplicate a course
  duplicateCourse: protectedProcedure
    .input(z.object({ courseId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin" && ctx.user.openId !== process.env.OWNER_OPEN_ID) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      
      const { courses, courseModules, lessons } = await import("../../drizzle/schema");
      
      // Get original course
      const [original] = await db.select().from(courses).where(eq(courses.id, input.courseId));
      if (!original) throw new TRPCError({ code: "NOT_FOUND", message: "Course not found" });
      
      // Create new course
      const newSlug = original.slug + "-copy-" + Date.now();
      const [newCourse] = await db.insert(courses).values({
        ...original,
        id: undefined,
        title: original.title + " (Copy)",
        slug: newSlug,
        status: "draft",
        totalEnrollments: 0,
        totalReviews: 0,
        averageRating: null,
        publishedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as any).$returningId();
      
      // Get and duplicate modules
      const originalModules = await db.select().from(courseModules).where(eq(courseModules.courseId, input.courseId));
      
      for (const module of originalModules) {
        const [newModule] = await db.insert(courseModules).values({
          ...module,
          id: undefined,
          courseId: newCourse.id,
          createdAt: new Date(),
          updatedAt: new Date(),
        } as any).$returningId();
        
        // Get and duplicate lessons for this module
        const moduleLessons = await db.select().from(lessons).where(eq(lessons.moduleId, module.id));
        
        for (const lesson of moduleLessons) {
          await db.insert(lessons).values({
            ...lesson,
            id: undefined,
            moduleId: newModule.id,
            courseId: newCourse.id,
            createdAt: new Date(),
            updatedAt: new Date(),
          } as any);
        }
      }
      
      return { success: true, newCourseId: newCourse.id };
    }),
  
  // Get course with full details for editing
  getCourseForEdit: protectedProcedure
    .input(z.object({ courseId: z.number() }))
    .query(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin" && ctx.user.openId !== process.env.OWNER_OPEN_ID) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      
      const { courses, courseModules, lessons } = await import("../../drizzle/schema");
      
      const [course] = await db.select().from(courses).where(eq(courses.id, input.courseId));
      if (!course) throw new TRPCError({ code: "NOT_FOUND", message: "Course not found" });
      
      // Get modules with lessons
      const modules = await db.select().from(courseModules)
        .where(eq(courseModules.courseId, input.courseId))
        .orderBy(asc(courseModules.sortOrder));
      
      const modulesWithLessons = await Promise.all(
        modules.map(async (module) => {
          const moduleLessons = await db.select().from(lessons)
            .where(eq(lessons.moduleId, module.id))
            .orderBy(asc(lessons.sortOrder));
          return { ...module, lessons: moduleLessons };
        })
      );
      
      return { ...course, modules: modulesWithLessons };
    }),
  
  // ============================================================================
  // MODULE MANAGEMENT
  // ============================================================================
  
  // Create a module
  createModule: protectedProcedure
    .input(z.object({
      courseId: z.number(),
      title: z.string().min(1),
      titleFr: z.string().optional(),
      description: z.string().optional(),
      descriptionFr: z.string().optional(),
      sortOrder: z.number().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin" && ctx.user.openId !== process.env.OWNER_OPEN_ID) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      
      const { courseModules, courses } = await import("../../drizzle/schema");
      
      // Get max sort order
      const existingModules = await db.select().from(courseModules)
        .where(eq(courseModules.courseId, input.courseId));
      const maxOrder = existingModules.length > 0 
        ? Math.max(...existingModules.map(m => m.sortOrder || 0)) 
        : -1;
      
      const [newModule] = await db.insert(courseModules).values({
        courseId: input.courseId,
        title: input.title,
        titleFr: input.titleFr || null,
        description: input.description || null,
        descriptionFr: input.descriptionFr || null,
        sortOrder: input.sortOrder ?? maxOrder + 1,
      }).$returningId();
      
      // Update course module count
      await db.update(courses)
        .set({ totalModules: sql`${courses.totalModules} + 1` })
        .where(eq(courses.id, input.courseId));
      
      return { success: true, moduleId: newModule.id };
    }),
  
  // Update a lesson
  
  updateLesson: protectedProcedure
    .input(z.object({
      lessonId: z.number(),
      title: z.string().optional(),
      titleFr: z.string().optional(),
      description: z.string().optional(),
      descriptionFr: z.string().optional(),
      isPreview: z.boolean().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin" && ctx.user.openId !== process.env.OWNER_OPEN_ID) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      
      const { courseModules } = await import("../../drizzle/schema");
      const { moduleId, ...updateData } = input;
      
      await db.update(courseModules)
        .set(updateData)
        .where(eq(courseModules.id, moduleId));
      
      return { success: true };
    }),
  
  // Delete a module
  deleteModule: protectedProcedure
    .input(z.object({ moduleId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin" && ctx.user.openId !== process.env.OWNER_OPEN_ID) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      
      const { courseModules, lessons, courses } = await import("../../drizzle/schema");
      
      // Get module to find courseId
      const [module] = await db.select().from(courseModules).where(eq(courseModules.id, input.moduleId));
      if (!module) throw new TRPCError({ code: "NOT_FOUND", message: "Module not found" });
      
      // Delete lessons first
      await db.delete(lessons).where(eq(lessons.moduleId, input.moduleId));
      // Delete module
      await db.delete(courseModules).where(eq(courseModules.id, input.moduleId));
      
      // Update course module count
      await db.update(courses)
        .set({ totalModules: sql`${courses.totalModules} - 1` })
        .where(eq(courses.id, module.courseId));
      
      return { success: true };
    }),
  
  // Reorder modules
  reorderModules: protectedProcedure
    .input(z.object({
      courseId: z.number(),
      moduleIds: z.array(z.number()),
    }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin" && ctx.user.openId !== process.env.OWNER_OPEN_ID) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      
      const { courseModules } = await import("../../drizzle/schema");
      
      // Update sort order for each module
      for (let i = 0; i < input.moduleIds.length; i++) {
        await db.update(courseModules)
          .set({ sortOrder: i })
          .where(eq(courseModules.id, input.moduleIds[i]));
      }
      
      return { success: true };
    }),
  
  // ============================================================================
  // LESSON MANAGEMENT
  // ============================================================================
  
  // Create a lesson
  createLesson: protectedProcedure
    .input(z.object({
      moduleId: z.number(),
      courseId: z.number(),
      title: z.string().min(1),
      description: z.string().optional(),
      contentType: z.enum(["video", "text", "audio", "pdf", "quiz", "assignment", "download", "live_session"]).optional(),
      videoUrl: z.string().optional(),
      textContent: z.string().optional(),
      audioUrl: z.string().optional(),
      downloadUrl: z.string().optional(),
      estimatedMinutes: z.number().optional(),
      isPreview: z.boolean().optional(),
      isMandatory: z.boolean().optional(),
      sortOrder: z.number().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin" && ctx.user.openId !== process.env.OWNER_OPEN_ID) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      
      const { lessons, courseModules, courses } = await import("../../drizzle/schema");
      
      // Get max sort order
      const existingLessons = await db.select().from(lessons)
        .where(eq(lessons.moduleId, input.moduleId));
      const maxOrder = existingLessons.length > 0 
        ? Math.max(...existingLessons.map(l => l.sortOrder || 0)) 
        : -1;
      
      const [newLesson] = await db.insert(lessons).values({
        moduleId: input.moduleId,
        courseId: input.courseId,
        title: input.title,
        titleFr: input.titleFr || null,
        description: input.description || null,
        descriptionFr: input.descriptionFr || null,
        contentType: input.contentType || "video",
        videoUrl: input.videoUrl || null,
        textContent: input.textContent || null,
        audioUrl: input.audioUrl || null,
        downloadUrl: input.downloadUrl || null,
        estimatedMinutes: input.estimatedMinutes || 10,
        isPreview: input.isPreview || false,
        isMandatory: input.isMandatory ?? true,
        sortOrder: input.sortOrder ?? maxOrder + 1,
      }).$returningId();
      
      // Update module lesson count
      await db.update(courseModules)
        .set({ totalLessons: sql`${courseModules.totalLessons} + 1` })
        .where(eq(courseModules.id, input.moduleId));
      
      // Update course lesson count
      await db.update(courses)
        .set({ totalLessons: sql`${courses.totalLessons} + 1` })
        .where(eq(courses.id, input.courseId));
      
      return { success: true, lessonId: newLesson.id };
    }),
  
  // Full lesson update with all fields (admin CMS)
  updateLessonFull: protectedProcedure
    .input(z.object({
      moduleId: z.number(),
      courseId: z.number(),
      title: z.string().min(1),
      titleFr: z.string().optional(),
      description: z.string().optional(),
      descriptionFr: z.string().optional(),
      contentType: z.enum(["video", "text", "audio", "pdf", "quiz", "assignment", "download", "live_session"]).optional(),
      videoUrl: z.string().optional(),
      videoProvider: z.enum(["youtube", "vimeo", "wistia", "bunny", "self_hosted"]).optional(),
      videoDurationSeconds: z.number().optional(),
      videoThumbnailUrl: z.string().optional(),
      textContent: z.string().optional(),
      audioUrl: z.string().optional(),
      audioDurationSeconds: z.number().optional(),
      downloadUrl: z.string().optional(),
      downloadFileName: z.string().optional(),
      estimatedMinutes: z.number().optional(),
      isPreview: z.boolean().optional(),
      isMandatory: z.boolean().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin" && ctx.user.openId !== process.env.OWNER_OPEN_ID) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      
      const { lessons } = await import("../../drizzle/schema");
      const { lessonId, ...updateData } = input;
      
      await db.update(lessons)
        .set(updateData)
        .where(eq(lessons.id, lessonId));
      
      return { success: true };
    }),
  
  // Delete a lesson
  deleteLesson: protectedProcedure
    .input(z.object({ lessonId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin" && ctx.user.openId !== process.env.OWNER_OPEN_ID) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      
      const { lessons, courseModules, courses } = await import("../../drizzle/schema");
      
      // Get lesson to find moduleId and courseId
      const [lesson] = await db.select().from(lessons).where(eq(lessons.id, input.lessonId));
      if (!lesson) throw new TRPCError({ code: "NOT_FOUND", message: "Lesson not found" });
      
      // Delete lesson
      await db.delete(lessons).where(eq(lessons.id, input.lessonId));
      
      // Update module lesson count
      await db.update(courseModules)
        .set({ totalLessons: sql`${courseModules.totalLessons} - 1` })
        .where(eq(courseModules.id, lesson.moduleId));
      
      // Update course lesson count
      await db.update(courses)
        .set({ totalLessons: sql`${courses.totalLessons} - 1` })
        .where(eq(courses.id, lesson.courseId));
      
      return { success: true };
    }),
  
  // Reorder lessons
  reorderLessons: protectedProcedure
    .input(z.object({
      moduleId: z.number(),
      lessonIds: z.array(z.number()),
    }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin" && ctx.user.openId !== process.env.OWNER_OPEN_ID) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      
      const { lessons } = await import("../../drizzle/schema");
      
      // Update sort order for each lesson
      for (let i = 0; i < input.lessonIds.length; i++) {
        await db.update(lessons)
          .set({ sortOrder: i })
          .where(eq(lessons.id, input.lessonIds[i]));
      }
      
      return { success: true };
    }),
  
  // Upload lesson media
  uploadLessonMedia: protectedProcedure
    .input(z.object({
      lessonId: z.number(),
      fileUrl: z.string(),
      fileName: z.string(),
      mimeType: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin" && ctx.user.openId !== process.env.OWNER_OPEN_ID) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      
      const { lessons } = await import("../../drizzle/schema");
      
      await db.update(lessons)
        .set({
          // @ts-expect-error - TS2353: auto-suppressed during TS cleanup
          content: input.fileUrl,
          updatedAt: new Date(),
        })
        .where(eq(lessons.id, input.lessonId));
      
      return { success: true, url: input.fileUrl };
    }),

  // Get course statistics for admin dashboard
  getCourseStats: protectedProcedure
    .query(async ({ ctx }) => {
      if (ctx.user.role !== "admin" && ctx.user.openId !== process.env.OWNER_OPEN_ID) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }
      const db = await getDb();
      if (!db) return { totalCourses: 0, publishedCourses: 0, draftCourses: 0, totalEnrollments: 0, totalRevenue: 0 };
      
      const { courses, courseEnrollments } = await import("../../drizzle/schema");
      
      const allCourses = await db.select().from(courses);
      const publishedCourses = allCourses.filter(c => c.status === "published");
      const draftCourses = allCourses.filter(c => c.status === "draft");
      
      const [enrollmentCount] = await db.select({ count: sql<number>`count(*)` }).from(courseEnrollments);
      
      // Calculate total revenue from enrollments
      const totalRevenue = allCourses.reduce((sum, course) => {
        return sum + ((course.price || 0) * (course.totalEnrollments || 0));
      }, 0);
      
      return {
        totalCourses: allCourses.length,
        publishedCourses: publishedCourses.length,
        draftCourses: draftCourses.length,
        totalEnrollments: enrollmentCount?.count || 0,
        totalRevenue: totalRevenue / 100, // Convert from cents
      };
    }),

  // Invitations sub-router
  invitations: invitationsRouter,

  // Dashboard data sub-router (enrollments, gamification stats)
  ...adminDashboardDataRouter._def.procedures,
});
