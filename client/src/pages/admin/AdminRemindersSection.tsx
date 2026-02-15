/**
 * AdminRemindersSection — Reminders management inside AdminControlCenter
 * 
 * Wraps the core reminders UI, stripping the standalone layout
 * so it renders inside AdminLayout.
 */
import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
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
  CalendarClock,
  Bell,
  Plus,
  Search,
  Filter,
  Clock,
  CheckCircle,
  AlertTriangle,
  Users,
  Mail,
} from "lucide-react";
import { toast } from "sonner";

// Mock data
const mockReminders = [
  { id: 1, title: "Session reminder — Marie Dupont", type: "session", recipient: "marie.dupont@gc.ca", scheduledAt: "2026-02-14 09:00", status: "pending", channel: "email" },
  { id: 2, title: "Assignment deadline — Path II Module 3", type: "deadline", recipient: "group:path-ii", scheduledAt: "2026-02-15 17:00", status: "pending", channel: "push" },
  { id: 3, title: "Weekly progress check-in", type: "progress", recipient: "all-learners", scheduledAt: "2026-02-16 10:00", status: "sent", channel: "email" },
  { id: 4, title: "Coach availability update", type: "admin", recipient: "coaches", scheduledAt: "2026-02-13 08:00", status: "sent", channel: "email" },
  { id: 5, title: "SLE exam preparation — 7 days", type: "exam", recipient: "sle-candidates", scheduledAt: "2026-02-20 09:00", status: "scheduled", channel: "sms" },
];

export default function AdminRemindersSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  const filteredReminders = mockReminders.filter(r => {
    const matchesSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === "all" || r.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const stats = {
    total: mockReminders.length,
    pending: mockReminders.filter(r => r.status === "pending").length,
    sent: mockReminders.filter(r => r.status === "sent").length,
    scheduled: mockReminders.filter(r => r.status === "scheduled").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Reminders</h1>
          <p className="text-muted-foreground mt-1">
            Manage automated reminders for sessions, deadlines, and progress check-ins
          </p>
        </div>
        <Button onClick={() => toast.info("Create reminder form coming soon")}>
          <Plus className="h-4 w-4 mr-2" />
          New Reminder
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Bell className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Reminders</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold">{stats.pending}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Sent</p>
                <p className="text-2xl font-bold">{stats.sent}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <CalendarClock className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Scheduled</p>
                <p className="text-2xl font-bold">{stats.scheduled}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search reminders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="session">Session</SelectItem>
            <SelectItem value="deadline">Deadline</SelectItem>
            <SelectItem value="progress">Progress</SelectItem>
            <SelectItem value="exam">Exam</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Reminder</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Recipient</TableHead>
                <TableHead>Channel</TableHead>
                <TableHead>Scheduled</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReminders.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium">{r.title}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">{r.type}</Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{r.recipient}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {r.channel === "email" && <Mail className="h-3 w-3" />}
                      {r.channel === "push" && <Bell className="h-3 w-3" />}
                      <span className="text-sm capitalize">{r.channel}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{r.scheduledAt}</TableCell>
                  <TableCell>
                    <Badge variant={r.status === "sent" ? "default" : r.status === "pending" ? "secondary" : "outline"}>
                      {r.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
