import { Link } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { Play, Star, ArrowRight, X, Globe, Calendar, Pause, Volume2, VolumeX, Maximize, Subtitles, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef } from "react";

// Featured coaches data with local MP4 video files and thumbnails
const FEATURED_COACHES = [
  {
    id: 1,
    name: "Steven Barholere",
    slug: "steven-barholere",
    headline: "SLE Expert | Oral Exam Specialist",
    bio: "Founder of Lingueefy with 10+ years helping federal employees achieve their SLE goals.",
    hourlyRate: 6700,
    videoUrl: "/videos/steven-barholere.mp4",
    youtubeUrl: "https://youtu.be/ZytUUUv-A2g",
    thumbnailUrl: "/images/thumbnails/steven-barholere-thumb.jpg",
    photoUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663049070748/gvnmYNphKZgt9jM9K8Vi9K/coaches/steven-rusinga-v3.jpg",
    subtitles: { en: "/subtitles/steven-barholere-en.vtt", fr: "/subtitles/steven-barholere-fr.vtt" },
    rating: 5.0,
    totalSessions: 520,
    languages: ["french", "english"] as ("french" | "english")[],
    availability: { availableToday: true, nextAvailable: null, availableDays: ["Mon", "Tue", "Wed", "Thu", "Fri"] },
    accentColor: "from-teal-500 to-emerald-600",
    linkedinUrl: "https://www.linkedin.com/in/steven-barholere-1a17b8a6/",
  },
  {
    id: 2,
    name: "Sue-Anne Richer",
    slug: "sue-anne-richer",
    headline: "Bilingual Expert | Conversation Specialist",
    bio: "Specialized in French and English oral preparation with immersive conversation techniques.",
    hourlyRate: 5700,
    videoUrl: "/videos/sue-anne-richer.mp4",
    youtubeUrl: "https://youtu.be/NxAK8U6_5e4",
    thumbnailUrl: "/images/thumbnails/sue-anne-richer-thumb.jpg",
    photoUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663049070748/gvnmYNphKZgt9jM9K8Vi9K/coaches/sue-anne-richer-v2.jpg",
    subtitles: { en: "/subtitles/sue-anne-richer-en.vtt", fr: "/subtitles/sue-anne-richer-fr.vtt" },
    rating: 4.9,
    totalSessions: 385,
    languages: ["french", "english"] as ("french" | "english")[],
    availability: { availableToday: true, nextAvailable: null, availableDays: ["Mon", "Wed", "Fri", "Sat"] },
    accentColor: "from-purple-500 to-pink-600",
    linkedinUrl: "https://www.linkedin.com/in/sue-anne-richer/",
  },
  {
    id: 3,
    name: "Erika Séguin",
    slug: "erika-seguin",
    headline: "Exam Confidence | English Performance Coach",
    bio: "Helps learners overcome exam anxiety and build confidence for English test day success.",
    hourlyRate: 6000,
    videoUrl: "/videos/erika-seguin.mp4",
    youtubeUrl: "https://youtu.be/UN9-GPwmbaw",
    thumbnailUrl: "/images/thumbnails/erika-seguin-thumb.jpg",
    photoUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663049070748/gvnmYNphKZgt9jM9K8Vi9K/coaches/erika-seguin-v2.jpg",
    subtitles: { en: "/subtitles/erika-seguin-en.vtt", fr: "/subtitles/erika-seguin-fr.vtt" },
    rating: 4.8,
    totalSessions: 278,
    languages: ["english"] as ("french" | "english")[],
    availability: { availableToday: false, nextAvailable: "Tomorrow", availableDays: ["Tue", "Thu", "Sat"] },
    accentColor: "from-orange-500 to-amber-600",
    linkedinUrl: "https://www.linkedin.com/in/erika-seguin-9aaa40383/",
  },
  {
    id: 4,
    name: "Soukaina Mhammedi Alaoui",
    slug: "soukaina-mhammedi-alaoui",
    headline: "French Excellence | Written & Oral",
    bio: "Expert in French written and oral SLE preparation with a focus on fluency and accuracy.",
    hourlyRate: 5800,
    videoUrl: "/videos/soukaina-haidar.mp4",
    youtubeUrl: "https://youtu.be/rAdJZ4o_N2Y",
    thumbnailUrl: "/images/thumbnails/soukaina-haidar-thumb.jpg",
    photoUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663049070748/gvnmYNphKZgt9jM9K8Vi9K/coaches/soukaina-haidar-v2.jpg",
    subtitles: { en: "/subtitles/soukaina-haidar-en.vtt", fr: "/subtitles/soukaina-haidar-fr.vtt" },
    rating: 4.8,
    totalSessions: 312,
    languages: ["french"] as ("french" | "english")[],
    availability: { availableToday: true, nextAvailable: null, availableDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] },
    accentColor: "from-blue-500 to-cyan-600",
    linkedinUrl: "https://www.linkedin.com/in/soukaina-m-hammedi-alaoui-4a0127100/",
  },
  {
    id: 5,
    name: "Victor Amisi",
    slug: "victor-amisi",
    headline: "BBB/CBC Preparation | Oral Simulation",
    bio: "Insider insights and realistic exam simulations for consistent, confident results.",
    hourlyRate: 6000,
    videoUrl: "/videos/victor-amisi.mp4",
    youtubeUrl: "https://youtu.be/SuuhMpF5KoA",
    thumbnailUrl: "/images/thumbnails/victor-amisi-thumb.jpg",
    photoUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663049070748/gvnmYNphKZgt9jM9K8Vi9K/coaches/victor-amisi-v2.jpg",
    subtitles: { en: "/subtitles/victor-amisi-en.vtt", fr: "/subtitles/victor-amisi-fr.vtt" },
    rating: 4.8,
    totalSessions: 310,
    languages: ["french"] as ("french" | "english")[],
    availability: { availableToday: false, nextAvailable: "Monday", availableDays: ["Mon", "Wed", "Fri"] },
    accentColor: "from-indigo-500 to-violet-600",
    linkedinUrl: "https://www.linkedin.com/in/victor-amisi-bb92a0114/",
  },
  {
    id: 6,
    name: "Preciosa Baganha",
    slug: "preciosa-baganha",
    headline: "Professional English | Executive Coaching",
    bio: "Elevating workplace English fluency for presentations, meetings, and leadership.",
    hourlyRate: 5800,
    videoUrl: "/videos/preciosa-baganha.mp4",
    youtubeUrl: "https://youtu.be/LEc84vX0xe0",
    thumbnailUrl: "/images/thumbnails/preciosa-baganha-thumb.jpg",
    photoUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663049070748/gvnmYNphKZgt9jM9K8Vi9K/coaches/preciosa-baganha-v2.jpg",
    subtitles: { en: "/subtitles/preciosa-baganha-en.vtt", fr: "/subtitles/preciosa-baganha-fr.vtt" },
    rating: 4.7,
    totalSessions: 324,
    languages: ["english"] as ("french" | "english")[],
    availability: { availableToday: false, nextAvailable: "Wednesday", availableDays: ["Wed", "Sat", "Sun"] },
    accentColor: "from-rose-500 to-red-600",
    linkedinUrl: "https://www.linkedin.com/in/managerok/",
  },
];

type LanguageFilter = "clear" | "all" | "french" | "english" | "oral-a" | "oral-b" | "oral-c" | "written-a" | "written-b" | "written-c" | "reading" | "anxiety";

// Cinematic Video Modal Component
function VideoModal({ 
  videoUrl, 
  coachName, 
  photoUrl,
  subtitles,
  accentColor,
  isOpen, 
  onClose 
}: { 
  videoUrl: string; 
  coachName: string;
  photoUrl: string;
  subtitles: { en: string; fr: string };
  accentColor: string;
  isOpen: boolean; 
  onClose: () => void;
}) {
  const { language } = useLanguage();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [showSubtitles, setShowSubtitles] = useState(true);
  const [isBuffering, setIsBuffering] = useState(true);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === " ") { e.preventDefault(); togglePlay(); }
      if (e.key === "m") toggleMute();
      if (e.key === "c") setShowSubtitles(prev => !prev);
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.play().then(() => {
            setIsPlaying(true);
            setIsBuffering(false);
          }).catch(() => {});
        }
      }, 500);
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) {
      setIsPlaying(false);
      setProgress(0);
      setCurrentTime(0);
      setIsBuffering(true);
    }
  }, [isOpen]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime;
      const dur = videoRef.current.duration;
      setCurrentTime(current);
      setProgress((current / dur) * 100);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
      setIsBuffering(false);
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (videoRef.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const width = rect.width;
      const newTime = (clickX / width) * duration;
      videoRef.current.currentTime = newTime;
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    }
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 3000);
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8"
      onClick={onClose}
    >
      {/* Cinematic Backdrop */}
      <div className="absolute inset-0 bg-black/95 backdrop-blur-xl" />
      
      {/* Animated Background Glow */}
      <div className={`absolute inset-0 opacity-30 bg-gradient-radial ${accentColor} blur-3xl animate-pulse`} 
           style={{ background: `radial-gradient(ellipse at center, rgba(20, 184, 166, 0.3) 0%, transparent 70%)` }} />
      
      {/* Modal Content */}
      <div 
        className="relative w-full max-w-6xl bg-gradient-to-br from-gray-900 via-gray-900 to-black rounded-3xl overflow-hidden shadow-2xl border border-white/10 animate-in fade-in zoom-in-95 duration-500"
        onClick={(e) => e.stopPropagation()}
        onMouseMove={handleMouseMove}
      >
        {/* Premium Header */}
        <div className={`absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-black via-black/80 to-transparent p-6 transition-opacity duration-500 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className={`absolute inset-0 bg-gradient-to-r ${accentColor} rounded-full blur-md opacity-60 animate-pulse`} />
              <img 
                src={photoUrl} 
                alt={coachName}
                className="relative w-14 h-14 rounded-full object-cover border-2 border-white/30 shadow-xl"
              />
            </div>
            <div>
              <h3 className="text-white font-bold text-xl tracking-wide">{coachName}</h3>
              <p className="text-teal-400 text-sm font-medium">Coach Introduction</p>
            </div>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className={`absolute top-6 right-6 z-30 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300 hover:scale-110 hover:rotate-90 border border-white/20 ${showControls ? 'opacity-100' : 'opacity-0'}`}
          aria-label="Close video"
        >
          <X className="w-6 h-6" />
        </button>
        
        {/* Video Container */}
        <div className="relative aspect-video bg-black">
          <video
            ref={videoRef}
            src={videoUrl}
            className="w-full h-full object-contain"
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onEnded={() => setIsPlaying(false)}
            onWaiting={() => setIsBuffering(true)}
            onCanPlay={() => setIsBuffering(false)}
            onClick={togglePlay}
            playsInline
            crossOrigin="anonymous"
          >
            {showSubtitles && (
              <>
                <track 
                  kind="subtitles" 
                  src={subtitles.en} 
                  srcLang="en" 
                  label="English"
                  default={language === 'en'}
                />
                <track 
                  kind="subtitles" 
                  src={subtitles.fr} 
                  srcLang="fr" 
                  label="Français"
                  default={language === 'fr'}
                />
              </>
            )}
          </video>
          
          {/* Buffering Indicator */}
          {isBuffering && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <div className="relative">
                <div className={`w-20 h-20 rounded-full border-4 border-transparent border-t-teal-500 animate-spin`} />
                <div className={`absolute inset-2 w-16 h-16 rounded-full border-4 border-transparent border-t-teal-300 animate-spin`} style={{ animationDirection: 'reverse', animationDuration: '0.8s' }} />
              </div>
            </div>
          )}
          
          {/* Center Play Button */}
          <button
            onClick={togglePlay}
            className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${showControls || !isPlaying ? 'opacity-100' : 'opacity-0'}`}
          >
            <div className={`relative transition-all duration-500 ${isPlaying ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}>
              <div className={`absolute inset-0 bg-gradient-to-r ${accentColor} rounded-full blur-xl opacity-60 animate-pulse scale-150`} />
              <div className={`relative w-24 h-24 rounded-full bg-gradient-to-r ${accentColor} flex items-center justify-center shadow-2xl hover:scale-110 transition-transform duration-300`}>
                <Play className="w-10 h-10 text-white ml-1" fill="white" />
              </div>
            </div>
          </button>

          {/* Premium Controls Bar */}
          <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/90 to-transparent p-6 transition-all duration-500 ${showControls ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            {/* Progress Bar */}
            <div 
              className="relative h-2 bg-white/20 rounded-full cursor-pointer mb-4 group"
              onClick={handleProgressClick}
            >
              <div className="absolute inset-0 bg-white/10 rounded-full" />
              <div 
                className={`h-full bg-gradient-to-r ${accentColor} rounded-full relative transition-all duration-100`}
                style={{ width: `${progress}%` }}
              >
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {/* Play/Pause */}
                <button
                  onClick={togglePlay}
                  className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-all hover:scale-110 border border-white/10"
                >
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                </button>

                {/* Volume */}
                <button
                  onClick={toggleMute}
                  className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-all hover:scale-110 border border-white/10"
                >
                  {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </button>

                {/* Time */}
                <span className="text-white/80 text-sm font-mono tracking-wider">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>

              <div className="flex items-center gap-3">
                {/* Subtitles Toggle */}
                <button
                  onClick={() => setShowSubtitles(!showSubtitles)}
                  className={`w-10 h-10 rounded-full backdrop-blur-sm flex items-center justify-center transition-all hover:scale-110 border ${showSubtitles ? 'bg-teal-500/30 text-teal-400 border-teal-500/50' : 'bg-white/10 text-white/60 border-white/10 hover:bg-white/20'}`}
                  title={showSubtitles ? 'Hide subtitles' : 'Show subtitles'}
                >
                  <Subtitles className="w-5 h-5" />
                </button>

                {/* Fullscreen */}
                <button
                  onClick={handleFullscreen}
                  className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-all hover:scale-110 border border-white/10"
                >
                  <Maximize className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Premium Coach Card Component
function CoachCard({ 
  coach, 
  onVideoClick,
  t 
}: { 
  coach: typeof FEATURED_COACHES[0];
  onVideoClick: () => void;
  t: (key: string) => string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setIsHovering(true);
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.play().catch(() => {});
      }
    }, 400);
  };

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    setIsHovering(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <div 
      className="group relative rounded-3xl overflow-hidden transition-all duration-500 hover:-translate-y-3 hover:scale-[1.02]"
      style={{
        background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.85) 100%)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.8)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08), 0 4px 16px rgba(20, 184, 166, 0.06)',
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Premium Hover Glow Effect */}
      <div 
        className="absolute -inset-1 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"
        style={{
          background: 'linear-gradient(135deg, rgba(20, 184, 166, 0.2) 0%, rgba(212, 175, 55, 0.15) 100%)',
          filter: 'blur(20px)',
        }}
      />
      {/* Video/Thumbnail Container */}
      <div className="relative aspect-[4/3] overflow-hidden">
        {/* Thumbnail Image */}
        <img 
          src={coach.thumbnailUrl}
          alt={coach.name}
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${isHovering && videoLoaded ? 'opacity-0 scale-110' : 'opacity-100 scale-100'}`}
        />
        
        {/* Video Preview (muted, plays on hover) */}
        <video
          ref={videoRef}
          src={coach.videoUrl}
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${isHovering && videoLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
          muted
          loop
          playsInline
          preload="metadata"
          onLoadedData={() => setVideoLoaded(true)}
        />

        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className={`absolute inset-0 bg-gradient-to-br ${coach.accentColor} opacity-0 group-hover:opacity-20 transition-opacity duration-500`} />

        {/* Rating Badge */}
        <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg">
          <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
          <span className="text-sm font-bold text-gray-900 dark:text-white">{coach.rating.toFixed(1)}</span>
        </div>

        {/* Sessions Badge */}
        <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-full">
          <span className="text-white text-sm font-medium">{coach.totalSessions} lessons</span>
        </div>

        {/* Price Badge */}
        <div className={`absolute bottom-4 right-4 bg-gradient-to-r ${coach.accentColor} px-4 py-2 rounded-full shadow-lg`}>
          <span className="text-white font-bold">From ${(coach.hourlyRate / 100).toFixed(0)}/h</span>
        </div>

        {/* Play Button - Always visible, pulses on hover */}
        <button
          onClick={(e) => { e.stopPropagation(); if (coach.youtubeUrl) window.open(coach.youtubeUrl, '_blank'); else onVideoClick(); }}
          className="absolute inset-0 flex items-center justify-center"
          aria-label={`Play ${coach.name}'s introduction video on YouTube`}
        >
          <div className={`relative transition-all duration-500 ${isHovering ? 'scale-110' : 'scale-100'}`}>
            {/* Animated Ring */}
            <div className={`absolute inset-0 rounded-full bg-white/30 ${isHovering ? 'animate-ping' : ''}`} style={{ animationDuration: '1.5s' }} />
            <div className={`relative w-16 h-16 rounded-full bg-white/90 dark:bg-white/95 flex items-center justify-center shadow-xl backdrop-blur-sm transition-all duration-300 group-hover:bg-white`}>
              <Play className={`w-7 h-7 ml-1 transition-colors duration-300 ${isHovering ? 'text-teal-600' : 'text-gray-800'}`} fill="currentColor" />
            </div>
          </div>
        </button>

        {/* "Now Playing" indicator */}
        {isHovering && videoLoaded && (
          <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-black/70 backdrop-blur-sm px-3 py-1.5 rounded-full animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex gap-0.5">
              <div className="w-1 h-3 bg-teal-400 rounded-full animate-pulse" style={{ animationDelay: '0ms' }} />
              <div className="w-1 h-4 bg-teal-400 rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
              <div className="w-1 h-2 bg-teal-400 rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
            </div>
            <span className="text-white text-xs font-medium">Preview</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
          {coach.name}
        </h3>
        <p className={`text-sm font-semibold bg-gradient-to-r ${coach.accentColor} bg-clip-text text-transparent mb-3`}>
          {coach.headline}
        </p>
        <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2 mb-4">
          {coach.bio}
        </p>

        {/* Languages & Availability */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-2">
            {coach.languages.map((lang) => (
              <span 
                key={lang}
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-100 dark:bg-gray-700/50 rounded-full text-xs font-medium text-gray-700 dark:text-gray-300"
              >
                <Globe className="w-3 h-3" />
                {lang === 'french' ? 'French' : 'English'}
              </span>
            ))}
          </div>
          {coach.availability.availableToday ? (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              Available Today
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 dark:text-gray-300">
              <Calendar className="w-3.5 h-3.5" />
              Next: {coach.availability.nextAvailable}
            </span>
          )}
        </div>

        {/* LinkedIn Button */}
        {coach.linkedinUrl && (
          <a href={coach.linkedinUrl} target="_blank" rel="noopener noreferrer" className="mb-2 block">
            <Button 
              variant="outline"
              className="w-full border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 font-semibold py-2 rounded-xl transition-all duration-300"
            >
              <Linkedin className="w-4 h-4 mr-2" />
              LinkedIn
            </Button>
          </a>
        )}

        {/* CTA Button */}
        <Link href={`/coach/${coach.slug}`}>
          <Button 
            className={`w-full bg-gradient-to-r ${coach.accentColor} hover:opacity-90 text-white font-semibold py-3 rounded-xl transition-all duration-300 group-hover:shadow-lg`}
          >
            {t('coaches.tryNow')}
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default function FeaturedCoaches() {
  const { t, language } = useLanguage();
  const [filter, setFilter] = useState<LanguageFilter>("all");
  const [selectedVideo, setSelectedVideo] = useState<typeof FEATURED_COACHES[0] | null>(null);

  const filteredCoaches = FEATURED_COACHES.filter((coach) => {
    if (filter === "all") return true;
    return coach.languages.includes(filter);
  });

  return (
    <section 
      id="featured-coaches" 
      className="pt-24 pb-28 relative overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #FEFEFE 0%, #F0FDFA 30%, #F8FAFC 60%, #F1F5F9 100%)',
      }}
    >
      {/* Premium Animated Background Decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Animated Orb 1 - Teal */}
        <div 
          className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full blur-3xl animate-pulse"
          style={{ 
            background: 'radial-gradient(circle, rgba(20, 184, 166, 0.18) 0%, rgba(20, 184, 166, 0.05) 50%, transparent 70%)',
            animation: 'float 8s ease-in-out infinite',
          }}
        />
        {/* Animated Orb 2 - Gold */}
        <div 
          className="absolute -bottom-32 -left-32 w-[500px] h-[500px] rounded-full blur-3xl"
          style={{ 
            background: 'radial-gradient(circle, rgba(212, 175, 55, 0.15) 0%, rgba(212, 175, 55, 0.05) 50%, transparent 70%)',
            animation: 'float 10s ease-in-out infinite reverse',
          }}
        />
        {/* Central Glow */}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(20, 184, 166, 0.06) 0%, transparent 50%)' }}
        />
        {/* Subtle Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(rgba(20, 184, 166, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(20, 184, 166, 0.5) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      {/* CSS Animation Keyframes */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-30px) scale(1.05); }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
      `}</style>

      <div className="container mx-auto px-4 relative z-10">
        {/* ============================================
            PREMIUM HERO SECTION - Full-Width Immersive Design
            Design System: 8px spacing, premium glassmorphism
            ============================================ */}
        <div className="mb-24">
          {/* Full-Width Hero Container with Team Background */}
          <div 
            className="relative w-full rounded-[2rem] overflow-visible"
            style={{
              minHeight: '480px',
              boxShadow: '0 24px 48px -12px rgba(0, 0, 0, 0.15), 0 12px 24px -8px rgba(20, 184, 166, 0.1)',
            }}
          >
            {/* Team Background Image - FULLY VISIBLE with rounded corners */}
            <div 
              className="absolute inset-0 z-0 rounded-[2rem]"
              style={{
                backgroundImage: 'url(/images/coaches-team-background.jpg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center 25%',
                backgroundRepeat: 'no-repeat',
              }}
            />
            
            {/* Subtle Gradient Overlay - Very light to preserve image visibility */}
            <div 
              className="absolute inset-0 z-[1] rounded-[2rem]"
              style={{
                background: 'linear-gradient(180deg, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.25) 100%)',
              }}
            />
            
            {/* Hero Content - Bottom center, wide horizontal layout to show all faces clearly */}
            <div className="absolute -bottom-16 left-0 right-0 md:-bottom-20 z-[2] px-4 md:px-8 flex justify-center">
              {/* Glassmorphism Content Card - Extra wide centered layout */}
              <div 
                className="w-full max-w-4xl p-5 md:p-6 rounded-2xl text-center"
                style={{
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.90) 100%)',
                  backdropFilter: 'blur(24px)',
                  WebkitBackdropFilter: 'blur(24px)',
                  border: '1px solid rgba(255, 255, 255, 0.98)',
                  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15), 0 10px 30px rgba(20, 184, 166, 0.1), inset 0 1px 0 rgba(255, 255, 255, 1)',
                  transform: 'rotate(0.5deg)',
                }}
              >
                {/* Badge */}
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-full px-3 py-1 text-xs font-semibold mb-2 shadow-md mx-auto">
                  <span className="text-base">🎯</span>
                  {language === 'fr' ? 'Coaching personnalisé' : 'Personalized Coaching'}
                </div>
                
                {/* Title */}
                <h1 
                  className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-2"
                  style={{
                    background: 'linear-gradient(135deg, #0F766E 0%, #14B8A6 50%, #0F766E 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  {language === 'fr' ? 'Trouvez Votre Coach SLE Parfait' : 'Find Your Perfect SLE Coach'}
                </h1>
                
                {/* Tagline */}
                <p className="text-base md:text-lg text-slate-700 font-medium leading-relaxed">
                  {language === 'fr' 
                    ? 'Nos coachs sont exclusivement dédiés à la préparation aux examens ELS. Pas de dispersion, pas de généralistes—uniquement des spécialistes qui comprennent les critères du Conseil du Trésor et vous guident vers le succès.'
                    : 'Our coaches are exclusively dedicated to SLE exam preparation. No distractions, no generalists—only specialists who understand Treasury Board criteria and guide you to success.'}
                </p>
              </div>
            </div>
            
            {/* Trust Badge - Top Right Corner */}
            <div 
              className="absolute top-6 right-6 z-[2] hidden md:flex items-center gap-2 px-4 py-2 rounded-full"
              style={{
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(8px)',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
              }}
            >
              <div className="flex -space-x-2">
                {FEATURED_COACHES.slice(0, 3).map((coach, idx) => (
                  <img 
                    key={coach.id}
                    src={coach.photoUrl} 
                    alt={coach.name}
                    className="w-8 h-8 rounded-full border-2 border-white object-cover"
                    style={{ zIndex: 3 - idx }}
                  />
                ))}
              </div>
              <span className="text-sm font-semibold text-slate-700 ml-1">
                {language === 'fr' ? '6+ coachs certifiés' : '6+ Certified Coaches'}
              </span>
            </div>
          </div>
        </div>

        {/* Filter Tabs - Premium Glassmorphism Design */}
        <div 
          className="flex flex-wrap justify-center gap-2 mb-12 p-4 rounded-2xl mx-auto max-w-5xl"
          style={{
            background: 'rgba(255, 255, 255, 0.5)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.6)',
            boxShadow: '0 4px 24px rgba(0, 0, 0, 0.04)',
          }}
        >
          {[
            { key: 'clear', label: 'Clear', icon: null },
            { key: 'all', label: 'All', icon: null },
            { key: 'french', label: 'French', icon: null },
            { key: 'english', label: 'English', icon: null },
            { key: 'oral-a', label: 'Oral A', icon: '🎤' },
            { key: 'oral-b', label: 'Oral B', icon: '🎤' },
            { key: 'oral-c', label: 'Oral C', icon: '🎤' },
            { key: 'written-a', label: 'Written A', icon: '✍️' },
            { key: 'written-b', label: 'Written B', icon: '✍️' },
            { key: 'written-c', label: 'Written C', icon: '✍️' },
            { key: 'reading', label: 'Reading', icon: '📖' },
            { key: 'anxiety', label: 'Anxiety Coaching', icon: '🧘' },
          ].map((filterOption) => (
            <button
              key={filterOption.key}
              onClick={() => setFilter(filterOption.key as LanguageFilter)}
              className="px-4 py-2.5 rounded-full font-semibold text-sm transition-all duration-300 flex items-center gap-1.5 hover:scale-105 active:scale-95"
              style={{
                background: filter === filterOption.key 
                  ? 'linear-gradient(135deg, #0D9488 0%, #14B8A6 50%, #0D9488 100%)'
                  : 'rgba(255, 255, 255, 0.9)',
                color: filter === filterOption.key ? '#FFFFFF' : '#475569',
                border: filter === filterOption.key 
                  ? '1px solid rgba(20, 184, 166, 0.5)'
                  : '1px solid rgba(212, 175, 55, 0.2)',
                boxShadow: filter === filterOption.key 
                  ? '0 4px 16px rgba(13, 148, 136, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
                  : '0 2px 8px rgba(0, 0, 0, 0.04)',
                backdropFilter: 'blur(8px)',
              }}
            >
              {filterOption.icon && <span className="text-base">{filterOption.icon}</span>}
              {filterOption.label}
            </button>
          ))}
        </div>

        {/* ============================================
            COACHES GRID - Premium 2-Column Layout on Desktop
            Design System: 8px spacing, consistent gaps
            ============================================ */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
          {filteredCoaches.map((coach) => (
            <CoachCard
              key={coach.id}
              coach={coach}
              onVideoClick={() => setSelectedVideo(coach)}
              t={t}
            />
          ))}
        </div>

        {/* ============================================
            CTA BUTTONS - Dual Action Row
            ============================================ */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12">
          {/* Primary CTA - View All Coaches */}
          <Link href="/coaches">
            <button 
              className="group relative px-8 py-4 text-base font-semibold rounded-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #0D9488 0%, #14B8A6 50%, #0D9488 100%)',
                color: '#FFFFFF',
                boxShadow: '0 4px 16px rgba(13, 148, 136, 0.3)',
              }}
            >
              <span className="relative flex items-center gap-2">
                {t('coaches.viewAll')}
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </button>
          </Link>
          
          {/* Secondary CTA - Browse Coaches */}
          <Link href="/coaches">
            <button 
              className="group relative px-8 py-4 text-base font-semibold rounded-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              style={{
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(12px)',
                border: '2px solid rgba(20, 184, 166, 0.3)',
                color: '#0D9488',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
              }}
            >
              <span className="relative flex items-center gap-2">
                {language === 'fr' ? 'Parcourir les coachs' : 'Browse Coaches'}
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </button>
          </Link>
        </div>
      </div>

      {/* Video Modal */}
      {selectedVideo && (
        <VideoModal
          videoUrl={selectedVideo.videoUrl}
          coachName={selectedVideo.name}
          photoUrl={selectedVideo.photoUrl}
          subtitles={selectedVideo.subtitles}
          accentColor={selectedVideo.accentColor}
          isOpen={!!selectedVideo}
          onClose={() => setSelectedVideo(null)}
        />
      )}
    </section>
  );
}
