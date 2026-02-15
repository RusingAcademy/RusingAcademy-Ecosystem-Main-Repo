# Sprint F5 — Retention Loops (Daily Review Activation, Streaks, Gamification Bridge)

## Objective

Create the retention infrastructure that bridges flashcard reviews with the gamification system, enabling streak tracking, XP rewards, daily goal progress, and weekly activity visualization. Fix broken tRPC calls in the Achievements page.

## Scope

| Area | Deliverable |
|------|-------------|
| Backend | `server/routers/dailyGoals.ts` — 3 endpoints bridging reviews to gamification |
| Frontend | DailyReview page enhanced with streak, heatmap, XP rewards |
| Frontend | Achievements page fixed and made bilingual |
| Registration | dailyGoals router registered in appRouter |

## Endpoints Created

| Endpoint | Purpose |
|----------|---------|
| `dailyGoals.getStreak` | Returns current streak, XP, level, daily goal progress |
| `dailyGoals.recordDailyActivity` | Awards XP, updates streak after review session |
| `dailyGoals.getWeeklySummary` | Returns 7-day activity heatmap data |

## Bug Fixes

| Bug | Fix |
|-----|-----|
| `gamification.getProfile` does not exist | Replaced with `gamification.getMyStats` + `gamification.getMyBadges` |
| Achievements page hardcoded English | Added full bilingual support (EN/FR) |

## Done Criteria

- [x] dailyGoals router created and registered
- [x] DailyReview page shows streak, weekly heatmap, XP rewards
- [x] Achievements page uses correct tRPC endpoints
- [x] All badge/milestone data bilingual
- [x] 7/7 frontend tRPC calls match backend endpoints
