# Stripe Connect Test Findings

## Date: January 7, 2026

## Current State of Booking Flow

### What Works:
1. ✅ Coach profile page loads correctly
2. ✅ "Book Trial Session" button opens booking dialog
3. ✅ Calendar component displays and allows date selection
4. ✅ Available time slots appear after selecting a date (9:00 AM, 10:00 AM, 2:00 PM, 3:00 PM, 6:00 PM)

### What Needs Implementation:
1. ❌ Time slot buttons are currently non-functional placeholders (lines 393-399 in CoachProfile.tsx)
2. ❌ No state management for selected time slot
3. ❌ No "Confirm Booking" or "Proceed to Payment" button after time selection
4. ❌ No Stripe Checkout integration for payment processing
5. ❌ No booking confirmation flow

### Required Changes for Full Stripe Connect Flow:

1. **Add time slot selection state**:
   - Track selected time slot
   - Show selected state on button

2. **Add booking confirmation step**:
   - Show booking summary (coach, date, time, price)
   - "Proceed to Payment" button

3. **Integrate Stripe Checkout**:
   - Create tRPC procedure to create Stripe Checkout session
   - Include coach's Stripe Connect account ID for commission split
   - Redirect to Stripe Checkout

4. **Handle payment success/failure**:
   - Success page with booking confirmation
   - Failure page with retry option

## Stripe Connect Coach Onboarding

### To Test Coach Onboarding:
1. Navigate to "Become a Coach" page
2. Complete application form
3. After approval, coach should be redirected to Stripe Connect onboarding
4. Complete Stripe Express account setup

### Current Implementation Status:
- Coach application form exists
- Stripe Connect onboarding link generation needs verification
- Commission split (15% platform fee) configured in Stripe dashboard

## Stripe Connect Implementation Status

### Backend Implementation (COMPLETE)

1. **Connect Account Creation** (`server/stripe/connect.ts`)
   - ✅ `createConnectAccount()` - Creates Express accounts for coaches
   - ✅ `getOnboardingLink()` - Generates onboarding links
   - ✅ `checkAccountStatus()` - Checks if account is fully onboarded
   - ✅ `createDashboardLink()` - Creates login link for Stripe Express dashboard
   - ✅ `createCheckoutSession()` - Creates checkout sessions with platform fee
   - ✅ `processRefund()` - Handles refunds

2. **tRPC Procedures** (`server/routers.ts`)
   - ✅ `stripe.startOnboarding` - Initiates coach onboarding
   - ✅ `stripe.accountStatus` - Returns account status
   - ✅ `stripe.dashboardLink` - Gets Stripe dashboard link
   - ✅ `stripe.createCheckout` - Creates checkout session for booking

3. **Webhook Handler** (`server/stripe/webhook.ts`)
   - ✅ Handles `checkout.session.completed` - Records payments
   - ✅ Handles `charge.refunded` - Records refunds
   - ✅ Handles `account.updated` - Updates coach onboarding status

### Frontend Implementation (PARTIAL)

1. **Coach Onboarding** (`pages/BecomeCoach.tsx`)
   - ✅ Application form with 3 steps
   - ❌ No automatic Stripe Connect onboarding after approval
   - ❌ Coach dashboard needs "Connect with Stripe" button

2. **Booking Flow** (`pages/CoachProfile.tsx`)
   - ✅ Date picker works
   - ✅ Time slots display
   - ❌ Time slot selection not connected to checkout
   - ❌ No "Proceed to Payment" button

## Recommendations

1. **Priority 1**: Add time slot selection state and "Proceed to Payment" button in CoachProfile.tsx
2. **Priority 2**: Add "Connect with Stripe" button in CoachDashboard.tsx for approved coaches
3. **Priority 3**: Test full flow: Coach onboarding → Learner booking → Payment → Payout
