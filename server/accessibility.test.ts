/**
 * Accessibility Tests using axe-core
 * 
 * These tests verify WCAG 2.1 AA compliance for the ecosystem
 * Run with: pnpm test
 */

import { describe, it, expect } from 'vitest';

/**
 * Color Contrast Validation Tests
 * 
 * These tests verify that our color combinations meet WCAG 2.1 AA standards
 * AA requires: 4.5:1 for normal text, 3:1 for large text (18px+ or 14px+ bold)
 * AAA requires: 7:1 for normal text, 4.5:1 for large text
 */

// Helper function to calculate relative luminance
function getLuminance(hex: string): number {
  const rgb = hexToRgb(hex);
  if (!rgb) return 0;
  
  const [r, g, b] = [rgb.r, rgb.g, rgb.b].map(val => {
    val = val / 255;
    return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
  });
  
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

// Calculate contrast ratio between two colors
function getContrastRatio(foreground: string, background: string): number {
  const lum1 = getLuminance(foreground);
  const lum2 = getLuminance(background);
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  return (lighter + 0.05) / (darker + 0.05);
}

describe('Color Contrast Compliance', () => {
  // Design System Colors
  const colors = {
    // Light mode backgrounds
    bgLight: '#F7F6F3',      // Porcelain
    bgWhite: '#FFFFFF',      // White
    bgSand: '#EEE9DF',       // Sand
    
    // Dark mode backgrounds
    bgDark: '#0B1220',       // Obsidian
    bgSurface: '#1F2937',    // Surface dark
    bgTeal: '#0F3D3E',       // Foundation teal
    
    // Text colors - Light mode
    textPrimary: '#0B1220',  // Primary text
    textMuted: '#374151',    // Muted text (corrected)
    textMutedOld: '#4B5563', // Old muted (for reference)
    
    // Text colors - Dark mode
    textWhite: '#FFFFFF',
    textLight: '#F7F6F3',
    textMutedDark: '#9CA3AF',
    
    // Brand colors
    brandTeal: '#0F3D3E',
    brandCopper: '#C65A1E',
    brandGold: '#D4A853',
  };

  describe('Light Mode - Text on Light Backgrounds', () => {
    it('Primary text on white background meets AAA (7:1)', () => {
      const ratio = getContrastRatio(colors.textPrimary, colors.bgWhite);
      expect(ratio).toBeGreaterThanOrEqual(7);
    });

    it('Primary text on porcelain background meets AAA (7:1)', () => {
      const ratio = getContrastRatio(colors.textPrimary, colors.bgLight);
      expect(ratio).toBeGreaterThanOrEqual(7);
    });

    it('Muted text on white background meets AA (4.5:1)', () => {
      const ratio = getContrastRatio(colors.textMuted, colors.bgWhite);
      expect(ratio).toBeGreaterThanOrEqual(4.5);
    });

    it('Muted text on porcelain background meets AA (4.5:1)', () => {
      const ratio = getContrastRatio(colors.textMuted, colors.bgLight);
      expect(ratio).toBeGreaterThanOrEqual(4.5);
    });

    it('Muted text on sand background meets AA (4.5:1)', () => {
      const ratio = getContrastRatio(colors.textMuted, colors.bgSand);
      expect(ratio).toBeGreaterThanOrEqual(4.5);
    });
  });

  describe('Dark Mode - Text on Dark Backgrounds', () => {
    it('White text on obsidian background meets AAA (7:1)', () => {
      const ratio = getContrastRatio(colors.textWhite, colors.bgDark);
      expect(ratio).toBeGreaterThanOrEqual(7);
    });

    it('White text on teal background meets AAA (7:1)', () => {
      const ratio = getContrastRatio(colors.textWhite, colors.bgTeal);
      expect(ratio).toBeGreaterThanOrEqual(7);
    });

    it('Light text on dark surface meets AA (4.5:1)', () => {
      const ratio = getContrastRatio(colors.textLight, colors.bgSurface);
      expect(ratio).toBeGreaterThanOrEqual(4.5);
    });

    it('Muted dark text on dark surface meets AA (4.5:1)', () => {
      const ratio = getContrastRatio(colors.textMutedDark, colors.bgSurface);
      expect(ratio).toBeGreaterThanOrEqual(4.5);
    });
  });

  describe('Brand Colors Accessibility', () => {
    it('White text on brand teal meets AAA (7:1)', () => {
      const ratio = getContrastRatio(colors.textWhite, colors.brandTeal);
      expect(ratio).toBeGreaterThanOrEqual(7);
    });

    it('White text on brand copper meets AA for large text (3:1)', () => {
      // Note: Brand copper is used for CTA buttons with large text (14px+ bold or 18px+)
      // WCAG AA for large text requires 3:1, which this passes
      const ratio = getContrastRatio(colors.textWhite, colors.brandCopper);
      expect(ratio).toBeGreaterThanOrEqual(3); // Large text requirement
      // For reference: ratio is ~4.3:1, close to but not quite AA for normal text (4.5:1)
    });

    it('Brand teal on white background meets AA (4.5:1)', () => {
      const ratio = getContrastRatio(colors.brandTeal, colors.bgWhite);
      expect(ratio).toBeGreaterThanOrEqual(4.5);
    });
  });
});

describe('Accessibility Best Practices', () => {
  it('should have documented color contrast ratios', () => {
    // This test documents our color contrast decisions
    const documentedRatios = {
      'Primary text (#0B1220) on white': getContrastRatio('#0B1220', '#FFFFFF'),
      'Muted text (#374151) on white': getContrastRatio('#374151', '#FFFFFF'),
      'White text on teal (#0F3D3E)': getContrastRatio('#FFFFFF', '#0F3D3E'),
      'White text on obsidian (#0B1220)': getContrastRatio('#FFFFFF', '#0B1220'),
    };
    
    // All ratios should be at least AA compliant
    Object.entries(documentedRatios).forEach(([name, ratio]) => {
      expect(ratio, `${name} should meet AA (4.5:1)`).toBeGreaterThanOrEqual(4.5);
    });
  });
});
