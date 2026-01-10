import { motion } from "framer-motion";

interface RusingAcademyLogoProps {
  size?: number;
  showText?: boolean;
  theme?: "glass" | "light";
  className?: string;
}

/**
 * Premium RusingÂcademy Logo with Glassmorphism Effects
 * Based on the official "R" with speech bubble design
 * Brand colors: Teal (#1E9B8A / #0D8A7C) and Orange (#F7941D)
 */
export default function RusingAcademyLogo({ 
  size = 60, 
  showText = true, 
  theme = "glass",
  className = "" 
}: RusingAcademyLogoProps) {
  const glowColor = "rgba(30, 155, 138, 0.4)";
  
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
            {/* Teal gradient for the R */}
            <linearGradient id="rusingTealGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2BB5A3" />
              <stop offset="30%" stopColor="#1E9B8A" />
              <stop offset="70%" stopColor="#0D8A7C" />
              <stop offset="100%" stopColor="#077A6D" />
            </linearGradient>
            
            {/* Orange accent gradient */}
            <linearGradient id="rusingOrangeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFAA33" />
              <stop offset="50%" stopColor="#F7941D" />
              <stop offset="100%" stopColor="#E5850A" />
            </linearGradient>
            
            {/* Metallic shine gradient */}
            <linearGradient id="rusingShine" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(255,255,255,0)" />
              <stop offset="40%" stopColor="rgba(255,255,255,0.25)" />
              <stop offset="50%" stopColor="rgba(255,255,255,0.4)" />
              <stop offset="60%" stopColor="rgba(255,255,255,0.25)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0)" />
            </linearGradient>
            
            {/* Glow filter */}
            <filter id="rusingGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            
            {/* Inner shadow for depth */}
            <filter id="rusingInnerShadow" x="-50%" y="-50%" width="200%" height="200%">
              <feComponentTransfer in="SourceAlpha">
                <feFuncA type="table" tableValues="1 0"/>
              </feComponentTransfer>
              <feGaussianBlur stdDeviation="1.5"/>
              <feOffset dx="1" dy="2" result="offsetblur"/>
              <feFlood floodColor="#055A50" floodOpacity="0.4"/>
              <feComposite in2="offsetblur" operator="in"/>
              <feMerge>
                <feMergeNode/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          {/* Glassmorphism background - rounded square with orange bg for glass theme */}
          <rect
            x="5"
            y="5"
            width="90"
            height="90"
            rx="18"
            fill={theme === "glass" ? "rgba(30, 155, 138, 0.15)" : "rgba(247, 148, 29, 0.1)"}
            stroke={theme === "glass" ? "url(#rusingTealGradient)" : "url(#rusingOrangeGradient)"}
            strokeWidth="2"
          />
          
          {/* The R letter with integrated speech bubble */}
          <g filter="url(#rusingGlow)">
            {/* Main R shape - stylized with speech bubble cutout */}
            <path
              d="M22 15 L22 85 L35 85 L35 58 L42 58 L58 85 L74 85 L56 55 
                 C68 52 78 42 78 28 C78 15 68 15 50 15 L22 15 Z
                 M35 25 L50 25 C60 25 65 28 65 35 C65 42 60 46 50 46 L35 46 L35 25 Z"
              fill="url(#rusingTealGradient)"
              filter="url(#rusingInnerShadow)"
            />
            
            {/* Speech bubble cutout inside the R (the curved part) */}
            <path
              d="M38 30 C38 28 40 26 44 26 L52 26 C56 26 58 28 58 32 
                 C58 36 56 38 52 38 L44 38 C42 38 40 40 40 42 L38 42 L38 30 Z"
              fill={theme === "glass" ? "#080a14" : "#F4F6F9"}
              opacity="0.9"
            />
            
            {/* Small speech bubble tail */}
            <path
              d="M38 38 L32 48 L38 44 Z"
              fill={theme === "glass" ? "#080a14" : "#F4F6F9"}
              opacity="0.9"
            />
          </g>
          
          {/* Shine overlay on the R */}
          <ellipse
            cx="48"
            cy="32"
            rx="18"
            ry="10"
            fill="url(#rusingShine)"
            opacity="0.35"
          />
          
          {/* Premium reflection line */}
          <line
            x1="28"
            y1="20"
            x2="55"
            y2="20"
            stroke="rgba(255,255,255,0.25)"
            strokeWidth="1"
            strokeLinecap="round"
          />
        </svg>
      </div>
      
      {/* Text with premium styling */}
      {showText && (
        <div className="flex flex-col">
          <span 
            className="font-bold tracking-wide text-lg leading-tight"
            style={{ 
              background: "linear-gradient(135deg, #2BB5A3 0%, #1E9B8A 30%, #0D8A7C 70%, #077A6D 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              textShadow: theme === "glass" ? "0 2px 10px rgba(30, 155, 138, 0.3)" : "none",
            }}
          >
            RusingÂcademy
          </span>
          <span 
            className="text-xs tracking-[0.2em] font-medium"
            style={{ 
              color: theme === "glass" ? "rgba(247, 148, 29, 0.9)" : "#F7941D",
            }}
          >
            PATH SERIES™
          </span>
        </div>
      )}
    </motion.div>
  );
}
