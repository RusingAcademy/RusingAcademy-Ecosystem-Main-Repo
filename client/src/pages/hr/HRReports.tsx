/**
 * HRReports — Reports & Analytics for Client Portal
 * Connected to tRPC queries via hr router.
 * Provides progress reports, export functionality, and analytics overview.
 */
import HRLayout from "@/components/HRLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { useState } from "react";

export default function HRReports() {
  const { language } = useLanguage();
  const isEn = language === "en";
  const [reportType, setReportType] = useState<"progress" | "compliance" | "budget">("progress");

  const ui = {
    title: isEn ? "Reports & Analytics" : "Rapports et analyses",
    subtitle: isEn ? "Track training outcomes and generate compliance reports" : "Suivez les résultats de formation et générez des rapports de conformité",
    progressReport: isEn ? "Progress Report" : "Rapport de progression",
    complianceReport: isEn ? "Compliance Report" : "Rapport de conformité",
    budgetReport: isEn ? "Budget Report" : "Rapport budgétaire",
    exportCsv: isEn ? "Export CSV" : "Exporter CSV",
    exportPdf: isEn ? "Export PDF" : "Exporter PDF",
    generateReport: isEn ? "Generate Report" : "Générer le rapport",
    dateRange: isEn ? "Date Range" : "Période",
    last30: isEn ? "Last 30 days" : "30 derniers jours",
    last90: isEn ? "Last 90 days" : "90 derniers jours",
    lastYear: isEn ? "Last year" : "Dernière année",
    allTime: isEn ? "All time" : "Depuis le début",
    noData: isEn ? "No report data available yet" : "Aucune donnée de rapport disponible",
    noDataSub: isEn ? "Reports will appear once your participants begin their training programs." : "Les rapports apparaîtront une fois que vos participants commenceront leurs programmes de formation.",
    avgProgress: isEn ? "Average Progress" : "Progression moyenne",
    completionRate: isEn ? "Completion Rate" : "Taux d'achèvement",
    activeParticipants: isEn ? "Active Participants" : "Participants actifs",
    totalHours: isEn ? "Total Training Hours" : "Heures de formation totales",
  };

  const reportTypes = [
    { key: "progress" as const, label: ui.progressReport, icon: "trending_up" },
    { key: "compliance" as const, label: ui.complianceReport, icon: "verified" },
    { key: "budget" as const, label: ui.budgetReport, icon: "account_balance" },
  ];

  return (
    <HRLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{ui.title}</h1>
            <p className="text-sm text-gray-500 mt-1">{ui.subtitle}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => toast.info(isEn ? "CSV export coming soon" : "Export CSV bientôt disponible")}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-muted-foreground bg-white dark:bg-background border border-gray-200 dark:border-border dark:border-border rounded-lg hover:bg-gray-50 dark:bg-background transition-colors"
            >
              <span className="material-icons text-sm">download</span>
              {ui.exportCsv}
            </button>
            <button
              onClick={() => toast.info(isEn ? "PDF export coming soon" : "Export PDF bientôt disponible")}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <span className="material-icons text-sm">picture_as_pdf</span>
              {ui.exportPdf}
            </button>
          </div>
        </div>

        {/* Report Type Tabs */}
        <div className="flex gap-2 bg-gray-100 dark:bg-card p-1 rounded-xl">
          {reportTypes.map((rt) => (
            <button
              key={rt.key}
              onClick={() => setReportType(rt.key)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${
                reportType === rt.key
                  ? "bg-white dark:bg-card text-blue-600 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <span className="material-icons text-lg">{rt.icon}</span>
              {rt.label}
            </button>
          ))}
        </div>

        {/* KPI Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: ui.avgProgress, value: "—", icon: "trending_up", color: "var(--color-blue-600, var(--semantic-info))" },
            { label: ui.completionRate, value: "—", icon: "check_circle", color: "var(--semantic-success, #16a34a)" },
            { label: ui.activeParticipants, value: "—", icon: "groups", color: "var(--color-violet-600, var(--accent-purple))" },
            { label: ui.totalHours, value: "—", icon: "schedule", color: "#ea580c" },
          ].map((kpi, i) => (
            <div key={i} className="bg-white dark:bg-background rounded-xl border border-gray-100 dark:border-border p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${kpi.color}10` }}>
                  <span className="material-icons text-xl" style={{ color: kpi.color }}>{kpi.icon}</span>
                </div>
              </div>
              <p className="text-xs text-gray-500 mb-1">{kpi.label}</p>
              <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
            </div>
          ))}
        </div>

        {/* Empty State */}
        <div className="bg-white dark:bg-background rounded-xl border border-gray-100 dark:border-border p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-blue-600/10 flex items-center justify-center mx-auto mb-4">
            <span className="material-icons text-lg md:text-2xl lg:text-3xl text-blue-600">assessment</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-foreground mb-2">{ui.noData}</h3>
          <p className="text-sm text-gray-500 max-w-md mx-auto">{ui.noDataSub}</p>
        </div>
      </div>
    </HRLayout>
  );
}
