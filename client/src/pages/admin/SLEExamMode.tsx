import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  GraduationCap, Clock, Target, BarChart3, Users,
  Play, Settings, FileText, Award, TrendingUp,
  AlertTriangle, CheckCircle, Brain, BookOpen,
  Plus, Edit, Trash2, Eye, Download,
} from "lucide-react";

export default function SLEExamMode() {
  const [activeTab, setActiveTab] = useState("overview");
  const [showCreateExam, setShowCreateExam] = useState(false);

  const { data: stats } = trpc.sleExam.getStats.useQuery();
  const { data: exams, refetch } = trpc.sleExam.listExams.useQuery();
  const { data: config } = trpc.sleExam.getConfig.useQuery();

  const createMutation = trpc.sleExam.createExam.useMutation({
    onSuccess: () => { toast.success("Exam simulation created"); setShowCreateExam(false); refetch(); },
    onError: (e) => toast.error(e.message),
  });

  const [newExam, setNewExam] = useState({
    title: "",
    type: "reading",
    level: "B",
    duration: 90,
    questionCount: 65,
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <GraduationCap className="h-6 w-6" /> SLE Exam Mode
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Official Second Language Evaluation simulation with scoring and analytics</p>
        </div>
        <Button onClick={() => setShowCreateExam(true)}>
          <Plus className="h-4 w-4 mr-1.5" /> Create Exam
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10"><FileText className="h-5 w-5 text-blue-500" /></div>
              <div>
                <p className="text-xs text-muted-foreground">Total Exams</p>
                <p className="text-xl font-bold">{stats?.totalExams ?? 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/10"><Users className="h-5 w-5 text-green-500" /></div>
              <div>
                <p className="text-xs text-muted-foreground">Attempts</p>
                <p className="text-xl font-bold">{stats?.totalAttempts ?? 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-500/10"><Target className="h-5 w-5 text-purple-500" /></div>
              <div>
                <p className="text-xs text-muted-foreground">Avg Score</p>
                <p className="text-xl font-bold">{stats?.avgScore ?? 0}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-500/10"><Award className="h-5 w-5 text-amber-500" /></div>
              <div>
                <p className="text-xs text-muted-foreground">Pass Rate</p>
                <p className="text-xl font-bold">{stats?.passRate ?? 0}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-cyan-500/10"><TrendingUp className="h-5 w-5 text-cyan-500" /></div>
              <div>
                <p className="text-xs text-muted-foreground">Improvement</p>
                <p className="text-xl font-bold">+{stats?.avgImprovement ?? 0}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Exam Library</TabsTrigger>
          <TabsTrigger value="results">Results & Analytics</TabsTrigger>
          <TabsTrigger value="config">Exam Configuration</TabsTrigger>
          <TabsTrigger value="questions">Question Bank</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Create Exam */}
          {showCreateExam && (
            <Card className="border-primary/30">
              <CardHeader><CardTitle className="text-lg">Create SLE Exam Simulation</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Exam Title</Label>
                    <Input value={newExam.title} onChange={(e) => setNewExam(p => ({ ...p, title: e.target.value }))} placeholder="e.g., SLE Reading Practice - Level B" />
                  </div>
                  <div className="space-y-2">
                    <Label>Exam Type</Label>
                    <Select value={newExam.type} onValueChange={(v) => setNewExam(p => ({ ...p, type: v }))}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="reading">Reading Comprehension</SelectItem>
                        <SelectItem value="writing">Written Expression</SelectItem>
                        <SelectItem value="oral">Oral Interaction</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Target Level</Label>
                    <Select value={newExam.level} onValueChange={(v) => setNewExam(p => ({ ...p, level: v }))}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="A">Level A (Basic)</SelectItem>
                        <SelectItem value="B">Level B (Intermediate)</SelectItem>
                        <SelectItem value="C">Level C (Advanced)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Duration (minutes)</Label>
                    <Input type="number" value={newExam.duration} onChange={(e) => setNewExam(p => ({ ...p, duration: parseInt(e.target.value) || 90 }))} />
                  </div>
                </div>
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={() => setShowCreateExam(false)}>Cancel</Button>
                  <Button onClick={() => createMutation.mutate(newExam)} disabled={!newExam.title || createMutation.isPending}>
                    <Plus className="h-4 w-4 mr-1.5" /> Create Exam
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Exam List */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Exam Library</CardTitle>
                <Badge variant="outline">{(exams as any[])?.length ?? 0} exams</Badge>
              </div>
            </CardHeader>
            <CardContent>
              {!exams || (exams as any[]).length === 0 ? (
                <div className="text-center py-12">
                  <GraduationCap className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
                  <p className="font-medium">No exam simulations yet</p>
                  <p className="text-sm text-muted-foreground mt-1">Create your first SLE exam simulation</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {(exams as any[]).map((exam: any) => (
                    <div key={exam.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${exam.type === "reading" ? "bg-blue-500/10" : exam.type === "writing" ? "bg-green-500/10" : "bg-purple-500/10"}`}>
                          {exam.type === "reading" ? <BookOpen className="h-5 w-5 text-blue-500" /> : exam.type === "writing" ? <FileText className="h-5 w-5 text-green-500" /> : <Brain className="h-5 w-5 text-purple-500" />}
                        </div>
                        <div>
                          <p className="font-medium">{exam.title}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Badge variant="outline" className="text-[10px] h-5">Level {exam.level}</Badge>
                            <Clock className="h-3 w-3" /> {exam.duration}min
                            <span>•</span>
                            {exam.questionCount} questions
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={exam.status === "published" ? "default" : "secondary"}>{exam.status}</Badge>
                        <Button size="sm" variant="ghost"><Eye className="h-4 w-4" /></Button>
                        <Button size="sm" variant="ghost"><Edit className="h-4 w-4" /></Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* SLE Level Guide */}
          <Card>
            <CardHeader><CardTitle className="text-lg">SLE Level Requirements</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { level: "A", label: "Basic", desc: "Basic proficiency. Can understand simple texts and participate in routine conversations.", color: "border-blue-500/30 bg-blue-500/5", passScore: "50%" },
                  { level: "B", label: "Intermediate", desc: "Functional proficiency. Can handle most work situations and understand complex texts.", color: "border-purple-500/30 bg-purple-500/5", passScore: "60%" },
                  { level: "C", label: "Advanced", desc: "Advanced proficiency. Can communicate fluently and understand nuanced language.", color: "border-amber-500/30 bg-amber-500/5", passScore: "70%" },
                ].map((l) => (
                  <Card key={l.level} className={l.color}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="text-lg font-bold">{l.level}</Badge>
                        <span className="font-medium">{l.label}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{l.desc}</p>
                      <p className="text-xs font-medium mt-2">Pass score: {l.passScore}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="results" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Exam Results</CardTitle>
                <Button size="sm" variant="outline" onClick={() => toast.success("Export started")}>
                  <Download className="h-4 w-4 mr-1.5" /> Export Results
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {!stats?.recentResults || (stats.recentResults as any[]).length === 0 ? (
                <div className="text-center py-12">
                  <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
                  <p className="font-medium">No exam results yet</p>
                  <p className="text-sm text-muted-foreground mt-1">Results will appear after students complete exams</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {(stats.recentResults as any[]).map((r: any, i: number) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                          {r.studentName?.charAt(0) ?? "?"}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{r.studentName}</p>
                          <p className="text-xs text-muted-foreground">{r.examTitle} • Level {r.level}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className={`text-sm font-bold ${r.passed ? "text-green-500" : "text-red-500"}`}>{r.score}%</p>
                          <p className="text-xs text-muted-foreground">{r.duration}min</p>
                        </div>
                        <Badge variant={r.passed ? "default" : "destructive"}>
                          {r.passed ? "Passed" : "Failed"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Score Distribution */}
          <Card>
            <CardHeader><CardTitle className="text-lg">Score Distribution</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { range: "90-100%", count: stats?.scoreDistribution?.["90-100"] ?? 0, color: "bg-green-500" },
                  { range: "70-89%", count: stats?.scoreDistribution?.["70-89"] ?? 0, color: "bg-blue-500" },
                  { range: "50-69%", count: stats?.scoreDistribution?.["50-69"] ?? 0, color: "bg-amber-500" },
                  { range: "0-49%", count: stats?.scoreDistribution?.["0-49"] ?? 0, color: "bg-red-500" },
                ].map((d) => {
                  const total = (stats?.totalAttempts ?? 1) || 1;
                  const pct = Math.round((d.count / total) * 100);
                  return (
                    <div key={d.range} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>{d.range}</span>
                        <span className="font-medium">{d.count} ({pct}%)</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${d.color}`} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="config" className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-lg flex items-center gap-2"><Settings className="h-5 w-5" /> Exam Configuration</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: "Timed Mode", desc: "Enforce time limits during exam simulations", key: "timedMode" },
                { label: "Randomize Questions", desc: "Shuffle question order for each attempt", key: "randomize" },
                { label: "Show Correct Answers", desc: "Display correct answers after submission", key: "showAnswers" },
                { label: "Allow Retakes", desc: "Allow students to retake exams", key: "allowRetakes" },
                { label: "Proctoring Mode", desc: "Enable browser lockdown during exams", key: "proctoring" },
                { label: "AI Feedback", desc: "Generate AI-powered feedback on written/oral responses", key: "aiFeedback" },
              ].map((setting) => (
                <div key={setting.key} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div>
                    <p className="text-sm font-medium">{setting.label}</p>
                    <p className="text-xs text-muted-foreground">{setting.desc}</p>
                  </div>
                  <Switch defaultChecked={setting.key !== "proctoring"} onCheckedChange={() => toast.success(`${setting.label} updated`)} />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="questions" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Question Bank</CardTitle>
                <Button size="sm" onClick={() => toast.info("Question editor coming soon — create reading, writing, and oral questions with AI-assisted generation")}>
                  <Plus className="h-4 w-4 mr-1.5" /> Add Questions
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { type: "Reading", icon: BookOpen, count: stats?.questionCounts?.reading ?? 0, color: "bg-blue-500/10 text-blue-500" },
                  { type: "Writing", icon: FileText, count: stats?.questionCounts?.writing ?? 0, color: "bg-green-500/10 text-green-500" },
                  { type: "Oral", icon: Brain, count: stats?.questionCounts?.oral ?? 0, color: "bg-purple-500/10 text-purple-500" },
                ].map((q) => (
                  <Card key={q.type}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${q.color}`}><q.icon className="h-5 w-5" /></div>
                        <div>
                          <p className="text-sm font-medium">{q.type} Questions</p>
                          <p className="text-2xl font-bold">{q.count}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <div className="mt-4 p-4 bg-muted/30 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">AI Question Generation</p>
                    <p className="text-xs text-muted-foreground">Use the AI Companion to auto-generate SLE-aligned questions based on official exam formats. Questions are reviewed before publishing.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
