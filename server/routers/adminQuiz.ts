import { z } from "zod";
import { router, protectedProcedure } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import { eq, asc, and, or } from "drizzle-orm";
import { getDb } from "../db";
import { courseModules, courses, lessons, quizQuestions, users } from "../../drizzle/schema";

export const adminQuizRouter = router({
  getQuizQuestions: protectedProcedure
    .input(z.object({ lessonId: z.number() }))
    .query(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin" && ctx.user.openId !== process.env.OWNER_OPEN_ID) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }
      const db = await getDb();
      if (!db) return [];
      const { quizQuestions } = await import("../../drizzle/schema");
      const questions = await db.select().from(quizQuestions)
        .where(eq(quizQuestions.lessonId, input.lessonId))
        .orderBy(quizQuestions.orderIndex);
      return questions;
    }),

  createQuizQuestion: protectedProcedure
    .input(z.object({
      lessonId: z.number(),
      questionText: z.string(),
      questionTextFr: z.string().optional(),
      questionType: z.enum(["multiple_choice", "true_false", "fill_blank", "matching", "short_answer", "audio_response"]),
      difficulty: z.enum(["easy", "medium", "hard"]),
      options: z.array(z.string()).optional(),
      correctAnswer: z.string(),
      explanation: z.string().optional(),
      points: z.number().default(10),
    }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin" && ctx.user.openId !== process.env.OWNER_OPEN_ID) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      const { quizQuestions } = await import("../../drizzle/schema");
      
      // Get max sort order for this lesson
      const existing = await db.select().from(quizQuestions).where(eq(quizQuestions.lessonId, input.lessonId));
      const maxOrder = existing.length > 0 ? Math.max(...existing.map((q: any) => q.sortOrder || 0)) : 0;
      
      // @ts-expect-error - TS2769: auto-suppressed during TS cleanup
      const [newQuestion] = await db.insert(quizQuestions).values({
        lessonId: input.lessonId,
        questionText: input.questionText,
        questionTextFr: input.questionTextFr || null,
        questionType: input.questionType,
        difficulty: input.difficulty,
        options: input.options ? JSON.stringify(input.options) : null,
        correctAnswer: String(input.correctAnswer),
        explanation: input.explanation || null,
        points: input.points,
        sortOrder: maxOrder + 1,
      }).$returningId();
      return { id: newQuestion.id, success: true };
    }),

  updateQuizQuestion: protectedProcedure
    .input(z.object({
      id: z.number(),
      lessonId: z.number(),
      questionText: z.string(),
      questionTextFr: z.string().optional(),
      questionType: z.enum(["multiple_choice", "true_false", "fill_blank", "matching", "short_answer", "audio_response"]),
      difficulty: z.enum(["easy", "medium", "hard"]),
      options: z.array(z.string()).optional(),
      correctAnswer: z.string(),
      explanation: z.string().optional(),
      points: z.number().default(10),
    }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin" && ctx.user.openId !== process.env.OWNER_OPEN_ID) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      const { quizQuestions } = await import("../../drizzle/schema");
      
      await db.update(quizQuestions).set({
        questionText: input.questionText,
        questionTextFr: input.questionTextFr || null,
        questionType: input.questionType,
        difficulty: input.difficulty,
        options: input.options ? JSON.stringify(input.options) : null,
        correctAnswer: String(input.correctAnswer),
        explanation: input.explanation || null,
        points: input.points,
      }).where(eq(quizQuestions.id, input.id));
      return { success: true };
    }),

  deleteQuizQuestion: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin" && ctx.user.openId !== process.env.OWNER_OPEN_ID) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      const { quizQuestions } = await import("../../drizzle/schema");
      
      await db.delete(quizQuestions).where(eq(quizQuestions.id, input.id));
      return { success: true };
    }),
  
  // Export quiz questions for a lesson,

  exportQuizQuestions: protectedProcedure
    .input(z.object({ lessonId: z.number(), format: z.enum(["json", "csv"]) }))
    .query(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin" && ctx.user.openId !== process.env.OWNER_OPEN_ID) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }
      const db = await getDb();
      if (!db) return { data: "", filename: "" };
      const { quizQuestions, lessons } = await import("../../drizzle/schema");
      
      const questions = await db.select().from(quizQuestions)
        .where(eq(quizQuestions.lessonId, input.lessonId))
        .orderBy(quizQuestions.orderIndex);
      
      const [lesson] = await db.select().from(lessons).where(eq(lessons.id, input.lessonId));
      const lessonSlug = lesson?.title?.replace(/[^a-z0-9]/gi, '-').toLowerCase() || 'questions';
      
      if (input.format === "json") {
        const exportData = questions.map((q: any) => ({
          questionText: q.questionText,
          questionTextFr: q.questionTextFr,
          questionType: q.questionType,
          difficulty: q.difficulty,
          options: typeof q.options === 'string' ? JSON.parse(q.options) : q.options,
          correctAnswer: q.correctAnswer,
          explanation: q.explanation,
          points: q.points,
        }));
        return { data: JSON.stringify(exportData, null, 2), filename: `${lessonSlug}-questions.json` };
      } else {
        // CSV format
        const headers = ["questionText", "questionTextFr", "questionType", "difficulty", "options", "correctAnswer", "explanation", "points"];
        const rows = questions.map((q: any) => [
          `"${(q.questionText || '').replace(/"/g, '""')}"`,
          `"${(q.questionTextFr || '').replace(/"/g, '""')}"`,
          q.questionType,
          q.difficulty,
          `"${JSON.stringify(typeof q.options === 'string' ? JSON.parse(q.options) : q.options || []).replace(/"/g, '""')}"`,
          q.correctAnswer,
          `"${(q.explanation || '').replace(/"/g, '""')}"`,
          q.points,
        ].join(","));
        return { data: [headers.join(","), ...rows].join("\n"), filename: `${lessonSlug}-questions.csv` };
      }
    }),
  
  // Import quiz questions for a lesson,

  importQuizQuestions: protectedProcedure
    .input(z.object({
      lessonId: z.number(),
      format: z.enum(["json", "csv"]),
      data: z.string(),
      mode: z.enum(["append", "replace"]).default("append"),
    }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin" && ctx.user.openId !== process.env.OWNER_OPEN_ID) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      const { quizQuestions } = await import("../../drizzle/schema");
      
      let questionsToImport: any[] = [];
      
      try {
        if (input.format === "json") {
          questionsToImport = JSON.parse(input.data);
        } else {
          // Parse CSV
          const lines = input.data.split("\n").filter(line => line.trim());
          if (lines.length < 2) throw new Error("CSV must have header and at least one data row");
          
          const headers = lines[0].split(",").map(h => h.trim());
          for (let i = 1; i < lines.length; i++) {
            const values = lines[i].match(/("[^"]*"|[^,]+)/g) || [];
            const row: any = {};
            headers.forEach((header, idx) => {
              let value = values[idx] || '';
              // Remove surrounding quotes
              if (value.startsWith('"') && value.endsWith('"')) {
                value = value.slice(1, -1).replace(/""/g, '"');
              }
              if (header === 'options') {
                try { row[header] = JSON.parse(value); } catch { row[header] = []; }
              } else if (header === 'correctAnswer' || header === 'points') {
                row[header] = parseInt(value) || 0;
              } else {
                row[header] = value;
              }
            });
            questionsToImport.push(row);
          }
        }
      } catch (e: any) {
        throw new TRPCError({ code: "BAD_REQUEST", message: `Invalid ${input.format.toUpperCase()} format: ${e.message}` });
      }
      
      // Validate questions
      const validTypes = ["multiple_choice", "true_false", "fill_in_blank"];
      const validDifficulties = ["easy", "medium", "hard"];
      for (const q of questionsToImport) {
        if (!q.questionText) throw new TRPCError({ code: "BAD_REQUEST", message: "Each question must have questionText" });
        if (!validTypes.includes(q.questionType)) throw new TRPCError({ code: "BAD_REQUEST", message: `Invalid questionType: ${q.questionType}` });
        if (!validDifficulties.includes(q.difficulty)) throw new TRPCError({ code: "BAD_REQUEST", message: `Invalid difficulty: ${q.difficulty}` });
      }
      
      // If replace mode, delete existing questions
      if (input.mode === "replace") {
        await db.delete(quizQuestions).where(eq(quizQuestions.lessonId, input.lessonId));
      }
      
      // Get max sort order
      const existing = await db.select().from(quizQuestions).where(eq(quizQuestions.lessonId, input.lessonId));
      let maxOrder = existing.length > 0 ? Math.max(...existing.map((q: any) => q.sortOrder || 0)) : 0;
      
      // Insert questions
      let imported = 0;
      for (const q of questionsToImport) {
        maxOrder++;
        // @ts-expect-error - TS2769: auto-suppressed during TS cleanup
        await db.insert(quizQuestions).values({
          lessonId: input.lessonId,
          questionText: q.questionText,
          questionTextFr: q.questionTextFr || null,
          questionType: q.questionType,
          difficulty: q.difficulty,
          options: Array.isArray(q.options) ? JSON.stringify(q.options) : q.options || null,
          correctAnswer: q.correctAnswer || 0,
          explanation: q.explanation || null,
          points: q.points || 10,
          sortOrder: maxOrder,
        });
        imported++;
      }
      
      return { success: true, imported, total: questionsToImport.length };
    }),
  
  // Get quiz question statistics,

  getQuizQuestionStats: protectedProcedure
    .input(z.object({ lessonId: z.number() }))
    .query(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin" && ctx.user.openId !== process.env.OWNER_OPEN_ID) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }
      const db = await getDb();
      if (!db) return { questions: [], summary: { totalAttempts: 0, avgScore: 0, avgTime: 0 } };
      const { quizQuestions, quizAttempts, quizzes } = await import("../../drizzle/schema");
      
      // Get all questions for this lesson
      const questions = await db.select().from(quizQuestions)
        .where(eq(quizQuestions.lessonId, input.lessonId))
        .orderBy(quizQuestions.orderIndex);
      
      // Get all quiz attempts for this lesson's quiz
      const quiz = await db.select().from(quizzes).where(eq(quizzes.lessonId, input.lessonId)).limit(1);
      const attempts = quiz.length > 0 
        ? await db.select().from(quizAttempts).where(eq(quizAttempts.quizId, quiz[0].id))
        : [];
      
      // Calculate stats per question
      const questionStats = questions.map((q: any) => {
        const questionAttempts = attempts.filter((a: any) => {
          try {
            const answers = typeof a.answers === 'string' ? JSON.parse(a.answers) : a.answers;
            return answers && answers[q.id] !== undefined;
          } catch { return false; }
        });
        
        const correctAttempts = questionAttempts.filter((a: any) => {
          try {
            const answers = typeof a.answers === 'string' ? JSON.parse(a.answers) : a.answers;
            return answers && answers[q.id] === q.correctAnswer;
          } catch { return false; }
        });
        
        return {
          id: q.id,
          questionText: q.questionText?.substring(0, 100),
          questionType: q.questionType,
          difficulty: q.difficulty,
          totalAttempts: questionAttempts.length,
          correctAttempts: correctAttempts.length,
          successRate: questionAttempts.length > 0 
            ? Math.round((correctAttempts.length / questionAttempts.length) * 100) 
            : 0,
        };
      });
      
      // Calculate summary
      const totalAttempts = attempts.length;
      const avgScore = totalAttempts > 0 
        ? Math.round(attempts.reduce((sum: number, a: any) => sum + (a.score || 0), 0) / totalAttempts)
        : 0;
      const avgTime = totalAttempts > 0
        ? Math.round(attempts.reduce((sum: number, a: any) => sum + (a.timeSpent || 0), 0) / totalAttempts)
        : 0;
      
      return {
        questions: questionStats,
        summary: { totalAttempts, avgScore, avgTime },
      };
    }),
  
  // Update course (inline editing - basic fields),

  reorderQuizQuestions: protectedProcedure
    .input(z.object({
      lessonId: z.number(),
      questionIds: z.array(z.number()),
    }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin" && ctx.user.openId !== process.env.OWNER_OPEN_ID) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      const { quizQuestions } = await import("../../drizzle/schema");
      
      // Update order for each question
      for (let i = 0; i < input.questionIds.length; i++) {
        await db.update(quizQuestions)
          .set({ orderIndex: i + 1 })
          .where(and(
            eq(quizQuestions.id, input.questionIds[i]),
            eq(quizQuestions.lessonId, input.lessonId)
          ));
      }
      
      return { success: true };
    }),
  
  // Duplicate quiz to another lesson,

  duplicateQuiz: protectedProcedure
    .input(z.object({
      sourceLessonId: z.number(),
      targetLessonId: z.number(),
    }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin" && ctx.user.openId !== process.env.OWNER_OPEN_ID) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      const { quizQuestions, lessons } = await import("../../drizzle/schema");
      
      // Verify target lesson exists and is a quiz type
      const [targetLesson] = await db.select().from(lessons).where(eq(lessons.id, input.targetLessonId));
      if (!targetLesson) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Target lesson not found" });
      }
      
      // Get source questions
      const sourceQuestions = await db.select().from(quizQuestions)
        .where(eq(quizQuestions.lessonId, input.sourceLessonId))
        .orderBy(asc(quizQuestions.orderIndex));
      
      if (sourceQuestions.length === 0) {
        throw new TRPCError({ code: "NOT_FOUND", message: "No questions found in source lesson" });
      }
      
      // Get current max order in target lesson
      const existingQuestions = await db.select().from(quizQuestions)
        .where(eq(quizQuestions.lessonId, input.targetLessonId));
      const maxOrder = existingQuestions.length > 0 
        ? Math.max(...existingQuestions.map(q => q.orderIndex || 0)) 
        : 0;
      
      // Insert duplicated questions
      let insertedCount = 0;
      for (const q of sourceQuestions) {
        await db.insert(quizQuestions).values({
          lessonId: input.targetLessonId,
          questionText: q.questionText,
          questionTextFr: q.questionTextFr,
          questionType: q.questionType,
          difficulty: q.difficulty,
          options: q.options,
          correctAnswer: q.correctAnswer,
          explanation: q.explanation,
          explanationFr: q.explanationFr,
          points: q.points,
          orderIndex: maxOrder + insertedCount + 1,
          isActive: true,
        });
        insertedCount++;
      }
      
      return { success: true, copiedCount: insertedCount };
    }),
  
  // Get all quiz lessons for duplication target selection,

  getQuizLessons: protectedProcedure
    .query(async ({ ctx }) => {
      if (ctx.user.role !== "admin" && ctx.user.openId !== process.env.OWNER_OPEN_ID) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }
      const db = await getDb();
      if (!db) return [];
      const { lessons, courseModules, courses } = await import("../../drizzle/schema");
      
      const quizLessons = await db.select({
        id: lessons.id,
        title: lessons.title,
        moduleTitle: courseModules.title,
        courseTitle: courses.title,
      })
        .from(lessons)
        .innerJoin(courseModules, eq(lessons.moduleId, courseModules.id))
        .innerJoin(courses, eq(courseModules.courseId, courses.id))
        .where(eq(lessons.contentType, "quiz"))
        .orderBy(asc(courses.title), asc(courseModules.sortOrder), asc(lessons.sortOrder));
      
      return quizLessons;
    }),
  
  // Get all registered users with their roles,

  // ─── Quiz Analytics Dashboard ───
  getQuizAnalytics: protectedProcedure
    .query(async ({ ctx }) => {
      if (ctx.user.role !== "admin" && ctx.user.openId !== process.env.OWNER_OPEN_ID) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }
      const db = await getDb();
      if (!db) return { totalQuizzes: 0, totalAttempts: 0, avgScore: 0, passRate: 0, recentAttempts: [] };
      const { quizzes, quizAttempts, users } = await import("../../drizzle/schema");
      const { sql, desc } = await import("drizzle-orm");

      const [quizCount] = await db.select({ count: sql<number>`count(*)` }).from(quizzes);
      const [attemptCount] = await db.select({ count: sql<number>`count(*)` }).from(quizAttempts);
      const [avgScoreResult] = await db.select({ avg: sql<number>`COALESCE(AVG(score), 0)` }).from(quizAttempts);
      const [passCount] = await db.select({ count: sql<number>`count(*)` }).from(quizAttempts).where(eq(quizAttempts.passed, true));

      const totalAttempts = attemptCount?.count || 0;
      const passRate = totalAttempts > 0 ? Math.round(((passCount?.count || 0) / totalAttempts) * 100) : 0;

      const recentAttempts = await db.select({
        id: quizAttempts.id,
        userId: quizAttempts.userId,
        userName: users.name,
        quizId: quizAttempts.quizId,
        quizTitle: quizzes.title,
        score: quizAttempts.score,
        passed: quizAttempts.passed,
        attemptNumber: quizAttempts.attemptNumber,
        completedAt: quizAttempts.completedAt,
      })
        .from(quizAttempts)
        .leftJoin(users, eq(quizAttempts.userId, users.id))
        .leftJoin(quizzes, eq(quizAttempts.quizId, quizzes.id))
        .orderBy(desc(quizAttempts.createdAt))
        .limit(20);

      return {
        totalQuizzes: quizCount?.count || 0,
        totalAttempts,
        avgScore: Math.round(avgScoreResult?.avg || 0),
        passRate,
        recentAttempts,
      };
    }),
});
