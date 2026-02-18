/**
 * ============================================
 * TESTIMONIALS & CASE STUDIES — Data Layer
 * ============================================
 * Month 5: Content Strategy & Conversion
 * 
 * Testimonial data from Kudoboard integration,
 * case study profiles, and trust badge statistics.
 */

export interface Testimonial {
  id: string;
  name: string;
  role: { en: string; fr: string };
  department: { en: string; fr: string };
  quote: { en: string; fr: string };
  rating: number;
  achievedLevel: string;
  previousLevel?: string;
  photoUrl?: string;
  date: string;
  personaTag: string;
  featured: boolean;
  source: "kudoboard" | "direct" | "survey";
}

export interface CaseStudy {
  id: string;
  name: string;
  role: { en: string; fr: string };
  department: { en: string; fr: string };
  photoUrl?: string;
  challenge: { en: string; fr: string };
  solution: { en: string; fr: string };
  result: { en: string; fr: string };
  quote: { en: string; fr: string };
  previousLevel: string;
  achievedLevel: string;
  timeframe: { en: string; fr: string };
  keyMetrics: { label: { en: string; fr: string }; value: string }[];
  personaTag: string;
}

export interface TrustBadge {
  id: string;
  value: string;
  label: { en: string; fr: string };
  icon: string;
  color: string;
}

// ─── TESTIMONIALS ────────────────────────────────────────────────────────────

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "t1",
    name: "Marie-Claire D.",
    role: { en: "Policy Analyst, EC-06", fr: "Analyste de politiques, EC-06" },
    department: { en: "Treasury Board Secretariat", fr: "Secrétariat du Conseil du Trésor" },
    quote: {
      en: "I had failed my SLE oral exam twice before finding RusingAcademy. Their diagnostic approach identified exactly where I was losing marks. Within 8 weeks, I achieved my BBB. The AI companion was a game-changer for daily practice.",
      fr: "J'avais échoué deux fois à mon examen oral de l'ELS avant de trouver RusingAcademy. Leur approche diagnostique a identifié exactement où je perdais des points. En 8 semaines, j'ai obtenu mon BBB. Le compagnon IA a été un atout majeur pour la pratique quotidienne.",
    },
    rating: 5,
    achievedLevel: "BBB",
    previousLevel: "ABA",
    date: "2025-11-15",
    personaTag: "second-chance",
    featured: true,
    source: "kudoboard",
  },
  {
    id: "t2",
    name: "James K.",
    role: { en: "Director, EX-01", fr: "Directeur, EX-01" },
    department: { en: "Employment and Social Development Canada", fr: "Emploi et Développement social Canada" },
    quote: {
      en: "Achieving CCC was the final piece for my executive career. RusingAcademy's Level C program connected me with a coach who had been an SLE evaluator. The nuanced training in register and tone made all the difference. I passed on my first attempt.",
      fr: "L'obtention du CCC était la dernière pièce du puzzle pour ma carrière de cadre. Le programme de niveau C de RusingAcademy m'a mis en contact avec un coach qui avait été évaluateur de l'ELS. La formation nuancée en registre et en ton a fait toute la différence. J'ai réussi du premier coup.",
    },
    rating: 5,
    achievedLevel: "CCC",
    previousLevel: "BBB",
    date: "2025-10-22",
    personaTag: "level-c",
    featured: true,
    source: "kudoboard",
  },
  {
    id: "t3",
    name: "Sarah M.",
    role: { en: "Program Manager, PM-06", fr: "Gestionnaire de programme, PM-06" },
    department: { en: "Immigration, Refugees and Citizenship Canada", fr: "Immigration, Réfugiés et Citoyenneté Canada" },
    quote: {
      en: "With my exam only 6 weeks away, I was panicking. RusingAcademy's fast-track program was exactly what I needed — intensive, focused, and perfectly structured. The countdown-based study plan kept me on track every single day.",
      fr: "Avec mon examen dans seulement 6 semaines, je paniquais. Le programme accéléré de RusingAcademy était exactement ce dont j'avais besoin — intensif, ciblé et parfaitement structuré. Le plan d'étude avec compte à rebours m'a gardée sur la bonne voie chaque jour.",
    },
    rating: 5,
    achievedLevel: "CBC",
    date: "2025-09-30",
    personaTag: "fast-track",
    featured: true,
    source: "direct",
  },
  {
    id: "t4",
    name: "David L.",
    role: { en: "Senior Advisor, AS-07", fr: "Conseiller principal, AS-07" },
    department: { en: "Public Services and Procurement Canada", fr: "Services publics et Approvisionnement Canada" },
    quote: {
      en: "After 12 years in the public service, going back to language training felt daunting. RusingAcademy treated me as a professional, not a student. The flexible evening sessions and peer learning groups made all the difference. I achieved my BBB while managing a full workload.",
      fr: "Après 12 ans dans la fonction publique, retourner en formation linguistique semblait intimidant. RusingAcademy m'a traité comme un professionnel, pas comme un étudiant. Les séances flexibles en soirée et les groupes d'apprentissage entre pairs ont fait toute la différence. J'ai obtenu mon BBB tout en gérant une charge de travail complète.",
    },
    rating: 5,
    achievedLevel: "BBB",
    date: "2025-08-18",
    personaTag: "mid-career",
    featured: true,
    source: "kudoboard",
  },
  {
    id: "t5",
    name: "Priya S.",
    role: { en: "Financial Officer, FI-03", fr: "Agente financière, FI-03" },
    department: { en: "Department of National Defence", fr: "Ministère de la Défense nationale" },
    quote: {
      en: "Working from Winnipeg, I thought quality SLE preparation was only available in Ottawa. RusingAcademy proved me wrong. The online delivery was seamless, and the AI companion meant I could practice at any time. I achieved my BBB without ever leaving Manitoba.",
      fr: "Travaillant depuis Winnipeg, je pensais que la préparation de qualité à l'ELS n'était disponible qu'à Ottawa. RusingAcademy m'a prouvé le contraire. La livraison en ligne était impeccable, et le compagnon IA me permettait de pratiquer à tout moment. J'ai obtenu mon BBB sans jamais quitter le Manitoba.",
    },
    rating: 5,
    achievedLevel: "BBB",
    date: "2025-07-25",
    personaTag: "remote",
    featured: false,
    source: "survey",
  },
  {
    id: "t6",
    name: "Robert T.",
    role: { en: "Team Lead, CS-04", fr: "Chef d'équipe, CS-04" },
    department: { en: "Shared Services Canada", fr: "Services partagés Canada" },
    quote: {
      en: "The ROI was clear from day one. My Level C designation opened the door to an EX-minus-1 position within 3 months of passing. RusingAcademy's career-focused approach helped me see language training as a strategic investment, not just an obligation.",
      fr: "Le retour sur investissement était clair dès le premier jour. Ma désignation de niveau C m'a ouvert la porte à un poste EX-moins-1 dans les 3 mois suivant ma réussite. L'approche axée sur la carrière de RusingAcademy m'a aidé à voir la formation linguistique comme un investissement stratégique, pas seulement une obligation.",
    },
    rating: 5,
    achievedLevel: "CBC",
    previousLevel: "BBB",
    date: "2025-12-05",
    personaTag: "career-advancement",
    featured: true,
    source: "kudoboard",
  },
  {
    id: "t7",
    name: "Amina B.",
    role: { en: "Communications Advisor, IS-04", fr: "Conseillère en communications, IS-04" },
    department: { en: "Canadian Heritage", fr: "Patrimoine canadien" },
    quote: {
      en: "What sets RusingAcademy apart is their understanding of the federal context. Every practice scenario was relevant to my actual work — briefing notes, committee discussions, ministerial correspondence. It wasn't generic language training; it was career preparation.",
      fr: "Ce qui distingue RusingAcademy, c'est leur compréhension du contexte fédéral. Chaque scénario de pratique était pertinent à mon travail réel — notes de breffage, discussions en comité, correspondance ministérielle. Ce n'était pas de la formation linguistique générique ; c'était de la préparation de carrière.",
    },
    rating: 5,
    achievedLevel: "CBC",
    date: "2025-11-28",
    personaTag: "career-advancement",
    featured: false,
    source: "direct",
  },
  {
    id: "t8",
    name: "Michael W.",
    role: { en: "Economist, EC-05", fr: "Économiste, EC-05" },
    department: { en: "Finance Canada", fr: "Finances Canada" },
    quote: {
      en: "After failing my written exam, I was ready to give up on bilingual positions entirely. RusingAcademy's second-chance program rebuilt my confidence step by step. The diagnostic showed me I was closer than I thought — I just needed targeted help with specific grammar patterns.",
      fr: "Après avoir échoué à mon examen écrit, j'étais prêt à abandonner complètement les postes bilingues. Le programme de deuxième chance de RusingAcademy a reconstruit ma confiance étape par étape. Le diagnostic m'a montré que j'étais plus proche que je ne le pensais — j'avais juste besoin d'aide ciblée avec des structures grammaticales spécifiques.",
    },
    rating: 5,
    achievedLevel: "BBB",
    previousLevel: "BAA",
    date: "2025-10-10",
    personaTag: "second-chance",
    featured: false,
    source: "kudoboard",
  },
];

// ─── CASE STUDIES ────────────────────────────────────────────────────────────

export const CASE_STUDIES: CaseStudy[] = [
  {
    id: "cs1",
    name: "Marie-Claire Dupont",
    role: { en: "Policy Analyst → Senior Policy Advisor", fr: "Analyste de politiques → Conseillère principale en politiques" },
    department: { en: "Treasury Board Secretariat", fr: "Secrétariat du Conseil du Trésor" },
    challenge: {
      en: "Marie-Claire had failed her SLE oral exam twice, scoring just below the B threshold. Traditional classroom training wasn't addressing her specific weaknesses in spontaneous conversation and register switching.",
      fr: "Marie-Claire avait échoué deux fois à son examen oral de l'ELS, obtenant un score juste en dessous du seuil B. La formation traditionnelle en classe ne traitait pas ses faiblesses spécifiques en conversation spontanée et en changement de registre.",
    },
    solution: {
      en: "Our diagnostic identified two critical gaps: hesitation patterns during opinion-based questions and inconsistent use of formal register. We paired her with a coach specializing in oral fluency and supplemented with daily AI companion sessions focused on spontaneous response training.",
      fr: "Notre diagnostic a identifié deux lacunes critiques : des schémas d'hésitation lors des questions d'opinion et une utilisation incohérente du registre formel. Nous l'avons jumelée avec un coach spécialisé en fluidité orale et avons complété avec des séances quotidiennes de compagnon IA axées sur la formation à la réponse spontanée.",
    },
    result: {
      en: "After 8 weeks of targeted preparation, Marie-Claire achieved BBB on her third attempt — scoring well above the threshold. She was promoted to Senior Policy Advisor within 4 months.",
      fr: "Après 8 semaines de préparation ciblée, Marie-Claire a obtenu BBB à sa troisième tentative — avec un score bien au-dessus du seuil. Elle a été promue Conseillère principale en politiques dans les 4 mois suivants.",
    },
    quote: {
      en: "RusingAcademy didn't just help me pass — they helped me understand why I was failing. That made all the difference.",
      fr: "RusingAcademy ne m'a pas seulement aidée à réussir — ils m'ont aidée à comprendre pourquoi j'échouais. Cela a fait toute la différence.",
    },
    previousLevel: "ABA",
    achievedLevel: "BBB",
    timeframe: { en: "8 weeks", fr: "8 semaines" },
    keyMetrics: [
      { label: { en: "Previous attempts", fr: "Tentatives précédentes" }, value: "2" },
      { label: { en: "Training duration", fr: "Durée de la formation" }, value: "8 weeks" },
      { label: { en: "Level achieved", fr: "Niveau atteint" }, value: "BBB" },
      { label: { en: "Promotion timeline", fr: "Délai de promotion" }, value: "4 months" },
    ],
    personaTag: "second-chance",
  },
  {
    id: "cs2",
    name: "James Kowalski",
    role: { en: "Manager → Director (EX-01)", fr: "Gestionnaire → Directeur (EX-01)" },
    department: { en: "Employment and Social Development Canada", fr: "Emploi et Développement social Canada" },
    challenge: {
      en: "James had solid BBB results but needed CCC to qualify for an EX-01 competition. The gap between B and C level requires mastery of nuance, sophisticated vocabulary, and the ability to discuss complex policy issues with native-like fluency.",
      fr: "James avait de solides résultats BBB mais avait besoin du CCC pour se qualifier à un concours EX-01. L'écart entre les niveaux B et C exige la maîtrise de la nuance, un vocabulaire sophistiqué et la capacité de discuter de questions politiques complexes avec une fluidité quasi native.",
    },
    solution: {
      en: "We enrolled James in our Level C Excellence Program, pairing him with a former SLE evaluator who understood exactly what distinguishes a C from a B response. Training focused on executive scenarios: chairing bilingual meetings, delivering policy briefings, and handling sensitive parliamentary questions.",
      fr: "Nous avons inscrit James à notre Programme d'excellence niveau C, le jumelant avec un ancien évaluateur de l'ELS qui comprenait exactement ce qui distingue une réponse C d'une réponse B. La formation s'est concentrée sur des scénarios exécutifs : présider des réunions bilingues, livrer des breffages politiques et traiter des questions parlementaires sensibles.",
    },
    result: {
      en: "James achieved CCC after 12 weeks of intensive training. He successfully competed for and was appointed to an EX-01 Director position within 6 months, with a salary increase of over $25,000 annually.",
      fr: "James a obtenu CCC après 12 semaines de formation intensive. Il a réussi le concours et a été nommé à un poste de directeur EX-01 dans les 6 mois, avec une augmentation de salaire de plus de 25 000 $ par année.",
    },
    quote: {
      en: "The Level C program was the best career investment I've ever made. The ROI was immediate and transformative.",
      fr: "Le programme de niveau C a été le meilleur investissement de carrière que j'aie jamais fait. Le retour sur investissement a été immédiat et transformateur.",
    },
    previousLevel: "BBB",
    achievedLevel: "CCC",
    timeframe: { en: "12 weeks", fr: "12 semaines" },
    keyMetrics: [
      { label: { en: "Starting level", fr: "Niveau de départ" }, value: "BBB" },
      { label: { en: "Training duration", fr: "Durée de la formation" }, value: "12 weeks" },
      { label: { en: "Level achieved", fr: "Niveau atteint" }, value: "CCC" },
      { label: { en: "Salary increase", fr: "Augmentation de salaire" }, value: "$25,000+" },
    ],
    personaTag: "level-c",
  },
  {
    id: "cs3",
    name: "Priya Sharma",
    role: { en: "Financial Officer, FI-03", fr: "Agente financière, FI-03" },
    department: { en: "Department of National Defence", fr: "Ministère de la Défense nationale" },
    challenge: {
      en: "Based in Winnipeg, Priya had no access to quality SLE preparation locally. Previous attempts with generic online courses hadn't prepared her for the specific format and expectations of the SLE. She needed specialized coaching but couldn't relocate to Ottawa.",
      fr: "Basée à Winnipeg, Priya n'avait pas accès à une préparation de qualité à l'ELS localement. Les tentatives précédentes avec des cours en ligne génériques ne l'avaient pas préparée au format et aux attentes spécifiques de l'ELS. Elle avait besoin d'un coaching spécialisé mais ne pouvait pas déménager à Ottawa.",
    },
    solution: {
      en: "Our fully online program provided Priya with the same quality coaching available to NCR-based public servants. We matched her with a coach who offered evening sessions (accommodating the time zone difference) and supplemented with our 24/7 AI companion for daily practice.",
      fr: "Notre programme entièrement en ligne a offert à Priya le même coaching de qualité disponible pour les fonctionnaires de la RCN. Nous l'avons jumelée avec un coach offrant des séances en soirée (tenant compte du décalage horaire) et avons complété avec notre compagnon IA 24/7 pour la pratique quotidienne.",
    },
    result: {
      en: "Priya achieved BBB after 10 weeks of online training, proving that location is no barrier to SLE success. She has since been promoted and now advocates for remote language training options within her department.",
      fr: "Priya a obtenu BBB après 10 semaines de formation en ligne, prouvant que l'emplacement n'est pas un obstacle à la réussite de l'ELS. Elle a depuis été promue et milite maintenant pour des options de formation linguistique à distance au sein de son ministère.",
    },
    quote: {
      en: "I proved that you don't need to be in Ottawa to get world-class SLE preparation. RusingAcademy brought the NCR to me.",
      fr: "J'ai prouvé qu'il n'est pas nécessaire d'être à Ottawa pour obtenir une préparation de classe mondiale à l'ELS. RusingAcademy a amené la RCN chez moi.",
    },
    previousLevel: "AAA",
    achievedLevel: "BBB",
    timeframe: { en: "10 weeks", fr: "10 semaines" },
    keyMetrics: [
      { label: { en: "Location", fr: "Emplacement" }, value: "Winnipeg, MB" },
      { label: { en: "Training duration", fr: "Durée de la formation" }, value: "10 weeks" },
      { label: { en: "Level achieved", fr: "Niveau atteint" }, value: "BBB" },
      { label: { en: "Delivery", fr: "Mode de livraison" }, value: "100% online" },
    ],
    personaTag: "remote",
  },
  {
    id: "cs4",
    name: "David Leblanc",
    role: { en: "Senior Advisor → Team Lead", fr: "Conseiller principal → Chef d'équipe" },
    department: { en: "Public Services and Procurement Canada", fr: "Services publics et Approvisionnement Canada" },
    challenge: {
      en: "With 12 years of public service experience, David felt uncomfortable returning to a classroom setting. His busy schedule as a senior advisor left little time for traditional language training, and he needed a program that respected his professional maturity.",
      fr: "Avec 12 ans d'expérience dans la fonction publique, David se sentait mal à l'aise de retourner dans un cadre de classe. Son emploi du temps chargé en tant que conseiller principal laissait peu de temps pour la formation linguistique traditionnelle, et il avait besoin d'un programme qui respectait sa maturité professionnelle.",
    },
    solution: {
      en: "Our mid-career program offered David flexible evening and weekend sessions, peer learning groups with other senior professionals, and leadership-context language training. We focused on the communication scenarios he actually faced in his role.",
      fr: "Notre programme de mi-carrière a offert à David des séances flexibles en soirée et en fin de semaine, des groupes d'apprentissage entre pairs avec d'autres professionnels expérimentés, et une formation linguistique en contexte de leadership. Nous nous sommes concentrés sur les scénarios de communication qu'il rencontrait réellement dans son rôle.",
    },
    result: {
      en: "David achieved BBB in 14 weeks while maintaining his full workload. The peer learning component was particularly valuable — he built a network of bilingual professionals that continues to support his career growth.",
      fr: "David a obtenu BBB en 14 semaines tout en maintenant sa charge de travail complète. La composante d'apprentissage entre pairs a été particulièrement précieuse — il a construit un réseau de professionnels bilingues qui continue de soutenir sa croissance de carrière.",
    },
    quote: {
      en: "RusingAcademy treated me as a professional, not a student. That respect made me more committed to the process.",
      fr: "RusingAcademy m'a traité comme un professionnel, pas comme un étudiant. Ce respect m'a rendu plus engagé dans le processus.",
    },
    previousLevel: "ABA",
    achievedLevel: "BBB",
    timeframe: { en: "14 weeks", fr: "14 semaines" },
    keyMetrics: [
      { label: { en: "Years of service", fr: "Années de service" }, value: "12" },
      { label: { en: "Training duration", fr: "Durée de la formation" }, value: "14 weeks" },
      { label: { en: "Level achieved", fr: "Niveau atteint" }, value: "BBB" },
      { label: { en: "Schedule impact", fr: "Impact sur l'horaire" }, value: "Zero" },
    ],
    personaTag: "mid-career",
  },
];

// ─── TRUST BADGES ────────────────────────────────────────────────────────────

export const TRUST_BADGES: TrustBadge[] = [
  {
    id: "success-rate",
    value: "95%",
    label: { en: "Success Rate", fr: "Taux de réussite" },
    icon: "Award",
    color: "var(--brand-cta)",
  },
  {
    id: "years-experience",
    value: "10+",
    label: { en: "Years of Experience", fr: "Années d'expérience" },
    icon: "Shield",
    color: "var(--brand-foundation)",
  },
  {
    id: "trained",
    value: "500+",
    label: { en: "Public Servants Trained", fr: "Fonctionnaires formés" },
    icon: "Users",
    color: "var(--sage-primary)",
  },
  {
    id: "departments",
    value: "30+",
    label: { en: "Federal Departments", fr: "Ministères fédéraux" },
    icon: "Building2",
    color: "#7C3AED",
  },
  {
    id: "satisfaction",
    value: "4.9/5",
    label: { en: "Client Satisfaction", fr: "Satisfaction des clients" },
    icon: "Star",
    color: "#D97706",
  },
];
