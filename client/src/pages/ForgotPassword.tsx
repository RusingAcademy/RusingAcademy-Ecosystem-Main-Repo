/**
 * ForgotPassword Page — Refactored with Auth Design System
 * Phase 1: Auth UI/UX Harmonization with HAZY palette
 */
import { useState, useCallback } from "react";
import { Link } from "wouter";
import { trpc } from "../lib/trpc";
import { AlertCircle, ArrowLeft, Mail } from "lucide-react";
import { AuthLayout, AuthCard, AuthInput, AuthButton } from "@/components/auth";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [language] = useState<"en" | "fr">("en");

  const t = useCallback(
    (en: string, fr: string) => (language === "fr" ? fr : en),
    [language],
  );

  // @ts-expect-error - TS2339: auto-suppressed during TS cleanup
  const forgotPasswordMutation = trpc.customAuth.forgotPassword.useMutation({
    onSuccess: () => { setSuccess(true); },
    onError: (err: { message: string }) => { setError(err.message); },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    forgotPasswordMutation.mutate({ email });
  };

  if (success) {
    return (
      <AuthLayout>
        <AuthCard>
          <div className="text-center space-y-4 py-4">
            <div className="mx-auto w-16 h-16 bg-[var(--brand-foundation)]/20 rounded-full flex items-center justify-center">
              <Mail className="w-8 h-8 text-[var(--barholex-gold)]" />
            </div>
            <h2 className="text-xl font-bold text-white">
              {t("Check Your Email", "Vérifiez votre courriel")}
            </h2>
            <p className="text-white/50 text-sm">
              {t("If an account exists with", "Si un compte existe avec")}{" "}
              <span className="font-medium text-[var(--barholex-gold)]">{email}</span>,{" "}
              {t("you'll receive a password reset link shortly.", "vous recevrez un lien de réinitialisation sous peu.")}
            </p>
            <p className="text-white/30 text-xs">
              {t("The link will expire in 1 hour.", "Le lien expirera dans 1 heure.")}
            </p>
            <div className="pt-2">
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

  return (
    <AuthLayout>
      <AuthCard
        title={t("Reset Your Password", "Réinitialisez votre mot de passe")}
        subtitle={t(
          "Enter your email and we'll send you a reset link",
          "Entrez votre courriel et nous vous enverrons un lien de réinitialisation"
        )}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          <AuthInput
            icon={<Mail className="w-4 h-4" />}
            name="email"
            type="email"
            placeholder={t("Email address", "Adresse courriel")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />

          <AuthButton
            type="submit"
            isLoading={forgotPasswordMutation.isPending}
            loadingText={t("Sending...", "Envoi...")}
            icon={<Mail className="w-4 h-4" />}
          >
            {t("Send Reset Link", "Envoyer le lien")}
          </AuthButton>
        </form>

        <p className="text-center mt-4">
          <Link to="/login" className="text-white/40 text-xs hover:text-white/60 transition-colors flex items-center justify-center gap-1">
            <ArrowLeft className="w-3 h-3" />
            {t("Back to Login", "Retour à la connexion")}
          </Link>
        </p>
      </AuthCard>
    </AuthLayout>
  );
}
