import { PenTool, BookOpen, Target, BarChart3, Users, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { trpc } from '@/lib/trpc';

const GrammarDrillsAdmin = () => {
  const { data: stats, isLoading: statsLoading } = trpc.adminGrammarDrills.getStats.useQuery();
  const { data: results, isLoading: resultsLoading } = trpc.adminGrammarDrills.listResults.useQuery({});
  const { data: topics, isLoading: topicsLoading } = trpc.adminGrammarDrills.listTopics.useQuery();

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <PenTool className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">Grammar Drills</h1>
            <p className="text-muted-foreground">Monitor grammar drill performance and learner analytics.</p>
          </div>
        </div>
      </div>

      {statsLoading ? (
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Attempts</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalAttempts ?? 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Score</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.avgScore ?? 0}%</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.activeUsers ?? 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Topics Covered</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{(stats?.topTopics as any[])?.length ?? 0}</div>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="topics">
        <TabsList>
          <TabsTrigger value="topics">Topics</TabsTrigger>
          <TabsTrigger value="results">Recent Results</TabsTrigger>
        </TabsList>

        <TabsContent value="topics" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Topic Performance</CardTitle>
              <CardDescription>Grammar topics with attempt counts and average scores.</CardDescription>
            </CardHeader>
            <CardContent>
              {topicsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : !topics || (topics as any[]).length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <PenTool className="mx-auto h-12 w-12 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No drill results yet</h3>
                  <p className="text-sm">Topics will appear here once learners complete grammar drills.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {(topics as any[]).map((t: any, i: number) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border">
                      <div>
                        <p className="font-semibold">{t.topic}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                          <Badge variant="outline">{t.cefrLevel}</Badge>
                          <span>{t.drillType}</span>
                          <span>{t.attempts} attempts</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`text-lg font-bold ${(t.avgScore ?? 0) >= 80 ? "text-green-600" : (t.avgScore ?? 0) >= 60 ? "text-yellow-600" : "text-red-600"}`}>
                          {t.avgScore ?? 0}%
                        </span>
                        <p className="text-xs text-muted-foreground">avg score</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="results" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Drill Results</CardTitle>
              <CardDescription>Latest grammar drill completions across all learners.</CardDescription>
            </CardHeader>
            <CardContent>
              {resultsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : !results || (results as any[]).length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <BookOpen className="mx-auto h-12 w-12 mb-4" />
                  <p>No drill results yet.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Learner</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Topic</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Level</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Score</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-slate-900 divide-y divide-gray-200">
                      {(results as any[]).map((r: any) => (
                        <tr key={r.id}>
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">{r.userName || `User #${r.userId}`}</td>
                          <td className="px-4 py-3 text-sm text-gray-500">{r.topic}</td>
                          <td className="px-4 py-3"><Badge variant="outline">{r.cefrLevel}</Badge></td>
                          <td className="px-4 py-3">
                            <span className={`font-semibold ${r.score >= 80 ? "text-green-600" : r.score >= 60 ? "text-yellow-600" : "text-red-600"}`}>
                              {r.score}%
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-500">{r.completedAt ? new Date(r.completedAt).toLocaleDateString() : "—"}</td>
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
    </div>
  );
};

export default GrammarDrillsAdmin;
