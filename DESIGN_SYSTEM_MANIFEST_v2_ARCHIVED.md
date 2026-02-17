# RusingAcademy Design System Manifest

**Version:** 2.0.0 — Post-Beautification  
**Last Updated:** 2026-02-16  
**Program:** 20-Wave Beautification & Aesthetification

---

## Architecture

The design system is organized as a layered CSS architecture imported in strict order:

```
index.css
├── tailwindcss (framework)
├── tw-animate-css (animation primitives)
├── animations.css (keyframe definitions)
├── design-system.css (unified tokens: colors, spacing, typography, radii)
├── typography.css (semantic type scale + font families)
├── buttons.css (4 button variants + sizes + states)
├── cards.css (4 card tiers + semantic variants)
├── sections.css (section layout + containers + dividers)
├── states.css (loading, empty, error state displays)
├── responsive.css (mobile-first responsive utilities)
├── premium-beautification.css (glassmorphism + premium effects)
├── accessibility.css (focus states + skip links + screen reader)
├── admin-tokens.css (high-contrast admin dashboard)
├── forms.css (unified form field styling)
├── micro-animations.css (scroll-triggered + hover interactions)
└── print.css (print-optimized styles)
```

## Color Tokens

| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| `--brand-gold` | #D4AF37 | #D4AF37 | Primary brand accent |
| `--brand-teal` | #008090 | #008090 | Interactive elements |
| `--brand-obsidian` | #1B1464 | #1B1464 | Deep backgrounds |
| `--brand-foundation` | #0F3D3E | #0F3D3E | Foundation color |
| `--semantic-success` | #10B981 | #10B981 | Success states |
| `--semantic-warning` | #F59E0B | #F59E0B | Warning states |
| `--semantic-danger` | #DC2626 | #DC2626 | Error/danger states |

## Typography

- **Headings:** Merriweather (serif) — `font-heading`
- **Body:** Inter (sans-serif) — `font-body`
- **Monospace:** JetBrains Mono — `font-mono`
- **Scale:** 20 semantic classes from `.type-caption` to `.type-display`

## Button Variants

| Class | Usage |
|-------|-------|
| `.btn-primary` | Primary actions |
| `.btn-secondary` | Secondary actions |
| `.btn-cta` | Call-to-action (gold gradient) |
| `.btn-ghost` | Minimal/tertiary actions |
| `.glass-btn` | Glassmorphism button |

## Card Tiers

| Class | Usage |
|-------|-------|
| `.card` | Base card |
| `.card-elevated` | Elevated with shadow |
| `.card-glass` | Glassmorphism card |
| `.card-premium` | Premium gold-accented |

## Glassmorphism Classes

| Class | Usage |
|-------|-------|
| `.glass-surface` | General glass background |
| `.glass-card` | Glass card with hover lift |
| `.glass-badge` | Small glass badge |
| `.glass-btn` | Glass button |
| `.glass-fill` | Subtle glass fill |
| `.glass-header` | Navigation header glass |

## Accessibility

- Global `focus-visible` ring (teal, 3px offset)
- `prefers-reduced-motion` safety on all animations
- `prefers-contrast: high` overrides for glass elements
- Skip-to-content link
- 354 ARIA labels, 255 aria-hidden, 227 role attributes
- 45 sr-only screen reader elements

## Dark Mode

- 9,440+ dark: class instances across 373+ files
- Complete bg/text/border coverage
- Admin dashboard high-contrast tokens
- Glass surface dark variants

## Print

- Non-essential UI hidden
- Ink-saving background reset
- URL display for links
- Card break-inside avoidance

---

## Statistics (Post-Wave 20)

| Metric | Before | After |
|--------|--------|-------|
| CSS token files | 4 (competing) | 1 unified |
| Hardcoded hex colors | 5,000+ | 619 (data/chart only) |
| Dark mode classes | ~5,000 | 9,440+ |
| Undefined CSS classes | 3+ (glass-btn, etc.) | 0 |
| Encoding defects | 192 | 0 |
| Duplicate headers | 8 pages | 0 |
| Design system CSS files | 0 | 12 purpose-built |
