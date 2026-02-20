# PWA Release Notes — RusingÂcademy Sales v2.0.0

**Date:** February 14, 2026  
**Branch:** `feat/pwa`  
**Author:** Manus AI (Lead PWA Engineer)  
**Status:** Production-Ready

---

## Summary

This release finalizes the Progressive Web App (PWA) capabilities of **RusingÂcademy Sales**, the accounting and bookkeeping application. The app is now fully installable on Chrome (desktop/Android) and provides clear Add-to-Home-Screen (A2HS) instructions for iOS Safari. All branding is aligned with the RusingAcademy Ecosystem central repository.

---

## Changes

### 1. Manifest (`client/public/manifest.json`)

| Field | Before | After |
|---|---|---|
| `name` | `"RusingAcademy QuickBooks"` | `"RusingÂcademy Sales \| Accounting & Bookkeeping"` |
| `short_name` | `"QuickBooks"` | `"RA Sales"` |
| `theme_color` | `#0077C5` (QB blue) | `#0F3D3E` (Ecosystem teal) |
| `background_color` | `#ffffff` | `#F7F6F3` (Ecosystem porcelain) |
| `icons` | CDN URLs (external) | Local paths (`/icons/*`) |
| `shortcuts` | None | Dashboard, Invoices, Expenses |
| `categories` | None | `business`, `finance`, `productivity` |
| `orientation` | Not set | `any` |

### 2. Icons (`client/public/icons/`)

| File | Size | Purpose |
|---|---|---|
| `icon-72x72.png` | 3.2 KB | Small favicon |
| `icon-96x96.png` | 4.5 KB | Android shortcut |
| `icon-128x128.png` | 5.9 KB | Chrome Web Store |
| `icon-144x144.png` | 6.7 KB | MS Tile |
| `icon-152x152.png` | 7.2 KB | iPad retina |
| `icon-192x192.png` | 9.2 KB | Android home screen (required) |
| `icon-384x384.png` | 19.2 KB | High-DPI Android |
| `icon-512x512.png` | 26.4 KB | Splash screen (required) |
| `icon-maskable-192x192.png` | 5.5 KB | Adaptive icon (Android) |
| `icon-maskable-512x512.png` | 15.2 KB | Adaptive splash |
| `apple-touch-icon-180x180.png` | 4.5 KB | iOS home screen |
| `apple-touch-icon.png` (root) | 4.5 KB | iOS fallback |

**Design:** Teal rounded square with copper "R" letter and accent dot — matching the ecosystem's central icon style. Copper border frame for standard icons, copper full-bleed background for maskable icons.

### 3. HTML Meta Tags (`client/index.html`)

Added or updated:
- `<link rel="manifest">` — points to local `/manifest.json`
- `<meta name="theme-color">` — `#0F3D3E`
- `<meta name="apple-mobile-web-app-capable">` — `yes`
- `<meta name="apple-mobile-web-app-status-bar-style">` — `black-translucent`
- `<meta name="apple-mobile-web-app-title">` — `RA Sales`
- `<meta name="mobile-web-app-capable">` — `yes`
- `<meta name="application-name">` — `RA Sales`
- `<meta name="msapplication-TileColor">` — `#0F3D3E`
- `<meta name="msapplication-TileImage">` — `/icons/icon-144x144.png`
- `<link rel="icon">` — local PNG paths (72, 192)
- `<link rel="apple-touch-icon">` — local PNG paths (180)
- Open Graph tags (`og:title`, `og:description`, `og:image`)
- Twitter Card tags
- SEO `<meta name="description">` and `<meta name="keywords">`

### 4. Service Worker (`client/public/sw.js`)

**Version:** 2.0.0 (upgraded from 1.0)

| Strategy | Routes | Rationale |
|---|---|---|
| **Network-only** | `/api/*`, `/trpc/*`, `/oauth/*`, `/auth/*`, `/admin/*`, `/login/*`, `/logout/*`, `/callback/*` | Auth and API data must never be stale |
| **Network-first + offline fallback** | Navigation (HTML) | SPA routing with graceful offline page |
| **Cache-first** | `.js`, `.css`, `.woff2`, `/assets/*` | Static assets are versioned by Vite hash |
| **Stale-while-revalidate** | Images (`.png`, `.jpg`, `.svg`, etc.) | Fast display with background refresh |
| **Network-first** | Everything else | Safe default |

Additional features:
- Precaches core shell assets on install
- Hourly update checks via `reg.update()`
- Message API: `SKIP_WAITING` and `CLEAR_CACHE` commands
- Old cache cleanup on activate

### 5. Offline Page (`client/public/offline.html`)

Branded offline fallback page with:
- RusingAcademy teal/copper branding
- WiFi-off icon
- "Try Again" button (page reload)
- Footer: "Rusinga International Consulting Ltd."

### 6. Install Prompt (`client/src/components/PWAInstallPrompt.tsx`)

**Chrome/Android:**
- Listens for `beforeinstallprompt` event
- Displays branded bottom banner with "Install App" CTA
- Dismissible with 7-day localStorage memory

**iOS Safari:**
- Detects iOS user agent
- Shows step-by-step A2HS instructions (Share → Add to Home Screen)
- Dismissible with same 7-day memory

**Standalone detection:**
- Hides completely when app is already installed

### 7. App Integration (`client/src/App.tsx`)

- `PWAInstallPrompt` component added at root level (inside `TooltipProvider`)
- No existing routes or components modified

---

## QA Validation

| Check | Result |
|---|---|
| TypeScript compilation (`tsc --noEmit`) | **0 errors** |
| Vite production build | **Success** (2425 modules, 9.06s) |
| Vitest test suite | **153/153 passed** (5 files) |
| Manifest in build output | Present at `/manifest.json` |
| All 12 icon files in build | Present at `/icons/*` |
| Service worker in build | Present at `/sw.js` |
| Offline page in build | Present at `/offline.html` |
| Apple touch icon at root | Present at `/apple-touch-icon.png` |
| No existing routes broken | Verified (all 40+ routes intact) |
| No existing tests broken | Verified (153 tests, 0 failures) |

---

## Ecosystem Compatibility

All changes are 100% compatible with the central ecosystem repository (`RusingAcademy-Ecosystem-Main-Repo`):

- **Color tokens:** Uses `#0F3D3E` (Foundation Teal), `#C65A1E` / `#E06B2D` (Electric Copper), `#F7F6F3` (Porcelain) — identical to `tokens.css`
- **Icon style:** Teal rounded square with copper "R" — matches ecosystem icon pattern
- **Service worker patterns:** Same network-only exclusions for `/api/*`, `/oauth/*` as ecosystem SW
- **No divergent patterns:** All additions are additive; no conflicts with ecosystem merge

---

## Files Changed

```
client/index.html                              — PWA meta tags, local icon refs, SEO
client/public/manifest.json                    — Full PWA manifest with ecosystem branding
client/public/sw.js                            — Production service worker v2.0
client/public/offline.html                     — Branded offline fallback page
client/public/apple-touch-icon.png             — iOS fallback icon (root)
client/public/icons/icon-72x72.png             — Standard icon
client/public/icons/icon-96x96.png             — Standard icon
client/public/icons/icon-128x128.png           — Standard icon
client/public/icons/icon-144x144.png           — Standard icon (MS Tile)
client/public/icons/icon-152x152.png           — Standard icon
client/public/icons/icon-192x192.png           — Required PWA icon
client/public/icons/icon-384x384.png           — High-DPI icon
client/public/icons/icon-512x512.png           — Required splash icon
client/public/icons/icon-maskable-192x192.png  — Adaptive icon
client/public/icons/icon-maskable-512x512.png  — Adaptive splash
client/public/icons/apple-touch-icon-180x180.png — iOS home screen
client/src/components/PWAInstallPrompt.tsx      — Install prompt component
client/src/App.tsx                             — PWAInstallPrompt integration
PWA_RELEASE_NOTES.md                           — This file
```

---

## Lighthouse PWA Criteria

The implementation satisfies all Lighthouse PWA installability requirements:

- [x] Valid `manifest.json` with `name`, `short_name`, `start_url`, `display: standalone`
- [x] Icons: 192x192 and 512x512 PNG with correct MIME type
- [x] Maskable icon provided
- [x] Service worker registered with fetch handler
- [x] Offline fallback page served
- [x] `theme-color` meta tag present
- [x] Viewport meta tag with `width=device-width`
- [x] Apple touch icon provided
- [x] HTTPS (enforced by deployment platform)

---

*Rusinga International Consulting Ltd. — RusingÂcademy Sales*
