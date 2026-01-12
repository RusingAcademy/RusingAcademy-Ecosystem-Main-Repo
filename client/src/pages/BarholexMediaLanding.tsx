import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import SEO from '@/components/SEO';
import { motion } from 'framer-motion';
import { 
  Mic, 
  Video, 
  Users, 
  Award, 
  CheckCircle, 
  ArrowRight, 
  Play,
  MessageSquare,
  Sparkles,
  Camera,
  Presentation,
  Globe,
  Sun,
  Moon,
  ChevronRight,
  FileText,
  Zap,
  GraduationCap,
  Laptop,
  Building2,
  Phone
} from 'lucide-react';
import { brandColors, animationVariants, transitions } from '../lib/ecosystem-design-system';
import { EcosystemFooter } from '../components/EcosystemFooter';

const labels = {
  en: {
    nav: {
      services: 'Services',
      portfolio: 'Portfolio',
      contact: 'Contact',
      ecosystem: 'Ecosystem',
    },
    hero: {
      badge: 'Premium Media Production',
      title: 'Elevate Your',
      titleHighlight: 'Executive Presence',
      subtitle: 'Premium audiovisual production and bilingual leadership communication coaching. Transform how you present, persuade, and perform in both official languages.',
      cta1: 'Request a Quote',
      cta2: 'Explore Services',
    },
    services: {
      title: 'Our Services',
      subtitle: 'Comprehensive media solutions for executive communication',
      items: [
        {
          icon: 'Mic',
          title: 'Podcast & Video Production',
          desc: 'Turnkey production from concept to delivery. Professional studio quality for internal communications, training, and thought leadership.',
          features: ['Full production services', 'Professional editing', 'Multi-format delivery', 'Bilingual content'],
        },
        {
          icon: 'Presentation',
          title: 'Executive Presence Coaching',
          desc: 'One-on-one coaching to develop commanding presence in both official languages. Perfect for senior leaders and emerging executives.',
          features: ['Bilingual delivery skills', 'Media training', 'Presentation mastery', 'Confidence building'],
        },
        {
          icon: 'FileText',
          title: 'Strategic Communications',
          desc: 'Craft compelling narratives for government and corporate contexts. From speeches to strategic messaging frameworks.',
          features: ['Speech writing', 'Key message development', 'Stakeholder communications', 'Crisis messaging'],
        },
      ],
    },
    process: {
      title: 'Our Process',
      subtitle: 'From brief to delivery in three simple steps',
      steps: [
        { 
          number: '01', 
          title: 'Discovery & Brief', 
          desc: 'We understand your goals, audience, and brand voice through a comprehensive consultation.' 
        },
        { 
          number: '02', 
          title: 'Production', 
          desc: 'Our team handles everything from scripting to filming, editing, and post-production.' 
        },
        { 
          number: '03', 
          title: 'Delivery & Support', 
          desc: 'Receive your polished content in all required formats with ongoing support.' 
        },
      ],
    },
    portfolio: {
      title: 'Featured Work',
      subtitle: 'A selection of our recent projects',
      items: [
        { title: 'Leadership Series', type: 'Podcast', client: 'Federal Agency' },
        { title: 'Annual Report Video', type: 'Video', client: 'Crown Corporation' },
        { title: 'Executive Training', type: 'Coaching', client: 'Central Agency' },
        { title: 'Internal Communications', type: 'Podcast', client: 'Department' },
      ],
    },
    testimonials: {
      title: 'Client Success Stories',
      items: [
        {
          quote: 'Barholex Media transformed our internal podcast into a professional production that our employees actually look forward to.',
          name: 'Communications Director',
          org: 'Federal Department',
        },
        {
          quote: 'The executive coaching helped me deliver bilingual presentations with confidence I never thought possible.',
          name: 'Assistant Deputy Minister',
          org: 'Central Agency',
        },
      ],
    },
    whoWeServe: {
      title: 'Who We Serve',
      subtitle: 'Empowering organizations across sectors with premium media and consulting',
      items: [
        {
          icon: 'School',
          title: 'Schools & Training Organizations',
          desc: 'Custom curriculum development, instructor training, and EdTech integration for educational institutions.',
        },
        {
          icon: 'Laptop',
          title: 'EdTech Companies',
          desc: 'Strategic consulting on AI-learning implementation, content strategy, and platform development.',
        },
        {
          icon: 'Mic',
          title: 'Content Creators & Podcasters',
          desc: 'Professional production services, brand development, and audience growth strategies.',
        },
        {
          icon: 'Building',
          title: 'Government & Corporate Teams',
          desc: 'Executive communications, bilingual training programs, and internal media production.',
        },
      ],
    },
    consulting: {
      title: 'Consulting Packages',
      subtitle: 'Tailored solutions for your organization\'s unique needs',
      items: [
        {
          title: 'EdTech Strategy',
          price: 'Custom',
          features: ['Learning platform audit', 'AI integration roadmap', 'Content strategy', 'Implementation support'],
        },
        {
          title: 'Media Production',
          price: 'From $5,000',
          features: ['Podcast series (6 episodes)', 'Video production', 'Post-production', 'Distribution strategy'],
        },
        {
          title: 'Executive Coaching',
          price: 'From $2,500',
          features: ['6 coaching sessions', 'Bilingual delivery', 'Media training', 'Presentation review'],
        },
      ],
      cta: 'Book a Discovery Call',
    },
    cta: {
      title: 'Ready to Elevate Your Communications?',
      subtitle: 'Let\'s discuss how we can help you achieve your communication goals.',
      button1: 'Request a Quote',
      button2: 'Schedule a Call',
    },
  },
  fr: {
    nav: {
      services: 'Services',
      portfolio: 'Portfolio',
      contact: 'Contact',
      ecosystem: 'Écosystème',
    },
    hero: {
      badge: 'Production média premium',
      title: 'Élevez votre',
      titleHighlight: 'présence exécutive',
      subtitle: 'Production audiovisuelle premium et coaching en communication de leadership bilingue. Transformez votre façon de présenter, persuader et performer dans les deux langues officielles.',
      cta1: 'Demander un devis',
      cta2: 'Explorer les services',
    },
    services: {
      title: 'Nos services',
      subtitle: 'Solutions média complètes pour la communication exécutive',
      items: [
        {
          icon: 'Mic',
          title: 'Production podcast & vidéo',
          desc: 'Production clé en main du concept à la livraison. Qualité studio professionnelle pour communications internes, formation et leadership éclairé.',
          features: ['Services de production complets', 'Montage professionnel', 'Livraison multi-format', 'Contenu bilingue'],
        },
        {
          icon: 'Presentation',
          title: 'Coaching présence exécutive',
          desc: 'Coaching individuel pour développer une présence commandante dans les deux langues officielles. Parfait pour les leaders seniors et émergents.',
          features: ['Compétences bilingues', 'Formation média', 'Maîtrise des présentations', 'Renforcement de la confiance'],
        },
        {
          icon: 'FileText',
          title: 'Communications stratégiques',
          desc: 'Créez des récits convaincants pour les contextes gouvernementaux et corporatifs. Des discours aux cadres de messages stratégiques.',
          features: ['Rédaction de discours', 'Développement de messages clés', 'Communications parties prenantes', 'Messages de crise'],
        },
      ],
    },
    process: {
      title: 'Notre processus',
      subtitle: 'Du brief à la livraison en trois étapes simples',
      steps: [
        { 
          number: '01', 
          title: 'Découverte & Brief', 
          desc: 'Nous comprenons vos objectifs, votre audience et votre voix de marque à travers une consultation approfondie.' 
        },
        { 
          number: '02', 
          title: 'Production', 
          desc: 'Notre équipe gère tout, de la scénarisation au tournage, montage et post-production.' 
        },
        { 
          number: '03', 
          title: 'Livraison & Support', 
          desc: 'Recevez votre contenu finalisé dans tous les formats requis avec un support continu.' 
        },
      ],
    },
    portfolio: {
      title: 'Travaux en vedette',
      subtitle: 'Une sélection de nos projets récents',
      items: [
        { title: 'Série Leadership', type: 'Podcast', client: 'Agence fédérale' },
        { title: 'Vidéo rapport annuel', type: 'Vidéo', client: 'Société d\'État' },
        { title: 'Formation exécutive', type: 'Coaching', client: 'Organisme central' },
        { title: 'Communications internes', type: 'Podcast', client: 'Ministère' },
      ],
    },
    testimonials: {
      title: 'Témoignages clients',
      items: [
        {
          quote: 'Barholex Media a transformé notre podcast interne en une production professionnelle que nos employés attendent avec impatience.',
          name: 'Directeur des communications',
          org: 'Ministère fédéral',
        },
        {
          quote: 'Le coaching exécutif m\'a aidé à livrer des présentations bilingues avec une confiance que je n\'aurais jamais cru possible.',
          name: 'Sous-ministre adjoint',
          org: 'Organisme central',
        },
      ],
    },
    whoWeServe: {
      title: 'Qui nous servons',
      subtitle: 'Accompagner les organisations de tous secteurs avec des médias et conseils premium',
      items: [
        {
          icon: 'School',
          title: 'Écoles et organismes de formation',
          desc: 'Développement de curriculum, formation des instructeurs et intégration EdTech pour les établissements éducatifs.',
        },
        {
          icon: 'Laptop',
          title: 'Entreprises EdTech',
          desc: 'Conseil stratégique sur l\'implémentation de l\'IA-learning, stratégie de contenu et développement de plateforme.',
        },
        {
          icon: 'Mic',
          title: 'Créateurs de contenu et podcasteurs',
          desc: 'Services de production professionnelle, développement de marque et stratégies de croissance d\'audience.',
        },
        {
          icon: 'Building',
          title: 'Équipes gouvernementales et corporatives',
          desc: 'Communications exécutives, programmes de formation bilingue et production média interne.',
        },
      ],
    },
    consulting: {
      title: 'Forfaits de consultation',
      subtitle: 'Solutions sur mesure pour les besoins uniques de votre organisation',
      items: [
        {
          title: 'Stratégie EdTech',
          price: 'Sur mesure',
          features: ['Audit de plateforme', 'Feuille de route IA', 'Stratégie de contenu', 'Support d\'implémentation'],
        },
        {
          title: 'Production média',
          price: 'À partir de 5 000 $',
          features: ['Série podcast (6 épisodes)', 'Production vidéo', 'Post-production', 'Stratégie de distribution'],
        },
        {
          title: 'Coaching exécutif',
          price: 'À partir de 2 500 $',
          features: ['6 séances de coaching', 'Livraison bilingue', 'Formation média', 'Révision de présentation'],
        },
      ],
      cta: 'Réserver un appel découverte',
    },
    cta: {
      title: 'Prêt à élever vos communications?',
      subtitle: 'Discutons de la façon dont nous pouvons vous aider à atteindre vos objectifs de communication.',
      button1: 'Demander un devis',
      button2: 'Planifier un appel',
    },
  },
};

const iconMap: Record<string, React.ElementType> = {
  Mic,
  Presentation,
  FileText,
  School: GraduationCap,
  Laptop,
  Building: Building2,
};

export default function BarholexMediaLanding() {
  const [lang, setLang] = useState<'en' | 'fr'>('en');
  const [theme, setTheme] = useState<'glass' | 'light'>('glass');

  useEffect(() => {
    const savedLang = localStorage.getItem('ecosystem-lang') as 'en' | 'fr' | null;
    const savedTheme = localStorage.getItem('ecosystem-theme') as 'glass' | 'light' | null;
    if (savedLang) setLang(savedLang);
    if (savedTheme) setTheme(savedTheme);
  }, []);

  const toggleLang = (newLang: 'en' | 'fr') => {
    setLang(newLang);
    localStorage.setItem('ecosystem-lang', newLang);
  };

  const toggleTheme = () => {
    const newTheme = theme === 'glass' ? 'light' : 'glass';
    setTheme(newTheme);
    localStorage.setItem('ecosystem-theme', newTheme);
  };

  const t = labels[lang];
  const isGlass = theme === 'glass';
  const brand = brandColors.barholexMedia;

  return (
    <div className={`min-h-screen ${isGlass ? 'bg-slate-950 text-white' : 'bg-white text-gray-900'}`}>
      <SEO
        title="Barholex Media - Premium Production & Consulting"
        description="Premium audiovisual production, executive presence coaching, and EdTech consulting. Transform your bilingual communications with professional media services."
        canonical="https://www.rusingacademy.ca/barholex-media"
      />
      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 ${
        isGlass 
          ? 'bg-slate-900/80 backdrop-blur-xl border-b border-white/10' 
          : 'bg-white/90 backdrop-blur-xl border-b border-gray-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <Link href="/barholex-media" className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: brand.gradient }}
            >
              <Mic className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className={`font-bold ${isGlass ? 'text-white' : 'text-gray-900'}`}>
                Barholex Media
              </span>
              <span className={`block text-xs ${isGlass ? 'text-violet-400' : 'text-violet-600'}`}>
                Premium Production
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-4">
            {/* Language toggle */}
            <div className={`flex rounded-full p-1 ${isGlass ? 'bg-white/10' : 'bg-gray-100'}`}>
              <button
                onClick={() => toggleLang('en')}
                className={`px-3 py-1 text-sm rounded-full transition-all ${
                  lang === 'en'
                    ? 'bg-violet-500 text-white'
                    : isGlass ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => toggleLang('fr')}
                className={`px-3 py-1 text-sm rounded-full transition-all ${
                  lang === 'fr'
                    ? 'bg-violet-500 text-white'
                    : isGlass ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                FR
              </button>
            </div>

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-full transition-colors ${
                isGlass ? 'hover:bg-white/10' : 'hover:bg-gray-100'
              }`}
            >
              {isGlass ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Ecosystem link */}
            <Link 
              href="/"
              className={`hidden md:flex items-center gap-2 px-4 py-2 rounded-full text-sm transition-colors ${
                isGlass 
                  ? 'bg-white/10 hover:bg-white/20 text-white' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
              }`}
            >
              <Globe className="w-4 h-4" />
              {t.nav.ecosystem}
            </Link>

            {/* CTA */}
            <Link
              href="/contact"
              className="px-4 py-2 rounded-full text-sm font-medium text-white transition-all hover:scale-105"
              style={{ background: brand.gradient }}
            >
              {t.nav.contact}
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Background gradient */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            background: `radial-gradient(ellipse at top right, ${brand.glow} 0%, transparent 50%)`,
          }}
        />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Text content */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={animationVariants.staggerContainer}
            >
              <motion.div 
                variants={animationVariants.fadeInUp}
                transition={transitions.normal}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
                style={{ 
                  background: isGlass ? 'rgba(139, 92, 246, 0.2)' : 'rgba(139, 92, 246, 0.1)',
                  border: `1px solid ${brand.primary}40`
                }}
              >
                <Sparkles className="w-4 h-4" style={{ color: brand.primary }} />
                <span className="text-sm font-medium" style={{ color: brand.primary }}>
                  {t.hero.badge}
                </span>
              </motion.div>

              <motion.h1 
                variants={animationVariants.fadeInUp}
                transition={transitions.normal}
                className={`text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 ${
                  isGlass ? 'text-white' : 'text-gray-900'
                }`}
              >
                {t.hero.title}{' '}
                <span style={{ color: brand.primary }}>{t.hero.titleHighlight}</span>
              </motion.h1>

              <motion.p 
                variants={animationVariants.fadeInUp}
                transition={transitions.normal}
                className={`text-lg md:text-xl mb-8 max-w-xl ${
                  isGlass ? 'text-gray-300' : 'text-gray-600'
                }`}
              >
                {t.hero.subtitle}
              </motion.p>

              <motion.div 
                variants={animationVariants.fadeInUp}
                transition={transitions.normal}
                className="flex flex-wrap gap-4"
              >
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-full font-medium text-white transition-all hover:scale-105 text-sm sm:text-base"
                  style={{ background: brand.gradient }}
                >
                  {t.hero.cta1}
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <a
                  href="#services"
                  className={`inline-flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all hover:scale-105 ${
                    isGlass 
                      ? 'bg-white/10 text-white border border-white/20 hover:bg-white/20' 
                      : 'bg-gray-100 text-gray-900 border border-gray-200 hover:bg-gray-200'
                  }`}
                >
                  {t.hero.cta2}
                </a>
              </motion.div>
            </motion.div>

            {/* Hero image */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="relative"
            >
              <div 
                className="absolute inset-0 rounded-3xl blur-3xl opacity-40"
                style={{ background: brand.gradient }}
              />
              <img
                src="/images/ecosystem/barholex-hero.jpg"
                alt="Professional podcast studio"
                className="relative rounded-3xl shadow-2xl w-full object-cover aspect-[4/3]"
                onError={(e) => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&h=600&fit=crop';
                }}
              />
              {/* Floating badge */}
              <div 
                className={`absolute -bottom-4 -left-4 px-4 py-3 rounded-xl shadow-xl ${
                  isGlass ? 'bg-slate-800/90 backdrop-blur-xl' : 'bg-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ background: brand.gradient }}
                  >
                    <Play className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold" style={{ color: brand.primary }}>4K</p>
                    <p className={`text-xs ${isGlass ? 'text-gray-400' : 'text-gray-500'}`}>
                      Studio Quality
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className={`py-12 sm:py-20 ${isGlass ? 'bg-slate-900/50' : 'bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={animationVariants.fadeInUp}
            className="text-center mb-12"
          >
            <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${isGlass ? 'text-white' : 'text-gray-900'}`}>
              {t.services.title}
            </h2>
            <p className={`text-lg max-w-2xl mx-auto ${isGlass ? 'text-gray-400' : 'text-gray-600'}`}>
              {t.services.subtitle}
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={animationVariants.staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-8"
          >
            {t.services.items.map((item, index) => {
              const Icon = iconMap[item.icon];
              return (
                <motion.div
                  key={index}
                  variants={animationVariants.fadeInUp}
                  transition={{ ...transitions.normal, delay: index * 0.1 }}
                  className={`relative p-8 rounded-3xl overflow-hidden ${
                    isGlass 
                      ? 'bg-gradient-to-br from-white/10 to-white/5 border border-white/10' 
                      : 'bg-white border border-gray-200 shadow-lg'
                  }`}
                >
                  {/* Glow effect */}
                  <div 
                    className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-20"
                    style={{ background: brand.primary }}
                  />
                  
                  <div 
                    className="relative w-14 h-14 rounded-2xl flex items-center justify-center mb-6"
                    style={{ background: brand.gradient }}
                  >
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  
                  <h3 className={`text-xl font-bold mb-3 ${isGlass ? 'text-white' : 'text-gray-900'}`}>
                    {item.title}
                  </h3>
                  <p className={`mb-6 ${isGlass ? 'text-gray-400' : 'text-gray-600'}`}>
                    {item.desc}
                  </p>
                  
                  <ul className="space-y-3">
                    {item.features.map((feature, fIndex) => (
                      <li key={fIndex} className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 flex-shrink-0" style={{ color: brand.primary }} />
                        <span className={`text-sm ${isGlass ? 'text-gray-300' : 'text-gray-700'}`}>
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Who We Serve Section */}
      <section className="py-12 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={animationVariants.fadeInUp}
            className="text-center mb-12"
          >
            <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${isGlass ? 'text-white' : 'text-gray-900'}`}>
              {t.whoWeServe.title}
            </h2>
            <p className={`text-lg max-w-2xl mx-auto ${isGlass ? 'text-gray-400' : 'text-gray-600'}`}>
              {t.whoWeServe.subtitle}
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={animationVariants.staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {t.whoWeServe.items.map((item, index) => {
              const Icon = iconMap[item.icon];
              return (
                <motion.div
                  key={index}
                  variants={animationVariants.fadeInUp}
                  transition={{ ...transitions.normal, delay: index * 0.1 }}
                  className={`p-6 rounded-2xl text-center ${
                    isGlass 
                      ? 'bg-gradient-to-br from-white/10 to-white/5 border border-white/10' 
                      : 'bg-white border border-gray-200 shadow-lg'
                  }`}
                >
                  <div 
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
                    style={{ background: brand.gradient }}
                  >
                    {Icon && <Icon className="w-7 h-7 text-white" />}
                  </div>
                  <h3 className={`text-lg font-bold mb-2 ${isGlass ? 'text-white' : 'text-gray-900'}`}>
                    {item.title}
                  </h3>
                  <p className={`text-sm ${isGlass ? 'text-gray-400' : 'text-gray-600'}`}>
                    {item.desc}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Consulting Packages Section */}
      <section className={`py-12 sm:py-20 ${isGlass ? 'bg-slate-900/50' : 'bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={animationVariants.fadeInUp}
            className="text-center mb-12"
          >
            <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${isGlass ? 'text-white' : 'text-gray-900'}`}>
              {t.consulting.title}
            </h2>
            <p className={`text-lg max-w-2xl mx-auto ${isGlass ? 'text-gray-400' : 'text-gray-600'}`}>
              {t.consulting.subtitle}
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={animationVariants.staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {t.consulting.items.map((item, index) => (
              <motion.div
                key={index}
                variants={animationVariants.fadeInUp}
                transition={{ ...transitions.normal, delay: index * 0.1 }}
                className={`p-8 rounded-3xl ${
                  isGlass 
                    ? 'bg-gradient-to-br from-white/10 to-white/5 border border-white/10' 
                    : 'bg-white border border-gray-200 shadow-lg'
                }`}
              >
                <h3 className={`text-xl font-bold mb-2 ${isGlass ? 'text-white' : 'text-gray-900'}`}>
                  {item.title}
                </h3>
                <p className="text-2xl font-bold mb-6" style={{ color: brand.primary }}>
                  {item.price}
                </p>
                <ul className="space-y-3 mb-6">
                  {item.features.map((feature, fIndex) => (
                    <li key={fIndex} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 flex-shrink-0" style={{ color: brand.primary }} />
                      <span className={`text-sm ${isGlass ? 'text-gray-300' : 'text-gray-700'}`}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={animationVariants.fadeInUp}
            className="text-center mt-10"
          >
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-white font-medium transition-all hover:scale-105"
              style={{ background: brand.gradient }}
            >
              <Phone className="w-5 h-5" />
              {t.consulting.cta}
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-12 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={animationVariants.fadeInUp}
            className="text-center mb-12"
          >
            <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${isGlass ? 'text-white' : 'text-gray-900'}`}>
              {t.process.title}
            </h2>
            <p className={`text-lg max-w-2xl mx-auto ${isGlass ? 'text-gray-400' : 'text-gray-600'}`}>
              {t.process.subtitle}
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={animationVariants.staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-8"
          >
            {t.process.steps.map((step, index) => (
              <motion.div
                key={index}
                variants={animationVariants.fadeInUp}
                transition={{ ...transitions.normal, delay: index * 0.1 }}
                className="relative"
              >
                {/* Connector line */}
                {index < t.process.steps.length - 1 && (
                  <div className={`hidden md:block absolute top-8 left-[60%] w-full h-0.5 ${
                    isGlass ? 'bg-white/10' : 'bg-gray-200'
                  }`} />
                )}
                
                <div className={`relative p-6 rounded-2xl ${
                  isGlass 
                    ? 'bg-white/5 border border-white/10' 
                    : 'bg-white border border-gray-200 shadow-sm'
                }`}>
                  <div 
                    className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
                    style={{ background: `${brand.primary}20` }}
                  >
                    <span className="text-2xl font-bold" style={{ color: brand.primary }}>
                      {step.number}
                    </span>
                  </div>
                  <h3 className={`text-lg font-semibold mb-2 ${isGlass ? 'text-white' : 'text-gray-900'}`}>
                    {step.title}
                  </h3>
                  <p className={`text-sm ${isGlass ? 'text-gray-400' : 'text-gray-600'}`}>
                    {step.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section className={`py-12 sm:py-20 ${isGlass ? 'bg-slate-900/50' : 'bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={animationVariants.fadeInUp}
            className="text-center mb-12"
          >
            <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${isGlass ? 'text-white' : 'text-gray-900'}`}>
              {t.portfolio.title}
            </h2>
            <p className={`text-lg max-w-2xl mx-auto ${isGlass ? 'text-gray-400' : 'text-gray-600'}`}>
              {t.portfolio.subtitle}
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={animationVariants.staggerContainer}
            className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
          >
            {t.portfolio.items.map((item, index) => (
              <motion.div
                key={index}
                variants={animationVariants.fadeInUp}
                transition={{ ...transitions.normal, delay: index * 0.1 }}
                className={`group relative aspect-square rounded-2xl overflow-hidden cursor-pointer ${
                  isGlass 
                    ? 'bg-white/5 border border-white/10' 
                    : 'bg-white border border-gray-200 shadow-sm'
                }`}
              >
                {/* Placeholder image */}
                <div 
                  className="absolute inset-0 opacity-30 group-hover:opacity-50 transition-opacity"
                  style={{ background: brand.gradient }}
                />
                
                {/* Content overlay */}
                <div className="absolute inset-0 flex flex-col justify-end p-6">
                  <span 
                    className="text-xs font-medium px-2 py-1 rounded-full w-fit mb-2"
                    style={{ 
                      background: `${brand.primary}30`,
                      color: brand.primary 
                    }}
                  >
                    {item.type}
                  </span>
                  <h3 className={`font-semibold mb-1 ${isGlass ? 'text-white' : 'text-gray-900'}`}>
                    {item.title}
                  </h3>
                  <p className={`text-sm ${isGlass ? 'text-gray-400' : 'text-gray-500'}`}>
                    {item.client}
                  </p>
                  <p className="text-xs mt-1 italic" style={{ color: isGlass ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)' }}>
                    (Illustrative)
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-12 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={animationVariants.fadeInUp}
            className="text-center mb-12"
          >
            <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${isGlass ? 'text-white' : 'text-gray-900'}`}>
              {t.testimonials.title}
            </h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={animationVariants.staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8 max-w-4xl mx-auto"
          >
            {t.testimonials.items.map((item, index) => (
              <motion.div
                key={index}
                variants={animationVariants.fadeInUp}
                transition={{ ...transitions.normal, delay: index * 0.1 }}
                className={`p-6 rounded-2xl ${
                  isGlass 
                    ? 'bg-white/5 border border-white/10' 
                    : 'bg-white border border-gray-200 shadow-sm'
                }`}
              >
                <div 
                  className="text-4xl mb-4"
                  style={{ color: brand.primary }}
                >
                  "
                </div>
                <p className={`mb-6 italic ${isGlass ? 'text-gray-300' : 'text-gray-700'}`}>
                  {item.quote}
                </p>
                <div>
                  <p className={`font-semibold ${isGlass ? 'text-white' : 'text-gray-900'}`}>
                    {item.name}
                  </p>
                  <p className={`text-sm ${isGlass ? 'text-gray-500' : 'text-gray-500'}`}>
                    {item.org}
                  </p>
                  <p className="text-xs mt-1 italic" style={{ color: isGlass ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)' }}>
                    (Illustrative)
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className={`py-20 ${isGlass ? 'bg-slate-900/50' : 'bg-gray-50'}`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={animationVariants.fadeInUp}
          >
            <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${isGlass ? 'text-white' : 'text-gray-900'}`}>
              {t.cta.title}
            </h2>
            <p className={`text-lg mb-8 ${isGlass ? 'text-gray-400' : 'text-gray-600'}`}>
              {t.cta.subtitle}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-medium text-white transition-all hover:scale-105"
                style={{ background: brand.gradient }}
              >
                {t.cta.button1}
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/contact"
                className={`inline-flex items-center gap-2 px-8 py-4 rounded-full font-medium transition-all hover:scale-105 ${
                  isGlass 
                    ? 'bg-white/10 text-white border border-white/20 hover:bg-white/20' 
                    : 'bg-white text-gray-900 border border-gray-200 hover:bg-gray-100'
                }`}
              >
                {t.cta.button2}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <EcosystemFooter lang={lang} theme={theme} activeBrand="barholexMedia" />
    </div>
  );
}
