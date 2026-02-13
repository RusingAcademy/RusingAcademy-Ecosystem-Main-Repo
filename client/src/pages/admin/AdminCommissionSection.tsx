/**
 * AdminCommissionSection — Coach Commission management inside AdminControlCenter
 * 
 * Wraps the core commission UI from AdminCommission.tsx, stripping the
 * DashboardLayout wrapper so it renders inside AdminLayout.
 */
import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DollarSign,
  Users,
  TrendingUp,
  Clock,
  Settings,
  Download,
  Search,
} from "lucide-react";
import { toast } from "sonner";

// Mock data for commission management
const mockCommissions = [
  { id: 1, coachName: "Marie Dupont", sessions: 24, rate: 70, earned: 1680, status: "paid" },
  { id: 2, coachName: "Jean Tremblay", sessions: 18, rate: 65, earned: 1170, status: "pending" },
  { id: 3, coachName: "Sophie Martin", sessions: 31, rate: 75, earned: 2325, status: "paid" },
  { id: 4, coachName: "Pierre Leblanc", sessions: 12, rate: 60, earned: 720, status: "processing" },
  { id: 5, coachName: "Isabelle Roy", sessions: 22, rate: 70, earned: 1540, status: "paid" },
];

export default function AdminCommissionSection() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [defaultRate, setDefaultRate] = useState(70);
  const [autoApprove, setAutoApprove] = useState(false);

  const filteredCommissions = mockCommissions.filter(c =>
    c.coachName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalEarned = mockCommissions.reduce((sum, c) => sum + c.earned, 0);
  const totalSessions = mockCommissions.reduce((sum, c) => sum + c.sessions, 0);
  const avgRate = Math.round(mockCommissions.reduce((sum, c) => sum + c.rate, 0) / mockCommissions.length);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Coach Commission</h1>
        <p className="text-muted-foreground mt-1">
          Manage commission rates, payouts, and coach earnings
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <DollarSign className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Earned</p>
                <p className="text-2xl font-bold">${totalEarned.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Coaches</p>
                <p className="text-2xl font-bold">{mockCommissions.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <TrendingUp className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Sessions</p>
                <p className="text-2xl font-bold">{totalSessions}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                <Clock className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg Rate</p>
                <p className="text-2xl font-bold">${avgRate}/session</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Commission Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Commission Records</CardTitle>
              <CardDescription>Track coach earnings and payout status</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search coaches..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-64"
                />
              </div>
              <Button variant="outline" size="sm" onClick={() => toast.info("Export coming soon")}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Coach</TableHead>
                <TableHead>Sessions</TableHead>
                <TableHead>Rate</TableHead>
                <TableHead>Earned</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCommissions.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium">{c.coachName}</TableCell>
                  <TableCell>{c.sessions}</TableCell>
                  <TableCell>${c.rate}/session</TableCell>
                  <TableCell className="font-semibold">${c.earned.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge variant={c.status === "paid" ? "default" : c.status === "pending" ? "secondary" : "outline"}>
                      {c.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Commission Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Default Commission Rate ($/session)</Label>
              <p className="text-sm text-muted-foreground">Applied to new coaches</p>
            </div>
            <Input
              type="number"
              value={defaultRate}
              onChange={(e) => setDefaultRate(Number(e.target.value))}
              className="w-24"
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>Auto-approve Payouts</Label>
              <p className="text-sm text-muted-foreground">Automatically approve payouts under $500</p>
            </div>
            <Switch checked={autoApprove} onCheckedChange={setAutoApprove} />
          </div>
          <Button onClick={() => toast.success("Commission settings saved")} className="mt-4">
            Save Settings
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
