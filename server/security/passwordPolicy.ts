/**
 * Password Policy — Phase 6 Security Hardening
 *
 * Enforces strong password requirements for the RusingAcademy ecosystem.
 * Used by signup, password change, and invitation acceptance flows.
 */

export interface PasswordValidationResult {
  valid: boolean;
  errors: string[];
  strength: "weak" | "fair" | "strong" | "excellent";
  score: number; // 0-100
}

/**
 * Password policy configuration
 */
const POLICY = {
  minLength: 8,
  maxLength: 128,
  requireUppercase: true,
  requireLowercase: true,
  requireDigit: true,
  requireSpecial: false, // Recommended but not required
  commonPasswordsCheck: true,
};

/**
 * Common passwords to reject (top 50 most common)
 */
const COMMON_PASSWORDS = new Set([
  "password", "12345678", "123456789", "1234567890", "qwerty123",
  "password1", "iloveyou", "sunshine1", "princess1", "football1",
  "charlie1", "access14", "trustno1", "letmein01", "dragon12",
  "master12", "monkey12", "shadow12", "michael1", "jennifer",
  "abc12345", "password123", "welcome1", "qwerty12", "admin123",
  "passw0rd", "p@ssw0rd", "changeme", "welcome!", "test1234",
  "baseball", "superman", "starwars", "whatever", "computer",
  "internet", "security", "midnight", "corvette", "maverick",
  "december", "november", "february", "mountain", "platinum",
  "diamonds", "hardcore", "hardcore1", "password!", "qwertyui",
]);

/**
 * Validate a password against the policy
 */
export function validatePassword(password: string, email?: string): PasswordValidationResult {
  const errors: string[] = [];
  let score = 0;

  // Length checks
  if (password.length < POLICY.minLength) {
    errors.push(`Password must be at least ${POLICY.minLength} characters`);
  } else {
    score += 20;
    if (password.length >= 12) score += 10;
    if (password.length >= 16) score += 10;
  }

  if (password.length > POLICY.maxLength) {
    errors.push(`Password must be no more than ${POLICY.maxLength} characters`);
  }

  // Character class checks
  if (POLICY.requireUppercase && !/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  } else if (/[A-Z]/.test(password)) {
    score += 15;
  }

  if (POLICY.requireLowercase && !/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  } else if (/[a-z]/.test(password)) {
    score += 15;
  }

  if (POLICY.requireDigit && !/[0-9]/.test(password)) {
    errors.push("Password must contain at least one digit");
  } else if (/[0-9]/.test(password)) {
    score += 15;
  }

  // Special characters (bonus, not required)
  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    score += 15;
  }

  // Common password check
  if (POLICY.commonPasswordsCheck && COMMON_PASSWORDS.has(password.toLowerCase())) {
    errors.push("This password is too common, please choose a more unique password");
    score = Math.min(score, 10);
  }

  // Email similarity check
  if (email) {
    const emailLocal = email.split("@")[0].toLowerCase();
    if (password.toLowerCase().includes(emailLocal) && emailLocal.length > 3) {
      errors.push("Password should not contain your email address");
      score = Math.max(score - 20, 0);
    }
  }

  // Repetition check (e.g., "aaaaaaa" or "1111111")
  if (/(.)\1{4,}/.test(password)) {
    errors.push("Password should not contain more than 4 repeated characters");
    score = Math.max(score - 15, 0);
  }

  // Sequential check (e.g., "12345678" or "abcdefgh")
  if (hasSequentialChars(password, 5)) {
    score = Math.max(score - 10, 0);
  }

  // Determine strength
  const clampedScore = Math.min(Math.max(score, 0), 100);
  let strength: PasswordValidationResult["strength"];
  if (clampedScore < 30) strength = "weak";
  else if (clampedScore < 55) strength = "fair";
  else if (clampedScore < 80) strength = "strong";
  else strength = "excellent";

  return {
    valid: errors.length === 0,
    errors,
    strength,
    score: clampedScore,
  };
}

/**
 * Check for sequential characters (ascending or descending)
 */
function hasSequentialChars(str: string, minLength: number): boolean {
  let ascending = 1;
  let descending = 1;
  for (let i = 1; i < str.length; i++) {
    if (str.charCodeAt(i) === str.charCodeAt(i - 1) + 1) {
      ascending++;
      if (ascending >= minLength) return true;
    } else {
      ascending = 1;
    }
    if (str.charCodeAt(i) === str.charCodeAt(i - 1) - 1) {
      descending++;
      if (descending >= minLength) return true;
    } else {
      descending = 1;
    }
  }
  return false;
}

/**
 * Get password requirements as a human-readable list (bilingual)
 */
export function getPasswordRequirements(language: "en" | "fr" = "en"): string[] {
  if (language === "fr") {
    return [
      `Au moins ${POLICY.minLength} caractères`,
      "Au moins une lettre majuscule (A-Z)",
      "Au moins une lettre minuscule (a-z)",
      "Au moins un chiffre (0-9)",
      "Caractères spéciaux recommandés (!@#$%...)",
    ];
  }
  return [
    `At least ${POLICY.minLength} characters`,
    "At least one uppercase letter (A-Z)",
    "At least one lowercase letter (a-z)",
    "At least one digit (0-9)",
    "Special characters recommended (!@#$%...)",
  ];
}
