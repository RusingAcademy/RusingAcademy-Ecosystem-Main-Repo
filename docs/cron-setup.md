# Cron Job Setup Guide

This document describes how to configure cron jobs for the Lingueefy platform.

## Available Cron Endpoints

### 1. Weekly Progress Reports
- **Endpoint**: `POST /api/cron/weekly-reports`
- **Schedule**: Sunday and Monday at 9 AM ET
- **Cron expressions**:
  - Sunday: `0 9 * * 0` (America/Toronto)
  - Monday: `0 9 * * 1` (America/Toronto)

### 2. Outcome Reminders (NEW)
- **Endpoint**: `POST /api/cron/outcome-reminders`
- **Schedule**: Daily at 9 AM ET
- **Cron expression**: `0 9 * * *` (America/Toronto)
- **Purpose**: Sends reminder emails to organizers for meetings that have ended but don't have an outcome recorded yet.

### 3. Outcome Reminder Summary
- **Endpoint**: `GET /api/cron/outcome-reminders/summary`
- **Purpose**: Returns a summary of pending outcomes for dashboard display.

## Authentication

All cron endpoints require Bearer token authentication using the `CRON_SECRET` environment variable.

```bash
curl -X POST https://your-domain.com/api/cron/outcome-reminders \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

## Setting Up Cron Jobs

### Option 1: Vercel Cron (Recommended for Vercel deployments)

Add to `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/cron/weekly-reports",
      "schedule": "0 9 * * 0,1"
    },
    {
      "path": "/api/cron/outcome-reminders",
      "schedule": "0 9 * * *"
    }
  ]
}
```

### Option 2: External Cron Service (cron-job.org, EasyCron, etc.)

1. Create a new cron job with the following settings:
   - **URL**: `https://your-domain.com/api/cron/outcome-reminders`
   - **Method**: POST
   - **Headers**: `Authorization: Bearer YOUR_CRON_SECRET`
   - **Schedule**: Daily at 9:00 AM (your timezone)

### Option 3: Railway Cron

Add a cron service in your Railway project:

```yaml
# railway.yaml
services:
  cron:
    build:
      builder: nixpacks
    cron:
      - schedule: "0 9 * * *"
        command: "curl -X POST -H 'Authorization: Bearer $CRON_SECRET' $RAILWAY_PUBLIC_DOMAIN/api/cron/outcome-reminders"
```

### Option 4: GitHub Actions

Create `.github/workflows/cron.yml`:

```yaml
name: Daily Cron Jobs

on:
  schedule:
    - cron: '0 14 * * *'  # 9 AM ET = 2 PM UTC

jobs:
  outcome-reminders:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger Outcome Reminders
        run: |
          curl -X POST \
            -H "Authorization: Bearer ${{ secrets.CRON_SECRET }}" \
            https://your-domain.com/api/cron/outcome-reminders
```

## Testing Cron Jobs

You can manually trigger cron jobs for testing:

```bash
# Test outcome reminders
curl -X POST https://your-domain.com/api/cron/outcome-reminders \
  -H "Authorization: Bearer YOUR_CRON_SECRET"

# Check pending outcomes summary
curl https://your-domain.com/api/cron/outcome-reminders/summary \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

## Response Format

### Outcome Reminders Response

```json
{
  "processed": 5,
  "sent": 4,
  "failed": 1,
  "meetings": [
    { "id": 1, "title": "Discovery Call", "sent": true },
    { "id": 2, "title": "Demo Meeting", "sent": true }
  ]
}
```

### Summary Response

```json
{
  "pendingCount": 5,
  "oldestPending": "2026-01-05T10:00:00.000Z",
  "byOrganizer": [
    { "name": "John Doe", "email": "john@example.com", "count": 3 },
    { "name": "Jane Smith", "email": "jane@example.com", "count": 2 }
  ]
}
```

## Environment Variables

Ensure these environment variables are set:

| Variable | Description | Required |
|----------|-------------|----------|
| `CRON_SECRET` | Secret token for authenticating cron requests | Yes |
| `VITE_APP_URL` | Base URL for email links | Yes |

## Monitoring

Monitor cron job execution through:
1. Server logs (look for `[Cron]` or `[Outcome Reminder Cron]` prefixes)
2. Email delivery logs
3. Database records (check `sequence_email_logs` table)
