import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { ArrowRight, Calendar, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";

/**
 * HeroGoldStandard Component - Premium High-End Design
 * 
 * Layout: Full-bleed tall hero image with faces at top.
 * Glassmorphism text panel anchored to the BOTTOM of the hero.
 * The top ~60% of the hero shows the professionals' faces clearly.
 * Responsive: works on mobile (320px+), tablet, laptop, desktop.
 */

function useTypewriter(text: string, speed: number = 80, delay: number = 0) {
  const [displayedText, setDisplayedText] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    setDisplayedText("");
    setIsComplete(false);
    setHasStarted(false);
    const startTimeout = setTimeout(() => setHasStarted(true), delay);
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

  const line1 = useTypewriter(labels.line1[language], 90, 400);
  const line2 = useTypewriter(labels.line2[language], 80, 400 + labels.line1[language].length * 90 + 200);
  
  useEffect(() => {
    if (line2.isComplete) {
      const timeout = setTimeout(() => setShowSubtitle(true), 300);
      return () => clearTimeout(timeout);
    }
  }, [line2.isComplete]);

  useEffect(() => {
    if (showSubtitle) {
      const timeout = setTimeout(() => setShowCTA(true), 600);
      return () => clearTimeout(timeout);
    }
  }, [showSubtitle]);

  return (
    <section className="relative z-10 w-full">
      {/* Hero Container - tall enough to show faces + panel */}
      <div 
        className="relative w-full overflow-hidden"
        style={{ minHeight: "clamp(520px, 85vh, 900px)" }}
      >
        
        {/* Background Image Layer - 4K optimized */}
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: "url('https://files.manuscdn.com/user_upload_by_module/session_file/310519663049070748/HSabwcSDIEgWJgqi.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center 25%",
            backgroundRepeat: "no-repeat",
          }}
        />

        {/* Gradient overlay: subtle at top (faces clear), stronger at bottom (text readability) */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `
              linear-gradient(
                to bottom,
                rgba(0, 0, 0, 0.02) 0%,
                rgba(0, 0, 0, 0.01) 30%,
                rgba(0, 0, 0, 0.08) 55%,
                rgba(0, 0, 0, 0.25) 80%,
                rgba(0, 0, 0, 0.35) 100%
              )
            `,
          }}
        />

        {/* Content: flex column, justify-end to push panel to bottom */}
        <div 
          className="relative z-10 w-full h-full flex flex-col justify-end"
          style={{ minHeight: "clamp(520px, 85vh, 900px)" }}
        >
          {/* Bottom panel area */}
          <div className="w-full px-4 sm:px-6 md:px-8 lg:px-10 xl:px-16 pb-8 sm:pb-10 md:pb-12 lg:pb-14">
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="mx-auto w-full max-w-[1100px]"
            >
              {/* Premium Gold border container */}
              <div 
                className="relative rounded-2xl sm:rounded-[22px] lg:rounded-[26px] p-[2px] sm:p-[2.5px]"
                style={{
                  background: `
                    linear-gradient(
                      145deg,
                      rgba(212, 175, 105, 0.65) 0%,
                      rgba(232, 200, 120, 0.45) 25%,
                      rgba(212, 175, 105, 0.55) 50%,
                      rgba(184, 150, 74, 0.45) 75%,
                      rgba(212, 175, 105, 0.65) 100%
                    )
                  `,
                  boxShadow: `
                    0 35px 70px -15px rgba(0, 0, 0, 0.25),
                    0 20px 40px -10px rgba(0, 0, 0, 0.15),
                    0 0 0 1px rgba(212, 175, 105, 0.2),
                    0 0 100px -30px rgba(212, 175, 105, 0.2)
                  `,
                }}
              >
                {/* Glass Panel */}
                <div 
                  className="relative rounded-[14px] sm:rounded-[20px] lg:rounded-[24px] overflow-hidden"
                  style={{
                    background: `
                      linear-gradient(
                        160deg,
                        rgba(255, 254, 252, 0.93) 0%,
                        rgba(255, 253, 250, 0.89) 30%,
                        rgba(253, 251, 248, 0.86) 60%,
                        rgba(251, 249, 246, 0.83) 100%
                      )
                    `,
                    backdropFilter: "blur(30px) saturate(1.4)",
                    WebkitBackdropFilter: "blur(30px) saturate(1.4)",
                    boxShadow: `
                      inset 0 1px 3px rgba(255, 255, 255, 0.9),
                      inset 0 -1px 2px rgba(0, 0, 0, 0.02)
                    `,
                  }}
                >
                  {/* Inner highlight shimmer */}
                  <div 
                    className="absolute top-0 left-0 right-0 h-16 sm:h-20 rounded-t-[24px] pointer-events-none"
                    style={{
                      background: "linear-gradient(to bottom, rgba(255, 255, 255, 0.6) 0%, transparent 100%)",
                    }}
                  />

                  {/* Content: two-column on lg+, stacked on mobile */}
                  <div className="relative z-10 p-5 sm:p-7 md:p-8 lg:p-10 xl:p-12">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:gap-10 xl:gap-14">
                      
                      {/* Left Column: Headlines + Tagline */}
                      <div className="flex-shrink-0 lg:w-[48%] xl:w-[45%]">
                        <div className="space-y-0 min-h-[120px] sm:min-h-[140px] lg:min-h-[155px]">
                          
                          {/* Line 1: CHOOSE */}
                          <h1
                            className="text-2xl sm:text-3xl md:text-[2.1rem] lg:text-[2.5rem] xl:text-[2.85rem] font-black uppercase tracking-tight leading-[0.95]"
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

                          {/* Line 2: YOUR PATH */}
                          <h1
                            className="text-2xl sm:text-3xl md:text-[2.1rem] lg:text-[2.5rem] xl:text-[2.85rem] font-black uppercase tracking-tight leading-[0.95]"
                            style={{ 
                              color: "#B8293D",
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
                                style={{ backgroundColor: "#B8293D" }}
                              />
                            )}
                          </h1>

                          {/* To Bilingual Excellence */}
                          <AnimatePresence>
                            {showSubtitle && (
                              <motion.div
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                                className="pt-1"
                              >
                                <h2
                                  className="text-lg sm:text-xl md:text-[1.35rem] lg:text-[1.55rem] xl:text-[1.75rem] font-normal text-slate-700 italic leading-[1.2]"
                                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                                >
                                  {labels.line3[language]}
                                </h2>
                                <h2
                                  className="text-lg sm:text-xl md:text-[1.35rem] lg:text-[1.55rem] xl:text-[1.75rem] font-normal text-slate-700 italic leading-[1.2]"
                                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
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
                                className="text-xs sm:text-sm lg:text-[13.5px] font-semibold text-amber-700 mt-2.5 tracking-wide"
                                style={{ fontFamily: "'Inter', sans-serif", letterSpacing: "0.01em" }}
                              >
                                {labels.tagline[language]}
                              </motion.p>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>

                      {/* Vertical gold divider - desktop only */}
                      <AnimatePresence>
                        {showSubtitle && (
                          <motion.div
                            initial={{ opacity: 0, scaleY: 0 }}
                            animate={{ opacity: 1, scaleY: 1 }}
                            transition={{ duration: 0.7, delay: 0.1 }}
                            className="hidden lg:block w-[2px] self-stretch origin-top rounded-full flex-shrink-0"
                            style={{
                              background: "linear-gradient(180deg, #D4AF69 0%, #E8C878 40%, rgba(212, 175, 105, 0.1) 100%)",
                            }}
                          />
                        )}
                      </AnimatePresence>

                      {/* Horizontal gold divider - mobile/tablet only */}
                      <AnimatePresence>
                        {showSubtitle && (
                          <motion.div
                            initial={{ opacity: 0, scaleX: 0 }}
                            animate={{ opacity: 1, scaleX: 1 }}
                            transition={{ duration: 0.7, delay: 0.1 }}
                            className="lg:hidden my-4 h-[2px] w-20 origin-left rounded-full"
                            style={{
                              background: "linear-gradient(90deg, #D4AF69 0%, #E8C878 50%, rgba(212, 175, 105, 0.15) 100%)",
                            }}
                          />
                        )}
                      </AnimatePresence>

                      {/* Right Column: Description + CTAs */}
                      <div className="flex-1">
                        {/* Subtitle description */}
                        <AnimatePresence>
                          {showSubtitle && (
                            <motion.p
                              initial={{ opacity: 0, y: 8 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.6, delay: 0.2 }}
                              className="text-[13px] sm:text-sm md:text-[14.5px] text-slate-600 leading-[1.75] max-w-[480px]"
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
                              className="mt-5 sm:mt-6 flex flex-col sm:flex-row gap-3"
                            >
                              {/* Primary CTA */}
                              <a href="#ecosystem">
                                <Button
                                  size="default"
                                  className="group w-full sm:w-auto px-5 sm:px-6 py-4 sm:py-5 text-[13px] sm:text-sm font-bold rounded-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
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

                              {/* Secondary CTA */}
                              <a 
                                href="https://calendly.com/steven-barholere/30min" 
                                target="_blank" 
                                rel="noopener noreferrer"
                              >
                                <Button
                                  size="default"
                                  variant="outline"
                                  className="group w-full sm:w-auto px-4 sm:px-5 py-4 sm:py-5 text-[13px] sm:text-sm font-semibold rounded-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                                  style={{
                                    background: "rgba(255, 255, 255, 0.9)",
                                    border: "2px solid rgba(212, 175, 105, 0.5)",
                                    color: "#5a5a5a",
                                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.04)",
                                  }}
                                >
                                  <Calendar className="mr-2 w-4 h-4 text-amber-600" />
                                  {labels.cta2[language]}
                                </Button>
                              </a>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom fade - seamless transition to white page */}
        <div 
          className="absolute bottom-0 left-0 right-0 h-12 pointer-events-none z-20"
          style={{
            background: "linear-gradient(to top, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.3) 50%, transparent 100%)",
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
