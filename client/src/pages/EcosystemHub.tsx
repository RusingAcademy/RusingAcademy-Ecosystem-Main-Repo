import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import {
  ArrowRight,
  GraduationCap,
  MessageSquare,
  Clapperboard,
  Users,
  Building2,
  Sparkles,
  Globe,
  Award,
  CheckCircle2,
  Zap,
  Target,
  TrendingUp,
  Shield,
  Heart,
} from "lucide-react";

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 }
  }
};

export default function EcosystemHub() {
  const { language } = useLanguage();

  const PLATFORMS = [
    {
      id: "lingueefy",
      nameEn: "Lingueefy",
      nameFr: "Lingueefy",
      taglineEn: "B2C Language Coaching",
      taglineFr: "Coaching linguistique B2C",
      descEn: "Connect with certified SLE coaches for personalized bilingual training. Practice 24/7 with Prof Steven AI. Achieve your BBB, CBC, or CCC goals faster.",
      descFr: "Connectez-vous avec des coachs ELS certifiés pour une formation bilingue personnalisée. Pratiquez 24/7 avec Prof Steven IA. Atteignez vos objectifs BBB, CBC ou CCC plus rapidement.",
      icon: MessageSquare,
      color: "#009688",
      gradient: "from-teal-500 to-teal-600",
      bgGradient: "from-teal-50 to-teal-100/50",
      link: "/",
      featuresEn: [
        "1-on-1 coaching with SLE experts",
        "AI-powered practice partner",
        "SLE exam simulations",
        "Progress tracking dashboard",
      ],
      featuresFr: [
        "Coaching 1-à-1 avec experts ELS",
        "Partenaire de pratique IA",
        "Simulations d'examens ELS",
        "Tableau de bord de progression",
      ],
      statsEn: "5,000+ learners trained",
      statsFr: "5 000+ apprenants formés",
    },
    {
      id: "rusingacademy",
      nameEn: "RusingAcademy",
      nameFr: "RusingAcademy",
      taglineEn: "B2B/B2G Training Solutions",
      taglineFr: "Solutions de formation B2B/B2G",
      descEn: "Structured bilingual training programs for government and enterprise. SLE preparation, corporate language solutions, and measurable results at scale.",
      descFr: "Programmes de formation bilingue structurés pour le gouvernement et les entreprises. Préparation ELS, solutions linguistiques corporatives et résultats mesurables à grande échelle.",
      icon: GraduationCap,
      color: "#E07B39",
      gradient: "from-orange-500 to-orange-600",
      bgGradient: "from-orange-50 to-orange-100/50",
      link: "/rusingacademy",
      featuresEn: [
        "Government-compliant programs",
        "Team progress dashboards",
        "Custom curriculum design",
        "On-site training options",
      ],
      featuresFr: [
        "Programmes conformes au gouvernement",
        "Tableaux de bord d'équipe",
        "Conception de programmes personnalisés",
        "Options de formation sur site",
      ],
      statsEn: "50+ organizations served",
      statsFr: "50+ organisations servies",
    },
    {
      id: "barholex",
      nameEn: "Barholex Media",
      nameFr: "Barholex Media",
      taglineEn: "Creative Production & EdTech",
      taglineFr: "Production créative & EdTech",
      descEn: "Full-service creative agency specializing in EdTech solutions, multimedia production, and digital innovation for language learning organizations.",
      descFr: "Agence créative à service complet spécialisée dans les solutions EdTech, la production multimédia et l'innovation numérique pour les organisations d'apprentissage des langues.",
      icon: Clapperboard,
      color: "#D4AF37",
      gradient: "from-amber-500 to-amber-600",
      bgGradient: "from-amber-50 to-amber-100/50",
      link: "/barholex",
      featuresEn: [
        "Video & audio production",
        "Web & app development",
        "Brand identity design",
        "AI-powered solutions",
      ],
      featuresFr: [
        "Production vidéo et audio",
        "Développement web et apps",
        "Design d'identité de marque",
        "Solutions alimentées par l'IA",
      ],
      statsEn: "200+ projects delivered",
      statsFr: "200+ projets livrés",
    },
  ];

  const VALUES = [
    {
      icon: Target,
      titleEn: "Mission-Driven",
      titleFr: "Axé sur la mission",
      descEn: "Empowering bilingualism across Canada through innovative solutions",
      descFr: "Favoriser le bilinguisme à travers le Canada grâce à des solutions innovantes",
    },
    {
      icon: Shield,
      titleEn: "Government Expertise",
      titleFr: "Expertise gouvernementale",
      descEn: "Deep understanding of SLE requirements and public sector needs",
      descFr: "Compréhension approfondie des exigences ELS et des besoins du secteur public",
    },
    {
      icon: Sparkles,
      titleEn: "Innovation First",
      titleFr: "Innovation d'abord",
      descEn: "Leveraging AI and technology to accelerate language learning",
      descFr: "Exploiter l'IA et la technologie pour accélérer l'apprentissage des langues",
    },
    {
      icon: Heart,
      titleEn: "Client Success",
      titleFr: "Succès client",
      descEn: "94% success rate with personalized support at every step",
      descFr: "Taux de réussite de 94% avec un soutien personnalisé à chaque étape",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
      <Header />
      
      <main id="main-content">
        {/* Hero Section */}
        <section className="pt-24 pb-20 px-4 relative overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl" />
          <div className="absolute top-40 right-20 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl" />
          
          <div className="container mx-auto relative z-10">
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="max-w-4xl mx-auto text-center"
            >
              <motion.div variants={fadeInUp}>
                <span className="inline-flex items-center gap-2 mb-6 px-5 py-2.5 rounded-full bg-gray-900 text-white text-sm font-medium">
                  <Globe className="w-4 h-4" />
                  Rusinga International Consulting Ltd.
                </span>
              </motion.div>
              
              <motion.h1 
                variants={fadeInUp}
                className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-gray-900"
              >
                {language === "en" ? "One Ecosystem." : "Un écosystème."}{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 via-orange-500 to-amber-500">
                  {language === "en" ? "Three Platforms." : "Trois plateformes."}
                </span>
              </motion.h1>
              
              <motion.p 
                variants={fadeInUp}
                className="text-lg md:text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed"
              >
                {language === "en"
                  ? "From individual coaching to enterprise training to creative production — we provide comprehensive bilingual solutions for every need."
                  : "Du coaching individuel à la formation en entreprise en passant par la production créative — nous offrons des solutions bilingues complètes pour chaque besoin."
                }
              </motion.p>
              
              <motion.div variants={fadeInUp} className="flex flex-wrap justify-center gap-4">
                <Link href="/contact">
                  <Button size="lg" className="bg-gray-900 hover:bg-gray-800 text-white gap-2 px-8 h-12 text-base rounded-full">
                    {language === "en" ? "Contact Us" : "Nous contacter"}
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
                <a href="#platforms">
                  <Button size="lg" variant="outline" className="gap-2 px-8 h-12 text-base border-2 rounded-full">
                    {language === "en" ? "Explore Platforms" : "Explorer les plateformes"}
                  </Button>
                </a>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Platforms Section */}
        <section id="platforms" className="py-20 px-4">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {language === "en" ? "Our Platforms" : "Nos plateformes"}
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                {language === "en"
                  ? "Each platform is designed to serve specific needs while sharing our commitment to excellence"
                  : "Chaque plateforme est conçue pour répondre à des besoins spécifiques tout en partageant notre engagement envers l'excellence"
                }
              </p>
            </div>

            <div className="space-y-8 max-w-6xl mx-auto">
              {PLATFORMS.map((platform, index) => (
                <motion.div
                  key={platform.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative rounded-3xl overflow-hidden bg-gradient-to-br ${platform.bgGradient} border border-gray-200/50`}
                >
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8 md:p-12">
                    <div>
                      <div className="flex items-center gap-4 mb-6">
                        <div 
                          className="w-14 h-14 rounded-2xl flex items-center justify-center text-white"
                          style={{ backgroundColor: platform.color }}
                        >
                          <platform.icon className="w-7 h-7" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-gray-900">
                            {language === "en" ? platform.nameEn : platform.nameFr}
                          </h3>
                          <p className="text-sm font-medium" style={{ color: platform.color }}>
                            {language === "en" ? platform.taglineEn : platform.taglineFr}
                          </p>
                        </div>
                      </div>
                      
                      <p className="text-gray-600 mb-6 leading-relaxed">
                        {language === "en" ? platform.descEn : platform.descFr}
                      </p>
                      
                      <div className="flex items-center gap-2 mb-6 text-sm font-medium text-gray-500">
                        <Award className="w-4 h-4" style={{ color: platform.color }} />
                        {language === "en" ? platform.statsEn : platform.statsFr}
                      </div>
                      
                      <Link href={platform.link}>
                        <Button 
                          className="rounded-full px-6 text-white"
                          style={{ backgroundColor: platform.color }}
                        >
                          {language === "en" ? "Explore" : "Explorer"} {platform.nameEn}
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                    
                    <div className="flex items-center">
                      <ul className="space-y-4 w-full">
                        {(language === "en" ? platform.featuresEn : platform.featuresFr).map((feature, i) => (
                          <li key={i} className="flex items-center gap-3 text-gray-700">
                            <div 
                              className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                              style={{ backgroundColor: `${platform.color}20` }}
                            >
                              <CheckCircle2 className="w-4 h-4" style={{ color: platform.color }} />
                            </div>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 px-4 bg-gray-900">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                {language === "en" ? "What Unites Us" : "Ce qui nous unit"}
              </h2>
              <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                {language === "en"
                  ? "Shared values that drive excellence across all our platforms"
                  : "Des valeurs partagées qui favorisent l'excellence sur toutes nos plateformes"
                }
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {VALUES.map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 text-center"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-orange-500 flex items-center justify-center mx-auto mb-4">
                    <value.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-white mb-2">
                    {language === "en" ? value.titleEn : value.titleFr}
                  </h3>
                  <p className="text-sm text-gray-400">
                    {language === "en" ? value.descEn : value.descFr}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Integration Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                {language === "en" ? "Seamless Integration" : "Intégration transparente"}
              </h2>
              <p className="text-lg text-gray-600 mb-10">
                {language === "en"
                  ? "Our platforms work together to provide a complete solution. Start with individual coaching, scale to team training, and get custom content — all with a single account."
                  : "Nos plateformes travaillent ensemble pour fournir une solution complète. Commencez par le coaching individuel, passez à la formation d'équipe et obtenez du contenu personnalisé — le tout avec un seul compte."
                }
              </p>
              
              <div className="flex flex-wrap justify-center gap-4 mb-10">
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-teal-100 text-teal-700">
                  <CheckCircle2 className="w-4 h-4" />
                  {language === "en" ? "Single Sign-On" : "Connexion unique"}
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 text-orange-700">
                  <CheckCircle2 className="w-4 h-4" />
                  {language === "en" ? "Unified Dashboard" : "Tableau de bord unifié"}
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 text-amber-700">
                  <CheckCircle2 className="w-4 h-4" />
                  {language === "en" ? "Cross-Platform Progress" : "Progression multiplateforme"}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 bg-gradient-to-r from-teal-500 via-orange-500 to-amber-500">
          <div className="container mx-auto">
            <div className="max-w-3xl mx-auto text-center text-white">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                {language === "en" ? "Ready to Get Started?" : "Prêt à commencer?"}
              </h2>
              <p className="text-xl text-white/90 mb-10">
                {language === "en"
                  ? "Whether you're an individual learner, a government department, or need creative services — we have a solution for you."
                  : "Que vous soyez un apprenant individuel, un ministère ou que vous ayez besoin de services créatifs — nous avons une solution pour vous."
                }
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/contact">
                  <Button 
                    size="lg" 
                    className="rounded-full px-8 h-14 text-lg font-semibold bg-white text-gray-900 hover:bg-gray-100"
                  >
                    {language === "en" ? "Contact Sales" : "Contacter les ventes"}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/">
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="rounded-full px-8 h-14 text-lg font-semibold border-2 border-white text-white hover:bg-white/10"
                  >
                    {language === "en" ? "Start Learning" : "Commencer à apprendre"}
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
