import { useState, useEffect, useCallback, useRef } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

// Types
interface Coach {
  id: string;
  name: string;
  title: string;
  specialty: string;
  specialtyIcon: string;
  image: string;
  greeting: string;
  voiceKey: "steven" | "sue_anne" | "erika" | "preciosa";
}

interface Topic {
  id: string;
  icon: string;
  title: string;
  titleFr: string;
  subtitle: string;
  subtitleFr: string;
  color: string;
}

// Coach Data with voice keys for TTS
const coaches: Coach[] = [
  {
    id: "steven",
    name: "Prof. Steven",
    title: "Lead Coach",
    specialty: "Structure & Grammar",
    specialtyIcon: "📐",
    image: "https://rusingacademy-cdn.b-cdn.net/images/coaches/Steven(2).webp",
    greeting: "Hello! I'm Professor Steven. Ready to work on your structure and grammar today. Let's begin when you're ready.",
    voiceKey: "steven",
  },
  {
    id: "sue-anne",
    name: "Coach Sue-Anne",
    title: "Fluency Expert",
    specialty: "Fluency & Expression",
    specialtyIcon: "💬",
    image: "https://rusingacademy-cdn.b-cdn.net/images/coaches/Sue-Anne.webp",
    greeting: "Bonjour! I'm Sue-Anne. Let's work on making your French flow naturally. Ready when you are!",
    voiceKey: "sue_anne",
  },
  {
    id: "erica",
    name: "Coach Erica",
    title: "Performance Coach",
    specialty: "Stress Management",
    specialtyIcon: "🧘",
    image: "https://rusingacademy-cdn.b-cdn.net/images/coaches/ErikaFrank.webp",
    greeting: "Hi there! I'm Erica. Let's work on building your confidence and managing exam stress together.",
    voiceKey: "erika",
  },
  {
    id: "preciosa",
    name: "Coach Preciosa",
    title: "Vocabulary Specialist",
    specialty: "Vocabulary & Nuances",
    specialtyIcon: "📚",
    image: "https://rusingacademy-cdn.b-cdn.net/images/coaches/Preciosa2.webp",
    greeting: "Welcome! I'm Preciosa. Let's expand your vocabulary and master those subtle nuances of French.",
    voiceKey: "preciosa",
  }
];

// Topics Data
const topics: Topic[] = [
  {
    id: "flash",
    icon: "⚡",
    title: "Flash Challenge (5 min)",
    titleFr: "Défi Éclair (5 min)",
    subtitle: "Activate your vocabulary before a meeting.",
    subtitleFr: "Activez votre vocabulaire avant une réunion.",
    color: "#FFD700"
  },
  {
    id: "scenarios",
    icon: "🏛️",
    title: "Government Scenarios",
    titleFr: "Scénarios Gouvernementaux",
    subtitle: "Realistic simulations: HR, Briefings, Policies.",
    subtitleFr: "Simulations réalistes : RH, Briefings, Politiques.",
    color: "#4ECDC4"
  },
  {
    id: "simulator",
    icon: "🎯",
    title: "Oral Simulator (Levels B/C)",
    titleFr: "Simulateur d'Oral (Niveaux B/C)",
    subtitle: "Test yourself against official criteria.",
    subtitleFr: "Testez-vous contre les critères officiels.",
    color: "#9B59B6"
  },
  {
    id: "coaching",
    icon: "💚",
    title: "Strategic Coaching & Diagnosis",
    titleFr: "Coaching Stratégique & Diagnostic",
    subtitle: "Stuck? Unlock your potential with a human expert.",
    subtitleFr: "Bloqué ? Débloquez votre potentiel avec un expert.",
    color: "#2ECC71"
  }
];

// Animated Waveform Component
const AnimatedWaveform = ({ isActive }: { isActive: boolean }) => {
  return (
    <div className="flex items-center justify-center gap-1 h-16">
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          className={`w-1 rounded-full transition-all duration-150 ${
            isActive ? "bg-gradient-to-t from-cyan-400 to-[#145A5B]" : "bg-gray-600"
          }`}
          style={{
            height: isActive ? `${Math.random() * 40 + 20}px` : "8px",
            animation: isActive ? `wave ${0.5 + Math.random() * 0.5}s ease-in-out infinite alternate` : "none",
            animationDelay: `${i * 0.05}s`
          }}
        />
      ))}
      <style>{`
        @keyframes wave {
          0% { height: 8px; }
          100% { height: ${Math.random() * 40 + 20}px; }
        }
      `}</style>
    </div>
  );
};

// Main Component
export default function SLEAICompanionWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentScreen, setCurrentScreen] = useState<"coaches" | "topics" | "voice">("coaches");
  const [selectedCoach, setSelectedCoach] = useState<Coach | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [currentCoachIndex, setCurrentCoachIndex] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // TTS mutation for generating coach audio
  const generateCoachAudioMutation = trpc.audio.generateCoachAudio.useMutation({
    onSuccess: (data) => {
      if (data.audioUrl && audioRef.current) {
        audioRef.current.src = data.audioUrl;
        audioRef.current.play().catch(() => {
          toast.error("Impossible de lire l'audio. Vérifiez vos paramètres de son.");
        });
        setIsSpeaking(true);
      }
      setIsGeneratingAudio(false);
    },
    onError: (error) => {
      console.error("TTS Error:", error);
      toast.error("Erreur lors de la génération audio");
      setIsGeneratingAudio(false);
      setIsSpeaking(false);
    },
  });

  // Listen for custom event from mobile button to open the widget
  useEffect(() => {
    const handleOpenEvent = () => setIsOpen(true);
    window.addEventListener("openSLEAICompanion", handleOpenEvent);
    return () => window.removeEventListener("openSLEAICompanion", handleOpenEvent);
  }, []);

  // Cross-fade animation for coaches in widget
  useEffect(() => {
    if (!isOpen) {
      const interval = setInterval(() => {
        setCurrentCoachIndex((prev) => (prev + 1) % coaches.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [isOpen]);

  // Play coach greeting with TTS when entering voice screen
  const playCoachGreeting = useCallback(async (coach: Coach) => {
    if (!voiceEnabled) return;
    
    setIsGeneratingAudio(true);
    setIsSpeaking(true);
    
    try {
      await generateCoachAudioMutation.mutateAsync({
        text: coach.greeting,
        coachName: coach.voiceKey,
        speed: 1.0,
      });
    } catch (error) {
      console.error("Failed to generate greeting:", error);
      setIsSpeaking(false);
      setIsGeneratingAudio(false);
    }
  }, [voiceEnabled, generateCoachAudioMutation]);

  // Handle audio ended
  const handleAudioEnded = useCallback(() => {
    setIsSpeaking(false);
  }, []);

  // Handle coach selection
  const handleCoachSelect = useCallback((coach: Coach) => {
    setSelectedCoach(coach);
    setCurrentScreen("topics");
  }, []);

  // Handle topic selection
  const handleTopicSelect = useCallback((topic: Topic) => {
    setSelectedTopic(topic);
    setCurrentScreen("voice");
    
    // Play greeting with coach's cloned voice
    if (selectedCoach && voiceEnabled) {
      playCoachGreeting(selectedCoach);
    } else {
      // Fallback: simulate speaking without audio
      setIsSpeaking(true);
      setTimeout(() => setIsSpeaking(false), 4000);
    }
  }, [selectedCoach, voiceEnabled, playCoachGreeting]);

  // Handle back navigation
  const handleBack = useCallback(() => {
    // Stop any playing audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsSpeaking(false);
    
    if (currentScreen === "voice") {
      setCurrentScreen("topics");
      setSelectedTopic(null);
    } else if (currentScreen === "topics") {
      setCurrentScreen("coaches");
      setSelectedCoach(null);
    }
  }, [currentScreen]);

  // Handle close
  const handleClose = useCallback(() => {
    // Stop any playing audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    
    setIsOpen(false);
    setCurrentScreen("coaches");
    setSelectedCoach(null);
    setSelectedTopic(null);
    setIsListening(false);
    setIsSpeaking(false);
    setIsGeneratingAudio(false);
  }, []);

  // Toggle microphone
  const toggleMicrophone = useCallback(() => {
    setIsListening((prev) => !prev);
    if (!isListening) {
      setIsSpeaking(false);
      // Stop any playing audio when user starts speaking
      if (audioRef.current) {
        audioRef.current.pause();
      }
    }
  }, [isListening]);

  // Toggle voice enabled
  const toggleVoice = useCallback(() => {
    setVoiceEnabled((prev) => !prev);
    if (voiceEnabled && audioRef.current) {
      audioRef.current.pause();
      setIsSpeaking(false);
    }
    toast.success(voiceEnabled ? "Voix désactivée" : "Voix activée");
  }, [voiceEnabled]);

  // Replay greeting
  const replayGreeting = useCallback(() => {
    if (selectedCoach && voiceEnabled) {
      playCoachGreeting(selectedCoach);
    }
  }, [selectedCoach, voiceEnabled, playCoachGreeting]);

  return (
    <>
      {/* Hidden audio element for TTS playback */}
      <audio
        ref={audioRef}
        onEnded={handleAudioEnded}
        onError={() => {
          setIsSpeaking(false);
          setIsGeneratingAudio(false);
        }}
        className="hidden"
      />

      {/* ========================================== */}
      {/* WIDGET BUTTON - PAGE 6 EXACT STYLE */}
      {/* Violet/Lavender Luminous Ring + Golden Star + Breathing Animation */}
      {/* ========================================== */}
      <div className="relative flex flex-col items-center">
        <button
          onClick={() => setIsOpen(true)}
          className="relative group focus:outline-none"
          aria-label="SLE AI Companion - Click to start a conversation with our AI coaches"
          title="Chat with our AI coaches for SLE preparation help"
        >
          {/* LAYER 1: Outer Breathing Glow - Violet/Teal Double Ring - GOLD STANDARD */}
          <div 
            className="absolute rounded-full"
            style={{
              inset: '-16px',
              background: 'conic-gradient(from 0deg, #6D28D9, #8B5CF6, #0891B2, #06B6D4, #0891B2, #8B5CF6, #6D28D9)',
              filter: 'blur(12px)',
              opacity: 0.9,
              animation: 'breathe 3s ease-in-out infinite, rotateGlow 8s linear infinite'
            }}
          />
          
          {/* LAYER 2: Inner Breathing Glow Ring - Teal Accent */}
          <div 
            className="absolute rounded-full"
            style={{
              inset: '-8px',
              background: 'conic-gradient(from 180deg, #0891B2, #22D3EE, #8B5CF6, #A78BFA, #8B5CF6, #22D3EE, #0891B2)',
              filter: 'blur(6px)',
              opacity: 0.7,
              animation: 'breathe 3s ease-in-out infinite 0.5s'
            }}
          />
          
          {/* LAYER 3: Main Violet/Teal Gradient Ring - GOLD STANDARD 100px */}
          <div 
            className="relative rounded-full"
            style={{
              width: '100px',
              height: '100px',
              padding: '4px',
              background: 'conic-gradient(from 0deg, #6D28D9, #8B5CF6, #0891B2, #06B6D4, #0891B2, #8B5CF6, #6D28D9)',
              boxShadow: '0 0 30px rgba(109, 40, 217, 0.8), 0 0 60px rgba(8, 145, 178, 0.6), 0 0 90px rgba(139, 92, 246, 0.4), inset 0 0 20px rgba(255, 255, 255, 0.2)'
            }}
          >
            {/* Inner Container with Glassmorphism */}
            <div className="w-full h-full rounded-full bg-slate-900/80 backdrop-blur-sm p-[2px] overflow-hidden">
              {/* Photo Container with Cross-Fade */}
              <div className="relative w-full h-full rounded-full overflow-hidden">
                {coaches.map((coach, index) => (
                  <img
                    key={coach.id}
                    src={coach.image}
                    alt={coach.name}
                    className="absolute inset-0 w-full h-full object-cover rounded-full"
                    style={{
                      opacity: index === currentCoachIndex ? 1 : 0,
                      transition: 'opacity 1s ease-in-out'
                    }}
                  />
                ))}
              </div>
            </div>
          </div>


          {/* Online Indicator - Bottom Right - Adapted for 100px widget */}
          <div 
            className="absolute flex items-center justify-center z-10"
            style={{
              bottom: '4px',
              right: '4px'
            }}
          >
            <span 
              className="absolute rounded-full"
              style={{
                width: '20px',
                height: '20px',
                backgroundColor: '#10B981',
                opacity: 0.6,
                animation: 'ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite'
              }}
            />
            <span 
              className="relative rounded-full"
              style={{ 
                width: '14px',
                height: '14px',
                backgroundColor: '#10B981',
                border: '3px solid #1e1b4b',
                boxShadow: '0 0 10px rgba(16, 185, 129, 0.6)'
              }}
            />
          </div>
        </button>
        
        {/* Label - Premium Style */}
        <span 
          className="mt-2 text-sm font-semibold tracking-wide"
          style={{
            background: 'linear-gradient(90deg, #06B6D4, #8B5CF6, #06B6D4)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 0 20px rgba(139, 92, 246, 0.5)'
          }}
        >
          SLE AI Companion
        </span>
      </div>

      {/* Keyframes for animations */}
      <style>{`
        @keyframes breathe {
          0%, 100% { transform: scale(1); opacity: 0.7; }
          50% { transform: scale(1.1); opacity: 1; }
        }
        @keyframes rotateGlow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes ping {
          75%, 100% { transform: scale(2); opacity: 0; }
        }
      `}</style>

      {/* ========================================== */}
      {/* EXPANDED MODAL */}
      {/* ========================================== */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={handleClose}
          />
          
          {/* Modal Container */}
          <div 
            className="relative w-full max-w-md rounded-2xl overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
              boxShadow: '0 0 40px rgba(139, 92, 246, 0.3), 0 0 80px rgba(6, 182, 212, 0.2)'
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                {currentScreen !== "coaches" && (
                  <button
                    onClick={handleBack}
                    className="p-2 rounded-full hover:bg-white/10 transition-colors"
                  >
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                )}
                <h2 className="text-lg font-bold text-white">
                  {currentScreen === "coaches" && "Choose Your Coach"}
                  {currentScreen === "topics" && selectedCoach?.name}
                  {currentScreen === "voice" && selectedTopic?.title}
                </h2>
              </div>
              
              <div className="flex items-center gap-2">
                {/* Voice Toggle Button */}
                <button
                  onClick={toggleVoice}
                  className={`p-2 rounded-full transition-colors ${
                    voiceEnabled ? "bg-cyan-500/20 text-cyan-400" : "bg-gray-500/20 text-gray-400"
                  }`}
                  title={voiceEnabled ? "Désactiver la voix" : "Activer la voix"}
                >
                  {voiceEnabled ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                    </svg>
                  )}
                </button>
                
                {/* Close Button */}
                <button
                  onClick={handleClose}
                  className="p-2 rounded-full hover:bg-white/10 transition-colors"
                >
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            {/* Content Area */}
            <div className="p-4 max-h-[70vh] overflow-y-auto">
              {/* Screen 1: Coach Selection */}
              {currentScreen === "coaches" && (
                <div className="grid grid-cols-2 gap-4">
                  {coaches.map((coach) => (
                    <button
                      key={coach.id}
                      onClick={() => handleCoachSelect(coach)}
                      className="group relative p-4 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-400/50 hover:bg-white/10 transition-all duration-300"
                    >
                      {/* Coach Image */}
                      <div className="relative w-20 h-20 mx-auto mb-3 rounded-full overflow-hidden border-2 border-white/20 group-hover:border-cyan-400/50 transition-colors">
                        <img
                          src={coach.image}
                          alt={coach.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      {/* Coach Info */}
                      <h3 className="text-white font-semibold text-sm">{coach.name}</h3>
                      <p className="text-cyan-400 text-xs">{coach.title}</p>
                      <div className="mt-2 flex items-center justify-center gap-1 text-gray-400 text-xs">
                        <span>{coach.specialtyIcon}</span>
                        <span>{coach.specialty}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Screen 2: Topic Selection */}
              {currentScreen === "topics" && selectedCoach && (
                <div className="space-y-3">
                  {/* Coach Mini Profile */}
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 mb-4">
                    <img
                      src={selectedCoach.image}
                      alt={selectedCoach.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-cyan-400/50"
                    />
                    <div>
                      <h3 className="text-white font-semibold">{selectedCoach.name}</h3>
                      <p className="text-cyan-400 text-sm">{selectedCoach.specialty}</p>
                    </div>
                  </div>
                  
                  {/* Topics */}
                  {topics.map((topic) => (
                    <button
                      key={topic.id}
                      onClick={() => handleTopicSelect(topic)}
                      className="w-full group flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-400/50 hover:bg-white/10 transition-all duration-300"
                    >
                      {/* Icon */}
                      <div 
                        className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                        style={{ backgroundColor: `${topic.color}20` }}
                      >
                        {topic.icon}
                      </div>
                      
                      {/* Text */}
                      <div className="flex-1 text-left">
                        <h4 className="text-white font-semibold">{topic.title}</h4>
                        <p className="text-gray-400 text-sm">{topic.subtitle}</p>
                      </div>
                      
                      {/* Arrow */}
                      <svg className="w-5 h-5 text-gray-500 group-hover:text-[#0F3D3E] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  ))}
                </div>
              )}

              {/* Screen 3: Voice Interface (Gemini Mode) */}
              {currentScreen === "voice" && selectedCoach && selectedTopic && (
                <div className="flex flex-col items-center py-8">
                  {/* Coach Image - Large with Violet/Cyan Glow */}
                  <div className="relative mb-6">
                    <div 
                      className="absolute -inset-3 rounded-full blur-lg"
                      style={{
                        background: 'linear-gradient(135deg, #8B5CF6 0%, #06B6D4 50%, #8B5CF6 100%)',
                        opacity: isSpeaking ? 0.7 : 0.3,
                        animation: isSpeaking ? 'breathe 1s ease-in-out infinite' : 'breathe 3s ease-in-out infinite'
                      }}
                    />
                    <div 
                      className="relative w-32 h-32 rounded-full overflow-hidden p-[3px]"
                      style={{
                        background: 'linear-gradient(135deg, #8B5CF6, #06B6D4, #8B5CF6)'
                      }}
                    >
                      <img
                        src={selectedCoach.image}
                        alt={selectedCoach.name}
                        className="w-full h-full object-cover rounded-full"
                      />
                    </div>
                    
                    {/* Speaking/Loading Indicator */}
                    {(isSpeaking || isGeneratingAudio) && (
                      <div 
                        className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full"
                        style={{
                          background: 'linear-gradient(90deg, #06B6D4, #8B5CF6)'
                        }}
                      >
                        <span className="text-white text-xs font-medium flex items-center gap-1">
                          <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                          {isGeneratingAudio ? "Generating..." : "Speaking..."}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  {/* Coach Name */}
                  <h3 className="text-xl font-bold text-white mb-1">{selectedCoach.name}</h3>
                  <p className="text-cyan-400 text-sm mb-6">{selectedTopic.title}</p>
                  
                  {/* Waveform */}
                  <div className="w-full mb-6">
                    <AnimatedWaveform isActive={isSpeaking || isListening} />
                  </div>
                  
                  {/* Greeting Message */}
                  <div className="w-full p-4 rounded-xl bg-white/5 border border-white/10 mb-4">
                    <p className="text-gray-300 text-sm italic text-center">
                      "{selectedCoach.greeting}"
                    </p>
                  </div>
                  
                  {/* Replay Button */}
                  {voiceEnabled && !isSpeaking && !isGeneratingAudio && (
                    <button
                      onClick={replayGreeting}
                      className="mb-4 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-sm flex items-center gap-2 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Replay
                    </button>
                  )}
                  
                  {/* Microphone Button */}
                  <button
                    onClick={toggleMicrophone}
                    disabled={isGeneratingAudio}
                    className={`relative group w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${
                      isListening 
                        ? "bg-gradient-to-br from-red-500 to-red-600 scale-110" 
                        : isGeneratingAudio
                        ? "bg-gray-500 cursor-not-allowed"
                        : "bg-gradient-to-br from-cyan-500 to-emerald-500 hover:scale-105"
                    }`}
                  >
                    {/* Pulse Animation */}
                    {isListening && (
                      <span className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-50" />
                    )}
                    
                    {/* Mic Icon */}
                    <svg className="w-8 h-8 text-white relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                  </button>
                  
                  <p className="text-gray-400 text-sm mt-3">
                    {isListening ? "Listening... Tap to stop" : isGeneratingAudio ? "Generating audio..." : "Tap to speak"}
                  </p>
                </div>
              )}
            </div>
            
            {/* Footer Gradient - Violet/Cyan */}
            <div 
              className="absolute bottom-0 left-0 right-0 h-1"
              style={{
                background: 'linear-gradient(90deg, #06B6D4 0%, #8B5CF6 50%, #06B6D4 100%)'
              }}
            />
          </div>
        </div>
      )}
    </>
  );
}
