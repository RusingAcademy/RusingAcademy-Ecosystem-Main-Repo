import { lazy, Suspense, useState, useEffect } from 'react';

/**
 * LazyProfStevenChatbot - Lazy-loaded wrapper for ProfStevenChatbot
 * 
 * This component delays loading the chatbot until:
 * 1. The page has been idle for 3 seconds (user finished initial interaction)
 * 2. OR the user scrolls past 50% of the page
 * 
 * Benefits:
 * - Reduces initial bundle size
 * - Improves First Contentful Paint (FCP)
 * - Improves Largest Contentful Paint (LCP)
 * - Chatbot loads when user is ready to interact
 */

// Lazy load the actual chatbot component
const ProfStevenChatbot = lazy(() => 
  import('./ProfStevenChatbot').then(mod => ({
    default: mod.default
  }))
);

export default function LazyProfStevenChatbot() {
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    // Strategy 1: Load after 3 seconds of idle time
    const idleTimer = setTimeout(() => {
      setShouldLoad(true);
    }, 3000);

    // Strategy 2: Load when user scrolls past 50% of viewport
    const handleScroll = () => {
      const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
      if (scrollPercent > 30) {
        setShouldLoad(true);
        window.removeEventListener('scroll', handleScroll);
      }
    };

    // Strategy 3: Load on any user interaction
    const handleInteraction = () => {
      setShouldLoad(true);
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('click', handleInteraction, { passive: true });
    window.addEventListener('touchstart', handleInteraction, { passive: true });
    window.addEventListener('keydown', handleInteraction, { passive: true });

    return () => {
      clearTimeout(idleTimer);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
    };
  }, []);

  // Don't render anything until we should load
  if (!shouldLoad) {
    return null;
  }

  return (
    <Suspense fallback={null}>
      <ProfStevenChatbot />
    </Suspense>
  );
}
