/**
 * AuthInput — Styled input with icon support and HAZY palette
 * Phase 1: Auth UI/UX Harmonization
 */
import { InputHTMLAttributes, ReactNode, forwardRef } from "react";

interface AuthInputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: ReactNode;
  label?: string;
  error?: string;
  rightElement?: ReactNode;
}

export const AuthInput = forwardRef<HTMLInputElement, AuthInputProps>(
  ({ icon, label, error, rightElement, className = "", id, ...props }, ref) => {
    const inputId = id || `auth-input-${props.name || "field"}`;

    return (
      <div className="space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-medium text-white/50 tracking-wide"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={`w-full ${icon ? "pl-10" : "pl-4"} ${rightElement ? "pr-10" : "pr-4"} py-2.5 rounded-lg bg-white/[0.06] border ${error ? "border-red-500/50" : "border-white/10"} text-white text-sm placeholder:text-white/25 focus:outline-none focus:ring-2 focus:ring-[var(--barholex-gold)]/40 focus:border-[var(--barholex-gold)]/50 focus:bg-white/[0.08] transition-all disabled:opacity-50 ${className}`}
            {...props}
          />
          {rightElement && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {rightElement}
            </div>
          )}
        </div>
        {error && (
          <p className="text-xs text-red-400/80 mt-1">{error}</p>
        )}
      </div>
    );
  }
);

AuthInput.displayName = "AuthInput";

export default AuthInput;
