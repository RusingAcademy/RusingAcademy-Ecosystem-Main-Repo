/**
 * Content Versioning Service (Sprint K5)
 * 
 * Provides version history and rollback for courses, lessons, modules, and quizzes.
 * Each save creates a snapshot that can be restored later.
 */
import { getDb } from "../db";
import { contentVersions, courses, lessons, courseModules } from "../../drizzle/schema";
import { eq, and, desc, sql } from "drizzle-orm";
import { createLogger } from "../logger";

const log = createLogger("content-versioning");

type EntityType = "course" | "lesson" | "module" | "quiz";

/**
 * Create a version snapshot of an entity before it's modified.
 */
export async function createVersion(params: {
  entityType: EntityType;
  entityId: number;
  changeType: "create" | "update" | "publish" | "unpublish" | "archive" | "restore";
  changeSummary?: string;
  snapshot: Record<string, any>;
  authorId: number;
  authorName?: string;
}): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Get the next version number
  const [latest] = await db
    .select({ maxVersion: sql<number>`COALESCE(MAX(versionNumber), 0)` })
    .from(contentVersions)
    .where(
      and(
        eq(contentVersions.entityType, params.entityType),
        eq(contentVersions.entityId, params.entityId),
      ),
    );

  const nextVersion = (latest?.maxVersion ?? 0) + 1;

  const result = await db.insert(contentVersions).values({
    entityType: params.entityType,
    entityId: params.entityId,
    versionNumber: nextVersion,
    changeType: params.changeType,
    changeSummary: params.changeSummary,
    snapshot: params.snapshot,
    authorId: params.authorId,
    authorName: params.authorName,
  });

  log.info(
    { entityType: params.entityType, entityId: params.entityId, version: nextVersion },
    "Version created",
  );

  return nextVersion;
}

/**
 * Get version history for an entity.
 */
export async function getVersionHistory(
  entityType: EntityType,
  entityId: number,
  limit = 20,
) {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(contentVersions)
    .where(
      and(
        eq(contentVersions.entityType, entityType),
        eq(contentVersions.entityId, entityId),
      ),
    )
    .orderBy(desc(contentVersions.versionNumber))
    .limit(limit);
}

/**
 * Get a specific version snapshot.
 */
export async function getVersion(versionId: number) {
  const db = await getDb();
  if (!db) return null;

  const [version] = await db
    .select()
    .from(contentVersions)
    .where(eq(contentVersions.id, versionId))
    .limit(1);

  return version ?? null;
}

/**
 * Restore an entity to a specific version.
 * Creates a new "restore" version entry and applies the snapshot.
 */
export async function restoreVersion(
  versionId: number,
  authorId: number,
  authorName?: string,
): Promise<{ success: boolean; restoredVersion: number }> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const version = await getVersion(versionId);
  if (!version) throw new Error("Version not found");

  const snapshot = version.snapshot as Record<string, any>;

  // Apply the snapshot to the entity
  switch (version.entityType) {
    case "course": {
      const { id, createdAt, updatedAt, ...updateData } = snapshot;
      await db.update(courses).set(updateData as any).where(eq(courses.id, version.entityId));
      break;
    }
    case "lesson": {
      const { id, createdAt, updatedAt, ...updateData } = snapshot;
      await db.update(lessons).set(updateData as any).where(eq(lessons.id, version.entityId));
      break;
    }
    case "module": {
      const { id, createdAt, updatedAt, ...updateData } = snapshot;
      await db.update(courseModules).set(updateData as any).where(eq(courseModules.id, version.entityId));
      break;
    }
    default:
      throw new Error(`Unsupported entity type: ${version.entityType}`);
  }

  // Create a restore version entry
  const restoredVersion = await createVersion({
    entityType: version.entityType as EntityType,
    entityId: version.entityId,
    changeType: "restore",
    changeSummary: `Restored to version ${version.versionNumber}`,
    snapshot,
    authorId,
    authorName,
  });

  log.info(
    { entityType: version.entityType, entityId: version.entityId, fromVersion: version.versionNumber, toVersion: restoredVersion },
    "Entity restored to previous version",
  );

  return { success: true, restoredVersion };
}

/**
 * Compare two versions of an entity (returns field-level diff).
 */
export async function compareVersions(versionIdA: number, versionIdB: number) {
  const [a, b] = await Promise.all([getVersion(versionIdA), getVersion(versionIdB)]);
  if (!a || !b) throw new Error("One or both versions not found");
  if (a.entityType !== b.entityType || a.entityId !== b.entityId) {
    throw new Error("Cannot compare versions of different entities");
  }

  const snapshotA = a.snapshot as Record<string, any>;
  const snapshotB = b.snapshot as Record<string, any>;
  const allKeys = new Set([...Object.keys(snapshotA), ...Object.keys(snapshotB)]);
  const changes: Array<{ field: string; before: any; after: any }> = [];

  for (const key of allKeys) {
    if (JSON.stringify(snapshotA[key]) !== JSON.stringify(snapshotB[key])) {
      changes.push({ field: key, before: snapshotA[key], after: snapshotB[key] });
    }
  }

  return {
    entityType: a.entityType,
    entityId: a.entityId,
    versionA: a.versionNumber,
    versionB: b.versionNumber,
    totalChanges: changes.length,
    changes,
  };
}
