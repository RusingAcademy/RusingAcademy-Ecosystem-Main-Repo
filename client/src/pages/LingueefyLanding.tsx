import { useState } from "react";
import SEO, { generateFAQSchema } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
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
} from "lucide-react";
import { Link } from "wouter";

export default function LingueefyLanding() {
  const { t, language } = useLanguage();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const content = {
    en: {
      hero: {
        badge: "Official SLE Preparation",
        title: "Master Your French",
        subtitle: "for the Public Service",
        description: "Comprehensive preparation for the Second Language Evaluation (SLE) with expert coaches, AI-powered practice, and proven results.",
        cta: "Start Your Journey",
        ctaSecondary: "Book a Free Consultation",
        stats: [
          { value: "95%", label: "Success Rate" },
          { value: "2,500+", label: "Public Servants Trained" },
          { value: "4.9/5", label: "Average Rating" },
        ],
      },
      howItWorks: {
        title: "How It Works",
        subtitle: "Your path to SLE success in 4 simple steps",
        steps: [
          {
            icon: Target,
            title: "Assessment",
            description: "Take our diagnostic test to identify your current level and areas for improvement.",
          },
          {
            icon: BookOpen,
            title: "Personalized Plan",
            description: "Receive a customized learning path tailored to your goals and timeline.",
          },
          {
            icon: Headphones,
            title: "Practice & Learn",
            description: "Access interactive lessons, AI tutoring, and live coaching sessions.",
          },
          {
            icon: Award,
            title: "Certification",
            description: "Pass your SLE with confidence and advance your career.",
          },
        ],
      },
      services: {
        title: "Our Services",
        subtitle: "Everything you need to succeed",
        items: [
          {
            icon: GraduationCap,
            title: "SLE Oral Mastery",
            description: "Intensive preparation for the oral component with real exam simulations.",
            features: ["Live practice sessions", "Pronunciation coaching", "Exam strategies"],
          },
          {
            icon: PenTool,
            title: "SLE Written Excellence",
            description: "Master grammar, vocabulary, and writing techniques for the written test.",
            features: ["Grammar workshops", "Writing exercises", "Feedback & corrections"],
          },
          {
            icon: BookOpen,
            title: "SLE Reading Comprehension",
            description: "Develop speed reading and comprehension skills for the reading test.",
            features: ["Practice texts", "Time management", "Answer strategies"],
          },
          {
            icon: Users,
            title: "1-on-1 Coaching",
            description: "Personalized sessions with certified French language experts.",
            features: ["Flexible scheduling", "Custom curriculum", "Progress tracking"],
          },
        ],
      },
      testimonials: {
        title: "Success Stories",
        subtitle: "Hear from our graduates",
        items: [
          {
            name: "Sarah M.",
            role: "Policy Analyst, ESDC",
            quote: "I went from B to C level in just 3 months. The coaching was exceptional!",
            rating: 5,
          },
          {
            name: "David L.",
            role: "Program Officer, IRCC",
            quote: "The AI practice tool helped me build confidence for my oral exam. Highly recommend!",
            rating: 5,
          },
          {
            name: "Marie-Claire T.",
            role: "Manager, CRA",
            quote: "Finally passed my SLE after years of trying. Lingueefy made the difference.",
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
        title: "Ready to Advance Your Career?",
        description: "Join hundreds of public servants who have achieved their language goals with Lingueefy.",
        button: "Get Started Today",
        contact: "Or book a free consultation call",
      },
    },
    fr: {
      hero: {
        badge: "Préparation officielle ELS",
        title: "Maîtrisez Votre Français",
        subtitle: "pour la Fonction Publique",
        description: "Préparation complète pour l'Évaluation de langue seconde (ELS) avec des coachs experts, pratique assistée par IA et résultats prouvés.",
        cta: "Commencer Votre Parcours",
        ctaSecondary: "Réserver une Consultation Gratuite",
        stats: [          { value: "2,500+", label: "Public Servants Trained" },
          { value: "2,500+", label: "Fonctionnaires Formés" },
          { value: "4.9/5", label: "Note Moyenne" },
        ],
      },
      howItWorks: {
        title: "Comment Ça Marche",
        subtitle: "Votre chemin vers le succès ELS en 4 étapes simples",
        steps: [
          {
            icon: Target,
            title: "Évaluation",
            description: "Passez notre test diagnostique pour identifier votre niveau actuel et vos points à améliorer.",
          },
          {
            icon: BookOpen,
            title: "Plan Personnalisé",
            description: "Recevez un parcours d'apprentissage adapté à vos objectifs et votre calendrier.",
          },
          {
            icon: Headphones,
            title: "Pratiquez & Apprenez",
            description: "Accédez aux leçons interactives, au tutorat IA et aux séances de coaching en direct.",
          },
          {
            icon: Award,
            title: "Certification",
            description: "Réussissez votre ELS avec confiance et faites avancer votre carrière.",
          },
        ],
      },
      services: {
        title: "Nos Services",
        subtitle: "Tout ce dont vous avez besoin pour réussir",
        items: [
          {
            icon: GraduationCap,
            title: "Maîtrise Orale ELS",
            description: "Préparation intensive pour la composante orale avec simulations d'examen réelles.",
            features: ["Sessions de pratique en direct", "Coaching de prononciation", "Stratégies d'examen"],
          },
          {
            icon: PenTool,
            title: "Excellence Écrite ELS",
            description: "Maîtrisez la grammaire, le vocabulaire et les techniques d'écriture pour le test écrit.",
            features: ["Ateliers de grammaire", "Exercices d'écriture", "Rétroaction & corrections"],
          },
          {
            icon: BookOpen,
            title: "Compréhension de Lecture ELS",
            description: "Développez vos compétences en lecture rapide et compréhension pour le test de lecture.",
            features: ["Textes de pratique", "Gestion du temps", "Stratégies de réponse"],
          },
          {
            icon: Users,
            title: "Coaching 1-à-1",
            description: "Sessions personnalisées avec des experts certifiés en langue française.",
            features: ["Horaires flexibles", "Curriculum personnalisé", "Suivi des progrès"],
          },
        ],
      },
      testimonials: {
        title: "Histoires de Réussite",
        subtitle: "Écoutez nos diplômés",
        items: [
          {
            name: "Sarah M.",
            role: "Analyste de politiques, EDSC",
            quote: "Je suis passée du niveau B au niveau C en seulement 3 mois. Le coaching était exceptionnel!",
            rating: 5,
          },
          {
            name: "David L.",
            role: "Agent de programme, IRCC",
            quote: "L'outil de pratique IA m'a aidé à gagner confiance pour mon examen oral. Je recommande vivement!",
            rating: 5,
          },
          {
            name: "Marie-Claire T.",
            role: "Gestionnaire, ARC",
            quote: "J'ai enfin réussi mon ELS après des années d'essais. Lingueefy a fait la différence.",
            rating: 5,
          },
        ],
      },
      faq: {
        title: "Questions Fréquentes",
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
        title: "Prêt à Faire Avancer Votre Carrière?",
        description: "Rejoignez des centaines de fonctionnaires qui ont atteint leurs objectifs linguistiques avec Lingueefy.",
        button: "Commencer Aujourd'hui",
        contact: "Ou réservez un appel de consultation gratuit",
      },
    },
  };

  const c = content[language as keyof typeof content] || content.en;

  // Generate FAQ schema for SEO
  const faqSchema = generateFAQSchema(
    c.faq.items.map(item => ({ question: item.question, answer: item.answer }))
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <SEO
        title={language === 'fr' ? 'Lingueefy - Préparation ELS' : 'Lingueefy - SLE Preparation'}
        description={c.hero.description}
        canonical="https://www.rusingacademy.ca/lingueefy"
        type="service"
        schema={faqSchema}
      />
      <Header />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-600/10 via-transparent to-orange-500/10" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-teal-400/20 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-orange-400/20 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 bg-teal-100 text-teal-700 hover:bg-teal-100">
              <Zap className="w-4 h-4 mr-1" />
              {c.hero.badge}
            </Badge>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="text-slate-900">{c.hero.title}</span>
              <br />
              <span className="bg-gradient-to-r from-teal-600 to-teal-500 bg-clip-text text-transparent">
                {c.hero.subtitle}
              </span>
            </h1>
            
            <p className="text-xl text-slate-700 mb-8 max-w-2xl mx-auto">
              {c.hero.description}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link href="/courses">
                <Button size="lg" className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-6 text-lg">
                  {c.hero.cta}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/booking">
                <Button size="lg" variant="outline" className="border-2 border-teal-600 text-teal-600 hover:bg-teal-50 px-8 py-6 text-lg">
                  <Calendar className="mr-2 w-5 h-5" />
                  {c.hero.ctaSecondary}
                </Button>
              </Link>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
              {c.hero.stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-teal-600">{stat.value}</div>
                  <div className="text-sm text-slate-700">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">{c.howItWorks.title}</h2>
            <p className="text-xl text-slate-700">{c.howItWorks.subtitle}</p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {c.howItWorks.steps.map((step, index) => (
              <div key={index} className="relative text-center">
                <div className="w-16 h-16 bg-teal-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <step.icon className="w-8 h-8 text-teal-600" />
                </div>
                <div className="absolute top-8 left-1/2 w-full h-0.5 bg-teal-200 -z-10 hidden md:block" 
                     style={{ display: index === 3 ? 'none' : undefined }} />
                <h3 className="text-xl font-semibold text-slate-900 mb-2">{step.title}</h3>
                <p className="text-slate-700">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">{c.services.title}</h2>
            <p className="text-xl text-slate-700">{c.services.subtitle}</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {c.services.items.map((service, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-8">
                  <div className="w-14 h-14 bg-teal-100 rounded-xl flex items-center justify-center mb-6">
                    <service.icon className="w-7 h-7 text-teal-600" />
                  </div>
                  <h3 className="text-2xl font-semibold text-slate-900 mb-3">{service.title}</h3>
                  <p className="text-slate-700 mb-4">{service.description}</p>
                  <ul className="space-y-2">
                    {service.features.map((feature, i) => (
                      <li key={i} className="flex items-center text-slate-700">
                        <CheckCircle2 className="w-5 h-5 text-teal-500 mr-2 flex-shrink-0" />
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

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">{c.testimonials.title}</h2>
            <p className="text-xl text-slate-700">{c.testimonials.subtitle}</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {c.testimonials.items.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardContent className="p-8">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                  <p className="text-slate-700 mb-6 italic">"{testimonial.quote}"</p>
                  <div>
                    <div className="font-semibold text-slate-900">{testimonial.name}</div>
                    <div className="text-sm text-slate-700">{testimonial.role}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">{c.faq.title}</h2>
          </div>
          
          <div className="max-w-3xl mx-auto space-y-4">
            {c.faq.items.map((item, index) => (
              <Card key={index} className="border-0 shadow-md">
                <CardContent className="p-0">
                  <button
                    className="w-full p-6 text-left flex items-center justify-between"
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  >
                    <span className="font-semibold text-slate-900 pr-4">{item.question}</span>
                    <ChevronDown 
                      className={`w-5 h-5 text-slate-700 transition-transform flex-shrink-0 ${
                        openFaq === index ? 'rotate-180' : ''
                      }`} 
                    />
                  </button>
                  {openFaq === index && (
                    <div className="px-6 pb-6 text-slate-700">
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
      <section className="py-20 bg-gradient-to-r from-teal-600 to-teal-700">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">{c.cta.title}</h2>
          <p className="text-xl text-teal-100 mb-8 max-w-2xl mx-auto">{c.cta.description}</p>
          <Link href="/courses">
            <Button size="lg" className="bg-white text-teal-600 hover:bg-teal-50 px-8 py-6 text-lg">
              {c.cta.button}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
          <p className="mt-4 text-teal-200">
            <Link href="/booking" className="underline hover:text-white">
              {c.cta.contact}
            </Link>
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
