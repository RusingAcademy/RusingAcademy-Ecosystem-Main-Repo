import { motion, AnimatePresence } from 'framer-motion';
import { Play, ArrowRight, Video, BookOpen, Sparkles, FileText, Grid, List } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PremiumCard, MagneticButton } from '@/components/Month3Components';
import { cn } from '@/lib/utils';

/**
 * Month 3 Premium Enhancements for Library Page
 * Masonry-style grid and enhanced resource cards
 */

interface LibraryResourceCardProps {
  item: any;
  language: string;
  viewMode: 'grid' | 'list';
  onSelect: (item: any) => void;
  delay?: number;
}

export const LibraryResourceCard = ({ 
  item, 
  language, 
  viewMode, 
  onSelect, 
  delay = 0 
}: LibraryResourceCardProps) => {
  const isFrench = language === 'fr';
  const title = isFrench ? item.title_fr : item.title_en;
  const description = isFrench ? item.short_desc_fr : item.short_desc_en;

  const typeIcons: Record<string, any> = {
    video: Video,
    book: BookOpen,
    course: Sparkles,
    download: FileText
  };

  const TypeIcon = typeIcons[item.type] || BookOpen;

  return (
    <PremiumCard 
      delay={delay}
      className={cn(
        'group overflow-hidden flex cursor-pointer',
        viewMode === 'grid' ? 'flex-col' : 'flex-row h-48'
      )}
      onClick={() => onSelect(item)}
    >
      <div className={cn(
        'relative bg-slate-100 overflow-hidden',
        viewMode === 'grid' ? 'h-56' : 'w-64 h-full'
      )}>
        <img loading="lazy" 
          src={item.cover_image || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1974&auto=format&fit=crop'} 
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        {item.type === 'video' && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-all">
            <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 group-hover:scale-110 transition-transform">
              <Play className="h-8 w-8 text-white fill-white" />
            </div>
          </div>
        )}
        
        <div className="absolute top-4 left-4">
          <Badge className="bg-white/90 backdrop-blur-md text-slate-900 border-none uppercase text-xs font-bold">
            {item.type}
          </Badge>
        </div>
      </div>

      <div className="p-6 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold text-slate-900 group-hover:text-teal-600 transition-colors line-clamp-1">
            {title}
          </h3>
        </div>
        
        <p className="text-slate-500 text-sm line-clamp-2 mb-6 flex-1">
          {description}
        </p>
        
        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs font-bold text-teal-600 bg-teal-50 border-teal-200">
              {item.level || 'ALL LEVELS'}
            </Badge>
          </div>
          
          <MagneticButton>
            <Button 
              variant="ghost" 
              className="text-slate-900 group-hover:text-teal-600 p-0 h-auto font-bold flex items-center gap-1"
            >
              {isFrench ? 'Accéder' : 'Access'}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </MagneticButton>
        </div>
      </div>
    </PremiumCard>
  );
};

interface LibraryFilterBarProps {
  activeType: string;
  setActiveType: (type: string) => void;
  viewMode: 'grid' | 'list';
  setViewMode: (mode: 'grid' | 'list') => void;
  language: string;
}

export const LibraryFilterBar = ({ 
  activeType, 
  setActiveType, 
  viewMode, 
  setViewMode, 
  language 
}: LibraryFilterBarProps) => {
  const isFrench = language === 'fr';

  const typeLabels: Record<string, { en: string, fr: string, icon: any }> = {
    all: { en: 'All Resources', fr: 'Toutes les ressources', icon: Sparkles },
    video: { en: 'Learning Capsules', fr: 'Capsules d\'apprentissage', icon: Video },
    book: { en: 'E-Books & Guides', fr: 'E-Books & Guides', icon: BookOpen },
    course: { en: 'Mini-Courses', fr: 'Mini-Cours', icon: Sparkles },
    download: { en: 'Worksheets', fr: 'Fiches de travail', icon: FileText }
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12 bg-white/80 backdrop-blur-xl p-4 rounded-3xl border border-white shadow-xl">
      <div className="flex flex-wrap gap-2">
        {(['all', 'video', 'book', 'course', 'download'] as const).map(type => {
          const Label = typeLabels[type];
          const Icon = Label.icon;
          return (
            <button
              key={type}
              onClick={() => setActiveType(type)}
              className={cn(
                'flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all',
                activeType === type 
                  ? 'bg-teal-600 text-white shadow-lg scale-105' 
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              )}
            >
              <Icon className="h-4 w-4" />
              {isFrench ? Label.fr : Label.en}
            </button>
          );
        })}
      </div>
      
      <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
        <button 
          onClick={() => setViewMode('grid')}
          className={cn(
            'p-2 rounded-lg transition-all', 
            viewMode === 'grid' ? 'bg-white shadow-sm text-teal-600' : 'text-slate-400'
          )}
        >
          <Grid className="h-5 w-5" />
        </button>
        <button 
          onClick={() => setViewMode('list')}
          className={cn(
            'p-2 rounded-lg transition-all', 
            viewMode === 'list' ? 'bg-white shadow-sm text-teal-600' : 'text-slate-400'
          )}
        >
          <List className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export const LibraryHeroEnhanced = ({ language }: { language: string }) => {
  const isFrench = language === 'fr';

  return (
    <section className="relative overflow-hidden py-20 md:py-28 bg-gradient-to-br from-slate-900 via-slate-800 to-teal-900">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-400 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-400 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-6 md:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center text-white"
        >
          <Badge className="bg-white/10 backdrop-blur-md text-white border-white/20 mb-6 px-4 py-2">
            {isFrench ? 'Bibliothèque de Ressources' : 'Resource Library'}
          </Badge>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            {isFrench ? (
              <>Votre arsenal <span className="text-teal-300">d'apprentissage</span></>
            ) : (
              <>Your Learning <span className="text-teal-300">Arsenal</span></>
            )}
          </h1>
          
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            {isFrench 
              ? 'Accédez à notre collection exclusive de capsules vidéo, guides PDF et outils d\'apprentissage.'
              : 'Access our exclusive collection of video capsules, PDF guides, and learning tools.'
            }
          </p>
        </motion.div>
      </div>
    </section>
  );
};
