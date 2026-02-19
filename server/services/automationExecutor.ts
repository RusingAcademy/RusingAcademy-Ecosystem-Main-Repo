// server/services/automationExecutor.ts — Phase 11.1: Automation Execution Engine
import { getDb } from "../db";
import { automations, automationLogs } from "../../drizzle/automation-engine-schema";
import { eq, and, sql } from "drizzle-orm";
import { featureFlagService } from "./featureFlagService";
import { createLogger } from "../logger";

const log = createLogger("services-automationExecutor");

export type TriggerType =
  | "user_signup"
  | "course_enrolled"
  | "course_completed"
  | "lesson_completed"
  | "session_booked"
  | "session_completed"
  | "payment_received"
  | "membership_activated"
  | "membership_cancelled"
  | "tag_added"
  | "inactivity"
  | "scheduled";

export type ActionType =
  | "send_email"
  | "send_notification"
  | "add_tag"
  | "remove_tag"
  | "enroll_course"
  | "assign_coach"
  | "update_field"
  | "webhook"
  | "delay";

export interface AutomationTriggerPayload {
  trigger: TriggerType;
  userId: number;
  data?: Record<string, any>;
}

export interface AutomationResult {
  automationId: number;
  automationName: string;
  status: "success" | "error" | "skipped";
  message?: string;
  executionTimeMs?: number;
}

export class AutomationExecutor {
  /**
   * Execute all matching automations for a given trigger.
   * This is the main entry point called by the worker or directly.
   */
  async execute(payload: AutomationTriggerPayload): Promise<AutomationResult[]> {
    const { trigger, userId, data } = payload;
    const results: AutomationResult[] = [];

    // Check feature flag
    const enabled = await featureFlagService.isEnabled("AUTOMATION_ENGINE_ENABLED");
    if (!enabled) {
      log.info("Automation engine disabled by feature flag");
      return [{ automationId: 0, automationName: "N/A", status: "skipped", message: "Feature flag disabled" }];
    }

    const db = await getDb();

    // Find all active automations matching this trigger
    const matchingAutomations = await db
      .select()
      .from(automations)
      .where(and(eq(automations.triggerType, trigger), eq(automations.isActive, true)));

    if (matchingAutomations.length === 0) {
      log.debug(`No active automations for trigger: ${trigger}`);
      return [];
    }

    log.info(`Found ${matchingAutomations.length} automation(s) for trigger: ${trigger}, userId: ${userId}`);

    // Execute each automation
    for (const automation of matchingAutomations) {
      const startTime = Date.now();
      try {
        // Check trigger config conditions
        if (automation.triggerConfig && !this.matchesTriggerConfig(automation.triggerConfig, data)) {
          results.push({
            automationId: automation.id,
            automationName: automation.name,
            status: "skipped",
            message: "Trigger config conditions not met",
          });
          continue;
        }

        // Execute the action
        await this.executeAction(automation.actionType as ActionType, automation.actionConfig, userId, data);

        const executionTimeMs = Date.now() - startTime;

        // Log success
        await db.insert(automationLogs).values({
          automationId: automation.id,
          triggerType: trigger,
          userId,
          status: "success",
          executionTimeMs,
          metadata: JSON.stringify({ trigger, data }),
        });

        // Update execution count
        await db
          .update(automations)
          .set({ executionCount: sql`${automations.executionCount} + 1`, lastExecutedAt: new Date() })
          .where(eq(automations.id, automation.id));

        results.push({
          automationId: automation.id,
          automationName: automation.name,
          status: "success",
          executionTimeMs,
        });

        log.info(`Automation "${automation.name}" executed successfully in ${executionTimeMs}ms`);
      } catch (error: any) {
        const executionTimeMs = Date.now() - startTime;

        // Log failure
        await db.insert(automationLogs).values({
          automationId: automation.id,
          triggerType: trigger,
          userId,
          status: "error",
          executionTimeMs,
          errorMessage: error.message,
          metadata: JSON.stringify({ trigger, data, error: error.message }),
        });

        results.push({
          automationId: automation.id,
          automationName: automation.name,
          status: "error",
          message: error.message,
          executionTimeMs,
        });

        log.error(`Automation "${automation.name}" failed: ${error.message}`);
      }
    }

    return results;
  }

  /**
   * Check if trigger data matches the automation's trigger config conditions.
   */
  private matchesTriggerConfig(triggerConfig: any, data?: Record<string, any>): boolean {
    if (!triggerConfig) return true;
    if (!data) return true;

    // Parse string configs (from DB JSON columns)
    const config = typeof triggerConfig === "string" ? JSON.parse(triggerConfig) : triggerConfig;
    if (typeof config !== "object" || config === null) return true;

    for (const [key, expectedValue] of Object.entries(config)) {
      if (key === "conditions" && Array.isArray(expectedValue)) {
        // Array of conditions — all must match
        for (const condition of expectedValue as any[]) {
          if (condition.field && condition.value !== undefined) {
            if (data[condition.field] !== condition.value) return false;
          }
        }
      } else {
        // Direct key match
        if (data[key] !== expectedValue) return false;
      }
    }

    return true;
  }

  /**
   * Execute a specific action type.
   */
  private async executeAction(
    actionType: ActionType,
    actionConfig: any,
    userId: number,
    triggerData?: Record<string, any>
  ): Promise<void> {
    const config = typeof actionConfig === "string" ? JSON.parse(actionConfig) : actionConfig || {};

    switch (actionType) {
      case "send_email":
        await this.executeSendEmail(config, userId, triggerData);
        break;
      case "send_notification":
        await this.executeSendNotification(config, userId, triggerData);
        break;
      case "add_tag":
        await this.executeAddTag(config, userId);
        break;
      case "remove_tag":
        await this.executeRemoveTag(config, userId);
        break;
      case "enroll_course":
        await this.executeEnrollCourse(config, userId);
        break;
      case "assign_coach":
        await this.executeAssignCoach(config, userId);
        break;
      case "update_field":
        await this.executeUpdateField(config, userId);
        break;
      case "webhook":
        await this.executeWebhook(config, userId, triggerData);
        break;
      case "delay":
        // Delay is handled by the queue (scheduled job)
        log.info(`Delay action: ${config.delayMinutes || 0} minutes`);
        break;
      default:
        throw new Error(`Unknown action type: ${actionType}`);
    }
  }

  // ═══ Action Implementations ═══

  private async executeSendEmail(config: any, userId: number, triggerData?: Record<string, any>): Promise<void> {
    log.info(`[Action] Send email to user ${userId}`, { template: config.template, subject: config.subject });
    // Integration point: Connect to SendGrid/email service
    // For now, log the action — actual email sending will use the existing email service
    const db = await getDb();
    try {
      await db.execute(
        sql`INSERT INTO automation_logs (automationId, triggerType, userId, status, metadata, executedAt)
            VALUES (0, 'send_email', ${userId}, 'queued', ${JSON.stringify({ ...config, triggerData })}, NOW())`
      );
    } catch {
      // Non-critical logging
    }
  }

  private async executeSendNotification(config: any, userId: number, triggerData?: Record<string, any>): Promise<void> {
    log.info(`[Action] Send notification to user ${userId}`, { title: config.title });
    const db = await getDb();
    try {
      await db.execute(
        sql`INSERT INTO notifications (userId, title, message, type, createdAt)
            VALUES (${userId}, ${config.title || "Notification"}, ${config.message || ""}, ${config.type || "info"}, NOW())`
      );
    } catch (error: any) {
      log.warn(`Failed to insert notification: ${error.message}`);
    }
  }

  private async executeAddTag(config: any, userId: number): Promise<void> {
    const tagName = config.tagName || config.tag;
    if (!tagName) throw new Error("Tag name required for add_tag action");
    log.info(`[Action] Add tag "${tagName}" to user ${userId}`);
    const db = await getDb();
    try {
      // Find or create the tag
      const [existing] = await db.execute(sql`SELECT id FROM learner_tags WHERE name = ${tagName} LIMIT 1`);
      let tagId: number;
      if ((existing as any[]).length > 0) {
        tagId = (existing as any[])[0].id;
      } else {
        const result = await db.execute(
          sql`INSERT INTO learner_tags (name, color, createdAt) VALUES (${tagName}, '#6366f1', NOW())`
        );
        tagId = (result as any)[0].insertId;
      }
      // Assign tag to user
      await db.execute(
        sql`INSERT IGNORE INTO learner_tag_assignments (tagId, learnerId, assignedAt) VALUES (${tagId}, ${userId}, NOW())`
      );
    } catch (error: any) {
      log.warn(`Failed to add tag: ${error.message}`);
    }
  }

  private async executeRemoveTag(config: any, userId: number): Promise<void> {
    const tagName = config.tagName || config.tag;
    if (!tagName) throw new Error("Tag name required for remove_tag action");
    log.info(`[Action] Remove tag "${tagName}" from user ${userId}`);
    const db = await getDb();
    try {
      await db.execute(
        sql`DELETE FROM learner_tag_assignments WHERE learnerId = ${userId} AND tagId IN (SELECT id FROM learner_tags WHERE name = ${tagName})`
      );
    } catch (error: any) {
      log.warn(`Failed to remove tag: ${error.message}`);
    }
  }

  private async executeEnrollCourse(config: any, userId: number): Promise<void> {
    const courseId = config.courseId;
    if (!courseId) throw new Error("Course ID required for enroll_course action");
    log.info(`[Action] Enroll user ${userId} in course ${courseId}`);
    // Integration point: Use existing enrollment service
  }

  private async executeAssignCoach(config: any, userId: number): Promise<void> {
    const coachId = config.coachId;
    if (!coachId) throw new Error("Coach ID required for assign_coach action");
    log.info(`[Action] Assign coach ${coachId} to user ${userId}`);
    // Integration point: Use existing coaching assignment service
  }

  private async executeUpdateField(config: any, userId: number): Promise<void> {
    log.info(`[Action] Update field for user ${userId}`, { field: config.field, value: config.value });
    // Integration point: Update user profile fields
  }

  private async executeWebhook(config: any, userId: number, triggerData?: Record<string, any>): Promise<void> {
    const url = config.url;
    if (!url) throw new Error("URL required for webhook action");
    log.info(`[Action] Webhook to ${url} for user ${userId}`);
    try {
      const { default: axios } = await import("axios");
      await axios.post(url, {
        userId,
        trigger: triggerData,
        timestamp: new Date().toISOString(),
      }, {
        timeout: 10000,
        headers: config.headers || {},
      });
    } catch (error: any) {
      throw new Error(`Webhook failed: ${error.message}`);
    }
  }
}

// Singleton
export const automationExecutor = new AutomationExecutor();
