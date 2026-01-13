import { useLanguage } from "@/contexts/LanguageContext";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CheckCircle, Users, PenTool, FileText, Clock, Award, MessageSquare, BookOpen } from "lucide-react";
import { Link } from "wouter";

const content = {
  en: {
    seo: {
      title: "SLE Written Test Preparation | Master the French Writing Exam for Federal Government",
      description: "Expert coaching for the SLE written test. Learn grammar, vocabulary, and writing strategies to pass your federal government French writing exam. Achieve Level B or C.",
    },
    h1: "SLE Written Test Coaching",
    intro: "The written component of the SLE tests your ability to produce clear, grammatically correct text in your second language. Our specialized coaching helps you master the writing skills needed to achieve your target level.",
    whoTitle: "Who This Is For",
    whoItems: [
      "Public servants needing to improve their written French/English",
      "Candidates who passed Oral and Reading but struggle with Writing",
      "Professionals aiming for Level B or C in written expression",
      "Anyone preparing for the SLE Test 654 (Written Expression)",
    ],
    whatTitle: "What You Get",
    whatItems: [
      { icon: PenTool, text: "Intensive grammar and syntax training" },
      { icon: FileText, text: "Practice with authentic SLE writing prompts" },
      { icon: BookOpen, text: "Vocabulary building for professional contexts" },
      { icon: Users, text: "One-on-one feedback on your written work" },
      { icon: Clock, text: "Timed practice to improve speed and accuracy" },
      { icon: MessageSquare, text: "Error analysis and correction strategies" },
    ],
    proofTitle: "Success Stories",
    testimonials: [
      {
        quote: "I always made the same grammar mistakes. My coach helped me identify patterns and gave me specific exercises to fix them. I finally passed with a B!",
        author: "Andrew C., Financial Officer, PSPC",
      },
      {
        quote: "The practice prompts were exactly like the real test. I knew what to expect and how to structure my responses.",
        author: "Michelle D., HR Advisor, CBSA",
      },
      {
        quote: "I went from barely passing Level A to achieving Level B in just 4 months. The personalized feedback was invaluable.",
        author: "Kevin L., IT Analyst, SSC",
      },
    ],
    faqTitle: "Frequently Asked Questions",
    faqs: [
      {
        q: "What does the SLE written test involve?",
        a: "The written test (Test 654) evaluates your ability to write in your second language. You'll complete tasks like writing emails, reports, or responses to workplace scenarios. The test is computer-based and takes about 90 minutes.",
      },
      {
        q: "What's the difference between Level B and Level C writing?",
        a: "Level B requires writing clear, coherent text on familiar topics with reasonable grammatical accuracy. Level C requires writing complex, well-structured text with sophisticated vocabulary and near-native grammatical accuracy.",
      },
      {
        q: "What are the most common mistakes that cost points?",
        a: "Common issues include verb conjugation errors, gender agreement mistakes, anglicisms, and poor sentence structure. Our coaching specifically targets these areas with focused practice.",
      },
      {
        q: "How long does it take to improve my writing level?",
        a: "Most candidates see significant improvement in 2-4 months with consistent practice. Moving from A to B typically takes 3-4 months; B to C may take 4-6 months depending on your starting point.",
      },
      {
        q: "Can I get an exemption (E) for writing?",
        a: "Yes, if you score 52-55 on the written test, you receive an exemption from further testing. Our advanced coaching can help you reach this level if you're already close.",
      },
      {
        q: "Do you provide practice tests?",
        a: "Yes, we provide multiple practice tests that mirror the format and difficulty of the actual SLE written test. Each practice test includes detailed feedback on your performance.",
      },
    ],
    ctaPrimary: "Start Written Coaching",
    ctaSecondary: "Get a Writing Assessment",
  },
  fr: {
    seo: {
      title: "Préparation test écrit ELS | Maîtrisez l'examen d'écriture pour le gouvernement fédéral",
      description: "Coaching expert pour le test écrit ELS. Apprenez la grammaire, le vocabulaire et les stratégies d'écriture pour réussir votre examen d'écriture. Atteignez le niveau B ou C.",
    },
    h1: "Coaching test écrit ELS",
    intro: "La composante écrite de l'ELS teste votre capacité à produire un texte clair et grammaticalement correct dans votre langue seconde. Notre coaching spécialisé vous aide à maîtriser les compétences d'écriture nécessaires pour atteindre votre niveau cible.",
    whoTitle: "À qui s'adresse ce programme",
    whoItems: [
      "Fonctionnaires devant améliorer leur français/anglais écrit",
      "Candidats ayant réussi l'Oral et la Lecture mais qui ont des difficultés à l'Écrit",
      "Professionnels visant le niveau B ou C en expression écrite",
      "Toute personne se préparant au Test 654 de l'ELS (Expression écrite)",
    ],
    whatTitle: "Ce que vous obtenez",
    whatItems: [
      { icon: PenTool, text: "Formation intensive en grammaire et syntaxe" },
      { icon: FileText, text: "Pratique avec des sujets d'écriture ELS authentiques" },
      { icon: BookOpen, text: "Enrichissement du vocabulaire pour contextes professionnels" },
      { icon: Users, text: "Rétroaction individuelle sur vos travaux écrits" },
      { icon: Clock, text: "Pratique chronométrée pour améliorer vitesse et précision" },
      { icon: MessageSquare, text: "Analyse des erreurs et stratégies de correction" },
    ],
    proofTitle: "Témoignages de réussite",
    testimonials: [
      {
        quote: "Je faisais toujours les mêmes erreurs de grammaire. Mon coach m'a aidé à identifier les patterns et m'a donné des exercices spécifiques pour les corriger. J'ai finalement réussi avec un B!",
        author: "Andrew C., Agent financier, SPAC",
      },
      {
        quote: "Les sujets de pratique étaient exactement comme le vrai test. Je savais à quoi m'attendre et comment structurer mes réponses.",
        author: "Michelle D., Conseillère RH, ASFC",
      },
      {
        quote: "Je suis passé de justesse au niveau A à l'obtention du niveau B en seulement 4 mois. La rétroaction personnalisée était inestimable.",
        author: "Kevin L., Analyste TI, SPC",
      },
    ],
    faqTitle: "Questions fréquemment posées",
    faqs: [
      {
        q: "En quoi consiste le test écrit ELS?",
        a: "Le test écrit (Test 654) évalue votre capacité à écrire dans votre langue seconde. Vous compléterez des tâches comme rédiger des courriels, des rapports ou des réponses à des scénarios de travail. Le test est informatisé et dure environ 90 minutes.",
      },
      {
        q: "Quelle est la différence entre l'écriture niveau B et niveau C?",
        a: "Le niveau B exige d'écrire un texte clair et cohérent sur des sujets familiers avec une précision grammaticale raisonnable. Le niveau C exige d'écrire un texte complexe et bien structuré avec un vocabulaire sophistiqué et une précision grammaticale quasi native.",
      },
      {
        q: "Quelles sont les erreurs les plus courantes qui font perdre des points?",
        a: "Les problèmes courants incluent les erreurs de conjugaison, les erreurs d'accord de genre, les anglicismes et la mauvaise structure de phrase. Notre coaching cible spécifiquement ces domaines avec une pratique ciblée.",
      },
      {
        q: "Combien de temps faut-il pour améliorer mon niveau d'écriture?",
        a: "La plupart des candidats voient une amélioration significative en 2-4 mois avec une pratique régulière. Passer de A à B prend généralement 3-4 mois; de B à C peut prendre 4-6 mois selon votre point de départ.",
      },
      {
        q: "Puis-je obtenir une exemption (E) pour l'écrit?",
        a: "Oui, si vous obtenez 52-55 au test écrit, vous recevez une exemption des tests ultérieurs. Notre coaching avancé peut vous aider à atteindre ce niveau si vous en êtes déjà proche.",
      },
      {
        q: "Fournissez-vous des tests pratiques?",
        a: "Oui, nous fournissons plusieurs tests pratiques qui reflètent le format et la difficulté du test écrit ELS réel. Chaque test pratique inclut une rétroaction détaillée sur votre performance.",
      },
    ],
    ctaPrimary: "Commencer le coaching écrit",
    ctaSecondary: "Obtenir une évaluation d'écriture",
  },
};

export default function SLEWrittenCoaching() {
  const { language } = useLanguage();
  const t = content[language as keyof typeof content] || content.en;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <SEO
        title={t.seo.title}
        description={t.seo.description}
        canonical={`https://www.rusingacademy.ca/${language}/sle-written-coaching`}
      />

      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-to-br from-amber-600 via-orange-600 to-orange-700 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full text-sm font-medium mb-6">
            <PenTool className="w-4 h-4" />
            {language === "fr" ? "Coaching spécialisé" : "Specialized Coaching"}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">{t.h1}</h1>
          <p className="text-xl md:text-2xl text-orange-100 max-w-3xl mx-auto">
            {t.intro}
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={`/${language}/coaches`}>
              <Button size="lg" className="bg-white text-orange-700 hover:bg-orange-50 font-semibold px-8">
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
              <div key={index} className="flex items-start gap-3 p-4 bg-orange-50 rounded-lg">
                <CheckCircle className="w-6 h-6 text-orange-600 flex-shrink-0 mt-0.5" />
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
                  <item.icon className="w-12 h-12 text-orange-600 mb-4" />
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
      <section className="py-20 px-4 bg-gradient-to-r from-amber-600 to-orange-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">
            {language === "fr" ? "Prêt à améliorer votre écrit?" : "Ready to Improve Your Writing?"}
          </h2>
          <p className="text-xl text-orange-100 mb-8">
            {language === "fr"
              ? "Maîtrisez la grammaire et le vocabulaire avec nos coachs experts."
              : "Master grammar and vocabulary with our expert coaches."}
          </p>
          <Link href={`/${language}/coaches`}>
            <Button size="lg" className="bg-white text-orange-700 hover:bg-orange-50 font-semibold px-10 py-6 text-lg">
              {t.ctaPrimary}
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
