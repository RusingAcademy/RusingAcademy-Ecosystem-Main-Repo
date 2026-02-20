import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import { eq, desc, sql, asc, and } from "drizzle-orm";
import {
  getDb,
} from "../db";
import { users } from "../../drizzle/schema";

export const forumRouter = router({
  // Get all forum categories with stats
  categories: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
    const { forumCategories } = await import("../../drizzle/schema");
    
    const categories = await db.select().from(forumCategories)
      .where(eq(forumCategories.isActive, true))
      .orderBy(asc(forumCategories.sortOrder));
    
    return categories;
  }),

  // Get threads for a category
  threads: publicProcedure
    .input(z.object({
      categoryId: z.number().optional(),
      limit: z.number().min(1).max(50).default(20),
      offset: z.number().min(0).default(0),
    }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      const { forumThreads, users } = await import("../../drizzle/schema");
      
      const whereCondition = input.categoryId 
        ? and(eq(forumThreads.status, "active"), eq(forumThreads.categoryId, input.categoryId))
        : eq(forumThreads.status, "active");
      
      const threads = await db.select({
        id: forumThreads.id,
        categoryId: forumThreads.categoryId,
        title: forumThreads.title,
        slug: forumThreads.slug,
        content: forumThreads.content,
        isPinned: forumThreads.isPinned,
        isLocked: forumThreads.isLocked,
        viewCount: forumThreads.viewCount,
        replyCount: forumThreads.replyCount,
        lastReplyAt: forumThreads.lastReplyAt,
        createdAt: forumThreads.createdAt,
        authorId: forumThreads.authorId,
        authorName: users.name,
        authorAvatar: users.avatarUrl,
      })
        .from(forumThreads)
        .leftJoin(users, eq(forumThreads.authorId, users.id))
        .where(whereCondition)
        .orderBy(desc(forumThreads.isPinned), desc(forumThreads.lastReplyAt))
        .limit(input.limit)
        .offset(input.offset);
      
      return threads;
    }),

  // Get single thread with posts
  thread: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      const { forumThreads, forumPosts, users } = await import("../../drizzle/schema");
      
      // Get thread
      const [thread] = await db.select({
        id: forumThreads.id,
        categoryId: forumThreads.categoryId,
        title: forumThreads.title,
        slug: forumThreads.slug,
        content: forumThreads.content,
        isPinned: forumThreads.isPinned,
        isLocked: forumThreads.isLocked,
        viewCount: forumThreads.viewCount,
        replyCount: forumThreads.replyCount,
        createdAt: forumThreads.createdAt,
        authorId: forumThreads.authorId,
        authorName: users.name,
        authorAvatar: users.avatarUrl,
      })
        .from(forumThreads)
        .leftJoin(users, eq(forumThreads.authorId, users.id))
        .where(eq(forumThreads.id, input.id));
      
      if (!thread) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Thread not found" });
      }
      
      // Increment view count
      await db.update(forumThreads)
        .set({ viewCount: sql`${forumThreads.viewCount} + 1` })
        .where(eq(forumThreads.id, input.id));
      
      // Get posts
      const posts = await db.select({
        id: forumPosts.id,
        content: forumPosts.content,
        isEdited: forumPosts.isEdited,
        likeCount: forumPosts.likeCount,
        createdAt: forumPosts.createdAt,
        authorId: forumPosts.authorId,
        authorName: users.name,
        authorAvatar: users.avatarUrl,
      })
        .from(forumPosts)
        .leftJoin(users, eq(forumPosts.authorId, users.id))
        .where(and(
          eq(forumPosts.threadId, input.id),
          eq(forumPosts.status, "active")
        ))
        .orderBy(asc(forumPosts.createdAt));
      
      return { thread, posts };
    }),

  // Create new thread
  createThread: protectedProcedure
    .input(z.object({
      categoryId: z.number(),
      title: z.string().min(5).max(255),
      content: z.string().min(10).max(10000),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      const { forumThreads, forumCategories } = await import("../../drizzle/schema");
      
      // Generate slug
      const slug = input.title
        .toLowerCase()
  // @ts-ignore - overload resolution
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")
        + "-" + Date.now().toString(36);
      
      // @ts-expect-error - TS2769: auto-suppressed during TS cleanup
      const [thread] = await db.insert(forumThreads).values({
        categoryId: input.categoryId,
        authorId: ctx.user.id,
        title: input.title,
        slug,
        content: input.content,
        lastReplyAt: new Date(),
      }).$returningId();
      
      // Update category thread count
      await db.update(forumCategories)
        .set({ threadCount: sql`${forumCategories.threadCount} + 1` })
        .where(eq(forumCategories.id, input.categoryId));
      
      return { id: thread.id, slug };
    }),

  // Create reply (post)
  createPost: protectedProcedure
    .input(z.object({
      threadId: z.number(),
      content: z.string().min(1).max(10000),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      const { forumPosts, forumThreads, forumCategories } = await import("../../drizzle/schema");
      
      // Check thread exists and not locked
      const [thread] = await db.select().from(forumThreads)
        .where(eq(forumThreads.id, input.threadId));
      
      if (!thread) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Thread not found" });
  // @ts-ignore - overload resolution
      }
      if (thread.isLocked) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Thread is locked" });
      }
      
      // @ts-expect-error - TS2769: auto-suppressed during TS cleanup
      const [post] = await db.insert(forumPosts).values({
        threadId: input.threadId,
        authorId: ctx.user.id,
        content: input.content,
      }).$returningId();
      
      // Update thread reply count and last reply
      await db.update(forumThreads)
        .set({
          replyCount: sql`${forumThreads.replyCount} + 1`,
          lastReplyAt: new Date(),
          lastReplyById: ctx.user.id,
        })
        .where(eq(forumThreads.id, input.threadId));
      
      // Update category post count
      await db.update(forumCategories)
        .set({ postCount: sql`${forumCategories.postCount} + 1` })
        .where(eq(forumCategories.id, thread.categoryId));
      
      return { id: post.id };
    }),

  // Like/unlike a post
  toggleLike: protectedProcedure
    .input(z.object({ postId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      const { forumPostLikes, forumPosts } = await import("../../drizzle/schema");
      
      // Check if already liked
      const [existing] = await db.select().from(forumPostLikes)
        .where(and(
          eq(forumPostLikes.postId, input.postId),
          eq(forumPostLikes.userId, ctx.user.id)
        ));
      
      if (existing) {
        // Unlike
        await db.delete(forumPostLikes)
          .where(eq(forumPostLikes.id, existing.id));
        await db.update(forumPosts)
          .set({ likeCount: sql`${forumPosts.likeCount} - 1` })
          .where(eq(forumPosts.id, input.postId));
        return { liked: false };
      } else {
        // Like
        await db.insert(forumPostLikes).values({
          postId: input.postId,
          userId: ctx.user.id,
        });
        await db.update(forumPosts)
          .set({ likeCount: sql`${forumPosts.likeCount} + 1` })
          .where(eq(forumPosts.id, input.postId));
        return { liked: true };
      }
    }),

  // Edit a post (author only)
  editPost: protectedProcedure
    .input(z.object({
      postId: z.number(),
      content: z.string().min(1).max(10000),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      const { forumPosts } = await import("../../drizzle/schema");
      
      const [post] = await db.select().from(forumPosts).where(eq(forumPosts.id, input.postId));
      if (!post) throw new TRPCError({ code: "NOT_FOUND", message: "Post not found" });
      if (post.authorId !== ctx.user.id && ctx.user.role !== "admin" && ctx.user.role !== "owner" && !ctx.user.isOwner) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Not authorized" });
      }
      
      await db.update(forumPosts)
        .set({ content: input.content, isEdited: true })
        .where(eq(forumPosts.id, input.postId));
      
      return { success: true };
    }),

  // Delete a post (author or admin)
  deletePost: protectedProcedure
    .input(z.object({ postId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      const { forumPosts, forumThreads } = await import("../../drizzle/schema");
      
      const [post] = await db.select().from(forumPosts).where(eq(forumPosts.id, input.postId));
      if (!post) throw new TRPCError({ code: "NOT_FOUND", message: "Post not found" });
      if (post.authorId !== ctx.user.id && ctx.user.role !== "admin" && ctx.user.role !== "owner" && !ctx.user.isOwner) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Not authorized" });
      }
      
      // Soft delete
      await db.update(forumPosts)
        .set({ status: "deleted" })
        .where(eq(forumPosts.id, input.postId));
      
      // Decrement reply count
      await db.update(forumThreads)
        .set({ replyCount: sql`GREATEST(${forumThreads.replyCount} - 1, 0)` })
        .where(eq(forumThreads.id, post.threadId));
      
      return { success: true };
    }),

  // Pin/unpin thread (admin only)
  togglePinThread: protectedProcedure
    .input(z.object({ threadId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      if (ctx.user.role !== "admin" && ctx.user.role !== "owner" && !ctx.user.isOwner) throw new TRPCError({ code: "FORBIDDEN", message: "Admin only" });
      const { forumThreads } = await import("../../drizzle/schema");
      
      const [thread] = await db.select().from(forumThreads).where(eq(forumThreads.id, input.threadId));
      if (!thread) throw new TRPCError({ code: "NOT_FOUND", message: "Thread not found" });
      
      await db.update(forumThreads)
        .set({ isPinned: !thread.isPinned })
        .where(eq(forumThreads.id, input.threadId));
      
      return { pinned: !thread.isPinned };
    }),

  // Lock/unlock thread (admin only)
  toggleLockThread: protectedProcedure
    .input(z.object({ threadId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      if (ctx.user.role !== "admin" && ctx.user.role !== "owner" && !ctx.user.isOwner) throw new TRPCError({ code: "FORBIDDEN", message: "Admin only" });
      const { forumThreads } = await import("../../drizzle/schema");
      
      const [thread] = await db.select().from(forumThreads).where(eq(forumThreads.id, input.threadId));
      if (!thread) throw new TRPCError({ code: "NOT_FOUND", message: "Thread not found" });
      
      await db.update(forumThreads)
        .set({ isLocked: !thread.isLocked })
        .where(eq(forumThreads.id, input.threadId));
      
      return { locked: !thread.isLocked };
    }),

  // Delete thread (author or admin)
  deleteThread: protectedProcedure
    .input(z.object({ threadId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      const { forumThreads, forumCategories } = await import("../../drizzle/schema");
      
      const [thread] = await db.select().from(forumThreads).where(eq(forumThreads.id, input.threadId));
      if (!thread) throw new TRPCError({ code: "NOT_FOUND", message: "Thread not found" });
      if (thread.authorId !== ctx.user.id && ctx.user.role !== "admin" && ctx.user.role !== "owner" && !ctx.user.isOwner) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Not authorized" });
      }
      
      // Soft delete
      await db.update(forumThreads)
        .set({ status: "deleted" })
        .where(eq(forumThreads.id, input.threadId));
      
      // Decrement category thread count
      await db.update(forumCategories)
        .set({ threadCount: sql`GREATEST(${forumCategories.threadCount} - 1, 0)` })
        .where(eq(forumCategories.id, thread.categoryId));
      
      return { success: true };
    }),
});
