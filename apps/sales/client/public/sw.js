/**
 * RusingAcademy Sales — Service Worker
 * Version: 2.0.0
 *
 * Caching Strategy (safe):
 * - API / tRPC / OAuth: ALWAYS network-only (never cached)
 * - Navigation (HTML): Network-first with offline fallback
 * - Static assets (JS, CSS, fonts): Cache-first with network fallback
 * - Images: Stale-while-revalidate
 * - Everything else: Network-first
 *
 * Auth/Admin safety: /api/*, /trpc/*, /oauth/* are never served from cache.
 */

const CACHE_VERSION = 'ra-sales-v2';
const OFFLINE_URL = '/offline.html';

// Assets to precache on install
const PRECACHE_ASSETS = [
  '/',
  '/manifest.json',
  '/offline.html',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
];

// Routes that must NEVER be cached (auth, API, admin)
const NETWORK_ONLY_PATTERNS = [
  /\/api\//,
  /\/trpc\//,
  /\/oauth/,
  /\/auth/,
  /\/admin/,
  /\/login/,
  /\/logout/,
  /\/callback/,
];

// Static asset patterns (cache-first)
const STATIC_ASSET_PATTERNS = [
  /\.(?:js|css|woff2?|ttf|otf|eot)$/,
  /\/assets\//,
];

// Image patterns (stale-while-revalidate)
const IMAGE_PATTERNS = [
  /\.(?:png|jpg|jpeg|gif|svg|webp|ico|avif)$/,
];

// ─── INSTALL ────────────────────────────────────────────────
self.addEventListener('install', (event) => {
  console.log('[SW] Installing v2...');
  event.waitUntil(
    caches.open(CACHE_VERSION)
      .then((cache) => {
        console.log('[SW] Precaching core assets');
        return cache.addAll(PRECACHE_ASSETS).catch((err) => {
          // Don't fail install if offline.html doesn't exist yet
          console.warn('[SW] Some precache assets failed:', err);
        });
      })
      .then(() => self.skipWaiting())
  );
});

// ─── ACTIVATE ───────────────────────────────────────────────
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating v2...');
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => name !== CACHE_VERSION)
            .map((name) => {
              console.log('[SW] Deleting old cache:', name);
              return caches.delete(name);
            })
        );
      })
      .then(() => self.clients.claim())
  );
});

// ─── FETCH ──────────────────────────────────────────────────
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests entirely
  if (request.method !== 'GET') return;

  // Skip cross-origin requests (CDN images, analytics, etc.)
  if (url.origin !== self.location.origin) return;

  // ── NETWORK-ONLY: Auth, API, OAuth, Admin ──
  if (NETWORK_ONLY_PATTERNS.some((pattern) => pattern.test(url.pathname))) {
    return; // Let browser handle normally — no cache involvement
  }

  // ── NAVIGATION: Network-first with offline fallback ──
  if (request.mode === 'navigate') {
    event.respondWith(networkFirstWithOfflineFallback(request));
    return;
  }

  // ── STATIC ASSETS: Cache-first ──
  if (STATIC_ASSET_PATTERNS.some((pattern) => pattern.test(url.pathname))) {
    event.respondWith(cacheFirst(request));
    return;
  }

  // ── IMAGES: Stale-while-revalidate ──
  if (IMAGE_PATTERNS.some((pattern) => pattern.test(url.pathname))) {
    event.respondWith(staleWhileRevalidate(request));
    return;
  }

  // ── DEFAULT: Network-first ──
  event.respondWith(networkFirst(request));
});

// ─── STRATEGIES ─────────────────────────────────────────────

async function networkFirstWithOfflineFallback(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_VERSION);
      cache.put(request, response.clone());
    }
    return response;
  } catch (err) {
    const cached = await caches.match(request);
    if (cached) return cached;
    // Serve offline page as last resort
    const offline = await caches.match(OFFLINE_URL);
    if (offline) return offline;
    // Absolute fallback: return the cached root
    return caches.match('/');
  }
}

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_VERSION);
      cache.put(request, response.clone());
    }
    return response;
  } catch (err) {
    return new Response('', { status: 503, statusText: 'Service Unavailable' });
  }
}

async function staleWhileRevalidate(request) {
  const cached = await caches.match(request);
  const fetchPromise = fetch(request)
    .then((response) => {
      if (response.ok) {
        const cache = caches.open(CACHE_VERSION);
        cache.then((c) => c.put(request, response.clone()));
      }
      return response;
    })
    .catch(() => cached);

  return cached || fetchPromise;
}

async function networkFirst(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_VERSION);
      cache.put(request, response.clone());
    }
    return response;
  } catch (err) {
    const cached = await caches.match(request);
    return cached || new Response('', { status: 503, statusText: 'Service Unavailable' });
  }
}

// ─── MESSAGE HANDLER ────────────────────────────────────────
self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  if (event.data?.type === 'CLEAR_CACHE') {
    caches.keys().then((names) => {
      names.forEach((name) => caches.delete(name));
    });
  }
});
