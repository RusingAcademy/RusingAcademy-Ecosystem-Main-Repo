import { SignIn as ClerkSignIn, useAuth } from '@clerk/clerk-react';
import { useEffect } from 'react';
import { useLocation } from 'wouter';
import SEO from '@/components/SEO';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'wouter';

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
    glass: '0 10px 30px rgba(15, 23, 42, 0.10)'
  }
};

const labels = {
  en: {
    title: 'Sign In',
    subtitle: 'Welcome back to RusingÂcademy',
    backToHome: 'Back to Home',
    noAccount: 'Don\'t have an account?',
    signUp: 'Sign up',
    seo: {
      title: 'Sign In - RusingÂcademy',
      description: 'Sign in to your RusingÂcademy account to access your courses, coaching sessions, and learning progress.'
    }
  },
  fr: {
    title: 'Connexion',
    subtitle: 'Bienvenue sur RusingÂcademy',
    backToHome: 'Retour à l\'accueil',
    noAccount: 'Vous n\'avez pas de compte?',
    signUp: 'S\'inscrire',
    seo: {
      title: 'Connexion - RusingÂcademy',
      description: 'Connectez-vous à votre compte RusingÂcademy pour accéder à vos cours, sessions de coaching et progrès d\'apprentissage.'
    }
  }
};

// Custom Clerk appearance matching RusingÂcademy design tokens
const clerkAppearance = {
  variables: {
    colorPrimary: tokens.colors.accent.navy,
    colorBackground: tokens.colors.bg.surface,
    colorText: tokens.colors.text.primary,
    colorTextSecondary: tokens.colors.text.secondary,
    colorInputBackground: tokens.colors.bg.surface,
    colorInputText: tokens.colors.text.primary,
    borderRadius: tokens.radius.md,
    fontFamily: 'Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif',
  },
  elements: {
    rootBox: {
      width: '100%',
      maxWidth: '420px',
    },
    card: {
      backgroundColor: tokens.colors.bg.surface,
      boxShadow: tokens.shadow[3],
      borderRadius: tokens.radius.lg,
      border: `1px solid ${tokens.colors.border.subtle}`,
    },
    headerTitle: {
      fontSize: '24px',
      fontWeight: '700',
      color: tokens.colors.text.primary,
    },
    headerSubtitle: {
      color: tokens.colors.text.secondary,
    },
    socialButtonsBlockButton: {
      backgroundColor: tokens.colors.bg.surface,
      border: `1px solid ${tokens.colors.border.subtle}`,
      borderRadius: tokens.radius.md,
      color: tokens.colors.text.primary,
      '&:hover': {
        backgroundColor: `${tokens.colors.accent.navy}08`,
      },
    },
    formButtonPrimary: {
      backgroundColor: tokens.colors.accent.navy,
      borderRadius: tokens.radius.pill,
      fontWeight: '600',
      '&:hover': {
        backgroundColor: '#0B2239',
      },
    },
    formFieldInput: {
      backgroundColor: tokens.colors.bg.surface,
      border: `1px solid ${tokens.colors.border.subtle}`,
      borderRadius: tokens.radius.sm,
      '&:focus': {
        borderColor: tokens.colors.accent.navy,
        boxShadow: `0 0 0 3px ${tokens.colors.accent.navy}20`,
      },
    },
    formFieldLabel: {
      color: tokens.colors.text.primary,
      fontWeight: '500',
    },
    footerActionLink: {
      color: tokens.colors.accent.teal,
      fontWeight: '600',
      '&:hover': {
        color: tokens.colors.accent.navy,
      },
    },
    identityPreviewEditButton: {
      color: tokens.colors.accent.teal,
    },
    formResendCodeLink: {
      color: tokens.colors.accent.teal,
    },
    otpCodeFieldInput: {
      borderRadius: tokens.radius.sm,
      border: `1px solid ${tokens.colors.border.subtle}`,
    },
  },
};

export default function SignIn() {
  const { language } = useLanguage();
  const { isSignedIn } = useAuth();
  const [, setLocation] = useLocation();
  
  const t = labels[language as 'en' | 'fr'] || labels.en;

  // Redirect if already signed in
  useEffect(() => {
    if (isSignedIn) {
      setLocation('/dashboard');
    }
  }, [isSignedIn, setLocation]);

  return (
    <div 
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: tokens.colors.bg.canvas }}
    >
      <SEO
        title={t.seo.title}
        description={t.seo.description}
      />

      {/* Header */}
      <header className="p-4 sm:p-6">
        <Link href="/">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors"
            style={{ 
              color: tokens.colors.text.secondary,
              backgroundColor: `${tokens.colors.accent.navy}08`
            }}
          >
            <ArrowLeft className="w-4 h-4" />
            {t.backToHome}
          </motion.button>
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Logo and Title */}
          <div className="text-center mb-8">
            <Link href="/">
              <img
                src="/images/logos/rusingacademy-official.png"
                alt="RusingÂcademy"
                className="h-16 w-auto mx-auto mb-4"
              />
            </Link>
            <h1 
              className="text-2xl font-bold mb-2"
              style={{ color: tokens.colors.text.primary }}
            >
              {t.title}
            </h1>
            <p style={{ color: tokens.colors.text.secondary }}>
              {t.subtitle}
            </p>
          </div>

          {/* Clerk Sign In Component */}
          <div className="flex justify-center">
            <ClerkSignIn
              appearance={clerkAppearance}
              routing="path"
              path="/sign-in"
              signUpUrl="/sign-up"
              afterSignInUrl="/dashboard"
            />
          </div>

          {/* Additional Links */}
          <div className="mt-6 text-center">
            <p style={{ color: tokens.colors.text.muted }}>
              {t.noAccount}{' '}
              <Link 
                href="/sign-up"
                className="font-semibold hover:underline"
                style={{ color: tokens.colors.accent.teal }}
              >
                {t.signUp}
              </Link>
            </p>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="p-4 text-center">
        <p 
          className="text-xs"
          style={{ color: tokens.colors.text.muted }}
        >
          © {new Date().getFullYear()} Rusinga International Consulting Ltd. (RusingÂcademy)
        </p>
      </footer>
    </div>
  );
}
