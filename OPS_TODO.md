# OPS_TODO.md - Manual Configuration Steps

This document lists the manual configuration steps required in external dashboards (Clerk, Railway) to complete the infrastructure unification.

---

## 1. Clerk Dashboard Configuration

### 1.1 Create Clerk Application

1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Create new application: **RusingAcademy Ecosystem**
3. Select authentication methods:
   - ✅ Email
   - ✅ Google OAuth
   - ✅ Microsoft OAuth (for federal employees)
4. Configure branding:
   - Primary color: `#2563eb` (Blue-600)
   - Logo: Upload RusingAcademy logo

### 1.2 Get API Keys

After creating the application, copy these values:

| Variable | Where to Find | Add to Railway |
|----------|---------------|----------------|
| `VITE_CLERK_PUBLISHABLE_KEY` | Clerk Dashboard → API Keys → Publishable Key | ✅ Production + Staging |
| `CLERK_SECRET_KEY` | Clerk Dashboard → API Keys → Secret Key | ✅ Production + Staging |

### 1.3 Configure Webhook

1. Go to Clerk Dashboard → Webhooks
2. Add endpoint: `https://app.rusingacademy.ca/api/webhooks/clerk`
3. Select events:
   - ✅ `user.created`
   - ✅ `user.updated`
   - ✅ `user.deleted`
4. Copy the **Signing Secret** and add to Railway as:
   - Variable: `CLERK_WEBHOOK_SECRET`

### 1.4 Configure Allowed Origins

1. Go to Clerk Dashboard → Settings → Domains
2. Add allowed origins:
   - `https://app.rusingacademy.ca`
   - `https://rusingacademy-ecosystem-production.up.railway.app`
   - `https://rusingacademy-ecosystem-staging-production.up.railway.app`
   - `http://localhost:3000` (for development)

---

## 2. Railway Environment Variables

### 2.1 Add New Variables to Production

Navigate to: Railway → rusingacademy-ecosystem → Variables

| Variable | Value | Notes |
|----------|-------|-------|
| `VITE_CLERK_PUBLISHABLE_KEY` | `pk_live_...` | From Clerk Dashboard |
| `CLERK_SECRET_KEY` | `sk_live_...` | From Clerk Dashboard |
| `CLERK_WEBHOOK_SECRET` | `whsec_...` | From Clerk Webhook config |
| `RESEND_API_KEY` | (optional) | Only if switching from SMTP to Resend |

### 2.2 Add Same Variables to Staging

Copy the same variables to the staging environment, but use Clerk's **test** keys if available.

---

## 3. Database Migration

The schema changes will be applied automatically on next deployment via Drizzle migrations.

New fields added:
- `users.clerkUserId` - VARCHAR(64), unique, nullable
- `users.productArea` - ENUM('rusingacademy', 'lingueefy', 'barholex', 'all')

New table added:
- `media_projects` - For Barholex Media project tracking

### Migration Command (if manual execution needed)

```bash
pnpm drizzle-kit push
```

---

## 4. Verification Checklist

After completing the above steps, verify:

- [ ] Clerk sign-in modal appears when clicking "Sign In"
- [ ] User is created in database after Clerk sign-up
- [ ] Webhook endpoint returns 200 for test events
- [ ] Existing OAuth users can still log in
- [ ] Multi-tenant product area is set correctly for new users

---

## 5. Rollback Plan

If issues occur:

1. **Disable Clerk:** Remove `VITE_CLERK_PUBLISHABLE_KEY` from Railway
   - App will fall back to legacy OAuth automatically
2. **Revert code:** Create revert PR from `main` to previous commit
3. **Database:** No destructive changes - new fields are nullable

---

**Document created:** January 13, 2026
**Author:** Manus AI (Mega-Prompt 1 Execution)
