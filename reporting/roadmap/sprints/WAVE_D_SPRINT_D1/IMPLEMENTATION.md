# Sprint D1 — Implementation Details

## Files Changed

### Backend (1 file)
| File | Change |
|------|--------|
| `server/routers/learnerProfile.ts` | Added `saveOnboarding` mutation + `getOnboardingStatus` query |

### Frontend (1 file)
| File | Change |
|------|--------|
| `client/src/pages/OnboardingWizard.tsx` | Complete rewrite — 8-step bilingual wizard |

## New Endpoints

| Endpoint | Type | Description |
|----------|------|-------------|
| `learner.saveOnboarding` | mutation | Saves onboarding data to learnerProfiles (creates or updates) |
| `learner.getOnboardingStatus` | query | Returns completion status and existing profile data |

## OnboardingWizard Steps (8 total)

| Step | Content | Data Collected |
|------|---------|----------------|
| 0 - Welcome | Brand introduction, tagline | None |
| 1 - Context | Department, position, target language, focus area | department, position, targetLanguage, primaryFocus |
| 2 - Current Level | Self-assessment X/A/B/C selection | currentLevel |
| 3 - Diagnostic | 5-question quiz with scoring | diagnosticScore, diagnosticLevel |
| 4 - Target Level | Target SLE level selection | targetLevel |
| 5 - Goal | Learning goal selection (5 options) | learningGoal |
| 6 - Schedule | Weekly hours commitment (4 tiers) | weeklyHours, preferredTime |
| 7 - Complete | Summary, recommendations, navigation | None (display only) |

## Diagnostic Scoring Algorithm
- 5 questions × 4 options (0-3 points each) = max 15 points
- 0-3 → Level X (No Level)
- 4-7 → Level A (Beginner)
- 8-11 → Level B (Intermediate)
- 12-15 → Level C (Advanced)

## Database Mapping
- `currentLevel` → JSON `{ reading, writing, oral }` (all set to same level)
- `targetLevel` → JSON `{ reading, writing, oral }`
- `learningGoals` → string (goal key)
- `weeklyStudyHours` → string
- `department`, `position`, `targetLanguage`, `primaryFocus` → direct columns

## Zero Regressions
- No database migrations required
- No existing routes changed
- No existing components modified (full rewrite of OnboardingWizard only)
