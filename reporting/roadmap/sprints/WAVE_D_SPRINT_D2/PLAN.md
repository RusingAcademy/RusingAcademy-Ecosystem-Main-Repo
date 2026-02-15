# Sprint D2 — Coach Dashboard Enhancement

## Goal
Enhance the Coach Dashboard with real-time learner progress tracking, at-risk learner alerts, and wired session notes — transforming it from a session-centric view into a comprehensive coaching command center.

## Scope
1. **AtRiskLearnerAlerts**: New component using coachMetrics.getAtRiskLearners endpoint
2. **LearnerProgressCards**: New component with SLE level badges, cohort summary, activity status
3. **Session Notes Save**: Wire the existing save button to coach.saveSessionNotes mutation
4. **Integration**: Replace basic learner list with enhanced LearnerProgressCards; add alerts to sidebar

## Success Metrics
- Build passes with zero errors
- At-risk learners display with risk level badges (High/Medium)
- Learner SLE levels (Oral/Written/Reading) visible on dashboard
- Session notes save to database with toast confirmation
- All labels bilingual (EN/FR)
