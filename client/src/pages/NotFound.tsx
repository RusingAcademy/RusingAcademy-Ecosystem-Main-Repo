import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, Home, ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";
import { useLanguage } from "../contexts/LanguageContext";

const translations = {
  en: {
    title: '404',
    subtitle: 'Page Not Found',
    description: "Sorry, the page you are looking for doesn't exist. It may have been moved or deleted.",
    goHome: 'Go Home',
    goBack: 'Go Back',
    popularPages: 'Popular Pages',
    pricing: 'Pricing',
    courses: 'Courses',
    aiCoach: 'AI Coach',
    about: 'About Us',
  },
  fr: {
    title: '404',
    subtitle: 'Page Non Trouvée',
    description: "Désolé, la page que vous recherchez n'existe pas. Elle a peut-être été déplacée ou supprimée.",
    goHome: "Aller à l'Accueil",
    goBack: 'Retour',
    popularPages: 'Pages Populaires',
    pricing: 'Tarifs',
    courses: 'Cours',
    aiCoach: 'Coach IA',
    about: 'À Propos',
  },
};

export default function NotFound() {
  const [, setLocation] = useLocation();
  const { language } = useLanguage();
  const t = translations[language as keyof typeof translations] || translations.en;
  const langPrefix = language === 'fr' ? '/fr' : '/en';

  const handleGoHome = () => {
    setLocation("/");
  };

  const handleGoBack = () => {
    window.history.back();
  };

  const popularLinks = [
    { label: t.pricing, path: `${langPrefix}/pricing` },
    { label: t.courses, path: `${langPrefix}/courses` },
    { label: t.aiCoach, path: `${langPrefix}/ai-coach` },
    { label: t.about, path: `${langPrefix}/about` },
  ];

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 relative overflow-hidden">
      {/* Decorative orbs */}
      <div className="absolute top-20 left-20 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
      
      <Card className="w-full max-w-lg mx-4 shadow-lg border border-white/20 bg-white/10 backdrop-blur-lg relative z-10">
        <CardContent className="pt-8 pb-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-red-500/20 rounded-full animate-pulse" />
              <AlertCircle className="relative h-16 w-16 text-red-400" />
            </div>
          </div>

          <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-2">
            {t.title}
          </h1>

          <h2 className="text-xl font-semibold text-white mb-4">
            {t.subtitle}
          </h2>

          <p className="text-gray-300 mb-8 leading-relaxed">
            {t.description}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
            <Button
              onClick={handleGoHome}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2.5 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <Home className="w-4 h-4 mr-2" />
              {t.goHome}
            </Button>
            <Button
              onClick={handleGoBack}
              variant="outline"
              className="bg-white/10 hover:bg-white/20 text-white border-white/30 px-6 py-2.5 rounded-lg transition-all duration-200"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t.goBack}
            </Button>
          </div>

          {/* Popular Pages */}
          <div className="border-t border-white/20 pt-6">
            <p className="text-gray-400 text-sm mb-4">{t.popularPages}</p>
            <div className="flex flex-wrap justify-center gap-2">
              {popularLinks.map((link) => (
                <button
                  key={link.path}
                  onClick={() => setLocation(link.path)}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-full text-sm transition-colors"
                >
                  {link.label}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Footer */}
      <p className="absolute bottom-4 text-center text-gray-500 text-sm w-full">
        © 2026 Rusinga International Consulting Ltd.
      </p>
    </div>
  );
}
