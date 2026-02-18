import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { CheckCircle2, Target, Users, BookOpen } from 'lucide-react';
import SmartImage from '@/components/media/SmartImage';

export const StorySection: React.FC = () => {
  const { language } = useLanguage();

  const content = {
    en: {
      title: "Reimagining Bilingual Excellence",
      subtitle: "The RusingAcademy Promise",
      description: "Bilingualism in the public service isn't just a requirement—it's a career catalyst. Our method combines deep pedagogy with modern EdTech to deliver results that last.",
      features: [
        { icon: <Target className="w-6 h-6" />, title: "SLE Precision", text: "Curriculum strictly aligned with Canada's Official Language exams." },
        { icon: <Users className="w-6 h-6" />, title: "Expert Coaching", text: "Human-led sessions with certified language professionals." },
        { icon: <BookOpen className="w-6 h-6" />, title: "Adaptive LMS", text: "Learning that fits your schedule, accessible on any device." }
      ],
      cta: "Learn Our Method"
    },
    fr: {
      title: "Réimaginer l'Excellence Bilingue",
      subtitle: "La Promesse RusingAcademy",
      description: "Le bilinguisme dans la fonction publique n'est pas seulement une exigence—c'est un catalyseur de carrière. Notre méthode combine une pédagogie profonde avec une EdTech moderne.",
      features: [
        { icon: <Target className="w-6 h-6" />, title: "Précision ELS", text: "Curriculum strictement aligné sur les examens officiels du Canada." },
        { icon: <Users className="w-6 h-6" />, title: "Coaching d'Experts", text: "Sessions humaines avec des professionnels certifiés." },
        { icon: <BookOpen className="w-6 h-6" />, title: "LMS Adaptatif", text: "Apprentissage flexible, accessible sur tous vos appareils." }
      ],
      cta: "Découvrir notre méthode"
    }
  };

  const t = content[language];

  return (
    <section className="py-24 bg-[#FAFAF9] overflow-hidden">
      <div className="container-ecosystem">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          {/* Image / Visual Column */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl">
              <SmartImage 
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1200" 
                alt="Collaborative Learning"
                className="w-full h-auto"
                preset="cover"
              />
            </div>
            {/* Decorative background element */}
            <div className="absolute -top-10 -left-10 w-64 h-64 bg-[#F97316]/10 rounded-full blur-3xl z-0" />
            <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl z-0" />
          </motion.div>

          {/* Text Content Column */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-[#F97316] font-bold tracking-widest uppercase text-sm mb-4 block">
              {t.subtitle}
            </span>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 mb-8 leading-tight">
              {t.title}
            </h2>
            <p className="text-lg text-slate-600 mb-12 leading-relaxed max-w-xl">
              {t.description}
            </p>

            {/* Features Grid */}
            <div className="grid sm:grid-cols-1 gap-8 mb-12">
              {t.features.map((feature, i) => (
                <div key={i} className="flex gap-5 group">
                  <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center text-[#F97316] group-hover:bg-[#F97316] group-hover:text-white transition-all duration-300">
                    {feature.icon}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-1">{feature.title}</h4>
                    <p className="text-slate-500 text-sm leading-relaxed">{feature.text}</p>
                  </div>
                </div>
              ))}
            </div>

            <Button className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-6 rounded-full text-lg font-bold">
              {t.cta}
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
