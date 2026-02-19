# RusingAcademy — Getting Started

## Prerequisites

- **Node.js** 22.x or later
- **pnpm** 9.x or later
- **MySQL** 8.x or TiDB (for local development)
- **Git**

## Installation

```bash
# Clone the repository
git clone https://github.com/RusingAcademy/RusingAcademy-Ecosystem-Main-Repo.git
cd RusingAcademy-Ecosystem-Main-Repo

# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env
# Edit .env with your values (see Configuration section)

# Run database migrations
mysql -u root -p your_database < drizzle/migrations/phase2_realtime_communication.sql
mysql -u root -p your_database < drizzle/migrations/phase3_coach_experience.sql
mysql -u root -p your_database < drizzle/migrations/phase4_hr_admin.sql
mysql -u root -p your_database < drizzle/migrations/phase5_optimizations.sql

# Start development server
pnpm dev
```

## Configuration

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | MySQL/TiDB connection string | `mysql://user:pass@localhost:3306/rusingacademy` |
| `JWT_SECRET` | Secret for JWT signing | Random 64-char string |
| `OPENAI_API_KEY` | OpenAI API key for AI features | `sk-...` |
| `STRIPE_SECRET_KEY` | Stripe secret key | `sk_test_...` |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret | `whsec_...` |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `3000` |
| `WEBSOCKET_ENABLED` | Enable WebSocket server | `false` |
| `WEBSOCKET_CORS_ORIGIN` | Allowed WebSocket origins | `http://localhost:3000` |
| `VAPID_PUBLIC_KEY` | Push notification public key | — |
| `VAPID_PRIVATE_KEY` | Push notification private key | — |
| `CALENDLY_CLIENT_ID` | Calendly OAuth client ID | — |
| `DAILY_API_KEY` | Daily.co API key for video | — |

## Development

```bash
# Start dev server (frontend + backend)
pnpm dev

# Build for production
pnpm build

# Type check
pnpm tsc --noEmit

# Database schema push
pnpm drizzle-kit push
```

## Project Structure

```
├── client/                 # Frontend (React)
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── i18n/           # Translations (EN/FR)
│   │   ├── lib/            # Utilities
│   │   ├── pages/          # Route pages
│   │   └── services/       # Client-side services
│   └── public/             # Static assets
├── server/                 # Backend (Express + tRPC)
│   ├── _core/              # Server entry point
│   ├── middleware/          # Express middleware
│   ├── routers/            # tRPC routers
│   ├── services/           # Business logic
│   ├── webhooks/           # Webhook handlers
│   └── websocket.ts        # WebSocket server
├── drizzle/                # Database
│   ├── schema.ts           # Drizzle ORM schema
│   └── migrations/         # SQL migration files
├── docs/                   # Documentation
└── .github/workflows/      # CI/CD pipelines
```

## Useful Commands

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Build for production |
| `pnpm start` | Start production server |
| `pnpm tsc --noEmit` | Type check |
| `pnpm drizzle-kit push` | Push schema to database |
| `pnpm drizzle-kit generate` | Generate migration |
