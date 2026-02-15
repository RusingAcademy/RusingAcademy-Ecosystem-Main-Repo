# Sprint C4: Analytics & Reporting (Government-Ready)

## Goal
Enhance the analytics infrastructure with government-ready compliance reporting, SLE readiness metrics, CSV export capabilities, and bilingual admin analytics — making the platform audit-ready for Canadian public service procurement.

## Scope
1. **Government Compliance Report endpoint** — Exportable JSON/CSV summary for GC/TBS audit
2. **SLE Readiness Dashboard** — Aggregate view of learner SLE levels and exam readiness
3. **CSV Export** — Download capability for enrollment, revenue, and learner data
4. **Bilingual Admin Analytics** — EN/FR labels on the main analytics page
5. **Learner Cohort Analytics** — Enrollment trends by month/quarter

## Success Metrics
- Admin can export a compliance report with one click
- SLE readiness metrics visible on admin dashboard
- CSV export works for all major data tables
- Analytics page renders correctly in both EN and FR

## Risks
- Large data queries may be slow — mitigate with LIMIT and pagination
- CSV generation for large datasets — stream or chunk

## Dependencies
- Existing `stripeKPIData`, `salesAnalyticsRouter`, `progressReportRouter`
- Existing `admin/Analytics.tsx` page
