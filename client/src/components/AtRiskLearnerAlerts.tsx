import { trpc } from "@/lib/trpc";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AlertTriangle, Clock, TrendingDown, MessageSquare } from "lucide-react";
import { Link } from "wouter";

const labels = {
  en: {
    title: "At-Risk Learners",
    subtitle: "Learners who may need extra attention",
    noAlerts: "All learners are on track!",
    noAlertsDesc: "No at-risk learners detected",
    daysSinceLogin: "days since last login",
    missedSessions: "missed sessions",
    lowProgress: "Low progress",
    sendMessage: "Message",
    viewProfile: "View",
    riskHigh: "High Risk",
    riskMedium: "Medium Risk",
  },
  fr: {
    title: "Apprenants à risque",
    subtitle: "Apprenants qui pourraient avoir besoin d'attention",
    noAlerts: "Tous les apprenants sont sur la bonne voie !",
    noAlertsDesc: "Aucun apprenant à risque détecté",
    daysSinceLogin: "jours depuis la dernière connexion",
    missedSessions: "sessions manquées",
    lowProgress: "Progrès faible",
    sendMessage: "Message",
    viewProfile: "Voir",
    riskHigh: "Risque élevé",
    riskMedium: "Risque moyen",
  },
};

export default function AtRiskLearnerAlerts() {
  const { language } = useLanguage();
  const t = labels[language === "fr" ? "fr" : "en"];
  const { data: atRiskLearners, isLoading } = trpc.coachMetrics.getAtRiskLearners.useQuery();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-amber-600">
            <AlertTriangle className="h-5 w-5" />
            {t.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            <div className="h-16 bg-muted rounded-lg" />
            <div className="h-16 bg-muted rounded-lg" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const learners = atRiskLearners || [];

  return (
    <Card className={learners.length > 0 ? "border-amber-200 dark:border-amber-800" : ""}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
          <AlertTriangle className="h-5 w-5" />
          {t.title}
          {learners.length > 0 && (
            <Badge variant="destructive" className="ml-auto">{learners.length}</Badge>
          )}
        </CardTitle>
        <p className="text-sm text-muted-foreground">{t.subtitle}</p>
      </CardHeader>
      <CardContent>
        {learners.length === 0 ? (
          <div className="text-center py-4">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 mb-2">
              <TrendingDown className="h-6 w-6 text-green-600 rotate-180" />
            </div>
            <p className="font-medium text-green-700 dark:text-green-400">{t.noAlerts}</p>
            <p className="text-sm text-muted-foreground">{t.noAlertsDesc}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {learners.slice(0, 5).map((learner: any) => {
              const daysSinceLogin = learner.daysSinceLastLogin || 0;
              const isHighRisk = daysSinceLogin > 14 || (learner.missedSessions || 0) >= 3;
              return (
                <div
                  key={learner.id || learner.learnerId}
                  className={`flex items-center gap-3 p-3 rounded-lg border ${
                    isHighRisk
                      ? "bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-800"
                      : "bg-amber-50 border-amber-200 dark:bg-amber-950/20 dark:border-amber-800"
                  }`}
                >
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary/10 text-primary text-sm">
                      {(learner.name || learner.learnerName || "L").charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">
                      {learner.name || learner.learnerName || "Learner"}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {daysSinceLogin > 7 && (
                        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {daysSinceLogin} {t.daysSinceLogin}
                        </span>
                      )}
                      {(learner.missedSessions || 0) > 0 && (
                        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                          <AlertTriangle className="h-3 w-3" />
                          {learner.missedSessions} {t.missedSessions}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={isHighRisk ? "destructive" : "secondary"} className="text-xs">
                      {isHighRisk ? t.riskHigh : t.riskMedium}
                    </Badge>
                    <Link href="/coach/portal/messages">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                    </Link>
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
