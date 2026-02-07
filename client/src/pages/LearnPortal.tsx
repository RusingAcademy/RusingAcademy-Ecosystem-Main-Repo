/**
 * LearnPortal — Entry point for the immersive Learn Portal
 * 
 * Wraps the LearnLayout shell around the course hub (LearnCourse).
 * The LessonViewer already has its own complete layout (top bar, sidebar, nav),
 * so it continues to work standalone at /learn/:slug/lessons/:id.
 * 
 * This page serves as the course overview/hub within the immersive portal.
 */
import LearnLayout from "@/components/LearnLayout";
import { useParams, useLocation, Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Circle,
  Clock,
  Download,
  FileText,
  GraduationCap,
  HelpCircle,
  Lock,
  PlayCircle,
  Trophy,
  Video,
  Mic,
} from "lucide-react";

// Content type icons
const contentTypeIcons: Record<string, React.ReactNode> = {
  video: <PlayCircle className="h-4 w-4" />,
  text: <FileText className="h-4 w-4" />,
  quiz: <HelpCircle className="h-4 w-4" />,
  audio: <Mic className="h-4 w-4" />,
  assignment: <BookOpen className="h-4 w-4" />,
  download: <Download className="h-4 w-4" />,
};

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

  // Fetch progress
  const { data: progress } = trpc.lessons.getCourseProgress.useQuery(
    { courseId: course?.id || 0 },
    { enabled: !!course?.id && isAuthenticated }
  );

  const progressPercent = progress?.progressPercent || 0;
  const completedLessons = progress?.completedLessons || 0;
  const totalLessons = progress?.totalLessons || 0;

  return (
    <LearnLayout>
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Course Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {course && (
            <>
              <Badge variant="outline" className="mb-3">
                <GraduationCap className="h-3 w-3 mr-1" />
                {course.level || "All Levels"}
              </Badge>
              <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
              <p className="text-lg text-muted-foreground mb-6">{course.description}</p>

              {/* Progress Card */}
              {isAuthenticated && (
                <Card className="mb-8">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          {isEn ? "Your Progress" : "Votre progression"}
                        </p>
                        <p className="text-2xl font-bold">{progressPercent}%</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">
                          {isEn ? "Lessons Completed" : "Leçons complétées"}
                        </p>
                        <p className="text-2xl font-bold">{completedLessons} / {totalLessons}</p>
                      </div>
                      {progressPercent === 100 && (
                        <div className="flex items-center gap-2 text-amber-600">
                          <Trophy className="h-6 w-6" />
                          <span className="font-semibold">{isEn ? "Completed!" : "Terminé !"}</span>
                        </div>
                      )}
                    </div>
                    <Progress value={progressPercent} className="h-3" />

                    {/* Resume button */}
                    {progress?.nextLesson && (
                      <div className="mt-4 pt-4 border-t flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">
                            {isEn ? "Continue where you left off" : "Continuez où vous en étiez"}
                          </p>
                          <p className="text-sm font-medium">{progress.nextLesson.title}</p>
                        </div>
                        <Button
                          onClick={() => setLocation(`/learn/${slug}/lessons/${progress.nextLesson.id}`)}
                        >
                          {isEn ? "Continue" : "Continuer"}
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Modules Accordion */}
              <h2 className="text-xl font-semibold mb-4">
                {isEn ? "Course Content" : "Contenu du cours"}
              </h2>
              <Accordion type="multiple" defaultValue={course.modules?.map((_: any, i: number) => `module-${i}`) || []}>
                {course.modules?.map((module: any, moduleIndex: number) => {
                  const moduleLessons = module.lessons || [];
                  // Use module-level progress from getCourseProgress
                  const progressModule = progress?.modules?.find((pm: any) => pm.id === module.id);
                  const moduleCompleted = progressModule?.completedLessons || 0;

                  return (
                    <AccordionItem key={module.id} value={`module-${moduleIndex}`}>
                      <AccordionTrigger className="hover:no-underline">
                        <div className="flex items-center gap-3 text-left">
                          <Badge variant="outline" className="text-xs flex-shrink-0">
                            {moduleIndex + 1}
                          </Badge>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{module.title}</p>
                            <p className="text-xs text-muted-foreground">
                              {moduleLessons.length} {isEn ? "lessons" : "leçons"}
                              {isAuthenticated && ` · ${moduleCompleted}/${moduleLessons.length} ${isEn ? "completed" : "terminées"}`}
                            </p>
                          </div>
                          {isAuthenticated && moduleCompleted === moduleLessons.length && moduleLessons.length > 0 && (
                            <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                          )}
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-1 pt-2">
                          {moduleLessons.map((lesson: any, lessonIndex: number) => {
                            const isCompleted = false; // Individual lesson completion tracked via module progress
                            const isLocked = false; // TODO: drip content check

                            return (
                              <button
                                key={lesson.id}
                                onClick={() => !isLocked && setLocation(`/learn/${slug}/lessons/${lesson.id}`)}
                                disabled={isLocked}
                                className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left transition-colors ${
                                  isLocked
                                    ? "text-muted-foreground/50 cursor-not-allowed"
                                    : "hover:bg-muted"
                                }`}
                              >
                                {/* Status */}
                                <span className="flex-shrink-0">
                                  {isCompleted ? (
                                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                                  ) : isLocked ? (
                                    <Lock className="h-4 w-4 text-muted-foreground" />
                                  ) : (
                                    <Circle className="h-5 w-5 text-muted-foreground" />
                                  )}
                                </span>

                                {/* Content type icon */}
                                <span className="flex-shrink-0 text-muted-foreground">
                                  {contentTypeIcons[lesson.contentType || "video"] || <Video className="h-4 w-4" />}
                                </span>

                                {/* Title and meta */}
                                <div className="flex-1 min-w-0">
                                  <p className={`text-sm font-medium ${isCompleted ? "line-through opacity-60" : ""}`}>
                                    {lesson.title}
                                  </p>
                                  {lesson.description && (
                                    <p className="text-xs text-muted-foreground truncate">{lesson.description}</p>
                                  )}
                                </div>

                                {/* Duration */}
                                {lesson.videoDurationSeconds && (
                                  <span className="text-xs text-muted-foreground flex items-center gap-1 flex-shrink-0">
                                    <Clock className="h-3 w-3" />
                                    {Math.round(lesson.videoDurationSeconds / 60)}m
                                  </span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>

              {/* Course Stats Footer */}
              {course.modules && (
                <div className="mt-8 pt-6 border-t grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold">{course.modules.length}</p>
                    <p className="text-xs text-muted-foreground">{isEn ? "Modules" : "Modules"}</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{totalLessons}</p>
                    <p className="text-xs text-muted-foreground">{isEn ? "Lessons" : "Leçons"}</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">
                      {course.modules.reduce((acc: number, m: any) =>
                        acc + (m.lessons?.reduce((a: number, l: any) => a + (l.videoDurationSeconds || 0), 0) || 0), 0
                      ) > 0
                        ? `${Math.round(course.modules.reduce((acc: number, m: any) =>
                            acc + (m.lessons?.reduce((a: number, l: any) => a + (l.videoDurationSeconds || 0), 0) || 0), 0
                          ) / 3600)}h`
                        : "—"
                      }
                    </p>
                    <p className="text-xs text-muted-foreground">{isEn ? "Total Duration" : "Durée totale"}</p>
                  </div>
                </div>
              )}
            </>
          )}
        </motion.div>
      </div>
    </LearnLayout>
  );
}
