import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { ArrowRight, Calendar, Sparkles } from "lucide-react";

/**
 * HeroGoldStandard Component - Ultra-Premium Design v2
 * 
 * Features:
 * - Full-bleed background image (Steven + Ottawa Parliament)
 * - Prominent frosted glass panel with VISIBLE gold border
 * - All text clearly INSIDE the glass panel
 * - Premium glassmorphism effect (highly visible)
 * - Elegant typography and micro-animations
 */
export default function HeroGoldStandard() {
  const { language } = useLanguage();

  const labels = {
    line1: { en: "CHOOSE", fr: "CHOISISSEZ" },
    line2: { en: "YOUR PATH", fr: "VOTRE PARCOURS" },
    line3: { en: "To Bilingual", fr: "Vers le" },
    line4: { en: "Success", fr: "Succès Bilingue" },
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
      <div className="relative w-full min-h-[680px] lg:min-h-[750px] xl:min-h-[820px] overflow-hidden">
        
        {/* Background Image Layer - Full Bleed */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/images/hero/steven-hero-full.png')",
            backgroundPosition: "center center",
          }}
        />

        {/* Subtle Dark Overlay for Contrast */}
        <div 
          className="absolute inset-0"
          style={{
            background: `
              linear-gradient(
                90deg,
                rgba(0, 0, 0, 0.15) 0%,
                rgba(0, 0, 0, 0.05) 40%,
                transparent 60%,
                transparent 100%
              )
            `,
          }}
        />

        {/* Content Container */}
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 h-full min-h-[680px] lg:min-h-[750px] xl:min-h-[820px]">
          <div className="flex items-center h-full py-12 lg:py-16">
            
            {/* Left Side: Premium Glass Panel */}
            <motion.div
              initial={{ opacity: 0, x: -50, scale: 0.96 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="w-full max-w-[520px] lg:max-w-[540px] xl:max-w-[580px]"
            >
              {/* Outer Glow Effect */}
              <div 
                className="relative"
                style={{
                  filter: "drop-shadow(0 30px 60px rgba(180, 140, 80, 0.25)) drop-shadow(0 15px 30px rgba(0, 0, 0, 0.15))",
                }}
              >
                {/* GOLD BORDER - Very Visible */}
                <div 
                  className="relative p-[3px] rounded-[24px]"
                  style={{
                    background: `
                      linear-gradient(
                        145deg,
                        #D4AF69 0%,
                        #C9A456 15%,
                        #E8C878 30%,
                        #D4AF69 50%,
                        #B8964A 70%,
                        #E8C878 85%,
                        #D4AF69 100%
                      )
                    `,
                    boxShadow: `
                      0 0 20px rgba(212, 175, 105, 0.4),
                      inset 0 1px 1px rgba(255, 255, 255, 0.3)
                    `,
                  }}
                >
                  {/* GLASS PANEL - Frosted Effect */}
                  <div 
                    className="relative p-8 sm:p-10 lg:p-12 rounded-[21px] overflow-hidden"
                    style={{
                      background: `
                        linear-gradient(
                          160deg,
                          rgba(255, 253, 250, 0.88) 0%,
                          rgba(255, 252, 248, 0.85) 30%,
                          rgba(252, 250, 246, 0.82) 60%,
                          rgba(250, 248, 244, 0.80) 100%
                        )
                      `,
                      backdropFilter: "blur(24px) saturate(1.3)",
                      WebkitBackdropFilter: "blur(24px) saturate(1.3)",
                      boxShadow: `
                        inset 0 2px 4px rgba(255, 255, 255, 0.9),
                        inset 0 -1px 2px rgba(0, 0, 0, 0.03),
                        0 25px 50px -12px rgba(0, 0, 0, 0.2)
                      `,
                    }}
                  >
                    {/* Inner Highlight Gradient */}
                    <div 
                      className="absolute top-0 left-0 right-0 h-32 rounded-t-[21px] pointer-events-none"
                      style={{
                        background: "linear-gradient(to bottom, rgba(255, 255, 255, 0.6) 0%, transparent 100%)",
                      }}
                    />

                    {/* Subtle Pattern Overlay */}
                    <div 
                      className="absolute inset-0 rounded-[21px] pointer-events-none opacity-[0.03]"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                      }}
                    />

                    {/* === ALL CONTENT INSIDE GLASS PANEL === */}
                    <div className="relative z-10">
                      
                      {/* Headline Block */}
                      <div className="space-y-1">
                        {/* Line 1: CHOOSE */}
                        <motion.h1
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, delay: 0.2 }}
                          className="text-4xl sm:text-5xl lg:text-[3.5rem] xl:text-[4rem] font-black uppercase tracking-tight leading-[0.95]"
                          style={{ 
                            color: "#B8293D",
                            textShadow: "0 2px 4px rgba(184, 41, 61, 0.1)",
                            letterSpacing: "-0.03em",
                          }}
                        >
                          {labels.line1[language]}
                        </motion.h1>

                        {/* Line 2: YOUR PATH */}
                        <motion.h1
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, delay: 0.3 }}
                          className="text-4xl sm:text-5xl lg:text-[3.5rem] xl:text-[4rem] font-black uppercase tracking-tight leading-[0.95]"
                          style={{ 
                            color: "#B8293D",
                            textShadow: "0 2px 4px rgba(184, 41, 61, 0.1)",
                            letterSpacing: "-0.03em",
                          }}
                        >
                          {labels.line2[language]}
                        </motion.h1>

                        {/* Line 3: To Bilingual */}
                        <motion.h2
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, delay: 0.4 }}
                          className="text-2xl sm:text-3xl lg:text-[2.25rem] xl:text-[2.5rem] font-normal text-slate-700 italic leading-[1.1] pt-2"
                          style={{ 
                            fontFamily: "'Playfair Display', Georgia, serif",
                            letterSpacing: "-0.01em",
                          }}
                        >
                          {labels.line3[language]}
                        </motion.h2>

                        {/* Line 4: Success */}
                        <motion.h2
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, delay: 0.5 }}
                          className="text-2xl sm:text-3xl lg:text-[2.25rem] xl:text-[2.5rem] font-normal text-slate-700 italic leading-[1.1]"
                          style={{ 
                            fontFamily: "'Playfair Display', Georgia, serif",
                            letterSpacing: "-0.01em",
                          }}
                        >
                          {labels.line4[language]}
                        </motion.h2>
                      </div>

                      {/* Gold Decorative Line */}
                      <motion.div
                        initial={{ opacity: 0, scaleX: 0 }}
                        animate={{ opacity: 1, scaleX: 1 }}
                        transition={{ duration: 0.7, delay: 0.55 }}
                        className="my-6 h-[3px] w-24 origin-left rounded-full"
                        style={{
                          background: "linear-gradient(90deg, #D4AF69 0%, #E8C878 50%, rgba(212, 175, 105, 0.3) 100%)",
                          boxShadow: "0 2px 4px rgba(212, 175, 105, 0.3)",
                        }}
                      />

                      {/* Subtitle */}
                      <motion.p
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                        className="text-sm sm:text-[15px] lg:text-base text-slate-600 leading-[1.75] max-w-[440px]"
                      >
                        {labels.subtitle[language]}
                      </motion.p>

                      {/* CTA Buttons */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.7 }}
                        className="mt-8 flex flex-col sm:flex-row gap-3"
                      >
                        {/* Primary CTA - Orange */}
                        <a href="#ecosystem">
                          <Button
                            size="lg"
                            className="group w-full sm:w-auto px-6 py-5 text-sm font-bold rounded-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                            style={{ 
                              background: "linear-gradient(135deg, #FF6A2B 0%, #FF8142 100%)",
                              color: "white",
                              boxShadow: `
                                0 10px 25px -5px rgba(255, 106, 43, 0.45),
                                0 4px 6px rgba(0, 0, 0, 0.07),
                                inset 0 1px 0 rgba(255, 255, 255, 0.2)
                              `,
                            }}
                          >
                            <Sparkles className="mr-2 w-4 h-4" />
                            {labels.cta1[language]}
                            <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                          </Button>
                        </a>

                        {/* Secondary CTA - Gold Border */}
                        <a 
                          href="https://calendly.com/steven-barholere/30min" 
                          target="_blank" 
                          rel="noopener noreferrer"
                        >
                          <Button
                            size="lg"
                            variant="outline"
                            className="group w-full sm:w-auto px-5 py-5 text-sm font-semibold rounded-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                            style={{
                              background: "rgba(255, 255, 255, 0.9)",
                              border: "2px solid #D4AF69",
                              color: "#5a5a5a",
                              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.06)",
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
              </div>
            </motion.div>

            {/* Right Side: Reserved for Background Image */}
            <div className="hidden lg:block flex-1" />
          </div>
        </div>

        {/* Bottom Fade to White */}
        <div 
          className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
          style={{
            background: "linear-gradient(to top, rgba(255, 255, 255, 0.98) 0%, transparent 100%)",
          }}
        />
      </div>

      {/* Google Fonts Import */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400;1,500&display=swap');
      `}</style>
    </section>
  );
}
