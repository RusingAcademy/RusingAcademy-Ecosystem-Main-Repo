# Sprint F5 — QA Checklist

## Backend Verification

| Test | Status |
|------|--------|
| `dailyGoals.ts` file syntax valid | PASS |
| Router exported correctly | PASS |
| Router imported in `routers.ts` | PASS |
| Router registered in `appRouter` as `dailyGoals` | PASS |

## Frontend-Backend Match

| Frontend Call | Backend Endpoint | Match |
|---------------|-----------------|-------|
| `trpc.dailyGoals.getStreak` | `dailyGoalsRouter.getStreak` | PASS |
| `trpc.dailyGoals.getWeeklySummary` | `dailyGoalsRouter.getWeeklySummary` | PASS |
| `trpc.dailyGoals.recordDailyActivity` | `dailyGoalsRouter.recordDailyActivity` | PASS |
| `trpc.dailyReview.getDueCards` | `dailyReviewRouter.getDueCards` (Sprint E4) | PASS |
| `trpc.flashcards.reviewCard` | `flashcardsRouter.reviewCard` (Sprint E4) | PASS |
| `trpc.gamification.getMyStats` | `gamificationRouter.getMyStats` (existing) | PASS |
| `trpc.gamification.getMyBadges` | `gamificationRouter.getMyBadges` (existing) | PASS |

**7/7 endpoints verified** — 100% match rate.

## Bug Fix Verification

| Bug | Before | After | Status |
|-----|--------|-------|--------|
| Achievements: `getProfile` not found | `trpc.gamification.getProfile` (DNE) | `trpc.gamification.getMyStats` + `getMyBadges` | FIXED |

## Bilingual Verification

| Component | EN | FR | Status |
|-----------|----|----|--------|
| Badge names (14) | Yes | Yes | PASS |
| Badge descriptions (14) | Yes | Yes | PASS |
| Milestone titles (7) | Yes | Yes | PASS |
| Tab labels (3) | Yes | Yes | PASS |
| Stat labels (8) | Yes | Yes | PASS |

## Regression Check

| Area | Status |
|------|--------|
| Flashcards page unchanged | PASS |
| Vocabulary page unchanged | PASS |
| GrammarDrills page unchanged | PASS |
| Other Skill Lab pages unchanged | PASS |
| Gamification router unchanged | PASS |
| Schema unchanged | PASS |
