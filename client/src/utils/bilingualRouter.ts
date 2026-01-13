/**
 * Bilingual Router Utilities
 * Handles URL-based language routing for /en/ and /fr/ prefixes
 */

export type Language = 'en' | 'fr';

/**
 * Extract language from URL pathname
 * Returns 'en' or 'fr', defaults to 'en' if not found
 */
export const extractLanguageFromPath = (pathname: string): Language => {
  const match = pathname.match(/^\/(en|fr)\//);
  return match ? (match[1] as Language) : 'en';
};

/**
 * Remove language prefix from pathname
 * /en/rusingacademy → /rusingacademy
 * /fr/rusingacademy → /rusingacademy
 */
export const removeLanguagePrefixFromPath = (pathname: string): string => {
  return pathname.replace(/^\/(en|fr)\//, '/');
};

/**
 * Add language prefix to pathname
 * /rusingacademy + 'fr' → /fr/rusingacademy
 */
export const addLanguagePrefixToPath = (pathname: string, language: Language): string => {
  // Remove existing prefix if present
  const cleanPath = removeLanguagePrefixFromPath(pathname);
  // Add new prefix
  return `/${language}${cleanPath}`;
};

/**
 * Get browser language preference
 * Returns 'fr' if browser language starts with 'fr', otherwise 'en'
 */
export const getBrowserLanguage = (): Language => {
  if (typeof navigator === 'undefined') return 'en';
  const browserLang = navigator.language.split('-')[0].toLowerCase();
  return browserLang === 'fr' ? 'fr' : 'en';
};

/**
 * Generate bilingual route pairs
 * Used for hreflang tags and sitemap generation
 */
export const generateBilingualRoutes = (baseRoute: string): { en: string; fr: string } => {
  return {
    en: `/en${baseRoute}`,
    fr: `/fr${baseRoute}`,
  };
};

/**
 * Check if a path should be bilingual
 * Returns true for public pages, false for auth/dashboard pages
 */
export const isBilingualPath = (pathname: string): boolean => {
  const bilingualPaths = [
    '/',
    '/rusingacademy',
    '/lingueefy',
    '/barholex-media',
    '/sle-diagnostic',
    '/diagnostic-sle',
    '/booking',
    '/about',
    '/contact',
    '/faq',
    '/for-departments',
    '/community',
  ];
  
  const cleanPath = removeLanguagePrefixFromPath(pathname);
  return bilingualPaths.some(path => cleanPath.startsWith(path));
};
