# Sprint F2 — Flashcards & Vocabulary Session Flow, Streaks, Scoring

## Sprint Identity
- **Wave:** F (Skill Labs Production Readiness)
- **Sprint:** F2
- **Branch:** `feat/wave-F2-flashcards-vocabulary-session-flow`
- **Priority:** P0 — Core learner engagement features

## Objective
Enhance the Flashcards and Vocabulary pages with session tracking, streak persistence, keyboard shortcuts, session timer, and mastery progression indicators to create a professional, engaging learning experience.

## Scope

### Backend Changes
| File | Change |
|------|--------|
| `server/routers/flashcards.ts` | +`study_streaks` table, +`getStreak` endpoint, +`recordSession` endpoint |

### Frontend Changes
| File | Change |
|------|--------|
| `Flashcards.tsx` | Full rewrite with session summary view, streak display, keyboard shortcuts, session timer |
| `Vocabulary.tsx` | Mastery progress bars on word cards, keyboard hints in quiz mode |
| `LanguageContext.tsx` | +38 bilingual i18n keys (EN + FR) for streak/session features |

## Key Features
1. **Study Streak Tracking**: Backend table records daily study activity; frontend displays current streak and longest streak
2. **Session Summary**: After completing a review, learners see cards reviewed, correct rate, session time, and streak status
3. **Keyboard Shortcuts**: Space/Enter to flip cards, 1-4 to rate (Flashcards); Enter to check answer (Vocabulary)
4. **Session Timer**: Real-time timer during flashcard review sessions
5. **Mastery Progress Bars**: Visual progress bars on each vocabulary word showing correct/review ratio
6. **Card Status Labels**: Bilingual status labels (New/Learning/Review/Mastered) on flashcard cards

## Acceptance Criteria
- [x] `study_streaks` table created on-the-fly with `CREATE TABLE IF NOT EXISTS`
- [x] `getStreak` returns currentStreak, longestStreak, accuracy, recentDays
- [x] `recordSession` uses `ON DUPLICATE KEY UPDATE` for idempotent daily aggregation
- [x] Flashcards page shows 6-stat bar including streak and accuracy
- [x] Session summary view displays after completing review
- [x] Keyboard shortcuts work during review (Space/Enter to flip, 1-4 to rate)
- [x] Timer counts up during review session
- [x] Vocabulary word cards show mastery progress bars
- [x] All new strings use bilingual `t()` keys
