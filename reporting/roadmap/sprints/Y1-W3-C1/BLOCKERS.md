# Sprint Y1-W3-C1 — Blockers

## No Blockers

Sprint C1 has no blockers. All changes are self-contained and require no external configuration, secrets, or DNS changes.

## Recommendations for Steven

1. **Create quiz-type lessons** in the Course Builder if none exist yet, so the Quiz Management page has content to display.
2. **Test the drag-and-drop reorder** on production to verify the `reorderQuizQuestions` mutation persists correctly.
3. **Consider consolidating** the inline `admin.*` quiz endpoints with the `adminQuiz` router in a future cleanup sprint to eliminate duplication.
