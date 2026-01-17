import React, { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { Mic, ClipboardCheck, GraduationCap, X, Calendar } from "lucide-react";

// Steven Barholere avatar
const STEVEN_AVATAR = "/images/coaches/steven-barholere.jpg";

// CSS Keyframes for animations (injected once)
const injectStyles = () => {
  if (document.getElementById('sle-ai-companion-styles')) return;
  
  const style = document.createElement('style');
  style.id = 'sle-ai-companion-styles';
  style.textContent = `
    /* Ring Pulse Animation */
    @keyframes sleRingPulse {
      0%, 100% {
        transform: scale(1);
        opacity: 0.8;
      }
      50% {
        transform: scale(1.15);
        opacity: 0.4;
      }
    }
    
    /* Dot Blink Animation */
    @keyframes sleDotBlink {
      0%, 100% {
        transform: scale(1);
        box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7);
      }
      50% {
        transform: scale(1.1);
        box-shadow: 0 0 0 6px rgba(34, 197, 94, 0);
      }
    }
    
    /* Breathe Glow Animation */
    @keyframes sleBreatheGlow {
      0%, 100% {
        box-shadow: 0 4px 20px rgba(139, 92, 246, 0.2);
      }
      50% {
        box-shadow: 0 8px 30px rgba(139, 92, 246, 0.35);
      }
    }
    
    /* Avatar Glow Animation */
    @keyframes sleAvatarGlow {
      0%, 100% {
        box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.3), 0 0 20px rgba(139, 92, 246, 0.2);
      }
      50% {
        box-shadow: 0 0 0 4px rgba(139, 92, 246, 0.5), 0 0 30px rgba(139, 92, 246, 0.3);
      }
    }
    
    /* Popup Slide In */
    @keyframes slePopupSlideIn {
      from {
        opacity: 0;
        transform: translateY(10px) scale(0.97);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }
    
    /* Reduced motion */
    @media (prefers-reduced-motion: reduce) {
      .sle-ring-pulse,
      .sle-dot-blink,
      .sle-breathe-glow,
      .sle-avatar-glow {
        animation: none !important;
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
      escHint: "Press Esc to close",
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
      escHint: "Appuyez sur Échap pour fermer",
    }
  };
  
  const t = content[language];
  
  return (
    <div className={`relative ${className}`}>
      {/* ===== TRIGGER BUTTON - CIRCULAR AVATAR WITH PULSING RING ===== */}
      <button
        ref={buttonRef}
        onClick={() => setOpen(!open)}
        className="relative flex flex-col items-center gap-1 group focus:outline-none"
        aria-label={t.label}
        aria-expanded={open}
        aria-haspopup="dialog"
        style={{ cursor: 'pointer' }}
      >
        {/* Outer Pulsing Ring */}
        <div 
          className="absolute inset-0 rounded-full sle-ring-pulse"
          style={{
            width: '90px',
            height: '90px',
            top: '-5px',
            left: '50%',
            transform: 'translateX(-50%)',
            border: '2px solid rgba(139, 92, 246, 0.4)',
            borderRadius: '50%',
            animation: 'sleRingPulse 2.5s ease-in-out infinite',
            pointerEvents: 'none',
          }}
        />
        
        {/* Second Ring (offset timing) */}
        <div 
          className="absolute rounded-full"
          style={{
            width: '100px',
            height: '100px',
            top: '-10px',
            left: '50%',
            transform: 'translateX(-50%)',
            border: '1px solid rgba(139, 92, 246, 0.2)',
            borderRadius: '50%',
            animation: 'sleRingPulse 2.5s ease-in-out infinite 0.5s',
            pointerEvents: 'none',
          }}
        />
        
        {/* Avatar Container */}
        <div 
          className="relative sle-avatar-glow"
          style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            padding: '3px',
            background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 50%, #6D28D9 100%)',
            animation: 'sleAvatarGlow 3s ease-in-out infinite',
          }}
        >
          {/* Inner white border */}
          <div 
            className="w-full h-full rounded-full overflow-hidden"
            style={{
              border: '2px solid white',
              boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.1)',
            }}
          >
            <img 
              src={STEVEN_AVATAR}
              alt="Prof. Steven Barholere"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face";
              }}
            />
          </div>
          
          {/* AI Badge - Top Right */}
          <div 
            className="absolute flex items-center justify-center font-bold text-white"
            style={{
              top: '-2px',
              right: '-2px',
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
              boxShadow: '0 2px 8px rgba(139, 92, 246, 0.5), 0 0 0 2px white',
              fontSize: '11px',
              fontWeight: 800,
              letterSpacing: '-0.5px',
            }}
          >
            AI
          </div>
          
          {/* Online Status Dot - Bottom Right */}
          <div 
            className="absolute sle-dot-blink"
            style={{
              bottom: '4px',
              right: '4px',
              width: '14px',
              height: '14px',
              borderRadius: '50%',
              background: '#22C55E',
              border: '2px solid white',
              boxShadow: '0 0 0 0 rgba(34, 197, 94, 0.7)',
              animation: 'sleDotBlink 2s infinite',
            }}
          />
        </div>
        
        {/* Label Below Avatar */}
        <span 
          className="text-xs font-semibold text-slate-600 whitespace-nowrap mt-1 group-hover:text-violet-600 transition-colors"
          style={{
            textShadow: '0 1px 2px rgba(255,255,255,0.8)',
          }}
        >
          {t.label}
        </span>
      </button>
      
      {/* ===== POPUP PANEL ===== */}
      {open && (
        <div 
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label={t.label}
          className="absolute z-50"
          style={{
            top: 'calc(100% + 12px)',
            right: '0',
            width: '380px',
            borderRadius: '20px',
            overflow: 'hidden',
            background: 'white',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.05)',
            animation: 'slePopupSlideIn 0.3s ease-out',
          }}
        >
          {/* Header */}
          <div 
            className="p-5 flex items-center gap-4 relative"
            style={{
              background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 50%, #6D28D9 100%)',
            }}
          >
            <img 
              src={STEVEN_AVATAR}
              alt="Prof. Steven Barholere"
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
            <button 
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110"
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
          <div className="p-4 space-y-2.5">
            {/* Voice Practice */}
            <Link href="/ai-coach?mode=voice" onClick={() => setOpen(false)}>
              <div className="flex items-center gap-3 p-3.5 rounded-xl transition-all duration-200 cursor-pointer group hover:scale-[1.01]"
                style={{
                  background: 'linear-gradient(135deg, #F0FDFA 0%, #CCFBF1 100%)',
                  border: '1px solid transparent',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#14B8A6';
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(20, 184, 166, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'transparent';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div className="w-11 h-11 rounded-xl flex items-center justify-center shadow-sm"
                  style={{ background: 'linear-gradient(135deg, #14B8A6 0%, #0D9488 100%)' }}
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
              <div className="flex items-center gap-3 p-3.5 rounded-xl transition-all duration-200 cursor-pointer group hover:scale-[1.01]"
                style={{
                  background: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)',
                  border: '1px solid transparent',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#3B82F6';
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(59, 130, 246, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'transparent';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div className="w-11 h-11 rounded-xl flex items-center justify-center shadow-sm"
                  style={{ background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)' }}
                >
                  <ClipboardCheck className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h5 className="text-sm font-bold text-gray-900">{t.placementTest}</h5>
                  <p className="text-xs text-gray-500">{t.placementTestDesc}</p>
                </div>
              </div>
            </Link>
            
            {/* Oral Exam Simulations */}
            <Link href="/ai-coach?mode=simulation" onClick={() => setOpen(false)}>
              <div className="flex items-center gap-3 p-3.5 rounded-xl transition-all duration-200 cursor-pointer group hover:scale-[1.01]"
                style={{
                  background: 'linear-gradient(135deg, #FAF5FF 0%, #F3E8FF 100%)',
                  border: '1px solid transparent',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#A855F7';
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(168, 85, 247, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'transparent';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div className="w-11 h-11 rounded-xl flex items-center justify-center shadow-sm"
                  style={{ background: 'linear-gradient(135deg, #A855F7 0%, #9333EA 100%)' }}
                >
                  <GraduationCap className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h5 className="text-sm font-bold text-gray-900">{t.examSimulation}</h5>
                  <p className="text-xs text-gray-500">{t.examSimulationDesc}</p>
                </div>
              </div>
            </Link>
            
            {/* Book a Diagnostic */}
            <a 
              href="https://calendly.com/steven-barholere/30min"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
            >
              <div className="flex items-center gap-3 p-3.5 rounded-xl transition-all duration-200 cursor-pointer group hover:scale-[1.01]"
                style={{
                  background: 'linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 100%)',
                  border: '1px solid transparent',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#F97316';
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(249, 115, 22, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'transparent';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div className="w-11 h-11 rounded-xl flex items-center justify-center shadow-sm"
                  style={{ background: 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)' }}
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
            className="px-4 py-3 flex items-center justify-between"
            style={{
              background: '#F9FAFB',
              borderTop: '1px solid #F3F4F6',
            }}
          >
            <span className="text-xs text-gray-500">⚡ {t.poweredBy}</span>
            <span className="text-[10px] text-gray-400">
              <kbd className="px-1.5 py-0.5 rounded bg-gray-200 text-gray-600 font-mono">Esc</kbd> {t.escHint}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
