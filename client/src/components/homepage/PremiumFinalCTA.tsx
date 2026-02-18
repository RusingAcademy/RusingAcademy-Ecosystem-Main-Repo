import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { ArrowRight, Sparkles } from 'lucide-react';

export const PremiumFinalCTA: React.FC = () => {
  const { language } = useLanguage();

  const content = {
    en: {
      title: "Ready to Master Your Second Language?",
      subtitle: "Join 2,000+ Successful Public Servants",
      description: "Don't leave your career to chance. Join the ecosystem designed for your success.",
      cta: "Get Started Now",
      secondary: "Book a Free Diagnostic"
    },
    fr: {
      title: "Prêt à Maîtriser Votre Seconde Langue ?",
      subtitle: "Rejoignez plus de 2 000 Fonctionnaires",
      description: "Ne laissez pas votre carrière au hasard. Rejoignez l'écosystème conçu pour votre réussite.",
      cta: "Commencer Maintenant",
      secondary: "Réserver un Diagnostic Gratuit"
    }
  };

  const t = content[language];

  return (
    <section className="py-24 relative overflow-hidden bg-slate-900">
      {/* Decorative Background */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#F97316] rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-teal-500 rounded-full blur-[120px]" />
      </div>

      <div className="container-ecosystem relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[#F97316] text-xs font-bold tracking-widest uppercase mb-8">
              <Sparkles className="w-3 h-3" />
              {t.subtitle}
            </div>
            
            <h2 className="text-4xl md:text-6xl font-serif font-bold text-white mb-8 leading-tight">
              {t.title}
            </h2>
            
            <p className="text-xl text-white/60 mb-12 max-w-2xl mx-auto">
              {t.description}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Button className="w-full sm:w-auto bg-[#F97316] hover:bg-[#EA580C] text-white px-10 py-8 rounded-full text-xl font-bold shadow-2xl transition-all hover:scale-105">
                {t.cta}
                <ArrowRight className="ml-2 w-6 h-6" />
              </Button>
              
              <Button variant="ghost" className="text-white hover:bg-white/5 px-8 py-8 rounded-full text-lg font-semibold">
                {t.secondary}
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
