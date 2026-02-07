import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { CheckCircle, XCircle, Clock, UserPlus, GraduationCap } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { EmptyState } from "@/components/EmptyState";

export default function CoachesManagement() {
  const { data: applications, isLoading, refetch } = trpc.admin.getCoachApplications.useQuery();

  // Confirmation state
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<{
    type: "approve" | "reject";
    applicationId: number;
    name: string;
  } | null>(null);

  const approve = trpc.admin.approveCoachApplication.useMutation({
    onSuccess: () => {
      toast.success(`${pendingAction?.name} approved as coach`);
      setConfirmOpen(false);
      setPendingAction(null);
      refetch();
    },
    onError: (e: any) => toast.error(e.message),
  });
  const reject = trpc.admin.rejectCoachApplication.useMutation({
    onSuccess: () => {
      toast.success(`${pendingAction?.name}'s application rejected`);
      setConfirmOpen(false);
      setPendingAction(null);
      refetch();
    },
    onError: (e: any) => toast.error(e.message),
  });

  const handleAction = (type: "approve" | "reject", applicationId: number, name: string) => {
    setPendingAction({ type, applicationId, name });
    setConfirmOpen(true);
  };

  const confirmAction = () => {
    if (!pendingAction) return;
    if (pendingAction.type === "approve") {
      approve.mutate({ applicationId: pendingAction.applicationId });
    } else {
      reject.mutate({ applicationId: pendingAction.applicationId, reason: "Not qualified" });
    }
  };

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
        <TabsList>
          <TabsTrigger value="pending">Pending ({pending.length})</TabsTrigger>
          <TabsTrigger value="approved">Approved ({approved.length})</TabsTrigger>
          <TabsTrigger value="rejected">Rejected ({rejected.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          <Card><CardContent className="p-0">
            {isLoading ? (
              <div className="p-6 space-y-3">{[1,2,3].map(i => <Skeleton key={i} className="h-16 w-full" />)}</div>
            ) : pending.length === 0 ? (
              <EmptyState
                icon={UserPlus}
                title="No pending applications"
                description="When coaches apply to join the platform, their applications will appear here for review."
              />
            ) : (
              <div className="divide-y">{pending.map((app: any) => (
                <div key={app.id} className="p-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium">{app.applicantName || "Applicant"}</p>
                    <p className="text-sm text-muted-foreground">{app.applicantEmail || app.email}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => handleAction("approve", app.id, app.applicantName || "Applicant")}>
                      <CheckCircle className="h-4 w-4 mr-1" /> Approve
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleAction("reject", app.id, app.applicantName || "Applicant")}>
                      <XCircle className="h-4 w-4 mr-1" /> Reject
                    </Button>
                  </div>
                </div>
              ))}</div>
            )}
          </CardContent></Card>
        </TabsContent>

        <TabsContent value="approved">
          <Card><CardContent className="p-0">
            {approved.length === 0 ? (
              <EmptyState
                icon={GraduationCap}
                title="No approved coaches"
                description="Approved coaches will appear here. Review pending applications to get started."
              />
            ) : (
              <div className="divide-y">{approved.map((a: any) => (
                <div key={a.id} className="p-4 flex items-center justify-between">
                  <div><p className="font-medium">{a.applicantName || "Coach"}</p><p className="text-sm text-muted-foreground">{a.applicantEmail}</p></div>
                  <Badge variant="default">Approved</Badge>
                </div>
              ))}</div>
            )}
          </CardContent></Card>
        </TabsContent>

        <TabsContent value="rejected">
          <Card><CardContent className="p-0">
            {rejected.length === 0 ? (
              <EmptyState
                icon={XCircle}
                title="No rejected applications"
                description="Rejected applications will appear here for reference and potential reconsideration."
              />
            ) : (
              <div className="divide-y">{rejected.map((a: any) => (
                <div key={a.id} className="p-4 flex items-center justify-between">
                  <div><p className="font-medium">{a.applicantName || "Applicant"}</p><p className="text-sm text-muted-foreground">{a.applicantEmail}</p></div>
                  <Badge variant="destructive">Rejected</Badge>
                </div>
              ))}</div>
            )}
          </CardContent></Card>
        </TabsContent>
      </Tabs>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title={pendingAction?.type === "approve" ? "Approve Coach Application" : "Reject Coach Application"}
        description={
          pendingAction?.type === "approve"
            ? `Are you sure you want to approve ${pendingAction.name} as a coach? They will gain access to coaching tools and student management.`
            : `Are you sure you want to reject ${pendingAction?.name}'s application? They will be notified of this decision.`
        }
        confirmLabel={pendingAction?.type === "approve" ? "Approve" : "Reject"}
        variant={pendingAction?.type === "reject" ? "destructive" : "default"}
        onConfirm={confirmAction}
        loading={approve.isPending || reject.isPending}
      />
    </div>
  );
}
