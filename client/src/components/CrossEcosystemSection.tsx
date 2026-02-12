import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { Play, ChevronRight, ChevronLeft, Video, Sparkles, ArrowRight, Lightbulb, Brain, Users, Zap, Heart, MessageCircle, X, ExternalLink } from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";
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
 * Features:
 * - 10 YouTube Shorts with INLINE playback via modal embed player (no redirect)
 * - Modal has Next/Previous navigation between Shorts
 * - Carousel with working arrow controls (click/tap) + auto-scroll + drag/swipe
 * - 7 Learning Capsules with Bunny Stream videos
 * - Single active playback for capsules (stop previous when new starts)
 * - All text in white/high-contrast on dark teal background
 * - flex-nowrap enforced: always single horizontal row, even on mobile
 */

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
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
    color: "from-[#C65A1E] to-[#A84A15]",
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
    color: "from-[#0F3D3E] to-[#145A5B]",
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
    color: "from-[#C65A1E] to-[#E06B2D]",
    ringColor: "ring-[#C65A1E]/30 hover:ring-[#C65A1E]",
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
    color: "from-[#C65A1E] to-red-600",
    ringColor: "ring-orange-500/30 hover:ring-orange-400",
    accentColor: "text-orange-300"
  }
];

// All 10 Featured YouTube Shorts — Single Source of Truth
const featuredShorts = [
  { 
    id: "short-01", 
    youtubeId: "7rFq3YBm-E0",
    titleEn: "The 4 Stages of Learning", 
    titleFr: "Les 4 étapes de l'apprentissage",
    descEn: "Discover how to transition from conscious competence to unconscious competence.",
    descFr: "Découvrez comment passer de la compétence consciente à la compétence inconsciente.",
    category: "Learning"
  },
  { 
    id: "short-02", 
    youtubeId: "NdpnZafDl-E",
    titleEn: "Mastering the Past in French", 
    titleFr: "Maîtriser le passé en français",
    descEn: "Essential guidelines and illustrative examples of past tenses in French.",
    descFr: "Lignes directrices essentielles et exemples illustratifs des temps du passé en français.",
    category: "Grammar"
  },
  { 
    id: "short-03", 
    youtubeId: "nuq0xFvFxJ4",
    titleEn: "Immigrant Career Success", 
    titleFr: "Réussite professionnelle des immigrants",
    descEn: "How do immigrants succeed in their careers in Canada and the USA?",
    descFr: "Comment les immigrants réussissent-ils leur carrière au Canada et aux USA ?",
    category: "Career"
  },
  { 
    id: "short-04", 
    youtubeId: "bhKIH5ds6C8",
    titleEn: "AI vs Traditional Knowledge", 
    titleFr: "IA vs savoir traditionnel",
    descEn: "How AI confronts conventional perceptions of knowledge gatekeeping.",
    descFr: "Comment l'IA confronte les perceptions conventionnelles du savoir.",
    category: "Innovation"
  },
  { 
    id: "short-05", 
    youtubeId: "BiyAaX0EXG0",
    titleEn: "Unconscious Competence", 
    titleFr: "La compétence inconsciente",
    descEn: "Ever arrived somewhere and wondered how you got there? That's unconscious competence.",
    descFr: "Déjà arrivé quelque part sans savoir comment ? C'est la compétence inconsciente.",
    category: "Learning"
  },
  { 
    id: "short-06", 
    youtubeId: "-iYLQ97tfe4",
    titleEn: "Immigrant Integration Challenges", 
    titleFr: "L'intégration difficile des immigrés",
    descEn: "The difficult reality of immigrant integration and the challenges they face.",
    descFr: "La réalité difficile de l'intégration des immigrés et les défis qu'ils affrontent.",
    category: "Career"
  },
  { 
    id: "short-07", 
    youtubeId: "j-AXNvGqu8I",
    titleEn: "Is AI Really Smart?", 
    titleFr: "L'IA est-elle vraiment intelligente ?",
    descEn: "Is AI as smart as it seems? Or is it just a 'complete the sentence' machine?",
    descFr: "L'IA est-elle aussi intelligente qu'elle le paraît ? Ou juste une machine à compléter ?",
    category: "Innovation"
  },
  { 
    id: "short-08", 
    youtubeId: "ZDEWuWyA5_A",
    titleEn: "Bilingual = Better Jobs", 
    titleFr: "Bilingue = meilleurs emplois",
    descEn: "Picking up a second language can help you score cool job opportunities.",
    descFr: "Apprendre une deuxième langue peut vous ouvrir de belles opportunités d'emploi.",
    category: "Career"
  },
  { 
    id: "short-09", 
    youtubeId: "iF5WMis3UR8",
    titleEn: "Reputation & Professional Network", 
    titleFr: "Réputation et réseau professionnel",
    descEn: "How reputation and professional networking drive career success.",
    descFr: "Comment la réputation et le réseautage professionnel mènent à la réussite.",
    category: "Career"
  },
  { 
    id: "short-10", 
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

  // Auto-scroll animation
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

// ─── Arrow Button Component ───────────────────────────────────────────────────
function ScrollArrow({ direction, onClick }: { direction: 'left' | 'right'; onClick: () => void }) {
  const Icon = direction === 'left' ? ChevronLeft : ChevronRight;
  return (
    <button
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      className={`absolute top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/80 hover:text-white hover:bg-black/60 hover:border-white/20 transition-all duration-300 shadow-lg hover:shadow-xl active:scale-95 ${
        direction === 'left' ? 'left-2 md:left-4' : 'right-2 md:right-4'
      }`}
      aria-label={`Scroll ${direction}`}
    >
      <Icon className="w-5 h-5 md:w-6 md:h-6" />
    </button>
  );
}

// ─── YouTube Shorts Modal Player ──────────────────────────────────────────────
// Plays the Short inline via YouTube embed. Has Next/Previous to navigate.
function ShortsModal({ 
  shortIndex, 
  shorts, 
  language, 
  onClose, 
  onNext, 
  onPrev 
}: { 
  shortIndex: number; 
  shorts: typeof featuredShorts; 
  language: string; 
  onClose: () => void; 
  onNext: () => void; 
  onPrev: () => void; 
}) {
  const short = shorts[shortIndex];
  // YouTube embed URL for Shorts — use embed format with autoplay
  const embedUrl = `https://www.youtube.com/embed/${short.youtubeId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`;

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') onNext();
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') onPrev();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose, onNext, onPrev]);

  // Lock body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/85 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Modal Content — prevent click propagation */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="relative flex flex-col items-center max-w-[420px] w-[90vw]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 z-50 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all duration-200"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Video Container — 9:16 aspect ratio */}
        <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10" style={{ aspectRatio: '9/16' }}>
          <iframe
            key={short.youtubeId}
            src={embedUrl}
            title={language === "en" ? short.titleEn : short.titleFr}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
        </div>

        {/* Bottom Info + Navigation */}
        <div className="w-full mt-4 flex items-center justify-between gap-3">
          {/* Previous Button */}
          <button
            onClick={onPrev}
            className="w-11 h-11 shrink-0 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 active:scale-95 transition-all duration-200"
            aria-label="Previous Short"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Title + Counter */}
          <div className="flex-1 text-center min-w-0">
            <h4 className="text-white font-bold text-sm truncate">
              {language === "en" ? short.titleEn : short.titleFr}
            </h4>
            <p className="text-white/60 text-xs mt-0.5">
              {shortIndex + 1} / {shorts.length}
            </p>
          </div>

          {/* Next Button */}
          <button
            onClick={onNext}
            className="w-11 h-11 shrink-0 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 active:scale-95 transition-all duration-200"
            aria-label="Next Short"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* "Also on YouTube" link */}
        <a
          href={`https://www.youtube.com/shorts/${short.youtubeId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex items-center gap-1.5 text-white/50 hover:text-white/80 text-xs transition-colors"
        >
          <ExternalLink className="w-3 h-3" />
          {language === "en" ? "Also on YouTube" : "Aussi sur YouTube"}
        </a>
      </motion.div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
export default function CrossEcosystemSection({ variant = "hub" }: CrossEcosystemSectionProps) {
  const { language } = useLanguage();
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);
  const [showComments, setShowComments] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"shorts" | "capsules">("shorts");
  // Shorts modal state: index of the currently playing Short, or null
  const [activeShortIndex, setActiveShortIndex] = useState<number | null>(null);

  const shortsScroll = useHorizontalScroll(0.4);
  const capsulesScroll = useHorizontalScroll(0.35);

  // ─── Single Active Playback Manager (Capsules) ─────────────────────────
  const handlePlayCapsule = useCallback((capsuleId: string) => {
    setPlayingVideo((prev) => {
      if (prev === capsuleId) return null;
      return capsuleId;
    });
  }, []);

  const handleStopCapsule = useCallback(() => {
    setPlayingVideo(null);
  }, []);

  // ─── Shorts Modal Navigation ───────────────────────────────────────────
  const openShort = useCallback((index: number) => {
    setActiveShortIndex(index);
  }, []);

  const closeShort = useCallback(() => {
    setActiveShortIndex(null);
  }, []);

  const nextShort = useCallback(() => {
    setActiveShortIndex((prev) => {
      if (prev === null) return 0;
      return (prev + 1) % featuredShorts.length;
    });
  }, []);

  const prevShort = useCallback(() => {
    setActiveShortIndex((prev) => {
      if (prev === null) return featuredShorts.length - 1;
      return (prev - 1 + featuredShorts.length) % featuredShorts.length;
    });
  }, []);

  // Get Bunny Stream embed URL
  const getBunnyEmbedUrl = (videoId: string, autoplay: boolean = false) => {
    return `https://iframe.mediadelivery.net/embed/${BUNNY_LIBRARY_ID}/${videoId}?autoplay=${autoplay}&loop=false&muted=false&preload=true&responsive=true`;
  };

  // Toggle comments for a capsule
  const toggleComments = (capsuleId: string) => {
    setShowComments(showComments === capsuleId ? null : capsuleId);
  };

  // ─── Render Short Card — Thumbnail that opens inline modal player ──────
  const renderShortCard = (short: typeof featuredShorts[0], index: number) => {
    return (
      <button
        onClick={() => openShort(index)}
        className="block relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_60px_-12px_rgba(198,90,30,0.35)] ring-1 ring-white/10 hover:ring-red-500/50 group w-full text-left"
        style={{ aspectRatio: '9/16' }}
        aria-label={`${language === "en" ? "Play" : "Lire"}: ${language === "en" ? short.titleEn : short.titleFr}`}
      >
        {/* Thumbnail Image */}
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
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/30" />
        
        {/* Play Button — Glassmorphism */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-14 h-14 rounded-full bg-red-600/90 backdrop-blur-sm flex items-center justify-center shadow-[0_8px_32px_rgba(220,38,38,0.4)] transition-all duration-400 group-hover:scale-110 group-hover:bg-red-600 group-hover:shadow-[0_12px_40px_rgba(220,38,38,0.6)]">
            <Play className="w-7 h-7 text-white ml-0.5" fill="white" />
          </div>
        </div>
        
        {/* Top Row: Number + YouTube Badge */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#C65A1E] to-[#E06B2D] flex items-center justify-center text-white font-bold text-xs shadow-lg">
            {index + 1}
          </div>
          <div className="bg-red-600/90 backdrop-blur-sm text-white text-[10px] px-2 py-0.5 rounded-full font-semibold flex items-center gap-1 shadow-lg">
            <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z"/>
            </svg>
            Shorts
          </div>
        </div>
        
        {/* Bottom: Category + Title */}
        <div className="absolute bottom-0 left-0 right-0 p-3 pointer-events-none">
          <span className="inline-block text-[10px] font-semibold text-amber-400 bg-amber-400/10 backdrop-blur-sm px-2 py-0.5 rounded-full mb-1.5">
            {short.category}
          </span>
          <h4 className="font-bold text-white text-sm leading-tight line-clamp-2 mb-1.5">
            {language === "en" ? short.titleEn : short.titleFr}
          </h4>
          {/* "Play" hint — visible on hover */}
          <div className="flex items-center gap-1 text-white/0 group-hover:text-white/90 transition-all duration-300">
            <Play className="w-3 h-3" />
            <span className="text-[10px] font-medium">
              {language === "en" ? "Click to play" : "Cliquez pour lire"}
            </span>
          </div>
        </div>

        {/* Focus Ring for Accessibility */}
        <div className="absolute inset-0 rounded-2xl ring-2 ring-transparent focus-within:ring-amber-400 pointer-events-none" />
      </button>
    );
  };

  return (
    <section className="py-24 px-0 bg-gradient-to-b from-[#062b2b] via-[#0a4040] to-[#062b2b] relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#C65A1E]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        {/* Section Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="text-center mb-16 px-4"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#C65A1E]/20 to-[#C65A1E]/10 border border-amber-500/30 mb-6">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="text-sm font-medium text-amber-300">
              {language === "en" ? "Free Learning Resources" : "Ressources d'apprentissage gratuites"}
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {language === "en" ? "Take learning beyond the session" : "Prolongez l'apprentissage au-delà de la session"}
          </h2>
          
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            {language === "en" 
              ? "Explore our library of educational content. From quick tips to in-depth lessons, we provide resources to support your learning journey at every stage."
              : "Explorez notre bibliothèque de contenu éducatif. Des conseils rapides aux leçons approfondies, nous fournissons des ressources pour soutenir votre parcours d'apprentissage à chaque étape."}
          </p>
        </motion.div>

        {/* Tab Buttons */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="flex justify-center gap-4 mb-12 px-4"
        >
          <button
            onClick={() => setActiveTab("shorts")}
            className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
              activeTab === "shorts"
                ? "bg-red-600 text-white shadow-lg shadow-red-500/30"
                : "bg-[#0a6969] text-white hover:bg-[#0c7a7a]"
            }`}
          >
            YouTube Shorts
          </button>
          <button
            onClick={() => setActiveTab("capsules")}
            className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
              activeTab === "capsules"
                ? "bg-teal-600 text-white shadow-lg shadow-teal-500/30"
                : "bg-[#0a6969] text-white hover:bg-[#0c7a7a]"
            }`}
          >
            Learning Capsules
          </button>
        </motion.div>

        {/* ═══════════════════════════════════════════════════════════════════
            YouTube Shorts — Single Horizontal Row + Inline Modal Player
        ═══════════════════════════════════════════════════════════════════ */}
        {activeTab === "shorts" && (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="mb-16"
          >
            <div className="text-center mb-8 px-4">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
                {language === "en" ? "Featured Shorts" : "Shorts en vedette"}
              </h3>
              <p className="text-white/80 text-sm md:text-base max-w-xl mx-auto">
                {language === "en" 
                  ? "Quick insights in under 60 seconds — click to play, use arrows to browse"
                  : "Des conseils rapides en moins de 60 secondes — cliquez pour lire, utilisez les flèches pour naviguer"}
              </p>
            </div>
            
            {/* Carousel with working arrow controls */}
            <div className="relative">
              <ScrollArrow direction="left" onClick={() => shortsScroll.scrollByAmount('left')} />
              <ScrollArrow direction="right" onClick={() => shortsScroll.scrollByAmount('right')} />
              
              {/* Fade edges */}
              <div className="absolute left-0 top-0 bottom-0 w-12 md:w-20 bg-gradient-to-r from-[#062b2b] to-transparent z-10 pointer-events-none" />
              <div className="absolute right-0 top-0 bottom-0 w-12 md:w-20 bg-gradient-to-l from-[#062b2b] to-transparent z-10 pointer-events-none" />
              
              <div
                ref={shortsScroll.scrollRef}
                {...shortsScroll.handlers}
                className="flex flex-nowrap gap-5 overflow-x-auto scrollbar-hide px-8 md:px-16 py-3 cursor-grab select-none"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {/* Duplicate all 10 items for seamless loop */}
                {[...featuredShorts, ...featuredShorts].map((short, i) => {
                  const uniqueKey = i < featuredShorts.length ? short.id : `${short.id}-dup`;
                  const realIndex = i < featuredShorts.length ? i : i - featuredShorts.length;
                  return (
                    <div key={uniqueKey} className="scroll-card shrink-0 w-[160px] sm:w-[190px] md:w-[220px] lg:w-[240px]">
                      {renderShortCard(short, realIndex)}
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════
            Learning Capsules — Horizontal Marquee Carousel
            Single active playback (stop previous when new starts)
        ═══════════════════════════════════════════════════════════════════ */}
        {activeTab === "capsules" && (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="mb-16"
          >
            <div className="text-center mb-8 px-4">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
                {language === "en" ? "Learning Capsules" : "Capsules d'apprentissage"}
              </h3>
              <p className="text-white/80 text-sm md:text-base max-w-2xl mx-auto">
                {language === "en" 
                  ? "Master the 7 foundational theories of learning. Each capsule explores a different approach to understanding how we learn."
                  : "Maîtrisez les 7 théories fondamentales de l'apprentissage. Chaque capsule explore une approche différente pour comprendre comment nous apprenons."}
              </p>
            </div>
            
            <div className="relative">
              <ScrollArrow direction="left" onClick={() => capsulesScroll.scrollByAmount('left')} />
              <ScrollArrow direction="right" onClick={() => capsulesScroll.scrollByAmount('right')} />
              
              <div className="absolute left-0 top-0 bottom-0 w-12 md:w-20 bg-gradient-to-r from-[#062b2b] to-transparent z-10 pointer-events-none" />
              <div className="absolute right-0 top-0 bottom-0 w-12 md:w-20 bg-gradient-to-l from-[#062b2b] to-transparent z-10 pointer-events-none" />
              
              <div
                ref={capsulesScroll.scrollRef}
                {...capsulesScroll.handlers}
                className="flex flex-nowrap gap-6 overflow-x-auto scrollbar-hide px-8 md:px-16 py-2 cursor-grab select-none"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {[...learningCapsules, ...learningCapsules].map((capsule, idx) => {
                  const IconComponent = capsule.icon;
                  const isPlaying = playingVideo === capsule.id;
                  const isCommentsOpen = showComments === capsule.id;
                  const index = idx < learningCapsules.length ? idx : idx - learningCapsules.length;
                  
                  return (
                    <div
                      key={`${capsule.id}-${idx}`}
                      className="scroll-card shrink-0 w-[260px] sm:w-[300px] md:w-[340px]"
                    >
                      <div className="relative bg-gradient-to-br from-[#0a4040] via-[#0a5555] to-[#0a4040] rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 ring-1 ring-white/10 hover:ring-white/20 hover:-translate-y-2">
                        {/* Video Container */}
                        <div className="aspect-video relative overflow-hidden">
                          {isPlaying ? (
                            <iframe
                              src={getBunnyEmbedUrl(capsule.bunnyId, true)}
                              title={language === "en" ? capsule.titleEn : capsule.titleFr}
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                              className="absolute inset-0 w-full h-full"
                              loading="lazy"
                            />
                          ) : (
                            <>
                              <img
                                loading="lazy"
                                src={capsule.thumbnail}
                                alt={language === "en" ? capsule.titleEn : capsule.titleFr}
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                              />
                              
                              <div className={`absolute inset-0 bg-gradient-to-br ${capsule.color} opacity-20 hover:opacity-30 transition-opacity duration-300`} />
                              
                              <button
                                onClick={() => handlePlayCapsule(capsule.id)}
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
                        <div className="p-4 bg-gradient-to-t from-[#0a4040] via-[#0a4040]/95 to-[#0a4040]/90">
                          <div className="flex items-center gap-2 mb-2">
                            <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${capsule.color} flex items-center justify-center`}>
                              <IconComponent className="w-3.5 h-3.5 text-white" />
                            </div>
                            <span className={`text-[10px] font-semibold uppercase tracking-wider ${capsule.accentColor}`}>
                              {language === "en" ? "Learning Theory" : "Théorie d'apprentissage"}
                            </span>
                          </div>
                          
                          <h4 className="text-base font-bold text-white mb-1.5 line-clamp-1">
                            {language === "en" ? capsule.titleEn : capsule.titleFr}
                          </h4>
                          
                          <p className="text-xs text-white/80 line-clamp-2 mb-3">
                            {language === "en" ? capsule.descEn : capsule.descFr}
                          </p>
                          
                          <div className="flex items-center gap-2">
                            {!isPlaying ? (
                              <button
                                onClick={() => handlePlayCapsule(capsule.id)}
                                className={`flex-1 flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r ${capsule.color} text-white text-xs font-medium hover:opacity-90 transition-opacity`}
                              >
                                <Play className="w-3.5 h-3.5" />
                                {language === "en" ? "Watch" : "Regarder"}
                              </button>
                            ) : (
                              <button
                                onClick={handleStopCapsule}
                                className="flex-1 flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg bg-[#0a6969] text-white text-xs font-medium hover:bg-[#0c7a7a] transition-colors"
                              >
                                <X className="w-3.5 h-3.5" />
                                {language === "en" ? "Close" : "Fermer"}
                              </button>
                            )}
                            <button
                              onClick={() => toggleComments(capsule.id)}
                              className={`p-1.5 rounded-lg transition-colors ${isCommentsOpen ? 'bg-amber-500 text-white' : 'bg-[#0a6969] text-white hover:bg-[#0c7a7a]'}`}
                              aria-label="Toggle comments"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                        
                        {/* Comments Section (Expandable) */}
                        {isCommentsOpen && (
                          <div className="border-t border-slate-600 bg-white">
                            <div className="p-3 border-b border-slate-200 flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <MessageCircle className="w-3.5 h-3.5 text-black" />
                                <span className="text-xs font-medium text-black">
                                  {language === "en" ? "Discussion" : "Discussion"}
                                </span>
                              </div>
                              <button
                                onClick={() => setShowComments(null)}
                                className="p-1 rounded-full hover:bg-slate-200 transition-colors"
                                aria-label="Close comments"
                              >
                                <X className="w-3.5 h-3.5 text-black" />
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
            </div>
          </motion.div>
        )}

        {/* CTA Section */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="text-center px-4"
        >
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
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
            
            <Link href="/#videos">
              <button className="inline-flex items-center gap-2 px-8 py-4 bg-[#0a6969] border-2 border-white/20 text-white font-semibold rounded-full hover:border-amber-500 hover:bg-[#0c7a7a] transition-all duration-300">
                {language === "en" ? "Explore All Content" : "Explorer tout le contenu"}
                <ArrowRight className="w-5 h-5" />
              </button>
            </Link>
          </div>
          
          <p className="mt-6 text-sm text-[#67E8F9]">
            {language === "en" 
              ? "New content added weekly • Free forever • No signup required"
              : "Nouveau contenu chaque semaine • Gratuit pour toujours • Aucune inscription requise"}
          </p>
        </motion.div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          Shorts Modal — Inline YouTube Embed Player with Next/Previous
      ═══════════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {activeShortIndex !== null && (
          <ShortsModal
            shortIndex={activeShortIndex}
            shorts={featuredShorts}
            language={language}
            onClose={closeShort}
            onNext={nextShort}
            onPrev={prevShort}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
