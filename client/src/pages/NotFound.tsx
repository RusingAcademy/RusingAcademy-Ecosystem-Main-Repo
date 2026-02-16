import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, Home, ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";

const translations = {
  en: {
    title: "Page Not Found",
    description: "Sorry, the page you are looking for doesn't exist.",
    descriptionSub: "It may have been moved or deleted.",
    goHome: "Go Home",
    goBack: "Go Back",
  },
  fr: {
    title: "Page introuvable",
    description: "D\u00e9sol\u00e9, la page que vous recherchez n'existe pas.",
    descriptionSub: "Elle a peut-\u00eatre \u00e9t\u00e9 d\u00e9plac\u00e9e ou supprim\u00e9e.",
    goHome: "Accueil",
    goBack: "Retour",
  },
};

export default function NotFound() {
  const [, setLocation] = useLocation();
  const { language } = useLanguage();
  const l = translations[language];

  const handleGoHome = () => {
    setLocation("/");
  };

  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-obsidian dark:to-teal-900">
      <Card className="w-full max-w-lg mx-4 shadow-lg border-0 bg-white/80 dark:bg-obsidian/80 backdrop-blur-sm">
        <CardContent className="pt-8 pb-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-red-100 dark:bg-red-900/30 rounded-full animate-pulse" />
              <AlertCircle className="relative h-16 w-16 text-red-500" />
            </div>
          </div>

          <h1 className="text-4xl font-bold mb-2">404</h1>

          <h2 className="text-xl font-semibold mb-4">
            {l.title}
          </h2>

          <p className="text-muted-foreground mb-8 leading-relaxed">
            {l.description}
            <br />
            {l.descriptionSub}
          </p>

          <div
            id="not-found-button-group"
            className="flex flex-col sm:flex-row gap-3 justify-center"
          >
            <Button
              onClick={handleGoBack}
              variant="outline"
              className="px-6 py-2.5 rounded-lg"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {l.goBack}
            </Button>
            <Button
              onClick={handleGoHome}
              className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2.5 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <Home className="w-4 h-4 mr-2" />
              {l.goHome}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
