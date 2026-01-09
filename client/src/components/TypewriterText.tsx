import { useState, useEffect, useRef, useCallback } from "react";

interface TypewriterTextProps {
  text: string;
  highlightText?: string;
  highlightClassName?: string;
  className?: string;
  speed?: number;
  delay?: number;
  onComplete?: () => void;
}

export default function TypewriterText({
  text,
  highlightText,
  highlightClassName = "text-teal-600",
  className = "",
  speed = 50,
  delay = 500,
  onComplete,
}: TypewriterTextProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const prefersReducedMotion = useRef(false);

  // Check for prefers-reduced-motion
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    prefersReducedMotion.current = mediaQuery.matches;

    const handleChange = (e: MediaQueryListEvent) => {
      prefersReducedMotion.current = e.matches;
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // Initialize AudioContext lazily
  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContextRef.current;
  }, []);

  // Play typewriter sound
  const playTypeSound = useCallback(() => {
    if (prefersReducedMotion.current) return;

    try {
      const audioContext = getAudioContext();
      if (audioContext.state === "suspended") {
        audioContext.resume();
      }

      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      // Typewriter-like click sound
      oscillator.type = "square";
      oscillator.frequency.setValueAtTime(800 + Math.random() * 400, audioContext.currentTime);

      gainNode.gain.setValueAtTime(0.03, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.05);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.05);
    } catch (e) {
      // Silently fail if audio is not available
    }
  }, [getAudioContext]);

  // Full text including highlight
  const fullText = highlightText ? `${text} ${highlightText}` : text;

  useEffect(() => {
    // If user prefers reduced motion, show full text immediately
    if (prefersReducedMotion.current) {
      setDisplayedText(fullText);
      setIsComplete(true);
      onComplete?.();
      return;
    }

    // Start typing after delay
    const startTimeout = setTimeout(() => {
      setIsTyping(true);
    }, delay);

    return () => clearTimeout(startTimeout);
  }, [fullText, delay, onComplete]);

  useEffect(() => {
    if (!isTyping || isComplete) return;

    if (displayedText.length < fullText.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(fullText.slice(0, displayedText.length + 1));
        playTypeSound();
      }, speed);

      return () => clearTimeout(timeout);
    } else {
      setIsComplete(true);
      setIsTyping(false);
      onComplete?.();
    }
  }, [displayedText, fullText, isTyping, isComplete, speed, playTypeSound, onComplete]);

  // Cleanup AudioContext on unmount
  useEffect(() => {
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  // Render the text with highlight
  const renderText = () => {
    if (!highlightText) {
      return (
        <>
          {displayedText}
          {!isComplete && <span className="animate-pulse">|</span>}
        </>
      );
    }

    const mainTextLength = text.length;
    const displayedMainText = displayedText.slice(0, mainTextLength);
    const displayedHighlight = displayedText.slice(mainTextLength + 1); // +1 for space

    return (
      <>
        {displayedMainText}
        {displayedText.length > mainTextLength && " "}
        {displayedHighlight && (
          <span className={highlightClassName}>{displayedHighlight}</span>
        )}
        {!isComplete && <span className="animate-pulse">|</span>}
      </>
    );
  };

  return <span className={className}>{renderText()}</span>;
}
