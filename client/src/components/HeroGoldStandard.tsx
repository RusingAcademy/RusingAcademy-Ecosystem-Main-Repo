import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { ArrowRight, Calendar } from "lucide-react";

/**
 * HeroGoldStandard Component
 * 
 * Pixel-match implementation of the Gold Standard hero design:
 * - Background: Ottawa/Parliament scene with soft depth
 * - Right: Steven (founder) photo
 * - Left: Large rounded glass panel with headline text
 * - CTAs: Explore Ecosystem + Book a Diagnostic
 * 
 * Design Reference: rusingacademy_ecosystem_hero_v2_final.png
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
      <div className="relative w-full min-h-[600px] lg:min-h-[700px] overflow-hidden">
        {/* Background Image - Ottawa/Parliament Scene */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/images/hero/hero-ottawa-parliament.jpg')",
          }}
        >
          {/* Subtle overlay for depth */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/10" />
        </div>

        {/* Content Grid: Glass Panel Left + Steven Right */}
        <div className="relative z-10 container mx-auto px-4 sm:px-6 h-full min-h-[600px] lg:min-h-[700px]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center h-full py-12 lg:py-0">
            
            {/* Left Column: Glass Panel with Text */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="order-2 lg:order-1 flex justify-center lg:justify-start"
            >
              {/* Glass Panel */}
              <div 
                className="relative p-8 sm:p-10 lg:p-12 rounded-3xl max-w-[500px] w-full"
                style={{
                  background: "rgba(255, 253, 250, 0.88)",
                  backdropFilter: "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                  border: "1px solid rgba(255, 255, 255, 0.6)",
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.3) inset",
                }}
              >
                {/* Subtle geometric network pattern overlay */}
                <div 
                  className="absolute inset-0 rounded-3xl opacity-[0.03] pointer-events-none"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                  }}
                />

                {/* Headline Text */}
                <div className="relative z-10 space-y-1">
                  {/* Line 1: CHOOSE */}
                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight"
                    style={{ color: "#C41E3A" }}
                  >
                    {labels.line1[language]}
                  </motion.h1>

                  {/* Line 2: YOUR PATH */}
                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight"
                    style={{ color: "#C41E3A" }}
                  >
                    {labels.line2[language]}
                  </motion.h1>

                  {/* Line 3: To Bilingual */}
                  <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-800"
                  >
                    {labels.line3[language]}
                  </motion.h2>

                  {/* Line 4: Success */}
                  <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-800"
                  >
                    {labels.line4[language]}
                  </motion.h2>
                </div>

                {/* Subtitle */}
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  className="mt-6 text-sm sm:text-base text-slate-600 leading-relaxed"
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
                      className="w-full sm:w-auto bg-gradient-to-r from-[#FF6A2B] to-[#ff8f5e] text-white border-0 px-6 py-5 text-sm font-bold rounded-xl shadow-lg hover:-translate-y-0.5 transition-all"
                      style={{ boxShadow: "0 10px 25px -5px rgba(255, 106, 43, 0.4)" }}
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
                      className="w-full sm:w-auto bg-white/80 backdrop-blur-sm text-slate-800 border border-slate-200 px-6 py-5 text-sm font-bold rounded-xl hover:bg-white hover:-translate-y-0.5 transition-all"
                    >
                      <Calendar className="mr-2 w-4 h-4" />
                      {labels.cta2[language]}
                    </Button>
                  </a>
                </motion.div>
              </div>
            </motion.div>

            {/* Right Column: Steven Photo (already in background image) */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
              className="order-1 lg:order-2 hidden lg:block"
            >
              {/* The Steven photo is part of the background image */}
              {/* This space is intentionally left for visual balance */}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
