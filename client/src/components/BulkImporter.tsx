/**
 * BulkImporter — Admin tool for importing courses, modules, and lessons from JSON
 * 
 * Supports:
 * - JSON file upload with drag & drop
 * - Inline JSON editor
 * - Validation preview before import
 * - Import results with success/error reporting
 * - SLE Path template generation
 */
import { useState, useCallback, useRef } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import {
  Upload, FileJson, CheckCircle2, XCircle, AlertTriangle,
  Download, Loader2, BookOpen, Layers, FileText, Sparkles,
} from "lucide-react";

// SLE Path template for quick generation
const SLE_PATH_TEMPLATE = {
  title: "Path I — SLE Oral Proficiency (Level B)",
  titleFr: "Parcours I — Compétence orale ELS (Niveau B)",
  description: "Comprehensive preparation for the Second Language Evaluation (SLE) Oral Proficiency Test at Level B. Covers all key competency areas including structured responses, spontaneous conversation, and professional vocabulary.",
  descriptionFr: "Préparation complète pour le test de compétence orale de l'Évaluation de langue seconde (ELS) au niveau B. Couvre tous les domaines de compétence clés, y compris les réponses structurées, la conversation spontanée et le vocabulaire professionnel.",
  shortDescription: "Master SLE Oral Level B with structured practice and expert coaching.",
  shortDescriptionFr: "Maîtrisez le niveau B oral de l'ELS avec une pratique structurée et un coaching expert.",
  category: "sle_oral" as const,
  level: "intermediate" as const,
  targetLanguage: "french" as const,
  pathNumber: 1,
  estimatedHours: 30,
  modules: [
    {
      title: "Module 1: Foundations of Oral Communication",
      titleFr: "Module 1 : Fondements de la communication orale",
      description: "Build core oral communication skills for professional settings.",
      descriptionFr: "Développez les compétences de base en communication orale pour les milieux professionnels.",
      moduleNumber: 1,
      lessons: [
        { title: "Lesson 1: Introduction to SLE Oral", titleFr: "Leçon 1 : Introduction à l'oral ELS", contentType: "video" as const, estimatedMinutes: 15, lessonNumber: 1 },
        { title: "Lesson 2: Professional Greetings & Introductions", titleFr: "Leçon 2 : Salutations et présentations professionnelles", contentType: "video" as const, estimatedMinutes: 20, lessonNumber: 2 },
        { title: "Lesson 3: Describing Your Role & Responsibilities", titleFr: "Leçon 3 : Décrire votre rôle et vos responsabilités", contentType: "video" as const, estimatedMinutes: 20, lessonNumber: 3 },
        { title: "Lesson 4: Module 1 Assessment", titleFr: "Leçon 4 : Évaluation du module 1", contentType: "quiz" as const, estimatedMinutes: 15, lessonNumber: 4 },
      ],
    },
    {
      title: "Module 2: Structured Responses",
      titleFr: "Module 2 : Réponses structurées",
      description: "Learn to construct clear, organized responses to SLE prompts.",
      descriptionFr: "Apprenez à construire des réponses claires et organisées aux questions de l'ELS.",
      moduleNumber: 2,
      lessons: [
        { title: "Lesson 1: The STAR Method in French", titleFr: "Leçon 1 : La méthode STAR en français", contentType: "video" as const, estimatedMinutes: 20, lessonNumber: 1 },
        { title: "Lesson 2: Expressing Opinions & Arguments", titleFr: "Leçon 2 : Exprimer des opinions et des arguments", contentType: "video" as const, estimatedMinutes: 20, lessonNumber: 2 },
        { title: "Lesson 3: Handling Follow-up Questions", titleFr: "Leçon 3 : Gérer les questions de suivi", contentType: "video" as const, estimatedMinutes: 20, lessonNumber: 3 },
        { title: "Lesson 4: Module 2 Assessment", titleFr: "Leçon 4 : Évaluation du module 2", contentType: "quiz" as const, estimatedMinutes: 15, lessonNumber: 4 },
      ],
    },
    {
      title: "Module 3: Spontaneous Conversation",
      titleFr: "Module 3 : Conversation spontanée",
      description: "Develop fluency and confidence in unscripted professional conversations.",
      descriptionFr: "Développez la fluidité et la confiance dans les conversations professionnelles non scriptées.",
      moduleNumber: 3,
      lessons: [
        { title: "Lesson 1: Small Talk & Workplace Topics", titleFr: "Leçon 1 : Bavardage et sujets de travail", contentType: "video" as const, estimatedMinutes: 20, lessonNumber: 1 },
        { title: "Lesson 2: Current Events Discussion", titleFr: "Leçon 2 : Discussion sur l'actualité", contentType: "video" as const, estimatedMinutes: 20, lessonNumber: 2 },
        { title: "Lesson 3: Problem-Solving Scenarios", titleFr: "Leçon 3 : Scénarios de résolution de problèmes", contentType: "video" as const, estimatedMinutes: 20, lessonNumber: 3 },
        { title: "Lesson 4: Module 3 Assessment", titleFr: "Leçon 4 : Évaluation du module 3", contentType: "quiz" as const, estimatedMinutes: 15, lessonNumber: 4 },
      ],
    },
    {
      title: "Module 4: Exam Strategy & Final Review",
      titleFr: "Module 4 : Stratégie d'examen et révision finale",
      description: "Final preparation with mock exams and strategic coaching tips.",
      descriptionFr: "Préparation finale avec des examens simulés et des conseils stratégiques de coaching.",
      moduleNumber: 4,
      lessons: [
        { title: "Lesson 1: SLE Oral Exam Format & Tips", titleFr: "Leçon 1 : Format et conseils pour l'examen oral ELS", contentType: "video" as const, estimatedMinutes: 20, lessonNumber: 1 },
        { title: "Lesson 2: Mock Exam Practice", titleFr: "Leçon 2 : Pratique d'examen simulé", contentType: "video" as const, estimatedMinutes: 30, lessonNumber: 2 },
        { title: "Lesson 3: Common Mistakes & How to Avoid Them", titleFr: "Leçon 3 : Erreurs courantes et comment les éviter", contentType: "video" as const, estimatedMinutes: 20, lessonNumber: 3 },
        { title: "Lesson 4: Final Assessment", titleFr: "Leçon 4 : Évaluation finale", contentType: "quiz" as const, estimatedMinutes: 20, lessonNumber: 4 },
      ],
    },
  ],
};

interface ImportResult {
  success: boolean;
  imported: number;
  failed: number;
  results: { courseId: number; title: string; modulesCreated: number; lessonsCreated: number }[];
  errors: { courseTitle: string; error: string }[];
}

export default function BulkImporter() {
  const [jsonInput, setJsonInput] = useState("");
  const [parsedData, setParsedData] = useState<any[] | null>(null);
  const [parseError, setParseError] = useState<string | null>(null);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const bulkImportMutation = trpc.adminCourses.bulkImport.useMutation({
    onSuccess: (data) => {
      setImportResult(data);
      setShowConfirm(false);
      if (data.success) {
        toast.success(`Successfully imported ${data.imported} course(s)`);
      } else {
        toast.warning(`Imported ${data.imported} course(s) with ${data.failed} error(s)`);
      }
    },
    onError: (error) => {
      toast.error(`Import failed: ${error.message}`);
      setShowConfirm(false);
    },
  });

  const validateAndParse = useCallback((input: string) => {
    try {
      const parsed = JSON.parse(input);
      const courses = Array.isArray(parsed) ? parsed : parsed.courses ? parsed.courses : [parsed];
      
      // Basic validation
      const errors: string[] = [];
      courses.forEach((course: any, i: number) => {
        if (!course.title) errors.push(`Course ${i + 1}: missing title`);
        if (course.modules) {
          course.modules.forEach((mod: any, mi: number) => {
            if (!mod.title) errors.push(`Course ${i + 1}, Module ${mi + 1}: missing title`);
            if (mod.lessons) {
              mod.lessons.forEach((les: any, li: number) => {
                if (!les.title) errors.push(`Course ${i + 1}, Module ${mi + 1}, Lesson ${li + 1}: missing title`);
              });
            }
          });
        }
      });

      if (errors.length > 0) {
        setParseError(`Validation errors:\n${errors.join("\n")}`);
        setParsedData(null);
      } else {
        setParsedData(courses);
        setParseError(null);
      }
    } catch (e: any) {
      setParseError(`JSON parse error: ${e.message}`);
      setParsedData(null);
    }
  }, []);

  const handleFileUpload = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      setJsonInput(text);
      validateAndParse(text);
    };
    reader.readAsText(file);
  }, [validateAndParse]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && (file.name.endsWith(".json") || file.type === "application/json")) {
      handleFileUpload(file);
    } else {
      toast.error("Please upload a JSON file");
    }
  }, [handleFileUpload]);

  const handleLoadTemplate = () => {
    const template = JSON.stringify({ courses: [SLE_PATH_TEMPLATE] }, null, 2);
    setJsonInput(template);
    validateAndParse(template);
    toast.success("SLE Path template loaded — customize and import");
  };

  const handleDownloadTemplate = () => {
    const template = JSON.stringify({ courses: [SLE_PATH_TEMPLATE] }, null, 2);
    const blob = new Blob([template], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sle-path-template.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    if (!parsedData) return;
    setShowConfirm(true);
  };

  const confirmImport = () => {
    if (!parsedData) return;
    bulkImportMutation.mutate({ courses: parsedData });
  };

  // Count totals for preview
  const previewStats = parsedData ? {
    courses: parsedData.length,
    modules: parsedData.reduce((sum, c) => sum + (c.modules?.length || 0), 0),
    lessons: parsedData.reduce((sum, c) => 
      sum + (c.modules?.reduce((ms: number, m: any) => ms + (m.lessons?.length || 0), 0) || 0), 0),
  } : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">Bulk Content Import</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Import courses, modules, and lessons from JSON files
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleLoadTemplate}>
            <Sparkles className="h-4 w-4 mr-2" />
            Load SLE Template
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownloadTemplate}>
            <Download className="h-4 w-4 mr-2" />
            Download Template
          </Button>
        </div>
      </div>

      {/* Drop zone + JSON editor */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Import Data</CardTitle>
          <CardDescription>
            Upload a JSON file or paste JSON content below. The format should include an array of courses with nested modules and lessons.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Drop zone */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
              isDragging
                ? "border-primary bg-primary/5"
                : "border-muted-foreground/25 hover:border-primary/50"
            }`}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
            <p className="text-sm font-medium">
              Drop a JSON file here or click to browse
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Supports .json files with course/module/lesson structure
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json,application/json"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileUpload(file);
              }}
            />
          </div>

          {/* JSON editor */}
          <div>
            <label className="text-sm font-medium mb-1 block">JSON Content</label>
            <Textarea
              value={jsonInput}
              onChange={(e) => {
                setJsonInput(e.target.value);
                if (e.target.value.trim()) {
                  validateAndParse(e.target.value);
                } else {
                  setParsedData(null);
                  setParseError(null);
                }
              }}
              placeholder='{"courses": [{"title": "My Course", "modules": [...]}]}'
              className="font-mono text-xs min-h-[200px]"
            />
          </div>

          {/* Validation status */}
          {parseError && (
            <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
              <XCircle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
              <pre className="text-xs text-red-700 dark:text-red-300 whitespace-pre-wrap">{parseError}</pre>
            </div>
          )}

          {parsedData && previewStats && (
            <div className="space-y-3">
              <div className="flex items-start gap-2 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                <div className="text-sm text-emerald-700 dark:text-emerald-300">
                  <p className="font-medium">Valid JSON — Ready to import</p>
                  <div className="flex gap-4 mt-1 text-xs">
                    <span className="flex items-center gap-1">
                      <BookOpen className="h-3 w-3" /> {previewStats.courses} course(s)
                    </span>
                    <span className="flex items-center gap-1">
                      <Layers className="h-3 w-3" /> {previewStats.modules} module(s)
                    </span>
                    <span className="flex items-center gap-1">
                      <FileText className="h-3 w-3" /> {previewStats.lessons} lesson(s)
                    </span>
                  </div>
                </div>
              </div>

              {/* Preview tree */}
              <div className="border rounded-lg p-3 max-h-60 overflow-y-auto">
                <p className="text-xs font-medium text-muted-foreground mb-2">Preview</p>
                {parsedData.map((course, ci) => (
                  <div key={ci} className="mb-2">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <BookOpen className="h-3.5 w-3.5 text-blue-500" />
                      {course.title}
                      {course.titleFr && (
                        <Badge variant="outline" className="text-[10px] px-1 py-0">FR</Badge>
                      )}
                    </div>
                    {course.modules?.map((mod: any, mi: number) => (
                      <div key={mi} className="ml-5 mt-1">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Layers className="h-3 w-3 text-purple-500" />
                          {mod.title}
                          {mod.titleFr && (
                            <Badge variant="outline" className="text-[9px] px-1 py-0">FR</Badge>
                          )}
                        </div>
                        {mod.lessons?.map((les: any, li: number) => (
                          <div key={li} className="ml-5 mt-0.5 flex items-center gap-2 text-xs text-muted-foreground/70">
                            <FileText className="h-2.5 w-2.5" />
                            {les.title}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              <Button onClick={handleImport} className="w-full">
                <FileJson className="h-4 w-4 mr-2" />
                Import {previewStats.courses} Course(s)
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Import results */}
      {importResult && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              {importResult.success ? (
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-amber-500" />
              )}
              Import Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex gap-4 text-sm">
                <Badge variant="outline" className="bg-emerald-50 text-emerald-700">
                  {importResult.imported} imported
                </Badge>
                {importResult.failed > 0 && (
                  <Badge variant="outline" className="bg-red-50 text-red-700">
                    {importResult.failed} failed
                  </Badge>
                )}
              </div>

              {importResult.results.length > 0 && (
                <div className="border rounded-lg divide-y">
                  {importResult.results.map((r, i) => (
                    <div key={i} className="p-3 flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                        <span className="font-medium">{r.title}</span>
                      </div>
                      <div className="flex gap-2 text-xs text-muted-foreground">
                        <span>{r.modulesCreated} modules</span>
                        <span>{r.lessonsCreated} lessons</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {importResult.errors.length > 0 && (
                <div className="border border-red-200 rounded-lg divide-y divide-red-100">
                  {importResult.errors.map((e, i) => (
                    <div key={i} className="p-3 flex items-center gap-2 text-sm text-red-700">
                      <XCircle className="h-4 w-4 shrink-0" />
                      <span className="font-medium">{e.courseTitle}:</span>
                      <span className="text-xs">{e.error}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Confirmation dialog */}
      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Bulk Import</DialogTitle>
            <DialogDescription>
              This will create {previewStats?.courses} course(s), {previewStats?.modules} module(s), 
              and {previewStats?.lessons} lesson(s) in draft status. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirm(false)}>
              Cancel
            </Button>
            <Button
              onClick={confirmImport}
              disabled={bulkImportMutation.isPending}
            >
              {bulkImportMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Importing...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Confirm Import
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
