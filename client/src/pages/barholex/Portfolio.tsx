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
  Video,
  Monitor,
  PenTool,
  Award,
  Star,
  Quote,
  ChevronLeft,
  ChevronRight,
  Mic,
  Brain,
  Layers,
  Zap,
  TrendingUp,
  CheckCircle,
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
      titleEn: "RusingAcademy Learning Ecosystem",
      titleFr: "Écosystème d'apprentissage RusingAcademy",
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
    <div className="min-h-screen bg-stone-50 text-gray-900">
      
      <main id="main-content">
        {/* ─── Hero Section ─── Premium dark header with gold accents */}
        <section className="relative pt-24 pb-20 px-4 overflow-hidden bg-gradient-to-br from-[#0A1628] via-[#0F2035] to-[#0A1628]">
          {/* Decorative orbs */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-10 left-[15%] w-80 h-80 bg-barholex-gold/12 rounded-full blur-[100px] animate-pulse" />
            <div className="absolute bottom-10 right-[15%] w-72 h-72 bg-teal-500/10 rounded-full blur-[100px]" />
          </div>
          
          {/* Subtle grid */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(212,175,55,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(212,175,55,0.04)_1px,transparent_1px)] bg-[size:48px_48px]" />
          
          <div className="container mx-auto relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-center mb-8"
              >
                <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white dark:bg-slate-900/10 backdrop-blur-md border border-white/20 text-barholex-gold font-medium text-sm shadow-lg shadow-black/10">
                  <Award className="w-4 h-4" />
                  {language === "en" ? "Our Work in Action" : "Nos réalisations en action"}
                </span>
              </motion.div>
              
              {/* Title */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight tracking-tight"
              >
                <span className="text-white">{language === "en" ? "Our " : "Notre "}</span>
                <span className="bg-gradient-to-r from-barholex-gold via-[#F7DC6F] to-barholex-gold bg-clip-text text-transparent">
                  Portfolio
                </span>
              </motion.h1>
              
              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-lg md:text-xl text-white/85 max-w-3xl mx-auto leading-relaxed mb-12"
              >
                {language === "en"
                  ? "From learning platforms to video production, every project in our ecosystem is designed to advance bilingual excellence. Explore the tools, content, and innovations we've built for Canadian professionals."
                  : "Des plateformes d'apprentissage à la production vidéo, chaque projet de notre écosystème est conçu pour faire avancer l'excellence bilingue. Explorez les outils, le contenu et les innovations que nous avons créés pour les professionnels canadiens."
                }
              </motion.p>

              {/* Stats - Glassmorphism cards */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto"
              >
                {[
                  { value: "3", labelEn: "Platforms Built", labelFr: "Plateformes créées", icon: Monitor },
                  { value: "17+", labelEn: "Videos Produced", labelFr: "Vidéos produites", icon: Video },
                  { value: "96", labelEn: "Lessons Created", labelFr: "Leçons créées", icon: Zap },
                  { value: "6", labelEn: "Learning Paths", labelFr: "Parcours", icon: TrendingUp },
                ].map((stat, i) => (
                  <div
                    key={i}
                    className="relative p-4 rounded-2xl bg-white dark:bg-slate-900/[0.07] backdrop-blur-md border border-white/15 hover:bg-white dark:bg-slate-900/[0.12] transition-all duration-300 group"
                  >
                    <stat.icon className="w-5 h-5 text-barholex-gold/60 mb-2 mx-auto group-hover:text-barholex-gold transition-colors" />
                    <div className="text-2xl md:text-3xl font-bold text-white">{stat.value}</div>
                    <div className="text-xs text-white/70 mt-1">{language === "en" ? stat.labelEn : stat.labelFr}</div>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>

          {/* Bottom wave divider */}
          <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
            <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-12 md:h-16">
              <path d="M0,60 C200,100 400,20 600,60 C800,100 1000,20 1200,60 L1200,120 L0,120 Z" fill="#FAFAF8" />
            </svg>
          </div>
        </section>

        {/* ─── Filters ─── Light background, premium pill buttons */}
        <section className="py-8 px-4 sticky top-0 z-20 bg-stone-50/95 backdrop-blur-xl border-b border-stone-200">
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
                      ? "bg-gradient-to-r from-barholex-gold to-amber-600 text-white shadow-lg shadow-amber-500/25"
                      : "bg-white dark:bg-slate-800 text-slate-600 hover:bg-[#F0EDE8] border border-stone-200 hover:border-barholex-gold/30"
                  }`}
                >
                  <filter.icon className="w-4 h-4" aria-hidden="true" />
                  {language === "en" ? filter.labelEn : filter.labelFr}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Projects Grid ─── Light background with premium cards */}
        <section className="py-16 px-4 bg-stone-50">
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
                    className={`group relative rounded-2xl overflow-hidden cursor-pointer shadow-lg shadow-black/5 hover:shadow-xl hover:shadow-black/10 transition-all duration-500 ${
                      project.featured ? "md:col-span-2 md:row-span-2" : ""
                    }`}
                    onClick={() => setSelectedProject(selectedProject === project.id ? null : project.id)}
                  >
                    {/* Image */}
                    <img 
                      loading="lazy" src={project.image} 
                      alt={language === "en" ? project.titleEn : project.titleFr}
                      className={`w-full object-cover transition-transform duration-700 group-hover:scale-105 ${
                        project.featured ? "h-[400px] md:h-full" : "h-72"
                      }`}
                    />
                    
                    {/* Overlay — lighter gradient for better readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A1628] via-[#0A1628]/70 to-transparent opacity-85 group-hover:opacity-95 transition-all duration-300" />
                    
                    {/* Content */}
                    <div className="absolute inset-0 flex flex-col justify-end p-6">
                      {/* Category Badge */}
                      <span className="inline-flex items-center gap-1.5 w-fit px-3 py-1.5 rounded-full bg-barholex-gold/25 border border-barholex-gold/40 text-[#F7DC6F] text-xs font-semibold mb-3 backdrop-blur-sm">
                        {language === "en" ? project.categoryEn : project.categoryFr}
                      </span>
                      
                      {/* Title */}
                      <h3 className={`font-bold text-white mb-2 leading-tight ${project.featured ? "text-2xl md:text-3xl" : "text-lg"}`}>
                        {language === "en" ? project.titleEn : project.titleFr}
                      </h3>
                      
                      {/* Description */}
                      <p className={`text-white/90 mb-3 ${project.featured ? "text-base" : "text-sm"} line-clamp-3 leading-relaxed`}>
                        {language === "en" ? project.descEn : project.descFr}
                      </p>
                      
                      {/* Client & Year */}
                      <div className="flex items-center gap-3 text-sm text-white/70 mb-3">
                        <span className="font-medium">{language === "en" ? project.clientEn : project.clientFr}</span>
                        <span className="text-barholex-gold">|</span>
                        <span>{language === "en" ? project.yearEn : project.yearFr}</span>
                      </div>

                      {/* Results - Shown on hover or when selected */}
                      <div className={`transition-all duration-300 ${
                        selectedProject === project.id ? "opacity-100 max-h-40" : "opacity-0 max-h-0 group-hover:opacity-100 group-hover:max-h-40"
                      } overflow-hidden`}>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {(language === "en" ? project.resultsEn : project.resultsFr).map((result, i) => (
                            <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white dark:bg-slate-900/15 backdrop-blur-sm text-white text-xs font-medium">
                              <CheckCircle className="w-3 h-3 text-barholex-gold" />
                              {result}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      {/* CTA */}
                      {project.link && (
                        <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                          <Link href={project.link}>
                            <Button size="sm" className="bg-barholex-gold hover:bg-amber-600 text-slate-900 font-semibold rounded-full shadow-lg shadow-amber-500/30">
                              {language === "en" ? "Explore" : "Explorer"}
                              <ExternalLink className="ml-2 h-4 w-4" />
                            </Button>
                          </Link>
                        </div>
                      )}
                    </div>
                    
                    {/* Featured Badge */}
                    {project.featured && (
                      <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-gradient-to-r from-barholex-gold to-[#F7DC6F] text-slate-900 text-xs font-bold flex items-center gap-1.5 shadow-lg">
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

        {/* ─── Testimonials Section ─── Warm cream background with glassmorphism cards */}
        <section className="py-24 px-4 bg-gradient-to-b from-[#F5F5F3] to-[#FAFAF8] relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[var(--brand-gold, #D4AF37)]/20 to-transparent" />
          <div className="absolute top-20 right-[10%] w-64 h-64 bg-barholex-gold/5 rounded-full blur-[80px]" />
          <div className="absolute bottom-20 left-[10%] w-48 h-48 bg-teal-500/5 rounded-full blur-[60px]" />
          
          <div className="container mx-auto relative z-10">
            <div className="text-center mb-14">
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-barholex-gold/10 text-[#B8962E] text-sm font-semibold mb-5 border border-barholex-gold/15"
              >
                <Quote className="w-4 h-4" />
                {language === "en" ? "Voices from the Ecosystem" : "Voix de l'écosystème"}
              </motion.span>
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-3xl md:text-5xl font-bold text-slate-900"
              >
                {language === "en" ? "What People Say" : "Ce que les gens disent"}
              </motion.h2>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="relative">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={testimonialIndex}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    className="p-8 md:p-12 rounded-3xl bg-white dark:bg-slate-900/80 backdrop-blur-xl border border-stone-200 shadow-xl shadow-black/5"
                  >
                    <Quote className="w-12 h-12 text-barholex-gold/25 mb-6" />
                    
                    <p className="text-xl md:text-2xl text-gray-900 dark:text-gray-100 leading-relaxed mb-8 font-medium">
                      "{language === "en" ? TESTIMONIALS[testimonialIndex].quoteEn : TESTIMONIALS[testimonialIndex].quoteFr}"
                    </p>
                    
                    <div className="flex items-center gap-4">
                      <img
                        loading="lazy" src={TESTIMONIALS[testimonialIndex].image}
                        alt={TESTIMONIALS[testimonialIndex].authorEn}
                        className="w-14 h-14 rounded-full object-cover border-2 border-barholex-gold shadow-md"
                      />
                      <div>
                        <div className="font-bold text-slate-900 text-lg">
                          {language === "en" ? TESTIMONIALS[testimonialIndex].authorEn : TESTIMONIALS[testimonialIndex].authorFr}
                        </div>
                        <div className="text-sm text-[#5A6B7A]">
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
                    className="w-12 h-12 rounded-full bg-white dark:bg-slate-900 border border-stone-200 flex items-center justify-center hover:bg-stone-100 hover:border-barholex-gold/30 transition-all text-slate-600 shadow-sm"
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
                        className={`h-2.5 rounded-full transition-all duration-300 ${
                          index === testimonialIndex ? "w-10 bg-gradient-to-r from-barholex-gold to-amber-600" : "w-2.5 bg-[#E8E6E1] hover:bg-barholex-gold/30"
                        }`}
                      />
                    ))}
                  </div>
                  
                  <button
                    onClick={nextTestimonial}
                    aria-label="Next testimonial"
                    className="w-12 h-12 rounded-full bg-white dark:bg-slate-900 border border-stone-200 flex items-center justify-center hover:bg-stone-100 hover:border-barholex-gold/30 transition-all text-slate-600 shadow-sm"
                  >
                    <ChevronRight className="w-5 h-5" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── CTA Section ─── Dark navy with gold gradient accent */}
        <section className="py-24 px-4 relative overflow-hidden bg-slate-900">
          {/* Background texture */}
          <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(212,175,55,0.03)_25%,transparent_25%,transparent_50%,rgba(212,175,55,0.03)_50%,rgba(212,175,55,0.03)_75%,transparent_75%)] bg-[size:24px_24px]" />
          {/* Gold accent line at top */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[var(--brand-gold, #D4AF37)] to-transparent" />
          {/* Decorative orbs */}
          <div className="absolute top-10 left-[20%] w-48 h-48 bg-barholex-gold/8 rounded-full blur-[80px]" />
          <div className="absolute bottom-10 right-[20%] w-56 h-56 bg-teal-500/6 rounded-full blur-[80px]" />
          
          <div className="container mx-auto relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-barholex-gold/15 text-barholex-gold text-sm font-semibold mb-6 border border-barholex-gold/20">
                  <Zap className="w-4 h-4" />
                  {language === "en" ? "Let's Collaborate" : "Collaborons"}
                </span>
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-3xl md:text-5xl font-bold mb-6 text-white leading-tight"
              >
                {language === "en" ? "Have a Project in Mind?" : "Vous avez un projet en tête?"}
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-lg md:text-xl text-white/75 mb-10 leading-relaxed"
              >
                {language === "en"
                  ? "Whether you need a learning platform, video content, or a complete EdTech strategy — let's build something meaningful together."
                  : "Que vous ayez besoin d'une plateforme d'apprentissage, de contenu vidéo ou d'une stratégie EdTech complète — construisons quelque chose de significatif ensemble."
                }
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="flex flex-col sm:flex-row gap-4 justify-center"
              >
                <Link href="/barholex/contact">
                  <Button 
                    size="lg" 
                    className="rounded-full px-8 h-14 text-lg font-semibold bg-gradient-to-r from-barholex-gold to-amber-600 text-slate-900 hover:from-[#F7DC6F] hover:to-barholex-gold shadow-lg shadow-amber-500/25 transition-all duration-300"
                  >
                    {language === "en" ? "Start a Conversation" : "Démarrer une conversation"}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/barholex/services">
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="rounded-full px-8 h-14 text-lg font-semibold border-white/20 text-white hover:bg-white dark:bg-slate-900/10 hover:border-white/30 transition-all duration-300"
                  >
                    {language === "en" ? "View Our Services" : "Voir nos services"}
                  </Button>
                </Link>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
