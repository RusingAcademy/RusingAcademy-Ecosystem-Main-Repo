/**
 * SMTP Debug Script
 * 
 * Diagnoses SMTP configuration issues
 */

import nodemailer from 'nodemailer';

console.log('=== SMTP Configuration Debug ===\n');

// Show current configuration (masked password)
console.log('Current Environment Variables:');
console.log(`  SMTP_HOST: ${process.env.SMTP_HOST || '(not set)'}`);
console.log(`  SMTP_PORT: ${process.env.SMTP_PORT || '(not set, default 587)'}`);
console.log(`  SMTP_USER: ${process.env.SMTP_USER || '(not set)'}`);
console.log(`  SMTP_PASS: ${process.env.SMTP_PASS ? '****' + process.env.SMTP_PASS.slice(-4) : '(not set)'}`);
console.log(`  SMTP_FROM: ${process.env.SMTP_FROM || '(not set)'}`);
console.log('');

// Check if credentials are set
if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
  console.error('❌ ERROR: SMTP_USER or SMTP_PASS not set!');
  process.exit(1);
}

// Create transporter with debug enabled
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587', 10),
  secure: false, // TLS
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  debug: true, // Enable debug output
  logger: true, // Log to console
});

console.log('\n=== Testing SMTP Connection ===\n');

try {
  // Verify connection
  await transporter.verify();
  console.log('\n✅ SMTP Connection verified successfully!\n');
  
  // Try sending a simple test email
  console.log('=== Sending Test Email ===\n');
  
  const result = await transporter.sendMail({
    from: `"Test" <${process.env.SMTP_USER}>`,
    to: 'stevenmwema@gmail.com',
    subject: 'SMTP Debug Test - ' + new Date().toISOString(),
    text: 'This is a debug test email from Lingueefy SMTP configuration.',
    html: '<p>This is a <strong>debug test email</strong> from Lingueefy SMTP configuration.</p><p>Time: ' + new Date().toISOString() + '</p>',
  });
  
  console.log('\n✅ Email sent!');
  console.log('Message ID:', result.messageId);
  console.log('Response:', result.response);
  console.log('Accepted:', result.accepted);
  console.log('Rejected:', result.rejected);
  
} catch (error) {
  console.error('\n❌ SMTP Error:', error.message);
  console.error('Full error:', error);
  
  if (error.code === 'EAUTH') {
    console.log('\n💡 Authentication failed. Possible causes:');
    console.log('   1. Wrong app password');
    console.log('   2. App password has spaces (should be 16 chars without spaces)');
    console.log('   3. 2FA not enabled on the Google account');
    console.log('   4. App password was revoked');
  }
}
