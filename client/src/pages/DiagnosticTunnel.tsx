import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'wouter';
import SEO from '@/components/SEO';
import { useLanguage } from '@/contexts/LanguageContext';
import FooterInstitutional from '@/components/FooterInstitutional';
import { 
  ArrowRight, 
  ArrowLeft,
  CheckCircle, 
  Clock, 
  Users, 
  Award, 
  Star,
  Calendar,
  Target,
  TrendingUp,
  MessageSquare,
  Zap,
  Shield,
  Gift
} from 'lucide-react';

// Design tokens from design-tokens.json v3.0
const tokens = {
  colors: {
    bg: { canvas: '#FEFEF8', surface: '#FFFFFF' },
    text: { primary: '#0B1220', secondary: '#3A4456', muted: '#6B7280', onDark: '#FFFFFF' },
    accent: { navy: '#0F2A44', teal: '#0E7490', violet: '#6D28D9', orangeCTA: '#F7941D' },
    border: { subtle: '#E7E7DF', strong: '#D3D3C9' },
    glass: { bg: 'rgba(255,255,255,0.72)', border: 'rgba(255,255,255,0.55)' }
  },
  radius: { sm: '10px', md: '16px', lg: '24px', pill: '999px' },
  shadow: { 
    2: '0 6px 18px rgba(15, 23, 42, 0.10)',
    3: '0 16px 40px rgba(15, 23, 42, 0.14)',
    glass: '0 10px 30px rgba(15, 23, 42, 0.10)'
  }
};

const labels = {
  en: {
    seo: {
      title: 'Free SLE Diagnostic - RusingÂcademy',
      description: 'Book your free 30-minute SLE diagnostic session. Get personalized recommendations for your bilingual journey.'
    },
    hero: {
      badge: 'Free Diagnostic',
      title: 'Discover Your Path to',
      titleHighlight: 'Bilingual Excellence',
      subtitle: 'A complimentary 30-minute session with an expert SLE coach to assess your current level and create your personalized success roadmap.',
      cta: 'Book Your Free Session',
      valueProps: [
        { icon: 'Clock', text: '30-minute session' },
        { icon: 'Gift', text: '100% Free' },
        { icon: 'Target', text: 'Personalized plan' },
      ]
    },
    steps: {
      title: 'How It Works',
      subtitle: 'Your Journey Starts Here',
      items: [
        {
          step: 1,
          title: 'Book Your Session',
          description: 'Choose a time that works for you. Our calendar is flexible to accommodate your schedule.',
          icon: 'Calendar'
        },
        {
          step: 2,
          title: 'Meet Your Coach',
          description: 'Connect with a certified SLE expert who understands the GC language requirements.',
          icon: 'Users'
        },
        {
          step: 3,
          title: 'Get Your Roadmap',
          description: 'Receive a personalized assessment and clear action plan for your bilingual goals.',
          icon: 'Target'
        },
      ]
    },
    benefits: {
      title: 'What You\'ll Discover',
      subtitle: 'In Just 30 Minutes',
      items: [
        {
          icon: 'TrendingUp',
          title: 'Your Current Level',
          description: 'Accurate assessment of your French proficiency aligned with CEFR standards.'
        },
        {
          icon: 'Target',
          title: 'Gap Analysis',
          description: 'Clear identification of areas that need improvement for your SLE goals.'
        },
        {
          icon: 'Zap',
          title: 'Fast-Track Options',
          description: 'Personalized recommendations for the quickest path to your target level.'
        },
        {
          icon: 'Shield',
          title: 'Success Strategy',
          description: 'A concrete action plan with timeline and milestones for your journey.'
        },
      ]
    },
    testimonials: {
      title: 'Success Stories',
      subtitle: 'From Diagnostic to Success',
      items: [
        {
          quote: 'The diagnostic session gave me clarity on exactly what I needed to work on. I passed my CBC exam 3 months later!',
          name: 'Sarah M.',
          role: 'Policy Analyst',
          org: 'Global Affairs Canada',
          result: 'Achieved CBC'
        },
        {
          quote: 'Best investment I made for my career. The personalized plan was exactly what I needed.',
          name: 'Michael A.',
          role: 'HR Director',
          org: 'Treasury Board Secretariat',
          result: 'Promoted to EX-01'
        },
        {
          quote: 'I went from feeling lost to having a clear roadmap. Highly recommend!',
          name: 'Jennifer W.',
          role: 'Deputy Director',
          org: 'ESDC',
          result: 'Passed SLE on first attempt'
        },
      ]
    },
    faq: {
      title: 'Common Questions',
      items: [
        {
          q: 'Is the diagnostic really free?',
          a: 'Yes! The 30-minute diagnostic session is completely free with no obligations. It\'s our way of helping you start your bilingual journey with clarity.'
        },
        {
          q: 'What should I prepare?',
          a: 'Just come ready to have a conversation in French! We recommend a quiet space with a good internet connection.'
        },
        {
          q: 'How is the session conducted?',
          a: 'The session is conducted via video call. You\'ll receive a link after booking.'
        },
        {
          q: 'What happens after the diagnostic?',
          a: 'You\'ll receive a personalized assessment report and recommendations. There\'s no pressure to sign up for anything.'
        },
        {
          q: 'Can I reschedule if needed?',
          a: 'Absolutely! You can reschedule up to 24 hours before your session.'
        },
      ]
    },
    cta: {
      title: 'Ready to Start Your Journey?',
      subtitle: 'Book your free diagnostic session today and take the first step toward bilingual excellence.',
      button: 'Book Your Free Session',
      note: 'No credit card required. No obligations.'
    },
    booking: {
      title: 'Select Your Preferred Time',
      subtitle: 'Choose a time slot that works best for you',
      loading: 'Loading calendar...',
      calendlyUrl: 'https://calendly.com/steven-barholere/30min'
    }
  },
  fr: {
    seo: {
      title: 'Diagnostic ELS Gratuit - RusingÂcademy',
      description: 'Réservez votre session de diagnostic ELS gratuite de 30 minutes. Obtenez des recommandations personnalisées pour votre parcours bilingue.'
    },
    hero: {
      badge: 'Diagnostic Gratuit',
      title: 'Découvrez Votre Chemin vers',
      titleHighlight: 'l\'Excellence Bilingue',
      subtitle: 'Une session gratuite de 30 minutes avec un coach expert ELS pour évaluer votre niveau actuel et créer votre feuille de route personnalisée.',
      cta: 'Réserver Votre Session Gratuite',
      valueProps: [
        { icon: 'Clock', text: 'Session de 30 minutes' },
        { icon: 'Gift', text: '100% Gratuit' },
        { icon: 'Target', text: 'Plan personnalisé' },
      ]
    },
    steps: {
      title: 'Comment Ça Marche',
      subtitle: 'Votre Parcours Commence Ici',
      items: [
        {
          step: 1,
          title: 'Réservez Votre Session',
          description: 'Choisissez un moment qui vous convient. Notre calendrier est flexible pour s\'adapter à votre horaire.',
          icon: 'Calendar'
        },
        {
          step: 2,
          title: 'Rencontrez Votre Coach',
          description: 'Connectez-vous avec un expert ELS certifié qui comprend les exigences linguistiques du GC.',
          icon: 'Users'
        },
        {
          step: 3,
          title: 'Obtenez Votre Feuille de Route',
          description: 'Recevez une évaluation personnalisée et un plan d\'action clair pour vos objectifs bilingues.',
          icon: 'Target'
        },
      ]
    },
    benefits: {
      title: 'Ce Que Vous Découvrirez',
      subtitle: 'En Seulement 30 Minutes',
      items: [
        {
          icon: 'TrendingUp',
          title: 'Votre Niveau Actuel',
          description: 'Évaluation précise de votre maîtrise du français alignée sur les normes CECR.'
        },
        {
          icon: 'Target',
          title: 'Analyse des Lacunes',
          description: 'Identification claire des domaines à améliorer pour vos objectifs ELS.'
        },
        {
          icon: 'Zap',
          title: 'Options Accélérées',
          description: 'Recommandations personnalisées pour le chemin le plus rapide vers votre niveau cible.'
        },
        {
          icon: 'Shield',
          title: 'Stratégie de Réussite',
          description: 'Un plan d\'action concret avec calendrier et jalons pour votre parcours.'
        },
      ]
    },
    testimonials: {
      title: 'Histoires de Réussite',
      subtitle: 'Du Diagnostic au Succès',
      items: [
        {
          quote: 'La session de diagnostic m\'a donné de la clarté sur exactement ce sur quoi je devais travailler. J\'ai réussi mon examen CBC 3 mois plus tard!',
          name: 'Sarah M.',
          role: 'Analyste de politiques',
          org: 'Affaires mondiales Canada',
          result: 'CBC atteint'
        },
        {
          quote: 'Le meilleur investissement que j\'ai fait pour ma carrière. Le plan personnalisé était exactement ce dont j\'avais besoin.',
          name: 'Michael A.',
          role: 'Directeur RH',
          org: 'Secrétariat du Conseil du Trésor',
          result: 'Promu EX-01'
        },
        {
          quote: 'Je suis passé de me sentir perdu à avoir une feuille de route claire. Fortement recommandé!',
          name: 'Jennifer W.',
          role: 'Directrice adjointe',
          org: 'EDSC',
          result: 'Réussi ELS au premier essai'
        },
      ]
    },
    faq: {
      title: 'Questions Fréquentes',
      items: [
        {
          q: 'Le diagnostic est-il vraiment gratuit?',
          a: 'Oui! La session de diagnostic de 30 minutes est entièrement gratuite sans aucune obligation. C\'est notre façon de vous aider à commencer votre parcours bilingue avec clarté.'
        },
        {
          q: 'Comment dois-je me préparer?',
          a: 'Venez simplement prêt à avoir une conversation en français! Nous recommandons un espace calme avec une bonne connexion internet.'
        },
        {
          q: 'Comment se déroule la session?',
          a: 'La session se déroule par appel vidéo. Vous recevrez un lien après la réservation.'
        },
        {
          q: 'Que se passe-t-il après le diagnostic?',
          a: 'Vous recevrez un rapport d\'évaluation personnalisé et des recommandations. Il n\'y a aucune pression pour s\'inscrire à quoi que ce soit.'
        },
        {
          q: 'Puis-je reporter si nécessaire?',
          a: 'Absolument! Vous pouvez reporter jusqu\'à 24 heures avant votre session.'
        },
      ]
    },
    cta: {
      title: 'Prêt à Commencer Votre Parcours?',
      subtitle: 'Réservez votre session de diagnostic gratuite aujourd\'hui et faites le premier pas vers l\'excellence bilingue.',
      button: 'Réserver Votre Session Gratuite',
      note: 'Aucune carte de crédit requise. Aucune obligation.'
    },
    booking: {
      title: 'Sélectionnez Votre Créneau Préféré',
      subtitle: 'Choisissez un créneau horaire qui vous convient',
      loading: 'Chargement du calendrier...',
      calendlyUrl: 'https://calendly.com/steven-barholere/30min'
    }
  }
};

const iconMap: Record<string, React.ElementType> = {
  Clock,
  Gift,
  Target,
  Calendar,
  Users,
  TrendingUp,
  Zap,
  Shield,
  MessageSquare,
};

export default function DiagnosticTunnel() {
  const { language } = useLanguage();
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [showBooking, setShowBooking] = useState(false);
  
  const t = labels[language as 'en' | 'fr'] || labels.en;

  const scrollToBooking = () => {
    setShowBooking(true);
    setTimeout(() => {
      document.getElementById('booking-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: tokens.colors.bg.canvas }}>
      <SEO
        title={t.seo.title}
        description={t.seo.description}
      />

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 overflow-hidden">
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            background: `radial-gradient(ellipse at top right, ${tokens.colors.accent.teal} 0%, transparent 50%)`,
          }}
        />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <span 
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-6"
              style={{ 
                backgroundColor: `${tokens.colors.accent.teal}15`,
                color: tokens.colors.accent.teal 
              }}
            >
              <Gift className="w-4 h-4" />
              {t.hero.badge}
            </span>
            
            <h1 
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
              style={{ color: tokens.colors.text.primary }}
            >
              {t.hero.title}{' '}
              <span style={{ color: tokens.colors.accent.teal }}>
                {t.hero.titleHighlight}
              </span>
            </h1>
            
            <p 
              className="text-lg md:text-xl mb-8 max-w-3xl mx-auto"
              style={{ color: tokens.colors.text.secondary }}
            >
              {t.hero.subtitle}
            </p>

            {/* Value Props */}
            <div className="flex flex-wrap justify-center gap-6 mb-8">
              {t.hero.valueProps.map((prop, index) => {
                const Icon = iconMap[prop.icon] || CheckCircle;
                return (
                  <div 
                    key={index}
                    className="flex items-center gap-2"
                    style={{ color: tokens.colors.text.secondary }}
                  >
                    <Icon className="w-5 h-5" style={{ color: tokens.colors.accent.teal }} />
                    <span className="font-medium">{prop.text}</span>
                  </div>
                );
              })}
            </div>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={scrollToBooking}
              className="px-8 py-4 rounded-full font-semibold text-white flex items-center justify-center gap-2 mx-auto"
              style={{ backgroundColor: tokens.colors.accent.orangeCTA }}
            >
              {t.hero.cta}
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20" style={{ backgroundColor: tokens.colors.bg.surface }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span 
              className="text-sm font-semibold uppercase tracking-wider mb-4 block"
              style={{ color: tokens.colors.accent.teal }}
            >
              {t.steps.subtitle}
            </span>
            <h2 
              className="text-3xl md:text-4xl font-bold"
              style={{ color: tokens.colors.text.primary }}
            >
              {t.steps.title}
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {t.steps.items.map((step, index) => {
              const Icon = iconMap[step.icon] || CheckCircle;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="relative text-center"
                >
                  {/* Connector Line */}
                  {index < t.steps.items.length - 1 && (
                    <div 
                      className="hidden md:block absolute top-12 left-1/2 w-full h-0.5"
                      style={{ backgroundColor: tokens.colors.border.subtle }}
                    />
                  )}
                  
                  <div 
                    className="relative w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6"
                    style={{ 
                      backgroundColor: tokens.colors.bg.canvas,
                      border: `2px solid ${tokens.colors.accent.teal}`,
                      boxShadow: tokens.shadow[2]
                    }}
                  >
                    <span 
                      className="absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                      style={{ 
                        backgroundColor: tokens.colors.accent.teal,
                        color: tokens.colors.text.onDark
                      }}
                    >
                      {step.step}
                    </span>
                    <Icon className="w-10 h-10" style={{ color: tokens.colors.accent.teal }} />
                  </div>
                  
                  <h3 
                    className="text-xl font-bold mb-3"
                    style={{ color: tokens.colors.text.primary }}
                  >
                    {step.title}
                  </h3>
                  <p style={{ color: tokens.colors.text.secondary }}>
                    {step.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20" style={{ backgroundColor: tokens.colors.bg.canvas }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span 
              className="text-sm font-semibold uppercase tracking-wider mb-4 block"
              style={{ color: tokens.colors.accent.teal }}
            >
              {t.benefits.subtitle}
            </span>
            <h2 
              className="text-3xl md:text-4xl font-bold"
              style={{ color: tokens.colors.text.primary }}
            >
              {t.benefits.title}
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {t.benefits.items.map((benefit, index) => {
              const Icon = iconMap[benefit.icon] || CheckCircle;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="p-6 rounded-2xl flex gap-4"
                  style={{ 
                    backgroundColor: tokens.colors.bg.surface,
                    border: `1px solid ${tokens.colors.border.subtle}`,
                    boxShadow: tokens.shadow[2]
                  }}
                >
                  <div 
                    className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${tokens.colors.accent.teal}15` }}
                  >
                    <Icon className="w-7 h-7" style={{ color: tokens.colors.accent.teal }} />
                  </div>
                  <div>
                    <h3 
                      className="text-lg font-bold mb-2"
                      style={{ color: tokens.colors.text.primary }}
                    >
                      {benefit.title}
                    </h3>
                    <p style={{ color: tokens.colors.text.secondary }}>
                      {benefit.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20" style={{ backgroundColor: tokens.colors.bg.surface }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span 
              className="text-sm font-semibold uppercase tracking-wider mb-4 block"
              style={{ color: tokens.colors.accent.teal }}
            >
              {t.testimonials.subtitle}
            </span>
            <h2 
              className="text-3xl md:text-4xl font-bold"
              style={{ color: tokens.colors.text.primary }}
            >
              {t.testimonials.title}
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {t.testimonials.items.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-8 rounded-3xl"
                style={{ 
                  backgroundColor: tokens.colors.bg.canvas,
                  border: `1px solid ${tokens.colors.border.subtle}`,
                  boxShadow: tokens.shadow[2]
                }}
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className="w-5 h-5 fill-current" 
                      style={{ color: tokens.colors.accent.orangeCTA }} 
                    />
                  ))}
                </div>
                <blockquote 
                  className="text-lg mb-6 italic"
                  style={{ color: tokens.colors.text.primary }}
                >
                  "{testimonial.quote}"
                </blockquote>
                <div className="flex items-center justify-between">
                  <div>
                    <div 
                      className="font-semibold"
                      style={{ color: tokens.colors.text.primary }}
                    >
                      {testimonial.name}
                    </div>
                    <div 
                      className="text-sm"
                      style={{ color: tokens.colors.text.muted }}
                    >
                      {testimonial.role}, {testimonial.org}
                    </div>
                  </div>
                  <div 
                    className="px-3 py-1 rounded-full text-xs font-semibold"
                    style={{ 
                      backgroundColor: `${tokens.colors.accent.teal}15`,
                      color: tokens.colors.accent.teal
                    }}
                  >
                    {testimonial.result}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20" style={{ backgroundColor: tokens.colors.bg.canvas }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 
              className="text-3xl md:text-4xl font-bold"
              style={{ color: tokens.colors.text.primary }}
            >
              {t.faq.title}
            </h2>
          </motion.div>

          <div className="space-y-4">
            {t.faq.items.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="rounded-2xl overflow-hidden"
                style={{ 
                  backgroundColor: tokens.colors.bg.surface,
                  border: `1px solid ${tokens.colors.border.subtle}`
                }}
              >
                <button
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  className="w-full p-6 text-left flex items-center justify-between"
                >
                  <span 
                    className="font-semibold pr-4"
                    style={{ color: tokens.colors.text.primary }}
                  >
                    {faq.q}
                  </span>
                  <motion.div
                    animate={{ rotate: expandedFaq === index ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ArrowRight 
                      className="w-5 h-5 transform rotate-90" 
                      style={{ color: tokens.colors.accent.teal }} 
                    />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {expandedFaq === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div 
                        className="px-6 pb-6"
                        style={{ color: tokens.colors.text.secondary }}
                      >
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking Section */}
      <section 
        id="booking-section"
        className="py-20"
        style={{ backgroundColor: tokens.colors.accent.navy }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 
              className="text-3xl md:text-4xl font-bold mb-4"
              style={{ color: tokens.colors.text.onDark }}
            >
              {t.cta.title}
            </h2>
            <p 
              className="text-lg mb-8 opacity-90"
              style={{ color: tokens.colors.text.onDark }}
            >
              {t.cta.subtitle}
            </p>

            {showBooking ? (
              <div 
                className="rounded-2xl overflow-hidden"
                style={{ 
                  backgroundColor: tokens.colors.bg.surface,
                  boxShadow: tokens.shadow[3]
                }}
              >
                <div className="p-6 text-center">
                  <h3 
                    className="text-xl font-bold mb-2"
                    style={{ color: tokens.colors.text.primary }}
                  >
                    {t.booking.title}
                  </h3>
                  <p 
                    className="mb-6"
                    style={{ color: tokens.colors.text.secondary }}
                  >
                    {t.booking.subtitle}
                  </p>
                  
                  {/* Calendly Embed */}
                  <div className="calendly-inline-widget" style={{ minWidth: '320px', height: '630px' }}>
                    <iframe
                      src={`${t.booking.calendlyUrl}?hide_gdpr_banner=1&background_color=fefef8&text_color=0b1220&primary_color=0e7490`}
                      width="100%"
                      height="100%"
                      frameBorder="0"
                      title="Schedule a diagnostic session"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={scrollToBooking}
                  className="px-8 py-4 rounded-full font-semibold flex items-center justify-center gap-2 mx-auto mb-4"
                  style={{ 
                    backgroundColor: tokens.colors.accent.orangeCTA,
                    color: tokens.colors.text.onDark
                  }}
                >
                  {t.cta.button}
                  <Calendar className="w-5 h-5" />
                </motion.button>
                <p 
                  className="text-sm opacity-75"
                  style={{ color: tokens.colors.text.onDark }}
                >
                  {t.cta.note}
                </p>
              </>
            )}
          </motion.div>
        </div>
      </section>

      <FooterInstitutional />
    </div>
  );
}
