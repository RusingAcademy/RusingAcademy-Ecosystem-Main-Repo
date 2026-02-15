/**
 * Content Pipeline Router — Content Management Dashboard (Sprint I1)
 * Provides content pipeline metrics and management for the ContentPipeline admin page
 */
import { router, protectedProcedure } from "../trpc";
import { db } from "../db";
import { sql } from "drizzle-orm";

export const contentPipelineRouter = router({
  /**
   * getPipelineOverview — Content pipeline status overview
   * Called by: ContentPipeline.tsx
   */
  getPipelineOverview: protectedProcedure.query(async () => {
    try {
      // Course counts by status
      const statusRows = await db.execute(
        sql`SELECT status, COUNT(*) as count FROM courses GROUP BY status`
      );
      const statusMap: Record<string, number> = {};
      for (const row of statusRows as any[]) {
        statusMap[row.status || "unknown"] = Number(row.count || 0);
      }

      // Lesson counts
      const [lessonResult] = await db.execute(sql`SELECT COUNT(*) as count FROM lessons`);
      const totalLessons = Number((lessonResult as any)?.count || 0);

      // Module counts
      const [moduleResult] = await db.execute(sql`SELECT COUNT(*) as count FROM course_modules`);
      const totalModules = Number((moduleResult as any)?.count || 0);

      // Learning paths
      const [pathResult] = await db.execute(sql`SELECT COUNT(*) as count FROM learning_paths`);
      const totalPaths = Number((pathResult as any)?.count || 0);

      return {
        courses: {
          draft: statusMap.draft || 0,
          review: statusMap.review || statusMap.in_review || 0,
          published: statusMap.published || 0,
          archived: statusMap.archived || 0,
          total: Object.values(statusMap).reduce((a, b) => a + b, 0),
        },
        totalLessons,
        totalModules,
        totalPaths,
        pipeline: [
          { stage: "Drafting", count: statusMap.draft || 0, color: "#6b7280" },
          { stage: "In Review", count: statusMap.review || statusMap.in_review || 0, color: "#f59e0b" },
          { stage: "Published", count: statusMap.published || 0, color: "#10b981" },
          { stage: "Archived", count: statusMap.archived || 0, color: "#ef4444" },
        ],
      };
    } catch (error) {
      return {
        courses: { draft: 0, review: 0, published: 0, archived: 0, total: 0 },
        totalLessons: 0,
        totalModules: 0,
        totalPaths: 0,
        pipeline: [],
      };
    }
  }),

  /**
   * getContentCalendar — Content publication schedule
   * Called by: ContentPipeline.tsx
   */
  getContentCalendar: protectedProcedure.query(async () => {
    try {
      const rows = await db.execute(
        sql`SELECT id, title, status, created_at, updated_at 
            FROM courses 
            ORDER BY updated_at DESC 
            LIMIT 20`
      );
      return (rows as any[]).map((row) => ({
        id: row.id,
        title: row.title || "Untitled",
        status: row.status || "draft",
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      }));
    } catch (error) {
      return [];
    }
  }),

  /**
   * getContentTemplates — Available content templates
   * Called by: ContentPipeline.tsx
   */
  getContentTemplates: protectedProcedure.query(async () => {
    // Return built-in templates for the platform
    return [
      {
        id: "sle-reading",
        name: "SLE Reading Comprehension",
        nameFr: "Compréhension de lecture ELS",
        description: "Template for SLE reading comprehension exercises",
        category: "SLE Prep",
        fields: ["passage", "questions", "answers", "difficulty"],
      },
      {
        id: "sle-writing",
        name: "SLE Writing Exercise",
        nameFr: "Exercice d'écriture ELS",
        description: "Template for SLE writing prompts and rubrics",
        category: "SLE Prep",
        fields: ["prompt", "rubric", "sampleResponse", "difficulty"],
      },
      {
        id: "sle-oral",
        name: "SLE Oral Interaction",
        nameFr: "Interaction orale ELS",
        description: "Template for SLE oral interaction scenarios",
        category: "SLE Prep",
        fields: ["scenario", "keyPhrases", "evaluationCriteria", "difficulty"],
      },
      {
        id: "vocabulary-set",
        name: "Vocabulary Set",
        nameFr: "Ensemble de vocabulaire",
        description: "Template for vocabulary word sets with translations",
        category: "Language Skills",
        fields: ["words", "definitions", "examples", "category"],
      },
      {
        id: "grammar-drill",
        name: "Grammar Drill Set",
        nameFr: "Exercices de grammaire",
        description: "Template for grammar drill exercises",
        category: "Language Skills",
        fields: ["topic", "questions", "explanations", "difficulty"],
      },
      {
        id: "lesson-standard",
        name: "Standard Lesson",
        nameFr: "Leçon standard",
        description: "Standard lesson template with objectives, content, and assessment",
        category: "Course Content",
        fields: ["objectives", "content", "activities", "assessment"],
      },
    ];
  }),

  /**
   * getQualityMetrics — Content quality indicators
   * Called by: ContentPipeline.tsx
   */
  getQualityMetrics: protectedProcedure.query(async () => {
    try {
      // Average course rating
      const [ratingResult] = await db.execute(
        sql`SELECT AVG(rating) as avg_rating, COUNT(*) as count FROM course_reviews`
      );
      const avgRating = Number((ratingResult as any)?.avg_rating || 0);
      const totalReviews = Number((ratingResult as any)?.count || 0);

      // Completion rates
      const [enrolledResult] = await db.execute(
        sql`SELECT COUNT(*) as count FROM course_enrollments`
      );
      const totalEnrolled = Number((enrolledResult as any)?.count || 0);

      const [completedResult] = await db.execute(
        sql`SELECT COUNT(*) as count FROM course_enrollments WHERE progress >= 100`
      );
      const totalCompleted = Number((completedResult as any)?.count || 0);

      return {
        avgRating: Math.round(avgRating * 10) / 10,
        totalReviews,
        completionRate: totalEnrolled > 0 ? Math.round((totalCompleted / totalEnrolled) * 100) : 0,
        totalEnrolled,
        totalCompleted,
        qualityScore: avgRating > 0 ? Math.round((avgRating / 5) * 100) : 0,
      };
    } catch (error) {
      return {
        avgRating: 0,
        totalReviews: 0,
        completionRate: 0,
        totalEnrolled: 0,
        totalCompleted: 0,
        qualityScore: 0,
      };
    }
  }),

  /**
   * getRecentActivity — Recent content changes
   * Called by: ContentPipeline.tsx
   */
  getRecentActivity: protectedProcedure.query(async () => {
    try {
      const rows = await db.execute(
        sql`SELECT id, title, status, updated_at 
            FROM courses 
            WHERE updated_at > DATE_SUB(NOW(), INTERVAL 30 DAY) 
            ORDER BY updated_at DESC 
            LIMIT 10`
      );
      return (rows as any[]).map((row) => ({
        id: row.id,
        title: row.title || "Untitled",
        status: row.status || "draft",
        updatedAt: row.updated_at,
        action: row.status === "published" ? "published" : "updated",
      }));
    } catch (error) {
      return [];
    }
  }),
});
