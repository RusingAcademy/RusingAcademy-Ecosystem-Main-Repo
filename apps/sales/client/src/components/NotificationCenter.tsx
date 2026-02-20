/**
 * NotificationCenter — In-app notification bell with dropdown
 * Surfaces overdue invoices, upcoming recurring transactions, and low balance alerts
 */
import { useState, useRef, useEffect } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import {
  Bell, AlertTriangle, Clock, Wallet, X,
  ChevronRight, FileText, RefreshCw
} from "lucide-react";

type AlertItem = {
  id: number;
  type: string;
  title: string;
  description: string;
  date: Date | null;
  severity: string;
  link: string;
};

export default function NotificationCenter() {
  const [open, setOpen] = useState(false);
  const [dismissed, setDismissed] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem("qb-dismissed-alerts");
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch { return new Set(); }
  });
  const ref = useRef<HTMLDivElement>(null);

  const { data, isLoading, refetch } = trpc.notifications.getAlerts.useQuery(undefined, {
    refetchInterval: 60000, // Refresh every minute
    staleTime: 30000,
  });

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const dismiss = (alertKey: string) => {
    const updated = new Set(Array.from(dismissed));
    updated.add(alertKey);
    setDismissed(updated);
    localStorage.setItem("qb-dismissed-alerts", JSON.stringify(Array.from(updated)));
  };

  const clearAll = () => {
    const allKeys = getAllAlerts().map(a => `${a.type}-${a.id}`);
    const arr = Array.from(dismissed);
    const updated = new Set(arr.concat(allKeys));
    setDismissed(updated);
    localStorage.setItem("qb-dismissed-alerts", JSON.stringify(Array.from(updated)));
  };

  const getAllAlerts = (): AlertItem[] => {
    if (!data) return [];
    return [
      ...(data.overdue || []),
      ...(data.upcoming || []),
      ...(data.lowBalance || []),
    ];
  };

  const visibleAlerts = getAllAlerts().filter(a => !dismissed.has(`${a.type}-${a.id}`));
  const alertCount = visibleAlerts.length;

  const severityIcon = (severity: string) => {
    switch (severity) {
      case "high": return <AlertTriangle size={14} className="text-red-500" />;
      case "medium": return <Clock size={14} className="text-amber-500" />;
      case "warning": return <Wallet size={14} className="text-orange-500" />;
      default: return <Bell size={14} className="text-gray-500" />;
    }
  };

  const severityBg = (severity: string) => {
    switch (severity) {
      case "high": return "bg-red-50 border-red-100";
      case "medium": return "bg-amber-50 border-amber-100";
      case "warning": return "bg-orange-50 border-orange-100";
      default: return "bg-gray-50 border-gray-100";
    }
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "";
    const d = new Date(date);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days < 0) return `in ${Math.abs(days)} day${Math.abs(days) !== 1 ? "s" : ""}`;
    if (days === 0) return "today";
    if (days === 1) return "yesterday";
    if (days < 7) return `${days} days ago`;
    return d.toLocaleDateString("en-CA", { month: "short", day: "numeric" });
  };

  return (
    <div className="relative" ref={ref}>
      <button
        className="p-2 rounded-full hover:bg-gray-100 relative"
        onClick={() => setOpen(!open)}
        aria-label="Notifications"
      >
        <Bell size={20} className="text-gray-600" />
        {alertCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none">
            {alertCount > 9 ? "9+" : alertCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 w-96 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 overflow-hidden">
          {/* Header */}
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell size={16} className="text-[#0077C5]" />
              <span className="text-sm font-semibold text-gray-700">Notifications</span>
              {alertCount > 0 && (
                <span className="text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full font-medium">
                  {alertCount}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => refetch()}
                className="p-1 hover:bg-gray-200 rounded text-gray-400 hover:text-gray-600"
                title="Refresh"
              >
                <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} />
              </button>
              {alertCount > 0 && (
                <button
                  onClick={clearAll}
                  className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1 rounded hover:bg-gray-200"
                >
                  Clear all
                </button>
              )}
            </div>
          </div>

          {/* Alert Groups */}
          <div className="max-h-[400px] overflow-y-auto">
            {isLoading ? (
              <div className="p-8 text-center">
                <RefreshCw size={20} className="animate-spin text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">Loading notifications...</p>
              </div>
            ) : visibleAlerts.length === 0 ? (
              <div className="p-8 text-center">
                <Bell size={24} className="text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500">All caught up!</p>
                <p className="text-xs text-gray-400 mt-1">No pending alerts right now</p>
              </div>
            ) : (
              <>
                {/* Overdue Invoices */}
                {data?.overdue && data.overdue.filter(a => !dismissed.has(`${a.type}-${a.id}`)).length > 0 && (
                  <div>
                    <div className="px-4 py-2 bg-red-50/50 border-b border-red-100/50">
                      <span className="text-xs font-bold text-red-600 uppercase tracking-wider flex items-center gap-1">
                        <AlertTriangle size={12} /> Overdue ({data.overdue.filter(a => !dismissed.has(`${a.type}-${a.id}`)).length})
                      </span>
                    </div>
                    {data.overdue
                      .filter(a => !dismissed.has(`${a.type}-${a.id}`))
                      .map(alert => (
                        <AlertRow
                          key={`${alert.type}-${alert.id}`}
                          alert={alert}
                          severityIcon={severityIcon}
                          severityBg={severityBg}
                          formatDate={formatDate}
                          onDismiss={() => dismiss(`${alert.type}-${alert.id}`)}
                          onClose={() => setOpen(false)}
                        />
                      ))}
                  </div>
                )}

                {/* Upcoming Recurring */}
                {data?.upcoming && data.upcoming.filter(a => !dismissed.has(`${a.type}-${a.id}`)).length > 0 && (
                  <div>
                    <div className="px-4 py-2 bg-amber-50/50 border-b border-amber-100/50">
                      <span className="text-xs font-bold text-amber-600 uppercase tracking-wider flex items-center gap-1">
                        <Clock size={12} /> Upcoming ({data.upcoming.filter(a => !dismissed.has(`${a.type}-${a.id}`)).length})
                      </span>
                    </div>
                    {data.upcoming
                      .filter(a => !dismissed.has(`${a.type}-${a.id}`))
                      .map(alert => (
                        <AlertRow
                          key={`${alert.type}-${alert.id}`}
                          alert={alert}
                          severityIcon={severityIcon}
                          severityBg={severityBg}
                          formatDate={formatDate}
                          onDismiss={() => dismiss(`${alert.type}-${alert.id}`)}
                          onClose={() => setOpen(false)}
                        />
                      ))}
                  </div>
                )}

                {/* Low Balance */}
                {data?.lowBalance && data.lowBalance.filter(a => !dismissed.has(`${a.type}-${a.id}`)).length > 0 && (
                  <div>
                    <div className="px-4 py-2 bg-orange-50/50 border-b border-orange-100/50">
                      <span className="text-xs font-bold text-orange-600 uppercase tracking-wider flex items-center gap-1">
                        <Wallet size={12} /> Low Balance ({data.lowBalance.filter(a => !dismissed.has(`${a.type}-${a.id}`)).length})
                      </span>
                    </div>
                    {data.lowBalance
                      .filter(a => !dismissed.has(`${a.type}-${a.id}`))
                      .map(alert => (
                        <AlertRow
                          key={`${alert.type}-${alert.id}`}
                          alert={alert}
                          severityIcon={severityIcon}
                          severityBg={severityBg}
                          formatDate={formatDate}
                          onDismiss={() => dismiss(`${alert.type}-${alert.id}`)}
                          onClose={() => setOpen(false)}
                        />
                      ))}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-2.5 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
            <Link
              href="/reports"
              className="text-xs text-[#0077C5] hover:underline font-medium"
              onClick={() => setOpen(false)}
            >
              View all reports
            </Link>
            <span className="text-[10px] text-gray-400">Auto-refreshes every minute</span>
          </div>
        </div>
      )}
    </div>
  );
}

function AlertRow({
  alert,
  severityIcon,
  severityBg,
  formatDate,
  onDismiss,
  onClose,
}: {
  alert: AlertItem;
  severityIcon: (s: string) => React.ReactNode;
  severityBg: (s: string) => string;
  formatDate: (d: Date | null) => string;
  onDismiss: () => void;
  onClose: () => void;
}) {
  return (
    <div className={`px-4 py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors group`}>
      <div className="flex items-start gap-3">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${severityBg(alert.severity)}`}>
          {severityIcon(alert.severity)}
        </div>
        <div className="flex-1 min-w-0">
          <Link
            href={alert.link}
            className="text-sm font-medium text-gray-800 hover:text-[#0077C5] block truncate"
            onClick={onClose}
          >
            {alert.title}
          </Link>
          <p className="text-xs text-gray-500 truncate">{alert.description}</p>
          <p className="text-[10px] text-gray-400 mt-0.5">{formatDate(alert.date)}</p>
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => { e.stopPropagation(); onDismiss(); }}
            className="p-1 hover:bg-gray-200 rounded text-gray-400 hover:text-gray-600"
            title="Dismiss"
          >
            <X size={12} />
          </button>
          <Link
            href={alert.link}
            onClick={onClose}
            className="p-1 hover:bg-gray-200 rounded text-gray-400 hover:text-[#0077C5]"
            title="View"
          >
            <ChevronRight size={12} />
          </Link>
        </div>
      </div>
    </div>
  );
}
