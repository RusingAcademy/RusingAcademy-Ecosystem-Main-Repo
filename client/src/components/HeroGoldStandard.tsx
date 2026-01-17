import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { ArrowRight, Calendar, Sparkles } from "lucide-react";

/**
 * HeroGoldStandard Component - Premium Design v3
 * 
 * Design Requirements:
 * - Full-bleed background image (Steven + Ottawa Parliament + flags)
 * - Steven's full body must remain visible, natural, high resolution
 * - ALL text and CTAs STRICTLY INSIDE the glass panel
 * - Glass panel positioned on the LEFT side, not covering Steven
 * - Premium glassmorphism effect with subtle gold border
 */
export default function HeroGoldStandard() {
  const { language } = useLanguage();

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
  };

  return (
    <section className="relative z-10 w-full">
      {/* Hero Container - Full viewport height minus header */}
      <div className="relative w-full min-h-[600px] md:min-h-[650px] lg:min-h-[700px] xl:min-h-[750px] overflow-hidden">
        
        {/* Background Image Layer - Full Bleed, High Resolution */}
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: "url('/images/hero/steven-hero-full.png')",
            backgroundSize: "cover",
            backgroundPosition: "center center",
            backgroundRepeat: "no-repeat",
          }}
        />

        {/* Subtle gradient overlay for better text contrast on left */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `
              linear-gradient(
                90deg,
                rgba(0, 0, 0, 0.08) 0%,
                rgba(0, 0, 0, 0.03) 30%,
                transparent 50%,
                transparent 100%
              )
            `,
          }}
        />

        {/* Content Container */}
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 h-full min-h-[600px] md:min-h-[650px] lg:min-h-[700px] xl:min-h-[750px]">
          <div className="flex items-center h-full py-8 lg:py-12">
            
            {/* Left Side: Glass Panel with ALL content inside */}
            <motion.div
              initial={{ opacity: 0, x: -40, scale: 0.97 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="w-full max-w-[460px] lg:max-w-[480px] xl:max-w-[500px]"
            >
              {/* Outer container with gold border */}
              <div 
                className="relative rounded-[20px] p-[2px]"
                style={{
                  background: `
                    linear-gradient(
                      145deg,
                      rgba(212, 175, 105, 0.6) 0%,
                      rgba(232, 200, 120, 0.4) 25%,
                      rgba(212, 175, 105, 0.5) 50%,
                      rgba(184, 150, 74, 0.4) 75%,
                      rgba(212, 175, 105, 0.6) 100%
                    )
                  `,
                  boxShadow: `
                    0 25px 50px -12px rgba(0, 0, 0, 0.15),
                    0 12px 24px -8px rgba(0, 0, 0, 0.1),
                    0 0 0 1px rgba(255, 255, 255, 0.1)
                  `,
                }}
              >
                {/* Glass Panel - ALL CONTENT INSIDE */}
                <div 
                  className="relative rounded-[18px] p-6 sm:p-8 lg:p-10 overflow-hidden"
                  style={{
                    background: `
                      linear-gradient(
                        160deg,
                        rgba(255, 253, 250, 0.92) 0%,
                        rgba(255, 252, 248, 0.88) 30%,
                        rgba(252, 250, 246, 0.85) 60%,
                        rgba(250, 248, 244, 0.82) 100%
                      )
                    `,
                    backdropFilter: "blur(20px) saturate(1.2)",
                    WebkitBackdropFilter: "blur(20px) saturate(1.2)",
                    boxShadow: `
                      inset 0 1px 2px rgba(255, 255, 255, 0.8),
                      inset 0 -1px 1px rgba(0, 0, 0, 0.02)
                    `,
                  }}
                >
                  {/* Inner highlight */}
                  <div 
                    className="absolute top-0 left-0 right-0 h-24 rounded-t-[18px] pointer-events-none"
                    style={{
                      background: "linear-gradient(to bottom, rgba(255, 255, 255, 0.5) 0%, transparent 100%)",
                    }}
                  />

                  {/* === ALL CONTENT STRICTLY INSIDE === */}
                  <div className="relative z-10">
                    
                    {/* Headline: CHOOSE YOUR PATH */}
                    <div className="space-y-0">
                      <motion.h1
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.15 }}
                        className="text-3xl sm:text-4xl lg:text-[2.75rem] xl:text-5xl font-black uppercase tracking-tight leading-[0.95]"
                        style={{ 
                          color: "#B8293D",
                          letterSpacing: "-0.02em",
                        }}
                      >
                        {labels.line1[language]}
                      </motion.h1>

                      <motion.h1
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.25 }}
                        className="text-3xl sm:text-4xl lg:text-[2.75rem] xl:text-5xl font-black uppercase tracking-tight leading-[0.95]"
                        style={{ 
                          color: "#B8293D",
                          letterSpacing: "-0.02em",
                        }}
                      >
                        {labels.line2[language]}
                      </motion.h1>

                      {/* To Bilingual Success - Elegant italic */}
                      <motion.h2
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.35 }}
                        className="text-xl sm:text-2xl lg:text-[1.75rem] xl:text-3xl font-normal text-slate-700 italic leading-[1.15] pt-1"
                        style={{ 
                          fontFamily: "'Playfair Display', Georgia, serif",
                        }}
                      >
                        {labels.line3[language]}
                      </motion.h2>

                      <motion.h2
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="text-xl sm:text-2xl lg:text-[1.75rem] xl:text-3xl font-normal text-slate-700 italic leading-[1.15]"
                        style={{ 
                          fontFamily: "'Playfair Display', Georgia, serif",
                        }}
                      >
                        {labels.line4[language]}
                      </motion.h2>
                    </div>

                    {/* Gold decorative line */}
                    <motion.div
                      initial={{ opacity: 0, scaleX: 0 }}
                      animate={{ opacity: 1, scaleX: 1 }}
                      transition={{ duration: 0.6, delay: 0.45 }}
                      className="my-5 h-[2px] w-20 origin-left rounded-full"
                      style={{
                        background: "linear-gradient(90deg, #D4AF69 0%, #E8C878 60%, rgba(212, 175, 105, 0.2) 100%)",
                      }}
                    />

                    {/* Subtitle - INSIDE the panel */}
                    <motion.p
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.5 }}
                      className="text-sm sm:text-[13px] lg:text-sm text-slate-600 leading-[1.7] max-w-[400px]"
                    >
                      {labels.subtitle[language]}
                    </motion.p>

                    {/* CTA Buttons - INSIDE the panel */}
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.6 }}
                      className="mt-6 flex flex-col sm:flex-row gap-3"
                    >
                      {/* Primary CTA - Orange */}
                      <a href="#ecosystem">
                        <Button
                          size="default"
                          className="group w-full sm:w-auto px-5 py-4 text-sm font-bold rounded-xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
                          style={{ 
                            background: "linear-gradient(135deg, #FF6A2B 0%, #FF8142 100%)",
                            color: "white",
                            boxShadow: `
                              0 8px 20px -4px rgba(255, 106, 43, 0.4),
                              0 3px 6px rgba(0, 0, 0, 0.06),
                              inset 0 1px 0 rgba(255, 255, 255, 0.15)
                            `,
                          }}
                        >
                          <Sparkles className="mr-2 w-4 h-4" />
                          {labels.cta1[language]}
                          <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                        </Button>
                      </a>

                      {/* Secondary CTA - Gold border */}
                      <a 
                        href="https://calendly.com/steven-barholere/30min" 
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        <Button
                          size="default"
                          variant="outline"
                          className="group w-full sm:w-auto px-4 py-4 text-sm font-semibold rounded-xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
                          style={{
                            background: "rgba(255, 255, 255, 0.85)",
                            border: "1.5px solid rgba(212, 175, 105, 0.6)",
                            color: "#5a5a5a",
                          }}
                        >
                          <Calendar className="mr-2 w-4 h-4 text-amber-600" />
                          {labels.cta2[language]}
                        </Button>
                      </a>
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right Side: Empty - Steven is in the background image */}
            <div className="hidden lg:block flex-1" />
          </div>
        </div>

        {/* Bottom fade to white for smooth transition */}
        <div 
          className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none"
          style={{
            background: "linear-gradient(to top, rgba(255, 255, 255, 0.95) 0%, transparent 100%)",
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
