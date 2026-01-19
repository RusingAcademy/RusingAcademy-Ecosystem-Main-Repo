import { useState, useEffect } from "react";
import { X, Play, ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

/**
 * ProofStrip - Sticky Bottom Proof Strip Component
 * 
 * Per Guide Maître v3.0 and design-tokens.json specifications:
 * - Height: 76px desktop / 84px mobile
 * - Glassmorphism background with blur
 * - 6 items desktop / 3 items mobile
 * - Closeable with 30-day localStorage persistence
 * - Opens modal on click for video playback
 */

// Design tokens from design-tokens.json v3.0
const TOKENS = {
  proofStrip: {
    height: { desktop: 76, mobile: 84 },
    bg: "rgba(255,255,255,0.72)",
    blurPx: 10,
    borderTop: "#E7E7DF",
    shadow: "0 6px 18px rgba(15, 23, 42, 0.10)",
    zIndex: 900,
    items: { desktop: 6, mobile: 3 },
    thumbRadius: 12,
    closePersistDays: 30,
    storageKey: "rusingacademy_proofstrip_closed_until",
    modal: { zIndex: 2000, overlay: "rgba(11,18,32,0.55)" },
  },
  motion: {
    fast: "150ms",
    base: "220ms",
    ease: "cubic-bezier(0.2, 0.8, 0.2, 1)",
  },
};

// Video content items - these would typically come from an API or CMS
interface ProofItem {
  id: string;
  thumbnail: string;
  title: string;
  titleFr: string;
  category: "testimonial" | "tip" | "capsule";
  videoUrl?: string;
  duration?: string;
}

const proofItems: ProofItem[] = [
  {
    id: "1",
    thumbnail: "https://d2xsxph8kpxj0f.cloudfront.net/310519663049070748/gvnmYNphKZgt9jM9K8Vi9K/videos/thumbs/short_barholex_gc_exam_prep_intro_01_thumb.webp",
    title: "SLE Success Story",
    titleFr: "Témoignage de réussite ELS",
    category: "testimonial",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    duration: "2:34",
  },
  {
    id: "2",
    thumbnail: "https://d2xsxph8kpxj0f.cloudfront.net/310519663049070748/gvnmYNphKZgt9jM9K8Vi9K/videos/thumbs/short_barholex_gc_exam_prep_intro_02_thumb.webp",
    title: "Oral Exam Tips",
    titleFr: "Conseils pour l'examen oral",
    category: "tip",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    duration: "1:45",
  },
  {
    id: "3",
    thumbnail: "https://d2xsxph8kpxj0f.cloudfront.net/310519663049070748/gvnmYNphKZgt9jM9K8Vi9K/videos/thumbs/capsule_sle_oral_introduction_01_thumb.webp",
    title: "Learning Capsule: Introduction",
    titleFr: "Capsule d'apprentissage: Introduction",
    category: "capsule",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    duration: "5:12",
  },
  {
    id: "4",
    thumbnail: "https://d2xsxph8kpxj0f.cloudfront.net/310519663049070748/gvnmYNphKZgt9jM9K8Vi9K/videos/thumbs/coach_steven_intro_01_thumb.webp",
    title: "Meet Coach Steven",
    titleFr: "Rencontrez le coach Steven",
    category: "testimonial",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    duration: "3:21",
  },
  {
    id: "5",
    thumbnail: "https://d2xsxph8kpxj0f.cloudfront.net/310519663049070748/gvnmYNphKZgt9jM9K8Vi9K/videos/thumbs/short_barholex_gc_exam_prep_intro_03_thumb.webp",
    title: "BBB to CBC Journey",
    titleFr: "Parcours BBB vers CBC",
    category: "testimonial",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    duration: "4:15",
  },
  {
    id: "6",
    thumbnail: "https://d2xsxph8kpxj0f.cloudfront.net/310519663049070748/gvnmYNphKZgt9jM9K8Vi9K/videos/thumbs/capsule_sle_oral_introduction_02_thumb.webp",
    title: "Written Exam Strategies",
    titleFr: "Stratégies pour l'examen écrit",
    category: "tip",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    duration: "2:58",
  },
];

export default function ProofStrip() {
  const { language } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ProofItem | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Check if strip should be visible based on localStorage
  useEffect(() => {
    const closedUntil = localStorage.getItem(TOKENS.proofStrip.storageKey);
    if (closedUntil) {
      const closedDate = new Date(closedUntil);
      if (closedDate > new Date()) {
        setIsVisible(false);
        return;
      }
    }
    // Delay showing the strip for better UX
    const timer = setTimeout(() => setIsVisible(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Handle responsive items count
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    // Set localStorage to hide for 30 days
    const closedUntil = new Date();
    closedUntil.setDate(closedUntil.getDate() + TOKENS.proofStrip.closePersistDays);
    localStorage.setItem(TOKENS.proofStrip.storageKey, closedUntil.toISOString());
  };

  const handleItemClick = (item: ProofItem) => {
    setSelectedItem(item);
  };

  const handleCloseModal = () => {
    setSelectedItem(null);
  };

  const visibleItemsCount = isMobile ? TOKENS.proofStrip.items.mobile : TOKENS.proofStrip.items.desktop;
  const maxIndex = Math.max(0, proofItems.length - visibleItemsCount);

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  };

  const visibleItems = proofItems.slice(currentIndex, currentIndex + visibleItemsCount);

  // Check for reduced motion preference
  const prefersReducedMotion = typeof window !== "undefined" 
    ? window.matchMedia("(prefers-reduced-motion: reduce)").matches 
    : false;

  if (!isVisible) return null;

  return (
    <>
      {/* Proof Strip */}
      <div
        className="fixed bottom-0 left-0 right-0 border-t"
        style={{
          height: isMobile ? TOKENS.proofStrip.height.mobile : TOKENS.proofStrip.height.desktop,
          backgroundColor: TOKENS.proofStrip.bg,
          backdropFilter: `blur(${TOKENS.proofStrip.blurPx}px)`,
          WebkitBackdropFilter: `blur(${TOKENS.proofStrip.blurPx}px)`,
          borderTopColor: TOKENS.proofStrip.borderTop,
          boxShadow: TOKENS.proofStrip.shadow,
          zIndex: TOKENS.proofStrip.zIndex,
          transition: prefersReducedMotion ? "none" : `transform ${TOKENS.motion.base} ${TOKENS.motion.ease}`,
        }}
        role="complementary"
        aria-label={language === "fr" ? "Contenu vedette" : "Featured content"}
      >
        <div className="container mx-auto px-4 h-full flex items-center gap-3">
          {/* Navigation - Previous */}
          {currentIndex > 0 && (
            <button
              onClick={handlePrev}
              className="flex-shrink-0 h-8 w-8 rounded-full bg-white/80 border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-white hover:text-gray-900 transition-colors"
              aria-label={language === "fr" ? "Précédent" : "Previous"}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
          )}

          {/* Items Container */}
          <div className="flex-1 flex items-center justify-center gap-3 overflow-hidden">
            {visibleItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleItemClick(item)}
                className="relative group flex-shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 rounded-xl"
                aria-label={language === "fr" ? item.titleFr : item.title}
              >
                <div
                  className="relative overflow-hidden"
                  style={{
                    width: isMobile ? 80 : 100,
                    height: isMobile ? 56 : 64,
                    borderRadius: TOKENS.proofStrip.thumbRadius,
                  }}
                >
                  <img
                    src={item.thumbnail}
                    alt=""
                    className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                    loading="lazy"
                  />
                  {/* Play overlay */}
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Play className="h-6 w-6 text-white fill-white" />
                  </div>
                  {/* Duration badge */}
                  {item.duration && (
                    <span className="absolute bottom-1 right-1 bg-black/70 text-white text-[10px] px-1.5 py-0.5 rounded">
                      {item.duration}
                    </span>
                  )}
                </div>
                {/* Title on desktop */}
                {!isMobile && (
                  <span className="absolute -bottom-5 left-0 right-0 text-[10px] text-gray-600 truncate text-center">
                    {language === "fr" ? item.titleFr : item.title}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Navigation - Next */}
          {currentIndex < maxIndex && (
            <button
              onClick={handleNext}
              className="flex-shrink-0 h-8 w-8 rounded-full bg-white/80 border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-white hover:text-gray-900 transition-colors"
              aria-label={language === "fr" ? "Suivant" : "Next"}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          )}

          {/* Close Button */}
          <button
            onClick={handleClose}
            className="flex-shrink-0 h-8 w-8 rounded-full bg-white/80 border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-white hover:text-gray-900 transition-colors"
            aria-label={language === "fr" ? "Fermer" : "Close"}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Video Modal */}
      {selectedItem && (
        <div
          className="fixed inset-0 flex items-center justify-center p-4"
          style={{
            zIndex: TOKENS.proofStrip.modal.zIndex,
            backgroundColor: TOKENS.proofStrip.modal.overlay,
          }}
          onClick={handleCloseModal}
          role="dialog"
          aria-modal="true"
          aria-label={language === "fr" ? selectedItem.titleFr : selectedItem.title}
        >
          <div
            className="relative bg-white rounded-2xl overflow-hidden shadow-2xl w-full max-w-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="font-semibold text-gray-900">
                {language === "fr" ? selectedItem.titleFr : selectedItem.title}
              </h3>
              <button
                onClick={handleCloseModal}
                className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 hover:text-gray-900 transition-colors"
                aria-label={language === "fr" ? "Fermer" : "Close"}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            
            {/* Video Player */}
            <div className="aspect-video bg-black">
              {selectedItem.videoUrl ? (
                <iframe
                  src={selectedItem.videoUrl}
                  title={language === "fr" ? selectedItem.titleFr : selectedItem.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white">
                  <Play className="h-16 w-16" />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
