/**
 * Clerk Authentication Provider
 * 
 * This wraps the application with Clerk's authentication context.
 * It provides unified auth across RusingAcademy, Lingueefy, and Barholex Media.
 */
import { ClerkProvider as ClerkReactProvider } from '@clerk/clerk-react';
import { ReactNode } from 'react';
import { useLanguage } from './LanguageContext';

// Clerk publishable key from environment
const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

// Localization for bilingual support
const clerkLocalization = {
  en: {
    signIn: {
      start: {
        title: 'Sign in to your account',
        subtitle: 'Welcome back! Please sign in to continue.',
      },
    },
    signUp: {
      start: {
        title: 'Create your account',
        subtitle: 'Welcome! Please fill in the details to get started.',
      },
    },
  },
  fr: {
    signIn: {
      start: {
        title: 'Connectez-vous à votre compte',
        subtitle: 'Bienvenue! Veuillez vous connecter pour continuer.',
      },
    },
    signUp: {
      start: {
        title: 'Créez votre compte',
        subtitle: 'Bienvenue! Veuillez remplir les détails pour commencer.',
      },
    },
  },
};

interface ClerkProviderProps {
  children: ReactNode;
}

export function ClerkAuthProvider({ children }: ClerkProviderProps) {
  const { language } = useLanguage();
  
  // If Clerk is not configured, render children without Clerk wrapper
  // This allows the app to work in development without Clerk keys
  if (!CLERK_PUBLISHABLE_KEY) {
    console.warn('[Clerk] VITE_CLERK_PUBLISHABLE_KEY not set. Auth features disabled.');
    return <>{children}</>;
  }

  return (
    <ClerkReactProvider
      publishableKey={CLERK_PUBLISHABLE_KEY}
      localization={clerkLocalization[language as 'en' | 'fr'] || clerkLocalization.en}
      appearance={{
        variables: {
          colorPrimary: '#2563eb', // Blue-600 to match brand
          colorBackground: '#ffffff',
          colorText: '#1f2937',
          colorInputBackground: '#f9fafb',
          colorInputText: '#1f2937',
          borderRadius: '0.5rem',
        },
        elements: {
          formButtonPrimary: 
            'bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors',
          card: 'shadow-lg border border-gray-200 rounded-xl',
          headerTitle: 'text-2xl font-bold text-gray-900',
          headerSubtitle: 'text-gray-600',
          socialButtonsBlockButton: 
            'border border-gray-300 hover:bg-gray-50 transition-colors rounded-lg',
          formFieldInput: 
            'border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
          footerActionLink: 'text-blue-600 hover:text-blue-700 font-medium',
        },
      }}
      afterSignInUrl="/"
      afterSignUpUrl="/"
    >
      {children}
    </ClerkReactProvider>
  );
}

export default ClerkAuthProvider;
