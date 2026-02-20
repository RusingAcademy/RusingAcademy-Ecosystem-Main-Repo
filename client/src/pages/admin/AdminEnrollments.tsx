import { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { GraduationCap, Search, Download, Users, BookOpen, TrendingUp, Clock, RefreshCw, UserPlus, XCircle } from "lucide-react";
import { toast } from "sonner";

import { useLanguage } from "@/contexts/LanguageContext";

const labels = {
  en: { title: "Enrollments", description: "Manage and configure enrollments" },
  fr: { title: "Inscriptions", description: "Gérer et configurer inscriptions" },
};

export default function AdminEnrollments() {
  const { language } = useLanguage();
  const l = labels[language as keyof typeof labels] || labels.en;

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [enrollDialogOpen, setEnrollDialogOpen] = useState(false);
  const [enrollType, setEnrollType] = useState<"course" | "path">("course");
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [selectedTargetId, setSelectedTargetId] = useState<string>("");
  const [enrollReason, setEnrollReason] = useState("");

  // Fetch enrollments data from admin procedure
  const { data, isLoading, error, refetch } = trpc.admin.getEnrollments.useQuery(undefined, {
    retry: 1,
  });

  // Fetch users and courses/paths for manual enrollment
  const { data: usersForEnroll } = trpc.admin.getUsersForEnrollment.useQuery(undefined, {
    enabled: enrollDialogOpen,
  });
  const { data: coursesForEnroll } = trpc.admin.getCoursesForEnrollment.useQuery(undefined, {
    enabled: enrollDialogOpen && enrollType === "course",
  });
  const { data: pathsForEnroll } = trpc.admin.getPathsForEnrollment.useQuery(undefined, {
    enabled: enrollDialogOpen && enrollType === "path",
  });

  // Manual enrollment mutation
  const manualEnrollMutation = trpc.admin.manualEnroll.useMutation({
    onSuccess: (result) => {
      toast.success(result.message);
      setEnrollDialogOpen(false);
      setSelectedUserId("");
      setSelectedTargetId("");
      setEnrollReason("");
      refetch();
    },
    onError: (err) => {
      toast.error(err.message || "Failed to enroll user");
    },
  });

  // Unenroll mutation
  const unenrollMutation = trpc.admin.unenroll.useMutation({
    onSuccess: () => {
      toast.success("Enrollment cancelled successfully");
      refetch();
    },
    onError: (err) => {
      toast.error(err.message || "Failed to cancel enrollment");
    },
  });

  const enrollments = data?.enrollments ?? [];
  const stats = data?.stats ?? { total: 0, active: 0, completed: 0, paused: 0 };

  // Filter enrollments
  const filteredEnrollments = useMemo(() => {
    return enrollments.filter((e: any) => {
      const matchesSearch = !searchQuery || 
        e.userName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.userEmail?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.courseName?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "all" || e.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [enrollments, searchQuery, statusFilter]);

  // Export CSV
  const handleExportCSV = () => {
    if (filteredEnrollments.length === 0) {
      toast.error("No data to export");
      return;
    }
    const headers = ["Student", "Email", "Course/Path", "Type", "Status", "Progress", "Enrolled Date", "Payment"];
    const rows = filteredEnrollments.map((e: any) => [
      e.userName || "N/A",
      e.userEmail || "N/A",
      e.courseName || "N/A",
      e.type || "course",
      e.status || "N/A",
      `${e.progressPercent || 0}%`,
      e.enrolledAt ? new Date(e.enrolledAt).toLocaleDateString() : "N/A",
      (e as any).paymentStatus || "free",
    ]);
    const csv = [headers.join(","), ...rows.map(r => r.map(c => `"${c}"`).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `enrollments-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("CSV exported successfully");
  };

  const handleManualEnroll = () => {
    if (!selectedUserId || !selectedTargetId) {
      toast.error("Please select a user and a course/path");
      return;
    }
    manualEnrollMutation.mutate({
      userId: parseInt(selectedUserId),
      type: enrollType,
      targetId: parseInt(selectedTargetId),
      reason: enrollReason || undefined,
    });
  };

  const handleUnenroll = (enrollmentId: number, type: string) => {
    if (!confirm("Are you sure you want to cancel this enrollment?")) return;
    unenrollMutation.mutate({
      enrollmentId,
      type: type as "course" | "path",
    });
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; label: string }> = {
      active: { variant: "default", label: "Active" },
      completed: { variant: "secondary", label: "Completed" },
      paused: { variant: "outline", label: "Paused" },
      cancelled: { variant: "destructive", label: "Cancelled" },
    };
    const config = variants[status] || { variant: "outline" as const, label: status };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getPaymentBadge = (status: string) => {
    const variants: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; label: string }> = {
      paid: { variant: "default", label: "Paid" },
      pending: { variant: "outline", label: "Pending" },
      refunded: { variant: "destructive", label: "Refunded" },
      free: { variant: "secondary", label: "Free" },
      manual: { variant: "outline", label: "Manual" },
    };
    const config = variants[status] || { variant: "outline" as const, label: status };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  if (error) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-3">
          <GraduationCap className="h-8 w-8 text-teal-600" />
          <div>
            <h1 className="text-2xl font-bold">Enrollments</h1>
            <p className="text-muted-foreground">Manage student enrollments across all courses</p>
          </div>
        </div>
        <Card>
          <CardContent className="py-6 md:py-8 lg:py-12 text-center">
            <p className="text-muted-foreground">Unable to load enrollments. Please try again.</p>
            <Button variant="outline" className="mt-4" onClick={() => refetch()}>
              <RefreshCw className="h-4 w-4 mr-2" /> Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <GraduationCap className="h-8 w-8 text-teal-600" />
          <div>
            <h1 className="text-2xl font-bold">Enrollments</h1>
            <p className="text-muted-foreground">Manage student enrollments across all courses and paths</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Manual Enrollment Dialog */}
          <Dialog open={enrollDialogOpen} onOpenChange={setEnrollDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-1.5 bg-teal-600 hover:bg-teal-700" onClick={() => toast.info("Manual Enroll")}>
                <UserPlus className="h-4 w-4" /> Manual Enroll
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[480px]">
              <DialogHeader>
                <DialogTitle>Manual Enrollment</DialogTitle>
                <DialogDescription>
                  Enroll a user in a course or learning path without payment.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Enrollment Type</Label>
                  <Select value={enrollType} onValueChange={(v) => { setEnrollType(v as any); setSelectedTargetId(""); }}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="course">Course</SelectItem>
                      <SelectItem value="path">Learning Path</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>User</Label>
                  <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a user..." />
                    </SelectTrigger>
                    <SelectContent className="max-h-[200px]">
                      {(usersForEnroll || []).map((u: any) => (
                        <SelectItem key={u.id} value={String(u.id)}>
                          {u.name || u.email} {u.name ? `(${u.email})` : ""}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>{enrollType === "course" ? "Course" : "Learning Path"}</Label>
                  <Select value={selectedTargetId} onValueChange={setSelectedTargetId}>
                    <SelectTrigger>
                      <SelectValue placeholder={`Select a ${enrollType}...`} />
                    </SelectTrigger>
                    <SelectContent className="max-h-[200px]">
                      {enrollType === "course"
                        ? (coursesForEnroll || []).map((c: any) => (
                            <SelectItem key={c.id} value={String(c.id)}>
                              {c.title} {c.level ? `(${c.level})` : ""}
                            </SelectItem>
                          ))
                        : (pathsForEnroll || []).map((p: any) => (
                            <SelectItem key={p.id} value={String(p.id)}>
                              {p.title}
                            </SelectItem>
                          ))
                      }
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Reason (optional)</Label>
                  <Textarea
                    placeholder="e.g., Complimentary access, government partnership..."
                    value={enrollReason}
                    onChange={(e) => setEnrollReason(e.target.value)}
                    rows={2}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setEnrollDialogOpen(false)}>Cancel</Button>
                <Button
                  onClick={handleManualEnroll}
                  disabled={manualEnrollMutation.isPending || !selectedUserId || !selectedTargetId}
                  className="bg-teal-600 hover:bg-teal-700"
                >
                  {manualEnrollMutation.isPending ? "Enrolling..." : "Enroll User"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button variant="outline" className="gap-1.5" onClick={handleExportCSV}>
            <Download className="h-4 w-4" /> Export CSV
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Users className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Total Enrollments</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-2xl font-bold">{stats.active}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <BookOpen className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold">{stats.completed}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-amber-600" />
              <div>
                <p className="text-sm text-muted-foreground">Paused</p>
                <p className="text-2xl font-bold">{stats.paused}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by student name, email, or course..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="paused">Paused</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="py-6 md:py-8 lg:py-12 text-center text-muted-foreground">Loading enrollments...</div>
          ) : filteredEnrollments.length === 0 ? (
            <div className="py-6 md:py-8 lg:py-12 text-center text-muted-foreground">
              {enrollments.length === 0 ? (
                <div className="space-y-3">
                  <GraduationCap className="h-12 w-12 mx-auto text-muted-foreground/50" />
                  <p className="text-lg font-medium">No enrollments yet</p>
                  <p className="text-sm">Use the "Manual Enroll" button to add your first student.</p>
                </div>
              ) : "No enrollments match your filters"}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Course / Path</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Enrolled</TableHead>
                  <TableHead className="w-[80px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEnrollments.map((enrollment: any) => (
                  <TableRow key={`${enrollment.type}-${enrollment.id}`}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{enrollment.userName || "Unknown"}</p>
                        <p className="text-sm text-muted-foreground">{enrollment.userEmail}</p>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate">{enrollment.courseName || "N/A"}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {enrollment.type === "path" ? "Path" : "Course"}
                      </Badge>
                    </TableCell>
                    <TableCell>{getStatusBadge(enrollment.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-teal-600 rounded-full"
                            style={{ width: `${enrollment.progressPercent || 0}%` }}
                          />
                        </div>
                        <span className="text-sm text-muted-foreground">{enrollment.progressPercent || 0}%</span>
                      </div>
                    </TableCell>
                    <TableCell>{getPaymentBadge(enrollment.type === "path" ? (enrollment as any).paymentStatus || "free" : "free")}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {enrollment.enrolledAt ? new Date(enrollment.enrolledAt).toLocaleDateString() : "N/A"}
                    </TableCell>
                    <TableCell>
                      {enrollment.status !== "cancelled" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                          onClick={() => handleUnenroll(enrollment.id, enrollment.type || "course")}
                          title="Cancel enrollment"
                        >
                          <XCircle className="h-4 w-4" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
