/**
 * SLECompanionContext — Shared state for SLE AI Companion open/close
 * 
 * This context replaces the custom DOM event approach (openSLEAICompanion)
 * with a React-native state management pattern. This ensures the MobileButton
 * can reliably open the Widget modal regardless of render cycles or HMR.
 */
import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

interface SLECompanionContextType {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

const SLECompanionContext = createContext<SLECompanionContextType | null>(null);

export function SLECompanionProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

  return (
    <SLECompanionContext.Provider value={{ isOpen, open, close, toggle }}>
      {children}
    </SLECompanionContext.Provider>
  );
}

export function useSLECompanion() {
  const ctx = useContext(SLECompanionContext);
  if (!ctx) {
    throw new Error("useSLECompanion must be used within SLECompanionProvider");
  }
  return ctx;
}
