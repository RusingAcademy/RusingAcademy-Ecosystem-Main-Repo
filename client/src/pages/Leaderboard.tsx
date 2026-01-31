import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Trophy, 
  Medal, 
  Award, 
  Crown, 
  Flame, 
  ChevronLeft, 
  ChevronRight,
  Star,
  TrendingUp,
  Users,
  Zap
} from "lucide-react";
import { Link } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

type TimeFilter = "weekly" | "monthly" | "allTime";

export default function Leaderboard() {
  const { user, isAuthenticated } = useAuth();
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("allTime");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Fetch leaderboard data
  const { data: leaderboardData, isLoading: leaderboardLoading } = trpc.gamification.getLeaderboard.useQuery({
    timeRange: timeFilter,
    limit: pageSize,
    offset: (currentPage - 1) * pageSize
  });

  // Fetch current user's rank
  const { data: userRank } = trpc.gamification.getUserRank.useQuery(
    { timeRange: timeFilter },
    { enabled: isAuthenticated }
  );

  // Get rank icon based on position
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Medal className="w-6 h-6 text-amber-600" />;
      default:
        return <span className="w-6 h-6 flex items-center justify-center font-bold text-muted-foreground">#{rank}</span>;
    }
  };

  // Get rank background based on position
  const getRankBg = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-950/30 dark:to-amber-950/30 border-yellow-200 dark:border-yellow-800";
      case 2:
        return "bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-950/30 dark:to-slate-950/30 border-gray-200 dark:border-gray-700";
      case 3:
        return "bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border-amber-200 dark:border-amber-800";
      default:
        return "bg-card border-border";
    }
  };

  // Get level color
  const getLevelColor = (level: number) => {
    if (level >= 8) return "bg-purple-500";
    if (level >= 6) return "bg-blue-500";
    if (level >= 4) return "bg-green-500";
    if (level >= 2) return "bg-yellow-500";
    return "bg-gray-500";
  };

  const totalPages = leaderboardData?.total ? Math.ceil(leaderboardData.total / pageSize) : 1;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-8 md:py-12">
        {/* Hero Section */}
        <div className="text-center mb-8 md:mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
            <Trophy className="w-5 h-5" />
            <span className="font-medium">Community Rankings</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Leaderboard</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            See how you rank among fellow learners. Earn XP by completing lessons, 
            quizzes, and maintaining your learning streak.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <Users className="w-8 h-8 mx-auto mb-2 text-primary" />
              <p className="text-2xl font-bold">{leaderboardData?.total || 0}</p>
              <p className="text-sm text-muted-foreground">Total Learners</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Zap className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
              <p className="text-2xl font-bold">{leaderboardData?.entries?.[0]?.xp?.toLocaleString() || 0}</p>
              <p className="text-sm text-muted-foreground">Top XP</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Flame className="w-8 h-8 mx-auto mb-2 text-orange-500" />
              <p className="text-2xl font-bold">{leaderboardData?.entries?.[0]?.streak || 0}</p>
              <p className="text-sm text-muted-foreground">Longest Streak</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <TrendingUp className="w-8 h-8 mx-auto mb-2 text-green-500" />
              <p className="text-2xl font-bold">{userRank?.rank || "-"}</p>
              <p className="text-sm text-muted-foreground">Your Rank</p>
            </CardContent>
          </Card>
        </div>

        {/* Your Position Card (if logged in) */}
        {isAuthenticated && userRank && (
          <Card className="mb-8 border-primary/50 bg-primary/5">
            <CardContent className="p-6">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                    <Star className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Your Current Position</p>
                    <p className="text-2xl font-bold">Rank #{userRank.rank}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <p className="text-xl font-bold">{userRank.xp?.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">XP</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-bold">Level {userRank.level}</p>
                    <p className="text-sm text-muted-foreground">{userRank.levelTitle}</p>
                  </div>
                  {userRank.streak > 0 && (
                    <div className="text-center flex items-center gap-1">
                      <Flame className="w-5 h-5 text-orange-500" />
                      <p className="text-xl font-bold">{userRank.streak}</p>
                      <p className="text-sm text-muted-foreground">day streak</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Time Filter Tabs */}
        <div className="flex justify-center mb-6">
          <Tabs value={timeFilter} onValueChange={(v) => { setTimeFilter(v as TimeFilter); setCurrentPage(1); }}>
            <TabsList className="grid grid-cols-3 w-full max-w-md">
              <TabsTrigger value="weekly">This Week</TabsTrigger>
              <TabsTrigger value="monthly">This Month</TabsTrigger>
              <TabsTrigger value="allTime">All Time</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Leaderboard List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-primary" />
              Top Learners
              <Badge variant="secondary" className="ml-2">
                {timeFilter === "weekly" ? "Weekly" : timeFilter === "monthly" ? "Monthly" : "All Time"}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {leaderboardLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 rounded-lg border">
                    <Skeleton className="w-10 h-10 rounded-full" />
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="flex-1">
                      <Skeleton className="h-5 w-32 mb-2" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                    <Skeleton className="h-8 w-20" />
                  </div>
                ))}
              </div>
            ) : leaderboardData?.entries?.length === 0 ? (
              <div className="text-center py-12">
                <Trophy className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
                <h3 className="text-lg font-semibold mb-2">No Rankings Yet</h3>
                <p className="text-muted-foreground mb-4">
                  Be the first to climb the leaderboard by completing lessons and earning XP!
                </p>
                <Link href="/courses">
                  <Button>Start Learning</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {leaderboardData?.entries?.map((entry, index) => {
                  const rank = (currentPage - 1) * pageSize + index + 1;
                  const isCurrentUser = user?.id === entry.userId;
                  
                  return (
                    <div
                      key={entry.userId}
                      className={`flex items-center gap-4 p-4 rounded-lg border transition-all hover:shadow-md ${getRankBg(rank)} ${isCurrentUser ? "ring-2 ring-primary" : ""}`}
                    >
                      {/* Rank */}
                      <div className="w-10 flex justify-center">
                        {getRankIcon(rank)}
                      </div>

                      {/* Avatar */}
                      <div className="relative">
                        <img
                          src={entry.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${entry.name}`}
                          alt={entry.name || "User"}
                          className="w-12 h-12 rounded-full border-2 border-background"
                        />
                        <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full ${getLevelColor(entry.level)} flex items-center justify-center text-white text-xs font-bold`}>
                          {entry.level}
                        </div>
                      </div>

                      {/* User Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold truncate">{entry.name || "Anonymous Learner"}</p>
                          {isCurrentUser && (
                            <Badge variant="outline" className="text-xs">You</Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <span>{entry.levelTitle}</span>
                          {entry.streak > 0 && (
                            <span className="flex items-center gap-1">
                              <Flame className="w-3 h-3 text-orange-500" />
                              {entry.streak} day streak
                            </span>
                          )}
                        </div>
                      </div>

                      {/* XP */}
                      <div className="text-right">
                        <p className="text-lg font-bold text-primary">{entry.xp?.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">XP</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-6 pt-6 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground px-4">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* How to Earn XP Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-500" />
              How to Earn XP
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-lg bg-muted/50 text-center">
                <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mx-auto mb-3">
                  <Award className="w-6 h-6 text-blue-500" />
                </div>
                <p className="font-semibold mb-1">Complete Lessons</p>
                <p className="text-sm text-muted-foreground">+25 XP per lesson</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50 text-center">
                <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-3">
                  <Star className="w-6 h-6 text-green-500" />
                </div>
                <p className="font-semibold mb-1">Pass Quizzes</p>
                <p className="text-sm text-muted-foreground">+50 XP (perfect score)</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50 text-center">
                <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center mx-auto mb-3">
                  <Flame className="w-6 h-6 text-orange-500" />
                </div>
                <p className="font-semibold mb-1">Maintain Streak</p>
                <p className="text-sm text-muted-foreground">+10 XP daily bonus</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50 text-center">
                <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mx-auto mb-3">
                  <Trophy className="w-6 h-6 text-purple-500" />
                </div>
                <p className="font-semibold mb-1">Earn Badges</p>
                <p className="text-sm text-muted-foreground">+100 XP per badge</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
