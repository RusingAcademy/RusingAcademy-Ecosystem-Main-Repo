import { useState, useCallback, lazy, Suspense } from 'react';
import { Play, Loader2 } from 'lucide-react';

// Lazy load the Mux player to avoid loading it until needed
const MuxPlayer = lazy(() => import('@mux/mux-player-react'));

interface SmartVideoProps {
  playbackId: string;
  poster?: string;
  title?: string;
  className?: string;
  aspectRatio?: '16/9' | '4/3' | '1/1' | '9/16';
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  onPlay?: () => void;
  onEnded?: () => void;
}

// Generate poster URL from Mux playback ID
function getMuxPosterUrl(playbackId: string, time: number = 0): string {
  return `https://image.mux.com/${playbackId}/thumbnail.webp?time=${time}&width=1920&height=1080`;
}

export default function SmartVideo({
  playbackId,
  poster,
  title,
  className = '',
  aspectRatio = '16/9',
  autoPlay = false,
  muted = false,
  loop = false,
  onPlay,
  onEnded,
}: SmartVideoProps) {
  const [isPlayerLoaded, setIsPlayerLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Use provided poster or generate from Mux
  const posterUrl = poster || getMuxPosterUrl(playbackId);

  const handlePlayClick = useCallback(() => {
    setIsLoading(true);
    setIsPlayerLoaded(true);
  }, []);

  const handlePlayerReady = useCallback(() => {
    setIsLoading(false);
    setIsPlaying(true);
    onPlay?.();
  }, [onPlay]);

  const handleEnded = useCallback(() => {
    setIsPlaying(false);
    onEnded?.();
  }, [onEnded]);

  // Calculate aspect ratio dimensions
  const aspectRatioMap = {
    '16/9': { paddingBottom: '56.25%' },
    '4/3': { paddingBottom: '75%' },
    '1/1': { paddingBottom: '100%' },
    '9/16': { paddingBottom: '177.78%' },
  };

  return (
    <div
      className={`relative overflow-hidden rounded-lg bg-black ${className}`}
      style={{ aspectRatio }}
    >
      {/* Poster with play button (shown before player loads) */}
      {!isPlayerLoaded && (
        <div className="absolute inset-0">
          {/* Poster image */}
          <img
            src={posterUrl}
            alt={title || 'Video thumbnail'}
            className="w-full h-full object-cover"
            loading="lazy"
          />

          {/* Play button overlay */}
          <button
            onClick={handlePlayClick}
            className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors group"
            aria-label={`Play ${title || 'video'}`}
          >
            <div className="w-20 h-20 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <Play className="w-8 h-8 text-teal-600 ml-1" fill="currentColor" />
            </div>
          </button>

          {/* Title overlay */}
          {title && (
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
              <h3 className="text-white font-medium text-lg">{title}</h3>
            </div>
          )}
        </div>
      )}

      {/* Loading state */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black">
          <Loader2 className="w-12 h-12 text-teal-500 animate-spin" />
        </div>
      )}

      {/* Mux Player (lazy loaded) */}
      {isPlayerLoaded && (
        <Suspense
          fallback={
            <div className="absolute inset-0 flex items-center justify-center bg-black">
              <Loader2 className="w-12 h-12 text-teal-500 animate-spin" />
            </div>
          }
        >
          <MuxPlayer
            playbackId={playbackId}
            poster={posterUrl}
            streamType="on-demand"
            autoPlay={true}
            muted={muted}
            loop={loop}
            onCanPlay={handlePlayerReady}
            onEnded={handleEnded}
            style={{
              width: '100%',
              height: '100%',
              position: 'absolute',
              top: 0,
              left: 0,
            }}
            metadata={{
              video_title: title,
            }}
          />
        </Suspense>
      )}
    </div>
  );
}

// Export helper function for external use
export { getMuxPosterUrl };
