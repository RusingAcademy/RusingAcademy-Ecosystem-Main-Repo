# REFACTOR_PLAN.md — RusingAcademy Ecosystem Elevation Roadmap

**Author:** Manus AI — Lead Product Architect  
**Date:** February 13, 2026  
**Branch:** `feat/admin-rebuild-waves-1-3`  
**Vision:** Transform the RusingAcademy platform into the definitive reference that LRDG authorities immediately recognize as the **superior, next-generation version** of their own products — organized, complete, and unmistakably world-class.

---

## Strategic Context

When the pedagogical authorities of the LRDG evaluate this platform, they must see five things simultaneously:

1. **Familiarity** — The same structural DNA they know (Admin Control Center, Learner Portal, Coach Portal, HR Dashboard, User Dashboard), so they never feel lost.
2. **Superiority** — Every section is more polished, more complete, and more professionally organized than what they currently use.
3. **Completeness** — No dead buttons, no empty pages, no "coming soon" placeholders without professional context.
4. **Bilingual Excellence** — Every label, every tooltip, every error message in both English and French — the standard they enforce.
5. **Enterprise Readiness** — Role-based access, audit trails, compliance reporting, and organizational billing that signal institutional-grade software.

This roadmap is designed to achieve all five objectives through a series of surgical, non-destructive sprints that preserve every existing feature while systematically elevating the platform.

---

## Current State Assessment

The audit (see `NAV_AUDIT.md`) established the following baseline:

| Metric | Current | Target |
|--------|---------|--------|
| Admin Sections (working) | 35 / 59 | 59 / 59 |
| Admin Sections (UI-only, mock data) | 15 | 0 |
| Admin Sections (broken/mismatched) | 1 | 0 |
| Legacy Standalone Pages | 5 | 0 |
| Wave 1–3 Panels with tRPC Wiring | 0 / 15 | 15 / 15 |
| Bilingual Coverage (labels) | ~85% | 100% |
| Test Coverage (files) | ~110 | ~130 |
| Test Cases | ~2 912 | ~3 200+ |

---

## Sprint Architecture

The roadmap is organized into **6 sprints**, each delivering a self-contained, deployable increment. Sprints follow the **surgical, incremental, non-destructive** methodology mandated by the project's development constraints.

### Sprint 0 — Navigation Integrity (COMPLETED)

**Objective:** Zero dead buttons, zero mismatched routes, unified admin shell.

**Deliverables:**

| Task | Status | Files Changed |
|------|--------|--------------|
| Fix dictation nav ID mismatch (`dictation` → `dictation-exercises`) | ✅ Done | `AdminLayout.tsx` |
| Promote 5 legacy standalone pages into AdminControlCenter | ✅ Done | 5 new section components, `AdminControlCenter.tsx`, `App.tsx`, `index.ts` |
| Fix triple-quote encoding in 4 Wave 1–3 files | ✅ Done | `AdminFlashcards.tsx`, `AdminStudyNotes.tsx`, `AdminVocabulary.tsx`, `DictationExercises.tsx` |
| Produce NAV_AUDIT.md | ✅ Done | `NAV_AUDIT.md` |

**Impact:** Every admin sidebar item now navigates to a real section inside the unified AdminLayout. No more layout-breaking standalone pages.

---

### Sprint 1 — Course Publication & Content Standardization

**Objective:** Implement the course lifecycle (draft → review → published → archived) with granular visibility controls at the course, module, and lesson level.

**Scope:**

| Task | Priority | Complexity |
|------|----------|-----------|
| Add `status` enum (`draft`, `review`, `published`, `archived`) to `courses` table | 🔴 Critical | Low |
| Add `isVisible` boolean to `courseModules` and `lessons` tables | 🔴 Critical | Low |
| Create `adminCourses.updateStatus` tRPC mutation with RBAC | 🔴 Critical | Medium |
| Create `adminCourses.bulkUpdateStatus` for batch operations | 🟠 High | Medium |
| Update CourseBuilder UI with status badge, filter, and bulk actions | 🟠 High | Medium |
| Add publication audit trail (who published, when, from which status) | 🟡 Medium | Medium |
| Update learner-facing course list to filter by `published` status | 🔴 Critical | Low |
| Add "Preview as Learner" button in CourseBuilder | 🟡 Medium | Low |
| Write Vitest tests for all new mutations | 🔴 Critical | Medium |

**Database Changes:**
```sql
ALTER TABLE courses ADD COLUMN status ENUM('draft','review','published','archived') DEFAULT 'draft';
ALTER TABLE courses ADD COLUMN published_at BIGINT;
ALTER TABLE courses ADD COLUMN published_by VARCHAR(255);
ALTER TABLE course_modules ADD COLUMN is_visible BOOLEAN DEFAULT true;
ALTER TABLE lessons ADD COLUMN is_visible BOOLEAN DEFAULT true;
```

**Success Criteria:** An admin can create a course in draft, move it through review to published, and only published courses appear in the learner portal. All state transitions are logged.

---

### Sprint 2 — Coach Management Hub Consolidation

**Objective:** Unify the coach lifecycle (application → review → approval → onboarding → active → payout) into a single, coherent management experience within the Admin Control Center.

**Scope:**

| Task | Priority | Complexity |
|------|----------|-----------|
| Consolidate coach application review into `CoachesManagement` section | 🔴 Critical | High |
| Wire `AdminCoachAppsSection` to real tRPC data (replace mock) | 🔴 Critical | Medium |
| Wire `AdminCommissionSection` to real tRPC data (replace mock) | 🔴 Critical | Medium |
| Add coach lifecycle status pipeline visualization | 🟠 High | Medium |
| Implement coach performance metrics dashboard | 🟠 High | High |
| Add coach document verification workflow | 🟡 Medium | Medium |
| Create coach onboarding checklist tracking | 🟡 Medium | Medium |
| Write Vitest tests for coach lifecycle mutations | 🔴 Critical | Medium |

**Success Criteria:** An admin can manage the entire coach lifecycle from a single section in the Admin Control Center, from application review through to commission payouts.

---

### Sprint 3 — SLE Prep Suite Backend Wiring (Wave 1)

**Objective:** Connect all 7 SLE Prep admin panels to real tRPC backends, replacing mock data with functional CRUD operations.

**Scope:**

| Panel | Router Needed | Tables Needed | Complexity |
|-------|--------------|--------------|-----------|
| SLE Exam Mode | `adminSLE.ts` | `sleExams`, `sleAttempts` | High |
| Reading Lab | `adminReadingLab.ts` | `readingPassages`, `readingQuestions` | Medium |
| Listening Lab | `adminListeningLab.ts` | `listeningExercises`, `audioAssets` | Medium |
| Grammar Drills | `adminGrammarDrills.ts` | `grammarExercises`, `grammarRules` | Medium |
| Writing Lab | `adminWritingLab.ts` | `writingPrompts`, `writingRubrics` | Medium |
| Pronunciation Lab | `adminPronunciationLab.ts` | `pronunciationExercises` | Medium |
| Dictation Exercises | `adminDictation.ts` | `dictationExercises`, `dictationAudio` | Medium |

**Success Criteria:** Each SLE Prep panel supports full CRUD operations with real data. Learners can access SLE practice exercises created through the admin panels.

---

### Sprint 4 — Retention & Community Backend Wiring (Waves 2–3)

**Objective:** Connect the remaining 8 Wave 2–3 admin panels to real tRPC backends.

**Scope:**

| Panel | Router Needed | Tables Needed | Complexity |
|-------|--------------|--------------|-----------|
| Flashcards (SM-2) | `adminFlashcards.ts` | `flashcardDecks`, `flashcards`, `flashcardReviews` | High |
| Vocabulary Builder | `adminVocabulary.ts` | `vocabularyLists`, `vocabularyItems` | Medium |
| Study Notes | `adminStudyNotes.ts` | `studyNotes`, `noteTemplates` | Medium |
| Daily Review Queue | `adminDailyReview.ts` | `reviewQueues`, `reviewItems` | Medium |
| Discussion Boards | `adminDiscussions.ts` | `forumPosts`, `forumReplies` (existing) | Medium |
| Study Groups | `adminStudyGroups.ts` | `studyGroups`, `groupMembers` | Medium |
| Peer Review | `adminPeerReview.ts` | `peerReviewAssignments`, `peerFeedback` | High |
| Smart Recommendations | `adminRecommendations.ts` | Uses AI + existing tables | High |

**Success Criteria:** All 15 Wave 1–3 panels are fully functional with real data. Zero mock data remains in the admin interface.

---

### Sprint 5 — Bilingual Completeness & UI Harmonization

**Objective:** Achieve 100% bilingual coverage and visual consistency across all 5 portals.

**Scope:**

| Task | Priority | Complexity |
|------|----------|-----------|
| Audit all admin labels for missing `labelFr` / `titleFr` | 🔴 Critical | Low |
| Add French translations for all Wave 1–3 panel content | 🔴 Critical | Medium |
| Standardize empty states across all sections (professional "Create first…" CTAs) | 🟠 High | Medium |
| Harmonize card spacing, shadow depth, and border radius across portals | 🟠 High | Medium |
| Implement consistent loading skeletons for all data tables | 🟡 Medium | Low |
| Add glassmorphism effects to key CTA elements per design mandate | 🟡 Medium | Medium |
| Ensure all sections have proper breadcrumb navigation | 🟡 Medium | Low |
| Accessibility audit (focus rings, keyboard nav, ARIA labels) | 🔴 Critical | High |

**Success Criteria:** A LRDG evaluator can switch between English and French at any point in the platform and see complete, professional translations. The visual quality is consistent across all portals.

---

## Sprint Dependency Graph

```
Sprint 0 (Nav Integrity) ──────────────────────────────────────┐
    │                                                           │
    ├── Sprint 1 (Course Publication) ──┐                       │
    │                                   │                       │
    ├── Sprint 2 (Coach Hub) ───────────┤                       │
    │                                   │                       │
    ├── Sprint 3 (SLE Prep Wiring) ─────┤                       │
    │                                   │                       │
    └── Sprint 4 (Retention/Community) ─┤                       │
                                        │                       │
                                        └── Sprint 5 (Bilingual + UI) ──► LRDG-Ready
```

Sprints 1–4 can be executed in parallel by different developers. Sprint 5 depends on all prior sprints being complete.

---

## Quality Gates

Each sprint must pass the following gates before merge:

| Gate | Requirement |
|------|------------|
| **Zero Regression** | All existing ~2 912 tests pass |
| **New Tests** | Minimum 10 new Vitest cases per sprint |
| **TypeScript Clean** | Zero `error TS` in compilation |
| **Bilingual Check** | All new labels have EN + FR |
| **Accessibility** | All interactive elements keyboard-reachable |
| **Visual Immutability** | Header, Hero, and Multi-Coach Widget unchanged |
| **Staging Validation** | Feature branch deployed and visually verified |

---

## Risk Register

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|-----------|
| Large schema migration breaks existing data | Medium | High | Run migrations on staging first, backup production DB |
| Wave 1–3 panel wiring introduces N+1 queries | Medium | Medium | Use Drizzle `with` for eager loading, add query tests |
| Bilingual translations miss context nuances | Low | Medium | Have native FR speaker review all translations |
| Coach lifecycle consolidation breaks existing workflows | Medium | High | Keep legacy routes as fallback aliases for 2 sprints |
| SLE Prep content creation requires domain expertise | High | Medium | Provide admin templates with sample content |

---

## Estimated Timeline

| Sprint | Duration | Cumulative |
|--------|----------|-----------|
| Sprint 0 (Nav Integrity) | ✅ Complete | Day 0 |
| Sprint 1 (Course Publication) | 2–3 days | Day 3 |
| Sprint 2 (Coach Hub) | 2–3 days | Day 6 |
| Sprint 3 (SLE Prep Wiring) | 3–4 days | Day 10 |
| Sprint 4 (Retention/Community) | 3–4 days | Day 14 |
| Sprint 5 (Bilingual + UI) | 2–3 days | Day 17 |

**Total estimated time to LRDG-ready state: ~17 working days**

---

*This roadmap follows the surgical, incremental, non-destructive development methodology. Every sprint preserves all existing features while systematically elevating the platform toward the "crème de la crème" standard that will make LRDG authorities recognize this as the superior version of their own products.*
