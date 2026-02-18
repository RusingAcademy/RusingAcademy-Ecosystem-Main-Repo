import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RotateCcw, BarChart3, TrendingUp, Calendar, Users, RefreshCw, Trophy } from 'lucide-react';
import { trpc } from "@/lib/trpc";

const AdminDailyReview = () => {
  const { data: stats, isLoading } = trpc.adminDailyReview.getStats.useQuery();

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <RotateCcw className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">Admin Daily Review</h1>
            <p className="text-muted-foreground">Monitor learner study streaks and daily review engagement.</p>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-6 md:py-8 lg:py-12">
          <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Streaks (24h)</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.activeStreaks ?? 0}</div>
                <p className="text-xs text-muted-foreground">Learners who studied in the last 24 hours</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.totalSessions ?? 0}</div>
                <p className="text-xs text-muted-foreground">All-time study sessions recorded</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Cards/Day</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.avgCardsPerDay ?? 0}</div>
                <p className="text-xs text-muted-foreground">Average cards reviewed per session</p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="leaderboard">
            <TabsList>
              <TabsTrigger value="leaderboard">Top Learners</TabsTrigger>
            </TabsList>
            <TabsContent value="leaderboard" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-yellow-500" />
                    Study Streak Leaderboard
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {!stats?.topLearners || (stats.topLearners as any[]).length === 0 ? (
                    <div className="text-center py-6 md:py-8 lg:py-12 text-muted-foreground">
                      <Users className="mx-auto h-12 w-12 mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No study sessions yet</h3>
                      <p className="text-sm">Learners will appear here once they start reviewing flashcards.</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50 dark:bg-white/[0.06] dark:backdrop-blur-sm">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rank</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Learner</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Streak Days</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Cards</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Correct</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Accuracy</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-white/[0.08] dark:backdrop-blur-md divide-y divide-gray-200">
                          {(stats.topLearners as any[]).map((l: any, i: number) => (
                            <tr key={l.userId}>
                              <td className="px-4 py-3 text-sm font-bold text-gray-900">
                                {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`}
                              </td>
                              <td className="px-4 py-3 text-sm font-medium text-gray-900">{l.name || `User #${l.userId}`}</td>
                              <td className="px-4 py-3 text-sm text-gray-700 dark:text-muted-foreground font-semibold">{l.streakDays} days</td>
                              <td className="px-4 py-3 text-sm text-gray-500">{l.totalCards}</td>
                              <td className="px-4 py-3 text-sm text-gray-500">{l.totalCorrect}</td>
                              <td className="px-4 py-3 text-sm">
                                <span className={`font-semibold ${l.totalCards > 0 && (l.totalCorrect / l.totalCards) >= 0.8 ? "text-green-600" : "text-gray-600"}`}>
                                  {l.totalCards > 0 ? Math.round((l.totalCorrect / l.totalCards) * 100) : 0}%
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
};

export default AdminDailyReview;
