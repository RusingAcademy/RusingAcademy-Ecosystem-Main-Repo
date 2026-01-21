import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";

export default function Header() {
  const { language, setLanguage } = useLanguage();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="font-bold text-xl text-slate-900">RusingÂcademy</div>
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setLanguage(language === 'en' ? 'fr' : 'en')}
          >
            {language === 'en' ? 'FR' : 'EN'}
          </Button>
          <Button>Connexion</Button>
        </div>
      </div>
    </header>
  );
}
