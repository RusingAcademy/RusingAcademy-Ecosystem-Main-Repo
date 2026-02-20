import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import * as db from "./db";
import * as accounting from "./accounting";
import { notifyOwner } from "./_core/notification";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // ─── Dashboard ───────────────────────────────────────────────────
  dashboard: router({
    getData: publicProcedure.query(async () => {
      return db.getDashboardData();
    }),
  }),

  // ─── Company Settings ────────────────────────────────────────────
  company: router({
    get: publicProcedure.query(async () => {
      return db.getCompanySettings();
    }),
    update: protectedProcedure
      .input(z.object({
        companyName: z.string().optional(),
        legalName: z.string().optional(),
        email: z.string().optional(),
        phone: z.string().optional(),
        address: z.string().optional(),
        city: z.string().optional(),
        province: z.string().optional(),
        postalCode: z.string().optional(),
        country: z.string().optional(),
        currency: z.string().optional(),
        fiscalYearStart: z.string().optional(),
        taxId: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        return db.updateCompanySettings(input);
      }),
  }),

  // ─── Accounts (Chart of Accounts) ────────────────────────────────
  accounts: router({
    list: publicProcedure
      .input(z.object({
        type: z.string().optional(),
        isActive: z.boolean().optional(),
      }).optional())
      .query(async ({ input }) => {
        return db.getAccounts(input ?? undefined);
      }),
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return db.getAccountById(input.id);
      }),
    create: protectedProcedure
      .input(z.object({
        name: z.string(),
        accountType: z.string(),
        detailType: z.string().optional(),
        description: z.string().optional(),
        balance: z.string().optional(),
        accountNumber: z.string().optional(),
        isSubAccount: z.boolean().optional(),
        parentAccountId: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        return db.createAccount(input);
      }),
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().optional(),
        accountType: z.string().optional(),
        detailType: z.string().optional(),
        description: z.string().optional(),
        balance: z.string().optional(),
        isActive: z.boolean().optional(),
        accountNumber: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        return db.updateAccount(id, data);
      }),
  }),

  // ─── Customers ───────────────────────────────────────────────────
  customers: router({
    list: publicProcedure
      .input(z.object({
        search: z.string().optional(),
        isActive: z.boolean().optional(),
      }).optional())
      .query(async ({ input }) => {
        return db.getCustomers(input ?? undefined);
      }),
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return db.getCustomerById(input.id);
      }),
    create: protectedProcedure
      .input(z.object({
        displayName: z.string(),
        firstName: z.string().optional(),
        lastName: z.string().optional(),
        company: z.string().optional(),
        email: z.string().optional(),
        phone: z.string().optional(),
        mobile: z.string().optional(),
        website: z.string().optional(),
        billingAddress: z.string().optional(),
        shippingAddress: z.string().optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const result = await db.createCustomer(input);
        try { await db.logAuditAction({ action: "create", entityType: "Customer", entityId: (result as any)?.id, details: { displayName: input.displayName } }); } catch (_) {}
        return result;
      }),
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        displayName: z.string().optional(),
        firstName: z.string().optional(),
        lastName: z.string().optional(),
        company: z.string().optional(),
        email: z.string().optional(),
        phone: z.string().optional(),
        mobile: z.string().optional(),
        website: z.string().optional(),
        billingAddress: z.string().optional(),
        shippingAddress: z.string().optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        const result = await db.updateCustomer(id, data);
        try { await db.logAuditAction({ action: "update", entityType: "Customer", entityId: id, details: { changes: Object.keys(data) } }); } catch (_) {}
        return result;
      }),
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        try { await db.logAuditAction({ action: "delete", entityType: "Customer", entityId: input.id }); } catch (_) {}
        await db.deleteCustomer(input.id);
        return { success: true };
      }),
  }),

  // ─── Suppliers ───────────────────────────────────────────────────
  suppliers: router({
    list: publicProcedure
      .input(z.object({
        search: z.string().optional(),
        isActive: z.boolean().optional(),
      }).optional())
      .query(async ({ input }) => {
        return db.getSuppliers(input ?? undefined);
      }),
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return db.getSupplierById(input.id);
      }),
    create: protectedProcedure
      .input(z.object({
        displayName: z.string(),
        firstName: z.string().optional(),
        lastName: z.string().optional(),
        company: z.string().optional(),
        email: z.string().optional(),
        phone: z.string().optional(),
        website: z.string().optional(),
        address: z.string().optional(),
        notes: z.string().optional(),
        taxId: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        return db.createSupplier(input);
      }),
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        displayName: z.string().optional(),
        firstName: z.string().optional(),
        lastName: z.string().optional(),
        company: z.string().optional(),
        email: z.string().optional(),
        phone: z.string().optional(),
        website: z.string().optional(),
        address: z.string().optional(),
        taxId: z.string().optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        return db.updateSupplier(id, data);
      }),
  }),

  // ─── Products & Services ─────────────────────────────────────────
  products: router({
    list: publicProcedure
      .input(z.object({
        search: z.string().optional(),
        type: z.string().optional(),
        isActive: z.boolean().optional(),
      }).optional())
      .query(async ({ input }) => {
        return db.getProducts(input ?? undefined);
      }),
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return db.getProductById(input.id);
      }),
    create: protectedProcedure
      .input(z.object({
        name: z.string(),
        description: z.string().optional(),
        type: z.enum(["Service", "Inventory", "Non-Inventory"]).optional(),
        category: z.string().optional(),
        price: z.string().optional(),
        cost: z.string().optional(),
        sku: z.string().optional(),
        isTaxable: z.boolean().optional(),
      }))
      .mutation(async ({ input }) => {
        return db.createProduct(input);
      }),
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().optional(),
        description: z.string().optional(),
        type: z.enum(["Service", "Inventory", "Non-Inventory"]).optional(),
        category: z.string().optional(),
        price: z.string().optional(),
        cost: z.string().optional(),
        sku: z.string().optional(),
        isTaxable: z.boolean().optional(),
        isActive: z.boolean().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        return db.updateProduct(id, data);
      }),
  }),

  // ─── Invoices ────────────────────────────────────────────────────
  invoices: router({
    list: publicProcedure
      .input(z.object({
        status: z.string().optional(),
        customerId: z.number().optional(),
        search: z.string().optional(),
      }).optional())
      .query(async ({ input }) => {
        const rows = await db.getInvoices(input ?? undefined);
        return rows.map((r: any) => ({
          id: r.invoice.id,
          invoiceNumber: r.invoice.invoiceNumber,
          invoiceDate: r.invoice.invoiceDate,
          dueDate: r.invoice.dueDate,
          subtotal: r.invoice.subtotal,
          taxAmount: r.invoice.taxAmount,
          total: r.invoice.total,
          amountPaid: r.invoice.amountPaid,
          amountDue: r.invoice.amountDue,
          status: r.invoice.status,
          notes: r.invoice.notes,
          isSent: r.invoice.isSent,
          customerId: r.invoice.customerId,
          customerName: r.customerName,
          createdAt: r.invoice.createdAt,
          updatedAt: r.invoice.updatedAt,
        }));
      }),
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return db.getInvoiceById(input.id);
      }),
    create: protectedProcedure
      .input(z.object({
        invoiceNumber: z.string(),
        customerId: z.number(),
        invoiceDate: z.date(),
        dueDate: z.date().optional(),
        subtotal: z.string().optional(),
        taxAmount: z.string().optional(),
        total: z.string().optional(),
        amountDue: z.string().optional(),
        status: z.enum(["Draft", "Sent", "Viewed", "Partial", "Paid", "Overdue", "Deposited", "Voided"]).optional(),
        notes: z.string().optional(),
        terms: z.string().optional(),
        currency: z.string().optional(),
        lineItems: z.array(z.object({
          productId: z.number().optional(),
          description: z.string().optional(),
          quantity: z.string().optional(),
          rate: z.string().optional(),
          amount: z.string().optional(),
          taxCode: z.string().optional(),
          taxAmount: z.string().optional(),
          sortOrder: z.number().optional(),
        })).optional(),
      }))
      .mutation(async ({ input }) => {
        const { lineItems, ...invoiceData } = input;
        const result = await db.createInvoice(invoiceData, lineItems as any);
        // Auto-journalize: Debit AR, Credit Income
        if (result) { try { await accounting.journalizeInvoice(result.id); } catch (e) { console.warn("[Accounting] Failed to journalize invoice:", e); } }
        // Audit log
        try { await db.logAuditAction({ action: "create", entityType: "Invoice", entityId: result?.id, details: { invoiceNumber: input.invoiceNumber, total: input.total, currency: input.currency } }); } catch (_) {}
        return result;
      }),
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        invoiceNumber: z.string().optional(),
        customerId: z.number().optional(),
        invoiceDate: z.date().optional(),
        dueDate: z.date().optional(),
        subtotal: z.string().optional(),
        taxAmount: z.string().optional(),
        total: z.string().optional(),
        amountPaid: z.string().optional(),
        amountDue: z.string().optional(),
        status: z.enum(["Draft", "Sent", "Viewed", "Partial", "Paid", "Overdue", "Deposited", "Voided"]).optional(),
        notes: z.string().optional(),
        currency: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        // If voiding, create reversing journal entry
        if (data.status === "Voided") {
          try { await accounting.reverseTransactionJournalEntries("invoice", id); } catch (e) { console.warn("[Accounting] Failed to reverse invoice JE:", e); }
        }
        const result = await db.updateInvoice(id, data);
        // Audit log
        try { await db.logAuditAction({ action: data.status ? `status_change_${data.status}` : "update", entityType: "Invoice", entityId: id, details: { changes: Object.keys(data) } }); } catch (_) {}
        return result;
      }),
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        try { await accounting.reverseTransactionJournalEntries("invoice", input.id); } catch (e) { console.warn("[Accounting] Failed to reverse invoice JE:", e); }
        // Audit log
        try { await db.logAuditAction({ action: "delete", entityType: "Invoice", entityId: input.id }); } catch (_) {}
        await db.deleteInvoice(input.id);
        return { success: true };
      }),
    recordPayment: protectedProcedure
      .input(z.object({
        invoiceId: z.number(),
        amount: z.string(),
        paymentDate: z.date().optional(),
        paymentMethod: z.string().optional(),
        memo: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        return db.recordInvoicePayment(input);
      }),
    sendEmail: protectedProcedure
      .input(z.object({
        invoiceId: z.number(),
        recipientEmail: z.string().email(),
        message: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const invoice = await db.getInvoiceById(input.invoiceId);
        if (!invoice) throw new TRPCError({ code: "NOT_FOUND", message: "Invoice not found" });
        const inv = invoice.invoice;
        const customerName = invoice.customerName || "Customer";
        const companySettings = await db.getCompanySettings();
        const companyName = companySettings?.companyName || "RusingAcademy";
        const invoiceUrl = `${companyName} Invoice #${inv.invoiceNumber}`;
        const emailContent = [
          `**Invoice #${inv.invoiceNumber}**`,
          ``,
          `Dear ${customerName},`,
          ``,
          input.message || `Please find your invoice details below.`,
          ``,
          `| Detail | Value |`,
          `|--------|-------|`,
          `| Invoice Number | ${inv.invoiceNumber} |`,
          `| Invoice Date | ${new Date(inv.invoiceDate).toLocaleDateString("en-CA")} |`,
          `| Due Date | ${inv.dueDate ? new Date(inv.dueDate).toLocaleDateString("en-CA") : "N/A"} |`,
          `| Subtotal | $${Number(inv.subtotal).toFixed(2)} |`,
          `| Tax | $${Number(inv.taxAmount).toFixed(2)} |`,
          `| **Total** | **$${Number(inv.total).toFixed(2)}** |`,
          `| Amount Paid | $${Number(inv.amountPaid).toFixed(2)} |`,
          `| **Amount Due** | **$${Number(inv.amountDue).toFixed(2)}** |`,
          ``,
          `Thank you for your business!`,
          ``,
          `— ${companyName}`,
        ].join("\n");

        const delivered = await notifyOwner({
          title: `Invoice #${inv.invoiceNumber} sent to ${input.recipientEmail}`,
          content: emailContent,
        });

        // Mark invoice as sent if not already
        if (inv.status === "Draft") {
          await db.updateInvoice(input.invoiceId, { status: "Sent", isSent: true });
        }

        return { success: delivered, message: delivered ? "Invoice notification sent successfully" : "Failed to send notification" };
      }),
  }),

  // ─── Expenses ────────────────────────────────────────────────────
  expenses: router({
    list: publicProcedure
      .input(z.object({
        type: z.string().optional(),
        search: z.string().optional(),
      }).optional())
      .query(async ({ input }) => {
        return db.getExpenses(input ?? undefined);
      }),
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return db.getExpenseById(input.id);
      }),
    create: protectedProcedure
      .input(z.object({
        expenseType: z.enum(["Expense", "Cheque Expense", "Bill Payment"]).optional(),
        payeeName: z.string().optional(),
        payeeType: z.enum(["supplier", "customer", "other"]).optional(),
        payeeId: z.number().optional(),
        accountId: z.number().optional(),
        expenseDate: z.date(),
        paymentMethod: z.string().optional(),
        referenceNumber: z.string().optional(),
        subtotal: z.string().optional(),
        taxAmount: z.string().optional(),
        total: z.string().optional(),
        memo: z.string().optional(),
        lineItems: z.array(z.object({
          accountId: z.number().optional(),
          description: z.string().optional(),
          amount: z.string().optional(),
          taxCode: z.string().optional(),
          sortOrder: z.number().optional(),
        })).optional(),
      }))
      .mutation(async ({ input }) => {
        const { lineItems, ...expenseData } = input;
        const result = await db.createExpense(expenseData, lineItems as any);
        // Auto-journalize: Debit Expense, Credit Bank
        if (result) { try { await accounting.journalizeExpense(result.id); } catch (e) { console.warn("[Accounting] Failed to journalize expense:", e); } }
        // Audit log
        try { await db.logAuditAction({ action: "create", entityType: "Expense", entityId: result?.id, details: { payeeName: input.payeeName, total: input.total } }); } catch (_) {}
        return result;
      }),
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        payeeName: z.string().optional(),
        expenseDate: z.date().optional(),
        subtotal: z.string().optional(),
        taxAmount: z.string().optional(),
        total: z.string().optional(),
        memo: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        const result = await db.updateExpense(id, data);
        // Audit log
        try { await db.logAuditAction({ action: "update", entityType: "Expense", entityId: id, details: { changes: Object.keys(data) } }); } catch (_) {}
        return result;
      }),
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        try { await accounting.reverseTransactionJournalEntries("expense", input.id); } catch (e) { console.warn("[Accounting] Failed to reverse expense JE:", e); }
        // Audit log
        try { await db.logAuditAction({ action: "delete", entityType: "Expense", entityId: input.id }); } catch (_) {}
        await db.deleteExpense(input.id);
        return { success: true };
      }),
  }),

  // ─── Payments ────────────────────────────────────────────────────
  payments: router({
    list: publicProcedure
      .input(z.object({
        customerId: z.number().optional(),
      }).optional())
      .query(async ({ input }) => {
        return db.getPayments(input ?? undefined);
      }),
    create: protectedProcedure
      .input(z.object({
        customerId: z.number(),
        paymentDate: z.date(),
        amount: z.string(),
        paymentMethod: z.string().optional(),
        referenceNumber: z.string().optional(),
        depositToAccountId: z.number().optional(),
        memo: z.string().optional(),
        applications: z.array(z.object({
          invoiceId: z.number(),
          amount: z.string(),
        })).optional(),
      }))
      .mutation(async ({ input }) => {
        const { applications, ...paymentData } = input;
        const result = await db.createPayment(paymentData, applications);
        // Auto-journalize: Debit Bank, Credit AR
        if (result) { try { await accounting.journalizePayment(result.id); } catch (e) { console.warn("[Accounting] Failed to journalize payment:", e); } }
        return result;
      }),
  }),

  // ─── Bank Transactions ───────────────────────────────────────────
  bankTransactions: router({
    list: publicProcedure
      .input(z.object({
        status: z.string().optional(),
        accountId: z.number().optional(),
      }).optional())
      .query(async ({ input }) => {
        return db.getBankTransactions(input ?? undefined);
      }),
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        status: z.enum(["For Review", "Categorized", "Excluded", "Matched"]).optional(),
        categoryAccountId: z.number().optional(),
        memo: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        return db.updateBankTransaction(id, data);
      }),
    // Sprint 28: CSV Import
    importCsv: protectedProcedure
      .input(z.object({
        accountId: z.number(),
        transactions: z.array(z.object({
          transactionDate: z.date(),
          description: z.string(),
          amount: z.string(),
          fitId: z.string().optional(),
        })),
      }))
      .mutation(async ({ input }) => {
        return db.importBankTransactions(input.accountId, input.transactions);
      }),
  }),

  // ─── Attachments ───────────────────────────────────────────
  attachments: router({
    list: publicProcedure
      .input(z.object({ entityType: z.string(), entityId: z.number() }))
      .query(async ({ input }) => {
        return db.getAttachments(input.entityType, input.entityId);
      }),
    create: protectedProcedure
      .input(z.object({
        entityType: z.string(),
        entityId: z.number(),
        fileName: z.string(),
        fileUrl: z.string(),
        fileKey: z.string(),
        mimeType: z.string().optional(),
        fileSize: z.number().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        return db.createAttachment({ ...input, uploadedBy: ctx.user?.id });
      }),
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteAttachment(input.id);
        return { success: true };
      }),
  }),

  // ─── Tax Rates ───────────────────────────────────────────
  taxRates: router({
    list: publicProcedure.query(async () => {
      return db.getTaxRates();
    }),
    create: protectedProcedure
      .input(z.object({
        name: z.string(),
        code: z.string(),
        rate: z.string(),
        agency: z.string().optional(),
        description: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        return db.createTaxRate(input);
      }),
  }),

  // ─── Tax Filings ─────────────────────────────────────────────────
  taxFilings: router({
    list: publicProcedure.query(async () => {
      return db.getTaxFilings();
    }),
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        status: z.enum(["Upcoming", "Due", "Filed", "Paid"]).optional(),
        filedDate: z.date().optional(),
        paidDate: z.date().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        return db.updateTaxFiling(id, data);
      }),
    // Sprint 33: Tax automation
    prepareTaxReturn: protectedProcedure
      .input(z.object({
        periodStart: z.date(),
        periodEnd: z.date(),
      }))
      .mutation(async ({ input }) => {
        return db.prepareTaxReturn(input.periodStart, input.periodEnd);
      }),
    recordPayment: protectedProcedure
      .input(z.object({
        id: z.number(),
        paidDate: z.date(),
      }))
      .mutation(async ({ input }) => {
        await db.recordTaxPayment(input.id, input.paidDate);
        return { success: true };
      }),
  }),

  // ─── Journal Entries ─────────────────────────────────────────────
  journalEntries: router({
    list: publicProcedure.query(async () => {
      return db.getJournalEntries();
    }),
    create: protectedProcedure
      .input(z.object({
        entryNumber: z.string().optional(),
        entryDate: z.date(),
        memo: z.string().optional(),
        isAdjusting: z.boolean().optional(),
        lines: z.array(z.object({
          accountId: z.number(),
          debit: z.string().optional(),
          credit: z.string().optional(),
          description: z.string().optional(),
          customerId: z.number().optional(),
          supplierId: z.number().optional(),
        })),
      }))
      .mutation(async ({ input }) => {
        const { lines, ...entryData } = input;
        return db.createJournalEntry(entryData, lines as any);
      }),
  }),

  // ─── Estimates ───────────────────────────────────────────────────
  estimates: router({
    list: publicProcedure
      .input(z.object({
        status: z.string().optional(),
        customerId: z.number().optional(),
      }).optional())
      .query(async ({ input }) => {
        const rows = await db.getEstimates(input ?? undefined);
        return rows.map((r: any) => ({
          ...r.estimate,
          customerName: r.customerName,
        }));
      }),
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return db.getEstimateById(input.id);
      }),
    create: protectedProcedure
      .input(z.object({
        estimateNumber: z.string(),
        customerId: z.number(),
        estimateDate: z.date(),
        expiryDate: z.date().optional(),
        subtotal: z.string().optional(),
        taxAmount: z.string().optional(),
        total: z.string().optional(),
        notes: z.string().optional(),
        lineItems: z.array(z.object({
          productId: z.number().optional(),
          description: z.string().optional(),
          quantity: z.string().optional(),
          rate: z.string().optional(),
          amount: z.string().optional(),
          taxCode: z.string().optional(),
          taxAmount: z.string().optional(),
          sortOrder: z.number().optional(),
        })).optional(),
      }))
      .mutation(async ({ input }) => {
        const { lineItems, ...data } = input;
        return db.createEstimate(data, lineItems as any);
      }),
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        status: z.enum(["Draft", "Sent", "Accepted", "Rejected", "Converted", "Closed"]).optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        return db.updateEstimate(id, data);
      }),
    // Sprint 31: Convert estimate to invoice
    convertToInvoice: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return db.convertEstimateToInvoice(input.id);
      }),
  }),

  // ─── Estimates ───────────────────────────────────────────────────
  // (moved below bills)

  // ─── Bills ───────────────────────────────────────────────────────
  bills: router({
    list: publicProcedure
      .input(z.object({
        status: z.string().optional(),
        supplierId: z.number().optional(),
      }).optional())
      .query(async ({ input }) => {
        const rows = await db.getBills(input ?? undefined);
        return rows.map((r: any) => ({
          ...r.bill,
          supplierName: r.supplierName,
        }));
      }),
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return db.getBillById(input.id);
      }),
    create: protectedProcedure
      .input(z.object({
        billNumber: z.string().optional(),
        supplierId: z.number(),
        billDate: z.date(),
        dueDate: z.date().optional(),
        subtotal: z.string().optional(),
        taxAmount: z.string().optional(),
        total: z.string().optional(),
        memo: z.string().optional(),
        lineItems: z.array(z.object({
          accountId: z.number().optional(),
          description: z.string().optional(),
          amount: z.string().optional(),
          taxCode: z.string().optional(),
          sortOrder: z.number().optional(),
        })).optional(),
      }))
      .mutation(async ({ input }) => {
        const { lineItems, ...data } = input;
        const result = await db.createBill(data, lineItems as any);
        // Auto-journalize: Debit Expense, Credit AP
        if (result) { try { await accounting.journalizeBill(result.id); } catch (e) { console.warn("[Accounting] Failed to journalize bill:", e); } }
        return result;
      }),
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        status: z.enum(["Draft", "Open", "Partial", "Paid", "Overdue", "Voided"]).optional(),
        memo: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        return db.updateBill(id, data);
      }),
    // Sprint 31: Pay bill
    payBill: protectedProcedure
      .input(z.object({
        id: z.number(),
        amount: z.string(),
        paymentAccountId: z.number(),
        paymentDate: z.date(),
      }))
      .mutation(async ({ input }) => {
        const result = await db.payBill(input.id, input.amount, input.paymentAccountId, input.paymentDate);
        if (result) {
          try { await accounting.journalizeBillPayment(input.id, parseFloat(input.amount), input.paymentAccountId); } catch (e) { console.warn('[Accounting] Bill payment JE failed:', e); }
        }
        return result;
      }),
  }),

  // ─── Recurring Transactions ──────────────────────────────────────
  recurring: router({
    list: publicProcedure
      .input(z.object({
        type: z.string().optional(),
        isActive: z.boolean().optional(),
      }).optional())
      .query(async ({ input }) => {
        return db.getRecurringTransactions(input ?? undefined);
      }),
    create: protectedProcedure
      .input(z.object({
        templateName: z.string(),
        transactionType: z.enum(["Invoice", "Expense", "Bill", "Journal Entry"]),
        frequency: z.enum(["Daily", "Weekly", "Monthly", "Yearly"]),
        intervalCount: z.number().optional(),
        startDate: z.date(),
        endDate: z.date().optional(),
        nextDate: z.date().optional(),
        templateData: z.any().optional(),
      }))
      .mutation(async ({ input }) => {
        return db.createRecurringTransaction(input);
      }),
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        isActive: z.boolean().optional(),
        nextDate: z.date().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        return db.updateRecurringTransaction(id, data);
      }),
  }),

  // ─── Reconciliations ─────────────────────────────────────────────
  reconciliations: router({
    list: publicProcedure
      .input(z.object({ accountId: z.number().optional() }).optional())
      .query(async ({ input }) => {
        return db.getReconciliations(input?.accountId);
      }),
    create: protectedProcedure
      .input(z.object({
        accountId: z.number(),
        statementDate: z.date(),
        statementBalance: z.string(),
      }))
      .mutation(async ({ input }) => {
        return db.createReconciliation(input as any);
      }),
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        clearedBalance: z.string().optional(),
        difference: z.string().optional(),
        status: z.enum(["In Progress", "Completed"]).optional(),
        completedAt: z.date().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        return db.updateReconciliation(id, data as any);
      }),
  }),

  // ─── Invoice PDF (Sprint 41) ────────────────────────────────────
  invoicePdf: router({
    getData: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return db.getInvoicePdfData(input.id);
      }),
  }),

  // ─── Bank Rules (Sprint 46) ─────────────────────────────────────
  bankRules: router({
    list: publicProcedure.query(async () => {
      return db.getBankRules();
    }),
    create: protectedProcedure
      .input(z.object({
        name: z.string(),
        priority: z.number().optional(),
        conditions: z.array(z.object({
          field: z.string(),
          operator: z.string(),
          value: z.string(),
        })),
        assignAccountId: z.number().optional(),
        assignCategory: z.string().optional(),
        assignPayee: z.string().optional(),
        autoConfirm: z.boolean().optional(),
      }))
      .mutation(async ({ input }) => {
        return db.createBankRule(input as any);
      }),
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().optional(),
        priority: z.number().optional(),
        conditions: z.any().optional(),
        assignAccountId: z.number().optional(),
        assignCategory: z.string().optional(),
        assignPayee: z.string().optional(),
        autoConfirm: z.boolean().optional(),
        isActive: z.boolean().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        return db.updateBankRule(id, data as any);
      }),
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return db.deleteBankRule(input.id);
      }),
    runRule: protectedProcedure
      .input(z.object({ transactionId: z.number() }))
      .mutation(async ({ input }) => {
        return db.applyBankRules(input.transactionId);
      }),
  }),

  // ─── Exchange Rates (Sprint 44) ─────────────────────────────────
  exchangeRates: router({
    list: publicProcedure
      .input(z.object({ fromCurrency: z.string().optional() }).optional())
      .query(async ({ input }) => {
        return db.getExchangeRates(input?.fromCurrency);
      }),
    create: protectedProcedure
      .input(z.object({
        fromCurrency: z.string(),
        toCurrency: z.string(),
        rate: z.string(),
        effectiveDate: z.date(),
        source: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        return db.createExchangeRate(input as any);
      }),
  }),

  // ─── Reconciliation Workspace (Sprint 49) ───────────────────────
  reconciliationWorkspace: router({
    getData: publicProcedure
      .input(z.object({
        accountId: z.number(),
        statementDate: z.date(),
      }))
      .query(async ({ input }) => {
        return db.getReconciliationWorkspace(input.accountId, input.statementDate);
      }),
    toggleReconciled: protectedProcedure
      .input(z.object({
        transactionId: z.number(),
        isReconciled: z.boolean(),
      }))
      .mutation(async ({ input }) => {
        return db.toggleTransactionReconciled(input.transactionId, input.isReconciled);
      }),
  }),

  // ─── Recurring Auto-Generation (Enhancement J) ──────────────────
  recurringAutoGen: router({
    getDue: publicProcedure.query(async () => {
      return db.getDueRecurringTransactions();
    }),
    process: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        const result = await db.generateInvoiceFromRecurring(input.id);
        if (!result) return { success: false, message: "Not found or inactive" };
        await db.logAuditAction({ action: "auto_generate", entityType: "Invoice", entityId: result.id, details: { source: "recurring", recurringId: input.id } });
        return { success: true, message: `Invoice generated`, invoiceId: result.id };
      }),
    processAll: protectedProcedure
      .mutation(async () => {
        const results = await db.processAllDueRecurring();
        for (const r of results) {
          if (r.success) {
            await db.logAuditAction({ action: "auto_generate", entityType: "Invoice", entityId: r.invoiceId, details: { source: "recurring_batch", recurringId: r.id } });
          }
        }
        return { processed: results.length, results };
      }),
    generationLog: publicProcedure
      .input(z.object({ recurringTransactionId: z.number().optional(), limit: z.number().optional() }).optional())
      .query(async ({ input }) => {
        return db.getGenerationLog(input?.recurringTransactionId, input?.limit ?? 50);
      }),
  }),

  // ─── CSV Export (Sprint 43) ─────────────────────────────────────
  csvExport: router({
    getData: publicProcedure
      .input(z.object({
        reportType: z.string(),
        startDate: z.date().optional(),
        endDate: z.date().optional(),
        accountId: z.number().optional(),
      }))
      .query(async ({ input }) => {
        return db.getReportDataForExport(input.reportType, input);
      }),
  }),

  // ─── Reports ─────────────────────────────────────────────────────
  reports: router({
    profitAndLoss: publicProcedure
      .input(z.object({
        startDate: z.date().optional(),
        endDate: z.date().optional(),
      }).optional())
      .query(async ({ input }) => {
        return accounting.getProfitAndLoss(input?.startDate, input?.endDate);
      }),
    balanceSheet: publicProcedure
      .input(z.object({
        asOfDate: z.date().optional(),
      }).optional())
      .query(async ({ input }) => {
        return accounting.getBalanceSheet(input?.asOfDate);
      }),
    trialBalance: publicProcedure.query(async () => {
      return db.getTrialBalance();
    }),
    generalLedger: publicProcedure
      .input(z.object({ accountId: z.number().optional() }).optional())
      .query(async ({ input }) => {
        return db.getGeneralLedger(input ?? undefined);
      }),
    agingReceivable: publicProcedure.query(async () => {
      return db.getAgingReport("receivable");
    }),
    agingPayable: publicProcedure.query(async () => {
      return db.getAgingReport("payable");
    }),
    customerBalances: publicProcedure.query(async () => {
      return db.getCustomerBalances();
    }),
    supplierBalances: publicProcedure.query(async () => {
      return db.getSupplierBalances();
    }),
    // Sprint 34: Additional reports
    transactionsByDate: publicProcedure
      .input(z.object({
        startDate: z.date(),
        endDate: z.date(),
      }))
      .query(async ({ input }) => {
        return db.getTransactionsByDate(input.startDate, input.endDate);
      }),
    salesByCustomer: publicProcedure.query(async () => {
      return db.getSalesByCustomer();
    }),
    salesByProduct: publicProcedure.query(async () => {
      return db.getSalesByProduct();
    }),
  }),

  // ─── Account Transfers ───────────────────────────────────────
  transfers: router({
    list: publicProcedure.query(async () => {
      return db.getAccountTransfers();
    }),
    create: protectedProcedure
      .input(z.object({
        fromAccountId: z.number(),
        toAccountId: z.number(),
        amount: z.string(),
        transferDate: z.date(),
        memo: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const result = await db.createAccountTransfer(input);
        if (result) {
          try { await accounting.journalizeTransfer(input.fromAccountId, input.toAccountId, parseFloat(input.amount), input.transferDate, input.memo); } catch (e) { console.warn('[Accounting] Transfer JE failed:', e); }
        }
        return result;
      }),
  }),

  // ─── Global Search ───────────────────────────────────────────────
  search: router({
    query: publicProcedure
      .input(z.object({ query: z.string().min(1) }))
      .query(async ({ input }) => {
        return db.globalSearch(input.query);
      }),
  }),

  // ─── Audit Log (Enhanced Sprint 47) ──────────────────────────────
  audit: router({
    list: publicProcedure
      .input(z.object({
        limit: z.number().optional(),
        entityType: z.string().optional(),
        action: z.string().optional(),
        startDate: z.date().optional(),
        endDate: z.date().optional(),
        search: z.string().optional(),
      }).optional())
      .query(async ({ input }) => {
        return db.getAuditLogEnhanced({
          entityType: input?.entityType,
          action: input?.action,
          startDate: input?.startDate,
          endDate: input?.endDate,
          search: input?.search,
          limit: input?.limit ?? 100,
        });
      }),
  }),
  notifications: router({
    getAlerts: publicProcedure.query(async () => {
      return db.getNotificationAlerts();
    }),
    dismiss: publicProcedure
      .input(z.object({ alertId: z.string() }))
      .mutation(async ({ input }) => {
        // Dismissals are client-side only (localStorage) for now
        return { success: true, alertId: input.alertId };
      }),
  }),

  // ─── Chart Data (Enhancement G) ─────────────────────────────────────
  charts: router({
    monthlyPnl: publicProcedure
      .input(z.object({ year: z.number() }))
      .query(async ({ input }) => {
        return accounting.getMonthlyProfitAndLoss(input.year);
      }),
    monthlyBalanceSheet: publicProcedure
      .input(z.object({ year: z.number() }))
      .query(async ({ input }) => {
        return accounting.getMonthlyBalanceSheet(input.year);
      }),
  }),

  // ─── Bulk Operations (Enhancement H) ────────────────────────────────
  bulk: router({
    updateInvoiceStatus: protectedProcedure
      .input(z.object({
        ids: z.array(z.number()).min(1),
        status: z.enum(["Draft", "Sent", "Viewed", "Partial", "Paid", "Overdue", "Deposited", "Voided"]),
      }))
      .mutation(async ({ input }) => {
        return db.bulkUpdateInvoiceStatus(input.ids, input.status);
      }),
    deleteInvoices: protectedProcedure
      .input(z.object({ ids: z.array(z.number()).min(1) }))
      .mutation(async ({ input }) => {
        // Reverse journal entries for each invoice
        for (const id of input.ids) {
          try { await accounting.reverseTransactionJournalEntries("invoice", id); } catch (e) { console.warn("[Accounting] Failed to reverse invoice JE:", e); }
        }
        return db.bulkDeleteInvoices(input.ids);
      }),
    deleteExpenses: protectedProcedure
      .input(z.object({ ids: z.array(z.number()).min(1) }))
      .mutation(async ({ input }) => {
        for (const id of input.ids) {
          try { await accounting.reverseTransactionJournalEntries("expense", id); } catch (e) { console.warn("[Accounting] Failed to reverse expense JE:", e); }
        }
        return db.bulkDeleteExpenses(input.ids);
      }),
  }),

  // ─── Email Templates (Enhancement I) ────────────────────────────────
  emailTemplates: router({
    list: publicProcedure
      .input(z.object({ type: z.string().optional() }).optional())
      .query(async ({ input }) => {
        return db.getEmailTemplates(input ?? undefined);
      }),
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return db.getEmailTemplateById(input.id);
      }),
    create: protectedProcedure
      .input(z.object({
        name: z.string().min(1),
        type: z.enum(["invoice", "estimate", "payment_receipt", "payment_reminder"]),
        subject: z.string().min(1),
        body: z.string().min(1),
        isDefault: z.boolean().optional(),
      }))
      .mutation(async ({ input }) => {
        return db.createEmailTemplate(input);
      }),
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().optional(),
        type: z.enum(["invoice", "estimate", "payment_receipt", "payment_reminder"]).optional(),
        subject: z.string().optional(),
        body: z.string().optional(),
        isDefault: z.boolean().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        return db.updateEmailTemplate(id, data);
      }),
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteEmailTemplate(input.id);
        return { success: true };
      }),
  }),
  // ─── Multi-Currency Conversion (Enhancement K) ─────────────────────
  currency: router({
    convert: publicProcedure
      .input(z.object({
        amount: z.string(),
        fromCurrency: z.string(),
        toCurrency: z.string(),
      }))
      .query(async ({ input }) => {
        return db.convertAmount(input.amount, input.fromCurrency, input.toCurrency);
      }),
    getRate: publicProcedure
      .input(z.object({
        fromCurrency: z.string(),
        toCurrency: z.string(),
      }))
      .query(async ({ input }) => {
        return db.getLatestExchangeRate(input.fromCurrency, input.toCurrency);
      }),
  }),
});

export type AppRouter = typeof appRouter;
