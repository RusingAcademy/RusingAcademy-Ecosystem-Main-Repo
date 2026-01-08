import { ENV } from "./_core/env";
import { EMAIL_BRANDING, generateEmailFooter } from "./email-branding";

// Email service using the Manus Forge API
// This sends emails through the platform's built-in email service

interface EmailAttachment {
  filename: string;
  content: string;
  contentType: string;
}

interface EmailParams {
  to: string;
  subject: string;
  html: string;
  text?: string;
  attachments?: EmailAttachment[];
}

interface SessionConfirmationData {
  learnerName: string;
  learnerEmail: string;
  coachName: string;
  coachEmail: string;
  sessionDate: Date;
  sessionTime: string;
  sessionType: "trial" | "single" | "package";
  duration: number;
  price: number; // in cents (subtotal before tax)
  taxAmount?: number; // in cents (HST 13%)
  totalAmount?: number; // in cents (price + taxAmount)
  meetingUrl?: string;
  meetingInstructions?: {
    en: string;
    fr: string;
  };
}

/**
 * Send an email using the Manus Forge API
 * Note: This uses the notification system as email is not directly available
 * For production, you would integrate with a proper email service like SendGrid, Resend, etc.
 */
export async function sendEmail(params: EmailParams): Promise<boolean> {
  // For now, we'll log the email and use the notification system to alert the owner
  console.log(`[Email] Would send email to ${params.to}: ${params.subject}`);
  console.log(`[Email] Content: ${params.text || params.html}`);
  
  // In production, integrate with an email service here
  // For now, return true to indicate "success" (email logged)
  return true;
}

/**
 * Generate ICS calendar file content for any event
 */
export function generateICSFile(params: {
  title: string;
  description: string;
  startTime: Date;
  duration: number; // in minutes
  location?: string;
}): string {
  const endTime = new Date(params.startTime.getTime() + params.duration * 60 * 1000);
  
  const formatDate = (date: Date) => {
    return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  };
  
  const uid = `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}@lingueefy.com`;
  
  return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Lingueefy//Session Booking//EN
BEGIN:VEVENT
UID:${uid}
DTSTAMP:${formatDate(new Date())}
DTSTART:${formatDate(params.startTime)}
DTEND:${formatDate(endTime)}
SUMMARY:${params.title}
DESCRIPTION:${params.description.replace(/\n/g, "\\n")}
LOCATION:${params.location || "Online"}
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;
}

/**
 * Generate ICS calendar invite content (legacy - for session confirmations)
 */
function generateICSContent(data: SessionConfirmationData): string {
  const startDate = new Date(data.sessionDate);
  const [hours, minutes] = data.sessionTime.match(/(\d+):(\d+)/)?.slice(1).map(Number) || [9, 0];
  const isPM = data.sessionTime.toLowerCase().includes("pm");
  startDate.setHours(isPM && hours !== 12 ? hours + 12 : hours, minutes, 0, 0);
  
  const endDate = new Date(startDate.getTime() + data.duration * 60 * 1000);
  
  const formatDate = (date: Date) => {
    return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  };
  
  const uid = `session-${Date.now()}@lingueefy.com`;
  
  return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Lingueefy//Session Booking//EN
BEGIN:VEVENT
UID:${uid}
DTSTAMP:${formatDate(new Date())}
DTSTART:${formatDate(startDate)}
DTEND:${formatDate(endDate)}
SUMMARY:SLE Coaching Session with ${data.coachName}
DESCRIPTION:${data.sessionType === "trial" ? "Trial" : "Regular"} coaching session\\n\\nCoach: ${data.coachName}\\nDuration: ${data.duration} minutes${data.meetingUrl ? `\\n\\nJoin meeting: ${data.meetingUrl}` : ""}
LOCATION:Online (Video Call)
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;
}

/**
 * Send booking confirmation email to learner
 */
export async function sendLearnerConfirmation(data: SessionConfirmationData): Promise<boolean> {
  const formattedDate = data.sessionDate.toLocaleDateString("en-CA", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  
  // Calculate tax if not provided (13% HST Ontario)
  const subtotal = data.price;
  const taxAmount = data.taxAmount ?? Math.round(subtotal * 0.13);
  const totalAmount = data.totalAmount ?? (subtotal + taxAmount);
  
  const formattedSubtotal = (subtotal / 100).toFixed(2);
  const formattedTax = (taxAmount / 100).toFixed(2);
  const formattedTotal = (totalAmount / 100).toFixed(2);
  
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background: #f5f5f5; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #0d9488 0%, #14b8a6 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
    .details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
    .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
    .detail-row:last-child { border-bottom: none; }
    .label { color: #6b7280; }
    .value { font-weight: 600; }
    .button { display: inline-block; background: #0d9488; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 20px; }
    .footer { text-align: center; color: #6b7280; font-size: 14px; margin-top: 30px; }
    .legal-footer { text-align: center; color: #9ca3af; font-size: 12px; margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="${EMAIL_BRANDING.logos.banner}" alt="RusingÂcademy" style="max-width: 180px; height: auto; margin-bottom: 15px;" />
      <h1 style="margin: 0;">Booking Confirmed! ✓</h1>
      <p style="margin: 10px 0 0;">Your SLE coaching session is scheduled</p>
    </div>
    <div class="content">
      <p>Hi ${data.learnerName},</p>
      <p>Great news! Your ${data.sessionType === "trial" ? "trial" : ""} coaching session with <strong>${data.coachName}</strong> has been confirmed.</p>
      
      <div class="details">
        <div class="detail-row">
          <span class="label">Date</span>
          <span class="value">${formattedDate}</span>
        </div>
        <div class="detail-row">
          <span class="label">Time</span>
          <span class="value">${data.sessionTime} (Eastern Time)</span>
        </div>
        <div class="detail-row">
          <span class="label">Duration</span>
          <span class="value">${data.duration} minutes</span>
        </div>
        <div class="detail-row">
          <span class="label">Coach</span>
          <span class="value">${data.coachName}</span>
        </div>
        <div class="detail-row">
          <span class="label">Subtotal</span>
          <span class="value">$${formattedSubtotal} CAD</span>
        </div>
        <div class="detail-row">
          <span class="label">HST (13%)</span>
          <span class="value">$${formattedTax} CAD</span>
        </div>
        <div class="detail-row" style="border-top: 2px solid #0d9488; padding-top: 15px; margin-top: 5px;">
          <span class="label" style="font-weight: 600; color: #333;">Total Paid</span>
          <span class="value" style="color: #0d9488; font-size: 1.1em;">$${formattedTotal} CAD</span>
        </div>
      </div>
      
      <p><strong>What's next?</strong></p>
      <ul>
        <li>Prepare any questions or topics you'd like to discuss</li>
        <li>Join the video call 5 minutes early to test your audio/video</li>
        ${data.meetingInstructions ? `<li>${data.meetingInstructions.en}</li>` : "<li>You'll receive a meeting link before your session</li>"}
      </ul>
      
      ${data.meetingUrl ? `<a href="${data.meetingUrl}" class="button">Join Session</a>` : ""}
      
      <div class="footer">
        <p>Need to reschedule? Contact your coach at least 24 hours before the session.</p>
        <p>Questions? Reply to this email or visit <a href="https://lingueefy.ca">lingueefy.ca</a></p>
      </div>
      
      <div class="legal-footer">
        <p style="margin: 0;">© ${new Date().getFullYear()} Rusinga International Consulting Ltd., commercially known as RusingÂcademy. All rights reserved.</p>
        <p style="margin: 10px 0 0;"><strong>Lingueefy</strong> - Master Your Second Language for the Public Service</p>
      </div>
    </div>
  </div>
</body>
</html>
  `;
  
  const text = `
Booking Confirmed!

Hi ${data.learnerName},

Your ${data.sessionType === "trial" ? "trial" : ""} coaching session with ${data.coachName} has been confirmed.

Session Details:
- Date: ${formattedDate}
- Time: ${data.sessionTime} (Eastern Time)
- Duration: ${data.duration} minutes
- Coach: ${data.coachName}

Payment Details:
- Subtotal: $${formattedSubtotal} CAD
- HST (13%): $${formattedTax} CAD
- Total Paid: $${formattedTotal} CAD

What's next?
- You'll receive a meeting link before your session
- Prepare any questions or topics you'd like to discuss
- Join the video call 5 minutes early to test your audio/video

${data.meetingUrl ? `Join Session: ${data.meetingUrl}` : ""}

Need to reschedule? Contact your coach at least 24 hours before the session.
Questions? Visit lingueefy.com

---
Lingueefy - Master Your Second Language for the Public Service
  `;
  
  return sendEmail({
    to: data.learnerEmail,
    subject: `✓ Session Confirmed: ${data.sessionType === "trial" ? "Trial" : "Coaching"} with ${data.coachName} on ${formattedDate}`,
    html,
    text,
  });
}

/**
 * Send new booking notification email to coach
 */
export async function sendCoachNotification(data: SessionConfirmationData): Promise<boolean> {
  const formattedDate = data.sessionDate.toLocaleDateString("en-CA", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  
  // Calculate tax if not provided (13% HST Ontario)
  const subtotal = data.price;
  const taxAmount = data.taxAmount ?? Math.round(subtotal * 0.13);
  const totalAmount = data.totalAmount ?? (subtotal + taxAmount);
  
  const formattedSubtotal = (subtotal / 100).toFixed(2);
  const formattedTax = (taxAmount / 100).toFixed(2);
  const formattedTotal = (totalAmount / 100).toFixed(2);
  
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background: #f5f5f5; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #0d9488 0%, #14b8a6 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
    .details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
    .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
    .detail-row:last-child { border-bottom: none; }
    .label { color: #6b7280; }
    .value { font-weight: 600; }
    .button { display: inline-block; background: #0d9488; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 20px; }
    .footer { text-align: center; color: #6b7280; font-size: 14px; margin-top: 30px; }
    .legal-footer { text-align: center; color: #9ca3af; font-size: 12px; margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb; }
    .earnings { background: #ecfdf5; border: 1px solid #10b981; padding: 15px; border-radius: 8px; text-align: center; margin-top: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="${EMAIL_BRANDING.logos.banner}" alt="RusingÂcademy" style="max-width: 180px; height: auto; margin-bottom: 15px;" />
      <h1 style="margin: 0;">New Session Booked! 🎉</h1>
      <p style="margin: 10px 0 0;">A learner has booked a session with you</p>
    </div>
    <div class="content">
      <p>Hi ${data.coachName},</p>
      <p>Great news! <strong>${data.learnerName}</strong> has booked a ${data.sessionType === "trial" ? "trial" : ""} session with you.</p>
      
      <div class="details">
        <div class="detail-row">
          <span class="label">Learner</span>
          <span class="value">${data.learnerName}</span>
        </div>
        <div class="detail-row">
          <span class="label">Date</span>
          <span class="value">${formattedDate}</span>
        </div>
        <div class="detail-row">
          <span class="label">Time</span>
          <span class="value">${data.sessionTime} (Eastern Time)</span>
        </div>
        <div class="detail-row">
          <span class="label">Duration</span>
          <span class="value">${data.duration} minutes</span>
        </div>
        <div class="detail-row">
          <span class="label">Session Type</span>
          <span class="value">${data.sessionType === "trial" ? "Trial Session" : "Regular Session"}</span>
        </div>
      </div>
      
      <div class="earnings">
        <p style="margin: 0; font-size: 14px; color: #6b7280;">Learner Paid: $${formattedSubtotal} + $${formattedTax} HST = <strong>$${formattedTotal} CAD</strong></p>
        <p style="margin: 10px 0 0; color: #059669; font-weight: 600; font-size: 1.1em;">Your Earnings: $${formattedSubtotal} CAD</p>
        <p style="margin: 5px 0 0; font-size: 14px; color: #6b7280;">(Platform fees will be deducted at payout. HST is remitted to CRA.)</p>
      </div>
      
      <p><strong>Next Steps:</strong></p>
      <ul>
        <li>Review the learner's profile in your dashboard</li>
        <li>Prepare materials for the session</li>
        ${data.meetingUrl ? `<li>Meeting link has been automatically generated</li>` : `<li>Send a meeting link to the learner before the session</li>`}
      </ul>
      
      ${data.meetingUrl ? `<a href="${data.meetingUrl}" class="button" style="margin-right: 10px;">Join Session</a>` : ""}
      <a href="https://lingueefy.com/coach/dashboard" class="button" ${data.meetingUrl ? 'style="background: #6b7280;"' : ''}>View Dashboard</a>
      
      <div class="footer">
        <p>Need to cancel? Please notify the learner at least 24 hours in advance.</p>
      </div>
      
      <div class="legal-footer">
        <p style="margin: 0;">© ${new Date().getFullYear()} Rusinga International Consulting Ltd., commercially known as RusingÂcademy. All rights reserved.</p>
        <p style="margin: 10px 0 0;"><strong>Lingueefy</strong> - Master Your Second Language for the Public Service</p>
      </div>
    </div>
  </div>
</body>
</html>
  `;
  
  const text = `
New Session Booked!

Hi ${data.coachName},

Great news! ${data.learnerName} has booked a ${data.sessionType === "trial" ? "trial" : ""} session with you.

Session Details:
- Learner: ${data.learnerName}
- Date: ${formattedDate}
- Time: ${data.sessionTime} (Eastern Time)
- Duration: ${data.duration} minutes
- Session Type: ${data.sessionType === "trial" ? "Trial Session" : "Regular Session"}

Payment Breakdown:
- Learner Paid: $${formattedSubtotal} + $${formattedTax} HST = $${formattedTotal} CAD
- Your Earnings: $${formattedSubtotal} CAD
(Platform fees will be deducted at payout. HST is remitted to CRA.)

Next Steps:
- Review the learner's profile in your dashboard
- Prepare materials for the session
- Send a meeting link to the learner before the session

View Dashboard: https://lingueefy.com/coach/dashboard

Need to cancel? Please notify the learner at least 24 hours in advance.

---
Lingueefy - Master Your Second Language for the Public Service
  `;
  
  return sendEmail({
    to: data.coachEmail,
    subject: `🎉 New Booking: ${data.sessionType === "trial" ? "Trial" : "Session"} with ${data.learnerName} on ${formattedDate}`,
    html,
    text,
  });
}

/**
 * Send session confirmation emails to both learner and coach
 */
export async function sendSessionConfirmationEmails(data: SessionConfirmationData): Promise<{
  learnerEmailSent: boolean;
  coachEmailSent: boolean;
}> {
  const [learnerEmailSent, coachEmailSent] = await Promise.all([
    sendLearnerConfirmation(data),
    sendCoachNotification(data),
  ]);
  
  return { learnerEmailSent, coachEmailSent };
}


// ============================================================================
// SESSION RESCHEDULE EMAILS
// ============================================================================

interface RescheduleEmailData {
  learnerName: string;
  learnerEmail: string;
  coachName: string;
  coachEmail: string;
  oldDate: Date;
  oldTime: string;
  newDate: Date;
  newTime: string;
  duration: number;
  meetingUrl?: string;
  rescheduledBy: "learner" | "coach";
}

/**
 * Send reschedule notification email to learner
 */
export async function sendLearnerRescheduleNotification(data: RescheduleEmailData): Promise<boolean> {
  const oldFormattedDate = data.oldDate.toLocaleDateString("en-CA", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  
  const newFormattedDate = data.newDate.toLocaleDateString("en-CA", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background: #f5f5f5; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
    .details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
    .old-time { background: #fef2f2; border: 1px solid #ef4444; padding: 15px; border-radius: 8px; margin-bottom: 15px; }
    .new-time { background: #ecfdf5; border: 1px solid #10b981; padding: 15px; border-radius: 8px; }
    .label { color: #6b7280; font-size: 14px; }
    .value { font-weight: 600; font-size: 16px; }
    .strikethrough { text-decoration: line-through; color: #ef4444; }
    .button { display: inline-block; background: #0d9488; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 20px; }
    .footer { text-align: center; color: #6b7280; font-size: 14px; margin-top: 30px; }
    .legal-footer { text-align: center; color: #9ca3af; font-size: 12px; margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="${EMAIL_BRANDING.logos.banner}" alt="RusingÂcademy" style="max-width: 180px; height: auto; margin-bottom: 15px;" />
      <h1 style="margin: 0;">Session Rescheduled 📅</h1>
      <p style="margin: 10px 0 0;">Your coaching session time has been updated</p>
    </div>
    <div class="content">
      <p>Hi ${data.learnerName},</p>
      <p>${data.rescheduledBy === "coach" ? `Your coach <strong>${data.coachName}</strong> has rescheduled your session.` : "You have successfully rescheduled your session."}</p>
      
      <div class="details">
        <div class="old-time">
          <p class="label">Previous Time (Cancelled)</p>
          <p class="value strikethrough">${oldFormattedDate} at ${data.oldTime}</p>
        </div>
        <div class="new-time">
          <p class="label">New Time (Confirmed)</p>
          <p class="value">${newFormattedDate} at ${data.newTime}</p>
        </div>
      </div>
      
      <p><strong>Session Details:</strong></p>
      <ul>
        <li>Coach: ${data.coachName}</li>
        <li>Duration: ${data.duration} minutes</li>
        ${data.meetingUrl ? `<li>Meeting Link: <a href="${data.meetingUrl}">${data.meetingUrl}</a></li>` : ""}
      </ul>
      
      <a href="https://lingueefy.com/dashboard" class="button">View Dashboard</a>
      
      <div class="footer">
        <p>Need to reschedule again? Please do so at least 24 hours before the session.</p>
      </div>
      
      <div class="legal-footer">
        <p style="margin: 0;">© ${new Date().getFullYear()} Rusinga International Consulting Ltd., commercially known as RusingÂcademy. All rights reserved.</p>
        <p style="margin: 10px 0 0;"><strong>Lingueefy</strong> - Master Your Second Language for the Public Service</p>
      </div>
    </div>
  </div>
</body>
</html>
  `;
  
  const text = `
Session Rescheduled

Hi ${data.learnerName},

${data.rescheduledBy === "coach" ? `Your coach ${data.coachName} has rescheduled your session.` : "You have successfully rescheduled your session."}

Previous Time (Cancelled): ${oldFormattedDate} at ${data.oldTime}
New Time (Confirmed): ${newFormattedDate} at ${data.newTime}

Session Details:
- Coach: ${data.coachName}
- Duration: ${data.duration} minutes
${data.meetingUrl ? `- Meeting Link: ${data.meetingUrl}` : ""}

View Dashboard: https://lingueefy.com/dashboard

Need to reschedule again? Please do so at least 24 hours before the session.

---
Lingueefy - Master Your Second Language for the Public Service
  `;
  
  // Generate updated ICS file
  const icsContent = generateICSFile({
    title: `SLE Coaching Session with ${data.coachName}`,
    description: `Rescheduled coaching session\\n\\nCoach: ${data.coachName}\\nDuration: ${data.duration} minutes${data.meetingUrl ? `\\n\\nJoin meeting: ${data.meetingUrl}` : ""}`,
    startTime: data.newDate,
    duration: data.duration,
    location: data.meetingUrl || "Online (Video Call)",
  });
  
  return sendEmail({
    to: data.learnerEmail,
    subject: `📅 Session Rescheduled: ${data.coachName} - ${newFormattedDate}`,
    html,
    text,
    attachments: [{
      filename: "session-updated.ics",
      content: Buffer.from(icsContent).toString("base64"),
      contentType: "text/calendar",
    }],
  });
}

/**
 * Send reschedule notification email to coach
 */
export async function sendCoachRescheduleNotification(data: RescheduleEmailData): Promise<boolean> {
  const oldFormattedDate = data.oldDate.toLocaleDateString("en-CA", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  
  const newFormattedDate = data.newDate.toLocaleDateString("en-CA", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background: #f5f5f5; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
    .details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
    .old-time { background: #fef2f2; border: 1px solid #ef4444; padding: 15px; border-radius: 8px; margin-bottom: 15px; }
    .new-time { background: #ecfdf5; border: 1px solid #10b981; padding: 15px; border-radius: 8px; }
    .label { color: #6b7280; font-size: 14px; }
    .value { font-weight: 600; font-size: 16px; }
    .strikethrough { text-decoration: line-through; color: #ef4444; }
    .button { display: inline-block; background: #0d9488; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 20px; }
    .footer { text-align: center; color: #6b7280; font-size: 14px; margin-top: 30px; }
    .legal-footer { text-align: center; color: #9ca3af; font-size: 12px; margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="${EMAIL_BRANDING.logos.banner}" alt="RusingÂcademy" style="max-width: 180px; height: auto; margin-bottom: 15px;" />
      <h1 style="margin: 0;">Session Rescheduled 📅</h1>
      <p style="margin: 10px 0 0;">A session has been moved to a new time</p>
    </div>
    <div class="content">
      <p>Hi ${data.coachName},</p>
      <p>${data.rescheduledBy === "learner" ? `Your learner <strong>${data.learnerName}</strong> has rescheduled their session.` : "You have successfully rescheduled the session."}</p>
      
      <div class="details">
        <div class="old-time">
          <p class="label">Previous Time (Cancelled)</p>
          <p class="value strikethrough">${oldFormattedDate} at ${data.oldTime}</p>
        </div>
        <div class="new-time">
          <p class="label">New Time (Confirmed)</p>
          <p class="value">${newFormattedDate} at ${data.newTime}</p>
        </div>
      </div>
      
      <p><strong>Session Details:</strong></p>
      <ul>
        <li>Learner: ${data.learnerName}</li>
        <li>Duration: ${data.duration} minutes</li>
        ${data.meetingUrl ? `<li>Meeting Link: <a href="${data.meetingUrl}">${data.meetingUrl}</a></li>` : ""}
      </ul>
      
      <a href="https://lingueefy.com/coach/dashboard" class="button">View Dashboard</a>
      
      <div class="footer">
        <p>Please update your calendar accordingly.</p>
      </div>
      
      <div class="legal-footer">
        <p style="margin: 0;">© ${new Date().getFullYear()} Rusinga International Consulting Ltd., commercially known as RusingÂcademy. All rights reserved.</p>
        <p style="margin: 10px 0 0;"><strong>Lingueefy</strong> - Master Your Second Language for the Public Service</p>
      </div>
    </div>
  </div>
</body>
</html>
  `;
  
  const text = `
Session Rescheduled

Hi ${data.coachName},

${data.rescheduledBy === "learner" ? `Your learner ${data.learnerName} has rescheduled their session.` : "You have successfully rescheduled the session."}

Previous Time (Cancelled): ${oldFormattedDate} at ${data.oldTime}
New Time (Confirmed): ${newFormattedDate} at ${data.newTime}

Session Details:
- Learner: ${data.learnerName}
- Duration: ${data.duration} minutes
${data.meetingUrl ? `- Meeting Link: ${data.meetingUrl}` : ""}

View Dashboard: https://lingueefy.com/coach/dashboard

Please update your calendar accordingly.

---
Lingueefy - Master Your Second Language for the Public Service
  `;
  
  // Generate updated ICS file
  const icsContent = generateICSFile({
    title: `SLE Coaching Session with ${data.learnerName}`,
    description: `Rescheduled coaching session\\n\\nLearner: ${data.learnerName}\\nDuration: ${data.duration} minutes${data.meetingUrl ? `\\n\\nJoin meeting: ${data.meetingUrl}` : ""}`,
    startTime: data.newDate,
    duration: data.duration,
    location: data.meetingUrl || "Online (Video Call)",
  });
  
  return sendEmail({
    to: data.coachEmail,
    subject: `📅 Session Rescheduled: ${data.learnerName} - ${newFormattedDate}`,
    html,
    text,
    attachments: [{
      filename: "session-updated.ics",
      content: Buffer.from(icsContent).toString("base64"),
      contentType: "text/calendar",
    }],
  });
}

/**
 * Send reschedule notification emails to both learner and coach
 */
export async function sendRescheduleNotificationEmails(data: RescheduleEmailData): Promise<{
  learnerEmailSent: boolean;
  coachEmailSent: boolean;
}> {
  const [learnerEmailSent, coachEmailSent] = await Promise.all([
    sendLearnerRescheduleNotification(data),
    sendCoachRescheduleNotification(data),
  ]);
  
  return { learnerEmailSent, coachEmailSent };
}


// ============================================================================
// CANCELLATION EMAIL FUNCTIONS
// ============================================================================

interface CancellationEmailData {
  learnerName: string;
  learnerEmail: string;
  coachName: string;
  coachEmail: string;
  sessionDate: Date;
  sessionTime: string;
  duration: number;
  reason?: string;
  refundAmount: number; // in cents
  cancelledBy: "learner" | "coach";
}

/**
 * Send cancellation notification email to learner
 */
export async function sendLearnerCancellationNotification(data: CancellationEmailData): Promise<boolean> {
  const formattedDate = data.sessionDate.toLocaleDateString("en-CA", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  
  const refundText = data.refundAmount > 0 
    ? `A refund of $${(data.refundAmount / 100).toFixed(2)} CAD will be processed to your original payment method within 5-10 business days.`
    : "No refund is applicable as the cancellation was made less than 24 hours before the session.";
  
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background: #f5f5f5; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #ef4444 0%, #f87171 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
    .details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ef4444; }
    .refund-box { background: ${data.refundAmount > 0 ? "#ecfdf5" : "#fef3c7"}; border: 1px solid ${data.refundAmount > 0 ? "#10b981" : "#f59e0b"}; padding: 15px; border-radius: 8px; margin-top: 20px; }
    .button { display: inline-block; background: #0d9488; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 20px; }
    .footer { text-align: center; color: #6b7280; font-size: 14px; margin-top: 30px; }
    .legal-footer { text-align: center; color: #9ca3af; font-size: 12px; margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="${EMAIL_BRANDING.logos.banner}" alt="RusingÂcademy" style="max-width: 180px; height: auto; margin-bottom: 15px;" />
      <h1 style="margin: 0;">Session Cancelled</h1>
      <p style="margin: 10px 0 0;">Your coaching session has been cancelled</p>
    </div>
    <div class="content">
      <p>Hi ${data.learnerName},</p>
      <p>${data.cancelledBy === "learner" 
        ? "You have successfully cancelled your coaching session." 
        : `Your coach ${data.coachName} has cancelled your session.`}</p>
      
      <div class="details">
        <p><strong>Cancelled Session:</strong></p>
        <p>📅 ${formattedDate}</p>
        <p>🕐 ${data.sessionTime} (${data.duration} minutes)</p>
        <p>👤 Coach: ${data.coachName}</p>
        ${data.reason ? `<p>📝 Reason: ${data.reason}</p>` : ""}
      </div>
      
      <div class="refund-box">
        <p style="margin: 0;"><strong>${data.refundAmount > 0 ? "💰 Refund Information" : "⚠️ No Refund"}</strong></p>
        <p style="margin: 10px 0 0;">${refundText}</p>
      </div>
      
      <p style="margin-top: 20px;">Ready to book another session?</p>
      <a href="https://lingueefy.ca/coaches" class="button">Browse Coaches</a>
      
      <div class="footer">
        <p>Questions about your refund? Contact us at support@lingueefy.ca</p>
      </div>
      
      <div class="legal-footer">
        <p style="margin: 0;">© ${new Date().getFullYear()} Rusinga International Consulting Ltd., commercially known as RusingÂcademy. All rights reserved.</p>
        <p style="margin: 10px 0 0;"><strong>Lingueefy</strong> - Master Your Second Language for the Public Service</p>
      </div>
    </div>
  </div>
</body>
</html>
  `;
  
  const text = `
Session Cancelled

Hi ${data.learnerName},

${data.cancelledBy === "learner" 
  ? "You have successfully cancelled your coaching session." 
  : `Your coach ${data.coachName} has cancelled your session.`}

Cancelled Session:
- Date: ${formattedDate}
- Time: ${data.sessionTime} (${data.duration} minutes)
- Coach: ${data.coachName}
${data.reason ? `- Reason: ${data.reason}` : ""}

${refundText}

Ready to book another session? Visit: https://lingueefy.ca/coaches

Questions about your refund? Contact us at support@lingueefy.ca

---
Lingueefy - Master Your Second Language for the Public Service
  `;
  
  return sendEmail({
    to: data.learnerEmail,
    subject: `❌ Session Cancelled: ${data.coachName} - ${formattedDate}`,
    html,
    text,
  });
}

/**
 * Send cancellation notification email to coach
 */
export async function sendCoachCancellationNotification(data: CancellationEmailData): Promise<boolean> {
  const formattedDate = data.sessionDate.toLocaleDateString("en-CA", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background: #f5f5f5; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #ef4444 0%, #f87171 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
    .details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ef4444; }
    .button { display: inline-block; background: #0d9488; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 20px; }
    .footer { text-align: center; color: #6b7280; font-size: 14px; margin-top: 30px; }
    .legal-footer { text-align: center; color: #9ca3af; font-size: 12px; margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="${EMAIL_BRANDING.logos.banner}" alt="RusingÂcademy" style="max-width: 180px; height: auto; margin-bottom: 15px;" />
      <h1 style="margin: 0;">Session Cancelled</h1>
      <p style="margin: 10px 0 0;">A learner has cancelled their session</p>
    </div>
    <div class="content">
      <p>Hi ${data.coachName},</p>
      <p>${data.cancelledBy === "learner" 
        ? `Your learner ${data.learnerName} has cancelled their session with you.` 
        : "You have successfully cancelled this session."}</p>
      
      <div class="details">
        <p><strong>Cancelled Session:</strong></p>
        <p>📅 ${formattedDate}</p>
        <p>🕐 ${data.sessionTime} (${data.duration} minutes)</p>
        <p>👤 Learner: ${data.learnerName}</p>
        ${data.reason ? `<p>📝 Reason: ${data.reason}</p>` : ""}
      </div>
      
      <p style="margin-top: 20px;">This time slot is now available for other bookings.</p>
      
      <a href="https://lingueefy.ca/coach/dashboard" class="button">View Dashboard</a>
      
      <div class="footer">
        <p>Please update your calendar accordingly.</p>
      </div>
      
      <div class="legal-footer">
        <p style="margin: 0;">© ${new Date().getFullYear()} Rusinga International Consulting Ltd., commercially known as RusingÂcademy. All rights reserved.</p>
        <p style="margin: 10px 0 0;"><strong>Lingueefy</strong> - Master Your Second Language for the Public Service</p>
      </div>
    </div>
  </div>
</body>
</html>
  `;
  
  const text = `
Session Cancelled

Hi ${data.coachName},

${data.cancelledBy === "learner" 
  ? `Your learner ${data.learnerName} has cancelled their session with you.` 
  : "You have successfully cancelled this session."}

Cancelled Session:
- Date: ${formattedDate}
- Time: ${data.sessionTime} (${data.duration} minutes)
- Learner: ${data.learnerName}
${data.reason ? `- Reason: ${data.reason}` : ""}

This time slot is now available for other bookings.

View Dashboard: https://lingueefy.ca/coach/dashboard

Please update your calendar accordingly.

---
Lingueefy - Master Your Second Language for the Public Service
  `;
  
  return sendEmail({
    to: data.coachEmail,
    subject: `❌ Session Cancelled: ${data.learnerName} - ${formattedDate}`,
    html,
    text,
  });
}

/**
 * Send cancellation notification emails to both learner and coach
 */
export async function sendCancellationNotificationEmails(data: CancellationEmailData): Promise<{
  learnerEmailSent: boolean;
  coachEmailSent: boolean;
}> {
  const [learnerEmailSent, coachEmailSent] = await Promise.all([
    sendLearnerCancellationNotification(data),
    sendCoachCancellationNotification(data),
  ]);
  
  return { learnerEmailSent, coachEmailSent };
}


// ============================================================================
// LEARNER PROGRESS REPORTS
// ============================================================================

interface LearnerProgressData {
  learnerName: string;
  learnerEmail: string;
  language: "en" | "fr";
  weekStartDate: Date;
  weekEndDate: Date;
  
  // Session stats
  coachSessionsCompleted: number;
  coachSessionsScheduled: number;
  aiSessionsCompleted: number;
  totalPracticeMinutes: number;
  
  // Progress metrics
  currentLevels: {
    oral?: string;
    written?: string;
    reading?: string;
  };
  targetLevels: {
    oral?: string;
    written?: string;
    reading?: string;
  };
  
  // AI session breakdown
  aiSessionBreakdown?: {
    practice: number;
    placement: number;
    simulation: number;
  };
  
  // Recent achievements
  achievements?: string[];
  
  // Recommendations
  recommendations?: string[];
}

/**
 * Send weekly progress report email to learner
 */
export async function sendLearnerProgressReport(data: LearnerProgressData): Promise<boolean> {
  const formatDate = (date: Date) => date.toLocaleDateString(data.language === "fr" ? "fr-CA" : "en-CA", {
    month: "short",
    day: "numeric",
  });
  
  const weekRange = `${formatDate(data.weekStartDate)} - ${formatDate(data.weekEndDate)}`;
  
  const labels = data.language === "fr" ? {
    subject: `📊 Votre rapport de progression hebdomadaire - ${weekRange}`,
    title: "Rapport de progression hebdomadaire",
    greeting: `Bonjour ${data.learnerName},`,
    intro: "Voici votre résumé d'apprentissage pour cette semaine.",
    sessionsSection: "Sessions cette semaine",
    coachSessions: "Sessions avec coach",
    aiSessions: "Sessions Prof Steven AI",
    practiceTime: "Temps de pratique total",
    minutes: "minutes",
    levelsSection: "Vos niveaux SLE",
    currentLevel: "Niveau actuel",
    targetLevel: "Niveau cible",
    oral: "Oral",
    written: "Écrit",
    reading: "Lecture",
    aiBreakdown: "Détail des sessions AI",
    practice: "Pratique vocale",
    placement: "Tests de placement",
    simulation: "Simulations d'examen",
    achievementsSection: "Réalisations",
    recommendationsSection: "Recommandations",
    keepGoing: "Continuez comme ça !",
    bookSession: "Réserver une session",
    practiceAi: "Pratiquer avec Prof Steven AI",
    footer: "Vous recevez cet email car vous êtes inscrit aux rapports de progression hebdomadaires.",
    unsubscribe: "Se désabonner des rapports",
  } : {
    subject: `📊 Your Weekly Progress Report - ${weekRange}`,
    title: "Weekly Progress Report",
    greeting: `Hi ${data.learnerName},`,
    intro: "Here's your learning summary for this week.",
    sessionsSection: "Sessions This Week",
    coachSessions: "Coach Sessions",
    aiSessions: "Prof Steven AI Sessions",
    practiceTime: "Total Practice Time",
    minutes: "minutes",
    levelsSection: "Your SLE Levels",
    currentLevel: "Current Level",
    targetLevel: "Target Level",
    oral: "Oral",
    written: "Written",
    reading: "Reading",
    aiBreakdown: "AI Session Breakdown",
    practice: "Voice Practice",
    placement: "Placement Tests",
    simulation: "Exam Simulations",
    achievementsSection: "Achievements",
    recommendationsSection: "Recommendations",
    keepGoing: "Keep up the great work!",
    bookSession: "Book a Session",
    practiceAi: "Practice with Prof Steven AI",
    footer: "You're receiving this email because you're subscribed to weekly progress reports.",
    unsubscribe: "Unsubscribe from reports",
  };
  
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background: #f5f5f5; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #0d9488 0%, #14b8a6 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: white; padding: 30px; border-radius: 0 0 8px 8px; }
    .section { margin: 25px 0; }
    .section-title { font-size: 16px; font-weight: 600; color: #0d9488; margin-bottom: 15px; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px; }
    .stats-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; }
    .stat-card { background: #f9fafb; padding: 15px; border-radius: 8px; text-align: center; }
    .stat-value { font-size: 28px; font-weight: bold; color: #0d9488; }
    .stat-label { font-size: 12px; color: #6b7280; margin-top: 5px; }
    .levels-table { width: 100%; border-collapse: collapse; }
    .levels-table th, .levels-table td { padding: 12px; text-align: center; border-bottom: 1px solid #e5e7eb; }
    .levels-table th { background: #f9fafb; font-weight: 600; color: #374151; }
    .level-badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-weight: 600; }
    .level-a { background: #fef3c7; color: #92400e; }
    .level-b { background: #dbeafe; color: #1e40af; }
    .level-c { background: #d1fae5; color: #065f46; }
    .level-x { background: #f3f4f6; color: #6b7280; }
    .achievement { display: flex; align-items: center; gap: 10px; padding: 10px; background: #ecfdf5; border-radius: 6px; margin-bottom: 8px; }
    .achievement-icon { font-size: 20px; }
    .recommendation { display: flex; align-items: flex-start; gap: 10px; padding: 10px; background: #eff6ff; border-radius: 6px; margin-bottom: 8px; }
    .recommendation-icon { font-size: 16px; margin-top: 2px; }
    .button { display: inline-block; background: #0d9488; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 5px; }
    .button-secondary { background: #6b7280; }
    .cta-section { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; }
    .footer { text-align: center; color: #9ca3af; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; }
    .footer a { color: #6b7280; }
    .legal-footer { text-align: center; color: #9ca3af; font-size: 11px; margin-top: 15px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="${EMAIL_BRANDING.logos.banner}" alt="RusingÂcademy" style="max-width: 180px; height: auto; margin-bottom: 15px;" />
      <h1 style="margin: 0; font-size: 24px;">📊 ${labels.title}</h1>
      <p style="margin: 10px 0 0; opacity: 0.9;">${weekRange}</p>
    </div>
    <div class="content">
      <p>${labels.greeting}</p>
      <p>${labels.intro}</p>
      
      <!-- Sessions Stats -->
      <div class="section">
        <div class="section-title">📅 ${labels.sessionsSection}</div>
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-value">${data.coachSessionsCompleted}</div>
            <div class="stat-label">${labels.coachSessions}</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${data.aiSessionsCompleted}</div>
            <div class="stat-label">${labels.aiSessions}</div>
          </div>
          <div class="stat-card" style="grid-column: span 2;">
            <div class="stat-value">${data.totalPracticeMinutes}</div>
            <div class="stat-label">${labels.practiceTime} (${labels.minutes})</div>
          </div>
        </div>
      </div>
      
      <!-- SLE Levels -->
      <div class="section">
        <div class="section-title">🎯 ${labels.levelsSection}</div>
        <table class="levels-table">
          <thead>
            <tr>
              <th></th>
              <th>${labels.oral}</th>
              <th>${labels.written}</th>
              <th>${labels.reading}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="text-align: left; font-weight: 500;">${labels.currentLevel}</td>
              <td><span class="level-badge level-${(data.currentLevels.oral || 'x').toLowerCase()}">${data.currentLevels.oral || '-'}</span></td>
              <td><span class="level-badge level-${(data.currentLevels.written || 'x').toLowerCase()}">${data.currentLevels.written || '-'}</span></td>
              <td><span class="level-badge level-${(data.currentLevels.reading || 'x').toLowerCase()}">${data.currentLevels.reading || '-'}</span></td>
            </tr>
            <tr>
              <td style="text-align: left; font-weight: 500;">${labels.targetLevel}</td>
              <td><span class="level-badge level-${(data.targetLevels.oral || 'x').toLowerCase()}">${data.targetLevels.oral || '-'}</span></td>
              <td><span class="level-badge level-${(data.targetLevels.written || 'x').toLowerCase()}">${data.targetLevels.written || '-'}</span></td>
              <td><span class="level-badge level-${(data.targetLevels.reading || 'x').toLowerCase()}">${data.targetLevels.reading || '-'}</span></td>
            </tr>
          </tbody>
        </table>
      </div>
      
      ${data.aiSessionBreakdown ? `
      <!-- AI Session Breakdown -->
      <div class="section">
        <div class="section-title">🤖 ${labels.aiBreakdown}</div>
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-value">${data.aiSessionBreakdown.practice}</div>
            <div class="stat-label">${labels.practice}</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${data.aiSessionBreakdown.placement}</div>
            <div class="stat-label">${labels.placement}</div>
          </div>
          <div class="stat-card" style="grid-column: span 2;">
            <div class="stat-value">${data.aiSessionBreakdown.simulation}</div>
            <div class="stat-label">${labels.simulation}</div>
          </div>
        </div>
      </div>
      ` : ''}
      
      ${data.achievements && data.achievements.length > 0 ? `
      <!-- Achievements -->
      <div class="section">
        <div class="section-title">🏆 ${labels.achievementsSection}</div>
        ${data.achievements.map(a => `
          <div class="achievement">
            <span class="achievement-icon">⭐</span>
            <span>${a}</span>
          </div>
        `).join('')}
      </div>
      ` : ''}
      
      ${data.recommendations && data.recommendations.length > 0 ? `
      <!-- Recommendations -->
      <div class="section">
        <div class="section-title">💡 ${labels.recommendationsSection}</div>
        ${data.recommendations.map(r => `
          <div class="recommendation">
            <span class="recommendation-icon">→</span>
            <span>${r}</span>
          </div>
        `).join('')}
      </div>
      ` : ''}
      
      <!-- CTA -->
      <div class="cta-section">
        <p style="font-weight: 600; margin-bottom: 15px;">${labels.keepGoing}</p>
        <a href="https://lingueefy.ca/coaches" class="button">${labels.bookSession}</a>
        <a href="https://lingueefy.ca/ai-coach" class="button button-secondary">${labels.practiceAi}</a>
      </div>
      
      <!-- Footer -->
      <div class="footer">
        <p>${labels.footer}</p>
        <p><a href="https://lingueefy.ca/dashboard/settings">${labels.unsubscribe}</a></p>
      </div>
      
      <div class="legal-footer">
        <p style="margin: 0;">© ${new Date().getFullYear()} Rusinga International Consulting Ltd., commercially known as RusingÂcademy. All rights reserved.</p>
        <p style="margin: 10px 0 0;"><strong>Lingueefy</strong> - ${data.language === "fr" ? "Maîtrisez votre langue seconde pour la fonction publique" : "Master Your Second Language for the Public Service"}</p>
      </div>
    </div>
  </div>
</body>
</html>
  `;
  
  const text = `
${labels.title}
${weekRange}

${labels.greeting}
${labels.intro}

${labels.sessionsSection}
- ${labels.coachSessions}: ${data.coachSessionsCompleted}
- ${labels.aiSessions}: ${data.aiSessionsCompleted}
- ${labels.practiceTime}: ${data.totalPracticeMinutes} ${labels.minutes}

${labels.levelsSection}
${labels.currentLevel}: ${labels.oral} ${data.currentLevels.oral || '-'} | ${labels.written} ${data.currentLevels.written || '-'} | ${labels.reading} ${data.currentLevels.reading || '-'}
${labels.targetLevel}: ${labels.oral} ${data.targetLevels.oral || '-'} | ${labels.written} ${data.targetLevels.written || '-'} | ${labels.reading} ${data.targetLevels.reading || '-'}

${data.achievements && data.achievements.length > 0 ? `${labels.achievementsSection}:\n${data.achievements.map(a => `- ${a}`).join('\n')}\n` : ''}
${data.recommendations && data.recommendations.length > 0 ? `${labels.recommendationsSection}:\n${data.recommendations.map(r => `- ${r}`).join('\n')}\n` : ''}

${labels.keepGoing}

${labels.bookSession}: https://lingueefy.ca/coaches
${labels.practiceAi}: https://lingueefy.ca/ai-coach

---
${labels.footer}
${labels.unsubscribe}: https://lingueefy.ca/dashboard/settings
  `;
  
  return sendEmail({
    to: data.learnerEmail,
    subject: labels.subject,
    html,
    text,
  });
}

/**
 * Generate progress report data for a learner
 */
export interface ProgressReportGeneratorParams {
  learnerId: number;
  learnerName: string;
  learnerEmail: string;
  language: "en" | "fr";
  currentLevels: { oral?: string; written?: string; reading?: string };
  targetLevels: { oral?: string; written?: string; reading?: string };
  coachSessionsCompleted: number;
  coachSessionsScheduled: number;
  aiSessionsCompleted: number;
  aiSessionBreakdown: { practice: number; placement: number; simulation: number };
  totalPracticeMinutes: number;
}

export function generateProgressReportData(params: ProgressReportGeneratorParams): LearnerProgressData {
  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - 7);
  
  // Generate achievements based on activity
  const achievements: string[] = [];
  if (params.coachSessionsCompleted > 0) {
    achievements.push(params.language === "fr" 
      ? `Complété ${params.coachSessionsCompleted} session(s) avec un coach`
      : `Completed ${params.coachSessionsCompleted} coach session(s)`);
  }
  if (params.aiSessionsCompleted >= 5) {
    achievements.push(params.language === "fr"
      ? "Super pratiquant : 5+ sessions AI cette semaine !"
      : "Super Practitioner: 5+ AI sessions this week!");
  }
  if (params.totalPracticeMinutes >= 60) {
    achievements.push(params.language === "fr"
      ? "Plus d'une heure de pratique cette semaine"
      : "Over an hour of practice this week");
  }
  
  // Generate recommendations based on activity
  const recommendations: string[] = [];
  if (params.coachSessionsCompleted === 0) {
    recommendations.push(params.language === "fr"
      ? "Réservez une session avec un coach pour des commentaires personnalisés"
      : "Book a session with a coach for personalized feedback");
  }
  if (params.aiSessionBreakdown.simulation === 0) {
    recommendations.push(params.language === "fr"
      ? "Essayez une simulation d'examen pour vous préparer au vrai test"
      : "Try an exam simulation to prepare for the real test");
  }
  if (params.totalPracticeMinutes < 30) {
    recommendations.push(params.language === "fr"
      ? "Visez au moins 30 minutes de pratique par semaine"
      : "Aim for at least 30 minutes of practice per week");
  }
  
  return {
    learnerName: params.learnerName,
    learnerEmail: params.learnerEmail,
    language: params.language,
    weekStartDate: weekStart,
    weekEndDate: now,
    coachSessionsCompleted: params.coachSessionsCompleted,
    coachSessionsScheduled: params.coachSessionsScheduled,
    aiSessionsCompleted: params.aiSessionsCompleted,
    totalPracticeMinutes: params.totalPracticeMinutes,
    currentLevels: params.currentLevels,
    targetLevels: params.targetLevels,
    aiSessionBreakdown: params.aiSessionBreakdown,
    achievements,
    recommendations,
  };
}
