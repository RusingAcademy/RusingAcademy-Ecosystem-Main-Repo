/**
 * AuthLayout — Full-page auth background with HAZY floating orbs
 * Phase 1: Auth UI/UX Harmonization
 */
import { ReactNode } from "react";
import { Link } from "wouter";

interface AuthLayoutProps {
  children: ReactNode;
  showLogo?: boolean;
}

export function AuthLayout({ children, showLogo = true }: AuthLayoutProps) {
  return (
    <div className="min-h-screen relative overflow-hidden bg-[#0a0a0a] flex flex-col items-center justify-center px-4 py-8">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0d1b2a]/80 via-[#0a0a0a] to-[#1a0a2e]/60" />

      {/* Floating orbs */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-[var(--brand-foundation)]/8 blur-[120px] animate-pulse" />
      <div className="absolute bottom-1/4 -right-32 w-80 h-80 rounded-full bg-[var(--barholex-gold)]/6 blur-[100px] animate-pulse" style={{ animationDelay: "2s" }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#1a3a4a]/10 blur-[150px]" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-md">
        {showLogo && (
          <div className="text-center mb-8">
            <Link to="/" className="inline-block">
              <h2 className="text-2xl font-bold text-white tracking-tight">
                Rusing<span className="text-[var(--barholex-gold)]">A</span>cademy
              </h2>
              <p className="text-[10px] text-white/30 tracking-[0.3em] uppercase mt-1">
                Bilingual Excellence Platform
              </p>
            </Link>
          </div>
        )}
        {children}
      </div>

      {/* Footer */}
      <div className="relative z-10 mt-8 text-center">
        <p className="text-white/20 text-[10px]">
          &copy; {new Date().getFullYear()} Rusinga International Consulting Ltd.
        </p>
      </div>
    </div>
  );
}

export default AuthLayout;
