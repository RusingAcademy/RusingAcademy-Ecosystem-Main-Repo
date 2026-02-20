/**
 * Signup Page — v7 (Unified Auth Design System)
 * Uses shared AuthLayout + AuthCard + AuthInput + AuthButton
 */
import { useState, useCallback } from "react";
import { Link, useSearch } from "wouter";
import { trpc } from "../lib/trpc";
import { Eye, EyeOff, UserPlus, CheckCircle, AlertCircle, User, Mail, Lock, ArrowRight } from "lucide-react";
import { GuestRoute, useAuthContext } from "@/contexts/AuthContext";
import { AuthLayout, AuthCard, AuthInput, AuthButton, OAuthButtons, AuthDivider, PasswordStrength } from "@/components/auth";

import { useLanguage } from "@/contexts/LanguageContext";

const labels = {
  en: { title: "Signup", description: "Manage and configure signup" },
  fr: { title: "Signup", description: "Gérer et configurer signup" },
};

const AUTH_DEBUG = import.meta.env.VITE_AUTH_DEBUG === "true";

function SignupContent() {
  const searchString = useSearch();
  const { refresh } = useAuthContext();
  const [language, setLanguage] = useState<"en" | "fr">("en");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const t = useCallback(
    (en: string, fr: string) => (language === "fr" ? fr : en),
    [language],
  );

  const searchParams = new URLSearchParams(searchString);
  const oauthError = searchParams.get("error");

  const signupMutation = trpc.customAuth.signup.useMutation({
    onSuccess: (data) => {
      if (AUTH_DEBUG) console.log("[Signup] Success:", data.user?.email);
      if (data.success) {
        setSuccess(true);
        refresh();
        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 1500);
      }
    },
    onError: (err) => {
      if (AUTH_DEBUG) console.error("[Signup] Error:", err.message);
      setError(err.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError(t("Passwords do not match", "Les mots de passe ne correspondent pas"));
      return;
    }
    if (formData.password.length < 8) {
      setError(t("Password must be at least 8 characters", "Le mot de passe doit contenir au moins 8 caractères"));
      return;
    }

    signupMutation.mutate({
      name: formData.name,
      email: formData.email.trim().toLowerCase(),
      password: formData.password,
      role: "learner",
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleGoogleSignUp = () => { window.location.href = "/api/auth/google"; };
  const handleMicrosoftSignUp = () => { window.location.href = "/api/auth/microsoft"; };

  const getOAuthErrorMessage = (errorCode: string): string => {
    const messages: Record<string, string> = {
      oauth_not_configured: t("Sign-Up is not configured. Please contact support.", "L'inscription n'est pas configurée. Veuillez contacter le support."),
      invalid_state: t("Security validation failed. Please try again.", "La validation de sécurité a échoué. Veuillez réessayer."),
      oauth_failed: t("Sign-Up failed. Please try again.", "L'inscription a échoué. Veuillez réessayer."),
    };
    return messages[errorCode] || t("An error occurred. Please try again.", "Une erreur est survenue. Veuillez réessayer.");
  };

  if (success) {
    return (
      <AuthLayout language={language} onLanguageChange={setLanguage}>
        <AuthCard>
          <div className="text-center space-y-4 py-4">
            <CheckCircle className="w-16 h-16 text-green-400 mx-auto" />
            <h2 className="text-2xl font-bold text-white">
              {t("Account Created!", "Compte créé !")}
            </h2>
            <p className="text-white/60 text-sm">
              {t("Redirecting to dashboard...", "Redirection vers le tableau de bord...")}
            </p>
          </div>
        </AuthCard>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout language={language} onLanguageChange={setLanguage}>
      <AuthCard
        title={t("Create Your Account", "Créez votre compte")}
        subtitle={t("Join RusingÂcademy and start your bilingual journey", "Rejoignez RusingÂcademy et commencez votre parcours bilingue")}
      >
        {/* OAuth Error */}
        {oauthError && (
          <div className="flex items-center gap-2 p-3 mb-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {getOAuthErrorMessage(oauthError)}
          </div>
        )}

        {/* OAuth Buttons */}
        <OAuthButtons
          onGoogle={handleGoogleSignUp}
          onMicrosoft={handleMicrosoftSignUp}
          disabled={signupMutation.isPending}
          t={t}
        />

        <AuthDivider text={t("Or sign up with email", "Ou inscrivez-vous par courriel")} />

        {/* Email Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          <AuthInput
            icon={<User className="w-4 h-4" />}
            label={t("Full Name", "Nom complet")}
            name="name"
            type="text"
            placeholder={t("John Doe", "Jean Dupont")}
            value={formData.name}
            onChange={handleChange}
            required
            disabled={signupMutation.isPending}
            autoComplete="name"
          />

          <AuthInput
            icon={<Mail className="w-4 h-4" />}
            label={t("Email", "Courriel")}
            name="email"
            type="email"
            placeholder={t("your@email.com", "votre@courriel.com")}
            value={formData.email}
            onChange={handleChange}
            required
            disabled={signupMutation.isPending}
            autoComplete="email"
          />

          <div>
            <AuthInput
              icon={<Lock className="w-4 h-4" />}
              label={t("Password", "Mot de passe")}
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder={t("Min 8 characters", "Min 8 caractères")}
              value={formData.password}
              onChange={handleChange}
              required
              minLength={8}
              disabled={signupMutation.isPending}
              autoComplete="new-password"
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-white/30 hover:text-white/60 transition-colors"
                  aria-label={showPassword ? t("Hide password", "Masquer") : t("Show password", "Afficher")}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
            />
            <PasswordStrength password={formData.password} t={t} />
          </div>

          <AuthInput
            icon={<Lock className="w-4 h-4" />}
            label={t("Confirm Password", "Confirmer le mot de passe")}
            name="confirmPassword"
            type={showPassword ? "text" : "password"}
            placeholder={t("Re-enter password", "Ressaisir le mot de passe")}
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            disabled={signupMutation.isPending}
            autoComplete="new-password"
          />

          <AuthButton
            type="submit"
            isLoading={signupMutation.isPending}
            loadingText={t("Creating Account...", "Création du compte...")}
            icon={<UserPlus className="w-4 h-4" />}
          >
            {t("Create Account", "Créer un compte")}
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </AuthButton>
        </form>

        {/* Sign In Link */}
        <p className="text-center text-white/50 text-xs mt-4">
          {t("Already have an account?", "Vous avez déjà un compte ?")}{" "}
          <Link to="/login" className="text-[var(--barholex-gold)] font-semibold hover:text-[#e0b860] transition-colors">
            {t("Sign in", "Se connecter")}
          </Link>
        </p>

        {/* Terms */}
        <p className="text-center text-white/30 text-[10px] mt-3">
          {t("By creating an account, you agree to our", "En créant un compte, vous acceptez nos")}{" "}
          <Link to="/terms" className="text-white/40 hover:text-white/60 underline">{t("Terms", "Conditions")}</Link>
          {" & "}
          <Link to="/privacy" className="text-white/40 hover:text-white/60 underline">{t("Privacy", "Confidentialité")}</Link>
        </p>

        {/* Debug panel */}
        {AUTH_DEBUG && (
          <div className="mt-4 p-3 bg-black/40 border border-white/10 rounded-lg text-xs font-mono">
            <div className="text-[var(--barholex-gold)] font-bold mb-1">Auth Debug</div>
            <div className="text-white/60">
              <div>Pending: {signupMutation.isPending ? "yes" : "no"}</div>
              <div>OAuth error: {oauthError || "none"}</div>
            </div>
          </div>
        )}
      </AuthCard>
    </AuthLayout>
  );
}

export default function Signup() {
  const { language } = useLanguage();
  const l = labels[language as keyof typeof labels] || labels.en;

  return (
    <GuestRoute redirectTo="/dashboard">
      <SignupContent />
    </GuestRoute>
  );
}
