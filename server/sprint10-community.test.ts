import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";

describe("Sprint 10: Community & Forum Activation", () => {
  
  describe("Forum Router - CRUD Operations", () => {
    const forumRouterPath = path.resolve(__dirname, "routers/forum.ts");
    let forumContent: string;
    
    it("forum router file exists", () => {
      expect(fs.existsSync(forumRouterPath)).toBe(true);
      forumContent = fs.readFileSync(forumRouterPath, "utf-8");
    });
    
    it("has categories listing procedure", () => {
      expect(forumContent).toContain("categories: publicProcedure");
    });
    
    it("has threads listing procedure with category filter", () => {
      expect(forumContent).toContain("threads: publicProcedure");
      expect(forumContent).toContain("categoryId: z.number().optional()");
    });
    
    it("has single thread view with posts", () => {
      expect(forumContent).toContain("thread: publicProcedure");
      expect(forumContent).toContain("return { thread, posts }");
    });
    
    it("increments view count on thread view", () => {
      expect(forumContent).toContain("viewCount: sql`${forumThreads.viewCount} + 1`");
    });
    
    it("has createThread procedure with slug generation", () => {
      expect(forumContent).toContain("createThread: protectedProcedure");
      expect(forumContent).toContain("slug");
    });
    
    it("stores thread content in content field (not description)", () => {
      // Verify the bug fix: createThread should use content, not description
      const createThreadSection = forumContent.substring(
        forumContent.indexOf("createThread:"),
        forumContent.indexOf("createPost:")
      );
      expect(createThreadSection).toContain("content: input.content");
      expect(createThreadSection).not.toContain("description: input.content");
    });
    
    it("stores post content in content field (not description)", () => {
      const createPostSection = forumContent.substring(
        forumContent.indexOf("createPost:"),
        forumContent.indexOf("toggleLike:")
      );
      expect(createPostSection).toContain("content: input.content");
      expect(createPostSection).not.toContain("description: input.content");
    });
    
    it("has createPost procedure with locked thread check", () => {
      expect(forumContent).toContain("createPost: protectedProcedure");
      expect(forumContent).toContain("Thread is locked");
    });
    
    it("has toggleLike procedure for post likes", () => {
      expect(forumContent).toContain("toggleLike: protectedProcedure");
      expect(forumContent).toContain("forumPostLikes");
    });
    
    it("updates reply count and last reply on new post", () => {
      expect(forumContent).toContain("replyCount: sql`${forumThreads.replyCount} + 1`");
      expect(forumContent).toContain("lastReplyAt: new Date()");
      expect(forumContent).toContain("lastReplyById: ctx.user.id");
    });
    
    it("updates category thread and post counts", () => {
      expect(forumContent).toContain("threadCount: sql`${forumCategories.threadCount} + 1`");
      expect(forumContent).toContain("postCount: sql`${forumCategories.postCount} + 1`");
    });
  });
  
  describe("Forum Moderation Features", () => {
    const forumRouterPath = path.resolve(__dirname, "routers/forum.ts");
    let forumContent: string;
    
    it("loads forum router for moderation checks", () => {
      forumContent = fs.readFileSync(forumRouterPath, "utf-8");
    });
    
    it("has editPost procedure (author or admin)", () => {
      expect(forumContent).toContain("editPost: protectedProcedure");
      expect(forumContent).toContain("ctx.user.role !== \"admin\"");
    });
    
    it("marks edited posts with isEdited flag", () => {
      expect(forumContent).toContain("isEdited: true");
    });
    
    it("has deletePost with soft delete", () => {
      expect(forumContent).toContain("deletePost: protectedProcedure");
      expect(forumContent).toContain("status: \"deleted\"");
    });
    
    it("has togglePinThread (admin only)", () => {
      expect(forumContent).toContain("togglePinThread: protectedProcedure");
      expect(forumContent).toContain("isPinned: !thread.isPinned");
    });
    
    it("has toggleLockThread (admin only)", () => {
      expect(forumContent).toContain("toggleLockThread: protectedProcedure");
      expect(forumContent).toContain("isLocked: !thread.isLocked");
    });
    
    it("has deleteThread with soft delete and category count decrement", () => {
      expect(forumContent).toContain("deleteThread: protectedProcedure");
      expect(forumContent).toContain("GREATEST(${forumCategories.threadCount} - 1, 0)");
    });
    
    it("decrements reply count on post deletion", () => {
      expect(forumContent).toContain("GREATEST(${forumThreads.replyCount} - 1, 0)");
    });
  });
  
  describe("Forum Schema", () => {
    const schemaPath = path.resolve(__dirname, "../drizzle/schema.ts");
    let schemaContent: string;
    
    it("loads schema", () => {
      schemaContent = fs.readFileSync(schemaPath, "utf-8");
    });
    
    it("has forumCategories table", () => {
      expect(schemaContent).toContain("forumCategories");
      expect(schemaContent).toContain("threadCount");
      expect(schemaContent).toContain("postCount");
    });
    
    it("has forumThreads table with moderation fields", () => {
      expect(schemaContent).toContain("forumThreads");
      expect(schemaContent).toContain("isPinned");
      expect(schemaContent).toContain("isLocked");
      expect(schemaContent).toContain("viewCount");
      expect(schemaContent).toContain("replyCount");
    });
    
    it("has forumPosts table with edit and like tracking", () => {
      expect(schemaContent).toContain("forumPosts");
      expect(schemaContent).toContain("isEdited");
      expect(schemaContent).toContain("likeCount");
    });
    
    it("has forumPostLikes table for like tracking", () => {
      expect(schemaContent).toContain("forumPostLikes");
    });
  });
  
  describe("Community Frontend Pages", () => {
    const communityPath = path.resolve(__dirname, "../client/src/pages/Community.tsx");
    const categoryThreadsPath = path.resolve(__dirname, "../client/src/pages/CategoryThreads.tsx");
    const threadDetailPath = path.resolve(__dirname, "../client/src/pages/ThreadDetail.tsx");
    
    it("Community page exists with forum tab", () => {
      const content = fs.readFileSync(communityPath, "utf-8");
      expect(content).toContain("forum.categories");
      expect(content).toContain("Community Guidelines");
      expect(content).toContain("Lignes directrices");
    });
    
    it("Community page links to category threads", () => {
      const content = fs.readFileSync(communityPath, "utf-8");
      expect(content).toContain("/community/category/");
    });
    
    it("CategoryThreads page exists with thread listing", () => {
      expect(fs.existsSync(categoryThreadsPath)).toBe(true);
      const content = fs.readFileSync(categoryThreadsPath, "utf-8");
      expect(content).toContain("forum.threads");
      expect(content).toContain("forum.createThread");
    });
    
    it("ThreadDetail page exists with post replies", () => {
      expect(fs.existsSync(threadDetailPath)).toBe(true);
      const content = fs.readFileSync(threadDetailPath, "utf-8");
      expect(content).toContain("forum.thread");
      expect(content).toContain("forum.createPost");
      expect(content).toContain("forum.toggleLike");
    });
    
    it("ThreadDetail has moderation controls for admin", () => {
      const content = fs.readFileSync(threadDetailPath, "utf-8");
      expect(content).toContain("togglePinThread");
      expect(content).toContain("toggleLockThread");
    });
  });
  
  describe("Community Routes in App.tsx", () => {
    const appPath = path.resolve(__dirname, "../client/src/App.tsx");
    let appContent: string;
    
    it("loads App.tsx", () => {
      appContent = fs.readFileSync(appPath, "utf-8");
    });
    
    it("has community route", () => {
      expect(appContent).toContain("/community");
    });
    
    it("has category threads route", () => {
      expect(appContent).toContain("/community/category/:id");
    });
    
    it("has thread detail route", () => {
      expect(appContent).toContain("/community/thread/:id");
    });
    
    it("has lazy imports for community sub-pages", () => {
      expect(appContent).toContain("CategoryThreads");
      expect(appContent).toContain("ThreadDetail");
    });
  });
  
  describe("Community Guidelines", () => {
    const communityPath = path.resolve(__dirname, "../client/src/pages/Community.tsx");
    
    it("has bilingual community guidelines", () => {
      const content = fs.readFileSync(communityPath, "utf-8");
      expect(content).toContain("Be respectful");
      expect(content).toContain("Soyez respectueux");
      expect(content).toContain("Share your experiences");
      expect(content).toContain("Practice both official languages");
      expect(content).toContain("Keep discussions professional");
    });
  });
});
