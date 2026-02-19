/**
 * AuthButton — Primary and secondary auth buttons with HAZY palette
 * Phase 1: Auth UI/UX Harmonization
 */
import { ButtonHTMLAttributes, ReactNode } from "react";
import { Loader2 } from "lucide-react";

interface AuthButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  isLoading?: boolean;
  loadingText?: string;
  icon?: ReactNode;
  fullWidth?: boolean;
}

export function AuthButton({
  children,
  variant = "primary",
  isLoading = false,
  loadingText,
  icon,
  fullWidth = true,
  className = "",
  disabled,
  ...props
}: AuthButtonProps) {
  const baseStyles =
    "flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary:
      "text-white shadow-lg hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] focus:ring-[var(--barholex-gold)]/50",
    secondary:
      "bg-white/[0.06] border border-white/10 text-white hover:bg-white/[0.1] hover:border-white/20 focus:ring-white/20",
    ghost:
      "text-white/60 hover:text-white hover:bg-white/[0.06] focus:ring-white/20",
  };

  const primaryGradient = isLoading
    ? "linear-gradient(135deg, #1a4a4a 0%, #2a6666 50%, #3a8080 100%)"
    : "linear-gradient(135deg, var(--brand-foundation) 0%, #1a6060 50%, #2a8080 100%)";

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${fullWidth ? "w-full" : ""} ${className}`}
      style={variant === "primary" ? { background: primaryGradient } : undefined}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          {loadingText || children}
        </>
      ) : (
        <>
          {icon}
          {children}
        </>
      )}
    </button>
  );
}

export default AuthButton;
