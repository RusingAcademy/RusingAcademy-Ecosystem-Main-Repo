import { describe, it, expect, vi } from "vitest";
import { sendReceiptEmail } from "./email-receipt-templates";
import { sendEmail } from "./email";

// Mock the sendEmail function
vi.mock("./email", () => ({
  sendEmail: vi.fn(() => Promise.resolve(true)),
}));

describe("Email Receipt Templates", () => {
  it("should send a receipt email in English", async () => {
    const result = await sendReceiptEmail({
      to: "test@example.com",
      name: "Test User",
      orderId: "ORDER123",
      date: "January 12, 2026",
      items: [
        { name: "Course A", quantity: 1, price: 5000 },
        { name: "Course B", quantity: 2, price: 2500 },
      ],
      subtotal: 10000,
      taxAmount: 1000,
      total: 11000,
      currency: "CAD",
      language: "en",
    });

    expect(result).toBe(true);
    expect(sendEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        to: "test@example.com",
        subject: expect.stringContaining("Your RusingAcademy Receipt - Order #ORDER123"),
        html: expect.stringContaining("Course A"),
        text: expect.stringContaining("Course B"),
      })
    );
  });

  it("should send a receipt email in French", async () => {
    const result = await sendReceiptEmail({
      to: "test@example.com",
      name: "Utilisateur Test",
      orderId: "COMMANDE456",
      date: "12 janvier 2026",
      items: [
        { name: "Cours C", quantity: 1, price: 7500 },
      ],
      subtotal: 7500,
      taxAmount: 750,
      total: 8250,
      currency: "CAD",
      language: "fr",
    });

    expect(result).toBe(true);
    expect(sendEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        to: "test@example.com",
        subject: expect.stringContaining("Votre reçu RusingAcademy - Commande #COMMANDE456"),
        html: expect.stringContaining("Cours C"),
        text: expect.stringContaining("Cours C"),
      })
    );
  });
});
