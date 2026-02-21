/*
 * QuickBooks Authentic — Bank Transactions page with CSV Import
 */
import { trpc } from "@/lib/trpc";
import { useState, useRef } from "react";
import { Upload, RefreshCw, Loader2, Check, X, FileSpreadsheet, AlertCircle, Zap } from "lucide-react";
import { useLocation } from "wouter";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/contexts/LanguageContext";

function parseCSV(text: string): Array<Record<string, string>> {
  const lines = text.trim().split("\n");
  if (lines.length < 2) return [];
  const headers = lines[0].split(",").map(h => h.trim().replace(/^"|"$/g, ""));
  return lines.slice(1).map(line => {
    const values = line.split(",").map(v => v.trim().replace(/^"|"$/g, ""));
    const row: Record<string, string> = {};
    headers.forEach((h, i) => { row[h] = values[i] || ""; });
    return row;
  });
}


const labels = {
  en: { title: "Bank Transactions", subtitle: "Import and categorize bank transactions", import: "Import", match: "Match", categorize: "Categorize", status: "Status" },
  fr: { title: "Transactions bancaires", subtitle: "Importer et catégoriser les transactions bancaires", import: "Importer", match: "Associer", categorize: "Catégoriser", status: "Statut" },
};

export default function BankTransactions() {
  const { language } = useLanguage();
  const l = labels[language as keyof typeof labels] || labels.en;

  const [, navigate] = useLocation();
  const [statusFilter, setStatusFilter] = useState("For Review");
  const [showImport, setShowImport] = useState(false);
  const [csvData, setCsvData] = useState<Array<Record<string, string>>>([]);
  const [selectedAccountId, setSelectedAccountId] = useState<string>("");
  const [dateCol, setDateCol] = useState("");
  const [descCol, setDescCol] = useState("");
  const [amountCol, setAmountCol] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const utils = trpc.useUtils();
  const { data: transactions, isLoading } = trpc.bankTransactions.list.useQuery(
    statusFilter !== "All" ? { status: statusFilter } : undefined
  );
  const { data: dashboardData } = trpc.dashboard.getData.useQuery();
  const { data: accountsList } = trpc.accounts.list.useQuery();
  const importMutation = trpc.bankTransactions.importCsv.useMutation({
    onSuccess: (result) => {
      toast.success(`Imported ${result.imported} transactions (${result.skipped} duplicates skipped)`);
      utils.bankTransactions.list.invalidate();
      setShowImport(false);
      setCsvData([]);
    },
    onError: (err) => toast.error(err.message),
  });
  const updateMutation = trpc.bankTransactions.update.useMutation({
    onSuccess: () => {
      utils.bankTransactions.list.invalidate();
      toast.success("Transaction updated");
    },
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      const parsed = parseCSV(text);
      if (parsed.length === 0) { toast.error("No data found in CSV"); return; }
      setCsvData(parsed);
      // Auto-detect columns
      const cols = Object.keys(parsed[0]);
      const dateLike = cols.find(c => /date/i.test(c));
      const descLike = cols.find(c => /desc|memo|detail|narr/i.test(c));
      const amtLike = cols.find(c => /amount|amt|value|debit|credit/i.test(c));
      if (dateLike) setDateCol(dateLike);
      if (descLike) setDescCol(descLike);
      if (amtLike) setAmountCol(amtLike);
      setShowImport(true);
    };
    reader.readAsText(file);
  };

  const handleImport = () => {
    if (!selectedAccountId || !dateCol || !descCol || !amountCol) {
      toast.error("Please map all required columns");
      return;
    }
    const mapped = csvData.map(row => ({
      transactionDate: new Date(row[dateCol]),
      description: row[descCol] || "Imported transaction",
      amount: row[amountCol]?.replace(/[$,]/g, "") || "0",
    })).filter(t => !isNaN(t.transactionDate.getTime()));
    if (mapped.length === 0) { toast.error("No valid transactions to import"); return; }
    importMutation.mutate({ accountId: parseInt(selectedAccountId), transactions: mapped });
  };

  const bankAccounts = ((accountsList || []) as any[]).filter((a: any) =>
    a.accountType === "Bank" || a.accountType === "Checking" || a.accountType === "Savings"
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full p-12">
        <Loader2 className="animate-spin text-gray-400" size={32} />
      </div>
    );
  }

  const allTransactions = (transactions || []) as any[];
  const bankData = dashboardData as any;
  const csvColumns = csvData.length > 0 ? Object.keys(csvData[0]) : [];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Bank transactions</h1>
        <div className="flex items-center gap-2">
          <input ref={fileRef} type="file" accept=".csv" className="hidden" onChange={handleFileSelect} />
          <Button variant="outline" size="sm" onClick={() => fileRef.current?.click()}>
            <Upload size={14} className="mr-1" /> Import CSV
          </Button>
          <Button variant="outline" size="sm" onClick={() => navigate("/bank-rules")}>
            <Zap size={14} className="mr-1" /> Rules
          </Button>
          <Button variant="outline" size="sm" onClick={() => utils.bankTransactions.list.invalidate()}>
            <RefreshCw size={14} className="mr-1" /> Refresh
          </Button>
        </div>
      </div>

      {/* Bank Account Card */}
      <div className="qb-card mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-sm font-bold text-gray-600">RA</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">{bankData?.bankAccounts?.name || "RusingAcademy"}</h3>
              <p className="text-xs text-gray-500">Updated {bankData?.bankAccounts?.lastUpdated || "recently"}</p>
            </div>
          </div>
          <div className="flex items-center gap-8">
            <div className="text-right">
              <div className="text-xs text-gray-500">Bank balance</div>
              <div className="text-lg font-bold text-gray-900">${Number(bankData?.bankAccounts?.bankBalance || 0).toFixed(2)}</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-500">In QuickBooks</div>
              <div className="text-lg font-bold text-gray-900">${Number(bankData?.bankAccounts?.qbBalance || 0).toFixed(2)}</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-500">For review</div>
              <div className="text-lg font-bold text-sky-600">{bankData?.bankAccounts?.toReview || 0}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-4 mb-4 border-b border-gray-200 dark:border-white/15 dark:border-white/15">
        {["For Review", "Categorized", "Excluded", "Matched", "All"].map(tab => (
          <button
            key={tab}
            className={`pb-2 text-sm font-medium border-b-2 transition-colors ${
              statusFilter === tab
                ? "border-green-600 text-green-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setStatusFilter(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Transaction Table */}
      <div className="bg-white dark:bg-white/[0.08] dark:backdrop-blur-md rounded-lg border border-gray-200 dark:border-white/15 dark:border-white/15 overflow-hidden">
        <table className="w-full qb-table">
          <thead>
            <tr className="bg-gray-50 dark:bg-white/[0.06] dark:backdrop-blur-sm">
              <th className="w-8"><input type="checkbox" className="rounded" /></th>
              <th>Date</th>
              <th>Description</th>
              <th className="text-right">Amount</th>
              <th>Status</th>
              <th className="w-32">Action</th>
            </tr>
          </thead>
          <tbody>
            {allTransactions.map((row: any) => {
              const txn = row.transaction || row;
              const amount = parseFloat(txn.amount || "0");
              return (
                <tr key={txn.id} className="hover:bg-gray-50 dark:bg-white/[0.06] dark:backdrop-blur-sm">
                  <td><input type="checkbox" className="rounded" /></td>
                  <td className="text-gray-700">{txn.transactionDate ? new Date(txn.transactionDate).toLocaleDateString("en-CA") : ""}</td>
                  <td className="text-gray-800 dark:text-foreground max-w-[300px] truncate">{txn.description || "—"}</td>
                  <td className={`text-right font-medium ${amount < 0 ? "text-red-600" : "text-green-600"}`}>
                    ${Math.abs(amount).toFixed(2)}
                  </td>
                  <td>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      txn.status === "For Review" ? "bg-yellow-100 text-yellow-700" :
                      txn.status === "Categorized" ? "bg-green-100 text-green-700" :
                      txn.status === "Matched" ? "bg-blue-100 text-blue-700" :
                      "bg-gray-100 dark:bg-white/[0.08] dark:backdrop-blur-md dark:border-white/15 text-gray-600"
                    }`}>
                      {txn.status}
                    </span>
                  </td>
                  <td>
                    {txn.status === "For Review" ? (
                      <div className="flex items-center gap-1">
                        <button aria-label="Action"
                          className="p-1 bg-green-50 hover:bg-green-100 rounded text-green-600"
                          onClick={() => updateMutation.mutate({ id: txn.id, status: "Categorized" })}
                          title="Categorize"
                        >
                          <Check size={14} />
                        </button>
                        <button aria-label="Action"
                          className="p-1 bg-red-50 hover:bg-red-100 rounded text-red-600"
                          onClick={() => updateMutation.mutate({ id: txn.id, status: "Excluded" })}
                          title="Exclude"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ) : (
                      <button
                        className="text-xs text-sky-600 hover:underline"
                        onClick={() => updateMutation.mutate({ id: txn.id, status: "For Review" })}
                      >
                        Undo
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
            {allTransactions.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-8 text-gray-400">No transactions found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* CSV Import Dialog */}
      <Dialog open={showImport} onOpenChange={setShowImport}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileSpreadsheet size={20} /> Import Bank Transactions
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-700 flex items-start gap-2">
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              <span>Found {csvData.length} rows. Map the columns below and select a bank account.</span>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-muted-foreground mb-1 block">Bank Account</label>
              <Select value={selectedAccountId} onValueChange={setSelectedAccountId}>
                <SelectTrigger><SelectValue placeholder="Select account" /></SelectTrigger>
                <SelectContent>
                  {bankAccounts.map((a: any) => (
                    <SelectItem key={a.id} value={String(a.id)}>{a.name}</SelectItem>
                  ))}
                  {bankAccounts.length === 0 && (
                    <SelectItem value="1">Default Bank Account</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-muted-foreground mb-1 block">Date Column</label>
                <Select value={dateCol} onValueChange={setDateCol}>
                  <SelectTrigger><SelectValue placeholder="Date" /></SelectTrigger>
                  <SelectContent>
                    {csvColumns.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-muted-foreground mb-1 block">Description</label>
                <Select value={descCol} onValueChange={setDescCol}>
                  <SelectTrigger><SelectValue placeholder="Description" /></SelectTrigger>
                  <SelectContent>
                    {csvColumns.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-muted-foreground mb-1 block">Amount</label>
                <Select value={amountCol} onValueChange={setAmountCol}>
                  <SelectTrigger><SelectValue placeholder="Amount" /></SelectTrigger>
                  <SelectContent>
                    {csvColumns.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            {csvData.length > 0 && dateCol && descCol && amountCol && (
              <div className="border rounded-lg overflow-hidden max-h-40 overflow-y-auto">
                <table className="w-full text-xs">
                  <thead className="bg-gray-50 dark:bg-white/[0.06] dark:backdrop-blur-sm">
                    <tr>
                      <th className="px-2 py-1 text-left">Date</th>
                      <th className="px-2 py-1 text-left">Description</th>
                      <th className="px-2 py-1 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {csvData.slice(0, 5).map((row, i) => (
                      <tr key={i} className="border-t">
                        <td className="px-2 py-1">{row[dateCol]}</td>
                        <td className="px-2 py-1 truncate max-w-[150px]">{row[descCol]}</td>
                        <td className="px-2 py-1 text-right">{row[amountCol]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowImport(false)}>Cancel</Button>
            <Button onClick={handleImport} disabled={importMutation.isPending}>
              {importMutation.isPending ? <Loader2 size={14} className="animate-spin mr-1" /> : null}
              Import {csvData.length} Transactions
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
