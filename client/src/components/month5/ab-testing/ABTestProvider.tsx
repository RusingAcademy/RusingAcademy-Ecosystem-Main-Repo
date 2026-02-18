/**
 * ============================================
 * A/B TEST PROVIDER & COMPONENT
 * ============================================
 * Month 5: Content Strategy & Conversion
 * 
 * React context and component for declarative A/B testing.
 * Usage:
 *   <ABTest experimentId="hero-cta-text">
 *     <ABTest.Variant id="control">
 *       <Button>Book Your Free Assessment</Button>
 *     </ABTest.Variant>
 *     <ABTest.Variant id="variant-a">
 *       <Button>Start Your SLE Journey Today</Button>
 *     </ABTest.Variant>
 *   </ABTest>
 */
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  type ReactNode,
} from "react";
import {
  EXPERIMENTS,
  getVariantAssignment,
  trackABImpression,
  trackABConversion,
  type VariantId,
  type ABExperiment,
} from "@/lib/month5/ab-testing-engine";

// ─── CONTEXT ─────────────────────────────────────────────────────────────────

interface ABTestContextValue {
  getVariant: (experimentId: string) => VariantId;
  trackConversion: (experimentId: string, goal: string, metadata?: Record<string, unknown>) => void;
  isExperimentRunning: (experimentId: string) => boolean;
}

const ABTestCtx = createContext<ABTestContextValue | null>(null);

export function ABTestProvider({ children }: { children: ReactNode }) {
  const value = useMemo<ABTestContextValue>(() => ({
    getVariant: (experimentId: string) => {
      const experiment = EXPERIMENTS.find(e => e.id === experimentId);
      if (!experiment) return "control";
      return getVariantAssignment(experiment);
    },
    trackConversion: (experimentId: string, goal: string, metadata?: Record<string, unknown>) => {
      trackABConversion(experimentId, goal, metadata);
    },
    isExperimentRunning: (experimentId: string) => {
      const experiment = EXPERIMENTS.find(e => e.id === experimentId);
      return experiment?.status === "running";
    },
  }), []);

  return (
    <ABTestCtx.Provider value={value}>
      {children}
    </ABTestCtx.Provider>
  );
}

export function useABTest() {
  const ctx = useContext(ABTestCtx);
  if (!ctx) {
    return {
      getVariant: () => "control" as VariantId,
      trackConversion: () => {},
      isExperimentRunning: () => false,
    };
  }
  return ctx;
}

// ─── DECLARATIVE COMPONENT ───────────────────────────────────────────────────

interface ABTestProps {
  experimentId: string;
  children: ReactNode;
  fallback?: ReactNode;
}

interface ABVariantProps {
  id: VariantId;
  children: ReactNode;
}

function ABVariant({ children }: ABVariantProps) {
  return <>{children}</>;
}

function ABTestComponent({ experimentId, children, fallback }: ABTestProps) {
  const { getVariant, isExperimentRunning } = useABTest();
  const activeVariant = getVariant(experimentId);

  // Track impression on mount
  useEffect(() => {
    if (isExperimentRunning(experimentId)) {
      trackABImpression(experimentId);
    }
  }, [experimentId, isExperimentRunning]);

  // Find the matching variant child
  const childArray = Array.isArray(children) ? children : [children];
  const matchingChild = childArray.find((child: any) => {
    return child?.props?.id === activeVariant;
  });

  // If experiment is not running, show control or fallback
  if (!isExperimentRunning(experimentId)) {
    const controlChild = childArray.find((child: any) => child?.props?.id === "control");
    return <>{controlChild || fallback || childArray[0]}</>;
  }

  return <>{matchingChild || fallback || childArray[0]}</>;
}

// Attach Variant as a static property
export const ABTest = Object.assign(ABTestComponent, { Variant: ABVariant });

// ─── HOOK FOR PROGRAMMATIC USE ───────────────────────────────────────────────

export function useExperimentVariant(experimentId: string): {
  variant: VariantId;
  isRunning: boolean;
  trackConversion: (goal: string, metadata?: Record<string, unknown>) => void;
} {
  const { getVariant, trackConversion, isExperimentRunning } = useABTest();

  useEffect(() => {
    if (isExperimentRunning(experimentId)) {
      trackABImpression(experimentId);
    }
  }, [experimentId, isExperimentRunning]);

  return {
    variant: getVariant(experimentId),
    isRunning: isExperimentRunning(experimentId),
    trackConversion: (goal: string, metadata?: Record<string, unknown>) => {
      trackConversion(experimentId, goal, metadata);
    },
  };
}

export default ABTest;
