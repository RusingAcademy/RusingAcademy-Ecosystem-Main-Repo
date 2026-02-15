# Sprint D2 — Coach Dashboard Audit Notes

## Existing Infrastructure
- **CoachDashboard** (437 lines): Today's sessions, upcoming sessions, learner list, earnings, session notes, Stripe status
- **CoachAnalytics** (357 lines): Performance analytics component
- **CoachCalendar** (559 lines): Calendar management
- **CoachSidebar** (174 lines): Full nav with Dashboard, Students, Sessions, Revenue, Performance, Resources, Feedback, Messages, Calendar, Profile, Settings, Help
- **coach.ts router** (1400 lines): 15+ endpoints including myProfile, getAvailability, getEarningsSummary, getUpcomingSessions, getMyLearners, getPendingRequests, getTodaysSessions
- **coachLearnerMetrics.ts** (265 lines): getLearnersWithMetrics, getAtRiskLearners, getCohortSummary

## Enhancement Opportunities
1. **Learner Progress Cards**: The CoachDashboard shows learners but doesn't show their SLE level progress or course completion
2. **Session Notes**: Save mutation not wired — just local state
3. **At-Risk Learner Alerts**: coachLearnerMetrics has getAtRiskLearners but it's not displayed in the dashboard
4. **Quick Actions**: No quick action to schedule a session or send a message to a learner
5. **Revenue Trend**: No chart showing earnings over time
6. **Bilingual**: Labels are inline but not comprehensive

## Plan
- Wire session notes save to backend
- Add at-risk learner alerts to dashboard
- Add learner SLE progress cards
- Add quick action buttons
- Ensure all labels are bilingual
