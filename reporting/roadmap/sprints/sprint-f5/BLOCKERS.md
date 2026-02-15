# Sprint F5 — Blockers & Risks

## Current Blockers

None. All deliverables completed successfully.

## Resolved Issues

| Issue | Resolution |
|-------|-----------|
| `gamification.getProfile` endpoint does not exist | Replaced with `getMyStats` + `getMyBadges` in Achievements page |
| No bridge between flashcard reviews and gamification | Created `dailyGoals` router as the retention bridge |

## Known Risks for Future Sprints

| Risk | Severity | Mitigation |
|------|----------|------------|
| `flashcard_study_sessions` table may not exist on fresh DB | Low | Graceful fallback in `getStreak` and `getWeeklySummary` |
| Push notifications not yet implemented | Medium | Current retention relies on in-app streak display only |
| Email reminders for streak-at-risk not implemented | Medium | Could be added as a cron job in a future sprint |
| Daily goal target (10 cards) is hardcoded | Low | Could be made configurable per user in settings |
