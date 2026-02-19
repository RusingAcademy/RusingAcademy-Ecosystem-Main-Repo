/**
 * Email Automation Router — Phase 8.2
 * Admin CRUD for email sequences + analytics.
 * Protected by EMAIL_AUTOMATION_V1 feature flag.
 */
import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { emailSequences, emailSequenceEnrollments, emailSequenceLogs } from "../../drizzle/schema";
import { eq, desc, sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { featureFlagService } from "../services/featureFlagService";
import { emailAutomationService } from "../services/emailAutomationService";

const stepSchema = z.object({
  id: z.string(),
  type: z.enum(["email", "delay", "condition"]),
  delayDays: z.number().optional(),
  delayHours: z.number().optional(),
  subject: z.string().optional(),
  subjectFr: z.string().optional(),
  body: z.string().optional(),
  bodyFr: z.string().optional(),
  templateId: z.string().optional(),
  condition: z.object({
    field: z.string(),
    operator: z.enum(["equals", "not_equals", "contains", "gt", "lt"]),
    value: z.string(),
  }).optional(),
});

export const emailAutomationRouter = router({
  // List all sequences
  list: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user.role !== "admin" && ctx.user.role !== "owner") {
      throw new TRPCError({ code: "FORBIDDEN" });
    }
    if (!await featureFlagService.isEnabled("EMAIL_AUTOMATION_V1", { role: ctx.user.role })) {
      throw new TRPCError({ code: "FORBIDDEN", message: "Feature not enabled" });
    }
    const db = await getDb();
    if (!db) return [];
    return db.select().from(emailSequences).orderBy(desc(emailSequences.updatedAt));
  }),

  // Get single sequence with analytics
  getById: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin" && ctx.user.role !== "owner") {
        throw new TRPCError({ code: "FORBIDDEN" });
      }
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      const rows = await db.select().from(emailSequences).where(eq(emailSequences.id, input.id));
      if (!rows[0]) throw new TRPCError({ code: "NOT_FOUND" });

      const analytics = await emailAutomationService.getSequenceAnalytics(input.id);

      return {
        ...rows[0],
        steps: typeof rows[0].steps === "string" ? JSON.parse(rows[0].steps) : rows[0].steps,
        settings: typeof rows[0].settings === "string" ? JSON.parse(rows[0].settings as string) : rows[0].settings,
        analytics,
      };
    }),

  // Create sequence
  create: protectedProcedure
    .input(z.object({
      name: z.string().min(1),
      nameFr: z.string().optional(),
      description: z.string().optional(),
      descriptionFr: z.string().optional(),
      trigger: z.enum(["user_signup", "course_purchase", "cart_abandoned", "course_completed", "session_booked", "membership_activated", "manual"]),
      steps: z.array(stepSchema),
      settings: z.object({
        sendTime: z.string().optional(),
        timezone: z.string().optional(),
        skipWeekends: z.boolean().optional(),
        maxEmailsPerDay: z.number().optional(),
        unsubscribeOnComplete: z.boolean().optional(),
      }).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin" && ctx.user.role !== "owner") {
        throw new TRPCError({ code: "FORBIDDEN" });
      }
      if (!await featureFlagService.isEnabled("EMAIL_AUTOMATION_V1", { role: ctx.user.role })) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Feature not enabled" });
      }
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      const result = await db.insert(emailSequences).values({
        name: input.name,
        nameFr: input.nameFr || null,
        description: input.description || null,
        descriptionFr: input.descriptionFr || null,
        trigger: input.trigger,
        status: "draft",
        steps: JSON.stringify(input.steps),
        settings: input.settings ? JSON.stringify(input.settings) : null,
        createdBy: ctx.user.id,
      });

      return { id: (result as any)[0]?.insertId || (result as any).insertId };
    }),

  // Update sequence
  update: protectedProcedure
    .input(z.object({
      id: z.number(),
      name: z.string().optional(),
      nameFr: z.string().optional(),
      description: z.string().optional(),
      descriptionFr: z.string().optional(),
      trigger: z.enum(["user_signup", "course_purchase", "cart_abandoned", "course_completed", "session_booked", "membership_activated", "manual"]).optional(),
      steps: z.array(stepSchema).optional(),
      settings: z.object({
        sendTime: z.string().optional(),
        timezone: z.string().optional(),
        skipWeekends: z.boolean().optional(),
        maxEmailsPerDay: z.number().optional(),
        unsubscribeOnComplete: z.boolean().optional(),
      }).optional(),
      status: z.enum(["draft", "active", "paused", "archived"]).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin" && ctx.user.role !== "owner") {
        throw new TRPCError({ code: "FORBIDDEN" });
      }
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      const updates: Record<string, any> = {};
      if (input.name !== undefined) updates.name = input.name;
      if (input.nameFr !== undefined) updates.nameFr = input.nameFr;
      if (input.description !== undefined) updates.description = input.description;
      if (input.descriptionFr !== undefined) updates.descriptionFr = input.descriptionFr;
      if (input.trigger !== undefined) updates.trigger = input.trigger;
      if (input.steps !== undefined) updates.steps = JSON.stringify(input.steps);
      if (input.settings !== undefined) updates.settings = JSON.stringify(input.settings);
      if (input.status !== undefined) updates.status = input.status;

      await db.update(emailSequences).set(updates).where(eq(emailSequences.id, input.id));
      return { success: true };
    }),

  // Delete sequence
  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin" && ctx.user.role !== "owner") {
        throw new TRPCError({ code: "FORBIDDEN" });
      }
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      // Delete enrollments and logs first
      await db.delete(emailSequenceLogs).where(eq(emailSequenceLogs.sequenceId, input.id));
      await db.delete(emailSequenceEnrollments).where(eq(emailSequenceEnrollments.sequenceId, input.id));
      await db.delete(emailSequences).where(eq(emailSequences.id, input.id));
      return { success: true };
    }),

  // Get enrollments for a sequence
  enrollments: protectedProcedure
    .input(z.object({ sequenceId: z.number() }))
    .query(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin" && ctx.user.role !== "owner") {
        throw new TRPCError({ code: "FORBIDDEN" });
      }
      const db = await getDb();
      if (!db) return [];
      return db
        .select()
        .from(emailSequenceEnrollments)
        .where(eq(emailSequenceEnrollments.sequenceId, input.sequenceId))
        .orderBy(desc(emailSequenceEnrollments.enrolledAt));
    }),

  // Tracking endpoints
  trackOpen: protectedProcedure
    .input(z.object({ logId: z.number() }))
    .mutation(async ({ input }) => {
      await emailAutomationService.trackOpen(input.logId);
      return { success: true };
    }),

  trackClick: protectedProcedure
    .input(z.object({ logId: z.number() }))
    .mutation(async ({ input }) => {
      await emailAutomationService.trackClick(input.logId);
      return { success: true };
    }),
});
