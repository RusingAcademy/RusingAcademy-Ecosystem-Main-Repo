import { eq, desc, asc, sql, and, like, or, inArray, notInArray, gte, lte, lt } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser, users,
  accounts, type InsertAccount,
  customers, type InsertCustomer,
  suppliers, type InsertSupplier,
  products, type InsertProduct,
  invoices, type InsertInvoice,
  invoiceLineItems, type InsertInvoiceLineItem,
  expenses, type InsertExpense,
  expenseLineItems, type InsertExpenseLineItem,
  payments, type InsertPayment,
  paymentApplications,
  bankTransactions, type InsertBankTransaction,
  journalEntries, type InsertJournalEntry,
  journalEntryLines, type InsertJournalEntryLine,
  taxRates, type InsertTaxRate,
  taxFilings, type InsertTaxFiling,
  companySettings,
  estimates, type InsertEstimate,
  estimateLineItems,
  bills, type InsertBill,
  billLineItems,
  recurringTransactions, type InsertRecurringTransaction,
  reconciliations, type InsertReconciliation,
  auditLog, type InsertAuditLogEntry,
  attachments, type InsertAttachment,
  accountTransfers, type InsertAccountTransfer,
  bankRules, type InsertBankRule,
  exchangeRates, type InsertExchangeRate,
  emailTemplates, type InsertEmailTemplate,
  recurringGenerationLog, type InsertRecurringGenerationLog,
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ─── Users ───────────────────────────────────────────────────────────
export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) { console.warn("[Database] Cannot upsert user: database not available"); return; }
  try {
    const values: InsertUser = { openId: user.openId };
    const updateSet: Record<string, unknown> = {};
    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];
    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };
    textFields.forEach(assignNullable);
    if (user.lastSignedIn !== undefined) { values.lastSignedIn = user.lastSignedIn; updateSet.lastSignedIn = user.lastSignedIn; }
    if (user.role !== undefined) { values.role = user.role; updateSet.role = user.role; }
    else if (user.openId === ENV.ownerOpenId) { values.role = 'admin'; updateSet.role = 'admin'; }
    if (!values.lastSignedIn) values.lastSignedIn = new Date();
    if (Object.keys(updateSet).length === 0) updateSet.lastSignedIn = new Date();
    await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
  } catch (error) { console.error("[Database] Failed to upsert user:", error); throw error; }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ─── Company Settings ────────────────────────────────────────────────
export async function getCompanySettings() {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(companySettings).limit(1);
  return result[0] || null;
}

export async function updateCompanySettings(data: Partial<typeof companySettings.$inferInsert>) {
  const db = await getDb();
  if (!db) return null;
  const existing = await getCompanySettings();
  if (existing) {
    await db.update(companySettings).set(data).where(eq(companySettings.id, existing.id));
    return { ...existing, ...data };
  }
  const [result] = await db.insert(companySettings).values(data as any).$returningId();
  return result;
}

// ─── Accounts (Chart of Accounts) ───────────────────────────────────
export async function getAccounts(filters?: { type?: string; isActive?: boolean }) {
  const db = await getDb();
  if (!db) return [];
  let query = db.select().from(accounts);
  const conditions = [];
  if (filters?.type) conditions.push(eq(accounts.accountType, filters.type));
  if (filters?.isActive !== undefined) conditions.push(eq(accounts.isActive, filters.isActive));
  if (conditions.length > 0) query = query.where(and(...conditions)) as any;
  return query.orderBy(asc(accounts.name));
}

export async function getAccountById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(accounts).where(eq(accounts.id, id)).limit(1);
  return result[0] || null;
}

export async function createAccount(data: InsertAccount) {
  const db = await getDb();
  if (!db) return null;
  const [result] = await db.insert(accounts).values(data).$returningId();
  return result;
}

export async function updateAccount(id: number, data: Partial<InsertAccount>) {
  const db = await getDb();
  if (!db) return null;
  await db.update(accounts).set(data).where(eq(accounts.id, id));
  return getAccountById(id);
}

// ─── Customers ───────────────────────────────────────────────────────
export async function getCustomers(filters?: { search?: string; isActive?: boolean }) {
  const db = await getDb();
  if (!db) return [];
  let query = db.select().from(customers);
  const conditions = [];
  if (filters?.isActive !== undefined) conditions.push(eq(customers.isActive, filters.isActive));
  if (filters?.search) {
    conditions.push(or(
      like(customers.displayName, `%${filters.search}%`),
      like(customers.company, `%${filters.search}%`),
      like(customers.email, `%${filters.search}%`)
    )!);
  }
  if (conditions.length > 0) query = query.where(and(...conditions)) as any;
  return query.orderBy(asc(customers.displayName));
}

export async function getCustomerById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(customers).where(eq(customers.id, id)).limit(1);
  return result[0] || null;
}

export async function createCustomer(data: InsertCustomer) {
  const db = await getDb();
  if (!db) return null;
  const [result] = await db.insert(customers).values(data).$returningId();
  return result;
}

export async function updateCustomer(id: number, data: Partial<InsertCustomer>) {
  const db = await getDb();
  if (!db) return null;
  await db.update(customers).set(data).where(eq(customers.id, id));
  return getCustomerById(id);
}

export async function deleteCustomer(id: number) {
  const db = await getDb();
  if (!db) return;
  await db.update(customers).set({ isActive: false }).where(eq(customers.id, id));
}

// ─── Suppliers ───────────────────────────────────────────────────────
export async function getSuppliers(filters?: { search?: string; isActive?: boolean }) {
  const db = await getDb();
  if (!db) return [];
  let query = db.select().from(suppliers);
  const conditions = [];
  if (filters?.isActive !== undefined) conditions.push(eq(suppliers.isActive, filters.isActive));
  if (filters?.search) {
    conditions.push(or(
      like(suppliers.displayName, `%${filters.search}%`),
      like(suppliers.company, `%${filters.search}%`)
    )!);
  }
  if (conditions.length > 0) query = query.where(and(...conditions)) as any;
  return query.orderBy(asc(suppliers.displayName));
}

export async function getSupplierById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(suppliers).where(eq(suppliers.id, id)).limit(1);
  return result[0] || null;
}

export async function createSupplier(data: InsertSupplier) {
  const db = await getDb();
  if (!db) return null;
  const [result] = await db.insert(suppliers).values(data).$returningId();
  return result;
}

export async function updateSupplier(id: number, data: Partial<InsertSupplier>) {
  const db = await getDb();
  if (!db) return null;
  await db.update(suppliers).set(data).where(eq(suppliers.id, id));
  return getSupplierById(id);
}

// ─── Products & Services ─────────────────────────────────────────────
export async function getProducts(filters?: { search?: string; type?: string; isActive?: boolean }) {
  const db = await getDb();
  if (!db) return [];
  let query = db.select().from(products);
  const conditions = [];
  if (filters?.isActive !== undefined) conditions.push(eq(products.isActive, filters.isActive));
  if (filters?.type) conditions.push(eq(products.type, filters.type as any));
  if (filters?.search) {
    conditions.push(or(
      like(products.name, `%${filters.search}%`),
      like(products.description, `%${filters.search}%`)
    )!);
  }
  if (conditions.length > 0) query = query.where(and(...conditions)) as any;
  return query.orderBy(asc(products.name));
}

export async function getProductById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(products).where(eq(products.id, id)).limit(1);
  return result[0] || null;
}

export async function createProduct(data: InsertProduct) {
  const db = await getDb();
  if (!db) return null;
  const [result] = await db.insert(products).values(data).$returningId();
  return result;
}

export async function updateProduct(id: number, data: Partial<InsertProduct>) {
  const db = await getDb();
  if (!db) return null;
  await db.update(products).set(data).where(eq(products.id, id));
  return getProductById(id);
}

// ─── Invoices ────────────────────────────────────────────────────────
export async function getInvoices(filters?: { status?: string; customerId?: number; search?: string }) {
  const db = await getDb();
  if (!db) return [];
  const conditions = [];
  if (filters?.status) conditions.push(eq(invoices.status, filters.status as any));
  if (filters?.customerId) conditions.push(eq(invoices.customerId, filters.customerId));
  if (filters?.search) conditions.push(like(invoices.invoiceNumber, `%${filters.search}%`));
  let query = db.select({
    invoice: invoices,
    customerName: customers.displayName,
  }).from(invoices)
    .leftJoin(customers, eq(invoices.customerId, customers.id));
  if (conditions.length > 0) query = query.where(and(...conditions)) as any;
  return (query as any).orderBy(desc(invoices.invoiceDate));
}

export async function getInvoiceById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select({
    invoice: invoices,
    customerName: customers.displayName,
  }).from(invoices)
    .leftJoin(customers, eq(invoices.customerId, customers.id))
    .where(eq(invoices.id, id)).limit(1);
  if (!result[0]) return null;
  const lineItems = await db.select().from(invoiceLineItems).where(eq(invoiceLineItems.invoiceId, id)).orderBy(asc(invoiceLineItems.sortOrder));
  return { ...result[0], lineItems };
}

export async function createInvoice(data: InsertInvoice, lineItems?: InsertInvoiceLineItem[]) {
  const db = await getDb();
  if (!db) return null;
  const [result] = await db.insert(invoices).values(data).$returningId();
  if (lineItems && lineItems.length > 0) {
    await db.insert(invoiceLineItems).values(lineItems.map(li => ({ ...li, invoiceId: result.id })));
  }
  return result;
}

export async function updateInvoice(id: number, data: Partial<InsertInvoice>) {
  const db = await getDb();
  if (!db) return null;
  await db.update(invoices).set(data).where(eq(invoices.id, id));
  return getInvoiceById(id);
}

export async function deleteInvoiceLineItems(invoiceId: number) {
  const db = await getDb();
  if (!db) return;
  await db.delete(invoiceLineItems).where(eq(invoiceLineItems.invoiceId, invoiceId));
}

// ─── Expenses ────────────────────────────────────────────────────────
export async function getExpenses(filters?: { type?: string; search?: string }) {
  const db = await getDb();
  if (!db) return [];
  const conditions = [];
  if (filters?.type) conditions.push(eq(expenses.expenseType, filters.type as any));
  if (filters?.search) conditions.push(like(expenses.payeeName, `%${filters.search}%`));
  let query = db.select().from(expenses);
  if (conditions.length > 0) query = query.where(and(...conditions)) as any;
  return query.orderBy(desc(expenses.expenseDate));
}

export async function getExpenseById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(expenses).where(eq(expenses.id, id)).limit(1);
  if (!result[0]) return null;
  const lineItems = await db.select().from(expenseLineItems).where(eq(expenseLineItems.expenseId, id)).orderBy(asc(expenseLineItems.sortOrder));
  return { ...result[0], lineItems };
}

export async function createExpense(data: InsertExpense, lineItems?: InsertExpenseLineItem[]) {
  const db = await getDb();
  if (!db) return null;
  const [result] = await db.insert(expenses).values(data).$returningId();
  if (lineItems && lineItems.length > 0) {
    await db.insert(expenseLineItems).values(lineItems.map(li => ({ ...li, expenseId: result.id })));
  }
  return result;
}

export async function updateExpense(id: number, data: Partial<InsertExpense>) {
  const db = await getDb();
  if (!db) return null;
  await db.update(expenses).set(data).where(eq(expenses.id, id));
  return getExpenseById(id);
}

// ─── Payments ────────────────────────────────────────────────────────
export async function getPayments(filters?: { customerId?: number }) {
  const db = await getDb();
  if (!db) return [];
  let query = db.select().from(payments);
  if (filters?.customerId) query = query.where(eq(payments.customerId, filters.customerId)) as any;
  return query.orderBy(desc(payments.paymentDate));
}

export async function createPayment(data: InsertPayment, applications?: { invoiceId: number; amount: string }[]) {
  const db = await getDb();
  if (!db) return null;
  const [result] = await db.insert(payments).values(data).$returningId();
  if (applications && applications.length > 0) {
    await db.insert(paymentApplications).values(applications.map(a => ({ ...a, paymentId: result.id })));
  }
  return result;
}

// ─── Bank Transactions ───────────────────────────────────────────────
export async function getBankTransactions(filters?: { status?: string; accountId?: number }) {
  const db = await getDb();
  if (!db) return [];
  const conditions = [];
  if (filters?.status) conditions.push(eq(bankTransactions.status, filters.status as any));
  if (filters?.accountId) conditions.push(eq(bankTransactions.accountId, filters.accountId));
  let query = db.select().from(bankTransactions);
  if (conditions.length > 0) query = query.where(and(...conditions)) as any;
  return query.orderBy(desc(bankTransactions.transactionDate));
}

export async function updateBankTransaction(id: number, data: Partial<InsertBankTransaction>) {
  const db = await getDb();
  if (!db) return null;
  await db.update(bankTransactions).set(data).where(eq(bankTransactions.id, id));
  const result = await db.select().from(bankTransactions).where(eq(bankTransactions.id, id)).limit(1);
  return result[0] || null;
}

// ─── Tax Rates ───────────────────────────────────────────────────────
export async function getTaxRates() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(taxRates).where(eq(taxRates.isActive, true)).orderBy(asc(taxRates.name));
}

export async function createTaxRate(data: InsertTaxRate) {
  const db = await getDb();
  if (!db) return null;
  const [result] = await db.insert(taxRates).values(data).$returningId();
  return result;
}

// ─── Tax Filings ─────────────────────────────────────────────────────
export async function getTaxFilings() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(taxFilings).orderBy(desc(taxFilings.periodEnd));
}

export async function createTaxFiling(data: InsertTaxFiling) {
  const db = await getDb();
  if (!db) return null;
  const [result] = await db.insert(taxFilings).values(data).$returningId();
  return result;
}

export async function updateTaxFiling(id: number, data: Partial<InsertTaxFiling>) {
  const db = await getDb();
  if (!db) return null;
  await db.update(taxFilings).set(data).where(eq(taxFilings.id, id));
  const result = await db.select().from(taxFilings).where(eq(taxFilings.id, id)).limit(1);
  return result[0] || null;
}

// ─── Journal Entries ─────────────────────────────────────────────────
export async function getJournalEntries() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(journalEntries).orderBy(desc(journalEntries.entryDate));
}

export async function createJournalEntry(data: InsertJournalEntry, lines: InsertJournalEntryLine[]) {
  const db = await getDb();
  if (!db) return null;
  const [result] = await db.insert(journalEntries).values(data).$returningId();
  if (lines.length > 0) {
    await db.insert(journalEntryLines).values(lines.map(l => ({ ...l, journalEntryId: result.id })));
  }
  return result;
}

// ─── Dashboard Aggregates ────────────────────────────────────────────
export async function getDashboardData() {
  const db = await getDb();
  if (!db) return null;

  // Get company settings
  const company = await getCompanySettings();

  // Get invoice summary
  const allInvoices = await db.select().from(invoices);
  const overdueInvoices = allInvoices.filter(i => i.status === "Overdue");
  const paidInvoices = allInvoices.filter(i => i.status === "Deposited" || i.status === "Paid");

  // Use accounting engine for accurate P&L from journal entries
  const { getProfitAndLoss } = await import("./accounting");
  let accountingPL = { totalIncome: 0, totalExpenses: 0, netProfit: 0 };
  try {
    accountingPL = await getProfitAndLoss();
  } catch (e) {
    console.warn("[Dashboard] Accounting P&L unavailable, falling back to invoice/expense totals", e);
    const totalIncome = allInvoices.reduce((sum, i) => sum + parseFloat(i.total || "0"), 0);
    const allExpenses = await db.select().from(expenses);
    const totalExpenseAmount = allExpenses.reduce((sum, e) => sum + parseFloat(e.total || "0"), 0);
    accountingPL = { totalIncome, totalExpenses: totalExpenseAmount, netProfit: totalIncome - totalExpenseAmount };
  }

  // Use accounting engine for expense summary too (Sprint 42)
  const expenseCount = (await db.select({ count: sql<number>`count(*)` }).from(expenses))[0]?.count || 0;

  // Get bank account
  const bankAccount = await db.select().from(accounts).where(eq(accounts.accountType, "Bank")).limit(1);

  // Get recent bank transactions
  const recentBankTx = await db.select().from(bankTransactions).orderBy(desc(bankTransactions.transactionDate)).limit(20);
  const forReviewCount = recentBankTx.filter(t => t.status === "For Review").length;

  // Recent activity (last 10 invoices + expenses combined)
  const recentInvoices = allInvoices.slice(0, 5).map(i => ({ type: "invoice" as const, id: i.id, label: `Invoice ${i.invoiceNumber}`, amount: parseFloat(i.total || "0"), date: i.invoiceDate, status: i.status }));
  const recentExpenseRows = await db.select().from(expenses).orderBy(desc(expenses.expenseDate)).limit(5);
  const recentExpenses = recentExpenseRows.map(e => ({ type: "expense" as const, id: e.id, label: e.payeeName || "Expense", amount: parseFloat(e.total || "0"), date: e.expenseDate, status: e.expenseType }));
  const recentActivity = [...recentInvoices, ...recentExpenses].sort((a, b) => {
    const da = a.date ? new Date(a.date).getTime() : 0;
    const db2 = b.date ? new Date(b.date).getTime() : 0;
    return db2 - da;
  }).slice(0, 10);

  return {
    companyName: company?.companyName || "RusingAcademy",
    profitAndLoss: {
      income: accountingPL.totalIncome,
      expenses: accountingPL.totalExpenses,
      netProfit: accountingPL.netProfit,
    },
    invoiceSummary: {
      total: allInvoices.length,
      overdue: overdueInvoices.length,
      overdueAmount: overdueInvoices.reduce((sum, i) => sum + parseFloat(i.amountDue || "0"), 0),
      paid: paidInvoices.length,
      paidAmount: paidInvoices.reduce((sum, i) => sum + parseFloat(i.amountPaid || "0"), 0),
    },
    expenseSummary: {
      total: expenseCount,
      totalAmount: accountingPL.totalExpenses,
    },
    bankAccount: bankAccount[0] ? {
      name: bankAccount[0].name,
      balance: parseFloat(bankAccount[0].balance || "0"),
      bankBalance: parseFloat(bankAccount[0].bankBalance || "0"),
      forReview: forReviewCount,
    } : null,
    customerCount: (await db.select({ count: sql<number>`count(*)` }).from(customers))[0]?.count || 0,
    supplierCount: (await db.select({ count: sql<number>`count(*)` }).from(suppliers))[0]?.count || 0,
    recentActivity,
  };
}

// ─── Global Search ───────────────────────────────────────────────────
export async function globalSearch(query: string) {
  const db = await getDb();
  if (!db) return { customers: [], invoices: [], accounts: [], products: [], suppliers: [] };
  const term = `%${query}%`;

  const [custResults, invResults, acctResults, prodResults, suppResults] = await Promise.all([
    db.select().from(customers).where(or(like(customers.displayName, term), like(customers.company, term))).limit(5),
    db.select().from(invoices).where(like(invoices.invoiceNumber, term)).limit(5),
    db.select().from(accounts).where(like(accounts.name, term)).limit(5),
    db.select().from(products).where(or(like(products.name, term), like(products.description, term))).limit(5),
    db.select().from(suppliers).where(like(suppliers.displayName, term)).limit(5),
  ]);

  return {
    customers: custResults,
    invoices: invResults,
    accounts: acctResults,
    products: prodResults,
    suppliers: suppResults,
  };
}

// ─── Audit Log ───────────────────────────────────────────────────────
export async function createAuditEntry(data: InsertAuditLogEntry) {
  const db = await getDb();
  if (!db) return;
  await db.insert(auditLog).values(data);
}

export async function getAuditLog(limit = 50) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(auditLog).orderBy(desc(auditLog.createdAt)).limit(limit);
}

// ─── Estimates ──────────────────────────────────────────────────────
export async function getEstimates(filters?: { status?: string; customerId?: number }) {
  const db = await getDb();
  if (!db) return [];
  const conditions = [];
  if (filters?.status) conditions.push(eq(estimates.status, filters.status as any));
  if (filters?.customerId) conditions.push(eq(estimates.customerId, filters.customerId));
  let query = db.select({
    estimate: estimates,
    customerName: customers.displayName,
  }).from(estimates)
    .leftJoin(customers, eq(estimates.customerId, customers.id));
  if (conditions.length > 0) query = query.where(and(...conditions)) as any;
  return (query as any).orderBy(desc(estimates.estimateDate));
}

export async function getEstimateById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select({
    estimate: estimates,
    customerName: customers.displayName,
  }).from(estimates)
    .leftJoin(customers, eq(estimates.customerId, customers.id))
    .where(eq(estimates.id, id)).limit(1);
  if (!result[0]) return null;
  const lineItems = await db.select().from(estimateLineItems).where(eq(estimateLineItems.estimateId, id)).orderBy(asc(estimateLineItems.sortOrder));
  return { ...result[0], lineItems };
}

export async function createEstimate(data: InsertEstimate, lineItems?: any[]) {
  const db = await getDb();
  if (!db) return null;
  const [result] = await db.insert(estimates).values(data).$returningId();
  if (lineItems && lineItems.length > 0) {
    await db.insert(estimateLineItems).values(lineItems.map((li: any) => ({ ...li, estimateId: result.id })));
  }
  return result;
}

export async function updateEstimate(id: number, data: Partial<InsertEstimate>) {
  const db = await getDb();
  if (!db) return null;
  await db.update(estimates).set(data).where(eq(estimates.id, id));
  return getEstimateById(id);
}

// ─── Bills ──────────────────────────────────────────────────────────
export async function getBills(filters?: { status?: string; supplierId?: number }) {
  const db = await getDb();
  if (!db) return [];
  const conditions = [];
  if (filters?.status) conditions.push(eq(bills.status, filters.status as any));
  if (filters?.supplierId) conditions.push(eq(bills.supplierId, filters.supplierId));
  let query = db.select({
    bill: bills,
    supplierName: suppliers.displayName,
  }).from(bills)
    .leftJoin(suppliers, eq(bills.supplierId, suppliers.id));
  if (conditions.length > 0) query = query.where(and(...conditions)) as any;
  return (query as any).orderBy(desc(bills.billDate));
}

export async function getBillById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select({
    bill: bills,
    supplierName: suppliers.displayName,
  }).from(bills)
    .leftJoin(suppliers, eq(bills.supplierId, suppliers.id))
    .where(eq(bills.id, id)).limit(1);
  if (!result[0]) return null;
  const lineItems = await db.select().from(billLineItems).where(eq(billLineItems.billId, id)).orderBy(asc(billLineItems.sortOrder));
  return { ...result[0], lineItems };
}

export async function createBill(data: InsertBill, lineItems?: any[]) {
  const db = await getDb();
  if (!db) return null;
  const [result] = await db.insert(bills).values(data).$returningId();
  if (lineItems && lineItems.length > 0) {
    await db.insert(billLineItems).values(lineItems.map((li: any) => ({ ...li, billId: result.id })));
  }
  return result;
}

export async function updateBill(id: number, data: Partial<InsertBill>) {
  const db = await getDb();
  if (!db) return null;
  await db.update(bills).set(data).where(eq(bills.id, id));
  return getBillById(id);
}

// ─── Recurring Transactions ─────────────────────────────────────────
export async function getRecurringTransactions(filters?: { type?: string; isActive?: boolean }) {
  const db = await getDb();
  if (!db) return [];
  const conditions = [];
  if (filters?.type) conditions.push(eq(recurringTransactions.transactionType, filters.type as any));
  if (filters?.isActive !== undefined) conditions.push(eq(recurringTransactions.isActive, filters.isActive));
  let query = db.select().from(recurringTransactions);
  if (conditions.length > 0) query = query.where(and(...conditions)) as any;
  return query.orderBy(asc(recurringTransactions.nextDate));
}

export async function createRecurringTransaction(data: InsertRecurringTransaction) {
  const db = await getDb();
  if (!db) return null;
  const [result] = await db.insert(recurringTransactions).values(data).$returningId();
  return result;
}

export async function updateRecurringTransaction(id: number, data: Partial<InsertRecurringTransaction>) {
  const db = await getDb();
  if (!db) return null;
  await db.update(recurringTransactions).set(data).where(eq(recurringTransactions.id, id));
  const result = await db.select().from(recurringTransactions).where(eq(recurringTransactions.id, id)).limit(1);
  return result[0] || null;
}

// ─── Reconciliations ────────────────────────────────────────────────
export async function getReconciliations(accountId?: number) {
  const db = await getDb();
  if (!db) return [];
  let query = db.select().from(reconciliations);
  if (accountId) query = query.where(eq(reconciliations.accountId, accountId)) as any;
  return query.orderBy(desc(reconciliations.statementDate));
}

export async function createReconciliation(data: InsertReconciliation) {
  const db = await getDb();
  if (!db) return null;
  const [result] = await db.insert(reconciliations).values(data).$returningId();
  return result;
}

export async function updateReconciliation(id: number, data: Partial<InsertReconciliation>) {
  const db = await getDb();
  if (!db) return null;
  await db.update(reconciliations).set(data).where(eq(reconciliations.id, id));
  const result = await db.select().from(reconciliations).where(eq(reconciliations.id, id)).limit(1);
  return result[0] || null;
}

// ─── Reports ────────────────────────────────────────────────────────
export async function getTrialBalance() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(accounts).where(eq(accounts.isActive, true)).orderBy(asc(accounts.accountType), asc(accounts.name));
}

export async function getGeneralLedger(filters?: { accountId?: number; startDate?: Date; endDate?: Date }) {
  const db = await getDb();
  if (!db) return [];
  // Return all journal entry lines with account info
  const conditions = [];
  if (filters?.accountId) conditions.push(eq(journalEntryLines.accountId, filters.accountId));
  let query = db.select({
    line: journalEntryLines,
    accountName: accounts.name,
    entryDate: journalEntries.entryDate,
    entryNumber: journalEntries.entryNumber,
    memo: journalEntries.memo,
  }).from(journalEntryLines)
    .leftJoin(accounts, eq(journalEntryLines.accountId, accounts.id))
    .leftJoin(journalEntries, eq(journalEntryLines.journalEntryId, journalEntries.id));
  if (conditions.length > 0) query = query.where(and(...conditions)) as any;
  return (query as any).orderBy(desc(journalEntries.entryDate));
}

export async function getAccountRegister(accountId: number) {
  const db = await getDb();
  if (!db) return { account: null, transactions: [] };
  const account = await getAccountById(accountId);
  // Get all transactions related to this account
  const txns = await db.select().from(bankTransactions)
    .where(eq(bankTransactions.accountId, accountId))
    .orderBy(desc(bankTransactions.transactionDate));
  return { account, transactions: txns };
}

export async function getAgingReport(type: "receivable" | "payable") {
  const db = await getDb();
  if (!db) return [];
  if (type === "receivable") {
    const openInvoices = await db.select({
      invoice: invoices,
      customerName: customers.displayName,
    }).from(invoices)
      .leftJoin(customers, eq(invoices.customerId, customers.id))
      .where(and(
        sql`${invoices.status} NOT IN ('Paid', 'Voided', 'Deposited')`,
        sql`${invoices.amountDue} > 0`
      ));
    return openInvoices;
  } else {
    const openBills = await db.select({
      bill: bills,
      supplierName: suppliers.displayName,
    }).from(bills)
      .leftJoin(suppliers, eq(bills.supplierId, suppliers.id))
      .where(and(
        sql`${bills.status} NOT IN ('Paid', 'Voided')`,
        sql`${bills.amountDue} > 0`
      ));
    return openBills;
  }
}

// ─── Delete Invoice ─────────────────────────────────────────────────
export async function deleteInvoice(id: number) {
  const db = await getDb();
  if (!db) return;
  // Delete line items first
  await db.delete(invoiceLineItems).where(eq(invoiceLineItems.invoiceId, id));
  // Delete payment applications
  await db.delete(paymentApplications).where(eq(paymentApplications.invoiceId, id));
  // Delete the invoice
  await db.delete(invoices).where(eq(invoices.id, id));
}

// ─── Delete Expense ─────────────────────────────────────────────────
export async function deleteExpense(id: number) {
  const db = await getDb();
  if (!db) return;
  // Delete line items first
  await db.delete(expenseLineItems).where(eq(expenseLineItems.expenseId, id));
  // Delete the expense
  await db.delete(expenses).where(eq(expenses.id, id));
}

// ─── Record Invoice Payment ─────────────────────────────────────────
export async function recordInvoicePayment(input: {
  invoiceId: number;
  amount: string;
  paymentDate?: Date;
  paymentMethod?: string;
  memo?: string;
}) {
  const db = await getDb();
  if (!db) return null;

  // Get the invoice
  const [inv] = await db.select().from(invoices).where(eq(invoices.id, input.invoiceId)).limit(1);
  if (!inv) throw new Error("Invoice not found");

  const paymentAmount = parseFloat(input.amount);
  const currentPaid = parseFloat(inv.amountPaid || "0");
  const total = parseFloat(inv.total || "0");
  const newPaid = currentPaid + paymentAmount;
  const newDue = total - newPaid;

  // Create the payment record
  const [payment] = await db.insert(payments).values({
    customerId: inv.customerId,
    paymentDate: input.paymentDate || new Date(),
    amount: input.amount,
    paymentMethod: input.paymentMethod || "Other",
    memo: input.memo || `Payment for invoice ${inv.invoiceNumber}`,
  }).$returningId();

  // Create payment application
  await db.insert(paymentApplications).values({
    paymentId: payment.id,
    invoiceId: input.invoiceId,
    amount: input.amount,
  });

  // Update invoice amounts and status
  const newStatus = newDue <= 0.01 ? "Paid" : "Partial";
  await db.update(invoices).set({
    amountPaid: newPaid.toFixed(2),
    amountDue: Math.max(0, newDue).toFixed(2),
    status: newStatus,
  }).where(eq(invoices.id, input.invoiceId));

  // Journalize the payment
  const { journalizePayment } = await import("./accounting");
  try { await journalizePayment(payment.id); } catch (e) { console.warn("[Accounting] Failed to journalize payment:", e); }

  return { paymentId: payment.id, newStatus, amountDue: Math.max(0, newDue).toFixed(2) };
}

// ─── Customer Balances (from accounting engine) ─────────────────────
export async function getCustomerBalances() {
  const db = await getDb();
  if (!db) return [];

  const allCustomers = await db.select().from(customers).where(eq(customers.isActive, true)).orderBy(asc(customers.displayName));
  const { getCustomerBalance } = await import("./accounting");

  const results = [];
  for (const cust of allCustomers) {
    const balance = await getCustomerBalance(cust.id);
    results.push({
      id: cust.id,
      displayName: cust.displayName,
      company: cust.company,
      email: cust.email,
      phone: cust.phone,
      balance,
    });
  }
  return results;
}

// ─── Supplier Balances (from accounting engine) ─────────────────────
export async function getSupplierBalances() {
  const db = await getDb();
  if (!db) return [];

  const allSuppliers = await db.select().from(suppliers).where(eq(suppliers.isActive, true)).orderBy(asc(suppliers.displayName));
  const { getSupplierBalance } = await import("./accounting");

  const results = [];
  for (const sup of allSuppliers) {
    const balance = await getSupplierBalance(sup.id);
    results.push({
      id: sup.id,
      displayName: sup.displayName,
      company: sup.company,
      email: sup.email,
      phone: sup.phone,
      balance,
    });
  }
  return results;
}

// ─── Sprint 28: Bank CSV Import ─────────────────────────────────────
export async function importBankTransactions(accountId: number, transactions: Array<{
  transactionDate: Date;
  description: string;
  amount: string;
  fitId?: string;
}>) {
  const db = await getDb();
  if (!db) return { imported: 0, skipped: 0 };
  let imported = 0;
  let skipped = 0;
  for (const txn of transactions) {
    // Skip duplicates by fitId
    if (txn.fitId) {
      const existing = await db.select().from(bankTransactions)
        .where(and(eq(bankTransactions.accountId, accountId), eq(bankTransactions.fitId, txn.fitId)))
        .limit(1);
      if (existing.length > 0) { skipped++; continue; }
    }
    await db.insert(bankTransactions).values({
      accountId,
      transactionDate: txn.transactionDate,
      description: txn.description,
      amount: txn.amount,
      fitId: txn.fitId || `CSV-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      status: "For Review",
    });
    imported++;
  }
  return { imported, skipped };
}

// ─── Sprint 29: Attachments ─────────────────────────────────────────
export async function getAttachments(entityType: string, entityId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(attachments)
    .where(and(eq(attachments.entityType, entityType), eq(attachments.entityId, entityId)))
    .orderBy(desc(attachments.createdAt));
}

export async function createAttachment(data: {
  entityType: string;
  entityId: number;
  fileName: string;
  fileUrl: string;
  fileKey: string;
  mimeType?: string;
  fileSize?: number;
  uploadedBy?: number;
}) {
  const db = await getDb();
  if (!db) return null;
  const [result] = await db.insert(attachments).values(data);
  return { id: result.insertId, ...data };
}

export async function deleteAttachment(id: number) {
  const db = await getDb();
  if (!db) return;
  await db.delete(attachments).where(eq(attachments.id, id));
}

// ─── Sprint 31: Estimate to Invoice Conversion ─────────────────────
export async function convertEstimateToInvoice(estimateId: number) {
  const db = await getDb();
  if (!db) return null;
  const estimate = await getEstimateById(estimateId);
  if (!estimate || !estimate.estimate) return null;
  const est = estimate.estimate;
  // Create invoice from estimate
  const invNumber = `INV-${Date.now().toString(36).toUpperCase()}`;
  const [invResult] = await db.insert(invoices).values({
    invoiceNumber: invNumber,
    customerId: est.customerId,
    invoiceDate: new Date(),
    dueDate: new Date(Date.now() + 30 * 86400000),
    subtotal: est.subtotal,
    taxAmount: est.taxAmount,
    total: est.total,
    amountDue: est.total,
    status: "Draft",
    notes: est.notes,
  });
  // Copy line items
  if (estimate.lineItems?.length) {
    for (const li of estimate.lineItems) {
      await db.insert(invoiceLineItems).values({
        invoiceId: invResult.insertId,
        productId: li.productId,
        description: li.description,
        quantity: li.quantity,
        rate: li.rate,
        amount: li.amount,
        taxCode: li.taxCode,
        taxAmount: li.taxAmount,
        sortOrder: li.sortOrder,
      });
    }
  }
  // Update estimate status
  await db.update(estimates).set({ status: "Converted", convertedInvoiceId: invResult.insertId })
    .where(eq(estimates.id, estimateId));
  return { invoiceId: invResult.insertId, invoiceNumber: invNumber };
}

// ─── Sprint 31: Pay Bill ────────────────────────────────────────────
export async function payBill(billId: number, amount: string, paymentAccountId: number, paymentDate: Date) {
  const db = await getDb();
  if (!db) return null;
  const [bill] = await db.select().from(bills).where(eq(bills.id, billId)).limit(1);
  if (!bill) return null;
  const paidSoFar = parseFloat(bill.amountPaid || "0") + parseFloat(amount);
  const totalDue = parseFloat(bill.total || "0");
  const newAmountDue = Math.max(0, totalDue - paidSoFar);
  const newStatus = paidSoFar >= totalDue ? "Paid" : "Partial";
  await db.update(bills).set({
    amountPaid: paidSoFar.toFixed(2),
    amountDue: newAmountDue.toFixed(2),
    status: newStatus,
  }).where(eq(bills.id, billId));
  // Create expense for the bill payment
  const [expResult] = await db.insert(expenses).values({
    expenseType: "Bill Payment",
    payeeType: "supplier",
    payeeId: bill.supplierId,
    accountId: paymentAccountId,
    expenseDate: paymentDate,
    total: amount,
    subtotal: amount,
    memo: `Payment for Bill #${bill.billNumber || billId}`,
  });
  return { expenseId: expResult.insertId, newStatus, amountPaid: paidSoFar.toFixed(2), amountDue: newAmountDue.toFixed(2) };
}

// ─── Sprint 33: Sales Tax Automation ────────────────────────────────
export async function calculateInvoiceTax(invoiceId: number) {
  const db = await getDb();
  if (!db) return null;
  const lines = await db.select().from(invoiceLineItems).where(eq(invoiceLineItems.invoiceId, invoiceId));
  const activeTaxRates = await db.select().from(taxRates).where(eq(taxRates.isActive, true));
  let totalTax = 0;
  for (const line of lines) {
    if (line.taxCode && line.taxCode !== "Non") {
      const rate = activeTaxRates.find(r => r.code === line.taxCode);
      if (rate) {
        const lineTax = parseFloat(line.amount || "0") * parseFloat(rate.rate);
        await db.update(invoiceLineItems).set({ taxAmount: lineTax.toFixed(2) }).where(eq(invoiceLineItems.id, line.id));
        totalTax += lineTax;
      }
    }
  }
  const [inv] = await db.select().from(invoices).where(eq(invoices.id, invoiceId)).limit(1);
  if (inv) {
    const subtotal = parseFloat(inv.subtotal || "0");
    await db.update(invoices).set({
      taxAmount: totalTax.toFixed(2),
      total: (subtotal + totalTax).toFixed(2),
      amountDue: (subtotal + totalTax - parseFloat(inv.amountPaid || "0")).toFixed(2),
    }).where(eq(invoices.id, invoiceId));
  }
  return { totalTax: totalTax.toFixed(2) };
}

export async function prepareTaxReturn(periodStart: Date, periodEnd: Date) {
  const db = await getDb();
  if (!db) return null;
  // Sum tax collected on sales (invoices)
  const invs = await db.select().from(invoices)
    .where(and(gte(invoices.invoiceDate, periodStart), lte(invoices.invoiceDate, periodEnd)));
  const collectedOnSales = invs.reduce((sum, inv) => sum + parseFloat(inv.taxAmount || "0"), 0);
  // Sum tax paid on purchases (expenses)
  const exps = await db.select().from(expenses)
    .where(and(gte(expenses.expenseDate, periodStart), lte(expenses.expenseDate, periodEnd)));
  const paidOnPurchases = exps.reduce((sum, exp) => sum + parseFloat(exp.taxAmount || "0"), 0);
  const netTax = collectedOnSales - paidOnPurchases;
  // Create filing
  const [result] = await db.insert(taxFilings).values({
    agency: "CRA",
    periodStart,
    periodEnd,
    collectedOnSales: collectedOnSales.toFixed(2),
    paidOnPurchases: paidOnPurchases.toFixed(2),
    netTax: netTax.toFixed(2),
    status: "Due",
  });
  return { id: result.insertId, collectedOnSales: collectedOnSales.toFixed(2), paidOnPurchases: paidOnPurchases.toFixed(2), netTax: netTax.toFixed(2) };
}

export async function recordTaxPayment(filingId: number, paidDate: Date) {
  const db = await getDb();
  if (!db) return;
  await db.update(taxFilings).set({ status: "Paid", paidDate }).where(eq(taxFilings.id, filingId));
}

// ─── Sprint 34: Additional Reports ──────────────────────────────────
export async function getTransactionsByDate(startDate: Date, endDate: Date) {
  const db = await getDb();
  if (!db) return [];
  // Combine invoices, expenses, payments, journal entries in date range
  const invs = await db.select().from(invoices)
    .where(and(gte(invoices.invoiceDate, startDate), lte(invoices.invoiceDate, endDate)));
  const exps = await db.select().from(expenses)
    .where(and(gte(expenses.expenseDate, startDate), lte(expenses.expenseDate, endDate)));
  const pmts = await db.select().from(payments)
    .where(and(gte(payments.paymentDate, startDate), lte(payments.paymentDate, endDate)));
  const jes = await db.select().from(journalEntries)
    .where(and(gte(journalEntries.entryDate, startDate), lte(journalEntries.entryDate, endDate)));
  const all: Array<{ type: string; date: Date; description: string; amount: string; id: number }> = [];
  invs.forEach(i => all.push({ type: "Invoice", date: i.invoiceDate, description: `Invoice ${i.invoiceNumber}`, amount: i.total || "0", id: i.id }));
  exps.forEach(e => all.push({ type: "Expense", date: e.expenseDate, description: e.payeeName || "Expense", amount: e.total || "0", id: e.id }));
  pmts.forEach(p => all.push({ type: "Payment", date: p.paymentDate, description: `Payment #${p.id}`, amount: String(p.amount), id: p.id }));
  jes.forEach(j => all.push({ type: "Journal Entry", date: j.entryDate, description: j.memo || `JE #${j.entryNumber}`, amount: "0", id: j.id }));
  all.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  return all;
}

export async function getSalesByCustomer(startDate?: Date, endDate?: Date) {
  const db = await getDb();
  if (!db) return [];
  let query = db.select({
    customerId: invoices.customerId,
    customerName: customers.displayName,
    totalSales: sql<string>`SUM(CAST(${invoices.total} AS DECIMAL(15,2)))`,
    invoiceCount: sql<number>`COUNT(*)`,
  }).from(invoices)
    .leftJoin(customers, eq(invoices.customerId, customers.id))
    .groupBy(invoices.customerId, customers.displayName)
    .orderBy(desc(sql`SUM(CAST(${invoices.total} AS DECIMAL(15,2)))`));
  return query;
}

export async function getSalesByProduct() {
  const db = await getDb();
  if (!db) return [];
  return db.select({
    productId: invoiceLineItems.productId,
    productName: products.name,
    totalSales: sql<string>`SUM(CAST(${invoiceLineItems.amount} AS DECIMAL(15,2)))`,
    quantitySold: sql<string>`SUM(CAST(${invoiceLineItems.quantity} AS DECIMAL(10,2)))`,
  }).from(invoiceLineItems)
    .leftJoin(products, eq(invoiceLineItems.productId, products.id))
    .where(sql`${invoiceLineItems.productId} IS NOT NULL`)
    .groupBy(invoiceLineItems.productId, products.name)
    .orderBy(desc(sql`SUM(CAST(${invoiceLineItems.amount} AS DECIMAL(15,2)))`));
}

// Sprint 35: Account management uses existing createAccount/updateAccount functions above

// ─── Sprint 38: Account Transfers ───────────────────────────────────
export async function createAccountTransfer(data: {
  fromAccountId: number;
  toAccountId: number;
  amount: string;
  transferDate: Date;
  memo?: string;
}) {
  const db = await getDb();
  if (!db) return null;
  const [result] = await db.insert(accountTransfers).values(data);
  return { id: result.insertId, ...data };
}

export async function getAccountTransfers() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(accountTransfers).orderBy(desc(accountTransfers.transferDate));
}

// ─── Sprint 41: Invoice PDF Data ─────────────────────────────────────
export async function getInvoicePdfData(invoiceId: number) {
  const db = await getDb();
  if (!db) return null;
  const [inv] = await db.select().from(invoices).where(eq(invoices.id, invoiceId));
  if (!inv) return null;
  const lines = await db.select().from(invoiceLineItems).where(eq(invoiceLineItems.invoiceId, invoiceId));
  const customer = inv.customerId ? (await db.select().from(customers).where(eq(customers.id, inv.customerId)))[0] : null;
  const company = await getCompanySettings();
  return { invoice: inv, lineItems: lines, customer, company };
}

// ─── Sprint 43: CSV Export Helpers ───────────────────────────────────
export async function getReportDataForExport(reportType: string, params?: { startDate?: Date; endDate?: Date; accountId?: number }) {
  switch (reportType) {
    case "trialBalance": return getTrialBalance();
    case "agingReceivable": return getAgingReport("receivable");
    case "agingPayable": return getAgingReport("payable");
    case "customerBalances": return getCustomerBalances();
    case "supplierBalances": return getSupplierBalances();
    case "salesByCustomer": return getSalesByCustomer();
    case "salesByProduct": return getSalesByProduct();
    case "transactionsByDate":
      if (params?.startDate && params?.endDate) return getTransactionsByDate(params.startDate, params.endDate);
      return [];
    case "generalLedger": return getGeneralLedger(params);
    default: return [];
  }
}

// ─── Sprint 44: Multi-Currency ───────────────────────────────────────
export async function getExchangeRates(fromCurrency?: string) {
  const db = await getDb();
  if (!db) return [];
  if (fromCurrency) {
    return db.select().from(exchangeRates)
      .where(eq(exchangeRates.fromCurrency, fromCurrency))
      .orderBy(desc(exchangeRates.effectiveDate));
  }
  return db.select().from(exchangeRates).orderBy(desc(exchangeRates.effectiveDate));
}

export async function createExchangeRate(data: InsertExchangeRate) {
  const db = await getDb();
  if (!db) return null;
  const [result] = await db.insert(exchangeRates).values(data);
  return { id: result.insertId, ...data };
}

// ─── Sprint 45: Recurring Auto-Generation ────────────────────────────
export async function getDueRecurringTransactions() {
  const db = await getDb();
  if (!db) return [];
  const now = new Date();
  return db.select().from(recurringTransactions)
    .where(and(
      eq(recurringTransactions.isActive, true),
      lte(recurringTransactions.nextDate, now)
    ));
}

export async function advanceRecurringNextDate(id: number, frequency: string, currentNext: Date) {
  const db = await getDb();
  if (!db) return;
  const next = new Date(currentNext);
  switch (frequency) {
    case "Daily": next.setDate(next.getDate() + 1); break;
    case "Weekly": next.setDate(next.getDate() + 7); break;
    case "Monthly": next.setMonth(next.getMonth() + 1); break;
    case "Yearly": next.setFullYear(next.getFullYear() + 1); break;
  }
  await db.update(recurringTransactions).set({ nextDate: next, lastGenerated: new Date() }).where(eq(recurringTransactions.id, id));
}

// ─── Sprint 46: Bank Rules ──────────────────────────────────────────
export async function getBankRules() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(bankRules).orderBy(bankRules.priority);
}

export async function createBankRule(data: InsertBankRule) {
  const db = await getDb();
  if (!db) return null;
  const [result] = await db.insert(bankRules).values(data);
  return { id: result.insertId, ...data };
}

export async function updateBankRule(id: number, data: Partial<InsertBankRule>) {
  const db = await getDb();
  if (!db) return null;
  await db.update(bankRules).set(data).where(eq(bankRules.id, id));
  return { id, ...data };
}

export async function deleteBankRule(id: number) {
  const db = await getDb();
  if (!db) return;
  await db.delete(bankRules).where(eq(bankRules.id, id));
}

export async function applyBankRules(transactionId: number) {
  const db = await getDb();
  if (!db) return null;
  const [tx] = await db.select().from(bankTransactions).where(eq(bankTransactions.id, transactionId));
  if (!tx) return null;
  const rules = await getBankRules();
  for (const rule of rules) {
    if (!rule.isActive) continue;
    const conditions = (rule.conditions as any[]) || [];
    let matches = true;
    for (const cond of conditions) {
      const field = cond.field === "description" ? tx.description : cond.field === "amount" ? String(tx.amount) : "";
      const val = (field || "").toLowerCase();
      const target = (cond.value || "").toLowerCase();
      switch (cond.operator) {
        case "contains": if (!val.includes(target)) matches = false; break;
        case "equals": if (val !== target) matches = false; break;
        case "startsWith": if (!val.startsWith(target)) matches = false; break;
        case "greaterThan": if (parseFloat(val) <= parseFloat(target)) matches = false; break;
        case "lessThan": if (parseFloat(val) >= parseFloat(target)) matches = false; break;
        default: matches = false;
      }
    }
    if (matches && conditions.length > 0) {
      const updates: any = {};
      if (rule.assignAccountId) updates.accountId = rule.assignAccountId;
      if (rule.assignCategory) updates.category = rule.assignCategory;
      if (rule.autoConfirm) updates.status = "Categorized";
      await db.update(bankTransactions).set(updates).where(eq(bankTransactions.id, transactionId));
      return { ruleId: rule.id, ruleName: rule.name, applied: true };
    }
  }
  return { applied: false };
}

// ─── Sprint 47: Audit Trail Enhanced ─────────────────────────────────
export async function getAuditLogFiltered(filters: { entityType?: string; action?: string; userId?: number; limit?: number }) {
  const db = await getDb();
  if (!db) return [];
  const conditions = [];
  if (filters.entityType) conditions.push(eq(auditLog.entityType, filters.entityType));
  if (filters.action) conditions.push(eq(auditLog.action, filters.action as any));
  if (filters.userId) conditions.push(eq(auditLog.userId, filters.userId));
  let query = db.select().from(auditLog);
  if (conditions.length > 0) query = query.where(and(...conditions)) as any;
  return (query as any).orderBy(desc(auditLog.createdAt)).limit(filters.limit || 100);
}

// ─── Sprint 49: Reconciliation Workspace ─────────────────────────────
export async function getReconciliationWorkspace(accountId: number, statementDate: Date) {
  const db = await getDb();
  if (!db) return { transactions: [], clearedTotal: 0, unclearedTotal: 0 };
  // Get all bank transactions for this account up to statement date
  const txns = await db.select().from(bankTransactions)
    .where(and(
      eq(bankTransactions.accountId, accountId),
      lte(bankTransactions.transactionDate, statementDate)
    ))
    .orderBy(desc(bankTransactions.transactionDate));
  const cleared = txns.filter(t => t.isReconciled);
  const uncleared = txns.filter(t => !t.isReconciled);
  return {
    transactions: txns,
    clearedTotal: cleared.reduce((sum, t) => sum + parseFloat(t.amount || "0"), 0),
    unclearedTotal: uncleared.reduce((sum, t) => sum + parseFloat(t.amount || "0"), 0),
  };
}

export async function toggleTransactionReconciled(transactionId: number, isReconciled: boolean) {
  const db = await getDb();
  if (!db) return;
  await db.update(bankTransactions).set({ isReconciled }).where(eq(bankTransactions.id, transactionId));
}

// ── Notification Center ──────────────────────────────────────────────
export async function getNotificationAlerts() {
  const database = await getDb();
  if (!database) return { overdue: [], upcoming: [], lowBalance: [], overdueCount: 0, upcomingCount: 0, totalAlerts: 0 };

  const now = new Date();

  // 1. Overdue invoices (past due date, not paid/void)
  const overdueInvoices = await database
    .select({
      id: invoices.id,
      invoiceNumber: invoices.invoiceNumber,
      customerName: customers.displayName,
      amount: invoices.total,
      dueDate: invoices.dueDate,
      status: invoices.status,
    })
    .from(invoices)
    .leftJoin(customers, eq(invoices.customerId, customers.id))
    .where(
      and(
        lt(invoices.dueDate, now),
        and(
          sql`${invoices.status} NOT IN ('Paid', 'Voided', 'Draft')`
        )
      )
    )
    .orderBy(asc(invoices.dueDate))
    .limit(20);

  // 2. Upcoming recurring transactions (due within 7 days)
  const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const upcomingRecurring = await database
    .select()
    .from(recurringTransactions)
    .where(
      and(
        eq(recurringTransactions.isActive, true),
        lte(recurringTransactions.nextDate, sevenDaysFromNow)
      )
    )
    .orderBy(asc(recurringTransactions.nextDate))
    .limit(10);

  // 3. Low balance bank accounts (below $1000 threshold)
  const bankAccounts = await database
    .select({
      id: accounts.id,
      name: accounts.name,
      balance: accounts.balance,
    })
    .from(accounts)
    .where(
      and(
        eq(accounts.accountType, "Bank"),
        eq(accounts.isActive, true),
        lt(accounts.balance, "1000")
      )
    );

  const overdueCount = overdueInvoices.length;
  const upcomingCount = upcomingRecurring.length;
  const totalAlerts = overdueCount + upcomingCount + bankAccounts.length;

  return {
    overdue: overdueInvoices.map(inv => ({
      id: inv.id,
      type: "overdue_invoice" as const,
      title: `Invoice #${inv.invoiceNumber} overdue`,
      description: `${inv.customerName || "Customer"} — $${Number(inv.amount || 0).toFixed(2)}`,
      date: inv.dueDate,
      severity: "high" as const,
      link: `/invoices/${inv.id}`,
    })),
    upcoming: upcomingRecurring.map(rec => ({
      id: rec.id,
      type: "upcoming_recurring" as const,
      title: `${rec.templateName} due soon`,
      description: `${rec.frequency} recurring ${rec.transactionType.toLowerCase()}`,
      date: rec.nextDate,
      severity: "medium" as const,
      link: `/recurring`,
    })),
    lowBalance: bankAccounts.map(acc => ({
      id: acc.id,
      type: "low_balance" as const,
      title: `Low balance: ${acc.name}`,
      description: `Current balance: $${Number(acc.balance || 0).toFixed(2)}`,
      date: now,
      severity: "warning" as const,
      link: `/chart-of-accounts`,
    })),
    overdueCount,
    upcomingCount,
    totalAlerts,
  };
}


// ─── Email Templates (Enhancement I) ─────────────────────────────────
export async function getEmailTemplates(filters?: { type?: string }) {
  const db = await getDb();
  if (!db) return [];
  let query = db.select().from(emailTemplates);
  if (filters?.type) query = query.where(eq(emailTemplates.type, filters.type as any)) as any;
  return query.orderBy(asc(emailTemplates.name));
}

export async function getEmailTemplateById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(emailTemplates).where(eq(emailTemplates.id, id)).limit(1);
  return result[0] || null;
}

export async function createEmailTemplate(data: InsertEmailTemplate) {
  const db = await getDb();
  if (!db) return null;
  const [result] = await db.insert(emailTemplates).values(data).$returningId();
  // Return the full template with all fields
  return getEmailTemplateById(result.id);
}

export async function updateEmailTemplate(id: number, data: Partial<InsertEmailTemplate>) {
  const db = await getDb();
  if (!db) return null;
  await db.update(emailTemplates).set({ ...data, updatedAt: new Date() }).where(eq(emailTemplates.id, id));
  return getEmailTemplateById(id);
}

export async function deleteEmailTemplate(id: number) {
  const db = await getDb();
  if (!db) return;
  await db.delete(emailTemplates).where(eq(emailTemplates.id, id));
}

// ─── Bulk Operations (Enhancement H) ─────────────────────────────────
export async function bulkUpdateInvoiceStatus(ids: number[], status: string) {
  const db = await getDb();
  if (!db) return { count: 0 };
  await db.update(invoices).set({ status: status as any }).where(inArray(invoices.id, ids));
  return { count: ids.length };
}

export async function bulkDeleteInvoices(ids: number[]) {
  const db = await getDb();
  if (!db) return { count: 0 };
  // Delete line items first
  for (const id of ids) {
    await db.delete(invoiceLineItems).where(eq(invoiceLineItems.invoiceId, id));
  }
  await db.delete(invoices).where(inArray(invoices.id, ids));
  return { count: ids.length };
}

export async function bulkDeleteExpenses(ids: number[]) {
  const db = await getDb();
  if (!db) return { count: 0 };
  // Delete line items first
  for (const id of ids) {
    await db.delete(expenseLineItems).where(eq(expenseLineItems.expenseId, id));
  }
  await db.delete(expenses).where(inArray(expenses.id, ids));
  return { count: ids.length };
}


// ─── Enhancement J: Recurring Invoice Auto-Generation ─────────────────
export async function generateInvoiceFromRecurring(recurringId: number) {
  const db = await getDb();
  if (!db) return null;
  const [rec] = await db.select().from(recurringTransactions).where(eq(recurringTransactions.id, recurringId));
  if (!rec || !rec.isActive) return null;
  const tpl = (rec.templateData || {}) as any;
  // Generate invoice number: REC-{recurringId}-{timestamp}
  const invoiceNumber = `REC-${recurringId}-${Date.now().toString(36).toUpperCase()}`;
  const invoiceDate = new Date();
  const dueDate = new Date(invoiceDate);
  dueDate.setDate(dueDate.getDate() + (tpl.netTermsDays || 30));
  const invoiceData: any = {
    invoiceNumber,
    customerId: tpl.customerId || 1,
    invoiceDate,
    dueDate,
    subtotal: tpl.subtotal || "0.00",
    taxAmount: tpl.taxAmount || "0.00",
    total: tpl.total || "0.00",
    amountDue: tpl.total || "0.00",
    status: "Draft",
    notes: `Auto-generated from recurring template: ${rec.templateName}`,
    currency: tpl.currency || "CAD",
    recurringTransactionId: recurringId,
  };
  const lineItems = (tpl.lineItems || []).map((li: any, idx: number) => ({
    description: li.description || "",
    quantity: li.quantity || "1.00",
    rate: li.rate || "0.00",
    amount: li.amount || "0.00",
    sortOrder: idx,
  }));
  const result = await createInvoice(invoiceData, lineItems);
  // Log the generation
  await db.insert(recurringGenerationLog).values({
    recurringTransactionId: recurringId,
    generatedEntityType: "Invoice",
    generatedEntityId: result?.id || null,
    status: result ? "success" : "failed",
    errorMessage: result ? null : "Failed to create invoice",
    autoSent: false,
  });
  // Advance the next date
  if (rec.nextDate) {
    await advanceRecurringNextDate(rec.id, rec.frequency, rec.nextDate);
  }
  // Check if end date has passed
  if (rec.endDate) {
    const newNext = new Date(rec.nextDate!);
    switch (rec.frequency) {
      case "Daily": newNext.setDate(newNext.getDate() + 1); break;
      case "Weekly": newNext.setDate(newNext.getDate() + 7); break;
      case "Monthly": newNext.setMonth(newNext.getMonth() + 1); break;
      case "Yearly": newNext.setFullYear(newNext.getFullYear() + 1); break;
    }
    if (newNext > rec.endDate) {
      await db.update(recurringTransactions).set({ isActive: false }).where(eq(recurringTransactions.id, recurringId));
    }
  }
  return result;
}

export async function processAllDueRecurring() {
  const dueItems = await getDueRecurringTransactions();
  const results: { id: number; templateName: string; success: boolean; invoiceId?: number }[] = [];
  for (const item of dueItems) {
    if (item.transactionType === "Invoice") {
      const result = await generateInvoiceFromRecurring(item.id);
      results.push({
        id: item.id,
        templateName: item.templateName,
        success: !!result,
        invoiceId: result?.id,
      });
    } else if (item.transactionType === "Expense") {
      const tpl = (item.templateData || {}) as any;
      const result = await createExpense({
        payeeName: tpl.payeeName || "Recurring Expense",
        accountId: tpl.accountId,
        expenseDate: new Date(),
        total: tpl.total || "0",
        memo: `Auto-generated from ${item.templateName}`,
      } as any, []);
      if (item.nextDate) {
        await advanceRecurringNextDate(item.id, item.frequency, item.nextDate);
      }
      const db2 = await getDb();
      if (db2) {
        await db2.insert(recurringGenerationLog).values({
          recurringTransactionId: item.id,
          generatedEntityType: "Expense",
          generatedEntityId: result?.id || null,
          status: result ? "success" : "failed",
        });
      }
      results.push({ id: item.id, templateName: item.templateName, success: !!result });
    }
  }
  return results;
}

export async function getGenerationLog(recurringTransactionId?: number, limit = 50) {
  const db = await getDb();
  if (!db) return [];
  let query = db.select().from(recurringGenerationLog);
  if (recurringTransactionId) {
    query = query.where(eq(recurringGenerationLog.recurringTransactionId, recurringTransactionId)) as any;
  }
  return (query as any).orderBy(desc(recurringGenerationLog.generatedAt)).limit(limit);
}

// ─── Enhancement K: Multi-Currency Helpers ────────────────────────────
export async function getLatestExchangeRate(fromCurrency: string, toCurrency: string) {
  const db = await getDb();
  if (!db) return null;
  if (fromCurrency === toCurrency) return { rate: "1.000000", source: "identity" };
  const result = await db.select().from(exchangeRates)
    .where(and(
      eq(exchangeRates.fromCurrency, fromCurrency),
      eq(exchangeRates.toCurrency, toCurrency)
    ))
    .orderBy(desc(exchangeRates.effectiveDate))
    .limit(1);
  if (result[0]) return { rate: result[0].rate, source: result[0].source };
  // Try reverse
  const reverse = await db.select().from(exchangeRates)
    .where(and(
      eq(exchangeRates.fromCurrency, toCurrency),
      eq(exchangeRates.toCurrency, fromCurrency)
    ))
    .orderBy(desc(exchangeRates.effectiveDate))
    .limit(1);
  if (reverse[0]) {
    const inverseRate = (1 / parseFloat(reverse[0].rate)).toFixed(6);
    return { rate: inverseRate, source: `inverse of ${reverse[0].source}` };
  }
  return null;
}

export async function convertAmount(amount: string, fromCurrency: string, toCurrency: string): Promise<{ converted: string; rate: string } | null> {
  if (fromCurrency === toCurrency) return { converted: amount, rate: "1.000000" };
  const rateInfo = await getLatestExchangeRate(fromCurrency, toCurrency);
  if (!rateInfo) return null;
  const converted = (parseFloat(amount) * parseFloat(rateInfo.rate)).toFixed(2);
  return { converted, rate: rateInfo.rate };
}

// ─── Enhancement L: Audit Trail Middleware Helper ─────────────────────
export async function logAuditAction(params: {
  userId?: number;
  action: string;
  entityType: string;
  entityId?: number;
  details?: any;
  ipAddress?: string;
}) {
  try {
    await createAuditEntry({
      userId: params.userId || null,
      action: params.action,
      entityType: params.entityType,
      entityId: params.entityId || null,
      details: params.details ? JSON.stringify(params.details) : null,
      ipAddress: params.ipAddress || null,
    });
  } catch (e) {
    console.warn("[Audit] Failed to log:", e);
  }
}

export async function getAuditLogEnhanced(filters: {
  entityType?: string;
  action?: string;
  startDate?: Date;
  endDate?: Date;
  search?: string;
  limit?: number;
}) {
  const db = await getDb();
  if (!db) return [];
  const conditions = [];
  if (filters.entityType) conditions.push(eq(auditLog.entityType, filters.entityType));
  if (filters.action) conditions.push(eq(auditLog.action, filters.action as any));
  if (filters.startDate) conditions.push(gte(auditLog.createdAt, filters.startDate));
  if (filters.endDate) conditions.push(lte(auditLog.createdAt, filters.endDate));
  let query = db.select({
    id: auditLog.id,
    userId: auditLog.userId,
    action: auditLog.action,
    entityType: auditLog.entityType,
    entityId: auditLog.entityId,
    details: auditLog.details,
    ipAddress: auditLog.ipAddress,
    createdAt: auditLog.createdAt,
    userName: users.name,
  }).from(auditLog)
    .leftJoin(users, eq(auditLog.userId, users.id));
  if (conditions.length > 0) query = query.where(and(...conditions)) as any;
  return (query as any).orderBy(desc(auditLog.createdAt)).limit(filters.limit || 100);
}
