# Changelog — RusingAcademy Ecosystem

All notable changes to this project will be documented in this file.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

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
