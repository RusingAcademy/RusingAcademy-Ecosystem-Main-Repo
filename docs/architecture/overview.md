# RusingAcademy Ecosystem — Architecture Overview

## System Architecture

RusingAcademy is a **full-stack monolithic application** built with a modern TypeScript stack, deployed on Railway with TiDB (MySQL-compatible) as the database layer.

### Technology Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Frontend | React + TypeScript | 18.x |
| Styling | Tailwind CSS v4 + shadcn/ui | 4.x |
| Routing | Wouter | 3.x |
| State | TanStack React Query + tRPC | 5.x / 11.x |
| Backend | Express.js + tRPC | 4.x / 11.x |
| Database | TiDB (MySQL-compatible) via Drizzle ORM | — |
| Real-time | Socket.io WebSocket | 4.x |
| Auth | JWT (jose) + HTTP-only cookies | — |
| Payments | Stripe + Stripe Connect | — |
| AI | OpenAI GPT + MiniMax TTS | — |
| Deployment | Railway (Docker) | — |
| CI/CD | GitHub Actions | — |

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    CLIENT (React SPA)                    │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │
│  │  Admin   │ │  Coach   │ │ Learner  │ │    HR    │  │
│  │  Portal  │ │  Portal  │ │  Portal  │ │  Portal  │  │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘  │
│       └─────────────┼───────────┼─────────────┘        │
│                     │ tRPC      │ WebSocket             │
└─────────────────────┼───────────┼───────────────────────┘
                      │           │
┌─────────────────────┼───────────┼───────────────────────┐
│                 SERVER (Express.js)                       │
│  ┌──────────────────┴───────────┴──────────────────┐    │
│  │              tRPC Router (appRouter)              │    │
│  │  40+ sub-routers: auth, courses, sessions,       │    │
│  │  stripe, admin, coach, hr, chat, notifications,  │    │
│  │  ai, video, analytics, featureFlags, monitoring  │    │
│  └──────────────────┬──────────────────────────────┘    │
│  ┌──────────────────┴──────────────────────────────┐    │
│  │              Services Layer                       │    │
│  │  Stripe, Calendly, Video (Daily.co), AI,         │    │
│  │  Chat, Notifications, Progress Sync,             │    │
│  │  Feature Flags, Monitoring, PDF Reports          │    │
│  └──────────────────┬──────────────────────────────┘    │
│  ┌──────────────────┴──────────────────────────────┐    │
│  │         Middleware (Security, Auth, RBAC)         │    │
│  │  Helmet, CORS, Rate Limiting, JWT Verification   │    │
│  └──────────────────────────────────────────────────┘    │
└─────────────────────┬───────────────────────────────────┘
                      │
┌─────────────────────┴───────────────────────────────────┐
│                   TiDB (MySQL-compatible)                 │
│  50+ tables: users, courses, lessons, sessions,          │
│  payments, notifications, chatRooms, chatMessages,       │
│  featureFlags, coachProfiles, hrEmployees, etc.          │
└─────────────────────────────────────────────────────────┘
```

### Portal Architecture (KAJABI-style)

The ecosystem implements 4 distinct portals, each with its own layout, navigation, and RBAC:

| Portal | Route Prefix | Roles | Key Features |
|--------|-------------|-------|--------------|
| Admin | `/admin/*` | superadmin, admin | Full ecosystem control, analytics, user management, feature flags |
| Coach | `/coach/*` | coach | Dashboard, sessions, earnings, Calendly, video rooms |
| Learner | `/learn/*` | learner | Courses, progress tracking, flashcards, chat |
| HR | `/hr/*` | hr_manager | Employee management, reports, budget forecasting |

### Real-time Architecture

WebSocket (Socket.io) provides real-time communication:

| Event | Direction | Description |
|-------|-----------|-------------|
| `chat:message` | Bidirectional | Chat messages in rooms |
| `chat:typing` | Client → Server | Typing indicators |
| `progress:sync` | Bidirectional | Lesson progress sync |
| `notification:new` | Server → Client | Push notifications |
| `session:update` | Server → Client | Session status changes |

### Security Model

- **Authentication**: JWT tokens in HTTP-only cookies (jose library)
- **Authorization**: Role-based access control (RBAC) with 5 roles
- **API Security**: Helmet, CORS, rate limiting, input sanitization
- **Payments**: Stripe webhook signature verification
- **WebSocket**: JWT authentication on connection

### Environment Variables

See `.env.example` for the complete list of 35+ configuration variables.
