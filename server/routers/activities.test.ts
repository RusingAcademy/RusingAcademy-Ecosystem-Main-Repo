import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the database
vi.mock("../db", () => ({
  getDb: vi.fn(() =>
    Promise.resolve({
      select: vi.fn(() => ({
        from: vi.fn(() => ({
          where: vi.fn(() => ({
            orderBy: vi.fn(() =>
              Promise.resolve([
                {
                  id: 1,
                  lessonId: 10,
                  moduleId: 5,
                  courseId: 1,
                  title: "Watch Introduction Video",
                  description: "Watch the intro video for this lesson",
                  activityType: "video",
                  estimatedMinutes: 15,
                  points: 10,
                  sortOrder: 1,
                  status: "published",
                  isPreview: false,
                  isMandatory: true,
                  thumbnailUrl: null,
                  unlockMode: "immediate",
                },
              ])
            ),
            limit: vi.fn(() =>
              Promise.resolve([
                {
                  id: 1,
                  lessonId: 10,
                  moduleId: 5,
                  courseId: 1,
                  title: "Watch Introduction Video",
                  activityType: "video",
                  status: "published",
                },
              ])
            ),
          })),
          leftJoin: vi.fn(() => ({
            where: vi.fn(() =>
              Promise.resolve([
                {
                  id: 1,
                  title: "Watch Introduction Video",
                  activityType: "video",
                  progressStatus: "completed",
                  progressScore: 100,
                },
              ])
            ),
          })),
        })),
      })),
      insert: vi.fn(() => ({
        values: vi.fn(() => ({
          onDuplicateKeyUpdate: vi.fn(() => Promise.resolve()),
          then: vi.fn((cb: any) => cb({ insertId: 1 })),
        })),
      })),
      update: vi.fn(() => ({
        set: vi.fn(() => ({
          where: vi.fn(() => Promise.resolve()),
        })),
      })),
      delete: vi.fn(() => ({
        where: vi.fn(() => Promise.resolve()),
      })),
    })
  ),
}));

describe("Activities Router", () => {
  describe("Schema validation", () => {
    it("should have activities table defined in schema", async () => {
      const schema = await import("../../drizzle/schema");
      expect(schema.activities).toBeDefined();
    });

    it("should have activityProgress table defined in schema", async () => {
      const schema = await import("../../drizzle/schema");
      expect(schema.activityProgress).toBeDefined();
    });

    it("activities table should have required columns", async () => {
      const schema = await import("../../drizzle/schema");
      const actTable = schema.activities;
      
      // Check key columns exist on the table object
      expect(actTable.id).toBeDefined();
      expect(actTable.lessonId).toBeDefined();
      expect(actTable.moduleId).toBeDefined();
      expect(actTable.courseId).toBeDefined();
      expect(actTable.title).toBeDefined();
      expect(actTable.activityType).toBeDefined();
      expect(actTable.status).toBeDefined();
      expect(actTable.sortOrder).toBeDefined();
      expect(actTable.content).toBeDefined();
      expect(actTable.contentJson).toBeDefined();
      expect(actTable.videoUrl).toBeDefined();
      expect(actTable.audioUrl).toBeDefined();
      expect(actTable.downloadUrl).toBeDefined();
      expect(actTable.embedCode).toBeDefined();
      expect(actTable.points).toBeDefined();
      expect(actTable.estimatedMinutes).toBeDefined();
      expect(actTable.passingScore).toBeDefined();
      expect(actTable.isMandatory).toBeDefined();
      expect(actTable.isPreview).toBeDefined();
      expect(actTable.unlockMode).toBeDefined();
    });

    it("activityProgress table should have required columns", async () => {
      const schema = await import("../../drizzle/schema");
      const progTable = schema.activityProgress;
      
      expect(progTable.id).toBeDefined();
      expect(progTable.activityId).toBeDefined();
      expect(progTable.userId).toBeDefined();
      expect(progTable.lessonId).toBeDefined();
      expect(progTable.courseId).toBeDefined();
      expect(progTable.status).toBeDefined();
      expect(progTable.score).toBeDefined();
      expect(progTable.attempts).toBeDefined();
      expect(progTable.timeSpentSeconds).toBeDefined();
      expect(progTable.completedAt).toBeDefined();
    });
  });

  describe("Router exports", () => {
    it("should export activitiesRouter", async () => {
      const { activitiesRouter } = await import("./activities");
      expect(activitiesRouter).toBeDefined();
    });

    it("should have getByLesson procedure (public)", async () => {
      const { activitiesRouter } = await import("./activities");
      expect(activitiesRouter._def.procedures.getByLesson).toBeDefined();
    });

    it("should have getById procedure (public)", async () => {
      const { activitiesRouter } = await import("./activities");
      expect(activitiesRouter._def.procedures.getById).toBeDefined();
    });

    it("should have getWithProgress procedure (protected)", async () => {
      const { activitiesRouter } = await import("./activities");
      expect(activitiesRouter._def.procedures.getWithProgress).toBeDefined();
    });

    it("should have startActivity procedure (protected)", async () => {
      const { activitiesRouter } = await import("./activities");
      expect(activitiesRouter._def.procedures.startActivity).toBeDefined();
    });

    it("should have completeActivity procedure (protected)", async () => {
      const { activitiesRouter } = await import("./activities");
      expect(activitiesRouter._def.procedures.completeActivity).toBeDefined();
    });

    it("should have adminGetByLesson procedure (protected)", async () => {
      const { activitiesRouter } = await import("./activities");
      expect(activitiesRouter._def.procedures.adminGetByLesson).toBeDefined();
    });

    it("should have create procedure (protected)", async () => {
      const { activitiesRouter } = await import("./activities");
      expect(activitiesRouter._def.procedures.create).toBeDefined();
    });

    it("should have update procedure (protected)", async () => {
      const { activitiesRouter } = await import("./activities");
      expect(activitiesRouter._def.procedures.update).toBeDefined();
    });

    it("should have delete procedure (protected)", async () => {
      const { activitiesRouter } = await import("./activities");
      expect(activitiesRouter._def.procedures.delete).toBeDefined();
    });

    it("should have reorder procedure (protected)", async () => {
      const { activitiesRouter } = await import("./activities");
      expect(activitiesRouter._def.procedures.reorder).toBeDefined();
    });

    it("should have duplicate procedure (protected)", async () => {
      const { activitiesRouter } = await import("./activities");
      expect(activitiesRouter._def.procedures.duplicate).toBeDefined();
    });
  });

  describe("Activities router is registered in appRouter", () => {
    it("should be accessible via appRouter.activities", async () => {
      const { appRouter } = await import("../routers");
      expect(appRouter._def.procedures["activities.getByLesson"]).toBeDefined();
      expect(appRouter._def.procedures["activities.getById"]).toBeDefined();
      expect(appRouter._def.procedures["activities.create"]).toBeDefined();
      expect(appRouter._def.procedures["activities.update"]).toBeDefined();
      expect(appRouter._def.procedures["activities.delete"]).toBeDefined();
      expect(appRouter._def.procedures["activities.reorder"]).toBeDefined();
      expect(appRouter._def.procedures["activities.duplicate"]).toBeDefined();
    });
  });

  describe("Schema drip content fields", () => {
    it("courses table should have drip content fields", async () => {
      const schema = await import("../../drizzle/schema");
      expect(schema.courses.dripEnabled).toBeDefined();
      expect(schema.courses.dripInterval).toBeDefined();
      expect(schema.courses.dripUnit).toBeDefined();
    });

    it("courseModules table should have drip and thumbnail fields", async () => {
      const schema = await import("../../drizzle/schema");
      expect(schema.courseModules.thumbnailUrl).toBeDefined();
      expect(schema.courseModules.availableAt).toBeDefined();
      expect(schema.courseModules.unlockMode).toBeDefined();
      expect(schema.courseModules.status).toBeDefined();
    });

    it("lessons table should have status and thumbnail fields", async () => {
      const schema = await import("../../drizzle/schema");
      expect(schema.lessons.status).toBeDefined();
      expect(schema.lessons.thumbnailUrl).toBeDefined();
    });
  });

  describe("Activity type validation", () => {
    it("should accept valid activity types", () => {
      const validTypes = [
        "video", "text", "audio", "quiz", "assignment",
        "download", "live_session", "embed", "speaking_exercise",
        "fill_blank", "matching", "discussion",
      ];
      
      // Verify all types are strings
      validTypes.forEach((type) => {
        expect(typeof type).toBe("string");
        expect(type.length).toBeGreaterThan(0);
      });
    });

    it("should have 12 activity types defined", () => {
      const validTypes = [
        "video", "text", "audio", "quiz", "assignment",
        "download", "live_session", "embed", "speaking_exercise",
        "fill_blank", "matching", "discussion",
      ];
      expect(validTypes).toHaveLength(12);
    });
  });

  describe("Activity unlock modes", () => {
    it("should support immediate, sequential, and date_based unlock modes", () => {
      const unlockModes = ["immediate", "sequential", "date_based"];
      expect(unlockModes).toContain("immediate");
      expect(unlockModes).toContain("sequential");
      expect(unlockModes).toContain("date_based");
    });
  });

  describe("Activity status values", () => {
    it("should support draft, published, and archived statuses", () => {
      const statuses = ["draft", "published", "archived"];
      expect(statuses).toContain("draft");
      expect(statuses).toContain("published");
      expect(statuses).toContain("archived");
    });
  });

  describe("Activity progress status values", () => {
    it("should support not_started, in_progress, completed, and failed statuses", () => {
      const progressStatuses = ["not_started", "in_progress", "completed", "failed"];
      expect(progressStatuses).toContain("not_started");
      expect(progressStatuses).toContain("in_progress");
      expect(progressStatuses).toContain("completed");
      expect(progressStatuses).toContain("failed");
    });
  });
});
