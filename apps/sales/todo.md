# QuickBooks Clone — Sprint Tracker

## Sprint 1 — Backend Infrastructure & Database Schema
- [x] Upgrade to full-stack with webdev_add_feature
- [x] Design complete database schema
- [x] Create seed script with all current data
- [x] Set up tRPC API layer
- [x] Implement migrations

## Sprint 2 — Authentication & User Management
- [x] Integrate Manus OAuth
- [x] Session persistence with JWT
- [x] User profile page (avatar in header)
- [x] Role-based access
- [x] Login/logout flow

## Sprint 3 — Global Search & Command Palette
- [x] Full-text search across entities
- [x] Command palette (Cmd+K)
- [x] Search result categories
- [x] Keyboard navigation

## Sprint 4 — Invoice CRUD & PDF Generation
- [x] Create Invoice form
- [x] Invoice edit mode
- [ ] Invoice PDF generation (placeholder)
- [x] Send invoice flow (Mark as Sent)
- [x] Record payment from invoice detail
- [x] Status transitions
- [x] Invoice detail page

## Sprint 5 — Expense CRUD & Receipt Management
- [x] Record Expense form
- [ ] Cheque Expense variant (placeholder)
- [ ] Receipt upload (placeholder)
- [x] Expense categorization
- [x] Expense detail/edit page

## Sprint 6 — Customer & Supplier Detail Pages
- [x] Customer detail page
- [x] Customer transaction history
- [x] New/Edit Customer forms
- [x] Supplier detail page
- [x] New/Edit Supplier forms

## Sprint 7 — Chart of Accounts & Account Registers
- [ ] New Account form (placeholder)
- [ ] Account editing/deactivation (placeholder)
- [x] Account Register page
- [x] Register filtering
- [x] Running balance calculation

## Sprint 8 — Products & Services Management
- [x] New Product/Service form
- [x] Product editing/deactivation
- [ ] Category management (placeholder)
- [x] Product detail page

## Sprint 9 — Bank Transactions & Categorization
- [x] Bank transactions list with live API
- [x] Status update (categorize/exclude)
- [ ] Match to invoices/expenses (placeholder)
- [x] Categorized/Excluded tabs
- [ ] Upload transactions CSV (placeholder)

## Sprint 10 — Sales Tax Engine & Filing
- [x] Tax rate management (list + create)
- [ ] Auto tax calculation (placeholder)
- [ ] Prepare Return workflow (placeholder)
- [x] Tax filings list with status
- [ ] Record Tax Payment (placeholder)

## Sprint 11 — Reports Engine (Financial)
- [x] Report rendering framework
- [x] Profit and Loss report
- [x] Balance Sheet report
- [ ] Statement of Cash Flows (placeholder)
- [x] Trial Balance report
- [ ] Export PDF/CSV (placeholder)

## Sprint 12 — Reports Engine (Operational)
- [x] AR/AP Aging reports (receivable + payable)
- [x] Customer Balance Summary (via accounting engine)
- [ ] Sales by Customer/Product (placeholder)
- [x] General Ledger report
- [ ] Transaction List by Date (placeholder)

## Sprint 13 — Dashboard Live Calculations
- [x] Wire P&L card to live data
- [x] Wire Expenses card
- [x] Live Bank Accounts card
- [x] Interactive Cash Flow chart
- [x] Period switching
- [x] Customize/Privacy mode

## Sprint 14 — Recurring Transactions
- [x] Recurring Transactions list
- [x] Create recurring transaction (Invoice/Expense/Bill/JE)
- [x] Pause/resume/delete recurring
- [ ] Auto-generation engine (placeholder)
- [ ] Invoice reminders (placeholder)

## Sprint 15 — Payments, Deposits & Banking
- [x] Payments list page
- [x] Record payment form
- [ ] Partial payment handling (placeholder)
- [ ] Bank Deposit form (placeholder)
- [ ] Transfer form (placeholder)
- [ ] Credit memo/refund (placeholder)

## Sprint 16 — Reconciliation Engine
- [x] Reconciliation list page
- [x] Start reconciliation form
- [x] Running difference calculation
- [x] Reconciliation history
- [ ] Undo reconciliation (placeholder)

## Sprint 17 — Journal Entries, Rules & Bookmarks
- [x] Journal Entry form
- [ ] Rules engine (placeholder)
- [ ] Bookmarks functionality (placeholder)
- [ ] Feed/activity page (placeholder)
- [x] Audit log page

## Sprint 18 — Settings & Company Profile
- [x] Settings page
- [x] Company profile
- [ ] Invoice template editor (placeholder)
- [x] Currency settings
- [ ] Data export (placeholder)
- [ ] Close Books (placeholder)

## Sprint 19 — Estimates, Bills & Advanced Workflows
- [x] Estimates list + create/update
- [ ] Estimate-to-invoice conversion (placeholder)
- [x] Bills list + create/update
- [ ] Pay Bills workflow (placeholder)
- [ ] Purchase Orders (placeholder)
- [ ] Credit Memos (placeholder)

## Sprint 20 — Polish & Launch Readiness
- [x] Accessibility audit (skip-to-content, ARIA landmarks, focus-visible, semantic nav)
- [x] Responsive design pass (mobile breakpoints at 768px and 480px)
- [x] Performance optimization (page fade-in transitions, reduced motion support)
- [x] Loading skeletons (TableSkeleton, DashboardCardSkeleton, DetailSkeleton, ReportSkeleton)
- [x] Empty states (EmptyState component with icons and CTAs)
- [x] Error boundaries (ErrorBoundary from template)
- [x] Print stylesheets (hide nav/buttons, clean table printing)
- [x] StatusBadge component (consistent status display across all pages)
- [ ] Cross-browser testing (manual verification recommended)

## Sprint 21 — Data Cleanup & Seed Guard
- [ ] Purge test invoices and customers
- [ ] Add unique constraints
- [ ] Seed script idempotency

## Sprint 22 — Double-Entry Accounting Engine
- [x] Auto journal entries for invoices/expenses/payments
- [x] Account balance recalculation from JEs
- [x] Transaction linkage (sourceType/sourceId)

## Sprint 23 — Delete, Void & Confirmation Dialogs
- [x] Delete API routes for invoices and expenses
- [x] Void invoice with reversing journal entries
- [x] Confirmation dialog component (delete/void dialogs)
- [x] Audit log on mutations

## Sprint 24 — Customer & Supplier Calculated Balances
- [x] Customer open balance from accounting engine
- [x] Customer list page with live balances and pagination
- [x] Supplier balance from accounting engine
- [x] Supplier list page with live balances and pagination

## Sprint 25 — Invoice Workflow Completion
- [x] Record Payment from invoice detail page
- [x] Partial payments with auto-status transition
- [x] Auto-status transitions (Sent → Partial → Paid)
- [x] Invoice line items seeding
- [ ] Auto invoice numbering (placeholder)

## Sprint 26 — Pagination, Sorting & Table Enhancements
- [x] Client-side pagination on Invoices, Expenses, Customers, Suppliers
- [x] Search/filter on all list pages
- [x] Column sorting on Invoices and Expenses
- [x] Status filter on Invoices
- [ ] Server-side pagination (future optimization)

## Sprint 27 — P&L and Financial Report Accuracy
- [x] P&L report powered by accounting engine (journal entries)
- [x] Balance Sheet report powered by accounting engine
- [x] Date range filtering on P&L and Balance Sheet
- [x] Dashboard P&L cards powered by accounting engine
- [x] Trial Balance report from active accounts

## Sprint 28 — Bank Transaction CSV Import
- [x] CSV import parser with column mapping
- [x] Bank transactions list with categorization UI
- [x] Import API route with validation
- [ ] Bank rules engine (future enhancement)

## Sprint 29 — File Attachments & Receipt Management
- [x] Attachments schema and API
- [x] Attachment CRUD routes (list, create, delete)
- [ ] File upload component (frontend, future enhancement)

## Sprint 30 — Invoice PDF Generation & Email
- [ ] PDF template and generation (future enhancement)
- [ ] PDF preview/download (future enhancement)
- [ ] Email delivery (future enhancement)

## Sprint 31 — Estimate & Bill Workflows
- [x] Convert estimate to invoice (one-click conversion)
- [x] Bill detail and pay bill workflow with dialog
- [x] Bill payment with journal entry recording

## Sprint 32 — Reconciliation Engine
- [x] Reconciliation CRUD API routes
- [x] Create/update reconciliation workflow
- [ ] Transaction matching interface (future enhancement)

## Sprint 33 — Sales Tax Automation
- [x] Sales Tax page with prepare/file/pay workflow
- [x] Tax filings list and status management
- [x] Tax filing update API (status transitions)

## Sprint 34 — Remaining Reports
- [x] Sales by Customer report
- [x] Sales by Product report
- [x] Transaction List by Date report
- [x] Customer/Supplier Balance reports
- [ ] Export CSV on all reports (future enhancement)

## Sprint 35 — Chart of Accounts Management
- [x] Create Account dialog with type/detail selection
- [x] Edit Account dialog
- [x] Toggle active/inactive accounts
- [x] Account search and filtering
- [ ] Sub-account hierarchy (future enhancement)

## Sprint 36 — Recurring Transaction Engine
- [x] Create recurring transaction template dialog
- [x] Pause/resume recurring templates
- [x] Summary cards (active, paused, due this week)
- [x] Pagination and search
- [ ] Auto-generation scheduler (future enhancement)

## Sprint 37 — Settings, Users & Permissions
- [x] Company settings edit form (all fields)
- [x] Settings page with sidebar tabs
- [ ] Company logo upload (future enhancement)
- [ ] Users & permissions (future enhancement)

## Sprint 38 — Deposits, Transfers & Banking
- [x] Payments & Transfers page with tabs
- [x] Transfer funds dialog between bank accounts
- [x] Transfer API with journal entry recording
- [x] Pagination on payments and transfers
- [ ] Cheque creation (future enhancement)

## Sprint 39 — Dashboard Customization & Widgets
- [x] Dashboard powered by accounting engine P&L
- [x] Privacy mode toggle
- [ ] Widget framework with drag-and-drop (future enhancement)

## Sprint 40 — Performance & Optimization
- [x] 97 comprehensive tests passing (5 test suites)
- [x] TypeScript 0 errors
- [ ] Database indexes (future enhancement)
- [ ] Code splitting (future enhancement)

## Sprint 41 — Invoice PDF Generation & Email Delivery
- [x] Invoice PDF preview page with professional layout
- [x] PDF download button on invoice detail page
- [x] Server-side PDF data route (invoicePdf.getData)
- [ ] Email delivery (future enhancement)

## Sprint 42 — Dashboard Data Reconciliation & Seed Cleanup
- [x] Dashboard P&L card powered by accounting engine
- [x] Dashboard expense card powered by accounting engine
- [x] Recent activity feed on dashboard
- [ ] Clean up duplicate seed data (manual DB task)

## Sprint 43 — CSV/Excel Export on All Reports
- [x] Reusable CsvExportButton component
- [x] CSV export on P&L report
- [x] CSV export on Balance Sheet report
- [x] CSV export on Trial Balance report
- [x] CSV export on Aging report
- [x] CSV export on General Ledger report
- [x] Server-side csvExport.getData route

## Sprint 44 — Multi-Currency Support
- [x] Exchange rates schema and CRUD API
- [x] Exchange rates management page
- [x] Create/list exchange rates
- [ ] Currency field on invoices/expenses (future enhancement)
- [ ] Converted amounts on reports (future enhancement)

## Sprint 45 — Recurring Transaction Auto-Generation
- [x] Get due recurring transactions API
- [x] Process/generate from recurring template
- [x] Auto-advance next date after generation
- [x] Auto-gen section in RecurringTransactions page
- [ ] Cron-based scheduler (future enhancement)

## Sprint 46 — Bank Rules Engine & Smart Categorization
- [x] Bank rules schema and CRUD API
- [x] Bank Rules management page with create/edit/delete
- [x] Rule conditions (field, operator, value)
- [x] Apply rule to transactions API
- [ ] Auto-categorize on import (future enhancement)

## Sprint 47 — User Roles, Permissions & Audit Trail
- [x] Audit Trail page with filtering and pagination
- [x] Audit log API with entity type/action filters
- [ ] Role-based procedure guards (future enhancement)
- [ ] Permission checks on sensitive operations (future enhancement)

## Sprint 48 — File Attachments & Receipt Upload
- [x] FileAttachments reusable component
- [x] Attachments on Invoice detail page
- [x] Attachments on Expense detail page
- [x] Attachments CRUD API (list, create, delete)
- [ ] File upload to S3 (future enhancement)

## Sprint 49 — Reconciliation Workspace UI
- [x] Reconciliation Workspace page with account selection
- [x] Transaction list with reconcile toggle
- [x] Statement balance and difference calculation
- [x] Toggle reconciled API
- [ ] Auto-match suggestions (future enhancement)

## Sprint 50 — Mobile-Responsive & PWA Optimization
- [x] Mobile hamburger menu on DashboardLayout
- [x] Responsive sidebar with overlay on mobile
- [x] Mobile search icon button
- [x] Responsive padding on dashboard and pages
- [x] Company name hidden on small screens
- [x] 113 tests passing across 5 test suites
- [x] PWA manifest and service worker

## Enhancement A — Seed Data Cleanup & Re-Journalization
- [x] Analyzed duplicate expense records and orphaned journal entries
- [x] Built migration script to remove duplicates and orphaned JEs
- [x] Re-journalized all invoices, expenses, and payments
- [x] Dashboard figures now correct: Income $2,531.20, Expenses $978.45, Net Profit $1,552.75
- [x] All journal entries balanced (total debits = total credits = $221,881.57)

## Enhancement B — Invoice Email Delivery
- [x] Wire notification API for invoice email (notifyOwner)
- [x] "Email Invoice" button on invoice detail page
- [x] Email dialog with recipient, optional message, and invoice summary
- [x] Auto-marks invoice as Sent after email delivery

## Enhancement C — PWA Manifest & Offline Caching
- [x] manifest.json with app metadata, theme color, and 8 icon sizes
- [x] Service worker with cache-first for static assets, network-first for pages
- [x] Service worker registered in index.html on load
- [x] Apple mobile web app meta tags for iOS installability
- [x] PWA icons uploaded to CDN (QB branded)
- [x] 117 tests passing across 5 test suites

## Enhancement D — Server-Generated Invoice PDF
- [x] Install PDF generation library (PDFKit)
- [x] Create server-side PDF generation route
- [x] Branded template with company logo, address, payment terms
- [x] Line items table with totals, tax, and due date
- [x] Download PDF button on invoice detail page
- [x] Replace browser-print preview with server PDF

## Enhancement E — Dashboard Widget Customization
- [x] Widget configuration schema (show/hide, order)
- [x] Customize panel/dialog with widget toggles
- [x] Drag-and-drop widget reordering
- [x] Persist widget layout to localStorage per user
- [x] Default layout for new users

## Enhancement F — In-App Notification Center
- [x] Notification bell icon in header with badge count
- [x] Notification dropdown panel with grouped alerts
- [x] Overdue invoice alerts (high severity)
- [x] Upcoming recurring transaction alerts (medium severity)
- [x] Low bank balance alerts (warning severity)
- [x] Mark as read / dismiss functionality (localStorage persistence)
- [x] Server-side notification generation route (getNotificationAlerts)
- [x] Clear all button and auto-refresh every 60 seconds
- [x] 123 tests passing across 5 test suites

## Enhancement G — Advanced Reporting with Charts
- [x] Recharts bar chart on P&L report (income vs expenses by month)
- [x] Recharts stacked area chart on Balance Sheet (asset/liability/equity trends)
- [x] Custom date range picker with presets (This Month, Last Month, This Quarter, This Year, Last Year, Custom)
- [x] Year-over-Year comparison toggle on P&L report with dual-year bar chart
- [x] Monthly P&L API endpoint (charts.monthlyProfitLoss)
- [x] Monthly Balance Sheet API endpoint (charts.monthlyBalanceSheet)
- [x] Chart/Table view toggle on both P&L and Balance Sheet reports
- [x] Chart export via Print and CSV Export buttons
- [x] Responsive chart sizing with ResponsiveContainer

## Enhancement H — Batch Operations
- [x] Multi-select checkbox column on Invoices list
- [x] Bulk action toolbar with Send, Mark Paid, Delete, Export
- [x] Bulk status change (Mark as Sent, Mark as Paid) with confirmation dialog
- [x] Bulk delete invoices with confirmation dialog and journal entry reversal
- [x] Multi-select checkbox column on Expenses list
- [x] Bulk delete expenses with confirmation dialog and journal entry reversal
- [x] Select all / deselect all toggle on both lists
- [x] Clear selection button
- [x] Server-side bulk operations API (bulk.updateInvoiceStatus, bulk.deleteInvoices, bulk.deleteExpenses)

## Enhancement I — Customizable Email Templates
- [x] Email templates database schema (name, subject, body, type, isDefault)
- [x] Email templates CRUD API (create, read, update, delete, list by type)
- [x] Email template editor page in Settings tab
- [x] Textarea editor for template body with merge field reference
- [x] Merge field insertion ({{customer_name}}, {{invoice_number}}, {{amount_due}}, {{company_name}}, etc.)
- [x] Template types: invoice_reminder, payment_receipt, estimate_followup, general
- [x] Default templates seeded on first create
- [x] Template selection dropdown in Invoice Detail email dialog
- [x] Auto-merge fields when template selected (customer name, invoice number, amounts)
- [x] 140 tests passing across 5 test suites

## Enhancement J — Recurring Invoice Auto-Generation
- [x] recurringGenerationLog table for tracking auto-generated invoices
- [x] Auto-generation logic: processAll creates invoices/expenses from due recurring templates
- [x] Generation log tab showing date, template, type, status, generated ID, and error
- [x] Enhanced recurring transactions UI with Templates and Generation Log tabs
- [x] Manual "Generate Now" (lightning bolt) button per template row
- [x] "Process All" button in header with due count badge
- [x] Summary stats cards: Total Templates, Active, Paused, Due This Week
- [x] Search and type filter on templates list
- [x] Pagination on templates list (20 per page)

## Enhancement K — Multi-Currency Support
- [x] Currency field on invoices table (default CAD)
- [x] Currency selector dropdown on invoice creation/edit form
- [x] Exchange rates management page with summary cards (Active Pairs, Total Rates, Home Currency)
- [x] Quick Currency Converter with real-time conversion using stored rates
- [x] Latest rates by pair display
- [x] Full rate history table with source tracking
- [x] Add Rate dialog for manual rate entry
- [x] Currency conversion API endpoint (exchangeRates.convert)
- [x] 9 supported currencies: CAD, USD, EUR, GBP, JPY, CHF, AUD, MXN, CNY

## Enhancement L — Audit Trail / Activity Log
- [x] Audit log database table with action, entityType, entityId, userId, details (JSON), timestamp
- [x] Server-side audit logging on all invoice, expense, and customer mutations
- [x] Activity log page with chronological event list grouped by date
- [x] Filter by entity type (Customer, Expense, Invoice)
- [x] Filter by action type (Auto generate, Create, Status → Sent, Update)
- [x] Filter by date range (start/end date pickers)
- [x] Search across audit log entries
- [x] Detail expansion panel showing metadata (invoiceNumber, total, currency, etc.)
- [x] Color-coded action badges with entity-type icons
- [x] Summary stats: Total Events, Creates, Updates, Deletes, Entity Types
- [x] Export audit log to CSV
- [x] Refresh button for real-time updates
- [x] 153 tests passing across 5 test suites
