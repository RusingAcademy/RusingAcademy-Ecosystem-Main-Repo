import { trpc } from "@/lib/trpc";
import { ArrowLeft, Shield, Clock } from "lucide-react";
import { Link } from "wouter";

const actionColors: Record<string, string> = {
  create: "bg-green-100 text-green-700",
  update: "bg-blue-100 text-blue-700",
  delete: "bg-red-100 text-red-700",
  login: "bg-purple-100 text-purple-700",
  export: "bg-yellow-100 text-yellow-700",
};

export default function AuditLog() {
  const { data: logs, isLoading } = trpc.audit.list.useQuery();

  return (
    <div className="p-6 max-w-[1200px] mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/settings">
          <button className="p-1.5 hover:bg-gray-100 dark:bg-card rounded-full">
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-800">Audit Log</h1>
          <p className="text-sm text-gray-500">Track all changes made to your books</p>
        </div>
      </div>

      <div className="bg-white dark:bg-background rounded-lg border border-gray-200 dark:border-border dark:border-border overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-border dark:border-border bg-gray-50">
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Timestamp</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">User</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Action</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Entity</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Details</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400">Loading...</td></tr>
            ) : (logs || []).length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center">
                  <Shield size={40} className="mx-auto text-gray-300 mb-3" />
                  <p className="text-gray-500 text-sm">No audit log entries yet</p>
                  <p className="text-gray-400 text-xs mt-1">Changes to your books will be tracked here</p>
                </td>
              </tr>
            ) : (
              (logs || []).map((log: any) => (
                <tr key={log.id} className="border-b border-gray-100 dark:border-border hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-600">
                    <div className="flex items-center gap-1.5">
                      <Clock size={13} className="text-gray-400" />
                      {log.createdAt ? new Date(log.createdAt).toLocaleString("en-CA") : "-"}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-800">{log.userName || `User #${log.userId}`}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${actionColors[log.action] || "bg-gray-100 dark:bg-card text-gray-600"}`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {log.entityType} {log.entityId ? `#${log.entityId}` : ""}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500 max-w-xs truncate">{log.description || "-"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
