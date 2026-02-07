# Audit Findings — 4 Admin Modules Quality Gaps

## 1. SETTINGS — Gaps
- [x] Has 8 tabs with save/load from DB — GOOD
- [ ] Missing: Activity Log tab showing who changed what, when (need to add a tab showing admin_activity_log)
- [ ] Missing: "Test Connection" buttons for integrations (Calendly, Stripe, GA)
- [ ] Missing: "Reset to Default" buttons per section
- [ ] Missing: Last saved timestamp display per section
- [ ] Missing: Confirmation dialog before saving critical settings (security, payments)

## 2. CMS PAGE BUILDER — Gaps
- [x] Has pages CRUD, sections CRUD, navigation builder — GOOD
- [ ] Missing: "Preview" button (public preview + student preview)
- [ ] Missing: "Duplicate Page" quick action
- [ ] Missing: Page versioning (save as draft version, restore previous)
- [ ] Missing: Section content editing (currently only title editable, no rich content fields per section type)
- [ ] Missing: Responsive preview toggle (desktop/tablet/mobile)

## 3. AI COMPANION PANEL — Gaps
- [x] Has overview KPIs, top users, by level, by type, daily trend, settings, content feeding — GOOD
- [ ] Missing: User drill-down (click a user → see their sessions, progression, errors)
- [ ] Missing: Configurable rules (A/B/C level targets, simulation types, difficulty settings)
- [ ] Missing: Error tracking (common mistakes, frequent errors by category)
- [ ] Missing: Session replay/transcript view

## 4. SALES ANALYTICS — Gaps
- [x] Has funnel, LTV, churn, revenue, export — GOOD
- [ ] Missing: Event-driven funnel stages (opt-in → checkout → purchase → repeat)
- [ ] Missing: Rich CSV export columns (date, source, product, cohort, payment method)
- [ ] Missing: Date range filter for all analytics views
- [ ] Missing: Comparison period (this month vs last month)
- [ ] Missing: Cohort analysis view
