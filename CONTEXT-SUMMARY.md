# RusingÂcademy Ecosystem - Context Summary

## 🎯 Production Environment

| Item | Value |
|------|-------|
| **Production URL** | https://www.rusingacademy.ca |
| **Hosting Platform** | Railway (NOT Vercel) |
| **Deployment Branch** | `railway-deployment` |
| **Auto-Deploy** | Yes, on push to `railway-deployment` |
| **DNS Provider** | GoDaddy |
| **SSL** | Let's Encrypt via Railway |

## 📦 Pipeline: DEV → PROD

```
Manus (dev) → GitHub (main) → Merge to railway-deployment → Railway (auto-deploy) → Production
```

## 🔀 Domain Redirections (301)

| Source | Destination |
|--------|-------------|
| rusingacademy.com | https://www.rusingacademy.ca |
| lingueefy.ca/com | https://www.rusingacademy.ca/lingueefy |
| barholex.ca/com | https://www.rusingacademy.ca/barholex-media |

## ✅ What's Working

- Railway deployment stable
- Email/password auth (OAuth disabled)
- SMTP configured
- Stripe configured (webhook pending)
- RBAC system with 5 roles, 87 permissions
- Owner account: steven.barholere@rusingacademy.ca
- All domain redirections working (301)
- SEO: sitemap.xml, robots.txt, canonical tags

## ⚠️ Known Issues (From Reports)

1. **Dashboard vide** - Users may see blank dashboard
2. **HR Dashboard** - Not visible/accessible in some deployments
3. **Assets lourds** - Large images/videos affecting performance
4. **Manus S3 Publish** - Heartbeat timeout (platform issue, using Railway instead)

## 🎯 P0 Tasks Required

1. **Dashboard Routing RBAC**:
   - `/dashboard` → redirect based on role
   - `/dashboard/admin` → Admin Dashboard
   - `/dashboard/hr` → HR Dashboard
   - `/dashboard/coach` → Coach Dashboard
   - `/dashboard/learner` → Learner Dashboard

2. **Role Switcher** - Owner can switch between all dashboards

3. **No Empty Screens** - All dashboards must show content (KPIs, tables, empty states)

4. **Deploy to Railway** - Push to `railway-deployment` branch

## 📋 Definition of Done

User can:
1. Login at https://www.rusingacademy.ca/login
2. Navigate to `/dashboard/admin` → see content
3. Navigate to `/dashboard/hr` → see content
4. Navigate to `/dashboard/coach` → see content
5. Navigate to `/dashboard/learner` → see content

## 🚀 Deployment Steps

1. Develop in Manus
2. `git push origin main`
3. Merge/cherry-pick to `railway-deployment`
4. Railway auto-deploys
5. Verify on https://www.rusingacademy.ca
