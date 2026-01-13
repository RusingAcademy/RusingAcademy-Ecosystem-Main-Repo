import { useLanguage } from "@/contexts/LanguageContext";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CheckCircle, Laptop, Users, BarChart3, Shield, Gamepad2, BookOpen, Building2, Award } from "lucide-react";
import { Link } from "wouter";

const content = {
  en: {
    seo: {
      title: "EdTech Services for Government | LMS & Language Training Solutions | RusingAcademy",
      description: "Enterprise EdTech solutions for Canadian government departments. Custom LMS platforms, gamified SLE training, progress tracking, and federal compliance. Transform your language training program.",
    },
    h1: "EdTech Services for Government",
    subtitle: "Enterprise Language Training Solutions",
    intro: "Transform your organization's language training with our enterprise EdTech platform. RusingAcademy provides custom LMS solutions, gamified learning experiences, and comprehensive analytics designed specifically for Canadian government departments and large organizations.",
    whoTitle: "Who We Serve",
    whoItems: [
      "Federal departments with large-scale language training needs",
      "HR and Learning & Development directors",
      "Language training coordinators and program managers",
      "Crown corporations and provincial governments",
    ],
    whatTitle: "Our Solutions",
    whatItems: [
      { icon: Laptop, text: "Custom LMS platform tailored to your organization's needs" },
      { icon: Gamepad2, text: "Gamified SLE preparation with engagement analytics" },
      { icon: BarChart3, text: "Real-time progress tracking and reporting dashboards" },
      { icon: Shield, text: "Federal security and accessibility compliance (WCAG, GC standards)" },
      { icon: Users, text: "Scalable solutions for 50 to 50,000+ learners" },
      { icon: BookOpen, text: "Curated content library aligned with PSC SLE standards" },
    ],
    proofTitle: "Trusted by Government Organizations",
    testimonials: [
      {
        quote: "RusingAcademy transformed our language training program. We went from 40% SLE pass rates to over 75% in just one year. The analytics helped us identify struggling learners early.",
        author: "Director of Learning, Federal Department (5,000+ employees)",
      },
      {
        quote: "The gamification features increased learner engagement dramatically. Our employees actually look forward to their language training now.",
        author: "HR Director, Crown Corporation",
      },
      {
        quote: "Implementation was seamless. The platform integrated with our existing HR systems and met all our security requirements.",
        author: "CIO, Regulatory Agency",
      },
    ],
    faqTitle: "Frequently Asked Questions",
    faqs: [
      {
        q: "How does your platform differ from generic LMS solutions?",
        a: "Our platform is purpose-built for Canadian government language training. It includes SLE-specific content, PSC-aligned assessments, bilingual interfaces, and features designed for the unique requirements of federal language training programs. Generic LMS platforms require extensive customization to achieve what we offer out of the box.",
      },
      {
        q: "Can the platform integrate with our existing HR systems?",
        a: "Yes. We support integration with common government HR systems including PeopleSoft, SAP, and custom solutions. We can sync learner data, track completions, and report results directly to your HR systems.",
      },
      {
        q: "What security certifications do you have?",
        a: "Our platform meets Protected B security requirements and is hosted in Canadian data centers. We comply with all Government of Canada IT security standards and undergo regular security assessments.",
      },
      {
        q: "How does the gamification work?",
        a: "Learners earn points, badges, and achievements as they progress through training. Leaderboards create friendly competition, while personalized learning paths adapt to each learner's pace. Our gamification increases completion rates by an average of 60%.",
      },
      {
        q: "What kind of analytics and reporting do you provide?",
        a: "Our dashboards provide real-time visibility into learner progress, predicted SLE outcomes, engagement metrics, and program ROI. Managers can identify at-risk learners, track cohort performance, and generate compliance reports.",
      },
      {
        q: "How long does implementation take?",
        a: "A standard implementation takes 8-12 weeks, including configuration, content migration, integration, and training. We can accelerate timelines for urgent needs. Our team handles all technical aspects while your team focuses on change management.",
      },
    ],
    ctaPrimary: "Request a Demo",
    ctaSecondary: "Download Case Study",
  },
  fr: {
    seo: {
      title: "Services EdTech pour le gouvernement | Solutions LMS et formation linguistique | RusingAcademy",
      description: "Solutions EdTech d'entreprise pour les ministères canadiens. Plateformes LMS personnalisées, formation ELS gamifiée, suivi des progrès et conformité fédérale. Transformez votre programme de formation linguistique.",
    },
    h1: "Services EdTech pour le gouvernement",
    subtitle: "Solutions de formation linguistique d'entreprise",
    intro: "Transformez la formation linguistique de votre organisation avec notre plateforme EdTech d'entreprise. RusingAcademy offre des solutions LMS personnalisées, des expériences d'apprentissage gamifiées et des analyses complètes conçues spécifiquement pour les ministères du gouvernement canadien et les grandes organisations.",
    whoTitle: "Qui nous servons",
    whoItems: [
      "Ministères fédéraux avec des besoins de formation linguistique à grande échelle",
      "Directeurs RH et de l'apprentissage et du développement",
      "Coordonnateurs de formation linguistique et gestionnaires de programmes",
      "Sociétés d'État et gouvernements provinciaux",
    ],
    whatTitle: "Nos solutions",
    whatItems: [
      { icon: Laptop, text: "Plateforme LMS personnalisée adaptée aux besoins de votre organisation" },
      { icon: Gamepad2, text: "Préparation ELS gamifiée avec analyses d'engagement" },
      { icon: BarChart3, text: "Suivi des progrès en temps réel et tableaux de bord de rapports" },
      { icon: Shield, text: "Conformité aux normes fédérales de sécurité et d'accessibilité (WCAG, normes GC)" },
      { icon: Users, text: "Solutions évolutives pour 50 à 50 000+ apprenants" },
      { icon: BookOpen, text: "Bibliothèque de contenu alignée sur les normes ELS de la CFP" },
    ],
    proofTitle: "La confiance des organisations gouvernementales",
    testimonials: [
      {
        quote: "RusingAcademy a transformé notre programme de formation linguistique. Nous sommes passés de 40% de taux de réussite ELS à plus de 75% en seulement un an. Les analyses nous ont aidés à identifier les apprenants en difficulté tôt.",
        author: "Directeur de l'apprentissage, Ministère fédéral (5 000+ employés)",
      },
      {
        quote: "Les fonctionnalités de gamification ont augmenté l'engagement des apprenants de façon spectaculaire. Nos employés ont maintenant hâte à leur formation linguistique.",
        author: "Directeur RH, Société d'État",
      },
      {
        quote: "L'implémentation a été transparente. La plateforme s'est intégrée à nos systèmes RH existants et a répondu à toutes nos exigences de sécurité.",
        author: "DPI, Agence de réglementation",
      },
    ],
    faqTitle: "Questions fréquemment posées",
    faqs: [
      {
        q: "En quoi votre plateforme diffère-t-elle des solutions LMS génériques?",
        a: "Notre plateforme est conçue spécifiquement pour la formation linguistique du gouvernement canadien. Elle inclut du contenu spécifique à l'ELS, des évaluations alignées sur la CFP, des interfaces bilingues et des fonctionnalités conçues pour les exigences uniques des programmes de formation linguistique fédéraux. Les plateformes LMS génériques nécessitent une personnalisation extensive pour atteindre ce que nous offrons d'emblée.",
      },
      {
        q: "La plateforme peut-elle s'intégrer à nos systèmes RH existants?",
        a: "Oui. Nous supportons l'intégration avec les systèmes RH gouvernementaux courants incluant PeopleSoft, SAP et les solutions personnalisées. Nous pouvons synchroniser les données des apprenants, suivre les complétions et rapporter les résultats directement à vos systèmes RH.",
      },
      {
        q: "Quelles certifications de sécurité avez-vous?",
        a: "Notre plateforme répond aux exigences de sécurité Protégé B et est hébergée dans des centres de données canadiens. Nous respectons toutes les normes de sécurité TI du gouvernement du Canada et subissons des évaluations de sécurité régulières.",
      },
      {
        q: "Comment fonctionne la gamification?",
        a: "Les apprenants gagnent des points, des badges et des réalisations au fur et à mesure de leur progression. Les classements créent une compétition amicale, tandis que les parcours d'apprentissage personnalisés s'adaptent au rythme de chaque apprenant. Notre gamification augmente les taux de complétion de 60% en moyenne.",
      },
      {
        q: "Quel type d'analyses et de rapports fournissez-vous?",
        a: "Nos tableaux de bord offrent une visibilité en temps réel sur les progrès des apprenants, les résultats ELS prédits, les métriques d'engagement et le ROI du programme. Les gestionnaires peuvent identifier les apprenants à risque, suivre la performance des cohortes et générer des rapports de conformité.",
      },
      {
        q: "Combien de temps prend l'implémentation?",
        a: "Une implémentation standard prend 8-12 semaines, incluant la configuration, la migration de contenu, l'intégration et la formation. Nous pouvons accélérer les délais pour les besoins urgents. Notre équipe gère tous les aspects techniques pendant que votre équipe se concentre sur la gestion du changement.",
      },
    ],
    ctaPrimary: "Demander une démo",
    ctaSecondary: "Télécharger l'étude de cas",
  },
};

export default function RusingAcademyEdTechServices() {
  const { language } = useLanguage();
  const t = content[language as keyof typeof content] || content.en;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <SEO
        title={t.seo.title}
        description={t.seo.description}
        canonical={`https://www.rusingacademy.ca/${language}/rusingacademy/edtech-services`}
      />

      {/* Hero Section - Enterprise B2B Theme */}
      <section className="relative py-24 px-4 bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAzMHYySDI0di0yaDEyek0zNiAyNnYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-50"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 border border-blue-500/30 rounded-full text-blue-300 text-sm font-medium mb-6">
            <Building2 className="w-4 h-4" />
            {language === "fr" ? "Solutions d'entreprise" : "Enterprise Solutions"}
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            {t.h1}
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 mb-6">{t.subtitle}</p>
          <p className="text-lg text-slate-400 max-w-3xl mx-auto mb-10">
            {t.intro}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={`/${language}/contact`}>
              <Button size="lg" className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold px-8 py-6 text-lg">
                {t.ctaPrimary}
              </Button>
            </Link>
            <Link href={`/${language}/rusingacademy`}>
              <Button size="lg" variant="outline" className="border-slate-500 text-slate-300 hover:bg-slate-800 px-8 py-6 text-lg">
                {t.ctaSecondary}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Who We Serve */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-slate-800">{t.whoTitle}</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {t.whoItems.map((item, index) => (
              <div key={index} className="flex items-start gap-3 p-5 bg-blue-50 rounded-xl border border-blue-100">
                <CheckCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
                <span className="text-slate-700 font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solutions */}
      <section className="py-20 px-4 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-slate-800">{t.whatTitle}</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {t.whatItems.map((item, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white">
                <CardContent className="p-8 flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-100 to-indigo-200 flex items-center justify-center mb-5">
                    <item.icon className="w-8 h-8 text-blue-700" />
                  </div>
                  <p className="text-slate-700 font-medium">{item.text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 bg-blue-900 text-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">{t.proofTitle}</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {t.testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 bg-blue-800/50 backdrop-blur">
                <CardContent className="p-6">
                  <p className="text-blue-100 italic mb-4">"{testimonial.quote}"</p>
                  <p className="text-sm font-semibold text-blue-300">— {testimonial.author}</p>
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
      <section className="py-24 px-4 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <Award className="w-12 h-12 text-blue-400 mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-6">
            {language === "fr" ? "Prêt à transformer votre formation linguistique?" : "Ready to Transform Your Language Training?"}
          </h2>
          <p className="text-xl text-slate-400 mb-10">
            {language === "fr"
              ? "Découvrez comment notre plateforme peut améliorer les résultats de votre organisation."
              : "Discover how our platform can improve your organization's outcomes."}
          </p>
          <Link href={`/${language}/contact`}>
            <Button size="lg" className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold px-12 py-6 text-lg">
              {t.ctaPrimary}
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
