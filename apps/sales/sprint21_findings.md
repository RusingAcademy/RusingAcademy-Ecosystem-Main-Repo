# Sprint 21 Findings

## Current Database State
- Customers: 40 (clean, no test data — original QB data)
- Invoices: 11 (clean, original QB data)
- Suppliers: 9 (8 were added by tests, original was 1)
- Expenses: 23 (7 added by tests, original was 16)
- Invoice items table: DOES NOT EXIST — schema defines it but migration never ran
- Journal entry lines table: needs verification

## Key Issues
1. invoice_items table missing — need to run db:push
2. Supplier count inflated (9 vs original 1)
3. Expense count inflated (23 vs original 16)
4. No journal entries exist yet — double-entry engine needed
5. No unique constraint on invoice numbers

## Sprint 21 Actions
1. Clean up test suppliers and expenses
2. Run db:push to create missing tables (invoice_items, journal_entry_lines)
3. Add unique constraints
4. Seed invoice line items
5. Make seed script idempotent
