import { useState, useMemo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, Target, BookOpen, Clock, Building2, CheckCircle2, Brain, ArrowRight, ArrowLeft, Sparkles } from "lucide-react";

// ============================================================================
// BILINGUAL CONTENT
// ============================================================================
const ui = {
  en: {
    steps: [
      { id: "welcome", title: "Welcome" },
      { id: "context", title: "Your Context" },
      { id: "level", title: "Current Level" },
      { id: "diagnostic", title: "Quick Assessment" },
      { id: "target", title: "Target Level" },
      { id: "goal", title: "Learning Goal" },
      { id: "schedule", title: "Study Schedule" },
      { id: "complete", title: "All Set!" },
    ],
    welcome: {
      title: "Welcome to RusingAcademy",
      subtitle: "Let's personalize your learning experience. This takes about 2 minutes.",
      tagline: "Preparing public servants for bilingual excellence in Canada's federal workplace",
      cta: "Get Started",
    },
    context: {
      title: "Tell us about your workplace",
      subtitle: "This helps us tailor content to your professional context",
      departmentLabel: "Federal Department / Organization",
      departmentPlaceholder: "e.g., Treasury Board, IRCC, DND...",
      positionLabel: "Position / Classification",
      positionPlaceholder: "e.g., EC-05, PM-04, AS-03...",
      languageLabel: "Which language are you learning?",
      french: "French (learning French)",
      english: "English (learning English)",
      focusLabel: "Primary focus area",
      oral: "Oral Communication",
      written: "Written Expression",
      reading: "Reading Comprehension",
      all: "All Skills",
    },
    level: {
      title: "What's your current level?",
      subtitle: "Select the level that best describes your abilities",
    },
    diagnostic: {
      title: "Quick SLE Diagnostic",
      subtitle: "Answer 5 quick questions to estimate your current level",
      question: "Question",
      of: "of",
      result: "Based on your answers, your estimated level is:",
      skipLabel: "Skip diagnostic",
    },
    target: {
      title: "What level do you want to achieve?",
      subtitle: "Set your target for the SLE or personal growth",
    },
    goal: {
      title: "What's your primary learning goal?",
      subtitle: "This helps us recommend the right content for you",
    },
    schedule: {
      title: "How much time can you dedicate?",
      subtitle: "We'll create a study plan that fits your schedule",
    },
    complete: {
      title: "You're All Set!",
      subtitle: "Your personalized learning path is ready. Let's start your journey to bilingual excellence!",
      current: "Current",
      target: "Target",
      perWeek: "/week",
      dashboard: "Go to Dashboard",
      paths: "Browse Learning Paths",
      recommended: "Recommended for you:",
    },
    back: "Back",
    next: "Next",
    saving: "Saving...",
    completeSetup: "Complete Setup",
    selected: "Selected",
    targetBadge: "Target",
    levels: [
      { value: "X", label: "X — No Level", desc: "No formal assessment yet" },
      { value: "A", label: "A — Beginner", desc: "Basic phrases and introductions" },
      { value: "B", label: "B — Intermediate", desc: "Handle most workplace situations" },
      { value: "C", label: "C — Advanced", desc: "Fluent in professional contexts" },
    ],
    goals: [
      { value: "sle_prep", label: "SLE Exam Preparation", icon: "📝", desc: "Prepare for the Second Language Evaluation" },
      { value: "career", label: "Career Advancement", icon: "📈", desc: "Improve bilingual skills for promotion" },
      { value: "communication", label: "Daily Communication", icon: "💬", desc: "Communicate better with colleagues" },
      { value: "reading", label: "Reading & Comprehension", icon: "📚", desc: "Understand French documents and reports" },
      { value: "writing", label: "Written Expression", icon: "✍️", desc: "Write professional French correspondence" },
    ],
    schedules: [
      { hours: 2, time: "morning", label: "Light — 2h/week", desc: "Quick daily sessions", icon: "🌱" },
      { hours: 5, time: "afternoon", label: "Regular — 5h/week", desc: "Steady progress", icon: "📖" },
      { hours: 10, time: "evening", label: "Intensive — 10h/week", desc: "Accelerated learning", icon: "🚀" },
      { hours: 15, time: "flexible", label: "Immersive — 15h/week", desc: "Maximum progress", icon: "⚡" },
    ],
    diagnosticQuestions: [
      {
        q: "How comfortable are you ordering food in French at a restaurant?",
        options: [
          { label: "I cannot do this at all", score: 0 },
          { label: "I can manage with simple words", score: 1 },
          { label: "I can handle it comfortably", score: 2 },
          { label: "I can do this fluently, including special requests", score: 3 },
        ],
      },
      {
        q: "Can you participate in a work meeting conducted in French?",
        options: [
          { label: "I cannot follow the discussion", score: 0 },
          { label: "I understand some points but struggle to contribute", score: 1 },
          { label: "I can follow and contribute on familiar topics", score: 2 },
          { label: "I participate fully and express nuanced opinions", score: 3 },
        ],
      },
      {
        q: "How well can you read a government policy document in French?",
        options: [
          { label: "I cannot understand it", score: 0 },
          { label: "I get the general idea with difficulty", score: 1 },
          { label: "I understand most of it with some effort", score: 2 },
          { label: "I read and analyze it without difficulty", score: 3 },
        ],
      },
      {
        q: "Can you write a professional email in French?",
        options: [
          { label: "Not at all", score: 0 },
          { label: "Very basic messages with many errors", score: 1 },
          { label: "Clear messages with occasional errors", score: 2 },
          { label: "Professional, polished correspondence", score: 3 },
        ],
      },
      {
        q: "How would you describe your overall French proficiency?",
        options: [
          { label: "Absolute beginner", score: 0 },
          { label: "Elementary — I know basics", score: 1 },
          { label: "Intermediate — I manage in most situations", score: 2 },
          { label: "Advanced — I'm fluent and precise", score: 3 },
        ],
      },
    ],
  },
  fr: {
    steps: [
      { id: "welcome", title: "Bienvenue" },
      { id: "context", title: "Votre contexte" },
      { id: "level", title: "Niveau actuel" },
      { id: "diagnostic", title: "Évaluation rapide" },
      { id: "target", title: "Niveau cible" },
      { id: "goal", title: "Objectif" },
      { id: "schedule", title: "Horaire d'étude" },
      { id: "complete", title: "Tout est prêt !" },
    ],
    welcome: {
      title: "Bienvenue à RusingAcademy",
      subtitle: "Personnalisons votre expérience d'apprentissage. Cela prend environ 2 minutes.",
      tagline: "Préparer les fonctionnaires à l'excellence bilingue dans la fonction publique fédérale du Canada",
      cta: "Commencer",
    },
    context: {
      title: "Parlez-nous de votre milieu de travail",
      subtitle: "Cela nous aide à adapter le contenu à votre contexte professionnel",
      departmentLabel: "Ministère / Organisation fédérale",
      departmentPlaceholder: "ex. : Conseil du Trésor, IRCC, MDN...",
      positionLabel: "Poste / Classification",
      positionPlaceholder: "ex. : EC-05, PM-04, AS-03...",
      languageLabel: "Quelle langue apprenez-vous ?",
      french: "Français (j'apprends le français)",
      english: "Anglais (j'apprends l'anglais)",
      focusLabel: "Domaine de concentration principal",
      oral: "Communication orale",
      written: "Expression écrite",
      reading: "Compréhension de lecture",
      all: "Toutes les compétences",
    },
    level: {
      title: "Quel est votre niveau actuel ?",
      subtitle: "Sélectionnez le niveau qui décrit le mieux vos compétences",
    },
    diagnostic: {
      title: "Diagnostic SLE rapide",
      subtitle: "Répondez à 5 questions rapides pour estimer votre niveau actuel",
      question: "Question",
      of: "de",
      result: "Selon vos réponses, votre niveau estimé est :",
      skipLabel: "Passer le diagnostic",
    },
    target: {
      title: "Quel niveau souhaitez-vous atteindre ?",
      subtitle: "Fixez votre objectif pour l'ELS ou votre développement personnel",
    },
    goal: {
      title: "Quel est votre objectif principal ?",
      subtitle: "Cela nous aide à vous recommander le bon contenu",
    },
    schedule: {
      title: "Combien de temps pouvez-vous consacrer ?",
      subtitle: "Nous créerons un plan d'étude adapté à votre horaire",
    },
    complete: {
      title: "Tout est prêt !",
      subtitle: "Votre parcours d'apprentissage personnalisé est prêt. Commençons votre voyage vers l'excellence bilingue !",
      current: "Actuel",
      target: "Cible",
      perWeek: "/semaine",
      dashboard: "Aller au tableau de bord",
      paths: "Parcourir les parcours",
      recommended: "Recommandé pour vous :",
    },
    back: "Retour",
    next: "Suivant",
    saving: "Enregistrement...",
    completeSetup: "Terminer la configuration",
    selected: "Sélectionné",
    targetBadge: "Cible",
    levels: [
      { value: "X", label: "X — Aucun niveau", desc: "Aucune évaluation formelle encore" },
      { value: "A", label: "A — Débutant", desc: "Phrases de base et présentations" },
      { value: "B", label: "B — Intermédiaire", desc: "Gérer la plupart des situations de travail" },
      { value: "C", label: "C — Avancé", desc: "Courant dans les contextes professionnels" },
    ],
    goals: [
      { value: "sle_prep", label: "Préparation à l'ELS", icon: "📝", desc: "Se préparer à l'Évaluation de langue seconde" },
      { value: "career", label: "Avancement de carrière", icon: "📈", desc: "Améliorer les compétences bilingues pour la promotion" },
      { value: "communication", label: "Communication quotidienne", icon: "💬", desc: "Mieux communiquer avec les collègues" },
      { value: "reading", label: "Lecture et compréhension", icon: "📚", desc: "Comprendre les documents et rapports en français" },
      { value: "writing", label: "Expression écrite", icon: "✍️", desc: "Rédiger de la correspondance professionnelle en français" },
    ],
    schedules: [
      { hours: 2, time: "morning", label: "Léger — 2h/semaine", desc: "Séances quotidiennes rapides", icon: "🌱" },
      { hours: 5, time: "afternoon", label: "Régulier — 5h/semaine", desc: "Progrès constants", icon: "📖" },
      { hours: 10, time: "evening", label: "Intensif — 10h/semaine", desc: "Apprentissage accéléré", icon: "🚀" },
      { hours: 15, time: "flexible", label: "Immersif — 15h/semaine", desc: "Progrès maximum", icon: "⚡" },
    ],
    diagnosticQuestions: [
      {
        q: "À quel point êtes-vous à l'aise pour commander au restaurant en français ?",
        options: [
          { label: "Je ne peux pas du tout", score: 0 },
          { label: "Je me débrouille avec des mots simples", score: 1 },
          { label: "Je gère confortablement", score: 2 },
          { label: "Je le fais couramment, y compris les demandes spéciales", score: 3 },
        ],
      },
      {
        q: "Pouvez-vous participer à une réunion de travail en français ?",
        options: [
          { label: "Je ne peux pas suivre la discussion", score: 0 },
          { label: "Je comprends certains points mais j'ai du mal à contribuer", score: 1 },
          { label: "Je peux suivre et contribuer sur des sujets familiers", score: 2 },
          { label: "Je participe pleinement et exprime des opinions nuancées", score: 3 },
        ],
      },
      {
        q: "Comment lisez-vous un document de politique gouvernementale en français ?",
        options: [
          { label: "Je ne peux pas le comprendre", score: 0 },
          { label: "Je saisis l'idée générale avec difficulté", score: 1 },
          { label: "Je comprends la plupart avec un certain effort", score: 2 },
          { label: "Je lis et analyse sans difficulté", score: 3 },
        ],
      },
      {
        q: "Pouvez-vous rédiger un courriel professionnel en français ?",
        options: [
          { label: "Pas du tout", score: 0 },
          { label: "Messages très basiques avec beaucoup d'erreurs", score: 1 },
          { label: "Messages clairs avec des erreurs occasionnelles", score: 2 },
          { label: "Correspondance professionnelle et soignée", score: 3 },
        ],
      },
      {
        q: "Comment décririez-vous votre maîtrise globale du français ?",
        options: [
          { label: "Débutant absolu", score: 0 },
          { label: "Élémentaire — je connais les bases", score: 1 },
          { label: "Intermédiaire — je me débrouille dans la plupart des situations", score: 2 },
          { label: "Avancé — je suis courant et précis", score: 3 },
        ],
      },
    ],
  },
};

// ============================================================================
// DIAGNOSTIC SCORING
// ============================================================================
function scoreToLevel(totalScore: number): string {
  if (totalScore <= 3) return "X";
  if (totalScore <= 7) return "A";
  if (totalScore <= 11) return "B";
  return "C";
}

function getRecommendedPath(goal: string, level: string): { en: string; fr: string } {
  if (goal === "sle_prep") {
    if (level === "X" || level === "A") return { en: "SLE Foundations — Build your base for the exam", fr: "Fondations ELS — Construisez votre base pour l'examen" };
    if (level === "B") return { en: "SLE Mastery — Sharpen skills for B→C advancement", fr: "Maîtrise ELS — Affinez vos compétences pour passer de B à C" };
    return { en: "SLE Excellence — Maintain and perfect your C level", fr: "Excellence ELS — Maintenez et perfectionnez votre niveau C" };
  }
  if (goal === "career") return { en: "Professional Bilingualism — Advance your career", fr: "Bilinguisme professionnel — Faites avancer votre carrière" };
  if (goal === "communication") return { en: "Workplace Communication — Daily French confidence", fr: "Communication au travail — Confiance quotidienne en français" };
  if (goal === "reading") return { en: "Reading Mastery — Understand complex French texts", fr: "Maîtrise de la lecture — Comprendre des textes français complexes" };
  return { en: "Written Expression — Professional French writing", fr: "Expression écrite — Rédaction professionnelle en français" };
}

// ============================================================================
// COMPONENT
// ============================================================================
export default function OnboardingWizard() {
  const { language } = useLanguage();
  const lang = language === "fr" ? "fr" : "en";
  const t = ui[lang];
  const [, navigate] = useLocation();

  // Step state
  const [step, setStep] = useState(0);

  // Context step
  const [department, setDepartment] = useState("");
  const [position, setPosition] = useState("");
  const [targetLanguage, setTargetLanguage] = useState<"french" | "english">("french");
  const [primaryFocus, setPrimaryFocus] = useState<"oral" | "written" | "reading" | "all">("oral");

  // Level step
  const [currentLevel, setCurrentLevel] = useState("A");
  const [targetLevel, setTargetLevel] = useState("B");

  // Diagnostic step
  const [diagnosticAnswers, setDiagnosticAnswers] = useState<number[]>([]);
  const [diagnosticQuestion, setDiagnosticQuestion] = useState(0);
  const [diagnosticComplete, setDiagnosticComplete] = useState(false);
  const [diagnosticSkipped, setDiagnosticSkipped] = useState(false);

  // Goal & schedule
  const [learningGoal, setLearningGoal] = useState("sle_prep");
  const [weeklyHours, setWeeklyHours] = useState(5);
  const [preferredTime, setPreferredTime] = useState("afternoon");

  // Computed diagnostic level
  const diagnosticLevel = useMemo(() => {
    if (diagnosticSkipped || diagnosticAnswers.length < 5) return null;
    const total = diagnosticAnswers.reduce((a, b) => a + b, 0);
    return scoreToLevel(total);
  }, [diagnosticAnswers, diagnosticSkipped]);

  const diagnosticScore = useMemo(() => {
    return diagnosticAnswers.reduce((a, b) => a + b, 0);
  }, [diagnosticAnswers]);

  const saveProfile = trpc.learner.saveOnboarding.useMutation({
    onSuccess: () => {
      toast.success(lang === "fr" ? "Profil enregistré ! Bienvenue à RusingAcademy !" : "Profile saved! Welcome to RusingAcademy!");
      setStep(t.steps.length - 1);
    },
    onError: () => {
      toast.error(lang === "fr" ? "Erreur lors de l'enregistrement" : "Error saving profile");
    },
  });

  const handleComplete = () => {
    saveProfile.mutate({
      currentLevel: diagnosticLevel || currentLevel,
      targetLevel,
      learningGoal,
      weeklyHours,
      preferredTime,
      department: department || undefined,
      position: position || undefined,
      targetLanguage,
      primaryFocus,
      diagnosticScore: diagnosticSkipped ? undefined : diagnosticScore,
      diagnosticLevel: diagnosticLevel || undefined,
    });
  };

  const handleDiagnosticAnswer = (score: number) => {
    const newAnswers = [...diagnosticAnswers, score];
    setDiagnosticAnswers(newAnswers);
    if (diagnosticQuestion < 4) {
      setDiagnosticQuestion(diagnosticQuestion + 1);
    } else {
      setDiagnosticComplete(true);
      // Auto-set current level based on diagnostic
      const estimatedLevel = scoreToLevel(newAnswers.reduce((a, b) => a + b, 0));
      setCurrentLevel(estimatedLevel);
    }
  };

  const recommended = getRecommendedPath(learningGoal, diagnosticLevel || currentLevel);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-6">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
            {t.steps.map((s, i) => (
              <span key={s.id} className={`hidden sm:inline ${i <= step ? "text-primary font-medium" : ""}`}>
                {s.title}
              </span>
            ))}
            <span className="sm:hidden">{t.steps[step]?.title} ({step + 1}/{t.steps.length})</span>
          </div>
          <div className="flex items-center gap-1">
            {t.steps.map((s, i) => (
              <div key={s.id} className="flex-1">
                <div className={`h-2 rounded-full transition-all duration-300 ${i <= step ? "bg-primary" : "bg-muted"}`} />
              </div>
            ))}
          </div>
        </div>

        {/* Step 0: Welcome */}
        {step === 0 && (
          <Card className="border-0 shadow-lg">
            <CardContent className="py-12 text-center space-y-6">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10">
                <GraduationCap className="w-10 h-10 text-primary" />
              </div>
              <h1 className="text-3xl font-bold">{t.welcome.title}</h1>
              <p className="text-lg text-muted-foreground max-w-md mx-auto">
                {t.welcome.subtitle}
              </p>
              <p className="text-sm text-muted-foreground">
                {t.welcome.tagline}
              </p>
              <Button size="lg" onClick={() => setStep(1)} className="gap-2">
                {t.welcome.cta} <ArrowRight className="w-4 h-4" />
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 1: Context (Department, Position, Target Language, Focus) */}
        {step === 1 && (
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Building2 className="w-5 h-5 text-primary" />
                {t.context.title}
              </CardTitle>
              <p className="text-muted-foreground">{t.context.subtitle}</p>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* Department */}
              <div className="space-y-2">
                <label className="text-sm font-medium">{t.context.departmentLabel}</label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder={t.context.departmentPlaceholder}
                  className="w-full px-3 py-2 border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              {/* Position */}
              <div className="space-y-2">
                <label className="text-sm font-medium">{t.context.positionLabel}</label>
                <input
                  type="text"
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  placeholder={t.context.positionPlaceholder}
                  className="w-full px-3 py-2 border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              {/* Target Language */}
              <div className="space-y-2">
                <label className="text-sm font-medium">{t.context.languageLabel}</label>
                <div className="grid grid-cols-2 gap-3">
                  {(["french", "english"] as const).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => setTargetLanguage(lang)}
                      className={`p-3 rounded-lg border text-sm text-left transition-all ${
                        targetLanguage === lang
                          ? "border-primary bg-primary/10 ring-1 ring-primary"
                          : "hover:border-primary/50"
                      }`}
                    >
                      {lang === "french" ? t.context.french : t.context.english}
                    </button>
                  ))}
                </div>
              </div>

              {/* Primary Focus */}
              <div className="space-y-2">
                <label className="text-sm font-medium">{t.context.focusLabel}</label>
                <div className="grid grid-cols-2 gap-3">
                  {(["oral", "written", "reading", "all"] as const).map((focus) => (
                    <button
                      key={focus}
                      onClick={() => setPrimaryFocus(focus)}
                      className={`p-3 rounded-lg border text-sm text-left transition-all ${
                        primaryFocus === focus
                          ? "border-primary bg-primary/10 ring-1 ring-primary"
                          : "hover:border-primary/50"
                      }`}
                    >
                      {t.context[focus]}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <Button variant="ghost" onClick={() => setStep(0)} className="gap-1">
                  <ArrowLeft className="w-4 h-4" /> {t.back}
                </Button>
                <Button onClick={() => setStep(2)} className="gap-1">
                  {t.next} <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Current Level */}
        {step === 2 && (
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                {t.level.title}
              </CardTitle>
              <p className="text-muted-foreground">{t.level.subtitle}</p>
            </CardHeader>
            <CardContent className="space-y-3">
              {t.levels.map((level) => (
                <button
                  key={level.value}
                  onClick={() => setCurrentLevel(level.value)}
                  className={`w-full text-left p-4 rounded-lg border transition-all ${
                    currentLevel === level.value
                      ? "border-primary bg-primary/10 ring-1 ring-primary"
                      : "hover:border-primary/50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{level.label}</h4>
                      <p className="text-sm text-muted-foreground">{level.desc}</p>
                    </div>
                    {currentLevel === level.value && <Badge>{t.selected}</Badge>}
                  </div>
                </button>
              ))}
              <div className="flex justify-between pt-4">
                <Button variant="ghost" onClick={() => setStep(1)} className="gap-1">
                  <ArrowLeft className="w-4 h-4" /> {t.back}
                </Button>
                <Button onClick={() => setStep(3)} className="gap-1">
                  {t.next} <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Diagnostic Quiz */}
        {step === 3 && (
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Brain className="w-5 h-5 text-primary" />
                {t.diagnostic.title}
              </CardTitle>
              <p className="text-muted-foreground">{t.diagnostic.subtitle}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              {!diagnosticComplete && !diagnosticSkipped ? (
                <>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{t.diagnostic.question} {diagnosticQuestion + 1} {t.diagnostic.of} 5</span>
                    <div className="flex gap-1">
                      {[0, 1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className={`w-8 h-1.5 rounded-full ${i <= diagnosticQuestion ? "bg-primary" : "bg-muted"}`}
                        />
                      ))}
                    </div>
                  </div>
                  <h3 className="text-lg font-medium">{t.diagnosticQuestions[diagnosticQuestion].q}</h3>
                  <div className="space-y-2">
                    {t.diagnosticQuestions[diagnosticQuestion].options.map((opt, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleDiagnosticAnswer(opt.score)}
                        className="w-full text-left p-4 rounded-lg border hover:border-primary/50 hover:bg-primary/5 transition-all"
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                  <div className="flex justify-between pt-2">
                    <Button variant="ghost" onClick={() => setStep(2)} className="gap-1">
                      <ArrowLeft className="w-4 h-4" /> {t.back}
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setDiagnosticSkipped(true);
                      }}
                      className="text-muted-foreground"
                    >
                      {t.diagnostic.skipLabel}
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  {diagnosticLevel && !diagnosticSkipped && (
                    <div className="text-center space-y-4 py-4">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
                        <Sparkles className="w-8 h-8 text-primary" />
                      </div>
                      <p className="text-muted-foreground">{t.diagnostic.result}</p>
                      <div className="text-4xl font-bold text-primary">
                        {t.levels.find((l) => l.value === diagnosticLevel)?.label || diagnosticLevel}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Score: {diagnosticScore}/15
                      </p>
                    </div>
                  )}
                  {diagnosticSkipped && (
                    <div className="text-center py-4 text-muted-foreground">
                      {lang === "fr" ? "Diagnostic passé. Votre niveau auto-déclaré sera utilisé." : "Diagnostic skipped. Your self-reported level will be used."}
                    </div>
                  )}
                  <div className="flex justify-between pt-4">
                    <Button variant="ghost" onClick={() => setStep(2)} className="gap-1">
                      <ArrowLeft className="w-4 h-4" /> {t.back}
                    </Button>
                    <Button onClick={() => setStep(4)} className="gap-1">
                      {t.next} <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        )}

        {/* Step 4: Target Level */}
        {step === 4 && (
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                {t.target.title}
              </CardTitle>
              <p className="text-muted-foreground">{t.target.subtitle}</p>
            </CardHeader>
            <CardContent className="space-y-3">
              {t.levels
                .filter((l) => l.value > (diagnosticLevel || currentLevel))
                .map((level) => (
                  <button
                    key={level.value}
                    onClick={() => setTargetLevel(level.value)}
                    className={`w-full text-left p-4 rounded-lg border transition-all ${
                      targetLevel === level.value
                        ? "border-primary bg-primary/10 ring-1 ring-primary"
                        : "hover:border-primary/50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{level.label}</h4>
                        <p className="text-sm text-muted-foreground">{level.desc}</p>
                      </div>
                      {targetLevel === level.value && <Badge>{t.targetBadge}</Badge>}
                    </div>
                  </button>
                ))}
              {t.levels.filter((l) => l.value > (diagnosticLevel || currentLevel)).length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  {lang === "fr"
                    ? "Vous êtes déjà au niveau le plus élevé ! Concentrez-vous sur le perfectionnement."
                    : "You're already at the highest level! Focus on refinement and mastery."}
                </div>
              )}
              <div className="flex justify-between pt-4">
                <Button variant="ghost" onClick={() => setStep(3)} className="gap-1">
                  <ArrowLeft className="w-4 h-4" /> {t.back}
                </Button>
                <Button onClick={() => setStep(5)} className="gap-1">
                  {t.next} <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 5: Learning Goal */}
        {step === 5 && (
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl">{t.goal.title}</CardTitle>
              <p className="text-muted-foreground">{t.goal.subtitle}</p>
            </CardHeader>
            <CardContent className="space-y-3">
              {t.goals.map((goal) => (
                <button
                  key={goal.value}
                  onClick={() => setLearningGoal(goal.value)}
                  className={`w-full text-left p-4 rounded-lg border transition-all ${
                    learningGoal === goal.value
                      ? "border-primary bg-primary/10 ring-1 ring-primary"
                      : "hover:border-primary/50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{goal.icon}</span>
                    <div>
                      <h4 className="font-medium">{goal.label}</h4>
                      <p className="text-sm text-muted-foreground">{goal.desc}</p>
                    </div>
                  </div>
                </button>
              ))}
              <div className="flex justify-between pt-4">
                <Button variant="ghost" onClick={() => setStep(4)} className="gap-1">
                  <ArrowLeft className="w-4 h-4" /> {t.back}
                </Button>
                <Button onClick={() => setStep(6)} className="gap-1">
                  {t.next} <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 6: Schedule */}
        {step === 6 && (
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                {t.schedule.title}
              </CardTitle>
              <p className="text-muted-foreground">{t.schedule.subtitle}</p>
            </CardHeader>
            <CardContent className="space-y-3">
              {t.schedules.map((schedule) => (
                <button
                  key={schedule.hours}
                  onClick={() => {
                    setWeeklyHours(schedule.hours);
                    setPreferredTime(schedule.time);
                  }}
                  className={`w-full text-left p-4 rounded-lg border transition-all ${
                    weeklyHours === schedule.hours
                      ? "border-primary bg-primary/10 ring-1 ring-primary"
                      : "hover:border-primary/50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{schedule.icon}</span>
                    <div>
                      <h4 className="font-medium">{schedule.label}</h4>
                      <p className="text-sm text-muted-foreground">{schedule.desc}</p>
                    </div>
                  </div>
                </button>
              ))}
              <div className="flex justify-between pt-4">
                <Button variant="ghost" onClick={() => setStep(5)} className="gap-1">
                  <ArrowLeft className="w-4 h-4" /> {t.back}
                </Button>
                <Button onClick={handleComplete} disabled={saveProfile.isPending} className="gap-1">
                  {saveProfile.isPending ? t.saving : t.completeSetup}
                  {!saveProfile.isPending && <CheckCircle2 className="w-4 h-4" />}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 7: Complete */}
        {step === t.steps.length - 1 && (
          <Card className="border-0 shadow-lg">
            <CardContent className="py-12 text-center space-y-6">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30">
                <CheckCircle2 className="w-10 h-10 text-green-600" />
              </div>
              <h1 className="text-3xl font-bold">{t.complete.title}</h1>
              <p className="text-lg text-muted-foreground max-w-md mx-auto">
                {t.complete.subtitle}
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                <Badge variant="secondary">
                  {t.complete.current}: {diagnosticLevel || currentLevel}
                </Badge>
                <Badge>
                  {t.complete.target}: {targetLevel}
                </Badge>
                <Badge variant="outline">
                  {weeklyHours}h{t.complete.perWeek}
                </Badge>
                {department && <Badge variant="outline">{department}</Badge>}
              </div>

              {/* Personalized Recommendation */}
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 max-w-md mx-auto">
                <p className="text-sm font-medium text-primary mb-1">{t.complete.recommended}</p>
                <p className="text-sm text-muted-foreground">{recommended[lang]}</p>
              </div>

              <div className="flex gap-3 justify-center">
                <Button variant="outline" onClick={() => navigate("/dashboard")}>
                  {t.complete.dashboard}
                </Button>
                <Button onClick={() => navigate("/paths")} className="gap-1">
                  {t.complete.paths} <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
