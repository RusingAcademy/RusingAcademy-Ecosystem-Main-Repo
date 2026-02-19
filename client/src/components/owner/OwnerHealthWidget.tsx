/**
 * OwnerHealthWidget — System health status for the Owner Dashboard
 */
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, AlertTriangle, XCircle, Heart } from "lucide-react";

const statusIcon: Record<string, JSX.Element> = {
  ok: <CheckCircle className="h-5 w-5 text-green-500" />,
  warning: <AlertTriangle className="h-5 w-5 text-amber-500" />,
  error: <XCircle className="h-5 w-5 text-red-500" />,
};

const statusBg: Record<string, string> = {
  ok: "bg-green-50 dark:bg-green-500/10",
  warning: "bg-amber-50 dark:bg-amber-500/10",
  error: "bg-red-50 dark:bg-red-500/10",
};

export function OwnerHealthWidget() {
  const { data, isLoading } = trpc.owner.getSystemHealth.useQuery(undefined, {
    refetchInterval: 30000,
  });

  const overallColor = data?.overall === "healthy" ? "text-green-500" : data?.overall === "degraded" ? "text-amber-500" : "text-red-500";

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg flex items-center gap-2">
          <Heart className="h-5 w-5 text-red-400" />
          System Health
        </CardTitle>
        {data && (
          <span className={`text-sm font-semibold capitalize ${overallColor}`}>
            {data.overall}
          </span>
        )}
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse h-16 bg-gray-200 dark:bg-gray-700 rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {data?.checks?.map((check: any) => (
              <div key={check.name} className={`p-3 rounded-lg ${statusBg[check.status] || statusBg.ok}`}>
                <div className="flex items-center gap-2 mb-1">
                  {statusIcon[check.status] || statusIcon.ok}
                  <span className="text-sm font-medium">{check.name}</span>
                </div>
                <p className="text-xs text-muted-foreground">{check.detail}</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
