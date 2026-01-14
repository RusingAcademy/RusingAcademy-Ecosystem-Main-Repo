/**
 * SSO Callback Page
 * 
 * Handles the OAuth redirect callback from Clerk social logins.
 * This page processes the authentication response and redirects
 * the user to their intended destination.
 */
import { useEffect } from "react";
import { AuthenticateWithRedirectCallback } from "@clerk/clerk-react";
import { Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function SSOCallback() {
  const { language } = useLanguage();
  const isEn = language === "en";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="text-center">
        <Loader2 className="h-12 w-12 animate-spin text-teal-500 mx-auto mb-4" />
        <p className="text-white text-lg">
          {isEn ? "Completing sign in..." : "Finalisation de la connexion..."}
        </p>
        <p className="text-slate-400 text-sm mt-2">
          {isEn ? "Please wait while we verify your account." : "Veuillez patienter pendant la vérification de votre compte."}
        </p>
      </div>
      
      {/* Clerk's built-in callback handler */}
      <AuthenticateWithRedirectCallback />
    </div>
  );
}
