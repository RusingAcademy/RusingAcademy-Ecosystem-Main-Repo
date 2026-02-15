# Sprint Y1-W2-S09 — Enrollment & Payment Flow Hardening

## Goal
Harden the enrollment and payment flows with coupon support, admin manual enrollment, free enrollment confirmation, payment error handling, and invoice/receipt generation — making the platform revenue-ready and government-grade.

## Scope

### Backend
1. Admin manual enrollment endpoint (enroll/unenroll users in courses/paths)
2. Coupon validation integration into checkout flow
3. Invoice/receipt generation endpoint
4. Webhook retry/recovery improvements

### Frontend
1. Coupon/discount code input on checkout pages
2. Free enrollment confirmation page
3. Payment error/cancel handling pages
4. Admin manual enrollment UI
5. Invoice download for learner payment history

## Risks
- Coupon UI needs Stripe coupon IDs — may need admin to create coupons in Stripe dashboard
- Invoice generation requires PDF library (fpdf2/reportlab already available)

## Success Metrics
- Coupon codes can be applied at checkout
- Free enrollment shows confirmation page
- Failed payments show clear error state
- Admin can manually enroll/unenroll users
- Learners can download purchase receipts
