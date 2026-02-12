import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import { eq, desc, sql, asc, and } from "drizzle-orm";
import {
  getDb,
} from "../db";
import { crmLeadHistory, crmLeadSegments, crmLeadTagAssignments, crmLeadTags, crmSalesGoals, crmSegmentAlertLogs, crmSegmentAlerts, crmTagAutomationRules, crmTeamGoalAssignments, ecosystemLeadActivities, ecosystemLeads, users } from "../../drizzle/schema";

export const crmRouter = router({
  // Google Calendar Sync
  syncMeetingToCalendar: protectedProcedure
    .input(z.object({
      meetingId: z.number(),
      calendarId: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin" && ctx.user.openId !== process.env.OWNER_OPEN_ID) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }
      const { syncMeetingToCalendar } = await import("../google-calendar-sync");
      return syncMeetingToCalendar(input.meetingId, input.calendarId);
    }),

  checkCalendarAvailability: protectedProcedure
    .input(z.object({
      startTime: z.date(),
      endTime: z.date(),
      calendarId: z.string().optional(),
    }))
    .query(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin" && ctx.user.openId !== process.env.OWNER_OPEN_ID) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }
      const { checkAvailability } = await import("../google-calendar-sync");
      return checkAvailability(input.startTime, input.endTime, input.calendarId);
    }),

  getAvailableSlots: protectedProcedure
    .input(z.object({
      date: z.date(),
      durationMinutes: z.number().optional(),
      workingHoursStart: z.number().optional(),
      workingHoursEnd: z.number().optional(),
      calendarId: z.string().optional(),
    }))
    .query(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin" && ctx.user.openId !== process.env.OWNER_OPEN_ID) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }
      const { getAvailableSlots } = await import("../google-calendar-sync");
      return getAvailableSlots(
        input.date,
        input.durationMinutes,
        input.workingHoursStart,
        input.workingHoursEnd,
        input.calendarId
      );
    }),

  getUpcomingCalendarEvents: protectedProcedure
    .input(z.object({
      days: z.number().optional(),
      calendarId: z.string().optional(),
    }))
    .query(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin" && ctx.user.openId !== process.env.OWNER_OPEN_ID) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }
      const { getUpcomingCalendarEvents } = await import("../google-calendar-sync");
      return getUpcomingCalendarEvents(input.days, input.calendarId);
    }),

  syncAllMeetings: protectedProcedure
    .input(z.object({
      calendarId: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin" && ctx.user.openId !== process.env.OWNER_OPEN_ID) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }
      const { syncAllMeetingsToCalendar } = await import("../google-calendar-sync");
      return syncAllMeetingsToCalendar(ctx.user.id, input.calendarId);
    }),

  // Sequence Performance Analytics
  getSequenceMetrics: protectedProcedure
    .input(z.object({ sequenceId: z.number() }))
    .query(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin" && ctx.user.openId !== process.env.OWNER_OPEN_ID) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }
      const { getSequenceMetrics } = await import("../sequence-analytics");
      return getSequenceMetrics(input.sequenceId);
    }),

  getStepMetrics: protectedProcedure
    .input(z.object({ sequenceId: z.number() }))
    .query(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin" && ctx.user.openId !== process.env.OWNER_OPEN_ID) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }
      const { getStepMetrics } = await import("../sequence-analytics");
      return getStepMetrics(input.sequenceId);
    }),

  getSequencePerformanceReport: protectedProcedure
    .input(z.object({ sequenceId: z.number() }))
    .query(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin" && ctx.user.openId !== process.env.OWNER_OPEN_ID) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }
      const { getSequencePerformanceReport } = await import("../sequence-analytics");
      return getSequencePerformanceReport(input.sequenceId);
    }),

  getOverallSequenceAnalytics: protectedProcedure
    .query(async ({ ctx }) => {
      if (ctx.user.role !== "admin" && ctx.user.openId !== process.env.OWNER_OPEN_ID) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }
      const { getOverallSequenceAnalytics } = await import("../sequence-analytics");
      return getOverallSequenceAnalytics();
    }),

  compareSequences: protectedProcedure
    .input(z.object({
      sequenceIdA: z.number(),
      sequenceIdB: z.number(),
    }))
    .query(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin" && ctx.user.openId !== process.env.OWNER_OPEN_ID) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }
      const { compareSequences } = await import("../sequence-analytics");
      return compareSequences(input.sequenceIdA, input.sequenceIdB);
    }),

  recordEmailOpen: protectedProcedure
    .input(z.object({ logId: z.number() }))
    .mutation(async ({ input }) => {
      const { recordEmailOpen } = await import("../sequence-analytics");
      await recordEmailOpen(input.logId);
      return { success: true };
    }),

  recordEmailClick: protectedProcedure
    .input(z.object({ logId: z.number() }))
    .mutation(async ({ input }) => {
      const { recordEmailClick } = await import("../sequence-analytics");
      await recordEmailClick(input.logId);
      return { success: true };
    }),

  // Meeting Outcome Tracking
  recordMeetingOutcome: protectedProcedure
    .input(z.object({
      meetingId: z.number(),
      outcome: z.enum(["qualified", "not_qualified", "needs_follow_up", "converted", "no_show"]),
      qualificationScore: z.number().min(1).max(10).optional(),
      nextSteps: z.string().optional(),
      dealValue: z.number().optional(),
      dealProbability: z.number().min(0).max(100).optional(),
      notes: z.string().optional(),
      followUpDate: z.date().optional(),
      followUpType: z.enum(["call", "email", "meeting"]).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin" && ctx.user.openId !== process.env.OWNER_OPEN_ID) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }
      const { recordMeetingOutcome } = await import("../meeting-outcomes");
      return recordMeetingOutcome(input, ctx.user.id);
    }),

  getOutcomeStats: protectedProcedure
    .input(z.object({
      organizerId: z.number().optional(),
      startDate: z.date().optional(),
      endDate: z.date().optional(),
    }).optional())
    .query(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin" && ctx.user.openId !== process.env.OWNER_OPEN_ID) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }
      const { getOutcomeStats } = await import("../meeting-outcomes");
      return getOutcomeStats(input?.organizerId, input?.startDate, input?.endDate);
    }),

  getPendingOutcomeMeetings: protectedProcedure
    .input(z.object({ organizerId: z.number().optional() }).optional())
    .query(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin" && ctx.user.openId !== process.env.OWNER_OPEN_ID) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }
      const { getPendingOutcomeMeetings } = await import("../meeting-outcomes");
      return getPendingOutcomeMeetings(input?.organizerId);
    }),

  getFollowUpTasks: protectedProcedure
    .input(z.object({
      organizerId: z.number().optional(),
      daysAhead: z.number().optional(),
    }).optional())
    .query(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin" && ctx.user.openId !== process.env.OWNER_OPEN_ID) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }
      const { getFollowUpTasks } = await import("../meeting-outcomes");
      return getFollowUpTasks(input?.organizerId, input?.daysAhead);
    }),

  sendOutcomeReminder: protectedProcedure
    .input(z.object({ meetingId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin" && ctx.user.openId !== process.env.OWNER_OPEN_ID) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }
      const { sendOutcomeReminderEmail } = await import("../meeting-outcomes");
      await sendOutcomeReminderEmail(input.meetingId);
      return { success: true };
    }),

  sendPendingOutcomeReminders: protectedProcedure
    .mutation(async ({ ctx }) => {
      if (ctx.user.role !== "admin" && ctx.user.openId !== process.env.OWNER_OPEN_ID) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }
      const { sendPendingOutcomeReminders } = await import("../meeting-outcomes");
      const sentCount = await sendPendingOutcomeReminders();
      return { success: true, sentCount };
    }),

  // Lead Scoring Dashboard
  getLeadsWithScores: protectedProcedure
    .input(z.object({
      sortBy: z.enum(["score", "recent", "activity"]).optional(),
      status: z.string().optional(),
      limit: z.number().optional(),
    }))
    .query(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin" && ctx.user.openId !== process.env.OWNER_OPEN_ID) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      
      let leads;
      if (input.status) {
        leads = await db.select().from(ecosystemLeads)
          .where(eq(ecosystemLeads.status, input.status as any))
          .limit(input.limit || 50);
      } else {
        leads = await db.select().from(ecosystemLeads)
          .limit(input.limit || 50);
      }
      
      // Sort based on input
      const sortedLeads = [...leads].sort((a, b) => {
        if (input.sortBy === "recent") {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        if (input.sortBy === "activity") {
          const aContact = a.lastContactedAt ? new Date(a.lastContactedAt).getTime() : 0;
          const bContact = b.lastContactedAt ? new Date(b.lastContactedAt).getTime() : 0;
          return bContact - aContact;
        }
        // Default: sort by score
        return (b.leadScore || 0) - (a.leadScore || 0);
      });
      
      return { leads: sortedLeads };
    }),

  getLeadActivities: protectedProcedure
    .input(z.object({ leadId: z.number() }))
    .query(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin" && ctx.user.openId !== process.env.OWNER_OPEN_ID) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      
      const activities = await db
        .select()
        .from(ecosystemLeadActivities)
        .where(eq(ecosystemLeadActivities.leadId, input.leadId))
        .orderBy(desc(ecosystemLeadActivities.createdAt))
        .limit(20);
      
      return {
        activities: activities.map(a => ({
          id: a.id,
          type: a.activityType,
          description: a.description,
          timestamp: a.createdAt,
          metadata: a.metadata,
        })),
      };
    }),

  getLeadScoringStats: protectedProcedure
    .query(async ({ ctx }) => {
      if (ctx.user.role !== "admin" && ctx.user.openId !== process.env.OWNER_OPEN_ID) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      
      const leads = await db.select({ leadScore: ecosystemLeads.leadScore }).from(ecosystemLeads);
      
      const scores = leads.map(l => l.leadScore || 0);
      const totalScore = scores.reduce((sum, s) => sum + s, 0);
      const averageScore = scores.length > 0 ? totalScore / scores.length : 0;
      
      const hotLeads = scores.filter(s => s >= 80).length;
      const warmLeads = scores.filter(s => s >= 40 && s < 80).length;
      const coldLeads = scores.filter(s => s < 40).length;
      
      return {
        averageScore,
        hotLeads,
        warmLeads,
        coldLeads,
        totalLeads: scores.length,
      };
    }),

  // Update lead status (for pipeline drag-and-drop)
  updateLeadStatus: protectedProcedure
    .input(z.object({
      leadId: z.number(),
      status: z.string(),
      dealValue: z.number().optional(),
      expectedCloseDate: z.date().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin" && ctx.user.openId !== process.env.OWNER_OPEN_ID) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      
      const updateData: Record<string, unknown> = { status: input.status };
      if (input.dealValue !== undefined) updateData.dealValue = input.dealValue;
      if (input.expectedCloseDate !== undefined) updateData.expectedCloseDate = input.expectedCloseDate;
      
      // Update converted timestamp if moving to converted status
      if (input.status === "converted") {
        updateData.convertedAt = new Date();
      }
      
      await db
        .update(ecosystemLeads)
        .set(updateData)
        .where(eq(ecosystemLeads.id, input.leadId));
      
      // Log the activity
      await db.insert(ecosystemLeadActivities).values({
        leadId: input.leadId,
        activityType: "status_changed",
        description: `Status changed to ${input.status}`,
        metadata: JSON.stringify({ newStatus: input.status }),
      });
      
      return { success: true };
    }),

  // Email Templates CRUD
  getEmailTemplates: protectedProcedure
    .input(z.object({
      category: z.string().optional(),
      language: z.string().optional(),
    }))
    .query(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin" && ctx.user.openId !== process.env.OWNER_OPEN_ID) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      
      const { crmEmailTemplates } = await import("../../drizzle/schema");
      let templates = await db.select().from(crmEmailTemplates);
      
      if (input.category) {
        templates = templates.filter(t => t.category === input.category);
      }
      if (input.language) {
        templates = templates.filter(t => t.language === input.language || t.language === "both");
      }
      
      return { templates };
    }),

  createEmailTemplate: protectedProcedure
    .input(z.object({
      name: z.string(),
      subject: z.string(),
      body: z.string(),
      category: z.enum(["welcome", "follow_up", "proposal", "nurture", "conversion", "custom"]),
      language: z.enum(["en", "fr", "both"]),
    }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin" && ctx.user.openId !== process.env.OWNER_OPEN_ID) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      
      const { crmEmailTemplates } = await import("../../drizzle/schema");
      
      // Extract variables from body
      const variableMatches = input.body.match(/\{\{(\w+)\}\}/g) || [];
      const variables = variableMatches.map(v => v.replace(/\{\{|\}\}/g, ""));
      
      const result = await db.insert(crmEmailTemplates).values({
        name: input.name,
        subject: input.subject,
        body: input.body,
        category: input.category,
        language: input.language,
        variables,
        createdBy: ctx.user.id,
      });
      
      return { success: true, id: result[0].insertId };
    }),

  updateEmailTemplate: protectedProcedure
    .input(z.object({
      id: z.number(),
      name: z.string().optional(),
      subject: z.string().optional(),
      body: z.string().optional(),
      category: z.enum(["welcome", "follow_up", "proposal", "nurture", "conversion", "custom"]).optional(),
      language: z.enum(["en", "fr", "both"]).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin" && ctx.user.openId !== process.env.OWNER_OPEN_ID) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      
      const { crmEmailTemplates } = await import("../../drizzle/schema");
      
      const updateData: Record<string, unknown> = {};
      if (input.name) updateData.name = input.name;
      if (input.subject) updateData.subject = input.subject;
      if (input.body) {
        updateData.body = input.body;
        const variableMatches = input.body.match(/\{\{(\w+)\}\}/g) || [];
        updateData.variables = variableMatches.map(v => v.replace(/\{\{|\}\}/g, ""));
      }
      if (input.category) updateData.category = input.category;
      if (input.language) updateData.language = input.language;
      
      await db.update(crmEmailTemplates)
        .set(updateData)
        .where(eq(crmEmailTemplates.id, input.id));
      
      return { success: true };
    }),

  deleteEmailTemplate: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin" && ctx.user.openId !== process.env.OWNER_OPEN_ID) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      
      const { crmEmailTemplates } = await import("../../drizzle/schema");
      
      await db.delete(crmEmailTemplates).where(eq(crmEmailTemplates.id, input.id));
      
      return { success: true };
    }),

  // Pipeline Notifications
  getPipelineNotifications: protectedProcedure
    .input(z.object({
      unreadOnly: z.boolean().optional(),
      limit: z.number().optional(),
    }))
    .query(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin" && ctx.user.openId !== process.env.OWNER_OPEN_ID) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      
      const { crmPipelineNotifications } = await import("../../drizzle/schema");
      
      let notifications;
      if (input.unreadOnly) {
        notifications = await db.select().from(crmPipelineNotifications)
          .where(eq(crmPipelineNotifications.isRead, false))
          .orderBy(desc(crmPipelineNotifications.createdAt))
          .limit(input.limit || 50);
      } else {
        notifications = await db.select().from(crmPipelineNotifications)
          .orderBy(desc(crmPipelineNotifications.createdAt))
          .limit(input.limit || 50);
      }
      
      return { notifications };
    }),

  markNotificationRead: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin" && ctx.user.openId !== process.env.OWNER_OPEN_ID) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      
      const { crmPipelineNotifications } = await import("../../drizzle/schema");
      
      await db.update(crmPipelineNotifications)
        .set({ isRead: true, readAt: new Date() })
        .where(eq(crmPipelineNotifications.id, input.id));
      
      return { success: true };
    }),

  markAllNotificationsRead: protectedProcedure
    .mutation(async ({ ctx }) => {
      if (ctx.user.role !== "admin" && ctx.user.openId !== process.env.OWNER_OPEN_ID) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      
      const { crmPipelineNotifications } = await import("../../drizzle/schema");
      
      await db.update(crmPipelineNotifications)
        .set({ isRead: true, readAt: new Date() })
        .where(eq(crmPipelineNotifications.isRead, false));
      
      return { success: true };
    }),

  // Lead Tags CRUD
  getTags: protectedProcedure
    .query(async ({ ctx }) => {
      if (ctx.user.role !== "admin" && ctx.user.openId !== process.env.OWNER_OPEN_ID) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      
      const tags = await db.select().from(crmLeadTags).orderBy(asc(crmLeadTags.name));
      return { tags };
    }),

  createTag: protectedProcedure
    .input(z.object({
      name: z.string().min(1).max(50),
      color: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
      description: z.string().max(255).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin" && ctx.user.openId !== process.env.OWNER_OPEN_ID) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      
      const result = await db.insert(crmLeadTags).values({
        name: input.name,
        color: input.color,
        description: input.description,
      }).$returningId();
      
      return { id: result[0].id };
    }),

  updateTag: protectedProcedure
    .input(z.object({
      id: z.number(),
      name: z.string().min(1).max(50).optional(),
      color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
      description: z.string().max(255).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin" && ctx.user.openId !== process.env.OWNER_OPEN_ID) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      
      const updateData: Record<string, unknown> = { updatedAt: new Date() };
      if (input.name) updateData.name = input.name;
      if (input.color) updateData.color = input.color;
      if (input.description !== undefined) updateData.description = input.description;
      
      await db.update(crmLeadTags)
        .set(updateData)
        .where(eq(crmLeadTags.id, input.id));
      
      return { success: true };
    }),

  deleteTag: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin" && ctx.user.openId !== process.env.OWNER_OPEN_ID) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      
      // First delete all assignments for this tag
      await db.delete(crmLeadTagAssignments)
        .where(eq(crmLeadTagAssignments.tagId, input.id));
      
      // Then delete the tag
      await db.delete(crmLeadTags)
        .where(eq(crmLeadTags.id, input.id));
      
      return { success: true };
    }),

  // Lead Tag Assignments
  getLeadTags: protectedProcedure
    .input(z.object({ leadId: z.number() }))
    .query(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin" && ctx.user.openId !== process.env.OWNER_OPEN_ID) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      
      const assignments = await db
        .select({
          id: crmLeadTags.id,
          name: crmLeadTags.name,
          color: crmLeadTags.color,
          assignedAt: crmLeadTagAssignments.assignedAt,
        })
        .from(crmLeadTagAssignments)
        .innerJoin(crmLeadTags, eq(crmLeadTagAssignments.tagId, crmLeadTags.id))
        .where(eq(crmLeadTagAssignments.leadId, input.leadId));
      
      return { tags: assignments };
    }),

  assignTagToLead: protectedProcedure
    .input(z.object({
      leadId: z.number(),
      tagId: z.number(),
    }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin" && ctx.user.openId !== process.env.OWNER_OPEN_ID) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      
      // Check if already assigned
      const existing = await db
        .select()
        .from(crmLeadTagAssignments)
        .where(and(
          eq(crmLeadTagAssignments.leadId, input.leadId),
          eq(crmLeadTagAssignments.tagId, input.tagId)
        ));
      
      if (existing.length > 0) {
        return { success: true, alreadyAssigned: true };
      }
      
      await db.insert(crmLeadTagAssignments).values({
        leadId: input.leadId,
        tagId: input.tagId,
      });
      
      return { success: true, alreadyAssigned: false };
    }),

  removeTagFromLead: protectedProcedure
    .input(z.object({
      leadId: z.number(),
      tagId: z.number(),
    }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin" && ctx.user.openId !== process.env.OWNER_OPEN_ID) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      
      await db.delete(crmLeadTagAssignments)
        .where(and(
          eq(crmLeadTagAssignments.leadId, input.leadId),
          eq(crmLeadTagAssignments.tagId, input.tagId)
        ));
      
      return { success: true };
    }),

  // Tag Automation Rules
  getAutomationRules: protectedProcedure
    .query(async ({ ctx }) => {
      if (ctx.user.role !== "admin" && ctx.user.openId !== process.env.OWNER_OPEN_ID) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      
      const rules = await db
        .select({
          id: crmTagAutomationRules.id,
          name: crmTagAutomationRules.name,
          description: crmTagAutomationRules.description,
          tagId: crmTagAutomationRules.tagId,
          tagName: crmLeadTags.name,
          tagColor: crmLeadTags.color,
          conditionType: crmTagAutomationRules.conditionType,
          conditionValue: crmTagAutomationRules.conditionValue,
          isActive: crmTagAutomationRules.isActive,
          priority: crmTagAutomationRules.priority,
        })
        .from(crmTagAutomationRules)
        .leftJoin(crmLeadTags, eq(crmTagAutomationRules.tagId, crmLeadTags.id))
        .orderBy(asc(crmTagAutomationRules.priority));
      
      return { rules };
    }),

  createAutomationRule: protectedProcedure
    .input(z.object({
      name: z.string().min(1).max(100),
      description: z.string().max(255).optional(),
      tagId: z.number(),
      conditionType: z.string(),
      conditionValue: z.string(),
      priority: z.number().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin" && ctx.user.openId !== process.env.OWNER_OPEN_ID) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      
      const result = await db.insert(crmTagAutomationRules).values({
        name: input.name,
        description: input.description,
        tagId: input.tagId,
        conditionType: input.conditionType,
        conditionValue: input.conditionValue,
        priority: input.priority || 0,
      }).$returningId();
      
      return { id: result[0].id };
    }),

  updateAutomationRule: protectedProcedure
    .input(z.object({
      id: z.number(),
      name: z.string().min(1).max(100).optional(),
      description: z.string().max(255).optional(),
      tagId: z.number().optional(),
      conditionType: z.string().optional(),
      conditionValue: z.string().optional(),
      isActive: z.boolean().optional(),
      priority: z.number().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin" && ctx.user.openId !== process.env.OWNER_OPEN_ID) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      
      const updateData: Record<string, unknown> = { updatedAt: new Date() };
      if (input.name) updateData.name = input.name;
      if (input.description !== undefined) updateData.description = input.description;
      if (input.tagId) updateData.tagId = input.tagId;
      if (input.conditionType) updateData.conditionType = input.conditionType;
      if (input.conditionValue) updateData.conditionValue = input.conditionValue;
      if (input.isActive !== undefined) updateData.isActive = input.isActive;
      if (input.priority !== undefined) updateData.priority = input.priority;
      
      await db.update(crmTagAutomationRules)
        .set(updateData)
        .where(eq(crmTagAutomationRules.id, input.id));
      
      return { success: true };
    }),

  deleteAutomationRule: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin" && ctx.user.openId !== process.env.OWNER_OPEN_ID) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      
      await db.delete(crmTagAutomationRules)
        .where(eq(crmTagAutomationRules.id, input.id));
      
      return { success: true };
    }),

  runAutomationRules: protectedProcedure
    .mutation(async ({ ctx }) => {
      if (ctx.user.role !== "admin" && ctx.user.openId !== process.env.OWNER_OPEN_ID) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }
      
      const { applyAutomationRulesToAllLeads } = await import("../tag-automation");
      const result = await applyAutomationRulesToAllLeads();
      
      return result;
    }),

  importLeads: protectedProcedure
    .input(z.object({
      leads: z.array(z.object({
        firstName: z.string().optional(),
        lastName: z.string().optional(),
        email: z.string().optional(),
        phone: z.string().optional(),
        company: z.string().optional(),
        jobTitle: z.string().optional(),
        source: z.string().optional(),
        leadType: z.string().optional(),
        budget: z.string().optional(),
        notes: z.string().optional(),
      })),
    }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin" && ctx.user.openId !== process.env.OWNER_OPEN_ID) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }

      const db = await getDb();
      if (!db) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      }
      let imported = 0;
      let failed = 0;
      const errors: string[] = [];

      for (const lead of input.leads) {
        try {
          // Validate required fields
          if (!lead.firstName || !lead.lastName || !lead.email) {
            errors.push(`Missing required fields for ${lead.email || 'unknown'}`);
            failed++;
            continue;
          }

          // Check for duplicate email
          const existing = await db.select().from(ecosystemLeads)
            .where(eq(ecosystemLeads.email, lead.email))
            .limit(1);

          if (existing.length > 0) {
            errors.push(`Duplicate email: ${lead.email}`);
            failed++;
            continue;
          }

          // Insert the lead
          await db.insert(ecosystemLeads).values({
            firstName: lead.firstName,
            lastName: lead.lastName,
            email: lead.email,
            phone: lead.phone || null,
            company: lead.company || null,
            jobTitle: lead.jobTitle || null,
            source: (lead.source as any) || 'external',
            formType: 'import',
            leadType: (lead.leadType as any) || 'individual',
            budget: lead.budget || null,
            message: lead.notes || null,
            leadScore: 50,
          });

          imported++;
        } catch (error) {
          errors.push(`Error importing ${lead.email}: ${error instanceof Error ? error.message : 'Unknown error'}`);
          failed++;
        }
      }

      return { imported, failed, errors };
    }),

  // Lead Segments CRUD
  getSegments: protectedProcedure
    .query(async ({ ctx }) => {
      if (ctx.user.role !== "admin" && ctx.user.openId !== process.env.OWNER_OPEN_ID) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      const segments = await db.select().from(crmLeadSegments).orderBy(desc(crmLeadSegments.createdAt));
      return { segments };
    }),

  createSegment: protectedProcedure
    .input(z.object({
      name: z.string(),
      description: z.string().optional(),
      filters: z.array(z.object({
        field: z.string(),
        operator: z.enum(["equals", "not_equals", "greater_than", "less_than", "contains", "in"]),
        value: z.union([z.string(), z.number(), z.array(z.string())]),
      })),
      filterLogic: z.enum(["and", "or"]),
      color: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin" && ctx.user.openId !== process.env.OWNER_OPEN_ID) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
  // @ts-ignore - overload resolution
      }
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      // @ts-expect-error - TS2769: auto-suppressed during TS cleanup
      await db.insert(crmLeadSegments).values({
        name: input.name,
        description: input.description || null,
        filters: input.filters,
        filterLogic: input.filterLogic,
        color: input.color || "#3b82f6",
        createdBy: ctx.user.id,
      });
      return { success: true };
    }),

  updateSegment: protectedProcedure
    .input(z.object({
      id: z.number(),
      name: z.string().optional(),
      description: z.string().optional(),
      filters: z.array(z.object({
        field: z.string(),
        operator: z.enum(["equals", "not_equals", "greater_than", "less_than", "contains", "in"]),
        value: z.union([z.string(), z.number(), z.array(z.string())]),
      })).optional(),
      filterLogic: z.enum(["and", "or"]).optional(),
      color: z.string().optional(),
      isActive: z.boolean().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin" && ctx.user.openId !== process.env.OWNER_OPEN_ID) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      const { id, filters, ...updates } = input;
      const updateData: any = { ...updates };
      if (filters) updateData.filters = filters;
      await db.update(crmLeadSegments).set(updateData).where(eq(crmLeadSegments.id, id));
      return { success: true };
    }),

  deleteSegment: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin" && ctx.user.openId !== process.env.OWNER_OPEN_ID) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      await db.delete(crmLeadSegments).where(eq(crmLeadSegments.id, input.id));
      return { success: true };
    }),

  // Lead History
  getLeadHistory: protectedProcedure
    .input(z.object({ leadId: z.number(), limit: z.number().optional() }))
    .query(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin" && ctx.user.openId !== process.env.OWNER_OPEN_ID) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      const history = await db.select({
        id: crmLeadHistory.id,
        leadId: crmLeadHistory.leadId,
        userId: crmLeadHistory.userId,
        action: crmLeadHistory.action,
        fieldName: crmLeadHistory.fieldName,
        oldValue: crmLeadHistory.oldValue,
        newValue: crmLeadHistory.newValue,
        metadata: crmLeadHistory.metadata,
        createdAt: crmLeadHistory.createdAt,
        userName: users.name,
      })
        .from(crmLeadHistory)
        .leftJoin(users, eq(crmLeadHistory.userId, users.id))
        .where(eq(crmLeadHistory.leadId, input.leadId))
        .orderBy(desc(crmLeadHistory.createdAt))
        .limit(input.limit || 50);
      return { history };
    }),

  addLeadHistory: protectedProcedure
    .input(z.object({
      leadId: z.number(),
      action: z.enum(["created", "updated", "status_changed", "score_changed", "assigned", "tag_added", "tag_removed", "note_added", "email_sent", "meeting_scheduled", "imported", "merged", "deleted"]),
      fieldName: z.string().optional(),
      oldValue: z.string().optional(),
      newValue: z.string().optional(),
      metadata: z.record(z.string(), z.unknown()).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin" && ctx.user.openId !== process.env.OWNER_OPEN_ID) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      await db.insert(crmLeadHistory).values({
        leadId: input.leadId,
        userId: ctx.user.id,
        action: input.action,
        fieldName: input.fieldName || null,
        oldValue: input.oldValue || null,
        newValue: input.newValue || null,
        metadata: input.metadata || null,
      });
      return { success: true };
    }),

  // Segment Alerts CRUD
  getSegmentAlerts: protectedProcedure
    .input(z.object({ segmentId: z.number().optional() }))
    .query(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin" && ctx.user.openId !== process.env.OWNER_OPEN_ID) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      let query = db.select({
        id: crmSegmentAlerts.id,
        segmentId: crmSegmentAlerts.segmentId,
        segmentName: crmLeadSegments.name,
        alertType: crmSegmentAlerts.alertType,
        thresholdValue: crmSegmentAlerts.thresholdValue,
        notifyEmail: crmSegmentAlerts.notifyEmail,
        notifyWebhook: crmSegmentAlerts.notifyWebhook,
        webhookUrl: crmSegmentAlerts.webhookUrl,
        recipients: crmSegmentAlerts.recipients,
        isActive: crmSegmentAlerts.isActive,
        lastTriggeredAt: crmSegmentAlerts.lastTriggeredAt,
        triggerCount: crmSegmentAlerts.triggerCount,
        createdAt: crmSegmentAlerts.createdAt,
      })
        .from(crmSegmentAlerts)
        .leftJoin(crmLeadSegments, eq(crmSegmentAlerts.segmentId, crmLeadSegments.id));
      
      if (input.segmentId) {
        query = query.where(eq(crmSegmentAlerts.segmentId, input.segmentId)) as typeof query;
      }
      
      const alerts = await query.orderBy(desc(crmSegmentAlerts.createdAt));
      return { alerts };
    }),

  createSegmentAlert: protectedProcedure
    .input(z.object({
      segmentId: z.number(),
      alertType: z.enum(["lead_entered", "lead_exited", "threshold_reached"]),
      thresholdValue: z.number().optional(),
      notifyEmail: z.boolean().optional(),
      notifyWebhook: z.boolean().optional(),
      webhookUrl: z.string().optional(),
      recipients: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin" && ctx.user.openId !== process.env.OWNER_OPEN_ID) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      await db.insert(crmSegmentAlerts).values({
        segmentId: input.segmentId,
        alertType: input.alertType,
        thresholdValue: input.thresholdValue || null,
        notifyEmail: input.notifyEmail ?? true,
        notifyWebhook: input.notifyWebhook ?? false,
        webhookUrl: input.webhookUrl || null,
        recipients: input.recipients || "owner",
      });
      return { success: true };
    }),

  updateSegmentAlert: protectedProcedure
    .input(z.object({
      id: z.number(),
      alertType: z.enum(["lead_entered", "lead_exited", "threshold_reached"]).optional(),
      thresholdValue: z.number().optional(),
      notifyEmail: z.boolean().optional(),
      notifyWebhook: z.boolean().optional(),
      webhookUrl: z.string().optional(),
      recipients: z.string().optional(),
      isActive: z.boolean().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin" && ctx.user.openId !== process.env.OWNER_OPEN_ID) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      const { id, ...updates } = input;
      await db.update(crmSegmentAlerts).set(updates).where(eq(crmSegmentAlerts.id, id));
      return { success: true };
    }),

  deleteSegmentAlert: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin" && ctx.user.openId !== process.env.OWNER_OPEN_ID) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      await db.delete(crmSegmentAlerts).where(eq(crmSegmentAlerts.id, input.id));
      return { success: true };
    }),

  getSegmentAlertLogs: protectedProcedure
    .input(z.object({ segmentId: z.number().optional(), alertId: z.number().optional(), limit: z.number().optional() }))
    .query(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin" && ctx.user.openId !== process.env.OWNER_OPEN_ID) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      let conditions = [];
      if (input.segmentId) conditions.push(eq(crmSegmentAlertLogs.segmentId, input.segmentId));
      if (input.alertId) conditions.push(eq(crmSegmentAlertLogs.alertId, input.alertId));
      
      const logs = await db.select({
        id: crmSegmentAlertLogs.id,
        alertId: crmSegmentAlertLogs.alertId,
        segmentId: crmSegmentAlertLogs.segmentId,
        leadId: crmSegmentAlertLogs.leadId,
        eventType: crmSegmentAlertLogs.eventType,
        message: crmSegmentAlertLogs.message,
        notificationSent: crmSegmentAlertLogs.notificationSent,
        createdAt: crmSegmentAlertLogs.createdAt,
        leadName: sql<string>`CONCAT(${ecosystemLeads.firstName}, ' ', ${ecosystemLeads.lastName})`,
        leadEmail: ecosystemLeads.email,
      })
        .from(crmSegmentAlertLogs)
        .leftJoin(ecosystemLeads, eq(crmSegmentAlertLogs.leadId, ecosystemLeads.id))
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .orderBy(desc(crmSegmentAlertLogs.createdAt))
        .limit(input.limit || 100);
      return { logs };
    }),

  // Lead Merge
  mergeLeads: protectedProcedure
    .input(z.object({
      primaryLeadId: z.number(),
      secondaryLeadIds: z.array(z.number()),
      mergedData: z.record(z.string(), z.unknown()),
    }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin" && ctx.user.openId !== process.env.OWNER_OPEN_ID) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      // Update primary lead with merged data
      const updateData: Record<string, any> = {};
      if (input.mergedData.company) updateData.company = input.mergedData.company;
      if (input.mergedData.phone) updateData.phone = input.mergedData.phone;
      if (input.mergedData.jobTitle) updateData.jobTitle = input.mergedData.jobTitle;
      if (input.mergedData.budget) updateData.budget = input.mergedData.budget;
      if (input.mergedData.leadScore) updateData.leadScore = input.mergedData.leadScore;
      if (input.mergedData.notes) updateData.notes = input.mergedData.notes;

      // Wrap entire merge operation in a transaction for data consistency
      await db.transaction(async (tx) => {
        if (Object.keys(updateData).length > 0) {
          await tx.update(ecosystemLeads).set(updateData).where(eq(ecosystemLeads.id, input.primaryLeadId));
        }

        // Transfer activities from secondary leads to primary
        for (const secondaryId of input.secondaryLeadIds) {
          await tx.update(ecosystemLeadActivities)
            .set({ leadId: input.primaryLeadId })
            .where(eq(ecosystemLeadActivities.leadId, secondaryId));

          // Transfer history
          await tx.update(crmLeadHistory)
            .set({ leadId: input.primaryLeadId })
            .where(eq(crmLeadHistory.leadId, secondaryId));

          // Transfer tag assignments
          await tx.update(crmLeadTagAssignments)
            .set({ leadId: input.primaryLeadId })
            .where(eq(crmLeadTagAssignments.leadId, secondaryId));
        }

        // Log the merge
        await tx.insert(crmLeadHistory).values({
          leadId: input.primaryLeadId,
          userId: ctx.user.id,
          action: "merged",
          metadata: { mergedLeadIds: input.secondaryLeadIds },
        });

        // Delete secondary leads
        for (const secondaryId of input.secondaryLeadIds) {
          await tx.delete(ecosystemLeads).where(eq(ecosystemLeads.id, secondaryId));
        }
      });

      return { success: true, primaryLeadId: input.primaryLeadId };
    }),

  // Sales Goals
  getSalesGoals: protectedProcedure
    .query(async ({ ctx }) => {
      if (ctx.user.role !== "admin" && ctx.user.openId !== process.env.OWNER_OPEN_ID) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      const goals = await db
        .select()
        .from(crmSalesGoals)
        .orderBy(desc(crmSalesGoals.createdAt));
      return { goals };
    }),

  createSalesGoal: protectedProcedure
    .input(z.object({
      name: z.string(),
      description: z.string().optional(),
      goalType: z.enum(["revenue", "deals", "leads", "meetings", "conversions"]),
      targetValue: z.number(),
      period: z.enum(["weekly", "monthly", "quarterly", "yearly"]),
      startDate: z.date(),
      endDate: z.date(),
      assignedTo: z.number().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin" && ctx.user.openId !== process.env.OWNER_OPEN_ID) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      const [result] = await db.insert(crmSalesGoals).values({
        name: input.name,
        description: input.description,
        goalType: input.goalType,
        targetValue: input.targetValue,
        currentValue: 0,
        period: input.period,
        startDate: input.startDate,
        endDate: input.endDate,
        assignedTo: input.assignedTo,
        createdBy: ctx.user.id,
      }).$returningId();
      return { id: result.id };
    }),

  updateSalesGoal: protectedProcedure
    .input(z.object({
      id: z.number(),
      name: z.string().optional(),
      description: z.string().optional(),
      targetValue: z.number().optional(),
      currentValue: z.number().optional(),
      startDate: z.date().optional(),
      endDate: z.date().optional(),
      status: z.enum(["active", "completed", "missed", "cancelled"]).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin" && ctx.user.openId !== process.env.OWNER_OPEN_ID) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      const updateData: Record<string, any> = {};
      if (input.name) updateData.name = input.name;
      if (input.description !== undefined) updateData.description = input.description;
      if (input.targetValue !== undefined) updateData.targetValue = input.targetValue;
      if (input.currentValue !== undefined) updateData.currentValue = input.currentValue;
      if (input.startDate) updateData.startDate = input.startDate;
      if (input.endDate) updateData.endDate = input.endDate;
      if (input.status) updateData.status = input.status;

      await db.update(crmSalesGoals).set(updateData).where(eq(crmSalesGoals.id, input.id));
      return { success: true };
    }),

  deleteSalesGoal: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin" && ctx.user.openId !== process.env.OWNER_OPEN_ID) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      await db.delete(crmSalesGoals).where(eq(crmSalesGoals.id, input.id));
      return { success: true };
    }),

  updateSalesGoalProgress: protectedProcedure
    .input(z.object({
      id: z.number(),
      currentValue: z.number(),
    }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin" && ctx.user.openId !== process.env.OWNER_OPEN_ID) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      // Get the goal to check if it's completed
      const [goal] = await db.select().from(crmSalesGoals).where(eq(crmSalesGoals.id, input.id));
      if (!goal) throw new TRPCError({ code: "NOT_FOUND" });

      const updateData: Record<string, any> = { currentValue: input.currentValue };
      
      // Auto-complete if target reached
      if (input.currentValue >= goal.targetValue && goal.status === "active") {
        updateData.status = "completed";
      }

      await db.update(crmSalesGoals).set(updateData).where(eq(crmSalesGoals.id, input.id));
      return { success: true, completed: input.currentValue >= goal.targetValue };
    }),

  // Assign team member to goal
  assignTeamGoalMember: protectedProcedure
    .input(z.object({
      goalId: z.number(),
      userId: z.number(),
      individualTarget: z.number(),
    }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin" && ctx.user.openId !== process.env.OWNER_OPEN_ID) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      await db.insert(crmTeamGoalAssignments).values({
        goalId: input.goalId,
        userId: input.userId,
        individualTarget: input.individualTarget,
        currentProgress: 0,
      });
      return { success: true };
    }),

  // Get team goal assignments
  getTeamGoalAssignments: protectedProcedure
    .input(z.object({ goalId: z.number() }))
    .query(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin" && ctx.user.openId !== process.env.OWNER_OPEN_ID) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      const assignments = await db.select()
        .from(crmTeamGoalAssignments)
        .where(eq(crmTeamGoalAssignments.goalId, input.goalId))
        .orderBy(desc(crmTeamGoalAssignments.currentProgress));
      return assignments;
    }),

  // Update team member progress
  updateTeamMemberProgress: protectedProcedure
    .input(z.object({
      assignmentId: z.number(),
      progress: z.number(),
    }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin" && ctx.user.openId !== process.env.OWNER_OPEN_ID) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      await db.update(crmTeamGoalAssignments)
        .set({ currentProgress: input.progress })
        .where(eq(crmTeamGoalAssignments.id, input.assignmentId));
       return { success: true };
    }),
});
