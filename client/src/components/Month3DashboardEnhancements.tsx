import { motion } from 'framer-motion';
import { 
  CheckCircle2, 
  Clock, 
  Zap, 
  Award, 
  Calendar, 
  Video, 
  Play, 
  TrendingUp,
  Target,
  Headphones,
  FileText,
  GraduationCap,
  ChevronRight,
  Trophy
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { PremiumCard, AnimatedCounter } from '@/components/Month3Components';
import { cn } from '@/lib/utils';

/**
 * Month 3 Premium Enhancements for Dashboard
 * Data visualization and progress tracking components
 */

interface DashboardStatsProps {
  stats: Array<{
    label: string;
    value: number;
    icon: any;
    color: string;
    bg: string;
  }>;
}

export const DashboardStatsGrid = ({ stats }: DashboardStatsProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, idx) => (
        <PremiumCard key={idx} delay={idx * 0.1} className="p-6 bg-white border-none shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4">
            <div className={cn('p-3 rounded-2xl', stat.bg)}>
              <stat.icon className={cn('h-6 w-6', stat.color)} />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
              <div className="text-2xl font-bold text-slate-900">
                <AnimatedCounter value={stat.value} label="" />
              </div>
            </div>
          </div>
        </PremiumCard>
      ))}
    </div>
  );
};

interface ProgressCardProps {
  title: string;
  subtitle: string;
  overallProgress: number;
  subSkills: Array<{
    label: string;
    value: number;
    color: string;
  }>;
  language: string;
}

export const ProgressTrackingCard = ({ 
  title, 
  subtitle, 
  overallProgress, 
  subSkills, 
  language 
}: ProgressCardProps) => {
  const isFrench = language === 'fr';

  return (
    <PremiumCard className="p-8 bg-white border-none shadow-lg">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-teal-600" />
          {title}
        </h2>
        <Badge className="bg-teal-50 text-teal-700 border-none px-3 py-1">
          {subtitle}
        </Badge>
      </div>
      
      <div className="flex flex-col md:flex-row items-center gap-10">
        {/* Progress Ring */}
        <div className="relative w-40 h-40 flex-shrink-0">
          <svg className="w-full h-full -rotate-90">
            <circle
              cx="80"
              cy="80"
              r="70"
              stroke="currentColor"
              strokeWidth="12"
              fill="none"
              className="text-slate-100"
            />
            <circle
              cx="80"
              cy="80"
              r="70"
              stroke="currentColor"
              strokeWidth="12"
              fill="none"
              strokeDasharray={`${2 * Math.PI * 70}`}
              strokeDashoffset={`${2 * Math.PI * 70 * (1 - overallProgress / 100)}`}
              className="text-teal-600 transition-all duration-1000"
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center flex-col">
            <span className="text-3xl font-bold text-slate-900">{overallProgress}%</span>
            <span className="text-xs text-slate-500">{isFrench ? 'Total' : 'Total'}</span>
          </div>
        </div>
        
        {/* Sub-skills Progress */}
        <div className="flex-1 w-full space-y-6">
          {subSkills.map((skill, i) => (
            <div key={i} className="space-y-2">
              <div className="flex justify-between text-sm font-medium">
                <span className="text-slate-700">{skill.label}</span>
                <span className="text-slate-400">{skill.value}%</span>
              </div>
              <Progress value={skill.value} className={cn('h-2 bg-slate-100', skill.color)} />
            </div>
          ))}
        </div>
      </div>
    </PremiumCard>
  );
};

interface UpcomingSessionCardProps {
  sessionTitle: string;
  sessionTime: string;
  coachName: string;
  sessionFocus: string;
  language: string;
  onJoin: () => void;
}

export const UpcomingSessionCard = ({ 
  sessionTitle, 
  sessionTime, 
  coachName, 
  sessionFocus, 
  language,
  onJoin 
}: UpcomingSessionCardProps) => {
  const isFrench = language === 'fr';

  return (
    <PremiumCard className="p-6 bg-slate-900 text-white border-none overflow-hidden relative">
      <div className="relative z-10">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Calendar className="h-5 w-5 text-teal-400" />
          {isFrench ? 'Prochaine session' : 'Upcoming Session'}
        </h3>
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 mb-6">
          <p className="text-teal-400 text-xs font-bold uppercase tracking-widest mb-1">
            {sessionTime}
          </p>
          <h4 className="text-xl font-bold mb-1">{sessionTitle}</h4>
          <p className="text-white/60 text-sm mb-2">{coachName}</p>
          <p className="text-white/80 text-sm">{sessionFocus}</p>
        </div>
        <Button 
          onClick={onJoin}
          className="w-full bg-teal-500 hover:bg-teal-400 text-white rounded-xl"
        >
          {isFrench ? 'Rejoindre l\'appel' : 'Join Zoom Call'}
        </Button>
      </div>
      <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-teal-500/20 rounded-full blur-3xl" />
    </PremiumCard>
  );
};

interface QuickResourcesProps {
  resources: Array<{
    icon: any;
    label: string;
    color: string;
    href: string;
  }>;
  language: string;
}

export const QuickResourcesSidebar = ({ resources, language }: QuickResourcesProps) => {
  const isFrench = language === 'fr';

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-50">
      <h3 className="font-bold text-slate-900 mb-6 flex items-center justify-between">
        {isFrench ? 'Ressources rapides' : 'Quick Resources'}
        <a href="/library" className="text-xs text-teal-600 hover:underline">
          {isFrench ? 'Voir tout' : 'View All'}
        </a>
      </h3>
      <div className="space-y-4">
        {resources.map((item, i) => (
          <a
            key={i}
            href={item.href}
            className="w-full flex items-center gap-4 p-3 rounded-2xl hover:bg-slate-50 transition-colors text-left group"
          >
            <div className={cn('p-2 rounded-xl bg-slate-50 group-hover:bg-white group-hover:shadow-sm transition-all', item.color)}>
              <item.icon className="h-5 w-5" />
            </div>
            <span className="font-medium text-slate-700">{item.label}</span>
            <ChevronRight className="h-4 w-4 ml-auto text-slate-300 group-hover:text-teal-600 transition-colors" />
          </a>
        ))}
      </div>
    </div>
  );
};

interface WeeklyChallengeProps {
  title: string;
  description: string;
  progress: number;
  total: number;
  language: string;
}

export const WeeklyChallengeCard = ({ 
  title, 
  description, 
  progress, 
  total, 
  language 
}: WeeklyChallengeProps) => {
  const isFrench = language === 'fr';
  const percentage = (progress / total) * 100;

  return (
    <PremiumCard className="p-6 bg-teal-600 text-white border-none">
      <Trophy className="h-12 w-12 text-teal-200 mb-4" />
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-teal-100 text-sm mb-6">{description}</p>
      <div className="bg-black/10 rounded-full h-2 mb-2">
        <div 
          className="bg-white h-full rounded-full transition-all duration-500" 
          style={{ width: `${percentage}%` }}
        />
      </div>
      <p className="text-xs text-right font-bold">{progress}/{total}</p>
    </PremiumCard>
  );
};
