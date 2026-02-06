import { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Users, Search, Download, Shield, UserCheck, GraduationCap, MoreHorizontal, ChevronLeft, ChevronRight } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export default function UsersRoles() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [page, setPage] = useState(1);
  const perPage = 20;

  const { data, isLoading, refetch } = trpc.admin.getAllUsers.useQuery();
  const updateRole = trpc.admin.updateUserRole.useMutation({
    onSuccess: () => { toast("Role updated"); refetch(); },
    onError: (e: any) => toast.error(e.message),
  });

  const rawUsers = Array.isArray(data) ? data : ((data as any)?.users ?? []);
  const users = rawUsers as any[];
  const filtered = useMemo(() => {
    let result = users;
    if (search) {
      const s = search.toLowerCase();
      result = result.filter((u: any) => u.name?.toLowerCase().includes(s) || u.email?.toLowerCase().includes(s));
    }
    if (roleFilter !== "all") result = result.filter((u: any) => u.role === roleFilter);
    return result;
  }, [users, search, roleFilter]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);
  const stats = useMemo(() => ({
    total: users.length,
    admins: users.filter((u: any) => u.role === "admin").length,
    coaches: users.filter((u: any) => u.role === "coach").length,
    learners: users.filter((u: any) => u.role === "learner").length,
  }), [users]);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Users & Roles</h1>
          <p className="text-sm text-muted-foreground">Manage all users, assign roles, and control access.</p>
        </div>
        <Button size="sm" variant="outline" className="gap-1.5" onClick={() => toast("Export coming soon")}>
          <Download className="h-4 w-4" /> Export CSV
        </Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Users", value: stats.total, icon: Users, color: "#2563eb" },
          { label: "Admins", value: stats.admins, icon: Shield, color: "#dc2626" },
          { label: "Coaches", value: stats.coaches, icon: GraduationCap, color: "#7c3aed" },
          { label: "Learners", value: stats.learners, icon: UserCheck, color: "#059669" },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="p-4 flex items-center gap-3">
              <s.icon className="h-5 w-5 shrink-0" style={{ color: s.color }} />
              <div><p className="text-xl font-bold">{s.value}</p><p className="text-xs text-muted-foreground">{s.label}</p></div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search by name or email..." className="pl-9" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
            </div>
            <Select value={roleFilter} onValueChange={(v) => { setRoleFilter(v); setPage(1); }}>
              <SelectTrigger className="w-40"><SelectValue placeholder="All Roles" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="coach">Coach</SelectItem>
                <SelectItem value="learner">Learner</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-3">{[1,2,3,4,5].map(i => <Skeleton key={i} className="h-12 w-full" />)}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b bg-muted/30">
                  <th className="text-left p-3 font-medium">User</th>
                  <th className="text-left p-3 font-medium">Email</th>
                  <th className="text-left p-3 font-medium">Role</th>
                  <th className="text-left p-3 font-medium">Joined</th>
                  <th className="text-right p-3 font-medium">Actions</th>
                </tr></thead>
                <tbody>
                  {paginated.map((user: any) => (
                    <tr key={user.id} className="border-b hover:bg-muted/20 transition-colors">
                      <td className="p-3 font-medium">{user.name || "—"}</td>
                      <td className="p-3 text-muted-foreground">{user.email}</td>
                      <td className="p-3"><Badge variant={user.role === "admin" ? "destructive" : user.role === "coach" ? "default" : "secondary"}>{user.role}</Badge></td>
                      <td className="p-3 text-muted-foreground">{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "—"}</td>
                      <td className="p-3 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => updateRole.mutate({ userId: user.id, role: "admin" })}>Make Admin</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => updateRole.mutate({ userId: user.id, role: "coach" })}>Make Coach</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => updateRole.mutate({ userId: user.id, role: "learner" })}>Make Learner</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                  {paginated.length === 0 && <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">No users found</td></tr>}
                </tbody>
              </table>
            </div>
          )}
          {totalPages > 1 && (
            <div className="flex items-center justify-between p-3 border-t">
              <p className="text-xs text-muted-foreground">Showing {(page-1)*perPage+1}–{Math.min(page*perPage, filtered.length)} of {filtered.length}</p>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8" disabled={page === 1} onClick={() => setPage(p => p - 1)}><ChevronLeft className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" className="h-8 w-8" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}><ChevronRight className="h-4 w-4" /></Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
