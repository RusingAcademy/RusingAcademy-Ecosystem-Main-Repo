import { motion } from "framer-motion";

interface BarholexLogoProps {
  size?: number;
  showText?: boolean;
  theme?: "glass" | "light";
  className?: string;
}

/**
 * Premium Barholex Media Logo with Glassmorphism Effects
 * Brand colors: Gold/Amber gradient (#D4A853 to #B8860B)
 */
export default function BarholexLogo({ 
  size = 60, 
  showText = true, 
  theme = "glass",
  className = "" 
}: BarholexLogoProps) {
  const textColor = theme === "glass" ? "#D4A853" : "#B8860B";
  const glowColor = "rgba(212, 168, 83, 0.4)";
  
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
            {/* Gold gradient for the B */}
            <linearGradient id="barholexGoldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F5D78E" />
              <stop offset="30%" stopColor="#D4A853" />
              <stop offset="70%" stopColor="#B8860B" />
              <stop offset="100%" stopColor="#8B6914" />
            </linearGradient>
            
            {/* Metallic shine gradient */}
            <linearGradient id="barholexShine" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(255,255,255,0)" />
              <stop offset="40%" stopColor="rgba(255,255,255,0.3)" />
              <stop offset="50%" stopColor="rgba(255,255,255,0.5)" />
              <stop offset="60%" stopColor="rgba(255,255,255,0.3)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0)" />
            </linearGradient>
            
            {/* Glow filter */}
            <filter id="barholexGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            
            {/* Inner shadow for depth */}
            <filter id="barholexInnerShadow" x="-50%" y="-50%" width="200%" height="200%">
              <feComponentTransfer in="SourceAlpha">
                <feFuncA type="table" tableValues="1 0"/>
              </feComponentTransfer>
              <feGaussianBlur stdDeviation="2"/>
              <feOffset dx="1" dy="2" result="offsetblur"/>
              <feFlood floodColor="#5C4A1F" floodOpacity="0.5"/>
              <feComposite in2="offsetblur" operator="in"/>
              <feMerge>
                <feMergeNode/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          {/* Glassmorphism background circle */}
          <circle
            cx="50"
            cy="50"
            r="48"
            fill={theme === "glass" ? "rgba(30, 30, 30, 0.6)" : "rgba(255, 255, 255, 0.8)"}
            stroke="url(#barholexGoldGradient)"
            strokeWidth="1.5"
            style={{ backdropFilter: "blur(10px)" }}
          />
          
          {/* B letter with play button integrated */}
          <g filter="url(#barholexGlow)">
            {/* Main B shape */}
            <path
              d="M25 20 L25 80 L45 80 C60 80 70 72 70 62 C70 54 64 48 55 46 L55 46 C62 44 67 38 67 30 C67 22 58 20 45 20 L25 20 Z M35 28 L45 28 C52 28 57 30 57 36 C57 42 52 44 45 44 L35 44 L35 28 Z M35 52 L45 52 C54 52 60 55 60 62 C60 69 54 72 45 72 L35 72 L35 52 Z"
              fill="url(#barholexGoldGradient)"
              filter="url(#barholexInnerShadow)"
            />
            
            {/* Play button triangle inside B */}
            <path
              d="M40 38 L52 50 L40 62 Z"
              fill={theme === "glass" ? "#1a1a1a" : "#ffffff"}
              opacity="0.9"
            />
          </g>
          
          {/* Shine overlay */}
          <ellipse
            cx="45"
            cy="35"
            rx="20"
            ry="12"
            fill="url(#barholexShine)"
            opacity="0.4"
          />
          
          {/* Premium reflection line */}
          <line
            x1="30"
            y1="25"
            x2="55"
            y2="25"
            stroke="rgba(255,255,255,0.3)"
            strokeWidth="1"
            strokeLinecap="round"
          />
        </svg>
      </div>
      
      {/* Text with premium styling */}
      {showText && (
        <div className="flex flex-col">
          <span 
            className="font-bold tracking-wider text-lg leading-tight"
            style={{ 
              background: "linear-gradient(135deg, #F5D78E 0%, #D4A853 30%, #B8860B 70%, #8B6914 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              textShadow: theme === "glass" ? "0 2px 10px rgba(212, 168, 83, 0.3)" : "none",
            }}
          >
            BARHOLEX
          </span>
          <span 
            className="text-xs tracking-[0.3em] font-medium"
            style={{ 
              color: theme === "glass" ? "rgba(212, 168, 83, 0.7)" : "#B8860B",
            }}
          >
            MEDIA
          </span>
        </div>
      )}
    </motion.div>
  );
}
