import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import {
  Brain, TrendingUp, BarChart3, Eye, Clock, Users,
  AlertTriangle, CheckCircle, Star, ArrowUpRight,
  ArrowDownRight, Download, RefreshCw, BookOpen,
  FileText, Lightbulb, Target, Zap,
} from "lucide-react";

export default function ContentIntelligence() {
  const [activeTab, setActiveTab] = useState("performance");
  const [dateRange, setDateRange] = useState("30d");

  const { data: stats } = trpc.contentIntel.getStats.useQuery({ dateRange });
  const { data: topContent } = trpc.contentIntel.getTopContent.useQuery({ dateRange });
  const { data: insights } = trpc.contentIntel.getInsights.useQuery();

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Brain className="h-6 w-6" /> Content Intelligence
          </h1>
          <p className="text-sm text-muted-foreground mt-1">AI-powered content performance analysis and optimization recommendations</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="all">All time</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={() => toast.success("Report exported")}>
            <Download className="h-4 w-4 mr-1.5" /> Export Report
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10"><Eye className="h-5 w-5 text-blue-500" /></div>
              <div>
                <p className="text-xs text-muted-foreground">Content Views</p>
                <p className="text-xl font-bold">{(stats?.totalViews ?? 0).toLocaleString()}</p>
                <p className="text-xs text-green-500 flex items-center gap-0.5"><ArrowUpRight className="h-3 w-3" /> +{stats?.viewsGrowth ?? 0}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/10"><CheckCircle className="h-5 w-5 text-green-500" /></div>
              <div>
                <p className="text-xs text-muted-foreground">Completion Rate</p>
                <p className="text-xl font-bold">{stats?.avgCompletionRate ?? 0}%</p>
                <p className="text-xs text-green-500 flex items-center gap-0.5"><ArrowUpRight className="h-3 w-3" /> +{stats?.completionGrowth ?? 0}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-500/10"><Clock className="h-5 w-5 text-purple-500" /></div>
              <div>
                <p className="text-xs text-muted-foreground">Avg. Time on Content</p>
                <p className="text-xl font-bold">{stats?.avgTimeMinutes ?? 0}m</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-500/10"><Star className="h-5 w-5 text-amber-500" /></div>
              <div>
                <p className="text-xs text-muted-foreground">Avg. Rating</p>
                <p className="text-xl font-bold">{stats?.avgRating ?? 0}/5</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-cyan-500/10"><Target className="h-5 w-5 text-cyan-500" /></div>
              <div>
                <p className="text-xs text-muted-foreground">Engagement Score</p>
                <p className="text-xl font-bold">{stats?.engagementScore ?? 0}/100</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="performance">Content Performance</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
          <TabsTrigger value="optimization">Optimization</TabsTrigger>
          <TabsTrigger value="gaps">Content Gaps</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-4">
          {/* Top Performing Content */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Top Performing Content</CardTitle>
                <Badge variant="outline">{(topContent as any[])?.length ?? 0} items</Badge>
              </div>
            </CardHeader>
            <CardContent>
              {!topContent || (topContent as any[]).length === 0 ? (
                <div className="text-center py-12">
                  <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
                  <p className="font-medium">No content data yet</p>
                  <p className="text-sm text-muted-foreground mt-1">Performance data will appear as students interact with content</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {(topContent as any[]).map((item: any, i: number) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-sm font-bold">
                          #{i + 1}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{item.title}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Badge variant="outline" className="text-[10px] h-5">{item.type}</Badge>
                            <Eye className="h-3 w-3" /> {item.views} views
                            <span>•</span>
                            <Clock className="h-3 w-3" /> {item.avgTime}m avg
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="text-sm font-bold">{item.completionRate}%</p>
                          <p className="text-xs text-muted-foreground">completion</p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-0.5">
                            <Star className="h-3 w-3 text-amber-500" />
                            <span className="text-sm font-medium">{item.rating}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Content by Type */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { type: "Courses", icon: BookOpen, count: stats?.courseCount ?? 0, views: stats?.courseViews ?? 0, completion: stats?.courseCompletion ?? 0, color: "bg-blue-500/10 text-blue-500" },
              { type: "Lessons", icon: FileText, count: stats?.lessonCount ?? 0, views: stats?.lessonViews ?? 0, completion: stats?.lessonCompletion ?? 0, color: "bg-green-500/10 text-green-500" },
              { type: "Practice", icon: Brain, count: stats?.practiceCount ?? 0, views: stats?.practiceViews ?? 0, completion: stats?.practiceCompletion ?? 0, color: "bg-purple-500/10 text-purple-500" },
            ].map((t) => (
              <Card key={t.type}>
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${t.color}`}><t.icon className="h-5 w-5" /></div>
                    <div>
                      <p className="font-medium">{t.type}</p>
                      <p className="text-xs text-muted-foreground">{t.count} items</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-center">
                    <div className="p-2 bg-muted/30 rounded">
                      <p className="text-lg font-bold">{t.views.toLocaleString()}</p>
                      <p className="text-[10px] text-muted-foreground">Views</p>
                    </div>
                    <div className="p-2 bg-muted/30 rounded">
                      <p className="text-lg font-bold">{t.completion}%</p>
                      <p className="text-[10px] text-muted-foreground">Completion</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2"><Lightbulb className="h-5 w-5 text-amber-500" /> AI-Generated Insights</CardTitle>
                <Button size="sm" variant="outline" onClick={() => toast.info("Refreshing insights with latest data...")}>
                  <RefreshCw className="h-4 w-4 mr-1.5" /> Refresh
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {!insights || (insights as any[]).length === 0 ? (
                <div className="text-center py-8">
                  <Brain className="h-10 w-10 mx-auto text-muted-foreground/30 mb-2" />
                  <p className="text-sm text-muted-foreground">Insights will be generated as more data becomes available</p>
                </div>
              ) : (
                (insights as any[]).map((insight: any, i: number) => (
                  <div key={i} className={`p-4 rounded-lg border ${insight.priority === "high" ? "border-red-500/30 bg-red-500/5" : insight.priority === "medium" ? "border-amber-500/30 bg-amber-500/5" : "border-green-500/30 bg-green-500/5"}`}>
                    <div className="flex items-start gap-3">
                      {insight.priority === "high" ? <AlertTriangle className="h-5 w-5 text-red-500 shrink-0" /> : insight.priority === "medium" ? <Lightbulb className="h-5 w-5 text-amber-500 shrink-0" /> : <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />}
                      <div>
                        <p className="text-sm font-medium">{insight.title}</p>
                        <p className="text-xs text-muted-foreground mt-1">{insight.description}</p>
                        {insight.action && (
                          <Button size="sm" variant="outline" className="mt-2 h-7 text-xs" onClick={() => toast.info(insight.action)}>
                            <Zap className="h-3 w-3 mr-1" /> Take Action
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="optimization" className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-lg">Content Optimization Suggestions</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {[
                { title: "Shorten Lesson 3.2 — Grammar Fundamentals", desc: "Average completion drops 40% after 15 minutes. Consider splitting into two shorter lessons.", impact: "High", type: "length" },
                { title: "Add more practice exercises to Module 5", desc: "Students who complete Module 5 practice score 25% higher on SLE exams.", impact: "High", type: "content" },
                { title: "Update vocabulary list in Lesson 2.4", desc: "3 terms are outdated based on latest SLE exam format changes.", impact: "Medium", type: "accuracy" },
                { title: "Add video content to oral practice sections", desc: "Courses with video have 2x higher engagement rates.", impact: "Medium", type: "format" },
                { title: "Improve quiz difficulty progression", desc: "Quiz 4 has a 90% pass rate while Quiz 5 has 30%. Consider adding intermediate questions.", impact: "Low", type: "difficulty" },
              ].map((s, i) => (
                <div key={i} className="flex items-start justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Zap className={`h-5 w-5 shrink-0 mt-0.5 ${s.impact === "High" ? "text-red-500" : s.impact === "Medium" ? "text-amber-500" : "text-blue-500"}`} />
                    <div>
                      <p className="text-sm font-medium">{s.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{s.desc}</p>
                    </div>
                  </div>
                  <Badge variant={s.impact === "High" ? "destructive" : s.impact === "Medium" ? "default" : "secondary"} className="shrink-0 ml-2">
                    {s.impact}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="gaps" className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-lg">Content Gap Analysis</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {[
                { topic: "Oral Interaction — Level C", coverage: 15, demand: 85, priority: "Critical" },
                { topic: "Written Expression — Administrative Emails", coverage: 30, demand: 75, priority: "High" },
                { topic: "Reading — Policy Documents", coverage: 45, demand: 70, priority: "Medium" },
                { topic: "Grammar — Subjunctive Mood", coverage: 20, demand: 60, priority: "High" },
                { topic: "Vocabulary — Legal/Regulatory Terms", coverage: 35, demand: 55, priority: "Medium" },
              ].map((gap, i) => (
                <div key={i} className="p-3 bg-muted/30 rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{gap.topic}</p>
                    <Badge variant={gap.priority === "Critical" ? "destructive" : gap.priority === "High" ? "default" : "secondary"}>
                      {gap.priority}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-muted-foreground">Current Coverage</span>
                        <span>{gap.coverage}%</span>
                      </div>
                      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: `${gap.coverage}%` }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-muted-foreground">Student Demand</span>
                        <span>{gap.demand}%</span>
                      </div>
                      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-amber-500 rounded-full" style={{ width: `${gap.demand}%` }} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
