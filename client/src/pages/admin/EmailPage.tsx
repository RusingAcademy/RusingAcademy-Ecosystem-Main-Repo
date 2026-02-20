import { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useLocation } from "wouter";
import {
  Mail, Send, FileText, Users, Settings,
  CheckCircle, XCircle, AlertTriangle, RefreshCw,
  BarChart3, Clock,
} from "lucide-react";

export default function EmailPage() {
  const [, navigate] = useLocation();
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const { data: stats, isLoading: statsLoading } = trpc.adminEmail.getStats.useQuery();
  const { data: logsData, isLoading: logsLoading, refetch } = trpc.adminEmail.getLogs.useQuery(
    {
      type: typeFilter !== "all" ? typeFilter : undefined,
      status: statusFilter !== "all" ? statusFilter : undefined,
      limit: 100,
    },
    { retry: 1 }
  );

  const quickActions = [
    { title: "Email Templates", desc: "Create and manage reusable email templates", icon: FileText, action: () => navigate("/admin/email-templates") },
    { title: "Broadcast", desc: "Send one-time emails to all users or segments", icon: Send, action: () => toast.info("Broadcast feature — launching soon!") },
    { title: "Sequences", desc: "Set up automated email drip campaigns", icon: Mail, action: () => toast.info("Sequences feature — launching soon!") },
    { title: "Subscribers", desc: "View and manage your email subscriber list", icon: Users, action: () => toast.info("Subscribers feature — launching soon!") },
    { title: "Settings", desc: "Configure sender name, reply-to, and SMTP", icon: Settings, action: () => navigate("/admin/email-settings") },
  ];

  const statusIcon = (status: string) => {
    if (status === "sent") return <CheckCircle className="h-4 w-4 text-green-500" />;
    if (status === "failed") return <XCircle className="h-4 w-4 text-red-500" />;
    return <AlertTriangle className="h-4 w-4 text-amber-500" />;
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Email & Communications</h1>
          <p className="text-sm text-muted-foreground">Manage email templates, delivery tracking, and communications.</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => refetch()}>
          <RefreshCw className="h-4 w-4 mr-1.5" /> Refresh
        </Button>
      </div>

      <Tabs defaultValue="dashboard">
        <TabsList>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="logs">Delivery Logs</TabsTrigger>
          <TabsTrigger value="actions">Quick Actions</TabsTrigger>
        </TabsList>

        {/* Dashboard Tab */}
        <TabsContent value="dashboard" className="space-y-6 mt-4">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-100">
                    <Mail className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Total Emails</p>
                    <p className="text-2xl font-bold">{statsLoading ? "..." : stats?.total ?? 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-green-100">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Sent</p>
                    <p className="text-2xl font-bold text-green-600">{statsLoading ? "..." : stats?.sent ?? 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-red-100">
                    <XCircle className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Failed</p>
                    <p className="text-2xl font-bold text-red-600">{statsLoading ? "..." : stats?.failed ?? 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-amber-100">
                    <AlertTriangle className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Bounced</p>
                    <p className="text-2xl font-bold text-amber-600">{statsLoading ? "..." : stats?.bounced ?? 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Delivery Rate */}
          {stats && stats.total > 0 && (
            <Card>
              <CardHeader><CardTitle className="text-lg flex items-center gap-2"><BarChart3 className="h-5 w-5" /> Delivery Rate</CardTitle></CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="h-4 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500 rounded-full transition-all"
                        style={{ width: `${Math.round((stats.sent / stats.total) * 100)}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-lg font-bold">{Math.round((stats.sent / stats.total) * 100)}%</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  {stats.sent} of {stats.total} emails delivered successfully
                </p>
              </CardContent>
            </Card>
          )}

          {/* By Type Breakdown */}
          {stats?.byType && stats.byType.length > 0 && (
            <Card>
              <CardHeader><CardTitle className="text-lg">Emails by Type</CardTitle></CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {(stats.byType as any[]).map((t: any) => (
                    <div key={t.type} className="p-3 rounded-lg border text-center">
                      <p className="text-xs text-muted-foreground capitalize">{t.type}</p>
                      <p className="text-xl font-bold">{t.count}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Logs Tab */}
        <TabsContent value="logs" className="space-y-4 mt-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-wrap gap-3">
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-[160px]"><SelectValue placeholder="Type" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="welcome">Welcome</SelectItem>
                    <SelectItem value="enrollment_confirmation">Enrollment</SelectItem>
                    <SelectItem value="booking_confirmation">Booking</SelectItem>
                    <SelectItem value="password_reset">Password Reset</SelectItem>
                    <SelectItem value="newsletter">Newsletter</SelectItem>
                    <SelectItem value="notification">Notification</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[140px]"><SelectValue placeholder="Status" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="sent">Sent</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                    <SelectItem value="bounced">Bounced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-0">
              {logsLoading ? (
                <div className="p-6 space-y-3">
                  {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-12 w-full" />)}
                </div>
              ) : !logsData?.logs?.length ? (
                <div className="py-6 md:py-8 lg:py-12 text-center text-muted-foreground">
                  <Mail className="h-12 w-12 mx-auto mb-3 opacity-30" />
                  <p>No email logs found</p>
                  <p className="text-sm mt-1">Email delivery logs will appear here as emails are sent.</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Status</TableHead>
                      <TableHead>To</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(logsData.logs as any[]).map((log: any) => (
                      <TableRow key={log.id}>
                        <TableCell>
                          <div className="flex items-center gap-1.5">
                            {statusIcon(log.status)}
                            <span className="text-sm capitalize">{log.status}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">{log.toEmail}</TableCell>
                        <TableCell className="text-sm max-w-[200px] truncate">{log.subject}</TableCell>
                        <TableCell><Badge variant="outline" className="text-xs capitalize">{log.type}</Badge></TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {log.sentAt ? new Date(log.sentAt).toLocaleString() : "N/A"}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
          {logsData && <p className="text-sm text-muted-foreground text-center">Showing {logsData.logs.length} of {logsData.total} logs</p>}
        </TabsContent>

        {/* Quick Actions Tab */}
        <TabsContent value="actions" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickActions.map((item) => (
              <Card key={item.title} className="hover:shadow-md transition-shadow cursor-pointer" onClick={item.action}>
                <CardContent className="p-5">
                  <item.icon className="h-8 w-8 text-muted-foreground mb-3" />
                  <h3 className="font-semibold mb-1">{item.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{item.desc}</p>
                  <Button size="sm" variant="outline">Open</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
