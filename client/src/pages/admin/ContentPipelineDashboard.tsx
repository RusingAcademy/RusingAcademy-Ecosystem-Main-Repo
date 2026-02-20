/**
 * Content Pipeline Dashboard — Sprint Y1-W2-S07
 * 
 * Unified admin page for content management:
 * - Content Health Overview
 * - Bulk Import Tool
 * - Course Quality Scores
 * - Content Pipeline Status
 */
import { useState, lazy, Suspense } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import ContentHealthDashboard from "@/components/ContentHealthDashboard";
import BulkImporter from "@/components/BulkImporter";
import ContentQualityBadge from "@/components/ContentQualityBadge";
import ContentPreview from "@/components/ContentPreview";
import {
  BarChart3, Upload, Heart, Eye, BookOpen, Layers, FileText,
  CheckCircle2, Clock, AlertCircle, Archive, TrendingUp,
  Sparkles, GraduationCap, Globe
} from "lucide-react";
import { toast } from "sonner";

export default function ContentPipelineDashboard() {
  const [activeTab, setActiveTab] = useState("health");
  const [previewCourseId, setPreviewCourseId] = useState<number | null>(null);

  // Fetch course stats
  const { data: stats, isLoading: statsLoading } = trpc.adminCourses.getCourseStats.useQuery();
  const { data: courseList, isLoading: coursesLoading } = trpc.adminCourses.getAllCourses.useQuery({
    status: "all",
    page: 1,
    limit: 100,
  });

  const courses = courseList?.courses || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Content Pipeline</h1>
          <p className="text-muted-foreground mt-1">
            Manage, validate, and publish course content across the platform
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setActiveTab("import")}
          >
            <Upload className="h-4 w-4 mr-2" />
            Bulk Import
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      {statsLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-24" />)}
        </div>
      ) : stats ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-4 pb-3">
              <div className="flex items-center justify-between">
                <BookOpen className="h-5 w-5 text-blue-500" />
                <Badge variant="outline" className="text-xs">{stats.totalCourses}</Badge>
              </div>
              <div className="mt-2">
                <div className="text-2xl font-bold">{stats.totalCourses}</div>
                <p className="text-xs text-muted-foreground">Total Courses</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-3">
              <div className="flex items-center justify-between">
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                <Badge variant="outline" className="text-xs bg-emerald-50 text-emerald-700">
                  {stats.publishedCourses}
                </Badge>
              </div>
              <div className="mt-2">
                <div className="text-2xl font-bold">{stats.publishedCourses}</div>
                <p className="text-xs text-muted-foreground">Published</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-3">
              <div className="flex items-center justify-between">
                <Clock className="h-5 w-5 text-amber-500" />
                <Badge variant="outline" className="text-xs bg-amber-50 text-amber-700">
                  {stats.draftCourses + stats.reviewCourses}
                </Badge>
              </div>
              <div className="mt-2">
                <div className="text-2xl font-bold">{stats.draftCourses + stats.reviewCourses}</div>
                <p className="text-xs text-muted-foreground">Draft / In Review</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-3">
              <div className="flex items-center justify-between">
                <TrendingUp className="h-5 w-5 text-purple-500" />
                <Badge variant="outline" className="text-xs">
                  ${(stats.totalRevenue || 0).toLocaleString()}
                </Badge>
              </div>
              <div className="mt-2">
                <div className="text-2xl font-bold">{stats.totalEnrollments}</div>
                <p className="text-xs text-muted-foreground">Total Enrollments</p>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : null}

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          <TabsTrigger value="health" className="flex items-center gap-2">
            <Heart className="h-4 w-4" />
            Content Health
          </TabsTrigger>
          <TabsTrigger value="courses" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Course Quality
          </TabsTrigger>
          <TabsTrigger value="import" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Bulk Import
          </TabsTrigger>
        </TabsList>

        {/* Health Tab */}
        <TabsContent value="health" className="mt-6">
          <ContentHealthDashboard />
        </TabsContent>

        {/* Course Quality Tab */}
        <TabsContent value="courses" className="mt-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Per-Course Quality Scores</h2>
              <p className="text-sm text-muted-foreground">
                {courses.length} course(s)
              </p>
            </div>

            {coursesLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map(i => <Skeleton key={i} className="h-20" />)}
              </div>
            ) : courses.length === 0 ? (
              <Card>
                <CardContent className="py-6 md:py-8 lg:py-12 text-center">
                  <BookOpen className="h-10 w-10 mx-auto text-muted-foreground/30 mb-3" />
                  <p className="text-muted-foreground">No courses yet</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Create courses in the Course Builder or use Bulk Import
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {courses.map((course: any) => (
                  <CourseQualityRow
                    key={course.id}
                    course={course}
                    onPreview={() => setPreviewCourseId(course.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        {/* Import Tab */}
        <TabsContent value="import" className="mt-6">
          <BulkImporter />
        </TabsContent>
      </Tabs>

      {/* Preview Dialog */}
      {previewCourseId && (
        <ContentPreview
          courseId={previewCourseId}
          open={!!previewCourseId}
          onClose={() => setPreviewCourseId(null)}
        />
      )}
    </div>
  );
}

// ── Per-Course Quality Row ──────────────────────────────────────────────────

function CourseQualityRow({ course, onPreview }: { course: any; onPreview: () => void }) {
  const { data: quality, isLoading } = trpc.adminCourses.getContentQuality.useQuery(
    { courseId: course.id },
    { staleTime: 60000 }
  );

  const statusColors: Record<string, string> = {
    draft: "bg-gray-100 text-gray-700",
    review: "bg-amber-100 text-amber-700",
    published: "bg-emerald-100 text-emerald-700",
    archived: "bg-red-100 text-red-700",
  };

  return (
    <Card className="hover:shadow-sm transition-shadow">
      <CardContent className="py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            {/* Thumbnail */}
            <div className="h-12 w-16 rounded-lg overflow-hidden bg-muted shrink-0">
              {course.thumbnailUrl ? (
                <img
                  src={course.thumbnailUrl}
                  alt={course.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-muted-foreground/30" />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="font-medium text-sm truncate">{course.title}</p>
                <Badge variant="outline" className={`text-[10px] shrink-0 ${statusColors[course.status] || ""}`}>
                  {course.status}
                </Badge>
                {course.titleFr && (
                  <Badge variant="outline" className="text-[10px] shrink-0">FR</Badge>
                )}
              </div>
              <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                <span>{course.totalModules || 0} modules</span>
                <span>{course.totalLessons || 0} lessons</span>
                <span>{course.category?.replace(/_/g, " ")}</span>
              </div>
            </div>
          </div>

          {/* Quality + Actions */}
          <div className="flex items-center gap-3 shrink-0">
            {isLoading ? (
              <Skeleton className="h-6 w-12" />
            ) : quality ? (
              <ContentQualityBadge
                score={quality.score}
                grade={quality.grade}
                checks={quality.checks}
                passedChecks={quality.passedChecks}
                totalChecks={quality.totalChecks}
                compact
              />
            ) : null}
            <Button variant="ghost" size="sm" onClick={onPreview}>
              <Eye className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
