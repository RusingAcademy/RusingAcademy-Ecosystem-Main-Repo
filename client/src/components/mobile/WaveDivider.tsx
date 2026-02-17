import { cn } from "@/lib/utils";

type WaveVariant = "soft" | "sharp" | "organic" | "double";
type WaveDirection = "top" | "bottom";

interface WaveDividerProps {
  /** Color of the wave fill — use CSS variable or hex */
  fillColor?: string;
  /** Background behind the wave */
  bgColor?: string;
  /** Wave shape variant */
  variant?: WaveVariant;
  /** Whether wave appears at top or bottom of a section */
  direction?: WaveDirection;
  /** Additional CSS classes */
  className?: string;
  /** Height of the wave in pixels */
  height?: number;
}

const wavePaths: Record<WaveVariant, string> = {
  soft: "M0,64 C320,128 640,0 960,64 C1280,128 1600,0 1920,64 L1920,0 L0,0 Z",
  sharp: "M0,96 L480,32 L960,96 L1440,32 L1920,96 L1920,0 L0,0 Z",
  organic: "M0,64 C160,96 320,32 480,64 C640,96 800,32 960,48 C1120,64 1280,96 1440,48 C1600,0 1760,80 1920,64 L1920,0 L0,0 Z",
  double: "M0,48 C240,96 480,16 720,48 C960,80 1200,16 1440,48 C1680,80 1920,32 1920,48 L1920,0 L0,0 Z",
};

/**
 * WaveDivider — Organic SVG wave divider between sections.
 * Inspired by MgCréa's premium section transitions.
 * Adapts to any color scheme via CSS variables.
 */
export default function WaveDivider({
  fillColor = "var(--bg, #F7F6F3)",
  bgColor = "transparent",
  variant = "organic",
  direction = "bottom",
  className,
  height = 64,
}: WaveDividerProps) {
  const isFlipped = direction === "top";

  return (
    <div
      className={cn(
        "w-full overflow-hidden leading-[0] pointer-events-none select-none",
        isFlipped && "rotate-180",
        className
      )}
      style={{ backgroundColor: bgColor }}
      aria-hidden="true"
      role="presentation"
    >
      <svg
        viewBox="0 0 1920 128"
        preserveAspectRatio="none"
        className="w-full block"
        style={{ height: `${height}px` }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d={wavePaths[variant]} fill={fillColor} />
      </svg>
    </div>
  );
}

/** Pre-configured wave dividers for common transitions */
export function WaveLightToDark({ className }: { className?: string }) {
  return (
    <WaveDivider
      fillColor="var(--brand-obsidian, #062b2b)"
      bgColor="var(--bg, #F7F6F3)"
      variant="organic"
      className={className}
    />
  );
}

export function WaveDarkToLight({ className }: { className?: string }) {
  return (
    <WaveDivider
      fillColor="var(--bg, #F7F6F3)"
      bgColor="var(--brand-obsidian, #062b2b)"
      variant="organic"
      className={className}
    />
  );
}

export function WaveSandToWhite({ className }: { className?: string }) {
  return (
    <WaveDivider
      fillColor="var(--surface, #FFFFFF)"
      bgColor="var(--sand, #EEE9DF)"
      variant="soft"
      className={className}
    />
  );
}
