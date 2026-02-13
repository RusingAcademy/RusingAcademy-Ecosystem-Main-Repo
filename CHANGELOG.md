# Changelog — RusingAcademy Ecosystem

All notable changes to this project will be documented in this file.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

---

## [Sprint 2–5] — 2026-02-13

**Branch:** `feat/admin-rebuild-waves-1-3`
**Commit:** `bc954e6`
**PR:** [#103](https://github.com/RusingAcademy/rusingacademy-ecosystem/pull/103)

### Sprint 2 — Coach Hub & Assignment Workflow

#### Added
- `adminCommission` router: 5 real tRPC procedures (`getOverview`, `getPayouts`, `getTopCoaches`, `processPayout`, `adjustTier`)
- Coach lifecycle mutations: `suspendCoach`, `reactivateCoach`, `getCoachLifecycleStats`
- Suspend/reactivate confirmation dialog in CoachesManagement
- Pipeline visualization for coach lifecycle states

#### Changed
- `AdminCommissionSection` fully rewritten — mock data replaced with real tRPC queries
- `CoachesManagement` extended with lifecycle management actions

### Sprint 3 — UI/UX Harmonization (LRDG-Grade)

#### Added
- `AdminSectionShell` — standardized section wrapper (title, description, breadcrumb, actions)
- `StatusBadge` — unified status badges for all admin sections (10 status variants)
- `AdminEmptyState` — standardized empty state pattern with icon, title, action
- `AdminStatsGrid` — standardized KPI/stats grid with trend indicators
- `AdminDataTable` — standardized table component with loading, empty, pagination
- `AdminLoadingSkeleton` — standardized loading skeleton (card, table, list, stats)
- `admin-tokens.css` — dedicated CSS variables for admin surfaces

#### Changed
- `AdminLayout` — responsive mobile sidebar with overlay, hamburger button, auto-collapse on navigation

### Sprint 4 — Analytics & Reporting Dashboard

#### Added
- `adminExecutiveSummary` router: 3 procedures (`getKPIs`, `getTrendData`, `getPlatformHealth`)
- `ExecutiveSummary` component: 8 KPI cards, trend charts, platform health score, CSV export
- Period selector: 7d, 30d, 90d, YTD, 12m with comparison trends
- Executive Summary nav item and route in ANALYTICS section

### Sprint 5 — CMS & Content Pipeline

#### Added
- `adminContentPipeline` router: 5 procedures (`getPipelineOverview`, `getRecentActivity`, `getContentCalendar`, `getContentTemplates`, `getQualityMetrics`)
- `ContentPipeline` component: 5-tab dashboard (Overview, Activity, Calendar, Templates, Quality)
- 6 LRDG content templates (SLE Prep Lesson, Coaching Session Plan, Oral Proficiency Module, Written Expression Module, LRDG Landing Page, Department Training Package)
- Content quality scoring with actionable recommendations
- Content Pipeline nav item and route in CONTENT section

### Tests
- 125 new unit tests across 5 test files, all passing

---

## [Sprint 0+1] — 2026-02-13

**Branch:** `feat/admin-rebuild-waves-1-3`
**Commit:** `95e4133`
**PR:** [#103](https://github.com/RusingAcademy/rusingacademy-ecosystem/pull/103)

### Sprint 0 — Navigation Integrity (Zero Regression)

#### Fixed
- **Dictation nav ID mismatch**: Navigation item used `dictation` but sectionMap expected `dictation-exercises`. Corrected in `AdminLayout.tsx`.
- **Triple-quote encoding corruption** in Wave 1-3 components (AdminFlashcards, AdminStudyNotes, AdminVocabulary, DictationExercises).
- **Garbage trailing line** in AdminVocabulary.tsx removed.

#### Changed
- 5 legacy standalone admin pages promoted into unified AdminControlCenter layout:
  - AdminCoachApplications -> coach-applications (PEOPLE)
  - AdminCommission -> commission (SALES)
  - AdminContentManagement -> content-management (CONTENT)
  - AdminLeads -> leads (SALES)
  - AdminReminders -> reminders (COMMUNITY)

### Sprint 1 — Course Publication Lifecycle

#### Added
- `review` status added to course lifecycle enum (draft -> review -> published -> archived)
- `publishedBy` field added to courses table for audit trail
- `bulkUpdateCourseStatus` mutation for batch operations
- In Review stats card, filter option, and blue status badges in CourseBuilder
- Submit for Review and Return to Draft actions in course dropdown menu

#### Changed
- publishCourse, getAllCourses, getCourseStats, updateCourseBasic all support review status

### Documentation
- NAV_AUDIT.md: 213 routes, 59 admin sections, 149 tables, 74 routers, 16 permissions
- REFACTOR_PLAN.md: 6-sprint roadmap for ecosystem elevation

### Tests
- 31 new unit tests for course status lifecycle, bulk operations, RBAC

## Migration Notes

After merging PR #103, run: `pnpm db:push`
