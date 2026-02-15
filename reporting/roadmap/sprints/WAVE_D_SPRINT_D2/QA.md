# Sprint D2 — QA Checklist

## Build Verification

| Check | Status |
|-------|--------|
| `npx vite build` passes | PASS — 54.67s, zero errors |
| No TypeScript compilation errors | PASS |

## Smoke Tests

| Test | Steps | Expected |
|------|-------|----------|
| Coach Dashboard loads | Navigate to `/coach/portal/dashboard` | Dashboard renders with all sections |
| At-Risk Alerts display | Check sidebar | AtRiskLearnerAlerts card visible with risk badges or positive empty state |
| Learner Progress Cards | Check main content | LearnerProgressCards with SLE level badges and cohort summary |
| Session Notes Save | Select learner → type note → click Save | Toast "Notes saved successfully" appears |
| Bilingual labels | Switch to French | All labels display in French |
| Empty states | New coach with no learners | Professional empty states with descriptive text |

## Regression Checks

| Area | Status |
|------|--------|
| Today's Sessions card | Preserved |
| Next 7 Days card | Preserved |
| Earnings Summary sidebar | Preserved |
| Stripe Status card | Preserved |
| Coach sidebar navigation | Preserved |
| Admin pages | Unaffected |
