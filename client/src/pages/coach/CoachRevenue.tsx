/**
 * CoachRevenue — Revenue tracking and earnings for Coach Portal (Sprint H2)
 * Wired to: coach.getEarningsSummaryV2, coach.getPayoutLedger, coach.getMyLearners
 */
import CoachLayout from "@/components/CoachLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";

const ACCENT = "var(--color-violet-600, var(--color-violet-600, #7c3aed))";

function PayoutStatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    paid: "bg-green-50 text-green-700 border-green-200",
    pending: "bg-amber-50 text-amber-700 border-amber-200",
    processing: "bg-blue-50 text-blue-700 border-blue-200",
  };
  return (
    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${styles[status] || styles.pending}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

export default function CoachRevenue() {
  const { lang } = useLanguage();

  const earningsQuery = trpc.coach.getEarningsSummaryV2.useQuery();
  const ledgerQuery = trpc.coach.getPayoutLedger.useQuery();
  const learnersQuery = trpc.coach.getMyLearners.useQuery();

  const earnings = earningsQuery.data;
  const ledger = ledgerQuery.data || [];
  const learnerCount = (learnersQuery.data || []).length;

  const isLoading = earningsQuery.isLoading;

  // Compute commission tier based on learner count
  const getTier = (count: number) => {
    if (count >= 30) return { name: "Platinum", rate: 70, next: null, nextCount: 0 };
    if (count >= 15) return { name: "Gold", rate: 65, next: "Platinum", nextCount: 30 };
    if (count >= 5) return { name: "Silver", rate: 60, next: "Gold", nextCount: 15 };
    return { name: "Bronze", rate: 55, next: "Silver", nextCount: 5 };
  };
  const tier = getTier(learnerCount);

  return (
    <CoachLayout>
      <div className="max-w-7xl mx-auto" role="main" aria-label={lang === "fr" ? "Revenus du coach" : "Coach Revenue"}>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>
            {lang === "fr" ? "Revenus" : "Revenue"}
          </h1>
          <p className="text-sm text-gray-500">{lang === "fr" ? "Suivez vos revenus et paiements" : "Track your earnings and payouts"}</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            {
              icon: "account_balance_wallet",
              label: lang === "fr" ? "En attente" : "Pending Payout",
              value: isLoading ? "..." : `$${(earnings?.pendingPayout || 0).toLocaleString()}`,
              sub: lang === "fr" ? "Prochain paiement" : "Next payout",
            },
            {
              icon: "trending_up",
              label: lang === "fr" ? "Ce mois" : "This Month",
              value: isLoading ? "..." : `$${(earnings?.thisMonthEarnings || 0).toLocaleString()}`,
              sub: `${earnings?.totalSessions || 0} sessions`,
            },
            {
              icon: "payments",
              label: lang === "fr" ? "Total gagné" : "Total Earned",
              value: isLoading ? "..." : `$${(earnings?.totalEarnings || 0).toLocaleString()}`,
              sub: lang === "fr" ? "Depuis le début" : "All time",
            },
            {
              icon: "percent",
              label: lang === "fr" ? "Taux de commission" : "Commission Rate",
              value: `${tier.rate}%`,
              sub: `${tier.name} ${lang === "fr" ? "Niveau" : "Tier"}`,
            },
          ].map(kpi => (
            <div key={kpi.label} className="bg-white dark:bg-background rounded-xl border border-gray-100 dark:border-border p-5 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3" style={{ backgroundColor: `${ACCENT}10` }}>
                <span className="material-icons text-xl" style={{ color: ACCENT }}>{kpi.icon}</span>
              </div>
              <p className="text-xs text-gray-500 mb-1">{kpi.label}</p>
              {isLoading ? (
                <div className="h-8 w-20 bg-gray-100 dark:bg-card rounded animate-pulse" />
              ) : (
                <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
              )}
              <p className="text-[10px] text-gray-400 mt-1">{kpi.sub}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Payout Ledger */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-background rounded-xl border border-gray-100 dark:border-border p-5">
              <h2 className="text-base font-semibold text-gray-900 dark:text-foreground mb-4">
                {lang === "fr" ? "Historique des paiements" : "Payout History"}
              </h2>
              {ledgerQuery.isLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => <div key={i} className="h-12 bg-gray-50 dark:bg-background rounded animate-pulse" />)}
                </div>
              ) : ledger.length === 0 ? (
                <div className="text-center py-8">
                  <span className="material-icons text-gray-300 text-4xl">receipt_long</span>
                  <p className="text-sm text-gray-500 mt-2">
                    {lang === "fr" ? "Aucun paiement pour le moment" : "No payouts yet"}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-100">
                        <th className="text-left py-2 text-xs text-gray-500 font-medium">{lang === "fr" ? "Date" : "Date"}</th>
                        <th className="text-left py-2 text-xs text-gray-500 font-medium">{lang === "fr" ? "Type" : "Type"}</th>
                        <th className="text-right py-2 text-xs text-gray-500 font-medium">{lang === "fr" ? "Brut" : "Gross"}</th>
                        <th className="text-right py-2 text-xs text-gray-500 font-medium">{lang === "fr" ? "Net" : "Net"}</th>
                        <th className="text-right py-2 text-xs text-gray-500 font-medium">{lang === "fr" ? "Statut" : "Status"}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ledger.map((entry: any, i: number) => (
                        <tr key={entry.id || i} className="border-b border-gray-50 last:border-0 hover:bg-gray-50">
                          <td className="py-3 text-sm text-gray-900">
                            {entry.date ? new Date(entry.date).toLocaleDateString(lang === "fr" ? "fr-CA" : "en-CA") : "—"}
                          </td>
                          <td className="py-3 text-sm text-gray-700 dark:text-muted-foreground capitalize">{entry.transactionType || entry.type || "—"}</td>
                          <td className="text-right text-sm text-gray-700">${(entry.grossAmount || 0).toLocaleString()}</td>
                          <td className="text-right text-sm font-semibold text-gray-900">${(entry.netAmount || 0).toLocaleString()}</td>
                          <td className="text-right"><PayoutStatusBadge status={entry.status || "pending"} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Commission Tier */}
            <div className="bg-gradient-to-br from-violet-600 to-[var(--color-violet-700, var(--color-violet-700, #6d28d9))] rounded-xl p-5 text-white">
              <div className="flex items-center gap-2 mb-3">
                <span className="material-icons text-amber-300">emoji_events</span>
                <h3 className="text-sm font-semibold">{lang === "fr" ? "Niveau de commission" : "Commission Tier"}</h3>
              </div>
              <p className="text-3xl font-bold mb-1">{tier.name}</p>
              <p className="text-sm opacity-80 mb-4">{tier.rate}% {lang === "fr" ? "commission" : "commission rate"}</p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="opacity-70">{lang === "fr" ? "Vos étudiants" : "Your Students"}</span>
                  <span className="font-semibold">{learnerCount}</span>
                </div>
                {tier.next && (
                  <>
                    <div className="flex justify-between text-sm">
                      <span className="opacity-70">{lang === "fr" ? "Prochain niveau" : "Next Tier"}</span>
                      <span className="font-semibold">{tier.next} ({tier.nextCount}+)</span>
                    </div>
                    <div className="mt-3 h-2 bg-white dark:bg-background/20 rounded-full overflow-hidden">
                      <div className="h-full bg-white dark:bg-background/80 rounded-full" style={{ width: `${Math.min((learnerCount / tier.nextCount) * 100, 100)}%` }} />
                    </div>
                    <p className="text-[10px] opacity-60 mt-1">
                      {learnerCount}/{tier.nextCount} {lang === "fr" ? `étudiants pour ${tier.next}` : `students to ${tier.next}`}
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* Earnings Breakdown */}
            <div className="bg-white dark:bg-background rounded-xl border border-gray-100 dark:border-border p-5">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-foreground mb-3">
                {lang === "fr" ? "Détails des revenus" : "Earnings Breakdown"}
              </h3>
              {isLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => <div key={i} className="h-6 bg-gray-50 dark:bg-background rounded animate-pulse" />)}
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-1 border-b border-gray-50">
                    <span className="text-xs text-gray-500">{lang === "fr" ? "Sessions totales" : "Total Sessions"}</span>
                    <span className="text-sm font-bold text-gray-900">{earnings?.totalSessions || 0}</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-gray-50">
                    <span className="text-xs text-gray-500">{lang === "fr" ? "Revenu moyen/session" : "Avg Revenue/Session"}</span>
                    <span className="text-sm font-bold text-gray-900">
                      ${earnings?.totalSessions ? Math.round((earnings?.totalEarnings || 0) / earnings.totalSessions) : 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-gray-50">
                    <span className="text-xs text-gray-500">{lang === "fr" ? "Payé à ce jour" : "Paid To Date"}</span>
                    <span className="text-sm font-bold text-gray-900">${((earnings?.totalEarnings || 0) - (earnings?.pendingPayout || 0)).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="text-xs text-gray-500">{lang === "fr" ? "Étudiants actifs" : "Active Students"}</span>
                    <span className="text-sm font-bold text-gray-900">{learnerCount}</span>
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
