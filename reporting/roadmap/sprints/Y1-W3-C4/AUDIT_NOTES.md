# Sprint C4: Analytics & Reporting — Audit Notes

## Existing Infrastructure

### Backend Routers
- `stripeKPIData`: getStripeRevenue, getUserAnalytics, getAIMetrics (233 lines)
- `salesAnalyticsRouter`: getConversionFunnel, getStudentLTV, getChurn, getMonthlyRevenue, getExportData, getRevenueByProduct, getRevenueByCohort
- `aiAnalyticsRouter`: AI usage analytics
- `progressReportRouter`: generateMyReport, generateLearnerReport, getMyProgressData (PDF generation)

### Frontend Pages
- `admin/Analytics.tsx` (66 lines) — Basic stats grid with users, coaches, sessions, revenue
- `AdminAnalytics.tsx` (475 lines) — Comprehensive admin analytics component
- `SalesAnalytics.tsx` (420 lines) — Sales-specific analytics
- `ProgressReport.tsx` (181 lines) — Learner progress report page

### Gaps Identified
1. **No government-ready compliance report** — No exportable summary for GC/TBS audit
2. **No learner cohort analysis** — No way to see enrollment trends by month/quarter
3. **No SLE readiness metrics** — No aggregate view of learner SLE levels and exam readiness
4. **No CSV/PDF export from admin analytics** — Data is view-only
5. **No bilingual labels** on admin analytics pages
6. **No completion rate trends** — Only current snapshot, no historical trend

## Sprint C4 Focus
1. Create a Government Compliance Report endpoint (exportable)
2. Add SLE Readiness Dashboard to admin analytics
3. Add CSV export capability to existing analytics
4. Add bilingual labels to the main admin analytics page
5. Create a LearnerCohortAnalytics component
