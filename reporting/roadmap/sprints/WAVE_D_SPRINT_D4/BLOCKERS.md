# Sprint D4 — Blockers

## No Critical Blockers

All 8 templates created and 3 wired. No Steven action required for this sprint.

## Future Wiring (Non-Blocking)

| Template | Trigger Point | Action Needed |
|----------|--------------|---------------|
| Streak Milestone | Gamification `checkStreak` function | Wire when streak check runs daily |
| Trial Expiring | Stripe webhook `customer.subscription.trial_will_end` | Wire in webhook handler (event handler already exists from C5) |
| Invoice/Receipt | Stripe webhook `invoice.paid` | Wire when invoice events are enabled |
| Coach Assignment | Coach-learner pairing flow | Wire when coach assignment is automated |
| HR Compliance Alert | Scheduled compliance check | Wire when compliance scheduler is built |
