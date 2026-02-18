/**
 * ============================================
 * PARALLAX COMPONENTS
 * ============================================
 * Lightweight parallax scroll effects for
 * decorative orbs and background layers.
 */
import React, { useRef, useEffect, useState, type ReactNode } from "react";

/* ── Parallax Container ── */
interface ParallaxProps {
  children: ReactNode;
  className?: string;
}

export function Parallax({ children, className = "" }: ParallaxProps) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {children}
    </div>
  );
}

/* ── ParallaxLayer ── */
interface ParallaxLayerProps {
  speed?: number;
  children?: ReactNode;
  className?: string;
}

export function ParallaxLayer({ speed = 0.5, children, className = "" }: ParallaxLayerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    // Respect prefers-reduced-motion
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setOffset(window.scrollY * speed);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [speed]);

  return (
    <div
      ref={ref}
      className={className}
      style={{ transform: `translateY(${offset}px)`, willChange: "transform" }}
      aria-hidden="true"
    >
      {children}
    </div>
  );
}

export default Parallax;
