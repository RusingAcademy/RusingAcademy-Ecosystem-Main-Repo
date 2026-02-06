import { trpc } from "@/lib/trpc";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { CheckCircle, XCircle, Clock } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function CoachesManagement() {
  const { data: applications, isLoading, refetch } = trpc.admin.getCoachApplications.useQuery();
  const approve = trpc.admin.approveCoachApplication.useMutation({
    onSuccess: () => { toast("Coach approved"); refetch(); },
  });
  const reject = trpc.admin.rejectCoachApplication.useMutation({
    onSuccess: () => { toast("Coach rejected"); refetch(); },
  });

  const allApps = (applications ?? []) as any[];
  const pending = allApps.filter((a: any) => a.status === "submitted" || a.status === "pending");
  const approved = allApps.filter((a: any) => a.status === "approved");
  const rejected = allApps.filter((a: any) => a.status === "rejected");

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Coaching Management</h1>
        <p className="text-sm text-muted-foreground">Review applications, manage coach profiles, and control access.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card><CardContent className="p-4 flex items-center gap-3"><Clock className="h-5 w-5 text-amber-500" /><div><p className="text-xl font-bold">{pending.length}</p><p className="text-xs text-muted-foreground">Pending</p></div></CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-3"><CheckCircle className="h-5 w-5 text-green-500" /><div><p className="text-xl font-bold">{approved.length}</p><p className="text-xs text-muted-foreground">Approved</p></div></CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-3"><XCircle className="h-5 w-5 text-red-500" /><div><p className="text-xl font-bold">{rejected.length}</p><p className="text-xs text-muted-foreground">Rejected</p></div></CardContent></Card>
      </div>
      <Tabs defaultValue="pending">
        <TabsList><TabsTrigger value="pending">Pending ({pending.length})</TabsTrigger><TabsTrigger value="approved">Approved ({approved.length})</TabsTrigger><TabsTrigger value="rejected">Rejected ({rejected.length})</TabsTrigger></TabsList>
        <TabsContent value="pending"><Card><CardContent className="p-0">
          {isLoading ? <div className="p-6 space-y-3">{[1,2,3].map(i => <Skeleton key={i} className="h-16 w-full" />)}</div> : pending.length === 0 ? <p className="p-8 text-center text-muted-foreground">No pending applications</p> : (
            <div className="divide-y">{pending.map((app: any) => (
              <div key={app.id} className="p-4 flex items-center justify-between">
                <div><p className="font-medium">{app.applicantName || "Applicant"}</p><p className="text-sm text-muted-foreground">{app.applicantEmail || app.email}</p></div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => approve.mutate({ applicationId: app.id })}><CheckCircle className="h-4 w-4 mr-1" /> Approve</Button>
                  <Button size="sm" variant="destructive" onClick={() => reject.mutate({ applicationId: app.id, reason: "Not qualified" })}><XCircle className="h-4 w-4 mr-1" /> Reject</Button>
                </div>
              </div>
            ))}</div>
          )}
        </CardContent></Card></TabsContent>
        <TabsContent value="approved"><Card><CardContent className="p-0">
          {approved.length === 0 ? <p className="p-8 text-center text-muted-foreground">No approved coaches</p> : (
            <div className="divide-y">{approved.map((a: any) => (
              <div key={a.id} className="p-4 flex items-center justify-between">
                <div><p className="font-medium">{a.applicantName || "Coach"}</p><p className="text-sm text-muted-foreground">{a.applicantEmail}</p></div>
                <Badge variant="default">Approved</Badge>
              </div>
            ))}</div>
          )}
        </CardContent></Card></TabsContent>
        <TabsContent value="rejected"><Card><CardContent className="p-0">
          {rejected.length === 0 ? <p className="p-8 text-center text-muted-foreground">No rejected applications</p> : (
            <div className="divide-y">{rejected.map((a: any) => (
              <div key={a.id} className="p-4 flex items-center justify-between">
                <div><p className="font-medium">{a.applicantName || "Applicant"}</p><p className="text-sm text-muted-foreground">{a.applicantEmail}</p></div>
                <Badge variant="destructive">Rejected</Badge>
              </div>
            ))}</div>
          )}
        </CardContent></Card></TabsContent>
      </Tabs>
    </div>
  );
}
