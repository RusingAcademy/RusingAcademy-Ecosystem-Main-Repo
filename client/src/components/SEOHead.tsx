import { Helmet } from 'react-helmet-async';
import { useLocation } from 'wouter';
import { getSEOMetadata, generateHreflangLinks } from '@/config/seoConfig';
import { extractLanguageFromPath, removeLanguagePrefixFromPath } from '@/utils/bilingualRouter';

interface SEOHeadProps {
  route?: string;
  customTitle?: string;
  customDescription?: string;
}

/**
 * SEO Head Component
 * Applies meta tags, hreflang, and canonical URLs using react-helmet
 */
export const SEOHead: React.FC<SEOHeadProps> = ({ route, customTitle, customDescription }) => {
  const [location] = useLocation();
  const language = extractLanguageFromPath(location);
  const cleanRoute = removeLanguagePrefixFromPath(location);
  const currentRoute = route || cleanRoute;

  // Get SEO metadata for the current route and language
  const metadata = getSEOMetadata(currentRoute, language);
  const hreflangLinks = generateHreflangLinks(currentRoute);

  // Use custom or default metadata
  const title = customTitle || metadata?.title || 'RusingÂcademy';
  const description = customDescription || metadata?.description || '';
  const canonicalUrl = metadata?.canonicalUrl || `https://rusingacademy.ca${language === 'fr' ? '/fr' : '/en'}${currentRoute === '/' ? '/' : currentRoute}`;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Hreflang Tags for Bilingual Pages */}
      <link rel="alternate" hreflang="en-CA" href={hreflangLinks.en} />
      <link rel="alternate" hreflang="fr-CA" href={hreflangLinks.fr} />
      <link rel="alternate" hreflang="x-default" href={hreflangLinks.en} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={metadata?.ogTitle || title} />
      <meta property="og:description" content={metadata?.ogDescription || description} />
      {metadata?.ogImage && <meta property="og:image" content={metadata.ogImage} />}
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={canonicalUrl} />
      <meta property="twitter:title" content={metadata?.ogTitle || title} />
      <meta property="twitter:description" content={metadata?.ogDescription || description} />
      {metadata?.ogImage && <meta property="twitter:image" content={metadata.ogImage} />}
      
      {/* Language */}
      <html lang={language} />
    </Helmet>
  );
};

export default SEOHead;
