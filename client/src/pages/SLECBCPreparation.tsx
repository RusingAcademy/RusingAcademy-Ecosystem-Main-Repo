import { useLanguage } from "@/contexts/LanguageContext";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CheckCircle, Users, Clock, Award, BookOpen, MessageSquare, Target } from "lucide-react";
import { Link } from "wouter";

const content = {
  en: {
    seo: {
      title: "SLE CBC Level Preparation | Advanced French Test for Federal Government",
      description: "Master the CBC level SLE exam with expert coaching. Achieve Level C in Reading and Oral for senior federal positions. Proven success rate. Start your preparation today!",
    },
    h1: "SLE CBC Level Preparation",
    intro: "Aiming for a senior bilingual position that requires CBC proficiency? Our advanced SLE preparation program is specifically designed to help you achieve Level C in Reading and Oral, plus Level B in Writing.",
    whoTitle: "Who This Is For",
    whoItems: [
      "Executives and managers requiring CBC for EX positions",
      "Senior analysts pursuing leadership roles",
      "Professionals targeting positions with high language demands",
      "Current BBB holders seeking to upgrade to CBC",
    ],
    whatTitle: "What You Get",
    whatItems: [
      { icon: Target, text: "Advanced strategies for Level C Reading comprehension" },
      { icon: Users, text: "Intensive oral coaching for complex discussions" },
      { icon: BookOpen, text: "Level B writing techniques and practice" },
      { icon: Clock, text: "Accelerated programs for time-sensitive deadlines" },
      { icon: Award, text: "Mock exams with detailed performance analysis" },
      { icon: MessageSquare, text: "Expert feedback on nuanced language use" },
    ],
    proofTitle: "Success Stories",
    testimonials: [
      {
        quote: "I needed CBC for my EX-01 appointment. The advanced oral coaching was exactly what I needed to handle complex policy discussions in French.",
        author: "Michael T., Director, TBS",
      },
      {
        quote: "After two failed attempts at Level C oral, I finally passed. The coaching helped me understand the subtle differences between B and C level responses.",
        author: "Jennifer R., Senior Policy Advisor, PCO",
      },
      {
        quote: "The reading strategies were game-changing. I went from struggling with complex texts to confidently analyzing them.",
        author: "Robert P., Manager, CRA",
      },
    ],
    faqTitle: "Frequently Asked Questions",
    faqs: [
      {
        q: "What does CBC mean in the SLE?",
        a: "CBC stands for Level C in Reading (Compréhension), Level B in Writing (Écrit), and Level C in Oral (Oral). This is typically required for executive and senior management positions in the federal public service.",
      },
      {
        q: "What's the difference between Level B and Level C?",
        a: "Level C requires understanding complex, abstract, and specialized content. In oral, you must discuss complex topics with nuance and precision. Level B focuses on factual, concrete information with less complexity.",
      },
      {
        q: "How long does it take to go from BBB to CBC?",
        a: "Typically 6-12 months depending on your starting point and practice intensity. The oral component usually requires the most preparation time.",
      },
      {
        q: "What makes Level C oral so challenging?",
        a: "Level C oral requires discussing hypothetical situations, defending opinions with nuanced arguments, and using sophisticated vocabulary. Our coaching focuses specifically on these advanced skills.",
      },
      {
        q: "Do you offer preparation for specific components only?",
        a: "Yes, many clients focus on just the oral or reading component. We customize the program based on your specific needs and current levels.",
      },
      {
        q: "Is CBC required for all executive positions?",
        a: "Most EX positions in bilingual regions require CBC or higher. Some may require CCC. We can help you understand your specific requirements.",
      },
    ],
    ctaPrimary: "Start Your CBC Preparation",
    ctaSecondary: "Book a Free Assessment",
  },
  fr: {
    seo: {
      title: "Préparation ELS niveau CBC | Test de français avancé pour le gouvernement fédéral",
      description: "Maîtrisez l'examen ELS niveau CBC avec un coaching expert. Atteignez le niveau C en Lecture et Oral pour les postes fédéraux supérieurs. Taux de réussite prouvé. Commencez votre préparation!",
    },
    h1: "Préparation ELS niveau CBC",
    intro: "Vous visez un poste bilingue supérieur nécessitant le niveau CBC? Notre programme de préparation ELS avancé est spécialement conçu pour vous aider à atteindre le niveau C en Lecture et Oral, plus le niveau B en Écriture.",
    whoTitle: "À qui s'adresse ce programme",
    whoItems: [
      "Cadres et gestionnaires nécessitant le CBC pour les postes EX",
      "Analystes seniors poursuivant des rôles de leadership",
      "Professionnels ciblant des postes à exigences linguistiques élevées",
      "Détenteurs actuels du BBB cherchant à passer au CBC",
    ],
    whatTitle: "Ce que vous obtenez",
    whatItems: [
      { icon: Target, text: "Stratégies avancées pour la compréhension de lecture niveau C" },
      { icon: Users, text: "Coaching oral intensif pour les discussions complexes" },
      { icon: BookOpen, text: "Techniques d'écriture niveau B et pratique" },
      { icon: Clock, text: "Programmes accélérés pour les délais serrés" },
      { icon: Award, text: "Examens simulés avec analyse détaillée des performances" },
      { icon: MessageSquare, text: "Rétroaction experte sur l'utilisation nuancée de la langue" },
    ],
    proofTitle: "Témoignages de réussite",
    testimonials: [
      {
        quote: "J'avais besoin du CBC pour ma nomination EX-01. Le coaching oral avancé était exactement ce dont j'avais besoin pour gérer des discussions politiques complexes en français.",
        author: "Michael T., Directeur, SCT",
      },
      {
        quote: "Après deux échecs au niveau C oral, j'ai finalement réussi. Le coaching m'a aidé à comprendre les différences subtiles entre les réponses de niveau B et C.",
        author: "Jennifer R., Conseillère principale en politiques, BCP",
      },
      {
        quote: "Les stratégies de lecture ont été révolutionnaires. Je suis passé de la difficulté avec les textes complexes à leur analyse en toute confiance.",
        author: "Robert P., Gestionnaire, ARC",
      },
    ],
    faqTitle: "Questions fréquemment posées",
    faqs: [
      {
        q: "Que signifie CBC dans l'ELS?",
        a: "CBC signifie niveau C en Lecture (Compréhension), niveau B en Écriture (Écrit) et niveau C à l'Oral. Ceci est généralement requis pour les postes de direction et de gestion supérieure dans la fonction publique fédérale.",
      },
      {
        q: "Quelle est la différence entre le niveau B et le niveau C?",
        a: "Le niveau C exige la compréhension de contenu complexe, abstrait et spécialisé. À l'oral, vous devez discuter de sujets complexes avec nuance et précision. Le niveau B se concentre sur l'information factuelle et concrète avec moins de complexité.",
      },
      {
        q: "Combien de temps faut-il pour passer de BBB à CBC?",
        a: "Généralement 6 à 12 mois selon votre point de départ et l'intensité de la pratique. La composante orale nécessite habituellement le plus de temps de préparation.",
      },
      {
        q: "Qu'est-ce qui rend le niveau C oral si difficile?",
        a: "Le niveau C oral exige de discuter de situations hypothétiques, de défendre des opinions avec des arguments nuancés et d'utiliser un vocabulaire sophistiqué. Notre coaching se concentre spécifiquement sur ces compétences avancées.",
      },
      {
        q: "Offrez-vous une préparation pour des composantes spécifiques seulement?",
        a: "Oui, de nombreux clients se concentrent uniquement sur la composante orale ou lecture. Nous personnalisons le programme selon vos besoins spécifiques et vos niveaux actuels.",
      },
      {
        q: "Le CBC est-il requis pour tous les postes de direction?",
        a: "La plupart des postes EX dans les régions bilingues exigent le CBC ou plus. Certains peuvent exiger le CCC. Nous pouvons vous aider à comprendre vos exigences spécifiques.",
      },
    ],
    ctaPrimary: "Commencer votre préparation CBC",
    ctaSecondary: "Réserver une évaluation gratuite",
  },
};

export default function SLECBCPreparation() {
  const { language } = useLanguage();
  const t = content[language as keyof typeof content] || content.en;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <SEO
        title={t.seo.title}
        description={t.seo.description}
        canonical={`https://www.rusingacademy.ca/${language}/sle-cbc-preparation`}
      />

      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-to-br from-indigo-600 via-purple-700 to-purple-800 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block px-4 py-2 bg-white/20 rounded-full text-sm font-medium mb-6">
            {language === "fr" ? "Formation avancée" : "Advanced Training"}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">{t.h1}</h1>
          <p className="text-xl md:text-2xl text-purple-100 max-w-3xl mx-auto">
            {t.intro}
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={`/${language}/coaches`}>
              <Button size="lg" className="bg-white text-purple-700 hover:bg-purple-50 font-semibold px-8">
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
              <div key={index} className="flex items-start gap-3 p-4 bg-purple-50 rounded-lg">
                <CheckCircle className="w-6 h-6 text-purple-600 flex-shrink-0 mt-0.5" />
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
                  <item.icon className="w-12 h-12 text-purple-600 mb-4" />
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
      <section className="py-20 px-4 bg-gradient-to-r from-indigo-600 to-purple-700 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">
            {language === "fr" ? "Prêt à atteindre le niveau CBC?" : "Ready to Achieve CBC Level?"}
          </h2>
          <p className="text-xl text-purple-100 mb-8">
            {language === "fr"
              ? "Faites le pas vers les postes de direction avec notre préparation ELS avancée."
              : "Take the step toward executive positions with our advanced SLE preparation."}
          </p>
          <Link href={`/${language}/coaches`}>
            <Button size="lg" className="bg-white text-purple-700 hover:bg-purple-50 font-semibold px-10 py-6 text-lg">
              {t.ctaPrimary}
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
