import { useLanguage } from "@/contexts/LanguageContext";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CheckCircle, Video, Mic, FileVideo, Users, Globe, Award, Clapperboard, Languages } from "lucide-react";
import { Link } from "wouter";

const content = {
  en: {
    seo: {
      title: "Government Content Production | Bilingual Media Services for Public Sector | Barholex Media",
      description: "Professional bilingual content production for Canadian government departments. Video production, media training, and accessible content creation. GC-compliant and WCAG accessible.",
    },
    h1: "Government Content Production",
    subtitle: "Bilingual Media Services for the Public Sector",
    intro: "Canadian government departments need content that meets the highest standards of accessibility, bilingualism, and professionalism. Barholex Media specializes in creating compelling, compliant media content for federal, provincial, and municipal organizations.",
    whoTitle: "Who We Serve",
    whoItems: [
      "Federal departments and agencies requiring bilingual content",
      "Crown corporations with public communication mandates",
      "Provincial and municipal governments",
      "Language schools and training organizations serving the public sector",
    ],
    whatTitle: "Our Services",
    whatItems: [
      { icon: Video, text: "Professional video production for internal and external communications" },
      { icon: Languages, text: "Bilingual content creation (EN/FR) with native-level quality" },
      { icon: Mic, text: "Media training for executives and spokespersons" },
      { icon: FileVideo, text: "E-learning and training video development" },
      { icon: Globe, text: "WCAG 2.1 AA accessible content production" },
      { icon: Clapperboard, text: "Event coverage and documentary production" },
    ],
    proofTitle: "Trusted by Government Organizations",
    testimonials: [
      {
        quote: "Barholex delivered our bilingual training videos on time and on budget. The quality exceeded our expectations, and the content was fully accessible.",
        author: "Communications Director, Federal Department",
      },
      {
        quote: "Their understanding of government communication requirements saved us countless revision cycles. They got it right the first time.",
        author: "Learning & Development Manager, Crown Corporation",
      },
      {
        quote: "The media training prepared our executives for high-stakes interviews. The bilingual coaching was particularly valuable.",
        author: "Public Affairs Officer, Regulatory Agency",
      },
    ],
    faqTitle: "Frequently Asked Questions",
    faqs: [
      {
        q: "Do you have experience with Government of Canada requirements?",
        a: "Yes. We have extensive experience with GC communication standards, including Official Languages Act compliance, Web Content Accessibility Guidelines (WCAG 2.1 AA), and Federal Identity Program requirements. Our team understands the unique approval processes and quality standards of government work.",
      },
      {
        q: "Can you produce content in both official languages?",
        a: "Absolutely. Bilingual production is our specialty. We create content simultaneously in English and French, ensuring linguistic equivalence and cultural appropriateness for both audiences. All our producers and editors are fully bilingual.",
      },
      {
        q: "What accessibility standards do you follow?",
        a: "We produce all content to WCAG 2.1 AA standards at minimum. This includes closed captions, audio descriptions, transcripts, and accessible video players. We can also meet WCAG 2.1 AAA requirements upon request.",
      },
      {
        q: "Do you offer media training for government executives?",
        a: "Yes. Our media training programs prepare executives and spokespersons for interviews, press conferences, and public appearances. Training is available in English, French, or bilingual formats, with specific modules for crisis communications.",
      },
      {
        q: "What is your typical turnaround time?",
        a: "Turnaround depends on project scope. Simple video projects can be completed in 2-4 weeks. Complex e-learning modules or documentary projects typically require 2-3 months. We always work within your timelines and can accommodate urgent requests.",
      },
      {
        q: "Can you work with our existing procurement processes?",
        a: "Yes. We are familiar with government procurement requirements and can work through standing offers, supply arrangements, or direct contracts. We provide all necessary documentation for your procurement files.",
      },
    ],
    ctaPrimary: "Request a Proposal",
    ctaSecondary: "View Our Portfolio",
  },
  fr: {
    seo: {
      title: "Production de contenu gouvernemental | Services médias bilingues pour le secteur public | Barholex Media",
      description: "Production de contenu bilingue professionnelle pour les ministères canadiens. Production vidéo, formation médiatique et création de contenu accessible. Conforme aux normes GC et WCAG.",
    },
    h1: "Production de contenu gouvernemental",
    subtitle: "Services médias bilingues pour le secteur public",
    intro: "Les ministères du gouvernement canadien ont besoin de contenu répondant aux normes les plus élevées d'accessibilité, de bilinguisme et de professionnalisme. Barholex Media se spécialise dans la création de contenu médiatique convaincant et conforme pour les organisations fédérales, provinciales et municipales.",
    whoTitle: "Qui nous servons",
    whoItems: [
      "Ministères et agences fédéraux nécessitant du contenu bilingue",
      "Sociétés d'État avec mandats de communication publique",
      "Gouvernements provinciaux et municipaux",
      "Écoles de langues et organisations de formation au service du secteur public",
    ],
    whatTitle: "Nos services",
    whatItems: [
      { icon: Video, text: "Production vidéo professionnelle pour communications internes et externes" },
      { icon: Languages, text: "Création de contenu bilingue (EN/FR) de qualité native" },
      { icon: Mic, text: "Formation médiatique pour cadres et porte-parole" },
      { icon: FileVideo, text: "Développement de vidéos d'apprentissage en ligne et de formation" },
      { icon: Globe, text: "Production de contenu accessible WCAG 2.1 AA" },
      { icon: Clapperboard, text: "Couverture d'événements et production documentaire" },
    ],
    proofTitle: "La confiance des organisations gouvernementales",
    testimonials: [
      {
        quote: "Barholex a livré nos vidéos de formation bilingues dans les délais et le budget. La qualité a dépassé nos attentes, et le contenu était entièrement accessible.",
        author: "Directeur des communications, Ministère fédéral",
      },
      {
        quote: "Leur compréhension des exigences de communication gouvernementale nous a épargné d'innombrables cycles de révision. Ils ont réussi du premier coup.",
        author: "Gestionnaire de l'apprentissage et du développement, Société d'État",
      },
      {
        quote: "La formation médiatique a préparé nos cadres pour des entrevues à enjeux élevés. Le coaching bilingue était particulièrement précieux.",
        author: "Agent des affaires publiques, Agence de réglementation",
      },
    ],
    faqTitle: "Questions fréquemment posées",
    faqs: [
      {
        q: "Avez-vous de l'expérience avec les exigences du gouvernement du Canada?",
        a: "Oui. Nous avons une vaste expérience des normes de communication du GC, incluant la conformité à la Loi sur les langues officielles, les Règles pour l'accessibilité des contenus Web (WCAG 2.1 AA) et les exigences du Programme de coordination de l'image de marque. Notre équipe comprend les processus d'approbation uniques et les normes de qualité du travail gouvernemental.",
      },
      {
        q: "Pouvez-vous produire du contenu dans les deux langues officielles?",
        a: "Absolument. La production bilingue est notre spécialité. Nous créons du contenu simultanément en anglais et en français, assurant l'équivalence linguistique et l'appropriation culturelle pour les deux publics. Tous nos producteurs et monteurs sont entièrement bilingues.",
      },
      {
        q: "Quelles normes d'accessibilité suivez-vous?",
        a: "Nous produisons tout le contenu selon les normes WCAG 2.1 AA au minimum. Cela inclut les sous-titres codés, les descriptions audio, les transcriptions et les lecteurs vidéo accessibles. Nous pouvons également respecter les exigences WCAG 2.1 AAA sur demande.",
      },
      {
        q: "Offrez-vous de la formation médiatique pour les cadres gouvernementaux?",
        a: "Oui. Nos programmes de formation médiatique préparent les cadres et porte-parole pour les entrevues, conférences de presse et apparitions publiques. La formation est disponible en anglais, français ou format bilingue, avec des modules spécifiques pour les communications de crise.",
      },
      {
        q: "Quel est votre délai de livraison typique?",
        a: "Le délai dépend de la portée du projet. Les projets vidéo simples peuvent être complétés en 2-4 semaines. Les modules d'apprentissage en ligne complexes ou les projets documentaires nécessitent généralement 2-3 mois. Nous travaillons toujours selon vos échéanciers et pouvons accommoder les demandes urgentes.",
      },
      {
        q: "Pouvez-vous travailler avec nos processus d'approvisionnement existants?",
        a: "Oui. Nous connaissons les exigences d'approvisionnement gouvernemental et pouvons travailler par le biais d'offres à commandes, d'arrangements en matière d'approvisionnement ou de contrats directs. Nous fournissons toute la documentation nécessaire pour vos dossiers d'approvisionnement.",
      },
    ],
    ctaPrimary: "Demander une proposition",
    ctaSecondary: "Voir notre portfolio",
  },
};

export default function BarholexMediaProduction() {
  const { language } = useLanguage();
  const t = content[language as keyof typeof content] || content.en;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <SEO
        title={t.seo.title}
        description={t.seo.description}
        canonical={`https://www.rusingacademy.ca/${language}/barholex/media-production`}
      />

      {/* Hero Section - Professional Government Theme */}
      <section className="relative py-24 px-4 bg-gradient-to-br from-slate-800 via-red-900 to-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAzMHYySDI0di0yaDEyek0zNiAyNnYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-50"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/20 border border-red-500/30 rounded-full text-red-300 text-sm font-medium mb-6">
            <Video className="w-4 h-4" />
            {language === "fr" ? "Services professionnels" : "Professional Services"}
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
              <Button size="lg" className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold px-8 py-6 text-lg">
                {t.ctaPrimary}
              </Button>
            </Link>
            <Link href={`/${language}/barholex`}>
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
              <div key={index} className="flex items-start gap-3 p-5 bg-slate-50 rounded-xl border border-slate-100">
                <CheckCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                <span className="text-slate-700 font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 px-4 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-slate-800">{t.whatTitle}</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {t.whatItems.map((item, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white">
                <CardContent className="p-8 flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-100 to-red-200 flex items-center justify-center mb-5">
                    <item.icon className="w-8 h-8 text-red-700" />
                  </div>
                  <p className="text-slate-700 font-medium">{item.text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 bg-slate-800 text-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">{t.proofTitle}</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {t.testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 bg-slate-700/50 backdrop-blur">
                <CardContent className="p-6">
                  <p className="text-slate-300 italic mb-4">"{testimonial.quote}"</p>
                  <p className="text-sm font-semibold text-red-400">— {testimonial.author}</p>
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
      <section className="py-24 px-4 bg-gradient-to-r from-slate-800 via-red-900 to-slate-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <Award className="w-12 h-12 text-red-400 mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-6">
            {language === "fr" ? "Prêt à créer du contenu de qualité gouvernementale?" : "Ready to Create Government-Quality Content?"}
          </h2>
          <p className="text-xl text-slate-400 mb-10">
            {language === "fr"
              ? "Contactez-nous pour discuter de votre prochain projet de production média."
              : "Contact us to discuss your next media production project."}
          </p>
          <Link href={`/${language}/contact`}>
            <Button size="lg" className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold px-12 py-6 text-lg">
              {t.ctaPrimary}
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
