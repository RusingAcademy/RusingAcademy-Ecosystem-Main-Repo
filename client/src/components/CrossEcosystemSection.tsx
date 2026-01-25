import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { Play, ChevronRight, BookOpen, Video, Sparkles, ArrowRight, Lightbulb } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";

/**
 * CrossEcosystemSection - "Take learning beyond the session"
 * 
 * Premium cross-ecosystem component displayed on:
 * - EcosystemHub (main page)
 * - RusingÂcademy
 * - Lingueefy
 * - Barholex Media
 * 
 * Positioned just before the footer on each page.
 * Design: Premium, emotionally engaging, learning continuity focus.
 */

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

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } }
};

interface CrossEcosystemSectionProps {
  variant?: "hub" | "rusingacademy" | "lingueefy" | "barholex";
}

export default function CrossEcosystemSection({ variant = "hub" }: CrossEcosystemSectionProps) {
  const { language } = useLanguage();
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  // Featured YouTube Shorts (top 4)
  const featuredShorts = [
    { 
      id: "short-01", 
      youtubeId: "7rFq3YBm-E0",
      titleEn: "The 4 Stages of Learning", 
      titleFr: "Les 4 étapes de l'apprentissage",
      category: "learning"
    },
    { 
      id: "short-02", 
      youtubeId: "NdpnZafDl-E",
      titleEn: "Mastering the Past in French", 
      titleFr: "Maîtriser le passé en français",
      category: "grammar"
    },
    { 
      id: "short-03", 
      youtubeId: "gWaRvaM09lo",
      titleEn: "Bilingual = More Money?", 
      titleFr: "Bilingue = Plus d'argent?",
      category: "career"
    },
    { 
      id: "short-04", 
      youtubeId: "B3dq1K9NgIk",
      titleEn: "Building Your Network", 
      titleFr: "Construire son réseau",
      category: "career"
    },
  ];

  // Content pillars
  const pillars = [
    {
      icon: Video,
      titleEn: "YouTube Shorts",
      titleFr: "YouTube Shorts",
      descEn: "Quick tips and insights in under 60 seconds",
      descFr: "Conseils rapides en moins de 60 secondes",
      count: "8+",
      color: "from-red-500 to-rose-600"
    },
    {
      icon: BookOpen,
      titleEn: "Learning Capsules",
      titleFr: "Capsules d'apprentissage",
      descEn: "In-depth lessons on learning theory",
      descFr: "Leçons approfondies sur la théorie",
      count: "3+",
      color: "from-teal-500 to-cyan-600"
    },
    {
      icon: Sparkles,
      titleEn: "Expert Insights",
      titleFr: "Perspectives d'experts",
      descEn: "Wisdom from our certified coaches",
      descFr: "Sagesse de nos coachs certifiés",
      count: "Coming",
      color: "from-amber-500 to-orange-600"
    },
  ];

  return (
    <section className="py-24 px-4 bg-gradient-to-b from-slate-50 via-white to-slate-100 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-amber-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto relative z-10">
        {/* Section Header - Premium Typography */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="text-center mb-16"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 mb-6">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span className="text-sm font-medium text-amber-700">
              {language === "en" ? "Free Resources" : "Ressources gratuites"}
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
            {language === "en" ? (
              <>Take learning <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600">beyond</span> the session</>
            ) : (
              <>Prolongez l'apprentissage <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600">au-delà</span> de la session</>
            )}
          </h2>
          
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            {language === "en"
              ? "Your learning journey doesn't stop when the session ends. Explore our growing library of free educational content designed to reinforce your progress and keep you motivated."
              : "Votre parcours d'apprentissage ne s'arrête pas à la fin de la session. Explorez notre bibliothèque croissante de contenu éducatif gratuit conçu pour renforcer vos progrès et vous garder motivé."}
          </p>
        </motion.div>

        {/* Content Pillars - 3 Cards */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="grid md:grid-cols-3 gap-6 mb-16"
        >
          {pillars.map((pillar, index) => (
            <motion.div
              key={index}
              variants={scaleIn}
              className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-200 hover:border-amber-300"
              onMouseEnter={() => setHoveredCard(`pillar-${index}`)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {/* Icon */}
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${pillar.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <pillar.icon className="w-7 h-7 text-white" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-slate-900 mb-2">{language === "en" ? pillar.titleEn : pillar.titleFr}</h3>
              <p className="text-slate-600 mb-4">{language === "en" ? pillar.descEn : pillar.descFr}</p>
              
              {/* Count Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 text-sm font-medium">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                {pillar.count} {language === "en" ? "available" : "disponibles"}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Featured Shorts Preview */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="mb-12"
        >
          <h3 className="text-2xl font-bold text-slate-900 mb-8 text-center">
            {language === "en" ? "Featured Shorts" : "Shorts en vedette"}
          </h3>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {featuredShorts.map((short, index) => (
              <a
                key={short.id}
                href={`https://www.youtube.com/shorts/${short.youtubeId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02] ring-2 ring-white/20 hover:ring-amber-400/50"
                style={{ aspectRatio: '9/16' }}
              >
                {/* Thumbnail */}
                <img
                  src={`https://img.youtube.com/vi/${short.youtubeId}/maxresdefault.jpg`}
                  alt={language === "en" ? short.titleEn : short.titleFr}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${short.youtubeId}/hqdefault.jpg`;
                  }}
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                
                {/* Play Button */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-14 h-14 rounded-full bg-red-600 flex items-center justify-center shadow-lg">
                    <Play className="w-7 h-7 text-white ml-1" fill="white" />
                  </div>
                </div>
                
                {/* Number Badge */}
                <div className="absolute top-3 left-3 w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white font-bold text-sm shadow-lg">
                  {index + 1}
                </div>
                
                {/* YouTube Badge */}
                <div className="absolute top-3 right-3 bg-red-600 text-white text-xs px-2 py-1 rounded-full font-bold">
                  Shorts
                </div>
                
                {/* Title */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h4 className="font-semibold text-white text-sm line-clamp-2">
                    {language === "en" ? short.titleEn : short.titleFr}
                  </h4>
                </div>
              </a>
            ))}
          </div>
        </motion.div>

        {/* Learning Capsules Section */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="mb-12"
        >
          <h3 className="text-2xl font-bold text-slate-900 mb-4 text-center">
            {language === "en" ? "Learning Capsules" : "Capsules d'apprentissage"}
          </h3>
          <p className="text-slate-600 text-center mb-8 max-w-2xl mx-auto">
            {language === "en" 
              ? "In-depth video lessons on learning theory and language acquisition"
              : "Leçons vidéo approfondies sur la théorie de l'apprentissage et l'acquisition des langues"}
          </p>
          
          {/* Learning Capsules Videos */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {/* Capsule 1: Behaviorism */}
            <div className="group relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 ring-2 ring-teal-500/30 hover:ring-teal-400">
              <div className="aspect-video relative">
                <iframe
                  src="https://www.youtube.com/embed/9ff70347-63fb-4632-bbed-41085d21002f"
                  title={language === "en" ? "Behaviorism" : "Le béhaviorisme"}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                />
              </div>
              <div className="p-4 bg-gradient-to-t from-slate-900 to-transparent">
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen className="w-5 h-5 text-teal-400" />
                  <span className="text-xs font-semibold text-teal-400 uppercase tracking-wide">Capsule 1</span>
                </div>
                <h4 className="font-bold text-white">
                  {language === "en" ? "Behaviorism" : "Le béhaviorisme"}
                </h4>
              </div>
            </div>
            
            {/* Capsule 2: Cognitivism */}
            <div className="group relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 ring-2 ring-amber-500/30 hover:ring-amber-400">
              <div className="aspect-video relative">
                <iframe
                  src="https://www.youtube.com/embed/2bea9c8c-1376-41ae-8421-ea8271347aff"
                  title={language === "en" ? "Cognitivism" : "Le cognitivisme"}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                />
              </div>
              <div className="p-4 bg-gradient-to-t from-slate-900 to-transparent">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                  <span className="text-xs font-semibold text-amber-400 uppercase tracking-wide">Capsule 2</span>
                </div>
                <h4 className="font-bold text-white">
                  {language === "en" ? "Cognitivism" : "Le cognitivisme"}
                </h4>
              </div>
            </div>
            
            {/* Capsule 3: Socio-constructivism */}
            <div className="group relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 ring-2 ring-violet-500/30 hover:ring-violet-400">
              <div className="aspect-video relative">
                <iframe
                  src="https://www.youtube.com/embed/fd2eb202-ae4e-482e-a0b8-f2b2f0e07446"
                  title={language === "en" ? "Socio-constructivism" : "Le socio-constructivisme"}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                />
              </div>
              <div className="p-4 bg-gradient-to-t from-slate-900 to-transparent">
                <div className="flex items-center gap-2 mb-2">
                  <Video className="w-5 h-5 text-violet-400" />
                  <span className="text-xs font-semibold text-violet-400 uppercase tracking-wide">Capsule 3</span>
                </div>
                <h4 className="font-bold text-white">
                  {language === "en" ? "Socio-constructivism" : "Le socio-constructivisme"}
                </h4>
              </div>
            </div>
            
            {/* Capsule 4: Constructivism */}
            <div className="group relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 ring-2 ring-emerald-500/30 hover:ring-emerald-400">
              <div className="aspect-video relative">
                <iframe
                  src="https://www.youtube.com/embed/37f4bd93-81c3-4e1f-9734-0b5000e93209"
                  title={language === "en" ? "Constructivism" : "Le constructivisme"}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                />
              </div>
              <div className="p-4 bg-gradient-to-t from-slate-900 to-transparent">
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className="w-5 h-5 text-emerald-400" />
                  <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wide">Capsule 4</span>
                </div>
                <h4 className="font-bold text-white">
                  {language === "en" ? "Constructivism" : "Le constructivisme"}
                </h4>
              </div>
            </div>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="text-center"
        >
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {/* YouTube CTA */}
            <a
              href="https://www.youtube.com/channel/UC5aSvb7pDEdq8DadPD94qxw"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-red-600 to-red-500 text-white font-semibold rounded-full hover:shadow-lg hover:shadow-red-500/30 transition-all duration-300 hover:scale-105"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
              {language === "en" ? "Subscribe to YouTube" : "S'abonner à YouTube"}
            </a>
            
            {/* Explore All CTA */}
            <Link href="/#videos">
              <button className="inline-flex items-center gap-2 px-8 py-4 bg-white border-2 border-slate-300 text-slate-700 font-semibold rounded-full hover:border-amber-500 hover:text-amber-700 transition-all duration-300">
                {language === "en" ? "Explore All Content" : "Explorer tout le contenu"}
                <ArrowRight className="w-5 h-5" />
              </button>
            </Link>
          </div>
          
          {/* Trust indicator */}
          <p className="mt-6 text-sm text-slate-500">
            {language === "en" 
              ? "New content added weekly • Free forever • No signup required"
              : "Nouveau contenu chaque semaine • Gratuit pour toujours • Aucune inscription requise"}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
