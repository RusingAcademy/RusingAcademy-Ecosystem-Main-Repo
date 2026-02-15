/**
 * Flashcards Page — Deck management + SM-2 spaced repetition review
 * Wave F: Full bilingual (EN/FR), WCAG 2.1 AA accessibility, professional empty states
 */
import { useState, useCallback } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { useLanguage } from "@/contexts/LanguageContext";
import Sidebar from "@/components/Sidebar";
import { getLoginUrl } from "@/const";

const DECK_COLORS = ["teal", "blue", "amber", "rose", "purple", "green", "orange"];
const COLOR_MAP: Record<string, { bg: string; text: string; light: string }> = {
  teal: { bg: "bg-[#008090]", text: "text-[#008090]", light: "bg-teal-50" },
  blue: { bg: "bg-blue-600", text: "text-blue-600", light: "bg-blue-50" },
  amber: { bg: "bg-amber-500", text: "text-amber-600", light: "bg-amber-50" },
  rose: { bg: "bg-rose-500", text: "text-rose-600", light: "bg-rose-50" },
  purple: { bg: "bg-purple-600", text: "text-purple-600", light: "bg-purple-50" },
  green: { bg: "bg-green-600", text: "text-green-600", light: "bg-green-50" },
  orange: { bg: "bg-orange-500", text: "text-orange-600", light: "bg-orange-50" },
};

function getColor(c: string) { return COLOR_MAP[c] ?? COLOR_MAP.teal; }

type ViewMode = "decks" | "cards" | "review";

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

  const utils = trpc.useUtils();
  const { data: decks = [], isLoading: decksLoading } = trpc.flashcards.listDecks.useQuery();
  const { data: stats } = trpc.flashcards.getStats.useQuery();
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

  const handleReview = useCallback((quality: number) => {
    if (!dueCards[reviewIndex]) return;
    reviewCard.mutate({ cardId: dueCards[reviewIndex].id, quality });
    setIsFlipped(false);
    if (reviewIndex + 1 >= dueCards.length) {
      setReviewComplete(true);
    } else {
      setReviewIndex(prev => prev + 1);
    }
  }, [dueCards, reviewIndex, reviewCard]);

  function startReview(deckId?: number) {
    setSelectedDeckId(deckId ?? null);
    setViewMode("review");
    setReviewIndex(0);
    setIsFlipped(false);
    setReviewComplete(false);
  }

  if (authLoading) return (
    <div className="flex items-center justify-center h-screen" role="status" aria-label={t("skillLabs.loading")}>
      <div className="animate-spin w-8 h-8 border-2 border-[#008090] border-t-transparent rounded-full" />
      <span className="sr-only">{t("skillLabs.loading")}</span>
    </div>
  );
  if (!user) { window.location.href = getLoginUrl(); return null; }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      <main className="flex-1 lg:ml-[240px] overflow-y-auto" role="main" aria-label={t("flashcards.title")}>
        {/* Mobile header */}
        <div className="lg:hidden flex items-center gap-3 p-4 bg-white border-b border-gray-200 sticky top-0 z-30">
          <button onClick={() => setCollapsed(!collapsed)} className="p-2 rounded-lg hover:bg-gray-100" aria-label="Toggle sidebar">
            <span className="material-icons text-gray-600" aria-hidden="true">menu</span>
          </button>
          <h1 className="text-lg font-semibold text-gray-900">{t("flashcards.title")}</h1>
        </div>

        <div className="max-w-6xl mx-auto p-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-3">
                {viewMode !== "decks" && (
                  <button
                    onClick={() => { setViewMode("decks"); setSelectedDeckId(null); }}
                    className="p-1.5 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#008090]/30"
                    aria-label={t("flashcards.backToDecks")}
                  >
                    <span className="material-icons text-gray-500" aria-hidden="true">arrow_back</span>
                  </button>
                )}
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <span className="material-icons text-[#008090]" aria-hidden="true">style</span>
                    {viewMode === "decks" ? t("flashcards.title") : viewMode === "cards" ? (decks.find(d => d.id === selectedDeckId)?.name ?? t("flashcards.title")) : t("flashcards.startReview")}
                  </h1>
                  <p className="text-sm text-gray-500 mt-1">
                    {viewMode === "decks" ? `${decks.length} ${t("flashcards.cards")} · ${stats?.total ?? 0} ${t("flashcards.totalCards").toLowerCase()} · ${stats?.dueToday ?? 0} ${t("flashcards.due")}` :
                     viewMode === "cards" ? `${cards.length} ${t("flashcards.cards")}` :
                     `${dueCards.length} ${t("flashcards.cards")}`}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex gap-2" role="toolbar" aria-label={t("flashcards.title")}>
              {viewMode === "decks" && (
                <>
                  <button
                    onClick={() => startReview()}
                    disabled={!stats?.dueToday}
                    className="px-4 py-2.5 rounded-xl text-sm font-semibold text-[#008090] border border-[#008090] flex items-center gap-2 hover:bg-[#008090]/5 disabled:opacity-40 focus:outline-none focus:ring-2 focus:ring-[#008090]/30"
                    aria-label={`${t("flashcards.startReview")} (${stats?.dueToday ?? 0})`}
                  >
                    <span className="material-icons text-base" aria-hidden="true">play_arrow</span>
                    {t("flashcards.startReview")} ({stats?.dueToday ?? 0})
                  </button>
                  <button
                    onClick={() => setShowDeckForm(true)}
                    className="px-4 py-2.5 rounded-xl text-sm font-semibold text-white flex items-center gap-2 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#008090]/30"
                    style={{ background: "#008090" }}
                    aria-label={t("flashcards.newDeck")}
                  >
                    <span className="material-icons text-base" aria-hidden="true">add</span>
                    {t("flashcards.newDeck")}
                  </button>
                </>
              )}
              {viewMode === "cards" && (
                <button
                  onClick={() => setShowCardForm(true)}
                  className="px-4 py-2.5 rounded-xl text-sm font-semibold text-white flex items-center gap-2 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#008090]/30"
                  style={{ background: "#008090" }}
                  aria-label={t("flashcards.addCard")}
                >
                  <span className="material-icons text-base" aria-hidden="true">add</span>
                  {t("flashcards.addCard")}
                </button>
              )}
            </div>
          </div>

          {/* Stats Bar */}
          {viewMode === "decks" && stats && stats.total > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6" role="region" aria-label={t("grammar.stats")}>
              {[
                { label: t("flashcards.totalCards"), value: stats.total, icon: "style", color: "#008090" },
                { label: "New", value: stats.new, icon: "fiber_new", color: "#3b82f6" },
                { label: "Learning", value: stats.learning, icon: "school", color: "#f59e0b" },
                { label: t("vocab.review"), value: stats.review, icon: "replay", color: "#8b5cf6" },
                { label: t("flashcards.mastered"), value: stats.mastered, icon: "verified", color: "#22c55e" },
              ].map(s => (
                <div key={s.label} className="bg-white rounded-xl border border-gray-100 p-4 text-center" role="status">
                  <span className="material-icons text-lg mb-1" style={{ color: s.color }} aria-hidden="true">{s.icon}</span>
                  <div className="text-xl font-bold text-gray-900">{s.value}</div>
                  <div className="text-[10px] text-gray-500 uppercase tracking-wider">{s.label}</div>
                </div>
              ))}
            </div>
          )}

          {/* Deck Form Modal */}
          {showDeckForm && (
            <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label={t("flashcards.newDeck")} onClick={() => setShowDeckForm(false)}>
              <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
                <h2 className="text-lg font-bold text-gray-900 mb-4">{t("flashcards.newDeck")}</h2>
                <label htmlFor="deck-name" className="sr-only">{t("flashcards.deckName")}</label>
                <input id="deck-name" type="text" placeholder={t("flashcards.deckName")} value={deckName} onChange={e => setDeckName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-[#008090]/20 focus:border-[#008090]"
                  aria-required="true" autoFocus />
                <label htmlFor="deck-desc" className="sr-only">Description</label>
                <textarea id="deck-desc" placeholder="Description (optional)..." value={deckDesc} onChange={e => setDeckDesc(e.target.value)} rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-[#008090]/20 resize-none" />
                <fieldset className="flex items-center gap-2 mb-4">
                  <legend className="text-xs text-gray-500">{t("flashcards.color")}:</legend>
                  {DECK_COLORS.map(c => (
                    <button key={c} onClick={() => setDeckColor(c)}
                      aria-label={c}
                      aria-pressed={deckColor === c}
                      className={`w-6 h-6 rounded-full ${getColor(c).bg} border-2 ${deckColor === c ? "border-gray-900 ring-2 ring-gray-300" : "border-transparent"} focus:outline-none focus:ring-2 focus:ring-[#008090]/30`} />
                  ))}
                </fieldset>
                <div className="flex justify-end gap-3">
                  <button onClick={() => setShowDeckForm(false)} className="px-4 py-2 rounded-xl text-sm text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300">{t("flashcards.cancel")}</button>
                  <button onClick={() => createDeck.mutate({ name: deckName, description: deckDesc || undefined, color: deckColor })}
                    disabled={!deckName.trim() || createDeck.isPending}
                    className="px-5 py-2 rounded-xl text-sm font-semibold text-white disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-[#008090]/30" style={{ background: "#008090" }}>
                    {createDeck.isPending ? t("skillLabs.loading") : t("flashcards.create")}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Card Form Modal */}
          {showCardForm && (
            <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label={t("flashcards.addCard")} onClick={() => setShowCardForm(false)}>
              <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
                <h2 className="text-lg font-bold text-gray-900 mb-4">{t("flashcards.addCard")}</h2>
                <div className="mb-3">
                  <label htmlFor="card-front" className="text-xs font-medium text-gray-500 mb-1 block">{t("flashcards.front")}</label>
                  <textarea id="card-front" placeholder={t("flashcards.front")} value={cardFront} onChange={e => setCardFront(e.target.value)} rows={3}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#008090]/20 resize-none"
                    aria-required="true" autoFocus />
                </div>
                <div className="mb-3">
                  <label htmlFor="card-back" className="text-xs font-medium text-gray-500 mb-1 block">{t("flashcards.back")}</label>
                  <textarea id="card-back" placeholder={t("flashcards.back")} value={cardBack} onChange={e => setCardBack(e.target.value)} rows={3}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#008090]/20 resize-none"
                    aria-required="true" />
                </div>
                <div className="mb-4">
                  <label htmlFor="card-hint" className="text-xs font-medium text-gray-500 mb-1 block">{t("flashcards.hint")}</label>
                  <input id="card-hint" type="text" placeholder={t("flashcards.hint")} value={cardHint} onChange={e => setCardHint(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#008090]/20" />
                </div>
                <div className="flex justify-end gap-3">
                  <button onClick={() => setShowCardForm(false)} className="px-4 py-2 rounded-xl text-sm text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300">{t("flashcards.cancel")}</button>
                  <button onClick={() => { if (selectedDeckId) createCard.mutate({ deckId: selectedDeckId, front: cardFront, back: cardBack, hint: cardHint || undefined }); }}
                    disabled={!cardFront.trim() || !cardBack.trim() || createCard.isPending}
                    className="px-5 py-2 rounded-xl text-sm font-semibold text-white disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-[#008090]/30" style={{ background: "#008090" }}>
                    {createCard.isPending ? t("skillLabs.loading") : t("flashcards.addCard")}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* DECKS VIEW */}
          {viewMode === "decks" && (
            decksLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" role="status" aria-label={t("skillLabs.loading")}>
                {[1,2,3].map(i => <div key={i} className="h-40 rounded-2xl bg-gray-100 animate-pulse" />)}
                <span className="sr-only">{t("skillLabs.loading")}</span>
              </div>
            ) : decks.length === 0 ? (
              <div className="text-center py-16" role="status">
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-teal-50 to-cyan-50 flex items-center justify-center">
                  <span className="material-icons text-4xl text-[#008090]/60" aria-hidden="true">style</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">{t("flashcards.emptyTitle")}</h3>
                <p className="text-sm text-gray-500 mb-6 max-w-sm mx-auto">{t("flashcards.emptyDesc")}</p>
                <button
                  onClick={() => setShowDeckForm(true)}
                  className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white hover:shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-[#008090]/30"
                  style={{ background: "#008090" }}
                >
                  <span className="material-icons text-base mr-1 align-middle" aria-hidden="true">add</span>
                  {t("flashcards.newDeck")}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" role="list" aria-label={t("flashcards.title")}>
                {decks.map(deck => {
                  const color = getColor(deck.color);
                  return (
                    <div key={deck.id} role="listitem"
                      className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md transition-all group cursor-pointer focus-within:ring-2 focus-within:ring-[#008090]/30"
                      onClick={() => { setSelectedDeckId(deck.id); setViewMode("cards"); }}
                      onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setSelectedDeckId(deck.id); setViewMode("cards"); }}}
                      tabIndex={0}
                      aria-label={`${deck.name} — ${deck.cardCount} ${t("flashcards.cards")}`}
                    >
                      <div className={`h-2 ${color.bg}`} />
                      <div className="p-5">
                        <div className="flex items-start justify-between mb-3">
                          <div className={`w-10 h-10 rounded-xl ${color.light} flex items-center justify-center`}>
                            <span className={`material-icons ${color.text}`} aria-hidden="true">style</span>
                          </div>
                          <button onClick={(e) => { e.stopPropagation(); if (confirm(t("flashcards.delete") + "?")) deleteDeck.mutate({ deckId: deck.id }); }}
                            className="p-1.5 rounded-lg hover:bg-gray-100 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity focus:outline-none focus:ring-2 focus:ring-red-300"
                            aria-label={`${t("flashcards.delete")} ${deck.name}`}>
                            <span className="material-icons text-sm text-gray-400" aria-hidden="true">delete</span>
                          </button>
                        </div>
                        <h3 className="text-sm font-bold text-gray-900 mb-1">{deck.name}</h3>
                        {deck.description && <p className="text-xs text-gray-500 mb-3 line-clamp-2">{deck.description}</p>}
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-400">{deck.cardCount} {t("flashcards.cards")}</span>
                          <button onClick={(e) => { e.stopPropagation(); startReview(deck.id); }}
                            className={`px-3 py-1 rounded-lg text-xs font-medium ${color.text} ${color.light} hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-[#008090]/30`}
                            aria-label={`${t("flashcards.startReview")} ${deck.name}`}>
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
                  <span className="material-icons text-4xl text-[#008090]/60" aria-hidden="true">content_copy</span>
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
                {cards.map((card, i) => {
                  const statusColors: Record<string, string> = {
                    new: "bg-blue-100 text-blue-700",
                    learning: "bg-amber-100 text-amber-700",
                    review: "bg-purple-100 text-purple-700",
                    mastered: "bg-green-100 text-green-700",
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
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${statusColors[card.status] ?? statusColors.new}`}>
                              {card.status}
                            </span>
                            <button onClick={() => { if (selectedDeckId && confirm(t("flashcards.delete") + "?")) deleteCard.mutate({ cardId: card.id, deckId: selectedDeckId }); }}
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
            reviewComplete || dueCards.length === 0 ? (
              <div className="text-center py-16" role="status">
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center">
                  <span className="material-icons text-4xl text-green-500" aria-hidden="true">check_circle</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  {dueCards.length === 0 ? t("daily.emptyTitle") : t("flashcards.reviewComplete")}
                </h3>
                <p className="text-sm text-gray-500 mb-6 max-w-sm mx-auto">
                  {dueCards.length === 0 ? t("daily.emptyDesc") : t("flashcards.reviewCompleteDesc")}
                </p>
                <button onClick={() => { setViewMode("decks"); setSelectedDeckId(null); }}
                  className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white hover:shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-[#008090]/30" style={{ background: "#008090" }}>
                  {t("flashcards.backToDecks")}
                </button>
              </div>
            ) : (
              <div className="max-w-lg mx-auto" role="region" aria-label={t("flashcards.startReview")}>
                {/* Progress */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden" role="progressbar" aria-valuenow={reviewIndex + 1} aria-valuemin={1} aria-valuemax={dueCards.length}>
                    <div className="h-full bg-[#008090] rounded-full transition-all duration-300" style={{ width: `${((reviewIndex) / dueCards.length) * 100}%` }} />
                  </div>
                  <span className="text-xs text-gray-500 font-medium" aria-live="polite">{reviewIndex + 1}/{dueCards.length}</span>
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
                      <span className="text-[10px] text-[#008090] uppercase tracking-wider mb-4">{t("flashcards.back").split(" ")[0]}</span>
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
                        {t("flashcards.again")}
                      </button>
                      <button onClick={() => handleReview(3)} className="py-3 rounded-xl text-xs font-semibold bg-amber-50 text-amber-600 hover:bg-amber-100 transition-all focus:outline-none focus:ring-2 focus:ring-amber-300">
                        {t("flashcards.hard")}
                      </button>
                      <button onClick={() => handleReview(4)} className="py-3 rounded-xl text-xs font-semibold bg-blue-50 text-blue-600 hover:bg-blue-100 transition-all focus:outline-none focus:ring-2 focus:ring-blue-300">
                        {t("flashcards.good")}
                      </button>
                      <button onClick={() => handleReview(5)} className="py-3 rounded-xl text-xs font-semibold bg-green-50 text-green-600 hover:bg-green-100 transition-all focus:outline-none focus:ring-2 focus:ring-green-300">
                        {t("flashcards.easy")}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )
          )}
        </div>
      </main>
    </div>
  );
}
