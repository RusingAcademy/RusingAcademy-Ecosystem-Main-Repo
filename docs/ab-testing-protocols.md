# A/B Testing Protocols — RusingAcademy

## Overview

This document outlines the A/B testing framework, hypotheses, and protocols for the RusingAcademy Learning Ecosystem. All experiments follow a rigorous statistical methodology to ensure data-driven decision making.

## Statistical Methodology

### Significance Thresholds

| Metric | Threshold | Rationale |
|--------|-----------|-----------|
| **Confidence Level** | 95% (p < 0.05) | Industry standard for web optimization |
| **Minimum Sample Size** | 300-1000 per variant | Depends on expected effect size |
| **Minimum Runtime** | 14 days | Captures weekly traffic patterns |
| **Maximum Runtime** | 90 days | Prevents indefinite experiments |

### Sample Size Calculation

For a two-proportion Z-test with:
- Baseline conversion rate: 3-5%
- Minimum detectable effect: 10-20% relative improvement
- Power: 80%
- Significance: 95%

Required sample sizes range from 300 (large effect) to 1000 (small effect) per variant.

## Active Experiments

### Experiment 1: Hero CTA Text Optimization

| Parameter | Value |
|-----------|-------|
| **ID** | `hero-cta-text` |
| **Hypothesis** | Action-oriented, specific CTA text will increase click-through rate by 15% |
| **Control** | "Book Your Free Assessment" |
| **Variant A** | "Start Your SLE Journey Today" |
| **Conversion Goal** | Free assessment booking completion |
| **Min Sample** | 500 per variant |
| **Expected Duration** | 4-6 weeks |

### Experiment 2: Hero CTA Color Scheme

| Parameter | Value |
|-----------|-------|
| **ID** | `hero-cta-color` |
| **Hypothesis** | High-contrast orange CTA will outperform emerald green by 10% |
| **Control** | Brand Orange (#C65A1E) |
| **Variant A** | Emerald Green (#059669) |
| **Conversion Goal** | Hero CTA click-through |
| **Min Sample** | 1000 per variant |
| **Expected Duration** | 6-8 weeks |

### Experiment 3: Assessment Form Length

| Parameter | Value |
|-----------|-------|
| **ID** | `form-length` |
| **Hypothesis** | Shorter 3-field form will increase completion by 20% |
| **Control** | Full form (7 fields: name, email, phone, department, level, goal, timeline) |
| **Variant A** | Short form (3 fields: name, email, current level) |
| **Conversion Goal** | Form submission completion |
| **Min Sample** | 300 per variant |
| **Expected Duration** | 4-6 weeks |

### Experiment 4: Social Proof Placement (Draft)

| Parameter | Value |
|-----------|-------|
| **ID** | `social-proof-placement` |
| **Hypothesis** | Above-fold trust badges will increase conversion by 12% |
| **Control** | Trust badges below the fold |
| **Variant A** | Trust badges in hero area |
| **Conversion Goal** | Page engagement (scroll depth + time on page) |
| **Min Sample** | 800 per variant |

### Experiment 5: Persona Selector Visibility (Draft)

| Parameter | Value |
|-----------|-------|
| **ID** | `persona-selector-visibility` |
| **Hypothesis** | Visible persona selector increases time on site by 25% |
| **Control** | No persona selector on homepage |
| **Variant A** | Persona selector visible on homepage |
| **Conversion Goal** | Persona engagement + assessment booking |
| **Min Sample** | 600 per variant |

## Key Conversion Points

1. **Free Assessment Bookings** — Primary conversion goal
2. **Placement Test Starts** — Secondary conversion goal
3. **Course Enrollments** — Revenue conversion goal
4. **Email Capture** — Lead generation goal
5. **Contact Form Submissions** — Sales pipeline goal

## Testing Workflow

1. **Define Hypothesis** — Clear, measurable, with expected effect size
2. **Calculate Sample Size** — Based on baseline rate and minimum detectable effect
3. **Implement Variants** — Using `<ABTest>` component or `useExperimentVariant` hook
4. **Launch Experiment** — Set status to "running" in experiment config
5. **Monitor Daily** — Check for sample ratio mismatch and data quality
6. **Analyze Results** — Wait for minimum sample size and significance
7. **Document Findings** — Record results, learnings, and next steps
8. **Implement Winner** — Roll out winning variant to 100% of traffic

## Usage Examples

### Declarative Component

```tsx
import { ABTest } from "@/components/month5/ab-testing";

<ABTest experimentId="hero-cta-text">
  <ABTest.Variant id="control">
    <Button>Book Your Free Assessment</Button>
  </ABTest.Variant>
  <ABTest.Variant id="variant-a">
    <Button>Start Your SLE Journey Today</Button>
  </ABTest.Variant>
</ABTest>
```

### Programmatic Hook

```tsx
import { useExperimentVariant } from "@/components/month5/ab-testing";

function HeroSection() {
  const { variant, trackConversion } = useExperimentVariant("hero-cta-color");

  const ctaColor = variant === "control" ? "#C65A1E" : "#059669";

  return (
    <Button
      style={{ backgroundColor: ctaColor }}
      onClick={() => {
        trackConversion("hero_cta_click");
        navigate("/assessment");
      }}
    >
      Book Your Free Assessment
    </Button>
  );
}
```

## Guardrails

- Never run more than 3 experiments simultaneously on the same page
- Ensure experiments don't interact (orthogonal design)
- Always include a "control" variant that matches current production
- Monitor for sample ratio mismatch (SRM) — flag if deviation > 1%
- Pause experiments if conversion rate drops below 50% of baseline
- All experiments must be reviewed by the product team before launch
