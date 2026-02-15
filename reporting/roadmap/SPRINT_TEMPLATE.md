# Sprint Template: [Sprint Title]

**Sprint ID:** [e.g., Y1-W1-S01]
**Wave:** [e.g., 1 — Foundational Fixes]
**Duration:** [e.g., 2 weeks]
**Priority:** [P0, P1, P2]
**Type:** [Quick Win, Foundational Work, Feature, Refactor, Research]

---

## 1. Objective

*A clear, concise statement describing the primary goal of this sprint. What is the single most important outcome we are trying to achieve?*

## 2. Key Deliverables

*A measurable list of what will be produced by the end of the sprint.*

1. **[Deliverable 1]:** [Description of the deliverable]
2. **[Deliverable 2]:** [Description of the deliverable]
3. **[Deliverable 3]:** [Description of the deliverable]

## 3. Business Impact

*How does this sprint contribute to the overall business goals?*

| Metric | Impact | Rationale |
|--------|--------|-----------|
| Revenue | [e.g., High, Medium, Low, N/A] | [e.g., Enables B2G sales channel] |
| Retention | [e.g., High, Medium, Low, N/A] | [e.g., Fixes critical bugs in course progression] |
| Governance | [e.g., High, Medium, Low, N/A] | [e.g., Implements required WCAG 2.1 AA compliance] |
| Efficiency | [e.g., High, Medium, Low, N/A] | [e.g., Automates manual content deployment] |

## 4. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation Strategy |
|------|------------|--------|---------------------|
| [e.g., Upstream API change] | [e.g., Medium] | [e.g., High] | [e.g., Pin API version, add contract testing] |
| [e.g., Scope creep] | [e.g., High] | [e.g., Medium] | [e.g., Strict adherence to sprint backlog, defer new requests] |

## 5. Dependencies

*What other sprints, teams, or external factors does this sprint depend on?*

- **[Dependency 1]:** [e.g., Completion of Sprint Y1-W1-S00]
- **[Dependency 2]:** [e.g., Access to production Stripe API keys]

## 6. Quality Gate Criteria

*The specific, non-negotiable criteria that must be met for this sprint to be considered "DONE".*

| Category | Requirement | Status |
|----------|-------------|--------|
| **Unit Tests** | >90% code coverage on new/modified code | [ ] PASS |
| **Integration Tests** | All critical user flows passing (e.g., login, checkout) | [ ] PASS |
| **E2E Tests** | All Playwright tests passing against staging | [ ] PASS |
| **Performance** | Page load < 3s, API response < 200ms (p95) | [ ] PASS |
| **Security** | No new vulnerabilities detected by Snyk/Dependabot | [ ] PASS |
| **Accessibility** | All new components pass WCAG 2.1 AA automated checks | [ ] PASS |
| **Code Review** | Approved by at least one other engineer | [ ] PASS |
| **Deployment** | Deployed to staging, validated, and merged to main | [ ] PASS |

---

*This template serves as the standard for all sprints in the 3-year roadmap.*
