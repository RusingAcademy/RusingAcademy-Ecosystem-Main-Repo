/**
 * ============================================
 * ADVANCED IMAGE OPTIMIZATION — Month 4
 * ============================================
 * 
 * Comprehensive image optimization utilities:
 * - WebP format with JPEG/PNG fallbacks
 * - Responsive images with srcset and sizes
 * - Lazy loading with blur-up placeholders
 * - CDN delivery setup
 * 
 * @version 4.0.0
 * @since Month 4 — SEO, Performance & Accessibility
 */

const CDN_URL = "https://rusingacademy-cdn.b-cdn.net";
const RESPONSIVE_BREAKPOINTS = [320, 480, 768, 1024, 1440, 1920];

// ─── WebP Format Detection & Conversion ──────────────────────────────────────
let webpSupported: boolean | null = null;

export async function supportsWebP(): Promise<boolean> {
  if (webpSupported !== null) return webpSupported;
  
  if (typeof window === "undefined") {
    webpSupported = false;
    return false;
  }
  
  try {
    const canvas = document.createElement("canvas");
    canvas.width = 1;
    canvas.height = 1;
    webpSupported = canvas.toDataURL("image/webp").indexOf("webp") === 5;
  } catch (e) {
    webpSupported = false;
  }
  
  return webpSupported;
}

export function getWebPImagePath(src: string): string {
  if (!src) return src;
  
  if (
    src.endsWith(".svg") ||
    src.endsWith(".webp") ||
    src.startsWith("http") ||
    src.startsWith("data:")
  ) {
    return src;
  }
  
  const lastDot = src.lastIndexOf(".");
  if (lastDot === -1) return src;
  
  return src.substring(0, lastDot) + ".webp";
}

// ─── Responsive Images with Srcset ──────────────────────────────────────────
export interface ResponsiveImageConfig {
  src: string;
  width: number;
  height: number;
  alt: string;
  sizes?: string;
  breakpoints?: number[];
  format?: "webp" | "jpeg" | "png";
  quality?: number;
}

export function generateResponsiveSrcset(config: ResponsiveImageConfig): string {
  const { src, breakpoints = RESPONSIVE_BREAKPOINTS, format = "jpeg" } = config;
  
  const srcset = breakpoints
    .map((bp) => {
      const lastDot = src.lastIndexOf(".");
      const basePath = src.substring(0, lastDot);
      const ext = format;
      return `${basePath}-${bp}w.${ext} ${bp}w`;
    })
    .join(", ");
  
  return srcset;
}

export function generateSizesAttribute(
  config: Array<{ breakpoint: number; size: string }>
): string {
  const sorted = [...config].sort((a, b) => a.breakpoint - b.breakpoint);
  const sizes = sorted
    .map((c) => `(max-width: ${c.breakpoint}px) ${c.size}`)
    .join(", ");
  return `${sizes}, 100vw`;
}

// ─── Blur-up Placeholder Generation ──────────────────────────────────────────
export function generateBlurDataUrl(
  width = 10,
  height = 10,
  color = "rgba(200, 200, 200, 0.1)"
): string {
  const canvas = typeof document !== "undefined" ? document.createElement("canvas") : null;
  if (!canvas) return "";
  
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";
  
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, width, height);
  
  return canvas.toDataURL("image/jpeg", 0.1);
}

// ─── CDN Image URL Generation ────────────────────────────────────────────────
export interface CDNImageOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: "webp" | "jpeg" | "png" | "auto";
  fit?: "cover" | "contain" | "fill";
}

export function getCDNImageUrl(
  src: string,
  options: CDNImageOptions = {}
): string {
  if (src.includes(CDN_URL)) return src;
  if (src.startsWith("http")) return src;
  
  const params = new URLSearchParams();
  if (options.width) params.append("w", options.width.toString());
  if (options.height) params.append("h", options.height.toString());
  if (options.quality) params.append("q", options.quality.toString());
  if (options.format) params.append("f", options.format);
  if (options.fit) params.append("fit", options.fit);
  
  const cleanSrc = src.startsWith("/") ? src.slice(1) : src;
  const queryString = params.toString();
  
  return `${CDN_URL}/${cleanSrc}${queryString ? `?${queryString}` : ""}`;
}

// ─── Image Dimension Calculation ────────────────────────────────────────────
export function calculateResponsiveDimensions(
  originalWidth: number,
  originalHeight: number,
  containerWidth: number
): { width: number; height: number } {
  const aspectRatio = originalWidth / originalHeight;
  const width = Math.min(containerWidth, originalWidth);
  const height = Math.round(width / aspectRatio);
  
  return { width, height };
}

export function getAspectRatioCss(
  width: number,
  height: number
): React.CSSProperties {
  return {
    aspectRatio: `${width} / ${height}`,
    width: "100%",
    height: "auto",
  };
}

// ─── Image Optimization Profiles ─────────────────────────────────────────────
export const IMAGE_PROFILES = {
  hero: {
    quality: 85,
    format: "webp" as const,
    breakpoints: [320, 768, 1024, 1440, 1920],
  },
  thumbnail: {
    quality: 75,
    format: "webp" as const,
    breakpoints: [200, 300, 400],
  },
  card: {
    quality: 80,
    format: "webp" as const,
    breakpoints: [300, 400, 600],
  },
};

export default {
  supportsWebP,
  getWebPImagePath,
  generateResponsiveSrcset,
  generateSizesAttribute,
  generateBlurDataUrl,
  getCDNImageUrl,
  calculateResponsiveDimensions,
  getAspectRatioCss,
  IMAGE_PROFILES,
};
