import { useLanguage } from "@/contexts/LanguageContext";

interface TrustedOrg {
  name: string;
  logo: string;
  alt: string;
}

const trustedOrganizations: TrustedOrg[] = [
  {
    name: "Canadian Digital Service",
    logo: "/assets/logos/cds-snc.jpg",
    alt: "CDS SNC Canada",
  },
  {
    name: "Government of Canada",
    logo: "/assets/logos/canada-wordmark.png",
    alt: "Canada Wordmark",
  },
  {
    name: "Innovation, Science and Economic Development",
    logo: "/assets/logos/canada-wordmark.png",
    alt: "ISED Canada",
  },
  {
    name: "Immigration, Refugees and Citizenship Canada",
    logo: "/assets/logos/canada-wordmark.png",
    alt: "IRCC Canada",
  },
  {
    name: "Canada Revenue Agency",
    logo: "/assets/logos/canada-wordmark.png",
    alt: "CRA Canada",
  },
];

export default function TheyTrustedUs() {
  const { language } = useLanguage();

  return (
    <section className="py-20 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden">
      {/* Decorative wave top */}
      <div className="absolute top-0 left-0 right-0 h-16 overflow-hidden">
        <svg 
          viewBox="0 0 1200 120" 
          preserveAspectRatio="none" 
          className="absolute bottom-0 w-full h-full"
          fill="currentColor"
        >
          <path 
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" 
            className="text-white"
          />
        </svg>
      </div>

      <div className="container relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4 font-serif italic">
            {language === 'fr' ? 'Ils nous ont fait confiance' : 'They Trusted Us'}
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            {language === 'fr' 
              ? 'Des fonctionnaires de toutes les institutions canadiennes nous font confiance'
              : 'Civil servants from all Canadian institutions trust us'}
          </p>
        </div>

        {/* Logos Carousel */}
        <div className="relative overflow-hidden py-8">
          <div className="flex items-center justify-center gap-12 flex-wrap">
            {trustedOrganizations.map((org, index) => (
              <div 
                key={index}
                className="flex items-center justify-center p-6 bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 grayscale hover:grayscale-0 min-w-[180px]"
              >
                <img 
                  src={org.logo}
                  alt={org.alt}
                  className="h-16 w-auto object-contain"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <p className="text-center text-sm text-slate-500 mt-8 italic">
          {language === 'fr' 
            ? '*Logos utilisés à des fins illustratives. RusingÂcademy est une initiative entrepreneuriale privée.'
            : '*Logos used for illustrative purposes. RusingÂcademy is a private entrepreneurial initiative.'}
        </p>
      </div>

      {/* Decorative wave bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-16 overflow-hidden rotate-180">
        <svg 
          viewBox="0 0 1200 120" 
          preserveAspectRatio="none" 
          className="absolute bottom-0 w-full h-full"
          fill="currentColor"
        >
          <path 
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" 
            className="text-white"
          />
        </svg>
      </div>
    </section>
  );
}
