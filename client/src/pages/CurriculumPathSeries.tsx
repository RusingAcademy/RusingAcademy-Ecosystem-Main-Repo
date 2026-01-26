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
} from "lucide-react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { EcosystemFooter } from "@/components/EcosystemFooter";

// Path Series data with detailed curriculum
const pathSeriesData = [
  {
    id: "path-i",
    slug: "path-i-foundations",
    level: "Level A",
    title: "Path I: Foundations",
    titleFr: "Path I: Fondations",
    subtitle: "French Communication Basics",
    subtitleFr: "Bases de la Communication Française",
    description: "Build your foundation in French communication for the federal public service. This comprehensive course covers essential grammar, vocabulary, and pronunciation for Level A proficiency.",
    descriptionFr: "Construisez votre base en communication française pour la fonction publique fédérale. Ce cours complet couvre la grammaire essentielle, le vocabulaire et la prononciation pour le niveau A.",
    target: "Complete beginners starting their bilingual journey",
    targetFr: "Débutants complets commençant leur parcours bilingue",
    duration: "8 hours",
    modules: 6,
    lessons: 24,
    price: 297,
    originalPrice: 397,
    color: "from-emerald-500 to-teal-600",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
    icon: "🌱",
    modules_detail: [
      { title: "French Phonetics & Pronunciation", lessons: 4, duration: "80 min", isPreview: true },
      { title: "Essential Grammar Foundations", lessons: 4, duration: "80 min", isPreview: false },
      { title: "Workplace Vocabulary Basics", lessons: 4, duration: "80 min", isPreview: false },
      { title: "Simple Conversations", lessons: 4, duration: "80 min", isPreview: false },
      { title: "Reading Comprehension Level A", lessons: 4, duration: "80 min", isPreview: false },
      { title: "Assessment & Practice", lessons: 4, duration: "80 min", isPreview: false },
    ],
  },
  {
    id: "path-ii",
    slug: "path-ii-oral-essentials",
    level: "Level B Oral",
    title: "Path II: Oral Essentials",
    titleFr: "Path II: Essentiels Oraux",
    subtitle: "Conversation Fluency for SLE",
    subtitleFr: "Fluidité Conversationnelle pour l'ELS",
    description: "Develop your oral communication skills for SLE Level B. Focus on conversation fluency, professional vocabulary, and workplace scenarios.",
    descriptionFr: "Développez vos compétences en communication orale pour le niveau B de l'ELS. Concentrez-vous sur la fluidité conversationnelle, le vocabulaire professionnel et les scénarios de travail.",
    target: "Learners aiming for Level B oral proficiency",
    targetFr: "Apprenants visant la compétence orale de niveau B",
    duration: "10.5 hours",
    modules: 8,
    lessons: 32,
    price: 397,
    originalPrice: 497,
    color: "from-blue-500 to-indigo-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    icon: "🎤",
    sleBadge: "B Oral",
    modules_detail: [
      { title: "Conversation Fluency Basics", lessons: 4, duration: "80 min", isPreview: true },
      { title: "Professional Vocabulary", lessons: 4, duration: "80 min", isPreview: false },
      { title: "Listening Comprehension", lessons: 4, duration: "80 min", isPreview: false },
      { title: "Speaking with Confidence", lessons: 4, duration: "80 min", isPreview: false },
      { title: "Workplace Scenarios", lessons: 4, duration: "80 min", isPreview: false },
      { title: "Oral Interaction Strategies", lessons: 4, duration: "80 min", isPreview: false },
      { title: "Mock Oral Assessments", lessons: 4, duration: "80 min", isPreview: false },
      { title: "Level B Oral Certification Prep", lessons: 4, duration: "80 min", isPreview: false },
    ],
  },
  {
    id: "path-iii",
    slug: "path-iii-written-mastery",
    level: "Level B Written",
    title: "Path III: Written Mastery",
    titleFr: "Path III: Maîtrise Écrite",
    subtitle: "Professional Writing Excellence",
    subtitleFr: "Excellence en Rédaction Professionnelle",
    description: "Master written French for the federal workplace. Learn to write professional emails, reports, and briefing notes for Level B written proficiency.",
    descriptionFr: "Maîtrisez le français écrit pour le milieu de travail fédéral. Apprenez à rédiger des courriels, des rapports et des notes d'information professionnels pour le niveau B écrit.",
    target: "Learners aiming for Level B written proficiency",
    targetFr: "Apprenants visant la compétence écrite de niveau B",
    duration: "10.5 hours",
    modules: 8,
    lessons: 32,
    price: 397,
    originalPrice: 497,
    color: "from-amber-500 to-orange-600",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    icon: "✍️",
    sleBadge: "B Written",
    modules_detail: [
      { title: "Grammar Review & Enhancement", lessons: 4, duration: "80 min", isPreview: true },
      { title: "Professional Email Writing", lessons: 4, duration: "80 min", isPreview: false },
      { title: "Report Writing Fundamentals", lessons: 4, duration: "80 min", isPreview: false },
      { title: "Briefing Notes & Memos", lessons: 4, duration: "80 min", isPreview: false },
      { title: "Style & Tone", lessons: 4, duration: "80 min", isPreview: false },
      { title: "Editing & Proofreading", lessons: 4, duration: "80 min", isPreview: false },
      { title: "Written Assessment Practice", lessons: 4, duration: "80 min", isPreview: false },
      { title: "Level B Written Certification Prep", lessons: 4, duration: "80 min", isPreview: false },
    ],
  },
  {
    id: "path-iv",
    slug: "path-iv-advanced-oral",
    level: "Level C Oral",
    title: "Path IV: Advanced Oral",
    titleFr: "Path IV: Oral Avancé",
    subtitle: "Executive Presentation Skills",
    subtitleFr: "Compétences de Présentation Exécutive",
    description: "Achieve Level C oral proficiency with advanced conversation techniques, complex vocabulary, and nuanced expression for executive-level communication.",
    descriptionFr: "Atteignez la compétence orale de niveau C avec des techniques de conversation avancées, un vocabulaire complexe et une expression nuancée pour la communication de niveau exécutif.",
    target: "Advanced learners pursuing Level C oral",
    targetFr: "Apprenants avancés visant le niveau C oral",
    duration: "13.5 hours",
    modules: 10,
    lessons: 40,
    price: 497,
    originalPrice: 597,
    color: "from-purple-500 to-violet-600",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
    icon: "🎯",
    sleBadge: "C Oral",
    modules_detail: [
      { title: "Advanced Vocabulary & Idioms", lessons: 4, duration: "80 min", isPreview: true },
      { title: "Complex Discussion Skills", lessons: 4, duration: "80 min", isPreview: false },
      { title: "Presentation Excellence", lessons: 4, duration: "80 min", isPreview: false },
      { title: "Negotiation & Persuasion", lessons: 4, duration: "80 min", isPreview: false },
      { title: "Media & Public Speaking", lessons: 4, duration: "80 min", isPreview: false },
      { title: "Cultural Nuances", lessons: 4, duration: "80 min", isPreview: false },
      { title: "Advanced Scenario Practice", lessons: 4, duration: "80 min", isPreview: false },
      { title: "Mock Level C Assessments", lessons: 4, duration: "80 min", isPreview: false },
      { title: "Stress Management & Performance", lessons: 4, duration: "80 min", isPreview: false },
      { title: "Level C Oral Certification Prep", lessons: 4, duration: "80 min", isPreview: false },
    ],
  },
  {
    id: "path-v",
    slug: "path-v-executive-written",
    level: "Level C Written",
    title: "Path V: Executive Written",
    titleFr: "Path V: Écrit Exécutif",
    subtitle: "Policy & Strategic Writing",
    subtitleFr: "Rédaction Politique et Stratégique",
    description: "Elevate your written French to Level C. Master complex document types, executive summaries, and policy writing for senior leadership roles.",
    descriptionFr: "Élevez votre français écrit au niveau C. Maîtrisez les types de documents complexes, les résumés exécutifs et la rédaction de politiques pour les rôles de direction.",
    target: "Advanced learners pursuing Level C written",
    targetFr: "Apprenants avancés visant le niveau C écrit",
    duration: "13.5 hours",
    modules: 10,
    lessons: 40,
    price: 497,
    originalPrice: 597,
    color: "from-rose-500 to-pink-600",
    bgColor: "bg-rose-50",
    borderColor: "border-rose-200",
    icon: "📝",
    sleBadge: "C Written",
    modules_detail: [
      { title: "Executive Writing Principles", lessons: 4, duration: "80 min", isPreview: true },
      { title: "Policy Document Writing", lessons: 4, duration: "80 min", isPreview: false },
      { title: "Executive Summaries", lessons: 4, duration: "80 min", isPreview: false },
      { title: "Strategic Communications", lessons: 4, duration: "80 min", isPreview: false },
      { title: "Complex Document Types", lessons: 4, duration: "80 min", isPreview: false },
      { title: "Advanced Grammar & Style", lessons: 4, duration: "80 min", isPreview: false },
      { title: "Editing for Excellence", lessons: 4, duration: "80 min", isPreview: false },
      { title: "Written Assessment Mastery", lessons: 4, duration: "80 min", isPreview: false },
      { title: "Timed Writing Practice", lessons: 4, duration: "80 min", isPreview: false },
      { title: "Level C Written Certification Prep", lessons: 4, duration: "80 min", isPreview: false },
    ],
  },
  {
    id: "path-vi",
    slug: "path-vi-bilingual-excellence",
    level: "CBC/CCC",
    title: "Path VI: Bilingual Excellence",
    titleFr: "Path VI: Excellence Bilingue",
    subtitle: "Complete SLE Integration",
    subtitleFr: "Intégration Complète de l'ELS",
    description: "The ultimate integration course combining all SLE competencies. Perfect for those seeking CBC or CCC profiles with full exam preparation.",
    descriptionFr: "Le cours d'intégration ultime combinant toutes les compétences de l'ELS. Parfait pour ceux qui visent les profils CBC ou CCC avec une préparation complète aux examens.",
    target: "Learners seeking CBC/CCC certification",
    targetFr: "Apprenants visant la certification CBC/CCC",
    duration: "16 hours",
    modules: 12,
    lessons: 48,
    price: 597,
    originalPrice: 797,
    color: "from-teal-500 to-cyan-600",
    bgColor: "bg-teal-50",
    borderColor: "border-teal-200",
    icon: "🏆",
    sleBadge: "CBC/CCC",
    modules_detail: [
      { title: "Integrated Language Assessment", lessons: 4, duration: "80 min", isPreview: true },
      { title: "Oral Proficiency Integration", lessons: 4, duration: "80 min", isPreview: false },
      { title: "Written Proficiency Integration", lessons: 4, duration: "80 min", isPreview: false },
      { title: "Reading Comprehension Mastery", lessons: 4, duration: "80 min", isPreview: false },
      { title: "Cross-Competency Practice", lessons: 4, duration: "80 min", isPreview: false },
      { title: "SLE Exam Strategies", lessons: 4, duration: "80 min", isPreview: false },
      { title: "Mock Oral Exam (CBC/CCC)", lessons: 4, duration: "80 min", isPreview: false },
      { title: "Mock Written Exam (CBC/CCC)", lessons: 4, duration: "80 min", isPreview: false },
      { title: "Mock Reading Exam (CBC/CCC)", lessons: 4, duration: "80 min", isPreview: false },
      { title: "Performance Analysis", lessons: 4, duration: "80 min", isPreview: false },
      { title: "Targeted Improvement Plan", lessons: 4, duration: "80 min", isPreview: false },
      { title: "Final Certification Preparation", lessons: 4, duration: "80 min", isPreview: false },
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

export default function CurriculumPathSeries() {
  const { language } = useLanguage();
  const { user, isAuthenticated } = useAuth();
  const isEn = language === "en";
  const [selectedPath, setSelectedPath] = useState("path-i");
  const [expandedModules, setExpandedModules] = useState<string[]>(["module-0"]);
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

  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev => 
      prev.includes(moduleId) 
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  const currentPath = pathSeriesData.find(p => p.id === selectedPath) || pathSeriesData[0];

  return (
    <div className="min-h-screen flex flex-col bg-[#FDF8F3]">
      <main className="flex-1">
        {/* Hero Section - Premium Design */}
        <section className="relative overflow-hidden py-20 lg:py-28 bg-gradient-to-br from-[#082038] via-[#0F3D3E] to-[#082038]">
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
            <div className="absolute top-20 left-10 w-96 h-96 bg-[#F97316]/20 rounded-full blur-[100px]" />
            <div className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-[120px]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#F97316]/5 rounded-full blur-[150px]" />
          </div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
            <div className="max-w-4xl mx-auto text-center space-y-8">
              {/* Badge with glassmorphism */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Badge className="bg-white/10 backdrop-blur-md text-white border-white/20 px-5 py-2 text-sm font-medium shadow-lg">
                  <Sparkles className="h-4 w-4 mr-2 text-[#F97316]" />
                  {isEn ? "Path Series™ Curriculum" : "Curriculum Path Series™"}
                </Badge>
              </motion.div>
              
              {/* Main heading */}
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white"
              >
                {isEn ? "Your Roadmap to" : "Votre Feuille de Route vers"}
                <span className="block mt-2 bg-gradient-to-r from-[#F97316] via-amber-400 to-[#F97316] bg-clip-text text-transparent">
                  {isEn ? "Bilingual Excellence" : "l'Excellence Bilingue"}
                </span>
              </motion.h1>
              
              {/* Lead paragraph */}
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-xl text-white/80 max-w-2xl mx-auto leading-relaxed"
              >
                {isEn 
                  ? "Six structured paths from Level A to CCC. Each path is designed for federal public servants with clear objectives and measurable outcomes."
                  : "Six parcours structurés du niveau A au CCC. Chaque parcours est conçu pour les fonctionnaires fédéraux avec des objectifs clairs et des résultats mesurables."
                }
              </motion.p>

              {/* Stats with glassmorphism cards */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex flex-wrap justify-center gap-4 pt-6"
              >
                {[
                  { value: "216", label: isEn ? "Total Lessons" : "Leçons au Total" },
                  { value: "54", label: isEn ? "Modules" : "Modules" },
                  { value: "72+", label: isEn ? "Hours of Content" : "Heures de Contenu" },
                  { value: "94%", label: isEn ? "Success Rate" : "Taux de Réussite" },
                ].map((stat, i) => (
                  <div 
                    key={i}
                    className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-6 py-4 min-w-[140px]"
                  >
                    <div className="text-3xl font-bold text-[#F97316]">{stat.value}</div>
                    <div className="text-sm text-white/70">{stat.label}</div>
                  </div>
                ))}
              </motion.div>

              {/* CTA Buttons */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="flex flex-col sm:flex-row gap-4 justify-center pt-4"
              >
                <Button 
                  size="lg" 
                  className="bg-[#F97316] hover:bg-[#EA580C] text-white px-8 py-6 text-lg shadow-lg shadow-[#F97316]/30"
                  onClick={() => document.getElementById('path-tabs')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  {isEn ? "Explore Paths" : "Explorer les Parcours"}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Link href="/coaches">
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="border-white/30 text-white hover:bg-white/10 px-8 py-6 text-lg backdrop-blur-sm"
                  >
                    {isEn ? "Talk to a Coach" : "Parler à un Coach"}
                  </Button>
                </Link>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Why Path Series - Value Props */}
        <section className="py-16 lg:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-12">
              <Badge className="bg-[#F97316]/10 text-[#F97316] border-[#F97316]/20 mb-4">
                {isEn ? "Why Path Series™" : "Pourquoi Path Series™"}
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-[#082038] mb-4">
                {isEn ? "Built for Federal Success" : "Conçu pour la Réussite Fédérale"}
              </h2>
              <p className="text-lg text-[#4A5B66] max-w-2xl mx-auto">
                {isEn 
                  ? "Our curriculum is specifically designed to help Canadian public servants achieve their bilingual requirements efficiently."
                  : "Notre curriculum est spécifiquement conçu pour aider les fonctionnaires canadiens à atteindre leurs exigences bilingues efficacement."
                }
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {valueProps.map((prop, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  <Card className="h-full border-2 border-transparent hover:border-[#F97316]/20 transition-all duration-300 hover:shadow-xl group">
                    <CardContent className="p-6 text-center">
                      <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-gradient-to-br from-[#F97316]/10 to-[#F97316]/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <prop.icon className="h-7 w-7 text-[#F97316]" />
                      </div>
                      <h3 className="text-lg font-semibold text-[#082038] mb-2">
                        {isEn ? prop.title : prop.titleFr}
                      </h3>
                      <p className="text-sm text-[#4A5B66]">
                        {isEn ? prop.desc : prop.descFr}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Trusted By Section */}
        <section className="py-12 bg-[#F5F5F0]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-8">
              <p className="text-sm font-medium text-[#4A5B66] uppercase tracking-wider">
                {isEn ? "Trusted by public servants from" : "Approuvé par les fonctionnaires de"}
              </p>
            </div>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 opacity-60">
              {[
                "Treasury Board",
                "Health Canada",
                "ESDC",
                "CRA",
                "IRCC",
                "DND",
              ].map((org, i) => (
                <div key={i} className="flex items-center gap-2 text-[#082038]">
                  <Building2 className="h-5 w-5" />
                  <span className="font-medium">{org}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Path Navigation Tabs */}
        <section id="path-tabs" className="py-8 bg-white border-b border-[#E6E6E0] sticky top-0 z-40 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-hide">
              {pathSeriesData.map((path) => (
                <button
                  key={path.id}
                  onClick={() => setSelectedPath(path.id)}
                  className={`flex-shrink-0 px-5 py-3 rounded-xl font-medium transition-all ${
                    selectedPath === path.id
                      ? "bg-[#F97316] text-white shadow-lg shadow-[#F97316]/30"
                      : "bg-[#F5F1D6] text-[#082038] hover:bg-[#F97316]/10"
                  }`}
                >
                  <span className="mr-2">{path.icon}</span>
                  {isEn ? path.title.split(":")[0] : path.titleFr.split(":")[0]}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Selected Path Detail */}
        <section className="py-12 lg:py-16 bg-[#FDF8F3]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPath.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {/* Path Header */}
                <div className="grid lg:grid-cols-3 gap-8 mb-12">
                  <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center gap-3">
                      <span className="text-5xl">{currentPath.icon}</span>
                      <div>
                        <Badge className={`bg-gradient-to-r ${currentPath.color} text-white text-sm px-3 py-1`}>
                          {currentPath.level}
                        </Badge>
                        {currentPath.sleBadge && (
                          <Badge className="ml-2 bg-[#082038] text-white text-sm px-3 py-1">
                            SLE {currentPath.sleBadge}
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <h2 className="text-3xl md:text-4xl font-bold text-[#082038]">
                      {isEn ? currentPath.title : currentPath.titleFr}
                    </h2>
                    
                    <p className="text-lg text-[#4A5B66] leading-relaxed">
                      {isEn ? currentPath.description : currentPath.descriptionFr}
                    </p>

                    <div className="flex flex-wrap gap-6">
                      <div className="flex items-center gap-2 text-[#4A5B66]">
                        <Clock className="h-5 w-5 text-[#F97316]" />
                        <span className="font-medium">{currentPath.duration}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[#4A5B66]">
                        <BookOpen className="h-5 w-5 text-[#F97316]" />
                        <span className="font-medium">{currentPath.modules} {isEn ? "Modules" : "Modules"}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[#4A5B66]">
                        <FileText className="h-5 w-5 text-[#F97316]" />
                        <span className="font-medium">{currentPath.lessons} {isEn ? "Lessons" : "Leçons"}</span>
                      </div>
                    </div>

                    <div className={`p-5 rounded-xl ${currentPath.bgColor} ${currentPath.borderColor} border-2`}>
                      <div className="flex items-center gap-2 mb-2">
                        <Target className="h-5 w-5 text-[#F97316]" />
                        <span className="font-semibold text-[#082038]">
                          {isEn ? "Target Audience" : "Public Cible"}
                        </span>
                      </div>
                      <p className="text-[#4A5B66]">
                        {isEn ? currentPath.target : currentPath.targetFr}
                      </p>
                    </div>
                  </div>

                  {/* Pricing Card - Premium Design */}
                  <div className="lg:col-span-1">
                    <Card className="sticky top-32 border-2 border-[#F97316]/30 shadow-2xl overflow-hidden">
                      <CardHeader className={`bg-gradient-to-r ${currentPath.color} text-white py-6`}>
                        <CardTitle className="text-center text-xl">
                          {isEn ? "Enroll Now" : "Inscrivez-vous"}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-6 space-y-6">
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-3">
                            <span className="text-5xl font-bold text-[#082038]">
                              ${currentPath.price}
                            </span>
                            <span className="text-xl text-[#4A5B66] line-through">
                              ${currentPath.originalPrice}
                            </span>
                          </div>
                          <Badge className="mt-3 bg-green-100 text-green-700 px-3 py-1">
                            {Math.round((1 - currentPath.price / currentPath.originalPrice) * 100)}% OFF
                          </Badge>
                        </div>

                        <ul className="space-y-3">
                          {[
                            { icon: CheckCircle, text: isEn ? "Lifetime access" : "Accès à vie" },
                            { icon: Award, text: isEn ? "Certificate of completion" : "Certificat de réussite" },
                            { icon: FileText, text: isEn ? "Downloadable resources" : "Ressources téléchargeables" },
                            { icon: Target, text: isEn ? "Practice quizzes" : "Quiz de pratique" },
                            { icon: Users, text: isEn ? "Community access" : "Accès à la communauté" },
                          ].map((item, i) => (
                            <li key={i} className="flex items-center gap-3 text-sm text-[#4A5B66]">
                              <item.icon className="h-5 w-5 text-green-500 flex-shrink-0" />
                              {item.text}
                            </li>
                          ))}
                        </ul>

                        <Button 
                          className="w-full bg-[#F97316] hover:bg-[#EA580C] text-white py-6 text-lg shadow-lg shadow-[#F97316]/30"
                          onClick={() => handlePurchase(currentPath.slug)}
                          disabled={isPurchasing}
                        >
                          {isPurchasing ? (
                            <>{isEn ? "Redirecting..." : "Redirection..."}</>
                          ) : (
                            <>
                              {isEn ? "Get Started" : "Commencer"}
                              <ArrowRight className="ml-2 h-5 w-5" />
                            </>
                          )}
                        </Button>

                        <div className="flex items-center justify-center gap-2 text-xs text-[#4A5B66]">
                          <Shield className="h-4 w-4" />
                          {isEn 
                            ? "30-day money-back guarantee" 
                            : "Garantie de remboursement de 30 jours"}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* Modules List */}
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-[#082038] mb-6">
                    {isEn ? "Course Curriculum" : "Programme du Cours"}
                  </h3>
                  
                  {currentPath.modules_detail.map((module, index) => (
                    <Card 
                      key={index}
                      className={`border-2 ${currentPath.borderColor} overflow-hidden hover:shadow-lg transition-shadow`}
                    >
                      <button
                        onClick={() => toggleModule(`module-${index}`)}
                        className="w-full p-5 flex items-center justify-between hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${currentPath.color} flex items-center justify-center text-white font-bold text-lg shadow-md`}>
                            {index + 1}
                          </div>
                          <div className="text-left">
                            <h4 className="font-semibold text-[#082038] text-lg">
                              {module.title}
                            </h4>
                            <div className="flex items-center gap-3 text-sm text-[#4A5B66]">
                              <span>{module.lessons} {isEn ? "lessons" : "leçons"}</span>
                              <span>•</span>
                              <span>{module.duration}</span>
                              {module.isPreview && (
                                <>
                                  <span>•</span>
                                  <Badge variant="outline" className="text-xs border-[#F97316] text-[#F97316]">
                                    <Play className="h-3 w-3 mr-1" />
                                    {isEn ? "Preview" : "Aperçu"}
                                  </Badge>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        {expandedModules.includes(`module-${index}`) ? (
                          <ChevronDown className="h-6 w-6 text-[#4A5B66]" />
                        ) : (
                          <ChevronRight className="h-6 w-6 text-[#4A5B66]" />
                        )}
                      </button>
                      
                      <AnimatePresence>
                        {expandedModules.includes(`module-${index}`) && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="border-t border-gray-100"
                          >
                            <div className="p-5 bg-gray-50 space-y-2">
                              {[1, 2, 3, 4].map((lessonNum) => (
                                <div 
                                  key={lessonNum}
                                  className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm"
                                >
                                  <div className="flex items-center gap-3">
                                    {module.isPreview ? (
                                      <Play className="h-5 w-5 text-[#F97316]" />
                                    ) : (
                                      <Lock className="h-5 w-5 text-gray-400" />
                                    )}
                                    <span className="text-[#082038]">
                                      {isEn ? "Lesson" : "Leçon"} {index + 1}.{lessonNum}
                                    </span>
                                  </div>
                                  <span className="text-sm text-[#4A5B66]">20 min</span>
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </Card>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-16 lg:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-12">
              <Badge className="bg-[#F97316]/10 text-[#F97316] border-[#F97316]/20 mb-4">
                {isEn ? "Success Stories" : "Histoires de Réussite"}
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-[#082038] mb-4">
                {isEn ? "What Our Students Say" : "Ce Que Disent Nos Étudiants"}
              </h2>
              <p className="text-lg text-[#4A5B66] max-w-2xl mx-auto">
                {isEn 
                  ? "Join thousands of federal public servants who have achieved their bilingual goals."
                  : "Rejoignez des milliers de fonctionnaires fédéraux qui ont atteint leurs objectifs bilingues."
                }
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  <Card className="h-full border-2 border-transparent hover:border-[#F97316]/20 transition-all duration-300 hover:shadow-xl">
                    <CardContent className="p-6">
                      <div className="flex gap-1 mb-4">
                        {[...Array(testimonial.rating)].map((_, j) => (
                          <Star key={j} className="h-5 w-5 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <Quote className="h-8 w-8 text-[#F97316]/20 mb-4" />
                      <p className="text-[#4A5B66] mb-6 italic leading-relaxed">
                        "{isEn ? testimonial.quote : testimonial.quoteFr}"
                      </p>
                      <div className="border-t pt-4">
                        <p className="font-semibold text-[#082038]">{testimonial.name}</p>
                        <p className="text-sm text-[#4A5B66]">{testimonial.role}</p>
                        <p className="text-sm text-[#F97316]">{testimonial.org}</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-20 bg-gradient-to-br from-[#082038] via-[#0F3D3E] to-[#082038] relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
            <div className="absolute top-10 left-10 w-64 h-64 bg-[#F97316]/20 rounded-full blur-[80px]" />
            <div className="absolute bottom-10 right-10 w-80 h-80 bg-teal-500/10 rounded-full blur-[100px]" />
          </div>

          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <Badge className="bg-white/10 backdrop-blur-md text-white border-white/20 mb-6">
                <BadgeCheck className="h-4 w-4 mr-2" />
                {isEn ? "Start Today" : "Commencez Aujourd'hui"}
              </Badge>
              
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                {isEn ? "Ready to Start Your Journey?" : "Prêt à Commencer Votre Parcours?"}
              </h2>
              
              <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
                {isEn 
                  ? "Join thousands of federal public servants who have achieved their bilingual goals with Path Series™."
                  : "Rejoignez des milliers de fonctionnaires fédéraux qui ont atteint leurs objectifs bilingues avec Path Series™."
                }
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <Link href="/courses">
                  <Button size="lg" className="bg-[#F97316] hover:bg-[#EA580C] text-white px-8 py-6 text-lg shadow-lg shadow-[#F97316]/30">
                    {isEn ? "Browse All Courses" : "Parcourir Tous les Cours"}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/coaches">
                  <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 px-8 py-6 text-lg">
                    {isEn ? "Find a Coach" : "Trouver un Coach"}
                  </Button>
                </Link>
              </div>

              <div className="flex flex-wrap justify-center gap-6 text-white/60 text-sm">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  {isEn ? "30-day money-back guarantee" : "Garantie 30 jours"}
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  {isEn ? "Lifetime access" : "Accès à vie"}
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  {isEn ? "Expert support" : "Support expert"}
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <EcosystemFooter lang={isEn ? 'en' : 'fr'} theme="solid" activeBrand="rusingacademy" />
    </div>
  );
}
