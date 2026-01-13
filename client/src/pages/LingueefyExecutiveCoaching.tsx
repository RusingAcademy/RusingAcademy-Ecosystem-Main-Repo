import { useLanguage } from "@/contexts/LanguageContext";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CheckCircle, Crown, Shield, Clock, Award, Users, Briefcase, Target } from "lucide-react";
import { Link } from "wouter";

const content = {
  en: {
    seo: {
      title: "Executive SLE Coaching | Private Language Training for Federal Executives | Lingueefy",
      description: "Premium private SLE coaching for federal executives (EX-01 to EX-05). Confidential, flexible, and results-driven language training. Achieve CBC/CCC with discretion.",
    },
    h1: "Executive SLE Coaching",
    subtitle: "Private Language Training for Federal Leaders",
    intro: "As a federal executive, your time is valuable and your reputation matters. Our premium executive coaching program provides confidential, personalized SLE preparation designed specifically for senior leaders who need results without compromising their schedule or privacy.",
    whoTitle: "Designed for Senior Leaders",
    whoItems: [
      "EX-01 to EX-05 executives requiring CBC or CCC proficiency",
      "Deputy Ministers and Assistant Deputy Ministers",
      "Directors General and Directors seeking advancement",
      "Senior executives with demanding schedules and high visibility",
    ],
    whatTitle: "The Executive Advantage",
    whatItems: [
      { icon: Crown, text: "Dedicated senior coach with executive-level experience" },
      { icon: Shield, text: "Complete confidentiality and discretion guaranteed" },
      { icon: Clock, text: "Flexible scheduling: early mornings, evenings, weekends" },
      { icon: Target, text: "Accelerated programs for time-sensitive appointments" },
      { icon: Briefcase, text: "Practice with executive-level scenarios and vocabulary" },
      { icon: Award, text: "Track record of success with senior public servants" },
    ],
    proofTitle: "Trusted by Federal Executives",
    testimonials: [
      {
        quote: "The discretion and flexibility were exactly what I needed. I achieved my CBC while managing a major departmental initiative. No one knew I was preparing.",
        author: "Director General, Central Agency",
      },
      {
        quote: "My coach understood the unique pressures of executive life. The sessions were tailored to my schedule and focused on the specific language I use daily.",
        author: "Assistant Deputy Minister, Economic Department",
      },
      {
        quote: "After years of avoiding the test, I finally achieved CCC. The executive program made it possible to prepare without disrupting my responsibilities.",
        author: "Executive Director, Regulatory Agency",
      },
    ],
    faqTitle: "Frequently Asked Questions",
    faqs: [
      {
        q: "How is executive coaching different from regular SLE preparation?",
        a: "Executive coaching is designed for senior leaders with unique constraints: demanding schedules, high visibility, and the need for absolute discretion. We offer flexible scheduling, confidential sessions, and practice with executive-level scenarios including briefings, Cabinet discussions, and stakeholder negotiations.",
      },
      {
        q: "Is my participation kept confidential?",
        a: "Absolutely. We understand that executives may prefer to keep their language training private. All sessions are conducted with complete discretion, and we never disclose client identities without explicit permission.",
      },
      {
        q: "Can sessions be scheduled around my executive calendar?",
        a: "Yes. We offer early morning sessions (6-8 AM), evening sessions, and weekend availability. Sessions can also be rescheduled with short notice to accommodate unexpected demands.",
      },
      {
        q: "What level do most executives need?",
        a: "Most EX positions in bilingual regions require CBC (C in Reading, B in Writing, C in Oral) or higher. Some ADM and DM positions require CCC. We assess your current level and create a targeted plan to achieve your required proficiency.",
      },
      {
        q: "How quickly can I achieve my target level?",
        a: "This depends on your starting point and availability. With intensive preparation, many executives achieve their target level in 3-6 months. We offer accelerated programs for time-sensitive appointments.",
      },
      {
        q: "Do you work with executives across Canada?",
        a: "Yes. All coaching is available virtually, allowing us to work with executives in Ottawa, regional offices, and anywhere in Canada. Sessions are conducted via secure video conferencing.",
      },
    ],
    ctaPrimary: "Request a Confidential Consultation",
    ctaSecondary: "Learn About Our Approach",
  },
  fr: {
    seo: {
      title: "Coaching ELS pour cadres | Formation linguistique privée pour dirigeants fédéraux | Lingueefy",
      description: "Coaching ELS premium et privé pour cadres fédéraux (EX-01 à EX-05). Formation linguistique confidentielle, flexible et axée sur les résultats. Atteignez CBC/CCC en toute discrétion.",
    },
    h1: "Coaching ELS pour cadres",
    subtitle: "Formation linguistique privée pour dirigeants fédéraux",
    intro: "En tant que cadre fédéral, votre temps est précieux et votre réputation compte. Notre programme de coaching exécutif premium offre une préparation ELS confidentielle et personnalisée, conçue spécifiquement pour les dirigeants qui ont besoin de résultats sans compromettre leur emploi du temps ou leur vie privée.",
    whoTitle: "Conçu pour les hauts dirigeants",
    whoItems: [
      "Cadres EX-01 à EX-05 nécessitant le niveau CBC ou CCC",
      "Sous-ministres et sous-ministres adjoints",
      "Directeurs généraux et directeurs visant l'avancement",
      "Cadres supérieurs avec des horaires exigeants et une grande visibilité",
    ],
    whatTitle: "L'avantage exécutif",
    whatItems: [
      { icon: Crown, text: "Coach senior dédié avec expérience au niveau exécutif" },
      { icon: Shield, text: "Confidentialité et discrétion complètes garanties" },
      { icon: Clock, text: "Horaires flexibles : tôt le matin, en soirée, les fins de semaine" },
      { icon: Target, text: "Programmes accélérés pour nominations urgentes" },
      { icon: Briefcase, text: "Pratique avec scénarios et vocabulaire de niveau exécutif" },
      { icon: Award, text: "Bilan de réussite avec des hauts fonctionnaires" },
    ],
    proofTitle: "La confiance des cadres fédéraux",
    testimonials: [
      {
        quote: "La discrétion et la flexibilité étaient exactement ce dont j'avais besoin. J'ai obtenu mon CBC tout en gérant une initiative ministérielle majeure. Personne ne savait que je me préparais.",
        author: "Directeur général, Agence centrale",
      },
      {
        quote: "Mon coach comprenait les pressions uniques de la vie de cadre. Les séances étaient adaptées à mon horaire et axées sur le langage spécifique que j'utilise quotidiennement.",
        author: "Sous-ministre adjoint, Ministère économique",
      },
      {
        quote: "Après des années à éviter le test, j'ai finalement obtenu le CCC. Le programme exécutif a rendu possible la préparation sans perturber mes responsabilités.",
        author: "Directeur exécutif, Agence de réglementation",
      },
    ],
    faqTitle: "Questions fréquemment posées",
    faqs: [
      {
        q: "En quoi le coaching exécutif diffère-t-il de la préparation ELS régulière?",
        a: "Le coaching exécutif est conçu pour les hauts dirigeants avec des contraintes uniques : horaires exigeants, grande visibilité et besoin de discrétion absolue. Nous offrons des horaires flexibles, des séances confidentielles et de la pratique avec des scénarios de niveau exécutif incluant les breffages, les discussions du Cabinet et les négociations avec les parties prenantes.",
      },
      {
        q: "Ma participation est-elle gardée confidentielle?",
        a: "Absolument. Nous comprenons que les cadres peuvent préférer garder leur formation linguistique privée. Toutes les séances sont menées avec une discrétion complète, et nous ne divulguons jamais l'identité des clients sans permission explicite.",
      },
      {
        q: "Les séances peuvent-elles être planifiées autour de mon calendrier de cadre?",
        a: "Oui. Nous offrons des séances tôt le matin (6h-8h), en soirée et les fins de semaine. Les séances peuvent également être reprogrammées avec un court préavis pour accommoder les demandes imprévues.",
      },
      {
        q: "Quel niveau la plupart des cadres doivent-ils atteindre?",
        a: "La plupart des postes EX dans les régions bilingues exigent le CBC (C en Lecture, B en Écriture, C à l'Oral) ou plus. Certains postes de SMA et SM exigent le CCC. Nous évaluons votre niveau actuel et créons un plan ciblé pour atteindre votre niveau requis.",
      },
      {
        q: "En combien de temps puis-je atteindre mon niveau cible?",
        a: "Cela dépend de votre point de départ et de votre disponibilité. Avec une préparation intensive, de nombreux cadres atteignent leur niveau cible en 3-6 mois. Nous offrons des programmes accélérés pour les nominations urgentes.",
      },
      {
        q: "Travaillez-vous avec des cadres partout au Canada?",
        a: "Oui. Tout le coaching est disponible virtuellement, nous permettant de travailler avec des cadres à Ottawa, dans les bureaux régionaux et partout au Canada. Les séances sont menées par vidéoconférence sécurisée.",
      },
    ],
    ctaPrimary: "Demander une consultation confidentielle",
    ctaSecondary: "Découvrir notre approche",
  },
};

export default function LingueefyExecutiveCoaching() {
  const { language } = useLanguage();
  const t = content[language as keyof typeof content] || content.en;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      <SEO
        title={t.seo.title}
        description={t.seo.description}
        canonical={`https://www.rusingacademy.ca/${language}/lingueefy/executive-coaching`}
      />

      {/* Hero Section - Premium Dark Theme */}
      <section className="relative py-24 px-4 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAzMHYySDI0di0yaDEyek0zNiAyNnYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-50"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/20 border border-amber-500/30 rounded-full text-amber-400 text-sm font-medium mb-6">
            <Crown className="w-4 h-4" />
            {language === "fr" ? "Service Premium" : "Premium Service"}
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-white via-amber-100 to-amber-200 bg-clip-text text-transparent">
            {t.h1}
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 mb-6">{t.subtitle}</p>
          <p className="text-lg text-slate-400 max-w-3xl mx-auto mb-10">
            {t.intro}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={`/${language}/contact`}>
              <Button size="lg" className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-900 font-semibold px-8 py-6 text-lg">
                {t.ctaPrimary}
              </Button>
            </Link>
            <Link href={`/${language}/lingueefy`}>
              <Button size="lg" variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800 px-8 py-6 text-lg">
                {t.ctaSecondary}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Who This Is For */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-slate-800">{t.whoTitle}</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {t.whoItems.map((item, index) => (
              <div key={index} className="flex items-start gap-3 p-5 bg-slate-50 rounded-xl border border-slate-100">
                <CheckCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
                <span className="text-slate-700 font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What You Get */}
      <section className="py-20 px-4 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-slate-800">{t.whatTitle}</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {t.whatItems.map((item, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white">
                <CardContent className="p-8 flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center mb-5">
                    <item.icon className="w-8 h-8 text-amber-700" />
                  </div>
                  <p className="text-slate-700 font-medium">{item.text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">{t.proofTitle}</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {t.testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 bg-slate-800/50 backdrop-blur">
                <CardContent className="p-6">
                  <p className="text-slate-300 italic mb-4">"{testimonial.quote}"</p>
                  <p className="text-sm font-semibold text-amber-400">— {testimonial.author}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-slate-800">{t.faqTitle}</h2>
          <Accordion type="single" collapsible className="space-y-4">
            {t.faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="bg-slate-50 rounded-xl border-0 shadow-sm">
                <AccordionTrigger className="px-6 py-5 text-left font-semibold text-slate-800 hover:no-underline">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-5 text-slate-600">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-4 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <Crown className="w-12 h-12 text-amber-500 mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-6">
            {language === "fr" ? "Prêt à atteindre vos objectifs linguistiques?" : "Ready to Achieve Your Language Goals?"}
          </h2>
          <p className="text-xl text-slate-400 mb-10">
            {language === "fr"
              ? "Contactez-nous pour une consultation confidentielle et découvrez comment nous pouvons vous aider."
              : "Contact us for a confidential consultation and discover how we can help you succeed."}
          </p>
          <Link href={`/${language}/contact`}>
            <Button size="lg" className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-900 font-semibold px-12 py-6 text-lg">
              {t.ctaPrimary}
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
