import { lazy, Suspense } from "react";

// Lazy load Streamdown to isolate KaTeX/mermaid from the main bundle
const StreamdownComponent = lazy(() =>
  import("streamdown").then((mod) => ({
    default: ({ children }: { children: string }) => (
      <mod.Streamdown>{children}</mod.Streamdown>
    ),
  }))
);

interface LazyStreamdownProps {
  children: string;
}

/**
 * LazyStreamdown - A wrapper component that lazy-loads the Streamdown library
 * This prevents KaTeX, mermaid, and other heavy dependencies from being loaded
 * on pages that don't use the AI chat functionality.
 */
export function LazyStreamdown({ children }: LazyStreamdownProps) {
  return (
    <Suspense
      fallback={
        <div className="animate-pulse">
          <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-muted rounded w-1/2"></div>
        </div>
      }
    >
      <StreamdownComponent>{children}</StreamdownComponent>
    </Suspense>
  );
}

export default LazyStreamdown;
