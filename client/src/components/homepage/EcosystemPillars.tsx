import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { GraduationCap, MessageSquare, Video, ArrowRight } from 'lucide-react';
import { Link } from 'wouter';

export const EcosystemPillars: React.FC = () => {
  const { language } = useLanguage();

  const content = {
    en: {
      title: "Our Integrated Ecosystem",
      subtitle: "The Three Pillars of Success",
      pillars: [
        { 
          id: 'rusingacademy',
          icon: <GraduationCap className="w-10 h-10" />, 
          title: "RusingAcademy", 
          tagline: "The Academy",
          description: "Structured SLE preparation courses, expert-led curriculums, and a professional LMS platform.",
          cta: "Explore Courses",
          path: "/rusingacademy",
          color: "#F97316"
        },
        { 
          id: 'lingueefy',
          icon: <MessageSquare className="w-10 h-10" />, 
          title: "Lingueefy", 
          tagline: "The Tool",
          description: "Human & AI coaching marketplace with voice practice, personalized feedback, and 24/7 access.",
          cta: "Meet Coaches",
          path: "/lingueefy",
          color: "#14B8A6"
        },
        { 
          id: 'barholex',
          icon: <Video className="w-10 h-10" />, 
          title: "Barholex Media", 
          tagline: "The Studio",
          description: "High-impact educational content, podcasting, and enterprise consulting for government departments.",
          cta: "Request Proposal",
          path: "/barholex-media",
          color: "#8B5CF6"
        }
      ]
    },
    fr: {
      title: "Notre Écosystème Intégré",
      subtitle: "Les Trois Piliers du Succès",
      pillars: [
        { 
          id: 'rusingacademy',
          icon: <GraduationCap className="w-10 h-10" />, 
          title: "RusingAcademy", 
          tagline: "L'Académie",
          description: "Cours structurés de préparation aux ELS, curriculums dirigés par des experts et plateforme LMS.",
          cta: "Explorer les cours",
          path: "/rusingacademy",
          color: "#F97316"
        },
        { 
          id: 'lingueefy',
          icon: <MessageSquare className="w-10 h-10" />, 
          title: "Lingueefy", 
          tagline: "L'Outil",
          description: "Marché de coaching humain et IA avec pratique vocale, rétroaction personnalisée et accès 24/7.",
          cta: "Rencontrer les coachs",
          path: "/lingueefy",
          color: "#14B8A6"
        },
        { 
          id: 'barholex',
          icon: <Video className="w-10 h-10" />, 
          title: "Barholex Media", 
          tagline: "Le Studio",
          description: "Contenu éducatif à fort impact, podcasting et conseil en entreprise pour les ministères.",
          cta: "Demander une proposition",
          path: "/barholex-media",
          color: "#8B5CF6"
        }
      ]
    }
  };

  const t = content[language];

  return (
    <section className="py-24 bg-white">
      <div className="container-ecosystem">
        <div className="text-center mb-20">
          <span className="text-slate-400 font-bold tracking-widest uppercase text-xs mb-4 block">
            {t.subtitle}
          </span>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 mb-6">
            {t.title}
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-10">
          {t.pillars.map((pillar, i) => (
            <motion.div 
              key={pillar.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group relative bg-white rounded-3xl p-10 border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden"
            >
              {/* Subtle background color block */}
              <div 
                className="absolute top-0 right-0 w-32 h-32 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity rounded-bl-[100px]"
                style={{ backgroundColor: pillar.color }}
              />
              
              <div 
                className="w-16 h-16 rounded-2xl flex items-center justify-center mb-8 shadow-sm transition-transform group-hover:scale-110"
                style={{ backgroundColor: `${pillar.color}15`, color: pillar.color }}
              >
                {pillar.icon}
              </div>

              <span className="text-slate-400 font-bold tracking-widest uppercase text-[10px] mb-2 block">
                {pillar.tagline}
              </span>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">{pillar.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-8 h-20">
                {pillar.description}
              </p>

              <Link href={pillar.path}>
                <Button 
                  variant="ghost" 
                  className="p-0 text-slate-900 font-bold group-hover:translate-x-2 transition-transform"
                >
                  {pillar.cta}
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
