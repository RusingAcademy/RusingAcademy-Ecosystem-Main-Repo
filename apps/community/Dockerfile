# =============================================================================
# RusingAcademy Community Hub — Production Dockerfile
# =============================================================================
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN corepack enable && corepack prepare pnpm@10.4.1 --activate
RUN pnpm install --frozen-lockfile --prod=false

FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN corepack enable && corepack prepare pnpm@10.4.1 --activate
RUN pnpm run build

FROM node:22-alpine AS runner
WORKDIR /app
RUN addgroup --system nodejs && adduser --system --ingroup nodejs appuser
COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-lock.yaml ./
RUN corepack enable && corepack prepare pnpm@10.4.1 --activate && \
    pnpm install --frozen-lockfile --prod && \
    pnpm store prune
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/client/public ./client/public
COPY --from=builder /app/data ./data 2>/dev/null || true
RUN chown -R appuser:nodejs /app
USER appuser
ENV NODE_ENV=production
ENV PORT=5000
EXPOSE ${PORT}
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:${PORT}/api/health || exit 1
CMD ["node", "dist/index.js"]
