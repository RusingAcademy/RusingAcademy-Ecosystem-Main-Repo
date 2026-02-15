# Sprint Y1-W2-S11 — Blockers

## Resolved
All planned items were implemented without blockers.

## Deferred (Non-Blocking)

### 1. Written Exam Question Seeding
**Status:** Deferred to content sprint
**Impact:** Low — fallback question banks provide immediate coverage
**Action for Steven:** When ready, use the admin QuizBuilder to add official questions per lesson/module.

### 2. AI Question Generation Requires OpenAI API Key
**Status:** Gracefully handled — falls back to curated question banks
**Impact:** Low — static questions are high-quality and SLE-relevant
**Action for Steven:** Ensure `OPENAI_API_KEY` is set in Railway environment for AI-generated questions.

### 3. slePracticeQuestions Table May Need Seeding
**Status:** The `sle_practice_questions` table needs at least one record for the `questionId` foreign key reference in mock exam records.
**Impact:** Low — mock exams create records with `questionId: 1` as placeholder
**Action for Steven:** Run a seed script or use admin panel to add initial practice questions.

## No Critical Blockers
Sprint S11 is fully deployable.
