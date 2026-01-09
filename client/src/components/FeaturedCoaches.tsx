import { Link } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { Play, Star, ArrowRight, X, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef } from "react";

// Featured coaches data with real YouTube video URLs
const FEATURED_COACHES = [
  {
    id: 1,
    name: "Steven Rusinga",
    slug: "steven-rusinga",
    headline: "SLE Expert | Oral Exam Specialist",
    bio: "Founder of Lingueefy with 10+ years helping federal employees achieve their SLE goals.",
    hourlyRate: 7500, // $75.00
    videoId: "LEc84vX0xe0",
    photoUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663049070748/gvnmYNphKZgt9jM9K8Vi9K/coaches/steven-rusinga-v3.jpg",
    rating: 4.95,
    totalSessions: 520,
    languages: ["french", "english"] as ("french" | "english")[],
  },
  {
    id: 2,
    name: "Sue-Anne Richer",
    slug: "sue-anne-richer",
    headline: "Bilingual Expert | Conversation Specialist",
    bio: "Specialized in French and English oral preparation with immersive conversation techniques.",
    hourlyRate: 5500, // $55.00
    videoId: "SuuhMpF5KoA",
    photoUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663049070748/gvnmYNphKZgt9jM9K8Vi9K/coaches/sue-anne-richer-v2.jpg",
    rating: 4.90,
    totalSessions: 385,
    languages: ["french", "english"] as ("french" | "english")[],
  },
  {
    id: 3,
    name: "Erika Séguin",
    slug: "erika-seguin",
    headline: "Exam Confidence | English Performance Coach",
    bio: "Helps learners overcome exam anxiety and build confidence for English test day success.",
    hourlyRate: 6000, // $60.00
    videoId: "rAdJZ4o_N2Y",
    photoUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663049070748/gvnmYNphKZgt9jM9K8Vi9K/coaches/erika-seguin.jpg",
    rating: 4.80,
    totalSessions: 278,
    languages: ["english"] as ("french" | "english")[],
  },
  {
    id: 4,
    name: "Soukaina Haidar",
    slug: "soukaina-haidar",
    headline: "French Excellence | Written & Oral",
    bio: "Expert in French written and oral SLE preparation with a focus on fluency and accuracy.",
    hourlyRate: 5500, // $55.00
    videoId: "UN9-GPwmbaw",
    photoUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663049070748/gvnmYNphKZgt9jM9K8Vi9K/coaches/soukaina-haidar-v2.jpg",
    rating: 4.85,
    totalSessions: 312,
    languages: ["french"] as ("french" | "english")[],
  },
  {
    id: 5,
    name: "Victor Amisi",
    slug: "victor-amisi",
    headline: "BBB/CBC Preparation | Oral Simulation",
    bio: "Insider insights and realistic exam simulations for consistent, confident results.",
    hourlyRate: 6000, // $60.00
    videoId: "NxAK8U6_5e4",
    photoUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663049070748/gvnmYNphKZgt9jM9K8Vi9K/coaches/victor-amisi-v2.jpg",
    rating: 4.75,
    totalSessions: 310,
    languages: ["french"] as ("french" | "english")[],
  },
  {
    id: 6,
    name: "Preciosa Baganha",
    slug: "preciosa-baganha",
    headline: "Professional English | Executive Coaching",
    bio: "Elevating workplace English fluency for presentations, meetings, and leadership.",
    hourlyRate: 5800, // $58.00
    videoId: "ZytUUUv-A2g",
    photoUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663049070748/gvnmYNphKZgt9jM9K8Vi9K/coaches/preciosa-baganha-v2.jpg",
    rating: 4.67,
    totalSessions: 324,
    languages: ["english"] as ("french" | "english")[],
  },
];

type LanguageFilter = "all" | "french" | "english";

// Video Modal Component
function VideoModal({ 
  videoId, 
  coachName, 
  isOpen, 
  onClose 
}: { 
  videoId: string; 
  coachName: string; 
  isOpen: boolean; 
  onClose: () => void;
}) {
  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
      
      {/* Modal Content */}
      <div 
        className="relative w-full max-w-4xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 sm:top-4 sm:right-4 z-10 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-colors"
          aria-label="Close video"
        >
          <X className="w-5 h-5" />
        </button>
        
        {/* YouTube Embed */}
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
          title={`${coachName} - Introduction Video`}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  );
}

// Coach Video Card Component
function CoachVideoCard({ 
  coach, 
  onPlayVideo 
}: { 
  coach: typeof FEATURED_COACHES[0];
  onPlayVideo: (videoId: string, coachName: string) => void;
}) {
  const { language } = useLanguage();
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const formatPrice = (cents: number) => {
    return `$${(cents / 100).toFixed(0)}`;
  };

  // Get YouTube thumbnail
  const thumbnailUrl = `https://img.youtube.com/vi/${coach.videoId}/maxresdefault.jpg`;

  // Handle hover with delay for video preview
  const handleMouseEnter = () => {
    setIsHovered(true);
    // Start video preview after 800ms hover
    hoverTimeoutRef.current = setTimeout(() => {
      setShowPreview(true);
    }, 800);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setShowPreview(false);
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div 
      className="group relative glass-card rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-teal-500/10 hover:-translate-y-2"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Video Thumbnail / Preview */}
      <div className="relative aspect-video bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 overflow-hidden">
        {/* Loading skeleton */}
        {!imageLoaded && !showPreview && (
          <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 animate-pulse" />
        )}
        
        {/* YouTube Video Preview on Hover */}
        {showPreview ? (
          <iframe
            src={`https://www.youtube.com/embed/${coach.videoId}?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0&showinfo=0&start=0&end=15&loop=1&playlist=${coach.videoId}`}
            title={`${coach.name} - Preview`}
            className="absolute inset-0 w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            style={{ pointerEvents: 'none' }}
          />
        ) : (
          <img 
            src={thumbnailUrl}
            alt={coach.name}
            className={`w-full h-full object-cover transition-all duration-700 ${isHovered ? 'scale-110' : 'scale-100'} ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setImageLoaded(true)}
            onError={(e) => {
              // Fallback to coach photo if YouTube thumbnail fails
              (e.target as HTMLImageElement).src = coach.photoUrl;
              setImageLoaded(true);
            }}
          />
        )}
        
        {/* Play Button Overlay - show when not previewing */}
        <button
          onClick={() => onPlayVideo(coach.videoId, coach.name)}
          className={`absolute inset-0 flex items-center justify-center transition-all duration-300 cursor-pointer ${showPreview ? 'bg-transparent' : 'bg-black/20 group-hover:bg-black/30'}`}
          aria-label={`Play ${coach.name}'s introduction video`}
        >
          <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-xl transition-all duration-300 ${showPreview ? 'opacity-0 scale-75' : isHovered ? 'scale-110 bg-teal-500' : 'scale-100'}`}>
            <Play className={`w-6 h-6 sm:w-7 sm:h-7 ml-1 transition-colors ${isHovered ? 'text-white' : 'text-teal-600'}`} fill="currentColor" />
          </div>
        </button>
        
        {/* Preview indicator */}
        {showPreview && (
          <div className="absolute top-2 left-2 sm:top-3 sm:left-3 px-2 py-1 rounded-full bg-red-500/90 backdrop-blur-sm animate-pulse">
            <span className="text-xs font-medium text-white flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              {language === "fr" ? "Aperçu" : "Preview"}
            </span>
          </div>
        )}
        
        {/* Rating Badge */}
        <div className="absolute top-2 right-2 sm:top-3 sm:right-3 flex items-center gap-1 px-2 py-1 sm:px-2.5 rounded-full bg-white/90 backdrop-blur-sm shadow-lg">
          <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" fill="currentColor" />
          <span className="text-xs sm:text-sm font-semibold text-gray-800">{coach.rating.toFixed(1)}</span>
        </div>
        
        {/* Sessions Badge */}
        <div className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3 px-2 py-1 sm:px-2.5 rounded-full bg-black/60 backdrop-blur-sm">
          <span className="text-xs font-medium text-white">{coach.totalSessions} {language === "fr" ? "séances" : "lessons"}</span>
        </div>
        
        {/* Price Badge */}
        <div className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full bg-teal-600 shadow-lg">
          <span className="text-xs sm:text-sm font-bold text-white">
            {language === "fr" ? "Dès" : "From"} {formatPrice(coach.hourlyRate)}/h
          </span>
        </div>
      </div>
      
      {/* Coach Info */}
      <div className="p-4 sm:p-5">
        <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-1 group-hover:text-teal-600 transition-colors">
          {coach.name}
        </h3>
        <p className="text-xs sm:text-sm font-medium text-teal-600 dark:text-teal-400 mb-2">
          {coach.headline}
        </p>
        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3 sm:mb-4">
          {coach.bio}
        </p>
        
        {/* Language Tags */}
        <div className="flex flex-wrap gap-1.5 mb-3 sm:mb-4">
          {coach.languages.map((lang) => (
            <span 
              key={lang}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
            >
              <Globe className="w-3 h-3" />
              {lang === "french" ? (language === "fr" ? "Français" : "French") : (language === "fr" ? "Anglais" : "English")}
            </span>
          ))}
        </div>
        
        {/* CTA Button */}
        <Link href={`/coaches/${coach.slug}`}>
          <Button className="w-full glass-btn text-white rounded-xl h-10 sm:h-11 font-semibold group/btn text-sm sm:text-base">
            <span>{language === "fr" ? "Essayer" : "Try Now"}</span>
            <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover/btn:translate-x-1" />
          </Button>
        </Link>
      </div>
    </div>
  );
}

// Language Filter Button Component
function FilterButton({ 
  active, 
  onClick, 
  children 
}: { 
  active: boolean; 
  onClick: () => void; 
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-full text-sm sm:text-base font-medium transition-all duration-300 ${
        active 
          ? 'bg-teal-600 text-white shadow-lg shadow-teal-500/30' 
          : 'bg-white/50 dark:bg-gray-800/50 text-gray-600 dark:text-gray-400 hover:bg-teal-50 dark:hover:bg-teal-900/20 hover:text-teal-600 dark:hover:text-teal-400'
      }`}
    >
      {children}
    </button>
  );
}

export default function FeaturedCoaches() {
  const { language } = useLanguage();
  const [languageFilter, setLanguageFilter] = useState<LanguageFilter>("all");
  const [videoModal, setVideoModal] = useState<{ isOpen: boolean; videoId: string; coachName: string }>({
    isOpen: false,
    videoId: "",
    coachName: "",
  });
  
  // Filter coaches based on language selection
  const filteredCoaches = FEATURED_COACHES.filter((coach) => {
    if (languageFilter === "all") return true;
    return coach.languages.includes(languageFilter);
  });

  const openVideoModal = (videoId: string, coachName: string) => {
    setVideoModal({ isOpen: true, videoId, coachName });
  };

  const closeVideoModal = () => {
    setVideoModal({ isOpen: false, videoId: "", coachName: "" });
  };
  
  return (
    <>
      <section className="py-12 sm:py-16 lg:py-28 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 bg-gradient-to-b from-white via-teal-50/30 to-white dark:from-gray-900 dark:via-teal-900/10 dark:to-gray-900" />
        <div className="absolute top-20 left-10 w-48 sm:w-72 h-48 sm:h-72 bg-teal-500/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-64 sm:w-96 h-64 sm:h-96 bg-orange-500/10 rounded-full blur-3xl animate-float-delayed" />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12 lg:mb-16">
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full glass-subtle text-teal-700 dark:text-teal-400 text-xs sm:text-sm font-medium mb-4 sm:mb-6">
              <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>{language === "fr" ? "Coachs Certifiés" : "Certified Coaches"}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">
              {language === "fr" ? "Trouvez Votre Tuteur de Langue Idéal" : "Find Your Perfect Language Tutor"}
            </h2>
            <p className="text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              {language === "fr" 
                ? "Nos coachs experts vous guident vers la réussite de vos examens SLE avec des méthodes éprouvées et un accompagnement personnalisé."
                : "Our expert coaches guide you to SLE exam success with proven methods and personalized support."}
            </p>
          </div>
          
          {/* Language Filters */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8 sm:mb-12">
            <FilterButton 
              active={languageFilter === "all"} 
              onClick={() => setLanguageFilter("all")}
            >
              {language === "fr" ? "Tous" : "All"}
            </FilterButton>
            <FilterButton 
              active={languageFilter === "french"} 
              onClick={() => setLanguageFilter("french")}
            >
              {language === "fr" ? "Français" : "French"}
            </FilterButton>
            <FilterButton 
              active={languageFilter === "english"} 
              onClick={() => setLanguageFilter("english")}
            >
              {language === "fr" ? "Anglais" : "English"}
            </FilterButton>
          </div>
          
          {/* Coach Cards Grid - Responsive */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-12">
            {filteredCoaches.length > 0 ? (
              filteredCoaches.map((coach) => (
                <CoachVideoCard 
                  key={coach.id} 
                  coach={coach} 
                  onPlayVideo={openVideoModal}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500 dark:text-gray-400">
                  {language === "fr" 
                    ? "Aucun coach trouvé pour ce filtre." 
                    : "No coaches found for this filter."}
                </p>
              </div>
            )}
          </div>
          
          {/* Global CTA */}
          <div className="text-center">
            <Link href="/coaches">
              <Button 
                variant="outline" 
                size="lg"
                className="glass-btn-outline rounded-full px-6 sm:px-8 h-12 sm:h-14 text-sm sm:text-lg font-semibold group"
              >
                <span>{language === "fr" ? "Découvrir Tous Nos Coachs" : "Discover All Our Coaches"}</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Video Modal */}
      <VideoModal 
        videoId={videoModal.videoId}
        coachName={videoModal.coachName}
        isOpen={videoModal.isOpen}
        onClose={closeVideoModal}
      />
    </>
  );
}
