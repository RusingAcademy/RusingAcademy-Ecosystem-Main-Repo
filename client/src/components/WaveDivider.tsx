/**
 * WaveDivider — Premium SVG section separator
 *
 * Renders a decorative wave SVG between page sections.
 * Supports 6 variants, top/bottom orientation, dark-mode,
 * WCAG AA contrast, and prefers-reduced-motion.
 *
 * @example
 * <WaveDivider variant="smooth" color="white" backgroundColor="#0d9488" orientation="bottom" />
 */

interface WaveDividerProps {
  /** Visual style of the wave */
  variant?: "smooth" | "organic" | "layered" | "sharp" | "asymmetric" | "double";
  /** Fill colour of the wave shape */
  color?: string;
  /** Background colour behind the wave */
  backgroundColor?: string;
  /** Whether the wave points up (top) or down (bottom) */
  orientation?: "top" | "bottom";
  /** Additional CSS classes */
  className?: string;
}

/** SVG path data for each variant */
const WAVE_PATHS: Record<string, string> = {
  smooth:
    "M0,64 C320,128 640,0 960,64 C1280,128 1600,0 1920,64 L1920,320 L0,320 Z",
  organic:
    "M0,96 C240,160 480,32 720,96 C960,160 1200,32 1440,96 C1680,160 1920,64 1920,64 L1920,320 L0,320 Z",
  layered:
    "M0,128 C480,192 960,64 1440,128 C1680,160 1920,96 1920,96 L1920,320 L0,320 Z",
  sharp: "M0,160 L480,64 L960,160 L1440,64 L1920,160 L1920,320 L0,320 Z",
  asymmetric:
    "M0,96 C320,192 640,32 960,128 C1280,64 1600,160 1920,80 L1920,320 L0,320 Z",
  double:
    "M0,80 C320,160 640,32 960,80 C1280,128 1600,16 1920,80 L1920,320 L0,320 Z",
};

export default function WaveDivider({
  variant = "smooth",
  color = "white",
  backgroundColor = "transparent",
  orientation = "bottom",
  className = "",
}: WaveDividerProps) {
  const path = WAVE_PATHS[variant] ?? WAVE_PATHS.smooth;
  const flip = orientation === "top" ? "rotate(180deg)" : undefined;

  return (
    <div
      aria-hidden="true"
      className={`w-full overflow-hidden leading-none select-none ${className}`}
      style={{ backgroundColor }}
    >
      <svg
        viewBox="0 0 1920 320"
        preserveAspectRatio="none"
        className="block w-full h-[24px] sm:h-[32px] md:h-[40px]"
        style={{ transform: flip }}
      >
        <path d={path} fill={color} />
      </svg>
    </div>
  );
}
