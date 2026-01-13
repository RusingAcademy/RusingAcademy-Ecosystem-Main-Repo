/**
 * SEO Configuration
 * Centralized metadata for all bilingual pages
 */

export interface SEOMetadata {
  title: string;
  description: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  canonicalUrl?: string;
}

export interface BilingualSEO {
  en: SEOMetadata;
  fr: SEOMetadata;
}

const DOMAIN = 'https://rusingacademy.ca';

export const seoConfig: Record<string, BilingualSEO> = {
  '/': {
    en: {
      title: 'RusingÂcademy Ecosystem | Canada\'s Premier Language & Professional Development Platform',
      description: 'Discover RusingÂcademy, Canada\'s integrated ecosystem for language learning, professional coaching, and media production. 2,500+ public servants trained. 40+ learning capsules. 3-4× faster results.',
      keywords: 'language learning, SLE exam, Canadian public service, bilingual training, coaching platform',
      ogTitle: 'RusingÂcademy Ecosystem',
      ogDescription: 'Canada\'s premier platform for language learning and professional development',
      canonicalUrl: `${DOMAIN}/en/`,
    },
    fr: {
      title: 'Écosystème RusingÂcademy | Plateforme de développement linguistique et professionnel du Canada',
      description: 'Découvrez l\'écosystème RusingÂcademy, la plateforme intégrée du Canada pour l\'apprentissage des langues, le coaching professionnel et la production médias. 2 500+ fonctionnaires formés. 40+ capsules d\'apprentissage. 3-4× résultats plus rapides.',
      keywords: 'apprentissage des langues, examen ELS, fonction publique canadienne, formation bilingue, plateforme de coaching',
      ogTitle: 'Écosystème RusingÂcademy',
      ogDescription: 'Plateforme de premier plan du Canada pour l\'apprentissage des langues et le développement professionnel',
      canonicalUrl: `${DOMAIN}/fr/`,
    },
  },
  '/rusingacademy': {
    en: {
      title: 'RusingÂcademy | Professional Courses & Learning Management System',
      description: 'Master professional skills with RusingÂcademy\'s structured courses and LMS. 40+ learning capsules. 3-4× faster learning. Trusted by 2,500+ Canadian public servants.',
      keywords: 'professional courses, LMS, learning management, skill development, Canadian training',
      ogTitle: 'RusingÂcademy Courses',
      ogDescription: 'Professional courses and learning management for Canadian public servants',
      canonicalUrl: `${DOMAIN}/en/rusingacademy`,
    },
    fr: {
      title: 'RusingÂcademy | Cours professionnels et système de gestion de l\'apprentissage',
      description: 'Maîtrisez les compétences professionnelles avec les cours structurés et le LMS de RusingÂcademy. 40+ capsules d\'apprentissage. 3-4× apprentissage plus rapide. Approuvé par 2 500+ fonctionnaires canadiens.',
      keywords: 'cours professionnels, LMS, gestion de l\'apprentissage, développement des compétences, formation canadienne',
      ogTitle: 'Cours RusingÂcademy',
      ogDescription: 'Cours professionnels et gestion de l\'apprentissage pour les fonctionnaires canadiens',
      canonicalUrl: `${DOMAIN}/fr/rusingacademy`,
    },
  },
  '/lingueefy': {
    en: {
      title: 'Lingueefy | SLE Coaching & AI Practice Platform for Canadian Public Servants',
      description: 'Achieve your SLE goals with Lingueefy. Expert coaches + Prof Steven AI. 2,500+ public servants trained. 95% satisfaction rate. Book your diagnostic today.',
      keywords: 'SLE exam, language coaching, AI practice, Canadian public service, bilingual training',
      ogTitle: 'Lingueefy - SLE Coaching Platform',
      ogDescription: 'Expert coaching and AI practice for Canadian SLE exam preparation',
      canonicalUrl: `${DOMAIN}/en/lingueefy`,
    },
    fr: {
      title: 'Lingueefy | Coaching ELS et plateforme de pratique IA pour les fonctionnaires canadiens',
      description: 'Atteignez vos objectifs ELS avec Lingueefy. Coachs experts + Prof Steven IA. 2 500+ fonctionnaires formés. Taux de satisfaction de 95%. Réservez votre diagnostic dès aujourd\'hui.',
      keywords: 'examen ELS, coaching linguistique, pratique IA, fonction publique canadienne, formation bilingue',
      ogTitle: 'Lingueefy - Plateforme de coaching ELS',
      ogDescription: 'Coaching expert et pratique IA pour la préparation à l\'examen ELS canadien',
      canonicalUrl: `${DOMAIN}/fr/lingueefy`,
    },
  },
  '/barholex-media': {
    en: {
      title: 'Barholex Media | EdTech Consulting & Digital Studio',
      description: 'Barholex Media provides EdTech consulting and digital production services. Helping organizations scale language learning and professional development programs.',
      keywords: 'EdTech consulting, digital production, language learning, professional development',
      ogTitle: 'Barholex Media',
      ogDescription: 'EdTech consulting and digital studio services',
      canonicalUrl: `${DOMAIN}/en/barholex-media`,
    },
    fr: {
      title: 'Barholex Media | Consultation EdTech et Studio numérique',
      description: 'Barholex Media fournit des services de consultation EdTech et de production numérique. Aidez les organisations à développer les programmes d\'apprentissage des langues et de développement professionnel.',
      keywords: 'consultation EdTech, production numérique, apprentissage des langues, développement professionnel',
      ogTitle: 'Barholex Media',
      ogDescription: 'Services de consultation EdTech et studio numérique',
      canonicalUrl: `${DOMAIN}/fr/barholex-media`,
    },
  },
  '/sle-diagnostic': {
    en: {
      title: 'Free SLE Diagnostic (30 min) | RusingÂcademy',
      description: 'Get your personalized SLE diagnostic in 30 minutes. Discover your exact path to success. Free assessment. No commitment. Book now.',
      keywords: 'SLE diagnostic, language assessment, Canadian exam, free evaluation',
      ogTitle: 'Free SLE Diagnostic',
      ogDescription: 'Get your personalized SLE assessment in 30 minutes',
      canonicalUrl: `${DOMAIN}/en/sle-diagnostic`,
    },
    fr: {
      title: 'Diagnostic ELS gratuit (30 min) | RusingÂcademy',
      description: 'Obtenez votre diagnostic ELS personnalisé en 30 minutes. Découvrez votre chemin exact vers le succès. Évaluation gratuite. Sans engagement. Réservez maintenant.',
      keywords: 'diagnostic ELS, évaluation linguistique, examen canadien, évaluation gratuite',
      ogTitle: 'Diagnostic ELS gratuit',
      ogDescription: 'Obtenez votre évaluation ELS personnalisée en 30 minutes',
      canonicalUrl: `${DOMAIN}/fr/diagnostic-sle`,
    },
  },
  '/booking': {
    en: {
      title: 'Book Your SLE Diagnostic (30 min) | RusingÂcademy',
      description: 'Schedule your free 30-minute SLE diagnostic. Get personalized recommendations. Start your path to bilingual success today.',
      keywords: 'book appointment, SLE diagnostic, language coaching, Canadian exam',
      ogTitle: 'Book Your Diagnostic',
      ogDescription: 'Schedule your free SLE diagnostic appointment',
      canonicalUrl: `${DOMAIN}/en/booking`,
    },
    fr: {
      title: 'Réservez votre diagnostic ELS (30 min) | RusingÂcademy',
      description: 'Planifiez votre diagnostic ELS gratuit de 30 minutes. Obtenez des recommandations personnalisées. Commencez votre chemin vers le succès bilingue dès aujourd\'hui.',
      keywords: 'réserver rendez-vous, diagnostic ELS, coaching linguistique, examen canadien',
      ogTitle: 'Réservez votre diagnostic',
      ogDescription: 'Planifiez votre rendez-vous de diagnostic ELS gratuit',
      canonicalUrl: `${DOMAIN}/fr/reservation`,
    },
  },
};

/**
 * Get SEO metadata for a specific route and language
 */
export const getSEOMetadata = (route: string, language: 'en' | 'fr'): SEOMetadata | null => {
  const bilingualSEO = seoConfig[route];
  if (!bilingualSEO) return null;
  return bilingualSEO[language];
};

/**
 * Generate hreflang links for a route
 */
export const generateHreflangLinks = (route: string): { en: string; fr: string } => {
  const enRoute = route === '/' ? '/en/' : `/en${route}`;
  const frRoute = route === '/' ? '/fr/' : `/fr${route}`;
  
  return {
    en: `${DOMAIN}${enRoute}`,
    fr: `${DOMAIN}${frRoute}`,
  };
};

/**
 * Get all routes for sitemap generation
 */
export const getAllBilingualRoutes = (): Array<{ en: string; fr: string }> => {
  return Object.keys(seoConfig).map(route => {
    const enRoute = route === '/' ? '/en/' : `/en${route}`;
    const frRoute = route === '/' ? '/fr/' : `/fr${route}`;
    
    return {
      en: enRoute,
      fr: frRoute,
    };
  });
};
