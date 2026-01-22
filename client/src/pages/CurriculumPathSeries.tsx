import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Download,
  ChevronDown,
  ChevronRight,
  Lock,
} from "lucide-react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import EcosystemHeaderGold from "@/components/EcosystemHeaderGold";
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
      <EcosystemHeaderGold 
        activeBrand="rusingacademy"
        showSubHeader={true}
      />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-16 lg:py-20 bg-gradient-to-br from-[#F97316]/10 via-[#FDF8F3] to-[#F97316]/5">
          <div className="absolute top-20 left-10 w-72 h-72 bg-[#F97316]/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#F97316]/5 rounded-full blur-3xl" />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
            <div className="max-w-4xl mx-auto text-center space-y-6">
              <Badge className="bg-[#F97316]/10 text-[#F97316] border-[#F97316]/20 px-4 py-1.5 text-sm font-medium">
                <Sparkles className="h-4 w-4 mr-2" />
                {isEn ? "Path Series™ Curriculum" : "Curriculum Path Series™"}
              </Badge>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-[#082038]">
                {isEn ? "Your Roadmap to" : "Votre Feuille de Route vers"}
                <span className="block text-[#F97316]">
                  {isEn ? "Bilingual Excellence" : "l'Excellence Bilingue"}
                </span>
              </h1>
              
              <p className="text-xl text-[#4A5B66] max-w-2xl mx-auto">
                {isEn 
                  ? "Six structured paths from Level A to CCC. Each path is designed for federal public servants with clear objectives and measurable outcomes."
                  : "Six parcours structurés du niveau A au CCC. Chaque parcours est conçu pour les fonctionnaires fédéraux avec des objectifs clairs et des résultats mesurables."
                }
              </p>

              <div className="flex flex-wrap justify-center gap-6 pt-4">
                <div className="flex items-center gap-2 text-sm text-[#4A5B66]">
                  <CheckCircle className="h-5 w-5 text-[#F97316]" />
                  {isEn ? "216 Total Lessons" : "216 Leçons au Total"}
                </div>
                <div className="flex items-center gap-2 text-sm text-[#4A5B66]">
                  <CheckCircle className="h-5 w-5 text-[#F97316]" />
                  {isEn ? "54 Modules" : "54 Modules"}
                </div>
                <div className="flex items-center gap-2 text-sm text-[#4A5B66]">
                  <CheckCircle className="h-5 w-5 text-[#F97316]" />
                  {isEn ? "72+ Hours of Content" : "72+ Heures de Contenu"}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Path Navigation Tabs */}
        <section className="py-8 bg-white border-b border-[#E6E6E0] sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-hide">
              {pathSeriesData.map((path) => (
                <button
                  key={path.id}
                  onClick={() => setSelectedPath(path.id)}
                  className={`flex-shrink-0 px-4 py-3 rounded-xl font-medium transition-all ${
                    selectedPath === path.id
                      ? "bg-[#F97316] text-white shadow-lg"
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
        <section className="py-12 lg:py-16">
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
                      <span className="text-4xl">{currentPath.icon}</span>
                      <div>
                        <Badge className={`bg-gradient-to-r ${currentPath.color} text-white`}>
                          {currentPath.level}
                        </Badge>
                        {currentPath.sleBadge && (
                          <Badge className="ml-2 bg-[#082038] text-white">
                            SLE {currentPath.sleBadge}
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <h2 className="text-3xl md:text-4xl font-bold text-[#082038]">
                      {isEn ? currentPath.title : currentPath.titleFr}
                    </h2>
                    
                    <p className="text-lg text-[#4A5B66]">
                      {isEn ? currentPath.description : currentPath.descriptionFr}
                    </p>

                    <div className="flex flex-wrap gap-4">
                      <div className="flex items-center gap-2 text-[#4A5B66]">
                        <Clock className="h-5 w-5 text-[#F97316]" />
                        <span>{currentPath.duration}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[#4A5B66]">
                        <BookOpen className="h-5 w-5 text-[#F97316]" />
                        <span>{currentPath.modules} {isEn ? "Modules" : "Modules"}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[#4A5B66]">
                        <FileText className="h-5 w-5 text-[#F97316]" />
                        <span>{currentPath.lessons} {isEn ? "Lessons" : "Leçons"}</span>
                      </div>
                    </div>

                    <div className={`p-4 rounded-xl ${currentPath.bgColor} ${currentPath.borderColor} border`}>
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

                  {/* Pricing Card */}
                  <div className="lg:col-span-1">
                    <Card className="sticky top-32 border-2 border-[#F97316]/20 shadow-xl">
                      <CardHeader className={`bg-gradient-to-r ${currentPath.color} text-white rounded-t-lg`}>
                        <CardTitle className="text-center">
                          {isEn ? "Enroll Now" : "Inscrivez-vous"}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-6 space-y-6">
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-2">
                            <span className="text-4xl font-bold text-[#082038]">
                              ${currentPath.price}
                            </span>
                            <span className="text-lg text-[#4A5B66] line-through">
                              ${currentPath.originalPrice}
                            </span>
                          </div>
                          <Badge className="mt-2 bg-green-100 text-green-700">
                            {Math.round((1 - currentPath.price / currentPath.originalPrice) * 100)}% OFF
                          </Badge>
                        </div>

                        <ul className="space-y-3">
                          <li className="flex items-center gap-2 text-sm text-[#4A5B66]">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            {isEn ? "Lifetime access" : "Accès à vie"}
                          </li>
                          <li className="flex items-center gap-2 text-sm text-[#4A5B66]">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            {isEn ? "Certificate of completion" : "Certificat de réussite"}
                          </li>
                          <li className="flex items-center gap-2 text-sm text-[#4A5B66]">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            {isEn ? "Downloadable resources" : "Ressources téléchargeables"}
                          </li>
                          <li className="flex items-center gap-2 text-sm text-[#4A5B66]">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            {isEn ? "Practice quizzes" : "Quiz de pratique"}
                          </li>
                        </ul>

                        <Button 
                          className="w-full bg-[#F97316] hover:bg-[#EA580C] text-white"
                          onClick={() => handlePurchase(currentPath.slug)}
                          disabled={isPurchasing}
                        >
                          {isPurchasing ? (
                            <>{isEn ? "Redirecting..." : "Redirection..."}</>
                          ) : (
                            <>
                              {isEn ? "Get Started" : "Commencer"}
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </>
                          )}
                        </Button>

                        <p className="text-xs text-center text-[#4A5B66]">
                          {isEn 
                            ? "30-day money-back guarantee" 
                            : "Garantie de remboursement de 30 jours"}
                        </p>
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
                      className={`border ${currentPath.borderColor} overflow-hidden`}
                    >
                      <button
                        onClick={() => toggleModule(`module-${index}`)}
                        className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${currentPath.color} flex items-center justify-center text-white font-bold`}>
                            {index + 1}
                          </div>
                          <div className="text-left">
                            <h4 className="font-semibold text-[#082038]">
                              {module.title}
                            </h4>
                            <div className="flex items-center gap-3 text-sm text-[#4A5B66]">
                              <span>{module.lessons} {isEn ? "lessons" : "leçons"}</span>
                              <span>•</span>
                              <span>{module.duration}</span>
                              {module.isPreview && (
                                <>
                                  <span>•</span>
                                  <Badge variant="outline" className="text-xs">
                                    <Play className="h-3 w-3 mr-1" />
                                    {isEn ? "Preview" : "Aperçu"}
                                  </Badge>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        {expandedModules.includes(`module-${index}`) ? (
                          <ChevronDown className="h-5 w-5 text-[#4A5B66]" />
                        ) : (
                          <ChevronRight className="h-5 w-5 text-[#4A5B66]" />
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
                            <div className="p-4 bg-gray-50 space-y-2">
                              {[1, 2, 3, 4].map((lessonNum) => (
                                <div 
                                  key={lessonNum}
                                  className="flex items-center justify-between p-3 bg-white rounded-lg"
                                >
                                  <div className="flex items-center gap-3">
                                    {module.isPreview ? (
                                      <Play className="h-4 w-4 text-[#F97316]" />
                                    ) : (
                                      <Lock className="h-4 w-4 text-gray-400" />
                                    )}
                                    <span className="text-sm text-[#082038]">
                                      {isEn ? "Lesson" : "Leçon"} {index + 1}.{lessonNum}
                                    </span>
                                  </div>
                                  <span className="text-xs text-[#4A5B66]">20 min</span>
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

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-[#F97316] to-[#EA580C]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {isEn ? "Ready to Start Your Journey?" : "Prêt à Commencer Votre Parcours?"}
            </h2>
            <p className="text-xl opacity-90 mb-8">
              {isEn 
                ? "Join thousands of federal public servants who have achieved their bilingual goals with Path Series™."
                : "Rejoignez des milliers de fonctionnaires fédéraux qui ont atteint leurs objectifs bilingues avec Path Series™."
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/courses">
                <Button size="lg" className="bg-white text-[#F97316] hover:bg-gray-100">
                  {isEn ? "Browse All Courses" : "Parcourir Tous les Cours"}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/coaches">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  {isEn ? "Find a Coach" : "Trouver un Coach"}
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <EcosystemFooter lang={isEn ? 'en' : 'fr'} theme="solid" activeBrand="rusingacademy" />
    </div>
  );
}
