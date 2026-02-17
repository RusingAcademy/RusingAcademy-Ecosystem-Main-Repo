# RusingAcademy Design System Audit — Wave 3

**Date:** February 17, 2026  
**Scope:** Full codebase audit of `client/src/pages/` and `client/src/components/`  
**Design System Version:** 6.0.0 (Unified)

---

## 1. Color Token Compliance

### Status: ✅ Good (minor inline style fixes applied)

The design system defines a comprehensive palette in `design-system.css` with CSS custom properties. Most Tailwind classes use semantic colors (`bg-white`, `text-muted-foreground`, etc.) that map to tokens.

**Hardcoded colors found:** 38 instances across pages and components  
**Fixed in this wave:** 5 inline style replacements (hex → CSS var)  
**Remaining:** 33 instances — mostly Tailwind arbitrary values (`bg-[#hex]`) in:
- `Login.tsx` (14 instances) — Apple-style login UI, intentionally custom
- `EcosystemLanding.tsx` (4 instances) — brand-specific section styling
- `EcosystemHubSections.tsx` (1 instance) — LinkedIn brand color
- Various pages (14 instances) — decorative/one-off colors

**Recommendation:** The remaining hardcoded colors are either external brand colors (LinkedIn, Apple) or intentional design choices. No further action needed.

---

## 2. Border Radius Distribution

### Status: ⚠️ Minor inconsistency

| Radius Class | Count | Standard? |
|---|---|---|
| `rounded-full` | 1,337 | ✅ Avatars, pills, badges |
| `rounded-lg` | 953 | ✅ **Primary standard** for cards |
| `rounded-xl` | 804 | ✅ Large cards, modals |
| `rounded-2xl` | 379 | ✅ Hero sections, large containers |
| `rounded-md` | 64 | ⚠️ Non-standard (should be `rounded-lg`) |
| `rounded-3xl` | 50 | ✅ Special decorative elements |
| `rounded-sm` | 13 | ⚠️ Non-standard (should be `rounded-lg`) |

**Finding:** 77 instances of `rounded-md` and `rounded-sm` break the established hierarchy of `rounded-lg` → `rounded-xl` → `rounded-2xl`. However, many of these are in form inputs, code blocks, and small UI elements where `rounded-md` is intentionally more subtle.

**Recommendation:** Keep `rounded-md` for form inputs and small UI elements. Standardize `rounded-sm` to `rounded-md` where appropriate. This is a low-risk cosmetic change.

---

## 3. Typography Weight Distribution

### Status: ✅ Consistent

| Weight | Count | Usage |
|---|---|---|
| `font-bold` | 1,465 | Headings, emphasis |
| `font-medium` | 1,371 | Labels, buttons, navigation |
| `font-semibold` | 1,034 | Sub-headings, card titles |
| `font-extrabold` | 33 | Hero headlines |
| `font-black` | 35 | Special emphasis |
| `font-normal` | 19 | Body text reset |

**Finding:** The weight hierarchy is well-established and consistent. The three primary weights (`bold`, `medium`, `semibold`) account for 99% of usage.

---

## 4. Section Spacing Patterns

### Status: ✅ Consistent with responsive progression

| Pattern | Count | Context |
|---|---|---|
| `py-8` | 297 | Small sections, mobile |
| `py-12` | 245 | Medium sections |
| `py-16` | 235 | **Standard section padding** |
| `py-20` | 86 | Large sections |
| `py-24` | 74 | Hero/feature sections |

**Finding:** Most pages use a responsive progression: `py-10 md:py-16 lg:py-20` or `py-12 md:py-16 lg:py-24`. This is a well-established pattern.

---

## 5. Container Width Patterns

### Status: ⚠️ Minor inconsistency

| Width | Count | Typical Usage |
|---|---|---|
| `max-w-7xl` | 29 | Full-width page containers |
| `max-w-6xl` | 55 | Wide content sections |
| `max-w-5xl` | 48 | Grid layouts |
| `max-w-4xl` | 101 | Text-heavy sections |
| `max-w-3xl` | 89 | Centered text blocks |
| `max-w-2xl` | 112 | Subtitle/description text |

**Finding:** Container widths are generally appropriate for their content type. The main page wrapper uses `max-w-7xl` consistently across key pages (Courses, Pricing). Text content uses `max-w-3xl` or `max-w-2xl` for readability.

---

## 6. Gap/Spacing Patterns

### Status: ✅ Consistent

| Gap | Count | Usage |
|---|---|---|
| `gap-2` | 829 | Inline elements, icon+text |
| `gap-4` | 444 | Card grids, form fields |
| `gap-3` | 429 | Compact lists |
| `gap-6` | 143 | Section content |
| `gap-8` | 80 | Major grid layouts |

**Finding:** Gap values follow the 4px grid system defined in the design tokens. No anomalies detected.

---

## 7. Dead CSS Files Identified

The following CSS files are **not imported anywhere** in the application:

| File | Lines | Status |
|---|---|---|
| `styles/tokens.css` | 929 | Dead code (superseded by design-system.css) |
| `styles/light-luxury-tokens.css` | 243 | Dead code (merged into design-system.css) |
| `styles/tokens-light-luxury.css` | 122 | Dead code |
| `styles/tokens-v4-light-luxury.css` | 378 | Dead code |

**Total dead CSS:** ~1,672 lines  
**Recommendation:** Remove in a future cleanup wave to reduce repo size.

---

## Summary

| Category | Score | Action |
|---|---|---|
| Color tokens | 9/10 | ✅ 5 fixes applied, rest intentional |
| Border radius | 8/10 | ⚠️ 77 `rounded-md/sm` — mostly acceptable |
| Typography | 10/10 | ✅ Excellent consistency |
| Section spacing | 9/10 | ✅ Good responsive patterns |
| Container widths | 9/10 | ✅ Appropriate for content types |
| Gap spacing | 10/10 | ✅ Follows 4px grid |
| Dead CSS | — | 🧹 1,672 lines to clean up |

**Overall Design System Health: 9.2/10**

The design system is well-implemented and consistently applied across the codebase. The token infrastructure in `design-system.css` is comprehensive and serves as a strong single source of truth. Minor improvements have been applied, and remaining items are documented for future waves.
