# SMTP Email Testing Checklist

## Prerequisites

Before testing, ensure you have configured the following secrets in **Settings → Secrets**:

| Secret Key | Description | Example |
|------------|-------------|---------|
| `SMTP_HOST` | SMTP server hostname | `smtp.sendgrid.net` |
| `SMTP_USER` | SMTP username/API key | `apikey` |
| `SMTP_PASS` | SMTP password/API key value | `SG.xxxxx` |
| `SMTP_FROM` | Sender email address | `noreply@rusingacademy.com` |

## Test 1: SMTP Connection Test (Admin Only)

**Endpoint:** `POST /api/trpc/emailSettings.sendTestEmail`

**How to test:**
1. Log in as an admin user
2. Navigate to any page and open browser DevTools (F12)
3. In Console, run:
```javascript
fetch('/api/trpc/emailSettings.sendTestEmail', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'your-email@example.com' })
}).then(r => r.json()).then(console.log)
```

**Expected Result:**
- Email arrives with subject: "Test Email from Lingueefy"
- Body contains: "This is a test email to verify your SMTP configuration."

---

## Test 2: Email Verification (Signup Flow)

**Endpoint:** `POST /api/trpc/customAuth.signup`

**How to test:**
1. Go to `/signup`
2. Fill in the form with a real email address
3. Click "Create Account"

**Expected Result:**
- Email arrives with subject: "Verify your email - RusingÂcademy" (EN) or "Vérifiez votre email - RusingÂcademy" (FR)
- Contains a verification link
- Clicking the link verifies the account

---

## Test 3: Password Reset Flow

**Endpoint:** `POST /api/trpc/customAuth.forgotPassword`

**How to test:**
1. Go to `/forgot-password`
2. Enter a registered email address
3. Click "Send Reset Link"

**Expected Result:**
- Email arrives with subject: "Reset your password - RusingÂcademy" (EN) or "Réinitialisez votre mot de passe - RusingÂcademy" (FR)
- Contains a reset link valid for 1 hour
- Clicking the link opens the reset password form

---

## Test 4: Booking Confirmation Email

**Endpoint:** Triggered automatically after successful booking

**How to test:**
1. Log in as a learner
2. Book a coaching session with a coach
3. Complete the booking process

**Expected Result:**
- Learner receives: "Booking Confirmation - RusingÂcademy"
- Coach receives: "New Booking - RusingÂcademy"
- Both emails contain session details (date, time, duration)

---

## Test 5: Booking Reminder Email

**Endpoint:** Triggered by cron job 24h and 1h before session

**How to test:**
1. Create a booking for a session starting soon
2. Wait for the reminder trigger (or manually trigger via cron endpoint)

**Expected Result:**
- Email arrives with subject: "Reminder: Your session is coming up"
- Contains session details and join link

---

## Troubleshooting

### Emails not arriving?

1. **Check spam folder** - First check if emails are in spam
2. **Verify SMTP credentials** - Double-check all 4 secrets are correct
3. **Check server logs** - Look for SMTP errors in the console
4. **Test SMTP directly** - Use the admin test endpoint first

### Common SMTP Providers Configuration

**SendGrid:**
```
SMTP_HOST=smtp.sendgrid.net
SMTP_USER=apikey
SMTP_PASS=SG.your-api-key
SMTP_FROM=noreply@yourdomain.com
```

**Mailgun:**
```
SMTP_HOST=smtp.mailgun.org
SMTP_USER=postmaster@yourdomain.mailgun.org
SMTP_PASS=your-password
SMTP_FROM=noreply@yourdomain.com
```

**Amazon SES:**
```
SMTP_HOST=email-smtp.us-east-1.amazonaws.com
SMTP_USER=your-ses-access-key
SMTP_PASS=your-ses-secret-key
SMTP_FROM=noreply@verified-domain.com
```

**Gmail (for testing only):**
```
SMTP_HOST=smtp.gmail.com
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=your-email@gmail.com
```

---

## Email Templates

All emails use bilingual templates (EN/FR) based on user language preference:

| Email Type | EN Subject | FR Subject |
|------------|------------|------------|
| Verification | Verify your email - RusingÂcademy | Vérifiez votre email - RusingÂcademy |
| Password Reset | Reset your password - RusingÂcademy | Réinitialisez votre mot de passe - RusingÂcademy |
| Welcome | Welcome to RusingÂcademy! | Bienvenue chez RusingÂcademy ! |
| Booking Confirmation | Booking Confirmation | Confirmation de réservation |
| Session Reminder | Reminder: Your session is coming up | Rappel : Votre session approche |

---

## Support

If issues persist after following this checklist, contact support at **https://help.manus.im**
