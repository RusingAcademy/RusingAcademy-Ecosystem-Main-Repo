/**
 * PREMIUM DESIGN TOKENS
 * Extension for Wave 1+ Homepage Upgrade
 * Following Steven's MgCréa aesthetic requirements.
 */

export const premiumTokens = {
  glassmorphism: {
    hero: {
      background: 'rgba(255, 255, 255, 0.08)',
      backdropFilter: 'blur(6px)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      shadow: '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
    },
    card: {
      background: 'rgba(255, 255, 255, 0.7)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
    }
  },
  typography: {
    fontFamily: {
      serif: '"Playfair Display", "Times New Roman", serif', // Elegant for H1/H2
      sans: '"Inter", "system-ui", sans-serif', // Modern for body/labels
    },
    // Fluid typography scale (simplified for implementation)
    scale: {
      h1: 'clamp(2.5rem, 5vw, 4.5rem)',
      h2: 'clamp(2rem, 4vw, 3.5rem)',
      h3: 'clamp(1.5rem, 3vw, 2.5rem)',
      body: '1.125rem',
    }
  },
  spacing: {
    sectionPadding: 'clamp(4rem, 10vw, 8rem)',
    elementGap: 'clamp(1.5rem, 3vw, 3rem)',
  }
};
