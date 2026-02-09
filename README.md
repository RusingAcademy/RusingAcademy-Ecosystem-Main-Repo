# RusingÂcademy Learning Ecosystem

> Canada's premier bilingual training platform for public servants preparing for SLE (Second Language Evaluation) exams.

[![CI](https://github.com/RusingAcademy/rusingacademy-ecosystem/actions/workflows/ci.yml/badge.svg)](https://github.com/RusingAcademy/rusingacademy-ecosystem/actions/workflows/ci.yml)

---

## 🏗️ Architecture

This is a full-stack TypeScript monorepo with three integrated products:

| Pillar | Description | Routes |
|--------|-------------|--------|
| **RusingÂcademy** | Bilingual LMS with crash courses (6 Path Series™) | `/rusingacademy/*`, `/courses/*` |
| **Lingueefy** | Hybrid human + AI coaching platform | `/lingueefy/*`, `/coaches/*` |
| **Barholex Media** | EdTech consulting studio | `/barholex-media/*` |

### Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19 · TypeScript · TailwindCSS 4 · Vite |
| **Backend** | Express 4 · tRPC 11 · Node.js 20 |
| **Database** | TiDB (MySQL-compatible) · Drizzle ORM |
| **Auth** | JWT · Google OAuth · Microsoft OAuth |
| **Payments** | Stripe (subscriptions + one-time) |
| **Storage** | AWS S3 · Bunny CDN |
| **AI** | OpenAI API · MiniMax TTS |
| **Hosting** | Railway |

### Directory Structure

```
rusingacademy-ecosystem/
├── client/                  # React frontend
│   └── src/
│       ├── components/      # Shared UI components
│       ├── contexts/        # React contexts (auth, theme, etc.)
│       ├── hooks/           # Custom React hooks
│       ├── lib/             # Utilities, tRPC client setup
│       ├── pages/           # Route-level page components
│       │   ├── admin/       # Admin dashboard (35 pages)
│       │   ├── barholex/    # Barholex Media pages
│       │   ├── dashboard/   # Learner dashboard
│       │   ├── portal/      # User portal
│       │   └── rusingacademy/ # Main LMS pages
│       ├── routes/          # React Router configuration
│       ├── services/        # Client-side API service layer
│       └── styles/          # Global styles, Tailwind config
├── server/                  # Express + tRPC backend
│   ├── _core/               # Server bootstrap, middleware, DB connection
│   ├── cron/                # Scheduled jobs (streaks, notifications)
│   ├── jobs/                # Background job definitions
│   ├── routers/             # tRPC routers (30+)
│   ├── routes/              # Express routes (webhooks, health)
│   ├── services/            # Business logic services (27)
│   ├── stripe/              # Stripe integration layer
│   └── webhooks/            # Webhook handlers (Stripe, etc.)
├── shared/                  # Shared types and constants
│   ├── _core/               # Core shared utilities
│   ├── types.ts             # Shared TypeScript types
│   ├── pricing.ts           # Pricing configuration
│   └── const.ts             # Shared constants
├── drizzle/                 # Database migrations (54 migrations)
├── docs/                    # Documentation
│   └── archive/             # Migrated docs from predecessor repo
├── .github/workflows/       # CI/CD pipelines
└── .env.example             # Environment variable template
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 20+ (LTS)
- **pnpm** 9+ (`npm install -g pnpm`)
- **TiDB** or **MySQL 8+** database
- **Stripe** account (test mode for development)
- **AWS S3** bucket + credentials
- **Google Cloud** OAuth credentials
- **Microsoft Azure** OAuth credentials

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/RusingAcademy/rusingacademy-ecosystem.git
cd rusingacademy-ecosystem

# 2. Install dependencies
pnpm install

# 3. Configure environment
cp .env.example .env
# Edit .env with your credentials (see Environment Variables below)

# 4. Run database migrations
pnpm run db:migrate

# 5. (Optional) Seed development data
pnpm run db:seed

# 6. Start development server
pnpm run dev
```

The app will be available at `http://localhost:5173` (Vite dev server) with the API at `http://localhost:3000`.

### Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm run dev` | Start both client (Vite) and server (Express) in dev mode |
| `pnpm run build` | Production build (client + server) |
| `pnpm run start` | Start production server |
| `pnpm run typecheck` | Run TypeScript type checking |
| `pnpm run lint` | Run ESLint across the codebase |
| `pnpm run lint:fix` | Auto-fix ESLint issues |
| `pnpm run format` | Format code with Prettier |
| `pnpm run test` | Run test suite (Vitest) |
| `pnpm run db:migrate` | Apply pending Drizzle migrations |
| `pnpm run db:generate` | Generate migration from schema changes |
| `pnpm run db:studio` | Open Drizzle Studio (database GUI) |

---

## 🔐 Environment Variables

Copy `.env.example` to `.env` and fill in your values. See `.env.example` for descriptions of each variable.

**Critical variables:**
- `DATABASE_URL` — TiDB/MySQL connection string
- `JWT_SECRET` — Secret for signing auth tokens (min 64 chars)
- `STRIPE_SECRET_KEY` — Stripe API secret key
- `STRIPE_WEBHOOK_SECRET` — Stripe webhook endpoint secret
- `VITE_STRIPE_PUBLISHABLE_KEY` — Stripe public key (exposed to client)

---

## 🧪 Testing

Tests are in `*.test.ts` and `*.test.tsx` files alongside source code. Run with:

```bash
pnpm run test              # Run all tests
pnpm run test -- --watch   # Watch mode
pnpm run test -- --coverage # Coverage report
```

Current: 96 test files. Target: 70%+ server service coverage.

---

## 📦 Deployment

### Production (Railway)

Deployments are automated via GitHub Actions on push to `main`:

1. CI runs quality checks (lint, typecheck, test)
2. Build is verified
3. Railway CLI deploys the service
4. Post-deploy health check validates the deployment

### Manual Deploy

```bash
railway up --service rusingacademy-production
```

### Environment Setup

| Environment | Branch | URL |
|-------------|--------|-----|
| Production | `main` | `https://rusingacademy.ca` |
| Staging | `develop` | `https://staging.rusingacademy.ca` (planned) |

---

## 🗄️ Database

The database uses **Drizzle ORM** with **TiDB** (MySQL-compatible, horizontally scalable).

- **147 tables** across 11 domains: Core, Learning, Coaching, SLE, Gamification, CRM, Community, Payments, Admin, Organizations, Content, Notifications
- **54 migrations** tracked in `drizzle/`

```bash
pnpm run db:studio    # Visual database browser
pnpm run db:generate  # Generate migration from schema changes
pnpm run db:migrate   # Apply migrations
```

---

## 🌿 Branch Strategy

| Branch | Purpose |
|--------|---------|
| `main` | Production-ready code. Protected. Deploys automatically. |
| `develop` | Integration branch for next release. |
| `feature/*` | New features. Branch from `develop`, merge via PR. |
| `fix/*` | Bug fixes. Branch from `main` for hotfixes. |

**Rules:**
- Never push directly to `main` — always use Pull Requests
- All PRs require passing CI (typecheck + tests + build)
- Delete branches after merge

---

## 📚 Documentation

Additional documentation is available in `/docs`:

- `docs/archive/` — Historical documentation migrated from predecessor repository
- `docs/archive/AUDIT_REPORT_FEB2026.md` — Feb 2026 technical audit
- `docs/archive/RAPPORT_FINAL_HANDOFF.md` — Developer handoff report
- `docs/archive/WORKFLOW-MANUS-GITHUB-RAILWAY.md` — Deployment workflow

---

## 🏢 About

**RusingÂcademy Learning Ecosystem** is a product of **Rusinga International Consulting Ltd.**

- Website: [rusingacademy.ca](https://rusingacademy.ca)
- Contact: [info@rusingacademy.ca](mailto:info@rusingacademy.ca)
- Location: Ottawa, Ontario, Canada

© 2026 Rusinga International Consulting Ltd. All rights reserved.
