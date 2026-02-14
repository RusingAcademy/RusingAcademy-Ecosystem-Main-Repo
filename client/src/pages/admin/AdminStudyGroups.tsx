
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { UsersRound, Users, Shield, BarChart3, Plus, Edit, Trash2, MoreHorizontal } from "lucide-react";

// TODO: Replace with tRPC router when available
// import { trpc } from "@/lib/trpc";

const AdminStudyGroups = () => {
  // Mock Data using useState
  const [stats, setStats] = useState({
    totalGroups: 120,
    totalMembers: 1500,
    activeGroups: 85,
    avgGroupSize: 12.5,
  });

  const [groups, setGroups] = useState([
    { id: "1", name: "B2 Intermediate Prep", description: "Focus on oral proficiency for the SLE.", memberCount: 15, cefrLevel: "B2", status: "active" },
    { id: "2", name: "C1 Advanced Grammar", description: "Deep dive into complex grammar structures.", memberCount: 8, cefrLevel: "C1", status: "active" },
    { id: "3", name: "A2 Beginner's Circle", description: "For those starting their language journey.", memberCount: 22, cefrLevel: "A2", status: "active" },
    { id: "4", name: "Reading Comprehension Club", description: "Archived group for reading practice.", memberCount: 10, cefrLevel: "B1", status: "archived" },
  ]);

  const [members, setMembers] = useState([
    { id: "m1", name: "Alice Johnson", email: "alice@example.com", group: "B2 Intermediate Prep", role: "Member", joined: "2023-10-15" },
    { id: "m2", name: "Bob Williams", email: "bob@example.com", group: "B2 Intermediate Prep", role: "Moderator", joined: "2023-09-01" },
    { id: "m3", name: "Charlie Brown", email: "charlie@example.com", group: "C1 Advanced Grammar", role: "Member", joined: "2024-01-20" },
    { id: "m4", name: "Diana Miller", email: "diana@example.com", group: "A2 Beginner's Circle", role: "Member", joined: "2024-02-01" },
    { id: "m5", name: "Ethan Davis", email: "ethan@example.com", group: "A2 Beginner's Circle", role: "Member", joined: "2024-02-05" },
  ]);

  const [settings, setSettings] = useState({
    maxGroupSize: 25,
    allowUserCreation: false,
    activityRequirementDays: 30,
  });

  // TODO: Add tRPC mutations for create, update, delete
  // const createGroup = trpc.admin.createStudyGroup.useMutation();
  // const updateGroup = trpc.admin.updateStudyGroup.useMutation();
  // const deleteGroup = trpc.admin.deleteStudyGroup.useMutation();

  const handleAddGroup = () => {
    toast.success("New group created!", { description: "The new study group has been added successfully." });
    // TODO: Replace with actual tRPC call
    // createGroup.mutate({ ... });
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="bg-primary/10 p-3 rounded-lg">
            <UsersRound className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Study Groups</h1>
            <p className="text-muted-foreground">Admin panel to manage study groups.</p>
          </div>
        </div>
        <Button onClick={handleAddGroup}>
          <Plus className="mr-2 h-4 w-4" /> Create Group
        </Button>
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="groups">Groups</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Groups</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalGroups}</div>
                <p className="text-xs text-muted-foreground">+5 since last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Members</CardTitle>
                <UsersRound className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalMembers}</div>
                <p className="text-xs text-muted-foreground">+50 since last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Groups</CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.activeGroups}</div>
                <p className="text-xs text-muted-foreground">{Math.round((stats.activeGroups / stats.totalGroups) * 100)}% of total</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg. Group Size</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.avgGroupSize}</div>
                <p className="text-xs text-muted-foreground">Stable over the last quarter</p>
              </CardContent>
            </Card>
          </div>
          {/* TODO: Add more charts and detailed stats */}
        </TabsContent>

        <TabsContent value="groups" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Manage Groups</CardTitle>
              <CardDescription>CRUD table of study groups with their details.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Members</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CEFR Level</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th scope="col" className="relative px-6 py-3">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {/* TODO: Replace with data from tRPC query */}
                    {groups.map((group) => (
                      <tr key={group.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{group.name}</div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">{group.description}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{group.memberCount}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge variant="secondary">{group.cefrLevel}</Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge variant={group.status === "active" ? "default" : "outline"}>
                            {group.status}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="text-red-500">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {groups.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <Users className="mx-auto h-12 w-12" />
                  <h3 className="mt-2 text-sm font-medium">No study groups found</h3>
                  <p className="mt-1 text-sm">Get started by creating a new group.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="members" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Manage Members</CardTitle>
              <CardDescription>Manage group membership and promote moderators.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Group</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                      <th scope="col" className="relative px-6 py-3">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {/* TODO: Replace with data from tRPC query */}
                    {members.map((member) => (
                      <tr key={member.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{member.name}</div>
                          <div className="text-sm text-gray-500">{member.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{member.group}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge variant={member.role === "Moderator" ? "destructive" : "secondary"}>{member.role}</Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{member.joined}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="text-red-500">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Group Settings</CardTitle>
              <CardDescription>Configure rules for study group creation and activity.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <label htmlFor="maxGroupSize" className="font-medium">Maximum Group Size</label>
                  <p className="text-sm text-muted-foreground">Set the maximum number of members per group.</p>
                </div>
                <Input id="maxGroupSize" type="number" className="w-24" value={settings.maxGroupSize} onChange={(e) => setSettings({...settings, maxGroupSize: parseInt(e.target.value, 10)})} />
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <label htmlFor="allowUserCreation" className="font-medium">Allow User Creation</label>
                  <p className="text-sm text-muted-foreground">Allow any user to create a new study group.</p>
                </div>
                <Checkbox id="allowUserCreation" checked={settings.allowUserCreation} onCheckedChange={(checked) => setSettings({...settings, allowUserCreation: !!checked})} />
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <label htmlFor="activityRequirementDays" className="font-medium">Activity Requirement (Days)</label>
                  <p className="text-sm text-muted-foreground">Automatically archive groups after a period of inactivity.</p>
                </div>
                <Input id="activityRequirementDays" type="number" className="w-24" value={settings.activityRequirementDays} onChange={(e) => setSettings({...settings, activityRequirementDays: parseInt(e.target.value, 10)})} />
              </div>
              <div className="flex justify-end mt-6">
                <Button onClick={() => toast.success("Settings saved!")}>Save Settings</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminStudyGroups;
