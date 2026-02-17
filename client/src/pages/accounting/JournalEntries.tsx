/*
 * QuickBooks Authentic — Journal Entries List Page
 */
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { Plus, Loader2, BookOpen } from "lucide-react";
import { toast } from "sonner";

export default function JournalEntries() {
  const [, navigate] = useLocation();
  const { data: entries, isLoading } = trpc.journalEntries.list.useQuery();

  return (
    <div className="p-6 max-w-[1100px] mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Journal Entries</h1>
        <button className="qb-btn-green flex items-center gap-1" onClick={() => toast("Feature coming soon")}>
          <Plus size={14} /> New Journal Entry
        </button>
      </div>

      <div className="qb-card">
        {isLoading ? (
          <div className="flex items-center justify-center py-6 md:py-8 lg:py-12">
            <Loader2 className="animate-spin text-gray-400" size={24} />
          </div>
        ) : (entries as any[])?.length ? (
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200 dark:border-slate-700 dark:border-slate-700">
                <th className="text-left text-xs font-bold text-gray-500 uppercase pb-2">Date</th>
                <th className="text-left text-xs font-bold text-gray-500 uppercase pb-2">Entry #</th>
                <th className="text-left text-xs font-bold text-gray-500 uppercase pb-2">Memo</th>
                <th className="text-center text-xs font-bold text-gray-500 uppercase pb-2">Adjusting</th>
              </tr>
            </thead>
            <tbody>
              {(entries as any[]).map((entry: any) => (
                <tr key={entry.id} className="border-b border-gray-100 dark:border-slate-700 hover:bg-gray-50 dark:bg-slate-900 cursor-pointer">
                  <td className="py-3 text-sm text-gray-800">{new Date(entry.entryDate).toLocaleDateString("en-CA")}</td>
                  <td className="py-3 text-sm text-sky-600">{entry.entryNumber || `JE-${entry.id}`}</td>
                  <td className="py-3 text-sm text-gray-600">{entry.memo || "—"}</td>
                  <td className="py-3 text-center">
                    {entry.isAdjusting && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700">Adj</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center py-6 md:py-8 lg:py-12">
            <BookOpen size={48} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500 mb-1">No journal entries yet</p>
            <p className="text-sm text-gray-400">Create your first journal entry to get started</p>
          </div>
        )}
      </div>
    </div>
  );
}
