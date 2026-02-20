import { trpc } from "@/lib/trpc";
import { ArrowLeft, Download, Printer } from "lucide-react";
import { Link } from "wouter";
import { toast } from "sonner";
import CsvExportButton from "@/components/CsvExportButton";
import { useLanguage } from "@/contexts/LanguageContext";


const labels = {
  en: { title: "General Ledger", subtitle: "Complete record of all financial transactions", account: "Account", debit: "Debit", credit: "Credit", balance: "Balance" },
  fr: { title: "Grand livre", subtitle: "Registre complet de toutes les transactions financières", account: "Compte", debit: "Débit", credit: "Crédit", balance: "Solde" },
};

export default function GeneralLedgerReport() {
  const { language } = useLanguage();
  const l = labels[language as keyof typeof labels] || labels.en;

  const { data: entries, isLoading } = trpc.reports.generalLedger.useQuery();

  const fmt = (v: string | null | undefined) =>
    `$${parseFloat(v || "0").toLocaleString("en-CA", { minimumFractionDigits: 2 })}`;

  // Group by account
  const grouped = (entries || []).reduce((acc: Record<string, any[]>, e: any) => {
    const name = e.accountName || "Unknown";
    if (!acc[name]) acc[name] = [];
    acc[name].push(e);
    return acc;
  }, {} as Record<string, any[]>);

  return (
    <div className="p-6 max-w-[1200px] mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/reports">
          <button aria-label="Action" className="p-1.5 hover:bg-gray-100 dark:bg-white/[0.08] dark:backdrop-blur-md dark:border-white/15 rounded-full">
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-800">General Ledger</h1>
          <p className="text-sm text-gray-500">All transactions by account</p>
        </div>
        <CsvExportButton
          data={((entries as any[]) || []).map((e: any) => ({
            date: e.entryDate ? new Date(e.entryDate).toLocaleDateString("en-CA") : "",
            account: e.accountName || "",
            entryNumber: e.entryNumber || "",
            memo: e.memo || "",
            debit: e.line?.debit || "",
            credit: e.line?.credit || "",
          }))}
          filename="general-ledger"
          columns={[
            { key: "date", label: "Date" },
            { key: "account", label: "Account" },
            { key: "entryNumber", label: "Entry #" },
            { key: "memo", label: "Memo" },
            { key: "debit", label: "Debit" },
            { key: "credit", label: "Credit" },
          ]}
          label="Export CSV"
        />
        <button onClick={() => window.print()} className="qb-btn-outline flex items-center gap-2 text-sm">
          <Printer size={14} /> Print
        </button>
      </div>

      <div className="bg-white dark:bg-white/[0.08] dark:backdrop-blur-md rounded-lg border border-gray-200 dark:border-white/15 dark:border-white/15 overflow-hidden">
        <div className="text-center py-4 border-b border-gray-200 dark:border-white/15 dark:border-white/15 bg-gray-50 dark:bg-white/[0.06] dark:backdrop-blur-sm">
          <h2 className="text-lg font-bold text-gray-800">RusingÂcademy</h2>
          <p className="text-sm text-gray-500">General Ledger</p>
        </div>

        {isLoading ? (
          <div className="px-4 py-8 text-center text-gray-400">Loading...</div>
        ) : Object.keys(grouped).length === 0 ? (
          <div className="px-4 py-8 text-center text-gray-400">No journal entries found</div>
        ) : (
          Object.entries(grouped).map(([accountName, lines]) => (
            <div key={accountName} className="border-b border-gray-200 dark:border-white/15 dark:border-white/15">
              <div className="bg-gray-50 dark:bg-white/[0.08] dark:backdrop-blur-md px-4 py-2">
                <h3 className="text-sm font-bold text-gray-700">{accountName}</h3>
              </div>
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left px-4 py-2 text-xs font-semibold text-gray-500">Date</th>
                    <th className="text-left px-4 py-2 text-xs font-semibold text-gray-500">Entry #</th>
                    <th className="text-left px-4 py-2 text-xs font-semibold text-gray-500">Memo</th>
                    <th className="text-right px-4 py-2 text-xs font-semibold text-gray-500">Debit</th>
                    <th className="text-right px-4 py-2 text-xs font-semibold text-gray-500">Credit</th>
                  </tr>
                </thead>
                <tbody>
                  {(lines as any[]).map((line: any, i: number) => (
                    <tr key={i} className="border-b border-gray-50 hover:bg-gray-50 dark:bg-white/[0.06] dark:backdrop-blur-sm">
                      <td className="px-4 py-2 text-sm text-gray-600">
                        {line.entryDate ? new Date(line.entryDate).toLocaleDateString("en-CA") : "-"}
                      </td>
                      <td className="px-4 py-2 text-sm text-sky-600">{line.entryNumber || "-"}</td>
                      <td className="px-4 py-2 text-sm text-gray-600">{line.memo || line.line?.description || "-"}</td>
                      <td className="px-4 py-2 text-sm text-right text-gray-700">
                        {parseFloat(line.line?.debit || "0") > 0 ? fmt(line.line?.debit) : ""}
                      </td>
                      <td className="px-4 py-2 text-sm text-right text-gray-700">
                        {parseFloat(line.line?.credit || "0") > 0 ? fmt(line.line?.credit) : ""}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
