import { useState, useEffect, useCallback } from "react";

// Types
interface Coach {
  id: string;
  name: string;
  title: string;
  specialty: string;
  specialtyIcon: string;
  image: string;
  greeting: string;
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

// Coach Data
const coaches: Coach[] = [
  {
    id: "steven",
    name: "Prof. Steven",
    title: "Lead Coach",
    specialty: "Structure & Grammar",
    specialtyIcon: "📐",
    image: "/images/coaches/Steven(2).webp",
    greeting: "Hello! I'm Professor Steven. Ready to work on your structure and grammar today. Let's begin when you're ready."
  },
  {
    id: "sue-anne",
    name: "Coach Sue-Anne",
    title: "Fluency Expert",
    specialty: "Fluency & Expression",
    specialtyIcon: "💬",
    image: "/images/coaches/Sue-Anne.webp",
    greeting: "Bonjour! I'm Sue-Anne. Let's work on making your French flow naturally. Ready when you are!"
  },
  {
    id: "erica",
    name: "Coach Erica",
    title: "Performance Coach",
    specialty: "Stress Management",
    specialtyIcon: "🧘",
    image: "/images/coaches/ErikaFrank.webp",
    greeting: "Hi there! I'm Erica. Let's work on building your confidence and managing exam stress together."
  },
  {
    id: "preciosa",
    name: "Coach Preciosa",
    title: "Vocabulary Specialist",
    specialty: "Vocabulary & Nuances",
    specialtyIcon: "📚",
    image: "/images/coaches/Preciosa2.webp",
    greeting: "Welcome! I'm Preciosa. Let's expand your vocabulary and master those subtle nuances of French."
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
            isActive ? "bg-gradient-to-t from-cyan-400 to-purple-500" : "bg-gray-600"
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
  const [isSpeaking, setIsSpeaking] = useState(true);

  // Cross-fade animation for coaches in widget
  useEffect(() => {
    if (!isOpen) {
      const interval = setInterval(() => {
        setCurrentCoachIndex((prev) => (prev + 1) % coaches.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isOpen]);

  // Handle coach selection
  const handleCoachSelect = useCallback((coach: Coach) => {
    setSelectedCoach(coach);
    setCurrentScreen("topics");
  }, []);

  // Handle topic selection
  const handleTopicSelect = useCallback((topic: Topic) => {
    setSelectedTopic(topic);
    setCurrentScreen("voice");
    setIsSpeaking(true);
    // Simulate AI speaking
    setTimeout(() => setIsSpeaking(false), 4000);
  }, []);

  // Handle back navigation
  const handleBack = useCallback(() => {
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
    setIsOpen(false);
    setCurrentScreen("coaches");
    setSelectedCoach(null);
    setSelectedTopic(null);
    setIsListening(false);
    setIsSpeaking(false);
  }, []);

  // Toggle microphone
  const toggleMicrophone = useCallback(() => {
    setIsListening((prev) => !prev);
    if (!isListening) {
      setIsSpeaking(false);
    }
  }, [isListening]);

  return (
    <>
      {/* Widget Button - Premium Glassmorphism Design */}
      <div className="relative flex flex-col items-center">
        <button
          onClick={() => setIsOpen(true)}
          className="relative group focus:outline-none"
          aria-label="SLE AI Companion"
        >
          {/* Outer Glow Ring */}
          <div className="absolute -inset-2 bg-gradient-to-r from-purple-500 via-violet-400 to-purple-500 rounded-full opacity-60 group-hover:opacity-80 blur-md transition-all duration-500 animate-pulse" />
          
          {/* Premium Ring with Golden Accent */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-400 via-purple-500 to-cyan-400 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300" />
          
          {/* Main Container */}
          <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-xl border-2 border-purple-400/50 overflow-hidden shadow-2xl">
            {/* Cross-fade Coach Images */}
            {coaches.map((coach, index) => (
              <img
                key={coach.id}
                src={coach.image}
                alt={coach.name}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                  index === currentCoachIndex ? "opacity-100" : "opacity-0"
                }`}
              />
            ))}
            
            {/* Shimmer Overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>
          
          {/* Online Indicator */}
          <div className="absolute -bottom-0.5 -right-0.5 flex items-center justify-center">
            <span className="absolute w-4 h-4 bg-emerald-400 rounded-full animate-ping opacity-75" />
            <span className="relative w-3 h-3 bg-emerald-500 rounded-full border-2 border-white shadow-lg" />
          </div>
          
          {/* AI Sparkle Icon - REMOVED per Page 13 Widget Patch */}
        </button>
        
        {/* Label */}
        <span className="mt-2 text-xs font-medium text-cyan-500 whitespace-nowrap">
          SLE AI Companion
        </span>
      </div>

      {/* Modal Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={handleClose}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md" />
          
          {/* Modal Container */}
          <div 
            className={`relative w-full transition-all duration-500 ease-out ${
              currentScreen === "voice" 
                ? "max-w-2xl h-[80vh]" 
                : "max-w-md"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Premium Glassmorphism Card */}
            <div className="relative bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-900/95 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
              
              {/* Golden Accent Line */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-purple-500 to-cyan-400" />
              
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
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      {currentScreen === "coaches" && "Choose Your Partner"}
                      {currentScreen === "topics" && selectedCoach?.name}
                      {currentScreen === "voice" && "Session in Progress"}
                    </h3>
                    <p className="text-sm text-cyan-400">
                      {currentScreen === "coaches" && "Select your practice partner today"}
                      {currentScreen === "topics" && selectedCoach?.specialty}
                      {currentScreen === "voice" && selectedTopic?.title}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  className="p-2 rounded-full hover:bg-white/10 transition-colors"
                >
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                
                {/* Screen 1: Coach Selection */}
                {currentScreen === "coaches" && (
                  <div className="grid grid-cols-2 gap-4">
                    {coaches.map((coach) => (
                      <button
                        key={coach.id}
                        onClick={() => handleCoachSelect(coach)}
                        className="group relative p-4 rounded-2xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 hover:border-amber-400/50 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-amber-400/10"
                      >
                        {/* Coach Image */}
                        <div className="relative w-20 h-20 mx-auto mb-3 rounded-full overflow-hidden border-2 border-cyan-400/50 group-hover:border-amber-400 transition-colors">
                          <img
                            src={coach.image}
                            alt={coach.name}
                            className="w-full h-full object-cover"
                          />
                          {/* Hover Glow */}
                          <div className="absolute inset-0 bg-gradient-to-t from-purple-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        
                        {/* Coach Info */}
                        <h4 className="text-white font-semibold text-sm">{coach.name}</h4>
                        <p className="text-cyan-400 text-xs flex items-center justify-center gap-1 mt-1">
                          <span>{coach.specialtyIcon}</span>
                          <span>{coach.specialty}</span>
                        </p>
                      </button>
                    ))}
                  </div>
                )}

                {/* Screen 2: Topic Selection */}
                {currentScreen === "topics" && selectedCoach && (
                  <div className="space-y-3">
                    {/* Coach Preview */}
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 mb-4">
                      <img
                        src={selectedCoach.image}
                        alt={selectedCoach.name}
                        className="w-12 h-12 rounded-full object-cover border-2 border-cyan-400"
                      />
                      <div className="text-left">
                        <h4 className="text-white font-semibold">{selectedCoach.name}</h4>
                        <p className="text-cyan-400 text-sm">{selectedCoach.specialty}</p>
                      </div>
                    </div>
                    
                    {/* Topics */}
                    {topics.map((topic) => (
                      <button
                        key={topic.id}
                        onClick={() => handleTopicSelect(topic)}
                        className="w-full group flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-white/5 to-white/0 border border-white/10 hover:border-amber-400/50 transition-all duration-300 hover:translate-x-1"
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
                        <svg className="w-5 h-5 text-gray-500 group-hover:text-amber-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    ))}
                  </div>
                )}

                {/* Screen 3: Voice Interface (Gemini Mode) */}
                {currentScreen === "voice" && selectedCoach && selectedTopic && (
                  <div className="flex flex-col items-center py-8">
                    {/* Coach Image - Large */}
                    <div className="relative mb-6">
                      <div className="absolute -inset-2 bg-gradient-to-r from-purple-500 via-cyan-500 to-purple-500 rounded-full opacity-50 blur-lg animate-pulse" />
                      <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white/20">
                        <img
                          src={selectedCoach.image}
                          alt={selectedCoach.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      {/* Speaking Indicator */}
                      {isSpeaking && (
                        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full">
                          <span className="text-white text-xs font-medium flex items-center gap-1">
                            <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                            Speaking...
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
                    <div className="w-full p-4 rounded-xl bg-white/5 border border-white/10 mb-8">
                      <p className="text-gray-300 text-sm italic text-center">
                        "{selectedCoach.greeting}"
                      </p>
                    </div>
                    
                    {/* Microphone Button */}
                    <button
                      onClick={toggleMicrophone}
                      className={`relative group w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${
                        isListening 
                          ? "bg-gradient-to-br from-red-500 to-red-600 scale-110" 
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
                      {isListening ? "Listening... Tap to stop" : "Tap to speak"}
                    </p>
                  </div>
                )}
              </div>
              
              {/* Footer Gradient */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 via-purple-500 to-amber-400" />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
