# Cron Job Setup Guide

This document describes the scheduled tasks (cron jobs) used by the EcosystemHub platform.

## Endpoints

### `/api/cron/outcome-reminders`

**Schedule:** Daily at 9 AM ET  
**Purpose:** Sends automated outcome reminder emails to learners with upcoming sessions or pending evaluations.  
**Authentication:** Requires `CRON_SECRET` header for authorization.

### `/api/cron/lead-score-recalc`

**Schedule:** Every 6 hours  
**Purpose:** Recalculates lead scores based on recent activity, engagement metrics, and conversion signals.  
**Authentication:** Requires `CRON_SECRET` header for authorization.

## Deployment Options

### Vercel Cron

Configure cron jobs in `vercel.json`:

```json
{
  "crons": [
    { "path": "/api/cron/outcome-reminders", "schedule": "0 9 * * *" },
    { "path": "/api/cron/lead-score-recalc", "schedule": "0 */6 * * *" }
  ]
}
```

### External Cron Service

Use services like cron-job.org, EasyCron, or Upstash to trigger the endpoints on schedule.

### Railway Cron

Railway supports cron jobs natively. Add a cron service in your Railway project configuration.

### GitHub Actions

Create a workflow file at `.github/workflows/cron-jobs.yml` to trigger endpoints on a schedule:

```yaml
name: Scheduled Jobs
on:
  schedule:
    - cron: '0 9 * * *'
jobs:
  outcome-reminders:
    runs-on: ubuntu-latest
    steps:
      - run: curl -H "Authorization: Bearer ${{ secrets.CRON_SECRET }}" ${{ secrets.APP_URL }}/api/cron/outcome-reminders
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `CRON_SECRET` | Shared secret for authenticating cron requests |
| `APP_URL` | Base URL of the deployed application |
