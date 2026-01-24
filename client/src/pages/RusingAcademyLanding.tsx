import { useState, useEffect, useRef } from 'react';
import { Link } from 'wouter';
import SEO from '@/components/SEO';
import { motion, useScroll, useTransform } from 'framer-motion';
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
  Star,
  MapPin,
  Building2,
  Sparkles,
  Quote
} from 'lucide-react';
import { brandColors, animationVariants, transitions } from '../lib/ecosystem-design-system';
import { EcosystemFooter } from '../components/EcosystemFooter';
import CrossEcosystemSection from '../components/CrossEcosystemSection';

// Path Series Images
const pathImages = {
  I: '/images/paths/path_a1_foundations.jpg',
  II: '/images/paths/path_a2_everyday.jpg',
  III: '/images/paths/path_b1_operational.jpg',
  IV: '/images/paths/path_b2_strategic.jpg',
  V: '/images/paths/path_c1_mastery.jpg',
  VI: '/images/paths/path_c2_exam.jpg',
};

// Section Images
const sectionImages = {
  hero: '/images/paths/hero_bilingual_excellence.jpg',
  success: '/images/paths/success_transformation.jpg',
  coaching: '/images/paths/section_expert_coaching.jpg',
  paths: '/images/paths/section_structured_paths.jpg',
  bilingual: '/images/paths/section_bilingual_support.jpg',
};

// Coaching Package Images
const coachingImages = {
  boost: '/images/paths/coaching_boost.jpg',
  mastery: '/images/paths/coaching_mastery.jpg',
  progressive: '/images/paths/coaching_progressive.jpg',
  quickprep: '/images/paths/coaching_quickprep.jpg',
};

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
      badgeSub: 'SLE-Aligned Training for Canadian Public Servants',
      title: 'Your Level C.',
      titleHighlight: 'Without Putting Your Career on Pause.',
      subtitle: 'Intensive crash courses designed for federal public servants. Achieve your BBB, CBC, or CCC goals 3-4x faster than traditional methods.',
      cta1: 'Explore Programs',
      cta2: 'Book a Free Diagnostic',
      trust: 'Trusted by 2,500+ public servants across 40+ federal departments',
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
      description: 'Each path is meticulously designed to build upon the previous, ensuring you develop the exact competencies required for your SLE certification level.',
      paths: [
        { 
          id: 'I',
          name: 'Foundations', 
          level: 'A1',
          price: '$899',
          duration: '4 weeks',
          hours: '30h',
          desc: 'Build core language fundamentals. Basic communication, presentations, essential emails.',
          focus: 'Basic workplace communication',
          tagline: 'From hesitation to essential communication'
        },
        { 
          id: 'II',
          name: 'Everyday Fluency', 
          level: 'A2',
          price: '$899',
          duration: '4 weeks',
          hours: '30h',
          desc: 'Daily interactions, informal conversations, oral comprehension.',
          focus: 'Everyday professional interactions',
          tagline: 'Confidence in daily workplace exchanges'
        },
        { 
          id: 'III',
          name: 'Operational French', 
          level: 'B1',
          price: '$999',
          duration: '4 weeks',
          hours: '35h',
          desc: 'Professional autonomy, report writing, meeting participation.',
          focus: 'Operational workplace tasks',
          tagline: 'Autonomy in professional contexts'
        },
        { 
          id: 'IV',
          name: 'Strategic Expression', 
          level: 'B2',
          price: '$1,099',
          duration: '4 weeks',
          hours: '35h',
          desc: 'Strategic communication, argumentation, negotiation.',
          focus: 'Strategic communication skills',
          tagline: 'Mastering nuanced professional discourse'
        },
        { 
          id: 'V',
          name: 'Professional Mastery', 
          level: 'C1',
          price: '$1,199',
          duration: '4 weeks',
          hours: '40h',
          desc: 'Executive excellence, linguistic nuances, high-level presentations.',
          focus: 'Executive-level proficiency',
          tagline: 'Excellence at the executive level'
        },
        { 
          id: 'VI',
          name: 'SLE Exam Accelerator', 
          level: 'Exam Prep',
          price: '$1,299',
          duration: '4 weeks',
          hours: '40h',
          desc: 'Intensive SLE exam preparation: reading, writing, oral.',
          focus: 'SLE exam success',
          tagline: 'Your final sprint to certification'
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
    whyUs: {
      title: 'Why Public Servants Choose RusingÂcademy',
      subtitle: 'We understand the unique challenges of language training in the federal public service',
      items: [
        {
          icon: 'Target',
          title: 'SLE-Focused Curriculum',
          desc: 'Every lesson is designed with SLE exam requirements in mind. No generic content—only what matters for your certification.',
        },
        {
          icon: 'Clock',
          title: 'Flexible Scheduling',
          desc: 'Learn on your terms. Evening sessions, weekend intensives, or lunch-hour micro-lessons that fit your busy schedule.',
        },
        {
          icon: 'Users',
          title: 'Expert Coaches',
          desc: 'Our coaches are certified SLE examiners and former public servants who understand your professional context.',
        },
        {
          icon: 'Shield',
          title: 'Guaranteed Results',
          desc: 'We stand behind our methodology. If you don\'t improve, we\'ll continue coaching you at no extra cost.',
        },
      ],
    },
  },
  fr: {
    // French translations (abbreviated for space)
    nav: { explore: 'Explorer', programs: 'Programmes', contact: 'Contact', ecosystem: 'Écosystème' },
    hero: {
      badge: 'Curriculum Path Series™',
      badgeSub: 'Formation alignée ELS pour les fonctionnaires canadiens',
      title: 'Votre Niveau C.',
      titleHighlight: 'Sans Mettre Votre Carrière sur Pause.',
      subtitle: 'Cours intensifs conçus pour les fonctionnaires fédéraux. Atteignez vos objectifs BBB, CBC ou CCC 3 à 4 fois plus rapidement.',
      cta1: 'Explorer les programmes',
      cta2: 'Réserver un diagnostic gratuit',
      trust: 'Approuvé par plus de 2 500 fonctionnaires dans plus de 40 ministères fédéraux',
    },
    stats: { learners: 'Fonctionnaires formés', faster: 'Résultats plus rapides', aligned: 'Aligné ELS/CECR', satisfaction: 'Taux de satisfaction' },
    problem: {
      title: 'La formation linguistique traditionnelle n\'a pas été conçue pour votre réalité',
      subtitle: 'La fonction publique fédérale exige des résultats. Les méthodes traditionnelles ne livrent pas.',
      comparison: {
        traditional: { title: 'Méthode Traditionnelle', items: [
          { label: 'Rythme', value: '12-24 mois pour le niveau C' },
          { label: 'Flexibilité', value: 'Horaires fixes, formats rigides' },
          { label: 'Approche', value: 'Curriculum générique' },
          { label: 'Résultats', value: 'Résultats incertains' },
        ]},
        rusingacademy: { title: 'Méthode RusingÂcademy', items: [
          { label: 'Rythme', value: '4-12 semaines pour le niveau C' },
          { label: 'Flexibilité', value: 'Votre horaire, votre rythme' },
          { label: 'Approche', value: 'Axé ELS, parcours personnalisés' },
          { label: 'Résultats', value: '95% de réussite' },
        ]},
      },
    },
    pathSeries: {
      title: 'La série GC Bilingual Path™',
      subtitle: 'Des parcours structurés pour une progression prévisible',
      description: 'Chaque parcours est méticuleusement conçu pour s\'appuyer sur le précédent.',
      paths: [
        { id: 'I', name: 'Fondations', level: 'A1', price: '899$', duration: '4 semaines', hours: '30h', desc: 'Construire les fondamentaux.', focus: 'Communication de base', tagline: 'De l\'hésitation à la communication essentielle' },
        { id: 'II', name: 'Aisance Quotidienne', level: 'A2', price: '899$', duration: '4 semaines', hours: '30h', desc: 'Interactions quotidiennes.', focus: 'Interactions professionnelles', tagline: 'Confiance dans les échanges quotidiens' },
        { id: 'III', name: 'Français Opérationnel', level: 'B1', price: '999$', duration: '4 semaines', hours: '35h', desc: 'Autonomie professionnelle.', focus: 'Tâches opérationnelles', tagline: 'Autonomie en contexte professionnel' },
        { id: 'IV', name: 'Expression Stratégique', level: 'B2', price: '1 099$', duration: '4 semaines', hours: '35h', desc: 'Communication stratégique.', focus: 'Communication stratégique', tagline: 'Maîtrise du discours professionnel nuancé' },
        { id: 'V', name: 'Maîtrise Professionnelle', level: 'C1', price: '1 199$', duration: '4 semaines', hours: '40h', desc: 'Excellence exécutive.', focus: 'Compétence de niveau exécutif', tagline: 'Excellence au niveau exécutif' },
        { id: 'VI', name: 'Accélérateur ELS', level: 'Préparation', price: '1 299$', duration: '4 semaines', hours: '40h', desc: 'Préparation intensive ELS.', focus: 'Réussite ELS', tagline: 'Votre sprint final vers la certification' },
      ],
    },
    bundles: {
      title: 'Votre carrière exige un plan. Pas juste un cours.',
      subtitle: 'Forfaits stratégiques conçus pour les professionnels ambitieux',
      items: [
        { name: 'Accès Rapide BBB', price: '2 497$', savings: 'Économisez 300$', description: 'Pour les professionnels visant BBB en 12 semaines.', includes: ['Path I + II + III', '90 heures structurées', 'Simulations ELS', 'Accès prioritaire coach'], ideal: 'Postes bilingues d\'entrée', featured: false },
        { name: 'Accès Rapide CCC', price: '4 297$', savings: 'Économisez 600$', description: 'Le parcours complet vers la maîtrise exécutive.', includes: ['Les 6 Paths (I-VI)', '220 heures structurées', 'Simulations illimitées', 'Gestionnaire de succès dédié'], ideal: 'Rôles exécutifs et de leadership', featured: true },
        { name: 'Excellence Bilingue', price: '3 497$', savings: 'Économisez 400$', description: 'Pour les professionnels prêts pour CBC ou plus.', includes: ['Path IV + V + VI', '115 heures structurées', 'Simulations avancées', 'Coaching exécutif'], ideal: 'Postes de haute direction', featured: false },
      ],
    },
    offerings: {
      title: 'Solutions d\'Apprentissage',
      subtitle: 'Formats flexibles conçus pour les professionnels occupés',
      items: [
        { icon: 'BookOpen', title: 'Cours Intensifs', desc: 'Programmes intensifs de 2-4 semaines pour une préparation ELS rapide.', features: ['Contenu axé examen', 'Sessions pratiques quotidiennes', 'Tests simulés inclus'] },
        { icon: 'Headphones', title: 'Micro-Apprentissage', desc: 'Capsules, vidéos et podcasts. Apprenez pendant votre trajet ou pause lunch.', features: ['Leçons de 5-15 minutes', 'Compatible mobile', 'Épisodes podcast'] },
        { icon: 'MessageSquare', title: 'Coaching Expert', desc: 'Sessions individuelles avec des coachs ELS certifiés.', features: ['Coachs certifiés', 'Horaires flexibles', 'Suivi des progrès'] },
      ],
    },
    testimonials: {
      title: 'Conçu pour les fonctionnaires. Approuvé par les fonctionnaires.',
      subtitle: 'Résultats réels de vrais professionnels du gouvernement fédéral',
      items: [
        { quote: 'La série Path™ a aidé toute notre équipe à atteindre ses objectifs ELS en avance.', name: 'Directeur, Direction des politiques', org: 'Ministère fédéral', level: 'CCC' },
        { quote: 'Enfin, un curriculum qui comprend les réalités de la fonction publique.', name: 'Gestionnaire RH', org: 'Société d\'État', level: 'CBC' },
        { quote: 'Notre ministère a vu une amélioration de 40% des taux de réussite ELS.', name: 'Coordonnateur de l\'apprentissage', org: 'Agence centrale', level: 'BBB' },
      ],
    },
    cta: {
      title: 'Prêt à transformer les capacités linguistiques de votre équipe?',
      subtitle: 'Obtenez un plan institutionnel personnalisé adapté aux besoins de votre ministère.',
      button1: 'Demander un plan institutionnel',
      button2: 'Nous contacter',
    },
    whyUs: {
      title: 'Pourquoi les fonctionnaires choisissent RusingÂcademy',
      subtitle: 'Nous comprenons les défis uniques de la formation linguistique dans la fonction publique fédérale',
      items: [
        { icon: 'Target', title: 'Curriculum axé ELS', desc: 'Chaque leçon est conçue avec les exigences de l\'examen ELS en tête.' },
        { icon: 'Clock', title: 'Horaires flexibles', desc: 'Apprenez selon vos termes. Sessions du soir, intensifs de fin de semaine.' },
        { icon: 'Users', title: 'Coachs experts', desc: 'Nos coachs sont des examinateurs ELS certifiés et d\'anciens fonctionnaires.' },
        { icon: 'Shield', title: 'Résultats garantis', desc: 'Nous soutenons notre méthodologie. Si vous ne progressez pas, nous continuons gratuitement.' },
      ],
    },
  },
};

const iconMap: { [key: string]: any } = {
  BookOpen,
  Headphones,
  MessageSquare,
  Target,
  Clock,
  Users,
  Shield,
};

export default function RusingAcademyLanding() {
  const [lang, setLang] = useState<'en' | 'fr'>('en');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [selectedPath, setSelectedPath] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);

  const t = labels[lang];
  const brand = brandColors.rusingacademy;

  // Premium gradient for RusingAcademy
  const premiumGradient = 'linear-gradient(135deg, #0D9488 0%, #7C3AED 50%, #DB2777 100%)';
  const subtleGradient = 'linear-gradient(135deg, rgba(13, 148, 136, 0.1) 0%, rgba(124, 58, 237, 0.1) 50%, rgba(219, 39, 119, 0.1) 100%)';

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-[#0A0A0A] text-white' : 'bg-[#FAFAF8]'}`}>
      <SEO 
        title={`RusingAcademy - Path Series™ SLE Training | RusingAcademy`}
        description="Intensive SLE preparation courses for Canadian public servants. Achieve BBB, CBC, or CCC certification 3-4x faster with our proven Path Series™ methodology."
        keywords="SLE training, French language training, public service, Level C, BBB, CBC, CCC, federal government, bilingual certification"
      />

      {/* Premium Hero Section */}
      <section 
        ref={heroRef}
        className="relative min-h-[90vh] flex items-center overflow-hidden"
      >
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div 
            className="absolute inset-0 opacity-5"
            style={{ 
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
          {/* Gradient Orbs */}
          <motion.div 
            className="absolute top-20 right-20 w-96 h-96 rounded-full blur-3xl opacity-20"
            style={{ background: premiumGradient }}
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 90, 0],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          />
          <motion.div 
            className="absolute bottom-20 left-20 w-80 h-80 rounded-full blur-3xl opacity-15"
            style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #DB2777 100%)' }}
            animate={{ 
              scale: [1.2, 1, 1.2],
              rotate: [90, 0, 90],
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Content */}
            <motion.div
              style={{ opacity: heroOpacity, scale: heroScale }}
              initial="hidden"
              animate="visible"
              variants={animationVariants.staggerContainer}
            >
              {/* Badge */}
              <motion.div 
                variants={animationVariants.fadeInUp}
                className="inline-flex flex-col gap-1 mb-6"
              >
                <div 
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-white text-sm font-semibold shadow-lg"
                  style={{ background: premiumGradient }}
                >
                  <Sparkles className="w-4 h-4" />
                  {t.hero.badge}
                </div>
                <span className="text-sm text-gray-500 ml-2">{t.hero.badgeSub}</span>
              </motion.div>

              {/* Title */}
              <motion.h1 
                variants={animationVariants.fadeInUp}
                className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6"
              >
                <span className="text-[#082038]">{t.hero.title}</span>
                <br />
                <span 
                  className="bg-clip-text text-transparent"
                  style={{ backgroundImage: premiumGradient }}
                >
                  {t.hero.titleHighlight}
                </span>
              </motion.h1>

              {/* Subtitle */}
              <motion.p 
                variants={animationVariants.fadeInUp}
                className="text-lg md:text-xl mb-8 max-w-xl text-[#4A5B66] leading-relaxed"
              >
                {t.hero.subtitle}
              </motion.p>

              {/* CTAs */}
              <motion.div 
                variants={animationVariants.fadeInUp}
                className="flex flex-wrap gap-4 mb-8"
              >
                <Link
                  href="/curriculum"
                  className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-full font-semibold text-white transition-all hover:scale-105 hover:shadow-xl shadow-lg"
                  style={{ background: premiumGradient }}
                >
                  {t.hero.cta1}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <a
                  href="https://calendly.com/steven-barholere/30min"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full font-semibold transition-all hover:scale-105 bg-white text-[#082038] border-2 border-gray-200 hover:border-gray-300 shadow-sm"
                >
                  <Calendar className="w-4 h-4" />
                  {t.hero.cta2}
                </a>
              </motion.div>

              {/* Trust Indicators */}
              <motion.div 
                variants={animationVariants.fadeInUp}
                className="flex items-center gap-4 text-sm text-[#4A5B66]"
              >
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div 
                      key={i}
                      className="w-8 h-8 rounded-full border-2 border-white bg-gradient-to-br from-teal-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold"
                    >
                      {['S', 'M', 'J', 'A'][i-1]}
                    </div>
                  ))}
                </div>
                <span>{t.hero.trust}</span>
              </motion.div>
            </motion.div>

            {/* Right - Hero Image */}
            <motion.div
              initial={{ opacity: 0, x: 50, rotateY: -10 }}
              animate={{ opacity: 1, x: 0, rotateY: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative"
            >
              {/* Glassmorphism Frame */}
              <div className="relative">
                {/* Glow Effect */}
                <div 
                  className="absolute -inset-4 rounded-3xl blur-2xl opacity-30"
                  style={{ background: premiumGradient }}
                />
                
                {/* Main Image */}
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/20">
                  <img
                    src={sectionImages.hero}
                    alt="Canadian public servants achieving bilingual excellence"
                    className="w-full aspect-[4/3] object-cover"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&h=600&fit=crop';
                    }}
                  />
                  
                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                </div>

                {/* Floating Stats Card */}
                <motion.div 
                  className="absolute -bottom-6 -left-6 p-4 rounded-2xl shadow-xl bg-white/90 backdrop-blur-xl border border-white/50"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  <div className="flex items-center gap-4">
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{ background: premiumGradient }}
                    >
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-3xl font-bold bg-clip-text text-transparent" style={{ backgroundImage: premiumGradient }}>
                        3-4x
                      </p>
                      <p className="text-xs text-[#4A5B66] font-medium">
                        Faster Results
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* Floating Badge */}
                <motion.div 
                  className="absolute -top-4 -right-4 px-4 py-2 rounded-full shadow-xl bg-white/90 backdrop-blur-xl border border-white/50"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1 }}
                >
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      ))}
                    </div>
                    <span className="text-sm font-semibold text-[#082038]">95% Success</span>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section - Premium Glass Cards */}
      <section className="py-16 relative overflow-hidden">
        <div 
          className="absolute inset-0 opacity-50"
          style={{ background: subtleGradient }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={animationVariants.staggerContainer}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6"
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
                className="group relative p-6 rounded-2xl bg-white/80 backdrop-blur-xl border border-white/50 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
              >
                <div 
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background: subtleGradient }}
                />
                <div className="relative">
                  <stat.icon 
                    className="w-8 h-8 mb-3" 
                    style={{ color: '#0D9488' }} 
                  />
                  <p 
                    className="text-3xl font-bold mb-1 bg-clip-text text-transparent"
                    style={{ backgroundImage: premiumGradient }}
                  >
                    {stat.value}
                  </p>
                  <p className="text-sm text-[#4A5B66] font-medium">
                    {stat.label}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={animationVariants.fadeInUp}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#082038]">
              {t.whyUs.title}
            </h2>
            <p className="text-lg max-w-2xl mx-auto text-[#4A5B66]">
              {t.whyUs.subtitle}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {t.whyUs.items.map((item, index) => {
              const Icon = iconMap[item.icon];
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative p-6 rounded-2xl bg-gradient-to-br from-gray-50 to-white border border-gray-100 hover:border-teal-200 transition-all hover:shadow-lg"
                >
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"
                    style={{ background: premiumGradient }}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold mb-2 text-[#082038]">{item.title}</h3>
                  <p className="text-sm text-[#4A5B66] leading-relaxed">{item.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Problem Section - Enhanced Comparison */}
      <section className="py-20 bg-[#FAFAF8]">
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
              className="p-8 rounded-3xl bg-gray-100 border border-gray-200 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gray-200 rounded-full blur-3xl opacity-50" />
              <div className="relative">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center">
                    <X className="w-6 h-6 text-gray-500" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-600">
                    {t.problem.comparison.traditional.title}
                  </h3>
                </div>
                <div className="space-y-4">
                  {t.problem.comparison.traditional.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center py-3 border-b border-gray-200 last:border-0">
                      <span className="text-gray-500 font-medium">{item.label}</span>
                      <span className="text-gray-600 text-right">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* RusingAcademy Method */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="p-8 rounded-3xl relative overflow-hidden border-2"
              style={{ 
                background: 'linear-gradient(135deg, rgba(13, 148, 136, 0.05) 0%, rgba(124, 58, 237, 0.05) 50%, rgba(219, 39, 119, 0.05) 100%)',
                borderColor: '#0D9488'
              }}
            >
              <div 
                className="absolute top-0 right-0 w-40 h-40 rounded-full blur-3xl opacity-20"
                style={{ background: premiumGradient }}
              />
              <div className="relative">
                <div className="flex items-center gap-3 mb-6">
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ background: premiumGradient }}
                  >
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <h3 
                    className="text-xl font-bold bg-clip-text text-transparent"
                    style={{ backgroundImage: premiumGradient }}
                  >
                    {t.problem.comparison.rusingacademy.title}
                  </h3>
                </div>
                <div className="space-y-4">
                  {t.problem.comparison.rusingacademy.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center py-3 border-b border-teal-200/50 last:border-0">
                      <span className="font-medium text-[#082038]">{item.label}</span>
                      <span 
                        className="font-semibold text-right bg-clip-text text-transparent"
                        style={{ backgroundImage: premiumGradient }}
                      >
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Path Series Section - Premium Cards with Images */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div 
          className="absolute inset-0 opacity-30"
          style={{ background: subtleGradient }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={animationVariants.fadeInUp}
            className="text-center mb-12"
          >
            <div 
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-white text-sm font-semibold mb-4"
              style={{ background: premiumGradient }}
            >
              <GraduationCap className="w-4 h-4" />
              Structured Learning Paths
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#082038]">
              {t.pathSeries.title}
            </h2>
            <p className="text-lg max-w-3xl mx-auto text-[#4A5B66]">
              {t.pathSeries.description}
            </p>
          </motion.div>

          {/* Path Navigation */}
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {t.pathSeries.paths.map((path, index) => (
              <button
                key={index}
                onClick={() => setSelectedPath(index)}
                className={`relative px-5 py-2.5 rounded-full font-semibold transition-all ${
                  selectedPath === index
                    ? 'text-white shadow-lg scale-105'
                    : 'bg-white text-[#082038] border border-gray-200 hover:border-teal-300 hover:bg-gray-50'
                }`}
                style={selectedPath === index ? { background: premiumGradient } : {}}
              >
                <span className="flex items-center gap-2">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    selectedPath === index ? 'bg-white/20' : 'bg-gray-100'
                  }`}>
                    {path.id}
                  </span>
                  {path.name}
                </span>
              </button>
            ))}
          </div>

          {/* Selected Path Detail Card */}
          <motion.div
            key={selectedPath}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="max-w-5xl mx-auto"
          >
            <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                {/* Image Side */}
                <div className="relative h-64 lg:h-auto">
                  <img
                    src={pathImages[t.pathSeries.paths[selectedPath].id as keyof typeof pathImages]}
                    alt={t.pathSeries.paths[selectedPath].name}
                    className="absolute inset-0 w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&h=600&fit=crop';
                    }}
                  />
                  <div 
                    className="absolute inset-0"
                    style={{ background: 'linear-gradient(135deg, rgba(13, 148, 136, 0.3) 0%, rgba(124, 58, 237, 0.3) 100%)' }}
                  />
                  <div className="absolute bottom-6 left-6 right-6">
                    <p className="text-white/80 text-sm font-medium mb-1">Path {t.pathSeries.paths[selectedPath].id}</p>
                    <p className="text-white text-xl font-bold italic">
                      "{t.pathSeries.paths[selectedPath].tagline}"
                    </p>
                  </div>
                </div>

                {/* Content Side */}
                <div className="p-8 lg:p-10">
                  <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span 
                          className="px-3 py-1 rounded-full text-sm font-bold text-white"
                          style={{ background: premiumGradient }}
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
                      <p 
                        className="text-3xl font-bold bg-clip-text text-transparent"
                        style={{ backgroundImage: premiumGradient }}
                      >
                        {t.pathSeries.paths[selectedPath].price}
                      </p>
                      <p className="text-sm text-[#4A5B66]">CAD</p>
                    </div>
                  </div>

                  <p className="text-lg text-[#4A5B66] mb-8 leading-relaxed">
                    {t.pathSeries.paths[selectedPath].desc}
                  </p>

                  <div className="grid grid-cols-3 gap-4 mb-8">
                    <div className="text-center p-4 bg-gray-50 rounded-xl">
                      <Calendar className="w-6 h-6 mx-auto mb-2 text-teal-600" />
                      <p className="font-bold text-[#082038]">{t.pathSeries.paths[selectedPath].duration}</p>
                      <p className="text-xs text-[#4A5B66]">Duration</p>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-xl">
                      <Clock className="w-6 h-6 mx-auto mb-2 text-purple-600" />
                      <p className="font-bold text-[#082038]">{t.pathSeries.paths[selectedPath].hours}</p>
                      <p className="text-xs text-[#4A5B66]">Structured Hours</p>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-xl">
                      <Target className="w-6 h-6 mx-auto mb-2 text-pink-600" />
                      <p className="font-bold text-[#082038] text-sm">{t.pathSeries.paths[selectedPath].focus}</p>
                      <p className="text-xs text-[#4A5B66]">Focus</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4">
                    <a
                      href="https://calendly.com/steven-barholere/30min"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-white transition-all hover:scale-105 shadow-lg"
                      style={{ background: premiumGradient }}
                    >
                      Enroll Now
                      <ArrowRight className="w-4 h-4" />
                    </a>
                    <Link
                      href="/curriculum"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all hover:scale-105 bg-white text-[#082038] border border-gray-200 hover:border-gray-300"
                    >
                      View Full Curriculum
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Path Progress Indicator */}
          <div className="flex justify-center mt-10">
            <div className="flex items-center gap-2 p-2 bg-white rounded-full shadow-lg border border-gray-100">
              {t.pathSeries.paths.map((path, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedPath(index)}
                  className={`relative flex flex-col items-center transition-all ${
                    index <= selectedPath ? 'opacity-100' : 'opacity-40'
                  }`}
                >
                  <div 
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                      selectedPath === index
                        ? 'text-white scale-110 shadow-lg'
                        : index < selectedPath
                        ? 'bg-teal-100 text-teal-600'
                        : 'bg-gray-100 text-gray-400'
                    }`}
                    style={selectedPath === index ? { background: premiumGradient } : {}}
                  >
                    {path.id}
                  </div>
                  <span className="text-xs mt-1 font-medium text-gray-500 hidden sm:block">
                    {path.level}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Bundles Section */}
      <section className="py-20 bg-[#FAFAF8]">
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {t.bundles.items.map((bundle, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`relative p-8 rounded-3xl transition-all hover:-translate-y-2 ${
                  bundle.featured
                    ? 'bg-white shadow-2xl border-2 scale-105 z-10'
                    : 'bg-white shadow-lg border border-gray-100'
                }`}
                style={bundle.featured ? { borderColor: '#0D9488' } : {}}
              >
                {bundle.featured && (
                  <div 
                    className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-white text-sm font-bold shadow-lg"
                    style={{ background: premiumGradient }}
                  >
                    Most Popular
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-xl font-bold text-[#082038] mb-2">{bundle.name}</h3>
                  <p className="text-sm text-[#4A5B66]">{bundle.description}</p>
                </div>

                <div className="mb-6">
                  <div className="flex items-baseline gap-2">
                    <span 
                      className="text-4xl font-bold bg-clip-text text-transparent"
                      style={{ backgroundImage: premiumGradient }}
                    >
                      {bundle.price}
                    </span>
                    <span className="text-sm text-[#4A5B66]">CAD</span>
                  </div>
                  <span 
                    className="inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold text-teal-700 bg-teal-50"
                  >
                    {bundle.savings}
                  </span>
                </div>

                <ul className="space-y-3 mb-8">
                  {bundle.includes.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 flex-shrink-0 text-teal-500" />
                      <span className="text-sm text-[#4A5B66]">{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="pt-4 border-t border-gray-100">
                  <p className="text-xs text-[#4A5B66] mb-4">
                    <strong>Ideal for:</strong> {bundle.ideal}
                  </p>
                  <a
                    href="https://calendly.com/steven-barholere/30min"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-semibold transition-all hover:scale-105 ${
                      bundle.featured
                        ? 'text-white shadow-lg'
                        : 'bg-gray-100 text-[#082038] hover:bg-gray-200'
                    }`}
                    style={bundle.featured ? { background: premiumGradient } : {}}
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
      <section className="py-20 bg-white">
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {t.offerings.items.map((item, index) => {
              const Icon = iconMap[item.icon];
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative p-8 rounded-3xl bg-gradient-to-br from-gray-50 to-white border border-gray-100 hover:border-teal-200 transition-all hover:shadow-xl"
                >
                  <div 
                    className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity"
                    style={{ background: premiumGradient }}
                  />
                  
                  <div 
                    className="relative w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"
                    style={{ background: premiumGradient }}
                  >
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-bold mb-3 text-[#082038]">
                    {item.title}
                  </h3>
                  <p className="mb-6 text-[#4A5B66] leading-relaxed">
                    {item.desc}
                  </p>
                  
                  <ul className="space-y-3">
                    {item.features.map((feature, fIndex) => (
                      <li key={fIndex} className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 flex-shrink-0 text-teal-500" />
                        <span className="text-sm text-[#4A5B66]">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section with Success Image */}
      <section className="py-20 bg-[#FAFAF8] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Image Side */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div 
                className="absolute -inset-4 rounded-3xl blur-2xl opacity-20"
                style={{ background: premiumGradient }}
              />
              <img
                src={sectionImages.success}
                alt="Student success transformation"
                className="relative rounded-3xl shadow-2xl w-full"
                onError={(e) => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&h=600&fit=crop';
                }}
              />
            </motion.div>

            {/* Content Side */}
            <div>
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={animationVariants.fadeInUp}
                className="mb-10"
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#082038]">
                  {t.testimonials.title}
                </h2>
                <p className="text-lg text-[#4A5B66]">
                  {t.testimonials.subtitle}
                </p>
              </motion.div>

              <div className="space-y-6">
                {t.testimonials.items.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all"
                  >
                    <div className="flex items-start gap-4">
                      <Quote className="w-8 h-8 text-teal-500 flex-shrink-0 mt-1" />
                      <div>
                        <p className="mb-4 text-[#4A5B66] italic leading-relaxed">
                          "{item.quote}"
                        </p>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-[#082038]">{item.name}</p>
                            <p className="text-sm text-[#4A5B66]">{item.org}</p>
                          </div>
                          <span 
                            className="px-3 py-1 rounded-full text-xs font-bold text-white"
                            style={{ background: premiumGradient }}
                          >
                            {item.level}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section 
        className="py-24 relative overflow-hidden"
        style={{ background: premiumGradient }}
      >
        <div className="absolute inset-0 opacity-10">
          <div 
            className="absolute inset-0"
            style={{ 
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={animationVariants.fadeInUp}
          >
            <Building2 className="w-12 h-12 mx-auto mb-6 text-white/80" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              {t.cta.title}
            </h2>
            <p className="text-lg mb-8 text-white/80 max-w-2xl mx-auto">
              {t.cta.subtitle}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="https://calendly.com/steven-barholere/30min"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold transition-all hover:scale-105 bg-white text-[#082038] shadow-xl"
              >
                {t.cta.button1}
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="https://calendly.com/steven-barholere/30min"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold transition-all hover:scale-105 bg-white/10 text-white border-2 border-white/30 hover:bg-white/20"
              >
                {t.cta.button2}
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Cross-Ecosystem Section */}
      <CrossEcosystemSection variant="rusingacademy" />

      {/* Footer */}
      <EcosystemFooter lang={lang} theme={theme} activeBrand="rusingacademy" />
    </div>
  );
}
