/**
 * useVoiceConversation Hook
 * Voice-based conversations with the SLE AI Companion.
 * @author Manus AI
 * @version 1.0.0
 */

import { useState, useCallback, useRef, useEffect } from 'react';

export type VoiceState = 'idle' | 'recording' | 'processing' | 'speaking' | 'error';

export interface ConversationMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: Date;
  audioUrl?: string;
}

export interface VoiceConversationOptions {
  language?: 'en' | 'fr';
  autoPlayResponse?: boolean;
  maxRecordingDuration?: number;
  onStateChange?: (state: VoiceState) => void;
  onMessage?: (message: ConversationMessage) => void;
  onError?: (error: Error) => void;
}

export function useVoiceConversation(options: VoiceConversationOptions = {}) {
  const {
    language = 'en',
    autoPlayResponse = true,
    maxRecordingDuration = 60,
    onStateChange,
    onMessage,
    onError,
  } = options;

  const [state, setState] = useState<VoiceState>('idle');
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [currentTranscript, setCurrentTranscript] = useState('');
  const [audioLevel, setAudioLevel] = useState(0);
  const [error, setError] = useState<Error | null>(null);
  const [hasPermission, setHasPermission] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const recordingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const isRecording = state === 'recording';
  const isProcessing = state === 'processing';
  const isSpeaking = state === 'speaking';

  const updateState = useCallback((newState: VoiceState) => {
    setState(newState);
    onStateChange?.(newState);
  }, [onStateChange]);

  const handleError = useCallback((err: Error) => {
    console.error('[VoiceConversation] Error:', err);
    setError(err);
    updateState('error');
    onError?.(err);
  }, [updateState, onError]);

  const generateId = () => `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  const stopAudioLevelMonitoring = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    setAudioLevel(0);
  }, []);

  const startAudioLevelMonitoring = useCallback((stream: MediaStream) => {
    try {
      audioContextRef.current = new AudioContext();
      analyserRef.current = audioContextRef.current.createAnalyser();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);
      analyserRef.current.fftSize = 256;

      const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);

      const updateLevel = () => {
        if (analyserRef.current && state === 'recording') {
          analyserRef.current.getByteFrequencyData(dataArray);
          const average = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
          setAudioLevel(average / 255);
          animationFrameRef.current = requestAnimationFrame(updateLevel);
        }
      };

      updateLevel();
    } catch (err) {
      console.warn('[VoiceConversation] Audio level monitoring not available:', err);
    }
  }, [state]);

  const requestPermission = useCallback(async (): Promise<boolean> => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      setHasPermission(true);
      return true;
    } catch (err) {
      console.error('[VoiceConversation] Permission denied:', err);
      setHasPermission(false);
      return false;
    }
  }, []);

  const playResponse = useCallback(async (audioData: string) => {
    try {
      updateState('speaking');
      const audio = new Audio();
      audioElementRef.current = audio;

      if (audioData.startsWith('http')) {
        audio.src = audioData;
      } else {
        audio.src = `data:audio/mp3;base64,${audioData}`;
      }

      audio.onended = () => {
        updateState('idle');
        audioElementRef.current = null;
      };

      audio.onerror = () => {
        updateState('idle');
        audioElementRef.current = null;
      };

      await audio.play();
    } catch (err) {
      console.error('[VoiceConversation] Playback error:', err);
      updateState('idle');
    }
  }, [updateState]);

  const processRecording = useCallback(async () => {
    try {
      updateState('processing');
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
      
      const reader = new FileReader();
      const audioBase64 = await new Promise<string>((resolve, reject) => {
        reader.onloadend = () => {
          const base64 = (reader.result as string).split(',')[1];
          resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(audioBlob);
      });

      const context = messages.map(msg => ({
        role: msg.role,
        content: msg.text,
      }));

      const response = await fetch('/api/voice/conversation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ audio: audioBase64, context, language }),
      });

      if (!response.ok) throw new Error(`API error: ${response.status}`);

      const result = await response.json();
      if (!result.success) throw new Error(result.error || 'Unknown error');

      const userMessage: ConversationMessage = {
        id: generateId(),
        role: 'user',
        text: result.userText,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, userMessage]);
      onMessage?.(userMessage);
      setCurrentTranscript(result.userText);

      const assistantMessage: ConversationMessage = {
        id: generateId(),
        role: 'assistant',
        text: result.aiText,
        timestamp: new Date(),
        audioUrl: result.audioUrl,
      };
      setMessages(prev => [...prev, assistantMessage]);
      onMessage?.(assistantMessage);

      if (autoPlayResponse && (result.audio || result.audioUrl)) {
        await playResponse(result.audio || result.audioUrl);
      } else {
        updateState('idle');
      }
    } catch (err) {
      handleError(err instanceof Error ? err : new Error('Processing failed'));
    }
  }, [messages, language, autoPlayResponse, updateState, onMessage, handleError, playResponse]);

  const stopRecording = useCallback(async () => {
    if (recordingTimeoutRef.current) {
      clearTimeout(recordingTimeoutRef.current);
      recordingTimeoutRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
  }, []);

  const startRecording = useCallback(async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true }
      });
      
      setHasPermission(true);
      audioChunksRef.current = [];

      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus' : 'audio/webm';
      
      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        stream.getTracks().forEach(track => track.stop());
        stopAudioLevelMonitoring();
        if (audioChunksRef.current.length > 0) await processRecording();
      };

      mediaRecorder.start(100);
      updateState('recording');
      startAudioLevelMonitoring(stream);

      recordingTimeoutRef.current = setTimeout(() => {
        if (mediaRecorderRef.current?.state === 'recording') stopRecording();
      }, maxRecordingDuration * 1000);
    } catch (err) {
      handleError(err instanceof Error ? err : new Error('Failed to start recording'));
    }
  }, [maxRecordingDuration, updateState, startAudioLevelMonitoring, stopAudioLevelMonitoring, handleError, processRecording, stopRecording]);

  const toggleRecording = useCallback(async () => {
    if (isRecording) await stopRecording();
    else if (state === 'idle' || state === 'error') await startRecording();
  }, [isRecording, state, startRecording, stopRecording]);

  const stopSpeaking = useCallback(() => {
    if (audioElementRef.current) {
      audioElementRef.current.pause();
      audioElementRef.current = null;
    }
    updateState('idle');
  }, [updateState]);

  const clearConversation = useCallback(() => {
    setMessages([]);
    setCurrentTranscript('');
    setError(null);
    updateState('idle');
  }, [updateState]);

  useEffect(() => {
    navigator.permissions?.query({ name: 'microphone' as PermissionName })
      .then(result => setHasPermission(result.state === 'granted'))
      .catch(() => {});
  }, []);

  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current?.state === 'recording') mediaRecorderRef.current.stop();
      stopAudioLevelMonitoring();
      if (audioElementRef.current) audioElementRef.current.pause();
      if (recordingTimeoutRef.current) clearTimeout(recordingTimeoutRef.current);
    };
  }, [stopAudioLevelMonitoring]);

  return {
    state, isRecording, isProcessing, isSpeaking, error,
    messages, currentTranscript, audioLevel,
    startRecording, stopRecording, toggleRecording,
    playResponse, stopSpeaking, clearConversation,
    hasPermission, requestPermission,
  };
}

export default useVoiceConversation;
