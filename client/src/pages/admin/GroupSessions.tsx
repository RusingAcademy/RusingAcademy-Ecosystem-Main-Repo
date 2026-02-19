import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Users, Plus, Trash2, Calendar, DollarSign } from "lucide-react";

export default function GroupSessions() {
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [maxParticipants, setMaxParticipants] = useState(10);
  const [price, setPrice] = useState(2500);
  const [groupType, setGroupType] = useState<"workshop" | "study_group" | "mock_exam" | "conversation_circle">("workshop");

  const { data: sessions, refetch } = trpc.groupSessions.listAll.useQuery();
  const createMutation = trpc.groupSessions.create.useMutation({
    onSuccess: () => { toast.success("Group session created"); refetch(); setShowForm(false); setTitle(""); },
    onError: (e: any) => toast.error(e.message),
  });
  const deleteMutation = trpc.groupSessions.delete.useMutation({
    onSuccess: () => { toast.success("Group session deleted"); refetch(); },
    onError: (e: any) => toast.error(e.message),
  });

  const typeLabels: Record<string, string> = {
    workshop: "Workshop",
    study_group: "Study Group",
    mock_exam: "Mock Exam",
    conversation_circle: "Conversation Circle",
  };

  const typeColors: Record<string, string> = {
    workshop: "bg-blue-500/20 text-blue-400",
    study_group: "bg-green-500/20 text-green-400",
    mock_exam: "bg-orange-500/20 text-orange-400",
    conversation_circle: "bg-purple-500/20 text-purple-400",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Users className="h-6 w-6 text-teal-400" /> Group Sessions
          </h2>
          <p className="text-slate-400 mt-1">Manage group coaching sessions, workshops, and study groups</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="bg-teal-600 hover:bg-teal-700">
          <Plus className="h-4 w-4 mr-2" /> New Group Session
        </Button>
      </div>

      {showForm && (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader><CardTitle className="text-white">Create Group Session</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <Input placeholder="Session title" value={title} onChange={(e) => setTitle(e.target.value)} className="bg-slate-900 border-slate-600 text-white" />
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-sm text-slate-400">Max Participants</label>
                <Input type="number" value={maxParticipants} onChange={(e) => setMaxParticipants(Number(e.target.value))} className="bg-slate-900 border-slate-600 text-white" />
              </div>
              <div>
                <label className="text-sm text-slate-400">Price (CAD cents)</label>
                <Input type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} className="bg-slate-900 border-slate-600 text-white" />
              </div>
              <div>
                <label className="text-sm text-slate-400">Type</label>
                <select value={groupType} onChange={(e) => setGroupType(e.target.value as any)} className="w-full h-10 rounded-md bg-slate-900 border border-slate-600 text-white px-3">
                  <option value="workshop">Workshop</option>
                  <option value="study_group">Study Group</option>
                  <option value="mock_exam">Mock Exam</option>
                  <option value="conversation_circle">Conversation Circle</option>
                </select>
              </div>
            </div>
            <Button onClick={() => createMutation.mutate({ sessionId: 1, title, maxParticipants, pricePerParticipant: price, groupType })} disabled={!title || createMutation.isPending} className="bg-teal-600 hover:bg-teal-700">
              {createMutation.isPending ? "Creating..." : "Create Session"}
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {sessions?.map((session: any) => (
          <Card key={session.id} className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-teal-500/20">
                    <Users className="h-5 w-5 text-teal-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{session.title}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className={typeColors[session.groupType] || "bg-slate-500/20 text-slate-400"}>
                        {typeLabels[session.groupType] || session.groupType}
                      </Badge>
                      <span className="text-sm text-slate-400 flex items-center gap-1">
                        <Users className="h-3 w-3" /> {session.currentParticipants}/{session.maxParticipants}
                      </span>
                      <span className="text-sm text-slate-400 flex items-center gap-1">
                        <DollarSign className="h-3 w-3" /> ${(session.pricePerParticipant / 100).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => deleteMutation.mutate({ id: session.id })} className="text-red-400 hover:text-red-300">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {(!sessions || sessions.length === 0) && (
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-8 text-center text-slate-400">
              No group sessions yet. Create your first one above.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
