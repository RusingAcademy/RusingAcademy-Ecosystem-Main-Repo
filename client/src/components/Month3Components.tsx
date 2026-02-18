import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

/**
 * Month 3 Premium Components
 * These components leverage Month 1 design tokens and Month 2 animation classes
 * to provide a consistent "Premium" look across the redesign.
 */

// Glassmorphic Card with floating effect and dynamic hover
export const PremiumCard = ({ 
  children, 
  className, 
  delay = 0,
  hoverEffect = true 
}: { 
  children: React.ReactNode; 
  className?: string; 
  delay?: number;
  hoverEffect?: boolean;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, delay }}
    className={cn(
      "glass-card-interactive floating-card-month2 rounded-2xl overflow-hidden",
      hoverEffect && "hover:shadow-2xl transition-all duration-500",
      className
    )}
  >
    {children}
  </motion.div>
);

// Animated Counter for statistics
export const AnimatedCounter = ({ 
  value, 
  suffix = "", 
  label 
}: { 
  value: number; 
  suffix?: string; 
  label: string;
}) => {
  const [count, setCount] = React.useState(0);
  const countRef = React.useRef(0);
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    if (!isVisible) return;
    
    let start = 0;
    const end = value;
    const duration = 2000;
    const increment = end / (duration / 16);
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    
    return () => clearInterval(timer);
  }, [value, isVisible]);

  return (
    <div 
      className="text-center"
      onMouseEnter={() => !isVisible && setIsVisible(true)}
      onWheel={() => !isVisible && setIsVisible(true)}
      ref={(el) => {
        if (el && !isVisible) {
          const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) setIsVisible(true);
          }, { threshold: 0.1 });
          observer.observe(el);
        }
      }}
    >
      <div className="text-4xl md:text-5xl font-bold text-teal-600 font-display mb-1">
        {count}{suffix}
      </div>
      <div className="text-sm text-muted-foreground uppercase tracking-wider font-medium">
        {label}
      </div>
    </div>
  );
};

// Parallax Background Section
export const ParallaxHero = ({ 
  title, 
  subtitle, 
  backgroundImage,
  children 
}: { 
  title: React.ReactNode; 
  subtitle?: React.ReactNode; 
  backgroundImage: string;
  children?: React.ReactNode;
}) => (
  <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden">
    <div 
      className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat scale-110"
      style={{ 
        backgroundImage: `url(${backgroundImage})`,
        transform: 'translateZ(-1px) scale(1.2)'
      }}
    />
    <div className="absolute inset-0 z-10 bg-black/40 backdrop-blur-[2px]" />
    
    <div className="relative z-20 container mx-auto px-4 text-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="glass-premium-hero p-8 md:p-12 rounded-3xl max-w-4xl mx-auto border border-white/20"
      >
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 font-display leading-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-xl md:text-2xl text-white/90 font-light max-w-2xl mx-auto mb-8">
            {subtitle}
          </p>
        )}
        {children}
      </motion.div>
    </div>
  </section>
);

// Magnetic Button Wrapper
export const MagneticButton = ({ 
  children, 
  className 
}: { 
  children: React.ReactNode; 
  className?: string;
}) => (
  <div className={cn("magnetic-cta-month2 inline-block", className)}>
    {children}
  </div>
);
