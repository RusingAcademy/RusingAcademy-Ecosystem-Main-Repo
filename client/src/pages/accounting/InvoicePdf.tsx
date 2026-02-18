/**
 * Sprint 41 — Invoice PDF Preview & Download
 * Renders a professional invoice template that can be printed or saved as PDF
 */
import { trpc } from "@/lib/trpc";
import { useRoute, useLocation } from "wouter";
import { ArrowLeft, Download, Printer, Loader2, FileDown } from "lucide-react";
import { useState } from "react";

export default function InvoicePdf() {
  const [, params] = useRoute("/invoices/:id/pdf");
  const [, navigate] = useLocation();
  const invoiceId = params?.id ? Number(params.id) : 0;

  const { data, isLoading } = trpc.invoicePdf.getData.useQuery(
    { id: invoiceId },
    { enabled: invoiceId > 0 }
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin text-gray-400" size={32} />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Invoice not found</p>
      </div>
    );
  }

  const { invoice, lineItems, customer, company } = data;
  const fmt = (val: string | null | undefined) => {
    const n = parseFloat(val || "0");
    return n.toLocaleString("en-CA", { style: "currency", currency: "CAD" });
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-white/[0.06] dark:backdrop-blur-sm">
      {/* Action Bar (hidden in print) */}
      <div className="print:hidden bg-white dark:bg-white/[0.08] dark:backdrop-blur-md border-b border-gray-200 dark:border-white/15 dark:border-white/15 px-6 py-3 flex items-center justify-between sticky top-0 z-10">
        <button
          onClick={() => navigate(`/invoices/${invoiceId}`)}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={16} /> Back to Invoice
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="qb-btn-outline flex items-center gap-1.5"
          >
            <Printer size={14} /> Print
          </button>
          <button
            onClick={() => {
              const link = document.createElement("a");
              link.href = `/api/invoices/${invoiceId}/pdf`;
              link.download = `invoice-${invoice.invoiceNumber}.pdf`;
              link.click();
            }}
            className="qb-btn flex items-center gap-1.5"
          >
            <FileDown size={14} /> Download PDF
          </button>
        </div>
      </div>

      {/* Invoice Document */}
      <div className="max-w-[800px] mx-auto my-8 print:my-0 bg-white dark:bg-white/[0.08] dark:backdrop-blur-md shadow-lg print:shadow-none">
        <div className="p-10">
          {/* Header */}
          <div className="flex justify-between items-start mb-4 md:mb-6 lg:mb-10">
            <div>
              <h1 className="text-lg md:text-2xl lg:text-3xl font-bold text-gray-900">
                {company?.companyName || "RusingÂcademy"}
              </h1>
              {company?.address && (
                <p className="text-sm text-gray-500 mt-1">{company.address}</p>
              )}
              {company?.city && (
                <p className="text-sm text-gray-500">
                  {company.city}{company.province ? `, ${company.province}` : ""} {company.postalCode || ""}
                </p>
              )}
              {company?.email && (
                <p className="text-sm text-gray-500">{company.email}</p>
              )}
              {company?.phone && (
                <p className="text-sm text-gray-500">{company.phone}</p>
              )}
            </div>
            <div className="text-right">
              <h2 className="text-2xl font-bold text-green-600 uppercase tracking-wider">Invoice</h2>
              <p className="text-lg font-semibold text-gray-700 dark:text-muted-foreground mt-1">#{invoice.invoiceNumber}</p>
              <div className="mt-2 text-sm text-gray-500">
                <p>Date: {invoice.invoiceDate ? new Date(invoice.invoiceDate).toLocaleDateString("en-CA") : "—"}</p>
                <p>Due: {invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString("en-CA") : "—"}</p>
              </div>
              <div className="mt-2">
                <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                  invoice.status === "Paid" || invoice.status === "Deposited"
                    ? "bg-green-100 text-green-700"
                    : invoice.status === "Overdue"
                    ? "bg-red-100 text-red-700"
                    : invoice.status === "Voided"
                    ? "bg-gray-100 dark:bg-white/[0.08] dark:backdrop-blur-md dark:border-white/15 text-gray-500"
                    : "bg-blue-100 text-blue-700"
                }`}>
                  {invoice.status}
                </span>
              </div>
            </div>
          </div>

          {/* Bill To */}
          <div className="mb-8 p-4 bg-gray-50 dark:bg-white/[0.08] dark:backdrop-blur-md rounded-lg">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Bill To</p>
            <p className="font-semibold text-gray-800">{customer?.displayName || "—"}</p>
            {customer?.company && <p className="text-sm text-gray-600">{customer.company}</p>}
            {customer?.billingAddress && <p className="text-sm text-gray-500">{customer.billingAddress}</p>}
            {customer?.email && <p className="text-sm text-gray-500">{customer.email}</p>}
          </div>

          {/* Line Items Table */}
          <table className="w-full mb-8">
            <thead>
              <tr className="border-b-2 border-gray-200 dark:border-white/15 dark:border-white/15">
                <th className="text-left py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">#</th>
                <th className="text-left py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Description</th>
                <th className="text-right py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Qty</th>
                <th className="text-right py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Rate</th>
                <th className="text-right py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Tax</th>
                <th className="text-right py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Amount</th>
              </tr>
            </thead>
            <tbody>
              {lineItems.map((line, idx) => (
                <tr key={line.id} className="border-b border-gray-100">
                  <td className="py-3 text-sm text-gray-500">{idx + 1}</td>
                  <td className="py-3 text-sm text-gray-800">{line.description || "—"}</td>
                  <td className="py-3 text-sm text-gray-700 dark:text-muted-foreground text-right">{line.quantity || "1"}</td>
                  <td className="py-3 text-sm text-gray-700 dark:text-muted-foreground text-right">{fmt(line.rate)}</td>
                  <td className="py-3 text-sm text-gray-500 text-right">{line.taxCode || "—"}</td>
                  <td className="py-3 text-sm font-medium text-gray-800 dark:text-foreground text-right">{fmt(line.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals */}
          <div className="flex justify-end">
            <div className="w-64">
              <div className="flex justify-between py-2 text-sm">
                <span className="text-gray-500">Subtotal</span>
                <span className="font-medium text-gray-700">{fmt(invoice.subtotal)}</span>
              </div>
              {parseFloat(invoice.taxAmount || "0") > 0 && (
                <div className="flex justify-between py-2 text-sm">
                  <span className="text-gray-500">Tax</span>
                  <span className="font-medium text-gray-700">{fmt(invoice.taxAmount)}</span>
                </div>
              )}
              <div className="flex justify-between py-3 border-t-2 border-gray-300 text-lg">
                <span className="font-bold text-gray-800">Total</span>
                <span className="font-bold text-gray-900">{fmt(invoice.total)}</span>
              </div>
              {parseFloat(invoice.amountPaid || "0") > 0 && (
                <>
                  <div className="flex justify-between py-2 text-sm">
                    <span className="text-gray-500">Amount Paid</span>
                    <span className="font-medium text-green-600">-{fmt(invoice.amountPaid)}</span>
                  </div>
                  <div className="flex justify-between py-2 text-sm border-t border-gray-200 dark:border-white/15 dark:border-white/15">
                    <span className="font-semibold text-gray-700">Amount Due</span>
                    <span className="font-bold text-red-600">{fmt(invoice.amountDue)}</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Notes */}
          {invoice.notes && (
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-white/15 dark:border-white/15">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Notes</p>
              <p className="text-sm text-gray-600 whitespace-pre-wrap">{invoice.notes}</p>
            </div>
          )}

          {/* Footer */}
          <div className="mt-12 pt-6 border-t border-gray-200 dark:border-white/15 dark:border-white/15 text-center">
            <p className="text-xs text-gray-400">
              Thank you for your business!
            </p>
            {company?.taxId && (
              <p className="text-xs text-gray-400 mt-1">
                Tax ID: {company.taxId}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
