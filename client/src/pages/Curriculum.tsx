import Footer from "@/components/Footer";
import { Breadcrumb } from "@/components/Breadcrumb";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
  TrendingUp,
  ExternalLink,
} from "lucide-react";
import { Link } from "wouter";

interface Course {
  id: string;
  level: string;
  title: string;
  titleFr: string;
  subtitle: string;
  subtitleFr: string;
  description: string;
  descriptionFr: string;
  target: string;
  targetFr: string;
  duration: string;
  modules: number;
  lessons: number;
  image: string;
  color: string;
  bgColor: string;
  borderColor: string;
  sleBadge?: string;
  link: string;
}

const courses: Course[] = [
  {
    id: "path-1",
    level: "A1",
    title: "Foundations",
    titleFr: "Fondations",
    subtitle: "First Professional Steps",
    subtitleFr: "Premiers Pas Professionnels",
    description: "Build foundational workplace French from scratch. Learn essential greetings, introductions, and basic professional communication.",
    descriptionFr: "Construisez les bases du français professionnel. Apprenez les salutations essentielles, les présentations et la communication professionnelle de base.",
    target: "Complete beginners starting their bilingual journey",
    targetFr: "Débutants complets commençant leur parcours bilingue",
    duration: "8-12 weeks",
    modules: 4,
    lessons: 16,
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663049070748/gvnmYNphKZgt9jM9K8Vi9K/curriculum/path_a1_foundations.jpg",
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
    link: "https://www.rusingacademy.com/product-library-rusingacademy",
  },
  {
    id: "path-2",
    level: "A2",
    title: "Everyday Communication",
    titleFr: "Communication Quotidienne",
    subtitle: "Daily Workplace Interactions",
    subtitleFr: "Interactions Quotidiennes au Travail",
    description: "Expand your vocabulary and handle everyday workplace situations. Master emails, phone calls, and simple meetings.",
    descriptionFr: "Élargissez votre vocabulaire et gérez les situations quotidiennes au travail. Maîtrisez les courriels, les appels téléphoniques et les réunions simples.",
    target: "Learners with basic knowledge seeking practical skills",
    targetFr: "Apprenants avec des connaissances de base cherchant des compétences pratiques",
    duration: "10-14 weeks",
    modules: 4,
    lessons: 16,
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663049070748/gvnmYNphKZgt9jM9K8Vi9K/curriculum/path_a2_everyday.jpg",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    link: "https://www.rusingacademy.com/product-library-rusingacademy",
  },
  {
    id: "path-3",
    level: "B1",
    title: "Operational Proficiency",
    titleFr: "Compétence Opérationnelle",
    subtitle: "Professional Discussions & Reports",
    subtitleFr: "Discussions Professionnelles et Rapports",
    description: "Achieve BBB level proficiency. Participate confidently in meetings, write professional reports, and handle complex workplace scenarios.",
    descriptionFr: "Atteignez le niveau BBB. Participez avec confiance aux réunions, rédigez des rapports professionnels et gérez des scénarios complexes.",
    target: "Intermediate learners aiming for BBB certification",
    targetFr: "Apprenants intermédiaires visant la certification BBB",
    duration: "12-16 weeks",
    modules: 4,
    lessons: 16,
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663049070748/gvnmYNphKZgt9jM9K8Vi9K/curriculum/path_b1_operational.jpg",
    color: "text-amber-600",
    bgColor: "bg-amber-50",
    borderColor: "border-[#FFE4D6]",
    sleBadge: "BBB",
    link: "https://www.rusingacademy.com/product-library-rusingacademy",
  },
  {
    id: "path-4",
    level: "B2",
    title: "Strategic Communication",
    titleFr: "Communication Stratégique",
    subtitle: "Presentations & Nuanced Expression",
    subtitleFr: "Présentations et Expression Nuancée",
    description: "Reach CBC level for bilingual positions. Master presentations, negotiations, and nuanced professional communication.",
    descriptionFr: "Atteignez le niveau CBC pour les postes bilingues. Maîtrisez les présentations, les négociations et la communication professionnelle nuancée.",
    target: "Upper intermediate learners targeting CBC positions",
    targetFr: "Apprenants de niveau intermédiaire supérieur visant les postes CBC",
    duration: "14-18 weeks",
    modules: 4,
    lessons: 16,
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663049070748/gvnmYNphKZgt9jM9K8Vi9K/curriculum/path_b2_strategic.jpg",
    color: "text-[#0F3D3E]",
    bgColor: "bg-[#E7F2F2]",
    borderColor: "border-[#0F3D3E]",
    sleBadge: "CBC",
    link: "https://www.rusingacademy.com/product-library-rusingacademy",
  },
  {
    id: "path-5",
    level: "C1",
    title: "Executive Mastery",
    titleFr: "Maîtrise Exécutive",
    subtitle: "Leadership & Policy Communication",
    subtitleFr: "Leadership et Communication Politique",
    description: "Achieve CCC level for executive roles. Lead strategic discussions, deliver policy briefings, and communicate with executive presence.",
    descriptionFr: "Atteignez le niveau CCC pour les rôles exécutifs. Dirigez des discussions stratégiques, présentez des notes d'information et communiquez avec une présence exécutive.",
    target: "Advanced learners pursuing executive positions",
    targetFr: "Apprenants avancés poursuivant des postes de direction",
    duration: "16-20 weeks",
    modules: 4,
    lessons: 16,
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663049070748/gvnmYNphKZgt9jM9K8Vi9K/curriculum/path_c1_mastery.jpg",
    color: "text-[#C65A1E]",
    bgColor: "bg-[#FFF1E8]",
    borderColor: "border-[#C65A1E]",
    sleBadge: "CCC",
    link: "https://www.rusingacademy.com/product-library-rusingacademy",
  },
  {
    id: "path-6",
    level: "C1+",
    title: "Exam Accelerator",
    titleFr: "Accélérateur d'Examen",
    subtitle: "Intensive SLE Preparation",
    subtitleFr: "Préparation Intensive à l'ELS",
    description: "Intensive exam preparation for any SLE level. Practice with real exam simulations, master test strategies, and build confidence.",
    descriptionFr: "Préparation intensive aux examens pour tout niveau ELS. Pratiquez avec des simulations d'examen réelles, maîtrisez les stratégies de test et développez votre confiance.",
    target: "Anyone preparing for upcoming SLE exams",
    targetFr: "Toute personne se préparant aux examens ELS à venir",
    duration: "4-8 weeks",
    modules: 4,
    lessons: 16,
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663049070748/gvnmYNphKZgt9jM9K8Vi9K/curriculum/path_exam_accelerator.jpg",
    color: "text-teal-600",
    bgColor: "bg-teal-50",
    borderColor: "border-teal-200",
    sleBadge: "BBB/CBC/CCC",
    link: "https://www.rusingacademy.com/product-library-rusingacademy",
  },
];

export default function Curriculum() {
  const { language } = useLanguage();
  const isEn = language === "en";

  return (
    <div className="min-h-screen flex flex-col bg-background">
      

      <main id="main-content" className="flex-1">
        <Breadcrumb 
          items={[
            { label: "Discover Our Courses", labelFr: "Découvrez nos cours" }
          ]} 
        />

        {/* Hero Section */}
        <section className="relative overflow-hidden py-16 lg:py-24 mesh-gradient">
          <div className="absolute top-20 left-10 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl" aria-hidden="true" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#C65A1E]/10 rounded-full blur-3xl" aria-hidden="true" />
          
          <div className="container relative z-10">
            <div className="max-w-4xl mx-auto text-center space-y-6">
              <Badge variant="outline" className="glass-badge px-4 py-1.5 text-sm font-medium">
                <Sparkles className="h-4 w-4 mr-2" />
                {isEn ? "GC Bilingual Mastery Series™" : "Série Maîtrise Bilingue GC™"}
              </Badge>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                {isEn ? "Find Our Curriculum" : "Découvrez Notre Curriculum"}
              </h1>
              
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                {isEn 
                  ? "Six structured learning paths designed exclusively for Canadian Federal Public Servants. Progress from A1 to C1+ with purpose and precision."
                  : "Six parcours d'apprentissage structurés conçus exclusivement pour les fonctionnaires fédéraux canadiens. Progressez de A1 à C1+ avec précision et détermination."
                }
              </p>

              <div className="flex flex-wrap justify-center gap-4 pt-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle className="h-5 w-5 text-teal-500" />
                  {isEn ? "BBB, CBC, CCC Aligned" : "Aligné BBB, CBC, CCC"}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle className="h-5 w-5 text-teal-500" />
                  {isEn ? "Self-Paced Learning" : "Apprentissage à Votre Rythme"}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle className="h-5 w-5 text-teal-500" />
                  {isEn ? "GC Workplace Context" : "Contexte de Travail GC"}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Courses Grid */}
        <section className="py-16 lg:py-24">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">
                {isEn ? "Choose Your Learning Path" : "Choisissez Votre Parcours"}
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                {isEn 
                  ? "Each path is designed to take you from your current level to your target SLE certification with structured modules and practical exercises."
                  : "Chaque parcours est conçu pour vous amener de votre niveau actuel à votre certification ELS cible avec des modules structurés et des exercices pratiques."
                }
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <Card 
                  key={course.id} 
                  className={`group overflow-hidden border-2 ${course.borderColor} hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}
                >
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={course.image} 
                      alt={isEn ? course.title : course.titleFr}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute top-4 left-4 flex gap-2">
                      <Badge className={`${course.bgColor} ${course.color} border-0 font-bold`}>
                        {course.level}
                      </Badge>
                      {course.sleBadge && (
                        <Badge variant="secondary" className="bg-white/90 text-gray-800 font-semibold">
                          → {course.sleBadge}
                        </Badge>
                      )}
                    </div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-xl font-bold text-white">
                        {isEn ? course.title : course.titleFr}
                      </h3>
                      <p className="text-white/80 text-sm">
                        {isEn ? course.subtitle : course.subtitleFr}
                      </p>
                    </div>
                  </div>
                  
                  <CardContent className="p-5 space-y-4">
                    <p className="text-muted-foreground text-sm line-clamp-3">
                      {isEn ? course.description : course.descriptionFr}
                    </p>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {course.duration}
                      </div>
                      <div className="flex items-center gap-1">
                        <BookOpen className="h-4 w-4" />
                        {course.modules} {isEn ? "modules" : "modules"}
                      </div>
                      <div className="flex items-center gap-1">
                        <GraduationCap className="h-4 w-4" />
                        {course.lessons} {isEn ? "lessons" : "leçons"}
                      </div>
                    </div>

                    <div className={`p-3 rounded-lg ${course.bgColor}`}>
                      <p className="text-xs font-medium text-muted-foreground mb-1">
                        {isEn ? "Ideal for:" : "Idéal pour:"}
                      </p>
                      <p className={`text-sm font-medium ${course.color}`}>
                        {isEn ? course.target : course.targetFr}
                      </p>
                    </div>

                    <a 
                      href={course.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <Button className="w-full group/btn" variant="outline">
                        {isEn ? "View Course Details" : "Voir les Détails du Cours"}
                        <ExternalLink className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </a>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Why RusingAcademy Section */}
        <section className="py-16 lg:py-24 bg-muted/30">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">
                  {isEn ? "Why Choose RusingAcademy Curriculum?" : "Pourquoi Choisir le Curriculum RusingAcademy?"}
                </h2>
                <p className="text-muted-foreground">
                  {isEn 
                    ? "Built by experts who understand the unique challenges of federal language requirements."
                    : "Conçu par des experts qui comprennent les défis uniques des exigences linguistiques fédérales."
                  }
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {[
                  {
                    icon: Target,
                    title: isEn ? "GC-Aligned Content" : "Contenu Aligné GC",
                    description: isEn 
                      ? "Every lesson is designed around real Government of Canada workplace scenarios and evaluation criteria."
                      : "Chaque leçon est conçue autour de scénarios réels du lieu de travail du gouvernement du Canada."
                  },
                  {
                    icon: TrendingUp,
                    title: isEn ? "Structured Progression" : "Progression Structurée",
                    description: isEn 
                      ? "Clear milestones and assessments ensure you're always moving toward your target SLE level."
                      : "Des jalons clairs et des évaluations garantissent que vous progressez toujours vers votre niveau ELS cible."
                  },
                  {
                    icon: Users,
                    title: isEn ? "Expert-Designed" : "Conçu par des Experts",
                    description: isEn 
                      ? "Created by Steven Barholere with 15+ years of experience helping public servants succeed."
                      : "Créé par Steven Barholere avec plus de 15 ans d'expérience à aider les fonctionnaires à réussir."
                  },
                  {
                    icon: Award,
                    title: isEn ? "Proven Results" : "Résultats Prouvés",
                    description: isEn 
                      ? "95% success rate with hundreds of public servants achieving their BBB, CBC, and CCC goals."
                      : "Taux de réussite de 95% avec des centaines de fonctionnaires atteignant leurs objectifs BBB, CBC et CCC."
                  },
                ].map((feature, index) => (
                  <Card key={index} className="p-6">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 rounded-lg bg-teal-100 flex items-center justify-center">
                          <feature.icon className="h-6 w-6 text-teal-600" />
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2">{feature.title}</h3>
                        <p className="text-sm text-muted-foreground">{feature.description}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 lg:py-24">
          <div className="container">
            <Card className="max-w-4xl mx-auto overflow-hidden">
              <div className="grid md:grid-cols-2">
                <div className="p-8 lg:p-12 flex flex-col justify-center">
                  <h2 className="text-2xl lg:text-3xl font-bold mb-4">
                    {isEn ? "Ready to Start Your Journey?" : "Prêt à Commencer Votre Parcours?"}
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    {isEn 
                      ? "Combine structured self-paced learning with personalized coaching for the fastest path to SLE success."
                      : "Combinez l'apprentissage autonome structuré avec un coaching personnalisé pour le chemin le plus rapide vers le succès ELS."
                    }
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <a 
                      href="https://www.rusingacademy.com/product-library-rusingacademy"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button size="lg" className="w-full sm:w-auto">
                        {isEn ? "Explore All Courses" : "Explorer Tous les Cours"}
                        <ExternalLink className="ml-2 h-4 w-4" />
                      </Button>
                    </a>
                    <Link href="/coaches">
                      <Button size="lg" variant="outline" className="w-full sm:w-auto">
                        {isEn ? "Find a Coach" : "Trouver un Coach"}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
                <div className="relative h-64 md:h-auto bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center">
                  <div className="text-center text-white p-8">
                    <div className="text-5xl font-bold mb-2">95%</div>
                    <div className="text-lg opacity-90">
                      {isEn ? "Success Rate" : "Taux de Réussite"}
                    </div>
                    <div className="mt-4 flex justify-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <div className="text-sm opacity-75 mt-1">345+ {isEn ? "reviews" : "avis"}</div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
