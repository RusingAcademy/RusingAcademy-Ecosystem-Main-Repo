import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { premiumTokens } from '@/lib/premium-design-tokens';
import { ArrowRight, Play } from 'lucide-react';
import SmartImage from '@/components/media/SmartImage';
import { Link } from 'wouter';

interface PremiumHeroProps {
  content: {
    badge: string;
    titleLine1: string;
    titleLine2: string;
    titleLine3: string;
    subtitle: string;
    description: string;
    cta1: string;
    cta2: string;
    proof: string;
  };
}

export const PremiumHero: React.FC<PremiumHeroProps> = ({ content }) => {
  const { language } = useLanguage();

  return (
    <section className="relative w-full h-[90vh] min-h-[700px] overflow-hidden flex items-end pb-20 md:pb-32">
      {/* Full-Bleed Background Image */}
      <div className="absolute inset-0 z-0">
        <SmartImage 
          src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=2000" 
          alt="Professional Learning"
          className="w-full h-full object-cover"
          preset="hero_desktop"
          priority={true}
        />
        {/* Subtle overlay to ensure text readability */}
        <div className="absolute inset-0 bg-black/20" />
      </div>

      <div className="container-ecosystem relative z-10 w-full">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-3xl"
        >
          {/* Glassmorphism Panel - MgCréa Style (Ultra-Transparent) */}
          <div 
            className="p-8 md:p-12 rounded-3xl backdrop-blur-[6px] border border-white/10"
            style={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.1)'
            }}
          >
            {/* Badge */}
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="inline-block px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-white text-xs font-semibold tracking-widest uppercase mb-6"
            >
              {content.badge}
            </motion.span>

            {/* Main Heading - Serif for Authority */}
            <h1 
              className="text-white font-serif leading-[1.1] mb-6"
              style={{ fontSize: premiumTokens.typography.scale.h1 }}
            >
              <span className="block italic opacity-90">{content.titleLine1} {content.titleLine2}</span>
              <span className="block font-bold">{content.titleLine3}</span>
            </h1>

            {/* Subtitle - Serif Italic */}
            <p className="text-white/90 font-serif italic text-2xl md:text-3xl mb-6">
              {content.subtitle}
            </p>

            {/* Description - Sans for clarity */}
            <p className="text-white/80 font-sans text-lg md:text-xl max-w-2xl mb-10 leading-relaxed">
              {content.description}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4 items-center">
              <Button 
                className="bg-[#F97316] hover:bg-[#EA580C] text-white px-8 py-7 rounded-full text-lg font-bold shadow-lg transition-all hover:scale-105 active:scale-95"
              >
                {content.cta1}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              
              <Button 
                variant="ghost"
                className="text-white border border-white/30 hover:bg-white/10 px-8 py-7 rounded-full text-lg font-semibold backdrop-blur-sm"
              >
                <Play className="mr-2 w-5 h-5 fill-current" />
                {content.cta2}
              </Button>
            </div>

            {/* Social Proof Teaser */}
            <div className="mt-10 flex items-center gap-4 text-white/60 text-sm font-medium border-t border-white/10 pt-8">
              <div className="flex -space-x-2">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-white/20 bg-gray-400 overflow-hidden">
                    <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="User" />
                  </div>
                ))}
              </div>
              <span>{content.proof}</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
