# Data Analysis - Root Cause

## Key Finding
The journal entries are **balanced** (total debits = total credits = $1,138,414.90), but the **accounting direction is inverted** for the seed data:

- **Income (Sales)**: Debits $62,665 > Credits $13,113 → Net balance = +$49,552 (WRONG: income should have more credits)
- **Expenses**: Debits $219,131 < Credits $842,153 → Net balance = -$623,022 (WRONG: expenses should have more debits)
- **Bank**: Debits $839,757 > Credits $210,741 → Net balance = +$629,016

## What Happened
The seed data was generated with inverted debit/credit entries:
- When recording expenses, credits went to Expense accounts (should be debits)
- When recording income, debits went to Income accounts (should be credits)
- This creates negative P&L numbers on the dashboard

## Fix Strategy
1. **Delete all existing journal entries and lines** (they're seed data with no source tracking)
2. **Re-create journal entries** from the actual invoice and expense records with correct debit/credit direction
3. Remove the 3 duplicate expenses
4. This will give the dashboard correct, positive P&L figures
