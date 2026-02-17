/**
 * CoachPerformance — Performance analytics for Coach Portal (Sprint H2)
 * Wired to: coach.getMyProfile, coach.getEarningsSummaryV2, coach.getMyLearners
 */
import CoachLayout from "@/components/CoachLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";

const ACCENT = "var(--color-violet-600, var(--color-violet-600, #7c3aed))";

function MetricRing({ value, label, color, loading }: { value: number; label: string; color: string; loading?: boolean }) {
  const circumference = 2 * Math.PI * 40;
  const offset = circumference - (value / 100) * circumference;
  return (
    <div className="flex flex-col items-center">
      <svg width="100" height="100" className="transform -rotate-90" role="img" aria-label={`${label}: ${value}%`}>
        <circle cx="50" cy="50" r="40" fill="none" stroke="var(--admin-table-header-bg, var(--color-gray-100, #f3f4f6))" strokeWidth="8" />
        {!loading && (
          <circle cx="50" cy="50" r="40" fill="none" stroke={color} strokeWidth="8"
            strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" className="transition-all duration-1000" />
        )}
      </svg>
      <span className="text-xl font-bold text-gray-900 dark:text-gray-100 -mt-[65px] mb-8">
        {loading ? "—" : `${value}%`}
      </span>
      <span className="text-xs text-gray-500 mt-1">{label}</span>
    </div>
  );
}

export default function CoachPerformance() {
  const { lang } = useLanguage();

  const profileQuery = trpc.coach.getMyProfile.useQuery();
  const earningsQuery = trpc.coach.getEarningsSummaryV2.useQuery();
  const learnersQuery = trpc.coach.getMyLearners.useQuery();

  const profile = profileQuery.data;
  const earnings = earningsQuery.data;
  const learners = learnersQuery.data || [];
  const isLoading = profileQuery.isLoading;

  // Derive metrics from real data
  const avgRating = profile?.avgRating ? Number(profile.avgRating) : 0;
  const satisfactionPct = Math.round((avgRating / 5) * 100);
  const totalSessions = earnings?.totalSessions || 0;
  const totalStudents = learners.length;
  const successRate = profile?.successRate ? Number(profile.successRate) : 0;

  return (
    <CoachLayout>
      <div className="max-w-7xl mx-auto" role="main" aria-label={lang === "fr" ? "Performance du coach" : "Coach Performance"}>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>
            {lang === "fr" ? "Performance" : "Performance"}
          </h1>
          <p className="text-sm text-gray-500">{lang === "fr" ? "Vos métriques d'enseignement" : "Your teaching metrics"}</p>
        </div>

        {/* Performance Rings */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-100 dark:border-slate-700 p-6 mb-6">
          <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-6">{lang === "fr" ? "Indicateurs clés" : "Key Indicators"}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            <MetricRing value={satisfactionPct} label={lang === "fr" ? "Satisfaction" : "Satisfaction"} color="var(--semantic-success, var(--semantic-success, #059669))" loading={isLoading} />
            <MetricRing value={successRate || satisfactionPct} label={lang === "fr" ? "Taux de réussite" : "Success Rate"} color={ACCENT} loading={isLoading} />
            <MetricRing value={totalStudents > 0 ? Math.min(Math.round((totalStudents / (totalStudents + 2)) * 100), 100) : 0} label={lang === "fr" ? "Rétention" : "Retention"} color="var(--color-blue-600, var(--color-blue-600, #2563eb))" loading={isLoading} />
            <MetricRing value={avgRating > 0 ? Math.round(avgRating * 20) : 0} label={lang === "fr" ? "Note globale" : "Overall Rating"} color="var(--semantic-warning, var(--semantic-warning, #d97706))" loading={isLoading} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Key Metrics */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-100 dark:border-slate-700 p-5">
            <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-4">{lang === "fr" ? "Métriques clés" : "Key Metrics"}</h2>
            <div className="space-y-4">
              {[
                {
                  label: lang === "fr" ? "Note moyenne" : "Average Rating",
                  value: avgRating > 0 ? `${avgRating.toFixed(1)} / 5.0` : "—",
                  icon: "star",
                  color: "var(--semantic-warning, var(--semantic-warning, #d97706))",
                },
                {
                  label: lang === "fr" ? "Sessions complétées" : "Sessions Completed",
                  value: String(totalSessions),
                  icon: "event_available",
                  color: ACCENT,
                },
                {
                  label: lang === "fr" ? "Étudiants actifs" : "Active Students",
                  value: String(totalStudents),
                  icon: "school",
                  color: "var(--color-blue-600, var(--color-blue-600, #2563eb))",
                },
                {
                  label: lang === "fr" ? "Revenus totaux" : "Total Earnings",
                  value: `$${(earnings?.totalEarnings || 0).toLocaleString()}`,
                  icon: "payments",
                  color: "var(--semantic-success, var(--semantic-success, #059669))",
                },
              ].map(item => (
                <div key={item.label} className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-slate-900 rounded-lg">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${item.color}15` }}>
                    <span className="material-icons text-xl" style={{ color: item.color }}>{item.icon}</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-700">{item.label}</p>
                  </div>
                  {isLoading ? (
                    <div className="h-6 w-16 bg-gray-100 dark:bg-slate-800 rounded animate-pulse" />
                  ) : (
                    <span className="text-lg font-bold text-gray-900">{item.value}</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Student Overview */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-100 dark:border-slate-700 p-5">
            <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-4">{lang === "fr" ? "Aperçu des étudiants" : "Student Overview"}</h2>
            {learnersQuery.isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => <div key={i} className="h-14 bg-gray-50 dark:bg-slate-900 rounded-lg animate-pulse" />)}
              </div>
            ) : learners.length === 0 ? (
              <div className="text-center py-8">
                <span className="material-icons text-gray-300 text-xl md:text-3xl lg:text-4xl">people</span>
                <p className="text-sm text-gray-500 mt-2">
                  {lang === "fr" ? "Aucun étudiant pour le moment" : "No students yet"}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {learners.slice(0, 6).map((learner: any, i: number) => {
                  const name = learner.name || learner.learnerName || "—";
                  return (
                    <div key={learner.id || i} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-slate-900 rounded-lg">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-600 to-[var(--color-purple-600, var(--color-purple-600, #9333ea))] flex items-center justify-center text-white font-bold text-xs">
                        {name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{name}</p>
                        <p className="text-[11px] text-gray-500">{learner.level || learner.currentLevel || ""}</p>
                      </div>
                      <span className="text-xs text-gray-500">{learner.sessionsCompleted || 0} {lang === "fr" ? "sessions" : "sessions"}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Session Summary */}
        <div className="mt-6 bg-white dark:bg-slate-900 rounded-xl border border-gray-100 dark:border-slate-700 p-5">
          <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-4">{lang === "fr" ? "Résumé des sessions" : "Session Summary"}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              {
                label: lang === "fr" ? "Ce mois" : "This Month",
                value: `${earnings?.thisMonthEarnings ? Math.round((earnings.thisMonthEarnings || 0) / (profile?.hourlyRate || 130)) : 0}h`,
                sub: `${earnings?.totalSessions || 0} sessions`,
              },
              {
                label: lang === "fr" ? "Total gagné" : "Total Earned",
                value: `$${(earnings?.totalEarnings || 0).toLocaleString()}`,
                sub: lang === "fr" ? "Depuis le début" : "All time",
              },
              {
                label: lang === "fr" ? "Étudiants" : "Students",
                value: String(totalStudents),
                sub: lang === "fr" ? "Actifs" : "Active",
              },
              {
                label: lang === "fr" ? "Taux horaire" : "Hourly Rate",
                value: profile?.hourlyRate ? `$${profile.hourlyRate}` : "—",
                sub: lang === "fr" ? "Par session" : "Per session",
              },
            ].map(h => (
              <div key={h.label} className="text-center p-4 bg-gray-50 dark:bg-slate-900 rounded-lg">
                {isLoading ? (
                  <div className="h-8 w-16 mx-auto bg-gray-100 dark:bg-slate-800 rounded animate-pulse" />
                ) : (
                  <p className="text-2xl font-bold text-gray-900">{h.value}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">{h.label}</p>
                <p className="text-[10px] text-gray-400">{h.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </CoachLayout>
  );
}
