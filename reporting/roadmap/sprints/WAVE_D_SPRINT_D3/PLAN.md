# Sprint D3 — HR/Organization Portal Enhancement

## Goal

Eliminate all 404 dead-ends in the HR Client Portal by creating the 6 missing pages referenced in the sidebar navigation, and wire the HRSidebar organization card to display dynamic data instead of hardcoded values.

## Scope

The HR portal sidebar has 11 navigation items, but only 5 had corresponding pages. This sprint creates the remaining 6 pages (Reports, Calendar, Notifications, Organization, Settings, Help) with full bilingual support and professional empty states. The HRSidebar organization card is also wired to fetch real organization data via the existing `hr.getMyOrganization` tRPC endpoint.

## Success Metrics

| Metric | Target | Result |
|--------|--------|--------|
| Build passes | Zero errors | PASS |
| Sidebar nav items with real pages | 11/11 | 11/11 |
| New pages with bilingual support | 6/6 | 6/6 |
| HRSidebar dynamic org data | Yes | Yes |
| Zero regressions | Yes | Yes |
