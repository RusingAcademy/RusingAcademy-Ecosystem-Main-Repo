import { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import WaveDivider from "@/components/WaveDivider";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import {
  Zap,
  Brain,
  Mic,
  BookOpen,
  Target,
  Award,
  MessageSquare,
  Clock,
  CheckCircle,
  ArrowRight,
  Star,
  Sparkles,
  Headphones,
  PenTool,
  BarChart3,
  Shield,
  Globe,
  Building2,
  Play,
  Users,
  Send,
  Loader2,
} from "lucide-react";
import { useAppLayout } from "@/contexts/AppLayoutContext";

// Photos des coaches SLE AI pour l'alternance
const coachPhotos = [
  "https://files.manuscdn.com/user_upload_by_module/session_file/310519663049070748/ZJMGlYUBMnPQOWah.jpg",
  "https://files.manuscdn.com/user_upload_by_module/session_file/310519663049070748/QcRxxmElWaUToFYt.jpg",
  "https://files.manuscdn.com/user_upload_by_module/session_file/310519663049070748/xpWyNODXrLhyLGLr.jpg",
  "https://files.manuscdn.com/user_upload_by_module/session_file/310519663049070748/UZJdzqXRKyBtsmSe.jpg",
];

type ChatMessage = { role: "user" | "assistant"; content: string };

export default function AICoach() {
  const { isInsideAppLayout } = useAppLayout();
  const { language } = useLanguage();
  const isEn = language === "en";

  // Interactive AI Chat state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { role: "assistant", content: isEn
      ? "Hello! I'm your SLE AI Coach. Ask me anything about SLE preparation, French grammar, or practice scenarios. How can I help you today?"
      : "Bonjour! Je suis votre coach IA ELS. Posez-moi vos questions sur la pr\u00e9paration ELS, la grammaire fran\u00e7aise ou les sc\u00e9narios de pratique. Comment puis-je vous aider aujourd'hui?" },
  ]);
  const [chatInput, setChatInput] = useState("");
  const chatScrollRef = useRef<HTMLDivElement>(null);
  const quickChatMutation = trpc.ai.quickChat.useMutation({
    onSuccess: (data) => {
      setChatMessages(prev => [...prev, { role: "assistant", content: data.content }]);
    },
    onError: () => {
      setChatMessages(prev => [...prev, { role: "assistant", content: isEn ? "Sorry, I'm temporarily unavailable. Please try again." : "D\u00e9sol\u00e9, je suis temporairement indisponible. Veuillez r\u00e9essayer." }]);
    },
  });
  const chatPending = quickChatMutation.isPending;

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [chatMessages, chatPending]);

  const handleSendChat = (text: string) => {
    const msg = text.trim();
    if (!msg || chatPending) return;
    setChatInput("");
    const userMsg: ChatMessage = { role: "user", content: msg };
    setChatMessages(prev => [...prev, userMsg]);
    quickChatMutation.mutate({
      message: msg,
      conversationHistory: chatMessages.filter(m => m.role !== "assistant" || chatMessages.indexOf(m) > 0).map(m => ({ role: m.role, content: m.content })),
    });
  };

  const labels = {
    en: {
      heroStats: [
        { value: "24/7", label: "Available" },
        { value: "Free", label: "Forever" },
        { value: "1000+", label: "Practice Sessions" },
        { value: "95%", label: "User Satisfaction" },
      ],
      features: [
        {
          icon: Mic,
          title: "Oral Practice",
          description: "Practice speaking with real-time pronunciation feedback and conversation simulations.",
          color: "bg-blue-100 text-blue-600",
          coachIndex: 0,
        },
        {
          icon: PenTool,
          title: "Written Expression",
          description: "Improve your writing skills with grammar correction and style suggestions.",
          color: "bg-emerald-100 text-emerald-600",
          coachIndex: 1,
        },
        {
          icon: BookOpen,
          title: "Reading Comprehension",
          description: "Enhance your reading skills with adaptive difficulty texts and comprehension exercises.",
          color: "bg-foundation-soft text-foundation",
          coachIndex: 2,
        },
        {
          icon: Target,
          title: "SLE Exam Simulation",
          description: "Practice with realistic exam scenarios and get detailed performance analysis.",
          color: "bg-amber-100 text-amber-600",
          coachIndex: 3,
        },
        {
          icon: BarChart3,
          title: "Progress Tracking",
          description: "Monitor your improvement with detailed analytics and personalized recommendations.",
          color: "bg-cta-soft text-cta",
          coachIndex: 0,
        },
        {
          icon: Brain,
          title: "Adaptive Learning",
          description: "AI adjusts difficulty based on your performance for optimal learning pace.",
          color: "bg-teal-100 text-teal-600",
          coachIndex: 1,
        },
      ],
      howItWorks: [
        { step: "1", title: "Start a Session", description: "Choose your practice type: oral, written, or reading.", coachIndex: 0 },
        { step: "2", title: "Practice with AI", description: "Engage in realistic conversations and exercises.", coachIndex: 1 },
        { step: "3", title: "Get Feedback", description: "Receive instant, detailed feedback on your performance.", coachIndex: 2 },
        { step: "4", title: "Track Progress", description: "Review your improvement and identify areas to focus on.", coachIndex: 3 },
      ],
      testimonials: [
        {
          name: "Steven Barholere",
          role: "Founder & Lead Coach, Lingueefy",
          quote: "The AI coach helped me practice oral French every day. I achieved my B level in just 3 months!",
          rating: 5,
        },
        {
          name: "Sue-Anne Richer",
          role: "Senior Language Coach, Lingueefy",
          quote: "Being able to practice 24/7 made all the difference. The feedback is incredibly detailed.",
          rating: 5,
        },
        {
          name: "Erica Seguin",
          role: "Language Coach, Lingueefy",
          quote: "The exam simulations were so realistic. I felt completely prepared for my actual SLE test.",
          rating: 5,
        },
      ],
    },
    fr: {
      heroStats: [
        { value: "24/7", label: "Disponible" },
        { value: "Gratuit", label: "Pour toujours" },
        { value: "1000+", label: "Sessions de pratique" },
        { value: "95%", label: "Satisfaction" },
      ],
      features: [
        {
          icon: Mic,
          title: "Pratique orale",
          description: "Pratiquez la parole avec des commentaires en temps réel sur la prononciation et des simulations de conversation.",
          color: "bg-blue-100 text-blue-600",
          coachIndex: 0,
        },
        {
          icon: PenTool,
          title: "Expression écrite",
          description: "Améliorez vos compétences en écriture avec correction grammaticale et suggestions de style.",
          color: "bg-emerald-100 text-emerald-600",
          coachIndex: 1,
        },
        {
          icon: BookOpen,
          title: "Compréhension de lecture",
          description: "Améliorez vos compétences en lecture avec des textes à difficulté adaptative.",
          color: "bg-foundation-soft text-foundation",
          coachIndex: 2,
        },
        {
          icon: Target,
          title: "Simulation d'examen ELS",
          description: "Pratiquez avec des scénarios d'examen réalistes et obtenez une analyse détaillée.",
          color: "bg-amber-100 text-amber-600",
          coachIndex: 3,
        },
        {
          icon: BarChart3,
          title: "Suivi des progrès",
          description: "Surveillez votre amélioration avec des analyses détaillées et des recommandations.",
          color: "bg-cta-soft text-cta",
          coachIndex: 0,
        },
        {
          icon: Brain,
          title: "Apprentissage adaptatif",
          description: "L'IA ajuste la difficulté en fonction de vos performances pour un rythme optimal.",
          color: "bg-teal-100 text-teal-600",
          coachIndex: 1,
        },
      ],
      howItWorks: [
        { step: "1", title: "Démarrer une session", description: "Choisissez votre type de pratique: oral, écrit ou lecture.", coachIndex: 0 },
        { step: "2", title: "Pratiquer avec l'IA", description: "Engagez-vous dans des conversations et exercices réalistes.", coachIndex: 1 },
        { step: "3", title: "Obtenir des commentaires", description: "Recevez des commentaires instantanés et détaillés.", coachIndex: 2 },
        { step: "4", title: "Suivre les progrès", description: "Examinez votre amélioration et identifiez les domaines à cibler.", coachIndex: 3 },
      ],
      testimonials: [
        {
          name: "Steven Barholere",
          role: "Fondateur et coach principal, Lingueefy",
          quote: "Le coach IA m'a aidée à pratiquer le français oral chaque jour. J'ai atteint mon niveau B en seulement 3 mois!",
          rating: 5,
        },
        {
          name: "Sue-Anne Richer",
          role: "Coach linguistique senior, Lingueefy",
          quote: "Pouvoir pratiquer 24/7 a fait toute la différence. Les commentaires sont incroyablement détaillés.",
          rating: 5,
        },
        {
          name: "Erica Seguin",
          role: "Coach linguistique, Lingueefy",
          quote: "Les simulations d'examen étaient si réalistes. Je me sentais complètement préparée pour mon test ELS.",
          rating: 5,
        },
      ],
    },
  };

  const l = labels[language as keyof typeof labels] || labels.en;

  // Federal organizations for trust section
  const federalOrgs = [
    { name: "Treasury Board", abbr: "TBS" },
    { name: "Health Canada", abbr: "HC" },
    { name: "ESDC", abbr: "ESDC" },
    { name: "CRA", abbr: "CRA" },
    { name: "IRCC", abbr: "IRCC" },
    { name: "DND", abbr: "DND" },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-white/[0.08] dark:backdrop-blur-md">

      <main>
        {/* Hero Section - Premium Dark Gradient */}
        <section className="relative bg-gradient-to-br from-teal-900 via-teal-800 to-obsidian text-white overflow-hidden">
          <WaveDivider variant="smooth" color="white" backgroundColor="transparent" orientation="bottom" />
          {/* Background decorations */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-20 left-10 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-teal-400/5 rounded-full blur-3xl" />
          </div>

          <div className="container relative py-20 md:py-28">
            <div className="max-w-4xl mx-auto text-center">
              {/* Badge with coach photo */}
              <Badge className="mb-6 bg-white/20 dark:bg-white/[0.08] dark:backdrop-blur-md/10 text-slate-900 dark:text-white border-white/60 backdrop-blur-sm px-4 py-2">
                <img loading="lazy" decoding="async"
                  src={coachPhotos[0]} 
                  alt="SLE AI Coach" 
                  className="h-5 w-5 rounded-full object-cover mr-2 ring-1 ring-white/30"
                />
                {isEn ? "AI-Powered Learning" : "Apprentissage alimenté par l'IA"}
              </Badge>

              {/* Title */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                {isEn ? (
                  <>
                    <span className="bg-gradient-to-r from-teal-300 to-emerald-300 bg-clip-text text-transparent">SLE AI Companion</span>
                    <br />Your Personal Language Coach
                  </>
                ) : (
                  <>
                    <span className="bg-gradient-to-r from-teal-300 to-emerald-300 bg-clip-text text-transparent">Compagnon IA ELS</span>
                    <br />Votre coach linguistique personnel
                  </>
                )}
              </h1>

              {/* Subtitle */}
              <p className="text-lg md:text-xl text-teal-100 mb-4 md:mb-6 lg:mb-10 max-w-3xl mx-auto">
                {isEn
                  ? "Practice your SLE skills anytime, anywhere with our AI-powered language coach. Get instant feedback, personalized exercises, and track your progress - completely free."
                  : "Pratiquez vos compétences ELS à tout moment, n'importe où avec notre coach linguistique alimenté par l'IA. Obtenez des commentaires instantanés, des exercices personnalisés et suivez vos progrès - entièrement gratuit."}
              </p>

              {/* Coach Photos Row */}
              <div className="flex justify-center items-center gap-3 mb-8">
                {coachPhotos.map((photo, i) => (
                  <div key={i} className="relative">
                    <img loading="lazy" decoding="async"
                      src={photo} 
                      alt={`SLE AI Coach ${i + 1}`}
                      className={`h-14 w-14 rounded-full object-cover ring-2 shadow-lg transition-all duration-300 hover:scale-110 hover:ring-teal-400 hover:shadow-teal-400/30 ${i === 0 ? 'ring-teal-400' : 'ring-white/30'}`}
                    />
                    {i === 0 && (
                      <div className="absolute -bottom-1 -right-1 h-5 w-5 bg-teal-400 rounded-full flex items-center justify-center">
                        <Sparkles className="h-3 w-3 text-white" />
                      </div>
                    )}
                  </div>
                ))}
                <span className="text-sm text-teal-200 ml-2">
                  {isEn ? "Meet your AI coaches" : "Rencontrez vos coaches IA"}
                </span>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6 md:mb-8 lg:mb-12">
                <Button size="lg" className="bg-white dark:bg-white/[0.08] dark:backdrop-blur-md text-teal-700 hover:bg-teal-50 shadow-xl shadow-teal-900/20 gap-2" onClick={() => document.getElementById('ai-chat-section')?.scrollIntoView({ behavior: 'smooth' })}>
                  <Play className="h-4 w-4" />
                  {isEn ? "Start Practicing Free" : "Commencer gratuitement"}
                </Button>
                <Button size="lg" variant="outline" className="border-white/60 text-white hover:bg-white/20 dark:hover:bg-background/10 gap-2" onClick={() => document.getElementById('ai-chat-section')?.scrollIntoView({ behavior: 'smooth' })}>
                  <MessageSquare className="h-4 w-4" />
                  {isEn ? "Try Demo" : "Essayer la démo"}
                </Button>
              </div>

              {/* Stats - Glassmorphism */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {l.heroStats.map((stat, i) => (
                  <div
                    key={i}
                    className="bg-white/20 dark:bg-white/[0.08] dark:backdrop-blur-md/10 backdrop-blur-md border border-white/60 rounded-2xl p-4 md:p-6"
                  >
                    <div className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-1">{stat.value}</div>
                    <div className="text-sm text-slate-800 dark:text-teal-200">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

                {/* Features Section */}
        <section className="py-20 md:py-28 bg-white dark:bg-white/[0.08] dark:backdrop-blur-md">
          <WaveDivider variant="organic" color="#f8fafc" backgroundColor="white" orientation="bottom" />
          <div className="container max-w-6xl mx-auto px-6 md:px-12">
            <div className="text-center mb-6 md:mb-8 lg:mb-12">
              <Badge className="mb-4 bg-teal-100 text-teal-700 border-teal-200">
                {isEn ? "Features" : "Fonctionnalités"}
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                {isEn ? "Everything You Need to Succeed" : "Tout ce dont vous avez besoin pour réussir"}
              </h2>
              <p className="text-black dark:text-foreground max-w-2xl mx-auto">
                {isEn
                  ? "SLE AI Companion offers comprehensive SLE practice tools designed to help you achieve your language goals."
                  : "Le Compagnon IA ELS offre des outils de pratique ELS complets conçus pour vous aider à atteindre vos objectifs linguistiques."}
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {l.features.map((feature, i) => {
                const Icon = feature.icon;
                return (
                  <Card key={i} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-0 shadow-md">
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-4 mb-4">
                        <div className={`h-12 w-12 rounded-xl ${feature.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                          <Icon className="h-6 w-6" />
                        </div>
                        <img loading="lazy" decoding="async"
                          src={coachPhotos[feature.coachIndex]} 
                          alt="AI Coach"
                          className="h-10 w-10 rounded-full object-cover ring-2 ring-white shadow-md transition-all duration-300 group-hover:scale-110 group-hover:ring-teal-400 group-hover:shadow-lg group-hover:shadow-teal-400/20"
                        />
                      </div>
                      <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                      <p className="text-black dark:text-foreground">{feature.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Trusted By Section */}
        <section className="py-6 md:py-8 lg:py-12 bg-white dark:bg-white/[0.08] dark:backdrop-blur-md border-y">
          <div className="container max-w-6xl mx-auto px-6 md:px-12">
            <p className="text-center text-sm text-black dark:text-foreground mb-6 uppercase tracking-wider">
              {isEn ? "Trusted by public servants from" : "Utilisé par les fonctionnaires de"}
            </p>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
              {federalOrgs.map((org, i) => (
                <div key={i} className="flex items-center gap-2 text-black dark:text-foreground hover:text-black dark:text-foreground transition-colors">
                  <Building2 className="h-5 w-5" />
                  <span className="font-medium">{org.name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-10 md:py-16 lg:py-20 bg-white dark:bg-white/[0.08] dark:backdrop-blur-md">
          <div className="container max-w-6xl mx-auto px-6 md:px-12">
            <div className="text-center mb-6 md:mb-8 lg:mb-12">
              <Badge className="mb-4 bg-emerald-100 text-emerald-700 border-emerald-200">
                {isEn ? "Simple Process" : "Processus simple"}
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                {isEn ? "How It Works" : "Comment ça marche"}
              </h2>
              <p className="text-black dark:text-foreground max-w-2xl mx-auto">
                {isEn
                  ? "Start practicing in minutes with our intuitive AI coach."
                  : "Commencez à pratiquer en quelques minutes avec notre coach IA intuitif."}
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto">
              {l.howItWorks.map((step, i) => (
                <div key={i} className="text-center relative">
                  {i < l.howItWorks.length - 1 && (
                    <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-gradient-to-r from-teal-300 to-teal-200" />
                  )}
                  <div className="relative z-10 mb-4">
                    <img loading="lazy" decoding="async"
                      src={coachPhotos[step.coachIndex]} 
                      alt={`Step ${step.step} Coach`}
                      className="h-16 w-16 rounded-full object-cover mx-auto ring-4 ring-teal-100 shadow-lg transition-all duration-300 hover:scale-110 hover:ring-teal-400 hover:shadow-xl hover:shadow-teal-400/30"
                    />
                    <div className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-gradient-to-br from-teal-500 to-emerald-500 text-white flex items-center justify-center text-sm font-bold shadow-lg shadow-teal-500/30">
                      {step.step}
                    </div>
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                  <p className="text-black dark:text-foreground text-sm">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* AI Coach Preview — Interactive Chat */}
        <section id="ai-chat-section" className="py-10 md:py-16 lg:py-20 bg-white dark:bg-white/[0.08] dark:backdrop-blur-md">
          <div className="container max-w-6xl mx-auto px-6 md:px-12">
            <div className="max-w-5xl mx-auto">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <Badge className="mb-4 bg-foundation-soft text-foundation border-foundation">
                    {isEn ? "Meet Your AI Coach" : "Rencontrez votre coach IA"}
                  </Badge>
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">
                    {isEn ? "Your Personal AI Language Coach" : "Votre coach linguistique IA personnel"}
                  </h2>
                  <p className="text-black dark:text-foreground mb-6">
                    {isEn
                      ? "SLE AI Companion is designed specifically for Canadian federal public servants preparing for SLE exams. With advanced AI technology, it provides personalized feedback and adapts to your learning style."
                      : "Le Compagnon IA ELS est conçu spécifiquement pour les fonctionnaires fédéraux canadiens préparant les examens ELS. Avec une technologie IA avancée, il fournit des commentaires personnalisés et s'adapte à votre style d'apprentissage."}
                  </p>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-teal-100 flex items-center justify-center">
                        <Globe className="h-5 w-5 text-teal-600" />
                      </div>
                      <div>
                        <div className="font-semibold">{isEn ? "Bilingual Support" : "Support bilingue"}</div>
                        <div className="text-sm text-black dark:text-foreground">{isEn ? "Practice in French or English" : "Pratiquez en français ou en anglais"}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                        <Clock className="h-5 w-5 text-emerald-600" />
                      </div>
                      <div>
                        <div className="font-semibold">{isEn ? "Available 24/7" : "Disponible 24/7"}</div>
                        <div className="text-sm text-black dark:text-foreground">{isEn ? "Practice anytime, anywhere" : "Pratiquez à tout moment, n'importe où"}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-amber-100 flex items-center justify-center">
                        <Shield className="h-5 w-5 text-amber-600" />
                      </div>
                      <div>
                        <div className="font-semibold">{isEn ? "Privacy First" : "Confidentialité d'abord"}</div>
                        <div className="text-sm text-muted-foreground">{isEn ? "Your data stays secure" : "Vos données restent sécurisées"}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-teal-900 via-teal-800 to-obsidian rounded-2xl overflow-hidden text-white flex flex-col" style={{ height: '480px' }}>
                  {/* Chat Header */}
                  <div className="flex items-center gap-4 p-5 border-b border-white/10">
                    <div className="relative">
                      <img loading="lazy" decoding="async"
                        src={coachPhotos[0]} 
                        alt="SLE AI Coach"
                        className="h-12 w-12 rounded-full object-cover ring-2 ring-teal-400/50"
                      />
                      <div className="absolute -bottom-1 -right-1 h-5 w-5 bg-teal-400 rounded-full flex items-center justify-center">
                        <Sparkles className="h-3 w-3 text-white" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">SLE AI Coach</h3>
                      <p className="text-teal-300 text-xs">{chatPending ? (isEn ? "Typing..." : "En train d'écrire...") : (isEn ? "Online — Ready to help" : "En ligne — Prêt à aider")}</p>
                    </div>
                  </div>

                  {/* Chat Messages */}
                  <div ref={chatScrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
                    {chatMessages.map((msg, i) => (
                      <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] rounded-xl px-4 py-2.5 text-sm leading-relaxed ${
                          msg.role === 'user'
                            ? 'bg-teal-500 text-white'
                            : 'bg-white/15 backdrop-blur-sm text-teal-50'
                        }`}>
                          <p className="whitespace-pre-wrap">{msg.content}</p>
                        </div>
                      </div>
                    ))}
                    {chatPending && (
                      <div className="flex justify-start">
                        <div className="bg-white/15 backdrop-blur-sm rounded-xl px-4 py-3">
                          <Loader2 className="h-4 w-4 animate-spin text-teal-300" />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Quick Prompts */}
                  {chatMessages.length <= 1 && (
                    <div className="px-4 pb-2 flex flex-wrap gap-1.5">
                      {(isEn ? [
                        "Give me 3 SLE oral tips",
                        "Explain passé composé vs imparfait",
                        "French expressions for meetings",
                      ] : [
                        "3 conseils pour l'oral ELS",
                        "Expliquez le passé composé vs l'imparfait",
                        "Expressions françaises pour les réunions",
                      ]).map((prompt, i) => (
                        <button key={i} onClick={() => handleSendChat(prompt)} className="text-xs bg-white/10 hover:bg-white/20 rounded-full px-3 py-1.5 text-teal-200 transition-colors">
                          {prompt}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Chat Input */}
                  <form onSubmit={(e) => { e.preventDefault(); handleSendChat(chatInput); }} className="flex gap-2 p-3 border-t border-white/10">
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder={isEn ? "Type your message..." : "Tapez votre message..."}
                      className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-sm text-white placeholder-teal-300/60 focus:outline-none focus:ring-2 focus:ring-teal-400/50"
                      disabled={chatPending}
                    />
                    <Button
                      type="submit"
                      size="icon"
                      disabled={!chatInput.trim() || chatPending}
                      className="bg-teal-500 hover:bg-teal-400 text-white rounded-xl h-10 w-10 shrink-0"
                    >
                      {chatPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-10 md:py-16 lg:py-20 bg-white dark:bg-white/[0.08] dark:backdrop-blur-md">
          <div className="container max-w-6xl mx-auto px-6 md:px-12">
            <div className="text-center mb-6 md:mb-8 lg:mb-12">
              <Badge className="mb-4 bg-orange-100 text-orange-700 border-orange-200">
                {isEn ? "Success Stories" : "Témoignages"}
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                {isEn ? "What Our Users Say" : "Ce que disent nos utilisateurs"}
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {l.testimonials.map((testimonial, i) => (
                <Card key={i} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, j) => (
                        <Star key={j} className="h-4 w-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <p className="mb-6 italic text-black dark:text-foreground">"{testimonial.quote}"</p>
                    <div className="flex items-center gap-3">
                      <img loading="lazy" decoding="async"
                        src={coachPhotos[i % coachPhotos.length]} 
                        alt={testimonial.name}
                        className="h-12 w-12 rounded-full object-cover ring-2 ring-teal-100 transition-all duration-300 hover:scale-110 hover:ring-teal-400 hover:shadow-lg hover:shadow-teal-400/20"
                      />
                      <div>
                        <div className="font-semibold">{testimonial.name}</div>
                        <div className="text-sm text-black dark:text-foreground">{testimonial.role}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="relative py-10 md:py-16 lg:py-20 bg-gradient-to-br from-teal-900 via-teal-800 to-obsidian text-white overflow-hidden">
          {/* Background decorations */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-10 left-10 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-10 right-10 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl" />
          </div>

          <div className="container max-w-6xl mx-auto px-6 md:px-12 relative text-center">
            <Badge className="mb-6 bg-white/20 dark:bg-white/[0.08] dark:backdrop-blur-md/10 text-slate-900 dark:text-white border-white/60 backdrop-blur-sm">
              <Sparkles className="h-4 w-4 mr-2" />
              {isEn ? "Start Free Today" : "Commencez gratuitement aujourd'hui"}
            </Badge>

            {/* Coach Photos */}
            <div className="flex justify-center items-center gap-2 mb-6">
              {coachPhotos.map((photo, i) => (
                <img loading="lazy" decoding="async"
                  key={i}
                  src={photo} 
                  alt={`Coach ${i + 1}`}
                  className="h-12 w-12 rounded-full object-cover ring-2 ring-white/30 shadow-lg transition-all duration-300 hover:scale-110 hover:ring-teal-400 hover:shadow-teal-400/30"
                />
              ))}
            </div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              {isEn ? "Ready to Improve Your SLE Skills?" : "Prêt à améliorer vos compétences ELS?"}
            </h2>
            <p className="text-xl text-teal-100 mb-8 max-w-2xl mx-auto">
              {isEn
                ? "Join thousands of public servants who are achieving their language goals with SLE AI Companion."
                : "Rejoignez des milliers de fonctionnaires qui atteignent leurs objectifs linguistiques avec le Compagnon IA ELS."}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button size="lg" className="bg-white dark:bg-white/[0.08] dark:backdrop-blur-md text-teal-700 hover:bg-teal-50 shadow-xl gap-2" onClick={() => document.getElementById('ai-chat-section')?.scrollIntoView({ behavior: 'smooth' })}>
                <Play className="h-4 w-4" />
                {isEn ? "Start Practicing Free" : "Commencer gratuitement"}
              </Button>
              <a href="/coaches">
                <Button size="lg" variant="outline" className="border-white/60 text-white hover:bg-white/20 dark:hover:bg-background/10 gap-2">
                  <Users className="h-4 w-4" />
                  {isEn ? "Or Find a Human Coach" : "Ou trouver un coach humain"}
                </Button>
              </a>
            </div>

            {/* Trust signals */}
            <div className="flex flex-wrap justify-center gap-6 text-sm text-teal-200">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                <span>{isEn ? "100% Free" : "100% Gratuit"}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                <span>{isEn ? "No credit card required" : "Pas de carte de crédit requise"}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                <span>{isEn ? "Available 24/7" : "Disponible 24/7"}</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {!isInsideAppLayout && null}
    </div>
  );
}
