# Sprint C5: Stripe Webhook E2E Hardening

## Goal
Harden the Stripe webhook pipeline with admin visibility, manual retry, latency monitoring, and additional event handlers — making the payment infrastructure production-grade and auditable.

## Scope
1. **Webhook Health Dashboard** — Admin page showing event stats, recent events, failed events
2. **Manual Retry Endpoint** — Allow admin to retry failed webhook events
3. **Webhook Latency Tracking** — Track and display processing time per event
4. **Additional Event Handlers** — trial_will_end, payment_method.attached/detached
5. **Dead Letter Queue Visibility** — Surface events that exhausted retries

## Success Metrics
- Admin can view webhook processing status at a glance
- Admin can retry failed events with one click
- All webhook events have processing latency visible
- Trial expiry notifications trigger automatically

## Dependencies
- Existing `webhookIdempotency.ts` system
- Existing `webhook_events_log` table
