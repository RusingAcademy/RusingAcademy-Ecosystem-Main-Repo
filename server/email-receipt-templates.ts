import { sendEmail } from "./email";
import { EMAIL_BRANDING, generateEmailFooter } from "./email-branding";

interface ReceiptEmailParams {
  to: string;
  name: string;
  orderId: string;
  date: string;
  items: Array<{ name: string; quantity: number; price: number; }>, // price in cents
  subtotal: number; // in cents
  taxAmount: number; // in cents
  total: number; // in cents
  currency: string;
  language?: "en" | "fr";
}

export async function sendReceiptEmail(params: ReceiptEmailParams): Promise<boolean> {
  const { to, name, orderId, date, items, subtotal, taxAmount, total, currency, language = "en" } = params;

  const labels = language === "fr" ? {
    subject: `Votre reçu RusingAcademy - Commande #${orderId}`,
    greeting: `Bonjour ${name},`,
    intro: "Merci pour votre achat chez RusingAcademy! Voici le récapitulatif de votre commande.",
    orderSummary: "Récapitulatif de la commande",
    item: "Article",
    quantity: "Quantité",
    price: "Prix",
    subtotalLabel: "Sous-total",
    taxLabel: "Taxes",
    totalLabel: "Total",
    viewOrder: "Voir ma commande",
    footer: "Besoin d'aide? Contactez-nous à support@rusingacademy.ca",
  } : {
    subject: `Your RusingAcademy Receipt - Order #${orderId}`,
    greeting: `Hello ${name},`,
    intro: "Thank you for your purchase from RusingAcademy! Here's a summary of your order.",
    orderSummary: "Order Summary",
    item: "Item",
    quantity: "Quantity",
    price: "Price",
    subtotalLabel: "Subtotal",
    taxLabel: "Taxes",
    totalLabel: "Total",
    viewOrder: "View My Order",
    footer: "Need help? Contact us at support@rusingacademy.ca",
  };

  const formatAmount = (amount: number) => (amount / 100).toFixed(2);

  const itemRows = items.map(item => `
    <tr>
      <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${item.name}</td>
      <td style="padding: 8px 0; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
      <td style="padding: 8px 0; border-bottom: 1px solid #eee; text-align: right;">${currency} ${formatAmount(item.price)}</td>
    </tr>
  `).join('');

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background: #f5f5f5; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #0d9488 0%, #14b8a6 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: white; padding: 30px; border-radius: 0 0 8px 8px; }
    .button { display: inline-block; background: #0d9488; color: white !important; padding: 14px 28px; text-decoration: none; border-radius: 6px; margin: 20px 0; font-weight: 600; }
    .button:hover { background: #0f766e; }
    .footer { text-align: center; color: #6b7280; font-size: 14px; margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb; }
    .legal { text-align: center; color: #9ca3af; font-size: 12px; margin-top: 20px; }
    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
    th, td { text-align: left; padding: 8px 0; }
    th { border-bottom: 2px solid #eee; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="${EMAIL_BRANDING.logos.banner}" alt="RusingAcademy" style="max-width: 180px; height: auto; margin-bottom: 15px;" />
      <h1 style="margin: 0; font-size: 24px;">🧾 ${language === "fr" ? "Votre Reçu" : "Your Receipt"}</h1>
    </div>
    <div class="content">
      <p>${labels.greeting}</p>
      <p>${labels.intro}</p>
      
      <p><strong>${labels.orderSummary}</strong></p>
      <p><strong>Commande #:</strong> ${orderId}</p>
      <p><strong>Date:</strong> ${date}</p>

      <table>
        <thead>
          <tr>
            <th style="width: 60%;">${labels.item}</th>
            <th style="width: 15%; text-align: center;">${labels.quantity}</th>
            <th style="width: 25%; text-align: right;">${labels.price}</th>
          </tr>
        </thead>
        <tbody>
          ${itemRows}
          <tr>
            <td colspan="2" style="padding: 8px 0; text-align: right; font-weight: 600;">${labels.subtotalLabel}:</td>
            <td style="padding: 8px 0; text-align: right; font-weight: 600;">${currency} ${formatAmount(subtotal)}</td>
          </tr>
          <tr>
            <td colspan="2" style="padding: 8px 0; text-align: right; font-weight: 600;">${labels.taxLabel}:</td>
            <td style="padding: 8px 0; text-align: right; font-weight: 600;">${currency} ${formatAmount(taxAmount)}</td>
          </tr>
          <tr style="border-top: 2px solid #0d9488;">
            <td colspan="2" style="padding: 15px 0 8px; text-align: right; font-weight: 700; font-size: 1.1em;">${labels.totalLabel}:</td>
            <td style="padding: 15px 0 8px; text-align: right; font-weight: 700; font-size: 1.1em; color: #0d9488;">${currency} ${formatAmount(total)}</td>
          </tr>
        </tbody>
      </table>
      
      <div style="text-align: center;">
        <a href="https://www.rusingacademy.ca/dashboard/orders/${orderId}" class="button">${labels.viewOrder}</a>
      </div>
      
      <div class="footer">
        <p>${labels.footer}</p>
      </div>
      
      <div class="legal">
        <p>© ${new Date().getFullYear()} Rusinga International Consulting Ltd. (RusingAcademy)</p>
      </div>
    </div>
  </div>
</body>
</html>
  `;

  const text = `
${labels.greeting}

${labels.intro}

${labels.orderSummary}
Commande #: ${orderId}
Date: ${date}

Articles:
${items.map(item => `- ${item.name} (x${item.quantity}): ${currency} ${formatAmount(item.price)}`).join('\n')}

${labels.subtotalLabel}: ${currency} ${formatAmount(subtotal)}
${labels.taxLabel}: ${currency} ${formatAmount(taxAmount)}
${labels.totalLabel}: ${currency} ${formatAmount(total)}

${labels.viewOrder}: https://www.rusingacademy.ca/dashboard/orders/${orderId}

${labels.footer}

© ${new Date().getFullYear()} Rusinga International Consulting Ltd. (RusingAcademy)
  `;

  return sendEmail({
    to,
    subject: labels.subject,
    html,
    text,
  });
}
