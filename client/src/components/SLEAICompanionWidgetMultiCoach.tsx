import { useState, useEffect, useRef, useCallback } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { useAudioRecorder, formatDuration } from "@/hooks/useAudioRecorder";

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
  coachKey: "STEVEN" | "SUE_ANNE" | "ERIKA" | "PRECIOSA";
}

interface Message {
  role: "user" | "assistant";
  content: string;
  audioUrl?: string;
  score?: number;
}

// Coach Data with voice keys for TTS
const coaches: Coach[] = [
  {
    id: "steven",
    name: "Coach Steven",
    title: "French SLE Coach",
    specialty: "Oral French (FSL)",
    specialtyIcon: "🇫🇷",
    image: "https://rusingacademy-cdn.b-cdn.net/images/coaches/Steven(2).webp",
    greeting: "Bonjour ! Je m'appelle Coach Steven. Es-tu prêt à commencer ta simulation de l'examen oral de langue seconde avec moi ? On va travailler ensemble pour que tu sois au top le jour J !",
    voiceKey: "steven",
    coachKey: "STEVEN",
  },
  {
    id: "preciosa",
    name: "Coach Preciosa",
    title: "English SLE Coach",
    specialty: "Oral English (ESL)",
    specialtyIcon: "🇬🇧",
    image: "https://rusingacademy-cdn.b-cdn.net/images/coaches/Preciosa2.webp",
    greeting: "Hi there! I'm Coach Preciosa. Are you ready to start your Second Language Oral Exam simulation with me? Let's work together to make sure you're fully prepared and confident!",
    voiceKey: "preciosa",
    coachKey: "PRECIOSA",
  }
];

// Premium Animated Waveform — always visible, reacts to audio activity
const PremiumWaveform = ({ isActive, variant }: { isActive: boolean; variant: "coach" | "user" }) => {
  const bars = 24;
  const colors = variant === "coach"
    ? { from: "#8B5CF6", to: "#06B6D4" }
    : { from: "#06B6D4", to: "#10B981" };

  return (
    <div className="flex items-end justify-center gap-[2px] h-10 w-full">
      {Array.from({ length: bars }).map((_, i) => (
        <div
          key={i}
          className="rounded-full transition-all"
          style={{
            width: "3px",
            height: isActive ? `${Math.random() * 28 + 6}px` : "3px",
            background: isActive
              ? `linear-gradient(to top, ${colors.from}, ${colors.to})`
              : "rgba(255,255,255,0.15)",
            animation: isActive ? `premiumWave${i % 8} 0.6s ease-in-out infinite` : "none",
            animationDelay: `${i * 0.04}s`,
            transition: isActive ? "none" : "height 0.4s ease-out, background 0.4s ease-out",
          }}
        />
      ))}
      <style>{`
        ${Array.from({ length: 8 }).map((_, i) => `
          @keyframes premiumWave${i} {
            0%, 100% { height: ${6 + Math.random() * 12}px; }
            50% { height: ${18 + Math.random() * 22}px; }
          }
        `).join("")}
      `}</style>
    </div>
  );
};

// Recording Indicator Component
const RecordingIndicator = ({ duration }: { duration: number }) => (
  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 border border-red-500/50">
    <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
    <span className="text-red-400 text-sm font-mono">{formatDuration(duration)}</span>
  </div>
);

// Main Component
export default function SLEAICompanionWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentScreen, setCurrentScreen] = useState<"coaches" | "chat">("coaches");
  const [selectedCoach, setSelectedCoach] = useState<Coach | null>(null);
  const [currentCoachIndex, setCurrentCoachIndex] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isProcessingMessage, setIsProcessingMessage] = useState(false);
  const [textInput, setTextInput] = useState("");
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [isStartingSession, setIsStartingSession] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Audio recorder hook
  const {
    isRecording,
    isProcessing,
    duration,
    startRecording,
    stopRecording,
    cancelRecording,
    audioBlob,
    error: recordingError,
  } = useAudioRecorder({
    maxDuration: 120,
    onError: (error) => {
      toast.error(`Erreur d'enregistrement: ${error.message}`);
    },
  });

  // Start session mutation
  const startSessionMutation = trpc.sleCompanion.startSession.useMutation();

  // TTS mutation for generating coach audio (uses audio.generateCoachAudio which calls MiniMax)
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

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle recording error
  useEffect(() => {
    if (recordingError) {
      toast.error(`Erreur: ${recordingError.message}`);
    }
  }, [recordingError]);

  // Process recorded audio when recording completes
  useEffect(() => {
    if (audioBlob && !isRecording && !isProcessing) {
      handleAudioRecorded(audioBlob);
    }
  }, [audioBlob, isRecording, isProcessing]);

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

  // Handle coach selection — immediately start a full mock oral exam session
  const handleCoachSelect = useCallback(async (coach: Coach) => {
    setSelectedCoach(coach);
    setCurrentScreen("chat");
    setMessages([]);
    setIsStartingSession(true);
    
    try {
      // Start a full mock oral exam session directly
      const session = await startSessionMutation.mutateAsync({
        coachKey: coach.coachKey,
        level: "B" as const,
        skill: "oral_expression" as const,
        topic: "Full Mock Exam (OLA)",
      });
      
      setSessionId(session.sessionId);
      
      // Use the server-generated welcome message
      setMessages([{ role: "assistant", content: session.welcomeMessage || coach.greeting }]);
      
      // Play greeting with coach's cloned voice
      if (voiceEnabled) {
        playCoachGreeting(coach);
      }
    } catch (error) {
      console.error("Failed to start session:", error);
      toast.error("Erreur lors du démarrage de la session");
      // Fallback: show greeting without session
      setMessages([{ role: "assistant", content: coach.greeting }]);
    } finally {
      setIsStartingSession(false);
    }
  }, [voiceEnabled, playCoachGreeting, startSessionMutation]);

  // End session mutation
  const endSessionMutation = trpc.sleCompanion.endSession.useMutation();

  // Handle back navigation
  const handleBack = useCallback(() => {
    // Stop any playing audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsSpeaking(false);
    cancelRecording();
    
    if (currentScreen === "chat") {
      // End the session on the server if one is active
      if (sessionId) {
        endSessionMutation.mutate({ sessionId });
        setSessionId(null);
      }
      setCurrentScreen("coaches");
      setSelectedCoach(null);
      setMessages([]);
    }
  }, [currentScreen, cancelRecording, sessionId, endSessionMutation]);

  // Handle close
  const handleClose = useCallback(() => {
    // Stop any playing audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    cancelRecording();
    
    // End the session on the server if one is active
    if (sessionId) {
      endSessionMutation.mutate({ sessionId });
    }
    
    setIsOpen(false);
    setCurrentScreen("coaches");
    setSelectedCoach(null);
    setSessionId(null);
    setIsSpeaking(false);
    setIsGeneratingAudio(false);
    setMessages([]);
  }, [cancelRecording, sessionId, endSessionMutation]);

  // Upload and transcribe audio mutation
  const uploadAndTranscribeMutation = trpc.sleCompanion.uploadAndTranscribeAudio.useMutation();
  
  // Send message mutation
  const sendMessageMutation = trpc.sleCompanion.sendMessage.useMutation();

  // Handle audio recorded
  const handleAudioRecorded = useCallback(async (blob: Blob) => {
    if (!selectedCoach) return;
    
    setIsProcessingMessage(true);
    
    try {
      // Convert blob to base64
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve, reject) => {
        reader.onloadend = () => {
          const base64 = (reader.result as string).split(',')[1];
          resolve(base64);
        };
        reader.onerror = reject;
      });
      reader.readAsDataURL(blob);
      const audioBase64 = await base64Promise;
      
      // Upload and transcribe
      if (!sessionId) {
        toast.error("Session non initialisée.");
        setIsProcessingMessage(false);
        return;
      }
      const transcriptionResult = await uploadAndTranscribeMutation.mutateAsync({
        audioBase64,
        mimeType: blob.type || "audio/webm",
        sessionId,
        language: "fr",
      });
      
      const transcribedText = transcriptionResult.transcription || "(Transcription non disponible)";
      
      // Add user message
      setMessages(prev => [...prev, { role: "user", content: transcribedText }]);
      
      // Get coach response using LLM
      const coachResponse = await sendMessageMutation.mutateAsync({
        sessionId,
        message: transcribedText,
      });
      
      // Add coach response
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: coachResponse.coachResponse || "",
        score: coachResponse.evaluation?.score,
      }]);
      setIsProcessingMessage(false);
      
      // Play coach response with TTS
      if (voiceEnabled && selectedCoach) {
        generateCoachAudioMutation.mutate({
          text: coachResponse.coachResponse || "",
          coachName: selectedCoach.voiceKey,
          speed: 1.0,
        });
      }
    } catch (error) {
      console.error("Error processing audio:", error);
      toast.error("Erreur lors du traitement de l'audio");
      setIsProcessingMessage(false);
    }
  }, [selectedCoach, sessionId, voiceEnabled, generateCoachAudioMutation, uploadAndTranscribeMutation, sendMessageMutation]);

  // Handle text message send
  const handleSendTextMessage = useCallback(async () => {
    if (!textInput.trim() || !selectedCoach || isProcessingMessage) return;
    
    const userMessage = textInput.trim();
    setTextInput("");
    setIsProcessingMessage(true);
    
    // Add user message
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    
    try {
      if (!sessionId) {
        toast.error("Session non initialisée.");
        setIsProcessingMessage(false);
        return;
      }
      // Get coach response using LLM
      const coachResponse = await sendMessageMutation.mutateAsync({
        sessionId,
        message: userMessage,
      });
      
      // Add coach response
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: coachResponse.coachResponse || "",
        score: coachResponse.evaluation?.score,
      }]);
      setIsProcessingMessage(false);
      
      // Play coach response with TTS
      if (voiceEnabled && selectedCoach) {
        generateCoachAudioMutation.mutate({
          text: coachResponse.coachResponse || "",
          coachName: selectedCoach.voiceKey,
          speed: 1.0,
        });
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Erreur lors de l'envoi du message");
      setIsProcessingMessage(false);
    }
  }, [textInput, selectedCoach, sessionId, isProcessingMessage, voiceEnabled, generateCoachAudioMutation, sendMessageMutation]);

  // Toggle microphone recording
  const toggleMicrophone = useCallback(() => {
    if (isRecording) {
      stopRecording();
    } else {
      // Stop any playing audio when user starts speaking
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setIsSpeaking(false);
      startRecording();
    }
  }, [isRecording, startRecording, stopRecording]);

  // Toggle voice enabled
  const toggleVoice = useCallback(() => {
    setVoiceEnabled((prev) => !prev);
    if (voiceEnabled && audioRef.current) {
      audioRef.current.pause();
      setIsSpeaking(false);
    }
    toast.success(voiceEnabled ? "Voix désactivée" : "Voix activée");
  }, [voiceEnabled]);

  return (
    <>
      {/* Hidden audio element for TTS playback */}
      <audio 
        ref={audioRef} 
        onEnded={handleAudioEnded}
        className="hidden"
      />

      {/* ========================================== */}
      {/* FLOATING BUTTON (When Closed) — GOLDEN REFERENCE: DO NOT MODIFY */}
      {/* ========================================== */}
      <div 
        className={`fixed bottom-6 right-6 z-50 flex flex-col items-center transition-all duration-500 ${
          isOpen ? "opacity-0 pointer-events-none scale-75" : "opacity-100 scale-100"
        }`}
      >
        {/* Main Button */}
        <button
          onClick={() => setIsOpen(true)}
          className="relative group"
          aria-label="Open SLE AI Companion"
        >
          {/* Outer Glow Ring */}
          <div 
            className="absolute -inset-2 rounded-full opacity-60 blur-md"
            style={{
              background: 'linear-gradient(135deg, #06B6D4 0%, #8B5CF6 50%, #06B6D4 100%)',
              animation: 'rotateGlow 3s linear infinite'
            }}
          />
          
          {/* Breathing Ring */}
          <div 
            className="absolute -inset-1 rounded-full"
            style={{
              background: 'linear-gradient(135deg, #06B6D4, #8B5CF6)',
              animation: 'breathe 2s ease-in-out infinite'
            }}
          />
          
          {/* Coach Image Container */}
          <div 
            className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-white/30 shadow-2xl"
            style={{
              background: 'linear-gradient(135deg, #1a1a2e, #16213e)'
            }}
          >
            {/* Coach Images with Crossfade */}
            {coaches.map((coach, index) => (
              <img
                loading="lazy" key={coach.id}
                src={coach.image}
                alt={coach.name}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                  index === currentCoachIndex ? "opacity-100" : "opacity-0"
                }`}
              />
            ))}
            
            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-purple-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          
          {/* Online Indicator */}
          <div className="absolute -bottom-1 -right-1">
            <span 
              className="absolute inline-flex h-4 w-4 rounded-full opacity-75"
              style={{
                backgroundColor: '#10B981',
                animation: 'ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite'
              }}
            />
            <span 
              className="relative inline-flex rounded-full h-4 w-4"
              style={{
                backgroundColor: '#10B981',
                border: '3px solid #1e1b4b',
                boxShadow: '0 0 10px rgba(16, 185, 129, 0.6)'
              }}
            />
          </div>
        </button>
        
        {/* Label */}
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
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes coachGlow {
          0%, 100% { box-shadow: 0 0 20px rgba(139, 92, 246, 0.3), 0 0 40px rgba(6, 182, 212, 0.15); }
          50% { box-shadow: 0 0 30px rgba(139, 92, 246, 0.5), 0 0 60px rgba(6, 182, 212, 0.25); }
        }
      `}</style>

      {/* ========================================== */}
      {/* EXPANDED MODAL — IMMERSIVE FULL-SCREEN */}
      {/* ========================================== */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/70 backdrop-blur-md"
            onClick={handleClose}
          />
          
          {/* Modal Container — Larger, more immersive */}
          <div 
            className="relative w-full max-w-lg h-[90vh] max-h-[800px] rounded-3xl overflow-hidden flex flex-col"
            style={{
              background: 'linear-gradient(160deg, #0d0d1a 0%, #1a1a2e 30%, #16213e 60%, #0f3460 100%)',
              boxShadow: '0 0 60px rgba(139, 92, 246, 0.25), 0 0 120px rgba(6, 182, 212, 0.15), inset 0 1px 0 rgba(255,255,255,0.1)',
              animation: 'fadeInUp 0.4s ease-out',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            {/* ===== HEADER ===== */}
            <div 
              className="flex items-center justify-between px-5 py-3 border-b border-white/10"
              style={{
                background: 'rgba(255,255,255,0.03)',
                backdropFilter: 'blur(20px)',
              }}
            >
              <div className="flex items-center gap-3">
                {currentScreen === "chat" && (
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
                  <h2 className="text-base font-bold text-white leading-tight">
                    {currentScreen === "coaches" && "SLE Oral Mock Exam"}
                    {currentScreen === "chat" && selectedCoach?.name}
                  </h2>
                  {currentScreen === "chat" && selectedCoach && (
                    <p className="text-xs text-cyan-400/80 font-medium">{selectedCoach.specialty}</p>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-1.5">
                {/* Voice Toggle */}
                <button
                  onClick={toggleVoice}
                  className={`p-2 rounded-full transition-all ${
                    voiceEnabled ? "bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30" : "bg-gray-500/20 text-gray-400 hover:bg-gray-500/30"
                  }`}
                  title={voiceEnabled ? "Désactiver la voix" : "Activer la voix"}
                >
                  {voiceEnabled ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                    </svg>
                  )}
                </button>
                
                {/* Close */}
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

            {/* ===== CONTENT AREA ===== */}
            <div className="flex-1 overflow-y-auto flex flex-col">

              {/* ===== SCREEN 1: COACH SELECTION ===== */}
              {currentScreen === "coaches" && (
                <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-8">
                  {/* Title */}
                  <div className="text-center space-y-2">
                    <h3 
                      className="text-xl font-bold"
                      style={{
                        background: 'linear-gradient(135deg, #ffffff 0%, #06B6D4 50%, #8B5CF6 100%)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                      }}
                    >
                      Choose Your Coach
                    </h3>
                    <p className="text-gray-400 text-sm max-w-xs mx-auto">
                      Select a coach to begin your full oral exam simulation immediately.
                    </p>
                  </div>

                  {/* Coach Cards — Premium Glassmorphism */}
                  <div className="w-full max-w-sm space-y-4">
                    {coaches.map((coach) => (
                      <button
                        key={coach.id}
                        onClick={() => handleCoachSelect(coach)}
                        disabled={isStartingSession}
                        className="w-full group flex items-center gap-4 p-5 rounded-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-wait active:scale-[0.97]"
                        style={{
                          background: 'rgba(255,255,255,0.05)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          backdropFilter: 'blur(20px)',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                          e.currentTarget.style.borderColor = 'rgba(6,182,212,0.4)';
                          e.currentTarget.style.boxShadow = '0 8px 32px rgba(139,92,246,0.2), 0 0 0 1px rgba(6,182,212,0.2)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      >
                        {/* Coach Photo — Large, prominent */}
                        <div 
                          className="relative w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0"
                          style={{
                            border: '2px solid rgba(139,92,246,0.3)',
                            boxShadow: '0 4px 16px rgba(139,92,246,0.2)',
                          }}
                        >
                          <img
                            loading="lazy"
                            src={coach.image}
                            alt={coach.name}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-purple-900/30 to-transparent" />
                        </div>
                        
                        {/* Coach Info */}
                        <div className="flex-1 text-left">
                          <h3 className="text-white font-bold text-lg leading-tight">{coach.name}</h3>
                          <div className="flex items-center gap-1.5 mt-1">
                            <span className="text-base">{coach.specialtyIcon}</span>
                            <span className="text-cyan-300 text-sm font-medium">{coach.specialty}</span>
                          </div>
                        </div>
                        
                        {/* Start CTA */}
                        <div 
                          className="flex-shrink-0 px-4 py-2 rounded-xl text-sm font-bold transition-all"
                          style={{
                            background: 'linear-gradient(135deg, rgba(6,182,212,0.2), rgba(139,92,246,0.2))',
                            border: '1px solid rgba(6,182,212,0.3)',
                            color: '#06B6D4',
                          }}
                        >
                          Start
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Loading indicator */}
                  {isStartingSession && (
                    <div className="flex items-center gap-3 text-cyan-400 text-sm">
                      <div className="w-5 h-5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                      <span>Initializing your exam session...</span>
                    </div>
                  )}

                  {/* Subtle info */}
                  <p className="text-gray-600 text-xs text-center max-w-xs">
                    Full mock oral exam with AI-powered evaluation and real-time voice feedback.
                  </p>
                </div>
              )}

              {/* ===== SCREEN 2: IMMERSIVE CHAT — EXAM SESSION ===== */}
              {currentScreen === "chat" && selectedCoach && (
                <div className="flex-1 flex flex-col">
                  
                  {/* Coach Presence Bar — Always visible at top with photo + waveform */}
                  <div 
                    className="flex-shrink-0 px-5 py-4"
                    style={{
                      background: 'linear-gradient(180deg, rgba(139,92,246,0.08) 0%, transparent 100%)',
                    }}
                  >
                    <div className="flex items-center gap-4">
                      {/* Coach Photo — Large, prominent, with glow */}
                      <div 
                        className="relative w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0"
                        style={{
                          border: '2px solid rgba(139,92,246,0.4)',
                          animation: isSpeaking ? 'coachGlow 1.5s ease-in-out infinite' : 'none',
                          boxShadow: isSpeaking 
                            ? '0 0 24px rgba(139,92,246,0.4), 0 0 48px rgba(6,182,212,0.2)' 
                            : '0 4px 16px rgba(0,0,0,0.3)',
                          transition: 'box-shadow 0.3s ease',
                        }}
                      >
                        <img
                          loading="lazy"
                          src={selectedCoach.image}
                          alt={selectedCoach.name}
                          className="w-full h-full object-cover"
                        />
                        {/* Speaking overlay pulse */}
                        {isSpeaking && (
                          <div 
                            className="absolute inset-0"
                            style={{
                              background: 'linear-gradient(to top, rgba(139,92,246,0.3), transparent)',
                              animation: 'breathe 1.5s ease-in-out infinite',
                            }}
                          />
                        )}
                      </div>
                      
                      {/* Coach Waveform — Always visible */}
                      <div className="flex-1 flex flex-col gap-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-white font-semibold text-sm">{selectedCoach.name}</span>
                          {isSpeaking && (
                            <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 bg-cyan-400/10 px-2 py-0.5 rounded-full">
                              Speaking
                            </span>
                          )}
                          {isGeneratingAudio && !isSpeaking && (
                            <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 bg-purple-400/10 px-2 py-0.5 rounded-full">
                              Thinking...
                            </span>
                          )}
                        </div>
                        <PremiumWaveform isActive={isSpeaking} variant="coach" />
                      </div>
                    </div>
                  </div>

                  {/* Messages Area — Scrollable */}
                  <div className="flex-1 overflow-y-auto px-5 py-3 space-y-3">
                    {messages.map((message, index) => (
                      <div
                        key={index}
                        className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[85%] p-3.5 rounded-2xl ${
                            message.role === "user"
                              ? "rounded-br-md"
                              : "rounded-bl-md"
                          }`}
                          style={message.role === "user" ? {
                            background: 'linear-gradient(135deg, rgba(6,182,212,0.2), rgba(16,185,129,0.15))',
                            border: '1px solid rgba(6,182,212,0.25)',
                          } : {
                            background: 'rgba(255,255,255,0.06)',
                            border: '1px solid rgba(255,255,255,0.08)',
                            backdropFilter: 'blur(10px)',
                          }}
                        >
                          <p className="text-sm text-gray-100 leading-relaxed">{message.content}</p>
                          {message.score !== undefined && (
                            <div 
                              className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full"
                              style={{
                                background: 'linear-gradient(135deg, rgba(139,92,246,0.2), rgba(6,182,212,0.2))',
                                border: '1px solid rgba(139,92,246,0.3)',
                                color: '#a78bfa',
                              }}
                            >
                              Score: {message.score}/100
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                    
                    {/* Processing indicator */}
                    {isProcessingMessage && (
                      <div className="flex justify-start">
                        <div 
                          className="p-3.5 rounded-2xl rounded-bl-md"
                          style={{
                            background: 'rgba(255,255,255,0.06)',
                            border: '1px solid rgba(255,255,255,0.08)',
                          }}
                        >
                          <div className="flex items-center gap-2">
                            <div className="flex gap-1.5">
                              <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                              <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                              <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Starting session indicator */}
                    {isStartingSession && messages.length === 0 && (
                      <div className="flex flex-col items-center justify-center py-12 space-y-4">
                        <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                        <p className="text-gray-400 text-sm">Preparing your exam session...</p>
                      </div>
                    )}
                    
                    <div ref={messagesEndRef} />
                  </div>
                </div>
              )}
            </div>

            {/* ===== INPUT AREA — Premium glassmorphism (chat screen only) ===== */}
            {currentScreen === "chat" && (
              <div 
                className="flex-shrink-0 px-5 py-4 border-t border-white/10"
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  backdropFilter: 'blur(20px)',
                }}
              >
                {/* User Waveform — visible when recording */}
                {isRecording && (
                  <div className="mb-3 flex items-center gap-3">
                    <RecordingIndicator duration={duration} />
                    <div className="flex-1">
                      <PremiumWaveform isActive={isRecording} variant="user" />
                    </div>
                  </div>
                )}
                
                <div className="flex items-center gap-2">
                  {/* Text Input — Glassmorphism */}
                  <input
                    type="text"
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendTextMessage()}
                    placeholder={selectedCoach?.id === "steven" ? "Tapez votre réponse..." : "Type your response..."}
                    disabled={isRecording || isProcessingMessage}
                    className="flex-1 px-4 py-2.5 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none disabled:opacity-50 transition-all"
                    style={{
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(255,255,255,0.1)',
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(6,182,212,0.4)';
                      e.currentTarget.style.boxShadow = '0 0 16px rgba(6,182,212,0.1)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  />
                  
                  {/* Microphone Button — Premium */}
                  <button
                    onClick={toggleMicrophone}
                    disabled={isProcessingMessage || isProcessing}
                    className="relative p-3 rounded-xl transition-all duration-300 flex-shrink-0"
                    style={isRecording ? {
                      background: 'linear-gradient(135deg, #EF4444, #DC2626)',
                      boxShadow: '0 0 20px rgba(239,68,68,0.4)',
                      transform: 'scale(1.05)',
                    } : isProcessing ? {
                      background: 'rgba(107,114,128,0.3)',
                      cursor: 'not-allowed',
                    } : {
                      background: 'linear-gradient(135deg, rgba(6,182,212,0.3), rgba(16,185,129,0.3))',
                      border: '1px solid rgba(6,182,212,0.3)',
                    }}
                  >
                    {/* Pulse Animation */}
                    {isRecording && (
                      <span className="absolute inset-0 rounded-xl bg-red-500 animate-ping opacity-30" />
                    )}
                    
                    {/* Mic Icon */}
                    <svg className="w-5 h-5 text-white relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                  </button>
                  
                  {/* Send Button — Premium */}
                  <button
                    onClick={handleSendTextMessage}
                    disabled={!textInput.trim() || isProcessingMessage || isRecording}
                    className="p-3 rounded-xl transition-all flex-shrink-0 disabled:opacity-30 disabled:cursor-not-allowed"
                    style={{
                      background: textInput.trim() && !isProcessingMessage && !isRecording
                        ? 'linear-gradient(135deg, rgba(139,92,246,0.4), rgba(236,72,153,0.3))'
                        : 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(139,92,246,0.2)',
                    }}
                  >
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </button>
                </div>
              </div>
            )}
            
            {/* Footer Gradient */}
            <div 
              className="h-1 flex-shrink-0"
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
