# Observability Guide

> **RusingAcademy Ecosystem — Monitoring, Logging, and Metrics**
>
> Version 1.0 | Sprint Y1-W1-S03 | February 2026

---

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Structured Logging](#structured-logging)
4. [Request Metrics](#request-metrics)
5. [Error Tracking](#error-tracking)
6. [Health Checks](#health-checks)
7. [Admin Dashboard Integration](#admin-dashboard-integration)
8. [Alerting](#alerting)
9. [Future Enhancements](#future-enhancements)

---

## Overview

The RusingAcademy observability stack provides three pillars of operational visibility:

1. **Structured Logging** — Pino-based JSON logs with correlation IDs for request tracing
2. **Request Metrics** — In-memory collection of response times, error rates, and latency percentiles per route
3. **Error Tracking** — Centralized error capture with full request context and stack traces

All components are built on the existing Pino logger (186 usage points across the server) and require zero external services to function. External integrations (Sentry, Grafana Cloud, Datadog) can be added incrementally.

### Design Principles

- **Zero external dependencies** for core functionality (works on Railway out of the box)
- **Additive, not replacement** — builds on existing Pino logger, health checks, and admin notifications
- **Production-safe** — no sensitive data in logs, bounded memory usage, no performance impact
- **Admin-accessible** — metrics available via tRPC for the admin dashboard

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Express Server                        │
│                                                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ correlationId│→ │requestLogger │→ │  App Routes  │  │
│  │  middleware   │  │  middleware   │  │  (tRPC, etc) │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
│         │                 │                    │         │
│         │                 ▼                    │         │
│         │          ┌──────────────┐            │         │
│         │          │ Metrics Store│            │         │
│         │          │  (in-memory) │            │         │
│         │          └──────┬───────┘            │         │
│         │                 │                    │         │
│         ▼                 ▼                    ▼         │
│  ┌──────────────────────────────────────────────────┐   │
│  │              Pino Logger (JSON)                   │   │
│  │  → stdout (Railway captures automatically)        │   │
│  └──────────────────────────────────────────────────┘   │
│                                                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ /api/metrics │  │ /api/health  │  │ Admin tRPC   │  │
│  │  (REST)      │  │  (REST)      │  │ metrics.*    │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
```

---

## Structured Logging

### Logger Usage

```typescript
import { createLogger } from "../logger";
const log = createLogger("my-module");

// Info level — normal operations
log.info({ userId: 123, action: "login" }, "User logged in");

// Warn level — recoverable issues
log.warn({ attempt: 3, maxAttempts: 5 }, "Rate limit approaching");

// Error level — failures requiring attention
log.error({ err, reqId: "abc-123" }, "Payment processing failed");
```

### Log Format

In production (`NODE_ENV=production`), logs are structured JSON:

```json
{
  "level": "info",
  "time": "2026-02-15T14:30:00.000Z",
  "module": "observability",
  "reqId": "550e8400-e29b-41d4-a716-446655440000",
  "method": "GET",
  "path": "/api/courses",
  "statusCode": 200,
  "durationMs": 45.23,
  "msg": "request_complete"
}
```

### Correlation IDs

Every request receives a unique `X-Request-Id` header (UUID v4). This ID is:
- Attached to all log entries for that request
- Returned in the response headers
- Propagated to downstream services if applicable

To trace a specific request across logs:
```bash
# In Railway logs
railway logs | grep "550e8400-e29b-41d4-a716-446655440000"
```

---

## Request Metrics

### What's Collected

For every HTTP request, the observability middleware records:

| Metric | Description |
|--------|-------------|
| Request count | Total requests per route |
| Error count | Requests with status >= 400 |
| Error rate | Percentage of failed requests |
| Average latency | Mean response time in ms |
| P50 latency | Median response time |
| P95 latency | 95th percentile response time |
| P99 latency | 99th percentile response time |
| Max latency | Worst-case response time |

### Route Normalization

Dynamic path segments are normalized for aggregation:
- `/api/users/123` → `/api/users/:id`
- `/api/courses/550e8400-e29b-41d4-a716-446655440000` → `/api/courses/:uuid`

### Accessing Metrics

**REST endpoint** (admin-protected):
```
GET /api/metrics
```

**tRPC** (admin dashboard):
```typescript
const snapshot = await trpc.metrics.getSnapshot.query();
const health = await trpc.metrics.healthSummary.query();
```

### Memory Bounds

- Latency samples are bounded to 1,000 per route (FIFO)
- Only the top 50 routes are returned in snapshots
- Metrics reset on each deployment (stateless by design)

---

## Error Tracking

### Global Error Handler

The `errorHandler` middleware captures all unhandled Express errors:

```typescript
// Automatically captures:
// - Error name, message, and stack trace
// - Request method, path, and correlation ID
// - Response status code

// In production: stack traces are NOT sent to clients
// In development: full error details are returned
```

### Error Log Format

```json
{
  "level": "error",
  "time": "2026-02-15T14:30:00.000Z",
  "module": "observability",
  "reqId": "550e8400-e29b-41d4-a716-446655440000",
  "method": "POST",
  "path": "/api/trpc/courses.create",
  "error": {
    "name": "TRPCError",
    "message": "Course title is required"
  },
  "msg": "unhandled_error"
}
```

### Future: Sentry Integration

When ready to add Sentry for error tracking with alerting:

1. Install: `npm install @sentry/node`
2. Add `SENTRY_DSN` to Railway environment variables
3. Initialize in `server/_core/index.ts` before other middleware
4. The correlation ID will be attached as a Sentry tag for cross-referencing

---

## Health Checks

### Existing Health Check System

The ecosystem already has a comprehensive health check system:

- **Cron-based** (`server/cron/health-checks.ts`): Runs hourly, checks webhook failures, AI scores, pipeline health
- **tRPC endpoint** (`system.health`): Returns `{ ok: true }` for load balancer checks
- **Admin notifications**: Alerts via email when health checks fail

### Enhanced Health Endpoint

The `/api/metrics` REST endpoint provides deeper health information:

```json
{
  "uptime": { "hours": 24.5, "since": "2026-02-14T14:00:00Z" },
  "totals": { "requests": 15420, "errors": 23, "errorRate": "0.15%" },
  "system": {
    "memory": { "heapUsedMB": 128.5, "rssMB": 256.3 },
    "nodeVersion": "v22.13.0"
  }
}
```

---

## Admin Dashboard Integration

The metrics router exposes three tRPC procedures for the admin dashboard:

| Procedure | Access | Description |
|-----------|--------|-------------|
| `metrics.getSnapshot` | Admin | Current metrics with per-route breakdown |
| `metrics.healthSummary` | Admin | Metrics + system info (memory, CPU, Node version) |
| `metrics.reset` | Admin | Reset all counters (post-deployment cleanup) |

### Dashboard Widget Example

```tsx
// In admin dashboard component
const { data } = trpc.metrics.healthSummary.useQuery();

return (
  <div>
    <h3>System Health</h3>
    <p>Uptime: {data?.uptime.hours}h</p>
    <p>Error Rate: {data?.totals.errorRate}</p>
    <p>Memory: {data?.system.memory.heapUsedMB}MB</p>
  </div>
);
```

---

## Alerting

### Current Alerting

The existing `adminNotifications` service handles alerts for:
- Webhook failures
- Low AI scores
- New coach signups
- System health degradation

### Enhanced Alerting (via Observability)

The observability middleware adds structured data that enables:

1. **Error rate spike detection**: Monitor `totals.errorRate` — alert if > 5%
2. **Latency degradation**: Monitor P95 latency — alert if > 2000ms
3. **Memory pressure**: Monitor `system.memory.heapUsedMB` — alert if > 80% of available

These can be implemented as additional health check rules in the existing cron system.

---

## Future Enhancements

### Phase 2: External Integrations (Planned for Y1-W3)

| Service | Purpose | Priority |
|---------|---------|----------|
| Sentry | Error tracking with stack traces, releases, and alerting | P1 |
| Grafana Cloud | Metrics visualization and dashboards | P2 |
| Railway Metrics | Native Railway observability (when available) | P2 |
| Uptime Robot | External uptime monitoring | P1 |

### Phase 3: Advanced Observability (Planned for Y2)

| Feature | Description |
|---------|-------------|
| OpenTelemetry | Distributed tracing across services |
| Custom dashboards | Real-time metrics in admin panel |
| Log aggregation | Centralized log search and analysis |
| APM | Application performance monitoring with flame graphs |
