import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Bell,
  Mail,
  Clock,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Download,
  Filter,
  Calendar,
  Users,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";
import { format } from "date-fns";
import { fr, enUS } from "date-fns/locale";

// Mock data for demonstration
const mockReminders = [
  {
    id: 1,
    sessionId: 101,
    learnerName: "Marie Dupont",
    coachName: "Jean Martin",
    type: "24h" as const,
    channel: "email" as const,
    status: "sent" as const,
    sentAt: new Date("2026-01-29T10:00:00"),
    sessionDate: new Date("2026-01-30T10:00:00"),
    opened: true,
    clicked: true,
  },
  {
    id: 2,
    sessionId: 102,
    learnerName: "Pierre Bernard",
    coachName: "Sophie Lefebvre",
    type: "1h" as const,
    channel: "in_app" as const,
    status: "sent" as const,
    sentAt: new Date("2026-01-30T09:00:00"),
    sessionDate: new Date("2026-01-30T10:00:00"),
    opened: true,
    clicked: false,
  },
  {
    id: 3,
    sessionId: 103,
    learnerName: "Claire Moreau",
    coachName: "Jean Martin",
    type: "24h" as const,
    channel: "email" as const,
    status: "failed" as const,
    sentAt: new Date("2026-01-29T14:00:00"),
    sessionDate: new Date("2026-01-30T14:00:00"),
    opened: false,
    clicked: false,
    error: "Invalid email address",
  },
  {
    id: 4,
    sessionId: 104,
    learnerName: "Lucas Petit",
    coachName: "Marie Claire",
    type: "24h" as const,
    channel: "email" as const,
    status: "sent" as const,
    sentAt: new Date("2026-01-28T16:00:00"),
    sessionDate: new Date("2026-01-29T16:00:00"),
    opened: true,
    clicked: true,
  },
  {
    id: 5,
    sessionId: 105,
    learnerName: "Emma Dubois",
    coachName: "Sophie Lefebvre",
    type: "1h" as const,
    channel: "in_app" as const,
    status: "pending" as const,
    sentAt: null,
    sessionDate: new Date("2026-01-30T15:00:00"),
    opened: false,
    clicked: false,
  },
];

const labels = {
  en: {
    title: "Session Reminders Dashboard",
    subtitle: "Monitor and manage automated session reminders",
    stats: {
      totalSent: "Total Sent",
      openRate: "Open Rate",
      clickRate: "Click Rate",
      failedReminders: "Failed",
    },
    filters: {
      type: "Reminder Type",
      channel: "Channel",
      status: "Status",
      dateRange: "Date Range",
      all: "All",
      type24h: "24 Hours Before",
      type1h: "1 Hour Before",
      email: "Email",
      inApp: "In-App",
      sent: "Sent",
      pending: "Pending",
      failed: "Failed",
    },
    table: {
      learner: "Learner",
      coach: "Coach",
      session: "Session Date",
      type: "Type",
      channel: "Channel",
      status: "Status",
      sentAt: "Sent At",
      engagement: "Engagement",
    },
    actions: {
      refresh: "Refresh",
      export: "Export CSV",
      retry: "Retry Failed",
    },
    engagement: {
      opened: "Opened",
      clicked: "Clicked",
      notOpened: "Not Opened",
    },
  },
  fr: {
    title: "Tableau de Bord des Rappels",
    subtitle: "Surveillez et gérez les rappels de sessions automatisés",
    stats: {
      totalSent: "Total Envoyés",
      openRate: "Taux d'Ouverture",
      clickRate: "Taux de Clic",
      failedReminders: "Échoués",
    },
    filters: {
      type: "Type de Rappel",
      channel: "Canal",
      status: "Statut",
      dateRange: "Période",
      all: "Tous",
      type24h: "24 Heures Avant",
      type1h: "1 Heure Avant",
      email: "Email",
      inApp: "In-App",
      sent: "Envoyé",
      pending: "En Attente",
      failed: "Échoué",
    },
    table: {
      learner: "Apprenant",
      coach: "Coach",
      session: "Date Session",
      type: "Type",
      channel: "Canal",
      status: "Statut",
      sentAt: "Envoyé à",
      engagement: "Engagement",
    },
    actions: {
      refresh: "Actualiser",
      export: "Exporter CSV",
      retry: "Réessayer Échoués",
    },
    engagement: {
      opened: "Ouvert",
      clicked: "Cliqué",
      notOpened: "Non Ouvert",
    },
  },
};

export default function AdminReminders() {
  const { language } = useLanguage();
  const isEn = language === "en";
  const t = isEn ? labels.en : labels.fr;
  const dateLocale = isEn ? enUS : fr;

  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [channelFilter, setChannelFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Filter reminders
  const filteredReminders = mockReminders.filter((reminder) => {
    if (typeFilter !== "all" && reminder.type !== typeFilter) return false;
    if (channelFilter !== "all" && reminder.channel !== channelFilter) return false;
    if (statusFilter !== "all" && reminder.status !== statusFilter) return false;
    return true;
  });

  // Calculate stats
  const totalSent = mockReminders.filter((r) => r.status === "sent").length;
  const totalOpened = mockReminders.filter((r) => r.opened).length;
  const totalClicked = mockReminders.filter((r) => r.clicked).length;
  const totalFailed = mockReminders.filter((r) => r.status === "failed").length;
  const openRate = totalSent > 0 ? Math.round((totalOpened / totalSent) * 100) : 0;
  const clickRate = totalSent > 0 ? Math.round((totalClicked / totalSent) * 100) : 0;

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const handleExport = () => {
    const headers = ["Learner", "Coach", "Type", "Channel", "Status", "Sent At", "Session Date"];
    const rows = filteredReminders.map((r) => [
      r.learnerName,
      r.coachName,
      r.type,
      r.channel,
      r.status,
      r.sentAt ? format(r.sentAt, "yyyy-MM-dd HH:mm") : "-",
      format(r.sessionDate, "yyyy-MM-dd HH:mm"),
    ]);

    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `reminders-export-${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "sent":
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            {t.filters.sent}
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
            <Clock className="h-3 w-3 mr-1" />
            {t.filters.pending}
          </Badge>
        );
      case "failed":
        return (
          <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
            <XCircle className="h-3 w-3 mr-1" />
            {t.filters.failed}
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Bell className="h-8 w-8 text-primary" />
              {t.title}
            </h1>
            <p className="text-muted-foreground mt-1">{t.subtitle}</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={handleRefresh} disabled={isRefreshing}>
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
              {t.actions.refresh}
            </Button>
            <Button variant="outline" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              {t.actions.export}
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{t.stats.totalSent}</p>
                  <p className="text-3xl font-bold">{totalSent}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                  <Mail className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{t.stats.openRate}</p>
                  <p className="text-3xl font-bold">{openRate}%</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{t.stats.clickRate}</p>
                  <p className="text-3xl font-bold">{clickRate}%</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                  <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{t.stats.failedReminders}</p>
                  <p className="text-3xl font-bold text-red-600">{totalFailed}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
                  <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              {isEn ? "Filters" : "Filtres"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">{t.filters.type}</label>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t.filters.all}</SelectItem>
                    <SelectItem value="24h">{t.filters.type24h}</SelectItem>
                    <SelectItem value="1h">{t.filters.type1h}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">{t.filters.channel}</label>
                <Select value={channelFilter} onValueChange={setChannelFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t.filters.all}</SelectItem>
                    <SelectItem value="email">{t.filters.email}</SelectItem>
                    <SelectItem value="in_app">{t.filters.inApp}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">{t.filters.status}</label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t.filters.all}</SelectItem>
                    <SelectItem value="sent">{t.filters.sent}</SelectItem>
                    <SelectItem value="pending">{t.filters.pending}</SelectItem>
                    <SelectItem value="failed">{t.filters.failed}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">{t.filters.dateRange}</label>
                <Input type="date" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reminders Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t.table.learner}</TableHead>
                  <TableHead>{t.table.coach}</TableHead>
                  <TableHead>{t.table.session}</TableHead>
                  <TableHead>{t.table.type}</TableHead>
                  <TableHead>{t.table.channel}</TableHead>
                  <TableHead>{t.table.status}</TableHead>
                  <TableHead>{t.table.sentAt}</TableHead>
                  <TableHead>{t.table.engagement}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReminders.map((reminder) => (
                  <TableRow key={reminder.id}>
                    <TableCell className="font-medium">{reminder.learnerName}</TableCell>
                    <TableCell>{reminder.coachName}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        {format(reminder.sessionDate, "PPp", { locale: dateLocale })}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {reminder.type === "24h" ? t.filters.type24h : t.filters.type1h}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {reminder.channel === "email" ? (
                          <>
                            <Mail className="h-3 w-3 mr-1" />
                            {t.filters.email}
                          </>
                        ) : (
                          <>
                            <Bell className="h-3 w-3 mr-1" />
                            {t.filters.inApp}
                          </>
                        )}
                      </Badge>
                    </TableCell>
                    <TableCell>{getStatusBadge(reminder.status)}</TableCell>
                    <TableCell>
                      {reminder.sentAt
                        ? format(reminder.sentAt, "PPp", { locale: dateLocale })
                        : "-"}
                    </TableCell>
                    <TableCell>
                      {reminder.status === "sent" && (
                        <div className="flex items-center gap-2">
                          {reminder.opened ? (
                            <Badge className="bg-green-100 text-green-800 text-xs">
                              {t.engagement.opened}
                            </Badge>
                          ) : (
                            <Badge className="bg-gray-100 text-gray-800 text-xs">
                              {t.engagement.notOpened}
                            </Badge>
                          )}
                          {reminder.clicked && (
                            <Badge className="bg-blue-100 text-blue-800 text-xs">
                              {t.engagement.clicked}
                            </Badge>
                          )}
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
