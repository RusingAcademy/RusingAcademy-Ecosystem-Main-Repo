import { useState } from "react";
import { UserCheck, ClipboardCheck, Award, BarChart3, Plus, Edit, Settings, Search, Eye, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

const mockStats = { totalReviews: 156, avgRating: 4.2, activeReviewers: 34, pendingAssignments: 12 };
const mockAssignments = [
  { id: 1, reviewer: "Marie D.", submission: "Argumentez pour ou contre le télétravail", author: "Jean P.", status: "completed", score: 78, date: "2026-02-12" },
  { id: 2, reviewer: "Sophie L.", submission: "Décrivez votre journée de travail", author: "Pierre M.", status: "pending", score: null, date: "2026-02-13" },
  { id: 3, reviewer: "Jean P.", submission: "Rédigez un rapport sur les changements", author: "Marie D.", status: "completed", score: 85, date: "2026-02-11" },
  { id: 4, reviewer: "Pierre M.", submission: "Écrivez un courriel à votre superviseur", author: "Sophie L.", status: "in_progress", score: null, date: "2026-02-13" },
];
const mockRubric = [
  { criterion: "Grammar & Syntax", weight: 35, description: "Accuracy of grammar, verb conjugation, and sentence structure" },
  { criterion: "Vocabulary & Expression", weight: 30, description: "Range and appropriateness of vocabulary used" },
  { criterion: "Coherence & Organization", weight: 35, description: "Logical flow, paragraph structure, and overall coherence" },
];

export default function AdminPeerReview() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2"><UserCheck className="h-6 w-6" /> Peer Review System</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage review assignments, rubrics, and reviewer rewards</p>
        </div>
        <Button onClick={() => toast.info("Auto-assign reviews — coming soon")}><Plus className="h-4 w-4 mr-1.5" /> Auto-Assign</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="p-2 rounded-lg bg-blue-500/10"><ClipboardCheck className="h-5 w-5 text-blue-500" /></div><div><p className="text-xs text-muted-foreground">Total Reviews</p><p className="text-xl font-bold">{mockStats.totalReviews}</p></div></div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="p-2 rounded-lg bg-amber-500/10"><Star className="h-5 w-5 text-amber-500" /></div><div><p className="text-xs text-muted-foreground">Avg Rating</p><p className="text-xl font-bold">{mockStats.avgRating}/5</p></div></div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="p-2 rounded-lg bg-green-500/10"><UserCheck className="h-5 w-5 text-green-500" /></div><div><p className="text-xs text-muted-foreground">Active Reviewers</p><p className="text-xl font-bold">{mockStats.activeReviewers}</p></div></div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="p-2 rounded-lg bg-purple-500/10"><Award className="h-5 w-5 text-purple-500" /></div><div><p className="text-xs text-muted-foreground">Pending</p><p className="text-xl font-bold">{mockStats.pendingAssignments}</p></div></div></CardContent></Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList><TabsTrigger value="overview">Overview</TabsTrigger><TabsTrigger value="assignments">Assignments</TabsTrigger><TabsTrigger value="rubric">Rubric</TabsTrigger><TabsTrigger value="settings">Settings</TabsTrigger></TabsList>

        <TabsContent value="overview" className="space-y-4 mt-4">
          <Card><CardHeader><CardTitle className="text-base">Review Activity (Last 30 Days)</CardTitle></CardHeader><CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div><p className="text-2xl font-bold">89</p><p className="text-xs text-muted-foreground">Reviews Completed</p></div>
              <div><p className="text-2xl font-bold">2.3 days</p><p className="text-xs text-muted-foreground">Avg Turnaround</p></div>
              <div><p className="text-2xl font-bold">2,225 XP</p><p className="text-xs text-muted-foreground">XP Awarded</p></div>
            </div>
          </CardContent></Card>
        </TabsContent>

        <TabsContent value="assignments" className="space-y-4 mt-4">
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/50"><tr><th className="text-left p-3 font-medium">Reviewer</th><th className="text-left p-3 font-medium">Submission</th><th className="text-left p-3 font-medium">Author</th><th className="text-center p-3 font-medium">Score</th><th className="text-center p-3 font-medium">Status</th><th className="text-center p-3 font-medium">Date</th><th className="text-right p-3 font-medium">Actions</th></tr></thead>
              <tbody>
                {mockAssignments.map(a => (
                  <tr key={a.id} className="border-t hover:bg-muted/30">
                    <td className="p-3 font-medium">{a.reviewer}</td>
                    <td className="p-3 max-w-xs truncate">{a.submission}</td>
                    <td className="p-3">{a.author}</td>
                    <td className="p-3 text-center font-medium">{a.score ?? "—"}</td>
                    <td className="p-3 text-center"><Badge variant={a.status === "completed" ? "default" : a.status === "pending" ? "secondary" : "outline"}>{a.status}</Badge></td>
                    <td className="p-3 text-center text-muted-foreground">{a.date}</td>
                    <td className="p-3 text-right"><Button variant="ghost" size="icon" className="h-8 w-8"><Eye className="h-4 w-4" /></Button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="rubric" className="space-y-4 mt-4">
          <Card><CardHeader><CardTitle className="text-base">Scoring Rubric</CardTitle></CardHeader><CardContent>
            <div className="space-y-4">
              {mockRubric.map(r => (
                <div key={r.criterion} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2"><span className="font-medium">{r.criterion}</span><Badge>{r.weight}%</Badge></div>
                  <p className="text-sm text-muted-foreground">{r.description}</p>
                </div>
              ))}
            </div>
          </CardContent></Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4 mt-4">
          <Card><CardHeader><CardTitle className="text-base">Peer Review Settings</CardTitle></CardHeader><CardContent className="space-y-4">
            <div className="flex items-center justify-between"><div><Label>Auto-Assign Reviews</Label><p className="text-xs text-muted-foreground">Automatically match reviewers to new submissions</p></div><Switch defaultChecked /></div>
            <div><Label>XP Per Review</Label><Input type="number" defaultValue={25} className="mt-1 w-32" /></div>
            <div><Label>Min Reviews Per Submission</Label><Input type="number" defaultValue={2} className="mt-1 w-32" /></div>
            <div><Label>Review Deadline (days)</Label><Input type="number" defaultValue={3} className="mt-1 w-32" /></div>
          </CardContent></Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
