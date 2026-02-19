import { mysqlTable, int, varchar, text, timestamp, mysqlEnum, boolean } from "drizzle-orm/mysql-core";

// ============================================================================
// PUBLIC API v1 (Phase 14)
// ============================================================================

export const apiKeys = mysqlTable("api_keys", {
  id: int("id").autoincrement().primaryKey(),
  
  userId: int("userId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  keyHash: varchar("keyHash", { length: 64 }).notNull(), // SHA-256 hash of the API key
  keyPrefix: varchar("keyPrefix", { length: 10 }).notNull(), // First 8 chars for identification
  
  // Permissions
  scopes: text("scopes"), // JSON array: ["courses:read", "learners:read", "sessions:read"]
  
  // Rate limiting
  rateLimit: int("rateLimit").default(100), // requests per minute
  
  // Status
  isActive: boolean("isActive").default(true),
  lastUsedAt: timestamp("lastUsedAt"),
  expiresAt: timestamp("expiresAt"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  revokedAt: timestamp("revokedAt"),
});

export const apiRequestLogs = mysqlTable("api_request_logs", {
  id: int("id").autoincrement().primaryKey(),
  
  apiKeyId: int("apiKeyId").notNull().references(() => apiKeys.id),
  
  method: varchar("method", { length: 10 }).notNull(),
  path: varchar("path", { length: 500 }).notNull(),
  statusCode: int("statusCode").notNull(),
  responseTimeMs: int("responseTimeMs"),
  
  ipAddress: varchar("ipAddress", { length: 45 }),
  userAgent: varchar("userAgent", { length: 500 }),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ApiKey = typeof apiKeys.$inferSelect;
export type ApiRequestLog = typeof apiRequestLogs.$inferSelect;
