import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { ArrowRight, Calendar } from "lucide-react";

/**
 * HeroGoldStandard Component
 * 
 * Pixel-match implementation based on Google Banana reference images:
 * - Background: Premium gradient with subtle Ottawa/Parliament atmosphere
 * - Left: Large rounded glass panel with headline text
 * - Right: Steven portrait (steven-portrait.png) with flags
 * - Text: "CHOOSE YOUR PATH To Bilingual Success" (red headline + black subtitle)
 * - CTAs: Explore Ecosystem + Book a Diagnostic
 * - Premium glassmorphism with gold/ivory accents
 * 
 * Design Reference: Lerendu-HeaderetHero.jpg + Gemini gold variant
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
      {/* Hero Container - Full width with premium background */}
      <div className="relative w-full min-h-[580px] lg:min-h-[650px] overflow-hidden">
        {/* Premium Background - Gradient with subtle texture */}
        <div 
          className="absolute inset-0"
          style={{
            background: `
              linear-gradient(135deg, 
                rgba(245, 243, 240, 1) 0%, 
                rgba(235, 232, 228, 1) 25%,
                rgba(220, 218, 215, 0.95) 50%,
                rgba(200, 198, 195, 0.9) 75%,
                rgba(180, 178, 175, 0.85) 100%
              )
            `,
          }}
        >
          {/* Subtle office/window atmosphere overlay */}
          <div 
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: `
                linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%),
                linear-gradient(180deg, rgba(255,255,255,0.2) 0%, transparent 30%)
              `,
            }}
          />
          
          {/* Subtle grid pattern for depth */}
          <div 
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `
                linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
              `,
              backgroundSize: "50px 50px",
            }}
          />
        </div>

        {/* Content Container - Two Column Layout */}
        <div className="relative z-10 container mx-auto px-4 sm:px-6 h-full min-h-[580px] lg:min-h-[650px]">
          <div className="flex flex-col lg:flex-row items-center h-full py-8 lg:py-12">
            
            {/* Left Column: Glass Panel with Text (6/12 width) */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="w-full lg:w-1/2 flex justify-center lg:justify-start"
            >
              {/* Premium Glass Panel - Gold/Ivory variant */}
              <div 
                className="relative p-8 sm:p-10 lg:p-12 rounded-3xl w-full max-w-[520px]"
                style={{
                  background: "linear-gradient(145deg, rgba(255, 253, 248, 0.96) 0%, rgba(255, 251, 245, 0.94) 100%)",
                  backdropFilter: "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                  border: "2px solid rgba(212, 175, 55, 0.3)",
                  boxShadow: `
                    0 25px 50px -12px rgba(0, 0, 0, 0.15),
                    0 0 0 1px rgba(255, 255, 255, 0.6) inset,
                    0 2px 4px rgba(212, 175, 55, 0.15)
                  `,
                }}
              >
                {/* Subtle marble/network pattern overlay */}
                <div 
                  className="absolute inset-0 rounded-3xl opacity-[0.04] pointer-events-none"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23d4af37' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
                  }}
                />

                {/* Headline Text */}
                <div className="relative z-10 space-y-0">
                  {/* Line 1: CHOOSE */}
                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="text-4xl sm:text-5xl lg:text-[3.5rem] font-black uppercase tracking-tight leading-[1.1]"
                    style={{ 
                      color: "#C41E3A",
                      textShadow: "0 1px 2px rgba(0,0,0,0.05)",
                    }}
                  >
                    {labels.line1[language]}
                  </motion.h1>

                  {/* Line 2: YOUR PATH */}
                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="text-4xl sm:text-5xl lg:text-[3.5rem] font-black uppercase tracking-tight leading-[1.1]"
                    style={{ 
                      color: "#C41E3A",
                      textShadow: "0 1px 2px rgba(0,0,0,0.05)",
                    }}
                  >
                    {labels.line2[language]}
                  </motion.h1>

                  {/* Line 3: To Bilingual */}
                  <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="text-3xl sm:text-4xl lg:text-[2.75rem] font-light text-slate-800 italic leading-[1.2] mt-1"
                    style={{ fontFamily: "Georgia, serif" }}
                  >
                    {labels.line3[language]}
                  </motion.h2>

                  {/* Line 4: Success */}
                  <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    className="text-3xl sm:text-4xl lg:text-[2.75rem] font-light text-slate-800 italic leading-[1.2]"
                    style={{ fontFamily: "Georgia, serif" }}
                  >
                    {labels.line4[language]}
                  </motion.h2>
                </div>

                {/* Subtitle */}
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  className="mt-6 text-sm sm:text-[15px] text-slate-600 leading-relaxed"
                >
                  {labels.subtitle[language]}
                </motion.p>

                {/* CTAs */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.7 }}
                  className="mt-8 flex flex-col sm:flex-row gap-3"
                >
                  {/* Primary CTA: Explore Ecosystem */}
                  <a href="#ecosystem">
                    <Button
                      size="lg"
                      className="w-full sm:w-auto px-7 py-5 text-sm font-bold rounded-xl transition-all hover:-translate-y-0.5 active:translate-y-0"
                      style={{ 
                        background: "linear-gradient(135deg, #FF6A2B 0%, #ff8f5e 100%)",
                        color: "white",
                        boxShadow: "0 8px 20px -4px rgba(255, 106, 43, 0.4), 0 2px 4px rgba(0,0,0,0.1)",
                      }}
                    >
                      {labels.cta1[language]}
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </a>

                  {/* Secondary CTA: Book a Diagnostic */}
                  <a 
                    href="https://calendly.com/steven-barholere/30min" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <Button
                      size="lg"
                      variant="outline"
                      className="w-full sm:w-auto px-6 py-5 text-sm font-semibold rounded-xl transition-all hover:-translate-y-0.5 active:translate-y-0"
                      style={{
                        background: "rgba(255, 255, 255, 0.9)",
                        backdropFilter: "blur(8px)",
                        border: "1px solid rgba(0, 0, 0, 0.1)",
                        color: "#374151",
                        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
                      }}
                    >
                      <Calendar className="mr-2 w-4 h-4" />
                      {labels.cta2[language]}
                    </Button>
                  </a>
                </motion.div>
              </div>
            </motion.div>

            {/* Right Column: Steven Portrait (6/12 width) */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
              className="hidden lg:flex lg:w-1/2 justify-center items-center relative"
            >
              {/* Steven Portrait Image */}
              <div className="relative">
                {/* Subtle glow behind portrait */}
                <div 
                  className="absolute inset-0 rounded-full blur-3xl opacity-20"
                  style={{
                    background: "radial-gradient(circle, rgba(212, 175, 55, 0.3) 0%, transparent 70%)",
                    transform: "scale(1.2)",
                  }}
                />
                
                {/* Portrait Image */}
                <img
                  src="/images/hero/steven-portrait.png"
                  alt="Prof. Steven Barholere - Founder of RusingAcademy"
                  className="relative z-10 w-auto h-[450px] lg:h-[520px] xl:h-[580px] object-contain drop-shadow-2xl"
                  style={{
                    filter: "drop-shadow(0 25px 50px rgba(0, 0, 0, 0.2))",
                  }}
                />
              </div>
            </motion.div>
          </div>
        </div>

        {/* Mobile: Steven Portrait below text */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.5 }}
          className="lg:hidden flex justify-center pb-8 px-4"
        >
          <img
            src="/images/hero/steven-portrait.png"
            alt="Prof. Steven Barholere - Founder of RusingAcademy"
            className="w-auto h-[300px] sm:h-[350px] object-contain drop-shadow-xl"
            style={{
              filter: "drop-shadow(0 15px 30px rgba(0, 0, 0, 0.15))",
            }}
          />
        </motion.div>
      </div>
    </section>
  );
}
