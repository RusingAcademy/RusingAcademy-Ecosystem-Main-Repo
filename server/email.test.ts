/**
 * Email Template Tests
 * 
 * Tests to verify that email templates render correctly with:
 * - RusingÂcademy branding (logo, colors)
 * - Tax breakdown (Subtotal + 13% HST + Total)
 * - Legal footer (Rusinga International Consulting Ltd.)
 */

import { describe, it, expect } from "vitest";
import { 
  EMAIL_BRANDING, 
  generateEmailHeader, 
  generateEmailFooter, 
  generateTaxBreakdown,
  wrapEmailContent 
} from "./email-branding";

describe("Email Templates", () => {
  describe("Email Branding Constants", () => {
    it("should have all required logo URLs", () => {
      expect(EMAIL_BRANDING.logos.banner).toBeDefined();
      expect(EMAIL_BRANDING.logos.icon).toBeDefined();
      expect(EMAIL_BRANDING.logos.square).toBeDefined();
      
      // Check that URLs are valid CloudFront URLs
      expect(EMAIL_BRANDING.logos.banner).toMatch(/^https:\/\/.*cloudfront\.net/);
      expect(EMAIL_BRANDING.logos.icon).toMatch(/^https:\/\/.*cloudfront\.net/);
      expect(EMAIL_BRANDING.logos.square).toMatch(/^https:\/\/.*cloudfront\.net/);
    });

    it("should have correct brand colors", () => {
      expect(EMAIL_BRANDING.colors.primary).toBe("#0d9488");
      expect(EMAIL_BRANDING.colors.secondary).toBe("#f97316");
    });

    it("should have correct company legal information", () => {
      expect(EMAIL_BRANDING.company.legalName).toBe("Rusinga International Consulting Ltd.");
      expect(EMAIL_BRANDING.company.tradeName).toBe("RusingÂcademy");
      expect(EMAIL_BRANDING.company.productName).toBe("Lingueefy");
    });

    it("should have correct tax information for Ontario HST", () => {
      expect(EMAIL_BRANDING.company.taxInfo.rate).toBe(0.13);
      expect(EMAIL_BRANDING.company.taxInfo.name).toBe("HST");
      expect(EMAIL_BRANDING.company.taxInfo.region).toBe("Ontario, Canada");
    });
  });

  describe("Legal Footer", () => {
    it("should include parent company legal name in English footer", () => {
      expect(EMAIL_BRANDING.footer.en).toContain("Rusinga International Consulting Ltd.");
      expect(EMAIL_BRANDING.footer.en).toContain("RusingÂcademy");
    });

    it("should include parent company legal name in French footer", () => {
      expect(EMAIL_BRANDING.footer.fr).toContain("Rusinga International Consulting Ltd.");
      expect(EMAIL_BRANDING.footer.fr).toContain("RusingÂcademy");
    });
  });

  describe("Tax Breakdown Display", () => {
    it("should calculate HST correctly (13%)", () => {
      const subtotal = 6700; // $67.00
      const expectedTax = Math.round(subtotal * EMAIL_BRANDING.company.taxInfo.rate);
      expect(expectedTax).toBe(871);
    });

    it("should calculate total correctly", () => {
      const subtotal = 6700;
      const tax = Math.round(subtotal * 0.13);
      const total = subtotal + tax;
      expect(total).toBe(7571);
    });

    it("should generate tax breakdown HTML with correct values", () => {
      const html = generateTaxBreakdown(6700, 871, 7571, "en");
      
      expect(html).toContain("$67.00 CAD");
      expect(html).toContain("$8.71 CAD");
      expect(html).toContain("$75.71 CAD");
      expect(html).toContain("HST (13%)");
    });

    it("should generate French tax breakdown", () => {
      const html = generateTaxBreakdown(6700, 871, 7571, "fr");
      
      expect(html).toContain("Sous-total");
      expect(html).toContain("TVH (13%)");
      expect(html).toContain("Total payé");
    });
  });

  describe("Email Header Generation", () => {
    it("should include RusingÂcademy logo in header", () => {
      const header = generateEmailHeader("Test Title", "Test Subtitle");
      
      expect(header).toContain(EMAIL_BRANDING.logos.banner);
      expect(header).toContain("RusingÂcademy");
      expect(header).toContain("Test Title");
      expect(header).toContain("Test Subtitle");
    });

    it("should use brand colors in header", () => {
      const header = generateEmailHeader("Test");
      
      expect(header).toContain(EMAIL_BRANDING.colors.primary);
    });
  });

  describe("Email Footer Generation", () => {
    it("should include legal text in English footer", () => {
      const footer = generateEmailFooter("en");
      
      expect(footer).toContain("Rusinga International Consulting Ltd.");
      expect(footer).toContain("RusingÂcademy");
      expect(footer).toContain("Questions?");
      expect(footer).toContain("Contact us");
    });

    it("should include legal text in French footer", () => {
      const footer = generateEmailFooter("fr");
      
      expect(footer).toContain("Rusinga International Consulting Ltd.");
      expect(footer).toContain("RusingÂcademy");
      expect(footer).toContain("Des questions?");
      expect(footer).toContain("Contactez-nous");
    });
  });

  describe("Complete Email Wrapper", () => {
    it("should generate complete HTML email with all branding elements", () => {
      const html = wrapEmailContent(
        "Session Confirmed",
        "Your booking is complete",
        "<p>Test content</p>",
        "en"
      );
      
      // Check structure
      expect(html).toContain("<!DOCTYPE html>");
      expect(html).toContain('<html lang="en">');
      
      // Check branding
      expect(html).toContain(EMAIL_BRANDING.logos.banner);
      expect(html).toContain(EMAIL_BRANDING.colors.primary);
      
      // Check content
      expect(html).toContain("Session Confirmed");
      expect(html).toContain("Your booking is complete");
      expect(html).toContain("<p>Test content</p>");
      
      // Check footer
      expect(html).toContain("Rusinga International Consulting Ltd.");
    });

    it("should support French language", () => {
      const html = wrapEmailContent(
        "Session Confirmée",
        "Votre réservation est complète",
        "<p>Contenu test</p>",
        "fr"
      );
      
      expect(html).toContain('<html lang="fr">');
      expect(html).toContain("Des questions?");
    });
  });
});
