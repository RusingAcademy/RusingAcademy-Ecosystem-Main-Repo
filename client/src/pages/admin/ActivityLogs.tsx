import { trpc } from "@/lib/trpc";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Activity, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function ActivityLogs() {
  const { data: logs, isLoading } = trpc.admin.getRecentActivity.useQuery();
  const allLogs = (logs ?? []) as any[];
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div><h1 className="text-2xl font-bold">Activity Logs</h1><p className="text-sm text-muted-foreground">Track all admin actions and system events.</p></div>
      <Card><CardContent className="p-0">
        {isLoading ? <div className="p-6 space-y-3">{[1,2,3,4,5].map(i => <Skeleton key={i} className="h-12 w-full" />)}</div> : allLogs.length === 0 ? (
          <div className="p-8 text-center"><Activity className="h-10 w-10 text-muted-foreground mx-auto mb-3" /><p className="font-medium">No activity recorded yet</p></div>
        ) : (
          <div className="divide-y">{allLogs.map((log: any, idx: number) => (
            <div key={idx} className="p-4 flex items-start gap-3">
              <div className="p-1.5 rounded-full bg-muted mt-0.5"><Activity className="h-3.5 w-3.5 text-muted-foreground" /></div>
              <div className="flex-1"><p className="text-sm">{log.description || log.action || "Activity"}</p>
                <div className="flex items-center gap-2 mt-1"><Clock className="h-3 w-3 text-muted-foreground" /><span className="text-xs text-muted-foreground">{log.createdAt ? new Date(log.createdAt).toLocaleString() : ""}</span>{log.entityType && <Badge variant="outline" className="text-xs">{log.entityType}</Badge>}</div>
              </div>
            </div>
          ))}</div>
        )}
      </CardContent></Card>
    </div>
  );
}
