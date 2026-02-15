# Sprint Y1-W2-S11 — SLE Exam Simulation & Assessment Engine

## Goal
Fix critical gaps in the assessment infrastructure: register missing routers, create the mockSle backend, wire QuizPage to database questions, and build a learner-facing SLE Exam History dashboard.

## Scope

### Backend Fixes
1. **Register adminQuiz router** in appRouter (11 endpoints currently orphaned)
2. **Create mockSle router** with `create`, `complete`, `getHistory`, `generateQuestions` endpoints
3. **Wire courses.getQuiz** to return database questions instead of empty fallback

### Frontend Enhancements
4. **Wire QuizPage** to use database questions via `courses.getQuiz` with fallback to generated questions
5. **Create SLE Exam History page** — learner-facing dashboard showing exam attempts, score trends, and readiness indicators
6. **Enhance AssessmentsAdmin** — from 107-line stub to functional admin assessment overview

## Risks
- mockSle router needs AI question generation which requires OpenAI API key
- Written exam question seeding requires content review
- QuizPage refactor must preserve existing gamification integration

## Success Metrics
- adminQuiz router accessible from admin panel
- MockSLEExam page loads without crash
- QuizPage renders database questions when available
- SLE Exam History page shows learner's exam journey
- Build passes with zero regressions
