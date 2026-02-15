# Sprint F2 — Blockers & Risks

## Active Blockers
None.

## Resolved Issues
| Issue | Resolution |
|-------|-----------|
| Streak calculation edge case: user studies at 11:59 PM | Uses `CURDATE()` server-side, so timezone is server-based (consistent) |
| Multiple review sessions per day | `ON DUPLICATE KEY UPDATE` aggregates cardsReviewed and correctCount |
| Keyboard shortcuts conflicting with form inputs | Event handler checks `e.target instanceof HTMLInputElement` |

## Known Limitations
1. **Streak timezone**: Streak is calculated based on server timezone (UTC), not user's local timezone. For Canadian users, this means the "day boundary" is at 7 PM EST / 4 PM PST.
2. **Streak heatmap**: The `recentDays` data is returned but not yet visualized as a heatmap. Deferred to a future sprint.
3. **Vocabulary quiz keyboard**: Only Enter key is supported (to check answer). Full keyboard navigation for correct/incorrect buttons deferred.

## Deferred to Sprint F3
- Grammar/Reading/Writing/Listening Labs consistent UX improvements
- Heatmap visualization for study streaks
- Advanced quiz modes (multiple choice, fill-in-the-blank)
