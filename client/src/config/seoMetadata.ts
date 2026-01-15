/**
 * SEO Metadata Configuration for all major routes
 * Bilingual support (EN/FR)
 */

export interface PageSEO {
  title: {
    en: string;
    fr: string;
  };
  description: {
    en: string;
    fr: string;
  };
  keywords?: {
    en: string[];
    fr: string[];
  };
  ogImage?: string;
}

export const SEO_METADATA: Record<string, PageSEO> = {
  // Home
  '/': {
    title: {
      en: 'RusingAcademy - French Language Training for Public Servants',
      fr: 'RusingAcademy - Formation en français pour fonctionnaires',
    },
    description: {
      en: 'Master your French for the Public Service with expert SLE preparation, AI-powered practice, and certified coaches. Join 500+ successful learners.',
      fr: 'Maîtrisez votre français pour la fonction publique avec une préparation ELS experte, une pratique alimentée par l\'IA et des coachs certifiés. Rejoignez plus de 500 apprenants.',
    },
    keywords: {
      en: ['SLE preparation', 'French training', 'public service', 'language coaching', 'Canada'],
      fr: ['préparation ELS', 'formation français', 'fonction publique', 'coaching linguistique', 'Canada'],
    },
  },

  // Pricing
  '/pricing': {
    title: {
      en: 'Pricing Plans - SLE Preparation Packages',
      fr: 'Tarifs - Forfaits de préparation ELS',
    },
    description: {
      en: 'Choose from our structured SLE preparation plans: Boost Session ($67), Quick Prep ($299), Progressive ($899), or Mastery ($1,899). AI coaching included.',
      fr: 'Choisissez parmi nos forfaits structurés de préparation ELS : Session Boost (67$), Préparation Rapide (299$), Progressif (899$) ou Maîtrise (1 899$). Coaching IA inclus.',
    },
    keywords: {
      en: ['SLE pricing', 'French course cost', 'language training packages', 'coaching rates'],
      fr: ['tarifs ELS', 'coût cours français', 'forfaits formation', 'tarifs coaching'],
    },
  },

  // AI Coach
  '/ai-coach': {
    title: {
      en: 'AI Coach - Practice French with AI',
      fr: 'Coach IA - Pratiquez le français avec l\'IA',
    },
    description: {
      en: 'Practice your French conversation skills with our AI-powered coach. Get instant feedback, simulate SLE oral exams, and track your progress.',
      fr: 'Pratiquez vos compétences conversationnelles en français avec notre coach alimenté par l\'IA. Obtenez des commentaires instantanés, simulez des examens oraux ELS et suivez vos progrès.',
    },
    keywords: {
      en: ['AI French coach', 'language practice', 'SLE simulation', 'conversation practice'],
      fr: ['coach IA français', 'pratique linguistique', 'simulation ELS', 'pratique conversation'],
    },
  },

  // Dashboard
  '/dashboard': {
    title: {
      en: 'Learner Dashboard - Track Your Progress',
      fr: 'Tableau de bord - Suivez vos progrès',
    },
    description: {
      en: 'Access your personalized learning dashboard. Track progress, view upcoming sessions, manage your AI coach credits, and access course materials.',
      fr: 'Accédez à votre tableau de bord d\'apprentissage personnalisé. Suivez vos progrès, consultez vos sessions à venir, gérez vos crédits de coach IA et accédez aux supports de cours.',
    },
  },

  // About
  '/about': {
    title: {
      en: 'About Us - Our Mission & Team',
      fr: 'À propos - Notre mission et équipe',
    },
    description: {
      en: 'Learn about RusingAcademy\'s mission to help public servants succeed in their French language evaluations. Meet our team of certified language experts.',
      fr: 'Découvrez la mission de RusingAcademy d\'aider les fonctionnaires à réussir leurs évaluations de langue française. Rencontrez notre équipe d\'experts linguistiques certifiés.',
    },
  },

  // FAQ
  '/faq': {
    title: {
      en: 'FAQ - Frequently Asked Questions',
      fr: 'FAQ - Questions fréquemment posées',
    },
    description: {
      en: 'Find answers to common questions about SLE preparation, our coaching services, pricing, and how to get started with RusingAcademy.',
      fr: 'Trouvez des réponses aux questions courantes sur la préparation ELS, nos services de coaching, les tarifs et comment commencer avec RusingAcademy.',
    },
  },

  // Courses
  '/courses': {
    title: {
      en: 'Courses - SLE Preparation Programs',
      fr: 'Cours - Programmes de préparation ELS',
    },
    description: {
      en: 'Explore our comprehensive SLE preparation courses: BBB, CBC, oral, and written exam preparation. Self-paced and instructor-led options available.',
      fr: 'Explorez nos cours complets de préparation ELS : BBB, CBC, préparation aux examens oraux et écrits. Options auto-rythmées et dirigées par un instructeur disponibles.',
    },
  },

  // How It Works
  '/how-it-works': {
    title: {
      en: 'How It Works - Your Learning Journey',
      fr: 'Comment ça marche - Votre parcours d\'apprentissage',
    },
    description: {
      en: 'Discover how RusingAcademy\'s structured approach helps you achieve your SLE goals. From diagnostic assessment to exam success in 4 simple steps.',
      fr: 'Découvrez comment l\'approche structurée de RusingAcademy vous aide à atteindre vos objectifs ELS. De l\'évaluation diagnostique au succès à l\'examen en 4 étapes simples.',
    },
  },

  // For Departments
  '/for-departments': {
    title: {
      en: 'For Departments - Enterprise Language Training',
      fr: 'Pour les ministères - Formation linguistique entreprise',
    },
    description: {
      en: 'Scalable French language training solutions for government departments. Volume licensing, progress tracking, and dedicated account management.',
      fr: 'Solutions de formation linguistique en français évolutives pour les ministères gouvernementaux. Licences en volume, suivi des progrès et gestion de compte dédiée.',
    },
  },

  // Community
  '/community': {
    title: {
      en: 'Community - Connect with Fellow Learners',
      fr: 'Communauté - Connectez-vous avec d\'autres apprenants',
    },
    description: {
      en: 'Join our community of public servants preparing for their SLE. Share tips, find study partners, and celebrate successes together.',
      fr: 'Rejoignez notre communauté de fonctionnaires préparant leur ELS. Partagez des conseils, trouvez des partenaires d\'étude et célébrez vos succès ensemble.',
    },
  },

  // Contact
  '/contact': {
    title: {
      en: 'Contact Us - Get in Touch',
      fr: 'Contactez-nous - Entrer en contact',
    },
    description: {
      en: 'Have questions about our SLE preparation services? Contact our team for personalized guidance and support.',
      fr: 'Vous avez des questions sur nos services de préparation ELS ? Contactez notre équipe pour des conseils et un soutien personnalisés.',
    },
  },

  // Login
  '/login': {
    title: {
      en: 'Sign In - Access Your Account',
      fr: 'Connexion - Accédez à votre compte',
    },
    description: {
      en: 'Sign in to your RusingAcademy account to access your courses, AI coach, and learning dashboard.',
      fr: 'Connectez-vous à votre compte RusingAcademy pour accéder à vos cours, coach IA et tableau de bord d\'apprentissage.',
    },
  },

  // Lingueefy Marketplace
  '/lingueefy/marketplace': {
    title: {
      en: 'Lingueefy Marketplace - Find Your Coach',
      fr: 'Marketplace Lingueefy - Trouvez votre coach',
    },
    description: {
      en: 'Browse our marketplace of certified French language coaches. Book personalized sessions and accelerate your SLE preparation.',
      fr: 'Parcourez notre marketplace de coachs certifiés en français. Réservez des sessions personnalisées et accélérez votre préparation ELS.',
    },
  },

  // Barholex Portal
  '/barholex/portal': {
    title: {
      en: 'Barholex Media Portal - Executive Communications',
      fr: 'Portail Barholex Media - Communications exécutives',
    },
    description: {
      en: 'Access premium audiovisual production and bilingual leadership communication coaching for executives.',
      fr: 'Accédez à la production audiovisuelle premium et au coaching en communication de leadership bilingue pour les cadres.',
    },
  },

  // SLE Landing Pages
  '/sle-bbb-preparation': {
    title: {
      en: 'SLE BBB Preparation - Achieve Your BBB Level',
      fr: 'Préparation ELS BBB - Atteignez votre niveau BBB',
    },
    description: {
      en: 'Comprehensive preparation for the BBB level of the Second Language Evaluation. Expert coaching, AI practice, and proven strategies.',
      fr: 'Préparation complète pour le niveau BBB de l\'Évaluation de langue seconde. Coaching expert, pratique IA et stratégies éprouvées.',
    },
  },

  '/sle-cbc-preparation': {
    title: {
      en: 'SLE CBC Preparation - Reach CBC Excellence',
      fr: 'Préparation ELS CBC - Atteignez l\'excellence CBC',
    },
    description: {
      en: 'Advanced preparation for the CBC level of the Second Language Evaluation. Master complex grammar and professional communication.',
      fr: 'Préparation avancée pour le niveau CBC de l\'Évaluation de langue seconde. Maîtrisez la grammaire complexe et la communication professionnelle.',
    },
  },

  '/sle-oral-coaching': {
    title: {
      en: 'SLE Oral Coaching - Master Your Speaking Skills',
      fr: 'Coaching oral ELS - Maîtrisez vos compétences orales',
    },
    description: {
      en: 'Intensive oral preparation for the SLE. Practice with expert coaches and AI simulations to build confidence and fluency.',
      fr: 'Préparation orale intensive pour l\'ELS. Pratiquez avec des coachs experts et des simulations IA pour développer confiance et fluidité.',
    },
  },

  '/sle-written-coaching': {
    title: {
      en: 'SLE Written Coaching - Perfect Your Writing',
      fr: 'Coaching écrit ELS - Perfectionnez votre écriture',
    },
    description: {
      en: 'Comprehensive written exam preparation for the SLE. Master grammar, vocabulary, and professional writing techniques.',
      fr: 'Préparation complète à l\'examen écrit de l\'ELS. Maîtrisez la grammaire, le vocabulaire et les techniques d\'écriture professionnelle.',
    },
  },
};

/**
 * Get SEO metadata for a route
 */
export function getSEOMetadata(path: string, language: 'en' | 'fr'): { title: string; description: string; keywords?: string[] } {
  // Normalize path (remove language prefix)
  const normalizedPath = path.replace(/^\/(en|fr)/, '') || '/';
  
  const metadata = SEO_METADATA[normalizedPath];
  
  if (!metadata) {
    // Return default metadata
    return {
      title: language === 'fr' 
        ? 'RusingAcademy - Formation en français pour fonctionnaires'
        : 'RusingAcademy - French Language Training for Public Servants',
      description: language === 'fr'
        ? 'Maîtrisez votre français pour la fonction publique avec une préparation ELS experte.'
        : 'Master your French for the Public Service with expert SLE preparation.',
    };
  }

  return {
    title: metadata.title[language],
    description: metadata.description[language],
    keywords: metadata.keywords?.[language],
  };
}
