import { useLanguage } from "@/contexts/LanguageContext";

interface TrustedOrg {
  nameEn: string;
  nameFr: string;
  logo: string;
  altEn: string;
  altFr: string;
}

const trustedOrganizations: TrustedOrg[] = [
  {
    nameEn: "Canadian Digital Service",
    nameFr: "Service numérique canadien",
    logo: "/images/logos/01_SVG/GC_CDS_SNC_EN_logo_20260112.svg",
    altEn: "Official logo of the Canadian Digital Service (CDS)",
    altFr: "Logo officiel du Service numérique canadien (SNC)",
  },
  {
    nameEn: "Department of National Defence",
    nameFr: "Ministère de la Défense nationale",
    logo: "/images/logos/02_PNG/GC_DND_MDN_FR-EN_logo_20260112.png",
    altEn: "Official logo of the Department of National Defence (DND)",
    altFr: "Logo officiel du Ministère de la Défense nationale (MDN)",
  },
  {
    nameEn: "Correctional Service of Canada",
    nameFr: "Service correctionnel du Canada",
    logo: "/images/logos/02_PNG/GC_CSC_SCC_EN_logo_20260112.png",
    altEn: "Official logo of the Correctional Service of Canada (CSC)",
    altFr: "Logo officiel du Service correctionnel du Canada (SCC)",
  },
  {
    nameEn: "Innovation, Science and Economic Development Canada",
    nameFr: "Innovation, Sciences et Développement économique Canada",
    logo: "/images/logos/02_PNG/GC_ISED_ISDE_EN_logo_20260112.jpg",
    altEn: "Official logo of Innovation, Science and Economic Development Canada (ISED)",
    altFr: "Logo officiel d'Innovation, Sciences et Développement économique Canada (ISDE)",
  },
  {
    nameEn: "Employment and Social Development Canada",
    nameFr: "Emploi et Développement social Canada",
    logo: "/images/logos/02_PNG/GC_ESDC_EDSC_EN_logo_20260112.png",
    altEn: "Official logo of Employment and Social Development Canada (ESDC)",
    altFr: "Logo officiel d'Emploi et Développement social Canada (EDSC)",
  },
  {
    nameEn: "Treasury Board of Canada Secretariat",
    nameFr: "Secrétariat du Conseil du Trésor du Canada",
    logo: "/images/logos/02_PNG/GC_TBS_SCT_EN_logo_20260112.png",
    altEn: "Official logo of the Treasury Board of Canada Secretariat (TBS)",
    altFr: "Logo officiel du Secrétariat du Conseil du Trésor du Canada (SCT)",
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

        {/* Logos Grid - 6 institutions */}
        <div className="relative overflow-hidden py-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 items-center justify-items-center">
            {trustedOrganizations.map((org, index) => (
              <div 
                key={index}
                className="flex flex-col items-center justify-center p-6 bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-105 w-full max-w-[200px] h-[140px] group"
                title={language === 'fr' ? org.nameFr : org.nameEn}
              >
                <img 
                  src={org.logo}
                  alt={language === 'fr' ? org.altFr : org.altEn}
                  className="h-12 w-auto object-contain grayscale group-hover:grayscale-0 transition-all duration-300"
                  loading="lazy"
                />
                <span className="text-xs text-slate-500 mt-2 text-center line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {language === 'fr' ? org.nameFr : org.nameEn}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <p className="text-center text-sm text-slate-500 mt-8 italic">
          {language === 'fr' 
            ? '*Logos officiels des institutions fédérales canadiennes. RusingÂcademy est une initiative entrepreneuriale privée.'
            : '*Official logos of Canadian federal institutions. RusingÂcademy is a private entrepreneurial initiative.'}
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
