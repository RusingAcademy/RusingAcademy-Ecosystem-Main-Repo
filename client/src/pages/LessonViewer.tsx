import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Video,
  FileText,
  HelpCircle,
  CheckCircle2,
  Circle,
  Lock,
  BookOpen,
  Clock,
  ArrowLeft,
  Menu,
  X,
  Volume2,
  Maximize,
  SkipBack,
  SkipForward,
} from "lucide-react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { motion, AnimatePresence } from "framer-motion";

// Lesson type icons
const lessonTypeIcons: Record<string, typeof Video> = {
  video: Video,
  text: FileText,
  quiz: HelpCircle,
  audio: Volume2,
  pdf: FileText,
  assignment: FileText,
  download: FileText,
  live_session: Video,
};

export default function LessonViewer() {
  const { slug, lessonId } = useParams<{ slug: string; lessonId: string }>();
  const { language } = useLanguage();
  const isEn = language === "en";
  const [, setLocation] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);

  // Fetch course data
  const { data: course, isLoading: courseLoading } = trpc.courses.getBySlug.useQuery(
    { slug: slug || "" },
    { enabled: !!slug }
  );

  // Fetch lesson data
  const { data: lessonData, isLoading: lessonLoading } = trpc.courses.getLesson.useQuery(
    { lessonId: parseInt(lessonId || "0") },
    { enabled: !!lessonId }
  );

  // Mark lesson complete mutation (uses updateProgress with completed: true)
  const markCompleteMutation = trpc.courses.updateProgress.useMutation();

  // Get enrollment status
  const { data: enrollment } = trpc.courses.getEnrollment.useQuery(
    { courseId: course?.id || 0 },
    { enabled: !!course?.id }
  );

  const lesson = lessonData?.lesson;
  const progress = lessonData?.progress;

  // Find current lesson index and navigation
  const allLessons = course?.modules?.flatMap(m => m.lessons) || [];
  const currentIndex = allLessons.findIndex(l => l.id === parseInt(lessonId || "0"));
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  // Calculate overall progress
  const completedLessons = enrollment?.lessonsCompleted || 0;
  const totalLessons = enrollment?.totalLessons || allLessons.length;
  const progressPercent = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  const handleMarkComplete = async () => {
    if (!lesson) return;
    try {
      await markCompleteMutation.mutateAsync({ lessonId: lesson.id, progressPercent: 100, completed: true });
      // Navigate to next lesson if available
      if (nextLesson) {
        setLocation(`/courses/${slug}/lessons/${nextLesson.id}`);
      }
    } catch (error) {
      console.error("Failed to mark lesson complete:", error);
    }
  };

  const navigateToLesson = (lessonId: number) => {
    setLocation(`/courses/${slug}/lessons/${lessonId}`);
  };

  if (courseLoading || lessonLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">{isEn ? "Loading lesson..." : "Chargement de la leçon..."}</p>
        </div>
      </div>
    );
  }

  if (!course || !lesson) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">{isEn ? "Lesson not found" : "Leçon introuvable"}</h1>
          <p className="text-muted-foreground mb-6">
            {isEn ? "This lesson doesn't exist or you don't have access." : "Cette leçon n'existe pas ou vous n'y avez pas accès."}
          </p>
          <Button asChild>
            <Link href={`/courses/${slug}`}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              {isEn ? "Back to Course" : "Retour au cours"}
            </Link>
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  const LessonIcon = lessonTypeIcons[lesson.contentType || "video"] || Video;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Navigation Bar */}
      <div className="sticky top-0 z-50 bg-background border-b">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)}>
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            <Link href={`/courses/${slug}`} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">{course.title}</span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {/* Progress indicator */}
            <div className="hidden md:flex items-center gap-2">
              <Progress value={progressPercent} className="w-32 h-2" />
              <span className="text-sm text-muted-foreground">{progressPercent}%</span>
            </div>

            {/* Navigation buttons */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={!prevLesson}
                onClick={() => prevLesson && navigateToLesson(prevLesson.id)}
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="hidden sm:inline ml-1">{isEn ? "Previous" : "Précédent"}</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={!nextLesson}
                onClick={() => nextLesson && navigateToLesson(nextLesson.id)}
              >
                <span className="hidden sm:inline mr-1">{isEn ? "Next" : "Suivant"}</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Course Outline */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.aside
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 320, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="border-r bg-muted/30 overflow-hidden flex-shrink-0"
            >
              <ScrollArea className="h-[calc(100vh-57px)]">
                <div className="p-4">
                  <h2 className="font-semibold mb-4">{isEn ? "Course Content" : "Contenu du cours"}</h2>
                  
                  {course.modules?.map((module, moduleIndex) => (
                    <div key={module.id} className="mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="text-xs">
                          {isEn ? `Module ${moduleIndex + 1}` : `Module ${moduleIndex + 1}`}
                        </Badge>
                        <span className="text-sm font-medium truncate">{module.title}</span>
                      </div>
                      
                      <div className="space-y-1 pl-2">
                        {module.lessons?.map((l) => {
                          const isActive = l.id === lesson.id;
                          const isCompleted = false; // TODO: Check from progress
                          const isLocked = !enrollment && !l.isPreview;
                          const Icon = lessonTypeIcons[l.contentType || "video"] || Video;
                          
                          return (
                            <button
                              key={l.id}
                              onClick={() => !isLocked && navigateToLesson(l.id)}
                              disabled={isLocked}
                              className={`w-full flex items-center gap-2 p-2 rounded-lg text-left text-sm transition-colors ${
                                isActive
                                  ? "bg-primary text-primary-foreground"
                                  : isLocked
                                  ? "text-muted-foreground cursor-not-allowed"
                                  : "hover:bg-muted"
                              }`}
                            >
                              {isCompleted ? (
                                <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                              ) : isLocked ? (
                                <Lock className="h-4 w-4 flex-shrink-0" />
                              ) : (
                                <Icon className="h-4 w-4 flex-shrink-0" />
                              )}
                              <span className="truncate flex-1">{l.title}</span>
                              {l.videoDurationSeconds && (
                                <span className="text-xs opacity-70">
                                  {Math.round(l.videoDurationSeconds / 60)}m
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto p-6">
            {/* Lesson Header */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline">
                  <LessonIcon className="h-3 w-3 mr-1" />
                  {lesson.contentType === "video" ? (isEn ? "Video" : "Vidéo") :
                   lesson.contentType === "text" ? (isEn ? "Article" : "Article") :
                   lesson.contentType === "quiz" ? (isEn ? "Quiz" : "Quiz") :
                   lesson.contentType}
                </Badge>
                {lesson.videoDurationSeconds && (
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {Math.round(lesson.videoDurationSeconds / 60)} min
                  </span>
                )}
              </div>
              <h1 className="text-2xl font-bold">{lesson.title}</h1>
              {lesson.description && (
                <p className="text-muted-foreground mt-2">{lesson.description}</p>
              )}
            </div>

            {/* Content Area */}
            <Card className="mb-6">
              <CardContent className="p-0">
                {/* Video Content */}
                {lesson.contentType === "video" && lesson.videoUrl && (
                  <div className="aspect-video bg-black relative">
                    {lesson.videoProvider === "youtube" ? (
                      <iframe
                        src={`https://www.youtube.com/embed/${extractYouTubeId(lesson.videoUrl)}?rel=0`}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    ) : lesson.videoProvider === "vimeo" ? (
                      <iframe
                        src={`https://player.vimeo.com/video/${extractVimeoId(lesson.videoUrl)}`}
                        className="w-full h-full"
                        allow="autoplay; fullscreen; picture-in-picture"
                        allowFullScreen
                      />
                    ) : (
                      <video
                        src={lesson.videoUrl}
                        controls
                        className="w-full h-full"
                        poster={lesson.videoThumbnailUrl || undefined}
                      />
                    )}
                  </div>
                )}

                {/* Text Content */}
                {lesson.contentType === "text" && lesson.textContent && (
                  <div className="p-6 prose prose-lg dark:prose-invert max-w-none">
                    <div dangerouslySetInnerHTML={{ __html: lesson.textContent }} />
                  </div>
                )}

                {/* Quiz Content */}
                {lesson.contentType === "quiz" && (
                  <div className="p-6 text-center">
                    <HelpCircle className="h-16 w-16 text-primary mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">
                      {isEn ? "Quiz Time!" : "C'est l'heure du quiz !"}
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      {isEn 
                        ? "Test your knowledge with this interactive quiz." 
                        : "Testez vos connaissances avec ce quiz interactif."}
                    </p>
                    <Button size="lg">
                      <Play className="h-4 w-4 mr-2" />
                      {isEn ? "Start Quiz" : "Commencer le quiz"}
                    </Button>
                  </div>
                )}

                {/* Placeholder for other content types */}
                {!["video", "text", "quiz"].includes(lesson.contentType || "") && (
                  <div className="p-6 text-center">
                    <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      {isEn ? "Content coming soon..." : "Contenu à venir..."}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex items-center justify-between">
              <Button variant="outline" asChild>
                <Link href={`/courses/${slug}`}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  {isEn ? "Back to Course" : "Retour au cours"}
                </Link>
              </Button>

              <div className="flex items-center gap-3">
                {progress?.status !== "completed" && (
                  <Button
                    onClick={handleMarkComplete}
                    disabled={markCompleteMutation.isPending}
                  >
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    {markCompleteMutation.isPending
                      ? (isEn ? "Saving..." : "Enregistrement...")
                      : (isEn ? "Mark Complete" : "Marquer comme terminé")}
                  </Button>
                )}

                {nextLesson && (
                  <Button onClick={() => navigateToLesson(nextLesson.id)}>
                    {isEn ? "Next Lesson" : "Leçon suivante"}
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

// Helper functions to extract video IDs
function extractYouTubeId(url: string): string {
  const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
  return match ? match[1] : url;
}

function extractVimeoId(url: string): string {
  const match = url.match(/vimeo\.com\/(?:.*\/)?(\d+)/);
  return match ? match[1] : url;
}
