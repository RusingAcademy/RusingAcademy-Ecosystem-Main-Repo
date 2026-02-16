# Blockers Requiring Steven's Action

## 1. Stripe API Key — Invalid Format

**Severity:** Medium (non-blocking for core platform, blocks payment flows)

**Symptom:** The `/api/health` endpoint reports `"Invalid API Key provided: sk_test_****6DSG"`. All Stripe-dependent features (paid course checkout, coach payouts, membership) will fail until this is resolved.

**Root Cause:** The `STRIPE_SECRET_KEY` environment variable in Railway appears to contain an invalid or expired Stripe test key.

**Steps to Fix:**
1. Go to [Stripe Dashboard → Developers → API Keys](https://dashboard.stripe.com/test/apikeys)
2. Copy the current **Secret key** (starts with `sk_test_`)
3. Go to [Railway Project → Variables](https://railway.com/project/b478cc48-f3ae-475b-b78e-21fe174a6c0f/service/5d1b3aa5-b0e2-44a6-afd8-1acd01185f36/variables)
4. Update `STRIPE_SECRET_KEY` with the new key
5. Also verify `STRIPE_WEBHOOK_SECRET` matches the webhook endpoint configured in Stripe Dashboard
6. Railway will auto-redeploy after the variable update

**Verification:** After updating, check `https://new-rusingacademy-project-production.up.railway.app/api/health` — the `stripe.status` should change from `"error"` to `"ok"`.

## 2. Stripe Webhook Endpoint Configuration

**Severity:** Medium (blocks paid enrollment completion)

**Symptom:** Even with a valid Stripe key, the webhook endpoint must be configured in the Stripe Dashboard to receive `checkout.session.completed` events.

**Steps to Fix:**
1. Go to [Stripe Dashboard → Developers → Webhooks](https://dashboard.stripe.com/test/webhooks)
2. Add endpoint: `https://new-rusingacademy-project-production.up.railway.app/api/stripe/webhook`
3. Select events: `checkout.session.completed`, `invoice.paid`, `customer.subscription.updated`, `customer.subscription.deleted`
4. Copy the **Signing secret** and update `STRIPE_WEBHOOK_SECRET` in Railway variables

**Verification:** Create a test checkout session and verify the webhook is received (check Railway deploy logs for webhook processing messages).
