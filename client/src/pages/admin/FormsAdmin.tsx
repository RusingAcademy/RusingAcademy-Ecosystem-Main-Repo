import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { ClipboardCheck, Plus, FileText, Users, BarChart3, Edit, Eye, Trash2 } from "lucide-react";
import { EmptyState } from "@/components/EmptyState";

export default function FormsAdmin() {
  const [createOpen, setCreateOpen] = useState(false);
  const [name, setName] = useState("");
  const [type, setType] = useState("contact");

  const { data, isLoading, refetch } = trpc.kajabiForms.list.useQuery();
  const { data: stats } = trpc.kajabiForms.getStats.useQuery();
  const forms = data?.items ?? [];

  const createMut = trpc.kajabiForms.create.useMutation({
    onSuccess: () => { toast.success("Form created"); setCreateOpen(false); setName(""); refetch(); },
    onError: (e) => toast.error(e.message),
  });
  const deleteMut = trpc.kajabiForms.delete.useMutation({
    onSuccess: () => { toast.success("Form deleted"); refetch(); },
    onError: (e) => toast.error(e.message),
  });

  const formTemplates = [
    { name: "Contact Form", type: "contact", fields: 4, desc: "Name, email, subject, message" },
    { name: "Lead Capture", type: "lead-capture", fields: 3, desc: "Name, email, interest" },
    { name: "Event Registration", type: "registration", fields: 5, desc: "Name, email, phone, event" },
    { name: "Feedback Survey", type: "survey", fields: 6, desc: "Rating, experience, suggestions" },
    { name: "Application Form", type: "feedback", fields: 8, desc: "Full application with uploads" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold">Forms</h1><p className="text-sm text-muted-foreground">Create and manage forms to capture leads, registrations, and feedback.</p></div>
        <Button size="sm" className="gap-1.5" onClick={() => setCreateOpen(true)}><Plus className="h-4 w-4" /> New Form</Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card><CardContent className="p-4 flex items-center gap-3"><ClipboardCheck className="h-5 w-5 text-orange-600" /><div><p className="text-xl font-bold">{stats?.total ?? 0}</p><p className="text-xs text-muted-foreground">Active Forms</p></div></CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-3"><Users className="h-5 w-5 text-blue-600" /><div><p className="text-xl font-bold">{stats?.totalSubmissions ?? 0}</p><p className="text-xs text-muted-foreground">Total Submissions</p></div></CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-3"><BarChart3 className="h-5 w-5 text-green-600" /><div><p className="text-xl font-bold">{stats?.conversionRate ?? 0}%</p><p className="text-xs text-muted-foreground">Conversion Rate</p></div></CardContent></Card>
      </div>
      <Card><CardContent className="p-4"><h3 className="font-medium mb-3">Quick Start Templates</h3><div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {formTemplates.map(tpl => (
          <button key={tpl.type} className="p-3 border rounded-lg text-left hover:bg-accent transition-colors" onClick={() => { setName(tpl.name); setType(tpl.type); setCreateOpen(true); }}>
            <FileText className="h-5 w-5 text-muted-foreground mb-2" /><p className="text-sm font-medium">{tpl.name}</p><p className="text-[10px] text-muted-foreground">{tpl.fields} fields</p>
          </button>
        ))}
      </div></CardContent></Card>
      {isLoading ? <div className="space-y-3">{[1,2,3].map(i => <Skeleton key={i} className="h-20 w-full" />)}</div> : forms.length === 0 ? (
        <EmptyState icon={ClipboardCheck} title="No forms created yet" description="Create forms to capture leads, collect feedback, and manage event registrations." actionLabel="Create Form" onAction={() => setCreateOpen(true)} />
      ) : (
        <div className="space-y-3">{forms.map((form: any) => (
          <Card key={form.id} className="hover:shadow-sm transition-shadow">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center"><ClipboardCheck className="h-5 w-5 text-orange-600" /></div>
                <div>
                  <p className="font-medium">{form.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-[10px]">{form.type}</Badge>
                    <Badge variant={form.status === "active" ? "default" : "secondary"} className="text-[10px]">{form.status}</Badge>
                    <span className="text-xs text-muted-foreground">{form.submissionCount || 0} submissions</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toast("Form builder coming soon")}><Edit className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toast("Submissions view coming soon")}><Eye className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500" onClick={() => { if (confirm("Delete?")) deleteMut.mutate({ id: form.id }); }}><Trash2 className="h-4 w-4" /></Button>
              </div>
            </CardContent>
          </Card>
        ))}</div>
      )}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Create New Form</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>Form Name</Label><Input value={name} onChange={e => setName(e.target.value)} placeholder="e.g., Contact Form" /></div>
            <div><Label>Form Type</Label><Select value={type} onValueChange={setType}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="contact">Contact Form</SelectItem><SelectItem value="lead-capture">Lead Capture</SelectItem><SelectItem value="registration">Event Registration</SelectItem><SelectItem value="survey">Feedback Survey</SelectItem><SelectItem value="feedback">Application</SelectItem></SelectContent></Select></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button onClick={() => createMut.mutate({ name, type: type as any })} disabled={!name || createMut.isPending}>{createMut.isPending ? "Creating..." : "Create Form"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
