# Sprint C3: Notifications & Communication Engine — BLOCKERS

## Status: No Critical Blockers

All Sprint C3 deliverables are complete and functional without external dependencies.

## Notes for Steven

| Item | Description | Priority |
|------|-------------|----------|
| Notification preferences persistence | Currently stored in `localStorage`. Future sprint should persist to `learnerProfiles` table for cross-device sync. | Low |
| Email notification integration | The `notifyLearner` service creates in-app notifications only. Email dispatch can be added by calling the existing `emailService` alongside the DB insert. | Medium |
| Broadcast rate limiting | No rate limiting on admin broadcast. For production, consider adding a cooldown (e.g., max 1 broadcast per hour). | Low |
