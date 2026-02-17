import { useState, useRef } from 'react';
import { Link } from 'wouter';
import { trpc } from '@/lib/trpc';
import { useAuth } from '@/_core/hooks/useAuth';
import { getLoginUrl } from '@/const';
import { toast } from 'sonner';
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
  Quote,
  Gift,
  BadgeCheck,
  Flame
} from 'lucide-react';
import { brandColors, animationVariants, transitions } from '../lib/ecosystem-design-system';
import { FREE_ACCESS_MODE } from '@shared/const';

// Course IDs mapping to Stripe products
const COURSE_IDS: Record<string, string> = {
  'I': 'path-i-foundations',
  'II': 'path-ii-everyday-fluency',
  'III': 'path-iii-operational-french',
  'IV': 'path-iv-strategic-expression',
  'V': 'path-v-professional-mastery',
  'VI': 'path-vi-sle-accelerator',
};

// ESL Course IDs mapping
const ESL_COURSE_IDS: Record<string, string> = {
  'I': 'esl-path-i-foundations',
  'II': 'esl-path-ii-everyday-fluency',
  'III': 'esl-path-iii-operational-english',
  'IV': 'esl-path-iv-strategic-expression',
  'V': 'esl-path-v-professional-mastery',
  'VI': 'esl-path-vi-sle-accelerator',
};

// Bundle IDs for Stripe
const BUNDLE_IDS: Record<string, string> = {
  'Fast Track to BBB': 'bundle-bbb',
  'Fast Track to CCC': 'bundle-ccc',
  'Bilingual Excellence': 'bundle-excellence',
};
import FooterInstitutional from '../components/FooterInstitutional';
import CrossEcosystemSection from '../components/CrossEcosystemSection';

// Path Series Images
const pathImages = {
  I: 'https://rusingacademy-cdn.b-cdn.net/images/paths/path_a1_foundations.jpg',
  II: 'https://rusingacademy-cdn.b-cdn.net/images/paths/path_a2_everyday.jpg',
  III: 'https://rusingacademy-cdn.b-cdn.net/images/paths/path_b1_operational.jpg',
  IV: 'https://rusingacademy-cdn.b-cdn.net/images/paths/path_b2_strategic.jpg',
  V: 'https://rusingacademy-cdn.b-cdn.net/images/paths/path_c1_mastery.jpg',
  VI: 'https://rusingacademy-cdn.b-cdn.net/images/paths/path_c2_exam.jpg',
};

const eslPathImages: Record<string, string> = {
  I: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663049070748/mWXkegcWYUfijenP.jpg',
  II: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663049070748/yVakVXrTORsdWkJF.jpg',
  III: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663049070748/ZspFeksHPRsjMTDW.jpg',
  IV: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663049070748/CXFvnHyTmdKoNgBP.jpg',
  V: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663049070748/wZgtyHoCNkSCrNZZ.jpg',
  VI: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663049070748/fCEBrFnJxVPoRNSh.jpg',
};

// Section Images
const sectionImages = {
  hero: 'https://rusingacademy-cdn.b-cdn.net/images/paths/hero_bilingual_excellence.jpg',
  success: 'https://rusingacademy-cdn.b-cdn.net/images/paths/success_transformation.jpg',
  coaching: 'https://rusingacademy-cdn.b-cdn.net/images/paths/section_expert_coaching.jpg',
  paths: 'https://rusingacademy-cdn.b-cdn.net/images/paths/section_structured_paths.jpg',
  bilingual: 'https://rusingacademy-cdn.b-cdn.net/images/paths/section_bilingual_support.jpg',
};

// Coaching Package Images
const coachingImages = {
  boost: 'https://rusingacademy-cdn.b-cdn.net/images/paths/coaching_boost.jpg',
  mastery: 'https://rusingacademy-cdn.b-cdn.net/images/paths/coaching_mastery.jpg',
  progressive: 'https://rusingacademy-cdn.b-cdn.net/images/paths/coaching_progressive.jpg',
  quickprep: 'https://rusingacademy-cdn.b-cdn.net/images/paths/coaching_quickprep.jpg',
};

const labels = {
  en: {
    nav: {
      explore: 'Explore',
      programs: 'Programs',
      contact: 'Contact',
      ecosystem: 'Ecosystem',
    },
    promo: {
      banner: 'Limited Time Offer',
      badge: 'FREE ACCESS',
      tagline: 'All courses are temporarily free — Start your bilingual journey today!',
      originalPrice: 'Regular price',
      freeLabel: 'FREE',
      promoNote: 'Limited-time promotional access. No credit card required.',
    },
    hero: {
      badge: 'Path Series\u2122 Curriculum',
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
          title: 'Rusing\u00c2cademy Method',
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
      title: 'The GC Bilingual Path Series\u2122',
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
          quote: 'The Path Series\u2122 helped our entire team achieve their SLE goals ahead of schedule. The structured approach made all the difference.',
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
    eslPathSeries: {
      title: 'ESL Path Series\u2122',
      subtitle: 'English Training for Federal Success',
      description: 'Six progressive English courses designed for Canadian public servants preparing for SLE English certification.',
      paths: [
        { id: 'I', name: 'Foundations', level: 'A1', price: '$899', duration: '4 weeks', hours: '30h', desc: 'Build core English fundamentals. Basic communication, presentations, essential emails.', focus: 'Basic workplace communication', tagline: 'From hesitation to essential English communication' },
        { id: 'II', name: 'Everyday Fluency', level: 'A2', price: '$899', duration: '4 weeks', hours: '30h', desc: 'Daily interactions, informal conversations, oral comprehension in English.', focus: 'Everyday professional interactions', tagline: 'Confidence in daily English exchanges' },
        { id: 'III', name: 'Operational English', level: 'B1', price: '$999', duration: '4 weeks', hours: '35h', desc: 'Professional autonomy, report writing, meeting participation in English.', focus: 'Operational workplace tasks', tagline: 'Autonomy in professional English contexts' },
        { id: 'IV', name: 'Strategic Expression', level: 'B2', price: '$1,099', duration: '4 weeks', hours: '35h', desc: 'Strategic communication, argumentation, negotiation in English.', focus: 'Strategic communication skills', tagline: 'Mastering nuanced professional English discourse' },
        { id: 'V', name: 'Professional Mastery', level: 'C1', price: '$1,199', duration: '4 weeks', hours: '40h', desc: 'Executive excellence, linguistic nuances, high-level presentations in English.', focus: 'Executive-level proficiency', tagline: 'Excellence at the executive level in English' },
        { id: 'VI', name: 'SLE Exam Accelerator', level: 'Exam Prep', price: '$1,299', duration: '4 weeks', hours: '40h', desc: 'Intensive SLE exam preparation in English: reading, writing, oral.', focus: 'SLE exam success', tagline: 'Your final sprint to English certification' },
      ],
    },
    whyUs: {
      title: 'Why Public Servants Choose Rusing\u00c2cademy',
      subtitle: 'We understand the unique challenges of language training in the federal public service',
      items: [
        {
          icon: 'Target',
          title: 'SLE-Focused Curriculum',
          desc: 'Every lesson is designed with SLE exam requirements in mind. No generic content\u2014only what matters for your certification.',
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
    nav: { explore: 'Explorer', programs: 'Programmes', contact: 'Contact', ecosystem: '\u00c9cosyst\u00e8me' },
    promo: {
      banner: 'Offre \u00e0 dur\u00e9e limit\u00e9e',
      badge: 'ACC\u00c8S GRATUIT',
      tagline: 'Tous les cours sont temporairement gratuits \u2014 Commencez votre parcours bilingue d\u00e8s aujourd\'hui!',
      originalPrice: 'Prix r\u00e9gulier',
      freeLabel: 'GRATUIT',
      promoNote: 'Acc\u00e8s promotionnel \u00e0 dur\u00e9e limit\u00e9e. Aucune carte de cr\u00e9dit requise.',
    },
    hero: {
      badge: 'Curriculum Path Series\u2122',
      badgeSub: 'Formation align\u00e9e ELS pour les fonctionnaires canadiens',
      title: 'Votre Niveau C.',
      titleHighlight: 'Sans Mettre Votre Carri\u00e8re sur Pause.',
      subtitle: 'Cours intensifs con\u00e7us pour les fonctionnaires f\u00e9d\u00e9raux. Atteignez vos objectifs BBB, CBC ou CCC 3 \u00e0 4 fois plus rapidement.',
      cta1: 'Explorer les programmes',
      cta2: 'R\u00e9server un diagnostic gratuit',
      trust: 'Approuv\u00e9 par plus de 2 500 fonctionnaires dans plus de 40 minist\u00e8res f\u00e9d\u00e9raux',
    },
    stats: { learners: 'Fonctionnaires form\u00e9s', faster: 'R\u00e9sultats plus rapides', aligned: 'Align\u00e9 ELS/CECR', satisfaction: 'Taux de satisfaction' },
    problem: {
      title: 'La formation linguistique traditionnelle n\'a pas \u00e9t\u00e9 con\u00e7ue pour votre r\u00e9alit\u00e9',
      subtitle: 'La fonction publique f\u00e9d\u00e9rale exige des r\u00e9sultats. Les m\u00e9thodes traditionnelles ne livrent pas.',
      comparison: {
        traditional: { title: 'M\u00e9thode Traditionnelle', items: [
          { label: 'Rythme', value: '12-24 mois pour le niveau C' },
          { label: 'Flexibilit\u00e9', value: 'Horaires fixes, formats rigides' },
          { label: 'Approche', value: 'Curriculum g\u00e9n\u00e9rique' },
          { label: 'R\u00e9sultats', value: 'R\u00e9sultats incertains' },
        ]},
        rusingacademy: { title: 'M\u00e9thode Rusing\u00c2cademy', items: [
          { label: 'Rythme', value: '4-12 semaines pour le niveau C' },
          { label: 'Flexibilit\u00e9', value: 'Votre horaire, votre rythme' },
          { label: 'Approche', value: 'Ax\u00e9 ELS, parcours personnalis\u00e9s' },
          { label: 'R\u00e9sultats', value: '95% de r\u00e9ussite' },
        ]},
      },
    },
    pathSeries: {
      title: 'La s\u00e9rie GC Bilingual Path\u2122',
      subtitle: 'Des parcours structur\u00e9s pour une progression pr\u00e9visible',
      description: 'Chaque parcours est m\u00e9ticuleusement con\u00e7u pour s\'appuyer sur le pr\u00e9c\u00e9dent.',
      paths: [
        { id: 'I', name: 'Fondations', level: 'A1', price: '899$', duration: '4 semaines', hours: '30h', desc: 'Construire les fondamentaux.', focus: 'Communication de base', tagline: 'De l\'h\u00e9sitation \u00e0 la communication essentielle' },
        { id: 'II', name: 'Aisance Quotidienne', level: 'A2', price: '899$', duration: '4 semaines', hours: '30h', desc: 'Interactions quotidiennes.', focus: 'Interactions professionnelles', tagline: 'Confiance dans les \u00e9changes quotidiens' },
        { id: 'III', name: 'Fran\u00e7ais Op\u00e9rationnel', level: 'B1', price: '999$', duration: '4 semaines', hours: '35h', desc: 'Autonomie professionnelle.', focus: 'T\u00e2ches op\u00e9rationnelles', tagline: 'Autonomie en contexte professionnel' },
        { id: 'IV', name: 'Expression Strat\u00e9gique', level: 'B2', price: '1 099$', duration: '4 semaines', hours: '35h', desc: 'Communication strat\u00e9gique.', focus: 'Communication strat\u00e9gique', tagline: 'Ma\u00eetrise du discours professionnel nuanc\u00e9' },
        { id: 'V', name: 'Ma\u00eetrise Professionnelle', level: 'C1', price: '1 199$', duration: '4 semaines', hours: '40h', desc: 'Excellence ex\u00e9cutive.', focus: 'Comp\u00e9tence de niveau ex\u00e9cutif', tagline: 'Excellence au niveau ex\u00e9cutif' },
        { id: 'VI', name: 'Acc\u00e9l\u00e9rateur ELS', level: 'Pr\u00e9paration', price: '1 299$', duration: '4 semaines', hours: '40h', desc: 'Pr\u00e9paration intensive ELS.', focus: 'R\u00e9ussite ELS', tagline: 'Votre sprint final vers la certification' },
      ],
    },
    bundles: {
      title: 'Votre carri\u00e8re exige un plan. Pas juste un cours.',
      subtitle: 'Forfaits strat\u00e9giques con\u00e7us pour les professionnels ambitieux',
      items: [
        { name: 'Acc\u00e8s Rapide BBB', price: '2 497$', savings: '\u00c9conomisez 300$', description: 'Pour les professionnels visant BBB en 12 semaines.', includes: ['Path I + II + III', '90 heures structur\u00e9es', 'Simulations ELS', 'Acc\u00e8s prioritaire coach'], ideal: 'Postes bilingues d\'entr\u00e9e', featured: false },
        { name: 'Acc\u00e8s Rapide CCC', price: '4 297$', savings: '\u00c9conomisez 600$', description: 'Le parcours complet vers la ma\u00eetrise ex\u00e9cutive.', includes: ['Les 6 Paths (I-VI)', '220 heures structur\u00e9es', 'Simulations illimit\u00e9es', 'Gestionnaire de succ\u00e8s d\u00e9di\u00e9'], ideal: 'R\u00f4les ex\u00e9cutifs et de leadership', featured: true },
        { name: 'Excellence Bilingue', price: '3 497$', savings: '\u00c9conomisez 400$', description: 'Pour les professionnels pr\u00eats pour CBC ou plus.', includes: ['Path IV + V + VI', '115 heures structur\u00e9es', 'Simulations avanc\u00e9es', 'Coaching ex\u00e9cutif'], ideal: 'Postes de haute direction', featured: false },
      ],
    },
    offerings: {
      title: 'Solutions d\'Apprentissage',
      subtitle: 'Formats flexibles con\u00e7us pour les professionnels occup\u00e9s',
      items: [
        { icon: 'BookOpen', title: 'Cours Intensifs', desc: 'Programmes intensifs de 2-4 semaines pour une pr\u00e9paration ELS rapide.', features: ['Contenu ax\u00e9 examen', 'Sessions pratiques quotidiennes', 'Tests simul\u00e9s inclus'] },
        { icon: 'Headphones', title: 'Micro-Apprentissage', desc: 'Capsules, vid\u00e9os et podcasts. Apprenez pendant votre trajet ou pause lunch.', features: ['Le\u00e7ons de 5-15 minutes', 'Compatible mobile', '\u00c9pisodes podcast'] },
        { icon: 'MessageSquare', title: 'Coaching Expert', desc: 'Sessions individuelles avec des coachs ELS certifi\u00e9s.', features: ['Coachs certifi\u00e9s', 'Horaires flexibles', 'Suivi des progr\u00e8s'] },
      ],
    },
    testimonials: {
      title: 'Con\u00e7u pour les fonctionnaires. Approuv\u00e9 par les fonctionnaires.',
      subtitle: 'R\u00e9sultats r\u00e9els de vrais professionnels du gouvernement f\u00e9d\u00e9ral',
      items: [
        { quote: 'La s\u00e9rie Path\u2122 a aid\u00e9 toute notre \u00e9quipe \u00e0 atteindre ses objectifs ELS en avance.', name: 'Directeur, Direction des politiques', org: 'Minist\u00e8re f\u00e9d\u00e9ral', level: 'CCC' },
        { quote: 'Enfin, un curriculum qui comprend les r\u00e9alit\u00e9s de la fonction publique.', name: 'Gestionnaire RH', org: 'Soci\u00e9t\u00e9 d\'\u00c9tat', level: 'CBC' },
        { quote: 'Notre minist\u00e8re a vu une am\u00e9lioration de 40% des taux de r\u00e9ussite ELS.', name: 'Coordonnateur de l\'apprentissage', org: 'Agence centrale', level: 'BBB' },
      ],
    },
    cta: {
      title: 'Pr\u00eat \u00e0 transformer les capacit\u00e9s linguistiques de votre \u00e9quipe?',
      subtitle: 'Obtenez un plan institutionnel personnalis\u00e9 adapt\u00e9 aux besoins de votre minist\u00e8re.',
      button1: 'Demander un plan institutionnel',
      button2: 'Nous contacter',
    },
    eslPathSeries: {
      title: 'S\u00e9rie ESL Path\u2122',
      subtitle: 'Formation en anglais pour la r\u00e9ussite f\u00e9d\u00e9rale',
      description: 'Six cours d\'anglais progressifs con\u00e7us pour les fonctionnaires canadiens pr\u00e9parant la certification ELS en anglais.',
      paths: [
        { id: 'I', name: 'Fondations', level: 'A1', price: '899$', duration: '4 semaines', hours: '30h', desc: 'Construire les fondamentaux en anglais.', focus: 'Communication de base', tagline: 'De l\'h\u00e9sitation \u00e0 la communication essentielle en anglais' },
        { id: 'II', name: 'Aisance Quotidienne', level: 'A2', price: '899$', duration: '4 semaines', hours: '30h', desc: 'Interactions quotidiennes en anglais.', focus: 'Interactions professionnelles', tagline: 'Confiance dans les \u00e9changes quotidiens en anglais' },
        { id: 'III', name: 'Anglais Op\u00e9rationnel', level: 'B1', price: '999$', duration: '4 semaines', hours: '35h', desc: 'Autonomie professionnelle en anglais.', focus: 'T\u00e2ches op\u00e9rationnelles', tagline: 'Autonomie en contexte professionnel anglais' },
        { id: 'IV', name: 'Expression Strat\u00e9gique', level: 'B2', price: '1 099$', duration: '4 semaines', hours: '35h', desc: 'Communication strat\u00e9gique en anglais.', focus: 'Communication strat\u00e9gique', tagline: 'Ma\u00eetrise du discours professionnel nuanc\u00e9 en anglais' },
        { id: 'V', name: 'Ma\u00eetrise Professionnelle', level: 'C1', price: '1 199$', duration: '4 semaines', hours: '40h', desc: 'Excellence ex\u00e9cutive en anglais.', focus: 'Comp\u00e9tence de niveau ex\u00e9cutif', tagline: 'Excellence au niveau ex\u00e9cutif en anglais' },
        { id: 'VI', name: 'Acc\u00e9l\u00e9rateur ELS', level: 'Pr\u00e9paration', price: '1 299$', duration: '4 semaines', hours: '40h', desc: 'Pr\u00e9paration intensive ELS en anglais.', focus: 'R\u00e9ussite ELS', tagline: 'Votre sprint final vers la certification anglaise' },
      ],
    },
    whyUs: {
      title: 'Pourquoi les fonctionnaires choisissent Rusing\u00c2cademy',
      subtitle: 'Nous comprenons les d\u00e9fis uniques de la formation linguistique dans la fonction publique f\u00e9d\u00e9rale',
      items: [
        { icon: 'Target', title: 'Curriculum ax\u00e9 ELS', desc: 'Chaque le\u00e7on est con\u00e7ue avec les exigences de l\'examen ELS en t\u00eate.' },
        { icon: 'Clock', title: 'Horaires flexibles', desc: 'Apprenez selon vos termes. Sessions du soir, intensifs de fin de semaine.' },
        { icon: 'Users', title: 'Coachs experts', desc: 'Nos coachs sont des examinateurs ELS certifi\u00e9s et d\'anciens fonctionnaires.' },
        { icon: 'Shield', title: 'R\u00e9sultats garantis', desc: 'Nous soutenons notre m\u00e9thodologie. Si vous ne progressez pas, nous continuons gratuitement.' },
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

// ─── Price Display Component ────────────────────────────────────────────────
function PriceDisplay({ originalPrice, lang, size = 'md' }: { originalPrice: string; lang: 'en' | 'fr'; size?: 'sm' | 'md' | 'lg' }) {
  const freeLabel = lang === 'fr' ? 'GRATUIT' : 'FREE';
  const sizeClasses = {
    sm: { original: 'text-base', free: 'text-2xl' },
    md: { original: 'text-xl', free: 'text-3xl' },
    lg: { original: 'text-2xl', free: 'text-4xl' },
  };
  
  if (!FREE_ACCESS_MODE) {
    return (
      <span className={`${sizeClasses[size].free} font-bold bg-clip-text text-transparent`} style={{ backgroundImage: 'linear-gradient(135deg, #0D9488 0%, #7C3AED 50%, #DB2777 100%)' }}>
        {originalPrice}
      </span>
    );
  }
  
  return (
    <div className="flex flex-col items-end">
      <span className={`${sizeClasses[size].original} font-medium text-gray-400 line-through decoration-red-500 decoration-2`}>
        {originalPrice} <span className="text-xs">CAD</span>
      </span>
      <div className="flex items-center gap-2 mt-1">
        <span className={`${sizeClasses[size].free} font-extrabold text-emerald-600`}>
          {freeLabel}
        </span>
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
        </span>
      </div>
    </div>
  );
}

// ─── Promo Banner Component ─────────────────────────────────────────────────
function PromoBanner({ lang }: { lang: 'en' | 'fr' }) {
  const t = labels[lang].promo;
  if (!FREE_ACCESS_MODE) return null;
  
  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      className="relative overflow-hidden"
    >
      <div 
        className="relative py-3 px-4"
        style={{ background: 'linear-gradient(135deg, var(--semantic-success, #059669) 0%, #0D9488 50%, #0891B2 100%)' }}
      >
        {/* Animated shimmer */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute inset-0 opacity-20"
            style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)' }}
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          />
        </div>
        
        <div className="relative flex items-center justify-center gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <Gift className="w-5 h-5 text-yellow-300" />
            <span className="text-white font-bold text-sm uppercase tracking-wider">{t.banner}</span>
          </div>
          <div className="hidden sm:block w-px h-4 bg-white dark:bg-slate-900/30" />
          <span className="text-white/95 text-sm font-medium">{t.tagline}</span>
          <div className="hidden sm:block w-px h-4 bg-white dark:bg-slate-900/30" />
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white dark:bg-slate-900/20 backdrop-blur-sm text-white text-xs font-bold border border-white/30">
            <Flame className="w-3.5 h-3.5 text-yellow-300" />
            {t.badge}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export default function RusingAcademyLanding() {
  const [lang, setLang] = useState<'en' | 'fr'>('en');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [selectedPath, setSelectedPath] = useState(0);
  const [programTab, setProgramTab] = useState<'fsl' | 'esl'>('fsl');
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

  // Authentication
  const { user, isAuthenticated } = useAuth();
  const [enrollingCourse, setEnrollingCourse] = useState<string | null>(null);

  // Stripe checkout mutation
  const purchaseCourseMutation = trpc.stripe.createCourseCheckout.useMutation({
    onSuccess: (data) => {
      toast.success('Redirecting to checkout...');
      window.open(data.url, '_blank');
      setEnrollingCourse(null);
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create checkout session');
      setEnrollingCourse(null);
    },
  });

  // Handle course enrollment
  const handleEnroll = (pathId: string) => {
    if (!isAuthenticated || !user) {
      toast.info('Please login to enroll in courses');
      window.location.href = getLoginUrl();
      return;
    }

    const courseId = programTab === 'esl' ? ESL_COURSE_IDS[pathId] : COURSE_IDS[pathId];
    if (!courseId) {
      toast.error('Course not found');
      return;
    }

    if (FREE_ACCESS_MODE) {
      // In free access mode, redirect to the path detail page
      window.location.href = `/paths/${courseId}`;
      return;
    }

    setEnrollingCourse(pathId);
    purchaseCourseMutation.mutate({
      courseId,
      locale: lang,
    });
  };

  // Handle bundle enrollment (redirect to Calendly for now)
  const handleBundleEnroll = (bundleName: string) => {
    if (FREE_ACCESS_MODE) {
      toast.success(lang === 'fr' ? 'Acc\u00e8s gratuit activ\u00e9! Explorez les cours.' : 'Free access activated! Explore the courses.');
      window.location.href = '/curriculum';
      return;
    }
    window.open('https://calendly.com/steven-barholere/30min', '_blank');
    toast.info('Opening consultation booking...');
  };

  const currentPaths = programTab === 'esl' ? t.eslPathSeries.paths : t.pathSeries.paths;
  const currentPath = currentPaths[selectedPath];

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-[#0A0A0A] text-white' : 'bg-stone-50'}`}>
      <SEO
        title="RusingAcademy - Path Series\u2122 SLE Training | RusingAcademy"
        description="Intensive SLE preparation courses for Canadian public servants. Achieve BBB, CBC, or CCC certification 3-4x faster with our proven Path Series\u2122 methodology."
        // @ts-expect-error - TS2322: auto-suppressed during TS cleanup
        keywords="SLE training, French language training, public service, Level C, BBB, CBC, CCC, federal government, bilingual certification"
      />

      {/* ═══ FREE ACCESS PROMO BANNER ═══ */}
      <PromoBanner lang={lang} />

      {/* ═══ PREMIUM HERO SECTION ═══ */}
      <section 
        ref={heroRef}
        className="relative min-h-[90vh] flex items-center overflow-hidden"
      >
        {/* Elegant White Background */}
        <div className="absolute inset-0">
          <div 
            className="absolute inset-0"
            style={{ 
              background: 'linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 50%, #F1F5F9 100%)'
            }}
          />
          
          {/* Subtle Colored Accent Overlay */}
          <div 
            className="absolute inset-0 opacity-30"
            style={{ 
              background: 'radial-gradient(ellipse at 20% 20%, rgba(13, 148, 136, 0.15) 0%, transparent 50%), radial-gradient(ellipse at 80% 80%, rgba(124, 58, 237, 0.15) 0%, transparent 50%), radial-gradient(ellipse at 50% 50%, rgba(249, 115, 22, 0.1) 0%, transparent 60%)'
            }}
          />
          
          {/* Floating Orbs for Depth */}
          <motion.div
            className="absolute w-96 h-96 rounded-full opacity-40"
            style={{ 
              background: 'radial-gradient(circle, rgba(13, 148, 136, 0.3) 0%, transparent 70%)',
              top: '10%',
              left: '5%',
              filter: 'blur(80px)'
            }}
            animate={{ 
              x: [0, 30, 0],
              y: [0, -20, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute w-80 h-80 rounded-full opacity-35"
            style={{ 
              background: 'radial-gradient(circle, rgba(124, 58, 237, 0.25) 0%, transparent 70%)',
              bottom: '15%',
              right: '10%',
              filter: 'blur(70px)'
            }}
            animate={{ 
              x: [0, -25, 0],
              y: [0, 25, 0],
              scale: [1, 1.15, 1]
            }}
            transition={{ 
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute w-64 h-64 rounded-full opacity-30"
            style={{ 
              background: 'radial-gradient(circle, rgba(249, 115, 22, 0.2) 0%, transparent 70%)',
              top: '50%',
              right: '25%',
              filter: 'blur(60px)'
            }}
            animate={{ 
              x: [0, 20, 0],
              y: [0, -30, 0],
              scale: [1, 1.2, 1]
            }}
            transition={{ 
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          
          {/* Subtle Grid Pattern */}
          <div 
            className="absolute inset-0 opacity-[0.03]"
            style={{ 
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        <div className="relative max-w-5xl mx-auto px-6 md:px-8 lg:px-12 py-24 text-center">
          <div className="flex flex-col items-center">
            <motion.div
              style={{ opacity: heroOpacity, scale: heroScale }}
              initial="hidden"
              animate="visible"
              variants={animationVariants.staggerContainer}
              className="text-center"
            >
              {/* Badge */}
              <motion.div 
                variants={animationVariants.fadeInUp}
                className="inline-flex flex-col items-center gap-2 mb-8"
              >
                <div 
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-teal-700 text-sm font-semibold shadow-lg backdrop-blur-sm"
                  style={{ background: 'linear-gradient(135deg, rgba(13, 148, 136, 0.12) 0%, rgba(124, 58, 237, 0.12) 100%)', border: '1px solid rgba(13, 148, 136, 0.3)' }}
                >
                  <Sparkles className="w-4 h-4" />
                  {t.hero.badge}
                </div>
                <span className="text-sm text-slate-600 font-medium">{t.hero.badgeSub}</span>
              </motion.div>

              {/* Title */}
              <motion.h1 
                variants={animationVariants.fadeInUp}
                className="text-4xl sm:text-5xl lg:text-7xl font-bold leading-tight mb-6"
              >
                <span className="text-slate-900">{t.hero.title}</span>
                <br />
                <span 
                  className="bg-clip-text text-transparent"
                  style={{ backgroundImage: 'linear-gradient(135deg, #0D9488 0%, #7C3AED 50%, #F97316 100%)' }}
                >
                  {t.hero.titleHighlight}
                </span>
              </motion.h1>

              {/* Subtitle */}
              <motion.p 
                variants={animationVariants.fadeInUp}
                className="text-lg md:text-xl mb-10 max-w-2xl mx-auto text-slate-600 leading-relaxed"
              >
                {t.hero.subtitle}
              </motion.p>

              {/* FREE Access Highlight in Hero */}
              {FREE_ACCESS_MODE && (
                <motion.div 
                  variants={animationVariants.fadeInUp}
                  className="mb-8"
                >
                  <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-emerald-50 border-2 border-emerald-200 shadow-lg shadow-emerald-100/50">
                    <div className="flex items-center gap-2">
                      <Gift className="w-5 h-5 text-emerald-600" />
                      <span className="text-emerald-800 font-bold text-base">{t.promo.badge}</span>
                    </div>
                    <div className="w-px h-5 bg-emerald-300" />
                    <span className="text-emerald-700 text-sm font-medium">{t.promo.promoNote}</span>
                  </div>
                </motion.div>
              )}

              {/* CTAs */}
              <motion.div 
                variants={animationVariants.fadeInUp}
                className="flex flex-wrap justify-center gap-4 mb-10"
              >
                <Link
                  href="/curriculum"
                  className="group inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-white transition-all hover:scale-105 hover:shadow-2xl shadow-xl"
                  style={{ background: 'linear-gradient(135deg, #0D9488 0%, #7C3AED 100%)' }}
                >
                  {t.hero.cta1}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <a
                  href="https://calendly.com/steven-barholere/30min"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold transition-all hover:scale-105 bg-white dark:bg-slate-900 text-teal-700 border-2 border-teal-200 hover:border-teal-400 hover:bg-teal-50 shadow-lg"
                >
                  <Calendar className="w-5 h-5" />
                  {t.hero.cta2}
                </a>
              </motion.div>

              {/* Trust Indicators */}
              <motion.div 
                variants={animationVariants.fadeInUp}
                className="flex items-center justify-center gap-4 text-sm text-slate-600"
              >
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div 
                      key={i}
                      className="w-10 h-10 rounded-full border-2 border-white bg-gradient-to-br from-teal-600 to-teal-700 flex items-center justify-center text-white text-xs font-bold shadow-lg"
                    >
                      {['S', 'M', 'J', 'A'][i-1]}
                    </div>
                  ))}
                </div>
                <span>{t.hero.trust}</span>
              </motion.div>
            </motion.div>

            {/* Floating Stats Cards */}
            <motion.div 
              className="flex flex-wrap justify-center gap-6 mt-12"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <div className="px-6 py-4 rounded-2xl shadow-lg bg-white dark:bg-slate-900/90 backdrop-blur-sm border border-slate-200/80 hover:shadow-xl transition-all hover:-translate-y-0.5">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg, #0D9488 0%, #7C3AED 100%)' }}
                  >
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">3-4x</p>
                    <p className="text-xs text-slate-500 font-medium">{lang === 'fr' ? 'Plus rapide' : 'Faster Results'}</p>
                  </div>
                </div>
              </div>
              
              <div className="px-6 py-4 rounded-2xl shadow-lg bg-white dark:bg-slate-900/90 backdrop-blur-sm border border-slate-200/80 hover:shadow-xl transition-all hover:-translate-y-0.5">
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="w-4 h-4 text-amber-500 fill-amber-500" />
                    ))}
                  </div>
                  <span className="text-sm font-semibold text-slate-900">95% {lang === 'fr' ? 'R\u00e9ussite' : 'Success'}</span>
                </div>
              </div>
              
              <div className="px-6 py-4 rounded-2xl shadow-lg bg-white dark:bg-slate-900/90 backdrop-blur-sm border border-slate-200/80 hover:shadow-xl transition-all hover:-translate-y-0.5">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #DB2777 100%)' }}
                  >
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">2,500+</p>
                    <p className="text-xs text-slate-500 font-medium">{lang === 'fr' ? 'Fonctionnaires' : 'Public Servants'}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══ PROBLEM SECTION ═══ */}
      <section className="py-20 bg-stone-50">
        <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={animationVariants.fadeInUp}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900">
              {t.problem.title}
            </h2>
            <p className="text-lg max-w-2xl mx-auto text-slate-600">
              {t.problem.subtitle}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Traditional Method */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="p-8 rounded-3xl bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 dark:border-slate-700 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gray-200 rounded-full blur-3xl opacity-50" />
              <div className="relative">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                    <X className="w-6 h-6 text-gray-500" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-700">
                    {t.problem.comparison.traditional.title}
                  </h3>
                </div>
                <div className="space-y-4">
                  {t.problem.comparison.traditional.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-slate-700 dark:border-slate-700 last:border-0">
                      <span className="text-gray-600 font-medium">{item.label}</span>
                      <span className="text-gray-500 text-right text-sm">{item.value}</span>
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
              className="p-8 rounded-3xl relative overflow-hidden border-2 shadow-xl shadow-teal-100/50"
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
                    className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg"
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
                      <span className="font-medium text-slate-900">{item.label}</span>
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

      {/* ═══ PATH SERIES SECTION — Premium Redesign ═══ */}
      <section className="py-24 bg-white dark:bg-slate-900 relative overflow-x-clip">
        <div 
          className="absolute inset-0 opacity-20"
          style={{ background: subtleGradient }}
        />
        <div className="relative max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={animationVariants.fadeInUp}
            className="text-center mb-14"
          >
            <div 
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-white text-sm font-semibold mb-5 shadow-lg"
              style={{ background: premiumGradient }}
            >
              <GraduationCap className="w-4 h-4" />
              {programTab === 'esl' ? 'ESL Learning Paths' : (lang === 'fr' ? 'Parcours d\'apprentissage structur\u00e9s' : 'Structured Learning Paths')}
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-5 text-slate-900">
              {programTab === 'esl' ? t.eslPathSeries.title : t.pathSeries.title}
            </h2>
            <p className="text-lg max-w-3xl mx-auto text-slate-600 leading-relaxed">
              {programTab === 'esl' ? t.eslPathSeries.description : t.pathSeries.description}
            </p>

            {/* FSL / ESL Toggle */}
            <div className="flex justify-center mt-8">
              <div className="inline-flex rounded-2xl bg-gray-100 dark:bg-slate-800 p-1.5 gap-1 shadow-inner">
                <button
                  onClick={() => { setProgramTab('fsl'); setSelectedPath(0); }}
                  className={`px-8 py-3 rounded-xl text-sm font-bold transition-all duration-300 flex items-center gap-2 ${
                    programTab === 'fsl'
                      ? 'bg-white dark:bg-slate-800 text-teal-700 shadow-lg scale-105'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <span className="text-lg">&#x1F1E8;&#x1F1E6;</span>
                  French (FSL/FLS)
                </button>
                <button
                  onClick={() => { setProgramTab('esl'); setSelectedPath(0); }}
                  className={`px-8 py-3 rounded-xl text-sm font-bold transition-all duration-300 flex items-center gap-2 ${
                    programTab === 'esl'
                      ? 'bg-white dark:bg-slate-800 text-blue-700 shadow-lg scale-105'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <span className="text-lg">&#x1F1E8;&#x1F1E6;</span>
                  English (ESL/ALS)
                </button>
              </div>
            </div>
          </motion.div>

          {/* Path Navigation Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-12 px-2">
            {currentPaths.map((path, index) => (
              <button
                key={index}
                onClick={() => setSelectedPath(index)}
                className={`relative px-4 py-2.5 rounded-full font-medium transition-all text-sm md:text-base ${
                  selectedPath === index
                    ? 'text-white shadow-lg scale-105'
                    : 'bg-white dark:bg-slate-800 text-slate-900 border border-gray-200 dark:border-slate-700 hover:border-teal-300 hover:bg-teal-50/50 shadow-sm'
                }`}
                style={selectedPath === index ? { background: premiumGradient } : {}}
              >
                <span className="flex items-center gap-1.5">
                  <span className={`w-6 h-6 md:w-7 md:h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                    selectedPath === index ? 'bg-white/20' : 'bg-gray-100'
                  }`}>
                    {path.id}
                  </span>
                  <span className="hidden sm:inline">{path.name}</span>
                  <span className="sm:hidden">{path.name.split(' ')[0]}</span>
                </span>
              </button>
            ))}
          </div>

          {/* ─── Selected Path Detail Card — Premium Glassmorphism ─── */}
          <motion.div
            key={`${programTab}-${selectedPath}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="max-w-6xl mx-auto"
          >
            <div 
              className="rounded-3xl overflow-hidden shadow-2xl border border-white/60"
              style={{ 
                background: 'rgba(255, 255, 255, 0.85)',
                backdropFilter: 'blur(20px)',
                boxShadow: '0 25px 60px rgba(0,0,0,0.08), 0 8px 20px rgba(13,148,136,0.08)'
              }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2">
                {/* Image Side */}
                <div className="flex flex-col">
                  <div className="relative aspect-video lg:aspect-[16/9] min-h-[320px]">
                    <img
                      loading="lazy" 
                      src={programTab === 'esl' ? eslPathImages[currentPath.id] : pathImages[currentPath.id as keyof typeof pathImages]}
                      alt={currentPath.name}
                      className="absolute inset-0 w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&h=600&fit=crop';
                      }}
                    />
                    <div 
                      className="absolute inset-0"
                      style={{ background: 'linear-gradient(135deg, rgba(13, 148, 136, 0.4) 0%, rgba(124, 58, 237, 0.35) 100%)' }}
                    />
                    {/* Path number badge on image */}
                    <div className="absolute top-6 left-6">
                      <div 
                        className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-xl backdrop-blur-sm"
                        style={{ background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.3)' }}
                      >
                        {currentPath.id}
                      </div>
                    </div>
                    {/* FREE badge on image */}
                    {FREE_ACCESS_MODE && (
                      <div className="absolute top-6 right-6">
                        <motion.div
                          animate={{ scale: [1, 1.05, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="px-4 py-2 rounded-full bg-emerald-500 text-white font-bold text-sm shadow-xl flex items-center gap-1.5"
                        >
                          <Gift className="w-4 h-4" />
                          {t.promo.freeLabel}
                        </motion.div>
                      </div>
                    )}
                    <div className="absolute bottom-6 left-6 right-6">
                      <p className="text-white/80 text-sm font-medium mb-1">Path {currentPath.id}</p>
                      <p className="text-white text-xl font-bold italic drop-shadow-lg">
                        "{currentPath.tagline}"
                      </p>
                    </div>
                  </div>
                  {/* CTA Buttons below thumbnail */}
                  <div className="flex flex-col sm:flex-row items-center gap-4 p-6 bg-gradient-to-b from-white/80 to-white border-t border-gray-100/50">
                    <button
                      onClick={() => handleEnroll(currentPath.id)}
                      disabled={enrollingCourse === currentPath.id}
                      className="flex-1 w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-white transition-all hover:scale-[1.02] shadow-xl disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                      style={{ background: FREE_ACCESS_MODE ? 'linear-gradient(135deg, var(--semantic-success, #059669) 0%, #0D9488 100%)' : premiumGradient }}
                    >
                      {enrollingCourse === currentPath.id ? (
                        <>
                          <span className="animate-spin">&#x23F3;</span>
                          Processing...
                        </>
                      ) : FREE_ACCESS_MODE ? (
                        <>
                          <Gift className="w-5 h-5" />
                          {lang === 'fr' ? 'Acc\u00e9der Gratuitement' : 'Access for Free'}
                          <ArrowRight className="w-5 h-5" />
                        </>
                      ) : (
                        <>
                          {lang === 'fr' ? 'S\'inscrire' : 'Enroll Now'}
                          <ArrowRight className="w-5 h-5" />
                        </>
                      )}
                    </button>
                    <Link
                      href="/curriculum"
                      className="flex-1 w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold transition-all hover:scale-[1.02] bg-white dark:bg-slate-900 text-slate-900 border-2 border-gray-200 dark:border-slate-700 dark:border-slate-700 hover:border-teal-400 hover:text-teal-600 text-lg shadow-sm"
                    >
                      {lang === 'fr' ? 'Voir le curriculum' : 'View Full Curriculum'}
                    </Link>
                  </div>
                </div>

                {/* Content Side */}
                <div className="p-8 lg:p-10 flex flex-col justify-between">
                  <div>
                    <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <span 
                            className="px-3 py-1 rounded-full text-sm font-bold text-white shadow-md"
                            style={{ background: premiumGradient }}
                          >
                            Path {currentPath.id}
                          </span>
                          <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 dark:bg-slate-800 text-slate-700">
                            {currentPath.level}
                          </span>
                        </div>
                        <h3 className="text-2xl md:text-3xl font-bold text-slate-900">
                          {currentPath.name}
                        </h3>
                      </div>
                      {/* ─── PRICE WITH STRIKETHROUGH ─── */}
                      <div className="text-right">
                        <PriceDisplay originalPrice={currentPath.price} lang={lang} size="lg" />
                      </div>
                    </div>

                    <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                      {currentPath.desc}
                    </p>

                    {/* Course Details Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 md:gap-4 mb-6">
                      <div className="text-center p-3 md:p-4 rounded-xl bg-gradient-to-br from-teal-50 to-white border border-teal-100/50">
                        <Calendar className="w-5 h-5 md:w-6 md:h-6 mx-auto mb-2 text-teal-600" />
                        <p className="font-bold text-slate-900 text-sm md:text-base">{currentPath.duration}</p>
                        <p className="text-[10px] md:text-xs text-slate-500">{lang === 'fr' ? 'Dur\u00e9e' : 'Duration'}</p>
                      </div>
                      <div className="text-center p-3 md:p-4 rounded-xl bg-gradient-to-br from-violet-50 to-white border border-violet-100/50">
                        <Clock className="w-5 h-5 md:w-6 md:h-6 mx-auto mb-2 text-violet-600" />
                        <p className="font-bold text-slate-900 text-sm md:text-base">{currentPath.hours}</p>
                        <p className="text-[10px] md:text-xs text-slate-500">{lang === 'fr' ? 'Heures structur\u00e9es' : 'Structured Hours'}</p>
                      </div>
                      <div className="text-center p-3 md:p-4 rounded-xl bg-gradient-to-br from-orange-50 to-white border border-orange-100/50 min-w-0">
                        <Target className="w-5 h-5 md:w-6 md:h-6 mx-auto mb-2 text-orange-600" />
                        <p className="font-bold text-slate-900 text-xs md:text-sm leading-tight">{currentPath.focus}</p>
                        <p className="text-[10px] md:text-xs text-slate-500">Focus</p>
                      </div>
                    </div>
                  </div>

                  {/* Promo note at bottom of card */}
                  {FREE_ACCESS_MODE && (
                    <div className="mt-4 p-3 rounded-xl bg-emerald-50/80 border border-emerald-200/60">
                      <p className="text-xs text-emerald-700 font-medium flex items-center gap-2">
                        <BadgeCheck className="w-4 h-4 flex-shrink-0" />
                        {t.promo.promoNote}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Path Progress Indicator */}
          <div className="flex justify-center mt-14 px-2">
            <div 
              className="flex items-center justify-between gap-2 md:gap-4 px-4 md:px-8 py-5 rounded-2xl w-full max-w-3xl"
              style={{
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(16px)',
                boxShadow: '0 10px 40px rgba(0,0,0,0.06), 0 4px 12px rgba(13,148,136,0.06)',
                border: '1px solid rgba(0,0,0,0.06)',
              }}
            >
              {currentPaths.map((path, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedPath(index)}
                  className={`relative flex flex-col items-center transition-all duration-300 flex-1 group ${
                    index <= selectedPath ? 'opacity-100' : 'opacity-40 hover:opacity-70'
                  }`}
                >
                  {index > 0 && (
                    <div 
                      className={`absolute top-5 right-1/2 w-full h-0.5 -z-10 transition-all ${
                        index <= selectedPath ? 'bg-gradient-to-r from-teal-500 to-violet-500' : 'bg-gray-200'
                      }`}
                    />
                  )}
                  <div 
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-base font-bold transition-all duration-300 ${
                      selectedPath === index
                        ? 'text-white scale-110 shadow-xl ring-4 ring-teal-100'
                        : index < selectedPath
                        ? 'bg-gradient-to-br from-teal-100 to-teal-50 text-teal-700 shadow-md'
                        : 'bg-gray-100 dark:bg-slate-800 text-gray-400 group-hover:bg-gray-200'
                    }`}
                    style={selectedPath === index ? { background: premiumGradient } : {}}
                  >
                    {path.id}
                  </div>
                  <span className={`text-xs mt-2 font-semibold transition-colors ${
                    selectedPath === index ? 'text-teal-600' : 'text-slate-500'
                  }`}>
                    {path.level}
                  </span>
                  <span className={`text-[10px] font-medium transition-colors text-center leading-tight ${
                    selectedPath === index ? 'text-teal-500' : 'text-slate-400'
                  }`}>
                    <span className="hidden md:inline">{path.name.split(' ').slice(0, 2).join(' ')}</span>
                    <span className="md:hidden">{path.name.split(' ')[0]}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ STATS SECTION ═══ */}
      <section className="py-16 relative overflow-hidden">
        <div 
          className="absolute inset-0 opacity-40"
          style={{ background: subtleGradient }}
        />
        <div className="relative max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
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
                className="group relative p-6 rounded-2xl bg-white dark:bg-slate-900/80 backdrop-blur-xl border border-white/70 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
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
                  <p className="text-sm text-slate-600 font-medium">
                    {stat.label}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══ WHY CHOOSE US SECTION ═══ */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={animationVariants.fadeInUp}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900">
              {t.whyUs.title}
            </h2>
            <p className="text-lg max-w-2xl mx-auto text-slate-600">
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
                  className="group relative p-7 rounded-2xl bg-gradient-to-br from-gray-50/80 to-white border border-gray-100 dark:border-slate-700 hover:border-teal-200 transition-all hover:shadow-xl hover:-translate-y-1"
                >
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-lg"
                    style={{ background: premiumGradient }}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold mb-2 text-slate-900">{item.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{item.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══ BUNDLES SECTION — With Strikethrough Pricing ═══ */}
      <section className="py-24 bg-stone-50 relative overflow-hidden">
        <div 
          className="absolute inset-0 opacity-10"
          style={{ background: 'radial-gradient(ellipse at 30% 50%, rgba(13, 148, 136, 0.2) 0%, transparent 60%), radial-gradient(ellipse at 70% 50%, rgba(124, 58, 237, 0.2) 0%, transparent 60%)' }}
        />
        <div className="relative max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={animationVariants.fadeInUp}
            className="text-center mb-14"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-5 text-slate-900">
              {t.bundles.title}
            </h2>
            <p className="text-lg max-w-2xl mx-auto text-slate-600">
              {t.bundles.subtitle}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
            {t.bundles.items.map((bundle, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className={`relative flex flex-col rounded-3xl transition-all hover:-translate-y-2 ${
                  bundle.featured
                    ? 'shadow-2xl border-2 md:scale-105 z-10'
                    : 'shadow-lg border border-gray-100'
                }`}
                style={{
                  background: bundle.featured 
                    ? 'linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(240,253,250,1) 100%)' 
                    : 'white',
                  borderColor: bundle.featured ? '#0D9488' : undefined,
                }}
              >
                {bundle.featured && (
                  <div 
                    className="absolute -top-4 left-1/2 -translate-x-1/2 px-5 py-1.5 rounded-full text-white text-sm font-bold shadow-lg"
                    style={{ background: premiumGradient }}
                  >
                    {lang === 'fr' ? 'Le plus populaire' : 'Most Popular'}
                  </div>
                )}

                <div className="p-8 flex-1 flex flex-col">
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-slate-900 mb-2">{bundle.name}</h3>
                    <p className="text-sm text-slate-600">{bundle.description}</p>
                  </div>

                  {/* ─── BUNDLE PRICE WITH STRIKETHROUGH ─── */}
                  <div className="mb-6">
                    <PriceDisplay originalPrice={bundle.price} lang={lang} size="lg" />
                    {!FREE_ACCESS_MODE && (
                      <span className="inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold text-teal-700 bg-teal-50">
                        {bundle.savings}
                      </span>
                    )}
                  </div>

                  <ul className="space-y-3 mb-8 flex-1">
                    {bundle.includes.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 flex-shrink-0 text-teal-500" />
                        <span className="text-sm text-slate-700">{item}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="pt-4 border-t border-gray-100">
                    <p className="text-xs text-slate-500 mb-4">
                      <strong className="text-slate-700">{lang === 'fr' ? 'Id\u00e9al pour:' : 'Ideal for:'}</strong> {bundle.ideal}
                    </p>
                    <button
                      onClick={() => handleBundleEnroll(bundle.name)}
                      className={`w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full font-semibold transition-all hover:scale-105 ${
                        bundle.featured
                          ? 'text-white shadow-lg'
                          : FREE_ACCESS_MODE
                          ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                          : 'bg-gray-100 dark:bg-slate-800 text-slate-900 hover:bg-gray-200'
                      }`}
                      style={bundle.featured ? { background: FREE_ACCESS_MODE ? 'linear-gradient(135deg, var(--semantic-success, #059669) 0%, #0D9488 100%)' : premiumGradient } : {}}
                    >
                      {FREE_ACCESS_MODE ? (
                        <>
                          <Gift className="w-4 h-4" />
                          {lang === 'fr' ? 'Acc\u00e9der Gratuitement' : 'Access for Free'}
                        </>
                      ) : (
                        <>
                          {lang === 'fr' ? 'Commencer' : 'Get Started'}
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ OFFERINGS SECTION ═══ */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={animationVariants.fadeInUp}
            className="text-center mb-14"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900">
              {t.offerings.title}
            </h2>
            <p className="text-lg max-w-2xl mx-auto text-slate-600">
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
                  className="group relative p-8 rounded-3xl bg-gradient-to-br from-gray-50/80 to-white border border-gray-100 dark:border-slate-700 hover:border-teal-200 transition-all hover:shadow-xl hover:-translate-y-1"
                >
                  <div 
                    className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity"
                    style={{ background: premiumGradient }}
                  />
                  
                  <div 
                    className="relative w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg"
                    style={{ background: premiumGradient }}
                  >
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-bold mb-3 text-slate-900">
                    {item.title}
                  </h3>
                  <p className="mb-6 text-slate-600 leading-relaxed">
                    {item.desc}
                  </p>
                  
                  <ul className="space-y-3">
                    {item.features.map((feature, fIndex) => (
                      <li key={fIndex} className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 flex-shrink-0 text-teal-500" />
                        <span className="text-sm text-slate-700">
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

      {/* ═══ TESTIMONIALS SECTION ═══ */}
      <section className="py-20 bg-stone-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
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
                loading="lazy" src={sectionImages.success}
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
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900">
                  {t.testimonials.title}
                </h2>
                <p className="text-lg text-slate-600">
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
                    className="p-6 rounded-2xl bg-white dark:bg-slate-900/90 backdrop-blur-sm border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-lg transition-all"
                  >
                    <div className="flex items-start gap-4">
                      <Quote className="w-8 h-8 text-teal-500 flex-shrink-0 mt-1" />
                      <div>
                        <p className="mb-4 text-slate-700 italic leading-relaxed">
                          "{item.quote}"
                        </p>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-slate-900">{item.name}</p>
                            <p className="text-sm text-slate-500">{item.org}</p>
                          </div>
                          <span 
                            className="px-3 py-1 rounded-full text-xs font-bold text-white shadow-md"
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

      {/* ═══ FINAL CTA SECTION ═══ */}
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
        
        <div className="relative max-w-4xl mx-auto px-6 md:px-8 lg:px-12 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={animationVariants.fadeInUp}
          >
            <Building2 className="w-12 h-12 mx-auto mb-6 text-white/90" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              {t.cta.title}
            </h2>
            <p className="text-lg mb-8 text-white/90 max-w-2xl mx-auto">
              {t.cta.subtitle}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="https://calendly.com/steven-barholere/30min"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold transition-all hover:scale-105 bg-white dark:bg-slate-900 text-slate-900 shadow-xl hover:shadow-2xl"
              >
                {t.cta.button1}
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="https://calendly.com/steven-barholere/30min"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold transition-all hover:scale-105 bg-white dark:bg-slate-900/10 text-white border-2 border-white/60 hover:bg-white dark:bg-slate-900/20 backdrop-blur-sm"
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
      <FooterInstitutional />
    </div>
  );
}
