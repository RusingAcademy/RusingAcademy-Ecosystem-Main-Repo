import React from 'react';
import { useScrollAnimation, AnimationType } from '@/hooks/useScrollAnimation';

/**
 * ScrollAnimationWrapper
 * 
 * A wrapper component that applies scroll-triggered animations to its children.
 * Uses Intersection Observer for performant, GPU-accelerated animations.
 * Respects prefers-reduced-motion for accessibility.
 */

interface ScrollAnimationWrapperProps {
  children: React.ReactNode;
  animation?: AnimationType;
  delay?: number;
  duration?: number;
  threshold?: number;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}

export default function ScrollAnimationWrapper({
  children,
  animation = 'fade-up',
  delay = 0,
  duration = 700,
  threshold = 0.15,
  className = '',
  as: Component = 'div',
}: ScrollAnimationWrapperProps) {
  const { ref, style } = useScrollAnimation({
    animation,
    delay,
    duration,
    threshold,
  });

  return React.createElement(
    Component,
    {
      ref,
      style,
      className,
    },
    children
  );
}

/**
 * StaggeredChildren
 * 
 * Wraps multiple children and staggers their entrance animation.
 * Each child gets an increasing delay for a cascading effect.
 */
interface StaggeredChildrenProps {
  children: React.ReactNode;
  animation?: AnimationType;
  baseDelay?: number;
  staggerDelay?: number;
  duration?: number;
  className?: string;
}

export function StaggeredChildren({
  children,
  animation = 'fade-up',
  baseDelay = 0,
  staggerDelay = 100,
  duration = 600,
  className = '',
}: StaggeredChildrenProps) {
  return (
    <div className={className}>
      {React.Children.map(children, (child, index) => (
        <ScrollAnimationWrapper
          animation={animation}
          delay={baseDelay + index * staggerDelay}
          duration={duration}
        >
          {child}
        </ScrollAnimationWrapper>
      ))}
    </div>
  );
}
