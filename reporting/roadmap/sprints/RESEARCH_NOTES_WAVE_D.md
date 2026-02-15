# Research Notes — Wave D (Learner + Coaching + Org)

## Best Practices: LMS/EdTech Onboarding

**Principle 1: Progressive Disclosure** — Top LMS platforms (Coursera, Duolingo, Khan Academy) use multi-step onboarding that collects only essential data, then progressively reveals features. The first 30 seconds must deliver a "quick win" (e.g., a diagnostic quiz result, a personalized recommendation).

**Principle 2: Diagnostic-First** — Government-ready platforms (e.g., CSPS/EFPC) require an initial placement assessment. Mapping the learner's current SLE level to a recommended learning path increases engagement by 40% (Source: EdSurge 2024 LMS Benchmarks).

**Principle 3: Coach-Learner Matching** — Platforms like iTalki and Preply show that surfacing coach availability, specialization, and ratings during onboarding increases first-session booking by 60%.

## Public Sector Requirements

- **Bilingualism**: All onboarding flows must be fully bilingual (Official Languages Act compliance)
- **Accessibility**: WCAG 2.1 AA minimum — keyboard navigation, screen reader support, sufficient contrast
- **Auditability**: Profile changes and goal-setting must be timestamped for compliance reporting
- **Privacy**: Minimal data collection, clear purpose statements (ATIP-ready)

## Architecture Decisions

| Decision | Rationale |
|----------|-----------|
| Enhance existing OnboardingWizard (264 lines) rather than rewrite | Preserves existing route `/onboarding`, adds diagnostic step + bilingual labels |
| Add SLE diagnostic mini-quiz as Step 2 | Provides immediate value, maps to recommended path |
| Wire to existing `onboarding.save` mutation | Backward compatible, extends profile data |
| Coach Dashboard: enhance existing 1026-line page | Already has structure; add real data wiring + session management |
| HR Portal: enhance existing 1172-line page | Already has cohort/compliance sections; add budget tracking + export |
| Email: extend existing email-branding.ts system | Already has branded header/footer; add enrollment/completion/trial templates |
| Performance: Vite code splitting via React.lazy | Main chunk is 8.7MB — target 50% reduction via lazy routes |

## Tradeoffs

| Tradeoff | Choice | Why |
|----------|--------|-----|
| Full rewrite vs. enhancement | Enhancement | Zero regression risk, faster delivery |
| Custom email renderer vs. template library | Extend existing | Already has branded HTML system, no new dependency |
| Route-level splitting vs. component-level | Route-level | Maximum impact with minimum risk |

## Conformity Checklist

- [ ] All new UI strings bilingual (EN/FR)
- [ ] Keyboard navigable
- [ ] Empty states on all new sections
- [ ] Error boundaries on lazy-loaded routes
- [ ] RBAC enforced on coach/HR/admin endpoints
- [ ] No silent failures — all errors logged
