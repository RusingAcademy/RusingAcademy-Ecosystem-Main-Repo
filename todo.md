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

## Platform Improvements (Phase 2)

### Booking Payment Flow
- [x] Add selectedTimeSlot state to CoachProfile.tsx
- [x] Style selected time slot button with visual feedback
- [x] Add "Proceed to Payment" button after time selection
- [x] Connect to trpc.stripe.createCheckout mutation
- [x] Handle checkout redirect and success/cancel pages

### Coach Dashboard Stripe Connect
- [x] Add Stripe Connect status section to CoachDashboard
- [x] Add "Connect with Stripe" button for coaches without Stripe account
- [x] Add "View Stripe Dashboard" button for connected coaches
- [x] Show onboarding status (pending, complete)

### Real Coach Data Integration
- [x] Update CoachProfile to fetch coach by slug from database
- [x] Replace mock coach data with tRPC query
- [x] Update coach listing page to use real data
- [x] Ensure Featured Coaches section uses seeded coach data

### Booking Flow Fixes
- [x] Fix dialog scrolling issue - Proceed to Payment button now visible
- [x] Verify booking flow validation (requires learner profile)
- [x] Test date and time slot selection
- [x] Verify booking summary displays correctly

## New Features (User Request)

### Learner Profile Onboarding
- [x] Add learner_profiles table fields for SLE level and goals (already in schema)
- [x] Create LearnerOnboarding modal component
- [x] Add current SLE level selection (A, B, C, or None)
- [x] Add target SLE level selection
- [x] Add learning goals text field
- [x] Trigger onboarding when user tries to book without profile
- [x] Save learner profile to database
- [x] Redirect to checkout after profile creation

### Coach Availability Management
- [x] Add coach_availability table to schema (already exists)
- [x] Create availability management UI in Coach Dashboard
- [x] Weekly schedule with day/time slots
- [x] Save availability to database
- [x] Update booking calendar to show real available slots
- [x] Filter time slots based on coach's availability

### Session Confirmation Emails
- [x] Create email templates for booking confirmation
- [x] Send confirmation email to learner after payment
- [x] Send notification email to coach after booking
- [x] Include session details (date, time, coach/learner info)
- [x] Add calendar invite attachment (ICS file generator created)

## New Features (User Request - Phase 3)

### Demo Reviews for Coaches
- [x] Create seed script for demo reviews
- [x] Add 3-5 reviews for Steven Barholere (5 reviews, avg 4.80)
- [x] Add 3-5 reviews for Sue-Anne Richer (4 reviews, avg 4.75)
- [x] Add 3-5 reviews for Erika Séguin (5 reviews, avg 4.80)
- [x] Display reviews on coach profile pages
- [x] Show average rating calculation
- [x] Fix tabs switching issue (replaced Radix UI with custom implementation)

### Coach Profile Setup Wizard
- [x] Create CoachSetupWizard component
- [x] Step 1: Basic info (bio, tagline, credentials, experience)
- [x] Step 2: Specialties and SLE levels
- [x] Step 3: Pricing (trial, regular session rates)
- [x] Step 4: Availability setup
- [x] Step 5: Intro video upload/link
- [x] Trigger wizard for newly approved coaches
- [x] Add "Edit Profile" button to dashboard

### Session Reminders
- [x] Create reminder scheduling system (server/reminders.ts)
- [x] 24-hour reminder email template
- [x] 1-hour reminder email template
- [x] Send reminders to both learner and coach
- [x] Include session details and join link
- [x] Handle timezone conversions
- [x] Add ICS calendar attachment to reminder emails

## New Features (User Request - Phase 4)

### Real Coach Photos
- [x] Find and download Steven Barholere photo from Rusing Academy
- [x] Find and download Sue-Anne Richer photo from Rusing Academy
- [x] Find and download Erika Séguin photo from Rusing Academy
- [x] Upload photos to project public folder
- [x] Update coach profiles to use real photos
- [x] Update Featured Coaches section with real photos

### For Departments B2B Page
- [x] Create ForDepartments.tsx page component
- [x] Add hero section with B2B value proposition
- [x] Add bulk pricing packages (team of 5, 10, 25, custom)
- [x] Add benefits section for government departments
- [x] Add testimonials from department clients
- [x] Add contact form for enterprise inquiries
- [x] Add route to App.tsx
- [x] Add navigation link in header

### Video Session Integration
- [x] Add meeting_url field to bookings table (already in schema)
- [x] Create video meeting service (server/video.ts using Jitsi Meet)
- [x] Auto-generate meeting link on booking confirmation
- [x] Include meeting link in confirmation emails
- [x] Add "Join Session" button in learner dashboard
- [x] Include meeting instructions in emails (EN/FR)

## New Features (User Request - Phase 5)

### Prof Steven AI Chat Interface
- [x] Create ProfStevenAI page component (already exists)
- [x] Build chat UI with message bubbles (already implemented)
- [x] Integrate with AI API for French conversation (ai router exists)
- [x] Add voice practice mode option (UI ready, needs voice API)
- [x] Add SLE placement test mode (startPlacement mutation exists)
- [x] Add oral exam simulation mode (startSimulation mutation exists)
- [x] Save chat history for logged-in users (ai_sessions table exists)
- [x] Add route to App.tsx (already configured)

### Admin Dashboard
- [x] Create AdminDashboard page component
- [x] Add coach application approval workflow
- [x] Display pending coach applications
- [x] Add approve/reject functionality
- [x] Create platform analytics section
- [x] Show user registrations, sessions booked, revenue
- [x] Add department inquiries management
- [x] Display B2B contact form submissions
- [x] Add admin role check/protection (owner check)

### Session Rescheduling
- [x] Add reschedule button to session cards
- [x] Create reschedule modal with calendar
- [x] Update session date/time in database
- [x] Send reschedule notification emails (TODO in backend)
- [x] Update calendar invites (ICS) (TODO in backend)
- [x] Add reschedule policy (24h minimum notice)
- [ ] Track reschedule history (future enhancement)


## New Features (User Request - Phase 6)

### Connect Admin Dashboard to Real Data
- [x] Create department_inquiries table in schema
- [x] Add admin.getCoachApplications procedure with real DB query
- [x] Add admin.getInquiries procedure with real DB query
- [x] Add admin.getAnalytics procedure with real DB query
- [x] Update AdminDashboard to use real data instead of mock data
- [x] Add admin.createInquiry procedure for B2B contact form

### Email Notifications for Rescheduling
- [x] Create reschedule email template (learner and coach versions)
- [x] Send email to learner when session is rescheduled
- [x] Send email to coach when session is rescheduled
- [x] Include old and new times in email (with visual strikethrough)
- [x] Attach updated ICS calendar file attachment

### Coach Earnings Payout History
- [x] Create CoachEarningsHistory page component (CoachEarningsPage.tsx)
- [x] Add transactions table to track earnings (payout_ledger table)
- [x] Display completed sessions with earnings
- [x] Show commission breakdown (platform fee vs coach payout)
- [x] Display Stripe payout history
- [x] Add route to App.tsx
- [x] Link from Coach Dashboard
- [x] Add CSV export functionality
- [x] Add date range filters


## New Features (User Request - Phase 7)

### Session Cancellation Flow
- [x] Create CancellationModal component
- [x] Add cancel button to session cards in LearnerDashboard
- [x] Implement learner.cancelSession mutation in routers
- [x] Process Stripe refund for cancelled sessions
- [x] Send cancellation notification emails to learner and coach
- [x] Add cancellation policy (24h minimum notice for full refund)
- [x] Update session status to 'cancelled' in database

### Coach Onboarding Checklist
- [x] Create CoachOnboardingChecklist component
- [x] Add progress indicator showing completion percentage
- [x] Check bio, headline, photo, video, pricing, specializations
- [x] Check availability and Stripe connection
- [x] Show "Profile Live" message when complete
- [x] Add action buttons for incomplete items
- [x] Bilingual support (EN/FR)
- [x] Check bio completion status
- [x] Check photo upload status
- [x] Check availability setup status
- [x] Check Stripe Connect status
- [x] Show checklist in Coach Dashboard sidebar
- [ ] Block profile from going live until checklist complete

### Learner Progress Reports
- [x] Create progress report email template (sendLearnerProgressReport in email.ts)
- [x] Track practice time per learner (totalPracticeMinutes in getProgressReport)
- [x] Track sessions completed count (coachSessionsCompleted, aiSessionsCompleted)
- [x] Track SLE level improvements (currentLevels, targetLevels comparison)
- [x] Generate weekly summary data (generateProgressReportData function)
- [x] Send automated weekly email reports (sendAllWeeklyProgressReports in progress-reports.ts)
- [x] Add ProgressReportCard component to Learner Dashboard
- [ ] Add progress report preferences in learner settings


## New Features (User Request - Phase 8)

### Progress Report Email Preferences
- [x] Add weeklyReportEnabled field to learner_profiles schema
- [x] Add weeklyReportDay field to learner_profiles schema (0=Sunday, 1=Monday)
- [x] Create ReportPreferencesCard component in Learner Dashboard
- [x] Add toggle for enabling/disabling weekly reports
- [x] Add dropdown for selecting delivery day
- [x] Update sendAllWeeklyProgressReports to respect preferences
- [x] Add updateReportPreferences and getReportPreferences tRPC endpoints

### Automated Weekly Report Cron Job
- [x] Create cron endpoint for weekly reports (/api/cron/weekly-reports)
- [x] Create cron module (server/cron/weekly-reports.ts)
- [x] Add sendSundayProgressReports and sendMondayProgressReports functions
- [x] Filter learners by their preferred delivery day
- [x] Log report delivery status
- [x] Add force trigger endpoint for testing (/api/cron/weekly-reports/force)
- [x] Add CRON_SECRET authorization for security

### Block Incomplete Coach Profiles
- [x] Add profileComplete field to coach_profiles schema
- [x] Create recalculateProfileComplete function in db.ts
- [x] Create getProfileCompletionStatus function in db.ts
- [x] Filter incomplete coaches from public search results (getApprovedCoaches)
- [x] Show "Profile Hidden" warning in CoachOnboardingChecklist
- [x] Auto-recalculate profileComplete on updateCoachProfile
- [x] Bilingual warning message (EN/FR)


## Phase 9 - Cron Setup and Coach Profile Updates

### Cron Service Setup
- [x] Add CRON_SECRET to environment variables
- [x] Set up external cron service for Sunday 9am ET (14:00 UTC)
- [x] Set up external cron service for Monday 9am ET (14:00 UTC)

### Coach Profile Updates
- [x] Gather coach data from Rusing Academy website
- [x] Update Steven's profile with complete data
- [x] Update Sue-Anne's profile with complete data
- [x] Update Erika's profile with complete data
- [x] Add Soukaina's profile (new)
- [x] Add Preciosa's profile (new)
- [x] Add Victor's profile (new)
- [x] Add Francine's profile (new)
- [x] Set profileComplete=true for all 7 coaches


## Phase 10 - Pricing Fix, Coach Photos, and Calendar Integration

### Fix Coach Pricing
- [x] Update coach hourly rates from dollars to cents (multiply by 100)
- [x] Update coach trial rates from dollars to cents
- [ ] Verify pricing displays correctly on coach cards

### Coach Profile Photos
- [x] Download Steven's photo from Rusing Academy
- [x] Download Sue-Anne's photo from Rusing Academy
- [x] Download Erika's photo from Rusing Academy
- [x] Download Preciosa's photo from Rusing Academy
- [x] Download Victor's photo from Rusing Academy
- [x] Download Soukaina's photo from Rusing Academy
- [x] Download Francine's photo from Rusing Academy
- [x] Upload photos to S3 storage (all 7 coaches)
- [x] Update coach profiles with photo URLs in database

### Calendar Integration Choice
- [x] Add calendarType field to coach_profiles schema (internal/calendly)
- [x] Add calendlyUrl field to coach_profiles schema
- [x] Create CalendarSettingsCard component
- [x] Add calendar settings UI in Coach Dashboard sidebar
- [x] Add toggle between internal calendar and Calendly
- [x] Add updateCalendarSettings and getCalendarSettings tRPC endpoints
- [ ] Update booking flow to use selected calendar type
- [ ] Add Calendly embed/redirect for coaches using Calendly


## Phase 11 - Calendly, Pricing, Tax, and Reviews

### Coach Pricing Updates
- [x] Update Steven's price to $67/hour (6700 cents)
- [x] Update Soukaina's price to $59/hour (5900 cents)
- [x] Update Sue-Anne's price to $57/hour (5700 cents)
- [x] Update Preciosa's price to $58/hour (5800 cents)
- [x] Update Erika's price to $60/hour (6000 cents)
- [x] Update Victor's price to $60/hour (6000 cents)
- [x] Update Francine's price to $65/hour (6500 cents)
- [x] Add price validation ($1-$100 CAD range) in CoachSetupWizard
- [x] Update trial rates proportionally

### Ontario HST Tax (13%)
- [x] Add tax calculation to checkout flow (server/stripe/connect.ts)
- [x] Display subtotal, tax (13% HST), and total at checkout
- [x] Update Stripe checkout to include tax as separate line item
- [ ] Show tax breakdown in confirmation emails

### Calendly Integration
- [x] Add Calendly redirect in booking flow (CoachProfile.tsx)
- [x] Detect coach calendar type and route accordingly
- [x] Show "Book via Calendly" button for coaches using Calendly
- [ ] Handle booking confirmation from Calendly (requires webhook)

### Demo Reviews for New Coaches
- [x] Add 3 reviews for Soukaina Mhammedi Alaoui (avg 4.67)
- [x] Add 3 reviews for Preciosa Baganha (avg 4.67)
- [x] Add 4 reviews for Victor Amisi (avg 4.75)
- [x] Add 3 reviews for Francine Nkurunziza (avg 4.67)

### Wix Photos
- [x] Received HD photos directly from user
- [x] Uploaded all 7 coach photos to S3 storage
- [x] Updated coach profiles with new photo URLs


## Phase 12 - Tax Emails, Calendly Webhook, Trial Rates

### Tax Breakdown in Emails
- [ ] Update booking confirmation email template
- [ ] Add subtotal, HST 13%, and total breakdown
- [ ] Update learner confirmation email
- [ ] Update coach notification email

### Calendly Webhook Integration
- [ ] Create Calendly webhook endpoint
- [ ] Handle invitee.created event
- [ ] Create booking record from Calendly data
- [ ] Send confirmation emails after Calendly booking
- [ ] Add webhook signature verification

### Proportional Trial Rates
- [ ] Calculate trial rates (30 min = ~50% of hourly rate)
- [ ] Update Steven's trial rate
- [ ] Update Soukaina's trial rate
- [ ] Update Sue-Anne's trial rate
- [ ] Update Preciosa's trial rate
- [ ] Update Erika's trial rate
- [ ] Update Victor's trial rate
- [ ] Update Francine's trial rate


## Phase 12: RusingÂcademy Branding & Legal Updates (User Request)

### Logo Assets Upload
- [x] Upload RusingÂcademy logos to S3 for email usage
- [x] Add horizontal logo for email headers
- [x] Add icon logo for favicons and social

### Email Template Branding
- [x] Update all email templates with RusingÂcademy logo header
- [x] Add tax breakdown (Subtotal + 13% HST + Total) to confirmation emails
- [x] Add "Rusinga International Consulting Ltd." legal footer to emails
- [x] Apply brand colors (teal #0d9488, orange #f97316)

### Legal Pages Update
- [x] Update Terms of Service with "Rusinga International Consulting Ltd., commercially known as RusingÂcademy"
- [x] Update Privacy Policy with parent company legal name
- [x] Update footer copyright to include parent company
- [x] Update Cookie Policy with parent company legal name
- [x] Replace all "Rusing Academy" with "RusingÂcademy" across platform (About, Footer, LanguageContext)

### Trial Session Pricing
- [x] Add trialRate field to coach profiles (30-min proportional pricing)
- [x] Calculate trial rates as 50% of hourly rate for all coaches
- [x] Verified all 7 coaches have trial rates set
- [ ] Update booking flow to show trial pricing

### Calendly Integration
- [ ] Complete Calendly webhook endpoint for booking sync
- [ ] Add calendlyEventId field to sessions table
- [ ] Test webhook with sample Calendly events


## Phase 14: Header Logo Update (User Request)

### Logo Update
- [x] Upload new Lingueefy logo (speech bubble with text) to S3
- [x] Update Header component to use full logo image instead of favicon + text
- [x] Make logo larger and more visible (like Italki) - h-14 to h-[72px]
- [x] Remove separate text "Lingueefy" from header (logo includes text)
- [x] Ensure high resolution and aesthetic appearance
- [x] Update Footer logo to match


## Phase 15: Glassmorphism Design Overhaul (User Request)

### Logo Redesign
- [x] Generate new Lingueefy logo with glassmorphism effect
- [x] Preserve speech bubble, "Lingueefy" text, and maple leaf above "ee"
- [x] Apply frosted glass/translucent effect with 3D depth
- [x] Upload new logo to S3

### Design System Updates
- [x] Create glassmorphism CSS utilities (backdrop-blur, transparency, borders)
- [x] Define glass effect variables for consistent application
- [x] Create reusable glass components
- [x] Add teal and orange color palette from RusingÂcademy ecosystem

### UI Component Updates
- [x] Update CTA buttons with glass effect (glass-btn, glass-btn-outline, glass-btn-orange)
- [x] Apply glassmorphism to cards and boxes (glass-card, glass-float)
- [x] Update navigation with glass styling (glass-header)
- [x] Modernize hero sections with glass elements (mesh-gradient, decorative orbs)
- [x] Add subtle animations and hover effects

### Platform-wide Application
- [x] Update Header component with glassmorphism navigation
- [x] Update Home page with full glassmorphism design
- [x] Update coach cards with glass effect and video play buttons
- [x] Update feature cards with glass styling
- [x] Update footer with glass-footer effect


## Phase 16: Glassmorphism Extension & Animations (User Request)

### Micro-Animations
- [ ] Add scroll-triggered fade-in animations
- [ ] Add parallax effects on decorative orbs
- [ ] Add smooth hover transitions on all interactive elements
- [ ] Add staggered animations for card grids
- [ ] Create reusable animation CSS utilities

### SVG Vector Logo
- [ ] Create SVG version of Lingueefy logo (speech bubble + text + maple leaf)
- [ ] Ensure crisp rendering at all resolutions
- [ ] Update Header and Footer to use SVG logo

### Glassmorphism Extension
- [ ] Apply glassmorphism to Coaches page (hero, filters, coach cards)
- [ ] Apply glassmorphism to Pricing page (pricing cards, features)
- [ ] Apply glassmorphism to About page (team section, values)
- [ ] Apply glassmorphism to For Departments page (B2B cards, testimonials)
- [ ] Ensure consistent visual language across all pages


## Phase 16: Glassmorphism Extension & Animations - COMPLETED

### Micro-Animations
- [x] Add scroll-triggered animations (fade-in, slide-up)
- [x] Add parallax effects on decorative orbs (animate-float-slow, animate-float-medium, animate-float-fast)
- [x] Add hover-lift effects on cards
- [x] Add smooth transitions throughout
- [x] Created useScrollAnimation hook for intersection observer

### SVG Logo
- [x] Create vector SVG version of Lingueefy logo (LingueefyLogo.tsx component)
- [x] Implement in Header component with fallback to image
- [x] Ensure crisp rendering at all resolutions

### Page Updates with Glassmorphism
- [x] Apply glassmorphism to Coaches page (glass-card, glass-badge, gradient backgrounds)
- [x] Apply glassmorphism to Pricing page (glass-card, gradient-text, decorative orbs)
- [x] Apply glassmorphism to About page (glass-card, scroll animations, leadership section)
- [x] Apply glassmorphism to For Departments page (glass-card, FAQ accordion, testimonials)

### CSS Design System Additions
- [x] glass-badge class for badges
- [x] glass-btn-orange for orange accent buttons
- [x] Animation keyframes (fade-in-up, fade-in-down, scale-in, slide-in-left, slide-in-right)
- [x] Stagger animation delays (stagger-1 through stagger-6)
- [x] Float animations for decorative orbs


## Phase 17: Logo Fix - Speech Bubble with Glassmorphism

### Logo Correction
- [x] Redesign SVG logo with proper speech bubble outline (like original)
- [x] Include "Lingueefy" text inside the bubble
- [x] Add maple leaf symbol above the "ee"
- [x] Apply glassmorphism effect (frosted glass) to the bubble
- [x] Make logo visible in its entirety in the header
- [x] Ensure high resolution and crisp rendering

### Premium Logo Enhancements
- [x] Refined proportions with elegant curves
- [x] Premium typography with optimized letter spacing
- [x] Detailed Canadian maple leaf design
- [x] Sophisticated glassmorphism (gradient, reflections, shadows)
- [x] Micro-details (gradient border, shine effect)
- [x] Modern, captivating, professional appearance


## Phase 18: Premium UX Enhancements - COMPLETED

### Dark Mode
- [x] Create ThemeContext for dark/light mode state management
- [x] Add CSS variables for dark mode colors (deep blue-gray, teal accents)
- [x] Update glassmorphism styles for dark theme
- [x] Add toggle button in Header (sun/moon icons with animation)
- [x] Persist theme preference in localStorage
- [x] Smooth transition between themes

### Skeleton Loaders
- [x] Create SkeletonCard component with shimmer effect
- [x] Create SkeletonText component for text placeholders
- [x] Create SkeletonAvatar component for profile images
- [x] Add shimmer animation with glassmorphism style
- [x] Implement SkeletonCoachCard, SkeletonPricingCard, SkeletonTestimonialCard

### Enhanced Scroll Animations
- [x] Add parallax effect to decorative orbs (useFloatingOrbs hook)
- [x] Create reveal animations for sections (fade-in, slide-up, scale)
- [x] Add staggered animations for card grids (stagger-1 to stagger-6)
- [x] Implement smooth scroll-triggered transitions
- [x] Add intersection observer for performance (useScrollAnimation hook)


## Phase 19: How It Works Page Updates (User Request) - COMPLETED

### Footer Fix
- [x] Fix footer visibility on desktop (not hidden by overflow/fixed height)
- [x] Fix footer visibility on mobile
- [x] Ensure footer displays entirely on all screen sizes

### Logo Update
- [x] Upload new official logo (glassmorphism bubble with maple leaf)
- [x] Replace current logo in Header component
- [x] Ensure logo consistency (size, alignment, sharpness) across header/footer

### New Section: Find Your Perfect Language Tutor
- [x] Create section after Hero with title "Find Your Perfect Language Tutor"
- [x] Display exactly 6 coaches: Steven, Sue-Anne, EriKa, Soukaina, Victor, Preciosa
- [x] Coach card design (like Italki):
  - [x] Video thumbnail with play button
  - [x] Coach name + short description
  - [x] Price displayed below video (e.g., "From $XX/hour")
  - [x] CTA button: "Try Now"
- [x] Add global CTA: "Discover All Our Coaches" (link to /coaches page)
- [ ] Responsive design for desktop and mobile


## Phase 20: Featured Coaches Enhancements (User Request)

### Real YouTube Intro Videos
- [ ] Integrate YouTube video player in coach cards
- [ ] Add video modal/lightbox for playing intro videos
- [ ] Use actual YouTube video URLs from coach profiles
- [ ] Add play button overlay on video thumbnails
- [ ] Handle video loading states

### Mobile Responsive Design
- [ ] Optimize coach card grid for mobile (1 column on small screens)
- [ ] Adjust card sizing and spacing for touch devices
- [ ] Ensure video thumbnails scale properly
- [ ] Test on various screen sizes (320px, 375px, 414px, 768px)

### Language Filters
- [ ] Add filter buttons (All, English, French) above coach cards
- [ ] Filter coaches based on languages they teach
- [ ] Highlight active filter button
- [ ] Smooth transition when filtering
- [ ] Show "No coaches found" message if filter returns empty


## Phase 20: Featured Coaches Video & Filters - COMPLETED

### Real YouTube Videos
- [x] Add YouTube video links for all 6 coaches (Steven, Sue-Anne, Erika, Soukaina, Victor, Preciosa)
- [x] Create video modal component for YouTube embed
- [x] Implement click-to-play functionality on thumbnails
- [x] Use YouTube thumbnail as preview image

### Mobile Responsive Design
- [x] Optimize coach cards for smartphone screens
- [x] Adjust grid layout for mobile (1 column on sm, 2 on md, 3 on lg)
- [x] Ensure video thumbnails scale properly
- [x] Test touch interactions

### Language Filters
- [x] Add filter buttons (All, French, English)
- [x] Implement filtering logic based on coach languages
- [x] Style active filter state (teal background)
- [x] Animate filter transitions


## Phase 21: Coach Language Corrections (User Request)

### Language Assignments
- [x] Steven: French AND English (correct)
- [x] Sue-Anne: French AND English (correct)
- [x] Erika: English ONLY (fixed - now shows English only)
- [x] Preciosa: English ONLY (correct)
- [x] Victor: French ONLY (correct)
- [x] Soukaina: French ONLY (fixed - now shows French only)

### Filter Behavior
- [x] French filter should show: Steven, Sue-Anne, Victor, Soukaina (4 coaches)
- [x] English filter should show: Steven, Sue-Anne, Erika, Preciosa (4 coaches)
- [x] All filter should show all 6 coaches


## Phase 22: Coach Photos, Video Hover, and Dynamic Session Counts (User Request)

### Real Coach Photos
- [x] Upload Steven.jpg to S3 (v3)
- [x] Upload Preciosa.JPG to S3
- [x] Upload Victor.jpg to S3
- [x] Upload Soukaina.jpeg to S3
- [x] Update FeaturedCoaches component with new S3 URLs
- [x] Upload Sue-Anne.jpg to S3

### Video Auto-Play on Hover
- [x] Implement YouTube video preview on hover (like Italki)
- [x] Show video thumbnail by default
- [x] Auto-play muted video preview when hovering (800ms delay)
- [x] Stop video when mouse leaves

### Dynamic Session Counts (Deferred - requires database integration)
- [ ] Create tRPC endpoint to fetch coach session counts
- [ ] Query bookings table for completed sessions per coach
- Note: Currently using static values; will connect to real data when coaches have actual bookings
- [ ] Update FeaturedCoaches to use real data instead of static counts
- [ ] Add fallback for coaches with no sessions


## Phase 23: Star Rating and Review System (User Request)

### Database & Backend
- [x] Review existing reviews table schema (already exists with rating, comment, sleAchievement, coachResponse)
- [x] Add database queries for fetching coach reviews (getCoachReviews exists)
- [x] Add query for calculating average rating per coach (getCoachStats exists)
- [x] Create tRPC endpoint to fetch reviews for a coach (coach.reviews exists)
- [x] Create tRPC endpoint to submit a new review (coach.submitReview)
- [x] Add validation for review submission (only after completed session)
- [x] Create tRPC endpoint to check if user can review (coach.canReview)
- [x] Create tRPC endpoint to update review (coach.updateReview)
- [x] Add totalReviews field to coach_profiles schema

### Frontend - Coach Cards
- [x] Add star rating display component (StarRating.tsx)
- [x] Update FeaturedCoaches cards to show average rating (already showing static ratings)
- [x] Update coach profile page to show rating and reviews (already implemented)
- [x] Display review count alongside rating (added to Coaches.tsx)

### Frontend - Review Submission
- [x] Create review submission modal/form (ReviewModal.tsx)
- [x] Add star rating input component (StarRatingInput)
- [x] Add text review input (comment textarea)
- [x] Show success/error feedback (toast notifications)
- [x] Add SLE achievement dropdown
- [x] Add "Write Review" button on coach profile page

### Testing
- [x] Test review display on coach cards
- [x] Test review submission flow
- [x] Verify average rating calculation
- [x] All 10 review system tests passing


## Phase 24: Footer Updates
- [x] Change email from info@lingueefy.com to admin@rusingacademy.ca


## Phase 25: Page Restructuring - How It Works to Home + Curriculum Page

### Integration to Home Page
- [x] Analyze Home.tsx current structure
- [x] Analyze HowItWorks.tsx current content
- [x] Add FeaturedCoaches section to Home page RIGHT AFTER Hero section
- [x] Ensure no content duplication (FeaturedCoaches now on Home, separate from HowItWorks)

### New Curriculum Page
- [x] Research RusingAcademy 6 courses from www.rusingacademy.com
  - Path I: Foundations (A1 → A1+)
  - Path II: Elementary (A2)
  - Path III: Intermediate (B1) → BBB
  - Path IV: Upper Intermediate (B2) → CBC
  - Path V: Advanced (C1) → CCC
  - Path VI: Mastery (C1+/C2)
- [x] Transform HowItWorks.tsx into Curriculum.tsx (created new Curriculum.tsx)
- [x] Create course cards for all 6 RusingAcademy courses
- [x] Add links to RusingAcademy course pages
- [x] Copy course images to public/curriculum folder

### Navigation Updates
- [x] Change "How It Works" nav link to "Our Curriculum" (Header.tsx)
- [x] Update route from /how-it-works to /curriculum (App.tsx)
- [x] Update Footer link to /curriculum
- [x] Update all internal links
- [x] Upload curriculum images to S3 for reliable serving
- [x] Images now displaying correctly on Curriculum page


## Phase 26: Name Correction
- [x] Change "Steven Rusinga" to "Steven Barholere" in FeaturedCoaches.tsx


## Phase 27: Erika Photo Upload
- [x] Copy Erika's photo to project directory
- [x] Upload Erika's photo to S3 (https://d2xsxph8kpxj0f.cloudfront.net/310519663049070748/gvnmYNphKZgt9jM9K8Vi9K/coaches/erika-seguin-v2.jpg)
- [x] Update FeaturedCoaches component with new S3 URL


## Phase 28: Coach Availability Indicators
- [x] Design availability data structure (availableToday, nextAvailable, availableDays)
- [x] Add availability badges to FeaturedCoaches component
- [x] Add availability indicators to Coaches listing page
- [x] Show "Available Today" green badge for immediate availability
- [x] Show "Next Available: [Day]" for future availability


## Phase 28b: Bug Fix - Try Now Button Link
- [x] Fix "Try Now" button on FeaturedCoaches to link to /coach/{slug} instead of /coaches/{slug}


## Phase 29: Navigation Text Update
- [x] Change "Our Curriculum" to "Discover Our Courses" in header navigation


## Phase 30: Breadcrumb Navigation
- [x] Add breadcrumb component to Curriculum page
- [x] Show "Home > Discover Our Courses" navigation path
- [x] Support bilingual labels (French/English)


## Phase 31: Breadcrumb Navigation for Coach Profiles
- [x] Add breadcrumb to CoachProfile.tsx page
- [x] Show "Home > Find a Coach > [Coach Name]" navigation path
- [x] Support bilingual labels (French/English)
- [x] Make "Find a Coach" link clickable to /coaches


## Phase 32: Reusable Breadcrumb Component with SEO
### Component Creation
- [x] Create Breadcrumb.tsx component with props for items
- [x] Add JSON-LD structured data for SEO
- [x] Support bilingual labels

### Apply to Pages
- [x] Add breadcrumb to Pricing page
- [x] Add breadcrumb to About page
- [x] Add breadcrumb to Contact page
- [x] Add breadcrumb to For Departments page

### Refactor Existing
- [x] Refactor Curriculum.tsx to use Breadcrumb component
- [x] Refactor CoachProfile.tsx to use Breadcrumb component

## Hero Image with Real Coach Photos (User Request)
- [ ] Create Hero image with real coach photos and SLE conversation bubbles (BBB, CBC, CCC, Bilingualism, Français, Anglais, Bonjour, Hello)
- [ ] Upload Hero image to S3 and integrate into homepage


## Homepage Updates (User Request Jan 9)

- [ ] Update Hero image with hero-final-v19.png
- [ ] Update Hero title: "Your Path to Bilingual Excellence"
- [ ] Update Hero subtitle: "Master French or English 3–4× faster with a proven, coaching- and path-based methodology."
- [ ] Update Hero description: "Connect with specialized coaches who understand the SLE exam. Practice 24/7 with Prof Steven AI. Achieve your BBB, CBC, or CCC goals."
- [ ] Create Prof Steven AI chatbot floating widget (bottom right with pulse)
- [ ] Create Prof Steven AI chatbot popup modal
- [ ] Add chatbot option in header with animation
- [ ] Ensure responsive design for mobile
- [ ] Respect prefers-reduced-motion
- [ ] Test chatbot functionality on desktop and mobile


## Homepage Updates (User Request - Jan 9, 2026)
- [x] Update Hero section with new image (hero-final-v19.png with real coach photos)
- [x] Update Hero title to "Your Path to Bilingual Excellence"
- [x] Update Hero subtitle to "Master French or English 3–4× faster with a proven, coaching- and path-based methodology."
- [x] Update Hero description to "Connect with specialized coaches who understand the SLE exam. Practice 24/7 with Prof Steven AI. Achieve your BBB, CBC, or CCC goals."
- [x] Transform Prof Steven AI into chatbot widget (floating + popup modal)
- [x] Add floating widget in bottom right corner with pulse animation
- [x] Add popup modal with welcome message and action buttons
- [x] Ensure responsive design on desktop and mobile
- [x] Test chatbot popup functionality (open/close, click outside to close)


## Hero Section Corrections (User Request - Jan 9, 2026)
- [x] Update Hero title to "Find Your Path To Bilingual Excellence" (H1 très gras)
- [x] Keep subtitle: "Master French or English 3–4× faster with a proven, coaching- and path-based methodology."
- [x] Keep description: "Connect with specialized coaches who understand the SLE exam. Practice 24/7 with Prof Steven AI. Achieve your BBB, CBC, or CCC goals."
- [x] Change Hero layout to 2 columns (text 6/12 left, image 6/12 right)
- [x] Remove text/image overlay - no superposition
- [x] Keep CTA buttons unchanged (text + style + position below text)
- [x] Ensure responsive design on desktop and mobile


## Hero Typewriter Effect & Chatbot Updates (User Request - Jan 9, 2026)
- [ ] Add typewriter animation effect to Hero title "Find Your Path To Bilingual Excellence"
- [ ] Add typing sound effect during typewriter animation
- [ ] Respect prefers-reduced-motion (disable animation/sound if user prefers)
- [ ] Update Prof Steven AI chatbot with 3 main options: Voice Practice Sessions, SLE Placement Tests, Oral Exam Simulations
- [ ] Optimize Hero image for mobile (recrop/simplify for small screens)
- [ ] Add fade-in/slide-up animations to Hero elements
- [ ] Test French translations with new layout
- [ ] Keep existing Hero CTA buttons unchanged


## Hero Typewriter Effect & Chatbot Updates (User Request - Jan 2026)
- [x] Add typewriter effect on Hero title H1 with typing sound
- [x] Respect prefers-reduced-motion (disable animation/sound if user prefers)
- [x] Update Prof Steven AI chatbot with 3 main options:
  - Voice Practice Sessions
  - SLE Placement Tests
  - Oral Exam Simulations
- [x] Optimize Hero image for mobile (version recadrée/simplifié)
- [x] Add fade-in/slide-up animations on Hero elements
- [x] Test French translations with new layout


## Typewriter & Footer Fixes (User Request - Jan 2026)
- [x] Make typewriter animation repeat every 6 seconds (natural rhythm)
- [x] Add audible cinematic typing sound (3-layer sound)
- [x] Fix footer visibility
- [x] Fix footer text readability


## French Typewriter Animation (User Request - Jan 2026)
- [x] Apply typewriter animation to French version of Hero title
- [x] Ensure cinematic sound works with French text


## Typewriter Cursor Color Change (User Request - Jan 2026)
- [x] Change cursor color to teal when typing highlighted words (Excellence/bilingue)
- [x] Slow down typing speed to 120ms per character for better readability

- [x] Improve typewriter sound to be more authentic dactylographic machine sound (5-layer sound: clack, click, thunk, paper impact, bell resonance)


## Beautification - italki/Preply Style (User Request - Jan 2026)
- [x] Remove "Prof Steven AI" button from header (keep chatbot widget)
- [ ] Replace robot/AI icons with Steven's photo everywhere Prof Steven AI appears
- [x] Fix footer visibility - all texts must be fully visible on desktop and mobile
- [ ] Generate premium realistic images for each major section
- [ ] Improve UI/UX with better visual hierarchy and spacing
- [ ] Ensure responsive design on all devices
- [ ] Optimize images for web (AVIF/WebP, lazy-load)


## Beautification Phase 2 (User Request - Jan 2026)
- [x] Replace robot icons with Steven's photo in chatbot widget and popup (already using steven-barholere.jpg)
- [x] Generate premium realistic images for "How It Works" section (italki/Preply style)
- [x] Generate premium realistic images for "Why Choose Lingueefy" section
- [x] Add client testimonials section with photos and quotes


## Homepage Enhancements Phase 3 (User Request - Jan 2026)
- [x] Add video presentation section with Steven introducing Lingueefy
- [x] Create animated testimonials carousel with auto-scroll and more testimonials (5 testimonials)
- [x] Add animated statistics counter section (500+ learners, 95% success rate, 7 certified coaches, 1200+ lessons)


## Homepage Enhancements Phase 4 (User Request - Jan 2026)
- [ ] Create video player placeholder ready for YouTube/Vimeo integration
- [ ] Add contact form in footer for lead capture
- [ ] Create interactive FAQ accordion section for SLE questions


## Homepage Enhancements Phase 4 (User Request - Jan 2026)
- [x] Create video player placeholder ready for YouTube/Vimeo integration
- [x] Add contact form in footer for lead capture
- [x] Create interactive FAQ accordion section for SLE questions (6 FAQs bilingual)


## Visual Edit Requests (User - Jan 2026)
- [x] Make Steven's photo larger in video section and add photo carousel
- [x] Add images to How It Works steps (already has images: how-it-works-1.jpg to 4.jpg)
- [x] Link "Find a Coach" button to /coaches page (already linked)
- [x] Link "Become a Coach" button to /become-coach page (already linked)
- [x] Update coach prices: Steven $67/h, Sue-Anne $57/h, Soukaina $58/h


## MP4 Video Integration (User Request - Jan 2026)
- [ ] Copy MP4 videos to project public folder
- [ ] Update FeaturedCoaches to use HTML5 video player instead of YouTube
- [ ] Associate videos with correct coaches: Steven, Sue-Anne, Soukaina, Victor, Erika, Preciosa


## MP4 Video Integration (User Request - Jan 2026)
- [x] Copy MP4 videos to project public folder (4 smaller files)
- [x] Upload large videos (Steven 500MB, Soukaina 150MB) to S3 CDN
- [x] Update FeaturedCoaches to use HTML5 video player instead of YouTube
- [x] Associate videos with correct coaches: Steven, Sue-Anne, Soukaina, Victor, Erika, Preciosa
- [x] Implement muted video preview on hover (800ms delay)
- [x] Implement full video modal with sound on click
- [x] Add premium video player controls (play/pause, mute, progress bar, fullscreen)


## Video Optimization & Accessibility (User Request - Jan 2026)
- [x] Compress large MP4 videos (Steven 501MB→26MB 95%, Soukaina 151MB→5.5MB 96%)
- [x] Generate custom thumbnails from video frames for all 6 coaches
- [x] Transcribe video audio content (manual transcription)
- [x] Create EN subtitles (VTT format) for all videos
- [x] Create FR subtitles (VTT format) for all videos
- [x] Integrate subtitle tracks into HTML5 video player
- [x] Update FeaturedCoaches to use custom thumbnails
- [x] Update Home.tsx video section with MP4 player


## Prof Steven AI Widget Update (User Request - Jan 2026)
- [x] Replace robot icon with Steven Barholere's photo in floating widget (already implemented)
- [x] Update chatbot header to show Steven's photo instead of robot (already implemented)


## Coach Photos on Find a Coach Page (User Request - Jan 2026)
- [ ] Add real photo for Sue-Anne on Coaches page
- [ ] Add real photo for Victor Amisi on Coaches page
- [ ] Add real photo for Preciosa on Coaches page
- [ ] Add real photo for Soukaina on Coaches page
- [ ] Add real photo for Francine on Coaches page (new coach)


## Coaches Page Premium Redesign (User Request - Jan 2026)
- [x] Redesign coach cards with larger photos and premium styling
- [x] Add hover effects and animations for coach cards
- [x] Improve filter UI with visual badges and icons
- [x] Add availability indicators and certification badges
- [x] Create responsive grid layout with modern design
- [x] Update all coach photos (Steven, Sue-Anne, Erika, Victor, Preciosa, Soukaina, Francine)


## Photo Updates (User Request - Jan 2026)
- [ ] Update Soukaina Haidar photo with new image
- [ ] Update Steven Barholere photo with new image (blue striped shirt)

## Coach Profile Enhancements (User Request - Jan 2026)
- [x] Add video presentations to individual coach profile pages
- [x] Implement messaging system for student-coach communication
- [x] Create interactive availability calendar component
- [x] Integrate AvailabilityCalendar into coach profile page


## Advanced Features (User Request - Jan 2026)

### Real-time Notifications
- [ ] Create NotificationProvider context for app-wide notifications
- [ ] Add notification bell icon in header with unread count
- [ ] Implement in-app toast notifications for new messages
- [ ] Add session reminder notifications (24h and 1h before)
- [ ] Create NotificationDropdown component with notification list
- [ ] Store notification preferences in user profile
- [ ] Mark notifications as read functionality

### Conversation History with Search
- [ ] Add search input to Messages page
- [ ] Implement message search across all conversations
- [ ] Highlight search terms in results
- [ ] Add date filters for conversation history
- [ ] Show message preview in search results
- [ ] Navigate to specific message when clicked

### Jitsi Video Integration
- [ ] Create VideoRoom component with Jitsi Meet embed
- [ ] Add "Join Session" button to upcoming sessions
- [ ] Generate unique room names for each session
- [ ] Add video controls (mute, camera, screen share)
- [ ] Create pre-session lobby with device check
- [ ] Add session timer display during video call
- [ ] Handle session end and feedback collection


## Advanced Features - Jan 2026 (User Request)

### Real-time Notifications
- [x] Create notifications table in schema
- [x] Create NotificationContext for app-wide notifications
- [x] Create NotificationBell component in header
- [x] Add notification dropdown with unread count
- [x] Add notification router with CRUD operations
- [x] Mark notifications as read functionality
- [x] Mark all as read functionality
- [x] Delete notification functionality

### Messaging System with History
- [x] Create conversations and messages tables
- [x] Create Messages page with conversation list
- [x] Add search functionality for conversations
- [x] Add message history with timestamps
- [x] Create message router with CRUD operations
- [x] Add "Send Message" button on coach profiles
- [x] Start conversation mutation
- [x] Mark messages as read functionality

### Jitsi Video Integration
- [x] Create JitsiVideoRoom component
- [x] Integrate Jitsi Meet External API
- [x] Add video/audio controls (mute, camera, screen share)
- [x] Add session timer with duration tracking
- [x] Create SessionWaitingRoom component
- [x] Create VideoSession page with routing
- [x] Add post-session feedback form
- [x] Add fullscreen and chat toggle


## Advanced Features - Jan 2026 Phase 2 (User Request)

### Browser Push Notifications
- [ ] Create service worker for push notifications
- [ ] Add push subscription management
- [ ] Request notification permission from users
- [ ] Send push notifications for new messages
- [ ] Send push notifications for session reminders
- [ ] Add notification preferences in user settings

### Online Presence Indicator
- [ ] Add lastSeen field to users table
- [ ] Create presence tracking system
- [ ] Add green dot indicator on coach cards
- [ ] Show "Available Now" badge for online coaches
- [ ] Update presence on user activity
- [ ] Add "Book Instant Session" for available coaches

### Session Recording
- [ ] Enable Jitsi recording feature
- [ ] Store recording URLs in sessions table
- [ ] Create recordings list in learner dashboard
- [ ] Add playback functionality for recordings
- [ ] Add download option for recordings
- [ ] Set recording retention policy (30 days)


## Comprehensive Coach Registration System (User Request)

### Multi-Step Application Form
- [x] Step 1: Personal Information (name, email, phone, location, timezone)
- [x] Step 2: Professional Background (education, certifications, experience years)
- [x] Step 3: Language Qualifications (native language, SLE levels achieved, teaching experience)
- [x] Step 4: Teaching Specializations (oral A/B/C, written expression, grammar, vocabulary)
- [x] Step 5: Availability & Pricing (weekly hours, hourly rate, trial session rate)
- [x] Step 6: Profile Content (bio, tagline, teaching philosophy)
- [x] Step 7: Media Upload (professional photo, intro video)
- [x] Step 8: Legal Consent (terms, privacy, background check authorization)

### Photo & Video Upload
- [x] Professional photo upload with preview
- [x] Photo guidelines (professional attire, good lighting, neutral background)
- [x] Intro video upload (max 100MB) or YouTube link
- [x] Video guidelines (introduce yourself, teaching style, why Lingueefy)
- [x] Video preview before submission
- [ ] Store media in S3 storage (pending integration)

### Legal & Consent Forms
- [x] Terms of Service for Coaches agreement
- [x] Privacy Policy acknowledgment
- [x] Background check authorization (for government clients)
- [x] Code of Conduct agreement
- [x] Payment terms acceptance (commission structure)
- [x] Digital signature capture
- [x] Marketing consent (optional)

### Admin Approval Workflow
- [ ] Application status tracking (pending, under review, approved, rejected)
- [ ] Admin notification for new applications
- [ ] Application review dashboard
- [ ] Approve/Reject with feedback
- [ ] Automated welcome email on approval
- [ ] Rejection email with improvement suggestions
- [ ] Resubmission option for rejected applications


## Admin Dashboard & Payment Integration (User Request - Jan 2026)

### Admin Dashboard for Coach Applications
- [ ] Create AdminCoachApplications page with list view
- [ ] Add application detail view with all submitted info
- [ ] Implement approve/reject functionality with notes
- [ ] Add automatic email notifications on status change
- [ ] Create application statistics dashboard
- [ ] Add search and filter for applications

### Stripe Connect Integration
- [ ] Set up Stripe Connect onboarding flow for coaches
- [ ] Create coach payout dashboard
- [ ] Implement automatic weekly payouts
- [ ] Add earnings history and transaction logs
- [ ] Create commission calculation system

### Document Verification System
- [ ] Create document upload component for credentials
- [ ] Add verification status tracking (pending, verified, rejected)
- [ ] Implement admin review interface for documents
- [ ] Store documents securely in S3
- [ ] Add expiry date tracking for certifications


## Admin Dashboard & Payments (User Request - Jan 2026)

### Admin Dashboard for Coach Applications
- [x] Create AdminCoachApplications page with list view
- [x] Add application detail modal with all submitted info
- [x] Implement approve/reject actions with notifications
- [x] Add document verification review section
- [x] Create status filters (pending, approved, rejected)
- [x] Add search and sort functionality

### Stripe Connect Integration
- [x] Create CoachPayments page for managing Stripe account
- [x] Display onboarding status and link
- [x] Show earnings dashboard with transaction history
- [x] Display pending payouts and payout schedule
- [x] Link to Stripe Express dashboard

### Document Verification System
- [x] Create DocumentVerification component
- [x] Add document upload with file type validation
- [x] Create document list view with status badges
- [x] Add admin review interface for documents
- [x] Implement verify/reject actions with notes
- [ ] Store documents securely in S3 (pending S3 integration)


## Photo Lightbox Gallery (User Request - Jan 2026)
- [x] Create PhotoLightbox component with zoom functionality
- [x] Add smooth open/close animations
- [x] Implement keyboard navigation (Escape to close)
- [x] Add click outside to close
- [x] Integrate into Coaches page coach cards
- [x] Integrate into CoachProfile page


## Complete Coach Journey - Missing Features (Jan 2026)

### Phase 1: Booking Calendar System
- [ ] Create BookingCalendar component with date picker
- [ ] Display available time slots based on coach availability
- [ ] Handle timezone conversions
- [ ] Add loading states and error handling

### Phase 2: Booking Flow
- [ ] Create BookingModal with calendar and time slot selection
- [ ] Integrate with Stripe checkout
- [ ] Add session type selection (trial, single, package)
- [ ] Create booking API endpoints

### Phase 3: Confirmation Pages
- [ ] Create BookingSuccess page after payment
- [ ] Show session details and meeting link
- [ ] Add calendar download (.ics) functionality
- [ ] Send confirmation emails with all details

### Phase 4: Learner Sessions Management
- [ ] Create LearnerDashboard page
- [ ] Show upcoming sessions with join buttons
- [ ] Show past sessions with review options
- [ ] Add session cancellation/reschedule UI

### Phase 5: S3 Document Storage
- [ ] Implement document upload to S3
- [ ] Create secure document retrieval
- [ ] Update coach application to use S3
- [ ] Add document verification workflow

### Phase 6: Coach Guide & Help
- [ ] Create CoachGuide page with tutorials
- [ ] Add FAQ section for coaches
- [ ] Create video tutorial placeholders
- [ ] Add troubleshooting section


## Complete Coach Journey - January 2026

### Booking System Enhancements
- [x] Interactive booking calendar with time slot selection
- [x] Session date/time passed to Stripe checkout
- [x] BookingSuccess page with real session data from API
- [x] BookingCancelled page for failed payments
- [x] Latest session API endpoint for confirmation page
- [x] Calendar download (ICS) with actual session date

### Learner Session Management
- [x] MySessions page with tabs (upcoming/past/cancelled)
- [x] Join session button with meeting URL
- [x] Reschedule session functionality
- [x] Cancel session with refund policy display
- [x] Route added to App.tsx (/my-sessions)

### S3 Document Storage
- [x] Coach document upload to S3 storage
- [x] Coach photo upload to S3 storage
- [x] Fallback to base64 if S3 fails
- [x] Unique file paths with timestamps and sanitized names

### Coach Guide & Help Center
- [x] Comprehensive CoachGuide page
- [x] Getting started section with step-by-step checklist
- [x] Profile optimization tips (photo, headline, bio, video)
- [x] Session management guide (before/during/after)
- [x] Commission structure explained with tier table
- [x] Best practices section with icons
- [x] FAQ section with common questions
- [x] Bilingual content (EN/FR)
- [x] Link from CoachDashboard quick links
- [x] Link from CoachOnboardingChecklist


## Advanced Features - January 2026 (Phase 2)

### Coach Photo Gallery
- [ ] Add coach_gallery_photos table to schema
- [ ] Create photo gallery upload component
- [ ] Allow multiple photo uploads (up to 10)
- [ ] Integrate with S3 storage
- [ ] Display gallery on coach profile page
- [ ] Add lightbox viewer for gallery photos
- [ ] Add photo management in coach dashboard

### Browser Push Notifications
- [ ] Add push subscription table to schema
- [ ] Create service worker for push notifications
- [ ] Implement subscription management API
- [ ] Add notification preferences in settings
- [ ] Send push for new bookings
- [ ] Send push for new messages
- [ ] Send push for session reminders

### Past Sessions History
- [ ] Add getPastSessions API endpoint
- [ ] Implement past sessions tab in MySessions
- [ ] Add session notes field to sessions table
- [ ] Create session notes modal for coaches
- [ ] Add "Leave Review" button for completed sessions
- [ ] Display reviews on past session cards
- [ ] Add session feedback summary


## Advanced Features - January 2026 (Phase 2)

### Coach Photo Gallery
- [x] Create coachGalleryPhotos table in schema
- [x] Create CoachPhotoGallery component with upload/delete
- [x] Add gallery endpoints to coach router
- [x] Integrate gallery into CoachDashboard
- [x] Add gallery tab to CoachProfile page
- [x] S3 storage for gallery photos

### Push Notifications System
- [x] Create pushSubscriptions table in schema
- [x] Create PushNotificationManager component
- [x] Add notification preference toggles
- [x] Add subscribe/unsubscribe endpoints
- [x] Integrate with existing NotificationSettings

### Past Sessions History
- [x] Add pastSessions endpoint to learner router
- [x] Add cancelledSessions endpoint to learner router
- [x] Update MySessions page with past/cancelled tabs
- [x] Create SessionNotesModal component
- [x] Add session notes endpoints to coach router
- [x] Create sessionNotes table in schema


## Advanced Features - January 2026 (Phase 3)

### Coach Badges & Certifications
- [ ] Create coachBadges table in schema
- [ ] Create badge types (ELS Verified, Top Rated, 100 Sessions, etc.)
- [ ] Create CoachBadges component for profile display
- [ ] Add badge award logic based on achievements
- [ ] Display badges on coach cards and profiles

### Coach Analytics Dashboard
- [ ] Create CoachAnalytics page component
- [ ] Add revenue chart (monthly/weekly)
- [ ] Add session completion rate chart
- [ ] Add learner retention metrics
- [ ] Add popular time slots analysis
- [ ] Add route to App.tsx

### Learner Favorites System
- [ ] Create learnerFavorites table in schema
- [ ] Add favorite/unfavorite endpoints
- [ ] Create FavoriteButton component
- [ ] Add favorites list to learner dashboard
- [ ] Display favorite status on coach cards


## Learner Journey Completion - January 2026

### Learner Profile & Settings Page
- [ ] Create LearnerSettings page component
- [ ] Add profile editing (name, photo, department)
- [ ] Add SLE level editing (current/target)
- [ ] Add exam date management
- [ ] Add notification preferences
- [ ] Add route to App.tsx

### Learner Progress Tracking
- [ ] Create LearnerProgress page component
- [ ] Add SLE level progression chart
- [ ] Add session history timeline
- [ ] Add AI practice statistics
- [ ] Add achievements/milestones display

### Learner Payment History
- [ ] Create LearnerPayments page component
- [ ] Display past payments with receipts
- [ ] Show active packages/credits
- [ ] Add invoice download

### Update LearnerDashboard
- [ ] Connect to real data (remove mock data)
- [ ] Add quick links to all learner pages
- [ ] Display real SLE levels from profile
- [ ] Show actual session statistics


## Learner Journey Completion - January 2026

### Learner Pages
- [x] LearnerSettings page (profile, notifications, preferences)
- [x] LearnerProgress page (SLE tracking, achievements, milestones)
- [x] LearnerPayments page (payment history, invoices)
- [x] LearnerFavorites page (saved coaches)
- [x] Routes added to App.tsx
- [x] Quick links added to LearnerDashboard

### Favorites System
- [x] learnerFavorites table in schema
- [x] favorites endpoint in learner router
- [x] addFavorite endpoint
- [x] removeFavorite endpoint
- [x] isFavorited endpoint
- [x] FavoriteButton component
- [x] LearnerFavorites page

### Coach Badges & Analytics
- [x] CoachBadges component (auto-generated based on stats)
- [x] CoachAnalytics component (charts, metrics)
- [x] Integrated badges into CoachProfile page
- [x] Integrated analytics into CoachDashboard
- [x] Favorite button on coach profiles


## Advanced Features - January 2026 (Phase 4)

### Real-Time Messaging System
- [ ] Create messages table in schema (if not exists)
- [ ] Create conversations table for chat threads
- [ ] Build MessagesPage component with conversation list
- [ ] Build ChatWindow component for individual chats
- [ ] Add real-time updates with polling/websockets
- [ ] Add unread message count badge
- [ ] Send notification on new message
- [ ] Add message input with send button
- [ ] Display message timestamps
- [ ] Add typing indicator (optional)

### Enhanced Admin Dashboard
- [ ] Add growth charts (users, sessions, revenue over time)
- [ ] Add refund management section
- [ ] Display pending refund requests
- [ ] Add approve/reject refund functionality
- [ ] Add revenue breakdown by month
- [ ] Add coach performance metrics
- [ ] Add learner engagement metrics
- [ ] Export data to CSV

### Loyalty Program
- [ ] Create loyalty_points table in schema
- [ ] Create rewards table for available rewards
- [ ] Create point_transactions table for history
- [ ] Build LoyaltyDashboard component for learners
- [ ] Add points earning rules (booking, review, referral)
- [ ] Add rewards redemption (discounts, free sessions)
- [ ] Display points balance in learner dashboard
- [ ] Add points history page


## Messaging, Admin Analytics & Loyalty Program - January 2026

### Real-time Messaging Enhancements
- [x] Add polling for new messages (3 second interval)
- [x] Add typing indicator state
- [x] Auto-scroll to new messages
- [x] Sound notification for new messages

### Admin Dashboard Analytics
- [x] Create AdminAnalytics component
- [x] User growth chart
- [x] Session volume chart
- [x] Revenue trend chart
- [x] Coach performance rankings
- [x] Refund management table
- [x] Learner engagement metrics
- [x] Export data to CSV
- [x] Time range filter (week/month/quarter/year)

### Loyalty Program
- [x] Create loyaltyPoints table in schema
- [x] Create pointTransactions table in schema
- [x] Create loyaltyRewards table in schema
- [x] Create redeemedRewards table in schema
- [x] Add getLoyaltyPoints endpoint
- [x] Add getAvailableRewards endpoint
- [x] Add getPointsHistory endpoint
- [x] Add redeemReward endpoint
- [x] Create LoyaltyDashboard component
- [x] Create LearnerLoyalty page
- [x] Add rewards link to LearnerDashboard
- [x] Tier system (bronze/silver/gold/platinum)
- [x] Points earning rules display
- [x] Rewards redemption UI
- [x] Transaction history display


## Loyalty Notifications, Coupons & Referrals - January 2026

### Loyalty Email Notifications
- [ ] Create email template for points earned
- [ ] Create email template for tier upgrade
- [ ] Send notification when points are earned
- [ ] Send notification when tier changes
- [ ] Include points balance and next tier info

### Promo Coupon System
- [ ] Create promo_coupons table in schema
- [ ] Create coupon_redemptions table in schema
- [ ] Add admin coupon management UI
- [ ] Create coupon (code, discount type, value, expiry)
- [ ] List/edit/deactivate coupons
- [ ] Apply coupon at checkout
- [ ] Track coupon usage statistics

### Enhanced Referral Dashboard
- [ ] Create referral_invitations table in schema
- [ ] Build ReferralDashboard component
- [ ] Show referral link with copy button
- [ ] Display pending/completed referrals
- [ ] Show earned rewards from referrals
- [ ] Add invite via email functionality
- [ ] Track referral conversion rate


## Loyalty Notifications, Coupons & Referrals - January 2026

### Loyalty Email Notifications
- [x] Points earned email template
- [x] Tier upgrade email template
- [x] Referral invite email template
- [x] Integrated with existing email system

### Promo Coupon System
- [x] promoCoupons table in schema
- [x] couponRedemptions table in schema
- [x] AdminCoupons component with full CRUD
- [x] Create/edit/delete coupons
- [x] Toggle coupon active status
- [x] Support percentage, fixed amount, and free trial discounts
- [x] Usage limits and expiry dates
- [x] New users only option
- [x] Coupons tab in AdminDashboard

### Enhanced Referral Dashboard
- [x] referralInvitations table in schema
- [x] ReferralDashboard component
- [x] LearnerReferrals page
- [x] Referral stats (total, pending, converted)
- [x] Conversion rate tracking
- [x] Social sharing (Twitter, Facebook, LinkedIn)
- [x] Email invitation system
- [x] Invitation history table
- [x] Rewards info display
- [x] Route added to App.tsx
- [x] Link in LearnerDashboard


## Checkout, Gamification & Notifications - January 2026

### Coupon Validation at Checkout
- [ ] Add coupon code input field to booking dialog
- [ ] Create validateCoupon endpoint
- [ ] Apply discount to checkout price
- [ ] Show discount breakdown in booking summary
- [ ] Pass coupon to Stripe checkout session
- [ ] Record coupon redemption after payment

### Gamification System
- [ ] Create challenges table in schema
- [ ] Create userChallenges table for tracking progress
- [ ] Create ChallengesCard component
- [ ] Add weekly challenges (sessions, reviews, referrals)
- [ ] Track challenge progress automatically
- [ ] Award points on challenge completion
- [ ] Add challenges section to learner dashboard

### In-App Notification Center
- [ ] Create inAppNotifications table in schema
- [ ] Create NotificationCenter component
- [ ] Add notification bell icon in header
- [ ] Show unread count badge
- [ ] Display recent notifications (messages, sessions, points)
- [ ] Mark notifications as read
- [ ] Add notification preferences


## Checkout, Gamification & Notifications - January 2026

### Coupon Validation at Checkout
- [x] Add couponId parameter to createCheckout endpoint
- [x] Validate coupon code at checkout
- [x] Apply percentage, fixed amount, or free trial discounts
- [x] Record coupon redemption in database
- [x] Update coupon usage count
- [x] Add coupon input field to CoachProfile booking dialog
- [x] Show discount preview before checkout

### Gamification System
- [x] Create challenges table in schema
- [x] Create userChallenges table for progress tracking
- [x] Add getChallenges endpoint to learner router
- [x] Add claimChallengeReward endpoint
- [x] Create ChallengesCard component
- [x] Integrate into LearnerDashboard sidebar
- [x] Award loyalty points on challenge completion

### In-App Notification Center
- [x] Create inAppNotifications table in schema
- [x] Add getInAppNotifications endpoint
- [x] Add markNotificationRead endpoint
- [x] Add markAllNotificationsRead endpoint
- [x] Add deleteNotification endpoint
- [x] Create NotificationCenter component with popover
- [x] Integrate into Header for authenticated users
- [x] Show unread count badge


## Push Notifications, Leaderboard & Auto Rewards - January 2026

### Native Push Notifications
- [x] Create service worker file (sw.js)
- [x] Configure push notification subscription
- [x] Add VAPID keys for web push
- [x] Create push notification endpoint on server
- [x] Send push notifications for new messages
- [x] Send push notifications for session reminders
- [x] Send push notifications for points earned

### Leaderboard System
- [x] Create Leaderboard component
- [x] Add getLeaderboard endpoint to learner router
- [x] Display top learners by points
- [x] Show user's rank position
- [x] Add weekly/monthly/all-time filters
- [x] Add leaderboard to LearnerDashboard

### Automatic Rewards
- [x] Create reward trigger system (rewards.ts)
- [x] Auto-award points on session completion
- [x] Auto-award points on review submission
- [x] Auto-award badges on milestone achievements
- [x] Update challenge progress automatically
- [x] Send notification when reward earned


## Page Audit & Design Consistency - January 2026

### Page Functionality Audit
- [ ] Home page - verify all sections work
- [ ] Coaches page - verify list and filters work
- [ ] Coach profile page - verify booking flow works
- [ ] Pricing page - verify all pricing tiers display
- [ ] For Departments (B2B) page - verify contact form works
- [ ] About page - verify all content displays

### Glassmorphism Design Consistency
- [ ] Audit glassmorphism on Home page
- [ ] Audit glassmorphism on Coaches page
- [ ] Audit glassmorphism on Coach profile page
- [ ] Audit glassmorphism on Pricing page
- [ ] Audit glassmorphism on For Departments page
- [ ] Audit glassmorphism on About page
- [ ] Apply consistent glassmorphism styles across all pages

### Responsive Design
- [ ] Test Home page on mobile
- [ ] Test Coaches page on mobile
- [ ] Test Coach profile page on mobile
- [ ] Test Pricing page on mobile
- [ ] Test For Departments page on mobile
- [ ] Test About page on mobile
- [ ] Fix any responsive issues found

### Footer with Copyright
- [ ] Update Footer component with "© 2026 Rusinga International Consulting Ltd."
- [ ] Verify footer appears on all pages


## Page Audit & Design Consistency - January 2026

### Page Functionality
- [x] Home page - All sections functional
- [x] Coaches page - List and filters working
- [x] Pricing page - Tiers and FAQ working
- [x] For Departments (B2B) page - Contact form working
- [x] About page - All sections functional

### Design Consistency
- [x] Glassmorphism design consistent on all pages
- [x] Teal color scheme maintained
- [x] Responsive navigation header on all pages

### Responsiveness
- [x] Mobile-first responsive classes on all pages
- [x] Grid layouts adapt to screen sizes
- [x] Buttons and forms responsive

### Footer
- [x] Footer with "© 2026 Rusinga International Consulting Ltd." on all pages
- [x] RusingÂcademy branding included


## Streaks, PDF Reports & Dark Mode - January 2026

### Streak System
- [ ] Add streak tracking fields to learner_profiles schema
- [ ] Create StreakCard component for dashboard
- [ ] Track consecutive weeks with sessions
- [ ] Award bonus points for streak milestones (3, 7, 14, 30 weeks)
- [ ] Display streak counter with fire icon
- [ ] Add streak recovery option (miss 1 week grace period)
- [ ] Send streak reminder notifications

### PDF Progress Reports
- [ ] Create PDF generation service using jsPDF or pdfmake
- [ ] Design professional report template
- [ ] Include SLE level progress chart
- [ ] Include session history summary
- [ ] Include coach feedback highlights
- [ ] Include AI practice statistics
- [ ] Add download button to LearnerProgress page
- [ ] Generate bilingual reports (EN/FR)

### Dark Mode
- [ ] Add dark mode toggle to header
- [ ] Create dark theme CSS variables
- [ ] Update all pages with dark mode classes
- [ ] Persist theme preference in localStorage
- [ ] Add system preference detection
- [ ] Ensure contrast ratios meet WCAG standards


## Streaks, PDF Reports & Dark Mode - January 2026

### Learning Streak System
- [x] Add streak fields to learner_profiles schema
- [x] Create StreakCard component for dashboard
- [x] Add streak endpoints to learner router
- [x] Track current and longest streaks
- [x] Award bonus points for consecutive weeks
- [x] Display streak in LearnerDashboard

### PDF Progress Reports
- [x] Install jspdf and jspdf-autotable
- [x] Create progressReport.ts service
- [x] Generate professional PDF with learner info
- [x] Include SLE levels, progress, and session history
- [x] Add download button to LearnerProgress page
- [x] Bilingual PDF support (EN/FR)
- [x] Footer with copyright "© 2026 Rusinga International Consulting Ltd."

### Complete Dark Mode
- [x] Update ThemeContext with system theme support
- [x] Add theme toggle button to Header
- [x] Support light/dark/system themes
- [x] Persist theme preference in localStorage
- [x] Listen for system theme changes
- [x] Smooth transitions between themes
- [x] Dark mode styling on all pages


## Lingueefy for Organizations - January 2026

### Database Schema
- [ ] Create organizations table (name, logo, domain, contact info)
- [ ] Create organization_coaches table (associate coachs to organizations)
- [ ] Create coaching_credits table (track credit balance per organization)
- [ ] Create credit_transactions table (log credit usage)
- [ ] Add organization_id to users table (optional, for org admins)

### Organizations Portal Page
- [ ] Create /organizations route
- [ ] Build OrganizationsPortal.tsx component
- [ ] Add "Access reserved for partner organizations" message
- [ ] Add "Sign in via RusingAcademy" button (disabled for now)
- [ ] Add benefits section explaining organizational mode
- [ ] Bilingual support (EN/FR)

### Backend Endpoints
- [ ] Create organizations router
- [ ] Add getOrganization endpoint
- [ ] Add listOrganizations endpoint (admin only)
- [ ] Add createOrganization endpoint (admin only)
- [ ] Add getOrganizationCoachs endpoint
- [ ] Add getCreditBalance endpoint
- [ ] Add creditTransaction tracking

### Integration Points (Future)
- [ ] SSO integration with RusingAcademy
- [ ] Organization admin dashboard
- [ ] Credit management interface
- [ ] Bulk coaching session booking


## Missing Pages & Footer Links - January 2026

- [x] Verify FAQ page exists
- [x] Verify Become Coach page exists
- [x] Verify Terms of Use page (with "Rusinga International Consulting Ltd.")
- [x] Verify Privacy Policy page (with "Rusinga International Consulting Ltd.")
- [x] Update Footer with all page links
- [x] Verify all pages accessible from footer


## Application Status Tracker - January 2026

- [x] Design application status tracker UI/UX with timeline
- [x] Create backend API endpoints for application status queries
- [x] Build ApplicationStatusTracker component with timeline view
- [x] Integrate tracker into Become a Coach page (for authenticated applicants)
- [x] Add real-time status updates with polling
- [ ] Add email notifications for status changes (submitted, under review, approved, rejected)
- [ ] Test application status tracker with multiple scenarios
