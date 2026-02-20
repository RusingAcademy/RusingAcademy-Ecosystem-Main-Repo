/**
 * ResetPassword Page — v7 (Unified Auth Design System)
 * Uses shared AuthLayout + AuthCard + AuthInput + AuthButton
 */
import { useState, useEffect, useCallback } from "react";
import { Link, useLocation, useSearch } from "wouter";
import { trpc } from "../lib/trpc";
import { Eye, EyeOff, Loader2, CheckCircle, AlertCircle, ArrowLeft, Lock } from "lucide-react";
import { AuthLayout, AuthCard, AuthInput, AuthButton, PasswordStrength } from "@/components/auth";

import { useLanguage } from "@/contexts/LanguageContext";

const labels = {
  en: { title: "Reset Password", description: "Manage and configure reset password" },
  fr: { title: "Reset Password", description: "Gérer et configurer reset password" },
};

export default function ResetPassword() {
  const { language } = useLanguage();
  const l = labels[language as keyof typeof labels] || labels.en;

  const [, setLocation] = useLocation();
  const searchString = useSearch();
  const searchParams = new URLSearchParams(searchString);
  const token = searchParams.get("token");
  const [language, setLanguage] = useState<"en" | "fr">("en");

  const t = useCallback(
    (en: string, fr: string) => (language === "fr" ? fr : en),
    [language],
  );

  const [formData, setFormData] = useState({ password: "", confirmPassword: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [tokenValid, setTokenValid] = useState<boolean | null>(null);

  // @ts-expect-error - TS2339: auto-suppressed during TS cleanup
  const verifyTokenMutation = trpc.customAuth.verifyResetToken.useMutation({
    onSuccess: (data: { valid: boolean }) => { setTokenValid(data.valid); },
    onError: () => { setTokenValid(false); },
  });

  const resetPasswordMutation = trpc.customAuth.resetPassword.useMutation({
    onSuccess: () => {
      setSuccess(true);
      setTimeout(() => { setLocation("/login"); }, 3000);
    },
    onError: (err: { message: string }) => { setError(err.message); },
  });

  useEffect(() => {
    if (token) {
      verifyTokenMutation.mutate({ token });
    } else {
      setTokenValid(false);
    }
  }, [token]);

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
    if (!token) {
      setError(t("Invalid reset token", "Jeton de réinitialisation invalide"));
      return;
    }

    resetPasswordMutation.mutate({ token, newPassword: formData.password });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Loading state
  if (tokenValid === null) {
    return (
      <AuthLayout language={language} onLanguageChange={setLanguage}>
        <AuthCard>
          <div className="text-center space-y-4 py-8">
            <Loader2 className="w-12 h-12 text-[var(--barholex-gold)] mx-auto animate-spin" />
            <p className="text-white/60 text-sm">
              {t("Verifying reset link...", "Vérification du lien...")}
            </p>
          </div>
        </AuthCard>
      </AuthLayout>
    );
  }

  // Invalid/expired token
  if (!tokenValid) {
    return (
      <AuthLayout language={language} onLanguageChange={setLanguage}>
        <AuthCard>
          <div className="text-center space-y-4 py-4">
            <AlertCircle className="w-16 h-16 text-red-400 mx-auto" />
            <h2 className="text-xl font-bold text-white">
              {t("Invalid or Expired Link", "Lien invalide ou expiré")}
            </h2>
            <p className="text-white/60 text-sm">
              {t("This password reset link is invalid or has expired.", "Ce lien de réinitialisation est invalide ou a expiré.")}
            </p>
            <div className="pt-2 space-y-2">
              <Link to="/forgot-password">
                <AuthButton>{t("Request New Link", "Demander un nouveau lien")}</AuthButton>
              </Link>
              <Link to="/login">
                <AuthButton variant="secondary">
                  <ArrowLeft className="w-4 h-4" />
                  {t("Back to Login", "Retour à la connexion")}
                </AuthButton>
              </Link>
            </div>
          </div>
        </AuthCard>
      </AuthLayout>
    );
  }

  // Success state
  if (success) {
    return (
      <AuthLayout language={language} onLanguageChange={setLanguage}>
        <AuthCard>
          <div className="text-center space-y-4 py-4">
            <CheckCircle className="w-16 h-16 text-green-400 mx-auto" />
            <h2 className="text-xl font-bold text-white">
              {t("Password Reset!", "Mot de passe réinitialisé !")}
            </h2>
            <p className="text-white/60 text-sm">
              {t("Redirecting to login...", "Redirection vers la connexion...")}
            </p>
          </div>
        </AuthCard>
      </AuthLayout>
    );
  }

  // Reset form
  return (
    <AuthLayout language={language} onLanguageChange={setLanguage}>
      <AuthCard
        title={t("Create New Password", "Créer un nouveau mot de passe")}
        subtitle={t("Enter your new password below", "Entrez votre nouveau mot de passe ci-dessous")}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          <div>
            <AuthInput
              icon={<Lock className="w-4 h-4" />}
              label={t("New Password", "Nouveau mot de passe")}
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder={t("Min 8 characters", "Min 8 caractères")}
              value={formData.password}
              onChange={handleChange}
              required
              minLength={8}
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
            autoComplete="new-password"
          />

          <AuthButton
            type="submit"
            isLoading={resetPasswordMutation.isPending}
            loadingText={t("Resetting...", "Réinitialisation...")}
            icon={<Lock className="w-4 h-4" />}
          >
            {t("Reset Password", "Réinitialiser le mot de passe")}
          </AuthButton>
        </form>
      </AuthCard>
    </AuthLayout>
  );
}
