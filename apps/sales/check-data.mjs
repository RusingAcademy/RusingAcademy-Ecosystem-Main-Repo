import { drizzle } from "drizzle-orm/mysql2";
import { sql } from "drizzle-orm";
import dotenv from "dotenv";
dotenv.config();

const db = drizzle(process.env.DATABASE_URL);

// Check for duplicate invoices
const invs = await db.execute(sql`SELECT id, invoiceNumber, total, status FROM invoices ORDER BY id`);
console.log("=== INVOICES ===");
for (const r of invs[0]) console.log(`  #${r.id} ${r.invoiceNumber} $${r.total} [${r.status}]`);

// Check for duplicate customers
const custs = await db.execute(sql`SELECT id, displayName FROM customers ORDER BY id`);
console.log(`\n=== CUSTOMERS (${custs[0].length}) ===`);
// Find duplicates
const names = {};
for (const c of custs[0]) {
  if (names[c.displayName]) console.log(`  DUPLICATE: #${c.id} "${c.displayName}" (first: #${names[c.displayName]})`);
  else names[c.displayName] = c.id;
}

// Check journal entries
const jes = await db.execute(sql`SELECT COUNT(*) as cnt FROM journal_entries`);
console.log(`\n=== JOURNAL ENTRIES: ${jes[0][0].cnt} ===`);

// Check account balances
const accts = await db.execute(sql`SELECT id, name, accountType, balance FROM accounts WHERE ABS(balance) > 0 ORDER BY ABS(balance) DESC LIMIT 10`);
console.log("\n=== TOP ACCOUNT BALANCES ===");
for (const a of accts[0]) console.log(`  #${a.id} ${a.name} (${a.accountType}): $${a.balance}`);

process.exit(0);
