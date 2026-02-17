# Dashboard Unification — Architecture Design

## Current State (4 separate dashboards)

| Dashboard | File | Lines | Layout | Navigation | Sub-pages |
|-----------|------|-------|--------|------------|-----------|
| Admin | AdminControlCenter.tsx + AdminLayout.tsx | 88 + 250 | Sidebar + sectionMap registry | Collapsible sidebar, sections by permission | 30+ sections via sectionMap |
| Learner | LearnerDashboard.tsx | 832 | Monolithic page | Quick action grid, inline links | LearnerCourses, LearnerProgress, LearnerPayments, LearnerFavorites, LearnerLoyalty, LearnerReferrals, LearnerSettings |
| Coach | CoachDashboard.tsx | 873 | Monolithic page | Inline links, no sidebar | CoachEarnings, CoachEarningsHistory, CoachPayments, CoachGuide, CoachTerms, CoachProfileEditor, CoachAvailabilityPage |
| HR | HRDashboard.tsx | 1100+ | Monolithic page with tabs | 5 internal tabs (overview, team, cohorts, budget, reports) | None (all inline) |

## Target Architecture

### One unified AppLayout with role-based sidebar

Roles hierarchy: `learner < coach < hr_admin < admin`

### Sidebar sections by role

#### PERSONAL (all roles)
- Dashboard (overview — role-specific content)
- My Courses
- My Progress
- My Sessions
- My Payments
- Favorites
- Settings

#### PRACTICE (all roles)
- AI Practice
- Conversation Practice
- Practice History
- Badges & Rewards

#### COACHING (coach, hr_admin, admin)
- My Students
- Availability
- Coach Profile
- Earnings
- Coach Guide

#### ORGANIZATION (hr_admin, admin)
- Team Overview
- Cohorts
- Budget
- Compliance Reports

#### ADMIN (admin only)
- Existing AdminControlCenter sections (30+)

### Route structure
- `/app` → unified dashboard
- `/app/:section` → section pages
- `/learn/:courseId/:lessonId` → immersive learn portal (Phase 2)

### Key decisions
1. AppLayout reuses AdminLayout pattern (sidebar + main content + top bar)
2. Each section = a lazy-loaded component (sectionMap registry)
3. Existing page components are NOT modified — wrapped in AppLayout
4. Admin sections stay at /admin/* (backward compat) but also accessible from /app/admin/*
5. DashboardRouter redirects to /app based on role
