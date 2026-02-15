# Sprint E1 — Learning Path Builder & Admin CRUD

## Goal
Create a complete admin Learning Path Builder with full CRUD operations, enabling administrators to create, edit, publish, and manage structured learning paths that organize courses into progressive sequences.

## Scope
1. **Backend**: `adminPaths` router with 6 endpoints (list, getById, create, update, delete, togglePublish)
2. **Frontend**: `LearningPathBuilder` admin page with create/edit dialog, course module management, bilingual fields
3. **Integration**: Route, sidebar nav item, AdminControlCenter section mapping

## Success Metrics
- [ ] Admin can create a new learning path with EN/FR title, description, pricing
- [ ] Admin can add/remove course modules to a path
- [ ] Admin can publish/unpublish paths
- [ ] Admin can delete paths
- [ ] Build passes with zero regressions
- [ ] Zero new database migrations required

## Risks
- Learning paths table uses JSON `modules` column — no foreign key constraints
- Path pricing may need Stripe product creation (deferred to future sprint)
