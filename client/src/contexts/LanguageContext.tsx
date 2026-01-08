import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Language = "en" | "fr";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navigation
    "nav.findCoach": "Find a Coach",
    "nav.aiCoach": "Prof Steven AI",
    "nav.howItWorks": "How It Works",
    "nav.becomeCoach": "Become a Coach",
    "nav.signIn": "Sign In",
    "nav.getStarted": "Get Started",
    "nav.dashboard": "Dashboard",
    
    // Hero Section
    "hero.badge": "Canada's #1 GC/SLE Language Platform",
    "hero.title": "Master Your Second Language for the",
    "hero.titleHighlight": "Public Service",
    "hero.description": "Connect with specialized coaches who understand the SLE exam. Practice 24/7 with Prof Steven AI. Achieve your BBB, CBC, or CCC goals.",
    "hero.findCoach": "Find a Coach",
    "hero.tryAI": "Try Prof Steven AI",
    "hero.socialProof": "Public Servants",
    "hero.socialProofSub": "achieved their SLE goals",
    
    // AI Card
    "ai.title": "Prof Steven AI",
    "ai.subtitle": "Your 24/7 Practice Partner",
    "ai.voicePractice": "Voice Practice Sessions",
    "ai.placementTests": "SLE Placement Tests",
    "ai.examSimulations": "Oral Exam Simulations",
    "ai.startPractice": "Start Free Practice",
    
    // SLE Levels
    "sle.title": "Prepare for Any SLE Level",
    "sle.description": "Whether you're starting from scratch or aiming for the highest level, our coaches specialize in all SLE competencies.",
    "sle.levelA": "Level A",
    "sle.levelADesc": "Basic interaction skills for simple workplace communication",
    "sle.levelB": "Level B",
    "sle.levelBDesc": "Intermediate proficiency for most federal positions",
    "sle.levelC": "Level C",
    "sle.levelCDesc": "Advanced mastery for executive and specialized roles",
    "sle.skills": "Oral • Written • Reading",
    
    // How It Works
    "how.title": "How Lingueefy Works",
    "how.description": "Get started in minutes and begin your journey to SLE success",
    "how.step1Title": "Find Your Coach",
    "how.step1Desc": "Browse coaches by SLE specialization, availability, and reviews",
    "how.step2Title": "Book a Session",
    "how.step2Desc": "Schedule at your convenience with flexible booking options",
    "how.step3Title": "Practice with AI",
    "how.step3Desc": "Use Prof Steven AI for unlimited practice between sessions",
    "how.step4Title": "Achieve Your Goal",
    "how.step4Desc": "Pass your SLE exam and advance your federal career",
    
    // Features
    "features.title": "Why Choose Lingueefy",
    "features.description": "The only platform built specifically for Canadian federal public service language learning",
    "features.sleCoaches": "SLE-Specialized Coaches",
    "features.sleCoachesDesc": "Every coach understands the Treasury Board evaluation criteria and federal workplace context",
    "features.ai": "Prof Steven AI",
    "features.aiDesc": "Practice 24/7 with AI-powered conversation, placement tests, and exam simulations",
    "features.flexible": "Flexible Scheduling",
    "features.flexibleDesc": "Book sessions around your work schedule — mornings, lunch, evenings, weekends",
    "features.bilingual": "Bilingual Platform",
    "features.bilingualDesc": "Full support for both French and English learning with native-speaking coaches",
    "features.results": "Proven Results",
    "features.resultsDesc": "Track record of helping public servants achieve their target SLE levels",
    "features.federal": "Federal Context",
    "features.federalDesc": "Practice with real workplace scenarios: briefings, meetings, emails, presentations",
    
    // CTA
    "cta.title": "Ready to Achieve Your SLE Goals?",
    "cta.description": "Join hundreds of public servants who have successfully improved their second language skills with Lingueefy.",
    "cta.findCoach": "Find a Coach",
    "cta.becomeCoach": "Become a Coach",
    
    // Footer
    "footer.tagline": "Canada's premier platform for GC/SLE second language preparation.",
    "footer.forLearners": "For Learners",
    "footer.forCoaches": "For Coaches",
    "footer.company": "Company",
    "footer.findCoach": "Find a Coach",
    "footer.aiCoach": "Prof Steven AI",
    "footer.pricing": "Pricing",
    "footer.howItWorks": "How It Works",
    "footer.becomeCoach": "Become a Coach",
    "footer.resources": "Resources",
    "footer.faq": "FAQ",
    "footer.about": "About",
    "footer.contact": "Contact",
    "footer.privacy": "Privacy Policy",
    "footer.terms": "Terms of Service",
    "footer.copyright": "© 2026 Lingueefy. Part of the Rusing Academy ecosystem.",
    
    // Coaches Page
    "coaches.title": "Find Your SLE Coach",
    "coaches.description": "Browse our network of specialized coaches who understand the Canadian federal public service language requirements. Filter by level, language, and specialization.",
    "coaches.filters": "Filters",
    "coaches.clearAll": "Clear all",
    "coaches.search": "Search coaches...",
    "coaches.language": "Language",
    "coaches.allLanguages": "All Languages",
    "coaches.french": "French",
    "coaches.english": "English",
    "coaches.specialization": "SLE Specialization",
    "coaches.priceRange": "Price Range (per hour)",
    "coaches.anyPrice": "Any Price",
    "coaches.under40": "Under $40",
    "coaches.40to60": "$40 - $60",
    "coaches.over60": "Over $60",
    "coaches.found": "coaches found",
    "coaches.viewProfile": "View Profile",
    "coaches.message": "Message",
    "coaches.reviews": "reviews",
    "coaches.sessions": "sessions",
    "coaches.respondsIn": "Responds in",
    "coaches.successRate": "success rate",
    "coaches.noResults": "No coaches found",
    "coaches.noResultsDesc": "Try adjusting your filters to see more results",
    
    // Featured Coaches
    "featured.title": "Meet Our Featured Coaches",
    "featured.description": "Learn from experienced SLE specialists who have helped hundreds of public servants achieve their language goals",
    "featured.stevenDesc": "Oral Exam Prep (Levels B & C) | Human-Centred Coaching. 15+ years helping public servants succeed with confidence and clarity.",
    "featured.sueanneDesc": "Structured Exam Prep | Oral & Written Precision. Methodical approach helps learners gain accuracy and results.",
    "featured.erikaDesc": "Exam Mindset | Performance Psychology. Builds emotional control, focus, and exam confidence.",
    "featured.viewProfile": "View Profile",
    "featured.viewAll": "View All Coaches",
    
    // Common
    "common.perHour": "/hour",
    "common.trial": "Trial",
    "common.bilingual": "Bilingual",
  },
  fr: {
    // Navigation
    "nav.findCoach": "Trouver un coach",
    "nav.aiCoach": "Prof Steven IA",
    "nav.howItWorks": "Comment ça marche",
    "nav.becomeCoach": "Devenir coach",
    "nav.signIn": "Connexion",
    "nav.getStarted": "Commencer",
    "nav.dashboard": "Tableau de bord",
    
    // Hero Section
    "hero.badge": "Plateforme linguistique #1 au Canada pour le GC/ELS",
    "hero.title": "Maîtrisez votre langue seconde pour la",
    "hero.titleHighlight": "fonction publique",
    "hero.description": "Connectez-vous avec des coachs spécialisés qui comprennent l'examen ELS. Pratiquez 24h/24 avec Prof Steven IA. Atteignez vos objectifs BBB, CBC ou CCC.",
    "hero.findCoach": "Trouver un coach",
    "hero.tryAI": "Essayer Prof Steven IA",
    "hero.socialProof": "Fonctionnaires",
    "hero.socialProofSub": "ont atteint leurs objectifs ELS",
    
    // AI Card
    "ai.title": "Prof Steven IA",
    "ai.subtitle": "Votre partenaire de pratique 24h/24",
    "ai.voicePractice": "Sessions de pratique vocale",
    "ai.placementTests": "Tests de classement ELS",
    "ai.examSimulations": "Simulations d'examen oral",
    "ai.startPractice": "Commencer la pratique gratuite",
    
    // SLE Levels
    "sle.title": "Préparez-vous pour tout niveau ELS",
    "sle.description": "Que vous partiez de zéro ou visiez le niveau le plus élevé, nos coachs se spécialisent dans toutes les compétences ELS.",
    "sle.levelA": "Niveau A",
    "sle.levelADesc": "Compétences d'interaction de base pour la communication simple au travail",
    "sle.levelB": "Niveau B",
    "sle.levelBDesc": "Maîtrise intermédiaire pour la plupart des postes fédéraux",
    "sle.levelC": "Niveau C",
    "sle.levelCDesc": "Maîtrise avancée pour les rôles de direction et spécialisés",
    "sle.skills": "Oral • Écrit • Lecture",
    
    // How It Works
    "how.title": "Comment fonctionne Lingueefy",
    "how.description": "Commencez en quelques minutes et débutez votre parcours vers le succès ELS",
    "how.step1Title": "Trouvez votre coach",
    "how.step1Desc": "Parcourez les coachs par spécialisation ELS, disponibilité et avis",
    "how.step2Title": "Réservez une session",
    "how.step2Desc": "Planifiez selon votre convenance avec des options de réservation flexibles",
    "how.step3Title": "Pratiquez avec l'IA",
    "how.step3Desc": "Utilisez Prof Steven IA pour une pratique illimitée entre les sessions",
    "how.step4Title": "Atteignez votre objectif",
    "how.step4Desc": "Réussissez votre examen ELS et faites avancer votre carrière fédérale",
    
    // Features
    "features.title": "Pourquoi choisir Lingueefy",
    "features.description": "La seule plateforme conçue spécifiquement pour l'apprentissage des langues dans la fonction publique fédérale canadienne",
    "features.sleCoaches": "Coachs spécialisés ELS",
    "features.sleCoachesDesc": "Chaque coach comprend les critères d'évaluation du Conseil du Trésor et le contexte du milieu de travail fédéral",
    "features.ai": "Prof Steven IA",
    "features.aiDesc": "Pratiquez 24h/24 avec des conversations alimentées par l'IA, des tests de classement et des simulations d'examen",
    "features.flexible": "Horaires flexibles",
    "features.flexibleDesc": "Réservez des sessions selon votre horaire de travail — matins, midis, soirs, fins de semaine",
    "features.bilingual": "Plateforme bilingue",
    "features.bilingualDesc": "Support complet pour l'apprentissage du français et de l'anglais avec des coachs de langue maternelle",
    "features.results": "Résultats prouvés",
    "features.resultsDesc": "Historique d'aide aux fonctionnaires pour atteindre leurs niveaux ELS cibles",
    "features.federal": "Contexte fédéral",
    "features.federalDesc": "Pratiquez avec des scénarios réels du milieu de travail : breffages, réunions, courriels, présentations",
    
    // CTA
    "cta.title": "Prêt à atteindre vos objectifs ELS?",
    "cta.description": "Rejoignez des centaines de fonctionnaires qui ont amélioré avec succès leurs compétences en langue seconde avec Lingueefy.",
    "cta.findCoach": "Trouver un coach",
    "cta.becomeCoach": "Devenir coach",
    
    // Footer
    "footer.tagline": "La plateforme de référence au Canada pour la préparation à la langue seconde GC/ELS.",
    "footer.forLearners": "Pour les apprenants",
    "footer.forCoaches": "Pour les coachs",
    "footer.company": "Entreprise",
    "footer.findCoach": "Trouver un coach",
    "footer.aiCoach": "Prof Steven IA",
    "footer.pricing": "Tarification",
    "footer.howItWorks": "Comment ça marche",
    "footer.becomeCoach": "Devenir coach",
    "footer.resources": "Ressources",
    "footer.faq": "FAQ",
    "footer.about": "À propos",
    "footer.contact": "Contact",
    "footer.privacy": "Politique de confidentialité",
    "footer.terms": "Conditions d'utilisation",
    "footer.copyright": "© 2026 Lingueefy. Fait partie de l'écosystème Rusing Academy.",
    
    // Coaches Page
    "coaches.title": "Trouvez votre coach ELS",
    "coaches.description": "Parcourez notre réseau de coachs spécialisés qui comprennent les exigences linguistiques de la fonction publique fédérale canadienne. Filtrez par niveau, langue et spécialisation.",
    "coaches.filters": "Filtres",
    "coaches.clearAll": "Tout effacer",
    "coaches.search": "Rechercher des coachs...",
    "coaches.language": "Langue",
    "coaches.allLanguages": "Toutes les langues",
    "coaches.french": "Français",
    "coaches.english": "Anglais",
    "coaches.specialization": "Spécialisation ELS",
    "coaches.priceRange": "Fourchette de prix (par heure)",
    "coaches.anyPrice": "Tout prix",
    "coaches.under40": "Moins de 40$",
    "coaches.40to60": "40$ - 60$",
    "coaches.over60": "Plus de 60$",
    "coaches.found": "coachs trouvés",
    "coaches.viewProfile": "Voir le profil",
    "coaches.message": "Message",
    "coaches.reviews": "avis",
    "coaches.sessions": "sessions",
    "coaches.respondsIn": "Répond en",
    "coaches.successRate": "taux de réussite",
    "coaches.noResults": "Aucun coach trouvé",
    "coaches.noResultsDesc": "Essayez d'ajuster vos filtres pour voir plus de résultats",
    
    // Featured Coaches
    "featured.title": "Rencontrez nos coachs vedettes",
    "featured.description": "Apprenez avec des spécialistes ELS expérimentés qui ont aidé des centaines de fonctionnaires à atteindre leurs objectifs linguistiques",
    "featured.stevenDesc": "Préparation aux examens oraux (Niveaux B & C) | Coaching centré sur l'humain. Plus de 15 ans à aider les fonctionnaires à réussir avec confiance.",
    "featured.sueanneDesc": "Préparation structurée aux examens | Précision orale et écrite. Approche méthodique pour des résultats précis.",
    "featured.erikaDesc": "Mentalité d'examen | Psychologie de la performance. Développe le contrôle émotionnel et la confiance.",
    "featured.viewProfile": "Voir le profil",
    "featured.viewAll": "Voir tous les coachs",
    
    // Common
    "common.perHour": "/heure",
    "common.trial": "Essai",
    "common.bilingual": "Bilingue",
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("lingueefy-language");
      if (saved === "en" || saved === "fr") return saved;
      // Auto-detect from browser
      const browserLang = navigator.language.toLowerCase();
      return browserLang.startsWith("fr") ? "fr" : "en";
    }
    return "en";
  });

  useEffect(() => {
    localStorage.setItem("lingueefy-language", language);
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
