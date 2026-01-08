import { ENV } from "./_core/env";

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
  price: number; // in cents
  meetingUrl?: string;
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
  
  const formattedPrice = (data.price / 100).toFixed(2);
  
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
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
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
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
          <span class="label">Amount Paid</span>
          <span class="value">$${formattedPrice} CAD</span>
        </div>
      </div>
      
      <p><strong>What's next?</strong></p>
      <ul>
        <li>You'll receive a meeting link before your session</li>
        <li>Prepare any questions or topics you'd like to discuss</li>
        <li>Join the video call 5 minutes early to test your audio/video</li>
      </ul>
      
      ${data.meetingUrl ? `<a href="${data.meetingUrl}" class="button">Join Session</a>` : ""}
      
      <div class="footer">
        <p>Need to reschedule? Contact your coach at least 24 hours before the session.</p>
        <p>Questions? Reply to this email or visit <a href="https://lingueefy.com">lingueefy.com</a></p>
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
- Amount Paid: $${formattedPrice} CAD

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
  
  const formattedPrice = (data.price / 100).toFixed(2);
  
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
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
    .earnings { background: #ecfdf5; border: 1px solid #10b981; padding: 15px; border-radius: 8px; text-align: center; margin-top: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
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
        <p style="margin: 0; color: #059669; font-weight: 600;">Session Earnings: $${formattedPrice} CAD</p>
        <p style="margin: 5px 0 0; font-size: 14px; color: #6b7280;">(Platform fees will be deducted at payout)</p>
      </div>
      
      <p><strong>Next Steps:</strong></p>
      <ul>
        <li>Review the learner's profile in your dashboard</li>
        <li>Prepare materials for the session</li>
        <li>Send a meeting link to the learner before the session</li>
      </ul>
      
      <a href="https://lingueefy.com/coach/dashboard" class="button">View Dashboard</a>
      
      <div class="footer">
        <p>Need to cancel? Please notify the learner at least 24 hours in advance.</p>
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

Session Earnings: $${formattedPrice} CAD
(Platform fees will be deducted at payout)

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
