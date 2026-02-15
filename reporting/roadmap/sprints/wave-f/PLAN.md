# Wave F: Skill Labs Productization & Learner UX

**Date**: 2026-02-15
**Baseline**: main @ ef9fa4e (post Wave E)

## Audit Summary

The Wave F audit identified three critical gaps across the 9 Skill Lab learner pages and 6 admin pages:

| Gap | Severity | Detail |
|-----|----------|--------|
| Accessibility | P0 | All 8 learner Skill Lab pages have zero ARIA attributes, zero role attributes, zero sr-only classes. WCAG 2.1 AA non-compliant. |
| Bilingual | P0 | Only 4/9 pages import useLanguage; none use t() for actual string translation. ~330 hardcoded English strings across all pages. |
| Admin Content | P1 | All 6 admin Skill Lab pages use mock data with tRPC calls commented out. Admins cannot manage content. |
| Empty States | P1 | No standardized empty-state component. First-time learners see blank pages. |
| Content Seeding | P1 | Zero seed data exists. Skill Labs are structurally complete but content-empty. |
| Retention Loops | P2 | Challenges router is a stub. No streaks, notifications, or reminders. |

## Sprint Plan

### Sprint F1: Bilingual + Accessibility + Empty States (P0)
**Scope**: All 9 learner Skill Lab pages.
**Done criteria**:
- Every user-facing string uses `useLanguage()` with `language === "fr"` ternary or `t()` key.
- FR/EN translations added to `en.ts` / `fr.ts` for all Skill Lab strings.
- ARIA labels on all interactive elements (buttons, inputs, cards, modals).
- `role` attributes on semantic sections.
- Keyboard navigation support (focus rings, tab order).
- Professional empty states with bilingual CTA on every page.

### Sprint F2: Flashcards & Vocabulary UX Enhancement (P0/P1)
**Scope**: `Flashcards.tsx`, `Vocabulary.tsx`, `DailyReview.tsx`.
**Done criteria**:
- Review session flow with progress bar, card flip animation, and scoring summary.
- "Resume where you left off" capability.
- Vocabulary mastery visualization (progress bars per word).
- Daily Review shows streak count and motivational messaging.

### Sprint F3: Grammar/Reading/Writing/Listening Labs UX (P1)
**Scope**: `GrammarDrills.tsx`, `ReadingLab.tsx`, `WritingPortfolio.tsx`, `ListeningLab.tsx`.
**Done criteria**:
- Consistent layout and UX patterns across all four labs.
- History view with date, score, and topic.
- Stats dashboard with performance trends.
- Writing portfolio with submission status indicators.

### Sprint F4: Admin Content Management Wiring (P1)
**Scope**: All 6 admin Skill Lab pages.
**Done criteria**:
- Replace all mock data with real tRPC calls.
- Admin CRUD for flashcard decks/cards, vocabulary banks, grammar drills.
- Content import capability (CSV/JSON).
- Seed data script for initial content.

### Sprint F5: Retention Loops Activation (P2)
**Scope**: `WeeklyChallenges.tsx`, `DailyReview.tsx`, streak system.
**Done criteria**:
- Challenges backend fully functional (not stub).
- Streak tracking with visual indicators.
- Challenge completion and reward system.
