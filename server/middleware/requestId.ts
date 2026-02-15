/**
 * Request Correlation ID Middleware
 *
 * Generates a unique requestId for every incoming HTTP request and attaches
 * it to both the request object and the response headers. A child Pino
 * logger tagged with the requestId is also attached for downstream use.
 *
 * Usage in route handlers:
 *   req.log.info("Processing payment");        // auto-includes requestId
 *   res.getHeader("X-Request-Id");              // correlation header
 *
 * The middleware respects an incoming X-Request-Id header (e.g. from a
 * reverse proxy or load balancer) so traces can span multiple services.
 */

import { randomUUID } from "crypto";
import type { Request, Response, NextFunction } from "express";
import { logger } from "../logger";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      /** Pino child logger with requestId context */
      log: ReturnType<typeof logger.child>;
      /** Unique correlation ID for this request */
      requestId: string;
    }
  }
}

export function requestIdMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const requestId =
    (req.headers["x-request-id"] as string | undefined) || randomUUID();

  // Attach to request for downstream access
  req.requestId = requestId;

  // Create a child logger with the correlation ID
  req.log = logger.child({
    requestId,
    method: req.method,
    url: req.originalUrl || req.url,
  });

  // Echo the correlation ID back in the response
  res.setHeader("X-Request-Id", requestId);

  // Log request start
  req.log.info("Request started");

  // Log request completion
  const startTime = Date.now();
  const originalEnd = res.end;

  res.end = function (...args: Parameters<typeof originalEnd>) {
    const duration = Date.now() - startTime;
    req.log.info(
      { statusCode: res.statusCode, durationMs: duration },
      "Request completed",
    );
    return originalEnd.apply(res, args);
  } as typeof originalEnd;

  next();
}
