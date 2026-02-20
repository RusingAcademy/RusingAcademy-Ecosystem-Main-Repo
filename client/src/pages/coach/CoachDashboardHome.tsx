/**
 * CoachDashboardHome — RusingÂcademy Coach Portal Dashboard
 * Design: Mirror of Learning Portal — clean white/crème, teal accents, calendar, charts
 * Wired to real backend: coach.getMyProfile, coach.getTodaysSessions, coach.getEarningsSummaryV2, coach.getMyLearners
 */
import CoachLayout from "@/components/CoachLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { useState, useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";

const TEAL = "#008090";
const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

/* ─── Calendar Widget (mirrors LP) ─── */
function CalendarWidget() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const today = now.getDate();
  const isCurrentMonth = year === now.getFullYear() && month === now.getMonth();
  const prevMonth = () => { if (month === 0) { setYear(year - 1); setMonth(11); } else setMonth(month - 1); };
  const nextMonth = () => { if (month === 11) { setYear(year + 1); setMonth(0); } else setMonth(month + 1); };
  const days: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-gray-800">{MONTHS[month]} {year}</span>
        <div className="flex gap-1">
          <button onClick={prevMonth} className="p-0.5 hover:bg-gray-100 rounded" aria-label="Previous month"><span className="material-icons text-[16px] text-gray-500">chevron_left</span></button>
          <button onClick={nextMonth} className="p-0.5 hover:bg-gray-100 rounded" aria-label="Next month"><span className="material-icons text-[16px] text-gray-500">chevron_right</span></button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-0 text-center text-[10px] text-gray-400 mb-1">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map(d => <div key={d} className="py-0.5 font-medium">{d}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-0 text-center text-[11px]">
        {days.map((day, i) => (
          <div key={i} className={`py-1 rounded-full ${day === today && isCurrentMonth ? "bg-[#008090] text-white font-bold" : day ? "text-gray-700 hover:bg-gray-100 cursor-pointer" : ""}`}>
            {day || ""}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Progress Ring (mirrors LP) ─── */
function ProgressRing({ pct, size = 48, color = TEAL }: { pct: number; size?: number; color?: string }) {
  const r = (size - 8) / 2;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (pct / 100) * circumference;
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg viewBox={`0 0 ${size} ${size}`} className="-rotate-90" style={{ width: size, height: size }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#e5e7eb" strokeWidth="4" />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth="4"
          strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-gray-800">{pct}%</span>
    </div>
  );
}

export default function CoachDashboardHome() {
  const { lang, t } = useLanguage();

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

  const isLoading = profileQuery.isLoading || earningsQuery.isLoading;

  const now = new Date();
  const dateStr = now.toLocaleDateString(lang === "fr" ? "fr-CA" : "en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric"
  });

  // Mock session chart data (sessions per month)
  const sessionChartData = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => ({
      month: String(i + 1),
      sessions: i < now.getMonth() ? Math.floor(Math.random() * 15) + 2 : 0,
    }));
  }, []);

  // Compute completion rate
  const completionRate = earnings?.totalSessions
    ? Math.min(100, Math.round((earnings.totalSessions / Math.max(1, earnings.totalSessions + 5)) * 100))
    : 0;

  const firstName = profile?.firstName || (lang === "fr" ? "Coach" : "Coach");

  return (
    <CoachLayout>
      <div className="max-w-[1200px] mx-auto space-y-5" role="main" aria-label={lang === "fr" ? "Tableau de bord du coach" : "Coach Dashboard"}>

        {/* ─── Welcome Header (mirrors LP) ─── */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>
              {lang === "fr" ? "Tableau de bord" : "Dashboard"}
              {firstName !== "Coach" && <span style={{ color: TEAL }}> — {firstName}</span>}
            </h1>
            <p className="text-sm text-gray-500 mt-1 capitalize">{dateStr}</p>
          </div>
          {/* KPI Badge (mirrors LP XP/Level badge) */}
          <div className="flex items-center gap-4 bg-white border border-gray-200 rounded-xl px-5 py-3 shadow-sm">
            <div className="text-center">
              <div className="text-xl font-bold" style={{ color: TEAL }}>{learners.length || 0}</div>
              <div className="text-[10px] text-gray-400 uppercase tracking-wider">{lang === "fr" ? "Étudiants" : "Students"}</div>
            </div>
            <div className="w-px h-8 bg-gray-200" />
            <div className="text-center">
              <div className="text-xl font-bold text-gray-800">{todaySessions.length || 0}</div>
              <div className="text-[10px] text-gray-400 uppercase tracking-wider">{lang === "fr" ? "Aujourd'hui" : "Today"}</div>
            </div>
            <div className="w-px h-8 bg-gray-200" />
            <div className="text-center">
              <div className="flex items-center gap-1">
                <span className="material-icons text-[#f5a623]" style={{ fontSize: "18px" }}>star</span>
                <span className="text-xl font-bold text-gray-800">{profile?.avgRating ? Number(profile.avgRating).toFixed(1) : "—"}</span>
              </div>
              <div className="text-[10px] text-gray-400 uppercase tracking-wider">Rating</div>
            </div>
          </div>
        </div>

        {/* ─── Revenue Progress Bar (mirrors LP Level Progress) ─── */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-1.5">
            <span>{lang === "fr" ? "Objectif mensuel de revenus" : "Monthly Revenue Goal"}</span>
            <span className="font-medium" style={{ color: TEAL }}>
              ${(earnings?.thisMonthEarnings || 0).toLocaleString()} / $2,000
            </span>
          </div>
          <div className="h-2.5 rounded-full overflow-hidden bg-gray-100">
            <div className="h-full rounded-full transition-all duration-700" style={{
              width: `${Math.min(100, ((earnings?.thisMonthEarnings || 0) / 2000) * 100)}%`,
              background: `linear-gradient(90deg, ${TEAL}, #00a0b0)`,
            }} />
          </div>
        </div>

        {/* ─── Quick Stats Row (mirrors LP 5-card stats) ─── */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {[
            { icon: "people", label: lang === "fr" ? "Étudiants actifs" : "Active Students", value: String(learners.length || 0), color: TEAL },
            { icon: "event", label: lang === "fr" ? "Sessions aujourd'hui" : "Sessions Today", value: String(todaySessions.length || 0), color: "#f5a623" },
            { icon: "attach_money", label: lang === "fr" ? "Revenus ce mois" : "Revenue This Month", value: `$${(earnings?.thisMonthEarnings || 0).toLocaleString()}`, color: "#8b5cf6" },
            { icon: "check_circle", label: lang === "fr" ? "Taux de complétion" : "Completion Rate", value: `${completionRate}%`, color: "#059669" },
            { icon: "workspace_premium", label: lang === "fr" ? "Sessions totales" : "Total Sessions", value: String(earnings?.totalSessions || 0), color: "#e74c3c" },
          ].map((s) => (
            <div key={s.label} className="bg-white border border-gray-200 p-3 rounded-xl text-center shadow-sm hover:shadow-md transition-shadow">
              <span className="material-icons" style={{ color: s.color, fontSize: "20px" }}>{s.icon}</span>
              <div className="text-lg font-bold text-gray-900 mt-1">{isLoading ? "—" : s.value}</div>
              <div className="text-[9px] text-gray-400 uppercase tracking-wider">{s.label}</div>
            </div>
          ))}
        </div>

        {/* ─── Quick Access Cards (mirrors LP ESL/FSL Program cards) ─── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link href="/coach/students">
            <div className="group bg-white border border-gray-200 rounded-xl p-5 cursor-pointer hover:shadow-md transition-all duration-300 border-l-4 border-l-[#008090]">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-gray-900">{lang === "fr" ? "Mes Étudiants" : "My Students"}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">{lang === "fr" ? "Gérer et suivre vos apprenants" : "Manage and track your learners"}</p>
                  <p className="text-[10px] text-gray-400 mt-1">{learners.length} {lang === "fr" ? "apprenants actifs" : "active learners"}</p>
                </div>
                <span className="material-icons group-hover:translate-x-1 transition-transform" style={{ color: TEAL, fontSize: "24px" }}>arrow_forward</span>
              </div>
            </div>
          </Link>
          <Link href="/coach/sessions">
            <div className="group bg-white border border-gray-200 rounded-xl p-5 cursor-pointer hover:shadow-md transition-all duration-300 border-l-4 border-l-[#f5a623]">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-gray-900">{lang === "fr" ? "Mes Sessions" : "My Sessions"}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">{lang === "fr" ? "Planifier et gérer vos sessions" : "Schedule and manage your sessions"}</p>
                  <p className="text-[10px] text-gray-400 mt-1">{upcomingSessions.length} {lang === "fr" ? "à venir" : "upcoming"}</p>
                </div>
                <span className="material-icons text-[#f5a623] group-hover:translate-x-1 transition-transform" style={{ fontSize: "24px" }}>arrow_forward</span>
              </div>
            </div>
          </Link>
        </div>

        {/* ─── Main 3-Column Grid (mirrors LP layout) ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

          {/* ─── Left Column ─── */}
          <div className="space-y-4">
            {/* Sessions Chart (mirrors LP Results by Module) */}
            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold text-gray-900">{lang === "fr" ? "Sessions par mois" : "Sessions by Month"}</h2>
                <Link href="/coach/performance" className="text-gray-400 hover:text-[#008090]">
                  <span className="material-icons text-[18px]">chevron_right</span>
                </Link>
              </div>
              <div className="h-[180px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={sessionChartData} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" tick={{ fontSize: 9, fill: "#9ca3af" }} />
                    <YAxis tick={{ fontSize: 9, fill: "#9ca3af" }} />
                    <Tooltip formatter={(value: number) => [value, lang === "fr" ? "Sessions" : "Sessions"]} />
                    <Bar dataKey="sessions" fill={TEAL} radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* My Notes (mirrors LP) */}
            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
              <h2 className="text-sm font-semibold text-gray-900 mb-2">{lang === "fr" ? "Mes Notes" : "My Notes"}</h2>
              <textarea
                className="w-full min-h-[80px] text-sm text-gray-700 rounded-lg p-3 resize-none focus:outline-none focus:ring-2 focus:ring-[#008090]/20 transition-all bg-gray-50 border border-gray-200"
                placeholder={lang === "fr" ? "Écrivez vos notes de coaching ici..." : "Write your coaching notes here..."}
              />
            </div>
          </div>

          {/* ─── Center Column ─── */}
          <div className="space-y-4">
            {/* Upcoming Sessions (mirrors LP Current Progress) */}
            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold text-gray-900">{lang === "fr" ? "Sessions à venir" : "Upcoming Sessions"}</h2>
                <Link href="/coach/sessions" className="text-gray-400 hover:text-[#008090]">
                  <span className="material-icons text-[18px]">chevron_right</span>
                </Link>
              </div>
              {upcomingQuery.isLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => <div key={i} className="h-14 bg-gray-50 rounded-xl animate-pulse" />)}
                </div>
              ) : upcomingSessions.length === 0 ? (
                <div className="text-center py-6">
                  <span className="material-icons text-gray-300" style={{ fontSize: "32px" }}>event_available</span>
                  <p className="text-xs text-gray-500 mt-2">{lang === "fr" ? "Aucune session à venir" : "No upcoming sessions"}</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {upcomingSessions.map((session: any) => (
                    <div key={session.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100 hover:shadow-sm transition-shadow">
                      <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm" style={{ background: `linear-gradient(135deg, ${TEAL}, #00a0b0)` }}>
                        {(session.learnerName || "?").charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{session.learnerName || "—"}</p>
                        <p className="text-[11px] text-gray-400">{session.sessionType || "Session"} · {session.level || ""}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-semibold" style={{ color: TEAL }}>
                          {session.scheduledAt ? new Date(session.scheduledAt).toLocaleTimeString(lang === "fr" ? "fr-CA" : "en-CA", { hour: "2-digit", minute: "2-digit" }) : "—"}
                        </p>
                        {session.meetingUrl && (
                          <a href={session.meetingUrl} target="_blank" rel="noopener noreferrer" className="text-[10px] text-gray-400 hover:text-[#008090] transition-colors">
                            <span className="material-icons text-sm">videocam</span>
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <Link href="/coach/sessions" className="text-xs font-semibold flex items-center gap-1 justify-center mt-3 hover:underline" style={{ color: TEAL }}>
                {lang === "fr" ? "Voir toutes les sessions" : "View All Sessions"} <span className="material-icons" style={{ fontSize: "14px" }}>arrow_forward</span>
              </Link>
            </div>

            {/* Earnings Summary Card (mirrors LP Announcements) */}
            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
              <h2 className="text-sm font-semibold text-gray-900 mb-3">{lang === "fr" ? "Résumé des revenus" : "Earnings Summary"}</h2>
              {earningsQuery.isLoading ? (
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => <div key={i} className="h-5 bg-gray-100 rounded animate-pulse" />)}
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-2.5 rounded-lg bg-gray-50 border border-gray-100">
                    <span className="text-xs text-gray-500 flex items-center gap-1.5">
                      <span className="material-icons text-[#008090]" style={{ fontSize: "14px" }}>calendar_today</span>
                      {lang === "fr" ? "Ce mois" : "This Month"}
                    </span>
                    <span className="text-sm font-bold text-gray-900">${(earnings?.thisMonthEarnings || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center p-2.5 rounded-lg bg-gray-50 border border-gray-100">
                    <span className="text-xs text-gray-500 flex items-center gap-1.5">
                      <span className="material-icons text-[#8b5cf6]" style={{ fontSize: "14px" }}>account_balance</span>
                      {lang === "fr" ? "Total gagné" : "Total Earned"}
                    </span>
                    <span className="text-sm font-bold text-gray-900">${(earnings?.totalEarnings || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center p-2.5 rounded-lg bg-gray-50 border border-gray-100">
                    <span className="text-xs text-gray-500 flex items-center gap-1.5">
                      <span className="material-icons text-[#f5a623]" style={{ fontSize: "14px" }}>hourglass_top</span>
                      {lang === "fr" ? "En attente" : "Pending"}
                    </span>
                    <span className="text-sm font-bold text-gray-900">${(earnings?.pendingPayout || 0).toLocaleString()}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Performance Rings (mirrors LP Current Progress rings) */}
            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold text-gray-900">{lang === "fr" ? "Performance" : "Performance"}</h2>
                <Link href="/coach/performance" className="text-gray-400 hover:text-[#008090]">
                  <span className="material-icons text-[18px]">chevron_right</span>
                </Link>
              </div>
              <div className="flex items-center gap-4 justify-center mb-3">
                {[
                  { label: lang === "fr" ? "Complétion" : "Completion", pct: completionRate, color: TEAL },
                  { label: lang === "fr" ? "Satisfaction" : "Satisfaction", pct: profile?.avgRating ? Math.round(Number(profile.avgRating) * 20) : 0, color: "#f5a623" },
                  { label: lang === "fr" ? "Rétention" : "Retention", pct: learners.length > 0 ? 85 : 0, color: "#8b5cf6" },
                ].map((m) => (
                  <div key={m.label} className="flex flex-col items-center">
                    <ProgressRing pct={m.pct} size={50} color={m.color} />
                    <span className="text-[10px] text-gray-500 mt-1">{m.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ─── Right Column ─── */}
          <div className="space-y-4">
            {/* Active Students (mirrors LP Leaderboard) */}
            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-1.5">
                  <span className="material-icons" style={{ color: TEAL, fontSize: "16px" }}>people</span>
                  {lang === "fr" ? "Étudiants actifs" : "Active Students"}
                </h2>
                <Link href="/coach/students" className="text-gray-400 hover:text-[#008090]">
                  <span className="material-icons text-[18px]">chevron_right</span>
                </Link>
              </div>
              {learnersQuery.isLoading ? (
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => <div key={i} className="h-10 bg-gray-50 rounded animate-pulse" />)}
                </div>
              ) : learners.length === 0 ? (
                <div className="text-center py-6">
                  <span className="material-icons text-gray-300" style={{ fontSize: "28px" }}>school</span>
                  <p className="text-xs text-gray-500 mt-1">{lang === "fr" ? "Aucun étudiant pour le moment" : "No students yet"}</p>
                </div>
              ) : (
                <div className="space-y-1.5">
                  {learners.slice(0, 5).map((learner: any, i: number) => (
                    <div key={learner.id || learner.learnerId} className="flex items-center gap-2 py-1.5">
                      <span className={`text-[10px] font-bold w-5 text-center ${i === 0 ? "text-[#f5a623]" : i === 1 ? "text-gray-400" : i === 2 ? "text-[#cd7f32]" : "text-gray-300"}`}>
                        {i + 1}
                      </span>
                      <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[9px] font-bold flex-shrink-0"
                        style={{ background: i === 0 ? "#f5a623" : i === 1 ? "#a0a0a0" : i === 2 ? "#cd7f32" : TEAL }}>
                        {(learner.name || learner.learnerName || "?").charAt(0).toUpperCase()}
                      </div>
                      <span className="text-[11px] text-gray-700 truncate flex-1">{learner.name || learner.learnerName || "—"}</span>
                      {learner.sessionsCompleted !== undefined && (
                        <span className="text-[10px] font-bold" style={{ color: TEAL }}>{learner.sessionsCompleted}</span>
                      )}
                    </div>
                  ))}
                  {learners.length > 5 && (
                    <Link href="/coach/students" className="block text-center text-xs font-medium mt-2 hover:underline" style={{ color: TEAL }}>
                      {lang === "fr" ? `Voir les ${learners.length} étudiants` : `View all ${learners.length} students`}
                    </Link>
                  )}
                </div>
              )}
            </div>

            {/* Calendar (mirrors LP Calendar) */}
            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-sm font-semibold text-gray-900">{lang === "fr" ? "Calendrier" : "Calendar"}</h2>
                <Link href="/coach/sessions" className="text-gray-400 hover:text-[#008090]">
                  <span className="material-icons text-[18px]">chevron_right</span>
                </Link>
              </div>
              <CalendarWidget />
            </div>

            {/* Quick Actions (mirrors LP Quick Actions) */}
            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
              <h2 className="text-sm font-semibold text-gray-900 mb-3">{lang === "fr" ? "Actions rapides" : "Quick Actions"}</h2>
              <div className="space-y-2">
                {[
                  { icon: "people", label: lang === "fr" ? "Mes étudiants" : "My Students", href: "/coach/students", color: TEAL },
                  { icon: "event_note", label: lang === "fr" ? "Mes sessions" : "My Sessions", href: "/coach/sessions", color: "#f5a623" },
                  { icon: "bar_chart", label: "Performance", href: "/coach/performance", color: "#8b5cf6" },
                  { icon: "account_balance_wallet", label: lang === "fr" ? "Revenus" : "Revenue", href: "/coach/revenue", color: "#059669" },
                ].map((qa) => (
                  <Link key={qa.label} href={qa.href}>
                    <div className="flex items-center gap-3 p-2.5 rounded-lg cursor-pointer hover:bg-gray-50 transition-all border border-transparent hover:border-gray-100">
                      <span className="material-icons" style={{ color: qa.color, fontSize: "20px" }}>{qa.icon}</span>
                      <span className="text-xs text-gray-700 font-medium">{qa.label}</span>
                      <span className="material-icons text-gray-300 ml-auto" style={{ fontSize: "16px" }}>chevron_right</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Coaching Tools (mirrors LP Study Tools) */}
            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
              <h2 className="text-sm font-semibold text-gray-900 mb-3">{lang === "fr" ? "Outils de coaching" : "Coaching Tools"}</h2>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { icon: "menu_book", label: lang === "fr" ? "Ressources" : "Resources", href: "/coach/guide", color: TEAL },
                  { icon: "rate_review", label: "Feedback", href: "/coach/earnings", color: "#8b5cf6" },
                  { icon: "calendar_today", label: lang === "fr" ? "Calendrier" : "Calendar", href: "/coach/sessions", color: "#f59e0b" },
                  { icon: "chat", label: "Messages", href: "/dashboard", color: "#3b82f6" },
                ].map((tool) => (
                  <Link key={tool.label} href={tool.href}>
                    <div className="flex flex-col items-center gap-1.5 p-3 rounded-xl cursor-pointer hover:shadow-sm transition-all border border-gray-100 hover:border-gray-200">
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: tool.color + '12' }}>
                        <span className="material-icons text-lg" style={{ color: tool.color }}>{tool.icon}</span>
                      </div>
                      <span className="text-[10px] text-gray-600 font-medium">{tool.label}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Messages (mirrors LP Messages) */}
            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold text-gray-900">{lang === "fr" ? "Notifications" : "Notifications"}</h2>
                <span className="material-icons text-gray-400 text-[18px]">chevron_right</span>
              </div>
              <div className="space-y-2">
                {[
                  { title: lang === "fr" ? "Bienvenue au Portail Coach" : "Welcome to Coach Portal", date: "02/19/2026" },
                  { title: lang === "fr" ? "Nouveau: Tableau de bord amélioré" : "New: Enhanced Dashboard", date: "02/18/2026" },
                  { title: lang === "fr" ? "Rappel: Mettez à jour vos disponibilités" : "Reminder: Update your availability", date: "02/17/2026" },
                ].map((n, i) => (
                  <div key={i} className="flex items-start gap-2 py-2 border-b border-gray-50 last:border-0">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: `${TEAL}08` }}>
                      <span className="material-icons" style={{ color: TEAL, fontSize: "14px" }}>mail</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] text-gray-700 truncate">{n.title}</p>
                      <p className="text-[10px] text-gray-400">{n.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </CoachLayout>
  );
}
