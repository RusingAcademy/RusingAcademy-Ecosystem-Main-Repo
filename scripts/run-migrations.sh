#!/bin/bash
# =============================================================================
# RusingAcademy Ecosystem — Database Migration Runner
# Phase 6: Stabilization & Documentation
# =============================================================================

set -euo pipefail

MIGRATIONS_DIR="drizzle/migrations"

echo "=============================================="
echo "  RusingAcademy Database Migration Runner"
echo "  Date: $(date -u '+%Y-%m-%d %H:%M:%S UTC')"
echo "=============================================="
echo ""

if [ -z "${DATABASE_URL:-}" ]; then
  echo "❌ ERROR: DATABASE_URL environment variable is not set"
  echo ""
  echo "Usage:"
  echo "  DATABASE_URL='mysql://user:pass@host:port/db' ./scripts/run-migrations.sh"
  echo ""
  exit 1
fi

# Parse DATABASE_URL
DB_HOST=$(echo "$DATABASE_URL" | sed -n 's|.*@\(.*\):.*|\1|p' | sed 's|/.*||')
DB_PORT=$(echo "$DATABASE_URL" | sed -n 's|.*:\([0-9]*\)/.*|\1|p')
DB_NAME=$(echo "$DATABASE_URL" | sed -n 's|.*/\([^?]*\).*|\1|p')
DB_USER=$(echo "$DATABASE_URL" | sed -n 's|mysql://\([^:]*\):.*|\1|p')

echo "Database: $DB_NAME @ $DB_HOST:$DB_PORT"
echo ""

# List migration files in order
MIGRATIONS=$(ls -1 "$MIGRATIONS_DIR"/*.sql 2>/dev/null | sort)

if [ -z "$MIGRATIONS" ]; then
  echo "No migration files found in $MIGRATIONS_DIR/"
  exit 0
fi

echo "Found migrations:"
for f in $MIGRATIONS; do
  echo "  - $(basename "$f")"
done
echo ""

read -p "Run all migrations? (y/N) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo "Aborted."
  exit 0
fi

for f in $MIGRATIONS; do
  FILENAME=$(basename "$f")
  echo "Running: $FILENAME ..."
  mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -p "$DB_NAME" < "$f"
  echo "  ✅ $FILENAME applied"
done

echo ""
echo "=============================================="
echo "  All migrations applied successfully!"
echo "=============================================="
