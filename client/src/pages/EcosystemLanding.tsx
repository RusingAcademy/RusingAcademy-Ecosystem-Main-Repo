import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { Sun, Moon, Check, ArrowRight } from "lucide-react";

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
    color: "#FF6A2B",
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
    cta: { en: "View Curriculum", fr: "Voir le curriculum" },
    link: "https://rusingacademy.com",
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
    cta: { en: "Find a Coach", fr: "Trouver un coach" },
    link: "/coaches",
  },
  {
    id: "barholex",
    name: "Barholex Media",
    color: "#8B5CFF",
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
    cta: { en: "Request Consultation", fr: "Demander une consultation" },
    link: "https://barholexmedia.com",
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

  const labels = {
    heroTitle: {
      en: "Choose Your Path to Bilingual Excellence.",
      fr: "Choisissez votre parcours vers l'excellence bilingue.",
    },
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
            <div
              className="w-12 h-12 rounded-xl shadow-lg"
              style={{
                background: "linear-gradient(135deg, #FF6A2B, #17E2C6, #8B5CFF)",
              }}
            />
            <div>
              <h1 className="text-base font-black tracking-tight">
                Rusinga International Consulting Ltd.
              </h1>
              <p className={`text-xs ${t.textSecondary} font-medium`}>
                {language === "en" ? "Bilingual Excellence" : "Excellence bilingue"}
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
        <div className="relative rounded-3xl overflow-hidden min-h-[560px] flex items-center">
          {/* Background Image */}
          <div
            className="absolute inset-0 z-0 bg-cover bg-center"
            style={{ backgroundImage: "url('/images/ecosystem/hero-team.jpg')" }}
          />
          {/* Overlay */}
          <div className={`absolute inset-0 z-10 ${t.heroOverlay}`} />

          {/* Content */}
          <div className="relative z-20 max-w-[700px] p-10 md:p-16">
            <h2
              className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight mb-6"
              style={{
                background: theme === "glass"
                  ? "linear-gradient(135deg, #ffffff 30%, rgba(255,255,255,0.7) 100%)"
                  : "linear-gradient(135deg, #1A1F2E 30%, #5E6A83 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {labels.heroTitle[language]}
            </h2>
            <p className={`text-lg leading-relaxed ${t.textSecondary} mb-10 max-w-[600px]`}>
              {labels.heroSub[language]}
            </p>
            <div className="flex flex-wrap gap-4">
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
            </div>
          </div>
        </div>
      </section>

      {/* Ecosystem Cards */}
      <section id="ecosystem" className="relative z-10 max-w-[1280px] mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {brands.map((brand) => (
            <div
              key={brand.id}
              className={`group relative flex flex-col rounded-3xl overflow-hidden ${t.surface} transition-all duration-300 hover:-translate-y-2`}
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
                <h3 className="text-2xl font-black">{brand.name}</h3>
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
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className={`relative z-10 border-t ${theme === "glass" ? "border-white/10" : "border-[#E2E8F0]"} mt-20`}>
        <div className="max-w-[1280px] mx-auto px-6 py-16">
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
                  <a href="https://rusingacademy.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#FF6A2B] transition-colors">
                    RusingÂcademy
                  </a>
                </li>
                <li>
                  <Link href="/coaches" className="hover:text-[#17E2C6] transition-colors">
                    Lingueefy
                  </Link>
                </li>
                <li>
                  <a href="https://barholexmedia.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#8B5CFF] transition-colors">
                    Barholex Media
                  </a>
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
