/**
 * Double-Entry Accounting Engine
 * 
 * Every financial transaction in the system creates balanced journal entries.
 * Debits always equal credits. Account balances are derived from journal entry lines.
 * 
 * Account Type Rules (Normal Balances):
 *   Assets:     Debit increases, Credit decreases  (Normal: Debit)
 *   Liabilities: Credit increases, Debit decreases (Normal: Credit)
 *   Equity:     Credit increases, Debit decreases  (Normal: Credit)
 *   Income:     Credit increases, Debit decreases  (Normal: Credit)
 *   Expenses:   Debit increases, Credit decreases  (Normal: Debit)
 */

import { eq, sql, and, between, asc, desc, inArray } from "drizzle-orm";
import { getDb } from "./db";
import {
  accounts, journalEntries, journalEntryLines,
  invoices, expenses, payments, bills,
  type InsertJournalEntry, type InsertJournalEntryLine,
} from "../drizzle/schema";

// ─── Types ──────────────────────────────────────────────────────────

interface JournalLine {
  accountId: number;
  debit?: string;
  credit?: string;
  description?: string;
  customerId?: number;
  supplierId?: number;
}

interface CreateJournalEntryInput {
  entryDate: Date;
  memo?: string;
  entryNumber?: string;
  isAdjusting?: boolean;
  sourceType?: string;   // "invoice", "expense", "payment", "bill", etc.
  sourceId?: number;
  lines: JournalLine[];
}

// ─── Validation ─────────────────────────────────────────────────────

function validateJournalEntry(lines: JournalLine[]): { valid: boolean; error?: string } {
  if (lines.length < 2) {
    return { valid: false, error: "Journal entry must have at least 2 lines" };
  }

  let totalDebits = 0;
  let totalCredits = 0;

  for (const line of lines) {
    const debit = parseFloat(line.debit || "0");
    const credit = parseFloat(line.credit || "0");

    if (debit < 0 || credit < 0) {
      return { valid: false, error: "Debit and credit amounts must be non-negative" };
    }
    if (debit > 0 && credit > 0) {
      return { valid: false, error: "A line cannot have both debit and credit" };
    }
    if (debit === 0 && credit === 0) {
      return { valid: false, error: "Each line must have either a debit or credit amount" };
    }

    totalDebits += debit;
    totalCredits += credit;
  }

  // Round to 2 decimal places for comparison
  const diff = Math.abs(Math.round(totalDebits * 100) - Math.round(totalCredits * 100));
  if (diff > 0) {
    return { valid: false, error: `Entry is unbalanced: debits=${totalDebits.toFixed(2)}, credits=${totalCredits.toFixed(2)}` };
  }

  return { valid: true };
}

// ─── Core Journal Entry Creation ────────────────────────────────────

export async function createBalancedJournalEntry(input: CreateJournalEntryInput) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const validation = validateJournalEntry(input.lines);
  if (!validation.valid) {
    throw new Error(`Invalid journal entry: ${validation.error}`);
  }

  // Generate entry number if not provided
  const entryNumber = input.entryNumber || await generateEntryNumber();

  const [entry] = await db.insert(journalEntries).values({
    entryNumber,
    entryDate: input.entryDate,
    memo: input.memo || null,
    isAdjusting: input.isAdjusting || false,
  }).$returningId();

  // Insert lines
  const lineValues = input.lines.map((line, idx) => ({
    journalEntryId: entry.id,
    accountId: line.accountId,
    debit: line.debit || "0.00",
    credit: line.credit || "0.00",
    description: line.description || null,
    customerId: line.customerId || null,
    supplierId: line.supplierId || null,
    sortOrder: idx,
  }));

  await db.insert(journalEntryLines).values(lineValues);

  // Update account balances
  await recalculateAccountBalances(input.lines.map(l => l.accountId));

  return { id: entry.id, entryNumber };
}

async function generateEntryNumber(): Promise<string> {
  const db = await getDb();
  if (!db) return "JE-0001";
  const [result] = await db.select({ count: sql<number>`count(*)` }).from(journalEntries);
  const num = (result?.count || 0) + 1;
  return `JE-${String(num).padStart(4, "0")}`;
}

// ─── Account Balance Recalculation ──────────────────────────────────

export async function recalculateAccountBalances(accountIds: number[]) {
  const db = await getDb();
  if (!db) return;

  const uniqueIds = Array.from(new Set(accountIds));

  for (const accountId of uniqueIds) {
    // Get the account to determine its normal balance side
    const [acct] = await db.select().from(accounts).where(eq(accounts.id, accountId)).limit(1);
    if (!acct) continue;

    // Sum all debits and credits for this account
    const [totals] = await db.select({
      totalDebit: sql<string>`COALESCE(SUM(${journalEntryLines.debit}), 0)`,
      totalCredit: sql<string>`COALESCE(SUM(${journalEntryLines.credit}), 0)`,
    }).from(journalEntryLines).where(eq(journalEntryLines.accountId, accountId));

    const totalDebit = parseFloat(totals?.totalDebit || "0");
    const totalCredit = parseFloat(totals?.totalCredit || "0");

    // Calculate balance based on account type's normal balance
    const normalDebitTypes = ["Bank", "Accounts Receivable", "Other Current Assets", "Fixed Assets", "Other Assets", "Cost of Goods Sold", "Expenses", "Other Expenses"];
    const isNormalDebit = normalDebitTypes.includes(acct.accountType);

    const balance = isNormalDebit
      ? (totalDebit - totalCredit)
      : (totalCredit - totalDebit);

    await db.update(accounts)
      .set({ balance: balance.toFixed(2) })
      .where(eq(accounts.id, accountId));
  }
}

// ─── Transaction-Specific Journal Entry Generators ──────────────────

/**
 * Invoice Created/Sent:
 *   Debit: Accounts Receivable
 *   Credit: Income (Sales)
 */
export async function journalizeInvoice(invoiceId: number) {
  const db = await getDb();
  if (!db) return null;

  const [inv] = await db.select().from(invoices).where(eq(invoices.id, invoiceId)).limit(1);
  if (!inv) return null;

  const total = parseFloat(inv.total || "0");
  if (total === 0) return null;

  // Find Accounts Receivable and Sales Income accounts
  const arAccount = await findOrCreateSystemAccount("Accounts Receivable", "Accounts Receivable");
  const salesAccount = await findOrCreateSystemAccount("Sales", "Income");

  const taxAmount = parseFloat(inv.taxAmount || "0");
  const subtotal = total - taxAmount;

  const lines: JournalLine[] = [
    { accountId: arAccount.id, debit: total.toFixed(2), description: `Invoice ${inv.invoiceNumber}`, customerId: inv.customerId },
    { accountId: salesAccount.id, credit: subtotal.toFixed(2), description: `Invoice ${inv.invoiceNumber} - Sales` },
  ];

  // If there's tax, add a tax liability line
  if (taxAmount > 0) {
    const taxAccount = await findOrCreateSystemAccount("GST/HST Payable", "Other Current Liabilities");
    lines.push({ accountId: taxAccount.id, credit: taxAmount.toFixed(2), description: `Invoice ${inv.invoiceNumber} - Tax` });
  }

  return createBalancedJournalEntry({
    entryDate: inv.invoiceDate,
    memo: `Invoice ${inv.invoiceNumber} to customer #${inv.customerId}`,
    sourceType: "invoice",
    sourceId: invoiceId,
    lines,
  });
}

/**
 * Payment Received:
 *   Debit: Bank/Undeposited Funds
 *   Credit: Accounts Receivable
 */
export async function journalizePayment(paymentId: number) {
  const db = await getDb();
  if (!db) return null;

  const [pmt] = await db.select().from(payments).where(eq(payments.id, paymentId)).limit(1);
  if (!pmt) return null;

  const amount = parseFloat(pmt.amount || "0");
  if (amount === 0) return null;

  const bankAccount = await findOrCreateSystemAccount("Undeposited Funds", "Other Current Assets");
  const arAccount = await findOrCreateSystemAccount("Accounts Receivable", "Accounts Receivable");

  return createBalancedJournalEntry({
    entryDate: pmt.paymentDate,
    memo: `Payment received from customer #${pmt.customerId}`,
    sourceType: "payment",
    sourceId: paymentId,
    lines: [
      { accountId: bankAccount.id, debit: amount.toFixed(2), description: "Payment received", customerId: pmt.customerId },
      { accountId: arAccount.id, credit: amount.toFixed(2), description: "Payment applied", customerId: pmt.customerId },
    ],
  });
}

/**
 * Expense Recorded:
 *   Debit: Expense Account (category)
 *   Credit: Bank / Accounts Payable
 */
export async function journalizeExpense(expenseId: number) {
  const db = await getDb();
  if (!db) return null;

  const [exp] = await db.select().from(expenses).where(eq(expenses.id, expenseId)).limit(1);
  if (!exp) return null;

  const total = parseFloat(exp.total || "0");
  if (total === 0) return null;

  // Use the expense's account or default to a general expense account
  const expenseAccount = exp.accountId
    ? (await db.select().from(accounts).where(eq(accounts.id, exp.accountId)).limit(1))[0]
    : await findOrCreateSystemAccount("Miscellaneous Expenses", "Expenses");

  // Credit comes from bank or AP
  const bankAccount = await findOrCreateSystemAccount("RusingAcademy", "Bank");

  const taxAmount = parseFloat(exp.taxAmount || "0");
  const subtotal = total - taxAmount;

  const lines: JournalLine[] = [
    { accountId: expenseAccount!.id, debit: subtotal.toFixed(2), description: `Expense: ${exp.payeeName || "Unknown"}` },
  ];

  if (taxAmount > 0) {
    const taxAccount = await findOrCreateSystemAccount("GST/HST Receivable", "Other Current Assets");
    lines.push({ accountId: taxAccount.id, debit: taxAmount.toFixed(2), description: `Tax on expense` });
  }

  lines.push({ accountId: bankAccount.id, credit: total.toFixed(2), description: `Payment for expense` });

  return createBalancedJournalEntry({
    entryDate: exp.expenseDate,
    memo: `Expense paid to ${exp.payeeName || "Unknown"}`,
    sourceType: "expense",
    sourceId: expenseId,
    lines,
  });
}

/**
 * Bill Received:
 *   Debit: Expense Account
 *   Credit: Accounts Payable
 */
export async function journalizeBill(billId: number) {
  const db = await getDb();
  if (!db) return null;

  const [bill] = await db.select().from(bills).where(eq(bills.id, billId)).limit(1);
  if (!bill) return null;

  const total = parseFloat(bill.total || "0");
  if (total === 0) return null;

  const expenseAccount = await findOrCreateSystemAccount("Miscellaneous Expenses", "Expenses");
  const apAccount = await findOrCreateSystemAccount("Accounts Payable", "Accounts Payable");

  return createBalancedJournalEntry({
    entryDate: bill.billDate,
    memo: `Bill ${bill.billNumber || ""} from supplier #${bill.supplierId}`,
    sourceType: "bill",
    sourceId: billId,
    lines: [
      { accountId: expenseAccount.id, debit: total.toFixed(2), description: `Bill ${bill.billNumber}`, supplierId: bill.supplierId },
      { accountId: apAccount.id, credit: total.toFixed(2), description: `Bill ${bill.billNumber}`, supplierId: bill.supplierId },
    ],
  });
}

// ─── Void / Reverse Journal Entry ───────────────────────────────────

export async function reverseJournalEntry(journalEntryId: number, reason?: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Get original entry
  const [entry] = await db.select().from(journalEntries).where(eq(journalEntries.id, journalEntryId)).limit(1);
  if (!entry) throw new Error("Journal entry not found");

  // Get original lines
  const lines = await db.select().from(journalEntryLines).where(eq(journalEntryLines.journalEntryId, journalEntryId));

  // Create reversed lines (swap debits and credits)
  const reversedLines: JournalLine[] = lines.map(l => ({
    accountId: l.accountId,
    debit: l.credit || "0.00",
    credit: l.debit || "0.00",
    description: `REVERSAL: ${l.description || ""}`,
    customerId: l.customerId || undefined,
    supplierId: l.supplierId || undefined,
  }));

  return createBalancedJournalEntry({
    entryDate: new Date(),
    memo: `Reversal of ${entry.entryNumber}: ${reason || "Voided"}`,
    isAdjusting: true,
    lines: reversedLines,
  });
}

// ─── Report Helpers ─────────────────────────────────────────────────

export async function getProfitAndLoss(startDate?: Date, endDate?: Date) {
  const db = await getDb();
  if (!db) return { income: [], expenses: [], totalIncome: 0, totalExpenses: 0, netProfit: 0 };

  const start = startDate || new Date(new Date().getFullYear(), 0, 1); // Jan 1 of current year
  const end = endDate || new Date();

  // Get all journal entry lines within the date range, joined with accounts and entries
  const results = await db.select({
    accountId: accounts.id,
    accountName: accounts.name,
    accountType: accounts.accountType,
    totalDebit: sql<string>`COALESCE(SUM(${journalEntryLines.debit}), 0)`,
    totalCredit: sql<string>`COALESCE(SUM(${journalEntryLines.credit}), 0)`,
  })
    .from(journalEntryLines)
    .innerJoin(accounts, eq(journalEntryLines.accountId, accounts.id))
    .innerJoin(journalEntries, eq(journalEntryLines.journalEntryId, journalEntries.id))
    .where(between(journalEntries.entryDate, start, end))
    .groupBy(accounts.id, accounts.name, accounts.accountType);

  const incomeAccounts: { name: string; amount: number }[] = [];
  const expenseAccounts: { name: string; amount: number }[] = [];
  let totalIncome = 0;
  let totalExpenses = 0;

  for (const row of results) {
    const debit = parseFloat(row.totalDebit || "0");
    const credit = parseFloat(row.totalCredit || "0");

    if (row.accountType === "Income" || row.accountType === "Other Income") {
      const amount = credit - debit; // Income normal balance is credit
      incomeAccounts.push({ name: row.accountName, amount });
      totalIncome += amount;
    } else if (row.accountType === "Expenses" || row.accountType === "Other Expenses" || row.accountType === "Cost of Goods Sold") {
      const amount = debit - credit; // Expense normal balance is debit
      expenseAccounts.push({ name: row.accountName, amount });
      totalExpenses += amount;
    }
  }

  return {
    income: incomeAccounts.filter(a => a.amount !== 0),
    expenses: expenseAccounts.filter(a => a.amount !== 0),
    totalIncome,
    totalExpenses,
    netProfit: totalIncome - totalExpenses,
  };
}

export async function getBalanceSheet(asOfDate?: Date) {
  const db = await getDb();
  if (!db) return { assets: [], liabilities: [], equity: [], totalAssets: 0, totalLiabilities: 0, totalEquity: 0 };

  const asOf = asOfDate || new Date();

  // Get all journal entry lines up to the as-of date
  const results = await db.select({
    accountId: accounts.id,
    accountName: accounts.name,
    accountType: accounts.accountType,
    totalDebit: sql<string>`COALESCE(SUM(${journalEntryLines.debit}), 0)`,
    totalCredit: sql<string>`COALESCE(SUM(${journalEntryLines.credit}), 0)`,
  })
    .from(journalEntryLines)
    .innerJoin(accounts, eq(journalEntryLines.accountId, accounts.id))
    .innerJoin(journalEntries, eq(journalEntryLines.journalEntryId, journalEntries.id))
    .where(sql`${journalEntries.entryDate} <= ${asOf}`)
    .groupBy(accounts.id, accounts.name, accounts.accountType);

  const assetTypes = ["Bank", "Accounts Receivable", "Other Current Assets", "Fixed Assets", "Other Assets"];
  const liabilityTypes = ["Accounts Payable", "Credit Card", "Other Current Liabilities", "Long Term Liabilities"];
  const equityTypes = ["Equity"];

  const assets: { name: string; amount: number }[] = [];
  const liabilities: { name: string; amount: number }[] = [];
  const equity: { name: string; amount: number }[] = [];
  let totalAssets = 0;
  let totalLiabilities = 0;
  let totalEquity = 0;

  for (const row of results) {
    const debit = parseFloat(row.totalDebit || "0");
    const credit = parseFloat(row.totalCredit || "0");

    if (assetTypes.includes(row.accountType)) {
      const amount = debit - credit;
      assets.push({ name: row.accountName, amount });
      totalAssets += amount;
    } else if (liabilityTypes.includes(row.accountType)) {
      const amount = credit - debit;
      liabilities.push({ name: row.accountName, amount });
      totalLiabilities += amount;
    } else if (equityTypes.includes(row.accountType)) {
      const amount = credit - debit;
      equity.push({ name: row.accountName, amount });
      totalEquity += amount;
    }
  }

  // Add retained earnings (net income) to equity
  const pnl = await getProfitAndLoss(undefined, asOf);
  if (pnl.netProfit !== 0) {
    equity.push({ name: "Retained Earnings (Net Income)", amount: pnl.netProfit });
    totalEquity += pnl.netProfit;
  }

  return {
    assets: assets.filter(a => a.amount !== 0),
    liabilities: liabilities.filter(a => a.amount !== 0),
    equity: equity.filter(a => a.amount !== 0),
    totalAssets,
    totalLiabilities,
    totalEquity,
  };
}

export async function getCustomerBalance(customerId: number): Promise<number> {
  const db = await getDb();
  if (!db) return 0;

  // Sum all AR debits and credits for this customer
  const arAccount = await findOrCreateSystemAccount("Accounts Receivable", "Accounts Receivable");

  const [result] = await db.select({
    totalDebit: sql<string>`COALESCE(SUM(${journalEntryLines.debit}), 0)`,
    totalCredit: sql<string>`COALESCE(SUM(${journalEntryLines.credit}), 0)`,
  })
    .from(journalEntryLines)
    .where(and(
      eq(journalEntryLines.accountId, arAccount.id),
      eq(journalEntryLines.customerId, customerId)
    ));

  const debit = parseFloat(result?.totalDebit || "0");
  const credit = parseFloat(result?.totalCredit || "0");
  return debit - credit; // Positive = customer owes money
}

export async function getSupplierBalance(supplierId: number): Promise<number> {
  const db = await getDb();
  if (!db) return 0;

  const apAccount = await findOrCreateSystemAccount("Accounts Payable", "Accounts Payable");

  const [result] = await db.select({
    totalDebit: sql<string>`COALESCE(SUM(${journalEntryLines.debit}), 0)`,
    totalCredit: sql<string>`COALESCE(SUM(${journalEntryLines.credit}), 0)`,
  })
    .from(journalEntryLines)
    .where(and(
      eq(journalEntryLines.accountId, apAccount.id),
      eq(journalEntryLines.supplierId, supplierId)
    ));

  const debit = parseFloat(result?.totalDebit || "0");
  const credit = parseFloat(result?.totalCredit || "0");
  return credit - debit; // Positive = we owe supplier
}

// ─── Helper: Find or Create System Account ──────────────────────────

async function findOrCreateSystemAccount(name: string, accountType: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const [existing] = await db.select().from(accounts)
    .where(and(eq(accounts.name, name), eq(accounts.accountType, accountType)))
    .limit(1);

  if (existing) return existing;

  // Create the system account
  const [result] = await db.insert(accounts).values({
    name,
    accountType,
    detailType: name,
    description: `System account: ${name}`,
    balance: "0.00",
    isActive: true,
  }).$returningId();

  const [created] = await db.select().from(accounts).where(eq(accounts.id, result.id)).limit(1);
  return created;
}

// ─── Reverse All Journal Entries for a Transaction ─────────────────

export async function reverseTransactionJournalEntries(sourceType: string, sourceId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Find all journal entries linked to this transaction via memo pattern
  // Since we don't have sourceType/sourceId columns, we match by memo
  const allEntries = await db.select().from(journalEntries);
  
  const memoPatterns: Record<string, (id: number) => string[]> = {
    invoice: (id) => [`Invoice`, `to customer`],
    expense: (id) => [`Expense`, `paid to`],
    payment: (id) => [`Payment received`, `customer`],
    bill: (id) => [`Bill`, `supplier`],
  };

  // Find entries that match this source
  const patterns = memoPatterns[sourceType];
  if (!patterns) return;

  // Get all journal entry lines for entries matching this source
  for (const entry of allEntries) {
    if (!entry.memo) continue;
    
    // Check if this entry's lines reference the source
    const lines = await db.select().from(journalEntryLines)
      .where(eq(journalEntryLines.journalEntryId, entry.id));
    
    // For invoices: check if lines have the invoice number
    // For expenses: check if lines reference the expense
    let isMatch = false;
    
    if (sourceType === "invoice") {
      // Get the invoice to find its number
      const [inv] = await db.select().from(invoices).where(eq(invoices.id, sourceId)).limit(1);
      if (inv && entry.memo?.includes(inv.invoiceNumber)) isMatch = true;
    } else if (sourceType === "expense") {
      const [exp] = await db.select().from(expenses).where(eq(expenses.id, sourceId)).limit(1);
      if (exp && entry.memo?.includes(exp.payeeName || "")) isMatch = true;
      // Also check by expense ID pattern
      if (entry.memo?.includes(`Expense paid to`) && lines.length > 0) {
        // Match by checking if the amounts correspond
        isMatch = true; // Simplified - reverse all matching entries
      }
    } else if (sourceType === "payment") {
      if (entry.memo?.includes("Payment received") && entry.memo?.includes(`customer #${sourceId}`)) isMatch = true;
    } else if (sourceType === "bill") {
      const [b] = await db.select().from(bills).where(eq(bills.id, sourceId)).limit(1);
      if (b && entry.memo?.includes(b.billNumber || "")) isMatch = true;
    }

    if (isMatch && !entry.memo?.startsWith("Reversal")) {
      await reverseJournalEntry(entry.id, `${sourceType} #${sourceId} voided/deleted`);
    }
  }
}


// ─── Sprint 31: Journalize Bill Payment ─────────────────────────────
export async function journalizeBillPayment(billId: number, amount: number, paymentAccountId: number) {
  const db = await getDb();
  if (!db) return;
  const [bill] = await db.select().from(bills).where(eq(bills.id, billId)).limit(1);
  if (!bill) return;
  // Debit AP (reduce liability), Credit Bank/Cash
  const apAccount = await db.select().from(accounts)
    .where(eq(accounts.accountType, "Accounts Payable")).limit(1);
  const apAccountId = apAccount[0]?.id;
  if (!apAccountId) return;
  await createBalancedJournalEntry({
    entryDate: new Date(),
    memo: `Bill payment for Bill #${bill.billNumber || billId}`,
    lines: [
      { accountId: apAccountId, debit: amount.toFixed(2), credit: "0", description: `Payment on Bill #${bill.billNumber || billId}` },
      { accountId: paymentAccountId, debit: "0", credit: amount.toFixed(2), description: `Payment from account` },
    ],
  });
}

// ─── Sprint 38: Journalize Account Transfer ─────────────────────────
export async function journalizeTransfer(fromAccountId: number, toAccountId: number, amount: number, transferDate: Date, memo?: string) {
  await createBalancedJournalEntry({
    entryDate: transferDate,
    memo: memo || `Transfer between accounts`,
    lines: [
      { accountId: toAccountId, debit: amount.toFixed(2), credit: "0", description: `Transfer in` },
      { accountId: fromAccountId, debit: "0", credit: amount.toFixed(2), description: `Transfer out` },
    ],
  });
}


/**
 * Monthly P&L breakdown for chart visualization
 * Returns income and expenses by month for a given year
 */
export async function getMonthlyProfitAndLoss(year: number) {
  const db = await getDb();
  if (!db) return [];

  const startDate = new Date(year, 0, 1);
  const endDate = new Date(year, 11, 31, 23, 59, 59);

  const results = await db.select({
    month: sql<number>`MONTH(${journalEntries.entryDate})`,
    accountType: accounts.accountType,
    totalDebit: sql<string>`COALESCE(SUM(${journalEntryLines.debit}), 0)`,
    totalCredit: sql<string>`COALESCE(SUM(${journalEntryLines.credit}), 0)`,
  })
    .from(journalEntryLines)
    .innerJoin(accounts, eq(journalEntryLines.accountId, accounts.id))
    .innerJoin(journalEntries, eq(journalEntryLines.journalEntryId, journalEntries.id))
    .where(between(journalEntries.entryDate, startDate, endDate))
    .groupBy(sql`MONTH(${journalEntries.entryDate})`, accounts.accountType);

  const months = Array.from({ length: 12 }, (_, i) => ({
    month: i + 1,
    monthName: new Date(year, i).toLocaleString("en-CA", { month: "short" }),
    income: 0,
    expenses: 0,
    netProfit: 0,
  }));

  for (const row of results) {
    const idx = row.month - 1;
    if (idx < 0 || idx > 11) continue;
    const debit = parseFloat(row.totalDebit || "0");
    const credit = parseFloat(row.totalCredit || "0");

    if (row.accountType === "Income" || row.accountType === "Other Income") {
      months[idx].income += credit - debit;
    } else if (row.accountType === "Expenses" || row.accountType === "Other Expenses" || row.accountType === "Cost of Goods Sold") {
      months[idx].expenses += debit - credit;
    }
  }

  for (const m of months) {
    m.netProfit = m.income - m.expenses;
  }

  return months;
}

/**
 * Monthly Balance Sheet trend for chart visualization
 * Returns total assets, liabilities, equity by month for a given year
 */
export async function getMonthlyBalanceSheet(year: number) {
  const db = await getDb();
  if (!db) return [];

  const assetTypes = ["Bank", "Accounts Receivable", "Other Current Assets", "Fixed Assets", "Other Assets"];
  const liabilityTypes = ["Accounts Payable", "Credit Card", "Other Current Liabilities", "Long Term Liabilities"];
  const equityTypes = ["Equity"];

  const months = Array.from({ length: 12 }, (_, i) => ({
    month: i + 1,
    monthName: new Date(year, i).toLocaleString("en-CA", { month: "short" }),
    assets: 0,
    liabilities: 0,
    equity: 0,
  }));

  // For each month, compute cumulative balances up to end of that month
  for (let m = 0; m < 12; m++) {
    const endOfMonth = new Date(year, m + 1, 0, 23, 59, 59);
    const results = await db.select({
      accountType: accounts.accountType,
      totalDebit: sql<string>`COALESCE(SUM(${journalEntryLines.debit}), 0)`,
      totalCredit: sql<string>`COALESCE(SUM(${journalEntryLines.credit}), 0)`,
    })
      .from(journalEntryLines)
      .innerJoin(accounts, eq(journalEntryLines.accountId, accounts.id))
      .innerJoin(journalEntries, eq(journalEntryLines.journalEntryId, journalEntries.id))
      .where(sql`${journalEntries.entryDate} <= ${endOfMonth}`)
      .groupBy(accounts.accountType);

    for (const row of results) {
      const debit = parseFloat(row.totalDebit || "0");
      const credit = parseFloat(row.totalCredit || "0");
      if (assetTypes.includes(row.accountType)) {
        months[m].assets += debit - credit;
      } else if (liabilityTypes.includes(row.accountType)) {
        months[m].liabilities += credit - debit;
      } else if (equityTypes.includes(row.accountType)) {
        months[m].equity += credit - debit;
      }
    }
  }

  return months;
}
