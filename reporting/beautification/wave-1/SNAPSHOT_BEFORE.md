# Wave 1 — Snapshot Before

**Baseline Commit**: `792f946`
**Date**: 2026-02-17 03:01 UTC

## Grep Counts

| Metric | Count |
|--------|-------|
| Dark duplicate: `dark:text-white dark:text-white` | 0 files (cleaned in prior Wave 1) |
| Dark duplicate: `dark:bg-slate-800 dark:bg-slate-900` | 0 files (cleaned in prior Wave 1) |
| Dark duplicate: `dark:text-gray-300 dark:text-gray-300` | 0 files (cleaned in prior Wave 1) |
| Total `dark:` classes in TSX/TS | 6,655 |
| Hardcoded hex in TSX/TS | 1,777 |
| `<img>` without `alt=` | 160 |
| `aria-label` count | 361 |
| `@keyframes` in CSS | 32 |
| `transition` in CSS | 173 |

## Notes

The prior Wave 1 (PR #182, now part of the rollback baseline) already cleaned the most obvious dark mode duplicates. This restart Wave 1 will focus on:
1. Remaining dark mode inconsistencies (non-semantic dark classes)
2. Token enforcement: replacing inline dark:* classes with semantic tokens (text-foreground, bg-background, etc.)
3. Ensuring design-system.css is the single source of truth for dark mode
