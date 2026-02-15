# RusingAcademy Ecosystem — 3-Year Strategic Roadmap (2026-2028)

**Document ID:** ROADMAP-2026-001
**Date:** February 15, 2026
**Based on:** `ECOSYSTEM_AUDIT_MASTER.md` (AUDIT-2026-Q1-001)

---

## 1. Strategic Vision & Guiding Principles

The vision for the next three years is to transform the RusingAcademy Learning Ecosystem from a promising, feature-rich platform into a **robust, scalable, and compliant** system that is the undisputed leader in bilingual training for the Canadian public service. This roadmap prioritizes **finishing over starting**, focusing on bringing existing features to production-grade maturity before expanding the platform's surface area.

Our guiding principles are:

1.  **Stabilize the Foundation First:** Address all P0 technical debt (migrations, CI/CD, observability) before building new features.
2.  **Complete the Core Journey:** Ensure the visitor-to-learner-to-certified professional journey is seamless, complete, and premium.
3.  **Achieve B2G Compliance:** Systematically address WCAG, bilingualism, and data residency requirements to unlock the public sector market.
4.  **Deepen, Don't Just Widen:** Focus on making existing features (LMS, AI, community) more robust and integrated rather than adding new, disconnected ones.
5.  **Data-Driven Decisions:** Implement analytics and tracking to measure impact and inform future prioritization.

## 2. Roadmap Structure: Waves & Sprints

This roadmap is organized into **12 quarterly Waves**. Each Wave contains a series of **2-week Sprints**. This structure provides a high-level strategic view while allowing for agile execution.

-   **Year 1 (Waves 1-4):** Foundational Stability & Core Journey Completion
-   **Year 2 (Waves 5-8):** B2G Compliance & Monetization Expansion
-   **Year 3 (Waves 9-12):** Scale, Intelligence & Market Leadership

## 3. High-Level 3-Year Plan

| Year | Quarter | Wave | Primary Focus |
|------|---------|------|----------------------------------------------------------------|
| **1** | Q1 | 1 | **Foundational Fixes:** CI/CD, Migrations, Observability, Backups |
| | Q2 | 2 | **Core Journey Part 1:** Course Content Population & LMS Polish |
| | Q3 | 3 | **Core Journey Part 2:** Checkout Flow & Onboarding Wizard |
| | Q4 | 4 | **Admin & Coach Experience:** ACC Consolidation & Payouts Automation |
| **2** | Q1 | 5 | **B2G Compliance Part 1:** WCAG 2.1 AA & Accessibility Audit |
| | Q2 | 6 | **B2G Compliance Part 2:** Full Bilingual Parity (i18n Expansion) |
| | Q3 | 7 | **Monetization Expansion:** B2G Invoicing, Volume Licensing, SSO |
| | Q4 | 8 | **Community & Engagement:** Forum, Events, Gamification v2 |
| **3** | Q1 | 9 | **AI & Intelligence Part 1:** Cost Controls & Personalization |
| | Q2 | 10 | **AI & Intelligence Part 2:** Adaptive Learning Paths & AI Coach v2 |
| | Q3 | 11 | **Scale & Performance:** Microservices Decomposition & Global CDN |
| | Q4 | 12 | **Market Leadership:** R&D, New Ventures, API-as-a-Product |

---

## Year 1: Foundational Stability & Core Journey Completion

### Wave 1: Foundational Fixes (Q1 2026)

*Objective: Eliminate all P0 technical debt and establish a stable, automated foundation for all future development.*

| Sprint | Title | Duration | Priority | Impact |
|--------|-------|----------|----------|--------|
| Y1-W1-S01 | **CI/CD Pipeline Implementation** | 2 weeks | P0 | Efficiency |
| Y1-W1-S02 | **Database Migration System** | 2 weeks | P0 | Governance |
| Y1-W1-S03 | **Observability Stack Setup** | 2 weeks | P0 | Retention |
| Y1-W1-S04 | **Automated Database Backups** | 1 week | P0 | Governance |
| Y1-W1-S05 | **Test Isolation & Mocking** | 2 weeks | P1 | Efficiency |
| Y1-W1-S06 | **E2E Test Automation** | 2 weeks | P1 | Retention |

### Wave 2: Core Journey Part 1 — Content & LMS (Q2 2026)

*Objective: Populate the LMS with high-quality course content and polish the learner experience.*

| Sprint | Title | Duration | Priority | Impact |
|--------|-------|----------|----------|--------|
| Y1-W2-S07 | **Content Production Pipeline** | 2 weeks | P0 | Revenue |
| Y1-W2-S08 | **SLE Course Population (Level B)** | 2 weeks | P0 | Revenue |
| Y1-W2-S09 | **SLE Course Population (Level C)** | 2 weeks | P0 | Revenue |
| Y1-W2-S10 | **LMS UI/UX Polish** | 2 weeks | P1 | Retention |
| Y1-W2-S11 | **Certificate Generation & Delivery** | 2 weeks | P1 | Retention |
| Y1-W2-S12 | **Course Review & Rating System** | 1 week | P1 | Retention |

### Wave 3: Core Journey Part 2 — Commerce & Onboarding (Q3 2026)

*Objective: Create a seamless, trustworthy checkout experience and a welcoming onboarding flow.*

| Sprint | Title | Duration | Priority | Impact |
|--------|-------|----------|----------|--------|
| Y1-W3-S13 | **Stripe Checkout E2E Validation** | 2 weeks | P0 | Revenue |
| Y1-W3-S14 | **User Onboarding Wizard** | 2 weeks | P1 | Retention |
| Y1-W3-S15 | **Abandoned Cart Recovery** | 2 weeks | P1 | Revenue |
| Y1-W3-S16 | **Pricing Page v2 (with Tiers)** | 2 weeks | P1 | Revenue |
| Y1-W3-S17 | **Testimonials & Social Proof** | 1 week | P1 | Revenue |
| Y1-W3-S18 | **Cookie Consent & Privacy API** | 2 weeks | P1 | Governance |

### Wave 4: Admin & Coach Experience (Q4 2026)

*Objective: Streamline administrative workflows and automate coach payouts to improve operational efficiency.*

| Sprint | Title | Duration | Priority | Impact |
|--------|-------|----------|----------|--------|
| Y1-W4-S19 | **Admin Dashboard Consolidation** | 2 weeks | P1 | Efficiency |
| Y1-W4-S20 | **Stripe Connect Payouts Automation** | 2 weeks | P1 | Efficiency |
| Y1-W4-S21 | **RBAC Expansion for B2G Roles** | 2 weeks | P1 | Governance |
| Y1-W4-S22 | **CRM & Leads Management Polish** | 2 weeks | P1 | Efficiency |
| Y1-W4-S23 | **Automated Reporting (Weekly/Monthly)** | 2 weeks | P2 | Efficiency |
| Y1-W4-S24 | **Server Code Refactor (Consolidate Routers)** | 2 weeks | P2 | Efficiency |

---

## Year 2: B2G Compliance & Monetization Expansion

### Wave 5: B2G Compliance Part 1 — Accessibility (Q1 2027)

*Objective: Achieve WCAG 2.1 Level AA compliance across the entire platform.*

| Sprint | Title | Duration | Priority | Impact |
|--------|-------|----------|----------|--------|
| Y2-W5-S25 | **Accessibility Audit (Automated & Manual)** | 2 weeks | P1 | Governance |
| Y2-W5-S26 | **Semantic HTML & ARIA Refactor** | 2 weeks | P1 | Governance |
| Y2-W5-S27 | **Keyboard Navigation & Focus Management** | 2 weeks | P1 | Governance |
| Y2-W5-S28 | **Color Contrast & High-Contrast Mode** | 2 weeks | P1 | Governance |
| Y2-W5-S29 | **Screen Reader Compatibility** | 2 weeks | P1 | Governance |
| Y2-W5-S30 | **Accessibility Statement Publication** | 1 week | P1 | Governance |

### Wave 6: B2G Compliance Part 2 — Bilingualism (Q2 2027)

*Objective: Achieve full bilingual parity for all user-facing content and communications.*

| Sprint | Title | Duration | Priority | Impact |
|--------|-------|----------|----------|--------|
| Y2-W6-S31 | **i18n System Migration (react-i18next)** | 2 weeks | P1 | Governance |
| Y2-W6-S32 | **Translation Key Expansion (1000+ keys)** | 2 weeks | P1 | Governance |
| Y2-W6-S33 | **Bilingual Email Templates** | 2 weeks | P1 | Governance |
| Y2-W6-S34 | **Bilingual Course Content Ingestion** | 2 weeks | P1 | Governance |
| Y2-W6-S35 | **Language Switcher UX Polish** | 1 week | P2 | Retention |
| Y2-W6-S36 | **French-First Content QA Process** | 2 weeks | P1 | Governance |

### Wave 7: Monetization Expansion — B2G & Enterprise (Q3 2027)

*Objective: Build the infrastructure to support government and enterprise sales channels.*

| Sprint | Title | Duration | Priority | Impact |
|--------|-------|----------|----------|--------|
| Y2-W7-S37 | **B2G Invoicing & Procurement System** | 2 weeks | P1 | Revenue |
| Y2-W7-S38 | **Volume Licensing & Seat Management** | 2 weeks | P1 | Revenue |
| Y2-W7-S39 | **SAML/SSO Integration (GC IdP)** | 2 weeks | P1 | Revenue |
| Y2-W7-S40 | **Enterprise Dashboard & Reporting** | 2 weeks | P1 | Revenue |
| Y2-W7-S41 | **Data Residency & Sovereignty (Canada)** | 2 weeks | P1 | Governance |
| Y2-W7-S42 | **"For Government" Landing Page v2** | 1 week | P1 | Revenue |

### Wave 8: Community & Engagement (Q4 2027)

*Objective: Transform the scaffolded community features into a vibrant, engaging hub for learners.*

| Sprint | Title | Duration | Priority | Impact |
|--------|-------|----------|----------|--------|
| Y2-W8-S43 | **Forum Moderation & Admin Tools** | 2 weeks | P2 | Retention |
| Y2-W8-S44 | **Community Events & Webinars** | 2 weeks | P2 | Retention |
| Y2-W8-S45 | **Gamification v2 (Leaderboards, Streaks)** | 2 weeks | P2 | Retention |
| Y2-W8-S46 | **User-to-User Messaging Polish** | 2 weeks | P2 | Retention |
| Y2-W8-S47 | **Push Notification Center** | 2 weeks | P2 | Retention |
| Y2-W8-S48 | **Weekly Challenges & Rewards** | 2 weeks | P2 | Retention |

---

## Year 3: Scale, Intelligence & Market Leadership

### Wave 9: AI & Intelligence Part 1 — Cost & Personalization (Q1 2028)

*Objective: Rein in AI costs and leverage AI to create a more personalized learning experience.*

| Sprint | Title | Duration | Priority | Impact |
|--------|-------|----------|----------|--------|
| Y3-W9-S49 | **AI Cost Control & Budgeting Service** | 2 weeks | P1 | Efficiency |
| Y3-W9-S50 | **Semantic Caching for AI Responses** | 2 weeks | P1 | Efficiency |
| Y3-W9-S51 | **Personalized Course Recommendations** | 2 weeks | P2 | Retention |
| Y3-W9-S52 | **AI-Powered Content Safety Layer** | 2 weeks | P2 | Governance |
| Y3-W9-S53 | **Prompt Engineering & Versioning** | 2 weeks | P2 | Efficiency |
| Y3-W9-S54 | **AI Feature Analytics Dashboard** | 1 week | P2 | Efficiency |

### Wave 10: AI & Intelligence Part 2 — Advanced Coaching (Q2 2028)

*Objective: Evolve the AI features from simple companions to sophisticated, adaptive coaching tools.*

| Sprint | Title | Duration | Priority | Impact |
|--------|-------|----------|----------|--------|
| Y3-W10-S55 | **Adaptive Learning Paths (AI-driven)** | 2 weeks | P2 | Retention |
| Y3-W10-S56 | **AI Coach v2 (Conversational, Stateful)** | 2 weeks | P2 | Retention |
| Y3-W10-S57 | **AI-Generated Practice Exercises** | 2 weeks | P2 | Retention |
| Y3-W10-S58 | **Automated Writing & Speaking Feedback** | 2 weeks | P2 | Retention |
| Y3-W10-S59 | **AI-Powered Proctoring for SLE Exams** | 2 weeks | P2 | Revenue |
| Y3-W10-S60 | **AI Ethics & Bias Review** | 1 week | P2 | Governance |

### Wave 11: Scale & Performance (Q3 2028)

*Objective: Refactor the architecture to handle significant user growth and ensure global performance.*

| Sprint | Title | Duration | Priority | Impact |
|--------|-------|----------|----------|--------|
| Y3-W11-S61 | **Microservices Decomposition (Auth Service)** | 2 weeks | P1 | Efficiency |
| Y3-W11-S62 | **Microservices Decomposition (LMS Service)** | 2 weeks | P1 | Efficiency |
| Y3-W11-S63 | **Microservices Decomposition (Payments Service)** | 2 weeks | P1 | Efficiency |
| Y3-W11-S64 | **Global CDN for Static Assets** | 2 weeks | P2 | Retention |
| Y3-W11-S65 | **Database Read Replicas & Load Balancing** | 2 weeks | P2 | Retention |
| Y3-W11-S66 | **Load Testing & Chaos Engineering** | 2 weeks | P2 | Retention |

### Wave 12: Market Leadership & Innovation (Q4 2028)

*Objective: Solidify market leadership through R&D, new ventures, and by opening the platform.*

| Sprint | Title | Duration | Priority | Impact |
|--------|-------|----------|----------|--------|
| Y3-W12-S67 | **API-as-a-Product (Public API)** | 2 weeks | P2 | Revenue |
| Y3-W12-S68 | **Third-Party Integration Marketplace** | 2 weeks | P2 | Revenue |
| Y3-W12-S69 | **R&D: Voice Cloning for Coaches** | 2 weeks | P3 | N/A |
| Y3-W12-S70 | **R&D: VR/AR Language Practice** | 2 weeks | P3 | N/A |
| Y3-W12-S71 | **New Venture: Barholex Media EdTech SaaS** | 2 weeks | P3 | Revenue |
| Y3-W12-S72 | **Roadmap Planning for 2029-2031** | 1 week | P3 | N/A |

---

*This roadmap outlines 72 sprints over 3 years. The remaining 28-sprint capacity is reserved for bug fixes, smaller enhancements, and emergent priorities.*
