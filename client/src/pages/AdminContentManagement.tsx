import { useState, useMemo } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BookOpen,
  Layers,
  FileText,
  HelpCircle,
  Search,
  RefreshCw,
  Plus,
  Pencil,
  Trash2,
  ChevronRight,
} from "lucide-react";
import { trpc } from "@/lib/trpc";
import { getLoginUrl } from "@/const";
import { Link } from "wouter";
import { toast } from "sonner";

export default function AdminContentManagement() {
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
  const [selectedModuleId, setSelectedModuleId] = useState<number | null>(null);
  const [selectedLessonId, setSelectedLessonId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  const [isQuestionDialogOpen, setIsQuestionDialogOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<any>(null);
  const [questionForm, setQuestionForm] = useState({
    questionText: "",
    questionTextFr: "",
    questionType: "multiple_choice" as "multiple_choice" | "true_false" | "fill_in_blank",
    difficulty: "medium" as "easy" | "medium" | "hard",
    options: ["", "", "", ""],
    correctAnswer: 3,
    explanation: "",
    points: 10,
  });
  
  const { data: courses, isLoading: coursesLoading, refetch: refetchCourses } = trpc.courses.list.useQuery();
  
  const { data: modules, isLoading: modulesLoading } = trpc.courses.getModules.useQuery(
    { courseId: selectedCourseId! },
    { enabled: !!selectedCourseId }
  );
  
  const { data: lessons, isLoading: lessonsLoading } = trpc.lessons.getByModule.useQuery(
    { moduleId: selectedModuleId! },
    { enabled: !!selectedModuleId }
  );
  
  const { data: questions, isLoading: questionsLoading, refetch: refetchQuestions } = trpc.admin.getQuizQuestions.useQuery(
    { lessonId: selectedLessonId! },
    { enabled: !!selectedLessonId }
  );
  
  const createQuestionMutation = trpc.admin.createQuizQuestion.useMutation({
    onSuccess: () => {
      toast.success("Question created successfully");
      setIsQuestionDialogOpen(false);
      refetchQuestions();
      resetQuestionForm();
    },
    onError: (error) => {
      toast.error(`Failed to create question: ${error.message}`);
    },
  });
  
  const updateQuestionMutation = trpc.admin.updateQuizQuestion.useMutation({
    onSuccess: () => {
      toast.success("Question updated successfully");
      setIsQuestionDialogOpen(false);
      refetchQuestions();
      resetQuestionForm();
    },
    onError: (error) => {
      toast.error(`Failed to update question: ${error.message}`);
    },
  });
  
  const deleteQuestionMutation = trpc.admin.deleteQuizQuestion.useMutation({
    onSuccess: () => {
      toast.success("Question deleted successfully");
      refetchQuestions();
    },
    onError: (error) => {
      toast.error(`Failed to delete question: ${error.message}`);
    },
  });
  
  const filteredCourses = useMemo(() => {
    if (!courses) return [];
    if (!searchQuery) return courses;
    return courses.filter((course: any) =>
      course.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [courses, searchQuery]);
  
  const selectedCourse = courses?.find((c: any) => c.id === selectedCourseId);
  const selectedModule = modules?.find((m: any) => m.id === selectedModuleId);
  const selectedLesson = lessons?.find((l: any) => l.id === selectedLessonId);
  
  const resetQuestionForm = () => {
    setQuestionForm({
      questionText: "",
      questionTextFr: "",
      questionType: "multiple_choice",
      difficulty: "medium",
      options: ["", "", "", ""],
      correctAnswer: 3,
      explanation: "",
      points: 10,
    });
    setEditingQuestion(null);
  };
  
  const handleQuestionSubmit = () => {
    if (!selectedLessonId) return;
    
    const questionData = {
      lessonId: selectedLessonId,
      questionText: questionForm.questionText,
      questionTextFr: questionForm.questionTextFr || undefined,
      questionType: questionForm.questionType,
      difficulty: questionForm.difficulty,
      options: questionForm.questionType === "multiple_choice" 
        ? questionForm.options.filter(o => o.trim() !== "")
        : questionForm.questionType === "true_false"
        ? ["True", "False"]
        : [],
      correctAnswer: questionForm.correctAnswer,
      explanation: questionForm.explanation || undefined,
      points: questionForm.points,
    };
    
    if (editingQuestion) {
      updateQuestionMutation.mutate({ id: editingQuestion.id, ...questionData });
    } else {
      createQuestionMutation.mutate(questionData);
    }
  };
  
  const handleEditQuestion = (question: any) => {
    setEditingQuestion(question);
    setQuestionForm({
      questionText: question.questionText || "",
      questionTextFr: question.questionTextFr || "",
      questionType: question.questionType || "multiple_choice",
      difficulty: question.difficulty || "medium",
      options: question.options || ["", "", "", ""],
      correctAnswer: question.correctAnswer || 0,
      explanation: question.explanation || "",
      points: question.points || 10,
    });
    setIsQuestionDialogOpen(true);
  };
  
  const handleDeleteQuestion = (questionId: number) => {
    if (confirm("Are you sure you want to delete this question?")) {
      deleteQuestionMutation.mutate({ id: questionId });
    }
  };
  
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    window.location.href = getLoginUrl();
    return null;
  }
  
  if (user?.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="max-w-md">
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              You don't have permission to access this page.
            </p>
            <Link href="/">
              <Button className="w-full mt-4">Go Home</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-8">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/admin" className="hover:text-foreground">Admin</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground">Content Management</span>
        </nav>
        
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Content Management</h1>
            <p className="text-muted-foreground mt-1">
              Manage courses, modules, lessons, and quiz questions
            </p>
          </div>
          <Button onClick={() => refetchCourses()} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-blue-500/20">
                  <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Courses</p>
                  <p className="text-2xl font-bold">{courses?.length || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-green-500/20">
                  <Layers className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Modules</p>
                  <p className="text-2xl font-bold">{modules?.length || "—"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-purple-500/20">
                  <FileText className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Lessons</p>
                  <p className="text-2xl font-bold">{lessons?.length || "—"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950 dark:to-amber-900 border-amber-200 dark:border-amber-800">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-amber-500/20">
                  <HelpCircle className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Quiz Questions</p>
                  <p className="text-2xl font-bold">{questions?.length || "—"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Courses
                  {courses && <Badge variant="secondary">{courses.length}</Badge>}
                </CardTitle>
              </div>
              <div className="relative mt-2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search courses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </CardHeader>
            <CardContent className="max-h-[500px] overflow-y-auto">
              {coursesLoading ? (
                <div className="text-center py-4 text-muted-foreground">Loading...</div>
              ) : filteredCourses.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">No courses found</div>
              ) : (
                <div className="space-y-2">
                  {filteredCourses.map((course: any) => (
                    <button
                      key={course.id}
                      onClick={() => {
                        setSelectedCourseId(course.id);
                        setSelectedModuleId(null);
                        setSelectedLessonId(null);
                      }}
                      className={`w-full text-left p-3 rounded-lg transition-colors ${
                        selectedCourseId === course.id
                          ? "bg-primary/10 border-2 border-primary"
                          : "bg-muted/50 hover:bg-muted border-2 border-transparent"
                      }`}
                    >
                      <p className="font-medium text-sm line-clamp-2">{course.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">{course.level}</Badge>
                        <Badge variant="secondary" className="text-xs">{course.status}</Badge>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Layers className="h-5 w-5" />
                Modules
                {modules && <Badge variant="secondary">{modules.length}</Badge>}
              </CardTitle>
            </CardHeader>
            <CardContent className="max-h-[500px] overflow-y-auto">
              {!selectedCourseId ? (
                <div className="text-center py-8 text-muted-foreground">
                  Select a course to view modules
                </div>
              ) : modulesLoading ? (
                <div className="text-center py-4 text-muted-foreground">Loading...</div>
              ) : !modules || modules.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">No modules found</div>
              ) : (
                <div className="space-y-2">
                  {modules.map((module: any) => (
                    <button
                      key={module.id}
                      onClick={() => {
                        setSelectedModuleId(module.id);
                        setSelectedLessonId(null);
                      }}
                      className={`w-full text-left p-3 rounded-lg transition-colors ${
                        selectedModuleId === module.id
                          ? "bg-primary/10 border-2 border-primary"
                          : "bg-muted/50 hover:bg-muted border-2 border-transparent"
                      }`}
                    >
                      <p className="font-medium text-sm line-clamp-2">{module.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">Order: {module.sortOrder}</p>
                    </button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Lessons
                {lessons && <Badge variant="secondary">{lessons.length}</Badge>}
              </CardTitle>
            </CardHeader>
            <CardContent className="max-h-[500px] overflow-y-auto">
              {!selectedModuleId ? (
                <div className="text-center py-8 text-muted-foreground">
                  Select a module to view lessons
                </div>
              ) : lessonsLoading ? (
                <div className="text-center py-4 text-muted-foreground">Loading...</div>
              ) : !lessons || lessons.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">No lessons found</div>
              ) : (
                <div className="space-y-2">
                  {lessons.map((lesson: any) => (
                    <button
                      key={lesson.id}
                      onClick={() => setSelectedLessonId(lesson.id)}
                      className={`w-full text-left p-3 rounded-lg transition-colors ${
                        selectedLessonId === lesson.id
                          ? "bg-primary/10 border-2 border-primary"
                          : "bg-muted/50 hover:bg-muted border-2 border-transparent"
                      }`}
                    >
                      <p className="font-medium text-sm line-clamp-2">{lesson.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">{lesson.type}</Badge>
                        <span className="text-xs text-muted-foreground">
                          {lesson.estimatedMinutes}m
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <HelpCircle className="h-5 w-5" />
                  Questions
                  {questions && <Badge variant="secondary">{questions.length}</Badge>}
                </CardTitle>
                {selectedLessonId && selectedLesson?.type === "quiz" && (
                  <Button
                    size="sm"
                    onClick={() => {
                      resetQuestionForm();
                      setIsQuestionDialogOpen(true);
                    }}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="max-h-[500px] overflow-y-auto">
              {!selectedLessonId ? (
                <div className="text-center py-8 text-muted-foreground">
                  Select a lesson to view questions
                </div>
              ) : selectedLesson?.type !== "quiz" ? (
                <div className="text-center py-8 text-muted-foreground">
                  This lesson is not a quiz
                </div>
              ) : questionsLoading ? (
                <div className="text-center py-4 text-muted-foreground">Loading...</div>
              ) : !questions || questions.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">
                  No questions yet
                </div>
              ) : (
                <div className="space-y-2">
                  {questions.map((question: any, index: number) => (
                    <div
                      key={question.id}
                      className="p-3 rounded-lg bg-muted/50 border"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-medium text-sm line-clamp-2">
                          {index + 1}. {question.questionText?.substring(0, 50)}...
                        </p>
                        <div className="flex items-center gap-1 shrink-0">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7"
                            onClick={() => handleEditQuestion(question)}
                          >
                            <Pencil className="h-3 w-3" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7 text-destructive"
                            onClick={() => handleDeleteQuestion(question.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className="text-xs">
                          {question.questionType}
                        </Badge>
                        <Badge
                          variant="secondary"
                          className={`text-xs ${
                            question.difficulty === "easy"
                              ? "bg-green-100 text-green-700"
                              : question.difficulty === "hard"
                              ? "bg-red-100 text-red-700"
                              : ""
                          }`}
                        >
                          {question.difficulty}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {question.points} pts
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        {selectedLesson && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Lesson Details: {selectedLesson.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Course</p>
                  <p className="font-medium">{selectedCourse?.title}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Module</p>
                  <p className="font-medium">{selectedModule?.title}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Type</p>
                  <Badge>{selectedLesson.type}</Badge>
                </div>
                <div>
                  <p className="text-muted-foreground">Duration</p>
                  <p className="font-medium">{selectedLesson.estimatedMinutes} minutes</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
      
      <Dialog open={isQuestionDialogOpen} onOpenChange={setIsQuestionDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingQuestion ? "Edit Question" : "Add New Question"}
            </DialogTitle>
            <DialogDescription>
              {selectedLesson?.title}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium">Question (English) *</label>
              <Textarea
                placeholder="Enter the question text..."
                value={questionForm.questionText}
                onChange={(e) => setQuestionForm({ ...questionForm, questionText: e.target.value })}
                className="mt-1"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">Question (French)</label>
              <Textarea
                placeholder="Entrez le texte de la question..."
                value={questionForm.questionTextFr}
                onChange={(e) => setQuestionForm({ ...questionForm, questionTextFr: e.target.value })}
                className="mt-1"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Question Type</label>
                <Select
                  value={questionForm.questionType}
                  onValueChange={(value: any) => setQuestionForm({ ...questionForm, questionType: value })}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="multiple_choice">Multiple Choice</SelectItem>
                    <SelectItem value="true_false">True/False</SelectItem>
                    <SelectItem value="fill_in_blank">Fill in the Blank</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium">Difficulty</label>
                <Select
                  value={questionForm.difficulty}
                  onValueChange={(value: any) => setQuestionForm({ ...questionForm, difficulty: value })}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {questionForm.questionType === "multiple_choice" && (
              <div>
                <label className="text-sm font-medium">Answer Options</label>
                <div className="space-y-2 mt-2">
                  {questionForm.options.map((option, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        placeholder={`Option ${index + 1}`}
                        value={option}
                        onChange={(e) => {
                          const newOptions = [...questionForm.options];
                          newOptions[index] = e.target.value;
                          setQuestionForm({ ...questionForm, options: newOptions });
                        }}
                      />
                      <Button
                        type="button"
                        size="icon"
                        variant={questionForm.correctAnswer === index ? "default" : "outline"}
                        onClick={() => setQuestionForm({ ...questionForm, correctAnswer: index })}
                        title="Mark as correct answer"
                      >
                        {questionForm.correctAnswer === index ? "✓" : index + 1}
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div>
              <label className="text-sm font-medium">Explanation (English)</label>
              <Textarea
                placeholder="Explain why this is the correct answer..."
                value={questionForm.explanation}
                onChange={(e) => setQuestionForm({ ...questionForm, explanation: e.target.value })}
                className="mt-1"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">Points</label>
              <Input
                type="number"
                value={questionForm.points}
                onChange={(e) => setQuestionForm({ ...questionForm, points: parseInt(e.target.value) || 10 })}
                className="mt-1 w-24"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsQuestionDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleQuestionSubmit}
              disabled={!questionForm.questionText || createQuestionMutation.isPending || updateQuestionMutation.isPending}
            >
              {editingQuestion ? "Update Question" : "Create Question"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Footer />
    </div>
  );
}
