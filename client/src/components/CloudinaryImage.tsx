import { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';

/**
 * CloudinaryImage - Automatic image optimization via Cloudinary CDN Fetch Mode
 * 
 * This component uses Cloudinary's "fetch" feature to optimize images on-the-fly
 * WITHOUT requiring image uploads. Cloudinary fetches the original image from
 * your server and delivers an optimized version via CDN.
 * 
 * Benefits:
 * - No API secret needed (only cloud name)
 * - No upload step required
 * - Automatic WebP conversion
 * - Automatic quality optimization
 * - Responsive srcset generation
 * - CDN caching for fast delivery
 */

// Cloudinary configuration
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'djxhk76m9';

// Base URL of the production site (for Cloudinary to fetch images from)
const ORIGIN_URL = import.meta.env.VITE_APP_URL || 'https://rusingacademy-ecosystem-production.up.railway.app';

// Image presets for common use cases
export const IMAGE_PRESETS = {
  thumbnail: { width: 150, height: 150 },
  avatar: { width: 256, height: 256 },
  card: { width: 480, height: 320 },
  testimonial: { width: 400, height: 400 },
  hero_mobile: { width: 640, height: 360 },
  hero_tablet: { width: 1024, height: 576 },
  hero_desktop: { width: 1920, height: 1080 },
  cover: { width: 1200, height: 675 },
  how_it_works: { width: 600, height: 400 },
  why_choose: { width: 500, height: 350 },
  full: { width: 1920, height: 1080 },
} as const;

export type ImagePreset = keyof typeof IMAGE_PRESETS;

interface CloudinaryImageProps {
  src: string;
  alt: string;
  preset?: ImagePreset;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none';
  quality?: 'auto' | 'auto:low' | 'auto:eco' | 'auto:good' | 'auto:best';
  onLoad?: () => void;
  onError?: () => void;
}

/**
 * Generate Cloudinary Fetch URL
 * Uses Cloudinary's fetch feature to optimize remote images on-the-fly
 */
function getCloudinaryFetchUrl(
  originalUrl: string,
  width: number,
  height: number,
  quality: string = 'auto:good'
): string {
  // Encode the original URL for Cloudinary fetch
  const encodedUrl = encodeURIComponent(originalUrl);
  
  // Cloudinary fetch URL format:
  // https://res.cloudinary.com/{cloud}/image/fetch/c_fill,w_{width},h_{height},q_{quality},f_auto/{encoded_url}
  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/fetch/c_fill,w_${width},h_${height},q_${quality},f_auto/${encodedUrl}`;
}

/**
 * Generate srcset for responsive images using Cloudinary fetch
 */
function generateFetchSrcSet(
  originalUrl: string,
  baseWidth: number,
  baseHeight: number,
  quality: string = 'auto:good'
): string {
  const scales = [0.5, 0.75, 1, 1.5];
  
  return scales
    .map((scale) => {
      const w = Math.round(baseWidth * scale);
      const h = Math.round(baseHeight * scale);
      const url = getCloudinaryFetchUrl(originalUrl, w, h, quality);
      return `${url} ${w}w`;
    })
    .join(', ');
}

/**
 * Convert local path to absolute URL for Cloudinary fetch
 */
function getAbsoluteUrl(src: string): string {
  if (src.startsWith('http://') || src.startsWith('https://')) {
    return src;
  }
  // Local path - prepend origin
  return `${ORIGIN_URL}${src.startsWith('/') ? '' : '/'}${src}`;
}

export default function CloudinaryImage({
  src,
  alt,
  preset,
  width: customWidth,
  height: customHeight,
  className,
  priority = false,
  objectFit = 'cover',
  quality = 'auto:good',
  onLoad,
  onError,
}: CloudinaryImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [useFallback, setUseFallback] = useState(false);

  // Determine dimensions
  const dimensions = useMemo(() => {
    if (customWidth && customHeight) {
      return { width: customWidth, height: customHeight };
    }
    if (preset) {
      return IMAGE_PRESETS[preset];
    }
    return IMAGE_PRESETS.cover; // Default
  }, [preset, customWidth, customHeight]);

  // Generate image sources
  const imageProps = useMemo(() => {
    // If fallback mode, use original source
    if (useFallback) {
      return { src };
    }

    const absoluteUrl = getAbsoluteUrl(src);
    const { width, height } = dimensions;
    
    return {
      src: getCloudinaryFetchUrl(absoluteUrl, width, height, quality),
      srcSet: generateFetchSrcSet(absoluteUrl, width, height, quality),
      sizes: `(max-width: ${width}px) 100vw, ${width}px`,
    };
  }, [src, dimensions, quality, useFallback]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    if (!useFallback) {
      // Try fallback to original image
      console.warn(`CloudinaryImage: Cloudinary fetch failed for ${src}, using original`);
      setUseFallback(true);
      setHasError(false);
    } else {
      setHasError(true);
      onError?.();
    }
  };

  // Error fallback
  if (hasError) {
    return (
      <div
        className={cn(
          'bg-gray-100 flex items-center justify-center text-gray-400',
          className
        )}
        style={{ 
          width: dimensions.width, 
          height: dimensions.height,
          aspectRatio: `${dimensions.width}/${dimensions.height}`,
        }}
        role="img"
        aria-label={alt}
      >
        <span className="text-sm">Image unavailable</span>
      </div>
    );
  }

  return (
    <div 
      className={cn('relative overflow-hidden', className)}
      style={{ aspectRatio: `${dimensions.width}/${dimensions.height}` }}
    >
      {/* Skeleton placeholder */}
      {!isLoaded && (
        <div 
          className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse"
        />
      )}

      <img
        {...imageProps}
        alt={alt}
        width={dimensions.width}
        height={dimensions.height}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'auto'}
        decoding={priority ? 'sync' : 'async'}
        onLoad={handleLoad}
        onError={handleError}
        className={cn(
          'w-full h-full transition-opacity duration-300',
          objectFit === 'cover' && 'object-cover',
          objectFit === 'contain' && 'object-contain',
          objectFit === 'fill' && 'object-fill',
          isLoaded ? 'opacity-100' : 'opacity-0'
        )}
      />
    </div>
  );
}

/**
 * Hook to get Cloudinary fetch URL for a local image path
 */
export function useCloudinaryUrl(
  localPath: string,
  preset: ImagePreset = 'cover'
): string {
  return useMemo(() => {
    const absoluteUrl = getAbsoluteUrl(localPath);
    const { width, height } = IMAGE_PRESETS[preset];
    return getCloudinaryFetchUrl(absoluteUrl, width, height);
  }, [localPath, preset]);
}

/**
 * Get optimized image URL directly (for use in CSS backgrounds, etc.)
 */
export function getOptimizedImageUrl(
  src: string,
  preset: ImagePreset = 'cover'
): string {
  const absoluteUrl = getAbsoluteUrl(src);
  const { width, height } = IMAGE_PRESETS[preset];
  return getCloudinaryFetchUrl(absoluteUrl, width, height);
}

/**
 * Check if Cloudinary is configured
 */
export function isCloudinaryConfigured(): boolean {
  return !!CLOUDINARY_CLOUD_NAME;
}
