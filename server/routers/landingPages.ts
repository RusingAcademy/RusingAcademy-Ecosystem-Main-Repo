/**
 * Landing Pages Router — Phase 8.1
 * Admin CRUD for landing pages with template-based sections.
 * Public endpoint for rendering published pages by slug.
 * Protected by LANDING_PAGES_V1 feature flag.
 */
import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { landingPages } from "../../drizzle/schema";
import { eq, desc, and, sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { featureFlagService } from "../services/featureFlagService";

const sectionSchema = z.object({
  id: z.string(),
  type: z.enum(["hero", "features", "pricing", "testimonials", "cta", "faq", "text"]),
  order: z.number(),
  content: z.record(z.any()),
});

export const landingPagesRouter = router({
  // Admin: List all landing pages
  list: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user.role !== "admin" && ctx.user.role !== "owner") {
      throw new TRPCError({ code: "FORBIDDEN" });
    }
    if (!await featureFlagService.isEnabled("LANDING_PAGES_V1", { role: ctx.user.role })) {
      throw new TRPCError({ code: "FORBIDDEN", message: "Feature not enabled" });
    }
    const db = await getDb();
    if (!db) return [];
    return db.select().from(landingPages).orderBy(desc(landingPages.updatedAt));
  }),

  // Admin: Get single page for editing
  getById: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin" && ctx.user.role !== "owner") {
        throw new TRPCError({ code: "FORBIDDEN" });
      }
      const db = await getDb();
      if (!db) return null;
      const [page] = await db.select().from(landingPages)
        .where(eq(landingPages.id, input.id)).limit(1);
      return page ?? null;
    }),

  // Admin: Create landing page
  create: protectedProcedure
    .input(z.object({
      title: z.string().min(1).max(200),
      titleFr: z.string().max(200).optional(),
      slug: z.string().min(1).max(200).regex(/^[a-z0-9-]+$/),
      sections: z.array(sectionSchema),
      metaTitle: z.string().max(200).optional(),
      metaTitleFr: z.string().max(200).optional(),
      metaDescription: z.string().optional(),
      metaDescriptionFr: z.string().optional(),
      ogImage: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin" && ctx.user.role !== "owner") {
        throw new TRPCError({ code: "FORBIDDEN" });
      }
      if (!await featureFlagService.isEnabled("LANDING_PAGES_V1", { role: ctx.user.role })) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Feature not enabled" });
      }
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      // Check slug uniqueness
      const [existing] = await db.select({ id: landingPages.id })
        .from(landingPages).where(eq(landingPages.slug, input.slug)).limit(1);
      if (existing) {
        throw new TRPCError({ code: "CONFLICT", message: "Slug already exists" });
      }

      const result = await db.insert(landingPages).values({
        title: input.title,
        titleFr: input.titleFr ?? null,
        slug: input.slug,
        sections: input.sections,
        metaTitle: input.metaTitle ?? null,
        metaTitleFr: input.metaTitleFr ?? null,
        metaDescription: input.metaDescription ?? null,
        metaDescriptionFr: input.metaDescriptionFr ?? null,
        ogImage: input.ogImage ?? null,
        status: "draft",
        createdBy: ctx.user.id,
      });
      return { id: (result as any)[0]?.insertId ?? 0 };
    }),

  // Admin: Update landing page
  update: protectedProcedure
    .input(z.object({
      id: z.number(),
      title: z.string().min(1).max(200).optional(),
      titleFr: z.string().max(200).optional(),
      slug: z.string().max(200).regex(/^[a-z0-9-]+$/).optional(),
      sections: z.array(sectionSchema).optional(),
      metaTitle: z.string().max(200).optional(),
      metaTitleFr: z.string().max(200).optional(),
      metaDescription: z.string().optional(),
      metaDescriptionFr: z.string().optional(),
      ogImage: z.string().optional(),
      status: z.enum(["draft", "published", "archived"]).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin" && ctx.user.role !== "owner") {
        throw new TRPCError({ code: "FORBIDDEN" });
      }
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      const { id, ...data } = input;
      const updateData: Record<string, any> = {};
      if (data.title !== undefined) updateData.title = data.title;
      if (data.titleFr !== undefined) updateData.titleFr = data.titleFr;
      if (data.slug !== undefined) updateData.slug = data.slug;
      if (data.sections !== undefined) updateData.sections = data.sections;
      if (data.metaTitle !== undefined) updateData.metaTitle = data.metaTitle;
      if (data.metaTitleFr !== undefined) updateData.metaTitleFr = data.metaTitleFr;
      if (data.metaDescription !== undefined) updateData.metaDescription = data.metaDescription;
      if (data.metaDescriptionFr !== undefined) updateData.metaDescriptionFr = data.metaDescriptionFr;
      if (data.ogImage !== undefined) updateData.ogImage = data.ogImage;
      if (data.status !== undefined) {
        updateData.status = data.status;
        if (data.status === "published") updateData.publishedAt = new Date();
      }

      await db.update(landingPages).set(updateData).where(eq(landingPages.id, id));
      return { success: true };
    }),

  // Admin: Delete landing page
  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin" && ctx.user.role !== "owner") {
        throw new TRPCError({ code: "FORBIDDEN" });
      }
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      await db.delete(landingPages).where(eq(landingPages.id, input.id));
      return { success: true };
    }),

  // Public: Get published page by slug
  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return null;
      const [page] = await db.select().from(landingPages)
        .where(and(
          eq(landingPages.slug, input.slug),
          eq(landingPages.status, "published"),
        )).limit(1);
      return page ?? null;
    }),
});
