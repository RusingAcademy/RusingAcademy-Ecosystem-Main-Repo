# Sprint F1 — Blockers & Risks

## Active Blockers
None.

## Resolved Issues
| Issue | Resolution |
|-------|-----------|
| LanguageContext uses flat keys, not nested | Used flat `domain.key` pattern consistently |
| Some pages used `Sidebar` directly instead of `DashboardLayout` | Preserved existing layout pattern per page |
| ListeningLab uses `Sidebar` + manual layout | Kept existing pattern to avoid layout regression |
| WeeklyChallenges uses `DashboardLayout` | Preserved existing pattern |
| StudyGroups uses `container` div layout | Preserved existing pattern |

## Known Limitations
1. **ListeningLab exercises are French-only content** — The listening exercises themselves are in French (which is correct for SLE preparation). Only the UI chrome is bilingual.
2. **WritingPortfolio prompts are bilingual** — Writing prompts already had `en`/`fr` fields, now properly displayed based on language.
3. **WeeklyChallenges card content** — Challenge titles/descriptions use `titleFr`/`title` fields from the database, requiring admin to populate both.

## Deferred to Sprint F2
- Flashcard session flow improvements (resume, scoring, streaks)
- Vocabulary mastery progression indicators
- Grammar drill performance analytics
