import { z } from "zod";
import { router, adminProcedure, protectedProcedure } from "../_core/trpc";
import { getDb } from "../db";
import { apiKeys, apiRequestLogs } from "../../drizzle/public-api-schema";
import { eq, desc, and } from "drizzle-orm";
import { featureFlagService } from "../services/featureFlagService";
import crypto from "crypto";

function generateApiKey(): { key: string; hash: string; prefix: string } {
  const key = `ra_live_${crypto.randomBytes(32).toString("hex")}`;
  const hash = crypto.createHash("sha256").update(key).digest("hex");
  const prefix = key.substring(0, 10);
  return { key, hash, prefix };
}

export const publicApiRouter = router({
  // Admin: List API keys
  listKeys: adminProcedure.query(async () => {
    const enabled = await featureFlagService.isEnabled("PUBLIC_API_ENABLED");
    if (!enabled) return [];
    const db = await getDb();
    return db.select({
      id: apiKeys.id,
      userId: apiKeys.userId,
      name: apiKeys.name,
      keyPrefix: apiKeys.keyPrefix,
      scopes: apiKeys.scopes,
      rateLimit: apiKeys.rateLimit,
      isActive: apiKeys.isActive,
      lastUsedAt: apiKeys.lastUsedAt,
      expiresAt: apiKeys.expiresAt,
      createdAt: apiKeys.createdAt,
      revokedAt: apiKeys.revokedAt,
    }).from(apiKeys).orderBy(desc(apiKeys.createdAt));
  }),

  // Admin: Create API key
  createKey: adminProcedure
    .input(z.object({
      name: z.string().min(1).max(255),
      scopes: z.array(z.string()).default(["courses:read", "learners:read"]),
      rateLimit: z.number().min(10).max(10000).default(100),
      expiresAt: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      const { key, hash, prefix } = generateApiKey();
      
      await db.insert(apiKeys).values({
        userId: (ctx as any).userId || 0,
        name: input.name,
        keyHash: hash,
        keyPrefix: prefix,
        scopes: JSON.stringify(input.scopes),
        rateLimit: input.rateLimit,
        expiresAt: input.expiresAt ? new Date(input.expiresAt) : null,
      });
      
      // Return the full key only once — it won't be retrievable again
      return { key, prefix, success: true };
    }),

  // Admin: Revoke API key
  revokeKey: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      await db.update(apiKeys).set({ isActive: false, revokedAt: new Date() }).where(eq(apiKeys.id, input.id));
      return { success: true };
    }),

  // Admin: Get API key usage logs
  getKeyLogs: adminProcedure
    .input(z.object({ apiKeyId: z.number(), limit: z.number().default(50) }))
    .query(async ({ input }) => {
      const db = await getDb();
      return db.select().from(apiRequestLogs)
        .where(eq(apiRequestLogs.apiKeyId, input.apiKeyId))
        .orderBy(desc(apiRequestLogs.createdAt))
        .limit(input.limit);
    }),

  // Admin: Get API usage stats
  getUsageStats: adminProcedure.query(async () => {
    const db = await getDb();
    const keys = await db.select().from(apiKeys);
    const totalKeys = keys.length;
    const activeKeys = keys.filter(k => k.isActive).length;
    return { totalKeys, activeKeys };
  }),
});
