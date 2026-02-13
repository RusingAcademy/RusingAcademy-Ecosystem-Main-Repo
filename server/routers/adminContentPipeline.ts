/**
 * Sprint 5: Content Pipeline Router
 * 
 * Provides a unified content workflow dashboard, content calendar,
 * and LRDG-specific content templates. Aggregates data from existing
 * CMS, courses, and media routers into a single pipeline view.
 */
import { z } from "zod";
import { router, adminProcedure } from "../_core/trpc";
import { getDb } from "../db";
import { sql, eq, gte, and, desc } from "drizzle-orm";
import { courses } from "../../drizzle/schema";

// ── Content Pipeline Dashboard ───────────────────────────────────────────────
export const contentPipelineRouter = router({
  // Get content pipeline overview — aggregates all content types by status
  getPipelineOverview: adminProcedure.query(async () => {
    const db = await getDb();
    if (!db) return {
      courses: { draft: 0, review: 0, published: 0, archived: 0 },
      pages: { draft: 0, published: 0, archived: 0 },
      media: { total: 0, images: 0, videos: 0, audio: 0, documents: 0 },
      templates: { total: 0 },
    };

    // Course pipeline
    const courseStatuses = await db.select({
      status: courses.status,
      count: sql<number>`count(*)`,
    }).from(courses).groupBy(courses.status);

    const courseMap: Record<string, number> = {};
    courseStatuses.forEach(s => { courseMap[s.status] = s.count; });

    // CMS pages pipeline
    const [pageStatuses] = await db.execute(sql`
      SELECT status, COUNT(*) as count FROM cms_pages GROUP BY status
    `);
    const pageMap: Record<string, number> = {};
    if (Array.isArray(pageStatuses)) {
      pageStatuses.forEach((s: any) => { pageMap[s.status] = Number(s.count); });
    }

    // Media library stats
    const [mediaStats] = await db.execute(sql`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN mimeType LIKE 'image%' THEN 1 ELSE 0 END) as images,
        SUM(CASE WHEN mimeType LIKE 'video%' THEN 1 ELSE 0 END) as videos,
        SUM(CASE WHEN mimeType LIKE 'audio%' THEN 1 ELSE 0 END) as audio,
        SUM(CASE WHEN mimeType NOT LIKE 'image%' AND mimeType NOT LIKE 'video%' AND mimeType NOT LIKE 'audio%' THEN 1 ELSE 0 END) as documents
      FROM media_library
    `);
    const media = Array.isArray(mediaStats) && mediaStats[0] ? mediaStats[0] as any : {};

    // Template count
    const [templateCount] = await db.execute(sql`SELECT COUNT(*) as total FROM cms_section_templates`);
    const templates = Array.isArray(templateCount) && templateCount[0] ? Number((templateCount[0] as any).total) : 0;

    return {
      courses: {
        draft: courseMap["draft"] ?? 0,
        review: courseMap["review"] ?? 0,
        published: courseMap["published"] ?? 0,
        archived: courseMap["archived"] ?? 0,
      },
      pages: {
        draft: pageMap["draft"] ?? 0,
        published: pageMap["published"] ?? 0,
        archived: pageMap["archived"] ?? 0,
      },
      media: {
        total: Number(media.total ?? 0),
        images: Number(media.images ?? 0),
        videos: Number(media.videos ?? 0),
        audio: Number(media.audio ?? 0),
        documents: Number(media.documents ?? 0),
      },
      templates: { total: templates },
    };
  }),

  // Get recent content activity across all content types
  getRecentActivity: adminProcedure
    .input(z.object({ limit: z.number().default(20) }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];

      // Merge recent courses and pages into a unified activity feed
      const [courseActivity] = await db.execute(sql`
        SELECT 
          'course' as contentType,
          c.id, c.title, c.status, c.updatedAt as activityDate,
          u.name as authorName,
          CASE 
            WHEN c.status = 'published' THEN 'published'
            WHEN c.status = 'review' THEN 'submitted for review'
            WHEN c.status = 'draft' THEN 'updated draft'
            ELSE 'modified'
          END as action
        FROM courses c
        LEFT JOIN users u ON c.instructorId = u.id
        ORDER BY c.updatedAt DESC
        LIMIT ${input.limit}
      `);

      const [pageActivity] = await db.execute(sql`
        SELECT 
          'page' as contentType,
          p.id, p.title, p.status, p.updatedAt as activityDate,
          u.name as authorName,
          CASE 
            WHEN p.status = 'published' THEN 'published'
            WHEN p.status = 'draft' THEN 'updated draft'
            ELSE 'modified'
          END as action
        FROM cms_pages p
        LEFT JOIN users u ON p.createdBy = u.id
        ORDER BY p.updatedAt DESC
        LIMIT ${input.limit}
      `);

      // Merge and sort by date
      const allActivity = [
        ...(Array.isArray(courseActivity) ? courseActivity : []),
        ...(Array.isArray(pageActivity) ? pageActivity : []),
      ].sort((a: any, b: any) => {
        const dateA = new Date(a.activityDate).getTime();
        const dateB = new Date(b.activityDate).getTime();
        return dateB - dateA;
      }).slice(0, input.limit);

      return allActivity;
    }),

  // Get content calendar — scheduled publications and deadlines
  getContentCalendar: adminProcedure
    .input(z.object({
      month: z.number().min(1).max(12),
      year: z.number().min(2020).max(2030),
    }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];

      const startDate = new Date(input.year, input.month - 1, 1);
      const endDate = new Date(input.year, input.month, 0);

      // Get courses with scheduled dates in this month
      const [courseEvents] = await db.execute(sql`
        SELECT 
          'course' as contentType,
          id, title, status,
          updatedAt as eventDate,
          CASE 
            WHEN status = 'published' THEN 'publication'
            WHEN status = 'review' THEN 'review_deadline'
            ELSE 'draft_update'
          END as eventType
        FROM courses
        WHERE updatedAt BETWEEN ${startDate} AND ${endDate}
        ORDER BY updatedAt ASC
      `);

      // Get CMS page events in this month
      const [pageEvents] = await db.execute(sql`
        SELECT 
          'page' as contentType,
          id, title, status,
          updatedAt as eventDate,
          CASE 
            WHEN status = 'published' THEN 'publication'
            ELSE 'draft_update'
          END as eventType
        FROM cms_pages
        WHERE updatedAt BETWEEN ${startDate} AND ${endDate}
        ORDER BY updatedAt ASC
      `);

      return [
        ...(Array.isArray(courseEvents) ? courseEvents : []),
        ...(Array.isArray(pageEvents) ? pageEvents : []),
      ].sort((a: any, b: any) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime());
    }),

  // Get LRDG content templates — predefined content structures
  getContentTemplates: adminProcedure.query(async () => {
    // These are predefined LRDG-specific content templates
    return [
      {
        id: "sle-prep-lesson",
        name: "SLE Prep Lesson",
        nameFr: "Leçon de préparation ELS",
        description: "Standard lesson structure for SLE exam preparation",
        category: "course",
        structure: {
          sections: [
            { type: "introduction", label: "Introduction / Contexte" },
            { type: "vocabulary", label: "Vocabulaire clé / Key Vocabulary" },
            { type: "grammar", label: "Point de grammaire / Grammar Focus" },
            { type: "practice", label: "Exercices pratiques / Practice Exercises" },
            { type: "listening", label: "Compréhension orale / Listening Comprehension" },
            { type: "reading", label: "Compréhension écrite / Reading Comprehension" },
            { type: "quiz", label: "Évaluation / Assessment" },
          ],
        },
      },
      {
        id: "coaching-session-plan",
        name: "Coaching Session Plan",
        nameFr: "Plan de session de coaching",
        description: "Template for structured coaching sessions",
        category: "coaching",
        structure: {
          sections: [
            { type: "objectives", label: "Objectifs de la session / Session Objectives" },
            { type: "warm-up", label: "Mise en train / Warm-up" },
            { type: "core-activity", label: "Activité principale / Core Activity" },
            { type: "feedback", label: "Rétroaction / Feedback" },
            { type: "homework", label: "Travail à domicile / Homework" },
            { type: "next-steps", label: "Prochaines étapes / Next Steps" },
          ],
        },
      },
      {
        id: "oral-proficiency-module",
        name: "Oral Proficiency Module",
        nameFr: "Module de compétence orale",
        description: "Structured module for oral proficiency development",
        category: "course",
        structure: {
          sections: [
            { type: "scenario", label: "Scénario / Scenario" },
            { type: "model-dialogue", label: "Dialogue modèle / Model Dialogue" },
            { type: "pronunciation", label: "Prononciation / Pronunciation Focus" },
            { type: "role-play", label: "Jeu de rôle / Role Play" },
            { type: "self-assessment", label: "Auto-évaluation / Self-Assessment" },
          ],
        },
      },
      {
        id: "written-expression-module",
        name: "Written Expression Module",
        nameFr: "Module d'expression écrite",
        description: "Structured module for written expression skills",
        category: "course",
        structure: {
          sections: [
            { type: "prompt", label: "Sujet / Writing Prompt" },
            { type: "model-text", label: "Texte modèle / Model Text" },
            { type: "grammar-focus", label: "Grammaire ciblée / Targeted Grammar" },
            { type: "writing-exercise", label: "Exercice d'écriture / Writing Exercise" },
            { type: "peer-review", label: "Révision par les pairs / Peer Review" },
            { type: "rubric", label: "Grille d'évaluation / Evaluation Rubric" },
          ],
        },
      },
      {
        id: "landing-page-lrdg",
        name: "LRDG Landing Page",
        nameFr: "Page d'atterrissage LRDG",
        description: "Professional landing page template for LRDG programs",
        category: "page",
        structure: {
          sections: [
            { type: "hero", label: "Section héros / Hero Section" },
            { type: "value-proposition", label: "Proposition de valeur / Value Proposition" },
            { type: "program-overview", label: "Aperçu du programme / Program Overview" },
            { type: "testimonials", label: "Témoignages / Testimonials" },
            { type: "pricing", label: "Tarification / Pricing" },
            { type: "faq", label: "Questions fréquentes / FAQ" },
            { type: "cta", label: "Appel à l'action / Call to Action" },
          ],
        },
      },
      {
        id: "department-training-package",
        name: "Department Training Package",
        nameFr: "Forfait de formation ministériel",
        description: "Complete training package for government departments",
        category: "enterprise",
        structure: {
          sections: [
            { type: "needs-assessment", label: "Évaluation des besoins / Needs Assessment" },
            { type: "curriculum-overview", label: "Aperçu du curriculum / Curriculum Overview" },
            { type: "level-placement", label: "Test de classement / Level Placement" },
            { type: "training-schedule", label: "Calendrier de formation / Training Schedule" },
            { type: "progress-tracking", label: "Suivi des progrès / Progress Tracking" },
            { type: "reporting", label: "Rapports / Reporting" },
            { type: "certification", label: "Certification / Certification" },
          ],
        },
      },
    ];
  }),

  // Get content quality metrics
  getQualityMetrics: adminProcedure.query(async () => {
    const db = await getDb();
    if (!db) return {
      coursesWithThumbnails: 0,
      coursesWithDescriptions: 0,
      totalCourses: 0,
      pagesWithSEO: 0,
      totalPages: 0,
      mediaWithAltText: 0,
      totalMedia: 0,
    };

    // Course quality
    const [courseQuality] = await db.execute(sql`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN thumbnailUrl IS NOT NULL AND thumbnailUrl != '' THEN 1 ELSE 0 END) as withThumbnails,
        SUM(CASE WHEN description IS NOT NULL AND description != '' THEN 1 ELSE 0 END) as withDescriptions
      FROM courses
    `);
    const cq = Array.isArray(courseQuality) && courseQuality[0] ? courseQuality[0] as any : {};

    // Page SEO quality
    const [pageQuality] = await db.execute(sql`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN description IS NOT NULL AND description != '' THEN 1 ELSE 0 END) as withSEO
      FROM cms_pages
    `);
    const pq = Array.isArray(pageQuality) && pageQuality[0] ? pageQuality[0] as any : {};

    // Media alt text quality
    const [mediaQuality] = await db.execute(sql`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN altText IS NOT NULL AND altText != '' THEN 1 ELSE 0 END) as withAltText
      FROM media_library
    `);
    const mq = Array.isArray(mediaQuality) && mediaQuality[0] ? mediaQuality[0] as any : {};

    return {
      coursesWithThumbnails: Number(cq.withThumbnails ?? 0),
      coursesWithDescriptions: Number(cq.withDescriptions ?? 0),
      totalCourses: Number(cq.total ?? 0),
      pagesWithSEO: Number(pq.withSEO ?? 0),
      totalPages: Number(pq.total ?? 0),
      mediaWithAltText: Number(mq.withAltText ?? 0),
      totalMedia: Number(mq.total ?? 0),
    };
  }),
});
