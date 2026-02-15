# Sprint C5: Stripe Webhook E2E Hardening — Audit Notes

## Existing Infrastructure (Strong)
- Idempotency system: `webhookIdempotency.ts` (130 lines) — INSERT IGNORE + retry up to 3x
- Event types handled: 10 (checkout.session.completed, payment_intent.succeeded, charge.refunded, account.updated, payout.paid, subscription.created/updated/deleted, invoice.payment_succeeded/failed)
- Webhook test file: 283 lines
- Stripe signature verification: present
- Error handling: try/catch with markEventFailed

## Gaps Identified
1. **No admin webhook health dashboard** — No visibility into webhook processing status
2. **No webhook event retry mechanism** — Failed events stay failed (no manual retry)
3. **No webhook event detail view** — Admin can't inspect individual event payloads
4. **Missing `customer.subscription.trial_will_end`** — No trial expiry notification
5. **Missing `payment_method.attached/detached`** — No payment method tracking
6. **No dead letter queue** — Events that fail 3x are silently dropped
7. **No webhook latency monitoring** — No tracking of processing time

## Sprint C5 Focus
1. Create admin Webhook Health Dashboard (uses existing `getWebhookEventStats`)
2. Add manual retry endpoint for failed webhook events
3. Add webhook latency tracking (processedAt - createdAt)
4. Add missing event handlers (trial_will_end, payment_method events)
5. Create a webhook event detail view for admin inspection
