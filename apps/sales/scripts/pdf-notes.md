# PDF Generation Notes
- pdfmake works with Helvetica built-in fonts (no TTF files needed)
- PDF generates successfully at /api/invoices/:id/pdf
- Invoice #1 has no line items (empty table) - this is a data issue, not a code issue
- The PDF shows company name, address, customer, status badge, totals correctly
- Need to test with an invoice that has line items
