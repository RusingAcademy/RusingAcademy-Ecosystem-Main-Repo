/**
 * CoachDashboardHome — Coach Portal main dashboard (Sprint H2)
 * Wired to real backend: coach.getMyProfile, coach.getTodaysSessions, coach.getEarningsSummaryV2, coach.getMyLearners
 */
import CoachLayout from "@/components/CoachLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";

const ACCENT = "var(--color-violet-600, var(--color-violet-600, #7c3aed))";

function KPICard({ icon, value, label, trend, trendUp, loading }: { icon: string; value: string; label: string; trend?: string; trendUp?: boolean; loading?: boolean }) {
  return (
    <div className="bg-white dark:bg-background rounded-xl border border-gray-100 dark:border-border p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${ACCENT}10` }}>
          <span className="material-icons text-xl" style={{ color: ACCENT }}>{icon}</span>
        </div>
        {trend && (
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${trendUp ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"}`}>
            {trendUp ? "↑" : "↓"} {trend}
          </span>
        )}
      </div>
      {loading ? (
        <div className="h-8 w-16 bg-gray-100 dark:bg-card rounded animate-pulse mt-3" />
      ) : (
        <p className="text-2xl font-bold text-gray-900 dark:text-foreground mt-3">{value}</p>
      )}
      <p className="text-xs text-gray-500 mt-1">{label}</p>
    </div>
  );
}

export default function CoachDashboardHome() {
  const { lang } = useLanguage();

  const profileQuery = trpc.coach.getMyProfile.useQuery();
  const todayQuery = trpc.coach.getTodaysSessions.useQuery();
  const upcomingQuery = trpc.coach.getUpcomingSessions.useQuery({ limit: 5 });
  const earningsQuery = trpc.coach.getEarningsSummaryV2.useQuery();
  const learnersQuery = trpc.coach.getMyLearners.useQuery();

  const profile = profileQuery.data;
  const todaySessions = todayQuery.data || [];
  const upcomingSessions = upcomingQuery.data || [];
  const earnings = earningsQuery.data;
  const learners = learnersQuery.data || [];

  const now = new Date();
  const dateStr = now.toLocaleDateString(lang === "fr" ? "fr-CA" : "en-CA", {
    weekday: "long", year: "numeric", month: "long", day: "numeric"
  });

  const isLoading = profileQuery.isLoading || earningsQuery.isLoading;

  return (
    <CoachLayout>
      <div className="max-w-7xl mx-auto" role="main" aria-label={lang === "fr" ? "Tableau de bord du coach" : "Coach Dashboard"}>
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>
            {lang === "fr" ? "Tableau de bord" : "Dashboard"}
            {profile?.firstName && <span className="text-violet-600"> — {profile.firstName}</span>}
          </h1>
          <p className="text-sm text-gray-500 capitalize">{dateStr}</p>
        </div>

        {/* KPI Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <KPICard
            icon="people"
            value={String(learners.length || 0)}
            label={lang === "fr" ? "Étudiants actifs" : "Active Students"}
            loading={learnersQuery.isLoading}
          />
          <KPICard
            icon="event"
            value={String(todaySessions.length || 0)}
            label={lang === "fr" ? "Sessions aujourd'hui" : "Sessions Today"}
            loading={todayQuery.isLoading}
          />
          <KPICard
            icon="attach_money"
            value={earnings ? `$${(earnings.thisMonthEarnings || 0).toLocaleString()}` : "$0"}
            label={lang === "fr" ? "Revenus ce mois" : "Revenue This Month"}
            loading={earningsQuery.isLoading}
          />
          <KPICard
            icon="star"
            value={profile?.avgRating ? Number(profile.avgRating).toFixed(1) : "—"}
            label={lang === "fr" ? "Note moyenne" : "Average Rating"}
            loading={profileQuery.isLoading}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Upcoming Sessions */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-background rounded-xl border border-gray-100 dark:border-border p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-semibold text-gray-900">
                  {lang === "fr" ? "Sessions à venir" : "Upcoming Sessions"}
                </h2>
                <Link href="/coach/sessions" className="text-xs text-violet-600 font-medium hover:underline">
                  {lang === "fr" ? "Voir tout" : "View All"} →
                </Link>
              </div>
              {upcomingQuery.isLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-16 bg-gray-50 dark:bg-background rounded-xl animate-pulse" />
                  ))}
                </div>
              ) : upcomingSessions.length === 0 ? (
                <div className="text-center py-8">
                  <span className="material-icons text-gray-300 text-xl md:text-3xl lg:text-4xl">event_available</span>
                  <p className="text-sm text-gray-500 mt-2">
                    {lang === "fr" ? "Aucune session à venir" : "No upcoming sessions"}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {upcomingSessions.map((session: any) => (
                    <div key={session.id} className="flex items-center gap-4 p-4 bg-white dark:bg-background rounded-xl border border-gray-100 dark:border-border hover:shadow-sm transition-shadow">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-600 to-[var(--color-purple-600, var(--color-purple-600, #9333ea))] flex items-center justify-center text-white font-bold text-sm">
                        {(session.learnerName || "?").charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-foreground truncate">{session.learnerName || "—"}</p>
                        <p className="text-xs text-gray-500">{session.sessionType || "Session"} · {session.level || ""}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-semibold text-violet-600">
                          {session.scheduledAt ? new Date(session.scheduledAt).toLocaleTimeString(lang === "fr" ? "fr-CA" : "en-CA", { hour: "2-digit", minute: "2-digit" }) : "—"}
                        </p>
                        {session.meetingUrl && (
                          <a href={session.meetingUrl} target="_blank" rel="noopener noreferrer" className="text-[10px] text-gray-400 hover:text-violet-600 mt-0.5 transition-colors">
                            <span className="material-icons text-sm">videocam</span>
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { icon: "people", label: lang === "fr" ? "Mes étudiants" : "My Students", href: "/coach/students", color: "var(--color-violet-600, var(--color-violet-600, #7c3aed))" },
                { icon: "event_note", label: lang === "fr" ? "Mes sessions" : "My Sessions", href: "/coach/sessions", color: "var(--color-blue-600, var(--color-blue-600, #2563eb))" },
                { icon: "bar_chart", label: lang === "fr" ? "Performance" : "Performance", href: "/coach/performance", color: "var(--semantic-success, var(--semantic-success, #059669))" },
                { icon: "account_balance_wallet", label: lang === "fr" ? "Revenus" : "Revenue", href: "/coach/revenue", color: "var(--semantic-warning, var(--semantic-warning, #d97706))" },
              ].map((action) => (
                <Link key={action.label} href={action.href}>
                  <button className="w-full flex flex-col items-center gap-2 p-4 bg-white dark:bg-background rounded-xl border border-gray-100 dark:border-border hover:shadow-md transition-all group">
                    <span className="material-icons text-2xl transition-transform group-hover:scale-110" style={{ color: action.color }}>
                      {action.icon}
                    </span>
                    <span className="text-xs font-medium text-gray-700 dark:text-muted-foreground text-center">{action.label}</span>
                  </button>
                </Link>
              ))}
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Active Learners */}
            <div className="bg-white dark:bg-background rounded-xl border border-gray-100 dark:border-border p-5">
              <h2 className="text-base font-semibold text-gray-900 dark:text-foreground mb-4">
                {lang === "fr" ? "Étudiants actifs" : "Active Students"}
              </h2>
              {learnersQuery.isLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => <div key={i} className="h-10 bg-gray-50 dark:bg-background rounded animate-pulse" />)}
                </div>
              ) : learners.length === 0 ? (
                <div className="text-center py-6">
                  <span className="material-icons text-gray-300 text-lg md:text-2xl lg:text-3xl">school</span>
                  <p className="text-xs text-gray-500 mt-1">
                    {lang === "fr" ? "Aucun étudiant pour le moment" : "No students yet"}
                  </p>
                </div>
              ) : (
                <div>
                  {learners.slice(0, 5).map((learner: any) => (
                    <div key={learner.id || learner.learnerId} className="flex items-center gap-3 py-3 border-b border-gray-50 last:border-0">
                      <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-card flex items-center justify-center text-gray-600 font-semibold text-xs">
                        {(learner.name || learner.learnerName || "?").charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-800 dark:text-foreground truncate">{learner.name || learner.learnerName || "—"}</p>
                        <p className="text-[11px] text-gray-400">{learner.level || learner.currentLevel || ""}</p>
                      </div>
                      {learner.sessionsCompleted !== undefined && (
                        <span className="text-xs text-gray-500">{learner.sessionsCompleted} {lang === "fr" ? "sessions" : "sessions"}</span>
                      )}
                    </div>
                  ))}
                  {learners.length > 5 && (
                    <Link href="/coach/students" className="block text-center text-xs text-violet-600 font-medium mt-3 hover:underline">
                      {lang === "fr" ? `Voir les ${learners.length} étudiants` : `View all ${learners.length} students`}
                    </Link>
                  )}
                </div>
              )}
            </div>

            {/* Earnings Summary */}
            <div className="bg-gradient-to-br from-violet-600 to-[var(--color-violet-700, var(--color-violet-700, #6d28d9))] rounded-xl p-5 text-white">
              <h3 className="text-sm font-semibold mb-3 opacity-90">
                {lang === "fr" ? "Résumé des revenus" : "Earnings Summary"}
              </h3>
              {earningsQuery.isLoading ? (
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => <div key={i} className="h-5 bg-white dark:bg-background/10 rounded animate-pulse" />)}
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="opacity-80">{lang === "fr" ? "Ce mois" : "This Month"}</span>
                    <span className="font-bold">${(earnings?.thisMonthEarnings || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="opacity-80">{lang === "fr" ? "Total gagné" : "Total Earned"}</span>
                    <span className="font-bold">${(earnings?.totalEarnings || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="opacity-80">{lang === "fr" ? "En attente" : "Pending"}</span>
                    <span className="font-bold">${(earnings?.pendingPayout || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="opacity-80">{lang === "fr" ? "Sessions totales" : "Total Sessions"}</span>
                    <span className="font-bold">{earnings?.totalSessions || 0}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </CoachLayout>
  );
}
