/**
 * HR Router - tRPC Endpoints for B2B/B2G Dashboard
 * Real data endpoints for HR managers to track employee progress
 */

import { z } from "zod";
import { router, protectedProcedure } from "../trpc";
import { db } from "../db";
import { users, organizations, organizationMembers, learnerProgress, cohorts, cohortMembers } from "../db/schema";
import { eq, and, gte, sql, desc, count, avg } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

// Helper to verify HR role
async function verifyHRAccess(userId: string) {
  const user = await db.query.users.findFirst({ where: eq(users.id, userId) });
  if (!user || (user.role !== "hr" && user.role !== "admin")) {
    throw new TRPCError({ code: "FORBIDDEN", message: "HR or Admin role required." });
  }
  return user;
}

function getSLELevel(score: number): "A" | "B" | "C" {
  if (score >= 75) return "C";
  if (score >= 50) return "B";
  return "A";
}

export const hrRouter = router({
  getOrganizationOverview: protectedProcedure
    .input(z.object({ organizationId: z.string().optional() }))
    .query(async ({ ctx, input }) => {
      await verifyHRAccess(ctx.user.id);
      const orgId = input.organizationId || ctx.user.organizationId;
      if (!orgId) throw new TRPCError({ code: "BAD_REQUEST", message: "Organization ID required" });
      
      const organization = await db.query.organizations.findFirst({ where: eq(organizations.id, orgId) });
      const memberCount = await db.select({ count: count() }).from(organizationMembers).where(eq(organizationMembers.organizationId, orgId));
      
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const activeLearnersResult = await db.select({ count: count() })
        .from(learnerProgress)
        .innerJoin(organizationMembers, eq(learnerProgress.userId, organizationMembers.userId))
        .where(and(eq(organizationMembers.organizationId, orgId), gte(learnerProgress.updatedAt, thirtyDaysAgo)));
      
      const avgScoreResult = await db.select({ avgScore: avg(learnerProgress.overallScore) })
        .from(learnerProgress)
        .innerJoin(organizationMembers, eq(learnerProgress.userId, organizationMembers.userId))
        .where(eq(organizationMembers.organizationId, orgId));
      
      return {
        organization: { id: organization?.id, name: organization?.name, type: organization?.type },
        metrics: {
          totalEmployees: memberCount[0]?.count || 0,
          activeLearners: activeLearnersResult[0]?.count || 0,
          averageScore: Math.round(Number(avgScoreResult[0]?.avgScore) || 0),
        },
      };
    }),

  listEmployees: protectedProcedure
    .input(z.object({
      organizationId: z.string().optional(),
      cohortId: z.string().optional(),
      level: z.enum(["A", "B", "C"]).optional(),
      page: z.number().default(1),
      limit: z.number().default(20),
    }))
    .query(async ({ ctx, input }) => {
      await verifyHRAccess(ctx.user.id);
      const orgId = input.organizationId || ctx.user.organizationId;
      const offset = (input.page - 1) * input.limit;
      
      const employees = await db.select({
        id: users.id,
        firstName: users.firstName,
        lastName: users.lastName,
        email: users.email,
        department: organizationMembers.department,
        overallScore: learnerProgress.overallScore,
        lastActivity: learnerProgress.updatedAt,
      })
        .from(users)
        .innerJoin(organizationMembers, eq(users.id, organizationMembers.userId))
        .leftJoin(learnerProgress, eq(users.id, learnerProgress.userId))
        .where(eq(organizationMembers.organizationId, orgId!))
        .orderBy(desc(learnerProgress.updatedAt))
        .limit(input.limit)
        .offset(offset);
      
      const totalResult = await db.select({ count: count() }).from(organizationMembers).where(eq(organizationMembers.organizationId, orgId!));
      
      return {
        employees: employees.map(emp => ({
          ...emp,
          currentLevel: emp.overallScore ? getSLELevel(emp.overallScore) : null,
        })),
        pagination: { page: input.page, limit: input.limit, total: totalResult[0]?.count || 0 },
      };
    }),

  getCohortStats: protectedProcedure
    .input(z.object({ cohortId: z.string() }))
    .query(async ({ ctx, input }) => {
      await verifyHRAccess(ctx.user.id);
      const cohort = await db.query.cohorts.findFirst({ where: eq(cohorts.id, input.cohortId) });
      if (!cohort) throw new TRPCError({ code: "NOT_FOUND", message: "Cohort not found" });
      
      const members = await db.select({
        userId: cohortMembers.userId,
        overallScore: learnerProgress.overallScore,
      })
        .from(cohortMembers)
        .leftJoin(learnerProgress, eq(cohortMembers.userId, learnerProgress.userId))
        .where(eq(cohortMembers.cohortId, input.cohortId));
      
      const scores = members.filter(m => m.overallScore !== null);
      const avgOverall = scores.length > 0 ? scores.reduce((sum, m) => sum + (m.overallScore || 0), 0) / scores.length : 0;
      
      return {
        cohort: { id: cohort.id, name: cohort.name, startDate: cohort.startDate, endDate: cohort.endDate },
        stats: { totalMembers: members.length, averageScore: Math.round(avgOverall) },
      };
    }),

  exportGroupReport: protectedProcedure
    .input(z.object({
      organizationId: z.string().optional(),
      cohortId: z.string().optional(),
      format: z.enum(["pdf", "csv"]).default("pdf"),
    }))
    .mutation(async ({ ctx, input }) => {
      await verifyHRAccess(ctx.user.id);
      const orgId = input.organizationId || ctx.user.organizationId;
      
      // Generate report data
      const employees = await db.select({
        firstName: users.firstName,
        lastName: users.lastName,
        email: users.email,
        overallScore: learnerProgress.overallScore,
      })
        .from(users)
        .innerJoin(organizationMembers, eq(users.id, organizationMembers.userId))
        .leftJoin(learnerProgress, eq(users.id, learnerProgress.userId))
        .where(eq(organizationMembers.organizationId, orgId!));
      
      if (input.format === "csv") {
        const headers = "Prénom,Nom,Email,Score,Niveau";
        const rows = employees.map(e => 
          `${e.firstName},${e.lastName},${e.email},${e.overallScore || "N/A"},${e.overallScore ? getSLELevel(e.overallScore) : "N/A"}`
        );
        return { content: [headers, ...rows].join("\n"), filename: "rapport-progression.csv", mimeType: "text/csv" };
      }
      
      return { message: "PDF generation requires server-side processing", filename: "rapport-progression.pdf" };
    }),
});
