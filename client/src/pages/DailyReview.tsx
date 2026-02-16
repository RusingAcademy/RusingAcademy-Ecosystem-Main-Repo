/**
 * Daily Review — Spaced repetition review with streak tracking & gamification
 * Sprint F5: Retention loops — streak display, weekly heatmap, XP rewards
 */
import { useState, useCallback, useEffect } from "react";
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
  const [sessionRatings, setSessionRatings] = useState<number[]>([]);
  const [xpReward, setXpReward] = useState<{ xpEarned: number; newStreak: number; levelUp: boolean; newLevel: number } | null>(null);

  const dueCards = trpc.dailyReview.getDueCards.useQuery();
  const updateCard = trpc.flashcards.reviewCard.useMutation();
  const streak = trpc.dailyGoals.getStreak.useQuery();
  const weeklySummary = trpc.dailyGoals.getWeeklySummary.useQuery();
  const recordActivity = trpc.dailyGoals.recordDailyActivity.useMutation();

  const cards = dueCards.data || [];
  const currentCard = cards[currentIndex];
  const streakData = streak.data;
  const weekData = weeklySummary.data?.days || [];

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (sessionComplete || !currentCard) return;
      if (e.code === "Space" && !showAnswer) {
        e.preventDefault();
        setShowAnswer(true);
      }
      if (showAnswer) {
        if (e.key === "1") handleRate(0);
        if (e.key === "2") handleRate(2);
        if (e.key === "3") handleRate(3);
        if (e.key === "4") handleRate(5);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  });

  const handleRate = useCallback(async (quality: number) => {
    if (!currentCard) return;
    try {
      await updateCard.mutateAsync({ cardId: currentCard.id, quality });
      setReviewed(prev => prev + 1);
      setSessionRatings(prev => [...prev, quality]);
      setShowAnswer(false);
      if (currentIndex < cards.length - 1) {
        setCurrentIndex(prev => prev + 1);
      } else {
        setSessionComplete(true);
        // Record activity for gamification
        try {
          const result = await recordActivity.mutateAsync({
            activityType: "flashcard_review",
            itemsCompleted: reviewed + 1,
          });
          setXpReward(result);
          streak.refetch();
          weeklySummary.refetch();
        } catch {
          // Non-critical — don't block session completion
        }
      }
    } catch {
      toast.error(t("flashcards.again"));
    }
  }, [currentCard, currentIndex, cards.length, reviewed, t]);

  const ratingButtons = [
    { quality: 0, label: t("flashcards.again"), color: "bg-red-500 hover:bg-red-600 text-white", key: "1" },
    { quality: 2, label: t("flashcards.hard"), color: "bg-orange-500 hover:bg-orange-600 text-white", key: "2" },
    { quality: 3, label: t("flashcards.good"), color: "bg-blue-500 hover:bg-blue-600 text-white", key: "3" },
    { quality: 5, label: t("flashcards.easy"), color: "bg-green-500 hover:bg-green-600 text-white", key: "4" },
  ];

  const dayNames = ["S", "M", "T", "W", "T", "F", "S"];

  // Session stats
  const avgQuality = sessionRatings.length > 0
    ? sessionRatings.reduce((a, b) => a + b, 0) / sessionRatings.length
    : 0;
  const easyCount = sessionRatings.filter(r => r >= 4).length;
  const goodCount = sessionRatings.filter(r => r === 3).length;
  const hardCount = sessionRatings.filter(r => r === 2).length;
  const againCount = sessionRatings.filter(r => r < 2).length;

  return (
    <div className="container max-w-3xl py-8 space-y-6" role="main" aria-label={t("daily.title")}>
      {/* Header with streak */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{t("daily.title")}</h1>
          <p className="text-muted-foreground mt-1">{t("daily.startReview")}</p>
        </div>
        {streakData && (
          <div className="flex items-center gap-3">
            <div className="text-center">
              <div className="flex items-center gap-1">
                <span className="material-icons text-orange-500" aria-hidden="true">local_fire_department</span>
                <span className="text-2xl font-bold text-orange-500">{streakData.currentStreak}</span>
              </div>
              <p className="text-xs text-muted-foreground">{t("flashcards.streakDays")}</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{streakData.totalXp}</div>
              <p className="text-xs text-muted-foreground">XP</p>
            </div>
          </div>
        )}
      </div>

      {/* Weekly Activity Heatmap */}
      {weekData.length > 0 && (
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-foreground">{t("flashcards.weeklyActivity")}</h3>
              {streakData && (
                <Badge variant={streakData.dailyGoalMet ? "default" : "outline"} className={streakData.dailyGoalMet ? "bg-green-500" : ""}>
                  {streakData.dailyGoalProgress}/{streakData.dailyGoalTarget} {t("daily.cardsReviewed").toLowerCase()}
                </Badge>
              )}
            </div>
            <div className="grid grid-cols-7 gap-2" role="group" aria-label={t("flashcards.weeklyActivity")}>
              {weekData.map((day, i) => {
                const dayOfWeek = new Date(day.date + "T12:00:00").getDay();
                const intensity = day.cardsReviewed === 0 ? 0 : day.cardsReviewed < 5 ? 1 : day.cardsReviewed < 10 ? 2 : 3;
                const colors = ["bg-muted", "bg-green-200 dark:bg-green-900", "bg-green-400 dark:bg-green-700", "bg-green-600 dark:bg-green-500"];
                return (
                  <div key={day.date} className="text-center">
                    <p className="text-xs text-muted-foreground mb-1">{dayNames[dayOfWeek]}</p>
                    <div
                      className={`w-8 h-8 rounded-lg mx-auto flex items-center justify-center text-xs font-medium ${colors[intensity]} ${intensity > 0 ? "text-white" : "text-muted-foreground"}`}
                      title={`${day.date}: ${day.cardsReviewed} cards`}
                      aria-label={`${dayNames[dayOfWeek]}: ${day.cardsReviewed} cards reviewed`}
                    >
                      {day.cardsReviewed || "·"}
                    </div>
                  </div>
                );
              })}
            </div>
            {/* Daily goal progress bar */}
            {streakData && !streakData.dailyGoalMet && (
              <div className="mt-3">
                <div className="h-2 bg-muted rounded-full overflow-hidden" role="progressbar" aria-valuenow={streakData.dailyGoalProgress} aria-valuemax={streakData.dailyGoalTarget}>
                  <div
                    className="h-full bg-primary transition-all duration-500"
                    style={{ width: `${(streakData.dailyGoalProgress / streakData.dailyGoalTarget) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1 text-center">
                  {streakData.dailyGoalTarget - streakData.dailyGoalProgress} more to reach today's goal
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Main content */}
      {dueCards.isLoading ? (
        <Card>
          <CardContent className="py-16 text-center" role="status" aria-label={t("skillLabs.loading")}>
            <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto" />
            <p className="text-muted-foreground mt-4">{t("skillLabs.loading")}</p>
          </CardContent>
        </Card>
      ) : sessionComplete ? (
        <div className="space-y-4">
          {/* XP Reward Banner */}
          {xpReward && (
            <Card className="border-primary/30 bg-gradient-to-r from-primary/5 to-transparent">
              <CardContent className="py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="material-icons text-primary" aria-hidden="true">stars</span>
                  </div>
                  <div>
                    <p className="font-bold text-lg text-primary">+{xpReward.xpEarned} XP</p>
                    <p className="text-sm text-muted-foreground">
                      {xpReward.newStreak} {t("flashcards.streakDays")}
                    </p>
                  </div>
                </div>
                {xpReward.levelUp && (
                  <Badge className="bg-yellow-500 text-white animate-pulse">
                    Level {xpReward.newLevel}!
                  </Badge>
                )}
              </CardContent>
            </Card>
          )}

          {/* Session Summary */}
          <Card>
            <CardContent className="py-8 text-center space-y-6" role="status">
              <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center">
                <span className="material-icons text-4xl text-green-500" aria-hidden="true">check_circle</span>
              </div>
              <h2 className="text-2xl font-bold">{t("flashcards.reviewComplete")}</h2>
              <p className="text-lg text-muted-foreground">
                {reviewed} {t("daily.cardsReviewed").toLowerCase()}
              </p>

              {/* Score breakdown */}
              {sessionRatings.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 max-w-md mx-auto">
                  <div className="text-center p-2 rounded-lg bg-green-50 dark:bg-green-950">
                    <p className="text-lg font-bold text-green-600">{easyCount}</p>
                    <p className="text-xs text-muted-foreground">{t("flashcards.easy")}</p>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-blue-50 dark:bg-blue-950">
                    <p className="text-lg font-bold text-blue-600">{goodCount}</p>
                    <p className="text-xs text-muted-foreground">{t("flashcards.good")}</p>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-orange-50 dark:bg-orange-950">
                    <p className="text-lg font-bold text-orange-600">{hardCount}</p>
                    <p className="text-xs text-muted-foreground">{t("flashcards.hard")}</p>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-red-50 dark:bg-red-950">
                    <p className="text-lg font-bold text-red-600">{againCount}</p>
                    <p className="text-xs text-muted-foreground">{t("flashcards.again")}</p>
                  </div>
                </div>
              )}

              <div className="flex gap-3 justify-center pt-2">
                <Button variant="outline" onClick={() => {
                  setCurrentIndex(0);
                  setReviewed(0);
                  setSessionComplete(false);
                  setSessionRatings([]);
                  setXpReward(null);
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
        </div>
      ) : !cards.length ? (
        <Card>
          <CardContent className="py-16 text-center space-y-4" role="status">
            <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-teal-50 to-cyan-50 flex items-center justify-center">
              <span className="material-icons text-4xl text-teal-700/60" aria-hidden="true">event_available</span>
            </div>
            <h2 className="text-2xl font-bold">{t("daily.emptyTitle")}</h2>
            <p className="text-muted-foreground max-w-sm mx-auto">{t("daily.emptyDesc")}</p>
            {streakData && streakData.currentStreak > 0 && (
              <div className="flex items-center justify-center gap-2 text-orange-500">
                <span className="material-icons" aria-hidden="true">local_fire_department</span>
                <span className="font-semibold">{streakData.currentStreak}-day streak — keep it going!</span>
              </div>
            )}
            <Button variant="outline" onClick={() => window.location.href = "/flashcards"} aria-label={t("flashcards.title")}>
              {t("flashcards.title")}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {/* Progress bar */}
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>{reviewed} / {cards.length} {t("daily.cardsReviewed").toLowerCase()}</span>
            <span className="text-xs" aria-live="polite">
              {t("flashcards.keyboardShortcuts")}: Space / 1-4
            </span>
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
                      {t("flashcards.tapReveal")} <span className="text-xs ml-2 opacity-60">[Space]</span>
                    </Button>
                  </div>
                ) : (
                  <div className="text-center space-y-6 w-full">
                    <Badge variant="outline" className="mb-2">{t("flashcards.front").split(" ")[0]}</Badge>
                    <h3 className="text-lg text-muted-foreground">{currentCard.front}</h3>
                    <hr className="my-4" />
                    <Badge className="mb-2">{t("flashcards.back").split(" ")[0]}</Badge>
                    <h2 className="text-2xl font-bold text-primary">{currentCard.back}</h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 pt-6" role="group" aria-label={t("flashcards.howWell")}>
                      {ratingButtons.map(btn => (
                        <button
                          key={btn.quality}
                          onClick={() => handleRate(btn.quality)}
                          className={`p-3 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary ${btn.color}`}
                          disabled={updateCard.isPending}
                          aria-label={`${btn.label} (${btn.key})`}
                        >
                          <div className="font-semibold text-sm">{btn.label}</div>
                          <div className="text-xs opacity-70">[{btn.key}]</div>
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
