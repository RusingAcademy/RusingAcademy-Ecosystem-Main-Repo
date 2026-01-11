/**
 * Send Test Email Script
 * 
 * Usage: node scripts/send-test-email.mjs <recipient_email>
 */

import nodemailer from 'nodemailer';

const recipient = process.argv[2] || 'admin@rusingacademy.ca';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587', 10),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background: #f5f5f5; }
    .container { max-width: 600px; margin: 0 auto; background: white; }
    .header { background: linear-gradient(135deg, #0d9488 0%, #14b8a6 100%); color: white; padding: 40px 30px; text-align: center; }
    .header h1 { margin: 0; font-size: 28px; font-weight: 700; }
    .header p { margin: 10px 0 0; opacity: 0.9; }
    .content { padding: 40px 30px; }
    .success-box { background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%); border-left: 4px solid #10b981; padding: 20px; border-radius: 8px; margin: 20px 0; }
    .success-box h2 { color: #065f46; margin: 0 0 10px; font-size: 18px; }
    .info-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    .info-table td { padding: 12px; border-bottom: 1px solid #e5e7eb; }
    .info-table td:first-child { font-weight: 600; color: #6b7280; width: 40%; }
    .footer { background: #1f2937; color: #9ca3af; padding: 30px; text-align: center; font-size: 14px; }
    .footer a { color: #14b8a6; text-decoration: none; }
    .logo { font-size: 24px; font-weight: bold; margin-bottom: 10px; }
    .logo span { color: #f97316; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">Rusing<span>Âcademy</span></div>
      <h1>✉️ Email Test Successful!</h1>
      <p>Your SMTP configuration is working perfectly</p>
    </div>
    <div class="content">
      <div class="success-box">
        <h2>✓ Configuration Verified</h2>
        <p>This email confirms that your Lingueefy platform can successfully send emails through your SMTP server.</p>
      </div>
      
      <h3>📧 Email Configuration Details</h3>
      <table class="info-table">
        <tr>
          <td>SMTP Server</td>
          <td>smtp.gmail.com</td>
        </tr>
        <tr>
          <td>Sender Email</td>
          <td>steven.barholere@rusingacademy.ca</td>
        </tr>
        <tr>
          <td>Recipient</td>
          <td>${recipient}</td>
        </tr>
        <tr>
          <td>Timestamp</td>
          <td>${new Date().toLocaleString('en-CA', { timeZone: 'America/Toronto' })} (ET)</td>
        </tr>
      </table>
      
      <h3>🚀 What's Next?</h3>
      <p>Your platform is now ready to send:</p>
      <ul>
        <li>Account verification emails</li>
        <li>Password reset links</li>
        <li>Booking confirmations with calendar invites</li>
        <li>Session reminders (24h and 1h before)</li>
        <li>Weekly progress reports</li>
        <li>Subscription confirmations</li>
      </ul>
    </div>
    <div class="footer">
      <p><strong>Powered by Rusinga International Consulting Ltd. (RusingÂcademy)</strong></p>
      <p>© 2026 All rights reserved</p>
      <p><a href="https://lingueefy.com">lingueefy.com</a> | <a href="https://rusingacademy.ca">rusingacademy.ca</a></p>
    </div>
  </div>
</body>
</html>
`;

const textContent = `
Email Test Successful!
======================

Your SMTP configuration is working perfectly.

Configuration Details:
- SMTP Server: smtp.gmail.com
- Sender: steven.barholere@rusingacademy.ca
- Recipient: ${recipient}
- Timestamp: ${new Date().toLocaleString('en-CA', { timeZone: 'America/Toronto' })} (ET)

Your platform is now ready to send:
- Account verification emails
- Password reset links
- Booking confirmations with calendar invites
- Session reminders (24h and 1h before)
- Weekly progress reports
- Subscription confirmations

--
Powered by Rusinga International Consulting Ltd. (RusingÂcademy)
© 2026 All rights reserved
`;

async function sendTestEmail() {
  console.log(`\n📧 Sending test email to: ${recipient}`);
  console.log(`📤 From: ${process.env.SMTP_USER}`);
  console.log(`🔧 SMTP Host: ${process.env.SMTP_HOST || 'smtp.gmail.com'}`);
  
  try {
    const result = await transporter.sendMail({
      from: `"RusingÂcademy" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
      to: recipient,
      subject: '✅ Lingueefy Email Test - Configuration Successful!',
      text: textContent,
      html: htmlContent,
    });
    
    console.log(`\n✅ Email sent successfully!`);
    console.log(`📬 Message ID: ${result.messageId}`);
    console.log(`\nPlease check your inbox at ${recipient}`);
  } catch (error) {
    console.error(`\n❌ Failed to send email:`, error.message);
    process.exit(1);
  }
}

sendTestEmail();
