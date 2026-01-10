import { motion } from "framer-motion";

interface LingeefyLogoProps {
  size?: number;
  showText?: boolean;
  theme?: "glass" | "light";
  className?: string;
}

/**
 * Premium Lingueefy Logo with Glassmorphism Effects
 * Brand colors: Teal gradient (#17E2C6 to #0d9488)
 */
export default function LingeefyLogo({ 
  size = 60, 
  showText = true, 
  theme = "glass",
  className = "" 
}: LingeefyLogoProps) {
  const glowColor = "rgba(23, 226, 198, 0.4)";
  
  return (
    <motion.div 
      className={`flex items-center gap-3 ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Icon with glassmorphism */}
      <div 
        className="relative"
        style={{ 
          filter: `drop-shadow(0 4px 20px ${glowColor})`,
        }}
      >
        <svg
          width={size}
          height={size}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Definitions for gradients and effects */}
          <defs>
            {/* Teal gradient */}
            <linearGradient id="lingeefyTealGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2DD4BF" />
              <stop offset="50%" stopColor="#17E2C6" />
              <stop offset="100%" stopColor="#0d9488" />
            </linearGradient>
            
            {/* Shine gradient */}
            <linearGradient id="lingeefyShine" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(255,255,255,0)" />
              <stop offset="50%" stopColor="rgba(255,255,255,0.5)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0)" />
            </linearGradient>
            
            {/* Glow filter */}
            <filter id="lingeefyGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            
            {/* Inner shadow */}
            <filter id="lingeefyInnerShadow">
              <feOffset dx="0" dy="2"/>
              <feGaussianBlur stdDeviation="2" result="offset-blur"/>
              <feComposite operator="out" in="SourceGraphic" in2="offset-blur" result="inverse"/>
              <feFlood floodColor="#065f53" floodOpacity="0.3" result="color"/>
              <feComposite operator="in" in="color" in2="inverse" result="shadow"/>
              <feComposite operator="over" in="shadow" in2="SourceGraphic"/>
            </filter>
          </defs>
          
          {/* Glassmorphism speech bubble background */}
          <g filter="url(#lingeefyGlow)">
            {/* Main speech bubble */}
            <path
              d="M15 25 C15 15 25 8 50 8 C75 8 85 15 85 25 L85 55 C85 65 75 72 50 72 L35 72 L25 85 L25 72 C20 72 15 65 15 55 Z"
              fill={theme === "glass" ? "rgba(23, 226, 198, 0.15)" : "rgba(23, 226, 198, 0.1)"}
              stroke="url(#lingeefyTealGradient)"
              strokeWidth="2.5"
            />
            
            {/* Inner glow */}
            <path
              d="M20 28 C20 20 28 14 50 14 C72 14 80 20 80 28 L80 52 C80 60 72 66 50 66 L38 66 L30 76 L30 66 C25 66 20 60 20 52 Z"
              fill={theme === "glass" ? "rgba(23, 226, 198, 0.1)" : "rgba(23, 226, 198, 0.05)"}
            />
          </g>
          
          {/* Chat lines representing language/conversation */}
          <g>
            <rect
              x="28"
              y="28"
              width="35"
              height="6"
              rx="3"
              fill="url(#lingeefyTealGradient)"
              opacity="0.9"
            />
            <rect
              x="28"
              y="40"
              width="44"
              height="6"
              rx="3"
              fill="url(#lingeefyTealGradient)"
              opacity="0.7"
            />
            <rect
              x="28"
              y="52"
              width="28"
              height="6"
              rx="3"
              fill="url(#lingeefyTealGradient)"
              opacity="0.5"
            />
          </g>
          
          {/* Canadian maple leaf accent */}
          <g transform="translate(62, 22) scale(0.35)">
            <path
              d="M50 0 L55 20 L75 15 L60 30 L80 35 L55 45 L60 70 L50 55 L40 70 L45 45 L20 35 L40 30 L25 15 L45 20 Z"
              fill="url(#lingeefyTealGradient)"
              opacity="0.8"
            />
          </g>
          
          {/* Shine overlay */}
          <ellipse
            cx="50"
            cy="30"
            rx="30"
            ry="12"
            fill="url(#lingeefyShine)"
            opacity="0.25"
          />
        </svg>
      </div>
      
      {/* Text with premium styling */}
      {showText && (
        <div className="flex flex-col">
          <span 
            className="font-black tracking-wide text-lg leading-tight"
            style={{ 
              background: "linear-gradient(135deg, #2DD4BF 0%, #17E2C6 50%, #0d9488 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              textShadow: theme === "glass" ? "0 2px 10px rgba(23, 226, 198, 0.3)" : "none",
            }}
          >
            Lingueefy
          </span>
          <span 
            className="text-xs tracking-wider font-medium"
            style={{ 
              color: theme === "glass" ? "rgba(45, 212, 191, 0.8)" : "#0d9488",
            }}
          >
            1-on-1 Coaching
          </span>
        </div>
      )}
    </motion.div>
  );
}
