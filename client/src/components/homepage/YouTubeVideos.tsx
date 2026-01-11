import { useLanguage } from "@/contexts/LanguageContext";
import { ExternalLink, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface Video {
  id: string;
  titleFr: string;
  titleEn: string;
  thumbnail: string;
}

const examPrepVideos: Video[] = [
  {
    id: "LEc84vX0xe0",
    titleFr: "TCO-Partie.1 - Français",
    titleEn: "TCO Part 1 - French",
    thumbnail: "https://img.youtube.com/vi/LEc84vX0xe0/maxresdefault.jpg",
  },
  {
    id: "SuuhMpF5KoA",
    titleFr: "Évaluation du test de compétence orale",
    titleEn: "Oral Proficiency Test Assessment",
    thumbnail: "https://img.youtube.com/vi/SuuhMpF5KoA/maxresdefault.jpg",
  },
  {
    id: "rAdJZ4o_N2Y",
    titleFr: "Erreurs courantes dans les examens de langue",
    titleEn: "Common Mistakes in Language Exams",
    thumbnail: "https://img.youtube.com/vi/rAdJZ4o_N2Y/maxresdefault.jpg",
  },
];

const podcastVideos: Video[] = [
  {
    id: "dQw4w9WgXcQ",
    titleFr: "Immigrer et réussir : Le secret d'une intégration réussie",
    titleEn: "Immigrate and Succeed: The Secret to Successful Integration",
    thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
  },
  {
    id: "dQw4w9WgXcQ",
    titleFr: "Le parcours d'un pilote : Compléter mon niveau C",
    titleEn: "Pilot's Journey: Completing My C Level",
    thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
  },
  {
    id: "dQw4w9WgXcQ",
    titleFr: "Réussir les examens : Maîtrise linguistique inconsciente",
    titleEn: "Ace Exams: Unconscious Language Mastery",
    thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
  },
];

function VideoCard({ video, language }: { video: Video; language: string }) {
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
            <div className="absolute top-3 left-3 flex items-center gap-2 bg-black/60 backdrop-blur-sm rounded-full px-3 py-1">
              <div className="h-5 w-5 rounded-full bg-amber-500 flex items-center justify-center">
                <span className="text-xs font-bold text-black">B</span>
              </div>
              <span className="text-white text-xs font-medium truncate max-w-[150px]">
                {language === 'fr' ? video.titleFr : video.titleEn}
              </span>
            </div>
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

  return (
    <>
      {/* Exam Preparation Videos Section */}
      <section className="py-24 bg-slate-100 relative overflow-hidden">
        <div className="container relative z-10">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              {language === 'fr' 
                ? 'Vidéos YouTube illustratives pour la préparation aux examens du GC'
                : 'Illustrative YouTube Videos for GC Exam Preparation'}
            </h2>
            <p className="text-slate-600 max-w-4xl mx-auto leading-relaxed">
              {language === 'fr' 
                ? 'Nos vidéos YouTube sélectionnées fournissent des explications claires, des exemples pratiques et des stratégies axées sur les examens pour aider les fonctionnaires fédéraux canadiens à se préparer aux évaluations de langue seconde du GC.'
                : 'Our curated YouTube videos provide clear explanations, practical examples, and exam-focused strategies to support Canadian federal public servants in preparing for GC second language evaluations.'}
            </p>
          </div>

          {/* Videos Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {examPrepVideos.map((video, index) => (
              <VideoCard key={index} video={video} language={language} />
            ))}
          </div>

          {/* CTA Button */}
          <div className="text-center mt-12">
            <a 
              href="https://www.youtube.com/@BarholexBilingualVoices"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button 
                size="lg" 
                className="bg-amber-500 hover:bg-amber-600 text-white rounded-full px-8 h-14 text-base font-semibold shadow-lg shadow-amber-500/30 gap-2"
              >
                {language === 'fr' 
                  ? 'Approfondir avec nos vidéos YouTube'
                  : 'Dive Deeper with Our YouTube Learning Videos'}
                <ExternalLink className="h-5 w-5" />
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Podcasts Section */}
      <section className="py-24 bg-slate-200 relative overflow-hidden">
        <div className="container relative z-10">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              {language === 'fr' 
                ? 'Balados pour l\'immersion professionnelle et le développement du vocabulaire'
                : 'Podcasts for Professional Immersion and Vocabulary Development'}
            </h2>
            <p className="text-slate-600 max-w-4xl mx-auto leading-relaxed">
              {language === 'fr' 
                ? 'Nos balados vous immergent dans des thèmes liés au travail pertinents pour la fonction publique canadienne, vous aidant à élargir votre vocabulaire professionnel, à améliorer votre compréhension et à développer une maîtrise plus naturelle et confiante de votre langue seconde.'
                : 'Our podcasts immerse you in work-related themes relevant to the Canadian public service, helping you expand your professional vocabulary, improve comprehension, and develop a more natural, confident command of your second language.'}
            </p>
          </div>

          {/* Podcasts Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {podcastVideos.map((video, index) => (
              <VideoCard key={index} video={video} language={language} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
