import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Bot,
  Send,
  Mic,
  MicOff,
  MessageSquare,
  ClipboardCheck,
  Play,
  Loader2,
  User,
  Sparkles,
  Volume2,
  RotateCcw,
  Info,
} from "lucide-react";
import { trpc } from "@/lib/trpc";
import { getLoginUrl } from "@/const";
import { LazyStreamdown } from "@/components/LazyStreamdown";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function ProfStevenAI() {
  const { language, t } = useLanguage();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  
  const [activeTab, setActiveTab] = useState("practice");
  const [selectedLanguage, setSelectedLanguage] = useState<"french" | "english">("french");
  const [selectedLevel, setSelectedLevel] = useState<"a" | "b" | "c">("b");
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [sessionId, setSessionId] = useState<number | null>(null);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const chatMutation = trpc.ai.chat.useMutation();
  const startPracticeMutation = trpc.ai.startPractice.useMutation();
  const startPlacementMutation = trpc.ai.startPlacement.useMutation();
  const startSimulationMutation = trpc.ai.startSimulation.useMutation();

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const labels = {
    en: {
      title: "Prof Steven AI",
      subtitle: "Your 24/7 AI Language Coach",
      practice: "Practice",
      placement: "Placement Test",
      simulation: "Exam Simulation",
      practiceDesc: "Free conversation practice with instant feedback",
      placementDesc: "Discover your current SLE level",
      simulationDesc: "Full mock oral exam experience",
      selectLanguage: "Select Language",
      french: "French",
      english: "English",
      selectLevel: "Target Level",
      startSession: "Start Session",
      typeMessage: "Type your message...",
      send: "Send",
      loginRequired: "Please sign in to use Prof Steven AI",
      signIn: "Sign In",
      welcomeMessage: "Hello! I'm Prof Steven AI, your personal language coach. I'm here to help you prepare for your SLE exam. Let's practice together!",
      welcomeMessageFr: "Bonjour! Je suis Prof Steven AI, votre coach linguistique personnel. Je suis là pour vous aider à préparer votre examen ELS. Pratiquons ensemble!",
      tips: "Tips",
      tip1: "Speak naturally, as you would in a real conversation",
      tip2: "Don't worry about making mistakes - I'll help you learn from them",
      tip3: "Try to use complete sentences for better practice",
      newSession: "New Session",
      sessionActive: "Session Active",
    },
    fr: {
      title: "Prof Steven AI",
      subtitle: "Votre coach linguistique IA 24/7",
      practice: "Pratique",
      placement: "Test de placement",
      simulation: "Simulation d'examen",
      practiceDesc: "Conversation libre avec rétroaction instantanée",
      placementDesc: "Découvrez votre niveau ELS actuel",
      simulationDesc: "Expérience complète d'examen oral simulé",
      selectLanguage: "Choisir la langue",
      french: "Français",
      english: "Anglais",
      selectLevel: "Niveau cible",
      startSession: "Commencer la session",
      typeMessage: "Tapez votre message...",
      send: "Envoyer",
      loginRequired: "Veuillez vous connecter pour utiliser Prof Steven AI",
      signIn: "Se connecter",
      welcomeMessage: "Hello! I'm Prof Steven AI, your personal language coach. I'm here to help you prepare for your SLE exam. Let's practice together!",
      welcomeMessageFr: "Bonjour! Je suis Prof Steven AI, votre coach linguistique personnel. Je suis là pour vous aider à préparer votre examen ELS. Pratiquons ensemble!",
      tips: "Conseils",
      tip1: "Parlez naturellement, comme dans une vraie conversation",
      tip2: "Ne vous inquiétez pas des erreurs - je vous aiderai à apprendre",
      tip3: "Essayez d'utiliser des phrases complètes pour mieux pratiquer",
      newSession: "Nouvelle session",
      sessionActive: "Session active",
    },
  };

  const l = labels[language];

  const startSession = async () => {
    try {
      setIsLoading(true);
      let result;

      if (activeTab === "practice") {
        result = await startPracticeMutation.mutateAsync({
          language: selectedLanguage,
          targetLevel: selectedLevel,
        });
      } else if (activeTab === "placement") {
        result = await startPlacementMutation.mutateAsync({
          language: selectedLanguage,
        });
      } else {
        result = await startSimulationMutation.mutateAsync({
          language: selectedLanguage,
          targetLevel: selectedLevel,
        });
      }

      setSessionId(result.sessionId);
      setSessionStarted(true);
      
      // Add welcome message
      const welcomeMsg = selectedLanguage === "french" ? l.welcomeMessageFr : l.welcomeMessage;
      setMessages([{ role: "assistant", content: welcomeMsg }]);
    } catch (error) {
      console.error("Failed to start session:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!inputValue.trim() || !sessionId || isLoading) return;

    const userMessage = inputValue.trim();
    setInputValue("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const result = await chatMutation.mutateAsync({
        sessionId,
        message: userMessage,
        conversationHistory: messages,
      });

      setMessages((prev) => [...prev, { role: "assistant", content: result.response }]);
    } catch (error) {
      console.error("Failed to send message:", error);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "I apologize, I encountered an error. Please try again." },
      ]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const resetSession = () => {
    setSessionStarted(false);
    setSessionId(null);
    setMessages([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Show login prompt if not authenticated
  if (!authLoading && !isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Card className="max-w-md w-full mx-4">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Bot className="h-8 w-8 text-primary" />
              </div>
              <CardTitle>{l.title}</CardTitle>
              <CardDescription>{l.loginRequired}</CardDescription>
            </CardHeader>
            <CardContent>
              <a href={getLoginUrl()} className="block">
                <Button className="w-full" size="lg">
                  {l.signIn}
                </Button>
              </a>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main id="main-content" className="flex-1">
        <div className="container py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Bot className="h-6 w-6 text-primary" />
              </div>
              <div className="text-left">
                <h1 className="text-2xl font-bold">{l.title}</h1>
                <p className="text-muted-foreground text-sm">{l.subtitle}</p>
              </div>
            </div>
          </div>

          <div className="max-w-4xl mx-auto">
            {!sessionStarted ? (
              /* Session Setup */
              <Card>
                <CardContent className="p-6">
                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid w-full grid-cols-3 mb-6">
                      <TabsTrigger value="practice" className="gap-2">
                        <MessageSquare className="h-4 w-4" />
                        <span className="hidden sm:inline">{l.practice}</span>
                      </TabsTrigger>
                      <TabsTrigger value="placement" className="gap-2">
                        <ClipboardCheck className="h-4 w-4" />
                        <span className="hidden sm:inline">{l.placement}</span>
                      </TabsTrigger>
                      <TabsTrigger value="simulation" className="gap-2">
                        <Play className="h-4 w-4" />
                        <span className="hidden sm:inline">{l.simulation}</span>
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="practice" className="space-y-6">
                      <div className="text-center p-4 bg-muted/50 rounded-lg">
                        <Sparkles className="h-8 w-8 mx-auto mb-2 text-primary" />
                        <p className="text-muted-foreground">{l.practiceDesc}</p>
                      </div>
                    </TabsContent>

                    <TabsContent value="placement" className="space-y-6">
                      <div className="text-center p-4 bg-muted/50 rounded-lg">
                        <ClipboardCheck className="h-8 w-8 mx-auto mb-2 text-primary" />
                        <p className="text-muted-foreground">{l.placementDesc}</p>
                      </div>
                    </TabsContent>

                    <TabsContent value="simulation" className="space-y-6">
                      <div className="text-center p-4 bg-muted/50 rounded-lg">
                        <Play className="h-8 w-8 mx-auto mb-2 text-primary" />
                        <p className="text-muted-foreground">{l.simulationDesc}</p>
                      </div>
                    </TabsContent>
                  </Tabs>

                  {/* Options */}
                  <div className="grid sm:grid-cols-2 gap-4 mt-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">{l.selectLanguage}</label>
                      <Select
                        value={selectedLanguage}
                        onValueChange={(v) => setSelectedLanguage(v as "french" | "english")}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="french">{l.french}</SelectItem>
                          <SelectItem value="english">{l.english}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {activeTab !== "placement" && (
                      <div className="space-y-2">
                        <label className="text-sm font-medium">{l.selectLevel}</label>
                        <Select
                          value={selectedLevel}
                          onValueChange={(v) => setSelectedLevel(v as "a" | "b" | "c")}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="a">Level A</SelectItem>
                            <SelectItem value="b">Level B</SelectItem>
                            <SelectItem value="c">Level C</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>

                  {/* Tips */}
                  <div className="mt-6 p-4 border rounded-lg bg-muted/30">
                    <div className="flex items-center gap-2 mb-2">
                      <Info className="h-4 w-4 text-primary" />
                      <span className="font-medium text-sm">{l.tips}</span>
                    </div>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• {l.tip1}</li>
                      <li>• {l.tip2}</li>
                      <li>• {l.tip3}</li>
                    </ul>
                  </div>

                  <Button
                    className="w-full mt-6"
                    size="lg"
                    onClick={startSession}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Loading...
                      </>
                    ) : (
                      l.startSession
                    )}
                  </Button>
                </CardContent>
              </Card>
            ) : (
              /* Chat Interface */
              <Card className="h-[600px] flex flex-col">
                {/* Chat Header */}
                <div className="p-4 border-b flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 bg-primary/10">
                      <AvatarFallback className="bg-primary/10 text-primary">
                        <Bot className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{l.title}</p>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {selectedLanguage === "french" ? l.french : l.english}
                        </Badge>
                        {activeTab !== "placement" && (
                          <Badge variant="outline" className="text-xs">
                            Level {selectedLevel.toUpperCase()}
                          </Badge>
                        )}
                        <span className="text-xs text-emerald-600 flex items-center gap-1">
                          <span className="h-2 w-2 rounded-full bg-emerald-500" />
                          {l.sessionActive}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={resetSession}>
                    <RotateCcw className="h-4 w-4 mr-2" />
                    {l.newSession}
                  </Button>
                </div>

                {/* Messages */}
                <ScrollArea className="flex-1 p-4" ref={scrollRef}>
                  <div className="space-y-4">
                    {messages.map((message, index) => (
                      <div
                        key={index}
                        className={`flex gap-3 ${
                          message.role === "user" ? "justify-end" : "justify-start"
                        }`}
                      >
                        {message.role === "assistant" && (
                          <Avatar className="h-8 w-8 shrink-0">
                            <AvatarFallback className="bg-primary/10 text-primary">
                              <Bot className="h-4 w-4" />
                            </AvatarFallback>
                          </Avatar>
                        )}
                        <div
                          className={`max-w-[80%] rounded-lg p-3 ${
                            message.role === "user"
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted"
                          }`}
                        >
                          {message.role === "assistant" ? (
                            <LazyStreamdown>{message.content}</LazyStreamdown>
                          ) : (
                            <p>{message.content}</p>
                          )}
                        </div>
                        {message.role === "user" && (
                          <Avatar className="h-8 w-8 shrink-0">
                            <AvatarFallback>
                              <User className="h-4 w-4" />
                            </AvatarFallback>
                          </Avatar>
                        )}
                      </div>
                    ))}
                    {isLoading && (
                      <div className="flex gap-3">
                        <Avatar className="h-8 w-8 shrink-0">
                          <AvatarFallback className="bg-primary/10 text-primary">
                            <Bot className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                        <div className="bg-muted rounded-lg p-3">
                          <Loader2 className="h-4 w-4 animate-spin" />
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>

                {/* Input */}
                <div className="p-4 border-t">
                  <div className="flex gap-2">
                    <Textarea
                      ref={inputRef}
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder={l.typeMessage}
                      className="min-h-[44px] max-h-[120px] resize-none"
                      rows={1}
                      disabled={isLoading}
                    />
                    <Button
                      onClick={sendMessage}
                      disabled={!inputValue.trim() || isLoading}
                      size="icon"
                      className="shrink-0"
                    >
                      <Send className="h-4 w-4" />
                      <span className="sr-only">{l.send}</span>
                    </Button>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
