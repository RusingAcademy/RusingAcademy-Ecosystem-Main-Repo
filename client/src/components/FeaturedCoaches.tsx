import { Link } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { Play, Star, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

// Featured coaches data (6 specific coaches as requested)
const FEATURED_COACHES = [
  {
    id: 1,
    name: "Steven Rusinga",
    slug: "steven-rusinga",
    headline: "SLE Expert | Oral Exam Specialist",
    bio: "Founder of Lingueefy with 10+ years helping federal employees achieve their SLE goals.",
    hourlyRate: 7500, // $75.00
    videoUrl: "https://www.youtube.com/watch?v=rAdJZ4o_N2Y",
    videoThumbnail: "https://img.youtube.com/vi/rAdJZ4o_N2Y/maxresdefault.jpg",
    photoUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663049070748/gvnmYNphKZgt9jM9K8Vi9K/coaches/steven-rusinga.jpg",
    rating: 4.95,
    totalSessions: 520,
  },
  {
    id: 2,
    name: "Sue-Anne Richer",
    slug: "sue-anne-richer",
    headline: "French Immersion | Conversation Expert",
    bio: "Specialized in French oral preparation with immersive conversation techniques.",
    hourlyRate: 5500, // $55.00
    videoUrl: "https://www.youtube.com/watch?v=rAdJZ4o_N2Y",
    videoThumbnail: "https://img.youtube.com/vi/rAdJZ4o_N2Y/maxresdefault.jpg",
    photoUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663049070748/gvnmYNphKZgt9jM9K8Vi9K/coaches/sue-anne-richer.jpg",
    rating: 4.90,
    totalSessions: 385,
  },
  {
    id: 3,
    name: "Erika Séguin",
    slug: "erika-seguin",
    headline: "Exam Mindset | Performance Psychology",
    bio: "Helps learners overcome exam anxiety and build confidence for test day success.",
    hourlyRate: 6000, // $60.00
    videoUrl: "https://www.youtube.com/watch?v=rAdJZ4o_N2Y",
    videoThumbnail: "https://img.youtube.com/vi/rAdJZ4o_N2Y/maxresdefault.jpg",
    photoUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663049070748/gvnmYNphKZgt9jM9K8Vi9K/coaches/erika-seguin.jpg",
    rating: 4.80,
    totalSessions: 278,
  },
  {
    id: 4,
    name: "Soukaina Haidar",
    slug: "soukaina-haidar",
    headline: "Bilingual Excellence | Written & Oral",
    bio: "Expert in both written and oral SLE preparation with a focus on bilingual fluency.",
    hourlyRate: 5500, // $55.00
    videoUrl: "https://www.youtube.com/watch?v=rAdJZ4o_N2Y",
    videoThumbnail: "https://img.youtube.com/vi/rAdJZ4o_N2Y/maxresdefault.jpg",
    photoUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663049070748/gvnmYNphKZgt9jM9K8Vi9K/coaches/soukaina-haidar.jpg",
    rating: 4.85,
    totalSessions: 312,
  },
  {
    id: 5,
    name: "Victor Amisi",
    slug: "victor-amisi",
    headline: "BBB/CBC Preparation | Oral Simulation",
    bio: "Insider insights and realistic exam simulations for consistent, confident results.",
    hourlyRate: 6000, // $60.00
    videoUrl: null,
    videoThumbnail: null,
    photoUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663049070748/gvnmYNphKZgt9jM9K8Vi9K/coaches/victor-amisi.jpg",
    rating: 4.75,
    totalSessions: 310,
  },
  {
    id: 6,
    name: "Preciosa Baganha",
    slug: "preciosa-baganha",
    headline: "Professional English | Executive Coaching",
    bio: "Elevating workplace English fluency for presentations, meetings, and leadership.",
    hourlyRate: 5800, // $58.00
    videoUrl: null,
    videoThumbnail: null,
    photoUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663049070748/gvnmYNphKZgt9jM9K8Vi9K/coaches/preciosa-baganha.jpg",
    rating: 4.67,
    totalSessions: 324,
  },
];

function CoachVideoCard({ coach }: { coach: typeof FEATURED_COACHES[0] }) {
  const { language } = useLanguage();
  const [isHovered, setIsHovered] = useState(false);
  
  const formatPrice = (cents: number) => {
    return `$${(cents / 100).toFixed(0)}`;
  };

  return (
    <div 
      className="group relative glass-card rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-teal-500/10 hover:-translate-y-2"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Video/Photo Thumbnail */}
      <div className="relative aspect-video bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 overflow-hidden">
        <img 
          src={coach.videoThumbnail || coach.photoUrl}
          alt={coach.name}
          className={`w-full h-full object-cover transition-transform duration-700 ${isHovered ? 'scale-110' : 'scale-100'}`}
        />
        
        {/* Play Button Overlay */}
        {coach.videoUrl && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-all duration-300">
            <div className={`w-16 h-16 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-xl transition-all duration-300 ${isHovered ? 'scale-110' : 'scale-100'}`}>
              <Play className="w-7 h-7 text-teal-600 ml-1" fill="currentColor" />
            </div>
          </div>
        )}
        
        {/* Rating Badge */}
        <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-sm shadow-lg">
          <Star className="w-4 h-4 text-amber-400" fill="currentColor" />
          <span className="text-sm font-semibold text-gray-800">{coach.rating.toFixed(1)}</span>
        </div>
        
        {/* Sessions Badge */}
        <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-sm">
          <span className="text-xs font-medium text-white">{coach.totalSessions} {language === "fr" ? "séances" : "lessons"}</span>
        </div>
        
        {/* Price Badge */}
        <div className="absolute bottom-3 right-3 px-3 py-1.5 rounded-full bg-teal-600 shadow-lg">
          <span className="text-sm font-bold text-white">
            {language === "fr" ? "Dès" : "From"} {formatPrice(coach.hourlyRate)}/h
          </span>
        </div>
      </div>
      
      {/* Coach Info */}
      <div className="p-5">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 group-hover:text-teal-600 transition-colors">
          {coach.name}
        </h3>
        <p className="text-sm font-medium text-teal-600 dark:text-teal-400 mb-2">
          {coach.headline}
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-4">
          {coach.bio}
        </p>
        
        {/* CTA Button */}
        <Link href={`/coaches/${coach.slug}`}>
          <Button className="w-full glass-btn text-white rounded-xl h-11 font-semibold group/btn">
            <span>{language === "fr" ? "Essayer" : "Try Now"}</span>
            <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover/btn:translate-x-1" />
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default function FeaturedCoaches() {
  const { language } = useLanguage();
  
  return (
    <section className="py-20 lg:py-28 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-teal-50/30 to-white dark:from-gray-900 dark:via-teal-900/10 dark:to-gray-900" />
      <div className="absolute top-20 left-10 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-float-delayed" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-subtle text-teal-700 dark:text-teal-400 text-sm font-medium mb-6">
            <Star className="w-4 h-4" />
            <span>{language === "fr" ? "Coachs Certifiés" : "Certified Coaches"}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            {language === "fr" ? "Trouvez Votre Tuteur de Langue Idéal" : "Find Your Perfect Language Tutor"}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {language === "fr" 
              ? "Nos coachs experts vous guident vers la réussite de vos examens SLE avec des méthodes éprouvées et un accompagnement personnalisé."
              : "Our expert coaches guide you to SLE exam success with proven methods and personalized support."}
          </p>
        </div>
        
        {/* Coach Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-12">
          {FEATURED_COACHES.map((coach) => (
            <CoachVideoCard key={coach.id} coach={coach} />
          ))}
        </div>
        
        {/* Global CTA */}
        <div className="text-center">
          <Link href="/coaches">
            <Button 
              variant="outline" 
              size="lg"
              className="glass-btn-outline rounded-full px-8 h-14 text-lg font-semibold group"
            >
              <span>{language === "fr" ? "Découvrir Tous Nos Coachs" : "Discover All Our Coaches"}</span>
              <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
