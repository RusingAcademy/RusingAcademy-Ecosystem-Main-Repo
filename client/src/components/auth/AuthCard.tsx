/**
 * AuthCard — Glassmorphism card container for auth pages (v7)
 * Improved readability: higher contrast text, better glass effect
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
}: AuthCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`w-full mx-auto ${className}`}
    >
      <div
        className="relative rounded-2xl p-7 backdrop-blur-xl"
        style={{
          background: "linear-gradient(135deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.05) 100%)",
          border: "1px solid rgba(255,255,255,0.15)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.3), 0 1px 0 rgba(255,255,255,0.05) inset",
        }}
      >
        {/* Subtle inner glow */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/[0.03] to-transparent pointer-events-none" />

        <div className="relative z-10">
          {title && (
            <div className="text-center mb-6">
              <h2
                className="text-2xl text-white leading-tight mb-1.5"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {title}
              </h2>
              {subtitle && (
                <p className="text-white/75 text-sm leading-relaxed">
                  {subtitle}
                </p>
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
