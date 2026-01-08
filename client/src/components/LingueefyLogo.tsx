import React from 'react';

interface LingueefyLogoProps {
  className?: string;
  width?: number | string;
  height?: number | string;
  variant?: 'full' | 'icon' | 'text';
  glassEffect?: boolean;
}

export const LingueefyLogo: React.FC<LingueefyLogoProps> = ({
  className = '',
  width = 'auto',
  height = 48,
  variant = 'full',
  glassEffect = false,
}) => {
  const tealColor = '#0d9488';
  const tealLight = '#14b8a6';
  
  // Glass effect filter
  const glassFilter = glassEffect ? (
    <defs>
      <filter id="glass-blur" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="1" />
      </filter>
      <linearGradient id="glass-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor={tealColor} stopOpacity="0.9" />
        <stop offset="50%" stopColor={tealLight} stopOpacity="0.95" />
        <stop offset="100%" stopColor={tealColor} stopOpacity="0.9" />
      </linearGradient>
      <filter id="glass-shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor={tealColor} floodOpacity="0.25" />
      </filter>
    </defs>
  ) : (
    <defs>
      <linearGradient id="teal-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor={tealColor} />
        <stop offset="100%" stopColor={tealLight} />
      </linearGradient>
    </defs>
  );

  // Icon only (speech bubble with maple leaf)
  if (variant === 'icon') {
    return (
      <svg
        width={width}
        height={height}
        viewBox="0 0 60 60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        {glassFilter}
        {/* Speech bubble */}
        <path
          d="M30 5C16.2 5 5 14.5 5 26.5C5 33.5 8.5 39.5 14 43.5L10 55L24 47C26 47.3 28 47.5 30 47.5C43.8 47.5 55 38 55 26C55 14 43.8 5 30 5Z"
          fill={glassEffect ? "url(#glass-gradient)" : tealColor}
          filter={glassEffect ? "url(#glass-shadow)" : undefined}
        />
        {/* Maple leaf */}
        <path
          d="M30 15L32 20L37 18L35 23L40 25L35 27L37 32L32 30L30 35L28 30L23 32L25 27L20 25L25 23L23 18L28 20L30 15Z"
          fill="white"
        />
      </svg>
    );
  }

  // Text only
  if (variant === 'text') {
    return (
      <svg
        width={width}
        height={height}
        viewBox="0 0 200 50"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        {glassFilter}
        <text
          x="100"
          y="35"
          textAnchor="middle"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontSize="32"
          fontWeight="600"
          fill={glassEffect ? "url(#glass-gradient)" : tealColor}
        >
          Lingueefy
        </text>
      </svg>
    );
  }

  // Full logo (speech bubble with text inside)
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 280 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Lingueefy Logo"
    >
      {glassFilter}
      
      {/* Speech bubble outline */}
      <path
        d="M140 8C85 8 40 28 40 52C40 65 52 76 70 82L60 95L85 85C100 88 120 90 140 90C195 90 240 70 240 46C240 22 195 8 140 8Z"
        fill="none"
        stroke={glassEffect ? "url(#glass-gradient)" : tealColor}
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter={glassEffect ? "url(#glass-shadow)" : undefined}
      />
      
      {/* Lingueefy text */}
      <text
        x="140"
        y="58"
        textAnchor="middle"
        fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
        fontSize="28"
        fontWeight="600"
        letterSpacing="-0.5"
        fill={glassEffect ? "url(#glass-gradient)" : tealColor}
      >
        Lingueefy
      </text>
      
      {/* Maple leaf above the "ee" */}
      <g transform="translate(158, 22)">
        <path
          d="M8 0L9.5 4L13 3L11.5 6.5L15 8L11.5 9.5L13 13L9.5 11.5L8 16L6.5 11.5L3 13L4.5 9.5L1 8L4.5 6.5L3 3L6.5 4L8 0Z"
          fill={glassEffect ? "url(#glass-gradient)" : tealColor}
        />
      </g>
    </svg>
  );
};

// Animated version with hover effects
export const LingueefyLogoAnimated: React.FC<LingueefyLogoProps> = (props) => {
  return (
    <div className="group transition-transform duration-300 hover:scale-105">
      <LingueefyLogo {...props} />
    </div>
  );
};

export default LingueefyLogo;
