import { useState, useEffect, useCallback } from "react";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface BackToTopProps {
  /** Scroll threshold in pixels before button appears */
  threshold?: number;
  /** Additional CSS classes */
  className?: string;
}

/**
 * BackToTop — Floating back-to-top button for mobile.
 * Appears after scrolling past threshold.
 * Touch-friendly (48px minimum), WCAG AA accessible.
 */
export default function BackToTop({
  threshold = 400,
  className,
}: BackToTopProps) {
  const [isVisible, setIsVisible] = useState(false);

  const handleScroll = useCallback(() => {
    setIsVisible(window.scrollY > threshold);
  }, [threshold]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      onClick={scrollToTop}
      className={cn(
        "fixed bottom-6 right-6 z-40",
        "h-12 w-12 rounded-full",
        "bg-[var(--brand-foundation,#0F3D3E)] text-white",
        "shadow-lg shadow-black/20",
        "flex items-center justify-center",
        "transition-all duration-300 ease-out",
        "hover:bg-[var(--brand-foundation-2,#145A5B)] hover:shadow-xl hover:-translate-y-0.5",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-foundation)] focus-visible:ring-offset-2",
        "active:scale-95",
        isVisible
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 translate-y-4 pointer-events-none",
        className
      )}
      aria-label="Back to top"
      title="Back to top"
    >
      <ArrowUp className="h-5 w-5" aria-hidden="true" />
    </button>
  );
}
