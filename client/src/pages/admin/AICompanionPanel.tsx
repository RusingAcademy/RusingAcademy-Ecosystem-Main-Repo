import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import {
  Brain, Activity, Users, BarChart3, Settings2, Mic, BookOpen,
  TrendingUp, Loader2, Save, Target, Clock, MessageSquare
} from "lucide-react";

type AITab = "overview" | "settings" | "usage" | "oral" | "content";

export default function AICompanionPanel() {
  const [activeTab, setActiveTab] = useState<AITab>("overview");
  const [aiSettings, setAiSettings] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const overviewQuery = trpc.aiAnalytics.getOverview.useQuery();
  const topUsersQuery = trpc.aiAnalytics.getTopUsers.useQuery({ limit: 10 });
  const byLevelQuery = trpc.aiAnalytics.getByLevel.useQuery();
  const byTypeQuery = trpc.aiAnalytics.getByType.useQuery();
  const dailyTrendQuery = trpc.aiAnalytics.getDailyTrend.useQuery({ days: 30 });
  const settingsQuery = trpc.settings.getAll.useQuery();
  const setBulkMut = trpc.settings.setBulk.useMutation();

  const updateAiField = (key: string, value: string) => {
    setAiSettings(prev => ({ ...prev, [key]: value }));
  };

  const saveAiSettings = async (keys: string[]) => {
    setSaving(true);
    try {
      const settings: Record<string, string> = {};
      keys.forEach(k => { if (aiSettings[k] !== undefined) settings[k] = aiSettings[k]; });
      await setBulkMut.mutateAsync({ settings });
      settingsQuery.refetch();
      toast.success("AI settings saved");
    } catch {
      toast.error("Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const overview = overviewQuery.data;

  const kpiCards = [
    { label: "Total AI Sessions", value: overview?.totalAiSessions ?? 0, icon: Brain, color: "text-violet-600" },
    { label: "Practice Logs", value: overview?.totalPracticeLogs ?? 0, icon: Activity, color: "text-blue-600" },
    { label: "Avg Session Duration", value: `${overview?.avgSessionDuration ?? 0}s`, icon: Clock, color: "text-emerald-600" },
    { label: "Avg Score", value: `${overview?.avgScore ?? 0}%`, icon: Target, color: "text-amber-600" },
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((kpi) => (
          <Card key={kpi.label}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <kpi.icon className={`h-5 w-5 ${kpi.color}`} />
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-2xl font-bold">{kpi.value}</p>
              <p className="text-sm text-muted-foreground">{kpi.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader><CardTitle className="text-sm">Top AI Users</CardTitle></CardHeader>
        <CardContent>
          {topUsersQuery.isLoading ? (
            <div className="flex items-center gap-2 text-muted-foreground py-4 justify-center"><Loader2 className="h-4 w-4 animate-spin" /> Loading...</div>
          ) : (
            <div className="space-y-2">
              {(topUsersQuery.data as any[] || []).length === 0 && <p className="text-sm text-muted-foreground text-center py-4">No AI usage data yet.</p>}
              {(topUsersQuery.data as any[] || []).map((user: any, i: number) => (
                <div key={user.userId || i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50">
                  <span className="text-sm font-medium text-muted-foreground w-6">{i + 1}.</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{user.name || user.email || "Unknown"}</p>
                    <p className="text-xs text-muted-foreground">{user.sessionCount} sessions — Avg: {Math.round(Number(user.avgScore || 0))}%</p>
                  </div>
                  <Badge variant="outline" className="text-xs">{Math.round(Number(user.totalDuration || 0) / 60)}min</Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="text-sm">By PFL Level</CardTitle></CardHeader>
          <CardContent>
            {(byLevelQuery.data as any[] || []).length === 0 && <p className="text-sm text-muted-foreground text-center py-4">No data yet.</p>}
            {(byLevelQuery.data as any[] || []).map((row: any) => (
              <div key={row.targetLevel} className="flex items-center justify-between py-2 border-b last:border-0">
                <div className="flex items-center gap-2"><Badge>{row.targetLevel}</Badge><span className="text-sm">{row.count} sessions</span></div>
                <span className="text-sm font-medium">{Math.round(Number(row.avgScore || 0))}% avg</span>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-sm">By Practice Type</CardTitle></CardHeader>
          <CardContent>
            {(byTypeQuery.data as any[] || []).length === 0 && <p className="text-sm text-muted-foreground text-center py-4">No data yet.</p>}
            {(byTypeQuery.data as any[] || []).map((row: any) => (
              <div key={row.practiceType} className="flex items-center justify-between py-2 border-b last:border-0">
                <div className="flex items-center gap-2"><Badge variant="outline">{row.practiceType}</Badge><span className="text-sm">{row.count} sessions</span></div>
                <span className="text-sm font-medium">{Math.round(Number(row.avgScore || 0))}% avg</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader><CardTitle className="text-sm">Daily AI Usage (Last 30 Days)</CardTitle></CardHeader>
        <CardContent>
          {(dailyTrendQuery.data as any[] || []).length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">No daily data yet. Usage will appear here once learners start practicing.</p>
          ) : (
            <div className="space-y-1">
              {(dailyTrendQuery.data as any[] || []).slice(-14).map((day: any) => (
                <div key={day.date} className="flex items-center gap-3 text-sm">
                  <span className="w-24 text-muted-foreground">{day.date}</span>
                  <div className="flex-1 bg-muted rounded-full h-4 overflow-hidden">
                    <div className="bg-primary/60 h-full rounded-full" style={{ width: `${Math.min(100, Number(day.sessions) * 10)}%` }} />
                  </div>
                  <span className="w-20 text-right font-medium">{day.sessions} sess.</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader><CardTitle>Lingueefy AI Configuration</CardTitle><CardDescription>Control how the AI companion behaves for your learners.</CardDescription></CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>AI Model</Label>
              <Select value={aiSettings.ai_model || "gpt-4o"} onValueChange={(v) => updateAiField("ai_model", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="gpt-4o">GPT-4o (Recommended)</SelectItem>
                  <SelectItem value="gpt-4o-mini">GPT-4o Mini (Faster)</SelectItem>
                  <SelectItem value="claude-3-5-sonnet">Claude 3.5 Sonnet</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5"><Label>Max Tokens per Response</Label><Input value={aiSettings.ai_max_tokens || "1024"} onChange={(e) => updateAiField("ai_max_tokens", e.target.value)} placeholder="1024" /></div>
          </div>
          <div className="space-y-1.5"><Label>System Prompt</Label><Textarea value={aiSettings.ai_system_prompt || ""} onChange={(e) => updateAiField("ai_system_prompt", e.target.value)} placeholder="You are Lingueefy, a bilingual coaching companion for Canadian public servants preparing for SLE exams..." rows={5} /></div>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2"><Label>Enable Oral Simulation</Label><Switch checked={aiSettings.ai_oral_enabled === "true"} onCheckedChange={(v) => updateAiField("ai_oral_enabled", v ? "true" : "false")} /></div>
            <div className="flex items-center justify-between py-2"><Label>Enable Written Practice</Label><Switch checked={aiSettings.ai_written_enabled !== "false"} onCheckedChange={(v) => updateAiField("ai_written_enabled", v ? "true" : "false")} /></div>
            <div className="flex items-center justify-between py-2"><Label>Enable Grammar Correction</Label><Switch checked={aiSettings.ai_grammar_enabled !== "false"} onCheckedChange={(v) => updateAiField("ai_grammar_enabled", v ? "true" : "false")} /></div>
            <div className="flex items-center justify-between py-2"><Label>Enable Vocabulary Builder</Label><Switch checked={aiSettings.ai_vocab_enabled !== "false"} onCheckedChange={(v) => updateAiField("ai_vocab_enabled", v ? "true" : "false")} /></div>
          </div>
          <div className="space-y-1.5"><Label>Daily Session Limit per User</Label><Input value={aiSettings.ai_daily_limit || "10"} onChange={(e) => updateAiField("ai_daily_limit", e.target.value)} placeholder="10" /></div>
          <Button onClick={() => saveAiSettings(["ai_model", "ai_max_tokens", "ai_system_prompt", "ai_oral_enabled", "ai_written_enabled", "ai_grammar_enabled", "ai_vocab_enabled", "ai_daily_limit"])} disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />} Save AI Settings
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  const renderUsage = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader><CardTitle>AI Usage Analytics</CardTitle><CardDescription>Detailed breakdown of how learners interact with the AI companion.</CardDescription></CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="p-4 bg-muted/50 rounded-lg text-center"><Brain className="h-6 w-6 mx-auto mb-2 text-violet-600" /><p className="text-xl font-bold">{overview?.totalAiSessions ?? 0}</p><p className="text-xs text-muted-foreground">Total Sessions</p></div>
            <div className="p-4 bg-muted/50 rounded-lg text-center"><MessageSquare className="h-6 w-6 mx-auto mb-2 text-blue-600" /><p className="text-xl font-bold">{overview?.totalMessages ?? 0}</p><p className="text-xs text-muted-foreground">Est. Messages</p></div>
            <div className="p-4 bg-muted/50 rounded-lg text-center"><Clock className="h-6 w-6 mx-auto mb-2 text-emerald-600" /><p className="text-xl font-bold">{overview?.avgSessionDuration ?? 0}s</p><p className="text-xs text-muted-foreground">Avg Duration</p></div>
            <div className="p-4 bg-muted/50 rounded-lg text-center"><Target className="h-6 w-6 mx-auto mb-2 text-amber-600" /><p className="text-xl font-bold">{overview?.avgScore ?? 0}%</p><p className="text-xs text-muted-foreground">Avg Score</p></div>
          </div>
          <p className="text-sm text-muted-foreground">Detailed analytics will populate as learners use the AI companion.</p>
        </CardContent>
      </Card>
    </div>
  );

  const renderOral = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader><CardTitle>Oral Simulation Tracking</CardTitle><CardDescription>Monitor oral practice sessions, pronunciation scores, and SLE oral exam preparation.</CardDescription></CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="p-4 bg-muted/50 rounded-lg text-center"><Mic className="h-6 w-6 mx-auto mb-2 text-red-500" /><p className="text-xl font-bold">{overview?.totalPracticeLogs ?? 0}</p><p className="text-xs text-muted-foreground">Oral Sessions</p></div>
            <div className="p-4 bg-muted/50 rounded-lg text-center"><Target className="h-6 w-6 mx-auto mb-2 text-amber-600" /><p className="text-xl font-bold">{overview?.avgScore ?? 0}%</p><p className="text-xs text-muted-foreground">Avg Oral Score</p></div>
            <div className="p-4 bg-muted/50 rounded-lg text-center"><Users className="h-6 w-6 mx-auto mb-2 text-blue-600" /><p className="text-xl font-bold">{(topUsersQuery.data as any[] || []).length}</p><p className="text-xs text-muted-foreground">Active Speakers</p></div>
          </div>
          <p className="text-sm text-muted-foreground">Oral simulation data will appear here as learners practice speaking exercises.</p>
        </CardContent>
      </Card>
    </div>
  );

  const renderContent = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader><CardTitle>Content Feeding</CardTitle><CardDescription>Manage the knowledge base and training content that powers the AI companion.</CardDescription></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5"><Label>Custom Knowledge Base</Label><Textarea value={aiSettings.ai_knowledge_base || ""} onChange={(e) => updateAiField("ai_knowledge_base", e.target.value)} placeholder="Paste SLE exam preparation content, grammar rules, vocabulary lists..." rows={8} /></div>
          <div className="space-y-1.5"><Label>Exam-Specific Instructions</Label><Textarea value={aiSettings.ai_exam_instructions || ""} onChange={(e) => updateAiField("ai_exam_instructions", e.target.value)} placeholder="Specific instructions for SLE exam preparation (Reading, Writing, Oral)..." rows={4} /></div>
          <div className="space-y-1.5"><Label>Vocabulary Focus Areas</Label><Input value={aiSettings.ai_vocab_focus || ""} onChange={(e) => updateAiField("ai_vocab_focus", e.target.value)} placeholder="e.g. Government terminology, Policy language, Administrative French" /></div>
          <Button onClick={() => saveAiSettings(["ai_knowledge_base", "ai_exam_instructions", "ai_vocab_focus"])} disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />} Save Content Settings
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  const tabItems: { key: AITab; label: string; icon: any }[] = [
    { key: "overview", label: "Overview", icon: BarChart3 },
    { key: "settings", label: "AI Settings", icon: Settings2 },
    { key: "usage", label: "Usage Analytics", icon: Activity },
    { key: "oral", label: "Oral Simulation", icon: Mic },
    { key: "content", label: "Content Feeding", icon: BookOpen },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1"><Brain className="h-6 w-6 text-violet-600" /><h1 className="text-2xl font-bold">Lingueefy AI Companion</h1></div>
        <p className="text-sm text-muted-foreground">Full control over your AI coaching system — settings, analytics, oral tracking, and content feeding.</p>
      </div>
      <div className="flex gap-1 mb-6 border-b">
        {tabItems.map((tab) => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${activeTab === tab.key ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
            <tab.icon className="h-4 w-4" /> {tab.label}
          </button>
        ))}
      </div>
      {activeTab === "overview" && renderOverview()}
      {activeTab === "settings" && renderSettings()}
      {activeTab === "usage" && renderUsage()}
      {activeTab === "oral" && renderOral()}
      {activeTab === "content" && renderContent()}
    </div>
  );
}
