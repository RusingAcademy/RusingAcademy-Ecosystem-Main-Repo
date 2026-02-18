import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { ArrowRight, Calendar, Sparkles } from "lucide-react";
import { useState, useEffect, useRef } from "react";

/**
 * HeroGoldStandard Component - Premium Ultra-Transparent Glassmorphism
 * 
 * MgCréa-inspired design:
 * - Professional typewriter effect for headline
 * - Full-bleed background image (Steven + Ottawa Parliament) is the STAR
 * - ULTRA-TRANSPARENT glass panel: rgba(255,255,255,0.08-0.12)
 * - backdrop-filter: blur(8px) — subtle frosted glass, NOT opaque
 * - Very subtle border: 1px solid rgba(255,255,255,0.15)
 * - NO gold/amber border, NO cream/beige solid background
 * - White text for contrast against the hero image
 * - Subtle parallax scroll effect on background
 */

// Typewriter Hook - Professional typing animation
function useTypewriter(text: string, speed: number = 80, delay: number = 0) {
  const [displayedText, setDisplayedText] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    setDisplayedText("");
    setIsComplete(false);
    setHasStarted(false);

    const startTimeout = setTimeout(() => {
      setHasStarted(true);
    }, delay);

    return () => clearTimeout(startTimeout);
  }, [text, delay]);

  useEffect(() => {
    if (!hasStarted) return;

    if (displayedText.length < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(text.slice(0, displayedText.length + 1));
      }, speed);
      return () => clearTimeout(timeout);
    } else {
      setIsComplete(true);
    }
  }, [displayedText, text, speed, hasStarted]);

  return { displayedText, isComplete, hasStarted };
}

export default function HeroGoldStandard() {
  const { language } = useLanguage();
  const [showSubtitle, setShowSubtitle] = useState(false);
  const [showCTA, setShowCTA] = useState(false);
  const heroRef = useRef<HTMLElement>(null);

  // Parallax scroll effect
  const { scrollY } = useScroll();
  const backgroundY = useTransform(scrollY, [0, 700], [0, 150]);

  const labels = {
    line1: { en: "CHOOSE", fr: "CHOISISSEZ" },
    line2: { en: "YOUR PATH", fr: "VOTRE PARCOURS" },
    line3: { en: "To Bilingual", fr: "Vers l'" },
    line4: { en: "Excellence", fr: "Excellence Bilingue" },
    subtitle: {
      en: "Built for Canadian public servants: SLE-focused learning, expert coaching, and premium media—so teams perform confidently in both official languages.",
      fr: "Conçu pour les fonctionnaires canadiens : apprentissage axé ELS, coaching d'experts et médias premium — pour des équipes confiantes dans les deux langues officielles.",
    },
    cta1: { en: "Explore Ecosystem", fr: "Explorer l'écosystème" },
    cta2: { en: "Book a Diagnostic", fr: "Réserver un diagnostic" },
    tagline: {
      en: "Secure your C level. Propel your federal career.",
      fr: "Sécurisez votre niveau C. Propulsez votre carrière fédérale."
    },
  };

  // Typewriter animations with staggered delays
  const line1 = useTypewriter(labels.line1[language], 90, 400);
  const line2 = useTypewriter(labels.line2[language], 80, 400 + labels.line1[language].length * 90 + 200);
  
  // Show italic text after typewriter completes
  useEffect(() => {
    if (line2.isComplete) {
      const timeout = setTimeout(() => setShowSubtitle(true), 300);
      return () => clearTimeout(timeout);
    }
  }, [line2.isComplete]);

  // Show CTA after subtitle
  useEffect(() => {
    if (showSubtitle) {
      const timeout = setTimeout(() => setShowCTA(true), 600);
      return () => clearTimeout(timeout);
    }
  }, [showSubtitle]);

  return (
    <section ref={heroRef} className="relative z-10 w-full">
      {/* Hero Container */}
      <div className="relative w-full min-h-[580px] md:min-h-[620px] lg:min-h-[680px] xl:min-h-[720px] overflow-hidden">
        
        {/* Background Image Layer with Parallax */}
        <motion.div 
          className="absolute inset-0 will-change-transform"
          style={{
            backgroundImage: "url('https://rusingacademy-cdn.b-cdn.net/images/hero/hero-background-v4.png')",
            backgroundSize: "cover",
            backgroundPosition: "center center",
            backgroundRepeat: "no-repeat",
            y: backgroundY,
            scale: 1.1,
          }}
        />

        {/* Subtle dark overlay for text readability on hero image */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `
              linear-gradient(
                90deg,
                rgba(0, 0, 0, 0.35) 0%,
                rgba(0, 0, 0, 0.18) 35%,
                rgba(0, 0, 0, 0.05) 55%,
                transparent 100%
              )
            `,
          }}
        />

        {/* Content Container */}
        <div className="relative z-10 container mx-auto px-6 md:px-8 lg:px-12 h-full min-h-[580px] md:min-h-[620px] lg:min-h-[680px] xl:min-h-[720px]">
          <div className="flex items-center h-full py-10 lg:py-14">
            
            {/* Left Side: Ultra-Transparent Glass Panel */}
            <motion.div
              initial={{ opacity: 0, x: -30, scale: 0.98 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="w-full max-w-[440px] lg:max-w-[470px] xl:max-w-[500px] mx-auto sm:ml-12 lg:ml-20 xl:ml-28"
            >
              {/* Ultra-Transparent Glass Panel — MgCréa Style */}
              <div 
                className="relative rounded-[24px] p-6 sm:p-9 lg:p-10 overflow-hidden"
                style={{
                  background: `
                    linear-gradient(
                      160deg,
                      rgba(255, 255, 255, 0.12) 0%,
                      rgba(255, 255, 255, 0.08) 50%,
                      rgba(255, 255, 255, 0.06) 100%
                    )
                  `,
                  backdropFilter: "blur(8px) saturate(1.2)",
                  WebkitBackdropFilter: "blur(8px) saturate(1.2)",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                  boxShadow: `
                    0 8px 32px rgba(0, 0, 0, 0.12),
                    inset 0 1px 0 rgba(255, 255, 255, 0.15)
                  `,
                }}
              >
                {/* Subtle top highlight for glass depth */}
                <div 
                  className="absolute top-0 left-0 right-0 h-px rounded-t-[24px] pointer-events-none"
                  style={{
                    background: "linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.3) 50%, transparent 100%)",
                  }}
                />

                {/* === ALL CONTENT INSIDE === */}
                <div className="relative z-10">
                  
                  {/* Headline with Typewriter Effect */}
                  <div className="space-y-0 min-h-[170px] sm:min-h-[190px] lg:min-h-[210px]">
                    
                    {/* Line 1: CHOOSE - Typewriter */}
                    <div className="relative">
                      <h1
                        className="text-[1.85rem] sm:text-4xl lg:text-[2.6rem] xl:text-[2.85rem] font-black uppercase tracking-tight leading-[0.95]"
                        style={{ 
                          color: "#FFFFFF",
                          letterSpacing: "-0.02em",
                          textShadow: "0 2px 8px rgba(0, 0, 0, 0.3), 0 1px 3px rgba(0, 0, 0, 0.2)",
                        }}
                      >
                        {line1.displayedText}
                        {/* Blinking cursor */}
                        {line1.hasStarted && !line1.isComplete && (
                          <motion.span
                            animate={{ opacity: [1, 0] }}
                            transition={{ duration: 0.6, repeat: Infinity, repeatType: "reverse" }}
                            className="inline-block w-[3px] h-[0.85em] ml-1 align-middle rounded-sm"
                            style={{ backgroundColor: "#FFFFFF" }}
                          />
                        )}
                      </h1>
                    </div>

                    {/* Line 2: YOUR PATH - Typewriter */}
                    <div className="relative">
                      <h1
                        className="text-[1.85rem] sm:text-4xl lg:text-[2.6rem] xl:text-[2.85rem] font-black uppercase tracking-tight leading-[0.95]"
                        style={{ 
                          color: "#FFFFFF",
                          letterSpacing: "-0.02em",
                          textShadow: "0 2px 8px rgba(0, 0, 0, 0.3), 0 1px 3px rgba(0, 0, 0, 0.2)",
                        }}
                      >
                        {line2.displayedText}
                        {/* Blinking cursor */}
                        {line2.hasStarted && !line2.isComplete && (
                          <motion.span
                            animate={{ opacity: [1, 0] }}
                            transition={{ duration: 0.6, repeat: Infinity, repeatType: "reverse" }}
                            className="inline-block w-[3px] h-[0.85em] ml-1 align-middle rounded-sm"
                            style={{ backgroundColor: "#FFFFFF" }}
                          />
                        )}
                      </h1>
                    </div>

                    {/* Lines 3-4: To Bilingual Excellence - Elegant fade in */}
                    <AnimatePresence>
                      {showSubtitle && (
                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                        >
                          <h2
                            className="text-xl sm:text-2xl lg:text-[1.65rem] xl:text-[1.85rem] font-normal italic leading-[1.2] pt-1"
                            style={{ 
                              fontFamily: "'Playfair Display', Georgia, serif",
                              color: "rgba(255, 255, 255, 0.95)",
                              textShadow: "0 1px 4px rgba(0, 0, 0, 0.2)",
                            }}
                          >
                            {labels.line3[language]}
                          </h2>
                          <h2
                            className="text-xl sm:text-2xl lg:text-[1.65rem] xl:text-[1.85rem] font-normal italic leading-[1.2]"
                            style={{ 
                              fontFamily: "'Playfair Display', Georgia, serif",
                              color: "rgba(255, 255, 255, 0.95)",
                              textShadow: "0 1px 4px rgba(0, 0, 0, 0.2)",
                            }}
                          >
                            {labels.line4[language]}
                          </h2>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    
                    {/* Tagline */}
                    <AnimatePresence>
                      {showSubtitle && (
                        <motion.p
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, delay: 0.15 }}
                          className="text-sm sm:text-base lg:text-[15px] font-medium mt-3 tracking-wide"
                          style={{ 
                            fontFamily: "'Inter', sans-serif",
                            letterSpacing: "0.01em",
                            color: "rgba(255, 255, 255, 0.85)",
                            textShadow: "0 1px 3px rgba(0, 0, 0, 0.15)",
                          }}
                        >
                          {labels.tagline[language]}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Subtle white decorative line (replacing gold) */}
                  <AnimatePresence>
                    {showSubtitle && (
                      <motion.div
                        initial={{ opacity: 0, scaleX: 0 }}
                        animate={{ opacity: 1, scaleX: 1 }}
                        transition={{ duration: 0.7, delay: 0.1 }}
                        className="my-5 h-[1.5px] w-24 origin-left rounded-full"
                        style={{
                          background: "linear-gradient(90deg, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0.3) 50%, transparent 100%)",
                        }}
                      />
                    )}
                  </AnimatePresence>

                  {/* Subtitle */}
                  <AnimatePresence>
                    {showSubtitle && (
                      <motion.p
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-[13px] sm:text-sm lg:text-[13.5px] leading-[1.75] max-w-[380px]"
                        style={{
                          color: "rgba(255, 255, 255, 0.80)",
                          textShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
                        }}
                      >
                        {labels.subtitle[language]}
                      </motion.p>
                    )}
                  </AnimatePresence>

                  {/* CTA Buttons */}
                  <AnimatePresence>
                    {showCTA && (
                      <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="mt-7 flex flex-col sm:flex-row gap-3"
                      >
                        {/* Primary CTA - Orange Gradient */}
                        <a href="#ecosystem">
                          <Button
                            size="default"
                            className="group w-full sm:w-auto px-6 py-5 text-sm font-bold rounded-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                            style={{ 
                              background: "linear-gradient(135deg, #FF6A2B 0%, #FF8142 50%, #FF9A5C 100%)",
                              color: "white",
                              boxShadow: `
                                0 10px 25px -5px rgba(255, 106, 43, 0.45),
                                0 4px 8px rgba(0, 0, 0, 0.06),
                                inset 0 1px 0 rgba(255, 255, 255, 0.2)
                              `,
                            }}
                          >
                            <Sparkles className="mr-2 w-4 h-4" />
                            {labels.cta1[language]}
                            <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                          </Button>
                        </a>

                        {/* Secondary CTA - Glass style to match panel */}
                        <a 
                          href="https://calendly.com/steven-barholere/30min" 
                          target="_blank" 
                          rel="noopener noreferrer"
                        >
                          <Button
                            size="default"
                            variant="outline"
                            className="group w-full sm:w-auto px-5 py-5 text-sm font-semibold rounded-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                            style={{
                              background: "rgba(255, 255, 255, 0.12)",
                              border: "1px solid rgba(255, 255, 255, 0.3)",
                              color: "#FFFFFF",
                              backdropFilter: "blur(4px)",
                              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
                              textShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
                            }}
                          >
                            <Calendar className="mr-2 w-4 h-4" />
                            {labels.cta2[language]}
                          </Button>
                        </a>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>

            {/* Right Side: Empty - Steven in background */}
            <div className="hidden lg:block flex-1" />
          </div>
        </div>

        {/* Bottom fade - seamless transition */}
        <div 
          className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none"
          style={{
            background: "linear-gradient(to top, rgba(255, 255, 255, 0.98) 0%, rgba(255, 255, 255, 0.9) 50%, transparent 100%)",
          }}
        />
      </div>

      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400;1,500&display=swap');
      `}</style>
    </section>
  );
}
