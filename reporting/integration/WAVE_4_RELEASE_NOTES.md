# Wave 4 Release Notes — Sales/Accounting Integration

**Date:** 2026-02-14
**Branch:** `feat/orchestrator-wave4-sales`
**Build:** ✓ 0 errors

## Scope
Integration of the complete RusingAcademy Sales & Accounting platform into the main ecosystem under the `/accounting/` namespace.

## What Changed

### New Pages (34) — under `/accounting/`
| Page | Route | Description |
|------|-------|-------------|
| Invoices | /accounting/invoices | Invoice management dashboard |
| InvoiceDetail | /accounting/invoices/:id | Invoice creation/editing |
| InvoicePdf | /accounting/invoices/:id/pdf | PDF invoice generation |
| Estimates | /accounting/estimates | Estimate management |
| Customers | /accounting/customers | Customer CRM |
| CustomerDetail | /accounting/customers/:id | Customer detail/edit |
| Expenses | /accounting/expenses | Expense tracking |
| ExpenseDetail | /accounting/expenses/:id | Expense detail/edit |
| Bills | /accounting/bills | Bill management |
| ChartOfAccounts | /accounting/chart-of-accounts | Chart of accounts |
| AccountRegister | /accounting/accounts/:id/register | Account register |
| ProductsServices | /accounting/products-services | Products & services catalog |
| ProductDetail | /accounting/products/:id | Product detail |
| Suppliers | /accounting/suppliers | Supplier management |
| SupplierDetail | /accounting/suppliers/:id | Supplier detail |
| SalesTax | /accounting/sales-tax | Sales tax management |
| BankTransactions | /accounting/bank-transactions | Bank transaction import |
| BankRules | /accounting/bank-rules | Bank categorization rules |
| Deposits | /accounting/deposits | Deposit tracking |
| RecurringTransactions | /accounting/recurring | Recurring transactions |
| Reconciliation | /accounting/reconciliation | Bank reconciliation |
| ReconciliationWorkspace | /accounting/reconciliation/workspace | Reconciliation workspace |
| JournalEntries | /accounting/journal-entries | Journal entries |
| Reports | /accounting/reports | Reports dashboard |
| ProfitLossReport | /accounting/reports/profit-and-loss | P&L report |
| BalanceSheetReport | /accounting/reports/balance-sheet | Balance sheet |
| TrialBalanceReport | /accounting/reports/trial-balance | Trial balance |
| AgingReport | /accounting/reports/aging | Aging report |
| GeneralLedgerReport | /accounting/reports/general-ledger | General ledger |
| AuditLog | /accounting/audit-log | Audit log |
| AuditTrail | /accounting/audit-trail | Audit trail |
| ExchangeRates | /accounting/exchange-rates | Exchange rates |
| EmailTemplates | /accounting/email-templates | Email templates |
| Settings | /accounting/settings | Accounting settings |

### New Components (4)
CsvExportButton, FileAttachments, PWAInstallPrompt, TableSkeleton

### New Server Files (2)
- `accounting.ts` — Accounting service logic
- `pdfGenerator.ts` — Invoice/report PDF generation

### Namespace Strategy
All Sales pages are namespaced under `/accounting/` with `Acct` prefix on lazy imports to avoid collisions with existing ecosystem pages.

## Non-Regression
- All 278 existing routes preserved (Wave 1 + Wave 2 + Wave 3)
- 35 new routes added (total: 313)
- Header, Hero, Widget unchanged
- Build passes with 0 errors
