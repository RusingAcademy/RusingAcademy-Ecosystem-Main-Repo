// client/src/components/CoachDashboardWidgets.tsx — Phase 3: Coach Dashboard Analytics
import { useState } from "react";
import { trpc } from "../utils/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguage } from "../contexts/LanguageContext";
import {
  CalendarDays,
  DollarSign,
  Star,
  Users,
  TrendingUp,
  Clock,
  RefreshCw,
  ChevronRight,
  BarChart3,
} from "lucide-react";

const t = {
  en: {
    dashboard: "Coach Dashboard",
    sessions: "Sessions",
    revenue: "Revenue",
    feedback: "Feedback",
    students: "Active Students",
    nextSession: "Next Session",
    noUpcoming: "No upcoming sessions",
    completed: "Completed",
    upcoming: "Upcoming",
    cancelled: "Cancelled",
    completionRate: "Completion Rate",
    avgDuration: "Avg Duration",
    totalEarnings: "Total Earnings",
    thisMonth: "This Month",
    avgPrice: "Avg Session Price",
    avgRating: "Average Rating",
    totalReviews: "Total Reviews",
    refresh: "Refresh",
    viewAll: "View All",
    min: "min",
    noData: "No data yet",
  },
  fr: {
    dashboard: "Tableau de bord Coach",
    sessions: "Sessions",
    revenue: "Revenus",
    feedback: "Évaluations",
    students: "Étudiants actifs",
    nextSession: "Prochaine session",
    noUpcoming: "Aucune session à venir",
    completed: "Complétées",
    upcoming: "À venir",
    cancelled: "Annulées",
    completionRate: "Taux de complétion",
    avgDuration: "Durée moyenne",
    totalEarnings: "Revenus totaux",
    thisMonth: "Ce mois",
    avgPrice: "Prix moyen/session",
    avgRating: "Note moyenne",
    totalReviews: "Total avis",
    refresh: "Actualiser",
    viewAll: "Voir tout",
    min: "min",
    noData: "Aucune donnée",
  },
};

function formatCurrency(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-4 w-4 ${star <= Math.round(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
        />
      ))}
      <span className="ml-1 text-sm font-medium">{rating.toFixed(1)}</span>
    </div>
  );
}

export function CoachDashboardWidgets() {
  const { language } = useLanguage();
  const lang = language === "fr" ? "fr" : "en";
  const labels = t[lang];

  const { data: dashboard, isLoading, refetch } = trpc.coachAnalytics.getDashboard.useQuery(
    undefined,
    { staleTime: 5 * 60 * 1000 }
  );
  const refreshMutation = trpc.coachAnalytics.refreshCache.useMutation({
    onSuccess: () => refetch(),
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-8 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!dashboard) return null;

  const { sessions: sessionStats, revenue, feedback, activeStudents, nextSession } = dashboard;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">{labels.dashboard}</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={() => refreshMutation.mutate()}
          disabled={refreshMutation.isPending}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${refreshMutation.isPending ? "animate-spin" : ""}`} />
          {labels.refresh}
        </Button>
      </div>

      {/* Top Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Sessions */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{labels.sessions}</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sessionStats.total}</div>
            <div className="flex gap-2 mt-1">
              <Badge variant="default" className="text-xs">{sessionStats.completed} {labels.completed}</Badge>
              <Badge variant="secondary" className="text-xs">{sessionStats.upcoming} {labels.upcoming}</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Revenue */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{labels.revenue}</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(revenue.totalEarnings)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {labels.thisMonth}: {formatCurrency(revenue.monthlyEarnings)}
            </p>
          </CardContent>
        </Card>

        {/* Feedback */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{labels.feedback}</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {feedback.totalReviews > 0 ? (
              <>
                <StarRating rating={feedback.averageRating} />
                <p className="text-xs text-muted-foreground mt-1">
                  {feedback.totalReviews} {labels.totalReviews}
                </p>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">{labels.noData}</p>
            )}
          </CardContent>
        </Card>

        {/* Active Students */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{labels.students}</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeStudents}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {labels.completionRate}: {sessionStats.completionRate}%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Next Session */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{labels.nextSession}</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {nextSession ? (
              <div>
                <p className="font-medium">{nextSession.learnerName}</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(nextSession.scheduledAt).toLocaleDateString(lang === "fr" ? "fr-CA" : "en-CA", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">{labels.noUpcoming}</p>
            )}
          </CardContent>
        </Card>

        {/* Performance */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{labels.avgDuration}</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sessionStats.avgDuration} {labels.min}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {labels.avgPrice}: {formatCurrency(revenue.avgSessionPrice)}
            </p>
          </CardContent>
        </Card>

        {/* Trends */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{labels.totalEarnings}</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(revenue.totalEarnings)}</div>
            {revenue.revenueByMonth.length > 0 && (
              <div className="flex items-center gap-1 mt-1">
                <div className="flex gap-0.5">
                  {revenue.revenueByMonth.slice(-6).map((m, i) => (
                    <div
                      key={i}
                      className="w-2 bg-primary rounded-sm"
                      style={{
                        height: `${Math.max(4, (m.amount / Math.max(...revenue.revenueByMonth.map((r) => r.amount))) * 24)}px`,
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
