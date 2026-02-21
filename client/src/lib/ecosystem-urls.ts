/**
 * Ecosystem URLs — Central configuration for cross-app navigation
 * 
 * All sub-apps (portal, community, sales) have been consolidated into the
 * main application. Navigation now uses internal routes instead of external
 * subdomains to ensure all links resolve correctly.
 * 
 * Internal routes:
 *   /my-learning     → Learning Portal (learner dashboard)
 *   /community       → Community Hub
 *   /admin/sales-analytics → Sales Dashboard (admin only)
 *   /pricing         → Public pricing page
 */

export const ECOSYSTEM_URLS = {
  admin: "",  // same origin — use relative paths
  portal: "/my-learning",
  community: "/community",
  sales: "/admin/sales-analytics",
} as const;

export type EcosystemApp = keyof typeof ECOSYSTEM_URLS;

/**
 * Get the full URL for an ecosystem app, optionally with a path.
 * Since all apps are now internal, this returns relative paths.
 */
export function getEcosystemUrl(app: EcosystemApp, path?: string): string {
  const base = ECOSYSTEM_URLS[app];
  if (!path) return base;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

/**
 * Check if a URL is internal (same-origin) or external.
 * All ecosystem URLs are now internal.
 */
export function isInternalUrl(url: string): boolean {
  return url.startsWith("/") || url === "";
}
