import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Zap, Plus, Trash2, Play, Pause, Activity } from "lucide-react";

import { useLanguage } from "@/contexts/LanguageContext";

const labels = {
  en: { title: "Automation Engine", description: "Manage and configure automation engine" },
  fr: { title: "Automation Engine", description: "Gérer et configurer automation engine" },
};

const TRIGGER_LABELS: Record<string, string> = {
  user_signup: "User Signup", course_enrolled: "Course Enrolled", course_completed: "Course Completed",
  lesson_completed: "Lesson Completed", session_booked: "Session Booked", session_completed: "Session Completed",
  payment_received: "Payment Received", membership_activated: "Membership Activated",
  membership_cancelled: "Membership Cancelled", tag_added: "Tag Added", inactivity: "Inactivity", scheduled: "Scheduled",
};
const ACTION_LABELS: Record<string, string> = {
  send_email: "Send Email", send_notification: "Send Notification", add_tag: "Add Tag", remove_tag: "Remove Tag",
  enroll_course: "Enroll in Course", assign_coach: "Assign Coach", update_field: "Update Field",
  webhook: "Webhook", delay: "Delay",
};

export default function AutomationEngine() {
  const { language } = useLanguage();
  const l = labels[language as keyof typeof labels] || labels.en;

  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [triggerType, setTriggerType] = useState("user_signup");
  const [actionType, setActionType] = useState("send_email");

  const { data: automations, refetch } = trpc.automationEngine.list.useQuery();
  const createMutation = trpc.automationEngine.create.useMutation({
    onSuccess: () => { toast.success("Automation created"); refetch(); setShowForm(false); setName(""); },
    onError: (e: any) => toast.error(e.message),
  });
  const toggleMutation = trpc.automationEngine.toggle.useMutation({
    onSuccess: () => { toast.success("Automation toggled"); refetch(); },
  });
  const deleteMutation = trpc.automationEngine.delete.useMutation({
    onSuccess: () => { toast.success("Automation deleted"); refetch(); },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Zap className="h-6 w-6 text-yellow-400" /> Automation Engine
          </h2>
          <p className="text-slate-400 mt-1">Create trigger-action automations for your platform</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="bg-yellow-600 hover:bg-yellow-700">
          <Plus className="h-4 w-4 mr-2" /> New Automation
        </Button>
      </div>

      {showForm && (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader><CardTitle className="text-white">Create Automation</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <Input placeholder="Automation name" value={name} onChange={(e) => setName(e.target.value)} className="bg-slate-900 border-slate-600 text-white" />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-slate-400">When (Trigger)</label>
                <select value={triggerType} onChange={(e) => setTriggerType(e.target.value)} className="w-full h-10 rounded-md bg-slate-900 border border-slate-600 text-white px-3">
                  {Object.entries(TRIGGER_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm text-slate-400">Then (Action)</label>
                <select value={actionType} onChange={(e) => setActionType(e.target.value)} className="w-full h-10 rounded-md bg-slate-900 border border-slate-600 text-white px-3">
                  {Object.entries(ACTION_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </div>
            </div>
            <Button onClick={() => createMutation.mutate({ name, triggerType: triggerType as any, actionType: actionType as any })} disabled={!name || createMutation.isPending} className="bg-yellow-600 hover:bg-yellow-700">
              {createMutation.isPending ? "Creating..." : "Create Automation"}
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {automations?.map((auto: any) => (
          <Card key={auto.id} className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${auto.isActive ? "bg-green-500/20" : "bg-slate-500/20"}`}>
                    <Zap className={`h-5 w-5 ${auto.isActive ? "text-green-400" : "text-slate-400"}`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{auto.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className="bg-blue-500/20 text-blue-400">{TRIGGER_LABELS[auto.triggerType] || auto.triggerType}</Badge>
                      <span className="text-slate-500">→</span>
                      <Badge className="bg-purple-500/20 text-purple-400">{ACTION_LABELS[auto.actionType] || auto.actionType}</Badge>
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        <Activity className="h-3 w-3" /> {auto.executionCount} runs
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={() => toggleMutation.mutate({ id: auto.id })} className={auto.isActive ? "text-green-400" : "text-slate-400"}>
                    {auto.isActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => deleteMutation.mutate({ id: auto.id })} className="text-red-400 hover:text-red-300">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {(!automations || automations.length === 0) && (
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-8 text-center text-slate-400">
              No automations yet. Create your first trigger-action automation above.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
