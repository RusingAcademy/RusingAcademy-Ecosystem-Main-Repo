import {
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
  decimal,
  boolean,
  json,
} from "drizzle-orm/mysql-core";

// ─── Users ───────────────────────────────────────────────────────────
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ─── Company Settings ────────────────────────────────────────────────
export const companySettings = mysqlTable("company_settings", {
  id: int("id").autoincrement().primaryKey(),
  companyName: varchar("companyName", { length: 255 }).notNull(),
  legalName: varchar("legalName", { length: 255 }),
  email: varchar("email", { length: 320 }),
  phone: varchar("phone", { length: 64 }),
  address: text("address"),
  city: varchar("city", { length: 128 }),
  province: varchar("province", { length: 128 }),
  postalCode: varchar("postalCode", { length: 20 }),
  country: varchar("country", { length: 64 }).default("Canada"),
  currency: varchar("currency", { length: 3 }).default("CAD"),
  fiscalYearStart: varchar("fiscalYearStart", { length: 5 }).default("01-01"),
  taxId: varchar("taxId", { length: 64 }),
  logo: text("logo"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// ─── Chart of Accounts ───────────────────────────────────────────────
export const accounts = mysqlTable("accounts", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  accountType: varchar("accountType", { length: 64 }).notNull(),
  detailType: varchar("detailType", { length: 128 }),
  description: text("description"),
  balance: decimal("balance", { precision: 15, scale: 2 }).default("0.00"),
  bankBalance: decimal("bankBalance", { precision: 15, scale: 2 }),
  isActive: boolean("isActive").default(true).notNull(),
  isSubAccount: boolean("isSubAccount").default(false),
  parentAccountId: int("parentAccountId"),
  accountNumber: varchar("accountNumber", { length: 20 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Account = typeof accounts.$inferSelect;
export type InsertAccount = typeof accounts.$inferInsert;

// ─── Customers ───────────────────────────────────────────────────────
export const customers = mysqlTable("customers", {
  id: int("id").autoincrement().primaryKey(),
  displayName: varchar("displayName", { length: 255 }).notNull(),
  firstName: varchar("firstName", { length: 128 }),
  lastName: varchar("lastName", { length: 128 }),
  company: varchar("company", { length: 255 }),
  email: varchar("email", { length: 320 }),
  phone: varchar("phone", { length: 64 }),
  mobile: varchar("mobile", { length: 64 }),
  website: varchar("website", { length: 255 }),
  billingAddress: text("billingAddress"),
  shippingAddress: text("shippingAddress"),
  notes: text("notes"),
  balance: decimal("balance", { precision: 15, scale: 2 }).default("0.00"),
  currency: varchar("currency", { length: 3 }).default("CAD"),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
export type Customer = typeof customers.$inferSelect;
export type InsertCustomer = typeof customers.$inferInsert;;

// ─── Suppliers ───────────────────────────────────────────────────────
export const suppliers = mysqlTable("suppliers", {
  id: int("id").autoincrement().primaryKey(),
  displayName: varchar("displayName", { length: 255 }).notNull(),
  firstName: varchar("firstName", { length: 128 }),
  lastName: varchar("lastName", { length: 128 }),
  company: varchar("company", { length: 255 }),
  email: varchar("email", { length: 320 }),
  phone: varchar("phone", { length: 64 }),
  mobile: varchar("mobile", { length: 64 }),
  website: varchar("website", { length: 255 }),
  address: text("address"),
  notes: text("notes"),
  balance: decimal("balance", { precision: 15, scale: 2 }).default("0.00"),
  taxId: varchar("taxId", { length: 64 }),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Supplier = typeof suppliers.$inferSelect;
export type InsertSupplier = typeof suppliers.$inferInsert;

// ─── Products & Services ─────────────────────────────────────────────
export const products = mysqlTable("products", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  type: mysqlEnum("type", ["Service", "Inventory", "Non-Inventory"]).default("Service").notNull(),
  category: varchar("category", { length: 128 }),
  price: decimal("price", { precision: 15, scale: 2 }).default("0.00"),
  cost: decimal("cost", { precision: 15, scale: 2 }),
  sku: varchar("sku", { length: 64 }),
  isTaxable: boolean("isTaxable").default(true),
  incomeAccountId: int("incomeAccountId"),
  expenseAccountId: int("expenseAccountId"),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Product = typeof products.$inferSelect;
export type InsertProduct = typeof products.$inferInsert;

// ─── Invoices ────────────────────────────────────────────────────────
export const invoices = mysqlTable("invoices", {
  id: int("id").autoincrement().primaryKey(),
  invoiceNumber: varchar("invoiceNumber", { length: 64 }).notNull(),
  customerId: int("customerId").notNull(),
  invoiceDate: timestamp("invoiceDate").notNull(),
  dueDate: timestamp("dueDate"),
  subtotal: decimal("subtotal", { precision: 15, scale: 2 }).default("0.00"),
  taxAmount: decimal("taxAmount", { precision: 15, scale: 2 }).default("0.00"),
  total: decimal("total", { precision: 15, scale: 2 }).default("0.00"),
  amountPaid: decimal("amountPaid", { precision: 15, scale: 2 }).default("0.00"),
  amountDue: decimal("amountDue", { precision: 15, scale: 2 }).default("0.00"),
  status: mysqlEnum("status", ["Draft", "Sent", "Viewed", "Partial", "Paid", "Overdue", "Deposited", "Voided"])
    .default("Draft")
    .notNull(),
  notes: text("notes"),
  terms: text("terms"),
   isSent: boolean("isSent").default(false),
  pdfUrl: text("pdfUrl"),
  currency: varchar("currency", { length: 3 }).default("CAD"),
  exchangeRate: decimal("exchangeRate", { precision: 15, scale: 6 }).default("1.000000"),
  recurringTransactionId: int("recurringTransactionId"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
export type Invoice = typeof invoices.$inferSelect;
export type InsertInvoice = typeof invoices.$inferInsert;

// ─── Invoice Line Items ──────────────────────────────────────────────
export const invoiceLineItems = mysqlTable("invoice_line_items", {
  id: int("id").autoincrement().primaryKey(),
  invoiceId: int("invoiceId").notNull(),
  productId: int("productId"),
  description: text("description"),
  quantity: decimal("quantity", { precision: 10, scale: 2 }).default("1.00"),
  rate: decimal("rate", { precision: 15, scale: 2 }).default("0.00"),
  amount: decimal("amount", { precision: 15, scale: 2 }).default("0.00"),
  taxCode: varchar("taxCode", { length: 32 }),
  taxAmount: decimal("taxAmount", { precision: 15, scale: 2 }).default("0.00"),
  sortOrder: int("sortOrder").default(0),
});

export type InvoiceLineItem = typeof invoiceLineItems.$inferSelect;
export type InsertInvoiceLineItem = typeof invoiceLineItems.$inferInsert;

// ─── Expenses ────────────────────────────────────────────────────────
export const expenses = mysqlTable("expenses", {
  id: int("id").autoincrement().primaryKey(),
  expenseType: mysqlEnum("expenseType", ["Expense", "Cheque Expense", "Bill Payment"]).default("Expense").notNull(),
  payeeType: mysqlEnum("payeeType", ["supplier", "customer", "other"]).default("other"),
  payeeId: int("payeeId"),
  payeeName: varchar("payeeName", { length: 255 }),
  accountId: int("accountId"),
  expenseDate: timestamp("expenseDate").notNull(),
  paymentMethod: varchar("paymentMethod", { length: 64 }),
  referenceNumber: varchar("referenceNumber", { length: 64 }),
  subtotal: decimal("subtotal", { precision: 15, scale: 2 }).default("0.00"),
  taxAmount: decimal("taxAmount", { precision: 15, scale: 2 }).default("0.00"),
  total: decimal("total", { precision: 15, scale: 2 }).default("0.00"),
  memo: text("memo"),
  receiptUrl: text("receiptUrl"),
  isBillable: boolean("isBillable").default(false),
  billableCustomerId: int("billableCustomerId"),
  currency: varchar("currency", { length: 3 }).default("CAD"),
  exchangeRate: decimal("exchangeRate", { precision: 15, scale: 6 }).default("1.000000"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
export type Expense = typeof expenses.$inferSelect;
export type InsertExpense = typeof expenses.$inferInsert;;

// ─── Expense Line Items ──────────────────────────────────────────────
export const expenseLineItems = mysqlTable("expense_line_items", {
  id: int("id").autoincrement().primaryKey(),
  expenseId: int("expenseId").notNull(),
  accountId: int("accountId"),
  description: text("description"),
  amount: decimal("amount", { precision: 15, scale: 2 }).default("0.00"),
  taxCode: varchar("taxCode", { length: 32 }),
  taxAmount: decimal("taxAmount", { precision: 15, scale: 2 }).default("0.00"),
  isBillable: boolean("isBillable").default(false),
  billableCustomerId: int("billableCustomerId"),
  sortOrder: int("sortOrder").default(0),
});

export type ExpenseLineItem = typeof expenseLineItems.$inferSelect;
export type InsertExpenseLineItem = typeof expenseLineItems.$inferInsert;

// ─── Payments ────────────────────────────────────────────────────────
export const payments = mysqlTable("payments", {
  id: int("id").autoincrement().primaryKey(),
  customerId: int("customerId").notNull(),
  paymentDate: timestamp("paymentDate").notNull(),
  amount: decimal("amount", { precision: 15, scale: 2 }).notNull(),
  paymentMethod: varchar("paymentMethod", { length: 64 }),
  referenceNumber: varchar("referenceNumber", { length: 64 }),
  depositToAccountId: int("depositToAccountId"),
  memo: text("memo"),
  isDeposited: boolean("isDeposited").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Payment = typeof payments.$inferSelect;
export type InsertPayment = typeof payments.$inferInsert;

// ─── Payment Applications (links payments to invoices) ───────────────
export const paymentApplications = mysqlTable("payment_applications", {
  id: int("id").autoincrement().primaryKey(),
  paymentId: int("paymentId").notNull(),
  invoiceId: int("invoiceId").notNull(),
  amount: decimal("amount", { precision: 15, scale: 2 }).notNull(),
});

// ─── Bank Transactions ───────────────────────────────────────────────
export const bankTransactions = mysqlTable("bank_transactions", {
  id: int("id").autoincrement().primaryKey(),
  accountId: int("accountId").notNull(),
  transactionDate: timestamp("transactionDate").notNull(),
  description: varchar("description", { length: 500 }),
  amount: decimal("amount", { precision: 15, scale: 2 }).notNull(),
  fitId: varchar("fitId", { length: 128 }),
  status: mysqlEnum("status", ["For Review", "Categorized", "Excluded", "Matched"]).default("For Review").notNull(),
  matchedTransactionType: varchar("matchedTransactionType", { length: 64 }),
  matchedTransactionId: int("matchedTransactionId"),
  categoryAccountId: int("categoryAccountId"),
  memo: text("memo"),
  isReconciled: boolean("isReconciled").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
export type BankTransaction = typeof bankTransactions.$inferSelect;;
export type InsertBankTransaction = typeof bankTransactions.$inferInsert;

// ─── Journal Entries ─────────────────────────────────────────────────
export const journalEntries = mysqlTable("journal_entries", {
  id: int("id").autoincrement().primaryKey(),
  entryNumber: varchar("entryNumber", { length: 64 }),
  entryDate: timestamp("entryDate").notNull(),
  memo: text("memo"),
  isAdjusting: boolean("isAdjusting").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type JournalEntry = typeof journalEntries.$inferSelect;
export type InsertJournalEntry = typeof journalEntries.$inferInsert;

// ─── Journal Entry Lines ─────────────────────────────────────────────
export const journalEntryLines = mysqlTable("journal_entry_lines", {
  id: int("id").autoincrement().primaryKey(),
  journalEntryId: int("journalEntryId").notNull(),
  accountId: int("accountId").notNull(),
  debit: decimal("debit", { precision: 15, scale: 2 }).default("0.00"),
  credit: decimal("credit", { precision: 15, scale: 2 }).default("0.00"),
  description: text("description"),
  customerId: int("customerId"),
  supplierId: int("supplierId"),
  sortOrder: int("sortOrder").default(0),
});

export type JournalEntryLine = typeof journalEntryLines.$inferSelect;
export type InsertJournalEntryLine = typeof journalEntryLines.$inferInsert;

// ─── Sales Tax Rates ─────────────────────────────────────────────────
export const taxRates = mysqlTable("tax_rates", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 128 }).notNull(),
  code: varchar("code", { length: 32 }).notNull(),
  rate: decimal("rate", { precision: 6, scale: 4 }).notNull(),
  agency: varchar("agency", { length: 255 }),
  description: text("description"),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type TaxRate = typeof taxRates.$inferSelect;
export type InsertTaxRate = typeof taxRates.$inferInsert;

// ─── Sales Tax Filings ───────────────────────────────────────────────
export const taxFilings = mysqlTable("tax_filings", {
  id: int("id").autoincrement().primaryKey(),
  agency: varchar("agency", { length: 255 }).notNull(),
  periodStart: timestamp("periodStart").notNull(),
  periodEnd: timestamp("periodEnd").notNull(),
  collectedOnSales: decimal("collectedOnSales", { precision: 15, scale: 2 }).default("0.00"),
  paidOnPurchases: decimal("paidOnPurchases", { precision: 15, scale: 2 }).default("0.00"),
  adjustment: decimal("adjustment", { precision: 15, scale: 2 }).default("0.00"),
  netTax: decimal("netTax", { precision: 15, scale: 2 }).default("0.00"),
  status: mysqlEnum("status", ["Upcoming", "Due", "Filed", "Paid"]).default("Upcoming").notNull(),
  filedDate: timestamp("filedDate"),
  paidDate: timestamp("paidDate"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type TaxFiling = typeof taxFilings.$inferSelect;
export type InsertTaxFiling = typeof taxFilings.$inferInsert;

// ─── Estimates ───────────────────────────────────────────────────────
export const estimates = mysqlTable("estimates", {
  id: int("id").autoincrement().primaryKey(),
  estimateNumber: varchar("estimateNumber", { length: 64 }).notNull(),
  customerId: int("customerId").notNull(),
  estimateDate: timestamp("estimateDate").notNull(),
  expiryDate: timestamp("expiryDate"),
  subtotal: decimal("subtotal", { precision: 15, scale: 2 }).default("0.00"),
  taxAmount: decimal("taxAmount", { precision: 15, scale: 2 }).default("0.00"),
  total: decimal("total", { precision: 15, scale: 2 }).default("0.00"),
  status: mysqlEnum("status", ["Draft", "Sent", "Accepted", "Rejected", "Converted", "Closed"])
    .default("Draft")
    .notNull(),
  notes: text("notes"),
  convertedInvoiceId: int("convertedInvoiceId"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Estimate = typeof estimates.$inferSelect;
export type InsertEstimate = typeof estimates.$inferInsert;

// ─── Estimate Line Items ─────────────────────────────────────────────
export const estimateLineItems = mysqlTable("estimate_line_items", {
  id: int("id").autoincrement().primaryKey(),
  estimateId: int("estimateId").notNull(),
  productId: int("productId"),
  description: text("description"),
  quantity: decimal("quantity", { precision: 10, scale: 2 }).default("1.00"),
  rate: decimal("rate", { precision: 15, scale: 2 }).default("0.00"),
  amount: decimal("amount", { precision: 15, scale: 2 }).default("0.00"),
  taxCode: varchar("taxCode", { length: 32 }),
  taxAmount: decimal("taxAmount", { precision: 15, scale: 2 }).default("0.00"),
  sortOrder: int("sortOrder").default(0),
});

// ─── Bills ───────────────────────────────────────────────────────────
export const bills = mysqlTable("bills", {
  id: int("id").autoincrement().primaryKey(),
  billNumber: varchar("billNumber", { length: 64 }),
  supplierId: int("supplierId").notNull(),
  billDate: timestamp("billDate").notNull(),
  dueDate: timestamp("dueDate"),
  subtotal: decimal("subtotal", { precision: 15, scale: 2 }).default("0.00"),
  taxAmount: decimal("taxAmount", { precision: 15, scale: 2 }).default("0.00"),
  total: decimal("total", { precision: 15, scale: 2 }).default("0.00"),
  amountPaid: decimal("amountPaid", { precision: 15, scale: 2 }).default("0.00"),
  amountDue: decimal("amountDue", { precision: 15, scale: 2 }).default("0.00"),
  status: mysqlEnum("status", ["Draft", "Open", "Partial", "Paid", "Overdue", "Voided"]).default("Draft").notNull(),
  memo: text("memo"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Bill = typeof bills.$inferSelect;
export type InsertBill = typeof bills.$inferInsert;

// ─── Bill Line Items ─────────────────────────────────────────────────
export const billLineItems = mysqlTable("bill_line_items", {
  id: int("id").autoincrement().primaryKey(),
  billId: int("billId").notNull(),
  accountId: int("accountId"),
  description: text("description"),
  amount: decimal("amount", { precision: 15, scale: 2 }).default("0.00"),
  taxCode: varchar("taxCode", { length: 32 }),
  taxAmount: decimal("taxAmount", { precision: 15, scale: 2 }).default("0.00"),
  isBillable: boolean("isBillable").default(false),
  billableCustomerId: int("billableCustomerId"),
  sortOrder: int("sortOrder").default(0),
});

// ─── Recurring Transactions ──────────────────────────────────────────
export const recurringTransactions = mysqlTable("recurring_transactions", {
  id: int("id").autoincrement().primaryKey(),
  templateName: varchar("templateName", { length: 255 }).notNull(),
  transactionType: mysqlEnum("transactionType", ["Invoice", "Expense", "Bill", "Journal Entry"]).notNull(),
  frequency: mysqlEnum("frequency", ["Daily", "Weekly", "Monthly", "Yearly"]).notNull(),
  intervalCount: int("intervalCount").default(1),
  startDate: timestamp("startDate").notNull(),
  endDate: timestamp("endDate"),
  nextDate: timestamp("nextDate"),
  templateData: json("templateData"),
  isActive: boolean("isActive").default(true).notNull(),
  lastGenerated: timestamp("lastGenerated"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
export type RecurringTransaction = typeof recurringTransactions.$inferSelect;;
export type InsertRecurringTransaction = typeof recurringTransactions.$inferInsert;

// ─── Reconciliations ─────────────────────────────────────────────────
export const reconciliations = mysqlTable("reconciliations", {
  id: int("id").autoincrement().primaryKey(),
  accountId: int("accountId").notNull(),
  statementDate: timestamp("statementDate").notNull(),
  statementBalance: decimal("statementBalance", { precision: 15, scale: 2 }).notNull(),
  clearedBalance: decimal("clearedBalance", { precision: 15, scale: 2 }),
  difference: decimal("difference", { precision: 15, scale: 2 }),
  status: mysqlEnum("status", ["In Progress", "Completed"]).default("In Progress").notNull(),
  completedAt: timestamp("completedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Reconciliation = typeof reconciliations.$inferSelect;
export type InsertReconciliation = typeof reconciliations.$inferInsert;

// ─── Audit Log ───────────────────────────────────────────────────────
export const auditLog = mysqlTable("audit_log", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId"),
  action: varchar("action", { length: 64 }).notNull(),
  entityType: varchar("entityType", { length: 64 }).notNull(),
  entityId: int("entityId"),
  details: json("details"),
  ipAddress: varchar("ipAddress", { length: 45 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type AuditLogEntry = typeof auditLog.$inferSelect;
export type InsertAuditLogEntry = typeof auditLog.$inferInsert;

// ─── Attachments ────────────────────────────────────────────────────
export const attachments = mysqlTable("attachments", {
  id: int("id").autoincrement().primaryKey(),
  entityType: varchar("entityType", { length: 64 }).notNull(), // invoice, expense, bill, customer, supplier
  entityId: int("entityId").notNull(),
  fileName: varchar("fileName", { length: 500 }).notNull(),
  fileUrl: text("fileUrl").notNull(),
  fileKey: varchar("fileKey", { length: 500 }).notNull(),
  mimeType: varchar("mimeType", { length: 128 }),
  fileSize: int("fileSize"), // bytes
  uploadedBy: int("uploadedBy"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Attachment = typeof attachments.$inferSelect;
export type InsertAttachment = typeof attachments.$inferInsert;

// ─── Account Transfers ──────────────────────────────────────────────
export const accountTransfers = mysqlTable("account_transfers", {
  id: int("id").autoincrement().primaryKey(),
  fromAccountId: int("fromAccountId").notNull(),
  toAccountId: int("toAccountId").notNull(),
  amount: decimal("amount", { precision: 15, scale: 2 }).notNull(),
  transferDate: timestamp("transferDate").notNull(),
  memo: text("memo"),
  journalEntryId: int("journalEntryId"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type AccountTransfer = typeof accountTransfers.$inferSelect;
export type InsertAccountTransfer = typeof accountTransfers.$inferInsert;

// ─── Bank Rules (Sprint 46) ─────────────────────────────────────────
export const bankRules = mysqlTable("bank_rules", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  priority: int("priority").default(0),
  conditions: json("conditions"), // { field, operator, value }[]
  assignAccountId: int("assignAccountId"),
  assignCategory: varchar("assignCategory", { length: 128 }),
  assignPayee: varchar("assignPayee", { length: 255 }),
  autoConfirm: boolean("autoConfirm").default(false),
  isActive: boolean("isActive").default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type BankRule = typeof bankRules.$inferSelect;
export type InsertBankRule = typeof bankRules.$inferInsert;

// ─── Exchange Rates (Sprint 44) ─────────────────────────────────────
export const exchangeRates = mysqlTable("exchange_rates", {
  id: int("id").autoincrement().primaryKey(),
  fromCurrency: varchar("fromCurrency", { length: 3 }).notNull(),
  toCurrency: varchar("toCurrency", { length: 3 }).notNull(),
  rate: decimal("rate", { precision: 15, scale: 6 }).notNull(),
  effectiveDate: timestamp("effectiveDate").notNull(),
  source: varchar("source", { length: 64 }).default("manual"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ExchangeRate = typeof exchangeRates.$inferSelect;
export type InsertExchangeRate = typeof exchangeRates.$inferInsert;


// ─── Email Templates (Enhancement I) ──────────────────────────────────
export const emailTemplates = mysqlTable("email_templates", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 128 }).notNull(),
  type: mysqlEnum("type", ["invoice", "estimate", "payment_receipt", "payment_reminder"]).notNull(),
  subject: varchar("subject", { length: 255 }).notNull(),
  body: text("body").notNull(),
  isDefault: boolean("isDefault").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type EmailTemplate = typeof emailTemplates.$inferSelect;
export type InsertEmailTemplate = typeof emailTemplates.$inferInsert;

// ─── Recurring Invoice Generation Log (Enhancement J) ─────────────────
export const recurringGenerationLog = mysqlTable("recurring_generation_log", {
  id: int("id").autoincrement().primaryKey(),
  recurringTransactionId: int("recurringTransactionId").notNull(),
  generatedEntityType: varchar("generatedEntityType", { length: 64 }).notNull(),
  generatedEntityId: int("generatedEntityId"),
  status: mysqlEnum("status", ["success", "failed", "skipped"]).default("success").notNull(),
  errorMessage: text("errorMessage"),
  autoSent: boolean("autoSent").default(false),
  generatedAt: timestamp("generatedAt").defaultNow().notNull(),
});
export type RecurringGenerationLog = typeof recurringGenerationLog.$inferSelect;
export type InsertRecurringGenerationLog = typeof recurringGenerationLog.$inferInsert;
