/**
 * RusingÂcademy Login Page — v7 (Unified Auth Design System)
 * ─────────────────────────────────────────────────────
 * Uses shared AuthLayout (split-panel: cream showcase + teal auth card)
 * with AuthCard, AuthInput, AuthButton, OAuthButtons components.
 *
 * Auth: customAuth (email/password) + Google OAuth + Microsoft OAuth
 * Bilingual: EN/FR with language switcher in AuthLayout
 */
import { useState, useRef, useCallback } from "react";
import { Link, useSearch } from "wouter";
import { trpc } from "../lib/trpc";
import {
  Eye,
  EyeOff,
  LogIn,
  Users,
  LayoutGrid,
  Shield,
  Facebook,
  Instagram,
  Linkedin,
  Lock,
  Mail,
  ArrowRight,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { GuestRoute, useAuthContext } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { AuthLayout, AuthCard, AuthInput, AuthButton, OAuthButtons, AuthDivider } from "@/components/auth";

/* ─── Debug Mode ─── */
const AUTH_DEBUG = import.meta.env.VITE_AUTH_DEBUG === "true";

/* ═══════════════════════════════════════════════════════
   LoginContent — Main Auth Component
   ═══════════════════════════════════════════════════════ */
function LoginContent() {
  const searchString = useSearch();
  const { refresh } = useAuthContext();

  /* ─── State ─── */
  const [language, setLanguage] = useState<"en" | "fr">("en");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  /* ─── URL Params ─── */
  const searchParams = new URLSearchParams(searchString);
  const redirectTo = searchParams.get("redirect") || "/dashboard";
  const oauthError = searchParams.get("error");

  /* ─── Translation Helper ─── */
  const t = useCallback(
    (en: string, fr: string) => (language === "en" ? en : fr),
    [language],
  );

  /* ─── customAuth Login Mutation ─── */
  const loginMutation = trpc.customAuth.login.useMutation({
    onMutate: () => {
      if (AUTH_DEBUG) console.log("[Login] Mutation starting...");
    },
    onSuccess: (data) => {
      if (AUTH_DEBUG) console.log("[Login] Success:", data.user?.email);
      if (data.success) {
        setLoginSuccess(true);
        setError(null);
        refresh();
        setTimeout(() => {
          if (AUTH_DEBUG) console.log("[Login] Redirecting to:", redirectTo);
          window.location.href = redirectTo;
        }, 500);
      } else {
        setError(t("Login failed. Please try again.", "Échec de connexion. Veuillez réessayer."));
        setIsSubmitting(false);
      }
    },
    onError: (err) => {
      if (AUTH_DEBUG) console.error("[Login] Error:", err.message);
      setError(err.message);
      setIsSubmitting(false);
    },
  });

  /* ─── Form Submit ─── */
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setError(null);
      setLoginSuccess(false);
      setIsSubmitting(true);

      if (!email || !password) {
        setError(t("Please enter both email and password", "Veuillez entrer votre courriel et mot de passe"));
        setIsSubmitting(false);
        return;
      }

      loginMutation.mutate({
        email: email.trim().toLowerCase(),
        password,
      });
    },
    [email, password, loginMutation, t],
  );

  /* ─── OAuth Handlers ─── */
  const handleGoogleSignIn = useCallback(() => {
    window.location.href = "/api/auth/google";
  }, []);

  const handleMicrosoftSignIn = useCallback(() => {
    window.location.href = "/api/auth/microsoft";
  }, []);

  /* ─── OAuth Error Messages (bilingual) ─── */
  const getOAuthErrorMessage = useCallback(
    (errorCode: string): string => {
      const messages: Record<string, [string, string]> = {
        oauth_not_configured: [
          "Sign-In is not configured. Please contact support.",
          "La connexion n'est pas configurée. Veuillez contacter le support.",
        ],
        invalid_state: [
          "Security validation failed. Please try again.",
          "La validation de sécurité a échoué. Veuillez réessayer.",
        ],
        no_code: [
          "Authentication was cancelled. Please try again.",
          "L'authentification a été annulée. Veuillez réessayer.",
        ],
        token_exchange_failed: [
          "Failed to authenticate. Please try again.",
          "Échec de l'authentification. Veuillez réessayer.",
        ],
        userinfo_failed: [
          "Failed to get your account information. Please try again.",
          "Impossible d'obtenir vos informations. Veuillez réessayer.",
        ],
        oauth_failed: [
          "Sign-In failed. Please try again or use email/password.",
          "Échec de connexion. Réessayez ou utilisez courriel/mot de passe.",
        ],
        access_denied: [
          "Access was denied. Please try again.",
          "L'accès a été refusé. Veuillez réessayer.",
        ],
      };
      const pair = messages[errorCode];
      if (pair) return t(pair[0], pair[1]);
      return t(
        "An error occurred during sign-in. Please try again.",
        "Une erreur est survenue. Veuillez réessayer.",
      );
    },
    [t],
  );

  const isPending = loginMutation.isPending || isSubmitting;

  /* ═══════════════════════════════════════════════════════
     RENDER
     ═══════════════════════════════════════════════════════ */
  return (
    <AuthLayout language={language} onLanguageChange={setLanguage}>
      <AuthCard
        title={t("Welcome Back", "Bon retour")}
        subtitle={t("Sign in to continue your learning journey", "Connectez-vous pour continuer votre parcours")}
      >
        {/* OAuth Error Alert */}
        {oauthError && (
          <div className="flex items-center gap-2 p-3 mb-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {getOAuthErrorMessage(oauthError)}
          </div>
        )}

        {/* Login Error Alert */}
        {error && (
          <div className="flex items-center gap-2 p-3 mb-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        {/* Login Success Alert */}
        {loginSuccess && (
          <div className="flex items-center gap-2 p-3 mb-4 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-xs">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            {t("Login successful! Redirecting...", "Connexion réussie ! Redirection...")}
          </div>
        )}

        {/* Email + Password Form */}
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-3 mb-4">
          {/* Email */}
          <AuthInput
            icon={<Mail className="w-4 h-4" />}
            label={t("Email", "Courriel")}
            id="login-email"
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t("your@email.com", "votre@courriel.com")}
            required
            disabled={isPending || loginSuccess}
            autoComplete="email"
          />

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="login-password"
                className="block text-white/70 text-[11px] font-semibold tracking-wider uppercase"
              >
                {t("Password", "Mot de passe")}
              </label>
              <Link
                to="/forgot-password"
                className="text-[var(--barholex-gold)]/70 text-[10px] hover:text-[var(--barholex-gold)] transition-colors"
              >
                {t("Forgot?", "Oublié ?")}
              </Link>
            </div>
            <AuthInput
              icon={<Lock className="w-4 h-4" />}
              id="login-password"
              type={showPassword ? "text" : "password"}
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              disabled={isPending || loginSuccess}
              autoComplete="current-password"
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
          </div>

          {/* Remember Me */}
          <div className="flex items-center gap-2 mt-1">
            <input
              type="checkbox"
              id="remember-me"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-3.5 h-3.5 rounded border-white/20 bg-white/[0.06] text-[var(--barholex-gold)] focus:ring-[var(--barholex-gold)]/40 focus:ring-offset-0"
            />
            <label htmlFor="remember-me" className="text-white/60 text-[11px] cursor-pointer select-none">
              {t("Remember me", "Se souvenir de moi")}
            </label>
          </div>

          {/* Primary CTA */}
          <AuthButton
            type="submit"
            isLoading={isPending}
            loadingText={t("Signing in...", "Connexion en cours...")}
            disabled={isPending || loginSuccess}
            icon={loginSuccess ? <CheckCircle2 className="w-4 h-4" /> : <LogIn className="w-4 h-4" />}
          >
            {loginSuccess ? t("Success!", "Réussi !") : (
              <>
                {t("Sign In with Email", "Se connecter par courriel")}
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </>
            )}
          </AuthButton>
        </form>

        {/* Divider */}
        <AuthDivider text={t("Or continue with", "Ou continuer avec")} />

        {/* SSO Buttons */}
        <OAuthButtons
          onGoogle={handleGoogleSignIn}
          onMicrosoft={handleMicrosoftSignIn}
          disabled={isPending || loginSuccess}
          t={t}
        />

        {/* Sign Up Link */}
        <p className="text-center text-white/60 text-xs mt-4">
          {t("Don't have an account?", "Pas encore de compte ?")}{" "}
          <Link to="/signup" className="text-[var(--barholex-gold)] font-semibold hover:text-[#e0b860] transition-colors">
            {t("Sign up", "S'inscrire")}
          </Link>
        </p>
      </AuthCard>

      {/* ─── Portal Access + Social ─── */}
      <div className="mt-5 space-y-3">
        {/* Portal Access */}
        <div>
          <p className="text-center text-white/20 text-[9px] font-semibold tracking-[0.2em] uppercase mb-2">
            {t("Other Portals", "Autres portails")}
          </p>
          <div className="grid grid-cols-3 gap-2">
            {[
              { name: t("Coach", "Coach"), icon: Users, color: "#6C5CE7", href: "/coach" },
              { name: t("Client", "Client"), icon: LayoutGrid, color: "var(--brand-foundation)", href: "/hr" },
              { name: t("Admin", "Admin"), icon: Shield, color: "#D63031", href: "/admin" },
            ].map((portal, i) => (
              <motion.div
                key={portal.name}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + i * 0.08 }}
              >
                <Link
                  to={portal.href}
                  className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] hover:border-white/15 transition-all group focus:outline-none focus:ring-2 focus:ring-[var(--barholex-gold)]/30"
                >
                  <portal.icon className="w-3.5 h-3.5" style={{ color: portal.color }} />
                  <span className="text-white/65 text-[10px] font-medium group-hover:text-white/85 transition-colors">
                    {portal.name}
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Social + Security */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            {[
              { icon: Facebook, href: "https://www.facebook.com/people/Rusing%C3%82cademy/100063464145177/", label: "Facebook" },
              { icon: Instagram, href: "https://www.instagram.com/barholex/", label: "Instagram" },
              { icon: Linkedin, href: "https://www.linkedin.com/company/rusing%C3%A2cademy/?viewAsMember=true", label: "LinkedIn" },
            ].map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="w-7 h-7 rounded-full flex items-center justify-center text-[var(--barholex-gold)]/50 hover:text-[var(--barholex-gold)] hover:bg-[var(--barholex-gold)]/10 transition-all focus:outline-none focus:ring-2 focus:ring-[var(--barholex-gold)]/30"
              >
                <social.icon className="w-3.5 h-3.5" />
              </a>
            ))}
          </div>
          <p className="text-white/15 text-[8px] tracking-wide flex items-center gap-1">
            <Lock className="w-2.5 h-2.5" />
            {t("256-bit encryption", "Chiffrement 256 bits")}
          </p>
        </div>
      </div>

      {/* Debug panel — development only */}
      {AUTH_DEBUG && (
        <div className="fixed bottom-4 right-4 z-50 p-3 bg-black/90 border border-teal-800 rounded-lg text-xs font-mono max-w-xs">
          <div className="text-teal-400 font-bold mb-2">Auth Debug</div>
          <div className="text-white/90 space-y-0.5">
            <div>Redirect: {redirectTo}</div>
            <div>Success: {loginSuccess ? "yes" : "no"}</div>
            <div>Pending: {isPending ? "yes" : "no"}</div>
            <div>OAuth error: {oauthError || "none"}</div>
          </div>
        </div>
      )}
    </AuthLayout>
  );
}

/* ═══════════════════════════════════════════════════════
   Login — Wrapped with GuestRoute
   ═══════════════════════════════════════════════════════ */
export default function Login() {
  return (
    <GuestRoute redirectTo="/dashboard">
      <LoginContent />
    </GuestRoute>
  );
}
