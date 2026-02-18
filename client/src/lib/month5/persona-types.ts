/**
 * ============================================
 * PERSONA PATHWAYS — Type Definitions & Data
 * ============================================
 * Month 5: Content Strategy & Conversion
 * 
 * 6 Target Personas for Canadian Public Servants:
 * 1. Deadline-driven professionals
 * 2. Career advancement seekers
 * 3. Previous exam candidates
 * 4. Mid-career professionals (5-15 years)
 * 5. Remote & regional employees
 * 6. High achievers targeting Level C
 */

export type PersonaId =
  | "deadline-driven"
  | "career-advancement"
  | "previous-exam"
  | "mid-career"
  | "remote-regional"
  | "high-achiever";

export interface PersonaProfile {
  id: PersonaId;
  slug: string;
  label: { en: string; fr: string };
  tagline: { en: string; fr: string };
  description: { en: string; fr: string };
  icon: string;
  color: string;
  gradient: string;
  painPoints: { en: string[]; fr: string[] };
  motivations: { en: string[]; fr: string[] };
  ctaPrimary: { en: string; fr: string };
  ctaSecondary: { en: string; fr: string };
  ctaUrl: string;
  features: { en: string[]; fr: string[] };
  testimonialTag: string;
  examCountdown?: boolean;
  successRate?: string;
  targetLevel?: string;
}

export const PERSONA_PROFILES: Record<PersonaId, PersonaProfile> = {
  "deadline-driven": {
    id: "deadline-driven",
    slug: "fast-track",
    label: { en: "Fast-Track SLE Prep", fr: "Préparation accélérée à l'ELS" },
    tagline: {
      en: "Your exam is coming. We'll get you ready.",
      fr: "Votre examen approche. Nous vous préparerons.",
    },
    description: {
      en: "Intensive, focused preparation designed for professionals with upcoming SLE exam dates. Our accelerated programs compress months of training into weeks, targeting exactly what you need to pass.",
      fr: "Préparation intensive et ciblée conçue pour les professionnels ayant une date d'examen ELS à venir. Nos programmes accélérés condensent des mois de formation en semaines, ciblant exactement ce dont vous avez besoin pour réussir.",
    },
    icon: "Clock",
    color: "var(--brand-cta)",
    gradient: "from-orange-500/20 to-amber-500/10",
    painPoints: {
      en: ["Exam date approaching fast", "Limited preparation time", "Need targeted, efficient training", "Anxiety about exam performance"],
      fr: ["Date d'examen qui approche rapidement", "Temps de préparation limité", "Besoin d'une formation ciblée et efficace", "Anxiété face à la performance"],
    },
    motivations: {
      en: ["Pass the SLE on the first attempt", "Maintain current position requirements", "Unlock a pending promotion", "Meet departmental language obligations"],
      fr: ["Réussir l'ELS du premier coup", "Maintenir les exigences du poste actuel", "Débloquer une promotion en attente", "Respecter les obligations linguistiques"],
    },
    ctaPrimary: { en: "Start Your Fast-Track Program", fr: "Commencer votre programme accéléré" },
    ctaSecondary: { en: "Book a Free Assessment", fr: "Réserver une évaluation gratuite" },
    ctaUrl: "/assessment",
    features: {
      en: ["Intensive 4-8 week programs", "Daily practice with AI companion", "Exam simulation under real conditions", "Personalized weakness targeting", "Countdown-based study plans"],
      fr: ["Programmes intensifs de 4 à 8 semaines", "Pratique quotidienne avec compagnon IA", "Simulation d'examen en conditions réelles", "Ciblage personnalisé des faiblesses", "Plans d'étude avec compte à rebours"],
    },
    testimonialTag: "fast-track",
    examCountdown: true,
    successRate: "95%",
    targetLevel: "B/C",
  },

  "career-advancement": {
    id: "career-advancement",
    slug: "career-growth",
    label: { en: "Career Advancement Pathway", fr: "Parcours d'avancement professionnel" },
    tagline: {
      en: "Level C is your ticket to executive leadership.",
      fr: "Le niveau C est votre billet vers le leadership exécutif.",
    },
    description: {
      en: "Strategic language investment for ambitious professionals targeting executive positions. Achieving Level C opens doors to EX-level roles, committee leadership, and senior management opportunities across the federal public service.",
      fr: "Investissement linguistique stratégique pour les professionnels ambitieux visant des postes de direction. L'atteinte du niveau C ouvre les portes aux rôles de niveau EX et aux opportunités de gestion supérieure dans la fonction publique fédérale.",
    },
    icon: "TrendingUp",
    color: "var(--brand-foundation)",
    gradient: "from-teal-500/20 to-emerald-500/10",
    painPoints: {
      en: ["Language profile blocking career progression", "Competing with bilingual candidates", "Need Level C for executive positions", "ROI concerns about training investment"],
      fr: ["Profil linguistique bloquant la progression", "Concurrence avec des candidats bilingues", "Besoin du niveau C pour les postes de direction", "Préoccupations sur le retour sur investissement"],
    },
    motivations: {
      en: ["Qualify for EX-level positions", "Lead bilingual teams with confidence", "Increase earning potential by 15-25%", "Stand out in executive competitions"],
      fr: ["Se qualifier pour les postes de niveau EX", "Diriger des équipes bilingues avec confiance", "Augmenter le potentiel de revenus de 15 à 25 %", "Se démarquer dans les concours exécutifs"],
    },
    ctaPrimary: { en: "Explore Executive Language Programs", fr: "Explorer les programmes linguistiques exécutifs" },
    ctaSecondary: { en: "Calculate Your ROI", fr: "Calculez votre retour sur investissement" },
    ctaUrl: "/courses",
    features: {
      en: ["Level C achievement roadmap", "Executive communication coaching", "Briefing and presentation practice", "Ministerial correspondence training", "Career ROI analysis included"],
      fr: ["Feuille de route pour l'atteinte du niveau C", "Coaching en communication exécutive", "Pratique de breffage et de présentation", "Formation en correspondance ministérielle", "Analyse du retour sur investissement incluse"],
    },
    testimonialTag: "career-advancement",
    successRate: "95%",
    targetLevel: "C",
  },

  "previous-exam": {
    id: "previous-exam",
    slug: "second-chance",
    label: { en: "Your Second Chance Starts Here", fr: "Votre deuxième chance commence ici" },
    tagline: {
      en: "Past results don't define your future. Our methodology does.",
      fr: "Les résultats passés ne définissent pas votre avenir. Notre méthodologie, oui.",
    },
    description: {
      en: "A different approach for a different result. If you've attempted the SLE before and didn't achieve your target, our diagnostic-first methodology identifies exactly where previous preparation fell short — and builds a personalized plan to close those gaps.",
      fr: "Une approche différente pour un résultat différent. Si vous avez déjà tenté l'ELS sans atteindre votre objectif, notre méthodologie diagnostique identifie exactement où la préparation précédente a échoué — et construit un plan personnalisé pour combler ces lacunes.",
    },
    icon: "Target",
    color: "#6B7280",
    gradient: "from-slate-500/20 to-gray-500/10",
    painPoints: {
      en: ["Failed a previous SLE attempt", "Discouraged by past results", "Unsure what went wrong", "Fear of repeating the same mistakes"],
      fr: ["Échec à une tentative précédente de l'ELS", "Découragé par les résultats passés", "Incertain de ce qui n'a pas fonctionné", "Peur de répéter les mêmes erreurs"],
    },
    motivations: {
      en: ["Understand why previous attempt failed", "Use a proven, different methodology", "Build confidence through incremental wins", "Finally achieve the target level"],
      fr: ["Comprendre pourquoi la tentative précédente a échoué", "Utiliser une méthodologie éprouvée et différente", "Bâtir la confiance par des victoires progressives", "Enfin atteindre le niveau cible"],
    },
    ctaPrimary: { en: "Get Your Free Diagnostic", fr: "Obtenez votre diagnostic gratuit" },
    ctaSecondary: { en: "See Our Success Stories", fr: "Voir nos histoires de réussite" },
    ctaUrl: "/diagnostic",
    features: {
      en: ["Comprehensive gap analysis", "Personalized remediation plan", "95% success rate with our methodology", "Confidence-building milestones", "Exam anxiety management techniques"],
      fr: ["Analyse complète des lacunes", "Plan de remédiation personnalisé", "Taux de réussite de 95 % avec notre méthodologie", "Jalons de renforcement de la confiance", "Techniques de gestion de l'anxiété d'examen"],
    },
    testimonialTag: "second-chance",
    successRate: "95%",
  },

  "mid-career": {
    id: "mid-career",
    slug: "mid-career",
    label: { en: "Mid-Career Language Mastery", fr: "Maîtrise linguistique en mi-carrière" },
    tagline: {
      en: "5-15 years in. Ready for the next chapter.",
      fr: "5 à 15 ans d'expérience. Prêt pour le prochain chapitre.",
    },
    description: {
      en: "Designed for established professionals transitioning into leadership roles. Our flexible programs respect your experience while building the bilingual competencies needed for the next stage of your career in the federal public service.",
      fr: "Conçu pour les professionnels établis en transition vers des rôles de leadership. Nos programmes flexibles respectent votre expérience tout en développant les compétences bilingues nécessaires pour la prochaine étape de votre carrière dans la fonction publique fédérale.",
    },
    icon: "Briefcase",
    color: "#7C3AED",
    gradient: "from-violet-500/20 to-purple-500/10",
    painPoints: {
      en: ["Balancing training with heavy workload", "Feeling too senior to be a student again", "Need flexible scheduling around meetings", "Peer pressure about language skills"],
      fr: ["Équilibrer la formation avec une charge de travail lourde", "Se sentir trop expérimenté pour redevenir étudiant", "Besoin d'horaires flexibles autour des réunions", "Pression des pairs concernant les compétences linguistiques"],
    },
    motivations: {
      en: ["Transition into leadership roles", "Earn respect as a bilingual leader", "Set an example for the team", "Prepare for executive competitions"],
      fr: ["Transition vers des rôles de leadership", "Gagner le respect en tant que leader bilingue", "Donner l'exemple à l'équipe", "Se préparer aux concours exécutifs"],
    },
    ctaPrimary: { en: "Explore Flexible Programs", fr: "Explorer les programmes flexibles" },
    ctaSecondary: { en: "Read Peer Testimonials", fr: "Lire les témoignages de pairs" },
    ctaUrl: "/courses",
    features: {
      en: ["Flexible evening and weekend sessions", "Self-paced AI practice modules", "Peer learning groups for professionals", "Leadership-context language training", "Respect for your professional experience"],
      fr: ["Séances flexibles en soirée et fin de semaine", "Modules de pratique IA à votre rythme", "Groupes d'apprentissage entre pairs", "Formation linguistique en contexte de leadership", "Respect de votre expérience professionnelle"],
    },
    testimonialTag: "mid-career",
    successRate: "95%",
  },

  "remote-regional": {
    id: "remote-regional",
    slug: "remote-learning",
    label: { en: "Remote & Regional Learning", fr: "Apprentissage à distance et régional" },
    tagline: {
      en: "World-class SLE prep, wherever you are in Canada.",
      fr: "Préparation à l'ELS de classe mondiale, où que vous soyez au Canada.",
    },
    description: {
      en: "Location should never limit your language training. Our fully online programs deliver the same quality coaching and AI-powered practice to public servants across Canada — from Vancouver to Halifax, Yellowknife to Moncton.",
      fr: "L'emplacement ne devrait jamais limiter votre formation linguistique. Nos programmes entièrement en ligne offrent le même coaching de qualité et la même pratique alimentée par l'IA aux fonctionnaires partout au Canada — de Vancouver à Halifax, de Yellowknife à Moncton.",
    },
    icon: "MapPin",
    color: "#0EA5E9",
    gradient: "from-sky-500/20 to-blue-500/10",
    painPoints: {
      en: ["No quality language training available locally", "Time zone challenges for live sessions", "Feeling isolated from NCR resources", "Limited access to SLE-specialized coaches"],
      fr: ["Aucune formation linguistique de qualité disponible localement", "Défis de fuseaux horaires pour les séances en direct", "Sentiment d'isolement des ressources de la RCN", "Accès limité aux coaches spécialisés en ELS"],
    },
    motivations: {
      en: ["Access NCR-quality training from anywhere", "Flexible scheduling across time zones", "Connect with a national community of learners", "Prove that location doesn't limit career growth"],
      fr: ["Accéder à une formation de qualité RCN de n'importe où", "Horaires flexibles à travers les fuseaux horaires", "Se connecter à une communauté nationale d'apprenants", "Prouver que l'emplacement ne limite pas la croissance de carrière"],
    },
    ctaPrimary: { en: "Start Learning Online", fr: "Commencer l'apprentissage en ligne" },
    ctaSecondary: { en: "See How It Works", fr: "Voir comment ça fonctionne" },
    ctaUrl: "/courses",
    features: {
      en: ["100% online delivery", "Flexible scheduling across all time zones", "24/7 AI practice companion", "Live video coaching sessions", "National peer learning community"],
      fr: ["Livraison 100 % en ligne", "Horaires flexibles pour tous les fuseaux horaires", "Compagnon de pratique IA 24/7", "Séances de coaching vidéo en direct", "Communauté nationale d'apprentissage entre pairs"],
    },
    testimonialTag: "remote",
  },

  "high-achiever": {
    id: "high-achiever",
    slug: "level-c-excellence",
    label: { en: "Level C Excellence Program", fr: "Programme d'excellence niveau C" },
    tagline: {
      en: "For those who accept nothing less than CCC.",
      fr: "Pour ceux qui n'acceptent rien de moins que CCC.",
    },
    description: {
      en: "Our most advanced program for high-performing professionals targeting CCC proficiency. Work with our elite coaches — former SLE evaluators and senior federal executives — to master the nuanced communication skills that distinguish Level C candidates.",
      fr: "Notre programme le plus avancé pour les professionnels performants visant la compétence CCC. Travaillez avec nos coaches d'élite — anciens évaluateurs de l'ELS et cadres supérieurs fédéraux — pour maîtriser les compétences de communication nuancées qui distinguent les candidats de niveau C.",
    },
    icon: "Trophy",
    color: "#D97706",
    gradient: "from-amber-500/20 to-yellow-500/10",
    painPoints: {
      en: ["Already at Level B, need the final push to C", "Nuanced language skills are hard to self-teach", "Need expert-level coaching, not basic instruction", "High stakes — executive career depends on it"],
      fr: ["Déjà au niveau B, besoin du dernier effort vers le C", "Les compétences linguistiques nuancées sont difficiles à auto-enseigner", "Besoin d'un coaching de niveau expert", "Enjeux élevés — la carrière exécutive en dépend"],
    },
    motivations: {
      en: ["Achieve CCC designation", "Master executive-level communication", "Access the most senior federal positions", "Join an elite group of bilingual leaders"],
      fr: ["Obtenir la désignation CCC", "Maîtriser la communication de niveau exécutif", "Accéder aux postes fédéraux les plus élevés", "Rejoindre un groupe d'élite de leaders bilingues"],
    },
    ctaPrimary: { en: "Apply for Level C Program", fr: "Postuler au programme niveau C" },
    ctaSecondary: { en: "Meet Our Expert Coaches", fr: "Rencontrer nos coaches experts" },
    ctaUrl: "/courses",
    features: {
      en: ["Elite coaches (former SLE evaluators)", "Advanced nuance and register training", "Executive scenario simulations", "Ministerial-level writing workshops", "Guaranteed results or continued coaching"],
      fr: ["Coaches d'élite (anciens évaluateurs de l'ELS)", "Formation avancée en nuance et registre", "Simulations de scénarios exécutifs", "Ateliers d'écriture de niveau ministériel", "Résultats garantis ou coaching continu"],
    },
    testimonialTag: "level-c",
    successRate: "95%",
    targetLevel: "C",
  },
};

export const PERSONA_ORDER: PersonaId[] = [
  "deadline-driven",
  "career-advancement",
  "previous-exam",
  "mid-career",
  "remote-regional",
  "high-achiever",
];

/** Behavior signals used for dynamic persona detection */
export interface UserBehaviorSignals {
  pageVisits: string[];
  timeOnSite: number;
  scrollDepth: number;
  clickedElements: string[];
  referralSource: string;
  searchTerms: string[];
  returnVisitor: boolean;
  deviceType: "mobile" | "tablet" | "desktop";
  timeZone: string;
  language: "en" | "fr";
}

/** Score a user against each persona based on behavior signals */
export function scorePersona(signals: UserBehaviorSignals): Record<PersonaId, number> {
  const scores: Record<PersonaId, number> = {
    "deadline-driven": 0,
    "career-advancement": 0,
    "previous-exam": 0,
    "mid-career": 0,
    "remote-regional": 0,
    "high-achiever": 0,
  };

  // Deadline-driven signals
  if (signals.searchTerms.some(t => /exam|test|sle|els|deadline|urgent|fast/i.test(t))) scores["deadline-driven"] += 3;
  if (signals.pageVisits.includes("/assessment") || signals.pageVisits.includes("/diagnostic")) scores["deadline-driven"] += 2;
  if (signals.timeOnSite < 120) scores["deadline-driven"] += 1; // Quick, focused browsing

  // Career advancement signals
  if (signals.searchTerms.some(t => /career|executive|promotion|level c|niveau c|ex-/i.test(t))) scores["career-advancement"] += 3;
  if (signals.pageVisits.includes("/courses")) scores["career-advancement"] += 1;
  if (signals.clickedElements.some(e => /roi|salary|career/i.test(e))) scores["career-advancement"] += 2;

  // Previous exam signals
  if (signals.searchTerms.some(t => /fail|retry|again|second|improve|échec/i.test(t))) scores["previous-exam"] += 3;
  if (signals.returnVisitor) scores["previous-exam"] += 2;
  if (signals.pageVisits.includes("/diagnostic")) scores["previous-exam"] += 2;

  // Mid-career signals
  if (signals.searchTerms.some(t => /flexible|evening|weekend|balance|mid-career/i.test(t))) scores["mid-career"] += 3;
  if (signals.clickedElements.some(e => /testimonial|peer|experience/i.test(e))) scores["mid-career"] += 2;

  // Remote/regional signals
  if (signals.searchTerms.some(t => /online|remote|virtual|distance/i.test(t))) scores["remote-regional"] += 3;
  if (!["America/Toronto", "America/Montreal"].includes(signals.timeZone)) scores["remote-regional"] += 2;
  if (signals.deviceType === "mobile") scores["remote-regional"] += 1;

  // High achiever signals
  if (signals.searchTerms.some(t => /level c|ccc|advanced|expert|excellence/i.test(t))) scores["high-achiever"] += 3;
  if (signals.pageVisits.includes("/coaches")) scores["high-achiever"] += 1;
  if (signals.clickedElements.some(e => /advanced|elite|expert/i.test(e))) scores["high-achiever"] += 2;

  return scores;
}

/** Get the top persona based on behavior scoring */
export function detectPersona(signals: UserBehaviorSignals): PersonaId {
  const scores = scorePersona(signals);
  let topPersona: PersonaId = "deadline-driven";
  let topScore = 0;
  for (const [id, score] of Object.entries(scores)) {
    if (score > topScore) {
      topScore = score;
      topPersona = id as PersonaId;
    }
  }
  return topPersona;
}
