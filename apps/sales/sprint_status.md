# Sprint Status Notes

## Current State After web-db-user Upgrade
- TypeScript: No errors
- Dev server: Running on port 3000
- All 10 pages intact: Home, Invoices, Customers, Expenses, ChartOfAccounts, ProductsServices, Suppliers, SalesTax, Reports, BankTransactions
- DashboardLayout: Custom QB sidebar preserved
- Home.tsx: Fixed - removed injected useAuth line
- Data: All in client/src/lib/data.ts (static)
- Database: users table only (from template)
- Server: routers.ts has auth only
- Auth: Manus OAuth wired

## Sprint 1 Tasks Remaining
1. Design full database schema in drizzle/schema.ts
2. Push migrations with pnpm db:push
3. Create seed script to populate DB with all data from data.ts
4. Create tRPC routers for all entities
5. Wire frontend to use tRPC instead of static data

## Key Architecture Decisions
- Keep data.ts as fallback/seed source
- Build tRPC routers per entity: invoices, customers, expenses, accounts, products, suppliers, salesTax, reports, bankTransactions
- Use protectedProcedure for all data mutations
- Use publicProcedure for read operations (for now)
