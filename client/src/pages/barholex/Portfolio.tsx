// Header removed - using EcosystemLayout sub-header instead
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  ArrowRight,
  ExternalLink,
  Filter,
  Video,
  Monitor,
  PenTool,
  GraduationCap,
  Award,
  Users,
  Star,
  Quote,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Mic,
  BookOpen,
  Brain,
  Layers,
} from "lucide-react";

export default function BarholexPortfolio() {
  const { language } = useLanguage();
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const [testimonialIndex, setTestimonialIndex] = useState(0);

  const FILTERS = [
    { id: "all", labelEn: "All Projects", labelFr: "Tous les projets", icon: Layers },
    { id: "platform", labelEn: "Platforms & LMS", labelFr: "Plateformes & LMS", icon: Monitor },
    { id: "video", labelEn: "Video & Shorts", labelFr: "Vidéo & Shorts", icon: Video },
    { id: "audio", labelEn: "Podcasts & Audio", labelFr: "Podcasts & Audio", icon: Mic },
    { id: "edtech", labelEn: "EdTech & AI", labelFr: "EdTech & IA", icon: Brain },
    { id: "branding", labelEn: "Branding & Design", labelFr: "Image de marque", icon: PenTool },
  ];

  const PROJECTS = [
    {
      id: 1,
      titleEn: "RusingÂcademy Learning Ecosystem",
      titleFr: "Écosystème d'apprentissage RusingÂcademy",
      categoryEn: "Full-Stack LMS Platform",
      categoryFr: "Plateforme LMS complète",
      descEn: "A comprehensive bilingual learning management system with 6 structured Paths (A1–C1 + Exam Prep), AI-powered coaching, progress tracking, and SLE exam preparation for Canadian public servants.",
      descFr: "Un système de gestion d'apprentissage bilingue complet avec 6 Parcours structurés (A1–C1 + Préparation aux examens), coaching alimenté par l'IA, suivi de progression et préparation aux examens ELS pour les fonctionnaires canadiens.",
      image: "https://rusingacademy-cdn.b-cdn.net/images/ecosystem-rusingacademy.jpg",
      filter: "platform",
      featured: true,
      clientEn: "RusingAcademy (Internal)",
      clientFr: "RusingAcademy (Interne)",
      yearEn: "2024–2026",
      yearFr: "2024–2026",
      resultsEn: ["6 structured learning Paths", "96 lessons with evaluations", "AI coaching integration"],
      resultsFr: ["6 Parcours d'apprentissage structurés", "96 leçons avec évaluations", "Intégration du coaching IA"],
      link: "/courses",
    },
    {
      id: 2,
      titleEn: "Lingueefy Coaching Platform",
      titleFr: "Plateforme de coaching Lingueefy",
      categoryEn: "Human & AI Coaching",
      categoryFr: "Coaching humain & IA",
      descEn: "Personalized bilingual coaching platform connecting learners with certified instructors. Features AI-powered practice sessions, real-time feedback, and flexible scheduling for busy professionals.",
      descFr: "Plateforme de coaching bilingue personnalisée connectant les apprenants avec des instructeurs certifiés. Sessions de pratique alimentées par l'IA, rétroaction en temps réel et horaires flexibles pour les professionnels occupés.",
      image: "https://rusingacademy-cdn.b-cdn.net/images/ecosystem-lingueefy.jpg",
      filter: "platform",
      featured: true,
      clientEn: "Lingueefy (Internal)",
      clientFr: "Lingueefy (Interne)",
      yearEn: "2024–2026",
      yearFr: "2024–2026",
      resultsEn: ["5+ certified coaches", "AI conversation partner", "Flexible booking system"],
      resultsFr: ["5+ coachs certifiés", "Partenaire de conversation IA", "Système de réservation flexible"],
      link: "/lingueefy",
    },
    {
      id: 3,
      titleEn: "Bilingual Shorts Series",
      titleFr: "Série de Shorts bilingues",
      categoryEn: "Short-Form Video",
      categoryFr: "Vidéo courte",
      descEn: "A curated series of 10+ educational Shorts delivering bite-sized French learning content. Each Short targets a specific grammar point, vocabulary set, or exam technique in under 60 seconds.",
      descFr: "Une série de 10+ Shorts éducatifs offrant du contenu d'apprentissage du français en format court. Chaque Short cible un point de grammaire, un ensemble de vocabulaire ou une technique d'examen en moins de 60 secondes.",
      image: "https://rusingacademy-cdn.b-cdn.net/images/capsules/capsule_01.jpg",
      filter: "video",
      featured: false,
      clientEn: "RusingAcademy (Internal)",
      clientFr: "RusingAcademy (Interne)",
      yearEn: "2025–2026",
      yearFr: "2025–2026",
      resultsEn: ["10+ Shorts produced", "Cross-platform distribution", "High engagement rate"],
      resultsFr: ["10+ Shorts produits", "Distribution multiplateforme", "Taux d'engagement élevé"],
      link: "/#videos",
    },
    {
      id: 4,
      titleEn: "Capsules Pédagogiques",
      titleFr: "Capsules pédagogiques",
      categoryEn: "Educational Video Series",
      categoryFr: "Série vidéo éducative",
      descEn: "7 in-depth pedagogical capsules covering core French learning topics: grammar foundations, oral expression, written comprehension, and exam strategies. Professional studio production with expert instructors.",
      descFr: "7 capsules pédagogiques approfondies couvrant les sujets fondamentaux de l'apprentissage du français : bases grammaticales, expression orale, compréhension écrite et stratégies d'examen. Production studio professionnelle avec instructeurs experts.",
      image: "https://rusingacademy-cdn.b-cdn.net/images/capsules/capsule_03.jpg",
      filter: "video",
      featured: false,
      clientEn: "RusingAcademy (Internal)",
      clientFr: "RusingAcademy (Interne)",
      yearEn: "2025",
      yearFr: "2025",
      resultsEn: ["7 capsules produced", "Studio-quality production", "Expert-led instruction"],
      resultsFr: ["7 capsules produites", "Production qualité studio", "Instruction par des experts"],
      link: "/#videos",
    },
    {
      id: 5,
      titleEn: "Podcast: Bilingual Excellence",
      titleFr: "Podcast : Excellence bilingue",
      categoryEn: "Podcast Production",
      categoryFr: "Production de podcast",
      descEn: "A professional podcast series exploring bilingualism in Canada's public service, featuring interviews with language experts, coaches, and successful bilingual professionals. Multi-episode production with full post-production.",
      descFr: "Une série de podcasts professionnels explorant le bilinguisme dans la fonction publique du Canada, avec des entrevues d'experts en langues, de coachs et de professionnels bilingues accomplis. Production multi-épisodes avec post-production complète.",
      image: "https://rusingacademy-cdn.b-cdn.net/images/proof/podcast-1.jpg",
      filter: "audio",
      featured: false,
      clientEn: "Barholex Media (Internal)",
      clientFr: "Barholex Media (Interne)",
      yearEn: "2025",
      yearFr: "2025",
      resultsEn: ["Multi-episode series", "Expert interviews", "Professional audio quality"],
      resultsFr: ["Série multi-épisodes", "Entrevues d'experts", "Qualité audio professionnelle"],
    },
    {
      id: 6,
      titleEn: "AI Conversation Partner",
      titleFr: "Partenaire de conversation IA",
      categoryEn: "AI-Powered Tool",
      categoryFr: "Outil alimenté par l'IA",
      descEn: "An intelligent AI conversation partner integrated into the Lingueefy platform, providing 24/7 French practice with real-time feedback, pronunciation guidance, and adaptive difficulty levels tailored to each learner's proficiency.",
      descFr: "Un partenaire de conversation IA intelligent intégré à la plateforme Lingueefy, offrant une pratique du français 24/7 avec rétroaction en temps réel, guidage de prononciation et niveaux de difficulté adaptatifs selon la maîtrise de chaque apprenant.",
      image: "https://rusingacademy-cdn.b-cdn.net/images/generated/coaching-session.jpg",
      filter: "edtech",
      featured: false,
      clientEn: "Lingueefy (Internal)",
      clientFr: "Lingueefy (Interne)",
      yearEn: "2025–2026",
      yearFr: "2025–2026",
      resultsEn: ["24/7 availability", "Adaptive difficulty", "Real-time feedback"],
      resultsFr: ["Disponibilité 24/7", "Difficulté adaptative", "Rétroaction en temps réel"],
      link: "/lingueefy",
    },
    {
      id: 7,
      titleEn: "Ecosystem Brand Identity",
      titleFr: "Identité de marque de l'écosystème",
      categoryEn: "Brand Design System",
      categoryFr: "Système de design de marque",
      descEn: "Complete brand identity design for the three-pillar ecosystem: RusingAcademy (academic orange), Lingueefy (coaching teal), and Barholex Media (consulting gold). Includes logos, color systems, typography, and visual guidelines.",
      descFr: "Conception complète de l'identité de marque pour l'écosystème à trois piliers : RusingAcademy (orange académique), Lingueefy (sarcelle coaching) et Barholex Media (or consulting). Comprend logos, systèmes de couleurs, typographie et directives visuelles.",
      image: "https://rusingacademy-cdn.b-cdn.net/images/ecosystem-barholex.jpg",
      filter: "branding",
      featured: false,
      clientEn: "Rusinga International Consulting",
      clientFr: "Rusinga International Consulting",
      yearEn: "2024–2025",
      yearFr: "2024–2025",
      resultsEn: ["3 distinct brand identities", "Unified design system", "Cross-platform consistency"],
      resultsFr: ["3 identités de marque distinctes", "Système de design unifié", "Cohérence multiplateforme"],
    },
    {
      id: 8,
      titleEn: "SLE Diagnostic Assessment Tool",
      titleFr: "Outil de diagnostic ELS",
      categoryEn: "EdTech Assessment",
      categoryFr: "Évaluation EdTech",
      descEn: "A comprehensive diagnostic tool that evaluates learners' current French proficiency level and recommends the optimal learning Path. Features oral, written, and reading comprehension assessments aligned with Government of Canada SLE standards.",
      descFr: "Un outil de diagnostic complet qui évalue le niveau de maîtrise actuel du français des apprenants et recommande le Parcours d'apprentissage optimal. Comprend des évaluations orales, écrites et de compréhension de lecture alignées sur les normes ELS du gouvernement du Canada.",
      image: "https://rusingacademy-cdn.b-cdn.net/images/generated/classroom-training.jpg",
      filter: "edtech",
      featured: false,
      clientEn: "RusingAcademy (Internal)",
      clientFr: "RusingAcademy (Interne)",
      yearEn: "2025",
      yearFr: "2025",
      resultsEn: ["Multi-skill assessment", "SLE-aligned standards", "Personalized Path recommendation"],
      resultsFr: ["Évaluation multi-compétences", "Normes alignées ELS", "Recommandation de Parcours personnalisée"],
      link: "/sle-diagnostic",
    },
  ];

  const TESTIMONIALS = [
    {
      quoteEn: "The RusingAcademy platform transformed how I prepare for my SLE exams. The structured Paths and AI coaching gave me the confidence I needed to succeed.",
      quoteFr: "La plateforme RusingAcademy a transformé ma façon de me préparer aux examens ELS. Les Parcours structurés et le coaching IA m'ont donné la confiance dont j'avais besoin pour réussir.",
      authorEn: "Satisfied Learner",
      authorFr: "Apprenant satisfait",
      roleEn: "Federal Public Servant",
      roleFr: "Fonctionnaire fédéral",
      image: "https://rusingacademy-cdn.b-cdn.net/images/testimonials/testimonial-1.jpg",
    },
    {
      quoteEn: "As a coach on the Lingueefy platform, I can say the technology behind it is exceptional. It allows me to focus on what matters most — helping my students grow.",
      quoteFr: "En tant que coach sur la plateforme Lingueefy, je peux dire que la technologie derrière est exceptionnelle. Elle me permet de me concentrer sur ce qui compte le plus — aider mes étudiants à progresser.",
      authorEn: "Sue-Anne Richer",
      authorFr: "Sue-Anne Richer",
      roleEn: "Certified French Coach, Lingueefy",
      roleFr: "Coach de français certifiée, Lingueefy",
      image: "https://rusingacademy-cdn.b-cdn.net/images/coaches/Sue-Anne.webp",
    },
    {
      quoteEn: "The quality of the video content and pedagogical capsules produced by Barholex Media is outstanding. Each piece is carefully crafted to maximize learning impact.",
      quoteFr: "La qualité du contenu vidéo et des capsules pédagogiques produites par Barholex Media est remarquable. Chaque pièce est soigneusement conçue pour maximiser l'impact d'apprentissage.",
      authorEn: "Steven Barholere",
      authorFr: "Steven Barholere",
      roleEn: "Founder & CEO, Rusinga International Consulting",
      roleFr: "Fondateur & PDG, Rusinga International Consulting",
      image: "https://rusingacademy-cdn.b-cdn.net/images/coaches/steven-barholere.webp",
    },
  ];

  const filteredProjects = activeFilter === "all" 
    ? PROJECTS 
    : PROJECTS.filter(p => p.filter === activeFilter);

  const nextTestimonial = () => {
    setTestimonialIndex((prev) => (prev + 1) % TESTIMONIALS.length);
  };

  const prevTestimonial = () => {
    setTestimonialIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#062b2b] via-gray-950 to-[#041e1e] text-white">
      
      <main id="main-content">
        {/* Hero Section - Premium Design */}
        <section className="relative pt-20 pb-16 px-4 overflow-hidden">
          {/* Background Effects */}
          <div className="absolute inset-0">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-[120px]" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#E7F2F2]/10 rounded-full blur-[120px]" />
          </div>
          
          {/* Decorative Grid */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(212,175,55,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(212,175,55,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
          
          <div className="container mx-auto relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-center mb-6"
              >
                <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#D4AF37]/20 to-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] font-medium">
                  <Award className="w-4 h-4" />
                  {language === "en" ? "Our Work in Action" : "Nos réalisations en action"}
                </span>
              </motion.div>
              
              {/* Title */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-4xl md:text-6xl font-bold mb-6 leading-tight"
              >
                <span className="text-white">{language === "en" ? "Our " : "Notre "}</span>
                <span className="bg-gradient-to-r from-[#D4AF37] via-[#F7DC6F] to-[#D4AF37] bg-clip-text text-transparent">
                  Portfolio
                </span>
              </motion.h1>
              
              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto leading-relaxed mb-8"
              >
                {language === "en"
                  ? "From learning platforms to video production, every project in our ecosystem is designed to advance bilingual excellence. Explore the tools, content, and innovations we've built for Canadian professionals."
                  : "Des plateformes d'apprentissage à la production vidéo, chaque projet de notre écosystème est conçu pour faire avancer l'excellence bilingue. Explorez les outils, le contenu et les innovations que nous avons créés pour les professionnels canadiens."
                }
              </motion.p>

              {/* Stats - Real numbers */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-wrap justify-center gap-8 md:gap-12"
              >
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#D4AF37]">3</div>
                  <div className="text-sm text-white/80">{language === "en" ? "Platforms Built" : "Plateformes créées"}</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#D4AF37]">17+</div>
                  <div className="text-sm text-white/80">{language === "en" ? "Videos Produced" : "Vidéos produites"}</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#D4AF37]">96</div>
                  <div className="text-sm text-white/80">{language === "en" ? "Lessons Created" : "Leçons créées"}</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#D4AF37]">6</div>
                  <div className="text-sm text-white/80">{language === "en" ? "Learning Paths" : "Parcours d'apprentissage"}</div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Filters - Premium Design */}
        <section className="py-6 px-4 sticky top-0 z-20 bg-[#062b2b]/90 backdrop-blur-xl border-b border-[#D4AF37]/10">
          <div className="container mx-auto">
            <div className="flex flex-wrap justify-center gap-2 md:gap-3">
              {FILTERS.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  aria-pressed={activeFilter === filter.id}
                  aria-label={`Filter by ${language === "en" ? filter.labelEn : filter.labelFr}`}
                  className={`flex items-center gap-2 px-4 py-2 md:px-5 md:py-2.5 rounded-full text-xs md:text-sm font-medium transition-all duration-300 ${
                    activeFilter === filter.id
                      ? "bg-gradient-to-r from-[#D4AF37] to-[#B8962E] text-black shadow-lg shadow-[#D4AF37]/20"
                      : "bg-white/5 text-white/80 hover:bg-white/10 hover:text-white border border-white/10"
                  }`}
                >
                  <filter.icon className="w-4 h-4" aria-hidden="true" />
                  {language === "en" ? filter.labelEn : filter.labelFr}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Projects Grid - Premium Cards */}
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeFilter}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto"
              >
                {filteredProjects.map((project, index) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`group relative rounded-2xl overflow-hidden cursor-pointer ${
                      project.featured ? "md:col-span-2 md:row-span-2" : ""
                    }`}
                    onClick={() => setSelectedProject(selectedProject === project.id ? null : project.id)}
                  >
                    {/* Image */}
                    <img 
                      loading="lazy" src={project.image} 
                      alt={language === "en" ? project.titleEn : project.titleFr}
                      className={`w-full object-cover transition-transform duration-700 group-hover:scale-110 ${
                        project.featured ? "h-[400px] md:h-full" : "h-72"
                      }`}
                    />
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-80 group-hover:opacity-95 transition-all duration-300" />
                    
                    {/* Content */}
                    <div className="absolute inset-0 flex flex-col justify-end p-6">
                      {/* Category Badge */}
                      <span className="inline-flex items-center gap-1.5 w-fit px-3 py-1 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-medium mb-3">
                        {language === "en" ? project.categoryEn : project.categoryFr}
                      </span>
                      
                      {/* Title */}
                      <h3 className={`font-bold text-white mb-2 ${project.featured ? "text-2xl md:text-3xl" : "text-xl"}`}>
                        {language === "en" ? project.titleEn : project.titleFr}
                      </h3>
                      
                      {/* Description */}
                      <p className={`text-white/90 mb-4 ${project.featured ? "text-base" : "text-sm"} line-clamp-3`}>
                        {language === "en" ? project.descEn : project.descFr}
                      </p>
                      
                      {/* Client & Year */}
                      <div className="flex items-center gap-4 text-sm text-white/70 mb-4">
                        <span>{language === "en" ? project.clientEn : project.clientFr}</span>
                        <span className="text-[#D4AF37]/50">•</span>
                        <span>{language === "en" ? project.yearEn : project.yearFr}</span>
                      </div>

                      {/* Results - Shown on hover or when selected */}
                      <div className={`transition-all duration-300 ${
                        selectedProject === project.id ? "opacity-100 max-h-40" : "opacity-0 max-h-0 group-hover:opacity-100 group-hover:max-h-40"
                      } overflow-hidden`}>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {(language === "en" ? project.resultsEn : project.resultsFr).map((result, i) => (
                            <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/10 text-white/90 text-xs">
                              <Star className="w-3 h-3 text-[#D4AF37]" />
                              {result}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      {/* CTA */}
                      {project.link && (
                        <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                          <Link href={project.link}>
                            <Button size="sm" className="bg-[#D4AF37] hover:bg-[#B8962E] text-black rounded-full">
                              {language === "en" ? "Explore" : "Explorer"}
                              <ExternalLink className="ml-2 h-4 w-4" />
                            </Button>
                          </Link>
                        </div>
                      )}
                    </div>
                    
                    {/* Featured Badge */}
                    {project.featured && (
                      <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#B8962E] text-black text-xs font-bold flex items-center gap-1.5">
                        <Star className="w-3 h-3" />
                        {language === "en" ? "FLAGSHIP" : "PHARE"}
                      </div>
                    )}
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 px-4 bg-gradient-to-br from-[#062b2b]/50 to-[#041e1e] relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent" />
          
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <span className="inline-block px-4 py-1.5 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] text-sm font-medium mb-4">
                {language === "en" ? "Voices from the Ecosystem" : "Voix de l'écosystème"}
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                {language === "en" ? "What People Say" : "Ce que les gens disent"}
              </h2>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="relative">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={testimonialIndex}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    className="p-8 md:p-12 rounded-3xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 backdrop-blur-sm"
                  >
                    <Quote className="w-12 h-12 text-[#D4AF37]/30 mb-6" />
                    
                    <p className="text-xl md:text-2xl text-white leading-relaxed mb-8">
                      "{language === "en" ? TESTIMONIALS[testimonialIndex].quoteEn : TESTIMONIALS[testimonialIndex].quoteFr}"
                    </p>
                    
                    <div className="flex items-center gap-4">
                      <img
                        loading="lazy" src={TESTIMONIALS[testimonialIndex].image}
                        alt={TESTIMONIALS[testimonialIndex].authorEn}
                        className="w-14 h-14 rounded-full object-cover border-2 border-[#D4AF37]"
                      />
                      <div>
                        <div className="font-bold text-white">
                          {language === "en" ? TESTIMONIALS[testimonialIndex].authorEn : TESTIMONIALS[testimonialIndex].authorFr}
                        </div>
                        <div className="text-sm text-white/70">
                          {language === "en" ? TESTIMONIALS[testimonialIndex].roleEn : TESTIMONIALS[testimonialIndex].roleFr}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Navigation */}
                <div className="flex justify-center gap-4 mt-8">
                  <button
                    onClick={prevTestimonial}
                    aria-label="Previous testimonial"
                    className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors text-white"
                  >
                    <ChevronLeft className="w-5 h-5" aria-hidden="true" />
                  </button>
                  
                  <div className="flex items-center gap-2">
                    {TESTIMONIALS.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setTestimonialIndex(index)}
                        aria-label={`Go to testimonial ${index + 1}`}
                        aria-current={index === testimonialIndex ? "true" : undefined}
                        className={`h-2 rounded-full transition-all duration-300 ${
                          index === testimonialIndex ? "w-8 bg-[#D4AF37]" : "w-2 bg-white/20 hover:bg-white/40"
                        }`}
                      />
                    ))}
                  </div>
                  
                  <button
                    onClick={nextTestimonial}
                    aria-label="Next testimonial"
                    className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors text-white"
                  >
                    <ChevronRight className="w-5 h-5" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-[#D4AF37] to-[#B8962E]" />
          <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(0,0,0,0.08)_25%,transparent_25%,transparent_50%,rgba(0,0,0,0.08)_50%,rgba(0,0,0,0.08)_75%,transparent_75%)] bg-[size:20px_20px]" />
          
          <div className="container mx-auto relative z-10">
            <div className="max-w-3xl mx-auto text-center text-black">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                {language === "en" ? "Have a Project in Mind?" : "Vous avez un projet en tête?"}
              </h2>
              <p className="text-xl text-black/80 mb-10">
                {language === "en"
                  ? "Whether you need a learning platform, video content, or a complete EdTech strategy — let's build something meaningful together."
                  : "Que vous ayez besoin d'une plateforme d'apprentissage, de contenu vidéo ou d'une stratégie EdTech complète — construisons quelque chose de significatif ensemble."
                }
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/barholex/contact">
                  <Button 
                    size="lg" 
                    className="rounded-full px-8 h-14 text-lg font-semibold bg-black text-[#D4AF37] hover:bg-[#062b2b]"
                  >
                    {language === "en" ? "Start a Conversation" : "Démarrer une conversation"}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/barholex/services">
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="rounded-full px-8 h-14 text-lg font-semibold border-black/30 text-black hover:bg-black/10"
                  >
                    {language === "en" ? "View Our Services" : "Voir nos services"}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
