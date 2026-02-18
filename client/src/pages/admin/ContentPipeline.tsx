/**
 * Content Pipeline Dashboard — Sprint 5
 * 
 * Unified content workflow dashboard showing:
 * - Pipeline overview (courses, pages, media by status)
 * - Recent content activity feed
 * - Content calendar
 * - LRDG content templates
 * - Content quality metrics
 */
import { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  BookOpen, FileText, Image, Video, Music, File, Layers,
  Clock, CheckCircle2, AlertCircle, Archive, ArrowRight,
  Calendar, BarChart3, Sparkles, Layout, Users, GraduationCap,
  Mic, PenTool, BookMarked, Building2, ChevronLeft, ChevronRight,
  TrendingUp, TrendingDown, Minus, Eye
} from "lucide-react";
import { toast } from "sonner";

export default function ContentPipeline() {
  const [activeTab, setActiveTab] = useState("overview");
  const [calendarMonth, setCalendarMonth] = useState(new Date().getMonth() + 1);
  const [calendarYear, setCalendarYear] = useState(new Date().getFullYear());

  // tRPC queries
  const { data: pipeline, isLoading: pipelineLoading } = trpc.contentPipeline.getPipelineOverview.useQuery();
  const { data: activity, isLoading: activityLoading } = trpc.contentPipeline.getRecentActivity.useQuery({ limit: 20 });
  const { data: calendar, isLoading: calendarLoading } = trpc.contentPipeline.getContentCalendar.useQuery({
    month: calendarMonth,
    year: calendarYear,
  });
  const { data: templates } = trpc.contentPipeline.getContentTemplates.useQuery();
  const { data: quality } = trpc.contentPipeline.getQualityMetrics.useQuery();

  // Calendar navigation
  const navigateMonth = (direction: "prev" | "next") => {
    if (direction === "prev") {
      if (calendarMonth === 1) {
        setCalendarMonth(12);
        setCalendarYear(y => y - 1);
      } else {
        setCalendarMonth(m => m - 1);
      }
    } else {
      if (calendarMonth === 12) {
        setCalendarMonth(1);
        setCalendarYear(y => y + 1);
      } else {
        setCalendarMonth(m => m + 1);
      }
    }
  };

  const monthName = new Date(calendarYear, calendarMonth - 1).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  // Quality scores
  const qualityScores = useMemo(() => {
    if (!quality) return { thumbnail: 0, description: 0, seo: 0, altText: 0, overall: 0 };
    const thumbnail = quality.totalCourses > 0 ? Math.round((quality.coursesWithThumbnails / quality.totalCourses) * 100) : 0;
    const description = quality.totalCourses > 0 ? Math.round((quality.coursesWithDescriptions / quality.totalCourses) * 100) : 0;
    const seo = quality.totalPages > 0 ? Math.round((quality.pagesWithSEO / quality.totalPages) * 100) : 0;
    const altText = quality.totalMedia > 0 ? Math.round((quality.mediaWithAltText / quality.totalMedia) * 100) : 0;
    const overall = Math.round((thumbnail + description + seo + altText) / 4);
    return { thumbnail, description, seo, altText, overall };
  }, [quality]);

  // Template category icons
  const categoryIcons: Record<string, React.ReactNode> = {
    course: <BookOpen className="h-4 w-4" />,
    coaching: <Users className="h-4 w-4" />,
    page: <Layout className="h-4 w-4" />,
    enterprise: <Building2 className="h-4 w-4" />,
  };

  const categoryColors: Record<string, string> = {
    course: "bg-blue-500/10 text-blue-600 border-blue-200",
    coaching: "bg-purple-500/10 text-purple-600 border-purple-200",
    page: "bg-emerald-500/10 text-emerald-600 border-emerald-200",
    enterprise: "bg-amber-500/10 text-amber-600 border-amber-200",
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Content Pipeline</h1>
          <p className="text-muted-foreground mt-1">
            Unified content workflow — courses, pages, media, and templates
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-sm px-3 py-1">
            <Sparkles className="h-3.5 w-3.5 mr-1.5" />
            LRDG Standard
          </Badge>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2 md:grid-cols-5 lg:w-auto lg:inline-grid">
          <TabsTrigger value="overview" className="gap-1.5">
            <BarChart3 className="h-4 w-4" /> Overview
          </TabsTrigger>
          <TabsTrigger value="activity" className="gap-1.5">
            <Clock className="h-4 w-4" /> Activity
          </TabsTrigger>
          <TabsTrigger value="calendar" className="gap-1.5">
            <Calendar className="h-4 w-4" /> Calendar
          </TabsTrigger>
          <TabsTrigger value="templates" className="gap-1.5">
            <Layers className="h-4 w-4" /> Templates
          </TabsTrigger>
          <TabsTrigger value="quality" className="gap-1.5">
            <CheckCircle2 className="h-4 w-4" /> Quality
          </TabsTrigger>
        </TabsList>

        {/* ── OVERVIEW TAB ────────────────────────────────────────────────── */}
        <TabsContent value="overview" className="space-y-6 mt-6">
          {pipelineLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6"><div className="h-20 bg-muted rounded" /></CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <>
              {/* Course Pipeline */}
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                  Course Pipeline
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card className="border-l-4 border-l-yellow-500">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Draft</p>
                          <p className="text-2xl font-bold">{pipeline?.courses.draft ?? 0}</p>
                        </div>
                        <PenTool className="h-8 w-8 text-yellow-500/50" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border-l-4 border-l-blue-500">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">In Review</p>
                          <p className="text-2xl font-bold">{pipeline?.courses.review ?? 0}</p>
                        </div>
                        <Eye className="h-8 w-8 text-blue-500/50" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border-l-4 border-l-emerald-500">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Published</p>
                          <p className="text-2xl font-bold">{pipeline?.courses.published ?? 0}</p>
                        </div>
                        <CheckCircle2 className="h-8 w-8 text-emerald-500/50" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border-l-4 border-l-gray-400">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Archived</p>
                          <p className="text-2xl font-bold">{pipeline?.courses.archived ?? 0}</p>
                        </div>
                        <Archive className="h-8 w-8 text-gray-400/50" />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* CMS Pages Pipeline */}
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-purple-600" />
                  CMS Pages Pipeline
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <Card className="border-l-4 border-l-yellow-500">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Draft</p>
                          <p className="text-2xl font-bold">{pipeline?.pages.draft ?? 0}</p>
                        </div>
                        <PenTool className="h-8 w-8 text-yellow-500/50" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border-l-4 border-l-emerald-500">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Published</p>
                          <p className="text-2xl font-bold">{pipeline?.pages.published ?? 0}</p>
                        </div>
                        <CheckCircle2 className="h-8 w-8 text-emerald-500/50" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border-l-4 border-l-gray-400">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Archived</p>
                          <p className="text-2xl font-bold">{pipeline?.pages.archived ?? 0}</p>
                        </div>
                        <Archive className="h-8 w-8 text-gray-400/50" />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Media Library Stats */}
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Image className="h-5 w-5 text-emerald-600" />
                  Media Library
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {[
                    { label: "Total", value: pipeline?.media.total ?? 0, icon: <File className="h-6 w-6" />, color: "text-gray-500/50" },
                    { label: "Images", value: pipeline?.media.images ?? 0, icon: <Image className="h-6 w-6" />, color: "text-blue-500/50" },
                    { label: "Videos", value: pipeline?.media.videos ?? 0, icon: <Video className="h-6 w-6" />, color: "text-red-500/50" },
                    { label: "Audio", value: pipeline?.media.audio ?? 0, icon: <Music className="h-6 w-6" />, color: "text-purple-500/50" },
                    { label: "Documents", value: pipeline?.media.documents ?? 0, icon: <FileText className="h-6 w-6" />, color: "text-amber-500/50" },
                  ].map((item) => (
                    <Card key={item.label}>
                      <CardContent className="p-4 flex items-center justify-between">
                        <div>
                          <p className="text-xs text-muted-foreground">{item.label}</p>
                          <p className="text-xl font-bold">{item.value}</p>
                        </div>
                        <span className={item.color}>{item.icon}</span>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Templates count */}
              <Card>
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Layers className="h-6 w-6 text-indigo-600" />
                    <div>
                      <p className="font-medium">Section Templates</p>
                      <p className="text-sm text-muted-foreground">Reusable CMS section templates</p>
                    </div>
                  </div>
                  <span className="text-2xl font-bold">{pipeline?.templates.total ?? 0}</span>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        {/* ── ACTIVITY TAB ────────────────────────────────────────────────── */}
        <TabsContent value="activity" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Content Activity</CardTitle>
              <CardDescription>Latest changes across all content types</CardDescription>
            </CardHeader>
            <CardContent>
              {activityLoading ? (
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-16 bg-muted rounded animate-pulse" />
                  ))}
                </div>
              ) : !activity || activity.length === 0 ? (
                <div className="text-center py-6 md:py-8 lg:py-12 text-muted-foreground">
                  <Clock className="h-12 w-12 mx-auto mb-3 opacity-30" />
                  <p>No recent content activity</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {activity.map((item: any, idx: number) => (
                    <div
                      key={`${item.contentType}-${item.id}-${idx}`}
                      className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className={`p-2 rounded-lg ${
                        item.contentType === "course" ? "bg-blue-500/10" : "bg-purple-500/10"
                      }`}>
                        {item.contentType === "course" ? (
                          <BookOpen className="h-4 w-4 text-blue-600" />
                        ) : (
                          <FileText className="h-4 w-4 text-purple-600" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{item.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.authorName ?? "System"} — {item.action}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className={
                            item.status === "published" ? "border-emerald-300 text-emerald-700 bg-emerald-50" :
                            item.status === "review" ? "border-blue-300 text-blue-700 bg-blue-50" :
                            item.status === "draft" ? "border-yellow-300 text-yellow-700 bg-yellow-50" :
                            "border-gray-300 text-gray-700 dark:text-muted-foreground bg-gray-50 dark:bg-white/[0.06] dark:backdrop-blur-sm"
                          }
                        >
                          {item.status}
                        </Badge>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {item.activityDate ? new Date(item.activityDate).toLocaleDateString() : "—"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── CALENDAR TAB ────────────────────────────────────────────────── */}
        <TabsContent value="calendar" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Content Calendar</CardTitle>
                  <CardDescription>Scheduled publications and content deadlines</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" onClick={() => navigateMonth("prev")}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="font-medium min-w-[160px] text-center">{monthName}</span>
                  <Button variant="outline" size="icon" onClick={() => navigateMonth("next")}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {calendarLoading ? (
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-16 bg-muted rounded animate-pulse" />
                  ))}
                </div>
              ) : !calendar || calendar.length === 0 ? (
                <div className="text-center py-6 md:py-8 lg:py-12 text-muted-foreground">
                  <Calendar className="h-12 w-12 mx-auto mb-3 opacity-30" />
                  <p>No content events this month</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {calendar.map((event: any, idx: number) => (
                    <div
                      key={`${event.contentType}-${event.id}-${idx}`}
                      className="flex items-center gap-4 p-3 rounded-lg border hover:bg-muted/30 transition-colors"
                    >
                      <div className="text-center min-w-[50px]">
                        <p className="text-xs text-muted-foreground uppercase">
                          {event.eventDate ? new Date(event.eventDate).toLocaleDateString("en-US", { weekday: "short" }) : "—"}
                        </p>
                        <p className="text-lg font-bold">
                          {event.eventDate ? new Date(event.eventDate).getDate() : "—"}
                        </p>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{event.title}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <Badge variant="outline" className="text-xs">
                            {event.contentType}
                          </Badge>
                          <span className="text-xs text-muted-foreground capitalize">
                            {event.eventType?.replace(/_/g, " ")}
                          </span>
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className={
                          event.status === "published" ? "border-emerald-300 text-emerald-700 bg-emerald-50" :
                          event.status === "review" ? "border-blue-300 text-blue-700 bg-blue-50" :
                          "border-yellow-300 text-yellow-700 bg-yellow-50"
                        }
                      >
                        {event.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── TEMPLATES TAB ───────────────────────────────────────────────── */}
        <TabsContent value="templates" className="mt-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">LRDG Content Templates</h3>
                <p className="text-sm text-muted-foreground">
                  Predefined content structures aligned with LRDG pedagogical standards
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {templates?.map((template) => (
                <Card key={template.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between mb-2">
                      <Badge className={`${categoryColors[template.category] ?? "bg-gray-100 dark:bg-white/[0.08] dark:backdrop-blur-md dark:border-white/15 text-gray-600"} border`}>
                        <span className="mr-1">{categoryIcons[template.category]}</span>
                        {template.category}
                      </Badge>
                    </div>
                    <CardTitle className="text-base">{template.name}</CardTitle>
                    <CardDescription className="text-xs italic">{template.nameFr}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">{template.description}</p>
                    <div className="space-y-1.5">
                      {template.structure.sections.map((section, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs">
                          <span className="w-5 h-5 rounded-full bg-muted flex items-center justify-center text-muted-foreground font-medium">
                            {idx + 1}
                          </span>
                          <span className="text-muted-foreground">{section.label}</span>
                        </div>
                      ))}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full mt-4"
                      onClick={() => toast.info("Template application coming in Sprint 6")}
                    >
                      <ArrowRight className="h-3.5 w-3.5 mr-1.5" />
                      Use Template
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* ── QUALITY TAB ─────────────────────────────────────────────────── */}
        <TabsContent value="quality" className="mt-6">
          <div className="space-y-6">
            {/* Overall Score */}
            <Card className="border-2">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">Content Quality Score</h3>
                    <p className="text-sm text-muted-foreground">
                      Aggregate quality across all content types
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`text-xl md:text-3xl lg:text-4xl font-bold ${
                      qualityScores.overall >= 80 ? "text-emerald-600" :
                      qualityScores.overall >= 60 ? "text-yellow-600" :
                      "text-red-600"
                    }`}>
                      {qualityScores.overall}%
                    </p>
                    <p className="text-xs text-muted-foreground">Overall</p>
                  </div>
                </div>
                <Progress value={qualityScores.overall} className="h-3" />
              </CardContent>
            </Card>

            {/* Individual Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  label: "Course Thumbnails",
                  score: qualityScores.thumbnail,
                  detail: `${quality?.coursesWithThumbnails ?? 0} / ${quality?.totalCourses ?? 0} courses`,
                  icon: <Image className="h-5 w-5" />,
                },
                {
                  label: "Course Descriptions",
                  score: qualityScores.description,
                  detail: `${quality?.coursesWithDescriptions ?? 0} / ${quality?.totalCourses ?? 0} courses`,
                  icon: <BookOpen className="h-5 w-5" />,
                },
                {
                  label: "Page SEO",
                  score: qualityScores.seo,
                  detail: `${quality?.pagesWithSEO ?? 0} / ${quality?.totalPages ?? 0} pages`,
                  icon: <FileText className="h-5 w-5" />,
                },
                {
                  label: "Media Alt Text",
                  score: qualityScores.altText,
                  detail: `${quality?.mediaWithAltText ?? 0} / ${quality?.totalMedia ?? 0} media`,
                  icon: <Eye className="h-5 w-5" />,
                },
              ].map((metric) => (
                <Card key={metric.label}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">{metric.icon}</span>
                        <div>
                          <p className="font-medium text-sm">{metric.label}</p>
                          <p className="text-xs text-muted-foreground">{metric.detail}</p>
                        </div>
                      </div>
                      <span className={`text-lg font-bold ${
                        metric.score >= 80 ? "text-emerald-600" :
                        metric.score >= 60 ? "text-yellow-600" :
                        "text-red-600"
                      }`}>
                        {metric.score}%
                      </span>
                    </div>
                    <Progress value={metric.score} className="h-2" />
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Quality Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Quality Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {qualityScores.thumbnail < 100 && (
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-yellow-50 border border-yellow-200">
                      <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 shrink-0" />
                      <div>
                        <p className="font-medium text-sm text-yellow-800">Missing Course Thumbnails</p>
                        <p className="text-xs text-yellow-700 mt-0.5">
                          {(quality?.totalCourses ?? 0) - (quality?.coursesWithThumbnails ?? 0)} courses are missing thumbnails. 
                          Add thumbnails to improve visibility in the catalog.
                        </p>
                      </div>
                    </div>
                  )}
                  {qualityScores.description < 100 && (
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-yellow-50 border border-yellow-200">
                      <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 shrink-0" />
                      <div>
                        <p className="font-medium text-sm text-yellow-800">Missing Course Descriptions</p>
                        <p className="text-xs text-yellow-700 mt-0.5">
                          {(quality?.totalCourses ?? 0) - (quality?.coursesWithDescriptions ?? 0)} courses lack descriptions. 
                          Descriptions help learners understand course content.
                        </p>
                      </div>
                    </div>
                  )}
                  {qualityScores.altText < 100 && (
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-50 border border-blue-200">
                      <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
                      <div>
                        <p className="font-medium text-sm text-blue-800">Missing Media Alt Text</p>
                        <p className="text-xs text-blue-700 mt-0.5">
                          {(quality?.totalMedia ?? 0) - (quality?.mediaWithAltText ?? 0)} media files lack alt text. 
                          Alt text improves accessibility and SEO.
                        </p>
                      </div>
                    </div>
                  )}
                  {qualityScores.overall >= 100 && (
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-emerald-50 border border-emerald-200">
                      <CheckCircle2 className="h-5 w-5 text-emerald-600 mt-0.5 shrink-0" />
                      <div>
                        <p className="font-medium text-sm text-emerald-800">Excellent Content Quality</p>
                        <p className="text-xs text-emerald-700 mt-0.5">
                          All content meets LRDG quality standards. Keep up the great work!
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
