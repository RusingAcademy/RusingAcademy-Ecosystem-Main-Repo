# Sprint D1 — QA Checklist

## Build Verification
- [x] `npx vite build` passes — 57.81s, zero errors
- [x] No TypeScript compilation errors

## Smoke Tests

### OnboardingWizard Flow (EN)
- [ ] Navigate to `/onboarding` — Welcome step renders
- [ ] Click "Get Started" — Context step renders
- [ ] Fill department, position, select French, select Oral → Next
- [ ] Select current level A → Next
- [ ] Answer 5 diagnostic questions → Level estimate displays
- [ ] Select target level B → Next
- [ ] Select "SLE Exam Preparation" → Next
- [ ] Select "Regular — 5h/week" → Click "Complete Setup"
- [ ] Verify toast success message
- [ ] Verify completion step shows summary badges + recommendation
- [ ] Click "Go to Dashboard" → navigates to /dashboard

### OnboardingWizard Flow (FR)
- [ ] Switch language to French
- [ ] Navigate to `/onboarding` — "Bienvenue" step renders
- [ ] All 8 steps display French content
- [ ] Diagnostic questions are in French
- [ ] Completion recommendation is in French

### Diagnostic Skip
- [ ] On diagnostic step, click "Skip diagnostic"
- [ ] Verify self-reported level is used instead
- [ ] Continue through remaining steps normally

### Backend Endpoints
- [ ] `learner.saveOnboarding` creates learnerProfile for new users
- [ ] `learner.saveOnboarding` updates existing learnerProfile
- [ ] `learner.getOnboardingStatus` returns `{ completed: false }` for new users
- [ ] `learner.getOnboardingStatus` returns `{ completed: true }` after onboarding

## Regression Checks
- [ ] Existing `/dashboard` page still loads correctly
- [ ] Existing `/courses` page still loads correctly
- [ ] Admin pages unaffected
