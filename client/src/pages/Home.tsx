import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FeaturedCoaches from "@/components/FeaturedCoaches";
import ProfStevenChatbot from "@/components/ProfStevenChatbot";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  GraduationCap,
  Users,
  Bot,
  Calendar,
  Star,
  ArrowRight,
  CheckCircle2,
  Globe,
  Clock,
  Award,
  MessageSquare,
  Play,
  Sparkles,
} from "lucide-react";
import { Link } from "wouter";

// Typewriter Component with Sound
function TypewriterTitle({ 
  text, 
  highlightText, 
  onComplete 
}: { 
  text: string; 
  highlightText: string; 
  onComplete?: () => void;
}) {
  const [displayedText, setDisplayedText] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [cycleKey, setCycleKey] = useState(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const prefersReducedMotion = useRef(false);
  const lastSoundTime = useRef(0);
  const prevTextRef = useRef("");
  const fullText = `${text} ${highlightText}`;
  
  // Reset animation when language changes (text prop changes)
  useEffect(() => {
    if (prevTextRef.current && prevTextRef.current !== fullText) {
      // Language changed, restart animation
      setCycleKey(prev => prev + 1);
    }
    prevTextRef.current = fullText;
  }, [fullText]);
  
  // Timing constants for natural typewriter feel
  const CHAR_SPEED = 120; // ms per character - slower, more deliberate typing
  const START_DELAY = 1000; // ms before starting to type
  const REPEAT_INTERVAL = 6000; // ms to wait before repeating (6 seconds)

  // Check for prefers-reduced-motion
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    prefersReducedMotion.current = mediaQuery.matches;

    if (mediaQuery.matches) {
      // Show full text immediately if reduced motion is preferred
      setDisplayedText(fullText);
      setIsComplete(true);
      onComplete?.();
    }

    const handleChange = (e: MediaQueryListEvent) => {
      prefersReducedMotion.current = e.matches;
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [fullText, onComplete]);

  // Initialize AudioContext lazily
  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      try {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      } catch (e) {
        // Audio not supported
      }
    }
    return audioContextRef.current;
  }, []);

  // Play authentic typewriter (machine dactylographique) sound
  const playTypeSound = useCallback(() => {
    if (prefersReducedMotion.current) return;

    try {
      // Throttle sounds to prevent audio overload
      const now = Date.now();
      if (now - lastSoundTime.current < 60) return;
      lastSoundTime.current = now;

      const audioContext = getAudioContext();
      if (!audioContext) return;
      
      if (audioContext.state === "suspended") {
        audioContext.resume();
      }

      const currentTime = audioContext.currentTime;
      
      // Random variation for organic feel
      const pitchVar = Math.random() * 0.3 + 0.85; // 0.85-1.15 variation
      const volumeVar = Math.random() * 0.2 + 0.9; // 0.9-1.1 variation

      // Layer 1: Sharp metallic CLACK - the typebar striking the platen
      // This is the main "clack" sound of a real typewriter
      const clackOsc = audioContext.createOscillator();
      const clackGain = audioContext.createGain();
      const clackFilter = audioContext.createBiquadFilter();
      clackOsc.connect(clackFilter);
      clackFilter.connect(clackGain);
      clackGain.connect(audioContext.destination);
      clackOsc.type = "sawtooth";
      clackFilter.type = "bandpass";
      clackFilter.frequency.setValueAtTime(2500 * pitchVar, currentTime);
      clackFilter.Q.setValueAtTime(2, currentTime);
      clackOsc.frequency.setValueAtTime(800 * pitchVar, currentTime);
      clackOsc.frequency.exponentialRampToValueAtTime(200, currentTime + 0.015);
      clackGain.gain.setValueAtTime(0.25 * volumeVar, currentTime);
      clackGain.gain.exponentialRampToValueAtTime(0.001, currentTime + 0.04);
      clackOsc.start(currentTime);
      clackOsc.stop(currentTime + 0.04);

      // Layer 2: Key mechanism click - the key lever snapping
      const clickOsc = audioContext.createOscillator();
      const clickGain = audioContext.createGain();
      clickOsc.connect(clickGain);
      clickGain.connect(audioContext.destination);
      clickOsc.type = "square";
      clickOsc.frequency.setValueAtTime(3500 * pitchVar, currentTime);
      clickOsc.frequency.exponentialRampToValueAtTime(1500, currentTime + 0.008);
      clickGain.gain.setValueAtTime(0.08 * volumeVar, currentTime);
      clickGain.gain.exponentialRampToValueAtTime(0.001, currentTime + 0.012);
      clickOsc.start(currentTime);
      clickOsc.stop(currentTime + 0.012);

      // Layer 3: Mechanical thunk - the key returning and carriage movement
      const thunkOsc = audioContext.createOscillator();
      const thunkGain = audioContext.createGain();
      thunkOsc.connect(thunkGain);
      thunkGain.connect(audioContext.destination);
      thunkOsc.type = "sine";
      thunkOsc.frequency.setValueAtTime(180 * pitchVar, currentTime + 0.01);
      thunkOsc.frequency.exponentialRampToValueAtTime(60, currentTime + 0.05);
      thunkGain.gain.setValueAtTime(0, currentTime);
      thunkGain.gain.linearRampToValueAtTime(0.15 * volumeVar, currentTime + 0.012);
      thunkGain.gain.exponentialRampToValueAtTime(0.001, currentTime + 0.08);
      thunkOsc.start(currentTime);
      thunkOsc.stop(currentTime + 0.08);

      // Layer 4: Paper/ribbon impact - high frequency noise burst
      const noiseBuffer = audioContext.createBuffer(1, audioContext.sampleRate * 0.02, audioContext.sampleRate);
      const noiseData = noiseBuffer.getChannelData(0);
      for (let i = 0; i < noiseData.length; i++) {
        noiseData[i] = (Math.random() * 2 - 1) * Math.exp(-i / (noiseData.length * 0.1));
      }
      const noiseSource = audioContext.createBufferSource();
      const noiseGain = audioContext.createGain();
      const noiseFilter = audioContext.createBiquadFilter();
      noiseSource.buffer = noiseBuffer;
      noiseSource.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(audioContext.destination);
      noiseFilter.type = "highpass";
      noiseFilter.frequency.setValueAtTime(4000, currentTime);
      noiseGain.gain.setValueAtTime(0.06 * volumeVar, currentTime);
      noiseSource.start(currentTime);

      // Layer 5: Subtle bell resonance (like the internal mechanics)
      const bellOsc = audioContext.createOscillator();
      const bellGain = audioContext.createGain();
      bellOsc.connect(bellGain);
      bellGain.connect(audioContext.destination);
      bellOsc.type = "sine";
      bellOsc.frequency.setValueAtTime(1200 * pitchVar, currentTime);
      bellGain.gain.setValueAtTime(0.02 * volumeVar, currentTime);
      bellGain.gain.exponentialRampToValueAtTime(0.001, currentTime + 0.1);
      bellOsc.start(currentTime);
      bellOsc.stop(currentTime + 0.1);

    } catch (e) {
      // Silently fail if audio is not available
    }
  }, [getAudioContext]);

  // Start typing cycle - resets and restarts
  useEffect(() => {
    if (prefersReducedMotion.current) return;

    // Reset state for new cycle
    setDisplayedText("");
    setIsComplete(false);
    setIsTyping(false);

    const startTimeout = setTimeout(() => {
      setIsTyping(true);
    }, START_DELAY);

    return () => clearTimeout(startTimeout);
  }, [cycleKey]);

  // Typing effect
  useEffect(() => {
    if (!isTyping || isComplete || prefersReducedMotion.current) return;

    if (displayedText.length < fullText.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(fullText.slice(0, displayedText.length + 1));
        playTypeSound();
      }, CHAR_SPEED);

      return () => clearTimeout(timeout);
    } else {
      setIsComplete(true);
      setIsTyping(false);
      onComplete?.();
      
      // Schedule next cycle after REPEAT_INTERVAL
      const repeatTimeout = setTimeout(() => {
        setCycleKey(prev => prev + 1);
      }, REPEAT_INTERVAL);
      
      return () => clearTimeout(repeatTimeout);
    }
  }, [displayedText, fullText, isTyping, isComplete, playTypeSound, onComplete]);

  // Cleanup AudioContext on unmount
  useEffect(() => {
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  // Render the text with highlight
  const mainTextLength = text.length;
  const displayedMainText = displayedText.slice(0, mainTextLength);
  const displayedHighlight = displayedText.slice(mainTextLength + 1); // +1 for space
  
  // Determine if cursor is currently typing the highlighted word
  const isTypingHighlight = displayedText.length > mainTextLength;
  
  // Cursor color changes to teal when typing highlighted words (Excellence/bilingue)
  const cursorColorClass = isTypingHighlight 
    ? "bg-teal-500 shadow-[0_0_8px_rgba(20,184,166,0.8)]" // Glowing teal for highlight
    : "bg-gray-800 dark:bg-gray-200"; // Default dark cursor

  return (
    <span>
      {displayedMainText}
      {displayedText.length > mainTextLength && " "}
      {displayedHighlight && (
        <span className="text-teal-600">{displayedHighlight}</span>
      )}
      {!isComplete && (
        <span 
          className={`inline-block w-[3px] h-[1em] ml-1 align-middle transition-all duration-300 ${cursorColorClass} ${isTypingHighlight ? 'animate-pulse-glow' : 'animate-blink'}`}
          aria-hidden="true"
        />
      )}
    </span>
  );
}

export default function Home() {
  const { t } = useLanguage();
  const [heroAnimated, setHeroAnimated] = useState(false);

  // Trigger hero animations after mount
  useEffect(() => {
    const timeout = setTimeout(() => {
      setHeroAnimated(true);
    }, 100);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main id="main-content" className="flex-1">
        {/* Hero Section - 2 Column Layout (Text Left, Image Right) */}
        <section 
          className="relative overflow-hidden py-12 lg:py-20 bg-gradient-to-br from-slate-50 to-teal-50/30"
          aria-labelledby="hero-title"
        >
          <div className="container">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              {/* Left Column - Text Content (6/12) */}
              <div className="space-y-6">
                {/* Badge - Fade in */}
                <div 
                  className={`inline-flex items-center gap-2 bg-teal-100 text-teal-700 rounded-full px-4 py-2 text-sm font-medium transition-all duration-700 ${
                    heroAnimated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}
                >
                  <Award className="h-4 w-4" aria-hidden="true" />
                  {t("hero.badge")}
                </div>

                {/* Title - H1 très gras with Typewriter Effect */}
                <h1 
                  id="hero-title"
                  className={`text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-foreground leading-tight transition-all duration-700 delay-200 ${
                    heroAnimated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}
                >
                  <TypewriterTitle 
                    text={t("hero.title")} 
                    highlightText={t("hero.titleHighlight")} 
                  />
                </h1>

                {/* Subtitle - Slide up */}
                <p 
                  className={`text-xl md:text-2xl font-medium text-gray-700 leading-relaxed transition-all duration-700 delay-300 ${
                    heroAnimated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}
                >
                  {t("hero.subtitle")}
                </p>

                {/* Description - Slide up */}
                <p 
                  className={`text-lg text-muted-foreground max-w-xl leading-relaxed transition-all duration-700 delay-400 ${
                    heroAnimated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}
                >
                  {t("hero.description")}
                </p>

                {/* CTA Buttons - Below text, Slide up */}
                <div 
                  className={`flex flex-col sm:flex-row gap-4 pt-4 transition-all duration-700 delay-500 ${
                    heroAnimated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}
                >
                  <Link href="/coaches">
                    <Button size="lg" className="w-full sm:w-auto gap-2 bg-teal-600 hover:bg-teal-700 text-white rounded-full px-8 h-14 text-base font-semibold shadow-lg shadow-teal-500/30">
                      {t("hero.findCoach")} <ArrowRight className="h-5 w-5" aria-hidden="true" />
                    </Button>
                  </Link>
                  <Link href="/ai-coach">
                    <Button size="lg" variant="outline" className="w-full sm:w-auto gap-2 border-2 border-teal-600 text-teal-600 hover:bg-teal-50 rounded-full px-8 h-14 text-base font-medium">
                      <Bot className="h-5 w-5" aria-hidden="true" /> {t("hero.tryAI")}
                    </Button>
                  </Link>
                </div>

                {/* Social Proof - Slide up */}
                <div 
                  className={`flex items-center gap-6 pt-4 transition-all duration-700 delay-600 ${
                    heroAnimated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}
                >
                  <div className="flex -space-x-3" aria-hidden="true">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="h-12 w-12 rounded-full border-3 border-white bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-sm font-bold text-white shadow-lg"
                      >
                        {String.fromCharCode(64 + i)}
                      </div>
                    ))}
                  </div>
                  <div className="text-sm">
                    <p className="font-bold text-foreground text-base">500+ {t("hero.socialProof")}</p>
                    <p className="text-muted-foreground">{t("hero.socialProofSub")}</p>
                  </div>
                </div>
              </div>

              {/* Right Column - Image (6/12) - Slide in from right */}
              <div 
                className={`relative transition-all duration-1000 delay-300 ${
                  heroAnimated ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
                }`}
              >
                {/* Desktop Image */}
                <img 
                  src="/images/hero-final-v19.png" 
                  alt="Lingueefy - Connect with SLE coaches through video calls"
                  className="hidden md:block w-full h-auto rounded-2xl shadow-2xl"
                />
                {/* Mobile Image - Cropped/Simplified version */}
                <img 
                  src="/images/hero-final-v19.png" 
                  alt="Lingueefy - Connect with SLE coaches through video calls"
                  className="md:hidden w-full h-auto rounded-xl shadow-xl"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Featured Coaches Section - Right after Hero */}
        <FeaturedCoaches />

        {/* SLE Levels Section - Glassmorphism */}
        <section 
          className="py-20 relative overflow-hidden"
          aria-labelledby="sle-title"
        >
          <div className="absolute inset-0 gradient-bg" aria-hidden="true" />
          
          <div className="container relative z-10">
            <div className="text-center mb-16">
              <h2 id="sle-title" className="text-3xl md:text-4xl font-bold mb-4">{t("sle.title")}</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                {t("sle.description")}
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  level: "A",
                  title: t("sle.levelA"),
                  description: t("sle.levelADesc"),
                  gradient: "from-amber-400 to-amber-500",
                  shadow: "shadow-amber-500/30",
                },
                {
                  level: "B",
                  title: t("sle.levelB"),
                  description: t("sle.levelBDesc"),
                  gradient: "from-blue-400 to-blue-500",
                  shadow: "shadow-blue-500/30",
                },
                {
                  level: "C",
                  title: t("sle.levelC"),
                  description: t("sle.levelCDesc"),
                  gradient: "from-emerald-400 to-emerald-500",
                  shadow: "shadow-emerald-500/30",
                },
              ].map((item) => (
                <div key={item.level} className="glass-card hover:shadow-2xl group">
                  <div className="flex items-center gap-4 mb-6">
                    <div
                      className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center shadow-lg ${item.shadow} group-hover:scale-110 transition-transform duration-300`}
                      aria-hidden="true"
                    >
                      <span className="text-2xl font-bold text-white">{item.level}</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-xl">{item.title}</h3>
                      <Badge className="glass-badge text-xs mt-1">{t("sle.skills")}</Badge>
                    </div>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works - Glassmorphism */}
        <section 
          className="py-24 relative overflow-hidden mesh-gradient"
          aria-labelledby="how-title"
        >
          <div className="container relative z-10">
            <div className="text-center mb-20">
              <h2 id="how-title" className="text-3xl md:text-4xl font-bold mb-4">{t("how.title")}</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                {t("how.description")}
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-8">
              {[
                {
                  icon: Users,
                  title: t("how.step1Title"),
                  description: t("how.step1Desc"),
                },
                {
                  icon: Calendar,
                  title: t("how.step2Title"),
                  description: t("how.step2Desc"),
                },
                {
                  icon: Bot,
                  title: t("how.step3Title"),
                  description: t("how.step3Desc"),
                },
                {
                  icon: Award,
                  title: t("how.step4Title"),
                  description: t("how.step4Desc"),
                },
              ].map((step, index) => (
                <div key={index} className="relative">
                  <div className="glass-card text-center group hover:shadow-2xl">
                    <div className="mb-6">
                      <div className="h-16 w-16 mx-auto rounded-2xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center shadow-lg shadow-teal-500/30 group-hover:scale-110 transition-transform duration-300">
                        <step.icon className="h-8 w-8 text-white" aria-hidden="true" />
                      </div>
                    </div>
                    <div className="absolute -top-3 -left-3 h-8 w-8 rounded-full bg-teal-500 text-white flex items-center justify-center font-bold text-sm shadow-lg">
                      {index + 1}
                    </div>
                    <h3 className="font-bold text-lg mb-3">{step.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
                  </div>
                  {index < 3 && (
                    <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10" aria-hidden="true">
                      <ArrowRight className="h-6 w-6 text-teal-500/50" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section - Glassmorphism */}
        <section 
          className="py-24 relative overflow-hidden"
          aria-labelledby="features-title"
        >
          <div className="absolute inset-0 gradient-bg" aria-hidden="true" />
          
          <div className="container relative z-10">
            <div className="text-center mb-20">
              <h2 id="features-title" className="text-3xl md:text-4xl font-bold mb-4">{t("features.title")}</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                {t("features.description")}
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: GraduationCap,
                  title: t("features.sleCoaches"),
                  description: t("features.sleCoachesDesc"),
                },
                {
                  icon: Bot,
                  title: t("features.ai"),
                  description: t("features.aiDesc"),
                },
                {
                  icon: Clock,
                  title: t("features.flexible"),
                  description: t("features.flexibleDesc"),
                },
                {
                  icon: Globe,
                  title: t("features.bilingual"),
                  description: t("features.bilingualDesc"),
                },
                {
                  icon: Star,
                  title: t("features.results"),
                  description: t("features.resultsDesc"),
                },
                {
                  icon: MessageSquare,
                  title: t("features.federal"),
                  description: t("features.federalDesc"),
                },
              ].map((feature, index) => (
                <div key={index} className="glass-card group hover:shadow-2xl">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center shadow-lg shadow-teal-500/30 group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                      <feature.icon className="h-6 w-6 text-white" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section - Glassmorphism */}
        <section 
          className="py-24 relative overflow-hidden mesh-gradient"
          aria-labelledby="cta-title"
        >
          <div className="container relative z-10">
            <div className="glass-card max-w-4xl mx-auto text-center">
              <div className="space-y-8">
                <div className="inline-flex items-center gap-2 glass-badge rounded-full px-5 py-2 text-sm font-medium text-teal-700">
                  <Sparkles className="h-4 w-4" aria-hidden="true" />
                  {t("hero.badge")}
                </div>
                
                <h2 id="cta-title" className="text-3xl md:text-4xl font-bold">{t("cta.title")}</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                  {t("cta.description")}
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                  <Link href="/coaches">
                    <Button size="lg" className="w-full sm:w-auto gap-2 glass-btn text-white rounded-full px-8 h-14 text-base font-semibold">
                      {t("cta.findCoach")} <ArrowRight className="h-5 w-5" aria-hidden="true" />
                    </Button>
                  </Link>
                  <Link href="/become-coach">
                    <Button size="lg" variant="outline" className="w-full sm:w-auto gap-2 glass-btn-outline rounded-full px-8 h-14 text-base font-medium">
                      {t("cta.becomeCoach")}
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      
      {/* Prof Steven AI Chatbot Widget */}
      <ProfStevenChatbot />

      {/* Typewriter cursor blink animation */}
      <style>{`
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
        .animate-blink {
          animation: blink 0.8s infinite;
        }
        
        /* Reduced motion support */
        @media (prefers-reduced-motion: reduce) {
          .animate-blink {
            animation: none;
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
