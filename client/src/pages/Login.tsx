/**
 * Login Page - Clerk Authentication (Kajabi-style Layout)
 * 
 * UI Hierarchy:
 * 1. TOP: Email and Password fields (Custom form)
 * 2. MIDDLE: "Sign In" primary button
 * 3. DIVIDER: "Or continue with" line
 * 4. BOTTOM: Social Login buttons (Google, Microsoft, Apple)
 * 
 * Uses Clerk's useSignIn hook for authentication while preserving
 * the custom glassmorphism UI design.
 */
import { useState, useEffect } from "react";
import { Link, useSearch } from "wouter";
import { useSignIn, useAuth } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

// Bilingual labels
const labels = {
  en: {
    welcomeBack: "Welcome Back",
    subtitle: "Sign in to your RusingAcademy account",
    email: "Email Address",
    emailPlaceholder: "Enter your email",
    password: "Password",
    passwordPlaceholder: "Enter your password",
    forgotPassword: "Forgot password?",
    signIn: "Sign In",
    signingIn: "Signing in...",
    success: "Success!",
    orContinueWith: "Or continue with",
    noAccount: "Don't have an account?",
    createOne: "Create one",
    // Error messages
    invalidCredentials: "Invalid email or password.",
    networkError: "Network error. Please try again.",
    genericError: "An error occurred. Please try again.",
    emailRequired: "Please enter your email address.",
    passwordRequired: "Please enter your password.",
    loginSuccess: "Login successful! Redirecting...",
    socialLoginError: "Social login failed. Please try again.",
  },
  fr: {
    welcomeBack: "Bon retour",
    subtitle: "Connectez-vous à votre compte RusingAcademy",
    email: "Adresse email",
    emailPlaceholder: "Entrez votre email",
    password: "Mot de passe",
    passwordPlaceholder: "Entrez votre mot de passe",
    forgotPassword: "Mot de passe oublié?",
    signIn: "Se connecter",
    signingIn: "Connexion...",
    success: "Succès!",
    orContinueWith: "Ou continuer avec",
    noAccount: "Pas encore de compte?",
    createOne: "Créer un compte",
    // Error messages
    invalidCredentials: "Email ou mot de passe invalide.",
    networkError: "Erreur réseau. Veuillez réessayer.",
    genericError: "Une erreur s'est produite. Veuillez réessayer.",
    emailRequired: "Veuillez entrer votre adresse email.",
    passwordRequired: "Veuillez entrer votre mot de passe.",
    loginSuccess: "Connexion réussie! Redirection...",
    socialLoginError: "Échec de la connexion sociale. Veuillez réessayer.",
  }
};

// Social provider icons as SVG components
const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const MicrosoftIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M11.4 11.4H2V2h9.4v9.4z" fill="#F25022"/>
    <path d="M22 11.4h-9.4V2H22v9.4z" fill="#7FBA00"/>
    <path d="M11.4 22H2v-9.4h9.4V22z" fill="#00A4EF"/>
    <path d="M22 22h-9.4v-9.4H22V22z" fill="#FFB900"/>
  </svg>
);

const AppleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
  </svg>
);

export default function Login() {
  const searchString = useSearch();
  const { language } = useLanguage();
  const lang = language === "fr" ? "fr" : "en";
  const t = labels[lang];
  
  // Clerk hooks
  const { signIn, isLoaded, setActive } = useSignIn();
  const { isSignedIn } = useAuth();
  
  // Form state
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [socialLoading, setSocialLoading] = useState<string | null>(null);

  // Get redirect URL from query params
  const searchParams = new URLSearchParams(searchString);
  const redirectTo = searchParams.get("redirect") || "/dashboard";

  // Redirect if already signed in
  useEffect(() => {
    if (isSignedIn) {
      console.log("[Login] User already signed in, redirecting to:", redirectTo);
      window.location.href = redirectTo;
    }
  }, [isSignedIn, redirectTo]);

  // Handle email/password sign in
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Validate form
    if (!formData.email) {
      setError(t.emailRequired);
      return;
    }
    if (!formData.password) {
      setError(t.passwordRequired);
      return;
    }
    
    // Wait for Clerk to load
    if (!isLoaded || !signIn) {
      console.log("[Login] Clerk not loaded yet");
      return;
    }
    
    setError(null);
    setLoginSuccess(false);
    setIsSubmitting(true);
    
    console.log("[Login] Attempting Clerk sign in for:", formData.email);
    
    try {
      // Attempt Clerk sign in with email/password
      const result = await signIn.create({
        identifier: formData.email.trim().toLowerCase(),
        password: formData.password,
      });
      
      console.log("[Login] Clerk sign in result:", result.status);
      
      if (result.status === "complete") {
        // Set the active session
        await setActive({ session: result.createdSessionId });
        
        console.log("[Login] Session activated, redirecting to:", redirectTo);
        setLoginSuccess(true);
        setError(null);
        
        // Redirect after brief success message
        setTimeout(() => {
          window.location.href = redirectTo;
        }, 800);
      } else if (result.status === "needs_identifier") {
        setError(t.emailRequired);
        setIsSubmitting(false);
      } else if (result.status === "needs_first_factor") {
        // This shouldn't happen with email/password, but handle it
        setError(t.genericError);
        setIsSubmitting(false);
      } else {
        // Handle other statuses (MFA, etc.)
        console.log("[Login] Unexpected status:", result.status);
        setError(t.genericError);
        setIsSubmitting(false);
      }
    } catch (err: any) {
      console.error("[Login] Clerk sign in error:", err);
      
      // Parse Clerk error
      const clerkError = err?.errors?.[0];
      if (clerkError) {
        const code = clerkError.code;
        if (code === "form_identifier_not_found" || 
            code === "form_password_incorrect" ||
            code === "form_identifier_invalid") {
          setError(t.invalidCredentials);
        } else if (code === "network_error") {
          setError(t.networkError);
        } else {
          setError(clerkError.message || t.genericError);
        }
      } else {
        setError(t.genericError);
      }
      
      setIsSubmitting(false);
    }
  };

  // Handle social login (OAuth)
  const handleSocialLogin = async (provider: 'oauth_google' | 'oauth_microsoft' | 'oauth_apple') => {
    if (!isLoaded || !signIn) {
      console.log("[Login] Clerk not loaded yet");
      return;
    }

    const providerName = provider.replace('oauth_', '');
    setSocialLoading(providerName);
    setError(null);

    console.log("[Login] Initiating social login with:", provider);

    try {
      await signIn.authenticateWithRedirect({
        strategy: provider,
        redirectUrl: '/sso-callback',
        redirectUrlComplete: redirectTo,
      });
    } catch (err: any) {
      console.error("[Login] Social login error:", err);
      setError(t.socialLoginError);
      setSocialLoading(null);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const isPending = isSubmitting || !isLoaded;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      {/* Decorative background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <Card className="w-full max-w-md bg-slate-800/60 border-slate-700/50 backdrop-blur-xl shadow-2xl relative z-10">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto mb-4">
            <img
              src="/images/logos/rusingacademy-official.png"
              alt="RusingAcademy"
              className="h-16 w-auto"
            />
          </div>
          <CardTitle className="text-2xl font-bold text-white">
            {t.welcomeBack}
          </CardTitle>
          <CardDescription className="text-slate-400">
            {t.subtitle}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Error/Success Alerts */}
          {error && (
            <Alert variant="destructive" className="bg-red-900/50 border-red-800">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {loginSuccess && (
            <Alert className="bg-green-900/50 border-green-800">
              <CheckCircle2 className="h-4 w-4 text-green-400" />
              <AlertDescription className="text-green-400">
                {t.loginSuccess}
              </AlertDescription>
            </Alert>
          )}

          {/* ========== SECTION 1: Email/Password Form ========== */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-200">
                {t.email}
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder={t.emailPlaceholder}
                value={formData.email}
                onChange={handleChange}
                required
                disabled={isPending || loginSuccess}
                className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-teal-500 focus:ring-teal-500/20"
                autoComplete="email"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-slate-200">
                  {t.password}
                </Label>
                <Link
                  to="/forgot-password"
                  className="text-sm text-teal-400 hover:text-teal-300 transition-colors"
                >
                  {t.forgotPassword}
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder={t.passwordPlaceholder}
                  value={formData.password}
                  onChange={handleChange}
                  required
                  disabled={isPending || loginSuccess}
                  className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 pr-10 focus:border-teal-500 focus:ring-teal-500/20"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* ========== SECTION 2: Sign In Button ========== */}
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-semibold py-2.5 shadow-lg shadow-teal-500/25 transition-all duration-200"
              disabled={isPending || loginSuccess || !!socialLoading}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t.signingIn}
                </>
              ) : loginSuccess ? (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  {t.success}
                </>
              ) : (
                t.signIn
              )}
            </Button>
          </form>

          {/* ========== SECTION 3: Divider ========== */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-600/50" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-slate-800/60 px-3 text-slate-400">
                {t.orContinueWith}
              </span>
            </div>
          </div>

          {/* ========== SECTION 4: Social Login Buttons ========== */}
          <div className="grid grid-cols-3 gap-3">
            {/* Google */}
            <Button
              type="button"
              variant="outline"
              className="bg-slate-700/30 border-slate-600 hover:bg-slate-700/50 hover:border-slate-500 text-white transition-all duration-200"
              onClick={() => handleSocialLogin('oauth_google')}
              disabled={isPending || loginSuccess || !!socialLoading}
              aria-label="Sign in with Google"
            >
              {socialLoading === 'google' ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <GoogleIcon />
              )}
            </Button>

            {/* Microsoft */}
            <Button
              type="button"
              variant="outline"
              className="bg-slate-700/30 border-slate-600 hover:bg-slate-700/50 hover:border-slate-500 text-white transition-all duration-200"
              onClick={() => handleSocialLogin('oauth_microsoft')}
              disabled={isPending || loginSuccess || !!socialLoading}
              aria-label="Sign in with Microsoft"
            >
              {socialLoading === 'microsoft' ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <MicrosoftIcon />
              )}
            </Button>

            {/* Apple */}
            <Button
              type="button"
              variant="outline"
              className="bg-slate-700/30 border-slate-600 hover:bg-slate-700/50 hover:border-slate-500 text-white transition-all duration-200"
              onClick={() => handleSocialLogin('oauth_apple')}
              disabled={isPending || loginSuccess || !!socialLoading}
              aria-label="Sign in with Apple"
            >
              {socialLoading === 'apple' ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <AppleIcon />
              )}
            </Button>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-4 pt-2">
          <p className="text-center text-sm text-slate-400">
            {t.noAccount}{" "}
            <Link to="/signup" className="text-teal-400 hover:text-teal-300 font-medium transition-colors">
              {t.createOne}
            </Link>
          </p>
          <p className="text-center text-xs text-slate-500">
            © 2026 Rusinga International Consulting Ltd. (RusingAcademy)
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
