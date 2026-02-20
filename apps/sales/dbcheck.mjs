import 'dotenv/config';
import mysql from 'mysql2/promise';

const conn = await mysql.createConnection(process.env.DATABASE_URL);

const [custs] = await conn.query('SELECT COUNT(*) as c FROM customers');
const [invs] = await conn.query('SELECT COUNT(*) as c FROM invoices');
const [sups] = await conn.query('SELECT COUNT(*) as c FROM suppliers');
const [exps] = await conn.query('SELECT COUNT(*) as c FROM expenses');
console.log('Customers:', custs[0].c, 'Invoices:', invs[0].c, 'Suppliers:', sups[0].c, 'Expenses:', exps[0].c);

// Check for test data
const [testCusts] = await conn.query("SELECT id, displayName FROM customers WHERE id > 40 ORDER BY id");
console.log('Customers after id 40:', JSON.stringify(testCusts));

const [testInvs] = await conn.query("SELECT id, invoiceNumber FROM invoices WHERE id > 11 ORDER BY id");
console.log('Invoices after id 11:', JSON.stringify(testInvs));

// Check invoice line items
const [items] = await conn.query("SELECT COUNT(*) as c FROM invoice_items");
console.log('Invoice items:', items[0].c);

// Check journal entries
const [jes] = await conn.query("SELECT COUNT(*) as c FROM journal_entries");
const [jels] = await conn.query("SELECT COUNT(*) as c FROM journal_entry_lines");
console.log('Journal entries:', jes[0].c, 'JE lines:', jels[0].c);

await conn.end();
