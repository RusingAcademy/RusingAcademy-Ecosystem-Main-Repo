import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { ClipboardCheck, Plus, Users, BarChart3, FileText, Award, Brain, TrendingUp, Edit, Trash2 } from "lucide-react";
import { EmptyState } from "@/components/EmptyState";

export default function AssessmentsAdmin() {
  const [activeTab, setActiveTab] = useState("assessments");
  const [createOpen, setCreateOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("quiz");

  const { data, isLoading, refetch } = trpc.kajabiAssessments.list.useQuery();
  const { data: stats } = trpc.kajabiAssessments.getStats.useQuery();
  const assessments = data?.items ?? [];

  const createMut = trpc.kajabiAssessments.create.useMutation({
    onSuccess: () => { toast.success("Assessment created"); setCreateOpen(false); setTitle(""); setDescription(""); refetch(); },
    onError: (e) => toast.error(e.message),
  });
  const deleteMut = trpc.kajabiAssessments.delete.useMutation({
    onSuccess: () => { toast.success("Assessment deleted"); refetch(); },
    onError: (e) => toast.error(e.message),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold">Assessments</h1><p className="text-sm text-muted-foreground">Create and manage assessments to evaluate contact readiness, knowledge, and progress.</p></div>
        <Button size="sm" className="gap-1.5" onClick={() => setCreateOpen(true)}><Plus className="h-4 w-4" /> New Assessment</Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card><CardContent className="p-4 flex items-center gap-3"><ClipboardCheck className="h-5 w-5 text-indigo-600" /><div><p className="text-xl font-bold">{stats?.total ?? 0}</p><p className="text-xs text-muted-foreground">Assessments</p></div></CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-3"><Users className="h-5 w-5 text-blue-600" /><div><p className="text-xl font-bold">{stats?.totalAttempts ?? 0}</p><p className="text-xs text-muted-foreground">Completions</p></div></CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-3"><BarChart3 className="h-5 w-5 text-green-600" /><div><p className="text-xl font-bold">{stats?.avgScore ?? 0}%</p><p className="text-xs text-muted-foreground">Avg Score</p></div></CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-3"><Award className="h-5 w-5 text-amber-600" /><div><p className="text-xl font-bold">{stats?.passRate ?? 0}%</p><p className="text-xs text-muted-foreground">Pass Rate</p></div></CardContent></Card>
      </div>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList><TabsTrigger value="assessments">Assessments</TabsTrigger><TabsTrigger value="results">Results</TabsTrigger><TabsTrigger value="templates">Templates</TabsTrigger></TabsList>
        <TabsContent value="assessments" className="mt-4">
          {isLoading ? <div className="space-y-3">{[1,2,3].map(i => <Skeleton key={i} className="h-20 w-full" />)}</div> : assessments.length === 0 ? (
            <EmptyState icon={ClipboardCheck} title="No assessments yet" description="Create assessments to evaluate your contacts' language proficiency, course readiness, or knowledge level." actionLabel="Create Assessment" onAction={() => setCreateOpen(true)} />
          ) : (
            <div className="space-y-3">{assessments.map((a: any) => (
              <Card key={a.id} className="hover:shadow-sm transition-shadow">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center"><ClipboardCheck className="h-5 w-5 text-indigo-600" /></div>
                    <div>
                      <p className="font-medium">{a.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-[10px]">{a.type}</Badge>
                        <Badge variant={a.status === "active" ? "default" : "secondary"} className="text-[10px]">{a.status}</Badge>
                        <span className="text-xs text-muted-foreground">{a.questionCount || 0} questions • {a.attemptCount || 0} attempts</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toast("Assessment editor coming soon")}><Edit className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500" onClick={() => { if (confirm("Delete?")) deleteMut.mutate({ id: a.id }); }}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </CardContent>
              </Card>
            ))}</div>
          )}
        </TabsContent>
        <TabsContent value="results" className="mt-4">
          <EmptyState icon={BarChart3} title="No results yet" description="Assessment results will appear here once contacts complete them." />
        </TabsContent>
        <TabsContent value="templates" className="mt-4">
          <Card><CardContent className="p-6"><h3 className="font-medium mb-3">Assessment Templates</h3><div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[{ name: "SLE Readiness Check", desc: "Evaluate readiness for SLE exams", icon: Brain },{ name: "Language Proficiency", desc: "Assess current language level", icon: FileText },{ name: "Course Placement", desc: "Determine appropriate course level", icon: TrendingUp }].map(tpl => (
              <button key={tpl.name} className="p-4 border rounded-lg text-left hover:bg-accent transition-colors" onClick={() => { setTitle(tpl.name); setType("placement"); setCreateOpen(true); }}>
                <tpl.icon className="h-6 w-6 text-muted-foreground mb-2" /><p className="font-medium text-sm">{tpl.name}</p><p className="text-xs text-muted-foreground mt-1">{tpl.desc}</p>
              </button>
            ))}
          </div></CardContent></Card>
        </TabsContent>
      </Tabs>
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Create Assessment</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>Title</Label><Input value={title} onChange={e => setTitle(e.target.value)} placeholder="SLE Practice Test" /></div>
            <div><Label>Type</Label><Select value={type} onValueChange={setType}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="quiz">Quiz</SelectItem><SelectItem value="exam">Exam</SelectItem><SelectItem value="placement">Placement Test</SelectItem><SelectItem value="practice">Practice Test</SelectItem></SelectContent></Select></div>
            <div><Label>Description</Label><Textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Describe this assessment..." /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button onClick={() => createMut.mutate({ title, type: type as any, description })} disabled={!title || createMut.isPending}>{createMut.isPending ? "Creating..." : "Create Assessment"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
