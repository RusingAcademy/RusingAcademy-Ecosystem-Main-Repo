# RusingAcademy — tRPC API Reference

## Overview

The API is built with **tRPC v11** and exposes 40+ sub-routers through a single `appRouter`. All procedures use Zod for input validation and return typed responses.

## Authentication

All authenticated procedures require a valid JWT in an HTTP-only cookie (`session`). The middleware extracts the user and attaches it to the tRPC context.

```typescript
// Authenticated procedure
const protectedProcedure = t.procedure.use(authMiddleware);
// Admin-only procedure
const adminProcedure = protectedProcedure.use(requireRole('admin'));
```

## Core Routers

### `auth`
| Procedure | Type | Auth | Description |
|-----------|------|------|-------------|
| `auth.register` | Mutation | No | Register new user |
| `auth.login` | Mutation | No | Login with email/password |
| `auth.logout` | Mutation | Yes | Logout and clear session |
| `auth.me` | Query | Yes | Get current user profile |
| `auth.forgotPassword` | Mutation | No | Send password reset email |
| `auth.resetPassword` | Mutation | No | Reset password with token |

### `users`
| Procedure | Type | Auth | Description |
|-----------|------|------|-------------|
| `users.list` | Query | Admin | List all users with pagination |
| `users.getById` | Query | Admin | Get user by ID |
| `users.update` | Mutation | Admin | Update user profile |
| `users.updateRole` | Mutation | Admin | Change user role |
| `users.delete` | Mutation | Admin | Soft-delete user |

### `courses`
| Procedure | Type | Auth | Description |
|-----------|------|------|-------------|
| `courses.list` | Query | No | List published courses |
| `courses.getById` | Query | No | Get course details |
| `courses.create` | Mutation | Admin | Create new course |
| `courses.update` | Mutation | Admin | Update course |
| `courses.publish` | Mutation | Admin | Publish/unpublish course |
| `courses.enroll` | Mutation | Yes | Enroll in a course |

### `lessons`
| Procedure | Type | Auth | Description |
|-----------|------|------|-------------|
| `lessons.getByModule` | Query | Yes | Get lessons for a module |
| `lessons.getById` | Query | Yes | Get lesson content |
| `lessons.complete` | Mutation | Yes | Mark lesson as complete |
| `lessons.updateProgress` | Mutation | Yes | Update lesson progress |

### `sessions` (Coaching)
| Procedure | Type | Auth | Description |
|-----------|------|------|-------------|
| `sessions.list` | Query | Yes | List user's sessions |
| `sessions.book` | Mutation | Yes | Book a coaching session |
| `sessions.cancel` | Mutation | Yes | Cancel a session |
| `sessions.reschedule` | Mutation | Yes | Reschedule a session |

### `stripe`
| Procedure | Type | Auth | Description |
|-----------|------|------|-------------|
| `stripe.createCheckout` | Mutation | Yes | Create Stripe checkout |
| `stripe.getSubscription` | Query | Yes | Get subscription status |
| `stripe.cancelSubscription` | Mutation | Yes | Cancel subscription |
| `stripe.createConnectAccount` | Mutation | Coach | Create Connect account |
| `stripe.getConnectStatus` | Query | Coach | Get Connect onboarding status |

## Phase 2 Routers

### `chatRooms`
| Procedure | Type | Auth | Description |
|-----------|------|------|-------------|
| `chatRooms.list` | Query | Yes | List user's chat rooms |
| `chatRooms.create` | Mutation | Yes | Create a chat room |
| `chatRooms.getMessages` | Query | Yes | Get room messages |
| `chatRooms.sendMessage` | Mutation | Yes | Send a message |

### `progressSync`
| Procedure | Type | Auth | Description |
|-----------|------|------|-------------|
| `progressSync.sync` | Mutation | Yes | Sync offline progress |
| `progressSync.getSnapshot` | Query | Yes | Get progress snapshot |

## Phase 3 Routers

### `video`
| Procedure | Type | Auth | Description |
|-----------|------|------|-------------|
| `video.createRoom` | Mutation | Coach | Create Daily.co room |
| `video.getToken` | Query | Yes | Get room access token |
| `video.endSession` | Mutation | Coach | End video session |

### `coachAnalytics`
| Procedure | Type | Auth | Description |
|-----------|------|------|-------------|
| `coachAnalytics.getDashboard` | Query | Coach | Get dashboard metrics |
| `coachAnalytics.getEarnings` | Query | Coach | Get earnings breakdown |
| `coachAnalytics.getStudentProgress` | Query | Coach | Get student analytics |

### `calendlyIntegration`
| Procedure | Type | Auth | Description |
|-----------|------|------|-------------|
| `calendlyIntegration.connect` | Mutation | Coach | Connect Calendly account |
| `calendlyIntegration.disconnect` | Mutation | Coach | Disconnect Calendly |
| `calendlyIntegration.getStatus` | Query | Coach | Get integration status |

## Phase 4 Routers

### `featureFlags`
| Procedure | Type | Auth | Description |
|-----------|------|------|-------------|
| `featureFlags.list` | Query | Admin | List all feature flags |
| `featureFlags.toggle` | Mutation | Admin | Toggle a feature flag |
| `featureFlags.create` | Mutation | Admin | Create a feature flag |
| `featureFlags.isEnabled` | Query | Yes | Check if flag is enabled |

### `adminMonitoring`
| Procedure | Type | Auth | Description |
|-----------|------|------|-------------|
| `adminMonitoring.getMetrics` | Query | Admin | Get system metrics |
| `adminMonitoring.getErrors` | Query | Admin | Get recent errors |
| `adminMonitoring.getPerformance` | Query | Admin | Get performance data |

### `hrReports`
| Procedure | Type | Auth | Description |
|-----------|------|------|-------------|
| `hrReports.generate` | Mutation | HR | Generate PDF report |
| `hrReports.list` | Query | HR | List generated reports |

## Phase 5 Routers

### `aiCompanion`
| Procedure | Type | Auth | Description |
|-----------|------|------|-------------|
| `aiCompanion.chat` | Mutation | Yes | Chat with AI companion |
| `aiCompanion.getSuggestions` | Query | Yes | Get learning suggestions |

### `earnings`
| Procedure | Type | Auth | Description |
|-----------|------|------|-------------|
| `earnings.getDashboard` | Query | Coach | Get earnings dashboard |
| `earnings.requestPayout` | Mutation | Coach | Request payout |

### `budgetForecast`
| Procedure | Type | Auth | Description |
|-----------|------|------|-------------|
| `budgetForecast.generate` | Mutation | HR | Generate budget forecast |
| `budgetForecast.list` | Query | HR | List forecasts |

## Webhook Endpoints

| Endpoint | Method | Source | Description |
|----------|--------|--------|-------------|
| `/api/stripe/webhook` | POST | Stripe | Payment events |
| `/api/webhooks/stripe-connect` | POST | Stripe Connect | Account updates |
| `/api/webhooks/calendly` | POST | Calendly | Booking events |

## WebSocket Events

| Event | Direction | Payload | Description |
|-------|-----------|---------|-------------|
| `chat:join` | C→S | `{ roomId }` | Join a chat room |
| `chat:leave` | C→S | `{ roomId }` | Leave a chat room |
| `chat:message` | Bidirectional | `{ roomId, content, type }` | Send/receive message |
| `chat:typing` | C→S | `{ roomId, isTyping }` | Typing indicator |
| `progress:sync` | C→S | `{ lessonId, progress }` | Sync progress |
| `progress:updated` | S→C | `{ lessonId, progress }` | Progress confirmation |
| `notification:new` | S→C | `{ id, title, message }` | New notification |
