/**
 * Flashcards Page — Deck management + SM-2 spaced repetition review
 * Wave F Sprint F2: Session summary, streak tracking, keyboard shortcuts, session timer
 */
import { useState, useCallback, useEffect, useRef } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { useLanguage } from "@/contexts/LanguageContext";
import Sidebar from "@/components/Sidebar";
import { getLoginUrl } from "@/const";

const DECK_COLORS = ["teal", "blue", "amber", "rose", "purple", "green", "orange"];
const COLOR_MAP: Record<string, { bg: string; text: string; light: string }> = {
  teal: { bg: "bg-teal-700", text: "text-teal-700", light: "bg-teal-50" },
  blue: { bg: "bg-blue-600", text: "text-blue-600", light: "bg-blue-50" },
  amber: { bg: "bg-amber-500", text: "text-amber-600", light: "bg-amber-50" },
  rose: { bg: "bg-rose-500", text: "text-rose-600", light: "bg-rose-50" },
  purple: { bg: "bg-purple-600", text: "text-purple-600", light: "bg-purple-50" },
  green: { bg: "bg-green-600", text: "text-green-600", light: "bg-green-50" },
  orange: { bg: "bg-orange-500", text: "text-orange-600", light: "bg-orange-50" },
};

function getColor(c: string) { return COLOR_MAP[c] ?? COLOR_MAP.teal; }

type ViewMode = "decks" | "cards" | "review" | "summary";

export default function Flashcards() {
  const { user, loading: authLoading } = useAuth();
  const { t } = useLanguage();
  const [collapsed, setCollapsed] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>("decks");
  const [selectedDeckId, setSelectedDeckId] = useState<number | null>(null);
  const [showDeckForm, setShowDeckForm] = useState(false);
  const [showCardForm, setShowCardForm] = useState(false);

  // Deck form
  const [deckName, setDeckName] = useState("");
  const [deckDesc, setDeckDesc] = useState("");
  const [deckColor, setDeckColor] = useState("teal");

  // Card form
  const [cardFront, setCardFront] = useState("");
  const [cardBack, setCardBack] = useState("");
  const [cardHint, setCardHint] = useState("");

  // Review state
  const [reviewIndex, setReviewIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [reviewComplete, setReviewComplete] = useState(false);

  // Session tracking (Sprint F2)
  const [sessionCorrect, setSessionCorrect] = useState(0);
  const [sessionTotal, setSessionTotal] = useState(0);
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);
  const [sessionElapsed, setSessionElapsed] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const utils = trpc.useUtils();
  const { data: decks = [], isLoading: decksLoading } = trpc.flashcards.listDecks.useQuery();
  const { data: stats } = trpc.flashcards.getStats.useQuery();
  const { data: streak } = trpc.flashcards.getStreak.useQuery();
  const { data: cards = [] } = trpc.flashcards.listCards.useQuery(
    { deckId: selectedDeckId! },
    { enabled: !!selectedDeckId && viewMode === "cards" }
  );
  const { data: dueCards = [] } = trpc.flashcards.getDueCards.useQuery(
    { deckId: selectedDeckId ?? undefined },
    { enabled: viewMode === "review" }
  );

  const createDeck = trpc.flashcards.createDeck.useMutation({
    onSuccess: () => { utils.flashcards.listDecks.invalidate(); setShowDeckForm(false); setDeckName(""); setDeckDesc(""); },
  });
  const deleteDeck = trpc.flashcards.deleteDeck.useMutation({
    onSuccess: () => { utils.flashcards.listDecks.invalidate(); setViewMode("decks"); setSelectedDeckId(null); },
  });
  const createCard = trpc.flashcards.createCard.useMutation({
    onSuccess: () => { utils.flashcards.listCards.invalidate(); utils.flashcards.listDecks.invalidate(); utils.flashcards.getStats.invalidate(); setShowCardForm(false); setCardFront(""); setCardBack(""); setCardHint(""); },
  });
  const deleteCard = trpc.flashcards.deleteCard.useMutation({
    onSuccess: () => { utils.flashcards.listCards.invalidate(); utils.flashcards.listDecks.invalidate(); utils.flashcards.getStats.invalidate(); },
  });
  const reviewCard = trpc.flashcards.reviewCard.useMutation({
    onSuccess: () => { utils.flashcards.getStats.invalidate(); utils.flashcards.getDueCards.invalidate(); },
  });
  const recordSession = trpc.flashcards.recordSession.useMutation({
    onSuccess: () => { utils.flashcards.getStreak.invalidate(); },
  });

  // Session timer
  useEffect(() => {
    if (viewMode === "review" && sessionStartTime) {
      timerRef.current = setInterval(() => {
        setSessionElapsed(Math.floor((Date.now() - sessionStartTime) / 1000));
      }, 1000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [viewMode, sessionStartTime]);

  const handleReview = useCallback((quality: number) => {
    if (!dueCards[reviewIndex]) return;
    reviewCard.mutate({ cardId: dueCards[reviewIndex].id, quality });
    setIsFlipped(false);
    setSessionTotal(prev => prev + 1);
    if (quality >= 3) setSessionCorrect(prev => prev + 1);

    if (reviewIndex + 1 >= dueCards.length) {
      setReviewComplete(true);
      if (timerRef.current) clearInterval(timerRef.current);
      // Record session
      const elapsed = sessionStartTime ? Math.floor((Date.now() - sessionStartTime) / 1000) : 0;
      recordSession.mutate({
        cardsReviewed: sessionTotal + 1,
        correctCount: sessionCorrect + (quality >= 3 ? 1 : 0),
        sessionDurationSec: elapsed,
      });
      setViewMode("summary");
    } else {
      setReviewIndex(prev => prev + 1);
    }
  }, [dueCards, reviewIndex, reviewCard, sessionStartTime, sessionTotal, sessionCorrect, recordSession]);

  function startReview(deckId?: number) {
    setSelectedDeckId(deckId ?? null);
    setViewMode("review");
    setReviewIndex(0);
    setIsFlipped(false);
    setReviewComplete(false);
    setSessionCorrect(0);
    setSessionTotal(0);
    setSessionStartTime(Date.now());
    setSessionElapsed(0);
  }

  // Keyboard shortcuts for review (Sprint F2)
  useEffect(() => {
    if (viewMode !== "review" || reviewComplete) return;
    function handleKeyDown(e: KeyboardEvent) {
      // Don't capture if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        setIsFlipped(prev => !prev);
      } else if (isFlipped) {
        if (e.key === "1") handleReview(1);
        else if (e.key === "2") handleReview(3);
        else if (e.key === "3") handleReview(4);
        else if (e.key === "4") handleReview(5);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [viewMode, reviewComplete, isFlipped, handleReview]);

  function formatTime(seconds: number) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return m > 0 ? `${m} ${t("flashcards.min")} ${s} ${t("flashcards.sec")}` : `${s} ${t("flashcards.sec")}`;
  }

  if (authLoading) return (
    <div className="flex items-center justify-center h-screen" role="status" aria-label={t("skillLabs.loading")}>
      <div className="animate-spin w-8 h-8 border-2 border-teal-700 border-t-transparent rounded-full" />
      <span className="sr-only">{t("skillLabs.loading")}</span>
    </div>
  );
  if (!user) {
    window.location.href = getLoginUrl();
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-50/80">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <main className="flex-1 overflow-y-auto" role="main">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{t("flashcards.title")}</h1>
              <p className="text-sm text-gray-500 mt-1">
                {viewMode === "cards" ? decks.find(d => (d as any).id === selectedDeckId)?.title || "" : ""}
              </p>
            </div>
            <div className="flex items-center gap-3">
              {viewMode === "decks" && (
                <>
                  <button onClick={() => startReview()} className="px-4 py-2 rounded-xl text-sm font-semibold text-white hover:shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-[#008090]/30" style={{ background: "#008090" }}
                    aria-label={t("flashcards.startReview")}>
                    <span className="material-icons text-base mr-1 align-middle" aria-hidden="true">play_arrow</span>
                    {t("flashcards.startReview")}
                  </button>
                  <button onClick={() => setShowDeckForm(true)} className="px-4 py-2 rounded-xl text-sm font-semibold border border-gray-200 text-gray-700 hover:bg-gray-50 transition-all focus:outline-none focus:ring-2 focus:ring-[#008090]/30"
                    aria-label={t("flashcards.newDeck")}>
                    <span className="material-icons text-base mr-1 align-middle" aria-hidden="true">add</span>
                    {t("flashcards.newDeck")}
                  </button>
                </>
              )}
              {viewMode === "cards" && (
                <>
                  <button onClick={() => startReview(selectedDeckId ?? undefined)} className="px-4 py-2 rounded-xl text-sm font-semibold text-white hover:shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-[#008090]/30" style={{ background: "#008090" }}
                    aria-label={t("flashcards.startReview")}>
                    <span className="material-icons text-base mr-1 align-middle" aria-hidden="true">play_arrow</span>
                    {t("flashcards.startReview")}
                  </button>
                  <button onClick={() => setShowCardForm(true)} className="px-4 py-2 rounded-xl text-sm font-semibold border border-gray-200 text-gray-700 hover:bg-gray-50 transition-all focus:outline-none focus:ring-2 focus:ring-[#008090]/30"
                    aria-label={t("flashcards.addCard")}>
                    <span className="material-icons text-base mr-1 align-middle" aria-hidden="true">add</span>
                    {t("flashcards.addCard")}
                  </button>
                  <button onClick={() => { setViewMode("decks"); setSelectedDeckId(null); }} className="px-3 py-2 rounded-xl text-sm text-gray-500 hover:bg-gray-100 transition-all focus:outline-none focus:ring-2 focus:ring-[#008090]/30"
                    aria-label={t("flashcards.backToDecks")}>
                    <span className="material-icons text-base mr-1 align-middle" aria-hidden="true">arrow_back</span>
                    {t("flashcards.backToDecks")}
                  </button>
                </>
              )}
              {(viewMode === "review" || viewMode === "summary") && (
                <button onClick={() => { setViewMode("decks"); setSelectedDeckId(null); if (timerRef.current) clearInterval(timerRef.current); }} className="px-3 py-2 rounded-xl text-sm text-gray-500 hover:bg-gray-100 transition-all focus:outline-none focus:ring-2 focus:ring-[#008090]/30"
                  aria-label={t("flashcards.backToDecks")}>
                  <span className="material-icons text-base mr-1 align-middle" aria-hidden="true">arrow_back</span>
                  {t("flashcards.backToDecks")}
                </button>
              )}
            </div>
          </div>

          {/* Stats Bar with Streak (Sprint F2) */}
          {viewMode === "decks" && stats && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
              {[
                { label: t("flashcards.totalDecks"), value: stats.totalDecks, icon: "style", color: "text-teal-700", bg: "bg-teal-50" },
                { label: t("flashcards.totalCards"), value: stats.totalCards, icon: "content_copy", color: "text-blue-600", bg: "bg-blue-50" },
                { label: t("flashcards.dueToday"), value: stats.dueCards, icon: "schedule", color: "text-amber-600", bg: "bg-amber-50" },
                { label: t("flashcards.mastered"), value: stats.mastered, icon: "verified", color: "text-green-600", bg: "bg-green-50" },
                { label: t("flashcards.streak"), value: streak?.currentStreak ?? 0, icon: "local_fire_department", color: "text-orange-600", bg: "bg-orange-50" },
                { label: t("flashcards.accuracy"), value: `${streak?.accuracy ?? 0}%`, icon: "target", color: "text-purple-600", bg: "bg-purple-50" },
              ].map((s, i) => (
                <div key={i} className="bg-white rounded-xl border border-gray-100 p-4 text-center hover:shadow-sm transition-all" role="listitem">
                  <div className={`w-10 h-10 mx-auto mb-2 rounded-xl ${s.bg} flex items-center justify-center`}>
                    <span className={`material-icons text-lg ${s.color}`} aria-hidden="true">{s.icon}</span>
                  </div>
                  <p className="text-xl font-bold text-gray-900">{s.value}</p>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          )}

          {/* Deck Form Modal */}
          {showDeckForm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30" role="dialog" aria-modal="true" aria-label={t("flashcards.newDeck")}>
              <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md mx-4">
                <h2 className="text-lg font-bold text-gray-900 mb-4">{t("flashcards.newDeck")}</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">{t("flashcards.deckName")}</label>
                    <input value={deckName} onChange={e => setDeckName(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#008090]/30" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">{t("flashcards.color")}</label>
                    <div className="flex gap-2" role="radiogroup" aria-label={t("flashcards.color")}>
                      {DECK_COLORS.map(c => (
                        <button key={c} onClick={() => setDeckColor(c)}
                          className={`w-8 h-8 rounded-full ${getColor(c).bg} ${deckColor === c ? "ring-2 ring-offset-2 ring-gray-400" : ""} focus:outline-none focus:ring-2 focus:ring-[#008090]/30`}
                          role="radio" aria-checked={deckColor === c} aria-label={c} />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-2 mt-6">
                  <button onClick={() => setShowDeckForm(false)} className="px-4 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#008090]/30">{t("flashcards.cancel")}</button>
                  <button onClick={() => createDeck.mutate({ title: deckName, description: deckDesc })} disabled={!deckName.trim()}
                    className="px-4 py-2 rounded-lg text-sm font-semibold text-white disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-[#008090]/30" style={{ background: "#008090" }}>{t("flashcards.create")}</button>
                </div>
              </div>
            </div>
          )}

          {/* Card Form Modal */}
          {showCardForm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30" role="dialog" aria-modal="true" aria-label={t("flashcards.addCard")}>
              <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md mx-4">
                <h2 className="text-lg font-bold text-gray-900 mb-4">{t("flashcards.addCard")}</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">{t("flashcards.front")}</label>
                    <input value={cardFront} onChange={e => setCardFront(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#008090]/30" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">{t("flashcards.back")}</label>
                    <input value={cardBack} onChange={e => setCardBack(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#008090]/30" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">{t("flashcards.hint")}</label>
                    <input value={cardHint} onChange={e => setCardHint(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#008090]/30" />
                  </div>
                </div>
                <div className="flex justify-end gap-2 mt-6">
                  <button onClick={() => setShowCardForm(false)} className="px-4 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#008090]/30">{t("flashcards.cancel")}</button>
                  <button onClick={() => { if (selectedDeckId) createCard.mutate({ deckId: selectedDeckId, front: cardFront, back: cardBack, hint: cardHint || undefined }); }} disabled={!cardFront.trim() || !cardBack.trim()}
                    className="px-4 py-2 rounded-lg text-sm font-semibold text-white disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-[#008090]/30" style={{ background: "#008090" }}>{t("flashcards.save")}</button>
                </div>
              </div>
            </div>
          )}

          {/* DECKS VIEW */}
          {viewMode === "decks" && (
            decksLoading ? (
              <div className="text-center py-16" role="status">
                <div className="animate-spin w-8 h-8 mx-auto border-2 border-teal-700 border-t-transparent rounded-full" />
                <span className="sr-only">{t("skillLabs.loading")}</span>
              </div>
            ) : decks.length === 0 ? (
              <div className="text-center py-16" role="status">
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-teal-50 to-cyan-50 flex items-center justify-center">
                  <span className="material-icons text-4xl text-teal-700/60" aria-hidden="true">style</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">{t("flashcards.emptyTitle")}</h3>
                <p className="text-sm text-gray-500 mb-6 max-w-sm mx-auto">{t("flashcards.emptyDesc")}</p>
                <button onClick={() => setShowDeckForm(true)}
                  className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white hover:shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-[#008090]/30" style={{ background: "#008090" }}>
                  <span className="material-icons text-base mr-1 align-middle" aria-hidden="true">add</span>
                  {t("flashcards.newDeck")}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" role="list" aria-label={t("flashcards.title")}>
                {decks.map((deck: any) => {
                  const color = getColor(deck.category || "teal");
                  return (
                    <div key={deck.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden cursor-pointer group hover:shadow-md transition-all focus-within:ring-2 focus-within:ring-[#008090]/30"
                      onClick={() => { setSelectedDeckId(deck.id); setViewMode("cards"); }}
                      role="listitem"
                      aria-label={`${deck.title} — ${deck.cardCount} ${t("flashcards.cards")}`}
                    >
                      <div className={`h-2 ${color.bg}`} />
                      <div className="p-5">
                        <div className="flex items-start justify-between mb-3">
                          <div className={`w-10 h-10 rounded-xl ${color.light} flex items-center justify-center`}>
                            <span className={`material-icons ${color.text}`} aria-hidden="true">style</span>
                          </div>
                          <button onClick={(e) => { e.stopPropagation(); if (confirm(t("flashcards.delete") + "?")) deleteDeck.mutate({ deckId: deck.id }); }}
                            className="p-1.5 rounded-lg hover:bg-gray-100 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity focus:outline-none focus:ring-2 focus:ring-red-300"
                            aria-label={`${t("flashcards.delete")} ${deck.title}`}>
                            <span className="material-icons text-sm text-gray-400" aria-hidden="true">delete</span>
                          </button>
                        </div>
                        <h3 className="text-sm font-bold text-gray-900 mb-1">{deck.title}</h3>
                        {deck.description && <p className="text-xs text-gray-500 mb-3 line-clamp-2">{deck.description}</p>}
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-400">{deck.cardCount} {t("flashcards.cards")}</span>
                          <button onClick={(e) => { e.stopPropagation(); startReview(deck.id); }}
                            className={`px-3 py-1 rounded-lg text-xs font-medium ${color.text} ${color.light} hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-[#008090]/30`}
                            aria-label={`${t("flashcards.startReview")} ${deck.title}`}>
                            {t("flashcards.startReview")}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )
          )}

          {/* CARDS VIEW */}
          {viewMode === "cards" && (
            cards.length === 0 ? (
              <div className="text-center py-16" role="status">
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-teal-50 to-cyan-50 flex items-center justify-center">
                  <span className="material-icons text-4xl text-teal-700/60" aria-hidden="true">content_copy</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">{t("flashcards.emptyCards")}</h3>
                <p className="text-sm text-gray-500 mb-6 max-w-sm mx-auto">{t("flashcards.emptyCardsDesc")}</p>
                <button
                  onClick={() => setShowCardForm(true)}
                  className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white hover:shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-[#008090]/30"
                  style={{ background: "#008090" }}
                >
                  <span className="material-icons text-base mr-1 align-middle" aria-hidden="true">add</span>
                  {t("flashcards.addCard")}
                </button>
              </div>
            ) : (
              <div className="space-y-3" role="list" aria-label={t("flashcards.cards")}>
                {cards.map((card: any, i: number) => {
                  const statusColors: Record<string, string> = {
                    new: "bg-blue-100 text-blue-700",
                    learning: "bg-amber-100 text-amber-700",
                    review: "bg-purple-100 text-purple-700",
                    mastered: "bg-green-100 text-green-700",
                  };
                  const statusLabel = card.interval_days >= 21 ? "mastered" : card.repetitions > 0 ? "review" : card.lastReviewedAt ? "learning" : "new";
                  const statusText: Record<string, string> = {
                    new: t("flashcards.newCards"),
                    learning: t("flashcards.learning"),
                    review: t("flashcards.review"),
                    mastered: t("flashcards.mastered"),
                  };
                  return (
                    <div key={card.id} role="listitem" className="bg-white rounded-xl border border-gray-100 p-4 flex items-start gap-4 group hover:shadow-sm transition-all">
                      <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-xs font-bold text-gray-400 shrink-0" aria-hidden="true">
                        {i + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900 mb-1">{card.front}</p>
                            <p className="text-xs text-gray-500">{card.back}</p>
                            {card.hint && <p className="text-[10px] text-gray-400 mt-1 italic">{t("flashcards.hint")}: {card.hint}</p>}
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${statusColors[statusLabel] ?? statusColors.new}`}>
                              {statusText[statusLabel]}
                            </span>
                            <button onClick={() => { if (selectedDeckId && confirm(t("flashcards.delete") + "?")) deleteCard.mutate({ cardId: card.id }); }}
                              className="p-1 rounded hover:bg-gray-100 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity focus:outline-none focus:ring-2 focus:ring-red-300"
                              aria-label={`${t("flashcards.delete")} card ${i + 1}`}>
                              <span className="material-icons text-sm text-gray-400" aria-hidden="true">delete</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )
          )}

          {/* REVIEW VIEW */}
          {viewMode === "review" && (
            dueCards.length === 0 ? (
              <div className="text-center py-16" role="status">
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center">
                  <span className="material-icons text-4xl text-green-500" aria-hidden="true">check_circle</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">{t("daily.emptyTitle")}</h3>
                <p className="text-sm text-gray-500 mb-6 max-w-sm mx-auto">{t("daily.emptyDesc")}</p>
                <button onClick={() => { setViewMode("decks"); setSelectedDeckId(null); }}
                  className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white hover:shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-[#008090]/30" style={{ background: "#008090" }}>
                  {t("flashcards.backToDecks")}
                </button>
              </div>
            ) : (
              <div className="max-w-lg mx-auto" role="region" aria-label={t("flashcards.startReview")}>
                {/* Progress + Timer */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden" role="progressbar" aria-valuenow={reviewIndex + 1} aria-valuemin={1} aria-valuemax={dueCards.length}>
                    <div className="h-full bg-teal-700 rounded-full transition-all duration-300" style={{ width: `${((reviewIndex) / dueCards.length) * 100}%` }} />
                  </div>
                  <span className="text-xs text-gray-500 font-medium" aria-live="polite">{reviewIndex + 1}/{dueCards.length}</span>
                </div>

                {/* Session timer (Sprint F2) */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <span className="material-icons text-sm" aria-hidden="true">timer</span>
                    <span aria-live="polite">{formatTime(sessionElapsed)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <span className="material-icons text-sm" aria-hidden="true">check_circle</span>
                    <span>{sessionCorrect}/{sessionTotal}</span>
                  </div>
                </div>

                {/* Card */}
                <div
                  className="bg-white rounded-2xl border border-gray-200 shadow-sm min-h-[300px] flex flex-col items-center justify-center p-8 cursor-pointer transition-all hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#008090]/30"
                  onClick={() => setIsFlipped(!isFlipped)}
                  onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setIsFlipped(!isFlipped); }}}
                  tabIndex={0}
                  role="button"
                  aria-label={isFlipped ? dueCards[reviewIndex]?.back : t("flashcards.tapReveal")}
                >
                  {!isFlipped ? (
                    <>
                      <span className="text-[10px] text-gray-400 uppercase tracking-wider mb-4">{t("flashcards.front").split(" ")[0]}</span>
                      <p className="text-xl font-semibold text-gray-900 text-center mb-4">{dueCards[reviewIndex]?.front}</p>
                      {dueCards[reviewIndex]?.hint && (
                        <p className="text-xs text-gray-400 italic">{t("flashcards.hint")}: {dueCards[reviewIndex].hint}</p>
                      )}
                      <p className="text-xs text-gray-400 mt-6">{t("flashcards.tapReveal")}</p>
                    </>
                  ) : (
                    <>
                      <span className="text-[10px] text-teal-700 uppercase tracking-wider mb-4">{t("flashcards.back").split(" ")[0]}</span>
                      <p className="text-xl font-semibold text-gray-900 text-center">{dueCards[reviewIndex]?.back}</p>
                    </>
                  )}
                </div>

                {/* Rating buttons (only when flipped) */}
                {isFlipped && (
                  <div className="mt-6 space-y-3" role="group" aria-label={t("flashcards.howWell")}>
                    <p className="text-xs text-gray-500 text-center font-medium">{t("flashcards.howWell")}</p>
                    <div className="grid grid-cols-4 gap-2">
                      <button onClick={() => handleReview(1)} className="py-3 rounded-xl text-xs font-semibold bg-red-50 text-red-600 hover:bg-red-100 transition-all focus:outline-none focus:ring-2 focus:ring-red-300">
                        <span className="block">1</span>
                        {t("flashcards.again")}
                      </button>
                      <button onClick={() => handleReview(3)} className="py-3 rounded-xl text-xs font-semibold bg-amber-50 text-amber-600 hover:bg-amber-100 transition-all focus:outline-none focus:ring-2 focus:ring-amber-300">
                        <span className="block">2</span>
                        {t("flashcards.hard")}
                      </button>
                      <button onClick={() => handleReview(4)} className="py-3 rounded-xl text-xs font-semibold bg-blue-50 text-blue-600 hover:bg-blue-100 transition-all focus:outline-none focus:ring-2 focus:ring-blue-300">
                        <span className="block">3</span>
                        {t("flashcards.good")}
                      </button>
                      <button onClick={() => handleReview(5)} className="py-3 rounded-xl text-xs font-semibold bg-green-50 text-green-600 hover:bg-green-100 transition-all focus:outline-none focus:ring-2 focus:ring-green-300">
                        <span className="block">4</span>
                        {t("flashcards.easy")}
                      </button>
                    </div>
                    {/* Keyboard shortcut hint (Sprint F2) */}
                    <p className="text-[10px] text-gray-400 text-center mt-2">
                      <span className="material-icons text-[10px] align-middle mr-1" aria-hidden="true">keyboard</span>
                      {t("flashcards.keyboardTip")}
                    </p>
                  </div>
                )}
              </div>
            )
          )}

          {/* SESSION SUMMARY VIEW (Sprint F2) */}
          {viewMode === "summary" && (
            <div className="max-w-lg mx-auto text-center py-8" role="region" aria-label={t("flashcards.sessionSummary")}>
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center">
                <span className="material-icons text-4xl text-green-500" aria-hidden="true">emoji_events</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{t("flashcards.sessionSummary")}</h2>
              <p className="text-sm text-gray-500 mb-8">{t("flashcards.greatSession")}</p>

              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="bg-white rounded-xl border border-gray-100 p-5">
                  <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-blue-50 flex items-center justify-center">
                    <span className="material-icons text-lg text-blue-600" aria-hidden="true">content_copy</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{sessionTotal}</p>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider mt-1">{t("flashcards.cardsReviewed")}</p>
                </div>
                <div className="bg-white rounded-xl border border-gray-100 p-5">
                  <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-green-50 flex items-center justify-center">
                    <span className="material-icons text-lg text-green-600" aria-hidden="true">check_circle</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{sessionTotal > 0 ? Math.round((sessionCorrect / sessionTotal) * 100) : 0}%</p>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider mt-1">{t("flashcards.correctRate")}</p>
                </div>
                <div className="bg-white rounded-xl border border-gray-100 p-5">
                  <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-purple-50 flex items-center justify-center">
                    <span className="material-icons text-lg text-purple-600" aria-hidden="true">timer</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{formatTime(sessionElapsed)}</p>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider mt-1">{t("flashcards.sessionTime")}</p>
                </div>
              </div>

              {/* Streak display */}
              {streak && streak.currentStreak > 0 && (
                <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border border-orange-100 p-5 mb-8">
                  <div className="flex items-center justify-center gap-3">
                    <span className="material-icons text-3xl text-orange-500" aria-hidden="true">local_fire_department</span>
                    <div className="text-left">
                      <p className="text-2xl font-bold text-orange-600">{streak.currentStreak} {t("flashcards.streak")}</p>
                      <p className="text-xs text-orange-500/70">{t("flashcards.keepGoing")}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-center gap-3">
                <button onClick={() => startReview(selectedDeckId ?? undefined)}
                  className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white hover:shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-[#008090]/30" style={{ background: "#008090" }}>
                  <span className="material-icons text-base mr-1 align-middle" aria-hidden="true">play_arrow</span>
                  {t("flashcards.studyMore")}
                </button>
                <button onClick={() => { setViewMode("decks"); setSelectedDeckId(null); }}
                  className="px-6 py-2.5 rounded-xl text-sm font-semibold border border-gray-200 text-gray-700 hover:bg-gray-50 transition-all focus:outline-none focus:ring-2 focus:ring-[#008090]/30">
                  {t("flashcards.backToDecks")}
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
