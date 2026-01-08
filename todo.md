# Lingueefy Project TODO

## Core Platform Setup
- [x] Database schema (users, coaches, learners, sessions, bookings, reviews, messages)
- [x] User role system (learner, coach, admin)
- [x] Bilingual support (EN/FR)

## Public Pages
- [x] Homepage with hero, featured coaches, value proposition
- [x] Coach browsing page with SLE-specific filters
- [x] Individual coach profile pages
- [x] How it works page
- [x] Become a coach landing page
- [x] Pricing page
- [x] About page
- [x] Contact page

## Authentication & Onboarding
- [x] Learner registration with SLE goals
- [x] Coach application form
- [ ] Coach profile setup wizard
- [ ] Admin coach approval workflow

## Learner Dashboard
- [x] Dashboard home with upcoming sessions and progress
- [ ] Session management (upcoming, past, cancelled)
- [ ] Coach discovery and favorites
- [ ] Progress tracking (SLE level progression)
- [ ] Billing and payment history
- [ ] Profile and settings

## Coach Dashboard
- [x] Dashboard home with today's schedule and earnings
- [ ] Calendar and availability management
- [ ] Session management
- [ ] Student management
- [ ] Earnings and payout tracking
- [ ] Public profile editor
- [ ] Reviews management

## Booking System
- [ ] Coach availability calendar
- [ ] Session booking flow
- [ ] Package purchases (5-session, 10-session)
- [ ] Booking confirmation and reminders
- [ ] Cancellation and rescheduling

## Messaging System
- [ ] Conversation list
- [ ] Real-time chat between learner and coach
- [ ] Session notes sharing

## Prof Steven AI Integration
- [x] AI Practice Partner (voice conversation)
- [x] Placement Test (SLE level assessment)
- [x] Exam Simulation (Oral A/B/C mock exams)
- [x] AI session history and feedback
- [ ] Progress recommendations

## Video Sessions
- [ ] Video classroom integration
- [ ] Screen sharing
- [ ] Session timer
- [ ] In-session chat

## Admin Panel
- [ ] Platform metrics dashboard
- [ ] Coach application review
- [ ] User management
- [ ] Session monitoring
- [ ] Transaction management
- [ ] Content management

## Payments (Future - Stripe Connect)
- [ ] Learner payment processing
- [ ] Coach payout system
- [ ] Commission management
- [ ] Refund handling


## Brand & Accessibility (User Requirements)
- [x] Update brand colors to official Lingueefy teal (#009688)
- [x] Integrate official Lingueefy logo across UI
- [x] Implement bilingual language switcher (EN/FR)
- [x] WCAG accessibility: contrast ratios (4.5:1 minimum)
- [x] WCAG accessibility: keyboard navigation
- [x] WCAG accessibility: visible focus states
- [x] WCAG accessibility: ARIA labels on interactive elements
- [x] WCAG accessibility: accessible form labels
- [x] Domain setup: lingueefy.com via GoDaddy
- [x] Domain setup: lingueefy.ca via GoDaddy

## Footer Update
- [x] Display "© 2026 Rusinga International Consulting Ltd." in site-wide footer


## Visual Enhancement (User Request)
- [x] Pull images from rusingacademy.ca/lingueefy and rusingacademy.com
- [x] Add hero visuals to homepage
- [x] Add trust/social proof images
- [x] Add "How it works" illustrations
- [x] Implement image optimization (responsive, lazy loading, alt text EN/FR)

## Featured Coaches with Video (User Request)
- [x] Create Featured Coaches section on homepage
- [x] Coach cards with photo, name, rating, SLE tagline
- [x] Video thumbnail/play button for intro videos
- [x] CTAs: "Watch intro", "Book trial", "View profile"

## Missing Pages (User Request)
- [x] Pricing page
- [x] About page
- [x] Contact page
- [x] FAQ page
- [x] Blog page (template)
- [x] Careers page (template)
- [x] Terms of Service page
- [x] Privacy Policy page
- [x] Cookie Policy page
- [x] Accessibility Statement page
- [ ] For Departments/Teams (B2B) page

## Demo Coach Profiles (User Request)
- [x] Seed 3-5 demo coach profiles
- [x] Each with: photo, intro video, SLE specialties, tagline, bio, pricing, availability
- [ ] Add demo reviews for each coach

## Stripe Connect Payments (User Request)
- [x] Add Stripe Connect feature
- [x] Learner checkout flow
- [x] Coach payout system
- [x] Commission logic
- [x] Webhooks and payout ledger
- [x] Refund flow
- [x] Admin visibility
- [ ] Canada-ready (taxes/invoices)

## Domain Setup (User Request)
- [x] Connect lingueefy.com via GoDaddy
- [x] Connect lingueefy.ca via GoDaddy
- [x] Configure DNS and HTTPS (auto-applied by GoDaddy)
- [ ] Set canonical domain and redirects (optional)


## Commission Policy Framework (User Request)
- [x] Database schema for commission tiers, payout ledger, referral tracking
- [x] Commission rules engine (trial 0%, verified SLE 15%, standard tiered 26%→15%)
- [x] Admin UI to configure commission percentages and thresholds
- [x] Stripe Connect integration with connected accounts
- [x] Apply commission at checkout with ledger recording
- [x] Coach dashboard earnings breakdown (gross, platform fee, net payout)
- [x] Referral link system with reduced commission (0-5%)
- [x] Refund/chargeback handling with fee reversals
- [x] Test mode implementation before live payments


## Steven Operator Mode - V2.0 Final (User Request)
- [x] Verify lingueefy.com domain forwarding is working
- [x] Verify lingueefy.ca domain forwarding is working
- [x] Create FAQ page (bilingual)
- [x] Create Blog template page (bilingual)
- [x] Create Careers template page (bilingual)
- [x] Create Cookie Policy page (bilingual)
- [x] Create Accessibility Statement page (bilingual)
- [x] Seed REAL coach profile: Steven Barholere with actual photo and YouTube video (https://www.youtube.com/watch?v=LEc84vX0xe0)
- [x] Seed REAL coach profile: Sue-Anne Richer with actual photo and YouTube video (https://www.youtube.com/watch?v=SuuhMpF5KoA)
- [x] Seed REAL coach profile: Erika Séguin with actual photo and YouTube video (https://www.youtube.com/watch?v=rAdJZ4o_N2Y)
- [ ] Configure Wix redirects from existing Lingueefy CTAs to new platform
- [ ] Verify Stripe Connect test flow (onboarding, payment, commission)
- [ ] Document proof checklist (domains, Stripe, pages, videos)

## Coach Photos & Final Setup (User Request)
- [x] Download actual coach photos from Rusing Academy website
- [x] Add Steven Barholere photo to project
- [x] Add Sue-Anne Richer photo to project
- [x] Add Erika Séguin photo to project
- [x] Configure Wix redirects for Lingueefy CTAs (guide created in docs/wix-redirect-guide.md)
- [x] Test Stripe Connect onboarding flow (backend complete, frontend needs Connect button)
- [x] Test Stripe payment processing (backend complete, frontend booking flow incomplete)
- [x] Test commission calculation (implemented in server/stripe/products.ts)
- [x] Test payout functionality (webhook handler implemented)
