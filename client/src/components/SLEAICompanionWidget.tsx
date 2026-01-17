import React, { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { Mic, ClipboardCheck, GraduationCap, X, Calendar, Sparkles } from "lucide-react";

// Steven Barholere avatar
const STEVEN_AVATAR = "/images/coaches/steven-barholere.jpg";

// CSS Keyframes for PREMIUM ORGANIC animations
const injectStyles = () => {
  if (document.getElementById('sle-ai-companion-styles')) return;
  
  const style = document.createElement('style');
  style.id = 'sle-ai-companion-styles';
  style.textContent = `
    /* ===== ORGANIC BREATHING ANIMATION - Premium High-End ===== */
    
    /* Main Breathing Glow - Soft & Organic */
    @keyframes organicBreathe {
      0%, 100% {
        transform: scale(1);
        opacity: 0.6;
        filter: blur(0px);
      }
      25% {
        transform: scale(1.02);
        opacity: 0.75;
      }
      50% {
        transform: scale(1.05);
        opacity: 0.9;
        filter: blur(1px);
      }
      75% {
        transform: scale(1.03);
        opacity: 0.8;
      }
    }
    
    /* Ring Breathing - Subtle Scale */
    @keyframes ringBreathe {
      0%, 100% {
        transform: scale(1) rotate(0deg);
        opacity: 0.7;
      }
      50% {
        transform: scale(1.06) rotate(3deg);
        opacity: 1;
      }
    }
    
    /* Secondary Ring - Offset Timing */
    @keyframes ringBreatheSecondary {
      0%, 100% {
        transform: scale(1) rotate(0deg);
        opacity: 0.4;
      }
      50% {
        transform: scale(1.08) rotate(-2deg);
        opacity: 0.6;
      }
    }
    
    /* Halo Glow Effect */
    @keyframes haloGlow {
      0%, 100% {
        box-shadow: 
          0 0 20px rgba(139, 92, 246, 0.2),
          0 0 40px rgba(139, 92, 246, 0.1),
          0 0 60px rgba(139, 92, 246, 0.05);
      }
      50% {
        box-shadow: 
          0 0 30px rgba(139, 92, 246, 0.35),
          0 0 50px rgba(139, 92, 246, 0.2),
          0 0 80px rgba(139, 92, 246, 0.1);
      }
    }
    
    /* AI Badge Float */
    @keyframes badgeFloat {
      0%, 100% {
        transform: translateY(0) scale(1);
      }
      50% {
        transform: translateY(-3px) scale(1.05);
      }
    }
    
    /* Status Dot - Organic Pulse */
    @keyframes statusPulse {
      0%, 100% {
        transform: scale(1);
        box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.5);
      }
      50% {
        transform: scale(1.15);
        box-shadow: 0 0 0 8px rgba(34, 197, 94, 0);
      }
    }
    
    /* Sparkle Animation */
    @keyframes sparkle {
      0%, 100% {
        opacity: 0.8;
        transform: rotate(0deg) scale(1);
      }
      50% {
        opacity: 1;
        transform: rotate(15deg) scale(1.1);
      }
    }
    
    /* Popup Entrance */
    @keyframes popupReveal {
      0% {
        opacity: 0;
        transform: translateY(-15px) scale(0.95);
        filter: blur(4px);
      }
      100% {
        opacity: 1;
        transform: translateY(0) scale(1);
        filter: blur(0px);
      }
    }
    
    /* Action Item Stagger */
    @keyframes actionSlide {
      0% {
        opacity: 0;
        transform: translateX(-15px);
      }
      100% {
        opacity: 1;
        transform: translateX(0);
      }
    }
    
    /* Reduced motion */
    @media (prefers-reduced-motion: reduce) {
      * {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
      }
    }
  `;
  document.head.appendChild(style);
};

interface SLEAICompanionWidgetProps {
  className?: string;
}

export default function SLEAICompanionWidget({ className = "" }: SLEAICompanionWidgetProps) {
  const { language } = useLanguage();
  const [open, setOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  
  // Inject CSS animations on mount
  useEffect(() => {
    injectStyles();
  }, []);
  
  // Close on click outside
  useEffect(() => {
    if (!open) return;
    
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        buttonRef.current && !buttonRef.current.contains(target) &&
        panelRef.current && !panelRef.current.contains(target)
      ) {
        setOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);
  
  // Close on Escape
  useEffect(() => {
    if (!open) return;
    
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [open]);
  
  // Content translations
  const content = {
    en: {
      label: "SLE AI Companion",
      welcome: "Your Personal SLE Coach",
      welcomeDesc: "Practice smarter. Pass your GC language exams.",
      voicePractice: "Voice Practice Sessions",
      voicePracticeDesc: "AI-powered speaking practice",
      placementTest: "SLE Placement Tests",
      placementTestDesc: "Assess your level (A, B, C)",
      examSimulation: "Oral Exam Simulations",
      examSimulationDesc: "Realistic mock exams",
      bookDiagnostic: "Book a Diagnostic",
      bookDiagnosticDesc: "30 min with a coach",
      poweredBy: "Powered by Lingueefy",
      close: "Close",
    },
    fr: {
      label: "SLE AI Companion",
      welcome: "Votre Coach SLE Personnel",
      welcomeDesc: "Pratiquez intelligemment. Réussissez vos examens.",
      voicePractice: "Sessions de Pratique Vocale",
      voicePracticeDesc: "Pratique orale avec IA",
      placementTest: "Tests de Placement ELS",
      placementTestDesc: "Évaluez votre niveau (A, B, C)",
      examSimulation: "Simulations d'Examen Oral",
      examSimulationDesc: "Examens simulés réalistes",
      bookDiagnostic: "Réserver un Diagnostic",
      bookDiagnosticDesc: "30 min avec un coach",
      poweredBy: "Propulsé par Lingueefy",
      close: "Fermer",
    }
  };
  
  const t = content[language];
  
  return (
    <div className={`relative ${className}`}>
      {/* ===== TRIGGER BUTTON - PREMIUM ORGANIC BREATHING ===== */}
      <button
        ref={buttonRef}
        onClick={() => setOpen(!open)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative flex flex-col items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 rounded-full"
        aria-label={t.label}
        aria-expanded={open}
        aria-haspopup="dialog"
      >
        {/* ===== BREATHING RING SYSTEM ===== */}
        <div className="relative" style={{ width: '100px', height: '100px' }}>
          
          {/* Outer Halo Glow */}
          <div 
            className="absolute rounded-full"
            style={{
              width: '120px',
              height: '120px',
              top: '-10px',
              left: '-10px',
              background: 'radial-gradient(circle, rgba(139, 92, 246, 0.12) 0%, transparent 70%)',
              animation: 'organicBreathe 5s ease-in-out infinite',
              pointerEvents: 'none',
            }}
          />
          
          {/* Primary Breathing Ring */}
          <div 
            className="absolute rounded-full"
            style={{
              width: '108px',
              height: '108px',
              top: '-4px',
              left: '-4px',
              border: '3px solid',
              borderColor: 'rgba(139, 92, 246, 0.5)',
              background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, transparent 50%)',
              animation: 'ringBreathe 4s ease-in-out infinite',
              pointerEvents: 'none',
            }}
          />
          
          {/* Secondary Ring - Offset */}
          <div 
            className="absolute rounded-full"
            style={{
              width: '116px',
              height: '116px',
              top: '-8px',
              left: '-8px',
              border: '2px solid rgba(139, 92, 246, 0.25)',
              animation: 'ringBreatheSecondary 4s ease-in-out infinite 0.8s',
              pointerEvents: 'none',
            }}
          />
          
          {/* Avatar Container with Halo */}
          <div 
            className="relative rounded-full transition-transform duration-500"
            style={{
              width: '100px',
              height: '100px',
              padding: '4px',
              background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 50%, #6D28D9 100%)',
              animation: 'haloGlow 4s ease-in-out infinite',
              transform: isHovered ? 'scale(1.05)' : 'scale(1)',
            }}
          >
            {/* Inner White Border */}
            <div 
              className="w-full h-full rounded-full overflow-hidden"
              style={{
                border: '3px solid rgba(255, 255, 255, 0.95)',
                boxShadow: 'inset 0 4px 15px rgba(0, 0, 0, 0.1)',
              }}
            >
              <img 
                src={STEVEN_AVATAR}
                alt="Prof. Steven Barholere - SLE AI Coach"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face";
                }}
              />
            </div>
            
            {/* AI Badge - Premium Floating */}
            <div 
              className="absolute flex items-center justify-center rounded-full"
              style={{
                top: '-4px',
                right: '-4px',
                width: '32px',
                height: '32px',
                background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
                boxShadow: '0 4px 15px rgba(139, 92, 246, 0.5), 0 0 0 3px white',
                animation: 'badgeFloat 3s ease-in-out infinite',
              }}
            >
              <Sparkles 
                className="w-4 h-4 text-white"
                style={{ animation: 'sparkle 2s ease-in-out infinite' }}
              />
            </div>
            
            {/* Status Dot - Organic Pulse */}
            <div 
              className="absolute rounded-full"
              style={{
                bottom: '4px',
                right: '4px',
                width: '16px',
                height: '16px',
                background: 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)',
                border: '3px solid white',
                boxShadow: '0 2px 8px rgba(34, 197, 94, 0.4)',
                animation: 'statusPulse 3s ease-in-out infinite',
              }}
            />
          </div>
        </div>
        
        {/* Label - Elegant Typography */}
        <span 
          className="mt-3 text-sm font-semibold tracking-wide transition-all duration-300"
          style={{
            color: isHovered ? '#7C3AED' : '#64748B',
            textShadow: isHovered ? '0 0 20px rgba(139, 92, 246, 0.3)' : 'none',
          }}
        >
          {t.label}
        </span>
      </button>
      
      {/* ===== POPUP PANEL - PREMIUM GLASSMORPHISM ===== */}
      {open && (
        <div 
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label={t.label}
          className="absolute z-50"
          style={{
            top: 'calc(100% + 16px)',
            right: '0',
            width: '360px',
            borderRadius: '24px',
            overflow: 'hidden',
            background: 'rgba(255, 255, 255, 0.97)',
            backdropFilter: 'blur(24px) saturate(1.5)',
            WebkitBackdropFilter: 'blur(24px) saturate(1.5)',
            border: '1px solid rgba(139, 92, 246, 0.12)',
            boxShadow: `
              0 30px 60px -15px rgba(0, 0, 0, 0.2),
              0 15px 30px -10px rgba(139, 92, 246, 0.1),
              0 0 0 1px rgba(255, 255, 255, 0.5) inset
            `,
            animation: 'popupReveal 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          {/* Header - Gradient */}
          <div 
            className="p-5 relative"
            style={{
              background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 50%, #6D28D9 100%)',
            }}
          >
            <div className="flex items-center gap-4">
              <img 
                src={STEVEN_AVATAR}
                alt="Prof. Steven"
                className="w-14 h-14 rounded-full object-cover"
                style={{
                  border: '3px solid rgba(255,255,255,0.9)',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                }}
              />
              <div className="flex-1">
                <h4 className="text-white font-bold text-lg flex items-center gap-2">
                  Prof. Steven
                  <span 
                    className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                    style={{
                      background: 'rgba(255,255,255,0.25)',
                      backdropFilter: 'blur(4px)',
                    }}
                  >
                    AI Coach
                  </span>
                </h4>
                <p className="text-white/85 text-sm mt-0.5">{t.welcomeDesc}</p>
              </div>
            </div>
            <button 
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110 hover:bg-white/30"
              style={{
                background: 'rgba(255,255,255,0.2)',
                backdropFilter: 'blur(4px)',
              }}
              aria-label={t.close}
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>
          
          {/* Actions */}
          <div className="p-4 space-y-2">
            {/* Voice Practice */}
            <Link href="/ai-coach?mode=voice" onClick={() => setOpen(false)}>
              <div 
                className="flex items-center gap-3 p-3.5 rounded-2xl transition-all duration-200 cursor-pointer hover:scale-[1.02]"
                style={{
                  background: 'linear-gradient(135deg, #F0FDFA 0%, #CCFBF1 100%)',
                  animation: 'actionSlide 0.3s ease-out 0.1s both',
                }}
              >
                <div 
                  className="w-11 h-11 rounded-xl flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #14B8A6 0%, #0D9488 100%)', boxShadow: '0 4px 12px rgba(20, 184, 166, 0.3)' }}
                >
                  <Mic className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h5 className="text-sm font-bold text-gray-900">{t.voicePractice}</h5>
                  <p className="text-xs text-gray-500">{t.voicePracticeDesc}</p>
                </div>
              </div>
            </Link>
            
            {/* Placement Test */}
            <Link href="/ai-coach?mode=placement" onClick={() => setOpen(false)}>
              <div 
                className="flex items-center gap-3 p-3.5 rounded-2xl transition-all duration-200 cursor-pointer hover:scale-[1.02]"
                style={{
                  background: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)',
                  animation: 'actionSlide 0.3s ease-out 0.15s both',
                }}
              >
                <div 
                  className="w-11 h-11 rounded-xl flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)', boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)' }}
                >
                  <ClipboardCheck className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h5 className="text-sm font-bold text-gray-900">{t.placementTest}</h5>
                  <p className="text-xs text-gray-500">{t.placementTestDesc}</p>
                </div>
              </div>
            </Link>
            
            {/* Exam Simulation */}
            <Link href="/ai-coach?mode=simulation" onClick={() => setOpen(false)}>
              <div 
                className="flex items-center gap-3 p-3.5 rounded-2xl transition-all duration-200 cursor-pointer hover:scale-[1.02]"
                style={{
                  background: 'linear-gradient(135deg, #FAF5FF 0%, #F3E8FF 100%)',
                  animation: 'actionSlide 0.3s ease-out 0.2s both',
                }}
              >
                <div 
                  className="w-11 h-11 rounded-xl flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #A855F7 0%, #9333EA 100%)', boxShadow: '0 4px 12px rgba(168, 85, 247, 0.3)' }}
                >
                  <GraduationCap className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h5 className="text-sm font-bold text-gray-900">{t.examSimulation}</h5>
                  <p className="text-xs text-gray-500">{t.examSimulationDesc}</p>
                </div>
              </div>
            </Link>
            
            {/* Book Diagnostic */}
            <a 
              href="https://calendly.com/steven-barholere/30min"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
            >
              <div 
                className="flex items-center gap-3 p-3.5 rounded-2xl transition-all duration-200 cursor-pointer hover:scale-[1.02]"
                style={{
                  background: 'linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 100%)',
                  animation: 'actionSlide 0.3s ease-out 0.25s both',
                }}
              >
                <div 
                  className="w-11 h-11 rounded-xl flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)', boxShadow: '0 4px 12px rgba(249, 115, 22, 0.3)' }}
                >
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h5 className="text-sm font-bold text-gray-900">{t.bookDiagnostic}</h5>
                  <p className="text-xs text-gray-500">{t.bookDiagnosticDesc}</p>
                </div>
              </div>
            </a>
          </div>
          
          {/* Footer */}
          <div 
            className="px-5 py-3 text-center border-t"
            style={{
              background: 'rgba(248, 250, 252, 0.8)',
              borderColor: 'rgba(0, 0, 0, 0.04)',
            }}
          >
            <p className="text-xs text-slate-400">
              {t.poweredBy.split('Lingueefy')[0]}
              <span className="font-semibold text-violet-500">Lingueefy</span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
