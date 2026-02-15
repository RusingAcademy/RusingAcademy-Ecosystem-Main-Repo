# Sprint D3 — HR/Organization Portal Audit

## Existing Infrastructure
- **HR Router**: 754 lines, 18 endpoints (getOrganization, getDashboardStats, getLearners, inviteLearner, getCohorts, createCohort, updateCohort, addCohortMember, removeCohortMember, getAssignments, createAssignment, getProgressReport, exportReport, getAssessments, getAnalytics, getOnboardingChecklist, getMyOrganization)
- **HRDashboard component**: 1167 lines (comprehensive inline dashboard)
- **HR Pages**: HRDashboardHome (330), HRTeam (212), HRCohorts (197), HRBudget (186), HRCompliance (236)
- **HRSidebar**: 157 lines with 11 nav items
- **HRLayout**: 48 lines (wrapper)

## Routes Registered in App.tsx
- /hr/portal → HRDashboardHome
- /hr/portal/dashboard → HRDashboardHome
- /hr/portal/team → HRTeam
- /hr/portal/cohorts → HRCohorts
- /hr/portal/budget → HRBudget
- /hr/portal/compliance → HRCompliance

## Missing Routes (in sidebar but no page)
- /hr/portal/reports → No page
- /hr/portal/calendar → No page
- /hr/portal/notifications → No page
- /hr/portal/organization → No page
- /hr/portal/settings → No page
- /hr/portal/help → No page

## Key Gaps
1. **6 sidebar nav items lead to 404** — critical UX issue
2. HRSidebar has hardcoded "45 participants" and "Treasury Board Secretariat" — should be dynamic
3. No training calendar page
4. No organization profile page
5. No HR notifications page
6. No HR settings page
