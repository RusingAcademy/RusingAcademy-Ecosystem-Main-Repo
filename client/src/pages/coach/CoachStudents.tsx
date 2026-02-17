/**
 * CoachStudents — Student management page for Coach Portal (Sprint H2)
 * Wired to: coach.getMyLearners
 */
import CoachLayout from "@/components/CoachLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import { useState } from "react";

const ACCENT = "var(--color-violet-600, var(--color-violet-600, #7c3aed))";

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    active: "bg-green-50 text-green-700 border-green-200",
    paused: "bg-amber-50 text-amber-700 border-amber-200",
    completed: "bg-blue-50 text-blue-700 border-blue-200",
  };
  return (
    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${colors[status] || colors.active}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

function ProgressBar({ value }: { value: number }) {
  return (
    <div className="w-full h-1.5 bg-gray-100 dark:bg-card rounded-full overflow-hidden">
      <div className="h-full rounded-full transition-all" style={{ width: `${Math.min(value, 100)}%`, background: `linear-gradient(90deg, ${ACCENT}, ${ACCENT}80)` }} />
    </div>
  );
}

export default function CoachStudents() {
  const { lang } = useLanguage();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<string>("all");

  const learnersQuery = trpc.coach.getMyLearners.useQuery();
  const learners = learnersQuery.data || [];

  const filtered = learners.filter((s: any) => {
    const name = s.name || s.learnerName || "";
    const status = s.status || "active";
    if (filter !== "all" && status !== filter) return false;
    if (search && !name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <CoachLayout>
      <div className="max-w-7xl mx-auto" role="main" aria-label={lang === "fr" ? "Mes étudiants" : "My Students"}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>
              {lang === "fr" ? "Mes étudiants" : "My Students"}
            </h1>
            <p className="text-sm text-gray-500">
              {learnersQuery.isLoading ? "..." : `${filtered.length} ${lang === "fr" ? "étudiants" : "students"}`}
            </p>
          </div>
          <div className="flex gap-2">
            <div className="relative">
              <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg">search</span>
              <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                placeholder={lang === "fr" ? "Rechercher..." : "Search..."}
                aria-label={lang === "fr" ? "Rechercher un étudiant" : "Search students"}
                className="pl-9 pr-4 py-2 text-sm border border-gray-200 dark:border-border dark:border-border rounded-lg focus:ring-2 focus:ring-[var(--color-violet-600, var(--color-violet-600, #7c3aed))]/20 focus:border-violet-600 outline-none w-48" />
            </div>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-4" role="tablist">
          {(["all", "active", "paused", "completed"] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)} role="tab" aria-selected={filter === f}
              className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all ${filter === f ? "bg-violet-600 text-white" : "bg-gray-100 dark:bg-card text-gray-600 hover:bg-gray-200"}`}>
              {f === "all" ? (lang === "fr" ? "Tous" : "All") :
               f === "active" ? (lang === "fr" ? "Actifs" : "Active") :
               f === "paused" ? (lang === "fr" ? "En pause" : "Paused") :
               (lang === "fr" ? "Terminés" : "Completed")}
            </button>
          ))}
        </div>

        {/* Student Cards */}
        {learnersQuery.isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-48 bg-gray-50 dark:bg-background rounded-xl animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-background rounded-xl border border-gray-100">
            <span className="material-icons text-gray-300 text-5xl">school</span>
            <p className="text-sm text-gray-500 mt-2">
              {search
                ? (lang === "fr" ? "Aucun étudiant trouvé pour cette recherche" : "No students found for this search")
                : (lang === "fr" ? "Aucun étudiant pour le moment" : "No students yet")}
            </p>
            {!search && (
              <p className="text-xs text-gray-400 mt-1">
                {lang === "fr" ? "Les étudiants apparaîtront ici après leur première session" : "Students will appear here after their first session"}
              </p>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((student: any) => {
              const name = student.name || student.learnerName || "—";
              const status = student.status || "active";
              const progress = student.progress || 0;
              const sessions = student.sessionsCompleted || 0;
              const level = student.level || student.currentLevel || "—";
              return (
                <div key={student.id || student.learnerId} className="bg-white dark:bg-background rounded-xl border border-gray-100 dark:border-border p-5 hover:shadow-md transition-shadow group">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-600 to-[var(--color-purple-600, var(--color-purple-600, #9333ea))] flex items-center justify-center text-white font-bold text-sm">
                        {name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{name}</p>
                        <p className="text-[11px] text-gray-500">{student.program || ""} {level !== "—" ? `· ${level}` : ""}</p>
                      </div>
                    </div>
                    <StatusBadge status={status} />
                  </div>

                  {progress > 0 && (
                    <div className="mb-3">
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="text-gray-500">{lang === "fr" ? "Progression" : "Progress"}</span>
                        <span className="font-semibold text-violet-600">{progress}%</span>
                      </div>
                      <ProgressBar value={progress} />
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-2 text-center mb-3">
                    <div className="bg-gray-50 dark:bg-background rounded-lg py-2">
                      <p className="text-sm font-bold text-gray-900">{sessions}</p>
                      <p className="text-[9px] text-gray-500">{lang === "fr" ? "Sessions" : "Sessions"}</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-background rounded-lg py-2">
                      <p className="text-sm font-bold text-gray-900">{level}</p>
                      <p className="text-[9px] text-gray-500">{lang === "fr" ? "Niveau" : "Level"}</p>
                    </div>
                  </div>

                  {student.email && (
                    <div className="flex items-center gap-1 text-[11px] text-gray-400">
                      <span className="material-icons text-sm">email</span>
                      <span className="truncate">{student.email}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </CoachLayout>
  );
}
