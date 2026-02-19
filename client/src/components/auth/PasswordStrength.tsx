/**
 * PasswordStrength - Visual password strength meter
 * Phase 1: Auth UI/UX Harmonization
 */
import { useMemo } from "react";

interface PasswordStrengthProps {
  password: string;
  t: (en: string, fr: string) => string;
}

interface StrengthResult {
  score: number;
  label: string;
  color: string;
}

export function PasswordStrength({ password, t }: PasswordStrengthProps) {
  const strength = useMemo((): StrengthResult => {
    if (!password) return { score: 0, label: "", color: "" };

    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 2) return { score: 1, label: t("Weak", "Faible"), color: "bg-red-500" };
    if (score <= 3) return { score: 2, label: t("Fair", "Moyen"), color: "bg-orange-500" };
    if (score <= 4) return { score: 3, label: t("Good", "Bon"), color: "bg-yellow-500" };
    if (score <= 5) return { score: 4, label: t("Strong", "Fort"), color: "bg-green-500" };
    return { score: 5, label: t("Very Strong", "Tres fort"), color: "bg-emerald-500" };
  }, [password, t]);

  if (!password) return null;

  return (
    <div className="space-y-1.5 mt-2">
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((level) => (
          <div
            key={level}
            className={"h-1 flex-1 rounded-full transition-all duration-300 " + (level <= strength.score ? strength.color : "bg-white/10") + ""}
          />
        ))}
      </div>
      <p className={
        strength.score <= 2 ? "text-[10px] font-medium text-red-400" :
        strength.score <= 3 ? "text-[10px] font-medium text-yellow-400" :
        "text-[10px] font-medium text-green-400"
      }>
        {strength.label}
      </p>
    </div>
  );
}

export default PasswordStrength;
