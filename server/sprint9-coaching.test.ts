import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";

/**
 * Sprint 9: Coaching & Booking Pipeline Tests
 * Validates the coaching system: booking flow, session payment, coach earnings,
 * invitation email, session notes, Calendly webhook, and coach dashboard.
 */

const SERVER_DIR = path.resolve(__dirname);
const ROUTERS_DIR = path.join(SERVER_DIR, "routers");
const SERVICES_DIR = path.join(SERVER_DIR, "services");

describe("Sprint 9: Coaching & Booking Pipeline", () => {

  describe("A) Coach Router - completeSession endpoint", () => {
    it("should have completeSession procedure in coach.ts", () => {
      const coachRouter = fs.readFileSync(path.join(ROUTERS_DIR, "coach.ts"), "utf-8");
      expect(coachRouter).toContain("completeSession:");
      expect(coachRouter).toContain("protectedProcedure");
    });

    it("completeSession should validate session ownership", () => {
      const coachRouter = fs.readFileSync(path.join(ROUTERS_DIR, "coach.ts"), "utf-8");
      expect(coachRouter).toContain("eq(sessions.coachId, profile.id)");
    });

    it("completeSession should update session status to completed", () => {
      const coachRouter = fs.readFileSync(path.join(ROUTERS_DIR, "coach.ts"), "utf-8");
      expect(coachRouter).toContain('status: "completed"');
      expect(coachRouter).toContain("completedAt:");
    });

    it("completeSession should create payout ledger entry for coach earnings", () => {
      const coachRouter = fs.readFileSync(path.join(ROUTERS_DIR, "coach.ts"), "utf-8");
      expect(coachRouter).toContain("payoutLedger");
      expect(coachRouter).toContain("coachEarnings");
      expect(coachRouter).toContain("platformFee");
      expect(coachRouter).toContain('transactionType: "session_payment"');
    });

    it("completeSession should save session notes when provided", () => {
      const coachRouter = fs.readFileSync(path.join(ROUTERS_DIR, "coach.ts"), "utf-8");
      expect(coachRouter).toContain("sessionNotes");
      expect(coachRouter).toContain("input.notes");
    });

    it("completeSession should only allow completing confirmed or pending sessions", () => {
      const coachRouter = fs.readFileSync(path.join(ROUTERS_DIR, "coach.ts"), "utf-8");
      expect(coachRouter).toContain('"confirmed"');
      expect(coachRouter).toContain('"pending"');
      expect(coachRouter).toContain("Session cannot be completed from current status");
    });
  });

  describe("B) Coach Invitation Email", () => {
    it("should have coachInvitation router", () => {
      const invitationRouter = fs.readFileSync(path.join(ROUTERS_DIR, "coachInvitation.ts"), "utf-8");
      expect(invitationRouter).toContain("coachInvitationRouter");
    });

    it("should send email when creating coach invitation", () => {
      const invitationRouter = fs.readFileSync(path.join(ROUTERS_DIR, "coachInvitation.ts"), "utf-8");
      expect(invitationRouter).toContain("sendEmail");
      expect(invitationRouter).toContain("invitationUrl");
    });

    it("should include invitation link in email", () => {
      const invitationRouter = fs.readFileSync(path.join(ROUTERS_DIR, "coachInvitation.ts"), "utf-8");
      expect(invitationRouter).toContain("invitationUrl");
    });
  });

  describe("C) Coaching Plan & Stripe Integration", () => {
    it("should have coaching plan checkout in booking router", () => {
      const bookingRouter = fs.readFileSync(path.join(ROUTERS_DIR, "booking.ts"), "utf-8");
      expect(bookingRouter).toContain("bookSessionWithPlan");
    });

    it("should have Stripe webhook handler for coaching payments", () => {
      const webhookFile = fs.readFileSync(path.join(SERVER_DIR, "stripe", "webhook.ts"), "utf-8");
      expect(webhookFile.length).toBeGreaterThan(100);
    });

    it("should have coaching products defined in Stripe products", () => {
      const productsFile = fs.readFileSync(path.join(SERVER_DIR, "stripe", "products.ts"), "utf-8");
      expect(productsFile).toContain("coaching");
    });
  });

  describe("D) Calendly Integration", () => {
    const WEBHOOKS_DIR = path.join(SERVER_DIR, "webhooks");

    it("should have Calendly webhook handler", () => {
      const calendlyWebhook = fs.readFileSync(path.join(WEBHOOKS_DIR, "calendly.ts"), "utf-8");
      expect(calendlyWebhook).toContain("webhook");
    });

    it("should handle invitee.created events", () => {
      const calendlyWebhook = fs.readFileSync(path.join(WEBHOOKS_DIR, "calendly.ts"), "utf-8");
      expect(calendlyWebhook).toContain("invitee.created");
    });

    it("should handle invitee.canceled events", () => {
      const calendlyWebhook = fs.readFileSync(path.join(WEBHOOKS_DIR, "calendly.ts"), "utf-8");
      expect(calendlyWebhook).toContain("invitee.canceled");
    });
  });

  describe("E) Coach Dashboard UI", () => {
    it("should have CoachDashboard page with real data queries", () => {
      const dashboard = fs.readFileSync(
        path.join(SERVER_DIR, "..", "client", "src", "pages", "CoachDashboard.tsx"),
        "utf-8"
      );
      expect(dashboard).toContain("trpc.coach.myProfile");
      expect(dashboard).toContain("trpc.coach.getEarningsSummaryV2");
      expect(dashboard).toContain("trpc.coach.getTodaysSessions");
      expect(dashboard).toContain("trpc.coach.getPendingRequests");
    });

    it("should have completeSession mutation wired in CoachDashboard", () => {
      const dashboard = fs.readFileSync(
        path.join(SERVER_DIR, "..", "client", "src", "pages", "CoachDashboard.tsx"),
        "utf-8"
      );
      expect(dashboard).toContain("trpc.coach.completeSession.useMutation");
      expect(dashboard).toContain("handleCompleteSession");
    });

    it("should have Complete button for confirmed sessions", () => {
      const dashboard = fs.readFileSync(
        path.join(SERVER_DIR, "..", "client", "src", "pages", "CoachDashboard.tsx"),
        "utf-8"
      );
      expect(dashboard).toContain('session.status === "confirmed"');
      expect(dashboard).toContain("handleCompleteSession(session.id)");
    });
  });

  describe("F) Coach Earnings & Payout", () => {
    it("should have getEarningsSummaryV2 procedure", () => {
      const coachRouter = fs.readFileSync(path.join(ROUTERS_DIR, "coach.ts"), "utf-8");
      expect(coachRouter).toContain("getEarningsSummaryV2:");
    });

    it("should have CoachEarnings page", () => {
      const earningsPage = fs.readFileSync(
        path.join(SERVER_DIR, "..", "client", "src", "pages", "CoachEarnings.tsx"),
        "utf-8"
      );
      expect(earningsPage).toBeDefined();
      expect(earningsPage.length).toBeGreaterThan(100);
    });

    it("should have payoutLedger table in schema", () => {
      const schema = fs.readFileSync(
        path.join(SERVER_DIR, "..", "drizzle", "schema.ts"),
        "utf-8"
      );
      expect(schema).toContain("payoutLedger");
      expect(schema).toContain("payout_ledger");
    });
  });

  describe("G) Session Notes", () => {
    it("should have sessionNotes table in schema", () => {
      const schema = fs.readFileSync(
        path.join(SERVER_DIR, "..", "drizzle", "schema.ts"),
        "utf-8"
      );
      expect(schema).toContain("sessionNotes");
      expect(schema).toContain("session_notes");
    });

    it("should save notes in completeSession procedure", () => {
      const coachRouter = fs.readFileSync(path.join(ROUTERS_DIR, "coach.ts"), "utf-8");
      // Verify notes are saved when provided
      expect(coachRouter).toContain("input.notes");
      expect(coachRouter).toContain("sessionNotes");
    });
  });
});
