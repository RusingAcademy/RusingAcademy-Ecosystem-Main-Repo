# EcosystemHub Design Style Guide

## Color Accessibility & Contrast Standards

This guide documents the color combinations and accessibility standards for the RusingAcademy Learning Ecosystem. All color combinations have been validated against WCAG 2.1 guidelines.

---

## Quick Reference

| Background Type | Text Color | CSS Class | Contrast Ratio | WCAG Level |
|----------------|------------|-----------|----------------|------------|
| White (#FFFFFF) | Primary (#0B1220) | `text-primary` | 17.4:1 | AAA ✅ |
| White (#FFFFFF) | Muted (#374151) | `text-muted-foreground` | 7.5:1 | AAA ✅ |
| Porcelain (#F7F6F3) | Primary (#0B1220) | `text-primary` | 15.8:1 | AAA ✅ |
| Porcelain (#F7F6F3) | Muted (#374151) | `text-muted-foreground` | 6.8:1 | AA ✅ |
| Teal (#0F3D3E) | White (#FFFFFF) | `text-white` | 9.2:1 | AAA ✅ |
| Obsidian (#0B1220) | White (#FFFFFF) | `text-white` | 17.4:1 | AAA ✅ |
| Dark Surface (#1F2937) | Light (#F7F6F3) | `text-foreground` | 11.2:1 | AAA ✅ |
| Copper CTA (#C65A1E) | White (#FFFFFF) | `text-white` | 4.3:1 | AA (large) ✅ |

---

## Light Mode Guidelines

### Primary Text
Use for headings, important content, and body text that needs maximum readability.

```css
/* CSS Variable */
--text: #0B1220;

/* Tailwind Class */
.text-primary { color: #0B1220; }
```

**Usage:**
- Page titles and section headings
- Primary body text
- Navigation labels
- Form labels

### Muted Text
Use for secondary information, descriptions, and supporting content.

```css
/* CSS Variable */
--muted: #374151;

/* Tailwind Class */
.text-muted-foreground { color: #374151; }
```

**Usage:**
- Paragraph descriptions
- Card subtitles
- Timestamps and metadata
- Helper text

### Backgrounds
| Background | Hex Code | CSS Variable | Usage |
|------------|----------|--------------|-------|
| White | #FFFFFF | `--surface` | Cards, modals, inputs |
| Porcelain | #F7F6F3 | `--bg` | Page backgrounds |
| Sand | #EEE9DF | `--sand` | Section dividers, subtle backgrounds |

---

## Dark Mode Guidelines

### Text on Dark Backgrounds
When using dark backgrounds (teal-900, slate-900, obsidian), always use light text.

```css
/* CSS Variable */
--text-on-dark: #F7F6F3;
--muted-on-dark: rgba(255, 255, 255, 0.85);

/* Tailwind Classes */
.text-white { color: #FFFFFF; }
.text-white/80 { color: rgba(255, 255, 255, 0.8); }
```

**Automatic Application:**
The CSS in `tokens.css` automatically applies light text to elements inside dark sections:

```css
/* These selectors auto-apply white text */
[class*="bg-slate-900"] .text-muted-foreground { color: rgba(255, 255, 255, 0.8); }
[class*="bg-teal-900"] .text-muted-foreground { color: rgba(255, 255, 255, 0.8); }
```

### Dark Backgrounds
| Background | Hex Code | CSS Variable | Usage |
|------------|----------|--------------|-------|
| Obsidian | #0B1220 | `--brand-obsidian` | Dark mode page background |
| Dark Surface | #1F2937 | `--surface` (dark) | Cards in dark mode |
| Foundation Teal | #0F3D3E | `--brand-foundation` | Hero sections, CTAs |

---

## Brand Colors

### Foundation Teal (Trust & Professionalism)
```css
--brand-foundation: #0F3D3E;
--brand-foundation-2: #145A5B;
--brand-foundation-soft: #E7F2F2;
```

**Usage:**
- Primary brand elements
- Hero section backgrounds
- Trust indicators
- Navigation highlights

### Electric Copper (CTA & Innovation)
```css
--brand-cta: #C65A1E;
--brand-cta-2: #E06B2D;
--brand-cta-soft: #FFF1E8;
```

**Usage:**
- Call-to-action buttons (use with white text, large font)
- Accent highlights
- Important notifications

**Note:** White text on copper has a 4.3:1 ratio, suitable for large text (14px+ bold or 18px+) per WCAG AA.

### Barholex Gold (Premium & Consulting)
```css
--barholex-gold: #D4A853;
--barholex-gold-2: #C49843;
--barholex-gold-soft: #FFF4D6;
```

**Usage:**
- Barholex Media branding
- Premium features
- Consulting services

---

## Component-Specific Guidelines

### Cards
```jsx
// Light mode card
<Card className="bg-white text-primary">
  <CardTitle>Title</CardTitle>
  <CardDescription className="text-muted-foreground">
    Description text
  </CardDescription>
</Card>

// Dark mode card (automatic via .dark class)
<Card className="bg-white dark:bg-surface">
  <CardTitle>Title</CardTitle>
  <CardDescription className="text-muted-foreground">
    Description text
  </CardDescription>
</Card>
```

### Hero Sections
```jsx
// Dark hero with gradient
<section className="bg-gradient-to-br from-teal-900 to-slate-900">
  <h1 className="text-white">Heading</h1>
  <p className="text-white/80">Subheading</p>
</section>
```

### Buttons
```jsx
// Primary CTA (copper)
<Button className="bg-cta text-white font-semibold">
  Get Started
</Button>

// Secondary (teal outline)
<Button variant="outline" className="border-foundation text-foundation">
  Learn More
</Button>
```

---

## Testing Accessibility

Run the accessibility tests to verify color contrast:

```bash
pnpm test server/accessibility.test.ts
```

The tests verify:
- Light mode text combinations (5 tests)
- Dark mode text combinations (4 tests)
- Brand color accessibility (3 tests)
- Documented contrast ratios (1 test)

---

## Common Mistakes to Avoid

### ❌ Don't
```jsx
// Using muted text on dark background without override
<section className="bg-slate-900">
  <p className="text-muted-foreground">Hard to read!</p>
</section>
```

### ✅ Do
```jsx
// Using white text on dark background
<section className="bg-slate-900">
  <p className="text-white/80">Easy to read!</p>
</section>

// Or let CSS auto-apply (tokens.css handles this)
<section className="bg-slate-900">
  <p className="text-muted-foreground">Auto-converted to white!</p>
</section>
```

---

## References

- [WCAG 2.1 Contrast Guidelines](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- Design Tokens: `/client/src/styles/tokens.css`
- Accessibility Tests: `/server/accessibility.test.ts`

---

*Last updated: January 26, 2026*
*Maintained by: Manus AI*
