# Sprint F4 — Blockers & Risks

## Current Blockers

None. All deliverables completed successfully.

## Resolved Issues

| Issue | Resolution |
|-------|-----------|
| Large `routers.ts` file (9000+ lines) | Created separate `adminSkillLabs.ts` module instead of inline |
| Mock data patterns varied across pages | Standardized all 5 pages to consistent tRPC query/mutation pattern |

## Known Risks for Future Sprints

| Risk | Severity | Mitigation |
|------|----------|------------|
| Admin pages lack edit modals | Low | Create/update modals can be added incrementally |
| No bulk import for flashcard decks | Medium | CSV/JSON import endpoint should be added in a future sprint |
| Grammar drills admin is read-only | Low | Content creation for grammar drills requires exercise builder UI |
