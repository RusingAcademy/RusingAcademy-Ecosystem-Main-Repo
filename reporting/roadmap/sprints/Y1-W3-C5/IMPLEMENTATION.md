# Sprint C5: Stripe Webhook E2E Hardening — IMPLEMENTATION

## Date: 2026-02-15
## Branch: `feat/Y1-W3-C5-stripe-webhook-hardening`
## Status: COMPLETE

---

## Changes Summary

### 1. Backend: Webhook Handler Hardening
**File**: `server/stripe/webhook.ts`

Added 3 new event handlers to the Stripe webhook switch:

| Event | Handler | Description |
|-------|---------|-------------|
| `customer.subscription.trial_will_end` | Full handler | Looks up user by stripeCustomerId, creates learner notification + admin notification |
| `payment_method.attached` | Logging handler | Logs payment method attachment for audit trail |
| `payment_method.detached` | Logging handler | Logs payment method detachment for audit trail |

Also added proper top-level imports for `createNotification`, `getDb`, and `sql` to eliminate mid-file re-imports.

### 2. Backend: Admin Stability Router Hardening
**File**: `server/routers/adminStability.ts`

Added 4 new endpoints:

| Endpoint | Type | Description |
|----------|------|-------------|
| `retryWebhookEvent` | mutation | Reset failed event status to `pending_retry`, decrement attempt counter |
| `getWebhookEventDetail` | query | Get detailed info + calculated latency for a specific event |
| `getFailedWebhookEvents` | query | Dead letter queue — list all failed/pending_retry events (limit 50) |
| `getWebhookLatencyStats` | query | Avg and max latency in ms, total processed count |

### 3. Frontend: WebhookHealthDashboard Admin Page (NEW)
**File**: `client/src/pages/admin/WebhookHealthDashboard.tsx`

Full bilingual (EN/FR) webhook health dashboard with:
- System health indicator (Healthy/Degraded/Critical) based on failed event count
- Processing overview stats (total, processed, failed, in-progress)
- Latency metrics (avg, max, total processed)
- Dead letter queue with one-click retry button per failed event
- Recent events table with status badges
- Refresh button for real-time monitoring

### 4. Integration Points
- **AdminControlCenter**: Added `webhook-health` section mapping
- **AdminLayout sidebar**: Added "Webhook Health" nav item under SYSTEM section
- **App.tsx**: Added `/admin/webhook-health` route
- **admin/index.ts**: Added WebhookHealthDashboard export

---

## Files Changed

| File | Action | Lines Changed |
|------|--------|---------------|
| `server/stripe/webhook.ts` | MODIFIED | +55 (3 event handlers + imports) |
| `server/routers/adminStability.ts` | MODIFIED | +100 (4 new endpoints) |
| `client/src/pages/admin/WebhookHealthDashboard.tsx` | NEW | ~280 |
| `client/src/pages/admin/index.ts` | MODIFIED | +1 |
| `client/src/pages/AdminControlCenter.tsx` | MODIFIED | +2 |
| `client/src/components/AdminLayout.tsx` | MODIFIED | +1 |
| `client/src/App.tsx` | MODIFIED | +1 |

## Database Migrations
**None required** — Uses existing `webhook_events_log` table.

## Rollback Plan
```bash
git revert <commit-hash>
```
All new endpoints are additive. Removing them has zero impact on existing webhook processing.
