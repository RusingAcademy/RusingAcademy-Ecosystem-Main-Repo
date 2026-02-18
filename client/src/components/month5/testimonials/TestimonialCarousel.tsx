/**
 * ============================================
 * TESTIMONIAL CAROUSEL — Auto-scrolling Carousel
 * ============================================
 * Month 5: Content Strategy & Conversion
 * 
 * Smooth carousel with auto-play, pause on hover,
 * navigation dots, and keyboard accessibility.
 */
import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { TESTIMONIALS, type Testimonial } from "@/lib/month5/testimonial-data";
import { TestimonialCard } from "./TestimonialCard";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";

interface TestimonialCarouselProps {
  testimonials?: Testimonial[];
  autoPlayInterval?: number;
  showNavigation?: boolean;
  showDots?: boolean;
  variant?: "default" | "featured";
  filterTag?: string;
  className?: string;
}

export function TestimonialCarousel({
  testimonials,
  autoPlayInterval = 6000,
  showNavigation = true,
  showDots = true,
  variant = "featured",
  filterTag,
  className = "",
}: TestimonialCarouselProps) {
  const { language } = useLanguage();
  const lang = language === "fr" ? "fr" : "en";

  const items = testimonials
    || (filterTag
      ? TESTIMONIALS.filter(t => t.personaTag === filterTag)
      : TESTIMONIALS.filter(t => t.featured));

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [direction, setDirection] = useState(1);
  const timerRef = useRef<ReturnType<typeof setInterval>>();

  const goTo = useCallback((index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  }, [currentIndex]);

  const goNext = useCallback(() => {
    setDirection(1);
    setCurrentIndex(prev => (prev + 1) % items.length);
  }, [items.length]);

  const goPrev = useCallback(() => {
    setDirection(-1);
    setCurrentIndex(prev => (prev - 1 + items.length) % items.length);
  }, [items.length]);

  // Auto-play
  useEffect(() => {
    if (isPaused || items.length <= 1) return;
    timerRef.current = setInterval(goNext, autoPlayInterval);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, goNext, autoPlayInterval, items.length]);

  // Keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") goPrev();
    if (e.key === "ArrowRight") goNext();
    if (e.key === " ") {
      e.preventDefault();
      setIsPaused(p => !p);
    }
  }, [goNext, goPrev]);

  if (items.length === 0) return null;

  const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? 300 : -300, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -300 : 300, opacity: 0 }),
  };

  const title = lang === "fr"
    ? "Ce que disent nos apprenants"
    : "What Our Learners Say";
  const subtitle = lang === "fr"
    ? "Témoignages authentiques de fonctionnaires fédéraux qui ont atteint leurs objectifs linguistiques"
    : "Authentic testimonials from federal public servants who achieved their language goals";

  return (
    <section
      className={`py-16 md:py-24 ${className}`}
      aria-labelledby="testimonial-carousel-title"
      aria-roledescription="carousel"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2
            id="testimonial-carousel-title"
            className="text-3xl md:text-4xl font-bold text-[var(--brand-foundation)] mb-3"
          >
            {title}
          </h2>
          <p className="text-lg text-[var(--sage-primary)] max-w-2xl mx-auto">{subtitle}</p>
        </div>

        <div
          className="relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          role="region"
          aria-label={lang === "fr" ? "Carrousel de témoignages" : "Testimonial carousel"}
        >
          {/* Carousel content */}
          <div className="overflow-hidden min-h-[320px] flex items-center">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="w-full"
                role="group"
                aria-roledescription="slide"
                aria-label={`${currentIndex + 1} ${lang === "fr" ? "de" : "of"} ${items.length}`}
              >
                <TestimonialCard
                  testimonial={items[currentIndex]}
                  variant={variant}
                  index={0}
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation arrows */}
          {showNavigation && items.length > 1 && (
            <>
              <button
                onClick={goPrev}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 p-2 rounded-full bg-white/60 backdrop-blur-md border border-white/40 shadow-md hover:bg-white/80 transition-all duration-300"
                aria-label={lang === "fr" ? "Témoignage précédent" : "Previous testimonial"}
              >
                <ChevronLeft className="w-5 h-5 text-[var(--brand-foundation)]" />
              </button>
              <button
                onClick={goNext}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 p-2 rounded-full bg-white/60 backdrop-blur-md border border-white/40 shadow-md hover:bg-white/80 transition-all duration-300"
                aria-label={lang === "fr" ? "Témoignage suivant" : "Next testimonial"}
              >
                <ChevronRight className="w-5 h-5 text-[var(--brand-foundation)]" />
              </button>
            </>
          )}
        </div>

        {/* Dots and play/pause */}
        {showDots && items.length > 1 && (
          <div className="flex items-center justify-center gap-3 mt-8">
            <button
              onClick={() => setIsPaused(p => !p)}
              className="p-1.5 rounded-full hover:bg-[var(--sage-soft)] transition-colors"
              aria-label={isPaused
                ? (lang === "fr" ? "Reprendre le carrousel" : "Resume carousel")
                : (lang === "fr" ? "Mettre en pause le carrousel" : "Pause carousel")
              }
            >
              {isPaused
                ? <Play className="w-4 h-4 text-[var(--sage-primary)]" />
                : <Pause className="w-4 h-4 text-[var(--sage-primary)]" />
              }
            </button>
            <div className="flex items-center gap-2" role="tablist">
              {items.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  className={`
                    rounded-full transition-all duration-300
                    ${i === currentIndex
                      ? "w-8 h-2.5 bg-[var(--brand-cta)]"
                      : "w-2.5 h-2.5 bg-[var(--sage-primary)]/30 hover:bg-[var(--sage-primary)]/50"
                    }
                  `}
                  role="tab"
                  aria-selected={i === currentIndex}
                  aria-label={`${lang === "fr" ? "Témoignage" : "Testimonial"} ${i + 1}`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default TestimonialCarousel;
