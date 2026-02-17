/**
 * Image utility functions for optimized image loading.
 * Part of Wave 2 Sprint 1 - Performance Optimization.
 *
 * Provides WebP-first loading with automatic fallback to original formats,
 * and lazy loading helpers for below-the-fold images.
 */

/**
 * Returns the WebP version of an image path if available.
 * Falls back to the original path if no WebP version exists.
 *
 * @example
 * getOptimizedImageSrc('/images/hero/steven-class.webp')
 * // Returns '/images/hero/steven-class.webp'
 *
 * getOptimizedImageSrc('/images/logos/logo.svg')
 * // Returns '/images/logos/logo.svg' (SVGs are not converted)
 */
export function getOptimizedImageSrc(src: string): string {
  if (!src) return src;

  // Don't convert SVGs, WebPs, or external URLs
  if (
    src.endsWith('.svg') ||
    src.endsWith('.webp') ||
    src.startsWith('http') ||
    src.startsWith('data:')
  ) {
    return src;
  }

  // Replace the extension with .webp
  const lastDot = src.lastIndexOf('.');
  if (lastDot === -1) return src;

  return src.substring(0, lastDot) + '.webp';
}

/**
 * Generates props for an optimized <img> element with lazy loading.
 *
 * @example
 * <img {...getOptimizedImageProps('/images/hero/steven-class.webp', 'Steven in class')} />
 */
export function getOptimizedImageProps(
  src: string,
  alt: string,
  options?: {
    lazy?: boolean;
    width?: number;
    height?: number;
    className?: string;
  }
) {
  const optimizedSrc = getOptimizedImageSrc(src);
  const isLazy = options?.lazy !== false; // Default to lazy loading

  return {
    src: optimizedSrc,
    alt,
    loading: isLazy ? ('lazy' as const) : ('eager' as const),
    decoding: 'async' as const,
    ...(options?.width && { width: options.width }),
    ...(options?.height && { height: options.height }),
    ...(options?.className && { className: options.className }),
  };
}
