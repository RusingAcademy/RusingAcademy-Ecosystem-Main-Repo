/**
 * Centralized Email Module
 * 
 * Provides a unified interface for sending emails across the ecosystem.
 * Supports multiple providers:
 * 1. SMTP (default, using nodemailer)
 * 2. Resend (optional, if RESEND_API_KEY is set)
 * 
 * All emails are sent with proper branding and comply with PIPEDA requirements.
 */

import nodemailer from 'nodemailer';

// ============================================================================
// Configuration
// ============================================================================

interface EmailConfig {
  provider: 'smtp' | 'resend' | 'console';
  smtp?: {
    host: string;
    port: number;
    secure: boolean;
    user: string;
    pass: string;
  };
  resendApiKey?: string;
  from: string;
  fromName: string;
  replyTo?: string;
}

function getEmailConfig(): EmailConfig {
  const smtpHost = process.env.SMTP_HOST;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const resendApiKey = process.env.RESEND_API_KEY;

  // Determine provider
  let provider: EmailConfig['provider'] = 'console';
  
  if (resendApiKey) {
    provider = 'resend';
  } else if (smtpHost && smtpUser && smtpPass) {
    provider = 'smtp';
  }

  return {
    provider,
    smtp: smtpHost ? {
      host: smtpHost,
      port: parseInt(process.env.SMTP_PORT || '587', 10),
      secure: process.env.SMTP_SECURE === 'true',
      user: smtpUser || '',
      pass: smtpPass || '',
    } : undefined,
    resendApiKey,
    from: process.env.SMTP_FROM || process.env.EMAIL_FROM || 'noreply@rusingacademy.ca',
    fromName: process.env.SMTP_FROM_NAME || 'RusingÂcademy',
    replyTo: process.env.EMAIL_REPLY_TO || 'support@rusingacademy.ca',
  };
}

// ============================================================================
// Email Interface
// ============================================================================

export interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  from?: string;
  fromName?: string;
  replyTo?: string;
  attachments?: Array<{
    filename: string;
    content: string | Buffer;
    contentType?: string;
  }>;
  tags?: Record<string, string>;
}

export interface EmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

// ============================================================================
// SMTP Provider
// ============================================================================

let smtpTransporter: nodemailer.Transporter | null = null;

function getSmtpTransporter(): nodemailer.Transporter | null {
  if (smtpTransporter) return smtpTransporter;

  const config = getEmailConfig();
  if (!config.smtp) return null;

  smtpTransporter = nodemailer.createTransport({
    host: config.smtp.host,
    port: config.smtp.port,
    secure: config.smtp.secure,
    auth: {
      user: config.smtp.user,
      pass: config.smtp.pass,
    },
  });

  return smtpTransporter;
}

async function sendViaSMTP(options: EmailOptions): Promise<EmailResult> {
  const transporter = getSmtpTransporter();
  if (!transporter) {
    return { success: false, error: 'SMTP not configured' };
  }

  const config = getEmailConfig();
  const from = `${options.fromName || config.fromName} <${options.from || config.from}>`;

  try {
    const result = await transporter.sendMail({
      from,
      to: Array.isArray(options.to) ? options.to.join(', ') : options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
      replyTo: options.replyTo || config.replyTo,
      attachments: options.attachments,
    });

    return {
      success: true,
      messageId: result.messageId,
    };
  } catch (error) {
    console.error('[Email] SMTP send failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// ============================================================================
// Resend Provider
// ============================================================================

async function sendViaResend(options: EmailOptions): Promise<EmailResult> {
  const config = getEmailConfig();
  if (!config.resendApiKey) {
    return { success: false, error: 'Resend not configured' };
  }

  const from = `${options.fromName || config.fromName} <${options.from || config.from}>`;

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: Array.isArray(options.to) ? options.to : [options.to],
        subject: options.subject,
        html: options.html,
        text: options.text,
        reply_to: options.replyTo || config.replyTo,
        tags: options.tags ? Object.entries(options.tags).map(([name, value]) => ({ name, value })) : undefined,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Resend API error: ${error}`);
    }

    const data = await response.json();
    return {
      success: true,
      messageId: data.id,
    };
  } catch (error) {
    console.error('[Email] Resend send failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// ============================================================================
// Console Provider (Development)
// ============================================================================

async function sendViaConsole(options: EmailOptions): Promise<EmailResult> {
  console.log('[Email] Console mode - Email would be sent:');
  console.log(`  To: ${Array.isArray(options.to) ? options.to.join(', ') : options.to}`);
  console.log(`  Subject: ${options.subject}`);
  console.log(`  From: ${options.fromName || 'RusingÂcademy'} <${options.from || 'noreply@rusingacademy.ca'}>`);
  console.log('  ---');
  console.log(options.text || 'HTML content (not shown in console)');
  
  return {
    success: true,
    messageId: `console_${Date.now()}`,
  };
}

// ============================================================================
// Main Send Function
// ============================================================================

/**
 * Send an email using the configured provider
 */
export async function sendEmail(options: EmailOptions): Promise<EmailResult> {
  const config = getEmailConfig();

  // Log email send attempt (without PII)
  console.log(`[Email] Sending email via ${config.provider}: "${options.subject}"`);

  switch (config.provider) {
    case 'resend':
      return sendViaResend(options);
    case 'smtp':
      return sendViaSMTP(options);
    case 'console':
    default:
      return sendViaConsole(options);
  }
}

/**
 * Test email configuration by sending a test email
 */
export async function testEmailConfiguration(testEmail: string): Promise<EmailResult> {
  return sendEmail({
    to: testEmail,
    subject: 'RusingÂcademy Email Configuration Test',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2563eb;">Email Configuration Test</h1>
        <p>This is a test email from the RusingÂcademy ecosystem.</p>
        <p>If you received this email, your email configuration is working correctly.</p>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
        <p style="color: #6b7280; font-size: 12px;">
          © 2026 Rusinga International Consulting Ltd.
        </p>
      </div>
    `,
    text: 'Email Configuration Test\n\nThis is a test email from the RusingÂcademy ecosystem.\nIf you received this email, your email configuration is working correctly.',
  });
}

/**
 * Get current email provider status
 */
export function getEmailProviderStatus(): { provider: string; configured: boolean } {
  const config = getEmailConfig();
  return {
    provider: config.provider,
    configured: config.provider !== 'console',
  };
}
