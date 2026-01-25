import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { Play, ChevronRight, BookOpen, Video, Sparkles, ArrowRight, Lightbulb, Brain, Users, Zap, Heart, MessageCircle, X } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";
import { DiscussionEmbed } from 'disqus-react';

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
 * 
 * Features:
 * - 7 Learning Capsules with Bunny Stream videos
 * - Disqus comments section under each video
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

// Bunny Stream Library ID (from FeaturedCoaches.tsx)
const BUNNY_LIBRARY_ID = "585866";

// Disqus shortname
const DISQUS_SHORTNAME = "rusingacademy-learning-ecosystem";

// Learning Capsules data with Bunny Stream IDs
const learningCapsules = [
  {
    id: "capsule-1",
    bunnyId: "9ff70347-63fb-4632-bbed-41085d21002f",
    titleEn: "Behaviorism",
    titleFr: "Le béhaviorisme",
    descEn: "Understanding learning through observable behaviors and conditioning",
    descFr: "Comprendre l'apprentissage par les comportements observables et le conditionnement",
    icon: Brain,
    color: "from-teal-500 to-cyan-600",
    ringColor: "ring-teal-500/30 hover:ring-teal-400",
    accentColor: "text-teal-400"
  },
  {
    id: "capsule-2",
    bunnyId: "2bea9c8c-1376-41ae-8421-ea8271347aff",
    titleEn: "Cognitivism",
    titleFr: "Le cognitivisme",
    descEn: "How mental processes shape knowledge acquisition",
    descFr: "Comment les processus mentaux façonnent l'acquisition des connaissances",
    icon: Sparkles,
    color: "from-amber-500 to-orange-600",
    ringColor: "ring-amber-500/30 hover:ring-amber-400",
    accentColor: "text-amber-400"
  },
  {
    id: "capsule-3",
    bunnyId: "fd2eb202-ae4e-482e-a0b8-f2b2f0e07446",
    titleEn: "Socio-constructivism",
    titleFr: "Le socio-constructivisme",
    descEn: "Learning through social interaction and collaboration",
    descFr: "Apprendre par l'interaction sociale et la collaboration",
    icon: Users,
    color: "from-violet-500 to-purple-600",
    ringColor: "ring-violet-500/30 hover:ring-violet-400",
    accentColor: "text-violet-400"
  },
  {
    id: "capsule-4",
    bunnyId: "37f4bd93-81c3-4e1f-9734-0b5000e93209",
    titleEn: "Constructivism",
    titleFr: "Le constructivisme",
    descEn: "Building knowledge through active experience",
    descFr: "Construire les connaissances par l'expérience active",
    icon: Lightbulb,
    color: "from-emerald-500 to-green-600",
    ringColor: "ring-emerald-500/30 hover:ring-emerald-400",
    accentColor: "text-emerald-400"
  },
  {
    id: "capsule-5",
    bunnyId: "0688ba54-7a20-4f68-98ad-5acccb414e11",
    titleEn: "Humanism",
    titleFr: "L'humanisme",
    descEn: "Learner-centered approach focusing on personal growth",
    descFr: "Approche centrée sur l'apprenant axée sur la croissance personnelle",
    icon: Heart,
    color: "from-rose-500 to-pink-600",
    ringColor: "ring-rose-500/30 hover:ring-rose-400",
    accentColor: "text-rose-400"
  },
  {
    id: "capsule-6",
    bunnyId: "b45608b7-c10f-44f5-8f68-6d6e37ba8171",
    titleEn: "Connectivism",
    titleFr: "Le connectivisme",
    descEn: "Learning in the digital age through networks",
    descFr: "Apprendre à l'ère numérique à travers les réseaux",
    icon: Zap,
    color: "from-blue-500 to-indigo-600",
    ringColor: "ring-blue-500/30 hover:ring-blue-400",
    accentColor: "text-blue-400"
  },
  {
    id: "capsule-7",
    bunnyId: "04c2af4b-584e-40c6-926a-25fed27ea1d7",
    titleEn: "Experiential Learning",
    titleFr: "L'apprentissage expérientiel",
    descEn: "Learning through reflection on doing",
    descFr: "Apprendre par la réflexion sur l'action",
    icon: Video,
    color: "from-orange-500 to-red-600",
    ringColor: "ring-orange-500/30 hover:ring-orange-400",
    accentColor: "text-orange-400"
  }
];

export default function CrossEcosystemSection({ variant = "hub" }: CrossEcosystemSectionProps) {
  const { language } = useLanguage();
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);
  const [showComments, setShowComments] = useState<string | null>(null);

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
      count: "7+",
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

  // Get Bunny Stream thumbnail URL
  const getBunnyThumbnail = (videoId: string) => {
    return `https://vz-d5c8f9a8-f0a.b-cdn.net/${videoId}/thumbnail.jpg`;
  };

  // Get Bunny Stream embed URL
  const getBunnyEmbedUrl = (videoId: string, autoplay: boolean = false) => {
    return `https://iframe.mediadelivery.net/embed/${BUNNY_LIBRARY_ID}/${videoId}?autoplay=${autoplay}&loop=false&muted=false&preload=true&responsive=true`;
  };

  // Toggle comments for a capsule
  const toggleComments = (capsuleId: string) => {
    setShowComments(showComments === capsuleId ? null : capsuleId);
  };

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
          className="mb-16"
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

        {/* Learning Capsules Section - Premium Design with Bunny Stream + Disqus */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="mb-16"
        >
          <div className="text-center mb-10">
            <h3 className="text-3xl font-bold text-slate-900 mb-4">
              {language === "en" ? "Learning Capsules" : "Capsules d'apprentissage"}
            </h3>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              {language === "en" 
                ? "Master the 7 foundational theories of learning. Each capsule explores a different approach to understanding how we learn."
                : "Maîtrisez les 7 théories fondamentales de l'apprentissage. Chaque capsule explore une approche différente pour comprendre comment nous apprenons."}
            </p>
          </div>
          
          {/* Learning Capsules Grid - 7 Videos with Bunny Stream */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {learningCapsules.map((capsule, index) => {
              const IconComponent = capsule.icon;
              const isPlaying = playingVideo === capsule.id;
              const isCommentsOpen = showComments === capsule.id;
              
              return (
                <motion.div
                  key={capsule.id}
                  variants={scaleIn}
                  className={`group relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 ring-2 ${capsule.ringColor} hover:-translate-y-1`}
                  onMouseEnter={() => setHoveredCard(capsule.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  {/* Video Container */}
                  <div className="aspect-video relative overflow-hidden">
                    {isPlaying ? (
                      /* Bunny Stream Embed Player */
                      <iframe
                        src={getBunnyEmbedUrl(capsule.bunnyId, true)}
                        title={language === "en" ? capsule.titleEn : capsule.titleFr}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="absolute inset-0 w-full h-full"
                        loading="lazy"
                      />
                    ) : (
                      /* Thumbnail with Play Button */
                      <>
                        {/* Thumbnail Image from Bunny Stream */}
                        <img
                          src={getBunnyThumbnail(capsule.bunnyId)}
                          alt={language === "en" ? capsule.titleEn : capsule.titleFr}
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          onError={(e) => {
                            // Fallback to a gradient placeholder if thumbnail fails
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                        
                        {/* Gradient Overlay */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${capsule.color} opacity-20 group-hover:opacity-30 transition-opacity duration-300`} />
                        
                        {/* Play Button */}
                        <button
                          onClick={() => setPlayingVideo(capsule.id)}
                          className="absolute inset-0 flex items-center justify-center cursor-pointer"
                          aria-label={`Play ${language === "en" ? capsule.titleEn : capsule.titleFr}`}
                        >
                          <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${capsule.color} flex items-center justify-center shadow-2xl transform group-hover:scale-110 transition-all duration-300 ring-4 ring-white/20`}>
                            <Play className="w-8 h-8 text-white ml-1" fill="white" />
                          </div>
                        </button>
                        
                        {/* Capsule Number Badge */}
                        <div className={`absolute top-3 left-3 px-3 py-1 rounded-full bg-gradient-to-r ${capsule.color} text-white text-xs font-bold shadow-lg`}>
                          {index + 1}
                        </div>
                      </>
                    )}
                  </div>
                  
                  {/* Content Section */}
                  <div className="p-5 bg-gradient-to-t from-slate-900 via-slate-900/95 to-slate-900/90">
                    {/* Icon and Label */}
                    <div className="flex items-center gap-2 mb-3">
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${capsule.color} flex items-center justify-center`}>
                        <IconComponent className="w-4 h-4 text-white" />
                      </div>
                      <span className={`text-xs font-semibold ${capsule.accentColor} uppercase tracking-wider`}>
                        Capsule {index + 1}
                      </span>
                    </div>
                    
                    {/* Title */}
                    <h4 className="font-bold text-white text-lg mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-slate-300 transition-all duration-300">
                      {language === "en" ? capsule.titleEn : capsule.titleFr}
                    </h4>
                    
                    {/* Description */}
                    <p className="text-slate-400 text-sm line-clamp-2">
                      {language === "en" ? capsule.descEn : capsule.descFr}
                    </p>
                    
                    {/* Action Buttons */}
                    <div className="mt-4 flex items-center gap-3">
                      {/* Watch Button */}
                      {!isPlaying && (
                        <button
                          onClick={() => setPlayingVideo(capsule.id)}
                          className={`inline-flex items-center gap-2 text-sm font-medium ${capsule.accentColor} hover:underline transition-all duration-300`}
                        >
                          <Play className="w-4 h-4" />
                          {language === "en" ? "Watch" : "Regarder"}
                        </button>
                      )}
                      
                      {/* Comments Button */}
                      <button
                        onClick={() => toggleComments(capsule.id)}
                        className={`inline-flex items-center gap-2 text-sm font-medium transition-all duration-300 ${
                          isCommentsOpen 
                            ? 'text-amber-400' 
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        <MessageCircle className="w-4 h-4" />
                        {language === "en" ? "Discuss" : "Discuter"}
                      </button>
                    </div>
                  </div>
                  
                  {/* Disqus Comments Section - Expandable */}
                  {isCommentsOpen && (
                    <div className="bg-white border-t border-slate-700">
                      {/* Comments Header */}
                      <div className="flex items-center justify-between px-4 py-3 bg-slate-100 border-b border-slate-200">
                        <div className="flex items-center gap-2">
                          <MessageCircle className="w-4 h-4 text-slate-600" />
                          <span className="text-sm font-medium text-slate-700">
                            {language === "en" ? "Discussion" : "Discussion"}
                          </span>
                        </div>
                        <button
                          onClick={() => setShowComments(null)}
                          className="p-1 rounded-full hover:bg-slate-200 transition-colors"
                          aria-label="Close comments"
                        >
                          <X className="w-4 h-4 text-slate-500" />
                        </button>
                      </div>
                      
                      {/* Disqus Embed */}
                      <div className="p-4 max-h-96 overflow-y-auto">
                        <DiscussionEmbed
                          shortname={DISQUS_SHORTNAME}
                          config={{
                            url: `${typeof window !== 'undefined' ? window.location.origin : ''}/learning-capsules/${capsule.id}`,
                            identifier: `learning-capsule-${capsule.id}`,
                            title: language === "en" ? capsule.titleEn : capsule.titleFr,
                            language: language === "en" ? "en" : "fr",
                          }}
                        />
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })}
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
