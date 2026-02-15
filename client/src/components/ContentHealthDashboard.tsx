/**
 * ContentHealthDashboard — Aggregated content quality metrics for admin
 * 
 * Shows:
 * - Overall content health score
 * - Missing thumbnails, translations, SEO, etc.
 * - Actionable recommendations
 * - Per-course quality scores
 */
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Image, Languages, Search, FileText, Layers, AlertTriangle,
  CheckCircle2, TrendingUp, BookOpen
} from "lucide-react";
import { cn } from "@/lib/utils";

interface HealthMetric {
  label: string;
  value: number;
  total: number;
  icon: React.ReactNode;
  severity: "good" | "warning" | "critical";
  recommendation: string;
}

export default function ContentHealthDashboard() {
  const { data: health, isLoading } = trpc.adminCourses.getContentHealth.useQuery();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-32 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (!health) return null;

  const metrics: HealthMetric[] = [
    {
      label: "Missing Thumbnails",
      value: health.coursesWithoutThumbnails,
      total: health.totalCourses,
      icon: <Image className="h-4 w-4" />,
      severity: health.coursesWithoutThumbnails > 0 ? "warning" : "good",
      recommendation: health.coursesWithoutThumbnails > 0
        ? `${health.coursesWithoutThumbnails} course(s) need thumbnail images for better visual appeal`
        : "All courses have thumbnails",
    },
    {
      label: "Missing French Translations",
      value: health.coursesWithoutFrench,
      total: health.totalCourses,
      icon: <Languages className="h-4 w-4" />,
      severity: health.coursesWithoutFrench > health.totalCourses * 0.5 ? "critical" : health.coursesWithoutFrench > 0 ? "warning" : "good",
      recommendation: health.coursesWithoutFrench > 0
        ? `${health.coursesWithoutFrench} course(s) need French title or description for bilingual compliance`
        : "All courses have French translations",
    },
    {
      label: "Missing SEO Metadata",
      value: health.coursesWithoutSEO,
      total: health.totalCourses,
      icon: <Search className="h-4 w-4" />,
      severity: health.coursesWithoutSEO > 0 ? "warning" : "good",
      recommendation: health.coursesWithoutSEO > 0
        ? `${health.coursesWithoutSEO} course(s) need meta title and description for search visibility`
        : "All courses have SEO metadata",
    },
    {
      label: "Empty Modules",
      value: health.emptyModules,
      total: health.emptyModules,
      icon: <Layers className="h-4 w-4" />,
      severity: health.emptyModules > 0 ? "critical" : "good",
      recommendation: health.emptyModules > 0
        ? `${health.emptyModules} module(s) have no lessons — add content or remove them`
        : "All modules have lessons",
    },
    {
      label: "Lessons Without Content",
      value: health.lessonsWithoutContent,
      total: health.lessonsWithoutContent,
      icon: <FileText className="h-4 w-4" />,
      severity: health.lessonsWithoutContent > 0 ? "critical" : "good",
      recommendation: health.lessonsWithoutContent > 0
        ? `${health.lessonsWithoutContent} lesson(s) have no video, text, audio, or download attached`
        : "All lessons have content",
    },
  ];

  const severityColors = {
    good: "text-emerald-600 bg-emerald-50 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800",
    warning: "text-amber-600 bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800",
    critical: "text-red-600 bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800",
  };

  const overallGrade = health.averageQualityScore >= 80 ? "A" :
    health.averageQualityScore >= 60 ? "B" :
    health.averageQualityScore >= 40 ? "C" :
    health.averageQualityScore >= 20 ? "D" : "F";

  const gradeColors: Record<string, string> = {
    A: "text-emerald-600",
    B: "text-blue-600",
    C: "text-amber-600",
    D: "text-orange-600",
    F: "text-red-600",
  };

  return (
    <div className="space-y-6">
      {/* Overall Score */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Content Health Score</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Based on {health.totalCourses} course(s) across the platform
              </p>
            </div>
            <div className="text-center">
              <div className={cn("text-4xl font-bold", gradeColors[overallGrade])}>
                {overallGrade}
              </div>
              <div className="text-sm text-muted-foreground">
                {health.averageQualityScore}%
              </div>
            </div>
          </div>
          <Progress value={health.averageQualityScore} className="mt-4 h-2" />
        </CardContent>
      </Card>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {metrics.map((metric, i) => (
          <Card key={i} className={cn("border", severityColors[metric.severity])}>
            <CardContent className="pt-4 pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  {metric.icon}
                  <span className="text-sm font-medium">{metric.label}</span>
                </div>
                {metric.severity === "good" ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                ) : metric.severity === "critical" ? (
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                )}
              </div>
              <div className="mt-2 text-2xl font-bold">
                {metric.value}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {metric.recommendation}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Platform Content Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="p-3 rounded-lg bg-muted/50">
              <BookOpen className="h-5 w-5 mx-auto text-blue-500 mb-1" />
              <div className="text-2xl font-bold">{health.totalCourses}</div>
              <div className="text-xs text-muted-foreground">Total Courses</div>
            </div>
            <div className="p-3 rounded-lg bg-muted/50">
              <Image className="h-5 w-5 mx-auto text-purple-500 mb-1" />
              <div className="text-2xl font-bold">
                {health.totalCourses - health.coursesWithoutThumbnails}
              </div>
              <div className="text-xs text-muted-foreground">With Thumbnails</div>
            </div>
            <div className="p-3 rounded-lg bg-muted/50">
              <Languages className="h-5 w-5 mx-auto text-emerald-500 mb-1" />
              <div className="text-2xl font-bold">
                {health.totalCourses - health.coursesWithoutFrench}
              </div>
              <div className="text-xs text-muted-foreground">Bilingual Ready</div>
            </div>
            <div className="p-3 rounded-lg bg-muted/50">
              <Search className="h-5 w-5 mx-auto text-amber-500 mb-1" />
              <div className="text-2xl font-bold">
                {health.totalCourses - health.coursesWithoutSEO}
              </div>
              <div className="text-xs text-muted-foreground">SEO Optimized</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
