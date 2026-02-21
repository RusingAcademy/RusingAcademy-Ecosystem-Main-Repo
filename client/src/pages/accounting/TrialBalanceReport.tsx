import { trpc } from "@/lib/trpc";
import { ArrowLeft, Download, Printer } from "lucide-react";
import { Link } from "wouter";
import { toast } from "sonner";
import CsvExportButton from "@/components/CsvExportButton";
import { useLanguage } from "@/contexts/LanguageContext";


const labels = {
  en: { title: "Trial Balance", subtitle: "Verify debits equal credits", account: "Account", debit: "Debit", credit: "Credit", total: "Total" },
  fr: { title: "Balance de vérification", subtitle: "Vérifier que les débits égalent les crédits", account: "Compte", debit: "Débit", credit: "Crédit", total: "Total" },
};

export default function TrialBalanceReport() {
  const { language } = useLanguage();
  const l = labels[language as keyof typeof labels] || labels.en;

  const { data: accounts, isLoading } = trpc.reports.trialBalance.useQuery();

  const fmt = (v: string | null | undefined) =>
    `$${Math.abs(parseFloat(v || "0")).toLocaleString("en-CA", { minimumFractionDigits: 2 })}`;

  // Group accounts by type
  const grouped = (accounts || []).reduce((acc: Record<string, any[]>, a: any) => {
    const type = a.accountType || "Other";
    if (!acc[type]) acc[type] = [];
    acc[type].push(a);
    return acc;
  }, {} as Record<string, any[]>);

  const totalDebits = (accounts || []).reduce((sum: number, a: any) => {
    const bal = parseFloat(a.balance || "0");
    return sum + (bal >= 0 ? bal : 0);
  }, 0);

  const totalCredits = (accounts || []).reduce((sum: number, a: any) => {
    const bal = parseFloat(a.balance || "0");
    return sum + (bal < 0 ? Math.abs(bal) : 0);
  }, 0);

  return (
    <div className="p-6 max-w-[1000px] mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/reports">
          <button aria-label="Action" className="p-1.5 hover:bg-gray-100 dark:bg-white/[0.08] dark:backdrop-blur-md dark:border-white/15 rounded-full">
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-800">Trial Balance</h1>
          <p className="text-sm text-gray-500">As of {new Date().toLocaleDateString("en-CA")}</p>
        </div>
        <CsvExportButton
          data={((accounts as any[]) || []).map((a: any) => ({
            accountName: a.name || "",
            accountType: a.accountType || "",
            debit: parseFloat(a.balance || "0") >= 0 ? Math.abs(parseFloat(a.balance || "0")).toFixed(2) : "",
            credit: parseFloat(a.balance || "0") < 0 ? Math.abs(parseFloat(a.balance || "0")).toFixed(2) : "",
          }))}
          filename="trial-balance"
          columns={[
            { key: "accountName", label: "Account" },
            { key: "accountType", label: "Type" },
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
          <h2 className="text-lg font-bold text-gray-800">RusingAcademy</h2>
          <p className="text-sm text-gray-500">Trial Balance</p>
          <p className="text-xs text-gray-400">As of {new Date().toLocaleDateString("en-CA", { year: "numeric", month: "long", day: "numeric" })}</p>
        </div>

        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-white/15 dark:border-white/15">
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase w-1/2">Account</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Debit</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Credit</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={3} className="px-4 py-8 text-center text-gray-400">Loading...</td></tr>
            ) : (
              Object.entries(grouped).map(([type, accts]) => (
                <tbody key={type}>
                  <tr className="bg-gray-50 dark:bg-white/[0.06] dark:backdrop-blur-sm">
                    <td colSpan={3} className="px-4 py-2 text-xs font-bold text-gray-500 uppercase">{type}</td>
                  </tr>
                  {(accts as any[]).map((a: any) => {
                    const bal = parseFloat(a.balance || "0");
                    return (
                      <tr key={a.id} className="border-b border-gray-50 hover:bg-gray-50 dark:bg-white/[0.06] dark:backdrop-blur-sm">
                        <td className="px-4 py-2 text-sm text-gray-800 dark:text-foreground pl-8">{a.name}</td>
                        <td className="px-4 py-2 text-sm text-right text-gray-700">{bal >= 0 ? fmt(a.balance) : ""}</td>
                        <td className="px-4 py-2 text-sm text-right text-gray-700">{bal < 0 ? fmt(a.balance) : ""}</td>
                      </tr>
                    );
                  })}
                </tbody>
              ))
            )}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-gray-300 bg-gray-50 dark:bg-white/[0.08] dark:backdrop-blur-md font-bold">
              <td className="px-4 py-3 text-sm text-gray-800">Total</td>
              <td className="px-4 py-3 text-sm text-right text-gray-800">
                ${totalDebits.toLocaleString("en-CA", { minimumFractionDigits: 2 })}
              </td>
              <td className="px-4 py-3 text-sm text-right text-gray-800">
                ${totalCredits.toLocaleString("en-CA", { minimumFractionDigits: 2 })}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
