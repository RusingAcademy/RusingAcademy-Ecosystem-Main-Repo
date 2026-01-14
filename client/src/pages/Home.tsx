import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import SEO from "@/components/SEO";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
// Header is now global via EcosystemLayout
import Footer from "@/components/Footer";
import FeaturedCoaches from "@/components/FeaturedCoaches";
import ProfStevenChatbot from "@/components/ProfStevenChatbot";
// Removed duplicate sections that exist on hub (/)
// TrustedByPublicServants, TheyTrustedUs, MeetOurExperts, LearningCapsules
// These sections are now only on the Ecosystem Landing page
import YouTubeVideos from "@/components/homepage/YouTubeVideos";
import EcosystemBrands from "@/components/homepage/EcosystemBrands";
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
  Quote,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  UserCheck,
  Trophy,
  ChevronDown,
  HelpCircle,
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
  
  useEffect(() => {
    if (prevTextRef.current && prevTextRef.current !== fullText) {
      setCycleKey(prev => prev + 1);
    }
    prevTextRef.current = fullText;
  }, [fullText]);
  
  const CHAR_SPEED = 120;
  const START_DELAY = 1000;
  const REPEAT_INTERVAL = 6000;

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    prefersReducedMotion.current = mediaQuery.matches;

    if (mediaQuery.matches) {
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

  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      try {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      } catch (e) {}
    }
    return audioContextRef.current;
  }, []);

  const playTypeSound = useCallback(() => {
    if (prefersReducedMotion.current) return;

    try {
      const now = Date.now();
      if (now - lastSoundTime.current < 60) return;
      lastSoundTime.current = now;

      const audioContext = getAudioContext();
      if (!audioContext) return;
      
      if (audioContext.state === "suspended") {
        audioContext.resume();
      }

      const currentTime = audioContext.currentTime;
      const pitchVar = Math.random() * 0.3 + 0.85;
      const volumeVar = Math.random() * 0.2 + 0.9;

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

    } catch (e) {}
  }, [getAudioContext]);

  useEffect(() => {
    if (prefersReducedMotion.current) return;

    setDisplayedText("");
    setIsComplete(false);
    setIsTyping(false);

    const startTimeout = setTimeout(() => {
      setIsTyping(true);
    }, START_DELAY);

    return () => clearTimeout(startTimeout);
  }, [cycleKey]);

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
      
      const repeatTimeout = setTimeout(() => {
        setCycleKey(prev => prev + 1);
      }, REPEAT_INTERVAL);
      
      return () => clearTimeout(repeatTimeout);
    }
  }, [displayedText, fullText, isTyping, isComplete, playTypeSound, onComplete]);

  useEffect(() => {
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const mainTextLength = text.length;
  const displayedMainText = displayedText.slice(0, mainTextLength);
  const displayedHighlight = displayedText.slice(mainTextLength + 1);
  const isTypingHighlight = displayedText.length > mainTextLength;
  
  const cursorColorClass = isTypingHighlight 
    ? "bg-teal-500 shadow-[0_0_8px_rgba(20,184,166,0.8)]"
    : "bg-gray-800 dark:bg-gray-200";

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

// Animated Counter Component
function AnimatedCounter({ 
  end, 
  duration = 2000, 
  suffix = "",
  prefix = ""
}: { 
  end: number; 
  duration?: number; 
  suffix?: string;
  prefix?: string;
}) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const counterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (counterRef.current) {
      observer.observe(counterRef.current);
    }

    return () => observer.disconnect();
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) return;

    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeOutQuart * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [isVisible, end, duration]);

  return (
    <div ref={counterRef} className="text-4xl md:text-5xl font-black text-teal-600">
      {prefix}{count.toLocaleString()}{suffix}
    </div>
  );
}

// Testimonials Carousel Component
function TestimonialsCarousel({ testimonials }: { testimonials: Array<{
  name: string;
  role: string;
  image: string;
  quote: string;
  rating: number;
  level: string;
}> }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-scroll every 5 seconds
  useEffect(() => {
    if (isAutoPlaying) {
      autoPlayRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % testimonials.length);
      }, 5000);
    }

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [isAutoPlaying, testimonials.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
    // Resume auto-play after 10 seconds of inactivity
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  return (
    <div className="relative">
      {/* Main Carousel */}
      <div className="overflow-hidden">
        <div 
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {testimonials.map((testimonial, index) => (
            <div 
              key={index} 
              className="w-full flex-shrink-0 px-4"
            >
              <div className="max-w-4xl mx-auto">
                <div className="bg-gradient-to-br from-slate-50 to-teal-50/30 rounded-3xl p-8 md:p-12 shadow-xl relative">
                  {/* Large Quote Icon */}
                  <div className="absolute top-8 right-8 text-teal-100">
                    <Quote className="h-20 w-20" aria-hidden="true" />
                  </div>

                  <div className="flex flex-col md:flex-row items-center gap-8">
                    {/* Author Photo */}
                    <div className="flex-shrink-0">
                      <div className="relative">
                        <img 
                          src={testimonial.image} 
                          alt={testimonial.name}
                          className="h-32 w-32 md:h-40 md:w-40 rounded-full object-cover border-4 border-teal-200 shadow-xl"
                        loading="lazy" />
                        {/* Level Badge */}
                        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-teal-500 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg">
                          {testimonial.level}
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 text-center md:text-left">
                      {/* Quote */}
                      <p className="text-xl md:text-2xl text-gray-700 leading-relaxed mb-6 italic">
                        "{testimonial.quote}"
                      </p>

                      {/* Rating */}
                      <div className="flex gap-1 justify-center md:justify-start mb-4">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="h-6 w-6 fill-amber-400 text-amber-400" />
                        ))}
                      </div>

                      {/* Author Info */}
                      <div>
                        <p className="font-bold text-xl text-foreground">{testimonial.name}</p>
                        <p className="text-muted-foreground">{testimonial.role}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
      <button 
        onClick={goToPrev}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:translate-x-0 h-12 w-12 rounded-full bg-white shadow-lg flex items-center justify-center text-teal-600 hover:bg-teal-50 transition-colors z-10"
        aria-label="Previous testimonial"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button 
        onClick={goToNext}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-0 h-12 w-12 rounded-full bg-white shadow-lg flex items-center justify-center text-teal-600 hover:bg-teal-50 transition-colors z-10"
        aria-label="Next testimonial"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Dots Navigation */}
      <div className="flex justify-center gap-2 mt-8">
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-3 rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? 'w-8 bg-teal-500' 
                : 'w-3 bg-teal-200 hover:bg-teal-300'
            }`}
            aria-label={`Go to testimonial ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

// FAQ Accordion Component
function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const { language } = useLanguage();

  const faqs = [
    {
      question: language === 'fr' ? "Qu'est-ce que l'examen SLE ?" : "What is the SLE exam?",
      answer: language === 'fr' 
        ? "L'Évaluation de langue seconde (ELS) est un test standardisé utilisé par le gouvernement fédéral du Canada pour évaluer les compétences linguistiques des employés en français et en anglais. Il comprend trois composantes : compréhension de l'écrit, expression écrite et compétence orale."
        : "The Second Language Evaluation (SLE) is a standardized test used by the Canadian federal government to assess employees' language proficiency in French and English. It consists of three components: Reading Comprehension, Written Expression, and Oral Proficiency."
    },
    {
      question: language === 'fr' ? "Que signifient les niveaux BBB, CBC et CCC ?" : "What do BBB, CBC, and CCC levels mean?",
      answer: language === 'fr'
        ? "Ces codes représentent les niveaux de compétence linguistique : A (débutant), B (intermédiaire) et C (avancé). BBB signifie niveau intermédiaire dans les trois compétences. CBC signifie avancé en lecture, intermédiaire en écriture et avancé à l'oral. CCC représente le niveau avancé dans toutes les compétences."
        : "These codes represent language proficiency levels: A (beginner), B (intermediate), and C (advanced). BBB means intermediate level in all three skills. CBC means advanced in reading, intermediate in writing, and advanced in oral. CCC represents advanced level in all skills."
    },
    {
      question: language === 'fr' ? "Combien de temps faut-il pour se préparer à l'examen SLE ?" : "How long does it take to prepare for the SLE exam?",
      answer: language === 'fr'
        ? "Le temps de préparation varie selon votre niveau actuel et votre objectif. En moyenne, nos apprenants atteignent leur niveau cible en 3-4 mois avec des sessions régulières (2-3 par semaine). Notre méthodologie de coaching accélère l'apprentissage de 3-4× par rapport aux méthodes traditionnelles."
        : "Preparation time varies based on your current level and target. On average, our learners achieve their target level in 3-4 months with regular sessions (2-3 per week). Our coaching methodology accelerates learning 3-4× faster than traditional methods."
    },
    {
      question: language === 'fr' ? "Comment fonctionne Prof Steven AI ?" : "How does Prof Steven AI work?",
      answer: language === 'fr'
        ? "Prof Steven AI est notre assistant d'entraînement disponible 24/7 qui simule des conversations d'examen oral, fournit des commentaires instantanés sur votre prononciation et grammaire, et vous aide à pratiquer entre les sessions de coaching. Il complète vos sessions avec un coach humain pour une préparation optimale."
        : "Prof Steven AI is our 24/7 practice assistant that simulates oral exam conversations, provides instant feedback on your pronunciation and grammar, and helps you practice between coaching sessions. It complements your sessions with a human coach for optimal preparation."
    },
    {
      question: language === 'fr' ? "Puis-je choisir mon propre coach ?" : "Can I choose my own coach?",
      answer: language === 'fr'
        ? "Absolument ! Vous pouvez parcourir les profils de nos 14+ coachs certifiés, voir leurs spécialités, disponibilités et avis des apprenants. Vous pouvez réserver une session d'essai gratuite pour trouver le coach qui correspond le mieux à votre style d'apprentissage."
        : "Absolutely! You can browse our 14+ certified coaches' profiles, see their specialties, availability, and learner reviews. You can book a free trial session to find the coach that best matches your learning style."
    },
    {
      question: language === 'fr' ? "Offrez-vous des forfaits pour les ministères ?" : "Do you offer packages for departments?",
      answer: language === 'fr'
        ? "Oui, nous offrons des forfaits corporatifs pour les ministères et agences fédéraux. Ces forfaits incluent des tarifs préférentiels, des rapports de progression pour les gestionnaires, et des programmes de formation personnalisés. Contactez-nous pour une soumission."
        : "Yes, we offer corporate packages for federal departments and agencies. These packages include preferential rates, progress reports for managers, and customized training programs. Contact us for a quote."
    },
  ];

  return (
    <section 
      className="py-24 relative overflow-hidden bg-gradient-to-br from-slate-50 to-teal-50/30"
      aria-labelledby="faq-title"
    >
      <div className="container relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-teal-100 text-teal-700 rounded-full px-4 py-2 text-sm font-medium mb-6">
            <HelpCircle className="h-4 w-4" />
            {language === 'fr' ? 'Questions Fréquentes' : 'Frequently Asked Questions'}
          </div>
          <h2 id="faq-title" className="text-3xl md:text-4xl font-bold mb-4">
            {language === 'fr' ? 'Tout ce que vous devez savoir sur l\'ELS' : 'Everything You Need to Know About the SLE'}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            {language === 'fr' 
              ? 'Trouvez des réponses aux questions les plus courantes sur les examens SLE et notre plateforme de coaching.'
              : 'Find answers to the most common questions about SLE exams and our coaching platform.'}
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index}
              className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden transition-all duration-300 hover:shadow-md"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left"
                aria-expanded={openIndex === index}
              >
                <span className="font-semibold text-lg text-foreground pr-4">{faq.question}</span>
                <ChevronDown 
                  className={`h-5 w-5 text-teal-600 flex-shrink-0 transition-transform duration-300 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`} 
                />
              </button>
              <div 
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="px-6 pb-5 text-muted-foreground leading-relaxed">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">
            {language === 'fr' ? 'Vous avez d\'autres questions ?' : 'Still have questions?'}
          </p>
          <Link href="/contact">
            <Button variant="outline" className="border-teal-600 text-teal-600 hover:bg-teal-50 rounded-full px-8">
              {language === 'fr' ? 'Contactez-nous' : 'Contact Us'}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const { t, language } = useLanguage();
  const [heroAnimated, setHeroAnimated] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setHeroAnimated(true);
    }, 100);
    return () => clearTimeout(timeout);
  }, []);

  // Extended testimonials data for carousel
  const testimonials = [
    {
      name: "Marie-Claire Dubois",
      role: "Policy Analyst, ESDC",
      image: "/images/testimonial-1.jpg",
      quote: "Thanks to Lingueefy, I achieved my CBC level in just 4 months. The coaches truly understand the SLE exam format and helped me focus on exactly what I needed.",
      rating: 5,
      level: "CBC",
    },
    {
      name: "Rajesh Patel",
      role: "IT Manager, CRA",
      image: "/images/testimonial-2.jpg",
      quote: "Prof Steven AI was a game-changer for my oral practice. I could practice anytime, and the feedback was incredibly helpful. Got my BBB on the first try!",
      rating: 5,
      level: "BBB",
    },
    {
      name: "Aisha Thompson",
      role: "HR Advisor, IRCC",
      image: "/images/testimonial-3.jpg",
      quote: "The flexibility of booking sessions around my work schedule made all the difference. My coach was patient, knowledgeable, and really invested in my success.",
      rating: 5,
      level: "CCC",
    },
    {
      name: "Jean-François Tremblay",
      role: "Financial Officer, DND",
      image: "/images/testimonial-1.jpg",
      quote: "I was nervous about my oral exam, but the mock simulations with my coach prepared me perfectly. The real exam felt familiar and I passed with confidence!",
      rating: 5,
      level: "BBB",
    },
    {
      name: "Sarah Chen",
      role: "Communications Advisor, PCO",
      image: "/images/testimonial-2.jpg",
      quote: "The combination of human coaching and AI practice is brilliant. I could work on my weak points 24/7 and then refine with my coach. Highly recommend!",
      rating: 5,
      level: "CBC",
    },
  ];

  // Statistics data
  const statistics = [
    {
      icon: Users,
      value: 500,
      suffix: "+",
      label: "Public Servants Trained",
      description: "Federal employees who achieved their SLE goals",
    },
    {
      icon: TrendingUp,
      value: 95,
      suffix: "%",
      label: "Success Rate",
      description: "Learners who passed their target SLE level",
    },
    {
      icon: UserCheck,
      value: 7,
      suffix: "",
      label: "Certified Coaches",
      description: "Expert SLE coaches ready to help you",
    },
    {
      icon: Trophy,
      value: 1200,
      suffix: "+",
      label: "Lessons Delivered",
      description: "Hours of personalized coaching sessions",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEO
        title={language === 'fr'
          ? 'Lingueefy - Trouvez votre coach ELS'
          : 'Lingueefy - Find Your SLE Coach'
        }
        description={language === 'fr'
          ? 'Connectez-vous avec des coachs ELS experts et pratiquez 24/7 avec Prof Steven IA. Atteignez vos objectifs BBB, CBC ou CCC plus rapidement avec un coaching personnalisé.'
          : 'Connect with expert SLE coaches and practice 24/7 with Prof Steven AI. Achieve your BBB, CBC, or CCC goals faster with personalized coaching for Canadian public servants.'
        }
      />
      {/* Global Header is now rendered by EcosystemLayout wrapper */}

      <main id="main-content" className="flex-1">
        {/* Hero Section */}
        <section 
          className="relative overflow-hidden py-12 lg:py-20 bg-gradient-to-br from-slate-50 to-teal-50/30"
          aria-labelledby="hero-title"
        >
          <div className="container">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              <div className="space-y-6">
                <div 
                  className={`inline-flex items-center gap-2 bg-teal-100 text-teal-700 rounded-full px-4 py-2 text-sm font-medium transition-all duration-700 ${
                    heroAnimated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}
                >
                  <Award className="h-4 w-4" aria-hidden="true" />
                  {t("hero.badge")}
                </div>

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

                <p 
                  className={`text-xl md:text-2xl font-medium text-gray-700 leading-relaxed transition-all duration-700 delay-300 ${
                    heroAnimated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}
                >
                  {t("hero.subtitle")}
                </p>

                <p 
                  className={`text-lg text-muted-foreground max-w-xl leading-relaxed transition-all duration-700 delay-400 ${
                    heroAnimated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}
                >
                  {t("hero.description")}
                </p>

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
                    <p className="font-bold text-foreground text-base">2,500+ {t("hero.socialProof")}</p>
                    <p className="text-muted-foreground">{t("hero.socialProofSub")}</p>
                  </div>
                </div>
              </div>

              <div 
                className={`relative transition-all duration-1000 delay-300 ${
                  heroAnimated ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
                }`}
              >
                <img 
                  src="/images/generated/lingueefy-hero.jpg" 
                  alt="Lingueefy - Connect with SLE coaches through video calls"
                  className="hidden md:block w-full h-auto rounded-2xl shadow-2xl"
                loading="lazy" />
                <img 
                  src="/images/generated/lingueefy-hero.jpg" 
                  alt="Lingueefy - Connect with SLE coaches through video calls"
                  className="md:hidden w-full h-auto rounded-xl shadow-xl"
                loading="lazy" />
              </div>
            </div>
          </div>
        </section>

        {/* Animated Statistics Section */}
        <section className="py-16 bg-gradient-to-r from-teal-600 to-teal-700 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-60 h-60 bg-white rounded-full translate-x-1/3 translate-y-1/3" />
          </div>
          
          <div className="container relative z-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {statistics.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-white/20 mb-4">
                    <stat.icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-4xl md:text-5xl font-black text-white mb-2">
                    <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                  </div>
                  <p className="text-lg font-semibold text-white/90">{stat.label}</p>
                  <p className="text-sm text-white/70 mt-1 hidden md:block">{stat.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Video Presentation Section */}
        <section className="py-24 bg-white relative overflow-hidden">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Meet Prof. Steven Barholere
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                Discover how Lingueefy can help you achieve your bilingual goals in the Canadian federal public service
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-slate-900 to-slate-800 aspect-video">
                {!isVideoPlaying ? (
                  <>
                    {/* Video Thumbnail with Photo Carousel */}
                    <div className="relative w-full h-full">
                      <img 
                        src="/images/coaches/steven-barholere.jpg" 
                        alt="Prof. Steven Barholere - Lingueefy Founder"
                        className="w-full h-full object-cover object-top opacity-90"
                      loading="lazy" />
                      {/* Floating Coach Photos Carousel */}
                      <div className="absolute top-4 right-4 flex flex-col gap-3">
                        {[
                          { src: "/images/coaches/sue-anne-richer.jpg", name: "Sue-Anne" },
                          { src: "/images/coaches/erika-seguin.jpg", name: "Erika" },
                          { src: "/images/coaches/soukaina-haidar.jpg", name: "Soukaina" },
                        ].map((coach, i) => (
                          <div key={i} className="h-16 w-16 rounded-full border-3 border-white shadow-lg overflow-hidden animate-pulse" style={{ animationDelay: `${i * 0.5}s` }}>
                            <img src={coach.src} alt={coach.name} className="w-full h-full object-cover" loading="lazy" />
                          </div>
                        ))}
                      </div>
                    </div>
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
                    
                    {/* Play Button */}
                    <button 
                      onClick={() => setIsVideoPlaying(true)}
                      className="absolute inset-0 flex items-center justify-center group"
                      aria-label="Play video"
                    >
                      <div className="h-24 w-24 rounded-full bg-teal-500 flex items-center justify-center shadow-2xl shadow-teal-500/50 group-hover:scale-110 transition-transform duration-300">
                        <Play className="h-10 w-10 text-white ml-1" fill="white" />
                      </div>
                    </button>

                    {/* Video Info */}
                    <div className="absolute bottom-0 left-0 right-0 p-8">
                      <div className="flex items-center gap-4">
                        <img 
                          src="/images/coaches/steven-barholere.jpg" 
                          alt="Steven Barholere"
                          className="h-20 w-20 rounded-full border-3 border-white object-cover shadow-xl"
                        loading="lazy" />
                        <div className="text-white">
                          <p className="font-bold text-xl">Prof. Steven Barholere</p>
                          <p className="text-white/80">Founder & Lead SLE Coach</p>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full bg-slate-900 relative group">
                    {/* HTML5 Video Player with Steven's MP4 */}
                    <video
                      className="w-full h-full object-contain"
                      src="/videos/steven-barholere.mp4"
                      autoPlay
                      controls
                      playsInline
                    >
                      <track kind="subtitles" src="/subtitles/steven-barholere-en.vtt" srcLang="en" label="English" />
                      <track kind="subtitles" src="/subtitles/steven-barholere-fr.vtt" srcLang="fr" label="Français" />
                      Your browser does not support the video tag.
                    </video>
                    {/* Close Button */}
                    <button
                      onClick={() => setIsVideoPlaying(false)}
                      className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70 transition-all"
                      aria-label="Close video"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 6L6 18M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>

              {/* Video Features */}
              <div className="grid md:grid-cols-3 gap-6 mt-8">
                {[
                  { icon: GraduationCap, title: "10+ Years Experience", desc: "Helping federal employees succeed" },
                  { icon: Award, title: "SLE Expert", desc: "Deep knowledge of exam criteria" },
                  { icon: Users, title: "2,500+ Public Servants", desc: "Achieved their bilingual goals" },
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                    <div className="h-12 w-12 rounded-xl bg-teal-100 flex items-center justify-center flex-shrink-0">
                      <item.icon className="h-6 w-6 text-teal-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{item.title}</p>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Featured Coaches Section */}
        <FeaturedCoaches />

        {/* Ecosystem Brands Bar */}
        <EcosystemBrands />

        {/* YouTube Videos & Podcasts */}
        <YouTubeVideos />

        {/* SLE Levels Section */}
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

        {/* How It Works */}
        <section 
          className="py-24 relative overflow-hidden bg-white"
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
                  image: "/images/how-it-works-1.jpg",
                  title: t("how.step1Title"),
                  description: t("how.step1Desc"),
                },
                {
                  image: "/images/how-it-works-2.jpg",
                  title: t("how.step2Title"),
                  description: t("how.step2Desc"),
                },
                {
                  image: "/images/how-it-works-3.jpg",
                  title: t("how.step3Title"),
                  description: t("how.step3Desc"),
                },
                {
                  image: "/images/how-it-works-4.jpg",
                  title: t("how.step4Title"),
                  description: t("how.step4Desc"),
                },
              ].map((step, index) => (
                <div key={index} className="relative group">
                  <div className="text-center">
                    <div className="relative mb-6 overflow-hidden rounded-2xl shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                      <img 
                        src={step.image} 
                        alt={step.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy" />
                      <div className="absolute top-3 left-3 h-10 w-10 rounded-full bg-teal-500 text-white flex items-center justify-center font-bold text-lg shadow-lg">
                        {index + 1}
                      </div>
                    </div>
                    <h3 className="font-bold text-lg mb-3">{step.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
                  </div>
                  {index < 3 && (
                    <div className="hidden md:block absolute top-24 -right-4 transform z-10" aria-hidden="true">
                      <ArrowRight className="h-6 w-6 text-teal-500/50" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Lingueefy */}
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

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  image: "/images/why-choose-1.jpg",
                  title: t("features.sleCoaches"),
                  description: t("features.sleCoachesDesc"),
                },
                {
                  image: "/images/why-choose-2.jpg",
                  title: t("features.ai"),
                  description: t("features.aiDesc"),
                },
                {
                  image: "/images/why-choose-3.jpg",
                  title: t("features.flexible"),
                  description: t("features.flexibleDesc"),
                },
                {
                  image: "/images/why-choose-4.jpg",
                  title: t("features.bilingual"),
                  description: t("features.bilingualDesc"),
                },
              ].map((feature, index) => (
                <div key={index} className="glass-card group hover:shadow-2xl overflow-hidden">
                  <div className="relative -mx-6 -mt-6 mb-6 overflow-hidden">
                    <img 
                      src={feature.image} 
                      alt={feature.title}
                      className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>

            <div className="grid md:grid-cols-2 gap-8 mt-12">
              {[
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

        {/* Testimonials Carousel Section */}
        <section 
          className="py-24 relative overflow-hidden bg-white"
          aria-labelledby="testimonials-title"
        >
          <div className="container relative z-10">
            <div className="text-center mb-16">
              <h2 id="testimonials-title" className="text-3xl md:text-4xl font-bold mb-4">
                What Our Learners Say
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                Join hundreds of federal employees who have achieved their bilingual goals with Lingueefy
              </p>
            </div>

            <TestimonialsCarousel testimonials={testimonials} />
          </div>
        </section>

        {/* FAQ Section */}
        <FAQSection />

        {/* CTA Section */}
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
      
      <ProfStevenChatbot />

      <style>{`
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
        .animate-blink {
          animation: blink 0.8s infinite;
        }
        
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
