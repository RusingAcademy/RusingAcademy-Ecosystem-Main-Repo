# Sprint-to-Commit Map

This document provides an explicit mapping of sprints to Git commits/tags for the RusingÂcademy Ecosystem project.

## Sprint Tags

| Sprint | Tag | Commit | Description |
|--------|-----|--------|-------------|
| Sprint 0 | `sprint-0` | `528a7a2` | Fortress & Speed - Security headers, performance optimizations, brand name fix |
| Sprint 0.1 | `sprint-0.1` | `a578578` | Performance optimizations - lazy-load jsPDF and improved code splitting |
| Sprint 1 | `sprint-1` | `ffe1fff` | Ecosystem nav + CTA unification + AI route canonicalization |
| Sprint 1.1 | `sprint-1.1` | `475a016` | Implement hybrid SEO strategy |
| Sprint 2 | `sprint-2` | `7c4f075` | UI Polish - Add Home button and Calendly CTA to header |
| Sprint 2.1 | `sprint-2.1` | `f712e03` | Optimize Critical Rendering Path |
| Sprint 2.2 | `sprint-2.2` | `e074fe8` | Image optimization via Cloudinary + Lazy chatbot (LAST KNOWN WORKING) |
| Incident Fix | `incident-fix-pr14` | `c570f5d` | PR #14 - Resolve React mounting failure |
| Stable Post-Fix | `stable-post-fix` | `c570f5d` | Current stable main after incident resolution |

## Critical Milestones

### Last Known Working State (Before Incident)
- **Tag:** `sprint-2.2`
- **Commit:** `e074fe8`
- **Description:** Sprint 2.2 - Image optimization via Cloudinary + Lazy chatbot

### Incident Resolution
- **Tag:** `incident-fix-pr14`
- **Commit:** `c570f5d`
- **PR:** https://github.com/RusingAcademy/rusingacademy-ecosystem/pull/14
- **Description:** Fixed React mounting failure caused by circular chunk dependencies and manus-runtime plugin conflict

### Current Stable
- **Tag:** `stable-post-fix`
- **Commit:** `c570f5d`
- **Description:** Production-verified stable state after incident resolution

## Guardrails (Post-Incident)

The following changes are **frozen** and must NOT be reintroduced:

1. ❌ `vite-plugin-manus-runtime` - Caused 360KB inline script conflict
2. ❌ Complex `manualChunks` configuration - Caused circular dependencies
3. ❌ Any changes to chunk splitting without thorough testing

## Usage

To rollback to a specific sprint:
```bash
git checkout <tag-name>
```

To view all sprint tags:
```bash
git tag -l "sprint-*"
```
