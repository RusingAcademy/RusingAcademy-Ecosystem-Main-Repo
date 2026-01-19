import { useState } from 'react';
import { Link } from 'wouter';
import SEO from '@/components/SEO';
import { motion } from 'framer-motion';
import { 
  MessageSquare, 
  Users, 
  Award, 
  Clock, 
  CheckCircle, 
  ArrowRight, 
  Play,
  Target,
  TrendingUp,
  Globe,
  Mic,
  PenTool,
  Briefcase,
  Star,
  Shield,
  Zap,
  Calendar,
  Video,
  Headphones,
  Brain,
  Sparkles
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import FooterInstitutional from '@/components/FooterInstitutional';

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
    1: '0 1px 2px rgba(15, 23, 42, 0.06)',
    2: '0 6px 18px rgba(15, 23, 42, 0.10)',
    3: '0 16px 40px rgba(15, 23, 42, 0.14)',
    glass: '0 10px 30px rgba(15, 23, 42, 0.10)'
  }
};

// Lingueefy brand color (teal/violet gradient)
const lingueefyGradient = `linear-gradient(135deg, ${tokens.colors.accent.teal} 0%, ${tokens.colors.accent.violet} 100%)`;

const labels = {
  en: {
    hero: {
      badge: 'Human + AI Coaching',
      title: 'Your Personal Language Coach.',
      titleHighlight: 'Available When You Need Them.',
      subtitle: 'Personalized coaching from certified SLE experts, enhanced by AI-powered practice. Get feedback, build confidence, and achieve your bilingual goals faster.',
      cta1: 'Meet Our Coaches',
      cta2: 'Book Free Session',
    },
    stats: [
      { value: '50+', label: 'Certified Coaches' },
      { value: '24/7', label: 'AI Practice Available' },
      { value: '98%', label: 'Client Satisfaction' },
      { value: '15min', label: 'Avg Response Time' },
    ],
    methodology: {
      title: 'The Lingueefy Method',
      subtitle: 'Our Approach',
      description: 'We combine the irreplaceable value of human expertise with the convenience of AI-powered practice to create a coaching experience that adapts to your life.',
      pillars: [
        { 
          icon: 'Users', 
          title: 'Human Expertise', 
          desc: 'Certified coaches who understand GC language requirements and can provide nuanced feedback on your progress.',
          features: ['SLE-certified coaches', 'Personalized feedback', 'Cultural context']
        },
        { 
          icon: 'Brain', 
          title: 'AI-Enhanced Practice', 
          desc: 'Practice anytime with our AI coaches—available 24/7 for conversation, writing review, and pronunciation feedback.',
          features: ['24/7 availability', 'Instant feedback', 'Unlimited practice']
        },
        { 
          icon: 'Target', 
          title: 'Targeted Progression', 
          desc: 'Every session is designed around your specific goals, whether it\'s an upcoming SLE exam or daily workplace communication.',
          features: ['Goal-oriented sessions', 'Progress tracking', 'Adaptive curriculum']
        },
      ],
    },
    services: {
      title: 'Coaching Services',
      subtitle: 'What We Offer',
      items: [
        {
          icon: 'Mic',
          name: 'Oral Coaching',
          description: 'One-on-one sessions focused on spoken French. Perfect for SLE oral exam preparation and workplace conversations.',
          price: 85,
          duration: '45 min',
          features: ['Live conversation practice', 'Pronunciation correction', 'SLE oral strategies', 'Recording & review'],
        },
        {
          icon: 'PenTool',
          name: 'Written Coaching',
          description: 'Detailed feedback on your written French. Ideal for briefing notes, emails, and SLE written exam preparation.',
          price: 75,
          duration: '45 min',
          features: ['Document review', 'Grammar correction', 'Style improvement', 'SLE written strategies'],
        },
        {
          icon: 'Video',
          name: 'Mock Exam Sessions',
          description: 'Simulated SLE exam conditions with immediate feedback. Build confidence before your real test.',
          price: 95,
          duration: '60 min',
          features: ['Realistic simulation', 'Timed conditions', 'Detailed feedback', 'Score prediction'],
        },
        {
          icon: 'Briefcase',
          name: 'Executive Coaching',
          description: 'Premium coaching for senior leaders. Focus on nuanced expression and leadership communication.',
          price: 125,
          duration: '60 min',
          features: ['Executive scenarios', 'Briefing practice', 'Media training', 'VIP scheduling'],
        },
      ],
    },
    packages: {
      title: 'Coaching Packages',
      subtitle: 'Les Forfaits',
      items: [
        {
          name: 'Starter',
          sessions: 4,
          price: 299,
          perSession: 75,
          description: 'Perfect for trying coaching or addressing specific challenges.',
          features: ['4 coaching sessions', 'Session recordings', 'Progress notes', 'Email support'],
        },
        {
          name: 'Accelerator',
          sessions: 8,
          price: 549,
          perSession: 69,
          popular: true,
          description: 'Our most popular package for serious SLE preparation.',
          features: ['8 coaching sessions', '2 mock exams', 'AI practice access', 'Priority booking', 'Progress reports'],
        },
        {
          name: 'Intensive',
          sessions: 16,
          price: 999,
          perSession: 62,
          description: 'Comprehensive preparation for ambitious goals.',
          features: ['16 coaching sessions', '4 mock exams', 'Unlimited AI practice', 'VIP support', 'Guaranteed results*'],
        },
      ],
    },
    coaches: {
      title: 'Meet Your Coaches',
      subtitle: 'Our Team',
      description: 'Our coaches are certified language professionals with deep experience in the Canadian public service context.',
      featured: [
        {
          name: 'Steven Barholec',
          role: 'Founder & Lead Coach',
          specialty: 'Executive Coaching, SLE C-Level',
          bio: 'Former federal public servant with 15+ years of experience in bilingual leadership development.',
          image: '/coaches/steven.jpg',
        },
        {
          name: 'Sue-Anne Bhérer',
          role: 'Senior Coach',
          specialty: 'Oral Expression, Pronunciation',
          bio: 'Certified SLE examiner with expertise in helping learners overcome oral communication barriers.',
          image: '/coaches/sue-anne.jpg',
        },
        {
          name: 'Erika Dumont',
          role: 'Senior Coach',
          specialty: 'Written Expression, Grammar',
          bio: 'Professional editor and language coach specializing in government writing standards.',
          image: '/coaches/erika.jpg',
        },
      ],
    },
    ai: {
      title: 'AI-Powered Practice',
      subtitle: 'Practice Anytime',
      description: 'Between coaching sessions, practice with our AI coaches. They\'re available 24/7 and trained on GC-specific scenarios.',
      features: [
        { icon: 'MessageSquare', title: 'Conversation Practice', desc: 'Natural dialogue practice with instant feedback' },
        { icon: 'PenTool', title: 'Writing Review', desc: 'Submit texts and get detailed corrections' },
        { icon: 'Mic', title: 'Pronunciation Feedback', desc: 'Record yourself and get AI analysis' },
        { icon: 'Target', title: 'Scenario Simulations', desc: 'Practice real GC workplace situations' },
      ],
    },
    proof: {
      title: 'Success Stories',
      subtitle: 'Client Results',
      testimonials: [
        {
          quote: 'My coach understood exactly what I needed for my SLE. The combination of human coaching and AI practice was perfect for my schedule.',
          name: 'Policy Analyst',
          org: 'ESDC',
          result: 'Achieved CBC in 8 weeks',
        },
        {
          quote: 'The executive coaching helped me communicate with confidence at the DM level. Worth every penny.',
          name: 'Director General',
          org: 'PCO',
          result: 'Promoted to bilingual EX position',
        },
        {
          quote: 'I was terrified of the oral exam. After 8 sessions, I felt completely prepared and passed with flying colors.',
          name: 'Program Officer',
          org: 'IRCC',
          result: 'Passed SLE oral on first attempt',
        },
      ],
    },
    cta: {
      title: 'Ready to Start Your Coaching Journey?',
      subtitle: 'Book a free 15-minute consultation to discuss your goals and find the right coach for you.',
      button1: 'Book Free Consultation',
      button2: 'View All Coaches',
    },
  },
  fr: {
    hero: {
      badge: 'Coaching Humain + IA',
      title: 'Votre Coach Linguistique Personnel.',
      titleHighlight: 'Disponible Quand Vous en Avez Besoin.',
      subtitle: 'Coaching personnalisé par des experts ELS certifiés, enrichi par la pratique assistée par IA. Obtenez des rétroactions, gagnez en confiance et atteignez vos objectifs bilingues plus rapidement.',
      cta1: 'Rencontrer nos coachs',
      cta2: 'Réserver une session gratuite',
    },
    stats: [
      { value: '50+', label: 'Coachs certifiés' },
      { value: '24/7', label: 'Pratique IA disponible' },
      { value: '98%', label: 'Satisfaction client' },
      { value: '15min', label: 'Temps de réponse moyen' },
    ],
    methodology: {
      title: 'La Méthode Lingueefy',
      subtitle: 'Notre Approche',
      description: 'Nous combinons la valeur irremplaçable de l\'expertise humaine avec la commodité de la pratique assistée par IA pour créer une expérience de coaching qui s\'adapte à votre vie.',
      pillars: [
        { 
          icon: 'Users', 
          title: 'Expertise Humaine', 
          desc: 'Des coachs certifiés qui comprennent les exigences linguistiques du GC et peuvent fournir des rétroactions nuancées.',
          features: ['Coachs certifiés ELS', 'Rétroaction personnalisée', 'Contexte culturel']
        },
        { 
          icon: 'Brain', 
          title: 'Pratique Assistée par IA', 
          desc: 'Pratiquez à tout moment avec nos coachs IA—disponibles 24/7 pour la conversation, la révision écrite et la prononciation.',
          features: ['Disponibilité 24/7', 'Rétroaction instantanée', 'Pratique illimitée']
        },
        { 
          icon: 'Target', 
          title: 'Progression Ciblée', 
          desc: 'Chaque session est conçue autour de vos objectifs spécifiques, qu\'il s\'agisse d\'un examen ELS ou de la communication quotidienne.',
          features: ['Sessions orientées objectifs', 'Suivi des progrès', 'Curriculum adaptatif']
        },
      ],
    },
    services: {
      title: 'Services de Coaching',
      subtitle: 'Ce Que Nous Offrons',
      items: [
        {
          icon: 'Mic',
          name: 'Coaching Oral',
          description: 'Sessions individuelles axées sur le français parlé. Parfait pour la préparation à l\'examen oral ELS.',
          price: 85,
          duration: '45 min',
          features: ['Pratique de conversation', 'Correction de prononciation', 'Stratégies oral ELS', 'Enregistrement & révision'],
        },
        {
          icon: 'PenTool',
          name: 'Coaching Écrit',
          description: 'Rétroaction détaillée sur votre français écrit. Idéal pour les notes de breffage et l\'examen écrit ELS.',
          price: 75,
          duration: '45 min',
          features: ['Révision de documents', 'Correction grammaticale', 'Amélioration du style', 'Stratégies écrit ELS'],
        },
        {
          icon: 'Video',
          name: 'Sessions Examen Simulé',
          description: 'Conditions d\'examen ELS simulées avec rétroaction immédiate. Gagnez en confiance avant le vrai test.',
          price: 95,
          duration: '60 min',
          features: ['Simulation réaliste', 'Conditions chronométrées', 'Rétroaction détaillée', 'Prédiction de score'],
        },
        {
          icon: 'Briefcase',
          name: 'Coaching Exécutif',
          description: 'Coaching premium pour cadres supérieurs. Focus sur l\'expression nuancée et la communication de leadership.',
          price: 125,
          duration: '60 min',
          features: ['Scénarios exécutifs', 'Pratique de breffage', 'Formation médias', 'Horaires VIP'],
        },
      ],
    },
    packages: {
      title: 'Forfaits de Coaching',
      subtitle: 'Les Forfaits',
      items: [
        {
          name: 'Débutant',
          sessions: 4,
          price: 299,
          perSession: 75,
          description: 'Parfait pour essayer le coaching ou aborder des défis spécifiques.',
          features: ['4 sessions de coaching', 'Enregistrements des sessions', 'Notes de progrès', 'Support par courriel'],
        },
        {
          name: 'Accélérateur',
          sessions: 8,
          price: 549,
          perSession: 69,
          popular: true,
          description: 'Notre forfait le plus populaire pour une préparation ELS sérieuse.',
          features: ['8 sessions de coaching', '2 examens simulés', 'Accès pratique IA', 'Réservation prioritaire', 'Rapports de progrès'],
        },
        {
          name: 'Intensif',
          sessions: 16,
          price: 999,
          perSession: 62,
          description: 'Préparation complète pour des objectifs ambitieux.',
          features: ['16 sessions de coaching', '4 examens simulés', 'Pratique IA illimitée', 'Support VIP', 'Résultats garantis*'],
        },
      ],
    },
    coaches: {
      title: 'Rencontrez Vos Coachs',
      subtitle: 'Notre Équipe',
      description: 'Nos coachs sont des professionnels linguistiques certifiés avec une expérience approfondie du contexte de la fonction publique canadienne.',
      featured: [
        {
          name: 'Steven Barholec',
          role: 'Fondateur & Coach Principal',
          specialty: 'Coaching Exécutif, Niveau C ELS',
          bio: 'Ancien fonctionnaire fédéral avec 15+ ans d\'expérience en développement du leadership bilingue.',
          image: '/coaches/steven.jpg',
        },
        {
          name: 'Sue-Anne Bhérer',
          role: 'Coach Senior',
          specialty: 'Expression Orale, Prononciation',
          bio: 'Examinatrice ELS certifiée avec expertise pour aider les apprenants à surmonter les barrières de communication orale.',
          image: '/coaches/sue-anne.jpg',
        },
        {
          name: 'Erika Dumont',
          role: 'Coach Senior',
          specialty: 'Expression Écrite, Grammaire',
          bio: 'Éditrice professionnelle et coach linguistique spécialisée dans les normes de rédaction gouvernementale.',
          image: '/coaches/erika.jpg',
        },
      ],
    },
    ai: {
      title: 'Pratique Assistée par IA',
      subtitle: 'Pratiquez à Tout Moment',
      description: 'Entre les sessions de coaching, pratiquez avec nos coachs IA. Ils sont disponibles 24/7 et formés sur des scénarios spécifiques au GC.',
      features: [
        { icon: 'MessageSquare', title: 'Pratique de Conversation', desc: 'Dialogue naturel avec rétroaction instantanée' },
        { icon: 'PenTool', title: 'Révision Écrite', desc: 'Soumettez des textes et obtenez des corrections détaillées' },
        { icon: 'Mic', title: 'Rétroaction Prononciation', desc: 'Enregistrez-vous et obtenez une analyse IA' },
        { icon: 'Target', title: 'Simulations de Scénarios', desc: 'Pratiquez des situations réelles de travail au GC' },
      ],
    },
    proof: {
      title: 'Histoires de Réussite',
      subtitle: 'Résultats Clients',
      testimonials: [
        {
          quote: 'Mon coach a compris exactement ce dont j\'avais besoin pour mon ELS. La combinaison coaching humain et pratique IA était parfaite pour mon horaire.',
          name: 'Analyste de politiques',
          org: 'EDSC',
          result: 'CBC atteint en 8 semaines',
        },
        {
          quote: 'Le coaching exécutif m\'a aidé à communiquer avec confiance au niveau SM. Chaque dollar en valait la peine.',
          name: 'Directeur général',
          org: 'BCP',
          result: 'Promu à un poste EX bilingue',
        },
        {
          quote: 'J\'étais terrifiée par l\'examen oral. Après 8 sessions, je me sentais complètement préparée et j\'ai réussi haut la main.',
          name: 'Agente de programme',
          org: 'IRCC',
          result: 'Réussi l\'oral ELS au premier essai',
        },
      ],
    },
    cta: {
      title: 'Prêt à Commencer Votre Parcours de Coaching?',
      subtitle: 'Réservez une consultation gratuite de 15 minutes pour discuter de vos objectifs et trouver le bon coach pour vous.',
      button1: 'Réserver une consultation gratuite',
      button2: 'Voir tous les coachs',
    },
  },
};

const iconMap: Record<string, React.ElementType> = {
  Users,
  Brain,
  Target,
  Mic,
  PenTool,
  Video,
  Briefcase,
  MessageSquare,
};

export default function LingueefyPillar() {
  const { language } = useLanguage();
  const [selectedService, setSelectedService] = useState<number | null>(null);
  
  const t = labels[language as 'en' | 'fr'] || labels.en;

  return (
    <div className="min-h-screen" style={{ backgroundColor: tokens.colors.bg.canvas }}>
      <SEO
        title={language === 'fr'
          ? 'Lingueefy - Coaching Linguistique Humain + IA pour Fonctionnaires'
          : 'Lingueefy - Human + AI Language Coaching for Public Servants'
        }
        description={language === 'fr'
          ? 'Coaching personnalisé par des experts ELS certifiés, enrichi par la pratique assistée par IA. Atteignez vos objectifs bilingues plus rapidement.'
          : 'Personalized coaching from certified SLE experts, enhanced by AI-powered practice. Achieve your bilingual goals faster.'
        }
      />

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 overflow-hidden">
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            background: `radial-gradient(ellipse at top right, ${tokens.colors.accent.violet} 0%, transparent 50%)`,
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
                background: lingueefyGradient,
                color: tokens.colors.text.onDark 
              }}
            >
              <Sparkles className="w-4 h-4" />
              {t.hero.badge}
            </span>
            
            <h1 
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
              style={{ color: tokens.colors.text.primary }}
            >
              {t.hero.title}{' '}
              <span 
                className="bg-clip-text text-transparent"
                style={{ backgroundImage: lingueefyGradient }}
              >
                {t.hero.titleHighlight}
              </span>
            </h1>
            
            <p 
              className="text-lg md:text-xl mb-8 max-w-3xl mx-auto"
              style={{ color: tokens.colors.text.secondary }}
            >
              {t.hero.subtitle}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/coaches">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-8 py-4 rounded-full font-semibold text-white flex items-center justify-center gap-2"
                  style={{ background: lingueefyGradient }}
                >
                  {t.hero.cta1}
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </Link>
              <Link href="/diagnostic">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-8 py-4 rounded-full font-semibold flex items-center justify-center gap-2"
                  style={{ 
                    backgroundColor: tokens.colors.accent.orangeCTA,
                    color: tokens.colors.text.onDark
                  }}
                >
                  {t.hero.cta2}
                </motion.button>
              </Link>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16"
          >
            {t.stats.map((stat, index) => (
              <div 
                key={index}
                className="text-center p-6 rounded-2xl"
                style={{ 
                  backgroundColor: tokens.colors.glass.bg,
                  backdropFilter: 'blur(12px)',
                  border: `1px solid ${tokens.colors.border.subtle}`
                }}
              >
                <div 
                  className="text-3xl md:text-4xl font-bold mb-2 bg-clip-text text-transparent"
                  style={{ backgroundImage: lingueefyGradient }}
                >
                  {stat.value}
                </div>
                <div 
                  className="text-sm"
                  style={{ color: tokens.colors.text.secondary }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Methodology Section */}
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
              style={{ color: tokens.colors.accent.violet }}
            >
              {t.methodology.subtitle}
            </span>
            <h2 
              className="text-3xl md:text-4xl font-bold mb-4"
              style={{ color: tokens.colors.text.primary }}
            >
              {t.methodology.title}
            </h2>
            <p 
              className="text-lg max-w-3xl mx-auto"
              style={{ color: tokens.colors.text.secondary }}
            >
              {t.methodology.description}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {t.methodology.pillars.map((pillar, index) => {
              const Icon = iconMap[pillar.icon] || Users;
              return (
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
                  <div 
                    className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
                    style={{ background: `${tokens.colors.accent.violet}15` }}
                  >
                    <Icon className="w-8 h-8" style={{ color: tokens.colors.accent.violet }} />
                  </div>
                  <h3 
                    className="text-xl font-bold mb-3"
                    style={{ color: tokens.colors.text.primary }}
                  >
                    {pillar.title}
                  </h3>
                  <p 
                    className="mb-4"
                    style={{ color: tokens.colors.text.secondary }}
                  >
                    {pillar.desc}
                  </p>
                  <ul className="space-y-2">
                    {pillar.features.map((feature, i) => (
                      <li 
                        key={i}
                        className="flex items-center gap-2 text-sm"
                        style={{ color: tokens.colors.text.muted }}
                      >
                        <CheckCircle className="w-4 h-4" style={{ color: tokens.colors.accent.teal }} />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Services Section */}
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
              style={{ color: tokens.colors.accent.violet }}
            >
              {t.services.subtitle}
            </span>
            <h2 
              className="text-3xl md:text-4xl font-bold"
              style={{ color: tokens.colors.text.primary }}
            >
              {t.services.title}
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {t.services.items.map((service, index) => {
              const Icon = iconMap[service.icon] || MessageSquare;
              const isSelected = selectedService === index;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="rounded-3xl overflow-hidden cursor-pointer transition-all duration-300"
                  style={{ 
                    backgroundColor: tokens.colors.bg.surface,
                    border: `2px solid ${isSelected ? tokens.colors.accent.violet : tokens.colors.border.subtle}`,
                    boxShadow: isSelected ? tokens.shadow[3] : tokens.shadow[2]
                  }}
                  onClick={() => setSelectedService(isSelected ? null : index)}
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div 
                        className="w-14 h-14 rounded-2xl flex items-center justify-center"
                        style={{ background: lingueefyGradient }}
                      >
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                      <div className="text-right">
                        <div 
                          className="text-2xl font-bold"
                          style={{ color: tokens.colors.accent.violet }}
                        >
                          ${service.price}
                        </div>
                        <div 
                          className="text-sm"
                          style={{ color: tokens.colors.text.muted }}
                        >
                          {service.duration}
                        </div>
                      </div>
                    </div>
                    
                    <h3 
                      className="text-xl font-bold mb-2"
                      style={{ color: tokens.colors.text.primary }}
                    >
                      {service.name}
                    </h3>
                    <p 
                      className="text-sm mb-4"
                      style={{ color: tokens.colors.text.secondary }}
                    >
                      {service.description}
                    </p>
                    
                    {isSelected && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="pt-4 border-t"
                        style={{ borderColor: tokens.colors.border.subtle }}
                      >
                        <ul className="grid grid-cols-2 gap-2">
                          {service.features.map((feature, i) => (
                            <li 
                              key={i}
                              className="flex items-center gap-2 text-sm"
                              style={{ color: tokens.colors.text.secondary }}
                            >
                              <CheckCircle className="w-4 h-4" style={{ color: tokens.colors.accent.teal }} />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    )}
                    
                    <Link href="/booking">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full mt-4 py-3 rounded-full font-semibold flex items-center justify-center gap-2 text-white"
                        style={{ background: lingueefyGradient }}
                      >
                        {language === 'fr' ? 'Réserver' : 'Book Now'}
                        <Calendar className="w-4 h-4" />
                      </motion.button>
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Packages Section */}
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
              style={{ color: tokens.colors.accent.violet }}
            >
              {t.packages.subtitle}
            </span>
            <h2 
              className="text-3xl md:text-4xl font-bold"
              style={{ color: tokens.colors.text.primary }}
            >
              {t.packages.title}
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {t.packages.items.map((pkg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`relative rounded-3xl p-8 ${pkg.popular ? 'ring-2' : ''}`}
                style={{ 
                  backgroundColor: tokens.colors.bg.canvas,
                  border: `1px solid ${tokens.colors.border.subtle}`,
                  boxShadow: tokens.shadow[2],
                  ringColor: pkg.popular ? tokens.colors.accent.orangeCTA : undefined
                }}
              >
                {pkg.popular && (
                  <div 
                    className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-sm font-semibold"
                    style={{ 
                      backgroundColor: tokens.colors.accent.orangeCTA,
                      color: tokens.colors.text.onDark
                    }}
                  >
                    {language === 'fr' ? 'Plus populaire' : 'Most Popular'}
                  </div>
                )}
                
                <h3 
                  className="text-xl font-bold mb-2"
                  style={{ color: tokens.colors.text.primary }}
                >
                  {pkg.name}
                </h3>
                <p 
                  className="text-sm mb-4"
                  style={{ color: tokens.colors.accent.violet }}
                >
                  {pkg.sessions} {language === 'fr' ? 'sessions' : 'sessions'}
                </p>
                <p 
                  className="text-sm mb-6"
                  style={{ color: tokens.colors.text.secondary }}
                >
                  {pkg.description}
                </p>
                
                <div className="mb-6">
                  <span 
                    className="text-4xl font-bold bg-clip-text text-transparent"
                    style={{ backgroundImage: lingueefyGradient }}
                  >
                    ${pkg.price}
                  </span>
                  <span 
                    className="text-sm ml-2"
                    style={{ color: tokens.colors.text.muted }}
                  >
                    (${pkg.perSession}/{language === 'fr' ? 'session' : 'session'})
                  </span>
                </div>
                
                <ul className="space-y-3 mb-8">
                  {pkg.features.map((feature, i) => (
                    <li 
                      key={i}
                      className="flex items-center gap-2 text-sm"
                      style={{ color: tokens.colors.text.secondary }}
                    >
                      <CheckCircle 
                        className="w-5 h-5" 
                        style={{ color: tokens.colors.accent.teal }} 
                      />
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3 rounded-full font-semibold text-white"
                  style={{ 
                    background: pkg.popular ? tokens.colors.accent.orangeCTA : lingueefyGradient
                  }}
                >
                  {language === 'fr' ? 'Choisir ce forfait' : 'Choose This Package'}
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Practice Section */}
      <section className="py-20" style={{ backgroundColor: tokens.colors.bg.canvas }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span 
                className="text-sm font-semibold uppercase tracking-wider mb-4 block"
                style={{ color: tokens.colors.accent.violet }}
              >
                {t.ai.subtitle}
              </span>
              <h2 
                className="text-3xl md:text-4xl font-bold mb-4"
                style={{ color: tokens.colors.text.primary }}
              >
                {t.ai.title}
              </h2>
              <p 
                className="text-lg mb-8"
                style={{ color: tokens.colors.text.secondary }}
              >
                {t.ai.description}
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {t.ai.features.map((feature, index) => {
                  const Icon = iconMap[feature.icon] || MessageSquare;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 rounded-2xl"
                      style={{ 
                        backgroundColor: tokens.colors.bg.surface,
                        border: `1px solid ${tokens.colors.border.subtle}`
                      }}
                    >
                      <Icon 
                        className="w-6 h-6 mb-2" 
                        style={{ color: tokens.colors.accent.violet }} 
                      />
                      <h4 
                        className="font-semibold mb-1"
                        style={{ color: tokens.colors.text.primary }}
                      >
                        {feature.title}
                      </h4>
                      <p 
                        className="text-sm"
                        style={{ color: tokens.colors.text.muted }}
                      >
                        {feature.desc}
                      </p>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div 
                className="rounded-3xl p-8 relative overflow-hidden"
                style={{ 
                  background: lingueefyGradient,
                  boxShadow: tokens.shadow[3]
                }}
              >
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-10 right-10 w-32 h-32 rounded-full bg-white" />
                  <div className="absolute bottom-10 left-10 w-24 h-24 rounded-full bg-white" />
                </div>
                <div className="relative text-white text-center py-12">
                  <Brain className="w-16 h-16 mx-auto mb-6 opacity-90" />
                  <h3 className="text-2xl font-bold mb-2">
                    {language === 'fr' ? 'Coach IA Disponible 24/7' : 'AI Coach Available 24/7'}
                  </h3>
                  <p className="opacity-90 mb-6">
                    {language === 'fr' 
                      ? 'Pratiquez votre français à tout moment avec notre coach IA intelligent.'
                      : 'Practice your French anytime with our intelligent AI coach.'
                    }
                  </p>
                  <Link href="/ai-coach">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-6 py-3 rounded-full font-semibold"
                      style={{ 
                        backgroundColor: 'rgba(255,255,255,0.2)',
                        color: tokens.colors.text.onDark,
                        border: '1px solid rgba(255,255,255,0.3)'
                      }}
                    >
                      {language === 'fr' ? 'Essayer maintenant' : 'Try Now'}
                    </motion.button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Coaches Section */}
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
              style={{ color: tokens.colors.accent.violet }}
            >
              {t.coaches.subtitle}
            </span>
            <h2 
              className="text-3xl md:text-4xl font-bold mb-4"
              style={{ color: tokens.colors.text.primary }}
            >
              {t.coaches.title}
            </h2>
            <p 
              className="text-lg max-w-3xl mx-auto"
              style={{ color: tokens.colors.text.secondary }}
            >
              {t.coaches.description}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {t.coaches.featured.map((coach, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="rounded-3xl overflow-hidden"
                style={{ 
                  backgroundColor: tokens.colors.bg.canvas,
                  border: `1px solid ${tokens.colors.border.subtle}`,
                  boxShadow: tokens.shadow[2]
                }}
              >
                <div 
                  className="h-48 flex items-center justify-center"
                  style={{ background: `${tokens.colors.accent.violet}15` }}
                >
                  <Users className="w-20 h-20" style={{ color: tokens.colors.accent.violet }} />
                </div>
                <div className="p-6">
                  <h3 
                    className="text-xl font-bold mb-1"
                    style={{ color: tokens.colors.text.primary }}
                  >
                    {coach.name}
                  </h3>
                  <p 
                    className="text-sm font-semibold mb-2"
                    style={{ color: tokens.colors.accent.violet }}
                  >
                    {coach.role}
                  </p>
                  <p 
                    className="text-sm mb-3"
                    style={{ color: tokens.colors.accent.teal }}
                  >
                    {coach.specialty}
                  </p>
                  <p 
                    className="text-sm"
                    style={{ color: tokens.colors.text.secondary }}
                  >
                    {coach.bio}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <Link href="/coaches">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-4 rounded-full font-semibold flex items-center justify-center gap-2 mx-auto"
                style={{ 
                  backgroundColor: tokens.colors.bg.surface,
                  color: tokens.colors.accent.violet,
                  border: `2px solid ${tokens.colors.accent.violet}`
                }}
              >
                {language === 'fr' ? 'Voir tous les coachs' : 'View All Coaches'}
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </Link>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
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
              style={{ color: tokens.colors.accent.violet }}
            >
              {t.proof.subtitle}
            </span>
            <h2 
              className="text-3xl md:text-4xl font-bold"
              style={{ color: tokens.colors.text.primary }}
            >
              {t.proof.title}
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {t.proof.testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-8 rounded-3xl"
                style={{ 
                  backgroundColor: tokens.colors.bg.surface,
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
                      {testimonial.org}
                    </div>
                  </div>
                  <div 
                    className="px-3 py-1 rounded-full text-xs font-semibold"
                    style={{ 
                      backgroundColor: `${tokens.colors.accent.violet}15`,
                      color: tokens.colors.accent.violet
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

      {/* Final CTA Section */}
      <section 
        className="py-20"
        style={{ background: lingueefyGradient }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
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
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/diagnostic">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-8 py-4 rounded-full font-semibold flex items-center justify-center gap-2"
                  style={{ 
                    backgroundColor: tokens.colors.accent.orangeCTA,
                    color: tokens.colors.text.onDark
                  }}
                >
                  {t.cta.button1}
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </Link>
              <Link href="/coaches">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-8 py-4 rounded-full font-semibold flex items-center justify-center gap-2"
                  style={{ 
                    backgroundColor: 'rgba(255,255,255,0.15)',
                    color: tokens.colors.text.onDark,
                    border: '1px solid rgba(255,255,255,0.3)'
                  }}
                >
                  {t.cta.button2}
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <FooterInstitutional />
    </div>
  );
}
