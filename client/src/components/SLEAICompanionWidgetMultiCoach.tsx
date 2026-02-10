import { useState, useEffect, useRef, useCallback } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { useVADRecorder } from "@/hooks/useVADRecorder";

// ─── Types ───────────────────────────────────────────────────────────
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

// ─── Coach Data ──────────────────────────────────────────────────────
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

// ─── Immersive Waveform Ring ─────────────────────────────────────────
// Concentric rings that pulse organically around the coach photo
const WaveformRings = ({ level, isCoachSpeaking, isUserSpeaking, isListening }: {
  level: number;
  isCoachSpeaking: boolean;
  isUserSpeaking: boolean;
  isListening: boolean;
}) => {
  const isActive = isCoachSpeaking || isUserSpeaking || isListening;
  const color = isCoachSpeaking ? "139,92,246" : isUserSpeaking ? "6,182,212" : "16,185,129";
  const intensity = isCoachSpeaking ? 0.7 : isUserSpeaking ? Math.max(level * 3, 0.3) : 0.15;

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      {/* Ring 1 — closest */}
      <div
        className="absolute rounded-full"
        style={{
          width: `${260 + intensity * 30}px`,
          height: `${260 + intensity * 30}px`,
          border: `2px solid rgba(${color}, ${isActive ? 0.35 : 0.08})`,
          background: `radial-gradient(circle, rgba(${color}, ${isActive ? 0.08 : 0.02}) 0%, transparent 70%)`,
          transform: `scale(${1 + intensity * 0.08})`,
          transition: isCoachSpeaking || isUserSpeaking ? 'transform 0.1s ease-out, border-color 0.3s' : 'all 0.6s ease-out',
        }}
      />
      {/* Ring 2 — middle */}
      <div
        className="absolute rounded-full"
        style={{
          width: `${310 + intensity * 50}px`,
          height: `${310 + intensity * 50}px`,
          border: `1.5px solid rgba(${color}, ${isActive ? 0.22 : 0.05})`,
          background: `radial-gradient(circle, rgba(${color}, ${isActive ? 0.04 : 0.01}) 0%, transparent 70%)`,
          transform: `scale(${1 + intensity * 0.12})`,
          transition: isCoachSpeaking || isUserSpeaking ? 'transform 0.15s ease-out, border-color 0.3s' : 'all 0.7s ease-out',
        }}
      />
      {/* Ring 3 — outer */}
      <div
        className="absolute rounded-full"
        style={{
          width: `${360 + intensity * 70}px`,
          height: `${360 + intensity * 70}px`,
          border: `1px solid rgba(${color}, ${isActive ? 0.12 : 0.03})`,
          background: `radial-gradient(circle, rgba(${color}, ${isActive ? 0.02 : 0}) 0%, transparent 70%)`,
          transform: `scale(${1 + intensity * 0.16})`,
          transition: isCoachSpeaking || isUserSpeaking ? 'transform 0.2s ease-out, border-color 0.3s' : 'all 0.8s ease-out',
        }}
      />
      {/* Ring 4 — outermost glow */}
      {(isCoachSpeaking || isUserSpeaking) && (
        <div
          className="absolute rounded-full"
          style={{
            width: `${410 + intensity * 90}px`,
            height: `${410 + intensity * 90}px`,
            border: `1px solid rgba(${color}, 0.06)`,
            transform: `scale(${1 + intensity * 0.2})`,
            transition: 'transform 0.25s ease-out',
          }}
        />
      )}
    </div>
  );
};

// ─── Audio Level Bars ────────────────────────────────────────────────
// Small horizontal bar visualizer below the status text
const AudioBars = ({ level, isActive, color }: { level: number; isActive: boolean; color: string }) => {
  return (
    <div className="flex items-center justify-center gap-[3px] h-5 mt-2">
      {Array.from({ length: 12 }).map((_, i) => {
        const barLevel = isActive
          ? Math.max(2, level * 20 * (0.5 + Math.sin(Date.now() / 80 + i * 0.8) * 0.5))
          : 2;
        return (
          <div
            key={i}
            className="rounded-full transition-all"
            style={{
              width: '3px',
              height: `${barLevel}px`,
              background: isActive
                ? `linear-gradient(to top, ${color}, ${color}88)`
                : 'rgba(255,255,255,0.1)',
              transition: isActive ? 'height 0.05s ease-out' : 'all 0.5s ease-out',
            }}
          />
        );
      })}
    </div>
  );
};

// ─── Main Component ──────────────────────────────────────────────────
export default function SLEAICompanionWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentScreen, setCurrentScreen] = useState<"coaches" | "session">("coaches");
  const [selectedCoach, setSelectedCoach] = useState<Coach | null>(null);
  const [currentCoachIndex, setCurrentCoachIndex] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isProcessingMessage, setIsProcessingMessage] = useState(false);
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [isStartingSession, setIsStartingSession] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const sessionIdRef = useRef<number | null>(null);

  useEffect(() => { sessionIdRef.current = sessionId; }, [sessionId]);

  // ─── VAD Recorder ──────────────────────────────────────────────────
  const {
    state: vadState,
    isListening,
    isSpeaking: userSpeaking,
    audioLevel,
    openMic,
    closeMic,
    pauseMic,
    resumeMic,
  } = useVADRecorder({
    speechThreshold: 0.015,
    silenceTimeout: 1800,
    minSpeechDuration: 600,
    maxDuration: 120,
    onUtterance: (blob) => handleUtterance(blob),
    onError: (err) => toast.error(`Microphone: ${err.message}`),
  });

  // ─── tRPC Mutations ────────────────────────────────────────────────
  const startSessionMutation = trpc.sleCompanion.startSession.useMutation();
  const sendMessageMutation = trpc.sleCompanion.sendMessage.useMutation();
  const uploadAndTranscribeMutation = trpc.sleCompanion.uploadAndTranscribeAudio.useMutation();
  const endSessionMutation = trpc.sleCompanion.endSession.useMutation();

  const generateCoachAudioMutation = trpc.audio.generateCoachAudio.useMutation({
    onSuccess: (data) => {
      if (data.audioUrl && audioRef.current) {
        audioRef.current.volume = 1.0;
        audioRef.current.src = data.audioUrl;
        audioRef.current.play().catch(() => {
          toast.error("Audio playback failed.");
        });
        setIsSpeaking(true);
      }
      setIsGeneratingAudio(false);
    },
    onError: (error) => {
      console.error("TTS Error:", error);
      setIsGeneratingAudio(false);
      setIsSpeaking(false);
      resumeMic();
    },
  });

  // ─── Floating button coach rotation ────────────────────────────────
  useEffect(() => {
    if (!isOpen) {
      const interval = setInterval(() => {
        setCurrentCoachIndex((prev) => (prev + 1) % coaches.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [isOpen]);

  // ─── Custom open event ─────────────────────────────────────────────
  useEffect(() => {
    const handleOpenEvent = () => setIsOpen(true);
    window.addEventListener("openSLEAICompanion", handleOpenEvent);
    return () => window.removeEventListener("openSLEAICompanion", handleOpenEvent);
  }, []);

  // ─── Pause mic when coach is speaking ──────────────────────────────
  useEffect(() => {
    if (isSpeaking || isGeneratingAudio) {
      pauseMic();
    }
  }, [isSpeaking, isGeneratingAudio, pauseMic]);

  // ─── Audio ended → resume mic ─────────────────────────────────────
  const handleAudioEnded = useCallback(() => {
    setIsSpeaking(false);
    if (!isProcessingMessage) {
      resumeMic();
    }
  }, [isProcessingMessage, resumeMic]);

  // ─── Coach Selection ───────────────────────────────────────────────
  const handleCoachSelect = useCallback(async (coach: Coach) => {
    setSelectedCoach(coach);
    setCurrentScreen("session");
    setMessages([]);
    setIsStartingSession(true);

    try {
      const session = await startSessionMutation.mutateAsync({
        coachKey: coach.coachKey,
        level: "B" as const,
        skill: "oral_expression" as const,
        topic: "Full Mock Exam (OLA)",
      });

      setSessionId(session.sessionId);

      const welcomeText = session.welcomeMessage || coach.greeting;
      setMessages([{ role: "assistant", content: welcomeText }]);

      // Play greeting immediately with max volume
      setIsGeneratingAudio(true);
      setIsSpeaking(true);
      generateCoachAudioMutation.mutate({
        text: welcomeText,
        coachName: coach.voiceKey,
        speed: 1.0,
      });

      // Open mic — auto-resumes after greeting ends
      await openMic();
    } catch (error) {
      console.error("Failed to start session:", error);
      toast.error("Session initialization failed");
      setMessages([{ role: "assistant", content: coach.greeting }]);
    } finally {
      setIsStartingSession(false);
    }
  }, [startSessionMutation, generateCoachAudioMutation, openMic]);

  // ─── Handle User Utterance (auto-detected by VAD) ─────────────────
  const handleUtterance = useCallback(async (blob: Blob) => {
    const currentSessionId = sessionIdRef.current;
    if (!currentSessionId) { resumeMic(); return; }

    setIsProcessingMessage(true);

    try {
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve, reject) => {
        reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
        reader.onerror = reject;
      });
      reader.readAsDataURL(blob);
      const audioBase64 = await base64Promise;

      const transcriptionResult = await uploadAndTranscribeMutation.mutateAsync({
        audioBase64,
        mimeType: blob.type || "audio/webm",
        sessionId: currentSessionId,
        language: "fr",
      });

      const transcribedText = transcriptionResult.transcription || "";

      if (!transcribedText.trim()) {
        setIsProcessingMessage(false);
        resumeMic();
        return;
      }

      setMessages(prev => [...prev, { role: "user", content: transcribedText }]);

      const coachResponse = await sendMessageMutation.mutateAsync({
        sessionId: currentSessionId,
        message: transcribedText,
      });

      const responseText = coachResponse.coachResponse || "";
      setMessages(prev => [...prev, {
        role: "assistant",
        content: responseText,
        score: coachResponse.evaluation?.score,
      }]);
      setIsProcessingMessage(false);

      if (responseText) {
        setIsGeneratingAudio(true);
        generateCoachAudioMutation.mutate({
          text: responseText,
          coachName: selectedCoach?.voiceKey || "steven",
          speed: 1.0,
        });
      } else {
        resumeMic();
      }
    } catch (error) {
      console.error("Error processing utterance:", error);
      toast.error("Processing error");
      setIsProcessingMessage(false);
      resumeMic();
    }
  }, [selectedCoach, uploadAndTranscribeMutation, sendMessageMutation, generateCoachAudioMutation, resumeMic]);

  // ─── Back / Close ──────────────────────────────────────────────────
  const handleBack = useCallback(() => {
    if (audioRef.current) { audioRef.current.pause(); audioRef.current.currentTime = 0; }
    closeMic();
    setIsSpeaking(false);
    setIsGeneratingAudio(false);
    if (sessionId) { endSessionMutation.mutate({ sessionId }); setSessionId(null); }
    setCurrentScreen("coaches");
    setSelectedCoach(null);
    setMessages([]);
  }, [sessionId, endSessionMutation, closeMic]);

  const handleClose = useCallback(() => {
    if (audioRef.current) { audioRef.current.pause(); audioRef.current.currentTime = 0; }
    closeMic();
    if (sessionId) { endSessionMutation.mutate({ sessionId }); }
    setIsOpen(false);
    setCurrentScreen("coaches");
    setSelectedCoach(null);
    setSessionId(null);
    setIsSpeaking(false);
    setIsGeneratingAudio(false);
    setIsProcessingMessage(false);
    setMessages([]);
  }, [sessionId, endSessionMutation, closeMic]);

  // ─── Session visual state ─────────────────────────────────────────
  const getSessionState = () => {
    if (isStartingSession) return "starting";
    if (isSpeaking) return "coach-speaking";
    if (isGeneratingAudio || isProcessingMessage) return "thinking";
    if (userSpeaking) return "user-speaking";
    if (isListening) return "listening";
    return "idle";
  };
  const sessionState = getSessionState();

  // ─── Status label ──────────────────────────────────────────────────
  const getStatusLabel = () => {
    if (!selectedCoach) return "";
    const fr = selectedCoach.id === "steven";
    switch (sessionState) {
      case "starting": return fr ? "Préparation de la session..." : "Preparing session...";
      case "coach-speaking": return fr ? "En train de parler..." : "Speaking...";
      case "thinking": return fr ? "Réflexion en cours..." : "Thinking...";
      case "user-speaking": return fr ? "Je vous écoute..." : "Listening to you...";
      case "listening": return fr ? "Allez-y, parlez..." : "Go ahead, speak...";
      default: return fr ? "En attente..." : "Standing by...";
    }
  };

  const getStatusColor = () => {
    switch (sessionState) {
      case "coach-speaking": return "#A78BFA";
      case "thinking": return "#06B6D4";
      case "user-speaking": return "#06B6D4";
      case "listening": return "#10B981";
      default: return "#6B7280";
    }
  };

  return (
    <>
      {/* Hidden audio element — max volume */}
      <audio ref={audioRef} onEnded={handleAudioEnded} className="hidden" />

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* FLOATING BUTTON — GOLDEN REFERENCE: DO NOT MODIFY              */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <div
        className={`fixed bottom-6 right-6 z-50 flex flex-col items-center transition-all duration-500 ${
          isOpen ? "opacity-0 pointer-events-none scale-75" : "opacity-100 scale-100"
        }`}
      >
        <button onClick={() => setIsOpen(true)} className="relative group" aria-label="Open SLE AI Companion">
          <div className="absolute -inset-2 rounded-full opacity-60 blur-md" style={{ background: 'linear-gradient(135deg, #06B6D4 0%, #8B5CF6 50%, #06B6D4 100%)', animation: 'rotateGlow 3s linear infinite' }} />
          <div className="absolute -inset-1 rounded-full" style={{ background: 'linear-gradient(135deg, #06B6D4, #8B5CF6)', animation: 'breathe 2s ease-in-out infinite' }} />
          <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-white/30 shadow-2xl" style={{ background: 'linear-gradient(135deg, #1a1a2e, #16213e)' }}>
            {coaches.map((coach, index) => (
              <img loading="lazy" key={coach.id} src={coach.image} alt={coach.name}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${index === currentCoachIndex ? "opacity-100" : "opacity-0"}`} />
            ))}
            <div className="absolute inset-0 bg-gradient-to-t from-purple-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div className="absolute -bottom-1 -right-1">
            <span className="absolute inline-flex h-4 w-4 rounded-full opacity-75" style={{ backgroundColor: '#10B981', animation: 'ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite' }} />
            <span className="relative inline-flex rounded-full h-4 w-4" style={{ backgroundColor: '#10B981', border: '3px solid #1e1b4b', boxShadow: '0 0 10px rgba(16, 185, 129, 0.6)' }} />
          </div>
        </button>
        <span className="mt-2 text-sm font-semibold tracking-wide" style={{ background: 'linear-gradient(90deg, #06B6D4, #8B5CF6, #06B6D4)', backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', textShadow: '0 0 20px rgba(139, 92, 246, 0.5)' }}>
          SLE AI Companion
        </span>
      </div>

      {/* ─── Keyframes ─────────────────────────────────────────────── */}
      <style>{`
        @keyframes breathe { 0%, 100% { transform: scale(1); opacity: 0.7; } 50% { transform: scale(1.1); opacity: 1; } }
        @keyframes rotateGlow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes ping { 75%, 100% { transform: scale(2); opacity: 0; } }
        @keyframes fadeInScale { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
        @keyframes pulseGlow { 0%, 100% { box-shadow: 0 0 40px rgba(139,92,246,0.3); } 50% { box-shadow: 0 0 80px rgba(139,92,246,0.6), 0 0 120px rgba(6,182,212,0.2); } }
        @keyframes subtlePulse { 0%, 100% { opacity: 0.7; } 50% { opacity: 1; } }
        @keyframes spinSlow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* EXPANDED MODAL                                                  */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Full-screen dark backdrop */}
          <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={handleClose} />

          {/* Modal — tall, immersive */}
          <div
            className="relative w-full max-w-lg h-[92vh] max-h-[800px] rounded-3xl overflow-hidden flex flex-col"
            style={{
              background: 'linear-gradient(160deg, #080810 0%, #0d0d1a 25%, #121228 50%, #0a1628 100%)',
              boxShadow: '0 0 80px rgba(139,92,246,0.2), 0 0 160px rgba(6,182,212,0.1), inset 0 1px 0 rgba(255,255,255,0.06)',
              animation: 'fadeInScale 0.35s ease-out',
              border: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            {/* ═══ HEADER BAR ═══ */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-white/8 flex-shrink-0"
              style={{ background: 'rgba(255,255,255,0.02)' }}>
              <div className="flex items-center gap-3">
                {currentScreen === "session" && (
                  <button onClick={handleBack} className="p-2 rounded-full hover:bg-white/10 transition-colors">
                    <svg className="w-5 h-5 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                )}
                <div>
                  <h2 className="text-sm font-bold text-white/90 tracking-wide">
                    {currentScreen === "coaches" ? "SLE Oral Mock Exam" : selectedCoach?.name}
                  </h2>
                  {currentScreen === "session" && selectedCoach && (
                    <p className="text-[11px] text-cyan-400/70 font-medium">{selectedCoach.specialtyIcon} {selectedCoach.specialty}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1">
                {currentScreen === "session" && (
                  <button
                    onClick={() => setShowTranscript(!showTranscript)}
                    className={`p-2 rounded-full transition-all text-xs ${showTranscript ? "bg-cyan-500/15 text-cyan-400" : "text-gray-500 hover:bg-white/5"}`}
                    title="Toggle transcript"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </button>
                )}
                <button onClick={handleClose} className="p-2 rounded-full hover:bg-white/10 transition-colors">
                  <svg className="w-5 h-5 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* ═══ CONTENT ═══ */}
            <div className="flex-1 overflow-hidden flex flex-col">

              {/* ═══ COACH SELECTION SCREEN ═══ */}
              {currentScreen === "coaches" && (
                <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-10">
                  <div className="text-center space-y-3">
                    <h3 className="text-2xl font-bold" style={{ background: 'linear-gradient(135deg, #ffffff 0%, #06B6D4 50%, #8B5CF6 100%)', backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                      Choose Your Coach
                    </h3>
                    <p className="text-gray-500 text-sm max-w-xs mx-auto leading-relaxed">
                      Tap a coach to begin your fully voice-based oral exam simulation.
                    </p>
                  </div>

                  <div className="w-full max-w-sm space-y-4">
                    {coaches.map((coach) => (
                      <button
                        key={coach.id}
                        onClick={() => handleCoachSelect(coach)}
                        disabled={isStartingSession}
                        className="w-full group flex items-center gap-4 p-5 rounded-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-wait active:scale-[0.97]"
                        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(20px)' }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.borderColor = 'rgba(6,182,212,0.3)'; e.currentTarget.style.boxShadow = '0 8px 40px rgba(139,92,246,0.15)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.boxShadow = 'none'; }}
                      >
                        <div className="relative w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0" style={{ border: '2px solid rgba(139,92,246,0.25)', boxShadow: '0 4px 16px rgba(139,92,246,0.15)' }}>
                          <img loading="lazy" src={coach.image} alt={coach.name} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-gradient-to-t from-purple-900/30 to-transparent" />
                        </div>
                        <div className="flex-1 text-left">
                          <h3 className="text-white font-bold text-lg leading-tight">{coach.name}</h3>
                          <div className="flex items-center gap-1.5 mt-1">
                            <span className="text-base">{coach.specialtyIcon}</span>
                            <span className="text-cyan-300/80 text-sm font-medium">{coach.specialty}</span>
                          </div>
                        </div>
                        <div className="flex-shrink-0 px-4 py-2 rounded-xl text-sm font-bold" style={{ background: 'linear-gradient(135deg, rgba(6,182,212,0.15), rgba(139,92,246,0.15))', border: '1px solid rgba(6,182,212,0.25)', color: '#06B6D4' }}>
                          Start
                        </div>
                      </button>
                    ))}
                  </div>

                  {isStartingSession && (
                    <div className="flex items-center gap-3 text-cyan-400 text-sm">
                      <div className="w-5 h-5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                      <span>Initializing...</span>
                    </div>
                  )}
                </div>
              )}

              {/* ═══ SESSION SCREEN — IMMERSIVE SPEECH-TO-SPEECH ═══ */}
              {currentScreen === "session" && selectedCoach && (
                <div className="flex-1 flex flex-col items-center justify-center relative overflow-hidden">

                  {/* ── Waveform Rings (behind photo) ── */}
                  <WaveformRings
                    level={audioLevel}
                    isCoachSpeaking={isSpeaking}
                    isUserSpeaking={userSpeaking}
                    isListening={isListening}
                  />

                  {/* ── Coach Photo — LARGE, centered, immersive ── */}
                  <div className="relative z-10 flex flex-col items-center">
                    <div
                      className="relative overflow-hidden flex-shrink-0"
                      style={{
                        width: '180px',
                        height: '180px',
                        borderRadius: '50%',
                        border: isSpeaking
                          ? '4px solid rgba(139,92,246,0.7)'
                          : userSpeaking
                          ? '4px solid rgba(6,182,212,0.7)'
                          : isListening
                          ? '4px solid rgba(16,185,129,0.4)'
                          : '4px solid rgba(255,255,255,0.1)',
                        animation: isSpeaking ? 'pulseGlow 1.5s ease-in-out infinite' : 'none',
                        boxShadow: isSpeaking
                          ? '0 0 60px rgba(139,92,246,0.4), 0 0 120px rgba(139,92,246,0.15)'
                          : userSpeaking
                          ? '0 0 60px rgba(6,182,212,0.4), 0 0 120px rgba(6,182,212,0.15)'
                          : '0 8px 40px rgba(0,0,0,0.5)',
                        transition: 'border-color 0.4s, box-shadow 0.4s',
                      }}
                    >
                      <img
                        loading="lazy"
                        src={selectedCoach.image}
                        alt={selectedCoach.name}
                        className="w-full h-full object-cover"
                        style={{ transform: 'scale(1.05)' }}
                      />
                      {/* Subtle overlay gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    </div>

                    {/* ── Coach Name ── */}
                    <h3 className="mt-6 text-xl font-bold text-white tracking-wide">{selectedCoach.name}</h3>

                    {/* ── Status Label ── */}
                    <p
                      className="mt-2 text-sm font-medium tracking-wide flex items-center gap-2"
                      style={{
                        color: getStatusColor(),
                        animation: (sessionState === "coach-speaking" || sessionState === "user-speaking")
                          ? 'subtlePulse 1.5s ease-in-out infinite' : 'none',
                      }}
                    >
                      {(sessionState === "starting" || sessionState === "thinking") && (
                        <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      )}
                      {getStatusLabel()}
                    </p>

                    {/* ── Audio Level Bars ── */}
                    <AudioBars
                      level={audioLevel}
                      isActive={isSpeaking || userSpeaking}
                      color={isSpeaking ? '#A78BFA' : '#06B6D4'}
                    />
                  </div>

                  {/* ── Transcript overlay (toggled) ── */}
                  {showTranscript && messages.length > 0 && (
                    <div
                      className="absolute bottom-4 left-4 right-4 z-20 rounded-2xl p-4 max-h-[35%] overflow-y-auto"
                      style={{
                        background: 'rgba(0,0,0,0.6)',
                        border: '1px solid rgba(255,255,255,0.06)',
                        backdropFilter: 'blur(20px)',
                      }}
                    >
                      {messages.slice(-6).map((msg, i) => (
                        <div key={i} className={`mb-2 last:mb-0 text-xs leading-relaxed ${msg.role === "user" ? "text-cyan-300/80" : "text-gray-200/80"}`}>
                          <span className="font-bold text-[10px] uppercase tracking-widest mr-1.5" style={{ color: msg.role === "user" ? '#06B6D4' : '#A78BFA' }}>
                            {msg.role === "user" ? "You" : selectedCoach.name}:
                          </span>
                          {msg.content}
                          {msg.score !== undefined && (
                            <span className="ml-2 text-purple-400 font-bold">({msg.score}/100)</span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* ── Mic status pill at bottom ── */}
                  <div className="absolute bottom-5 z-10">
                    <div
                      className="flex items-center gap-2.5 px-4 py-2 rounded-full"
                      style={{
                        background: 'rgba(255,255,255,0.04)',
                        border: `1px solid rgba(${userSpeaking ? '6,182,212' : isListening ? '16,185,129' : '255,255,255'}, ${userSpeaking || isListening ? 0.25 : 0.06})`,
                        backdropFilter: 'blur(10px)',
                      }}
                    >
                      <div className="relative">
                        {userSpeaking && <span className="absolute inset-0 rounded-full bg-cyan-400 animate-ping opacity-25" />}
                        <svg className="w-4 h-4 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                          style={{ color: vadState === "closed" ? '#EF4444' : userSpeaking ? '#06B6D4' : isListening ? '#10B981' : '#4B5563' }}>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                        </svg>
                      </div>
                      {/* Mini level bars */}
                      <div className="flex items-end gap-[2px] h-3">
                        {Array.from({ length: 6 }).map((_, i) => (
                          <div key={i} className="w-[2px] rounded-full" style={{
                            height: userSpeaking ? `${Math.max(2, audioLevel * 12 * (1 + Math.sin(Date.now() / 90 + i) * 0.5))}px` : '2px',
                            background: userSpeaking ? '#06B6D4' : isListening ? '#10B981' : 'rgba(255,255,255,0.1)',
                            transition: userSpeaking ? 'none' : 'all 0.4s',
                          }} />
                        ))}
                      </div>
                      <span className="text-[11px] font-medium" style={{ color: userSpeaking ? '#06B6D4' : isListening ? '#10B981' : '#4B5563' }}>
                        {vadState === "closed" ? "Mic off" : userSpeaking ? "Speaking" : isListening ? "Listening" : "Standby"}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer gradient line */}
            <div className="h-1 flex-shrink-0" style={{ background: 'linear-gradient(90deg, #06B6D4 0%, #8B5CF6 50%, #06B6D4 100%)' }} />
          </div>
        </div>
      )}
    </>
  );
}
