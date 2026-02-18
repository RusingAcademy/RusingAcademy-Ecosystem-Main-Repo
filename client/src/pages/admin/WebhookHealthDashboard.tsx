import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock,
  RefreshCw,
  Zap,
  XCircle,
  RotateCcw,
  Shield,
  Timer,
} from "lucide-react";

const t = {
  en: {
    title: "Webhook Health Dashboard",
    subtitle: "Monitor Stripe webhook processing, latency, and failed events in real time.",
    overview: "Processing Overview",
    total: "Total Events",
    processed: "Processed",
    failed: "Failed",
    processing: "In Progress",
    latency: "Latency Metrics",
    avgLatency: "Avg Latency",
    maxLatency: "Max Latency",
    totalProcessed: "Total Processed",
    recentEvents: "Recent Events",
    failedEvents: "Failed Events (Dead Letter Queue)",
    noFailed: "No failed events — all systems healthy.",
    noRecent: "No webhook events recorded yet.",
    retry: "Retry",
    retrying: "Retrying...",
    retrySuccess: "Event queued for retry",
    retryError: "Failed to retry event",
    eventId: "Event ID",
    type: "Type",
    status: "Status",
    attempts: "Attempts",
    error: "Error",
    time: "Time",
    refresh: "Refresh",
    healthy: "Healthy",
    degraded: "Degraded",
    critical: "Critical",
    systemStatus: "System Status",
  },
  fr: {
    title: "Tableau de bord des webhooks",
    subtitle: "Surveillez le traitement des webhooks Stripe, la latence et les événements échoués en temps réel.",
    overview: "Aperçu du traitement",
    total: "Total des événements",
    processed: "Traités",
    failed: "Échoués",
    processing: "En cours",
    latency: "Métriques de latence",
    avgLatency: "Latence moy.",
    maxLatency: "Latence max.",
    totalProcessed: "Total traités",
    recentEvents: "Événements récents",
    failedEvents: "Événements échoués (file d'attente morte)",
    noFailed: "Aucun événement échoué — tous les systèmes sont sains.",
    noRecent: "Aucun événement webhook enregistré.",
    retry: "Réessayer",
    retrying: "Réessai...",
    retrySuccess: "Événement mis en file d'attente pour réessai",
    retryError: "Échec de la tentative de réessai",
    eventId: "ID de l'événement",
    type: "Type",
    status: "Statut",
    attempts: "Tentatives",
    error: "Erreur",
    time: "Heure",
    refresh: "Actualiser",
    healthy: "Sain",
    degraded: "Dégradé",
    critical: "Critique",
    systemStatus: "État du système",
  },
};

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    processed: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    failed: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
    processing: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    pending_retry: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${colors[status] || "bg-gray-100 dark:bg-card text-gray-800"}`}>
      {status === "processed" && <CheckCircle2 className="h-3 w-3 mr-1" />}
      {status === "failed" && <XCircle className="h-3 w-3 mr-1" />}
      {status === "processing" && <Clock className="h-3 w-3 mr-1" />}
      {status === "pending_retry" && <RotateCcw className="h-3 w-3 mr-1" />}
      {status}
    </span>
  );
}

export default function WebhookHealthDashboard() {
  const { language } = useLanguage();
  const ui = t[language] || t.en;
  const [retryingId, setRetryingId] = useState<string | null>(null);

  const { data: stats, isLoading: statsLoading, refetch: refetchStats } = trpc.adminStability.getWebhookStats.useQuery();
  const { data: latency, refetch: refetchLatency } = trpc.adminStability.getWebhookLatencyStats.useQuery();
  const { data: failedEvents, refetch: refetchFailed } = trpc.adminStability.getFailedWebhookEvents.useQuery();

  const retryMutation = trpc.adminStability.retryWebhookEvent.useMutation({
    onSuccess: (data) => {
      toast.success(data.message || ui.retrySuccess);
      refetchStats();
      refetchFailed();
    },
    onError: () => {
      toast.error(ui.retryError);
    },
    onSettled: () => {
      setRetryingId(null);
    },
  });

  const handleRetry = (stripeEventId: string) => {
    setRetryingId(stripeEventId);
    retryMutation.mutate({ stripeEventId });
  };

  const handleRefresh = () => {
    refetchStats();
    refetchLatency();
    refetchFailed();
    toast.success(ui.refresh);
  };

  // Determine system health
  const failedCount = (stats as any)?.failed ?? 0;
  const processingCount = (stats as any)?.processing ?? 0;
  const healthStatus = failedCount > 10 ? "critical" : failedCount > 0 || processingCount > 5 ? "degraded" : "healthy";
  const healthColor = healthStatus === "critical" ? "text-red-500" : healthStatus === "degraded" ? "text-yellow-500" : "text-green-500";
  const healthLabel = healthStatus === "critical" ? ui.critical : healthStatus === "degraded" ? ui.degraded : ui.healthy;

  if (statsLoading) {
    return (
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => <Skeleton key={i} className="h-24" />)}
        </div>
      </div>
    );
  }

  const s = stats as any ?? {};
  const l = latency as any ?? {};
  const failed = Array.isArray(failedEvents) ? failedEvents : [];
  const recentEvents = Array.isArray(s.recentEvents) ? s.recentEvents : [];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Zap className="h-6 w-6 text-yellow-500" />
            {ui.title}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">{ui.subtitle}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border ${healthColor}`}>
            <Shield className="h-4 w-4" />
            <span className="text-sm font-medium">{ui.systemStatus}: {healthLabel}</span>
          </div>
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4 mr-1" /> {ui.refresh}
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: ui.total, value: s.total ?? 0, icon: Activity, color: "var(--color-blue-600, var(--color-blue-600, var(--color-blue-600, var(--semantic-info))))" },
          { label: ui.processed, value: s.processed ?? 0, icon: CheckCircle2, color: "var(--semantic-success, var(--semantic-success, var(--semantic-success, var(--success))))" },
          { label: ui.failed, value: s.failed ?? 0, icon: AlertTriangle, color: "var(--semantic-danger, var(--semantic-danger, var(--danger)))" },
          { label: ui.processing, value: s.processing ?? 0, icon: Clock, color: "var(--color-violet-600, var(--color-violet-600, var(--color-violet-600, var(--accent-purple))))" },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <stat.icon className="h-5 w-5" style={{ color: stat.color }} />
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Latency Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Timer className="h-4 w-4" /> {ui.latency}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <p className="text-2xl font-bold">{l.avgLatencyMs ?? 0}ms</p>
              <p className="text-xs text-muted-foreground">{ui.avgLatency}</p>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <p className="text-2xl font-bold">{l.maxLatencyMs ?? 0}ms</p>
              <p className="text-xs text-muted-foreground">{ui.maxLatency}</p>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <p className="text-2xl font-bold">{l.totalProcessed ?? 0}</p>
              <p className="text-xs text-muted-foreground">{ui.totalProcessed}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Failed Events (Dead Letter Queue) */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-red-500" /> {ui.failedEvents}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {failed.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle2 className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">{ui.noFailed}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-2 font-medium">{ui.eventId}</th>
                    <th className="text-left py-2 px-2 font-medium">{ui.type}</th>
                    <th className="text-left py-2 px-2 font-medium">{ui.status}</th>
                    <th className="text-left py-2 px-2 font-medium">{ui.attempts}</th>
                    <th className="text-left py-2 px-2 font-medium">{ui.error}</th>
                    <th className="text-right py-2 px-2 font-medium"></th>
                  </tr>
                </thead>
                <tbody>
                  {failed.map((ev: any) => (
                    <tr key={ev.stripeEventId} className="border-b hover:bg-muted/50">
                      <td className="py-2 px-2 font-mono text-xs truncate max-w-[180px]">{ev.stripeEventId}</td>
                      <td className="py-2 px-2 text-xs">{ev.eventType}</td>
                      <td className="py-2 px-2"><StatusBadge status={ev.status} /></td>
                      <td className="py-2 px-2 text-center">{ev.attempts}</td>
                      <td className="py-2 px-2 text-xs text-red-600 truncate max-w-[200px]" title={ev.lastError}>{ev.lastError || "—"}</td>
                      <td className="py-2 px-2 text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRetry(ev.stripeEventId)}
                          disabled={retryingId === ev.stripeEventId}
                        >
                          <RotateCcw className="h-3 w-3 mr-1" />
                          {retryingId === ev.stripeEventId ? ui.retrying : ui.retry}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Events */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Activity className="h-4 w-4" /> {ui.recentEvents}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recentEvents.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">{ui.noRecent}</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-2 font-medium">{ui.eventId}</th>
                    <th className="text-left py-2 px-2 font-medium">{ui.type}</th>
                    <th className="text-left py-2 px-2 font-medium">{ui.status}</th>
                    <th className="text-left py-2 px-2 font-medium">{ui.attempts}</th>
                    <th className="text-left py-2 px-2 font-medium">{ui.time}</th>
                  </tr>
                </thead>
                <tbody>
                  {recentEvents.map((ev: any) => (
                    <tr key={ev.stripeEventId} className="border-b hover:bg-muted/50">
                      <td className="py-2 px-2 font-mono text-xs truncate max-w-[180px]">{ev.stripeEventId}</td>
                      <td className="py-2 px-2 text-xs">{ev.eventType}</td>
                      <td className="py-2 px-2"><StatusBadge status={ev.status} /></td>
                      <td className="py-2 px-2 text-center">{ev.attempts}</td>
                      <td className="py-2 px-2 text-xs text-muted-foreground">
                        {ev.createdAt ? new Date(ev.createdAt).toLocaleString() : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
