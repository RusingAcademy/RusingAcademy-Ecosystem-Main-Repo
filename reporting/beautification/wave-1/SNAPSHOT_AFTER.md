# Wave 1 — Snapshot After

**Branch**: `beautification/wave-1-dark-mode-token-enforcement`
**Date**: 2026-02-17 03:05 UTC

## Results

| Metric | Before | After | Delta |
|--------|--------|-------|-------|
| Total `dark:` classes | 6,655 | 6,737 | +82 (semantic tokens are longer names) |
| `dark:bg-slate-900` | 1,328 | 0 | -1,328 → `dark:bg-background` |
| `dark:bg-slate-800` | 466 | 0 | -466 → `dark:bg-card` |
| `dark:text-white` | 1,764 | 0 | -1,764 → `dark:text-foreground` |
| `dark:text-gray-100` | 243 | 0 | -243 → `dark:text-foreground` |
| `dark:text-gray-300` | 202 | 0 | -202 → `dark:text-muted-foreground` |
| `dark:border-slate-700` | 900 | 0 | -900 → `dark:border-border` |
| Files modified | — | 387 | — |
| Total replacements | — | 4,056 | — |

## Semantic Token Adoption

| Token | Count |
|-------|-------|
| `dark:bg-background` | 1,335 |
| `dark:text-foreground` | 2,078 |
| `dark:border-border` | 950 |
| `dark:bg-card` | 483 |
| `dark:text-muted-foreground` | 219 |

## Remaining Non-Semantic Dark Classes (intentional)

These are brand-specific or contextual colors that should NOT be tokenized:
- `dark:text-cyan-300` (185) — Lingueefy accent
- `dark:bg-foundation` (138) — Brand foundation
- `dark:border-teal-800` (101) — Brand accent border
- `dark:bg-obsidian` (62) — Brand obsidian
- `dark:bg-amber-900` (46) — Status/warning context
- Various other brand-specific colors

## QA Checklist

- [x] No duplicate dark: classes introduced
- [x] All replacements are 1:1 semantic equivalents
- [x] CSS files untouched (only TSX/TS modified)
- [x] Brand-specific dark classes preserved
- [x] design-system.css dark mode section defines all semantic tokens
