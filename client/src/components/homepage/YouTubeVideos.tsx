import { useLanguage } from "@/contexts/LanguageContext";
import { ExternalLink, Play, Clock, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef } from "react";

interface Video {
  id: string;
  titleFr: string;
  titleEn: string;
  thumbnail: string;
  duration?: string;
  views?: string;
  isShort?: boolean;
}

// Short-form videos (Shorts) from the channel
const shortFormVideos: Video[] = [
  {
    id: "shorts/1",
    titleFr: "Réussir les examens : Secrets de l'apprentissage linguistique inconscient",
    titleEn: "Ace Exams: Unconscious Language Learning Secrets Revealed",
    thumbnail: "https://img.youtube.com/vi/LEc84vX0xe0/maxresdefault.jpg",
    views: "214",
    isShort: true,
  },
  {
    id: "shorts/2",
    titleFr: "Les 4 étapes de l'apprentissage : Exemple de la conduite",
    titleEn: "The 4 Stages of Learning: Driving Example",
    thumbnail: "https://img.youtube.com/vi/SuuhMpF5KoA/maxresdefault.jpg",
    views: "378",
    isShort: true,
  },
  {
    id: "shorts/3",
    titleFr: "Immigrer et réussir : Le secret d'une carrière au Canada/USA !",
    titleEn: "Immigrate & Succeed: The Secret to a Career in Canada/USA!",
    thumbnail: "https://img.youtube.com/vi/rAdJZ4o_N2Y/maxresdefault.jpg",
    views: "1.4K",
    isShort: true,
  },
  {
    id: "shorts/4",
    titleFr: "Préparez vos examens de français : Donner votre OPINION",
    titleEn: "Prepare your French exams: Giving your OPINION",
    thumbnail: "https://img.youtube.com/vi/LEc84vX0xe0/maxresdefault.jpg",
    views: "2.1K",
    isShort: true,
  },
  {
    id: "shorts/5",
    titleFr: "Test de compétence en français : COMPARAISON",
    titleEn: "French proficiency test: COMPARISON",
    thumbnail: "https://img.youtube.com/vi/SuuhMpF5KoA/maxresdefault.jpg",
    views: "1.7K",
    isShort: true,
  },
  {
    id: "shorts/6",
    titleFr: "Erreurs courantes dans les examens de langue",
    titleEn: "Common Mistakes in Language Exams",
    thumbnail: "https://img.youtube.com/vi/rAdJZ4o_N2Y/maxresdefault.jpg",
    views: "753",
    isShort: true,
  },
];

// Long-form videos from the channel
const longFormVideos: Video[] = [
  {
    id: "LEc84vX0xe0",
    titleFr: "Coach Steven - Présentation",
    titleEn: "Coach Steven - Introduction",
    thumbnail: "https://img.youtube.com/vi/LEc84vX0xe0/maxresdefault.jpg",
    duration: "2:33",
    views: "53",
  },
  {
    id: "SuuhMpF5KoA",
    titleFr: "Coach Sue-Anne Richer",
    titleEn: "Coach Sue-Anne Richer",
    thumbnail: "https://img.youtube.com/vi/SuuhMpF5KoA/maxresdefault.jpg",
    duration: "1:45",
    views: "38",
  },
  {
    id: "rAdJZ4o_N2Y",
    titleFr: "Coach Erika",
    titleEn: "Coach Erika",
    thumbnail: "https://img.youtube.com/vi/rAdJZ4o_N2Y/maxresdefault.jpg",
    duration: "0:56",
    views: "31",
  },
  {
    id: "video4",
    titleFr: "Améliorez votre anglais GC avec Preciosa",
    titleEn: "Upgrade Your GC English with Preciosa",
    thumbnail: "https://img.youtube.com/vi/LEc84vX0xe0/maxresdefault.jpg",
    duration: "1:22",
    views: "12",
  },
  {
    id: "video5",
    titleFr: "De la promesse au lancement – RusingÂcademy",
    titleEn: "From Promise to Launch – RusingÂcademy",
    thumbnail: "https://img.youtube.com/vi/SuuhMpF5KoA/maxresdefault.jpg",
    duration: "5:30",
    views: "97",
  },
  {
    id: "video6",
    titleFr: "Coach Victor",
    titleEn: "Coach Victor",
    thumbnail: "https://img.youtube.com/vi/rAdJZ4o_N2Y/maxresdefault.jpg",
    duration: "2:12",
    views: "25",
  },
];

function ShortVideoCard({ video, language, index }: { video: Video; language: string; index: number }) {
  return (
    <div 
      className="group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-pink-500 via-red-500 to-orange-500 cursor-pointer"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="relative aspect-[9/16] max-h-[280px]">
        {/* Thumbnail */}
        <img 
          src={video.thumbnail}
          alt={language === 'fr' ? video.titleFr : video.titleEn}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        
        {/* Shorts Badge */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-red-600 rounded-full px-2.5 py-1">
          <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.77 10.32l-1.2-.5L18 9.06c1.84-.96 2.53-3.23 1.56-5.06s-3.24-2.53-5.07-1.56L6 6.94c-1.29.68-2.07 2.04-2 3.49.07 1.42.93 2.67 2.22 3.25.03.01 1.2.5 1.2.5L6 14.93c-1.83.97-2.53 3.24-1.56 5.07.97 1.83 3.24 2.53 5.07 1.56l8.5-4.5c1.29-.68 2.06-2.04 1.99-3.49-.07-1.42-.94-2.68-2.23-3.25z"/>
          </svg>
          <span className="text-white text-xs font-bold">Short</span>
        </div>
        
        {/* Views Badge */}
        <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/50 backdrop-blur-sm rounded-full px-2 py-1">
          <Eye className="w-3 h-3 text-white" />
          <span className="text-white text-xs">{video.views}</span>
        </div>
        
        {/* Play Button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="h-14 w-14 rounded-full bg-white/90 flex items-center justify-center shadow-2xl transform scale-75 group-hover:scale-100 transition-transform duration-300">
            <Play className="h-6 w-6 text-red-600 ml-1" fill="currentColor" />
          </div>
        </div>
        
        {/* Title */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <p className="text-white text-sm font-medium line-clamp-2 leading-tight">
            {language === 'fr' ? video.titleFr : video.titleEn}
          </p>
        </div>
      </div>
    </div>
  );
}

function LongVideoCard({ video, language }: { video: Video; language: string }) {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="group relative rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 bg-slate-900">
      {!isPlaying ? (
        <>
          {/* Thumbnail */}
          <div className="relative aspect-video">
            <img 
              src={video.thumbnail}
              alt={language === 'fr' ? video.titleFr : video.titleEn}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors" />
            
            {/* Duration Badge */}
            {video.duration && (
              <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-black/80 rounded px-2 py-1">
                <Clock className="w-3 h-3 text-white" />
                <span className="text-white text-xs font-medium">{video.duration}</span>
              </div>
            )}
            
            {/* Views Badge */}
            <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/50 backdrop-blur-sm rounded-full px-2 py-1">
              <Eye className="w-3 h-3 text-white" />
              <span className="text-white text-xs">{video.views} views</span>
            </div>
            
            {/* Play Button */}
            <button 
              onClick={() => setIsPlaying(true)}
              className="absolute inset-0 flex items-center justify-center"
              aria-label="Play video"
            >
              <div className="h-16 w-16 rounded-full bg-red-600 flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300">
                <Play className="h-7 w-7 text-white ml-1" fill="white" />
              </div>
            </button>

            {/* Barholex Logo Badge */}
            <div className="absolute top-3 left-3 flex items-center gap-2 bg-black/60 backdrop-blur-sm rounded-full px-3 py-1.5">
              <div className="h-6 w-6 rounded-full bg-amber-500 flex items-center justify-center">
                <span className="text-sm font-bold text-black">B</span>
              </div>
              <span className="text-white text-xs font-medium">Barholex</span>
            </div>
          </div>
          
          {/* Title */}
          <div className="p-4 bg-slate-800">
            <h4 className="text-white font-medium line-clamp-2">
              {language === 'fr' ? video.titleFr : video.titleEn}
            </h4>
          </div>
        </>
      ) : (
        <div className="aspect-video">
          <iframe
            src={`https://www.youtube.com/embed/${video.id}?autoplay=1`}
            title={language === 'fr' ? video.titleFr : video.titleEn}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          />
        </div>
      )}
    </div>
  );
}

export default function YouTubeVideos() {
  const { language } = useLanguage();
  const [currentShortIndex, setCurrentShortIndex] = useState(0);
  const shortsContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll shorts every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentShortIndex((prev) => (prev + 1) % shortFormVideos.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Short-Form Videos Section */}
      <section className="py-24 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-red-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
        
        <div className="container relative z-10">
          {/* Section Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-red-600/20 border border-red-500/30 rounded-full px-4 py-2 mb-4">
              <svg className="w-5 h-5 text-red-500" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.77 10.32l-1.2-.5L18 9.06c1.84-.96 2.53-3.23 1.56-5.06s-3.24-2.53-5.07-1.56L6 6.94c-1.29.68-2.07 2.04-2 3.49.07 1.42.93 2.67 2.22 3.25.03.01 1.2.5 1.2.5L6 14.93c-1.83.97-2.53 3.24-1.56 5.07.97 1.83 3.24 2.53 5.07 1.56l8.5-4.5c1.29-.68 2.06-2.04 1.99-3.49-.07-1.42-.94-2.68-2.23-3.25z"/>
              </svg>
              <span className="text-red-400 font-semibold text-sm">YouTube Shorts</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {language === 'fr' 
                ? 'Conseils rapides pour la préparation aux examens'
                : 'Quick Tips for Exam Preparation'}
            </h2>
            <p className="text-slate-400 max-w-3xl mx-auto leading-relaxed">
              {language === 'fr' 
                ? 'Des vidéos courtes et percutantes avec des conseils pratiques pour réussir vos examens de langue seconde.'
                : 'Short, impactful videos with practical tips to help you succeed in your second language exams.'}
            </p>
          </div>

          {/* Shorts Carousel */}
          <div className="relative">
            <div 
              ref={shortsContainerRef}
              className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {shortFormVideos.map((video, index) => (
                <div key={index} className="flex-shrink-0 w-48 snap-start">
                  <ShortVideoCard video={video} language={language} index={index} />
                </div>
              ))}
              {/* Duplicate for infinite scroll effect */}
              {shortFormVideos.map((video, index) => (
                <div key={`dup-${index}`} className="flex-shrink-0 w-48 snap-start">
                  <ShortVideoCard video={video} language={language} index={index + shortFormVideos.length} />
                </div>
              ))}
            </div>
          </div>

          {/* CTA Button */}
          <div className="text-center mt-12">
            <a 
              href="https://www.youtube.com/@BarholexGCExamCoach/shorts"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 text-white rounded-full px-8 h-14 text-base font-semibold shadow-lg shadow-red-500/30 gap-2"
              >
                {language === 'fr' 
                  ? 'Voir tous les Shorts'
                  : 'View All Shorts'}
                <ExternalLink className="h-5 w-5" />
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Long-Form Videos Section */}
      <section className="py-24 bg-slate-100 relative overflow-hidden">
        <div className="container relative z-10">
          {/* Section Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-500/30 rounded-full px-4 py-2 mb-4">
              <Play className="w-5 h-5 text-amber-600" fill="currentColor" />
              <span className="text-amber-700 font-semibold text-sm">
                {language === 'fr' ? 'Vidéos complètes' : 'Full Videos'}
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              {language === 'fr' 
                ? 'Rencontrez nos coachs et apprenez en profondeur'
                : 'Meet Our Coaches & Learn In-Depth'}
            </h2>
            <p className="text-slate-600 max-w-4xl mx-auto leading-relaxed">
              {language === 'fr' 
                ? 'Découvrez nos coachs experts et leurs méthodes d\'enseignement à travers des vidéos détaillées. Chaque coach apporte une expertise unique pour vous aider à réussir vos examens SLE.'
                : 'Discover our expert coaches and their teaching methods through detailed videos. Each coach brings unique expertise to help you succeed in your SLE exams.'}
            </p>
          </div>

          {/* Videos Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {longFormVideos.map((video, index) => (
              <LongVideoCard key={index} video={video} language={language} />
            ))}
          </div>

          {/* CTA Button */}
          <div className="text-center mt-12">
            <a 
              href="https://www.youtube.com/@BarholexGCExamCoach"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button 
                size="lg" 
                className="bg-amber-500 hover:bg-amber-600 text-white rounded-full px-8 h-14 text-base font-semibold shadow-lg shadow-amber-500/30 gap-2"
              >
                {language === 'fr' 
                  ? 'Visiter notre chaîne YouTube'
                  : 'Visit Our YouTube Channel'}
                <ExternalLink className="h-5 w-5" />
              </Button>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
