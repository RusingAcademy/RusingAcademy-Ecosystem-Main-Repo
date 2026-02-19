import { z } from "zod";
import { router, protectedProcedure, adminProcedure } from "../_core/trpc";
import { getDb } from "../db";
import { learnerTags, learnerTagAssignments, learnerSegments, learnerNotes } from "../../drizzle/learner360-tags-schema";
import { eq, desc, and, sql } from "drizzle-orm";
import { featureFlagService } from "../services/featureFlagService";

export const learner360Router = router({
  // ===== TAGS =====
  listTags: adminProcedure.query(async () => {
    const enabled = await featureFlagService.isEnabled("TAGS_SEGMENTATION_ENABLED");
    if (!enabled) return [];
    const db = await getDb();
    return db.select().from(learnerTags).orderBy(learnerTags.name);
  }),

  createTag: adminProcedure
    .input(z.object({
      name: z.string().min(1).max(100),
      slug: z.string().min(1).max(100),
      color: z.string().max(7).default("#6366f1"),
      description: z.string().optional(),
      category: z.enum(["level", "interest", "status", "custom"]).default("custom"),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      const result = await db.insert(learnerTags).values(input);
      return { id: result[0].insertId, success: true };
    }),

  deleteTag: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      await db.delete(learnerTagAssignments).where(eq(learnerTagAssignments.tagId, input.id));
      await db.delete(learnerTags).where(eq(learnerTags.id, input.id));
      return { success: true };
    }),

  // ===== TAG ASSIGNMENTS =====
  assignTag: adminProcedure
    .input(z.object({ learnerId: z.number(), tagId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      const result = await db.insert(learnerTagAssignments).values({
        ...input,
        assignedBy: "manual",
        assignedByUserId: (ctx as any).userId || 0,
      });
      return { id: result[0].insertId, success: true };
    }),

  removeTag: adminProcedure
    .input(z.object({ learnerId: z.number(), tagId: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      await db.delete(learnerTagAssignments).where(
        and(eq(learnerTagAssignments.learnerId, input.learnerId), eq(learnerTagAssignments.tagId, input.tagId))
      );
      return { success: true };
    }),

  getLearnerTags: protectedProcedure
    .input(z.object({ learnerId: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      return db.select().from(learnerTagAssignments)
        .where(eq(learnerTagAssignments.learnerId, input.learnerId));
    }),

  // ===== SEGMENTS =====
  listSegments: adminProcedure.query(async () => {
    const db = await getDb();
    return db.select().from(learnerSegments).orderBy(desc(learnerSegments.createdAt));
  }),

  createSegment: adminProcedure
    .input(z.object({
      name: z.string().min(1).max(255),
      description: z.string().optional(),
      filterRules: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      const result = await db.insert(learnerSegments).values(input);
      return { id: result[0].insertId, success: true };
    }),

  deleteSegment: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      await db.delete(learnerSegments).where(eq(learnerSegments.id, input.id));
      return { success: true };
    }),

  // ===== LEARNER NOTES =====
  getLearnerNotes: protectedProcedure
    .input(z.object({ learnerId: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      return db.select().from(learnerNotes)
        .where(eq(learnerNotes.learnerId, input.learnerId))
        .orderBy(desc(learnerNotes.createdAt));
    }),

  addNote: adminProcedure
    .input(z.object({
      learnerId: z.number(),
      content: z.string().min(1),
      noteType: z.enum(["general", "progress", "concern", "milestone"]).default("general"),
      isPrivate: z.boolean().default(true),
    }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      const result = await db.insert(learnerNotes).values({
        ...input,
        authorId: (ctx as any).userId || 0,
      });
      return { id: result[0].insertId, success: true };
    }),

  deleteNote: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      await db.delete(learnerNotes).where(eq(learnerNotes.id, input.id));
      return { success: true };
    }),

  // ===== LEARNER 360 VIEW =====
  getLearner360: adminProcedure
    .input(z.object({ learnerId: z.number() }))
    .query(async ({ input }) => {
      const enabled = await featureFlagService.isEnabled("LEARNER_360_ENABLED");
      if (!enabled) return null;
      const db = await getDb();
      const tags = await db.select().from(learnerTagAssignments)
        .where(eq(learnerTagAssignments.learnerId, input.learnerId));
      const notes = await db.select().from(learnerNotes)
        .where(eq(learnerNotes.learnerId, input.learnerId))
        .orderBy(desc(learnerNotes.createdAt))
        .limit(20);
      return { learnerId: input.learnerId, tags, notes };
    }),
});
