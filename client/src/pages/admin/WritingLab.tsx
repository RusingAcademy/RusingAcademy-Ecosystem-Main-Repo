import { useState } from "react";
import { ScrollText, FileText, Brain, BarChart3, Plus, Edit, CheckCircle, Search, Eye, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

export default function WritingLab() {
  const [activeTab, setActiveTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");

  // ── tRPC queries ──
  const promptsQuery = trpc.writing.list.useQuery(undefined, { retry: false });
  const isLoading = promptsQuery.isLoading;
  const prompts = promptsQuery.data ?? [];
  const mockPrompts = prompts.map((p: any) => ({
    id: p.id,
    title: p.title || p.prompt || "Writing Prompt",
    level: p.level || "B1",
    topic: p.topic || "General",
    wordLimit: p.wordLimit || 200,
    submissions: p.submissionCount || 0,
    status: p.status || "active",
  }));
  const mockStats = {
    totalSubmissions: mockPrompts.reduce((s: number, p: any) => s + p.submissions, 0),
    avgScore: 0,
    pendingReviews: 0,
    activeWriters: 0,
  };
  const mockSubmissions: any[] = [];  // Loaded per-prompt when viewing submissions

  const levelColor = (level: string) => {
    const colors: Record<string, string> = { A1: "bg-green-500/10 text-green-500", A2: "bg-emerald-500/10 text-emerald-500", B1: "bg-blue-500/10 text-blue-500", B2: "bg-indigo-500/10 text-indigo-500", C1: "bg-purple-500/10 text-purple-500" };
    return colors[level] || "bg-gray-50 text-gray-500";
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2"><ScrollText className="h-6 w-6" /> Writing Lab & AI Feedback</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage writing prompts, review submissions, and configure AI feedback</p>
        </div>
        <Button onClick={() => toast.info("Create writing prompt —feature launching soon — stay tuned!")}><Plus className="h-4 w-4 mr-1.5" /> Add Prompt</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="p-2 rounded-lg bg-blue-500/10"><FileText className="h-5 w-5 text-blue-500" /></div><div><p className="text-xs text-muted-foreground">Total Submissions</p><p className="text-xl font-bold">{mockStats.totalSubmissions}</p></div></div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="p-2 rounded-lg bg-green-500/10"><BarChart3 className="h-5 w-5 text-green-500" /></div><div><p className="text-xs text-muted-foreground">Avg Score</p><p className="text-xl font-bold">{mockStats.avgScore}%</p></div></div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="p-2 rounded-lg bg-amber-500/10"><Clock className="h-5 w-5 text-amber-500" /></div><div><p className="text-xs text-muted-foreground">Pending Reviews</p><p className="text-xl font-bold">{mockStats.pendingReviews}</p></div></div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="p-2 rounded-lg bg-purple-500/10"><Brain className="h-5 w-5 text-purple-500" /></div><div><p className="text-xs text-muted-foreground">Active Writers</p><p className="text-xl font-bold">{mockStats.activeWriters}</p></div></div></CardContent></Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList><TabsTrigger value="overview">Overview</TabsTrigger><TabsTrigger value="prompts">Prompts</TabsTrigger><TabsTrigger value="submissions">Submissions</TabsTrigger><TabsTrigger value="settings">Settings</TabsTrigger></TabsList>

        <TabsContent value="overview" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card><CardHeader><CardTitle className="text-base">Score Distribution</CardTitle></CardHeader><CardContent>
              <div className="space-y-2">
                {[{ range: "90-100", pct: 15 }, { range: "80-89", pct: 28 }, { range: "70-79", pct: 32 }, { range: "60-69", pct: 18 }, { range: "< 60", pct: 7 }].map(s => (
                  <div key={s.range} className="flex items-center gap-3"><span className="text-sm w-16">{s.range}</span><div className="flex-1 bg-muted rounded-full h-2"><div className="bg-primary rounded-full h-2" style={{ width: `${s.pct * 3}%` }} /></div><span className="text-sm text-muted-foreground w-10 text-right">{s.pct}%</span></div>
                ))}
              </div>
            </CardContent></Card>
            <Card><CardHeader><CardTitle className="text-base">AI Feedback Breakdown</CardTitle></CardHeader><CardContent>
              <div className="space-y-3">
                {[{ label: "Grammar", score: 76 }, { label: "Vocabulary", score: 72 }, { label: "Coherence", score: 74 }].map(m => (
                  <div key={m.label} className="flex items-center gap-3"><span className="text-sm w-24">{m.label}</span><div className="flex-1 bg-muted rounded-full h-3"><div className="bg-primary rounded-full h-3" style={{ width: `${m.score}%` }} /></div><span className="text-sm font-medium w-10 text-right">{m.score}%</span></div>
                ))}
              </div>
            </CardContent></Card>
          </div>
        </TabsContent>

        <TabsContent value="prompts" className="space-y-4 mt-4">
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/50"><tr><th className="text-left p-3 font-medium">Prompt</th><th className="text-center p-3 font-medium">Level</th><th className="text-center p-3 font-medium">Topic</th><th className="text-center p-3 font-medium">Word Limit</th><th className="text-center p-3 font-medium">Submissions</th><th className="text-center p-3 font-medium">Status</th><th className="text-right p-3 font-medium">Actions</th></tr></thead>
              <tbody>
                {mockPrompts.map(p => (
                  <tr key={p.id} className="border-t hover:bg-muted/30">
                    <td className="p-3 font-medium max-w-xs truncate">{p.title}</td>
                    <td className="p-3 text-center"><Badge className={levelColor(p.level)}>{p.level}</Badge></td>
                    <td className="p-3 text-center"><Badge variant="outline">{p.topic}</Badge></td>
                    <td className="p-3 text-center">{p.wordLimit}</td>
                    <td className="p-3 text-center">{p.submissions}</td>
                    <td className="p-3 text-center"><Badge variant={p.status === "active" ? "default" : "secondary"}>{p.status}</Badge></td>
                    <td className="p-3 text-right"><div className="flex justify-end gap-1"><Button variant="ghost" size="icon" className="h-8 w-8"><Edit className="h-4 w-4" /></Button></div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="submissions" className="space-y-4 mt-4">
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/50"><tr><th className="text-left p-3 font-medium">Learner</th><th className="text-left p-3 font-medium">Prompt</th><th className="text-center p-3 font-medium">Grammar</th><th className="text-center p-3 font-medium">Vocabulary</th><th className="text-center p-3 font-medium">Coherence</th><th className="text-center p-3 font-medium">Overall</th><th className="text-center p-3 font-medium">Status</th><th className="text-right p-3 font-medium">Actions</th></tr></thead>
              <tbody>
                {mockSubmissions.map(s => (
                  <tr key={s.id} className="border-t hover:bg-muted/30">
                    <td className="p-3 font-medium">{s.learner}</td>
                    <td className="p-3 max-w-xs truncate">{s.prompt}</td>
                    <td className="p-3 text-center">{s.grammar ?? "—"}</td>
                    <td className="p-3 text-center">{s.vocabulary ?? "—"}</td>
                    <td className="p-3 text-center">{s.coherence ?? "—"}</td>
                    <td className="p-3 text-center font-medium">{s.score ?? "—"}</td>
                    <td className="p-3 text-center"><Badge variant={s.status === "reviewed" ? "default" : "secondary"}>{s.status}</Badge></td>
                    <td className="p-3 text-right"><Button variant="ghost" size="icon" className="h-8 w-8"><Eye className="h-4 w-4" /></Button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4 mt-4">
          <Card><CardHeader><CardTitle className="text-base">AI Feedback Configuration</CardTitle></CardHeader><CardContent className="space-y-4">
            <div className="flex items-center justify-between"><div><Label>Enable AI Auto-Feedback</Label><p className="text-xs text-muted-foreground">Automatically score submissions using AI</p></div><Switch defaultChecked /></div>
            <div className="flex items-center justify-between"><div><Label>Grammar Weight</Label><p className="text-xs text-muted-foreground">Weight of grammar in overall score</p></div><Input type="number" defaultValue={35} className="w-20" /></div>
            <div className="flex items-center justify-between"><div><Label>Vocabulary Weight</Label><p className="text-xs text-muted-foreground">Weight of vocabulary in overall score</p></div><Input type="number" defaultValue={30} className="w-20" /></div>
            <div className="flex items-center justify-between"><div><Label>Coherence Weight</Label><p className="text-xs text-muted-foreground">Weight of coherence in overall score</p></div><Input type="number" defaultValue={35} className="w-20" /></div>
          </CardContent></Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
