/**
 * AuthCard — Glassmorphism card container for auth pages
 * Phase 1: Auth UI/UX Harmonization with HAZY palette
 */
import { ReactNode } from "react";
import { motion } from "framer-motion";

interface AuthCardProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
  maxWidth?: string;
}

export function AuthCard({
  children,
  title,
  subtitle,
  className = "",
  maxWidth = "max-w-md",
}: AuthCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`w-full ${maxWidth} mx-auto ${className}`}
    >
      <div className="relative rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl shadow-2xl shadow-black/20 p-8">
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
        <div className="relative z-10">
          {title && (
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-white tracking-tight">
                {title}
              </h1>
              {subtitle && (
                <p className="mt-2 text-sm text-white/50">{subtitle}</p>
              )}
            </div>
          )}
          {children}
        </div>
      </div>
    </motion.div>
  );
}

export default AuthCard;
