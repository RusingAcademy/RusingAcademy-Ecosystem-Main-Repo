// server/services/featureFlagService.ts — Phase 4: Feature Flags with in-memory cache
import { getDb } from "../db";
import { featureFlags, featureFlagHistory } from "../../drizzle/schema";
import { eq, desc } from "drizzle-orm";
import { createLogger } from "../logger";

const log = createLogger("services-featureFlags");

// In-memory cache (no Redis available)
const flagCache = new Map<string, { flag: FeatureFlag; expiresAt: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

interface FeatureFlag {
  id: number;
  key: string;
  name: string;
  description: string | null;
  enabled: boolean;
  environment: string;
  rolloutPercentage: number;
  targetUserIds: string | null;
  targetRoles: string | null;
  conditions: string | null;
  createdBy: number | null;
  createdAt: Date | null;
  updatedAt: Date | null;
}

interface UserContext {
  userId: number;
  role: string;
}

export const featureFlagService = {
  async getFlag(key: string): Promise<FeatureFlag | null> {
    const cached = flagCache.get(key);
    if (cached && cached.expiresAt > Date.now()) return cached.flag;

    const db = await getDb();
    const flag = await db.select().from(featureFlags).where(eq(featureFlags.key, key)).then((r) => r[0] || null);

    if (flag) {
      flagCache.set(key, { flag: flag as FeatureFlag, expiresAt: Date.now() + CACHE_TTL });
    }
    return flag as FeatureFlag | null;
  },

  async getAllFlags(): Promise<FeatureFlag[]> {
    const db = await getDb();
    return db.select().from(featureFlags).orderBy(featureFlags.name) as Promise<FeatureFlag[]>;
  },

  async isEnabled(key: string, context: UserContext): Promise<boolean> {
    const flag = await this.getFlag(key);
    if (!flag || !flag.enabled) return false;

    // Check environment
    const currentEnv = process.env.NODE_ENV || "development";
    if (flag.environment !== "all" && flag.environment !== currentEnv) return false;

    // Check target users
    if (flag.targetUserIds) {
      try {
        const userIds = JSON.parse(flag.targetUserIds) as number[];
        if (userIds.length > 0 && userIds.includes(context.userId)) return true;
      } catch { /* ignore parse errors */ }
    }

    // Check target roles
    if (flag.targetRoles) {
      try {
        const roles = JSON.parse(flag.targetRoles) as string[];
        if (roles.length > 0 && !roles.includes(context.role)) return false;
      } catch { /* ignore parse errors */ }
    }

    // Check rollout percentage
    if (flag.rolloutPercentage < 100) {
      const hash = this.hashUserId(context.userId, key);
      return hash < flag.rolloutPercentage;
    }

    return true;
  },

  async getUserFlags(context: UserContext): Promise<Record<string, boolean>> {
    const allFlags = await this.getAllFlags();
    const result: Record<string, boolean> = {};
    for (const flag of allFlags) {
      result[flag.key] = await this.isEnabled(flag.key, context);
    }
    return result;
  },

  hashUserId(userId: number, flagKey: string): number {
    const str = `${userId}:${flagKey}`;
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash) % 100;
  },

  async createFlag(data: {
    key: string;
    name: string;
    description?: string;
    enabled?: boolean;
    environment?: string;
    rolloutPercentage?: number;
    targetUserIds?: number[];
    targetRoles?: string[];
    createdBy: number;
  }): Promise<FeatureFlag> {
    const db = await getDb();
    await db.insert(featureFlags).values({
      key: data.key,
      name: data.name,
      description: data.description || null,
      enabled: data.enabled ?? false,
      environment: data.environment || "all",
      rolloutPercentage: data.rolloutPercentage ?? 100,
      targetUserIds: data.targetUserIds ? JSON.stringify(data.targetUserIds) : null,
      targetRoles: data.targetRoles ? JSON.stringify(data.targetRoles) : null,
      createdBy: data.createdBy,
    });

    const flag = await this.getFlag(data.key);
    if (flag) {
      await this.logHistory(flag.id, "created", null, flag, data.createdBy);
    }
    this.invalidateCache(data.key);
    return flag!;
  },

  async updateFlag(id: number, data: Partial<{
    name: string;
    description: string;
    enabled: boolean;
    environment: string;
    rolloutPercentage: number;
    targetUserIds: number[];
    targetRoles: string[];
  }>, userId: number): Promise<FeatureFlag | null> {
    const db = await getDb();
    const oldFlag = await db.select().from(featureFlags).where(eq(featureFlags.id, id)).then((r) => r[0]);
    if (!oldFlag) return null;

    const updateData: Record<string, unknown> = { updatedAt: new Date() };
    if (data.name !== undefined) updateData.name = data.name;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.enabled !== undefined) updateData.enabled = data.enabled;
    if (data.environment !== undefined) updateData.environment = data.environment;
    if (data.rolloutPercentage !== undefined) updateData.rolloutPercentage = data.rolloutPercentage;
    if (data.targetUserIds !== undefined) updateData.targetUserIds = JSON.stringify(data.targetUserIds);
    if (data.targetRoles !== undefined) updateData.targetRoles = JSON.stringify(data.targetRoles);

    await db.update(featureFlags).set(updateData).where(eq(featureFlags.id, id));

    const updated = await db.select().from(featureFlags).where(eq(featureFlags.id, id)).then((r) => r[0]);
    await this.logHistory(id, data.enabled !== undefined ? (data.enabled ? "enabled" : "disabled") : "updated", oldFlag, updated, userId);
    this.invalidateCache(oldFlag.key);
    return updated as FeatureFlag;
  },

  async deleteFlag(id: number): Promise<void> {
    const db = await getDb();
    const flag = await db.select().from(featureFlags).where(eq(featureFlags.id, id)).then((r) => r[0]);
    await db.delete(featureFlags).where(eq(featureFlags.id, id));
    if (flag) this.invalidateCache(flag.key);
  },

  async logHistory(flagId: number, action: string, previous: unknown, current: unknown, userId: number): Promise<void> {
    try {
      const db = await getDb();
      await db.insert(featureFlagHistory).values({
        flagId,
        action,
        previousValue: previous ? JSON.stringify(previous) : null,
        newValue: current ? JSON.stringify(current) : null,
        changedBy: userId,
      });
    } catch (err) {
      log.error("[FeatureFlags] Failed to log history:", err);
    }
  },

  async getHistory(flagId: number) {
    const db = await getDb();
    return db.select().from(featureFlagHistory).where(eq(featureFlagHistory.flagId, flagId)).orderBy(desc(featureFlagHistory.changedAt));
  },

  invalidateCache(key: string): void {
    flagCache.delete(key);
  },
};
