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
    greeting: "Bonjour ! Je suis Steven, votre coach de français. Prêt à pratiquer pour votre examen oral ? Allons-y !",
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
    greeting: "Hello! I'm Preciosa, your English coach. Ready to practice for your oral exam? Let's get started!",
    voiceKey: "preciosa",
    coachKey: "PRECIOSA",
  }
];

// Animated Waveform Component
const AnimatedWaveform = ({ isActive }: { isActive: boolean }) => {
  const bars = 12;
  return (
    <div className="flex items-center justify-center gap-1 h-12">
      {Array.from({ length: bars }).map((_, i) => (
        <div
          key={i}
          className="w-1 rounded-full transition-all duration-150"
          style={{
            height: isActive ? `${Math.random() * 30 + 10}px` : "4px",
            background: isActive 
              ? `linear-gradient(to top, #06B6D4, #8B5CF6)` 
              : "#4B5563",
            animation: isActive ? `wave${i} 0.5s ease-in-out infinite` : "none",
            animationDelay: `${i * 0.05}s`
          }}
        />
      ))}
      <style>{`
        ${Array.from({ length: bars }).map((_, i) => `
          @keyframes wave${i} {
            0%, 100% { height: ${Math.random() * 20 + 10}px; }
            50% { height: ${Math.random() * 40 + 20}px; }
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
            className="relative w-full max-w-md h-[600px] rounded-2xl overflow-hidden flex flex-col"
            style={{
              background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
              boxShadow: '0 0 40px rgba(139, 92, 246, 0.3), 0 0 80px rgba(6, 182, 212, 0.2)'
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10">
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
                <h2 className="text-lg font-bold text-white">
                  {currentScreen === "coaches" && "SLE Oral Mock Exam"}
                  {currentScreen === "chat" && selectedCoach?.name}
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
            <div className="flex-1 overflow-y-auto p-4">
              {/* Screen 1: Coach Selection — Simple, direct */}
              {currentScreen === "coaches" && (
                <div className="flex flex-col items-center justify-center h-full space-y-6">
                  {/* Title */}
                  <div className="text-center space-y-2">
                    <p className="text-gray-300 text-sm">
                      Choose your coach and start your oral exam practice immediately.
                    </p>
                  </div>

                  {/* Coach Cards */}
                  <div className="w-full space-y-3">
                    {coaches.map((coach) => (
                      <button
                        key={coach.id}
                        onClick={() => handleCoachSelect(coach)}
                        disabled={isStartingSession}
                        className="w-full group flex items-center gap-4 p-4 rounded-xl bg-white/[0.06] border border-white/[0.12] hover:border-cyan-400/50 hover:bg-white/[0.12] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:cursor-wait"
                      >
                        {/* Coach Image */}
                        <div className="relative w-14 h-14 rounded-full overflow-hidden flex-shrink-0 border-2 border-cyan-400/30">
                          <img
                            loading="lazy"
                            src={coach.image}
                            alt={coach.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        
                        {/* Coach Info */}
                        <div className="flex-1 text-left">
                          <h3 className="text-white font-bold text-base">{coach.name}</h3>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span>{coach.specialtyIcon}</span>
                            <span className="text-cyan-300 text-sm font-medium">{coach.specialty}</span>
                          </div>
                        </div>
                        
                        {/* Start Arrow */}
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider group-hover:text-cyan-300">
                            Start
                          </span>
                          <svg className="w-5 h-5 text-cyan-400 group-hover:text-cyan-300 group-hover:translate-x-0.5 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Loading indicator when starting session */}
                  {isStartingSession && (
                    <div className="flex items-center gap-2 text-cyan-400 text-sm">
                      <div className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                      <span>Starting your exam session...</span>
                    </div>
                  )}

                  {/* Info */}
                  <div className="text-center px-4">
                    <p className="text-gray-500 text-xs leading-relaxed">
                      Full mock oral exam simulation with AI-powered feedback. Speak or type your responses.
                    </p>
                  </div>
                </div>
              )}

              {/* Screen 2: Chat Interface — Full Mock Oral Exam */}
              {currentScreen === "chat" && selectedCoach && (
                <div className="flex flex-col h-full">
                  {/* Messages */}
                  <div className="flex-1 space-y-3 mb-4">
                    {messages.map((message, index) => (
                      <div
                        key={index}
                        className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[80%] p-3 rounded-2xl ${
                            message.role === "user"
                              ? "bg-cyan-500/20 border border-cyan-500/30 text-white"
                              : "bg-white/10 border border-white/10 text-gray-200"
                          }`}
                        >
                          {message.role === "assistant" && (
                            <div className="flex items-center gap-2 mb-2">
                              <img
                                loading="lazy" src={selectedCoach.image}
                                alt={selectedCoach.name}
                                className="w-6 h-6 rounded-full"
                              />
                              <span className="text-xs text-cyan-400">{selectedCoach.name}</span>
                            </div>
                          )}
                          <p className="text-sm">{message.content}</p>
                          {message.score !== undefined && (
                            <div className="mt-2 text-xs text-cyan-400">
                              Score: {message.score}/100
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                    
                    {/* Processing indicator */}
                    {isProcessingMessage && (
                      <div className="flex justify-start">
                        <div className="bg-white/10 border border-white/10 p-3 rounded-2xl">
                          <div className="flex items-center gap-2">
                            <img
                              loading="lazy" src={selectedCoach.image}
                              alt={selectedCoach.name}
                              className="w-6 h-6 rounded-full"
                            />
                            <div className="flex gap-1">
                              <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                              <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                              <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div ref={messagesEndRef} />
                  </div>
                </div>
              )}
            </div>

            {/* Input Area (for chat screen) */}
            {currentScreen === "chat" && (
              <div className="p-4 border-t border-white/10">
                {/* Recording indicator */}
                {isRecording && (
                  <div className="flex items-center justify-center mb-3">
                    <RecordingIndicator duration={duration} />
                  </div>
                )}
                
                {/* Waveform when recording or speaking */}
                {(isRecording || isSpeaking) && (
                  <div className="mb-3">
                    <AnimatedWaveform isActive={isRecording || isSpeaking} />
                  </div>
                )}
                
                <div className="flex items-center gap-2">
                  {/* Text Input */}
                  <input
                    type="text"
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendTextMessage()}
                    placeholder="Tapez votre message..."
                    disabled={isRecording || isProcessingMessage}
                    className="flex-1 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400/50 disabled:opacity-50"
                  />
                  
                  {/* Microphone Button */}
                  <button
                    onClick={toggleMicrophone}
                    disabled={isProcessingMessage || isProcessing}
                    className={`relative p-3 rounded-full transition-all duration-300 ${
                      isRecording 
                        ? "bg-gradient-to-br from-red-500 to-red-600 scale-110" 
                        : isProcessing
                        ? "bg-gray-500 cursor-not-allowed"
                        : "bg-gradient-to-br from-cyan-500 to-emerald-500 hover:scale-105"
                    }`}
                  >
                    {/* Pulse Animation */}
                    {isRecording && (
                      <span className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-50" />
                    )}
                    
                    {/* Mic Icon */}
                    <svg className="w-5 h-5 text-white relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                  </button>
                  
                  {/* Send Button */}
                  <button
                    onClick={handleSendTextMessage}
                    disabled={!textInput.trim() || isProcessingMessage || isRecording}
                    className="p-3 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
              className="h-1"
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
