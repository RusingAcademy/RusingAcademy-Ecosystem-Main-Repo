/**
 * Email Automation Service — Phase 8.2
 * Handles sequence enrollment, step execution, and analytics.
 */
import { getDb } from "../db";
import { emailSequences, emailSequenceEnrollments, emailSequenceLogs } from "../../drizzle/schema";
import { eq, and, sql, desc } from "drizzle-orm";
import { featureFlagService } from "./featureFlagService";
import { createLogger } from "../logger";
const logger = createLogger("emailAutomation");

export const emailAutomationService = {
  /**
   * Enroll a user in a sequence triggered by an event.
   */
  async enrollByTrigger(
    triggerType: string,
    userId: number,
    metadata?: Record<string, unknown>
  ): Promise<void> {
    const enabled = await featureFlagService.isEnabled("EMAIL_AUTOMATION_V1", { role: "system" });
    if (!enabled) return;

    const db = await getDb();
    if (!db) return;

    // Find active sequences matching this trigger
    const activeSequences = await db
      .select()
      .from(emailSequences)
      .where(and(
        eq(emailSequences.trigger, triggerType as any),
        eq(emailSequences.status, "active")
      ));

    for (const sequence of activeSequences) {
      // Check if user is already enrolled
      const existing = await db
        .select()
        .from(emailSequenceEnrollments)
        .where(and(
          eq(emailSequenceEnrollments.sequenceId, sequence.id),
          eq(emailSequenceEnrollments.userId, userId),
          eq(emailSequenceEnrollments.status, "active")
        ));

      if (existing.length > 0) continue;

      // Enroll user
      await db.insert(emailSequenceEnrollments).values({
        sequenceId: sequence.id,
        userId,
        currentStep: 0,
        status: "active",
        metadata: metadata ? JSON.stringify(metadata) : null,
      });

      // Increment enrollment count
      await db.execute(
        sql`UPDATE email_sequences SET enrollmentCount = enrollmentCount + 1 WHERE id = ${sequence.id}`
      );

      logger.info({ sequenceId: sequence.id, userId, trigger: triggerType }, "User enrolled in email sequence");
    }
  },

  /**
   * Process pending steps for all active enrollments.
   * Called by a cron job or automation engine.
   */
  async processQueue(): Promise<{ processed: number; errors: number }> {
    const db = await getDb();
    if (!db) return { processed: 0, errors: 0 };

    let processed = 0;
    let errors = 0;

    // Get active enrollments that need processing
    const enrollments = await db
      .select()
      .from(emailSequenceEnrollments)
      .where(eq(emailSequenceEnrollments.status, "active"));

    for (const enrollment of enrollments) {
      try {
        const sequence = await db
          .select()
          .from(emailSequences)
          .where(eq(emailSequences.id, enrollment.sequenceId));

        if (!sequence[0]) continue;

        const steps = (typeof sequence[0].steps === "string"
          ? JSON.parse(sequence[0].steps)
          : sequence[0].steps) as any[];

        if (!steps || enrollment.currentStep === null || enrollment.currentStep >= steps.length) {
          // Sequence complete
          await db
            .update(emailSequenceEnrollments)
            .set({ status: "completed", completedAt: new Date() })
            .where(eq(emailSequenceEnrollments.id, enrollment.id));

          await db.execute(
            sql`UPDATE email_sequences SET completionCount = completionCount + 1 WHERE id = ${enrollment.sequenceId}`
          );
          continue;
        }

        const currentStep = steps[enrollment.currentStep];
        if (!currentStep) continue;

        // Check delay
        if (currentStep.type === "delay") {
          const delayMs =
            (currentStep.delayDays || 0) * 86400000 +
            (currentStep.delayHours || 0) * 3600000;
          const lastStepTime = enrollment.lastStepAt
            ? new Date(enrollment.lastStepAt).getTime()
            : new Date(enrollment.enrolledAt!).getTime();

          if (Date.now() - lastStepTime < delayMs) continue; // Not ready yet

          // Advance past delay
          await db
            .update(emailSequenceEnrollments)
            .set({
              currentStep: (enrollment.currentStep || 0) + 1,
              lastStepAt: new Date(),
            })
            .where(eq(emailSequenceEnrollments.id, enrollment.id));
          processed++;
          continue;
        }

        if (currentStep.type === "email") {
          // Log the email send (actual sending delegated to email-service.ts)
          await db.insert(emailSequenceLogs).values({
            sequenceId: enrollment.sequenceId,
            enrollmentId: enrollment.id,
            stepIndex: enrollment.currentStep || 0,
            userId: enrollment.userId,
            emailSubject: currentStep.subject || "Sequence Email",
            status: "sent",
          });

          // Advance to next step
          await db
            .update(emailSequenceEnrollments)
            .set({
              currentStep: (enrollment.currentStep || 0) + 1,
              lastStepAt: new Date(),
            })
            .where(eq(emailSequenceEnrollments.id, enrollment.id));
          processed++;
        }
      } catch (err) {
        errors++;
        logger.error({ enrollmentId: enrollment.id, error: err }, "Error processing email sequence step");
      }
    }

    return { processed, errors };
  },

  /**
   * Get analytics for a sequence.
   */
  async getSequenceAnalytics(sequenceId: number) {
    const db = await getDb();
    if (!db) return null;

    const [logs] = await db.execute(sql`
      SELECT 
        COUNT(*) as totalSent,
        SUM(CASE WHEN status = 'opened' OR status = 'clicked' THEN 1 ELSE 0 END) as totalOpened,
        SUM(CASE WHEN status = 'clicked' THEN 1 ELSE 0 END) as totalClicked,
        SUM(CASE WHEN status = 'bounced' THEN 1 ELSE 0 END) as totalBounced
      FROM email_sequence_logs
      WHERE sequenceId = ${sequenceId}
    `);

    const rows = Array.isArray(logs) ? logs : [];
    const stats = rows[0] as any || {};

    const totalSent = Number(stats.totalSent) || 0;
    return {
      totalSent,
      totalOpened: Number(stats.totalOpened) || 0,
      totalClicked: Number(stats.totalClicked) || 0,
      totalBounced: Number(stats.totalBounced) || 0,
      openRate: totalSent > 0 ? ((Number(stats.totalOpened) || 0) / totalSent * 100).toFixed(1) : "0.0",
      clickRate: totalSent > 0 ? ((Number(stats.totalClicked) || 0) / totalSent * 100).toFixed(1) : "0.0",
    };
  },

  /**
   * Track an email open event (called via tracking pixel).
   */
  async trackOpen(logId: number): Promise<void> {
    const db = await getDb();
    if (!db) return;
    await db
      .update(emailSequenceLogs)
      .set({ status: "opened", openedAt: new Date() })
      .where(and(eq(emailSequenceLogs.id, logId), eq(emailSequenceLogs.status, "sent")));
  },

  /**
   * Track an email click event.
   */
  async trackClick(logId: number): Promise<void> {
    const db = await getDb();
    if (!db) return;
    await db
      .update(emailSequenceLogs)
      .set({ status: "clicked", clickedAt: new Date() })
      .where(eq(emailSequenceLogs.id, logId));
  },
};
