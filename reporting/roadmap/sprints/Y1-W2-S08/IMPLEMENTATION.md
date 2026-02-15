# Sprint Y1-W2-S08 — Implementation Report

## Learner Dashboard Enhancement — Live Data Wiring

### Overview

This sprint transforms the learner dashboard from a static mockup with hardcoded values into a live, data-driven learning portal. All stats now pull from real API endpoints, a "Resume Last Lesson" CTA provides the highest-impact learner action, and study time tracking enables accurate progress reporting.

### Backend Changes

#### New API Endpoints (3 added to `learnerCourses` router)

| Endpoint | Type | Description |
|----------|------|-------------|
| `learner.getDashboardStats` | Query | Aggregated dashboard stats: XP, level, badges, streak, study hours, enrollment count, overall progress, SLE levels, exam date, days until exam |
| `learner.getResumePoint` | Query | Returns the most recently accessed lesson with course/module context for "Resume" CTA |
| `learner.trackStudyTime` | Mutation | Logs study time (seconds) against a lesson, updates lessonProgress.timeSpentSeconds and enrollment lastAccessedAt |

#### Data Sources Aggregated by `getDashboardStats`

| Metric | Source Table | Field |
|--------|-------------|-------|
| XP & Level | `learner_xp` | `totalXp`, `currentLevel`, `levelTitle` |
| Streak | `learner_xp` | `currentStreak`, `longestStreak` |
| Badge count | `learner_badges` | `COUNT(*)` |
| Study hours | `lesson_progress` | `SUM(timeSpentSeconds)` |
| Monthly hours | `lesson_progress` | `SUM(timeSpentSeconds) WHERE lastAccessedAt >= month start` |
| Enrollment stats | `course_enrollments` | `COUNT(*)`, `COUNT(status=completed)` |
| Overall progress | `lesson_progress` | `completed / total lessons` |
| SLE levels | `learner_profiles` | `currentLevel`, `targetLevel` |
| Exam date | `learner_profiles` | `examDate` |

### Frontend Changes

#### Hardcoded Values Replaced (7 items)

| Location | Was | Now |
|----------|-----|-----|
| Hero streak badge | `7 days` | `displayStreak` from API (hidden if 0) |
| Stats grid: XP | `1,250` | `dashboardStats.totalXp` |
| Stats grid: Hours | `12.5h` | `dashboardStats.monthlyStudyHours` |
| Stats grid: Badges | `8` | `dashboardStats.totalBadges` |
| Stats grid: Progress | `65%` | `dashboardStats.overallProgress` |
| SLE Progress: Current | `BBB` | `dashboardStats.currentLevel` |
| SLE Progress: Target | `CBC` | `dashboardStats.targetLevel` |
| SLE Progress: Days | `45` | `dashboardStats.daysUntilExam` |
| Progress Ring | `65` | `dashboardStats.overallProgress` |
| Velocity Widget | Hardcoded fallbacks | Prefers dashboardStats, falls back to velocityData |

#### New UI Elements

| Element | Description |
|---------|-------------|
| Resume CTA (Hero) | "Resume" button in hero section, links to last accessed lesson |
| Resume Card (Main) | Prominent card with lesson title, course context, and "Continue" button |
| Conditional streak badge | Only shows streak badge when streak > 0 |

### Files Changed

| File | Change |
|------|--------|
| `server/routers/learnerCourses.ts` | +3 endpoints (getDashboardStats, getResumePoint, trackStudyTime) |
| `client/src/pages/LearnerDashboard.tsx` | Wired all hardcoded values to API, added Resume CTA |

### Database Changes

No schema migrations required. All endpoints use existing tables.

### Backward Compatibility

All existing routes, endpoints, and components preserved. The dashboard renders identically for users without data (fallback values match previous hardcoded values for XP=0 state).
