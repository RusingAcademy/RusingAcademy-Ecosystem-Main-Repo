import mysql from 'mysql2/promise';

const pool = mysql.createPool(process.env.DATABASE_URL);

async function analyze() {
  const conn = await pool.getConnection();
  try {
    // Record counts
    const [[expCount]] = await conn.query('SELECT COUNT(*) as cnt FROM expenses');
    const [[invCount]] = await conn.query('SELECT COUNT(*) as cnt FROM invoices');
    const [[jeCount]] = await conn.query('SELECT COUNT(*) as cnt FROM journal_entries');
    const [[jlCount]] = await conn.query('SELECT COUNT(*) as cnt FROM journal_entry_lines');
    const [[payCount]] = await conn.query('SELECT COUNT(*) as cnt FROM payments');

    console.log('=== Record Counts ===');
    console.log('Expenses:', expCount.cnt);
    console.log('Invoices:', invCount.cnt);
    console.log('Journal Entries:', jeCount.cnt);
    console.log('Journal Lines:', jlCount.cnt);
    console.log('Payments:', payCount.cnt);

    // Duplicate expenses
    const [dupes] = await conn.query(`
      SELECT payeeName, total, expenseDate, COUNT(*) as cnt
      FROM expenses
      GROUP BY payeeName, total, expenseDate
      HAVING cnt > 1
      ORDER BY cnt DESC
      LIMIT 20
    `);
    console.log('\n=== Duplicate Expenses (same payee+total+date) ===');
    console.log(dupes);

    // Journal entries by source type
    const [jeSources] = await conn.query(`
      SELECT sourceType, COUNT(*) as cnt, 
        SUM(CASE WHEN isReversed = 1 THEN 1 ELSE 0 END) as reversed
      FROM journal_entries
      GROUP BY sourceType
    `);
    console.log('\n=== Journal Entries by Source ===');
    console.log(jeSources);

    // Expenses without journal entries
    const [[orphanExp]] = await conn.query(`
      SELECT COUNT(*) as cnt FROM expenses e
      WHERE NOT EXISTS (
        SELECT 1 FROM journal_entries je
        WHERE je.sourceType = 'Expense' AND je.sourceId = e.id AND je.isReversed = 0
      )
    `);
    console.log('\n=== Expenses without active JE ===', orphanExp.cnt);

    // Non-draft invoices without journal entries
    const [[orphanInv]] = await conn.query(`
      SELECT COUNT(*) as cnt FROM invoices i
      WHERE i.status NOT IN ('Draft') AND NOT EXISTS (
        SELECT 1 FROM journal_entries je
        WHERE je.sourceType = 'Invoice' AND je.sourceId = i.id AND je.isReversed = 0
      )
    `);
    console.log('=== Non-draft Invoices without active JE ===', orphanInv.cnt);

    // Raw expense total
    const [[rawExp]] = await conn.query(`
      SELECT SUM(CAST(total AS DECIMAL(15,2))) as rawTotal FROM expenses
    `);
    console.log('\n=== Raw Expense Total ===', rawExp.rawTotal);

    // JE-based expense total (debits to expense accounts)
    const [[jeExp]] = await conn.query(`
      SELECT SUM(CAST(jl.debit AS DECIMAL(15,2))) as jeExpenseTotal
      FROM journal_entry_lines jl
      JOIN journal_entries je ON jl.journalEntryId = je.id
      JOIN accounts a ON jl.accountId = a.id
      WHERE a.accountType = 'Expense' AND je.isReversed = 0
    `);
    console.log('=== JE-based Expense Total ===', jeExp.jeExpenseTotal);

    // Raw invoice total
    const [[rawInv]] = await conn.query(`
      SELECT SUM(CAST(total AS DECIMAL(15,2))) as rawTotal FROM invoices
      WHERE status NOT IN ('Draft', 'Voided')
    `);
    console.log('\n=== Raw Invoice Total (non-draft, non-voided) ===', rawInv.rawTotal);

    // JE-based income total
    const [[jeInc]] = await conn.query(`
      SELECT SUM(CAST(jl.credit AS DECIMAL(15,2))) as jeIncomeTotal
      FROM journal_entry_lines jl
      JOIN journal_entries je ON jl.journalEntryId = je.id
      JOIN accounts a ON jl.accountId = a.id
      WHERE a.accountType = 'Income' AND je.isReversed = 0
    `);
    console.log('=== JE-based Income Total ===', jeInc.jeIncomeTotal);

    // Sample expenses to see what's in there
    const [sampleExp] = await conn.query(`
      SELECT id, payeeName, total, expenseDate, status, accountId
      FROM expenses
      ORDER BY id
      LIMIT 30
    `);
    console.log('\n=== Sample Expenses ===');
    sampleExp.forEach(e => console.log(`  #${e.id} ${e.payeeName} $${e.total} ${e.expenseDate} [${e.status}]`));

    // Check for expenses with very large amounts
    const [bigExp] = await conn.query(`
      SELECT id, payeeName, total, expenseDate
      FROM expenses
      WHERE CAST(total AS DECIMAL(15,2)) > 10000
      ORDER BY CAST(total AS DECIMAL(15,2)) DESC
    `);
    console.log('\n=== Large Expenses (>$10K) ===');
    bigExp.forEach(e => console.log(`  #${e.id} ${e.payeeName} $${e.total} ${e.expenseDate}`));

  } finally {
    conn.release();
    await pool.end();
  }
}

analyze().catch(console.error);
