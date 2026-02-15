import { z } from "zod";
import { protectedProcedure, adminProcedure, publicProcedure } from "../_core/trpc";
import { router } from "../_core/trpc";
import { getDb } from "../db";
import { sql, eq, desc, and, like, count, sum, gte, lte } from "drizzle-orm";
import {
  offers, offerProducts, abandonedCarts, invoices,
  blogPosts, blogCategories, podcasts, podcastEpisodes,
  forms, formSubmissions, navigationMenus,
  assessments, assessmentResults, cartRecoverySettings,
} from "../../drizzle/schema";

// ============================================================================
// OFFERS ROUTER (Kajabi-style Offers)
// ============================================================================
export const offersRouter = router({
  list: adminProcedure
    .input(z.object({
      status: z.enum(["active", "draft", "expired", "archived"]).optional(),
      search: z.string().optional(),
      limit: z.number().default(50),
      offset: z.number().default(0),
    }).optional())
    .query(async ({ input }) => {
      const db = await getDb();
      const conditions: any[] = [];
      if (input?.status) conditions.push(eq(offers.status, input.status));
      if (input?.search) conditions.push(like(offers.name, `%${input.search}%`));
      
      const where = conditions.length > 0 ? and(...conditions) : undefined;
      const items = await db.select().from(offers).where(where).orderBy(desc(offers.createdAt)).limit(input?.limit ?? 50).offset(input?.offset ?? 0);
      const [totalResult] = await db.select({ total: count() }).from(offers).where(where);
      
      return { items, total: totalResult?.total ?? 0 };
    }),

  getById: adminProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      const [offer] = await db.select().from(offers).where(eq(offers.id, input.id));
      if (!offer) return null;
      const products = await db.select().from(offerProducts).where(eq(offerProducts.offerId, input.id));
      return { ...offer, products };
    }),

  create: adminProcedure
    .input(z.object({
      name: z.string().min(1),
      nameFr: z.string().optional(),
      description: z.string().optional(),
      descriptionFr: z.string().optional(),
      type: z.enum(["one-time", "subscription", "payment-plan", "free", "bundle"]),
      price: z.number().min(0),
      currency: z.string().default("CAD"),
      trialDays: z.number().default(0),
      installments: z.number().optional(),
      installmentInterval: z.enum(["weekly", "monthly"]).optional(),
      imageUrl: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      const [result] = await db.insert(offers).values(input);
      return { id: result.insertId, success: true };
    }),

  update: adminProcedure
    .input(z.object({
      id: z.number(),
      name: z.string().optional(),
      nameFr: z.string().optional(),
      description: z.string().optional(),
      descriptionFr: z.string().optional(),
      type: z.enum(["one-time", "subscription", "payment-plan", "free", "bundle"]).optional(),
      price: z.number().min(0).optional(),
      status: z.enum(["active", "draft", "expired", "archived"]).optional(),
      trialDays: z.number().optional(),
      installments: z.number().optional(),
      installmentInterval: z.enum(["weekly", "monthly"]).optional(),
      imageUrl: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      const { id, ...data } = input;
      await db.update(offers).set(data).where(eq(offers.id, id));
      return { success: true };
    }),

  delete: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      await db.delete(offerProducts).where(eq(offerProducts.offerId, input.id));
      await db.delete(offers).where(eq(offers.id, input.id));
      return { success: true };
    }),

  addProduct: adminProcedure
    .input(z.object({
      offerId: z.number(),
      productType: z.enum(["course", "path", "coaching", "download", "community"]),
      productId: z.number(),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      await db.insert(offerProducts).values(input);
      return { success: true };
    }),

  removeProduct: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      await db.delete(offerProducts).where(eq(offerProducts.id, input.id));
      return { success: true };
    }),

  getStats: adminProcedure.query(async () => {
    const db = await getDb();
    const [totalResult] = await db.select({ total: count() }).from(offers);
    const [activeResult] = await db.select({ total: count() }).from(offers).where(eq(offers.status, "active"));
    const [revenueResult] = await db.select({ total: sum(offers.revenue) }).from(offers);
    return {
      total: totalResult?.total ?? 0,
      active: activeResult?.total ?? 0,
      totalRevenue: Number(revenueResult?.total ?? 0),
    };
  }),
});

// ============================================================================
// CART ROUTER (Abandoned Cart Recovery)
// ============================================================================
export const cartRouter = router({
  getAbandoned: adminProcedure
    .input(z.object({
      status: z.enum(["abandoned", "recovered", "expired"]).optional(),
      limit: z.number().default(50),
      offset: z.number().default(0),
    }).optional())
    .query(async ({ input }) => {
      const db = await getDb();
      const conditions: any[] = [];
      if (input?.status) conditions.push(eq(abandonedCarts.status, input.status));
      const where = conditions.length > 0 ? and(...conditions) : undefined;
      const items = await db.select().from(abandonedCarts).where(where).orderBy(desc(abandonedCarts.createdAt)).limit(input?.limit ?? 50);
      const [totalResult] = await db.select({ total: count() }).from(abandonedCarts).where(where);
      return { items, total: totalResult?.total ?? 0 };
    }),

  getStats: adminProcedure.query(async () => {
    const db = await getDb();
    const [totalResult] = await db.select({ total: count() }).from(abandonedCarts);
    const [recoveredResult] = await db.select({ total: count() }).from(abandonedCarts).where(eq(abandonedCarts.status, "recovered"));
    const [lostResult] = await db.select({ total: sum(abandonedCarts.totalAmount) }).from(abandonedCarts).where(eq(abandonedCarts.status, "abandoned"));
    return {
      total: totalResult?.total ?? 0,
      recovered: recoveredResult?.total ?? 0,
      recoveryRate: totalResult?.total ? Math.round((Number(recoveredResult?.total ?? 0) / Number(totalResult.total)) * 100) : 0,
      lostRevenue: Number(lostResult?.total ?? 0),
    };
  }),

  getRecoverySettings: adminProcedure.query(async () => {
    const db = await getDb();
    return db.select().from(cartRecoverySettings).orderBy(cartRecoverySettings.position);
  }),

  updateRecoverySetting: adminProcedure
    .input(z.object({
      id: z.number(),
      delayHours: z.number().optional(),
      subject: z.string().optional(),
      subjectFr: z.string().optional(),
      body: z.string().optional(),
      bodyFr: z.string().optional(),
      isActive: z.boolean().optional(),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      const { id, ...data } = input;
      await db.update(cartRecoverySettings).set(data).where(eq(cartRecoverySettings.id, id));
      return { success: true };
    }),

  markRecovered: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      await db.update(abandonedCarts).set({ status: "recovered", recoveredAt: new Date() }).where(eq(abandonedCarts.id, input.id));
      return { success: true };
    }),
});

// ============================================================================
// INVOICES ROUTER
// ============================================================================
export const invoicesRouter = router({
  list: adminProcedure
    .input(z.object({
      status: z.enum(["draft", "sent", "paid", "overdue", "cancelled", "refunded"]).optional(),
      search: z.string().optional(),
      limit: z.number().default(50),
      offset: z.number().default(0),
    }).optional())
    .query(async ({ input }) => {
      const db = await getDb();
      const conditions: any[] = [];
      if (input?.status) conditions.push(eq(invoices.status, input.status));
      if (input?.search) conditions.push(like(invoices.customerName, `%${input.search}%`));
      const where = conditions.length > 0 ? and(...conditions) : undefined;
      const items = await db.select().from(invoices).where(where).orderBy(desc(invoices.createdAt)).limit(input?.limit ?? 50);
      const [totalResult] = await db.select({ total: count() }).from(invoices).where(where);
      return { items, total: totalResult?.total ?? 0 };
    }),

  getById: adminProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      const [invoice] = await db.select().from(invoices).where(eq(invoices.id, input.id));
      return invoice ?? null;
    }),

  create: adminProcedure
    .input(z.object({
      email: z.string().email(),
      customerName: z.string(),
      amount: z.number(),
      tax: z.number().default(0),
      currency: z.string().default("CAD"),
      dueDate: z.string().optional(),
      notes: z.string().optional(),
      lineItems: z.string().optional(),
      offerId: z.number().optional(),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      const invoiceNumber = `INV-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
      const total = input.amount + input.tax;
      const [result] = await db.insert(invoices).values({
        ...input,
        invoiceNumber,
        total,
        dueDate: input.dueDate ? new Date(input.dueDate) : undefined,
      });
      return { id: result.insertId, invoiceNumber, success: true };
    }),

  update: adminProcedure
    .input(z.object({
      id: z.number(),
      status: z.enum(["draft", "sent", "paid", "overdue", "cancelled", "refunded"]).optional(),
      notes: z.string().optional(),
      dueDate: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      const { id, dueDate, ...data } = input;
      const updateData: any = { ...data };
      if (dueDate) updateData.dueDate = new Date(dueDate);
      if (data.status === "paid") updateData.paidAt = new Date();
      await db.update(invoices).set(updateData).where(eq(invoices.id, id));
      return { success: true };
    }),

  getStats: adminProcedure.query(async () => {
    const db = await getDb();
    const [totalResult] = await db.select({ total: count() }).from(invoices);
    const [paidResult] = await db.select({ total: sum(invoices.total) }).from(invoices).where(eq(invoices.status, "paid"));
    const [overdueResult] = await db.select({ total: count() }).from(invoices).where(eq(invoices.status, "overdue"));
    const [pendingResult] = await db.select({ total: sum(invoices.total) }).from(invoices).where(eq(invoices.status, "sent"));
    return {
      total: totalResult?.total ?? 0,
      paidAmount: Number(paidResult?.total ?? 0),
      overdueCount: overdueResult?.total ?? 0,
      pendingAmount: Number(pendingResult?.total ?? 0),
    };
  }),
});

// ============================================================================
// BLOG ROUTER
// ============================================================================
export const blogRouter = router({
  list: adminProcedure
    .input(z.object({
      status: z.enum(["draft", "published", "archived"]).optional(),
      category: z.string().optional(),
      search: z.string().optional(),
      limit: z.number().default(50),
      offset: z.number().default(0),
    }).optional())
    .query(async ({ input }) => {
      const db = await getDb();
      const conditions: any[] = [];
      if (input?.status) conditions.push(eq(blogPosts.status, input.status));
      if (input?.search) conditions.push(like(blogPosts.title, `%${input.search}%`));
      if (input?.category) conditions.push(eq(blogPosts.category, input.category));
      const where = conditions.length > 0 ? and(...conditions) : undefined;
      const items = await db.select().from(blogPosts).where(where).orderBy(desc(blogPosts.createdAt)).limit(input?.limit ?? 50);
      const [totalResult] = await db.select({ total: count() }).from(blogPosts).where(where);
      return { items, total: totalResult?.total ?? 0 };
    }),

  getById: adminProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      const [post] = await db.select().from(blogPosts).where(eq(blogPosts.id, input.id));
      return post ?? null;
    }),

  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const db = await getDb();
      const [post] = await db.select().from(blogPosts).where(and(eq(blogPosts.slug, input.slug), eq(blogPosts.status, "published")));
      if (post) {
        await db.update(blogPosts).set({ viewCount: (post.viewCount ?? 0) + 1 }).where(eq(blogPosts.id, post.id));
      }
      return post ?? null;
    }),

  create: adminProcedure
    .input(z.object({
      title: z.string().min(1),
      titleFr: z.string().optional(),
      content: z.string().optional(),
      contentFr: z.string().optional(),
      excerpt: z.string().optional(),
      excerptFr: z.string().optional(),
      category: z.string().optional(),
      tags: z.string().optional(),
      featuredImageUrl: z.string().optional(),
      status: z.enum(["draft", "published", "archived"]).default("draft"),
      language: z.enum(["en", "fr", "both"]).default("en"),
      metaTitle: z.string().optional(),
      metaDescription: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      const slug = input.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      const uniqueSlug = `${slug}-${Date.now().toString(36)}`;
      const [result] = await db.insert(blogPosts).values({
        ...input,
        slug: uniqueSlug,
        authorId: ctx.user?.id,
        publishedAt: input.status === "published" ? new Date() : undefined,
      });
      return { id: result.insertId, slug: uniqueSlug, success: true };
    }),

  update: adminProcedure
    .input(z.object({
      id: z.number(),
      title: z.string().optional(),
      titleFr: z.string().optional(),
      content: z.string().optional(),
      contentFr: z.string().optional(),
      excerpt: z.string().optional(),
      excerptFr: z.string().optional(),
      category: z.string().optional(),
      tags: z.string().optional(),
      featuredImageUrl: z.string().optional(),
      status: z.enum(["draft", "published", "archived"]).optional(),
      language: z.enum(["en", "fr", "both"]).optional(),
      metaTitle: z.string().optional(),
      metaDescription: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      const { id, ...data } = input;
      const updateData: any = { ...data };
      if (data.status === "published") updateData.publishedAt = new Date();
      await db.update(blogPosts).set(updateData).where(eq(blogPosts.id, id));
      return { success: true };
    }),

  delete: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      await db.delete(blogPosts).where(eq(blogPosts.id, input.id));
      return { success: true };
    }),

  getCategories: adminProcedure.query(async () => {
    const db = await getDb();
    return db.select().from(blogCategories).orderBy(blogCategories.name);
  }),

  createCategory: adminProcedure
    .input(z.object({
      name: z.string().min(1),
      nameFr: z.string().optional(),
      description: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      const slug = input.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      const [result] = await db.insert(blogCategories).values({ ...input, slug });
      return { id: result.insertId, success: true };
    }),

  getStats: adminProcedure.query(async () => {
    const db = await getDb();
    const [totalResult] = await db.select({ total: count() }).from(blogPosts);
    const [publishedResult] = await db.select({ total: count() }).from(blogPosts).where(eq(blogPosts.status, "published"));
    const [viewsResult] = await db.select({ total: sum(blogPosts.viewCount) }).from(blogPosts);
    return {
      total: totalResult?.total ?? 0,
      published: publishedResult?.total ?? 0,
      totalViews: Number(viewsResult?.total ?? 0),
    };
  }),
});

// ============================================================================
// PODCASTS ROUTER
// ============================================================================
export const podcastsRouter = router({
  list: adminProcedure
    .input(z.object({
      status: z.enum(["active", "draft", "archived"]).optional(),
      limit: z.number().default(50),
    }).optional())
    .query(async ({ input }) => {
      const db = await getDb();
      const conditions: any[] = [];
      if (input?.status) conditions.push(eq(podcasts.status, input.status));
      const where = conditions.length > 0 ? and(...conditions) : undefined;
      const items = await db.select().from(podcasts).where(where).orderBy(desc(podcasts.createdAt)).limit(input?.limit ?? 50);
      return items;
    }),

  getById: adminProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      const [podcast] = await db.select().from(podcasts).where(eq(podcasts.id, input.id));
      if (!podcast) return null;
      const episodes = await db.select().from(podcastEpisodes).where(eq(podcastEpisodes.podcastId, input.id)).orderBy(desc(podcastEpisodes.episodeNumber));
      return { ...podcast, episodes };
    }),

  create: adminProcedure
    .input(z.object({
      title: z.string().min(1),
      titleFr: z.string().optional(),
      description: z.string().optional(),
      descriptionFr: z.string().optional(),
      coverImageUrl: z.string().optional(),
      rssFeedUrl: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      const slug = input.title.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" + Date.now().toString(36);
      const [result] = await db.insert(podcasts).values({ ...input, slug });
      return { id: result.insertId, success: true };
    }),

  update: adminProcedure
    .input(z.object({
      id: z.number(),
      title: z.string().optional(),
      titleFr: z.string().optional(),
      description: z.string().optional(),
      descriptionFr: z.string().optional(),
      coverImageUrl: z.string().optional(),
      rssFeedUrl: z.string().optional(),
      status: z.enum(["active", "draft", "archived"]).optional(),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      const { id, ...data } = input;
      await db.update(podcasts).set(data).where(eq(podcasts.id, id));
      return { success: true };
    }),

  delete: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      await db.delete(podcastEpisodes).where(eq(podcastEpisodes.podcastId, input.id));
      await db.delete(podcasts).where(eq(podcasts.id, input.id));
      return { success: true };
    }),

  // Episodes
  createEpisode: adminProcedure
    .input(z.object({
      podcastId: z.number(),
      title: z.string().min(1),
      titleFr: z.string().optional(),
      description: z.string().optional(),
      descriptionFr: z.string().optional(),
      audioUrl: z.string().optional(),
      duration: z.number().optional(),
      episodeNumber: z.number().optional(),
      seasonNumber: z.number().optional(),
      status: z.enum(["draft", "published", "archived"]).default("draft"),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      const [result] = await db.insert(podcastEpisodes).values({
        ...input,
        publishedAt: input.status === "published" ? new Date() : undefined,
      });
      // Update episode count
      await db.update(podcasts).set({ episodeCount: sql`episode_count + 1` }).where(eq(podcasts.id, input.podcastId));
      return { id: result.insertId, success: true };
    }),

  updateEpisode: adminProcedure
    .input(z.object({
      id: z.number(),
      title: z.string().optional(),
      titleFr: z.string().optional(),
      description: z.string().optional(),
      descriptionFr: z.string().optional(),
      audioUrl: z.string().optional(),
      duration: z.number().optional(),
      episodeNumber: z.number().optional(),
      seasonNumber: z.number().optional(),
      status: z.enum(["draft", "published", "archived"]).optional(),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      const { id, ...data } = input;
      const updateData: any = { ...data };
      if (data.status === "published") updateData.publishedAt = new Date();
      await db.update(podcastEpisodes).set(updateData).where(eq(podcastEpisodes.id, id));
      return { success: true };
    }),

  deleteEpisode: adminProcedure
    .input(z.object({ id: z.number(), podcastId: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      await db.delete(podcastEpisodes).where(eq(podcastEpisodes.id, input.id));
      await db.update(podcasts).set({ episodeCount: sql`GREATEST(episode_count - 1, 0)` }).where(eq(podcasts.id, input.podcastId));
      return { success: true };
    }),

  getStats: adminProcedure.query(async () => {
    const db = await getDb();
    const [totalResult] = await db.select({ total: count() }).from(podcasts);
    const [episodesResult] = await db.select({ total: count() }).from(podcastEpisodes);
    const [listensResult] = await db.select({ total: sum(podcasts.totalListens) }).from(podcasts);
    return {
      totalShows: totalResult?.total ?? 0,
      totalEpisodes: episodesResult?.total ?? 0,
      totalListens: Number(listensResult?.total ?? 0),
    };
  }),
});

// ============================================================================
// FORMS ROUTER
// ============================================================================
export const formsRouter = router({
  list: adminProcedure
    .input(z.object({
      status: z.enum(["active", "draft", "archived"]).optional(),
      type: z.enum(["contact", "lead", "event", "survey", "application", "custom"]).optional(),
      limit: z.number().default(50),
    }).optional())
    .query(async ({ input }) => {
      const db = await getDb();
      const conditions: any[] = [];
      if (input?.status) conditions.push(eq(forms.status, input.status));
      if (input?.type) conditions.push(eq(forms.type, input.type));
      const where = conditions.length > 0 ? and(...conditions) : undefined;
      return db.select().from(forms).where(where).orderBy(desc(forms.createdAt)).limit(input?.limit ?? 50);
    }),

  getById: adminProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      const [form] = await db.select().from(forms).where(eq(forms.id, input.id));
      return form ?? null;
    }),

  create: adminProcedure
    .input(z.object({
      name: z.string().min(1),
      nameFr: z.string().optional(),
      type: z.enum(["contact", "lead", "event", "survey", "application", "custom"]),
      fields: z.string().optional(),
      successMessage: z.string().optional(),
      notifyEmail: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      const [result] = await db.insert(forms).values(input);
      return { id: result.insertId, success: true };
    }),

  update: adminProcedure
    .input(z.object({
      id: z.number(),
      name: z.string().optional(),
      nameFr: z.string().optional(),
      type: z.enum(["contact", "lead", "event", "survey", "application", "custom"]).optional(),
      fields: z.string().optional(),
      status: z.enum(["active", "draft", "archived"]).optional(),
      successMessage: z.string().optional(),
      notifyEmail: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      const { id, ...data } = input;
      await db.update(forms).set(data).where(eq(forms.id, id));
      return { success: true };
    }),

  delete: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      await db.delete(formSubmissions).where(eq(formSubmissions.formId, input.id));
      await db.delete(forms).where(eq(forms.id, input.id));
      return { success: true };
    }),

  getSubmissions: adminProcedure
    .input(z.object({
      formId: z.number(),
      limit: z.number().default(100),
      offset: z.number().default(0),
    }))
    .query(async ({ input }) => {
      const db = await getDb();
      const items = await db.select().from(formSubmissions).where(eq(formSubmissions.formId, input.formId)).orderBy(desc(formSubmissions.createdAt)).limit(input.limit).offset(input.offset);
      const [totalResult] = await db.select({ total: count() }).from(formSubmissions).where(eq(formSubmissions.formId, input.formId));
      return { items, total: totalResult?.total ?? 0 };
    }),

  submitForm: publicProcedure
    .input(z.object({
      formId: z.number(),
      data: z.string(),
      submitterEmail: z.string().optional(),
      submitterName: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      await db.insert(formSubmissions).values(input);
      await db.update(forms).set({ submissionCount: sql`submission_count + 1` }).where(eq(forms.id, input.formId));
      return { success: true };
    }),

  getStats: adminProcedure.query(async () => {
    const db = await getDb();
    const [totalResult] = await db.select({ total: count() }).from(forms);
    const [activeResult] = await db.select({ total: count() }).from(forms).where(eq(forms.status, "active"));
    const [submissionsResult] = await db.select({ total: count() }).from(formSubmissions);
    return {
      totalForms: totalResult?.total ?? 0,
      activeForms: activeResult?.total ?? 0,
      totalSubmissions: submissionsResult?.total ?? 0,
    };
  }),
});

// ============================================================================
// NAVIGATION ROUTER
// ============================================================================
export const navigationRouter = router({
  list: adminProcedure
    .input(z.object({
      location: z.enum(["header", "footer", "both"]).optional(),
    }).optional())
    .query(async ({ input }) => {
      const db = await getDb();
      const conditions: any[] = [];
      if (input?.location) conditions.push(eq(navigationMenus.location, input.location));
      const where = conditions.length > 0 ? and(...conditions) : undefined;
      return db.select().from(navigationMenus).where(where).orderBy(navigationMenus.position);
    }),

  create: adminProcedure
    .input(z.object({
      label: z.string().min(1),
      labelFr: z.string().optional(),
      url: z.string(),
      target: z.enum(["_self", "_blank"]).default("_self"),
      location: z.enum(["header", "footer", "both"]),
      parentId: z.number().optional(),
      position: z.number().default(0),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      const [result] = await db.insert(navigationMenus).values(input);
      return { id: result.insertId, success: true };
    }),

  update: adminProcedure
    .input(z.object({
      id: z.number(),
      label: z.string().optional(),
      labelFr: z.string().optional(),
      url: z.string().optional(),
      target: z.enum(["_self", "_blank"]).optional(),
      location: z.enum(["header", "footer", "both"]).optional(),
      parentId: z.number().nullable().optional(),
      position: z.number().optional(),
      isActive: z.boolean().optional(),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      const { id, ...data } = input;
      await db.update(navigationMenus).set(data).where(eq(navigationMenus.id, id));
      return { success: true };
    }),

  delete: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      await db.delete(navigationMenus).where(eq(navigationMenus.id, input.id));
      return { success: true };
    }),

  reorder: adminProcedure
    .input(z.object({
      items: z.array(z.object({ id: z.number(), position: z.number() })),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      for (const item of input.items) {
        await db.update(navigationMenus).set({ position: item.position }).where(eq(navigationMenus.id, item.id));
      }
      return { success: true };
    }),
});

// ============================================================================
// ASSESSMENTS ROUTER
// ============================================================================
export const assessmentsRouter = router({
  list: adminProcedure
    .input(z.object({
      status: z.enum(["active", "draft", "archived"]).optional(),
      type: z.enum(["readiness", "proficiency", "placement", "custom"]).optional(),
      limit: z.number().default(50),
    }).optional())
    .query(async ({ input }) => {
      const db = await getDb();
      const conditions: any[] = [];
      if (input?.status) conditions.push(eq(assessments.status, input.status));
      if (input?.type) conditions.push(eq(assessments.type, input.type));
      const where = conditions.length > 0 ? and(...conditions) : undefined;
      return db.select().from(assessments).where(where).orderBy(desc(assessments.createdAt)).limit(input?.limit ?? 50);
    }),

  getById: adminProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      const [assessment] = await db.select().from(assessments).where(eq(assessments.id, input.id));
      return assessment ?? null;
    }),

  create: adminProcedure
    .input(z.object({
      name: z.string().min(1),
      nameFr: z.string().optional(),
      description: z.string().optional(),
      descriptionFr: z.string().optional(),
      type: z.enum(["readiness", "proficiency", "placement", "custom"]),
      questions: z.string().optional(),
      passingScore: z.number().default(70),
      timeLimit: z.number().optional(),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      const [result] = await db.insert(assessments).values(input);
      return { id: result.insertId, success: true };
    }),

  update: adminProcedure
    .input(z.object({
      id: z.number(),
      name: z.string().optional(),
      nameFr: z.string().optional(),
      description: z.string().optional(),
      descriptionFr: z.string().optional(),
      type: z.enum(["readiness", "proficiency", "placement", "custom"]).optional(),
      questions: z.string().optional(),
      passingScore: z.number().optional(),
      timeLimit: z.number().optional(),
      status: z.enum(["active", "draft", "archived"]).optional(),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      const { id, ...data } = input;
      await db.update(assessments).set(data).where(eq(assessments.id, id));
      return { success: true };
    }),

  delete: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      await db.delete(assessmentResults).where(eq(assessmentResults.assessmentId, input.id));
      await db.delete(assessments).where(eq(assessments.id, input.id));
      return { success: true };
    }),

  getResults: adminProcedure
    .input(z.object({
      assessmentId: z.number(),
      limit: z.number().default(100),
    }))
    .query(async ({ input }) => {
      const db = await getDb();
      return db.select().from(assessmentResults).where(eq(assessmentResults.assessmentId, input.assessmentId)).orderBy(desc(assessmentResults.createdAt)).limit(input.limit);
    }),

  submitAssessment: protectedProcedure
    .input(z.object({
      assessmentId: z.number(),
      answers: z.string(),
      score: z.number(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      const [assessment] = await db.select().from(assessments).where(eq(assessments.id, input.assessmentId));
      if (!assessment) throw new Error("Assessment not found");
      const passed = input.score >= (assessment.passingScore ?? 70);
      await db.insert(assessmentResults).values({
        assessmentId: input.assessmentId,
        userId: ctx.user.id,
        email: ctx.user.email ?? undefined,
        score: input.score,
        passed,
        answers: input.answers,
      });
      await db.update(assessments).set({
        completionCount: sql`completion_count + 1`,
        avgScore: sql`ROUND(((avg_score * completion_count) + ${input.score}) / (completion_count + 1))`,
      }).where(eq(assessments.id, input.assessmentId));
      return { passed, score: input.score, success: true };
    }),

  getStats: adminProcedure.query(async () => {
    const db = await getDb();
    const [totalResult] = await db.select({ total: count() }).from(assessments);
    const [completionsResult] = await db.select({ total: sum(assessments.completionCount) }).from(assessments);
    const [avgResult] = await db.select({ avg: sql<number>`AVG(avg_score)` }).from(assessments).where(eq(assessments.status, "active"));
    return {
      total: totalResult?.total ?? 0,
      totalCompletions: Number(completionsResult?.total ?? 0),
      avgScore: Math.round(Number(avgResult?.avg ?? 0)),
    };
  }),
});

// ============================================================================
// PAYMENTS OVERVIEW ROUTER (aggregated view)
// ============================================================================
export const paymentsOverviewRouter = router({
  getOverview: adminProcedure
    .input(z.object({
      period: z.enum(["7d", "30d", "90d", "1y", "all"]).default("30d"),
    }).optional())
    .query(async ({ input }) => {
      const db = await getDb();
      const period = input?.period ?? "30d";
      let dateFilter = "";
      if (period === "7d") dateFilter = "AND createdAt >= DATE_SUB(NOW(), INTERVAL 7 DAY)";
      else if (period === "30d") dateFilter = "AND createdAt >= DATE_SUB(NOW(), INTERVAL 30 DAY)";
      else if (period === "90d") dateFilter = "AND createdAt >= DATE_SUB(NOW(), INTERVAL 90 DAY)";
      else if (period === "1y") dateFilter = "AND createdAt >= DATE_SUB(NOW(), INTERVAL 1 YEAR)";

      // Aggregate from multiple payment sources
      const [invoiceRevenue] = await db.execute(sql.raw(`SELECT COALESCE(SUM(total), 0) as revenue, COUNT(*) as count FROM invoices WHERE status = 'paid' ${dateFilter}`));
      const [subscriptionRevenue] = await db.execute(sql.raw(`SELECT COALESCE(SUM(amount), 0) as revenue, COUNT(*) as count FROM coaching_plan_purchases WHERE status = 'completed' ${dateFilter}`));
      const [courseRevenue] = await db.execute(sql.raw(`SELECT COUNT(*) as count FROM course_enrollments WHERE 1=1 ${dateFilter}`));

      const inv = Array.isArray(invoiceRevenue) && invoiceRevenue[0] ? invoiceRevenue[0] as any : { revenue: 0, count: 0 };
      const sub = Array.isArray(subscriptionRevenue) && subscriptionRevenue[0] ? subscriptionRevenue[0] as any : { revenue: 0, count: 0 };
      const crs = Array.isArray(courseRevenue) && courseRevenue[0] ? courseRevenue[0] as any : { count: 0 };

      return {
        totalRevenue: Number(inv.revenue) + Number(sub.revenue),
        invoiceCount: Number(inv.count),
        subscriptionCount: Number(sub.count),
        enrollmentCount: Number(crs.count),
        period,
      };
    }),

  getRecentTransactions: adminProcedure
    .input(z.object({ limit: z.number().default(20) }).optional())
    .query(async ({ input }) => {
      const db = await getDb();
      const limit = input?.limit ?? 20;
      const [rows] = await db.execute(sql.raw(`
        (SELECT 'invoice' as type, invoiceNumber as reference, customerName as customer, total as amount, status, createdAt FROM invoices ORDER BY createdAt DESC LIMIT ${limit})
        UNION ALL
        (SELECT 'subscription' as type, CAST(id AS CHAR) as reference, '' as customer, amount, status, createdAt FROM coaching_plan_purchases ORDER BY createdAt DESC LIMIT ${limit})
        ORDER BY createdAt DESC LIMIT ${limit}
      `));
      return Array.isArray(rows) ? rows : [];
    }),
});

// ============================================================================
// MARKETING OVERVIEW ROUTER
// ============================================================================
export const marketingOverviewRouter = router({
  getOverview: adminProcedure.query(async () => {
    const db = await getDb();
    const [leadsResult] = await db.execute(sql`SELECT COUNT(*) as total FROM ecosystem_leads`);
    const [subscribersResult] = await db.execute(sql`SELECT COUNT(*) as total FROM newsletter_subscriptions WHERE isActive = 1`);
    const [emailsResult] = await db.execute(sql`SELECT COUNT(*) as total FROM email_logs WHERE createdAt >= DATE_SUB(NOW(), INTERVAL 30 DAY)`);
    const [funnelsResult] = await db.execute(sql`SELECT COUNT(*) as total FROM funnels WHERE status = 'active'`);
    const [automationsResult] = await db.execute(sql`SELECT COUNT(*) as total FROM automations WHERE status = 'active'`);
    const [eventsResult] = await db.execute(sql`SELECT COUNT(*) as total FROM community_events WHERE date >= NOW()`);

    const leads = Array.isArray(leadsResult) && leadsResult[0] ? (leadsResult[0] as any).total : 0;
    const subscribers = Array.isArray(subscribersResult) && subscribersResult[0] ? (subscribersResult[0] as any).total : 0;
    const emails = Array.isArray(emailsResult) && emailsResult[0] ? (emailsResult[0] as any).total : 0;
    const funnelsCount = Array.isArray(funnelsResult) && funnelsResult[0] ? (funnelsResult[0] as any).total : 0;
    const automationsCount = Array.isArray(automationsResult) && automationsResult[0] ? (automationsResult[0] as any).total : 0;
    const eventsCount = Array.isArray(eventsResult) && eventsResult[0] ? (eventsResult[0] as any).total : 0;

    return {
      totalLeads: Number(leads),
      activeSubscribers: Number(subscribers),
      emailsSent30d: Number(emails),
      activeFunnels: Number(funnelsCount),
      activeAutomations: Number(automationsCount),
      upcomingEvents: Number(eventsCount),
    };
  }),
});

// ============================================================================
// INBOX ROUTER (Universal Inbox)
// ============================================================================
export const inboxRouter = router({
  getMessages: adminProcedure
    .input(z.object({
      type: z.enum(["all", "contact", "lead", "form", "support"]).default("all"),
      limit: z.number().default(50),
      offset: z.number().default(0),
    }).optional())
    .query(async ({ input }) => {
      const db = await getDb();
      const limit = input?.limit ?? 50;
      const offset = input?.offset ?? 0;
      
      // Aggregate from multiple sources into a unified inbox
      const [contactMessages] = await db.execute(sql`
        SELECT 'contact' as source, id, name as senderName, email as senderEmail, message as content, status, createdAt
        FROM department_inquiries
        ORDER BY createdAt DESC
        LIMIT ${limit} OFFSET ${offset}
      `);

      const [formMessages] = await db.execute(sql`
        SELECT 'form' as source, fs.id, fs.submitterName as senderName, fs.submitterEmail as senderEmail, 
               CONCAT('Form: ', f.name, ' - ', LEFT(fs.data, 200)) as content, 'new' as status, fs.createdAt
        FROM form_submissions fs
        LEFT JOIN forms f ON f.id = fs.formId
        ORDER BY fs.createdAt DESC
        LIMIT ${limit} OFFSET ${offset}
      `);

      const contacts = Array.isArray(contactMessages) ? contactMessages : [];
      const formMsgs = Array.isArray(formMessages) ? formMessages : [];
      
      // Merge and sort by date
      const all = [...contacts, ...formMsgs].sort((a: any, b: any) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ).slice(0, limit);

      return { items: all, total: all.length };
    }),

  getStats: adminProcedure.query(async () => {
    const db = await getDb();
    const [contactCount] = await db.execute(sql`SELECT COUNT(*) as total FROM department_inquiries WHERE status = 'new' OR status = 'pending'`);
    const [formCount] = await db.execute(sql`SELECT COUNT(*) as total FROM form_submissions WHERE createdAt >= DATE_SUB(NOW(), INTERVAL 7 DAY)`);
    const contacts = Array.isArray(contactCount) && contactCount[0] ? (contactCount[0] as any).total : 0;
    const formSubs = Array.isArray(formCount) && formCount[0] ? (formCount[0] as any).total : 0;
    return {
      unread: Number(contacts),
      recentFormSubmissions: Number(formSubs),
      total: Number(contacts) + Number(formSubs),
    };
  }),
});

// ============================================================================
// CONTACTS OVERVIEW ROUTER (All Contacts unified view)
// ============================================================================
export const contactsOverviewRouter = router({
  getAll: adminProcedure
    .input(z.object({
      search: z.string().optional(),
      role: z.string().optional(),
      limit: z.number().default(50),
      offset: z.number().default(0),
    }).optional())
    .query(async ({ input }) => {
      const db = await getDb();
      const limit = input?.limit ?? 50;
      const offset = input?.offset ?? 0;
      const search = input?.search ? `%${input.search}%` : null;
      const role = input?.role;

      let query = `SELECT id, openId, name, email, role, avatarUrl, preferredLanguage, createdAt, lastSignedIn FROM users WHERE 1=1`;
      if (search) query += ` AND (name LIKE '${search}' OR email LIKE '${search}')`;
      if (role) query += ` AND role = '${role}'`;
      query += ` ORDER BY createdAt DESC LIMIT ${limit} OFFSET ${offset}`;

      const [rows] = await db.execute(sql.raw(query));
      const [totalResult] = await db.execute(sql.raw(`SELECT COUNT(*) as total FROM users WHERE 1=1${search ? ` AND (name LIKE '${search}' OR email LIKE '${search}')` : ''}${role ? ` AND role = '${role}'` : ''}`));
      
      return {
        items: Array.isArray(rows) ? rows : [],
        total: Array.isArray(totalResult) && totalResult[0] ? Number((totalResult[0] as any).total) : 0,
      };
    }),

  getStats: adminProcedure.query(async () => {
    const db = await getDb();
    const [totalResult] = await db.execute(sql`SELECT COUNT(*) as total FROM users`);
    const [learnersResult] = await db.execute(sql`SELECT COUNT(*) as total FROM users WHERE role = 'learner'`);
    const [coachesResult] = await db.execute(sql`SELECT COUNT(*) as total FROM users WHERE role = 'coach'`);
    const [newResult] = await db.execute(sql`SELECT COUNT(*) as total FROM users WHERE createdAt >= DATE_SUB(NOW(), INTERVAL 30 DAY)`);
    const [leadsResult] = await db.execute(sql`SELECT COUNT(*) as total FROM ecosystem_leads`);

    const total = Array.isArray(totalResult) && totalResult[0] ? (totalResult[0] as any).total : 0;
    const learners = Array.isArray(learnersResult) && learnersResult[0] ? (learnersResult[0] as any).total : 0;
    const coaches = Array.isArray(coachesResult) && coachesResult[0] ? (coachesResult[0] as any).total : 0;
    const newUsers = Array.isArray(newResult) && newResult[0] ? (newResult[0] as any).total : 0;
    const leads = Array.isArray(leadsResult) && leadsResult[0] ? (leadsResult[0] as any).total : 0;

    return {
      totalContacts: Number(total),
      learners: Number(learners),
      coaches: Number(coaches),
      newThisMonth: Number(newUsers),
      leads: Number(leads),
    };
  }),
});

// ============================================================================
// CONTACT INSIGHTS ROUTER
// ============================================================================
export const contactInsightsRouter = router({
  getInsights: adminProcedure
    .input(z.object({
      period: z.enum(["7d", "30d", "90d", "1y"]).default("30d"),
    }).optional())
    .query(async ({ input }) => {
      const db = await getDb();
      const period = input?.period ?? "30d";
      let interval = "30 DAY";
      if (period === "7d") interval = "7 DAY";
      else if (period === "90d") interval = "90 DAY";
      else if (period === "1y") interval = "1 YEAR";

      const [signupTrend] = await db.execute(sql.raw(`
        SELECT DATE(createdAt) as date, COUNT(*) as count 
        FROM users 
        WHERE createdAt >= DATE_SUB(NOW(), INTERVAL ${interval})
        GROUP BY DATE(createdAt) 
        ORDER BY date
      `));

      const [roleDist] = await db.execute(sql.raw(`
        SELECT role, COUNT(*) as count FROM users GROUP BY role ORDER BY count DESC
      `));

      const [langDist] = await db.execute(sql.raw(`
        SELECT preferredLanguage as lang, COUNT(*) as count FROM users GROUP BY preferredLanguage ORDER BY count DESC
      `));

      const [activeUsers] = await db.execute(sql.raw(`
        SELECT COUNT(*) as total FROM users WHERE lastSignedIn >= DATE_SUB(NOW(), INTERVAL ${interval})
      `));

      return {
        signupTrend: Array.isArray(signupTrend) ? signupTrend : [],
        roleDistribution: Array.isArray(roleDist) ? roleDist : [],
        languageDistribution: Array.isArray(langDist) ? langDist : [],
        activeUsers: Array.isArray(activeUsers) && activeUsers[0] ? Number((activeUsers[0] as any).total) : 0,
        period,
      };
    }),
});

// ============================================================================
// REPORTS ROUTER (Analytics Reports)
// ============================================================================
export const reportsRouter = router({
  getRevenueReport: adminProcedure
    .input(z.object({
      period: z.enum(["7d", "30d", "90d", "1y"]).default("30d"),
    }).optional())
    .query(async ({ input }) => {
      const db = await getDb();
      const period = input?.period ?? "30d";
      let interval = "30 DAY";
      if (period === "7d") interval = "7 DAY";
      else if (period === "90d") interval = "90 DAY";
      else if (period === "1y") interval = "1 YEAR";

      const [revenueTrend] = await db.execute(sql.raw(`
        SELECT DATE(createdAt) as date, SUM(total) as revenue, COUNT(*) as transactions
        FROM invoices WHERE status = 'paid' AND createdAt >= DATE_SUB(NOW(), INTERVAL ${interval})
        GROUP BY DATE(createdAt) ORDER BY date
      `));

      const [topProducts] = await db.execute(sql.raw(`
        SELECT o.name, o.salesCount, o.revenue
        FROM offers o WHERE o.status = 'active'
        ORDER BY o.revenue DESC LIMIT 10
      `));

      return {
        revenueTrend: Array.isArray(revenueTrend) ? revenueTrend : [],
        topProducts: Array.isArray(topProducts) ? topProducts : [],
        period,
      };
    }),

  getEnrollmentReport: adminProcedure
    .input(z.object({
      period: z.enum(["7d", "30d", "90d", "1y"]).default("30d"),
    }).optional())
    .query(async ({ input }) => {
      const db = await getDb();
      const period = input?.period ?? "30d";
      let interval = "30 DAY";
      if (period === "7d") interval = "7 DAY";
      else if (period === "90d") interval = "90 DAY";
      else if (period === "1y") interval = "1 YEAR";

      const [enrollmentTrend] = await db.execute(sql.raw(`
        SELECT DATE(enrolledAt) as date, COUNT(*) as enrollments
        FROM course_enrollments WHERE enrolledAt >= DATE_SUB(NOW(), INTERVAL ${interval})
        GROUP BY DATE(enrolledAt) ORDER BY date
      `));

      const [topCourses] = await db.execute(sql.raw(`
        SELECT c.title, COUNT(ce.id) as enrollments
        FROM courses c LEFT JOIN course_enrollments ce ON ce.courseId = c.id
        GROUP BY c.id, c.title ORDER BY enrollments DESC LIMIT 10
      `));

      const [completionRate] = await db.execute(sql.raw(`
        SELECT 
          COUNT(*) as total,
          SUM(CASE WHEN progress >= 100 THEN 1 ELSE 0 END) as completed
        FROM course_enrollments
      `));

      const cr = Array.isArray(completionRate) && completionRate[0] ? completionRate[0] as any : { total: 0, completed: 0 };

      return {
        enrollmentTrend: Array.isArray(enrollmentTrend) ? enrollmentTrend : [],
        topCourses: Array.isArray(topCourses) ? topCourses : [],
        completionRate: cr.total > 0 ? Math.round((Number(cr.completed) / Number(cr.total)) * 100) : 0,
        period,
      };
    }),

  getEngagementReport: adminProcedure.query(async () => {
    const db = await getDb();
    const [dau] = await db.execute(sql`SELECT COUNT(DISTINCT id) as total FROM users WHERE lastSignedIn >= DATE_SUB(NOW(), INTERVAL 1 DAY)`);
    const [wau] = await db.execute(sql`SELECT COUNT(DISTINCT id) as total FROM users WHERE lastSignedIn >= DATE_SUB(NOW(), INTERVAL 7 DAY)`);
    const [mau] = await db.execute(sql`SELECT COUNT(DISTINCT id) as total FROM users WHERE lastSignedIn >= DATE_SUB(NOW(), INTERVAL 30 DAY)`);
    const [forumActivity] = await db.execute(sql`SELECT COUNT(*) as total FROM forum_posts WHERE createdAt >= DATE_SUB(NOW(), INTERVAL 30 DAY)`);

    return {
      dau: Array.isArray(dau) && dau[0] ? Number((dau[0] as any).total) : 0,
      wau: Array.isArray(wau) && wau[0] ? Number((wau[0] as any).total) : 0,
      mau: Array.isArray(mau) && mau[0] ? Number((mau[0] as any).total) : 0,
      forumPosts30d: Array.isArray(forumActivity) && forumActivity[0] ? Number((forumActivity[0] as any).total) : 0,
    };
  }),
});

// ============================================================================
// DESIGN ADMIN ROUTER (Theme & Branding)
// ============================================================================
export const designRouter = router({
  getTheme: adminProcedure.query(async () => {
    const db = await getDb();
    const [rows] = await db.execute(sql`SELECT settingKey, settingValue FROM platform_settings WHERE settingKey LIKE 'theme_%' OR settingKey LIKE 'brand_%'`);
    const settings: Record<string, string> = {};
    if (Array.isArray(rows)) {
      rows.forEach((row: any) => { settings[row.settingKey] = row.settingValue; });
    }
    return settings;
  }),

  updateTheme: adminProcedure
    .input(z.object({
      key: z.string(),
      value: z.string(),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      await db.execute(sql`
        INSERT INTO platform_settings (settingKey, settingValue, updatedAt) 
        VALUES (${input.key}, ${input.value}, NOW())
        ON DUPLICATE KEY UPDATE settingValue = ${input.value}, updatedAt = NOW()
      `);
      return { success: true };
    }),

  updateMultiple: adminProcedure
    .input(z.object({
      settings: z.array(z.object({ key: z.string(), value: z.string() })),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      for (const setting of input.settings) {
        await db.execute(sql`
          INSERT INTO platform_settings (settingKey, settingValue, updatedAt) 
          VALUES (${setting.key}, ${setting.value}, NOW())
          ON DUPLICATE KEY UPDATE settingValue = ${setting.value}, updatedAt = NOW()
        `);
      }
      return { success: true };
    }),
});

// ============================================================================
// EVENTS ADMIN ROUTER (extends existing communityEvents)
// ============================================================================
export const eventsAdminRouter = router({
  list: adminProcedure
    .input(z.object({
      status: z.string().optional(),
      limit: z.number().default(50),
    }).optional())
    .query(async ({ input }) => {
      const db = await getDb();
      const limit = input?.limit ?? 50;
      const [rows] = await db.execute(sql`
        SELECT ce.*, 
          (SELECT COUNT(*) FROM event_registrations er WHERE er.eventId = ce.id) as registrationCount
        FROM community_events ce
        ORDER BY ce.date DESC
        LIMIT ${limit}
      `);
      return Array.isArray(rows) ? rows : [];
    }),

  getStats: adminProcedure.query(async () => {
    const db = await getDb();
    const [totalResult] = await db.execute(sql`SELECT COUNT(*) as total FROM community_events`);
    const [upcomingResult] = await db.execute(sql`SELECT COUNT(*) as total FROM community_events WHERE date >= NOW()`);
    const [registrationsResult] = await db.execute(sql`SELECT COUNT(*) as total FROM event_registrations`);
    return {
      total: Array.isArray(totalResult) && totalResult[0] ? Number((totalResult[0] as any).total) : 0,
      upcoming: Array.isArray(upcomingResult) && upcomingResult[0] ? Number((upcomingResult[0] as any).total) : 0,
      totalRegistrations: Array.isArray(registrationsResult) && registrationsResult[0] ? Number((registrationsResult[0] as any).total) : 0,
    };
  }),
});

// ============================================================================
// DOWNLOADS ADMIN ROUTER (extends existing downloadableResources)
// ============================================================================
export const downloadsAdminRouter = router({
  list: adminProcedure
    .input(z.object({
      limit: z.number().default(50),
    }).optional())
    .query(async ({ input }) => {
      const db = await getDb();
      const limit = input?.limit ?? 50;
      const [rows] = await db.execute(sql`
        SELECT dr.*, 
          (SELECT COUNT(*) FROM resource_downloads rd WHERE rd.resourceId = dr.id) as downloadCount
        FROM downloadable_resources dr
        ORDER BY dr.createdAt DESC
        LIMIT ${limit}
      `);
      return Array.isArray(rows) ? rows : [];
    }),

  getStats: adminProcedure.query(async () => {
    const db = await getDb();
    const [totalResult] = await db.execute(sql`SELECT COUNT(*) as total FROM downloadable_resources`);
    const [downloadsResult] = await db.execute(sql`SELECT COUNT(*) as total FROM resource_downloads`);
    return {
      totalResources: Array.isArray(totalResult) && totalResult[0] ? Number((totalResult[0] as any).total) : 0,
      totalDownloads: Array.isArray(downloadsResult) && downloadsResult[0] ? Number((downloadsResult[0] as any).total) : 0,
    };
  }),
});

// ============================================================================
// NEWSLETTERS ADMIN ROUTER (extends existing newsletterSubscriptions)
// ============================================================================
export const newslettersAdminRouter = router({
  getSubscribers: adminProcedure
    .input(z.object({
      search: z.string().optional(),
      isActive: z.boolean().optional(),
      limit: z.number().default(50),
      offset: z.number().default(0),
    }).optional())
    .query(async ({ input }) => {
      const db = await getDb();
      const limit = input?.limit ?? 50;
      const offset = input?.offset ?? 0;
      let query = `SELECT * FROM newsletter_subscriptions WHERE 1=1`;
      if (input?.search) query += ` AND email LIKE '%${input.search}%'`;
      if (input?.isActive !== undefined) query += ` AND isActive = ${input.isActive ? 1 : 0}`;
      query += ` ORDER BY subscribedAt DESC LIMIT ${limit} OFFSET ${offset}`;
      const [rows] = await db.execute(sql.raw(query));
      const [totalResult] = await db.execute(sql`SELECT COUNT(*) as total FROM newsletter_subscriptions`);
      return {
        items: Array.isArray(rows) ? rows : [],
        total: Array.isArray(totalResult) && totalResult[0] ? Number((totalResult[0] as any).total) : 0,
      };
    }),

  getStats: adminProcedure.query(async () => {
    const db = await getDb();
    const [totalResult] = await db.execute(sql`SELECT COUNT(*) as total FROM newsletter_subscriptions`);
    const [activeResult] = await db.execute(sql`SELECT COUNT(*) as total FROM newsletter_subscriptions WHERE isActive = 1`);
    const [recentResult] = await db.execute(sql`SELECT COUNT(*) as total FROM newsletter_subscriptions WHERE subscribedAt >= DATE_SUB(NOW(), INTERVAL 30 DAY)`);
    return {
      total: Array.isArray(totalResult) && totalResult[0] ? Number((totalResult[0] as any).total) : 0,
      active: Array.isArray(activeResult) && activeResult[0] ? Number((activeResult[0] as any).total) : 0,
      newThisMonth: Array.isArray(recentResult) && recentResult[0] ? Number((recentResult[0] as any).total) : 0,
    };
  }),
});

// ============================================================================
// COMMUNITY ADMIN ROUTER (extends existing forum tables)
// ============================================================================
export const communityAdminRouter = router({
  getOverview: adminProcedure.query(async () => {
    const db = await getDb();
    const [categoriesResult] = await db.execute(sql`SELECT COUNT(*) as total FROM forum_categories`);
    const [threadsResult] = await db.execute(sql`SELECT COUNT(*) as total FROM forum_threads`);
    const [postsResult] = await db.execute(sql`SELECT COUNT(*) as total FROM forum_posts`);
    const [activeResult] = await db.execute(sql`SELECT COUNT(*) as total FROM forum_posts WHERE createdAt >= DATE_SUB(NOW(), INTERVAL 7 DAY)`);
    return {
      categories: Array.isArray(categoriesResult) && categoriesResult[0] ? Number((categoriesResult[0] as any).total) : 0,
      threads: Array.isArray(threadsResult) && threadsResult[0] ? Number((threadsResult[0] as any).total) : 0,
      posts: Array.isArray(postsResult) && postsResult[0] ? Number((postsResult[0] as any).total) : 0,
      activeThisWeek: Array.isArray(activeResult) && activeResult[0] ? Number((activeResult[0] as any).total) : 0,
    };
  }),

  getRecentThreads: adminProcedure
    .input(z.object({ limit: z.number().default(20) }).optional())
    .query(async ({ input }) => {
      const db = await getDb();
      const limit = input?.limit ?? 20;
      const [rows] = await db.execute(sql`
        SELECT ft.*, u.name as authorName, fc.name as categoryName,
          (SELECT COUNT(*) FROM forum_posts fp WHERE fp.threadId = ft.id) as replyCount
        FROM forum_threads ft
        LEFT JOIN users u ON u.id = ft.authorId
        LEFT JOIN forum_categories fc ON fc.id = ft.categoryId
        ORDER BY ft.createdAt DESC
        LIMIT ${limit}
      `);
      return Array.isArray(rows) ? rows : [];
    }),

  getFlaggedContent: adminProcedure.query(async () => {
    const db = await getDb();
    const [rows] = await db.execute(sql`
      SELECT fp.*, u.name as authorName, ft.title as threadTitle
      FROM forum_posts fp
      LEFT JOIN users u ON u.id = fp.authorId
      LEFT JOIN forum_threads ft ON ft.id = fp.threadId
      WHERE fp.isHidden = 1
      ORDER BY fp.createdAt DESC
      LIMIT 50
    `);
    return Array.isArray(rows) ? rows : [];
  }),
});

// ============================================================================
// ALL PRODUCTS UNIFIED ROUTER
// ============================================================================
export const allProductsRouter = router({
  getOverview: adminProcedure.query(async () => {
    const db = await getDb();
    const [coursesResult] = await db.execute(sql`SELECT COUNT(*) as total FROM courses`);
    const [pathsResult] = await db.execute(sql`SELECT COUNT(*) as total FROM learning_paths`);
    const [podcastsResult] = await db.select({ total: count() }).from(podcasts);
    const [downloadsResult] = await db.execute(sql`SELECT COUNT(*) as total FROM downloadable_resources`);
    const [enrollmentsResult] = await db.execute(sql`SELECT COUNT(*) as total FROM course_enrollments`);

    return {
      courses: Array.isArray(coursesResult) && coursesResult[0] ? Number((coursesResult[0] as any).total) : 0,
      paths: Array.isArray(pathsResult) && pathsResult[0] ? Number((pathsResult[0] as any).total) : 0,
      podcasts: podcastsResult?.total ?? 0,
      downloads: Array.isArray(downloadsResult) && downloadsResult[0] ? Number((downloadsResult[0] as any).total) : 0,
      totalEnrollments: Array.isArray(enrollmentsResult) && enrollmentsResult[0] ? Number((enrollmentsResult[0] as any).total) : 0,
    };
  }),
});
