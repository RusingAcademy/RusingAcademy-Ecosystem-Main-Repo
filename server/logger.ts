/**
 * Structured logger built on Pino.
 *
 * Usage:
 *   import { logger } from "../logger";          // root logger
 *   import { createLogger } from "../logger";     // child with module tag
 *
 *   const log = createLogger("stripe");
 *   log.info({ sessionId }, "Checkout created");
 *   log.error({ err }, "Webhook verification failed");
 *
 * In request handlers, attach a correlation ID:
 *   const reqLog = logger.child({ reqId: crypto.randomUUID() });
 */

import pino from "pino";

const isProduction = process.env.NODE_ENV === "production";

export const logger = pino({
  level: process.env.LOG_LEVEL || (isProduction ? "info" : "debug"),
  ...(isProduction
    ? {
        // Structured JSON in production (machine-parseable)
        formatters: {
          level(label: string) {
            return { level: label };
          },
        },
        timestamp: pino.stdTimeFunctions.isoTime,
      }
    : {
        // Pretty-print in development
        transport: {
          target: "pino/file",
          options: { destination: 1 }, // stdout
        },
        timestamp: pino.stdTimeFunctions.isoTime,
      }),
});

/**
 * Create a child logger tagged with a module name.
 * All log entries from this child include `{ module: name }`.
 */
export function createLogger(module: string) {
  return logger.child({ module });
}

export default logger;
