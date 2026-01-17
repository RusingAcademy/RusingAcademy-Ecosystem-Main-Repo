import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { ArrowRight, Calendar } from "lucide-react";

/**
 * HeroGoldStandard Component - Premium Full-Background Design
 * 
 * Design: Full-bleed hero image (Steven + Ottawa/Parliament + flags) as background
 * with a frosted glass panel on the left containing the headline text.
 * 
 * This creates an immersive, premium visual experience matching the Google Banana
 * reference design where the image fills the entire hero section.
 * 
 * Key Features:
 * - Full-width background image with Steven and Ottawa Parliament
 * - Glassmorphism panel (frosted ivory/cream) on the left
 * - "CHOOSE YOUR PATH To Bilingual Success" headline
 * - CTAs positioned below the text
 * - Subtle network/connection pattern overlay for tech feel
 * - Responsive design with mobile optimization
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
      {/* Hero Container - Full width with premium background image */}
      <div className="relative w-full min-h-[600px] lg:min-h-[700px] xl:min-h-[750px] overflow-hidden">
        
        {/* Background Image - Steven + Ottawa Parliament Scene */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/images/hero/hero-background-premium.png')",
            backgroundPosition: "center center",
          }}
        >
          {/* Fallback to second image if first doesn't load */}
        </div>

        {/* Alternative: Use steven-hero-full.png as background */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/images/hero/steven-hero-full.png')",
            backgroundPosition: "center center",
          }}
        />

        {/* Subtle overlay for depth and contrast */}
        <div 
          className="absolute inset-0"
          style={{
            background: `
              linear-gradient(
                to right,
                rgba(0, 0, 0, 0.03) 0%,
                transparent 40%,
                transparent 100%
              )
            `,
          }}
        />

        {/* Network/Connection Pattern Overlay - Tech Feel */}
        <div 
          className="absolute inset-0 opacity-[0.08] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%234a90a4' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        {/* Content Container */}
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 h-full min-h-[600px] lg:min-h-[700px] xl:min-h-[750px]">
          <div className="flex items-center h-full py-12 lg:py-16">
            
            {/* Left Side: Glassmorphism Panel with Text */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9, ease: "easeOut" }}
              className="w-full lg:w-[48%] xl:w-[45%]"
            >
              {/* Premium Glass Panel - Frosted Ivory/Cream */}
              <div 
                className="relative p-8 sm:p-10 lg:p-12 xl:p-14 rounded-3xl"
                style={{
                  background: "linear-gradient(145deg, rgba(255, 253, 248, 0.88) 0%, rgba(255, 251, 245, 0.85) 50%, rgba(250, 248, 243, 0.82) 100%)",
                  backdropFilter: "blur(24px)",
                  WebkitBackdropFilter: "blur(24px)",
                  border: "1.5px solid rgba(255, 255, 255, 0.6)",
                  boxShadow: `
                    0 30px 60px -15px rgba(0, 0, 0, 0.15),
                    0 0 0 1px rgba(255, 255, 255, 0.4) inset,
                    0 1px 3px rgba(0, 0, 0, 0.05)
                  `,
                }}
              >
                {/* Subtle marble/network pattern inside panel */}
                <div 
                  className="absolute inset-0 rounded-3xl opacity-[0.03] pointer-events-none"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23888' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
                  }}
                />

                {/* Headline Text */}
                <div className="relative z-10 space-y-0">
                  {/* Line 1: CHOOSE */}
                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="text-4xl sm:text-5xl lg:text-[3.5rem] xl:text-[4rem] font-black uppercase tracking-tight leading-[1.05]"
                    style={{ 
                      color: "#C41E3A",
                      textShadow: "0 1px 2px rgba(0,0,0,0.03)",
                    }}
                  >
                    {labels.line1[language]}
                  </motion.h1>

                  {/* Line 2: YOUR PATH */}
                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="text-4xl sm:text-5xl lg:text-[3.5rem] xl:text-[4rem] font-black uppercase tracking-tight leading-[1.05]"
                    style={{ 
                      color: "#C41E3A",
                      textShadow: "0 1px 2px rgba(0,0,0,0.03)",
                    }}
                  >
                    {labels.line2[language]}
                  </motion.h1>

                  {/* Line 3: To Bilingual */}
                  <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    className="text-3xl sm:text-4xl lg:text-[2.75rem] xl:text-[3rem] font-light text-slate-800 italic leading-[1.15] mt-2"
                    style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
                  >
                    {labels.line3[language]}
                  </motion.h2>

                  {/* Line 4: Success */}
                  <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    className="text-3xl sm:text-4xl lg:text-[2.75rem] xl:text-[3rem] font-light text-slate-800 italic leading-[1.15]"
                    style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
                  >
                    {labels.line4[language]}
                  </motion.h2>
                </div>

                {/* Subtitle */}
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.7 }}
                  className="mt-6 lg:mt-8 text-sm sm:text-[15px] lg:text-base text-slate-600 leading-relaxed max-w-[440px]"
                >
                  {labels.subtitle[language]}
                </motion.p>

                {/* CTAs */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                  className="mt-8 lg:mt-10 flex flex-col sm:flex-row gap-3 sm:gap-4"
                >
                  {/* Primary CTA: Explore Ecosystem */}
                  <a href="#ecosystem">
                    <Button
                      size="lg"
                      className="w-full sm:w-auto px-7 py-5 lg:py-6 text-sm lg:text-base font-bold rounded-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl active:translate-y-0"
                      style={{ 
                        background: "linear-gradient(135deg, #FF6A2B 0%, #ff8f5e 100%)",
                        color: "white",
                        boxShadow: "0 10px 25px -5px rgba(255, 106, 43, 0.45), 0 4px 6px rgba(0,0,0,0.1)",
                      }}
                    >
                      {labels.cta1[language]}
                      <ArrowRight className="ml-2 w-4 h-4 lg:w-5 lg:h-5" />
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
                      className="w-full sm:w-auto px-6 py-5 lg:py-6 text-sm lg:text-base font-semibold rounded-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-lg active:translate-y-0"
                      style={{
                        background: "rgba(255, 255, 255, 0.95)",
                        backdropFilter: "blur(8px)",
                        border: "1.5px solid rgba(0, 0, 0, 0.1)",
                        color: "#374151",
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
                      }}
                    >
                      <Calendar className="mr-2 w-4 h-4 lg:w-5 lg:h-5" />
                      {labels.cta2[language]}
                    </Button>
                  </a>
                </motion.div>
              </div>
            </motion.div>

            {/* Right Side: Empty space for background image (Steven) to show through */}
            <div className="hidden lg:block lg:w-[52%] xl:w-[55%]">
              {/* Steven and Ottawa Parliament are visible through the background */}
            </div>
          </div>
        </div>

        {/* Bottom gradient fade for smooth transition to next section */}
        <div 
          className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none"
          style={{
            background: "linear-gradient(to top, rgba(255,255,255,0.8) 0%, transparent 100%)",
          }}
        />
      </div>

      {/* Mobile: Adjusted layout for smaller screens */}
      <style>{`
        @media (max-width: 1023px) {
          .hero-mobile-bg {
            background-position: 70% center !important;
          }
        }
      `}</style>
    </section>
  );
}
