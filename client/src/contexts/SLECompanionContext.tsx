/**
 * SLECompanionContext — Shared state for SLE AI Companion open/close
 * Includes isLoading state for subtle button animation feedback on click.
 */
import { createContext, useContext, useState, useCallback, useRef, type ReactNode } from "react";

interface SLECompanionContextType {
  isOpen: boolean;
  isLoading: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

const SLECompanionContext = createContext<SLECompanionContextType | null>(null);

export function SLECompanionProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const loadingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const safetyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const open = useCallback(() => {
    if (loadingTimerRef.current) clearTimeout(loadingTimerRef.current);
    if (safetyTimerRef.current) clearTimeout(safetyTimerRef.current);
    setIsLoading(true);
    loadingTimerRef.current = setTimeout(() => {
      setIsOpen(true);
      setIsLoading(false);
    }, 600);
    safetyTimerRef.current = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);

  const close = useCallback(() => {
    if (loadingTimerRef.current) clearTimeout(loadingTimerRef.current);
    if (safetyTimerRef.current) clearTimeout(safetyTimerRef.current);
    setIsOpen(false);
    setIsLoading(false);
  }, []);

  const toggle = useCallback(() => {
    setIsOpen((prev) => {
      if (prev) { setIsLoading(false); return false; }
      setIsLoading(true);
      if (loadingTimerRef.current) clearTimeout(loadingTimerRef.current);
      if (safetyTimerRef.current) clearTimeout(safetyTimerRef.current);
      loadingTimerRef.current = setTimeout(() => { setIsOpen(true); setIsLoading(false); }, 600);
      safetyTimerRef.current = setTimeout(() => { setIsLoading(false); }, 2000);
      return prev;
    });
  }, []);

  return (
    <SLECompanionContext.Provider value={{ isOpen, isLoading, open, close, toggle }}>
      {children}
    </SLECompanionContext.Provider>
  );
}

export function useSLECompanion() {
  const ctx = useContext(SLECompanionContext);
  if (!ctx) throw new Error("useSLECompanion must be used within SLECompanionProvider");
  return ctx;
}
