import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { ArrowRight, Calendar, Sparkles } from "lucide-react";

/**
 * HeroGoldStandard Component - Ultra-Premium Design
 * 
 * A stunning, magazine-quality hero section featuring:
 * - Full-bleed background image (Steven + Ottawa Parliament + flags)
 * - Elegant frosted glass panel with gold/ivory border
 * - Premium typography with refined spacing
 * - Subtle animations and micro-interactions
 * - Professional, luxurious aesthetic
 */
export default function HeroGoldStandard() {
  const { language } = useLanguage();

  const labels = {
    line1: { en: "CHOOSE", fr: "CHOISISSEZ" },
    line2: { en: "YOUR PATH", fr: "VOTRE PARCOURS" },
    line3: { en: "To Bilingual", fr: "Vers le bilinguisme" },
    line4: { en: "Success", fr: "Réussi" },
    subtitle: {
      en: "Built for Canadian public servants: SLE-focused learning, expert coaching, and premium media—so teams perform confidently in both official languages.",
      fr: "Conçu pour les fonctionnaires canadiens : apprentissage axé ELS, coaching d'experts et médias premium — pour des équipes confiantes dans les deux langues officielles.",
    },
    cta1: { en: "Explore Ecosystem", fr: "Explorer l'écosystème" },
    cta2: { en: "Book a Diagnostic (30 min)", fr: "Réserver un diagnostic (30 min)" },
  };

  return (
    <section className="relative z-10 w-full">
      {/* Hero Container */}
      <div className="relative w-full min-h-[650px] lg:min-h-[720px] xl:min-h-[780px] overflow-hidden">
        
        {/* Background Image Layer */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/images/hero/steven-hero-full.png')",
            backgroundPosition: "center center",
          }}
        />

        {/* Elegant Gradient Overlay - Creates depth and contrast */}
        <div 
          className="absolute inset-0"
          style={{
            background: `
              linear-gradient(
                135deg,
                rgba(15, 23, 42, 0.08) 0%,
                rgba(15, 23, 42, 0.03) 30%,
                transparent 50%,
                transparent 100%
              )
            `,
          }}
        />

        {/* Subtle Vignette Effect */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `
              radial-gradient(
                ellipse 120% 100% at 100% 50%,
                transparent 40%,
                rgba(0, 0, 0, 0.02) 100%
              )
            `,
          }}
        />

        {/* Content Container */}
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 h-full min-h-[650px] lg:min-h-[720px] xl:min-h-[780px]">
          <div className="flex items-center h-full py-16 lg:py-20">
            
            {/* Left Side: Premium Glass Panel */}
            <motion.div
              initial={{ opacity: 0, x: -60, scale: 0.98 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="w-full lg:w-[46%] xl:w-[44%]"
            >
              {/* Outer Glow Effect */}
              <div 
                className="relative"
                style={{
                  filter: "drop-shadow(0 25px 50px rgba(180, 140, 80, 0.12))",
                }}
              >
                {/* Gold Border Container */}
                <div 
                  className="relative p-[2px] rounded-[28px]"
                  style={{
                    background: `
                      linear-gradient(
                        145deg,
                        rgba(212, 175, 105, 0.7) 0%,
                        rgba(180, 140, 80, 0.5) 25%,
                        rgba(255, 215, 140, 0.6) 50%,
                        rgba(180, 140, 80, 0.5) 75%,
                        rgba(212, 175, 105, 0.7) 100%
                      )
                    `,
                  }}
                >
                  {/* Inner Glass Panel */}
                  <div 
                    className="relative p-8 sm:p-10 lg:p-12 xl:p-14 rounded-[26px] overflow-hidden"
                    style={{
                      background: `
                        linear-gradient(
                          155deg,
                          rgba(255, 253, 248, 0.92) 0%,
                          rgba(255, 251, 245, 0.88) 40%,
                          rgba(252, 250, 245, 0.85) 100%
                        )
                      `,
                      backdropFilter: "blur(32px) saturate(1.2)",
                      WebkitBackdropFilter: "blur(32px) saturate(1.2)",
                      boxShadow: `
                        inset 0 1px 1px rgba(255, 255, 255, 0.9),
                        inset 0 -1px 1px rgba(0, 0, 0, 0.02),
                        0 40px 80px -20px rgba(0, 0, 0, 0.15),
                        0 20px 40px -15px rgba(180, 140, 80, 0.08)
                      `,
                    }}
                  >
                    {/* Subtle Inner Highlight */}
                    <div 
                      className="absolute top-0 left-0 right-0 h-24 rounded-t-[26px] pointer-events-none"
                      style={{
                        background: "linear-gradient(to bottom, rgba(255, 255, 255, 0.5) 0%, transparent 100%)",
                      }}
                    />

                    {/* Decorative Corner Accent */}
                    <div 
                      className="absolute top-4 right-4 w-12 h-12 pointer-events-none opacity-30"
                      style={{
                        background: `
                          radial-gradient(
                            circle at 100% 0%,
                            rgba(212, 175, 105, 0.4) 0%,
                            transparent 70%
                          )
                        `,
                      }}
                    />

                    {/* Content */}
                    <div className="relative z-10">
                      {/* Headline */}
                      <div className="space-y-0">
                        {/* Line 1: CHOOSE */}
                        <motion.h1
                          initial={{ opacity: 0, y: 25 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
                          className="text-4xl sm:text-5xl lg:text-[3.25rem] xl:text-[3.75rem] font-black uppercase tracking-tight leading-[1.02]"
                          style={{ 
                            color: "#B8293D",
                            textShadow: "0 2px 4px rgba(184, 41, 61, 0.08)",
                            letterSpacing: "-0.02em",
                          }}
                        >
                          {labels.line1[language]}
                        </motion.h1>

                        {/* Line 2: YOUR PATH */}
                        <motion.h1
                          initial={{ opacity: 0, y: 25 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.7, delay: 0.4, ease: "easeOut" }}
                          className="text-4xl sm:text-5xl lg:text-[3.25rem] xl:text-[3.75rem] font-black uppercase tracking-tight leading-[1.02]"
                          style={{ 
                            color: "#B8293D",
                            textShadow: "0 2px 4px rgba(184, 41, 61, 0.08)",
                            letterSpacing: "-0.02em",
                          }}
                        >
                          {labels.line2[language]}
                        </motion.h1>

                        {/* Line 3: To Bilingual */}
                        <motion.h2
                          initial={{ opacity: 0, y: 25 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.7, delay: 0.5, ease: "easeOut" }}
                          className="text-3xl sm:text-4xl lg:text-[2.5rem] xl:text-[2.875rem] font-light text-slate-700 italic leading-[1.12] mt-3"
                          style={{ 
                            fontFamily: "'Playfair Display', Georgia, 'Times New Roman', serif",
                            letterSpacing: "-0.01em",
                          }}
                        >
                          {labels.line3[language]}
                        </motion.h2>

                        {/* Line 4: Success */}
                        <motion.h2
                          initial={{ opacity: 0, y: 25 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.7, delay: 0.6, ease: "easeOut" }}
                          className="text-3xl sm:text-4xl lg:text-[2.5rem] xl:text-[2.875rem] font-light text-slate-700 italic leading-[1.12]"
                          style={{ 
                            fontFamily: "'Playfair Display', Georgia, 'Times New Roman', serif",
                            letterSpacing: "-0.01em",
                          }}
                        >
                          {labels.line4[language]}
                        </motion.h2>
                      </div>

                      {/* Decorative Divider */}
                      <motion.div
                        initial={{ opacity: 0, scaleX: 0 }}
                        animate={{ opacity: 1, scaleX: 1 }}
                        transition={{ duration: 0.8, delay: 0.7, ease: "easeOut" }}
                        className="my-6 lg:my-8 h-[2px] w-20 origin-left"
                        style={{
                          background: "linear-gradient(90deg, rgba(212, 175, 105, 0.8) 0%, rgba(212, 175, 105, 0.2) 100%)",
                        }}
                      />

                      {/* Subtitle */}
                      <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.75, ease: "easeOut" }}
                        className="text-sm sm:text-[15px] lg:text-base text-slate-600 leading-[1.7] max-w-[420px]"
                        style={{ letterSpacing: "0.01em" }}
                      >
                        {labels.subtitle[language]}
                      </motion.p>

                      {/* CTAs */}
                      <motion.div
                        initial={{ opacity: 0, y: 25 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.85, ease: "easeOut" }}
                        className="mt-8 lg:mt-10 flex flex-col sm:flex-row gap-3 sm:gap-4"
                      >
                        {/* Primary CTA */}
                        <a href="#ecosystem">
                          <Button
                            size="lg"
                            className="group w-full sm:w-auto px-7 py-5 lg:py-6 text-sm lg:text-[15px] font-bold rounded-xl transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl active:translate-y-0"
                            style={{ 
                              background: "linear-gradient(135deg, #FF6A2B 0%, #FF8B55 50%, #FF6A2B 100%)",
                              backgroundSize: "200% 200%",
                              color: "white",
                              boxShadow: `
                                0 12px 28px -6px rgba(255, 106, 43, 0.5),
                                0 4px 8px rgba(0, 0, 0, 0.08),
                                inset 0 1px 1px rgba(255, 255, 255, 0.2)
                              `,
                            }}
                          >
                            <Sparkles className="mr-2 w-4 h-4 lg:w-[18px] lg:h-[18px] opacity-90" />
                            {labels.cta1[language]}
                            <ArrowRight className="ml-2 w-4 h-4 lg:w-[18px] lg:h-[18px] transition-transform group-hover:translate-x-1" />
                          </Button>
                        </a>

                        {/* Secondary CTA */}
                        <a 
                          href="https://calendly.com/steven-barholere/30min" 
                          target="_blank" 
                          rel="noopener noreferrer"
                        >
                          <Button
                            size="lg"
                            variant="outline"
                            className="group w-full sm:w-auto px-6 py-5 lg:py-6 text-sm lg:text-[15px] font-semibold rounded-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl active:translate-y-0"
                            style={{
                              background: "rgba(255, 255, 255, 0.95)",
                              backdropFilter: "blur(12px)",
                              border: "1.5px solid rgba(212, 175, 105, 0.4)",
                              color: "#4a5568",
                              boxShadow: `
                                0 6px 16px rgba(0, 0, 0, 0.06),
                                inset 0 1px 1px rgba(255, 255, 255, 0.8)
                              `,
                            }}
                          >
                            <Calendar className="mr-2 w-4 h-4 lg:w-[18px] lg:h-[18px] text-amber-600" />
                            {labels.cta2[language]}
                          </Button>
                        </a>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right Side: Space for background image */}
            <div className="hidden lg:block lg:w-[54%] xl:w-[56%]" />
          </div>
        </div>

        {/* Bottom Gradient Transition */}
        <div 
          className="absolute bottom-0 left-0 right-0 h-28 pointer-events-none"
          style={{
            background: `
              linear-gradient(
                to top,
                rgba(255, 255, 255, 0.95) 0%,
                rgba(255, 255, 255, 0.6) 40%,
                transparent 100%
              )
            `,
          }}
        />
      </div>

      {/* Import Playfair Display font */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400;1,500&display=swap');
        
        @media (max-width: 1023px) {
          .hero-panel {
            margin: 0 auto;
          }
        }
      `}</style>
    </section>
  );
}
