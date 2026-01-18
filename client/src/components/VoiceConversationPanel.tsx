/**
 * VoiceConversationPanel Component
 * Premium voice conversation interface for SLE AI Companion
 * @author Manus AI
 * @version 1.0.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Volume2, VolumeX, X, MessageCircle, Trash2 } from 'lucide-react';
import { useVoiceConversation, VoiceState, ConversationMessage } from '../hooks/useVoiceConversation';

interface VoiceConversationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  language?: 'en' | 'fr';
  coachName?: string;
  coachAvatar?: string;
}

const stateLabels: Record<VoiceState, { en: string; fr: string }> = {
  idle: { en: 'Ready to listen', fr: 'Prêt à écouter' },
  recording: { en: 'Listening...', fr: 'J\'écoute...' },
  processing: { en: 'Thinking...', fr: 'Je réfléchis...' },
  speaking: { en: 'Speaking...', fr: 'Je parle...' },
  error: { en: 'Error occurred', fr: 'Une erreur s\'est produite' },
};

export function VoiceConversationPanel({
  isOpen,
  onClose,
  language = 'en',
  coachName = 'Prof. Steven',
  coachAvatar = '/prof-steven-avatar.png',
}: VoiceConversationPanelProps) {
  const [isMuted, setIsMuted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    state,
    isRecording,
    isProcessing,
    isSpeaking,
    error,
    messages,
    audioLevel,
    toggleRecording,
    stopSpeaking,
    clearConversation,
    hasPermission,
    requestPermission,
  } = useVoiceConversation({
    language,
    autoPlayResponse: !isMuted,
    onError: (err) => console.error('Voice error:', err),
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleMicClick = async () => {
    if (!hasPermission) {
      const granted = await requestPermission();
      if (!granted) return;
    }
    toggleRecording();
  };

  const handleMuteToggle = () => {
    if (isSpeaking && !isMuted) stopSpeaking();
    setIsMuted(!isMuted);
  };

  const getStatusColor = () => {
    switch (state) {
      case 'recording': return 'bg-red-500';
      case 'processing': return 'bg-yellow-500';
      case 'speaking': return 'bg-green-500';
      case 'error': return 'bg-red-600';
      default: return 'bg-gray-400';
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          className="relative w-full max-w-lg bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-white/10"
          layoutId="voice-panel"
        >
          {/* Header */}
          <div className="relative p-6 border-b border-white/10">
            <div className="flex items-center gap-4">
              <div className="relative">
                <img
                  src={coachAvatar}
                  alt={coachName}
                  className="w-16 h-16 rounded-full object-cover border-2 border-amber-400/50"
                />
                <motion.div
                  className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full ${getStatusColor()} border-2 border-slate-900`}
                  animate={isRecording || isSpeaking ? { scale: [1, 1.2, 1] } : {}}
                  transition={{ repeat: Infinity, duration: 1 }}
                />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-white">{coachName}</h3>
                <p className="text-sm text-amber-400/80">{stateLabels[state][language]}</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5 text-white/60" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="h-64 overflow-y-auto p-4 space-y-3">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <MessageCircle className="w-12 h-12 text-white/20 mb-3" />
                <p className="text-white/40 text-sm">
                  {language === 'en'
                    ? 'Tap the microphone to start speaking'
                    : 'Appuyez sur le micro pour commencer'}
                </p>
              </div>
            ) : (
              messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] px-4 py-2 rounded-2xl ${
                      msg.role === 'user'
                        ? 'bg-amber-500/20 text-amber-100 rounded-br-md'
                        : 'bg-white/10 text-white rounded-bl-md'
                    }`}
                  >
                    <p className="text-sm">{msg.text}</p>
                    <span className="text-xs opacity-50 mt-1 block">
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </motion.div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Audio Visualizer */}
          {isRecording && (
            <div className="px-6 py-2">
              <div className="flex items-center justify-center gap-1 h-8">
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-1 bg-amber-400 rounded-full"
                    animate={{
                      height: Math.max(4, audioLevel * 32 * (0.5 + Math.random() * 0.5)),
                    }}
                    transition={{ duration: 0.1 }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="mx-6 mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
              <p className="text-red-300 text-sm">{error.message}</p>
            </div>
          )}

          {/* Controls */}
          <div className="p-6 border-t border-white/10">
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={handleMuteToggle}
                className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? (
                  <VolumeX className="w-5 h-5 text-white/60" />
                ) : (
                  <Volume2 className="w-5 h-5 text-white/60" />
                )}
              </button>

              <motion.button
                onClick={handleMicClick}
                disabled={isProcessing}
                className={`relative p-6 rounded-full transition-all ${
                  isRecording
                    ? 'bg-red-500 hover:bg-red-600'
                    : 'bg-amber-500 hover:bg-amber-600'
                } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
                whileTap={{ scale: 0.95 }}
              >
                {isRecording ? (
                  <MicOff className="w-8 h-8 text-white" />
                ) : (
                  <Mic className="w-8 h-8 text-white" />
                )}
                {isRecording && (
                  <motion.div
                    className="absolute inset-0 rounded-full border-4 border-red-300"
                    animate={{ scale: [1, 1.2, 1], opacity: [1, 0, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  />
                )}
              </motion.button>

              <button
                onClick={clearConversation}
                className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                title={language === 'en' ? 'Clear conversation' : 'Effacer la conversation'}
              >
                <Trash2 className="w-5 h-5 text-white/60" />
              </button>
            </div>

            <p className="text-center text-white/40 text-xs mt-4">
              {language === 'en'
                ? 'Press and release to speak'
                : 'Appuyez et relâchez pour parler'}
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default VoiceConversationPanel;
