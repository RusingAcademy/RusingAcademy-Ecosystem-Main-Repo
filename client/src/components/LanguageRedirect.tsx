import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { extractLanguageFromPath, getBrowserLanguage, addLanguagePrefixToPath } from '@/utils/bilingualRouter';

/**
 * LanguageRedirect Component
 * Handles:
 * 1. Root path (/) → /en/ or /fr/ based on browser language
 * 2. ?lang=en|fr parameter → /en/path or /fr/path (301 redirect)
 */
export const LanguageRedirect: React.FC = () => {
  const [location, navigate] = useLocation();

  useEffect(() => {
    // Check for ?lang= parameter in query string
    const searchParams = new URLSearchParams(window.location.search);
    const langParam = searchParams.get('lang');

    if (langParam && (langParam === 'en' || langParam === 'fr')) {
      // Remove ?lang= parameter and redirect to language-prefixed route
      const pathname = window.location.pathname;
      const newPath = addLanguagePrefixToPath(pathname, langParam as 'en' | 'fr');
      
      // Remove query string and navigate
      navigate(newPath);
      return;
    }

    // Handle root path redirect
    if (location === '/') {
      const browserLanguage = getBrowserLanguage();
      navigate(`/${browserLanguage}/`);
      return;
    }

    // If path doesn't have language prefix and is a public page, add it
    const currentLanguage = extractLanguageFromPath(location);
    if (!location.startsWith('/en/') && !location.startsWith('/fr/')) {
      // Only redirect public pages, not auth or dashboard pages
      const publicPages = [
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

      if (publicPages.some(page => location.startsWith(page))) {
        const newPath = addLanguagePrefixToPath(location, currentLanguage);
        if (newPath !== location) {
          navigate(newPath);
        }
      }
    }
  }, [location, navigate]);

  return null;
};

export default LanguageRedirect;
