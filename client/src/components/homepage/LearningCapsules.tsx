import { useLanguage } from "@/contexts/LanguageContext";
import { Play, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Capsule {
  number: number;
  titleFr: string;
  titleEn: string;
  subtitleFr: string;
  subtitleEn: string;
  color: string;
  image: string;
}

const capsules: Capsule[] = [
  {
    number: 1,
    titleFr: "LE BEHAVIORISME",
    titleEn: "BEHAVIORISM",
    subtitleFr: "Le jour où la répétition a libéré le français de Sarah",
    subtitleEn: "The day repetition freed Sarah's French",
    color: "from-teal-600 to-teal-700",
    image: "/images/capsules/behaviorism.jpg",
  },
  {
    number: 2,
    titleFr: "LE COGNITIVISME",
    titleEn: "COGNITIVISM",
    subtitleFr: "Le jour où Mark a arrêté de perdre ses mots",
    subtitleEn: "The day Mark stopped losing his words",
    color: "from-blue-600 to-blue-700",
    image: "/images/capsules/cognitivism.jpg",
  },
  {
    number: 3,
    titleFr: "LE CONSTRUCTIVISME",
    titleEn: "CONSTRUCTIVISM",
    subtitleFr: "Le jour où Julie a découvert la règle par elle-même",
    subtitleEn: "The day Julie discovered the rule herself",
    color: "from-emerald-600 to-emerald-700",
    image: "/images/capsules/constructivism.jpg",
  },
  {
    number: 4,
    titleFr: "LE SOCIO-CONSTRUCTIVISME",
    titleEn: "SOCIO-CONSTRUCTIVISM",
    subtitleFr: "Le jour où le groupe a libéré la voix de Karim",
    subtitleEn: "The day the group freed Karim's voice",
    color: "from-amber-500 to-amber-600",
    image: "/images/capsules/socio-constructivism.jpg",
  },
  {
    number: 5,
    titleFr: "L'HUMANISME",
    titleEn: "HUMANISM",
    subtitleFr: "Le jour où Amélie a arrêté d'avoir peur d'être jugée",
    subtitleEn: "The day Amélie stopped fearing judgment",
    color: "from-slate-600 to-slate-700",
    image: "/images/capsules/humanism.jpg",
  },
  {
    number: 6,
    titleFr: "LE CONNECTIVISME",
    titleEn: "CONNECTIVISM",
    subtitleFr: "Le jour où Marie a découvert qu'elle n'était plus seule à apprendre",
    subtitleEn: "The day Marie discovered she wasn't learning alone",
    color: "from-teal-500 to-teal-600",
    image: "/images/capsules/connectivism.jpg",
  },
  {
    number: 7,
    titleFr: "L'APPRENTISSAGE EXPÉRIENTIEL",
    titleEn: "EXPERIENTIAL LEARNING",
    subtitleFr: "Le jour où Sam a appris le français en commandant un café",
    subtitleEn: "The day Sam learned French ordering coffee",
    color: "from-orange-500 to-orange-600",
    image: "/images/capsules/experiential.jpg",
  },
];

export default function LearningCapsules() {
  const { language } = useLanguage();

  return (
    <section className="py-24 bg-slate-100 relative overflow-hidden">
      <div className="container relative z-10">
        {/* Section Header */}
        <div className="text-center mb-6">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
            {language === 'fr' ? 'Trucs et astuces d\'apprentissage :' : 'Learning Tips & Tricks:'}
          </h2>
          <h3 className="text-xl md:text-2xl font-semibold text-slate-700 mb-4">
            {language === 'fr' 
              ? '40 micro-leçons fondées sur des données probantes pour les apprenants adultes'
              : '40 Evidence-Based Micro-Lessons for Adult Learners'}
          </h3>
          <p className="text-slate-600 max-w-4xl mx-auto leading-relaxed">
            {language === 'fr' 
              ? 'Des leçons vidéo courtes et ciblées, fondées sur les sciences de l\'apprentissage et les principes de l\'éducation des adultes, conçues spécifiquement pour les professionnels occupés. Chaque micro-leçon cible des compétences linguistiques à fort impact, les défis courants des examens et les pièges fréquents de la communication professionnelle.'
              : 'Short, focused video lessons grounded in learning science and adult education principles, designed specifically for busy professionals. Each micro-lesson targets high-impact language skills, common exam challenges, and frequent professional communication pitfalls.'}
          </p>
        </div>

        {/* Capsules Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-12">
          {capsules.map((capsule, index) => (
            <div 
              key={index}
              className="group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer"
            >
              {/* Background with gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${capsule.color}`} />
              
              {/* Content */}
              <div className="relative p-6 h-full min-h-[200px] flex flex-col justify-between">
                {/* Capsule Badge */}
                <div className="inline-flex self-start">
                  <span className="px-3 py-1 bg-orange-500 text-white text-xs font-bold rounded-full">
                    Capsule {capsule.number}
                  </span>
                </div>

                {/* Title and Subtitle */}
                <div className="mt-auto">
                  <h4 className="text-xl font-black text-white mb-1 tracking-wide">
                    {language === 'fr' ? capsule.titleFr : capsule.titleEn}
                  </h4>
                  <p className="text-xs text-white/80 uppercase tracking-wider mb-3">
                    {language === 'fr' ? capsule.titleEn : capsule.titleFr}
                  </p>
                  <p className="text-sm text-white/90 leading-relaxed">
                    {language === 'fr' ? capsule.subtitleFr : capsule.subtitleEn}
                  </p>
                </div>

                {/* Play Button */}
                <button className="absolute bottom-4 right-4 h-12 w-12 rounded-full bg-orange-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Play className="h-5 w-5 text-white ml-0.5" fill="white" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <div className="text-center mt-12">
          <a 
            href="https://www.rusingacademy.com/products/communities/v2/slecommunity/home"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button 
              size="lg" 
              className="bg-orange-500 hover:bg-orange-600 text-white rounded-full px-8 h-14 text-base font-semibold shadow-lg shadow-orange-500/30 gap-2"
            >
              {language === 'fr' 
                ? 'Accéder aux capsules d\'apprentissage fondées sur des données probantes'
                : 'Access Evidence-Based Learning Capsules'}
              <ExternalLink className="h-5 w-5" />
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
}
