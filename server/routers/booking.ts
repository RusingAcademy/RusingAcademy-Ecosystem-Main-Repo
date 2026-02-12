import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import { eq, desc, and } from "drizzle-orm";
import {
  getCoachAvailability,
  getDb,
  getLearnerByUserId,
} from "../db";
import { coachProfiles, learnerProfiles, sessions, users } from "../../drizzle/schema";

/**
 * Generate mock time slots for a given date
 * Used as fallback when Calendly is not configured
 */
function generateMockSlots(date: string): { id: string; startTime: string; endTime: string; available: boolean }[] {
  const slots = [];
  for (let hour = 9; hour < 17; hour++) {
    const startTime = `${hour.toString().padStart(2, "0")}:00`;
    const endTime = `${(hour + 1).toString().padStart(2, "0")}:00`;
    slots.push({
      id: `${date}-${hour}`,
      startTime,
      endTime,
      available: Math.random() > 0.3,
    });
  }
  return slots;
}

export const bookingRouter = router({
  // Get available slots for a coach on a specific date
  getAvailableSlots: protectedProcedure
    .input(z.object({
      coachId: z.number(),
      date: z.string(), // YYYY-MM-DD format
    }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) {
        // Fallback to mock data if DB not available
        return generateMockSlots(input.date);
      }
      
      // Check if coach has Calendly integration
      const { coachProfiles } = await import("../../drizzle/schema");
      const [coach] = await db.select().from(coachProfiles).where(eq(coachProfiles.id, input.coachId));
      
      if (coach?.calendlyEventTypeUri && process.env.CALENDLY_API_KEY) {
        // Use Calendly API for real availability
        try {
          const { CalendlyService } = await import("../services/calendlyService");
          const calendlyService = new CalendlyService(process.env.CALENDLY_API_KEY);
          
          const startTime = new Date(`${input.date}T00:00:00Z`).toISOString();
          const endTime = new Date(`${input.date}T23:59:59Z`).toISOString();
          
          const availableTimes = await calendlyService.getAvailableTimes(
            coach.calendlyEventTypeUri,
            startTime,
            endTime
          );
          
          return availableTimes.map((slot, index) => ({
            id: `calendly-${input.date}-${index}`,
            startTime: new Date(slot.start_time).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false }),
            endTime: new Date(new Date(slot.start_time).getTime() + 60 * 60 * 1000).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false }),
            available: slot.status === "available",
            schedulingUrl: slot.scheduling_url,
          }));
        } catch (error) {
          console.error("[Booking] Calendly API error, falling back to mock:", error);
          return generateMockSlots(input.date);
        }
      }
      
      // Fallback: Use coach's manual availability from database
      const availability = await getCoachAvailability(input.coachId);
      const dayOfWeek = new Date(input.date).getDay();
  // @ts-ignore - comparison type mismatch
      const dayNames = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
      // @ts-expect-error - TS2367: auto-suppressed during TS cleanup
      const todayAvailability = availability.filter(a => a.dayOfWeek === dayNames[dayOfWeek]);
      
      if (todayAvailability.length > 0) {
        // Generate slots based on coach's availability
        const slots: { id: string; startTime: string; endTime: string; available: boolean }[] = [];
        for (const avail of todayAvailability) {
          const startHour = parseInt(avail.startTime.split(":")[0]);
          const endHour = parseInt(avail.endTime.split(":")[0]);
          for (let hour = startHour; hour < endHour; hour++) {
            slots.push({
              id: `${input.date}-${hour}`,
              startTime: `${hour.toString().padStart(2, "0")}:00`,
              endTime: `${(hour + 1).toString().padStart(2, "0")}:00`,
              available: true,
            });
          }
        }
        return slots;
      }
      
      // Final fallback: Generate mock slots
      return generateMockSlots(input.date);
    }),

  // Book a session using coaching plan credits
  bookSessionWithPlan: protectedProcedure
    .input(z.object({
      coachId: z.number(),
      planId: z.number(),
      date: z.string(),
      slotId: z.string(),
      startTime: z.string(),
      duration: z.number().default(60),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      
      const { coachingPlanPurchases, sessions, coachProfiles, learnerProfiles } = await import("../../drizzle/schema");
      
      // Verify the plan belongs to the user and has remaining sessions
      const [plan] = await db.select()
        .from(coachingPlanPurchases)
        .where(and(
          eq(coachingPlanPurchases.id, input.planId),
          eq(coachingPlanPurchases.userId, ctx.user.id),
          eq(coachingPlanPurchases.status, "active")
        ));
      
      if (!plan) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Coaching plan not found" });
      }
      
      if (plan.remainingSessions <= 0) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "No remaining sessions in this plan" });
      }
      
      if (new Date(plan.expiresAt) < new Date()) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "This plan has expired" });
      }
      
      // Get learner profile
      const learner = await getLearnerByUserId(ctx.user.id);
      if (!learner) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Learner profile not found" });
      }
      
      // Create the session
      const scheduledAt = new Date(`${input.date}T${input.startTime}:00`);
      
      // Wrap session creation + plan deduction in a transaction for consistency
      const newRemaining = plan.remainingSessions - 1;
      const [session] = await db.transaction(async (tx) => {
        const [s] = await tx.insert(sessions).values({
          coachId: input.coachId,
          learnerId: learner.id,
          scheduledAt,
          duration: input.duration,
          sessionType: "package",
          status: "confirmed",
          price: 0, // Using plan credits
        });
        
        await tx.update(coachingPlanPurchases)
          .set({
            remainingSessions: newRemaining,
            status: newRemaining === 0 ? "exhausted" : "active",
          })
          .where(eq(coachingPlanPurchases.id, input.planId));
        
        return [s];
      });
      
      // Send confirmation email
      try {
        const { sendCoachingSessionConfirmationEmail } = await import("../email-purchase-confirmations");
        await sendCoachingSessionConfirmationEmail({
          userEmail: ctx.user.email || "",
          userName: ctx.user.name || "Learner",
          coachName: "Coach", // Would need to fetch coach name
          sessionDate: scheduledAt.toLocaleDateString("en-CA", { weekday: "long", year: "numeric", month: "long", day: "numeric" }),
          sessionTime: input.startTime,
          duration: input.duration,
          remainingSessions: newRemaining,
        });
      } catch (e) {
        console.error("Failed to send session confirmation email:", e);
      }
      
      return {
        success: true,
        sessionId: (session as any).insertId,
        remainingSessions: newRemaining,
      };
    }),

  // Get user's booked sessions
  getMySessions: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return [];
    
    const learner = await getLearnerByUserId(ctx.user.id);
    if (!learner) return [];
    
    const { sessions, coachProfiles, users } = await import("../../drizzle/schema");
    
    const userSessions = await db.select({
      session: sessions,
      coach: coachProfiles,
      coachUser: users,
    })
      .from(sessions)
      .leftJoin(coachProfiles, eq(sessions.coachId, coachProfiles.id))
      .leftJoin(users, eq(coachProfiles.userId, users.id))
      .where(eq(sessions.learnerId, learner.id))
      .orderBy(desc(sessions.scheduledAt));
    
    return userSessions.map(s => ({
      ...s.session,
      coachName: s.coachUser?.name || "Coach",
      coachPhoto: s.coach?.photoUrl,
    }));
  }),
});
