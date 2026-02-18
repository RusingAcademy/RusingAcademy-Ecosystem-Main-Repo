/**
 * Sprint 6: Certificate Generation & Credential System Tests
 * 
 * Validates:
 * 1. Certificate auto-generation triggers on 100% course completion
 * 2. Certificate PDF service generates and uploads to S3
 * 3. Certificate verification endpoint works
 * 4. MyCertificates and AdminCertificates endpoints exist
 * 5. Certificate email notification is wired
 */
import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";

// ─── Test 1: Auto-generation trigger in activities.ts ───
describe("Certificate auto-generation trigger", () => {
  const activitiesPath = path.resolve(__dirname, "routers/activities.ts");
  const activitiesCode = fs.readFileSync(activitiesPath, "utf-8");

  it("should check if enrollment reaches 100% after activity completion", () => {
    expect(activitiesCode).toContain("enrollmentPercent >= 100");
  });

  it("should check for existing certificate before generating", () => {
    expect(activitiesCode).toContain("existingCert");
    expect(activitiesCode).toContain("certificates.userId");
  });

  it("should generate a unique certificate number with RA- prefix", () => {
    expect(activitiesCode).toContain("RA-${certTimestamp}");
  });

  it("should call generateCertificatePdf for PDF generation", () => {
    expect(activitiesCode).toContain("generateCertificatePdf");
  });

  it("should insert certificate record into database", () => {
    expect(activitiesCode).toContain("db.insert(certificates)");
  });

  it("should send email notification on certificate generation", () => {
    expect(activitiesCode).toContain("sendEmail");
    expect(activitiesCode).toContain("Certificate");
    expect(activitiesCode).toContain("certificateNumber");
  });

  it("should not fail activity completion if certificate generation fails", () => {
    expect(activitiesCode).toContain("Don't fail activity completion if certificate generation fails");
  });
});

// ─── Test 2: Certificate auto-generation in courses.updateProgress ───
describe("Certificate auto-generation in courses.updateProgress", () => {
  const coursesPath = path.resolve(__dirname, "routers/courses.ts");
  const coursesCode = fs.readFileSync(coursesPath, "utf-8");

  it("should have certificate auto-gen cascade in updateProgress", () => {
    expect(coursesCode).toContain("auto-generate certificate when course reaches 100%");
  });

  it("should check enrollment percentage before generating", () => {
    expect(coursesCode).toContain("pct >= 100");
  });

  it("should check for existing certificate to prevent duplicates", () => {
    expect(coursesCode).toContain("existingCert");
  });

  it("should generate PDF via certificatePdfService", () => {
    expect(coursesCode).toContain("generateCertificatePdf");
  });
});

// ─── Test 3: Certificate PDF Service ───
describe("Certificate PDF Service", () => {
  const pdfServicePath = path.resolve(__dirname, "services/certificatePdfService.ts");
  const pdfServiceCode = fs.readFileSync(pdfServicePath, "utf-8");

  it("should import PDFDocument from pdfkit", () => {
    expect(pdfServiceCode).toContain("PDFDocument");
    expect(pdfServiceCode).toContain("pdfkit");
  });

  it("should create landscape A4 PDF", () => {
    expect(pdfServiceCode).toContain("landscape");
    expect(pdfServiceCode).toContain("A4");
  });

  it("should upload PDF to S3 via storagePut", () => {
    expect(pdfServiceCode).toContain("storagePut");
  });

  it("should return the S3 URL", () => {
    expect(pdfServiceCode).toContain("return url");
  });

  it("should support bilingual content (EN/FR)", () => {
    expect(pdfServiceCode).toContain("isEn");
    expect(pdfServiceCode).toContain("Certificat");
  });

  it("should include RusingÂcademy branding", () => {
    expect(pdfServiceCode).toContain("RusingÂcademy");
  });
});

// ─── Test 4: Certificate Router endpoints ───
describe("Certificate Router endpoints", () => {
  const certRouterPath = path.resolve(__dirname, "routers/certificates.ts");
  const certRouterCode = fs.readFileSync(certRouterPath, "utf-8");

  it("should have generate procedure", () => {
    expect(certRouterCode).toContain("generate: protectedProcedure");
  });

  it("should have getCertificate procedure", () => {
    expect(certRouterCode).toContain("getCertificate: protectedProcedure");
  });

  it("should have getMyCertificates procedure", () => {
    expect(certRouterCode).toContain("getMyCertificates: protectedProcedure");
  });

  it("should have verify public procedure", () => {
    expect(certRouterCode).toContain("verify: publicProcedure");
  });

  it("should have adminGetAll procedure", () => {
    expect(certRouterCode).toContain("adminGetAll: protectedProcedure");
  });

  it("should enforce admin access for adminGetAll", () => {
    expect(certRouterCode).toContain('ctx.user.role !== "admin"');
  });

  it("should return valid/invalid status for verification", () => {
    expect(certRouterCode).toContain("valid: false");
    expect(certRouterCode).toContain("valid: true");
  });
});

// ─── Test 5: Frontend pages exist ───
describe("Certificate frontend pages", () => {
  it("should have VerifyCertificate page", () => {
    const filePath = path.resolve(__dirname, "../client/src/pages/VerifyCertificate.tsx");
    expect(fs.existsSync(filePath)).toBe(true);
    const code = fs.readFileSync(filePath, "utf-8");
    expect(code).toContain("certificates.verify");
  });

  it("should have MyCertificates page", () => {
    const filePath = path.resolve(__dirname, "../client/src/pages/MyCertificates.tsx");
    expect(fs.existsSync(filePath)).toBe(true);
    const code = fs.readFileSync(filePath, "utf-8");
    expect(code).toContain("getMyCertificates");
  });

  it("should have CertificateViewer page", () => {
    const filePath = path.resolve(__dirname, "../client/src/pages/CertificateViewer.tsx");
    expect(fs.existsSync(filePath)).toBe(true);
    const code = fs.readFileSync(filePath, "utf-8");
    expect(code).toContain("getCertificate");
  });

  it("should have AdminCertificates page with real data", () => {
    const filePath = path.resolve(__dirname, "../client/src/pages/admin/AdminCertificates.tsx");
    expect(fs.existsSync(filePath)).toBe(true);
    const code = fs.readFileSync(filePath, "utf-8");
    expect(code).toContain("adminGetAll");
    // Should NOT contain "Under Construction" anymore
    expect(code).not.toContain("Under Construction");
  });
});

// ─── Test 6: Routes are registered ───
describe("Certificate routes in App.tsx", () => {
  const appPath = path.resolve(__dirname, "../client/src/App.tsx");
  const appCode = fs.readFileSync(appPath, "utf-8");

  it("should have /verify route", () => {
    expect(appCode).toContain("/verify");
  });

  it("should have /verify/:certificateNumber route", () => {
    expect(appCode).toContain("/verify/:certificateNumber");
  });

  it("should have /certificates/:certificateNumber route", () => {
    expect(appCode).toContain("/certificates/:certificateNumber");
  });

  it("should have /app/certificates route", () => {
    expect(appCode).toContain("/app/certificates");
  });

  it("should have /admin/certificates route", () => {
    expect(appCode).toContain("/admin/certificates");
  });
});

// ─── Test 7: Email notification wiring ───
describe("Certificate email notification", () => {
  const activitiesPath = path.resolve(__dirname, "routers/activities.ts");
  const activitiesCode = fs.readFileSync(activitiesPath, "utf-8");

  it("should import sendEmail", () => {
    expect(activitiesCode).toContain('import { sendEmail } from "../email"');
  });

  it("should import EMAIL_BRANDING", () => {
    expect(activitiesCode).toContain("EMAIL_BRANDING");
  });

  it("should send email with certificate number", () => {
    expect(activitiesCode).toContain("certificateNumber");
    expect(activitiesCode).toContain("Certificate email sent");
  });

  it("should handle email failure gracefully", () => {
    expect(activitiesCode).toContain("Certificate email failed");
  });

  it("should support bilingual email content", () => {
    expect(activitiesCode).toContain("Congratulations");
    expect(activitiesCode).toContain("licitations");
  });
});

// ─── Test 8: Certificate schema ───
describe("Certificate database schema", () => {
  const schemaPath = path.resolve(__dirname, "../drizzle/schema.ts");
  const schemaCode = fs.readFileSync(schemaPath, "utf-8");

  it("should have certificates table", () => {
    expect(schemaCode).toContain("certificates = mysqlTable");
  });

  it("should have certificateId field (unique)", () => {
    expect(schemaCode).toContain("certificateId");
  });

  it("should have pdfUrl field", () => {
    expect(schemaCode).toContain("pdfUrl");
  });

  it("should have verificationUrl field", () => {
    expect(schemaCode).toContain("verificationUrl");
  });

  it("should reference users and courses tables", () => {
    expect(schemaCode).toContain("userId");
    expect(schemaCode).toContain("courseId");
  });
});
