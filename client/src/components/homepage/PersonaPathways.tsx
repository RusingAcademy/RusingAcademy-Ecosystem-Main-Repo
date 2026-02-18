import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { Building2, User, GraduationCap, ArrowRight } from 'lucide-react';
import SmartImage from '@/components/media/SmartImage';
import { Link } from 'wouter';

export const PersonaPathways: React.FC = () => {
  const { language } = useLanguage();

  const content = {
    en: {
      title: "Your Journey Starts Here",
      subtitle: "Tailored Solutions",
      paths: [
        {
          id: 'public-servants',
          icon: <User className="w-8 h-8" />,
          title: "For Public Servants",
          description: "Advance your career with SLE-focused training, oral coaching, and diagnostic tools.",
          cta: "I am a Public Servant",
          path: "/rusingacademy/sle-preparation",
          image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=800"
        },
        {
          id: 'departments',
          icon: <Building2 className="w-8 h-8" />,
          title: "For Departments",
          description: "Enterprise-level training, group sessions, and EdTech consulting for federal teams.",
          cta: "For Your Team",
          path: "/barholex-media",
          image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800"
        }
      ]
    },
    fr: {
      title: "Votre Parcours Commence Ici",
      subtitle: "Solutions Sur Mesure",
      paths: [
        {
          id: 'public-servants',
          icon: <User className="w-8 h-8" />,
          title: "Pour les Fonctionnaires",
          description: "Propulsez votre carrière avec une formation axée ELS, du coaching oral et des outils de diagnostic.",
          cta: "Je suis fonctionnaire",
          path: "/rusingacademy/sle-preparation",
          image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=800"
        },
        {
          id: 'departments',
          icon: <Building2 className="w-8 h-8" />,
          title: "Pour les Ministères",
          description: "Formation au niveau entreprise, sessions de groupe et conseil EdTech pour les équipes fédérales.",
          cta: "Pour votre équipe",
          path: "/barholex-media",
          image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800"
        }
      ]
    }
  };

  const t = content[language];

  return (
    <section className="py-24 bg-[#FAFAF9]">
      <div className="container-ecosystem">
        <div className="text-center mb-16">
          <span className="text-[#F97316] font-bold tracking-widest uppercase text-xs mb-4 block">
            {t.subtitle}
          </span>
          <h2 className="text-4xl font-serif font-bold text-slate-900 mb-4">
            {t.title}
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-10">
          {t.paths.map((path, i) => (
            <motion.div 
              key={path.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group relative h-[450px] rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500"
            >
              {/* Background Image */}
              <SmartImage 
                src={path.image} 
                alt={path.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                preset="cover"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
              
              {/* Content */}
              <div className="absolute inset-0 p-12 flex flex-col justify-end">
                <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white mb-6">
                  {path.icon}
                </div>
                <h3 className="text-3xl font-bold text-white mb-4">{path.title}</h3>
                <p className="text-white/80 text-lg mb-8 max-w-md">
                  {path.description}
                </p>
                <Link href={path.path}>
                  <Button className="w-full sm:w-auto bg-white text-slate-900 hover:bg-slate-100 px-8 py-6 rounded-full font-bold text-lg">
                    {path.cta}
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
