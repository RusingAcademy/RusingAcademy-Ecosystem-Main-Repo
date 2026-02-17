/**
 * GovernmentComplianceReport — Admin component for government-ready compliance reporting
 * Sprint C4: Provides exportable compliance data for GC/TBS audit
 */
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  FileText, Download, Shield, Users, BookOpen,
  GraduationCap, Target, TrendingUp, Award, Loader2,
} from "lucide-react";

export function GovernmentComplianceReport() {
  const { language } = useLanguage();
  const isFr = language === "fr";
  const [periodDays, setPeriodDays] = useState(90);

  const { data: report, isLoading } = trpc.govReporting.getComplianceReport.useQuery({ periodDays });
  const { data: sleMetrics } = trpc.govReporting.getSLEReadinessMetrics.useQuery();
  const { data: trends } = trpc.govReporting.getEnrollmentTrends.useQuery({ months: 12 });
  const { data: csvData } = trpc.govReporting.exportEnrollmentCSV.useQuery({ periodDays });

  const downloadCSV = () => {
    if (!csvData || !csvData.headers.length) return;
    const lines = [csvData.headers.join(",")];
    for (const row of csvData.rows) {
      lines.push(row.map((v: any) => `"${String(v).replace(/"/g, '""')}"`).join(","));
    }
    const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `rusingacademy-enrollments-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadJSON = () => {
    if (!report) return;
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `rusingacademy-compliance-report-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-cta" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Shield className="h-5 w-5 text-cta" />
            {isFr ? "Rapport de conformité gouvernemental" : "Government Compliance Report"}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {isFr
              ? "Données structurées pour audit GC/SCT — prêtes à l'exportation"
              : "Structured data for GC/TBS audit — export-ready"}
          </p>
        </div>
        <div className="flex gap-2">
          <select
            value={periodDays}
            onChange={(e) => setPeriodDays(Number(e.target.value))}
            className="text-sm border rounded-md px-3 py-1.5"
          >
            <option value={30}>{isFr ? "30 jours" : "30 days"}</option>
            <option value={90}>{isFr ? "90 jours" : "90 days"}</option>
            <option value={180}>{isFr ? "180 jours" : "180 days"}</option>
            <option value={365}>{isFr ? "1 an" : "1 year"}</option>
          </select>
          <Button variant="outline" size="sm" onClick={downloadJSON}>
            <Download className="h-4 w-4 mr-1" />
            JSON
          </Button>
          <Button variant="outline" size="sm" onClick={downloadCSV}>
            <Download className="h-4 w-4 mr-1" />
            CSV
          </Button>
        </div>
      </div>

      {report && (
        <>
          {/* Platform Overview */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: isFr ? "Utilisateurs" : "Total Users", value: report.overview.totalUsers, icon: Users, color: "var(--color-blue-600, var(--semantic-info))" },
              { label: isFr ? "Cours" : "Courses", value: report.overview.totalCourses, icon: BookOpen, color: "var(--semantic-success, var(--success))" },
              { label: isFr ? "Parcours" : "Learning Paths", value: report.overview.totalLearningPaths, icon: Target, color: "var(--color-violet-600, var(--accent-purple))" },
              { label: isFr ? "Certificats" : "Certificates", value: report.certificates.totalIssued, icon: Award, color: "var(--semantic-danger, var(--danger))" },
            ].map((s) => (
              <Card key={s.label}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <s.icon className="h-5 w-5" style={{ color: s.color }} />
                    <div>
                      <p className="text-xl font-bold">{s.value}</p>
                      <p className="text-xs text-muted-foreground">{s.label}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Enrollment Metrics */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <GraduationCap className="h-4 w-4" />
                {isFr ? "Métriques d'inscription" : "Enrollment Metrics"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {[
                  { label: isFr ? "Total" : "Total", value: report.enrollments.total },
                  { label: isFr ? "Actives" : "Active", value: report.enrollments.active },
                  { label: isFr ? "Terminées" : "Completed", value: report.enrollments.completed },
                  { label: isFr ? "Période récente" : "Recent Period", value: report.enrollments.recentPeriod },
                  { label: isFr ? "Taux de complétion" : "Completion Rate", value: `${report.enrollments.completionRate}%` },
                ].map((m) => (
                  <div key={m.label} className="text-center p-3 bg-muted/50 rounded-lg">
                    <p className="text-lg font-bold">{m.value}</p>
                    <p className="text-xs text-muted-foreground">{m.label}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* SLE Readiness */}
          {sleMetrics && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  {isFr ? "Préparation aux ELS" : "SLE Readiness"}
                </CardTitle>
                <CardDescription>
                  {isFr
                    ? "Analyse de l'écart entre les niveaux actuels et cibles des apprenants"
                    : "Gap analysis between current and target learner levels"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  {[
                    { label: isFr ? "Apprenants" : "Learners", value: sleMetrics.totalLearners },
                    { label: isFr ? "Sur la cible" : "On Target", value: sleMetrics.onTarget, color: "text-green-600" },
                    { label: isFr ? "À améliorer" : "Needs Improvement", value: sleMetrics.needsImprovement, color: "text-amber-600" },
                    { label: isFr ? "Examens à venir (90j)" : "Upcoming Exams (90d)", value: sleMetrics.upcomingExams, color: "text-blue-600" },
                  ].map((m) => (
                    <div key={m.label} className="text-center p-3 bg-muted/50 rounded-lg">
                      <p className={`text-lg font-bold ${m.color || ""}`}>{m.value}</p>
                      <p className="text-xs text-muted-foreground">{m.label}</p>
                    </div>
                  ))}
                </div>

                {/* Readiness Rate Bar */}
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">
                      {isFr ? "Taux de préparation" : "Readiness Rate"}
                    </span>
                    <Badge variant={sleMetrics.readinessRate >= 70 ? "default" : "secondary"}>
                      {sleMetrics.readinessRate}%
                    </Badge>
                  </div>
                  <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${sleMetrics.readinessRate}%`,
                        backgroundColor: sleMetrics.readinessRate >= 70 ? "var(--semantic-success, var(--success))" : sleMetrics.readinessRate >= 40 ? "var(--semantic-warning, var(--warning))" : "var(--semantic-danger, var(--danger))",
                      }}
                    />
                  </div>
                </div>

                {/* Study Metrics */}
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-lg font-bold">{sleMetrics.avgStudyHours}h</p>
                    <p className="text-xs text-muted-foreground">
                      {isFr ? "Heures d'étude moy./sem." : "Avg. Study Hours/Week"}
                    </p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-lg font-bold">{sleMetrics.avgStreak} {isFr ? "jours" : "days"}</p>
                    <p className="text-xs text-muted-foreground">
                      {isFr ? "Série d'étude moyenne" : "Avg. Study Streak"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* SLE Level Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <FileText className="h-4 w-4" />
                {isFr ? "Distribution des niveaux ELS (oral)" : "SLE Level Distribution (Oral)"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm font-medium mb-2">{isFr ? "Niveau actuel" : "Current Level"}</p>
                  <div className="space-y-2">
                    {Object.entries(report.sleReadiness.currentOralLevelDistribution).map(([level, count]) => (
                      <div key={level} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant={level === "C" ? "default" : level === "B" ? "secondary" : "outline"}>
                            {level === "unknown" ? (isFr ? "N/D" : "N/A") : level}
                          </Badge>
                        </div>
                        <span className="text-sm font-medium">{count as number}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium mb-2">{isFr ? "Niveau cible" : "Target Level"}</p>
                  <div className="space-y-2">
                    {Object.entries(report.sleReadiness.targetOralLevelDistribution).map(([level, count]) => (
                      <div key={level} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant={level === "C" ? "default" : level === "B" ? "secondary" : "outline"}>
                            {level === "unknown" ? (isFr ? "N/D" : "N/A") : level}
                          </Badge>
                        </div>
                        <span className="text-sm font-medium">{count as number}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Assessment Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                {isFr ? "Performance des évaluations" : "Assessment Performance"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: isFr ? "Tentatives" : "Attempts", value: report.assessments.totalQuizAttempts },
                  { label: isFr ? "Réussites" : "Passed", value: report.assessments.passedQuizzes },
                  { label: isFr ? "Taux de réussite" : "Pass Rate", value: `${report.assessments.passRate}%` },
                  { label: isFr ? "Score moyen" : "Avg. Score", value: `${report.assessments.averageScore}%` },
                ].map((m) => (
                  <div key={m.label} className="text-center p-3 bg-muted/50 rounded-lg">
                    <p className="text-lg font-bold">{m.value}</p>
                    <p className="text-xs text-muted-foreground">{m.label}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Enrollment Trends */}
          {trends && trends.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  {isFr ? "Tendances d'inscription (12 mois)" : "Enrollment Trends (12 months)"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {trends.map((t) => {
                    const maxEnrollments = Math.max(...trends.map(tr => tr.enrollments), 1);
                    return (
                      <div key={t.month} className="flex items-center gap-3">
                        <span className="text-sm w-20 text-muted-foreground">{t.month}</span>
                        <div className="flex-1 h-6 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full bg-cta transition-all"
                            style={{ width: `${Math.max(3, (t.enrollments / maxEnrollments) * 100)}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium w-12 text-right">{t.enrollments}</span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Department Distribution */}
          {report.sleReadiness.departmentDistribution.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  {isFr ? "Distribution par ministère" : "Department Distribution"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {report.sleReadiness.departmentDistribution.map((d) => (
                    <div key={d.department} className="flex items-center justify-between p-2 bg-muted/30 rounded">
                      <span className="text-sm">{d.department}</span>
                      <Badge variant="secondary">{d.learners}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Platform Compliance Badge */}
          <Card className="border-green-200 bg-green-50/50 dark:bg-green-900/10">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Shield className="h-6 w-6 text-green-600" />
                <div>
                  <p className="font-medium text-green-800 dark:text-green-400">
                    {isFr ? "Conformité de la plateforme" : "Platform Compliance"}
                  </p>
                  <p className="text-sm text-green-600 dark:text-green-500">
                    {isFr
                      ? "Bilingue (EN/FR) • Accessibilité WCAG 2.1 AA (cible) • Données hébergées au Canada"
                      : "Bilingual (EN/FR) • WCAG 2.1 AA Accessibility (target) • Canadian-hosted data"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
