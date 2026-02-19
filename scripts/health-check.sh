#!/bin/bash
# =============================================================================
# RusingAcademy Ecosystem — Production Health Check Script
# Phase 6: Stabilization & Documentation
# =============================================================================

set -euo pipefail

PROD_URL="${1:-https://www.rusingacademy.com}"
TIMEOUT=15
PASSED=0
FAILED=0
WARNINGS=0

echo "=============================================="
echo "  RusingAcademy Production Health Check"
echo "  Target: $PROD_URL"
echo "  Date: $(date -u '+%Y-%m-%d %H:%M:%S UTC')"
echo "=============================================="
echo ""

check() {
  local name="$1"
  local url="$2"
  local expected="${3:-200}"
  
  HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" -L --max-time "$TIMEOUT" "$url" 2>/dev/null || echo "000")
  
  if [ "$HTTP_STATUS" = "$expected" ]; then
    echo "  ✅ PASS  $name (HTTP $HTTP_STATUS)"
    PASSED=$((PASSED + 1))
  elif [ "$HTTP_STATUS" = "000" ]; then
    echo "  ❌ FAIL  $name (TIMEOUT)"
    FAILED=$((FAILED + 1))
  else
    echo "  ❌ FAIL  $name (HTTP $HTTP_STATUS, expected $expected)"
    FAILED=$((FAILED + 1))
  fi
}

check_content() {
  local name="$1"
  local url="$2"
  local pattern="$3"
  
  CONTENT=$(curl -s -L --max-time "$TIMEOUT" "$url" 2>/dev/null || echo "")
  
  if echo "$CONTENT" | grep -q "$pattern"; then
    echo "  ✅ PASS  $name (pattern found)"
    PASSED=$((PASSED + 1))
  else
    echo "  ❌ FAIL  $name (pattern '$pattern' not found)"
    FAILED=$((FAILED + 1))
  fi
}

echo "📡 Core Endpoints"
echo "----------------------------------------------"
check "Homepage" "$PROD_URL/"
check "Login Page" "$PROD_URL/login"
check "Courses Page" "$PROD_URL/courses"
check "Pricing Page" "$PROD_URL/pricing"
check "About Page" "$PROD_URL/about"
echo ""

echo "🔌 API Endpoints"
echo "----------------------------------------------"
check "API Health" "$PROD_URL/api/health"
check "WebSocket Endpoint" "$PROD_URL/ws/" "400"
check "Stripe Webhook" "$PROD_URL/api/stripe/webhook" "400"
check "Connect Webhook" "$PROD_URL/api/webhooks/stripe-connect" "400"
echo ""

echo "📦 Static Assets"
echo "----------------------------------------------"
check "Service Worker" "$PROD_URL/sw-push.js"
echo ""

echo "🔒 Security Headers"
echo "----------------------------------------------"
HEADERS=$(curl -s -I -L --max-time "$TIMEOUT" "$PROD_URL/" 2>/dev/null || echo "")

if echo "$HEADERS" | grep -qi "x-content-type-options"; then
  echo "  ✅ PASS  X-Content-Type-Options header present"
  PASSED=$((PASSED + 1))
else
  echo "  ⚠️  WARN  X-Content-Type-Options header missing"
  WARNINGS=$((WARNINGS + 1))
fi

if echo "$HEADERS" | grep -qi "x-frame-options\|content-security-policy"; then
  echo "  ✅ PASS  Frame protection header present"
  PASSED=$((PASSED + 1))
else
  echo "  ⚠️  WARN  Frame protection header missing"
  WARNINGS=$((WARNINGS + 1))
fi

echo ""

echo "🔐 SSL Certificate"
echo "----------------------------------------------"
DOMAIN=$(echo "$PROD_URL" | sed 's|https://||' | sed 's|/.*||')
SSL_EXPIRY=$(echo | openssl s_client -servername "$DOMAIN" -connect "$DOMAIN:443" 2>/dev/null | openssl x509 -noout -enddate 2>/dev/null | cut -d= -f2)
if [ -n "$SSL_EXPIRY" ]; then
  echo "  ✅ PASS  SSL valid until $SSL_EXPIRY"
  PASSED=$((PASSED + 1))
else
  echo "  ❌ FAIL  Could not verify SSL certificate"
  FAILED=$((FAILED + 1))
fi

echo ""
echo "=============================================="
echo "  Results: $PASSED passed, $FAILED failed, $WARNINGS warnings"
echo "=============================================="

if [ "$FAILED" -gt 0 ]; then
  echo "  ❌ HEALTH CHECK FAILED"
  exit 1
else
  echo "  ✅ ALL CHECKS PASSED"
  exit 0
fi
