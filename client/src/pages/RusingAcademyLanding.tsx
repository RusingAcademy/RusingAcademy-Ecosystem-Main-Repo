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
  ChevronRight,
  X,
  AlertTriangle,
  Zap,
  GraduationCap,
  Calendar,
  FileText,
  Shield,
  Star
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
      title: 'Your Level C.',
      titleHighlight: 'Without Putting Your Career on Pause.',
      subtitle: 'Crash Courses intensifs conçus pour les fonctionnaires fédéraux. Atteignez vos objectifs BBB, CBC ou CCC 3 à 4 fois plus rapidement qu\'avec les méthodes traditionnelles.',
      cta1: 'Explore Programs',
      cta2: 'Book a Diagnostic (30 min)',
    },
    stats: {
      learners: 'Public Servants Trained',
      faster: 'Faster Results',
      aligned: 'SLE/CEFR Aligned',
      satisfaction: 'Satisfaction Rate',
    },
    problem: {
      title: 'Traditional Language Training Wasn\'t Built for Your Reality',
      subtitle: 'The federal public service demands results. Traditional methods don\'t deliver.',
      comparison: {
        traditional: {
          title: 'Traditional Method',
          items: [
            { label: 'Pace', value: '12-24 months to Level C' },
            { label: 'Flexibility', value: 'Fixed schedules, rigid formats' },
            { label: 'Approach', value: 'Generic curriculum, one-size-fits-all' },
            { label: 'Results', value: 'Uncertain outcomes, no guarantees' },
          ],
        },
        rusingacademy: {
          title: 'RusingÂcademy Method',
          items: [
            { label: 'Pace', value: '4-12 weeks to Level C' },
            { label: 'Flexibility', value: 'Your schedule, your pace' },
            { label: 'Approach', value: 'SLE-focused, personalized paths' },
            { label: 'Results', value: '95% success rate, guaranteed support' },
          ],
        },
      },
    },
    pathSeries: {
      title: 'The GC Bilingual Path Series™',
      subtitle: 'Structured Pathways for Predictable Progression',
      paths: [
        { 
          id: 'I',
          name: 'Foundations', 
          level: 'A1',
          price: '$899',
          duration: '4 weeks',
          hours: '30h',
          desc: 'Build core language fundamentals. Basic communication, presentations, essential emails.',
          focus: 'Basic workplace communication'
        },
        { 
          id: 'II',
          name: 'Everyday Fluency', 
          level: 'A2',
          price: '$899',
          duration: '4 weeks',
          hours: '30h',
          desc: 'Daily interactions, informal conversations, oral comprehension.',
          focus: 'Everyday professional interactions'
        },
        { 
          id: 'III',
          name: 'Operational French', 
          level: 'B1',
          price: '$999',
          duration: '4 weeks',
          hours: '35h',
          desc: 'Professional autonomy, report writing, meeting participation.',
          focus: 'Operational workplace tasks'
        },
        { 
          id: 'IV',
          name: 'Strategic Expression', 
          level: 'B2',
          price: '$1,099',
          duration: '4 weeks',
          hours: '35h',
          desc: 'Strategic communication, argumentation, negotiation.',
          focus: 'Strategic communication skills'
        },
        { 
          id: 'V',
          name: 'Professional Mastery', 
          level: 'C1',
          price: '$1,199',
          duration: '4 weeks',
          hours: '40h',
          desc: 'Executive excellence, linguistic nuances, high-level presentations.',
          focus: 'Executive-level proficiency'
        },
        { 
          id: 'VI',
          name: 'SLE Exam Accelerator', 
          level: 'Exam Prep',
          price: '$1,299',
          duration: '4 weeks',
          hours: '40h',
          desc: 'Intensive SLE exam preparation: reading, writing, oral.',
          focus: 'SLE exam success'
        },
      ],
    },
    bundles: {
      title: 'Your Career Demands a Plan. Not Just a Course.',
      subtitle: 'Strategic bundles designed for ambitious professionals',
      items: [
        {
          name: 'Fast Track to BBB',
          price: '$2,497',
          savings: 'Save $300',
          description: 'For professionals targeting BBB certification within 12 weeks.',
          includes: ['Path I + II + III', '90 structured hours', 'SLE simulation exams', 'Priority coach access'],
          ideal: 'Entry-level bilingual positions',
        },
        {
          name: 'Fast Track to CCC',
          price: '$4,297',
          savings: 'Save $600',
          description: 'The complete journey from foundations to executive-level proficiency.',
          includes: ['All 6 Paths (I-VI)', '220 structured hours', 'Unlimited simulations', 'Dedicated success manager'],
          ideal: 'Executive & leadership roles',
          featured: true,
        },
        {
          name: 'Bilingual Excellence',
          price: '$3,497',
          savings: 'Save $400',
          description: 'For professionals ready to achieve CBC or higher.',
          includes: ['Path IV + V + VI', '115 structured hours', 'Advanced simulations', 'Executive coaching sessions'],
          ideal: 'Senior management positions',
        },
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
      title: 'Built for Public Servants. Approved by Public Servants.',
      subtitle: 'Real results from real professionals in the federal government',
      items: [
        {
          quote: 'The Path Series™ helped our entire team achieve their SLE goals ahead of schedule. The structured approach made all the difference.',
          name: 'Director, Policy Branch',
          org: 'Federal Department',
          level: 'CCC',
        },
        {
          quote: 'Finally, a curriculum that understands the realities of the public service. Practical, efficient, and results-driven.',
          name: 'HR Manager',
          org: 'Crown Corporation',
          level: 'CBC',
        },
        {
          quote: 'Our department saw a 40% improvement in SLE pass rates after implementing RusingAcademy programs.',
          name: 'Learning Coordinator',
          org: 'Central Agency',
          level: 'BBB',
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
      title: 'Votre Niveau C.',
      titleHighlight: 'Sans Mettre Votre Carrière sur Pause.',
      subtitle: 'Cours intensifs conçus pour les fonctionnaires fédéraux. Atteignez vos objectifs BBB, CBC ou CCC 3 à 4 fois plus rapidement qu\'avec les méthodes traditionnelles.',
      cta1: 'Explorer les programmes',
      cta2: 'Réserver un diagnostic (30 min)',
    },
    stats: {
      learners: 'Fonctionnaires formés',
      faster: 'Résultats plus rapides',
      aligned: 'Aligné ELS/CECR',
      satisfaction: 'Taux de satisfaction',
    },
    problem: {
      title: 'La formation linguistique traditionnelle n\'a pas été conçue pour votre réalité',
      subtitle: 'La fonction publique fédérale exige des résultats. Les méthodes traditionnelles ne livrent pas.',
      comparison: {
        traditional: {
          title: 'Méthode Traditionnelle',
          items: [
            { label: 'Rythme', value: '12-24 mois pour le niveau C' },
            { label: 'Flexibilité', value: 'Horaires fixes, formats rigides' },
            { label: 'Approche', value: 'Curriculum générique, taille unique' },
            { label: 'Résultats', value: 'Résultats incertains, sans garantie' },
          ],
        },
        rusingacademy: {
          title: 'Méthode RusingÂcademy',
          items: [
            { label: 'Rythme', value: '4-12 semaines pour le niveau C' },
            { label: 'Flexibilité', value: 'Votre horaire, votre rythme' },
            { label: 'Approche', value: 'Axé ELS, parcours personnalisés' },
            { label: 'Résultats', value: '95% de réussite, support garanti' },
          ],
        },
      },
    },
    pathSeries: {
      title: 'La série GC Bilingual Path™',
      subtitle: 'Des parcours structurés pour une progression prévisible',
      paths: [
        { 
          id: 'I',
          name: 'Fondations', 
          level: 'A1',
          price: '899$',
          duration: '4 semaines',
          hours: '30h',
          desc: 'Construire les bases linguistiques. Communication de base, présentations, courriels essentiels.',
          focus: 'Communication de base au travail'
        },
        { 
          id: 'II',
          name: 'Fluidité Quotidienne', 
          level: 'A2',
          price: '899$',
          duration: '4 semaines',
          hours: '30h',
          desc: 'Interactions quotidiennes, conversations informelles, compréhension orale.',
          focus: 'Interactions professionnelles quotidiennes'
        },
        { 
          id: 'III',
          name: 'Français Opérationnel', 
          level: 'B1',
          price: '999$',
          duration: '4 semaines',
          hours: '35h',
          desc: 'Autonomie professionnelle, rédaction de rapports, participation aux réunions.',
          focus: 'Tâches opérationnelles au travail'
        },
        { 
          id: 'IV',
          name: 'Expression Stratégique', 
          level: 'B2',
          price: '1 099$',
          duration: '4 semaines',
          hours: '35h',
          desc: 'Communication stratégique, argumentation, négociation.',
          focus: 'Compétences de communication stratégique'
        },
        { 
          id: 'V',
          name: 'Maîtrise Professionnelle', 
          level: 'C1',
          price: '1 199$',
          duration: '4 semaines',
          hours: '40h',
          desc: 'Excellence exécutive, nuances linguistiques, présentations de haut niveau.',
          focus: 'Compétence de niveau exécutif'
        },
        { 
          id: 'VI',
          name: 'Accélérateur ELS', 
          level: 'Prep Examen',
          price: '1 299$',
          duration: '4 semaines',
          hours: '40h',
          desc: 'Préparation intensive aux examens ELS : lecture, écriture, oral.',
          focus: 'Réussite aux examens ELS'
        },
      ],
    },
    bundles: {
      title: 'Votre carrière exige un plan. Pas juste un cours.',
      subtitle: 'Des forfaits stratégiques conçus pour les professionnels ambitieux',
      items: [
        {
          name: 'Fast Track vers BBB',
          price: '2 497$',
          savings: 'Économisez 300$',
          description: 'Pour les professionnels visant la certification BBB en 12 semaines.',
          includes: ['Path I + II + III', '90 heures structurées', 'Examens de simulation ELS', 'Accès prioritaire aux coachs'],
          ideal: 'Postes bilingues de niveau d\'entrée',
        },
        {
          name: 'Fast Track vers CCC',
          price: '4 297$',
          savings: 'Économisez 600$',
          description: 'Le parcours complet des fondations à la maîtrise de niveau exécutif.',
          includes: ['Les 6 Paths (I-VI)', '220 heures structurées', 'Simulations illimitées', 'Gestionnaire de succès dédié'],
          ideal: 'Rôles exécutifs et de leadership',
          featured: true,
        },
        {
          name: 'Excellence Bilingue',
          price: '3 497$',
          savings: 'Économisez 400$',
          description: 'Pour les professionnels prêts à atteindre CBC ou plus.',
          includes: ['Path IV + V + VI', '115 heures structurées', 'Simulations avancées', 'Sessions de coaching exécutif'],
          ideal: 'Postes de gestion supérieure',
        },
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
      title: 'Conçu pour les fonctionnaires. Approuvé par les fonctionnaires.',
      subtitle: 'Des résultats réels de vrais professionnels du gouvernement fédéral',
      items: [
        {
          quote: 'La série Path™ a aidé toute notre équipe à atteindre ses objectifs ELS en avance. L\'approche structurée a fait toute la différence.',
          name: 'Directeur, Direction des politiques',
          org: 'Ministère fédéral',
          level: 'CCC',
        },
        {
          quote: 'Enfin, un curriculum qui comprend les réalités de la fonction publique. Pratique, efficace et axé sur les résultats.',
          name: 'Gestionnaire RH',
          org: 'Société d\'État',
          level: 'CBC',
        },
        {
          quote: 'Notre ministère a vu une amélioration de 40% des taux de réussite ELS après avoir adopté les programmes RusingAcademy.',
          name: 'Coordonnateur de l\'apprentissage',
          org: 'Organisme central',
          level: 'BBB',
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
  const [theme, setTheme] = useState<'glass' | 'light'>('light');
  const [selectedPath, setSelectedPath] = useState<number>(0);

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
  const brand = brandColors.rusingacademy;

  return (
    <div className={`min-h-screen bg-[#FEFEF8] text-[#082038]`}>
      <SEO
        title="RusingAcademy - Path Series™ SLE Training"
        description="Structured SLE curriculum with Path Series™ methodology. B2B/B2G training solutions for federal departments and organizations. Achieve BBB, CBC, or CCC goals."
        canonical="https://www.rusingacademy.ca/rusingacademy"
      />

      {/* Hero Section */}
      <section className="relative pt-8 pb-20 overflow-hidden">
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            background: `radial-gradient(ellipse at top right, ${brand.glow} 0%, transparent 50%)`,
          }}
        />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
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
                  background: 'rgba(249, 115, 22, 0.1)',
                  border: `1px solid ${brand.primary}40`
                }}
              >
                <span className="text-sm font-medium" style={{ color: brand.primary }}>
                  {t.hero.badge}
                </span>
              </motion.div>

              <motion.h1 
                variants={animationVariants.fadeInUp}
                transition={transitions.normal}
                className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-[#082038]"
              >
                {t.hero.title}{' '}
                <span style={{ color: brand.primary }}>{t.hero.titleHighlight}</span>
              </motion.h1>

              <motion.p 
                variants={animationVariants.fadeInUp}
                transition={transitions.normal}
                className="text-lg md:text-xl mb-8 max-w-xl text-[#4A5B66]"
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
                <a
                  href="https://calendly.com/steven-barholere/30min"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all hover:scale-105 bg-[#F5F1D6] text-[#082038] border border-[#E6E6E0] hover:bg-[#E6E6E0]"
                >
                  {t.hero.cta2}
                </a>
              </motion.div>
            </motion.div>

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
              <div className="absolute -bottom-4 -left-4 px-4 py-3 rounded-xl shadow-xl bg-white border border-[#E6E6E0]">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ background: brand.gradient }}
                  >
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold" style={{ color: brand.primary }}>3-4x</p>
                    <p className="text-xs text-[#4A5B66]">
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
      <section className="py-10 sm:py-16 bg-[#F5F1D6]">
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
                className="text-center p-6 rounded-2xl bg-white border border-[#E6E6E0] shadow-sm"
              >
                <stat.icon 
                  className="w-8 h-8 mx-auto mb-3" 
                  style={{ color: brand.primary }} 
                />
                <p className="text-3xl font-bold mb-1" style={{ color: brand.primary }}>
                  {stat.value}
                </p>
                <p className="text-sm text-[#4A5B66]">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Problem Section - NEW */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={animationVariants.fadeInUp}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#082038]">
              {t.problem.title}
            </h2>
            <p className="text-lg max-w-2xl mx-auto text-[#4A5B66]">
              {t.problem.subtitle}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Traditional Method */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="p-6 rounded-2xl bg-gray-50 border border-gray-200"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                  <X className="w-5 h-5 text-gray-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-600">
                  {t.problem.comparison.traditional.title}
                </h3>
              </div>
              <div className="space-y-4">
                {t.problem.comparison.traditional.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center py-3 border-b border-gray-200 last:border-0">
                    <span className="text-gray-500 font-medium">{item.label}</span>
                    <span className="text-gray-600">{item.value}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* RusingAcademy Method */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="p-6 rounded-2xl bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-orange-200 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-200 rounded-full blur-3xl opacity-30" />
              <div className="relative">
                <div className="flex items-center gap-3 mb-6">
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ background: brand.gradient }}
                  >
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold" style={{ color: brand.primary }}>
                    {t.problem.comparison.rusingacademy.title}
                  </h3>
                </div>
                <div className="space-y-4">
                  {t.problem.comparison.rusingacademy.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center py-3 border-b border-orange-200 last:border-0">
                      <span className="font-medium text-[#082038]">{item.label}</span>
                      <span className="font-semibold" style={{ color: brand.primary }}>{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Path Series Section - Enhanced with Tabs */}
      <section className="py-12 sm:py-20 bg-[#F5F1D6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={animationVariants.fadeInUp}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#082038]">
              {t.pathSeries.title}
            </h2>
            <p className="text-lg max-w-2xl mx-auto text-[#4A5B66]">
              {t.pathSeries.subtitle}
            </p>
          </motion.div>

          {/* Path Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {t.pathSeries.paths.map((path, index) => (
              <button
                key={index}
                onClick={() => setSelectedPath(index)}
                className={`px-4 py-2 rounded-full font-medium transition-all ${
                  selectedPath === index
                    ? 'text-white shadow-lg'
                    : 'bg-white text-[#082038] border border-[#E6E6E0] hover:border-orange-300'
                }`}
                style={selectedPath === index ? { background: brand.gradient } : {}}
              >
                Path {path.id}
              </button>
            ))}
          </div>

          {/* Selected Path Detail */}
          <motion.div
            key={selectedPath}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="max-w-4xl mx-auto"
          >
            <div className="bg-white rounded-3xl shadow-xl border border-[#E6E6E0] overflow-hidden">
              <div className="p-8 md:p-12">
                <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span 
                        className="px-3 py-1 rounded-full text-sm font-bold text-white"
                        style={{ background: brand.gradient }}
                      >
                        Path {t.pathSeries.paths[selectedPath].id}
                      </span>
                      <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-600">
                        {t.pathSeries.paths[selectedPath].level}
                      </span>
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold text-[#082038]">
                      {t.pathSeries.paths[selectedPath].name}
                    </h3>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold" style={{ color: brand.primary }}>
                      {t.pathSeries.paths[selectedPath].price}
                    </p>
                    <p className="text-sm text-[#4A5B66]">CAD</p>
                  </div>
                </div>

                <p className="text-lg text-[#4A5B66] mb-8">
                  {t.pathSeries.paths[selectedPath].desc}
                </p>

                <div className="grid grid-cols-3 gap-4 mb-8">
                  <div className="text-center p-4 bg-gray-50 rounded-xl">
                    <Calendar className="w-6 h-6 mx-auto mb-2" style={{ color: brand.primary }} />
                    <p className="font-bold text-[#082038]">{t.pathSeries.paths[selectedPath].duration}</p>
                    <p className="text-xs text-[#4A5B66]">Duration</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-xl">
                    <Clock className="w-6 h-6 mx-auto mb-2" style={{ color: brand.primary }} />
                    <p className="font-bold text-[#082038]">{t.pathSeries.paths[selectedPath].hours}</p>
                    <p className="text-xs text-[#4A5B66]">Structured Hours</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-xl">
                    <Target className="w-6 h-6 mx-auto mb-2" style={{ color: brand.primary }} />
                    <p className="font-bold text-[#082038]">{t.pathSeries.paths[selectedPath].focus}</p>
                    <p className="text-xs text-[#4A5B66]">Focus</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4">
                  <a
                    href="https://calendly.com/steven-barholere/30min"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-medium text-white transition-all hover:scale-105"
                    style={{ background: brand.gradient }}
                  >
                    Enroll Now
                    <ArrowRight className="w-4 h-4" />
                  </a>
                  <Link
                    href="/curriculum"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-medium bg-white text-[#082038] border border-[#E6E6E0] hover:bg-gray-50 transition-all"
                  >
                    View Full Curriculum
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Path Overview Grid */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={animationVariants.staggerContainer}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-12"
          >
            {t.pathSeries.paths.map((path, index) => (
              <motion.button
                key={index}
                variants={animationVariants.fadeInUp}
                transition={{ ...transitions.normal, delay: index * 0.05 }}
                onClick={() => setSelectedPath(index)}
                className={`p-4 rounded-xl text-left transition-all ${
                  selectedPath === index
                    ? 'bg-white shadow-lg border-2 border-orange-300'
                    : 'bg-white/50 border border-[#E6E6E0] hover:bg-white hover:shadow-md'
                }`}
              >
                <span 
                  className="text-xs font-bold px-2 py-0.5 rounded"
                  style={{ 
                    background: selectedPath === index ? brand.gradient : 'rgba(249, 115, 22, 0.1)',
                    color: selectedPath === index ? 'white' : brand.primary
                  }}
                >
                  {path.id}
                </span>
                <p className="font-semibold text-sm mt-2 text-[#082038]">{path.name}</p>
                <p className="text-xs text-[#4A5B66] mt-1">{path.level}</p>
              </motion.button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Bundles Section - NEW */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={animationVariants.fadeInUp}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#082038]">
              {t.bundles.title}
            </h2>
            <p className="text-lg max-w-2xl mx-auto text-[#4A5B66]">
              {t.bundles.subtitle}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {t.bundles.items.map((bundle, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`relative p-8 rounded-3xl ${
                  bundle.featured
                    ? 'bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-orange-300 shadow-xl'
                    : 'bg-white border border-[#E6E6E0] shadow-lg'
                }`}
              >
                {bundle.featured && (
                  <div 
                    className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-sm font-bold text-white"
                    style={{ background: brand.gradient }}
                  >
                    Most Popular
                  </div>
                )}
                
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-[#082038] mb-2">{bundle.name}</h3>
                  <p className="text-sm text-[#4A5B66]">{bundle.description}</p>
                </div>

                <div className="mb-6">
                  <p className="text-4xl font-bold" style={{ color: brand.primary }}>{bundle.price}</p>
                  <p className="text-sm font-medium text-green-600">{bundle.savings}</p>
                </div>

                <ul className="space-y-3 mb-6">
                  {bundle.includes.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 flex-shrink-0" style={{ color: brand.primary }} />
                      <span className="text-sm text-[#4A5B66]">{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="pt-4 border-t border-gray-200">
                  <p className="text-xs text-[#4A5B66] mb-4">
                    <strong>Ideal for:</strong> {bundle.ideal}
                  </p>
                  <a
                    href="https://calendly.com/steven-barholere/30min"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-medium transition-all hover:scale-105 ${
                      bundle.featured
                        ? 'text-white'
                        : 'bg-white text-[#082038] border border-[#E6E6E0] hover:bg-gray-50'
                    }`}
                    style={bundle.featured ? { background: brand.gradient } : {}}
                  >
                    Get Started
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Offerings Section */}
      <section className="py-12 sm:py-20 bg-[#F5F1D6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={animationVariants.fadeInUp}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#082038]">
              {t.offerings.title}
            </h2>
            <p className="text-lg max-w-2xl mx-auto text-[#4A5B66]">
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
                  className="relative p-8 rounded-3xl overflow-hidden bg-white border border-[#E6E6E0] shadow-lg"
                >
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
                  
                  <h3 className="text-xl font-bold mb-3 text-[#082038]">
                    {item.title}
                  </h3>
                  <p className="mb-6 text-[#4A5B66]">
                    {item.desc}
                  </p>
                  
                  <ul className="space-y-3">
                    {item.features.map((feature, fIndex) => (
                      <li key={fIndex} className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 flex-shrink-0" style={{ color: brand.primary }} />
                        <span className="text-sm text-[#4A5B66]">
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#082038]">
              {t.testimonials.title}
            </h2>
            <p className="text-lg max-w-2xl mx-auto text-[#4A5B66]">
              {t.testimonials.subtitle}
            </p>
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
                className="p-6 rounded-2xl bg-white border border-[#E6E6E0] shadow-sm"
              >
                <div className="flex items-center justify-between mb-4">
                  <div 
                    className="text-4xl"
                    style={{ color: brand.primary }}
                  >
                    "
                  </div>
                  <span 
                    className="px-3 py-1 rounded-full text-xs font-bold text-white"
                    style={{ background: brand.gradient }}
                  >
                    {item.level}
                  </span>
                </div>
                <p className="mb-6 italic text-[#4A5B66]">
                  {item.quote}
                </p>
                <div>
                  <p className="font-semibold text-[#082038]">
                    {item.name}
                  </p>
                  <p className="text-sm text-[#4A5B66]">
                    {item.org}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-[#F5F1D6]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={animationVariants.fadeInUp}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#082038]">
              {t.cta.title}
            </h2>
            <p className="text-lg mb-8 text-[#4A5B66]">
              {t.cta.subtitle}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="https://calendly.com/steven-barholere/30min"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-medium text-white transition-all hover:scale-105"
                style={{ background: brand.gradient }}
              >
                {t.cta.button1}
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="https://calendly.com/steven-barholere/30min"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-medium transition-all hover:scale-105 bg-white text-[#082038] border border-[#E6E6E0] hover:bg-[#F5F1D6]"
              >
                {t.cta.button2}
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <EcosystemFooter lang={lang} theme={theme} activeBrand="rusingacademy" />
    </div>
  );
}
