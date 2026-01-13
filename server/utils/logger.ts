/**
 * Structured Logger
 * 
 * Provides consistent, structured logging across the application.
 * Features:
 * - JSON-formatted logs for production
 * - Pretty-printed logs for development
 * - Log levels (debug, info, warn, error)
 * - Context and metadata support
 * - PII sanitization
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  module?: string;
  context?: Record<string, unknown>;
  error?: {
    name: string;
    message: string;
    stack?: string;
  };
}

// Log level hierarchy
const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

// Get minimum log level from environment
function getMinLogLevel(): LogLevel {
  const envLevel = process.env.LOG_LEVEL?.toLowerCase() as LogLevel;
  if (envLevel && LOG_LEVELS[envLevel] !== undefined) {
    return envLevel;
  }
  return process.env.NODE_ENV === 'production' ? 'info' : 'debug';
}

// Check if we should log at this level
function shouldLog(level: LogLevel): boolean {
  return LOG_LEVELS[level] >= LOG_LEVELS[getMinLogLevel()];
}

// Sanitize context to remove PII
function sanitizeContext(context: Record<string, unknown>): Record<string, unknown> {
  const sensitivePatterns = [
    /password/i,
    /token/i,
    /secret/i,
    /email/i,
    /phone/i,
    /ssn/i,
    /sin/i,
    /credit/i,
    /card/i,
    /auth/i,
  ];

  const sanitized: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(context)) {
    const isSensitive = sensitivePatterns.some((pattern) => pattern.test(key));
    
    if (isSensitive) {
      sanitized[key] = '[REDACTED]';
    } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      sanitized[key] = sanitizeContext(value as Record<string, unknown>);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
}

// Format log entry for output
function formatLogEntry(entry: LogEntry): string {
  if (process.env.NODE_ENV === 'production') {
    // JSON format for production (easier to parse by log aggregators)
    return JSON.stringify(entry);
  }

  // Pretty format for development
  const levelColors: Record<LogLevel, string> = {
    debug: '\x1b[36m', // Cyan
    info: '\x1b[32m',  // Green
    warn: '\x1b[33m',  // Yellow
    error: '\x1b[31m', // Red
  };
  const reset = '\x1b[0m';
  const color = levelColors[entry.level];

  let output = `${color}[${entry.level.toUpperCase()}]${reset} `;
  
  if (entry.module) {
    output += `\x1b[35m[${entry.module}]${reset} `;
  }
  
  output += entry.message;

  if (entry.context && Object.keys(entry.context).length > 0) {
    output += ` ${JSON.stringify(entry.context)}`;
  }

  if (entry.error) {
    output += `\n  Error: ${entry.error.name}: ${entry.error.message}`;
    if (entry.error.stack) {
      output += `\n  ${entry.error.stack.split('\n').slice(1).join('\n  ')}`;
    }
  }

  return output;
}

// Output log entry
function outputLog(entry: LogEntry): void {
  const formatted = formatLogEntry(entry);
  
  switch (entry.level) {
    case 'error':
      console.error(formatted);
      break;
    case 'warn':
      console.warn(formatted);
      break;
    default:
      console.log(formatted);
  }
}

// Create a logger instance
function createLogger(module?: string) {
  const log = (
    level: LogLevel,
    message: string,
    context?: Record<string, unknown>,
    error?: Error
  ): void => {
    if (!shouldLog(level)) return;

    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      module,
      context: context ? sanitizeContext(context) : undefined,
      error: error
        ? {
            name: error.name,
            message: error.message,
            stack: process.env.NODE_ENV !== 'production' ? error.stack : undefined,
          }
        : undefined,
    };

    outputLog(entry);
  };

  return {
    debug: (message: string, context?: Record<string, unknown>) => 
      log('debug', message, context),
    
    info: (message: string, context?: Record<string, unknown>) => 
      log('info', message, context),
    
    warn: (message: string, context?: Record<string, unknown>, error?: Error) => 
      log('warn', message, context, error),
    
    error: (message: string, error?: Error, context?: Record<string, unknown>) => 
      log('error', message, context, error),
    
    // Create a child logger with additional module context
    child: (childModule: string) => 
      createLogger(module ? `${module}:${childModule}` : childModule),
  };
}

// Default logger instance
export const logger = createLogger();

// Factory function for module-specific loggers
export function getLogger(module: string) {
  return createLogger(module);
}

export default logger;
