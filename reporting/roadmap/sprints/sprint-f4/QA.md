# Sprint F4 — QA Checklist

## Backend Verification

| Test | Status |
|------|--------|
| `adminSkillLabs.ts` file syntax valid | PASS |
| All 5 routers exported correctly | PASS |
| All 5 routers imported in `routers.ts` | PASS |
| All 5 routers registered in `appRouter` | PASS |
| No duplicate router names in appRouter | PASS |

## Frontend-Backend Match

| Frontend Call | Backend Endpoint | Match |
|---------------|-----------------|-------|
| `trpc.adminFlashcards.getStats` | `adminFlashcardsRouter.getStats` | PASS |
| `trpc.adminFlashcards.listDecks` | `adminFlashcardsRouter.listDecks` | PASS |
| `trpc.adminFlashcards.createSeedDeck` | `adminFlashcardsRouter.createSeedDeck` | PASS |
| `trpc.adminFlashcards.deleteDeck` | `adminFlashcardsRouter.deleteDeck` | PASS |
| `trpc.adminVocabulary.getStats` | `adminVocabularyRouter.getStats` | PASS |
| `trpc.adminVocabulary.listWords` | `adminVocabularyRouter.listWords` | PASS |
| `trpc.adminVocabulary.listCategories` | `adminVocabularyRouter.listCategories` | PASS |
| `trpc.adminVocabulary.seedWords` | `adminVocabularyRouter.seedWords` | PASS |
| `trpc.adminGrammarDrills.getStats` | `adminGrammarDrillsRouter.getStats` | PASS |
| `trpc.adminGrammarDrills.listTopics` | `adminGrammarDrillsRouter.listTopics` | PASS |
| `trpc.adminGrammarDrills.listResults` | `adminGrammarDrillsRouter.listResults` | PASS |
| `trpc.adminDailyReview.getStats` | `adminDailyReviewRouter.getStats` | PASS |
| `trpc.adminStudyGroups.list` | `adminStudyGroupsRouter.list` | PASS |
| `trpc.adminStudyGroups.create` | `adminStudyGroupsRouter.create` | PASS |
| `trpc.adminStudyGroups.delete` | `adminStudyGroupsRouter.delete` | PASS |

**15/15 endpoints verified** — 100% match rate.

## Regression Check

| Area | Status |
|------|--------|
| Learner-facing pages unchanged | PASS |
| Existing admin pages unchanged | PASS |
| Schema tables unchanged | PASS |
| Router registration order preserved | PASS |
