import { useLanguage } from "@/contexts/LanguageContext";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CheckCircle, Users, Clock, Award, BookOpen, MessageSquare } from "lucide-react";
import { Link } from "wouter";

const content = {
  en: {
    seo: {
      title: "SLE BBB Level Preparation | Pass Your Federal Government Language Test",
      description: "Prepare for your SLE BBB level exam with expert coaching. Our proven program helps Canadian public servants achieve their bilingual proficiency goals. Start today!",
    },
    h1: "SLE BBB Level Preparation",
    intro: "Struggling to reach BBB proficiency for your federal government position? Our specialized SLE preparation program is designed to help you pass all three components—Reading, Writing, and Oral—with confidence.",
    whoTitle: "Who This Is For",
    whoItems: [
      "Federal public servants requiring BBB bilingual designation",
      "Candidates preparing for promotional opportunities",
      "New hires needing to meet language requirements within probation",
      "Professionals seeking to maintain their bilingual status",
    ],
    whatTitle: "What You Get",
    whatItems: [
      { icon: BookOpen, text: "Comprehensive study materials aligned with PSC standards" },
      { icon: Users, text: "One-on-one coaching with certified SLE experts" },
      { icon: Clock, text: "Flexible scheduling to fit your work commitments" },
      { icon: Award, text: "Practice tests that mirror the actual SLE format" },
      { icon: MessageSquare, text: "Personalized feedback on your progress" },
    ],
    proofTitle: "Success Stories",
    testimonials: [
      {
        quote: "After struggling with the oral component for years, I finally passed with a B thanks to the coaching I received. The practice sessions were invaluable.",
        author: "Marie L., Policy Analyst, ESDC",
      },
      {
        quote: "The structured approach helped me understand exactly what the examiners are looking for. I achieved BBB on my first attempt.",
        author: "David K., Program Officer, IRCC",
      },
      {
        quote: "I was able to prepare while working full-time. The flexible scheduling made all the difference.",
        author: "Sarah M., Administrative Assistant, DND",
      },
    ],
    faqTitle: "Frequently Asked Questions",
    faqs: [
      {
        q: "What is the BBB level in the SLE?",
        a: "BBB refers to achieving Level B in all three components of the Second Language Evaluation: Reading, Writing, and Oral. Level B indicates intermediate proficiency sufficient for most bilingual positions in the federal public service.",
      },
      {
        q: "How long does it take to prepare for BBB?",
        a: "Preparation time varies based on your current level. Most candidates with basic French/English skills require 3-6 months of consistent practice. Our diagnostic assessment helps determine your personalized timeline.",
      },
      {
        q: "What's the difference between BBB and CBC?",
        a: "BBB means Level B in all three components. CBC means Level C in Reading, Level B in Writing, and Level C in Oral. CBC is required for more senior positions with higher language demands.",
      },
      {
        q: "Do you offer preparation for all three SLE components?",
        a: "Yes, our program covers Reading, Writing, and Oral preparation. You can choose to focus on specific components or prepare for all three simultaneously.",
      },
      {
        q: "Is the training available online?",
        a: "Absolutely. All our coaching sessions are available online via video conferencing, making it convenient for public servants across Canada.",
      },
      {
        q: "How do your practice tests compare to the real SLE?",
        a: "Our practice tests are designed to closely mirror the format, timing, and difficulty of the actual PSC Second Language Evaluation, giving you realistic preparation.",
      },
    ],
    ctaPrimary: "Start Your BBB Preparation",
    ctaSecondary: "Book a Free Consultation",
  },
  fr: {
    seo: {
      title: "Préparation ELS niveau BBB | Réussissez votre examen de langue fédéral",
      description: "Préparez-vous à l'examen ELS niveau BBB avec un coaching expert. Notre programme éprouvé aide les fonctionnaires canadiens à atteindre leurs objectifs de bilinguisme. Commencez aujourd'hui!",
    },
    h1: "Préparation ELS niveau BBB",
    intro: "Vous avez du mal à atteindre le niveau BBB pour votre poste au gouvernement fédéral? Notre programme de préparation ELS spécialisé est conçu pour vous aider à réussir les trois composantes—Lecture, Écriture et Oral—avec confiance.",
    whoTitle: "À qui s'adresse ce programme",
    whoItems: [
      "Fonctionnaires fédéraux nécessitant la désignation bilingue BBB",
      "Candidats se préparant à des opportunités de promotion",
      "Nouvelles recrues devant satisfaire aux exigences linguistiques pendant la probation",
      "Professionnels cherchant à maintenir leur statut bilingue",
    ],
    whatTitle: "Ce que vous obtenez",
    whatItems: [
      { icon: BookOpen, text: "Matériel d'étude complet aligné sur les normes de la CFP" },
      { icon: Users, text: "Coaching individuel avec des experts ELS certifiés" },
      { icon: Clock, text: "Horaires flexibles adaptés à vos engagements professionnels" },
      { icon: Award, text: "Tests pratiques qui reflètent le format réel de l'ELS" },
      { icon: MessageSquare, text: "Rétroaction personnalisée sur vos progrès" },
    ],
    proofTitle: "Témoignages de réussite",
    testimonials: [
      {
        quote: "Après avoir lutté avec la composante orale pendant des années, j'ai finalement réussi avec un B grâce au coaching reçu. Les séances de pratique étaient inestimables.",
        author: "Marie L., Analyste de politiques, EDSC",
      },
      {
        quote: "L'approche structurée m'a aidé à comprendre exactement ce que les examinateurs recherchent. J'ai obtenu BBB dès ma première tentative.",
        author: "David K., Agent de programme, IRCC",
      },
      {
        quote: "J'ai pu me préparer tout en travaillant à temps plein. La flexibilité des horaires a fait toute la différence.",
        author: "Sarah M., Adjointe administrative, MDN",
      },
    ],
    faqTitle: "Questions fréquemment posées",
    faqs: [
      {
        q: "Qu'est-ce que le niveau BBB dans l'ELS?",
        a: "BBB signifie l'obtention du niveau B dans les trois composantes de l'Évaluation de langue seconde : Lecture, Écriture et Oral. Le niveau B indique une compétence intermédiaire suffisante pour la plupart des postes bilingues dans la fonction publique fédérale.",
      },
      {
        q: "Combien de temps faut-il pour se préparer au BBB?",
        a: "Le temps de préparation varie selon votre niveau actuel. La plupart des candidats ayant des compétences de base en français/anglais nécessitent 3 à 6 mois de pratique régulière. Notre évaluation diagnostique aide à déterminer votre calendrier personnalisé.",
      },
      {
        q: "Quelle est la différence entre BBB et CBC?",
        a: "BBB signifie niveau B dans les trois composantes. CBC signifie niveau C en Lecture, niveau B en Écriture et niveau C à l'Oral. Le CBC est requis pour des postes plus élevés avec des exigences linguistiques plus importantes.",
      },
      {
        q: "Offrez-vous une préparation pour les trois composantes de l'ELS?",
        a: "Oui, notre programme couvre la préparation en Lecture, Écriture et Oral. Vous pouvez choisir de vous concentrer sur des composantes spécifiques ou de vous préparer aux trois simultanément.",
      },
      {
        q: "La formation est-elle disponible en ligne?",
        a: "Absolument. Toutes nos séances de coaching sont disponibles en ligne par vidéoconférence, ce qui est pratique pour les fonctionnaires partout au Canada.",
      },
      {
        q: "Comment vos tests pratiques se comparent-ils à l'ELS réel?",
        a: "Nos tests pratiques sont conçus pour refléter fidèlement le format, le timing et la difficulté de l'Évaluation de langue seconde réelle de la CFP, vous offrant une préparation réaliste.",
      },
    ],
    ctaPrimary: "Commencer votre préparation BBB",
    ctaSecondary: "Réserver une consultation gratuite",
  },
};

export default function SLEBBBPreparation() {
  const { language } = useLanguage();
  const t = content[language as keyof typeof content] || content.en;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <SEO
        title={t.seo.title}
        description={t.seo.description}
        canonical={`https://www.rusingacademy.ca/${language}/sle-bbb-preparation`}
      />

      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">{t.h1}</h1>
          <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
            {t.intro}
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={`/${language}/coaches`}>
              <Button size="lg" className="bg-white text-blue-700 hover:bg-blue-50 font-semibold px-8">
                {t.ctaPrimary}
              </Button>
            </Link>
            <Link href={`/${language}/contact`}>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-8">
                {t.ctaSecondary}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Who This Is For */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-10 text-slate-800">{t.whoTitle}</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {t.whoItems.map((item, index) => (
              <div key={index} className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
                <CheckCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
                <span className="text-slate-700">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What You Get */}
      <section className="py-16 px-4 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-10 text-slate-800">{t.whatTitle}</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {t.whatItems.map((item, index) => (
              <Card key={index} className="border-0 shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <item.icon className="w-12 h-12 text-blue-600 mb-4" />
                  <p className="text-slate-700">{item.text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-10 text-slate-800">{t.proofTitle}</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {t.testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-md">
                <CardContent className="p-6">
                  <p className="text-slate-600 italic mb-4">"{testimonial.quote}"</p>
                  <p className="text-sm font-semibold text-slate-800">— {testimonial.author}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4 bg-slate-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-10 text-slate-800">{t.faqTitle}</h2>
          <Accordion type="single" collapsible className="space-y-4">
            {t.faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="bg-white rounded-lg shadow-sm border-0">
                <AccordionTrigger className="px-6 py-4 text-left font-semibold text-slate-800 hover:no-underline">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 text-slate-600">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">
            {language === "fr" ? "Prêt à réussir votre ELS BBB?" : "Ready to Pass Your SLE BBB?"}
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            {language === "fr"
              ? "Rejoignez des centaines de fonctionnaires qui ont atteint leurs objectifs de bilinguisme avec notre aide."
              : "Join hundreds of public servants who have achieved their bilingual goals with our help."}
          </p>
          <Link href={`/${language}/coaches`}>
            <Button size="lg" className="bg-white text-blue-700 hover:bg-blue-50 font-semibold px-10 py-6 text-lg">
              {t.ctaPrimary}
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
