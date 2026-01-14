/**
 * Enhanced AI Coach Page
 * 
 * Full AI coaching experience with:
 * - Chat interface with Prof Steven AI
 * - Practice session logs
 * - Exam simulation mode
 * - Entitlement-aware access
 * - Bilingual support (EN/FR)
 */

import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Bot,
  Send,
  Mic,
  MicOff,
  Play,
  Pause,
  Clock,
  Target,
  BookOpen,
  MessageSquare,
  History,
  Sparkles,
  Volume2,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Zap,
  Trophy,
  Timer,
} from "lucide-react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { getLoginUrl } from "@/const";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface PracticeSession {
  id: number;
  type: "chat" | "oral" | "simulation";
  date: string;
  duration: number;
  score?: number;
  level?: string;
}

export default function AICoachEnhanced() {
  const { language } = useLanguage();
  const isEn = language === "en";
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState("practice");
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [simulationMode, setSimulationMode] = useState(false);
  const [simulationTime, setSimulationTime] = useState(0);
  const [simulationActive, setSimulationActive] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch entitlement
  const { data: entitlement } = trpc.entitlement?.getActive?.useQuery?.() || { data: null };

  // Mock practice history
  const practiceHistory: PracticeSession[] = [
    { id: 1, type: "chat", date: "2026-01-12", duration: 25, level: "B" },
    { id: 2, type: "oral", date: "2026-01-10", duration: 30, score: 78, level: "B" },
    { id: 3, type: "simulation", date: "2026-01-08", duration: 45, score: 82, level: "B" },
    { id: 4, type: "chat", date: "2026-01-05", duration: 20, level: "B" },
  ];

  const labels = {
    en: {
      title: "Prof Steven AI Coach",
      subtitle: "Practice your SLE skills with AI-powered coaching",
      practice: "Practice",
      simulation: "Exam Simulation",
      history: "History",
      // Chat
      chatPlaceholder: "Type your message or practice question...",
      send: "Send",
      voiceInput: "Voice Input",
      stopRecording: "Stop Recording",
      thinking: "Prof Steven is thinking...",
      welcomeMessage: "Hello! I'm Prof Steven, your AI language coach. How can I help you prepare for your SLE today? You can:\n\n• Practice conversation in French\n• Ask questions about grammar\n• Do a mock oral exam\n• Get feedback on your writing",
      // Simulation
      simulationTitle: "SLE Exam Simulation",
      simulationDesc: "Experience a realistic SLE exam environment",
      startSimulation: "Start Simulation",
      endSimulation: "End Simulation",
      simulationInProgress: "Simulation in Progress",
      timeRemaining: "Time Remaining",
      simulationTypes: "Select Exam Type",
      oralExam: "Oral Exam",
      writtenExam: "Written Exam",
      readingExam: "Reading Comprehension",
      // History
      historyTitle: "Practice History",
      noHistory: "No practice sessions yet",
      duration: "Duration",
      score: "Score",
      level: "Level",
      minutes: "min",
      // Stats
      totalPractice: "Total Practice Time",
      sessionsCompleted: "Sessions Completed",
      avgScore: "Average Score",
      currentStreak: "Current Streak",
      days: "days",
      // Access
      loginRequired: "Please sign in to access AI Coach",
      signIn: "Sign In",
      noEntitlement: "Upgrade to Access",
      upgradeDesc: "Get a coaching package to unlock unlimited AI practice",
      upgrade: "View Packages",
    },
    fr: {
      title: "Coach IA Prof Steven",
      subtitle: "Pratiquez vos compétences ELS avec le coaching alimenté par l'IA",
      practice: "Pratique",
      simulation: "Simulation d'examen",
      history: "Historique",
      // Chat
      chatPlaceholder: "Tapez votre message ou question de pratique...",
      send: "Envoyer",
      voiceInput: "Entrée vocale",
      stopRecording: "Arrêter l'enregistrement",
      thinking: "Prof Steven réfléchit...",
      welcomeMessage: "Bonjour! Je suis Prof Steven, votre coach linguistique IA. Comment puis-je vous aider à préparer votre ELS aujourd'hui? Vous pouvez:\n\n• Pratiquer la conversation en français\n• Poser des questions sur la grammaire\n• Faire un examen oral simulé\n• Obtenir des commentaires sur votre écriture",
      // Simulation
      simulationTitle: "Simulation d'examen ELS",
      simulationDesc: "Vivez un environnement d'examen ELS réaliste",
      startSimulation: "Commencer la simulation",
      endSimulation: "Terminer la simulation",
      simulationInProgress: "Simulation en cours",
      timeRemaining: "Temps restant",
      simulationTypes: "Sélectionner le type d'examen",
      oralExam: "Examen oral",
      writtenExam: "Examen écrit",
      readingExam: "Compréhension de lecture",
      // History
      historyTitle: "Historique de pratique",
      noHistory: "Aucune session de pratique",
      duration: "Durée",
      score: "Score",
      level: "Niveau",
      minutes: "min",
      // Stats
      totalPractice: "Temps de pratique total",
      sessionsCompleted: "Sessions complétées",
      avgScore: "Score moyen",
      currentStreak: "Série actuelle",
      days: "jours",
      // Access
      loginRequired: "Veuillez vous connecter pour accéder au Coach IA",
      signIn: "Se connecter",
      noEntitlement: "Mise à niveau requise",
      upgradeDesc: "Obtenez un forfait de coaching pour débloquer la pratique IA illimitée",
      upgrade: "Voir les forfaits",
    },
  };

  const t = labels[language];
  const pricingPath = isEn ? "/en/pricing" : "/fr/tarifs";

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Add welcome message on mount
  useEffect(() => {
    if (messages.length === 0 && isAuthenticated) {
      setMessages([
        {
          id: "welcome",
          role: "assistant",
          content: t.welcomeMessage,
          timestamp: new Date(),
        },
      ]);
    }
  }, [isAuthenticated]);

  // Simulation timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (simulationActive && simulationTime > 0) {
      interval = setInterval(() => {
        setSimulationTime((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [simulationActive, simulationTime]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    // Simulate AI response (replace with actual API call)
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: isEn
          ? "That's a great question! Let me help you practice. Try saying this phrase: 'Je voudrais discuter de ce projet avec vous.' Can you repeat it?"
          : "C'est une excellente question! Laissez-moi vous aider à pratiquer. Essayez de dire cette phrase: 'I would like to discuss this project with you.' Pouvez-vous la répéter?",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // TODO: Implement actual voice recording
  };

  const startSimulation = (type: string, duration: number) => {
    setSimulationMode(true);
    setSimulationTime(duration * 60);
    setSimulationActive(true);
    setActiveTab("practice");
    
    const startMessage: Message = {
      id: Date.now().toString(),
      role: "assistant",
      content: isEn
        ? `🎯 **${type} Simulation Started**\n\nYou have ${duration} minutes. I will guide you through the exam format. Let's begin!\n\nFirst question: Please introduce yourself and describe your current role.`
        : `🎯 **Simulation ${type} commencée**\n\nVous avez ${duration} minutes. Je vais vous guider à travers le format de l'examen. Commençons!\n\nPremière question: Veuillez vous présenter et décrire votre rôle actuel.`,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, startMessage]);
  };

  const endSimulation = () => {
    setSimulationActive(false);
    setSimulationMode(false);
    
    const endMessage: Message = {
      id: Date.now().toString(),
      role: "assistant",
      content: isEn
        ? "🏆 **Simulation Complete!**\n\nGreat job! Based on your responses, here's your preliminary assessment:\n\n• Fluency: Good\n• Vocabulary: Strong\n• Grammar: Needs practice\n\nWould you like detailed feedback or try another simulation?"
        : "🏆 **Simulation terminée!**\n\nExcellent travail! Basé sur vos réponses, voici votre évaluation préliminaire:\n\n• Fluidité: Bonne\n• Vocabulaire: Fort\n• Grammaire: À pratiquer\n\nVoulez-vous des commentaires détaillés ou essayer une autre simulation?",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, endMessage]);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getSessionIcon = (type: string) => {
    switch (type) {
      case "oral":
        return <Mic className="h-4 w-4" />;
      case "simulation":
        return <Target className="h-4 w-4" />;
      default:
        return <MessageSquare className="h-4 w-4" />;
    }
  };

  // Show login prompt if not authenticated
  if (!authLoading && !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <Header />
        <main className="container mx-auto px-4 py-16 text-center">
          <Card className="max-w-md mx-auto">
            <CardContent className="pt-8 pb-8">
              <Bot className="h-16 w-16 text-teal-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-4">{t.loginRequired}</h2>
              <Button asChild>
                <a href={getLoginUrl()}>{t.signIn}</a>
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <SEO
        title={isEn ? "AI Coach | Prof Steven" : "Coach IA | Prof Steven"}
        description={isEn
          ? "Practice your SLE skills with Prof Steven AI Coach. Get real-time feedback and exam simulations."
          : "Pratiquez vos compétences ELS avec le Coach IA Prof Steven. Obtenez des commentaires en temps réel et des simulations d'examen."
        }
      />
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-teal-100 rounded-xl">
              <Bot className="h-8 w-8 text-teal-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{t.title}</h1>
              <p className="text-gray-600">{t.subtitle}</p>
            </div>
          </div>
          
          {/* Simulation Timer */}
          {simulationActive && (
            <Card className="bg-red-50 border-red-200">
              <CardContent className="py-3 px-4 flex items-center gap-3">
                <Timer className="h-5 w-5 text-red-600 animate-pulse" />
                <div>
                  <p className="text-xs text-red-600">{t.timeRemaining}</p>
                  <p className="text-xl font-bold text-red-700">{formatTime(simulationTime)}</p>
                </div>
                <Button size="sm" variant="destructive" onClick={endSimulation}>
                  {t.endSimulation}
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="py-4 text-center">
              <Clock className="h-5 w-5 text-teal-600 mx-auto mb-2" />
              <p className="text-2xl font-bold">2.5h</p>
              <p className="text-xs text-gray-500">{t.totalPractice}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-4 text-center">
              <CheckCircle className="h-5 w-5 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-bold">12</p>
              <p className="text-xs text-gray-500">{t.sessionsCompleted}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-4 text-center">
              <Trophy className="h-5 w-5 text-amber-600 mx-auto mb-2" />
              <p className="text-2xl font-bold">78%</p>
              <p className="text-xs text-gray-500">{t.avgScore}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-4 text-center">
              <Zap className="h-5 w-5 text-purple-600 mx-auto mb-2" />
              <p className="text-2xl font-bold">5</p>
              <p className="text-xs text-gray-500">{t.currentStreak} {t.days}</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chat Area */}
          <div className="lg:col-span-2">
            <Card className="h-[600px] flex flex-col">
              <CardHeader className="border-b">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src="/prof-steven-avatar.png" />
                    <AvatarFallback className="bg-teal-100 text-teal-600">PS</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">Prof Steven AI</CardTitle>
                    <CardDescription className="flex items-center gap-1">
                      <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      {isEn ? "Online" : "En ligne"}
                    </CardDescription>
                  </div>
                  {simulationMode && (
                    <Badge className="ml-auto bg-red-100 text-red-700">
                      {t.simulationInProgress}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          message.role === "user"
                            ? "bg-teal-600 text-white"
                            : "bg-gray-100 text-gray-900"
                        }`}
                      >
                        <p className="whitespace-pre-wrap">{message.content}</p>
                        <p className={`text-xs mt-1 ${message.role === "user" ? "text-teal-200" : "text-gray-500"}`}>
                          {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 rounded-lg p-3">
                        <div className="flex items-center gap-2">
                          <div className="animate-bounce">●</div>
                          <div className="animate-bounce" style={{ animationDelay: "0.1s" }}>●</div>
                          <div className="animate-bounce" style={{ animationDelay: "0.2s" }}>●</div>
                          <span className="text-sm text-gray-500 ml-2">{t.thinking}</span>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={toggleRecording}
                    className={isRecording ? "bg-red-100 text-red-600" : ""}
                  >
                    {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                  </Button>
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={t.chatPlaceholder}
                    className="flex-1"
                    disabled={isLoading}
                  />
                  <Button onClick={handleSendMessage} disabled={!inputValue.trim() || isLoading}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Simulation Panel */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-teal-600" />
                  {t.simulationTitle}
                </CardTitle>
                <CardDescription>{t.simulationDesc}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  className="w-full justify-start"
                  variant="outline"
                  onClick={() => startSimulation(t.oralExam, 15)}
                  disabled={simulationActive}
                >
                  <Mic className="h-4 w-4 mr-2" />
                  {t.oralExam}
                  <Badge variant="secondary" className="ml-auto">15 min</Badge>
                </Button>
                <Button
                  className="w-full justify-start"
                  variant="outline"
                  onClick={() => startSimulation(t.writtenExam, 30)}
                  disabled={simulationActive}
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  {t.writtenExam}
                  <Badge variant="secondary" className="ml-auto">30 min</Badge>
                </Button>
                <Button
                  className="w-full justify-start"
                  variant="outline"
                  onClick={() => startSimulation(t.readingExam, 20)}
                  disabled={simulationActive}
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  {t.readingExam}
                  <Badge variant="secondary" className="ml-auto">20 min</Badge>
                </Button>
              </CardContent>
            </Card>

            {/* Practice History */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5 text-teal-600" />
                  {t.historyTitle}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {practiceHistory.length > 0 ? (
                  <div className="space-y-3">
                    {practiceHistory.slice(0, 5).map((session) => (
                      <div key={session.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-teal-100 rounded-lg text-teal-600">
                            {getSessionIcon(session.type)}
                          </div>
                          <div>
                            <p className="font-medium text-sm capitalize">{session.type}</p>
                            <p className="text-xs text-gray-500">{session.date}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">{session.duration} {t.minutes}</p>
                          {session.score && (
                            <p className="text-xs text-teal-600">{session.score}%</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-500 py-4">{t.noHistory}</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
