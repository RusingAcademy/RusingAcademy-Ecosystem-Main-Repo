import { useState, useEffect, useRef } from "react";
import SEO, { generateFAQSchema } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FeaturedCoaches from "@/components/FeaturedCoaches";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  GraduationCap,
  Users,
  Calendar,
  Star,
  ArrowRight,
  CheckCircle2,
  Globe,
  Clock,
  Award,
  MessageSquare,
  Play,
  ChevronDown,
  HelpCircle,
  BookOpen,
  Headphones,
  PenTool,
  Target,
  Zap,
  Shield,
  TrendingUp,
  Video,
  Sparkles,
  Brain,
  UserCheck,
  FileText,
  Loader2,
} from "lucide-react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";

export default function LingueefyLanding() {
  const { t, language } = useLanguage();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<string>("progressive");
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());
  const sectionRefs = useRef<Map<string, HTMLElement>>(new Map());

  // Fetch coaches from database
  const { data: coaches, isLoading: coachesLoading } = trpc.coach.list.useQuery({
    limit: 6,
  });

  // Intersection Observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = entry.target.getAttribute('data-section-id');
          if (entry.isIntersecting && id) {
            setVisibleSections(prev => new Set(prev).add(id));
          }
        });
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    sectionRefs.current.forEach((element) => {
      observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  const content = {
    en: {
      hero: {
        badge: "GC Bilingual Mastery Series",
        title: "Stop Guessing.",
        subtitle: "Start Passing Your GC Second Language Exams.",
        description: "Accelerated Language Training Built Exclusively for Canadian Federal Public Servants. Achieve BBB, CBC, or CCC by following a clear, structured path from A1 to C1.",
        highlight: "Master French or English 3–4× faster with a proven, coaching- and path-based methodology.",
        cta: "Choose Your Coach",
        ctaSecondary: "Choose Your Path",
        tagline: "Structured. Targeted. Results-driven.",
        subTagline: "No guesswork. No wasted hours. A clear strategy from day one.",
        stats: [
          { value: "95%", label: "Success Rate" },
          { value: "2,500+", label: "Public Servants Trained" },
          { value: "4.9/5", label: "Average Rating" },
        ],
      },
      systemWorks: {
        title: "How Our Structured System Works",
        subtitle: "Discover a clear, results-driven path to bilingual excellence through three strategic steps designed specifically for Canadian federal public servants.",
        steps: [
          {
            icon: Target,
            number: "1",
            title: "Strategic Language Diagnostic",
            description: "We start with a strategic language diagnostic that goes beyond a simple placement test. It allows us to accurately assess your current level, communicative competencies, and exam-relevant gaps in relation to Government of Canada language standards.",
            result: "The result is a clear, objective snapshot of where you are—and what needs to be prioritized to move you forward efficiently.",
          },
          {
            icon: FileText,
            number: "2",
            title: "Personalized, Results-Driven Learning Plan",
            description: "Based on your diagnostic, we design a fully personalized learning plan aligned with your target level (BBB, CBC, or CCC), your professional context and role, and your timeline and constraints.",
            result: "This plan follows a structured progression path, ensuring that every learning activity contributes directly to measurable exam readiness and real-world performance.",
          },
          {
            icon: UserCheck,
            number: "3",
            title: "Choose the Right Path and Coaching Support",
            description: "You then select the learning path and coaching option that best matches your objectives, learning style, and availability. Whether you choose self-paced structured paths, personalized 1-on-1 coaching, or a combined approach.",
            result: "At every stage, the focus remains the same: clarity, efficiency, and results—without guesswork.",
          },
        ],
      },
      doubleModality: {
        title: "Two Ways to Learn. One Clear Goal.",
        subtitle: "GC Language Exam Success and Real Fluency",
        description: "Our Double-Modality System combines structured group learning with personalized one-on-one coaching to ensure both strategic progression and individual mastery.",
        modalities: [
          {
            icon: BookOpen,
            title: "Structured Group Learning",
            description: "Follow a clearly defined curriculum delivered through interactive lessons designed to build strong linguistic foundations aligned with GC language standards.",
            features: ["Clear curriculum progression", "Interactive lessons", "Path Series™ methodology", "Consistent development at every level"],
          },
          {
            icon: Users,
            title: "Personalized One-on-One Coaching",
            description: "Work directly with certified GC language coaches who adapt each session to your learning style, specific gaps, and exam objectives.",
            features: ["Oral confidence building", "Exam strategies", "Real-world professional communication", "Faster, more effective progress"],
          },
        ],
      },
      pricing: {
        title: "Choose Your Coaching Plan",
        subtitle: "Flexible options designed to match your goals, timeline, and learning style",
        tabStandard: "RusingAcademy Plans",
        tabCustom: "À la Carte Coaching",
        plans: [
          {
            id: "boost",
            name: "Boost Session",
            duration: "1 Hour",
            price: 67,
            description: "Quick clarity or professional feedback before your exam",
            features: [
              "1 Hour of Precise Coaching",
              "Quick diagnosis of your oral performance",
              "Immediate personalized feedback",
              "Targeted mini-simulation focused on your weak spots",
            ],
            ideal: "Anyone seeking quick clarity or professional feedback before their exam.",
            popular: false,
          },
          {
            id: "quickprep",
            name: "Quick Prep",
            duration: "5 Hours",
            price: 299,
            description: "Focused, strategic practice for learners preparing within 2-3 weeks",
            features: [
              "5 Hours of Targeted Coaching",
              "Diagnostic assessment to identify gaps",
              "Personalized learning plan with focused themes",
              "One full oral exam simulation with feedback",
            ],
            ideal: "Learners preparing within 2-3 weeks who need focused, strategic practice.",
            popular: false,
          },
          {
            id: "progressive",
            name: "Progressive",
            duration: "15 Hours",
            price: 899,
            description: "Structured growth for level B or C over 8-12 weeks",
            features: [
              "15 Hours of Structured Growth",
              "Comprehensive learning plan with milestones",
              "Weekly progress assessments & feedback loops",
              "Multiple targeted oral exam simulations",
            ],
            ideal: "Learners aiming for level B or C with consistent guidance over 8-12 weeks.",
            popular: true,
          },
          {
            id: "mastery",
            name: "Mastery Program",
            duration: "30 Hours",
            price: 1899,
            description: "Our most comprehensive and transformative program",
            features: [
              "30-Hour Confidence System™",
              "Fully personalized bilingual roadmap",
              "Multiple exam simulations with real-time coaching",
              "Exclusive Speaking Skeleton™ Framework",
              "Guaranteed confidence and performance readiness",
            ],
            ideal: "Professionals seeking long-term mastery and promotion readiness.",
            popular: false,
          },
        ],
        customCoaching: {
          title: "Choose Your Coach Individually",
          description: "Select your preferred coach and book sessions at their hourly rate. Perfect for those who want flexibility and a personal connection with a specific coach.",
          cta: "Browse All Coaches",
        },
      },
      coaches: {
        title: "Meet Our Certified Coaches",
        subtitle: "Experienced, certified, and rigorously selected second-language professionals who specialize in adult learning and Government of Canada language exam preparation.",
        descriptions: {
          "soukaina": "A practical coach for BBB to CBC who connects language to real federal workplace communication. You'll build the right vocabulary, tone, and accuracy to sound natural in SLE-style speaking tasks and everyday GC scenarios.",
          "preciosa": "Perfect for public servants who need strong, professional English for meetings, briefings, and presentations—while boosting exam readiness. Sessions use real workplace scenarios and advanced conversation strategies to upgrade fluency fast.",
          "victor": "Known for BBB/CBC oral simulations that feel like the real thing—so exam day becomes familiar. Victor combines insider strategies with repeatable techniques to help you perform consistently and hit your target level.",
          "sue-anne": "If you want structure and precision, Sue-Anne is your coach for SLE oral and written success. Her step-by-step approach turns \"I'm not sure\" into clear, accurate answers—built through strategic practice and measurable progress.",
          "steven": "GC SLE Oral (B & C) specialist who helps public servants speak with calm, clarity, and control under pressure. Expect targeted exam-style questions, high-impact speaking frameworks, and confidence-building practice that feels supportive—but results-driven.",
          "erika": "Your performance coach for the SLE: focus, composure, and confidence when it matters most. Erika trains the exam mindset so you can stay clear, manage stress, and deliver your best speaking performance on demand.",
        },
        cta: "Book Free Trial Session",
        viewProfile: "View Full Profile",
      },
      testimonials: {
        title: "Trusted by Public Servants",
        subtitle: "Discover the success stories of our students in the Canadian public service",
        items: [
          {
            name: "Mithula Naik",
            role: "Director of Growth and Client Experience, Canadian Digital Service",
            quote: "If you're looking to learn from someone who can help you reach your full potential in French, Steven is that person. I've worked with Steven for over a year now, and he played an integral role in helping me develop my French language skills.",
            rating: 5,
          },
          {
            name: "Jena Cameron",
            role: "Manager, Canada Small Business Financing Program, ISED",
            quote: "Among the dozens of language teachers I have had over the years, I would rank Steven among the best. He is personable and engaging, organized and encouraging. Critically, he helped me target gaps in my knowledge and provided a clear path.",
            rating: 5,
          },
          {
            name: "Edith Bramwell",
            role: "Chairperson, Federal Public Sector Labour Relations and Employment Board",
            quote: "Excellent French as a second language instruction. A patient, thoughtful and personalized approach that leads to lasting improvement and more confidence. Highly recommended.",
            rating: 5,
          },
        ],
      },
      faq: {
        title: "Frequently Asked Questions",
        items: [
          {
            question: "What is the SLE (Second Language Evaluation)?",
            answer: "The SLE is a standardized test used by the Government of Canada to assess the second language proficiency of federal employees. It evaluates reading, writing, and oral interaction skills.",
          },
          {
            question: "How long does it take to prepare for the SLE?",
            answer: "Preparation time varies based on your current level. Most learners see significant improvement within 2-4 months of consistent practice with our program.",
          },
          {
            question: "Do you offer group classes or only individual coaching?",
            answer: "We offer both! Our self-paced courses include group workshops, and we also provide personalized 1-on-1 coaching sessions for targeted improvement.",
          },
          {
            question: "Is the training eligible for professional development funding?",
            answer: "Yes! Many federal departments cover language training costs. We can provide documentation for reimbursement requests.",
          },
          {
            question: "What if I don't pass my SLE after your training?",
            answer: "We offer a satisfaction guarantee. If you complete our program and don't see improvement, we'll provide additional coaching at no extra cost.",
          },
        ],
      },
      cta: {
        title: "Ready to Pass Your GC Language Exam?",
        description: "Join hundreds of public servants who have achieved their language goals with RusingAcademy's proven methodology.",
        button: "Start Your Journey Today",
        contact: "Or book a free 30-minute discovery call",
      },
    },
    fr: {
      hero: {
        badge: "Série Maîtrise Bilingue GC",
        title: "Arrêtez de deviner.",
        subtitle: "Commencez à réussir vos examens de langue seconde du GC.",
        description: "Formation linguistique accélérée conçue exclusivement pour les fonctionnaires fédéraux canadiens. Atteignez BBB, CBC ou CCC en suivant un parcours clair et structuré de A1 à C1.",
        highlight: "Maîtrisez le français ou l'anglais 3 à 4 fois plus vite avec une méthodologie éprouvée basée sur le coaching et les parcours.",
        cta: "Choisir votre coach",
        ctaSecondary: "Choisir votre parcours",
        tagline: "Structuré. Ciblé. Axé sur les résultats.",
        subTagline: "Pas de devinettes. Pas d'heures perdues. Une stratégie claire dès le premier jour.",
        stats: [
          { value: "95%", label: "Taux de réussite" },
          { value: "2 500+", label: "Fonctionnaires formés" },
          { value: "4.9/5", label: "Note moyenne" },
        ],
      },
      systemWorks: {
        title: "Comment fonctionne notre système structuré",
        subtitle: "Découvrez un parcours clair et axé sur les résultats vers l'excellence bilingue à travers trois étapes stratégiques conçues spécifiquement pour les fonctionnaires fédéraux canadiens.",
        steps: [
          {
            icon: Target,
            number: "1",
            title: "Diagnostic linguistique stratégique",
            description: "Nous commençons par un diagnostic linguistique stratégique qui va au-delà d'un simple test de placement. Il nous permet d'évaluer avec précision votre niveau actuel, vos compétences communicatives et vos lacunes pertinentes à l'examen.",
            result: "Le résultat est un aperçu clair et objectif de votre situation actuelle et de ce qui doit être priorisé pour vous faire avancer efficacement.",
          },
          {
            icon: FileText,
            number: "2",
            title: "Plan d'apprentissage personnalisé et axé sur les résultats",
            description: "Sur la base de votre diagnostic, nous concevons un plan d'apprentissage entièrement personnalisé aligné sur votre niveau cible (BBB, CBC ou CCC), votre contexte professionnel et vos contraintes de temps.",
            result: "Ce plan suit un parcours de progression structuré, garantissant que chaque activité d'apprentissage contribue directement à la préparation mesurable à l'examen.",
          },
          {
            icon: UserCheck,
            number: "3",
            title: "Choisissez le bon parcours et le soutien de coaching",
            description: "Vous sélectionnez ensuite le parcours d'apprentissage et l'option de coaching qui correspondent le mieux à vos objectifs, votre style d'apprentissage et votre disponibilité.",
            result: "À chaque étape, l'accent reste le même : clarté, efficacité et résultats — sans devinettes.",
          },
        ],
      },
      doubleModality: {
        title: "Deux façons d'apprendre. Un seul objectif clair.",
        subtitle: "Réussite aux examens de langue du GC et maîtrise réelle",
        description: "Notre système à double modalité combine l'apprentissage structuré en groupe avec le coaching personnalisé individuel pour assurer à la fois une progression stratégique et une maîtrise individuelle.",
        modalities: [
          {
            icon: BookOpen,
            title: "Apprentissage structuré en groupe",
            description: "Suivez un curriculum clairement défini dispensé à travers des leçons interactives conçues pour construire des bases linguistiques solides alignées sur les normes linguistiques du GC.",
            features: ["Progression claire du curriculum", "Leçons interactives", "Méthodologie Path Series™", "Développement constant à chaque niveau"],
          },
          {
            icon: Users,
            title: "Coaching personnalisé individuel",
            description: "Travaillez directement avec des coachs linguistiques certifiés du GC qui adaptent chaque session à votre style d'apprentissage, vos lacunes spécifiques et vos objectifs d'examen.",
            features: ["Renforcement de la confiance orale", "Stratégies d'examen", "Communication professionnelle réelle", "Progrès plus rapides et plus efficaces"],
          },
        ],
      },
      pricing: {
        title: "Choisissez votre plan de coaching",
        subtitle: "Options flexibles conçues pour correspondre à vos objectifs, votre calendrier et votre style d'apprentissage",
        tabStandard: "Plans RusingAcademy",
        tabCustom: "Coaching à la carte",
        plans: [
          {
            id: "boost",
            name: "Session Boost",
            duration: "1 Heure",
            price: 67,
            description: "Clarté rapide ou rétroaction professionnelle avant votre examen",
            features: [
              "1 heure de coaching précis",
              "Diagnostic rapide de votre performance orale",
              "Rétroaction personnalisée immédiate",
              "Mini-simulation ciblée sur vos points faibles",
            ],
            ideal: "Toute personne cherchant une clarté rapide ou une rétroaction professionnelle avant son examen.",
            popular: false,
          },
          {
            id: "quickprep",
            name: "Préparation Rapide",
            duration: "5 Heures",
            price: 299,
            description: "Pratique ciblée et stratégique pour les apprenants se préparant en 2-3 semaines",
            features: [
              "5 heures de coaching ciblé",
              "Évaluation diagnostique pour identifier les lacunes",
              "Plan d'apprentissage personnalisé avec thèmes ciblés",
              "Une simulation complète d'examen oral avec rétroaction",
            ],
            ideal: "Apprenants se préparant en 2-3 semaines qui ont besoin d'une pratique ciblée et stratégique.",
            popular: false,
          },
          {
            id: "progressive",
            name: "Progressif",
            duration: "15 Heures",
            price: 899,
            description: "Croissance structurée pour le niveau B ou C sur 8-12 semaines",
            features: [
              "15 heures de croissance structurée",
              "Plan d'apprentissage complet avec jalons",
              "Évaluations hebdomadaires des progrès et boucles de rétroaction",
              "Plusieurs simulations d'examen oral ciblées",
            ],
            ideal: "Apprenants visant le niveau B ou C avec un accompagnement constant sur 8-12 semaines.",
            popular: true,
          },
          {
            id: "mastery",
            name: "Programme Maîtrise",
            duration: "30 Heures",
            price: 1899,
            description: "Notre programme le plus complet et transformateur",
            features: [
              "Système de Confiance 30 heures™",
              "Feuille de route bilingue entièrement personnalisée",
              "Plusieurs simulations d'examen avec coaching en temps réel",
              "Cadre exclusif Speaking Skeleton™",
              "Confiance et préparation à la performance garanties",
            ],
            ideal: "Professionnels recherchant une maîtrise à long terme et une préparation à la promotion.",
            popular: false,
          },
        ],
        customCoaching: {
          title: "Choisissez votre coach individuellement",
          description: "Sélectionnez votre coach préféré et réservez des sessions à son tarif horaire. Parfait pour ceux qui veulent de la flexibilité et une connexion personnelle avec un coach spécifique.",
          cta: "Parcourir tous les coachs",
        },
      },
      coaches: {
        title: "Rencontrez nos coachs certifiés",
        subtitle: "Professionnels de la langue seconde expérimentés, certifiés et rigoureusement sélectionnés, spécialisés dans l'apprentissage des adultes et la préparation aux examens de langue du gouvernement du Canada.",
        descriptions: {
          "soukaina": "Une coach pratique pour BBB à CBC qui relie la langue à la communication réelle en milieu de travail fédéral. Vous développerez le bon vocabulaire, le ton et la précision pour paraître naturel dans les tâches orales de style ELS.",
          "preciosa": "Parfait pour les fonctionnaires qui ont besoin d'un anglais professionnel solide pour les réunions, les briefings et les présentations, tout en améliorant leur préparation à l'examen.",
          "victor": "Connu pour les simulations orales BBB/CBC qui ressemblent à la réalité — pour que le jour de l'examen devienne familier. Victor combine des stratégies d'initié avec des techniques répétables.",
          "sue-anne": "Si vous voulez de la structure et de la précision, Sue-Anne est votre coach pour réussir l'oral et l'écrit de l'ELS. Son approche étape par étape transforme « Je ne suis pas sûr » en réponses claires et précises.",
          "steven": "Spécialiste de l'oral ELS du GC (B et C) qui aide les fonctionnaires à parler avec calme, clarté et contrôle sous pression. Attendez-vous à des questions de style examen ciblées et des cadres de parole à fort impact.",
          "erika": "Votre coach de performance pour l'ELS : concentration, calme et confiance quand ça compte le plus. Erika entraîne la mentalité d'examen pour que vous puissiez rester clair et gérer le stress.",
        },
        cta: "Réserver une séance d'essai gratuite",
        viewProfile: "Voir le profil complet",
      },
      testimonials: {
        title: "La confiance des fonctionnaires",
        subtitle: "Découvrez les histoires de réussite de nos étudiants dans la fonction publique canadienne",
        items: [
          {
            name: "Mithula Naik",
            role: "Directrice de la croissance et de l'expérience client, Service numérique canadien",
            quote: "Si vous cherchez à apprendre de quelqu'un qui peut vous aider à atteindre votre plein potentiel en français, Steven est cette personne. Je travaille avec Steven depuis plus d'un an maintenant, et il a joué un rôle essentiel dans le développement de mes compétences en français.",
            rating: 5,
          },
          {
            name: "Jena Cameron",
            role: "Gestionnaire, Programme de financement des petites entreprises du Canada, ISDE",
            quote: "Parmi les dizaines de professeurs de langues que j'ai eus au fil des ans, je classerais Steven parmi les meilleurs. Il est sympathique et engageant, organisé et encourageant. Il m'a aidée à cibler les lacunes dans mes connaissances.",
            rating: 5,
          },
          {
            name: "Edith Bramwell",
            role: "Présidente, Commission des relations de travail et de l'emploi dans le secteur public fédéral",
            quote: "Excellent enseignement du français langue seconde. Une approche patiente, réfléchie et personnalisée qui mène à une amélioration durable et plus de confiance. Hautement recommandé.",
            rating: 5,
          },
        ],
      },
      faq: {
        title: "Questions fréquentes",
        items: [
          {
            question: "Qu'est-ce que l'ELS (Évaluation de langue seconde)?",
            answer: "L'ELS est un test standardisé utilisé par le gouvernement du Canada pour évaluer la compétence en langue seconde des employés fédéraux. Il évalue les compétences en lecture, écriture et interaction orale.",
          },
          {
            question: "Combien de temps faut-il pour se préparer à l'ELS?",
            answer: "Le temps de préparation varie selon votre niveau actuel. La plupart des apprenants voient une amélioration significative dans les 2-4 mois de pratique régulière avec notre programme.",
          },
          {
            question: "Offrez-vous des cours de groupe ou seulement du coaching individuel?",
            answer: "Nous offrons les deux! Nos cours auto-rythmés incluent des ateliers de groupe, et nous proposons également des séances de coaching 1-à-1 personnalisées pour une amélioration ciblée.",
          },
          {
            question: "La formation est-elle admissible au financement de développement professionnel?",
            answer: "Oui! De nombreux ministères fédéraux couvrent les coûts de formation linguistique. Nous pouvons fournir la documentation pour les demandes de remboursement.",
          },
          {
            question: "Que se passe-t-il si je ne réussis pas mon ELS après votre formation?",
            answer: "Nous offrons une garantie de satisfaction. Si vous complétez notre programme et ne voyez pas d'amélioration, nous fournirons du coaching supplémentaire sans frais.",
          },
        ],
      },
      cta: {
        title: "Prêt à réussir votre examen de langue du GC?",
        description: "Rejoignez des centaines de fonctionnaires qui ont atteint leurs objectifs linguistiques avec la méthodologie éprouvée de RusingAcademy.",
        button: "Commencer votre parcours aujourd'hui",
        contact: "Ou réservez un appel découverte gratuit de 30 minutes",
      },
    },
  };

  const c = content[language as keyof typeof content] || content.en;

  // Generate FAQ schema for SEO
  const faqSchema = generateFAQSchema(
    c.faq.items.map(item => ({ question: item.question, answer: item.answer }))
  );

  // Get coach description by name
  const getCoachDescription = (name: string) => {
    const key = name.toLowerCase().split(' ')[0];
    return c.coaches.descriptions[key as keyof typeof c.coaches.descriptions] || '';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      <SEO
        title={language === 'fr' ? 'Lingueefy - Coaching ELS Premium' : 'Lingueefy - Premium SLE Coaching'}
        description={c.hero.description}
        canonical="https://www.rusingacademy.ca/lingueefy"
        type="service"
        schema={faqSchema}
      />
      <Header />

      {/* Hero Section - Premium */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-gradient-to-br from-teal-400/20 to-emerald-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s' }} />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-gradient-to-br from-cyan-400/15 to-teal-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-to-r from-teal-500/5 via-emerald-500/10 to-cyan-500/5 rounded-full blur-3xl" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            {/* Badge */}
            <Badge className="mb-6 bg-gradient-to-r from-teal-500/10 to-emerald-500/10 border border-teal-500/20 text-teal-700 dark:text-teal-400 hover:bg-teal-100/50 px-4 py-2">
              <Zap className="w-4 h-4 mr-2" />
              {c.hero.badge}
            </Badge>
            
            {/* Main Title */}
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="text-red-500 line-through decoration-4">{c.hero.title}</span>
              <br />
              <span className="bg-gradient-to-r from-teal-600 via-emerald-500 to-cyan-500 bg-clip-text text-transparent">
                {c.hero.subtitle}
              </span>
            </h1>
            
            {/* Description */}
            <p className="text-xl text-slate-600 dark:text-slate-400 mb-4 max-w-3xl mx-auto">
              {c.hero.description}
            </p>
            
            {/* Highlight */}
            <p className="text-lg font-medium text-teal-700 dark:text-teal-400 mb-8 max-w-2xl mx-auto">
              {c.hero.highlight}
            </p>
            
            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link href="/coaches">
                <Button size="lg" className="bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white px-8 py-6 text-lg shadow-lg shadow-teal-500/25 hover:shadow-xl hover:shadow-teal-500/30 transition-all duration-300">
                  {c.hero.cta}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/courses">
                <Button size="lg" variant="outline" className="border-2 border-teal-600 text-teal-600 hover:bg-teal-50 dark:hover:bg-teal-900/20 px-8 py-6 text-lg">
                  <BookOpen className="mr-2 w-5 h-5" />
                  {c.hero.ctaSecondary}
                </Button>
              </Link>
            </div>

            {/* Tagline */}
            <div className="mb-12">
              <p className="text-lg font-semibold text-slate-800 dark:text-slate-200 flex items-center justify-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                {c.hero.tagline}
              </p>
              <p className="text-slate-600 dark:text-slate-400 mt-2 italic">
                {c.hero.subTagline}
              </p>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
              {c.hero.stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">{stat.value}</div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How Our Structured System Works */}
      <section 
        className="py-20 bg-white dark:bg-slate-900"
        ref={(el) => { if (el) sectionRefs.current.set('system', el); }}
        data-section-id="system"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-teal-100 dark:bg-teal-900/50 text-teal-700 dark:text-teal-400">
              <Target className="w-4 h-4 mr-2" />
              {language === 'fr' ? 'Notre Méthodologie' : 'Our Methodology'}
            </Badge>
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">{c.systemWorks.title}</h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">{c.systemWorks.subtitle}</p>
          </div>
          
          <div className="max-w-5xl mx-auto">
            {c.systemWorks.steps.map((step, index) => (
              <div 
                key={index} 
                className={`flex flex-col md:flex-row items-start gap-8 mb-12 ${
                  visibleSections.has('system') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                } transition-all duration-700`}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                {/* Step Number */}
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-teal-500/30">
                    {step.number}
                  </div>
                </div>
                
                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <step.icon className="w-6 h-6 text-teal-600" />
                    <h3 className="text-2xl font-semibold text-slate-900 dark:text-white">{step.title}</h3>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 mb-4">{step.description}</p>
                  <div className="bg-teal-50 dark:bg-teal-900/20 border-l-4 border-teal-500 p-4 rounded-r-lg">
                    <p className="text-teal-800 dark:text-teal-300 font-medium">{step.result}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Double-Modality System */}
      <section 
        className="py-20 bg-gradient-to-br from-slate-50 to-teal-50/30 dark:from-slate-800 dark:to-teal-900/20"
        ref={(el) => { if (el) sectionRefs.current.set('modality', el); }}
        data-section-id="modality"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-400">
              <Brain className="w-4 h-4 mr-2" />
              {language === 'fr' ? 'Double Modalité' : 'Double Modality'}
            </Badge>
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">{c.doubleModality.title}</h2>
            <p className="text-2xl font-medium text-teal-600 dark:text-teal-400 mb-4">{c.doubleModality.subtitle}</p>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">{c.doubleModality.description}</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {c.doubleModality.modalities.map((modality, index) => (
              <Card 
                key={index} 
                className={`border-0 shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden ${
                  visibleSections.has('modality') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                <div className="h-2 bg-gradient-to-r from-teal-500 to-emerald-500" />
                <CardContent className="p-8">
                  <div className="w-14 h-14 bg-gradient-to-br from-teal-100 to-emerald-100 dark:from-teal-900/50 dark:to-emerald-900/50 rounded-xl flex items-center justify-center mb-6">
                    <modality.icon className="w-7 h-7 text-teal-600" />
                  </div>
                  <h3 className="text-2xl font-semibold text-slate-900 dark:text-white mb-3">{modality.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-6">{modality.description}</p>
                  <ul className="space-y-3">
                    {modality.features.map((feature, i) => (
                      <li key={i} className="flex items-center text-slate-700 dark:text-slate-300">
                        <CheckCircle2 className="w-5 h-5 text-teal-500 mr-3 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section - Hybrid Grid */}
      <section 
        className="py-20 bg-white dark:bg-slate-900"
        ref={(el) => { if (el) sectionRefs.current.set('pricing', el); }}
        data-section-id="pricing"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-400">
              <Award className="w-4 h-4 mr-2" />
              {language === 'fr' ? 'Plans de Coaching' : 'Coaching Plans'}
            </Badge>
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">{c.pricing.title}</h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">{c.pricing.subtitle}</p>
          </div>

          {/* Plans Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto mb-16">
            {c.pricing.plans.map((plan, index) => (
              <Card 
                key={plan.id}
                className={`relative border-2 transition-all duration-500 hover:shadow-2xl ${
                  plan.popular 
                    ? 'border-teal-500 shadow-xl shadow-teal-500/20' 
                    : 'border-slate-200 dark:border-slate-700 hover:border-teal-300'
                } ${
                  visibleSections.has('pricing') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-teal-500 to-emerald-500 text-white px-4 py-1">
                      <Star className="w-3 h-3 mr-1 fill-white" />
                      {language === 'fr' ? 'Plus populaire' : 'Most Popular'}
                    </Badge>
                  </div>
                )}
                <CardContent className="p-6 pt-8">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">{plan.name}</h3>
                  <p className="text-sm text-teal-600 dark:text-teal-400 font-medium mb-4">{plan.duration}</p>
                  
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-slate-900 dark:text-white">${plan.price}</span>
                    <span className="text-slate-500 ml-1">CAD</span>
                  </div>
                  
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">{plan.description}</p>
                  
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start text-sm text-slate-700 dark:text-slate-300">
                        <CheckCircle2 className="w-4 h-4 text-teal-500 mr-2 mt-0.5 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-3 mb-6">
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      <span className="font-semibold">{language === 'fr' ? 'Idéal pour:' : 'Ideal for:'}</span> {plan.ideal}
                    </p>
                  </div>
                  
                  <Link href={`/checkout?plan=${plan.id}`}>
                    <Button 
                      className={`w-full ${
                        plan.popular 
                          ? 'bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white shadow-lg shadow-teal-500/25' 
                          : 'bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-100 text-white dark:text-slate-900'
                      }`}
                    >
                      {language === 'fr' ? 'Choisir ce plan' : 'Choose This Plan'}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* À la Carte Section */}
          <div className="max-w-3xl mx-auto">
            <Card className="border-2 border-dashed border-teal-300 dark:border-teal-700 bg-gradient-to-br from-teal-50/50 to-emerald-50/50 dark:from-teal-900/20 dark:to-emerald-900/20">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-teal-100 to-emerald-100 dark:from-teal-900/50 dark:to-emerald-900/50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="w-8 h-8 text-teal-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">{c.pricing.customCoaching.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-xl mx-auto">{c.pricing.customCoaching.description}</p>
                <Link href="/coaches">
                  <Button size="lg" variant="outline" className="border-2 border-teal-600 text-teal-600 hover:bg-teal-50 dark:hover:bg-teal-900/20">
                    {c.pricing.customCoaching.cta}
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Coaches Section with Videos (Italki-style) */}
      <FeaturedCoaches />

      {/* Testimonials */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-400">
              <Star className="w-4 h-4 mr-2 fill-amber-500" />
              {language === 'fr' ? 'Témoignages' : 'Testimonials'}
            </Badge>
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">{c.testimonials.title}</h2>
            <p className="text-xl text-slate-600 dark:text-slate-400">{c.testimonials.subtitle}</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {c.testimonials.items.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-8">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 mb-6 italic leading-relaxed">"{testimonial.quote}"</p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center text-white font-bold">
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-white">{testimonial.name}</div>
                      <div className="text-sm text-slate-500">{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-slate-50 dark:bg-slate-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-teal-100 dark:bg-teal-900/50 text-teal-700 dark:text-teal-400">
              <HelpCircle className="w-4 h-4 mr-2" />
              FAQ
            </Badge>
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">{c.faq.title}</h2>
          </div>
          
          <div className="max-w-3xl mx-auto space-y-4">
            {c.faq.items.map((item, index) => (
              <Card key={index} className="border-0 shadow-md overflow-hidden">
                <CardContent className="p-0">
                  <button
                    className="w-full p-6 text-left flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  >
                    <span className="font-semibold text-slate-900 dark:text-white pr-4">{item.question}</span>
                    <ChevronDown 
                      className={`w-5 h-5 text-teal-500 transition-transform flex-shrink-0 ${
                        openFaq === index ? 'rotate-180' : ''
                      }`} 
                    />
                  </button>
                  {openFaq === index && (
                    <div className="px-6 pb-6 text-slate-600 dark:text-slate-400 border-t border-slate-100 dark:border-slate-700 pt-4">
                      {item.answer}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-r from-teal-600 via-emerald-600 to-cyan-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">{c.cta.title}</h2>
          <p className="text-xl text-teal-100 mb-8 max-w-2xl mx-auto">{c.cta.description}</p>
          <Link href="/coaches">
            <Button size="lg" className="bg-white text-teal-600 hover:bg-teal-50 px-8 py-6 text-lg shadow-xl">
              {c.cta.button}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
          <p className="mt-4 text-teal-200">
            <Link href="/booking" className="underline hover:text-white transition-colors">
              {c.cta.contact}
            </Link>
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
