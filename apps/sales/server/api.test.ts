import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

function createAuthContext(): TrpcContext {
  return {
    user: {
      id: 1,
      openId: "test-user",
      email: "test@example.com",
      name: "Test User",
      loginMethod: "manus",
      role: "admin",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

describe("Dashboard API", () => {
  it("returns dashboard data with expected shape", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const data = await caller.dashboard.getData();
    expect(data).toBeTruthy();
    expect(data).toHaveProperty("companyName");
    expect(data).toHaveProperty("profitAndLoss");
    expect(data).toHaveProperty("invoiceSummary");
    expect(data).toHaveProperty("expenseSummary");
    expect(data).toHaveProperty("bankAccount");
    expect(data).toHaveProperty("customerCount");
    expect(data!.companyName).toBe("RusingAcademy");
  });
});

describe("Accounts API", () => {
  it("lists all accounts", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const accounts = await caller.accounts.list();
    expect(Array.isArray(accounts)).toBe(true);
    expect(accounts.length).toBeGreaterThan(0);
  });

  it("filters accounts by type", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const bankAccounts = await caller.accounts.list({ type: "Bank" });
    expect(bankAccounts.every(a => a.accountType === "Bank")).toBe(true);
  });

  it("gets account by ID", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const accounts = await caller.accounts.list();
    if (accounts.length > 0) {
      const account = await caller.accounts.getById({ id: accounts[0].id });
      expect(account).toBeTruthy();
      expect(account!.id).toBe(accounts[0].id);
    }
  });
});

describe("Customers API", () => {
  it("lists all customers", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const customers = await caller.customers.list();
    expect(Array.isArray(customers)).toBe(true);
    expect(customers.length).toBeGreaterThan(0);
  });

  it("searches customers by name", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const results = await caller.customers.list({ search: "Sukhdeep" });
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].displayName).toContain("Sukhdeep");
  });

  it("gets customer by ID", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const customers = await caller.customers.list();
    if (customers.length > 0) {
      const customer = await caller.customers.getById({ id: customers[0].id });
      expect(customer).toBeTruthy();
      expect(customer!.id).toBe(customers[0].id);
    }
  });
});

describe("Products API", () => {
  it("lists all products", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const products = await caller.products.list();
    expect(Array.isArray(products)).toBe(true);
    expect(products.length).toBeGreaterThan(0);
  });
});

describe("Invoices API", () => {
  it("lists all invoices with customer names", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const invoices = await caller.invoices.list();
    expect(Array.isArray(invoices)).toBe(true);
    expect(invoices.length).toBeGreaterThan(0);
    // Each invoice should have a customerName from the join
    expect(invoices[0]).toHaveProperty("customerName");
  });
});

describe("Expenses API", () => {
  it("lists all expenses", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const expenses = await caller.expenses.list();
    expect(Array.isArray(expenses)).toBe(true);
    expect(expenses.length).toBeGreaterThan(0);
  });
});

describe("Suppliers API", () => {
  it("lists all suppliers", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const suppliers = await caller.suppliers.list();
    expect(Array.isArray(suppliers)).toBe(true);
    expect(suppliers.length).toBeGreaterThan(0);
  });
});

describe("Bank Transactions API", () => {
  it("lists all bank transactions", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const txs = await caller.bankTransactions.list();
    expect(Array.isArray(txs)).toBe(true);
    expect(txs.length).toBeGreaterThan(0);
  });

  it("filters by status", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const forReview = await caller.bankTransactions.list({ status: "For Review" });
    expect(forReview.every(t => t.status === "For Review")).toBe(true);
  });
});

describe("Tax API", () => {
  it("lists tax rates", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const rates = await caller.taxRates.list();
    expect(Array.isArray(rates)).toBe(true);
    expect(rates.length).toBeGreaterThan(0);
  });

  it("lists tax filings", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const filings = await caller.taxFilings.list();
    expect(Array.isArray(filings)).toBe(true);
    expect(filings.length).toBeGreaterThan(0);
  });
});

describe("Global Search API", () => {
  it("searches across all entities", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const results = await caller.search.query({ query: "RusingAcademy" });
    expect(results).toHaveProperty("customers");
    expect(results).toHaveProperty("invoices");
    expect(results).toHaveProperty("accounts");
    expect(results).toHaveProperty("products");
    expect(results).toHaveProperty("suppliers");
  });
});

describe("Company Settings API", () => {
  it("returns company settings", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const settings = await caller.company.get();
    expect(settings).toBeTruthy();
    expect(settings!.companyName).toBe("RusingAcademy");
  });
});

describe("Notification Alerts API", () => {
  it("returns notification alerts structure", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const alerts = await caller.notifications.getAlerts();
    expect(alerts).toBeTruthy();
    expect(alerts).toHaveProperty("overdue");
    expect(alerts).toHaveProperty("upcoming");
    expect(alerts).toHaveProperty("lowBalance");
    expect(alerts).toHaveProperty("overdueCount");
    expect(alerts).toHaveProperty("upcomingCount");
    expect(alerts).toHaveProperty("totalAlerts");
    expect(Array.isArray(alerts.overdue)).toBe(true);
    expect(Array.isArray(alerts.upcoming)).toBe(true);
    expect(Array.isArray(alerts.lowBalance)).toBe(true);
  });

  it("overdue alerts have correct shape", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const alerts = await caller.notifications.getAlerts();
    for (const alert of alerts.overdue) {
      expect(alert).toHaveProperty("id");
      expect(alert).toHaveProperty("type", "overdue_invoice");
      expect(alert).toHaveProperty("title");
      expect(alert).toHaveProperty("description");
      expect(alert).toHaveProperty("date");
      expect(alert).toHaveProperty("severity", "high");
      expect(alert).toHaveProperty("link");
      expect(alert.link).toMatch(/^\/invoices\//);
    }
  });

  it("upcoming alerts have correct shape", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const alerts = await caller.notifications.getAlerts();
    for (const alert of alerts.upcoming) {
      expect(alert).toHaveProperty("id");
      expect(alert).toHaveProperty("type", "upcoming_recurring");
      expect(alert).toHaveProperty("title");
      expect(alert).toHaveProperty("description");
      expect(alert).toHaveProperty("severity", "medium");
      expect(alert).toHaveProperty("link", "/recurring");
    }
  });

  it("low balance alerts have correct shape", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const alerts = await caller.notifications.getAlerts();
    for (const alert of alerts.lowBalance) {
      expect(alert).toHaveProperty("id");
      expect(alert).toHaveProperty("type", "low_balance");
      expect(alert).toHaveProperty("title");
      expect(alert).toHaveProperty("description");
      expect(alert).toHaveProperty("severity", "warning");
      expect(alert).toHaveProperty("link", "/chart-of-accounts");
    }
  });

  it("totalAlerts equals sum of all alert types", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const alerts = await caller.notifications.getAlerts();
    expect(alerts.totalAlerts).toBe(
      alerts.overdue.length + alerts.upcoming.length + alerts.lowBalance.length
    );
    expect(alerts.overdueCount).toBe(alerts.overdue.length);
    expect(alerts.upcomingCount).toBe(alerts.upcoming.length);
  });

  it("dismiss mutation returns success", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const result = await caller.notifications.dismiss({ alertId: "test-alert-1" });
    expect(result).toEqual({ success: true, alertId: "test-alert-1" });
  });
});

// ─── Enhancement G: Advanced Reporting Charts ────────────────────────────────
describe("Monthly P&L Charts API", () => {
  it("returns monthly P&L data for a given year", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const result = await caller.charts.monthlyPnl({ year: 2026 });
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(12);
    for (const month of result) {
      expect(month).toHaveProperty("monthName");
      expect(month).toHaveProperty("income");
      expect(month).toHaveProperty("expenses");
      expect(month).toHaveProperty("netProfit");
      expect(typeof month.income).toBe("number");
      expect(typeof month.expenses).toBe("number");
    }
  });

  it("month names are correct order", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const result = await caller.charts.monthlyPnl({ year: 2026 });
    expect(result[0].monthName).toBe("Jan");
    expect(result[11].monthName).toBe("Dec");
  });

  it("net profit equals income minus expenses", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const result = await caller.charts.monthlyPnl({ year: 2026 });
    for (const month of result) {
      expect(Math.abs(month.netProfit - (month.income - month.expenses))).toBeLessThan(0.01);
    }
  });
});

describe("Monthly Balance Sheet Charts API", () => {
  it("returns monthly balance sheet data for a given year", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const result = await caller.charts.monthlyBalanceSheet({ year: 2026 });
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(12);
    for (const month of result) {
      expect(month).toHaveProperty("monthName");
      expect(month).toHaveProperty("assets");
      expect(month).toHaveProperty("liabilities");
      expect(month).toHaveProperty("equity");
    }
  });

  it("month names are correct order", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const result = await caller.charts.monthlyBalanceSheet({ year: 2026 });
    expect(result[0].monthName).toBe("Jan");
    expect(result[11].monthName).toBe("Dec");
  });
});

// ─── Enhancement H: Bulk Operations ────────────────────────────────
describe("Bulk Operations API", () => {
  it("bulk update invoice status requires auth", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    await expect(
      caller.bulk.updateInvoiceStatus({ ids: [1], status: "Sent" })
    ).rejects.toThrow();
  });

  it("bulk delete invoices requires auth", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    await expect(
      caller.bulk.deleteInvoices({ ids: [1] })
    ).rejects.toThrow();
  });

  it("bulk delete expenses requires auth", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    await expect(
      caller.bulk.deleteExpenses({ ids: [1] })
    ).rejects.toThrow();
  });

  it("bulk update invoice status with auth succeeds", async () => {
    const caller = appRouter.createCaller(createAuthContext());
    const result = await caller.bulk.updateInvoiceStatus({ ids: [1, 2], status: "Sent" });
    expect(result).toHaveProperty("count");
    expect(typeof result.count).toBe("number");
  });

  it("rejects empty ids array", async () => {
    const caller = appRouter.createCaller(createAuthContext());
    await expect(
      caller.bulk.updateInvoiceStatus({ ids: [], status: "Sent" })
    ).rejects.toThrow();
  });
});

// ─── Enhancement I: Email Templates ────────────────────────────────
describe("Email Templates API", () => {
  it("lists email templates (public)", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const result = await caller.emailTemplates.list();
    expect(Array.isArray(result)).toBe(true);
  });

  it("create requires auth", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    await expect(
      caller.emailTemplates.create({
        name: "Test Template",
        type: "invoice",
        subject: "Test Subject",
        body: "Test Body",
      })
    ).rejects.toThrow();
  });

  it("create and list email template with auth", async () => {
    const caller = appRouter.createCaller(createAuthContext());
    const created = await caller.emailTemplates.create({
      name: "Test Invoice Template",
      type: "invoice",
      subject: "Invoice #{{invoice_number}} from {{company_name}}",
      body: "Dear {{customer_name}}, please find your invoice attached.",
      isDefault: false,
    });
    expect(created).toHaveProperty("id");
    expect(created.name).toBe("Test Invoice Template");
    expect(created.type).toBe("invoice");

    // List should include the new template
    const list = await caller.emailTemplates.list();
    const found = (list as any[]).find((t: any) => t.id === created.id);
    expect(found).toBeDefined();
    expect(found.subject).toContain("{{invoice_number}}");
  });

  it("update email template", async () => {
    const caller = appRouter.createCaller(createAuthContext());
    const created = await caller.emailTemplates.create({
      name: "Update Test",
      type: "estimate",
      subject: "Original Subject",
      body: "Original Body",
    });
    const updated = await caller.emailTemplates.update({
      id: created.id,
      name: "Updated Name",
      subject: "Updated Subject",
    });
    expect(updated.name).toBe("Updated Name");
    expect(updated.subject).toBe("Updated Subject");
    expect(updated.body).toBe("Original Body"); // unchanged
  });

  it("delete email template", async () => {
    const caller = appRouter.createCaller(createAuthContext());
    const created = await caller.emailTemplates.create({
      name: "Delete Test",
      type: "payment_receipt",
      subject: "Receipt",
      body: "Body",
    });
    const result = await caller.emailTemplates.delete({ id: created.id });
    expect(result).toEqual({ success: true });
  });

  it("validates template type enum", async () => {
    const caller = appRouter.createCaller(createAuthContext());
    await expect(
      caller.emailTemplates.create({
        name: "Bad Type",
        type: "invalid_type" as any,
        subject: "Test",
        body: "Test",
      })
    ).rejects.toThrow();
  });

  it("filters templates by type", async () => {
    const caller = appRouter.createCaller(createAuthContext());
    await caller.emailTemplates.create({
      name: "Invoice Only",
      type: "invoice",
      subject: "Inv",
      body: "Body",
    });
    await caller.emailTemplates.create({
      name: "Estimate Only",
      type: "estimate",
      subject: "Est",
      body: "Body",
    });
    const invoiceTemplates = await caller.emailTemplates.list({ type: "invoice" });
    for (const t of invoiceTemplates as any[]) {
      expect(t.type).toBe("invoice");
    }
  });
});


// ─── Enhancement J: Recurring Invoice Auto-Generation ──────────────────────
describe("recurringAutoGen", () => {
  it("should get due recurring transactions via getDue", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const result = await caller.recurringAutoGen.getDue();
    expect(Array.isArray(result)).toBe(true);
  });

  it("should return generation log", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const result = await caller.recurringAutoGen.generationLog();
    expect(Array.isArray(result)).toBe(true);
  });

  it("should process all due recurring transactions", async () => {
    const caller = appRouter.createCaller(createAuthContext());
    const result = await caller.recurringAutoGen.processAll();
    expect(result).toHaveProperty("processed");
    expect(typeof result.processed).toBe("number");
  }, 15000);

  it("should get due recurring transactions", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const result = await caller.recurringAutoGen.getDue();
    expect(Array.isArray(result)).toBe(true);
  });
});

// ─── Enhancement K: Multi-Currency Support ─────────────────────────────────
describe("multi-currency", () => {
  it("should list exchange rates", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const result = await caller.exchangeRates.list();
    expect(Array.isArray(result)).toBe(true);
  });

  it("should create an exchange rate", async () => {
    const caller = appRouter.createCaller(createAuthContext());
    const result = await caller.exchangeRates.create({
      fromCurrency: "CAD",
      toCurrency: "USD",
      rate: "0.7350",
      effectiveDate: new Date("2026-02-01"),
      source: "Manual",
    });
    expect(result).toBeTruthy();
  });

  it("should create invoice with currency field", async () => {
    const caller = appRouter.createCaller(createAuthContext());
    // First create a customer
    const customer = await caller.customers.create({
      displayName: "Currency Test Customer",
      email: "currency@test.com",
    });
    const custId = (customer as any)?.id || (customer as any)?.[0]?.id;
    if (custId) {
      const invoice = await caller.invoices.create({
        invoiceNumber: "INV-CURR-001",
        customerId: custId,
        invoiceDate: new Date("2026-02-01"),
        total: "500.00",
        currency: "USD",
      });
      expect(invoice).toBeTruthy();
    }
  });

  it("should create and list exchange rates", async () => {
    const caller = appRouter.createCaller(createAuthContext());
    await caller.exchangeRates.create({
      fromCurrency: "EUR",
      toCurrency: "CAD",
      rate: "1.4800",
      effectiveDate: new Date("2026-02-10"),
      source: "Test",
    });
    const rates = await caller.exchangeRates.list();
    expect((rates as any[]).length).toBeGreaterThan(0);
  });
});

// ─── Enhancement L: Audit Trail / Activity Log ─────────────────────────────
describe("audit trail", () => {
  it("should list audit entries", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const result = await caller.audit.list({ limit: 50 });
    expect(Array.isArray(result)).toBe(true);
  });

  it("should filter audit entries by entity type", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const result = await caller.audit.list({
      entityType: "Invoice",
      limit: 50,
    });
    expect(Array.isArray(result)).toBe(true);
    for (const entry of (result as any[])) {
      expect(entry.entityType).toBe("Invoice");
    }
  });

  it("should filter audit entries by action", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const result = await caller.audit.list({
      action: "create",
      limit: 50,
    });
    expect(Array.isArray(result)).toBe(true);
    for (const entry of (result as any[])) {
      expect(entry.action).toBe("create");
    }
  });

  it("should filter audit entries by date range", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const result = await caller.audit.list({
      startDate: new Date("2026-01-01"),
      endDate: new Date("2026-12-31"),
      limit: 50,
    });
    expect(Array.isArray(result)).toBe(true);
  });

  it("should log audit entries when creating customers", async () => {
    const caller = appRouter.createCaller(createAuthContext());
    // Create a customer to trigger audit log
    await caller.customers.create({
      displayName: "Audit Test Customer",
      email: "audit@test.com",
    });
    // Check that the audit log contains the entry
    const auditEntries = await caller.audit.list({
      entityType: "Customer",
      action: "create",
      limit: 10,
    });
    expect((auditEntries as any[]).length).toBeGreaterThan(0);
  });
});
