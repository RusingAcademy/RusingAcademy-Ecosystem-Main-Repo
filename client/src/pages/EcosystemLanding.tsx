import { useState, useEffect, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { Sun, Moon, Check, ArrowRight, ChevronLeft, ChevronRight, Users, MessageCircle } from "lucide-react";
import RusingAcademyLogo from "@/components/RusingAcademyLogo";
import LingeefyLogo from "@/components/LingeefyLogo";
import BarholexLogo from "@/components/BarholexLogo";

// Hero carousel images - professional, lively images of Canadian public servants
const heroCarouselImages = [
  {
    src: "/images/ecosystem/hero-main.jpg",
    alt: { en: "Professional team collaboration", fr: "Collaboration d'équipe professionnelle" },
  },
  {
    src: "/images/ecosystem/carousel-1.jpg",
    alt: { en: "Language coaching session", fr: "Session de coaching linguistique" },
  },
  {
    src: "/images/ecosystem/carousel-2.jpg",
    alt: { en: "Government professionals in meeting", fr: "Professionnels gouvernementaux en réunion" },
  },
  {
    src: "/images/ecosystem/carousel-3.jpg",
    alt: { en: "Bilingual workplace success", fr: "Succès en milieu de travail bilingue" },
  },
  {
    src: "/images/ecosystem/carousel-4.jpg",
    alt: { en: "Career advancement celebration", fr: "Célébration d'avancement de carrière" },
  },
];

type Theme = "glass" | "light";

interface BrandCard {
  id: string;
  name: string;
  color: string;
  image: string;
  pitch: { en: string; fr: string };
  bullets: { en: string[]; fr: string[] };
  cta: { en: string; fr: string };
  link: string;
}

const brands: BrandCard[] = [
  {
    id: "rusingacademy",
    name: "RusingÂcademy",
    color: "#1E9B8A",
    image: "/images/ecosystem/rusingacademy-training.jpg",
    pitch: {
      en: "A structured curriculum built for public service realities—Path Series™ programs aligned with SLE outcomes.",
      fr: "Un curriculum structuré pensé pour la fonction publique — Path Series™ aligné sur les résultats ELS/SLE.",
    },
    bullets: {
      en: [
        "Path Series™ accelerated learning",
        "SLE-aligned (BBB / CBC / CCC goals)",
        "Crash Courses + Micro-learning (capsules, video, podcast)",
        "Built for workplace bilingual culture",
      ],
      fr: [
        "Apprentissage accéléré Path Series™",
        "Aligné ELS/SLE (objectifs BBB / CBC / CCC)",
        "Crash courses + micro-learning (capsules, vidéo, balado)",
        "Conçu pour une culture de travail bilingue",
      ],
    },
    cta: { en: "Explore RusingÂcademy", fr: "Découvrir RusingÂcademy" },
    link: "/rusingacademy",
  },
  {
    id: "lingueefy",
    name: "Lingueefy",
    color: "#17E2C6",
    image: "/images/ecosystem/lingueefy-coaching.jpg",
    pitch: {
      en: "Find the right coach fast—and practice smarter with Prof Steven AI tools.",
      fr: "Trouvez le bon coach rapidement — et pratiquez mieux avec les outils Prof Steven AI.",
    },
    bullets: {
      en: [
        "Expert SLE coach matching",
        "Prof Steven AI: Voice Practice Sessions",
        "SLE Placement Tests",
        "Oral Exam Simulations",
      ],
      fr: [
        "Jumelage avec coachs experts ELS/SLE",
        "Prof Steven AI : sessions de pratique orale",
        "Tests de classement ELS/SLE",
        "Simulations d'examen oral",
      ],
    },
    cta: { en: "Explore Lingueefy", fr: "Découvrir Lingueefy" },
    link: "/lingueefy",
  },
  {
    id: "barholex",
    name: "Barholex Media",
    color: "#D4A853",
    image: "/images/ecosystem/barholex-studio.jpg",
    pitch: {
      en: "Premium audiovisual production and performance coaching for bilingual executive presence.",
      fr: "Production audiovisuelle premium et coaching de performance pour une présence exécutive bilingue.",
    },
    bullets: {
      en: [
        "Executive presence coaching",
        "Turnkey podcast & video production",
        "Strategic communications & storytelling",
        "AI-assisted content workflows",
      ],
      fr: [
        "Coaching de présence exécutive",
        "Production balado & vidéo clé en main",
        "Communication stratégique & storytelling",
        "Flux de production assistés par IA",
      ],
    },
    cta: { en: "Explore Barholex", fr: "Découvrir Barholex" },
    link: "/barholex-media",
  },
];

export default function EcosystemLanding() {
  const { language, setLanguage } = useLanguage();
  const [theme, setTheme] = useState<Theme>("glass");

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("ecosystem-theme") as Theme | null;
    if (savedTheme && (savedTheme === "glass" || savedTheme === "light")) {
      setTheme(savedTheme);
    }
  }, []);

  // Save theme to localStorage when changed
  const toggleTheme = () => {
    const newTheme = theme === "glass" ? "light" : "glass";
    setTheme(newTheme);
    localStorage.setItem("ecosystem-theme", newTheme);
  };

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "fr" : "en");
  };

  // Animated words for hero title
  const animatedWords = {
    en: ["Excellence", "Success", "Confidence", "Mastery"],
    fr: ["Excellence", "Réussite", "Confiance", "Maîtrise"],
  };
  const [wordIndex, setWordIndex] = useState(0);
  
  // Hero carousel state
  const [carouselIndex, setCarouselIndex] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % animatedWords.en.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);
  
  // Auto-advance carousel every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % heroCarouselImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);
  
  const nextSlide = () => setCarouselIndex((prev) => (prev + 1) % heroCarouselImages.length);
  const prevSlide = () => setCarouselIndex((prev) => (prev - 1 + heroCarouselImages.length) % heroCarouselImages.length);

  const labels = {
    heroTitle: {
      en: "Choose Your Path to Bilingual",
      fr: "Choisissez votre parcours vers le bilinguisme",
    },
    heroTitleAnimated: animatedWords[language][wordIndex],
    heroSub: {
      en: "Built for Canadian public servants: SLE-focused learning, expert coaching, and premium media—so teams perform confidently in both official languages.",
      fr: "Conçu pour la réalité des fonctionnaires canadiens : apprentissage axé ELS/SLE, coaching d'experts et soutien média premium — pour une équipe confiante dans les deux langues officielles.",
    },
    cta1: { en: "Explore Ecosystem", fr: "Explorer l'écosystème" },
    cta2: { en: "Book Consultation", fr: "Réserver une consultation" },
    footerBrand: "Rusinga International Consulting Ltd.",
    footerCopyright: "© 2026 Rusinga International Consulting Ltd. All rights reserved.",
    footerCopyrightFr: "© 2026 Rusinga International Consulting Ltd. Tous droits réservés.",
    ecosystem: { en: "Ecosystem", fr: "Écosystème" },
    legal: { en: "Legal", fr: "Légal" },
    contact: { en: "Contact", fr: "Contact" },
    privacy: { en: "Privacy Policy", fr: "Politique de confidentialité" },
    terms: { en: "Terms of Service", fr: "Conditions d'utilisation" },
    accessibility: { en: "Accessibility", fr: "Accessibilité" },
  };

  // Theme-based styles
  const themeStyles = {
    glass: {
      bg: "bg-[#080a14]",
      text: "text-white",
      textSecondary: "text-white/70",
      surface: "bg-white/5 backdrop-blur-xl border border-white/10",
      surfaceHover: "hover:bg-white/10",
      heroOverlay: "bg-gradient-to-br from-[#080a14]/95 to-[#080a14]/70",
      glow: "opacity-50",
    },
    light: {
      bg: "bg-[#F4F6F9]",
      text: "text-[#1A1F2E]",
      textSecondary: "text-[#5E6A83]",
      surface: "bg-white border border-[#E2E8F0] shadow-lg",
      surfaceHover: "hover:bg-[#F8FAFC]",
      heroOverlay: "bg-gradient-to-br from-white/95 to-white/80",
      glow: "opacity-15",
    },
  };

  const t = themeStyles[theme];

  return (
    <div className={`min-h-screen ${t.bg} ${t.text} transition-colors duration-300 overflow-x-hidden`}>
      {/* Ambient Background Glows */}
      <div
        className={`fixed top-[-20%] left-[-10%] w-[70%] h-[70%] rounded-full pointer-events-none z-0 ${t.glow}`}
        style={{ background: "radial-gradient(circle, #17E2C6, transparent 60%)" }}
      />
      <div
        className={`fixed bottom-[-20%] right-[-10%] w-[70%] h-[70%] rounded-full pointer-events-none z-0 ${t.glow}`}
        style={{ background: "radial-gradient(circle, #8B5CFF, transparent 60%)" }}
      />

      {/* Navbar */}
      <nav className="relative z-10 max-w-[1280px] mx-auto px-6 py-5">
        <div className="flex items-center justify-between">
          {/* Brand */}
          <div className="flex items-center gap-3">
            {/* RusingÂcademy Logo */}
            <RusingAcademyLogo size={45} showText={false} theme={theme} />
            <div>
              <h1 className="text-base font-black tracking-tight">
                Rusinga International Consulting Ltd.
              </h1>
              <p className={`text-xs font-semibold`} style={{ color: "#1E9B8A" }}>
                RusingÂcademy Learning Ecosystem
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-4">
            {/* Language Toggle */}
            <div className={`flex items-center gap-1 p-1 rounded-full ${t.surface}`}>
              <button
                onClick={() => setLanguage("en")}
                className={`px-3 py-2 rounded-full text-sm font-bold transition-all ${
                  language === "en"
                    ? `${theme === "glass" ? "bg-white/10" : "bg-gray-100"} ${t.text}`
                    : t.textSecondary
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage("fr")}
                className={`px-3 py-2 rounded-full text-sm font-bold transition-all ${
                  language === "fr"
                    ? `${theme === "glass" ? "bg-white/10" : "bg-gray-100"} ${t.text}`
                    : t.textSecondary
                }`}
              >
                FR
              </button>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-full ${t.surface} ${t.surfaceHover} transition-all`}
              aria-label="Toggle theme"
            >
              {theme === "glass" ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>

            {/* Nav Buttons */}
            <Link href="/coaches">
              <Button variant="outline" className={`${t.surface} ${t.text} border-0`}>
                {language === "en" ? "Explore" : "Explorer"}
              </Button>
            </Link>
            <Link href="/community">
              <Button variant="outline" className={`${t.surface} ${t.text} border-0`}>
                {language === "en" ? "Join Our Community" : "Rejoindre la communauté"}
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                className="bg-gradient-to-r from-[#FF6A2B] to-[#ff8f5e] text-white border-0 shadow-lg"
                style={{ boxShadow: "0 10px 25px -5px rgba(255, 106, 43, 0.5)" }}
              >
                {language === "en" ? "Contact" : "Contact"}
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 max-w-[1280px] mx-auto px-6 mt-5">
        <div className="relative rounded-3xl overflow-hidden min-h-[560px]">
          {/* Background gradient for Glass/Light theme */}
          <div className={`absolute inset-0 z-0 ${theme === 'glass' ? 'bg-gradient-to-br from-[#0a0e1a] via-[#0f1629] to-[#080a14]' : 'bg-gradient-to-br from-[#F8FAFC] via-white to-[#F1F5F9]'}`} />
          
          {/* Grid Layout: Text Left (6/12) + Image Right (6/12) */}
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 min-h-[560px]">
            {/* Left: Text Content */}
            <motion.div 
              className="flex flex-col justify-center p-8 md:p-12 lg:p-16 order-2 lg:order-1"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black leading-tight mb-6"
              >
                <span
                  style={{
                    background: theme === "glass"
                      ? "linear-gradient(135deg, #ffffff 30%, rgba(255,255,255,0.7) 100%)"
                      : "linear-gradient(135deg, #1A1F2E 30%, #5E6A83 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  {labels.heroTitle[language]}
                </span>
                <br />
                <motion.span
                  key={wordIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="inline-block"
                  style={{
                    background: "linear-gradient(135deg, #FF6A2B 0%, #17E2C6 50%, #8B5CFF 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  {labels.heroTitleAnimated}.
                </motion.span>
              </motion.h2>
              <motion.p 
                className={`text-base md:text-lg leading-relaxed ${t.textSecondary} mb-8 max-w-[500px]`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                {labels.heroSub[language]}
              </motion.p>
              <motion.div 
                className="flex flex-wrap gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <a href="#ecosystem">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-[#FF6A2B] to-[#ff8f5e] text-white border-0 px-8 py-6 text-base font-bold rounded-xl shadow-lg hover:-translate-y-1 transition-transform"
                    style={{ boxShadow: "0 10px 25px -5px rgba(255, 106, 43, 0.5)" }}
                  >
                    {labels.cta1[language]}
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </a>
                <Link href="/contact">
                  <Button
                    size="lg"
                    variant="outline"
                    className={`${t.surface} ${t.text} px-8 py-6 text-base font-bold rounded-xl border-0`}
                  >
                    {labels.cta2[language]}
                  </Button>
                </Link>
              </motion.div>
            </motion.div>

            {/* Right: Hero Image Carousel */}
            <motion.div 
              className="relative order-1 lg:order-2 min-h-[300px] lg:min-h-full overflow-hidden rounded-r-3xl"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            >
              {/* Carousel Images */}
              <AnimatePresence mode="wait">
                <motion.img
                  key={carouselIndex}
                  src={heroCarouselImages[carouselIndex].src}
                  alt={heroCarouselImages[carouselIndex].alt[language]}
                  className="w-full h-full object-cover absolute inset-0"
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.7, ease: "easeInOut" }}
                />
              </AnimatePresence>
              
              {/* Subtle gradient overlay */}
              <div className={`absolute inset-0 ${theme === 'glass' ? 'bg-gradient-to-t lg:bg-gradient-to-l from-[#0a0e1a]/60 to-transparent' : 'bg-gradient-to-t lg:bg-gradient-to-l from-white/40 to-transparent'}`} />
              
              {/* Carousel Navigation */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 z-10">
                <button
                  onClick={prevSlide}
                  className={`p-2 rounded-full ${theme === 'glass' ? 'bg-white/20 hover:bg-white/30' : 'bg-black/20 hover:bg-black/30'} backdrop-blur-sm transition-colors`}
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-5 h-5 text-white" />
                </button>
                
                {/* Dots */}
                <div className="flex gap-2">
                  {heroCarouselImages.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCarouselIndex(idx)}
                      className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                        idx === carouselIndex
                          ? 'bg-white w-6'
                          : theme === 'glass' ? 'bg-white/40 hover:bg-white/60' : 'bg-white/60 hover:bg-white/80'
                      }`}
                      aria-label={`Go to image ${idx + 1}`}
                    />
                  ))}
                </div>
                
                <button
                  onClick={nextSlide}
                  className={`p-2 rounded-full ${theme === 'glass' ? 'bg-white/20 hover:bg-white/30' : 'bg-black/20 hover:bg-black/30'} backdrop-blur-sm transition-colors`}
                  aria-label="Next image"
                >
                  <ChevronRight className="w-5 h-5 text-white" />
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Ecosystem Cards */}
      <section id="ecosystem" className="relative z-10 max-w-[1280px] mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {brands.map((brand, index) => (
            <motion.div
              key={brand.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className={`group relative flex flex-col rounded-3xl overflow-hidden ${t.surface}`}
              style={{ boxShadow: theme === "glass" ? "0 20px 40px rgba(0,0,0,0.4)" : "0 10px 30px rgba(0,0,0,0.08)" }}
            >
              {/* Top Color Line */}
              <div
                className="absolute top-0 left-0 right-0 h-1"
                style={{ background: brand.color }}
              />

              {/* Card Header Image */}
              <div className="relative h-48 overflow-hidden">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                  style={{ backgroundImage: `url('${brand.image}')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute bottom-4 left-4 z-10">
                  <span
                    className="px-4 py-2 rounded-lg text-white font-black text-sm tracking-wide shadow-lg"
                    style={{
                      background: brand.color,
                      boxShadow: `0 10px 20px -5px ${brand.color}`,
                    }}
                  >
                    {brand.name}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="flex-1 p-8 flex flex-col gap-6">
                {/* Brand Logo */}
                <div className="flex items-center gap-2">
                  {brand.id === "rusingacademy" && <RusingAcademyLogo size={50} showText={false} theme={theme} />}
                  {brand.id === "lingueefy" && <LingeefyLogo size={50} showText={false} theme={theme} />}
                  {brand.id === "barholex" && <BarholexLogo size={50} showText={false} theme={theme} />}
                  <h3 
                    className="text-2xl font-black"
                    style={{
                      background: `linear-gradient(135deg, ${brand.color} 0%, ${brand.color}dd 100%)`,
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    {brand.name}
                  </h3>
                </div>
                <p className={`${t.textSecondary} text-sm leading-relaxed`}>
                  {brand.pitch[language]}
                </p>

                {/* Features List */}
                <ul className="flex flex-col gap-4">
                  {brand.bullets[language].map((bullet, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span
                        className="flex items-center justify-center w-6 h-6 rounded-full flex-shrink-0"
                        style={{
                          background: theme === "glass" ? "rgba(255,255,255,0.1)" : "#F8FAFC",
                          color: brand.color,
                        }}
                      >
                        <Check className="w-4 h-4" />
                      </span>
                      <span className="font-medium text-sm">{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Card Footer CTA */}
              <div className="p-8 pt-0">
                {brand.link.startsWith("http") ? (
                  <a href={brand.link} target="_blank" rel="noopener noreferrer" className="block">
                    <Button
                      className="w-full py-4 rounded-xl font-extrabold transition-all"
                      style={{
                        background: theme === "glass" ? "rgba(255,255,255,0.1)" : "#F8FAFC",
                        color: brand.color,
                        border: `1px solid ${brand.color}`,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = brand.color;
                        e.currentTarget.style.color = "white";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = theme === "glass" ? "rgba(255,255,255,0.1)" : "#F8FAFC";
                        e.currentTarget.style.color = brand.color;
                      }}
                    >
                      {brand.cta[language]}
                    </Button>
                  </a>
                ) : (
                  <Link href={brand.link}>
                    <Button
                      className="w-full py-4 rounded-xl font-extrabold transition-all"
                      style={{
                        background: theme === "glass" ? "rgba(255,255,255,0.1)" : "#F8FAFC",
                        color: brand.color,
                        border: `1px solid ${brand.color}`,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = brand.color;
                        e.currentTarget.style.color = "white";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = theme === "glass" ? "rgba(255,255,255,0.1)" : "#F8FAFC";
                        e.currentTarget.style.color = brand.color;
                      }}
                    >
                      {brand.cta[language]}
                    </Button>
                  </Link>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative z-10 max-w-[1280px] mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h3 className="text-3xl md:text-4xl font-black mb-4">
            {language === "en" ? "What Our Clients Say" : "Ce que disent nos clients"}
          </h3>
          <p className={`${t.textSecondary} max-w-2xl mx-auto`}>
            {language === "en" 
              ? "Trusted by Canadian public servants and organizations across the country"
              : "Reconnu par les fonctionnaires et organisations canadiennes à travers le pays"}
          </p>
        </motion.div>

        {/* Scrolling Testimonials Carousel */}
        <div className="relative overflow-hidden">
          <motion.div
            className="flex gap-6"
            animate={{ x: ["-0%", "-50%"] }}
            transition={{ 
              x: { repeat: Infinity, repeatType: "loop", duration: 30, ease: "linear" }
            }}
          >
            {/* Duplicate testimonials for seamless loop */}
            {[...Array(2)].map((_, setIndex) => (
              <div key={setIndex} className="flex gap-6 flex-shrink-0">
                {[
                  {
                    quote: {
                      en: "RusingÂcademy's Path Series™ helped our team achieve their SLE goals in record time. The structured approach made all the difference.",
                      fr: "Le Path Series™ de RusingÂcademy a aidé notre équipe à atteindre ses objectifs ELS en un temps record. L'approche structurée a fait toute la différence."
                    },
                    author: "Michael Anderson",
                    role: { en: "Director, HR Services", fr: "Directeur, Services RH" },
                    org: "Treasury Board Secretariat",
                    color: "#1E9B8A",
                    image: "/images/testimonials/michael.jpg"
                  },
                  {
                    quote: {
                      en: "Lingueefy's AI-powered coaching sessions are incredibly effective. Prof Steven AI provides personalized feedback that accelerates learning.",
                      fr: "Les séances de coaching IA de Lingueefy sont incroyablement efficaces. Prof Steven AI fournit des commentaires personnalisés qui accélèrent l'apprentissage."
                    },
                    author: "Sarah Mitchell",
                    role: { en: "Senior Policy Analyst", fr: "Analyste principale des politiques" },
                    org: "Global Affairs Canada",
                    color: "#17E2C6",
                    image: "/images/testimonials/sarah.jpg"
                  },
                  {
                    quote: {
                      en: "Barholex Media transformed our internal communications with professional podcast production. Our engagement metrics have never been higher.",
                      fr: "Barholex Media a transformé nos communications internes avec une production de balados professionnelle. Nos métriques d'engagement n'ont jamais été aussi élevées."
                    },
                    author: "David Thompson",
                    role: { en: "Communications Manager", fr: "Gestionnaire des communications" },
                    org: "Health Canada",
                    color: "#D4A853",
                    image: "/images/testimonials/david.jpg"
                  },
                  {
                    quote: {
                      en: "The bilingual training program exceeded our expectations. Our team's confidence in both official languages has improved dramatically.",
                      fr: "Le programme de formation bilingue a dépassé nos attentes. La confiance de notre équipe dans les deux langues officielles s'est améliorée de façon spectaculaire."
                    },
                    author: "Jennifer Williams",
                    role: { en: "Deputy Director", fr: "Directrice adjointe" },
                    org: "Employment and Social Development Canada",
                    color: "#1E9B8A",
                    image: "/images/testimonials/jennifer.jpg"
                  },
                  {
                    quote: {
                      en: "Prof Steven AI helped me pass my CBC oral exam on the first try. The practice simulations were incredibly realistic and helpful.",
                      fr: "Prof Steven AI m'a aidé à réussir mon examen oral CBC du premier coup. Les simulations de pratique étaient incroyablement réalistes et utiles."
                    },
                    author: "Robert Chen",
                    role: { en: "Program Officer", fr: "Agent de programme" },
                    org: "Canada Revenue Agency",
                    color: "#17E2C6",
                    image: "/images/testimonials/robert.jpg"
                  },
                  {
                    quote: {
                      en: "The executive presence coaching from Barholex Media gave me the confidence to lead bilingual town halls. Highly recommended!",
                      fr: "Le coaching de présence exécutive de Barholex Media m'a donné la confiance pour diriger des assemblées bilingues. Fortement recommandé!"
                    },
                    author: "Amanda Foster",
                    role: { en: "Executive Director", fr: "Directrice exécutive" },
                    org: "Innovation, Science and Economic Development",
                    color: "#D4A853",
                    image: "/images/testimonials/amanda.jpg"
                  }
                ].map((testimonial, index) => (
                  <div
                    key={`${setIndex}-${index}`}
                    className={`relative p-6 rounded-2xl ${t.surface} w-[350px] flex-shrink-0`}
                    style={{ boxShadow: theme === "glass" ? "0 15px 30px rgba(0,0,0,0.3)" : "0 8px 20px rgba(0,0,0,0.06)" }}
                  >
                    {/* Quote Mark */}
                    <div 
                      className="absolute top-3 right-3 text-5xl font-serif opacity-20"
                      style={{ color: testimonial.color }}
                    >
                      "
                    </div>
                    
                    {/* Quote */}
                    <p className={`${t.textSecondary} text-sm leading-relaxed mb-5 relative z-10 line-clamp-4`}>
                      "{testimonial.quote[language]}"
                    </p>
                    
                    {/* Author */}
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-sm"
                        style={{ background: `linear-gradient(135deg, ${testimonial.color}, ${testimonial.color}dd)` }}
                      >
                        {testimonial.author.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="font-bold text-sm">{testimonial.author}</p>
                        <p className={`${t.textSecondary} text-xs`}>
                          {testimonial.role[language]}
                        </p>
                        <p className={`${t.textSecondary} text-xs opacity-70`}>
                          {testimonial.org}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </motion.div>
          
          {/* Gradient overlays for fade effect */}
          <div className={`absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r ${theme === "glass" ? "from-[#080a14]" : "from-[#F4F6F9]"} to-transparent z-10 pointer-events-none`} />
          <div className={`absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l ${theme === "glass" ? "from-[#080a14]" : "from-[#F4F6F9]"} to-transparent z-10 pointer-events-none`} />
        </div>
      </section>

      {/* Prof Steven AI Section */}
      <section className="relative z-10 max-w-[1280px] mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className={`relative overflow-hidden rounded-3xl ${t.surface}`}
          style={{ boxShadow: theme === "glass" ? "0 20px 40px rgba(0,0,0,0.4)" : "0 10px 30px rgba(0,0,0,0.08)" }}
        >
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#17E2C6]/20 via-transparent to-[#8B5CFF]/20" />
          
          <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 p-8 md:p-12">
            {/* Left - Prof Steven Info */}
            <div className="flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-4">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#17E2C6]/20 text-[#17E2C6]">
                  AI-Powered
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#8B5CFF]/20 text-[#8B5CFF]">
                  24/7 Available
                </span>
              </div>
              
              <h3 className="text-3xl md:text-4xl font-black mb-4">
                <span style={{ color: "#17E2C6" }}>Prof Steven</span>{" "}
                <span className={t.text}>AI</span>
              </h3>
              
              <p className={`${t.textSecondary} text-lg mb-6 leading-relaxed`}>
                {language === "en" 
                  ? "Your personal AI language coach, available anytime. Practice speaking, prepare for SLE exams, and build confidence with realistic simulations."
                  : "Votre coach linguistique IA personnel, disponible à tout moment. Pratiquez l'oral, préparez vos examens ELS et gagnez en confiance avec des simulations réalistes."}
              </p>
              
              {/* Features */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {[
                  { icon: "🎙️", label: { en: "Voice Practice Sessions", fr: "Sessions de pratique orale" } },
                  { icon: "📊", label: { en: "SLE Placement Tests", fr: "Tests de classement ELS" } },
                  { icon: "🎯", label: { en: "Oral Exam Simulations", fr: "Simulations d'examen oral" } },
                  { icon: "💬", label: { en: "Instant Feedback", fr: "Rétroaction instantanée" } },
                ].map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <span className="text-2xl">{feature.icon}</span>
                    <span className="font-medium text-sm">{feature.label[language]}</span>
                  </div>
                ))}
              </div>
              
              <Link href="/lingueefy">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-[#17E2C6] to-[#0d9488] text-white border-0 px-8 py-6 text-base font-bold rounded-xl shadow-lg hover:-translate-y-1 transition-transform"
                  style={{ boxShadow: "0 10px 25px -5px rgba(23, 226, 198, 0.5)" }}
                >
                  {language === "en" ? "Try Prof Steven AI" : "Essayer Prof Steven AI"}
                  <MessageCircle className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
            
            {/* Right - Prof Steven Avatar/Visual */}
            <div className="relative flex items-center justify-center">
              <motion.div
                className="relative"
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              >
                {/* Glowing circle background */}
                <div 
                  className="absolute inset-0 rounded-full blur-3xl opacity-30"
                  style={{ background: "radial-gradient(circle, #17E2C6, #8B5CFF)" }}
                />
                
                {/* Avatar container */}
                <div 
                  className={`relative w-64 h-64 md:w-80 md:h-80 rounded-full ${t.surface} flex items-center justify-center`}
                  style={{ 
                    boxShadow: theme === "glass" 
                      ? "0 0 60px rgba(23, 226, 198, 0.3), inset 0 0 30px rgba(23, 226, 198, 0.1)" 
                      : "0 20px 40px rgba(0,0,0,0.1)" 
                  }}
                >
                  {/* Prof Steven Image or Placeholder */}
                  <div className="relative w-48 h-48 md:w-60 md:h-60 rounded-full overflow-hidden">
                    <img 
                      src="/images/coaches/steven.jpg" 
                      alt="Prof Steven AI"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                    <div className="hidden w-full h-full bg-gradient-to-br from-[#17E2C6] to-[#0d9488] flex items-center justify-center">
                      <span className="text-6xl md:text-7xl">🤖</span>
                    </div>
                  </div>
                  
                  {/* Animated ring */}
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-[#17E2C6]/30"
                    animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.2, 0.5] }}
                    transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                  />
                </div>
                
                {/* Floating chat bubbles */}
                <motion.div
                  className="absolute -top-4 -right-4 px-4 py-2 rounded-2xl bg-[#17E2C6] text-white text-sm font-medium shadow-lg"
                  animate={{ y: [0, -5, 0], rotate: [0, 2, 0] }}
                  transition={{ repeat: Infinity, duration: 3, ease: "easeInOut", delay: 0.5 }}
                >
                  {language === "en" ? "Hello! Ready to practice?" : "Bonjour! Prêt à pratiquer?"}
                </motion.div>
                
                <motion.div
                  className="absolute -bottom-2 -left-4 px-4 py-2 rounded-2xl bg-[#8B5CFF] text-white text-sm font-medium shadow-lg"
                  animate={{ y: [0, 5, 0], rotate: [0, -2, 0] }}
                  transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut", delay: 1 }}
                >
                  {language === "en" ? "Let's ace your SLE!" : "Réussissons votre ELS!"}
                </motion.div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className={`relative z-10 border-t ${theme === "glass" ? "border-white/10" : "border-[#E2E8F0]"} mt-20`}>
        {/* Quick Contact Form */}
        <div className="max-w-[1280px] mx-auto px-6 py-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className={`relative p-8 md:p-12 rounded-3xl mb-16 ${t.surface}`}
            style={{ boxShadow: theme === "glass" ? "0 20px 40px rgba(0,0,0,0.3)" : "0 10px 30px rgba(0,0,0,0.08)" }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              {/* Left - Text */}
              <div>
                <h3 className="text-2xl md:text-3xl font-black mb-4">
                  {language === "en" ? "Ready to Get Started?" : "Prêt à commencer?"}
                </h3>
                <p className={`${t.textSecondary} mb-6`}>
                  {language === "en" 
                    ? "Tell us about your bilingual training needs and we'll connect you with the right solution."
                    : "Parlez-nous de vos besoins en formation bilingue et nous vous mettrons en contact avec la bonne solution."}
                </p>
                <div className="flex flex-wrap gap-3">
                  <span className="px-3 py-1 rounded-full text-xs font-bold" style={{ background: "rgba(255,106,43,0.2)", color: "#FF6A2B" }}>
                    RusingÂcademy
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-bold" style={{ background: "rgba(23,226,198,0.2)", color: "#17E2C6" }}>
                    Lingueefy
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-bold" style={{ background: "rgba(139,92,255,0.2)", color: "#8B5CFF" }}>
                    Barholex Media
                  </span>
                </div>
              </div>
              
              {/* Right - Form */}
              <form 
                className="space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const name = formData.get('name');
                  const email = formData.get('email');
                  const message = formData.get('message');
                  window.location.href = `mailto:info@rusinga.com?subject=Ecosystem Inquiry from ${name}&body=${message}%0A%0AFrom: ${name}%0AEmail: ${email}`;
                }}
              >
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="name"
                    placeholder={language === "en" ? "Your name" : "Votre nom"}
                    required
                    className={`w-full px-4 py-3 rounded-xl text-sm font-medium ${theme === "glass" ? "bg-white/10 text-white placeholder:text-white/50 border border-white/10" : "bg-gray-100 text-gray-900 placeholder:text-gray-500 border border-gray-200"} focus:outline-none focus:ring-2 focus:ring-[#17E2C6]`}
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder={language === "en" ? "Your email" : "Votre courriel"}
                    required
                    className={`w-full px-4 py-3 rounded-xl text-sm font-medium ${theme === "glass" ? "bg-white/10 text-white placeholder:text-white/50 border border-white/10" : "bg-gray-100 text-gray-900 placeholder:text-gray-500 border border-gray-200"} focus:outline-none focus:ring-2 focus:ring-[#17E2C6]`}
                  />
                </div>
                <textarea
                  name="message"
                  rows={3}
                  placeholder={language === "en" ? "Tell us about your needs..." : "Parlez-nous de vos besoins..."}
                  required
                  className={`w-full px-4 py-3 rounded-xl text-sm font-medium resize-none ${theme === "glass" ? "bg-white/10 text-white placeholder:text-white/50 border border-white/10" : "bg-gray-100 text-gray-900 placeholder:text-gray-500 border border-gray-200"} focus:outline-none focus:ring-2 focus:ring-[#17E2C6]`}
                />
                <Button
                  type="submit"
                  className="w-full py-4 rounded-xl font-bold text-white"
                  style={{ 
                    background: "linear-gradient(135deg, #FF6A2B, #17E2C6, #8B5CFF)",
                    boxShadow: "0 10px 25px -5px rgba(23, 226, 198, 0.4)"
                  }}
                >
                  {language === "en" ? "Send Message" : "Envoyer le message"}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </form>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            {/* Brand Column */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-10 h-10 rounded-lg"
                  style={{
                    background: "linear-gradient(135deg, #FF6A2B, #17E2C6, #8B5CFF)",
                  }}
                />
                <span className="font-black">{labels.footerBrand}</span>
              </div>
              <p className={`${t.textSecondary} text-sm max-w-md`}>
                {language === "en"
                  ? "Empowering Canadian public servants with bilingual excellence through innovative learning, expert coaching, and premium media production."
                  : "Permettre aux fonctionnaires canadiens d'atteindre l'excellence bilingue grâce à un apprentissage innovant, un coaching d'experts et une production média premium."}
              </p>
            </div>

            {/* Ecosystem Links */}
            <div>
              <h4 className="font-bold mb-4">{labels.ecosystem[language]}</h4>
              <ul className={`space-y-2 ${t.textSecondary} text-sm`}>
                <li>
                  <Link href="/rusingacademy" className="hover:text-[#FF6A2B] transition-colors">
                    RusingÂcademy
                  </Link>
                </li>
                <li>
                  <Link href="/lingueefy" className="hover:text-[#17E2C6] transition-colors">
                    Lingueefy
                  </Link>
                </li>
                <li>
                  <Link href="/barholex-media" className="hover:text-[#8B5CFF] transition-colors">
                    Barholex Media
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal Links */}
            <div>
              <h4 className="font-bold mb-4">{labels.legal[language]}</h4>
              <ul className={`space-y-2 ${t.textSecondary} text-sm`}>
                <li>
                  <Link href="/privacy" className="hover:opacity-80 transition-opacity">
                    {labels.privacy[language]}
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:opacity-80 transition-opacity">
                    {labels.terms[language]}
                  </Link>
                </li>
                <li>
                  <Link href="/accessibility" className="hover:opacity-80 transition-opacity">
                    {labels.accessibility[language]}
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:opacity-80 transition-opacity">
                    {labels.contact[language]}
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Copyright */}
          <div className={`mt-12 pt-8 border-t ${theme === "glass" ? "border-white/10" : "border-[#E2E8F0]"} text-center ${t.textSecondary} text-sm`}>
            {language === "en" ? labels.footerCopyright : labels.footerCopyrightFr}
          </div>
        </div>
      </footer>
    </div>
  );
}
