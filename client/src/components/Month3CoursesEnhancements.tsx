import { motion } from 'framer-motion';
import { Target, Zap, Award, CheckCircle, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PremiumCard, AnimatedCounter, MagneticButton } from '@/components/Month3Components';
import ScrollAnimationWrapper from '@/components/ScrollAnimationWrapper';

/**
 * Month 3 Premium Enhancements for Courses Page
 * 3-step methodology visualization and animated statistics
 */

export const ThreeStepMethodology = ({ language }: { language: string }) => {
  const isFrench = language === 'fr';

  const steps = [
    {
      step: '01',
      title: isFrench ? 'Diagnostiquer' : 'Diagnose',
      desc: isFrench 
        ? 'Évaluation complète de vos compétences actuelles avec tests de niveau et analyse personnalisée.'
        : 'Complete assessment of your current skills with level tests and personalized analysis.',
      icon: Target,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      step: '02',
      title: isFrench ? 'Entraîner' : 'Train',
      desc: isFrench 
        ? 'Pratique intensive avec nos outils IA, capsules vidéo et sessions de coaching en direct.'
        : 'Intensive practice with our AI tools, video capsules, and live coaching sessions.',
      icon: Zap,
      color: 'from-teal-500 to-emerald-500'
    },
    {
      step: '03',
      title: isFrench ? 'Valider' : 'Validate',
      desc: isFrench 
        ? 'Simulation d\'examen réaliste et certification finale pour garantir votre succès SLE.'
        : 'Realistic exam simulation and final certification to guarantee your SLE success.',
      icon: Award,
      color: 'from-amber-500 to-orange-500'
    }
  ];

  return (
    <section className="py-24 bg-slate-50 overflow-hidden">
      <div className="container mx-auto px-4">
        <ScrollAnimationWrapper animation="fade-up">
          <div className="text-center mb-20">
            <Badge className="bg-teal-100 text-teal-700 mb-4 px-4 py-1 rounded-full uppercase tracking-widest font-bold border-none">
              {isFrench ? 'Notre Méthodologie' : 'Our Methodology'}
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold font-display text-slate-900 mb-4">
              {isFrench ? 'Le Parcours vers le Niveau C' : 'The Pathway to Level C'}
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              {isFrench 
                ? 'Une approche structurée en 3 étapes pour garantir votre réussite aux examens SLE.'
                : 'A structured 3-step approach to guarantee your SLE exam success.'
              }
            </p>
          </div>
        </ScrollAnimationWrapper>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          {/* Connecting line for desktop */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-teal-200 via-teal-400 to-teal-200 -translate-y-1/2 z-0" />
          
          {steps.map((item, idx) => (
            <ScrollAnimationWrapper key={idx} animation="fade-up" delay={idx * 0.2}>
              <div className="relative z-10 bg-white p-10 rounded-3xl shadow-xl border border-teal-50 group hover:-translate-y-2 transition-all duration-500">
                <div className={`w-16 h-16 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center mb-8 shadow-lg rotate-3 group-hover:rotate-0 transition-transform`}>
                  <item.icon className="text-white h-8 w-8" />
                </div>
                <span className="text-6xl font-black text-slate-100 absolute top-8 right-8 group-hover:text-teal-50 transition-colors select-none">
                  {item.step}
                </span>
                <h3 className="text-2xl font-bold mb-4 text-slate-900">{item.title}</h3>
                <p className="text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            </ScrollAnimationWrapper>
          ))}
        </div>
      </div>
    </section>
  );
};

export const CourseStatsSection = ({ language }: { language: string }) => {
  const isFrench = language === 'fr';

  return (
    <section className="py-20 bg-white border-y border-slate-100">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
          <AnimatedCounter 
            value={95} 
            suffix="%" 
            label={isFrench ? 'Taux de réussite' : 'Success Rate'} 
          />
          <AnimatedCounter 
            value={1200} 
            suffix="+" 
            label={isFrench ? 'Apprenants actifs' : 'Active Learners'} 
          />
          <AnimatedCounter 
            value={45} 
            suffix="" 
            label={isFrench ? 'Coachs experts' : 'Expert Coaches'} 
          />
          <AnimatedCounter 
            value={100} 
            suffix="%" 
            label={isFrench ? 'Satisfaction garantie' : 'Satisfaction Guaranteed'} 
          />
        </div>
      </div>
    </section>
  );
};

interface CourseCardEnhancedProps {
  course: any;
  language: string;
  onEnroll: (courseId: string) => void;
  delay?: number;
}

export const CourseCardEnhanced = ({ course, language, onEnroll, delay = 0 }: CourseCardEnhancedProps) => {
  const isFrench = language === 'fr';
  const title = isFrench ? course.titleFr : course.title;
  const description = isFrench ? course.descriptionFr : course.description;

  const levelColors: Record<string, string> = {
    'A1': 'bg-blue-50 text-blue-700',
    'A2': 'bg-cyan-50 text-cyan-700',
    'B1': 'bg-teal-50 text-teal-700',
    'B2': 'bg-emerald-50 text-emerald-700',
    'C1': 'bg-amber-50 text-amber-700',
    'Exam Prep': 'bg-orange-50 text-orange-700'
  };

  return (
    <PremiumCard delay={delay} className="flex flex-col h-full">
      <div className={`h-48 ${levelColors[course.level] || 'bg-slate-50'} flex items-center justify-center relative overflow-hidden`}>
        <div className="text-8xl font-black text-white/40 select-none">{course.level}</div>
        {course.popular && (
          <Badge className="absolute top-6 right-6 bg-white/80 backdrop-blur-md text-slate-900 border-none px-4 py-1">
            {isFrench ? 'Populaire' : 'Popular'}
          </Badge>
        )}
      </div>
      
      <div className="p-8 flex-1 flex flex-col">
        <h3 className="text-2xl font-bold mb-4 text-slate-900">{title}</h3>
        <p className="text-slate-600 mb-6 flex-1">{description}</p>
        
        <div className="space-y-3 mb-8">
          {(course.features || []).slice(0, 3).map((feature: string, idx: number) => (
            <div key={idx} className="flex items-center gap-3 text-slate-600">
              <CheckCircle className="h-5 w-5 text-teal-500 flex-shrink-0" />
              <span className="text-sm">{feature}</span>
            </div>
          ))}
        </div>
        
        <div className="mt-auto pt-6 border-t border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-sm text-slate-400 block">{isFrench ? 'À partir de' : 'Starting at'}</span>
            <span className="text-3xl font-bold text-teal-600">{course.priceDisplay || '$299'}</span>
          </div>
          <MagneticButton>
            <Button 
              onClick={() => onEnroll(course.id)}
              className="rounded-full bg-slate-900 hover:bg-teal-700 text-white px-6 gap-2"
            >
              {isFrench ? 'S\'inscrire' : 'Enroll Now'}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </MagneticButton>
        </div>
      </div>
    </PremiumCard>
  );
};
