# Sprint F5 — Implementation Report

## Architecture

Sprint F5 creates a **dailyGoals router** that acts as a bridge between the flashcard review system (Sprint E4/F2) and the gamification system (existing). This enables the retention loop:

```
Learner reviews flashcards → recordDailyActivity → XP awarded + streak updated → streak display refreshed
```

## Backend: `server/routers/dailyGoals.ts`

### getStreak (query)
- Returns current streak, longest streak, total XP, level
- Calculates daily goal progress from `flashcard_study_sessions` table
- Graceful fallback if session table doesn't exist yet
- Used by: DailyReview page, Achievements page

### recordDailyActivity (mutation)
- Input: `activityType` (enum of 6 types) + `itemsCompleted`
- Awards XP based on activity type (5-25 XP per item)
- Updates streak: consecutive day = increment, same day = no change, gap = reset to 1
- Tracks longest streak
- Returns: xpEarned, newStreak, levelUp, newLevel
- Called after: completing a review session in DailyReview

### getWeeklySummary (query)
- Returns 7-day activity array with date, active status, cards reviewed
- Used for the weekly activity heatmap in DailyReview

## Frontend: DailyReview.tsx

### New Features
1. **Streak display** — Fire icon with current streak days and total XP in header
2. **Weekly activity heatmap** — 7-day grid with intensity colors (0/1-4/5-9/10+)
3. **Daily goal progress bar** — Shows progress toward daily target (10 cards)
4. **XP reward banner** — Animated banner showing XP earned after session completion
5. **Session summary** — Score breakdown (easy/good/hard/again counts)
6. **Keyboard shortcuts** — Space to flip, 1-4 to rate (with visible key hints)
7. **Level-up notification** — Badge animation when XP crosses level threshold

## Frontend: Achievements.tsx

### Bug Fix
- **Before**: Called `trpc.gamification.getProfile.useQuery()` — endpoint does not exist
- **After**: Uses `trpc.gamification.getMyStats.useQuery()` + `trpc.gamification.getMyBadges.useQuery()`

### Bilingual Enhancement
- All 14 badge names/descriptions now have EN + FR variants
- All 7 milestone titles have EN + FR variants
- Tab labels, section headers, and stat labels all bilingual
- Uses `useLanguage()` hook with `language === "fr"` conditional

## Files Modified

| File | Action | Key Change |
|------|--------|------------|
| `server/routers/dailyGoals.ts` | Created | 3 endpoints, ~170 lines |
| `server/routers.ts` | Edited | Import + registration (+2 lines) |
| `client/src/pages/DailyReview.tsx` | Rewritten | Streak, heatmap, XP rewards |
| `client/src/pages/Achievements.tsx` | Rewritten | Fixed tRPC calls, bilingual |

## Zero Regressions

- No existing routers modified
- No schema changes
- Gamification system untouched (only consumed, not modified)
- All other Skill Lab pages unchanged
