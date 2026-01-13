import { useLanguage } from "@/contexts/LanguageContext";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Bot, 
  Brain, 
  Clock, 
  MessageSquare, 
  Target, 
  Zap,
  CheckCircle,
  ArrowRight,
  Sparkles,
  BarChart3,
  Headphones,
  PenTool
} from "lucide-react";

const content = {
  en: {
    seo: {
      title: "AI Coach for SLE Exam Preparation | Instant Feedback & Real Simulations",
      description: "Practice for your Public Service Commission SLE exam with our AI-powered coach. Get instant feedback, unlimited practice sessions, and realistic exam simulations 24/7."
    },
    hero: {
      title: "AI-Powered SLE Exam Preparation",
      subtitle: "Practice Anytime. Get Instant Feedback. Pass Your Exam.",
      description: "Our advanced AI coach simulates real Public Service Commission SLE exams, providing instant feedback and personalized recommendations to accelerate your path to bilingual certification.",
      cta: "Start Free AI Practice Session"
    },
    whoFor: {
      title: "Who Is This For?",
      items: [
        "Federal employees preparing for SLE Reading, Writing, or Oral tests",
        "Candidates who need flexible, on-demand practice outside business hours",
        "Learners who want unlimited repetition without scheduling constraints",
        "Those seeking immediate feedback to identify and fix weaknesses fast",
        "Public servants targeting BBB, CBC, or C levels"
      ]
    },
    whatYouGet: {
      title: "What You Get",
      items: [
        {
          icon: "Bot",
          title: "24/7 AI Availability",
          description: "Practice anytime, anywhere. No scheduling required. Your AI coach is always ready."
        },
        {
          icon: "Target",
          title: "Real PSC Exam Simulations",
          description: "Experience authentic SLE test formats with questions modeled on actual Public Service Commission exams."
        },
        {
          icon: "Zap",
          title: "Instant Feedback",
          description: "Receive immediate, detailed analysis of your answers with specific improvement suggestions."
        },
        {
          icon: "Brain",
          title: "Adaptive Learning",
          description: "AI identifies your weak areas and automatically adjusts practice to target them."
        },
        {
          icon: "BarChart3",
          title: "Progress Tracking",
          description: "Visual dashboards show your improvement over time with predictive readiness scores."
        },
        {
          icon: "MessageSquare",
          title: "Oral Practice Mode",
          description: "Practice speaking French with AI-powered conversation simulations and pronunciation feedback."
        }
      ]
    },
    examTypes: {
      title: "Practice All SLE Components",
      items: [
        {
          icon: "PenTool",
          title: "Written Expression",
          description: "AI-graded writing exercises with grammar, vocabulary, and structure feedback."
        },
        {
          icon: "Target",
          title: "Reading Comprehension",
          description: "Timed reading tests with instant scoring and explanation of correct answers."
        },
        {
          icon: "Headphones",
          title: "Oral Interaction",
          description: "Voice-based practice with AI that evaluates fluency, accuracy, and appropriateness."
        }
      ]
    },
    proof: {
      title: "Why AI + Human Coaching Wins",
      stats: [
        { value: "3x", label: "More practice time vs. scheduled sessions only" },
        { value: "24/7", label: "Availability for busy public servants" },
        { value: "Instant", label: "Feedback vs. waiting days for corrections" }
      ],
      testimonials: [
        {
          quote: "The AI coach helped me practice at 11pm after putting my kids to bed. I couldn't have done that with a human tutor. I passed my oral exam on the first try!",
          author: "Policy Analyst, ESDC",
          level: "Achieved Level C Oral"
        },
        {
          quote: "Unlimited practice changed everything. I could repeat difficult exercises 20 times until I mastered them. The instant feedback kept me motivated.",
          author: "Program Officer, IRCC",
          level: "Achieved BBB"
        }
      ]
    },
    faq: {
      title: "Frequently Asked Questions",
      items: [
        {
          q: "How accurate are the AI exam simulations?",
          a: "Our AI simulations are modeled on actual PSC SLE exam formats, question types, and difficulty levels. While not official PSC tests, they provide realistic practice that prepares you for the real exam experience."
        },
        {
          q: "Can AI really evaluate my oral French?",
          a: "Yes! Our AI uses advanced speech recognition and natural language processing to evaluate pronunciation, fluency, grammar, and vocabulary. It provides detailed feedback similar to what a human evaluator would note."
        },
        {
          q: "Is AI coaching a replacement for human coaches?",
          a: "AI coaching complements human coaching. Use AI for unlimited practice and instant feedback, then work with human coaches for nuanced guidance, exam strategies, and complex questions. Many of our most successful learners use both."
        },
        {
          q: "How many practice sessions can I do?",
          a: "Unlimited! Unlike human coaching sessions, you can practice as many times as you want, whenever you want. This is especially valuable for repetitive exercises like grammar drills or reading comprehension."
        },
        {
          q: "What levels can I practice for?",
          a: "Our AI coach supports practice for all SLE levels: A, B, and C. The system adapts to your current level and progressively challenges you as you improve."
        },
        {
          q: "Is my practice data private?",
          a: "Absolutely. All your practice sessions and performance data are encrypted and private. We never share individual data with employers or anyone else."
        }
      ]
    },
    cta: {
      title: "Start Practicing with AI Today",
      description: "Join thousands of public servants who accelerated their SLE preparation with AI-powered practice.",
      button: "Try AI Coach Free"
    }
  },
  fr: {
    seo: {
      title: "Coach IA pour préparation ELS | Rétroaction instantanée et simulations réelles",
      description: "Pratiquez pour votre examen ELS de la Commission de la fonction publique avec notre coach propulsé par l'IA. Obtenez une rétroaction instantanée, des séances de pratique illimitées et des simulations d'examen réalistes 24/7."
    },
    hero: {
      title: "Préparation ELS propulsée par l'IA",
      subtitle: "Pratiquez à tout moment. Rétroaction instantanée. Réussissez votre examen.",
      description: "Notre coach IA avancé simule les vrais examens ELS de la Commission de la fonction publique, fournissant une rétroaction instantanée et des recommandations personnalisées pour accélérer votre chemin vers la certification bilingue.",
      cta: "Commencer une séance gratuite avec l'IA"
    },
    whoFor: {
      title: "À qui s'adresse ce service?",
      items: [
        "Employés fédéraux se préparant aux tests ELS de lecture, écriture ou oral",
        "Candidats ayant besoin de pratique flexible, sur demande, en dehors des heures de bureau",
        "Apprenants souhaitant une répétition illimitée sans contraintes d'horaire",
        "Ceux qui cherchent une rétroaction immédiate pour identifier et corriger rapidement leurs faiblesses",
        "Fonctionnaires visant les niveaux BBB, CBC ou C"
      ]
    },
    whatYouGet: {
      title: "Ce que vous obtenez",
      items: [
        {
          icon: "Bot",
          title: "Disponibilité 24/7",
          description: "Pratiquez à tout moment, n'importe où. Aucune réservation requise. Votre coach IA est toujours prêt."
        },
        {
          icon: "Target",
          title: "Simulations réelles d'examen CFP",
          description: "Vivez des formats de test ELS authentiques avec des questions modelées sur les vrais examens de la Commission de la fonction publique."
        },
        {
          icon: "Zap",
          title: "Rétroaction instantanée",
          description: "Recevez une analyse détaillée immédiate de vos réponses avec des suggestions d'amélioration spécifiques."
        },
        {
          icon: "Brain",
          title: "Apprentissage adaptatif",
          description: "L'IA identifie vos points faibles et ajuste automatiquement la pratique pour les cibler."
        },
        {
          icon: "BarChart3",
          title: "Suivi des progrès",
          description: "Des tableaux de bord visuels montrent votre amélioration au fil du temps avec des scores de préparation prédictifs."
        },
        {
          icon: "MessageSquare",
          title: "Mode pratique orale",
          description: "Pratiquez le français parlé avec des simulations de conversation propulsées par l'IA et une rétroaction sur la prononciation."
        }
      ]
    },
    examTypes: {
      title: "Pratiquez tous les volets ELS",
      items: [
        {
          icon: "PenTool",
          title: "Expression écrite",
          description: "Exercices d'écriture notés par l'IA avec rétroaction sur la grammaire, le vocabulaire et la structure."
        },
        {
          icon: "Target",
          title: "Compréhension de l'écrit",
          description: "Tests de lecture chronométrés avec notation instantanée et explication des bonnes réponses."
        },
        {
          icon: "Headphones",
          title: "Interaction orale",
          description: "Pratique vocale avec une IA qui évalue la fluidité, la précision et la pertinence."
        }
      ]
    },
    proof: {
      title: "Pourquoi IA + coaching humain gagne",
      stats: [
        { value: "3x", label: "Plus de temps de pratique vs. séances planifiées seulement" },
        { value: "24/7", label: "Disponibilité pour les fonctionnaires occupés" },
        { value: "Instantané", label: "Rétroaction vs. attendre des jours pour les corrections" }
      ],
      testimonials: [
        {
          quote: "Le coach IA m'a permis de pratiquer à 23h après avoir couché mes enfants. Je n'aurais pas pu faire ça avec un tuteur humain. J'ai réussi mon examen oral du premier coup!",
          author: "Analyste de politiques, EDSC",
          level: "Niveau C oral atteint"
        },
        {
          quote: "La pratique illimitée a tout changé. Je pouvais répéter les exercices difficiles 20 fois jusqu'à les maîtriser. La rétroaction instantanée me gardait motivé.",
          author: "Agent de programme, IRCC",
          level: "BBB atteint"
        }
      ]
    },
    faq: {
      title: "Questions fréquemment posées",
      items: [
        {
          q: "Quelle est la précision des simulations d'examen IA?",
          a: "Nos simulations IA sont modelées sur les formats d'examen ELS réels de la CFP, les types de questions et les niveaux de difficulté. Bien qu'il ne s'agisse pas de tests officiels de la CFP, elles offrent une pratique réaliste qui vous prépare à l'expérience réelle de l'examen."
        },
        {
          q: "L'IA peut-elle vraiment évaluer mon français oral?",
          a: "Oui! Notre IA utilise la reconnaissance vocale avancée et le traitement du langage naturel pour évaluer la prononciation, la fluidité, la grammaire et le vocabulaire. Elle fournit une rétroaction détaillée similaire à ce qu'un évaluateur humain noterait."
        },
        {
          q: "Le coaching IA remplace-t-il les coachs humains?",
          a: "Le coaching IA complète le coaching humain. Utilisez l'IA pour une pratique illimitée et une rétroaction instantanée, puis travaillez avec des coachs humains pour des conseils nuancés, des stratégies d'examen et des questions complexes. Beaucoup de nos apprenants les plus performants utilisent les deux."
        },
        {
          q: "Combien de séances de pratique puis-je faire?",
          a: "Illimitées! Contrairement aux séances de coaching humain, vous pouvez pratiquer autant de fois que vous le souhaitez, quand vous le souhaitez. C'est particulièrement précieux pour les exercices répétitifs comme les exercices de grammaire ou la compréhension de lecture."
        },
        {
          q: "Pour quels niveaux puis-je pratiquer?",
          a: "Notre coach IA prend en charge la pratique pour tous les niveaux ELS: A, B et C. Le système s'adapte à votre niveau actuel et vous met progressivement au défi à mesure que vous vous améliorez."
        },
        {
          q: "Mes données de pratique sont-elles privées?",
          a: "Absolument. Toutes vos séances de pratique et données de performance sont cryptées et privées. Nous ne partageons jamais de données individuelles avec les employeurs ou quiconque."
        }
      ]
    },
    cta: {
      title: "Commencez à pratiquer avec l'IA aujourd'hui",
      description: "Rejoignez des milliers de fonctionnaires qui ont accéléré leur préparation ELS avec la pratique propulsée par l'IA.",
      button: "Essayer le coach IA gratuitement"
    }
  }
};

const iconMap: Record<string, React.ElementType> = {
  Bot,
  Brain,
  Clock,
  MessageSquare,
  Target,
  Zap,
  Sparkles,
  BarChart3,
  Headphones,
  PenTool
};

export default function AICoachSLEPreparation() {
  const { language } = useLanguage();
  const t = content[language as keyof typeof content] || content.en;

  return (
    <>
      <SEO
        title={t.seo.title}
        description={t.seo.description}
        type="website"
      />
      
      <div className="min-h-screen bg-gradient-to-b from-violet-50 via-white to-purple-50">
        {/* Hero Section */}
        <section className="relative py-20 lg:py-28 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-violet-600/10 to-purple-600/10" />
          <div className="container mx-auto px-4 relative">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-violet-100 rounded-full text-violet-700 text-sm font-medium mb-6">
                <Sparkles className="w-4 h-4" />
                <span>AI-Powered Learning</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                {t.hero.title}
              </h1>
              <p className="text-xl md:text-2xl text-violet-700 font-semibold mb-4">
                {t.hero.subtitle}
              </p>
              <p className="text-lg text-gray-600 mb-8 max-w-3xl mx-auto">
                {t.hero.description}
              </p>
              <Button size="lg" className="bg-violet-600 hover:bg-violet-700 text-lg px-8 py-6">
                <Bot className="w-5 h-5 mr-2" />
                {t.hero.cta}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        </section>

        {/* Who Is This For */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              {t.whoFor.title}
            </h2>
            <div className="max-w-3xl mx-auto">
              <ul className="space-y-4">
                {t.whoFor.items.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-violet-600 flex-shrink-0 mt-0.5" />
                    <span className="text-lg text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* What You Get */}
        <section className="py-16 bg-gradient-to-b from-violet-50 to-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              {t.whatYouGet.title}
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {t.whatYouGet.items.map((item, index) => {
                const Icon = iconMap[item.icon] || Bot;
                return (
                  <Card key={index} className="border-violet-100 hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="w-12 h-12 bg-violet-100 rounded-lg flex items-center justify-center mb-4">
                        <Icon className="w-6 h-6 text-violet-600" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {item.title}
                      </h3>
                      <p className="text-gray-600">
                        {item.description}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Exam Types */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              {t.examTypes.title}
            </h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {t.examTypes.items.map((item, index) => {
                const Icon = iconMap[item.icon] || Target;
                return (
                  <div key={index} className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {item.title}
                    </h3>
                    <p className="text-gray-600">
                      {item.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Proof Section */}
        <section className="py-16 bg-gradient-to-b from-violet-900 to-purple-900 text-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              {t.proof.title}
            </h2>
            
            {/* Stats */}
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-16">
              {t.proof.stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-4xl md:text-5xl font-bold text-violet-300 mb-2">
                    {stat.value}
                  </div>
                  <div className="text-violet-200">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Testimonials */}
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {t.proof.testimonials.map((testimonial, index) => (
                <Card key={index} className="bg-white/10 border-white/20">
                  <CardContent className="p-6">
                    <p className="text-lg text-white/90 italic mb-4">
                      "{testimonial.quote}"
                    </p>
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-violet-300 font-medium">{testimonial.author}</p>
                      </div>
                      <span className="text-xs bg-violet-500/30 px-3 py-1 rounded-full text-violet-200">
                        {testimonial.level}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              {t.faq.title}
            </h2>
            <div className="max-w-3xl mx-auto space-y-6">
              {t.faq.items.map((item, index) => (
                <Card key={index} className="border-gray-200">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {item.q}
                    </h3>
                    <p className="text-gray-600">
                      {item.a}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-20 bg-gradient-to-r from-violet-600 to-purple-600">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {t.cta.title}
            </h2>
            <p className="text-xl text-violet-100 mb-8 max-w-2xl mx-auto">
              {t.cta.description}
            </p>
            <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
              <Bot className="w-5 h-5 mr-2" />
              {t.cta.button}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </section>
      </div>
    </>
  );
}
