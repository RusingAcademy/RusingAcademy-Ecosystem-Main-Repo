/**
 * ============================================
 * PERFORMANCE OPTIMIZATION UTILITIES — Month 4
 * ============================================
 * 
 * Utilities for optimizing Lighthouse scores and Core Web Vitals:
 * - LCP (Largest Contentful Paint) < 2.5s
 * - FID (First Input Delay) < 100ms
 * - CLS (Cumulative Layout Shift) elimination
 * - TTI (Time to Interactive) improvement
 * - TBT (Total Blocking Time) reduction
 * 
 * @version 4.0.0
 * @since Month 4 — SEO, Performance & Accessibility
 */

// ─── Code Splitting & Dynamic Imports ────────────────────────────────────────
export function lazyLoadComponent<T extends React.ComponentType<any>>(
  importFn: () => Promise<{ default: T }>
): React.LazyExoticComponent<T> {
  const React = require("react");
  return React.lazy(importFn);
}

// ─── Lazy Loading Images ─────────────────────────────────────────────────────
export interface LazyImageConfig {
  native?: boolean;
  rootMargin?: string;
  sizes?: string;
  srcSet?: string;
}

export const DEFAULT_LAZY_CONFIG: LazyImageConfig = {
  native: true,
  rootMargin: "50px",
};

export function getLazyImageProps(
  src: string,
  alt: string,
  config: LazyImageConfig = DEFAULT_LAZY_CONFIG
) {
  return {
    src,
    alt,
    loading: config.native ? ("lazy" as const) : ("eager" as const),
    decoding: "async" as const,
    ...(config.sizes && { sizes: config.sizes }),
    ...(config.srcSet && { srcSet: config.srcSet }),
  };
}

export function preloadImage(src: string): void {
  if (typeof document === "undefined") return;
  
  const link = document.createElement("link");
  link.rel = "preload";
  link.as = "image";
  link.href = src;
  document.head.appendChild(link);
}

// ─── Resource Hints ─────────────────────────────────────────────────────────
export function dnsPrefetch(domain: string): void {
  if (typeof document === "undefined") return;
  
  const link = document.createElement("link");
  link.rel = "dns-prefetch";
  link.href = `//${domain}`;
  document.head.appendChild(link);
}

export function preconnect(domain: string, crossOrigin = true): void {
  if (typeof document === "undefined") return;
  
  const link = document.createElement("link");
  link.rel = "preconnect";
  link.href = `//${domain}`;
  if (crossOrigin) link.crossOrigin = "anonymous";
  document.head.appendChild(link);
}

// ─── Layout Shift Prevention ────────────────────────────────────────────────
export function getAspectRatioStyle(
  width: number,
  height: number
): React.CSSProperties {
  return {
    aspectRatio: `${width} / ${height}`,
    width: "100%",
    height: "auto",
  };
}

export function getImageDimensionStyle(
  width: number,
  height: number
): React.CSSProperties {
  return {
    width: "100%",
    height: "auto",
    maxWidth: `${width}px`,
    aspectRatio: `${width} / ${height}`,
  };
}

// ─── Deferred Task Scheduling ───────────────────────────────────────────────
export function deferredTask(fn: () => void, delay = 0): void {
  if (typeof requestIdleCallback !== "undefined") {
    requestIdleCallback(() => fn(), { timeout: 2000 });
  } else {
    setTimeout(fn, delay);
  }
}

export default {
  lazyLoadComponent,
  getLazyImageProps,
  preloadImage,
  dnsPrefetch,
  preconnect,
  getAspectRatioStyle,
  getImageDimensionStyle,
  deferredTask,
};
