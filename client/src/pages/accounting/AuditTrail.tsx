/**
 * Enhancement L — Audit Trail / Activity Log
 * Full audit log with filtering, date range, detail expansion, and summary stats
 */
import { trpc } from "@/lib/trpc";
import { useState, useMemo } from "react";
import {
  ArrowLeft, Loader2, Shield, Search, ChevronDown, ChevronRight,
  FileText, Users, CreditCard, Receipt, Settings, RefreshCw,
  Calendar, Activity
} from "lucide-react";
import { useLocation } from "wouter";
import CsvExportButton from "@/components/CsvExportButton";
import { Button } from "@/components/ui/button";

const ACTION_COLORS: Record<string, string> = {
  create: "bg-green-100 text-green-700",
  update: "bg-blue-100 text-blue-700",
  delete: "bg-red-100 text-red-700",
  auto_generate: "bg-purple-100 text-purple-700",
  status_change_Sent: "bg-amber-100 text-amber-700",
  status_change_Paid: "bg-emerald-100 text-emerald-700",
  status_change_Voided: "bg-red-100 text-red-700",
  status_change_Overdue: "bg-orange-100 text-orange-700",
  status_change_Deposited: "bg-teal-100 text-teal-700",
};

const ENTITY_ICONS: Record<string, any> = {
  Invoice: FileText,
  Customer: Users,
  Expense: CreditCard,
  Payment: Receipt,
  Settings: Settings,
  Recurring: RefreshCw,
};

function getActionColor(action: string): string {
  if (ACTION_COLORS[action]) return ACTION_COLORS[action];
  if (action.startsWith("status_change")) return "bg-amber-100 text-amber-700";
  if (action.includes("create")) return "bg-green-100 text-green-700";
  if (action.includes("delete")) return "bg-red-100 text-red-700";
  if (action.includes("update")) return "bg-blue-100 text-blue-700";
  return "bg-gray-100 dark:bg-white/[0.08] dark:backdrop-blur-md dark:border-white/15 text-gray-600";
}

function formatAction(action: string): string {
  if (action.startsWith("status_change_")) return `Status → ${action.replace("status_change_", "")}`;
  return action.charAt(0).toUpperCase() + action.slice(1).replace(/_/g, " ");
}

function parseDetails(details: string | null): Record<string, any> | null {
  if (!details) return null;
  try { return JSON.parse(details); } catch { return null; }
}

export default function AuditTrail() {
  const [, navigate] = useLocation();
  const [entityFilter, setEntityFilter] = useState("");
  const [actionFilter, setActionFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const { data: auditLog, isLoading, refetch } = trpc.audit.list.useQuery({
    limit: 200,
    entityType: entityFilter || undefined,
    action: actionFilter || undefined,
    startDate: startDate ? new Date(startDate) : undefined,
    endDate: endDate ? new Date(endDate + "T23:59:59") : undefined,
    search: searchQuery || undefined,
  });

  const items = (auditLog as any[]) || [];

  const entityTypes = useMemo(() => {
    const types = new Set<string>();
    items.forEach((a: any) => { if (a.entityType) types.add(a.entityType); });
    return Array.from(types).sort();
  }, [items]);

  const actions = useMemo(() => {
    const acts = new Set<string>();
    items.forEach((a: any) => { if (a.action) acts.add(a.action); });
    return Array.from(acts).sort();
  }, [items]);

  // Summary stats
  const stats = useMemo(() => {
    const creates = items.filter((a: any) => (a.action || "").includes("create")).length;
    const updates = items.filter((a: any) => (a.action || "").includes("update") || (a.action || "").startsWith("status_change")).length;
    const deletes = items.filter((a: any) => (a.action || "").includes("delete")).length;
    const uniqueEntities = new Set(items.map((a: any) => a.entityType)).size;
    return { creates, updates, deletes, uniqueEntities, total: items.length };
  }, [items]);

  const csvData = items.map((a: any) => ({
    date: a.createdAt ? new Date(a.createdAt).toLocaleString("en-CA") : "",
    user: a.userName || "System",
    action: a.action || "",
    entityType: a.entityType || "",
    entityId: a.entityId || "",
    details: a.details || "",
  }));

  // Group entries by date
  const groupedByDate = useMemo(() => {
    const groups: Record<string, any[]> = {};
    items.forEach((entry: any) => {
      const dateKey = entry.createdAt
        ? new Date(entry.createdAt).toLocaleDateString("en-CA")
        : "Unknown";
      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push(entry);
    });
    return groups;
  }, [items]);

  const clearFilters = () => {
    setEntityFilter("");
    setActionFilter("");
    setSearchQuery("");
    setStartDate("");
    setEndDate("");
  };

  const hasFilters = entityFilter || actionFilter || searchQuery || startDate || endDate;

  return (
    <div className="p-6 max-w-[1100px] mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/settings")} className="p-1 hover:bg-gray-100 dark:bg-white/[0.08] dark:backdrop-blur-md dark:border-white/15 rounded">
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Audit Trail</h1>
            <p className="text-sm text-gray-500">Track all changes made to your books for compliance and accountability</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            <RefreshCw size={14} className="mr-1" /> Refresh
          </Button>
          <CsvExportButton data={csvData} filename="audit-trail" columns={[
            { key: "date", label: "Date" },
            { key: "user", label: "User" },
            { key: "action", label: "Action" },
            { key: "entityType", label: "Entity Type" },
            { key: "entityId", label: "Entity ID" },
            { key: "details", label: "Details" },
          ]} />
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        <div className="bg-white dark:bg-white/[0.08] dark:backdrop-blur-md rounded-lg border border-gray-200 dark:border-white/15 dark:border-white/15 p-3 text-center">
          <div className="text-2xl font-bold text-gray-800">{stats.total}</div>
          <div className="text-xs text-gray-500">Total Events</div>
        </div>
        <div className="bg-white dark:bg-white/[0.08] dark:backdrop-blur-md rounded-lg border border-gray-200 dark:border-white/15 dark:border-white/15 p-3 text-center">
          <div className="text-2xl font-bold text-green-600">{stats.creates}</div>
          <div className="text-xs text-gray-500">Creates</div>
        </div>
        <div className="bg-white dark:bg-white/[0.08] dark:backdrop-blur-md rounded-lg border border-gray-200 dark:border-white/15 dark:border-white/15 p-3 text-center">
          <div className="text-2xl font-bold text-blue-600">{stats.updates}</div>
          <div className="text-xs text-gray-500">Updates</div>
        </div>
        <div className="bg-white dark:bg-white/[0.08] dark:backdrop-blur-md rounded-lg border border-gray-200 dark:border-white/15 dark:border-white/15 p-3 text-center">
          <div className="text-2xl font-bold text-red-600">{stats.deletes}</div>
          <div className="text-xs text-gray-500">Deletes</div>
        </div>
        <div className="bg-white dark:bg-white/[0.08] dark:backdrop-blur-md rounded-lg border border-gray-200 dark:border-white/15 dark:border-white/15 p-3 text-center">
          <div className="text-2xl font-bold text-purple-600">{stats.uniqueEntities}</div>
          <div className="text-xs text-gray-500">Entity Types</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-white/[0.08] dark:backdrop-blur-md rounded-lg border border-gray-200 dark:border-white/15 dark:border-white/15 p-4 mb-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              className="w-full pl-8 px-3 py-2 border border-gray-300 rounded-md text-sm"
              placeholder="Search audit log..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
          <select className="px-3 py-2 border border-gray-300 rounded-md text-sm w-40" value={entityFilter} onChange={e => setEntityFilter(e.target.value)}>
            <option value="">All Entities</option>
            {entityTypes.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <select className="px-3 py-2 border border-gray-300 rounded-md text-sm w-40" value={actionFilter} onChange={e => setActionFilter(e.target.value)}>
            <option value="">All Actions</option>
            {actions.map(a => <option key={a} value={a}>{formatAction(a)}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Calendar size={14} className="text-gray-400" />
            <input
              type="date"
              className="px-3 py-1.5 border border-gray-300 rounded-md text-sm"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              placeholder="Start date"
            />
            <span className="text-gray-400 text-sm">to</span>
            <input
              type="date"
              className="px-3 py-1.5 border border-gray-300 rounded-md text-sm"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
              placeholder="End date"
            />
          </div>
          {hasFilters && (
            <button className="text-sm text-sky-600 hover:underline" onClick={clearFilters}>
              Clear all filters
            </button>
          )}
          <div className="ml-auto text-xs text-gray-400">
            Showing {items.length} entries
          </div>
        </div>
      </div>

      {/* Audit Log */}
      {isLoading ? (
        <div className="flex justify-center py-6 md:py-8 lg:py-12"><Loader2 className="animate-spin text-gray-400" size={24} /></div>
      ) : items.length === 0 ? (
        <div className="bg-white dark:bg-white/[0.08] dark:backdrop-blur-md rounded-lg border border-gray-200 dark:border-white/15 dark:border-white/15 text-center py-6 md:py-8 lg:py-12">
          <Shield size={32} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500 mb-1">No audit entries found</p>
          <p className="text-sm text-gray-400">
            {hasFilters ? "Try adjusting your filters" : "Activity will appear here as changes are made"}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {Object.entries(groupedByDate).map(([date, entries]) => (
            <div key={date}>
              <div className="flex items-center gap-2 mb-2">
                <Activity size={14} className="text-gray-400" />
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">{date}</span>
                <span className="text-xs text-gray-400">({entries.length} events)</span>
              </div>
              <div className="bg-white dark:bg-white/[0.08] dark:backdrop-blur-md rounded-lg border border-gray-200 dark:border-white/15 dark:border-white/15 overflow-hidden">
                {entries.map((entry: any) => {
                  const EntityIcon = ENTITY_ICONS[entry.entityType] || FileText;
                  const isExpanded = expandedId === entry.id;
                  const details = parseDetails(entry.details);

                  return (
                    <div key={entry.id} className="border-b border-gray-100 dark:border-white/15 last:border-0">
                      <div
                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 dark:bg-white/[0.08] dark:backdrop-blur-md cursor-pointer"
                        onClick={() => setExpandedId(isExpanded ? null : entry.id)}
                      >
                        <div className="w-7 h-7 rounded-full bg-gray-100 dark:bg-white/[0.08] dark:backdrop-blur-md dark:border-white/15 flex items-center justify-center flex-shrink-0">
                          <EntityIcon size={14} className="text-gray-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${getActionColor(entry.action || "")}`}>
                              {formatAction(entry.action || "")}
                            </span>
                            <span className="text-sm text-gray-700 dark:text-muted-foreground font-medium">
                              {entry.entityType}{entry.entityId ? ` #${entry.entityId}` : ""}
                            </span>
                          </div>
                        </div>
                        <span className="text-xs text-gray-500 whitespace-nowrap">
                          {entry.userName || "System"}
                        </span>
                        <span className="text-xs text-gray-400 whitespace-nowrap">
                          {entry.createdAt ? new Date(entry.createdAt).toLocaleTimeString("en-CA", { hour: "2-digit", minute: "2-digit" }) : "—"}
                        </span>
                        {details ? (
                          isExpanded ? <ChevronDown size={14} className="text-gray-400" /> : <ChevronRight size={14} className="text-gray-400" />
                        ) : <div className="w-3.5" />}
                      </div>

                      {/* Expanded Details */}
                      {isExpanded && details && (
                        <div className="px-4 py-3 bg-gray-50 dark:bg-white/[0.08] dark:backdrop-blur-md border-t border-gray-100">
                          <div className="text-xs font-bold text-gray-500 uppercase mb-2">Details</div>
                          <div className="grid grid-cols-2 gap-2">
                            {Object.entries(details).map(([key, value]) => (
                              <div key={key} className="flex items-start gap-2">
                                <span className="text-xs text-gray-500 font-medium capitalize">{key.replace(/_/g, " ")}:</span>
                                <span className="text-xs text-gray-700">
                                  {Array.isArray(value) ? value.join(", ") : String(value)}
                                </span>
                              </div>
                            ))}
                          </div>
                          {entry.ipAddress && (
                            <div className="mt-2 text-xs text-gray-400">IP: {entry.ipAddress}</div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
