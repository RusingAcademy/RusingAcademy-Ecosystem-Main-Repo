/**
 * ============================================
 * ECOSYSTEM HOME - PAGE 1 (Sprint 3)
 * ============================================
 * 
 * RusingÂcademy Learning Ecosystem Home Page
 * Premium UI, Mobile-first, Conversion-oriented
 * 
 * Structure (in order):
 * 1. Hero - Human, editorial, clear message
 * 2. Start Here - 4 orientation cards
 * 3. How It Works - Diagnostiquer → S'entraîner → Valider
 * 4. Programs & Paths - A/B/C, Oral/Writing/Reading
 * 5. Featured Coaches - Teaser to Lingueefy
 * 6. Proof Gallery - Video/media with filters
 * 7. Testimonials
 * 8. FAQ
 * 9. Final CTA
 * 10. Footer (FooterInstitutional component)
 * 11. ProofStrip (Sticky bottom bar)
 * 12. ProofGallery (Video testimonials before FAQ)
 */

import { useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { BOOKING_URL } from "@/constants/booking";
import FooterInstitutional from "@/components/FooterInstitutional";
import ProofStrip from "@/components/ProofStrip";
import ProofGallery from "@/components/ProofGallery";
import { 
  ArrowRight, 
  Play, 
  CheckCircle2, 
  Users, 
  BookOpen, 
  Mic, 
  PenTool, 
  Eye,
  Star,
  ChevronDown,
  ChevronRight,
  Quote,
  X,
  Calendar,
  Sparkles,
  Target,
  Award,
  Waves,
  Brain,
  TrendingDown
} from "lucide-react";

// ============================================
// CONTENT DATA (Bilingual)
// ============================================

// GOLDEN PAGE 13 HERO CONTENT
const heroContent = {
  en: {
    badge: "Canada's Premier Bilingual Training Ecosystem",
    // Page 13 exact text
    titleLine1: "CHOOSE",
    titleLine2: "YOUR",
    titleLine3: "PATH",
    subtitle: "To Bilingual Excellence",
    description: "Designed for Canadian public servants: SLE-focused learning, expert coaching, and premium media — for teams confident in both official languages.",
    cta1: "Book a Free Diagnostic",
    cta2: "Explore Programs",
    proof: "Over 2,000+ public servants trained",
    successRate: "Success Rate",
  },
  fr: {
    badge: "L'écosystème de formation bilingue de référence au Canada",
    // Page 13 exact text
    titleLine1: "CHOISISSEZ",
    titleLine2: "VOTRE",
    titleLine3: "PARCOURS",
    subtitle: "Vers l'Excellence Bilingue",
    description: "Conçu pour les fonctionnaires canadiens : apprentissage axé ELS, coaching d'experts et médias premium — pour des équipes confiantes dans les deux langues officielles.",
    cta1: "Réserver un diagnostic gratuit",
    cta2: "Explorer les programmes",
    proof: "Plus de 2 000 fonctionnaires formés",
    successRate: "Taux de réussite",
  }
};

// SECTION 2: VALUE PROPOSITION - LE TRILEMME DE L'EXCELLENCE BILINGUE
interface Obstacle {
  title: string;
  description: string;
  symptoms: string[];
}

const valuePropositionContent = {
  en: {
    badge: "The Bilingual Excellence Trilemma",
    title: "Three Walls Between You and Fluency",
    subtitle: "Every public servant faces these challenges. Understanding them is the first step to overcoming them.",
    obstacles: [
      {
        title: "The Wall of Fluency",
        description: "You understand everything, but words freeze when you need to speak. The gap between passive comprehension and active expression feels insurmountable.",
        symptoms: [
          "Hesitation before speaking",
          "Mental translation from L1",
          "Avoidance of spontaneous conversations"
        ]
      },
      {
        title: "Impostor Syndrome",
        description: "Despite your progress, you doubt your abilities. You fear being 'exposed' as not truly bilingual, especially in high-stakes situations.",
        symptoms: [
          "Anxiety before SLE exams",
          "Comparing yourself to native speakers",
          "Discounting your achievements"
        ]
      },
      {
        title: "The Plateau Stagnation",
        description: "You've reached a level and can't seem to progress further. Traditional methods no longer work, and motivation fades.",
        symptoms: [
          "Feeling stuck at B level",
          "Boredom with repetitive exercises",
          "Loss of learning momentum"
        ]
      }
    ] as Obstacle[],
    resolution: "RusingÂcademy was built to break through all three walls.",
    cta: "Discover Our Approach"
  },
  fr: {
    badge: "Le Trilemme de l'Excellence Bilingue",
    title: "Trois murs entre vous et la fluidité",
    subtitle: "Chaque fonctionnaire fait face à ces défis. Les comprendre est la première étape pour les surmonter.",
    obstacles: [
      {
        title: "Le Mur de la Fluidité",
        description: "Vous comprenez tout, mais les mots se figent quand vous devez parler. L'écart entre la compréhension passive et l'expression active semble insurmontable.",
        symptoms: [
          "Hésitation avant de parler",
          "Traduction mentale depuis la L1",
          "Évitement des conversations spontanées"
        ]
      },
      {
        title: "Le Syndrome de l'Imposteur",
        description: "Malgré vos progrès, vous doutez de vos capacités. Vous craignez d'être 'démasqué' comme n'étant pas vraiment bilingue, surtout dans les situations à enjeux élevés.",
        symptoms: [
          "Anxiété avant les examens ELS",
          "Comparaison avec les locuteurs natifs",
          "Minimisation de vos accomplissements"
        ]
      },
      {
        title: "La Stagnation du Plateau",
        description: "Vous avez atteint un niveau et n'arrivez plus à progresser. Les méthodes traditionnelles ne fonctionnent plus, et la motivation s'effrite.",
        symptoms: [
          "Sentiment de stagner au niveau B",
          "Ennui face aux exercices répétitifs",
          "Perte d'élan dans l'apprentissage"
        ]
      }
    ] as Obstacle[],
    resolution: "RusingÂcademy a été conçu pour briser ces trois murs.",
    cta: "Découvrir notre approche"
  }
};

// Hub & Spokes - 3 Ecosystem Branches
const ecosystemBranches = {
  en: [
    {
      id: "rusingacademy",
      name: "RusingÂcademy",
      tagline: "The Academy",
      description: "Professional courses, LMS, and structured Path Series™ curriculum for SLE success.",
      cta: "Explore Courses",
      path: "/rusingacademy",
      style: "navy-orange", // Navy + Orange (conversion)
      features: ["Path Series™ Curriculum", "SLE Preparation", "Progress Tracking"],
    },
    {
      id: "lingueefy",
      name: "Lingueefy",
      tagline: "The Tool",
      description: "Human & AI coaching marketplace with voice practice and personalized feedback.",
      cta: "Meet Coaches",
      path: "/lingueefy",
      style: "white-teal", // Blanc + Teal (App Store)
      features: ["AI Voice Practice", "Expert Coaches", "Real-time Feedback"],
    },
    {
      id: "barholex",
      name: "Barholex Media",
      tagline: "The Studio",
      description: "EdTech consulting, content production, and enterprise solutions for departments.",
      cta: "Request Proposal",
      path: "/barholex-media",
      style: "charcoal-gold", // Charbon + Gold (Black Label)
      features: ["Enterprise Solutions", "Content Production", "Custom Training"],
    },
  ],
  fr: [
    {
      id: "rusingacademy",
      name: "RusingÂcademy",
      tagline: "L'Académie",
      description: "Cours professionnels, LMS et curriculum Path Series™ structuré pour réussir les ELS.",
      cta: "Explorer les cours",
      path: "/rusingacademy",
      style: "navy-orange",
      features: ["Curriculum Path Series™", "Préparation ELS", "Suivi de progression"],
    },
    {
      id: "lingueefy",
      name: "Lingueefy",
      tagline: "L'Outil",
      description: "Marketplace de coaching humain & IA avec pratique vocale et rétroaction personnalisée.",
      cta: "Rencontrer les coaches",
      path: "/lingueefy",
      style: "white-teal",
      features: ["Pratique vocale IA", "Coaches experts", "Rétroaction en temps réel"],
    },
    {
      id: "barholex",
      name: "Barholex Media",
      tagline: "Le Studio",
      description: "Consultation EdTech, production de contenu et solutions entreprise pour les ministères.",
      cta: "Demander une proposition",
      path: "/barholex-media",
      style: "charcoal-gold",
      features: ["Solutions entreprise", "Production de contenu", "Formation sur mesure"],
    },
  ],
};

const startHereCards = {
  en: [
    {
      icon: "🎯",
      title: "I need to pass my SLE",
      description: "Structured preparation for oral and written exams",
      link: "/rusingacademy/sle-preparation",
      color: "foundation",
    },
    {
      icon: "🗣️",
      title: "I want to practice speaking",
      description: "AI-powered voice sessions and human coaching",
      link: "/lingueefy",
      color: "lingueefy",
    },
    {
      icon: "📚",
      title: "I want structured courses",
      description: "Path Series™ curriculum aligned with SLE outcomes",
      link: "/rusingacademy/courses",
      color: "cta",
    },
    {
      icon: "🏢",
      title: "I represent a department",
      description: "Group training and enterprise solutions",
      link: "/barholex-media",
      color: "barholex",
    },
  ],
  fr: [
    {
      icon: "🎯",
      title: "Je dois réussir mon ELS",
      description: "Préparation structurée pour les examens oraux et écrits",
      link: "/rusingacademy/sle-preparation",
      color: "foundation",
    },
    {
      icon: "🗣️",
      title: "Je veux pratiquer l'oral",
      description: "Sessions vocales IA et coaching humain",
      link: "/lingueefy",
      color: "lingueefy",
    },
    {
      icon: "📚",
      title: "Je veux des cours structurés",
      description: "Curriculum Path Series™ aligné sur les résultats ELS",
      link: "/rusingacademy/courses",
      color: "cta",
    },
    {
      icon: "🏢",
      title: "Je représente un ministère",
      description: "Formation de groupe et solutions entreprise",
      link: "/barholex-media",
      color: "barholex",
    },
  ],
};

const howItWorksSteps = {
  en: [
    {
      number: "01",
      title: "Diagnose",
      description: "Take our free placement test to identify your current level and gaps",
      icon: <Eye className="w-8 h-8" />,
    },
    {
      number: "02",
      title: "Train",
      description: "Follow your personalized path with courses, coaching, and AI practice",
      icon: <BookOpen className="w-8 h-8" />,
    },
    {
      number: "03",
      title: "Validate",
      description: "Pass your SLE exam with confidence and advance your career",
      icon: <CheckCircle2 className="w-8 h-8" />,
    },
  ],
  fr: [
    {
      number: "01",
      title: "Diagnostiquer",
      description: "Passez notre test de placement gratuit pour identifier votre niveau et vos lacunes",
      icon: <Eye className="w-8 h-8" />,
    },
    {
      number: "02",
      title: "S'entraîner",
      description: "Suivez votre parcours personnalisé avec cours, coaching et pratique IA",
      icon: <BookOpen className="w-8 h-8" />,
    },
    {
      number: "03",
      title: "Valider",
      description: "Réussissez votre examen ELS avec confiance et propulsez votre carrière",
      icon: <CheckCircle2 className="w-8 h-8" />,
    },
  ],
};

const programPaths = {
  en: {
    title: "Programs & Learning Paths",
    subtitle: "Choose your path based on your goals and current level",
    levels: [
      { id: "A", name: "Level A", description: "Foundation", color: "#22C55E" },
      { id: "B", name: "Level B", description: "Intermediate", color: "#3B82F6" },
      { id: "C", name: "Level C", description: "Advanced", color: "#8B5CF6" },
    ],
    skills: [
      { id: "oral", name: "Oral Expression", icon: <Mic className="w-5 h-5" /> },
      { id: "written", name: "Written Expression", icon: <PenTool className="w-5 h-5" /> },
      { id: "reading", name: "Reading Comprehension", icon: <Eye className="w-5 h-5" /> },
    ],
    cta: "View All Programs",
  },
  fr: {
    title: "Programmes et parcours",
    subtitle: "Choisissez votre parcours selon vos objectifs et votre niveau actuel",
    levels: [
      { id: "A", name: "Niveau A", description: "Fondation", color: "#22C55E" },
      { id: "B", name: "Niveau B", description: "Intermédiaire", color: "#3B82F6" },
      { id: "C", name: "Niveau C", description: "Avancé", color: "#8B5CF6" },
    ],
    skills: [
      { id: "oral", name: "Expression orale", icon: <Mic className="w-5 h-5" /> },
      { id: "written", name: "Expression écrite", icon: <PenTool className="w-5 h-5" /> },
      { id: "reading", name: "Compréhension de lecture", icon: <Eye className="w-5 h-5" /> },
    ],
    cta: "Voir tous les programmes",
  },
};

const featuredCoaches = [
  {
    name: "Steven Barholere",
    title: { en: "Founder & Lead Coach", fr: "Fondateur et coach principal" },
    specialty: { en: "SLE Oral Preparation", fr: "Préparation ELS oral" },
    image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663049070748/qRLdHcqyjkbgxswu.jpg",
    rating: 5.0,
    students: 500,
  },
  {
    name: "Sue Anne",
    title: { en: "Senior Coach", fr: "Coach senior" },
    specialty: { en: "Written Expression", fr: "Expression écrite" },
    image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663049070748/hgRyOyJNbUaKIzWc.jpg",
    rating: 4.9,
    students: 320,
  },
  {
    name: "Erica",
    title: { en: "Coach", fr: "Coach" },
    specialty: { en: "Reading Comprehension", fr: "Compréhension de lecture" },
    image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663049070748/KKrTACxmulrvkGUl.jpeg",
    rating: 4.8,
    students: 280,
  },
];

const proofGalleryContent = {
  en: {
    title: "See Real Results",
    subtitle: "Watch success stories from public servants who achieved their language goals",
    filters: ["All", "Testimonials", "Tips", "Capsules"],
    cta: "View All Success Stories",
  },
  fr: {
    title: "Voyez les résultats réels",
    subtitle: "Regardez les témoignages de fonctionnaires qui ont atteint leurs objectifs linguistiques",
    filters: ["Tout", "Témoignages", "Conseils", "Capsules"],
    cta: "Voir tous les témoignages",
  },
};

const testimonials = {
  en: [
    {
      quote: "I went from struggling with basic conversations to passing my C-level oral exam in just 4 months. The structured approach made all the difference.",
      author: "Marie-Claire D.",
      role: "Policy Analyst, ESDC",
      level: "BBB → CBC",
    },
    {
      quote: "The AI practice sessions helped me overcome my fear of speaking French. I could practice anytime without judgment.",
      author: "James T.",
      role: "IT Specialist, CRA",
      level: "A → BBB",
    },
    {
      quote: "As a manager, I needed to improve quickly. The intensive program was exactly what I needed to reach my bilingual designation.",
      author: "Sarah M.",
      role: "Director, IRCC",
      level: "BBB → CCC",
    },
  ],
  fr: [
    {
      quote: "Je suis passée de difficultés avec les conversations de base à la réussite de mon examen oral niveau C en seulement 4 mois. L'approche structurée a fait toute la différence.",
      author: "Marie-Claire D.",
      role: "Analyste des politiques, EDSC",
      level: "BBB → CBC",
    },
    {
      quote: "Les sessions de pratique IA m'ont aidé à surmonter ma peur de parler français. Je pouvais pratiquer n'importe quand sans jugement.",
      author: "James T.",
      role: "Spécialiste TI, ARC",
      level: "A → BBB",
    },
    {
      quote: "En tant que gestionnaire, j'avais besoin de m'améliorer rapidement. Le programme intensif était exactement ce dont j'avais besoin pour atteindre ma désignation bilingue.",
      author: "Sarah M.",
      role: "Directrice, IRCC",
      level: "BBB → CCC",
    },
  ],
};

const faqItems = {
  en: [
    {
      question: "What is the SLE exam?",
      answer: "The Second Language Evaluation (SLE) is a standardized test used by the Government of Canada to assess the language proficiency of public servants. It evaluates three skills: oral interaction, reading comprehension, and written expression.",
    },
    {
      question: "How long does it take to prepare?",
      answer: "Preparation time varies based on your starting level and target. Typically, moving up one level (e.g., A to B) takes 3-6 months of consistent practice. Our diagnostic test will give you a personalized estimate.",
    },
    {
      question: "Can I practice with AI anytime?",
      answer: "Yes! Our AI-powered practice sessions are available 24/7. You can practice speaking, writing, and comprehension exercises at your own pace, with instant feedback.",
    },
    {
      question: "Do you offer group training for departments?",
      answer: "Absolutely. We offer customized group training programs for federal departments and agencies. Contact us for enterprise pricing and tailored curriculum options.",
    },
  ],
  fr: [
    {
      question: "Qu'est-ce que l'examen ELS?",
      answer: "L'Évaluation de langue seconde (ELS) est un test standardisé utilisé par le gouvernement du Canada pour évaluer la compétence linguistique des fonctionnaires. Il évalue trois compétences : l'interaction orale, la compréhension de lecture et l'expression écrite.",
    },
    {
      question: "Combien de temps faut-il pour se préparer?",
      answer: "Le temps de préparation varie selon votre niveau de départ et votre objectif. Généralement, passer d'un niveau (ex: A à B) prend 3 à 6 mois de pratique régulière. Notre test diagnostique vous donnera une estimation personnalisée.",
    },
    {
      question: "Puis-je pratiquer avec l'IA à tout moment?",
      answer: "Oui! Nos sessions de pratique assistées par IA sont disponibles 24/7. Vous pouvez pratiquer l'oral, l'écrit et la compréhension à votre rythme, avec une rétroaction instantanée.",
    },
    {
      question: "Offrez-vous de la formation de groupe pour les ministères?",
      answer: "Absolument. Nous offrons des programmes de formation de groupe personnalisés pour les ministères et agences fédéraux. Contactez-nous pour les tarifs entreprise et les options de curriculum sur mesure.",
    },
  ],
};

const finalCTAContent = {
  en: {
    title: "Ready to Start Your Journey?",
    subtitle: "Take the first step toward bilingual excellence",
    cta1: "Book a Free Consultation",
    cta2: "Take Placement Test",
  },
  fr: {
    title: "Prêt à commencer votre parcours?",
    subtitle: "Faites le premier pas vers l'excellence bilingue",
    cta1: "Réserver une consultation gratuite",
    cta2: "Passer le test de placement",
  },
};

// ============================================
// ANIMATION VARIANTS
// ============================================

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    }
  }
};

// ============================================
// HELPER COMPONENTS
// ============================================

function SectionHeader({ 
  title, 
  subtitle, 
  badge,
  badgeColor = "foundation",
  center = true 
}: { 
  title: string; 
  subtitle?: string; 
  badge?: string;
  badgeColor?: string;
  center?: boolean;
}) {
  return (
    <div className={`mb-12 ${center ? 'text-center' : ''}`}>
      {badge && (
        <span 
          className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium mb-4"
          style={{ 
            backgroundColor: badgeColor === "lingueefy" ? "var(--lingueefy-accent)" : "var(--brand-foundation-soft)",
            color: badgeColor === "lingueefy" ? "white" : "var(--brand-foundation)",
          }}
        >
          {badge}
        </span>
      )}
      <h2 
        className="font-display text-3xl sm:text-4xl font-bold mb-4"
        style={{ color: "var(--text)" }}
      >
        {title}
      </h2>
      {subtitle && (
        <p 
          className={`text-lg leading-relaxed ${center ? 'max-w-2xl mx-auto' : ''}`}
          style={{ color: "var(--text)", opacity: 0.7 }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================

export default function EcosystemHome() {
  const { language } = useLanguage();
  const [activeFilter, setActiveFilter] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  // Refs for scroll animations
  const heroRef = useRef(null);
  const valuePropositionRef = useRef(null);
  const startHereRef = useRef(null);
  const howItWorksRef = useRef(null);
  const programsRef = useRef(null);
  const coachesRef = useRef(null);
  const proofRef = useRef(null);
  const testimonialsRef = useRef(null);
  const faqRef = useRef(null);
  const ctaRef = useRef(null);

  const heroInView = useInView(heroRef, { once: true, margin: "-100px" });
  const valuePropositionInView = useInView(valuePropositionRef, { once: true, margin: "-100px" });
  const startHereInView = useInView(startHereRef, { once: true, margin: "-100px" });
  const howItWorksInView = useInView(howItWorksRef, { once: true, margin: "-100px" });
  const programsInView = useInView(programsRef, { once: true, margin: "-100px" });
  const coachesInView = useInView(coachesRef, { once: true, margin: "-100px" });
  const proofInView = useInView(proofRef, { once: true, margin: "-100px" });
  const testimonialsInView = useInView(testimonialsRef, { once: true, margin: "-100px" });
  const faqInView = useInView(faqRef, { once: true, margin: "-100px" });
  const ctaInView = useInView(ctaRef, { once: true, margin: "-100px" });

  // Get content for current language
  const hero = heroContent[language];
  const valueProposition = valuePropositionContent[language];
  const startCards = startHereCards[language];
  const steps = howItWorksSteps[language];
  const programs = programPaths[language];
  const proof = proofGalleryContent[language];
  const testis = testimonials[language];
  const faqs = faqItems[language];
  const finalCTA = finalCTAContent[language];

  // Color mapping for cards
  const getCardColor = (color: string) => {
    switch(color) {
      case "foundation": return "var(--brand-foundation)";
      case "lingueefy": return "var(--lingueefy-accent)";
      case "cta": return "var(--brand-cta)";
      case "barholex": return "var(--barholex-gold)";
      default: return "var(--brand-foundation)";
    }
  };

  const getCardBgColor = (color: string) => {
    switch(color) {
      case "foundation": return "var(--brand-foundation-soft)";
      case "lingueefy": return "var(--lingueefy-accent-soft)";
      case "cta": return "var(--brand-cta-soft)";
      case "barholex": return "var(--barholex-gold-soft)";
      default: return "var(--brand-foundation-soft)";
    }
  };

  return (
    <>
      <SEO 
        title={language === "fr" 
          ? "RusingÂcademy - Formation bilingue pour fonctionnaires canadiens" 
          : "RusingÂcademy - Bilingual Training for Canadian Public Servants"
        }
        description={language === "fr"
          ? "Programmes structurés, coaching expert et pratique IA pour réussir vos examens ELS. Plus de 2000 fonctionnaires formés."
          : "Structured programs, expert coaching, and AI practice to pass your SLE exams. Over 2000 public servants trained."
        }
      />

      <main id="main-content" className="min-h-screen pb-24 lg:pb-20" style={{ backgroundColor: "var(--bg)" }}>
        
        {/* ===== SECTION 1: HERO ===== */}
        <section 
          ref={heroRef}
          className="relative overflow-hidden"
          style={{ 
            background: "linear-gradient(180deg, var(--bg) 0%, var(--sand) 100%)",
            minHeight: "85vh",
          }}
        >
          {/* Decorative background elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div 
              className="absolute top-20 left-10 w-72 h-72 rounded-full opacity-30 blur-3xl"
              style={{ backgroundColor: "var(--brand-foundation-soft)" }}
            />
            <div 
              className="absolute bottom-20 right-10 w-96 h-96 rounded-full opacity-20 blur-3xl"
              style={{ backgroundColor: "var(--brand-cta-soft)" }}
            />
          </div>

          <div className="container-ecosystem relative z-10 py-16 lg:py-24">
            <motion.div 
              className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center"
              initial="hidden"
              animate={heroInView ? "visible" : "hidden"}
              variants={staggerContainer}
            >
              {/* Left Column - Text Content with Glassmorphism */}
              <div 
                className="order-2 lg:order-1 p-8 lg:p-10 rounded-3xl"
                style={{
                  backgroundColor: "rgba(254, 254, 248, 0.85)",
                  backdropFilter: "blur(20px)",
                  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.08)",
                }}
              >
                {/* Badge */}
                <motion.div variants={fadeInUp} className="mb-6">
                  <span 
                    className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium"
                    style={{ 
                      backgroundColor: "var(--brand-foundation-soft)",
                      color: "var(--brand-foundation)",
                    }}
                  >
                    <span className="mr-2">🍁</span>
                    {hero.badge}
                  </span>
                </motion.div>

                {/* GOLDEN PAGE 13: Title - 3 lines uppercase */}
                <motion.h1 
                  variants={fadeInUp}
                  className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-none mb-4"
                >
                  <span className="block" style={{ color: "var(--brand-cta)" }}>
                    {hero.titleLine1}
                  </span>
                  <span className="block" style={{ color: "var(--brand-cta)" }}>
                    {hero.titleLine2}
                  </span>
                  <span className="block" style={{ color: "var(--brand-cta)" }}>
                    {hero.titleLine3}
                  </span>
                </motion.h1>

                {/* GOLDEN PAGE 13: Subtitle - italic */}
                <motion.p 
                  variants={fadeInUp}
                  className="font-serif text-2xl lg:text-3xl italic mb-4"
                  style={{ color: "var(--text)" }}
                >
                  {hero.subtitle}
                </motion.p>

                {/* Divider line */}
                <motion.div 
                  variants={fadeInUp}
                  className="w-16 h-1 mb-6"
                  style={{ backgroundColor: "var(--brand-foundation)" }}
                />

                {/* Description */}
                <motion.p 
                  variants={fadeInUp}
                  className="text-base lg:text-lg mb-8 leading-relaxed max-w-md"
                  style={{ color: "var(--muted)" }}
                >
                  {hero.description}
                </motion.p>

                {/* CTAs */}
                <motion.div variants={fadeInUp} className="flex flex-wrap gap-4 mb-8">
                  <a 
                    href={BOOKING_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button 
                      className="px-8 py-6 text-base font-semibold rounded-full transition-all hover:scale-105"
                      style={{
                        background: "linear-gradient(135deg, var(--brand-cta) 0%, #D4A853 100%)",
                        color: "white",
                        boxShadow: "0 4px 20px rgba(198, 90, 30, 0.4)",
                      }}
                    >
                      <Calendar className="mr-2 w-5 h-5" />
                      {hero.cta1}
                    </Button>
                  </a>
                  <Link href="/rusingacademy">
                    <Button 
                      variant="outline"
                      className="px-8 py-6 text-base font-semibold rounded-full"
                      style={{
                        borderColor: "var(--brand-foundation)",
                        color: "var(--brand-foundation)",
                      }}
                    >
                      {hero.cta2}
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </Link>
                </motion.div>

                {/* Micro-proof */}
                <motion.div 
                  variants={fadeInUp}
                  className="flex items-center gap-3 flex-wrap"
                >
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div 
                        key={i}
                        className="w-10 h-10 rounded-full border-2 border-white overflow-hidden"
                        style={{ backgroundColor: "var(--sand)" }}
                      >
                        <img 
                          src={`https://i.pravatar.cc/100?img=${i + 10}`}
                          alt=""
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <span className="text-sm font-medium" style={{ color: "var(--muted)" }}>
                    {hero.proof}
                  </span>
                </motion.div>
              </div>

              {/* Right Column - Hero Image */}
              <motion.div 
                variants={fadeInUp}
                className="order-1 lg:order-2 relative"
              >
                <div 
                  className="relative rounded-3xl overflow-hidden"
                  style={{ 
                    aspectRatio: "4/3",
                    boxShadow: "0 0 60px rgba(20, 184, 166, 0.3), 0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                  }}
                >
                  {/* Hero Image - Using Cloudinary optimized image */}
                  <img 
                    src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663049070748/jSyqGwFBuZePYhHd.webp"
                    alt={language === "fr" 
                      ? "Fonctionnaires canadiens en formation bilingue" 
                      : "Canadian public servants in bilingual training"
                    }
                    className="w-full h-full object-cover"
                    loading="eager"
                  />
                  {/* Glass overlay with play button */}
                  <div 
                    className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-black/40 to-transparent"
                  >
                    <button 
                      onClick={() => {
                        setSelectedVideo("intro");
                        setVideoModalOpen(true);
                      }}
                      className="w-20 h-20 rounded-full flex items-center justify-center transition-all hover:scale-110"
                      style={{ 
                        backgroundColor: "rgba(255,255,255,0.95)",
                        boxShadow: "0 10px 40px rgba(0,0,0,0.3)",
                      }}
                      aria-label={language === "fr" ? "Regarder la vidéo" : "Watch video"}
                    >
                      <Play className="w-8 h-8 ml-1" style={{ color: "var(--brand-cta)" }} />
                    </button>
                  </div>
                </div>

                {/* Floating success rate badge */}
                <div 
                  className="absolute -bottom-4 -left-4 px-6 py-4 rounded-2xl"
                  style={{ 
                    backgroundColor: "rgba(255,255,255,0.95)",
                    boxShadow: "0 10px 40px rgba(0,0,0,0.15)",
                    backdropFilter: "blur(10px)",
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: "var(--brand-foundation-soft)" }}
                    >
                      <CheckCircle2 className="w-6 h-6" style={{ color: "var(--brand-foundation)" }} />
                    </div>
                    <div>
                      <p className="font-semibold text-sm" style={{ color: "var(--muted)" }}>
                        {hero.successRate}
                      </p>
                      <p className="text-2xl font-bold" style={{ color: "var(--brand-foundation)" }}>
                        94%
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ===== SECTION 1.5: VALUE PROPOSITION - LE TRILEMME ===== */}
        <section 
          ref={valuePropositionRef}
          className="section-padding relative overflow-hidden"
          style={{ 
            background: "linear-gradient(180deg, var(--sand) 0%, var(--bg) 100%)",
          }}
        >
          {/* Decorative gradient orbs with subtle parallax */}
          <motion.div 
            className="absolute top-10 right-20 w-80 h-80 rounded-full opacity-20 blur-3xl pointer-events-none"
            style={{ backgroundColor: "var(--brand-foundation-soft)" }}
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div 
            className="absolute bottom-10 left-10 w-64 h-64 rounded-full opacity-15 blur-3xl pointer-events-none"
            style={{ backgroundColor: "var(--brand-cta-soft)" }}
            animate={{ y: [0, 20, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />

          <div className="container-ecosystem relative z-10">
            <motion.div
              initial="hidden"
              animate={valuePropositionInView ? "visible" : "hidden"}
              variants={staggerContainer}
            >
              {/* Section Header */}
              <motion.div variants={fadeInUp} className="text-center mb-12">
                <span 
                  className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium mb-4"
                  style={{ 
                    backgroundColor: "var(--brand-cta-soft)",
                    color: "var(--brand-cta)",
                  }}
                >
                  {valueProposition.badge}
                </span>
                <h2 
                  className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold mb-4"
                  style={{ color: "var(--text)" }}
                >
                  {valueProposition.title}
                </h2>
                <p 
                  className="text-lg max-w-2xl mx-auto"
                  style={{ color: "var(--muted)" }}
                >
                  {valueProposition.subtitle}
                </p>
              </motion.div>

              {/* Trilemme Cards - 3 columns on desktop, 1 on mobile */}
              <motion.div 
                variants={staggerContainer}
                className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8"
              >
                {valueProposition.obstacles.map((obstacle: Obstacle, index: number) => {
                  const icons = [
                    <Waves className="w-8 h-8" key="waves" />,
                    <Brain className="w-8 h-8" key="brain" />,
                    <TrendingDown className="w-8 h-8" key="trending" />
                  ];
                  
                  const colors = [
                    { bg: "rgba(15, 61, 62, 0.08)", border: "rgba(15, 61, 62, 0.15)", icon: "var(--brand-foundation)" },
                    { bg: "rgba(198, 90, 30, 0.08)", border: "rgba(198, 90, 30, 0.15)", icon: "var(--brand-cta)" },
                    { bg: "rgba(139, 92, 246, 0.08)", border: "rgba(139, 92, 246, 0.15)", icon: "#8B5CF6" }
                  ];

                  return (
                    <motion.div key={index} variants={fadeInUp}>
                      <div 
                        className="group relative p-8 rounded-3xl h-full flex flex-col transition-all duration-500 hover:scale-[1.02] hover:-translate-y-2"
                        style={{
                          background: "rgba(255, 255, 255, 0.7)",
                          backdropFilter: "blur(16px)",
                          WebkitBackdropFilter: "blur(16px)",
                          border: `1px solid ${colors[index].border}`,
                          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.6)",
                        }}
                      >
                        {/* Number watermark */}
                        <span 
                          className="absolute top-4 right-6 text-6xl font-bold opacity-10 select-none"
                          style={{ color: colors[index].icon }}
                        >
                          0{index + 1}
                        </span>
                        
                        {/* Icon */}
                        <div 
                          className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
                          style={{ backgroundColor: colors[index].bg }}
                        >
                          <span style={{ color: colors[index].icon }}>{icons[index]}</span>
                        </div>
                        
                        {/* Title */}
                        <h3 
                          className="font-display text-xl font-bold mb-3"
                          style={{ color: "var(--text)" }}
                        >
                          {obstacle.title}
                        </h3>
                        
                        {/* Description */}
                        <p 
                          className="text-base mb-6 flex-grow"
                          style={{ color: "var(--muted)" }}
                        >
                          {obstacle.description}
                        </p>
                        
                        {/* Symptoms */}
                        <ul className="space-y-2">
                          {obstacle.symptoms.map((symptom: string, i: number) => (
                            <li 
                              key={i} 
                              className="flex items-start gap-2 text-sm"
                              style={{ color: "var(--muted)" }}
                            >
                              <span 
                                className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0"
                                style={{ backgroundColor: colors[index].icon }}
                              />
                              {symptom}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>

              {/* Resolution CTA */}
              <motion.div variants={fadeInUp} className="text-center mt-12">
                <p 
                  className="text-lg font-medium mb-6"
                  style={{ color: "var(--text)" }}
                >
                  {valueProposition.resolution}
                </p>
                <Link href="/rusingacademy">
                  <Button 
                    className="px-8 py-6 text-base font-semibold rounded-full transition-all hover:scale-105"
                    style={{
                      background: "linear-gradient(135deg, var(--brand-cta) 0%, #D4A853 100%)",
                      color: "white",
                      boxShadow: "0 4px 20px rgba(198, 90, 30, 0.4)",
                    }}
                  >
                    {valueProposition.cta}
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ===== SECTION 2: HUB & SPOKES - 3 BRANCHES ===== */}
        <section 
          className="section-padding relative overflow-hidden"
          style={{ 
            background: "linear-gradient(180deg, var(--background) 0%, var(--surface) 100%)",
          }}
        >
          {/* Decorative gradient orbs */}
          <div 
            className="absolute top-20 left-10 w-64 h-64 rounded-full opacity-30 blur-3xl pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(20, 184, 166, 0.4) 0%, transparent 70%)" }}
          />
          <div 
            className="absolute bottom-20 right-10 w-80 h-80 rounded-full opacity-20 blur-3xl pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(242, 127, 12, 0.3) 0%, transparent 70%)" }}
          />
          
          <div className="container-ecosystem relative z-10">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
            >
              <motion.div variants={fadeInUp}>
                <SectionHeader 
                  title={language === "fr" ? "Notre Écosystème" : "Our Ecosystem"}
                  subtitle={language === "fr" 
                    ? "Trois piliers complémentaires pour votre réussite bilingue" 
                    : "Three complementary pillars for your bilingual success"
                  }
                />
              </motion.div>

              {/* 3 Branch Cards */}
              <motion.div 
                variants={staggerContainer}
                className="grid md:grid-cols-3 gap-6 lg:gap-8"
              >
                {ecosystemBranches[language].map((branch, index) => {
                  // Style-specific configurations
                  let cardStyle: React.CSSProperties = {};
                  let titleColor = "var(--text)";
                  let taglineColor = "var(--muted)";
                  let descColor = "var(--muted)";
                  let ctaStyle: React.CSSProperties = {};
                  let featureBg = "var(--sand)";
                  
                  if (branch.style === "navy-orange") {
                    // RusingÂcademy - Navy + Orange
                    cardStyle = {
                      background: "linear-gradient(135deg, rgba(255,255,255,0.85) 0%, rgba(254,254,248,0.95) 100%)",
                      backdropFilter: "blur(12px)",
                      border: "1px solid rgba(242, 127, 12, 0.2)",
                      boxShadow: "0 20px 40px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.5)",
                    };
                    ctaStyle = {
                      background: "linear-gradient(135deg, #F27F0C 0%, #D4A853 100%)",
                      color: "white",
                    };
                    featureBg = "rgba(242, 127, 12, 0.1)";
                  } else if (branch.style === "white-teal") {
                    // Lingueefy - Blanc + Teal
                    cardStyle = {
                      background: "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(231,242,242,0.9) 100%)",
                      backdropFilter: "blur(12px)",
                      border: "1px solid rgba(20, 184, 166, 0.25)",
                      boxShadow: "0 20px 40px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.8)",
                    };
                    ctaStyle = {
                      background: "linear-gradient(135deg, var(--brand-foundation) 0%, #17E2C6 100%)",
                      color: "white",
                    };
                    featureBg = "rgba(20, 184, 166, 0.1)";
                  } else if (branch.style === "charcoal-gold") {
                    // Barholex - Charbon + Gold (smoked glass)
                    cardStyle = {
                      background: "linear-gradient(135deg, rgba(17, 24, 39, 0.95) 0%, rgba(31, 41, 55, 0.9) 100%)",
                      backdropFilter: "blur(12px)",
                      border: "1px solid rgba(212, 168, 83, 0.3)",
                      boxShadow: "0 20px 40px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)",
                    };
                    titleColor = "white";
                    taglineColor = "rgba(212, 168, 83, 0.9)";
                    descColor = "rgba(255,255,255,0.7)";
                    ctaStyle = {
                      background: "linear-gradient(135deg, #D4A853 0%, #B8860B 100%)",
                      color: "#111827",
                    };
                    featureBg = "rgba(212, 168, 83, 0.15)";
                  }
                  
                  return (
                    <motion.div key={branch.id} variants={fadeInUp}>
                      <Link href={branch.path}>
                        <div 
                          className="group p-8 rounded-3xl cursor-pointer transition-all duration-500 hover:scale-[1.02] hover:-translate-y-2 h-full flex flex-col"
                          style={cardStyle}
                        >
                          {/* Tagline */}
                          <span 
                            className="text-sm font-semibold uppercase tracking-wider mb-2"
                            style={{ color: taglineColor }}
                          >
                            {branch.tagline}
                          </span>
                          
                          {/* Name */}
                          <h3 
                            className="text-2xl font-bold mb-3"
                            style={{ color: titleColor }}
                          >
                            {branch.name}
                          </h3>
                          
                          {/* Description */}
                          <p 
                            className="text-base mb-6 flex-grow"
                            style={{ color: descColor }}
                          >
                            {branch.description}
                          </p>
                          
                          {/* Features */}
                          <div className="flex flex-wrap gap-2 mb-6">
                            {branch.features.map((feature, i) => (
                              <span 
                                key={i}
                                className="px-3 py-1 rounded-full text-xs font-medium"
                                style={{ 
                                  backgroundColor: featureBg,
                                  color: branch.style === "charcoal-gold" ? "rgba(212, 168, 83, 0.9)" : "var(--text)",
                                }}
                              >
                                {feature}
                              </span>
                            ))}
                          </div>
                          
                          {/* CTA */}
                          <Button 
                            className="w-full rounded-xl py-3 font-semibold transition-all group-hover:shadow-lg flex items-center justify-center gap-2"
                            style={ctaStyle}
                          >
                            {branch.cta}
                            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                          </Button>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ===== SECTION 2: START HERE ===== */}
        <section 
          ref={startHereRef}
          className="section-padding"
          style={{ backgroundColor: "var(--surface)" }}
        >
          <div className="container-ecosystem">
            <motion.div
              initial="hidden"
              animate={startHereInView ? "visible" : "hidden"}
              variants={staggerContainer}
            >
              <motion.div variants={fadeInUp}>
                <SectionHeader 
                  title={language === "fr" ? "Par où commencer?" : "Where to Start?"}
                  subtitle={language === "fr" 
                    ? "Choisissez votre point de départ selon vos besoins" 
                    : "Choose your starting point based on your needs"
                  }
                />
              </motion.div>

              {/* Cards Grid */}
              <motion.div 
                variants={staggerContainer}
                className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
              >
                {startCards.map((card, index) => (
                  <motion.div key={index} variants={fadeInUp}>
                    <Link href={card.link}>
                      <div 
                        className="group p-6 h-full cursor-pointer rounded-2xl border transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                        style={{
                          backgroundColor: "var(--surface)",
                          borderColor: "var(--sand)",
                        }}
                      >
                        <div 
                          className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl mb-4"
                          style={{ backgroundColor: getCardBgColor(card.color) }}
                        >
                          {card.icon}
                        </div>
                        <h3 
                          className="font-semibold text-lg mb-2 group-hover:text-brand-accent transition-colors"
                          style={{ color: "var(--text)" }}
                        >
                          {card.title}
                        </h3>
                        <p 
                          className="text-sm mb-4 leading-relaxed"
                          style={{ color: "var(--muted)" }}
                        >
                          {card.description}
                        </p>
                        <div 
                          className="flex items-center text-sm font-medium group-hover:translate-x-1 transition-transform"
                          style={{ color: getCardColor(card.color) }}
                        >
                          {language === "fr" ? "En savoir plus" : "Learn more"}
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ===== SECTION 3: HOW IT WORKS ===== */}
        <section 
          ref={howItWorksRef}
          className="section-padding"
          style={{ backgroundColor: "var(--sand)" }}
        >
          <div className="container-ecosystem">
            <motion.div
              initial="hidden"
              animate={howItWorksInView ? "visible" : "hidden"}
              variants={staggerContainer}
            >
              <motion.div variants={fadeInUp}>
                <SectionHeader 
                  title={language === "fr" ? "Comment ça fonctionne" : "How It Works"}
                  subtitle={language === "fr" 
                    ? "Un parcours simple en trois étapes vers la réussite" 
                    : "A simple three-step journey to success"
                  }
                />
              </motion.div>

              {/* Steps */}
              <motion.div 
                variants={staggerContainer}
                className="grid md:grid-cols-3 gap-6 lg:gap-8"
              >
                {steps.map((step, index) => (
                  <motion.div 
                    key={index} 
                    variants={fadeInUp}
                    className="relative"
                  >
                    {/* Connector line (desktop only) */}
                    {index < steps.length - 1 && (
                      <div 
                        className="hidden md:block absolute top-16 left-1/2 w-full h-0.5"
                        style={{ backgroundColor: "var(--border)" }}
                      />
                    )}
                    
                    <div className="relative z-10 text-center">
                      {/* Icon circle */}
                      <div 
                        className="w-32 h-32 rounded-full mx-auto mb-6 flex items-center justify-center"
                        style={{ 
                          backgroundColor: "var(--surface)",
                          boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
                        }}
                      >
                        <div 
                          className="w-24 h-24 rounded-full flex items-center justify-center"
                          style={{ 
                            backgroundColor: "var(--brand-foundation-soft)",
                            color: "var(--brand-foundation)",
                          }}
                        >
                          {step.icon}
                        </div>
                      </div>
                      
                      {/* Step number */}
                      <span 
                        className="text-sm font-bold mb-2 block"
                        style={{ color: "var(--brand-cta)" }}
                      >
                        {step.number}
                      </span>
                      
                      {/* Title */}
                      <h3 
                        className="font-display text-xl font-bold mb-3"
                        style={{ color: "var(--text)" }}
                      >
                        {step.title}
                      </h3>
                      
                      {/* Description */}
                      <p 
                        className="text-sm leading-relaxed"
                        style={{ color: "var(--muted)" }}
                      >
                        {step.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ===== SECTION 4: PROGRAMS & PATHS ===== */}
        <section 
          ref={programsRef}
          className="section-padding"
          style={{ backgroundColor: "var(--surface)" }}
        >
          <div className="container-ecosystem">
            <motion.div
              initial="hidden"
              animate={programsInView ? "visible" : "hidden"}
              variants={staggerContainer}
            >
              <motion.div variants={fadeInUp}>
                <SectionHeader 
                  title={programs.title}
                  subtitle={programs.subtitle}
                />
              </motion.div>

              {/* Level Cards */}
              <motion.div variants={fadeInUp} className="mb-10">
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  {programs.levels.map((level) => (
                    <Link key={level.id} href={`/rusingacademy/programs/${level.id.toLowerCase()}`}>
                      <div 
                        className="p-8 text-center cursor-pointer rounded-2xl border transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                        style={{ 
                          backgroundColor: "var(--surface)",
                          borderColor: "var(--sand)",
                          borderTopWidth: "4px", 
                          borderTopColor: level.color 
                        }}
                      >
                        <div 
                          className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl font-bold text-white"
                          style={{ backgroundColor: level.color }}
                        >
                          {level.id}
                        </div>
                        <h3 className="font-semibold text-lg mb-1" style={{ color: "var(--text)" }}>
                          {level.name}
                        </h3>
                        <p className="text-sm" style={{ color: "var(--muted)" }}>
                          {level.description}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Skills pills */}
                <div className="flex flex-wrap justify-center gap-4">
                  {programs.skills.map((skill) => (
                    <Link key={skill.id} href={`/rusingacademy/programs/${skill.id}`}>
                      <div 
                        className="flex items-center gap-3 px-6 py-3 rounded-full cursor-pointer transition-all hover:shadow-md"
                        style={{ 
                          backgroundColor: "var(--brand-foundation-soft)",
                          color: "var(--brand-foundation)",
                        }}
                      >
                        {skill.icon}
                        <span className="font-medium">{skill.name}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </motion.div>

              {/* CTA */}
              <motion.div variants={fadeInUp} className="text-center">
                <Link href="/rusingacademy">
                  <Button 
                    variant="outline"
                    className="px-8 py-6 text-base font-semibold rounded-full"
                    style={{
                      borderColor: "var(--brand-foundation)",
                      color: "var(--brand-foundation)",
                    }}
                  >
                    {programs.cta}
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ===== SECTION 5: FEATURED COACHES ===== */}
        <section 
          ref={coachesRef}
          className="section-padding"
          style={{ backgroundColor: "var(--lingueefy-accent-soft)" }}
        >
          <div className="container-ecosystem">
            <motion.div
              initial="hidden"
              animate={coachesInView ? "visible" : "hidden"}
              variants={staggerContainer}
            >
              <motion.div variants={fadeInUp}>
                <SectionHeader 
                  badge="Lingueefy"
                  badgeColor="lingueefy"
                  title={language === "fr" ? "Rencontrez nos coachs experts" : "Meet Our Expert Coaches"}
                  subtitle={language === "fr" 
                    ? "Des professionnels certifiés dédiés à votre réussite" 
                    : "Certified professionals dedicated to your success"
                  }
                />
              </motion.div>

              {/* Coaches Grid */}
              <motion.div 
                variants={staggerContainer}
                className="grid md:grid-cols-3 gap-6 lg:gap-8"
              >
                {featuredCoaches.map((coach, index) => (
                  <motion.div key={index} variants={fadeInUp}>
                    <div 
                      className="p-6 text-center rounded-2xl"
                      style={{ backgroundColor: "var(--surface)" }}
                    >
                      {/* Avatar */}
                      <div 
                        className="w-24 h-24 rounded-full mx-auto mb-4 overflow-hidden border-4"
                        style={{ borderColor: "var(--lingueefy-accent)" }}
                      >
                        <img 
                          src={coach.image}
                          alt={coach.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = `https://i.pravatar.cc/200?img=${index + 20}`;
                          }}
                        />
                      </div>
                      
                      {/* Info */}
                      <h3 className="font-semibold text-lg mb-1" style={{ color: "var(--text)" }}>
                        {coach.name}
                      </h3>
                      <p className="text-sm mb-2" style={{ color: "var(--lingueefy-accent)" }}>
                        {coach.title[language]}
                      </p>
                      <p className="text-sm mb-4" style={{ color: "var(--muted)" }}>
                        {coach.specialty[language]}
                      </p>
                      
                      {/* Stats */}
                      <div className="flex justify-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span style={{ color: "var(--text)" }}>{coach.rating}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" style={{ color: "var(--muted)" }} />
                          <span style={{ color: "var(--muted)" }}>{coach.students}+</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              {/* CTA */}
              <motion.div variants={fadeInUp} className="text-center mt-10">
                <Link href="/lingueefy">
                  <Button 
                    className="px-8 py-6 text-base font-semibold rounded-full"
                    style={{ 
                      backgroundColor: "var(--lingueefy-accent)",
                      color: "white",
                    }}
                  >
                    {language === "fr" ? "Voir tous les coachs" : "View All Coaches"}
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ===== SECTION 6: PROOF GALLERY ===== */}
        <section 
          ref={proofRef}
          className="section-padding"
          style={{ backgroundColor: "var(--surface)" }}
        >
          <div className="container-ecosystem">
            <motion.div
              initial="hidden"
              animate={proofInView ? "visible" : "hidden"}
              variants={staggerContainer}
            >
              <motion.div variants={fadeInUp}>
                <SectionHeader 
                  title={proof.title}
                  subtitle={proof.subtitle}
                />
              </motion.div>

              {/* Filters */}
              <motion.div variants={fadeInUp} className="flex flex-wrap justify-center gap-3 mb-10">
                {proof.filters.map((filter, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveFilter(index)}
                    className="px-5 py-2.5 rounded-full text-sm font-medium transition-all"
                    style={{ 
                      backgroundColor: activeFilter === index ? "var(--brand-foundation)" : "var(--sand)",
                      color: activeFilter === index ? "white" : "var(--text)",
                    }}
                  >
                    {filter}
                  </button>
                ))}
              </motion.div>

              {/* Video Grid */}
              <motion.div 
                variants={staggerContainer}
                className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <motion.div key={i} variants={fadeInUp}>
                    <div 
                      className="relative cursor-pointer group rounded-xl overflow-hidden"
                      onClick={() => {
                        setSelectedVideo(`video-${i}`);
                        setVideoModalOpen(true);
                      }}
                    >
                      <div 
                        className="aspect-video relative"
                        style={{ backgroundColor: "var(--brand-foundation)" }}
                      >
                        {/* Gradient placeholder for videos */}
                        <div 
                          className="absolute inset-0 bg-gradient-to-br from-teal-800/80 via-teal-900/90 to-slate-900"
                          aria-hidden="true"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-teal-300/60 font-medium text-sm">Video {i}</span>
                        </div>
                      </div>
                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      {/* Play button */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div 
                          className="w-14 h-14 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: "rgba(255,255,255,0.95)" }}
                        >
                          <Play className="w-6 h-6 ml-0.5" style={{ color: "var(--brand-cta)" }} />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              {/* CTA */}
              <motion.div variants={fadeInUp} className="text-center mt-10">
                <Link href="/success-stories">
                  <Button 
                    variant="outline"
                    className="px-8 py-6 text-base font-semibold rounded-full"
                    style={{
                      borderColor: "var(--brand-foundation)",
                      color: "var(--brand-foundation)",
                    }}
                  >
                    {proof.cta}
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ===== SECTION 7: TESTIMONIALS ===== */}
        <section 
          ref={testimonialsRef}
          className="section-padding"
          style={{ backgroundColor: "var(--brand-foundation)" }}
        >
          <div className="container-ecosystem">
            <motion.div
              initial="hidden"
              animate={testimonialsInView ? "visible" : "hidden"}
              variants={staggerContainer}
            >
              <motion.div variants={fadeInUp} className="text-center mb-12">
                <h2 
                  className="font-display text-3xl sm:text-4xl font-bold mb-4"
                  style={{ color: "white" }}
                >
                  {language === "fr" ? "Ce qu'ils disent" : "What They Say"}
                </h2>
              </motion.div>

              {/* Testimonials Grid */}
              <motion.div 
                variants={staggerContainer}
                className="grid md:grid-cols-3 gap-6 lg:gap-8"
              >
                {testis.map((testimonial, index) => (
                  <motion.div key={index} variants={fadeInUp}>
                    <div 
                      className="p-8 h-full rounded-2xl"
                      style={{ 
                        backgroundColor: "rgba(255,255,255,0.1)",
                        backdropFilter: "blur(10px)",
                      }}
                    >
                      <Quote className="w-10 h-10 mb-4 opacity-50" style={{ color: "white" }} />
                      <p 
                        className="text-lg mb-6 leading-relaxed"
                        style={{ color: "rgba(255,255,255,0.9)" }}
                      >
                        "{testimonial.quote}"
                      </p>
                      <div className="flex items-center gap-4">
                        <div 
                          className="w-12 h-12 rounded-full overflow-hidden"
                          style={{ backgroundColor: "rgba(255,255,255,0.2)" }}
                        >
                          <img 
                            src={`https://i.pravatar.cc/100?img=${index + 30}`}
                            alt=""
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold" style={{ color: "white" }}>
                            {testimonial.author}
                          </p>
                          <p className="text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>
                            {testimonial.role}
                          </p>
                        </div>
                        <span 
                          className="px-3 py-1 rounded-full text-xs font-bold"
                          style={{ 
                            backgroundColor: "var(--brand-cta)",
                            color: "white",
                          }}
                        >
                          {testimonial.level}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ===== PROOF GALLERY - Video Testimonials ===== */}
        <ProofGallery />

        {/* ===== SECTION 8: FAQ ===== */}
        <section 
          ref={faqRef}
          className="section-padding"
          style={{ backgroundColor: "var(--surface)" }}
        >
          <div className="container-ecosystem max-w-3xl">
            <motion.div
              initial="hidden"
              animate={faqInView ? "visible" : "hidden"}
              variants={staggerContainer}
            >
              <motion.div variants={fadeInUp}>
                <SectionHeader 
                  title={language === "fr" ? "Questions fréquentes" : "Frequently Asked Questions"}
                />
              </motion.div>

              {/* FAQ Items */}
              <motion.div variants={staggerContainer} className="space-y-4">
                {faqs.map((faq, index) => (
                  <motion.div key={index} variants={fadeInUp}>
                    <div 
                      className="rounded-xl border overflow-hidden transition-all"
                      style={{ 
                        borderColor: openFaq === index ? "var(--brand-foundation)" : "var(--sand)",
                        backgroundColor: "var(--surface)",
                      }}
                    >
                      <button
                        onClick={() => setOpenFaq(openFaq === index ? null : index)}
                        className="w-full flex items-center justify-between p-6 text-left"
                      >
                        <span className="font-semibold pr-4" style={{ color: "var(--text)" }}>
                          {faq.question}
                        </span>
                        <ChevronDown 
                          className={`w-5 h-5 flex-shrink-0 transition-transform duration-200 ${openFaq === index ? 'rotate-180' : ''}`}
                          style={{ color: "var(--muted)" }}
                        />
                      </button>
                      <AnimatePresence>
                        {openFaq === index && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <div 
                              className="px-6 pb-6 leading-relaxed"
                              style={{ color: "var(--muted)" }}
                            >
                              {faq.answer}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ===== SECTION 9: FINAL CTA ===== */}
        <section 
          ref={ctaRef}
          className="section-padding"
          style={{ backgroundColor: "var(--sand)" }}
        >
          <div className="container-ecosystem">
            <motion.div
              initial="hidden"
              animate={ctaInView ? "visible" : "hidden"}
              variants={staggerContainer}
              className="text-center max-w-2xl mx-auto"
            >
              <motion.h2 
                variants={fadeInUp}
                className="font-display text-3xl sm:text-4xl font-bold mb-4"
                style={{ color: "var(--text)" }}
              >
                {finalCTA.title}
              </motion.h2>
              <motion.p 
                variants={fadeInUp}
                className="text-lg mb-8"
                style={{ color: "var(--muted)" }}
              >
                {finalCTA.subtitle}
              </motion.p>
              <motion.div variants={fadeInUp} className="flex flex-wrap justify-center gap-4">
                <a 
                  href={BOOKING_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button 
                    className="px-8 py-6 text-base font-semibold rounded-full transition-all hover:scale-105"
                    style={{
                      background: "linear-gradient(135deg, var(--brand-cta) 0%, #D4A853 100%)",
                      color: "white",
                      boxShadow: "0 4px 20px rgba(198, 90, 30, 0.4)",
                    }}
                  >
                    <Calendar className="mr-2 w-5 h-5" />
                    {finalCTA.cta1}
                  </Button>
                </a>
                <Link href="/diagnostic">
                  <Button 
                    variant="outline"
                    className="px-8 py-6 text-base font-semibold rounded-full"
                    style={{
                      borderColor: "var(--brand-foundation)",
                      color: "var(--brand-foundation)",
                    }}
                  >
                    {finalCTA.cta2}
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>

      </main>

      {/* ===== VIDEO MODAL ===== */}
      <AnimatePresence>
        {videoModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            style={{ backgroundColor: "rgba(0,0,0,0.9)" }}
            onClick={() => setVideoModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-4xl aspect-video rounded-2xl overflow-hidden"
              style={{ backgroundColor: "var(--brand-obsidian)" }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setVideoModalOpen(false)}
                className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full flex items-center justify-center transition-colors hover:bg-white/30"
                style={{ backgroundColor: "rgba(255,255,255,0.2)" }}
                aria-label={language === "fr" ? "Fermer" : "Close"}
              >
                <X className="w-5 h-5 text-white" />
              </button>
              {/* Video player placeholder - will be replaced with actual video */}
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center">
                  <Play className="w-16 h-16 mx-auto mb-4 text-white/50" />
                  <p className="text-white/70 text-lg">
                    {language === "fr" ? "Lecteur vidéo" : "Video Player"}
                  </p>
                  <p className="text-white/50 text-sm mt-2">
                    {selectedVideo}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== FOOTER ===== */}
      <FooterInstitutional />
      
      {/* ===== PROOF STRIP - Sticky Bottom ===== */}
      <ProofStrip />
    </>
  );
}
