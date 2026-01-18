import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { ArrowRight, Calendar, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";

/**
 * HeroGoldStandard Component - Premium High-End Design
 * 
 * Page 13 Golden Standard:
 * - FR: "CHOISISSEZ VOTRE PARCOURS" + "Vers l'Excellence Bilingue"
 * - EN: "CHOOSE YOUR PATH" + "To Bilingual Excellence"
 * - Professional typewriter effect for headline
 * - Full-bleed background image (Steven + Ottawa Parliament)
 * - Premium glassmorphism with refined gold accents
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

  // Page 13 Golden Standard Text
  const labels = {
    // Main title - 3 lines with typewriter effect
    titleLine1: { en: "CHOOSE", fr: "CHOISISSEZ" },
    titleLine2: { en: "YOUR", fr: "VOTRE" },
    titleLine3: { en: "PATH", fr: "PARCOURS" },
    // Subtitle - italic elegant text
    subtitleLine1: { en: "To", fr: "Vers l'" },
    subtitleLine2: { en: "Bilingual Excellence", fr: "Excellence Bilingue" },
    // Description
    description: {
      en: "Built for Canadian public servants: SLE-focused learning, expert coaching, and premium media—so teams perform confidently in both official languages.",
      fr: "Conçu pour les fonctionnaires canadiens : apprentissage axé ELS, coaching d'experts et médias premium — pour des équipes confiantes dans les deux langues officielles.",
    },
    cta1: { en: "Explore Ecosystem", fr: "Explorer l'écosystème" },
    cta2: { en: "Book a Diagnostic", fr: "Réserver un diagnostic" },
  };

  // Typewriter animations with staggered delays
  const line1 = useTypewriter(labels.titleLine1[language], 90, 400);
  const line2 = useTypewriter(labels.titleLine2[language], 90, 400 + labels.titleLine1[language].length * 90 + 150);
  const line3 = useTypewriter(labels.titleLine3[language], 80, 400 + labels.titleLine1[language].length * 90 + 150 + labels.titleLine2[language].length * 90 + 150);
  
  // Show italic subtitle after typewriter completes
  useEffect(() => {
    if (line3.isComplete) {
      const timeout = setTimeout(() => setShowSubtitle(true), 300);
      return () => clearTimeout(timeout);
    }
  }, [line3.isComplete]);

  // Show CTA after subtitle
  useEffect(() => {
    if (showSubtitle) {
      const timeout = setTimeout(() => setShowCTA(true), 600);
      return () => clearTimeout(timeout);
    }
  }, [showSubtitle]);

  return (
    <section className="relative z-10 w-full">
      {/* Hero Container */}
      <div className="relative w-full min-h-[580px] md:min-h-[620px] lg:min-h-[680px] xl:min-h-[720px] overflow-hidden">
        
        {/* Background Image Layer */}
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: "url('/images/hero/hero-background-v4.png')",
            backgroundSize: "cover",
            backgroundPosition: "center center",
            backgroundRepeat: "no-repeat",
          }}
        />

        {/* Subtle gradient overlay for depth */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `
              linear-gradient(
                90deg,
                rgba(0, 0, 0, 0.06) 0%,
                rgba(0, 0, 0, 0.02) 25%,
                transparent 45%,
                transparent 100%
              )
            `,
          }}
        />

        {/* Content Container */}
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 h-full min-h-[580px] md:min-h-[620px] lg:min-h-[680px] xl:min-h-[720px]">
          <div className="flex items-center h-full py-10 lg:py-14">
            
            {/* Left Side: Glass Panel */}
            <motion.div
              initial={{ opacity: 0, x: -30, scale: 0.98 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="w-full max-w-[440px] lg:max-w-[470px] xl:max-w-[500px]"
            >
              {/* Premium Gold border container */}
              <div 
                className="relative rounded-[24px] p-[2.5px]"
                style={{
                  background: `
                    linear-gradient(
                      145deg,
                      rgba(212, 175, 105, 0.55) 0%,
                      rgba(232, 200, 120, 0.35) 25%,
                      rgba(212, 175, 105, 0.45) 50%,
                      rgba(184, 150, 74, 0.35) 75%,
                      rgba(212, 175, 105, 0.55) 100%
                    )
                  `,
                  boxShadow: `
                    0 30px 60px -15px rgba(0, 0, 0, 0.12),
                    0 15px 30px -10px rgba(0, 0, 0, 0.08),
                    0 0 0 1px rgba(212, 175, 105, 0.1)
                  `,
                }}
              >
                {/* Glass Panel - Premium Glassmorphism */}
                <div 
                  className="relative rounded-[22px] p-7 sm:p-9 lg:p-10 overflow-hidden"
                  style={{
                    background: `
                      linear-gradient(
                        160deg,
                        rgba(255, 254, 252, 0.94) 0%,
                        rgba(255, 253, 250, 0.90) 30%,
                        rgba(253, 251, 248, 0.87) 60%,
                        rgba(251, 249, 246, 0.85) 100%
                      )
                    `,
                    backdropFilter: "blur(24px) saturate(1.3)",
                    WebkitBackdropFilter: "blur(24px) saturate(1.3)",
                    boxShadow: `
                      inset 0 1px 3px rgba(255, 255, 255, 0.9),
                      inset 0 -1px 2px rgba(0, 0, 0, 0.02)
                    `,
                  }}
                >
                  {/* Inner highlight shimmer */}
                  <div 
                    className="absolute top-0 left-0 right-0 h-28 rounded-t-[22px] pointer-events-none"
                    style={{
                      background: "linear-gradient(to bottom, rgba(255, 255, 255, 0.6) 0%, transparent 100%)",
                    }}
                  />

                  {/* === ALL CONTENT INSIDE === */}
                  <div className="relative z-10">
                    
                    {/* Headline with Typewriter Effect - Page 13 Golden Standard */}
                    <div className="space-y-0 min-h-[200px] sm:min-h-[220px] lg:min-h-[250px]">
                      
                      {/* Line 1: CHOISISSEZ / CHOOSE */}
                      <div className="relative">
                        <h1
                          className="text-[1.85rem] sm:text-4xl lg:text-[2.6rem] xl:text-[2.85rem] font-black uppercase tracking-tight leading-[0.95]"
                          style={{ 
                            color: "#B8293D",
                            letterSpacing: "-0.02em",
                            textShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
                          }}
                        >
                          {line1.displayedText}
                          {line1.hasStarted && !line1.isComplete && (
                            <motion.span
                              animate={{ opacity: [1, 0] }}
                              transition={{ duration: 0.6, repeat: Infinity, repeatType: "reverse" }}
                              className="inline-block w-[3px] h-[0.85em] ml-1 align-middle rounded-sm"
                              style={{ backgroundColor: "#B8293D" }}
                            />
                          )}
                        </h1>
                      </div>

                      {/* Line 2: VOTRE / YOUR */}
                      <div className="relative">
                        <h1
                          className="text-[1.85rem] sm:text-4xl lg:text-[2.6rem] xl:text-[2.85rem] font-black uppercase tracking-tight leading-[0.95]"
                          style={{ 
                            color: "#D97706",
                            letterSpacing: "-0.02em",
                            textShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
                          }}
                        >
                          {line2.displayedText}
                          {line2.hasStarted && !line2.isComplete && (
                            <motion.span
                              animate={{ opacity: [1, 0] }}
                              transition={{ duration: 0.6, repeat: Infinity, repeatType: "reverse" }}
                              className="inline-block w-[3px] h-[0.85em] ml-1 align-middle rounded-sm"
                              style={{ backgroundColor: "#D97706" }}
                            />
                          )}
                        </h1>
                      </div>

                      {/* Line 3: PARCOURS / PATH */}
                      <div className="relative">
                        <h1
                          className="text-[1.85rem] sm:text-4xl lg:text-[2.6rem] xl:text-[2.85rem] font-black uppercase tracking-tight leading-[0.95]"
                          style={{ 
                            color: "#D97706",
                            letterSpacing: "-0.02em",
                            textShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
                          }}
                        >
                          {line3.displayedText}
                          {line3.hasStarted && !line3.isComplete && (
                            <motion.span
                              animate={{ opacity: [1, 0] }}
                              transition={{ duration: 0.6, repeat: Infinity, repeatType: "reverse" }}
                              className="inline-block w-[3px] h-[0.85em] ml-1 align-middle rounded-sm"
                              style={{ backgroundColor: "#D97706" }}
                            />
                          )}
                        </h1>
                      </div>

                      {/* Subtitle: Vers l'Excellence Bilingue / To Bilingual Excellence */}
                      <AnimatePresence>
                        {showSubtitle && (
                          <motion.div
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="pt-2"
                          >
                            <h2
                              className="text-xl sm:text-2xl lg:text-[1.65rem] xl:text-[1.85rem] font-normal text-slate-700 italic leading-[1.2]"
                              style={{ 
                                fontFamily: "'Playfair Display', Georgia, serif",
                              }}
                            >
                              {labels.subtitleLine1[language]}
                            </h2>
                            <h2
                              className="text-xl sm:text-2xl lg:text-[1.65rem] xl:text-[1.85rem] font-normal text-slate-700 italic leading-[1.2]"
                              style={{ 
                                fontFamily: "'Playfair Display', Georgia, serif",
                              }}
                            >
                              {labels.subtitleLine2[language]}
                            </h2>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Gold decorative line */}
                    <AnimatePresence>
                      {showSubtitle && (
                        <motion.div
                          initial={{ opacity: 0, scaleX: 0 }}
                          animate={{ opacity: 1, scaleX: 1 }}
                          transition={{ duration: 0.6, ease: "easeOut" }}
                          className="w-16 h-[3px] rounded-full my-5 origin-left"
                          style={{
                            background: "linear-gradient(90deg, #D4AF69 0%, #E8C878 50%, #D4AF69 100%)",
                            boxShadow: "0 1px 3px rgba(212, 175, 105, 0.3)",
                          }}
                        />
                      )}
                    </AnimatePresence>

                    {/* Description */}
                    <AnimatePresence>
                      {showSubtitle && (
                        <motion.p
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
                          className="text-sm sm:text-[0.95rem] lg:text-base text-slate-600 leading-relaxed mb-6"
                        >
                          {labels.description[language]}
                        </motion.p>
                      )}
                    </AnimatePresence>

                    {/* CTA Buttons */}
                    <AnimatePresence>
                      {showCTA && (
                        <motion.div
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, ease: "easeOut" }}
                          className="flex flex-col sm:flex-row gap-3"
                        >
                          {/* Primary CTA */}
                          <Button
                            size="lg"
                            className="group relative overflow-hidden rounded-xl px-6 py-3 text-white font-semibold shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5"
                            style={{
                              background: "linear-gradient(135deg, #D97706 0%, #B45309 100%)",
                            }}
                          >
                            <Calendar className="w-4 h-4 mr-2" />
                            {labels.cta2[language]}
                            <div 
                              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                              style={{
                                background: "linear-gradient(135deg, #EA8B0C 0%, #C45A09 100%)",
                              }}
                            />
                            <span className="relative z-10 flex items-center">
                              <Calendar className="w-4 h-4 mr-2" />
                              {labels.cta2[language]}
                            </span>
                          </Button>

                          {/* Secondary CTA */}
                          <Button
                            variant="outline"
                            size="lg"
                            className="group rounded-xl px-6 py-3 font-semibold border-2 border-slate-300 text-slate-700 hover:border-slate-400 hover:bg-slate-50 transition-all duration-300"
                          >
                            {labels.cta1[language]}
                            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                          </Button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
