/**
 * SEO URL Utilities
 * 
 * Central source of truth for generating canonical URLs and hreflang alternates.
 * Used by the SEO component to ensure consistent bilingual SEO implementation.
 * 
 * IMPORTANT: This module is purely functional, no React dependencies.
 * SAFETY: No redirects, no side effects, pure URL generation only.
 */

import { normalizePath, type Language } from './pathNormalizer';

const BASE_URL = 'https://www.rusingacademy.ca';

export interface SEOUrls {
  canonicalUrl: string;
  alternateEnUrl: string;
  alternateFrUrl: string;
  xDefaultUrl: string;
  currentLang: Language | 'x-default';
}

/**
 * Pages that have bilingual variants (EN/FR routes exist).
 * These pages will have full hreflang implementation.
 */
const BILINGUAL_PAGES = [
  '/',
  '/ecosystem',
  '/lingueefy',
  '/lingueefy/sle',
  '/lingueefy/how-it-works',
  '/coaches',
  '/rusingacademy',
  '/rusingacademy/programs',
  '/rusingacademy/contact',
  '/barholex',
  '/barholex-media',
  '/barholex/services',
  '/barholex/portfolio',
  '/barholex/contact',
];

/**
 * Check if a path (without language prefix) has bilingual variants.
 */
function hasBilingualVariant(basePath: string): boolean {
  // Normalize the path for comparison
  const normalizedBasePath = basePath === '' ? '/' : basePath;
  
  // Check exact match
  if (BILINGUAL_PAGES.includes(normalizedBasePath)) {
    return true;
  }
  
  // Check dynamic routes (e.g., /coaches/:slug)
  if (normalizedBasePath.startsWith('/coaches/') || 
      normalizedBasePath.startsWith('/coach/')) {
    return true;
  }
  
  return false;
}

/**
 * Generate SEO URLs for a given pathname.
 * 
 * Rules:
 * - If page is /en/... → canonical = /en/..., hreflang points to /fr/... and x-default
 * - If page is /fr/... → canonical = /fr/..., hreflang points to /en/... and x-default
 * - If page is /... (no prefix) → canonical = self, treated as x-default
 * 
 * @param pathname - The current URL pathname (e.g., '/en/lingueefy', '/fr', '/')
 * @returns SEOUrls object with all necessary URLs
 */
export function generateSEOUrls(pathname: string): SEOUrls {
  const { lang, path: basePath } = normalizePath(pathname);
  
  // Determine if the URL has an explicit language prefix
  const hasLangPrefix = pathname.startsWith('/en') || pathname.startsWith('/fr');
  
  // Build URLs - ensure no double slashes
  const cleanBasePath = basePath === '/' ? '' : basePath;
  
  const baseUrl = `${BASE_URL}${basePath}`;
  const enUrl = `${BASE_URL}/en${cleanBasePath}`;
  const frUrl = `${BASE_URL}/fr${cleanBasePath}`;
  
  // Determine canonical and current language context
  let canonicalUrl: string;
  let currentLang: Language | 'x-default';
  
  if (hasLangPrefix) {
    // Explicit language route - canonical is the language-specific URL
    canonicalUrl = lang === 'en' ? enUrl : frUrl;
    currentLang = lang;
  } else {
    // Base route (no language prefix) - this is x-default
    canonicalUrl = baseUrl;
    currentLang = 'x-default';
  }
  
  // For pages without bilingual variants, only return canonical (no alternates)
  if (!hasBilingualVariant(basePath)) {
    return {
      canonicalUrl,
      alternateEnUrl: canonicalUrl, // Self-referencing for non-bilingual pages
      alternateFrUrl: canonicalUrl,
      xDefaultUrl: canonicalUrl,
      currentLang,
    };
  }
  
  return {
    canonicalUrl,
    alternateEnUrl: enUrl,
    alternateFrUrl: frUrl,
    xDefaultUrl: baseUrl,
    currentLang,
  };
}

/**
 * Get the appropriate HTML lang attribute value for a pathname.
 * 
 * @param pathname - The current URL pathname
 * @returns Language code for <html lang=""> attribute
 */
export function getHtmlLang(pathname: string): string {
  const { lang } = normalizePath(pathname);
  
  // Use regional variants for Canadian context
  if (pathname.startsWith('/fr')) {
    return 'fr-CA';
  }
  if (pathname.startsWith('/en')) {
    return 'en-CA';
  }
  
  // Default (x-default routes) - use en-CA as primary
  return 'en-CA';
}

/**
 * Update the document's lang attribute.
 * Safe to call multiple times, only updates if changed.
 * 
 * @param pathname - The current URL pathname
 */
export function updateDocumentLang(pathname: string): void {
  if (typeof document === 'undefined') return;
  
  const newLang = getHtmlLang(pathname);
  if (document.documentElement.lang !== newLang) {
    document.documentElement.lang = newLang;
  }
}
