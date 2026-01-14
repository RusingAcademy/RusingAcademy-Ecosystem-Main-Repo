/**
 * SEO Content - Bilingual Titles and Descriptions
 * 
 * Central source of truth for all SEO metadata across the ecosystem.
 * Each page has unique EN/FR titles and descriptions.
 * 
 * IMPORTANT: No routing logic here - pure content only.
 */

export interface SEOContent {
  title: {
    en: string;
    fr: string;
  };
  description: {
    en: string;
    fr: string;
  };
}

/**
 * SEO content for all bilingual pages
 */
export const seoContent: Record<string, SEOContent> = {
  // Homepage / Ecosystem Hub
  '/': {
    title: {
      en: 'RusingÂcademy Learning Ecosystem - Bilingual Excellence for Public Servants',
      fr: 'Écosystème d\'apprentissage RusingÂcademy - Excellence bilingue pour fonctionnaires',
    },
    description: {
      en: 'Choose your path to bilingual excellence. SLE-focused learning, expert coaching, and premium media for Canadian public servants. Powered by Rusinga International Consulting Ltd.',
      fr: 'Choisissez votre parcours vers l\'excellence bilingue. Formation ELS, coaching expert et médias premium pour les fonctionnaires canadiens. Propulsé par Rusinga International Consulting Ltd.',
    },
  },

  // Lingueefy Platform
  '/lingueefy': {
    title: {
      en: 'Lingueefy - SLE Preparation & Expert Coaching',
      fr: 'Lingueefy - Préparation ELS et coaching expert',
    },
    description: {
      en: 'Comprehensive SLE preparation with expert coaches, AI-powered practice, and proven results. Achieve your BBB, CBC, or CCC goals faster with personalized coaching.',
      fr: 'Préparation complète à l\'ELS avec des coachs experts, pratique assistée par IA et résultats prouvés. Atteignez vos objectifs BBB, CBC ou CCC plus rapidement avec un coaching personnalisé.',
    },
  },

  // RusingAcademy Platform
  '/rusingacademy': {
    title: {
      en: 'RusingÂcademy - Path Series™ SLE Training Programs',
      fr: 'RusingÂcademy - Programmes de formation ELS Path Series™',
    },
    description: {
      en: 'Structured SLE curriculum with Path Series™ methodology. B2B/B2G training solutions for federal departments and organizations. Achieve BBB, CBC, or CCC goals.',
      fr: 'Curriculum ELS structuré avec la méthodologie Path Series™. Solutions de formation B2B/B2G pour les ministères fédéraux et organisations. Atteignez vos objectifs BBB, CBC ou CCC.',
    },
  },

  // Barholex Media Platform
  '/barholex': {
    title: {
      en: 'Barholex Media - Premium Production & Executive Coaching',
      fr: 'Barholex Media - Production premium et coaching exécutif',
    },
    description: {
      en: 'Premium audiovisual production, executive presence coaching, and EdTech consulting. Transform your bilingual communications with professional media services.',
      fr: 'Production audiovisuelle premium, coaching de présence exécutive et consultation EdTech. Transformez vos communications bilingues avec des services médias professionnels.',
    },
  },

  // Coaches Page
  '/coaches': {
    title: {
      en: 'Our Expert SLE Coaches - Lingueefy',
      fr: 'Nos coachs ELS experts - Lingueefy',
    },
    description: {
      en: 'Meet our certified SLE coaches. Expert language trainers specializing in oral, written, and reading preparation for Canadian public servants.',
      fr: 'Rencontrez nos coachs ELS certifiés. Formateurs linguistiques experts spécialisés dans la préparation orale, écrite et de compréhension pour les fonctionnaires canadiens.',
    },
  },

  // Community Page
  '/community': {
    title: {
      en: 'Join Our Community - RusingÂcademy',
      fr: 'Rejoignez notre communauté - RusingÂcademy',
    },
    description: {
      en: 'Connect with fellow public servants on their bilingual journey. Share experiences, get support, and celebrate successes together.',
      fr: 'Connectez-vous avec d\'autres fonctionnaires dans leur parcours bilingue. Partagez vos expériences, obtenez du soutien et célébrez vos succès ensemble.',
    },
  },

  // Contact Page
  '/contact': {
    title: {
      en: 'Contact Us - RusingÂcademy',
      fr: 'Contactez-nous - RusingÂcademy',
    },
    description: {
      en: 'Get in touch with our team. Questions about SLE preparation, coaching services, or enterprise solutions? We\'re here to help.',
      fr: 'Contactez notre équipe. Des questions sur la préparation ELS, les services de coaching ou les solutions entreprise? Nous sommes là pour vous aider.',
    },
  },
};

/**
 * Get SEO content for a specific path and language
 * 
 * @param basePath - The base path without language prefix (e.g., '/lingueefy')
 * @param lang - The language code ('en' or 'fr')
 * @returns SEO title and description for the specified language
 */
export function getSEOContent(basePath: string, lang: 'en' | 'fr'): { title: string; description: string } {
  const content = seoContent[basePath] || seoContent['/'];
  return {
    title: content.title[lang],
    description: content.description[lang],
  };
}

/**
 * Default SEO values (fallback)
 */
export const defaultSEO = {
  siteName: 'RusingÂcademy',
  image: 'https://www.rusingacademy.ca/og-image.png',
  twitterHandle: '@rusingacademy',
};
