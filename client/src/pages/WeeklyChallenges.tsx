/**
 * Weekly Challenges — RusingAcademy Learning Portal
 * Wave F: Full bilingual (EN/FR), WCAG 2.1 AA accessibility, professional empty states
 */
import DashboardLayout from "@/components/DashboardLayout";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState, useMemo } from "react";

const CHALLENGE_ICONS: Record<string, string> = {
  complete_lessons: "school", earn_xp: "auto_awesome", perfect_quizzes: "emoji_events",
  maintain_streak: "local_fire_department", complete_slots: "check_circle", study_time: "timer",
};

const CHALLENGE_COLORS: Record<string, string> = {
  complete_lessons: "var(--brand-teal, var(--teal))", earn_xp: "var(--semantic-warning, var(--warning))", perfect_quizzes: "var(--color-violet-500, var(--accent-purple))",
  maintain_streak: "var(--semantic-danger, var(--danger))", complete_slots: "var(--semantic-success, var(--success))", study_time: "var(--color-blue-500, var(--semantic-info))",
};

function getDaysRemaining(endDate: string): number {
  const end = new Date(endDate + "T23:59:59");
  const now = new Date();
  return Math.max(0, Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
}

function ChallengeCard({ challenge, isFr }: { challenge: {
  id: number; title: string; titleFr: string; description: string; descriptionFr: string;
  challengeType: string; targetValue: number; xpReward: number; weekEndDate: string;
  currentValue: number; isCompleted: boolean;
}; isFr: boolean }) {
  const icon = CHALLENGE_ICONS[challenge.challengeType] || "flag";
  const color = CHALLENGE_COLORS[challenge.challengeType] || "var(--brand-teal, var(--teal))";
  const progress = Math.min(100, (challenge.currentValue / challenge.targetValue) * 100);
  const daysLeft = getDaysRemaining(challenge.weekEndDate);

  return (
    <div className={`bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-5 transition-all duration-300 hover:shadow-md ${challenge.isCompleted ? "ring-1 ring-[var(--semantic-success, var(--success))]/30" : ""}`}
      style={{ borderLeft: `4px solid ${color}` }}
      role="article"
      aria-label={isFr ? challenge.titleFr : challenge.title}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${color}10` }}>
            <span className="material-icons" style={{ color, fontSize: "22px" }} aria-hidden="true">{challenge.isCompleted ? "check_circle" : icon}</span>
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900">{isFr ? challenge.titleFr : challenge.title}</h3>
            <p className="text-[11px] text-gray-400 italic">{isFr ? challenge.title : challenge.titleFr}</p>
          </div>
        </div>
        <div className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold" style={{ background: `${color}10`, color }}>
          <span className="material-icons" style={{ fontSize: "12px" }} aria-hidden="true">auto_awesome</span>
          +{challenge.xpReward} XP
        </div>
      </div>

      <p className="text-xs text-gray-500 mb-3 leading-relaxed">{isFr ? challenge.descriptionFr : challenge.description}</p>

      <div className="mb-2">
        <div className="flex items-center justify-between text-[10px] mb-1">
          <span className="text-gray-400">{challenge.currentValue} / {challenge.targetValue}</span>
          <span className="font-bold" style={{ color: challenge.isCompleted ? "var(--semantic-success, var(--success))" : color }}>
            {challenge.isCompleted ? (isFr ? "Complété !" : "Completed!") : `${Math.round(progress)}%`}
          </span>
        </div>
        <div className="h-2.5 rounded-full overflow-hidden bg-gray-100" role="progressbar" aria-valuenow={challenge.currentValue} aria-valuemin={0} aria-valuemax={challenge.targetValue}>
          <div className="h-full rounded-full transition-all duration-700 ease-out" style={{
            width: `${progress}%`,
            background: challenge.isCompleted ? "linear-gradient(90deg, var(--semantic-success, var(--success)), var(--color-emerald-400, #34d399))" : `linear-gradient(90deg, ${color}, ${color}cc)`,
          }} />
        </div>
      </div>

      <div className="flex items-center justify-between mt-3">
        {challenge.isCompleted ? (
          <div className="flex items-center gap-1 text-[10px] text-emerald-500 font-semibold">
            <span className="material-icons"  aria-hidden="true">verified</span>
            {isFr ? "Défi complété" : "Challenge Complete"}
          </div>
        ) : (
          <div className="flex items-center gap-1 text-[10px] text-gray-400">
            <span className="material-icons"  aria-hidden="true">schedule</span>
            {daysLeft} {isFr ? (daysLeft !== 1 ? "jours restants" : "jour restant") : (daysLeft !== 1 ? "days remaining" : "day remaining")}
          </div>
        )}
      </div>
    </div>
  );
}

export default function WeeklyChallenges() {
  const { isAuthenticated } = useAuth();
  const { t, language } = useLanguage();
  const isFr = language === "fr";
  const [tab, setTab] = useState<"active" | "completed">("active");
  const challengesQuery = trpc.challenges.getActive.useQuery(undefined, { enabled: isAuthenticated });

  const activeChallenges = useMemo(() => challengesQuery.data?.filter((c) => !c.isCompleted) ?? [], [challengesQuery.data]);
  const completedChallenges = useMemo(() => challengesQuery.data?.filter((c) => c.isCompleted) ?? [], [challengesQuery.data]);
  const totalXpEarned = completedChallenges.reduce((sum, c) => sum + c.xpReward, 0);
  const displayChallenges = tab === "active" ? activeChallenges : completedChallenges;

  return (
    <DashboardLayout>
      <div className="max-w-[900px] space-y-5" role="main" aria-label={t("challenges.title")}>
        {/* Header */}
        <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 dark:border-slate-700 rounded-xl p-6 md:p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <span className="material-icons text-violet-500" style={{ fontSize: "28px" }} aria-hidden="true">flag</span>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>
              {t("challenges.title")}
            </h1>
          </div>
          <p className="text-gray-500 text-sm">
            {isFr ? "Complétez des défis pour gagner des XP bonus et des badges exclusifs. Nouveaux défis chaque semaine !" : "Complete challenges to earn bonus XP and exclusive badges. New challenges every week!"}
          </p>

          {/* Stats Row */}
          <div className="flex items-center gap-6 mt-4" role="region" aria-label={isFr ? "Statistiques des défis" : "Challenge statistics"}>
            <div className="text-center" role="status">
              <div className="text-2xl font-bold text-teal-700">{activeChallenges.length}</div>
              <div className="text-[10px] text-gray-400 uppercase tracking-wider">{isFr ? "Actifs" : "Active"}</div>
            </div>
            <div className="w-px h-8 bg-gray-200" aria-hidden="true" />
            <div className="text-center" role="status">
              <div className="text-2xl font-bold text-emerald-500">{completedChallenges.length}</div>
              <div className="text-[10px] text-gray-400 uppercase tracking-wider">{isFr ? "Complétés" : "Completed"}</div>
            </div>
            <div className="w-px h-8 bg-gray-200" aria-hidden="true" />
            <div className="text-center" role="status">
              <div className="text-2xl font-bold text-amber-500">{totalXpEarned.toLocaleString()}</div>
              <div className="text-[10px] text-gray-400 uppercase tracking-wider">{isFr ? "XP gagnés" : "XP Earned"}</div>
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex gap-2" role="tablist" aria-label={isFr ? "Filtrer les défis" : "Filter challenges"}>
          <button onClick={() => setTab("active")} role="tab" aria-selected={tab === "active"}
            className={`px-5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 border focus:outline-none focus:ring-2 focus:ring-teal-700/30 ${
              tab === "active" ? "bg-teal-700 text-white border-teal-700" : "bg-white dark:bg-slate-800 text-gray-500 border-gray-200 dark:border-slate-700 hover:border-teal-700 hover:text-teal-700"
            }`}>
            <span className="material-icons align-middle mr-1"  aria-hidden="true">flag</span>
            {isFr ? "Actifs" : "Active"} ({activeChallenges.length})
          </button>
          <button onClick={() => setTab("completed")} role="tab" aria-selected={tab === "completed"}
            className={`px-5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 border focus:outline-none focus:ring-2 focus:ring-[var(--semantic-success, var(--success))]/30 ${
              tab === "completed" ? "bg-emerald-500 text-white border-emerald-500" : "bg-white dark:bg-slate-800 text-gray-500 border-gray-200 dark:border-slate-700 hover:border-emerald-500 hover:text-emerald-500"
            }`}>
            <span className="material-icons align-middle mr-1"  aria-hidden="true">check_circle</span>
            {isFr ? "Complétés" : "Completed"} ({completedChallenges.length})
          </button>
        </div>

        {/* Challenge Cards */}
        {challengesQuery.isLoading ? (
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 dark:border-slate-700 rounded-xl p-8 text-center shadow-sm" role="status">
            <div className="animate-spin w-8 h-8 border-2 border-teal-700 border-t-transparent rounded-full mx-auto" />
            <p className="text-sm text-gray-400 mt-3">{t("skillLabs.loading")}</p>
          </div>
        ) : displayChallenges.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 dark:border-slate-700 rounded-xl p-8 text-center shadow-sm" role="status">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-purple-50 to-indigo-50 flex items-center justify-center">
              <span className="material-icons text-lg md:text-2xl lg:text-3xl text-purple-400" aria-hidden="true">{tab === "active" ? "flag" : "emoji_events"}</span>
            </div>
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
              {tab === "active"
                ? (isFr ? "Aucun défi actif pour le moment" : "No active challenges right now")
                : (isFr ? "Aucun défi complété" : "No completed challenges yet")}
            </h3>
            <p className="text-xs text-gray-400 max-w-xs mx-auto">
              {tab === "active"
                ? (isFr ? "Revenez bientôt pour de nouveaux défis !" : "Check back soon for new challenges!")
                : (isFr ? "Commencez à travailler sur les défis actifs !" : "Start working on active challenges!")}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4" role="list" aria-label={tab === "active" ? (isFr ? "Défis actifs" : "Active challenges") : (isFr ? "Défis complétés" : "Completed challenges")}>
            {displayChallenges.map((challenge) => (
              <ChallengeCard key={challenge.id} challenge={challenge} isFr={isFr} />
            ))}
          </div>
        )}

        {/* How It Works */}
        <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 dark:border-slate-700 rounded-xl p-5 shadow-sm">
          <h2 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
            <span className="material-icons text-teal-700"  aria-hidden="true">help_outline</span>
            {isFr ? "Comment fonctionnent les défis hebdomadaires" : "How Weekly Challenges Work"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(isFr ? [
              { icon: "flag", title: "Nouveaux défis chaque semaine", desc: "De nouveaux défis apparaissent chaque lundi. Complétez-les avant la fin de la semaine !" },
              { icon: "auto_awesome", title: "Gagnez des XP bonus", desc: "Chaque défi récompense des XP bonus en plus de vos XP d'apprentissage réguliers." },
              { icon: "emoji_events", title: "Débloquez des badges", desc: "Certains défis débloquent des badges exclusifs qui montrent votre dévouement." },
            ] : [
              { icon: "flag", title: "New Challenges Weekly", desc: "Fresh challenges appear every Monday. Complete them before the week ends!" },
              { icon: "auto_awesome", title: "Earn Bonus XP", desc: "Each challenge rewards bonus XP on top of your regular learning XP." },
              { icon: "emoji_events", title: "Unlock Badges", desc: "Some challenges unlock exclusive badges that showcase your dedication." },
            ]).map((item) => (
              <div key={item.title} className="text-center p-3">
                <span className="material-icons text-teal-700" style={{ fontSize: "28px" }} aria-hidden="true">{item.icon}</span>
                <h3 className="text-xs font-bold text-gray-900 dark:text-gray-100 mt-2">{item.title}</h3>
                <p className="text-[11px] text-gray-400 mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
