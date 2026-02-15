# Sprint D5 — Performance Optimization

## Problem

The main `index.js` bundle is **8.4 MB** (2 MB gzip). This is because 116 page components are statically imported in `App.tsx`, defeating the 106 lazy imports that also exist. Additionally, `DashboardRouter.tsx` statically imports 4 dashboard pages.

## Root Cause

Vite correctly warns: "X is dynamically imported by Y but also statically imported by Z, dynamic import will not move module into another chunk." The static imports in `App.tsx` pull everything into the main bundle.

## Solution

1. Convert all 116 static page imports to `React.lazy()` with dynamic `import()`
2. Convert DashboardRouter to use lazy imports for role-based dashboards
3. Add Vite `manualChunks` configuration to split vendor libraries (react, ui, charts, forms, editor)
4. Add a proper loading skeleton as the Suspense fallback

## Results

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| Main index chunk | 8,400 KB | 856 KB + 863 KB | **~80% reduction** |
| Initial load (gzip) | ~2.4 MB | ~509 KB | **~79% smaller** |
| Total JS chunks | ~10 files | 742 files | Proper code splitting |
| Vendor chunks | None | 5 (react, ui, charts, forms, editor) | Long-term cacheable |
| Build time | 85s | 55s | **35% faster** |

## Risk

LOW — This is a pure frontend optimization. No backend changes, no database changes, no API changes.
