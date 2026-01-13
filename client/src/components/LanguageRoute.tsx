import { useEffect } from 'react';
import { Route, useLocation } from 'wouter';
import { useLanguage } from '@/contexts/LanguageContext';
import { extractLanguageFromPath, removeLanguagePrefixFromPath } from '@/utils/bilingualRouter';

interface LanguageRouteProps {
  path: string;
  component: React.ComponentType<any>;
}

/**
 * LanguageRoute Component
 * Wraps a route to automatically set language context based on URL prefix
 * Supports both /en/path and /fr/path patterns
 */
export const LanguageRoute: React.FC<LanguageRouteProps> = ({ path, component: Component }) => {
  const [location] = useLocation();
  const { setLanguage } = useLanguage();

  // Extract language from URL and set context
  useEffect(() => {
    const language = extractLanguageFromPath(location);
    setLanguage(language);
  }, [location, setLanguage]);

  // Create routes for both language prefixes
  const enPath = `/en${path}`;
  const frPath = `/fr${path}`;

  return (
    <>
      <Route path={enPath} component={Component} />
      <Route path={frPath} component={Component} />
    </>
  );
};

export default LanguageRoute;
