# =============================================================================
# RusingÂcademy Ecosystem — Production Dockerfile
# Multi-stage build for optimal image size and security
# =============================================================================

# ---------------------------------------------------------------------------
# Stage 1: Dependencies
# ---------------------------------------------------------------------------
FROM node:22-alpine AS deps

WORKDIR /app

# Copy package files and patches
COPY package.json pnpm-lock.yaml ./
COPY patches/ ./patches/

# Install pnpm and dependencies
RUN corepack enable && corepack prepare pnpm@10.4.1 --activate
RUN pnpm install --frozen-lockfile --prod=false

# ---------------------------------------------------------------------------
# Stage 2: Build
# ---------------------------------------------------------------------------
FROM node:22-alpine AS builder

WORKDIR /app

# Copy dependencies from previous stage
COPY --from=deps /app/node_modules ./node_modules

# Cache-bust: invalidate Docker layer cache when source changes
ARG CACHEBUST=1771459377
COPY . .

# Build the application (Vite frontend + esbuild backend)
RUN corepack enable && corepack prepare pnpm@10.4.1 --activate
RUN pnpm run build

# ---------------------------------------------------------------------------
# Stage 3: Production
# ---------------------------------------------------------------------------
FROM node:22-alpine AS runner

WORKDIR /app

# Security: run as non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 rusingacademy

# Install production dependencies only
COPY package.json pnpm-lock.yaml ./
COPY patches/ ./patches/
RUN corepack enable && corepack prepare pnpm@10.4.1 --activate && \
    pnpm install --frozen-lockfile --prod && \
    pnpm store prune

# Copy built artifacts
COPY --from=builder /app/dist ./dist

# Copy static assets and data files
COPY --from=builder /app/data ./data
COPY --from=builder /app/client/public ./client/public

# Set ownership
RUN chown -R rusingacademy:nodejs /app

USER rusingacademy

# Environment defaults
ENV NODE_ENV=production
ENV PORT=5000
ENV NODE_OPTIONS="--max-old-space-size=512"

# Expose the application port (Railway overrides via $PORT env var)
EXPOSE ${PORT}

# Health check — uses $PORT so it works regardless of Railway's assigned port
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:${PORT}/api/health || exit 1

# Start the application
CMD ["node", "dist/index.js"]
