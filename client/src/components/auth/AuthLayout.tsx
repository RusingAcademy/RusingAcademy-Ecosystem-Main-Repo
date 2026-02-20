/**
 * AuthLayout — Unified auth page layout (v7)
 * Split-panel: Left cream showcase + Right deep teal auth form
 * Consistent across Login, Signup, ForgotPassword, ResetPassword
 *
 * Palette: Foundation #1a3d3d · Gold #D4A853 · Cream #EFECE9
 */
import { ReactNode, useState } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, GraduationCap, BookOpen, Trophy, Shield, Globe } from "lucide-react";

const LOGO_ICON =
  "https://files.manuscdn.com/user_upload_by_module/session_file/310519663049070748/vOOwfivmRZqlQBIL.png";
const DASHBOARD_SCREENSHOT =
  "https://files.manuscdn.com/user_upload_by_module/session_file/310519663049070748/VszWDDWmVcPrzvxa.png";

/* ─── Language Switcher ─── */
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
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white/70 hover:text-white hover:bg-white/10 transition-all border border-white/15 hover:border-white/25"
        aria-label="Switch language"
      >
        <Globe className="w-3.5 h-3.5" />
        {lang === "en" ? "EN" : "FR"}
        <ChevronDown className={`w-3 h-3 transition-transform ${open ? "rotate-180" : ""}`} />
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
                onClick={() => { setLang(l); setOpen(false); }}
                className={`block w-full text-left px-4 py-2.5 text-xs transition-colors ${
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

/* ─── Floating Orb ─── */
function FloatingOrb({ size, color, top, left, delay }: {
  size: number; color: string; top: string; left: string; delay: number;
}) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        width: size, height: size, top, left,
        background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
        filter: "blur(40px)",
      }}
      animate={{ y: [0, -15, 0, 12, 0], x: [0, 8, 0, -8, 0], scale: [1, 1.08, 1, 0.95, 1] }}
      transition={{ duration: 12 + delay * 2, repeat: Infinity, ease: "easeInOut", delay }}
    />
  );
}

interface AuthLayoutProps {
  children: ReactNode;
  showLogo?: boolean;
  language?: "en" | "fr";
  onLanguageChange?: (lang: "en" | "fr") => void;
}

export function AuthLayout({
  children,
  showLogo = true,
  language: langProp,
  onLanguageChange,
}: AuthLayoutProps) {
  const [internalLang, setInternalLang] = useState<"en" | "fr">("en");
  const lang = langProp ?? internalLang;
  const setLang = onLanguageChange ?? setInternalLang;
  const t = (en: string, fr: string) => (lang === "en" ? en : fr);

  return (
    <div className="h-screen w-screen flex flex-col lg:flex-row overflow-hidden">
      {/* ═══════════════════════════════════════════════════════
          LEFT PANEL — Product Showcase (55%) — Desktop only
         ═══════════════════════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="hidden lg:flex lg:flex-col lg:w-[55%] h-full relative overflow-hidden"
        style={{
          background: "linear-gradient(160deg, #F9F7F3 0%, #F0ECE3 40%, #EDE9E0 70%, #F5F2EC 100%)",
        }}
      >
        {/* Decorative blurs */}
        <div className="absolute top-12 right-8 w-64 h-64 rounded-full bg-[var(--brand-foundation)]/[0.04] blur-[80px] pointer-events-none" />
        <div className="absolute bottom-16 left-4 w-48 h-48 rounded-full bg-[var(--barholex-gold)]/[0.06] blur-[60px] pointer-events-none" />
        <div className="absolute top-1/3 left-1/3 w-[400px] h-[400px] rounded-full bg-[var(--brand-foundation)]/[0.02] blur-[120px] pointer-events-none" />

        {/* TOP: Logo + Brand */}
        <div className="relative z-20 shrink-0 flex flex-col items-center justify-center gap-1.5 px-8 pt-8 pb-3">
          <Link to="/" className="flex flex-col items-center gap-1.5 group">
            <motion.img
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              src={LOGO_ICON}
              alt="RusingÂcademy"
              className="w-14 h-14 rounded-xl shadow-md object-contain group-hover:shadow-lg transition-shadow"
              loading="lazy"
            />
            <div className="text-center">
              <h1 className="text-2xl text-[#1a1a1a] leading-none" style={{ fontFamily: "var(--font-display)" }}>
                RusingÂcademy
              </h1>
              <p className="text-[var(--brand-foundation)] font-bold text-[10px] tracking-[0.2em] uppercase mt-1">
                {t("Bilingual Excellence Platform", "Plateforme d'excellence bilingue")}
              </p>
            </div>
          </Link>
        </div>

        {/* CENTER: Dashboard Preview in Browser Frame */}
        <div className="relative z-10 flex-1 flex items-center justify-center px-10 min-h-0 overflow-hidden">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="w-full max-w-[520px]"
          >
            <div className="rounded-xl overflow-hidden shadow-2xl shadow-black/10 border border-gray-200/60">
              {/* Browser bar */}
              <div className="bg-gray-100 px-4 py-2 flex items-center gap-2 border-b border-gray-200/60">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#FEBC2E]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#28C840]" />
                </div>
                <div className="flex-1 mx-4">
                  <div className="bg-white rounded-md px-3 py-1 text-[10px] text-gray-400 font-mono border border-gray-200/60 flex items-center gap-1.5">
                    <Shield className="w-2.5 h-2.5 text-green-500" />
                    rusing.academy/dashboard
                  </div>
                </div>
              </div>
              {/* Screenshot */}
              <div className="relative bg-white">
                <img
                  src={DASHBOARD_SCREENSHOT}
                  alt={t("RusingÂcademy Learning Portal Dashboard", "Tableau de bord du portail RusingÂcademy")}
                  className="w-full h-auto block"
                  loading="lazy"
                />
                <div className="absolute inset-0 pointer-events-none" style={{
                  background: "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 40%, transparent 60%, rgba(255,255,255,0.02) 100%)",
                }} />
              </div>
            </div>
          </motion.div>
        </div>

        {/* BOTTOM: Tagline + Stats */}
        <div className="relative z-20 shrink-0 px-8 pb-8 pt-4 flex flex-col items-center text-center">
          <p className="text-[#555] text-xs leading-relaxed mb-4 max-w-md">
            {t(
              "Master your second official language with Canada's premier bilingual training platform.",
              "Maîtrisez votre langue seconde officielle avec la première plateforme bilingue de formation au Canada.",
            )}
          </p>
          <div className="flex items-center justify-center gap-8">
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
                className="flex items-center gap-2.5"
              >
                <div className="w-9 h-9 rounded-lg bg-[var(--brand-foundation)]/[0.08] flex items-center justify-center">
                  <s.icon className="w-4.5 h-4.5 text-[var(--brand-foundation)]" />
                </div>
                <div>
                  <span className="text-lg font-bold text-[var(--brand-foundation)] leading-none block" style={{ fontFamily: "var(--font-display)" }}>
                    {s.n}
                  </span>
                  <span className="text-[9px] font-semibold text-[#888] tracking-[0.1em] uppercase">
                    {s.l}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ═══════════════════════════════════════════════════════
          RIGHT PANEL — Auth Form (45%) — Desktop
         ═══════════════════════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="hidden lg:flex flex-1 lg:w-[45%] h-full flex-col items-center justify-center relative overflow-hidden px-8"
        style={{
          background: "linear-gradient(160deg, #0F2B2B 0%, #1A3F3F 35%, #1E4A4A 65%, #163636 100%)",
        }}
      >
        {/* Floating orbs */}
        <FloatingOrb size={200} color="rgba(15,61,62,0.25)" top="-5%" left="60%" delay={0} />
        <FloatingOrb size={160} color="rgba(212,168,83,0.12)" top="70%" left="-10%" delay={2} />
        <FloatingOrb size={120} color="rgba(15,61,62,0.15)" top="40%" left="80%" delay={4} />

        {/* Language Switcher */}
        <div className="absolute top-5 right-5 z-30">
          <LanguageSwitcher lang={lang} setLang={setLang} />
        </div>

        {/* Auth Content */}
        <div className="relative z-10 w-full max-w-[400px] flex flex-col overflow-y-auto max-h-[90vh] py-4 scrollbar-hide">
          {children}
        </div>

        {/* Copyright */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center z-10">
          <p className="text-white/25 text-[9px] tracking-wide">
            © {new Date().getFullYear()} Rusinga International Consulting Ltd.
          </p>
        </div>
      </motion.div>

      {/* ═══════════════════════════════════════════════════════
          MOBILE LAYOUT — Full teal background (< lg)
         ═══════════════════════════════════════════════════════ */}
      <div
        className="lg:hidden h-full flex flex-col items-center justify-center px-6 py-8 overflow-y-auto relative"
        style={{
          background: "linear-gradient(160deg, #0F2B2B 0%, #1A3F3F 40%, #1E4A4A 70%, #163636 100%)",
        }}
      >
        {/* Mobile Language Switcher */}
        <div className="absolute top-4 right-4 z-30">
          <LanguageSwitcher lang={lang} setLang={setLang} />
        </div>

        <div className="w-full max-w-sm">
          {/* Mobile Logo */}
          {showLogo && (
            <div className="text-center mb-6">
              <Link to="/">
                <img
                  src={LOGO_ICON}
                  alt="RusingÂcademy"
                  className="w-14 h-14 rounded-2xl shadow-lg mx-auto mb-3"
                  loading="lazy"
                />
                <h1 className="text-2xl text-white" style={{ fontFamily: "var(--font-display)" }}>
                  RusingÂcademy
                </h1>
                <p className="text-[var(--barholex-gold)] font-bold text-[10px] tracking-[0.2em] uppercase mt-1">
                  {t("Bilingual Excellence Platform", "Plateforme d'excellence bilingue")}
                </p>
              </Link>
            </div>
          )}

          {/* Mobile Auth Content */}
          {children}

          {/* Mobile Copyright */}
          <p className="text-center text-white/20 text-[9px] mt-6">
            © {new Date().getFullYear()} Rusinga International Consulting Ltd.
          </p>
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;
