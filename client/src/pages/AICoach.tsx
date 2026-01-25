import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import Footer from '../components/Footer';
import { Zap, Brain, Mic, BookOpen, Target, Award } from 'lucide-react';

export default function AICoach() {
  const { language } = useLanguage();

  const labels = {
    en: {
      title: 'SLE AI Companion Coach',
      description: 'Practice your SLE skills with our AI-powered language coach',
      hero: {
        title: 'Master Your SLE Skills',
        subtitle: 'with AI-Powered Practice',
        description: 'Get personalized coaching from SLE AI Companion. Practice speaking, writing, and reading with real-time feedback.',
        cta: 'Start Practicing Now',
      },
      features: [
        {
          icon: Mic,
          title: 'Voice Practice',
          description: 'Practice your oral skills with real-time feedback from our AI coach.',
        },
        {
          icon: BookOpen,
          title: 'Placement Test',
          description: 'Assess your current level with our comprehensive placement test.',
        },
        {
          icon: Target,
          title: 'Exam Simulation',
          description: 'Simulate the SLE exam experience and get detailed performance analysis.',
        },
      ],
    },
    fr: {
      title: 'Coach IA SLE AI Companion',
      description: 'Pratiquez vos compétences ELS avec notre coach linguistique alimenté par l\'IA',
      hero: {
        title: 'Maîtrisez Vos Compétences ELS',
        subtitle: 'avec la Pratique Alimentée par l\'IA',
        description: 'Obtenez un coaching personnalisé du coach IA SLE AI Companion. Pratiquez la parole, l\'écriture et la lecture avec des commentaires en temps réel.',
        cta: 'Commencer à Pratiquer',
      },
      features: [
        {
          icon: Mic,
          title: 'Pratique Orale',
          description: 'Pratiquez vos compétences orales avec des commentaires en temps réel de notre coach IA.',
        },
        {
          icon: BookOpen,
          title: 'Test de Classement',
          description: 'Évaluez votre niveau actuel avec notre test de classement complet.',
        },
        {
          icon: Target,
          title: 'Simulation d\'Examen',
          description: 'Simulez l\'expérience de l\'examen ELS et obtenez une analyse détaillée de vos performances.',
        },
      ],
    },
  };

  const currentLabels = labels[language as keyof typeof labels] || labels.en;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-slate-100">
      
      
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-12 sm:py-20">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-100 rounded-full mb-6">
            <Zap className="w-4 h-4 text-teal-600" />
            <span className="text-sm font-semibold text-teal-600">
              {language === 'en' ? 'AI-Powered Learning' : 'Apprentissage Alimenté par l\'IA'}
            </span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            {currentLabels.hero.title}
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            {currentLabels.hero.subtitle}
          </p>
          
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            {currentLabels.hero.description}
          </p>
          
          <a
            href="https://calendly.com/steven-barholere/30min"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-8 py-4 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-lg transition-colors"
          >
            {currentLabels.hero.cta}
          </a>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {currentLabels.features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                  <IconComponent className="w-6 h-6 text-teal-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-teal-600 to-teal-700 rounded-2xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            {language === 'en' 
              ? 'Ready to improve your SLE skills?' 
              : 'Prêt à améliorer vos compétences ELS?'}
          </h2>
          <p className="text-lg mb-8 opacity-90">
            {language === 'en' 
              ? 'Book a personalized diagnostic session with our expert coaches.' 
              : 'Réservez une séance de diagnostic personnalisée avec nos coachs experts.'}
          </p>
          <a
            href="https://calendly.com/steven-barholere/30min"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-8 py-4 bg-white hover:bg-gray-100 text-teal-600 font-bold rounded-lg transition-colors"
          >
            {language === 'en' ? 'Book a Diagnostic (30 min)' : 'Réserver un diagnostic (30 min)'}
          </a>
        </div>
      </main>

      <Footer />
    </div>
  );
}
