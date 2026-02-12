import { describe, it, expect, vi } from "vitest";
import { z } from "zod";
import * as fs from "fs";
import * as path from "path";

/**
 * Coach Mission Priority Fixes Tests
 * 
 * Validates all fixes applied during the Priority Mission:
 * - SEC-1: adminProcedure allows owner (OWNER_OPEN_ID)
 * - BUG-6: Residency status collected in wizard
 * - UX-1: Draft auto-save in wizard
 * - Bloc B: Admin dashboard procedures properly routed
 * - Bloc C: Admin approval/rejection race conditions fixed
 * - Bloc D: Broken links fixed (/coach/profile → /app/coach-profile, etc.)
 * - Bloc E: hasAvailability wired to real query
 */

describe("Coach Mission Priority Fixes", () => {

  describe("SEC-1: adminProcedure allows owner", () => {
    it("should check both role and OWNER_OPEN_ID in adminProcedure", () => {
      const trpcFile = fs.readFileSync(
        path.resolve(__dirname, "./_core/trpc.ts"),
        "utf-8"
      );
      // Should check isAdmin OR isOwner
      expect(trpcFile).toContain("const isAdmin = ctx.user?.role === 'admin'");
      expect(trpcFile).toContain("const isOwner = ctx.user?.openId === process.env.OWNER_OPEN_ID");
      expect(trpcFile).toContain("(!isAdmin && !isOwner)");
    });
  });

  describe("BUG-6: Residency status in wizard", () => {
    it("should have residencyStatus field in the submitApplication input schema", () => {
      const coachRouter = fs.readFileSync(
        path.resolve(__dirname, "./routers/coach.ts"),
        "utf-8"
      );
      expect(coachRouter).toContain('residencyStatus: z.enum(["canadian_citizen", "permanent_resident", "work_visa", "other"])');
      expect(coachRouter).toContain("residencyStatusOther: z.string()");
    });

    it("should write residencyStatus to the database insert", () => {
      const coachRouter = fs.readFileSync(
        path.resolve(__dirname, "./routers/coach.ts"),
        "utf-8"
      );
      expect(coachRouter).toContain("residencyStatus: input.residencyStatus || null");
      expect(coachRouter).toContain("residencyStatusOther: input.residencyStatusOther || null");
    });

    it("should have residencyStatus in the wizard form", () => {
      const wizard = fs.readFileSync(
        path.resolve(__dirname, "../client/src/components/CoachApplicationWizard.tsx"),
        "utf-8"
      );
      expect(wizard).toContain("residencyStatus: string");
      expect(wizard).toContain("residencyStatusOther: string");
      expect(wizard).toContain('value="canadian_citizen"');
      expect(wizard).toContain('value="permanent_resident"');
      expect(wizard).toContain('value="work_visa"');
    });

    it("should validate residencyStatus in Step 1", () => {
      const wizard = fs.readFileSync(
        path.resolve(__dirname, "../client/src/components/CoachApplicationWizard.tsx"),
        "utf-8"
      );
      expect(wizard).toContain("data.personalInfo.residencyStatus");
    });

    it("should have residencyStatus and residencyStatusOther columns in schema", () => {
      const schema = fs.readFileSync(
        path.resolve(__dirname, "../drizzle/schema.ts"),
        "utf-8"
      );
      expect(schema).toContain('residencyStatus');
      expect(schema).toContain('residencyStatusOther');
    });
  });

  describe("UX-1: Draft auto-save in wizard", () => {
    it("should have localStorage draft save/restore logic", () => {
      const wizard = fs.readFileSync(
        path.resolve(__dirname, "../client/src/components/CoachApplicationWizard.tsx"),
        "utf-8"
      );
      expect(wizard).toContain('DRAFT_KEY = "coach_application_draft"');
      expect(wizard).toContain("localStorage.setItem(DRAFT_KEY");
      expect(wizard).toContain("localStorage.getItem(DRAFT_KEY)");
    });

    it("should clear draft on successful submission", () => {
      const wizard = fs.readFileSync(
        path.resolve(__dirname, "../client/src/components/CoachApplicationWizard.tsx"),
        "utf-8"
      );
      expect(wizard).toContain("clearDraft()");
      expect(wizard).toContain('localStorage.removeItem(DRAFT_KEY)');
    });

    it("should show draft restored banner with Start Fresh option", () => {
      const wizard = fs.readFileSync(
        path.resolve(__dirname, "../client/src/components/CoachApplicationWizard.tsx"),
        "utf-8"
      );
      expect(wizard).toContain("draftRestored");
      expect(wizard).toContain("Start Fresh");
      expect(wizard).toContain("Recommencer");
    });

    it("should not serialize file objects in the draft", () => {
      const wizard = fs.readFileSync(
        path.resolve(__dirname, "../client/src/components/CoachApplicationWizard.tsx"),
        "utf-8"
      );
      // Ensure photoFile and videoFile are set to null before saving
      expect(wizard).toContain("photoFile: null");
      expect(wizard).toContain("videoFile: null");
    });
  });

  describe("Bloc B: Admin dashboard procedures routing", () => {
    it("should have adminApplicationDashboard router file", () => {
      const exists = fs.existsSync(
        path.resolve(__dirname, "./routers/adminApplicationDashboard.ts")
      );
      expect(exists).toBe(true);
    });

    it("should register adminApplicationDashboard in admin router", () => {
      const adminRouter = fs.readFileSync(
        path.resolve(__dirname, "./routers/admin.ts"),
        "utf-8"
      );
      expect(adminRouter).toContain("adminApplicationDashboard");
    });

    it("should have getApplicationsForDashboard in the new router", () => {
      const dashboardRouter = fs.readFileSync(
        path.resolve(__dirname, "./routers/adminApplicationDashboard.ts"),
        "utf-8"
      );
      expect(dashboardRouter).toContain("getApplicationsForDashboard");
      expect(dashboardRouter).toContain("getApplicationStats");
      expect(dashboardRouter).toContain("getApplicationDetail");
    });

    it("should not have dashboard procedures in documents router", () => {
      const documentsRouter = fs.readFileSync(
        path.resolve(__dirname, "./routers/documents.ts"),
        "utf-8"
      );
      expect(documentsRouter).not.toContain("getApplicationsForDashboard");
      expect(documentsRouter).not.toContain("getApplicationStats");
      expect(documentsRouter).not.toContain("bulkApproveApplications");
    });
  });

  describe("Bloc C: Admin approval/rejection workflow", () => {
    it("should use onSuccess callbacks instead of immediate refetch", () => {
      const dashboard = fs.readFileSync(
        path.resolve(__dirname, "../client/src/components/AdminApplicationDashboard.tsx"),
        "utf-8"
      );
      // Should use onSuccess pattern, not immediate refetch after mutate
      expect(dashboard).toContain("onSuccess");
    });

    it("should have a detail modal for viewing application details", () => {
      const dashboard = fs.readFileSync(
        path.resolve(__dirname, "../client/src/components/AdminApplicationDashboard.tsx"),
        "utf-8"
      );
      expect(dashboard).toContain("selectedApplication");
      expect(dashboard).toContain("showDetailModal");
    });
  });

  describe("Bloc D: Broken links fixed", () => {
    it("should not have /coach/profile links (should be /app/coach-profile)", () => {
      const files = [
        "../client/src/pages/CoachDashboard.tsx",
        "../client/src/pages/CoachAvailabilityPage.tsx",
        "../client/src/pages/CoachProfileEditor.tsx",
      ];
      
      for (const file of files) {
        const content = fs.readFileSync(
          path.resolve(__dirname, file),
          "utf-8"
        );
        expect(content).not.toContain('href="/coach/profile"');
      }
    });

    it("should not have /coach/availability links (should be /app/availability)", () => {
      const files = [
        "../client/src/pages/CoachDashboard.tsx",
        "../client/src/pages/CoachProfileEditor.tsx",
      ];
      
      for (const file of files) {
        const content = fs.readFileSync(
          path.resolve(__dirname, file),
          "utf-8"
        );
        expect(content).not.toContain('href="/coach/availability"');
      }
    });

    it("should use /app/availability in CoachDashboard", () => {
      const content = fs.readFileSync(
        path.resolve(__dirname, "../client/src/pages/CoachDashboard.tsx"),
        "utf-8"
      );
      expect(content).toContain('href="/app/availability"');
    });

    it("should use /app/coach-profile in CoachAvailabilityPage", () => {
      const content = fs.readFileSync(
        path.resolve(__dirname, "../client/src/pages/CoachAvailabilityPage.tsx"),
        "utf-8"
      );
      expect(content).toContain('href="/app/coach-profile"');
    });
  });

  describe("Bloc E: hasAvailability wired to real query", () => {
    it("should query getAvailability in CoachDashboard", () => {
      const dashboard = fs.readFileSync(
        path.resolve(__dirname, "../client/src/pages/CoachDashboard.tsx"),
        "utf-8"
      );
      expect(dashboard).toContain("trpc.coach.getAvailability.useQuery");
      expect(dashboard).toContain("availabilityData");
    });

    it("should use availabilityData for hasAvailability prop", () => {
      const dashboard = fs.readFileSync(
        path.resolve(__dirname, "../client/src/pages/CoachDashboard.tsx"),
        "utf-8"
      );
      expect(dashboard).toContain("hasAvailability={Array.isArray(availabilityData)");
      expect(dashboard).not.toContain("hasAvailability={true}");
    });
  });

  describe("UX-6: Post-login redirect", () => {
    it("should have PostLoginRedirect component in App.tsx", () => {
      const app = fs.readFileSync(
        path.resolve(__dirname, "../client/src/App.tsx"),
        "utf-8"
      );
      expect(app).toContain("PostLoginRedirect");
      expect(app).toContain("postLoginRedirect");
    });

    it("should set postLoginRedirect in BecomeCoachNew before signup redirect", () => {
      const page = fs.readFileSync(
        path.resolve(__dirname, "../client/src/pages/BecomeCoachNew.tsx"),
        "utf-8"
      );
      expect(page).toContain("localStorage.setItem");
      expect(page).toContain("postLoginRedirect");
    });

    it("should auto-open wizard when ?apply=true is present", () => {
      const page = fs.readFileSync(
        path.resolve(__dirname, "../client/src/pages/BecomeCoachNew.tsx"),
        "utf-8"
      );
      expect(page).toContain("apply=true");
      expect(page).toContain("setShowApplication(true)");
    });
  });
});
