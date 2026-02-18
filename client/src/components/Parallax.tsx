import React from 'react';
import { motion } from 'framer-motion';

/**
 * Parallax & ParallaxLayer
 * Stub components to fix build errors from missing Month 2 files.
 */

export const Parallax = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={className}>{children}</div>
);

export const ParallaxLayer = ({ 
  children, 
  speed = 0.5, 
  className 
}: { 
  children: React.ReactNode; 
  speed?: number; 
  className?: string 
}) => (
  <motion.div 
    className={className}
    style={{ y: 0 }} // Simplified for build fix
  >
    {children}
  </motion.div>
);
