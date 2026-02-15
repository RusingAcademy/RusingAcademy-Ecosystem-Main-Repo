# Sprint H2 — Coach Portal & Application Backend

## Objective
Wire all 5 coach portal sub-pages from mock data to real backend tRPC endpoints, completing the Coach Portal as a fully functional dashboard.

## Scope
1. **CoachDashboardHome**: Wired to `coach.getMyProfile`, `coach.getTodaysSessions`, `coach.getEarningsSummaryV2`, `coach.getMyLearners`
2. **CoachSessions**: Wired to `coach.getUpcomingSessions`, `coach.getPendingRequests`, `coach.getMonthSessions`, `coach.confirmSession`, `coach.declineSession`, `coach.completeSession`
3. **CoachStudents**: Wired to `coach.getMyLearners` with search and status filters
4. **CoachRevenue**: Wired to `coach.getEarningsSummaryV2`, `coach.getPayoutLedger`, `coach.getMyLearners` with dynamic commission tier calculation
5. **CoachPerformance**: Wired to `coach.getMyProfile`, `coach.getEarningsSummaryV2`, `coach.getMyLearners` with derived performance metrics

## Key Decisions
- All 5 pages were pure UI shells with hardcoded mock data
- The existing coach router already had 41 endpoints — no new backend code was needed
- BecomeCoach application flow (CoachApplicationWizard + ApplicationStatusTracker) was already fully wired
- Commission tier calculation is derived from learner count (Bronze < 5, Silver 5+, Gold 15+, Platinum 30+)

## Done Criteria
- [x] All 5 coach sub-pages load real data from the database
- [x] All 11 frontend tRPC calls match backend endpoints (100%)
- [x] Loading states and empty states are professional and bilingual
- [x] BecomeCoach application flow verified as already functional
