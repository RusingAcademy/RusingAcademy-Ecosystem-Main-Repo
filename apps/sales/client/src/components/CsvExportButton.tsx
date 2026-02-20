/**
 * Sprint 43 — CSV Export Button
 * Reusable component that exports tabular data to CSV
 */
import { Download } from "lucide-react";

interface CsvExportButtonProps {
  data: Record<string, any>[];
  filename: string;
  columns?: { key: string; label: string }[];
  className?: string;
  label?: string;
}

export default function CsvExportButton({ data, filename, columns, className, label = "Export CSV" }: CsvExportButtonProps) {
  const handleExport = () => {
    if (!data || data.length === 0) return;

    const cols = columns || Object.keys(data[0]).map(k => ({ key: k, label: k }));
    const header = cols.map(c => `"${c.label}"`).join(",");
    const rows = data.map(row =>
      cols.map(c => {
        const val = row[c.key];
        if (val === null || val === undefined) return '""';
        const str = String(val).replace(/"/g, '""');
        return `"${str}"`;
      }).join(",")
    );

    const csv = [header, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${filename}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <button
      onClick={handleExport}
      disabled={!data || data.length === 0}
      className={className || "qb-btn-outline flex items-center gap-1.5 text-sm"}
    >
      <Download size={14} /> {label}
    </button>
  );
}
