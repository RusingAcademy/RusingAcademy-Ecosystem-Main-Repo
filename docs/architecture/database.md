# RusingAcademy — Database Schema

## Overview

The database uses **TiDB** (MySQL-compatible) with **Drizzle ORM** for type-safe queries. The schema is defined in `drizzle/schema.ts` and contains 50+ tables.

## Core Tables

### Users & Authentication

| Table | Description | Key Columns |
|-------|-------------|-------------|
| `users` | All platform users | id, email, password, role, firstName, lastName, language |
| `userProfiles` | Extended profile data | userId, bio, avatar, timezone |
| `passwordResets` | Password reset tokens | userId, token, expiresAt |

### Courses & Learning

| Table | Description | Key Columns |
|-------|-------------|-------------|
| `courses` | Course catalog | id, title, description, price, status, language |
| `modules` | Course modules | id, courseId, title, order |
| `lessons` | Individual lessons | id, moduleId, title, content, type, duration |
| `lessonProgress` | Learner progress | userId, lessonId, progress, completedAt, lastSyncAt |
| `enrollments` | Course enrollments | userId, courseId, enrolledAt, status |
| `certificates` | Completion certificates | userId, courseId, issuedAt |

### Coaching & Sessions

| Table | Description | Key Columns |
|-------|-------------|-------------|
| `coachProfiles` | Coach details | userId, specialization, hourlyRate, stripeConnectId |
| `sessions` | Coaching sessions | id, coachId, learnerId, scheduledAt, status, type |
| `sessionRecordings` | Video recordings | sessionId, recordingUrl, duration |
| `sessionFeedback` | Post-session feedback | sessionId, rating, comment, fromUserId |
| `coachCalendlyIntegrations` | Calendly OAuth | coachId, accessToken, refreshToken |

### Payments

| Table | Description | Key Columns |
|-------|-------------|-------------|
| `payments` | Payment records | id, userId, amount, currency, stripePaymentId, status |
| `subscriptions` | Active subscriptions | userId, stripeSubscriptionId, plan, status |
| `invoices` | Generated invoices | id, userId, amount, paidAt |

### Communication (Phase 2)

| Table | Description | Key Columns |
|-------|-------------|-------------|
| `chatRooms` | Chat rooms | id, name, type (direct/group/coaching), createdBy |
| `chatRoomMembers` | Room membership | roomId, userId, role, joinedAt |
| `chatMessages` | Chat messages | id, roomId, senderId, content, type, sentAt |
| `notifications` | User notifications | id, userId, type, title, message, read |
| `pushSubscriptions` | Web push subs | userId, endpoint, p256dh, auth |
| `progressSyncQueue` | Offline sync queue | id, userId, lessonId, data, syncedAt |
| `progressSnapshots` | Daily snapshots | id, userId, courseId, snapshot, createdAt |

### HR & Admin (Phase 4)

| Table | Description | Key Columns |
|-------|-------------|-------------|
| `featureFlags` | Feature toggles | id, key, enabled, description, roles |
| `systemMetrics` | Performance metrics | id, metric, value, timestamp |
| `errorLogs` | Error tracking | id, level, message, stack, userId, timestamp |
| `generatedReports` | PDF reports | id, type, generatedBy, filePath, createdAt |

### Optimization (Phase 5)

| Table | Description | Key Columns |
|-------|-------------|-------------|
| `budgetForecasts` | HR budget forecasts | id, period, category, amount, createdBy |

## Entity Relationship Diagram

```
users ──┬── enrollments ──── courses ──── modules ──── lessons
        │                                                  │
        ├── lessonProgress ────────────────────────────────┘
        │
        ├── coachProfiles ──── sessions ──┬── sessionRecordings
        │                                 └── sessionFeedback
        │
        ├── payments
        ├── subscriptions
        │
        ├── chatRoomMembers ──── chatRooms
        ├── chatMessages
        │
        ├── notifications
        ├── pushSubscriptions
        │
        └── userProfiles
```

## Indexes

Key indexes for performance:

- `users.email` — Unique index for login
- `lessonProgress.(userId, lessonId)` — Composite for progress lookup
- `sessions.(coachId, scheduledAt)` — Coach schedule queries
- `chatMessages.(roomId, sentAt)` — Message pagination
- `notifications.(userId, read)` — Unread notification count
- `featureFlags.key` — Unique index for flag lookup

## Migration Strategy

Migrations are stored as SQL files in `drizzle/migrations/` and run manually against TiDB. Each migration is idempotent (uses `CREATE TABLE IF NOT EXISTS`).
