# Data Issues to Fix

## 1. Duplicate System Accounts
- #68 "Accounts Receivable" (Accounts Receivable) - created by accounting engine
- #2 "Accounts Receivable (A/R)" (Accounts receivable (A/R)) - original from QB seed
- #70 "Accounts Payable" (Accounts Payable) - created by accounting engine
- #8 "Accounts Payable (A/P)" (Accounts payable (A/P)) - original from QB seed
- #71 "Miscellaneous Expenses" (Expenses) - created by accounting engine
- #69 "GST/HST Receivable" (Other Current Assets) - created by accounting engine

## 2. All expenses going to "Miscellaneous Expenses" (#71)
- The seed script puts all expenses into Miscellaneous Expenses
- Should use the proper expense category accounts (QuickBooks Payments Fees, etc.)

## 3. Bank balance is wrong
- RusingAcademy bank: -$209,780.71 (all expenses debited from bank)
- The large expenses ($193K, $7K, $5K, etc.) are making this very negative
- These are real QB data so they should stay, but need proper categorization

## 4. No invoices are linked to proper customer IDs in journal entries
- Journal entries have customerId but need to verify they match

## Fix Plan:
1. Merge duplicate accounts (use original QB accounts, update JE lines to point to them)
2. Re-journalize expenses with proper category accounts
3. Recalculate all account balances
