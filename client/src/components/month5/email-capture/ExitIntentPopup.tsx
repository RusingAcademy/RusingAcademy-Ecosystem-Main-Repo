/**
 * ============================================
 * EXIT-INTENT POPUP — Personalized Messaging
 * ============================================
 * Month 5: Content Strategy & Conversion
 * 
 * Detects exit intent (mouse leaving viewport) and shows
 * a personalized popup based on user behavior/persona.
 * Respects user dismissal with localStorage persistence.
 */
import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePersona } from "@/contexts/month5/PersonaContext";
import { PERSONA_PROFILES } from "@/lib/month5/persona-types";
import { sendGA4Event } from "@/lib/month5/analytics-enhanced";
import { EmailCaptureForm, type LeadMagnet } from "./EmailCaptureForm";
import { X } from "lucide-react";

interface ExitIntentPopupProps {
  /** Delay before popup can trigger (ms) */
  delay?: number;
  /** How many days before showing again after dismissal */
  cooldownDays?: number;
  /** Override lead magnet */
  leadMagnet?: LeadMagnet;
  /** Enable/disable the popup */
  enabled?: boolean;
}

const STORAGE_KEY = "ra_exit_popup_dismissed";

function getPersonaLeadMagnet(personaId: string): LeadMagnet {
  const map: Record<string, LeadMagnet> = {
    "fast-track": "sle-checklist",
    "career-advancement": "level-c-roadmap",
    "second-chance": "sle-checklist",
    "mid-career": "free-assessment",
    "remote": "free-assessment",
    "level-c": "level-c-roadmap",
  };
  return map[personaId] || "sle-checklist";
}

export function ExitIntentPopup({
  delay = 5000,
  cooldownDays = 7,
  leadMagnet,
  enabled = true,
}: ExitIntentPopupProps) {
  const { language } = useLanguage();
  const lang = language === "fr" ? "fr" : "en";
  const { activePersona } = usePersona();
  const persona = PERSONA_PROFILES[activePersona];
  const [isVisible, setIsVisible] = useState(false);
  const canShowRef = useRef(false);
  const hasShownRef = useRef(false);

  // Check if popup was recently dismissed
  const isDismissed = useCallback(() => {
    try {
      const dismissed = localStorage.getItem(STORAGE_KEY);
      if (!dismissed) return false;
      const dismissedDate = new Date(parseInt(dismissed, 10));
      const daysSince = (Date.now() - dismissedDate.getTime()) / (1000 * 60 * 60 * 24);
      return daysSince < cooldownDays;
    } catch {
      return false;
    }
  }, [cooldownDays]);

  // Dismiss handler
  const handleDismiss = useCallback(() => {
    setIsVisible(false);
    hasShownRef.current = true;
    try {
      localStorage.setItem(STORAGE_KEY, String(Date.now()));
    } catch {
      // Storage unavailable
    }
    sendGA4Event("exit_popup_dismissed", { persona: activePersona });
  }, [activePersona]);

  // Success handler
  const handleSuccess = useCallback((email: string) => {
    sendGA4Event("exit_popup_conversion", {
      persona: activePersona,
      email_captured: true,
    });
    // Auto-close after 3 seconds
    setTimeout(() => {
      setIsVisible(false);
      hasShownRef.current = true;
      try {
        localStorage.setItem(STORAGE_KEY, String(Date.now()));
      } catch {
        // noop
      }
    }, 3000);
  }, [activePersona]);

  useEffect(() => {
    if (!enabled || isDismissed()) return;

    // Delay before enabling exit intent detection
    const timer = setTimeout(() => {
      canShowRef.current = true;
    }, delay);

    const handleMouseLeave = (e: MouseEvent) => {
      if (
        canShowRef.current &&
        !hasShownRef.current &&
        e.clientY <= 0 // Mouse left through top of viewport
      ) {
        setIsVisible(true);
        hasShownRef.current = true;
        sendGA4Event("exit_popup_shown", { persona: activePersona });
      }
    };

    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [enabled, delay, isDismissed, activePersona]);

  // Keyboard escape handler
  useEffect(() => {
    if (!isVisible) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleDismiss();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isVisible, handleDismiss]);

  const resolvedLeadMagnet = leadMagnet || getPersonaLeadMagnet(activePersona);

  const headline = lang === "fr"
    ? "Attendez ! Ne partez pas les mains vides."
    : "Wait! Don't leave empty-handed.";
  const subtext = lang === "fr"
    ? `En tant que ${persona.label.fr.toLowerCase()}, cette ressource gratuite a été conçue spécialement pour vous.`
    : `As a ${persona.label.en.toLowerCase()}, this free resource was designed specifically for you.`;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="exit-popup-title"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={handleDismiss}
            aria-hidden="true"
          />

          {/* Popup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="relative bg-white/80 backdrop-blur-2xl rounded-2xl border border-white/40 shadow-2xl max-w-lg w-full overflow-hidden"
          >
            {/* Decorative top gradient */}
            <div className="h-1.5 bg-gradient-to-r from-[var(--brand-foundation)] via-[var(--brand-cta)] to-[var(--brand-foundation)]" aria-hidden="true" />

            {/* Close button */}
            <button
              onClick={handleDismiss}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-[var(--sage-soft)] transition-colors z-10"
              aria-label={lang === "fr" ? "Fermer" : "Close"}
            >
              <X className="w-5 h-5 text-[var(--sage-primary)]" />
            </button>

            <div className="p-8">
              <div className="text-center mb-6">
                <h2
                  id="exit-popup-title"
                  className="text-2xl font-bold text-[var(--brand-foundation)] mb-2"
                >
                  {headline}
                </h2>
                <p className="text-[var(--sage-primary)] text-sm">{subtext}</p>
              </div>

              <EmailCaptureForm
                variant="inline"
                leadMagnet={resolvedLeadMagnet}
                source="exit-intent"
                onSuccess={handleSuccess}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default ExitIntentPopup;
