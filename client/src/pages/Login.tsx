/**
 * Login Page - Clerk Authentication
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

// Bilingual error messages
const errorMessages = {
  invalidCredentials: {
    en: "Invalid email or password.",
    fr: "Email ou mot de passe invalide."
  },
  networkError: {
    en: "Network error. Please try again.",
    fr: "Erreur réseau. Veuillez réessayer."
  },
  genericError: {
    en: "An error occurred. Please try again.",
    fr: "Une erreur s'est produite. Veuillez réessayer."
  },
  emailRequired: {
    en: "Please enter your email address.",
    fr: "Veuillez entrer votre adresse email."
  },
  passwordRequired: {
    en: "Please enter your password.",
    fr: "Veuillez entrer votre mot de passe."
  },
  loginSuccess: {
    en: "Login successful! Redirecting...",
    fr: "Connexion réussie! Redirection..."
  }
};

export default function Login() {
  const searchString = useSearch();
  const { language } = useLanguage();
  const lang = language === "fr" ? "fr" : "en";
  
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Validate form
    if (!formData.email) {
      setError(errorMessages.emailRequired[lang]);
      return;
    }
    if (!formData.password) {
      setError(errorMessages.passwordRequired[lang]);
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
      // Attempt Clerk sign in
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
        setError(errorMessages.emailRequired[lang]);
        setIsSubmitting(false);
      } else if (result.status === "needs_first_factor") {
        // This shouldn't happen with email/password, but handle it
        setError(errorMessages.genericError[lang]);
        setIsSubmitting(false);
      } else {
        // Handle other statuses (MFA, etc.)
        console.log("[Login] Unexpected status:", result.status);
        setError(errorMessages.genericError[lang]);
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
          setError(errorMessages.invalidCredentials[lang]);
        } else if (code === "network_error") {
          setError(errorMessages.networkError[lang]);
        } else {
          setError(clerkError.message || errorMessages.genericError[lang]);
        }
      } else {
        setError(errorMessages.genericError[lang]);
      }
      
      setIsSubmitting(false);
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
      <Card className="w-full max-w-md bg-slate-800/50 border-slate-700 backdrop-blur-sm">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            <img
              src="/images/logos/rusingacademy-official.png"
              alt="RusingAcademy"
              className="h-16 w-auto"
            />
          </div>
          <CardTitle className="text-2xl font-bold text-white">
            {lang === "fr" ? "Bon retour" : "Welcome Back"}
          </CardTitle>
          <CardDescription className="text-slate-400">
            {lang === "fr" 
              ? "Connectez-vous à votre compte RusingAcademy" 
              : "Sign in to your RusingAcademy account"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
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
                  {errorMessages.loginSuccess[lang]}
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-200">
                {lang === "fr" ? "Adresse email" : "Email Address"}
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder={lang === "fr" ? "Entrez votre email" : "Enter your email"}
                value={formData.email}
                onChange={handleChange}
                required
                disabled={isPending || loginSuccess}
                className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                autoComplete="email"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-slate-200">
                  {lang === "fr" ? "Mot de passe" : "Password"}
                </Label>
                <Link
                  to="/forgot-password"
                  className="text-sm text-teal-400 hover:text-teal-300"
                >
                  {lang === "fr" ? "Mot de passe oublié?" : "Forgot password?"}
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder={lang === "fr" ? "Entrez votre mot de passe" : "Enter your password"}
                  value={formData.password}
                  onChange={handleChange}
                  required
                  disabled={isPending || loginSuccess}
                  className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 pr-10"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white"
              disabled={isPending || loginSuccess}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {lang === "fr" ? "Connexion..." : "Signing in..."}
                </>
              ) : loginSuccess ? (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  {lang === "fr" ? "Succès!" : "Success!"}
                </>
              ) : (
                lang === "fr" ? "Se connecter" : "Sign In"
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <p className="text-center text-sm text-slate-400">
            {lang === "fr" ? "Pas encore de compte?" : "Don't have an account?"}{" "}
            <Link to="/signup" className="text-teal-400 hover:text-teal-300">
              {lang === "fr" ? "Créer un compte" : "Create one"}
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
