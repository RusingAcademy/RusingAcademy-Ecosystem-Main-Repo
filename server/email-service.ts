/**
 * Email Service Configuration
 * 
 * This module provides email sending capabilities using either:
 * 1. SMTP (for production with services like SendGrid, Mailgun, Amazon SES, etc.)
 * 2. Console logging (for development/testing)
 * 
 * Configuration is done via environment variables:
 * - SMTP_HOST: SMTP server hostname (e.g., smtp.sendgrid.net)
 * - SMTP_PORT: SMTP server port (typically 587 for TLS, 465 for SSL)
 * - SMTP_USER: SMTP username/API key
 * - SMTP_PASS: SMTP password/API secret
 * - SMTP_FROM: Default sender email address
 * - SMTP_FROM_NAME: Default sender name
 * - SMTP_SECURE: Use SSL (true) or TLS (false, default)
 */

import nodemailer from 'nodemailer';
import { createLogger } from "./logger";
import { retry } from "./resilience";
import { logEmailToDb } from "./db";
const log = createLogger("email-service");

// Email configuration from environment
interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  from: string;
  fromName: string;
}

// Get email configuration from environment
function getEmailConfig(): EmailConfig | null {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  
  if (!host || !user || !pass) {
    return null;
  }
  
  return {
    host,
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: process.env.SMTP_SECURE === 'true',
    user,
    pass,
    from: process.env.SMTP_FROM || 'noreply@rusingacademy.ca',
    fromName: process.env.SMTP_FROM_NAME || 'Lingueefy',
  };
}

// Create transporter (cached)
let transporter: nodemailer.Transporter | null = null;

function getTransporter(): nodemailer.Transporter | null {
  if (transporter) return transporter;
  
  const config = getEmailConfig();
  if (!config) return null;
  
  transporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: {
      user: config.user,
      pass: config.pass,
    },
  });
  
  return transporter;
}

// Email attachment interface
export interface EmailAttachment {
  filename: string;
  content: string | Buffer;
  contentType?: string;
  encoding?: 'base64' | 'utf-8';
}

// Email parameters interface
export interface EmailParams {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  attachments?: EmailAttachment[];
  replyTo?: string;
  cc?: string | string[];
  bcc?: string | string[];
}

// Email result interface
export interface EmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

/**
 * Send an email using configured SMTP or log to console
 */
export async function sendEmailViaSMTP(params: EmailParams): Promise<EmailResult> {
  const config = getEmailConfig();
  const transport = getTransporter();
  
  // If no SMTP configured, log to console (development mode)
  if (!config || !transport) {
    log.info('\n========== EMAIL (Development Mode) ==========');
    log.info(`To: ${Array.isArray(params.to) ? params.to.join(', ') : params.to}`);
    log.info(`Subject: ${params.subject}`);
    log.info('---------- Content ----------');
    log.info(params.text || 'HTML content only');
    log.info('============================================\n');
    
    const devMessageId = `dev-${Date.now()}`;
    // Log to DB even in dev mode
    const toEmail = Array.isArray(params.to) ? params.to[0] : params.to;
    logEmailToDb({
      toEmail,
      type: (params as any).emailType || "welcome",
      subject: params.subject,
      status: "sent",
      providerMessageId: devMessageId,
    }).catch(() => {});
    
    return {
      success: true,
      messageId: devMessageId,
    };
  }
  
  try {
    // Prepare attachments for nodemailer
    const attachments = params.attachments?.map(att => ({
      filename: att.filename,
      content: att.content,
      contentType: att.contentType,
      encoding: att.encoding,
    }));
    
    // Send email
    const result = await retry.email(() => transport.sendMail({
      from: `"${config.fromName}" <${config.from}>`,
      to: params.to,
      cc: params.cc,
      bcc: params.bcc,
      replyTo: params.replyTo,
      subject: params.subject,
      text: params.text,
      html: params.html,
      attachments,
    }), "sendMail");
    
    log.info(`[Email] Sent successfully to ${params.to}: ${params.subject} (ID: ${result.messageId})`);
    
    // Log successful send to DB
    const toEmailProd = Array.isArray(params.to) ? params.to[0] : params.to;
    logEmailToDb({
      toEmail: toEmailProd,
      type: (params as any).emailType || "welcome",
      subject: params.subject,
      status: "sent",
      providerMessageId: result.messageId,
    }).catch(() => {});
    
    return {
      success: true,
      messageId: result.messageId,
    };
  } catch (error: any) {
    log.error(`[Email] Failed to send to ${params.to}:`, error.message);
    
    // Log failed send to DB
    const toEmailFail = Array.isArray(params.to) ? params.to[0] : params.to;
    logEmailToDb({
      toEmail: toEmailFail,
      type: (params as any).emailType || "welcome",
      subject: params.subject,
      status: "failed",
      errorMessage: error.message,
    }).catch(() => {});
    
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Verify SMTP connection
 */
export async function verifyEmailConnection(): Promise<{ connected: boolean; error?: string }> {
  const transport = getTransporter();
  
  if (!transport) {
    return {
      connected: false,
      error: 'SMTP not configured. Set SMTP_HOST, SMTP_USER, and SMTP_PASS environment variables.',
    };
  }
  
  try {
    await transport.verify();
    return { connected: true };
  } catch (error: any) {
    return {
      connected: false,
      error: error.message,
    };
  }
}

/**
 * Get email service status
 */
export function getEmailServiceStatus(): {
  configured: boolean;
  provider?: string;
  from?: string;
} {
  const config = getEmailConfig();
  
  if (!config) {
    return { configured: false };
  }
  
  // Detect provider from host
  let provider = 'Custom SMTP';
  if (config.host.includes('sendgrid')) provider = 'SendGrid';
  else if (config.host.includes('mailgun')) provider = 'Mailgun';
  else if (config.host.includes('amazonaws') || config.host.includes('ses')) provider = 'Amazon SES';
  else if (config.host.includes('postmark')) provider = 'Postmark';
  else if (config.host.includes('mailchimp') || config.host.includes('mandrill')) provider = 'Mailchimp/Mandrill';
  else if (config.host.includes('resend')) provider = 'Resend';
  else if (config.host.includes('smtp.gmail')) provider = 'Gmail';
  else if (config.host.includes('outlook') || config.host.includes('office365')) provider = 'Microsoft 365';
  
  return {
    configured: true,
    provider,
    from: `${config.fromName} <${config.from}>`,
  };
}

// Re-export for backward compatibility
export { sendEmailViaSMTP as sendEmail };
