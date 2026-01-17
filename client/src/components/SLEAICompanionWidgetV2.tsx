import { useState, useEffect, useRef } from "react";
import { X, Mic, MicOff, Volume2, ChevronRight, Zap, Building2, GraduationCap, HeartHandshake } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

/**
 * SLEAICompanionWidget - Multi-Coach Voice-First Experience v2.0
 * 
 * ÉQUIPE DE COACHING VIRTUELLE - Gemini Live Style
 * 
 * Features:
 * - Widget dynamique avec cross-fade entre 4 coaches
 * - Écran 1: Sélecteur de partenaire de pratique
 * - Écran 2: Menu stratégique (4 piliers actionnables)
 * - Écran 3: Interface vocale immersive (Voice-First)
 * 
 * Coaches:
 * - Prof. Steven: Structure & Grammaire
 * - Coach Sue-Anne: Fluidité & Expression
 * - Coach Erica: Gestion du Stress
 * - Coach Preciosa: Vocabulaire & Nuances
 */

// Types
interface Coach {
  id: string;
  name: string;
  specialty: { en: string; fr: string };
  photo: string;
  greeting: { en: string; fr: string };
}

interface PracticeOption {
  id: string;
  icon: React.ReactNode;
  title: { en: string; fr: string };
  subtitle: { en: string; fr: string };
  color: string;
}

// Coach Data - Using actual uploaded file names (URL-encoded for spaces)
const coaches: Coach[] = [
  {
    id: "steven",
    name: "Prof. Steven",
    specialty: { en: "Structure & Grammar", fr: "Structure & Grammaire" },
    photo: "/images/coaches/Steven%20(2).webp",
    greeting: { 
      en: "Hello! I'm Professor Steven. Ready to work on your structure and grammar today. Let's begin when you're ready.",
      fr: "Bonjour ! Je suis le Professeur Steven. Prêt à travailler votre structure et grammaire aujourd'hui. Commençons quand vous êtes prêt."
    }
  },
  {
    id: "sue-anne",
    name: "Coach Sue-Anne",
    specialty: { en: "Fluency & Expression", fr: "Fluidité & Expression" },
    photo: "/images/coaches/Sue-Anne.webp",
    greeting: {
      en: "Hi there! I'm Sue-Anne. Let's work on making your French flow naturally. I'm here to help!",
      fr: "Salut ! Je suis Sue-Anne. Travaillons ensemble pour que votre français coule naturellement. Je suis là pour vous aider !"
    }
  },
  {
    id: "erica",
    name: "Coach Erica",
    specialty: { en: "Stress Management", fr: "Gestion du Stress" },
    photo: "/images/coaches/Erika%20Frank.webp",
    greeting: {
      en: "Welcome! I'm Erica. Let's work on building your confidence and managing exam stress together.",
      fr: "Bienvenue ! Je suis Erica. Travaillons ensemble à renforcer votre confiance et gérer le stress des examens."
    }
  },
  {
    id: "preciosa",
    name: "Coach Preciosa",
    specialty: { en: "Vocabulary & Nuances", fr: "Vocabulaire & Nuances" },
    photo: "/images/coaches/Preciosa%202.webp",
    greeting: {
      en: "Hello! I'm Preciosa. Let's enrich your vocabulary and master those subtle nuances together!",
      fr: "Bonjour ! Je suis Preciosa. Enrichissons votre vocabulaire et maîtrisons ensemble ces nuances subtiles !"
    }
  }
];

// Practice Options (4 Pillars)
const practiceOptions: PracticeOption[] = [
  {
    id: "micro-learning",
    icon: <Zap className="w-6 h-6" />,
    title: { en: "Flash Challenge (5 min)", fr: "Défi Éclair (5 min)" },
    subtitle: { 
      en: "Activate your vocabulary before a meeting (Coffee Break).",
      fr: "Activez votre vocabulaire avant une réunion (Coffee Break)."
    },
    color: "#f59e0b"
  },
  {
    id: "scenarios",
    icon: <Building2 className="w-6 h-6" />,
    title: { en: "Government Scenarios", fr: "Scénarios Gouvernementaux" },
    subtitle: {
      en: "Realistic simulations: HR, Briefings, Policies.",
      fr: "Simulations réalistes : RH, Briefings, Politiques."
    },
    color: "#3b82f6"
  },
  {
    id: "exam-simulator",
    icon: <GraduationCap className="w-6 h-6" />,
    title: { en: "Oral Simulator (Levels B/C)", fr: "Simulateur d'Oral (Niveaux B/C)" },
    subtitle: {
      en: "Test yourself against official criteria.",
      fr: "Testez-vous contre les critères officiels."
    },
    color: "#8b5cf6"
  },
  {
    id: "coaching-sos",
    icon: <HeartHandshake className="w-6 h-6" />,
    title: { en: "Strategic Coaching & Diagnosis", fr: "Coaching Stratégique & Diagnostic" },
    subtitle: {
      en: "Stuck? Unlock your potential with a human expert.",
      fr: "Bloqué ? Débloquez votre potentiel avec un expert humain."
    },
    color: "#10b981"
  }
];

// Screen States
type ScreenState = "widget" | "coach-selector" | "menu" | "voice-session";

export default function SLEAICompanionWidget() {
  const { language } = useLanguage();
  const [screen, setScreen] = useState<ScreenState>("widget");
  const [selectedCoach, setSelectedCoach] = useState<Coach | null>(null);
  const [selectedOption, setSelectedOption] = useState<PracticeOption | null>(null);
  const [currentCoachIndex, setCurrentCoachIndex] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [waveformValues, setWaveformValues] = useState<number[]>(Array(20).fill(0.2));
  const animationRef = useRef<number>();

  // Cross-fade animation for widget
  useEffect(() => {
    if (screen === "widget") {
      const interval = setInterval(() => {
        setCurrentCoachIndex((prev) => (prev + 1) % coaches.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [screen]);

  // Waveform animation
  useEffect(() => {
    if (screen === "voice-session" && (isListening || isSpeaking)) {
      const animate = () => {
        setWaveformValues(prev => 
          prev.map(() => 0.2 + Math.random() * 0.8)
        );
        animationRef.current = requestAnimationFrame(animate);
      };
      animationRef.current = requestAnimationFrame(animate);
      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    } else {
      setWaveformValues(Array(20).fill(0.2));
    }
  }, [screen, isListening, isSpeaking]);

  // Simulate AI speaking on session start
  useEffect(() => {
    if (screen === "voice-session" && selectedCoach) {
      setIsSpeaking(true);
      const timer = setTimeout(() => {
        setIsSpeaking(false);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [screen, selectedCoach]);

  const handleWidgetClick = () => {
    setScreen("coach-selector");
  };

  const handleCoachSelect = (coach: Coach) => {
    setSelectedCoach(coach);
    setScreen("menu");
  };

  const handleOptionSelect = (option: PracticeOption) => {
    setSelectedOption(option);
    setScreen("voice-session");
  };

  const handleClose = () => {
    setScreen("widget");
    setSelectedCoach(null);
    setSelectedOption(null);
    setIsListening(false);
    setIsSpeaking(false);
  };

  const handleBack = () => {
    if (screen === "voice-session") {
      setScreen("menu");
      setSelectedOption(null);
    } else if (screen === "menu") {
      setScreen("coach-selector");
      setSelectedCoach(null);
    } else {
      handleClose();
    }
  };

  const toggleListening = () => {
    setIsListening(!isListening);
    if (!isListening) {
      setIsSpeaking(false);
    }
  };

  // Widget View (Floating Button with Cross-fade)
  if (screen === "widget") {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={handleWidgetClick}
          className="relative group"
          aria-label="Open AI Companion"
        >
          {/* Glassmorphism Ring with Premium Animation */}
          <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-emerald-400/40 via-teal-400/40 to-emerald-400/40 blur-md group-hover:blur-lg transition-all duration-500 animate-pulse" />
          
          {/* Secondary Glow Ring */}
          <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-emerald-500/30 to-teal-500/30 blur-sm" />
          
          {/* Main Circle with Cross-fade Photos */}
          <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-white/40 shadow-2xl backdrop-blur-sm bg-gradient-to-br from-white/10 to-white/5">
            {coaches.map((coach, index) => (
              <img
                key={coach.id}
                src={coach.photo}
                alt={coach.name}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
                  index === currentCoachIndex ? "opacity-100" : "opacity-0"
                }`}
              />
            ))}
            
            {/* Organic Breathing Animation Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/20 to-transparent" />
          </div>

          {/* Online Indicator with Pulse */}
          <div className="absolute -top-1 -right-1 flex items-center gap-1 px-2 py-0.5 bg-emerald-500 rounded-full shadow-lg border border-emerald-400/50">
            <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
            <span className="text-[10px] font-semibold text-white tracking-wide">Online</span>
          </div>
        </button>
      </div>
    );
  }

  // Full Screen Modal Container
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop with Blur */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-md"
        onClick={handleClose}
      />

      {/* Modal Content */}
      <div className={`relative w-full max-w-lg mx-4 ${screen === "voice-session" ? "max-w-2xl h-[90vh]" : "max-h-[90vh]"} bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-white/10`}>
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10 bg-white/5">
          <button
            onClick={handleBack}
            className="p-2 rounded-full hover:bg-white/10 transition-colors text-white/70 hover:text-white"
          >
            <ChevronRight className="w-5 h-5 rotate-180" />
          </button>
          <h2 className="text-white font-medium">
            {screen === "coach-selector" && (language === "fr" ? "Choisissez votre partenaire" : "Choose your partner")}
            {screen === "menu" && selectedCoach?.name}
            {screen === "voice-session" && (language === "fr" ? "Session en cours" : "Session in progress")}
          </h2>
          <button
            onClick={handleClose}
            className="p-2 rounded-full hover:bg-white/10 transition-colors text-white/70 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Coach Selector Screen */}
        {screen === "coach-selector" && (
          <div className="p-6">
            <h3 className="text-center text-white/80 mb-6 text-lg font-light">
              {language === "fr" 
                ? "Choisissez votre partenaire de pratique aujourd'hui"
                : "Choose your practice partner today"
              }
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              {coaches.map((coach) => (
                <button
                  key={coach.id}
                  onClick={() => handleCoachSelect(coach)}
                  className="group relative p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-emerald-400/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
                >
                  {/* Coach Photo */}
                  <div className="relative w-20 h-20 mx-auto mb-3 rounded-full overflow-hidden border-2 border-white/20 group-hover:border-emerald-400/50 transition-all duration-300 shadow-lg">
                    <img
                      src={coach.photo}
                      alt={coach.name}
                      className="w-full h-full object-cover"
                    />
                    {/* Hover Glow on Photo */}
                    <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  
                  {/* Coach Info */}
                  <h4 className="text-white font-medium text-sm mb-1">{coach.name}</h4>
                  <p className="text-emerald-400/80 text-xs">
                    {language === "fr" ? coach.specialty.fr : coach.specialty.en}
                  </p>
                  
                  {/* Hover Glow Effect */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Menu Screen (4 Pillars) */}
        {screen === "menu" && selectedCoach && (
          <div className="p-6">
            {/* Selected Coach Badge */}
            <div className="flex items-center gap-3 mb-6 p-3 rounded-xl bg-white/5 border border-white/10">
              <img
                src={selectedCoach.photo}
                alt={selectedCoach.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-emerald-400/50 shadow-lg"
              />
              <div>
                <h4 className="text-white font-medium">{selectedCoach.name}</h4>
                <p className="text-emerald-400 text-sm">
                  {language === "fr" ? selectedCoach.specialty.fr : selectedCoach.specialty.en}
                </p>
              </div>
            </div>

            {/* Practice Options */}
            <div className="space-y-3">
              {practiceOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleOptionSelect(option)}
                  className="w-full group flex items-start gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all duration-300 text-left hover:scale-[1.01] hover:shadow-lg"
                >
                  {/* Icon */}
                  <div 
                    className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 shadow-lg"
                    style={{ backgroundColor: `${option.color}20`, color: option.color }}
                  >
                    {option.icon}
                  </div>
                  
                  {/* Text */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white font-medium mb-1">
                      {language === "fr" ? option.title.fr : option.title.en}
                    </h4>
                    <p className="text-white/60 text-sm">
                      {language === "fr" ? option.subtitle.fr : option.subtitle.en}
                    </p>
                  </div>
                  
                  {/* Arrow */}
                  <ChevronRight className="flex-shrink-0 w-5 h-5 text-white/40 group-hover:text-white/70 group-hover:translate-x-1 transition-all" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Voice Session Screen (Gemini Mode) */}
        {screen === "voice-session" && selectedCoach && selectedOption && (
          <div className="flex flex-col h-full">
            {/* Coach Photo - Large Format */}
            <div className="flex-1 flex flex-col items-center justify-center p-8">
              {/* Large Coach Photo with Glow */}
              <div className="relative mb-6">
                <div className={`absolute -inset-6 rounded-full bg-gradient-to-r from-emerald-400/30 via-teal-400/30 to-emerald-400/30 blur-2xl transition-opacity duration-500 ${isSpeaking ? "opacity-100 animate-pulse" : "opacity-30"}`} />
                <div className={`absolute -inset-3 rounded-full bg-gradient-to-r from-emerald-500/20 to-teal-500/20 blur-lg transition-opacity duration-300 ${isSpeaking ? "opacity-100" : "opacity-50"}`} />
                <img
                  src={selectedCoach.photo}
                  alt={selectedCoach.name}
                  className="relative w-40 h-40 rounded-full object-cover border-4 border-white/20 shadow-2xl"
                />
                {/* Speaking Indicator */}
                {isSpeaking && (
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1 px-3 py-1 bg-emerald-500 rounded-full shadow-lg">
                    <Volume2 className="w-4 h-4 text-white animate-pulse" />
                    <span className="text-xs font-medium text-white">
                      {language === "fr" ? "Parle..." : "Speaking..."}
                    </span>
                  </div>
                )}
              </div>

              {/* Coach Name & Topic */}
              <h3 className="text-white text-xl font-medium mb-2">{selectedCoach.name}</h3>
              <p className="text-emerald-400 text-sm mb-6">
                {language === "fr" ? selectedOption.title.fr : selectedOption.title.en}
              </p>

              {/* Waveform Visualization */}
              <div className="flex items-center justify-center gap-1 h-16 mb-6">
                {waveformValues.map((value, index) => (
                  <div
                    key={index}
                    className={`w-1.5 rounded-full transition-all duration-75 ${
                      isSpeaking ? "bg-emerald-400" : isListening ? "bg-blue-400" : "bg-white/30"
                    }`}
                    style={{ 
                      height: `${value * 100}%`,
                      opacity: isSpeaking || isListening ? 1 : 0.3
                    }}
                  />
                ))}
              </div>

              {/* Greeting Text */}
              <div className="max-w-md text-center">
                <p className="text-white/70 text-sm italic leading-relaxed">
                  "{language === "fr" ? selectedCoach.greeting.fr : selectedCoach.greeting.en}"
                </p>
              </div>
            </div>

            {/* Bottom Controls */}
            <div className="flex items-center justify-center gap-6 p-6 border-t border-white/10 bg-black/20">
              {/* Mic Button */}
              <button
                onClick={toggleListening}
                className={`relative w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl ${
                  isListening 
                    ? "bg-red-500 hover:bg-red-600 scale-110" 
                    : "bg-emerald-500 hover:bg-emerald-600"
                }`}
              >
                {isListening ? (
                  <MicOff className="w-7 h-7 text-white" />
                ) : (
                  <Mic className="w-7 h-7 text-white" />
                )}
                
                {/* Pulse Animation when listening */}
                {isListening && (
                  <div className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-30" />
                )}
              </button>
            </div>

            {/* Status Text */}
            <div className="text-center pb-4">
              <p className="text-white/50 text-xs">
                {isListening 
                  ? (language === "fr" ? "Appuyez pour arrêter" : "Tap to stop")
                  : (language === "fr" ? "Appuyez pour parler" : "Tap to speak")
                }
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
