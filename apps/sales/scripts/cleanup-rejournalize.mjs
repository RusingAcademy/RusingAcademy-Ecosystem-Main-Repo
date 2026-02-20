/**
 * Seed Data Cleanup & Re-Journalization Script
 * 
 * 1. Remove duplicate expenses (3 records with same payee/total/date)
 * 2. Delete all existing journal entries and lines (inverted seed data)
 * 3. Re-create journal entries from actual invoices and expenses with correct debit/credit direction
 * 4. Verify the resulting P&L is positive and makes sense
 */
import mysql from 'mysql2/promise';

const pool = mysql.createPool(process.env.DATABASE_URL);

async function run() {
  const conn = await pool.getConnection();
  
  try {
    console.log('=== Starting Seed Data Cleanup ===\n');

    // Step 1: Remove duplicate expenses
    console.log('Step 1: Removing duplicate expenses...');
    const [dupes] = await conn.query(`
      SELECT payeeName, total, expenseDate, COUNT(*) as cnt, MIN(id) as keepId
      FROM expenses
      GROUP BY payeeName, total, expenseDate
      HAVING cnt > 1
    `);
    
    let removedExpenses = 0;
    for (const dupe of dupes) {
      const [result] = await conn.query(
        'DELETE FROM expenses WHERE payeeName = ? AND total = ? AND expenseDate = ? AND id != ?',
        [dupe.payeeName, dupe.total, dupe.expenseDate, dupe.keepId]
      );
      removedExpenses += result.affectedRows;
      console.log(`  Removed ${result.affectedRows} duplicate(s) of "${dupe.payeeName}" $${dupe.total}`);
    }
    console.log(`  Total duplicates removed: ${removedExpenses}`);

    // Step 2: Delete all existing journal entry lines, then journal entries
    console.log('\nStep 2: Clearing inverted journal entries...');
    const [delLines] = await conn.query('DELETE FROM journal_entry_lines');
    console.log(`  Deleted ${delLines.affectedRows} journal entry lines`);
    const [delEntries] = await conn.query('DELETE FROM journal_entries');
    console.log(`  Deleted ${delEntries.affectedRows} journal entries`);

    // Step 3: Re-create journal entries from invoices
    console.log('\nStep 3: Re-journalizing invoices...');
    const [invoices] = await conn.query(`
      SELECT i.id, i.invoiceNumber, i.customerId, i.total, i.invoiceDate, i.status
      FROM invoices i
      WHERE i.status NOT IN ('Draft', 'Voided')
      ORDER BY i.id
    `);
    
    const AR_ACCOUNT_ID = 68;  // Accounts Receivable
    const SALES_ACCOUNT_ID = 19; // Sales (Income)
    
    let jeNumber = 1;
    let invoiceJECount = 0;
    
    for (const inv of invoices) {
      const total = parseFloat(inv.total);
      if (total <= 0) continue;
      
      const entryNum = `JE-${String(jeNumber).padStart(4, '0')}`;
      const [jeResult] = await conn.query(
        'INSERT INTO journal_entries (entryNumber, entryDate, memo, isAdjusting, createdAt, updatedAt) VALUES (?, ?, ?, 0, NOW(), NOW())',
        [entryNum, inv.invoiceDate, `Invoice ${inv.invoiceNumber}`]
      );
      const jeId = jeResult.insertId;
      
      // Debit: Accounts Receivable (asset increases with debit)
      await conn.query(
        'INSERT INTO journal_entry_lines (journalEntryId, accountId, debit, credit, description, customerId, sortOrder) VALUES (?, ?, ?, 0, ?, ?, 0)',
        [jeId, AR_ACCOUNT_ID, total.toFixed(2), `Invoice ${inv.invoiceNumber}`, inv.customerId]
      );
      
      // Credit: Sales/Income (income increases with credit)
      await conn.query(
        'INSERT INTO journal_entry_lines (journalEntryId, accountId, debit, credit, description, customerId, sortOrder) VALUES (?, ?, 0, ?, ?, NULL, 1)',
        [jeId, SALES_ACCOUNT_ID, total.toFixed(2), `Invoice ${inv.invoiceNumber} - Sales`]
      );
      
      jeNumber++;
      invoiceJECount++;
    }
    console.log(`  Created ${invoiceJECount} journal entries for invoices`);

    // Step 4: Re-create journal entries from expenses
    console.log('\nStep 4: Re-journalizing expenses...');
    const [expenses] = await conn.query(`
      SELECT e.id, e.payeeName, e.total, e.expenseDate, e.accountId, e.payeeId, e.payeeType
      FROM expenses e
      ORDER BY e.id
    `);
    
    const BANK_ACCOUNT_ID = 1; // RusingAcademy bank account
    const DEFAULT_EXPENSE_ACCOUNT_ID = 71; // Miscellaneous Expenses
    const QB_PAYMENTS_FEES_ID = 48; // QuickBooks Payments Fees
    let expenseJECount = 0;
    
    // Get expense account names for memos
    const [expenseAccounts] = await conn.query('SELECT id, name FROM accounts');
    const acctMap = {};
    expenseAccounts.forEach(a => { acctMap[a.id] = a.name; });
    
    for (const exp of expenses) {
      const total = parseFloat(exp.total);
      if (total <= 0) continue;
      
      // Determine the expense account - use accountId if set, otherwise assign based on payeeName
      let expenseAccountId = exp.accountId;
      if (!expenseAccountId) {
        if (exp.payeeName && exp.payeeName.includes('QuickBooks Payments')) {
          expenseAccountId = QB_PAYMENTS_FEES_ID;
        } else {
          expenseAccountId = DEFAULT_EXPENSE_ACCOUNT_ID;
        }
        // Also fix the expense record itself
        await conn.query('UPDATE expenses SET accountId = ? WHERE id = ?', [expenseAccountId, exp.id]);
      }
      
      const entryNum = `JE-${String(jeNumber).padStart(4, '0')}`;
      const acctName = acctMap[expenseAccountId] || 'Expense';
      const [jeResult] = await conn.query(
        'INSERT INTO journal_entries (entryNumber, entryDate, memo, isAdjusting, createdAt, updatedAt) VALUES (?, ?, ?, 0, NOW(), NOW())',
        [entryNum, exp.expenseDate, `Expense - ${exp.payeeName || acctName}`]
      );
      const jeId = jeResult.insertId;
      
      // Debit: Expense account (expense increases with debit)
      await conn.query(
        'INSERT INTO journal_entry_lines (journalEntryId, accountId, debit, credit, description, supplierId, sortOrder) VALUES (?, ?, ?, 0, ?, ?, 0)',
        [jeId, expenseAccountId, total.toFixed(2), `${exp.payeeName || acctName}`, exp.payeeType === 'supplier' ? exp.payeeId : null]
      );
      
      // Credit: Bank account (asset decreases with credit)
      await conn.query(
        'INSERT INTO journal_entry_lines (journalEntryId, accountId, debit, credit, description, sortOrder) VALUES (?, ?, 0, ?, ?, 1)',
        [jeId, BANK_ACCOUNT_ID, total.toFixed(2), `Payment - ${exp.payeeName || acctName}`]
      );
      
      jeNumber++;
      expenseJECount++;
    }
    console.log(`  Created ${expenseJECount} journal entries for expenses`);

    // Step 5: Re-create journal entries from payments (received)
    console.log('\nStep 5: Re-journalizing payments...');
    const [payments] = await conn.query(`
      SELECT p.id, p.referenceNumber, p.customerId, p.amount, p.paymentDate, p.paymentMethod
      FROM payments p
      ORDER BY p.id
    `);
    
    let paymentJECount = 0;
    for (const pay of payments) {
      const amount = parseFloat(pay.amount);
      if (amount <= 0) continue;
      
      const payRef = pay.referenceNumber || `PAY-${pay.id}`;
      const entryNum = `JE-${String(jeNumber).padStart(4, '0')}`;
      const [jeResult] = await conn.query(
        'INSERT INTO journal_entries (entryNumber, entryDate, memo, isAdjusting, createdAt, updatedAt) VALUES (?, ?, ?, 0, NOW(), NOW())',
        [entryNum, pay.paymentDate, `Payment ${payRef}`]
      );
      const jeId = jeResult.insertId;
      
      // Debit: Bank (asset increases with debit - cash received)
      await conn.query(
        'INSERT INTO journal_entry_lines (journalEntryId, accountId, debit, credit, description, customerId, sortOrder) VALUES (?, ?, ?, 0, ?, ?, 0)',
        [jeId, BANK_ACCOUNT_ID, amount.toFixed(2), `Payment ${payRef}`, pay.customerId]
      );
      
      // Credit: Accounts Receivable (asset decreases with credit - customer owes less)
      await conn.query(
        'INSERT INTO journal_entry_lines (journalEntryId, accountId, debit, credit, description, customerId, sortOrder) VALUES (?, ?, 0, ?, ?, ?, 1)',
        [jeId, AR_ACCOUNT_ID, amount.toFixed(2), `Payment ${payRef} - AR`, pay.customerId]
      );
      
      jeNumber++;
      paymentJECount++;
    }
    console.log(`  Created ${paymentJECount} journal entries for payments`);

    // Step 6: Verify
    console.log('\n=== Verification ===');
    
    const [[newJeCount]] = await conn.query('SELECT COUNT(*) as cnt FROM journal_entries');
    const [[newJlCount]] = await conn.query('SELECT COUNT(*) as cnt FROM journal_entry_lines');
    console.log(`Journal Entries: ${newJeCount.cnt}`);
    console.log(`Journal Entry Lines: ${newJlCount.cnt}`);
    
    // Check balance
    const [[balance]] = await conn.query(`
      SELECT SUM(CAST(debit AS DECIMAL(15,2))) as totalDebit,
        SUM(CAST(credit AS DECIMAL(15,2))) as totalCredit
      FROM journal_entry_lines
    `);
    console.log(`Total Debits: $${balance.totalDebit}`);
    console.log(`Total Credits: $${balance.totalCredit}`);
    console.log(`Balanced: ${Math.abs(Number(balance.totalDebit) - Number(balance.totalCredit)) < 0.01 ? 'YES' : 'NO'}`);
    
    // Check P&L
    const [[income]] = await conn.query(`
      SELECT SUM(CAST(jl.credit AS DECIMAL(15,2))) - SUM(CAST(jl.debit AS DECIMAL(15,2))) as netIncome
      FROM journal_entry_lines jl
      JOIN accounts a ON jl.accountId = a.id
      WHERE a.accountType = 'Income'
    `);
    const [[expenses2]] = await conn.query(`
      SELECT SUM(CAST(jl.debit AS DECIMAL(15,2))) - SUM(CAST(jl.credit AS DECIMAL(15,2))) as netExpenses
      FROM journal_entry_lines jl
      JOIN accounts a ON jl.accountId = a.id
      WHERE a.accountType = 'Expense'
    `);
    
    const netIncome = Number(income.netIncome || 0);
    const netExpenses = Number(expenses2.netExpenses || 0);
    console.log(`\nP&L Summary:`);
    console.log(`  Income: $${netIncome.toFixed(2)}`);
    console.log(`  Expenses: $${netExpenses.toFixed(2)}`);
    console.log(`  Net Profit: $${(netIncome - netExpenses).toFixed(2)}`);
    
    console.log('\n=== Cleanup Complete ===');
    
  } finally {
    conn.release();
    await pool.end();
  }
}

run().catch(console.error);
