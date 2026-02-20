/**
 * Seed Journal Entries
 * 
 * This script creates journal entries for all existing transactions
 * (invoices, expenses) to populate the double-entry accounting ledger.
 */

import 'dotenv/config';
import { drizzle } from "drizzle-orm/mysql2";
import { sql, eq, and } from "drizzle-orm";

const db = drizzle(process.env.DATABASE_URL);

// Helper: Find or create system account
async function findOrCreateAccount(name, accountType) {
  const rows = await db.execute(
    sql`SELECT * FROM accounts WHERE name = ${name} AND accountType = ${accountType} LIMIT 1`
  );
  const existing = rows[0]?.[0] || rows[0];
  if (existing && existing.id) return existing;

  await db.execute(
    sql`INSERT INTO accounts (name, accountType, detailType, description, balance, isActive)
        VALUES (${name}, ${accountType}, ${name}, ${`System account: ${name}`}, '0.00', true)`
  );
  const rows2 = await db.execute(
    sql`SELECT * FROM accounts WHERE name = ${name} AND accountType = ${accountType} LIMIT 1`
  );
  const created = rows2[0]?.[0] || rows2[0];
  return created;
}

// Generate entry number
let entryCounter = 0;
async function nextEntryNumber() {
  entryCounter++;
  return `JE-${String(entryCounter).padStart(4, "0")}`;
}

// Create balanced journal entry
async function createJE(entryDate, memo, lines) {
  const entryNumber = await nextEntryNumber();
  
  // Validate balance
  let totalDebit = 0, totalCredit = 0;
  for (const l of lines) {
    totalDebit += parseFloat(l.debit || "0");
    totalCredit += parseFloat(l.credit || "0");
  }
  const diff = Math.abs(Math.round(totalDebit * 100) - Math.round(totalCredit * 100));
  if (diff > 0) {
    console.warn(`  SKIP unbalanced: ${memo} (D=${totalDebit.toFixed(2)}, C=${totalCredit.toFixed(2)})`);
    return null;
  }

  await db.execute(
    sql`INSERT INTO journal_entries (entryNumber, entryDate, memo, isAdjusting)
        VALUES (${entryNumber}, ${entryDate}, ${memo}, false)`
  );
  const entryResult = await db.execute(sql`SELECT LAST_INSERT_ID() as id`);
  const entry = entryResult[0]?.[0] || entryResult[0];
  const entryId = entry.id;

  for (let i = 0; i < lines.length; i++) {
    const l = lines[i];
    await db.execute(
      sql`INSERT INTO journal_entry_lines (journalEntryId, accountId, debit, credit, description, customerId, supplierId, sortOrder)
          VALUES (${entryId}, ${l.accountId}, ${l.debit || "0.00"}, ${l.credit || "0.00"}, ${l.description || ""}, ${l.customerId || null}, ${l.supplierId || null}, ${i})`
    );
  }

  return entryId;
}

async function main() {
  console.log("=== Seeding Journal Entries for Existing Transactions ===\n");

  // Clear existing journal entries
  await db.execute(sql`DELETE FROM journal_entry_lines`);
  await db.execute(sql`DELETE FROM journal_entries`);
  console.log("Cleared existing journal entries.\n");

  // Find/create system accounts
  const arAccount = await findOrCreateAccount("Accounts Receivable", "Accounts Receivable");
  const salesAccount = await findOrCreateAccount("Sales", "Income");
  const bankAccount = await findOrCreateAccount("RusingAcademy", "Bank");
  const gstPayable = await findOrCreateAccount("GST/HST Payable", "Other Current Liabilities");
  const gstReceivable = await findOrCreateAccount("GST/HST Receivable", "Other Current Assets");
  const apAccount = await findOrCreateAccount("Accounts Payable", "Accounts Payable");
  const miscExpense = await findOrCreateAccount("Miscellaneous Expenses", "Expenses");

  console.log("System accounts ready:");
  console.log(`  AR: ${arAccount.id}, Sales: ${salesAccount.id}, Bank: ${bankAccount.id}`);
  console.log(`  GST Payable: ${gstPayable.id}, GST Receivable: ${gstReceivable.id}`);
  console.log(`  AP: ${apAccount.id}, Misc Expense: ${miscExpense.id}\n`);

  // ─── Journalize Invoices ───────────────────────────────────────────
  const invoiceResult = await db.execute(sql`SELECT * FROM invoices WHERE status != 'Voided'`);
  const invoiceRows = Array.isArray(invoiceResult[0]) ? invoiceResult[0] : invoiceResult;
  console.log(`Journalizing ${invoiceRows.length} invoices...`);

  for (const inv of invoiceRows) {
    const total = parseFloat(inv.total || "0");
    if (total === 0) continue;

    const taxAmount = parseFloat(inv.taxAmount || "0");
    const subtotal = total - taxAmount;

    const lines = [
      { accountId: arAccount.id, debit: total.toFixed(2), description: `Invoice ${inv.invoiceNumber}`, customerId: inv.customerId },
      { accountId: salesAccount.id, credit: subtotal.toFixed(2), description: `Invoice ${inv.invoiceNumber} - Sales` },
    ];

    if (taxAmount > 0) {
      lines.push({ accountId: gstPayable.id, credit: taxAmount.toFixed(2), description: `Invoice ${inv.invoiceNumber} - Tax` });
    }

    const jeId = await createJE(inv.invoiceDate, `Invoice ${inv.invoiceNumber}`, lines);
    if (jeId) console.log(`  ✓ Invoice ${inv.invoiceNumber}: $${total.toFixed(2)}`);
  }

  // ─── Journalize Expenses ───────────────────────────────────────────
  const expenseResult = await db.execute(sql`SELECT * FROM expenses`);
  const expenseRows = Array.isArray(expenseResult[0]) ? expenseResult[0] : expenseResult;
  console.log(`\nJournalizing ${expenseRows.length} expenses...`);

  for (const exp of expenseRows) {
    const total = parseFloat(exp.total || "0");
    if (total === 0) continue;

    // Find the expense account if specified
    let expAccountId = miscExpense.id;
    if (exp.accountId) {
      const acctResult = await db.execute(sql`SELECT id FROM accounts WHERE id = ${exp.accountId} LIMIT 1`);
      const acct = acctResult[0]?.[0] || acctResult[0];
      if (acct && acct.id) expAccountId = acct.id;
    }

    const taxAmount = parseFloat(exp.taxAmount || "0");
    const subtotal = total - taxAmount;

    const lines = [
      { accountId: expAccountId, debit: subtotal.toFixed(2), description: `Expense: ${exp.payeeName || "Unknown"}` },
    ];

    if (taxAmount > 0) {
      lines.push({ accountId: gstReceivable.id, debit: taxAmount.toFixed(2), description: `Tax on expense` });
    }

    lines.push({ accountId: bankAccount.id, credit: total.toFixed(2), description: `Payment for expense` });

    const jeId = await createJE(exp.expenseDate, `Expense to ${exp.payeeName || "Unknown"}`, lines);
    if (jeId) console.log(`  ✓ Expense ${exp.id}: $${total.toFixed(2)} to ${exp.payeeName || "Unknown"}`);
  }

  // ─── Recalculate All Account Balances ──────────────────────────────
  console.log("\nRecalculating all account balances...");

  const allAccountsResult = await db.execute(sql`SELECT id, name, accountType FROM accounts`);
  const allAccounts = Array.isArray(allAccountsResult[0]) ? allAccountsResult[0] : allAccountsResult;
  const normalDebitTypes = ["Bank", "Accounts Receivable", "Other Current Assets", "Fixed Assets", "Other Assets", "Cost of Goods Sold", "Expenses", "Other Expenses"];

  for (const acct of allAccounts) {
    if (!acct.id) continue;
    const totalsResult = await db.execute(
      sql`SELECT COALESCE(SUM(debit), 0) as totalDebit, COALESCE(SUM(credit), 0) as totalCredit
          FROM journal_entry_lines WHERE accountId = ${acct.id}`
    );
    const totals = totalsResult[0]?.[0] || totalsResult[0];

    const totalDebit = parseFloat(totals?.totalDebit || "0");
    const totalCredit = parseFloat(totals?.totalCredit || "0");
    const isNormalDebit = normalDebitTypes.includes(acct.accountType);
    const balance = isNormalDebit ? (totalDebit - totalCredit) : (totalCredit - totalDebit);

    if (balance !== 0) {
      await db.execute(sql`UPDATE accounts SET balance = ${balance.toFixed(2)} WHERE id = ${acct.id}`);
      console.log(`  ${acct.name}: $${balance.toFixed(2)}`);
    }
  }

  // ─── Summary ───────────────────────────────────────────────────────
  const jeCountResult = await db.execute(sql`SELECT COUNT(*) as cnt FROM journal_entries`);
  const jeCount = jeCountResult[0]?.[0] || jeCountResult[0];
  const jelCountResult = await db.execute(sql`SELECT COUNT(*) as cnt FROM journal_entry_lines`);
  const jelCount = jelCountResult[0]?.[0] || jelCountResult[0];
  console.log(`\n=== Done ===`);
  console.log(`Journal Entries: ${jeCount.cnt}`);
  console.log(`Journal Entry Lines: ${jelCount.cnt}`);

  process.exit(0);
}

main().catch(e => { console.error(e); process.exit(1); });
