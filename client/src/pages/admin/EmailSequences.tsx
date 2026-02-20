/**
 * Email Sequences Admin Page — Phase 8.2
 * Lists all email sequences with status, trigger, analytics, and CRUD actions.
 */
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { Plus, Mail, Play, Pause, Trash2, BarChart3, Users, Clock } from "lucide-react";

const TRIGGER_LABELS: Record<string, string> = {
  user_signup: "User Signup",
  course_purchase: "Course Purchase",
  cart_abandoned: "Cart Abandoned",
  course_completed: "Course Completed",
  session_booked: "Session Booked",
  membership_activated: "Membership Activated",
  manual: "Manual",
};

const STATUS_COLORS: Record<string, string> = {
  draft: "bg-gray-100 text-gray-800",
  active: "bg-green-100 text-green-800",
  paused: "bg-yellow-100 text-yellow-800",
  archived: "bg-red-100 text-red-800",
};

export default function EmailSequences() {

  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");
  const [newTrigger, setNewTrigger] = useState("user_signup");
  const [newDescription, setNewDescription] = useState("");

  const utils = trpc.useUtils();
  const { data: sequences = [], isLoading } = trpc.emailAutomation.list.useQuery();

  const createMutation = trpc.emailAutomation.create.useMutation({
    onSuccess: () => {
      toast.success("Sequence created");
      setShowCreate(false);
      setNewName("");
      setNewDescription("");
      utils.emailAutomation.list.invalidate();
    },
    onError: (err) => toast.error(err.message),
  });

  const updateMutation = trpc.emailAutomation.update.useMutation({
    onSuccess: () => {
      toast.success("Sequence updated");
      utils.emailAutomation.list.invalidate();
    },
  });

  const deleteMutation = trpc.emailAutomation.delete.useMutation({
    onSuccess: () => {
      toast.success("Sequence deleted");
      utils.emailAutomation.list.invalidate();
    },
  });

  const handleCreate = () => {
    if (!newName.trim()) return;
    createMutation.mutate({
      name: newName,
      trigger: newTrigger as any,
      description: newDescription || undefined,
      steps: [
        { id: "step-1", type: "email", subject: "Welcome!", body: "<p>Welcome to RusingAcademy!</p>" },
      ],
    });
  };

  const toggleStatus = (seq: any) => {
    const newStatus = seq.status === "active" ? "paused" : "active";
    updateMutation.mutate({ id: seq.id, status: newStatus });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Email Sequences</h2>
          <p className="text-muted-foreground">Automate email campaigns triggered by user actions</p>
        </div>
        <Dialog open={showCreate} onOpenChange={setShowCreate}>
          <DialogTrigger asChild>
            <Button onClick={() => toast.info("Opening form...")}><Plus className="h-4 w-4 mr-2" /> New Sequence</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Email Sequence</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Name</Label>
                <Input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Welcome Series" />
              </div>
              <div>
                <Label>Trigger</Label>
                <Select value={newTrigger} onValueChange={setNewTrigger}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(TRIGGER_LABELS).map(([key, label]) => (
                      <SelectItem key={key} value={key}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Description</Label>
                <Textarea value={newDescription} onChange={(e) => setNewDescription(e.target.value)} placeholder="Optional description..." />
              </div>
              <Button onClick={handleCreate} disabled={createMutation.isPending} className="w-full">
                {createMutation.isPending ? "Creating..." : "Create Sequence"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {sequences.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Mail className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold">No sequences yet</h3>
            <p className="text-muted-foreground">Create your first email automation sequence</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {(sequences as any[]).map((seq: any) => (
            <Card key={seq.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold">{seq.name}</h3>
                      <Badge className={STATUS_COLORS[seq.status] || ""}>{seq.status}</Badge>
                      <Badge variant="outline">{TRIGGER_LABELS[seq.trigger] || seq.trigger}</Badge>
                    </div>
                    {seq.description && <p className="text-sm text-muted-foreground">{seq.description}</p>}
                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Users className="h-4 w-4" /> {seq.enrollmentCount || 0} enrolled
                      </span>
                      <span className="flex items-center gap-1">
                        <BarChart3 className="h-4 w-4" /> {seq.completionCount || 0} completed
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {Array.isArray(seq.steps) ? seq.steps.length : (typeof seq.steps === "string" ? JSON.parse(seq.steps).length : 0)} steps
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleStatus(seq)}
                      disabled={seq.status === "archived"}
                    >
                      {seq.status === "active" ? (
                        <><Pause className="h-4 w-4 mr-1" /> Pause</>
                      ) : (
                        <><Play className="h-4 w-4 mr-1" /> Activate</>
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        if (confirm("Delete this sequence?")) {
                          deleteMutation.mutate({ id: seq.id });
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
