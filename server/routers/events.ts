import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import { eq, desc, sql, asc, and, gte } from "drizzle-orm";
import {
  getDb,
} from "../db";

export const eventsRouter = router({
  // List upcoming events
  list: publicProcedure
    .input(z.object({
      limit: z.number().min(1).max(50).default(10),
      offset: z.number().min(0).default(0),
      type: z.enum(["workshop", "networking", "practice", "info_session", "webinar", "other"]).optional(),
    }).optional())
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      const { communityEvents } = await import("../../drizzle/schema");
      
      const whereCondition = input?.type 
        ? and(
            eq(communityEvents.status, "published"),
            gte(communityEvents.startAt, new Date()),
            eq(communityEvents.eventType, input.type)
          )
        : and(
            eq(communityEvents.status, "published"),
            gte(communityEvents.startAt, new Date())
          );
      
      const events = await db.select().from(communityEvents)
        .where(whereCondition)
        .orderBy(asc(communityEvents.startAt))
        .limit(input?.limit || 10)
        .offset(input?.offset || 0);
      
      return events;
    }),

  // Get single event
  byId: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      const { communityEvents } = await import("../../drizzle/schema");
      
      const [event] = await db.select().from(communityEvents)
        .where(eq(communityEvents.id, input.id));
      
      if (!event) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Event not found" });
      }
      
      return event;
    }),

  // Register for event
  register: protectedProcedure
    .input(z.object({
      eventId: z.number(),
      email: z.string().email().optional(),
      name: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      const { communityEvents, eventRegistrations } = await import("../../drizzle/schema");
      
      // Get event
      const [event] = await db.select().from(communityEvents)
        .where(eq(communityEvents.id, input.eventId));
      
      if (!event) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Event not found" });
      }
      
      if (event.status !== "published") {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Event is not open for registration" });
      }
      
      // Check if already registered
      const [existing] = await db.select().from(eventRegistrations)
        .where(and(
          eq(eventRegistrations.eventId, input.eventId),
          eq(eventRegistrations.userId, ctx.user.id)
        ));
      
      if (existing) {
        throw new TRPCError({ code: "CONFLICT", message: "Already registered for this event" });
      }
      
      // Check capacity
      const currentRegs = event.currentRegistrations ?? 0;
      const isFull = event.maxCapacity && currentRegs >= event.maxCapacity;
      const status = isFull && event.waitlistEnabled ? "waitlisted" : "registered";
      
      if (isFull && !event.waitlistEnabled) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Event is full" });
      }
      
      // Create registration
      await db.insert(eventRegistrations).values({
        eventId: input.eventId,
        userId: ctx.user.id,
        status,
        email: input.email || ctx.user.email || null,
        name: input.name || ctx.user.name || null,
      });
      
      // Update event registration count
      await db.update(communityEvents)
        .set({ currentRegistrations: sql`${communityEvents.currentRegistrations} + 1` })
        .where(eq(communityEvents.id, input.eventId));
      
      // Send confirmation email
      const userEmail = input.email || ctx.user.email;
      const userName = input.name || ctx.user.name || "Member";
      
      if (userEmail) {
        const { sendEventRegistrationConfirmation } = await import("../email");
        await sendEventRegistrationConfirmation({
          userName,
          userEmail,
          eventTitle: event.title,
          eventTitleFr: event.titleFr,
          eventDescription: event.description,
          eventDescriptionFr: event.descriptionFr,
          eventDate: event.startAt,
          eventEndDate: event.endAt,
          eventType: event.eventType || "other",
          locationType: event.locationType || "virtual",
          locationDetails: event.locationDetails || undefined,
          meetingUrl: event.meetingUrl || undefined,
          hostName: event.hostName || undefined,
          status: status as "registered" | "waitlisted",
        }).catch(err => console.error("Failed to send event registration email:", err));
      }
      
      return { success: true, status };
    }),

  // Cancel registration
  cancelRegistration: protectedProcedure
    .input(z.object({ eventId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      const { communityEvents, eventRegistrations } = await import("../../drizzle/schema");
      
      // Get registration
      const [registration] = await db.select().from(eventRegistrations)
        .where(and(
          eq(eventRegistrations.eventId, input.eventId),
          eq(eventRegistrations.userId, ctx.user.id)
        ));
      
      if (!registration) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Registration not found" });
      }
      
      // Update registration status
      await db.update(eventRegistrations)
        .set({
          status: "cancelled",
          cancelledAt: new Date(),
        })
        .where(eq(eventRegistrations.id, registration.id));
      
      // Update event registration count
      await db.update(communityEvents)
        .set({ currentRegistrations: sql`${communityEvents.currentRegistrations} - 1` })
        .where(eq(communityEvents.id, input.eventId));
      
      return { success: true };
    }),

  // Get user's registrations
  myRegistrations: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
    const { communityEvents, eventRegistrations } = await import("../../drizzle/schema");
    
    const registrations = await db.select({
      registration: eventRegistrations,
      event: communityEvents,
    })
      .from(eventRegistrations)
      .innerJoin(communityEvents, eq(eventRegistrations.eventId, communityEvents.id))
      .where(eq(eventRegistrations.userId, ctx.user.id))
      .orderBy(desc(eventRegistrations.registeredAt));
    
    return registrations;
  }),

  // Check if user is registered for an event
  isRegistered: protectedProcedure
    .input(z.object({ eventId: z.number() }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      const { eventRegistrations } = await import("../../drizzle/schema");
      
      const [registration] = await db.select().from(eventRegistrations)
        .where(and(
          eq(eventRegistrations.eventId, input.eventId),
          eq(eventRegistrations.userId, ctx.user.id)
        ));
      
      return {
        isRegistered: !!registration,
        status: registration?.status || null,
      };
    }),
});
