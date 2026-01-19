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
  Target,
  TrendingUp,
  Globe,
  GraduationCap,
  FileText,
  Mic,
  PenTool,
  Briefcase,
  RefreshCw,
  ChevronDown,
  Star,
  Shield,
  Zap
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

const labels = {
  en: {
    hero: {
      badge: 'Path Series™ Curriculum',
      title: 'Your Level C.',
      titleHighlight: 'Without Putting Your Career on Pause.',
      subtitle: 'Crash Courses designed for federal public servants. Structured paths aligned with SLE outcomes. Achieve BBB, CBC, or CCC goals 3-4x faster than traditional programs.',
      cta1: 'Explore Programs',
      cta2: 'Book Free Diagnostic',
    },
    stats: [
      { value: '2,500+', label: 'Successful Graduates' },
      { value: '3-4x', label: 'Faster Than Traditional' },
      { value: '100%', label: 'CEFR/PSC/PFL2 Aligned' },
      { value: '40', label: 'PFL2 Objectives Integrated' },
    ],
    problem: {
      title: 'Traditional language training wasn\'t designed for your reality.',
      subtitle: 'The Problem',
      comparison: [
        { traditional: 'Generic content for all learners', rusingacademy: 'Content tailored for GC professionals' },
        { traditional: '12-18 months to reach Level C', rusingacademy: '3-4 months with intensive paths' },
        { traditional: 'Fixed schedules, rigid formats', rusingacademy: 'Flexible micro-learning + coaching' },
        { traditional: 'Theory-heavy, exam-disconnected', rusingacademy: 'SLE exam-aligned from day one' },
      ],
    },
    solution: {
      title: 'Structured Paths for Predictable Progression.',
      subtitle: 'The Solution: Path Series™',
      description: 'Our proprietary curriculum combines structured learning, accelerated practice, and deep immersion—all designed around your busy schedule.',
      pillars: [
        { icon: 'BookOpen', title: 'Structured', desc: 'Clear progression from A1 to C1 with measurable milestones' },
        { icon: 'Zap', title: 'Accelerated', desc: 'Intensive formats designed for rapid SLE preparation' },
        { icon: 'Target', title: 'Deep', desc: 'Immersive practice with real GC scenarios and vocabulary' },
      ],
    },
    curriculum: {
      title: 'The GC Bilingual Path Series™',
      subtitle: 'Le Curriculum',
      paths: [
        { 
          id: 'I', 
          name: 'Foundations', 
          nameFr: 'Fondations',
          cefr: 'A1', 
          price: 899, 
          duration: '4 weeks', 
          hours: 30,
          description: 'Build core language fundamentals for complete beginners.',
          objectives: ['Basic vocabulary & grammar', 'Simple workplace interactions', 'Foundation for progression']
        },
        { 
          id: 'II', 
          name: 'Everyday Fluency', 
          nameFr: 'Fluidité Quotidienne',
          cefr: 'A2', 
          price: 899, 
          duration: '4 weeks', 
          hours: 30,
          description: 'Develop everyday communication skills for workplace settings.',
          objectives: ['Routine workplace conversations', 'Email & written basics', 'Comprehension building']
        },
        { 
          id: 'III', 
          name: 'Operational French', 
          nameFr: 'Français Opérationnel',
          cefr: 'B1', 
          price: 999, 
          duration: '4 weeks', 
          hours: 35,
          description: 'Master operational-level French for professional contexts.',
          objectives: ['Meeting participation', 'Report writing basics', 'SLE B-level preparation']
        },
        { 
          id: 'IV', 
          name: 'Strategic Expression', 
          nameFr: 'Expression Stratégique',
          cefr: 'B2', 
          price: 1099, 
          duration: '4 weeks', 
          hours: 35,
          description: 'Develop strategic communication for leadership contexts.',
          objectives: ['Complex argumentation', 'Briefing & presentation skills', 'Advanced written expression']
        },
        { 
          id: 'V', 
          name: 'Professional Mastery', 
          nameFr: 'Maîtrise Professionnelle',
          cefr: 'C1', 
          price: 1199, 
          duration: '4 weeks', 
          hours: 40,
          description: 'Achieve professional mastery for executive-level bilingualism.',
          objectives: ['Nuanced expression', 'Executive communication', 'SLE C-level preparation']
        },
        { 
          id: 'VI', 
          name: 'SLE Accelerator', 
          nameFr: 'Accélérateur ELS',
          cefr: 'Exam Prep', 
          price: 1299, 
          duration: '4 weeks', 
          hours: 40,
          description: 'Intensive exam preparation for upcoming SLE tests.',
          objectives: ['Mock exams & feedback', 'Test-taking strategies', 'Targeted weakness remediation']
        },
      ],
    },
    bundles: {
      title: 'Your Career Demands a Plan. Not Just a Course.',
      subtitle: 'Les Bundles',
      items: [
        {
          name: 'Starter Bundle',
          paths: 'Paths I-II',
          price: 1599,
          savings: 199,
          description: 'Perfect for beginners building their foundation.',
          features: ['2 complete paths', 'Certificate of completion', 'Progress tracking'],
        },
        {
          name: 'Professional Bundle',
          paths: 'Paths III-IV',
          price: 1899,
          savings: 299,
          popular: true,
          description: 'Ideal for professionals targeting B-level SLE.',
          features: ['2 complete paths', 'SLE mock exams', '1 coaching session', 'Priority support'],
        },
        {
          name: 'Executive Bundle',
          paths: 'Paths V-VI',
          price: 2199,
          savings: 299,
          description: 'For executives pursuing C-level excellence.',
          features: ['2 complete paths', 'Advanced SLE prep', '2 coaching sessions', 'VIP support'],
        },
      ],
    },
    proof: {
      title: 'Designed for Public Servants. Approved by Public Servants.',
      subtitle: 'Preuve Sociale',
      testimonials: [
        {
          quote: 'The Path Series™ helped our entire team achieve their SLE goals ahead of schedule. The structured approach made all the difference.',
          name: 'Director, Policy Branch',
          org: 'Federal Department',
          result: 'Team achieved CBC in 4 months',
        },
        {
          quote: 'Finally, a curriculum that understands the realities of the public service. Practical, efficient, and results-driven.',
          name: 'HR Manager',
          org: 'Crown Corporation',
          result: '40% improvement in pass rates',
        },
        {
          quote: 'The micro-learning format fit perfectly into my busy schedule. I went from B to C in just 3 months.',
          name: 'Senior Policy Analyst',
          org: 'Central Agency',
          result: 'Achieved Level C in 3 months',
        },
      ],
    },
    cta: {
      title: 'Ready to Transform Your Language Capabilities?',
      subtitle: 'Get a customized learning plan tailored to your goals and timeline.',
      button1: 'Book Free Diagnostic',
      button2: 'View All Programs',
    },
  },
  fr: {
    hero: {
      badge: 'Curriculum Path Series™',
      title: 'Votre Niveau C.',
      titleHighlight: 'Sans Mettre Votre Carrière sur Pause.',
      subtitle: 'Cours intensifs conçus pour les fonctionnaires fédéraux. Parcours structurés alignés sur les résultats ELS. Atteignez vos objectifs BBB, CBC ou CCC 3-4x plus rapidement.',
      cta1: 'Explorer les programmes',
      cta2: 'Réserver un diagnostic gratuit',
    },
    stats: [
      { value: '2 500+', label: 'Diplômés avec succès' },
      { value: '3-4x', label: 'Plus rapide que traditionnel' },
      { value: '100%', label: 'Aligné CECR/CFP/PFL2' },
      { value: '40', label: 'Objectifs PFL2 intégrés' },
    ],
    problem: {
      title: 'La formation linguistique traditionnelle n\'a pas été conçue pour votre réalité.',
      subtitle: 'Le Problème',
      comparison: [
        { traditional: 'Contenu générique pour tous', rusingacademy: 'Contenu adapté aux professionnels GC' },
        { traditional: '12-18 mois pour atteindre le niveau C', rusingacademy: '3-4 mois avec parcours intensifs' },
        { traditional: 'Horaires fixes, formats rigides', rusingacademy: 'Micro-apprentissage flexible + coaching' },
        { traditional: 'Théorique, déconnecté des examens', rusingacademy: 'Aligné ELS dès le premier jour' },
      ],
    },
    solution: {
      title: 'Des Parcours Structurés pour une Progression Prévisible.',
      subtitle: 'La Solution : Path Series™',
      description: 'Notre curriculum propriétaire combine apprentissage structuré, pratique accélérée et immersion profonde—le tout conçu autour de votre emploi du temps chargé.',
      pillars: [
        { icon: 'BookOpen', title: 'Structuré', desc: 'Progression claire de A1 à C1 avec jalons mesurables' },
        { icon: 'Zap', title: 'Accéléré', desc: 'Formats intensifs conçus pour une préparation ELS rapide' },
        { icon: 'Target', title: 'Profond', desc: 'Pratique immersive avec scénarios et vocabulaire GC réels' },
      ],
    },
    curriculum: {
      title: 'La Série Path™ Bilingue GC',
      subtitle: 'Le Curriculum',
      paths: [
        { 
          id: 'I', 
          name: 'Fondations', 
          nameFr: 'Fondations',
          cefr: 'A1', 
          price: 899, 
          duration: '4 semaines', 
          hours: 30,
          description: 'Construire les bases linguistiques pour les débutants complets.',
          objectives: ['Vocabulaire & grammaire de base', 'Interactions simples au travail', 'Fondation pour progresser']
        },
        { 
          id: 'II', 
          name: 'Fluidité Quotidienne', 
          nameFr: 'Fluidité Quotidienne',
          cefr: 'A2', 
          price: 899, 
          duration: '4 semaines', 
          hours: 30,
          description: 'Développer les compétences de communication quotidienne.',
          objectives: ['Conversations de routine', 'Bases de courriel & écrit', 'Développement de la compréhension']
        },
        { 
          id: 'III', 
          name: 'Français Opérationnel', 
          nameFr: 'Français Opérationnel',
          cefr: 'B1', 
          price: 999, 
          duration: '4 semaines', 
          hours: 35,
          description: 'Maîtriser le français opérationnel pour contextes professionnels.',
          objectives: ['Participation aux réunions', 'Bases de rédaction de rapports', 'Préparation niveau B ELS']
        },
        { 
          id: 'IV', 
          name: 'Expression Stratégique', 
          nameFr: 'Expression Stratégique',
          cefr: 'B2', 
          price: 1099, 
          duration: '4 semaines', 
          hours: 35,
          description: 'Développer la communication stratégique pour contextes de leadership.',
          objectives: ['Argumentation complexe', 'Compétences de briefing & présentation', 'Expression écrite avancée']
        },
        { 
          id: 'V', 
          name: 'Maîtrise Professionnelle', 
          nameFr: 'Maîtrise Professionnelle',
          cefr: 'C1', 
          price: 1199, 
          duration: '4 semaines', 
          hours: 40,
          description: 'Atteindre la maîtrise professionnelle pour le bilinguisme exécutif.',
          objectives: ['Expression nuancée', 'Communication exécutive', 'Préparation niveau C ELS']
        },
        { 
          id: 'VI', 
          name: 'Accélérateur ELS', 
          nameFr: 'Accélérateur ELS',
          cefr: 'Prep Examen', 
          price: 1299, 
          duration: '4 semaines', 
          hours: 40,
          description: 'Préparation intensive pour les examens ELS à venir.',
          objectives: ['Examens simulés & rétroaction', 'Stratégies de test', 'Remédiation ciblée des faiblesses']
        },
      ],
    },
    bundles: {
      title: 'Votre Carrière Exige un Plan. Pas Juste un Cours.',
      subtitle: 'Les Bundles',
      items: [
        {
          name: 'Bundle Débutant',
          paths: 'Parcours I-II',
          price: 1599,
          savings: 199,
          description: 'Parfait pour les débutants construisant leur fondation.',
          features: ['2 parcours complets', 'Certificat de complétion', 'Suivi des progrès'],
        },
        {
          name: 'Bundle Professionnel',
          paths: 'Parcours III-IV',
          price: 1899,
          savings: 299,
          popular: true,
          description: 'Idéal pour les professionnels visant le niveau B ELS.',
          features: ['2 parcours complets', 'Examens simulés ELS', '1 session de coaching', 'Support prioritaire'],
        },
        {
          name: 'Bundle Exécutif',
          paths: 'Parcours V-VI',
          price: 2199,
          savings: 299,
          description: 'Pour les cadres poursuivant l\'excellence niveau C.',
          features: ['2 parcours complets', 'Préparation ELS avancée', '2 sessions de coaching', 'Support VIP'],
        },
      ],
    },
    proof: {
      title: 'Conçu pour les Fonctionnaires. Approuvé par les Fonctionnaires.',
      subtitle: 'Preuve Sociale',
      testimonials: [
        {
          quote: 'La série Path™ a aidé toute notre équipe à atteindre ses objectifs ELS en avance. L\'approche structurée a fait toute la différence.',
          name: 'Directeur, Direction des politiques',
          org: 'Ministère fédéral',
          result: 'Équipe a atteint CBC en 4 mois',
        },
        {
          quote: 'Enfin, un curriculum qui comprend les réalités de la fonction publique. Pratique, efficace et axé sur les résultats.',
          name: 'Gestionnaire RH',
          org: 'Société d\'État',
          result: 'Amélioration de 40% des taux de réussite',
        },
        {
          quote: 'Le format micro-apprentissage s\'intégrait parfaitement à mon emploi du temps chargé. Je suis passé de B à C en seulement 3 mois.',
          name: 'Analyste principal des politiques',
          org: 'Organisme central',
          result: 'Niveau C atteint en 3 mois',
        },
      ],
    },
    cta: {
      title: 'Prêt à Transformer Vos Capacités Linguistiques?',
      subtitle: 'Obtenez un plan d\'apprentissage personnalisé adapté à vos objectifs et votre calendrier.',
      button1: 'Réserver un diagnostic gratuit',
      button2: 'Voir tous les programmes',
    },
  },
};

const iconMap: Record<string, React.ElementType> = {
  BookOpen,
  Zap,
  Target,
};

export default function RusingAcademyPillar() {
  const { language } = useLanguage();
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  
  const t = labels[language as 'en' | 'fr'] || labels.en;

  return (
    <div className="min-h-screen" style={{ backgroundColor: tokens.colors.bg.canvas }}>
      <SEO
        title={language === 'fr'
          ? 'RusingÂcademy - Programmes Path Series™ pour Fonctionnaires'
          : 'RusingÂcademy - Path Series™ Programs for Public Servants'
        }
        description={language === 'fr'
          ? 'Curriculum ELS structuré avec la méthodologie Path Series™. Atteignez votre niveau C 3-4x plus rapidement.'
          : 'Structured SLE curriculum with Path Series™ methodology. Achieve your Level C 3-4x faster.'
        }
      />

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 overflow-hidden">
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            background: `radial-gradient(ellipse at top right, ${tokens.colors.accent.navy} 0%, transparent 50%)`,
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
                backgroundColor: `${tokens.colors.accent.navy}15`,
                color: tokens.colors.accent.navy 
              }}
            >
              <GraduationCap className="w-4 h-4" />
              {t.hero.badge}
            </span>
            
            <h1 
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
              style={{ color: tokens.colors.text.primary }}
            >
              {t.hero.title}{' '}
              <span style={{ color: tokens.colors.accent.navy }}>
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
              <Link href="/courses">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-8 py-4 rounded-full font-semibold text-white flex items-center justify-center gap-2"
                  style={{ backgroundColor: tokens.colors.accent.navy }}
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
                  className="text-3xl md:text-4xl font-bold mb-2"
                  style={{ color: tokens.colors.accent.navy }}
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

      {/* Problem Section */}
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
              {t.problem.subtitle}
            </span>
            <h2 
              className="text-3xl md:text-4xl font-bold"
              style={{ color: tokens.colors.text.primary }}
            >
              {t.problem.title}
            </h2>
          </motion.div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr>
                  <th 
                    className="text-left p-4 font-semibold"
                    style={{ color: tokens.colors.text.muted }}
                  >
                    {language === 'fr' ? 'Traditionnel' : 'Traditional'}
                  </th>
                  <th 
                    className="text-left p-4 font-semibold"
                    style={{ color: tokens.colors.accent.navy }}
                  >
                    RusingÂcademy
                  </th>
                </tr>
              </thead>
              <tbody>
                {t.problem.comparison.map((row, index) => (
                  <motion.tr
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="border-t"
                    style={{ borderColor: tokens.colors.border.subtle }}
                  >
                    <td 
                      className="p-4"
                      style={{ color: tokens.colors.text.muted }}
                    >
                      <span className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-red-400" />
                        {row.traditional}
                      </span>
                    </td>
                    <td 
                      className="p-4"
                      style={{ color: tokens.colors.text.primary }}
                    >
                      <span className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5" style={{ color: tokens.colors.accent.teal }} />
                        {row.rusingacademy}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Solution Section */}
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
              {t.solution.subtitle}
            </span>
            <h2 
              className="text-3xl md:text-4xl font-bold mb-4"
              style={{ color: tokens.colors.text.primary }}
            >
              {t.solution.title}
            </h2>
            <p 
              className="text-lg max-w-3xl mx-auto"
              style={{ color: tokens.colors.text.secondary }}
            >
              {t.solution.description}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {t.solution.pillars.map((pillar, index) => {
              const Icon = iconMap[pillar.icon] || BookOpen;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="p-8 rounded-3xl text-center"
                  style={{ 
                    backgroundColor: tokens.colors.bg.surface,
                    border: `1px solid ${tokens.colors.border.subtle}`,
                    boxShadow: tokens.shadow[2]
                  }}
                >
                  <div 
                    className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
                    style={{ backgroundColor: `${tokens.colors.accent.navy}10` }}
                  >
                    <Icon className="w-8 h-8" style={{ color: tokens.colors.accent.navy }} />
                  </div>
                  <h3 
                    className="text-xl font-bold mb-3"
                    style={{ color: tokens.colors.text.primary }}
                  >
                    {pillar.title}
                  </h3>
                  <p style={{ color: tokens.colors.text.secondary }}>
                    {pillar.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Curriculum Section */}
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
              {t.curriculum.subtitle}
            </span>
            <h2 
              className="text-3xl md:text-4xl font-bold"
              style={{ color: tokens.colors.text.primary }}
            >
              {t.curriculum.title}
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {t.curriculum.paths.map((path, index) => (
              <motion.div
                key={path.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="rounded-3xl overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl"
                style={{ 
                  backgroundColor: tokens.colors.bg.surface,
                  border: `1px solid ${selectedPath === path.id ? tokens.colors.accent.navy : tokens.colors.border.subtle}`,
                  boxShadow: tokens.shadow[2]
                }}
                onClick={() => setSelectedPath(selectedPath === path.id ? null : path.id)}
              >
                <div 
                  className="p-6"
                  style={{ 
                    background: selectedPath === path.id 
                      ? `linear-gradient(135deg, ${tokens.colors.accent.navy} 0%, ${tokens.colors.accent.teal} 100%)`
                      : `linear-gradient(135deg, ${tokens.colors.accent.navy}10 0%, ${tokens.colors.accent.teal}10 100%)`
                  }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <span 
                      className="text-2xl font-bold"
                      style={{ color: selectedPath === path.id ? tokens.colors.text.onDark : tokens.colors.accent.navy }}
                    >
                      Path {path.id}
                    </span>
                    <span 
                      className="px-3 py-1 rounded-full text-sm font-semibold"
                      style={{ 
                        backgroundColor: selectedPath === path.id ? 'rgba(255,255,255,0.2)' : tokens.colors.accent.navy,
                        color: tokens.colors.text.onDark
                      }}
                    >
                      {path.cefr}
                    </span>
                  </div>
                  <h3 
                    className="text-xl font-bold mb-2"
                    style={{ color: selectedPath === path.id ? tokens.colors.text.onDark : tokens.colors.text.primary }}
                  >
                    {language === 'fr' ? path.nameFr : path.name}
                  </h3>
                  <p 
                    className="text-sm"
                    style={{ color: selectedPath === path.id ? 'rgba(255,255,255,0.8)' : tokens.colors.text.secondary }}
                  >
                    {path.description}
                  </p>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span 
                        className="text-3xl font-bold"
                        style={{ color: tokens.colors.accent.navy }}
                      >
                        ${path.price}
                      </span>
                      <span 
                        className="text-sm ml-1"
                        style={{ color: tokens.colors.text.muted }}
                      >
                        CAD
                      </span>
                    </div>
                    <div className="text-right">
                      <div 
                        className="text-sm font-semibold"
                        style={{ color: tokens.colors.text.primary }}
                      >
                        {path.duration}
                      </div>
                      <div 
                        className="text-sm"
                        style={{ color: tokens.colors.text.muted }}
                      >
                        {path.hours}h
                      </div>
                    </div>
                  </div>
                  
                  {selectedPath === path.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="pt-4 border-t"
                      style={{ borderColor: tokens.colors.border.subtle }}
                    >
                      <h4 
                        className="text-sm font-semibold mb-3"
                        style={{ color: tokens.colors.text.primary }}
                      >
                        {language === 'fr' ? 'Objectifs' : 'Objectives'}
                      </h4>
                      <ul className="space-y-2">
                        {path.objectives.map((obj, i) => (
                          <li 
                            key={i}
                            className="flex items-start gap-2 text-sm"
                            style={{ color: tokens.colors.text.secondary }}
                          >
                            <CheckCircle 
                              className="w-4 h-4 mt-0.5 flex-shrink-0" 
                              style={{ color: tokens.colors.accent.teal }} 
                            />
                            {obj}
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                  
                  <Link href={`/courses/path-${path.id.toLowerCase()}`}>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full mt-4 py-3 rounded-full font-semibold flex items-center justify-center gap-2"
                      style={{ 
                        backgroundColor: tokens.colors.accent.navy,
                        color: tokens.colors.text.onDark
                      }}
                    >
                      {language === 'fr' ? 'En savoir plus' : 'Learn More'}
                      <ArrowRight className="w-4 h-4" />
                    </motion.button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Bundles Section */}
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
              {t.bundles.subtitle}
            </span>
            <h2 
              className="text-3xl md:text-4xl font-bold"
              style={{ color: tokens.colors.text.primary }}
            >
              {t.bundles.title}
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {t.bundles.items.map((bundle, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`relative rounded-3xl p-8 ${bundle.popular ? 'ring-2' : ''}`}
                style={{ 
                  backgroundColor: tokens.colors.bg.surface,
                  border: `1px solid ${tokens.colors.border.subtle}`,
                  boxShadow: tokens.shadow[2],
                  ringColor: bundle.popular ? tokens.colors.accent.orangeCTA : undefined
                }}
              >
                {bundle.popular && (
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
                  {bundle.name}
                </h3>
                <p 
                  className="text-sm mb-4"
                  style={{ color: tokens.colors.accent.teal }}
                >
                  {bundle.paths}
                </p>
                <p 
                  className="text-sm mb-6"
                  style={{ color: tokens.colors.text.secondary }}
                >
                  {bundle.description}
                </p>
                
                <div className="mb-6">
                  <span 
                    className="text-4xl font-bold"
                    style={{ color: tokens.colors.accent.navy }}
                  >
                    ${bundle.price}
                  </span>
                  <span 
                    className="text-sm ml-2"
                    style={{ color: tokens.colors.accent.teal }}
                  >
                    {language === 'fr' ? `Économisez $${bundle.savings}` : `Save $${bundle.savings}`}
                  </span>
                </div>
                
                <ul className="space-y-3 mb-8">
                  {bundle.features.map((feature, i) => (
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
                  className="w-full py-3 rounded-full font-semibold"
                  style={{ 
                    backgroundColor: bundle.popular ? tokens.colors.accent.orangeCTA : tokens.colors.accent.navy,
                    color: tokens.colors.text.onDark
                  }}
                >
                  {language === 'fr' ? 'Choisir ce bundle' : 'Choose This Bundle'}
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
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
                      {testimonial.org}
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

      {/* Final CTA Section */}
      <section 
        className="py-20"
        style={{ 
          background: `linear-gradient(135deg, ${tokens.colors.accent.navy} 0%, ${tokens.colors.accent.teal} 100%)`
        }}
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
              <Link href="/courses">
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
