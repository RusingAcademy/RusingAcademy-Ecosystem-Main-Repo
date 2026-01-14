import { useState, useMemo } from 'react';

// Image presets matching server-side configuration
const IMAGE_PRESETS = {
  coach_avatar: { width: 256, height: 256 },
  coach_card: { width: 480, height: 480 },
  cover: { width: 1200, height: 675 },
  hero_desktop: { width: 1920, height: 1080 },
  hero_4k: { width: 3840, height: 2160 },
} as const;

type ImagePreset = keyof typeof IMAGE_PRESETS;

interface SmartImageProps {
  src: string;
  alt: string;
  preset?: ImagePreset;
  priority?: boolean;
  className?: string;
  cloudinaryId?: string;
  onLoad?: () => void;
  onError?: () => void;
}

// Generate Cloudinary URL with transformations
function getCloudinaryUrl(
  publicId: string,
  width: number,
  height: number,
  format: string = 'webp'
): string {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'rusingacademy';
  return `https://res.cloudinary.com/${cloudName}/image/upload/c_fill,w_${width},h_${height},q_auto,f_${format}/${publicId}`;
}

// Generate srcset for responsive images
function generateSrcSet(publicId: string, preset: ImagePreset): string {
  const { width, height } = IMAGE_PRESETS[preset];
  const widths = [
    Math.round(width * 0.5),
    Math.round(width * 0.75),
    width,
    Math.round(width * 1.5),
  ];

  return widths
    .map((w) => {
      const h = Math.round((w / width) * height);
      const url = getCloudinaryUrl(publicId, w, h);
      return `${url} ${w}w`;
    })
    .join(', ');
}

export default function SmartImage({
  src,
  alt,
  preset = 'cover',
  priority = false,
  className = '',
  cloudinaryId,
  onLoad,
  onError,
}: SmartImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const { width, height } = IMAGE_PRESETS[preset];

  // Determine if we should use Cloudinary transformations
  const isCloudinaryImage = cloudinaryId || src.includes('cloudinary.com');

  const imageProps = useMemo(() => {
    if (cloudinaryId) {
      // Use Cloudinary with srcset
      return {
        src: getCloudinaryUrl(cloudinaryId, width, height),
        srcSet: generateSrcSet(cloudinaryId, preset),
        sizes: `(max-width: ${width}px) 100vw, ${width}px`,
      };
    }

    // Regular image
    return { src };
  }, [cloudinaryId, src, width, height, preset]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{ aspectRatio: `${width}/${height}` }}
    >
      {/* Placeholder skeleton */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse" />
      )}

      {/* Error fallback */}
      {hasError && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <span className="text-gray-400 text-sm">Image unavailable</span>
        </div>
      )}

      {/* Actual image */}
      <img
        {...imageProps}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'auto'}
        decoding={priority ? 'sync' : 'async'}
        onLoad={handleLoad}
        onError={handleError}
        className={`
          w-full h-full object-cover
          transition-opacity duration-300
          ${isLoaded ? 'opacity-100' : 'opacity-0'}
        `}
      />
    </div>
  );
}

// Export preset types for external use
export type { ImagePreset };
export { IMAGE_PRESETS };
