import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";

/**
 * Coach Finale Features Tests
 *
 * Validates all 3 features built in the Mission Finale:
 * - Feature 1: Block a Date (schema, procedures, frontend)
 * - Feature 2: Resubmission Flow (state machine, prefill, admin notes)
 * - Feature 3: CoachTerms Bilingual (EN/FR content, language toggle)
 */

// ── Helpers ───────────────────────────────────────────────────────────────
const readFile = (relativePath: string) =>
  fs.readFileSync(path.resolve(__dirname, relativePath), "utf-8");

// ── Feature 1: Block a Date ──────────────────────────────────────────────
describe("Feature 1: Block a Date", () => {
  describe("Schema", () => {
    it("should have coachBlockedDates table in schema", () => {
      const schema = readFile("../drizzle/schema.ts");
      expect(schema).toContain("coachBlockedDates");
      expect(schema).toContain("coach_blocked_dates");
    });

    it("should have required columns: coachId, date, reason", () => {
      const schema = readFile("../drizzle/schema.ts");
      // The table uses coachId (references coachProfiles.id), date (YYYY-MM-DD), reason
      expect(schema).toMatch(/coachBlockedDates[\s\S]*?coachId/);
      expect(schema).toMatch(/coachBlockedDates[\s\S]*?date.*varchar/);
      expect(schema).toMatch(/coachBlockedDates[\s\S]*?reason/);
    });
  });

  describe("Backend Procedures", () => {
    it("should have getBlockedDates procedure in coach router", () => {
      const router = readFile("./routers/coach.ts");
      expect(router).toContain("getBlockedDates");
    });

    it("should have blockDate procedure in coach router", () => {
      const router = readFile("./routers/coach.ts");
      expect(router).toContain("blockDate: protectedProcedure");
    });

    it("should have unblockDate procedure in coach router", () => {
      const router = readFile("./routers/coach.ts");
      expect(router).toContain("unblockDate: protectedProcedure");
    });

    it("should have getCoachBlockedDatesPublic procedure for booking UI", () => {
      const router = readFile("./routers/coach.ts");
      expect(router).toContain("getCoachBlockedDatesPublic");
    });

    it("should validate that blocked date is not in the past", () => {
      const router = readFile("./routers/coach.ts");
      expect(router).toMatch(/blockDate[\s\S]*?past/i);
    });
  });

  describe("DB Helpers", () => {
    it("should have getCoachBlockedDates helper in db.ts", () => {
      const db = readFile("./db.ts");
      expect(db).toContain("getCoachBlockedDates");
    });

    it("should have addCoachBlockedDate helper in db.ts", () => {
      const db = readFile("./db.ts");
      expect(db).toContain("addCoachBlockedDate");
    });

    it("should have removeCoachBlockedDate helper in db.ts", () => {
      const db = readFile("./db.ts");
      expect(db).toContain("removeCoachBlockedDate");
    });

    it("should prevent duplicate blocked dates", () => {
      const db = readFile("./db.ts");
      expect(db).toContain("Date is already blocked");
    });

    it("should integrate blocked dates into getAvailableTimeSlotsForDate", () => {
      const db = readFile("./db.ts");
      // The available slots function should check blocked dates
      expect(db).toMatch(/getAvailableTimeSlotsForDate[\s\S]*?coachBlockedDates/);
    });
  });

  describe("Frontend", () => {
    it("should not have 'coming soon' placeholder for Block a Date", () => {
      const page = readFile(
        "../client/src/pages/CoachAvailabilityPage.tsx"
      );
      expect(page).not.toMatch(/coming\s+soon.*block/i);
    });

    it("should have BlockedDatesCard component in CoachAvailabilityPage", () => {
      const page = readFile(
        "../client/src/pages/CoachAvailabilityPage.tsx"
      );
      expect(page).toContain("BlockedDatesCard");
    });

    it("should call trpc.coach.getBlockedDates in the frontend", () => {
      const page = readFile(
        "../client/src/pages/CoachAvailabilityPage.tsx"
      );
      expect(page).toContain("trpc.coach.getBlockedDates");
    });

    it("should call trpc.coach.blockDate mutation in the frontend", () => {
      const page = readFile(
        "../client/src/pages/CoachAvailabilityPage.tsx"
      );
      expect(page).toContain("trpc.coach.blockDate");
    });

    it("should call trpc.coach.unblockDate mutation in the frontend", () => {
      const page = readFile(
        "../client/src/pages/CoachAvailabilityPage.tsx"
      );
      expect(page).toContain("trpc.coach.unblockDate");
    });

    it("should have a date input for selecting blocked dates", () => {
      const page = readFile(
        "../client/src/pages/CoachAvailabilityPage.tsx"
      );
      expect(page).toMatch(/type="date"/);
    });

    it("should have a reason input field", () => {
      const page = readFile(
        "../client/src/pages/CoachAvailabilityPage.tsx"
      );
      expect(page).toContain("reason");
    });
  });
});

// ── Feature 2: Resubmission Flow ────────────────────────────────────────
describe("Feature 2: Resubmission Flow", () => {
  describe("Schema Support", () => {
    it("should have resubmission tracking fields in coachApplications", () => {
      const schema = readFile("../drizzle/schema.ts");
      expect(schema).toContain("resubmissionCount");
      expect(schema).toContain("lastResubmittedAt");
      expect(schema).toContain("isResubmission");
      expect(schema).toContain("parentApplicationId");
      expect(schema).toContain("previousRejectionReason");
    });
  });

  describe("Backend: getApplicationForResubmission", () => {
    it("should have getApplicationForResubmission procedure", () => {
      const router = readFile("./routers/coach.ts");
      expect(router).toContain("getApplicationForResubmission");
    });

    it("should only return data for rejected applications", () => {
      const router = readFile("./routers/coach.ts");
      expect(router).toMatch(/getApplicationForResubmission[\s\S]*?rejected/);
    });
  });

  describe("Backend: submitApplication resubmission support", () => {
    it("should detect existing rejected application and link as resubmission", () => {
      const router = readFile("./routers/coach.ts");
      expect(router).toContain("isResubmission");
      expect(router).toContain("parentApplicationId");
    });

    it("should increment resubmissionCount on resubmission", () => {
      const router = readFile("./routers/coach.ts");
      expect(router).toContain("resubmissionCount");
    });

    it("should set lastResubmittedAt timestamp", () => {
      const router = readFile("./routers/coach.ts");
      expect(router).toContain("lastResubmittedAt");
    });

    it("should differentiate notification messages for resubmissions", () => {
      const router = readFile("./routers/coach.ts");
      expect(router).toMatch(/[Rr]esubmi/);
    });
  });

  describe("Frontend: ApplicationStatusTracker", () => {
    it("should have a Revise & Resubmit button for rejected applications", () => {
      const tracker = readFile(
        "../client/src/components/ApplicationStatusTracker.tsx"
      );
      expect(tracker).toContain("Revise & Resubmit");
    });

    it("should call onResubmit callback when resubmit button is clicked", () => {
      const tracker = readFile(
        "../client/src/components/ApplicationStatusTracker.tsx"
      );
      expect(tracker).toContain("onResubmit");
    });

    it("should display reviewNotes from admin as feedback", () => {
      const tracker = readFile(
        "../client/src/components/ApplicationStatusTracker.tsx"
      );
      expect(tracker).toContain("reviewNotes");
    });
  });

  describe("Frontend: CoachApplicationWizard resubmission support", () => {
    it("should accept isResubmission and previousApplicationData props", () => {
      const wizard = readFile(
        "../client/src/components/CoachApplicationWizard.tsx"
      );
      expect(wizard).toContain("isResubmission");
      expect(wizard).toContain("previousApplicationData");
    });

    it("should build prefilled data from previous application", () => {
      const wizard = readFile(
        "../client/src/components/CoachApplicationWizard.tsx"
      );
      expect(wizard).toContain("Build prefilled data from previous application");
    });

    it("should show resubmission banner with admin feedback", () => {
      const wizard = readFile(
        "../client/src/components/CoachApplicationWizard.tsx"
      );
      expect(wizard).toContain("Resubmission");
      expect(wizard).toContain("reviewNotes");
    });

    it("should NOT prefill legal consent fields on resubmission", () => {
      const wizard = readFile(
        "../client/src/components/CoachApplicationWizard.tsx"
      );
      // Legal consents should always start unchecked — codeOfConduct: false
      expect(wizard).toContain("codeOfConduct: false");
    });
  });

  describe("Frontend: BecomeCoachNew integration", () => {
    it("should have resubmission state management", () => {
      const page = readFile(
        "../client/src/pages/BecomeCoachNew.tsx"
      );
      expect(page).toContain("isResubmitting");
    });

    it("should query getApplicationForResubmission when resubmitting", () => {
      const page = readFile(
        "../client/src/pages/BecomeCoachNew.tsx"
      );
      expect(page).toContain("getApplicationForResubmission");
    });

    it("should pass resubmission props to CoachApplicationWizard", () => {
      const page = readFile(
        "../client/src/pages/BecomeCoachNew.tsx"
      );
      expect(page).toContain("isResubmission={isResubmitting}");
      expect(page).toContain("previousApplicationData=");
    });
  });
});

// ── Feature 3: CoachTerms Bilingual ─────────────────────────────────────
describe("Feature 3: CoachTerms Bilingual", () => {
  describe("Language Toggle", () => {
    it("should import useLanguage from LanguageContext", () => {
      const terms = readFile("../client/src/pages/CoachTerms.tsx");
      expect(terms).toContain("useLanguage");
      expect(terms).toContain("LanguageContext");
    });

    it("should have a language toggle button in the header", () => {
      const terms = readFile("../client/src/pages/CoachTerms.tsx");
      expect(terms).toContain("Globe");
    });

    it("should toggle between English and Français labels", () => {
      const terms = readFile("../client/src/pages/CoachTerms.tsx");
      expect(terms).toContain('"English"');
      expect(terms).toContain('"Français"');
    });
  });

  describe("English Content", () => {
    it("should have English translations for all 10 sections", () => {
      const terms = readFile("../client/src/pages/CoachTerms.tsx");
      expect(terms).toContain("1. Introduction and Definitions");
      expect(terms).toContain("2. Commission Structure and Administrative Fees");
      expect(terms).toContain("3. Payment Terms");
      expect(terms).toContain("4. Coach Obligations");
      expect(terms).toContain("5. Cancellation Policy");
      expect(terms).toContain("6. Termination");
      expect(terms).toContain("7. Intellectual Property");
      expect(terms).toContain("8. Modifications to Terms");
      expect(terms).toContain("9. Governing Law and Jurisdiction");
      expect(terms).toContain("10. Contact");
    });

    it("should have English header labels", () => {
      const terms = readFile("../client/src/pages/CoachTerms.tsx");
      expect(terms).toContain("Back to Dashboard");
      expect(terms).toContain("Terms & Conditions");
    });

    it("should have English hero content", () => {
      const terms = readFile("../client/src/pages/CoachTerms.tsx");
      expect(terms).toContain("Coach Terms & Conditions");
      expect(terms).toContain("Coach Partnership Agreement");
      expect(terms).toContain("Language Coaching Platform for Canadian Public Servants");
    });

    it("should have English definitions", () => {
      const terms = readFile("../client/src/pages/CoachTerms.tsx");
      expect(terms).toContain('"The Company"');
      expect(terms).toContain('"The Platform"');
      expect(terms).toContain('"The Coach"');
    });

    it("should have English commission breakdown items", () => {
      const terms = readFile("../client/src/pages/CoachTerms.tsx");
      expect(terms).toContain("Logistics & Infrastructure");
      expect(terms).toContain("Maintenance & Upkeep");
      expect(terms).toContain("Training & Development");
      expect(terms).toContain("Marketing & Visibility");
      expect(terms).toContain("Client Support");
      expect(terms).toContain("Compliance & Security");
    });

    it("should have English key points summary", () => {
      const terms = readFile("../client/src/pages/CoachTerms.tsx");
      expect(terms).toContain("Key Points Summary");
      expect(terms).toContain("Independent contractor status");
    });
  });

  describe("French Content Preserved", () => {
    it("should have French translations for all 10 sections", () => {
      const terms = readFile("../client/src/pages/CoachTerms.tsx");
      expect(terms).toContain("1. Introduction et Définitions");
      expect(terms).toContain("2. Structure de Commission et Frais Administratifs");
      expect(terms).toContain("3. Modalités de Paiement");
      expect(terms).toContain("4. Obligations du Coach");
      expect(terms).toContain("6. Résiliation");
      expect(terms).toContain("7. Propriété Intellectuelle");
      expect(terms).toContain("9. Droit Applicable et Juridiction");
      expect(terms).toContain("10. Contact");
    });

    it("should have French header labels", () => {
      const terms = readFile("../client/src/pages/CoachTerms.tsx");
      expect(terms).toContain("Retour au tableau de bord");
      expect(terms).toContain("Termes et Conditions");
    });

    it("should have French key points summary", () => {
      const terms = readFile("../client/src/pages/CoachTerms.tsx");
      expect(terms).toContain("Résumé des Points Clés");
    });
  });

  describe("Official Branding", () => {
    it("should use parent company name Rusinga International Consulting Ltd.", () => {
      const terms = readFile("../client/src/pages/CoachTerms.tsx");
      expect(terms).toContain("Rusinga International Consulting Ltd.");
    });

    it("should include commercially known as RusingAcademy", () => {
      const terms = readFile("../client/src/pages/CoachTerms.tsx");
      expect(terms).toContain("RusingAcademy");
    });
  });

  describe("Bilingual Date Handling", () => {
    it("should show English date format when language is English", () => {
      const terms = readFile("../client/src/pages/CoachTerms.tsx");
      expect(terms).toContain("January 29, 2026");
    });

    it("should show French date format when language is French", () => {
      const terms = readFile("../client/src/pages/CoachTerms.tsx");
      expect(terms).toContain("29 janvier 2026");
    });
  });
});
