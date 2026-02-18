/**
 * Writing Portfolio — Submit writing exercises and get AI feedback
 * Wave F: Full bilingual (EN/FR), WCAG 2.1 AA accessibility, professional empty states
 */
import DashboardLayout from "@/components/DashboardLayout";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";

const CEFR_LEVELS = ["A1", "A2", "B1", "B2", "C1"] as const;
const WRITING_PROMPTS = [
  { level: "A1", fr: "Décrivez votre routine quotidienne au bureau.", en: "Describe your daily office routine." },
  { level: "A2", fr: "Écrivez un courriel à un collègue pour organiser une réunion.", en: "Write an email to a colleague to organize a meeting." },
  { level: "B1", fr: "Rédigez un rapport sur les avantages du bilinguisme dans la fonction publique.", en: "Write a report on the benefits of bilingualism in the public service." },
  { level: "B2", fr: "Analysez les défis de la mise en œuvre des politiques linguistiques au Canada.", en: "Analyze the challenges of implementing language policies in Canada." },
  { level: "C1", fr: "Rédigez une note de service proposant des améliorations au programme de formation linguistique.", en: "Draft a briefing note proposing improvements to the language training program." },
];

type FeedbackData = {
  score: number;
  grammar: { score: number; feedback: string };
  vocabulary: { score: number; feedback: string };
  coherence: { score: number; feedback: string };
  suggestions: string[];
  highlights: string[];
  overallFeedback: string;
};

export default function WritingPortfolio() {
  const { user } = useAuth();
  const { t, language: uiLang } = useLanguage();
  const isFr = uiLang === "fr";
  const [view, setView] = useState<"list" | "editor" | "detail">("list");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [language, setLanguage] = useState<"en" | "fr">("fr");
  const [cefrLevel, setCefrLevel] = useState<string>("B1");
  const [feedback, setFeedback] = useState<FeedbackData | null>(null);
  const [selectedSubmission, setSelectedSubmission] = useState<number | null>(null);
  const [writingStartTime, setWritingStartTime] = useState<number | null>(null);
  const [writingElapsed, setWritingElapsed] = useState(0);
  const writingTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Writing timer (Sprint F3)
  useEffect(() => {
    if (view === "editor" && writingStartTime) {
      writingTimerRef.current = setInterval(() => {
        setWritingElapsed(Math.floor((Date.now() - writingStartTime) / 1000));
      }, 1000);
    }
    return () => { if (writingTimerRef.current) clearInterval(writingTimerRef.current); };
  }, [view, writingStartTime]);

  const formatWritingTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const WORD_TARGETS: Record<string, number> = { A1: 50, A2: 100, B1: 150, B2: 250, C1: 400 };

  const submissions = trpc.writing.list.useQuery();
  const submission = trpc.writing.get.useQuery({ id: selectedSubmission! }, { enabled: !!selectedSubmission });
  const utils = trpc.useUtils();

  const createMutation = trpc.writing.create.useMutation({
    onSuccess: () => {
      utils.writing.list.invalidate();
      resetEditor();
      toast.success(isFr ? "Soumission enregistrée !" : "Submission saved!");
    },
  });

  const updateMutation = trpc.writing.update.useMutation({
    onSuccess: () => {
      utils.writing.list.invalidate();
      utils.writing.get.invalidate();
      toast.success(isFr ? "Soumission mise à jour !" : "Submission updated!");
    },
  });

  const deleteMutation = trpc.writing.delete.useMutation({
    onSuccess: () => {
      utils.writing.list.invalidate();
      setView("list");
      toast.success(isFr ? "Soumission supprimée" : "Submission deleted");
    },
  });

  const feedbackMutation = trpc.writing.getAIFeedback.useMutation({
    onSuccess: (data) => {
      setFeedback(data as FeedbackData);
      utils.writing.list.invalidate();
      utils.writing.get.invalidate();
      toast.success(isFr ? "Retour IA reçu !" : "AI feedback received!");
    },
  });

  const resetEditor = () => {
    setView("list");
    setEditingId(null);
    setTitle("");
    setContent("");
    setFeedback(null);
  };

  const handleSave = () => {
    if (editingId) {
      updateMutation.mutate({ id: editingId, title, content });
    } else {
      createMutation.mutate({ title, content, language, cefrLevel: cefrLevel as any });
    }
  };

  const handleSubmitForFeedback = (submissionId: number, text: string) => {
    feedbackMutation.mutate({ submissionId, content: text, language, cefrLevel });
  };

  const openDetail = (id: number) => {
    setSelectedSubmission(id);
    setView("detail");
  };

  const openEditor = (prompt?: typeof WRITING_PROMPTS[0]) => {
    setTitle(prompt ? (language === "fr" ? prompt.fr : prompt.en) : "");
    setContent("");
    setCefrLevel(prompt?.level || "B1");
    setEditingId(null);
    setFeedback(null);
    setWritingStartTime(Date.now());
    setWritingElapsed(0);
    setView("editor");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft": return "bg-gray-100 dark:bg-white/[0.08] dark:backdrop-blur-md dark:border-white/15 text-gray-600";
      case "submitted": return "bg-blue-100 text-blue-700";
      case "reviewed": return "bg-green-100 text-green-700";
      default: return "bg-gray-100 dark:bg-white/[0.08] dark:backdrop-blur-md dark:border-white/15 text-gray-600";
    }
  };

  const statusLabel = (status: string) => {
    const labels: Record<string, { en: string; fr: string }> = {
      draft: { en: "Draft", fr: "Brouillon" },
      submitted: { en: "Submitted", fr: "Soumis" },
      reviewed: { en: "Reviewed", fr: "Révisé" },
    };
    return labels[status] ? (isFr ? labels[status].fr : labels[status].en) : status;
  };

  const ScoreBar = ({ label, score, color }: { label: string; score: number; color: string }) => (
    <div className="mb-3" role="meter" aria-valuenow={score} aria-valuemin={0} aria-valuemax={100} aria-label={`${label}: ${score}/100`}>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-gray-600">{label}</span>
        <span className="font-semibold" style={{ color }}>{score}/100</span>
      </div>
      <div className="h-2 bg-gray-100 dark:bg-white/[0.08] dark:backdrop-blur-md dark:border-white/15 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${score}%`, background: color }} />
      </div>
    </div>
  );

  /* ─── DETAIL VIEW ─── */
  if (view === "detail" && selectedSubmission) {
    const s = submission.data;
    const fb = s?.aiFeedback ? JSON.parse(s.aiFeedback) as FeedbackData : null;
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto px-4 py-6">
          <button onClick={resetEditor}
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-teal-700 mb-4 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-700/30 rounded"
            aria-label={isFr ? "Retour au portfolio" : "Back to Portfolio"}>
            <span className="material-icons text-lg" aria-hidden="true">arrow_back</span>
            {isFr ? "Retour au portfolio" : "Back to Portfolio"}
          </button>
          {submission.isLoading ? (
            <div className="space-y-4" role="status" aria-label={t("skillLabs.loading")}>
              {[1,2,3].map(i => <div key={i} className="h-20 bg-gray-100 dark:bg-white/[0.08] dark:backdrop-blur-md dark:border-white/15 rounded-xl animate-pulse" />)}
              <span className="sr-only">{t("skillLabs.loading")}</span>
            </div>
          ) : s ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2">
                <article className="bg-white dark:bg-white/[0.08] dark:backdrop-blur-md border border-gray-200 dark:border-white/15 dark:border-white/15 rounded-xl p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h1 className="text-xl font-bold text-gray-900">{s.title}</h1>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${getStatusColor(s.status)}`}>{statusLabel(s.status)}</span>
                      <button onClick={() => { if (confirm(isFr ? "Supprimer ?" : "Delete?")) deleteMutation.mutate({ id: s.id }); }}
                        className="text-gray-400 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-red-300 rounded"
                        aria-label={isFr ? "Supprimer la soumission" : "Delete submission"}>
                        <span className="material-icons text-lg" aria-hidden="true">delete</span>
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 mb-4 text-[11px] text-gray-400">
                    {s.cefrLevel && <span className="px-2 py-0.5 bg-teal-700/10 text-teal-700 rounded-full font-medium">{s.cefrLevel}</span>}
                    <span>{s.wordCount} {isFr ? "mots" : "words"}</span>
                    <span>{new Date(s.createdAt).toLocaleDateString(isFr ? "fr-CA" : "en-CA")}</span>
                  </div>
                  <div className="prose prose-sm max-w-none text-gray-700 dark:text-muted-foreground whitespace-pre-wrap">{s.content}</div>
                </article>
                {!fb && s.status !== "reviewed" && (
                  <button
                    onClick={() => handleSubmitForFeedback(s.id, s.content)}
                    disabled={feedbackMutation.isPending}
                    className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-teal-700 to-[#006d7a] text-white text-sm rounded-xl hover:opacity-90 disabled:opacity-50 transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-700/30"
                  >
                    <span className="material-icons text-lg" aria-hidden="true">auto_awesome</span>
                    {feedbackMutation.isPending
                      ? (isFr ? "Analyse en cours..." : "Analyzing your writing...")
                      : t("writing.getAIFeedback")}
                  </button>
                )}
              </div>
              {fb && (
                <div className="space-y-4" role="region" aria-label={isFr ? "Retour IA" : "AI Feedback"}>
                  <div className="bg-white dark:bg-white/[0.08] dark:backdrop-blur-md border border-gray-200 dark:border-white/15 dark:border-white/15 rounded-xl p-5 shadow-sm">
                    <div className="text-center mb-4">
                      <div className="text-lg md:text-2xl lg:text-3xl font-bold text-teal-700">{fb.score}</div>
                      <div className="text-[10px] text-gray-400 uppercase tracking-wider">{isFr ? "Score global" : "Overall Score"}</div>
                    </div>
                    <ScoreBar label={isFr ? "Grammaire" : "Grammar"} score={fb.grammar.score} color="var(--color-blue-500, var(--semantic-info))" />
                    <ScoreBar label={isFr ? "Vocabulaire" : "Vocabulary"} score={fb.vocabulary.score} color="var(--color-violet-500, var(--accent-purple))" />
                    <ScoreBar label={isFr ? "Cohérence" : "Coherence"} score={fb.coherence.score} color="var(--semantic-success, var(--success))" />
                  </div>
                  <div className="bg-white dark:bg-white/[0.08] dark:backdrop-blur-md border border-gray-200 dark:border-white/15 dark:border-white/15 rounded-xl p-5 shadow-sm">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-foreground mb-2">{isFr ? "Commentaires" : "Feedback"}</h3>
                    <p className="text-xs text-gray-600 leading-relaxed">{fb.overallFeedback}</p>
                  </div>
                  {fb.highlights.length > 0 && (
                    <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                      <h3 className="text-sm font-semibold text-green-800 mb-2 flex items-center gap-1">
                        <span className="material-icons text-base" aria-hidden="true">thumb_up</span> {isFr ? "Points forts" : "Strengths"}
                      </h3>
                      <ul className="space-y-1" role="list">{fb.highlights.map((h, i) => <li key={i} className="text-xs text-green-700">• {h}</li>)}</ul>
                    </div>
                  )}
                  {fb.suggestions.length > 0 && (
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                      <h3 className="text-sm font-semibold text-amber-800 mb-2 flex items-center gap-1">
                        <span className="material-icons text-base" aria-hidden="true">lightbulb</span> {isFr ? "Suggestions" : "Suggestions"}
                      </h3>
                      <ul className="space-y-1" role="list">{fb.suggestions.map((s, i) => <li key={i} className="text-xs text-amber-700">• {s}</li>)}</ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : null}
        </div>
      </DashboardLayout>
    );
  }

  /* ─── EDITOR VIEW ─── */
  if (view === "editor") {
    return (
      <DashboardLayout>
        <div className="max-w-3xl mx-auto px-4 py-6">
          <button onClick={resetEditor}
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-teal-700 mb-4 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-700/30 rounded"
            aria-label={isFr ? "Retour au portfolio" : "Back to Portfolio"}>
            <span className="material-icons text-lg" aria-hidden="true">arrow_back</span>
            {isFr ? "Retour au portfolio" : "Back to Portfolio"}
          </button>
          <div className="bg-white dark:bg-white/[0.08] dark:backdrop-blur-md border border-gray-200 dark:border-white/15 dark:border-white/15 rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 dark:text-foreground mb-4">
              {editingId
                ? (isFr ? "Modifier la soumission" : "Edit Submission")
                : (isFr ? "Nouvel exercice d'écriture" : "New Writing Exercise")}
            </h2>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <label htmlFor="writing-lang" className="sr-only">{isFr ? "Langue" : "Language"}</label>
                <select id="writing-lang" value={language} onChange={(e) => setLanguage(e.target.value as any)}
                  className="w-full border border-gray-200 dark:border-white/15 dark:border-white/15 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-700/30">
                  <option value="fr">{isFr ? "Français" : "French"}</option>
                  <option value="en">{isFr ? "Anglais" : "English"}</option>
                </select>
              </div>
              <div>
                <label htmlFor="writing-level" className="sr-only">{isFr ? "Niveau CECR" : "CEFR Level"}</label>
                <select id="writing-level" value={cefrLevel} onChange={(e) => setCefrLevel(e.target.value)}
                  className="w-full border border-gray-200 dark:border-white/15 dark:border-white/15 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-700/30">
                  {CEFR_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
            </div>
            <label htmlFor="writing-title" className="sr-only">{isFr ? "Titre" : "Title"}</label>
            <input
              id="writing-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={isFr ? "Titre de votre texte..." : "Title of your writing..."}
              className="w-full border border-gray-200 dark:border-white/15 dark:border-white/15 rounded-lg p-3 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-teal-700/30"
            />
            <label htmlFor="writing-content" className="sr-only">{isFr ? "Contenu" : "Content"}</label>
            <textarea
              id="writing-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={isFr ? "Commencez à écrire ici..." : "Start writing here..."}
              className="w-full border border-gray-200 dark:border-white/15 dark:border-white/15 rounded-lg p-4 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-teal-700/30 min-h-[300px] leading-relaxed"
            />
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-4">
                <span className="text-[11px] text-gray-400">
                  {content.trim().split(/\s+/).filter(Boolean).length} / {WORD_TARGETS[cefrLevel] || 150} {isFr ? "mots" : "words"}
                </span>
                {/* Word count progress bar (Sprint F3) */}
                <div className="w-24 h-1.5 bg-gray-100 dark:bg-white/[0.08] dark:backdrop-blur-md dark:border-white/15 rounded-full overflow-hidden" role="progressbar"
                  aria-valuenow={content.trim().split(/\s+/).filter(Boolean).length}
                  aria-valuemin={0} aria-valuemax={WORD_TARGETS[cefrLevel] || 150}>
                  <div className="h-full rounded-full transition-all duration-300" style={{
                    width: `${Math.min(100, (content.trim().split(/\s+/).filter(Boolean).length / (WORD_TARGETS[cefrLevel] || 150)) * 100)}%`,
                    background: content.trim().split(/\s+/).filter(Boolean).length >= (WORD_TARGETS[cefrLevel] || 150) ? "var(--semantic-success, var(--success))" : "var(--brand-teal, var(--teal))"
                  }} />
                </div>
                <span className="text-[11px] text-gray-400 flex items-center gap-1">
                  <span className="material-icons text-[11px]" aria-hidden="true">timer</span>
                  {formatWritingTime(writingElapsed)}
                </span>
              </div>
              <div className="flex gap-2">
                <button onClick={resetEditor}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 dark:text-foreground focus:outline-none focus:ring-2 focus:ring-gray-300 rounded">
                  {isFr ? "Annuler" : "Cancel"}
                </button>
                <button
                  onClick={handleSave}
                  disabled={!title.trim() || !content.trim() || createMutation.isPending || updateMutation.isPending}
                  className="px-4 py-2 bg-teal-700 text-white text-sm rounded-lg hover:bg-teal-800 disabled:opacity-50 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-700/30"
                >
                  {createMutation.isPending || updateMutation.isPending
                    ? (isFr ? "Enregistrement..." : "Saving...")
                    : (isFr ? "Enregistrer le brouillon" : "Save Draft")}
                </button>
              </div>
            </div>
          </div>

          {feedback && (
            <div className="mt-4 bg-white dark:bg-white/[0.08] dark:backdrop-blur-md border border-gray-200 dark:border-white/15 dark:border-white/15 rounded-xl p-6 shadow-sm" role="region" aria-label={isFr ? "Retour IA" : "AI Feedback"}>
              <h3 className="text-lg font-bold text-gray-900 dark:text-foreground mb-4 flex items-center gap-2">
                <span className="material-icons text-teal-700" aria-hidden="true">auto_awesome</span> {isFr ? "Retour IA" : "AI Feedback"}
              </h3>
              <div className="text-center mb-4">
                <div className="text-xl md:text-3xl lg:text-4xl font-bold text-teal-700">{feedback.score}</div>
                <div className="text-xs text-gray-400">{isFr ? "Score global" : "Overall Score"}</div>
              </div>
              <p className="text-sm text-gray-700 dark:text-muted-foreground mb-4">{feedback.overallFeedback}</p>
            </div>
          )}
        </div>
      </DashboardLayout>
    );
  }

  /* ─── LIST VIEW ─── */
  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto px-4 py-6" role="main" aria-label={t("writing.title")}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{t("writing.title")}</h1>
            <p className="text-sm text-gray-500 mt-1">{isFr ? "Pratiquez l'écriture et obtenez un retour IA" : "Practice writing and get AI-powered feedback"}</p>
          </div>
          <button onClick={() => openEditor()}
            className="flex items-center gap-2 px-4 py-2 bg-teal-700 text-white text-sm rounded-lg hover:bg-teal-800 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-700/30"
            aria-label={t("writing.newEntry")}>
            <span className="material-icons text-lg" aria-hidden="true">edit_note</span> {t("writing.newEntry")}
          </button>
        </div>

        {/* Writing Prompts */}
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-gray-700 dark:text-muted-foreground mb-3">{isFr ? "Sujets d'écriture par niveau" : "Writing Prompts by Level"}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3" role="list">
            {WRITING_PROMPTS.map((prompt, i) => (
              <button
                key={i}
                role="listitem"
                onClick={() => openEditor(prompt)}
                className="text-left bg-white dark:bg-white/[0.08] dark:backdrop-blur-md border border-gray-200 dark:border-white/15 dark:border-white/15 rounded-xl p-4 hover:shadow-md hover:border-teal-700/30 transition-all focus:outline-none focus:ring-2 focus:ring-teal-700/30"
                aria-label={`${prompt.level}: ${language === "fr" ? prompt.fr : prompt.en}`}
              >
                <span className="px-2 py-0.5 bg-teal-700/10 text-teal-700 rounded-full text-[10px] font-semibold">{prompt.level}</span>
                <p className="text-xs text-gray-700 dark:text-muted-foreground mt-2 line-clamp-2">{language === "fr" ? prompt.fr : prompt.en}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Submissions List */}
        <h2 className="text-sm font-semibold text-gray-700 dark:text-muted-foreground mb-3">{t("writing.history")}</h2>
        {submissions.isLoading ? (
          <div className="space-y-3" role="status" aria-label={t("skillLabs.loading")}>
            {[1,2,3].map(i => <div key={i} className="h-20 bg-gray-100 dark:bg-white/[0.08] dark:backdrop-blur-md dark:border-white/15 rounded-xl animate-pulse" />)}
            <span className="sr-only">{t("skillLabs.loading")}</span>
          </div>
        ) : (submissions.data || []).length === 0 ? (
          <div className="text-center py-6 md:py-8 lg:py-12" role="status">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-teal-50 to-cyan-50 flex items-center justify-center">
              <span className="material-icons text-xl md:text-3xl lg:text-4xl text-teal-700/60" aria-hidden="true">edit_note</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-700 dark:text-muted-foreground mb-2">{t("writing.emptyTitle")}</h3>
            <p className="text-sm text-gray-500 max-w-sm mx-auto">{t("writing.emptyDesc")}</p>
          </div>
        ) : (
          <div className="space-y-3" role="list" aria-label={t("writing.history")}>
            {(submissions.data || []).map((s) => (
              <button
                key={s.id}
                role="listitem"
                onClick={() => openDetail(s.id)}
                className="w-full text-left bg-white dark:bg-white/[0.08] dark:backdrop-blur-md border border-gray-200 dark:border-white/15 dark:border-white/15 rounded-xl p-4 shadow-sm hover:shadow-md hover:border-teal-700/30 transition-all focus:outline-none focus:ring-2 focus:ring-teal-700/30"
              >
                <div className="flex items-start justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-foreground truncate">{s.title}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${getStatusColor(s.status)}`}>{statusLabel(s.status)}</span>
                    </div>
                    <p className="text-xs text-gray-500 line-clamp-1">{s.content.slice(0, 120)}...</p>
                    <div className="flex items-center gap-3 mt-2 text-[10px] text-gray-400">
                      {s.cefrLevel && <span className="px-1.5 py-0.5 bg-teal-700/10 text-teal-700 rounded-full font-medium">{s.cefrLevel}</span>}
                      <span>{s.wordCount} {isFr ? "mots" : "words"}</span>
                      <span>{new Date(s.updatedAt).toLocaleDateString(isFr ? "fr-CA" : "en-CA")}</span>
                    </div>
                  </div>
                  {s.aiScore !== null && (
                    <div className="text-center ml-4" role="status" aria-label={`Score: ${s.aiScore}`}>
                      <div className="text-xl font-bold text-teal-700">{s.aiScore}</div>
                      <div className="text-[9px] text-gray-400">Score</div>
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
