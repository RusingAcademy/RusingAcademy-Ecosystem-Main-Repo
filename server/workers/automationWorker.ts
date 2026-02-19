// server/workers/automationWorker.ts — Phase 11.1: BullMQ Automation Worker
// Background worker that processes automation jobs from the queue.
// Requires REDIS_URL environment variable to be set.
// Falls back to in-process execution when Redis is unavailable.

import { createLogger } from "../logger";
import { automationExecutor, AutomationTriggerPayload } from "../services/automationExecutor";

const log = createLogger("workers-automation");

// ═══ Queue Interface (BullMQ when Redis available, in-memory fallback) ═══

interface AutomationQueue {
  add(name: string, data: AutomationTriggerPayload, opts?: any): Promise<void>;
  close(): Promise<void>;
}

let queue: AutomationQueue | null = null;
let worker: any = null;

/**
 * Initialize the automation queue.
 * Uses BullMQ with Redis if REDIS_URL is set, otherwise uses in-process execution.
 */
export async function initAutomationWorker(): Promise<void> {
  const redisUrl = process.env.REDIS_URL;

  if (redisUrl) {
    try {
      // Dynamic import to avoid requiring bullmq when Redis is not configured
      const { Queue, Worker } = await import("bullmq");
      const { default: IORedis } = await import("ioredis");

      const connection = new IORedis(redisUrl, {
        maxRetriesPerRequest: null,
        enableReadyCheck: false,
        lazyConnect: true,
      });

      await connection.connect();
      log.info("Connected to Redis for automation queue");

      // Create the queue
      queue = new Queue("automations", { connection }) as any;

      // Create the worker
      worker = new Worker(
        "automations",
        async (job) => {
          const payload = job.data as AutomationTriggerPayload;
          log.info(`Processing automation job: ${job.id}`, { trigger: payload.trigger, userId: payload.userId });

          const results = await automationExecutor.execute(payload);

          const failures = results.filter((r) => r.status === "error");
          if (failures.length > 0) {
            log.warn(`Automation job ${job.id} had ${failures.length} failure(s)`, { failures });
          }

          return results;
        },
        {
          connection,
          concurrency: 5,
          removeOnComplete: { count: 1000 },
          removeOnFail: { count: 500 },
        }
      );

      worker.on("completed", (job: any) => {
        log.debug(`Automation job ${job.id} completed`);
      });

      worker.on("failed", (job: any, err: Error) => {
        log.error(`Automation job ${job?.id} failed: ${err.message}`);
      });

      log.info("BullMQ automation worker initialized");
    } catch (error: any) {
      log.warn(`Failed to initialize BullMQ: ${error.message}. Falling back to in-process execution.`);
      queue = createInProcessQueue();
    }
  } else {
    log.info("REDIS_URL not set — using in-process automation execution");
    queue = createInProcessQueue();
  }
}

/**
 * Create an in-memory queue that executes automations directly.
 * Used when Redis is not available (development, staging without Redis).
 */
function createInProcessQueue(): AutomationQueue {
  return {
    async add(_name: string, data: AutomationTriggerPayload) {
      // Execute immediately in-process
      setImmediate(async () => {
        try {
          await automationExecutor.execute(data);
        } catch (error: any) {
          log.error(`In-process automation execution failed: ${error.message}`);
        }
      });
    },
    async close() {
      // No-op for in-process queue
    },
  };
}

/**
 * Enqueue an automation trigger for background processing.
 * This is the main API for other services to trigger automations.
 */
export async function enqueueAutomation(payload: AutomationTriggerPayload): Promise<void> {
  if (!queue) {
    log.warn("Automation queue not initialized — executing in-process");
    await automationExecutor.execute(payload);
    return;
  }

  await queue.add(`trigger:${payload.trigger}`, payload, {
    attempts: 3,
    backoff: { type: "exponential", delay: 5000 },
    removeOnComplete: true,
  });

  log.debug(`Enqueued automation: trigger=${payload.trigger}, userId=${payload.userId}`);
}

/**
 * Gracefully shut down the worker and queue.
 */
export async function shutdownAutomationWorker(): Promise<void> {
  if (worker) {
    await worker.close();
    log.info("Automation worker shut down");
  }
  if (queue) {
    await queue.close();
    log.info("Automation queue closed");
  }
}

/**
 * Convenience function to trigger an automation from anywhere in the codebase.
 */
export function triggerAutomation(trigger: AutomationTriggerPayload["trigger"], userId: number, data?: Record<string, any>): void {
  enqueueAutomation({ trigger, userId, data }).catch((err) => {
    log.error(`Failed to enqueue automation: ${err.message}`);
  });
}
