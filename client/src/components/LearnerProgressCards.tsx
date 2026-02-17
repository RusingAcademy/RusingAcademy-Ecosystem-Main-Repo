import { trpc } from "@/lib/trpc";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Users, TrendingUp, BookOpen, Target } from "lucide-react";

const labels = {
  en: {
    title: "Learner Progress Overview",
    subtitle: "SLE levels and course progress for your learners",
    noLearners: "No learners assigned yet",
    noLearnersDesc: "Learners will appear here once they book sessions with you",
    oral: "Oral",
    written: "Written",
    reading: "Reading",
    sessions: "sessions",
    lastSeen: "Last seen",
    daysAgo: "days ago",
    today: "today",
    active: "Active",
    inactive: "Inactive",
    cohortSummary: "Cohort Summary",
    totalLearners: "Total Learners",
    avgProgress: "Avg Progress",
    activeLearners: "Active",
  },
  fr: {
    title: "Aperçu des progrès",
    subtitle: "Niveaux ELS et progrès des cours pour vos apprenants",
    noLearners: "Aucun apprenant assigné",
    noLearnersDesc: "Les apprenants apparaîtront ici une fois qu'ils auront réservé des sessions",
    oral: "Oral",
    written: "Écrit",
    reading: "Lecture",
    sessions: "sessions",
    lastSeen: "Dernière visite",
    daysAgo: "jours",
    today: "aujourd'hui",
    active: "Actif",
    inactive: "Inactif",
    cohortSummary: "Résumé de la cohorte",
    totalLearners: "Total apprenants",
    avgProgress: "Progrès moyen",
    activeLearners: "Actifs",
  },
};

const levelColors: Record<string, string> = {
  X: "bg-gray-100 dark:bg-card text-gray-700 dark:text-muted-foreground dark:bg-card dark:text-muted-foreground",
  A: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  B: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  C: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
};

export default function LearnerProgressCards() {
  const { language } = useLanguage();
  const t = labels[language === "fr" ? "fr" : "en"];
  const { data: learnersData, isLoading } = trpc.coachMetrics.getLearnersWithMetrics.useQuery();
  const { data: cohortData } = trpc.coachMetrics.getCohortSummary.useQuery();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            {t.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            <div className="h-20 bg-muted rounded-lg" />
            <div className="h-20 bg-muted rounded-lg" />
            <div className="h-20 bg-muted rounded-lg" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const learners = learnersData || [];

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          {t.title}
        </CardTitle>
        <p className="text-sm text-muted-foreground">{t.subtitle}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Cohort Summary Bar */}
        {cohortData && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mb-4">
            <div className="text-center p-3 rounded-lg bg-muted/50">
              <p className="text-2xl font-bold">{cohortData.totalLearners || 0}</p>
              <p className="text-xs text-muted-foreground">{t.totalLearners}</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-muted/50">
              <p className="text-2xl font-bold">{cohortData.activeLearners || 0}</p>
              <p className="text-xs text-muted-foreground">{t.activeLearners}</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-muted/50">
              <p className="text-2xl font-bold flex items-center justify-center gap-1">
                <TrendingUp className="h-4 w-4 text-green-500" />
                {cohortData.avgProgress ? `${Math.round(cohortData.avgProgress)}%` : "N/A"}
              </p>
              <p className="text-xs text-muted-foreground">{t.avgProgress}</p>
            </div>
          </div>
        )}

        {learners.length === 0 ? (
          <div className="text-center py-6">
            <Users className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
            <p className="font-medium">{t.noLearners}</p>
            <p className="text-sm text-muted-foreground">{t.noLearnersDesc}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {learners.slice(0, 8).map((learner: any) => {
              const levels = learner.currentLevel || learner.levels || {};
              const parsedLevels = typeof levels === "string" ? JSON.parse(levels) : levels;
              const daysSinceLogin = learner.daysSinceLastLogin || 0;
              const isActive = daysSinceLogin <= 7;

              return (
                <div
                  key={learner.id || learner.learnerId}
                  className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/30 transition-colors"
                >
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary/10 text-primary text-sm">
                      {(learner.name || learner.learnerName || "L").charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm truncate">
                        {learner.name || learner.learnerName || "Learner"}
                      </p>
                      <Badge variant={isActive ? "default" : "secondary"} className="text-xs">
                        {isActive ? t.active : t.inactive}
                      </Badge>
                    </div>
                    {/* SLE Level Badges */}
                    <div className="flex gap-1.5 mt-1.5">
                      {parsedLevels.oral && (
                        <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-medium ${levelColors[parsedLevels.oral] || levelColors.X}`}>
                          {t.oral}: {parsedLevels.oral}
                        </span>
                      )}
                      {parsedLevels.written && (
                        <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-medium ${levelColors[parsedLevels.written] || levelColors.X}`}>
                          {t.written}: {parsedLevels.written}
                        </span>
                      )}
                      {parsedLevels.reading && (
                        <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-medium ${levelColors[parsedLevels.reading] || levelColors.X}`}>
                          {t.reading}: {parsedLevels.reading}
                        </span>
                      )}
                      {!parsedLevels.oral && !parsedLevels.written && !parsedLevels.reading && (
                        <span className="text-xs text-muted-foreground italic">
                          {language === "fr" ? "Niveaux non définis" : "Levels not set"}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right text-xs text-muted-foreground">
                    <p>{learner.sessionCount || 0} {t.sessions}</p>
                    <p>
                      {daysSinceLogin === 0
                        ? t.today
                        : `${daysSinceLogin} ${t.daysAgo}`}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
