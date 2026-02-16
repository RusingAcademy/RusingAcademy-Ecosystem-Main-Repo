/**
 * Achievement Showcase — Badges, milestones, certificates, and shareable stats
 * Sprint F5: Fixed tRPC calls (getMyStats + getMyBadges), added streak from dailyGoals
 */
import DashboardLayout from "@/components/DashboardLayout";
import { trpc } from "@/lib/trpc";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState } from "react";

const ALL_BADGES = [
  { id: "first_lesson", name: "First Steps", nameFr: "Premiers pas", description: "Complete your first lesson", descFr: "Complétez votre première leçon", icon: "school", color: "var(--brand-teal, #008090)", xp: 50 },
  { id: "five_lessons", name: "Dedicated Learner", nameFr: "Apprenant dévoué", description: "Complete 5 lessons", descFr: "Complétez 5 leçons", icon: "auto_stories", color: "var(--semantic-warning, #f5a623)", xp: 100 },
  { id: "ten_lessons", name: "Knowledge Seeker", nameFr: "Chercheur de savoir", description: "Complete 10 lessons", descFr: "Complétez 10 leçons", icon: "psychology", color: "var(--semantic-danger, #e74c3c)", xp: 200 },
  { id: "twenty_five_lessons", name: "Scholar", nameFr: "Érudit", description: "Complete 25 lessons", descFr: "Complétez 25 leçons", icon: "workspace_premium", color: "#9b59b6", xp: 500 },
  { id: "first_quiz", name: "Quiz Taker", nameFr: "Testeur de quiz", description: "Complete your first quiz", descFr: "Complétez votre premier quiz", icon: "quiz", color: "#3498db", xp: 50 },
  { id: "perfect_quiz", name: "Perfectionist", nameFr: "Perfectionniste", description: "Score 100% on a quiz", descFr: "Obtenez 100% à un quiz", icon: "emoji_events", color: "var(--semantic-warning, #f5a623)", xp: 150 },
  { id: "five_perfect", name: "Quiz Master", nameFr: "Maître des quiz", description: "Score 100% on 5 quizzes", descFr: "Obtenez 100% à 5 quiz", icon: "military_tech", color: "var(--semantic-danger, #e74c3c)", xp: 300 },
  { id: "streak_3", name: "On Fire", nameFr: "En feu", description: "3-day learning streak", descFr: "Série de 3 jours", icon: "local_fire_department", color: "#e67e22", xp: 75 },
  { id: "streak_7", name: "Week Warrior", nameFr: "Guerrier de la semaine", description: "7-day learning streak", descFr: "Série de 7 jours", icon: "whatshot", color: "var(--semantic-danger, #e74c3c)", xp: 200 },
  { id: "streak_30", name: "Monthly Champion", nameFr: "Champion du mois", description: "30-day learning streak", descFr: "Série de 30 jours", icon: "diamond", color: "var(--semantic-warning, #f5a623)", xp: 1000 },
  { id: "path_complete", name: "Path Pioneer", nameFr: "Pionnier du parcours", description: "Complete an entire Path", descFr: "Complétez un parcours entier", icon: "flag", color: "#27ae60", xp: 500 },
  { id: "first_enrollment", name: "Adventurer", nameFr: "Aventurier", description: "Enroll in your first Path", descFr: "Inscrivez-vous à votre premier parcours", icon: "explore", color: "var(--brand-teal, #008090)", xp: 25 },
  { id: "challenge_champion", name: "Challenge Champion", nameFr: "Champion des défis", description: "Complete a weekly challenge", descFr: "Complétez un défi hebdomadaire", icon: "emoji_events", color: "var(--semantic-warning, #f59e0b)", xp: 250 },
  { id: "five_challenges", name: "Challenge Master", nameFr: "Maître des défis", description: "Complete 5 weekly challenges", descFr: "Complétez 5 défis hebdomadaires", icon: "military_tech", color: "var(--color-violet-500, #8b5cf6)", xp: 500 },
];

const MILESTONES = [
  { xp: 100, title: "Getting Started", titleFr: "Premiers pas", icon: "rocket_launch" },
  { xp: 500, title: "Rising Star", titleFr: "Étoile montante", icon: "star" },
  { xp: 1000, title: "Committed Learner", titleFr: "Apprenant engagé", icon: "school" },
  { xp: 2500, title: "Language Enthusiast", titleFr: "Passionné des langues", icon: "favorite" },
  { xp: 5000, title: "Bilingual Achiever", titleFr: "Bilingue accompli", icon: "workspace_premium" },
  { xp: 10000, title: "Language Master", titleFr: "Maître des langues", icon: "diamond" },
  { xp: 25000, title: "Elite Scholar", titleFr: "Érudit d'élite", icon: "military_tech" },
];

export default function Achievements() {
  const { language } = useLanguage();
  const isFr = language === "fr";
  const [tab, setTab] = useState<"badges" | "milestones" | "stats">("badges");

  // Use correct endpoints: getMyStats (self-referencing, no userId needed) + getMyBadges
  const stats = trpc.gamification.getMyStats.useQuery();
  const badges = trpc.gamification.getMyBadges.useQuery();
  const streak = trpc.dailyGoals.getStreak.useQuery();

  const statsData = stats.data as any;
  const badgesData = (badges.data || []) as any[];
  const earnedBadgeIds = new Set(badgesData.map((b: any) => b.badgeType || b.badgeId));
  const totalXp = statsData?.totalXp || streak.data?.totalXp || 0;
  const currentLevel = statsData?.currentLevel || streak.data?.level || 1;

  const currentMilestone = MILESTONES.filter(m => totalXp >= m.xp).pop();
  const nextMilestone = MILESTONES.find(m => totalXp < m.xp);

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Header with Stats */}
        <div className="bg-gradient-to-br from-teal-700 to-[#005a66] rounded-2xl p-6 text-white mb-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold">{isFr ? "Vitrine des réalisations" : "Achievement Showcase"}</h1>
              <p className="text-white/70 text-sm mt-1">{isFr ? "Les étapes de votre parcours d'apprentissage" : "Your learning journey milestones"}</p>
            </div>
            <div className="w-16 h-16 rounded-2xl bg-white dark:bg-slate-900/10 flex items-center justify-center">
              <span className="material-icons text-3xl">emoji_events</span>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-slate-900/10 rounded-xl p-3 text-center">
              <div className="text-2xl font-bold">{totalXp.toLocaleString()}</div>
              <div className="text-[10px] text-white/60 uppercase tracking-wider">XP {isFr ? "total" : "Total"}</div>
            </div>
            <div className="bg-white dark:bg-slate-900/10 rounded-xl p-3 text-center">
              <div className="text-2xl font-bold">{currentLevel}</div>
              <div className="text-[10px] text-white/60 uppercase tracking-wider">{isFr ? "Niveau" : "Level"}</div>
            </div>
            <div className="bg-white dark:bg-slate-900/10 rounded-xl p-3 text-center">
              <div className="text-2xl font-bold">{earnedBadgeIds.size}</div>
              <div className="text-[10px] text-white/60 uppercase tracking-wider">{isFr ? "Badges" : "Badges"}</div>
            </div>
            <div className="bg-white dark:bg-slate-900/10 rounded-xl p-3 text-center">
              <div className="text-2xl font-bold">{streak.data?.currentStreak || 0}</div>
              <div className="text-[10px] text-white/60 uppercase tracking-wider">{isFr ? "Jours de série" : "Day Streak"}</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-6" role="tablist">
          {[
            { id: "badges" as const, label: isFr ? "Badges" : "Badges", icon: "military_tech" },
            { id: "milestones" as const, label: isFr ? "Jalons" : "Milestones", icon: "flag" },
            { id: "stats" as const, label: isFr ? "Statistiques" : "Statistics", icon: "analytics" },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              role="tab"
              aria-selected={tab === t.id}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                tab === t.id ? "bg-white text-teal-700 shadow-sm" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <span className="material-icons text-base">{t.icon}</span> {t.label}
            </button>
          ))}
        </div>

        {/* Badges Tab */}
        {tab === "badges" && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3" role="tabpanel">
            {ALL_BADGES.map((badge) => {
              const earned = earnedBadgeIds.has(badge.id);
              const earnedBadge = badgesData.find((b: any) => (b.badgeType || b.badgeId) === badge.id);
              return (
                <div
                  key={badge.id}
                  className={`relative bg-white border rounded-xl p-4 text-center transition-all ${
                    earned
                      ? "border-gray-200 shadow-sm hover:shadow-md"
                      : "border-dashed border-gray-300 opacity-50"
                  }`}
                >
                  <div
                    className={`w-14 h-14 rounded-2xl mx-auto mb-3 flex items-center justify-center ${
                      earned ? "" : "bg-gray-100"
                    }`}
                    style={earned ? { background: badge.color + "15" } : {}}
                  >
                    <span
                      className="material-icons text-2xl"
                      style={{ color: earned ? badge.color : "var(--color-gray-300, #d1d5db)" }}
                    >
                      {badge.icon}
                    </span>
                  </div>
                  <h3 className={`text-xs font-semibold mb-1 ${earned ? "text-gray-900" : "text-gray-400"}`}>
                    {isFr ? badge.nameFr : badge.name}
                  </h3>
                  <p className="text-[10px] text-gray-400 leading-tight">
                    {isFr ? badge.descFr : badge.description}
                  </p>
                  <div className="mt-2 text-[10px] font-semibold" style={{ color: earned ? badge.color : "var(--color-gray-300, #d1d5db)" }}>+{badge.xp} XP</div>
                  {earned && earnedBadge && (
                    <div className="absolute top-2 right-2">
                      <span className="material-icons text-green-500 text-sm">verified</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Milestones Tab */}
        {tab === "milestones" && (
          <div className="space-y-3" role="tabpanel">
            {MILESTONES.map((milestone, i) => {
              const reached = totalXp >= milestone.xp;
              const progress = reached ? 100 : Math.min(100, (totalXp / milestone.xp) * 100);
              return (
                <div
                  key={i}
                  className={`bg-white border rounded-xl p-4 flex items-center gap-4 transition-all ${
                    reached ? "border-gray-200 shadow-sm" : "border-dashed border-gray-300"
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      reached ? "bg-teal-700/10" : "bg-gray-100"
                    }`}
                  >
                    <span className={`material-icons text-xl ${reached ? "text-teal-700" : "text-gray-300"}`}>{milestone.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className={`text-sm font-semibold ${reached ? "text-gray-900" : "text-gray-400"}`}>
                        {isFr ? milestone.titleFr : milestone.title}
                      </h3>
                      <span className={`text-xs font-medium ${reached ? "text-teal-700" : "text-gray-400"}`}>{milestone.xp.toLocaleString()} XP</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${progress}%`, background: reached ? "var(--brand-teal, #008090)" : "var(--color-gray-300, #d1d5db)" }}
                      />
                    </div>
                    {!reached && (
                      <p className="text-[10px] text-gray-400 mt-1">
                        {(milestone.xp - totalXp).toLocaleString()} XP {isFr ? "restant" : "remaining"}
                      </p>
                    )}
                  </div>
                  {reached && <span className="material-icons text-green-500">check_circle</span>}
                </div>
              );
            })}
          </div>
        )}

        {/* Stats Tab */}
        {tab === "stats" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" role="tabpanel">
            <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-1">
                <span className="material-icons text-teal-700 text-base">school</span>
                {isFr ? "Statistiques d'apprentissage" : "Learning Stats"}
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">{isFr ? "Leçons complétées" : "Lessons Completed"}</span>
                  <span className="font-semibold">{statsData?.lessonsCompleted || 0}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">{isFr ? "Quiz complétés" : "Quizzes Completed"}</span>
                  <span className="font-semibold">{statsData?.quizzesCompleted || 0}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">{isFr ? "Quiz parfaits" : "Perfect Quizzes"}</span>
                  <span className="font-semibold">{statsData?.perfectQuizzes || 0}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">{isFr ? "Parcours inscrits" : "Paths Enrolled"}</span>
                  <span className="font-semibold">{statsData?.coursesEnrolled || 0}</span>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-1">
                <span className="material-icons text-amber-500 text-base">local_fire_department</span>
                {isFr ? "Statistiques de série" : "Streak Stats"}
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">{isFr ? "Série actuelle" : "Current Streak"}</span>
                  <span className="font-semibold">{streak.data?.currentStreak || 0} {isFr ? "jours" : "days"}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">{isFr ? "Plus longue série" : "Longest Streak"}</span>
                  <span className="font-semibold">{streak.data?.longestStreak || statsData?.longestStreak || 0} {isFr ? "jours" : "days"}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">{isFr ? "Objectif quotidien" : "Daily Goal"}</span>
                  <span className="font-semibold">
                    {streak.data?.dailyGoalProgress || 0}/{streak.data?.dailyGoalTarget || 10} {isFr ? "cartes" : "cards"}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">{isFr ? "Jalon actuel" : "Current Milestone"}</span>
                  <span className="font-semibold">
                    {currentMilestone ? (isFr ? currentMilestone.titleFr : currentMilestone.title) : (isFr ? "Aucun" : "None yet")}
                  </span>
                </div>
              </div>
            </div>
            <div className="sm:col-span-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-1">
                <span className="material-icons text-violet-500 text-base">trending_up</span>
                {isFr ? "Aperçu de la progression" : "Progress Overview"}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-center">
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="text-2xl font-bold text-teal-700">{earnedBadgeIds.size}/{ALL_BADGES.length}</div>
                  <div className="text-[10px] text-gray-400 mt-1">{isFr ? "Badges obtenus" : "Badges Earned"}</div>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="text-2xl font-bold text-amber-500">{MILESTONES.filter(m => totalXp >= m.xp).length}/{MILESTONES.length}</div>
                  <div className="text-[10px] text-gray-400 mt-1">{isFr ? "Jalons atteints" : "Milestones Reached"}</div>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="text-2xl font-bold text-violet-500">{nextMilestone ? `${Math.round((totalXp / nextMilestone.xp) * 100)}%` : "100%"}</div>
                  <div className="text-[10px] text-gray-400 mt-1">{isFr ? "Prochain jalon" : "Next Milestone"}</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
