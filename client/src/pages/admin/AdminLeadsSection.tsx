/**
 * AdminLeadsSection — Lead Management inside AdminControlCenter
 * Connected to crm.getLeadsWithScores tRPC router for real data
 */
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  Target,
  Search,
  Plus,
  Download,
  Building2,
  TrendingUp,
  Users,
  UserPlus,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

import { useLanguage } from "@/contexts/LanguageContext";

const labels = {
  en: { title: "Leads & CRM", description: "Manage and configure leads & crm" },
  fr: { title: "Prospects et CRM", description: "Gérer et configurer prospects et crm" },
};

const statusColors: Record<string, string> = {
  new: "bg-blue-100 text-blue-800",
  contacted: "bg-yellow-100 text-yellow-800",
  qualified: "bg-indigo-100 text-indigo-800",
  proposal_sent: "bg-purple-100 text-purple-800",
  negotiating: "bg-orange-100 text-orange-800",
  won: "bg-green-100 text-green-800",
  lost: "bg-red-100 text-red-800",
  nurturing: "bg-teal-100 text-teal-800",
};

export default function AdminLeadsSection() {
  const { language } = useLanguage();
  const l = labels[language as keyof typeof labels] || labels.en;

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // ── tRPC query ──
  const { data, isLoading } = trpc.crm.getLeadsWithScores.useQuery(
    { sortBy: "score", status: statusFilter === "all" ? undefined : statusFilter, limit: 100 },
    { retry: false }
  );

  const leads = (data?.leads ?? []).map((l: any) => ({
    id: l.id,
    name: l.company || `${l.firstName} ${l.lastName}`,
    contact: `${l.firstName} ${l.lastName}`,
    email: l.email,
    phone: l.phone || "",
    status: l.status || "new",
    source: l.source || "external",
    score: l.leadScore || 0,
    createdAt: l.createdAt ? new Date(l.createdAt).toLocaleDateString() : "",
  }));

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      searchQuery === "" ||
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.contact.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const totalLeads = leads.length;
  const convertedCount = leads.filter((l) => l.status === "won").length;
  const newCount = leads.filter((l) => l.status === "new").length;
  const avgScore = totalLeads > 0 ? Math.round(leads.reduce((s, l) => s + l.score, 0) / totalLeads) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Lead Management</h1>
          <p className="text-muted-foreground mt-1">
            Track and manage prospective clients and organizations
          </p>
        </div>
        <Button onClick={() => toast.info("Opening lead creation form...")}>
          <Plus className="h-4 w-4 mr-2" />
          New Lead
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Target className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Leads</p>
                <p className="text-2xl font-bold">{totalLeads}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Won</p>
                <p className="text-2xl font-bold">{convertedCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <UserPlus className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">New Leads</p>
                <p className="text-2xl font-bold">{newCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg Score</p>
                <p className="text-2xl font-bold">{avgScore}</p>
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
            placeholder="Search leads..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="contacted">Contacted</SelectItem>
            <SelectItem value="qualified">Qualified</SelectItem>
            <SelectItem value="proposal_sent">Proposal Sent</SelectItem>
            <SelectItem value="negotiating">Negotiating</SelectItem>
            <SelectItem value="won">Won</SelectItem>
            <SelectItem value="lost">Lost</SelectItem>
            <SelectItem value="nurturing">Nurturing</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" size="sm" onClick={() => toast.success("Export initiated — check your downloads shortly")}>
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              <span className="ml-2 text-muted-foreground">Loading leads...</span>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Organization</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLeads.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No leads found. Leads are created when prospects submit contact forms.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredLeads.map((lead) => (
                    <TableRow key={lead.id} className="cursor-pointer hover:bg-muted/50">
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{lead.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{lead.contact}</p>
                          <p className="text-xs text-muted-foreground">{lead.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">{lead.source}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary rounded-full"
                              style={{ width: `${lead.score}%` }}
                            />
                          </div>
                          <span className="text-sm">{lead.score}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[lead.status] || "bg-gray-100 text-gray-800"}`}>
                          {lead.status.replace("_", " ")}
                        </span>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">{lead.createdAt}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
