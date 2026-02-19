import { z } from "zod";
import { router, adminProcedure } from "../_core/trpc";
import { getDb } from "../db";
import { automations, automationLogs } from "../../drizzle/automation-engine-schema";
import { eq, desc, and } from "drizzle-orm";
import { featureFlagService } from "../services/featureFlagService";

export const automationEngineRouter = router({
  // List all automations
  list: adminProcedure.query(async () => {
    const enabled = await featureFlagService.isEnabled("AUTOMATION_ENGINE_ENABLED");
    if (!enabled) return [];
    const db = await getDb();
    return db.select().from(automations).orderBy(desc(automations.createdAt)).limit(100);
  }),

  // Get automation by ID with recent logs
  getById: adminProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      const [automation] = await db.select().from(automations).where(eq(automations.id, input.id)).limit(1);
      if (!automation) throw new Error("Automation not found");
      const logs = await db.select().from(automationLogs)
        .where(eq(automationLogs.automationId, input.id))
        .orderBy(desc(automationLogs.executedAt))
        .limit(50);
      return { ...automation, logs };
    }),

  // Create automation
  create: adminProcedure
    .input(z.object({
      name: z.string().min(1).max(255),
      description: z.string().optional(),
      triggerType: z.enum(["user_signup", "course_enrolled", "course_completed", "lesson_completed", "session_booked", "session_completed", "payment_received", "membership_activated", "membership_cancelled", "tag_added", "inactivity", "scheduled"]),
      triggerConfig: z.any().optional(),
      actionType: z.enum(["send_email", "send_notification", "add_tag", "remove_tag", "enroll_course", "assign_coach", "update_field", "webhook", "delay"]),
      actionConfig: z.any().optional(),
      isActive: z.boolean().default(false),
      priority: z.number().default(0),
    }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      const result = await db.insert(automations).values({
        ...input,
        createdBy: (ctx as any).userId || 0,
      });
      return { id: result[0].insertId, success: true };
    }),

  // Update automation
  update: adminProcedure
    .input(z.object({
      id: z.number(),
      name: z.string().optional(),
      description: z.string().optional(),
      triggerConfig: z.any().optional(),
      actionConfig: z.any().optional(),
      isActive: z.boolean().optional(),
      priority: z.number().optional(),
    }))
    .mutation(async ({ input }) => {
      const { id, ...updates } = input;
      const db = await getDb();
      await db.update(automations).set(updates).where(eq(automations.id, id));
      return { success: true };
    }),

  // Toggle automation active/inactive
  toggle: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      const [automation] = await db.select().from(automations).where(eq(automations.id, input.id)).limit(1);
      if (!automation) throw new Error("Automation not found");
      await db.update(automations).set({ isActive: !automation.isActive }).where(eq(automations.id, input.id));
      return { success: true, isActive: !automation.isActive };
    }),

  // Delete automation
  delete: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      await db.delete(automationLogs).where(eq(automationLogs.automationId, input.id));
      await db.delete(automations).where(eq(automations.id, input.id));
      return { success: true };
    }),

  // Get automation logs
  getLogs: adminProcedure
    .input(z.object({ automationId: z.number().optional(), limit: z.number().default(50) }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (input.automationId) {
        return db.select().from(automationLogs)
          .where(eq(automationLogs.automationId, input.automationId))
          .orderBy(desc(automationLogs.executedAt))
          .limit(input.limit);
      }
      return db.select().from(automationLogs)
        .orderBy(desc(automationLogs.executedAt))
        .limit(input.limit);
    }),
});
