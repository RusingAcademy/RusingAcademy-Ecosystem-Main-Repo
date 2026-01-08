# Lingueefy Technical Architecture

**Version:** 1.0  
**Date:** January 7, 2026  
**Stack:** React 19 + Tailwind 4 + Express 4 + tRPC 11 + MySQL

---

## Technology Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| Frontend | React 19, Tailwind CSS 4, shadcn/ui | Modern responsive UI |
| State Management | TanStack Query + tRPC | Type-safe data fetching |
| Backend | Express 4, tRPC 11 | API layer with end-to-end types |
| Database | MySQL (TiDB) | Relational data storage |
| ORM | Drizzle ORM | Type-safe database queries |
| Authentication | Manus OAuth | User authentication |
| File Storage | S3 | Coach videos, documents |
| AI Integration | OpenAI API (via Manus) | Prof Steven AI features |
| Real-time | Socket.io (future) | Messaging, notifications |
| Payments | Stripe Connect (future) | Marketplace payments |

---

## Database Schema Overview

### Core Tables

```
users
├── id (PK)
├── openId (unique, OAuth)
├── name
├── email
├── role (learner | coach | admin)
├── createdAt
└── updatedAt

coach_profiles
├── id (PK)
├── userId (FK → users)
├── slug (unique, URL-friendly)
├── headline
├── bio
├── videoUrl
├── languages (French | English | Both)
├── specializations (JSON: oral_a, oral_b, oral_c, written, reading, anxiety)
├── hourlyRate
├── trialRate
├── successRate
├── totalSessions
├── responseTime
├── status (pending | approved | suspended)
├── createdAt
└── updatedAt

learner_profiles
├── id (PK)
├── userId (FK → users)
├── department
├── currentLevel (JSON: reading, writing, oral)
├── targetLevel (JSON: reading, writing, oral)
├── examDate
├── learningGoals
├── preferredLanguage (French | English)
├── createdAt
└── updatedAt

availability
├── id (PK)
├── coachId (FK → coach_profiles)
├── dayOfWeek (0-6)
├── startTime
├── endTime
├── timezone
└── isActive

sessions
├── id (PK)
├── coachId (FK → coach_profiles)
├── learnerId (FK → learner_profiles)
├── scheduledAt
├── duration (minutes)
├── type (trial | single | package)
├── status (pending | confirmed | completed | cancelled)
├── price
├── notes
├── coachNotes
├── meetingUrl
├── createdAt
└── updatedAt

reviews
├── id (PK)
├── sessionId (FK → sessions)
├── learnerId (FK → learner_profiles)
├── coachId (FK → coach_profiles)
├── rating (1-5)
├── comment
├── sleAchievement (optional: level achieved)
├── createdAt
└── updatedAt

messages
├── id (PK)
├── conversationId
├── senderId (FK → users)
├── receiverId (FK → users)
├── content
├── readAt
├── createdAt

ai_sessions
├── id (PK)
├── learnerId (FK → learner_profiles)
├── type (practice | placement | simulation)
├── language (French | English)
├── targetLevel (A | B | C)
├── transcript (JSON)
├── score
├── feedback (JSON)
├── duration (seconds)
├── createdAt

packages
├── id (PK)
├── learnerId (FK → learner_profiles)
├── coachId (FK → coach_profiles)
├── sessionsTotal
├── sessionsUsed
├── priceTotal
├── expiresAt
├── createdAt
```

---

## API Structure (tRPC Routers)

```
appRouter
├── auth
│   ├── me
│   └── logout
│
├── coaches
│   ├── list (public - browse coaches)
│   ├── getBySlug (public - coach profile)
│   ├── getFeatured (public - homepage)
│   ├── apply (protected - submit application)
│   ├── updateProfile (protected - coach only)
│   ├── updateAvailability (protected - coach only)
│   └── getMyProfile (protected - coach only)
│
├── learners
│   ├── createProfile (protected)
│   ├── updateProfile (protected)
│   ├── getMyProfile (protected)
│   └── getProgress (protected)
│
├── sessions
│   ├── book (protected - learner)
│   ├── confirm (protected - coach)
│   ├── cancel (protected)
│   ├── complete (protected - coach)
│   ├── getUpcoming (protected)
│   ├── getPast (protected)
│   └── getById (protected)
│
├── reviews
│   ├── create (protected - learner)
│   ├── getByCoach (public)
│   └── getByLearner (protected)
│
├── messages
│   ├── getConversations (protected)
│   ├── getMessages (protected)
│   └── send (protected)
│
├── ai
│   ├── startPractice (protected)
│   ├── startPlacement (protected)
│   ├── startSimulation (protected)
│   ├── sendMessage (protected)
│   ├── endSession (protected)
│   └── getHistory (protected)
│
├── admin
│   ├── getCoachApplications (admin only)
│   ├── approveCoach (admin only)
│   ├── rejectCoach (admin only)
│   ├── getMetrics (admin only)
│   └── getUsers (admin only)
│
└── system
    └── notifyOwner
```

---

## Frontend Routes

```
Public Routes
├── / (Homepage)
├── /coaches (Browse coaches)
├── /coaches/:slug (Coach profile)
├── /ai-coach (Prof Steven AI landing)
├── /how-it-works
├── /become-a-coach
├── /pricing
├── /about
├── /contact
├── /login
└── /register

Learner Routes (Protected)
├── /dashboard
├── /dashboard/sessions
├── /dashboard/sessions/:id
├── /dashboard/coaches
├── /dashboard/ai-practice
├── /dashboard/progress
├── /dashboard/messages
├── /dashboard/billing
└── /dashboard/settings

Coach Routes (Protected)
├── /coach
├── /coach/calendar
├── /coach/sessions
├── /coach/sessions/:id
├── /coach/students
├── /coach/earnings
├── /coach/profile
├── /coach/reviews
└── /coach/settings

Admin Routes (Protected)
├── /admin
├── /admin/coaches
├── /admin/learners
├── /admin/sessions
├── /admin/transactions
└── /admin/settings
```

---

## Prof Steven AI Architecture

### Integration Flow

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Learner   │────▶│   tRPC API  │────▶│  OpenAI API │
│   Browser   │◀────│   Server    │◀────│  (via Manus)│
└─────────────┘     └─────────────┘     └─────────────┘
       │                   │
       │                   ▼
       │            ┌─────────────┐
       │            │  Database   │
       │            │ (sessions,  │
       │            │  feedback)  │
       │            └─────────────┘
       │
       ▼
┌─────────────┐
│ Web Speech  │
│     API     │
└─────────────┘
```

### AI Session Types

| Type | Purpose | Duration | Output |
|------|---------|----------|--------|
| Practice | Conversational practice | 5-30 min | Transcript, corrections |
| Placement | Level assessment | 15-20 min | SLE level estimate |
| Simulation | Mock SLE exam | 20-30 min | Score, detailed feedback |

### System Prompts

**Practice Mode:**
```
You are Prof Steven, a bilingual language coach specializing in Canadian 
federal public service second language preparation. You are conducting a 
practice conversation in [French/English] at the [A/B/C] level.

Adapt your language complexity to the target level:
- Level A: Simple sentences, basic vocabulary, clear pronunciation
- Level B: Moderate complexity, workplace vocabulary, some idioms
- Level C: Complex structures, nuanced vocabulary, hypothetical scenarios

Provide gentle corrections and encouragement. Focus on federal workplace 
scenarios: briefings, meetings, emails, presentations.
```

**Placement Mode:**
```
You are Prof Steven conducting an SLE placement assessment. Your goal is 
to determine the learner's current level (A, B, or C) in [oral/written] 
[French/English].

Start with B-level questions. Adjust difficulty based on responses:
- If struggling, move to A-level
- If comfortable, move to C-level

Ask 8-10 questions covering:
- Self-introduction and work description
- Opinion on workplace topics
- Hypothetical scenarios (for C-level)
- Complex reasoning (for C-level)

At the end, provide a level assessment with justification.
```

**Simulation Mode:**
```
You are Prof Steven administering a mock SLE Oral Interaction exam at 
level [A/B/C] in [French/English].

Follow the official SLE format:
1. Warm-up questions (2-3 min)
2. Main interaction based on workplace scenario (15-20 min)
3. Wrap-up

For Level C, include:
- Abstract topics requiring opinion and justification
- Hypothetical situations
- Complex grammatical structures

Score on: Comprehension, Expression, Vocabulary, Grammar, Fluency
Provide detailed feedback at the end.
```

---

## Design System

### Color Palette (Canadian Government Inspired)

```css
:root {
  /* Primary - Deep Blue (Government) */
  --primary: oklch(0.45 0.15 250);
  --primary-foreground: oklch(0.98 0 0);
  
  /* Secondary - Maple Red */
  --secondary: oklch(0.55 0.2 25);
  --secondary-foreground: oklch(0.98 0 0);
  
  /* Accent - Gold */
  --accent: oklch(0.75 0.15 85);
  --accent-foreground: oklch(0.2 0 0);
  
  /* Backgrounds */
  --background: oklch(0.99 0 0);
  --foreground: oklch(0.15 0 0);
  
  /* Cards */
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.15 0 0);
  
  /* Muted */
  --muted: oklch(0.96 0 0);
  --muted-foreground: oklch(0.45 0 0);
  
  /* Success - Green */
  --success: oklch(0.65 0.2 145);
  
  /* Warning - Amber */
  --warning: oklch(0.75 0.15 70);
  
  /* Destructive - Red */
  --destructive: oklch(0.55 0.25 25);
}
```

### Typography

- **Headings:** Inter (clean, professional)
- **Body:** Inter (readable, modern)
- **Monospace:** JetBrains Mono (code, transcripts)

### Component Patterns

| Component | Usage |
|-----------|-------|
| Card | Coach cards, session cards, stats |
| Badge | SLE levels, status indicators |
| Avatar | User photos, coach photos |
| Calendar | Availability, booking |
| Dialog | Booking confirmation, reviews |
| Tabs | Dashboard sections |
| Progress | SLE progress tracking |

---

## Security Considerations

| Concern | Mitigation |
|---------|------------|
| Authentication | Manus OAuth with JWT sessions |
| Authorization | Role-based access (learner, coach, admin) |
| Data Privacy | User data scoped to own account |
| Payment Security | Stripe handles all payment data |
| API Security | tRPC procedures with context validation |
| File Uploads | S3 with signed URLs, type validation |

---

## Performance Targets

| Metric | Target |
|--------|--------|
| First Contentful Paint | < 1.5s |
| Time to Interactive | < 3s |
| Lighthouse Score | > 90 |
| API Response Time | < 200ms |
| Database Query Time | < 50ms |

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-01-07 | Manus AI | Initial technical architecture |
