# Sprint D4 — Transactional Email Templates (FR/EN)

## Goal

Create the 8 missing high-impact transactional email templates that cover the full learner lifecycle: enrollment, completion, quiz results, streak milestones, trial expiry, invoices, coach assignment, and HR compliance alerts. All templates bilingual (FR/EN) using the existing email branding system.

## Scope

1. Create `server/email-transactional-templates.ts` with 8 new bilingual email templates
2. Wire enrollment confirmation to the Stripe webhook and free enrollment flow
3. Wire course completion email to the certificate generation flow
4. All templates use existing `EMAIL_BRANDING` and `generateEmailFooter` for consistency

## Success Metrics

| Metric | Target |
|--------|--------|
| Build passes | Zero errors |
| New email templates | 8 |
| All templates bilingual | FR + EN |
| Templates use existing branding | Yes |
| Zero regressions | Yes |
