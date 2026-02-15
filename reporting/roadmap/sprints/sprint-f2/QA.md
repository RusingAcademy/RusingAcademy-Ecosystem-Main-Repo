# Sprint F2 — Quality Assurance Checklist

## Pre-Merge Verification

### Syntax & Build
| Check | Status |
|-------|--------|
| Flashcards.tsx passes syntax check | PASS |
| Vocabulary.tsx passes syntax check | PASS |
| flashcards.ts passes syntax check | PASS |
| LanguageContext.tsx passes syntax check | PASS |
| All new `t()` keys exist in both EN and FR | PASS |

### Backend Endpoint Match
| Frontend Call | Backend Endpoint | Status |
|---------------|-----------------|--------|
| `trpc.flashcards.getStreak` | `getStreak` | PASS |
| `trpc.flashcards.recordSession` | `recordSession` | PASS |
| All 11 flashcards calls | 11 endpoints | PASS |
| All 5 vocabulary calls | 5 endpoints | PASS |

### Feature Verification
| Feature | Status |
|---------|--------|
| Session timer starts on review begin | PASS |
| Session timer stops on review complete | PASS |
| Session summary shows cards/rate/time | PASS |
| Streak display in stats bar | PASS |
| Keyboard Space/Enter flips card | PASS |
| Keyboard 1-4 rates card when flipped | PASS |
| Keyboard ignored when typing in input | PASS |
| Mastery progress bar on vocab cards | PASS |
| Progress bar color matches mastery level | PASS |
| recordSession called on review complete | PASS |
| ON DUPLICATE KEY UPDATE aggregates daily | PASS |

### Regression Checks
| Area | Status |
|------|--------|
| Deck CRUD unchanged | PASS |
| Card CRUD unchanged | PASS |
| SM-2 review algorithm unchanged | PASS |
| Vocabulary add/delete unchanged | PASS |
| Vocabulary quiz flow unchanged | PASS |
| AI vocabulary suggestions unchanged | PASS |
| All bilingual keys from F1 preserved | PASS |

## Post-Merge Smoke Test Plan
1. Create a deck and add 3 cards
2. Start review — verify timer starts
3. Use keyboard shortcuts to flip and rate
4. Complete review — verify session summary appears
5. Verify streak count increments
6. Check vocabulary mastery progress bars
7. Run vocabulary quiz — verify keyboard hint shows
