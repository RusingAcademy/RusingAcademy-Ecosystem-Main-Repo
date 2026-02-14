# OAUTH_FIX.md — Google OAuth redirect_uri_mismatch Resolution

## Issue Summary

**Error:** `redirect_uri_mismatch` — Google OAuth login fails because the callback URL sent by the application does not match any Authorized Redirect URI registered in the Google Cloud Console.

**Root Cause:** The application dynamically derives the redirect URI from request headers (via `x-forwarded-host` / `x-forwarded-proto`). Behind Railway's reverse proxy, the derived URI may differ from what is registered in Google Cloud Console. Additionally, the `GOOGLE_REDIRECT_URI` environment variable (the explicit override) is not set in Railway, causing the app to fall back to header-based derivation.

---

## Exact Callback URL(s)

The application uses the following callback endpoint:

```
https://app.rusingacademy.ca/api/auth/google/callback
```

This is the **only** URL that must be registered in Google Cloud Console.

**Source code reference:** `server/routers/googleAuth.ts`, line 38 (hardcoded fallback) and line 41 (dynamic derivation).

---

## Fix — Two Actions Required

### ACTION 1: Set `GOOGLE_REDIRECT_URI` in Railway Environment Variables (Owner Action)

This is the **most reliable fix**. When set, the app uses this value directly instead of deriving from headers.

| Variable | Value |
|---|---|
| `GOOGLE_REDIRECT_URI` | `https://app.rusingacademy.ca/api/auth/google/callback` |

**Steps:**
1. Go to [Railway Dashboard](https://railway.app/dashboard)
2. Select the **RusingAcademy** project
3. Click on the **Production** service
4. Go to **Variables** tab
5. Add or update: `GOOGLE_REDIRECT_URI` = `https://app.rusingacademy.ca/api/auth/google/callback`
6. **Redeploy** the service

### ACTION 2: Register the Redirect URI in Google Cloud Console (Owner Action)

**Steps:**
1. Go to [Google Cloud Console — Credentials](https://console.cloud.google.com/apis/credentials)
2. Select the correct project (the one associated with your `GOOGLE_CLIENT_ID`)
3. Click on the **OAuth 2.0 Client ID** used by RusingAcademy
4. Under **Authorized redirect URIs**, ensure the following URI is listed:

```
https://app.rusingacademy.ca/api/auth/google/callback
```

5. If it is not listed, click **+ ADD URI** and paste the exact value above
6. Click **Save**

**Important:** Also ensure the following URI is listed under **Authorized JavaScript origins**:

```
https://app.rusingacademy.ca
```

---

## Staging Environment

If you also want Google OAuth to work on staging, add the staging callback URI as well:

| Google Cloud Console Field | Value |
|---|---|
| Authorized redirect URI (staging) | `https://<staging-domain>/api/auth/google/callback` |
| Railway env var (staging) | `GOOGLE_REDIRECT_URI` = `https://<staging-domain>/api/auth/google/callback` |

---

## Environment Variables Checklist

Ensure all three Google OAuth variables are set in Railway:

| Variable | Required | Example Value |
|---|---|---|
| `GOOGLE_CLIENT_ID` | Yes | `123456789.apps.googleusercontent.com` |
| `GOOGLE_CLIENT_SECRET` | Yes | `GOCSPX-xxxxxxxxxxxxx` |
| `GOOGLE_REDIRECT_URI` | Recommended | `https://app.rusingacademy.ca/api/auth/google/callback` |

---

## Verification Steps

After completing both actions above:

1. **Clear browser cookies** for `app.rusingacademy.ca`
2. Navigate to `https://app.rusingacademy.ca/login`
3. Click **"Sign in with Google"**
4. Select a Google account on the consent screen
5. **Expected:** Redirected back to the app, logged in successfully
6. **Logout** and **login again** to confirm session persistence
7. Navigate to `/admin` to verify admin route access (if admin user)

### Verification Checklist

- [ ] Google consent screen loads without error
- [ ] Callback redirects to app (no `redirect_uri_mismatch` error)
- [ ] User profile is created/updated in the database
- [ ] Session cookie is set (check DevTools → Application → Cookies)
- [ ] Logout works cleanly
- [ ] Re-login works without issues
- [ ] Admin routes accessible for admin users

---

## Microsoft OAuth (Same Pattern)

The same issue may affect Microsoft OAuth. The fix follows the same pattern:

| Variable | Value |
|---|---|
| `MICROSOFT_CLIENT_ID` | *(already set)* |
| `MICROSOFT_CLIENT_SECRET` | *(already set)* |

**Microsoft Azure Portal:**
1. Go to [Azure Portal — App Registrations](https://portal.azure.com/#blade/Microsoft_AAD_RegisteredApps)
2. Select the RusingAcademy app registration
3. Go to **Authentication** → **Redirect URIs**
4. Ensure this URI is listed: `https://app.rusingacademy.ca/api/auth/microsoft/callback`
5. Save

---

## Code Quality Note

The codebase already handles this correctly with a 3-tier priority system:
1. **Explicit env var** (`GOOGLE_REDIRECT_URI`) — most reliable
2. **Cookie-stored URI** from initiation — ensures token exchange matches
3. **Header-derived URI** — fallback

Setting `GOOGLE_REDIRECT_URI` explicitly in Railway eliminates the proxy-header ambiguity entirely.

---

*Document generated: 2026-02-14*
*Status: Awaiting owner action in Google Cloud Console and Railway*
