# Sprint F4 — Admin Content Management (Skill Labs)

## Objective

Wire all 5 admin Skill Lab pages from mock data to real backend tRPC endpoints, enabling administrators to manage flashcard decks, vocabulary word banks, grammar drill analytics, daily review streaks, and study groups through a live database-backed interface.

## Scope

| Area | Deliverable |
|------|-------------|
| Backend | `server/routers/adminSkillLabs.ts` — 5 routers with 15+ endpoints |
| Frontend | 5 admin pages rewritten from mock to live tRPC queries/mutations |
| Seed Data | One-click SLE seed deck (flashcards) and SLE seed words (vocabulary) |
| Registration | All 5 routers registered in `appRouter` via `routers.ts` |

## Pages Wired

| Admin Page | Router Name | Endpoints |
|------------|-------------|-----------|
| AdminFlashcards | `adminFlashcards` | getStats, listDecks, createSeedDeck, deleteDeck |
| AdminVocabulary | `adminVocabulary` | getStats, listWords, listCategories, seedWords |
| GrammarDrills | `adminGrammarDrills` | getStats, listTopics, listResults |
| AdminDailyReview | `adminDailyReview` | getStats (with leaderboard) |
| AdminStudyGroups | `adminStudyGroups` | list, create, update, delete |

## Done Criteria

- [ ] All 5 admin pages load real data from the database (no mock data)
- [ ] Seed data buttons create real records in the database
- [ ] Delete operations cascade correctly
- [ ] Empty states display professionally when no data exists
- [ ] All tRPC calls compile without type errors
