# Sprint D2 — Implementation Details

## Files Changed

| File | Change Type | Description |
|------|-------------|-------------|
| `client/src/components/AtRiskLearnerAlerts.tsx` | **NEW** | At-risk learner alerts with risk scoring and bilingual labels |
| `client/src/components/LearnerProgressCards.tsx` | **NEW** | Learner progress cards with SLE levels, cohort summary |
| `client/src/components/dashboard/CoachDashboard.tsx` | **MODIFIED** | Integrated new components, wired session notes save |

## New Components

### AtRiskLearnerAlerts
Fetches `coachMetrics.getAtRiskLearners` and displays learners who need attention. Features include risk-level classification (High Risk: >14 days inactive or 3+ missed sessions; Medium Risk: 7-14 days inactive), bilingual labels, empty state with positive messaging, and quick-action message button.

### LearnerProgressCards
Fetches `coachMetrics.getLearnersWithMetrics` and `coachMetrics.getCohortSummary`. Displays SLE level badges (X/A/B/C) for Oral, Written, and Reading with color-coded indicators. Includes cohort summary bar (total learners, active count, average progress), activity status badges, and session count per learner.

## CoachDashboard Changes
The basic "My Learners" card (showing only name + session count) was replaced with the enhanced `LearnerProgressCards` component. `AtRiskLearnerAlerts` was added to the sidebar above earnings. The session notes save button was wired to `coach.saveSessionNotes` mutation with loading state and toast notifications.

## Zero Regressions
No database migrations required. No existing routes changed. No existing components modified beyond CoachDashboard. All existing sidebar navigation preserved.
