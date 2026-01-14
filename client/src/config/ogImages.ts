/**
 * OpenGraph Image Configuration
 * Professional OG images for social sharing (LinkedIn, Twitter, Facebook)
 */

export interface OGImageConfig {
  default: string;
  lingueefy: string;
  barholex: string;
  rusingacademy: string;
  pricing: string;
  aiCoach: string;
  courses: string;
}

// Base URL for OG images
const OG_BASE_URL = 'https://www.rusingacademy.ca';

/**
 * OpenGraph images for different sections
 * These should be 1200x630px for optimal display
 */
export const OG_IMAGES: OGImageConfig = {
  default: `${OG_BASE_URL}/og-image.png`,
  lingueefy: `${OG_BASE_URL}/og-lingueefy.png`,
  barholex: `${OG_BASE_URL}/og-barholex.png`,
  rusingacademy: `${OG_BASE_URL}/og-rusingacademy.png`,
  pricing: `${OG_BASE_URL}/og-pricing.png`,
  aiCoach: `${OG_BASE_URL}/og-ai-coach.png`,
  courses: `${OG_BASE_URL}/og-courses.png`,
};

/**
 * Get the appropriate OG image for a given path
 */
export function getOGImage(path: string): string {
  // Normalize path
  const normalizedPath = path.toLowerCase();

  if (normalizedPath.includes('/lingueefy')) {
    return OG_IMAGES.lingueefy;
  }
  if (normalizedPath.includes('/barholex')) {
    return OG_IMAGES.barholex;
  }
  if (normalizedPath.includes('/rusingacademy')) {
    return OG_IMAGES.rusingacademy;
  }
  if (normalizedPath.includes('/pricing') || normalizedPath.includes('/tarifs')) {
    return OG_IMAGES.pricing;
  }
  if (normalizedPath.includes('/ai-coach') || normalizedPath.includes('/coach-ia')) {
    return OG_IMAGES.aiCoach;
  }
  if (normalizedPath.includes('/courses') || normalizedPath.includes('/cours')) {
    return OG_IMAGES.courses;
  }

  return OG_IMAGES.default;
}

/**
 * Generate canonical URL for a given path
 */
export function getCanonicalUrl(path: string): string {
  // Remove trailing slash
  const cleanPath = path.replace(/\/$/, '');
  return `${OG_BASE_URL}${cleanPath}`;
}

/**
 * Generate alternate language URLs
 */
export function getAlternateUrls(path: string): { en: string; fr: string; xDefault: string } {
  const cleanPath = path.replace(/^\/(en|fr)/, '');
  
  return {
    en: `${OG_BASE_URL}/en${cleanPath}`,
    fr: `${OG_BASE_URL}/fr${cleanPath}`,
    xDefault: `${OG_BASE_URL}${cleanPath}`,
  };
}

/**
 * Twitter card types
 */
export type TwitterCardType = 'summary' | 'summary_large_image' | 'app' | 'player';

/**
 * Get Twitter card type based on content
 */
export function getTwitterCardType(hasLargeImage: boolean = true): TwitterCardType {
  return hasLargeImage ? 'summary_large_image' : 'summary';
}
