import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { UsersRound, Users, Plus, Trash2, Search, RefreshCw } from "lucide-react";
import { trpc } from "@/lib/trpc";

const AdminStudyGroups = () => {
  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [newGroup, setNewGroup] = useState({ name: "", nameFr: "", description: "", descriptionFr: "", cefrLevel: "B1", maxMembers: 20 });

  const { data: groups, isLoading, refetch } = trpc.adminStudyGroups.list.useQuery({ search: search || undefined });
  const createMutation = trpc.adminStudyGroups.create.useMutation({
    onSuccess: () => { toast.success("Study group created"); refetch(); setShowCreate(false); setNewGroup({ name: "", nameFr: "", description: "", descriptionFr: "", cefrLevel: "B1", maxMembers: 20 }); },
    onError: (e) => toast.error(e.message),
  });
  const deleteMutation = trpc.adminStudyGroups.delete.useMutation({
    onSuccess: () => { toast.success("Group deleted"); refetch(); },
    onError: (e) => toast.error(e.message),
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="bg-primary/10 p-3 rounded-lg">
            <UsersRound className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Study Groups</h1>
            <p className="text-muted-foreground">Create and manage collaborative study groups for learners.</p>
          </div>
        </div>
        <Button onClick={() => setShowCreate(!showCreate)}>
          <Plus className="mr-2 h-4 w-4" /> Create Group
        </Button>
      </div>

      {showCreate && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Create New Study Group</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium">Name (EN)</label>
                <Input value={newGroup.name} onChange={e => setNewGroup({ ...newGroup, name: e.target.value })} placeholder="B2 Oral Practice Group" />
              </div>
              <div>
                <label className="text-sm font-medium">Name (FR)</label>
                <Input value={newGroup.nameFr} onChange={e => setNewGroup({ ...newGroup, nameFr: e.target.value })} placeholder="Groupe de pratique orale B2" />
              </div>
              <div>
                <label className="text-sm font-medium">Description (EN)</label>
                <Input value={newGroup.description} onChange={e => setNewGroup({ ...newGroup, description: e.target.value })} placeholder="Weekly practice sessions..." />
              </div>
              <div>
                <label className="text-sm font-medium">Description (FR)</label>
                <Input value={newGroup.descriptionFr} onChange={e => setNewGroup({ ...newGroup, descriptionFr: e.target.value })} placeholder="Sessions de pratique hebdomadaires..." />
              </div>
              <div>
                <label className="text-sm font-medium">CEFR Level</label>
                <select value={newGroup.cefrLevel} onChange={e => setNewGroup({ ...newGroup, cefrLevel: e.target.value })} className="w-full border rounded-md px-3 py-2 text-sm">
                  {["A1","A2","B1","B2","C1"].map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Max Members</label>
                <Input type="number" value={newGroup.maxMembers} onChange={e => setNewGroup({ ...newGroup, maxMembers: Number(e.target.value) })} />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button onClick={() => createMutation.mutate(newGroup)} disabled={!newGroup.name || createMutation.isPending}>
                {createMutation.isPending ? "Creating..." : "Create Group"}
              </Button>
              <Button variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="groups">
        <TabsList>
          <TabsTrigger value="groups">Groups</TabsTrigger>
        </TabsList>

        <TabsContent value="groups" className="mt-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Manage Groups</CardTitle>
                  <CardDescription>All study groups across the platform.</CardDescription>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search groups..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 w-60" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : !groups || (groups as any[]).length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Users className="mx-auto h-12 w-12 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No study groups yet</h3>
                  <p className="text-sm">Click "Create Group" to get started.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Members</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Level</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Owner</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-background divide-y divide-gray-200">
                      {(groups as any[]).map((g: any) => (
                        <tr key={g.id}>
                          <td className="px-4 py-3">
                            <div className="text-sm font-medium text-gray-900">{g.name}</div>
                            {g.nameFr && g.nameFr !== g.name && <div className="text-xs text-gray-500 italic">{g.nameFr}</div>}
                            {g.description && <div className="text-xs text-gray-400 truncate max-w-xs">{g.description}</div>}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-500">{g.memberCount ?? 0}</td>
                          <td className="px-4 py-3"><Badge variant="outline">{g.cefrLevel || "—"}</Badge></td>
                          <td className="px-4 py-3 text-sm text-gray-500">{g.ownerName || "—"}</td>
                          <td className="px-4 py-3">
                            <Badge variant={g.isActive ? "default" : "secondary"}>{g.isActive ? "Active" : "Inactive"}</Badge>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <Button variant="ghost" size="icon" className="text-red-500"
                              onClick={() => { if (confirm("Delete this group and all members?")) deleteMutation.mutate({ id: g.id }); }}
                              disabled={deleteMutation.isPending}>
                              <Trash2 className="h-4 w-4" />
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
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminStudyGroups;
