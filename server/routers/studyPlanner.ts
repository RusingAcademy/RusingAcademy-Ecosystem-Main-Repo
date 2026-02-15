/**
 * StudyPlanner Router — Wave G, Sprint G2
 *
 * CRUD for learner study sessions/events:
 * - list: Get all study sessions for the current user
 * - upcoming: Get upcoming sessions (next 7 days)
 * - create: Create a new study session
 * - update: Update an existing study session
 * - delete: Delete a study session
 */
import { z } from "zod";
import { router, protectedProcedure } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import { sql } from "drizzle-orm";
import { getDb } from "../db";

async function ensureStudyPlannerTable() {
  const db = await getDb();
  if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "DB unavailable" });
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS study_sessions (
      id INT AUTO_INCREMENT PRIMARY KEY,
      userId INT NOT NULL,
      title VARCHAR(255) NOT NULL,
      titleFr VARCHAR(255),
      description TEXT,
      descriptionFr TEXT,
      sessionType ENUM('flashcards','vocabulary','grammar','reading','writing','listening','dictation','exam_prep','general') DEFAULT 'general',
      scheduledDate DATE NOT NULL,
      startTime VARCHAR(10),
      endTime VARCHAR(10),
      durationMinutes INT DEFAULT 30,
      isCompleted BOOLEAN DEFAULT FALSE,
      completedAt DATETIME,
      notes TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_user_date (userId, scheduledDate)
    )
  `);
  return db;
}

export const studyPlannerRouter = router({

  list: protectedProcedure
    .input(z.object({
      startDate: z.string().optional(),
      endDate: z.string().optional(),
    }).optional())
    .query(async ({ ctx, input }) => {
      const db = await ensureStudyPlannerTable();
      const userId = ctx.user?.id;
      if (!userId) throw new TRPCError({ code: "UNAUTHORIZED" });

      let query = sql`
        SELECT * FROM study_sessions
        WHERE userId = ${userId}
      `;
      if (input?.startDate) {
        query = sql`${query} AND scheduledDate >= ${input.startDate}`;
      }
      if (input?.endDate) {
        query = sql`${query} AND scheduledDate <= ${input.endDate}`;
      }
      query = sql`${query} ORDER BY scheduledDate ASC, startTime ASC`;

      const [rows] = await db.execute(query);
      return rows as any[];
    }),

  upcoming: protectedProcedure
    .query(async ({ ctx }) => {
      const db = await ensureStudyPlannerTable();
      const userId = ctx.user?.id;
      if (!userId) throw new TRPCError({ code: "UNAUTHORIZED" });

      const [rows] = await db.execute(sql`
        SELECT * FROM study_sessions
        WHERE userId = ${userId}
          AND scheduledDate >= CURDATE()
          AND scheduledDate <= DATE_ADD(CURDATE(), INTERVAL 7 DAY)
          AND isCompleted = FALSE
        ORDER BY scheduledDate ASC, startTime ASC
        LIMIT 10
      `);
      return rows as any[];
    }),

  create: protectedProcedure
    .input(z.object({
      title: z.string().min(1),
      titleFr: z.string().optional(),
      description: z.string().optional(),
      descriptionFr: z.string().optional(),
      sessionType: z.string().default("general"),
      scheduledDate: z.string(),
      startTime: z.string().optional(),
      endTime: z.string().optional(),
      durationMinutes: z.number().default(30),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await ensureStudyPlannerTable();
      const userId = ctx.user?.id;
      if (!userId) throw new TRPCError({ code: "UNAUTHORIZED" });

      await db.execute(sql`
        INSERT INTO study_sessions (userId, title, titleFr, description, descriptionFr, sessionType, scheduledDate, startTime, endTime, durationMinutes)
        VALUES (${userId}, ${input.title}, ${input.titleFr ?? null}, ${input.description ?? null}, ${input.descriptionFr ?? null}, ${input.sessionType}, ${input.scheduledDate}, ${input.startTime ?? null}, ${input.endTime ?? null}, ${input.durationMinutes})
      `);
      return { success: true };
    }),

  update: protectedProcedure
    .input(z.object({
      id: z.number(),
      title: z.string().optional(),
      titleFr: z.string().optional(),
      description: z.string().optional(),
      sessionType: z.string().optional(),
      scheduledDate: z.string().optional(),
      startTime: z.string().optional(),
      endTime: z.string().optional(),
      durationMinutes: z.number().optional(),
      isCompleted: z.boolean().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await ensureStudyPlannerTable();
      const userId = ctx.user?.id;
      if (!userId) throw new TRPCError({ code: "UNAUTHORIZED" });

      const { id, ...fields } = input;
      const setClauses: string[] = [];
      const values: any[] = [];

      if (fields.title !== undefined) { setClauses.push("title = ?"); values.push(fields.title); }
      if (fields.titleFr !== undefined) { setClauses.push("titleFr = ?"); values.push(fields.titleFr); }
      if (fields.description !== undefined) { setClauses.push("description = ?"); values.push(fields.description); }
      if (fields.sessionType !== undefined) { setClauses.push("sessionType = ?"); values.push(fields.sessionType); }
      if (fields.scheduledDate !== undefined) { setClauses.push("scheduledDate = ?"); values.push(fields.scheduledDate); }
      if (fields.startTime !== undefined) { setClauses.push("startTime = ?"); values.push(fields.startTime); }
      if (fields.endTime !== undefined) { setClauses.push("endTime = ?"); values.push(fields.endTime); }
      if (fields.durationMinutes !== undefined) { setClauses.push("durationMinutes = ?"); values.push(fields.durationMinutes); }
      if (fields.isCompleted !== undefined) {
        setClauses.push("isCompleted = ?");
        values.push(fields.isCompleted);
        if (fields.isCompleted) {
          setClauses.push("completedAt = NOW()");
        }
      }

      if (setClauses.length === 0) return { success: true };

      // Use raw SQL with template literal for dynamic update
      await db.execute(sql`
        UPDATE study_sessions
        SET ${sql.raw(setClauses.join(", "))}
        WHERE id = ${id} AND userId = ${userId}
      `);

      return { success: true };
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await ensureStudyPlannerTable();
      const userId = ctx.user?.id;
      if (!userId) throw new TRPCError({ code: "UNAUTHORIZED" });

      await db.execute(sql`
        DELETE FROM study_sessions WHERE id = ${input.id} AND userId = ${userId}
      `);
      return { success: true };
    }),
});
