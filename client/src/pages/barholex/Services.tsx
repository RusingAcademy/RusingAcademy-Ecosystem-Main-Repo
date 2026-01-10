import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  Video,
  Mic,
  PenTool,
  Monitor,
  Globe,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Zap,
  Users,
  Clock,
  Award,
} from "lucide-react";

export default function BarholexServices() {
  const { language } = useLanguage();

  const SERVICES = [
    {
      icon: Video,
      titleEn: "Video Production",
      titleFr: "Production vidéo",
      descEn: "From concept to final cut, we create compelling video content that engages and educates.",
      descFr: "Du concept au montage final, nous créons du contenu vidéo captivant qui engage et éduque.",
      featuresEn: [
        "Corporate videos & documentaries",
        "Training & educational content",
        "Promotional & marketing videos",
        "Animation & motion graphics",
        "Live streaming & webinars",
      ],
      featuresFr: [
        "Vidéos corporatives et documentaires",
        "Contenu de formation et éducatif",
        "Vidéos promotionnelles et marketing",
        "Animation et motion graphics",
        "Diffusion en direct et webinaires",
      ],
      color: "#E07B39",
    },
    {
      icon: Mic,
      titleEn: "Audio Production",
      titleFr: "Production audio",
      descEn: "Professional audio services for podcasts, voiceovers, and multilingual content.",
      descFr: "Services audio professionnels pour podcasts, voix hors champ et contenu multilingue.",
      featuresEn: [
        "Podcast production & editing",
        "Professional voiceovers",
        "Sound design & mixing",
        "Multilingual dubbing",
        "Music composition",
      ],
      featuresFr: [
        "Production et montage de podcasts",
        "Voix hors champ professionnelles",
        "Conception sonore et mixage",
        "Doublage multilingue",
        "Composition musicale",
      ],
      color: "#2DD4BF",
    },
    {
      icon: PenTool,
      titleEn: "Graphic Design",
      titleFr: "Design graphique",
      descEn: "Visual identity and design solutions that communicate your brand's message.",
      descFr: "Solutions d'identité visuelle et de design qui communiquent le message de votre marque.",
      featuresEn: [
        "Brand identity & logos",
        "Marketing collateral",
        "UI/UX design",
        "Infographics & illustrations",
        "Print & digital materials",
      ],
      featuresFr: [
        "Identité de marque et logos",
        "Matériel marketing",
        "Design UI/UX",
        "Infographies et illustrations",
        "Matériel imprimé et numérique",
      ],
      color: "#D4AF37",
    },
    {
      icon: Monitor,
      titleEn: "Web Development",
      titleFr: "Développement web",
      descEn: "Custom digital solutions from websites to complex learning platforms.",
      descFr: "Solutions numériques personnalisées, des sites web aux plateformes d'apprentissage complexes.",
      featuresEn: [
        "Custom websites & web apps",
        "E-learning platforms",
        "Mobile applications",
        "CMS & content management",
        "API integrations",
      ],
      featuresFr: [
        "Sites web et applications personnalisés",
        "Plateformes e-learning",
        "Applications mobiles",
        "CMS et gestion de contenu",
        "Intégrations API",
      ],
      color: "#8B5CF6",
    },
    {
      icon: Globe,
      titleEn: "Localization",
      titleFr: "Localisation",
      descEn: "Expert translation and cultural adaptation for global audiences.",
      descFr: "Traduction experte et adaptation culturelle pour des audiences mondiales.",
      featuresEn: [
        "Professional translation",
        "Cultural adaptation",
        "Multilingual content creation",
        "Subtitling & captioning",
        "Transcreation services",
      ],
      featuresFr: [
        "Traduction professionnelle",
        "Adaptation culturelle",
        "Création de contenu multilingue",
        "Sous-titrage et légendes",
        "Services de transcréation",
      ],
      color: "#EC4899",
    },
    {
      icon: Sparkles,
      titleEn: "AI Solutions",
      titleFr: "Solutions IA",
      descEn: "Cutting-edge AI-powered tools for content creation and learning.",
      descFr: "Outils de pointe alimentés par l'IA pour la création de contenu et l'apprentissage.",
      featuresEn: [
        "AI content generation",
        "Intelligent tutoring systems",
        "Automated assessments",
        "Speech recognition",
        "Personalized learning paths",
      ],
      featuresFr: [
        "Génération de contenu par IA",
        "Systèmes de tutorat intelligents",
        "Évaluations automatisées",
        "Reconnaissance vocale",
        "Parcours d'apprentissage personnalisés",
      ],
      color: "#06B6D4",
    },
  ];

  const PROCESS = [
    {
      stepEn: "Discovery",
      stepFr: "Découverte",
      descEn: "We learn about your goals, audience, and requirements",
      descFr: "Nous découvrons vos objectifs, votre audience et vos besoins",
    },
    {
      stepEn: "Strategy",
      stepFr: "Stratégie",
      descEn: "We develop a tailored approach and project plan",
      descFr: "Nous développons une approche sur mesure et un plan de projet",
    },
    {
      stepEn: "Creation",
      stepFr: "Création",
      descEn: "Our team brings your vision to life with expert execution",
      descFr: "Notre équipe donne vie à votre vision avec une exécution experte",
    },
    {
      stepEn: "Delivery",
      stepFr: "Livraison",
      descEn: "We deliver polished results and provide ongoing support",
      descFr: "Nous livrons des résultats soignés et offrons un support continu",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-950 to-black text-white">
      <Header />
      
      <main id="main-content">
        {/* Hero Section */}
        <section className="pt-24 pb-16 px-4 relative overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl" />
          
          <div className="container mx-auto relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <span className="inline-flex items-center gap-2 mb-6 px-5 py-2.5 rounded-full bg-white/10 border border-white/20 text-white">
                <Zap className="w-4 h-4 text-[#D4AF37]" />
                {language === "en" ? "Full-Service Creative Agency" : "Agence créative à service complet"}
              </span>
              
              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                {language === "en" ? "Our Services" : "Nos services"}
              </h1>
              
              <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
                {language === "en"
                  ? "Comprehensive creative and technical solutions designed to elevate your brand and engage your audience"
                  : "Solutions créatives et techniques complètes conçues pour élever votre marque et engager votre audience"
                }
              </p>
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <div className="space-y-16 max-w-6xl mx-auto">
              {SERVICES.map((service, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className={`grid grid-cols-1 lg:grid-cols-2 gap-8 items-center ${
                    index % 2 === 1 ? "lg:flex-row-reverse" : ""
                  }`}
                >
                  <div className={index % 2 === 1 ? "lg:order-2" : ""}>
                    <div 
                      className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
                      style={{ backgroundColor: `${service.color}20` }}
                    >
                      <service.icon className="w-8 h-8" style={{ color: service.color }} />
                    </div>
                    <h2 className="text-3xl font-bold mb-4">
                      {language === "en" ? service.titleEn : service.titleFr}
                    </h2>
                    <p className="text-lg text-gray-400 mb-6">
                      {language === "en" ? service.descEn : service.descFr}
                    </p>
                    <ul className="space-y-3">
                      {(language === "en" ? service.featuresEn : service.featuresFr).map((feature, i) => (
                        <li key={i} className="flex items-start gap-3 text-gray-300">
                          <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: service.color }} />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className={`${index % 2 === 1 ? "lg:order-1" : ""} p-8 rounded-3xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10`}>
                    <div className="aspect-video rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                      <service.icon className="w-20 h-20 text-gray-700" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section className="py-20 px-4 bg-gradient-to-br from-gray-900 to-black">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                {language === "en" ? "Our Process" : "Notre processus"}
              </h2>
              <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                {language === "en"
                  ? "A proven approach that delivers exceptional results"
                  : "Une approche éprouvée qui livre des résultats exceptionnels"
                }
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {PROCESS.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative text-center"
                >
                  <div className="w-12 h-12 rounded-full bg-[#D4AF37] text-black font-bold text-xl flex items-center justify-center mx-auto mb-4">
                    {index + 1}
                  </div>
                  <h3 className="font-bold text-white mb-2">
                    {language === "en" ? step.stepEn : step.stepFr}
                  </h3>
                  <p className="text-sm text-gray-400">
                    {language === "en" ? step.descEn : step.descFr}
                  </p>
                  {index < PROCESS.length - 1 && (
                    <div className="hidden md:block absolute top-6 left-[60%] w-[80%] h-px bg-gradient-to-r from-[#D4AF37] to-transparent" />
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 bg-gradient-to-r from-[#D4AF37] to-[#B8962E]">
          <div className="container mx-auto">
            <div className="max-w-3xl mx-auto text-center text-black">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                {language === "en" ? "Ready to Get Started?" : "Prêt à commencer?"}
              </h2>
              <p className="text-xl text-black/80 mb-10">
                {language === "en"
                  ? "Let's discuss how we can help bring your project to life"
                  : "Discutons de comment nous pouvons aider à donner vie à votre projet"
                }
              </p>
              <Link href="/barholex/contact">
                <Button 
                  size="lg" 
                  className="rounded-full px-8 h-14 text-lg font-semibold bg-black text-[#D4AF37] hover:bg-gray-900"
                >
                  {language === "en" ? "Contact Us" : "Nous contacter"}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
