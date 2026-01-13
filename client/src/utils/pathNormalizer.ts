/**
 * Path Normalizer Utility
 * 
 * Central function for extracting language and normalized path from URLs.
 * This is the single source of truth for bilingual routing.
 * 
 * IMPORTANT: This module is purely functional, no React dependencies.
 */

export type Language = 'en' | 'fr';

export interface NormalizedPath {
  lang: Language;
  path: string;
}

/**
 * Normalize a pathname by extracting the language prefix and the clean path.
 * 
 * Examples:
 *   normalizePath('/en/lingueefy') → { lang: 'en', path: '/lingueefy' }
 *   normalizePath('/fr/rusingacademy') → { lang: 'fr', path: '/rusingacademy' }
 *   normalizePath('/lingueefy') → { lang: 'en', path: '/lingueefy' }
 *   normalizePath('/en') → { lang: 'en', path: '/' }
 *   normalizePath('/') → { lang: 'en', path: '/' }
 * 
 * @param pathname - The URL pathname to normalize
 * @returns NormalizedPath with lang and clean path
 */
export function normalizePath(pathname: string): NormalizedPath {
  // Handle null/undefined/empty - always return safe defaults
  if (!pathname) {
    return { lang: 'en', path: '/' };
  }

  // Match /en or /fr at the start, optionally followed by more path
  const match = pathname.match(/^\/(en|fr)(\/.*)?$/);
  
  if (match) {
    const lang = match[1] as Language;
    // If there's a path after the language prefix, use it; otherwise use '/'
    const path = match[2] || '/';
    return { lang, path };
  }
  
  // No language prefix found - default to English, keep original path
  return {
    lang: 'en',
    path: pathname || '/',
  };
}

/**
 * Add language prefix to a path.
 * 
 * Examples:
 *   addLanguagePrefix('/lingueefy', 'fr') → '/fr/lingueefy'
 *   addLanguagePrefix('/', 'en') → '/en/'
 * 
 * @param path - The clean path without language prefix
 * @param lang - The language to add
 * @returns Path with language prefix
 */
export function addLanguagePrefix(path: string, lang: Language): string {
  // Ensure path starts with /
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `/${lang}${cleanPath}`;
}

/**
 * Get browser's preferred language.
 * Falls back to 'en' if not French.
 * 
 * @returns 'en' or 'fr'
 */
export function getBrowserLanguage(): Language {
  if (typeof navigator === 'undefined') return 'en';
  const browserLang = navigator.language.split('-')[0].toLowerCase();
  return browserLang === 'fr' ? 'fr' : 'en';
}
