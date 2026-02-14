import { useState } from "react";
import { BookOpenCheck, Clock, Target, BarChart3, Plus, Edit, Trash2, Eye, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

// TODO: Replace with trpc calls when routers are wired
const mockStats = { totalPassages: 48, completionRate: 72, avgScore: 78, activeReaders: 156 };
const mockPassages = [
  { id: 1, title: "La vie quotidienne à Montréal", level: "A2", wordCount: 320, questionCount: 5, status: "published", completions: 89 },
  { id: 2, title: "Le système parlementaire canadien", level: "B2", wordCount: 580, questionCount: 8, status: "published", completions: 45 },
  { id: 3, title: "Les innovations technologiques", level: "C1", wordCount: 720, questionCount: 10, status: "draft", completions: 0 },
  { id: 4, title: "Recette traditionnelle québécoise", level: "A1", wordCount: 180, questionCount: 4, status: "published", completions: 134 },
  { id: 5, title: "L'environnement et le développement durable", level: "B1", wordCount: 450, questionCount: 6, status: "published", completions: 67 },
];

export default function ReadingLab() {
  const [activeTab, setActiveTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [levelFilter, setLevelFilter] = useState("all");
  const [showCreate, setShowCreate] = useState(false);

  const filteredPassages = mockPassages.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLevel = levelFilter === "all" || p.level === levelFilter;
    return matchesSearch && matchesLevel;
  });

  const levelColor = (level: string) => {
    const colors: Record<string, string> = { A1: "bg-green-500/10 text-green-500", A2: "bg-emerald-500/10 text-emerald-500", B1: "bg-blue-500/10 text-blue-500", B2: "bg-indigo-500/10 text-indigo-500", C1: "bg-purple-500/10 text-purple-500", C2: "bg-red-500/10 text-red-500" };
    return colors[level] || "bg-gray-500/10 text-gray-500";
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <BookOpenCheck className="h-6 w-6" /> Reading Comprehension Lab
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Manage reading passages, comprehension questions, and learner analytics</p>
        </div>
        <Button onClick={() => { setShowCreate(true); toast.info("Create passage form — coming soon"); }}>
          <Plus className="h-4 w-4 mr-1.5" /> Add Passage
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="p-2 rounded-lg bg-blue-500/10"><BookOpenCheck className="h-5 w-5 text-blue-500" /></div><div><p className="text-xs text-muted-foreground">Total Passages</p><p className="text-xl font-bold">{mockStats.totalPassages}</p></div></div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="p-2 rounded-lg bg-green-500/10"><Target className="h-5 w-5 text-green-500" /></div><div><p className="text-xs text-muted-foreground">Completion Rate</p><p className="text-xl font-bold">{mockStats.completionRate}%</p></div></div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="p-2 rounded-lg bg-amber-500/10"><BarChart3 className="h-5 w-5 text-amber-500" /></div><div><p className="text-xs text-muted-foreground">Avg Score</p><p className="text-xl font-bold">{mockStats.avgScore}%</p></div></div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="p-2 rounded-lg bg-purple-500/10"><Clock className="h-5 w-5 text-purple-500" /></div><div><p className="text-xs text-muted-foreground">Active Readers</p><p className="text-xl font-bold">{mockStats.activeReaders}</p></div></div></CardContent></Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList><TabsTrigger value="overview">Overview</TabsTrigger><TabsTrigger value="passages">Passages</TabsTrigger><TabsTrigger value="questions">Questions</TabsTrigger><TabsTrigger value="settings">Settings</TabsTrigger></TabsList>

        <TabsContent value="overview" className="space-y-4 mt-4">
          <Card><CardHeader><CardTitle className="text-base">Performance by CEFR Level</CardTitle></CardHeader><CardContent>
            <div className="space-y-3">
              {["A1", "A2", "B1", "B2", "C1"].map(level => (
                <div key={level} className="flex items-center gap-3">
                  <Badge className={levelColor(level)}>{level}</Badge>
                  <div className="flex-1 bg-muted rounded-full h-2"><div className="bg-primary rounded-full h-2" style={{ width: `${60 + Math.random() * 35}%` }} /></div>
                  <span className="text-sm text-muted-foreground w-12 text-right">{Math.round(60 + Math.random() * 35)}%</span>
                </div>
              ))}
            </div>
          </CardContent></Card>
        </TabsContent>

        <TabsContent value="passages" className="space-y-4 mt-4">
          <div className="flex gap-3">
            <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Search passages..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-9" /></div>
            <Select value={levelFilter} onValueChange={setLevelFilter}><SelectTrigger className="w-32"><SelectValue placeholder="Level" /></SelectTrigger><SelectContent><SelectItem value="all">All Levels</SelectItem>{["A1","A2","B1","B2","C1","C2"].map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}</SelectContent></Select>
          </div>
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/50"><tr><th className="text-left p-3 font-medium">Title</th><th className="text-center p-3 font-medium">Level</th><th className="text-center p-3 font-medium">Words</th><th className="text-center p-3 font-medium">Questions</th><th className="text-center p-3 font-medium">Status</th><th className="text-center p-3 font-medium">Completions</th><th className="text-right p-3 font-medium">Actions</th></tr></thead>
              <tbody>
                {filteredPassages.map(p => (
                  <tr key={p.id} className="border-t hover:bg-muted/30">
                    <td className="p-3 font-medium">{p.title}</td>
                    <td className="p-3 text-center"><Badge className={levelColor(p.level)}>{p.level}</Badge></td>
                    <td className="p-3 text-center">{p.wordCount}</td>
                    <td className="p-3 text-center">{p.questionCount}</td>
                    <td className="p-3 text-center"><Badge variant={p.status === "published" ? "default" : "secondary"}>{p.status}</Badge></td>
                    <td className="p-3 text-center">{p.completions}</td>
                    <td className="p-3 text-right"><div className="flex justify-end gap-1"><Button variant="ghost" size="icon" className="h-8 w-8"><Eye className="h-4 w-4" /></Button><Button variant="ghost" size="icon" className="h-8 w-8"><Edit className="h-4 w-4" /></Button><Button variant="ghost" size="icon" className="h-8 w-8 text-destructive"><Trash2 className="h-4 w-4" /></Button></div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="questions" className="mt-4">
          <Card><CardContent className="p-8 text-center text-muted-foreground"><BookOpenCheck className="h-12 w-12 mx-auto mb-3 opacity-50" /><p className="font-medium">Select a passage to manage its questions</p><p className="text-sm mt-1">Go to the Passages tab and click Edit on a passage to manage its comprehension questions.</p></CardContent></Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4 mt-4">
          <Card><CardHeader><CardTitle className="text-base">Reading Lab Settings</CardTitle></CardHeader><CardContent className="space-y-4">
            <div className="flex items-center justify-between"><div><Label>Enable Timer</Label><p className="text-xs text-muted-foreground">Show countdown timer during reading exercises</p></div><Switch defaultChecked /></div>
            <div className="flex items-center justify-between"><div><Label>Show Word Count</Label><p className="text-xs text-muted-foreground">Display word count and estimated reading time</p></div><Switch defaultChecked /></div>
            <div className="flex items-center justify-between"><div><Label>Track WPM</Label><p className="text-xs text-muted-foreground">Calculate and display words-per-minute reading speed</p></div><Switch defaultChecked /></div>
            <div><Label>Default Time Limit (minutes)</Label><Input type="number" defaultValue={15} className="mt-1 w-32" /></div>
            <div><Label>Minimum Pass Score (%)</Label><Input type="number" defaultValue={60} className="mt-1 w-32" /></div>
          </CardContent></Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
