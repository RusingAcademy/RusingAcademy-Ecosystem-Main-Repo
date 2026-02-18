import { motion } from 'framer-motion';
import { Star, Linkedin, Calendar, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PremiumCard, MagneticButton } from '@/components/Month3Components';
import { cn } from '@/lib/utils';

/**
 * Month 3 Premium Enhancements for Coaches Page
 * Modular components that can be integrated into existing Coaches.tsx
 */

interface CoachCardEnhancedProps {
  coach: any;
  language: string;
  isHovered: boolean;
  onHover: (id: number | null) => void;
  onBookSession: (coachId: number) => void;
  onStartConversation: (coachId: number) => void;
  imgError: boolean;
  onImgError: () => void;
}

export const CoachCardEnhanced = ({
  coach,
  language,
  isHovered,
  onHover,
  onBookSession,
  onStartConversation,
  imgError,
  onImgError
}: CoachCardEnhancedProps) => {
  const isFrench = language === 'fr';
  
  // Availability logic
  const getAvailability = () => {
    if (coach.availableNow) return { label: isFrench ? 'Disponible' : 'Available Now', color: 'green' };
    if (coach.nextAvailableSlot) return { label: isFrench ? 'Bientôt' : 'Soon', color: 'amber' };
    return { label: isFrench ? 'Sur demande' : 'On Request', color: 'blue' };
  };
  
  const availability = getAvailability();
  const rating = coach.averageRating || 4.8;
  const reviewCount = coach.totalReviews || 0;

  return (
    <PremiumCard 
      delay={0.1}
      className="group overflow-hidden border-none shadow-lg hover:shadow-2xl transition-all duration-500"
      onMouseEnter={() => onHover(coach.id)}
      onMouseLeave={() => onHover(null)}
    >
      {/* Gradient border effect on hover */}
      <div className={cn(
        "absolute inset-0 bg-gradient-to-r from-teal-500 via-emerald-500 to-cyan-500 rounded-2xl transition-opacity duration-300",
        isHovered ? "opacity-100" : "opacity-0"
      )} style={{ padding: '2px' }}>
        <div className="absolute inset-[2px] bg-white rounded-[14px]" />
      </div>

      <div className="relative flex flex-col lg:flex-row">
        {/* Photo Section */}
        <div className="lg:w-64 relative overflow-hidden">
          <div className="aspect-[4/3] lg:aspect-auto lg:h-full min-h-[200px] lg:min-h-[240px] relative bg-slate-100">
            {imgError ? (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-teal-100 to-emerald-100">
                <div className="text-center">
                  <div className="w-16 h-16 bg-teal-200 rounded-full mx-auto mb-2 flex items-center justify-center">
                    <span className="text-2xl font-bold text-teal-700">{coach.name?.charAt(0) || 'C'}</span>
                  </div>
                  <span className="text-sm text-teal-600 font-medium">{coach.name}</span>
                </div>
              </div>
            ) : (
              <img
                src={coach.photoUrl || coach.avatarUrl || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400'}
                alt={coach.name || 'Coach'}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                onError={onImgError}
              />
            )}
            
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-teal-950/20" />
            
            {/* Availability badge */}
            <div className="absolute top-4 left-4">
              <Badge className={cn(
                "backdrop-blur-md border-none",
                availability.color === 'green' && "bg-green-500/90 text-white",
                availability.color === 'amber' && "bg-amber-500/90 text-white",
                availability.color === 'blue' && "bg-blue-500/90 text-white"
              )}>
                {availability.color === 'green' && <span className="w-2 h-2 rounded-full bg-white animate-pulse mr-1.5" />}
                {availability.color !== 'green' && <Calendar className="w-3 h-3 mr-1" />}
                {availability.label}
              </Badge>
            </div>

            {/* Rating badge */}
            <div className="absolute top-4 right-4">
              <Badge className="bg-white/90 backdrop-blur-md text-slate-900 border-none">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 mr-1" />
                {rating.toFixed(1)}
              </Badge>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="flex-1 p-6 flex flex-col">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-slate-900 mb-1 group-hover:text-teal-600 transition-colors">
                {coach.name}
              </h3>
              <p className="text-sm text-slate-500">{coach.title || (isFrench ? 'Coach SLE Certifié' : 'Certified SLE Coach')}</p>
            </div>
            {coach.linkedinUrl && (
              <a 
                href={coach.linkedinUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 rounded-full hover:bg-blue-50 transition-colors"
              >
                <Linkedin className="w-5 h-5 text-blue-600" />
              </a>
            )}
          </div>

          {/* Specializations */}
          <div className="flex flex-wrap gap-2 mb-4">
            {(coach.specializations || ['Oral', 'Written', 'Reading']).slice(0, 3).map((spec: string, idx: number) => (
              <Badge key={idx} variant="outline" className="bg-teal-50 text-teal-700 border-teal-200">
                {spec}
              </Badge>
            ))}
          </div>

          {/* Bio */}
          <p className="text-sm text-slate-600 mb-4 line-clamp-3 flex-1">
            {isFrench ? coach.bioFr : coach.bioEn || coach.bio || (isFrench 
              ? "Expert en préparation aux examens SLE avec plus de 10 ans d'expérience dans la fonction publique canadienne."
              : "Expert in SLE exam preparation with over 10 years of experience in the Canadian public service."
            )}
          </p>

          {/* Stats */}
          <div className="flex items-center gap-6 mb-6 text-sm text-slate-500">
            <span className="flex items-center gap-1">
              <Star className="w-4 h-4 text-amber-500" />
              {rating} ({reviewCount}+ {isFrench ? 'avis' : 'reviews'})
            </span>
            <span className="flex items-center gap-1">
              <MessageSquare className="w-4 h-4 text-teal-500" />
              {coach.totalSessions || '50'}+ {isFrench ? 'sessions' : 'sessions'}
            </span>
          </div>

          {/* CTAs */}
          <div className="flex gap-3 mt-auto">
            <MagneticButton>
              <Button 
                onClick={() => onBookSession(coach.id)}
                className="flex-1 bg-teal-600 hover:bg-teal-700 text-white rounded-xl"
              >
                {isFrench ? 'Réserver' : 'Book Session'}
              </Button>
            </MagneticButton>
            <Button 
              onClick={() => onStartConversation(coach.id)}
              variant="outline"
              className="rounded-xl border-slate-200 hover:bg-slate-50"
            >
              <MessageSquare className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </PremiumCard>
  );
};

export const CoachesHeroEnhanced = ({ language }: { language: string }) => {
  const isFrench = language === 'fr';
  
  return (
    <section className="relative overflow-hidden py-20 md:py-28 bg-gradient-to-br from-teal-600 via-teal-700 to-emerald-800">
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-300 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="container mx-auto px-6 md:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center text-white"
        >
          <Badge className="bg-white/10 backdrop-blur-md text-white border-white/20 mb-6 px-4 py-2">
            {isFrench ? 'Coachs Experts SLE' : 'Expert SLE Coaches'}
          </Badge>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            {isFrench ? (
              <>Trouvez votre <span className="text-amber-300">coach parfait</span></>
            ) : (
              <>Find Your <span className="text-amber-300">Perfect Coach</span></>
            )}
          </h1>
          
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            {isFrench 
              ? "Experts certifiés dédiés à votre réussite aux examens SLE et à votre excellence bilingue."
              : "Certified experts dedicated to your SLE exam success and bilingual excellence."
            }
          </p>

          {/* Stats */}
          <div className="flex justify-center gap-8 mt-10">
            {[
              { value: '45+', label: isFrench ? 'Coachs' : 'Coaches' },
              { value: '95%', label: isFrench ? 'Taux de réussite' : 'Success Rate' },
              { value: '10k+', label: isFrench ? 'Sessions' : 'Sessions' }
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl font-bold text-amber-300">{stat.value}</div>
                <div className="text-sm text-white/70">{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
