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
- [ ] Domain setup: lingueefy.com via GoDaddy
- [ ] Domain setup: lingueefy.ca via GoDaddy

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
- [ ] FAQ page
- [ ] Blog page (template)
- [ ] Careers page (template)
- [x] Terms of Service page
- [x] Privacy Policy page
- [ ] Cookie Policy page
- [ ] Accessibility Statement page
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
- [ ] Connect lingueefy.com via GoDaddy
- [ ] Connect lingueefy.ca via GoDaddy
- [ ] Configure DNS and HTTPS
- [ ] Set canonical domain and redirects


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
