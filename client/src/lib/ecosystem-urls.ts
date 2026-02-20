/**
 * Ecosystem URLs — Central configuration for cross-app navigation
 * 
 * Option B routing: each app is deployed as a separate Railway service.
 * URLs are configured via environment variables with sensible defaults.
 * 
 * In production, set these env vars in Railway:
 *   VITE_PORTAL_URL=https://portal.rusing.academy
 *   VITE_COMMUNITY_URL=https://community.rusing.academy
 *   VITE_SALES_URL=https://sales.rusing.academy
 *   VITE_ADMIN_URL=https://www.rusing.academy
 */

export const ECOSYSTEM_URLS = {
  admin: import.meta.env.VITE_ADMIN_URL || "https://www.rusing.academy",
  portal: import.meta.env.VITE_PORTAL_URL || "https://portal.rusing.academy",
  community: import.meta.env.VITE_COMMUNITY_URL || "https://community.rusing.academy",
  sales: import.meta.env.VITE_SALES_URL || "https://sales.rusing.academy",
} as const;

export type EcosystemApp = keyof typeof ECOSYSTEM_URLS;

/**
 * Get the full URL for an ecosystem app, optionally with a path
 */
export function getEcosystemUrl(app: EcosystemApp, path?: string): string {
  const base = ECOSYSTEM_URLS[app];
  if (!path) return base;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}
