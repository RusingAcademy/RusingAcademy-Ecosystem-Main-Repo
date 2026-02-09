# Staging Environment Configuration

## Overview
The current Manus webdev project (`ecosystemhub-preview`) **IS** the staging environment.
- **Staging URL**: Available via Manus Preview panel (dev server on port 3000)
- **Database**: Shared TiDB instance (same as dev — isolated from any external production)
- **S3 Storage**: Manus-managed S3 bucket (files.manuscdn.com)
- **Auth**: Manus OAuth (VITE_APP_ID, OAUTH_SERVER_URL)

## Isolation from Production
- **Production** = www.rusingacademy.com (Kajabi) — completely separate platform
- **Staging** = ecosystemhub-preview on Manus — isolated database, isolated codebase
- No shared database, no shared auth, no shared assets between prod and staging

## Staging Environment Variables
All environment variables are managed via `webdev_request_secrets` and injected automatically:
- DATABASE_URL (TiDB)
- JWT_SECRET
- STRIPE_SECRET_KEY / VITE_STRIPE_PUBLISHABLE_KEY / STRIPE_WEBHOOK_SECRET
- BUNNY_CDN_URL / BUNNY_STORAGE_* / BUNNY_STREAM_*
- GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET
- MICROSOFT_CLIENT_ID / MICROSOFT_CLIENT_SECRET
- CALENDLY_API_KEY
- All VITE_* frontend env vars

## Rollback Plan
1. **Database**: Restore from `/home/ubuntu/backup_pre_rescue_2026-02-09T03-53-30.sql`
2. **Code**: `git checkout pre-rescue-20260208` or `webdev_rollback_checkpoint`
3. **Assets**: All 311 S3 assets are platform-managed and persist; manifest at `/home/ubuntu/backup-assets-pre-rescue/asset-manifest.json`

## Staging Validation Checklist
- [ ] Dev server starts without critical errors
- [ ] Homepage loads (HTTP 200)
- [ ] Auth flow works (login/logout)
- [ ] Admin panel accessible
- [ ] Course Builder loads
- [ ] Learner portal loads
- [ ] Database queries succeed
