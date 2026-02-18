/**
 * CoachSessions — Session scheduling and management for Coach Portal (Sprint H2)
 * Wired to: coach.getUpcomingSessions, coach.getMonthSessions, coach.confirmSession, coach.declineSession, coach.completeSession
 */
import CoachLayout from "@/components/CoachLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { toast } from "sonner";

const ACCENT = "var(--color-violet-600, var(--color-violet-600, var(--accent-purple)))";
const MONTHS_EN = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

function SessionStatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    confirmed: "bg-green-50 text-green-700 border-green-200",
    pending: "bg-amber-50 text-amber-700 border-amber-200",
    completed: "bg-blue-50 text-blue-700 border-blue-200",
    cancelled: "bg-red-50 text-red-500 border-red-200",
    scheduled: "bg-purple-50 text-purple-700 border-purple-200",
  };
  return (
    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${styles[status] || styles.pending}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

function CalendarWidget({ sessions, lang }: { sessions: any[]; lang: string }) {
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

  const sessionDays = new Set(
    sessions
      .filter((s: any) => s.scheduledAt)
      .map((s: any) => {
        const d = new Date(s.scheduledAt);
        return d.getFullYear() === year && d.getMonth() === month ? d.getDate() : null;
      })
      .filter(Boolean)
  );

  return (
    <div className="bg-white dark:bg-white/[0.08] dark:backdrop-blur-md rounded-xl border border-gray-100 dark:border-white/15 p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-semibold text-gray-800">{MONTHS_EN[month]} {year}</span>
        <div className="flex gap-1">
          <button aria-label="Action" onClick={prevMonth} className="p-1 hover:bg-gray-100 dark:bg-white/[0.08] dark:backdrop-blur-md dark:border-white/15 rounded"><span className="material-icons text-lg text-gray-500">chevron_left</span></button>
          <button aria-label="Action" onClick={nextMonth} className="p-1 hover:bg-gray-100 dark:bg-white/[0.08] dark:backdrop-blur-md dark:border-white/15 rounded"><span className="material-icons text-lg text-gray-500">chevron_right</span></button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-0 text-center text-[10px] text-gray-400 mb-1">
        {(lang === "fr" ? ["Di", "Lu", "Ma", "Me", "Je", "Ve", "Sa"] : ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]).map(d => <div key={d} className="py-1 font-medium">{d}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-0 text-center text-xs">
        {days.map((day, i) => (
          <div key={i} className={`py-1.5 rounded-full relative cursor-pointer ${
            day === today && isCurrentMonth ? "bg-violet-600 text-white font-bold" :
            day ? "text-gray-700 dark:text-muted-foreground hover:bg-gray-100 dark:bg-white/[0.06] dark:backdrop-blur-sm" : ""
          }`}>
            {day || ""}
            {day && sessionDays.has(day) && (
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-violet-600" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function CoachSessions() {
  const { lang } = useLanguage();
  const [filter, setFilter] = useState<string>("all");

  const upcomingQuery = trpc.coach.getUpcomingSessions.useQuery({ limit: 20 });
  const monthQuery = trpc.coach.getMonthSessions.useQuery({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  });
  const pendingQuery = trpc.coach.getPendingRequests.useQuery();

  const confirmMutation = trpc.coach.confirmSession.useMutation({
    onSuccess: () => { toast.success(lang === "fr" ? "Session confirmée" : "Session confirmed"); upcomingQuery.refetch(); pendingQuery.refetch(); },
  });
  const declineMutation = trpc.coach.declineSession.useMutation({
    onSuccess: () => { toast.success(lang === "fr" ? "Session déclinée" : "Session declined"); pendingQuery.refetch(); },
  });
  const completeMutation = trpc.coach.completeSession.useMutation({
    onSuccess: () => { toast.success(lang === "fr" ? "Session complétée" : "Session completed"); upcomingQuery.refetch(); },
  });

  const allSessions = upcomingQuery.data || [];
  const monthSessions = monthQuery.data || [];
  const pendingSessions = pendingQuery.data || [];
  const filtered = filter === "all" ? allSessions : allSessions.filter((s: any) => s.status === filter);
  const isLoading = upcomingQuery.isLoading;

  return (
    <CoachLayout>
      <div className="max-w-7xl mx-auto" role="main" aria-label={lang === "fr" ? "Sessions de coaching" : "Coaching Sessions"}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>
              {lang === "fr" ? "Sessions" : "Sessions"}
            </h1>
            <p className="text-sm text-gray-500">{lang === "fr" ? "Gérez vos sessions de coaching" : "Manage your coaching sessions"}</p>
          </div>
        </div>

        {/* Pending Requests Banner */}
        {pendingSessions.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
            <h3 className="text-sm font-semibold text-amber-800 mb-2">
              {lang === "fr" ? `${pendingSessions.length} demande(s) en attente` : `${pendingSessions.length} pending request(s)`}
            </h3>
            <div className="space-y-2">
              {pendingSessions.map((s: any) => (
                <div key={s.id} className="flex items-center justify-between bg-white dark:bg-white/[0.08] dark:backdrop-blur-md rounded-lg p-3 border border-amber-100">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{s.learnerName || "—"}</p>
                    <p className="text-xs text-gray-500">
                      {s.scheduledAt ? new Date(s.scheduledAt).toLocaleString(lang === "fr" ? "fr-CA" : "en-CA") : "—"} · {s.sessionType || "Session"}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => confirmMutation.mutate({ sessionId: s.id })}
                      className="text-xs px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                      {lang === "fr" ? "Confirmer" : "Confirm"}
                    </button>
                    <button onClick={() => declineMutation.mutate({ sessionId: s.id, reason: "Declined by coach" })}
                      className="text-xs px-3 py-1.5 bg-gray-100 dark:bg-white/[0.08] dark:backdrop-blur-md dark:border-white/15 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors">
                      {lang === "fr" ? "Décliner" : "Decline"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Session List */}
          <div className="lg:col-span-2">
            <div className="flex gap-2 mb-4 flex-wrap">
              {(["all", "confirmed", "pending", "completed", "cancelled"] as const).map(f => (
                <button key={f} onClick={() => setFilter(f)}
                  className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all ${filter === f ? "bg-violet-600 text-white" : "bg-gray-100 dark:bg-white/[0.08] dark:backdrop-blur-md dark:border-white/15 text-gray-600 hover:bg-gray-200"}`}>
                  {f === "all" ? (lang === "fr" ? "Tous" : "All") : f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>

            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => <div key={i} className="h-20 bg-gray-50 dark:bg-white/[0.08] dark:backdrop-blur-md rounded-xl animate-pulse" />)}
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-6 md:py-8 lg:py-12 bg-white dark:bg-white/[0.08] dark:backdrop-blur-md rounded-xl border border-gray-100">
                <span className="material-icons text-gray-300 text-2xl md:text-4xl lg:text-5xl">event_busy</span>
                <p className="text-sm text-gray-500 mt-2">
                  {lang === "fr" ? "Aucune session trouvée" : "No sessions found"}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filtered.map((session: any) => {
                  const dt = session.scheduledAt ? new Date(session.scheduledAt) : null;
                  return (
                    <div key={session.id} className="bg-white dark:bg-white/[0.08] dark:backdrop-blur-md rounded-xl border border-gray-100 dark:border-white/15 p-4 hover:shadow-md transition-shadow flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg flex flex-col items-center justify-center bg-violet-600/5 border border-violet-600/10">
                        {dt ? (
                          <>
                            <span className="text-[10px] font-bold text-violet-600 uppercase">{MONTHS_EN[dt.getMonth()]}</span>
                            <span className="text-lg font-bold text-gray-900">{dt.getDate()}</span>
                          </>
                        ) : (
                          <span className="material-icons text-gray-300">event</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-sm font-semibold text-gray-900">{session.learnerName || "—"}</p>
                          <SessionStatusBadge status={session.status || "pending"} />
                        </div>
                        <p className="text-xs text-gray-500">{session.sessionType || "Session"} · {session.duration || 60} min</p>
                      </div>
                      <div className="text-right flex flex-col items-end gap-1">
                        <p className="text-sm font-semibold text-violet-600">
                          {dt ? dt.toLocaleTimeString(lang === "fr" ? "fr-CA" : "en-CA", { hour: "2-digit", minute: "2-digit" }) : "—"}
                        </p>
                        {session.status === "confirmed" && session.meetingUrl && (
                          <a href={session.meetingUrl} target="_blank" rel="noopener noreferrer"
                            className="text-[11px] text-gray-400 hover:text-violet-600 flex items-center gap-0.5">
                            <span className="material-icons text-sm">videocam</span> Join
                          </a>
                        )}
                        {session.status === "confirmed" && (
                          <button onClick={() => completeMutation.mutate({ sessionId: session.id })}
                            className="text-[11px] text-gray-400 hover:text-green-600 flex items-center gap-0.5">
                            <span className="material-icons text-sm">check_circle</span>
                            {lang === "fr" ? "Terminer" : "Complete"}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <CalendarWidget sessions={monthSessions} lang={lang} />
          </div>
        </div>
      </div>
    </CoachLayout>
  );
}
