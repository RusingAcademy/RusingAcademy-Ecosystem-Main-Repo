// client/src/hooks/useFeatureFlag.tsx — Phase 4: Feature Flag React integration
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";

interface FeatureFlagContextType {
  isEnabled: (key: string) => boolean;
  isLoading: boolean;
  flags: Record<string, boolean>;
}

const FeatureFlagContext = createContext<FeatureFlagContextType | null>(null);

export function FeatureFlagProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [flags, setFlags] = useState<Record<string, boolean>>({});

  const { data, isLoading } = trpc.featureFlags.getUserFlags.useQuery(undefined, {
    enabled: !!user,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (data) setFlags(data);
  }, [data]);

  const isEnabled = (key: string): boolean => flags[key] ?? false;

  return (
    <FeatureFlagContext.Provider value={{ isEnabled, isLoading, flags }}>
      {children}
    </FeatureFlagContext.Provider>
  );
}

export function useFeatureFlag(key: string): boolean {
  const context = useContext(FeatureFlagContext);
  if (!context) return false;
  return context.isEnabled(key);
}

export function useFeatureFlags(): FeatureFlagContextType {
  const context = useContext(FeatureFlagContext);
  if (!context) throw new Error("useFeatureFlags must be used within FeatureFlagProvider");
  return context;
}

/** Conditional rendering component */
export function Feature({
  flag,
  children,
  fallback = null,
}: {
  flag: string;
  children: ReactNode;
  fallback?: ReactNode;
}) {
  const isEnabled = useFeatureFlag(flag);
  return isEnabled ? <>{children}</> : <>{fallback}</>;
}
