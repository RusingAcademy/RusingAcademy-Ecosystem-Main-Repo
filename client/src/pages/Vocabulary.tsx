/**
 * Vocabulary Builder — Word collection, mastery tracking, and quiz mode
 * Wave F: Full bilingual (EN/FR), WCAG 2.1 AA accessibility, professional empty states
 */
import { useState, useMemo, useCallback, useEffect } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { useLanguage } from "@/contexts/LanguageContext";
import Sidebar from "@/components/Sidebar";
import { getLoginUrl } from "@/const";
import { toast } from "sonner";

const MASTERY_CONFIG: Record<string, { label: string; labelFr: string; color: string; bg: string; icon: string }> = {
  new: { label: "New", labelFr: "Nouveau", color: "var(--color-blue-500, var(--semantic-info))", bg: "bg-blue-50 text-blue-700", icon: "fiber_new" },
  learning: { label: "Learning", labelFr: "En cours", color: "var(--semantic-warning, var(--warning))", bg: "bg-amber-50 text-amber-700", icon: "school" },
  familiar: { label: "Familiar", labelFr: "Familier", color: "var(--color-violet-500, var(--accent-purple))", bg: "bg-purple-50 text-purple-700", icon: "thumb_up" },
  mastered: { label: "Mastered", labelFr: "Maîtrisé", color: "var(--semantic-success, var(--success))", bg: "bg-green-50 text-green-700", icon: "verified" },
};

const POS_OPTIONS = ["noun", "verb", "adjective", "adverb", "preposition", "conjunction", "pronoun", "interjection", "expression"];

type ViewMode = "list" | "quiz";

export default function Vocabulary() {
  const { user, loading: authLoading } = useAuth();
  const { t, language } = useLanguage();
  const isFr = language === "fr";
  const [collapsed, setCollapsed] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterMastery, setFilterMastery] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  // Form state
  const [word, setWord] = useState("");
  const [translation, setTranslation] = useState("");
  const [definition, setDefinition] = useState("");
  const [example, setExample] = useState("");
  const [pronunciation, setPronunciation] = useState("");
  const [partOfSpeech, setPartOfSpeech] = useState("");

  // Quiz state
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizAnswer, setQuizAnswer] = useState("");
  const [quizRevealed, setQuizRevealed] = useState(false);
  const [quizScore, setQuizScore] = useState({ correct: 0, total: 0 });
  const [quizDone, setQuizDone] = useState(false);

  const utils = trpc.useUtils();
  const { data: items = [], isLoading } = trpc.vocabulary.list.useQuery();
  const { data: stats } = trpc.vocabulary.stats.useQuery();
  const addItem = trpc.vocabulary.add.useMutation({
    onSuccess: () => { utils.vocabulary.list.invalidate(); utils.vocabulary.stats.invalidate(); resetForm(); },
  });
  const reviewItem = trpc.vocabulary.review.useMutation({
    onSuccess: () => { utils.vocabulary.list.invalidate(); utils.vocabulary.stats.invalidate(); },
  });
  const deleteItem = trpc.vocabulary.delete.useMutation({
    onSuccess: () => { utils.vocabulary.list.invalidate(); utils.vocabulary.stats.invalidate(); },
  });

  const aiSuggest = trpc.aiVocabulary.suggestWords.useMutation({
    onSuccess: (data: any) => {
      if (data.words && data.words.length > 0) {
        data.words.forEach((w: any) => {
          addItem.mutate({
            word: w.word,
            translation: w.translation,
            definition: w.definition || undefined,
            exampleSentence: w.example || undefined,
            pronunciation: w.pronunciation || undefined,
            partOfSpeech: w.partOfSpeech || undefined,
          });
        });
        toast.success(isFr ? `${data.words.length} mots ajoutés par l'IA !` : `Added ${data.words.length} AI-suggested words!`);
      }
    },
    onError: () => toast.error(isFr ? "La suggestion IA a échoué. Réessayez." : "AI suggestion failed. Try again."),
  });

  function resetForm() {
    setWord(""); setTranslation(""); setDefinition(""); setExample(""); setPronunciation(""); setPartOfSpeech("");
    setShowForm(false);
  }

  function handleAdd() {
    if (!word.trim() || !translation.trim()) return;
    addItem.mutate({
      word, translation, definition: definition || undefined,
      exampleSentence: example || undefined, pronunciation: pronunciation || undefined,
      partOfSpeech: partOfSpeech || undefined,
    });
  }

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchesSearch = !searchQuery ||
        item.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.translation.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesMastery = !filterMastery || item.mastery === filterMastery;
      return matchesSearch && matchesMastery;
    });
  }, [items, searchQuery, filterMastery]);

  const quizItems = useMemo(() => {
    const eligible = items.filter(i => i.mastery !== "mastered");
    return [...eligible].sort(() => Math.random() - 0.5).slice(0, 10);
  }, [items]);

  function startQuiz() {
    setViewMode("quiz");
    setQuizIndex(0);
    setQuizAnswer("");
    setQuizRevealed(false);
    setQuizScore({ correct: 0, total: 0 });
    setQuizDone(false);
  }

  const handleQuizAnswer = useCallback((correct: boolean) => {
    const currentItem = quizItems[quizIndex];
    if (currentItem) {
      reviewItem.mutate({ itemId: currentItem.id, correct });
    }
    const newScore = { correct: quizScore.correct + (correct ? 1 : 0), total: quizScore.total + 1 };
    setQuizScore(newScore);
    setQuizAnswer("");
    setQuizRevealed(false);
    if (quizIndex + 1 >= quizItems.length) {
      setQuizDone(true);
    } else {
      setQuizIndex(prev => prev + 1);
    }
  }, [quizItems, quizIndex, quizScore, reviewItem]);

  if (authLoading) return (
    <div className="flex items-center justify-center h-screen" role="status" aria-label={t("skillLabs.loading")}>
      <div className="animate-spin w-8 h-8 border-2 border-teal-700 border-t-transparent rounded-full" />
      <span className="sr-only">{t("skillLabs.loading")}</span>
    </div>
  );
  if (!user) { window.location.href = getLoginUrl(); return null; }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      <main className="flex-1 lg:ml-[240px] overflow-y-auto" role="main" aria-label={t("vocab.title")}>
        <div className="lg:hidden flex items-center gap-3 p-4 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700 dark:border-slate-700 sticky top-0 z-30">
          <button onClick={() => setCollapsed(!collapsed)} className="p-2 rounded-lg hover:bg-gray-100" aria-label="Toggle sidebar">
            <span className="material-icons text-gray-600" aria-hidden="true">menu</span>
          </button>
          <h1 className="text-lg font-semibold text-gray-900">{t("vocab.title")}</h1>
        </div>

        <div className="max-w-6xl mx-auto p-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-3">
                {viewMode === "quiz" && (
                  <button onClick={() => setViewMode("list")} className="p-1.5 rounded-lg hover:bg-gray-100 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-700/30" aria-label={t("flashcards.backToDecks")}>
                    <span className="material-icons text-gray-500" aria-hidden="true">arrow_back</span>
                  </button>
                )}
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                    <span className="material-icons text-teal-700" aria-hidden="true">translate</span>
                    {viewMode === "list" ? t("vocab.title") : (isFr ? "Quiz de vocabulaire" : "Vocabulary Quiz")}
                  </h1>
                  <p className="text-sm text-gray-500 mt-1">
                    {viewMode === "list" ? `${items.length} ${t("vocab.totalWords").toLowerCase()}` : `${quizItems.length} ${t("vocab.totalWords").toLowerCase()}`}
                  </p>
                </div>
              </div>
            </div>
            {viewMode === "list" && (
              <div className="flex gap-2" role="toolbar" aria-label={t("vocab.title")}>
                <button onClick={startQuiz} disabled={items.filter(i => i.mastery !== "mastered").length === 0}
                  className="px-4 py-2.5 rounded-xl text-sm font-semibold text-teal-700 border border-teal-700 flex items-center gap-2 hover:bg-teal-700/5 disabled:opacity-40 focus:outline-none focus:ring-2 focus:ring-teal-700/30"
                  aria-label={isFr ? "Mode quiz" : "Quiz Mode"}>
                  <span className="material-icons text-base" aria-hidden="true">quiz</span>
                  {isFr ? "Mode quiz" : "Quiz Mode"}
                </button>
                <button onClick={() => aiSuggest.mutate({ topic: "public service bilingualism", level: "B2", count: 5 })}
                  disabled={aiSuggest.isPending}
                  className="px-4 py-2.5 rounded-xl text-sm font-semibold text-violet-500 border border-violet-500 flex items-center gap-2 hover:bg-violet-500/5 disabled:opacity-40 focus:outline-none focus:ring-2 focus:ring-[var(--color-violet-500, var(--accent-purple))]/30"
                  aria-label={t("vocab.aiSuggest")}>
                  <span className="material-icons text-base" aria-hidden="true">{aiSuggest.isPending ? "hourglass_empty" : "auto_awesome"}</span>
                  {aiSuggest.isPending ? t("skillLabs.loading") : t("vocab.aiSuggest")}
                </button>
                <button onClick={() => setShowForm(true)}
                  className="px-4 py-2.5 rounded-xl text-sm font-semibold text-white flex items-center gap-2 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-teal-700/30" 
                  aria-label={t("vocab.addWord")}>
                  <span className="material-icons text-base" aria-hidden="true">add</span>
                  {t("vocab.addWord")}
                </button>
              </div>
            )}
          </div>

          {/* Stats Bar */}
          {viewMode === "list" && stats && stats.total > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6" role="region" aria-label={t("grammar.stats")}>
              {Object.entries(MASTERY_CONFIG).map(([key, config]) => (
                <button key={key} onClick={() => setFilterMastery(filterMastery === key ? null : key)}
                  className={`bg-white dark:bg-slate-800 rounded-xl border p-4 text-center transition-all hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-700/30 ${filterMastery === key ? "border-teal-700 ring-1 ring-teal-700/20" : "border-gray-100"}`}
                  aria-pressed={filterMastery === key}
                  aria-label={`${isFr ? config.labelFr : config.label}: ${(stats as any)[key] ?? 0}`}>
                  <span className="material-icons text-lg mb-1" style={{ color: config.color }} aria-hidden="true">{config.icon}</span>
                  <div className="text-xl font-bold text-gray-900">{(stats as any)[key] ?? 0}</div>
                  <div className="text-[10px] text-gray-500 uppercase tracking-wider">{isFr ? config.labelFr : config.label}</div>
                </button>
              ))}
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-100 dark:border-slate-700 p-4 text-center" role="status">
                <span className="material-icons text-lg mb-1 text-teal-700" aria-hidden="true">analytics</span>
                <div className="text-xl font-bold text-gray-900">{stats.total}</div>
                <div className="text-[10px] text-gray-500 uppercase tracking-wider">{t("vocab.totalWords")}</div>
              </div>
            </div>
          )}

          {/* LIST VIEW */}
          {viewMode === "list" && (
            <>
              {/* Search */}
              <div className="mb-4">
                <label htmlFor="vocab-search" className="sr-only">{isFr ? "Rechercher des mots" : "Search words"}</label>
                <div className="relative">
                  <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" aria-hidden="true">search</span>
                  <input id="vocab-search" type="text" placeholder={isFr ? "Rechercher des mots..." : "Search words..."} value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-teal-700/20 focus:border-teal-700" />
                </div>
              </div>

              {isLoading ? (
                <div className="space-y-3" role="status" aria-label={t("skillLabs.loading")}>
                  {[1,2,3,4,5].map(i => <div key={i} className="h-20 rounded-xl bg-gray-100 dark:bg-slate-800 animate-pulse" />)}
                  <span className="sr-only">{t("skillLabs.loading")}</span>
                </div>
              ) : filteredItems.length === 0 ? (
                <div className="text-center py-8 md:py-12 lg:py-16" role="status">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-teal-50 to-cyan-50 flex items-center justify-center">
                    <span className="material-icons text-xl md:text-3xl lg:text-4xl text-teal-700/60" aria-hidden="true">translate</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    {items.length === 0 ? t("vocab.emptyTitle") : (isFr ? "Aucun mot correspondant" : "No matching words")}
                  </h3>
                  <p className="text-sm text-gray-500 mb-6 max-w-sm mx-auto">
                    {items.length === 0 ? t("vocab.emptyDesc") : (isFr ? "Essayez d'ajuster votre recherche ou filtre." : "Try adjusting your search or filter.")}
                  </p>
                  {items.length === 0 && (
                    <button onClick={() => setShowForm(true)}
                      className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white hover:shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-teal-700/30" >
                      <span className="material-icons text-base mr-1 align-middle" aria-hidden="true">add</span>
                      {t("vocab.addWord")}
                    </button>
                  )}
                </div>
              ) : (
                <div className="space-y-2" role="list" aria-label={t("vocab.title")}>
                  {filteredItems.map(item => {
                    const mastery = MASTERY_CONFIG[item.mastery] ?? MASTERY_CONFIG.new;
                    return (
                      <div key={item.id} role="listitem" className="bg-white dark:bg-slate-900 rounded-xl border border-gray-100 dark:border-slate-700 p-4 group hover:shadow-sm transition-all">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: mastery.color + "15" }}>
                            <span className="material-icons text-lg" style={{ color: mastery.color }} aria-hidden="true">{mastery.icon}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-1 flex-wrap">
                              <span className="text-sm font-bold text-gray-900">{item.word}</span>
                              <span className="text-sm text-teal-700 font-medium">→ {item.translation}</span>
                              {item.partOfSpeech && (
                                <span className="px-2 py-0.5 rounded-full bg-gray-100 dark:bg-slate-800 text-[10px] text-gray-500 font-medium italic">{item.partOfSpeech}</span>
                              )}
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${mastery.bg}`}>{isFr ? mastery.labelFr : mastery.label}</span>
                            </div>
                            {item.definition && <p className="text-xs text-gray-600 mb-1">{item.definition}</p>}
                            {item.exampleSentence && <p className="text-xs text-gray-400 italic">"{item.exampleSentence}"</p>}
                            {item.pronunciation && <p className="text-[10px] text-gray-400 mt-1">/{item.pronunciation}/</p>}
                            {/* Mastery progress bar (Sprint F2) */}
                            <div className="mt-3">
                              <div className="flex items-center justify-between mb-1">
                                <div className="flex items-center gap-3 text-[10px] text-gray-400">
                                  <span>{isFr ? "Révisé" : "Reviewed"} {item.reviewCount}x</span>
                                  <span>{isFr ? "Correct" : "Correct"} {item.correctCount}/{item.reviewCount}</span>
                                </div>
                                <span className="text-[10px] font-medium" style={{ color: mastery.color }}>
                                  {item.reviewCount > 0 ? Math.round((item.correctCount / item.reviewCount) * 100) : 0}%
                                </span>
                              </div>
                              <div className="h-1.5 bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden" role="progressbar"
                                aria-valuenow={item.reviewCount > 0 ? Math.round((item.correctCount / item.reviewCount) * 100) : 0}
                                aria-valuemin={0} aria-valuemax={100}>
                                <div className="h-full rounded-full transition-all duration-500" style={{
                                  width: `${item.reviewCount > 0 ? Math.round((item.correctCount / item.reviewCount) * 100) : 0}%`,
                                  background: mastery.color
                                }} />
                              </div>
                            </div>
                          </div>
                          <button onClick={() => { if (confirm(t("flashcards.delete") + "?")) deleteItem.mutate({ itemId: item.id }); }}
                            className="p-1.5 rounded-lg hover:bg-gray-100 dark:bg-slate-800 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity shrink-0 focus:outline-none focus:ring-2 focus:ring-red-300"
                            aria-label={`${t("flashcards.delete")} ${item.word}`}>
                            <span className="material-icons text-sm text-gray-400" aria-hidden="true">delete</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}

          {/* QUIZ VIEW */}
          {viewMode === "quiz" && (
            quizDone || quizItems.length === 0 ? (
              <div className="text-center py-8 md:py-12 lg:py-16 max-w-md mx-auto" role="status">
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-amber-50 to-yellow-50 flex items-center justify-center">
                  <span className="material-icons text-xl md:text-3xl lg:text-4xl text-amber-500" aria-hidden="true">emoji_events</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  {quizItems.length === 0 ? (isFr ? "Aucun mot à tester !" : "No words to quiz!") : (isFr ? "Quiz terminé !" : "Quiz Complete!")}
                </h3>
                {quizScore.total > 0 && (
                  <div className="mb-4">
                    <div className="text-xl md:text-3xl lg:text-4xl font-bold text-teal-700 mb-1">{Math.round((quizScore.correct / quizScore.total) * 100)}%</div>
                    <p className="text-sm text-gray-500">{quizScore.correct}/{quizScore.total} {isFr ? "correct" : "correct"}</p>
                  </div>
                )}
                <div className="flex gap-3 justify-center">
                  <button onClick={() => setViewMode("list")} className="px-4 py-2 rounded-xl text-sm font-medium text-gray-600 border border-gray-200 dark:border-slate-700 dark:border-slate-700 hover:bg-gray-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-gray-300">
                    {isFr ? "Retour à la liste" : "Back to List"}
                  </button>
                  {quizItems.length > 0 && (
                    <button onClick={startQuiz} className="px-4 py-2 rounded-xl text-sm font-semibold text-white focus:outline-none focus:ring-2 focus:ring-teal-700/30" >
                      {isFr ? "Réessayer" : "Try Again"}
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="max-w-lg mx-auto" role="region" aria-label={isFr ? "Quiz de vocabulaire" : "Vocabulary Quiz"}>
                {/* Progress */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden" role="progressbar" aria-valuenow={quizIndex + 1} aria-valuemin={1} aria-valuemax={quizItems.length}>
                    <div className="h-full bg-teal-700 rounded-full transition-all duration-300" style={{ width: `${(quizIndex / quizItems.length) * 100}%` }} />
                  </div>
                  <span className="text-xs text-gray-500 font-medium" aria-live="polite">{quizIndex + 1}/{quizItems.length}</span>
                </div>

                {/* Quiz card */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700 dark:border-slate-700 shadow-sm p-8 text-center mb-6">
                  <span className="text-[10px] text-gray-400 uppercase tracking-wider mb-4 block">{isFr ? "Traduisez ce mot" : "Translate this word"}</span>
                  <p className="text-lg md:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">{quizItems[quizIndex]?.word}</p>
                  {quizItems[quizIndex]?.partOfSpeech && (
                    <p className="text-xs text-gray-400 italic mb-4">({quizItems[quizIndex].partOfSpeech})</p>
                  )}

                  {!quizRevealed ? (
                    <>
                      <label htmlFor="quiz-answer" className="sr-only">{isFr ? "Votre réponse" : "Your answer"}</label>
                      <input id="quiz-answer" type="text" placeholder={isFr ? "Tapez votre réponse..." : "Type your answer..."} value={quizAnswer}
                        onChange={e => setQuizAnswer(e.target.value)}
                        onKeyDown={e => { if (e.key === "Enter") setQuizRevealed(true); }}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 dark:border-slate-700 text-center text-gray-900 dark:text-gray-100 text-base mb-4 focus:outline-none focus:ring-2 focus:ring-teal-700/20"
                        autoFocus />
                      <button onClick={() => setQuizRevealed(true)}
                        className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white focus:outline-none focus:ring-2 focus:ring-teal-700/30" >
                        {t("grammar.checkAnswer")}
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="p-4 rounded-xl bg-gray-50 dark:bg-slate-900 mb-4">
                        <p className="text-xs text-gray-500 mb-1">{isFr ? "Bonne réponse :" : "Correct answer:"}</p>
                        <p className="text-lg font-bold text-teal-700">{quizItems[quizIndex]?.translation}</p>
                        {quizAnswer && (
                          <p className="text-xs text-gray-400 mt-2">{isFr ? "Votre réponse" : "Your answer"}: <span className="font-medium">{quizAnswer}</span></p>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mb-4">{isFr ? "Avez-vous trouvé la bonne réponse ?" : "Did you get it right?"}</p>
                      <div className="flex gap-3 justify-center" role="group" aria-label={t("flashcards.howWell")}>
                        <button onClick={() => handleQuizAnswer(false)}
                          className="px-6 py-2.5 rounded-xl text-sm font-semibold bg-red-50 text-red-600 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-300">
                          {t("grammar.incorrect")}
                        </button>
                        <button onClick={() => handleQuizAnswer(true)}
                          className="px-6 py-2.5 rounded-xl text-sm font-semibold bg-green-50 text-green-600 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-300">
                          {t("grammar.correct")}
                        </button>
                      </div>
                    </>
                  )}
                </div>

                {/* Score + keyboard hint (Sprint F2) */}
                <div className="text-center space-y-2">
                  <div className="text-xs text-gray-400" aria-live="polite">
                    {t("grammar.score")}: {quizScore.correct}/{quizScore.total}
                  </div>
                  <p className="text-[10px] text-gray-400">
                    <span className="material-icons text-[10px] align-middle mr-1" aria-hidden="true">keyboard</span>
                    {isFr ? "Entrée pour vérifier" : "Enter to check"}
                  </p>
                </div>
              </div>
            )
          )}

          {/* Add Word Modal */}
          {showForm && (
            <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label={t("vocab.addWord")} onClick={resetForm}>
              <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">{t("vocab.addWord")}</h2>

                <div className="space-y-3">
                  <div>
                    <label htmlFor="vocab-word" className="text-xs font-medium text-gray-500 mb-1 block">{t("vocab.word")} *</label>
                    <input id="vocab-word" type="text" placeholder={isFr ? "ex. néanmoins" : "e.g., néanmoins"} value={word} onChange={e => setWord(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 dark:border-slate-700 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-teal-700/20 focus:border-teal-700"
                      aria-required="true" autoFocus />
                  </div>
                  <div>
                    <label htmlFor="vocab-translation" className="text-xs font-medium text-gray-500 mb-1 block">{t("vocab.translation")} *</label>
                    <input id="vocab-translation" type="text" placeholder={isFr ? "ex. nevertheless" : "e.g., nevertheless"} value={translation} onChange={e => setTranslation(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 dark:border-slate-700 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-teal-700/20 focus:border-teal-700"
                      aria-required="true" />
                  </div>
                  <div>
                    <label htmlFor="vocab-pos" className="text-xs font-medium text-gray-500 mb-1 block">{isFr ? "Partie du discours" : "Part of Speech"}</label>
                    <select id="vocab-pos" value={partOfSpeech} onChange={e => setPartOfSpeech(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 dark:border-slate-700 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-teal-700/20">
                      <option value="">{isFr ? "Sélectionner..." : "Select..."}</option>
                      {POS_OPTIONS.map(pos => <option key={pos} value={pos}>{pos}</option>)}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="vocab-def" className="text-xs font-medium text-gray-500 mb-1 block">Definition</label>
                    <textarea id="vocab-def" placeholder={isFr ? "Définition optionnelle..." : "Optional definition..."} value={definition} onChange={e => setDefinition(e.target.value)} rows={2}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 dark:border-slate-700 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-teal-700/20 resize-none" />
                  </div>
                  <div>
                    <label htmlFor="vocab-example" className="text-xs font-medium text-gray-500 mb-1 block">{t("vocab.context")}</label>
                    <textarea id="vocab-example" placeholder={isFr ? "Utilisez le mot dans une phrase..." : "Use the word in a sentence..."} value={example} onChange={e => setExample(e.target.value)} rows={2}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 dark:border-slate-700 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-teal-700/20 resize-none" />
                  </div>
                  <div>
                    <label htmlFor="vocab-pron" className="text-xs font-medium text-gray-500 mb-1 block">{isFr ? "Prononciation" : "Pronunciation"}</label>
                    <input id="vocab-pron" type="text" placeholder="e.g., ne.ɑ̃.mwɛ̃" value={pronunciation} onChange={e => setPronunciation(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 dark:border-slate-700 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-teal-700/20" />
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-4">
                  <button onClick={resetForm} className="px-4 py-2 rounded-xl text-sm text-gray-600 hover:bg-gray-100 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-gray-300">{t("flashcards.cancel")}</button>
                  <button onClick={handleAdd}
                    disabled={!word.trim() || !translation.trim() || addItem.isPending}
                    className="px-5 py-2 rounded-xl text-sm font-semibold text-white disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-teal-700/30" >
                    {addItem.isPending ? t("skillLabs.loading") : t("vocab.addWord")}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
