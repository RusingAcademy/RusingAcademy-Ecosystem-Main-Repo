import { useAuth, useUser } from '@clerk/clerk-react';
import { useEffect } from 'react';
import { useLocation, Link } from 'wouter';
import SEO from '@/components/SEO';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  MessageSquare, 
  TrendingUp, 
  Calendar,
  Award,
  Clock,
  ArrowRight,
  User,
  Settings,
  LogOut
} from 'lucide-react';
import FooterInstitutional from '@/components/FooterInstitutional';

// Design tokens from design-tokens.json v3.0
const tokens = {
  colors: {
    bg: { canvas: '#FEFEF8', surface: '#FFFFFF' },
    text: { primary: '#0B1220', secondary: '#3A4456', muted: '#6B7280', onDark: '#FFFFFF' },
    accent: { navy: '#0F2A44', teal: '#0E7490', violet: '#6D28D9', orangeCTA: '#F7941D' },
    border: { subtle: '#E7E7DF', strong: '#D3D3C9' },
    glass: { bg: 'rgba(255,255,255,0.72)', border: 'rgba(255,255,255,0.55)' }
  },
  radius: { sm: '10px', md: '16px', lg: '24px', pill: '999px' },
  shadow: { 
    2: '0 6px 18px rgba(15, 23, 42, 0.10)',
    3: '0 16px 40px rgba(15, 23, 42, 0.14)',
  }
};

const labels = {
  en: {
    title: 'Dashboard',
    welcome: 'Welcome back',
    subtitle: 'Your learning journey at a glance',
    stats: {
      courses: 'Active Courses',
      sessions: 'Coaching Sessions',
      progress: 'Overall Progress',
      streak: 'Day Streak'
    },
    quickActions: {
      title: 'Quick Actions',
      items: [
        { icon: 'BookOpen', title: 'Continue Learning', desc: 'Pick up where you left off', href: '/courses' },
        { icon: 'MessageSquare', title: 'Book Coaching', desc: 'Schedule your next session', href: '/booking' },
        { icon: 'TrendingUp', title: 'View Progress', desc: 'Track your improvements', href: '/progress' },
        { icon: 'Calendar', title: 'Upcoming Sessions', desc: 'See your schedule', href: '/schedule' },
      ]
    },
    recentActivity: {
      title: 'Recent Activity',
      empty: 'No recent activity. Start learning to see your progress here!'
    },
    seo: {
      title: 'Dashboard - RusingÂcademy',
      description: 'Access your RusingÂcademy dashboard to track progress, manage courses, and schedule coaching sessions.'
    }
  },
  fr: {
    title: 'Tableau de Bord',
    welcome: 'Bienvenue',
    subtitle: 'Votre parcours d\'apprentissage en un coup d\'œil',
    stats: {
      courses: 'Cours Actifs',
      sessions: 'Sessions de Coaching',
      progress: 'Progrès Global',
      streak: 'Jours Consécutifs'
    },
    quickActions: {
      title: 'Actions Rapides',
      items: [
        { icon: 'BookOpen', title: 'Continuer l\'apprentissage', desc: 'Reprenez là où vous étiez', href: '/courses' },
        { icon: 'MessageSquare', title: 'Réserver un coaching', desc: 'Planifiez votre prochaine session', href: '/booking' },
        { icon: 'TrendingUp', title: 'Voir les progrès', desc: 'Suivez vos améliorations', href: '/progress' },
        { icon: 'Calendar', title: 'Sessions à venir', desc: 'Consultez votre calendrier', href: '/schedule' },
      ]
    },
    recentActivity: {
      title: 'Activité Récente',
      empty: 'Aucune activité récente. Commencez à apprendre pour voir vos progrès ici!'
    },
    seo: {
      title: 'Tableau de Bord - RusingÂcademy',
      description: 'Accédez à votre tableau de bord RusingÂcademy pour suivre vos progrès, gérer vos cours et planifier vos sessions de coaching.'
    }
  }
};

const iconMap: Record<string, React.ElementType> = {
  BookOpen,
  MessageSquare,
  TrendingUp,
  Calendar,
};

export default function ProtectedDashboard() {
  const { language } = useLanguage();
  const { isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();
  const [, setLocation] = useLocation();
  
  const t = labels[language as 'en' | 'fr'] || labels.en;

  // Redirect to sign-in if not authenticated
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      setLocation('/sign-in');
    }
  }, [isLoaded, isSignedIn, setLocation]);

  // Show loading state while checking auth
  if (!isLoaded) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: tokens.colors.bg.canvas }}
      >
        <div className="text-center">
          <div 
            className="w-12 h-12 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-4"
            style={{ borderColor: `${tokens.colors.accent.navy} transparent ${tokens.colors.accent.navy} ${tokens.colors.accent.navy}` }}
          />
          <p style={{ color: tokens.colors.text.secondary }}>
            {language === 'fr' ? 'Chargement...' : 'Loading...'}
          </p>
        </div>
      </div>
    );
  }

  // Don't render if not signed in (will redirect)
  if (!isSignedIn) {
    return null;
  }

  const firstName = user?.firstName || user?.username || 'Learner';

  // Mock stats for now
  const stats = [
    { label: t.stats.courses, value: '2', icon: BookOpen },
    { label: t.stats.sessions, value: '4', icon: MessageSquare },
    { label: t.stats.progress, value: '45%', icon: TrendingUp },
    { label: t.stats.streak, value: '7', icon: Clock },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: tokens.colors.bg.canvas }}>
      <SEO
        title={t.seo.title}
        description={t.seo.description}
      />

      {/* Dashboard Header */}
      <header 
        className="border-b"
        style={{ 
          backgroundColor: tokens.colors.bg.surface,
          borderColor: tokens.colors.border.subtle 
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 
                className="text-2xl md:text-3xl font-bold"
                style={{ color: tokens.colors.text.primary }}
              >
                {t.welcome}, {firstName}!
              </h1>
              <p style={{ color: tokens.colors.text.secondary }}>
                {t.subtitle}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/settings">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 rounded-full"
                  style={{ backgroundColor: `${tokens.colors.accent.navy}08` }}
                >
                  <Settings className="w-5 h-5" style={{ color: tokens.colors.text.secondary }} />
                </motion.button>
              </Link>
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ backgroundColor: tokens.colors.accent.navy }}
              >
                {user?.imageUrl ? (
                  <img 
                    src={user.imageUrl} 
                    alt={firstName}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <User className="w-5 h-5 text-white" />
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-6 rounded-2xl"
                style={{ 
                  backgroundColor: tokens.colors.bg.surface,
                  border: `1px solid ${tokens.colors.border.subtle}`,
                  boxShadow: tokens.shadow[2]
                }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${tokens.colors.accent.navy}10` }}
                  >
                    <Icon className="w-5 h-5" style={{ color: tokens.colors.accent.navy }} />
                  </div>
                </div>
                <div 
                  className="text-3xl font-bold mb-1"
                  style={{ color: tokens.colors.text.primary }}
                >
                  {stat.value}
                </div>
                <div 
                  className="text-sm"
                  style={{ color: tokens.colors.text.muted }}
                >
                  {stat.label}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <section className="mb-8">
          <h2 
            className="text-xl font-bold mb-4"
            style={{ color: tokens.colors.text.primary }}
          >
            {t.quickActions.title}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {t.quickActions.items.map((action, index) => {
              const Icon = iconMap[action.icon] || BookOpen;
              return (
                <Link key={index} href={action.href}>
                  <motion.div
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="p-6 rounded-2xl cursor-pointer transition-all"
                    style={{ 
                      backgroundColor: tokens.colors.bg.surface,
                      border: `1px solid ${tokens.colors.border.subtle}`,
                      boxShadow: tokens.shadow[2]
                    }}
                  >
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                      style={{ backgroundColor: `${tokens.colors.accent.teal}15` }}
                    >
                      <Icon className="w-6 h-6" style={{ color: tokens.colors.accent.teal }} />
                    </div>
                    <h3 
                      className="font-semibold mb-1"
                      style={{ color: tokens.colors.text.primary }}
                    >
                      {action.title}
                    </h3>
                    <p 
                      className="text-sm"
                      style={{ color: tokens.colors.text.muted }}
                    >
                      {action.desc}
                    </p>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Recent Activity */}
        <section>
          <h2 
            className="text-xl font-bold mb-4"
            style={{ color: tokens.colors.text.primary }}
          >
            {t.recentActivity.title}
          </h2>
          <div 
            className="p-8 rounded-2xl text-center"
            style={{ 
              backgroundColor: tokens.colors.bg.surface,
              border: `1px solid ${tokens.colors.border.subtle}`,
              boxShadow: tokens.shadow[2]
            }}
          >
            <Award 
              className="w-12 h-12 mx-auto mb-4" 
              style={{ color: tokens.colors.text.muted }} 
            />
            <p style={{ color: tokens.colors.text.secondary }}>
              {t.recentActivity.empty}
            </p>
            <Link href="/courses">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="mt-4 px-6 py-3 rounded-full font-semibold flex items-center gap-2 mx-auto"
                style={{ 
                  backgroundColor: tokens.colors.accent.navy,
                  color: tokens.colors.text.onDark
                }}
              >
                {language === 'fr' ? 'Commencer' : 'Get Started'}
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </Link>
          </div>
        </section>
      </main>

      <FooterInstitutional />
    </div>
  );
}
