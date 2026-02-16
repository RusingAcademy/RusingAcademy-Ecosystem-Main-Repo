import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { Play, ChevronRight, ChevronLeft, Video, Sparkles, ArrowRight, Lightbulb, Brain, Users, Zap, Heart, MessageCircle, X, Square, BookOpen, Flame } from "lucide-react";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Link } from "wouter";
import { DiscussionEmbed } from 'disqus-react';

/**
 * CrossEcosystemSection - "Take learning beyond the session"
 * 
 * CRITICAL FIX: Uses unique instance keys (not just item IDs) for playback tracking
 * to prevent double audio when carousel duplicates items for infinite loop.
 * 
 * Features:
 * - 10 Shorts hosted on Bunny Stream (migrated from YouTube)
 * - 7 Learning Capsules with Bunny Stream videos
 * - SINGLE ACTIVE PLAYBACK across both Shorts and Capsules
 * - Unique instance keys prevent double iframe loading
 * - Glassmorphism design, premium animations
 * - flex-nowrap: always single horizontal row, even on mobile
 * - Animated floating particles for depth
 * - Stats bar with animated counters
 * - Progress dots under carousels
 */

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } }
};

interface CrossEcosystemSectionProps {
  variant?: "hub" | "rusingacademy" | "lingueefy" | "barholex";
}

// Bunny Stream Library ID
const BUNNY_LIBRARY_ID = "585866";

// Disqus shortname
const DISQUS_SHORTNAME = "rusingacademy-learning-ecosystem";

// Learning Capsules data with Bunny Stream IDs and custom thumbnails
const learningCapsules = [
  {
    id: "capsule-1",
    bunnyId: "9ff70347-63fb-4632-bbed-41085d21002f",
    thumbnail: "https://rusingacademy-cdn.b-cdn.net/images/capsules/capsule_01.jpg",
    titleEn: "Behaviorism",
    titleFr: "Le béhaviorisme",
    descEn: "Understanding learning through observable behaviors and conditioning",
    descFr: "Comprendre l'apprentissage par les comportements observables et le conditionnement",
    icon: Brain,
    color: "from-teal-500 to-cyan-600",
    ringColor: "ring-teal-500/30 hover:ring-teal-400",
    accentColor: "text-teal-300"
  },
  {
    id: "capsule-2",
    bunnyId: "2bea9c8c-1376-41ae-8421-ea8271347aff",
    thumbnail: "https://rusingacademy-cdn.b-cdn.net/images/capsules/capsule_02.jpg",
    titleEn: "Cognitivism",
    titleFr: "Le cognitivisme",
    descEn: "How mental processes shape knowledge acquisition",
    descFr: "Comment les processus mentaux façonnent l'acquisition des connaissances",
    icon: Sparkles,
    color: "from-cta to-cta",
    ringColor: "ring-amber-500/30 hover:ring-amber-400",
    accentColor: "text-amber-300"
  },
  {
    id: "capsule-3",
    bunnyId: "fd2eb202-ae4e-482e-a0b8-f2b2f0e07446",
    thumbnail: "https://rusingacademy-cdn.b-cdn.net/images/capsules/capsule_03.jpg",
    titleEn: "Socio-constructivism",
    titleFr: "Le socio-constructivisme",
    descEn: "Learning through social interaction and collaboration",
    descFr: "Apprendre par l'interaction sociale et la collaboration",
    icon: Users,
    color: "from-foundation to-teal-700",
    ringColor: "ring-[#0F3D3E]/30 hover:ring-[#0F3D3E]",
    accentColor: "text-teal-200"
  },
  {
    id: "capsule-4",
    bunnyId: "37f4bd93-81c3-4e1f-9734-0b5000e93209",
    thumbnail: "https://rusingacademy-cdn.b-cdn.net/images/capsules/capsule_04.jpg",
    titleEn: "Constructivism",
    titleFr: "Le constructivisme",
    descEn: "Building knowledge through active experience",
    descFr: "Construire les connaissances par l'expérience active",
    icon: Lightbulb,
    color: "from-emerald-500 to-green-600",
    ringColor: "ring-emerald-500/30 hover:ring-emerald-400",
    accentColor: "text-emerald-300"
  },
  {
    id: "capsule-5",
    bunnyId: "0688ba54-7a20-4f68-98ad-5acccb414e11",
    thumbnail: "https://rusingacademy-cdn.b-cdn.net/images/capsules/capsule_05.jpg",
    titleEn: "Humanism",
    titleFr: "L'humanisme",
    descEn: "Learner-centered approach focusing on personal growth",
    descFr: "Approche centrée sur l'apprenant axée sur la croissance personnelle",
    icon: Heart,
    color: "from-cta to-orange-600",
    ringColor: "ring-cta/30 hover:ring-cta",
    accentColor: "text-orange-300"
  },
  {
    id: "capsule-6",
    bunnyId: "b45608b7-c10f-44f5-8f68-6d6e37ba8171",
    thumbnail: "https://rusingacademy-cdn.b-cdn.net/images/capsules/capsule_06.jpg",
    titleEn: "Connectivism",
    titleFr: "Le connectivisme",
    descEn: "Learning in the digital age through networks",
    descFr: "Apprendre à l'ère numérique à travers les réseaux",
    icon: Zap,
    color: "from-blue-500 to-indigo-600",
    ringColor: "ring-blue-500/30 hover:ring-blue-400",
    accentColor: "text-blue-300"
  },
  {
    id: "capsule-7",
    bunnyId: "04c2af4b-584e-40c6-926a-25fed27ea1d7",
    thumbnail: "https://rusingacademy-cdn.b-cdn.net/images/capsules/capsule_07.jpg",
    titleEn: "Experiential Learning",
    titleFr: "L'apprentissage expérientiel",
    descEn: "Learning through reflection on doing",
    descFr: "Apprendre par la réflexion sur l'action",
    icon: Video,
    color: "from-cta to-red-600",
    ringColor: "ring-orange-500/30 hover:ring-orange-400",
    accentColor: "text-orange-300"
  }
];

// All 10 Featured Shorts — Hosted on Bunny Stream (migrated from YouTube for reliable inline playback)
const featuredShorts = [
  { 
    id: "short-01", 
    bunnyId: "c148f006-1f30-49cf-810c-1a2a714ff7d1",
    youtubeId: "7rFq3YBm-E0",
    titleEn: "The 4 Stages of Learning", 
    titleFr: "Les 4 étapes de l'apprentissage",
    descEn: "Discover how to transition from conscious competence to unconscious competence.",
    descFr: "Découvrez comment passer de la compétence consciente à la compétence inconsciente.",
    category: "Learning"
  },
  { 
    id: "short-02", 
    bunnyId: "b780afa8-58cc-4eda-9870-a02441b3bbd5",
    youtubeId: "NdpnZafDl-E",
    titleEn: "Mastering the Past in French", 
    titleFr: "Maîtriser le passé en français",
    descEn: "Essential guidelines and illustrative examples of past tenses in French.",
    descFr: "Lignes directrices essentielles et exemples illustratifs des temps du passé en français.",
    category: "Grammar"
  },
  { 
    id: "short-03", 
    bunnyId: "c7db3cfd-30cd-42f0-8a3d-65f79362b55b",
    youtubeId: "nuq0xFvFxJ4",
    titleEn: "Immigrant Career Success", 
    titleFr: "Réussite professionnelle des immigrants",
    descEn: "How do immigrants succeed in their careers in Canada and the USA?",
    descFr: "Comment les immigrants réussissent-ils leur carrière au Canada et aux USA ?",
    category: "Career"
  },
  { 
    id: "short-04", 
    bunnyId: "b278ad24-daef-4c58-8930-81b02291fcaa",
    youtubeId: "bhKIH5ds6C8",
    titleEn: "AI vs Traditional Knowledge", 
    titleFr: "IA vs savoir traditionnel",
    descEn: "How AI confronts conventional perceptions of knowledge gatekeeping.",
    descFr: "Comment l'IA confronte les perceptions conventionnelles du savoir.",
    category: "Innovation"
  },
  { 
    id: "short-05", 
    bunnyId: "f689f540-8686-4898-a324-0d71d66ccc5a",
    youtubeId: "BiyAaX0EXG0",
    titleEn: "Unconscious Competence", 
    titleFr: "La compétence inconsciente",
    descEn: "Ever arrived somewhere and wondered how you got there? That's unconscious competence.",
    descFr: "Déjà arrivé quelque part sans savoir comment ? C'est la compétence inconsciente.",
    category: "Learning"
  },
  { 
    id: "short-06", 
    bunnyId: "e6ea0762-2a80-4ae2-8ef5-5c8b0858c24c",
    youtubeId: "-iYLQ97tfe4",
    titleEn: "Immigrant Integration Challenges", 
    titleFr: "L'intégration difficile des immigrés",
    descEn: "The difficult reality of immigrant integration and the challenges they face.",
    descFr: "La réalité difficile de l'intégration des immigrés et les défis qu'ils affrontent.",
    category: "Career"
  },
  { 
    id: "short-07", 
    bunnyId: "10dbfb36-8213-48be-82b5-f3c26509b58d",
    youtubeId: "j-AXNvGqu8I",
    titleEn: "Is AI Really Smart?", 
    titleFr: "L'IA est-elle vraiment intelligente ?",
    descEn: "Is AI as smart as it seems? Or is it just a 'complete the sentence' machine?",
    descFr: "L'IA est-elle aussi intelligente qu'elle le paraît ? Ou juste une machine à compléter ?",
    category: "Innovation"
  },
  { 
    id: "short-08", 
    bunnyId: "4af49681-88fa-4586-96bb-ac061fbd9b38",
    youtubeId: "ZDEWuWyA5_A",
    titleEn: "Bilingual = Better Jobs", 
    titleFr: "Bilingue = meilleurs emplois",
    descEn: "Picking up a second language can help you score cool job opportunities.",
    descFr: "Apprendre une deuxième langue peut vous ouvrir de belles opportunités d'emploi.",
    category: "Career"
  },
  { 
    id: "short-09", 
    bunnyId: "c39c521e-9c28-44ba-83ed-8425e6b5808f",
    youtubeId: "iF5WMis3UR8",
    titleEn: "Reputation & Professional Network", 
    titleFr: "Réputation et réseau professionnel",
    descEn: "How reputation and professional networking drive career success.",
    descFr: "Comment la réputation et le réseautage professionnel mènent à la réussite.",
    category: "Career"
  },
  { 
    id: "short-10", 
    bunnyId: "4c9a35b5-1876-47dd-9680-ba0491fee287",
    youtubeId: "Z5fkvuz029Y",
    titleEn: "Fact Checker Puzzle", 
    titleFr: "Le casse-tête du vérificateur",
    descEn: "Our fact checker puzzle has an interesting range of challenges.",
    descFr: "Notre casse-tête du vérificateur offre une gamme intéressante de défis.",
    category: "Learning"
  },
];

// ─── Horizontal Scroll Hook ───────────────────────────────────────────────────
function useHorizontalScroll(autoScrollSpeed = 0.5) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const isPausedRef = useRef(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const animate = () => {
      if (!isPausedRef.current && !isDragging.current && el) {
        el.scrollLeft += autoScrollSpeed;
        if (el.scrollLeft >= el.scrollWidth - el.clientWidth - 2) {
          el.scrollLeft = 0;
        }
      }
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [autoScrollSpeed]);

  const handleMouseEnter = useCallback(() => { isPausedRef.current = true; }, []);
  const handleMouseLeave = useCallback(() => { 
    isPausedRef.current = false; 
    isDragging.current = false; 
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    isDragging.current = true;
    startX.current = e.pageX - (scrollRef.current?.offsetLeft || 0);
    scrollLeft.current = scrollRef.current?.scrollLeft || 0;
    if (scrollRef.current) scrollRef.current.style.cursor = 'grabbing';
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging.current) return;
    e.preventDefault();
    const x = e.pageX - (scrollRef.current?.offsetLeft || 0);
    const walk = (x - startX.current) * 1.5;
    if (scrollRef.current) scrollRef.current.scrollLeft = scrollLeft.current - walk;
  }, []);

  const handleMouseUp = useCallback(() => {
    isDragging.current = false;
    if (scrollRef.current) scrollRef.current.style.cursor = 'grab';
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    isPausedRef.current = true;
    startX.current = e.touches[0].pageX - (scrollRef.current?.offsetLeft || 0);
    scrollLeft.current = scrollRef.current?.scrollLeft || 0;
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    const x = e.touches[0].pageX - (scrollRef.current?.offsetLeft || 0);
    const walk = (x - startX.current) * 1.5;
    if (scrollRef.current) scrollRef.current.scrollLeft = scrollLeft.current - walk;
  }, []);

  const handleTouchEnd = useCallback(() => {
    isPausedRef.current = false;
  }, []);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (scrollRef.current && Math.abs(e.deltaY) > 0) {
      e.preventDefault();
      scrollRef.current.scrollLeft += e.deltaY;
    }
  }, []);

  const scrollByAmount = useCallback((direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const cardWidth = scrollRef.current.querySelector('.scroll-card')?.clientWidth || 280;
    const amount = direction === 'left' ? -(cardWidth + 20) : (cardWidth + 20);
    scrollRef.current.scrollBy({ left: amount, behavior: 'smooth' });
  }, []);

  return {
    scrollRef,
    handlers: {
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave,
      onMouseDown: handleMouseDown,
      onMouseMove: handleMouseMove,
      onMouseUp: handleMouseUp,
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
      onWheel: handleWheel,
    },
    scrollByAmount,
  };
}

// ─── Animated Floating Particles ─────────────────────────────────────────────
function FloatingParticles() {
  const particles = useMemo(() => 
    Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 20 + 15,
      delay: Math.random() * 10,
      opacity: Math.random() * 0.15 + 0.05,
    })), []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-white dark:bg-slate-900"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            opacity: p.opacity,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, Math.random() * 20 - 10, 0],
            opacity: [p.opacity, p.opacity * 2, p.opacity],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

// ─── Premium Arrow Button ────────────────────────────────────────────────────
function ScrollArrow({ direction, onClick }: { direction: 'left' | 'right'; onClick: () => void }) {
  const Icon = direction === 'left' ? ChevronLeft : ChevronRight;
  return (
    <button
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      className={`absolute top-1/2 -translate-y-1/2 z-20 w-11 h-11 md:w-13 md:h-13 rounded-full bg-black/50 backdrop-blur-xl border border-white/15 flex items-center justify-center text-white/90 hover:text-white hover:bg-cta/80 hover:border-cta/50 transition-all duration-300 shadow-xl hover:shadow-[0_0_20px_rgba(198,90,30,0.4)] active:scale-90 ${
        direction === 'left' ? 'left-2 md:left-4' : 'right-2 md:right-4'
      }`}
      aria-label={`Scroll ${direction}`}
    >
      <Icon className="w-5 h-5 md:w-6 md:h-6" />
    </button>
  );
}

// ─── Stats Pill ──────────────────────────────────────────────────────────────
function StatsPill({ icon: IconComp, value, label }: { icon: React.ElementType; value: string; label: string }) {
  return (
    <div className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-white dark:bg-slate-900/5 backdrop-blur-sm border border-white/10">
      <IconComp className="w-4 h-4 text-amber-400" />
      <span className="text-sm font-bold text-white">{value}</span>
      <span className="text-xs text-white/60">{label}</span>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
export default function CrossEcosystemSection({ variant = "hub" }: CrossEcosystemSectionProps) {
  const { language } = useLanguage();
  const [showComments, setShowComments] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"shorts" | "capsules">("shorts");

  // ─── UNIFIED SINGLE ACTIVE PLAYBACK ──────────────────────────────────
  // Uses UNIQUE INSTANCE KEY (not item ID) to prevent double audio from
  // duplicate carousel cards. Format: "short-01" or "short-01-dup" or "capsule-1-dup"
  const [activePlayerKey, setActivePlayerKey] = useState<string | null>(null);

  const shortsScroll = useHorizontalScroll(0.4);
  const capsulesScroll = useHorizontalScroll(0.35);

  // Play handler: sets the unique instance key as active, stops everything else
  const handlePlay = useCallback((instanceKey: string) => {
    setActivePlayerKey((prev) => (prev === instanceKey ? null : instanceKey));
  }, []);

  // Stop all playback
  const handleStop = useCallback(() => {
    setActivePlayerKey(null);
  }, []);

  // When switching tabs, stop all playback
  const handleTabSwitch = useCallback((tab: "shorts" | "capsules") => {
    setActivePlayerKey(null);
    setShowComments(null);
    setActiveTab(tab);
  }, []);

  // Get Bunny Stream embed URL
  const getBunnyEmbedUrl = (videoId: string, autoplay: boolean = false) => {
    return `https://iframe.mediadelivery.net/embed/${BUNNY_LIBRARY_ID}/${videoId}?autoplay=${autoplay}&loop=false&muted=false&preload=true&responsive=true&playsinline=true`;
  };

  // Toggle comments for a capsule
  const toggleComments = (capsuleId: string) => {
    setShowComments(showComments === capsuleId ? null : capsuleId);
  };

  // Category badge colors
  const categoryColors: Record<string, string> = {
    Learning: "from-emerald-500 to-teal-600",
    Grammar: "from-blue-500 to-indigo-600",
    Career: "from-amber-500 to-orange-600",
    Innovation: "from-purple-500 to-violet-600",
  };

  // ─── Render Short Card ─────────────────────────────────────────────────
  // instanceKey is unique per carousel position (e.g., "short-01" vs "short-01-dup")
  const renderShortCard = (short: typeof featuredShorts[0], index: number, instanceKey: string) => {
    const isPlaying = activePlayerKey === instanceKey;
    const embedUrl = getBunnyEmbedUrl(short.bunnyId, true);
    const catColor = categoryColors[short.category] || "from-gray-500 to-gray-600";

    return (
      <div
        className="relative rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_60px_-12px_rgba(198,90,30,0.4)] ring-1 ring-white/10 hover:ring-cta/50 group bg-gradient-to-b from-teal-900 to-obsidian"
        style={{ aspectRatio: '9/16' }}
      >
        {isPlaying ? (
          /* ── Bunny Stream Embed — plays directly in the card ── */
          <>
            <iframe
              key={`bunny-${instanceKey}`}
              src={embedUrl}
              title={language === "en" ? short.titleEn : short.titleFr}
              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen"
              allowFullScreen
              loading="lazy"
              className="absolute inset-0 w-full h-full border-0"
              style={{ border: 'none' }}
            />
            {/* Stop button */}
            <button
              onClick={(e) => { e.stopPropagation(); handleStop(); }}
              className="absolute top-3 right-3 z-30 w-9 h-9 rounded-full bg-black/70 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white hover:bg-red-600 hover:border-red-500 transition-all duration-200 shadow-xl"
              aria-label={language === "en" ? "Stop" : "Arrêter"}
            >
              <Square className="w-3.5 h-3.5" fill="white" />
            </button>
          </>
        ) : (
          /* ── Thumbnail — click to play in place ── */
          <button
            onClick={() => handlePlay(instanceKey)}
            className="block w-full h-full text-left cursor-pointer"
            aria-label={`${language === "en" ? "Play" : "Lire"}: ${language === "en" ? short.titleEn : short.titleFr}`}
          >
            <img
              loading="lazy"
              src={`https://img.youtube.com/vi/${short.youtubeId}/maxresdefault.jpg`}
              alt={language === "en" ? short.titleEn : short.titleFr}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${short.youtubeId}/hqdefault.jpg`;
              }}
            />
            
            {/* Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-black/40" />
            
            {/* Play Button — Premium Glassmorphism */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-16 h-16 rounded-full bg-red-600/90 backdrop-blur-sm flex items-center justify-center shadow-[0_8px_40px_rgba(220,38,38,0.5)] transition-all duration-400 group-hover:scale-115 group-hover:bg-red-600 group-hover:shadow-[0_12px_50px_rgba(220,38,38,0.7)] ring-2 ring-white/20">
                <Play className="w-8 h-8 text-white ml-0.5" fill="white" />
              </div>
            </div>
            
            {/* Top Row: Number + Category Badge */}
            <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cta to-orange-600 flex items-center justify-center text-white font-bold text-xs shadow-lg ring-2 ring-white/10">
                {index + 1}
              </div>
              <div className={`bg-gradient-to-r ${catColor} text-white text-[10px] px-2.5 py-1 rounded-full font-semibold flex items-center gap-1.5 shadow-lg backdrop-blur-sm`}>
                <Flame className="w-2.5 h-2.5" />
                {short.category}
              </div>
            </div>
            
            {/* Bottom: Title + CTA */}
            <div className="absolute bottom-0 left-0 right-0 p-4 pointer-events-none">
              <h4 className="font-bold text-white text-sm leading-tight line-clamp-2 mb-2 drop-shadow-lg">
                {language === "en" ? short.titleEn : short.titleFr}
              </h4>
              <p className="text-[10px] text-white/60 line-clamp-1 mb-2">
                {language === "en" ? short.descEn : short.descFr}
              </p>
              <div className="flex items-center gap-1.5 text-white/0 group-hover:text-white/90 transition-all duration-300">
                <Play className="w-3 h-3" />
                <span className="text-[10px] font-medium">
                  {language === "en" ? "Click to play" : "Cliquez pour lire"}
                </span>
              </div>
            </div>

            {/* Focus Ring */}
            <div className="absolute inset-0 rounded-2xl ring-2 ring-transparent focus-within:ring-amber-400 pointer-events-none" />
          </button>
        )}
      </div>
    );
  };

  return (
    <section className="section-dark py-28 px-0 bg-gradient-to-b from-[#031818] via-[#0a3d3d] to-[#031818] relative overflow-hidden">
      {/* ── Decorative Background ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Premium gradient orbs */}
        <div className="absolute top-20 left-10 w-96 h-96 bg-cta/8 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-teal-500/6 rounded-full blur-[140px] animate-pulse" style={{ animationDuration: '12s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-cyan-500/4 rounded-full blur-[180px]" />
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-amber-500/5 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '10s' }} />
        
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-[0.025]" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }} />
        
        {/* Floating particles */}
        <FloatingParticles />
      </div>

      {/* ── Top Wave Divider ── */}
      <div className="absolute top-0 left-0 right-0 pointer-events-none">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto" preserveAspectRatio="none">
          <path d="M0 60V30C240 10 480 0 720 10C960 20 1200 40 1440 30V60H0Z" fill="#031818" fillOpacity="0.5" />
        </svg>
      </div>

      <div className="relative z-10">
        {/* ── Section Header ── */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="text-center mb-10 px-4"
        >
          {/* Badge */}
          <motion.div 
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-cta/20 to-amber-500/10 border border-amber-500/25 mb-8 backdrop-blur-sm"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="text-sm font-semibold text-amber-300 tracking-wide">
              {language === "en" ? "Free Learning Resources" : "Ressources d'apprentissage gratuites"}
            </span>
          </motion.div>

          {/* Main Title */}
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-5 tracking-tight leading-tight">
            {language === "en" ? (
              <>Take learning <span className="bg-gradient-to-r from-cta via-amber-400 to-cta bg-clip-text text-transparent bg-[length:200%_auto] animate-[shimmer_3s_ease-in-out_infinite]">beyond</span> the session</>
            ) : (
              <>Prolongez l'apprentissage <span className="bg-gradient-to-r from-cta via-amber-400 to-cta bg-clip-text text-transparent bg-[length:200%_auto] animate-[shimmer_3s_ease-in-out_infinite]">au-delà</span> de la session</>
            )}
          </h2>
          
          <p className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
            {language === "en" 
              ? "Explore our library of educational content. From quick tips to in-depth lessons, we provide resources to support your learning journey at every stage."
              : "Explorez notre bibliothèque de contenu éducatif. Des conseils rapides aux leçons approfondies, nous fournissons des ressources pour soutenir votre parcours d'apprentissage à chaque étape."}
          </p>
        </motion.div>

        {/* ── Stats Bar ── */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="flex flex-wrap justify-center gap-3 mb-12 px-4"
        >
          <StatsPill icon={Video} value="10+" label={language === "en" ? "Shorts" : "Shorts"} />
          <StatsPill icon={BookOpen} value="7" label={language === "en" ? "Capsules" : "Capsules"} />
          <StatsPill icon={Flame} value="100%" label={language === "en" ? "Free" : "Gratuit"} />
        </motion.div>

        {/* ── Tab Buttons — Premium Segmented Control ── */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="flex justify-center mb-14 px-4"
        >
          <div className="inline-flex gap-1.5 p-1.5 rounded-full bg-white dark:bg-slate-900/5 backdrop-blur-xl border border-white/10">
            <button
              onClick={() => handleTabSwitch("shorts")}
              className={`relative px-7 py-3 rounded-full font-semibold transition-all duration-400 text-sm tracking-wide overflow-hidden ${
                activeTab === "shorts"
                  ? "text-white"
                  : "text-white/60 hover:text-white/90"
              }`}
            >
              {activeTab === "shorts" && (
                <motion.div
                  layoutId="activeTabBg"
                  className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-500 rounded-full shadow-xl shadow-red-500/30"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative flex items-center gap-2">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z"/>
                </svg>
                YouTube Shorts
              </span>
            </button>
            <button
              onClick={() => handleTabSwitch("capsules")}
              className={`relative px-7 py-3 rounded-full font-semibold transition-all duration-400 text-sm tracking-wide overflow-hidden ${
                activeTab === "capsules"
                  ? "text-white"
                  : "text-white/60 hover:text-white/90"
              }`}
            >
              {activeTab === "capsules" && (
                <motion.div
                  layoutId="activeTabBg"
                  className="absolute inset-0 bg-gradient-to-r from-teal-600 to-cyan-600 rounded-full shadow-xl shadow-teal-500/30"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative flex items-center gap-2">
                <Brain className="w-4 h-4" />
                {language === "en" ? "Learning Capsules" : "Capsules d'apprentissage"}
              </span>
            </button>
          </div>
        </motion.div>

        {/* ═══════════════════════════════════════════════════════════════════
            YouTube Shorts — Bunny Stream Inline Playback
            CRITICAL: Uses instanceKey (not short.id) to prevent double audio
        ═══════════════════════════════════════════════════════════════════ */}
        <AnimatePresence mode="wait">
          {activeTab === "shorts" && (
            <motion.div
              key="shorts-tab"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="mb-16"
            >
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={staggerContainer}
              >
                <motion.div variants={fadeInUp} className="text-center mb-10 px-4">
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-3 tracking-tight">
                    {language === "en" ? "Featured Shorts" : "Shorts en vedette"}
                  </h3>
                  <p className="text-white/70 text-sm md:text-base max-w-xl mx-auto">
                    {language === "en" 
                      ? "Quick insights in under 60 seconds — click to play, use arrows to browse"
                      : "Des conseils rapides en moins de 60 secondes — cliquez pour lire, utilisez les flèches pour naviguer"}
                  </p>
                </motion.div>
                
                {/* Carousel */}
                <motion.div variants={fadeInUp} className="relative">
                  <ScrollArrow direction="left" onClick={() => shortsScroll.scrollByAmount('left')} />
                  <ScrollArrow direction="right" onClick={() => shortsScroll.scrollByAmount('right')} />
                  
                  {/* Fade edges */}
                  <div className="absolute left-0 top-0 bottom-0 w-16 md:w-24 bg-gradient-to-r from-[#031818] to-transparent z-10 pointer-events-none" />
                  <div className="absolute right-0 top-0 bottom-0 w-16 md:w-24 bg-gradient-to-l from-[#031818] to-transparent z-10 pointer-events-none" />
                  
                  <div
                    ref={shortsScroll.scrollRef}
                    {...shortsScroll.handlers}
                    className="flex flex-nowrap gap-5 overflow-x-auto scrollbar-hide px-10 md:px-20 py-4 cursor-grab select-none"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                  >
                    {/* Duplicate for seamless loop — each gets a UNIQUE instanceKey */}
                    {[...featuredShorts, ...featuredShorts].map((short, i) => {
                      const isDuplicate = i >= featuredShorts.length;
                      const instanceKey = isDuplicate ? `${short.id}-dup` : short.id;
                      const realIndex = isDuplicate ? i - featuredShorts.length : i;
                      return (
                        <div key={instanceKey} className="scroll-card shrink-0 w-[160px] sm:w-[190px] md:w-[220px] lg:w-[240px]">
                          {renderShortCard(short, realIndex, instanceKey)}
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          )}

          {/* ═══════════════════════════════════════════════════════════════════
              Learning Capsules — Bunny Stream Inline Playback
              CRITICAL: Uses instanceKey (not capsule.id) to prevent double audio
          ═══════════════════════════════════════════════════════════════════ */}
          {activeTab === "capsules" && (
            <motion.div
              key="capsules-tab"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="mb-16"
            >
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={staggerContainer}
              >
                <motion.div variants={fadeInUp} className="text-center mb-10 px-4">
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-3 tracking-tight">
                    {language === "en" ? "Learning Capsules" : "Capsules d'apprentissage"}
                  </h3>
                  <p className="text-white/70 text-sm md:text-base max-w-2xl mx-auto">
                    {language === "en" 
                      ? "Master the 7 foundational theories of learning. Each capsule explores a different approach to understanding how we learn."
                      : "Maîtrisez les 7 théories fondamentales de l'apprentissage. Chaque capsule explore une approche différente pour comprendre comment nous apprenons."}
                  </p>
                </motion.div>
                
                <motion.div variants={fadeInUp} className="relative">
                  <ScrollArrow direction="left" onClick={() => capsulesScroll.scrollByAmount('left')} />
                  <ScrollArrow direction="right" onClick={() => capsulesScroll.scrollByAmount('right')} />
                  
                  <div className="absolute left-0 top-0 bottom-0 w-16 md:w-24 bg-gradient-to-r from-[#031818] to-transparent z-10 pointer-events-none" />
                  <div className="absolute right-0 top-0 bottom-0 w-16 md:w-24 bg-gradient-to-l from-[#031818] to-transparent z-10 pointer-events-none" />
                  
                  <div
                    ref={capsulesScroll.scrollRef}
                    {...capsulesScroll.handlers}
                    className="flex flex-nowrap gap-6 overflow-x-auto scrollbar-hide px-10 md:px-20 py-4 cursor-grab select-none"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                  >
                    {[...learningCapsules, ...learningCapsules].map((capsule, idx) => {
                      const isDuplicate = idx >= learningCapsules.length;
                      const instanceKey = isDuplicate ? `${capsule.id}-dup` : capsule.id;
                      const IconComponent = capsule.icon;
                      const isPlaying = activePlayerKey === instanceKey;
                      const isCommentsOpen = showComments === capsule.id;
                      const index = isDuplicate ? idx - learningCapsules.length : idx;
                      
                      return (
                        <div
                          key={instanceKey}
                          className="scroll-card shrink-0 w-[260px] sm:w-[300px] md:w-[340px]"
                        >
                          <div className="relative bg-gradient-to-br from-[#0a4545]/80 via-[#0a5555]/60 to-teal-900/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-xl hover:shadow-[0_20px_60px_-12px_rgba(0,200,200,0.15)] transition-all duration-500 ring-1 ring-white/10 hover:ring-white/25 hover:-translate-y-2 group">
                            {/* Video Container */}
                            <div className="aspect-video relative overflow-hidden">
                              {isPlaying ? (
                                <>
                                  <iframe
                                    key={`bunny-capsule-${instanceKey}`}
                                    src={getBunnyEmbedUrl(capsule.bunnyId, true)}
                                    title={language === "en" ? capsule.titleEn : capsule.titleFr}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    className="absolute inset-0 w-full h-full"
                                    loading="lazy"
                                  />
                                  {/* Stop overlay */}
                                  <button
                                    onClick={(e) => { e.stopPropagation(); handleStop(); }}
                                    className="absolute top-2 right-2 z-30 w-8 h-8 rounded-full bg-black/70 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white hover:bg-red-600 transition-all duration-200 shadow-lg"
                                    aria-label="Stop"
                                  >
                                    <Square className="w-3 h-3" fill="white" />
                                  </button>
                                </>
                              ) : (
                                <>
                                  <img
                                    loading="lazy"
                                    src={capsule.thumbnail}
                                    alt={language === "en" ? capsule.titleEn : capsule.titleFr}
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                  />
                                  
                                  <div className={`absolute inset-0 bg-gradient-to-br ${capsule.color} opacity-20 group-hover:opacity-30 transition-opacity duration-300`} />
                                  
                                  <button
                                    onClick={() => handlePlay(instanceKey)}
                                    className="absolute inset-0 flex items-center justify-center cursor-pointer"
                                    aria-label={`Play ${language === "en" ? capsule.titleEn : capsule.titleFr}`}
                                  >
                                    <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${capsule.color} flex items-center justify-center shadow-2xl transform hover:scale-110 transition-all duration-300 ring-4 ring-white/20`}>
                                      <Play className="w-7 h-7 text-white ml-0.5" fill="white" />
                                    </div>
                                  </button>
                                  
                                  <div className={`absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-gradient-to-r ${capsule.color} text-white text-xs font-bold shadow-lg`}>
                                    {index + 1}
                                  </div>
                                </>
                              )}
                            </div>
                            
                            {/* Content Section */}
                            <div className="p-4 bg-gradient-to-t from-obsidian via-[#0a3d3d]/95 to-teal-900/90">
                              <div className="flex items-center gap-2 mb-2">
                                <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${capsule.color} flex items-center justify-center`}>
                                  <IconComponent className="w-3.5 h-3.5 text-white" />
                                </div>
                                <span className={`text-[10px] font-bold uppercase tracking-wider ${capsule.accentColor}`}>
                                  {language === "en" ? "Learning Theory" : "Théorie d'apprentissage"}
                                </span>
                              </div>
                              
                              <h4 className="text-base font-bold text-white mb-1.5 line-clamp-1">
                                {language === "en" ? capsule.titleEn : capsule.titleFr}
                              </h4>
                              
                              <p className="text-xs text-white/75 line-clamp-2 mb-3 leading-relaxed">
                                {language === "en" ? capsule.descEn : capsule.descFr}
                              </p>
                              
                              <div className="flex items-center gap-2">
                                {!isPlaying ? (
                                  <button
                                    onClick={() => handlePlay(instanceKey)}
                                    className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r ${capsule.color} text-white text-xs font-semibold hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl`}
                                  >
                                    <Play className="w-3.5 h-3.5" />
                                    {language === "en" ? "Watch" : "Regarder"}
                                  </button>
                                ) : (
                                  <button
                                    onClick={handleStop}
                                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-white dark:bg-slate-900/10 backdrop-blur-sm border border-white/10 text-white text-xs font-semibold hover:bg-white dark:bg-slate-900/15 transition-all duration-300"
                                  >
                                    <Square className="w-3 h-3" fill="white" />
                                    {language === "en" ? "Stop" : "Arrêter"}
                                  </button>
                                )}
                                <button
                                  onClick={() => toggleComments(capsule.id)}
                                  className={`p-2 rounded-xl transition-all duration-300 ${isCommentsOpen ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/30' : 'bg-white/10 backdrop-blur-sm border border-white/10 text-white hover:bg-white/15'}`}
                                  aria-label="Toggle comments"
                                >
                                  <MessageCircle className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                            
                            {/* Comments Section (Expandable) */}
                            {isCommentsOpen && (
                              <div className="border-t border-white/10 bg-white dark:bg-slate-900">
                                <div className="p-3 border-b border-slate-200 flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <MessageCircle className="w-3.5 h-3.5 text-black dark:text-white" />
                                    <span className="text-xs font-medium text-black dark:text-white">
                                      {language === "en" ? "Discussion" : "Discussion"}
                                    </span>
                                  </div>
                                  <button
                                    onClick={() => setShowComments(null)}
                                    className="p-1 rounded-full hover:bg-slate-200 transition-colors"
                                    aria-label="Close comments"
                                  >
                                    <X className="w-3.5 h-3.5 text-black dark:text-white" />
                                  </button>
                                </div>
                                
                                <div className="p-3 max-h-80 overflow-y-auto">
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
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── CTA Section — Premium ── */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="text-center px-4 mt-4"
        >
          {/* Decorative line */}
          <div className="flex items-center justify-center gap-4 mb-10">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-white/20" />
            <Sparkles className="w-4 h-4 text-amber-400/50" />
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-white/20" />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <motion.a
              href="https://www.youtube.com/channel/UC5aSvb7pDEdq8DadPD94qxw"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-red-600 to-red-500 text-white font-semibold rounded-full hover:shadow-xl hover:shadow-red-500/30 transition-all duration-300 ring-1 ring-red-400/20"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
              {language === "en" ? "Subscribe to YouTube" : "S'abonner à YouTube"}
            </motion.a>
            
            <Link href="/#videos">
              <motion.button 
                className="inline-flex items-center gap-2 px-8 py-4 bg-white dark:bg-slate-900/5 backdrop-blur-xl border border-white/15 text-white font-semibold rounded-full hover:border-cta/50 hover:bg-white dark:bg-slate-900/10 hover:shadow-xl hover:shadow-orange-700/10 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                {language === "en" ? "Explore All Content" : "Explorer tout le contenu"}
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </Link>
          </div>
          
          <p className="mt-8 text-sm text-cyan-300/60 font-medium tracking-wide">
            {language === "en" 
              ? "New content added weekly \u2022 Free forever \u2022 No signup required"
              : "Nouveau contenu chaque semaine \u2022 Gratuit pour toujours \u2022 Aucune inscription requise"}
          </p>
        </motion.div>
      </div>

      {/* ── Bottom Wave Divider ── */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto" preserveAspectRatio="none">
          <path d="M0 0V30C240 50 480 60 720 50C960 40 1200 20 1440 30V0H0Z" fill="#031818" fillOpacity="0.5" />
        </svg>
      </div>
    </section>
  );
}
