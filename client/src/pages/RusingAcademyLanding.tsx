import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import SEO from '@/components/SEO';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Users, 
  Award, 
  Clock, 
  CheckCircle, 
  ArrowRight, 
  Play,
  Headphones,
  Video,
  MessageSquare,
  Target,
  TrendingUp,
  Globe,
  Sun,
  Moon,
  ChevronRight
} from 'lucide-react';
import { brandColors, animationVariants, transitions } from '../lib/ecosystem-design-system';
import { EcosystemFooter } from '../components/EcosystemFooter';

const labels = {
  en: {
    nav: {
      explore: 'Explore',
      programs: 'Programs',
      contact: 'Contact',
      ecosystem: 'Ecosystem',
    },
    hero: {
      badge: 'Path Series™ Curriculum',
      title: 'Accelerate Your Team\'s',
      titleHighlight: 'Bilingual Excellence',
      subtitle: 'A structured curriculum built for Canadian public service realities—Path Series™ programs aligned with SLE outcomes. Achieve BBB, CBC, or CCC goals faster.',
      cta1: 'Explore Programs',
      cta2: 'Book Consultation',
    },
    stats: {
      learners: 'Public Servants Trained',
      faster: 'Faster Results',
      aligned: 'SLE/CEFR Aligned',
      satisfaction: 'Satisfaction Rate',
    },
    pathSeries: {
      title: 'The Path Series™',
      subtitle: 'Six structured learning paths designed for real public service outcomes',
      paths: [
        { name: 'Foundation Path', desc: 'Build core language fundamentals', level: 'A → B' },
        { name: 'Acceleration Path', desc: 'Rapid progress for motivated learners', level: 'B → C' },
        { name: 'Oral Mastery Path', desc: 'Confidence in spoken interactions', level: 'Oral B/C' },
        { name: 'Written Excellence Path', desc: 'Professional written communication', level: 'Written B/C' },
        { name: 'Executive Path', desc: 'Leadership-level bilingual presence', level: 'C+' },
        { name: 'Maintenance Path', desc: 'Sustain and refine your skills', level: 'All levels' },
      ],
    },
    offerings: {
      title: 'Learning Solutions',
      subtitle: 'Flexible formats designed for busy professionals',
      items: [
        {
          icon: 'BookOpen',
          title: 'Crash Courses',
          desc: 'Intensive 2-4 week programs for rapid SLE preparation. Ideal for upcoming exams.',
          features: ['Exam-focused content', 'Daily practice sessions', 'Mock tests included'],
        },
        {
          icon: 'Headphones',
          title: 'Micro-Learning',
          desc: 'Bite-sized capsules, videos, and podcasts. Learn during your commute or lunch break.',
          features: ['5-15 minute lessons', 'Mobile-friendly', 'Podcast episodes'],
        },
        {
          icon: 'MessageSquare',
          title: 'Expert Coaching',
          desc: 'One-on-one sessions with certified SLE coaches. Personalized feedback and guidance.',
          features: ['Certified coaches', 'Flexible scheduling', 'Progress tracking'],
        },
      ],
    },
    testimonials: {
      title: 'Trusted by Public Servants',
      items: [
        {
          quote: 'The Path Series™ helped our entire team achieve their SLE goals ahead of schedule. The structured approach made all the difference.',
          name: 'Director, Policy Branch',
          org: 'Federal Department',
        },
        {
          quote: 'Finally, a curriculum that understands the realities of the public service. Practical, efficient, and results-driven.',
          name: 'HR Manager',
          org: 'Crown Corporation',
        },
        {
          quote: 'Our department saw a 40% improvement in SLE pass rates after implementing RusingAcademy programs.',
          name: 'Learning Coordinator',
          org: 'Central Agency',
        },
      ],
    },
    cta: {
      title: 'Ready to Transform Your Team\'s Language Capabilities?',
      subtitle: 'Get a customized institutional plan tailored to your department\'s needs.',
      button1: 'Request Institutional Plan',
      button2: 'Contact Us',
    },
  },
  fr: {
    nav: {
      explore: 'Explorer',
      programs: 'Programmes',
      contact: 'Contact',
      ecosystem: 'Écosystème',
    },
    hero: {
      badge: 'Curriculum Path Series™',
      title: 'Accélérez l\'excellence',
      titleHighlight: 'bilingue de votre équipe',
      subtitle: 'Un curriculum structuré conçu pour les réalités de la fonction publique canadienne—programmes Path Series™ alignés sur les résultats ELS. Atteignez vos objectifs BBB, CBC ou CCC plus rapidement.',
      cta1: 'Explorer les programmes',
      cta2: 'Réserver une consultation',
    },
    stats: {
      learners: 'Fonctionnaires formés',
      faster: 'Résultats plus rapides',
      aligned: 'Aligné ELS/CECR',
      satisfaction: 'Taux de satisfaction',
    },
    pathSeries: {
      title: 'La série Path™',
      subtitle: 'Six parcours d\'apprentissage structurés conçus pour des résultats concrets',
      paths: [
        { name: 'Parcours Fondation', desc: 'Construire les bases linguistiques', level: 'A → B' },
        { name: 'Parcours Accélération', desc: 'Progrès rapide pour apprenants motivés', level: 'B → C' },
        { name: 'Parcours Maîtrise Orale', desc: 'Confiance dans les interactions orales', level: 'Oral B/C' },
        { name: 'Parcours Excellence Écrite', desc: 'Communication écrite professionnelle', level: 'Écrit B/C' },
        { name: 'Parcours Exécutif', desc: 'Présence bilingue de niveau leadership', level: 'C+' },
        { name: 'Parcours Maintien', desc: 'Maintenir et affiner vos compétences', level: 'Tous niveaux' },
      ],
    },
    offerings: {
      title: 'Solutions d\'apprentissage',
      subtitle: 'Formats flexibles conçus pour les professionnels occupés',
      items: [
        {
          icon: 'BookOpen',
          title: 'Cours intensifs',
          desc: 'Programmes intensifs de 2-4 semaines pour une préparation ELS rapide. Idéal avant les examens.',
          features: ['Contenu axé sur l\'examen', 'Sessions quotidiennes', 'Tests simulés inclus'],
        },
        {
          icon: 'Headphones',
          title: 'Micro-apprentissage',
          desc: 'Capsules, vidéos et podcasts en format court. Apprenez pendant vos déplacements.',
          features: ['Leçons de 5-15 minutes', 'Compatible mobile', 'Épisodes podcast'],
        },
        {
          icon: 'MessageSquare',
          title: 'Coaching expert',
          desc: 'Sessions individuelles avec des coaches ELS certifiés. Rétroaction personnalisée.',
          features: ['Coaches certifiés', 'Horaires flexibles', 'Suivi des progrès'],
        },
      ],
    },
    testimonials: {
      title: 'La confiance des fonctionnaires',
      items: [
        {
          quote: 'La série Path™ a aidé toute notre équipe à atteindre ses objectifs ELS en avance. L\'approche structurée a fait toute la différence.',
          name: 'Directeur, Direction des politiques',
          org: 'Ministère fédéral',
        },
        {
          quote: 'Enfin, un curriculum qui comprend les réalités de la fonction publique. Pratique, efficace et axé sur les résultats.',
          name: 'Gestionnaire RH',
          org: 'Société d\'État',
        },
        {
          quote: 'Notre ministère a vu une amélioration de 40% des taux de réussite ELS après avoir adopté les programmes RusingAcademy.',
          name: 'Coordonnateur de l\'apprentissage',
          org: 'Organisme central',
        },
      ],
    },
    cta: {
      title: 'Prêt à transformer les capacités linguistiques de votre équipe?',
      subtitle: 'Obtenez un plan institutionnel personnalisé adapté aux besoins de votre ministère.',
      button1: 'Demander un plan institutionnel',
      button2: 'Nous contacter',
    },
  },
};

const iconMap: Record<string, React.ElementType> = {
  BookOpen,
  Headphones,
  MessageSquare,
};

export default function RusingAcademyLanding() {
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
  const brand = brandColors.rusingacademy;

  return (
    <div className={`min-h-screen ${isGlass ? 'bg-slate-950 text-white' : 'bg-white text-gray-900'}`}>
      <SEO
        title="RusingAcademy - Path Series™ SLE Training"
        description="Structured SLE curriculum with Path Series™ methodology. B2B/B2G training solutions for federal departments and organizations. Achieve BBB, CBC, or CCC goals."
        canonical="https://www.rusingacademy.ca/rusingacademy"
      />
      {/* Global Header is now rendered by EcosystemLayout wrapper */}

      {/* Hero Section */}
      <section className="relative pt-8 pb-20 overflow-hidden">
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
                  background: isGlass ? 'rgba(249, 115, 22, 0.2)' : 'rgba(249, 115, 22, 0.1)',
                  border: `1px solid ${brand.primary}40`
                }}
              >
                <Award className="w-4 h-4" style={{ color: brand.primary }} />
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
                  href="/curriculum"
                  className="inline-flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-full font-medium text-white transition-all hover:scale-105 text-sm sm:text-base"
                  style={{ background: brand.gradient }}
                >
                  {t.hero.cta1}
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/contact"
                  className={`inline-flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all hover:scale-105 ${
                    isGlass 
                      ? 'bg-white/10 text-white border border-white/20 hover:bg-white/20' 
                      : 'bg-gray-100 text-gray-900 border border-gray-200 hover:bg-gray-200'
                  }`}
                >
                  {t.hero.cta2}
                </Link>
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
                src="/images/ecosystem/rusingacademy-hero.jpg"
                alt="Professional training session"
                className="relative rounded-3xl shadow-2xl w-full object-cover aspect-[4/3]"
                onError={(e) => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&h=600&fit=crop';
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
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold" style={{ color: brand.primary }}>3-4x</p>
                    <p className={`text-xs ${isGlass ? 'text-gray-400' : 'text-gray-500'}`}>
                      {t.stats.faster}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className={`py-10 sm:py-16 ${isGlass ? 'bg-slate-900/50' : 'bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={animationVariants.staggerContainer}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8"
          >
            {[
              { value: '2,500+', label: t.stats.learners, icon: Users },
              { value: '3-4x', label: t.stats.faster, icon: TrendingUp },
              { value: '100%', label: t.stats.aligned, icon: Target },
              { value: '95%', label: t.stats.satisfaction, icon: Award },
            ].map((stat, index) => (
              <motion.div
                key={index}
                variants={animationVariants.fadeInUp}
                transition={{ ...transitions.normal, delay: index * 0.1 }}
                className={`text-center p-6 rounded-2xl ${
                  isGlass 
                    ? 'bg-white/5 border border-white/10' 
                    : 'bg-white border border-gray-200 shadow-sm'
                }`}
              >
                <stat.icon 
                  className="w-8 h-8 mx-auto mb-3" 
                  style={{ color: brand.primary }} 
                />
                <p className="text-3xl font-bold mb-1" style={{ color: brand.primary }}>
                  {stat.value}
                </p>
                <p className={`text-sm ${isGlass ? 'text-gray-400' : 'text-gray-600'}`}>
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Path Series Section */}
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
              {t.pathSeries.title}
            </h2>
            <p className={`text-lg max-w-2xl mx-auto ${isGlass ? 'text-gray-400' : 'text-gray-600'}`}>
              {t.pathSeries.subtitle}
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={animationVariants.staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
          >
            {t.pathSeries.paths.map((path, index) => (
              <motion.div
                key={index}
                variants={animationVariants.fadeInUp}
                transition={{ ...transitions.normal, delay: index * 0.1 }}
                className={`group p-6 rounded-2xl transition-all hover:scale-[1.02] cursor-pointer ${
                  isGlass 
                    ? 'bg-white/5 border border-white/10 hover:border-orange-500/50' 
                    : 'bg-white border border-gray-200 shadow-sm hover:border-orange-500/50 hover:shadow-lg'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ background: `${brand.primary}20` }}
                  >
                    <BookOpen className="w-6 h-6" style={{ color: brand.primary }} />
                  </div>
                  <span 
                    className="px-3 py-1 rounded-full text-xs font-medium"
                    style={{ 
                      background: `${brand.primary}20`,
                      color: brand.primary 
                    }}
                  >
                    {path.level}
                  </span>
                </div>
                <h3 className={`text-lg font-semibold mb-2 ${isGlass ? 'text-white' : 'text-gray-900'}`}>
                  {path.name}
                </h3>
                <p className={`text-sm ${isGlass ? 'text-gray-400' : 'text-gray-600'}`}>
                  {path.desc}
                </p>
                <div className="mt-4 flex items-center gap-2 text-sm font-medium group-hover:gap-3 transition-all" style={{ color: brand.primary }}>
                  {lang === 'en' ? 'Learn more' : 'En savoir plus'}
                  <ChevronRight className="w-4 h-4" />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Offerings Section */}
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
              {t.offerings.title}
            </h2>
            <p className={`text-lg max-w-2xl mx-auto ${isGlass ? 'text-gray-400' : 'text-gray-600'}`}>
              {t.offerings.subtitle}
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={animationVariants.staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-8"
          >
            {t.offerings.items.map((item, index) => {
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
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-8"
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
      <EcosystemFooter lang={lang} theme={theme} activeBrand="rusingacademy" />
    </div>
  );
}
