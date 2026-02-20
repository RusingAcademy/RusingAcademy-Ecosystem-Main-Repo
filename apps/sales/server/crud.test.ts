import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

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

describe("Invoice CRUD (Sprint 4)", () => {
  it("creates a new invoice", async () => {
    const caller = appRouter.createCaller(createAuthContext());
    const customers = await caller.customers.list();
    const firstCustomer = customers[0];

    const result = await caller.invoices.create({
      customerId: firstCustomer.id,
      invoiceNumber: "TEST-001",
      invoiceDate: new Date(),
      dueDate: new Date(Date.now() + 30 * 86400000),
      terms: "Net 30",
      status: "Draft",
      subtotal: "100.00",
      taxAmount: "13.00",
      total: "113.00",
    });

    expect(result).toBeTruthy();
    expect(result.id).toBeGreaterThan(0);
  });

  it("lists invoices with expected fields", async () => {
    const caller = appRouter.createCaller(createAuthContext());
    const invoices = await caller.invoices.list();
    expect(invoices.length).toBeGreaterThan(0);
    expect(invoices[0]).toHaveProperty("invoiceNumber");
    expect(invoices[0]).toHaveProperty("customerName");
  });

  it("updates an invoice status", async () => {
    const caller = appRouter.createCaller(createAuthContext());
    const invoices = await caller.invoices.list();
    const firstInvoice = invoices[0];

    const updated = await caller.invoices.update({
      id: firstInvoice.id,
      status: "Sent",
    });

    expect(updated).toBeTruthy();
  });
});

describe("Expense CRUD (Sprint 5)", () => {
  it("creates a new expense", async () => {
    const caller = appRouter.createCaller(createAuthContext());

    const result = await caller.expenses.create({
      payeeName: "Test Vendor",
      expenseDate: new Date(),
      expenseType: "Expense",
      paymentMethod: "Cash",
      subtotal: "50.00",
      taxAmount: "6.50",
      total: "56.50",
    });

    expect(result).toBeTruthy();
    expect(result.id).toBeGreaterThan(0);
  });

  it("gets an expense by ID", async () => {
    const caller = appRouter.createCaller(createAuthContext());
    const expenses = await caller.expenses.list();
    const firstExpense = expenses[0];

    const expense = await caller.expenses.getById({ id: firstExpense.id });
    expect(expense).toBeTruthy();
    expect(expense!.id).toBe(firstExpense.id);
  });
});

describe("Customer CRUD (Sprint 6)", () => {
  it("creates a new customer", async () => {
    const caller = appRouter.createCaller(createAuthContext());

    const result = await caller.customers.create({
      displayName: "Test Customer CRUD",
      email: "testcrud@example.com",
      phone: "555-0001",
    });

    expect(result).toBeTruthy();
    expect(result.id).toBeGreaterThan(0);
  });

  it("updates a customer", async () => {
    const caller = appRouter.createCaller(createAuthContext());
    const customers = await caller.customers.list();
    const firstCustomer = customers[0];

    const updated = await caller.customers.update({
      id: firstCustomer.id,
      email: "updated@example.com",
    });

    expect(updated).toBeTruthy();
  });

  it("gets customer by ID with correct fields", async () => {
    const caller = appRouter.createCaller(createAuthContext());
    const customers = await caller.customers.list();
    const customer = await caller.customers.getById({ id: customers[0].id });

    expect(customer).toBeTruthy();
    expect(customer).toHaveProperty("displayName");
    expect(customer).toHaveProperty("email");
  });
});

describe("Supplier CRUD (Sprint 6)", () => {
  it("creates a new supplier", async () => {
    const caller = appRouter.createCaller(createAuthContext());

    const result = await caller.suppliers.create({
      displayName: "Test Supplier CRUD",
      company: "Test Corp",
      email: "supplier@test.com",
    });

    expect(result).toBeTruthy();
    expect(result.id).toBeGreaterThan(0);
  });

  it("updates a supplier", async () => {
    const caller = appRouter.createCaller(createAuthContext());
    const suppliers = await caller.suppliers.list();
    const firstSupplier = suppliers[0];

    const updated = await caller.suppliers.update({
      id: firstSupplier.id,
      email: "updated-supplier@test.com",
    });

    expect(updated).toBeTruthy();
  });
});

describe("Product CRUD (Sprint 8)", () => {
  it("creates a new product", async () => {
    const caller = appRouter.createCaller(createAuthContext());

    const result = await caller.products.create({
      name: "Test Product CRUD",
      type: "Service",
      price: "99.99",
      description: "A test product",
    });

    expect(result).toBeTruthy();
    expect(result.id).toBeGreaterThan(0);
  });

  it("updates a product", async () => {
    const caller = appRouter.createCaller(createAuthContext());
    const products = await caller.products.list();
    const firstProduct = products[0];

    const updated = await caller.products.update({
      id: firstProduct.id,
      price: "149.99",
    });

    expect(updated).toBeTruthy();
  });

  it("gets product by ID", async () => {
    const caller = appRouter.createCaller(createAuthContext());
    const products = await caller.products.list();
    const product = await caller.products.getById({ id: products[0].id });

    expect(product).toBeTruthy();
    expect(product).toHaveProperty("name");
    expect(product).toHaveProperty("price");
  });
});

describe("Company Settings (Sprint 18)", () => {
  it("updates company settings", async () => {
    const caller = appRouter.createCaller(createAuthContext());

    const updated = await caller.company.update({
      companyName: "RusingAcademy",
      email: "info@rusingacademy.com",
    });

    expect(updated).toBeTruthy();
  });

  it("retrieves updated company settings", async () => {
    const caller = appRouter.createCaller(createAuthContext());
    const settings = await caller.company.get();

    expect(settings).toBeTruthy();
    expect(settings!.companyName).toBe("RusingAcademy");
  });
});

describe("Dashboard Reports Data", () => {
  it("dashboard getData returns P&L and expense data for reports", async () => {
    const caller = appRouter.createCaller(createAuthContext());
    const data = await caller.dashboard.getData();

    expect(data).toBeTruthy();
    expect(data).toHaveProperty("profitAndLoss");
    expect(data!.profitAndLoss).toHaveProperty("income");
    expect(data!.profitAndLoss).toHaveProperty("expenses");
    expect(data!.profitAndLoss).toHaveProperty("netProfit");
  });
});
