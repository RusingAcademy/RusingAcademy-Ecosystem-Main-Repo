import { useLanguage } from "@/contexts/LanguageContext";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CheckCircle, Users, Mic, Video, Clock, Award, MessageSquare, Headphones } from "lucide-react";
import { Link } from "wouter";

const content = {
  en: {
    seo: {
      title: "SLE Oral Test Coaching | Master the French Oral Exam for Federal Government",
      description: "Expert coaching for the SLE oral test. Practice with certified coaches, master conversation strategies, and pass your federal government French oral exam with confidence.",
    },
    h1: "SLE Oral Test Coaching",
    intro: "The oral component is often the most challenging part of the SLE. Our specialized oral coaching program helps you build confidence, improve fluency, and master the conversation strategies needed to succeed.",
    whoTitle: "Who This Is For",
    whoItems: [
      "Public servants who passed Reading and Writing but struggle with Oral",
      "Candidates who need to improve from Level A to B or B to C",
      "Professionals with limited opportunities to practice spoken French",
      "Anyone preparing for an upcoming oral SLE test",
    ],
    whatTitle: "What You Get",
    whatItems: [
      { icon: Mic, text: "Live one-on-one conversation practice sessions" },
      { icon: Video, text: "Video-based mock oral exams with feedback" },
      { icon: Headphones, text: "Audio exercises for listening comprehension" },
      { icon: Users, text: "Certified coaches experienced with SLE format" },
      { icon: Clock, text: "Flexible scheduling including evenings and weekends" },
      { icon: MessageSquare, text: "Detailed feedback on pronunciation and grammar" },
    ],
    proofTitle: "Success Stories",
    testimonials: [
      {
        quote: "I was terrified of the oral exam. After 10 coaching sessions, I felt completely prepared. The mock exams were incredibly realistic.",
        author: "Lisa M., Program Analyst, ISED",
      },
      {
        quote: "My coach identified exactly where I was losing points and gave me specific strategies to improve. I went from A to B in just 3 months.",
        author: "James W., Administrative Officer, GAC",
      },
      {
        quote: "The conversation practice made all the difference. I finally feel comfortable discussing complex topics in French.",
        author: "Patricia K., Policy Advisor, ECCC",
      },
    ],
    faqTitle: "Frequently Asked Questions",
    faqs: [
      {
        q: "What does the SLE oral test involve?",
        a: "The oral test is a 20-30 minute conversation with a certified evaluator. You'll discuss various topics including your work, current events, and hypothetical situations. The evaluator assesses your ability to communicate effectively in your second language.",
      },
      {
        q: "How is the oral test scored?",
        a: "You receive a level (A, B, C, or X) based on criteria including vocabulary range, grammatical accuracy, fluency, and ability to handle complex topics. Level B requires sustained conversation on concrete topics; Level C requires discussing abstract and complex subjects.",
      },
      {
        q: "How many coaching sessions do I need?",
        a: "This depends on your current level and target. Most candidates benefit from 8-15 sessions over 2-3 months. We'll assess your needs in an initial consultation and recommend a personalized plan.",
      },
      {
        q: "Can I practice for specific topics?",
        a: "Absolutely. We cover common SLE topics including work responsibilities, current events, social issues, and hypothetical scenarios. We also practice the specific question types used in the exam.",
      },
      {
        q: "What if I'm very nervous about speaking French?",
        a: "Many of our clients start with speaking anxiety. Our coaches create a supportive environment where you can build confidence gradually. We use proven techniques to reduce anxiety and improve performance.",
      },
      {
        q: "Do you offer group sessions?",
        a: "We primarily offer one-on-one coaching for maximum personalization. However, we can arrange small group sessions (2-3 people) for colleagues preparing together, which can be more cost-effective.",
      },
    ],
    ctaPrimary: "Start Oral Coaching",
    ctaSecondary: "Book a Trial Session",
  },
  fr: {
    seo: {
      title: "Coaching oral ELS | Maîtrisez l'examen oral de français pour le gouvernement fédéral",
      description: "Coaching expert pour le test oral ELS. Pratiquez avec des coachs certifiés, maîtrisez les stratégies de conversation et réussissez votre examen oral de français avec confiance.",
    },
    h1: "Coaching oral ELS",
    intro: "La composante orale est souvent la partie la plus difficile de l'ELS. Notre programme de coaching oral spécialisé vous aide à développer votre confiance, améliorer votre fluidité et maîtriser les stratégies de conversation nécessaires pour réussir.",
    whoTitle: "À qui s'adresse ce programme",
    whoItems: [
      "Fonctionnaires ayant réussi la Lecture et l'Écriture mais qui ont des difficultés à l'Oral",
      "Candidats devant passer du niveau A à B ou de B à C",
      "Professionnels ayant peu d'occasions de pratiquer le français parlé",
      "Toute personne se préparant à un prochain test oral ELS",
    ],
    whatTitle: "Ce que vous obtenez",
    whatItems: [
      { icon: Mic, text: "Séances de pratique de conversation en direct et individuelles" },
      { icon: Video, text: "Examens oraux simulés en vidéo avec rétroaction" },
      { icon: Headphones, text: "Exercices audio pour la compréhension orale" },
      { icon: Users, text: "Coachs certifiés expérimentés avec le format ELS" },
      { icon: Clock, text: "Horaires flexibles incluant soirs et fins de semaine" },
      { icon: MessageSquare, text: "Rétroaction détaillée sur la prononciation et la grammaire" },
    ],
    proofTitle: "Témoignages de réussite",
    testimonials: [
      {
        quote: "J'étais terrifié par l'examen oral. Après 10 séances de coaching, je me sentais complètement préparé. Les examens simulés étaient incroyablement réalistes.",
        author: "Lisa M., Analyste de programme, ISDE",
      },
      {
        quote: "Mon coach a identifié exactement où je perdais des points et m'a donné des stratégies spécifiques pour m'améliorer. Je suis passé de A à B en seulement 3 mois.",
        author: "James W., Agent administratif, AMC",
      },
      {
        quote: "La pratique de conversation a fait toute la différence. Je me sens enfin à l'aise pour discuter de sujets complexes en français.",
        author: "Patricia K., Conseillère en politiques, ECCC",
      },
    ],
    faqTitle: "Questions fréquemment posées",
    faqs: [
      {
        q: "En quoi consiste le test oral ELS?",
        a: "Le test oral est une conversation de 20-30 minutes avec un évaluateur certifié. Vous discuterez de divers sujets incluant votre travail, l'actualité et des situations hypothétiques. L'évaluateur évalue votre capacité à communiquer efficacement dans votre langue seconde.",
      },
      {
        q: "Comment le test oral est-il noté?",
        a: "Vous recevez un niveau (A, B, C ou X) basé sur des critères incluant l'étendue du vocabulaire, la précision grammaticale, la fluidité et la capacité à traiter des sujets complexes. Le niveau B exige une conversation soutenue sur des sujets concrets; le niveau C exige de discuter de sujets abstraits et complexes.",
      },
      {
        q: "De combien de séances de coaching ai-je besoin?",
        a: "Cela dépend de votre niveau actuel et de votre objectif. La plupart des candidats bénéficient de 8 à 15 séances sur 2-3 mois. Nous évaluerons vos besoins lors d'une consultation initiale et recommanderons un plan personnalisé.",
      },
      {
        q: "Puis-je pratiquer des sujets spécifiques?",
        a: "Absolument. Nous couvrons les sujets courants de l'ELS incluant les responsabilités professionnelles, l'actualité, les enjeux sociaux et les scénarios hypothétiques. Nous pratiquons également les types de questions spécifiques utilisés dans l'examen.",
      },
      {
        q: "Et si je suis très nerveux à l'idée de parler français?",
        a: "Beaucoup de nos clients commencent avec de l'anxiété à parler. Nos coachs créent un environnement de soutien où vous pouvez développer votre confiance progressivement. Nous utilisons des techniques éprouvées pour réduire l'anxiété et améliorer la performance.",
      },
      {
        q: "Offrez-vous des séances de groupe?",
        a: "Nous offrons principalement du coaching individuel pour une personnalisation maximale. Cependant, nous pouvons organiser des séances en petits groupes (2-3 personnes) pour des collègues se préparant ensemble, ce qui peut être plus économique.",
      },
    ],
    ctaPrimary: "Commencer le coaching oral",
    ctaSecondary: "Réserver une séance d'essai",
  },
};

export default function SLEOralCoaching() {
  const { language } = useLanguage();
  const t = content[language as keyof typeof content] || content.en;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <SEO
        title={t.seo.title}
        description={t.seo.description}
        canonical={`https://www.rusingacademy.ca/${language}/sle-oral-coaching`}
      />

      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-to-br from-emerald-600 via-teal-700 to-teal-800 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full text-sm font-medium mb-6">
            <Mic className="w-4 h-4" />
            {language === "fr" ? "Coaching spécialisé" : "Specialized Coaching"}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">{t.h1}</h1>
          <p className="text-xl md:text-2xl text-teal-100 max-w-3xl mx-auto">
            {t.intro}
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={`/${language}/coaches`}>
              <Button size="lg" className="bg-white text-teal-700 hover:bg-teal-50 font-semibold px-8">
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
              <div key={index} className="flex items-start gap-3 p-4 bg-teal-50 rounded-lg">
                <CheckCircle className="w-6 h-6 text-teal-600 flex-shrink-0 mt-0.5" />
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
                  <item.icon className="w-12 h-12 text-teal-600 mb-4" />
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
      <section className="py-20 px-4 bg-gradient-to-r from-emerald-600 to-teal-700 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">
            {language === "fr" ? "Prêt à maîtriser l'oral?" : "Ready to Master the Oral Exam?"}
          </h2>
          <p className="text-xl text-teal-100 mb-8">
            {language === "fr"
              ? "Développez votre confiance et votre fluidité avec nos coachs experts."
              : "Build your confidence and fluency with our expert coaches."}
          </p>
          <Link href={`/${language}/coaches`}>
            <Button size="lg" className="bg-white text-teal-700 hover:bg-teal-50 font-semibold px-10 py-6 text-lg">
              {t.ctaPrimary}
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
