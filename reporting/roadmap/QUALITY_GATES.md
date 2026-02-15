# Quality Gates & Definition of Done

**Document ID:** QG-2026-001
**Date:** February 15, 2026

---

## 1. Introduction

This document defines the non-negotiable quality gates that every sprint must pass to be considered "DONE". These gates ensure that every change improves the stability, performance, security, and overall quality of the RusingAcademy Learning Ecosystem. Adherence to these standards is mandatory to prevent the accumulation of technical debt and to build a platform ready for the Canadian public service market.

## 2. The Five Pillars of Quality

Our quality assurance process is built on five pillars. Every sprint must demonstrate compliance with all five.

### Pillar 1: Testing & Validation

| Gate | Requirement | Tooling / Method |
|------|-------------|------------------|
| **Unit Test Coverage** | All new or modified business logic (services, utilities, hooks) must achieve **>90% unit test coverage**. | Vitest |
| **Integration Tests** | All critical user flows (e.g., authentication, registration, course enrollment, checkout) must be covered by integration tests. | Vitest, React Testing Library |
| **End-to-End (E2E) Tests** | All core user journeys must be covered by automated E2E tests. These tests must pass against the staging environment before merging to main. | Playwright |
| **Manual QA** | A documented QA checklist must be executed for every feature, covering functional requirements, UI/UX, and cross-browser compatibility. | Manual testing, BrowserStack |

### Pillar 2: Performance

| Gate | Requirement | Tooling / Method |
|------|-------------|------------------|
| **Page Load Time** | Core pages (Homepage, Courses, Login) must achieve a Largest Contentful Paint (LCP) of **< 2.5 seconds**. | Lighthouse, WebPageTest |
| **API Response Time** | The 95th percentile (p95) for all tRPC API responses must be **< 200ms**. | Sentry, Grafana, custom logging |
| **Bundle Size** | The main client bundle size must not increase by more than 5% in a single sprint without explicit justification and optimization. | `vite-bundle-visualizer` |

### Pillar 3: Security

| Gate | Requirement | Tooling / Method |
|------|-------------|------------------|
| **Vulnerability Scanning** | No new `HIGH` or `CRITICAL` vulnerabilities may be introduced into the codebase. All dependencies must be scanned on every commit. | Snyk, GitHub Dependabot |
| **Static Analysis (SAST)** | Code must pass static analysis checks for common security flaws (e.g., SQL injection, XSS). | CodeQL, SonarQube |
| **Secrets Management** | No secrets (API keys, passwords) may be hardcoded. All secrets must be managed via environment variables and a secure vault. | Doppler, HashiCorp Vault |
| **Permissions Review** | Any changes to the RBAC system or user permissions must undergo a specific security review. | Manual code review |

### Pillar 4: Accessibility & Compliance

| Gate | Requirement | Tooling / Method |
|------|-------------|------------------|
| **WCAG 2.1 AA** | All new or modified UI components must pass automated WCAG 2.1 Level AA checks. | Axe, Lighthouse |
| **Bilingual Parity** | All user-facing text must have both English and French translations. | i18n key validation scripts |
| **Privacy by Design** | Features must be designed with PIPEDA principles in mind (e.g., data minimization, user consent). | Manual review |

### Pillar 5: Code Quality & Maintainability

| Gate | Requirement | Tooling / Method |
|------|-------------|------------------|
| **Linting & Formatting** | All code must pass ESLint and Prettier checks. No linting errors or warnings are permitted in the main branch. | ESLint, Prettier |
| **Code Review** | Every pull request must be reviewed and approved by at least one other engineer before merging. | GitHub Pull Requests |
| **Documentation** | All new API endpoints, complex components, and core services must be documented using JSDoc/TSDoc. | TSDoc |
| **No Regressions** | The sprint must not introduce any regressions in existing functionality. | Automated tests, manual QA |

---

## 3. The Quality Gate Process

1. **During Development:** Developers are responsible for writing tests and ensuring their code meets quality standards.
2. **Pull Request:** When a PR is created, automated checks (CI pipeline) run for linting, testing, and vulnerability scanning.
3. **Staging Deployment:** The PR is deployed to a staging environment.
4. **QA & Validation:** E2E tests are run, and manual QA is performed on the staging environment.
5. **Approval & Merge:** Once all gates are green, the PR is approved and merged to the main branch.
6. **Production Deployment:** The main branch is automatically deployed to production.

Only by enforcing these gates at every step can we build a robust, scalable, and trustworthy platform.
