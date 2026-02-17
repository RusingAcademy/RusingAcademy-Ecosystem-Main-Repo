/**
 * QuizManagement — Standalone Admin Quiz Management Page
 * Sprint C1: Full CRUD quiz management with course/lesson selector
 * 
 * Features:
 * - Course → Lesson selector for quiz editing
 * - Embedded QuizBuilder for selected lesson
 * - Quiz analytics overview
 * - Quick-access to lessons with quizzes
 * - Professional empty states
 * - Bilingual labels (EN/FR)
 */
import { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import QuizBuilder from "@/components/QuizBuilder";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  HelpCircle, Search, BookOpen, Layers, FileText,
  BarChart3, Loader2, ChevronRight, CheckCircle2, AlertCircle,
  Languages, ArrowLeft
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

// ─── Bilingual Labels ───
const labels = {
  en: {
    title: "Quiz Management",
    subtitle: "Create, edit, and manage quiz questions for your courses. Select a course and lesson to begin.",
    selectCourse: "Select Course",
    selectLesson: "Select Lesson",
    allCourses: "All Courses",
    searchPlaceholder: "Search courses or lessons...",
    quizLessons: "Quiz Lessons",
    quizLessonsDesc: "Lessons configured as quizzes across all courses.",
    analytics: "Analytics",
    analyticsDesc: "Quiz performance metrics and question statistics.",
    noQuizLessons: "No Quiz Lessons Found",
    noQuizLessonsDesc: "No lessons are configured as quizzes yet. Create a quiz-type lesson in the Course Builder first.",
    goToCourseBuilder: "Open Course Builder",
    selectedLesson: "Editing Quiz",
    questions: "questions",
    totalPoints: "total points",
    course: "Course",
    module: "Module",
    lesson: "Lesson",
    backToList: "Back to Quiz List",
    overview: "Overview",
    builder: "Quiz Builder",
    statsTab: "Statistics",
    quickStats: "Quick Stats",
    totalQuizzes: "Total Quizzes",
    withQuestions: "With Questions",
    emptyQuizzes: "Empty Quizzes",
    avgQuestions: "Avg Questions/Quiz",
    selectLessonPrompt: "Select a quiz lesson to start editing questions.",
    loadingLessons: "Loading quiz lessons...",
  },
  fr: {
    title: "Gestion des Quiz",
    subtitle: "Créez, modifiez et gérez les questions de quiz pour vos cours. Sélectionnez un cours et une leçon pour commencer.",
    selectCourse: "Sélectionner un cours",
    selectLesson: "Sélectionner une leçon",
    allCourses: "Tous les cours",
    searchPlaceholder: "Rechercher des cours ou leçons...",
    quizLessons: "Leçons Quiz",
    quizLessonsDesc: "Leçons configurées comme quiz dans tous les cours.",
    analytics: "Analytique",
    analyticsDesc: "Métriques de performance des quiz et statistiques des questions.",
    noQuizLessons: "Aucune leçon quiz trouvée",
    noQuizLessonsDesc: "Aucune leçon n'est configurée comme quiz pour le moment. Créez d'abord une leçon de type quiz dans le constructeur de cours.",
    goToCourseBuilder: "Ouvrir le constructeur de cours",
    selectedLesson: "Modification du quiz",
    questions: "questions",
    totalPoints: "points totaux",
    course: "Cours",
    module: "Module",
    lesson: "Leçon",
    backToList: "Retour à la liste",
    overview: "Aperçu",
    builder: "Constructeur de quiz",
    statsTab: "Statistiques",
    quickStats: "Statistiques rapides",
    totalQuizzes: "Total des quiz",
    withQuestions: "Avec questions",
    emptyQuizzes: "Quiz vides",
    avgQuestions: "Moy. questions/quiz",
    selectLessonPrompt: "Sélectionnez une leçon quiz pour commencer à modifier les questions.",
    loadingLessons: "Chargement des leçons quiz...",
  },
};

export default function QuizManagement() {
  const { language } = useLanguage();
  const t = labels[language] || labels.en;

  const [selectedLessonId, setSelectedLessonId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [courseFilter, setCourseFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("lessons");

  // Fetch all quiz lessons
  const { data: quizLessons, isLoading } = trpc.admin.getQuizLessons.useQuery();

  // Fetch question stats for all lessons (for the overview)
  const { data: questionStats } = trpc.admin.getQuizQuestionStats.useQuery(
    { lessonId: selectedLessonId! },
    { enabled: !!selectedLessonId }
  );

  // Get unique courses for filter
  const courses = useMemo(() => {
    if (!quizLessons) return [];
    const unique = new Map<string, string>();
    (quizLessons as any[]).forEach((l: any) => {
      if (l.courseTitle && !unique.has(l.courseTitle)) {
        unique.set(l.courseTitle, l.courseTitle);
      }
    });
    return Array.from(unique.values()).sort();
  }, [quizLessons]);

  // Filter lessons
  const filteredLessons = useMemo(() => {
    if (!quizLessons) return [];
    let lessons = quizLessons as any[];
    
    if (courseFilter !== "all") {
      lessons = lessons.filter((l: any) => l.courseTitle === courseFilter);
    }
    
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      lessons = lessons.filter((l: any) =>
        l.title?.toLowerCase().includes(q) ||
        l.moduleTitle?.toLowerCase().includes(q) ||
        l.courseTitle?.toLowerCase().includes(q)
      );
    }
    
    return lessons;
  }, [quizLessons, courseFilter, searchQuery]);

  // Quick stats
  const stats = useMemo(() => {
    const all = (quizLessons || []) as any[];
    return {
      total: all.length,
      withQuestions: all.filter((l: any) => (l.questionCount || 0) > 0).length,
      empty: all.filter((l: any) => (l.questionCount || 0) === 0).length,
      avgQuestions: all.length > 0
        ? Math.round(all.reduce((sum: number, l: any) => sum + (l.questionCount || 0), 0) / all.length)
        : 0,
    };
  }, [quizLessons]);

  // Selected lesson details
  const selectedLesson = useMemo(() => {
    if (!selectedLessonId || !quizLessons) return null;
    return (quizLessons as any[]).find((l: any) => l.id === selectedLessonId);
  }, [selectedLessonId, quizLessons]);

  // ─── Selected Lesson View (Quiz Builder) ───
  if (selectedLessonId && selectedLesson) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            className="gap-1.5"
            onClick={() => setSelectedLessonId(null)}
          >
            <ArrowLeft className="h-4 w-4" />
            {t.backToList}
          </Button>
        </div>

        <div>
          <h1 className="text-2xl font-bold">{t.selectedLesson}</h1>
          <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
            <Badge variant="outline" className="text-xs gap-1">
              <BookOpen className="h-3 w-3" />
              {selectedLesson.courseTitle}
            </Badge>
            <ChevronRight className="h-3 w-3" />
            <Badge variant="outline" className="text-xs gap-1">
              <Layers className="h-3 w-3" />
              {selectedLesson.moduleTitle}
            </Badge>
            <ChevronRight className="h-3 w-3" />
            <Badge variant="secondary" className="text-xs gap-1">
              <FileText className="h-3 w-3" />
              {selectedLesson.title}
            </Badge>
          </div>
        </div>

        <Separator />

        <Tabs defaultValue="builder" className="space-y-4">
          <TabsList>
            <TabsTrigger value="builder">{t.builder}</TabsTrigger>
            <TabsTrigger value="stats">{t.statsTab}</TabsTrigger>
          </TabsList>

          <TabsContent value="builder">
            <QuizBuilder
              lessonId={selectedLessonId}
              courseId={0}
              moduleId={0}
            />
          </TabsContent>

          <TabsContent value="stats">
            {questionStats ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <p className="text-lg md:text-2xl lg:text-3xl font-bold text-primary">{(questionStats as any).total || 0}</p>
                    <p className="text-xs text-muted-foreground mt-1">{t.questions}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <p className="text-lg md:text-2xl lg:text-3xl font-bold text-amber-600">{(questionStats as any).totalPoints || 0}</p>
                    <p className="text-xs text-muted-foreground mt-1">{t.totalPoints}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <p className="text-lg md:text-2xl lg:text-3xl font-bold text-green-600">
                      {(questionStats as any).byDifficulty?.length || 0}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">Difficulty Levels</p>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  <BarChart3 className="h-10 w-10 mx-auto mb-3 opacity-40" />
                  <p className="text-sm">Statistics will appear once questions are added.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  // ─── Main Quiz Management View ───
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <HelpCircle className="h-6 w-6 text-primary" />
            {t.title}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">{t.subtitle}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="gap-1">
            <Languages className="h-3 w-3" />
            {language === "fr" ? "FR" : "EN"}
          </Badge>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <HelpCircle className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-xl font-bold">{stats.total}</p>
              <p className="text-xs text-muted-foreground">{t.totalQuizzes}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-xl font-bold">{stats.withQuestions}</p>
              <p className="text-xs text-muted-foreground">{t.withQuestions}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
              <AlertCircle className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-xl font-bold">{stats.empty}</p>
              <p className="text-xs text-muted-foreground">{t.emptyQuizzes}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <BarChart3 className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xl font-bold">{stats.avgQuestions}</p>
              <p className="text-xs text-muted-foreground">{t.avgQuestions}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9"
          />
        </div>
        <Select value={courseFilter} onValueChange={setCourseFilter}>
          <SelectTrigger className="w-[220px] h-9">
            <SelectValue placeholder={t.selectCourse} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t.allCourses}</SelectItem>
            {courses.map((c) => (
              <SelectItem key={c} value={c}>{c}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Quiz Lessons List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-6 md:py-8 lg:py-12 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin mr-2" />
          {t.loadingLessons}
        </div>
      ) : filteredLessons.length === 0 ? (
        <Card>
          <CardContent className="py-6 md:py-8 lg:py-12 text-center">
            <HelpCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-30" />
            <h3 className="text-lg font-semibold mb-2">{t.noQuizLessons}</h3>
            <p className="text-sm text-muted-foreground mb-4 max-w-md mx-auto">
              {t.noQuizLessonsDesc}
            </p>
            <Button variant="outline" size="sm" asChild>
              <a href="/admin/courses">{t.goToCourseBuilder}</a>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {filteredLessons.map((lesson: any) => {
            const hasQuestions = (lesson.questionCount || 0) > 0;
            return (
              <Card
                key={lesson.id}
                className="hover:shadow-sm transition-all cursor-pointer border-l-4"
                style={{
                  borderLeftColor: hasQuestions ? "hsl(var(--primary))" : "hsl(var(--muted))",
                }}
                onClick={() => setSelectedLessonId(lesson.id)}
              >
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      hasQuestions ? "bg-primary/10" : "bg-muted"
                    }`}>
                      <HelpCircle className={`h-5 w-5 ${hasQuestions ? "text-primary" : "text-muted-foreground"}`} />
                    </div>
                    <div>
                      <p className="font-medium">{lesson.title}</p>
                      <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <BookOpen className="h-3 w-3" />
                          {lesson.courseTitle}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Layers className="h-3 w-3" />
                          {lesson.moduleTitle}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {hasQuestions ? (
                      <Badge variant="default" className="text-xs">
                        {lesson.questionCount} {t.questions}
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="text-xs">
                        {language === "fr" ? "Vide" : "Empty"}
                      </Badge>
                    )}
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
