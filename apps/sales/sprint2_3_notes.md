# Sprint 2-3 Progress Notes

## Issues Found
1. **Invoices page**: All amounts showing $0.00 - the `totalAmount` field in the invoices table is likely not populated in the seed data, or the column name doesn't match what the frontend expects.
2. Need to check the seed script and the DB query to ensure invoice amounts are properly stored and returned.

## Pages Migrated to Live API
- Home.tsx ✅ (live dashboard data)
- Invoices.tsx ✅ (but amounts are $0.00)
- Customers.tsx ✅
- Expenses.tsx ✅
- ChartOfAccounts.tsx ✅
- ProductsServices.tsx ✅
- Suppliers.tsx ✅
- SalesTax.tsx ✅
- BankTransactions.tsx ✅
- Reports.tsx ✅ (static report directory, no data dependency)
