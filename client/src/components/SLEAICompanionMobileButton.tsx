/**
 * SLEAICompanionMobileButton - Floating Fixed Button for Mobile
 * Includes subtle loading animation (accelerated glow + spinner ring) after click.
 */
import { useState, useEffect } from "react";
import { useSLECompanion } from "@/contexts/SLECompanionContext";

const coaches = [
  { id: "steven", name: "Prof. Steven", image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663049070748/WskmZUorLgXKpngz.webp" },
  { id: "sue-anne", name: "Coach Sue-Anne", image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663049070748/hZtrLSSeWYUAuiVy.webp" },
  { id: "erica", name: "Coach Erica", image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663049070748/tWwzEqgGZypQaOHL.webp" },
  { id: "preciosa", name: "Coach Preciosa", image: "https://rusingacademy-cdn.b-cdn.net/images/coaches/Preciosa2.webp" }
];

export default function SLEAICompanionMobileButton() {
  const [currentCoachIndex, setCurrentCoachIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const { open: openCompanion, isLoading } = useSLECompanion();

  useEffect(() => {
    const interval = setInterval(() => { setCurrentCoachIndex((prev) => (prev + 1) % coaches.length); }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      setIsVisible(y <= lastScrollY || y <= 100);
      setLastScrollY(y);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <>
      <div className={`fixed bottom-6 right-6 z-[55] lg:hidden transition-all duration-300 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"}`}>
        <button onClick={() => { if (!isLoading) openCompanion(); }} className="relative group focus:outline-none" aria-label="Open SLE AI Companion" disabled={isLoading}>
          {/* Outer glow — accelerates during loading */}
          <div className="absolute rounded-full" style={{ inset: '-10px', background: 'conic-gradient(from 0deg, #6D28D9, #8B5CF6, #0891B2, #06B6D4, #0891B2, #8B5CF6, #6D28D9)', filter: 'blur(8px)', opacity: isLoading ? 1 : 0.8, animation: isLoading ? 'mobileLoadingGlow 0.8s linear infinite' : 'mobileBreathe 3s ease-in-out infinite' }} />
          {/* Spinner ring — only during loading */}
          {isLoading && (
            <div className="absolute rounded-full" style={{ inset: '-4px', border: '2px solid transparent', borderTopColor: '#8B5CF6', borderRightColor: '#06B6D4', animation: 'mobileSpinner 0.6s linear infinite', zIndex: 5 }} />
          )}
          {/* Main ring */}
          <div className="relative rounded-full" style={{ width: '64px', height: '64px', padding: '3px', background: 'conic-gradient(from 0deg, #6D28D9, #8B5CF6, #0891B2, #06B6D4, #0891B2, #8B5CF6, #6D28D9)', boxShadow: isLoading ? '0 0 30px rgba(109,40,217,0.8), 0 0 60px rgba(8,145,178,0.6), 0 4px 12px rgba(0,0,0,0.3)' : '0 0 20px rgba(109,40,217,0.6), 0 0 40px rgba(8,145,178,0.4), 0 4px 12px rgba(0,0,0,0.3)' }}>
            <div className="w-full h-full rounded-full bg-slate-900/90 backdrop-blur-sm p-[2px] overflow-hidden">
              <div className="relative w-full h-full rounded-full overflow-hidden">
                {coaches.map((coach, index) => (
                  <img loading="lazy" key={coach.id} src={coach.image} alt={coach.name} className="absolute inset-0 w-full h-full object-cover rounded-full" style={{ opacity: index === currentCoachIndex ? (isLoading ? 0.5 : 1) : 0, transition: 'opacity 1s ease-in-out', filter: isLoading ? 'brightness(0.6)' : 'none' }} />
                ))}
                {isLoading && <div className="absolute inset-0 rounded-full" style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.3) 0%, rgba(6,182,212,0.2) 100%)', animation: 'mobileLoadingPulse 0.8s ease-in-out infinite' }} />}
              </div>
            </div>
          </div>
          {/* Online indicator — hidden during loading */}
          {!isLoading && (
            <div className="absolute flex items-center justify-center z-10" style={{ bottom: '2px', right: '2px' }}>
              <span className="absolute rounded-full" style={{ width: '14px', height: '14px', backgroundColor: '#10B981', opacity: 0.6, animation: 'ping 1.5s cubic-bezier(0,0,0.2,1) infinite' }} />
              <span className="relative rounded-full" style={{ width: '10px', height: '10px', backgroundColor: '#10B981', border: '2px solid #1e1b4b', boxShadow: '0 0 8px rgba(16,185,129,0.6)' }} />
            </div>
          )}
        </button>
      </div>
      <style>{`
        @keyframes mobileBreathe { 0%, 100% { transform: scale(1); opacity: 0.6; } 50% { transform: scale(1.08); opacity: 0.9; } }
        @keyframes mobileLoadingGlow { 0% { transform: scale(1) rotate(0deg); opacity: 0.8; } 50% { transform: scale(1.12) rotate(180deg); opacity: 1; } 100% { transform: scale(1) rotate(360deg); opacity: 0.8; } }
        @keyframes mobileSpinner { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes mobileLoadingPulse { 0%, 100% { opacity: 0.3; } 50% { opacity: 0.6; } }
        @keyframes ping { 75%, 100% { transform: scale(2); opacity: 0; } }
      `}</style>
    </>
  );
}
