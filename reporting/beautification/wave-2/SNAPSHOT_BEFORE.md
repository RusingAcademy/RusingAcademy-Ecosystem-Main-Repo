# Wave 2 — Snapshot Before

**Baseline Commit**: Post-Wave-1 merge
**Date**: 2026-02-17 03:08 UTC

## Grep Counts

| Metric | Count |
|--------|-------|
| Fixed text sizes (no responsive breakpoint) | 10,986 |
| Responsive text (md:/lg:/xl: prefixed) | 436 |
| Fixed padding (no responsive breakpoint) | 16,996 |
| Responsive padding | 361 |
| Fixed margins | 7,748 |
| Responsive margins | 10 |

## Strategy

Wave 2 targets the **highest-impact** responsive improvements:
1. Large headings (text-4xl+) without responsive scaling → add mobile-first sizing
2. Large padding (p-12+, px-16+) without responsive scaling → add mobile breakpoints
3. Section-level spacing consistency via CSS utility classes
4. NOT touching small text (text-sm, text-xs) as these are already mobile-appropriate
