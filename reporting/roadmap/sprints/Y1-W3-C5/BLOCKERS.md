# Sprint C5: Stripe Webhook E2E Hardening — BLOCKERS

## Status: No Critical Blockers

All Sprint C5 deliverables are complete and functional.

## Notes for Steven

| Item | Description | Priority |
|------|-------------|----------|
| Stripe webhook endpoint | Ensure the Stripe Dashboard webhook endpoint includes the 3 new event types: `customer.subscription.trial_will_end`, `payment_method.attached`, `payment_method.detached` | High |
| Retry mechanism | The retry button resets the event status but does NOT re-trigger the Stripe event. For full replay, use the Stripe Dashboard "Resend" feature. | Medium |
| Webhook signing secret | Ensure `STRIPE_WEBHOOK_SECRET` is set in Railway environment variables for signature verification | High |
