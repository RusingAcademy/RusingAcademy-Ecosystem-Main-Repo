import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createTestContext(): TrpcContext {
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
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: () => {} } as TrpcContext["res"],
  };
}

describe("Sprint 9 — Bank Transactions & Categorization", () => {
  it("lists bank transactions", async () => {
    const caller = appRouter.createCaller(createTestContext());
    const result = await caller.bankTransactions.list();
    expect(Array.isArray(result)).toBe(true);
  });

  it("updates a bank transaction status", async () => {
    const caller = appRouter.createCaller(createTestContext());
    // Update the first bank transaction if it exists
    const list = await caller.bankTransactions.list();
    if (list.length > 0) {
      const result = await caller.bankTransactions.update({
        id: list[0].id,
        status: "Categorized",
      });
      expect(result).toBeDefined();
    }
  });
});

describe("Sprint 10 — Sales Tax", () => {
  it("lists tax rates", async () => {
    const caller = appRouter.createCaller(createTestContext());
    const result = await caller.taxRates.list();
    expect(Array.isArray(result)).toBe(true);
  });

  it("lists tax filings", async () => {
    const caller = appRouter.createCaller(createTestContext());
    const result = await caller.taxFilings.list();
    expect(Array.isArray(result)).toBe(true);
  });
});

describe("Sprint 11-12 — Reports Engine", () => {
  it("generates trial balance report", async () => {
    const caller = appRouter.createCaller(createTestContext());
    const result = await caller.reports.trialBalance();
    expect(Array.isArray(result)).toBe(true);
  });

  it("generates aging receivable report", async () => {
    const caller = appRouter.createCaller(createTestContext());
    const result = await caller.reports.agingReceivable();
    expect(Array.isArray(result)).toBe(true);
  });

  it("generates aging payable report", async () => {
    const caller = appRouter.createCaller(createTestContext());
    const result = await caller.reports.agingPayable();
    expect(Array.isArray(result)).toBe(true);
  });

  it("generates general ledger report", async () => {
    const caller = appRouter.createCaller(createTestContext());
    const result = await caller.reports.generalLedger();
    expect(Array.isArray(result)).toBe(true);
  });
});

describe("Sprint 14 — Recurring Transactions", () => {
  it("lists recurring transactions", async () => {
    const caller = appRouter.createCaller(createTestContext());
    const result = await caller.recurring.list();
    expect(Array.isArray(result)).toBe(true);
  });

  it("creates a recurring transaction", async () => {
    const caller = appRouter.createCaller(createTestContext());
    const result = await caller.recurring.create({
      templateName: "Monthly Rent",
      transactionType: "Expense",
      frequency: "Monthly",
      startDate: new Date(),
      nextDate: new Date(),
    });
    expect(result).toBeDefined();
  });
});

describe("Sprint 15 — Payments & Deposits", () => {
  it("lists payments", async () => {
    const caller = appRouter.createCaller(createTestContext());
    const result = await caller.payments.list();
    expect(Array.isArray(result)).toBe(true);
  });
});

describe("Sprint 16 — Reconciliation", () => {
  it("lists reconciliations", async () => {
    const caller = appRouter.createCaller(createTestContext());
    const result = await caller.reconciliations.list();
    expect(Array.isArray(result)).toBe(true);
  });

  it("creates a reconciliation", async () => {
    const caller = appRouter.createCaller(createTestContext());
    const result = await caller.reconciliations.create({
      accountId: 1,
      statementDate: new Date(),
      statementBalance: "5000.00",
    });
    expect(result).toBeDefined();
  });
});

describe("Sprint 17 — Journal Entries", () => {
  it("lists journal entries", async () => {
    const caller = appRouter.createCaller(createTestContext());
    const result = await caller.journalEntries.list();
    expect(Array.isArray(result)).toBe(true);
  });
});

describe("Sprint 17 — Audit Log", () => {
  it("lists audit log entries", async () => {
    const caller = appRouter.createCaller(createTestContext());
    const result = await caller.audit.list();
    expect(Array.isArray(result)).toBe(true);
  });
});

describe("Sprint 19 — Estimates & Bills", () => {
  it("lists estimates", async () => {
    const caller = appRouter.createCaller(createTestContext());
    const result = await caller.estimates.list();
    expect(Array.isArray(result)).toBe(true);
  });

  it("creates an estimate", async () => {
    const caller = appRouter.createCaller(createTestContext());
    const result = await caller.estimates.create({
      estimateNumber: "EST-001",
      customerId: 1,
      estimateDate: new Date(),
      expiryDate: new Date(),
      total: "1000.00",
    });
    expect(result).toBeDefined();
  });

  it("lists bills", async () => {
    const caller = appRouter.createCaller(createTestContext());
    const result = await caller.bills.list();
    expect(Array.isArray(result)).toBe(true);
  });

  it("creates a bill", async () => {
    const caller = appRouter.createCaller(createTestContext());
    const result = await caller.bills.create({
      billNumber: "BILL-001",
      supplierId: 1,
      billDate: new Date(),
      dueDate: new Date(),
      total: "500.00",
    });
    expect(result).toBeDefined();
  });
});
