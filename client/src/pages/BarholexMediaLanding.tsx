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
  Phone,
  Brain,
  Layers,
  BarChart3,
  Radio,
  Film,
  Voicemail,
  Podcast,
  Headphones,
  Bot,
  Target,
  TrendingUp,
  BookOpen,
  Gamepad2,
  Languages,
  Briefcase,
  PenTool,
  Star,
  Quote,
  PlayCircle
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
    edtech: {
      title: 'EdTech & AI Solutions',
      subtitle: 'Revolutionize learning with AI-powered technology, instructional design expertise, and innovative content creation',
      image: '/images/generated/barholex-edtech.jpg',
      badge: 'Enterprise Solutions',
      intro: 'We help organizations leverage cutting-edge AI and instructional design methodologies to create transformative learning experiences. From language training to professional development, our solutions are built for measurable impact.',
      categories: [
        {
          title: 'AI for Language Learning',
          icon: 'Languages',
          description: 'Harness the power of artificial intelligence to accelerate language acquisition in professional settings.',
          items: [
            {
              icon: 'Bot',
              title: 'AI Language Tutors',
              desc: 'Deploy conversational AI tutors that provide 24/7 personalized language practice with real-time feedback on pronunciation, grammar, and fluency.',
              features: ['Speech recognition & analysis', 'Adaptive difficulty levels', 'Cultural context integration', 'Progress tracking dashboards'],
            },
            {
              icon: 'Mic',
              title: 'Voice AI & Pronunciation',
              desc: 'Advanced speech recognition technology that analyzes pronunciation patterns and provides targeted feedback for accent reduction and clarity.',
              features: ['Phoneme-level analysis', 'Native speaker comparison', 'Personalized exercises', 'Bilingual assessment (FR/EN)'],
            },
            {
              icon: 'MessageSquare',
              title: 'Conversational Simulations',
              desc: 'AI-powered role-play scenarios that simulate real workplace conversations, meetings, and presentations in both official languages.',
              features: ['Workplace scenarios', 'SLE exam preparation', 'Confidence building', 'Performance analytics'],
            },
          ],
        },
        {
          title: 'AI for Professional Training',
          icon: 'Briefcase',
          description: 'Transform corporate training with intelligent systems that adapt to each learner\'s needs and pace.',
          items: [
            {
              icon: 'Brain',
              title: 'Adaptive Learning Platforms',
              desc: 'AI systems that continuously analyze learner behavior and automatically adjust content difficulty, pacing, and delivery methods.',
              features: ['Real-time adaptation', 'Knowledge gap detection', 'Personalized pathways', 'Spaced repetition'],
            },
            {
              icon: 'Target',
              title: 'Intelligent Assessment',
              desc: 'Automated evaluation systems that provide instant, detailed feedback and identify skill gaps with precision.',
              features: ['Auto-grading & feedback', 'Competency mapping', 'Predictive performance', 'Certification tracking'],
            },
            {
              icon: 'TrendingUp',
              title: 'Learning Analytics & ROI',
              desc: 'Comprehensive dashboards that measure training effectiveness, learner engagement, and return on investment.',
              features: ['Real-time dashboards', 'Engagement metrics', 'ROI calculations', 'Executive reporting'],
            },
          ],
        },
        {
          title: 'Content Creation & Instructional Design',
          icon: 'PenTool',
          description: 'Expert instructional designers and content creators who build engaging, effective learning experiences.',
          items: [
            {
              icon: 'Layers',
              title: 'Instructional Engineering',
              desc: 'Apply proven pedagogical frameworks (ADDIE, SAM, Bloom\'s Taxonomy) to design learning experiences that achieve measurable outcomes.',
              features: ['Needs analysis', 'Learning objectives design', 'Assessment alignment', 'Quality assurance'],
            },
            {
              icon: 'Video',
              title: 'Multimedia Content Production',
              desc: 'Create engaging video lessons, interactive simulations, animations, and microlearning modules that captivate learners.',
              features: ['Video production', 'Interactive modules', 'Motion graphics', 'Microlearning design'],
            },
            {
              icon: 'BookOpen',
              title: 'Curriculum Development',
              desc: 'Design comprehensive curricula aligned with competency frameworks, industry standards, and organizational goals.',
              features: ['Competency mapping', 'Learning path design', 'Assessment strategy', 'Continuous improvement'],
            },
            {
              icon: 'Gamepad',
              title: 'Gamification & Engagement',
              desc: 'Apply game mechanics to increase motivation, completion rates, and knowledge retention.',
              features: ['Points & badges', 'Leaderboards', 'Challenges & quests', 'Social learning'],
            },
          ],
        },
      ],
      cta: {
        title: 'Ready to Transform Your Training?',
        subtitle: 'Book a free consultation to discuss how our EdTech solutions can help your organization.',
        button: 'Schedule a Discovery Call',
      },
    },
    audiovisual: {
      title: 'Audiovisual Production',
      subtitle: 'Professional-grade audio and video services for every communication need',
      items: [
        {
          icon: 'Podcast',
          title: 'Podcast Production',
          desc: 'From concept to distribution, we handle every aspect of your podcast journey.',
          image: '/images/generated/barholex-podcast.jpg',
          features: ['Concept development', 'Recording & editing', 'Sound design & mixing', 'Distribution strategy', 'Guest coordination'],
        },
        {
          icon: 'Voicemail',
          title: 'Professional Voiceover',
          desc: 'Bilingual voice talent for e-learning, corporate videos, IVR, and commercials.',
          image: '/images/generated/barholex-voiceover.jpg',
          features: ['French & English talent', 'E-learning narration', 'Corporate videos', 'IVR & phone systems', 'Commercial spots'],
        },
        {
          icon: 'Film',
          title: 'Corporate Video Production',
          desc: 'High-impact video content that tells your story and engages your audience.',
          image: '/images/generated/barholex-video-production.jpg',
          features: ['Executive interviews', 'Training videos', 'Event coverage', 'Promotional content', 'Documentary style'],
        },
        {
          icon: 'Radio',
          title: 'Audio Branding & Sound Design',
          desc: 'Create a distinctive audio identity that reinforces your brand across all touchpoints.',
          features: ['Sonic logos', 'Jingles & music', 'Podcast intros/outros', 'Hold music', 'Sound effects'],
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
    edtech: {
      title: 'Solutions EdTech & IA',
      subtitle: 'Révolutionnez l\'apprentissage avec la technologie IA, l\'expertise en ingénierie didactique et la création de contenus innovants',
      image: '/images/generated/barholex-edtech.jpg',
      badge: 'Solutions Entreprises',
      intro: 'Nous aidons les organisations à exploiter l\'IA de pointe et les méthodologies d\'ingénierie didactique pour créer des expériences d\'apprentissage transformatrices. De la formation linguistique au développement professionnel, nos solutions sont conçues pour un impact mesurable.',
      categories: [
        {
          title: 'IA pour l\'Apprentissage des Langues',
          icon: 'Languages',
          description: 'Exploitez la puissance de l\'intelligence artificielle pour accélérer l\'acquisition linguistique en milieu professionnel.',
          items: [
            {
              icon: 'Bot',
              title: 'Tuteurs IA Linguistiques',
              desc: 'Déployez des tuteurs IA conversationnels offrant une pratique linguistique personnalisée 24/7 avec rétroaction en temps réel sur la prononciation, la grammaire et la fluidité.',
              features: ['Reconnaissance vocale & analyse', 'Niveaux de difficulté adaptatifs', 'Intégration du contexte culturel', 'Tableaux de bord de progression'],
            },
            {
              icon: 'Mic',
              title: 'IA Vocale & Prononciation',
              desc: 'Technologie avancée de reconnaissance vocale qui analyse les patterns de prononciation et fournit une rétroaction ciblée pour la réduction d\'accent et la clarté.',
              features: ['Analyse au niveau des phonèmes', 'Comparaison avec locuteurs natifs', 'Exercices personnalisés', 'Évaluation bilingue (FR/EN)'],
            },
            {
              icon: 'MessageSquare',
              title: 'Simulations Conversationnelles',
              desc: 'Scénarios de jeux de rôle alimentés par l\'IA simulant des conversations, réunions et présentations réelles en milieu de travail dans les deux langues officielles.',
              features: ['Scénarios professionnels', 'Préparation aux examens ELS', 'Renforcement de la confiance', 'Analytique de performance'],
            },
          ],
        },
        {
          title: 'IA pour la Formation Professionnelle',
          icon: 'Briefcase',
          description: 'Transformez la formation en entreprise avec des systèmes intelligents qui s\'adaptent aux besoins et au rythme de chaque apprenant.',
          items: [
            {
              icon: 'Brain',
              title: 'Plateformes d\'Apprentissage Adaptatif',
              desc: 'Systèmes IA qui analysent continuellement le comportement de l\'apprenant et ajustent automatiquement la difficulté, le rythme et les méthodes de livraison.',
              features: ['Adaptation en temps réel', 'Détection des lacunes', 'Parcours personnalisés', 'Répétition espacée'],
            },
            {
              icon: 'Target',
              title: 'Évaluation Intelligente',
              desc: 'Systèmes d\'évaluation automatisés fournissant une rétroaction instantanée et détaillée, identifiant les lacunes de compétences avec précision.',
              features: ['Auto-correction & feedback', 'Cartographie des compétences', 'Performance prédictive', 'Suivi des certifications'],
            },
            {
              icon: 'TrendingUp',
              title: 'Analytique & ROI',
              desc: 'Tableaux de bord complets mesurant l\'efficacité de la formation, l\'engagement des apprenants et le retour sur investissement.',
              features: ['Tableaux de bord temps réel', 'Métriques d\'engagement', 'Calculs de ROI', 'Rapports exécutifs'],
            },
          ],
        },
        {
          title: 'Création de Contenus & Ingénierie Didactique',
          icon: 'PenTool',
          description: 'Concepteurs pédagogiques experts et créateurs de contenus qui construisent des expériences d\'apprentissage engageantes et efficaces.',
          items: [
            {
              icon: 'Layers',
              title: 'Ingénierie Didactique',
              desc: 'Appliquez des cadres pédagogiques éprouvés (ADDIE, SAM, Taxonomie de Bloom) pour concevoir des expériences d\'apprentissage aux résultats mesurables.',
              features: ['Analyse des besoins', 'Conception des objectifs', 'Alignement des évaluations', 'Assurance qualité'],
            },
            {
              icon: 'Video',
              title: 'Production de Contenus Multimédia',
              desc: 'Créez des leçons vidéo engageantes, des simulations interactives, des animations et des modules de microlearning captivants.',
              features: ['Production vidéo', 'Modules interactifs', 'Motion graphics', 'Design microlearning'],
            },
            {
              icon: 'BookOpen',
              title: 'Développement de Curriculum',
              desc: 'Concevez des curricula complets alignés sur les cadres de compétences, les normes de l\'industrie et les objectifs organisationnels.',
              features: ['Cartographie des compétences', 'Conception de parcours', 'Stratégie d\'évaluation', 'Amélioration continue'],
            },
            {
              icon: 'Gamepad',
              title: 'Gamification & Engagement',
              desc: 'Appliquez les mécaniques de jeu pour augmenter la motivation, les taux de complétion et la rétention des connaissances.',
              features: ['Points & badges', 'Classements', 'Défis & quêtes', 'Apprentissage social'],
            },
          ],
        },
      ],
      cta: {
        title: 'Prêt à Transformer Votre Formation?',
        subtitle: 'Réservez une consultation gratuite pour discuter de comment nos solutions EdTech peuvent aider votre organisation.',
        button: 'Planifier un Appel Découverte',
      },
    },
    audiovisual: {
      title: 'Production Audiovisuelle',
      subtitle: 'Services audio et vidéo de qualité professionnelle pour tous vos besoins de communication',
      items: [
        {
          icon: 'Podcast',
          title: 'Production de Podcasts',
          desc: 'Du concept à la distribution, nous gérons chaque aspect de votre parcours podcast.',
          image: '/images/generated/barholex-podcast.jpg',
          features: ['Développement de concept', 'Enregistrement & montage', 'Design sonore & mixage', 'Stratégie de distribution', 'Coordination des invités'],
        },
        {
          icon: 'Voicemail',
          title: 'Voix Off Professionnelle',
          desc: 'Talents vocaux bilingues pour e-learning, vidéos corporatives, IVR et publicités.',
          image: '/images/generated/barholex-voiceover.jpg',
          features: ['Talents français & anglais', 'Narration e-learning', 'Vidéos corporatives', 'Systèmes IVR', 'Spots publicitaires'],
        },
        {
          icon: 'Film',
          title: 'Production Vidéo Corporative',
          desc: 'Contenu vidéo à fort impact qui raconte votre histoire et engage votre audience.',
          image: '/images/generated/barholex-video-production.jpg',
          features: ['Entrevues exécutives', 'Vidéos de formation', 'Couverture d\'événements', 'Contenu promotionnel', 'Style documentaire'],
        },
        {
          icon: 'Radio',
          title: 'Branding Audio & Design Sonore',
          desc: 'Créez une identité audio distinctive qui renforce votre marque à travers tous les points de contact.',
          features: ['Logos sonores', 'Jingles & musique', 'Intros/outros podcast', 'Musique d\'attente', 'Effets sonores'],
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
  Brain,
  Layers,
  BarChart: BarChart3,
  Radio,
  Film,
  Voicemail,
  Podcast,
  Headphones,
  Bot,
  Target,
  TrendingUp,
  BookOpen,
  Gamepad: Gamepad2,
  Languages,
  Briefcase,
  PenTool,
  Video,
  MessageSquare,
  Star,
  Quote,
  PlayCircle,
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
                src="/images/generated/barholex-hero.jpg"
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

      {/* EdTech & AI Solutions Section - Premium Design */}
      <section id="edtech" className="py-16 sm:py-24 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 pointer-events-none">
          <div 
            className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl opacity-20"
            style={{ background: brand.gradient }}
          />
          <div 
            className="absolute bottom-0 left-0 w-96 h-96 rounded-full blur-3xl opacity-10"
            style={{ background: brand.gradient }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          {/* Section Header */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={animationVariants.fadeInUp}
            className="text-center mb-16"
          >
            <div 
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold mb-6 border"
              style={{ 
                background: `linear-gradient(135deg, ${brand.primary}15, ${brand.primary}05)`,
                borderColor: `${brand.primary}30`,
                color: brand.primary 
              }}
            >
              <Sparkles className="w-4 h-4" />
              {(t.edtech as any).badge || 'Enterprise Solutions'}
            </div>
            <h2 className={`text-4xl md:text-5xl font-bold mb-6 ${isGlass ? 'text-white' : 'text-gray-900'}`}>
              {t.edtech.title}
            </h2>
            <p className={`text-xl max-w-3xl mx-auto leading-relaxed ${isGlass ? 'text-gray-300' : 'text-gray-600'}`}>
              {t.edtech.subtitle}
            </p>
            {(t.edtech as any).intro && (
              <p className={`mt-4 text-lg max-w-4xl mx-auto ${isGlass ? 'text-gray-400' : 'text-gray-500'}`}>
                {(t.edtech as any).intro}
              </p>
            )}
          </motion.div>

          {/* Hero Image with Stats Overlay */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative mb-20 rounded-3xl overflow-hidden"
          >
            <div 
              className="absolute inset-0 blur-3xl opacity-30"
              style={{ background: brand.gradient }}
            />
            <img
              src={t.edtech.image}
              alt="EdTech & AI Solutions"
              className="relative w-full h-80 md:h-96 object-cover rounded-3xl"
              onError={(e) => {
                e.currentTarget.src = 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1200&h=600&fit=crop';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent rounded-3xl" />
            
            {/* Stats Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { value: '50+', label: lang === 'fr' ? 'Organisations servies' : 'Organizations Served' },
                  { value: '95%', label: lang === 'fr' ? 'Taux de satisfaction' : 'Satisfaction Rate' },
                  { value: '10K+', label: lang === 'fr' ? 'Apprenants formés' : 'Learners Trained' },
                  { value: '3x', label: lang === 'fr' ? 'ROI moyen' : 'Average ROI' },
                ].map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-3xl md:text-4xl font-bold text-white mb-1" style={{ textShadow: `0 0 20px ${brand.primary}` }}>
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-300">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Categories */}
          {(t.edtech as any).categories && (t.edtech as any).categories.map((category: any, catIndex: number) => {
            const CategoryIcon = iconMap[category.icon];
            return (
              <motion.div
                key={catIndex}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={animationVariants.fadeInUp}
                className="mb-20"
              >
                {/* Category Header */}
                <div className="flex items-center gap-4 mb-8">
                  <div 
                    className="w-14 h-14 rounded-2xl flex items-center justify-center"
                    style={{ background: brand.gradient }}
                  >
                    {CategoryIcon && <CategoryIcon className="w-7 h-7 text-white" />}
                  </div>
                  <div>
                    <h3 className={`text-2xl md:text-3xl font-bold ${isGlass ? 'text-white' : 'text-gray-900'}`}>
                      {category.title}
                    </h3>
                    <p className={`text-lg ${isGlass ? 'text-gray-400' : 'text-gray-600'}`}>
                      {category.description}
                    </p>
                  </div>
                </div>

                {/* Category Items Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {category.items.map((item: any, itemIndex: number) => {
                    const ItemIcon = iconMap[item.icon];
                    return (
                      <motion.div
                        key={itemIndex}
                        variants={animationVariants.fadeInUp}
                        transition={{ ...transitions.normal, delay: itemIndex * 0.1 }}
                        whileHover={{ y: -8, transition: { duration: 0.3 } }}
                        className={`group p-6 rounded-2xl transition-all duration-300 ${
                          isGlass 
                            ? 'bg-gradient-to-br from-white/10 to-white/5 border border-white/10 hover:border-white/30 hover:from-white/15 hover:to-white/10' 
                            : 'bg-white border border-gray-200 shadow-lg hover:shadow-2xl hover:border-gray-300'
                        }`}
                      >
                        {/* Icon with glow effect */}
                        <div className="relative mb-5">
                          <div 
                            className="absolute inset-0 rounded-xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-300"
                            style={{ background: brand.gradient }}
                          />
                          <div 
                            className="relative w-12 h-12 rounded-xl flex items-center justify-center"
                            style={{ background: brand.gradient }}
                          >
                            {ItemIcon && <ItemIcon className="w-6 h-6 text-white" />}
                          </div>
                        </div>

                        <h4 className={`text-xl font-bold mb-3 ${isGlass ? 'text-white' : 'text-gray-900'}`}>
                          {item.title}
                        </h4>
                        <p className={`mb-5 leading-relaxed ${isGlass ? 'text-gray-400' : 'text-gray-600'}`}>
                          {item.desc}
                        </p>

                        {/* Features */}
                        <ul className="space-y-2">
                          {item.features.map((feature: string, fIndex: number) => (
                            <li key={fIndex} className="flex items-center gap-3">
                              <div 
                                className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                                style={{ background: `${brand.primary}20` }}
                              >
                                <CheckCircle className="w-3 h-3" style={{ color: brand.primary }} />
                              </div>
                              <span className={`text-sm ${isGlass ? 'text-gray-300' : 'text-gray-700'}`}>
                                {feature}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            );
          })}

          {/* EdTech CTA */}
          {(t.edtech as any).cta && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className={`text-center p-10 rounded-3xl ${
                isGlass 
                  ? 'bg-gradient-to-br from-white/10 to-white/5 border border-white/20' 
                  : 'bg-gradient-to-br from-gray-50 to-white border border-gray-200'
              }`}
            >
              <h3 className={`text-2xl md:text-3xl font-bold mb-4 ${isGlass ? 'text-white' : 'text-gray-900'}`}>
                {(t.edtech as any).cta.title}
              </h3>
              <p className={`text-lg mb-8 max-w-2xl mx-auto ${isGlass ? 'text-gray-400' : 'text-gray-600'}`}>
                {(t.edtech as any).cta.subtitle}
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-full font-semibold text-white transition-all hover:scale-105 hover:shadow-xl"
                style={{ background: brand.gradient }}
              >
                {(t.edtech as any).cta.button}
                <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
          )}
        </div>
      </section>

      {/* Audiovisual Production Section */}
      <section id="audiovisual" className={`py-12 sm:py-20 ${isGlass ? 'bg-slate-900/50' : 'bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={animationVariants.fadeInUp}
            className="text-center mb-12"
          >
            <div 
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-4"
              style={{ background: `${brand.primary}20`, color: brand.primary }}
            >
              <Headphones className="w-4 h-4" />
              Audio & Video
            </div>
            <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${isGlass ? 'text-white' : 'text-gray-900'}`}>
              {t.audiovisual.title}
            </h2>
            <p className={`text-lg max-w-2xl mx-auto ${isGlass ? 'text-gray-400' : 'text-gray-600'}`}>
              {t.audiovisual.subtitle}
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={animationVariants.staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {t.audiovisual.items.map((item, index) => {
              const Icon = iconMap[item.icon];
              const hasImage = 'image' in item;
              return (
                <motion.div
                  key={index}
                  variants={animationVariants.fadeInUp}
                  transition={{ ...transitions.normal, delay: index * 0.1 }}
                  className={`rounded-2xl overflow-hidden ${
                    isGlass 
                      ? 'bg-gradient-to-br from-white/10 to-white/5 border border-white/10' 
                      : 'bg-white border border-gray-200 shadow-lg'
                  }`}
                >
                  {hasImage && (
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={(item as any).image}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                        onError={(e) => {
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&h=400&fit=crop';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div 
                        className="absolute bottom-4 left-4 w-12 h-12 rounded-xl flex items-center justify-center"
                        style={{ background: brand.gradient }}
                      >
                        {Icon && <Icon className="w-6 h-6 text-white" />}
                      </div>
                    </div>
                  )}
                  <div className="p-6">
                    {!hasImage && (
                      <div 
                        className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                        style={{ background: brand.gradient }}
                      >
                        {Icon && <Icon className="w-6 h-6 text-white" />}
                      </div>
                    )}
                    <h3 className={`text-xl font-bold mb-2 ${isGlass ? 'text-white' : 'text-gray-900'}`}>
                      {item.title}
                    </h3>
                    <p className={`mb-4 ${isGlass ? 'text-gray-400' : 'text-gray-600'}`}>
                      {item.desc}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {item.features.map((feature, fIndex) => (
                        <span 
                          key={fIndex}
                          className={`px-3 py-1 rounded-full text-xs ${
                            isGlass 
                              ? 'bg-white/10 text-gray-300' 
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
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
