import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  BookOpen,
  Clock,
  Users,
  Star,
  Play,
  Award,
  CheckCircle2,
  Lock,
  FileText,
  Video,
  Headphones,
  Download,
  ChevronRight,
  Globe,
  Calendar,
  Loader2,
  ShoppingCart,
} from "lucide-react";
import { Link, useParams } from "wouter";
import { trpc } from "@/lib/trpc";
import { motion } from "framer-motion";

const contentTypeIcons: Record<string, React.ReactNode> = {
  video: <Video className="h-4 w-4" />,
  text: <FileText className="h-4 w-4" />,
  audio: <Headphones className="h-4 w-4" />,
  pdf: <FileText className="h-4 w-4" />,
  quiz: <CheckCircle2 className="h-4 w-4" />,
  download: <Download className="h-4 w-4" />,
};

export default function CourseDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { user, isAuthenticated } = useAuth();
  const { language } = useLanguage();
  const isEn = language === "en";
  
  const [activeTab, setActiveTab] = useState("curriculum");

  // Placeholder course data (will be replaced by API)
  const course = {
    id: 1,
    title: isEn ? "SLE Oral C Mastery" : "Maîtrise de l'oral C ELS",
    slug: "sle-oral-c-mastery",
    description: isEn 
      ? `This comprehensive course is designed specifically for Canadian public servants preparing for the SLE Oral C exam. 

Our proven methodology has helped hundreds of federal employees achieve their language goals and advance their careers.

**What you'll learn:**
- Master the key competencies tested in the Oral C exam
- Develop confidence in spontaneous French conversation
- Learn strategies for handling complex workplace scenarios
- Practice with realistic exam simulations
- Overcome language anxiety with proven techniques

**Course Features:**
- 8 comprehensive modules with 42 video lessons
- Interactive quizzes after each module
- Downloadable practice materials and cheat sheets
- Certificate of completion for your HR file
- Lifetime access to all course materials`
      : `Ce cours complet est conçu spécifiquement pour les fonctionnaires canadiens qui se préparent à l'examen oral C ELS.

Notre méthodologie éprouvée a aidé des centaines d'employés fédéraux à atteindre leurs objectifs linguistiques et à faire progresser leur carrière.

**Ce que vous apprendrez:**
- Maîtriser les compétences clés testées à l'examen Oral C
- Développer la confiance dans la conversation spontanée en français
- Apprendre des stratégies pour gérer des scénarios de travail complexes
- Pratiquer avec des simulations d'examen réalistes
- Surmonter l'anxiété linguistique avec des techniques éprouvées

**Caractéristiques du cours:**
- 8 modules complets avec 42 leçons vidéo
- Quiz interactifs après chaque module
- Matériel de pratique téléchargeable et aide-mémoire
- Certificat de réussite pour votre dossier RH
- Accès à vie à tout le matériel de cours`,
    thumbnailUrl: "/images/courses/oral-c-course.jpg",
    previewVideoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    category: "sle_oral",
    level: "advanced",
    targetLanguage: "french",
    price: 29700,
    originalPrice: 39700,
    totalModules: 8,
    totalLessons: 42,
    totalDurationMinutes: 480,
    totalEnrollments: 234,
    averageRating: "4.9",
    totalReviews: 89,
    instructorName: "Prof. Steven Barholere",
    instructorBio: isEn 
      ? "Founder of RusingAcademy with 15+ years of experience helping federal employees achieve their SLE goals."
      : "Fondateur de RusingAcademy avec plus de 15 ans d'expérience à aider les employés fédéraux à atteindre leurs objectifs ELS.",
    instructorAvatar: "/coaches/steven-profile.jpg",
    hasCertificate: true,
    hasQuizzes: true,
    hasDownloads: true,
    modules: [
      {
        id: 1,
        title: isEn ? "Introduction & Assessment" : "Introduction et évaluation",
        description: isEn ? "Get started with a baseline assessment" : "Commencez avec une évaluation de base",
        lessons: [
          { id: 1, title: isEn ? "Welcome to the Course" : "Bienvenue au cours", type: "video", duration: 5, isPreview: true },
          { id: 2, title: isEn ? "Self-Assessment Quiz" : "Quiz d'auto-évaluation", type: "quiz", duration: 15, isPreview: false },
          { id: 3, title: isEn ? "Understanding the Oral C Exam" : "Comprendre l'examen Oral C", type: "video", duration: 12, isPreview: true },
        ],
      },
      {
        id: 2,
        title: isEn ? "Core Competencies" : "Compétences de base",
        description: isEn ? "Master the fundamental skills" : "Maîtrisez les compétences fondamentales",
        lessons: [
          { id: 4, title: isEn ? "Spontaneous Expression" : "Expression spontanée", type: "video", duration: 18, isPreview: false },
          { id: 5, title: isEn ? "Complex Ideas & Nuance" : "Idées complexes et nuances", type: "video", duration: 22, isPreview: false },
          { id: 6, title: isEn ? "Practice Exercises" : "Exercices pratiques", type: "download", duration: 30, isPreview: false },
          { id: 7, title: isEn ? "Module Quiz" : "Quiz du module", type: "quiz", duration: 10, isPreview: false },
        ],
      },
      {
        id: 3,
        title: isEn ? "Workplace Scenarios" : "Scénarios de travail",
        description: isEn ? "Practice real workplace situations" : "Pratiquez des situations de travail réelles",
        lessons: [
          { id: 8, title: isEn ? "Meeting Participation" : "Participation aux réunions", type: "video", duration: 20, isPreview: false },
          { id: 9, title: isEn ? "Presenting Ideas" : "Présenter des idées", type: "video", duration: 18, isPreview: false },
          { id: 10, title: isEn ? "Handling Disagreements" : "Gérer les désaccords", type: "video", duration: 15, isPreview: false },
        ],
      },
      {
        id: 4,
        title: isEn ? "Exam Strategies" : "Stratégies d'examen",
        description: isEn ? "Proven techniques for exam day" : "Techniques éprouvées pour le jour de l'examen",
        lessons: [
          { id: 11, title: isEn ? "Time Management" : "Gestion du temps", type: "video", duration: 12, isPreview: false },
          { id: 12, title: isEn ? "Handling Stress" : "Gérer le stress", type: "video", duration: 15, isPreview: false },
          { id: 13, title: isEn ? "Common Pitfalls" : "Pièges courants", type: "video", duration: 18, isPreview: false },
        ],
      },
    ],
    reviews: [
      {
        id: 1,
        userName: "Marie L.",
        rating: 5,
        comment: isEn 
          ? "This course was exactly what I needed. I passed my Oral C on the first try!"
          : "Ce cours était exactement ce dont j'avais besoin. J'ai réussi mon Oral C du premier coup!",
        date: "2025-12-15",
      },
      {
        id: 2,
        userName: "Jean-Pierre M.",
        rating: 5,
        comment: isEn 
          ? "Prof. Steven's teaching style is excellent. The practice scenarios were very realistic."
          : "Le style d'enseignement du Prof. Steven est excellent. Les scénarios de pratique étaient très réalistes.",
        date: "2025-11-28",
      },
    ],
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins} min`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}min`;
  };

  const formatPrice = (cents: number) => {
    return `$${(cents / 100).toFixed(0)}`;
  };

  const discountPercent = course.originalPrice 
    ? Math.round((1 - course.price / course.originalPrice) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-12 bg-gradient-to-br from-primary/10 via-background to-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Course Info */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="secondary">
                    {isEn ? "SLE Oral" : "ELS Oral"}
                  </Badge>
                  <Badge variant="outline">
                    {isEn ? "Advanced" : "Avancé"}
                  </Badge>
                  <Badge variant="outline">
                    <Globe className="h-3 w-3 mr-1" />
                    {isEn ? "French" : "Français"}
                  </Badge>
                </div>
                
                <h1 className="text-3xl md:text-4xl font-black mb-4">
                  {course.title}
                </h1>
                
                <p className="text-lg text-muted-foreground mb-6">
                  {course.description.split('\n')[0]}
                </p>
                
                {/* Stats */}
                <div className="flex flex-wrap gap-6 mb-6">
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{course.averageRating}</span>
                    <span className="text-muted-foreground">({course.totalReviews} {isEn ? "reviews" : "avis"})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-muted-foreground" />
                    <span>{course.totalEnrollments} {isEn ? "students" : "étudiants"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                    <span>{formatDuration(course.totalDurationMinutes)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-muted-foreground" />
                    <span>{course.totalLessons} {isEn ? "lessons" : "leçons"}</span>
                  </div>
                </div>
                
                {/* Instructor */}
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={course.instructorAvatar} />
                    <AvatarFallback>{course.instructorName[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{course.instructorName}</p>
                    <p className="text-sm text-muted-foreground">
                      {isEn ? "Course Instructor" : "Instructeur du cours"}
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
            
            {/* Purchase Card */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Card className="sticky top-24 overflow-hidden">
                  {/* Preview Video */}
                  <div className="relative aspect-video bg-muted">
                    {course.previewVideoUrl ? (
                      <iframe
                        src={course.previewVideoUrl}
                        className="w-full h-full"
                        allowFullScreen
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Button size="lg" className="gap-2">
                          <Play className="h-5 w-5" />
                          {isEn ? "Preview Course" : "Aperçu du cours"}
                        </Button>
                      </div>
                    )}
                  </div>
                  
                  <CardContent className="p-6">
                    {/* Price */}
                    <div className="flex items-baseline gap-3 mb-4">
                      <span className="text-3xl font-black text-primary">
                        {formatPrice(course.price)}
                      </span>
                      {course.originalPrice && course.originalPrice > course.price && (
                        <>
                          <span className="text-lg text-muted-foreground line-through">
                            {formatPrice(course.originalPrice)}
                          </span>
                          <Badge className="bg-red-500">{discountPercent}% OFF</Badge>
                        </>
                      )}
                    </div>
                    
                    {/* CTA Buttons */}
                    <div className="space-y-3 mb-6">
                      <Button className="w-full gap-2" size="lg">
                        <ShoppingCart className="h-5 w-5" />
                        {isEn ? "Enroll Now" : "S'inscrire maintenant"}
                      </Button>
                      <Button variant="outline" className="w-full" size="lg">
                        {isEn ? "Add to Wishlist" : "Ajouter aux favoris"}
                      </Button>
                    </div>
                    
                    {/* Features */}
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        <span>{isEn ? "Lifetime access" : "Accès à vie"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        <span>{course.totalModules} {isEn ? "modules" : "modules"}, {course.totalLessons} {isEn ? "lessons" : "leçons"}</span>
                      </div>
                      {course.hasCertificate && (
                        <div className="flex items-center gap-2">
                          <Award className="h-4 w-4 text-primary" />
                          <span>{isEn ? "Certificate of completion" : "Certificat de réussite"}</span>
                        </div>
                      )}
                      {course.hasQuizzes && (
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-primary" />
                          <span>{isEn ? "Interactive quizzes" : "Quiz interactifs"}</span>
                        </div>
                      )}
                      {course.hasDownloads && (
                        <div className="flex items-center gap-2">
                          <Download className="h-4 w-4 text-primary" />
                          <span>{isEn ? "Downloadable resources" : "Ressources téléchargeables"}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Course Content Tabs */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="lg:pr-[400px]">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-8">
                <TabsTrigger value="curriculum">
                  {isEn ? "Curriculum" : "Programme"}
                </TabsTrigger>
                <TabsTrigger value="description">
                  {isEn ? "Description" : "Description"}
                </TabsTrigger>
                <TabsTrigger value="instructor">
                  {isEn ? "Instructor" : "Instructeur"}
                </TabsTrigger>
                <TabsTrigger value="reviews">
                  {isEn ? "Reviews" : "Avis"} ({course.totalReviews})
                </TabsTrigger>
              </TabsList>
              
              {/* Curriculum Tab */}
              <TabsContent value="curriculum">
                <Card>
                  <CardHeader>
                    <CardTitle>{isEn ? "Course Curriculum" : "Programme du cours"}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {course.totalModules} {isEn ? "modules" : "modules"} • {course.totalLessons} {isEn ? "lessons" : "leçons"} • {formatDuration(course.totalDurationMinutes)}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="multiple" className="w-full">
                      {course.modules.map((module, index) => (
                        <AccordionItem key={module.id} value={`module-${module.id}`}>
                          <AccordionTrigger className="hover:no-underline">
                            <div className="flex items-center gap-4 text-left">
                              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold text-sm">
                                {index + 1}
                              </div>
                              <div>
                                <h4 className="font-semibold">{module.title}</h4>
                                <p className="text-sm text-muted-foreground">
                                  {module.lessons.length} {isEn ? "lessons" : "leçons"}
                                </p>
                              </div>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="space-y-2 pl-12">
                              {module.lessons.map((lesson) => (
                                <div
                                  key={lesson.id}
                                  className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
                                >
                                  <div className="flex items-center gap-3">
                                    {contentTypeIcons[lesson.type] || <FileText className="h-4 w-4" />}
                                    <span className={lesson.isPreview ? "text-primary" : ""}>
                                      {lesson.title}
                                    </span>
                                    {lesson.isPreview && (
                                      <Badge variant="secondary" className="text-xs">
                                        {isEn ? "Preview" : "Aperçu"}
                                      </Badge>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-3">
                                    <span className="text-sm text-muted-foreground">
                                      {lesson.duration} min
                                    </span>
                                    {!lesson.isPreview && (
                                      <Lock className="h-4 w-4 text-muted-foreground" />
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Description Tab */}
              <TabsContent value="description">
                <Card>
                  <CardContent className="p-6 prose prose-sm dark:prose-invert max-w-none">
                    <div className="whitespace-pre-line">
                      {course.description}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Instructor Tab */}
              <TabsContent value="instructor">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-20 w-20">
                        <AvatarImage src={course.instructorAvatar} />
                        <AvatarFallback>{course.instructorName[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-xl font-bold mb-2">{course.instructorName}</h3>
                        <p className="text-muted-foreground mb-4">{course.instructorBio}</p>
                        <Link href="/coaches/prof-steven">
                          <Button variant="outline" className="gap-2">
                            {isEn ? "View Full Profile" : "Voir le profil complet"}
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Reviews Tab */}
              <TabsContent value="reviews">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>{isEn ? "Student Reviews" : "Avis des étudiants"}</CardTitle>
                        <div className="flex items-center gap-2 mt-2">
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-5 w-5 ${
                                  star <= Math.round(parseFloat(course.averageRating))
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-muted-foreground"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="font-semibold">{course.averageRating}</span>
                          <span className="text-muted-foreground">
                            ({course.totalReviews} {isEn ? "reviews" : "avis"})
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {course.reviews.map((review) => (
                        <div key={review.id} className="border-b pb-6 last:border-0">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Avatar className="h-10 w-10">
                                <AvatarFallback>{review.userName[0]}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{review.userName}</p>
                                <p className="text-xs text-muted-foreground">{review.date}</p>
                              </div>
                            </div>
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`h-4 w-4 ${
                                    star <= review.rating
                                      ? "fill-yellow-400 text-yellow-400"
                                      : "text-muted-foreground"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-muted-foreground">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
