# Motion System — Wave 5

**Date:** February 17, 2026
**Author:** Beautification Architect
**Branch:** `beautification/wave-5-animations-micro-interactions`

---

## Design Philosophy

The RusingAcademy Motion System follows the **Néo-Institutionnel** design language: subtle, purposeful, and premium. Every animation serves a functional purpose — guiding attention, providing feedback, or creating spatial context. No animation exists purely for decoration.

---

## Motion Principles

| Principle | Description |
|-----------|-------------|
| **Purposeful** | Every animation communicates state change, hierarchy, or feedback |
| **Subtle** | Durations 150–400ms, easing curves that feel natural |
| **Respectful** | `prefers-reduced-motion` disables all motion instantly |
| **Performant** | Only `transform` and `opacity` — no layout-triggering properties |
| **Consistent** | Shared timing tokens across all components |

---

## Timing Tokens

```css
--duration-instant: 100ms;    /* Hover states, toggles */
--duration-fast: 200ms;       /* Button feedback, tooltips */
--duration-normal: 300ms;     /* Card transitions, modals */
--duration-slow: 500ms;       /* Page transitions, reveals */
--duration-glacial: 800ms;    /* Hero animations, onboarding */

--ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
--ease-in-out-expo: cubic-bezier(0.87, 0, 0.13, 1);
--ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
```

---

## Keyframes Inventory (28 total)

### Pre-existing (20)
| Name | Source | Purpose |
|------|--------|---------|
| pulse-subtle | animations.css | Gentle opacity pulse |
| float | animations.css | Vertical float for decorative elements |
| gradient-shift | animations.css | Background gradient animation |
| shimmer | animations.css | Loading skeleton shimmer |
| glow-pulse | animations.css | Glow effect for CTAs |
| rotate-slow | animations.css | Slow rotation for decorative orbs |
| scale-in | animations.css | Scale entrance for modals |
| slide-up-fade | animations.css | Slide up with fade |
| fade-in-page | animations.css | Page entrance fade |
| slide-in-right | animations.css | Slide from right |
| slide-in-left | animations.css | Slide from left |
| card-entrance | animations.css | Card stagger entrance |
| list-item-entrance | animations.css | List item stagger |
| badge-pop | animations.css | Badge unlock pop |
| checkmark | animations.css | Success checkmark draw |
| skeleton-shimmer | states.css | Skeleton loading |
| spin-smooth | states.css | Smooth spinner |
| pulse-dot | states.css | Dot pulse indicator |
| fade-in-up | states.css | Fade in upward |
| shimmer-sweep | micro-animations.css | Shimmer sweep effect |

### New in Wave 5 (8)
| Name | Purpose |
|------|---------|
| slide-down-fade | Dropdown/menu entrance |
| scale-bounce | Button press feedback |
| blur-in | Glassmorphism reveal |
| count-up | Number counter animation |
| progress-fill | Progress bar fill |
| stagger-fade-in | Staggered list reveal |
| ripple | Material-style click ripple |
| parallax-float | Parallax scroll effect |

---

## Hover Micro-interactions

| Element | Effect | Duration |
|---------|--------|----------|
| Buttons | Scale 1.02 + shadow lift | 200ms |
| Cards | Translate Y -4px + shadow | 300ms |
| Links | Underline slide-in | 200ms |
| Icons | Rotate 5deg or scale 1.1 | 150ms |
| Nav items | Background fade-in | 200ms |
| Tags/badges | Scale 1.05 | 150ms |

---

## Page Transitions

All page transitions use `fade-in-page` (300ms) with staggered content reveal.

---

## Reduced Motion

All animations respect `prefers-reduced-motion: reduce`:
- Durations set to 0.01ms
- Iteration count set to 1
- Scroll behavior set to auto
- Explicit disable of Tailwind animation utilities

---

## Performance Rules

1. Only animate `transform` and `opacity`
2. Use `will-change` sparingly and only on elements that will animate
3. No animation on scroll unless using IntersectionObserver
4. Maximum 3 simultaneous animations per viewport
5. All animations must complete within 1 second
