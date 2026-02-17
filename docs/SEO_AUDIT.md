# SEO & Content Structure Audit — Wave 5

**Date:** February 17, 2026  
**Branch:** `improvements/wave-5-seo-content-structure`

---

## Executive Summary

This wave addresses critical SEO infrastructure issues that directly impact search engine visibility and indexing accuracy for the RusingAcademy ecosystem.

---

## Changes Made

### 1. Domain Canonicalization (.com → .ca)

**Issue:** 17 URL references across 11 source files pointed to `rusingacademy.com` instead of the canonical domain `rusingacademy.ca`. This creates duplicate content signals and dilutes link equity.

**Fix:** Batch-replaced all URL references to use `rusingacademy.ca`. Email addresses (`@rusingacademy.com`) were correctly preserved.

| File | Replacements |
|------|-------------|
| App.tsx | 1 |
| Certificate.tsx | 1 |
| Footer.tsx | 3 |
| LeftSidebar.tsx | 1 |
| MobileNav.tsx | 1 |
| RightSidebar.tsx | 1 |
| SEOPillarPages.tsx | 4 |
| EcosystemBrands.tsx | 1 |
| LearningCapsules.tsx | 1 |
| VerifyCertificate.tsx | 2 |
| EmailTemplateBuilder.tsx | 1 |

### 2. Sitemap.xml Overhaul

**Issues found:**
- All URLs pointed to `.com` instead of `.ca`
- Missing `lastmod` dates (critical for crawl prioritization)
- Missing pages: `/how-it-works`, `/blog`, `/help`, `/become-coach`, `/privacy`, `/terms`
- No `hreflang` annotations for bilingual homepage

**Fix:**
- Updated all 12 existing URLs to `.ca` domain
- Added `lastmod` dates to all entries
- Added 6 missing pages with appropriate priority/frequency
- Added `xhtml:link` hreflang annotations for EN/FR homepage variants
- Total pages in sitemap: 18 (was 12)

### 3. robots.txt Domain Fix

**Issue:** Sitemap reference pointed to `.com`.  
**Fix:** Updated to `https://www.rusingacademy.ca/sitemap.xml`.

### 4. Dynamic og:locale in SEO Component

**Issue:** `og:locale` was hardcoded to `en_CA` regardless of the user's language selection.  
**Fix:** Added `useLanguage()` hook to the SEO component to dynamically set `og:locale` based on the active language. Also added `<html lang>` attribute for accessibility.

---

## Pre-existing SEO Strengths (No Changes Needed)

| Feature | Status |
|---------|--------|
| Organization Schema (JSON-LD) | ✅ Present |
| Service Schema (Lingueefy, Barholex) | ✅ Present |
| FAQ Schema Generator | ✅ Present |
| Coach/Person Schema Generator | ✅ Present |
| Course Schema Generator | ✅ Present |
| Breadcrumb Schema | ✅ Present |
| Open Graph meta tags | ✅ Present |
| Twitter Card meta tags | ✅ Present |
| Canonical URLs | ✅ Present |
| noindex for admin pages | ✅ Present |

---

## Recommendations for Future Waves

1. **Dynamic Sitemap Generation** — Consider generating sitemap.xml at build time from the route configuration to keep it automatically in sync.
2. **Blog Post Structured Data** — Add `Article` schema to individual blog posts when the blog feature is fully implemented.
3. **Coach Profile Pages** — Ensure each coach profile page uses the `generateCoachSchema()` function.
4. **Course Pages** — Ensure each course detail page uses the `generateCourseSchema()` function.
