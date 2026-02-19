// server/services/pdfReportService.ts — Phase 4: HR PDF Reports using jsPDF (already installed)
import { getDb } from "../db";
import { reportHistory } from "../../drizzle/schema";
import { eq, desc, and, lte } from "drizzle-orm";
import { createLogger } from "../logger";
import { v4 as uuidv4 } from "uuid";
import * as fs from "fs";
import * as path from "path";

const log = createLogger("services-pdfReport");

type ReportType = "candidates" | "interviews" | "onboarding" | "compliance" | "team";
type Locale = "en" | "fr";

interface ReportOptions {
  type: ReportType;
  dateRange: { start: Date; end: Date };
  filters?: Record<string, unknown>;
  locale: Locale;
  userId: number;
}

interface GeneratedReport {
  id: string;
  downloadPath: string;
  type: ReportType;
  generatedAt: Date;
}

// Ensure reports directory exists
const REPORTS_DIR = path.join(process.cwd(), "generated-reports");
if (!fs.existsSync(REPORTS_DIR)) {
  fs.mkdirSync(REPORTS_DIR, { recursive: true });
}

const LABELS: Record<Locale, Record<string, string>> = {
  en: {
    candidates: "Candidate Report",
    interviews: "Interview Report",
    onboarding: "Onboarding Report",
    compliance: "Compliance Report",
    team: "Team Report",
    generated: "Generated",
    period: "Period",
    total: "Total",
    status: "Status",
    name: "Name",
    position: "Position",
    date: "Date",
    score: "Score",
    department: "Department",
    progress: "Progress",
    requirement: "Requirement",
    priority: "Priority",
    role: "Role",
    page: "Page",
  },
  fr: {
    candidates: "Rapport des candidats",
    interviews: "Rapport des entrevues",
    onboarding: "Rapport d'intégration",
    compliance: "Rapport de conformité",
    team: "Rapport d'équipe",
    generated: "Généré le",
    period: "Période",
    total: "Total",
    status: "Statut",
    name: "Nom",
    position: "Poste",
    date: "Date",
    score: "Score",
    department: "Département",
    progress: "Progrès",
    requirement: "Exigence",
    priority: "Priorité",
    role: "Rôle",
    page: "Page",
  },
};

export const pdfReportService = {
  async generateReport(options: ReportOptions): Promise<GeneratedReport> {
    const { type, dateRange, filters, locale, userId } = options;
    const reportId = uuidv4();
    const filename = `${type}_${reportId}.pdf`;
    const filePath = path.join(REPORTS_DIR, filename);
    const l = LABELS[locale];

    // Dynamic import of jsPDF (CommonJS module)
    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

    // Header
    doc.setFontSize(20);
    doc.setTextColor(31, 41, 55);
    doc.text("RusingAcademy", 20, 20);
    doc.setFontSize(14);
    doc.text(l[type] || type, 20, 30);
    doc.setFontSize(10);
    doc.setTextColor(107, 114, 128);
    doc.text(`${l.generated}: ${new Date().toLocaleDateString(locale === "fr" ? "fr-CA" : "en-CA")}`, 20, 38);
    doc.text(`${l.period}: ${dateRange.start.toLocaleDateString()} — ${dateRange.end.toLocaleDateString()}`, 20, 44);

    // Separator
    doc.setDrawColor(229, 231, 235);
    doc.line(20, 48, 190, 48);

    // Body based on report type
    let yPos = 56;
    doc.setFontSize(11);
    doc.setTextColor(31, 41, 55);

    switch (type) {
      case "candidates":
        yPos = this.renderCandidateReport(doc, yPos, locale, filters);
        break;
      case "interviews":
        yPos = this.renderInterviewReport(doc, yPos, locale, filters);
        break;
      case "onboarding":
        yPos = this.renderOnboardingReport(doc, yPos, locale, filters);
        break;
      case "compliance":
        yPos = this.renderComplianceReport(doc, yPos, locale, filters);
        break;
      case "team":
        yPos = this.renderTeamReport(doc, yPos, locale, filters);
        break;
    }

    // Footer
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(156, 163, 175);
      doc.text(`${l.page} ${i}/${pageCount}`, 105, 290, { align: "center" });
      doc.text("RusingAcademy — Confidential", 20, 290);
    }

    // Save to file
    const pdfOutput = doc.output("arraybuffer");
    fs.writeFileSync(filePath, Buffer.from(pdfOutput));

    // Save to DB history
    try {
      const db = await getDb();
      await db.insert(reportHistory).values({
        id: reportId,
        type,
        userId,
        filePath: filename,
        filters: filters ? JSON.stringify(filters) : null,
        dateRangeStart: dateRange.start,
        dateRangeEnd: dateRange.end,
        locale,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      });
    } catch (err) {
      log.error("[PDF] Failed to save report history:", err);
    }

    log.info(`[PDF] Generated ${type} report: ${reportId}`);
    return { id: reportId, downloadPath: `/api/reports/download/${reportId}`, type, generatedAt: new Date() };
  },

  renderCandidateReport(doc: any, y: number, locale: Locale, _filters?: Record<string, unknown>): number {
    const l = LABELS[locale];
    doc.setFontSize(12);
    doc.text(locale === "fr" ? "Résumé des candidatures" : "Candidacy Summary", 20, y);
    y += 8;
    doc.setFontSize(10);
    const summaryData = [
      [l.total, "—"],
      [locale === "fr" ? "En attente" : "Pending", "—"],
      [locale === "fr" ? "Acceptés" : "Accepted", "—"],
      [locale === "fr" ? "Rejetés" : "Rejected", "—"],
    ];
    for (const [label, value] of summaryData) {
      doc.text(`${label}: ${value}`, 25, y);
      y += 6;
    }
    y += 4;
    doc.setFontSize(9);
    doc.setTextColor(107, 114, 128);
    doc.text(locale === "fr" ? "Les données seront remplies une fois la migration DB exécutée." : "Data will populate once the DB migration is executed.", 25, y);
    doc.setTextColor(31, 41, 55);
    return y + 10;
  },

  renderInterviewReport(doc: any, y: number, locale: Locale, _filters?: Record<string, unknown>): number {
    doc.setFontSize(12);
    doc.text(locale === "fr" ? "Résumé des entrevues" : "Interview Summary", 20, y);
    y += 8;
    doc.setFontSize(10);
    doc.text(locale === "fr" ? "Total des entrevues: —" : "Total Interviews: —", 25, y);
    y += 6;
    doc.text(locale === "fr" ? "Score moyen: —" : "Average Score: —", 25, y);
    return y + 10;
  },

  renderOnboardingReport(doc: any, y: number, locale: Locale, _filters?: Record<string, unknown>): number {
    doc.setFontSize(12);
    doc.text(locale === "fr" ? "Résumé de l'intégration" : "Onboarding Summary", 20, y);
    y += 8;
    doc.setFontSize(10);
    doc.text(locale === "fr" ? "Intégrations en cours: —" : "Onboardings in progress: —", 25, y);
    y += 6;
    doc.text(locale === "fr" ? "Complétées: —" : "Completed: —", 25, y);
    return y + 10;
  },

  renderComplianceReport(doc: any, y: number, locale: Locale, _filters?: Record<string, unknown>): number {
    doc.setFontSize(12);
    doc.text(locale === "fr" ? "Résumé de conformité" : "Compliance Summary", 20, y);
    y += 8;
    doc.setFontSize(10);
    doc.text(locale === "fr" ? "Taux de conformité: —" : "Compliance Rate: —", 25, y);
    y += 6;
    doc.text(locale === "fr" ? "Éléments non conformes: —" : "Non-compliant items: —", 25, y);
    return y + 10;
  },

  renderTeamReport(doc: any, y: number, locale: Locale, _filters?: Record<string, unknown>): number {
    doc.setFontSize(12);
    doc.text(locale === "fr" ? "Résumé de l'équipe" : "Team Summary", 20, y);
    y += 8;
    doc.setFontSize(10);
    doc.text(locale === "fr" ? "Membres actifs: —" : "Active Members: —", 25, y);
    y += 6;
    doc.text(locale === "fr" ? "Formations complétées: —" : "Trainings Completed: —", 25, y);
    return y + 10;
  },

  // Get report history for a user
  async getReportHistory(userId: number, limit: number = 20) {
    const db = await getDb();
    return db.select().from(reportHistory).where(eq(reportHistory.userId, userId)).orderBy(desc(reportHistory.createdAt)).limit(limit);
  },

  // Download a report file
  getReportFilePath(filename: string): string | null {
    const filePath = path.join(REPORTS_DIR, filename);
    return fs.existsSync(filePath) ? filePath : null;
  },

  // Cleanup expired reports
  async cleanupExpired(): Promise<number> {
    const db = await getDb();
    const expired = await db.select().from(reportHistory).where(lte(reportHistory.expiresAt, new Date()));

    for (const report of expired) {
      const filePath = path.join(REPORTS_DIR, report.filePath);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    await db.delete(reportHistory).where(lte(reportHistory.expiresAt, new Date()));
    log.info(`[PDF] Cleaned up ${expired.length} expired reports`);
    return expired.length;
  },
};
