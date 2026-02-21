> # RusingAcademy Ecosystem — Design System Manifest

**Version:** 1.0.0 (Néo-Institutionnel / Light Luxury)
**Date:** February 17, 2026
**Master Reference:** `design-system.css` (v6.0.0)

---

## 1. Core Principles

The Néo-Institutionnel design system embodies **premium academic credibility** and **modern digital luxury**. It is built on four pillars:

1.  **Clarity over Complexity:** Every component must be immediately understandable. We prioritize clean layouts, intuitive interactions, and legible typography.
2.  **Hierarchy over Overload:** Visual weight and placement must guide the user naturally. We use a strict system of spacing, typography, and color to create a clear information hierarchy.
3.  **Conversion-Oriented Design:** While aesthetically premium, the design must drive action. CTAs, forms, and key navigation paths are designed for high visibility and effortless use.
4.  **Long-Term Scalability:** The system is built with CSS variables (custom properties) to ensure that future updates are efficient and consistent. All new components must inherit from this token-based system.

---

## 2. Color Palette

All colors are defined as CSS custom properties in `:root` and applied via semantic utility classes. **Hardcoded hex values are strictly forbidden.**

### Primary Palette

| Token | Hex | Utility Class | Description |
|---|---|---|---|
| `--brand-foundation` | `#0F3D3E` | `bg-foundation`, `text-foundation` | **Deep Forest Teal ("Vert Laurentides"):** The core brand color, representing trust, stability, and academic rigor. Used for headers, footers, and key structural elements. |
| `--brand-cta` | `#C65A1E` | `bg-cta`, `text-cta` | **Electric Copper ("Cuivre Électrique"):** The primary call-to-action color, representing innovation and forward momentum. Used for buttons, links, and interactive highlights. |
| `--brand-obsidian` | `#111827` | `bg-obsidian`, `text-obsidian` | **Obsidian Grey:** A deep, near-black for premium dark backgrounds and text. Provides a sophisticated alternative to pure black. |

### Semantic UI Palette

These tokens adapt to light and dark mode automatically.

| Token | Light Mode | Dark Mode | Utility Class | Description |
|---|---|---|---|---|
| `--background` | `#FEFEF8` (Ivory) | `#0B1220` (Obsidian 2) | `bg-background` | The default page background. |
| `--foreground` | `#111827` (Obsidian) | `#FEFEF8` (Ivory) | `text-foreground` | The default text color. |
| `--surface` | `#FFFFFF` (White) | `#111827` (Obsidian) | `bg-surface` | For cards, modals, and elevated surfaces. |
| `--border` | `#E7F2F2` (Teal Soft) | `#145A5B` (Teal 2) | `border-border` | Default border color for components. |
| `--ring` | `#C65A1E` (CTA) | `#E06B2D` (CTA 2) | `ring-ring` | Focus ring color for accessibility. |

---

## 3. Typography

The system uses a two-font strategy to balance elegance and readability.

| Font Family | Token | Weight(s) | Usage |
|---|---|---|---|
| **Merriweather** | `var(--font-display)` | 400, 700, 900 | **Display:** For all headings (`<h1>` to `<h6>`), hero titles, and marketing copy. Its serif style conveys academic authority. |
| **Inter** | `var(--font-ui)` | 400, 500, 600, 700 | **UI:** For all body text, labels, buttons, and interface elements. Its sans-serif form is optimized for readability at all sizes. |

### Typographic Scale

All text sizes must use responsive breakpoints to ensure readability and prevent overflow on mobile devices.

| Class | Base Size | `md:` | `lg:` | `xl:` | Recommended Use |
|---|---|---|---|---|---|
| `text-6xl` | 3.75rem | 4.5rem | 6rem | 7.5rem | Hero titles |
| `text-5xl` | 3rem | 3.75rem | 4.5rem | 6rem | Page headings (H1) |
| `text-4xl` | 2.25rem | 3rem | 3.75rem | 4.5rem | Section headings (H2) |
| `text-3xl` | 1.875rem | 2.25rem | 3rem | 3.75rem | Sub-section headings (H3) |
| `text-2xl` | 1.5rem | 1.875rem | 2.25rem | 3rem | Card titles (H4) |
| `text-xl` | 1.25rem | 1.5rem | 1.875rem | 2.25rem | Minor headings (H5) |
| `text-lg` | 1.125rem | 1.25rem | 1.5rem | 1.875rem | Stand-out paragraphs |
| `text-base` | 1rem | 1rem | 1rem | 1rem | Body copy, standard text |
| `text-sm` | 0.875rem | 0.875rem | 0.875rem | 0.875rem | Labels, captions, metadata |
| `text-xs` | 0.75rem | 0.75rem | 0.75rem | 0.75rem | Fine print, legal text |

---

## 4. Spacing & Layout

Consistent spacing is critical for visual rhythm. The system uses a `4px` base unit (Tailwind's default). All padding, margins, and gaps must use the spacing scale.

### Section Rhythm

To create vertical harmony on landing pages, all full-width sections must use the following padding classes:

| Class | Base Padding | `md:` | `lg:` | Recommended Use |
|---|---|---|---|---|
| `section-rhythm-sm` | `py-8` | `py-12` | `py-16` | Small, focused sections |
| `section-rhythm-md` | `py-12` | `py-16` | `py-20` | Standard content sections |
| `section-rhythm-lg` | `py-16` | `py-20` | `py-24` | Hero sections, footers |

---

## 5. Components

### Glassmorphism

Glassmorphism is a key visual element, used to create a sense of depth and modernity.

| Class | Background | Border | Shadow | Notes |
|---|---|---|---|---|
| `glass-card` | `rgba(255, 255, 255, 0.6)` | `1px solid rgba(255, 255, 255, 0.7)` | `shadow-lg` | For light backgrounds. Requires `backdrop-blur-lg`. |
| `glass-card-dark` | `rgba(17, 24, 39, 0.6)` | `1px solid rgba(255, 255, 255, 0.1)` | `shadow-xl` | For dark backgrounds. Requires `backdrop-blur-lg`. |
| `glass-button` | `rgba(255, 255, 255, 0.1)` | `1px solid rgba(255, 255, 255, 0.2)` | `shadow-md` | Subtle glass effect for buttons. |

### Buttons

All buttons must have a minimum touch target of `44px` by `44px` (`min-h-11 min-w-11`).

| Type | Class | Background | Text | Hover State |
|---|---|---|---|---|
| **Primary** | `btn-primary` | `bg-cta` | `text-white` | `bg-cta-2` |
| **Secondary** | `btn-secondary` | `bg-foundation` | `text-white` | `bg-foundation-2` |
| **Outline** | `btn-outline` | `transparent` | `text-foreground` | `bg-surface` |
| **Ghost** | `btn-ghost` | `transparent` | `text-foreground` | `bg-surface` |

---

## 6. Animation & Micro-interactions

Animations must be **subtle, purposeful, and respectful of user preferences**. All animations must be disabled when `prefers-reduced-motion` is active.

### Keyframes

| Name | CSS Keyframe | Description |
|---|---|---|
| `fadeIn` | `@keyframes fadeIn` | Fades an element from `opacity: 0` to `1`. |
| `shimmer` | `@keyframes shimmer` | Creates a shimmering/loading effect with a moving gradient. |
| `slideUp` | `@keyframes slideUp` | Slides an element up from `translateY(24px)` while fading in. |
| `scaleIn` | `@keyframes scaleIn` | Scales an element from `0.95` to `1` while fading in. |
| `pulseGlow` | `@keyframes pulseGlow` | Adds a subtle, pulsing glow effect to an element, typically using `box-shadow`. |

### Scroll-Triggered Animations

Elements can be animated as they enter the viewport using IntersectionObserver and the following classes:

-   `.scroll-fade-in`: Fades the element in.
-   `.scroll-slide-up`: Slides the element up while fading in.

An element with one of these classes will be `opacity: 0` until it becomes visible, at which point the `is-visible` class is added by the observer to trigger the transition.
