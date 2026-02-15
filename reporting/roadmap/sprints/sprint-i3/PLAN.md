# Sprint I3: Production Hardening

## Scope
Add Docker containerization, Railway deployment configuration, and clean build infrastructure.

## Deliverables
1. **Dockerfile** — Multi-stage build (deps → build → production) with Node 22 Alpine, non-root user, health check
2. **docker-compose.yml** — Local development stack with MySQL 8 (TiDB-compatible) and health checks
3. **.dockerignore** — Clean build context excluding node_modules, .git, tests, docs, audit files
4. **railway.toml** — Explicit Railway deployment configuration with nixpacks builder, health check path, restart policy

## Pre-existing Infrastructure (No Changes Needed)
- SEO: Full Open Graph, Twitter Cards, structured data (Organization + WebSite), bilingual meta tags
- Health checks: Automated hourly health check scheduler
- CI/CD: 3 GitHub workflows (ci.yml, deploy-staging.yml, deploy-production.yml)
- .env.example: Comprehensive environment variable documentation
