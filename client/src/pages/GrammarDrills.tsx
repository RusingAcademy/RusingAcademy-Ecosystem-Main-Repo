/**
 * Grammar Drills Engine — Interactive grammar exercises by topic and CEFR level
 * Wave F: Full bilingual (EN/FR), WCAG 2.1 AA accessibility, professional empty states
 */
import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { useLanguage } from "@/contexts/LanguageContext";
import Sidebar from "@/components/Sidebar";
import { getLoginUrl } from "@/const";

/* ─── Grammar Drill Data ─── */
type DrillQuestion = { prompt: string; answer: string; options?: string[]; hint?: string };
type DrillSet = { topic: string; level: string; type: "fill_blank" | "conjugation" | "reorder" | "multiple_choice"; questions: DrillQuestion[] };

const DRILLS: DrillSet[] = [
  { topic: "Articles définis et indéfinis", level: "A1", type: "fill_blank", questions: [
    { prompt: "___ chat est sur la table.", answer: "Le", options: ["Le", "La", "Un", "Des"], hint: "Chat is masculine" },
    { prompt: "J'ai ___ sœur et ___ frère.", answer: "une, un", options: ["une, un", "un, une", "la, le", "des, des"], hint: "Sister is feminine, brother is masculine" },
    { prompt: "Elle mange ___ pomme.", answer: "une", options: ["une", "un", "la", "le"], hint: "Pomme is feminine" },
    { prompt: "___ enfants jouent dans le parc.", answer: "Les", options: ["Les", "Des", "Un", "Le"], hint: "Plural definite article" },
    { prompt: "Il y a ___ fleurs dans le jardin.", answer: "des", options: ["des", "les", "une", "la"], hint: "Plural indefinite article" },
  ]},
  { topic: "Être et Avoir au présent", level: "A1", type: "conjugation", questions: [
    { prompt: "Je ___ (être) étudiant.", answer: "suis", options: ["suis", "es", "est", "sommes"] },
    { prompt: "Nous ___ (avoir) un chien.", answer: "avons", options: ["avons", "avez", "ont", "ai"] },
    { prompt: "Ils ___ (être) contents.", answer: "sont", options: ["sont", "sommes", "êtes", "est"] },
    { prompt: "Tu ___ (avoir) quel âge?", answer: "as", options: ["as", "ai", "a", "avez"] },
    { prompt: "Elle ___ (être) canadienne.", answer: "est", options: ["est", "es", "suis", "sont"] },
  ]},
  { topic: "Le passé composé", level: "A2", type: "fill_blank", questions: [
    { prompt: "J'___ (manger) une pizza hier.", answer: "ai mangé", options: ["ai mangé", "suis mangé", "mange", "mangeais"] },
    { prompt: "Elle ___ (aller) au bureau.", answer: "est allée", options: ["est allée", "a allé", "a allée", "est allé"] },
    { prompt: "Nous ___ (finir) le rapport.", answer: "avons fini", options: ["avons fini", "sommes finis", "avons finir", "finissons"] },
    { prompt: "Ils ___ (venir) à la réunion.", answer: "sont venus", options: ["sont venus", "ont venu", "ont venus", "sont venu"] },
    { prompt: "Tu ___ (prendre) le bus?", answer: "as pris", options: ["as pris", "es pris", "a pris", "prends"] },
  ]},
  { topic: "L'ordre des mots", level: "A2", type: "reorder", questions: [
    { prompt: "bureau / au / je / vais / chaque / matin", answer: "Je vais au bureau chaque matin", hint: "Subject + verb + location + time" },
    { prompt: "ne / pas / je / français / parle", answer: "Je ne parle pas français", hint: "Subject + ne + verb + pas + object" },
    { prompt: "souvent / elle / café / boit / du", answer: "Elle boit souvent du café", hint: "Subject + verb + adverb + object" },
    { prompt: "hier / nous / sommes / allés / cinéma / au", answer: "Hier nous sommes allés au cinéma", hint: "Time + subject + auxiliary + past participle + location" },
  ]},
  { topic: "Le subjonctif présent", level: "B1", type: "conjugation", questions: [
    { prompt: "Il faut que je ___ (faire) mes devoirs.", answer: "fasse", options: ["fasse", "fais", "fait", "ferai"] },
    { prompt: "Je veux que tu ___ (être) heureux.", answer: "sois", options: ["sois", "es", "seras", "étais"] },
    { prompt: "Il est important que nous ___ (avoir) le temps.", answer: "ayons", options: ["ayons", "avons", "aurons", "avions"] },
    { prompt: "Bien qu'il ___ (pleuvoir), nous sortons.", answer: "pleuve", options: ["pleuve", "pleut", "pleuvra", "pleuvait"] },
    { prompt: "Je doute qu'elle ___ (pouvoir) venir.", answer: "puisse", options: ["puisse", "peut", "pourra", "pouvait"] },
  ]},
  { topic: "Les pronoms relatifs", level: "B1", type: "multiple_choice", questions: [
    { prompt: "Le livre ___ j'ai lu est intéressant.", answer: "que", options: ["que", "qui", "dont", "où"] },
    { prompt: "La femme ___ parle est ma collègue.", answer: "qui", options: ["qui", "que", "dont", "où"] },
    { prompt: "Le bureau ___ je travaille est grand.", answer: "où", options: ["où", "qui", "que", "dont"] },
    { prompt: "Le sujet ___ nous parlons est important.", answer: "dont", options: ["dont", "que", "qui", "où"] },
    { prompt: "Les étudiants ___ ont réussi sont contents.", answer: "qui", options: ["qui", "que", "dont", "où"] },
  ]},
  { topic: "La concordance des temps", level: "B2", type: "fill_blank", questions: [
    { prompt: "Si j'avais su, je ___ (venir) plus tôt.", answer: "serais venu", options: ["serais venu", "suis venu", "viendrai", "venais"] },
    { prompt: "Il a dit qu'il ___ (finir) le rapport demain.", answer: "finirait", options: ["finirait", "finira", "finit", "a fini"] },
    { prompt: "Si nous ___ (étudier) plus, nous réussirions.", answer: "étudiions", options: ["étudiions", "étudions", "étudierons", "avons étudié"] },
    { prompt: "Elle pensait que tu ___ (être) malade.", answer: "étais", options: ["étais", "es", "seras", "serais"] },
    { prompt: "Quand j'___ (arriver), il pleuvait.", answer: "suis arrivé", options: ["suis arrivé", "arrivais", "arriverai", "arrive"] },
  ]},
  { topic: "La voix passive et les nominalisations", level: "C1", type: "multiple_choice", questions: [
    { prompt: "Le rapport ___ par le comité hier.", answer: "a été approuvé", options: ["a été approuvé", "a approuvé", "est approuvé", "approuvait"] },
    { prompt: "La ___ de ce projet nécessite des ressources.", answer: "réalisation", options: ["réalisation", "réaliser", "réalisé", "réalisant"] },
    { prompt: "Les mesures ___ par le gouvernement sont contestées.", answer: "prises", options: ["prises", "prendre", "pris", "prenantes"] },
    { prompt: "L'___ des résultats sera faite la semaine prochaine.", answer: "analyse", options: ["analyse", "analyser", "analysé", "analysant"] },
    { prompt: "Cette décision ___ après de longues délibérations.", answer: "a été prise", options: ["a été prise", "a pris", "est prise", "prenait"] },
  ]},
];

type Phase = "select" | "drill" | "results";

export default function GrammarDrillsPage() {
  const { user, loading: authLoading } = useAuth();
  const { t, language } = useLanguage();
  const isFr = language === "fr";
  const utils = trpc.useUtils();
  const saveResult = trpc.grammarDrills.saveResult.useMutation({
    onSuccess: () => { utils.grammarDrills.history.invalidate(); utils.grammarDrills.stats.invalidate(); utils.grammarDrills.statsByTopic.invalidate(); },
  });
  const { data: history } = trpc.grammarDrills.history.useQuery(undefined, { enabled: !!user });
  const { data: stats } = trpc.grammarDrills.stats.useQuery(undefined, { enabled: !!user });
  const { data: topicStats } = trpc.grammarDrills.statsByTopic.useQuery(undefined, { enabled: !!user });

  const [phase, setPhase] = useState<Phase>("select");
  const [selectedLevel, setSelectedLevel] = useState("B1");
  const [selectedDrill, setSelectedDrill] = useState<DrillSet | null>(null);
  const [answers, setAnswers] = useState<string[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [showHistory, setShowHistory] = useState(false);
  const [startTime, setStartTime] = useState(0);
  const [reorderInput, setReorderInput] = useState("");
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Live timer during drill (Sprint F3)
  useEffect(() => {
    if (phase === "drill" && startTime > 0) {
      timerRef.current = setInterval(() => {
        setElapsedSeconds(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [phase, startTime]);

  // Keyboard shortcuts for multiple choice (Sprint F3)
  useEffect(() => {
    if (phase !== "drill" || !selectedDrill) return;
    const q = selectedDrill.questions[currentQ];
    if (!q?.options) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      const idx = parseInt(e.key) - 1;
      if (idx >= 0 && idx < (q.options?.length ?? 0)) {
        e.preventDefault();
        answerCurrent(q.options![idx]);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [phase, selectedDrill, currentQ, answerCurrent]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const filteredDrills = useMemo(() => DRILLS.filter(d => d.level === selectedLevel), [selectedLevel]);

  const startDrill = useCallback((drill: DrillSet) => {
    setSelectedDrill(drill);
    setAnswers([]);
    setCurrentQ(0);
    setStartTime(Date.now());
    setReorderInput("");
    setElapsedSeconds(0);
    setPhase("drill");
  }, []);

  const answerCurrent = useCallback((answer: string) => {
    setAnswers(prev => {
      const next = [...prev];
      next[currentQ] = answer;
      return next;
    });
    if (selectedDrill && currentQ < selectedDrill.questions.length - 1) {
      setTimeout(() => { setCurrentQ(prev => prev + 1); setReorderInput(""); }, 300);
    }
  }, [currentQ, selectedDrill]);

  const submitDrill = useCallback(() => {
    if (!selectedDrill) return;
    const correct = selectedDrill.questions.reduce((sum, q, i) => {
      const userAns = (answers[i] || "").toLowerCase().trim();
      const correctAns = q.answer.toLowerCase().trim();
      return sum + (userAns === correctAns ? 1 : 0);
    }, 0);
    const totalTime = Math.floor((Date.now() - startTime) / 1000);
    const score = Math.round((correct / selectedDrill.questions.length) * 100);

    saveResult.mutate({
      topic: selectedDrill.topic,
      cefrLevel: selectedDrill.level as "A1" | "A2" | "B1" | "B2" | "C1",
      drillType: selectedDrill.type,
      score,
      totalQuestions: selectedDrill.questions.length,
      correctAnswers: correct,
      timeSpentSeconds: totalTime,
      language: "fr",
    });

    if (timerRef.current) clearInterval(timerRef.current);
    setPhase("results");
  }, [selectedDrill, answers, startTime, saveResult]);

  const drillTypeLabels: Record<string, { en: string; fr: string }> = {
    fill_blank: { en: "Fill in the Blank", fr: "Compléter le blanc" },
    conjugation: { en: "Conjugation", fr: "Conjugaison" },
    reorder: { en: "Sentence Reorder", fr: "Réordonner la phrase" },
    multiple_choice: { en: "Multiple Choice", fr: "Choix multiple" },
  };
  const drillTypeLabel = (tp: string) => (drillTypeLabels[tp] ? (isFr ? drillTypeLabels[tp].fr : drillTypeLabels[tp].en) : tp);
  const drillTypeIcon = (tp: string) => ({ fill_blank: "edit_note", conjugation: "spellcheck", reorder: "swap_vert", multiple_choice: "checklist" }[tp] || "quiz");

  if (authLoading) return (
    <div className="flex h-screen items-center justify-center" role="status" aria-label={t("skillLabs.loading")}>
      <div className="animate-spin w-8 h-8 border-4 border-teal-700 border-t-transparent rounded-full" />
      <span className="sr-only">{t("skillLabs.loading")}</span>
    </div>
  );
  if (!user) { window.location.href = getLoginUrl(); return null; }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 overflow-y-auto" role="main" aria-label={t("grammar.title")}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
                <span className="material-icons text-teal-700" aria-hidden="true">spellcheck</span>
                {t("grammar.title")}
              </h1>
              <p className="text-gray-500 mt-1">{t("grammar.subtitle")}</p>
            </div>
            <button onClick={() => setShowHistory(!showHistory)}
              className="px-4 py-2 rounded-xl text-sm font-semibold text-teal-700 border border-teal-700 flex items-center gap-2 hover:bg-teal-700/5 focus:outline-none focus:ring-2 focus:ring-teal-700/30"
              aria-label={showHistory ? t("grammar.practice") : t("grammar.history")}>
              <span className="material-icons text-base" aria-hidden="true">{showHistory ? "play_circle" : "history"}</span>
              {showHistory ? t("grammar.practice") : t("grammar.history")}
            </button>
          </div>

          {/* Stats */}
          {stats && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8" role="region" aria-label={t("grammar.stats")}>
              {[
                { label: t("grammar.drills"), value: stats.totalDrills ?? 0, icon: "assignment", color: "var(--brand-teal, #008090)" },
                { label: t("grammar.avgScore"), value: `${stats.avgScore ?? 0}%`, icon: "grade", color: "var(--semantic-warning, #f5a623)" },
                { label: t("grammar.totalTime"), value: `${Math.round((stats.totalTime ?? 0) / 60)}m`, icon: "timer", color: "var(--color-violet-500, #8b5cf6)" },
              ].map((s, i) => (
                <div key={i} className="bg-white dark:bg-slate-800 dark:bg-slate-900 rounded-2xl p-4 border border-gray-100 dark:border-slate-700 shadow-sm text-center" role="status">
                  <span className="material-icons text-lg mb-1" style={{ color: s.color }} aria-hidden="true">{s.icon}</span>
                  <div className="text-xl font-bold text-gray-900">{s.value}</div>
                  <div className="text-xs text-gray-500">{s.label}</div>
                </div>
              ))}
            </div>
          )}

          {showHistory ? (
            <div className="space-y-3">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">{t("grammar.history")}</h2>
              {!history?.length ? (
                <div className="text-center py-16" role="status">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-teal-50 to-cyan-50 flex items-center justify-center">
                    <span className="material-icons text-4xl text-teal-700/60" aria-hidden="true">spellcheck</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">{t("grammar.emptyTitle")}</h3>
                  <p className="text-sm text-gray-500 max-w-sm mx-auto">{t("grammar.emptyDesc")}</p>
                </div>
              ) : history.map((h: any, i: number) => (
                <div key={i} className="bg-white dark:bg-slate-800 dark:bg-slate-900 rounded-xl p-4 border border-gray-100 dark:border-slate-700 shadow-sm flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-gray-900">{h.topic}</div>
                    <div className="text-sm text-gray-500 flex items-center gap-3 mt-1">
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-teal-700/10 text-teal-700">{h.cefrLevel}</span>
                      <span>{drillTypeLabel(h.drillType)}</span>
                      <span>{h.correctAnswers}/{h.totalQuestions}</span>
                    </div>
                  </div>
                  <div className="text-lg font-bold" style={{ color: (h.score ?? 0) >= 80 ? "var(--semantic-success, #22c55e)" : (h.score ?? 0) >= 60 ? "var(--semantic-warning, #f5a623)" : "var(--semantic-danger, #e74c3c)" }} aria-label={`${t("grammar.score")}: ${h.score}%`}>{h.score}%</div>
                </div>
              ))}
            </div>
          ) : phase === "select" ? (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">{t("grammar.chooseLevel")}</h2>
              <div className="flex gap-3 mb-6 flex-wrap" role="radiogroup" aria-label={t("grammar.chooseLevel")}>
                {["A1", "A2", "B1", "B2", "C1"].map(level => (
                  <button key={level} onClick={() => setSelectedLevel(level)}
                    role="radio" aria-checked={selectedLevel === level}
                    className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-teal-700/30 ${selectedLevel === level ? "bg-teal-700 text-white shadow-md" : "bg-white dark:bg-slate-800 text-gray-600 border border-gray-200 dark:border-slate-700 hover:border-teal-700"}`}>
                    {level}
                  </button>
                ))}
              </div>

              {/* Topic Stats */}
              {topicStats && topicStats.length > 0 && (
                <div className="mb-6" role="region" aria-label={isFr ? "Performance par sujet" : "Topic Performance"}>
                  <h3 className="text-sm font-semibold text-gray-600 mb-3">{isFr ? "Performance par sujet" : "Your Topic Performance"}</h3>
                  <div className="flex gap-2 flex-wrap">
                    {topicStats.map((ts: any, i: number) => (
                      <div key={i} className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 dark:bg-slate-900 border border-gray-100 dark:border-slate-700 text-xs flex items-center gap-2">
                        <span className="font-medium text-gray-700">{ts.topic}</span>
                        <span className="font-bold" style={{ color: (ts.avgScore ?? 0) >= 80 ? "var(--semantic-success, #22c55e)" : "var(--semantic-warning, #f5a623)" }}>{ts.avgScore}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-4" role="list" aria-label={t("grammar.drills")}>
                {filteredDrills.map((drill, i) => (
                  <div key={i} role="listitem"
                    className="bg-white dark:bg-slate-800 dark:bg-slate-900 rounded-2xl p-6 border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow cursor-pointer focus-within:ring-2 focus-within:ring-teal-700/30"
                    onClick={() => startDrill(drill)}
                    onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); startDrill(drill); }}}
                    tabIndex={0}
                    aria-label={`${drill.topic} — ${drillTypeLabel(drill.type)} — ${drill.questions.length} questions`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-teal-700/10 flex items-center justify-center">
                          <span className="material-icons text-teal-700" aria-hidden="true">{drillTypeIcon(drill.type)}</span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{drill.topic}</h3>
                          <div className="text-sm text-gray-500 mt-0.5">{drillTypeLabel(drill.type)} · {drill.questions.length} questions</div>
                        </div>
                      </div>
                      <span className="material-icons text-teal-700 text-2xl" aria-hidden="true">play_circle</span>
                    </div>
                  </div>
                ))}
                {filteredDrills.length === 0 && (
                  <div className="text-center py-12" role="status">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                      <span className="material-icons text-3xl text-gray-400" aria-hidden="true">construction</span>
                    </div>
                    <p className="text-sm text-gray-500">{isFr ? "Plus d'exercices bientôt pour ce niveau !" : "More drills coming soon for this level!"}</p>
                  </div>
                )}
              </div>
            </div>
          ) : phase === "drill" && selectedDrill ? (
            <div role="region" aria-label={selectedDrill.topic}>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">{selectedDrill.topic}</h2>
                  <div className="text-sm text-gray-500">{drillTypeLabel(selectedDrill.type)}</div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1 text-sm text-gray-400">
                    <span className="material-icons text-sm" aria-hidden="true">timer</span>
                    <span aria-live="polite">{formatTime(elapsedSeconds)}</span>
                  </div>
                  <div className="text-sm text-gray-500" aria-live="polite">
                    {currentQ + 1} / {selectedDrill.questions.length}
                  </div>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2 bg-gray-200 rounded-full mb-8" role="progressbar" aria-valuenow={currentQ + 1} aria-valuemin={1} aria-valuemax={selectedDrill.questions.length}>
                <div className="h-2 bg-teal-700 rounded-full transition-all" style={{ width: `${((currentQ + 1) / selectedDrill.questions.length) * 100}%` }} />
              </div>

              {/* Current Question */}
              <div className="bg-white dark:bg-slate-800 dark:bg-slate-900 rounded-2xl p-8 border border-gray-100 dark:border-slate-700 shadow-sm mb-6">
                <p className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">{selectedDrill.questions[currentQ].prompt}</p>

                {selectedDrill.questions[currentQ].options ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" role="radiogroup" aria-label={isFr ? "Options de réponse" : "Answer options"}>
                    {selectedDrill.questions[currentQ].options!.map((opt, oi) => (
                      <button key={oi} onClick={() => answerCurrent(opt)}
                        role="radio" aria-checked={answers[currentQ] === opt}
                        className={`p-4 rounded-xl text-sm text-left transition-all focus:outline-none focus:ring-2 focus:ring-teal-700/30 ${answers[currentQ] === opt ? "bg-teal-700 text-white shadow-md" : "bg-gray-50 dark:bg-slate-900 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:bg-slate-800 border border-gray-200"}`}>
                        {opt}
                      </button>
                    ))}
                  </div>
                ) : selectedDrill.type === "reorder" ? (
                  <div>
                    <label htmlFor="reorder-input" className="sr-only">{isFr ? "Tapez la phrase correcte" : "Type the correct sentence"}</label>
                    <input id="reorder-input" type="text" value={reorderInput} onChange={e => setReorderInput(e.target.value)}
                      onKeyDown={e => { if (e.key === "Enter" && reorderInput.trim()) answerCurrent(reorderInput.trim()); }}
                      placeholder={isFr ? "Tapez la phrase dans le bon ordre..." : "Type the correct sentence order..."}
                      className="w-full p-4 rounded-xl border border-gray-200 dark:border-slate-700 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-teal-700/30"
                      autoFocus />
                    <button onClick={() => { if (reorderInput.trim()) answerCurrent(reorderInput.trim()); }}
                      className="mt-3 px-4 py-2 rounded-xl text-sm font-semibold bg-teal-700 text-white hover:bg-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-700/30">
                      {isFr ? "Confirmer" : "Confirm"}
                    </button>
                  </div>
                ) : null}

                {selectedDrill.questions[currentQ].hint && (
                  <p className="text-xs text-gray-400 mt-4 flex items-center gap-1">
                    <span className="material-icons text-xs" aria-hidden="true">lightbulb</span> {selectedDrill.questions[currentQ].hint}
                  </p>
                )}
              </div>

              {/* Navigation */}
              <div className="flex justify-between">
                <button onClick={() => { if (currentQ > 0) { setCurrentQ(currentQ - 1); setReorderInput(""); } }}
                  disabled={currentQ === 0}
                  className="px-4 py-2 rounded-xl text-sm text-gray-500 hover:text-gray-700 dark:text-gray-300 disabled:opacity-30 focus:outline-none focus:ring-2 focus:ring-gray-300"
                  aria-label={isFr ? "Précédent" : "Previous"}>
                  {isFr ? "← Précédent" : "← Previous"}
                </button>
                {currentQ === selectedDrill.questions.length - 1 ? (
                  <button onClick={submitDrill}
                    disabled={answers.filter(a => a).length < selectedDrill.questions.length}
                    className="px-6 py-2.5 rounded-xl text-sm font-semibold bg-teal-700 text-white hover:bg-teal-800 disabled:opacity-40 focus:outline-none focus:ring-2 focus:ring-teal-700/30">
                    {t("grammar.submit")}
                  </button>
                ) : (
                  <button onClick={() => { setCurrentQ(currentQ + 1); setReorderInput(""); }}
                    className="px-4 py-2 rounded-xl text-sm text-teal-700 hover:text-[#006a75] focus:outline-none focus:ring-2 focus:ring-teal-700/30"
                    aria-label={t("grammar.next")}>
                    {t("grammar.next")} →
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* Results */
            <div role="region" aria-label={t("grammar.drillComplete")}>
              <div className="bg-white dark:bg-slate-800 dark:bg-slate-900 rounded-2xl p-8 border border-gray-100 dark:border-slate-700 shadow-sm text-center mb-8">
                <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-amber-50 to-yellow-50 flex items-center justify-center">
                  <span className="material-icons text-4xl text-amber-500" aria-hidden="true">emoji_events</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">{t("grammar.drillComplete")}</h2>
                <p className="text-sm text-gray-400 mb-2">
                  <span className="material-icons text-sm align-middle mr-1" aria-hidden="true">timer</span>
                  {formatTime(Math.floor((Date.now() - startTime) / 1000))}
                </p>
                {(() => {
                  const correct = selectedDrill?.questions.reduce((sum, q, i) => {
                    const userAns = (answers[i] || "").toLowerCase().trim();
                    return sum + (userAns === q.answer.toLowerCase().trim() ? 1 : 0);
                  }, 0) ?? 0;
                  const total = selectedDrill?.questions.length ?? 1;
                  const score = Math.round((correct / total) * 100);
                  return (
                    <div className="text-4xl font-bold mt-4" style={{ color: score >= 80 ? "var(--semantic-success, #22c55e)" : score >= 60 ? "var(--semantic-warning, #f5a623)" : "var(--semantic-danger, #e74c3c)" }} aria-label={`${t("grammar.score")}: ${score}%`}>
                      {score}%
                      <div className="text-sm text-gray-500 font-normal mt-1">{correct}/{total} {t("grammar.correct").toLowerCase()}</div>
                    </div>
                  );
                })()}
              </div>

              <div className="space-y-4 mb-8" role="list" aria-label={isFr ? "Résultats détaillés" : "Detailed results"}>
                {selectedDrill?.questions.map((q, qi) => {
                  const userAns = (answers[qi] || "").toLowerCase().trim();
                  const isCorrect = userAns === q.answer.toLowerCase().trim();
                  return (
                    <div key={qi} role="listitem" className={`rounded-xl p-4 border ${isCorrect ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
                      <div className="flex items-start gap-2">
                        <span className={`material-icons text-lg ${isCorrect ? "text-green-600" : "text-red-600"}`} aria-hidden="true">
                          {isCorrect ? "check_circle" : "cancel"}
                        </span>
                        <div>
                          <p className="font-medium text-gray-900">{q.prompt}</p>
                          {!isCorrect && (
                            <p className="text-sm mt-1">
                              <span className="text-red-600">{isFr ? "Votre réponse" : "Your answer"}: {answers[qi] || (isFr ? "(aucune)" : "(no answer)")}</span>
                              <span className="text-green-600 ml-3">{t("grammar.correct")}: {q.answer}</span>
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex gap-3 justify-center">
                <button onClick={() => setPhase("select")}
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold text-teal-700 border border-teal-700 hover:bg-teal-700/5 focus:outline-none focus:ring-2 focus:ring-teal-700/30">
                  {t("grammar.chooseAnother")}
                </button>
                {selectedDrill && (
                  <button onClick={() => startDrill(selectedDrill)}
                    className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-teal-700 text-white hover:bg-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-700/30">
                    {t("grammar.tryAgain")}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
