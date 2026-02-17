# Wave 6 — Snapshot After
**Branch**: beautification/wave-6-branding-seo
**Date**: 2026-02-17

## Changes

### Favicon & PWA Icons (local assets)
- favicon.ico (16x16, local)
- favicon-16x16.png, favicon-32x32.png
- apple-touch-icon.png (180x180)
- icon-192x192.png, icon-512x512.png (manifest)
- All migrated from manuscdn.com to local /public/

### index.html Overhaul
- Canonical URL: https://www.rusingacademy.com
- OG URL: manus.space → rusingacademy.com
- OG image: manuscdn → rusingacademy-cdn.b-cdn.net
- Added og:image dimensions, og:site_name, og:locale (en_CA + fr_CA)
- Added twitter:image
- Favicons: manuscdn → local /public/ paths
- Removed dns-prefetch for manuscdn/api.manus.im
- Added dns-prefetch for rusingacademy-cdn.b-cdn.net
- JSON-LD: Added telephone, address (Ottawa, ON, CA), English training catalog
- JSON-LD: URLs updated to rusingacademy.com

### robots.txt
- Sitemap URL: manus.space → rusingacademy.com
- Added Disallow: /auth/

### sitemap.xml
- All 12 URLs: manus.space → rusingacademy.com

### manifest.json
- Icons: manuscdn → local /icon-192x192.png and /icon-512x512.png
