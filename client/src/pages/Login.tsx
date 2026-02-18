/**
 * RusingÂcademy Auth Page — "Institutional Elegance" v6
 * ─────────────────────────────────────────────────────
 * Redesigned to match the target design (Photo 2):
 * Split-panel layout with left cream showcase + right deep teal auth card.
 *
 * Layout: 100vh, no scroll, asymmetric split (55% left / 45% right).
 * Left: Cream gradient with CSS MacBook mockup, real logo above, stats below.
 * Right: Deep teal gradient with glassmorphism auth card, floating orbs.
 * Brand: Foundation (var(--brand-foundation)) · Gold (var(--barholex-gold)) · Cream (#F7F5F0)
 * Typography: var(--font-display) (Merriweather) + Inter (UI)
 * Auth: customAuth (email/password) + Google OAuth + Microsoft OAuth
 *
 * Branch: feat/oauth-login-redesign
 */

import { useState, useRef, useCallback } from "react";
import { Link, useSearch } from "wouter";
import { trpc } from "../lib/trpc";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Eye,
  EyeOff,
  LogIn,
  ChevronDown,
  Users,
  LayoutGrid,
  Shield,
  Facebook,
  Instagram,
  Linkedin,
  Lock,
  Mail,
  ArrowRight,
  GraduationCap,
  BookOpen,
  Trophy,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { GuestRoute, useAuthContext } from "@/contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

/* ─── Debug Mode ─── */
const AUTH_DEBUG = import.meta.env.VITE_AUTH_DEBUG === "true";

/* ─── CDN Assets ─── */
const DASHBOARD_SCREENSHOT =
  "https://files.manuscdn.com/user_upload_by_module/session_file/310519663049070748/VszWDDWmVcPrzvxa.png";
const LOGO_ICON =
  "https://files.manuscdn.com/user_upload_by_module/session_file/310519663049070748/vOOwfivmRZqlQBIL.png";

/* ═══════════════════════════════════════════════════════
   Decorative Components
   ═══════════════════════════════════════════════════════ */

/* ─── Floating Orb ─── */
function FloatingOrb({
  size,
  color,
  top,
  left,
  delay,
}: {
  size: number;
  color: string;
  top: string;
  left: string;
  delay: number;
}) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        width: size,
        height: size,
        top,
        left,
        background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
        filter: "blur(40px)",
      }}
      animate={{
        y: [0, -15, 0, 12, 0],
        x: [0, 8, 0, -8, 0],
        scale: [1, 1.08, 1, 0.95, 1],
      }}
      transition={{
        duration: 12 + delay * 2,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      }}
    />
  );
}

/* ─── Realistic MacBook Keyboard ─── */
const KEY_STYLE: React.CSSProperties = {
  background: "linear-gradient(180deg, #333 0%, #252525 40%, #1e1e1e 100%)",
  borderRadius: "2px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#b0b0b0",
  fontFamily:
    "'SF Pro Text', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif",
  fontWeight: 400,
  lineHeight: 1,
  userSelect: "none" as const,
  boxShadow:
    "0 0.5px 1px rgba(0,0,0,0.4), inset 0 0.5px 0 rgba(255,255,255,0.06), inset 0 -0.5px 0 rgba(0,0,0,0.2)",
  position: "relative" as const,
  overflow: "hidden" as const,
};

function Key({
  label,
  w,
  h = 9,
  fontSize = 3.5,
}: {
  label: string;
  w?: string;
  h?: number;
  fontSize?: number;
}) {
  return (
    <div
      className="flex-1"
      style={{
        ...KEY_STYLE,
        height: `${h}px`,
        fontSize: `${fontSize}px`,
        letterSpacing: "0.2px",
        ...(w ? { flex: "none", width: w } : {}),
      }}
    >
      {label}
    </div>
  );
}

function FnKey({ label }: { label: string }) {
  return (
    <div
      className="flex-1"
      style={{
        ...KEY_STYLE,
        height: "6px",
        fontSize: "2.5px",
        letterSpacing: "0.1px",
      }}
    >
      {label}
    </div>
  );
}

function RealisticKeyboard() {
  return (
    <div className="flex flex-col gap-[1.5px]">
      {/* Row 0 — Touch Bar / Function keys */}
      <div className="flex gap-[1.5px]">
        <FnKey label="esc" />
        <FnKey label="F1" />
        <FnKey label="F2" />
        <FnKey label="F3" />
        <FnKey label="F4" />
        <FnKey label="F5" />
        <FnKey label="F6" />
        <FnKey label="F7" />
        <FnKey label="F8" />
        <FnKey label="F9" />
        <FnKey label="F10" />
        <FnKey label="F11" />
        <FnKey label="F12" />
        <div
          className="flex-1"
          style={{ ...KEY_STYLE, height: "6px", fontSize: "2.5px" }}
        >
          <svg
            width="5"
            height="3"
            viewBox="0 0 10 6"
            fill="none"
          >
            <circle
              cx="5"
              cy="3"
              r="2.5"
              stroke="#888"
              strokeWidth="0.8"
              fill="none"
            />
          </svg>
        </div>
      </div>

      {/* Row 1 — Number row */}
      <div className="flex gap-[1.5px]">
        <Key label="`" />
        <Key label="1" />
        <Key label="2" />
        <Key label="3" />
        <Key label="4" />
        <Key label="5" />
        <Key label="6" />
        <Key label="7" />
        <Key label="8" />
        <Key label="9" />
        <Key label="0" />
        <Key label="-" />
        <Key label="=" />
        <Key label="delete" w="9.5%" fontSize={2.8} />
      </div>

      {/* Row 2 — QWERTY */}
      <div className="flex gap-[1.5px]">
        <Key label="tab" w="9%" fontSize={2.8} />
        <Key label="Q" />
        <Key label="W" />
        <Key label="E" />
        <Key label="R" />
        <Key label="T" />
        <Key label="Y" />
        <Key label="U" />
        <Key label="I" />
        <Key label="O" />
        <Key label="P" />
        <Key label="[" />
        <Key label="]" />
        <Key label="\\" />
      </div>

      {/* Row 3 — ASDF */}
      <div className="flex gap-[1.5px]">
        <Key label="caps" w="11%" fontSize={2.8} />
        <Key label="A" />
        <Key label="S" />
        <Key label="D" />
        <Key label="F" />
        <Key label="G" />
        <Key label="H" />
        <Key label="J" />
        <Key label="K" />
        <Key label="L" />
        <Key label=";" />
        <Key label="'" />
        <Key label="return" w="11%" fontSize={2.8} />
      </div>

      {/* Row 4 — ZXCV */}
      <div className="flex gap-[1.5px]">
        <Key label="shift" w="14%" fontSize={2.8} />
        <Key label="Z" />
        <Key label="X" />
        <Key label="C" />
        <Key label="V" />
        <Key label="B" />
        <Key label="N" />
        <Key label="M" />
        <Key label="," />
        <Key label="." />
        <Key label="/" />
        <Key label="shift" w="14%" fontSize={2.8} />
      </div>

      {/* Row 5 — Space bar row */}
      <div className="flex gap-[1.5px] items-end">
        <Key label="fn" w="5%" fontSize={2.5} />
        <Key label="ctrl" w="5%" fontSize={2.5} />
        <Key label="opt" w="5%" fontSize={2.5} />
        <Key label="cmd" w="7%" fontSize={2.5} />
        {/* Space bar */}
        <div className="flex-1" style={{ ...KEY_STYLE, height: "9px" }} />
        <Key label="cmd" w="7%" fontSize={2.5} />
        <Key label="opt" w="5%" fontSize={2.5} />
        {/* Arrow keys — inverted T */}
        <div
          className="flex flex-col gap-[0.5px]"
          style={{ width: "10%", flexShrink: 0 }}
        >
          <div className="flex justify-center">
            <div
              style={{
                ...KEY_STYLE,
                height: "4px",
                width: "33%",
                fontSize: "3px",
              }}
            >
              ▲
            </div>
          </div>
          <div className="flex gap-[0.5px]">
            <div
              style={{ ...KEY_STYLE, height: "4px", flex: 1, fontSize: "3px" }}
            >
              ◀
            </div>
            <div
              style={{ ...KEY_STYLE, height: "4px", flex: 1, fontSize: "3px" }}
            >
              ▼
            </div>
            <div
              style={{ ...KEY_STYLE, height: "4px", flex: 1, fontSize: "3px" }}
            >
              ▶
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── CSS MacBook Mockup ─── */
function MacBookMockup({
  screenshot,
  alt,
}: {
  screenshot: string;
  alt: string;
}) {
  return (
    <div className="relative w-full" style={{ perspective: "1200px" }}>
      <motion.div
        initial={{ opacity: 0, rotateY: -6, scale: 0.94 }}
        animate={{ opacity: 1, rotateY: 0, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="relative mx-auto"
      >
        {/* Screen bezel */}
        <div
          className="relative rounded-t-xl overflow-hidden mx-auto"
          style={{
            background: "linear-gradient(180deg, #2d2d2d 0%, var(--text) 100%)",
            padding: "8px 8px 5px 8px",
            boxShadow:
              "0 -2px 30px rgba(0,0,0,0.2), 0 8px 40px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.08)",
          }}
        >
          {/* Camera dot */}
          <div className="absolute top-[3px] left-1/2 -translate-x-1/2 w-[5px] h-[5px] rounded-full bg-[#3a3a3a] border border-[#2a2a2a]" />

          {/* Screen — dashboard screenshot */}
          <div
            className="relative rounded-[3px] overflow-hidden"
            style={{ boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.3)" }}
          >
            <img
              src={screenshot}
              alt={alt}
              className="w-full h-auto block"
              loading="lazy"
              style={{
                imageRendering: "auto",
                WebkitFontSmoothing: "antialiased",
              }}
            />
            {/* Screen glare */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 40%, transparent 60%, rgba(255,255,255,0.02) 100%)",
              }}
            />
          </div>
        </div>

        {/* Bottom hinge / lip */}
        <div
          className="mx-auto relative"
          style={{
            width: "101%",
            maxWidth: "101%",
            marginLeft: "-0.5%",
            height: "6px",
            background:
              "linear-gradient(180deg, #c0c0c0 0%, #a8a8a8 30%, #b8b8b8 70%, #d0d0d0 100%)",
            borderRadius: "0 0 2px 2px",
            boxShadow:
              "0 1px 4px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.4)",
          }}
        >
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2"
            style={{
              width: "16%",
              height: "2px",
              background: "linear-gradient(180deg, #999 0%, #b0b0b0 100%)",
              borderRadius: "0 0 2px 2px",
            }}
          />
        </div>

        {/* Keyboard body */}
        <div
          className="mx-auto relative"
          style={{
            width: "102%",
            maxWidth: "102%",
            marginLeft: "-1%",
            marginTop: "0px",
            height: "auto",
            background:
              "linear-gradient(180deg, #e8e8e8 0%, #d4d4d4 40%, #c8c8c8 100%)",
            borderRadius: "0 0 8px 8px",
            padding: "6px 10px 8px 10px",
            boxShadow:
              "0 4px 12px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.5)",
          }}
        >
          <RealisticKeyboard />

          {/* Trackpad */}
          <div
            className="mx-auto mt-[5px] rounded-[4px]"
            style={{
              width: "38%",
              height: "24px",
              background: "linear-gradient(180deg, #d2d2d2 0%, #c6c6c6 100%)",
              boxShadow:
                "inset 0 0 0 0.5px rgba(0,0,0,0.1), inset 0 1px 2px rgba(0,0,0,0.05)",
            }}
          />
        </div>
      </motion.div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   Language Switcher
   ═══════════════════════════════════════════════════════ */
function LanguageSwitcher({
  lang,
  setLang,
}: {
  lang: "en" | "fr";
  setLang: (l: "en" | "fr") => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-white/60 hover:text-white hover:bg-white/10 transition-all border border-white/10 hover:border-white/20"
        aria-label="Switch language"
      >
        {lang === "en" ? "EN" : "FR"}
        <ChevronDown
          className={`w-3 h-3 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden z-50"
          >
            {(["en", "fr"] as const).map((l) => (
              <button
                key={l}
                onClick={() => {
                  setLang(l);
                  setOpen(false);
                }}
                className={`block w-full text-left px-4 py-2 text-xs transition-colors ${
                  lang === l
                    ? "bg-[var(--brand-foundation)]/10 text-[var(--brand-foundation)] font-semibold"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                {l === "en" ? "English" : "Français"}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   Icon Components
   ═══════════════════════════════════════════════════════ */

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

function MicrosoftIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 21 21">
      <rect x="1" y="1" width="9" height="9" fill="#F25022" />
      <rect x="11" y="1" width="9" height="9" fill="#7FBA00" />
      <rect x="1" y="11" width="9" height="9" fill="#00A4EF" />
      <rect x="11" y="11" width="9" height="9" fill="#FFB900" />
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════
   LoginContent — Main Auth Component
   ═══════════════════════════════════════════════════════
   Portal's "Institutional Elegance" visual design (Photo 2)
   with Main's complete auth infrastructure:
   - customAuth email/password login via tRPC mutation
   - Google OAuth (/api/auth/google)
   - Microsoft OAuth (/api/auth/microsoft)
   - OAuth error handling from URL params
   - GuestRoute wrapper for auth state management
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

  /* ─── customAuth Login Mutation (Main's auth system) ─── */
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
        setError(
          t(
            "Login failed. Please try again.",
            "Échec de connexion. Veuillez réessayer.",
          ),
        );
        setIsSubmitting(false);
      }
    },
    onError: (err) => {
      if (AUTH_DEBUG) console.error("[Login] Error:", err.message);
      setError(err.message);
      setIsSubmitting(false);
    },
  });

  /* ─── Form Submit (email/password) ─── */
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setError(null);
      setLoginSuccess(false);
      setIsSubmitting(true);

      if (!email || !password) {
        setError(
          t(
            "Please enter both email and password",
            "Veuillez entrer votre courriel et mot de passe",
          ),
        );
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
     RENDER — Institutional Elegance Layout (Photo 2)
     ═══════════════════════════════════════════════════════ */
  return (
    <div className="h-screen w-screen flex flex-col lg:flex-row overflow-hidden">
      {/* ═══════════════════════════════════════════════════════
          LEFT PANEL — Product Showcase (55%)
          Logo → MacBook Mockup → Stats
         ═══════════════════════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="hidden lg:flex lg:flex-col lg:w-[55%] h-full relative overflow-hidden"
        style={{
          background:
            "linear-gradient(160deg, #F9F7F3 0%, #F0ECE3 40%, #EDE9E0 70%, #F5F2EC 100%)",
        }}
      >
        {/* Decorative blurs */}
        <div className="absolute top-12 right-8 w-64 h-64 rounded-full bg-[var(--brand-foundation)]/[0.04] blur-[80px] pointer-events-none" />
        <div className="absolute bottom-16 left-4 w-48 h-48 rounded-full bg-[var(--barholex-gold)]/[0.06] blur-[60px] pointer-events-none" />
        <div className="absolute top-1/3 left-1/3 w-[400px] h-[400px] rounded-full bg-[var(--brand-foundation)]/[0.02] blur-[120px] pointer-events-none" />

        {/* ─── TOP: Logo + Brand ─── */}
        <div className="relative z-20 shrink-0 flex flex-col items-center justify-center gap-1 px-8 pt-3 pb-1">
          <motion.img
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            src={LOGO_ICON}
            alt="RusingÂcademy"
            className="w-12 h-12 rounded-xl shadow-md object-contain"
            loading="lazy"
          />
          <div className="text-center">
            <h1
              className="text-2xl text-[#1a1a1a] leading-none"
              style={{ fontFamily: "var(--font-display)" }}
            >
              RusingÂcademy
            </h1>
            <p className="text-[var(--brand-foundation)] font-bold text-[10px] tracking-[0.2em] uppercase mt-0.5">
              {t("Learning Portal", "Portail d'apprentissage")}
            </p>
          </div>
        </div>

        {/* ─── CENTER: MacBook Mockup ─── */}
        <div className="relative z-10 flex-1 flex items-center justify-center px-6 min-h-0 overflow-hidden">
          <div className="w-full max-w-[600px]">
            <MacBookMockup
              screenshot={DASHBOARD_SCREENSHOT}
              alt={t(
                "RusingÂcademy Learning Portal Dashboard — ESL & FSL Programs, Progress Tracking, Leaderboard",
                "Tableau de bord du portail d'apprentissage RusingÂcademy — Programmes ALS & FLS, Suivi des progrès, Classement",
              )}
            />
          </div>
        </div>

        {/* ─── BOTTOM: Tagline + Stats ─── */}
        <div className="relative z-20 shrink-0 px-8 pb-4 pt-2 flex flex-col items-center text-center">
          <p className="text-[#666] text-[11px] leading-snug mb-2 max-w-md">
            {t(
              "Master your second official language with Canada's premier bilingual training platform.",
              "Maîtrisez votre langue seconde officielle avec la première plateforme bilingue de formation au Canada.",
            )}
          </p>
          <div className="flex items-center justify-center gap-6">
            {[
              { n: "12", l: t("Paths", "Parcours"), icon: GraduationCap },
              { n: "192", l: t("Lessons", "Leçons"), icon: BookOpen },
              { n: "1,344", l: t("Activities", "Activités"), icon: Trophy },
            ].map((s, i) => (
              <motion.div
                key={s.l}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + i * 0.1 }}
                className="flex items-center gap-2"
              >
                <div className="w-7 h-7 rounded-lg bg-[var(--brand-foundation)]/[0.08] flex items-center justify-center">
                  <s.icon className="w-4 h-4 text-[var(--brand-foundation)]" />
                </div>
                <div>
                  <span
                    className="text-lg font-bold text-[var(--brand-foundation)] leading-none block"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {s.n}
                  </span>
                  <span className="text-[8px] font-semibold text-[#999] tracking-[0.1em] uppercase">
                    {s.l}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ═══════════════════════════════════════════════════════
          RIGHT PANEL — Auth Form (45%)
          Deep teal gradient + glassmorphism card
         ═══════════════════════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="hidden lg:flex flex-1 lg:w-[45%] h-full flex-col items-center justify-center relative overflow-hidden px-6"
        style={{
          background:
            "linear-gradient(160deg, #0F2B2B 0%, #1A3F3F 35%, #1E4A4A 65%, #163636 100%)",
        }}
      >
        {/* Floating orbs */}
        <FloatingOrb
          size={200}
          color="rgba(15,61,62,0.25)"
          top="-5%"
          left="60%"
          delay={0}
        />
        <FloatingOrb
          size={160}
          color="rgba(212,168,83,0.12)"
          top="70%"
          left="-10%"
          delay={2}
        />
        <FloatingOrb
          size={120}
          color="rgba(15,61,62,0.15)"
          top="40%"
          left="80%"
          delay={4}
        />

        {/* Language Switcher — top right */}
        <div className="absolute top-4 right-4 z-30">
          <LanguageSwitcher lang={language} setLang={setLanguage} />
        </div>

        {/* ─── Glassmorphism Auth Card ─── */}
        <div className="relative z-10 w-full max-w-[380px] flex flex-col">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.2,
              duration: 0.6,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="rounded-2xl p-6 backdrop-blur-xl"
            style={{
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)",
              border: "1px solid rgba(255,255,255,0.12)",
              boxShadow:
                "0 8px 32px rgba(0,0,0,0.3), 0 1px 0 rgba(255,255,255,0.05) inset",
            }}
          >
            {/* Card Header */}
            <div className="text-center mb-5">
              <h2
                className="text-2xl text-white leading-tight mb-1"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {t("Welcome Back", "Bon retour")}
              </h2>
              <p className="text-white/50 text-xs">
                {t(
                  "Sign in to continue your learning journey",
                  "Connectez-vous pour continuer votre parcours",
                )}
              </p>
            </div>

            {/* OAuth Error Alert */}
            {oauthError && (
              <Alert
                variant="destructive"
                className="mb-4 bg-red-900/50 border-red-800"
              >
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {getOAuthErrorMessage(oauthError)}
                </AlertDescription>
              </Alert>
            )}

            {/* Login Error Alert */}
            {error && (
              <Alert
                variant="destructive"
                className="mb-4 bg-red-900/50 border-red-800"
              >
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Login Success Alert */}
            {loginSuccess && (
              <Alert className="mb-4 bg-green-900/50 border-green-800">
                <CheckCircle2 className="h-4 w-4 text-green-400" />
                <AlertDescription className="text-green-400">
                  {t(
                    "Login successful! Redirecting...",
                    "Connexion réussie ! Redirection...",
                  )}
                </AlertDescription>
              </Alert>
            )}

            {/* Email + Password Form (Main's customAuth) */}
            <form
              ref={formRef}
              onSubmit={handleSubmit}
              className="space-y-3 mb-4"
            >
              {/* Email */}
              <div>
                <label
                  htmlFor="login-email"
                  className="block text-white/40 text-[10px] font-semibold tracking-wider uppercase mb-1.5"
                >
                  {t("Email", "Courriel")}
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <input
                    id="login-email"
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t("your@email.com", "votre@courriel.com")}
                    required
                    disabled={isPending || loginSuccess}
                    autoComplete="email"
                    aria-label={t("Email address", "Adresse courriel")}
                    className="w-full pl-10 pr-3 py-2.5 rounded-lg bg-white/[0.06] border border-white/10 text-white text-sm placeholder:text-white/25 focus:outline-none focus:ring-2 focus:ring-[var(--barholex-gold)]/40 focus:border-[var(--barholex-gold)]/50 focus:bg-white/[0.08] transition-all disabled:opacity-50"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label
                    htmlFor="login-password"
                    className="block text-white/40 text-[10px] font-semibold tracking-wider uppercase"
                  >
                    {t("Password", "Mot de passe")}
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-[var(--barholex-gold)]/60 text-[10px] hover:text-[var(--barholex-gold)] transition-colors"
                  >
                    {t("Forgot?", "Oublié ?")}
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    disabled={isPending || loginSuccess}
                    autoComplete="current-password"
                    aria-label={t("Password", "Mot de passe")}
                    className="w-full pl-10 pr-10 py-2.5 rounded-lg bg-white/[0.06] border border-white/10 text-white text-sm placeholder:text-white/25 focus:outline-none focus:ring-2 focus:ring-[var(--barholex-gold)]/40 focus:border-[var(--barholex-gold)]/50 focus:bg-white/[0.08] transition-all disabled:opacity-50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                    aria-label={
                      showPassword
                        ? t("Hide password", "Masquer le mot de passe")
                        : t("Show password", "Afficher le mot de passe")
                    }
                    aria-pressed={showPassword}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Primary CTA — Sign In with Email */}
              <button aria-label="Action"
                type="submit"
                disabled={isPending || loginSuccess}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-white text-sm font-bold shadow-lg shadow-[var(--brand-foundation)]/30 hover:shadow-xl hover:shadow-[var(--brand-foundation)]/40 hover:scale-[1.01] active:scale-[0.99] transition-all mt-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 focus:outline-none focus:ring-2 focus:ring-[var(--barholex-gold)]/50 focus:ring-offset-2 focus:ring-offset-transparent"
                style={{
                  background: isPending
                    ? "linear-gradient(135deg, #1a4a4a 0%, #2a6666 50%, #3a8080 100%)"
                    : loginSuccess
                      ? "linear-gradient(135deg, #166534 0%, #15803d 50%, var(--success) 100%)"
                      : "linear-gradient(135deg, var(--brand-foundation) 0%, #1a6060 50%, #2a8080 100%)",
                }}
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {t("Signing in...", "Connexion en cours...")}
                  </>
                ) : loginSuccess ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    {t("Success!", "Réussi !")}
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    {t("Sign In with Email", "Se connecter par courriel")}
                    <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-white/30 text-[10px] font-semibold tracking-wider uppercase">
                {t("Or continue with", "Ou continuer avec")}
              </span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            {/* SSO Buttons — Google + Microsoft (Main's OAuth) */}
            <div className="grid grid-cols-2 gap-2.5 mb-4">
              <button aria-label="Action"
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isPending || loginSuccess}
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-white text-[#333] text-xs font-semibold shadow-sm hover:shadow-lg hover:bg-gray-50 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[var(--barholex-gold)]/50"
              >
                <GoogleIcon />
                Google
              </button>
              <button aria-label="Action"
                type="button"
                onClick={handleMicrosoftSignIn}
                disabled={isPending || loginSuccess}
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-[#2F2F2F] text-white text-xs font-semibold shadow-sm hover:bg-[#3a3a3a] hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[var(--barholex-gold)]/50"
              >
                <MicrosoftIcon />
                Microsoft
              </button>
            </div>

            {/* Sign Up Link */}
            <p className="text-center text-white/40 text-xs">
              {t("Don't have an account?", "Pas encore de compte ?")}{" "}
              <Link
                to="/signup"
                className="text-[var(--barholex-gold)] font-semibold hover:text-[#e0b860] transition-colors"
              >
                {t("Sign up", "S'inscrire")}
              </Link>
            </p>
          </motion.div>

          {/* ─── Portal Access + Social + Copyright ─── */}
          <div className="mt-5 space-y-3">
            {/* Portal Access */}
            <div>
              <p className="text-center text-white/20 text-[9px] font-semibold tracking-[0.2em] uppercase mb-2">
                {t("Other Portals", "Autres portails")}
              </p>
              <div className="grid grid-cols-3 gap-2">
                {[
                  {
                    name: t("Coach", "Coach"),
                    icon: Users,
                    color: "#6C5CE7",
                    href: "/coach",
                  },
                  {
                    name: t("Client", "Client"),
                    icon: LayoutGrid,
                    color: "var(--brand-foundation)",
                    href: "/hr",
                  },
                  {
                    name: t("Admin", "Admin"),
                    icon: Shield,
                    color: "#D63031",
                    href: "/admin",
                  },
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
                      <portal.icon
                        className="w-3.5 h-3.5"
                        style={{ color: portal.color }}
                      />
                      <span className="text-white/50 text-[10px] font-medium group-hover:text-white/70 transition-colors">
                        {portal.name}
                      </span>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Social + Copyright */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                {[
                  {
                    icon: Facebook,
                    href: "https://www.facebook.com/people/Rusing%C3%82cademy/100063464145177/",
                    label: "Facebook",
                  },
                  {
                    icon: Instagram,
                    href: "https://www.instagram.com/barholex/",
                    label: "Instagram",
                  },
                  {
                    icon: Linkedin,
                    href: "https://www.linkedin.com/company/rusing%C3%A2cademy/?viewAsMember=true",
                    label: "LinkedIn",
                  },
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
              <p className="text-white/15 text-[9px] tracking-wide">
                © 2026 Rusinga International Consulting Ltd.
              </p>
            </div>
          </div>
        </div>

        {/* Secure redirect notice */}
        <div className="absolute bottom-3 left-0 right-0 flex justify-center z-10">
          <p className="text-white/15 text-[8px] tracking-wide flex items-center gap-1">
            <Lock className="w-2.5 h-2.5" />
            {t(
              "Secured by 256-bit encryption",
              "Sécurisé par chiffrement 256 bits",
            )}
          </p>
        </div>
      </motion.div>

      {/* ═══════════════════════════════════════════════════════
          MOBILE FALLBACK — shown on small screens (< lg)
         ═══════════════════════════════════════════════════════ */}
      <div
        className="lg:hidden h-full flex flex-col items-center justify-center px-6 py-8 overflow-y-auto"
        style={{
          background:
            "linear-gradient(160deg, #0F2B2B 0%, #1A3F3F 40%, #1E4A4A 70%, #163636 100%)",
        }}
      >
        {/* Mobile Language Switcher */}
        <div className="absolute top-4 right-4 z-30">
          <LanguageSwitcher lang={language} setLang={setLanguage} />
        </div>

        <div className="w-full max-w-sm">
          {/* Mobile Logo */}
          <div className="text-center mb-6">
            <img
              src={LOGO_ICON}
              alt="RusingÂcademy"
              className="w-14 h-14 rounded-2xl shadow-lg mx-auto mb-3"
              loading="lazy"
            />
            <h1
              className="text-2xl text-white"
              style={{ fontFamily: "var(--font-display)" }}
            >
              RusingÂcademy
            </h1>
            <p className="text-[var(--barholex-gold)] font-bold text-[10px] tracking-[0.2em] uppercase mt-1">
              {t("Learning Portal", "Portail d'apprentissage")}
            </p>
          </div>

          {/* Mobile Error/Success Alerts */}
          {oauthError && (
            <Alert
              variant="destructive"
              className="mb-4 bg-red-900/50 border-red-800"
            >
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {getOAuthErrorMessage(oauthError)}
              </AlertDescription>
            </Alert>
          )}
          {error && (
            <Alert
              variant="destructive"
              className="mb-4 bg-red-900/50 border-red-800"
            >
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {loginSuccess && (
            <Alert className="mb-4 bg-green-900/50 border-green-800">
              <CheckCircle2 className="h-4 w-4 text-green-400" />
              <AlertDescription className="text-green-400">
                {t(
                  "Login successful! Redirecting...",
                  "Connexion réussie ! Redirection...",
                )}
              </AlertDescription>
            </Alert>
          )}

          {/* Mobile Auth Form */}
          <form onSubmit={handleSubmit} className="space-y-3 mb-5">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("your@email.com", "votre@courriel.com")}
                required
                disabled={isPending || loginSuccess}
                autoComplete="email"
                aria-label={t("Email address", "Adresse courriel")}
                className="w-full pl-10 pr-3 py-3 rounded-xl bg-white/[0.06] border border-white/10 text-white text-sm placeholder:text-white/25 focus:outline-none focus:ring-2 focus:ring-[var(--barholex-gold)]/40 focus:border-[var(--barholex-gold)]/50 transition-all disabled:opacity-50"
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                disabled={isPending || loginSuccess}
                autoComplete="current-password"
                aria-label={t("Password", "Mot de passe")}
                className="w-full pl-10 pr-10 py-3 rounded-xl bg-white/[0.06] border border-white/10 text-white text-sm placeholder:text-white/25 focus:outline-none focus:ring-2 focus:ring-[var(--barholex-gold)]/40 focus:border-[var(--barholex-gold)]/50 transition-all disabled:opacity-50"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                aria-label={
                  showPassword
                    ? t("Hide password", "Masquer le mot de passe")
                    : t("Show password", "Afficher le mot de passe")
                }
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            <div className="flex justify-end">
              <Link
                to="/forgot-password"
                className="text-[var(--barholex-gold)]/60 text-[10px] hover:text-[var(--barholex-gold)] transition-colors"
              >
                {t("Forgot password?", "Mot de passe oublié ?")}
              </Link>
            </div>
            <button aria-label="Action"
              type="submit"
              disabled={isPending || loginSuccess}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-white text-sm font-bold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[var(--barholex-gold)]/50"
              style={{
                background: isPending
                  ? "linear-gradient(135deg, #1a4a4a 0%, #2a6666 50%, #3a8080 100%)"
                  : loginSuccess
                    ? "linear-gradient(135deg, #166534 0%, #15803d 50%, var(--success) 100%)"
                    : "linear-gradient(135deg, var(--brand-foundation) 0%, #1a6060 50%, #2a8080 100%)",
              }}
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {t("Signing in...", "Connexion...")}
                </>
              ) : loginSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  {t("Success!", "Réussi !")}
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  {t("Sign In with Email", "Se connecter par courriel")}
                </>
              )}
            </button>
          </form>

          {/* Mobile SSO */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-white/30 text-[10px] font-semibold tracking-wider uppercase">
              {t("Or", "Ou")}
            </span>
            <div className="flex-1 h-px bg-white/10" />
          </div>
          <div className="grid grid-cols-2 gap-2 mb-4">
            <button aria-label="Action"
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isPending || loginSuccess}
              className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white text-[#333] text-xs font-semibold disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-[var(--barholex-gold)]/50"
            >
              <GoogleIcon />
              Google
            </button>
            <button aria-label="Action"
              type="button"
              onClick={handleMicrosoftSignIn}
              disabled={isPending || loginSuccess}
              className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#2F2F2F] text-white text-xs font-semibold disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-[var(--barholex-gold)]/50"
            >
              <MicrosoftIcon />
              Microsoft
            </button>
          </div>

          {/* Mobile Sign Up */}
          <p className="text-center text-white/40 text-xs">
            {t("Don't have an account?", "Pas encore de compte ?")}{" "}
            <Link
              to="/signup"
              className="text-[var(--barholex-gold)] font-semibold"
            >
              {t("Sign up", "S'inscrire")}
            </Link>
          </p>

          {/* Mobile Copyright */}
          <p className="text-center text-white/15 text-[9px] mt-6">
            © 2026 Rusinga International Consulting Ltd.
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
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   Login — Wrapped with GuestRoute
   ═══════════════════════════════════════════════════════
   GuestRoute ensures:
   1. Shows loading while auth is being checked
   2. Redirects to dashboard if already authenticated
   3. Only shows login form for guests
   ═══════════════════════════════════════════════════════ */
export default function Login() {
  return (
    <GuestRoute redirectTo="/dashboard">
      <LoginContent />
    </GuestRoute>
  );
}
