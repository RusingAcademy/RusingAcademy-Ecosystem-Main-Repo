import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ServerCrash, Home, RotateCcw } from "lucide-react";
import { useLocation } from "wouter";
import { useLanguage } from "../contexts/LanguageContext";

const translations = {
  en: {
    title: '500',
    subtitle: 'Server Error',
    description: "We're experiencing technical difficulties. Our team has been notified and is working to fix the issue.",
    goHome: 'Go Home',
    tryAgain: 'Try Again',
    contact: 'If the problem persists, please contact support.',
  },
  fr: {
    title: '500',
    subtitle: 'Erreur Serveur',
    description: "Nous rencontrons des difficultés techniques. Notre équipe a été informée et travaille à résoudre le problème.",
    goHome: "Aller à l'Accueil",
    tryAgain: 'Réessayer',
    contact: 'Si le problème persiste, veuillez contacter le support.',
  },
};

const ServerError: React.FC = () => {
  const [, setLocation] = useLocation();
  const { language } = useLanguage();
  const t = translations[language as keyof typeof translations] || translations.en;

  const handleGoHome = () => {
    setLocation("/");
  };

  const handleTryAgain = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 relative overflow-hidden">
      {/* Decorative orbs */}
      <div className="absolute top-20 left-20 w-64 h-64 bg-red-500/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl" />
      
      <Card className="w-full max-w-lg mx-4 shadow-lg border border-white/20 bg-white/10 backdrop-blur-lg relative z-10">
        <CardContent className="pt-8 pb-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-orange-500/20 rounded-full animate-pulse" />
              <ServerCrash className="relative h-16 w-16 text-orange-400" />
            </div>
          </div>

          <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-400 mb-2">
            {t.title}
          </h1>

          <h2 className="text-xl font-semibold text-white mb-4">
            {t.subtitle}
          </h2>

          <p className="text-gray-300 mb-6 leading-relaxed">
            {t.description}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
            <Button
              onClick={handleTryAgain}
              className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white px-6 py-2.5 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              {t.tryAgain}
            </Button>
            <Button
              onClick={handleGoHome}
              variant="outline"
              className="bg-white/10 hover:bg-white/20 text-white border-white/30 px-6 py-2.5 rounded-lg transition-all duration-200"
            >
              <Home className="w-4 h-4 mr-2" />
              {t.goHome}
            </Button>
          </div>

          <p className="text-gray-400 text-sm">
            {t.contact}
          </p>
        </CardContent>
      </Card>
      
      {/* Footer */}
      <p className="absolute bottom-4 text-center text-gray-500 text-sm w-full">
        © 2026 Rusinga International Consulting Ltd.
      </p>
    </div>
  );
};

export default ServerError;
