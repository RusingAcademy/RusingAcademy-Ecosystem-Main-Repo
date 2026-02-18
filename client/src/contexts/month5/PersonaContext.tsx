/**
 * ============================================
 * PERSONA CONTEXT — Dynamic User Journey State
 * ============================================
 * Month 5: Content Strategy & Conversion
 * 
 * Manages persona detection, selection, and dynamic content adaptation.
 * Persists user persona preference in localStorage for return visits.
 */
import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import {
  type PersonaId,
  type UserBehaviorSignals,
  detectPersona,
  PERSONA_PROFILES,
} from "@/lib/month5/persona-types";

interface PersonaContextValue {
  activePersona: PersonaId;
  setActivePersona: (id: PersonaId) => void;
  isAutoDetected: boolean;
  behaviorSignals: Partial<UserBehaviorSignals>;
  recordPageVisit: (path: string) => void;
  recordClick: (elementId: string) => void;
  recordSearch: (term: string) => void;
  getPersonaProfile: () => typeof PERSONA_PROFILES[PersonaId];
}

const PersonaCtx = createContext<PersonaContextValue | null>(null);

const STORAGE_KEY = "ra_persona_preference";
const SIGNALS_KEY = "ra_behavior_signals";

export function PersonaProvider({ children }: { children: ReactNode }) {
  const [activePersona, setActivePersonaState] = useState<PersonaId>("deadline-driven");
  const [isAutoDetected, setIsAutoDetected] = useState(false);
  const [signals, setSignals] = useState<Partial<UserBehaviorSignals>>({
    pageVisits: [],
    clickedElements: [],
    searchTerms: [],
    timeOnSite: 0,
    returnVisitor: false,
  });

  // Load saved persona and signals on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && PERSONA_PROFILES[saved as PersonaId]) {
        setActivePersonaState(saved as PersonaId);
        return;
      }

      const savedSignals = localStorage.getItem(SIGNALS_KEY);
      if (savedSignals) {
        const parsed = JSON.parse(savedSignals);
        parsed.returnVisitor = true;
        setSignals(parsed);
        const detected = detectPersona(parsed as UserBehaviorSignals);
        setActivePersonaState(detected);
        setIsAutoDetected(true);
      }
    } catch {
      // Silently fail — use default persona
    }
  }, []);

  // Track time on site
  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      setSignals(prev => ({
        ...prev,
        timeOnSite: Math.floor((Date.now() - startTime) / 1000),
      }));
    }, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  // Persist signals periodically
  useEffect(() => {
    const timeout = setTimeout(() => {
      try {
        localStorage.setItem(SIGNALS_KEY, JSON.stringify(signals));
      } catch {
        // Storage full or unavailable
      }
    }, 5000);
    return () => clearTimeout(timeout);
  }, [signals]);

  const setActivePersona = useCallback((id: PersonaId) => {
    setActivePersonaState(id);
    setIsAutoDetected(false);
    try {
      localStorage.setItem(STORAGE_KEY, id);
    } catch {
      // Storage unavailable
    }
  }, []);

  const recordPageVisit = useCallback((path: string) => {
    setSignals(prev => ({
      ...prev,
      pageVisits: [...new Set([...(prev.pageVisits || []), path])],
    }));
  }, []);

  const recordClick = useCallback((elementId: string) => {
    setSignals(prev => ({
      ...prev,
      clickedElements: [...new Set([...(prev.clickedElements || []), elementId])],
    }));
  }, []);

  const recordSearch = useCallback((term: string) => {
    setSignals(prev => ({
      ...prev,
      searchTerms: [...new Set([...(prev.searchTerms || []), term])],
    }));
  }, []);

  const getPersonaProfile = useCallback(() => {
    return PERSONA_PROFILES[activePersona];
  }, [activePersona]);

  return (
    <PersonaCtx.Provider
      value={{
        activePersona,
        setActivePersona,
        isAutoDetected,
        behaviorSignals: signals,
        recordPageVisit,
        recordClick,
        recordSearch,
        getPersonaProfile,
      }}
    >
      {children}
    </PersonaCtx.Provider>
  );
}

export function usePersona() {
  const ctx = useContext(PersonaCtx);
  if (!ctx) {
    // Return a safe default when used outside provider
    return {
      activePersona: "deadline-driven" as PersonaId,
      setActivePersona: () => {},
      isAutoDetected: false,
      behaviorSignals: {},
      recordPageVisit: () => {},
      recordClick: () => {},
      recordSearch: () => {},
      getPersonaProfile: () => PERSONA_PROFILES["deadline-driven"],
    };
  }
  return ctx;
}
