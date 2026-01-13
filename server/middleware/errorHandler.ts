/**
 * Global Error Handler Middleware
 * 
 * Provides centralized error handling for the Express application.
 * Features:
 * - Structured error responses
 * - Error logging with context
 * - Different handling for development vs production
 * - PIPEDA-compliant error messages (no PII in responses)
 */

import { Request, Response, NextFunction } from 'express';

// ============================================================================
// Error Types
// ============================================================================

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly isOperational: boolean;
  public readonly context?: Record<string, unknown>;

  constructor(
    message: string,
    statusCode: number = 500,
    code: string = 'INTERNAL_ERROR',
    isOperational: boolean = true,
    context?: Record<string, unknown>
  ) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = isOperational;
    this.context = context;
    
    // Capture stack trace
    Error.captureStackTrace(this, this.constructor);
  }
}

// Common error factory functions
export const Errors = {
  notFound: (resource: string) => 
    new AppError(`${resource} not found`, 404, 'NOT_FOUND'),
  
  unauthorized: (message: string = 'Authentication required') => 
    new AppError(message, 401, 'UNAUTHORIZED'),
  
  forbidden: (message: string = 'Access denied') => 
    new AppError(message, 403, 'FORBIDDEN'),
  
  badRequest: (message: string) => 
    new AppError(message, 400, 'BAD_REQUEST'),
  
  validation: (message: string, context?: Record<string, unknown>) => 
    new AppError(message, 422, 'VALIDATION_ERROR', true, context),
  
  conflict: (message: string) => 
    new AppError(message, 409, 'CONFLICT'),
  
  tooManyRequests: (message: string = 'Too many requests') => 
    new AppError(message, 429, 'TOO_MANY_REQUESTS'),
  
  internal: (message: string = 'An unexpected error occurred') => 
    new AppError(message, 500, 'INTERNAL_ERROR', false),
  
  serviceUnavailable: (service: string) => 
    new AppError(`${service} is temporarily unavailable`, 503, 'SERVICE_UNAVAILABLE'),
};

// ============================================================================
// Error Response Interface
// ============================================================================

interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
  requestId?: string;
}

// ============================================================================
// Logging
// ============================================================================

interface ErrorLogEntry {
  timestamp: string;
  level: 'error' | 'warn';
  code: string;
  message: string;
  statusCode: number;
  path: string;
  method: string;
  stack?: string;
  context?: Record<string, unknown>;
  requestId?: string;
}

function logError(entry: ErrorLogEntry): void {
  // In production, this would send to a logging service
  // For now, we use structured console logging
  const logLine = JSON.stringify({
    ...entry,
    // Ensure no PII is logged
    context: entry.context ? sanitizeContext(entry.context) : undefined,
  });
  
  if (entry.level === 'error') {
    console.error(`[ERROR] ${logLine}`);
  } else {
    console.warn(`[WARN] ${logLine}`);
  }
}

function sanitizeContext(context: Record<string, unknown>): Record<string, unknown> {
  const sensitiveKeys = ['password', 'token', 'secret', 'email', 'phone', 'ssn', 'sin'];
  const sanitized: Record<string, unknown> = {};
  
  for (const [key, value] of Object.entries(context)) {
    if (sensitiveKeys.some(k => key.toLowerCase().includes(k))) {
      sanitized[key] = '[REDACTED]';
    } else {
      sanitized[key] = value;
    }
  }
  
  return sanitized;
}

// ============================================================================
// Error Handler Middleware
// ============================================================================

export function errorHandler(
  err: Error | AppError,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  // Generate request ID for tracking
  const requestId = req.headers['x-request-id'] as string || `req_${Date.now()}`;
  
  // Determine if this is an operational error
  const isAppError = err instanceof AppError;
  const statusCode = isAppError ? err.statusCode : 500;
  const code = isAppError ? err.code : 'INTERNAL_ERROR';
  const isOperational = isAppError ? err.isOperational : false;
  
  // Log the error
  logError({
    timestamp: new Date().toISOString(),
    level: statusCode >= 500 ? 'error' : 'warn',
    code,
    message: err.message,
    statusCode,
    path: req.path,
    method: req.method,
    stack: process.env.NODE_ENV !== 'production' ? err.stack : undefined,
    context: isAppError ? err.context : undefined,
    requestId,
  });
  
  // Build response
  const response: ErrorResponse = {
    success: false,
    error: {
      code,
      message: isOperational 
        ? err.message 
        : 'An unexpected error occurred. Please try again later.',
    },
    requestId,
  };
  
  // Add details in development
  if (process.env.NODE_ENV !== 'production' && isAppError && err.context) {
    response.error.details = err.context;
  }
  
  res.status(statusCode).json(response);
}

// ============================================================================
// Not Found Handler
// ============================================================================

export function notFoundHandler(req: Request, res: Response): void {
  const response: ErrorResponse = {
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: `Route ${req.method} ${req.path} not found`,
    },
  };
  
  res.status(404).json(response);
}

// ============================================================================
// Async Handler Wrapper
// ============================================================================

type AsyncHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void>;

export function asyncHandler(fn: AsyncHandler) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

export default errorHandler;
