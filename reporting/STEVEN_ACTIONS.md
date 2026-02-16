# Steven Actions Required

**Last Updated:** February 16, 2026  
**Total Actions:** 8  
**Critical (blocks everything):** 1  
**High (blocks revenue):** 2  
**Medium (blocks features):** 3  
**Low (nice to have):** 2

---

## 🔴 CRITICAL — Blocks All Content Features

### 1. Database Seeding — Provide DATABASE_URL or Run Seed Scripts

**Impact:** Without this, the entire platform shows empty pages — zero courses, zero coaches, zero paths. Every visitor sees an empty catalog. This is the single most important action.

**What's Ready:**
- 7 seed scripts are written and tested: `seed-coaches.mjs` (7 coaches), `seed-paths.mjs` (6 paths), `seed-all-paths.mjs` (672 activities + 768 quiz questions), `seed-demo-data.mjs`, `seed-lessons.mjs`, `seed-quiz-questions.mjs`, `seed-leaderboard.mjs`

**Option A — Provide DATABASE_URL (preferred):**
1. Go to [Railway Project → Variables](https://railway.com/project/b478cc48-f3ae-475b-b78e-21fe174a6c0f/service/5d1b3aa5-b0e2-44a6-afd8-1acd01185f36/variables)
2. Copy the `DATABASE_URL` value
3. Share it with Max (paste in chat)
4. Max will run all seed scripts and verify data appears on the live site

**Option B — Run seed scripts yourself:**
```bash
cd rusingacademy-ecosystem
export DATABASE_URL="mysql://..."  # from Railway
node scripts/seed-coaches.mjs
node scripts/seed-paths.mjs
node scripts/seed-all-paths.mjs
```

**Verification:** After seeding, visit `/coaches` — you should see 7 coach profiles. Visit `/courses` — you should see 6 courses.

---

## 🟠 HIGH — Blocks Revenue Pipeline

### 2. Stripe Webhook Configuration

**Impact:** Payments will succeed on Stripe's side but the platform won't record enrollments. Users pay but don't get access to courses.

**Steps:**
1. Go to [Stripe Dashboard → Developers → Webhooks](https://dashboard.stripe.com/webhooks)
2. Click "Add endpoint"
3. Enter URL: `https://new-rusingacademy-project-production.up.railway.app/api/stripe/webhook`
4. Select events:
   - `checkout.session.completed`
   - `invoice.paid`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
5. Click "Add endpoint"
6. Copy the **Signing secret** (starts with `whsec_`)
7. Go to [Railway Variables](https://railway.com/project/b478cc48-f3ae-475b-b78e-21fe174a6c0f/service/5d1b3aa5-b0e2-44a6-afd8-1acd01185f36/variables)
8. Set `STRIPE_WEBHOOK_SECRET` = the signing secret

**Verification:** Railway will auto-redeploy. Check `/api/health` — webhook processing should work.

### 3. CI Pipeline Fix — Push Workflow File

**Impact:** All PRs fail CI checks. Merges require admin override.

**Root Cause:** The `.github/workflows/ci.yml` has `PNPM_VERSION: "10"` which resolves to latest (10.29.3) but the lockfile was created with 10.4.1. The fix is ready locally but couldn't be pushed because the GitHub App token doesn't have `workflows` permission.

**Steps:**
1. Clone the repo locally: `git clone https://github.com/RusingAcademy/RusingAcademy-Ecosystem-Main-Repo.git`
2. Open `.github/workflows/ci.yml`
3. Remove the `PNPM_VERSION: "10"` line from the `env:` section
4. In the `pnpm/action-setup@v4` step, remove the `version: ${{ env.PNPM_VERSION }}` line (the action will auto-detect from `packageManager` in `package.json`)
5. Commit and push: `git add . && git commit -m "fix(ci): let pnpm version auto-detect from packageManager" && git push`

**Alternative:** Go to GitHub → Settings → Actions → General → Workflow permissions → check "Read and write permissions" for the GitHub App.

---

## 🟡 MEDIUM — Blocks Specific Features

### 4. Coach Real Photos

**Impact:** Coach profiles currently use Unsplash stock photos. For credibility with government clients, real headshots are essential.

**Steps:**
1. Collect professional headshot photos for each coach (minimum 400×400px)
2. Upload to a permanent hosting service (S3, Cloudflare R2, or Bunny CDN)
3. Share the URLs with Max — he will update the seed script and database

**Coaches needing photos:**
- Victor Amisi
- Preciosa Baganha
- Steven Barholere (high-res photo exists from PR #67)
- Sue-Anne Richer
- Mamadou Diallo
- Isabelle Chen
- Jean-Pierre Ndayisaba

### 5. Bunny Stream API Key

**Impact:** Blocks video hosting for lesson content. Without this, lessons can only have text/image content.

**Steps:**
1. Go to [Bunny.net Dashboard → Stream](https://dash.bunny.net/stream)
2. Create a new video library (or use existing)
3. Go to API → Copy the **API Key** and **Library ID**
4. Share with Max — he will configure in Railway env vars

### 6. Email Service Provider

**Impact:** Blocks transactional emails (enrollment confirmations, password resets, notifications).

**Steps:**
1. Choose a provider: SendGrid (recommended), AWS SES, or Mailgun
2. Create an account and get API credentials
3. Share with Max — he will configure the email delivery pipeline

---

## 🟢 LOW — Nice to Have

### 7. Custom Domain DNS Cutover

**Impact:** Currently accessible at `new-rusingacademy-project-production.up.railway.app`. Professional URL needed for launch.

**Steps:**
1. Go to your DNS provider (where `rusingacademy.ca` is registered)
2. Add a CNAME record: `@` → Railway-provided domain
3. In Railway, add custom domain `rusingacademy.ca`
4. SSL certificate will auto-provision

**Full plan:** See `reporting/DNS_CUTOVER_PLAN.md`

### 8. Government Reporting Format Specification

**Impact:** The government compliance report generator exists but needs confirmation of the exact format required by Treasury Board or your target departments.

**Steps:**
1. Confirm which reporting format is required (CSV, PDF, specific template)
2. Share any sample reports or templates from existing government contracts
3. Max will align the report generator to match

---

## Action Priority Matrix

| # | Action | Severity | Time to Complete | Blocks |
|---|--------|----------|------------------|--------|
| 1 | DATABASE_URL for seeding | 🔴 CRITICAL | 2 minutes | Everything |
| 2 | Stripe webhook config | 🟠 HIGH | 5 minutes | Payments |
| 3 | CI workflow push | 🟠 HIGH | 5 minutes | CI/CD |
| 4 | Coach real photos | 🟡 MEDIUM | 1 hour | Credibility |
| 5 | Bunny Stream API key | 🟡 MEDIUM | 10 minutes | Video content |
| 6 | Email service provider | 🟡 MEDIUM | 15 minutes | Emails |
| 7 | DNS cutover | 🟢 LOW | 30 minutes | Custom domain |
| 8 | Gov reporting format | 🟢 LOW | N/A | Compliance reports |

---

*This file is updated automatically as blockers are resolved. Last check: February 16, 2026.*
