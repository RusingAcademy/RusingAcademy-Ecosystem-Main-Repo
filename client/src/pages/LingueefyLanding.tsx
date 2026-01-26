import { useState, useEffect } from "react";
import SEO, { generateFAQSchema } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import FooterInstitutional from "@/components/FooterInstitutional";
import CrossEcosystemSection from "@/components/CrossEcosystemSection";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  GraduationCap,
  Users,
  Calendar,
  Star,
  ArrowRight,
  CheckCircle2,
  Globe,
  Clock,
  Award,
  MessageSquare,
  Play,
  ChevronDown,
  HelpCircle,
  BookOpen,
  Headphones,
  PenTool,
  Target,
  Zap,
  Shield,
  Search,
  MapPin,
  DollarSign,
  Filter,
  Heart,
  Video,
  Sparkles,
} from "lucide-react";
import { Link } from "wouter";

// Coach photos for floating bubbles
const coachPhotos = [
  "/images/team/steven-barholere.jpg",
  "/images/team/sue-anne-richer.jpg",
  "/images/team/erika-seguin.jpg",
  "/images/team/preciosa-mushi.jpg",
];

// Floating coach bubble component with humanized positioning
const FloatingCoachBubble = ({ 
  photo, 
  name, 
  specialty, 
  rating, 
  position, 
  delay,
  size = "lg"
}: { 
  photo: string; 
  name: string; 
  specialty: string; 
  rating: number;
  position: { top?: string; bottom?: string; left?: string; right?: string; rotate?: string };
  delay: number;
  size?: "sm" | "md" | "lg";
}) => {
  const sizeClasses = {
    sm: "w-16 h-16 md:w-20 md:h-20",
    md: "w-20 h-20 md:w-28 md:h-28",
    lg: "w-24 h-24 md:w-32 md:h-32"
  };
  
  return (
    <div 
      className={`absolute hidden md:block animate-float group cursor-pointer`}
      style={{ 
        ...position,
        animationDelay: `${delay}s`,
        animationDuration: '6s'
      }}
    >
      <div className="relative">
        {/* Glow effect on hover */}
        <div className="absolute inset-0 bg-teal-400/30 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Photo bubble */}
        <div 
          className={`${sizeClasses[size]} rounded-full overflow-hidden border-4 border-white shadow-2xl transform transition-all duration-500 group-hover:scale-110 group-hover:border-teal-400`}
          style={{ transform: position.rotate ? `rotate(${position.rotate})` : undefined }}
        >
          <img 
            src={photo} 
            alt={name}
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Info tooltip on hover */}
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-white rounded-lg shadow-lg px-3 py-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-y-2 whitespace-nowrap z-10">
          <div className="font-semibold text-slate-900 text-sm">{name}</div>
          <div className="text-xs text-slate-600">{specialty}</div>
          <div className="flex items-center gap-1 mt-1">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span className="text-xs font-medium">{rating}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function LingueefyLanding() {
  const { t, language } = useLanguage();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");
  const [selectedPrice, setSelectedPrice] = useState("");

  // Typewriter effect for hero title
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  const content = {
    en: {
      hero: {
        badge: "Canada's #1 SLE Preparation Platform",
        title: "Find Your Perfect",
        titleHighlight: "French Coach",
        subtitle: "for SLE Success",
        description: "Join 2,500+ federal public servants who achieved their language goals. Expert coaches, AI-powered practice, and personalized learning paths.",
        cta: "Find a Coach",
        ctaSecondary: "Try AI Practice Free",
        searchPlaceholder: "What do you want to learn?",
        stats: [
          { value: "95%", label: "Success Rate", icon: Target },
          { value: "2,500+", label: "Public Servants", icon: Users },
          { value: "4.9", label: "Average Rating", icon: Star },
          { value: "50+", label: "Expert Coaches", icon: GraduationCap },
        ],
        trustedBy: "Trusted by public servants from",
      },
      search: {
        level: "SLE Level",
        levelOptions: ["All Levels", "Level A", "Level B", "Level C"],
        price: "Price Range",
        priceOptions: ["Any Price", "$20-40/hr", "$40-60/hr", "$60+/hr"],
        filter: "More Filters",
      },
      howItWorks: {
        title: "Your Path to SLE Success",
        subtitle: "A proven 4-step journey designed for busy federal professionals",
        steps: [
          {
            icon: Target,
            title: "Take the Assessment",
            description: "Our diagnostic test identifies your current level and creates a personalized roadmap.",
            duration: "15 minutes",
          },
          {
            icon: Users,
            title: "Match with a Coach",
            description: "We pair you with an expert coach who specializes in your target level.",
            duration: "Same day",
          },
          {
            icon: Headphones,
            title: "Practice & Improve",
            description: "Combine live sessions with AI practice for maximum progress.",
            duration: "Your pace",
          },
          {
            icon: Award,
            title: "Pass Your SLE",
            description: "Walk into your exam with confidence and achieve your career goals.",
            duration: "2-4 months",
          },
        ],
      },
      coaches: {
        title: "Meet Our Expert Coaches",
        subtitle: "Certified professionals dedicated to your success",
        viewAll: "View All Coaches",
        items: [
          {
            name: "Steven Barholere",
            photo: "/images/team/steven-barholere.jpg",
            specialty: "SLE Oral C Level",
            rating: 4.98,
            reviews: 127,
            price: 55,
            languages: ["French", "English"],
            badge: "Top Rated",
          },
          {
            name: "Sue-Anne Richer",
            photo: "/images/team/sue-anne-richer.jpg",
            specialty: "SLE Written & Reading",
            rating: 4.95,
            reviews: 89,
            price: 50,
            languages: ["French", "English"],
            badge: "Most Popular",
          },
          {
            name: "Erika Seguin",
            photo: "/images/team/erika-seguin.jpg",
            specialty: "Anxiety Coaching",
            rating: 4.92,
            reviews: 64,
            price: 45,
            languages: ["French", "English"],
            badge: "Rising Star",
          },
        ],
      },
      services: {
        title: "Everything You Need",
        subtitle: "Comprehensive SLE preparation tools",
        items: [
          {
            icon: GraduationCap,
            title: "SLE Oral Mastery",
            description: "Intensive preparation for the oral component with real exam simulations.",
            features: ["Live practice sessions", "Pronunciation coaching", "Exam strategies"],
            color: "teal",
          },
          {
            icon: PenTool,
            title: "SLE Written Excellence",
            description: "Master grammar, vocabulary, and writing techniques for the written test.",
            features: ["Grammar workshops", "Writing exercises", "Feedback & corrections"],
            color: "amber",
          },
          {
            icon: BookOpen,
            title: "SLE Reading Comprehension",
            description: "Develop speed reading and comprehension skills for the reading test.",
            features: ["Practice texts", "Time management", "Answer strategies"],
            color: "rose",
          },
          {
            icon: Sparkles,
            title: "AI Practice Partner",
            description: "24/7 AI-powered conversation practice to build fluency and confidence.",
            features: ["Unlimited practice", "Instant feedback", "Progress tracking"],
            color: "violet",
          },
        ],
      },
      testimonials: {
        title: "Success Stories",
        subtitle: "Real results from real public servants",
        items: [
          {
            name: "Sarah Mitchell",
            role: "Policy Analyst, ESDC",
            photo: "/images/team/steven-barholere.jpg",
            quote: "I went from B to C level in just 3 months. The coaching was exceptional and the AI practice tool helped me build confidence for my oral exam.",
            rating: 5,
            result: "B → C Level",
          },
          {
            name: "David Lavoie",
            role: "Program Officer, IRCC",
            photo: "/images/team/sue-anne-richer.jpg",
            quote: "After years of trying different methods, Lingueefy finally helped me pass my SLE. The personalized approach made all the difference.",
            rating: 5,
            result: "Passed SLE",
          },
          {
            name: "Marie-Claire Tremblay",
            role: "Manager, CRA",
            photo: "/images/team/erika-seguin.jpg",
            quote: "The flexible scheduling worked perfectly with my busy schedule. I could practice during lunch breaks and evenings.",
            rating: 5,
            result: "A → B Level",
          },
        ],
      },
      faq: {
        title: "Questions? We've Got Answers",
        items: [
          {
            question: "What is the SLE (Second Language Evaluation)?",
            answer: "The SLE is a standardized test used by the Government of Canada to assess the second language proficiency of federal employees. It evaluates reading, writing, and oral interaction skills.",
          },
          {
            question: "How long does it take to prepare for the SLE?",
            answer: "Preparation time varies based on your current level. Most learners see significant improvement within 2-4 months of consistent practice with our program.",
          },
          {
            question: "Do you offer group classes or only individual coaching?",
            answer: "We offer both! Our self-paced courses include group workshops, and we also provide personalized 1-on-1 coaching sessions for targeted improvement.",
          },
          {
            question: "Is the training eligible for professional development funding?",
            answer: "Yes! Many federal departments cover language training costs. We can provide documentation for reimbursement requests.",
          },
          {
            question: "What if I don't pass my SLE after your training?",
            answer: "We offer a satisfaction guarantee. If you complete our program and don't see improvement, we'll provide additional coaching at no extra cost.",
          },
        ],
      },
      cta: {
        title: "Ready to Advance Your Career?",
        description: "Join hundreds of public servants who have achieved their language goals with Lingueefy.",
        button: "Start Your Free Trial",
        contact: "Or book a free consultation call",
      },
    },
    fr: {
      hero: {
        badge: "Plateforme #1 de préparation ELS au Canada",
        title: "Trouvez Votre",
        titleHighlight: "Coach Français",
        subtitle: "pour Réussir l'ELS",
        description: "Rejoignez 2 500+ fonctionnaires fédéraux qui ont atteint leurs objectifs linguistiques. Coachs experts, pratique assistée par IA et parcours personnalisés.",
        cta: "Trouver un Coach",
        ctaSecondary: "Essayer l'IA Gratuitement",
        searchPlaceholder: "Que voulez-vous apprendre?",
        stats: [
          { value: "95%", label: "Taux de Réussite", icon: Target },
          { value: "2,500+", label: "Fonctionnaires", icon: Users },
          { value: "4.9", label: "Note Moyenne", icon: Star },
          { value: "50+", label: "Coachs Experts", icon: GraduationCap },
        ],
        trustedBy: "Utilisé par les fonctionnaires de",
      },
      search: {
        level: "Niveau ELS",
        levelOptions: ["Tous les niveaux", "Niveau A", "Niveau B", "Niveau C"],
        price: "Fourchette de prix",
        priceOptions: ["Tout prix", "20-40$/h", "40-60$/h", "60+$/h"],
        filter: "Plus de filtres",
      },
      howItWorks: {
        title: "Votre Chemin Vers le Succès ELS",
        subtitle: "Un parcours en 4 étapes conçu pour les professionnels fédéraux occupés",
        steps: [
          {
            icon: Target,
            title: "Passez l'Évaluation",
            description: "Notre test diagnostique identifie votre niveau actuel et crée une feuille de route personnalisée.",
            duration: "15 minutes",
          },
          {
            icon: Users,
            title: "Trouvez Votre Coach",
            description: "Nous vous jumelons avec un coach expert spécialisé dans votre niveau cible.",
            duration: "Même jour",
          },
          {
            icon: Headphones,
            title: "Pratiquez & Progressez",
            description: "Combinez les sessions en direct avec la pratique IA pour un progrès maximal.",
            duration: "Votre rythme",
          },
          {
            icon: Award,
            title: "Réussissez Votre ELS",
            description: "Entrez dans votre examen avec confiance et atteignez vos objectifs de carrière.",
            duration: "2-4 mois",
          },
        ],
      },
      coaches: {
        title: "Rencontrez Nos Coachs Experts",
        subtitle: "Des professionnels certifiés dédiés à votre réussite",
        viewAll: "Voir Tous les Coachs",
        items: [
          {
            name: "Steven Barholere",
            photo: "/images/team/steven-barholere.jpg",
            specialty: "ELS Oral Niveau C",
            rating: 4.98,
            reviews: 127,
            price: 55,
            languages: ["Français", "Anglais"],
            badge: "Mieux Noté",
          },
          {
            name: "Sue-Anne Richer",
            photo: "/images/team/sue-anne-richer.jpg",
            specialty: "ELS Écrit & Lecture",
            rating: 4.95,
            reviews: 89,
            price: 50,
            languages: ["Français", "Anglais"],
            badge: "Plus Populaire",
          },
          {
            name: "Erika Seguin",
            photo: "/images/team/erika-seguin.jpg",
            specialty: "Coaching Anxiété",
            rating: 4.92,
            reviews: 64,
            price: 45,
            languages: ["Français", "Anglais"],
            badge: "Étoile Montante",
          },
        ],
      },
      services: {
        title: "Tout Ce Dont Vous Avez Besoin",
        subtitle: "Outils complets de préparation ELS",
        items: [
          {
            icon: GraduationCap,
            title: "Maîtrise Orale ELS",
            description: "Préparation intensive pour la composante orale avec simulations d'examen réelles.",
            features: ["Sessions de pratique en direct", "Coaching de prononciation", "Stratégies d'examen"],
            color: "teal",
          },
          {
            icon: PenTool,
            title: "Excellence Écrite ELS",
            description: "Maîtrisez la grammaire, le vocabulaire et les techniques d'écriture pour le test écrit.",
            features: ["Ateliers de grammaire", "Exercices d'écriture", "Rétroaction & corrections"],
            color: "amber",
          },
          {
            icon: BookOpen,
            title: "Compréhension de Lecture ELS",
            description: "Développez vos compétences en lecture rapide et compréhension pour le test de lecture.",
            features: ["Textes de pratique", "Gestion du temps", "Stratégies de réponse"],
            color: "rose",
          },
          {
            icon: Sparkles,
            title: "Partenaire de Pratique IA",
            description: "Pratique de conversation 24/7 alimentée par IA pour développer fluidité et confiance.",
            features: ["Pratique illimitée", "Rétroaction instantanée", "Suivi des progrès"],
            color: "violet",
          },
        ],
      },
      testimonials: {
        title: "Histoires de Réussite",
        subtitle: "Des résultats réels de vrais fonctionnaires",
        items: [
          {
            name: "Sarah Mitchell",
            role: "Analyste de politiques, EDSC",
            photo: "/images/team/steven-barholere.jpg",
            quote: "Je suis passée du niveau B au niveau C en seulement 3 mois. Le coaching était exceptionnel et l'outil de pratique IA m'a aidée à gagner confiance pour mon examen oral.",
            rating: 5,
            result: "B → Niveau C",
          },
          {
            name: "David Lavoie",
            role: "Agent de programme, IRCC",
            photo: "/images/team/sue-anne-richer.jpg",
            quote: "Après des années à essayer différentes méthodes, Lingueefy m'a enfin aidé à réussir mon ELS. L'approche personnalisée a fait toute la différence.",
            rating: 5,
            result: "ELS Réussi",
          },
          {
            name: "Marie-Claire Tremblay",
            role: "Gestionnaire, ARC",
            photo: "/images/team/erika-seguin.jpg",
            quote: "Les horaires flexibles s'adaptaient parfaitement à mon emploi du temps chargé. Je pouvais pratiquer pendant les pauses déjeuner et les soirées.",
            rating: 5,
            result: "A → Niveau B",
          },
        ],
      },
      faq: {
        title: "Questions? Nous Avons les Réponses",
        items: [
          {
            question: "Qu'est-ce que l'ELS (Évaluation de langue seconde)?",
            answer: "L'ELS est un test standardisé utilisé par le gouvernement du Canada pour évaluer la compétence en langue seconde des employés fédéraux. Il évalue les compétences en lecture, écriture et interaction orale.",
          },
          {
            question: "Combien de temps faut-il pour se préparer à l'ELS?",
            answer: "Le temps de préparation varie selon votre niveau actuel. La plupart des apprenants voient une amélioration significative dans les 2-4 mois de pratique régulière avec notre programme.",
          },
          {
            question: "Offrez-vous des cours de groupe ou seulement du coaching individuel?",
            answer: "Nous offrons les deux! Nos cours auto-rythmés incluent des ateliers de groupe, et nous proposons également des séances de coaching 1-à-1 personnalisées pour une amélioration ciblée.",
          },
          {
            question: "La formation est-elle admissible au financement de développement professionnel?",
            answer: "Oui! De nombreux ministères fédéraux couvrent les coûts de formation linguistique. Nous pouvons fournir la documentation pour les demandes de remboursement.",
          },
          {
            question: "Que se passe-t-il si je ne réussis pas mon ELS après votre formation?",
            answer: "Nous offrons une garantie de satisfaction. Si vous complétez notre programme et ne voyez pas d'amélioration, nous fournirons du coaching supplémentaire sans frais.",
          },
        ],
      },
      cta: {
        title: "Prêt à Faire Avancer Votre Carrière?",
        description: "Rejoignez des centaines de fonctionnaires qui ont atteint leurs objectifs linguistiques avec Lingueefy.",
        button: "Commencer Votre Essai Gratuit",
        contact: "Ou réservez un appel de consultation gratuit",
      },
    },
  };

  const c = content[language as keyof typeof content] || content.en;

  // Typewriter effect
  useEffect(() => {
    const fullText = c.hero.titleHighlight;
    let currentIndex = 0;
    
    const typeInterval = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setDisplayedText(fullText.slice(0, currentIndex));
        currentIndex++;
      } else {
        setIsTyping(false);
        clearInterval(typeInterval);
      }
    }, 100);

    return () => clearInterval(typeInterval);
  }, [c.hero.titleHighlight]);

  // Generate FAQ schema for SEO
  const faqSchema = generateFAQSchema(
    c.faq.items.map(item => ({ question: item.question, answer: item.answer }))
  );

  // Floating coaches data
  const floatingCoaches = [
    { photo: coachPhotos[0], name: "Steven B.", specialty: "Oral C", rating: 4.98, position: { top: "15%", left: "5%", rotate: "-5deg" }, delay: 0, size: "lg" as const },
    { photo: coachPhotos[1], name: "Sue-Anne R.", specialty: "Written", rating: 4.95, position: { top: "25%", right: "8%", rotate: "3deg" }, delay: 0.5, size: "md" as const },
    { photo: coachPhotos[2], name: "Erika S.", specialty: "Anxiety", rating: 4.92, position: { bottom: "30%", left: "8%", rotate: "5deg" }, delay: 1, size: "md" as const },
    { photo: coachPhotos[3], name: "Preciosa M.", specialty: "Reading", rating: 4.90, position: { bottom: "20%", right: "5%", rotate: "-3deg" }, delay: 1.5, size: "lg" as const },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <SEO
        title={language === 'fr' ? 'Lingueefy - Préparation ELS' : 'Lingueefy - SLE Preparation'}
        description={c.hero.description}
        canonical="https://www.rusingacademy.ca/lingueefy"
        type="service"
        schema={faqSchema}
      />
      
      {/* Add floating animation keyframes */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>

      {/* Hero Section - Humanized with floating coach photos */}
      <section className="relative pt-28 pb-16 md:pt-36 md:pb-24 overflow-hidden">
        {/* Background gradients - softer, more organic */}
        <div className="absolute inset-0 bg-gradient-to-br from-teal-50/80 via-white to-amber-50/50" />
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 left-[10%] w-64 h-64 bg-teal-400/15 rounded-full blur-3xl" />
          <div className="absolute top-40 right-[15%] w-80 h-80 bg-amber-400/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-[20%] w-72 h-72 bg-rose-400/10 rounded-full blur-3xl" />
        </div>
        
        {/* Floating coach photos - positioned asymmetrically */}
        {floatingCoaches.map((coach, index) => (
          <FloatingCoachBubble key={index} {...coach} />
        ))}
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge with subtle animation */}
            <Badge className="mb-6 bg-teal-100/80 text-teal-700 hover:bg-teal-100 backdrop-blur-sm border border-teal-200/50 px-4 py-2">
              <Sparkles className="w-4 h-4 mr-2" />
              {c.hero.badge}
            </Badge>
            
            {/* Title with typewriter effect */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              <span className="text-slate-900">{c.hero.title}</span>
              <br />
              <span className="bg-gradient-to-r from-teal-600 via-teal-500 to-emerald-500 bg-clip-text text-transparent">
                {displayedText}
                {isTyping && <span className="animate-pulse">|</span>}
              </span>
              <br />
              <span className="text-slate-700 text-3xl md:text-4xl lg:text-5xl font-medium">
                {c.hero.subtitle}
              </span>
            </h1>
            
            {/* Description - more breathing room */}
            <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              {c.hero.description}
            </p>
            
            {/* Search bar - inspired by Preply */}
            <div className="max-w-3xl mx-auto mb-10">
              <div className="bg-white rounded-2xl shadow-xl border border-slate-200/50 p-2 flex flex-col md:flex-row gap-2">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <Input 
                    placeholder={c.hero.searchPlaceholder}
                    className="pl-12 h-14 border-0 bg-transparent text-lg focus-visible:ring-0"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <select 
                    className="h-14 px-4 rounded-xl bg-slate-50 border-0 text-slate-700 font-medium cursor-pointer hover:bg-slate-100 transition-colors"
                    value={selectedLevel}
                    onChange={(e) => setSelectedLevel(e.target.value)}
                  >
                    {c.search.levelOptions.map((option, i) => (
                      <option key={i} value={option}>{option}</option>
                    ))}
                  </select>
                  <Link href="/coaches">
                    <Button className="h-14 px-8 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-lg font-semibold">
                      {c.hero.cta}
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
            
            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link href="/ai-coach">
                <Button size="lg" variant="outline" className="border-2 border-teal-600 text-teal-600 hover:bg-teal-50 px-8 py-6 text-lg rounded-xl">
                  <Sparkles className="mr-2 w-5 h-5" />
                  {c.hero.ctaSecondary}
                </Button>
              </Link>
            </div>
            
            {/* Stats - with icons and better visual hierarchy */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
              {c.hero.stats.map((stat, index) => (
                <div 
                  key={index} 
                  className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-slate-200/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                  <stat.icon className="w-6 h-6 text-teal-600 mx-auto mb-2" />
                  <div className="text-2xl md:text-3xl font-bold text-slate-900">{stat.value}</div>
                  <div className="text-sm text-slate-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Trusted by logos - subtle */}
        <div className="container mx-auto px-4 mt-16">
          <p className="text-center text-sm text-slate-500 mb-6 uppercase tracking-wider">
            {c.hero.trustedBy}
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 opacity-60">
            {["ESDC", "IRCC", "CRA", "DND", "PSPC", "GAC"].map((dept, i) => (
              <div key={i} className="text-slate-400 font-semibold text-lg">{dept}</div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works - Editorial rhythm with asymmetry */}
      <section className="py-20 md:py-28 bg-white relative overflow-hidden">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 right-10 w-40 h-40 border border-teal-200 rounded-full" />
          <div className="absolute bottom-20 left-10 w-60 h-60 border border-amber-200 rounded-full" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-slate-100 text-slate-700">How It Works</Badge>
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4">{c.howItWorks.title}</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">{c.howItWorks.subtitle}</p>
          </div>
          
          {/* Steps with connecting line and asymmetric cards */}
          <div className="max-w-5xl mx-auto relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-24 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-teal-200 via-teal-400 to-teal-200" />
            
            <div className="grid md:grid-cols-4 gap-8">
              {c.howItWorks.steps.map((step, index) => (
                <div 
                  key={index} 
                  className={`relative ${index % 2 === 1 ? 'md:mt-8' : ''}`}
                >
                  {/* Step number */}
                  <div className="absolute -top-3 -left-3 w-8 h-8 bg-teal-600 text-white rounded-full flex items-center justify-center font-bold text-sm z-10">
                    {index + 1}
                  </div>
                  
                  <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-white">
                    <CardContent className="p-6 text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-teal-100 to-teal-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <step.icon className="w-8 h-8 text-teal-600" />
                      </div>
                      <h3 className="text-xl font-semibold text-slate-900 mb-2">{step.title}</h3>
                      <p className="text-slate-600 mb-3">{step.description}</p>
                      <Badge variant="secondary" className="bg-slate-100 text-slate-600">
                        <Clock className="w-3 h-3 mr-1" />
                        {step.duration}
                      </Badge>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Coaches - Humanized cards */}
      <section className="py-20 md:py-28 bg-gradient-to-b from-slate-50 to-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
            <div>
              <Badge className="mb-4 bg-amber-100 text-amber-700">Expert Coaches</Badge>
              <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-2">{c.coaches.title}</h2>
              <p className="text-xl text-slate-600">{c.coaches.subtitle}</p>
            </div>
            <Link href="/coaches">
              <Button variant="outline" className="mt-4 md:mt-0 border-2 border-slate-300 hover:border-teal-600 hover:text-teal-600">
                {c.coaches.viewAll}
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {c.coaches.items.map((coach, index) => (
              <Card 
                key={index} 
                className={`border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 overflow-hidden group ${
                  index === 1 ? 'md:-mt-4' : index === 2 ? 'md:mt-4' : ''
                }`}
              >
                <CardContent className="p-0">
                  {/* Coach photo with overlay */}
                  <div className="relative h-64 overflow-hidden">
                    <img 
                      src={coach.photo} 
                      alt={coach.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />
                    
                    {/* Badge */}
                    <Badge className="absolute top-4 left-4 bg-amber-500 text-white border-0">
                      {coach.badge}
                    </Badge>
                    
                    {/* Quick actions */}
                    <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors">
                        <Heart className="w-5 h-5 text-slate-600" />
                      </button>
                      <button className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors">
                        <Video className="w-5 h-5 text-slate-600" />
                      </button>
                    </div>
                    
                    {/* Coach info overlay */}
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <h3 className="text-xl font-bold">{coach.name}</h3>
                      <p className="text-white/80">{coach.specialty}</p>
                    </div>
                  </div>
                  
                  {/* Coach details */}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                        <span className="font-bold text-slate-900">{coach.rating}</span>
                        <span className="text-slate-500">({coach.reviews} reviews)</span>
                      </div>
                      <div className="text-right">
                        <span className="text-2xl font-bold text-slate-900">${coach.price}</span>
                        <span className="text-slate-500">/hr</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {coach.languages.map((lang, i) => (
                        <Badge key={i} variant="secondary" className="bg-slate-100 text-slate-600">
                          <Globe className="w-3 h-3 mr-1" />
                          {lang}
                        </Badge>
                      ))}
                    </div>
                    
                    <Link href={`/coach/${coach.name.toLowerCase().replace(' ', '-')}`}>
                      <Button className="w-full bg-teal-600 hover:bg-teal-700 text-white">
                        Book a Lesson
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Services - Color-coded cards with asymmetry */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-rose-100 text-rose-700">Our Services</Badge>
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4">{c.services.title}</h2>
            <p className="text-xl text-slate-600">{c.services.subtitle}</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {c.services.items.map((service, index) => {
              const colorClasses = {
                teal: "from-teal-500 to-teal-600 bg-teal-50 text-teal-600",
                amber: "from-amber-500 to-amber-600 bg-amber-50 text-amber-600",
                rose: "from-rose-500 to-rose-600 bg-rose-50 text-rose-600",
                violet: "from-violet-500 to-violet-600 bg-violet-50 text-violet-600",
              };
              const colors = colorClasses[service.color as keyof typeof colorClasses];
              
              return (
                <Card 
                  key={index} 
                  className={`border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden ${
                    index % 2 === 1 ? 'md:mt-8' : ''
                  }`}
                >
                  <CardContent className="p-8">
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 ${colors.split(' ')[2]} ${colors.split(' ')[3]}`}>
                      <service.icon className="w-7 h-7" />
                    </div>
                    <h3 className="text-2xl font-semibold text-slate-900 mb-3">{service.title}</h3>
                    <p className="text-slate-600 mb-6">{service.description}</p>
                    <ul className="space-y-3">
                      {service.features.map((feature, i) => (
                        <li key={i} className="flex items-center text-slate-700">
                          <CheckCircle2 className={`w-5 h-5 mr-3 flex-shrink-0 ${colors.split(' ')[3]}`} />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials - More human, with photos */}
      <section className="py-20 md:py-28 bg-gradient-to-b from-slate-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-violet-100 text-violet-700">Success Stories</Badge>
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4">{c.testimonials.title}</h2>
            <p className="text-xl text-slate-600">{c.testimonials.subtitle}</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {c.testimonials.items.map((testimonial, index) => (
              <Card 
                key={index} 
                className={`border-0 shadow-lg hover:shadow-xl transition-all duration-300 ${
                  index === 1 ? 'md:-mt-6' : ''
                }`}
              >
                <CardContent className="p-8">
                  {/* Result badge */}
                  <Badge className="mb-4 bg-green-100 text-green-700 border-0">
                    <Award className="w-3 h-3 mr-1" />
                    {testimonial.result}
                  </Badge>
                  
                  {/* Rating */}
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  
                  {/* Quote */}
                  <p className="text-slate-700 mb-6 italic leading-relaxed">"{testimonial.quote}"</p>
                  
                  {/* Author */}
                  <div className="flex items-center gap-4">
                    <img 
                      src={testimonial.photo} 
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <div className="font-semibold text-slate-900">{testimonial.name}</div>
                      <div className="text-sm text-slate-600">{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ - Clean, accessible */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-slate-100 text-slate-700">FAQ</Badge>
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4">{c.faq.title}</h2>
          </div>
          
          <div className="max-w-3xl mx-auto space-y-4">
            {c.faq.items.map((item, index) => (
              <Card key={index} className="border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-0">
                  <button
                    className="w-full p-6 text-left flex items-center justify-between"
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  >
                    <span className="font-semibold text-slate-900 pr-4">{item.question}</span>
                    <ChevronDown 
                      className={`w-5 h-5 text-slate-500 transition-transform flex-shrink-0 ${
                        openFaq === index ? 'rotate-180' : ''
                      }`} 
                    />
                  </button>
                  {openFaq === index && (
                    <div className="px-6 pb-6 text-slate-600 leading-relaxed">
                      {item.answer}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA - Warm, inviting */}
      <section className="py-20 md:py-28 bg-gradient-to-br from-teal-600 via-teal-700 to-teal-800 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-40 h-40 bg-white/5 rounded-full blur-2xl" />
          <div className="absolute bottom-10 right-10 w-60 h-60 bg-white/5 rounded-full blur-2xl" />
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">{c.cta.title}</h2>
          <p className="text-xl text-teal-100 mb-10 max-w-2xl mx-auto">{c.cta.description}</p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/courses">
              <Button size="lg" className="bg-white text-teal-700 hover:bg-teal-50 px-10 py-6 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all">
                {c.cta.button}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
          
          <p className="mt-6 text-teal-200">
            <Link href="/booking" className="underline hover:text-white transition-colors">
              {c.cta.contact}
            </Link>
          </p>
        </div>
      </section>

      {/* Cross-Ecosystem Section */}
      <CrossEcosystemSection variant="lingueefy" />

      <FooterInstitutional />
    </div>
  );
}
