import { z } from "zod";
import { router, protectedProcedure } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import { eq, desc, or } from "drizzle-orm";
import { createNotification, getDb } from "../db";
import { courseEnrollments, courses, notifications, payoutLedger, sessions, users } from "../../drizzle/schema";

export const adminUsersRouter = router({
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
  
  // Update user role,

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
  
  // Export users to CSV,

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
  
  // Bulk update user roles,

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
  
  // Bulk send notification to users,

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
  
  // Get user activity history,

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
  
  // Get all courses for admin management (including drafts),
});
