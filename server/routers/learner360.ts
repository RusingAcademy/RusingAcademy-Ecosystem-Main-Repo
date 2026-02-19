import { z } from "zod";
import { router, protectedProcedure, adminProcedure } from "../_core/trpc";
import { getDb } from "../db";
import { learnerTags, learnerTagAssignments, learnerSegments, learnerNotes } from "../../drizzle/learner360-tags-schema";
import { eq, desc, and, sql } from "drizzle-orm";
import { featureFlagService } from "../services/featureFlagService";
import { segmentationService, FilterRule } from "../services/segmentationService";

const filterRuleSchema = z.object({
  field: z.string(),
  operator: z.enum(["equals", "not_equals", "contains", "starts_with", "greater_than", "less_than", "has_tag", "not_has_tag", "is_empty", "is_not_empty", "between", "in"]),
  value: z.any(),
  logic: z.enum(["AND", "OR"]).optional(),
});

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

  // ===== ADVANCED SEGMENTATION (Phase 12.1) =====

  /** Execute a segmentation query with advanced filters */
  querySegment: adminProcedure
    .input(z.object({
      filters: z.array(filterRuleSchema),
      logic: z.enum(["AND", "OR"]).default("AND"),
      limit: z.number().min(1).max(1000).default(100),
      offset: z.number().min(0).default(0),
      sortBy: z.string().default("createdAt"),
      sortOrder: z.enum(["asc", "desc"]).default("desc"),
    }))
    .query(async ({ input }) => {
      return segmentationService.segment({
        filters: input.filters as FilterRule[],
        logic: input.logic,
        limit: input.limit,
        offset: input.offset,
        sortBy: input.sortBy,
        sortOrder: input.sortOrder,
      });
    }),

  /** Save a segment with filter rules and auto-count members */
  saveSegment: adminProcedure
    .input(z.object({
      name: z.string().min(1).max(255),
      description: z.string().default(""),
      filterRules: z.array(filterRuleSchema),
    }))
    .mutation(async ({ input }) => {
      return segmentationService.saveSegment(
        input.name,
        input.description,
        input.filterRules as FilterRule[]
      );
    }),

  /** Refresh a saved segment's member count */
  refreshSegment: adminProcedure
    .input(z.object({ segmentId: z.number() }))
    .mutation(async ({ input }) => {
      return segmentationService.refreshSegment(input.segmentId);
    }),

  // ===== EXPORT (Phase 12.1) =====

  /** Export filtered learners to CSV */
  exportCSV: adminProcedure
    .input(z.object({
      filters: z.array(filterRuleSchema).default([]),
      logic: z.enum(["AND", "OR"]).default("AND"),
      fields: z.array(z.string()).optional(),
      limit: z.number().max(10000).default(1000),
    }))
    .mutation(async ({ input }) => {
      const result = await segmentationService.segment({
        filters: input.filters as FilterRule[],
        logic: input.logic,
        limit: input.limit,
      });

      const csv = await segmentationService.exportCSV(result.learners, input.fields);
      return {
        data: csv,
        filename: `learners-export-${new Date().toISOString().slice(0, 10)}.csv`,
        contentType: "text/csv",
        totalRecords: result.totalCount,
        exportedRecords: result.learners.length,
      };
    }),

  /** Export filtered learners to Excel-compatible format */
  exportExcel: adminProcedure
    .input(z.object({
      filters: z.array(filterRuleSchema).default([]),
      logic: z.enum(["AND", "OR"]).default("AND"),
      fields: z.array(z.string()).optional(),
      limit: z.number().max(10000).default(1000),
    }))
    .mutation(async ({ input }) => {
      const result = await segmentationService.segment({
        filters: input.filters as FilterRule[],
        logic: input.logic,
        limit: input.limit,
      });

      const excel = await segmentationService.exportExcel(result.learners, input.fields);
      return {
        data: excel.toString("base64"),
        filename: `learners-export-${new Date().toISOString().slice(0, 10)}.xlsx`,
        contentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        totalRecords: result.totalCount,
        exportedRecords: result.learners.length,
      };
    }),

  /** Export filtered learners to JSON */
  exportJSON: adminProcedure
    .input(z.object({
      filters: z.array(filterRuleSchema).default([]),
      logic: z.enum(["AND", "OR"]).default("AND"),
      fields: z.array(z.string()).optional(),
      limit: z.number().max(10000).default(1000),
    }))
    .mutation(async ({ input }) => {
      const result = await segmentationService.segment({
        filters: input.filters as FilterRule[],
        logic: input.logic,
        limit: input.limit,
      });

      const json = await segmentationService.exportJSON(result.learners, input.fields);
      return {
        data: json,
        filename: `learners-export-${new Date().toISOString().slice(0, 10)}.json`,
        contentType: "application/json",
        totalRecords: result.totalCount,
        exportedRecords: result.learners.length,
      };
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
