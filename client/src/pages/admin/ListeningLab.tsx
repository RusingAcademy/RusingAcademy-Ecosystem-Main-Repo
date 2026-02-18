import { useState } from "react";
import { Headphones, Clock, Volume2, BarChart3, Plus, Edit, Trash2, Play, Search, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

const mockStats = { totalClips: 36, completionRate: 65, avgScore: 71, activeListeners: 98 };
const mockAudio = [
  { id: 1, title: "Conversation au bureau", level: "A2", duration: "2:30", questions: 4, status: "published", completions: 78, hasTranscript: true },
  { id: 2, title: "Bulletin de nouvelles", level: "B2", duration: "4:15", questions: 7, status: "published", completions: 34, hasTranscript: true },
  { id: 3, title: "Débat parlementaire", level: "C1", duration: "6:00", questions: 10, status: "draft", completions: 0, hasTranscript: false },
  { id: 4, title: "Message téléphonique", level: "A1", duration: "1:15", questions: 3, status: "published", completions: 112, hasTranscript: true },
  { id: 5, title: "Entrevue d'emploi", level: "B1", duration: "3:45", questions: 6, status: "published", completions: 56, hasTranscript: true },
];

export default function ListeningLab() {
  const [activeTab, setActiveTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [levelFilter, setLevelFilter] = useState("all");

  const filteredAudio = mockAudio.filter(a => {
    const matchesSearch = a.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLevel = levelFilter === "all" || a.level === levelFilter;
    return matchesSearch && matchesLevel;
  });

  const levelColor = (level: string) => {
    const colors: Record<string, string> = { A1: "bg-green-500/10 text-green-500", A2: "bg-emerald-500/10 text-emerald-500", B1: "bg-blue-500/10 text-blue-500", B2: "bg-indigo-500/10 text-indigo-500", C1: "bg-purple-500/10 text-purple-500", C2: "bg-red-500/10 text-red-500" };
    return colors[level] || "bg-gray-50 dark:bg-white/[0.06] dark:backdrop-blur-sm0/10 text-gray-500";
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2"><Headphones className="h-6 w-6" /> Listening Comprehension Lab</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage audio passages, comprehension questions, and listening analytics</p>
        </div>
        <Button onClick={() => toast.info("Create audio exercise — coming soon")}><Plus className="h-4 w-4 mr-1.5" /> Add Audio</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="p-2 rounded-lg bg-blue-500/10"><Headphones className="h-5 w-5 text-blue-500" /></div><div><p className="text-xs text-muted-foreground">Total Clips</p><p className="text-xl font-bold">{mockStats.totalClips}</p></div></div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="p-2 rounded-lg bg-green-500/10"><Volume2 className="h-5 w-5 text-green-500" /></div><div><p className="text-xs text-muted-foreground">Completion Rate</p><p className="text-xl font-bold">{mockStats.completionRate}%</p></div></div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="p-2 rounded-lg bg-amber-500/10"><BarChart3 className="h-5 w-5 text-amber-500" /></div><div><p className="text-xs text-muted-foreground">Avg Score</p><p className="text-xl font-bold">{mockStats.avgScore}%</p></div></div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="p-2 rounded-lg bg-purple-500/10"><Clock className="h-5 w-5 text-purple-500" /></div><div><p className="text-xs text-muted-foreground">Active Listeners</p><p className="text-xl font-bold">{mockStats.activeListeners}</p></div></div></CardContent></Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList><TabsTrigger value="overview">Overview</TabsTrigger><TabsTrigger value="audio">Audio Library</TabsTrigger><TabsTrigger value="questions">Questions</TabsTrigger><TabsTrigger value="settings">Settings</TabsTrigger></TabsList>

        <TabsContent value="overview" className="space-y-4 mt-4">
          <Card><CardHeader><CardTitle className="text-base">Listening Performance by Level</CardTitle></CardHeader><CardContent>
            <div className="space-y-3">
              {["A1", "A2", "B1", "B2", "C1"].map(level => (
                <div key={level} className="flex items-center gap-3">
                  <Badge className={levelColor(level)}>{level}</Badge>
                  <div className="flex-1 bg-muted rounded-full h-2"><div className="bg-primary rounded-full h-2" style={{ width: `${55 + Math.random() * 40}%` }} /></div>
                  <span className="text-sm text-muted-foreground w-12 text-right">{Math.round(55 + Math.random() * 40)}%</span>
                </div>
              ))}
            </div>
          </CardContent></Card>
        </TabsContent>

        <TabsContent value="audio" className="space-y-4 mt-4">
          <div className="flex gap-3">
            <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Search audio..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-9" /></div>
            <Select value={levelFilter} onValueChange={setLevelFilter}><SelectTrigger className="w-32"><SelectValue placeholder="Level" /></SelectTrigger><SelectContent><SelectItem value="all">All Levels</SelectItem>{["A1","A2","B1","B2","C1","C2"].map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}</SelectContent></Select>
          </div>
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/50"><tr><th className="text-left p-3 font-medium">Title</th><th className="text-center p-3 font-medium">Level</th><th className="text-center p-3 font-medium">Duration</th><th className="text-center p-3 font-medium">Questions</th><th className="text-center p-3 font-medium">Transcript</th><th className="text-center p-3 font-medium">Status</th><th className="text-center p-3 font-medium">Completions</th><th className="text-right p-3 font-medium">Actions</th></tr></thead>
              <tbody>
                {filteredAudio.map(a => (
                  <tr key={a.id} className="border-t hover:bg-muted/30">
                    <td className="p-3 font-medium">{a.title}</td>
                    <td className="p-3 text-center"><Badge className={levelColor(a.level)}>{a.level}</Badge></td>
                    <td className="p-3 text-center">{a.duration}</td>
                    <td className="p-3 text-center">{a.questions}</td>
                    <td className="p-3 text-center">{a.hasTranscript ? <Badge variant="default">Yes</Badge> : <Badge variant="secondary">No</Badge>}</td>
                    <td className="p-3 text-center"><Badge variant={a.status === "published" ? "default" : "secondary"}>{a.status}</Badge></td>
                    <td className="p-3 text-center">{a.completions}</td>
                    <td className="p-3 text-right"><div className="flex justify-end gap-1"><Button variant="ghost" size="icon" className="h-8 w-8"><Play className="h-4 w-4" /></Button><Button variant="ghost" size="icon" className="h-8 w-8"><Edit className="h-4 w-4" /></Button><Button variant="ghost" size="icon" className="h-8 w-8 text-destructive"><Trash2 className="h-4 w-4" /></Button></div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="questions" className="mt-4">
          <Card><CardContent className="p-8 text-center text-muted-foreground"><Headphones className="h-12 w-12 mx-auto mb-3 opacity-50" /><p className="font-medium">Select an audio clip to manage its questions</p><p className="text-sm mt-1">Go to the Audio Library tab and click Edit on a clip to manage its comprehension questions.</p></CardContent></Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4 mt-4">
          <Card><CardHeader><CardTitle className="text-base">Listening Lab Settings</CardTitle></CardHeader><CardContent className="space-y-4">
            <div className="flex items-center justify-between"><div><Label>Allow Replay</Label><p className="text-xs text-muted-foreground">Let learners replay audio during exercises</p></div><Switch defaultChecked /></div>
            <div className="flex items-center justify-between"><div><Label>Show Transcript After</Label><p className="text-xs text-muted-foreground">Display transcript after exercise completion</p></div><Switch defaultChecked /></div>
            <div className="flex items-center justify-between"><div><Label>Speed Control</Label><p className="text-xs text-muted-foreground">Allow playback speed adjustment (0.5x–2x)</p></div><Switch defaultChecked /></div>
            <div><Label>Max Replays</Label><Input type="number" defaultValue={3} className="mt-1 w-32" /></div>
            <div><Label>Minimum Pass Score (%)</Label><Input type="number" defaultValue={60} className="mt-1 w-32" /></div>
          </CardContent></Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
