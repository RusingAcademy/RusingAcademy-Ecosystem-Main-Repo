# Sprint E1 — QA Checklist

## Build Verification
- [x] `npx vite build` passes (78s, zero errors)
- [x] No TypeScript compilation errors
- [x] No new warnings introduced

## Smoke Tests
- [ ] Navigate to `/admin/learning-paths` — page loads with empty state or path list
- [ ] Click "Create Path" — dialog opens with bilingual fields
- [ ] Fill in EN/FR title, description, slug, pricing — submit creates path
- [ ] Edit an existing path — dialog pre-fills with current values
- [ ] Toggle publish status — badge updates
- [ ] Delete a path — confirmation dialog, path removed from list
- [ ] Sidebar shows "Learning Paths" under PRODUCTS section

## Regression Checks
- [ ] Admin dashboard loads normally
- [ ] Other admin sections (courses, quiz, content pipeline) still accessible
- [ ] Existing learning path public pages still render
- [ ] No console errors on admin pages
