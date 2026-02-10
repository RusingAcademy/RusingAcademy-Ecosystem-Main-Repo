# Phase B — Google OAuth Fix Report

**Status:** CODE COMPLETE | PENDING OWNER ACTION (Google Cloud Console)
**Date:** February 10, 2026
**Commit:** `96fe6ce` (tag: `remediation-phase-b-complete`)
**Base Commit:** `f6b0168` (tag: `remediation-phase-a-complete`)

---

## 1. Problem Statement

Google OAuth login was failing with a `redirect_uri_mismatch` error. When users clicked "Continue with Google" on the Login or Signup page, Google rejected the OAuth request because the redirect URI sent by the application did not match any URI registered in Google Cloud Console.

## 2. Root Cause Analysis

The original implementation in `server/routers/googleAuth.ts` derived the redirect URI dynamically from HTTP request headers (`x-forwarded-proto`, `x-forwarded-host`, `host`). This approach is fragile because:

| Factor | Risk |
|--------|------|
| Proxy header variations | Different hosting environments (Manus, Railway, local) send different headers |
| Multiple proxy layers | `x-forwarded-host` can contain comma-separated values from chained proxies |
| Protocol mismatch | `x-forwarded-proto` may be `http` behind a TLS-terminating proxy |
| Host mismatch | The `host` header may reflect an internal hostname, not the public domain |

The derived URI (e.g., `http://localhost:3000/api/auth/google/callback` or an internal proxy hostname) did not match the URI registered in Google Cloud Console (`https://app.rusingacademy.ca/api/auth/google/callback`), causing the `redirect_uri_mismatch` error.

## 3. Code Changes

### 3.1 `server/routers/googleAuth.ts` — Redirect URI Resolution

**Before:**
```typescript
function getGoogleRedirectUri(req: Request): string {
  const protocol = req.headers['x-forwarded-proto'] || req.protocol || 'https';
  const host = req.headers['x-forwarded-host'] || req.headers.host || 'app.rusingacademy.ca';
  return `${protocol}://${host}/api/auth/google/callback`;
}
```

**After:**
```typescript
const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI;

function getGoogleRedirectUri(req: Request): string {
  // Priority 1: Explicit env var (most reliable)
  if (GOOGLE_REDIRECT_URI) {
    return GOOGLE_REDIRECT_URI;
  }
  // Priority 2: Derive from request headers (fallback)
  const proto = req.headers['x-forwarded-proto'] || req.protocol || 'https';
  const rawHost = (req.headers['x-forwarded-host'] as string) || req.headers.host || '';
  const host = rawHost.split(',')[0].trim();
  if (!host) {
    return `https://app.rusingacademy.ca/api/auth/google/callback`;
  }
  return `${proto}://${host}/api/auth/google/callback`;
}
```

**Key improvements:**
1. **Explicit `GOOGLE_REDIRECT_URI` env var** takes priority — eliminates all proxy header ambiguity
2. **Comma-separated `x-forwarded-host` handling** — takes only the first value when multiple proxies chain headers
3. **Enhanced logging** — logs the source of the redirect URI (env var, cookie, or headers) for debugging
4. **Callback token exchange** — logs the exact URI used for the token exchange to diagnose mismatches

### 3.2 Environment Variable

| Variable | Value | Set Via |
|----------|-------|---------|
| `GOOGLE_REDIRECT_URI` | `https://app.rusingacademy.ca/api/auth/google/callback` | `webdev_request_secrets` |

This env var is automatically injected in both development and production environments.

### 3.3 Files Changed

| File | Change |
|------|--------|
| `server/routers/googleAuth.ts` | Added `GOOGLE_REDIRECT_URI` env var support, improved header parsing, enhanced logging |
| `server/google-oauth-fix.test.ts` | New — 26 vitest tests covering OAuth config, redirect URI logic, CSRF, session, frontend |
| `todo.md` | Updated Phase B items |

## 4. Test Results

**26/26 tests passing** in `server/google-oauth-fix.test.ts`:

| Test Group | Tests | Status |
|------------|-------|--------|
| Environment Variables | 2 | PASS |
| Redirect URI Logic | 6 | PASS |
| Token Exchange | 2 | PASS |
| CSRF Protection | 3 | PASS |
| User Creation & Session | 4 | PASS |
| Server Mounting | 1 | PASS |
| Frontend — Login Page | 2 | PASS |
| Frontend — Signup Page | 2 | PASS |
| Database Schema | 2 | PASS |
| Session — Unified Auth | 2 | PASS |

## 5. Verification

After the fix, the OAuth initiation endpoint correctly uses the explicit env var:

```
[Google OAuth] Using explicit GOOGLE_REDIRECT_URI: https://app.rusingacademy.ca/api/auth/google/callback
[Google OAuth] Redirecting to Google consent screen
```

The redirect URL sent to Google now contains:
```
redirect_uri=https%3A%2F%2Fapp.rusingacademy.ca%2Fapi%2Fauth%2Fgoogle%2Fcallback
```

---

## 6. OWNER ACTION REQUIRED — Google Cloud Console Configuration

**Status: PENDING OWNER ACTION**

The code fix ensures the application sends a consistent, explicit redirect URI. However, this URI **must also be registered** in Google Cloud Console. Without this step, the `redirect_uri_mismatch` error will persist.

### Step-by-Step Instructions

#### Step 1: Access Google Cloud Console
1. Go to [https://console.cloud.google.com](https://console.cloud.google.com)
2. Sign in with the Google account that owns the OAuth credentials
3. Select the project associated with Client ID `352296474173-o5o0939v4r405oibi4mam1gnlrbugfbo.apps.googleusercontent.com`

#### Step 2: Navigate to OAuth Credentials
1. In the left sidebar, click **APIs & Services** → **Credentials**
2. Under **OAuth 2.0 Client IDs**, click on the client named for RusingAcademy (the one with ID starting `352296474173`)

#### Step 3: Add Authorized Redirect URIs
1. Scroll down to the **Authorized redirect URIs** section
2. Click **+ ADD URI**
3. Add the following URI **exactly** (no trailing slash, case-sensitive):

```
https://app.rusingacademy.ca/api/auth/google/callback
```

4. If you also want Google OAuth to work on the Manus preview domain, add:

```
https://ecosystemhub-preview.manus.space/api/auth/google/callback
```

5. For local development testing, also add:

```
http://localhost:3000/api/auth/google/callback
```

#### Step 4: Add Authorized JavaScript Origins
1. In the same credential editor, scroll to **Authorized JavaScript origins**
2. Add these origins:

```
https://app.rusingacademy.ca
https://ecosystemhub-preview.manus.space
http://localhost:3000
```

#### Step 5: Save and Wait
1. Click **SAVE** at the bottom of the page
2. **Important:** Changes may take **5-10 minutes** to propagate across Google's servers
3. After waiting, test by clicking "Continue with Google" on the Login page

#### Step 6: Verify
1. Go to `https://app.rusingacademy.ca/login`
2. Click **Continue with Google**
3. You should see Google's consent screen (select account)
4. After selecting an account, you should be redirected back to `/dashboard`
5. If you see `redirect_uri_mismatch` again, double-check the URI is exactly:
   `https://app.rusingacademy.ca/api/auth/google/callback`

### Troubleshooting

| Symptom | Cause | Fix |
|---------|-------|-----|
| `redirect_uri_mismatch` persists | URI not saved in Google Console, or propagation delay | Wait 10 min, verify exact URI match |
| `invalid_state` error | Cookies blocked or SameSite issue | Check browser cookie settings, try incognito |
| `token_exchange_failed` | Client secret mismatch or URI mismatch at token step | Verify `GOOGLE_CLIENT_SECRET` in Settings → Secrets |
| Redirects to `/login?error=oauth_not_configured` | `GOOGLE_CLIENT_ID` env var missing | Check Settings → Secrets |

---

## 7. Summary

| Item | Status |
|------|--------|
| Code fix (redirect URI) | COMPLETE |
| Env var `GOOGLE_REDIRECT_URI` | SET |
| Vitest tests (26/26) | PASSING |
| Git commit | `96fe6ce` |
| Git tag | `remediation-phase-b-complete` |
| Google Console configuration | PENDING OWNER ACTION |

**The Google OAuth flow will work end-to-end once the owner completes Step 6 above.** No further code changes are required.
