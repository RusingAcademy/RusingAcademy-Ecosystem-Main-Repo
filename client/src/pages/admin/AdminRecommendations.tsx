import { useState } from "react";
import { Wand2, Brain, Target, BarChart3, Plus, Edit, Settings, Sparkles, TrendingUp, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { trpc } from '@/lib/trpc';

import { useLanguage } from "@/contexts/LanguageContext";

const labels = {
  en: { title: "Recommendations Engine", description: "Manage and configure recommendations engine" },
  fr: { title: "Moteur de recommandations", description: "Gérer et configurer moteur de recommandations" },
};

const mockStats = { totalGenerated: 1245, clickThrough: 34, conversionRate: 18, activeUsers: 156 };
const mockRules = [
  { id: 1, name: "Skill Gap Analysis", type: "ai", description: "Recommend exercises based on weak skill areas", status: "active", impact: "high" },
  { id: 2, name: "Popular Content", type: "popularity", description: "Suggest most-completed exercises by level", status: "active", impact: "medium" },
  { id: 3, name: "Coach Suggested", type: "manual", description: "Coach-curated recommendations per learner", status: "active", impact: "high" },
  { id: 4, name: "Spaced Repetition Due", type: "algorithm", description: "Surface flashcards and vocabulary due for review", status: "active", impact: "high" },
  { id: 5, name: "Path Completion", type: "progression", description: "Recommend next lesson in current learning path", status: "active", impact: "medium" },
];
const mockMapping = [
  { skill: "Reading Comprehension", courses: 12, exercises: 48, coverage: 92 },
  { skill: "Listening Comprehension", courses: 8, exercises: 36, coverage: 78 },
  { skill: "Grammar & Syntax", courses: 15, exercises: 125, coverage: 95 },
  { skill: "Vocabulary", courses: 10, exercises: 340, coverage: 88 },
  { skill: "Writing", courses: 6, exercises: 24, coverage: 65 },
  { skill: "Oral Communication", courses: 4, exercises: 18, coverage: 52 },
];

export default function AdminRecommendations() {
  const { language } = useLanguage();
  const l = labels[language as keyof typeof labels] || labels.en;

  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2"><Wand2 className="h-6 w-6" /> Smart Recommendations</h1>
          <p className="text-sm text-muted-foreground mt-1">Configure the AI recommendation engine, rules, and content mapping</p>
        </div>
        <Button onClick={() => toast.info("Opening rule configuration...")}><Plus className="h-4 w-4 mr-1.5" /> Add Rule</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="p-2 rounded-lg bg-blue-500/10"><Sparkles className="h-5 w-5 text-blue-500" /></div><div><p className="text-xs text-muted-foreground">Recommendations</p><p className="text-xl font-bold">{mockStats.totalGenerated.toLocaleString()}</p></div></div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="p-2 rounded-lg bg-green-500/10"><Target className="h-5 w-5 text-green-500" /></div><div><p className="text-xs text-muted-foreground">Click-Through</p><p className="text-xl font-bold">{mockStats.clickThrough}%</p></div></div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="p-2 rounded-lg bg-amber-500/10"><TrendingUp className="h-5 w-5 text-amber-500" /></div><div><p className="text-xs text-muted-foreground">Conversion</p><p className="text-xl font-bold">{mockStats.conversionRate}%</p></div></div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="p-2 rounded-lg bg-purple-500/10"><Users className="h-5 w-5 text-purple-500" /></div><div><p className="text-xs text-muted-foreground">Active Users</p><p className="text-xl font-bold">{mockStats.activeUsers}</p></div></div></CardContent></Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList><TabsTrigger value="overview">Overview</TabsTrigger><TabsTrigger value="rules">Rules</TabsTrigger><TabsTrigger value="mapping">Content Mapping</TabsTrigger><TabsTrigger value="settings">Settings</TabsTrigger></TabsList>

        <TabsContent value="overview" className="space-y-4 mt-4">
          <Card><CardHeader><CardTitle className="text-base">Recommendation Effectiveness</CardTitle></CardHeader><CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-center">
              <div><p className="text-2xl font-bold text-green-500">+23%</p><p className="text-xs text-muted-foreground">Engagement Lift</p></div>
              <div><p className="text-2xl font-bold text-blue-500">+15%</p><p className="text-xs text-muted-foreground">Completion Rate</p></div>
              <div><p className="text-2xl font-bold text-purple-500">+8%</p><p className="text-xs text-muted-foreground">Retention Improvement</p></div>
            </div>
          </CardContent></Card>
        </TabsContent>

        <TabsContent value="rules" className="space-y-4 mt-4">
          <div className="space-y-3">
            {mockRules.map(r => (
              <Card key={r.id}><CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10"><Brain className="h-4 w-4 text-primary" /></div>
                    <div>
                      <div className="flex items-center gap-2"><span className="font-medium">{r.name}</span><Badge variant="outline">{r.type}</Badge><Badge className={r.impact === "high" ? "bg-green-500/10 text-green-500" : "bg-amber-500/10 text-amber-500"}>{r.impact}</Badge></div>
                      <p className="text-sm text-muted-foreground mt-0.5">{r.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2"><Switch defaultChecked={r.status === "active"} /><Button variant="ghost" size="icon" className="h-8 w-8"><Edit className="h-4 w-4" /></Button></div>
                </div>
              </CardContent></Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="mapping" className="space-y-4 mt-4">
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/50"><tr><th className="text-left p-3 font-medium">Skill Area</th><th className="text-center p-3 font-medium">Courses</th><th className="text-center p-3 font-medium">Exercises</th><th className="text-center p-3 font-medium">Coverage</th></tr></thead>
              <tbody>
                {mockMapping.map(m => (
                  <tr key={m.skill} className="border-t hover:bg-muted/30">
                    <td className="p-3 font-medium">{m.skill}</td>
                    <td className="p-3 text-center">{m.courses}</td>
                    <td className="p-3 text-center">{m.exercises}</td>
                    <td className="p-3 text-center"><div className="flex items-center justify-center gap-2"><div className="w-24 bg-muted rounded-full h-2"><div className="bg-primary rounded-full h-2" style={{ width: `${m.coverage}%` }} /></div><span className="text-muted-foreground">{m.coverage}%</span></div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4 mt-4">
          <Card><CardHeader><CardTitle className="text-base">Engine Settings</CardTitle></CardHeader><CardContent className="space-y-4">
            <div className="flex items-center justify-between"><div><Label>Enable AI Recommendations</Label><p className="text-xs text-muted-foreground">Use AI to generate personalized recommendations</p></div><Switch defaultChecked /></div>
            <div><Label>Refresh Frequency (hours)</Label><Input type="number" defaultValue={6} className="mt-1 w-32" /></div>
            <div><Label>Max Recommendations Per User</Label><Input type="number" defaultValue={5} className="mt-1 w-32" /></div>
            <div className="flex items-center justify-between"><div><Label>A/B Testing</Label><p className="text-xs text-muted-foreground">Split test recommendation algorithms</p></div><Switch /></div>
          </CardContent></Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
