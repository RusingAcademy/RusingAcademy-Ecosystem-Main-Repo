# Sprint Y1-W2-S10 — Bilingual Content & i18n Completeness

## Goal
Add French translations to the highest-impact public-facing pages (FAQ, CoursesPage, NotFound, Hub) and expand the translation key system to cover missing UI strings. Ensure the platform meets Government of Canada bilingual requirements for public-facing content.

## Scope

### Priority 1: High-Impact Public Pages
1. **FAQ page** (342 lines) — Add full French translations for all Q&A content
2. **CoursesPage** (933 lines) — Add bilingual course listing with titleFr/descriptionFr rendering
3. **NotFound page** (52 lines) — Add French 404 error page
4. **Hub page** (33 lines) — Add French ecosystem hub text

### Priority 2: Translation Key Expansion
1. Add missing translation keys to LanguageContext for common UI patterns
2. Add bilingual empty states across the platform
3. Ensure course cards render titleFr when language is French

## Risks
- Large pages (CoursesPage 933 lines) require careful editing to avoid regression
- French content quality must be professional-grade for government audience

## Success Metrics
- All 4 priority pages render correctly in both EN and FR
- Course cards display French titles when available
- NotFound page is fully bilingual
- Build passes with zero regressions
