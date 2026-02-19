// client/src/components/admin/MonitoringDashboard.tsx — Phase 4: Centralized Monitoring UI
import { trpc } from "@/lib/trpc";
import { useLocale } from "@/i18n/LocaleContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, AlertTriangle, Clock, Cpu, HardDrive, Users, Zap, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
}

export default function MonitoringDashboard() {
  const { locale } = useLocale();
  const isFr = locale === "fr";

  const { data: overview, isLoading, refetch } = trpc.adminMonitoring.overview.useQuery(undefined, {
    refetchInterval: 10_000, // Auto-refresh every 10s
  });

  const { data: metricsSummary } = trpc.adminMonitoring.metricsSummary.useQuery({ windowMinutes: 60 }, {
    refetchInterval: 30_000,
  });

  if (isLoading || !overview) {
    return (
      <div className="flex items-center justify-center p-8">
        <Activity className="h-6 w-6 animate-pulse" />
      </div>
    );
  }

  const kpis = [
    {
      label: isFr ? "Disponibilité" : "Uptime",
      value: overview.uptimeFormatted,
      icon: Clock,
      color: "text-green-600",
    },
    {
      label: isFr ? "Requêtes totales" : "Total Requests",
      value: overview.totalRequests.toLocaleString(),
      icon: Zap,
      color: "text-blue-600",
    },
    {
      label: isFr ? "Taux d'erreur" : "Error Rate",
      value: `${overview.errorRate}%`,
      icon: AlertTriangle,
      color: overview.errorRate > 5 ? "text-red-600" : "text-green-600",
    },
    {
      label: isFr ? "Temps de réponse moy." : "Avg Response Time",
      value: `${overview.avgResponseTime}ms`,
      icon: Activity,
      color: overview.avgResponseTime > 500 ? "text-yellow-600" : "text-green-600",
    },
    {
      label: isFr ? "Utilisateurs actifs" : "Active Users",
      value: overview.activeUsers.toString(),
      icon: Users,
      color: "text-purple-600",
    },
    {
      label: isFr ? "Mémoire (Heap)" : "Memory (Heap)",
      value: formatBytes(overview.memoryUsage.heapUsed),
      icon: HardDrive,
      color: overview.memoryUsage.heapUsed > 500 * 1048576 ? "text-red-600" : "text-green-600",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{isFr ? "Monitoring" : "Monitoring"}</h2>
          <p className="text-muted-foreground">
            {isFr ? "Surveillance en temps réel de la plateforme" : "Real-time platform monitoring"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-green-600 border-green-300">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
            {isFr ? "En ligne" : "Online"}
          </Badge>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4 mr-1" />
            {isFr ? "Actualiser" : "Refresh"}
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {kpis.map((kpi) => (
          <Card key={kpi.label}>
            <CardContent className="pt-4 pb-3 px-4">
              <div className="flex items-center gap-2 mb-1">
                <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
                <span className="text-xs text-muted-foreground">{kpi.label}</span>
              </div>
              <p className="text-xl font-bold">{kpi.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* System Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cpu className="h-5 w-5" />
            {isFr ? "Informations système" : "System Information"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Node.js</span>
              <p className="font-medium">{overview.nodeVersion}</p>
            </div>
            <div>
              <span className="text-muted-foreground">{isFr ? "Heap total" : "Total Heap"}</span>
              <p className="font-medium">{formatBytes(overview.memoryUsage.heapTotal)}</p>
            </div>
            <div>
              <span className="text-muted-foreground">{isFr ? "Heap utilisé" : "Heap Used"}</span>
              <p className="font-medium">{formatBytes(overview.memoryUsage.heapUsed)}</p>
            </div>
            <div>
              <span className="text-muted-foreground">{isFr ? "Métriques en attente" : "Buffered Metrics"}</span>
              <p className="font-medium">{overview.bufferSize}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Metrics Summary */}
      {metricsSummary && metricsSummary.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>{isFr ? "Métriques (dernière heure)" : "Metrics (Last Hour)"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">{isFr ? "Métrique" : "Metric"}</th>
                    <th className="text-right py-2">{isFr ? "Nombre" : "Count"}</th>
                    <th className="text-right py-2">{isFr ? "Moyenne" : "Avg"}</th>
                    <th className="text-right py-2">Min</th>
                    <th className="text-right py-2">Max</th>
                  </tr>
                </thead>
                <tbody>
                  {metricsSummary.map((m: any) => (
                    <tr key={m.name} className="border-b last:border-0">
                      <td className="py-2 font-mono text-xs">{m.name}</td>
                      <td className="text-right py-2">{m.count}</td>
                      <td className="text-right py-2">{Number(m.avg).toFixed(2)}</td>
                      <td className="text-right py-2">{Number(m.min).toFixed(2)}</td>
                      <td className="text-right py-2">{Number(m.max).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
