# Sprint Y1-W2-S07: Content Production Pipeline V1

**Sprint ID:** Y1-W2-S07
**Wave:** 2 — Core Journey Part 1 (Content & LMS)
**Duration:** 2 weeks (Feb 15 – Mar 1, 2026)
**Priority:** P0
**Impact:** Revenue

---

## 1. Goal

Deliver a production-grade **Content Production Pipeline** that enables the admin team to author, organize, preview, validate, and publish course content through the existing Admin Control Center. This sprint focuses on hardening the existing Course Builder, Content Pipeline dashboard, and admin content management features into a cohesive, reliable workflow — not building from scratch.

## 2. Scope

### In Scope

1. **Content Authoring Workflow Hardening**
   - Ensure the existing Course Builder (2,072 lines) reliably creates/edits courses, modules, and lessons
   - Fix any broken tRPC mutations (create, update, delete, reorder)
   - Validate the 7-slot lesson template system works end-to-end
   - Ensure bilingual fields (EN/FR) are properly saved and displayed

2. **Draft/Publish System with Status Transitions**
   - Enforce proper status flow: `draft → review → published → archived`
   - Add admin-only "Publish" and "Archive" actions with confirmation dialogs
   - Ensure published content is immediately visible on public course catalog
   - Add "Unpublish" (revert to draft) capability

3. **Content Preview & Validation Tools**
   - Build a "Preview as Learner" mode that renders course/module/lesson as a student would see it
   - Add content quality checklist (thumbnail present, description filled, bilingual fields, media attached)
   - Visual quality score indicator on each course card in admin

4. **Bulk Import Capability**
   - JSON/CSV import endpoint for courses, modules, and lessons
   - Validation layer with error reporting
   - Support for the existing SLE content structure (Path I-VI, 4 modules × 4 lessons × 7 slots)

5. **Content Pipeline Dashboard Enhancement**
   - Wire the existing `ContentPipeline.tsx` to real data from `adminContentPipeline.ts` router
   - Add content calendar view (upcoming publish dates)
   - Add content health metrics (courses without thumbnails, empty modules, etc.)

### Out of Scope

- Video upload/encoding (existing Bunny CDN integration handles this)
- AI-generated content (Wave 9-10)
- Rich text editor replacement (existing TipTap/RichTextEditor stays)
- New DB tables (existing schema is comprehensive)

## 3. Technical Approach

### Zero Regression Strategy
- All existing routes preserved (314 routes)
- No DB schema changes (existing tables are sufficient)
- No RBAC changes (existing admin/coach/student/guest roles)
- Feature branch with PR review before merge

### Architecture
- **Backend:** Enhance existing `adminCourses.ts`, `adminContentPipeline.ts`, `courses.ts`, `lessons.ts` routers
- **Frontend:** Enhance existing `CourseBuilder.tsx`, `ContentPipeline.tsx`, `AdminContentMgmtSection.tsx`
- **New Components:** `ContentPreview.tsx`, `BulkImporter.tsx`, `ContentQualityScore.tsx`

## 4. Success Metrics

| Metric | Target |
|--------|--------|
| Course CRUD operations | 100% functional (create, read, update, delete) |
| Module CRUD operations | 100% functional |
| Lesson CRUD operations | 100% functional |
| Status transitions | draft → review → published → archived |
| Bulk import | Successfully import 1 full Path (4 modules × 4 lessons) |
| Content preview | Renders course as learner would see it |
| Quality score | Visual indicator on all course cards |
| Build passes | Zero TypeScript errors, zero regression |
| E2E tests | All existing tests pass + new content pipeline tests |

## 5. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Existing CRUD mutations broken | Medium | High | Audit and fix each endpoint before building new features |
| Schema mismatch between frontend forms and DB | Medium | Medium | Map all form fields to schema columns |
| Bulk import data format issues | Low | Medium | Strict validation with clear error messages |
| Build size increase | Low | Low | Lazy-load new admin components |

## 6. Rollback Plan

If any regression is detected:
1. Revert the feature branch merge
2. Railway auto-deploys from main (baseline commit `48730f1`)
3. No DB migrations = no rollback needed for data

---

*Sprint Owner: Chief Ecosystem Orchestrator*
*Baseline: commit 48730f1 (1,058 commits)*
