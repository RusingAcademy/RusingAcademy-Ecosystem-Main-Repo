import { useState } from "react";
import { trpc } from "../lib/trpc";

// Badge icons mapping
const BADGE_ICONS: Record<string, string> = {
  first_lesson: "🎯",
  module_complete: "📚",
  course_complete: "🎓",
  all_courses_complete: "🏆",
  streak_3: "🔥",
  streak_7: "⚡",
  streak_14: "💪",
  streak_30: "🌟",
  streak_100: "👑",
  quiz_ace: "💯",
  perfect_module: "✨",
  quiz_master: "🧠",
  early_bird: "🌅",
  night_owl: "🦉",
  weekend_warrior: "⚔️",
  consistent_learner: "📈",
  xp_100: "💎",
  xp_500: "💎💎",
  xp_1000: "💎💎💎",
  xp_5000: "🌈",
  founding_member: "🏅",
  beta_tester: "🔬",
  community_helper: "🤝",
  top_reviewer: "⭐",
};

interface GamificationDashboardProps {
  compact?: boolean;
}

export function GamificationDashboard({ compact = false }: GamificationDashboardProps) {
  const [showAllBadges, setShowAllBadges] = useState(false);
  const [leaderboardPeriod, setLeaderboardPeriod] = useState<"weekly" | "monthly" | "allTime">("weekly");
  
  const { data: stats, isLoading: statsLoading } = trpc.gamification.getMyStats.useQuery();
  const { data: allBadges } = trpc.gamification.getMyBadges.useQuery();
  const { data: leaderboard } = trpc.gamification.getLeaderboard.useQuery({ timeRange: leaderboardPeriod, limit: 10 });
  
  if (statsLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-24 rounded-xl" style={{ background: "rgba(60, 87, 89, 0.06)" }} />
        <div className="h-32 rounded-xl" style={{ background: "rgba(60, 87, 89, 0.06)" }} />
      </div>
    );
  }
  
  if (!stats) return null;
  
  if (compact) {
    return (
      <div
        className="community-glass-card rounded-xl p-4"
        style={{
          background: "rgba(255, 255, 255, 0.04)",
          border: "1px solid rgba(60, 87, 89, 0.12)",
          backdropFilter: "blur(12px)",
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Level Badge */}
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg"
              style={{
                background: "linear-gradient(135deg, rgba(23, 226, 198, 0.15), rgba(60, 87, 89, 0.15))",
                color: "#17E2C6",
                border: "2px solid rgba(23, 226, 198, 0.25)",
                boxShadow: "0 4px 16px rgba(23, 226, 198, 0.15)",
              }}
            >
              {stats.levelInfo.current}
            </div>
            <div>
              <p className="font-semibold" style={{ color: "rgba(255, 255, 255, 0.9)" }}>{stats.levelInfo.title}</p>
              <p className="text-sm" style={{ color: "rgba(255, 255, 255, 0.55)" }}>{stats.xp.total.toLocaleString()} XP</p>
            </div>
          </div>
          
          {/* Streak */}
          <div className="flex items-center gap-2">
            <span className="text-2xl">🔥</span>
            <div>
              <p className="font-bold" style={{ color: "#D4AF37" }}>{stats.streak.current}</p>
              <p className="text-xs" style={{ color: "rgba(255, 255, 255, 0.45)" }}>day streak</p>
            </div>
          </div>
        </div>
        
        {/* XP Progress Bar */}
        {stats.levelInfo.nextLevel && (
          <div className="mt-3">
            <div className="flex justify-between text-xs mb-1" style={{ color: "rgba(255, 255, 255, 0.45)" }}>
              <span>Level {stats.levelInfo.current}</span>
              <span>{stats.levelInfo.xpToNextLevel} XP to Level {stats.levelInfo.nextLevel.level}</span>
            </div>
            <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(255, 255, 255, 0.06)" }}>
              <div 
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${stats.levelInfo.progressPercent}%`,
                  background: "linear-gradient(90deg, #17E2C6, #3C5759)",
                }}
              />
            </div>
          </div>
        )}
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Main Stats Card — Premium glassmorphism */}
      <div
        className="rounded-2xl p-6 text-white"
        style={{
          background: "linear-gradient(135deg, rgba(60, 87, 89, 0.3), rgba(25, 37, 36, 0.4))",
          border: "1px solid rgba(23, 226, 198, 0.15)",
          backdropFilter: "blur(16px)",
          boxShadow: "0 8px 32px rgba(25, 37, 36, 0.2)",
        }}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            {/* Level Badge */}
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center"
              style={{
                background: "rgba(23, 226, 198, 0.1)",
                border: "3px solid rgba(23, 226, 198, 0.3)",
                boxShadow: "0 4px 24px rgba(23, 226, 198, 0.15)",
              }}
            >
              <div className="text-center">
                <p className="text-2xl md:text-3xl font-bold" style={{ color: "#17E2C6" }}>{stats.levelInfo.current}</p>
                <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "rgba(23, 226, 198, 0.6)" }}>LEVEL</p>
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold" style={{ color: "rgba(255, 255, 255, 0.95)" }}>{stats.levelInfo.title}</h2>
              <p style={{ color: "rgba(255, 255, 255, 0.5)" }}>{stats.levelInfo.titleFr}</p>
              <p className="text-sm mt-1" style={{ color: "rgba(255, 255, 255, 0.4)" }}>{stats.xp.total.toLocaleString()} Total XP</p>
            </div>
          </div>
          
          {/* Streak */}
          <div
            className="text-center rounded-xl p-4"
            style={{
              background: "rgba(212, 175, 55, 0.08)",
              border: "1px solid rgba(212, 175, 55, 0.15)",
              backdropFilter: "blur(8px)",
            }}
          >
            <div className="text-3xl md:text-4xl mb-1">🔥</div>
            <p className="text-2xl md:text-3xl font-bold" style={{ color: "#D4AF37" }}>{stats.streak.current}</p>
            <p className="text-sm" style={{ color: "rgba(255, 255, 255, 0.45)" }}>Day Streak</p>
            {stats.streak.longest > stats.streak.current && (
              <p className="text-xs mt-1" style={{ color: "rgba(255, 255, 255, 0.35)" }}>Best: {stats.streak.longest} days</p>
            )}
          </div>
        </div>
        
        {/* XP Progress to Next Level */}
        {stats.levelInfo.nextLevel && (
          <div>
            <div className="flex justify-between text-sm mb-2" style={{ color: "rgba(255, 255, 255, 0.6)" }}>
              <span>Progress to Level {stats.levelInfo.nextLevel.level}</span>
              <span>{stats.levelInfo.progressPercent}%</span>
            </div>
            <div className="h-3 rounded-full overflow-hidden" style={{ background: "rgba(255, 255, 255, 0.08)" }}>
              <div 
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${stats.levelInfo.progressPercent}%`,
                  background: "linear-gradient(90deg, #17E2C6, #D4AF37)",
                }}
              />
            </div>
            <p className="text-sm mt-2" style={{ color: "rgba(255, 255, 255, 0.4)" }}>
              {stats.levelInfo.xpToNextLevel.toLocaleString()} XP needed to become {stats.levelInfo.nextLevel.title}
            </p>
          </div>
        )}
        
        {/* Weekly/Monthly XP */}
        <div className="grid grid-cols-2 gap-4 mt-6">
          <div
            className="rounded-xl p-3 text-center"
            style={{ background: "rgba(255, 255, 255, 0.05)", border: "1px solid rgba(60, 87, 89, 0.1)" }}
          >
            <p className="text-2xl font-bold" style={{ color: "rgba(255, 255, 255, 0.9)" }}>{stats.xp.weekly.toLocaleString()}</p>
            <p className="text-sm" style={{ color: "rgba(255, 255, 255, 0.4)" }}>This Week</p>
          </div>
          <div
            className="rounded-xl p-3 text-center"
            style={{ background: "rgba(255, 255, 255, 0.05)", border: "1px solid rgba(60, 87, 89, 0.1)" }}
          >
            <p className="text-2xl font-bold" style={{ color: "rgba(255, 255, 255, 0.9)" }}>{stats.xp.monthly.toLocaleString()}</p>
            <p className="text-sm" style={{ color: "rgba(255, 255, 255, 0.4)" }}>This Month</p>
          </div>
        </div>
      </div>
      
      {/* Badges Section — Premium glassmorphism */}
      <div
        className="rounded-2xl p-6"
        style={{
          background: "rgba(255, 255, 255, 0.03)",
          border: "1px solid rgba(60, 87, 89, 0.12)",
          backdropFilter: "blur(12px)",
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold" style={{ color: "rgba(255, 255, 255, 0.9)" }}>
            Badges ({stats.badges.total})
          </h3>
          {stats.badges.total > 5 && (
            <button 
              onClick={() => setShowAllBadges(!showAllBadges)}
              className="text-sm font-medium transition-colors"
              style={{ color: "#17E2C6" }}
            >
              {showAllBadges ? "Show Less" : "View All"}
            </button>
          )}
        </div>
        
        {stats.badges.total === 0 ? (
          <div className="text-center py-8">
            <p className="text-3xl md:text-4xl mb-2">🏅</p>
            <p style={{ color: "rgba(255, 255, 255, 0.45)" }}>Complete lessons and maintain streaks to earn badges!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {(showAllBadges ? allBadges : stats.badges.recent)?.map((badge) => (
              <div 
                key={badge.id}
                className="relative group p-3 rounded-xl text-center transition-all duration-200"
                style={{
                  background: badge.isNew ? "rgba(212, 175, 55, 0.08)" : "rgba(255, 255, 255, 0.03)",
                  border: badge.isNew ? "1px solid rgba(212, 175, 55, 0.2)" : "1px solid rgba(60, 87, 89, 0.08)",
                }}
              >
                {badge.isNew && (
                  <span
                    className="absolute -top-1 -right-1 text-xs px-1.5 py-0.5 rounded-full font-bold"
                    style={{ background: "#D4AF37", color: "#192524" }}
                  >
                    NEW
                  </span>
                )}
                <div className="text-2xl md:text-3xl mb-1">
                  {BADGE_ICONS[badge.badgeType] || "🏅"}
                </div>
                <p className="text-xs font-medium truncate" style={{ color: "rgba(255, 255, 255, 0.7)" }}>{badge.title}</p>
                
                {/* Tooltip */}
                <div
                  className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10"
                  style={{
                    background: "rgba(25, 37, 36, 0.95)",
                    border: "1px solid rgba(60, 87, 89, 0.2)",
                    color: "rgba(255, 255, 255, 0.9)",
                    backdropFilter: "blur(12px)",
                  }}
                >
                  <p className="font-medium">{badge.title}</p>
                  {badge.description && <p style={{ color: "rgba(255, 255, 255, 0.6)" }}>{badge.description}</p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Leaderboard — Premium glassmorphism */}
      <div
        className="rounded-2xl p-6"
        style={{
          background: "rgba(255, 255, 255, 0.03)",
          border: "1px solid rgba(60, 87, 89, 0.12)",
          backdropFilter: "blur(12px)",
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold" style={{ color: "rgba(255, 255, 255, 0.9)" }}>Leaderboard</h3>
          <div
            className="flex gap-1 rounded-lg p-1"
            style={{ background: "rgba(255, 255, 255, 0.04)", border: "1px solid rgba(60, 87, 89, 0.08)" }}
          >
            {(["weekly", "monthly", "allTime"] as const).map((period) => (
              <button
                key={period}
                onClick={() => setLeaderboardPeriod(period)}
                className="px-3 py-1 text-sm rounded-md transition-all duration-200"
                style={{
                  background: leaderboardPeriod === period ? "rgba(23, 226, 198, 0.1)" : "transparent",
                  color: leaderboardPeriod === period ? "#17E2C6" : "rgba(255, 255, 255, 0.5)",
                  fontWeight: leaderboardPeriod === period ? 600 : 400,
                  border: leaderboardPeriod === period ? "1px solid rgba(23, 226, 198, 0.15)" : "1px solid transparent",
                }}
              >
                {period === "weekly" ? "Week" : period === "monthly" ? "Month" : "All Time"}
              </button>
            ))}
          </div>
        </div>
        
        <div className="space-y-2">
          {leaderboard?.entries?.map((entry, index) => (
            <div 
              key={entry.userId}
              className="flex items-center gap-3 p-3 rounded-xl transition-all duration-200"
              style={{
                background: index < 3 ? "rgba(212, 175, 55, 0.04)" : "rgba(255, 255, 255, 0.02)",
                border: index < 3 ? "1px solid rgba(212, 175, 55, 0.1)" : "1px solid rgba(60, 87, 89, 0.06)",
              }}
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm"
                style={{
                  background: index === 0 ? "rgba(212, 175, 55, 0.2)" :
                             index === 1 ? "rgba(192, 192, 192, 0.15)" :
                             index === 2 ? "rgba(205, 127, 50, 0.15)" :
                             "rgba(255, 255, 255, 0.05)",
                  color: index === 0 ? "#D4AF37" :
                         index === 1 ? "#C0C0C0" :
                         index === 2 ? "#CD7F32" :
                         "rgba(255, 255, 255, 0.5)",
                  border: index < 3 ? `1px solid ${index === 0 ? "rgba(212, 175, 55, 0.3)" : index === 1 ? "rgba(192, 192, 192, 0.2)" : "rgba(205, 127, 50, 0.2)"}` : "none",
                }}
              >
                {entry.rank}
              </div>
              <div className="flex-1">
                <p className="font-medium" style={{ color: "rgba(255, 255, 255, 0.85)" }}>{entry.name || "Anonymous"}</p>
                <p className="text-sm" style={{ color: "rgba(255, 255, 255, 0.4)" }}>Level {entry.level} • {entry.levelTitle}</p>
              </div>
              <div className="text-right">
                <p className="font-bold" style={{ color: "#17E2C6" }}>{entry.xp?.toLocaleString() || 0} XP</p>
                {entry.streak > 0 && (
                  <p className="text-xs" style={{ color: "#D4AF37" }}>🔥 {entry.streak} day streak</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default GamificationDashboard;
