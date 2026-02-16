# RusingAcademy Ecosystem — Operations Runbook

> Last updated: Sprint J4 (Wave J — Revenue & Reliability)

---

## Table of Contents

1. [Database Migrations](#1-database-migrations)
2. [Rollback Procedures](#2-rollback-procedures)
3. [Backup & Restore](#3-backup--restore)
4. [Stripe Webhook Operations](#4-stripe-webhook-operations)
5. [Health Checks](#5-health-checks)
6. [Emergency Procedures](#6-emergency-procedures)

---

## 1. Database Migrations

### Overview

The ecosystem uses **Drizzle ORM** with **Drizzle Kit** for schema management. All migrations are stored in `/drizzle/*.sql` with a journal at `/drizzle/meta/_journal.json`.

### Running Migrations

```bash
# Standard migration (generates SQL + applies with pre-backup)
pnpm db:migrate

# Generate migration files only (review before applying)
pnpm db:migrate -- --generate-only

# Dry run (shows what would be done without executing)
pnpm db:migrate -- --dry-run

# Skip pre-migration backup (faster, use only in dev)
pnpm db:migrate -- --no-backup
```

### Migration Workflow

1. **Edit schema** in `drizzle/schema.ts`
2. **Generate migration**: `pnpm db:generate` (creates SQL file in `/drizzle/`)
3. **Review the generated SQL** in `/drizzle/XXXX_*.sql`
4. **Apply migration**: `pnpm db:migrate`
5. **Validate**: `pnpm db:validate`

### Schema Validation

```bash
# Validate schema consistency (journal vs SQL files)
pnpm db:validate
```

This checks:
- All journal entries have corresponding SQL files
- No duplicate migration indices
- Schema snapshot consistency

### Adding a New Table

1. Define the table in `drizzle/schema.ts` using Drizzle's `mysqlTable()`
2. Export the type: `export type MyTable = typeof myTable.$inferSelect;`
3. Run `pnpm db:generate` to create the migration SQL
4. Review the generated SQL
5. Run `pnpm db:migrate` to apply

### Modifying an Existing Table

1. Edit the table definition in `drizzle/schema.ts`
2. Run `pnpm db:generate`
3. **Carefully review** the generated ALTER TABLE statements
4. If the migration includes data loss (dropping columns), add a manual backup step
5. Run `pnpm db:migrate`

---

## 2. Rollback Procedures

### Automatic Rollback

The migration script creates a pre-migration backup by default. If a migration fails:

1. The script logs the failure and exits
2. Use the backup to restore:

```bash
# Restore from the most recent backup
pnpm db:restore
```

### Manual Rollback

If you need to manually undo a migration:

1. **Identify the migration** in `/drizzle/meta/_journal.json`
2. **Write a reverse SQL** (e.g., if migration added a column, write `ALTER TABLE ... DROP COLUMN ...`)
3. **Apply the reverse SQL** directly:

```bash
# Connect to the database
mysql -h <host> -u <user> -p <database> < rollback.sql
```

4. **Remove the migration entry** from `_journal.json`
5. **Delete the migration SQL file** from `/drizzle/`

### Rollback Checklist

| Step | Action | Verification |
|------|--------|-------------|
| 1 | Stop the application | `pm2 stop all` or Railway pause |
| 2 | Create a fresh backup | `pnpm db:backup` |
| 3 | Apply rollback SQL | Check for errors in output |
| 4 | Update journal | Verify entry count matches SQL files |
| 5 | Restart application | `pm2 restart all` or Railway redeploy |
| 6 | Verify health | `curl /api/health` returns OK |

---

## 3. Backup & Restore

### Creating Backups

```bash
# Create a timestamped backup
pnpm db:backup

# Backups are stored in /backups/ directory
```

### Restoring from Backup

```bash
# Restore from the most recent backup
pnpm db:restore

# Restore from a specific backup file
pnpm db:restore -- --file backups/backup-2026-02-15T120000.sql
```

### Backup Schedule (Production)

- **Automated daily backups** via Railway cron or external service
- **Pre-migration backups** automatically created by `pnpm db:migrate`
- **Manual backups** before any risky operation

---

## 4. Stripe Webhook Operations

### Webhook Event Types Handled

| Event | Handler | Description |
|-------|---------|-------------|
| `checkout.session.completed` | `handleCheckoutCompleted` | Routes to course, path, or coaching purchase |
| `payment_intent.succeeded` | Logged | Payment confirmation |
| `charge.refunded` | `handleRefund` | Records refund in ledger |
| `account.updated` | `handleAccountUpdated` | Coach Connect account status |
| `customer.subscription.created` | `handleSubscriptionCreated` | New subscription |
| `customer.subscription.updated` | `handleSubscriptionUpdated` | Subscription change |
| `customer.subscription.deleted` | `handleSubscriptionDeleted` | Cancellation/churn |
| `invoice.payment_succeeded` | `handleInvoicePaymentSucceeded` | Renewal payment |
| `invoice.payment_failed` | `handleInvoicePaymentFailed` | Failed renewal |

### Idempotency

All webhook events are tracked in `webhook_events_log` table:
- **First delivery**: Claimed and processed
- **Duplicate delivery**: Skipped automatically
- **Failed events**: Retried up to 3 times
- **Table auto-created** on first use via `ensureWebhookEventsTable()`

### Viewing Webhook Status (Admin)

Navigate to **Admin Control Center → Stability** to view:
- Total events processed
- Failed events count
- Recent event log with status

### Manual Retry

If a webhook event is stuck in `failed` status:

```sql
-- Reset a specific event for retry
UPDATE webhook_events_log 
SET status = 'failed', attempts = 0 
WHERE stripeEventId = 'evt_xxx';
```

Then trigger a re-delivery from the Stripe Dashboard.

---

## 5. Health Checks

### Application Health

```bash
# Basic health check
curl https://www.rusingacademy.ca/api/health

# Expected response:
# { "status": "ok", "db": "connected", "stripe": "configured" }
```

### Database Health

```bash
# Validate schema consistency
pnpm db:validate
```

### Stripe Health

Check the Stripe Dashboard → Developers → Webhooks for:
- Delivery success rate (should be > 99%)
- Average response time (should be < 5s)
- Failed deliveries (investigate immediately)

---

## 6. Emergency Procedures

### Application Crash

1. Check Railway logs: `railway logs --latest`
2. Check for recent deployments that may have caused the issue
3. If caused by a bad deploy, rollback to previous deployment in Railway
4. If caused by a database issue, check DB connectivity and run health check

### Database Connection Failure

1. Verify `DATABASE_URL` environment variable is set correctly
2. Check TiDB Cloud dashboard for cluster status
3. If cluster is paused, resume it from the TiDB Cloud console
4. Check connection pool limits (max connections)

### Stripe Payment Failure

1. Check Stripe Dashboard → Payments for the specific payment
2. Verify webhook delivery in Stripe Dashboard → Developers → Webhooks
3. Check `webhook_events_log` table for processing status
4. If webhook was not delivered, manually trigger re-delivery from Stripe

### Coach Payout Failure

1. Check admin payout dashboard for error details
2. Verify coach's Stripe Connect account status
3. Check Stripe Dashboard → Connect → Accounts for the coach
4. If account is restricted, coach needs to complete onboarding
5. Retry payout from admin dashboard once issue is resolved

### Data Loss Recovery

1. **Stop all writes** immediately (pause the application)
2. **Identify the scope** of data loss
3. **Restore from backup**: `pnpm db:restore`
4. **Verify data integrity**: `pnpm db:validate`
5. **Resume application** and monitor closely
