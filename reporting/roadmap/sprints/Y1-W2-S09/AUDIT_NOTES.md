# Sprint Y1-W2-S09 — Enrollment & Payment Flow Audit

## Current State Summary

### Backend Payment Infrastructure
- **Stripe webhook handler** (762 lines): Handles checkout.session.completed, payment_intent.succeeded, customer.subscription.*, charge.refunded
- **Idempotency**: Already implemented via claimWebhookEvent/markEventProcessed
- **Stripe Connect**: Coach payouts via connect accounts
- **Course checkout**: createCourseCheckout, createCoachingPlanCheckout in stripe router
- **Subscription management**: Full CRUD in subscriptions router (380 lines)
- **Membership tiers**: Full CRUD in membership router (361 lines)

### Enrollment Flow
- **Free enrollment**: courses.enrollFree endpoint (creates courseEnrollment)
- **Paid enrollment**: Via Stripe webhook → handleCoursePurchase → creates courseEnrollment + pathEnrollment
- **Path enrollment**: paths.enroll endpoint (free paths)
- **Coaching plan**: Via Stripe webhook → handleCoachingPlanPurchase → creates coachingPlanPurchase

### Frontend Pages
- CourseSuccess (333 lines) — post-payment success page
- PathEnrollmentSuccess (287 lines) — post-path enrollment success
- CoachingPlanSuccess — post-coaching plan purchase
- Pricing (837 lines) — pricing page with plans
- LearnerPayments (311 lines) — payment history

### Key Gaps Found
1. **No enrollment receipt/invoice generation** — Learners have no downloadable receipt
2. **No enrollment confirmation page for free courses** — Free enrollment just creates record silently
3. **Missing payment error handling on frontend** — No error state for failed Stripe redirects
4. **No coupon/discount code UI** — validateCoupon exists in backend but no frontend integration
5. **No enrollment status management** — No way for admin to manually enroll/unenroll users
6. **Missing payment retry flow** — No handling for failed payments
7. **No learner payment history with invoices** — LearnerPayments exists but may not show course purchases

## Sprint S09 Scope
1. Add coupon/discount code UI to checkout flow
2. Add enrollment confirmation page for free courses
3. Add payment error handling on frontend
4. Add admin manual enrollment capability
5. Add invoice/receipt generation for purchases
6. Harden webhook error recovery
