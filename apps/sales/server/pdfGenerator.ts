/**
 * Enhancement D — Server-Generated Invoice PDF
 * Uses pdfmake to generate professional branded PDF invoices
 */
// @ts-ignore — pdfmake CJS singleton
import pdfmake from "pdfmake";
import type { TDocumentDefinitions, Content, TableCell } from "pdfmake/interfaces";
import fs from "fs";
import { getInvoicePdfData } from "./db";

// Register standard PDF fonts (built-in, no TTF files needed)
(pdfmake as any).addFonts({
  Helvetica: {
    normal: "Helvetica",
    bold: "Helvetica-Bold",
    italics: "Helvetica-Oblique",
    bolditalics: "Helvetica-BoldOblique",
  },
});

const QB_GREEN = "#2CA01C";
const QB_BLUE = "#0077C5";
const GRAY_800 = "#1f2937";
const GRAY_600 = "#4b5563";
const GRAY_500 = "#6b7280";
const GRAY_400 = "#9ca3af";
const GRAY_100 = "#f3f4f6";

function fmt(val: string | null | undefined): string {
  const n = parseFloat(val || "0");
  return `$${n.toLocaleString("en-CA", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function fmtDate(d: Date | string | null | undefined): string {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-CA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export async function generateInvoicePdf(invoiceId: number): Promise<Buffer> {
  const data = await getInvoicePdfData(invoiceId);
  if (!data) throw new Error("Invoice not found");

  const { invoice, lineItems, customer, company } = data;

  // Build company address lines
  const companyLines: string[] = [];
  if (company?.address) companyLines.push(company.address);
  if (company?.city || company?.province || company?.postalCode) {
    companyLines.push(
      [company?.city, company?.province].filter(Boolean).join(", ") +
        (company?.postalCode ? ` ${company.postalCode}` : "")
    );
  }
  if (company?.country) companyLines.push(company.country);
  if (company?.email) companyLines.push(company.email);
  if (company?.phone) companyLines.push(company.phone);

  // Build customer address lines
  const customerLines: string[] = [];
  if (customer?.displayName) customerLines.push(customer.displayName);
  if (customer?.company) customerLines.push(customer.company);
  if (customer?.billingAddress) customerLines.push(customer.billingAddress);
  if (customer?.email) customerLines.push(customer.email);

  // Status color
  const statusColor =
    invoice.status === "Paid" || invoice.status === "Deposited"
      ? QB_GREEN
      : invoice.status === "Overdue"
      ? "#dc2626"
      : invoice.status === "Voided"
      ? GRAY_400
      : QB_BLUE;

  // Line items table body
  const tableBody: TableCell[][] = [
    [
      { text: "#", style: "tableHeader" },
      { text: "Description", style: "tableHeader" },
      { text: "Qty", style: "tableHeaderRight" },
      { text: "Rate", style: "tableHeaderRight" },
      { text: "Tax", style: "tableHeaderRight" },
      { text: "Amount", style: "tableHeaderRight" },
    ],
  ];

  lineItems.forEach((line, idx) => {
    tableBody.push([
      { text: String(idx + 1), style: "tableCell" },
      { text: line.description || "—", style: "tableCell" },
      { text: String(line.quantity || "1"), style: "tableCellRight" },
      { text: fmt(line.rate), style: "tableCellRight" },
      { text: line.taxCode || "—", style: "tableCellRight" },
      { text: fmt(line.amount), style: "tableCellRight", bold: true },
    ]);
  });

  // Totals rows
  const totalsRows: TableCell[][] = [
    [
      { text: "Subtotal", style: "totalsLabel" },
      { text: fmt(invoice.subtotal), style: "totalsValue" },
    ],
  ];
  if (parseFloat(invoice.taxAmount || "0") > 0) {
    totalsRows.push([
      { text: "Tax", style: "totalsLabel" },
      { text: fmt(invoice.taxAmount), style: "totalsValue" },
    ]);
  }
  totalsRows.push([
    { text: "TOTAL", style: "totalsBold", fillColor: GRAY_100 },
    { text: fmt(invoice.total), style: "totalsBoldValue", fillColor: GRAY_100 },
  ]);
  if (parseFloat(invoice.amountPaid || "0") > 0) {
    totalsRows.push([
      { text: "Amount Paid", style: "totalsLabel" },
      { text: `-${fmt(invoice.amountPaid)}`, style: "totalsValue", color: QB_GREEN },
    ]);
    totalsRows.push([
      { text: "AMOUNT DUE", style: "totalsBold", fillColor: "#fef2f2" },
      { text: fmt(invoice.amountDue), style: "totalsBoldValue", fillColor: "#fef2f2", color: "#dc2626" },
    ]);
  }

  // Build the document definition
  const docDefinition: TDocumentDefinitions = {
    pageSize: "LETTER",
    pageMargins: [50, 50, 50, 80],
    defaultStyle: {
      font: "Helvetica",
      fontSize: 10,
      color: GRAY_600,
    },
    styles: {
      companyName: { fontSize: 20, bold: true, color: GRAY_800 },
      companyInfo: { fontSize: 9, color: GRAY_500, lineHeight: 1.4 },
      invoiceTitle: { fontSize: 22, bold: true, color: QB_GREEN, alignment: "right" as const },
      invoiceNumber: { fontSize: 13, bold: true, color: GRAY_800, alignment: "right" as const },
      invoiceMeta: { fontSize: 9, color: GRAY_500, alignment: "right" as const, lineHeight: 1.5 },
      sectionLabel: {
        fontSize: 8,
        bold: true,
        color: GRAY_400,
        margin: [0, 0, 0, 4] as [number, number, number, number],
      },
      billToName: { fontSize: 12, bold: true, color: GRAY_800 },
      billToInfo: { fontSize: 9, color: GRAY_500, lineHeight: 1.4 },
      tableHeader: {
        fontSize: 8,
        bold: true,
        color: GRAY_500,
        fillColor: GRAY_100,
        margin: [0, 6, 0, 6] as [number, number, number, number],
      },
      tableHeaderRight: {
        fontSize: 8,
        bold: true,
        color: GRAY_500,
        fillColor: GRAY_100,
        alignment: "right" as const,
        margin: [0, 6, 0, 6] as [number, number, number, number],
      },
      tableCell: {
        fontSize: 9,
        color: GRAY_600,
        margin: [0, 5, 0, 5] as [number, number, number, number],
      },
      tableCellRight: {
        fontSize: 9,
        color: GRAY_600,
        alignment: "right" as const,
        margin: [0, 5, 0, 5] as [number, number, number, number],
      },
      totalsLabel: { fontSize: 9, color: GRAY_500 },
      totalsValue: { fontSize: 9, color: GRAY_800, alignment: "right" as const },
      totalsBold: { fontSize: 11, bold: true, color: GRAY_800 },
      totalsBoldValue: {
        fontSize: 11,
        bold: true,
        color: GRAY_800,
        alignment: "right" as const,
      },
      notes: { fontSize: 9, color: GRAY_500, lineHeight: 1.4 },
      footer: { fontSize: 8, color: GRAY_400, alignment: "center" as const },
    },
    content: [
      // ─── Header ──────────────────────────────────────────
      {
        columns: [
          {
            width: "*",
            stack: [
              { text: company?.companyName || "RusingAcademy", style: "companyName" },
              ...companyLines.map((line) => ({ text: line, style: "companyInfo" })),
            ],
          },
          {
            width: "auto",
            stack: [
              { text: "INVOICE", style: "invoiceTitle" },
              { text: `#${invoice.invoiceNumber}`, style: "invoiceNumber", margin: [0, 4, 0, 0] as [number, number, number, number] },
              {
                text: `Date: ${fmtDate(invoice.invoiceDate)}\nDue: ${fmtDate(invoice.dueDate)}`,
                style: "invoiceMeta",
                margin: [0, 6, 0, 0] as [number, number, number, number],
              },
              {
                text: ` ${invoice.status.toUpperCase()} `,
                fontSize: 10,
                bold: true,
                color: "white",
                background: statusColor,
                alignment: "right" as const,
                margin: [0, 6, 0, 0] as [number, number, number, number],
              },
            ],
          },
        ],
      },

      // ─── Green Divider ───────────────────────────────────
      {
        canvas: [
          {
            type: "line",
            x1: 0,
            y1: 0,
            x2: 515,
            y2: 0,
            lineWidth: 2,
            lineColor: QB_GREEN,
          },
        ],
        margin: [0, 16, 0, 16] as [number, number, number, number],
      },

      // ─── Bill To / Payment Terms ─────────────────────────
      {
        columns: [
          {
            width: "*",
            stack: [
              { text: "BILL TO", style: "sectionLabel" },
              ...(customerLines.length > 0
                ? [
                    { text: customerLines[0], style: "billToName" },
                    ...customerLines.slice(1).map((l) => ({ text: l, style: "billToInfo" })),
                  ]
                : [{ text: "—", style: "billToInfo" }]),
            ],
          },
          {
            width: "*",
            stack: [
              { text: "PAYMENT TERMS", style: "sectionLabel" },
              { text: invoice.terms || "Due on receipt", style: "billToInfo" },
            ],
          },
        ],
        margin: [0, 0, 0, 20] as [number, number, number, number],
      },

      // ─── Line Items Table ────────────────────────────────
      {
        table: {
          headerRows: 1,
          widths: [25, "*", 40, 65, 50, 70],
          body: tableBody,
        },
        layout: {
          hLineWidth: (i: number, node: any) => {
            if (i === 0 || i === 1) return 1;
            if (i === node.table.body.length) return 1;
            return 0.5;
          },
          vLineWidth: () => 0,
          hLineColor: (i: number) => (i <= 1 ? "#d1d5db" : "#e5e7eb"),
          paddingTop: () => 0,
          paddingBottom: () => 0,
          paddingLeft: () => 4,
          paddingRight: () => 4,
        },
        margin: [0, 0, 0, 20] as [number, number, number, number],
      },

      // ─── Totals ──────────────────────────────────────────
      {
        columns: [
          { width: "*", text: "" },
          {
            width: 220,
            table: {
              widths: ["*", "auto"],
              body: totalsRows,
            },
            layout: {
              hLineWidth: (i: number, node: any) =>
                i === 0 || i === node.table.body.length ? 0 : 0.5,
              vLineWidth: () => 0,
              hLineColor: () => "#e5e7eb",
              paddingTop: () => 6,
              paddingBottom: () => 6,
              paddingLeft: () => 8,
              paddingRight: () => 8,
            },
          },
        ],
      },

      // ─── Notes ───────────────────────────────────────────
      ...(invoice.notes
        ? [
            {
              text: "NOTES",
              style: "sectionLabel",
              margin: [0, 24, 0, 4] as [number, number, number, number],
            } as Content,
            { text: invoice.notes, style: "notes" } as Content,
          ]
        : []),
    ],

    // ─── Footer ──────────────────────────────────────────
    footer: (currentPage: number, pageCount: number) => ({
      stack: [
        {
          canvas: [
            { type: "line", x1: 50, y1: 0, x2: 565, y2: 0, lineWidth: 0.5, lineColor: "#e5e7eb" },
          ],
        },
        {
          text: "Thank you for your business!",
          style: "footer",
          margin: [50, 8, 50, 0] as [number, number, number, number],
        },
        ...(company?.taxId
          ? [
              {
                text: `Tax ID: ${company.taxId}`,
                style: "footer",
                margin: [50, 2, 50, 0] as [number, number, number, number],
              },
            ]
          : []),
        {
          text: `Page ${currentPage} of ${pageCount}`,
          style: "footer",
          margin: [50, 4, 50, 0] as [number, number, number, number],
        },
      ],
    }),
  };

  const tempPath = `/tmp/_invoice_${invoiceId}_${Date.now()}.pdf`;
  return new Promise((resolve, reject) => {
    const doc = (pdfmake as any).createPdf(docDefinition);
    doc
      .write(tempPath)
      .then(() => {
        const buffer = fs.readFileSync(tempPath);
        // Clean up temp file
        fs.unlinkSync(tempPath);
        resolve(buffer);
      })
      .catch(reject);
  });
}
