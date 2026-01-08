# Lingueefy UX Architecture

**Version:** 1.0  
**Date:** January 7, 2026  
**Purpose:** Define sitemap, user journeys, and information architecture

---

## Platform Sitemap

```
LINGUEEFY PLATFORM
│
├── PUBLIC PAGES (No Auth Required)
│   ├── / (Homepage)
│   │   ├── Hero with value proposition
│   │   ├── Featured coaches
│   │   ├── How it works
│   │   ├── Success stories
│   │   ├── Prof Steven AI preview
│   │   └── CTA: Find a Coach / Become a Coach
│   │
│   ├── /coaches (Browse Coaches)
│   │   ├── Search & filters
│   │   ├── Coach cards grid
│   │   └── Pagination
│   │
│   ├── /coaches/[slug] (Coach Profile)
│   │   ├── Video introduction
│   │   ├── About & credentials
│   │   ├── SLE specializations
│   │   ├── Availability calendar
│   │   ├── Pricing & packages
│   │   ├── Reviews
│   │   └── Book now CTA
│   │
│   ├── /ai-coach (Prof Steven AI Landing)
│   │   ├── Features overview
│   │   ├── Demo video
│   │   ├── Pricing (free tier vs premium)
│   │   └── Try now CTA
│   │
│   ├── /how-it-works
│   │   ├── For learners
│   │   ├── For coaches
│   │   └── FAQ
│   │
│   ├── /pricing
│   │   ├── Session pricing (coach-set)
│   │   ├── Prof Steven AI pricing
│   │   └── Corporate packages
│   │
│   ├── /become-a-coach
│   │   ├── Benefits
│   │   ├── Requirements
│   │   ├── Commission info
│   │   └── Apply now CTA
│   │
│   ├── /about
│   ├── /contact
│   ├── /privacy
│   ├── /terms
│   │
│   └── /auth
│       ├── /login
│       ├── /register
│       ├── /register/learner
│       ├── /register/coach
│       ├── /forgot-password
│       └── /reset-password
│
├── LEARNER DASHBOARD (Auth Required - Learner Role)
│   ├── /dashboard (Learner Home)
│   │   ├── Upcoming sessions
│   │   ├── Progress summary
│   │   ├── Recommended coaches
│   │   └── Quick actions
│   │
│   ├── /dashboard/sessions
│   │   ├── Upcoming
│   │   ├── Past
│   │   └── Cancelled
│   │
│   ├── /dashboard/sessions/[id] (Session Detail)
│   │   ├── Session info
│   │   ├── Join session button
│   │   ├── Session notes
│   │   └── Leave review
│   │
│   ├── /dashboard/coaches (My Coaches)
│   │   ├── Saved coaches
│   │   └── Past coaches
│   │
│   ├── /dashboard/messages
│   │   ├── Conversation list
│   │   └── Chat view
│   │
│   ├── /dashboard/progress
│   │   ├── SLE level tracking
│   │   ├── Sessions completed
│   │   ├── Goals & milestones
│   │   └── AI practice stats
│   │
│   ├── /dashboard/ai-practice (Prof Steven AI)
│   │   ├── Start practice session
│   │   ├── Take placement test
│   │   ├── Exam simulation
│   │   ├── Practice history
│   │   └── Recommendations
│   │
│   ├── /dashboard/billing
│   │   ├── Payment methods
│   │   ├── Transaction history
│   │   └── Packages owned
│   │
│   └── /dashboard/settings
│       ├── Profile
│       ├── SLE goals
│       ├── Notifications
│       └── Account
│
├── COACH DASHBOARD (Auth Required - Coach Role)
│   ├── /coach (Coach Home)
│   │   ├── Today's schedule
│   │   ├── Earnings summary
│   │   ├── Pending requests
│   │   └── Quick actions
│   │
│   ├── /coach/calendar
│   │   ├── Weekly view
│   │   ├── Availability settings
│   │   └── Sync with external calendar
│   │
│   ├── /coach/sessions
│   │   ├── Upcoming
│   │   ├── Pending approval
│   │   ├── Past
│   │   └── Cancelled
│   │
│   ├── /coach/sessions/[id] (Session Detail)
│   │   ├── Student info
│   │   ├── Session notes
│   │   ├── Join session
│   │   └── Session history with student
│   │
│   ├── /coach/students (My Students)
│   │   ├── Active students
│   │   ├── Past students
│   │   └── Student profiles with notes
│   │
│   ├── /coach/messages
│   │   ├── Conversation list
│   │   └── Chat view
│   │
│   ├── /coach/earnings
│   │   ├── Balance
│   │   ├── Pending
│   │   ├── Transaction history
│   │   └── Payout settings
│   │
│   ├── /coach/profile
│   │   ├── Edit public profile
│   │   ├── Video introduction
│   │   ├── Services & pricing
│   │   ├── SLE specializations
│   │   └── Preview profile
│   │
│   ├── /coach/reviews
│   │   ├── All reviews
│   │   └── Response management
│   │
│   └── /coach/settings
│       ├── Account
│       ├── Notifications
│       ├── Booking preferences
│       └── Payout method
│
├── ADMIN DASHBOARD (Auth Required - Admin Role)
│   ├── /admin
│   │   ├── Platform metrics
│   │   ├── Recent activity
│   │   └── Alerts
│   │
│   ├── /admin/coaches
│   │   ├── All coaches
│   │   ├── Pending applications
│   │   ├── Featured coaches
│   │   └── Coach detail/edit
│   │
│   ├── /admin/learners
│   │   ├── All learners
│   │   └── Learner detail
│   │
│   ├── /admin/sessions
│   │   ├── All sessions
│   │   └── Disputes
│   │
│   ├── /admin/transactions
│   │   ├── All transactions
│   │   ├── Payouts
│   │   └── Refunds
│   │
│   ├── /admin/reviews
│   │   ├── Flagged reviews
│   │   └── Review moderation
│   │
│   ├── /admin/content
│   │   ├── Homepage content
│   │   ├── FAQ management
│   │   └── Email templates
│   │
│   └── /admin/settings
│       ├── Platform settings
│       ├── Commission rates
│       └── Feature flags
│
└── SHARED FEATURES
    ├── /classroom/[sessionId] (Video Session Room)
    │   ├── Video call
    │   ├── Chat
    │   ├── Shared notes
    │   ├── Screen share
    │   └── Session timer
    │
    └── /ai-session/[type] (Prof Steven AI Session)
        ├── Voice interface
        ├── Transcript
        ├── Feedback panel
        └── Session summary
```

---

## User Journeys

### Journey 1: New Learner - First Booking

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    LEARNER JOURNEY: FIRST BOOKING                           │
└─────────────────────────────────────────────────────────────────────────────┘

AWARENESS                    CONSIDERATION                 CONVERSION
    │                             │                            │
    ▼                             ▼                            ▼
┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐
│ Arrives │───▶│ Browse  │───▶│  View   │───▶│ Create  │───▶│  Book   │
│ on site │    │ coaches │    │ profile │    │ account │    │ session │
└─────────┘    └─────────┘    └─────────┘    └─────────┘    └─────────┘
     │              │              │              │              │
     ▼              ▼              ▼              ▼              ▼
  See hero      Filter by      Watch video    Enter SLE     Select time
  + value       SLE level,     intro, read    goals, exam   + pay
  prop          price, etc.    reviews        date
                                              
                                                              │
                                                              ▼
                                                        ┌─────────┐
                                                        │ Session │
                                                        │ confirm │
                                                        └─────────┘
```

**Detailed Steps:**

| Step | Page | User Action | System Response |
|------|------|-------------|-----------------|
| 1 | Homepage | Lands on site (from Wix, Google, referral) | Show hero, featured coaches, value prop |
| 2 | Homepage | Clicks "Find a Coach" | Navigate to /coaches |
| 3 | Browse | Sets filters: French, Oral C, evenings | Filter coach list |
| 4 | Browse | Clicks on coach card | Navigate to /coaches/[slug] |
| 5 | Profile | Watches video intro | Video plays |
| 6 | Profile | Reads reviews, checks availability | Show calendar, reviews |
| 7 | Profile | Clicks "Book Trial Session" | Prompt to create account |
| 8 | Register | Fills registration form | Create account, set SLE goals |
| 9 | Profile | Selects date/time | Show price, confirm details |
| 10 | Checkout | Enters payment info | Process payment via Stripe |
| 11 | Confirmation | Sees booking confirmation | Send email, add to calendar |

**Key Metrics:**
- Homepage → Browse: 40% target
- Browse → Profile: 25% target
- Profile → Register: 15% target
- Register → Book: 60% target

---

### Journey 2: Learner - Using Prof Steven AI

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    LEARNER JOURNEY: AI PRACTICE                             │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐
│Dashboard│───▶│  AI     │───▶│ Select  │───▶│Practice │───▶│ Review  │
│  Home   │    │Practice │    │  Mode   │    │ Session │    │Feedback │
└─────────┘    └─────────┘    └─────────┘    └─────────┘    └─────────┘
                                  │
                    ┌─────────────┼─────────────┐
                    ▼             ▼             ▼
              ┌─────────┐  ┌─────────┐  ┌─────────┐
              │  Voice  │  │Placement│  │  Exam   │
              │Practice │  │  Test   │  │   Sim   │
              └─────────┘  └─────────┘  └─────────┘
```

**Detailed Steps:**

| Step | Page | User Action | System Response |
|------|------|-------------|-----------------|
| 1 | Dashboard | Clicks "Practice with AI" | Navigate to AI practice |
| 2 | AI Practice | Selects mode (Practice/Test/Sim) | Show mode options |
| 3 | AI Practice | Selects "Exam Simulation" | Configure simulation |
| 4 | Config | Chooses: Oral C, 20 minutes | Prepare AI session |
| 5 | Session | Grants microphone permission | Start voice session |
| 6 | Session | Converses with Prof Steven AI | AI responds, evaluates |
| 7 | Session | Completes simulation | Generate feedback |
| 8 | Feedback | Reviews scores, transcript | Show detailed analysis |
| 9 | Feedback | Clicks "Practice weak areas" | Suggest targeted drills |

---

### Journey 3: New Coach - Onboarding

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    COACH JOURNEY: ONBOARDING                                │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐
│ Landing │───▶│  Apply  │───▶│ Profile │───▶│ Review  │───▶│  Go     │
│  Page   │    │  Form   │    │  Setup  │    │ Period  │    │  Live   │
└─────────┘    └─────────┘    └─────────┘    └─────────┘    └─────────┘
     │              │              │              │              │
     ▼              ▼              ▼              ▼              ▼
  Benefits,     Credentials,   Video intro,   Admin review,  Profile
  commission    experience,    pricing,       approval or    visible,
  info          SLE expertise  availability   feedback       bookings
                                                             enabled
```

**Detailed Steps:**

| Step | Page | User Action | System Response |
|------|------|-------------|-----------------|
| 1 | /become-a-coach | Reads benefits, requirements | Show value prop |
| 2 | /become-a-coach | Clicks "Apply Now" | Navigate to application |
| 3 | Application | Fills basic info (name, email, etc.) | Validate fields |
| 4 | Application | Describes SLE experience | Capture expertise |
| 5 | Application | Uploads credentials/certificates | Store documents |
| 6 | Application | Submits application | Create pending coach account |
| 7 | Email | Receives confirmation email | Explain next steps |
| 8 | Profile Setup | Logs in, completes profile | Guide through setup |
| 9 | Profile Setup | Records video introduction | Upload and process video |
| 10 | Profile Setup | Sets pricing and services | Save pricing structure |
| 11 | Profile Setup | Sets availability | Configure calendar |
| 12 | Profile Setup | Connects Stripe for payouts | Stripe Connect onboarding |
| 13 | Review | Admin reviews application | Approve or request changes |
| 14 | Approval | Receives approval notification | Profile goes live |
| 15 | Dashboard | Starts receiving booking requests | Notifications enabled |

---

### Journey 4: Coach - Managing Sessions

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    COACH JOURNEY: SESSION MANAGEMENT                        │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐
│ Booking │───▶│ Prepare │───▶│ Conduct │───▶│  Notes  │───▶│  Get    │
│ Request │    │ Session │    │ Session │    │& Follow │    │  Paid   │
└─────────┘    └─────────┘    └─────────┘    └─────────┘    └─────────┘
     │              │              │              │              │
     ▼              ▼              ▼              ▼              ▼
  Review         Review        Join video     Add session    Earnings
  student        student's     classroom,     notes,         added to
  profile,       goals,        teach          suggest next   balance,
  accept/        prepare       session        steps          payout
  decline        materials
```

---

### Journey 5: Admin - Coach Approval

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    ADMIN JOURNEY: COACH APPROVAL                            │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐
│  View   │───▶│ Review  │───▶│ Decision│───▶│ Notify  │
│ Pending │    │ Details │    │         │    │ Coach   │
└─────────┘    └─────────┘    └─────────┘    └─────────┘
                                  │
                    ┌─────────────┼─────────────┐
                    ▼             ▼             ▼
              ┌─────────┐  ┌─────────┐  ┌─────────┐
              │ Approve │  │ Request │  │ Reject  │
              │         │  │ Changes │  │         │
              └─────────┘  └─────────┘  └─────────┘
```

---

## Key Page Wireframe Descriptions

### Homepage

```
┌────────────────────────────────────────────────────────────────┐
│  LOGO                    [Find Coach] [AI Practice] [Login]   │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│     Canada's #1 Platform for GC/SLE Language Preparation      │
│                                                                │
│  [I want to learn French ▼] [Target: Oral C ▼] [Find Coach]   │
│                                                                │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐      │
│  │ Coach 1  │  │ Coach 2  │  │ Coach 3  │  │ Coach 4  │      │
│  │ [Photo]  │  │ [Photo]  │  │ [Photo]  │  │ [Photo]  │      │
│  │ Oral C   │  │ Written  │  │ BBB→CBC  │  │ Anxiety  │      │
│  │ $45/hr   │  │ $35/hr   │  │ $50/hr   │  │ $40/hr   │      │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘      │
│                                                                │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  🤖 PROF STEVEN AI - Practice 24/7                            │
│                                                                │
│  [Voice Practice]  [Placement Test]  [Exam Simulation]        │
│                                                                │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  HOW IT WORKS                                                  │
│  1. Find Coach → 2. Book Session → 3. Achieve Your Goal       │
│                                                                │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  SUCCESS STORIES                                               │
│  "I passed my Oral C thanks to Lingueefy!" - Marie, ESDC     │
│                                                                │
├────────────────────────────────────────────────────────────────┤
│  Footer: About | Contact | Privacy | Terms | FR/EN            │
└────────────────────────────────────────────────────────────────┘
```

### Coach Profile Page

```
┌────────────────────────────────────────────────────────────────┐
│  LOGO                    [Find Coach] [AI Practice] [Login]   │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │                                                         │  │
│  │  [VIDEO INTRODUCTION]                                   │  │
│  │                                                         │  │
│  │  ▶ Play                                                 │  │
│  │                                                         │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                                │
│  ┌──────────┐  COACH NAME                                     │
│  │ [Photo]  │  ⭐ 4.9 (127 reviews) | 94% SLE success rate   │
│  │          │  📍 Ottawa | 🕐 Responds in 2 hours            │
│  └──────────┘                                                 │
│                                                                │
│  SPECIALIZATIONS                                              │
│  [Oral C] [BBB→CBC] [Anxiety Coaching] [Federal Scenarios]   │
│                                                                │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  ABOUT ME                                                     │
│  I've helped 200+ public servants achieve their SLE goals...  │
│                                                                │
│  CREDENTIALS                                                  │
│  ✓ TESL Certified | ✓ 10+ years experience | ✓ Former PSC    │
│                                                                │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  SERVICES & PRICING                                           │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │ Trial Session (30 min)              $25                 │  │
│  │ Single Session (60 min)             $55                 │  │
│  │ 5-Session Package                   $250 (save 10%)     │  │
│  │ 10-Session Package                  $450 (save 18%)     │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                                │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  AVAILABILITY                                                 │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │  < January 2026 >                                       │  │
│  │  Mon  Tue  Wed  Thu  Fri  Sat  Sun                     │  │
│  │   6    7    8    9   10   11   12                      │  │
│  │  [●]  [●]  [ ]  [●]  [●]  [ ]  [ ]                     │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                                │
│  [Book Trial Session - $25]                                   │
│                                                                │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  REVIEWS (127)                                                │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │ ⭐⭐⭐⭐⭐ "Helped me go from B to C in 3 months!"        │  │
│  │ - Jean-Pierre, CRA | Achieved: Oral C                   │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

### Learner Dashboard

```
┌────────────────────────────────────────────────────────────────┐
│  LOGO    [Dashboard] [Sessions] [AI Practice] [Messages] [⚙]  │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  Welcome back, Marie! 👋                                       │
│                                                                │
│  YOUR SLE GOAL: Oral C by March 15, 2026 (67 days)           │
│  ████████████░░░░░░░░ 60% progress                           │
│                                                                │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  UPCOMING SESSIONS                                            │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │ Tomorrow, 12:00 PM | Coach Steven | Oral C Practice     │  │
│  │ [Join Session] [Reschedule] [Message Coach]             │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                                │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │ Jan 12, 6:00 PM | Coach Marie | Mock Exam Simulation    │  │
│  │ [View Details] [Reschedule] [Message Coach]             │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                                │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  🤖 PROF STEVEN AI                                            │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐          │
│  │ Voice        │ │ Placement    │ │ Exam         │          │
│  │ Practice     │ │ Test         │ │ Simulation   │          │
│  │ [Start]      │ │ [Take Test]  │ │ [Start Sim]  │          │
│  └──────────────┘ └──────────────┘ └──────────────┘          │
│                                                                │
│  Last AI session: Jan 5 | Score: B+ | Suggested: More        │
│  practice on hypothetical scenarios                           │
│                                                                │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  RECOMMENDED COACHES                                          │
│  Based on your goal: Oral C                                   │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                    │
│  │ Coach A  │  │ Coach B  │  │ Coach C  │                    │
│  │ Oral C   │  │ Oral C   │  │ Anxiety  │                    │
│  │ [View]   │  │ [View]   │  │ [View]   │                    │
│  └──────────┘  └──────────┘  └──────────┘                    │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

---

## Mobile-First Responsive Breakpoints

| Breakpoint | Width | Layout Adjustments |
|------------|-------|-------------------|
| Mobile | < 640px | Single column, bottom nav, stacked cards |
| Tablet | 640-1024px | Two columns, side nav collapsed |
| Desktop | > 1024px | Full layout, side nav expanded |

---

## Navigation Structure

### Public Navigation
- Logo (→ Home)
- Find a Coach (→ /coaches)
- Prof Steven AI (→ /ai-coach)
- How It Works (→ /how-it-works)
- Become a Coach (→ /become-a-coach)
- Login / Sign Up

### Learner Navigation (Authenticated)
- Dashboard
- My Sessions
- AI Practice
- Messages
- Progress
- Settings

### Coach Navigation (Authenticated)
- Dashboard
- Calendar
- Sessions
- Students
- Messages
- Earnings
- Profile
- Settings

### Admin Navigation (Authenticated)
- Dashboard
- Coaches
- Learners
- Sessions
- Transactions
- Reviews
- Content
- Settings

---

## Bilingual Support (EN/FR)

All pages will be available in both English and French:
- URL structure: /en/... and /fr/...
- Language toggle in header
- User preference saved in profile
- Default based on browser language

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-01-07 | Manus AI | Initial UX architecture |
