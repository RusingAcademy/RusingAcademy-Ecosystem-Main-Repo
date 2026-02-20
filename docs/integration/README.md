# RusingAcademy Ecosystem — Integration Documentation

## Architecture Overview

The RusingAcademy Ecosystem is a unified platform composed of **4 interconnected applications** sharing a single TiDB database, unified authentication, and cross-portal navigation.

```
┌──────────────────────────────────────────────────────────────┐
│                    RusingAcademy Ecosystem                    │
├──────────────┬──────────────┬──────────────┬────────────────┤
│ Admin Control│  Learning    │  Community   │    Sales       │
│   Center     │   Portal     │    Hub       │  Dashboard     │
│  (main app)  │ apps/learner │ apps/commun. │  apps/sales    │
│  Port 5000   │  Port 3001   │  Port 3002   │  Port 3003     │
├──────────────┴──────────────┴──────────────┴────────────────┤
│                   Shared TiDB Database                       │
│                   Shared Auth (JWT)                           │
│                   Shared Stripe Integration                   │
└──────────────────────────────────────────────────────────────┘
```

## Application Matrix

| App | Directory | Port | Stack | Role |
|-----|-----------|------|-------|------|
| **Admin Control Center** | `/` (root) | 5000 | React + TypeScript + tRPC + Drizzle + TiDB | Owner/Admin management |
| **Learning Portal** | `/apps/learner-portal` | 3001 | React + TypeScript + tRPC + Drizzle + TiDB | Learner dashboard |
| **Community Hub** | `/apps/community` | 3002 | React + TypeScript + tRPC + Drizzle + TiDB | Social learning community |
| **Sales Dashboard** | `/apps/sales` | 3003 | React + TypeScript + tRPC + Drizzle + TiDB | Sales analytics |

## Environment Variables

All 4 apps share the same environment variables:

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | TiDB connection string |
| `SESSION_SECRET` | Yes | JWT signing secret |
| `STRIPE_SECRET_KEY` | Yes | Stripe API key |
| `OWNER_OPEN_ID` | Yes | Owner identification |
| `PORT` | No | Server port (defaults vary per app) |

## Development Commands

```bash
# Install all dependencies (root + workspaces)
pnpm install

# Start individual apps
pnpm dev:portal      # Learning Portal on :3001
pnpm dev:community   # Community Hub on :3002
pnpm dev:sales       # Sales Dashboard on :3003
pnpm dev             # Admin Control Center on :5000

# Build individual apps
pnpm build:portal
pnpm build:community
pnpm build:sales
pnpm build           # Admin Control Center
```

## Deployment Strategy (Railway)

Each app is deployed as a **separate Railway service** with its own Dockerfile:

| Service | Dockerfile | Subdomain |
|---------|-----------|-----------|
| Admin Control Center | `Dockerfile` (root) | `www.rusing.academy` |
| Learning Portal | `apps/learner-portal/Dockerfile` | `portal.rusing.academy` |
| Community Hub | `apps/community/Dockerfile` | `community.rusing.academy` |
| Sales Dashboard | `apps/sales/Dockerfile` | `sales.rusing.academy` |

### Railway Configuration

Each service needs:
1. Same `DATABASE_URL` (shared TiDB)
2. Same `SESSION_SECRET` (shared auth)
3. Same `STRIPE_SECRET_KEY`
4. Unique `PORT` per service

## Cross-Portal Navigation

### From Admin Control Center
The admin sidebar includes an **ECOSYSTEM** section with 3 buttons:
- **Learning Portal** → Opens portal subdomain
- **Community Hub** → Opens community subdomain
- **Sales Dashboard** → Opens sales subdomain

URLs are configured in: `client/src/lib/ecosystem-urls.ts`

### From Each App
Each app's sidebar includes ecosystem links back to:
- Admin Control Center
- Other portals
- Main site (rusingacademy.com)

## Design System

All portals follow the **Learning Portal design reference**:
- Background: Clean white/crème (#F5F0E8)
- Accent: Teal (#008090)
- Cards: White with subtle borders, rounded-xl
- Charts: Recharts library, teal bars
- Calendar: Interactive month view widget
- Progress: Donut ring components
- Typography: Playfair Display for headings
- High contrast for dashboards
- Desktop-first landscape layout

## RBAC (Role-Based Access Control)

| Role | Admin Control Center | Learning Portal | Community Hub | Sales Dashboard |
|------|---------------------|-----------------|---------------|-----------------|
| **owner** | Full access (all 50+ sidebar items) | Full access | Full access | Full access |
| **admin** | Full access | Full access | Full access | Full access |
| **coach** | Coach portal only | Read-only | Full access | No access |
| **learner** | No access | Full access | Full access | No access |

### Key Implementation Details
- 124 inline role checks in `server/routers.ts` include both `admin` and `owner`
- `adminProcedure` in `server/_core/trpc.ts` checks `role === 'admin' || role === 'owner' || isOwner`
- Permissions endpoint at `/api/auth-rbac/permissions` returns full permission set for owner

## SSO Gap (Known Limitation)

Currently, each app maintains its own session. A future SSO implementation will:
1. Share JWT tokens across subdomains via `.rusing.academy` cookie domain
2. Implement token refresh across apps
3. Add single sign-out capability

## File Structure

```
RusingAcademy-Ecosystem-Main-Repo/
├── apps/
│   ├── learner-portal/     # Learning Portal app
│   │   ├── client/         # React frontend
│   │   ├── server/         # Express + tRPC backend
│   │   ├── drizzle/        # DB schema
│   │   ├── Dockerfile      # Railway deployment
│   │   └── package.json
│   ├── community/          # Community Hub app
│   │   ├── client/
│   │   ├── server/
│   │   ├── drizzle/
│   │   ├── Dockerfile
│   │   └── package.json
│   └── sales/              # Sales Dashboard app
│       ├── client/
│       ├── server/
│       ├── drizzle/
│       ├── Dockerfile
│       └── package.json
├── client/                 # Admin Control Center frontend
├── server/                 # Admin Control Center backend
├── drizzle/                # Shared DB schema
├── docs/
│   └── integration/        # This documentation
├── pnpm-workspace.yaml     # Workspace config
└── package.json            # Root package.json with workspace scripts
```

## Changelog

| Date | Phase | Description |
|------|-------|-------------|
| 2026-02-19 | Phase 1 | Apps merged under /apps/* with pnpm workspace |
| 2026-02-19 | Phase 2 | Build/dev/start scripts added |
| 2026-02-19 | Phase 3 | Dockerfiles + ecosystem URLs config |
| 2026-02-19 | Phase 4 | ECOSYSTEM section in Admin sidebar |
| 2026-02-19 | Phase 5 | Cross-navigation links in all app sidebars |
| 2026-02-19 | Phase 6 | Coach Dashboard redesigned (LP mirror) |
| 2026-02-19 | Phase 7 | RBAC regression tests — PASS |
| 2026-02-19 | Phase 8 | Integration documentation |
