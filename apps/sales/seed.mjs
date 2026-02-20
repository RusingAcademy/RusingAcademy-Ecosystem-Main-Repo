import { drizzle } from "drizzle-orm/mysql2";
import { sql } from "drizzle-orm";
import dotenv from "dotenv";
dotenv.config();

const db = drizzle(process.env.DATABASE_URL);

async function seed() {
  console.log("🌱 Seeding database...");

  // ─── Company Settings ───
  await db.execute(sql`INSERT INTO company_settings (companyName, legalName, currency, country, fiscalYearStart)
    VALUES ('RusingAcademy', 'Rusinga International Consulting Ltd.', 'CAD', 'Canada', '01-01')
    ON DUPLICATE KEY UPDATE companyName = VALUES(companyName)`);
  console.log("✅ Company settings seeded");

  // ─── Chart of Accounts ───
  const accountsData = [
    ["RusingAcademy", "Bank", "Cash on hand", "5630.69", "1550.00"],
    ["Accounts Receivable (A/R)", "Accounts receivable (A/R)", "Accounts Receivable (A/R)", "452.00", null],
    ["Inventory Asset", "Current assets", "Inventory", "0.00", null],
    ["Prepaid expenses", "Current assets", "Prepaid Expenses", "0.00", null],
    ["Stripe Clearing Refunds - Acodei", "Current assets", "Other current assets", "0.00", null],
    ["Uncategorized Asset", "Current assets", "Other current assets", "0.00", null],
    ["Undeposited Funds", "Current assets", "Undeposited Funds", "15763.50", null],
    ["Accounts Payable (A/P)", "Accounts payable (A/P)", "Accounts Payable (A/P)", "0.00", null],
    ["GST/HST Payable", "Other Current Liabilities", "GST/HST Payable", "23658.70", null],
    ["GST/HST Suspense", "Other Current Liabilities", "GST/HST Suspense", "0.00", null],
    ["Opening Balance Equity", "Equity", "Opening Balance Equity", "-190875.62", null],
    ["Retained Earnings", "Equity", "Retained Earnings", "0.00", null],
    ["Billable Expense Income", "Income", "Sales of Product Income", "0.00", null],
    ["Billable Expense Income (52)", "Income", "Sales of Product Income", "0.00", null],
    ["Billable Expense Income-1", "Income", "Sales of Product Income", "0.00", null],
    ["Discounts", "Income", "Discounts/Refunds Given", "0.00", null],
    ["Discounts given", "Income", "Discounts/Refunds Given", "0.00", null],
    ["Refunds-Allowances", "Income", "Discounts/Refunds Given", "0.00", null],
    ["Sales", "Income", "Sales of Product Income", "0.00", null],
    ["Sales of Product Income", "Income", "Sales of Product Income", "0.00", null],
    ["Shipping and Delivery Income", "Income", "Other Primary Income", "0.00", null],
    ["Unapplied Cash Payment Income", "Income", "Unapplied Cash Payment Income", "0.00", null],
    ["Uncategorized Income", "Income", "Sales of Product Income", "0.00", null],
    ["Cost of Goods Sold", "Cost of Goods Sold", "Supplies and materials - COS", "0.00", null],
    ["Cost of Labour - COS", "Cost of Goods Sold", "Cost of Labour - COS", "0.00", null],
    ["Freight and delivery - COS", "Cost of Goods Sold", "Shipping, Freight and Delivery - COS", "0.00", null],
    ["Other Costs - COS", "Cost of Goods Sold", "Other costs of service - COS", "0.00", null],
    ["Purchases - COS", "Cost of Goods Sold", "Other costs of service - COS", "0.00", null],
    ["Subcontractors - COS", "Cost of Goods Sold", "Cost of Labour - COS", "0.00", null],
    ["Supplies and materials - COS", "Cost of Goods Sold", "Supplies and materials - COS", "0.00", null],
    ["Advertising", "Expenses", "Advertising/Promotional", "0.00", null],
    ["Bad debts", "Expenses", "Bad debts", "0.00", null],
    ["Bank charges", "Expenses", "Bank charges", "0.00", null],
    ["Commissions and fees", "Expenses", "Other Miscellaneous Service Cost", "0.00", null],
    ["Disposal Fees", "Expenses", "Other Miscellaneous Service Cost", "0.00", null],
    ["Dues and Subscriptions", "Expenses", "Office/General Administrative Expenses", "0.00", null],
    ["Freight and Delivery", "Expenses", "Shipping, Freight, and Delivery", "0.00", null],
    ["Insurance", "Expenses", "Insurance", "0.00", null],
    ["Insurance - Disability", "Expenses", "Insurance", "0.00", null],
    ["Insurance - Liability", "Expenses", "Insurance", "0.00", null],
    ["Interest expense", "Expenses", "Interest paid", "0.00", null],
    ["Job Materials", "Expenses", "Supplies", "0.00", null],
    ["Legal and professional fees", "Expenses", "Legal and professional fees", "0.00", null],
    ["Meals and entertainment", "Expenses", "Meals and entertainment", "0.00", null],
    ["Office expenses", "Expenses", "Office/General Administrative Expenses", "0.00", null],
    ["Other general and administrative expenses", "Expenses", "Office/General Administrative Expenses", "0.00", null],
    ["Promotional", "Expenses", "Advertising/Promotional", "0.00", null],
    ["QuickBooks Payments Fees", "Expenses", "Other selling expenses", "0.00", null],
    ["Rent or lease payments", "Expenses", "Rent or Lease of Buildings", "0.00", null],
    ["Repair and maintenance", "Expenses", "Office/General Administrative Expenses", "0.00", null],
    ["Shipping and delivery expense", "Expenses", "Shipping, Freight, and Delivery", "0.00", null],
    ["Stationery and printing", "Expenses", "Office/General Administrative Expenses", "0.00", null],
    ["Stripe Fee", "Expenses", "Bank charges", "0.00", null],
    ["Subcontractors", "Expenses", "Cost of Labour", "0.00", null],
    ["Supplies", "Expenses", "Supplies", "0.00", null],
    ["Taxes and Licenses", "Expenses", "Taxes Paid", "0.00", null],
    ["Tools", "Expenses", "Supplies", "0.00", null],
    ["Travel", "Expenses", "Travel", "0.00", null],
    ["Travel meals", "Expenses", "Travel meals", "0.00", null],
    ["Uncategorized Expense", "Expenses", "Other Miscellaneous Service Cost", "0.00", null],
    ["Utilities", "Expenses", "Utilities", "0.00", null],
    ["Interest earned", "Other Income", "Interest earned", "0.00", null],
    ["Other Ordinary Income", "Other Income", "Income", "0.00", null],
    ["Other Portfolio Income", "Other Income", "Income", "0.00", null],
    ["Miscellaneous", "Other Expense", "Other Miscellaneous Expense", "0.00", null],
    ["Penalties and settlements", "Other Expense", "Penalties and settlements", "0.00", null],
    ["Reconciliation Discrepancies", "Other Expense", "Other Miscellaneous Expense", "0.00", null],
  ];

  for (const [name, accountType, detailType, balance, bankBalance] of accountsData) {
    await db.execute(sql`INSERT INTO accounts (name, accountType, detailType, balance, bankBalance)
      VALUES (${name}, ${accountType}, ${detailType}, ${balance}, ${bankBalance})
      ON DUPLICATE KEY UPDATE accountType = VALUES(accountType)`);
  }
  console.log(`✅ ${accountsData.length} accounts seeded`);

  // ─── Customers ───
  const customersData = [
    ["Aaron Snow", "", "", "0.00"],
    ["Anna Ballard", "Directorate Access to Information and Privacy / National Defence", "613-901-6745", "0.00"],
    ["CANADIAN DIGITAL SERVICE", "", "", "0.00"],
    ["Cheryl MCCONNEY-WILSON", "CANADIAN DIGITAL SERVICE", "", "0.00"],
    ["Mithula Naik", "Canadian Digital Service", "613-290-3889", "0.00"],
    ["Priyanka rahman", "CANADIAN DIGITAL SERVICE", "", "0.00"],
    ["Canadian Human Rights Commission", "", "", "0.00"],
    ["Christine Hagyard", "", "", "0.00"],
    ["COMMISSION CANADIENNE DES DROITS DE LA PERSONNE", "", "", "0.00"],
    ["Ebony Sager", "", "", "0.00"],
    ["Edith Bramwell", "Federal Public Sector Labour Relations and Employment Board", "343-573-1764", "0.00"],
    ["Employment and Social Development Canada (ESDC)", "", "", "0.00"],
    ["Ashley Evans", "Employment and Social Development Canada (ESDC)", "819-247-2847", "0.00"],
    ["Employment and Social Development Canada", "Employment and Social Development Canada", "613-614-7620", "0.00"],
    ["Honey Dacanay", "Employment and Social Development Canada (ESDC)", "", "0.00"],
    ["Spencer Daniels", "Employment and Social Development Canada", "", "0.00"],
    ["Stephanie Figas", "Employment and Social Development Canada", "", "0.00"],
    ["Flora Mak", "", "", "0.00"],
    ["Gabriella Calzadilla", "", "", "0.00"],
    ["Hassan Sheikh", "Immigration and Refugee Board of Canada / Government of Canada", "416-985-6909", "0.00"],
    ["Jason Toner", "", "", "0.00"],
    ["Jessica Chi-Yan Tam", "Immigration and Refugee Board of Canada", "", "0.00"],
    ["John Millons", "", "", "0.00"],
    ["Joshua Bernstein-Mason", "", "", "0.00"],
    ["Julie Bedard", "", "", "0.00"],
    ["Keri Wallden", "", "", "0.00"],
    ["Margaret Gilbert", "", "613-292-2920", "0.00"],
    ["Margit Bertalan", "Wildlife Conservation Society", "", "0.00"],
    ["Michel Sturgeon", "Commission de l'immigration et du statut de réfugié du Canada", "", "0.00"],
    ["Mickael Wronski", "", "", "0.00"],
    ["Offices of the Chair of the FPSLREB", "FPSLREB", "613-854-5318", "0.00"],
    ["Peter GIBAUT", "", "", "0.00"],
    ["Programme d'Éthique de la Défense SMA (SE)", "", "", "0.00"],
    ["Rebeca Marchon Capanema", "", "226-503-7001", "0.00"],
    ["Shari Affleck", "Canadian Coast Guard Auxiliary (National) Inc.", "6136147620", "0.00"],
    ["Somerset West Community Health Centre (SWCHC)", "Somerset West Community Health Centre (SWCHC)", "613-600-6533", "0.00"],
    ["Steve", "RusingAcademy", "613-614-7620", "0.00"],
    ["Sukhdeep Singh", "", "437-299-2880", "452.00"],
    ["Xiaopu Fung", "", "", "0.00"],
    ["Yasminder Dhillon", "", "613-859-4215", "0.00"],
  ];

  for (const [name, company, phone, balance] of customersData) {
    await db.execute(sql`INSERT INTO customers (displayName, company, phone, balance)
      VALUES (${name}, ${company}, ${phone}, ${balance})
      ON DUPLICATE KEY UPDATE company = VALUES(company)`);
  }
  console.log(`✅ ${customersData.length} customers seeded`);

  // ─── Suppliers ───
  await db.execute(sql`INSERT INTO suppliers (displayName, company, phone, email, balance)
    VALUES ('QuickBooks Payments', '', '', '', 0)
    ON DUPLICATE KEY UPDATE displayName = VALUES(displayName)`);
  console.log("✅ Suppliers seeded");

  // ─── Products & Services ───
  const productsData = [
    ["French Training", "ONLINE LESSONS VIA GOOGLE-MEET & GOOGLE CLASSROOM", "French courses", "Service", "60.00"],
    ["Hours", "", "", "Service", "0.00"],
    ["Livre-essai", "Ok", "", "Service", "10.00"],
    ["MC Honorarium – Men of Men Forum", "", "", "Service", "300.00"],
    ["Multimedia & Sound System – Men of Men", "", "", "Service", "240.00"],
    ["Multimedia & Sound System – Men of Men Forum", "", "", "Service", "240.00"],
    ["Préparation orale B", "ONLINE LESSONS VIA GOOGLE-MEET & GOOGLE CLASSROOM.", "French courses", "Service", "30.00"],
    ["Sales", "", "", "Service", "0.00"],
    ["Stripe Fee - Acodei", "", "", "Non-Inventory", "0.00"],
    ["Stripe Refund - Acodei", "", "", "Non-Inventory", "0.00"],
    ["Stripe Sales - Acodei", "", "", "Non-Inventory", "0.00"],
  ];

  for (const [name, description, category, type, price] of productsData) {
    await db.execute(sql`INSERT INTO products (name, description, category, type, price)
      VALUES (${name}, ${description}, ${category}, ${type}, ${price})
      ON DUPLICATE KEY UPDATE description = VALUES(description)`);
  }
  console.log(`✅ ${productsData.length} products seeded`);

  // ─── Invoices ───
  const invoicesData = [
    ["0008-12-124", "2025-02-21", "Sukhdeep Singh", "452.00", "Overdue", true],
    ["0008-12-125", "2025-02-21", "Yasminder Dhillon", "452.00", "Deposited", false],
    ["0008-12-126", "2025-02-26", "Joshua Bernstein-Mason", "542.40", "Deposited", false],
    ["0008-12-127", "2025-05-20", "Mickael Wronski", "2712.00", "Deposited", false],
    ["0008-12-128", "2025-05-30", "Michel Sturgeon", "1017.00", "Deposited", false],
    ["0008-12-130", "2025-06-09", "Hassan Sheikh", "1017.00", "Deposited", false],
    ["0008-12-131", "2025-06-12", "Rebeca Marchon Capanema", "1017.00", "Deposited", false],
    ["0008-12-129", "2025-07-08", "Joshua Bernstein-Mason", "949.20", "Deposited", false],
    ["0008-12-132", "2025-07-10", "Jessica Chi-Yan Tam", "1017.00", "Deposited", false],
    ["0008-12-133", "2025-11-05", "Mickael Wronski", "1627.20", "Deposited", false],
    ["0008-12-134", "2026-01-05", "Somerset West Community Health Centre (SWCHC)", "610.20", "Deposited", false],
  ];

  for (const [invNo, dateStr, customerName, total, status, isSent] of invoicesData) {
    // Look up customer ID
    const rows = await db.execute(sql`SELECT id FROM customers WHERE displayName = ${customerName} LIMIT 1`);
    const customerId = rows?.[0]?.[0]?.id || 1;

    const amountPaid = (status === "Deposited" || status === "Paid") ? total : "0.00";
    const amountDue = status === "Overdue" ? total : "0.00";

    await db.execute(sql`INSERT INTO invoices (invoiceNumber, customerId, invoiceDate, total, subtotal, amountPaid, amountDue, status, isSent)
      VALUES (${invNo}, ${customerId}, ${dateStr}, ${total}, ${total}, ${amountPaid}, ${amountDue}, ${status}, ${isSent ? 1 : 0})
      ON DUPLICATE KEY UPDATE status = VALUES(status)`);
  }
  console.log(`✅ ${invoicesData.length} invoices seeded`);

  // ─── Expenses ───
  const expensesData = [
    ["2026-01-15", "Expense", "QuickBooks Payments", "17.95", "0", "17.95"],
    ["2025-12-21", "Expense", "QuickBooks Payments", "47.44", "0", "47.44"],
    ["2025-07-10", "Expense", "QuickBooks Payments", "57.52", "0", "57.52"],
    ["2025-06-26", "Cheque Expense", "", "135.55", "0", "135.55"],
    ["2025-06-26", "Cheque Expense", "", "7195.57", "0", "7195.57"],
    ["2025-06-26", "Cheque Expense", "", "1171.82", "0", "1171.82"],
    ["2025-06-26", "Cheque Expense", "", "1171.82", "0", "1171.82"],
    ["2025-06-26", "Cheque Expense", "", "1171.82", "0", "1171.82"],
    ["2025-06-26", "Cheque Expense", "", "5268.00", "0", "5268.00"],
    ["2025-06-26", "Cheque Expense", "", "193345.51", "0", "193345.51"],
    ["2025-06-23", "Expense", "QuickBooks Payments", "78.90", "0", "78.90"],
    ["2025-06-20", "Expense", "QuickBooks Payments", "14.75", "0", "14.75"],
    ["2025-06-12", "Expense", "QuickBooks Payments", "44.98", "0", "44.98"],
    ["2025-06-02", "Expense", "QuickBooks Payments", "29.74", "0", "29.74"],
    ["2025-02-26", "Expense", "QuickBooks Payments", "15.98", "0", "15.98"],
    ["2025-02-24", "Expense", "QuickBooks Payments", "13.36", "0", "13.36"],
  ];

  for (const [dateStr, type, payee, subtotal, tax, total] of expensesData) {
    await db.execute(sql`INSERT INTO expenses (expenseType, payeeName, expenseDate, subtotal, taxAmount, total)
      VALUES (${type}, ${payee}, ${dateStr}, ${subtotal}, ${tax}, ${total})`);
  }
  console.log(`✅ ${expensesData.length} expenses seeded`);

  // ─── Tax Rates ───
  await db.execute(sql`INSERT INTO tax_rates (name, code, rate, agency, description)
    VALUES ('HST', 'HST', '0.1300', 'Canada Revenue Agency', 'Harmonized Sales Tax - Ontario 13%')
    ON DUPLICATE KEY UPDATE rate = VALUES(rate)`);
  await db.execute(sql`INSERT INTO tax_rates (name, code, rate, agency, description)
    VALUES ('GST', 'GST', '0.0500', 'Canada Revenue Agency', 'Goods and Services Tax 5%')
    ON DUPLICATE KEY UPDATE rate = VALUES(rate)`);
  console.log("✅ Tax rates seeded");

  // ─── Tax Filing ───
  await db.execute(sql`INSERT INTO tax_filings (agency, periodStart, periodEnd, collectedOnSales, paidOnPurchases, adjustment, netTax, status)
    VALUES ('Canada Revenue Agency', '2026-01-01', '2026-12-31', '70.20', '0.00', '0.00', '70.20', 'Upcoming')
    ON DUPLICATE KEY UPDATE collectedOnSales = VALUES(collectedOnSales)`);
  console.log("✅ Tax filings seeded");

  // ─── Bank Transactions ───
  const bankTxData = [
    ["2026-01-15", "QuickBooks Payments Fee", "-17.95", "Categorized"],
    ["2026-01-05", "Payment from SWCHC", "610.20", "Categorized"],
    ["2025-12-21", "QuickBooks Payments Fee", "-47.44", "Categorized"],
    ["2025-11-05", "Payment from Mickael Wronski", "1627.20", "Categorized"],
    ["2025-07-10", "Payment from Jessica Chi-Yan Tam", "1017.00", "Categorized"],
    ["2025-07-08", "Payment from Joshua Bernstein-Mason", "949.20", "For Review"],
    ["2025-06-23", "QuickBooks Payments Fee", "-78.90", "Categorized"],
    ["2025-06-20", "QuickBooks Payments Fee", "-14.75", "Categorized"],
    ["2025-06-12", "Payment from Rebeca Marchon Capanema", "1017.00", "Categorized"],
    ["2025-06-09", "Payment from Hassan Sheikh", "1017.00", "Categorized"],
    ["2025-05-30", "Payment from Michel Sturgeon", "1017.00", "Categorized"],
    ["2025-05-20", "Payment from Mickael Wronski", "2712.00", "For Review"],
    ["2025-02-26", "Payment from Joshua Bernstein-Mason", "542.40", "Categorized"],
    ["2025-02-21", "Payment from Yasminder Dhillon", "452.00", "Categorized"],
  ];

  // Get the bank account ID
  const bankRows = await db.execute(sql`SELECT id FROM accounts WHERE name = 'RusingAcademy' AND accountType = 'Bank' LIMIT 1`);
  const bankAccountId = bankRows?.[0]?.[0]?.id || 1;

  for (const [dateStr, desc, amount, status] of bankTxData) {
    await db.execute(sql`INSERT INTO bank_transactions (accountId, transactionDate, description, amount, status)
      VALUES (${bankAccountId}, ${dateStr}, ${desc}, ${amount}, ${status})`);
  }
  console.log(`✅ ${bankTxData.length} bank transactions seeded`);

  console.log("\n🎉 Database seeding complete!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
