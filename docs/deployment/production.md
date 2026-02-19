# RusingAcademy — Production Deployment Guide

## Infrastructure

| Component | Service | Details |
|-----------|---------|---------|
| Application | Railway | Docker-based, 2 replicas, us-west2 |
| Database | TiDB Cloud | MySQL-compatible, serverless |
| DNS | GoDaddy | rusingacademy.com, rusingacademy.ca |
| Payments | Stripe | Live + Connect for coaches |
| SSL | Railway (auto) | Let's Encrypt, auto-renewal |
| CI/CD | GitHub Actions | 3 workflows (ci, staging, production) |

## Railway Configuration

### Services

| Service | Branch | Purpose |
|---------|--------|---------|
| Production | `main` | Live site at www.rusingacademy.com |
| Staging | `main` (or feature branch) | Pre-production validation |

### Environment Variables (Production)

```env
# Core
NODE_ENV=production
PORT=3000
DATABASE_URL=mysql://...@gateway.tidbcloud.com:4000/rusingacademy?ssl=true

# Authentication
JWT_SECRET=<strong-random-secret>
COOKIE_SECRET=<strong-random-secret>

# OpenAI
OPENAI_API_KEY=sk-...

# MiniMax TTS
MINIMAX_API_KEY=eyJ...

# Stripe
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_CONNECT_WEBHOOK_SECRET=whsec_...

# WebSocket
WEBSOCKET_ENABLED=true
WEBSOCKET_CORS_ORIGIN=https://www.rusingacademy.com

# Push Notifications (VAPID)
VAPID_PUBLIC_KEY=BDV0...
VAPID_PRIVATE_KEY=Kr96...
VAPID_SUBJECT=mailto:admin@rusingacademy.com

# Calendly (when enabled)
CALENDLY_CLIENT_ID=...
CALENDLY_CLIENT_SECRET=...

# Daily.co Video (when enabled)
DAILY_API_KEY=...
```

## Deployment Workflow

### Standard Deployment (Feature → Staging → Production)

```
1. Create feature branch from main
2. Implement changes, commit, push
3. Create Pull Request on GitHub
4. CI workflow runs (build + lint)
5. Switch Railway Staging to feature branch
6. Validate on staging URL
7. Merge PR to main via GitHub
8. Railway auto-deploys production from main
9. Run production smoke tests
10. Switch staging back to main
```

### Emergency Hotfix

```
1. Create hotfix branch from main
2. Fix the issue, commit, push
3. Deploy hotfix branch to staging
4. Validate fix on staging
5. Merge to main (fast-forward)
6. Verify production deployment
```

## Smoke Test Checklist

After every production deployment:

- [ ] Homepage loads (HTTP 200)
- [ ] API health check passes (`/api/health`)
- [ ] WebSocket endpoint responds (`/ws/`)
- [ ] Login page accessible (`/login`)
- [ ] Admin dashboard accessible (`/admin`)
- [ ] Stripe webhook responds (`/api/stripe/webhook`)
- [ ] SSL certificate valid
- [ ] No console errors in browser

## Database Migrations

Migrations are stored in `drizzle/migrations/` and must be run manually:

```bash
# Connect to TiDB and run migration
mysql -h gateway.tidbcloud.com -P 4000 -u user -p database < drizzle/migrations/phase2_realtime_communication.sql
```

### Migration Files

| File | Phase | Tables |
|------|-------|--------|
| `phase2_realtime_communication.sql` | 2 | chatRooms, chatRoomMembers, chatMessages, progressSyncQueue, progressSnapshots |
| `phase3_coach_experience.sql` | 3 | sessionRecordings, sessionFeedback, coachCalendlyIntegrations |
| `phase4_hr_admin.sql` | 4 | featureFlags, systemMetrics, errorLogs, generatedReports |
| `phase5_optimizations.sql` | 5 | budgetForecasts |

## Rollback Strategy

1. **Code Rollback**: Revert the merge commit on `main`, Railway auto-deploys
2. **Database Rollback**: Each migration has a corresponding `-- DOWN` section
3. **Feature Flag Rollback**: Disable features via admin panel without code changes

## Monitoring

- **Health Endpoint**: `GET /api/health` — returns DB latency, Stripe status, memory usage
- **Admin Dashboard**: `/admin/monitoring` — system metrics, error logs, performance data
- **Railway Logs**: Real-time via Railway dashboard
- **GitHub Actions**: CI/CD pipeline status
