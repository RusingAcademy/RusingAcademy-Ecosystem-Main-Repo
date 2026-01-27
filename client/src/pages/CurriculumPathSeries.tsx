import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  GraduationCap,
  Target,
  Award,
  ArrowRight,
  CheckCircle,
  Clock,
  Users,
  Star,
  Sparkles,
  Play,
  FileText,
  ChevronDown,
  ChevronRight,
  Lock,
  Shield,
  Zap,
  TrendingUp,
  Building2,
  Quote,
  BadgeCheck,
  Calendar,
  BookMarked,
  Brain,
} from "lucide-react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { EcosystemFooter } from "@/components/EcosystemFooter";
import { PATH_SERIES_PRICES } from "@shared/pricing";

// Path Series data aligned with rusing.academy - CORRECT DATA
const pathSeriesData = [
  {
    id: "path-i",
    slug: "path-i-foundations",
    level: "CEFR A1",
    levelBadge: "Beginner",
    title: "Path I: FSL - Foundations",
    titleFr: "Path I: FLS - Fondations",
    subtitle: "Crash Course in Essential Communication Foundations",
    subtitleFr: "Cours Intensif sur les Bases Essentielles de la Communication",
    description: "Build the fundamental communication skills required for basic professional interactions. Learn to introduce yourself, ask simple questions, understand basic messages, and complete essential forms in a workplace context.",
    descriptionFr: "Développez les compétences de communication fondamentales requises pour les interactions professionnelles de base. Apprenez à vous présenter, poser des questions simples, comprendre les messages de base et remplir les formulaires essentiels dans un contexte de travail.",
    target: "Complete beginners starting their bilingual journey",
    targetFr: "Débutants complets commençant leur parcours bilingue",
    duration: "4 Weeks",
    structuredHours: "30 Hours",
    autonomousPractice: "80-130 Hours",
    pfl2Level: "OF 1-6",
    price: PATH_SERIES_PRICES.PATH_I.priceInCents / 100,
    originalPrice: PATH_SERIES_PRICES.PATH_I.originalPriceInCents / 100,
    color: "from-emerald-500 to-teal-600",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
    icon: "🌱",
    learningOutcomes: [
      { en: "Present yourself and others professionally", fr: "Vous présenter et présenter les autres de manière professionnelle" },
      { en: "Ask and answer simple questions about familiar topics", fr: "Poser et répondre à des questions simples sur des sujets familiers" },
      { en: "Understand and use everyday workplace expressions", fr: "Comprendre et utiliser les expressions quotidiennes du lieu de travail" },
      { en: "Describe your workspace and daily routine", fr: "Décrire votre espace de travail et votre routine quotidienne" },
      { en: "Complete administrative forms accurately", fr: "Remplir les formulaires administratifs avec précision" },
      { en: "Write simple professional messages", fr: "Rédiger des messages professionnels simples" },
    ],
  },
  {
    id: "path-ii",
    slug: "path-ii-everyday-fluency",
    level: "CEFR A2",
    levelBadge: "Elementary",
    title: "Path II: FSL - Everyday Fluency",
    titleFr: "Path II: FLS - Aisance Quotidienne",
    subtitle: "Crash Course in Everyday Workplace Interactions",
    subtitleFr: "Cours Intensif sur les Interactions Quotidiennes au Travail",
    description: "Develop confidence in daily professional interactions. Learn to discuss past events, future plans, and personal opinions. Engage in routine workplace conversations with increasing spontaneity and accuracy.",
    descriptionFr: "Développez votre confiance dans les interactions professionnelles quotidiennes. Apprenez à discuter des événements passés, des plans futurs et des opinions personnelles. Participez à des conversations de routine au travail avec une spontanéité et une précision croissantes.",
    target: "Learners with basic knowledge seeking practical skills",
    targetFr: "Apprenants avec des connaissances de base cherchant des compétences pratiques",
    duration: "4 Weeks",
    structuredHours: "30 Hours",
    autonomousPractice: "80-130 Hours",
    pfl2Level: "OF 7-12",
    price: PATH_SERIES_PRICES.PATH_II.priceInCents / 100,
    originalPrice: PATH_SERIES_PRICES.PATH_II.originalPriceInCents / 100,
    color: "from-blue-500 to-indigo-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    icon: "💬",
    learningOutcomes: [
      { en: "Narrate past events using appropriate tenses", fr: "Raconter des événements passés en utilisant les temps appropriés" },
      { en: "Discuss future projects and plans confidently", fr: "Discuter des projets et plans futurs avec confiance" },
      { en: "Express simple opinions and preferences", fr: "Exprimer des opinions et préférences simples" },
      { en: "Understand short texts on familiar topics", fr: "Comprendre des textes courts sur des sujets familiers" },
      { en: "Write basic professional emails and messages", fr: "Rédiger des courriels et messages professionnels de base" },
      { en: "Participate in routine workplace exchanges", fr: "Participer aux échanges de routine au travail" },
    ],
  },
  {
    id: "path-iii",
    slug: "path-iii-operational-french",
    level: "CEFR B1",
    levelBadge: "Intermediate",
    title: "Path III: FSL - Operational French",
    titleFr: "Path III: FLS - Français Opérationnel",
    subtitle: "Crash Course in Professional Communication for Public Servants",
    subtitleFr: "Cours Intensif en Communication Professionnelle pour Fonctionnaires",
    description: "Achieve functional professional autonomy. Develop the ability to present arguments, participate in debates, write structured reports, and handle most workplace communication situations independently and effectively.",
    descriptionFr: "Atteignez l'autonomie professionnelle fonctionnelle. Développez la capacité de présenter des arguments, participer à des débats, rédiger des rapports structurés et gérer la plupart des situations de communication au travail de manière indépendante et efficace.",
    target: "Intermediate learners aiming for BBB certification",
    targetFr: "Apprenants intermédiaires visant la certification BBB",
    duration: "4 Weeks",
    structuredHours: "30 Hours",
    autonomousPractice: "80-130 Hours",
    pfl2Level: "OF 13-22",
    price: PATH_SERIES_PRICES.PATH_III.priceInCents / 100,
    originalPrice: PATH_SERIES_PRICES.PATH_III.originalPriceInCents / 100,
    color: "from-amber-500 to-orange-600",
    bgColor: "bg-amber-50",
    borderColor: "border-[#FFE4D6]",
    icon: "📊",
    sleBadge: "BBB",
    learningOutcomes: [
      { en: "Present and defend viewpoints with structured arguments", fr: "Présenter et défendre des points de vue avec des arguments structurés" },
      { en: "Narrate complex events using multiple tenses", fr: "Raconter des événements complexes en utilisant plusieurs temps" },
      { en: "Understand main points of presentations and speeches", fr: "Comprendre les points principaux des présentations et discours" },
      { en: "Write structured reports and meeting minutes", fr: "Rédiger des rapports structurés et des procès-verbaux de réunion" },
      { en: "Participate in conversations with spontaneity", fr: "Participer à des conversations avec spontanéité" },
      { en: "Handle unpredictable workplace situations", fr: "Gérer des situations de travail imprévisibles" },
    ],
  },
  {
    id: "path-iv",
    slug: "path-iv-strategic-expression",
    level: "CEFR B2",
    levelBadge: "Upper Intermediate",
    title: "Path IV: FSL - Strategic Expression",
    titleFr: "Path IV: FLS - Expression Stratégique",
    subtitle: "Crash Course in Strategic Workplace Communication",
    subtitleFr: "Cours Intensif en Communication Stratégique au Travail",
    description: "Master precision, nuance, and leadership communication. Develop advanced grammatical structures (subjunctive, conditional), persuasive argumentation skills, and the ability to communicate effectively in complex professional contexts.",
    descriptionFr: "Maîtrisez la précision, la nuance et la communication de leadership. Développez des structures grammaticales avancées (subjonctif, conditionnel), des compétences d'argumentation persuasive et la capacité de communiquer efficacement dans des contextes professionnels complexes.",
    target: "Upper intermediate learners targeting CBC positions",
    targetFr: "Apprenants de niveau intermédiaire supérieur visant les postes CBC",
    duration: "4 Weeks",
    structuredHours: "30 Hours",
    autonomousPractice: "80-130 Hours",
    pfl2Level: "OF 23-32",
    price: PATH_SERIES_PRICES.PATH_IV.priceInCents / 100,
    originalPrice: PATH_SERIES_PRICES.PATH_IV.originalPriceInCents / 100,
    color: "from-[#0F3D3E] to-[#145A5B]",
    bgColor: "bg-[#E7F2F2]",
    borderColor: "border-[#0F3D3E]",
    icon: "🎯",
    sleBadge: "CBC",
    learningOutcomes: [
      { en: "Express hypotheses, conditions, and nuanced opinions", fr: "Exprimer des hypothèses, des conditions et des opinions nuancées" },
      { en: "Analyze complex texts and extract key information", fr: "Analyser des textes complexes et extraire les informations clés" },
      { en: "Develop persuasive, well-structured arguments", fr: "Développer des arguments persuasifs et bien structurés" },
      { en: "Communicate with fluency and spontaneity", fr: "Communiquer avec fluidité et spontanéité" },
      { en: "Write detailed, coherent professional documents", fr: "Rédiger des documents professionnels détaillés et cohérents" },
      { en: "Engage confidently in debates and negotiations", fr: "Participer avec confiance aux débats et négociations" },
    ],
  },
  {
    id: "path-v",
    slug: "path-v-professional-mastery",
    level: "CEFR C1",
    levelBadge: "Advanced",
    title: "Path V: FSL - Professional Mastery",
    titleFr: "Path V: FLS - Maîtrise Professionnelle",
    subtitle: "Crash Course in Advanced Professional Excellence",
    subtitleFr: "Cours Intensif en Excellence Professionnelle Avancée",
    description: "Achieve expert-level communication with idiomatic mastery and cultural sophistication. Develop the advanced competencies required for executive roles: facilitating meetings, negotiating complex issues, and producing high-quality professional documents.",
    descriptionFr: "Atteignez une communication de niveau expert avec une maîtrise idiomatique et une sophistication culturelle. Développez les compétences avancées requises pour les rôles exécutifs: animer des réunions, négocier des questions complexes et produire des documents professionnels de haute qualité.",
    target: "Advanced learners pursuing executive positions",
    targetFr: "Apprenants avancés poursuivant des postes de direction",
    duration: "4 Weeks",
    structuredHours: "30 Hours",
    autonomousPractice: "80-130 Hours",
    pfl2Level: "OF 33-40",
    price: PATH_SERIES_PRICES.PATH_V.priceInCents / 100,
    originalPrice: PATH_SERIES_PRICES.PATH_V.originalPriceInCents / 100,
    color: "from-[#C65A1E] to-[#E06B2D]",
    bgColor: "bg-[#FFF1E8]",
    borderColor: "border-[#C65A1E]",
    icon: "👔",
    sleBadge: "CCC",
    learningOutcomes: [
      { en: "Use idiomatic expressions and cultural references naturally", fr: "Utiliser des expressions idiomatiques et des références culturelles naturellement" },
      { en: "Express yourself precisely on complex topics", fr: "Vous exprimer avec précision sur des sujets complexes" },
      { en: "Facilitate meetings and lead negotiations with authority", fr: "Animer des réunions et mener des négociations avec autorité" },
      { en: "Produce sophisticated, well-structured documents", fr: "Produire des documents sophistiqués et bien structurés" },
      { en: "Understand implicit meanings and subtle nuances", fr: "Comprendre les significations implicites et les nuances subtiles" },
      { en: "Communicate at executive and leadership levels", fr: "Communiquer aux niveaux exécutif et de leadership" },
    ],
  },
  {
    id: "path-vi",
    slug: "path-vi-sle-accelerator",
    level: "Exam Prep",
    levelBadge: "Intensive",
    title: "Path VI: FSL - SLE Accelerator",
    titleFr: "Path VI: FLS - Accélérateur ELS",
    subtitle: "Crash Course in SLE Success Strategies",
    subtitleFr: "Cours Intensif sur les Stratégies de Réussite à l'ELS",
    description: "Intensive preparation specifically designed for Second Language Evaluation (SLE) success. Master exam strategies, complete five full practice exams with detailed feedback, and develop the confidence and techniques needed for maximum performance.",
    descriptionFr: "Préparation intensive spécialement conçue pour réussir l'Évaluation de Langue Seconde (ELS). Maîtrisez les stratégies d'examen, complétez cinq examens pratiques complets avec des commentaires détaillés et développez la confiance et les techniques nécessaires pour une performance maximale.",
    target: "Anyone preparing for upcoming SLE exams",
    targetFr: "Toute personne se préparant aux examens ELS à venir",
    duration: "4 Weeks",
    structuredHours: "30 Hours",
    practiceExams: "5 Complete",
    coachingSessions: "5-Hour Quick Prep",
    price: PATH_SERIES_PRICES.PATH_VI.priceInCents / 100,
    originalPrice: PATH_SERIES_PRICES.PATH_VI.originalPriceInCents / 100,
    color: "from-teal-500 to-cyan-600",
    bgColor: "bg-teal-50",
    borderColor: "border-teal-200",
    icon: "🏆",
    sleBadge: "BBB/CBC/CCC",
    learningOutcomes: [
      { en: "Master SLE exam structure and evaluation criteria", fr: "Maîtriser la structure de l'examen ELS et les critères d'évaluation" },
      { en: "Apply proven test-taking strategies for each component", fr: "Appliquer des stratégies de test éprouvées pour chaque composante" },
      { en: "Complete 5 full practice exams under timed conditions", fr: "Compléter 5 examens pratiques complets en temps limité" },
      { en: "Receive detailed feedback on all practice attempts", fr: "Recevoir des commentaires détaillés sur toutes les tentatives de pratique" },
      { en: "Develop stress management and performance techniques", fr: "Développer des techniques de gestion du stress et de performance" },
      { en: "Target and remediate specific weaknesses", fr: "Cibler et corriger les faiblesses spécifiques" },
    ],
  },
];

// Testimonials data
const testimonials = [
  {
    name: "Marie-Claire Dubois",
    role: "Policy Analyst",
    org: "Treasury Board Secretariat",
    quote: "Path Series helped me achieve my CBC profile in just 4 months. The structured approach and expert coaching made all the difference.",
    quoteFr: "Path Series m'a aidée à obtenir mon profil CBC en seulement 4 mois. L'approche structurée et le coaching expert ont fait toute la différence.",
    rating: 5,
  },
  {
    name: "James Thompson",
    role: "Senior Manager",
    org: "Employment and Social Development Canada",
    quote: "After years of struggling with traditional methods, Path Series finally gave me the confidence to pass my Level C oral exam.",
    quoteFr: "Après des années de lutte avec les méthodes traditionnelles, Path Series m'a enfin donné la confiance pour réussir mon examen oral de niveau C.",
    rating: 5,
  },
  {
    name: "Sophie Tremblay",
    role: "Director",
    org: "Health Canada",
    quote: "The curriculum is perfectly aligned with what you actually need for the SLE. No fluff, just results.",
    quoteFr: "Le curriculum est parfaitement aligné avec ce dont vous avez réellement besoin pour l'ELS. Pas de superflu, juste des résultats.",
    rating: 5,
  },
];

// Value propositions
const valueProps = [
  {
    icon: Target,
    title: "SLE-Focused Curriculum",
    titleFr: "Curriculum Axé sur l'ELS",
    desc: "Every lesson is designed specifically for the federal SLE exam requirements.",
    descFr: "Chaque leçon est conçue spécifiquement pour les exigences de l'examen ELS fédéral.",
  },
  {
    icon: TrendingUp,
    title: "Proven Results",
    titleFr: "Résultats Prouvés",
    desc: "94% of our students achieve their target SLE level within 6 months.",
    descFr: "94% de nos étudiants atteignent leur niveau ELS cible en 6 mois.",
  },
  {
    icon: Users,
    title: "Expert Instructors",
    titleFr: "Instructeurs Experts",
    desc: "Learn from certified SLE coaches with 10+ years of federal experience.",
    descFr: "Apprenez de coachs ELS certifiés avec plus de 10 ans d'expérience fédérale.",
  },
  {
    icon: Zap,
    title: "Flexible Learning",
    titleFr: "Apprentissage Flexible",
    desc: "Study at your own pace with lifetime access to all course materials.",
    descFr: "Étudiez à votre rythme avec un accès à vie à tous les supports de cours.",
  },
];

// Trusted organizations
const trustedOrgs = [
  "Treasury Board",
  "Health Canada",
  "ESDC",
  "CRA",
  "IRCC",
  "DND",
];

export default function CurriculumPathSeries() {
  const { language } = useLanguage();
  const { user, isAuthenticated } = useAuth();
  const isEn = language === "en";
  const [selectedPath, setSelectedPath] = useState("path-i");
  const [isPurchasing, setIsPurchasing] = useState(false);

  const purchaseMutation = trpc.stripe.createCourseCheckout.useMutation({
    onSuccess: (data) => {
      toast.success(isEn ? "Redirecting to checkout..." : "Redirection vers le paiement...");
      window.open(data.url, "_blank");
      setIsPurchasing(false);
    },
    onError: (error) => {
      toast.error(error.message || (isEn ? "Failed to start checkout" : "Échec du démarrage du paiement"));
      setIsPurchasing(false);
    },
  });

  const handlePurchase = (courseSlug: string) => {
    if (!isAuthenticated) {
      toast.info(isEn ? "Please log in to purchase" : "Veuillez vous connecter pour acheter");
      window.location.href = getLoginUrl();
      return;
    }
    
    setIsPurchasing(true);
    purchaseMutation.mutate({
      courseId: courseSlug,
      locale: language as 'en' | 'fr',
    });
  };

  const currentPath = pathSeriesData.find(p => p.id === selectedPath) || pathSeriesData[0];

  return (
    <div className="min-h-screen flex flex-col bg-[#FDF8F3]">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-16 lg:py-24 bg-gradient-to-br from-[#0F3D3E] via-[#145A5B] to-[#0F3D3E]">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
          
          <div className="container relative z-10">
            <div className="max-w-4xl mx-auto text-center space-y-6">
              <Badge className="bg-[#C65A1E] text-white px-4 py-1.5 text-sm font-medium">
                <Sparkles className="h-4 w-4 mr-2" />
                {isEn ? "Path Series™ Curriculum" : "Curriculum Path Series™"}
              </Badge>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white">
                <span className="italic font-serif">{isEn ? "Your Roadmap to" : "Votre Feuille de Route vers"}</span>
                <br />
                <span className="text-[#C65A1E]">{isEn ? "Bilingual Excellence" : "l'Excellence Bilingue"}</span>
              </h1>
              
              <p className="text-xl text-white/80 max-w-2xl mx-auto">
                {isEn 
                  ? "Six structured paths from Level A to CCC. Each path is designed for federal public servants with clear objectives and measurable outcomes."
                  : "Six parcours structurés du niveau A au CCC. Chaque parcours est conçu pour les fonctionnaires fédéraux avec des objectifs clairs et des résultats mesurables."
                }
              </p>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                  <div className="text-3xl font-bold text-[#C65A1E]">6</div>
                  <div className="text-sm text-white/70">{isEn ? "Complete Paths" : "Parcours Complets"}</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                  <div className="text-3xl font-bold text-[#C65A1E]">180</div>
                  <div className="text-sm text-white/70">{isEn ? "Structured Hours" : "Heures Structurées"}</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                  <div className="text-3xl font-bold text-[#C65A1E]">3-4x</div>
                  <div className="text-sm text-white/70">{isEn ? "Faster Results" : "Résultats Plus Rapides"}</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                  <div className="text-3xl font-bold text-[#C65A1E]">94%</div>
                  <div className="text-sm text-white/70">{isEn ? "Success Rate" : "Taux de Réussite"}</div>
                </div>
              </div>

              <div className="flex flex-wrap justify-center gap-4 pt-4">
                <Button 
                  size="lg" 
                  className="bg-[#C65A1E] hover:bg-[#A84A15] text-white"
                  onClick={() => document.getElementById('paths-section')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  {isEn ? "Explore Paths" : "Explorer les Parcours"}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Link href="/lingueefy">
                  <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                    {isEn ? "Talk to a Coach" : "Parler à un Coach"}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Why Path Series Section */}
        <section className="py-16 bg-white">
          <div className="container">
            <div className="text-center mb-12">
              <p className="text-sm font-medium text-[#C65A1E] uppercase tracking-wider mb-2">
                {isEn ? "Why Path Series™" : "Pourquoi Path Series™"}
              </p>
              <h2 className="text-3xl font-bold text-[#0F3D3E]">
                {isEn ? "Built for Federal Success" : "Conçu pour la Réussite Fédérale"}
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto mt-4">
                {isEn 
                  ? "Our curriculum is specifically designed to help Canadian public servants achieve their bilingual requirements efficiently."
                  : "Notre curriculum est spécifiquement conçu pour aider les fonctionnaires canadiens à atteindre leurs exigences bilingues efficacement."
                }
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {valueProps.map((prop, index) => (
                <Card key={index} className="border-none shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="p-6 text-center">
                    <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-[#C65A1E]/10 flex items-center justify-center">
                      <prop.icon className="h-7 w-7 text-[#C65A1E]" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2 text-[#0F3D3E]">
                      {isEn ? prop.title : prop.titleFr}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {isEn ? prop.desc : prop.descFr}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Trusted By */}
            <div className="mt-12 text-center">
              <p className="text-sm text-muted-foreground mb-4 uppercase tracking-wider">
                {isEn ? "Trusted by public servants from" : "Approuvé par les fonctionnaires de"}
              </p>
              <div className="flex flex-wrap justify-center gap-6">
                {trustedOrgs.map((org, index) => (
                  <div key={index} className="flex items-center gap-2 text-muted-foreground">
                    <Building2 className="h-4 w-4" />
                    <span className="text-sm font-medium">{org}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Path Selection Section */}
        <section id="paths-section" className="py-16 bg-[#FDF8F3]">
          <div className="container">
            {/* Path Tabs */}
            <div className="flex flex-wrap justify-center gap-2 mb-12">
              {pathSeriesData.map((path) => (
                <button
                  key={path.id}
                  onClick={() => setSelectedPath(path.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedPath === path.id
                      ? "bg-[#C65A1E] text-white shadow-lg"
                      : "bg-white text-[#0F3D3E] hover:bg-[#C65A1E]/10 border border-gray-200"
                  }`}
                >
                  <span className="mr-2">{path.icon}</span>
                  Path {path.id.split('-')[1].toUpperCase()}
                </button>
              ))}
            </div>

            {/* Selected Path Details */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPath.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="grid lg:grid-cols-3 gap-8"
              >
                {/* Path Info */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-4xl">{currentPath.icon}</span>
                    <Badge className={`bg-gradient-to-r ${currentPath.color} text-white`}>
                      {currentPath.level}
                    </Badge>
                    {currentPath.sleBadge && (
                      <Badge variant="outline" className="border-[#C65A1E] text-[#C65A1E]">
                        SLE {currentPath.sleBadge}
                      </Badge>
                    )}
                  </div>

                  <div>
                    <h2 className="text-3xl font-bold text-[#0F3D3E] mb-2">
                      {isEn ? currentPath.title : currentPath.titleFr}
                    </h2>
                    <p className="text-lg text-[#C65A1E] font-medium">
                      {isEn ? currentPath.subtitle : currentPath.subtitleFr}
                    </p>
                  </div>

                  <p className="text-muted-foreground leading-relaxed">
                    {isEn ? currentPath.description : currentPath.descriptionFr}
                  </p>

                  {/* Course Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <Calendar className="h-5 w-5 text-[#C65A1E] mb-2" />
                      <div className="text-sm text-muted-foreground">{isEn ? "Duration" : "Durée"}</div>
                      <div className="font-semibold text-[#0F3D3E]">{currentPath.duration}</div>
                    </div>
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <Clock className="h-5 w-5 text-[#C65A1E] mb-2" />
                      <div className="text-sm text-muted-foreground">{isEn ? "Structured Hours" : "Heures Structurées"}</div>
                      <div className="font-semibold text-[#0F3D3E]">{currentPath.structuredHours}</div>
                    </div>
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <Brain className="h-5 w-5 text-[#C65A1E] mb-2" />
                      <div className="text-sm text-muted-foreground">{isEn ? "Practice" : "Pratique"}</div>
                      <div className="font-semibold text-[#0F3D3E]">{currentPath.autonomousPractice || currentPath.practiceExams}</div>
                    </div>
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <BookMarked className="h-5 w-5 text-[#C65A1E] mb-2" />
                      <div className="text-sm text-muted-foreground">{isEn ? "PFL2 Level" : "Niveau PFL2"}</div>
                      <div className="font-semibold text-[#0F3D3E]">{currentPath.pfl2Level || currentPath.coachingSessions}</div>
                    </div>
                  </div>

                  {/* Learning Outcomes */}
                  <div className="bg-white rounded-xl p-6 shadow-sm">
                    <h3 className="font-semibold text-lg text-[#0F3D3E] mb-4 flex items-center gap-2">
                      <Target className="h-5 w-5 text-[#C65A1E]" />
                      {isEn ? "Key Learning Outcomes" : "Résultats d'Apprentissage Clés"}
                    </h3>
                    <div className="grid md:grid-cols-2 gap-3">
                      {currentPath.learningOutcomes.map((outcome, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-muted-foreground">
                            {isEn ? outcome.en : outcome.fr}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Target Audience */}
                  <div className="bg-[#0F3D3E]/5 rounded-xl p-4 flex items-center gap-3">
                    <Users className="h-5 w-5 text-[#0F3D3E]" />
                    <div>
                      <span className="text-sm font-medium text-[#0F3D3E]">
                        {isEn ? "Target Audience: " : "Public Cible: "}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {isEn ? currentPath.target : currentPath.targetFr}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Pricing Card */}
                <div className="lg:col-span-1">
                  <Card className="sticky top-24 shadow-xl border-none overflow-hidden">
                    <div className={`bg-gradient-to-r ${currentPath.color} p-6 text-white text-center`}>
                      <h3 className="text-xl font-semibold mb-2">
                        {isEn ? "Enroll Now" : "Inscrivez-vous"}
                      </h3>
                      <div className="flex items-center justify-center gap-3">
                        <span className="text-4xl font-bold">${currentPath.price}</span>
                        <span className="text-lg line-through opacity-70">${currentPath.originalPrice}</span>
                      </div>
                      <Badge className="mt-2 bg-white/20 text-white">
                        {Math.round((1 - currentPath.price / currentPath.originalPrice) * 100)}% OFF
                      </Badge>
                    </div>
                    <CardContent className="p-6 space-y-4">
                      <ul className="space-y-3">
                        <li className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-emerald-500" />
                          {isEn ? "Lifetime access" : "Accès à vie"}
                        </li>
                        <li className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-emerald-500" />
                          {isEn ? "Certificate of completion" : "Certificat d'achèvement"}
                        </li>
                        <li className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-emerald-500" />
                          {isEn ? "Downloadable resources" : "Ressources téléchargeables"}
                        </li>
                        <li className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-emerald-500" />
                          {isEn ? "Practice quizzes" : "Quiz de pratique"}
                        </li>
                        <li className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-emerald-500" />
                          {isEn ? "Community access" : "Accès à la communauté"}
                        </li>
                      </ul>

                      <Button 
                        className="w-full bg-[#C65A1E] hover:bg-[#A84A15] text-white"
                        size="lg"
                        onClick={() => handlePurchase(currentPath.slug)}
                        disabled={isPurchasing}
                      >
                        {isPurchasing 
                          ? (isEn ? "Processing..." : "Traitement...")
                          : (isEn ? "Get Started" : "Commencer")
                        }
                      </Button>

                      <p className="text-xs text-center text-muted-foreground">
                        {isEn ? "30-day money-back guarantee" : "Garantie de remboursement de 30 jours"}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-16 bg-white">
          <div className="container">
            <div className="text-center mb-12">
              <p className="text-sm font-medium text-[#C65A1E] uppercase tracking-wider mb-2">
                {isEn ? "Success Stories" : "Témoignages de Réussite"}
              </p>
              <h2 className="text-3xl font-bold text-[#0F3D3E]">
                {isEn ? "What Our Students Say" : "Ce Que Disent Nos Étudiants"}
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto mt-4">
                {isEn 
                  ? "Join thousands of federal public servants who have achieved their bilingual goals."
                  : "Rejoignez des milliers de fonctionnaires fédéraux qui ont atteint leurs objectifs bilingues."
                }
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="border-none shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 fill-[#C65A1E] text-[#C65A1E]" />
                      ))}
                    </div>
                    <Quote className="h-8 w-8 text-[#C65A1E]/20 mb-2" />
                    <p className="text-muted-foreground mb-4 italic">
                      "{isEn ? testimonial.quote : testimonial.quoteFr}"
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0F3D3E] to-[#C65A1E] flex items-center justify-center text-white font-semibold">
                        {testimonial.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold text-[#0F3D3E]">{testimonial.name}</div>
                        <div className="text-xs text-muted-foreground">{testimonial.role}, {testimonial.org}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-[#0F3D3E] to-[#145A5B]">
          <div className="container text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              {isEn ? "Ready to Start Your Journey?" : "Prêt à Commencer Votre Parcours?"}
            </h2>
            <p className="text-white/80 max-w-2xl mx-auto mb-8">
              {isEn 
                ? "Join thousands of federal public servants who have transformed their careers with Path Series™."
                : "Rejoignez des milliers de fonctionnaires fédéraux qui ont transformé leur carrière avec Path Series™."
              }
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/courses">
                <Button size="lg" className="bg-[#C65A1E] hover:bg-[#A84A15] text-white">
                  {isEn ? "Browse All Courses" : "Parcourir Tous les Cours"}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/lingueefy">
                <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                  {isEn ? "Find a Coach" : "Trouver un Coach"}
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <EcosystemFooter lang={isEn ? 'en' : 'fr'} theme="light" activeBrand="rusingacademy" />
    </div>
  );
}
