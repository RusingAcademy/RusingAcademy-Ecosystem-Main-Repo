/**
 * LearnPortal — Premium Course Hub inside the Immersive Learn Shell
 *
 * Kajabi Premier-caliber design with:
 * - Glassmorphism hero with course badge + progress ring
 * - Module accordion with per-lesson 7-slot indicators
 * - Bilingual EN/FR support
 * - Auto-resume to last accessed lesson
 * - Micro-animations via framer-motion
 *
 * Route: /learn/:slug (wrapped by LearnLayout)
 */
import { useState, useEffect, useMemo } from "react";
import LearnLayout from "@/components/LearnLayout";
import { useParams, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Circle,
  Clock,
  FileText,
  GraduationCap,
  HelpCircle,
  Lock,
  Mic,
  PlayCircle,
  Trophy,
  Video,
  Sparkles,
  Lightbulb,
  PenLine,
  Headphones,
  MessageSquare,
  ChevronRight,
  Award,
  Layers,
  Target,
  Zap,
} from "lucide-react";

// ─── 7-Slot Template Definition ─────────────────────────────────
const SLOT_TEMPLATE = [
  { index: 1, type: "introduction", label: "Introduction", labelFr: "Accroche", icon: Lightbulb, color: "text-amber-500", bg: "bg-amber-500/10", ring: "ring-amber-500/30" },
  { index: 2, type: "video_scenario", label: "Video", labelFr: "Vidéo", icon: Video, color: "text-blue-500", bg: "bg-blue-500/10", ring: "ring-blue-500/30" },
  { index: 3, type: "grammar_strategy", label: "Grammar", labelFr: "Grammaire", icon: BookOpen, color: "text-emerald-500", bg: "bg-emerald-500/10", ring: "ring-emerald-500/30" },
  { index: 4, type: "written_practice", label: "Written", labelFr: "Écrit", icon: PenLine, color: "text-purple-500", bg: "bg-purple-500/10", ring: "ring-purple-500/30" },
  { index: 5, type: "oral_practice", label: "Oral", labelFr: "Oral", icon: Mic, color: "text-rose-500", bg: "bg-rose-500/10", ring: "ring-rose-500/30" },
  { index: 6, type: "quiz", label: "Quiz", labelFr: "Quiz", icon: HelpCircle, color: "text-orange-500", bg: "bg-orange-500/10", ring: "ring-orange-500/30" },
  { index: 7, type: "coaching_tip", label: "Coach Tip", labelFr: "Conseil", icon: Sparkles, color: "text-teal-500", bg: "bg-teal-500/10", ring: "ring-teal-500/30" },
];

// Content type icons
const contentTypeIcons: Record<string, React.ReactNode> = {
  video: <PlayCircle className="h-4 w-4" />,
  text: <FileText className="h-4 w-4" />,
  quiz: <HelpCircle className="h-4 w-4" />,
  audio: <Headphones className="h-4 w-4" />,
  assignment: <BookOpen className="h-4 w-4" />,
};

// ─── Circular Progress Ring ─────────────────────────────────────
function ProgressRing({ percent, size = 80, strokeWidth = 6 }: { percent: number; size?: number; strokeWidth?: number }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-white/20"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="text-white transition-all duration-700 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-lg font-bold text-white">{percent}%</span>
      </div>
    </div>
  );
}

// ─── Slot Indicator Row (compact, per-lesson) ───────────────────
function SlotIndicators({ lessonActivities, language }: { lessonActivities: any[]; language: string }) {
  const isEn = language === "en";

  return (
    <div className="flex items-center gap-1 mt-2">
      {SLOT_TEMPLATE.map((slot) => {
        const activity = lessonActivities.find(
          (a: any) => a.slotIndex === slot.index
        );
        const filled = !!activity;
        const Icon = slot.icon;

        return (
          <div
            key={slot.index}
            className={`w-6 h-6 rounded flex items-center justify-center transition-all ${
              filled
                ? `${slot.bg} ${slot.color}`
                : "bg-muted/50 text-muted-foreground/40"
            }`}
            title={isEn ? slot.label : slot.labelFr}
          >
            <Icon className="h-3 w-3" />
          </div>
        );
      })}
      {/* Extra activities indicator */}
      {lessonActivities.filter((a: any) => a.slotIndex > 7).length > 0 && (
        <div className="w-6 h-6 rounded bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs font-medium text-muted-foreground">
          +{lessonActivities.filter((a: any) => a.slotIndex > 7).length}
        </div>
      )}
    </div>
  );
}

// ─── Main Component ─────────────────────────────────────────────
export default function LearnPortal() {
  const { slug } = useParams<{ slug: string }>();
  const [, setLocation] = useLocation();
  const { user, isAuthenticated } = useAuth();
  const { language } = useLanguage();
  const isEn = language === "en";

  // Fetch course data
  const { data: course, isLoading: courseLoading } = trpc.courses.getBySlug.useQuery(
    { slug: slug || "" },
    { enabled: !!slug }
  );

  // Check enrollment
  const utils = trpc.useUtils();
  const { data: enrollment, isLoading: enrollmentLoading } = trpc.courses.getEnrollment.useQuery(
    { courseId: course?.id || 0 },
    { enabled: !!course?.id && isAuthenticated }
  );

  // Auto-enroll for free courses
  const enrollFreeMutation = trpc.courses.enrollFree.useMutation({
    onSuccess: () => {
      utils.courses.getEnrollment.invalidate({ courseId: course?.id || 0 });
    },
  });

  const [autoEnrollAttempted, setAutoEnrollAttempted] = useState(false);
  useEffect(() => {
    if (autoEnrollAttempted || enrollmentLoading || !course?.id || !isAuthenticated) return;
    if (enrollment) return;
    if ((course.price || 0) === 0) {
      setAutoEnrollAttempted(true);
      enrollFreeMutation.mutate({ courseId: course.id });
    }
  }, [course, enrollment, enrollmentLoading, isAuthenticated, autoEnrollAttempted]);

  // Fetch progress (only when enrolled)
  const { data: progress } = trpc.lessons.getCourseProgress.useQuery(
    { courseId: course?.id || 0 },
    { enabled: !!course?.id && isAuthenticated && !!enrollment }
  );

  // Fetch published activities for the course (public endpoint for slot indicators)
  const { data: courseActivities } = trpc.activities.getActivitiesByCourse.useQuery(
    { courseId: course?.id || 0 },
    { enabled: !!course?.id }
  );

  // Build activities-by-lesson map
  const activitiesByLesson = useMemo(() => {
    const map: Record<number, any[]> = {};
    if (courseActivities && Array.isArray(courseActivities)) {
      courseActivities.forEach((a: any) => {
        if (!map[a.lessonId]) map[a.lessonId] = [];
        map[a.lessonId].push(a);
      });
    }
    return map;
  }, [courseActivities]);

  const progressPercent = progress?.progressPercent || 0;
  const completedLessons = progress?.completedLessons || 0;
  const totalLessons = progress?.totalLessons || 0;

  // Auto-resume: redirect to last accessed or next incomplete lesson
  const [hasAutoResumed, setHasAutoResumed] = useState(false);
  useEffect(() => {
    if (hasAutoResumed || !progress || !slug || !isAuthenticated) return;
    if (progress.completedLessons === 0 && !progress.lastAccessedLesson) return;

    const targetLesson = progress.nextLesson || progress.lastAccessedLesson;
    if (targetLesson) {
      setHasAutoResumed(true);
      setLocation(`/learn/${slug}/lessons/${targetLesson.id}`);
    }
  }, [progress, slug, isAuthenticated, hasAutoResumed, setLocation]);

  // Completed lesson IDs for per-lesson status
  const completedLessonIdSet = new Set(progress?.completedLessonIds || []);
  const inProgressLessonIdSet = new Set(progress?.inProgressLessonIds || []);

  // Total course duration
  const totalDurationMinutes = useMemo(() => {
    if (!course?.modules) return 0;
    return course.modules.reduce(
      (acc: number, m: any) =>
        acc +
        (m.lessons?.reduce(
          (a: number, l: any) => a + (l.videoDurationSeconds || 0),
          0
        ) || 0),
      0
    ) / 60;
  }, [course]);

  return (
    <LearnLayout>
      <div className="min-h-full">
        {course && (
          <>
            {/* ═══════════════════════════════════════════════════════
                HERO SECTION — Glassmorphism + Progress Ring
                ═══════════════════════════════════════════════════════ */}
            <section className="relative overflow-hidden bg-gradient-to-br from-[#0F3D3E] via-[#145A5B] to-[#0F3D3E]">
              {/* Decorative orbs */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute -top-20 -right-20 w-80 h-80 bg-[#C65A1E]/20 rounded-full blur-3xl" />
                <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-[#17E2C6]/10 rounded-full blur-3xl" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/5 rounded-full blur-2xl" />
              </div>

              <div className="relative z-10 max-w-4xl mx-auto px-6 py-10 md:py-14">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="flex flex-col md:flex-row items-start md:items-center gap-6"
                >
                  {/* Course Badge / Icon */}
                  <div className="flex-shrink-0">
                    {course.thumbnailUrl ? (
                      <div className="w-20 h-20 rounded-2xl overflow-hidden ring-2 ring-white/20 shadow-xl">
                        <img
                          src={course.thumbnailUrl}
                          alt={course.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-sm ring-2 ring-white/20 flex items-center justify-center shadow-xl">
                        <GraduationCap className="h-10 w-10 text-white/80" />
                      </div>
                    )}
                  </div>

                  {/* Course Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className="bg-white/15 text-white border-white/20 backdrop-blur-sm text-xs">
                        <GraduationCap className="h-3 w-3 mr-1" />
                        {course.level || "All Levels"}
                      </Badge>
                      {course.modules && (
                        <Badge className="bg-white/15 text-white border-white/20 backdrop-blur-sm text-xs">
                          <Layers className="h-3 w-3 mr-1" />
                          {course.modules.length} {isEn ? "Modules" : "Modules"}
                        </Badge>
                      )}
                    </div>
                    <h1 className="text-2xl md:text-3xl font-bold text-white mb-1 leading-tight">
                      {isEn ? course.title : (course.titleFr || course.title)}
                    </h1>
                    <p className="text-white/70 text-sm md:text-base line-clamp-2">
                      {isEn ? course.description : (course.descriptionFr || course.description)}
                    </p>
                  </div>

                  {/* Progress Ring */}
                  {isAuthenticated && (
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.3, duration: 0.4 }}
                      className="flex-shrink-0"
                    >
                      <ProgressRing percent={progressPercent} size={80} strokeWidth={6} />
                    </motion.div>
                  )}
                </motion.div>

                {/* Stats Bar */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                  className="mt-6 flex flex-wrap items-center gap-4 text-white/70 text-sm"
                >
                  <span className="flex items-center gap-1.5">
                    <BookOpen className="h-4 w-4" />
                    {totalLessons} {isEn ? "Lessons" : "Leçons"}
                  </span>
                  {totalDurationMinutes > 0 && (
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-4 w-4" />
                      {Math.round(totalDurationMinutes / 60) > 0
                        ? `${Math.round(totalDurationMinutes / 60)}h ${Math.round(totalDurationMinutes % 60)}m`
                        : `${Math.round(totalDurationMinutes)}m`}
                    </span>
                  )}
                  {isAuthenticated && (
                    <>
                      <Separator orientation="vertical" className="h-4 bg-white/20" />
                      <span className="flex items-center gap-1.5">
                        <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                        {completedLessons}/{totalLessons} {isEn ? "completed" : "terminées"}
                      </span>
                    </>
                  )}
                  {progressPercent === 100 && (
                    <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30">
                      <Trophy className="h-3 w-3 mr-1" />
                      {isEn ? "Completed!" : "Terminé !"}
                    </Badge>
                  )}
                </motion.div>

                {/* Resume Button */}
                {isAuthenticated && progress?.nextLesson && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.4 }}
                    className="mt-6"
                  >
                    <Button
                      size="lg"
                      className="bg-[#C65A1E] hover:bg-[#E06B2D] text-white shadow-lg shadow-[#C65A1E]/25 transition-all hover:shadow-xl hover:shadow-[#C65A1E]/30"
                      onClick={() =>
                        setLocation(
                          `/learn/${slug}/lessons/${progress.nextLesson.id}`
                        )
                      }
                    >
                      {isEn ? "Continue Learning" : "Continuer l'apprentissage"}
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                    <span className="ml-3 text-white/50 text-sm">
                      {progress.nextLesson.title}
                    </span>
                  </motion.div>
                )}
              </div>
            </section>

            {/* ═══════════════════════════════════════════════════════
                7-SLOT LEGEND
                ═══════════════════════════════════════════════════════ */}
            <div className="max-w-4xl mx-auto px-6 pt-6">
              <div className="flex items-center gap-2 mb-1">
                <Zap className="h-4 w-4 text-[#C65A1E]" />
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {isEn ? "7-Slot Learning Structure" : "Structure d'apprentissage en 7 étapes"}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {SLOT_TEMPLATE.map((slot) => {
                  const Icon = slot.icon;
                  return (
                    <div
                      key={slot.index}
                      className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs ${slot.bg} ${slot.color}`}
                    >
                      <Icon className="h-3 w-3" />
                      <span className="font-medium">
                        {slot.index}. {isEn ? slot.label : slot.labelFr}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ═══════════════════════════════════════════════════════
                COURSE CONTENT — Module Accordion
                ═══════════════════════════════════════════════════════ */}
            <div className="max-w-4xl mx-auto px-6 py-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Target className="h-5 w-5 text-[#0F3D3E]" />
                {isEn ? "Course Content" : "Contenu du cours"}
              </h2>

              <Accordion
                type="multiple"
                defaultValue={
                  course.modules?.map((_: any, i: number) => `module-${i}`) || []
                }
              >
                {course.modules?.map((module: any, moduleIndex: number) => {
                  const moduleLessons = module.lessons || [];
                  const progressModule = progress?.modules?.find(
                    (pm: any) => pm.id === module.id
                  );
                  const moduleCompleted = progressModule?.completedLessons || 0;
                  const moduleTotal = moduleLessons.length;
                  const modulePercent =
                    moduleTotal > 0
                      ? Math.round((moduleCompleted / moduleTotal) * 100)
                      : 0;

                  return (
                    <AccordionItem
                      key={module.id}
                      value={`module-${moduleIndex}`}
                      className="border rounded-xl mb-3 overflow-hidden bg-card shadow-sm"
                    >
                      <AccordionTrigger className="hover:no-underline px-5 py-4">
                        <div className="flex items-center gap-4 text-left w-full">
                          {/* Module badge with thumbnail */}
                          <div className="flex-shrink-0">
                            {module.thumbnailUrl ? (
                              <div className="w-12 h-12 rounded-xl overflow-hidden ring-1 ring-border">
                                <img
                                  src={module.thumbnailUrl}
                                  alt={module.title}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ) : (
                              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0F3D3E] to-[#145A5B] flex items-center justify-center text-white font-bold text-lg shadow-sm">
                                {moduleIndex + 1}
                              </div>
                            )}
                          </div>

                          {/* Module info */}
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-base truncate">
                              {isEn ? module.title : (module.titleFr || module.title)}
                            </p>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                              <span>
                                {moduleTotal} {isEn ? "lessons" : "leçons"}
                              </span>
                              {isAuthenticated && (
                                <span className="flex items-center gap-1">
                                  <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                                  {moduleCompleted}/{moduleTotal}
                                </span>
                              )}
                            </div>
                            {/* Module progress bar */}
                            {isAuthenticated && moduleTotal > 0 && (
                              <Progress
                                value={modulePercent}
                                className="h-1.5 mt-2"
                              />
                            )}
                          </div>

                          {/* Module completion badge */}
                          {isAuthenticated &&
                            moduleCompleted === moduleTotal &&
                            moduleTotal > 0 && (
                              <div className="flex-shrink-0">
                                <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center">
                                  <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                                </div>
                              </div>
                            )}
                        </div>
                      </AccordionTrigger>

                      <AccordionContent>
                        <div className="px-5 pb-4 space-y-1">
                          {moduleLessons.map(
                            (lesson: any, lessonIndex: number) => {
                              const isCompleted = completedLessonIdSet.has(
                                lesson.id
                              );
                              const isInProgress = inProgressLessonIdSet.has(
                                lesson.id
                              );
                              const isLocked = false; // TODO: drip content check
                              const lessonActivities =
                                activitiesByLesson[lesson.id] || [];

                              return (
                                <motion.button
                                  key={lesson.id}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{
                                    delay: lessonIndex * 0.03,
                                    duration: 0.2,
                                  }}
                                  onClick={() =>
                                    !isLocked &&
                                    setLocation(
                                      `/learn/${slug}/lessons/${lesson.id}`
                                    )
                                  }
                                  disabled={isLocked}
                                  className={`w-full flex items-start gap-3 px-4 py-3 rounded-xl text-left transition-all group ${
                                    isLocked
                                      ? "text-muted-foreground/50 cursor-not-allowed"
                                      : "hover:bg-muted/60 hover:shadow-sm"
                                  }`}
                                >
                                  {/* Status indicator */}
                                  <span className="flex-shrink-0 mt-0.5">
                                    {isCompleted ? (
                                      <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                                    ) : isInProgress ? (
                                      <div className="w-5 h-5 rounded-full border-2 border-[#C65A1E] flex items-center justify-center">
                                        <div className="w-2 h-2 rounded-full bg-[#C65A1E]" />
                                      </div>
                                    ) : isLocked ? (
                                      <Lock className="h-4 w-4 text-muted-foreground" />
                                    ) : (
                                      <Circle className="h-5 w-5 text-muted-foreground/40" />
                                    )}
                                  </span>

                                  {/* Lesson info */}
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                      <p
                                        className={`text-sm font-medium ${
                                          isCompleted
                                            ? "text-muted-foreground line-through"
                                            : ""
                                        } group-hover:text-foreground transition-colors`}
                                      >
                                        {isEn
                                          ? lesson.title
                                          : lesson.titleFr || lesson.title}
                                      </p>
                                      {lesson.isPreview && (
                                        <Badge
                                          variant="outline"
                                          className="text-[10px] px-1.5 py-0"
                                        >
                                          {isEn ? "Preview" : "Aperçu"}
                                        </Badge>
                                      )}
                                    </div>

                                    {/* 7-Slot indicators */}
                                    {lessonActivities.length > 0 && (
                                      <SlotIndicators
                                        lessonActivities={lessonActivities}
                                        language={language}
                                      />
                                    )}
                                  </div>

                                  {/* Duration + arrow */}
                                  <div className="flex items-center gap-2 flex-shrink-0 mt-0.5">
                                    {lesson.videoDurationSeconds > 0 && (
                                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                                        <Clock className="h-3 w-3" />
                                        {Math.round(
                                          lesson.videoDurationSeconds / 60
                                        )}
                                        m
                                      </span>
                                    )}
                                    <ChevronRight className="h-4 w-4 text-muted-foreground/40 group-hover:text-foreground transition-colors" />
                                  </div>
                                </motion.button>
                              );
                            }
                          )}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>

              {/* ═══════════════════════════════════════════════════════
                  COURSE STATS FOOTER
                  ═══════════════════════════════════════════════════════ */}
              {course.modules && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.4 }}
                  className="mt-8 glass-card rounded-2xl p-6"
                >
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                    <div>
                      <div className="w-10 h-10 rounded-xl bg-[#0F3D3E]/10 flex items-center justify-center mx-auto mb-2">
                        <Layers className="h-5 w-5 text-[#0F3D3E]" />
                      </div>
                      <p className="text-2xl font-bold">
                        {course.modules.length}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {isEn ? "Modules" : "Modules"}
                      </p>
                    </div>
                    <div>
                      <div className="w-10 h-10 rounded-xl bg-[#C65A1E]/10 flex items-center justify-center mx-auto mb-2">
                        <BookOpen className="h-5 w-5 text-[#C65A1E]" />
                      </div>
                      <p className="text-2xl font-bold">{totalLessons}</p>
                      <p className="text-xs text-muted-foreground">
                        {isEn ? "Lessons" : "Leçons"}
                      </p>
                    </div>
                    <div>
                      <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center mx-auto mb-2">
                        <Award className="h-5 w-5 text-purple-500" />
                      </div>
                      <p className="text-2xl font-bold">
                        {Object.values(activitiesByLesson).reduce(
                          (acc, arr) => acc + arr.length,
                          0
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {isEn ? "Activities" : "Activités"}
                      </p>
                    </div>
                    <div>
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center mx-auto mb-2">
                        <Clock className="h-5 w-5 text-emerald-500" />
                      </div>
                      <p className="text-2xl font-bold">
                        {totalDurationMinutes > 0
                          ? `${Math.round(totalDurationMinutes / 60)}h`
                          : "—"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {isEn ? "Total Duration" : "Durée totale"}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </>
        )}
      </div>
    </LearnLayout>
  );
}
