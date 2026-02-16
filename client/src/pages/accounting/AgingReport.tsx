import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, Download, Printer } from "lucide-react";
import { Link } from "wouter";
import { toast } from "sonner";
import CsvExportButton from "@/components/CsvExportButton";

export default function AgingReport() {
  const [reportType, setReportType] = useState<"receivable" | "payable">("receivable");
  const { data: receivables, isLoading: loadingAR } = trpc.reports.agingReceivable.useQuery();
  const { data: payables, isLoading: loadingAP } = trpc.reports.agingPayable.useQuery();

  const isLoading = reportType === "receivable" ? loadingAR : loadingAP;
  const data = reportType === "receivable" ? receivables : payables;

  const fmt = (v: string | null | undefined) =>
    `$${parseFloat(v || "0").toLocaleString("en-CA", { minimumFractionDigits: 2 })}`;

  // Calculate aging buckets
  const now = new Date();
  const getAgingBucket = (dateStr: string | null) => {
    if (!dateStr) return "Current";
    const dueDate = new Date(dateStr);
    const diffDays = Math.floor((now.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays <= 0) return "Current";
    if (diffDays <= 30) return "1-30";
    if (diffDays <= 60) return "31-60";
    if (diffDays <= 90) return "61-90";
    return "91+";
  };

  const items = (data || []).map((row: any) => {
    const item = reportType === "receivable" ? row.invoice || row : row.bill || row;
    const name = reportType === "receivable" ? row.customerName : row.supplierName;
    const dueDate = item?.dueDate;
    const amount = parseFloat(item?.amountDue || "0");
    const bucket = getAgingBucket(dueDate);
    return { ...item, name, amount, bucket, dueDate };
  });

  const buckets = ["Current", "1-30", "31-60", "61-90", "91+"];
  const bucketTotals = buckets.reduce((acc, b) => {
    acc[b] = items.filter((i: any) => i.bucket === b).reduce((sum: number, i: any) => sum + i.amount, 0);
    return acc;
  }, {} as Record<string, number>);
  const grandTotal = items.reduce((sum: number, i: any) => sum + i.amount, 0);

  return (
    <div className="p-6 max-w-[1200px] mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/reports">
          <button className="p-1.5 hover:bg-gray-100 rounded-full">
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-800">
            {reportType === "receivable" ? "Accounts Receivable" : "Accounts Payable"} Aging Summary
          </h1>
          <p className="text-sm text-gray-500">As of {new Date().toLocaleDateString("en-CA")}</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="receivable">Accounts Receivable</option>
            <option value="payable">Accounts Payable</option>
          </select>
          <CsvExportButton
            data={((data as any[]) || []).map((d: any) => ({
              name: d.customerName || d.supplierName || d.name || "",
              invoiceNumber: d.invoiceNumber || d.billNumber || "",
              date: d.invoiceDate || d.billDate || "",
              dueDate: d.dueDate || "",
              total: d.total || "0",
              balance: d.balanceDue || d.total || "0",
              aging: getAgingBucket(d.dueDate),
            }))}
            filename={`aging-${reportType}`}
            columns={[
              { key: "name", label: "Name" },
              { key: "invoiceNumber", label: "Number" },
              { key: "date", label: "Date" },
              { key: "dueDate", label: "Due Date" },
              { key: "total", label: "Total" },
              { key: "balance", label: "Balance" },
              { key: "aging", label: "Aging Bucket" },
            ]}
            label="Export CSV"
          />
          <button onClick={() => window.print()} className="qb-btn-outline flex items-center gap-2 text-sm">
            <Printer size={14} /> Print
          </button>
        </div>
      </div>

      {/* Summary Buckets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-3 mb-6">
        {buckets.map((b) => (
          <div key={b} className="bg-white rounded-lg border border-gray-200 p-4 text-center">
            <p className="text-xs text-gray-500 mb-1">{b === "Current" ? "Current" : `${b} days`}</p>
            <p className="text-lg font-bold text-gray-800">
              ${bucketTotals[b].toLocaleString("en-CA", { minimumFractionDigits: 2 })}
            </p>
          </div>
        ))}
        <div className="bg-green-600 rounded-lg p-4 text-center text-white">
          <p className="text-xs opacity-80 mb-1">Total</p>
          <p className="text-lg font-bold">
            ${grandTotal.toLocaleString("en-CA", { minimumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      {/* Detail Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">
                {reportType === "receivable" ? "Customer" : "Supplier"}
              </th>
              {buckets.map((b) => (
                <th key={b} className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">
                  {b === "Current" ? "Current" : `${b}`}
                </th>
              ))}
              <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Total</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400">Loading...</td></tr>
            ) : items.length === 0 ? (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400">No outstanding amounts</td></tr>
            ) : (
              // Group by name
              Object.entries(
                items.reduce((acc: Record<string, any[]>, item: any) => {
                  const name = item.name || "Unknown";
                  if (!acc[name]) acc[name] = [];
                  acc[name].push(item);
                  return acc;
                }, {} as Record<string, any[]>)
              ).map(([name, nameItems]) => {
                const nameBuckets = buckets.reduce((acc, b) => {
                  acc[b] = (nameItems as any[]).filter((i: any) => i.bucket === b).reduce((sum: number, i: any) => sum + i.amount, 0);
                  return acc;
                }, {} as Record<string, number>);
                const nameTotal = (nameItems as any[]).reduce((sum: number, i: any) => sum + i.amount, 0);
                return (
                  <tr key={name} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-800">{name}</td>
                    {buckets.map((b) => (
                      <td key={b} className="px-4 py-3 text-sm text-right text-gray-600">
                        {nameBuckets[b] > 0 ? `$${nameBuckets[b].toLocaleString("en-CA", { minimumFractionDigits: 2 })}` : ""}
                      </td>
                    ))}
                    <td className="px-4 py-3 text-sm text-right font-medium text-gray-800">
                      ${nameTotal.toLocaleString("en-CA", { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-gray-300 bg-gray-50 font-bold">
              <td className="px-4 py-3 text-sm text-gray-800">Total</td>
              {buckets.map((b) => (
                <td key={b} className="px-4 py-3 text-sm text-right text-gray-800">
                  ${bucketTotals[b].toLocaleString("en-CA", { minimumFractionDigits: 2 })}
                </td>
              ))}
              <td className="px-4 py-3 text-sm text-right text-gray-800">
                ${grandTotal.toLocaleString("en-CA", { minimumFractionDigits: 2 })}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
