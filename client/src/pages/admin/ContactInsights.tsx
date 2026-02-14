import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, Brain, PieChart } from "lucide-react";

export default function ContactInsights() {
  const { data: insights } = trpc.kajabiContactInsights.getInsights.useQuery({});

  const stats = insights ?? { signupTrend: 0, roleDistribution: {} as any, languageDistribution: {} as any, activeUsers: 0 };

  const roleSegments = Object.entries(stats.roleDistribution || {}).map(([label, count]) => ({
    label, count: count as number, color: label === "admin" ? "#3b82f6" : label === "user" ? "#22c55e" : "#a855f7",
  }));

  const langSegments = Object.entries(stats.languageDistribution || {}).map(([label, count]) => ({
    label: label === "en" ? "English" : label === "fr" ? "French" : label === "both" ? "Bilingual" : label,
    count: count as number,
    color: label === "en" ? "#3b82f6" : label === "fr" ? "#ef4444" : "#f59e0b",
  }));

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold">Contact Insights</h1><p className="text-sm text-muted-foreground">AI-powered insights about your contacts, engagement patterns, and growth opportunities.</p></div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-blue-500"><CardContent className="p-4"><p className="text-xs text-muted-foreground uppercase">Active Users</p><p className="text-2xl font-bold mt-1">{stats.activeUsers}</p><p className="text-xs text-muted-foreground">Last 30 days</p></CardContent></Card>
        <Card className="border-l-4 border-l-green-500"><CardContent className="p-4"><p className="text-xs text-muted-foreground uppercase">Signup Trend</p><p className="text-2xl font-bold mt-1">{stats.signupTrend > 0 ? "+" : ""}{stats.signupTrend}</p><p className="text-xs text-muted-foreground">This month vs last</p></CardContent></Card>
        <Card className="border-l-4 border-l-purple-500"><CardContent className="p-4"><p className="text-xs text-muted-foreground uppercase">Roles</p><p className="text-2xl font-bold mt-1">{roleSegments.length}</p><p className="text-xs text-muted-foreground">Distinct roles</p></CardContent></Card>
        <Card className="border-l-4 border-l-amber-500"><CardContent className="p-4"><p className="text-xs text-muted-foreground uppercase">Languages</p><p className="text-2xl font-bold mt-1">{langSegments.length}</p><p className="text-xs text-muted-foreground">Language preferences</p></CardContent></Card>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><Brain className="h-4 w-4" /> AI Recommendations</CardTitle></CardHeader>
          <CardContent><div className="space-y-3">
            {["Segment high-engagement contacts for premium upsell campaigns.", "Re-engage contacts who haven't logged in for 30+ days.", "Create targeted email sequences for leads in the 'qualified' stage.", "Set up automated birthday/anniversary messages for retention."].map((rec, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3 border rounded-lg"><Lightbulb className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" /><p className="text-sm">{rec}</p></div>
            ))}
          </div></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><PieChart className="h-4 w-4" /> Role Distribution</CardTitle></CardHeader>
          <CardContent><div className="space-y-3">
            {roleSegments.length > 0 ? roleSegments.map(seg => (
              <div key={seg.label} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3"><div className="w-3 h-3 rounded-full" style={{ backgroundColor: seg.color }}></div><span className="text-sm capitalize">{seg.label}</span></div>
                <Badge variant="outline">{seg.count}</Badge>
              </div>
            )) : <p className="text-sm text-muted-foreground">No role data available yet.</p>}
          </div></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><PieChart className="h-4 w-4" /> Language Distribution</CardTitle></CardHeader>
          <CardContent><div className="space-y-3">
            {langSegments.length > 0 ? langSegments.map(seg => (
              <div key={seg.label} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3"><div className="w-3 h-3 rounded-full" style={{ backgroundColor: seg.color }}></div><span className="text-sm">{seg.label}</span></div>
                <Badge variant="outline">{seg.count}</Badge>
              </div>
            )) : <p className="text-sm text-muted-foreground">No language data available yet.</p>}
          </div></CardContent>
        </Card>
      </div>
    </div>
  );
}
