/**
 * Daily Review — Spaced repetition review of due flashcards
 * Wave F: Full bilingual (EN/FR), WCAG 2.1 AA accessibility, professional empty states
 */
import { useState, useCallback } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function DailyReview() {
  const { t } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [reviewed, setReviewed] = useState(0);
  const [sessionComplete, setSessionComplete] = useState(false);

  const dueCards = trpc.dailyReview.getDueCards.useQuery();
  const updateCard = trpc.flashcards.reviewCard.useMutation();

  const cards = dueCards.data || [];
  const currentCard = cards[currentIndex];

  const handleRate = useCallback(async (quality: number) => {
    if (!currentCard) return;
    try {
      await updateCard.mutateAsync({ cardId: currentCard.id, quality });
      setReviewed(prev => prev + 1);
      setShowAnswer(false);
      if (currentIndex < cards.length - 1) {
        setCurrentIndex(prev => prev + 1);
      } else {
        setSessionComplete(true);
      }
    } catch {
      toast.error(t("flashcards.again"));
    }
  }, [currentCard, currentIndex, cards.length, t]);

  const ratingButtons = [
    { quality: 0, label: t("flashcards.again"), color: "bg-red-500 hover:bg-red-600 text-white", desc: t("flashcards.again") },
    { quality: 2, label: t("flashcards.hard"), color: "bg-orange-500 hover:bg-orange-600 text-white", desc: t("flashcards.hard") },
    { quality: 3, label: t("flashcards.good"), color: "bg-blue-500 hover:bg-blue-600 text-white", desc: t("flashcards.good") },
    { quality: 5, label: t("flashcards.easy"), color: "bg-green-500 hover:bg-green-600 text-white", desc: t("flashcards.easy") },
  ];

  return (
    <div className="container max-w-3xl py-8 space-y-6" role="main" aria-label={t("daily.title")}>
      <div>
        <h1 className="text-3xl font-bold text-foreground">{t("daily.title")}</h1>
        <p className="text-muted-foreground mt-1">
          {t("daily.startReview")}
        </p>
      </div>

      {dueCards.isLoading ? (
        <Card>
          <CardContent className="py-16 text-center" role="status" aria-label={t("skillLabs.loading")}>
            <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto" />
            <p className="text-muted-foreground mt-4">{t("skillLabs.loading")}</p>
            <span className="sr-only">{t("skillLabs.loading")}</span>
          </CardContent>
        </Card>
      ) : sessionComplete ? (
        <Card>
          <CardContent className="py-16 text-center space-y-6" role="status">
            <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center">
              <span className="material-icons text-4xl text-green-500" aria-hidden="true">check_circle</span>
            </div>
            <h2 className="text-2xl font-bold">{t("flashcards.reviewComplete")}</h2>
            <p className="text-lg text-muted-foreground">
              {t("flashcards.reviewCompleteDesc")} ({reviewed} {t("daily.cardsReviewed").toLowerCase()})
            </p>
            <div className="flex gap-3 justify-center">
              <Button variant="outline" onClick={() => {
                setCurrentIndex(0);
                setReviewed(0);
                setSessionComplete(false);
                dueCards.refetch();
              }} aria-label={t("daily.startReview")}>
                {t("daily.startReview")}
              </Button>
              <Button onClick={() => window.location.href = "/flashcards"} aria-label={t("flashcards.title")}>
                {t("flashcards.title")}
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : !cards.length ? (
        <Card>
          <CardContent className="py-16 text-center space-y-4" role="status">
            <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-teal-50 to-cyan-50 flex items-center justify-center">
              <span className="material-icons text-4xl text-[#008090]/60" aria-hidden="true">event_available</span>
            </div>
            <h2 className="text-2xl font-bold">{t("daily.emptyTitle")}</h2>
            <p className="text-muted-foreground max-w-sm mx-auto">
              {t("daily.emptyDesc")}
            </p>
            <Button variant="outline" onClick={() => window.location.href = "/flashcards"} aria-label={t("flashcards.title")}>
              {t("flashcards.title")}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {/* Progress bar */}
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>{reviewed} {t("daily.cardsReviewed").toLowerCase()}</span>
            <span aria-live="polite">{cards.length - currentIndex} remaining</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden" role="progressbar" aria-valuenow={currentIndex + 1} aria-valuemin={1} aria-valuemax={cards.length}>
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${(currentIndex / cards.length) * 100}%` }}
            />
          </div>

          {/* Card */}
          {currentCard && (
            <Card className="min-h-[300px]">
              <CardContent className="pt-8 pb-6 flex flex-col items-center justify-center min-h-[300px]">
                {!showAnswer ? (
                  <div className="text-center space-y-6 w-full">
                    <Badge variant="outline" className="mb-4">{t("flashcards.front").split(" ")[0]}</Badge>
                    <h2 className="text-2xl font-bold">{currentCard.front}</h2>
                    {currentCard.hint && (
                      <p className="text-sm text-muted-foreground italic">{t("flashcards.hint")}: {currentCard.hint}</p>
                    )}
                    <Button size="lg" className="mt-8" onClick={() => setShowAnswer(true)} aria-label={t("flashcards.tapReveal")}>
                      {t("flashcards.tapReveal")}
                    </Button>
                  </div>
                ) : (
                  <div className="text-center space-y-6 w-full">
                    <Badge variant="outline" className="mb-2">{t("flashcards.front").split(" ")[0]}</Badge>
                    <h3 className="text-lg text-muted-foreground">{currentCard.front}</h3>
                    <hr className="my-4" />
                    <Badge className="mb-2">{t("flashcards.back").split(" ")[0]}</Badge>
                    <h2 className="text-2xl font-bold text-primary">{currentCard.back}</h2>

                    <div className="grid grid-cols-4 gap-2 pt-6" role="group" aria-label={t("flashcards.howWell")}>
                      {ratingButtons.map(btn => (
                        <button
                          key={btn.quality}
                          onClick={() => handleRate(btn.quality)}
                          className={`p-3 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary ${btn.color}`}
                          disabled={updateCard.isPending}
                          aria-label={btn.label}
                        >
                          <div className="font-semibold text-sm">{btn.label}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Queue indicator */}
          <div className="flex gap-1 flex-wrap justify-center" role="status" aria-label={`${currentIndex + 1} / ${cards.length}`}>
            {cards.slice(0, 20).map((_, i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full transition-all ${
                  i < currentIndex ? "bg-primary" : i === currentIndex ? "bg-primary ring-2 ring-primary/30" : "bg-muted"
                }`}
                aria-hidden="true"
              />
            ))}
            {cards.length > 20 && (
              <span className="text-xs text-muted-foreground ml-1">+{cards.length - 20}</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
