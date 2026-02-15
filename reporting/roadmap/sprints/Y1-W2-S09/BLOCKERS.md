# Sprint Y1-W2-S09 — Blockers

## Active Blockers

### B-1: CouponInput Integration into Checkout Pages
**Status**: Ready for integration
**Description**: The `CouponInput` component is built and ready, but needs to be wired into the actual Stripe checkout flow (Pricing page, PathDetail purchase button). This requires updating the `createCheckout` and `createCourseCheckout` mutations to pass the coupon code to Stripe.
**Action for Steven**: Create promo coupons in Stripe Dashboard → Products → Coupons, then sync coupon codes to the `promo_coupons` table in the database.

### B-2: Invoice/Receipt PDF Generation
**Status**: Deferred to next sprint
**Description**: Generating downloadable PDF receipts for purchases requires a server-side PDF generation endpoint. The `fpdf2` library is available but the endpoint needs to pull purchase data from Stripe and format it as a professional receipt.
**Action for Steven**: None — will be implemented in a future sprint.

### B-3: Stripe Cancel URL Update
**Status**: Recommendation
**Description**: The Stripe checkout `cancel_url` currently points to `/curriculum` or `/lingueefy`. Recommend updating to `/payment/cancelled` for a better UX flow.
**Action for Steven**: None — can be updated in the Stripe router when ready.

## Resolved

No blockers were resolved during this sprint — all items are forward-looking integration tasks.
