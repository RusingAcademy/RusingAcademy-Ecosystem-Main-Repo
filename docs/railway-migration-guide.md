# RusingAcademy EcosystemHub — Railway Migration Guide

**Version:** 1.0  
**Date:** February 13, 2026  
**Author:** Manus AI  
**Status:** Ready for execution

---

## Executive Summary

This document provides a complete, step-by-step guide for migrating the EcosystemHub Preview application from the Manus hosting platform to Railway. The audit reveals that the codebase is **already 85% portable** — most critical services (authentication, storage, LLM, email, payments) have standalone implementations that work independently of Manus infrastructure. The migration primarily involves configuration changes and disabling the Manus OAuth fallback.

---

## 1. Architecture Overview

The EcosystemHub is a full-stack application with the following architecture:

| Layer | Technology | Manus Dependency |
|-------|-----------|-----------------|
| Frontend | React 19 + Tailwind 4 + shadcn/ui | None (fully portable) |
| Backend | Express 4 + tRPC 11 | Minimal (OAuth callback, Forge proxy) |
| Database | Drizzle ORM + mysql2 | Connection string only |
| Authentication | Email/Password + Google + Microsoft + Manus OAuth | Manus OAuth is optional |
| File Storage | Bunny CDN (primary) / Manus S3 (fallback) | Auto-switches based on env |
| LLM / AI | OpenAI API (primary) / Manus Forge (fallback) | Auto-switches based on env |
| Voice | OpenAI Whisper (primary) / Manus Forge (fallback) | Auto-switches based on env |
| Video Streaming | Bunny Stream | None (fully portable) |
| Payments | Stripe | None (fully portable) |
| Email | Nodemailer + SMTP | None (fully portable) |
| Push Notifications | Web Push (VAPID) | None (fully portable) |
| Scheduling | Calendly API | None (fully portable) |
| Voice Cloning | MiniMax API | None (fully portable) |

---

## 2. Dependency Classification

### 2A. Fully Portable Services (No Changes Needed)

These services work identically on Railway with the same environment variables:

| Service | Implementation | Environment Variables |
|---------|---------------|---------------------|
| Stripe Payments | `stripe` npm package | `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `VITE_STRIPE_PUBLISHABLE_KEY` |
| SMTP Email | `nodemailer` | `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`, `SMTP_FROM_NAME`, `SMTP_SECURE` |
| Bunny CDN Storage | `server/bunnyStorage.ts` | `BUNNY_STORAGE_ZONE`, `BUNNY_STORAGE_API_KEY`, `BUNNY_STORAGE_HOSTNAME`, `BUNNY_CDN_URL` |
| Bunny Stream Video | Direct API calls | `BUNNY_STREAM_API_KEY`, `BUNNY_STREAM_LIBRARY_ID`, `BUNNY_STREAM_CDN_HOSTNAME` |
| Push Notifications | `web-push` npm package | `VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`, `VAPID_SUBJECT` |
| Calendly | REST API | `CALENDLY_API_KEY` |
| MiniMax Voice | REST API | `MINIMAX_API_KEY` |
| Google OAuth | `server/routers/googleAuth.ts` | `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REDIRECT_URI` |
| Microsoft OAuth | `server/routers/microsoftAuth.ts` | `MICROSOFT_CLIENT_ID`, `MICROSOFT_CLIENT_SECRET` |
| Email/Password Auth | `server/routers/auth.ts` (argon2 + JWT) | `JWT_SECRET` |

### 2B. Auto-Switching Services (Configuration Only)

These services already have dual implementations and auto-select based on environment variables:

| Service | Manus Mode | Railway Mode | Switch Mechanism |
|---------|-----------|-------------|-----------------|
| File Storage | Manus S3 via Forge API | Bunny CDN | `BUNNY_STORAGE_API_KEY` present → uses Bunny |
| LLM (Chat) | Manus Forge proxy | OpenAI API direct | `OPENAI_API_KEY` present → uses OpenAI |
| Voice Transcription | Manus Forge proxy | OpenAI Whisper direct | `OPENAI_API_KEY` present → uses OpenAI |
| Login URL | Manus OAuth portal | Local `/login` page | `VITE_OAUTH_ENABLED` !== 'true' → local login |

### 2C. Manus-Only Services (Require Replacement or Removal)

| Service | Current Implementation | Migration Action |
|---------|----------------------|-----------------|
| Manus OAuth | `server/_core/oauth.ts` + `server/_core/sdk.ts` | Disable via `VITE_OAUTH_ENABLED=false` |
| Owner Notifications | `server/_core/notification.ts` (Forge API) | Replace with email notification or Slack webhook |
| Data API Proxy | `server/_core/dataApi.ts` (Forge API) | Not used in any router — safe to ignore |
| Image Generation | `server/_core/imageGeneration.ts` (Forge API) | Not used in any router — safe to ignore |
| Google Maps Proxy | `server/_core/map.ts` (Forge API) | Not used in any router — safe to ignore |

---

## 3. Database Migration

### Current Setup
- **ORM:** Drizzle ORM with `mysql2` driver
- **Dialect:** MySQL (TiDB-compatible)
- **Schema:** 40+ tables defined in `drizzle/schema.ts`

### Railway Options

| Option | Pros | Cons | Recommended |
|--------|------|------|:-----------:|
| **TiDB Cloud Serverless** | Same engine as current, zero migration risk | External service, requires account | Yes |
| **Railway MySQL** | One-click provision, same Railway project | Standard MySQL (minor TiDB syntax differences) | Yes |
| **PlanetScale** | Serverless MySQL, auto-scaling | Requires account, Vitess-based | Alternative |

### Migration Steps

1. **Provision a MySQL-compatible database** on Railway or TiDB Cloud.
2. **Set `DATABASE_URL`** in Railway environment variables:
   ```
   mysql://user:password@host:port/database?ssl={"rejectUnauthorized":true}
   ```
3. **Run schema migration:**
   ```bash
   pnpm db:push
   ```
4. **Verify tables** were created (40+ tables expected).
5. **Seed admin user** — create the first admin account via the signup flow, then promote via SQL:
   ```sql
   UPDATE users SET role = 'admin', isOwner = 1 WHERE email = 'steven@rusingacademy.ca';
   ```

---

## 4. Environment Variable Mapping

### Complete Railway Environment Variables

```env
# ─── Core ───────────────────────────────────────────────────
NODE_ENV=production
PORT=3000
JWT_SECRET=<generate-a-64-char-random-string>
DATABASE_URL=mysql://user:pass@host:port/dbname?ssl={"rejectUnauthorized":true}

# ─── Authentication (disable Manus OAuth) ───────────────────
VITE_OAUTH_ENABLED=false
# Leave these empty or remove them:
# VITE_APP_ID=
# OAUTH_SERVER_URL=
# VITE_OAUTH_PORTAL_URL=
# OWNER_OPEN_ID=

# ─── Google OAuth ───────────────────────────────────────────
GOOGLE_CLIENT_ID=<your-google-client-id>
GOOGLE_CLIENT_SECRET=<your-google-client-secret>
GOOGLE_REDIRECT_URI=https://your-domain.com/api/auth/google/callback

# ─── Microsoft OAuth ────────────────────────────────────────
MICROSOFT_CLIENT_ID=<your-microsoft-client-id>
MICROSOFT_CLIENT_SECRET=<your-microsoft-client-secret>

# ─── OpenAI (LLM + Whisper) ─────────────────────────────────
OPENAI_API_KEY=<your-openai-api-key>
# Leave BUILT_IN_FORGE_API_URL and BUILT_IN_FORGE_API_KEY empty

# ─── Stripe ─────────────────────────────────────────────────
STRIPE_SECRET_KEY=<your-stripe-secret-key>
STRIPE_WEBHOOK_SECRET=<your-stripe-webhook-secret>
VITE_STRIPE_PUBLISHABLE_KEY=<your-stripe-publishable-key>

# ─── SMTP Email ─────────────────────────────────────────────
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=<your-sendgrid-api-key>
SMTP_FROM=noreply@rusingacademy.ca
SMTP_FROM_NAME=RusingAcademy
SMTP_SECURE=false

# ─── Bunny CDN Storage ──────────────────────────────────────
BUNNY_STORAGE_ZONE=rusingacademy-uploads
BUNNY_STORAGE_API_KEY=<your-bunny-storage-api-key>
BUNNY_STORAGE_HOSTNAME=ny.storage.bunnycdn.com
BUNNY_CDN_URL=https://rusingacademy-cdn.b-cdn.net

# ─── Bunny Stream Video ─────────────────────────────────────
BUNNY_STREAM_API_KEY=<your-bunny-stream-api-key>
BUNNY_STREAM_LIBRARY_ID=<your-bunny-stream-library-id>
BUNNY_STREAM_CDN_HOSTNAME=<your-bunny-stream-cdn-hostname>

# ─── Push Notifications ─────────────────────────────────────
VAPID_PUBLIC_KEY=<your-vapid-public-key>
VAPID_PRIVATE_KEY=<your-vapid-private-key>
VAPID_SUBJECT=mailto:admin@rusingacademy.ca

# ─── MiniMax Voice ──────────────────────────────────────────
MINIMAX_API_KEY=<your-minimax-api-key>
STEVEN_VOICE_ID=moss_audio_b813fbba-c1d2-11f0-a527-aab150a40f84

# ─── Calendly ───────────────────────────────────────────────
CALENDLY_API_KEY=<your-calendly-api-key>

# ─── App Branding ───────────────────────────────────────────
VITE_APP_TITLE=RusingAcademy
VITE_APP_URL=https://app.rusingacademy.ca
VITE_APP_LOGO=/logo.svg

# ─── Cron Security ──────────────────────────────────────────
CRON_SECRET=<generate-a-random-string>
```

---

## 5. Railway Deployment Configuration

### Build & Start Commands

| Setting | Value |
|---------|-------|
| **Build Command** | `pnpm install && pnpm build` |
| **Start Command** | `node dist/index.js` |
| **Watch Paths** | `server/**`, `client/**`, `shared/**`, `drizzle/**` |
| **Health Check Path** | `/api/trpc/system.health` |
| **Port** | Auto-detected from `PORT` env var |

### Railway Service Configuration

1. **Create a new service** in your Railway project linked to the `feature/ecosystemhub-preview` branch.
2. **Set the root directory** to `/` (project root).
3. **Add all environment variables** from Section 4 above.
4. **Configure the custom domain** (e.g., `app.rusingacademy.ca`).
5. **Set up the Stripe webhook** endpoint: `https://your-domain.com/api/stripe/webhook`.

### Post-Deployment Checklist

- [ ] Verify the app loads at the Railway URL
- [ ] Test email/password signup and login
- [ ] Test Google OAuth login
- [ ] Test Microsoft OAuth login
- [ ] Verify course catalog loads from database
- [ ] Test Stripe checkout flow (test card: 4242 4242 4242 4242)
- [ ] Verify push notification subscription
- [ ] Test email delivery (enrollment confirmation)
- [ ] Verify sitemap.xml at `/sitemap.xml`
- [ ] Verify robots.txt at `/robots.txt`
- [ ] Check admin dashboard loads with real data

---

## 6. Owner Notification Replacement

The `notifyOwner()` function currently uses the Manus Forge API. For Railway, replace it with one of these options:

### Option A: Email Notification (Recommended)

Replace the Forge API call with an SMTP email to the owner. The SMTP infrastructure is already in place.

### Option B: Slack Webhook

The codebase already has `CRM_SLACK_WEBHOOK_URL` support. Configure a Slack incoming webhook and set the environment variable.

### Option C: Discord Webhook

Similarly, `CRM_DISCORD_WEBHOOK_URL` is already supported.

---

## 7. Migration Execution Order

The recommended execution order minimizes risk and allows incremental validation:

| Step | Action | Duration | Risk |
|------|--------|----------|------|
| 1 | Provision Railway MySQL database | 5 min | Low |
| 2 | Set all environment variables | 15 min | Low |
| 3 | Deploy to Railway staging | 10 min | Low |
| 4 | Run `pnpm db:push` to create schema | 2 min | Low |
| 5 | Create admin user via signup + SQL promotion | 5 min | Low |
| 6 | Test email/password auth flow | 5 min | Low |
| 7 | Test Google/Microsoft OAuth | 10 min | Medium |
| 8 | Test Stripe payment flow | 10 min | Low |
| 9 | Test file upload (Bunny CDN) | 5 min | Low |
| 10 | Test AI features (LLM, voice) | 10 min | Medium |
| 11 | Configure custom domain | 10 min | Low |
| 12 | Set up Stripe webhook for production domain | 5 min | Low |
| 13 | Full smoke test | 15 min | Low |
| **Total** | | **~2 hours** | |

---

## 8. Code Changes Required

### Minimal Changes (Configuration Only)

The only code change needed is to ensure `notifyOwner()` gracefully degrades when Forge API is unavailable. This is already handled — the function returns `false` on failure, and callers handle the fallback.

### Optional Enhancements

1. **Replace `notifyOwner()` with email**: Create a `notifyOwnerViaEmail()` function that sends an email to the owner instead of calling the Forge API.
2. **Remove unused `_core` modules**: `dataApi.ts`, `imageGeneration.ts`, and `map.ts` are not used by any router and can be safely deleted to reduce bundle size.

---

## 9. Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|-----------|
| Database schema incompatibility | Low | High | TiDB Cloud uses same engine; Railway MySQL is standard MySQL |
| OAuth redirect URI mismatch | Medium | Medium | Update `GOOGLE_REDIRECT_URI` and Microsoft redirect URIs in their respective consoles |
| Stripe webhook signature failure | Low | Medium | Generate new webhook secret for the Railway domain |
| Bunny CDN CORS issues | Low | Low | Bunny CDN already configured for cross-origin access |
| OpenAI API rate limits | Low | Low | Same API, same limits as Forge proxy |

---

## 10. Rollback Plan

If the Railway deployment encounters critical issues:

1. The Manus-hosted version remains fully operational and unaffected.
2. DNS can be switched back to Manus hosting within minutes.
3. The database can be exported from Railway and re-imported to TiDB.
4. All environment variables are documented above for quick reconfiguration.

---

*This guide was generated based on a comprehensive audit of the EcosystemHub Preview codebase (1,536 files, 118 test files, 2,976 tests). The migration is classified as **low-risk** due to the existing dual-implementation architecture.*
